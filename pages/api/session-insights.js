/**
 * /api/session-insights.js
 * Admin endpoint — returns recent session analyses with teaching insights.
 * Used by:
 *   1. Founder (Khurram) to review what Starky learned from each session
 *   2. Claude Code to answer "what did you learn from the session 2 hours ago?"
 *   3. Dashboard to show per-session teaching effectiveness
 *
 * GET /api/session-insights?password=DASHBOARD_PASSWORD
 * GET /api/session-insights?password=DASHBOARD_PASSWORD&email=student@email.com
 * GET /api/session-insights?password=DASHBOARD_PASSWORD&hours=6  (last 6 hours)
 * GET /api/session-insights?password=DASHBOARD_PASSWORD&limit=20
 */

import { Redis } from '@upstash/redis';
import { getSupabase } from '../../utils/supabase';

const kv = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Auth — same password as dashboard
  const password = req.query.password || req.headers['x-admin-password'];
  if (password !== process.env.DASHBOARD_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const email = req.query.email || null;
  const hours = parseInt(req.query.hours) || 24;
  const limit = Math.min(parseInt(req.query.limit) || 50, 200);

  try {
    const results = { sessions: [], teachingInsights: [], studentMemory: null };

    // ── 1. Get recent sessions from KV ──────────────────────────────
    const activeStudents = await kv.get('active_students') || [];
    const cutoff = Date.now() - (hours * 3600000);

    // If specific email, get their sessions
    const targetStudents = email
      ? activeStudents.filter(s => s.studentId?.toLowerCase() === email.toLowerCase())
      : activeStudents.filter(s => s.lastActive && new Date(s.lastActive).getTime() > cutoff);

    for (const student of targetStudents.slice(0, 20)) {
      const sessionKeys = await kv.get(`sessions:${student.studentId}`) || [];
      // Get the most recent sessions
      const recentKeys = sessionKeys.slice(-5);
      for (const key of recentKeys) {
        try {
          const session = await kv.get(key);
          if (!session) continue;
          const data = typeof session === 'string' ? JSON.parse(session) : session;
          const sessionTime = new Date(data.timestamp).getTime();
          if (sessionTime > cutoff || email) {
            results.sessions.push({
              studentName: data.studentName,
              studentId: data.studentId,
              grade: data.grade,
              subject: data.subject,
              timestamp: data.timestamp,
              isSEN: data.isSEN,
              senType: data.senType,
              analysis: data.analysis,
            });
          }
        } catch {}
      }
    }

    // Sort by most recent first
    results.sessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    results.sessions = results.sessions.slice(0, limit);

    // ── 2. Get teaching insights from Supabase ──────────────────────
    const sb = getSupabase();
    if (sb) {
      const since = new Date(cutoff).toISOString();
      let query = sb.from('teaching_insights')
        .select('*')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (email) {
        query = sb.from('teaching_insights')
          .select('*')
          .eq('email', email.toLowerCase())
          .order('created_at', { ascending: false })
          .limit(limit);
      }

      const { data: insights } = await query;
      results.teachingInsights = insights || [];

      // Get student preferences if specific email
      if (email) {
        const { data: prefs } = await sb.from('student_preferences')
          .select('*')
          .eq('email', email.toLowerCase())
          .limit(1);
        if (prefs?.[0]) results.studentPreferences = prefs[0];
      }
    }

    // ── 3. Get student memory from KV if specific email ─────────────
    if (email) {
      const memKey = `memory:${email.toLowerCase().trim()}`;
      const mem = await kv.get(memKey);
      if (mem) {
        results.studentMemory = typeof mem === 'string' ? JSON.parse(mem) : mem;
      }
    }

    // ── 4. Build human-readable summary ─────────────────────────────
    const summary = [];
    for (const session of results.sessions) {
      const a = session.analysis || {};
      const t = a.teachingInsights || {};
      const lines = [
        `SESSION: ${session.studentName} (${session.grade}, ${session.subject}) — ${new Date(session.timestamp).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })} PKT`,
        `  Mood: ${a.overallMood || '?'} | Engagement: ${a.engagementLevel || '?'} | Accuracy: ${a.accuracyPercent || '?'}%`,
        `  Topics: ${(a.topicsCovered || []).join(', ')}`,
        `  Strengths: ${(a.strengths || []).join(', ')}`,
        `  Weak areas: ${(a.weakAreas || []).join(', ')}`,
        `  What WORKED: ${(t.whatWorked || []).join(', ') || 'Not analysed'}`,
        `  What DIDN'T work: ${(t.whatDidntWork || []).join(', ') || 'Nothing flagged'}`,
        `  Learning style: ${t.studentLearningStyle || '?'}`,
        `  Engagement peaks: ${(t.engagementPeaks || []).join('; ') || 'Not captured'}`,
        `  Suggested approach: ${t.suggestedApproach || 'None'}`,
        `  Next goals: ${(a.nextGoals || []).join(', ')}`,
        '',
      ];
      summary.push(lines.join('\n'));
    }

    if (results.studentMemory) {
      summary.push('ACCUMULATED STUDENT MEMORY:');
      const m = results.studentMemory;
      if (m.learningStyle) summary.push(`  Learning style: ${m.learningStyle}`);
      if (m.whatWorkedHistory?.length) summary.push(`  All-time effective techniques: ${m.whatWorkedHistory.join(', ')}`);
      if (m.whatDidntWork?.length) summary.push(`  Techniques to avoid: ${m.whatDidntWork.join(', ')}`);
      if (m.engagementPeaks?.length) summary.push(`  Engagement peaks: ${m.engagementPeaks.join('; ')}`);
      if (m.knownStrengths?.length) summary.push(`  Known strengths: ${m.knownStrengths.join(', ')}`);
      if (m.preferredApproach) summary.push(`  Preferred approach: ${m.preferredApproach}`);
      if (m.weakTopics?.length) summary.push(`  Weak topics: ${m.weakTopics.join(', ')}`);
      if (m.recentMistakes?.length) summary.push(`  Recent mistakes: ${m.recentMistakes.map(m => m.topic).join(', ')}`);
      if (m.totalSessions) summary.push(`  Total sessions: ${m.totalSessions}`);
    }

    results.summary = summary.join('\n');

    return res.status(200).json(results);
  } catch (err) {
    console.error('[SESSION INSIGHTS]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
