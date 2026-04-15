/**
 * /api/mocks/generate — Generate a timed mock paper for a subject
 * VERIFIED BANK FIRST: pulls from real Cambridge past papers.
 * AI fallback only if bank doesn't have enough questions.
 */

import { getAnthropicClient } from '../../../utils/anthropicClient';
import { withErrorAlert } from '../../../utils/errorAlert';
import { fetchQuestions, toClientFormat } from '../../../utils/questionBank';

const client = getAnthropicClient();

// Time limits per grade level (seconds)
const TIME_LIMITS = { 'O Level': 3600, 'A Level': 5400 };
const QUESTION_COUNT = 10;

export default withErrorAlert(async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { subject, grade, email, country } = req.body;
  if (!subject) return res.status(400).json({ error: 'Subject required' });
  const isUAE = (country || req.headers['x-user-country'] || 'PK') === 'UAE';

  try {
    // ── STEP 1: Try verified question bank first ──────────────────
    let bankQuestions = [];
    try {
      // Fetch from Cambridge first, then Edexcel for UAE
      let pool = await fetchQuestions({
        subject,
        level: grade || 'O Level',
        curriculum: 'cambridge',
        limit: 50,
      });
      // UAE: supplement with Edexcel questions
      if (isUAE) {
        const edexcelPool = await fetchQuestions({ subject, level: grade || 'O Level', curriculum: 'edexcel', limit: 20 });
        pool = [...pool, ...edexcelPool];
      }
      if (pool.length >= QUESTION_COUNT) {
        // Shuffle and pick QUESTION_COUNT
        const shuffled = pool.sort(() => Math.random() - 0.5);
        bankQuestions = shuffled.slice(0, QUESTION_COUNT).map(q => ({
          ...toClientFormat(q),
          marks: q.type === 'mcq' ? 1 : Math.max(1, Math.min(q.marks || 3, 8)),
        }));
      } else if (pool.length > 0) {
        // Use what we have from the bank
        bankQuestions = pool.map(q => ({
          ...toClientFormat(q),
          marks: q.type === 'mcq' ? 1 : Math.max(1, Math.min(q.marks || 3, 8)),
        }));
      }
    } catch (bankErr) {
      console.error('[mocks/generate] Bank fetch failed:', bankErr.message);
    }

    // Cross-pollinate: add 1-2 SAT-style bonus questions for Maths/English mocks
    const satCrossSubjects = { 'Mathematics': 'SAT', 'Additional Mathematics': 'SAT', 'English Language': 'SAT' };
    if (satCrossSubjects[subject] && bankQuestions.length >= QUESTION_COUNT) {
      try {
        const satPool = await fetchQuestions({ subject: satCrossSubjects[subject], curriculum: 'sat', type: 'mcq', limit: 5 });
        if (satPool.length > 0) {
          const satBonus = satPool.sort(() => Math.random() - 0.5).slice(0, 2).map(q => ({
            ...toClientFormat(q), marks: 1, _source: 'sat_cross', _crossLabel: 'SAT-style bonus',
          }));
          bankQuestions = [...bankQuestions, ...satBonus];
        }
      } catch {}
    }

    // If bank has enough questions, serve them directly — no AI needed
    if (bankQuestions.length >= QUESTION_COUNT) {
      return res.status(200).json({
        questions: bankQuestions,
        timeLimit: TIME_LIMITS[grade] || 3600,
        subject,
        grade,
        generatedAt: new Date().toISOString(),
        _source: 'verified_bank',
        _bankCount: bankQuestions.length,
      });
    }

    // ── STEP 2: AI fallback for remaining questions ──────────────
    const needed = QUESTION_COUNT - bankQuestions.length;
    const response = await client.messages.create({
      model: /* PERMANENT: Haiku only */ 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      system: `You are a Cambridge ${grade || 'O Level'} examiner creating a mock exam paper for ${subject}. Generate exactly ${needed} questions that represent a real Cambridge exam. Mix question types: MCQs and structured questions. Each question must include marks allocation. Return ONLY valid JSON array.`,
      messages: [{
        role: 'user',
        content: `Generate ${needed} Cambridge ${grade || 'O Level'} ${subject} mock exam questions. IMPORTANT: MCQs MUST have marks:1 (always 1 mark, never more). Structured questions can have marks:2-6. Return JSON array:
[{"question":"...","type":"mcq"|"structured","marks":"1 for MCQ, 2-6 for structured","options":{"A":"...","B":"...","C":"...","D":"..."}|null,"correctOption":"A"|null,"topic":"...","difficulty":"easy"|"medium"|"hard","markSchemeHint":"..."}]`
      }],
    });

    const text = response.content?.[0]?.text || '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    let aiQuestions = [];
    if (jsonMatch) {
      aiQuestions = JSON.parse(jsonMatch[0]).map(q => ({
        ...q,
        marks: q.type === 'mcq' ? 1 : Math.max(1, Math.min(q.marks || 3, 8)),
        _source: 'ai_generated',
      }));
    }

    const allQuestions = [...bankQuestions, ...aiQuestions];
    return res.status(200).json({
      questions: allQuestions,
      timeLimit: TIME_LIMITS[grade] || 3600,
      subject,
      grade,
      generatedAt: new Date().toISOString(),
      _source: bankQuestions.length > 0 ? 'mixed' : 'ai_generated',
      _bankCount: bankQuestions.length,
      _aiCount: aiQuestions.length,
    });
  } catch (err) {
    console.error('[mocks/generate] Error:', err.message);
    return res.status(500).json({ error: 'Failed to generate mock paper' });
  }
});
