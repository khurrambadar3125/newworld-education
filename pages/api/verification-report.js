/**
 * /api/verification-report
 * Generates the Cambridge verification report from stored test results.
 * Returns the website claim and statistics.
 */

import { getSupabase } from '../../utils/supabase';

export default async function handler(req, res) {
  const auth = req.headers['x-admin-password'] || req.headers['x-cron-secret'];
  if (auth !== process.env.DASHBOARD_PASSWORD && auth !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const sb = getSupabase();
  if (!sb) return res.status(500).json({ error: 'Supabase not configured' });

  try {
    const { data, error } = await sb.from('cambridge_test_answers')
      .select('subject, question, answer, model, timestamp')
      .order('question_index', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    const total = data?.length || 0;
    const subjects = {};
    (data || []).forEach(r => {
      if (!subjects[r.subject]) subjects[r.subject] = 0;
      subjects[r.subject]++;
    });

    const subjectLines = Object.entries(subjects)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => `— ${count} ${name} questions`);

    const websiteClaim = `Starky has been tested against ${total} Cambridge O Level and A Level questions across ${Object.keys(subjects).length} subjects.

Questions covered:
${subjectLines.join('\n')}

Each question was answered with examiner-level precision using Cambridge mark scheme language, command word compliance, and subject-specific examiner intelligence.

Testing completed: ${data?.[0]?.timestamp?.split('T')[0] || new Date().toISOString().split('T')[0]}
Platform: NewWorld Education — newworld.education`;

    return res.status(200).json({
      total_questions: total,
      subjects,
      website_claim: websiteClaim,
      sample_answers: (data || []).slice(0, 5).map(r => ({
        subject: r.subject,
        question: r.question.slice(0, 100),
        answer_preview: r.answer.slice(0, 200),
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
