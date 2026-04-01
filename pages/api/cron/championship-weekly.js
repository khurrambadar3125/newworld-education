/**
 * Championship weekly cron — Monday 9am PKT (04:00 UTC Monday)
 * Sends personalised standings to all participants.
 * School champions get extra recognition.
 */
import { Redis } from '@upstash/redis';
import { notify } from '../../../utils/notify';

const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

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
    const name = await kv.get(`championship:name:${email}`) || email.split('@')[0];
    const school = await kv.get(`championship:userschool:${email}`) || '';
    entries.push({ email, name, school, points: pts });
  }
  entries.sort((a, b) => b.points - a.points);
  return entries;
}

function getNextPrizeInfo(rank, config) {
  if (rank <= 3) return { current: rank === 1 ? config.prize1 : rank === 2 ? config.prize2 : config.prize3, status: 'winning' };
  return { current: null, status: 'not_winning', positionsNeeded: rank - 3 };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).end();

  const stats = { sent: 0, schoolChampions: 0, errors: 0 };

  try {
    const config = await getConfig();
    if (!config || config.status !== 'active') {
      return res.status(200).json({ ok: true, message: 'Season not active' });
    }

    const board = await getLeaderboard();
    const daysLeft = Math.max(0, Math.ceil((new Date(config.endDate).getTime() - Date.now()) / 86400000));

    // Build school champion map
    const schoolTopStudent = {};
    for (const entry of board) {
      if (!entry.school) continue;
      const schoolKey = entry.school.trim().toLowerCase();
      if (!schoolTopStudent[schoolKey] || entry.points > schoolTopStudent[schoolKey].points) {
        schoolTopStudent[schoolKey] = entry;
      }
    }

    // Get all participants (including those with 0 points)
    const consentKeys = await kv.keys('championship:consent:*');
    for (const key of consentKeys) {
      try {
        const email = key.replace('championship:consent:', '');
        const name = await kv.get(`championship:name:${email}`) || 'there';
        const points = parseInt(await kv.get(`championship:points:${email}`) || '0');
        const school = await kv.get(`championship:userschool:${email}`) || '';

        // Find rank
        const rank = board.findIndex(b => b.email === email) + 1;
        const actualRank = rank > 0 ? rank : board.length + 1;
        const prizeInfo = getNextPrizeInfo(actualRank, config);

        let body = `<strong>Your Season ${config.season} Standings</strong><br><br>`;
        body += `<div style="background:rgba(255,255,255,0.05);padding:16px;border-radius:10px;margin-bottom:16px">`;
        body += `<div style="font-size:24px;font-weight:900;color:#FFC300">Rank #${actualRank}</div>`;
        body += `<div style="color:rgba(255,255,255,0.6)">${points} referral${points === 1 ? '' : 's'} · ${daysLeft} days left</div>`;
        body += `</div>`;

        if (prizeInfo.status === 'winning') {
          body += `You are currently winning a <strong>${prizeInfo.current}</strong>! Keep referring to hold your position.`;
        } else if (points === 0) {
          body += `You have not referred anyone yet. Share NewWorldEdu with friends to start climbing the leaderboard. Each referral that qualifies (7 days + 3 sessions) = 1 point.`;
        } else {
          body += `You are <strong>${prizeInfo.positionsNeeded} position${prizeInfo.positionsNeeded === 1 ? '' : 's'}</strong> away from winning a prize. ${daysLeft} days left to climb!`;
        }

        await notify({
          to: email,
          subject: `Championship Week Update — You are #${actualRank}`,
          title: `${name}, Here Is Your Weekly Update`,
          body,
          ctaText: points === 0 ? 'Start Referring Now' : 'Share & Climb Higher',
          ctaUrl: 'https://www.newworld.education/championship',
        });
        stats.sent++;

        // School champion bonus email
        if (school) {
          const schoolKey = school.trim().toLowerCase();
          const champ = schoolTopStudent[schoolKey];
          if (champ && champ.email === email && points > 0) {
            await notify({
              to: email,
              subject: `You are #1 at ${school}!`,
              title: `School Champion!`,
              body: `You are the <strong>#1 student from ${school}</strong> on the Championship leaderboard with <strong>${points} referrals</strong>.<br><br>Keep going — you are representing your school. ${daysLeft} days left in Season ${config.season}.`,
              ctaText: 'Defend Your School Title',
              ctaUrl: 'https://www.newworld.education/championship',
            });
            stats.schoolChampions++;
          }
        }

        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 100));
      } catch { stats.errors++; }
    }

  } catch (e) {
    console.error('[CHAMPIONSHIP WEEKLY]', e.message);
    stats.errors++;
  }

  return res.status(200).json({ ok: true, stats });
}
