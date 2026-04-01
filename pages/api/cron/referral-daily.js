/**
 * Daily referral cron — runs at 1am PKT (20:00 UTC previous day)
 * 1. Decrement free months by 1/30 for all users
 * 2. Warn users with 3 days of free months left
 * 3. Renew Legend tier annually
 * 4. Check pending referrals that may now qualify
 */
import { Redis } from '@upstash/redis';
import { notify } from '../../../utils/notify';

const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).end();

  let decremented = 0, warned = 0, expired = 0, renewed = 0, validated = 0;

  try {
    // 1. Decrement free months
    const freeKeys = await kv.keys('referral:freemonths:*');
    for (const key of freeKeys) {
      const email = key.replace('referral:freemonths:', '');
      const months = parseFloat(await kv.get(key) || '0');
      if (months <= 0) continue;

      const isUnlimited = await kv.get(`referral:unlimited:${email}`);
      // Legend tier with unlimited — check for annual renewal instead
      if (isUnlimited) {
        // Check if Legend and needs annual renewal
        const count = parseInt(await kv.get(`referral:count:${email}`) || '0');
        if (count >= 25 && months <= 0.1) {
          // Renew Legend for another 12 months
          await kv.set(key, 12);
          notify({ to: email, subject: '👑 Your Legend status has been renewed!', title: 'Legend Renewed!', body: 'Your NewWorld Legend status has been renewed for another year. Thank you for being a Legend!' }).catch(() => {});
          renewed++;
        }
        continue; // Don't decrement unlimited users
      }

      const newMonths = Math.max(0, months - (1 / 30));
      await kv.set(key, Math.round(newMonths * 1000) / 1000);

      // Warn at 3 days (0.1 months)
      if (newMonths > 0 && newMonths <= 0.1 && months > 0.1) {
        notify({ to: email, subject: '⏰ Your free months end in 3 days!', title: 'Free months ending soon', body: 'Your free months end in 3 days. Refer more friends to keep NewWorldEdu free!<br><br>Each referral earns you more free months.', ctaText: 'Refer Friends Now', ctaUrl: 'https://www.newworld.education/referral' }).catch(() => {});
        warned++;
      }

      if (newMonths <= 0) expired++;
      decremented++;
    }

    // 2. Check pending referrals (users who signed up via referral but haven't qualified yet)
    const fromKeys = await kv.keys('referral:from:*');
    for (const key of fromKeys) {
      const email = key.replace('referral:from:', '');
      const alreadyCounted = await kv.get(`referral:counted:${email}`);
      if (alreadyCounted) continue;

      const signupDate = await kv.get(`referral:signup:${email}`);
      if (!signupDate) continue;
      const daysSince = (Date.now() - new Date(signupDate)) / 86400000;
      if (daysSince < 7) continue;

      // Check sessions
      try {
        const memory = await kv.get(`memory:${email}`);
        const memObj = memory ? (typeof memory === 'string' ? JSON.parse(memory) : memory) : {};
        if ((memObj.totalSessions || 0) >= 3) {
          // Auto-validate by calling the check endpoint internally
          const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.newworld.education';
          await fetch(`${base}/api/referral`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'check', email }),
          }).catch(() => {});
          validated++;
        }
      } catch {}
    }

  } catch (e) {
    console.error('[REFERRAL DAILY]', e.message);
  }

  return res.status(200).json({ decremented, warned, expired, renewed, validated });
}
