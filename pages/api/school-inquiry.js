import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, school, city, email, phone, students, message } = req.body;
  if (!name || !school || !email) return res.status(400).json({ error: 'Missing fields' });

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'Starky <starky@newworld.education>',
    to: 'khurrambadar@gmail.com',
    subject: `🏫 School Inquiry — ${school} (${city || 'Unknown city'})`,
    html: `<div style="font-family:sans-serif;max-width:520px;margin:auto;background:#0D1221;color:#fff;border-radius:16px;padding:32px">
      <h2 style="color:#4F8EF7;margin:0 0 20px">New School Inquiry</h2>
      <table style="width:100%;border-collapse:collapse">
        ${[['Name', name],['School', school],['City', city],['Email', email],['Phone', phone],['Students', students],['Message', message]].map(([k,v]) => v ? `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);font-size:13px;width:100px">${k}</td><td style="padding:8px 0;font-size:15px">${v}</td></tr>` : '').join('')}
      </table>
      <a href="mailto:${email}" style="display:block;text-align:center;background:#4F8EF7;color:#fff;text-decoration:none;padding:12px;border-radius:10px;font-weight:700;margin-top:24px">Reply to ${name} →</a>
    </div>`
  });

  return res.status(200).json({ ok: true });
}
