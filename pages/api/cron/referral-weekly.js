/**
 * Weekly referral motivation cron — Mondays 9am PKT (04:00 UTC)
 * Emails Champions and above with their current count and next tier progress.
 */
import { Redis } from '@upstash/redis';
import { notify } from '../../../utils/notify';

const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

const TIERS = [
  { min: 1, name: 'Star', badge: '⭐', next: 'Champion', nextMin: 5 },
  { min: 5, name: 'Champion', badge: '🏆', next: 'Ambassador', nextMin: 10 },
  { min: 10, name: 'Ambassador', badge: '🚀', next: 'Legend', nextMin: 25 },
  { min: 25, name: 'Legend', badge: '👑', next: null, nextMin: null },
];

function getTier(count) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (count >= TIERS[i].min) return TIERS[i];
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).end();

  let sent = 0;
  try {
    const keys = await kv.keys('referral:count:*');
    for (const key of keys) {
      const email = key.replace('referral:count:', '');
      const count = parseInt(await kv.get(key) || '0');
      if (count < 5) continue; // Only Champions and above

      const tier = getTier(count);
      if (!tier) continue;

      const needMore = tier.next ? tier.nextMin - count : 0;
      const body = tier.next
        ? `You have <strong>${count} referrals</strong> — you are a <strong>${tier.badge} ${tier.name}</strong>!<br><br>You need just <strong>${needMore} more referral${needMore !== 1 ? 's' : ''}</strong> to become a <strong>${TIERS.find(t => t.name === tier.next)?.badge} ${tier.next}</strong>. Share your link and keep growing!`
        : `You have <strong>${count} referrals</strong> — you are a <strong>${tier.badge} ${tier.name}</strong>! You have reached the highest tier. Thank you for being a NewWorld Legend!`;

      await notify({
        to: email,
        subject: `${tier.badge} Your weekly referral update — ${count} referrals`,
        title: `${tier.name} Update`,
        body,
        ctaText: 'Share & Grow',
        ctaUrl: 'https://www.newworld.education/referral',
      });
      sent++;
      await new Promise(r => setTimeout(r, 200));
    }
  } catch (e) {
    console.error('[REFERRAL WEEKLY]', e.message);
  }

  return res.status(200).json({ sent });
}
