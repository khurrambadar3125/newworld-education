import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message, stack, component, url, time } = req.body || {};

  try {
    await resend.emails.send({
      from: 'Starky Alerts <alerts@newworld.education>',
      to: 'khurrambadar@gmail.com',
      subject: `🚨 NWE Error Detected — ${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#ff4444">🚨 NewWorld Education — Error Alert</h2>
          <p style="color:#666">An error was automatically detected and the user was shown a recovery screen.</p>
          
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;width:120px">Page</td><td style="padding:8px;border:1px solid #eee">${url || 'Unknown'}</td></tr>
            <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Time (PKT)</td><td style="padding:8px;border:1px solid #eee">${new Date(time).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</td></tr>
            <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Error</td><td style="padding:8px;border:1px solid #eee;color:#cc0000">${message || 'Unknown'}</td></tr>
          </table>

          ${stack ? `<h3>Stack Trace</h3><pre style="background:#f5f5f5;padding:12px;border-radius:6px;font-size:12px;overflow-x:auto">${stack}</pre>` : ''}
          ${component ? `<h3>Component</h3><pre style="background:#f5f5f5;padding:12px;border-radius:6px;font-size:12px;overflow-x:auto">${component}</pre>` : ''}
          
          <p style="color:#888;font-size:12px;margin-top:24px">The user saw a recovery screen and was given the option to continue their session. This email was sent automatically.</p>
        </div>
      `,
    });
  } catch (e) {
    console.error('[ERROR LOG] Failed to send alert email:', e.message);
    return res.status(500).json({ ok: false, error: 'Failed to send error alert' });
  }

  return res.status(200).json({ ok: true });
}
