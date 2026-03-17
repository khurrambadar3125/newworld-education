/**
 * /api/championship/dispute
 * POST: student submits dispute for a specific referral — auto-rechecks validity
 * GET: get dispute history for email
 */
import { Redis } from '@upstash/redis';
import { notify } from '../../../utils/notify';

const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'email required' });

    // Get all disputes for this email
    const keys = await kv.keys(`championship:dispute:${email}:*`);
    const disputes = [];
    for (const key of keys) {
      const data = await kv.get(key);
      if (data) {
        disputes.push(typeof data === 'string' ? JSON.parse(data) : data);
      }
    }
    disputes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return res.status(200).json({ disputes });
  }

  if (req.method === 'POST') {
    const { email, referredEmail } = req.body;
    if (!email || !referredEmail) return res.status(400).json({ error: 'email and referredEmail required' });

    const timestamp = new Date().toISOString();
    const dispute = {
      email,
      referredEmail,
      timestamp,
      status: 'checking',
      checks: {},
    };

    // Auto-recheck: was referred person active 7 days with 3 sessions?
    const referralFrom = await kv.get(`referral:from:${referredEmail}`);
    if (!referralFrom || (typeof referralFrom === 'string' ? referralFrom : referralFrom) !== email) {
      dispute.status = 'rejected';
      dispute.reason = `${referredEmail} was not referred by you. Our records show a different referrer or no referral link was used.`;
      dispute.checks.referralLink = false;
    } else {
      // Check signup date (7 days)
      const signupDate = await kv.get(`referral:signup:${referredEmail}`);
      const daysSinceSignup = signupDate ? (Date.now() - new Date(signupDate)) / 86400000 : 0;
      dispute.checks.signupDate = signupDate || null;
      dispute.checks.daysSinceSignup = Math.round(daysSinceSignup * 10) / 10;
      dispute.checks.has7Days = daysSinceSignup >= 7;

      // Check sessions (3 sessions)
      let totalSessions = 0;
      try {
        const memory = await kv.get(`memory:${referredEmail}`);
        const memObj = memory ? (typeof memory === 'string' ? JSON.parse(memory) : memory) : {};
        totalSessions = memObj.totalSessions || 0;
      } catch {}
      dispute.checks.totalSessions = totalSessions;
      dispute.checks.has3Sessions = totalSessions >= 3;

      if (dispute.checks.has7Days && dispute.checks.has3Sessions) {
        // Auto-validate: this referral qualifies
        dispute.status = 'validated';
        dispute.reason = 'Referral verified. Both conditions met. Points awarded.';

        // Award the point if not already counted
        const alreadyCounted = await kv.get(`referral:counted:${referredEmail}`);
        if (!alreadyCounted) {
          // Trigger the referral check
          const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.newworld.education';
          try {
            await fetch(`${base}/api/referral`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'check', email: referredEmail }),
            });
          } catch {}

          // Also increment championship points
          const currentPts = parseInt(await kv.get(`championship:points:${email}`) || '0');
          await kv.set(`championship:points:${email}`, currentPts + 1);
        }

        // Email student
        notify({
          to: email,
          subject: 'Dispute resolved — referral validated!',
          title: 'Dispute Resolved',
          body: `Good news! Your referral of <strong>${referredEmail}</strong> has been verified and your point has been awarded.<br><br><strong>Checks passed:</strong><br>- Signed up ${dispute.checks.daysSinceSignup} days ago (need 7)<br>- Completed ${totalSessions} sessions (need 3)`,
          ctaText: 'View Championship',
          ctaUrl: 'https://www.newworld.education/championship',
        }).catch(() => {});
      } else {
        // Not yet qualifying
        dispute.status = 'pending';
        const reasons = [];
        if (!dispute.checks.has7Days) {
          const daysNeeded = Math.ceil(7 - daysSinceSignup);
          reasons.push(`They signed up ${dispute.checks.daysSinceSignup} days ago. They need to be registered for at least 7 days (${daysNeeded} more day${daysNeeded === 1 ? '' : 's'}).`);
        }
        if (!dispute.checks.has3Sessions) {
          const sessionsNeeded = 3 - totalSessions;
          reasons.push(`They have completed ${totalSessions} session${totalSessions === 1 ? '' : 's'}. They need at least 3 sessions (${sessionsNeeded} more).`);
        }
        dispute.reason = reasons.join(' ');

        // Email student with specific reason
        notify({
          to: email,
          subject: 'Dispute update — referral not yet qualifying',
          title: 'Dispute Update',
          body: `We checked your referral of <strong>${referredEmail}</strong> and it does not yet qualify.<br><br><strong>Why:</strong><br>${reasons.map(r => `- ${r}`).join('<br>')}<br><br>Once both conditions are met, the referral will auto-validate and you will receive your point. No further action needed from you.`,
        }).catch(() => {});
      }
    }

    // Store dispute
    const ts = Date.now();
    await kv.set(`championship:dispute:${email}:${ts}`, JSON.stringify(dispute));

    // Audit
    await kv.lpush(`championship:audit:${email}`, JSON.stringify({
      event: 'dispute_filed', timestamp, details: { referredEmail, status: dispute.status },
    }));

    return res.status(200).json(dispute);
  }

  return res.status(405).end();
}
