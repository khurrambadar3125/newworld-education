/**
 * /api/cron/lead-drip.js
 * ─────────────────────────────────────────────────────────────────
 * 5-email welcome drip sequence for captured leads.
 * Runs daily at 8am PKT (03:00 UTC).
 *
 * Schedule:
 *   Step 1 (Day 0): Welcome email — sent immediately by lead-capture.js
 *   Step 2 (Day 2): Free diagnostic question + study tip
 *   Step 3 (Day 5): The #1 mistake students make in exams
 *   Step 4 (Day 7): Parent pitch — show them their child's potential
 *   Step 5 (Day 10): Referral ask + social proof
 */

import { Resend } from 'resend';
import { getSupabase } from '../../../utils/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

const wrap = (content) => `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#0a0a1a;margin:0;padding:20px;font-family:Arial,sans-serif">
<div style="max-width:580px;margin:0 auto">
<div style="text-align:center;padding:28px 20px;background:linear-gradient(135deg,#0d0d2b,#1a1a3e);border-radius:14px 14px 0 0;border-bottom:2px solid #6c63ff">
<div style="font-size:36px">★</div>
<div style="color:#6c63ff;font-size:20px;font-weight:700">NewWorld Education</div>
</div>
<div style="background:#111128;padding:28px 22px;border-radius:0 0 14px 14px">${content}</div>
<div style="text-align:center;padding:16px;color:#555570;font-size:12px">★ Starky from NewWorld Education | <a href="https://newworld.education" style="color:#6c63ff;text-decoration:none">newworld.education</a><br>
<a href="https://newworld.education/unsubscribe" style="color:#555570;text-decoration:underline;font-size:11px">Unsubscribe</a></div>
</div></body></html>`;

// ── Step 2: Free question + study tip (Day 2) ───────────────────
function email_step2(name, subject, grade) {
  const firstName = name?.split(' ')[0] || 'there';
  return {
    subject: `${firstName}, try this ${subject || 'Cambridge'} question — can you get full marks?`,
    html: wrap(`
<h1 style="color:#fff;font-size:22px;margin:0 0 16px">Quick challenge, ${firstName} ★</h1>
<div style="color:#ccccdd;font-size:14px;line-height:1.7;margin-bottom:20px">
Here's a real Cambridge-style question. Most students get this wrong — not because it's hard, but because they don't use the <strong style="color:#fff">exact words</strong> examiners look for.
</div>

<div style="background:rgba(79,142,247,.07);border:1px solid rgba(79,142,247,.2);border-radius:12px;padding:18px 20px;margin-bottom:20px">
<div style="color:#4F8EF7;font-size:11px;font-weight:600;letter-spacing:1px;margin-bottom:10px">SAMPLE QUESTION</div>
<div style="color:#fff;font-size:15px;line-height:1.7">
${subject === 'Biology' ? 'Define osmosis. [3 marks]'
  : subject === 'Chemistry' ? 'Explain why a catalyst does not change the enthalpy change of a reaction. [2 marks]'
  : subject === 'Physics' ? 'Explain why a car moving at constant velocity has a resultant force of zero. [2 marks]'
  : subject === 'Mathematics' ? 'Show that the gradient of the tangent to y = x² at x = 3 is 6. [2 marks]'
  : subject === 'Economics' ? 'Explain two causes of market failure. [4 marks]'
  : 'Describe the key features of effective analytical writing. [3 marks]'}
</div>
</div>

<div style="background:#0d2d1a;border:1px solid #4ade8033;border-radius:10px;padding:16px;margin-bottom:20px">
<div style="color:#4ade80;font-size:11px;font-weight:600;letter-spacing:1px;margin-bottom:8px">STUDY TIP</div>
<div style="color:#ccccdd;font-size:13px;line-height:1.6">
Before writing your answer, <strong style="color:#fff">identify the command word</strong>. "Define" means give a precise technical definition. "Explain" means give a reason using "because". "Describe" means say what happens without why. Getting this wrong is the #1 reason students lose marks.
</div>
</div>

<div style="text-align:center">
<a href="https://newworld.education/drill" style="background:#6c63ff;color:#fff;padding:13px 28px;border-radius:22px;text-decoration:none;font-weight:600;font-size:14px">Try answering with Starky — get instant marking →</a>
</div>`),
  };
}

// ── Step 3: #1 mistake students make (Day 5) ────────────────────
function email_step3(name, subject) {
  const firstName = name?.split(' ')[0] || 'there';
  return {
    subject: `The #1 mistake ${subject || 'Cambridge'} students make (and how to avoid it)`,
    html: wrap(`
<h1 style="color:#fff;font-size:22px;margin:0 0 16px">This one mistake costs thousands of marks every year</h1>

<div style="color:#ccccdd;font-size:14px;line-height:1.7;margin-bottom:20px">
${firstName}, Cambridge examiners say the same thing every year in their reports:
</div>

<div style="background:rgba(248,113,113,.07);border:1px solid rgba(248,113,113,.25);border-radius:12px;padding:18px 20px;margin-bottom:20px">
<div style="color:#F87171;font-size:14px;font-weight:700;margin-bottom:8px">"Students knew the content but could not express it in mark-scheme language."</div>
<div style="color:#ccccdd;font-size:13px;line-height:1.6">
This means: you can understand a topic perfectly, study for weeks, walk into the exam feeling confident — and still lose marks because you didn't use the <strong style="color:#fff">exact phrases</strong> the mark scheme requires.
</div>
</div>

<div style="color:#ccccdd;font-size:14px;line-height:1.7;margin-bottom:20px">
<strong style="color:#fff">Real examples:</strong><br>
• Biology: saying "water moves" instead of "net movement of water molecules" = 0 marks<br>
• Chemistry: saying enzymes are "killed" by heat instead of "denatured" = 0 marks<br>
• Physics: saying "energy is lost" instead of "energy is transferred to surroundings" = 0 marks
</div>

<div style="background:rgba(79,142,247,.07);border:1px solid rgba(79,142,247,.2);border-radius:12px;padding:18px 20px;margin-bottom:20px">
<div style="color:#4F8EF7;font-size:14px;font-weight:700;margin-bottom:8px">This is exactly what Starky teaches</div>
<div style="color:#ccccdd;font-size:13px;line-height:1.6">
Starky knows every mark scheme phrase for 30+ Cambridge subjects. When you answer a question, Starky checks your words against the <strong style="color:#fff">exact phrases examiners accept and reject</strong>. You learn to write like an A* student.
</div>
</div>

<div style="text-align:center">
<a href="https://newworld.education/drill" style="background:#6c63ff;color:#fff;padding:13px 28px;border-radius:22px;text-decoration:none;font-weight:600;font-size:14px">Practice with real mark scheme feedback →</a>
</div>`),
  };
}

// ── Step 4: Parent pitch (Day 7) ────────────────────────────────
function email_step4(name, subject, grade) {
  const firstName = name?.split(' ')[0] || 'there';
  return {
    subject: `${firstName}, show this to your parents — they'll want to know about this`,
    html: wrap(`
<h1 style="color:#fff;font-size:22px;margin:0 0 16px">A message for your parents</h1>

<div style="color:#ccccdd;font-size:14px;line-height:1.7;margin-bottom:20px">
${firstName}, feel free to forward this to your parents. They might find it interesting.
</div>

<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:20px;margin-bottom:20px">
<div style="color:#fff;font-size:16px;font-weight:700;margin-bottom:12px">Dear Parent,</div>
<div style="color:#ccccdd;font-size:14px;line-height:1.8">
Your child recently tried NewWorld Education — an AI tutoring platform built specifically for Cambridge ${grade || 'O/A Level'} students in Pakistan.<br><br>

Here's what makes us different from coaching centres:<br><br>

<strong style="color:#fff">1. Available 24/7</strong> — Starky never cancels a class<br>
<strong style="color:#fff">2. Knows every mark scheme</strong> — teaches the exact words examiners accept<br>
<strong style="color:#fff">3. Detects weak spots automatically</strong> — focuses practice where it matters<br>
<strong style="color:#fff">4. Costs less than 1 tuition class/month</strong> — unlimited practice sessions<br>
<strong style="color:#fff">5. Works in Urdu too</strong> — your child can learn in the language they think in<br><br>

Your child gets <strong style="color:#4ade80">10 free sessions</strong> — no credit card, no commitment. After that, plans start at PKR 3,499/month (less than a single tuition teacher charges per subject).<br><br>

Students at Nixor and Beaconhouse are already using it.
</div>
</div>

<div style="text-align:center">
<a href="https://newworld.education/parent" style="background:#6c63ff;color:#fff;padding:13px 28px;border-radius:22px;text-decoration:none;font-weight:600;font-size:14px">See the Parent Dashboard →</a>
</div>`),
  };
}

// ── Step 5: Referral ask (Day 10) ───────────────────────────────
function email_step5(name) {
  const firstName = name?.split(' ')[0] || 'there';
  return {
    subject: `${firstName}, share this with 1 friend → get 1 free month`,
    html: wrap(`
<h1 style="color:#fff;font-size:22px;margin:0 0 16px">Share the love, get rewarded ★</h1>

<div style="color:#ccccdd;font-size:14px;line-height:1.7;margin-bottom:20px">
${firstName}, if you've found Starky helpful, here's how to get more for free:
</div>

<div style="display:grid;gap:12px;margin-bottom:24px">
${[
  { emoji: '⭐', tier: '1 friend', reward: '1 free month' },
  { emoji: '🏆', tier: '5 friends', reward: '3 free months + weekly study plan' },
  { emoji: '🚀', tier: '10 friends', reward: '6 free months + unlimited sessions' },
  { emoji: '👑', tier: '25 friends', reward: '12 free months forever' },
].map(t => `<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:12px">
<span style="font-size:24px">${t.emoji}</span>
<div><div style="color:#fff;font-size:14px;font-weight:600">${t.tier}</div><div style="color:#8888aa;font-size:12px">${t.reward}</div></div>
</div>`).join('')}
</div>

<div style="text-align:center;margin-bottom:20px">
<a href="https://newworld.education/referral" style="background:#6c63ff;color:#fff;padding:13px 28px;border-radius:22px;text-decoration:none;font-weight:600;font-size:14px">Get My Referral Link →</a>
</div>

<div style="color:#8888aa;font-size:12px;text-align:center">
Or share the free test directly:<br>
<a href="https://newworld.education/free-practice-test" style="color:#6c63ff;text-decoration:none">newworld.education/free-practice-test</a>
</div>`),
  };
}

// ── Drip schedule: step → days since capture ─────────────────────
const DRIP_SCHEDULE = [
  { step: 2, daysAfter: 2, getEmail: email_step2 },
  { step: 3, daysAfter: 5, getEmail: email_step3 },
  { step: 4, daysAfter: 7, getEmail: email_step4 },
  { step: 5, daysAfter: 10, getEmail: email_step5 },
];

export default async function handler(req, res) {
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }

  const sb = getSupabase();
  if (!sb) return res.status(500).json({ error: 'Supabase not configured' });

  let sent = 0;
  let errors = 0;

  try {
    // Fetch all leads that haven't completed the drip and aren't unsubscribed
    const { data: leads } = await sb.from('leads')
      .select('*')
      .lt('drip_step', 5)
      .neq('status', 'unsubscribed')
      .order('captured_at', { ascending: true });

    if (!leads || leads.length === 0) {
      return res.status(200).json({ ok: true, sent: 0, message: 'No leads due for drip' });
    }

    const now = new Date();

    for (const lead of leads) {
      const capturedAt = new Date(lead.captured_at);
      const daysSince = Math.floor((now - capturedAt) / (1000 * 60 * 60 * 24));

      // Find the next drip step this lead is due for
      const nextDrip = DRIP_SCHEDULE.find(d => d.step === lead.drip_step + 1);
      if (!nextDrip || daysSince < nextDrip.daysAfter) continue;

      // Send the email
      try {
        const { subject, html } = nextDrip.getEmail(lead.name, lead.subject, lead.grade);

        await resend.emails.send({
          from: 'Starky from NewWorld <hello@newworld.education>',
          to: lead.email,
          subject,
          html,
        });

        // Update drip step
        await sb.from('leads').update({
          drip_step: nextDrip.step,
          last_drip_at: now.toISOString(),
          status: lead.status === 'new' ? 'welcomed' : lead.status,
        }).eq('id', lead.id);

        sent++;
      } catch (err) {
        console.error(`[Drip] Failed for ${lead.email}:`, err.message);
        errors++;
      }
    }

    console.log(`[Lead Drip] Sent ${sent} emails, ${errors} errors`);
    return res.status(200).json({ ok: true, sent, errors, leadsProcessed: leads.length });

  } catch (err) {
    console.error('[Lead Drip Error]', err);
    return res.status(500).json({ error: err.message });
  }
}
