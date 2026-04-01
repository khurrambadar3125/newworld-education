/**
 * Daily behaviour analysis cron — 2am PKT (21:00 UTC previous day)
 * Checks all championship participants for behaviour patterns and sends
 * one-time interventions. All interventions stored in KV to prevent repeats.
 */
import { Redis } from '@upstash/redis';
import { notify } from '../../../utils/notify';

const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

const HOUR = 3600000;
const DAY = 24 * HOUR;

async function alreadySent(email, intervention) {
  const key = `championship:intervention:${email}:${intervention}`;
  const sent = await kv.get(key);
  return !!sent;
}

async function markSent(email, intervention) {
  const key = `championship:intervention:${email}:${intervention}`;
  await kv.set(key, new Date().toISOString());
}

async function getBehaviour(email, event) {
  const raw = await kv.get(`championship:behaviour:${email}:${event}`);
  if (!raw) return null;
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).end();

  const stats = { visited_no_join: 0, joined_no_referrals: 0, one_then_stopped: 0, almost_valid: 0, competitive_nudge: 0, errors: 0 };

  try {
    // 1. Visited but did not join (24h+)
    const visitKeys = await kv.keys('championship:behaviour:*:visited_championship');
    for (const key of visitKeys) {
      try {
        const email = key.split(':')[2];
        const visited = await getBehaviour(email, 'visited_championship');
        if (!visited) continue;

        const joinedBehaviour = await getBehaviour(email, 'joined');
        if (joinedBehaviour) continue; // They joined, skip

        const consent = await kv.get(`championship:consent:${email}`);
        if (consent) continue; // Already joined via direct path

        const hoursSinceVisit = (Date.now() - new Date(visited.firstSeen)) / HOUR;
        if (hoursSinceVisit < 24) continue;

        if (await alreadySent(email, 'visited_no_join')) continue;

        await notify({
          to: email,
          subject: 'You checked out the Championship — ready to join?',
          title: 'You Were Checking Out the Championship',
          body: `You visited the NewWorld Championship page but did not join yet. It is <strong>100% free</strong> and you could win Meta Ray-Ban smart glasses, AirPods, or mobile credit.<br><br>Just share NewWorldEdu with your friends. The more friends who join and learn, the higher you climb on the leaderboard.`,
          ctaText: 'Join the Championship — Free',
          ctaUrl: 'https://www.newworld.education/championship',
        });
        await markSent(email, 'visited_no_join');
        stats.visited_no_join++;
      } catch { stats.errors++; }
    }

    // 2. Joined but zero referrals (7d+)
    const consentKeys = await kv.keys('championship:consent:*');
    for (const key of consentKeys) {
      try {
        const email = key.replace('championship:consent:', '');
        const consentRaw = await kv.get(key);
        const consent = consentRaw ? (typeof consentRaw === 'string' ? JSON.parse(consentRaw) : consentRaw) : {};
        const daysSinceJoin = (Date.now() - new Date(consent.timestamp)) / DAY;
        if (daysSinceJoin < 7) continue;

        const points = parseInt(await kv.get(`championship:points:${email}`) || '0');
        if (points > 0) continue;

        if (await alreadySent(email, 'joined_no_referrals')) continue;

        const name = await kv.get(`championship:name:${email}`) || 'there';
        const whatsappMsg = `Hey! I am using NewWorld Education — it is a free AI tutor that helps with O Levels, A Levels, and Matric. Try it out: newworld.education`;

        await notify({
          to: email,
          subject: 'Your Championship journey — let us get you started',
          title: `Hey ${name}, Zero Referrals So Far`,
          body: `You joined the Championship ${Math.floor(daysSinceJoin)} days ago but have not referred anyone yet. Here is the easiest way to start:<br><br><strong>Copy this message and send it to 5 friends on WhatsApp:</strong><br><br><div style="background:rgba(255,255,255,0.05);padding:12px;border-radius:8px;font-style:italic;color:rgba(255,255,255,0.6)">"${whatsappMsg}"</div><br>Each friend who joins and completes 3 sessions = 1 point for you. Top 3 win prizes!`,
          ctaText: 'Share on WhatsApp Now',
          ctaUrl: `https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`,
        });
        await markSent(email, 'joined_no_referrals');
        stats.joined_no_referrals++;
      } catch { stats.errors++; }
    }

    // 3. 1 referral then stopped (5d+)
    for (const key of consentKeys) {
      try {
        const email = key.replace('championship:consent:', '');
        const points = parseInt(await kv.get(`championship:points:${email}`) || '0');
        if (points !== 1) continue;

        const firstRefBehaviour = await getBehaviour(email, 'first_referral');
        if (!firstRefBehaviour) continue;

        const daysSinceFirstRef = (Date.now() - new Date(firstRefBehaviour.lastSeen)) / DAY;
        if (daysSinceFirstRef < 5) continue;

        if (await alreadySent(email, 'one_then_stopped')) continue;

        const name = await kv.get(`championship:name:${email}`) || 'there';
        await notify({
          to: email,
          subject: 'You got 1 referral — 2 more and you could win!',
          title: `${name}, You Are on the Board!`,
          body: `You got your first referral — nice work! You are already on the leaderboard.<br><br>Just <strong>2 more referrals</strong> and you are in serious contention for a prize. The top 3 win Meta Ray-Ban, AirPods, or Rs 5,000 mobile credit.<br><br>Share with your classmates, cousins, or study group. Every friend counts.`,
          ctaText: 'Share & Get More Referrals',
          ctaUrl: 'https://www.newworld.education/championship',
        });
        await markSent(email, 'one_then_stopped');
        stats.one_then_stopped++;
      } catch { stats.errors++; }
    }

    // 4. Referred person at 2/3 sessions — notify referrer "1 more session needed"
    const fromKeys = await kv.keys('referral:from:*');
    for (const key of fromKeys) {
      try {
        const referredEmail = key.replace('referral:from:', '');
        const alreadyCounted = await kv.get(`referral:counted:${referredEmail}`);
        if (alreadyCounted) continue;

        let totalSessions = 0;
        try {
          const memory = await kv.get(`memory:${referredEmail}`);
          const memObj = memory ? (typeof memory === 'string' ? JSON.parse(memory) : memory) : {};
          totalSessions = memObj.totalSessions || 0;
        } catch {}

        if (totalSessions !== 2) continue;

        const referrerEmail = await kv.get(key);
        if (!referrerEmail) continue;
        const referrer = typeof referrerEmail === 'string' ? referrerEmail : String(referrerEmail);

        const interventionKey = `almost_valid_${referredEmail}`;
        if (await alreadySent(referrer, interventionKey)) continue;

        const referredName = referredEmail.split('@')[0];
        await notify({
          to: referrer,
          subject: '1 more session and your referral counts!',
          title: 'Almost There!',
          body: `Your referral <strong>${referredName}</strong> has completed <strong>2 out of 3</strong> required sessions. Just <strong>1 more session</strong> and you get your point!<br><br>Send them a quick message to encourage them to do one more session with Starky.`,
          ctaText: 'View Your Championship',
          ctaUrl: 'https://www.newworld.education/championship',
        });
        await markSent(referrer, interventionKey);
        stats.almost_valid++;
      } catch { stats.errors++; }
    }

    // 5. Rank 2 within 5 refs of rank 1 — competitive nudge
    try {
      const pointKeys = await kv.keys('championship:points:*');
      const entries = [];
      for (const pKey of pointKeys) {
        const em = pKey.replace('championship:points:', '');
        const pts = parseInt(await kv.get(pKey) || '0');
        if (pts > 0) entries.push({ email: em, points: pts });
      }
      entries.sort((a, b) => b.points - a.points);

      if (entries.length >= 2) {
        const leader = entries[0];
        const runner = entries[1];
        const gap = leader.points - runner.points;

        if (gap <= 5 && gap > 0) {
          if (!(await alreadySent(runner.email, `competitive_nudge_s${leader.points}`))) {
            const runnerName = await kv.get(`championship:name:${runner.email}`) || 'there';
            await notify({
              to: runner.email,
              subject: `You are ${gap} referral${gap === 1 ? '' : 's'} from 1st place!`,
              title: `${runnerName}, You Are SO Close!`,
              body: `You are currently <strong>#2</strong> on the leaderboard with <strong>${runner.points} referrals</strong>. First place has <strong>${leader.points}</strong>. That is only <strong>${gap} referral${gap === 1 ? '' : 's'}</strong> away!<br><br>Share with a few more friends and you could take the lead. The Meta Ray-Ban smart glasses could be yours.`,
              ctaText: 'Share & Take the Lead',
              ctaUrl: 'https://www.newworld.education/championship',
            });
            await markSent(runner.email, `competitive_nudge_s${leader.points}`);
            stats.competitive_nudge++;
          }
        }
      }
    } catch { stats.errors++; }

  } catch (e) {
    console.error('[BEHAVIOUR ANALYSIS]', e.message);
    stats.errors++;
  }

  return res.status(200).json({ ok: true, stats });
}
