/**
 * pages/api/school-outreach.js
 * ─────────────────────────────────────────────────────────────────
 * Send personalized school partnership emails.
 * Admin-only. Used to reach out to school principals individually.
 *
 * POST { schoolName, principalName, principalEmail, city, studentCount }
 */

import { Resend } from 'resend';
import { isAdmin } from '../../utils/apiAuth';
import { getSupabase } from '../../utils/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

const wrap = (content) => `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#ffffff;margin:0;padding:20px;font-family:Georgia,'Times New Roman',serif">
<div style="max-width:600px;margin:0 auto">
${content}
<div style="border-top:1px solid #e0e0e0;padding-top:16px;margin-top:32px;color:#888;font-size:12px">
NewWorld Education | <a href="https://newworld.education" style="color:#4F8EF7">newworld.education</a><br>
AI-Powered Cambridge Tutoring for Pakistani Schools<br>
Contact: khurram@newworld.education | +92 326 226 6682
</div>
</div></body></html>`;

function schoolEmail({ schoolName, principalName, city }) {
  const firstName = principalName?.split(' ')[0] || 'Sir/Madam';

  return wrap(`
<div style="margin-bottom:24px">
<img src="https://newworld.education/og-image.png" alt="NewWorld Education" style="height:40px;margin-bottom:16px" />
</div>

<p style="color:#333;font-size:16px;line-height:1.8;margin-bottom:16px">
Dear ${firstName},
</p>

<p style="color:#333;font-size:16px;line-height:1.8;margin-bottom:16px">
I'm writing to introduce <strong>NewWorld Education</strong> — an AI tutoring platform built specifically for Cambridge O Level and A Level students in Pakistan.
</p>

<p style="color:#333;font-size:16px;line-height:1.8;margin-bottom:20px">
We'd love to partner with <strong>${schoolName}</strong> to give your students access to a tool that:
</p>

<div style="background:#f8f9fa;border-left:4px solid #4F8EF7;padding:16px 20px;margin-bottom:20px;border-radius:0 8px 8px 0">
<div style="color:#333;font-size:15px;line-height:2">
<strong>1.</strong> Provides <strong>10,000+ Cambridge exam questions</strong> with instant AI marking<br>
<strong>2.</strong> Teaches students the <strong>exact mark scheme language</strong> examiners accept<br>
<strong>3.</strong> Detects each student's <strong>weak topics automatically</strong> and adapts<br>
<strong>4.</strong> Covers <strong>30+ Cambridge subjects</strong> with examiner-level depth<br>
<strong>5.</strong> Supports <strong>SEN students</strong> with 12 condition protocols (ADHD, Dyslexia, Autism, etc.)<br>
<strong>6.</strong> Sends <strong>parent reports</strong> after every session — full transparency
</div>
</div>

<p style="color:#333;font-size:16px;line-height:1.8;margin-bottom:16px">
<strong>Schools we work with:</strong> Nixor College, Garage School, and growing. We offer partner schools free access for their students — no cost to the school or families.
</p>

<p style="color:#333;font-size:16px;line-height:1.8;margin-bottom:20px">
I'd welcome 15 minutes to show you a live demo with a real ${schoolName} student scenario. Your teachers and students can try it immediately — there's nothing to install.
</p>

<div style="text-align:center;margin:28px 0">
<a href="https://newworld.education/school" style="background:#4F8EF7;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;font-family:Arial,sans-serif">
See the School Demo →
</a>
</div>

<p style="color:#333;font-size:16px;line-height:1.8;margin-bottom:8px">
Warm regards,<br>
<strong>Khurram Badar</strong><br>
<span style="color:#666;font-size:14px">Founder, NewWorld Education</span><br>
<span style="color:#666;font-size:14px">Former journalist — Dawn News, Gulf News</span><br>
<span style="color:#4F8EF7;font-size:14px">khurram@newworld.education | +92 326 226 6682</span>
</p>`);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!isAdmin(req)) return res.status(401).json({ error: 'Admin auth required' });

  const { schoolName, principalName, principalEmail, city, studentCount } = req.body || {};

  if (!schoolName || !principalEmail) {
    return res.status(400).json({ error: 'schoolName and principalEmail required' });
  }

  try {
    const html = schoolEmail({ schoolName, principalName: principalName || 'Sir/Madam', city });

    await resend.emails.send({
      from: 'Khurram Badar — NewWorld Education <khurram@newworld.education>',
      to: principalEmail,
      subject: `AI Tutoring Partnership for ${schoolName} — Free for Students`,
      html,
      reply_to: 'khurrambadar@gmail.com',
    });

    // Log outreach in leads table
    const sb = getSupabase();
    if (sb) {
      await sb.from('leads').upsert({
        name: principalName || schoolName,
        email: principalEmail,
        grade: 'school',
        subject: schoolName,
        country: city || 'Pakistan',
        source: 'school_outreach',
        status: 'contacted',
      }, { onConflict: 'email' });
    }

    return res.status(200).json({ ok: true, message: `Email sent to ${principalEmail}` });

  } catch (err) {
    console.error('[School Outreach Error]', err);
    return res.status(500).json({ error: err.message });
  }
}
