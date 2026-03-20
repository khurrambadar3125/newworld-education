/**
 * utils/translateCache.js
 * Client-side translation cache + React hook for auto-translating
 * exercise content into Pakistani mother tongues.
 *
 * - Caches in localStorage: nw_translations_{langCode}
 * - LRU eviction at 5000 entries per language
 * - Batches API calls (max 30 texts per request)
 * - Never blocks the UI — returns English first, updates async
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Language code → name mapping ───────────────────────────────────────────
const LANG_CODE_TO_NAME = {
  ur: 'Urdu',
  sd: 'Sindhi',
  pa: 'Punjabi',
  ps: 'Pashto',
  bal: 'Balochi',
  skr: 'Saraiki',
};

const MAX_BATCH = 30;
const MAX_CACHE_SIZE = 5000;

// ─── In-memory cache mirror (avoids repeated localStorage reads) ────────────
const memoryCache = {};

function getCacheKey(langCode) {
  return `nw_translations_${langCode}`;
}

function loadCache(langCode) {
  if (memoryCache[langCode]) return memoryCache[langCode];
  try {
    const raw = localStorage.getItem(getCacheKey(langCode));
    if (raw) {
      const parsed = JSON.parse(raw);
      memoryCache[langCode] = parsed;
      return parsed;
    }
  } catch (e) {}
  memoryCache[langCode] = {};
  return memoryCache[langCode];
}

function saveCache(langCode, cache) {
  memoryCache[langCode] = cache;
  try {
    localStorage.setItem(getCacheKey(langCode), JSON.stringify(cache));
  } catch (e) {
    // localStorage full — evict oldest entries
    evictOldEntries(langCode, cache);
    try {
      localStorage.setItem(getCacheKey(langCode), JSON.stringify(cache));
    } catch (e2) {}
  }
}

function evictOldEntries(langCode, cache) {
  const keys = Object.keys(cache);
  if (keys.length <= MAX_CACHE_SIZE) return;
  // Remove oldest 20% of entries (simple LRU approximation)
  const toRemove = Math.ceil(keys.length * 0.2);
  for (let i = 0; i < toRemove; i++) {
    delete cache[keys[i]];
  }
}

// ─── In-flight request deduplication ────────────────────────────────────────
const pendingRequests = {};

function getPendingKey(langCode) {
  return `pending_${langCode}`;
}

// ─── Listeners for cache updates (used by useTranslation hook) ──────────────
const listeners = new Set();

function notifyListeners() {
  listeners.forEach(fn => {
    try { fn(); } catch (e) {}
  });
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Get a cached translation synchronously. Returns null if not cached.
 */
export function getCachedTranslation(text, langCode) {
  if (!text || !langCode || langCode === 'en') return null;
  const cache = loadCache(langCode);
  return cache[text] || null;
}

/**
 * Clear translation cache for a language (for debugging).
 */
export function clearTranslationCache(langCode) {
  if (langCode) {
    delete memoryCache[langCode];
    try { localStorage.removeItem(getCacheKey(langCode)); } catch (e) {}
  } else {
    // Clear all
    Object.keys(LANG_CODE_TO_NAME).forEach(code => {
      delete memoryCache[code];
      try { localStorage.removeItem(getCacheKey(code)); } catch (e) {}
    });
  }
}

/**
 * Translate an array of texts. Returns a promise that resolves to the
 * translated array. Checks cache first, only calls API for uncached texts.
 */
export async function translateTexts(texts, langCode) {
  if (!texts || !texts.length || !langCode || langCode === 'en') return texts;

  const langName = LANG_CODE_TO_NAME[langCode];
  if (!langName) return texts;

  const cache = loadCache(langCode);

  // Separate cached from uncached
  const uncachedTexts = [];
  const uncachedIndices = [];

  const results = texts.map((text, i) => {
    if (cache[text]) return cache[text];
    uncachedTexts.push(text);
    uncachedIndices.push(i);
    return text; // Return English as placeholder
  });

  // If everything is cached, return immediately
  if (uncachedTexts.length === 0) return results;

  // Deduplicate uncached texts
  const uniqueUncached = [...new Set(uncachedTexts)];

  // Batch into chunks of MAX_BATCH
  const batches = [];
  for (let i = 0; i < uniqueUncached.length; i += MAX_BATCH) {
    batches.push(uniqueUncached.slice(i, i + MAX_BATCH));
  }

  // Process all batches
  try {
    const batchResults = await Promise.all(
      batches.map(batch => fetchTranslations(batch, langName))
    );

    // Build a map from unique uncached texts to their translations
    const newTranslations = {};
    let offset = 0;
    for (let b = 0; b < batches.length; b++) {
      const batch = batches[b];
      const translated = batchResults[b];
      for (let j = 0; j < batch.length; j++) {
        newTranslations[batch[j]] = translated[j] || batch[j];
      }
    }

    // Update cache with new translations
    Object.assign(cache, newTranslations);

    // Enforce cache size limit
    const keys = Object.keys(cache);
    if (keys.length > MAX_CACHE_SIZE) {
      evictOldEntries(langCode, cache);
    }

    saveCache(langCode, cache);

    // Fill in results
    for (let i = 0; i < uncachedTexts.length; i++) {
      const idx = uncachedIndices[i];
      results[idx] = newTranslations[uncachedTexts[i]] || uncachedTexts[i];
    }

    // Notify hooks to re-render
    notifyListeners();

  } catch (err) {
    console.error('[translateCache] Translation failed:', err?.message);
    // Results already contain English fallbacks
  }

  return results;
}

/**
 * Fetch translations from the API for a single batch.
 */
async function fetchTranslations(texts, langName) {
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts, targetLang: langName }),
    });

    if (!res.ok) {
      console.error('[translateCache] API error:', res.status);
      return texts; // Return originals on error
    }

    const data = await res.json();
    return data.translations || texts;
  } catch (err) {
    console.error('[translateCache] Fetch failed:', err?.message);
    return texts;
  }
}

// ─── React Hook ─────────────────────────────────────────────────────────────

/**
 * React hook for translating an array of texts.
 * Returns { translated: string[], loading: boolean }
 *
 * - On mount: returns cached translations immediately (English for misses)
 * - Triggers async API call for cache misses
 * - Re-renders when translations arrive
 */
export function useTranslation(texts, langCode) {
  const [tick, setTick] = useState(0);
  const triggered = useRef(false);
  const prevKey = useRef('');

  // Subscribe to cache updates
  useEffect(() => {
    const handler = () => setTick(t => t + 1);
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  // Build a stable key to detect when inputs change
  const inputKey = langCode + '|' + (texts ? texts.join('||') : '');

  // Trigger translation when inputs change
  useEffect(() => {
    if (!texts || !texts.length || !langCode || langCode === 'en') return;

    // Only trigger once per unique input set
    if (prevKey.current === inputKey) return;
    prevKey.current = inputKey;

    // Check if any texts are uncached
    const cache = loadCache(langCode);
    const uncached = texts.filter(t => t && !cache[t]);

    if (uncached.length > 0) {
      translateTexts(texts, langCode);
    }
  }, [inputKey, texts, langCode]);

  // Build result from current cache state
  const translated = (texts || []).map(text => {
    if (!text || !langCode || langCode === 'en') return text;
    return getCachedTranslation(text, langCode) || text;
  });

  // Loading = there are texts that haven't been translated yet
  const loading = langCode && langCode !== 'en' && (texts || []).some(
    t => t && !getCachedTranslation(t, langCode)
  );

  return { translated, loading };
}
