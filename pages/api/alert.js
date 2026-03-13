/**
 * pages/api/alert.js
 * Sends parent alerts when Starky detects distress or abuse disclosures.
 *
 * Channels (in order of priority):
 *   1. WhatsApp via Twilio  — requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM
 *   2. Email via Resend     — requires RESEND_API_KEY, ALERT_FROM_EMAIL
 *
 * If neither is configured, logs to console (graceful degradation).
 * Called internally by /api/anthropic — not exposed to client directly.
 *
 * Body: { alertType, alertLevel, studentName, parentPhone, parentEmail, alertMessage, timestamp }
 */

const ALLOWED_ORIGINS = [
  'https://newworld.education',
  'https://www.newworld.education',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
].filter(Boolean);

// ─── WhatsApp via Twilio ──────────────────────────────────────────────────────

async function sendWhatsApp({ to, message }) {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from  = process.env.TWILIO_WHATSAPP_FROM; // e.g. whatsapp:+14155238886

  if (!sid || !token || !from) return { sent: false, reason: 'Twilio not configured' };

  // Normalise Pakistan numbers: 03xx → +923xx
  let normalised = to.trim().replace(/\s+/g, '');
  if (normalised.startsWith('03')) normalised = '+92' + normalised.slice(1);
  if (!normalised.startsWith('+')) normalised = '+' + normalised;
  const toWhatsApp = `whatsapp:${normalised}`;

  const body = new URLSearchParams({
    From: from,
    To: toWhatsApp,
    Body: message,
  });

  const resp = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
      },
      body: body.toString(),
    }
  );

  const data = await resp.json();
  if (!resp.ok) {
    console.error('[WHATSAPP ERROR]', data);
    return { sent: false, reason: data?.message || 'Twilio error' };
  }
  return { sent: true, sid: data.sid };
}

// ─── Email via Resend ─────────────────────────────────────────────────────────

async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from   = process.env.ALERT_FROM_EMAIL || 'alerts@newworld.education';

  if (!apiKey) return { sent: false, reason: 'Resend not configured' };

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  const data = await resp.json();
  if (!resp.ok) {
    console.error('[EMAIL ERROR]', data);
    return { sent: false, reason: data?.message || 'Resend error' };
  }
  return { sent: true, id: data.id };
}

// ─── Message builders ─────────────────────────────────────────────────────────

function buildWhatsAppMessage({ alertType, studentName, alertMessage }) {
  const urgency = alertType === 'DISTRESS' || alertType === 'ABUSE_DISCLOSURE'
    ? '⚠️ *URGENT — Please check on your child immediately*'
    : '📢 *Notice from NewWorldEdu*';

  return `${urgency}

Hello, this is an automated message from *NewWorldEdu Starky*.

Your child *${studentName || 'your child'}* may need your attention right now.

${alertMessage || 'Please check on them and review their recent activity.'}

This alert was sent automatically because our system detected something that needs a parent\'s attention.

If you have concerns, please contact: support@newworld.education

_NewWorldEdu — newworld.education_`;
}

function buildEmailHtml({ alertType, studentName, alertMessage, timestamp }) {
  const isUrgent = alertType === 'DISTRESS' || alertType === 'ABUSE_DISCLOSURE';
  const colour   = isUrgent ? '#E24B4A' : '#EF9F27';
  const label    = isUrgent ? 'URGENT ALERT' : 'NOTICE';
  const time     = timestamp ? new Date(timestamp).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }) : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:100%">

        <!-- Header -->
        <tr><td style="background:${colour};padding:20px 28px">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:.1em;color:#fff;text-transform:uppercase">${label}</p>
          <h1 style="margin:6px 0 0;font-size:22px;color:#fff;font-weight:700">NewWorldEdu Starky</h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:28px">
          <p style="margin:0 0 16px;font-size:16px;color:#1a1a1a">Dear Parent / Guardian,</p>
          <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6">
            Your child <strong>${studentName || 'your child'}</strong> may need your attention.
          </p>
          <div style="background:#fff8f0;border-left:4px solid ${colour};border-radius:0 8px 8px 0;padding:16px 18px;margin:0 0 20px">
            <p style="margin:0;font-size:14px;color:#555;line-height:1.6">${alertMessage || 'Please check on your child and review their recent Starky session.'}</p>
          </div>
          <p style="margin:0 0 8px;font-size:14px;color:#555;line-height:1.6">
            This message was sent automatically because our AI tutor Starky detected something in the conversation that a parent should know about.
          </p>
          ${time ? `<p style="margin:0 0 20px;font-size:12px;color:#999">Detected at: ${time} (Pakistan time)</p>` : ''}
          <p style="margin:0;font-size:14px;color:#555">If you have any concerns, please email us at <a href="mailto:support@newworld.education" style="color:#4F8EF7">support@newworld.education</a></p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9f9f9;padding:16px 28px;border-top:1px solid #eee">
          <p style="margin:0;font-size:12px;color:#999">NewWorldEdu — <a href="https://www.newworld.education" style="color:#4F8EF7">newworld.education</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    alertType    = 'DISTRESS',
    alertLevel   = 'URGENT',
    studentName  = '',
    parentPhone  = '',
    parentEmail  = '',
    alertMessage = '',
    timestamp    = new Date().toISOString(),
  } = req.body || {};

  // Always log — even if channels fail
  console.error('[PARENT ALERT FIRED]', {
    alertType, alertLevel, studentName,
    hasPhone: !!parentPhone, hasEmail: !!parentEmail, timestamp,
  });

  const results = { whatsapp: null, email: null };

  // ── WhatsApp ──────────────────────────────────────────────────────────────
  if (parentPhone) {
    try {
      results.whatsapp = await sendWhatsApp({
        to: parentPhone,
        message: buildWhatsAppMessage({ alertType, studentName, alertMessage }),
      });
    } catch (e) {
      results.whatsapp = { sent: false, reason: e.message };
      console.error('[WHATSAPP EXCEPTION]', e);
    }
  } else {
    results.whatsapp = { sent: false, reason: 'No parent phone on file' };
  }

  // ── Email ─────────────────────────────────────────────────────────────────
  if (parentEmail) {
    try {
      const isUrgent = alertType === 'DISTRESS' || alertType === 'ABUSE_DISCLOSURE';
      results.email = await sendEmail({
        to: parentEmail,
        subject: isUrgent
          ? `⚠️ Urgent: ${studentName || 'Your child'} may need you — NewWorldEdu`
          : `Notice from NewWorldEdu about ${studentName || 'your child'}`,
        html: buildEmailHtml({ alertType, studentName, alertMessage, timestamp }),
      });
    } catch (e) {
      results.email = { sent: false, reason: e.message };
      console.error('[EMAIL EXCEPTION]', e);
    }
  } else {
    results.email = { sent: false, reason: 'No parent email on file' };
  }

  const anySent = results.whatsapp?.sent || results.email?.sent;
  console.log('[PARENT ALERT RESULT]', results);

  return res.status(200).json({
    alerted: anySent,
    results,
  });
}
