/**
 * pages/api/garage-admin.js — Garage School teacher dashboard API
 * Returns all Garage School student data for Shabina's monitoring.
 */

import { getSupabase } from '../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const { password } = req.query;
  if (password !== process.env.DASHBOARD_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = getSupabase();

  try {
    const students = [];

    // Get Garage School students from subscribers
    if (supabase) {
      const { data: subs } = await supabase
        .from('subscribers')
        .select('email, name, source, subscribed_at')
        .or('source.eq.garage_school,source.eq.founding_campaign,source.eq.campaign_parent,source.eq.campaign_student')
        .order('subscribed_at', { ascending: false })
        .limit(200);

      // Get founding students
      const { data: founding } = await supabase
        .from('founding_students')
        .select('email, name, school, grade, city, created_at, referral_count')
        .order('created_at', { ascending: false })
        .limit(200);

      // Get student progress for these emails
      const allEmails = new Set();
      (subs || []).forEach(s => allEmails.add(s.email));
      (founding || []).forEach(f => allEmails.add(f.email));

      for (const email of allEmails) {
        const { data: progress } = await supabase
          .from('student_progress')
          .select('subject, topic, correct, created_at')
          .eq('student_id', email)
          .order('created_at', { ascending: false })
          .limit(100);

        const { data: mastery } = await supabase
          .from('topic_mastery')
          .select('subject, topic, mastery_level, questions_attempted, questions_correct')
          .eq('user_id', email)
          .limit(50);

        const sub = (subs || []).find(s => s.email === email);
        const found = (founding || []).find(f => f.email === email);

        const subjectsSet = new Set();
        let totalCorrect = 0, totalAttempted = 0;
        (progress || []).forEach(p => {
          subjectsSet.add(p.subject);
          totalAttempted++;
          if (p.correct) totalCorrect++;
        });

        const masteryTopics = (mastery || []).length;
        const lastActivity = progress?.[0]?.created_at || null;

        // Find weakest subject
        const subjectAccuracy = {};
        (progress || []).forEach(p => {
          if (!subjectAccuracy[p.subject]) subjectAccuracy[p.subject] = { correct: 0, total: 0 };
          subjectAccuracy[p.subject].total++;
          if (p.correct) subjectAccuracy[p.subject].correct++;
        });
        let weakSubject = null, worstAcc = 101;
        Object.entries(subjectAccuracy).forEach(([subj, data]) => {
          const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
          if (acc < worstAcc && data.total >= 3) { worstAcc = acc; weakSubject = subj; }
        });

        students.push({
          id: email,
          email,
          name: found?.name || sub?.name || email.split('@')[0],
          school: found?.school || 'The Garage School',
          class: found?.grade || '',
          city: found?.city || 'Karachi',
          source: sub?.source || 'direct',
          referralCount: found?.referral_count || 0,
          registeredAt: found?.created_at || sub?.subscribed_at || null,
          lastActive: lastActivity,
          subjects: [...subjectsSet],
          chaptersDone: masteryTopics,
          mcqsAnswered: totalAttempted,
          mcqsCorrect: totalCorrect,
          accuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0,
          weakSubject,
        });
      }
    }

    // Sort: active students first, then by registration date
    students.sort((a, b) => {
      if (a.lastActive && !b.lastActive) return -1;
      if (!a.lastActive && b.lastActive) return 1;
      if (a.lastActive && b.lastActive) return new Date(b.lastActive) - new Date(a.lastActive);
      return new Date(b.registeredAt || 0) - new Date(a.registeredAt || 0);
    });

    return res.status(200).json({
      students,
      total: students.length,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error('[garage-admin] Error:', err.message);
    return res.status(500).json({ error: 'Failed to load dashboard' });
  }
}
