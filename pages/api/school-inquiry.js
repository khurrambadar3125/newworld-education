import { Resend } from 'resend';

// Rate limit: max 3 inquiries per IP per hour
const inquiryRateMap = new Map();
function checkInquiryRate(ip) {
  const now = Date.now();
  const entry = inquiryRateMap.get(ip);
  if (!entry || now - entry.t > 3600000) { inquiryRateMap.set(ip, { t: now, c: 1 }); return true; }
  if (entry.c >= 3) return false;
  entry.c++;
  return true;
}

// Sanitize HTML to prevent XSS in emails
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const ip = req.headers['x-forwarded-for'] || 'unknown';
  if (!checkInquiryRate(ip)) {
    return res.status(429).json({ error: 'Too many inquiries. Please try again later.' });
  }

  const { name, school, city, email, phone, students, message } = req.body;
  if (!name || !school || !email) return res.status(400).json({ error: 'Missing fields' });

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Starky <starky@newworld.education>',
      to: 'khurrambadar@gmail.com',
      subject: `🏫 School Inquiry — ${esc(school)} (${esc(city) || 'Unknown city'})`,
      html: `<div style="font-family:sans-serif;max-width:520px;margin:auto;background:#0D1221;color:#fff;border-radius:16px;padding:32px">
        <h2 style="color:#4F8EF7;margin:0 0 20px">New School Inquiry</h2>
        <table style="width:100%;border-collapse:collapse">
          ${[['Name', esc(name)],['School', esc(school)],['City', esc(city)],['Email', esc(email)],['Phone', esc(phone)],['Students', esc(students)],['Message', esc(message)]].map(([k,v]) => v ? `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);font-size:13px;width:100px">${k}</td><td style="padding:8px 0;font-size:15px">${v}</td></tr>` : '').join('')}
        </table>
        <a href="mailto:${esc(email)}" style="display:block;text-align:center;background:#4F8EF7;color:#fff;text-decoration:none;padding:12px;border-radius:10px;font-weight:700;margin-top:24px">Reply to ${esc(name)} →</a>
      </div>`
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[school-inquiry]', err?.message);
    return res.status(500).json({ error: 'Failed to send inquiry. Please try again.' });
  }
}
