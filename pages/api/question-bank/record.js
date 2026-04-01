/**
 * pages/api/question-bank/record.js
 * ─────────────────────────────────────────────────────────────────
 * Records student performance on a question bank question.
 * Updates times_served, times_correct, avg_score → triggers quality_score recalc.
 *
 * POST { questionId, score, maxScore }
 */

import { recordPerformance } from '../../../utils/questionBank';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { questionId, score, maxScore } = req.body || {};
  if (!questionId || score === undefined || !maxScore) {
    return res.status(400).json({ error: 'questionId, score, and maxScore required' });
  }

  try {
    await recordPerformance(questionId, score, maxScore);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[Record API Error]', err);
    return res.status(500).json({ error: 'Failed to record performance' });
  }
}
