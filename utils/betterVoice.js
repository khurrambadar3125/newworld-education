/**
 * betterVoice.js
 * Enhanced TTS for language learning — selects the best available voice per language.
 * Chrome has Google Neural voices that sound near-human. Safari has Apple voices.
 * This utility picks the best voice available and falls back gracefully.
 *
 * Usage:
 *   import { speakBetter, getVoiceQuality } from '../utils/betterVoice';
 *   speakBetter('Bonjour', 'fr', { rate: 0.85, onEnd: () => {} });
 */

// Preferred voices per language — ordered by quality (best first)
// These are the neural/enhanced voices available on modern browsers
const PREFERRED_VOICES = {
  fr: ['Google français', 'Microsoft Paul', 'Thomas', 'Amelie', 'fr-FR'],
  es: ['Google español', 'Microsoft Pablo', 'Paulina', 'Monica', 'es-ES', 'es-MX'],
  ja: ['Google 日本語', 'Microsoft Haruka', 'Kyoko', 'ja-JP'],
  de: ['Google Deutsch', 'Microsoft Katja', 'Anna', 'de-DE'],
  ko: ['Google 한국의', 'Microsoft Heami', 'Yuna', 'ko-KR'],
  it: ['Google italiano', 'Microsoft Elsa', 'Alice', 'it-IT'],
  ar: ['Google العربية', 'Microsoft Hoda', 'Maged', 'ar-SA'],
  pt: ['Google português do Brasil', 'Microsoft Maria', 'Luciana', 'pt-BR'],
  en: ['Google US English', 'Microsoft Zira', 'Samantha', 'Alex', 'en-US'],
};

const LANG_CODES = {
  fr: 'fr-FR', es: 'es-ES', ja: 'ja-JP', de: 'de-DE',
  ko: 'ko-KR', it: 'it-IT', ar: 'ar-SA', pt: 'pt-BR', en: 'en-US',
};

let _voiceCache = {};
let _voicesLoaded = false;

function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) _voicesLoaded = true;
  return voices;
}

// Pre-load voices (they load async on some browsers)
if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

/**
 * Find the best voice for a language code.
 * Tries preferred voices first, then falls back to any voice matching the language.
 */
function getBestVoice(lc) {
  if (_voiceCache[lc]) return _voiceCache[lc];

  const voices = loadVoices();
  if (!voices.length) return null;

  const preferred = PREFERRED_VOICES[lc] || [];
  const langCode = LANG_CODES[lc] || lc;

  // Try preferred voices by name (partial match)
  for (const pref of preferred) {
    const found = voices.find(v =>
      v.name.includes(pref) || v.voiceURI.includes(pref)
    );
    if (found) { _voiceCache[lc] = found; return found; }
  }

  // Try any voice matching the lang code exactly
  const exactMatch = voices.find(v => v.lang === langCode);
  if (exactMatch) { _voiceCache[lc] = exactMatch; return exactMatch; }

  // Try any voice starting with the language prefix
  const prefixMatch = voices.find(v => v.lang.startsWith(lc));
  if (prefixMatch) { _voiceCache[lc] = prefixMatch; return prefixMatch; }

  return null;
}

/**
 * Speak text with the best available voice.
 * @param {string} text - Text to speak
 * @param {string} lc - Language code (fr, es, ja, de, ko, it, ar, pt, en)
 * @param {object} options - { rate, pitch, volume, onEnd, onError }
 */
export function speakBetter(text, lc, options = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();

  // Strip emojis
  const clean = text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
  if (!clean) return;

  const utt = new SpeechSynthesisUtterance(clean);
  utt.lang = LANG_CODES[lc] || 'en-US';
  utt.rate = options.rate || 0.85; // Slightly slow for learners
  utt.pitch = options.pitch || 1.0;
  utt.volume = options.volume || 1.0;

  const voice = getBestVoice(lc);
  if (voice) utt.voice = voice;

  if (options.onEnd) utt.onend = options.onEnd;
  if (options.onError) utt.onerror = options.onError;

  window.speechSynthesis.speak(utt);
}

/**
 * Speak slowly (for young learners / pronunciation practice)
 */
export function speakSlow(text, lc, options = {}) {
  speakBetter(text, lc, { ...options, rate: 0.6 });
}

/**
 * Get the quality level of the available voice for a language.
 * @returns 'neural' | 'standard' | 'none'
 */
export function getVoiceQuality(lc) {
  const voice = getBestVoice(lc);
  if (!voice) return 'none';
  // Google and Microsoft neural voices tend to have specific names
  if (voice.name.includes('Google') || voice.name.includes('Neural') || voice.name.includes('Microsoft')) {
    return 'neural';
  }
  return 'standard';
}

/**
 * Check if speech recognition is available for a language.
 */
export function hasSpeechRecognition() {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * List available voices for debugging.
 */
export function listVoices(lc) {
  const voices = loadVoices();
  const langCode = LANG_CODES[lc] || lc;
  return voices
    .filter(v => !lc || v.lang.startsWith(lc) || v.lang === langCode)
    .map(v => ({ name: v.name, lang: v.lang, local: v.localService }));
}
