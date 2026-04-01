/**
 * pages/api/question-bank/serve.js
 * ─────────────────────────────────────────────────────────────────
 * Serves questions from the question bank, with AI fallback.
 * If the bank has questions matching criteria → serve from DB (instant).
 * If bank is empty for this topic → fall back to AI generation + capture.
 *
 * POST { subject, level, topic, difficulty, type, curriculum, excludeIds }
 * Returns: question in drill.jsx-compatible format + _bankId for tracking
 */

import Anthropic from '@anthropic-ai/sdk';
import { getRandomQuestion, saveQuestion, toClientFormat } from '../../../utils/questionBank';
import { getKnowledgeForTopic } from '../../../utils/getKnowledgeForTopic';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 25000 });

const SYSTEM = `You are an expert Cambridge examiner and question setter with 30 years of experience.
You know every mark scheme, examiner report, and common misconception for all Cambridge subjects.
CRITICAL: Respond ONLY with valid JSON. No markdown, no backticks, no preamble.`;

const DIFFICULTY_MAP = {
  easy: 'A straightforward recall or single-step question. 1-2 marks.',
  medium: 'A typical exam question requiring understanding and application. 2-4 marks.',
  hard: 'A challenging question requiring deeper analysis. 4-6 marks.',
};

// ── Per-IP rate limiting ─────────────────────────────────────────
const rateMap = new Map();
function checkRate(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.t > 60000) { rateMap.set(ip, { t: now, c: 1 }); return true; }
  if (entry.c >= 20) return false;
  entry.c++;
  return true;
}
setInterval(() => { const now = Date.now(); for (const [k, v] of rateMap) { if (now - v.t > 120000) rateMap.delete(k); } }, 300000);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const ip = req.headers['x-forwarded-for'] || 'unknown';
  if (!checkRate(ip)) return res.status(429).json({ error: 'Too many requests' });

  const {
    subject, level = 'O Level', topic, difficulty = 'medium',
    type: questionType = 'mcq', curriculum = 'cambridge',
    excludeIds = [],
  } = req.body || {};

  if (!subject) {
    return res.status(400).json({ error: 'subject is required' });
  }

  try {
    // ── Step 1: Try to serve from question bank ──────────────────
    const bankQuestion = await getRandomQuestion({
      subject, level, topic: topic || undefined, difficulty,
      type: questionType, curriculum, excludeIds,
    });

    if (bankQuestion) {
      return res.status(200).json({
        ...toClientFormat(bankQuestion),
        _source: 'bank',
      });
    }

    // ── Step 2: If bank is empty, return empty instead of AI hallucination ──
    // For subjects with verified past papers, we serve real questions only.
    // AI fallback kept for subjects not yet in the bank (will be removed as bank grows).
    if (!bankQuestion) {
      // Check if this subject has ANY verified questions — if so, don't fall back to AI
      const { fetchQuestions: fetchAny } = require('../../../utils/questionBank');
      const anyForSubject = await fetchAny({ subject, level, curriculum, limit: 1 });
      if (anyForSubject.length > 0) {
        return res.status(200).json({ error: 'no_matching_question', message: `No verified question found for topic "${topic}". Try a different topic.`, _source: 'bank_empty_for_topic' });
      }
    }

    // ── AI fallback — ONLY for subjects with zero bank questions ─────────────────
    const diffDesc = DIFFICULTY_MAP[difficulty] || DIFFICULTY_MAP.medium;
    const randomPos = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];

    const prompt = questionType === 'mcq'
      ? `Generate a Cambridge ${level} ${subject} exam MCQ on: "${topic}".
Difficulty: ${diffDesc}
4 options (A,B,C,D). Distractors = common misconceptions. Place correct answer at position ${randomPos}.
Return JSON: {"question":"...","type":"mcq","options":{"A":"...","B":"...","C":"...","D":"..."},"correctOption":"${randomPos}","topic":"${topic}","difficulty":"${difficulty}","marks":1,"markSchemeHint":"why correct","commandWord":"state"}`
      : `Generate a Cambridge ${level} ${subject} structured question on: "${topic}".
Difficulty: ${diffDesc}
Return JSON: {"question":"...","type":"structured","topic":"${topic}","difficulty":"${difficulty}","marks":3,"markSchemeHint":"key marking points","commandWord":"explain"}`;

    let systemPrompt = SYSTEM;
    const topicKnowledge = getKnowledgeForTopic(topic, subject);
    if (topicKnowledge) systemPrompt += '\n' + topicKnowledge;

    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 800,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = response.content.filter(b => b.type === 'text').map(b => b.text).join('').trim().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);

    // ── Step 3: Capture this question into the bank ──────────────
    let bankId = null;
    try {
      const result = await saveQuestion({
        subject, level,
        topic: parsed.topic || topic,
        difficulty: parsed.difficulty || difficulty,
        type: parsed.type || questionType,
        curriculum,
        questionText: parsed.question,
        options: parsed.options || null,
        correctAnswer: parsed.type === 'mcq' ? parsed.correctOption : (parsed.markSchemeHint || ''),
        markScheme: parsed.markSchemeHint || null,
        marks: parsed.marks || 1,
        commandWord: parsed.commandWord || null,
        source: 'live_capture',
      });
      if (result.saved) bankId = result.id;
    } catch (captureErr) {
      console.error('[Serve] Live capture failed (non-blocking):', captureErr.message);
    }

    return res.status(200).json({
      ...parsed,
      _bankId: bankId,
      _source: 'ai_generated',
    });

  } catch (err) {
    console.error('[Serve API Error]', err);
    return res.status(500).json({ error: 'Failed to serve question' });
  }
}
