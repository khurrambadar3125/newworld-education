/**
 * pages/api/lead-capture.js
 * ─────────────────────────────────────────────────────────────────
 * Captures email leads from landing pages and lead magnets.
 * Stores in Supabase leads table + sends welcome email.
 *
 * POST { name, email, grade, subject, source, country }
 */

import { Resend } from 'resend';
import { getSupabase } from '../../utils/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting
const rateMap = new Map();
function checkRate(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.t > 3600000) { rateMap.set(ip, { t: now, c: 1 }); return true; }
  if (entry.c >= 5) return false; // 5 signups per IP per hour
  entry.c++;
  return true;
}

const wrap = (content) => `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#0a0a1a;margin:0;padding:20px;font-family:Arial,sans-serif">
<div style="max-width:580px;margin:0 auto">
<div style="text-align:center;padding:28px 20px;background:linear-gradient(135deg,#0d0d2b,#1a1a3e);border-radius:14px 14px 0 0;border-bottom:2px solid #6c63ff">
<div style="font-size:36px">★</div>
<div style="color:#6c63ff;font-size:20px;font-weight:700">NewWorld Education</div>
<div style="color:#8888aa;font-size:13px;margin-top:4px">Every child deserves a world-class tutor</div>
</div>
<div style="background:#111128;padding:28px 22px;border-radius:0 0 14px 14px">${content}</div>
<div style="text-align:center;padding:16px;color:#555570;font-size:12px">★ Starky from NewWorld Education | <a href="https://newworld.education" style="color:#6c63ff;text-decoration:none">newworld.education</a><br>
<a href="https://newworld.education/unsubscribe?email=%%EMAIL%%" style="color:#555570;text-decoration:underline;font-size:11px">Unsubscribe</a></div>
</div></body></html>`;

function welcomeEmail(name, grade, subject) {
  const firstName = name?.split(' ')[0] || 'there';
  return wrap(`
<h1 style="color:#fff;font-size:22px;margin:0 0 6px">Welcome, ${firstName}! ★</h1>
<div style="color:#8888aa;font-size:13px;margin-bottom:20px">${grade ? grade + ' · ' : ''}${subject || 'All subjects'}</div>

<div style="color:#ccccdd;font-size:14px;line-height:1.8;margin-bottom:20px">
You've just unlocked something special. Starky is an AI tutor built by Cambridge-trained educators who knows <strong style="color:#fff">exactly</strong> what examiners want to see in your answers.
</div>

<div style="background:linear-gradient(135deg,#1a1a3e,#2a1a4e);border-radius:12px;padding:20px;margin-bottom:20px">
<div style="color:#6c63ff;font-size:12px;font-weight:600;letter-spacing:1px;margin-bottom:12px">WHAT YOU GET — FREE</div>
<div style="color:#ccccdd;font-size:13px;line-height:2">
✅ 10 free AI tutoring sessions<br>
✅ 10,000+ Cambridge exam questions with instant marking<br>
✅ Mark scheme language that examiners actually accept<br>
✅ Weakness detection — Starky finds your blind spots<br>
✅ Works in English, Urdu, and 14 other languages
</div>
</div>

<div style="text-align:center;margin-bottom:20px">
<a href="https://newworld.education/drill" style="background:#6c63ff;color:#fff;padding:14px 32px;border-radius:24px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block">Start Practising Now →</a>
</div>

<div style="background:#0d2d1a;border:1px solid #4ade8033;border-radius:10px;padding:16px;margin-bottom:16px">
<div style="color:#4ade80;font-size:11px;font-weight:600;letter-spacing:1px;margin-bottom:8px">DID YOU KNOW?</div>
<div style="color:#ccccdd;font-size:13px;line-height:1.6">
The difference between an A and an A* is often just <strong style="color:#fff">using the right words</strong>. Cambridge examiners have specific phrases they look for — and reject. Starky knows every single one.
</div>
</div>

<div style="color:#8888aa;font-size:12px;margin-top:16px">
Over the next few days, I'll send you:<br>
• A free diagnostic question for ${subject || 'your subject'}<br>
• The #1 mistake students make in exams (and how to avoid it)<br>
• A study plan built for ${grade || 'your level'}<br><br>
Talk soon,<br>
<strong style="color:#6c63ff">★ Starky</strong>
</div>`);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  if (!checkRate(ip)) return res.status(429).json({ error: 'Too many attempts. Try again later.' });

  const { name, email, grade, subject, source = 'organic', country = 'Pakistan' } = req.body || {};

  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
  if (!email.includes('@') || email.length < 5) return res.status(400).json({ error: 'Invalid email' });

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim().slice(0, 100);

  try {
    const sb = getSupabase();

    // Check for duplicate
    if (sb) {
      const { data: existing } = await sb.from('leads').select('id').eq('email', cleanEmail).single();
      if (existing) {
        return res.status(200).json({ ok: true, message: 'Already registered', existing: true });
      }

      // Save lead
      await sb.from('leads').insert({
        name: cleanName,
        email: cleanEmail,
        grade: grade || null,
        subject: subject || null,
        country: country || 'Pakistan',
        source,
        status: 'new',
      });
    }

    // Send welcome email
    const emailHtml = welcomeEmail(cleanName, grade, subject).replace('%%EMAIL%%', encodeURIComponent(cleanEmail));
    await resend.emails.send({
      from: 'Starky from NewWorld <hello@newworld.education>',
      to: cleanEmail,
      subject: `Welcome, ${cleanName.split(' ')[0]}! Your A* journey starts now ★`,
      html: emailHtml,
    });

    // Notify Khurram
    await resend.emails.send({
      from: 'NewWorld Leads <alerts@newworld.education>',
      to: 'khurrambadar@gmail.com',
      subject: `New lead: ${cleanName} (${grade || 'unknown grade'}) — ${source}`,
      html: `<p><strong>${cleanName}</strong> (${cleanEmail})</p><p>Grade: ${grade || 'N/A'} | Subject: ${subject || 'N/A'} | Source: ${source} | Country: ${country}</p>`,
    });

    return res.status(200).json({ ok: true, message: 'Welcome email sent' });

  } catch (err) {
    console.error('[Lead Capture Error]', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
