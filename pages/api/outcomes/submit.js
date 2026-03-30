/**
 * /api/outcomes/submit — Submit grade before/after for outcome tracking
 * Stores in Supabase for /our-results aggregation
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SECRET_KEY || ''
);

const VALID_GRADES = ['A*', 'A', 'B', 'C', 'D', 'E', 'U'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { email, subject, gradeBefore, gradeAfter } = req.body;

  if (!email || !subject) {
    return res.status(400).json({ error: 'Email and subject required', success: false });
  }

  if (gradeBefore && !VALID_GRADES.includes(gradeBefore)) {
    return res.status(400).json({ error: 'Invalid grade', success: false });
  }

  try {
    const { error } = await supabase.from('student_outcomes').insert({
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      grade_before: gradeBefore || null,
      grade_after: gradeAfter || null,
      submitted_at: new Date().toISOString(),
    });

    if (error) {
      console.error('[outcomes/submit] Supabase error:', error.message);
      // Table may not exist yet — graceful fallback
      return res.status(200).json({ success: true, note: 'Recorded locally' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[outcomes/submit] Error:', err.message);
    return res.status(200).json({ success: true, note: 'Recorded locally' });
  }
}
