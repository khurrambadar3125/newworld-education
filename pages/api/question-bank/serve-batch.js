/**
 * pages/api/question-bank/serve-batch.js
 * ─────────────────────────────────────────────────────────────────
 * Serves multiple verified questions from the bank in one call.
 * Used by: challenge page, daily email, growth engine.
 * NO AI fallback — verified questions only.
 *
 * POST { subject?, level?, limit?, excludeIds? }
 * Returns: { questions: [...], count, source: 'verified_bank' }
 */

import { fetchQuestions, toClientFormat } from '../../../utils/questionBank';
import { checkRateLimit } from '../../../utils/rateLimit';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { ok, remaining } = await checkRateLimit(req, 200);
  res.setHeader('X-RateLimit-Remaining', remaining);
  if (!ok) return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });

  const {
    subject, level = 'O Level', limit = 10,
    type, topic, difficulty, excludeIds = [],
    curriculum: requestedCurriculum,
  } = req.body || {};

  // Determine curriculum: SEN levels get SEN bank, SAT gets SAT bank, default Cambridge
  const senLevels = ['KS1', 'KS2', 'Entry Level 1', 'Entry Level 2', 'Entry Level 3', 'Functional Level 1', 'Functional Level 2'];
  const curriculum = requestedCurriculum
    || (level === 'SAT' ? 'sat'
    : senLevels.includes(level) ? undefined // SEN: search across all curricula matching level
    : 'cambridge');

  try {
    // Fetch from verified bank — larger pool for variety
    const pool = await fetchQuestions({
      subject: subject || undefined,
      level: senLevels.includes(level) ? undefined : level, // SEN: don't filter by level, filter by difficulty instead
      topic: topic || undefined,
      type: type || undefined,
      difficulty: difficulty || undefined,
      curriculum,
      limit: Math.max(limit * 3, 50),
      excludeIds,
    });

    // Shuffle and pick requested count
    const shuffled = pool.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, limit);

    const questions = selected.map(q => ({
      ...toClientFormat(q),
      subject: q.subject,
      level: q.level,
      _source: 'verified_bank',
    }));

    return res.status(200).json({
      questions,
      count: questions.length,
      totalInBank: pool.length,
      source: 'verified_bank',
    });
  } catch (err) {
    console.error('[serve-batch] Error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch questions', questions: [] });
  }
}
