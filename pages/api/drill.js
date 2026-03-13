/**
 * pages/api/drill.js
 * ─────────────────────────────────────────────────────────────────
 * Past paper drill API — generates Cambridge-style questions and grades answers.
 *
 * POST body for generation:
 *   { action: 'generate', level, subject, topic, difficulty, questionType }
 *   → { question, type, options, topic, difficulty, subject, level, markSchemeHint }
 *
 * POST body for grading:
 *   { action: 'grade', level, subject, topic, question, studentAnswer, questionType, options }
 *   → { correct, quality, score, maxScore, feedback, examinerTip, modelAnswer }
 *
 * quality (0–5) is used directly by the SM-2 hook.
 */

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ALLOWED_ORIGINS = [
  'https://newworld.education',
  'https://www.newworld.education',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
].filter(Boolean);

// ─── System prompt shared by both actions ────────────────────────────────────

const SYSTEM = `You are an expert Cambridge examiner and question setter with 30 years of experience writing O Level and A Level past papers.

You know every mark scheme, examiner report, and common misconception for all Cambridge subjects. You write questions exactly in Cambridge style and grade with the precision and phrasing of a real Cambridge mark scheme.

CRITICAL: Respond ONLY with valid JSON. No markdown, no backticks, no preamble, no explanation outside the JSON object.`;

// ─── Difficulty descriptors ───────────────────────────────────────────────────

const DIFFICULTY_MAP = {
  easy:   'A straightforward recall or single-step question — suitable for a student who is beginning to learn this topic. Would score 1-2 marks in a real paper.',
  medium: 'A typical exam question requiring understanding and application — the kind a mid-range student would encounter. 2-4 marks.',
  hard:   'A challenging question requiring deeper analysis, multi-step reasoning, or precise Cambridge phrasing. 4-6 marks. Typical of top-end questions.',
};

// ─── Question generation prompt ───────────────────────────────────────────────

function buildGeneratePrompt({ level, subject, topic, difficulty, questionType }) {
  const difficultyDesc = DIFFICULTY_MAP[difficulty] || DIFFICULTY_MAP.medium;
  const typeInstructions = questionType === 'mcq'
    ? `Generate a MULTIPLE CHOICE question with exactly 4 options (A, B, C, D). Only one option is correct. Distractors should represent real common misconceptions.`
    : `Generate a SHORT ANSWER question that requires 2-4 sentences. No multiple choice.`;

  return `Generate a Cambridge ${level} ${subject} exam question on the topic: "${topic}".

Difficulty: ${difficultyDesc}

Question type: ${typeInstructions}

Respond with this exact JSON structure:
${questionType === 'mcq' ? `{
  "question": "The full question text, written exactly as it would appear on a Cambridge paper",
  "type": "mcq",
  "options": {
    "A": "First option text",
    "B": "Second option text",
    "C": "Third option text",
    "D": "Fourth option text"
  },
  "correctOption": "A",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "marks": 1,
  "markSchemeHint": "Brief internal note — why the correct answer is correct (not shown to student yet)"
}` : `{
  "question": "The full question text, written exactly as it would appear on a Cambridge paper",
  "type": "structured",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "marks": 3,
  "markSchemeHint": "Key marking points — what a student must include to get full marks (not shown to student yet)"
}`}`;
}

// ─── Grading prompt ───────────────────────────────────────────────────────────

function buildGradePrompt({ level, subject, topic, question, studentAnswer, questionType, options, marks }) {
  const optionsText = questionType === 'mcq' && options
    ? `Options were:\nA: ${options.A}\nB: ${options.B}\nC: ${options.C}\nD: ${options.D}\n`
    : '';

  return `Grade this Cambridge ${level} ${subject} student answer.

Topic: ${topic}
Question: ${question}
${optionsText}Student's answer: "${studentAnswer}"
Marks available: ${marks || (questionType === 'mcq' ? 1 : 3)}

Grade this exactly as a Cambridge examiner would. Be precise, fair, and constructive.

Respond with this exact JSON:
{
  "correct": true or false,
  "quality": a number from 0 to 5 where: 0=total blackout, 1=wrong answer, 2=wrong but shows partial understanding, 3=correct but hesitant/partial, 4=correct with good explanation, 5=perfect Cambridge-level answer,
  "score": marks awarded as integer,
  "maxScore": total marks available,
  "feedback": "2-3 sentences of warm, specific feedback in the voice of Starky — what they got right, what was missing, encouraging",
  "examinerTip": "One precise Cambridge examiner tip — the exact keyword or phrase Cambridge mark schemes require for this topic",
  "modelAnswer": "The ideal Cambridge mark scheme answer for this question — exactly what would earn full marks"
}`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, ...params } = req.body || {};

  if (!action) return res.status(400).json({ error: 'action required' });

  try {
    let prompt;
    if (action === 'generate') {
      prompt = buildGeneratePrompt(params);
    } else if (action === 'grade') {
      prompt = buildGradePrompt(params);
    } else {
      return res.status(400).json({ error: `Unknown action: ${action}` });
    }

    const response = await client.messages.create({
      model:      'claude-sonnet-4-20250514', // Sonnet for exam quality
      max_tokens: 800,
      system:     SYSTEM,
      messages:   [{ role: 'user', content: prompt }],
    });

    const raw = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')
      .trim()
      .replace(/```json|```/g, '')
      .trim();

    const parsed = JSON.parse(raw);
    return res.status(200).json(parsed);

  } catch (error) {
    console.error('[DRILL API ERROR]', error);
    // Return a graceful fallback so the UI never crashes
    if (action === 'generate') {
      return res.status(500).json({ error: 'Failed to generate question. Please try again.' });
    }
    return res.status(500).json({
      correct:    false,
      quality:    0,
      score:      0,
      maxScore:   1,
      feedback:   'Something went wrong grading your answer. Please try again!',
      examinerTip: '',
      modelAnswer: '',
    });
  }
}
