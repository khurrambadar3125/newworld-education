/**
 * pages/api/question-bank/grade.js
 * ─────────────────────────────────────────────────────────────────
 * Server-side MCQ grading — correct answer never sent to client.
 * POST { bankId, answer }
 * Returns: { correct, correctAnswer, feedback, options }
 */

import { gradeByBankId } from '../../../utils/questionBank';
import { checkRateLimit } from '../../../utils/rateLimit';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { ok } = await checkRateLimit(req, 300); // slightly higher limit for grading
  if (!ok) return res.status(429).json({ error: 'Rate limit exceeded' });

  const { bankId, answer } = req.body || {};
  if (!bankId || !answer) {
    return res.status(400).json({ error: 'Missing bankId or answer' });
  }

  try {
    const result = await gradeByBankId(bankId, answer);

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    return res.status(200).json({
      correct: result.correct,
      correctAnswer: result.correctAnswer,
      feedback: result.correct
        ? 'Correct!'
        : `The correct answer is ${result.correctAnswer}${result.options?.[result.correctAnswer] ? ': ' + result.options[result.correctAnswer] : ''}`,
      markSchemeHint: result.markSchemeHint,
      modelAnswer: result.correctAnswer + (result.options?.[result.correctAnswer] ? ': ' + result.options[result.correctAnswer] : ''),
    });
  } catch (err) {
    console.error('[grade] Error:', err.message);
    return res.status(500).json({ error: 'Grading failed' });
  }
}
