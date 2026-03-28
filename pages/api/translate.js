/**
 * pages/api/translate.js
 * Auto-translation endpoint — translates English exercise content into
 * Pakistani mother tongues (Urdu, Sindhi, Punjabi, Pashto, Balochi, Saraiki).
 * Uses Claude Haiku for speed and cost efficiency.
 */

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 20000 });

// ─── Rate limiting (in-memory, per-user, 10 calls/min) ─────────────────────
const rateLimitMap = new Map();
const RATE_WINDOW = 60000;
const RATE_MAX = 10;

function checkRateLimit(userId) {
  if (!userId) return true;
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now - entry.windowStart > RATE_WINDOW) {
    rateLimitMap.set(userId, { windowStart: now, count: 1 });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count++;
  return true;
}

// Clean up every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now - entry.windowStart > RATE_WINDOW * 2) rateLimitMap.delete(key);
  }
}, 300000);

// ─── Supported languages ────────────────────────────────────────────────────
const SUPPORTED_LANGS = ['Urdu', 'Sindhi', 'Punjabi', 'Pashto', 'Balochi', 'Saraiki'];

const MAX_TEXTS_PER_CALL = 50;

export default async function handler(req, res) {
  // CORS
  const origin = req.headers.origin;
  const ALLOWED_ORIGINS = [
    'https://newworld.education',
    'https://www.newworld.education',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
  ].filter(Boolean);
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    const { texts, targetLang, userId } = req.body;

    // ── Validate inputs ───────────────────────────────────────────────────
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ error: 'texts must be a non-empty array of strings.' });
    }
    if (!targetLang || typeof targetLang !== 'string') {
      return res.status(400).json({ error: 'targetLang is required (e.g. "Urdu", "Balochi").' });
    }
    if (!SUPPORTED_LANGS.includes(targetLang)) {
      return res.status(400).json({ error: `Unsupported language: ${targetLang}. Supported: ${SUPPORTED_LANGS.join(', ')}` });
    }
    if (texts.length > MAX_TEXTS_PER_CALL) {
      return res.status(400).json({ error: `Maximum ${MAX_TEXTS_PER_CALL} texts per call. You sent ${texts.length}.` });
    }

    // ── Rate limit ────────────────────────────────────────────────────────
    const uid = userId || req.headers['x-forwarded-for'] || 'anon';
    if (!checkRateLimit(uid)) {
      return res.status(429).json({ error: 'Too many translation requests. Please wait a moment.' });
    }

    // ── Build prompt ──────────────────────────────────────────────────────
    const systemPrompt = `You are a translator. Translate the following English texts to ${targetLang}. Return ONLY a valid JSON array of translated strings in the exact same order. No explanations, no markdown, no code fences. Just the JSON array.`;

    const userMessage = JSON.stringify(texts);

    // ── Call Claude Haiku ─────────────────────────────────────────────────
    const response = await client.messages.create({
      model: /* PERMANENT: Haiku 3 only. Never change without Khurram's approval. */ 'claude-3-haiku-20240307',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const responseText = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')
      .trim();

    // ── Parse JSON response ───────────────────────────────────────────────
    let translations;
    try {
      // Strip markdown code fences if present
      let cleaned = responseText;
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }
      translations = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('[TRANSLATE] Failed to parse response:', responseText.slice(0, 200));
      // Fallback: return original texts
      return res.status(200).json({ translations: texts, partial: true });
    }

    // Validate array length matches
    if (!Array.isArray(translations) || translations.length !== texts.length) {
      console.error('[TRANSLATE] Length mismatch:', translations?.length, 'vs', texts.length);
      // Pad or trim to match, filling gaps with original English
      const result = texts.map((t, i) =>
        translations && translations[i] ? String(translations[i]) : t
      );
      return res.status(200).json({ translations: result, partial: true });
    }

    // Ensure all entries are strings
    const safeTranslations = translations.map((t, i) =>
      typeof t === 'string' ? t : String(t || texts[i])
    );

    return res.status(200).json({ translations: safeTranslations });

  } catch (error) {
    console.error('[TRANSLATE API ERROR]', error?.message || error);

    // On any error, return original texts as fallback
    const fallback = req.body?.texts || [];
    return res.status(200).json({ translations: fallback, partial: true, error: error?.message });
  }
}
