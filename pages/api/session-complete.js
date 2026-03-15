import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';
import { sessionReportEmail, monthlyProgressEmail } from '../../utils/emailTemplates';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);
const kv = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { studentId, studentName, parentEmail, parentName, grade, subject, messages, isSEN = false, senType = null, sessionCount = 0 } = req.body;
  if (!studentId || !messages || messages.length < 2) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const analysis = await analyseSession({ messages, grade, subject, studentName, isSEN, senType });
    const sessionKey = `session:${studentId}:${Date.now()}`;
    await kv.set(sessionKey, JSON.stringify({ studentId, studentName, parentEmail, parentName, grade, subject, isSEN, senType, sessionCount, analysis, timestamp: new Date().toISOString() }));
    const sessions = await kv.get(`sessions:${studentId}`) || [];
    sessions.push(sessionKey);
    await kv.set(`sessions:${studentId}`, sessions);
    const active = await kv.get('active_students') || [];
    const idx = active.findIndex(s => s.studentId === studentId);
    const studentData = { studentId, studentName, parentEmail, parentName, grade, subject, subjects: [subject], isSEN, senType, lastActive: new Date().toISOString() };
    if (idx >= 0) active[idx] = { ...active[idx], ...studentData };
    else active.push(studentData);
    await kv.set('active_students', active);

    let emailResult = null;
    if (parentEmail) {
      emailResult = await resend.emails.send({
        from: 'Starky at NewWorld <starky@newworld.education>',
        to: [parentEmail],
        subject: `★ ${studentName}'s ${subject} session — ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}`,
        html: sessionReportEmail({ parentName, studentName, grade, subject, analysis, isSEN })
      });
    }

    res.status(200).json({ success: true, sessionKey, analysis, emailSent: !!emailResult, emailId: emailResult?.data?.id });
  } catch (error) {
    console.error('Session complete error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function analyseSession({ messages, grade, subject, studentName, isSEN, senType }) {
  const conversation = messages.map(m => `${m.role === 'user' ? studentName : 'Starky'}: ${m.content}`).join('\n');
  const prompt = `Analyse this tutoring session. Student: ${studentName}, Grade: ${grade}, Subject: ${subject}.\n\nCONVERSATION:\n${conversation}\n\nReturn ONLY JSON: {"topicsCovered":["topic"],"accuracyPercent":75,"durationMinutes":20,"strengths":["strength"],"weakAreas":["area"],"nextGoals":["goal"],"starkyPersonalMessage":"warm specific message","parentSummary":"2-3 sentences","overallMood":"positive","engagementLevel":"high","careerConnection":"career connection"}`;
  const response = await anthropic.messages.create({ model: 'claude-haiku-4-5-20251001', max_tokens: 600, system: 'Educational analyst. The session may be in Urdu — analyse in whatever language the messages are in. Return ONLY valid JSON.', messages: [{ role: 'user', content: prompt }] });
  try { return JSON.parse(response.content[0].text); }
  catch { return { topicsCovered: [subject], accuracyPercent: 70, durationMinutes: 20, strengths: ['Completed the session'], weakAreas: ['Continue practising'], nextGoals: [`Review ${subject}`], starkyPersonalMessage: `Great work today, ${studentName}! ★`, parentSummary: `${studentName} had a productive session on ${subject}.`, overallMood: 'positive', engagementLevel: 'medium', careerConnection: `${subject} opens many doors.` }; }
}
