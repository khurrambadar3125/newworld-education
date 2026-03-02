// pages/api/cron/weekly-plans.js - Every Sunday 4:00 AM UTC (9:00 AM PKT)
import { kv } from '@vercel/kv';
import { Resend } from 'resend';
import Anthropic from '@anthropic-ai/sdk';
import { weeklyStudyPlanEmail } from '../../../utils/emailTemplates';
import { getDefaultStudyPlan } from '../../../utils/sessionAnalysis';

const resend = new Resend(process.env.RESEND_API_KEY);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).json({ error: 'Unauthorised' });
  const activeRaw = await kv.get('active_students') || '[]';
  const students = JSON.parse(activeRaw);
  let sent = 0, failed = 0;

  for (const student of students) {
    try {
      const sessionsRaw = await kv.get(`sessions:${student.studentId}`) || '[]';
      const keys = JSON.parse(sessionsRaw);
      const recent = [];
      for (const key of keys.slice(-5)) { const s = await kv.get(key); if (s) recent.push(JSON.parse(s).analysis); }

      const plan = await generatePlan({ studentName: student.studentName, grade: student.grade, subjects: student.subjects || [student.subject], recentAnalyses: recent });
      await kv.set(`plan:${student.studentId}:current`, JSON.stringify(plan));
      await resend.emails.send({ from: 'Starky at NewWorld <starky@newworld.education>', to: [student.parentEmail], subject: `★ ${student.studentName}'s Weekly Study Plan`, html: weeklyStudyPlanEmail({ parentName: student.parentName, studentName: student.studentName, grade: student.grade, plan }) });
      sent++;
      await new Promise(r => setTimeout(r, 300));
    } catch (e) { failed++; console.error(`Failed for ${student.studentId}:`, e.message); }
  }
  res.status(200).json({ sent, failed, total: students.length });
}

async function generatePlan({ studentName, grade, subjects, recentAnalyses }) {
  const context = recentAnalyses.map(a => `strengths: ${(a.strengths||[]).join(', ')}, needs: ${(a.weakAreas||[]).join(', ')}`).join('\n') || 'No recent data';
  const week = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
  const prompt = `Create a 5-day study plan for ${studentName}, Grade ${grade}. Subjects: ${subjects.join(', ')}. Recent: ${context}. Return ONLY JSON: {"weekOf":"${week}","studentName":"${studentName}","grade":"${grade}","days":[{"day":"Monday","sessions":[{"subject":"Math","topic":"specific topic","duration":"30 minutes","focusArea":"what to work on","tip":"practical tip"}]},{"day":"Tuesday","sessions":[...]},{"day":"Wednesday","sessions":[...]},{"day":"Thursday","sessions":[...]},{"day":"Friday","sessions":[...]}],"weeklyGoal":"one specific goal","parentTip":"one coaching tip"}`;
  const r = await anthropic.messages.create({ model: 'claude-haiku-4-5-20251001', max_tokens: 900, system: 'Educational planner. Return ONLY valid JSON.', messages: [{ role: 'user', content: prompt }] });
  try { return JSON.parse(r.content[0].text); } catch { return getDefaultStudyPlan(studentName, grade, subjects); }
}
