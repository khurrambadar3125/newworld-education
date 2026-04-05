/**
 * pages/api/nano-learn.js — Bank-first nano learning API
 * ─────────────────────────────────────────────────────────────────
 * Serves questions from the verified bank for nano learning.
 * ZERO Claude API dependency. Works even when API is down.
 *
 * GET ?subject=Mathematics&topic=Compound+Interest&level=O+Level&count=5
 * POST { action: 'grade', bankId, answer }
 */

import { fetchQuestions, toClientFormat } from '../../utils/questionBank';
import { gradeByBankId } from '../../utils/questionBank';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { subject, topic, level = 'O Level', count = 5, difficulty, excludeIds } = req.query;

    if (!subject) return res.status(400).json({ error: 'subject required' });

    try {
      // Try exact topic match first
      let pool = await fetchQuestions({
        subject,
        level,
        topic: topic || undefined,
        difficulty: difficulty || undefined,
        limit: Math.max(parseInt(count) * 3, 20),
        excludeIds: excludeIds ? excludeIds.split(',') : [],
      });

      // If topic didn't match, try broader search
      if (pool.length === 0 && topic) {
        pool = await fetchQuestions({
          subject,
          level,
          limit: 20,
          excludeIds: excludeIds ? excludeIds.split(',') : [],
        });
      }

      // Also check Edexcel for UAE subjects
      if (pool.length < parseInt(count)) {
        const edexcelPool = await fetchQuestions({
          subject,
          level,
          topic: topic || undefined,
          curriculum: 'edexcel',
          limit: 10,
        });
        pool = [...pool, ...edexcelPool];
      }

      // Shuffle and pick requested count
      const shuffled = pool.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, parseInt(count));

      const questions = selected.map(q => ({
        ...toClientFormat(q),
        subject: q.subject,
        level: q.level,
        _source: 'verified_bank',
      }));

      return res.status(200).json({
        questions,
        count: questions.length,
        topic: topic || 'General',
        subject,
        level,
        bankTotal: pool.length,
      });
    } catch (err) {
      console.error('[nano-learn] Error:', err.message);
      return res.status(500).json({ error: 'Failed to fetch questions', questions: [] });
    }
  }

  if (req.method === 'POST') {
    const { action, bankId, answer } = req.body;

    if (action === 'grade' && bankId && answer) {
      try {
        const result = await gradeByBankId(bankId, answer);
        if (result.error) {
          return res.status(404).json({ error: result.error });
        }
        return res.status(200).json({
          correct: result.correct,
          correctAnswer: result.correctAnswer,
          feedback: result.correct
            ? 'Correct! Well done.'
            : `The correct answer is ${result.correctAnswer}${result.options?.[result.correctAnswer] ? ': ' + result.options[result.correctAnswer] : ''}`,
          markSchemeHint: result.markSchemeHint,
        });
      } catch (err) {
        return res.status(500).json({ error: 'Grading failed' });
      }
    }

    return res.status(400).json({ error: 'Invalid action' });
  }

  return res.status(405).json({ error: 'GET or POST only' });
}
