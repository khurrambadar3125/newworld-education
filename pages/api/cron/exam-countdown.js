/**
 * Sends exam countdown emails to parents at 30, 14, 7, 3, and 1 day marks.
 * Checks all subscribers who have Cambridge O/A Level grades.
 * Runs daily at 04:00 UTC = 09:00 PKT.
 */
import { Resend } from 'resend';
import { getAllSubscribers } from '../../../utils/db';
import { examCountdownEmail } from '../../../utils/emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

// Cambridge Zone 4 May/June 2026 exam dates (first paper per subject)
const EXAM_DATES = {
  'Islamiyat': '2026-04-24', 'Pakistan Studies': '2026-04-28', 'Urdu': '2026-04-27',
  'English Language': '2026-04-27', 'Chemistry': '2026-04-28', 'Biology': '2026-04-30',
  'Mathematics': '2026-04-29', 'Physics': '2026-05-04', 'History': '2026-05-07',
  'Business Studies': '2026-05-11', 'Computer Science': '2026-05-13', 'Economics': '2026-05-22',
  'Accounting': '2026-05-20', 'Geography': '2026-05-07', 'Sociology': '2026-05-15',
};

const ALERT_DAYS = [30, 14, 7, 3, 1];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).end();

  const subscribers = await getAllSubscribers();
  let sent = 0;

  for (const sub of subscribers) {
    const examDate = EXAM_DATES[sub.subject];
    if (!examDate) continue;

    const daysToExam = Math.ceil((new Date(examDate) - new Date()) / 86400000);
    if (!ALERT_DAYS.includes(daysToExam)) continue;

    try {
      await resend.emails.send({
        from: 'Starky ★ <hello@newworld.education>',
        to: sub.email,
        subject: `⏱️ ${daysToExam} days until ${sub.subject} exam — ${sub.name}`,
        html: examCountdownEmail({
          parentName: sub.name,
          studentName: sub.name,
          grade: sub.grade,
          subject: sub.subject,
          daysToExam,
          examDate: new Date(examDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
        }),
      });
      sent++;
      await new Promise(r => setTimeout(r, 200));
    } catch (e) { console.error(`[EXAM COUNTDOWN] Failed for ${sub.email}:`, e.message); }
  }

  return res.status(200).json({ sent, total: subscribers.length });
}
