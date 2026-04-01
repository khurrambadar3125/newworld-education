/**
 * pages/api/question-bank/save-verified.js
 * ─────────────────────────────────────────────────────────────────
 * Saves reviewed/approved questions to the question bank as verified.
 * Admin-only. Called after Khurram reviews extracted questions.
 *
 * POST { questions: [...], subject, level, paper, session }
 */

import { getSupabase } from '../../../utils/supabase';
import { isAdmin } from '../../../utils/apiAuth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!isAdmin(req)) return res.status(401).json({ error: 'Admin auth required' });

  const { questions, subject, level, paper, session } = req.body || {};
  if (!questions?.length) return res.status(400).json({ error: 'No questions to save' });

  const sb = getSupabase();
  if (!sb) return res.status(500).json({ error: 'Supabase not configured' });

  let saved = 0, errors = 0;

  for (const q of questions) {
    try {
      // Only save verified questions
      if (!q.verified) continue;

      const { error } = await sb.from('question_bank').insert({
        subject: q.subject || subject,
        level: q.level || level || 'O Level',
        topic: q.topic || 'General',
        difficulty: 'medium',
        type: q.type || 'mcq',
        curriculum: 'cambridge',
        question_text: q.question,
        options: q.options || null,
        correct_answer: q.correctAnswer || '',
        mark_scheme: q.type === 'mcq' ? null : q.correctAnswer,
        marks: q.type === 'mcq' ? 1 : (q.marks || 1),
        command_word: null,
        source: 'past_paper',
        verified: true,
      });

      if (error) {
        console.error('[Save Verified] Error:', error.message);
        errors++;
      } else {
        saved++;
      }
    } catch (err) {
      console.error('[Save Verified] Error:', err.message);
      errors++;
    }
  }

  return res.status(200).json({
    saved,
    errors,
    skipped: questions.length - saved - errors,
    total: questions.length,
    paper: `${subject} ${level} ${paper} ${session}`,
  });
}
