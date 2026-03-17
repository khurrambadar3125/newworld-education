/**
 * /api/referral — Complete referral system API.
 *
 * GET ?action=profile&email=X — get user's referral profile (code, tier, count, rewards)
 * GET ?action=validate&code=X — validate a referral code and return referrer info
 * POST action=register — generate referral code for new user
 * POST action=link — link a new signup to their referrer
 * POST action=check — check if a referred user qualifies (7 days + 3 sessions)
 * POST action=admin — admin list of all referrers (password protected)
 * POST action=override — admin add free months manually
 */
import { Redis } from '@upstash/redis';
import { notify } from '../../utils/notify';

const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

const TIERS = [
  { min: 1,  name: 'Star',       badge: '⭐', label: 'Star Referrer',    freeMonths: 1,  unlimited: false },
  { min: 5,  name: 'Champion',   badge: '🏆', label: 'School Champion',  freeMonths: 3,  unlimited: false },
  { min: 10, name: 'Ambassador', badge: '🚀', label: 'City Ambassador',  freeMonths: 6,  unlimited: true },
  { min: 25, name: 'Legend',     badge: '👑', label: 'NewWorld Legend',   freeMonths: 12, unlimited: true },
];

function getTier(count) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (count >= TIERS[i].min) return TIERS[i];
  }
  return null;
}

function generateCode(email) {
  const base = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${base}${rand}`.toLowerCase();
}

export default async function handler(req, res) {
  // ── GET endpoints ──
  if (req.method === 'GET') {
    const { action, email, code } = req.query;

    if (action === 'profile' && email) {
      const refCode = await kv.get(`referral:code:${email}`) || '';
      const count = parseInt(await kv.get(`referral:count:${email}`) || '0');
      const freeMonths = parseFloat(await kv.get(`referral:freemonths:${email}`) || '0');
      const tier = getTier(count);
      const mentioned = await kv.get(`referral:mentioned:${email}`);
      return res.status(200).json({ code: refCode, count, freeMonths, tier, mentioned: !!mentioned, tiers: TIERS });
    }

    if (action === 'validate' && code) {
      // Find which email owns this code
      const keys = await kv.keys('referral:code:*');
      for (const key of keys) {
        const val = await kv.get(key);
        if (val === code) {
          const referrerEmail = key.replace('referral:code:', '');
          return res.status(200).json({ valid: true, referrerEmail });
        }
      }
      return res.status(200).json({ valid: false });
    }

    return res.status(400).json({ error: 'Invalid action' });
  }

  // ── POST endpoints ──
  if (req.method === 'POST') {
    const { action, email, code, password, targetEmail, months } = req.body;

    // Register — generate referral code
    if (action === 'register' && email) {
      const existing = await kv.get(`referral:code:${email}`);
      if (existing) return res.status(200).json({ code: existing });
      const newCode = generateCode(email);
      await kv.set(`referral:code:${email}`, newCode);
      await kv.set(`referral:count:${email}`, 0);
      return res.status(200).json({ code: newCode });
    }

    // Link — connect referred user to referrer
    if (action === 'link' && email && code) {
      // Don't allow self-referral
      const referrerEmail = await findEmailByCode(code);
      if (!referrerEmail || referrerEmail === email) return res.status(200).json({ linked: false });
      // Don't double-link
      const existing = await kv.get(`referral:from:${email}`);
      if (existing) return res.status(200).json({ linked: false, reason: 'already linked' });
      await kv.set(`referral:from:${email}`, referrerEmail);
      await kv.set(`referral:signup:${email}`, new Date().toISOString());
      return res.status(200).json({ linked: true, referrer: referrerEmail });
    }

    // Check — validate a referral (7 days + 3 sessions)
    if (action === 'check' && email) {
      const referrer = await kv.get(`referral:from:${email}`);
      if (!referrer) return res.status(200).json({ qualified: false, reason: 'no referrer' });
      const alreadyCounted = await kv.get(`referral:counted:${email}`);
      if (alreadyCounted) return res.status(200).json({ qualified: false, reason: 'already counted' });

      const signupDate = await kv.get(`referral:signup:${email}`);
      if (!signupDate) return res.status(200).json({ qualified: false, reason: 'no signup date' });
      const daysSince = (Date.now() - new Date(signupDate)) / 86400000;
      if (daysSince < 7) return res.status(200).json({ qualified: false, reason: 'too soon', daysLeft: Math.ceil(7 - daysSince) });

      // Check sessions (from student memory)
      const memory = await kv.get(`memory:${email}`);
      const memObj = memory ? (typeof memory === 'string' ? JSON.parse(memory) : memory) : {};
      if ((memObj.totalSessions || 0) < 3) return res.status(200).json({ qualified: false, reason: 'not enough sessions', sessions: memObj.totalSessions || 0 });

      // Qualified! Increment referrer count
      await kv.set(`referral:counted:${email}`, 'true');
      const newCount = await kv.incr(`referral:count:${referrer}`);

      // Check tier upgrade
      const oldTier = getTier(newCount - 1);
      const newTier = getTier(newCount);

      if (newTier && (!oldTier || newTier.name !== oldTier.name)) {
        // Tier upgrade! Apply rewards
        const currentFree = parseFloat(await kv.get(`referral:freemonths:${referrer}`) || '0');
        await kv.set(`referral:freemonths:${referrer}`, currentFree + newTier.freeMonths);
        if (newTier.unlimited) {
          await kv.set(`referral:unlimited:${referrer}`, 'true');
        }
        // Email tier upgrade
        notify({
          to: referrer,
          subject: `${newTier.badge} Congratulations! You're now a NewWorld ${newTier.name}!`,
          title: `You're a ${newTier.name}!`,
          body: `You've referred <strong>${newCount} students</strong> to NewWorldEdu!<br><br>
            <strong>Your reward:</strong> ${newTier.freeMonths} free months have been added to your account automatically.
            ${newTier.unlimited ? '<br><strong>Bonus:</strong> Your session limits have been permanently removed!' : ''}`,
          ctaText: 'View My Referrals',
          ctaUrl: 'https://www.newworld.education/referral',
        }).catch(() => {});
      } else {
        // Just a new referral, no tier change
        notify({
          to: referrer,
          subject: `✅ Your referral was confirmed! You now have ${newCount} referrals.`,
          title: 'Referral Confirmed!',
          body: `A student you referred has been active for 7 days. You now have <strong>${newCount} referrals</strong>.${newTier ? ` You are a <strong>${newTier.badge} ${newTier.name}</strong>.` : ''}`,
          ctaText: 'View My Referrals',
          ctaUrl: 'https://www.newworld.education/referral',
        }).catch(() => {});
      }

      return res.status(200).json({ qualified: true, newCount, tier: newTier });
    }

    // Mark referral as mentioned by Starky
    if (action === 'mentioned' && email) {
      await kv.set(`referral:mentioned:${email}`, 'true');
      return res.status(200).json({ ok: true });
    }

    // Admin — list all referrers
    if (action === 'admin') {
      if (password !== process.env.DASHBOARD_ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
      const keys = await kv.keys('referral:count:*');
      const referrers = [];
      for (const key of keys) {
        const email = key.replace('referral:count:', '');
        const count = parseInt(await kv.get(key) || '0');
        const freeMonths = parseFloat(await kv.get(`referral:freemonths:${email}`) || '0');
        const unlimited = await kv.get(`referral:unlimited:${email}`);
        const code = await kv.get(`referral:code:${email}`);
        const tier = getTier(count);
        referrers.push({ email, count, freeMonths, unlimited: !!unlimited, code, tier });
      }
      referrers.sort((a, b) => b.count - a.count);
      const thisWeek = referrers.filter(r => r.count > 0).length; // simplified
      return res.status(200).json({ referrers, total: referrers.reduce((a, r) => a + r.count, 0), thisWeek });
    }

    // Admin override — add free months
    if (action === 'override') {
      if (password !== process.env.DASHBOARD_ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
      if (!targetEmail || !months) return res.status(400).json({ error: 'targetEmail and months required' });
      const current = parseFloat(await kv.get(`referral:freemonths:${targetEmail}`) || '0');
      await kv.set(`referral:freemonths:${targetEmail}`, current + parseFloat(months));
      return res.status(200).json({ ok: true, newTotal: current + parseFloat(months) });
    }

    return res.status(400).json({ error: 'Invalid action' });
  }

  return res.status(405).end();
}

async function findEmailByCode(code) {
  const keys = await kv.keys('referral:code:*');
  for (const key of keys) {
    const val = await kv.get(key);
    if (val === code) return key.replace('referral:code:', '');
  }
  return null;
}
