/**
 * Championship intelligence report — Monday 10am PKT (05:00 UTC Monday)
 * Sends weekly intelligence report to khurrambadar@gmail.com with 5 sections.
 */
import { Redis } from '@upstash/redis';
import { notify } from '../../../utils/notify';

const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

const DAY = 86400000;
const WEEK = 7 * DAY;

async function getConfig() {
  const raw = await kv.get('championship:config');
  if (!raw) return null;
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).end();

  try {
    const config = await getConfig();
    const now = Date.now();
    const weekAgo = now - WEEK;

    // ── Gather data ──
    const consentKeys = await kv.keys('championship:consent:*');
    let totalParticipants = consentKeys.length;
    let newParticipantsThisWeek = 0;

    for (const key of consentKeys) {
      const raw = await kv.get(key);
      const consent = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : {};
      if (consent.timestamp && new Date(consent.timestamp).getTime() > weekAgo) {
        newParticipantsThisWeek++;
      }
    }

    // Referral stats
    const pointKeys = await kv.keys('championship:points:*');
    let totalReferrals = 0;
    let activeParticipants = 0;
    const entries = [];
    for (const key of pointKeys) {
      const email = key.replace('championship:points:', '');
      const pts = parseInt(await kv.get(key) || '0');
      totalReferrals += pts;
      if (pts > 0) activeParticipants++;
      entries.push({ email, points: pts });
    }
    entries.sort((a, b) => b.points - a.points);

    // Behaviour funnel
    const visitKeys = await kv.keys('championship:behaviour:*:visited_championship');
    let visitedCount = visitKeys.length;

    const joinedBehaviourKeys = await kv.keys('championship:behaviour:*:joined');
    let joinedBehaviourCount = joinedBehaviourKeys.length;

    const shareKeys = await kv.keys('championship:behaviour:*:share_click');
    let shareCount = shareKeys.length;

    // Intervention stats
    const interventionKeys = await kv.keys('championship:intervention:*');
    const interventionCounts = {};
    for (const key of interventionKeys) {
      const parts = key.split(':');
      const type = parts[parts.length - 1];
      // Normalize intervention types
      const normalType = type.replace(/_s\d+$/, '').replace(/_[a-f0-9]+$/, '');
      interventionCounts[normalType] = (interventionCounts[normalType] || 0) + 1;
    }

    // Conversion rate
    const visitToJoinRate = visitedCount > 0 ? Math.round((totalParticipants / visitedCount) * 100) : 0;
    const joinToReferRate = totalParticipants > 0 ? Math.round((activeParticipants / totalParticipants) * 100) : 0;

    // Fraud check — look for suspicious patterns
    const anomalies = [];
    // Check for accounts with unusually rapid referrals
    for (const entry of entries.slice(0, 10)) {
      if (entry.points > 0) {
        const consent = await kv.get(`championship:consent:${entry.email}`);
        const consentObj = consent ? (typeof consent === 'string' ? JSON.parse(consent) : consent) : {};
        if (consentObj.timestamp) {
          const daysActive = (now - new Date(consentObj.timestamp).getTime()) / DAY;
          const refsPerDay = daysActive > 0 ? entry.points / daysActive : entry.points;
          if (refsPerDay > 5) {
            const name = await kv.get(`championship:name:${entry.email}`) || entry.email;
            anomalies.push(`${name} (${entry.email}) has ${entry.points} refs in ${Math.round(daysActive)} days (${refsPerDay.toFixed(1)}/day) — verify authenticity`);
          }
        }
      }
    }

    // Check for activity drops
    if (newParticipantsThisWeek === 0 && totalParticipants > 0) {
      anomalies.push('Zero new participants this week — growth has stalled');
    }

    // ── Build report ──
    const daysLeft = config?.endDate ? Math.max(0, Math.ceil((new Date(config.endDate).getTime() - now) / DAY)) : '?';

    // Section 1: This week in numbers
    let section1 = `<div style="background:rgba(255,195,0,0.08);padding:16px;border-radius:10px;margin-bottom:16px">`;
    section1 += `<div style="font-weight:800;color:#FFC300;margin-bottom:8px">1. THIS WEEK IN NUMBERS</div>`;
    section1 += `<table style="width:100%;font-size:14px;color:rgba(255,255,255,0.7)">`;
    section1 += `<tr><td>New participants</td><td style="text-align:right;font-weight:800;color:#fff">${newParticipantsThisWeek}</td></tr>`;
    section1 += `<tr><td>Total participants</td><td style="text-align:right;font-weight:800;color:#fff">${totalParticipants}</td></tr>`;
    section1 += `<tr><td>Total referrals</td><td style="text-align:right;font-weight:800;color:#fff">${totalReferrals}</td></tr>`;
    section1 += `<tr><td>Active (1+ referral)</td><td style="text-align:right;font-weight:800;color:#fff">${activeParticipants}</td></tr>`;
    section1 += `<tr><td>Visit → Join rate</td><td style="text-align:right;font-weight:800;color:#fff">${visitToJoinRate}%</td></tr>`;
    section1 += `<tr><td>Join → Refer rate</td><td style="text-align:right;font-weight:800;color:#fff">${joinToReferRate}%</td></tr>`;
    section1 += `<tr><td>Season ${config?.season || '?'} days left</td><td style="text-align:right;font-weight:800;color:#FFC300">${daysLeft}</td></tr>`;
    section1 += `</table></div>`;

    // Section 2: Where people drop off
    let section2 = `<div style="background:rgba(255,100,100,0.08);padding:16px;border-radius:10px;margin-bottom:16px">`;
    section2 += `<div style="font-weight:800;color:#FF6464;margin-bottom:8px">2. WHERE PEOPLE DROP OFF</div>`;

    const funnel = [
      { stage: 'Visited championship page', count: visitedCount },
      { stage: 'Joined competition', count: totalParticipants },
      { stage: 'Clicked share', count: shareCount },
      { stage: 'Got 1+ referral', count: activeParticipants },
    ];

    let biggestDrop = '';
    let biggestDropPct = 0;
    for (let i = 1; i < funnel.length; i++) {
      if (funnel[i - 1].count > 0) {
        const dropPct = 100 - Math.round((funnel[i].count / funnel[i - 1].count) * 100);
        if (dropPct > biggestDropPct) {
          biggestDropPct = dropPct;
          biggestDrop = `${funnel[i - 1].stage} → ${funnel[i].stage}`;
        }
      }
    }

    section2 += `<div style="font-size:14px;color:rgba(255,255,255,0.7)">`;
    funnel.forEach((f, i) => {
      const pct = i > 0 && funnel[i - 1].count > 0 ? Math.round((f.count / funnel[i - 1].count) * 100) : 100;
      section2 += `${f.stage}: <strong style="color:#fff">${f.count}</strong>${i > 0 ? ` (${pct}% of previous)` : ''}<br>`;
    });
    section2 += `<br><strong style="color:#FF6464">Biggest friction:</strong> ${biggestDrop || 'Not enough data'} (${biggestDropPct}% drop-off)`;
    section2 += `</div></div>`;

    // Section 3: One thing to do this week
    let section3 = `<div style="background:rgba(74,222,128,0.08);padding:16px;border-radius:10px;margin-bottom:16px">`;
    section3 += `<div style="font-weight:800;color:#4ADE80;margin-bottom:8px">3. ONE THING TO DO THIS WEEK</div>`;
    section3 += `<div style="font-size:14px;color:rgba(255,255,255,0.7)">`;

    if (joinToReferRate < 20) {
      section3 += `<strong style="color:#fff">Focus on: Getting joined participants to refer.</strong><br>Only ${joinToReferRate}% of joined participants have made a referral. Consider adding a pre-written WhatsApp message to the championship page that they can share with one tap.`;
    } else if (visitToJoinRate < 30) {
      section3 += `<strong style="color:#fff">Focus on: Converting visitors to joiners.</strong><br>Only ${visitToJoinRate}% of page visitors join. Consider adding more social proof (live participant count, testimonials) or simplifying the join form.`;
    } else if (daysLeft <= 7) {
      section3 += `<strong style="color:#fff">Focus on: Final push.</strong><br>${daysLeft} days left. Send personal WhatsApp messages to the top 5 encouraging a final referral burst.`;
    } else {
      section3 += `<strong style="color:#fff">Focus on: Momentum.</strong><br>Things are tracking well. Share the leaderboard on social media to attract new participants.`;
    }
    section3 += `</div></div>`;

    // Section 4: What is working
    let section4 = `<div style="background:rgba(108,99,255,0.08);padding:16px;border-radius:10px;margin-bottom:16px">`;
    section4 += `<div style="font-weight:800;color:#6c63ff;margin-bottom:8px">4. WHAT IS WORKING</div>`;
    section4 += `<div style="font-size:14px;color:rgba(255,255,255,0.7)">`;

    const sortedInterventions = Object.entries(interventionCounts).sort((a, b) => b[1] - a[1]);
    if (sortedInterventions.length > 0) {
      section4 += `<strong style="color:#fff">Top interventions by volume:</strong><br>`;
      sortedInterventions.slice(0, 5).forEach(([type, count]) => {
        const label = type.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
        section4 += `- ${label}: ${count} sent<br>`;
      });
    } else {
      section4 += `No interventions sent yet. The behaviour analysis cron will start sending once participants hit trigger conditions.`;
    }
    section4 += `</div></div>`;

    // Section 5: Anomalies
    let section5 = `<div style="background:rgba(255,195,0,0.08);padding:16px;border-radius:10px;margin-bottom:16px">`;
    section5 += `<div style="font-weight:800;color:#FFC300;margin-bottom:8px">5. ANOMALIES</div>`;
    section5 += `<div style="font-size:14px;color:rgba(255,255,255,0.7)">`;
    if (anomalies.length > 0) {
      anomalies.forEach(a => { section5 += `- ${a}<br>`; });
    } else {
      section5 += `No anomalies detected. All referral patterns look normal.`;
    }
    section5 += `</div></div>`;

    // Footer
    const footer = `<div style="text-align:center;padding:16px;color:rgba(255,255,255,0.4);font-size:12px;border-top:1px solid rgba(255,255,255,0.08);margin-top:16px">All interventions running automatically. This report requires no action.</div>`;

    const fullBody = section1 + section2 + section3 + section4 + section5 + footer;

    await notify({
      to: 'khurrambadar@gmail.com',
      subject: `Championship Intelligence — Week of ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`,
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#0a0a1a;margin:0;padding:20px;font-family:Arial,sans-serif">
<div style="max-width:580px;margin:0 auto">
<div style="text-align:center;padding:24px 20px;background:linear-gradient(135deg,#0d0d2b,#1a1a3e);border-radius:14px 14px 0 0;border-bottom:2px solid #FFC300">
<div style="font-size:32px">🏆</div>
<div style="color:#FFC300;font-size:18px;font-weight:700">Championship Intelligence Report</div>
<div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:4px">Season ${config?.season || '?'} · ${daysLeft} days remaining</div>
</div>
<div style="background:#111128;padding:24px 20px;border-radius:0 0 14px 14px">
${fullBody}
</div>
</div></body></html>`,
    });

    return res.status(200).json({
      ok: true,
      summary: {
        totalParticipants,
        newParticipantsThisWeek,
        totalReferrals,
        activeParticipants,
        visitToJoinRate,
        joinToReferRate,
        anomalies: anomalies.length,
      },
    });

  } catch (e) {
    console.error('[CHAMPIONSHIP INTELLIGENCE]', e.message);
    return res.status(500).json({ error: e.message });
  }
}
