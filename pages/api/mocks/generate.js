/**
 * /api/mocks/generate — Generate a timed mock paper for a subject
 * Uses Claude Haiku to generate exam-style questions
 */

import Anthropic from '@anthropic-ai/sdk';
import { withErrorAlert } from '../../../utils/errorAlert';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 30000 });

// Time limits per grade level (seconds)
const TIME_LIMITS = { 'O Level': 3600, 'A Level': 5400 };
const QUESTION_COUNT = 10;

export default withErrorAlert(async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { subject, grade, email } = req.body;
  if (!subject) return res.status(400).json({ error: 'Subject required' });

  try {
    const response = await client.messages.create({
      model: /* PERMANENT: Haiku only */ 'claude-3-haiku-20240307',
      max_tokens: 2000,
      system: `You are a Cambridge ${grade || 'O Level'} examiner creating a mock exam paper for ${subject}. Generate exactly ${QUESTION_COUNT} questions that represent a real Cambridge exam. Mix question types: 4 MCQs + 6 structured questions. Each question must include marks allocation. Return ONLY valid JSON array.`,
      messages: [{
        role: 'user',
        content: `Generate ${QUESTION_COUNT} Cambridge ${grade || 'O Level'} ${subject} mock exam questions. IMPORTANT: MCQs MUST have marks:1 (always 1 mark, never more). Structured questions can have marks:2-6. Return JSON array:
[{"question":"...","type":"mcq"|"structured","marks":"1 for MCQ, 2-6 for structured","options":{"A":"...","B":"...","C":"...","D":"..."}|null,"correctOption":"A"|null,"topic":"...","difficulty":"easy"|"medium"|"hard","markSchemeHint":"..."}]`
      }],
    });

    const text = response.content?.[0]?.text || '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return res.status(200).json({ questions: [], error: 'Could not generate questions' });
    }

    const questions = JSON.parse(jsonMatch[0]).map(q => ({
      ...q,
      // MCQs are ALWAYS 1 mark — enforce server-side
      marks: q.type === 'mcq' ? 1 : Math.max(1, Math.min(q.marks || 3, 8)),
    }));
    return res.status(200).json({
      questions,
      timeLimit: TIME_LIMITS[grade] || 3600,
      subject,
      grade,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[mocks/generate] Error:', err.message);
    return res.status(500).json({ error: 'Failed to generate mock paper' });
  }
});
