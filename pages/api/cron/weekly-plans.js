import { Redis } from '@upstash/redis';
import { Resend } from 'resend';
import Anthropic from '@anthropic-ai/sdk';
import { weeklyStudyPlanEmail } from '../../../utils/emailTemplates';
import { getDefaultStudyPlan } from '../../../utils/sessionAnalysis';

const resend = new Resend(process.env.RESEND_API_KEY);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).json({ error: 'Unauthorised' });
  const students = await kv.get('active_students') || [];
  let sent = 0, failed = 0;
  for (const student of students) {
    try {
      const keys = await kv.get(`sessions:${student.studentId}`) || [];
      const recent = [];
      for (const key of keys.slice(-5)) { try { const s = await kv.get(key); if (s) recent.push(typeof s === 'string' ? JSON.parse(s) : s); } catch (e) { console.warn(`[WEEKLY PLANS] Skipping corrupt session ${key}:`, e.message); } }
      const plan = await generatePlan({ studentName: student.studentName, grade: student.grade, subjects: student.subjects || [student.subject], recentAnalyses: recent.map(r => r.analysis) });
      await kv.set(`plan:${student.studentId}:current`, plan);
      await resend.emails.send({ from: 'Starky at NewWorld <starky@newworld.education>', to: [student.parentEmail], subject: `★ ${student.studentName}'s Weekly Study Plan`, html: weeklyStudyPlanEmail({ parentName: student.parentName, studentName: student.studentName, grade: student.grade, plan }) });
      sent++;
      await new Promise(r => setTimeout(r, 300));
    } catch (e) { failed++; console.error(e.message); }
  }
  res.status(200).json({ sent, failed, total: students.length });
}

async function generatePlan({ studentName, grade, subjects, recentAnalyses }) {
  const context = (recentAnalyses||[]).map(a => a ? `strengths: ${(a.strengths||[]).join(', ')}, needs: ${(a.weakAreas||[]).join(', ')}` : '').join('\n') || 'No recent data';
  const prompt = `Create a 5-day study plan for ${studentName}, Grade ${grade}. Subjects: ${subjects.join(', ')}. Recent: ${context}. Return ONLY JSON: {"weekOf":"${new Date().toDateString()}","studentName":"${studentName}","grade":"${grade}","days":[{"day":"Monday","sessions":[{"subject":"${subjects[0]}","topic":"specific topic","duration":"30 minutes","focusArea":"what to work on","tip":"practical tip"}]},{"day":"Tuesday","sessions":[{"subject":"${subjects[0]}","topic":"review","duration":"30 minutes","focusArea":"practice","tip":"tip"}]},{"day":"Wednesday","sessions":[{"subject":"${subjects[0]}","topic":"new concept","duration":"30 minutes","focusArea":"understanding","tip":"tip"}]},{"day":"Thursday","sessions":[{"subject":"${subjects[0]}","topic":"exercises","duration":"30 minutes","focusArea":"application","tip":"tip"}]},{"day":"Friday","sessions":[{"subject":"${subjects[0]}","topic":"revision","duration":"30 minutes","focusArea":"consolidation","tip":"tip"}]}],"weeklyGoal":"one specific goal","parentTip":"one coaching tip"}`;
  const r = await anthropic.messages.create({ model: /* PERMANENT: Haiku 3 only. Never change without Khurram's approval. */ 'claude-3-haiku-20240307', max_tokens: 900, system: 'Educational planner. The student may prefer Urdu — use the same language as their recent sessions. Return ONLY valid JSON.', messages: [{ role: 'user', content: prompt }] });
  try { return JSON.parse(r.content[0].text); } catch { return getDefaultStudyPlan(studentName, grade, subjects); }
}
