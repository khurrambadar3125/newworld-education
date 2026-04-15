/**
 * utils/questionBank.js
 * ─────────────────────────────────────────────────────────────────
 * Core question bank utility — save, fetch, search, deduplicate,
 * track performance, and quality-score questions.
 *
 * Integrates with Supabase question_bank table.
 * Used by: /api/question-bank/seed, /api/question-bank/serve,
 *          /api/drill (live capture), cron/question-bank-grow
 */

import { getSupabase } from './supabase';

const TABLE = 'question_bank';

// ── Quality validation — reject bad questions before saving ──────
const BAD_PATTERNS = [
  '__random__', '__random', '{topic}', '{subject}', '{level}', '{difficulty}',
  '[insert', '[your', '[topic', '[subject', '[name', '[placeholder',
  'placeholder', 'todo', 'fixme', 'lorem ipsum', 'example question',
  'sample question', 'test question here', 'undefined polygon',
];

function validateQuestion(questionText, type, options, correctAnswer) {
  if (!questionText || questionText.length < 15) return 'Question too short';
  if (!correctAnswer) return 'Missing correct answer';

  const lower = questionText.toLowerCase();
  for (const bad of BAD_PATTERNS) {
    if (lower.includes(bad)) return `Contains bad pattern: ${bad}`;
  }

  if (type === 'mcq') {
    if (!options || typeof options !== 'object') return 'MCQ missing options';
    const keys = Object.keys(options);
    if (keys.length < 4) return 'MCQ needs 4 options';
    if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) return `Invalid MCQ answer: ${correctAnswer}`;
    for (const k of ['A', 'B', 'C', 'D']) {
      if (!options[k] || options[k].length < 1) return `MCQ option ${k} is empty`;
    }
  }

  return null; // Valid
}

// ── Enforce correct marks for question type ──────────────────────
function enforceMarks(type, marks) {
  // MCQs are ALWAYS 1 mark — you either pick the right answer or you don't
  if (type === 'mcq') return 1;
  // Structured: clamp to reasonable range
  return Math.max(1, Math.min(marks || 3, 12));
}

// ── MCQ verification — second AI pass to confirm correct answer ──
let _verifyClient = null;
export async function verifyMCQ(questionText, options, claimedCorrect) {
  if (!process.env.ANTHROPIC_API_KEY) return { verified: true }; // Skip if no key
  try {
    if (!_verifyClient) {
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      _verifyClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 10000 });
    }
    const response = await _verifyClient.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 50,
      system: 'You verify MCQ answers. Return ONLY one letter: A, B, C, or D. Nothing else.',
      messages: [{ role: 'user', content: `${questionText}\nA: ${options.A}\nB: ${options.B}\nC: ${options.C}\nD: ${options.D}\nWhich is correct?` }],
    });
    const answer = response.content[0].text.trim().charAt(0);
    if (!['A', 'B', 'C', 'D'].includes(answer)) return { verified: true }; // Can't parse, allow
    return { verified: answer === claimedCorrect, aiAnswer: answer };
  } catch {
    return { verified: true }; // Network error, allow through
  }
}

// ── Save a question to the bank ──────────────────────────────────
export async function saveQuestion({
  subject, level, topic, difficulty = 'medium', type = 'mcq',
  curriculum = 'cambridge', questionText, options, correctAnswer,
  markScheme, marks = 1, commandWord, source = 'ai_generated',
}) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase not configured');

  // Quality gate: reject bad questions
  const validationError = validateQuestion(questionText, type, options, correctAnswer);
  if (validationError) return { saved: false, reason: validationError };

  // MCQ verification: second AI pass confirms the correct answer
  if (type === 'mcq' && options && correctAnswer) {
    const { verified, aiAnswer } = await verifyMCQ(questionText, options, correctAnswer);
    if (!verified) {
      console.log(`[QuestionBank] MCQ REJECTED — claimed ${correctAnswer} but verified ${aiAnswer}: ${questionText.slice(0, 60)}`);
      return { saved: false, reason: `MCQ answer mismatch: claimed ${correctAnswer}, verified ${aiAnswer}` };
    }
  }

  // Deduplicate: skip if near-identical question exists
  const isDupe = await isDuplicate(subject, topic, questionText);
  if (isDupe) return { saved: false, reason: 'duplicate' };

  const { data, error } = await sb.from(TABLE).insert({
    subject,
    level,
    topic,
    difficulty,
    type,
    curriculum,
    question_text: questionText,
    options: options || null,
    correct_answer: correctAnswer,
    mark_scheme: markScheme || null,
    marks: enforceMarks(type, marks),
    command_word: commandWord || null,
    source,
  }).select('id').single();

  if (error) {
    console.error('[QuestionBank] Save error:', error.message);
    throw error;
  }
  return { saved: true, id: data.id };
}

// ── Save multiple questions in batch ─────────────────────────────
export async function saveQuestionsBatch(questions) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase not configured');

  // Filter out invalid questions before saving
  const validQuestions = questions.filter(q => {
    const err = validateQuestion(q.questionText, q.type || 'mcq', q.options, q.correctAnswer);
    if (err) console.log('[QuestionBank] Batch rejected:', err, '-', (q.questionText || '').slice(0, 50));
    return !err;
  });
  if (validQuestions.length === 0) return { saved: 0, ids: [] };

  const rows = validQuestions.map(q => ({
    subject: q.subject,
    level: q.level,
    topic: q.topic,
    difficulty: q.difficulty || 'medium',
    type: q.type || 'mcq',
    curriculum: q.curriculum || 'cambridge',
    question_text: q.questionText,
    options: q.options || null,
    correct_answer: q.correctAnswer,
    mark_scheme: q.markScheme || null,
    marks: enforceMarks(q.type || 'mcq', q.marks || 1),
    command_word: q.commandWord || null,
    source: q.source || 'ai_generated',
  }));

  const { data, error } = await sb.from(TABLE).insert(rows).select('id');
  if (error) {
    console.error('[QuestionBank] Batch save error:', error.message);
    throw error;
  }
  return { saved: data.length, ids: data.map(r => r.id) };
}

// ── Fetch questions from the bank ────────────────────────────────
export async function fetchQuestions({
  subject, level, topic, difficulty, type,
  curriculum, limit = 10, minQuality = 0, excludeIds = [],
  // NEW: verification filter — default to serving ONLY verified content
  // Set to false only when you explicitly want unverified (e.g. admin review UI)
  verifiedOnly = true,
  // NEW: accept specific verification sources. Default = all non-null.
  verifiedBy = null,  // e.g. 'khurram_review' or ['khurram_review', 'cambridge_pdf_ai']
}) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase not configured');

  let query = sb.from(TABLE).select('*');

  if (subject) query = query.eq('subject', subject);
  if (level) query = query.eq('level', level);
  if (topic) query = query.eq('topic', topic);
  if (difficulty) query = query.eq('difficulty', difficulty);
  if (type) query = query.eq('type', type);
  if (curriculum) query = query.eq('curriculum', curriculum);
  if (minQuality > 0) query = query.gte('quality_score', minQuality);
  if (excludeIds.length > 0) query = query.not('id', 'in', `(${excludeIds.join(',')})`);

  // Verification gate — honest by default
  if (verifiedOnly) {
    if (Array.isArray(verifiedBy) && verifiedBy.length) {
      query = query.in('verified_by', verifiedBy);
    } else if (typeof verifiedBy === 'string') {
      query = query.eq('verified_by', verifiedBy);
    } else {
      query = query.not('verified_by', 'is', null);
    }
  }

  // Prefer higher quality, less-served questions
  query = query.order('quality_score', { ascending: false })
    .order('times_served', { ascending: true })
    .limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error('[QuestionBank] Fetch error:', error.message);
    return [];
  }

  // Post-fetch quality filter: never serve broken questions
  return (data || []).filter(q => {
    if (!q.question_text || q.question_text.length < 15) return false;
    const lower = q.question_text.toLowerCase();
    for (const bad of BAD_PATTERNS) { if (lower.includes(bad)) return false; }
    if (q.type === 'mcq') {
      if (!q.options || !['A', 'B', 'C', 'D'].includes(q.correct_answer)) return false;
    }
    return true;
  });
}

// ── Get a single random question matching criteria ───────────────
export async function getRandomQuestion({ subject, level, topic, difficulty, type, curriculum, excludeIds = [] }) {
  // Fetch a small pool and pick randomly for variety
  const pool = await fetchQuestions({
    subject, level, topic, difficulty, type, curriculum,
    limit: 20, excludeIds,
  });
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Record student performance on a question ─────────────────────
export async function recordPerformance(questionId, score, maxScore) {
  const sb = getSupabase();
  if (!sb) return;

  // Fetch current stats
  const { data: q } = await sb.from(TABLE)
    .select('times_served, times_correct, avg_score')
    .eq('id', questionId)
    .single();

  if (!q) return;

  const newServed = (q.times_served || 0) + 1;
  const isCorrect = score >= maxScore * 0.7; // 70%+ = correct
  const newCorrect = (q.times_correct || 0) + (isCorrect ? 1 : 0);
  const normalised = maxScore > 0 ? score / maxScore : 0;
  const newAvg = ((q.avg_score || 0) * (q.times_served || 0) + normalised) / newServed;

  await sb.from(TABLE).update({
    times_served: newServed,
    times_correct: newCorrect,
    avg_score: Math.round(newAvg * 1000) / 1000,
  }).eq('id', questionId);
}

// ── Deduplication check ──────────────────────────────────────────
async function isDuplicate(subject, topic, questionText) {
  const sb = getSupabase();
  if (!sb) return false;

  // Normalise for comparison: lowercase, strip punctuation, trim
  const normalised = questionText.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const firstWords = normalised.split(/\s+/).slice(0, 8).join(' ');

  // Check for questions with same subject+topic that start similarly
  const { data } = await sb.from(TABLE)
    .select('question_text')
    .eq('subject', subject)
    .eq('topic', topic)
    .limit(100);

  if (!data || data.length === 0) return false;

  for (const row of data) {
    const existing = row.question_text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    // Exact match
    if (existing === normalised) return true;
    // First 8 words match (likely same question rephrased)
    const existingFirst = existing.split(/\s+/).slice(0, 8).join(' ');
    if (existingFirst === firstWords && firstWords.length > 20) return true;
  }
  return false;
}

// ── Get bank statistics ──────────────────────────────────────────
export async function getBankStats({ subject, level, curriculum } = {}) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase not configured');

  let query = sb.from(TABLE).select('subject, level, topic, difficulty, type, curriculum, quality_score, times_served, verified');
  if (subject) query = query.eq('subject', subject);
  if (level) query = query.eq('level', level);
  if (curriculum) query = query.eq('curriculum', curriculum);

  const { data, error } = await query;
  if (error) {
    console.error('[QuestionBank] Stats error:', error.message);
    return {};
  }

  // Aggregate
  const stats = {
    total: data.length,
    bySubject: {},
    byDifficulty: { easy: 0, medium: 0, hard: 0 },
    byType: { mcq: 0, structured: 0, extended: 0 },
    byCurriculum: {},
    verified: 0,
    avgQuality: 0,
    totalServed: 0,
    coverageGaps: [],
  };

  let qualitySum = 0;
  const topicCounts = {};

  for (const q of data) {
    // By subject
    if (!stats.bySubject[q.subject]) stats.bySubject[q.subject] = { total: 0, topics: {} };
    stats.bySubject[q.subject].total++;
    if (!stats.bySubject[q.subject].topics[q.topic]) stats.bySubject[q.subject].topics[q.topic] = 0;
    stats.bySubject[q.subject].topics[q.topic]++;

    // By difficulty
    if (stats.byDifficulty[q.difficulty] !== undefined) stats.byDifficulty[q.difficulty]++;

    // By type
    if (stats.byType[q.type] !== undefined) stats.byType[q.type]++;

    // By curriculum
    stats.byCurriculum[q.curriculum] = (stats.byCurriculum[q.curriculum] || 0) + 1;

    if (q.verified) stats.verified++;
    qualitySum += q.quality_score || 0;
    stats.totalServed += q.times_served || 0;

    const key = `${q.subject}|${q.topic}`;
    topicCounts[key] = (topicCounts[key] || 0) + 1;
  }

  stats.avgQuality = data.length > 0 ? Math.round((qualitySum / data.length) * 100) / 100 : 0;

  // Find coverage gaps: topics with < 5 questions
  for (const [key, count] of Object.entries(topicCounts)) {
    if (count < 5) {
      const [subj, top] = key.split('|');
      stats.coverageGaps.push({ subject: subj, topic: top, count });
    }
  }
  stats.coverageGaps.sort((a, b) => a.count - b.count);

  return stats;
}

// ── Find thin topics that need more questions ────────────────────
export async function findThinTopics({ minQuestions = 10, curriculum = 'cambridge' } = {}) {
  const stats = await getBankStats({ curriculum });
  const thin = [];

  for (const [subject, info] of Object.entries(stats.bySubject)) {
    for (const [topic, count] of Object.entries(info.topics)) {
      if (count < minQuestions) {
        thin.push({ subject, topic, count, needed: minQuestions - count });
      }
    }
  }
  return thin.sort((a, b) => a.count - b.count);
}

// ── Convert DB row to drill.jsx format (answers stripped for security) ────────
export function toClientFormat(dbRow) {
  return {
    _bankId: dbRow.id,
    question: dbRow.question_text,
    type: dbRow.type,
    options: dbRow.options || undefined,
    // correctOption and markSchemeHint NOT sent — grade server-side via /api/question-bank/grade
    topic: dbRow.topic,
    difficulty: dbRow.difficulty,
    marks: dbRow.marks,
    image_url: dbRow.image_url || undefined,
    source_page: dbRow.source_page || undefined,
  };
}

// ── Grade MCQ server-side by bank ID ─────────────────────────────────────────
export async function gradeByBankId(bankId, studentAnswer) {
  if (!bankId || !studentAnswer) return { correct: false, error: 'Missing bankId or answer' };
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('question_bank')
    .select('correct_answer, mark_scheme, type, options, question_text')
    .eq('id', bankId)
    .single();
  if (error || !data) return { correct: false, error: 'Question not found' };

  const correct = data.type === 'mcq'
    ? studentAnswer.trim().toUpperCase() === (data.correct_answer || '').trim().toUpperCase()
    : null; // structured questions graded by AI in drill.js

  return {
    correct,
    correctAnswer: data.correct_answer,
    markSchemeHint: data.mark_scheme || data.correct_answer,
    options: data.options,
  };
}

// ── Convert AI-generated question to DB format for capture ───────
export function fromDrillFormat({ question, level, subject, curriculum = 'cambridge' }) {
  return {
    subject,
    level,
    topic: question.topic || 'General',
    difficulty: question.difficulty || 'medium',
    type: question.type || 'mcq',
    curriculum,
    questionText: question.question,
    options: question.options || null,
    correctAnswer: question.type === 'mcq' ? question.correctOption : (question.markSchemeHint || ''),
    markScheme: question.markSchemeHint || null,
    marks: question.marks || 1,
    source: 'live_capture',
  };
}
