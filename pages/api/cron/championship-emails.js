/**
 * Daily championship email scheduler — 9am PKT (04:00 UTC)
 * Handles: claim reminders, season countdown emails for top participants
 */
import { Redis } from '@upstash/redis';
import { notify } from '../../../utils/notify';

const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

const DAY = 86400000;

async function getConfig() {
  const raw = await kv.get('championship:config');
  if (!raw) return null;
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

async function getLeaderboard() {
  const keys = await kv.keys('championship:points:*');
  const entries = [];
  for (const key of keys) {
    const email = key.replace('championship:points:', '');
    const pts = parseInt(await kv.get(key) || '0');
    if (pts <= 0) continue;
    const name = await kv.get(`championship:name:${email}`) || email.split('@')[0];
    entries.push({ email, name, points: pts });
  }
  entries.sort((a, b) => b.points - a.points);
  return entries;
}

async function alreadySent(email, key) {
  const sent = await kv.get(`championship:emailsent:${email}:${key}`);
  return !!sent;
}

async function markSent(email, key) {
  await kv.set(`championship:emailsent:${email}:${key}`, new Date().toISOString());
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).end();

  const stats = { claimReminders48h: 0, claimReminders5d: 0, countdown7d: 0, countdown3d: 0, countdown1d: 0, freeMonthsWarning: 0, errors: 0 };

  try {
    const config = await getConfig();
    if (!config) return res.status(200).json({ ok: true, message: 'No config found' });

    // ── 1. Claim reminders for unclaimed prizes ──
    const claimTokenKeys = await kv.keys('championship:claimtoken:*');
    for (const key of claimTokenKeys) {
      try {
        const token = key.replace('championship:claimtoken:', '');
        const raw = await kv.get(key);
        if (!raw) continue;
        const claim = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (!claim.email) continue;

        // We need to estimate when the token was created
        // Tokens expire in 7 days, so we check behaviour patterns
        const audit = await kv.lrange(`championship:audit:${claim.email}`, 0, 20);
        let tokenCreatedAt = null;
        for (const entry of audit) {
          const parsed = typeof entry === 'string' ? JSON.parse(entry) : entry;
          if (parsed.event === 'season_won' || parsed.event === 'joined') {
            tokenCreatedAt = new Date(parsed.timestamp);
          }
        }

        // Fallback: estimate from season end
        if (!tokenCreatedAt && config.endDate) {
          tokenCreatedAt = new Date(config.endDate);
        }
        if (!tokenCreatedAt) continue;

        const hoursSinceCreated = (Date.now() - tokenCreatedAt.getTime()) / 3600000;

        // 48h reminder
        if (hoursSinceCreated >= 48 && hoursSinceCreated < 72) {
          if (!(await alreadySent(claim.email, `claim_48h_${token.slice(0, 8)}`))) {
            await notify({
              to: claim.email,
              subject: 'Reminder: Claim your Championship prize!',
              title: 'Your Prize Is Waiting!',
              body: `You won <strong>${claim.prize}</strong> in the NewWorld Championship but have not claimed it yet. Submit your delivery address to receive your prize.<br><br><strong>Your claim link expires in 5 days.</strong>`,
              ctaText: 'Claim My Prize Now',
              ctaUrl: `https://www.newworld.education/claim/${token}`,
            });
            await markSent(claim.email, `claim_48h_${token.slice(0, 8)}`);
            stats.claimReminders48h++;
          }
        }

        // 5 day reminder
        if (hoursSinceCreated >= 120 && hoursSinceCreated < 144) {
          if (!(await alreadySent(claim.email, `claim_5d_${token.slice(0, 8)}`))) {
            await notify({
              to: claim.email,
              subject: 'URGENT: Your prize expires in 2 days!',
              title: 'Last Chance to Claim Your Prize',
              body: `Your <strong>${claim.prize}</strong> claim expires in <strong>2 days</strong>. After that, the prize may be forfeited.<br><br>Please submit your delivery address now.`,
              ctaText: 'Claim Before It Expires',
              ctaUrl: `https://www.newworld.education/claim/${token}`,
            });
            await markSent(claim.email, `claim_5d_${token.slice(0, 8)}`);
            stats.claimReminders5d++;
          }
        }
      } catch { stats.errors++; }
    }

    // ── 2. Season countdown emails ──
    if (config.status === 'active' && config.endDate) {
      const daysLeft = Math.ceil((new Date(config.endDate).getTime() - Date.now()) / DAY);
      const board = await getLeaderboard();
      const season = config.season;

      // 7 days before: email top 20
      if (daysLeft <= 7 && daysLeft > 6) {
        const top20 = board.slice(0, 20);
        for (const p of top20) {
          try {
            if (await alreadySent(p.email, `countdown_7d_s${season}`)) continue;
            const rank = board.findIndex(b => b.email === p.email) + 1;
            await notify({
              to: p.email,
              subject: `7 days left — you are #${rank} in the Championship!`,
              title: '7 Days Left!',
              body: `Season ${season} ends in <strong>7 days</strong>. You are currently <strong>#${rank}</strong> with <strong>${p.points} referrals</strong>.<br><br>${rank <= 3 ? 'You are in a prize-winning position! Keep going to secure your spot.' : `You need to move up ${rank - 3} position${rank - 3 === 1 ? '' : 's'} to win a prize. Every referral counts now!`}`,
              ctaText: 'Share & Climb the Leaderboard',
              ctaUrl: 'https://www.newworld.education/championship',
            });
            await markSent(p.email, `countdown_7d_s${season}`);
            stats.countdown7d++;
          } catch { stats.errors++; }
        }
      }

      // 3 days before: email top 10
      if (daysLeft <= 3 && daysLeft > 2) {
        const top10 = board.slice(0, 10);
        for (const p of top10) {
          try {
            if (await alreadySent(p.email, `countdown_3d_s${season}`)) continue;
            const rank = board.findIndex(b => b.email === p.email) + 1;
            await notify({
              to: p.email,
              subject: `3 DAYS LEFT — you are #${rank}!`,
              title: 'Final 3 Days!',
              body: `Only <strong>3 days</strong> remain in Season ${season}. You are <strong>#${rank}</strong> with <strong>${p.points} referrals</strong>.<br><br>${rank <= 3 ? `You are winning a <strong>${rank === 1 ? config.prize1 : rank === 2 ? config.prize2 : config.prize3}</strong>! Do not let anyone overtake you.` : 'This is your final push. Share with everyone you know!'}`,
              ctaText: 'Final Push — Share Now',
              ctaUrl: 'https://www.newworld.education/championship',
            });
            await markSent(p.email, `countdown_3d_s${season}`);
            stats.countdown3d++;
          } catch { stats.errors++; }
        }
      }

      // 1 day before: email top 5
      if (daysLeft <= 1 && daysLeft > 0) {
        const top5 = board.slice(0, 5);
        for (const p of top5) {
          try {
            if (await alreadySent(p.email, `countdown_1d_s${season}`)) continue;
            const rank = board.findIndex(b => b.email === p.email) + 1;
            await notify({
              to: p.email,
              subject: `FINAL DAY — you are #${rank} in the Championship!`,
              title: 'Last Day!',
              body: `This is it. Season ${season} ends <strong>tomorrow</strong>. You are <strong>#${rank}</strong> with <strong>${p.points} referrals</strong>.<br><br>${rank <= 3 ? `You are about to win a <strong>${rank === 1 ? config.prize1 : rank === 2 ? config.prize2 : config.prize3}</strong>. Hold your position!` : 'One or two more referrals could change everything. Give it everything today.'}`,
              ctaText: 'Last Chance — Share Now',
              ctaUrl: 'https://www.newworld.education/championship',
            });
            await markSent(p.email, `countdown_1d_s${season}`);
            stats.countdown1d++;
          } catch { stats.errors++; }
        }
      }
    }

    // ── 3. Free months running low warning ──
    const freeKeys = await kv.keys('referral:freemonths:*');
    for (const key of freeKeys) {
      try {
        const email = key.replace('referral:freemonths:', '');
        const months = parseFloat(await kv.get(key) || '0');
        // 3 days = roughly 0.1 months
        if (months > 0 && months <= 0.1) {
          if (await alreadySent(email, 'freemonths_low_warning')) continue;
          await notify({
            to: email,
            subject: 'Your free months expire in about 3 days',
            title: 'Free Months Running Low',
            body: `You have approximately <strong>3 days</strong> of free access remaining. Refer friends via the Championship to earn more free months!`,
            ctaText: 'Refer & Keep Learning Free',
            ctaUrl: 'https://www.newworld.education/championship',
          });
          await markSent(email, 'freemonths_low_warning');
          stats.freeMonthsWarning++;
        }
      } catch { stats.errors++; }
    }

  } catch (e) {
    console.error('[CHAMPIONSHIP EMAILS]', e.message);
    stats.errors++;
  }

  return res.status(200).json({ ok: true, stats });
}
