/**
 * /api/championship/join — Join the championship + get season config.
 * GET: returns current season config + user's championship profile
 * POST action=join: join current season with consent
 * POST action=leaderboard: get top 10 + school leaderboard
 */
import { Redis } from '@upstash/redis';
import { notify } from '../../../utils/notify';

const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

const DEFAULT_CONFIG = {
  season: 1,
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
  status: 'active',
  prize1: 'Meta Ray-Ban Gen 2',
  prize2: 'AirPods',
  prize3: 'Rs 5,000 Mobile Credit',
  targetReferrals: 100,
};

async function getConfig() {
  let config = await kv.get('championship:config');
  if (!config) {
    await kv.set('championship:config', JSON.stringify(DEFAULT_CONFIG));
    notify({ to: 'khurrambadar@gmail.com', subject: '🏆 Championship auto-initialised', title: 'Championship Started', body: 'Championship config was missing. Auto-initialised with Season 1 defaults. No action needed.' }).catch(() => {});
    return DEFAULT_CONFIG;
  }
  return typeof config === 'string' ? JSON.parse(config) : config;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { email } = req.query;
    const config = await getConfig();
    const daysLeft = Math.max(0, Math.ceil((new Date(config.endDate) - Date.now()) / 86400000));

    let profile = null;
    if (email) {
      const points = parseInt(await kv.get(`championship:points:${email}`) || '0');
      const consent = await kv.get(`championship:consent:${email}`);
      const school = await kv.get(`championship:userschool:${email}`);
      profile = { points, joined: !!consent, school: school || '' };
    }

    // Get top 10 leaderboard
    const allKeys = await kv.keys('championship:points:*');
    const entries = [];
    for (const key of allKeys) {
      const em = key.replace('championship:points:', '');
      const pts = parseInt(await kv.get(key) || '0');
      if (pts <= 0) continue;
      const name = await kv.get(`championship:name:${em}`) || em.split('@')[0];
      const sch = await kv.get(`championship:userschool:${em}`) || 'Independent Student';
      entries.push({ email: em, name, school: sch, points: pts });
    }
    entries.sort((a, b) => b.points - a.points);
    const leaderboard = entries.slice(0, 10).map((e, i) => ({ rank: i + 1, name: e.name, school: e.school, points: e.points }));

    // School leaderboard
    const schoolMap = {};
    entries.forEach(e => {
      const s = e.school || 'Independent Student';
      schoolMap[s] = (schoolMap[s] || 0) + e.points;
    });
    const schoolBoard = Object.entries(schoolMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, points], i) => ({ rank: i + 1, name, points }));

    return res.status(200).json({
      config: { ...config, daysLeft },
      profile,
      leaderboard,
      schoolBoard,
      participantCount: allKeys.length,
    });
  }

  if (req.method === 'POST') {
    const { action, email, name, school, dob, parentEmail, termsVersion } = req.body;

    if (action === 'join') {
      if (!email || !name) return res.status(400).json({ error: 'email and name required' });
      const config = await getConfig();
      if (config.status !== 'active') return res.status(400).json({ error: 'Championship is not currently active' });

      // Check if already joined
      const existing = await kv.get(`championship:consent:${email}`);
      if (existing) return res.status(200).json({ ok: true, alreadyJoined: true });

      // Store consent
      await kv.set(`championship:consent:${email}`, JSON.stringify({
        timestamp: new Date().toISOString(),
        termsVersion: termsVersion || '1.0',
        dob: dob || null,
        parentEmail: parentEmail || null,
      }));

      // Store name and school
      await kv.set(`championship:name:${email}`, name.split(' ')[0]);
      if (school?.trim()) {
        const normalized = school.trim().toLowerCase().replace(/[^\w\s]/g, '');
        await kv.set(`championship:userschool:${email}`, school.trim());
        // Increment school points
        const schoolPts = parseInt(await kv.get(`championship:school:${normalized}`) || '0');
        await kv.set(`championship:school:${normalized}`, schoolPts);
      }

      // Initialise points
      await kv.set(`championship:points:${email}`, 0);

      // Under 13 — send parent consent email
      if (dob) {
        const age = Math.floor((Date.now() - new Date(dob)) / (365.25 * 86400000));
        if (age < 13 && parentEmail) {
          notify({
            to: parentEmail,
            subject: '📋 Parent Consent Required — NewWorld Championship',
            title: 'Your child wants to join the NewWorld Championship',
            body: `<strong>${name}</strong> wants to participate in the NewWorld Championship — a free referral competition where students can win prizes by sharing NewWorldEdu with friends.<br><br>As they are under 13, we need your consent. Please click the button below to approve.`,
            ctaText: 'Approve Participation →',
            ctaUrl: `https://www.newworld.education/api/championship/join?approve=${encodeURIComponent(email)}`,
          }).catch(() => {});
          await kv.set(`championship:parentconsent:${email}`, 'pending');
        }
      }

      // Log audit
      await kv.lpush(`championship:audit:${email}`, JSON.stringify({
        event: 'joined', timestamp: new Date().toISOString(), details: { termsVersion, school },
      }));

      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Invalid action' });
  }

  // Parent consent approval via GET link
  if (req.method === 'GET' && req.query.approve) {
    await kv.set(`championship:parentconsent:${req.query.approve}`, 'approved');
    return res.status(200).send('<html><body style="font-family:sans-serif;text-align:center;padding:60px"><h1>✅ Consent Approved</h1><p>Your child can now participate in the NewWorld Championship.</p></body></html>');
  }

  return res.status(405).end();
}
