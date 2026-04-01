import { Redis } from '@upstash/redis';
import { Resend } from 'resend';
import { missedSessionEmail } from '../../../utils/emailTemplates';
import { notify } from '../../../utils/notify';

const resend = new Resend(process.env.RESEND_API_KEY);
const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

export default async function handler(req, res) {
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).json({ error: 'Unauthorised' });
  const students = await kv.get('active_students') || [];
  let nudgesSent = 0;
  for (const student of students) {
    try {
      const keys = await kv.get(`sessions:${student.studentId}`) || [];
      if (!keys.length) continue;
      const last = await kv.get(keys[keys.length - 1]);
      if (!last) continue;
      const lastData = typeof last === 'string' ? JSON.parse(last) : last;
      if (!lastData.timestamp) continue;
      const hours = (Date.now() - new Date(lastData.timestamp)) / 3600000;
      if (hours < 48) continue;
      const lastNudge = await kv.get(`last_nudge:${student.studentId}`);
      if (lastNudge && (Date.now() - new Date(lastNudge)) / 3600000 < 72) continue;
      if (!student.parentEmail) continue;
      // Notify parent
      await resend.emails.send({ from: 'Starky at NewWorld <starky@newworld.education>', to: [student.parentEmail], subject: `★ ${student.studentName} hasn't studied in ${Math.round(hours/24)} days`, html: missedSessionEmail({ parentName: student.parentName, studentName: student.studentName, grade: student.grade, hoursMissed: Math.round(hours), lastSubject: lastData.subject }) });
      // Also nudge the student directly
      if (student.studentId && student.studentId.includes('@')) {
        notify({
          to: student.studentId,
          subject: `Hey ${student.studentName}! Starky misses you ★`,
          title: 'Time to study?',
          body: `It's been ${Math.round(hours/24)} days since your last session${lastData.subject ? ` on <strong>${lastData.subject}</strong>` : ''}. Your progress is saved — pick up where you left off!`,
          ctaText: 'Study with Starky →',
          ctaUrl: 'https://www.newworld.education',
        }).catch(() => {});
      }
      await kv.set(`last_nudge:${student.studentId}`, new Date().toISOString());
      nudgesSent++;
      await new Promise(r => setTimeout(r, 300));
    } catch (e) { console.error(e.message); }
  }
  res.status(200).json({ nudgesSent, total: students.length });
}
