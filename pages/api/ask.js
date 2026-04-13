/**
 * pages/api/ask.js
 * Unified search endpoint — free-text in, verified bank questions out.
 *
 * Flow:
 *   1. Haiku extracts intent (subject, topic, level) — cached system prompt
 *   2. Normalize via subjectAliases (fuzzy matcher)
 *   3. Query question_bank with .ilike() — bank-first, verified only
 *   4. If empty, drop level filter; if still empty, log content gap
 *
 * Rules (CLAUDE.md):
 *   - Model: claude-3-haiku-20240307 ONLY
 *   - cache_control: ephemeral on system prompt
 *   - Bank-first — never AI-generated questions
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import {
  normalizeSubject,
  normalizeLevel,
  normalizeTopic,
} from '../../utils/subjectAliases';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 15000,
});

const sb = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const INTENT_SYSTEM_PROMPT = `You are an intent classifier for NewWorldEdu. Return JSON only:
{"subject": "<Biology|Chemistry|Physics|Mathematics|...>",
 "topic": "<specific topic or null>",
 "level": "<KG|Primary|Matric|O Level|A Level|SAT|SEN|null>"}

Subjects must match Cambridge canonical names: Biology, Chemistry, Physics, Mathematics, Additional Mathematics, English Language, Literature in English, Pakistan Studies, Islamiyat, Computer Science, Business Studies, Accounting, Economics, Geography, History, Sociology, Urdu.

If user doesn't specify level, use level from userProfile.grade.
Return ONLY valid JSON — no prose, no markdown fences.`;

async function extractIntent(query, userProfile, signal) {
  const profileHint = userProfile?.grade
    ? `\n[userProfile.grade = "${userProfile.grade}"]`
    : '';

  const resp = await client.messages.create(
    {
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      system: [
        {
          type: 'text',
          text: INTENT_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        { role: 'user', content: `${query}${profileHint}` },
      ],
    },
    { signal }
  );

  const text = resp.content?.[0]?.text?.trim() || '{}';
  // Strip code fences if Haiku adds them
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return {};
  }
}

function keywordFallbackIntent(query, userProfile) {
  // Cheap regex fallback if Haiku fails
  const q = String(query || '').toLowerCase();
  let subject = null, topic = null, level = null;

  const subjectGuesses = ['biology', 'bio', 'chemistry', 'chem', 'physics',
    'maths', 'math', 'mathematics', 'english', 'urdu', 'islamiat', 'islamiyat',
    'pakistan studies', 'pak studies', 'computer science', 'cs', 'business',
    'accounting', 'economics', 'geography', 'history', 'sociology'];
  for (const s of subjectGuesses) {
    if (q.includes(s)) { subject = s; break; }
  }

  const levelGuesses = ['o level', 'olevel', 'igcse', 'a level', 'alevel',
    'matric', 'primary', 'kg', 'sat', 'sen'];
  for (const l of levelGuesses) {
    if (q.includes(l)) { level = l; break; }
  }
  if (!level && userProfile?.grade) level = userProfile.grade;

  // Topic = leftover meaningful words after stripping subject/level/stopwords
  const stop = new Set(['help', 'me', 'with', 'for', 'on', 'about',
    'questions', 'question', 'explain', 'show', 'please', 'the', 'a', 'an']);
  topic = q.split(/\s+/)
    .filter(w => w && !stop.has(w) && !subjectGuesses.includes(w) && !levelGuesses.includes(w))
    .join(' ').trim() || null;

  return { subject, topic, level };
}

async function queryBank({ subject, level, topic, curriculumBoard }) {
  let q = sb
    .from('question_bank')
    .select('*', { count: 'exact' })
    .eq('verified', true)
    .limit(5);

  if (subject) q = q.ilike('subject', subject);
  if (level) q = q.ilike('level', level);
  if (topic) q = q.ilike('topic', `%${topic}%`);
  // NEW: filter by curriculum board when provided (cambridge, edexcel, ib, cbse, moe, sindh, federal)
  // For now the bank is mostly 'cambridge' — this future-proofs the query
  if (curriculumBoard) q = q.ilike('curriculum', curriculumBoard);

  const { data, count, error } = await q;
  if (error) throw error;
  return { questions: data || [], count: count || 0 };
}

async function getAvailableTopics(subject, level) {
  let q = sb
    .from('question_bank')
    .select('topic')
    .eq('verified', true)
    .limit(50);
  if (subject) q = q.ilike('subject', subject);
  if (level) q = q.ilike('level', level);
  const { data } = await q;
  if (!data) return [];
  return [...new Set(data.map(r => r.topic).filter(Boolean))].slice(0, 10);
}

async function logContentGap(intent, query) {
  try {
    await sb.from('content_gaps').insert({
      query: String(query || '').slice(0, 500),
      subject: intent.subject || null,
      topic: intent.topic || null,
      level: intent.level || null,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    // Table may not exist — log to console as fallback
    console.warn('[ask] content_gaps insert failed:', e?.message || e,
      '— gap:', JSON.stringify(intent), 'query:', query);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, userProfile } = req.body || {};
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'query (string) required' });
  }

  // AbortController — cancel Haiku if client disconnects
  const ac = new AbortController();
  req.on('close', () => ac.abort());

  res.setHeader('Cache-Control', 'private, s-maxage=30');

  // ── Step 1: Intent (Haiku) with keyword fallback ──────────────────
  let rawIntent;
  try {
    rawIntent = await extractIntent(query, userProfile, ac.signal);
  } catch (e) {
    console.warn('[ask] Haiku failed, using keyword fallback:', e?.message);
    rawIntent = keywordFallbackIntent(query, userProfile);
  }

  // ── Step 2: Normalize ─────────────────────────────────────────────
  const subject = normalizeSubject(
    rawIntent.subject || keywordFallbackIntent(query, userProfile).subject
  );
  const level = normalizeLevel(
    rawIntent.level || userProfile?.grade || null
  );
  const topic = normalizeTopic(rawIntent.topic);

  const intent = { subject, level, topic };

  // ── Step 3: Query bank (subject+level+topic, then drop level) ─────
  let bankResult = { questions: [], count: 0 };
  try {
    bankResult = await queryBank({ subject, level, topic });
    if (bankResult.count === 0 && level) {
      // Retry without level
      bankResult = await queryBank({ subject, level: null, topic });
    }
    if (bankResult.count === 0 && topic) {
      // Retry without topic — give them anything in subject
      bankResult = await queryBank({ subject, level: null, topic: null });
    }
  } catch (e) {
    console.error('[ask] bank query failed:', e?.message);
    return res.status(500).json({ error: 'bank query failed', intent });
  }

  // ── Step 4: Response ──────────────────────────────────────────────
  if (bankResult.count > 0 && bankResult.questions.length > 0) {
    return res.status(200).json({
      intent,
      questions: bankResult.questions,
      sourceCount: bankResult.count,
      fromBank: true,
    });
  }

  // Empty — log gap, fetch alternative topics
  await logContentGap(intent, query);
  const availableTopics = subject
    ? await getAvailableTopics(subject, null)
    : [];

  const subjLabel = subject || 'this subject';
  const lvlLabel = level ? `${level} ` : '';
  const topicLabel = topic ? `${topic} ` : '';
  const altCount = availableTopics.length;

  const fallbackMessage = altCount
    ? `No verified ${topicLabel}questions yet for ${lvlLabel}${subjLabel}. We have other ${subjLabel} topics — want to see them?`
    : `No verified questions yet for ${lvlLabel}${subjLabel}${topicLabel ? ' on ' + topicLabel : ''}. We're seeding more content soon.`;

  return res.status(200).json({
    intent,
    questions: [],
    fromBank: true,
    fallbackMessage,
    availableTopics,
  });
}
