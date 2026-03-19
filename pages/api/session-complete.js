import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';
import { getSupabase } from '../../utils/supabase';
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

    // Save teaching insights to Supabase for aggregation and learning
    if (analysis.teachingInsights) {
      try {
        const sb = getSupabase();
        if (sb) {
          await sb.from('teaching_insights').insert({
            email: studentId,
            grade: grade || null,
            subject: subject || null,
            what_worked: analysis.teachingInsights.whatWorked || [],
            what_didnt_work: analysis.teachingInsights.whatDidntWork || [],
            learning_style: analysis.teachingInsights.studentLearningStyle || 'mixed',
            engagement_peaks: analysis.teachingInsights.engagementPeaks || [],
            suggested_approach: analysis.teachingInsights.suggestedApproach || '',
            engagement_level: analysis.engagementLevel || 'medium',
            mood: analysis.overallMood || 'neutral',
            accuracy: analysis.accuracyPercent || null,
            is_sen: isSEN || false,
            sen_type: senType || null,
            session_count: sessionCount || 0,
            created_at: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.error('[SESSION COMPLETE] Teaching insights save failed:', e.message);
      }
    }

    // Save ALL session learnings to student memory (KV) — ALWAYS, not just when nextGoals exist
    try {
      const memKey = `memory:${studentId.toLowerCase().trim()}`;
      const existingMem = await kv.get(memKey);
      const mem = existingMem ? (typeof existingMem === 'string' ? JSON.parse(existingMem) : existingMem) : {};

      if (analysis.nextGoals?.length) mem.nextGoals = analysis.nextGoals;
      mem.lastSessionSubject = subject;
      mem.lastSessionDate = new Date().toISOString();
      mem.lastSessionMood = analysis.overallMood || mem.lastSessionMood;
      mem.lastEngagementLevel = analysis.engagementLevel || mem.lastEngagementLevel;

      // Accumulate strengths across sessions (keep last 10)
      const existingStrengths = mem.knownStrengths || [];
      const newStrengths = [...new Set([...existingStrengths, ...(analysis.strengths || [])])].slice(-10);
      mem.knownStrengths = newStrengths;

      // Store teaching effectiveness data for next session
      if (analysis.teachingInsights) {
        mem.learningStyle = analysis.teachingInsights.studentLearningStyle || mem.learningStyle || 'mixed';
        mem.preferredApproach = analysis.teachingInsights.suggestedApproach || mem.preferredApproach || '';

        // ACCUMULATE what worked — don't overwrite, merge with history (keep last 15)
        const existingWorked = mem.whatWorkedHistory || [];
        const newWorked = analysis.teachingInsights.whatWorked || [];
        const merged = [...new Set([...newWorked, ...existingWorked])].slice(0, 15);
        mem.whatWorkedHistory = merged;
        mem.whatWorkedLastTime = newWorked; // most recent session specifically

        // Track what didn't work so we can avoid it
        const existingFailed = mem.whatDidntWork || [];
        const newFailed = analysis.teachingInsights.whatDidntWork || [];
        mem.whatDidntWork = [...new Set([...newFailed, ...existingFailed])].slice(0, 10);

        // Track engagement peaks — what moments lit this student up
        const existingPeaks = mem.engagementPeaks || [];
        const newPeaks = analysis.teachingInsights.engagementPeaks || [];
        mem.engagementPeaks = [...new Set([...newPeaks, ...existingPeaks])].slice(0, 10);
      }

      await kv.set(memKey, JSON.stringify(mem));
    } catch (e) {
      console.error('[SESSION COMPLETE] Memory save failed:', e.message);
    }

    // Immediately update Supabase student_preferences — don't wait for weekly auto-improve
    if (analysis.teachingInsights && studentId !== 'anonymous') {
      try {
        const sb = getSupabase();
        if (sb) {
          const updates = { updated_at: new Date().toISOString() };
          if (analysis.teachingInsights.studentLearningStyle && analysis.teachingInsights.studentLearningStyle !== 'mixed') {
            updates.learning_style = analysis.teachingInsights.studentLearningStyle;
          }
          if (analysis.teachingInsights.whatWorked?.length) {
            // Merge with existing techniques
            const { data: existing } = await sb.from('student_preferences').select('effective_techniques').eq('email', studentId).limit(1);
            const existingTech = existing?.[0]?.effective_techniques || [];
            updates.effective_techniques = [...new Set([...(analysis.teachingInsights.whatWorked), ...existingTech])].slice(0, 10);
          }
          if (analysis.teachingInsights.suggestedApproach) {
            updates.suggested_approach = analysis.teachingInsights.suggestedApproach;
          }
          await sb.from('student_preferences').upsert({ email: studentId, ...updates }, { onConflict: 'email' });
        }
      } catch (e) {
        console.error('[SESSION COMPLETE] Supabase prefs update failed:', e.message);
      }
    }

    res.status(200).json({ success: true, sessionKey, analysis, emailSent: !!emailResult, emailId: emailResult?.data?.id });
  } catch (error) {
    console.error('Session complete error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function analyseSession({ messages, grade, subject, studentName, isSEN, senType }) {
  const conversation = messages.map(m => `${m.role === 'user' ? studentName : 'Starky'}: ${m.content}`).join('\n');
  const prompt = `Analyse this tutoring session. Student: ${studentName}, Grade: ${grade}, Subject: ${subject}.${isSEN ? ` SEN type: ${senType}.` : ''}

CONVERSATION:
${conversation}

Return ONLY valid JSON with these fields:
{
  "topicsCovered": ["topic"],
  "accuracyPercent": 75,
  "durationMinutes": 20,
  "strengths": ["what student did well"],
  "weakAreas": ["what needs work"],
  "nextGoals": ["specific goal for next session"],
  "starkyPersonalMessage": "warm, specific praise referencing something they actually did",
  "parentSummary": "2-3 sentences for parent email",
  "overallMood": "positive|neutral|frustrated|confused",
  "engagementLevel": "high|medium|low",
  "careerConnection": "how this topic connects to a career",
  "teachingInsights": {
    "whatWorked": ["specific techniques/approaches that got good engagement — e.g. 'I Spy game for counting', 'cricket analogy for multiplication', 'step-by-step scaffolding'"],
    "whatDidntWork": ["approaches that fell flat or confused the student"],
    "studentLearningStyle": "visual|auditory|kinesthetic|reading|mixed — based on what they responded best to",
    "engagementPeaks": ["moments where student was most engaged — describe what triggered it"],
    "suggestedApproach": "one sentence on the best approach for THIS specific student next time"
  }
}`;
  const response = await anthropic.messages.create({ model: 'claude-haiku-4-5-20251001', max_tokens: 900, system: 'You are an expert educational analyst. Analyse tutoring sessions deeply — not just WHAT was taught but HOW it was taught and what techniques worked or failed. The session may be in Urdu or Roman Urdu — analyse in whatever language the messages are in. Return ONLY valid JSON.', messages: [{ role: 'user', content: prompt }] });
  try { return JSON.parse(response.content[0].text); }
  catch { return { topicsCovered: [subject], accuracyPercent: 70, durationMinutes: 20, strengths: ['Completed the session'], weakAreas: ['Continue practising'], nextGoals: [`Review ${subject}`], starkyPersonalMessage: `Great work today, ${studentName}!`, parentSummary: `${studentName} had a productive session on ${subject}.`, overallMood: 'positive', engagementLevel: 'medium', careerConnection: `${subject} opens many doors.`, teachingInsights: { whatWorked: [], whatDidntWork: [], studentLearningStyle: 'mixed', engagementPeaks: [], suggestedApproach: '' } }; }
}
