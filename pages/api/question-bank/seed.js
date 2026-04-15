/**
 * pages/api/question-bank/seed.js
 * ─────────────────────────────────────────────────────────────────
 * Batch-generates questions and stores them in the question bank.
 * Protected: requires admin password or cron secret.
 *
 * POST { subject, level, topic, difficulty, type, count, curriculum }
 * Returns: { generated, saved, skipped, errors }
 */

import Anthropic from '@anthropic-ai/sdk';
import { saveQuestion } from '../../../utils/questionBank';
import { getKnowledgeForTopic } from '../../../utils/getKnowledgeForTopic';
import { isAdmin, isCron } from '../../../utils/apiAuth';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 30000 });

const SYSTEM = `You are an expert Cambridge examiner and question setter with 30 years of experience.
You know every mark scheme, examiner report, and common misconception for all Cambridge subjects.
You also set questions for IB Diploma, CBSE, and UAE MoE curricula.
CRITICAL: Respond ONLY with valid JSON. No markdown, no backticks, no preamble.`;

const DIFFICULTY_MAP = {
  easy: 'A straightforward recall or single-step question. 1-2 marks.',
  medium: 'A typical exam question requiring understanding and application. 2-4 marks.',
  hard: 'A challenging question requiring deeper analysis, evaluation, or multi-step reasoning. 4-6 marks.',
};

function buildBatchPrompt({ subject, level, topic, difficulty, questionType, count, curriculum }) {
  const diffDesc = DIFFICULTY_MAP[difficulty] || DIFFICULTY_MAP.medium;
  const currLabel = curriculum === 'ib' ? 'IB Diploma' : curriculum === 'cbse' ? 'CBSE' : curriculum === 'emsat' ? 'EmSAT' : `Cambridge ${level}`;

  if (questionType === 'mcq') {
    return `Generate ${count} UNIQUE ${currLabel} ${subject} multiple choice questions on: "${topic}".
Difficulty: ${diffDesc}
Each question MUST be meaningfully different — test different aspects of this topic.
Distractors should be realistic common misconceptions.
Vary the correct option position (A/B/C/D) — do NOT always put correct at A.

Return a JSON array of ${count} objects, each with:
{"question":"full question text","type":"mcq","options":{"A":"...","B":"...","C":"...","D":"..."},"correctOption":"A/B/C/D","topic":"${topic}","difficulty":"${difficulty}","marks":1,"markSchemeHint":"why correct answer is correct","commandWord":"state/identify/which"}`;
  }

  return `Generate ${count} UNIQUE ${currLabel} ${subject} structured questions on: "${topic}".
Difficulty: ${diffDesc}
Each question MUST be meaningfully different — test different aspects, skills, and depth.
Use a variety of command words (describe, explain, suggest, compare, evaluate, etc.).

Return a JSON array of ${count} objects, each with:
{"question":"full question text","type":"structured","topic":"${topic}","difficulty":"${difficulty}","marks":3,"markSchemeHint":"key marking points for full marks","commandWord":"the command word used"}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  // Auth check
  if (!isAdmin(req) && !isCron(req)) {
    return res.status(401).json({ error: 'Admin or cron auth required' });
  }

  const {
    subject, level = 'O Level', topic, difficulty = 'medium',
    type: questionType = 'mcq', count = 5, curriculum = 'cambridge',
  } = req.body || {};

  if (!subject || !topic) {
    return res.status(400).json({ error: 'subject and topic are required' });
  }

  const batchSize = Math.min(count, 10); // Max 10 per API call

  try {
    // Inject topic knowledge for better questions
    let systemPrompt = SYSTEM;
    const topicKnowledge = getKnowledgeForTopic(topic, subject);
    if (topicKnowledge) systemPrompt += '\n' + topicKnowledge;

    const prompt = buildBatchPrompt({ subject, level, topic, difficulty, questionType, count: batchSize, curriculum });

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
      system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')
      .trim()
      .replace(/```json|```/g, '')
      .trim();

    let questions;
    try { questions = JSON.parse(raw); } catch {
      console.error('[Seed] JSON parse failed:', raw.slice(0, 300));
      return res.status(500).json({ error: 'AI returned invalid JSON', raw: raw.slice(0, 200) });
    }

    if (!Array.isArray(questions)) questions = [questions];

    // Save each question
    let saved = 0, skipped = 0, errors = 0;
    for (const q of questions) {
      try {
        const result = await saveQuestion({
          subject,
          level,
          topic: q.topic || topic,
          difficulty: q.difficulty || difficulty,
          type: q.type || questionType,
          curriculum,
          questionText: q.question,
          options: q.options || null,
          correctAnswer: q.type === 'mcq' ? q.correctOption : (q.markSchemeHint || ''),
          markScheme: q.markSchemeHint || null,
          marks: q.marks || 1,
          commandWord: q.commandWord || null,
          source: 'ai_generated',
        });
        if (result.saved) saved++;
        else skipped++;
      } catch (err) {
        console.error('[Seed] Save error:', err.message);
        errors++;
      }
    }

    return res.status(200).json({
      generated: questions.length,
      saved,
      skipped,
      errors,
      subject,
      level,
      topic,
      difficulty,
      type: questionType,
    });

  } catch (err) {
    console.error('[Seed API Error]', err);
    return res.status(500).json({ error: 'Failed to generate questions: ' + err.message });
  }
}
