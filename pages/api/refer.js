/**
 * pages/api/refer.js — Referral tracking
 * ─────────────────────────────────────────────────────────────────
 * POST { referrerEmail, friendEmail } — record a referral
 * GET ?email=x — get referral count for a user
 *
 * Reward: 3 referrals = 1 month free premium (tracked in KV)
 */

export default async function handler(req, res) {
  try {
    const { kv } = await import('@vercel/kv');

    if (req.method === 'GET') {
      const email = req.query.email;
      if (!email) return res.status(400).json({ error: 'email required' });
      const count = await kv.get(`referrals:${email.toLowerCase()}`) || 0;
      const rewardEarned = count >= 3;
      return res.status(200).json({ email, referralCount: count, rewardEarned, nextReward: Math.max(0, 3 - count) });
    }

    if (req.method === 'POST') {
      const { referrerEmail, friendEmail } = req.body;
      if (!referrerEmail || !friendEmail) return res.status(400).json({ error: 'Both emails required' });

      const rKey = `referrals:${referrerEmail.toLowerCase()}`;
      const fKey = `referred_by:${friendEmail.toLowerCase()}`;

      // Check if friend already referred
      const existing = await kv.get(fKey);
      if (existing) return res.status(200).json({ status: 'already_referred', referralCount: await kv.get(rKey) || 0 });

      // Record referral
      await kv.set(fKey, referrerEmail.toLowerCase());
      const newCount = await kv.incr(rKey);

      // Check if reward earned
      const rewardEarned = newCount >= 3 && (newCount - 1) < 3;
      if (rewardEarned) {
        await kv.set(`reward:${referrerEmail.toLowerCase()}`, JSON.stringify({ type: 'free_month', earnedAt: new Date().toISOString(), referrals: newCount }));
      }

      return res.status(200).json({ status: 'ok', referralCount: newCount, rewardEarned, nextReward: Math.max(0, 3 - newCount) });
    }

    return res.status(405).json({ error: 'GET or POST' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
