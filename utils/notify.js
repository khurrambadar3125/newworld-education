/**
 * utils/notify.js
 * Centralised notification system for NewWorldEdu.
 * Sends via email (Resend) and optionally WhatsApp (Twilio).
 *
 * Usage:
 *   import { notify } from '../utils/notify';
 *   await notify({ to: 'parent@email.com', phone: '03001234567', subject: '...', html: '...', whatsappText: '...' });
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Normalise Pakistan phone numbers ──────────────────────────────────────
function normalisePK(phone) {
  if (!phone) return null;
  let p = phone.replace(/[\s\-()]/g, '');
  if (p.startsWith('03') && p.length === 11) p = '+92' + p.slice(1);
  if (p.startsWith('92') && !p.startsWith('+')) p = '+' + p;
  if (p.startsWith('+92') && p.length >= 12) return p;
  return null;
}

// ── Send WhatsApp via Twilio ──────────────────────────────────────────────
async function sendWhatsApp(phone, message) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!sid || !token || !from) return { sent: false, reason: 'Twilio not configured' };

  const to = normalisePK(phone);
  if (!to) return { sent: false, reason: 'Invalid phone' };

  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ From: from, To: `whatsapp:${to}`, Body: message }),
    });
    const data = await res.json();
    return data.sid ? { sent: true, sid: data.sid } : { sent: false, reason: data.message };
  } catch (e) {
    return { sent: false, reason: e.message };
  }
}

// ── Send email via Resend ─────────────────────────────────────────────────
async function sendEmail(to, subject, html) {
  if (!to || !process.env.RESEND_API_KEY) return { sent: false, reason: 'No email or API key' };
  try {
    await resend.emails.send({
      from: 'Starky ★ <hello@newworld.education>',
      to,
      subject,
      html,
    });
    return { sent: true };
  } catch (e) {
    return { sent: false, reason: e.message };
  }
}

// ── Simple email template wrapper ─────────────────────────────────────────
function simpleEmail(title, body, ctaText, ctaUrl) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#0a0a1a;margin:0;padding:20px;font-family:Arial,sans-serif">
<div style="max-width:520px;margin:0 auto">
<div style="text-align:center;padding:24px 20px;background:linear-gradient(135deg,#0d0d2b,#1a1a3e);border-radius:14px 14px 0 0;border-bottom:2px solid #6c63ff">
<div style="font-size:32px">★</div>
<div style="color:#6c63ff;font-size:18px;font-weight:700">NewWorld Education</div>
</div>
<div style="background:#111128;padding:24px 20px;border-radius:0 0 14px 14px">
<h2 style="color:#fff;font-size:20px;margin:0 0 12px">${title}</h2>
<div style="color:#ccccdd;font-size:14px;line-height:1.7;margin-bottom:20px">${body}</div>
${ctaText ? `<a href="${ctaUrl || 'https://www.newworld.education'}" style="display:block;text-align:center;background:linear-gradient(135deg,#6c63ff,#4F8EF7);color:#fff;padding:14px;border-radius:100px;text-decoration:none;font-weight:700;font-size:15px">${ctaText}</a>` : ''}
</div>
<div style="text-align:center;padding:12px;color:#555570;font-size:11px">★ Starky from NewWorld Education</div>
</div></body></html>`;
}

/**
 * Send a notification via all available channels.
 * @param {object} opts
 * @param {string} opts.to — email address
 * @param {string} [opts.phone] — Pakistan phone number (03xx or +92xx)
 * @param {string} opts.subject — email subject line
 * @param {string} [opts.html] — full HTML email body (overrides simple template)
 * @param {string} [opts.title] — simple email title (used with body/cta)
 * @param {string} [opts.body] — simple email body text
 * @param {string} [opts.ctaText] — button text
 * @param {string} [opts.ctaUrl] — button URL
 * @param {string} [opts.whatsappText] — WhatsApp message text
 */
export async function notify(opts) {
  const results = { email: null, whatsapp: null };

  // Email
  const html = opts.html || simpleEmail(opts.title || opts.subject, opts.body || '', opts.ctaText, opts.ctaUrl);
  if (opts.to) {
    results.email = await sendEmail(opts.to, opts.subject, html);
  }

  // WhatsApp
  if (opts.phone && opts.whatsappText) {
    results.whatsapp = await sendWhatsApp(opts.phone, opts.whatsappText);
  }

  return results;
}
