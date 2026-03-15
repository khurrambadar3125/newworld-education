import { Resend } from 'resend';
import { saveSubscriber, isSubscribed } from '../../utils/db';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, grade, subject, studyTime } = req.body || {};

  if (!name || !email || !grade || !subject || !studyTime) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    // Check if already subscribed
    const already = await isSubscribed(email);
    if (already) {
      return res.status(400).json({ error: 'This email is already subscribed! Check your inbox.' });
    }

    // Save to KV database
    await saveSubscriber({ name, email, grade, subject, studyTime });

    // Validate studyTime is HH:MM format; convert to friendly label
    const validTimes = {
      '06:00':'6:00 AM','07:00':'7:00 AM','08:00':'8:00 AM',
      '14:00':'2:00 PM','15:00':'3:00 PM','16:00':'4:00 PM',
      '18:00':'6:00 PM','19:00':'7:00 PM','20:00':'8:00 PM',
      '21:00':'9:00 PM',
    };
    const timeLabel = validTimes[studyTime] || (/^\d{2}:\d{2}$/.test(studyTime) ? studyTime : '8:00 AM');

    // Welcome email to subscriber
    await resend.emails.send({
      from: 'Starky ★ <hello@newworld.education>',
      to: email,
      subject: `Welcome to NewWorldEdu ★ — your daily ${subject} question starts tomorrow`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;max-width:520px;margin:0 auto;background:#080C18;color:#fff;border-radius:16px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#4F8EF7,#7C5CBF);padding:32px 28px;text-align:center">
            <div style="font-size:48px;margin-bottom:12px">★</div>
            <h1 style="font-size:24px;font-weight:800;margin:0 0 8px;color:#fff">You're subscribed!</h1>
            <p style="font-size:14px;color:rgba(255,255,255,0.8);margin:0">Welcome to NewWorldEdu, ${name.split(' ')[0]}</p>
          </div>
          <div style="padding:28px">
            <p style="font-size:15px;line-height:1.7;color:rgba(255,255,255,0.75);margin:0 0 20px">
              Starting <strong>tomorrow</strong>, you'll receive one carefully crafted <strong style="color:#4F8EF7">${subject}</strong> question at <strong style="color:#4F8EF7">${timeLabel}</strong> every day.
            </p>
            <div style="background:rgba(79,142,247,0.1);border:1px solid rgba(79,142,247,0.25);border-radius:12px;padding:18px;margin-bottom:24px">
              <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.4);letter-spacing:0.08em;margin-bottom:10px">YOUR SUBSCRIPTION</div>
              <div style="font-size:14px;color:rgba(255,255,255,0.75);line-height:1.8">
                📚 Grade: <strong>${grade}</strong><br/>
                🎯 Subject: <strong>${subject}</strong><br/>
                ⏰ Daily at: <strong>${timeLabel}</strong>
              </div>
            </div>
            <a href="https://www.newworld.education" style="display:block;background:linear-gradient(135deg,#4F8EF7,#6366F1);color:#fff;text-decoration:none;border-radius:12px;padding:14px 24px;text-align:center;font-weight:700;font-size:15px;margin-bottom:16px">
              Start Learning with Starky ★ →
            </a>
            <p style="font-size:11px;color:rgba(255,255,255,0.25);text-align:center;margin:0;line-height:1.6">
              One email per day. No spam. Reply STOP to unsubscribe.
            </p>
          </div>
        </div>
      `,
    });

    // Notify Khurram
    await resend.emails.send({
      from: 'NWE Signups <alerts@newworld.education>',
      to: 'khurrambadar@gmail.com',
      subject: `🎉 New subscriber — ${name} (${grade} · ${subject})`,
      html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px"><h2 style="color:#4F8EF7">New Subscriber 🎉</h2><table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px"><tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;width:100px">Name</td><td style="padding:8px;border:1px solid #eee">${name}</td></tr><tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #eee">${email}</td></tr><tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Grade</td><td style="padding:8px;border:1px solid #eee">${grade}</td></tr><tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Subject</td><td style="padding:8px;border:1px solid #eee">${subject}</td></tr><tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Study Time</td><td style="padding:8px;border:1px solid #eee">${timeLabel}</td></tr></table><p style="color:#4F8EF7;font-weight:bold">✅ Automatically saved to database — they will receive daily questions starting tomorrow.</p></div>`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
