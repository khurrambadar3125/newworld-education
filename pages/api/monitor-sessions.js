/**
 * pages/api/monitor-sessions.js — Real-time session monitor for Khurram
 * ─────────────────────────────────────────────────────────────────
 * GET /api/monitor-sessions?password=DASHBOARD_PASSWORD
 *
 * Returns live data about active students, recent sessions,
 * nano-teach progress, and study path activity.
 */

import { getSupabase } from '../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const password = req.headers['x-admin-password'] || req.query.password;
  if (password !== process.env.DASHBOARD_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'DB not configured' });

  try {
    // Get recent student progress (last 24 hours)
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Recent mastery records
    const { data: recentMastery } = await supabase
      .from('topic_mastery')
      .select('user_id, subject, topic, mastery_level, questions_attempted, questions_correct, updated_at')
      .gte('updated_at', since)
      .order('updated_at', { ascending: false })
      .limit(100);

    // Recent student progress records
    const { data: recentProgress } = await supabase
      .from('student_progress')
      .select('student_id, subject, topic, correct, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(200);

    // Active students from progress data
    const studentMap = {};
    (recentProgress || []).forEach(r => {
      if (!studentMap[r.student_id]) {
        studentMap[r.student_id] = {
          email: r.student_id,
          sessions: 0,
          subjects: new Set(),
          topics: new Set(),
          correct: 0,
          total: 0,
          lastActive: r.created_at,
        };
      }
      const s = studentMap[r.student_id];
      s.sessions++;
      s.subjects.add(r.subject);
      s.topics.add(r.topic);
      s.total++;
      if (r.correct) s.correct++;
      if (r.created_at > s.lastActive) s.lastActive = r.created_at;
    });

    const activeStudents = Object.values(studentMap).map(s => ({
      ...s,
      subjects: [...s.subjects],
      topics: [...s.topics],
      accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
    })).sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));

    // Mastery breakdown by student
    const masteryByStudent = {};
    (recentMastery || []).forEach(m => {
      if (!masteryByStudent[m.user_id]) masteryByStudent[m.user_id] = [];
      masteryByStudent[m.user_id].push({
        subject: m.subject,
        topic: m.topic,
        level: m.mastery_level,
        attempted: m.questions_attempted,
        correct: m.questions_correct,
        accuracy: m.questions_attempted > 0 ? Math.round((m.questions_correct / m.questions_attempted) * 100) : 0,
      });
    });

    // Specific tracking for Yusuf and Dina
    const tracked = ['myusufkhurram1@gmail.com', 'dinakhurram1@gmail.com'];
    const trackedStudents = {};

    for (const email of tracked) {
      const { data: mastery } = await supabase
        .from('topic_mastery')
        .select('subject, topic, mastery_level, questions_attempted, questions_correct, updated_at')
        .eq('user_id', email)
        .order('updated_at', { ascending: false })
        .limit(50);

      const { data: progress } = await supabase
        .from('student_progress')
        .select('subject, topic, correct, created_at')
        .eq('student_id', email)
        .order('created_at', { ascending: false })
        .limit(50);

      trackedStudents[email] = {
        name: email.includes('yusuf') ? 'Yusuf' : 'Dina',
        mastery: mastery || [],
        recentActivity: progress || [],
        totalAttempted: (progress || []).length,
        totalCorrect: (progress || []).filter(p => p.correct).length,
        subjectsCovered: [...new Set((progress || []).map(p => p.subject))],
      };
    }

    return res.status(200).json({
      timestamp: new Date().toISOString(),
      last24h: {
        activeStudents: activeStudents.length,
        totalQuestions: (recentProgress || []).length,
        totalCorrect: (recentProgress || []).filter(p => p.correct).length,
      },
      students: activeStudents,
      masteryByStudent,
      tracked: trackedStudents,
    });

  } catch (err) {
    console.error('[monitor] Error:', err.message);
    return res.status(500).json({ error: 'Monitor failed' });
  }
}
