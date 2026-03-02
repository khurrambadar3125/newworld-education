// pages/api/session-complete.js
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { kv } from '@vercel/kv';
import { sessionReportEmail, monthlyProgressEmail } from '../../utils/emailTemplates';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { studentId, studentName, parentEmail, parentName, grade, subject, messages, isSEN = false, senType = null, sessionCount = 0, examDates = {} } = req.body;
  if (!studentId || !messages || messages.length < 2) return res.status(400).json({ error: 'Missing required fields' });

  try {
    // 1. Analyse session
    const analysis = await analyseSession({ messages, grade, subject, studentName, isSEN, senType });

    // 2. Store in KV
    const sessionKey = `session:${studentId}:${Date.now()}`;
    await kv.set(sessionKey, JSON.stringify({ studentId, studentName, parentEmail, parentName, grade, subject, isSEN, senType, sessionCount, analysis, timestamp: new Date().toISOString() }));
    const sessionsRaw = await kv.get(`sessions:${studentId}`) || '[]';
    const sessions = JSON.parse(sessionsRaw);
    sessions.push(sessionKey);
    await kv.set(`sessions:${studentId}`, JSON.stringify(sessions));

    // 3. Update active students
    await updateActiveStudent(kv, { studentId, studentName, parentEmail, parentName, grade, subject, subjects: [subject], isSEN, senType, examDates, lastActive: new Date().toISOString() });

    // 4. Send session email
    let emailResult = null;
    if (parentEmail) {
      emailResult = await resend.emails.send({
        from: 'Starky at NewWorld <starky@newworld.education>',
        to: [parentEmail],
        subject: `★ ${studentName}'s ${subject} session — ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}`,
        html: sessionReportEmail({ parentName, studentName, grade, subject, analysis, isSEN })
      });
    }

    // 5. Monthly progress (1st of month)
    if (new Date().getDate() === 1 && parentEmail) {
      try {
        const allSessionsRaw = await kv.get(`sessions:${studentId}`) || '[]';
        const allKeys = JSON.parse(allSessionsRaw);
        const monthSessions = [];
        for (const key of allKeys.slice(-20)) {
          const s = await kv.get(key);
          if (s) monthSessions.push(JSON.parse(s));
        }
        if (monthSessions.length >= 3) {
          const progress = { headline: `${studentName} completed ${monthSessions.length} sessions this month!`, keyAchievements: [`${monthSessions.length} sessions completed`, 'Consistent learning habit building'], certificateEarned: monthSessions.length >= 10 ? 'Super Learner' : 'Dedicated Student', parentCoachingTip: 'Celebrate the habit of showing up — consistency is the most important skill.' };
          await resend.emails.send({ from: 'Starky at NewWorld <starky@newworld.education>', to: [parentEmail], subject: `★ ${studentName}'s Monthly Progress — ${new Date().toLocaleString('default', { month: 'long' })}`, html: monthlyProgressEmail({ parentName, studentName, grade, progress, sessionCount: monthSessions.length }) });
        }
      } catch (e) { console.error('Monthly email failed:', e); }
    }

    res.status(200).json({ success: true, sessionKey, analysis, emailSent: !!emailResult, emailId: emailResult?.data?.id });
  } catch (error) {
    console.error('Session complete error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function analyseSession({ messages, grade, subject, studentName, isSEN, senType }) {
  const conversation = messages.map(m => `${m.role === 'user' ? studentName : 'Starky'}: ${m.content}`).join('\n');
  const prompt = isSEN
    ? `Analyse this SEN tutoring session. Student: ${studentName}, Grade: ${grade}, Subject: ${subject}, SEN: ${senType}.\n\nCONVERSATION:\n${conversation}\n\nReturn ONLY JSON: {"topicsCovered":["topic"],"focusDurationMinutes":15,"emotionalComfort":"comfortable","independentResponses":5,"communicationAttempts":8,"strengths":["strength"],"supportsNeeded":["support"],"nextGoals":["goal"],"starkyPersonalMessage":"warm specific message","parentSummary":"2-3 sentences","overallMood":"positive","progressIndicators":["progress"]}`
    : `Analyse this tutoring session. Student: ${studentName}, Grade: ${grade}, Subject: ${subject}.\n\nCONVERSATION:\n${conversation}\n\nReturn ONLY JSON: {"topicsCovered":["topic"],"accuracyPercent":75,"durationMinutes":20,"strengths":["strength"],"weakAreas":["area"],"nextGoals":["goal"],"starkyPersonalMessage":"warm specific message","parentSummary":"2-3 sentences","overallMood":"positive","engagementLevel":"high","careerConnection":"career connection"}`;

  const response = await anthropic.messages.create({ model: 'claude-haiku-4-5-20251001', max_tokens: 600, system: 'You are an expert educational analyst. Respond ONLY with valid JSON. No markdown.', messages: [{ role: 'user', content: prompt }] });
  try { return JSON.parse(response.content[0].text); }
  catch { return { topicsCovered: [subject], accuracyPercent: 70, durationMinutes: 20, strengths: ['Completed the session'], weakAreas: ['Continue practising'], nextGoals: [`Review ${subject}`], starkyPersonalMessage: `Great work today, ${studentName}! ★`, parentSummary: `${studentName} had a productive session on ${subject}.`, overallMood: 'positive', engagementLevel: 'medium', careerConnection: `${subject} opens many doors.` }; }
}

async function updateActiveStudent(kv, studentData) {
  try {
    const raw = await kv.get('active_students') || '[]';
    const active = JSON.parse(raw);
    const idx = active.findIndex(s => s.studentId === studentData.studentId);
    if (idx >= 0) {
      const merged = [...new Set([...(active[idx].subjects||[]), ...studentData.subjects])];
      active[idx] = { ...active[idx], ...studentData, subjects: merged };
    } else { active.push(studentData); }
    await kv.set('active_students', JSON.stringify(active));
  } catch (e) { console.error('Update active students failed:', e); }
}
