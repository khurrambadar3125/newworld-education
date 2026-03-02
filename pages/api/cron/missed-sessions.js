// pages/api/cron/missed-sessions.js - Every day 5:00 AM UTC (10:00 AM PKT)
import { kv } from '@vercel/kv';
import { Resend } from 'resend';
import { missedSessionEmail } from '../../../utils/emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).json({ error: 'Unauthorised' });
  const activeRaw = await kv.get('active_students') || '[]';
  const students = JSON.parse(activeRaw);
  let nudgesSent = 0;

  for (const student of students) {
    try {
      const keys = JSON.parse(await kv.get(`sessions:${student.studentId}`) || '[]');
      if (!keys.length) continue;
      const last = JSON.parse(await kv.get(keys[keys.length - 1]) || '{}');
      if (!last.timestamp) continue;
      const hours = (Date.now() - new Date(last.timestamp)) / 3600000;
      if (hours < 48) continue;
      const lastNudge = await kv.get(`last_nudge:${student.studentId}`);
      if (lastNudge && (Date.now() - new Date(JSON.parse(lastNudge))) / 3600000 < 72) continue;
      if (!student.parentEmail) continue;
      await resend.emails.send({ from: 'Starky at NewWorld <starky@newworld.education>', to: [student.parentEmail], subject: `★ ${student.studentName} hasn't studied in ${Math.round(hours/24)} days`, html: missedSessionEmail({ parentName: student.parentName, studentName: student.studentName, grade: student.grade, hoursMissed: Math.round(hours), lastSubject: last.subject }) });
      await kv.set(`last_nudge:${student.studentId}`, JSON.stringify(new Date().toISOString()));
      nudgesSent++;
      await new Promise(r => setTimeout(r, 300));
    } catch (e) { console.error(`Nudge failed for ${student.studentId}:`, e.message); }
  }
  res.status(200).json({ nudgesSent, total: students.length });
}
