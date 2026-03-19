import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { useTheme } from './_app';
import { useSessionLimit } from '../utils/useSessionLimit';
import { MOTHER_TONGUES, getTranslation, getUIString } from '../utils/motherTongue';
import { useProductGate, ProductPaywall, ProductTrialBadge } from '../utils/productGate';
import { CHINESE_DEST, CHINESE_VOICE, CHINESE_LANG } from '../utils/chineseContent';

/* ═══════════════════════════════════════
   DESIGN TOKENS — theme-aware
═══════════════════════════════════════ */
function getTokens(isDark) {
  // Accent colors stay the same in both themes — they're the interactive identity
  const accent = {
    teal: '#4F8EF7', tealD: '#3B7DE8', tealM: '#6BA3F9', tealL: isDark ? 'rgba(79,142,247,0.12)' : 'rgba(79,142,247,0.1)', tealXL: isDark ? 'rgba(79,142,247,0.06)' : 'rgba(79,142,247,0.05)',
    green: '#2BB55A', greenD: '#1D8C42', greenL: isDark ? 'rgba(43,181,90,0.12)' : '#E8F5EE',
    red: '#F87171', redD: '#DC2626', redL: isDark ? 'rgba(248,113,113,0.12)' : '#FDECEA',
    amber: '#F59E0B', amberD: '#D97706', amberL: isDark ? 'rgba(245,158,11,0.12)' : '#FEF3E0',
    purple: '#7C5CBF', purpleL: isDark ? 'rgba(124,92,191,0.12)' : '#EDE9FE',
  };
  // Neutrals adapt to theme
  if (isDark) {
    return {
      ...accent,
      n0: '#0D1221', n50: '#111827', n100: 'rgba(255,255,255,0.08)', n200: 'rgba(255,255,255,0.12)',
      n300: 'rgba(255,255,255,0.25)', n400: 'rgba(255,255,255,0.45)', n500: 'rgba(255,255,255,0.6)',
      n600: 'rgba(255,255,255,0.75)', n700: '#ffffff', n800: '#ffffff',
      f: "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      fs: "'Sora', Georgia, serif",
    };
  }
  return {
    ...accent,
    n0: '#FFFFFF', n50: '#F5F7FA', n100: 'rgba(0,0,0,0.06)', n200: 'rgba(0,0,0,0.1)',
    n300: 'rgba(0,0,0,0.2)', n400: 'rgba(0,0,0,0.4)', n500: 'rgba(0,0,0,0.55)',
    n600: 'rgba(0,0,0,0.7)', n700: '#1A1A2E', n800: '#0D0D1A',
    f: "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    fs: "'Sora', Georgia, serif",
  };
}

/* ═══════════════════════════════════════
   AUDIO ENGINE
═══════════════════════════════════════ */
const VLANG = { fr: 'fr-FR', es: 'es-ES', ja: 'ja-JP', de: 'de-DE', ko: 'ko-KR', it: 'it-IT', ar: 'ar-SA', pt: 'pt-BR', ...CHINESE_VOICE };
let _ctx = null;
function gCtx() { if (!_ctx) try { _ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} return _ctx; }
function tone(f, t, v, d, dl) {
  const c = gCtx(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain();
  o.connect(g); g.connect(c.destination); o.type = t || 'sine'; o.frequency.value = f;
  const ts = c.currentTime + (dl || 0);
  g.gain.setValueAtTime(0, ts); g.gain.linearRampToValueAtTime(v || 0.2, ts + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, ts + d);
  o.start(ts); o.stop(ts + d + 0.05);
}
function sndOk() { tone(523, 'sine', 0.22, 0.32, 0); tone(659, 'sine', 0.22, 0.32, 0.16); }
function sndErr() { tone(220, 'sawtooth', 0.18, 0.28, 0); }
function sndWin() { tone(523, 'sine', 0.25, 0.5, 0); tone(659, 'sine', 0.25, 0.45, 0.15); tone(784, 'sine', 0.25, 0.45, 0.3); }
function sndTick() { tone(900, 'sine', 0.06, 0.07, 0); }
function sndPop() { tone(1100, 'sine', 0.1, 0.12, 0); }

function speakInstruction(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US'; u.rate = 0.9; u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}

/* ═══════════════════════════════════════
   LEVENSHTEIN DISTANCE (fuzzy matching)
═══════════════════════════════════════ */
function levenshtein(a, b) {
  if (!a || !b) return Math.max((a || '').length, (b || '').length);
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

/* ═══════════════════════════════════════
   SPEECH RECOGNITION (Pronunciation)
═══════════════════════════════════════ */
function startListening(targetWord, langCode, onResult) {
  if (typeof window === 'undefined') { onResult(false, 'Not available'); return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { onResult(false, 'Speech recognition not available'); return; }
  const rec = new SR();
  rec.lang = langCode;
  rec.interimResults = false;
  rec.onresult = (e) => {
    const spoken = e.results[0][0].transcript.toLowerCase().trim();
    const target = targetWord.toLowerCase().trim();
    const dist = levenshtein(spoken, target);
    const match = spoken.includes(target) || target.includes(spoken) || dist === 0;
    const close = dist >= 1 && dist <= 2;
    onResult(match, spoken, close, dist);
  };
  rec.onerror = () => onResult(false, '', false, 99);
  rec.start();
  return rec;
}

// Preferred voices per language — ordered by quality (best first)
const _PREFERRED_VOICES = {
  fr: ['Google français', 'Microsoft Paul', 'Thomas', 'Amelie', 'fr-FR'],
  es: ['Google español', 'Microsoft Pablo', 'Paulina', 'Monica', 'es-ES', 'es-MX'],
  ja: ['Google 日本語', 'Microsoft Haruka', 'Kyoko', 'ja-JP'],
  de: ['Google Deutsch', 'Microsoft Katja', 'Anna', 'de-DE'],
  ko: ['Google 한국의', 'Microsoft Heami', 'Yuna', 'ko-KR'],
  it: ['Google italiano', 'Microsoft Elsa', 'Alice', 'it-IT'],
  ar: ['Google العربية', 'Microsoft Hoda', 'Maged', 'ar-SA'],
  pt: ['Google português do Brasil', 'Microsoft Maria', 'Luciana', 'pt-BR'],
  zh: ['Google 普通话', 'Microsoft Huihui', 'Ting-Ting', 'zh-CN'],
  en: ['Google US English', 'Microsoft Zira', 'Samantha', 'Alex', 'en-US'],
};
let _voiceCache = {};

function speakText(text, lc, rate) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const clean = text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
  if (!clean) return;
  const u = new SpeechSynthesisUtterance(clean);
  const langCode = VLANG[lc] || 'en-US';
  u.lang = langCode; u.rate = rate || 0.84; u.pitch = 1.05;
  // Better voice selection: try preferred voices first (Neural/Google/Microsoft)
  if (!_voiceCache[lc]) {
    const vs = window.speechSynthesis.getVoices();
    const preferred = _PREFERRED_VOICES[lc] || [];
    let best = null;
    for (const pref of preferred) {
      best = vs.find(v => v.name.includes(pref) || v.voiceURI.includes(pref));
      if (best) break;
    }
    if (!best) best = vs.find(v => v.lang === langCode);
    if (!best) best = vs.find(v => v.lang.startsWith((langCode || '').split('-')[0]));
    if (best) _voiceCache[lc] = best;
  }
  if (_voiceCache[lc]) u.voice = _voiceCache[lc];
  window.speechSynthesis.speak(u);
}

/* ═══════════════════════════════════════
   SM-2 ENGINE
═══════════════════════════════════════ */
function mkp(p, t, c) { return { p, t, c: c || 1, ease: 2.5, interval: 0, due: 0, reps: 0 }; }
function sm2Update(ph, q) {
  if (q < 3) { ph.interval = 1; ph.ease = Math.max(1.3, ph.ease - 0.2); }
  else { ph.interval = ph.interval <= 0 ? 1 : ph.interval === 1 ? 6 : Math.round(ph.interval * ph.ease); ph.ease = Math.max(1.3, ph.ease + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)); }
  ph.due = Date.now() + ph.interval * 86400000; ph.reps = (ph.reps || 0) + 1;
}
function isDue(ph) { return !ph.due || ph.due <= Date.now(); }

/* ═══════════════════════════════════════
   CONTENT DATA
═══════════════════════════════════════ */
const DEST = [
  { id: 'paris', name: 'Paris', country: 'France', flag: '\u{1F1EB}\u{1F1F7}', lang: 'French', lc: 'fr', tagline: 'Caf\u00e9 culture & romance', col: '#0B6E6E' },
  { id: 'mexico', name: 'Mexico City', country: 'Mexico', flag: '\u{1F1F2}\u{1F1FD}', lang: 'Spanish', lc: 'es', tagline: 'Tacos & street life', col: '#C06A00' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', flag: '\u{1F1EF}\u{1F1F5}', lang: 'Japanese', lc: 'ja', tagline: 'Business & tradition', col: '#C0392B' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', flag: '\u{1F1E9}\u{1F1EA}', lang: 'German', lc: 'de', tagline: 'Arts & tech scene', col: '#2E7D4F' },
  { id: 'seoul', name: 'Seoul', country: 'Korea', flag: '\u{1F1F0}\u{1F1F7}', lang: 'Korean', lc: 'ko', tagline: 'K-culture & cuisine', col: '#5B21B6' },
  { id: 'rome', name: 'Rome', country: 'Italy', flag: '\u{1F1EE}\u{1F1F9}', lang: 'Italian', lc: 'it', tagline: 'Food, art & history', col: '#C06A00' },
  { id: 'dubai', name: 'Dubai', country: 'UAE', flag: '\u{1F1E6}\u{1F1EA}', lang: 'Arabic', lc: 'ar', tagline: 'Business & travel', col: '#0B6E6E' },
  { id: 'rio', name: 'Rio de Janeiro', country: 'Brazil', flag: '\u{1F1E7}\u{1F1F7}', lang: 'Portuguese', lc: 'pt', tagline: 'Beaches & vibrancy', col: '#C0392B' },
  CHINESE_DEST,
];

const MISSIONS = [
  { icon: '\u{1F5E3}', t: 'Say "thank you" to a real person in your target language', done: true, xp: 50 },
  { icon: '\u2615', t: 'Order something at a caf\u00e9 using only your target language', done: false, xp: 100 },
  { icon: '\u{1F3B5}', t: 'Listen to a song and identify 5 words you recognise', done: false, xp: 75 },
  { icon: '\u{1F4F1}', t: 'Change your phone language for 24 hours', done: false, xp: 150 },
  { icon: '\u{1F373}', t: 'Find a recipe in your language and cook it', done: false, xp: 200 },
  { icon: '\u{1F4FA}', t: 'Watch 10 minutes of TV without subtitles', done: false, xp: 125 },
];

function buildLangData() {
  const LANG = {};
  LANG.fr = {
    name: 'French', flag: '\u{1F1EB}\u{1F1F7}',
    culture: [
      { icon: '\u{1F956}', tip: 'Always say "Bonjour" when entering any shop. Skipping it is genuinely considered rude.' },
      { icon: '\u{1F377}', tip: 'Bread is free at restaurants. Asking for a takeaway box ("doggy bag") is unusual in France.' },
      { icon: '\u{1F44B}', tip: 'Greet friends with "la bise" — cheek kisses. Typically 2 in Paris, varies by region.' },
      { icon: '\u{1F550}', tip: 'Restaurants rarely open before 7:30pm. Dinner is a social event, not a quick meal.' },
    ],
    grammar: [
      { point: 'Adjectives follow the noun', example: 'un livre int\u00e9ressant — NOT un int\u00e9ressant livre', note: 'French adjectives almost always go AFTER the noun they describe.' },
      { point: '"Tu" vs "Vous" for "you"', example: 'Vous parlez fran\u00e7ais? (formal) / Tu parles? (friendly)', note: 'Use "vous" with strangers, shopkeepers and elders. "Tu" with friends.' },
      { point: 'Accents change meaning', example: '"ou" = or   ·   "o\u00f9" = where', note: 'That accent completely changes the word. Pronunciation changes too.' },
    ],
    emergency: [
      { icon: '\u{1F198}', phrase: 'Au secours!', trans: 'Help!', cat: 'Emergency' },
      { icon: '\u{1F691}', phrase: 'Appelez une ambulance', trans: 'Call an ambulance', cat: 'Emergency' },
      { icon: '\u{1F46E}', phrase: 'Appelez la police', trans: 'Call the police', cat: 'Emergency' },
      { icon: '\u{1F3E5}', phrase: 'O\u00f9 est l\'h\u00f4pital?', trans: 'Where is the hospital?', cat: 'Medical' },
      { icon: '\u{1F48A}', phrase: 'J\'ai besoin d\'un m\u00e9decin', trans: 'I need a doctor', cat: 'Medical' },
      { icon: '\u{1F687}', phrase: 'O\u00f9 est le m\u00e9tro?', trans: 'Where is the metro?', cat: 'Transport' },
      { icon: '\u{1F3E8}', phrase: 'J\'ai une r\u00e9servation', trans: 'I have a reservation', cat: 'Hotel' },
      { icon: '\u{1F4B3}', phrase: 'Vous acceptez la carte?', trans: 'Do you accept card?', cat: 'Payment' },
      { icon: '\u2753', phrase: 'Je suis perdu(e)', trans: 'I am lost', cat: 'Directions' },
      { icon: '\u{1F504}', phrase: 'Pouvez-vous r\u00e9p\u00e9ter?', trans: 'Can you repeat that?', cat: 'Communication' },
    ],
    convos: [
      {
        id: 'cafe', icon: '\u2615', title: 'Ordering at a caf\u00e9',
        npc: { name: 'Marie', role: 'Barista', emoji: '\u{1F469}\u200D\u{1F373}' },
        turns: [
          { npc: 'Bonjour! Qu\'est-ce que je vous sers?', npc_tr: 'Hello! What can I get you?', choices: [
            { text: 'Un caf\u00e9, s\'il vous pla\u00eet', tr: 'A coffee, please', q: 5 },
            { text: 'Je voudrais un caf\u00e9', tr: 'I would like a coffee', q: 4 },
            { text: 'Coffee please', tr: '(in English — she might understand!)', q: 1 },
          ] },
          { npc: 'Bien s\u00fbr. Vous mangez quelque chose?', npc_tr: 'Of course. Are you eating anything?', choices: [
            { text: 'Non merci, c\'est tout', tr: 'No thank you, that\'s all', q: 5 },
            { text: 'Un croissant aussi, s\'il vous pla\u00eet', tr: 'A croissant too, please', q: 5 },
            { text: 'Oui... euh...', tr: 'Yes... um...', q: 2 },
          ] },
          { npc: '\u00c7a fait 4 euros 50.', npc_tr: 'That\'s 4 euros 50.', choices: [
            { text: 'Voil\u00e0, merci beaucoup!', tr: 'Here you go, thank you very much!', q: 5 },
            { text: 'Vous acceptez la carte?', tr: 'Do you accept card?', q: 4 },
            { text: 'C\'est combien?', tr: 'How much? (you already know, but practising)', q: 3 },
          ] },
        ],
      },
      {
        id: 'directions', icon: '\u{1F5FA}', title: 'Asking for directions',
        npc: { name: 'Pierre', role: 'Local', emoji: '\u{1F9D1}' },
        turns: [
          { npc: 'Bonjour, vous avez l\'air perdu!', npc_tr: 'Hello, you look lost!', choices: [
            { text: 'Oui! O\u00f9 est le mus\u00e9e du Louvre?', tr: 'Yes! Where is the Louvre?', q: 5 },
            { text: 'Pardon, o\u00f9 est le m\u00e9tro?', tr: 'Excuse me, where is the metro?', q: 5 },
            { text: 'Parlez-vous anglais?', tr: 'Do you speak English?', q: 2 },
          ] },
          { npc: 'Tournez \u00e0 gauche, puis tout droit.', npc_tr: 'Turn left, then straight ahead.', choices: [
            { text: 'Merci beaucoup!', tr: 'Thank you very much!', q: 5 },
            { text: 'C\'est loin?', tr: 'Is it far?', q: 4 },
            { text: 'Je ne comprends pas', tr: 'I don\'t understand', q: 3 },
          ] },
        ],
      },
    ],
    placementTest: [
      { q: 'What does "Bonjour" mean?', opts: ['Hello', 'Goodbye', 'Thank you', 'Please'], ans: 'Hello', lvl: 'A1' },
      { q: 'How do you say "I would like water"?', opts: ['Je voudrais de l\'eau', 'Je suis de l\'eau', 'O\u00f9 est l\'eau?', 'Je bois l\'eau'], ans: 'Je voudrais de l\'eau', lvl: 'A1' },
      { q: 'Complete: "Je ___ fran\u00e7ais"', opts: ['parle', 'parles', 'parlons', 'parlez'], ans: 'parle', lvl: 'A2' },
      { q: 'What does "Il fait beau" mean?', opts: ['The weather is nice', 'He is handsome', 'It is early', 'He does well'], ans: 'The weather is nice', lvl: 'A2' },
      { q: '"Les livres ___ sur la table"', opts: ['sont', 'est', 'suis', '\u00eates'], ans: 'sont', lvl: 'B1' },
    ],
    scenarios: [
      { id: 1, icon: '\u2708️', place: '\u00c0 l\'a\u00e9roport', title: 'Checking in', sub: 'Bag count, seat preference, boarding pass', xp: 15, done: true,
        ex: [
          { type: 'tap', q: 'What does "Bonjour" mean?', word: 'Bonjour', emoji: '\u{1F44B}', opts: ['Goodbye', 'Hello', 'Thank you', 'Please'], ans: 'Hello' },
          { type: 'listen', q: 'Listen and choose what you heard:', speak_word: 'J\'ai une valise', emoji: '\u{1F9F3}', opts: ['I have one bag', 'I have two bags', 'Where is my bag?', 'My bag is heavy'], ans: 'I have one bag' },
          { type: 'build', q: 'Ask for a window seat:', hint: 'Je voudrais un si\u00e8ge c\u00f4t\u00e9 fen\u00eatre', words: ['Je', 'voudrais', 'un', 'si\u00e8ge', 'c\u00f4t\u00e9', 'fen\u00eatre', 'couloir', 'deux'], ans: 'Je voudrais un si\u00e8ge c\u00f4t\u00e9 fen\u00eatre', tr: 'I would like a window seat' },
          { type: 'fill', q: 'Complete the sentence:', sentence: 'J\'ai ___ valises.', opts: ['une', 'deux', 'trois', 'beaucoup'], ans: 'deux', tr: 'I have two suitcases' },
          { type: 'speak', q: 'Say this word:', speak_word: 'Bonjour', tr: 'Hello', emoji: '\u{1F44B}' },
          { type: 'speak', q: 'Say this word:', speak_word: 'S\'il vous pla\u00eet', tr: 'Please', emoji: '\u{1F64F}' },
        ],
      },
      { id: 2, icon: '\u{1F37D}️', place: 'Au restaurant', title: 'Ordering your meal', sub: 'Order food, drinks, ask for the bill', xp: 20, done: false, current: true,
        ex: [
          { type: 'tap', q: 'The waiter says "Bonsoir" — what does it mean?', word: 'Bonsoir', emoji: '\u{1F319}', opts: ['Good morning', 'Good evening', 'Enjoy your meal', 'The bill'], ans: 'Good evening' },
          { type: 'listen', q: 'Listen and choose what you heard:', speak_word: 'La carte, s\'il vous pla\u00eet', emoji: '\u{1F4CB}', opts: ['The menu please', 'The bill please', 'A table for two', 'I want to order'], ans: 'The menu please' },
          { type: 'match', q: 'Match each phrase to its English meaning:', pairs: [['L\'addition', 'The bill'], ['La carte', 'The menu'], ['Bon app\u00e9tit', 'Enjoy your meal'], ['C\'\u00e9tait d\u00e9licieux', 'It was delicious']] },
          { type: 'build', q: 'Order water and the set menu:', hint: 'Une carafe d\'eau et le menu s\'il vous pla\u00eet', words: ['Une', 'carafe', 'd\'eau', 'et', 'le', 'menu', 's\'il', 'vous', 'pla\u00eet', 'vin'], ans: 'Une carafe d\'eau et le menu s\'il vous pla\u00eet', tr: 'A jug of water and the set menu please' },
          { type: 'fill', q: 'Ask for the bill:', sentence: 'L\'___, s\'il vous pla\u00eet.', opts: ['menu', 'addition', 'carte', 'dessert'], ans: 'addition', tr: 'The bill please' },
          { type: 'speak', q: 'Say this word:', speak_word: 'Merci', tr: 'Thank you', emoji: '\u{1F60A}' },
          { type: 'speak', q: 'Say this word:', speak_word: 'Bonsoir', tr: 'Good evening', emoji: '\u{1F319}' },
        ],
      },
      { id: 3, icon: '\u{1F5FA}️', place: 'Dans la rue', title: 'Asking directions', sub: 'Left, right, straight ahead, landmarks', xp: 20, done: false, locked: false,
        ex: [
          { type: 'tap', q: 'What does "\u00e0 gauche" mean?', word: '\u00e0 gauche', emoji: '\u2B05️', opts: ['To the right', 'On the left', 'Straight ahead', 'It\'s far'], ans: 'On the left' },
          { type: 'listen', q: 'Listen and choose what you heard:', speak_word: 'C\'est tout droit', emoji: '\u2B06️', opts: ['Go straight ahead', 'Turn right', 'Turn left', 'It\'s nearby'], ans: 'Go straight ahead' },
          { type: 'fill', q: 'Complete the question:', sentence: 'Excusez-moi, ___ est la gare?', opts: ['qui', 'quoi', 'o\u00f9', 'quand'], ans: 'o\u00f9', tr: 'Excuse me, where is the station?' },
          { type: 'build', q: 'Ask where the nearest metro is:', hint: 'Excusez-moi o\u00f9 est le m\u00e9tro le plus proche', words: ['Excusez-moi', 'o\u00f9', 'est', 'le', 'm\u00e9tro', 'le', 'plus', 'proche', 'loin'], ans: 'Excusez-moi o\u00f9 est le m\u00e9tro le plus proche', tr: 'Excuse me where is the nearest metro?' },
          { type: 'speak', q: 'Say this phrase:', speak_word: 'Excusez-moi', tr: 'Excuse me', emoji: '\u{1F64B}' },
          { type: 'speak', q: 'Say this phrase:', speak_word: 'Tout droit', tr: 'Straight ahead', emoji: '\u2B06\uFE0F' },
        ],
      },
      { id: 4, icon: '\u{1F3E8}', place: '\u00c0 l\'h\u00f4tel', title: 'Hotel check-in', sub: 'Confirm booking, request amenities', xp: 20, done: false, locked: true },
      { id: 5, icon: '\u{1F6D2}', place: 'Au march\u00e9', title: 'At the market', sub: 'Ask prices, negotiate, make a purchase', xp: 20, done: false, locked: true },
      { id: 6, icon: '\u{1F91D}', place: 'Rencontres', title: 'Meeting locals', sub: 'Introduce yourself, small talk', xp: 25, done: false, locked: true },
    ],
    pb: [
      // Existing core phrases
      mkp('Bonjour, je m\'appelle\u2026', 'Hello, my name is\u2026', 3), mkp('L\'addition, s\'il vous pla\u00eet', 'The bill please', 3), mkp('O\u00f9 est le m\u00e9tro?', 'Where is the metro?', 2), mkp('Je ne comprends pas', 'I don\'t understand', 2), mkp('Pouvez-vous r\u00e9p\u00e9ter?', 'Can you repeat?', 1), mkp('Merci beaucoup', 'Thank you very much', 3),
      // Greetings & Basics (20)
      mkp('Bonjour', 'Hello / Good morning', 1), mkp('Bonsoir', 'Good evening', 1), mkp('Bonne nuit', 'Good night', 1), mkp('Au revoir', 'Goodbye', 1),
      mkp('S\'il vous pla\u00eet', 'Please', 1), mkp('Merci', 'Thank you', 1), mkp('De rien', 'You\'re welcome', 1), mkp('Excusez-moi', 'Excuse me', 1),
      mkp('Pardon', 'Sorry', 1), mkp('Oui', 'Yes', 1), mkp('Non', 'No', 1), mkp('Peut-\u00eatre', 'Maybe', 1),
      mkp('D\'accord', 'OK / Agreed', 1), mkp('Comment allez-vous?', 'How are you?', 1), mkp('Tr\u00e8s bien', 'Very well', 1), mkp('Comme ci comme \u00e7a', 'So-so', 1),
      mkp('Je m\'appelle\u2026', 'My name is\u2026', 1), mkp('Enchant\u00e9', 'Nice to meet you', 1), mkp('\u00c0 bient\u00f4t', 'See you soon', 1), mkp('Salut', 'Hi / Bye (informal)', 1),
      // Numbers (20)
      mkp('un', 'one', 1), mkp('deux', 'two', 1), mkp('trois', 'three', 1), mkp('quatre', 'four', 1), mkp('cinq', 'five', 1),
      mkp('six', 'six', 1), mkp('sept', 'seven', 1), mkp('huit', 'eight', 1), mkp('neuf', 'nine', 1), mkp('dix', 'ten', 1),
      mkp('onze', 'eleven', 1), mkp('douze', 'twelve', 1), mkp('treize', 'thirteen', 1), mkp('quatorze', 'fourteen', 1), mkp('quinze', 'fifteen', 1),
      mkp('seize', 'sixteen', 1), mkp('vingt', 'twenty', 1), mkp('trente', 'thirty', 1), mkp('cinquante', 'fifty', 1), mkp('cent', 'one hundred', 1),
      // Colors (12)
      mkp('rouge', 'red', 1), mkp('bleu', 'blue', 1), mkp('vert', 'green', 1), mkp('jaune', 'yellow', 1),
      mkp('orange', 'orange', 1), mkp('rose', 'pink', 1), mkp('violet', 'purple', 1), mkp('noir', 'black', 1),
      mkp('blanc', 'white', 1), mkp('gris', 'grey', 1), mkp('marron', 'brown', 1), mkp('dor\u00e9', 'golden', 1),
      // Family (12)
      mkp('m\u00e8re / maman', 'mother / mom', 1), mkp('p\u00e8re / papa', 'father / dad', 1), mkp('fr\u00e8re', 'brother', 1), mkp('s\u0153ur', 'sister', 1),
      mkp('grand-p\u00e8re', 'grandfather', 1), mkp('grand-m\u00e8re', 'grandmother', 1), mkp('fils', 'son', 1), mkp('fille', 'daughter', 1),
      mkp('oncle', 'uncle', 1), mkp('tante', 'aunt', 1), mkp('cousin', 'cousin', 1), mkp('b\u00e9b\u00e9', 'baby', 1),
      // Food & Drink (25)
      mkp('pain', 'bread', 1), mkp('fromage', 'cheese', 1), mkp('croissant', 'croissant', 1), mkp('baguette', 'baguette', 1), mkp('caf\u00e9', 'coffee', 1),
      mkp('th\u00e9', 'tea', 1), mkp('eau', 'water', 1), mkp('lait', 'milk', 1), mkp('jus', 'juice', 1), mkp('vin', 'wine', 1),
      mkp('bi\u00e8re', 'beer', 1), mkp('poulet', 'chicken', 1), mkp('poisson', 'fish', 1), mkp('viande', 'meat', 1), mkp('riz', 'rice', 1),
      mkp('salade', 'salad', 1), mkp('soupe', 'soup', 1), mkp('fruits', 'fruit', 1), mkp('pomme', 'apple', 1), mkp('banane', 'banana', 1),
      mkp('orange', 'orange (fruit)', 1), mkp('g\u00e2teau', 'cake', 1), mkp('glace', 'ice cream', 1), mkp('chocolat', 'chocolate', 1), mkp('beurre', 'butter', 1),
      // Animals (15)
      mkp('chat', 'cat', 1), mkp('chien', 'dog', 1), mkp('oiseau', 'bird', 1), mkp('poisson', 'fish (animal)', 1), mkp('cheval', 'horse', 1),
      mkp('vache', 'cow', 1), mkp('mouton', 'sheep', 1), mkp('cochon', 'pig', 1), mkp('lapin', 'rabbit', 1), mkp('souris', 'mouse', 1),
      mkp('papillon', 'butterfly', 1), mkp('tortue', 'turtle', 1), mkp('lion', 'lion', 1), mkp('\u00e9l\u00e9phant', 'elephant', 1), mkp('singe', 'monkey', 1),
      // Around Town (20)
      mkp('restaurant', 'restaurant', 1), mkp('h\u00f4tel', 'hotel', 1), mkp('gare', 'train station', 1), mkp('a\u00e9roport', 'airport', 1), mkp('m\u00e9tro', 'metro', 1),
      mkp('bus', 'bus', 1), mkp('taxi', 'taxi', 1), mkp('pharmacie', 'pharmacy', 1), mkp('h\u00f4pital', 'hospital', 1), mkp('banque', 'bank', 1),
      mkp('supermarch\u00e9', 'supermarket', 1), mkp('boulangerie', 'bakery', 1), mkp('mus\u00e9e', 'museum', 1), mkp('parc', 'park', 1), mkp('\u00e9glise', 'church', 1),
      mkp('plage', 'beach', 1), mkp('biblioth\u00e8que', 'library', 1), mkp('cin\u00e9ma', 'cinema', 1), mkp('\u00e9cole', 'school', 1), mkp('march\u00e9', 'market', 1),
      // Common Phrases (20)
      mkp('Je voudrais\u2026', 'I would like\u2026', 1), mkp('Combien \u00e7a co\u00fbte?', 'How much does it cost?', 1), mkp('O\u00f9 est\u2026?', 'Where is\u2026?', 1), mkp('C\'est combien?', 'How much is it?', 1),
      mkp('L\'addition s\'il vous pla\u00eet', 'The bill please', 1), mkp('Je ne comprends pas', 'I don\'t understand', 1), mkp('Parlez-vous anglais?', 'Do you speak English?', 1), mkp('Je suis perdu', 'I am lost', 1),
      mkp('Pouvez-vous m\'aider?', 'Can you help me?', 1), mkp('C\'est d\u00e9licieux', 'It\'s delicious', 1), mkp('J\'ai faim', 'I\'m hungry', 1), mkp('J\'ai soif', 'I\'m thirsty', 1),
      mkp('Je suis fatigu\u00e9', 'I\'m tired', 1), mkp('Quelle heure est-il?', 'What time is it?', 1), mkp('Aujourd\'hui', 'Today', 1), mkp('Demain', 'Tomorrow', 1),
      mkp('Hier', 'Yesterday', 1), mkp('Maintenant', 'Now', 1), mkp('Bient\u00f4t', 'Soon', 1), mkp('Toujours', 'Always', 1),
      // Weather & Time (10)
      mkp('Il fait chaud', 'It\'s hot', 1), mkp('Il fait froid', 'It\'s cold', 1), mkp('Il pleut', 'It\'s raining', 1), mkp('Le soleil', 'The sun', 1),
      mkp('Le matin', 'The morning', 1), mkp('L\'apr\u00e8s-midi', 'The afternoon', 1), mkp('Le soir', 'The evening', 1), mkp('La nuit', 'The night', 1),
      mkp('Lundi', 'Monday', 1), mkp('Dimanche', 'Sunday', 1),
    ],
  };

  LANG.es = {
    name: 'Spanish', flag: '\u{1F1F2}\u{1F1FD}',
    culture: [
      { icon: '\u{1F550}', tip: '"Ma\u00f1ana" means tomorrow but culturally signals "not urgently". Expect flexible timing.' },
      { icon: '\u{1F37D}️', tip: 'The main meal is lunch (2–4pm). Many businesses close for siesta in smaller cities.' },
      { icon: '\u{1F336}️', tip: 'Always ask "\u00bfEst\u00e1 muy picante?" before ordering. Mexicans love heat — visitors often don\'t.' },
      { icon: '\u{1F917}', tip: 'Mexicans are very warm. First names are used quickly. Personal space is closer than in Europe.' },
    ],
    grammar: [
      { point: 'Everything has gender (m/f)', example: 'el libro (book, m) · la mesa (table, f)', note: 'Articles and adjectives must match the gender. El/la = the. Un/una = a.' },
      { point: 'Two verbs for "to be"', example: 'Soy ingl\u00e9s (permanent) · Estoy cansado (temporary)', note: '"Ser" for permanent traits. "Estar" for states, locations, feelings.' },
      { point: 'Questions have \u00bf at both ends', example: '\u00bfHablas espa\u00f1ol? — Do you speak Spanish?', note: 'The opening \u00bf signals a question is coming — useful when reading aloud.' },
    ],
    emergency: [
      { icon: '\u{1F198}', phrase: '\u00a1Ayuda!', trans: 'Help!', cat: 'Emergency' },
      { icon: '\u{1F691}', phrase: 'Llame a una ambulancia', trans: 'Call an ambulance', cat: 'Emergency' },
      { icon: '\u{1F46E}', phrase: 'Llame a la polic\u00eda', trans: 'Call the police', cat: 'Emergency' },
      { icon: '\u{1F3E5}', phrase: '\u00bfD\u00f3nde est\u00e1 el hospital?', trans: 'Where is the hospital?', cat: 'Medical' },
      { icon: '\u{1F48A}', phrase: 'Necesito un m\u00e9dico', trans: 'I need a doctor', cat: 'Medical' },
      { icon: '\u{1F687}', phrase: '\u00bfD\u00f3nde est\u00e1 el metro?', trans: 'Where is the metro?', cat: 'Transport' },
      { icon: '\u{1F3E8}', phrase: 'Tengo una reservaci\u00f3n', trans: 'I have a reservation', cat: 'Hotel' },
      { icon: '\u{1F4B3}', phrase: '\u00bfAceptan tarjeta?', trans: 'Do you accept card?', cat: 'Payment' },
      { icon: '\u2753', phrase: 'Estoy perdido/a', trans: 'I am lost', cat: 'Directions' },
      { icon: '\u{1F504}', phrase: '\u00bfPuede repetir?', trans: 'Can you repeat?', cat: 'Communication' },
    ],
    convos: [
      {
        id: 'taqueria', icon: '\u{1F32E}', title: 'At a taquer\u00eda',
        npc: { name: 'Diego', role: 'Server', emoji: '\u{1F468}\u200D\u{1F373}' },
        turns: [
          { npc: '\u00a1Buenas! \u00bfQu\u00e9 le pongo?', npc_tr: 'Hey there! What can I get you?', choices: [
            { text: 'Dos tacos de pollo, por favor', tr: 'Two chicken tacos, please', q: 5 },
            { text: '\u00bfQu\u00e9 recomienda?', tr: 'What do you recommend?', q: 4 },
            { text: 'No s\u00e9... un momento', tr: 'I don\'t know... one moment', q: 2 },
          ] },
          { npc: '\u00bfCon todo? \u00bfCilantro, cebolla?', npc_tr: 'With everything? Cilantro, onion?', choices: [
            { text: 'S\u00ed, con todo por favor', tr: 'Yes, with everything please', q: 5 },
            { text: 'Sin chile, por favor', tr: 'Without chili please', q: 4 },
            { text: '\u00bfEst\u00e1 muy picante?', tr: 'Is it very spicy?', q: 4 },
          ] },
          { npc: 'Son 80 pesos.', npc_tr: 'That\'s 80 pesos.', choices: [
            { text: 'Aqu\u00ed tiene, gracias', tr: 'Here you go, thank you', q: 5 },
            { text: '\u00bfAcepta tarjeta?', tr: 'Do you accept card?', q: 4 },
            { text: '\u00a1Est\u00e1 muy rico!', tr: 'It\'s very tasty!', q: 4 },
          ] },
        ],
      },
      {
        id: 'lost', icon: '\u{1F5FA}️', title: 'Getting un-lost',
        npc: { name: 'Sof\u00eda', role: 'Local', emoji: '\u{1F469}' },
        turns: [
          { npc: 'Hola, \u00bfest\u00e1s perdido?', npc_tr: 'Hi, are you lost?', choices: [
            { text: 'S\u00ed, \u00bfd\u00f3nde est\u00e1 el z\u00f3calo?', tr: 'Yes, where is the main square?', q: 5 },
            { text: 'S\u00ed, busco el metro', tr: 'Yes, I\'m looking for the metro', q: 5 },
            { text: 'No hablo espa\u00f1ol bien', tr: 'I don\'t speak Spanish well', q: 2 },
          ] },
          { npc: 'El metro est\u00e1 a dos cuadras de aqu\u00ed.', npc_tr: 'The metro is two blocks from here.', choices: [
            { text: '\u00a1Muchas gracias, muy amable!', tr: 'Many thanks, very kind!', q: 5 },
            { text: '\u00bfA la derecha o izquierda?', tr: 'To the right or left?', q: 4 },
            { text: 'Gracias', tr: 'Thanks', q: 3 },
          ] },
        ],
      },
    ],
    placementTest: [
      { q: 'What does "Hola" mean?', opts: ['Goodbye', 'Hello', 'Please', 'Thank you'], ans: 'Hello', lvl: 'A1' },
      { q: 'How do you say "I want water"?', opts: ['Quiero agua', 'Tengo agua', 'Bebo agua', 'Necesito agua'], ans: 'Quiero agua', lvl: 'A1' },
      { q: 'What does "\u00bfCu\u00e1nto cuesta?" mean?', opts: ['Where is it?', 'What time is it?', 'How much does it cost?', 'Do you have it?'], ans: 'How much does it cost?', lvl: 'A2' },
      { q: 'Complete: "Yo ___ en Madrid"', opts: ['vivo', 'vive', 'vivimos', 'viven'], ans: 'vivo', lvl: 'A2' },
      { q: '"El libro ___ sobre la mesa" — choose:', opts: ['est\u00e1', 'es', 'son', 'estoy'], ans: 'est\u00e1', lvl: 'B1' },
    ],
    scenarios: [
      { id: 1, icon: '\u2708️', place: 'En el aeropuerto', title: 'Checking in', sub: 'Name, bags, seat preference', xp: 15, done: true,
        ex: [
          { type: 'tap', q: 'What does "Hola" mean?', word: 'Hola', emoji: '\u{1F44B}', opts: ['Goodbye', 'Hello', 'Thank you', 'Please'], ans: 'Hello' },
          { type: 'listen', q: 'Listen and choose what you heard:', speak_word: 'Tengo una maleta', emoji: '\u{1F9F3}', opts: ['I have one bag', 'I have two bags', 'Where is my bag?', 'My bag is lost'], ans: 'I have one bag' },
          { type: 'build', q: 'Tell them your name and bag count:', hint: 'Me llamo Carlos y tengo una maleta', words: ['Me', 'llamo', 'Carlos', 'y', 'tengo', 'una', 'maleta', 'dos', 'bolsas'], ans: 'Me llamo Carlos y tengo una maleta', tr: 'My name is Carlos and I have one suitcase' },
          { type: 'speak', q: 'Say this word:', speak_word: 'Hola', tr: 'Hello', emoji: '\u{1F44B}' },
          { type: 'speak', q: 'Say this word:', speak_word: 'Por favor', tr: 'Please', emoji: '\u{1F64F}' },
        ],
      },
      { id: 2, icon: '\u{1F37D}️', place: 'En el restaurante', title: 'Ordering your meal', sub: 'Order food, drinks, get the bill', xp: 20, done: false, current: true,
        ex: [
          { type: 'tap', q: 'The waiter asks "\u00bfQu\u00e9 desea?" — what does it mean?', word: '\u00bfQu\u00e9 desea?', emoji: '\u{1F374}', opts: ['Are you ready?', 'What would you like?', 'Enjoy your meal', 'Here is the menu'], ans: 'What would you like?' },
          { type: 'listen', q: 'Listen and choose what you heard:', speak_word: 'La cuenta, por favor', emoji: '\u{1F4B3}', opts: ['The bill please', 'The menu please', 'One more drink', 'I want to pay'], ans: 'The bill please' },
          { type: 'match', q: 'Match each Spanish phrase to its meaning:', pairs: [['La cuenta', 'The bill'], ['La carta', 'The menu'], ['\u00a1Buen provecho!', 'Enjoy your meal'], ['\u00bfQu\u00e9 recomienda?', 'What do you recommend?']] },
          { type: 'build', q: 'Order water and the menu:', hint: 'Una agua y la carta por favor', words: ['Una', 'agua', 'y', 'la', 'carta', 'por', 'favor', 'vino', 'mesa'], ans: 'Una agua y la carta por favor', tr: 'A water and the menu please' },
          { type: 'speak', q: 'Say this word:', speak_word: 'Gracias', tr: 'Thank you', emoji: '\u{1F60A}' },
          { type: 'speak', q: 'Say this word:', speak_word: 'Buenas noches', tr: 'Good night', emoji: '\u{1F319}' },
        ],
      },
      { id: 3, icon: '\u{1F5FA}️', place: 'En la calle', title: 'Asking directions', sub: 'Left, right, straight ahead', xp: 20, done: false, locked: false,
        ex: [
          { type: 'tap', q: 'What does "a la izquierda" mean?', word: 'a la izquierda', emoji: '\u2B05️', opts: ['To the right', 'Straight ahead', 'On the left', 'It\'s far'], ans: 'On the left' },
          { type: 'fill', q: 'Ask where the metro is:', sentence: 'Disculpe, \u00bf___ est\u00e1 el metro?', opts: ['qui\u00e9n', 'cu\u00e1ndo', 'd\u00f3nde', 'c\u00f3mo'], ans: 'd\u00f3nde', tr: 'Excuse me, where is the metro?' },
          { type: 'build', q: 'Ask where the nearest metro is:', hint: 'Disculpe d\u00f3nde est\u00e1 el metro m\u00e1s cercano', words: ['Disculpe', 'd\u00f3nde', 'est\u00e1', 'el', 'metro', 'm\u00e1s', 'cercano', 'lejos'], ans: 'Disculpe d\u00f3nde est\u00e1 el metro m\u00e1s cercano', tr: 'Excuse me where is the nearest metro?' },
          { type: 'speak', q: 'Say this phrase:', speak_word: 'Disculpe', tr: 'Excuse me', emoji: '\u{1F64B}' },
          { type: 'speak', q: 'Say this phrase:', speak_word: 'A la derecha', tr: 'To the right', emoji: '\u27A1\uFE0F' },
        ],
      },
      { id: 4, icon: '\u{1F3E8}', place: 'En el hotel', title: 'Hotel check-in', sub: 'Confirm booking, request amenities', xp: 20, done: false, locked: true },
      { id: 5, icon: '\u{1F6D2}', place: 'En el mercado', title: 'At the market', sub: 'Ask prices, buy items', xp: 20, done: false, locked: true },
      { id: 6, icon: '\u{1F91D}', place: 'Conociendo gente', title: 'Meeting locals', sub: 'Introduce yourself, small talk', xp: 25, done: false, locked: true },
    ],
    pb: [
      // Existing core phrases
      mkp('Hola, me llamo\u2026', 'Hello, my name is\u2026', 3), mkp('La cuenta, por favor', 'The bill please', 3), mkp('\u00bfD\u00f3nde est\u00e1 el metro?', 'Where is the metro?', 2), mkp('No entiendo', 'I don\'t understand', 2), mkp('\u00bfPuede repetir?', 'Can you repeat?', 1), mkp('Muchas gracias', 'Thank you very much', 3),
      // Greetings & Basics (20)
      mkp('Hola', 'Hello', 1), mkp('Buenos d\u00edas', 'Good morning', 1), mkp('Buenas tardes', 'Good afternoon', 1), mkp('Buenas noches', 'Good night', 1),
      mkp('Adi\u00f3s', 'Goodbye', 1), mkp('Por favor', 'Please', 1), mkp('Gracias', 'Thank you', 1), mkp('De nada', 'You\'re welcome', 1),
      mkp('Disculpe', 'Excuse me', 1), mkp('Perd\u00f3n', 'Sorry', 1), mkp('S\u00ed', 'Yes', 1), mkp('No', 'No', 1),
      mkp('Tal vez', 'Maybe', 1), mkp('Est\u00e1 bien', 'OK / Alright', 1), mkp('\u00bfC\u00f3mo est\u00e1s?', 'How are you?', 1), mkp('Muy bien', 'Very well', 1),
      mkp('M\u00e1s o menos', 'So-so', 1), mkp('Me llamo\u2026', 'My name is\u2026', 1), mkp('Mucho gusto', 'Nice to meet you', 1), mkp('Hasta luego', 'See you later', 1),
      // Numbers (20)
      mkp('uno', 'one', 1), mkp('dos', 'two', 1), mkp('tres', 'three', 1), mkp('cuatro', 'four', 1), mkp('cinco', 'five', 1),
      mkp('seis', 'six', 1), mkp('siete', 'seven', 1), mkp('ocho', 'eight', 1), mkp('nueve', 'nine', 1), mkp('diez', 'ten', 1),
      mkp('once', 'eleven', 1), mkp('doce', 'twelve', 1), mkp('trece', 'thirteen', 1), mkp('catorce', 'fourteen', 1), mkp('quince', 'fifteen', 1),
      mkp('veinte', 'twenty', 1), mkp('treinta', 'thirty', 1), mkp('cuarenta', 'forty', 1), mkp('cincuenta', 'fifty', 1), mkp('cien', 'one hundred', 1),
      // Colors (12)
      mkp('rojo', 'red', 1), mkp('azul', 'blue', 1), mkp('verde', 'green', 1), mkp('amarillo', 'yellow', 1),
      mkp('anaranjado', 'orange', 1), mkp('rosa', 'pink', 1), mkp('morado', 'purple', 1), mkp('negro', 'black', 1),
      mkp('blanco', 'white', 1), mkp('gris', 'grey', 1), mkp('caf\u00e9 / marr\u00f3n', 'brown', 1), mkp('dorado', 'golden', 1),
      // Family (12)
      mkp('madre / mam\u00e1', 'mother / mom', 1), mkp('padre / pap\u00e1', 'father / dad', 1), mkp('hermano', 'brother', 1), mkp('hermana', 'sister', 1),
      mkp('abuelo', 'grandfather', 1), mkp('abuela', 'grandmother', 1), mkp('hijo', 'son', 1), mkp('hija', 'daughter', 1),
      mkp('t\u00edo', 'uncle', 1), mkp('t\u00eda', 'aunt', 1), mkp('primo / prima', 'cousin', 1), mkp('beb\u00e9', 'baby', 1),
      // Food & Drink (25)
      mkp('pan', 'bread', 1), mkp('queso', 'cheese', 1), mkp('tortilla', 'tortilla', 1), mkp('tacos', 'tacos', 1), mkp('caf\u00e9', 'coffee', 1),
      mkp('t\u00e9', 'tea', 1), mkp('agua', 'water', 1), mkp('leche', 'milk', 1), mkp('jugo', 'juice', 1), mkp('vino', 'wine', 1),
      mkp('cerveza', 'beer', 1), mkp('pollo', 'chicken', 1), mkp('pescado', 'fish', 1), mkp('carne', 'meat', 1), mkp('arroz', 'rice', 1),
      mkp('ensalada', 'salad', 1), mkp('sopa', 'soup', 1), mkp('frutas', 'fruit', 1), mkp('manzana', 'apple', 1), mkp('pl\u00e1tano', 'banana', 1),
      mkp('naranja', 'orange (fruit)', 1), mkp('pastel', 'cake', 1), mkp('helado', 'ice cream', 1), mkp('chocolate', 'chocolate', 1), mkp('mantequilla', 'butter', 1),
      // Animals (15)
      mkp('gato', 'cat', 1), mkp('perro', 'dog', 1), mkp('p\u00e1jaro', 'bird', 1), mkp('pez', 'fish (animal)', 1), mkp('caballo', 'horse', 1),
      mkp('vaca', 'cow', 1), mkp('oveja', 'sheep', 1), mkp('cerdo', 'pig', 1), mkp('conejo', 'rabbit', 1), mkp('rat\u00f3n', 'mouse', 1),
      mkp('mariposa', 'butterfly', 1), mkp('tortuga', 'turtle', 1), mkp('le\u00f3n', 'lion', 1), mkp('elefante', 'elephant', 1), mkp('mono', 'monkey', 1),
      // Around Town (20)
      mkp('restaurante', 'restaurant', 1), mkp('hotel', 'hotel', 1), mkp('estaci\u00f3n', 'station', 1), mkp('aeropuerto', 'airport', 1), mkp('metro', 'metro', 1),
      mkp('autob\u00fas / cami\u00f3n', 'bus', 1), mkp('taxi', 'taxi', 1), mkp('farmacia', 'pharmacy', 1), mkp('hospital', 'hospital', 1), mkp('banco', 'bank', 1),
      mkp('supermercado', 'supermarket', 1), mkp('panader\u00eda', 'bakery', 1), mkp('museo', 'museum', 1), mkp('parque', 'park', 1), mkp('iglesia', 'church', 1),
      mkp('playa', 'beach', 1), mkp('biblioteca', 'library', 1), mkp('cine', 'cinema', 1), mkp('escuela', 'school', 1), mkp('mercado', 'market', 1),
      // Common Phrases (20)
      mkp('Quisiera\u2026', 'I would like\u2026', 1), mkp('\u00bfCu\u00e1nto cuesta?', 'How much does it cost?', 1), mkp('\u00bfD\u00f3nde est\u00e1\u2026?', 'Where is\u2026?', 1), mkp('\u00bfCu\u00e1nto es?', 'How much is it?', 1),
      mkp('La cuenta, por favor', 'The bill please', 1), mkp('No entiendo', 'I don\'t understand', 1), mkp('\u00bfHabla ingl\u00e9s?', 'Do you speak English?', 1), mkp('Estoy perdido/a', 'I am lost', 1),
      mkp('\u00bfMe puede ayudar?', 'Can you help me?', 1), mkp('\u00a1Est\u00e1 delicioso!', 'It\'s delicious!', 1), mkp('Tengo hambre', 'I\'m hungry', 1), mkp('Tengo sed', 'I\'m thirsty', 1),
      mkp('Estoy cansado/a', 'I\'m tired', 1), mkp('\u00bfQu\u00e9 hora es?', 'What time is it?', 1), mkp('Hoy', 'Today', 1), mkp('Ma\u00f1ana', 'Tomorrow', 1),
      mkp('Ayer', 'Yesterday', 1), mkp('Ahora', 'Now', 1), mkp('Pronto', 'Soon', 1), mkp('Siempre', 'Always', 1),
      // Weather & Time (10)
      mkp('Hace calor', 'It\'s hot', 1), mkp('Hace fr\u00edo', 'It\'s cold', 1), mkp('Est\u00e1 lloviendo', 'It\'s raining', 1), mkp('El sol', 'The sun', 1),
      mkp('La ma\u00f1ana', 'The morning', 1), mkp('La tarde', 'The afternoon', 1), mkp('La noche', 'The evening / night', 1), mkp('La medianoche', 'Midnight', 1),
      mkp('Lunes', 'Monday', 1), mkp('Domingo', 'Sunday', 1),
    ],
  };

  // Stub languages
  const stubData = {
    ja: { name: 'Japanese', greet: '\u3042\u308a\u304c\u3068\u3046 means Thank you', helpPhrase: '\u52a9\u3051\u3066!', hospitalPhrase: '\u75c5\u9662\u306f\u3069\u3053\u3067\u3059\u304b?', thankPhrase: '\u3042\u308a\u304c\u3068\u3046\u3054\u3056\u3044\u307e\u3059', excusePhrase: '\u3059\u307f\u307e\u305b\u3093', word: '\u3042\u308a\u304c\u3068\u3046', wordOpts: ['Hello', 'Goodbye', 'Thank you', 'Please'], wordAns: 'Thank you', airport: '\u7a7a\u6e2f\u3067', restaurant: '\u30ec\u30b9\u30c8\u30e9\u30f3\u3067' },
    de: { name: 'German', greet: 'Guten Tag means Good day', helpPhrase: 'Hilfe!', hospitalPhrase: 'Wo ist das Krankenhaus?', thankPhrase: 'Danke sch\u00f6n', excusePhrase: 'Entschuldigung', word: 'Guten Tag', wordOpts: ['Good night', 'Good morning', 'Good day', 'Goodbye'], wordAns: 'Good day', airport: 'Am Flughafen', restaurant: 'Im Restaurant' },
    ko: { name: 'Korean', greet: '\uac10\uc0ac\ud569\ub2c8\ub2e4 means Thank you', helpPhrase: '\ub3c4\uc640\uc8fc\uc138\uc694!', hospitalPhrase: '\ubcd1\uc6d0\uc774 \uc5b4\ub514\uc5d0 \uc788\uc5b4\uc694?', thankPhrase: '\uac10\uc0ac\ud569\ub2c8\ub2e4', excusePhrase: '\uc2e4\ub840\ud569\ub2c8\ub2e4', word: '\uac10\uc0ac\ud569\ub2c8\ub2e4', wordOpts: ['Hello', 'Thank you', 'Goodbye', 'Please'], wordAns: 'Thank you', airport: '\uacf5\ud56d\uc5d0\uc11c', restaurant: '\uc2dd\ub2f9\uc5d0\uc11c' },
    it: { name: 'Italian', greet: 'Buongiorno means Good morning', helpPhrase: 'Aiuto!', hospitalPhrase: 'Dov\'\u00e8 l\'ospedale?', thankPhrase: 'Grazie mille', excusePhrase: 'Scusi', word: 'Buongiorno', wordOpts: ['Good evening', 'Good night', 'Good morning', 'Goodbye'], wordAns: 'Good morning', airport: 'All\'aeroporto', restaurant: 'Al ristorante' },
    ar: { name: 'Arabic', greet: '\u0645\u0631\u062d\u0628\u0627 means Hello', helpPhrase: '\u0633\u0627\u0639\u062f\u0646\u064a!', hospitalPhrase: '\u0623\u064a\u0646 \u0627\u0644\u0645\u0633\u062a\u0634\u0641\u0649\u061f', thankPhrase: '\u0634\u0643\u0631\u0627\u064b \u062c\u0632\u064a\u0644\u0627\u064b', excusePhrase: '\u0639\u0641\u0648\u0627\u064b', word: '\u0645\u0631\u062d\u0628\u0627', wordOpts: ['Goodbye', 'Thank you', 'Hello', 'Please'], wordAns: 'Hello', airport: '\u0641\u064a \u0627\u0644\u0645\u0637\u0627\u0631', restaurant: '\u0641\u064a \u0627\u0644\u0645\u0637\u0639\u0645' },
    pt: { name: 'Portuguese', greet: 'Obrigado means Thank you', helpPhrase: 'Socorro!', hospitalPhrase: 'Onde fica o hospital?', thankPhrase: 'Obrigado / Obrigada', excusePhrase: 'Com licen\u00e7a', word: 'Obrigado', wordOpts: ['Hello', 'Goodbye', 'Please', 'Thank you'], wordAns: 'Thank you', airport: 'No aeroporto', restaurant: 'No restaurante' },
  };

  // Expanded stub phrase books (~50 words each)
  const stubPhraseBooks = {
    ja: [
      // Greetings
      mkp('\u3053\u3093\u306b\u3061\u306f', 'Hello', 1), mkp('\u3053\u3093\u3070\u3093\u306f', 'Good evening', 1), mkp('\u304a\u306f\u3088\u3046\u3054\u3056\u3044\u307e\u3059', 'Good morning', 1), mkp('\u3055\u3088\u3046\u306a\u3089', 'Goodbye', 1),
      mkp('\u304a\u306d\u304c\u3044\u3057\u307e\u3059', 'Please', 1), mkp('\u3042\u308a\u304c\u3068\u3046\u3054\u3056\u3044\u307e\u3059', 'Thank you very much', 1), mkp('\u3069\u3046\u3044\u305f\u3057\u307e\u3057\u3066', 'You\'re welcome', 1), mkp('\u3059\u307f\u307e\u305b\u3093', 'Excuse me / Sorry', 1),
      mkp('\u306f\u3044', 'Yes', 1), mkp('\u3044\u3044\u3048', 'No', 1), mkp('\u304a\u5143\u6c17\u3067\u3059\u304b\uff1f', 'How are you?', 1), mkp('\u5143\u6c17\u3067\u3059', 'I\'m fine', 1),
      // Numbers
      mkp('\u3044\u3061', 'one', 1), mkp('\u306b', 'two', 1), mkp('\u3055\u3093', 'three', 1), mkp('\u3057', 'four', 1), mkp('\u3054', 'five', 1),
      mkp('\u308d\u304f', 'six', 1), mkp('\u306a\u306a', 'seven', 1), mkp('\u306f\u3061', 'eight', 1), mkp('\u304d\u3085\u3046', 'nine', 1), mkp('\u3058\u3085\u3046', 'ten', 1),
      // Food
      mkp('\u6c34', 'water', 1), mkp('\u304a\u8336', 'tea', 1), mkp('\u30b3\u30fc\u30d2\u30fc', 'coffee', 1), mkp('\u3054\u306f\u3093', 'rice', 1), mkp('\u9b5a', 'fish', 1),
      mkp('\u8089', 'meat', 1), mkp('\u30e9\u30fc\u30e1\u30f3', 'ramen', 1), mkp('\u5bff\u53f8', 'sushi', 1), mkp('\u30d3\u30fc\u30eb', 'beer', 1), mkp('\u679c\u7269', 'fruit', 1),
      // Animals
      mkp('\u732b', 'cat', 1), mkp('\u72ac', 'dog', 1), mkp('\u9b5a', 'fish', 1), mkp('\u9ce5', 'bird', 1), mkp('\u99ac', 'horse', 1),
      // Common phrases
      mkp('\u3044\u304f\u3089\u3067\u3059\u304b\uff1f', 'How much?', 1), mkp('\u30c8\u30a4\u30ec\u306f\u3069\u3053\u3067\u3059\u304b\uff1f', 'Where is the toilet?', 1), mkp('\u82f1\u8a9e\u3092\u8a71\u3057\u307e\u3059\u304b\uff1f', 'Do you speak English?', 1),
      mkp('\u308f\u304b\u308a\u307e\u305b\u3093', 'I don\'t understand', 1), mkp('\u304a\u3044\u3057\u3044', 'Delicious', 1),
      mkp('\u99c5', 'station', 1), mkp('\u7a7a\u6e2f', 'airport', 1), mkp('\u75c5\u9662', 'hospital', 1), mkp('\u30db\u30c6\u30eb', 'hotel', 1), mkp('\u5b66\u6821', 'school', 1),
    ],
    de: [
      // Greetings
      mkp('Guten Tag', 'Good day', 1), mkp('Guten Morgen', 'Good morning', 1), mkp('Guten Abend', 'Good evening', 1), mkp('Gute Nacht', 'Good night', 1),
      mkp('Auf Wiedersehen', 'Goodbye', 1), mkp('Tsch\u00fcss', 'Bye (informal)', 1), mkp('Bitte', 'Please / You\'re welcome', 1), mkp('Danke', 'Thank you', 1),
      mkp('Danke sch\u00f6n', 'Thank you very much', 1), mkp('Entschuldigung', 'Excuse me', 1), mkp('Ja', 'Yes', 1), mkp('Nein', 'No', 1),
      mkp('Wie geht es Ihnen?', 'How are you?', 1), mkp('Mir geht es gut', 'I\'m fine', 1),
      // Numbers
      mkp('eins', 'one', 1), mkp('zwei', 'two', 1), mkp('drei', 'three', 1), mkp('vier', 'four', 1), mkp('f\u00fcnf', 'five', 1),
      mkp('sechs', 'six', 1), mkp('sieben', 'seven', 1), mkp('acht', 'eight', 1), mkp('neun', 'nine', 1), mkp('zehn', 'ten', 1),
      // Food
      mkp('Wasser', 'water', 1), mkp('Kaffee', 'coffee', 1), mkp('Tee', 'tea', 1), mkp('Bier', 'beer', 1), mkp('Brot', 'bread', 1),
      mkp('K\u00e4se', 'cheese', 1), mkp('Fleisch', 'meat', 1), mkp('Fisch', 'fish', 1), mkp('Kuchen', 'cake', 1), mkp('Apfel', 'apple', 1),
      // Animals
      mkp('Katze', 'cat', 1), mkp('Hund', 'dog', 1), mkp('Vogel', 'bird', 1), mkp('Pferd', 'horse', 1), mkp('Kuh', 'cow', 1),
      // Common phrases
      mkp('Wie viel kostet das?', 'How much does it cost?', 1), mkp('Wo ist\u2026?', 'Where is\u2026?', 1), mkp('Sprechen Sie Englisch?', 'Do you speak English?', 1),
      mkp('Ich verstehe nicht', 'I don\'t understand', 1), mkp('Hilfe!', 'Help!', 1),
      mkp('Bahnhof', 'train station', 1), mkp('Flughafen', 'airport', 1), mkp('Krankenhaus', 'hospital', 1), mkp('Hotel', 'hotel', 1), mkp('Schule', 'school', 1),
    ],
    ko: [
      // Greetings
      mkp('\uc548\ub155\ud558\uc138\uc694', 'Hello', 1), mkp('\uac10\uc0ac\ud569\ub2c8\ub2e4', 'Thank you', 1), mkp('\uc8c4\uc1a1\ud569\ub2c8\ub2e4', 'Sorry', 1), mkp('\uc548\ub155\ud788 \uacc4\uc138\uc694', 'Goodbye', 1),
      mkp('\ub124', 'Yes', 1), mkp('\uc544\ub2c8\uc694', 'No', 1), mkp('\uc2e4\ub840\ud569\ub2c8\ub2e4', 'Excuse me', 1), mkp('\uc5b4\ub5bb\uac8c \uc9c0\ub0b4\uc138\uc694?', 'How are you?', 1),
      mkp('\uc798 \uc9c0\ub0b4\uc694', 'I\'m fine', 1), mkp('\ub9cc\ub098\uc11c \ubc18\uac11\uc2b5\ub2c8\ub2e4', 'Nice to meet you', 1), mkp('\uc548\ub155\ud788 \uac00\uc138\uc694', 'Goodbye (to one leaving)', 1), mkp('\uc0ac\ub791\ud574\uc694', 'I love you', 1),
      // Numbers
      mkp('\ud558\ub098', 'one', 1), mkp('\ub458', 'two', 1), mkp('\uc14b', 'three', 1), mkp('\ub137', 'four', 1), mkp('\ub2e4\uc12f', 'five', 1),
      mkp('\uc5ec\uc12f', 'six', 1), mkp('\uc77c\uacf1', 'seven', 1), mkp('\uc5ec\ub35f', 'eight', 1), mkp('\uc544\ud649', 'nine', 1), mkp('\uc5f4', 'ten', 1),
      // Food
      mkp('\ubb3c', 'water', 1), mkp('\ucee4\ud53c', 'coffee', 1), mkp('\ucc28', 'tea', 1), mkp('\ubc25', 'rice', 1), mkp('\uace0\uae30', 'meat', 1),
      mkp('\uc0dd\uc120', 'fish', 1), mkp('\ube44\ube54\ubc25', 'bibimbap', 1), mkp('\uae40\uce58', 'kimchi', 1), mkp('\ub9e5\uc8fc', 'beer', 1), mkp('\uacfc\uc77c', 'fruit', 1),
      // Animals
      mkp('\uace0\uc591\uc774', 'cat', 1), mkp('\uac1c', 'dog', 1), mkp('\uc0c8', 'bird', 1), mkp('\ubb3c\uace0\uae30', 'fish', 1), mkp('\ub9d0', 'horse', 1),
      // Common phrases
      mkp('\uc5bc\ub9c8\uc608\uc694?', 'How much?', 1), mkp('\uc5b4\ub514\uc608\uc694?', 'Where is it?', 1), mkp('\uc601\uc5b4 \ud558\uc138\uc694?', 'Do you speak English?', 1),
      mkp('\ubabb \uc54c\uc544\ub4e3\uaca0\uc5b4\uc694', 'I don\'t understand', 1), mkp('\ub9db\uc788\uc5b4\uc694', 'Delicious', 1),
      mkp('\uc5ed', 'station', 1), mkp('\uacf5\ud56d', 'airport', 1), mkp('\ubcd1\uc6d0', 'hospital', 1), mkp('\ud638\ud154', 'hotel', 1), mkp('\ud559\uad50', 'school', 1),
    ],
    it: [
      // Greetings
      mkp('Buongiorno', 'Good morning', 1), mkp('Buonasera', 'Good evening', 1), mkp('Buonanotte', 'Good night', 1), mkp('Arrivederci', 'Goodbye', 1),
      mkp('Ciao', 'Hi / Bye', 1), mkp('Per favore', 'Please', 1), mkp('Grazie', 'Thank you', 1), mkp('Grazie mille', 'Thank you very much', 1),
      mkp('Prego', 'You\'re welcome', 1), mkp('Scusi', 'Excuse me', 1), mkp('S\u00ec', 'Yes', 1), mkp('No', 'No', 1),
      mkp('Come sta?', 'How are you?', 1), mkp('Sto bene', 'I\'m fine', 1),
      // Numbers
      mkp('uno', 'one', 1), mkp('due', 'two', 1), mkp('tre', 'three', 1), mkp('quattro', 'four', 1), mkp('cinque', 'five', 1),
      mkp('sei', 'six', 1), mkp('sette', 'seven', 1), mkp('otto', 'eight', 1), mkp('nove', 'nine', 1), mkp('dieci', 'ten', 1),
      // Food
      mkp('acqua', 'water', 1), mkp('caff\u00e8', 'coffee', 1), mkp('t\u00e8', 'tea', 1), mkp('vino', 'wine', 1), mkp('pane', 'bread', 1),
      mkp('formaggio', 'cheese', 1), mkp('pasta', 'pasta', 1), mkp('pizza', 'pizza', 1), mkp('gelato', 'ice cream', 1), mkp('mela', 'apple', 1),
      // Animals
      mkp('gatto', 'cat', 1), mkp('cane', 'dog', 1), mkp('uccello', 'bird', 1), mkp('cavallo', 'horse', 1), mkp('pesce', 'fish', 1),
      // Common phrases
      mkp('Quanto costa?', 'How much does it cost?', 1), mkp('Dov\'\u00e8\u2026?', 'Where is\u2026?', 1), mkp('Parla inglese?', 'Do you speak English?', 1),
      mkp('Non capisco', 'I don\'t understand', 1), mkp('Aiuto!', 'Help!', 1),
      mkp('stazione', 'station', 1), mkp('aeroporto', 'airport', 1), mkp('ospedale', 'hospital', 1), mkp('albergo', 'hotel', 1), mkp('scuola', 'school', 1),
    ],
    ar: [
      // Greetings
      mkp('\u0645\u0631\u062d\u0628\u0627', 'Hello', 1), mkp('\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u064a\u0643\u0645', 'Peace be upon you', 1), mkp('\u0645\u0639 \u0627\u0644\u0633\u0644\u0627\u0645\u0629', 'Goodbye', 1), mkp('\u0635\u0628\u0627\u062d \u0627\u0644\u062e\u064a\u0631', 'Good morning', 1),
      mkp('\u0645\u0633\u0627\u0621 \u0627\u0644\u062e\u064a\u0631', 'Good evening', 1), mkp('\u0645\u0646 \u0641\u0636\u0644\u0643', 'Please', 1), mkp('\u0634\u0643\u0631\u0627\u064b', 'Thank you', 1), mkp('\u0634\u0643\u0631\u0627\u064b \u062c\u0632\u064a\u0644\u0627\u064b', 'Thank you very much', 1),
      mkp('\u0639\u0641\u0648\u0627\u064b', 'You\'re welcome / Excuse me', 1), mkp('\u0646\u0639\u0645', 'Yes', 1), mkp('\u0644\u0627', 'No', 1), mkp('\u0643\u064a\u0641 \u062d\u0627\u0644\u0643\u061f', 'How are you?', 1),
      // Numbers
      mkp('\u0648\u0627\u062d\u062f', 'one', 1), mkp('\u0627\u062b\u0646\u0627\u0646', 'two', 1), mkp('\u062b\u0644\u0627\u062b\u0629', 'three', 1), mkp('\u0623\u0631\u0628\u0639\u0629', 'four', 1), mkp('\u062e\u0645\u0633\u0629', 'five', 1),
      mkp('\u0633\u062a\u0629', 'six', 1), mkp('\u0633\u0628\u0639\u0629', 'seven', 1), mkp('\u062b\u0645\u0627\u0646\u064a\u0629', 'eight', 1), mkp('\u062a\u0633\u0639\u0629', 'nine', 1), mkp('\u0639\u0634\u0631\u0629', 'ten', 1),
      // Food
      mkp('\u0645\u0627\u0621', 'water', 1), mkp('\u0642\u0647\u0648\u0629', 'coffee', 1), mkp('\u0634\u0627\u064a', 'tea', 1), mkp('\u062e\u0628\u0632', 'bread', 1), mkp('\u0623\u0631\u0632', 'rice', 1),
      mkp('\u0644\u062d\u0645', 'meat', 1), mkp('\u062f\u062c\u0627\u062c', 'chicken', 1), mkp('\u0633\u0645\u0643', 'fish', 1), mkp('\u0641\u0627\u0643\u0647\u0629', 'fruit', 1), mkp('\u062a\u0641\u0627\u062d', 'apple', 1),
      // Animals
      mkp('\u0642\u0637\u0629', 'cat', 1), mkp('\u0643\u0644\u0628', 'dog', 1), mkp('\u0637\u0627\u0626\u0631', 'bird', 1), mkp('\u062d\u0635\u0627\u0646', 'horse', 1), mkp('\u0633\u0645\u0643\u0629', 'fish', 1),
      // Common phrases
      mkp('\u0628\u0643\u0645\u061f', 'How much?', 1), mkp('\u0623\u064a\u0646\u061f', 'Where?', 1), mkp('\u0647\u0644 \u062a\u062a\u0643\u0644\u0645 \u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629\u061f', 'Do you speak English?', 1),
      mkp('\u0644\u0627 \u0623\u0641\u0647\u0645', 'I don\'t understand', 1), mkp('\u0633\u0627\u0639\u062f\u0646\u064a!', 'Help!', 1),
      mkp('\u0645\u0637\u0627\u0631', 'airport', 1), mkp('\u0645\u0633\u062a\u0634\u0641\u0649', 'hospital', 1), mkp('\u0641\u0646\u062f\u0642', 'hotel', 1), mkp('\u0645\u062f\u0631\u0633\u0629', 'school', 1), mkp('\u0633\u0648\u0642', 'market', 1),
    ],
    pt: [
      // Greetings
      mkp('Ol\u00e1', 'Hello', 1), mkp('Bom dia', 'Good morning', 1), mkp('Boa tarde', 'Good afternoon', 1), mkp('Boa noite', 'Good evening / night', 1),
      mkp('Tchau', 'Bye', 1), mkp('Por favor', 'Please', 1), mkp('Obrigado / Obrigada', 'Thank you (m/f)', 1), mkp('De nada', 'You\'re welcome', 1),
      mkp('Com licen\u00e7a', 'Excuse me', 1), mkp('Desculpe', 'Sorry', 1), mkp('Sim', 'Yes', 1), mkp('N\u00e3o', 'No', 1),
      mkp('Como vai?', 'How are you?', 1), mkp('Bem, obrigado', 'Fine, thanks', 1),
      // Numbers
      mkp('um', 'one', 1), mkp('dois', 'two', 1), mkp('tr\u00eas', 'three', 1), mkp('quatro', 'four', 1), mkp('cinco', 'five', 1),
      mkp('seis', 'six', 1), mkp('sete', 'seven', 1), mkp('oito', 'eight', 1), mkp('nove', 'nine', 1), mkp('dez', 'ten', 1),
      // Food
      mkp('\u00e1gua', 'water', 1), mkp('caf\u00e9', 'coffee', 1), mkp('ch\u00e1', 'tea', 1), mkp('cerveja', 'beer', 1), mkp('p\u00e3o', 'bread', 1),
      mkp('queijo', 'cheese', 1), mkp('carne', 'meat', 1), mkp('peixe', 'fish', 1), mkp('arroz', 'rice', 1), mkp('ma\u00e7\u00e3', 'apple', 1),
      // Animals
      mkp('gato', 'cat', 1), mkp('cachorro', 'dog', 1), mkp('p\u00e1ssaro', 'bird', 1), mkp('cavalo', 'horse', 1), mkp('peixe', 'fish', 1),
      // Common phrases
      mkp('Quanto custa?', 'How much?', 1), mkp('Onde fica\u2026?', 'Where is\u2026?', 1), mkp('Voc\u00ea fala ingl\u00eas?', 'Do you speak English?', 1),
      mkp('N\u00e3o entendo', 'I don\'t understand', 1), mkp('Socorro!', 'Help!', 1),
      mkp('esta\u00e7\u00e3o', 'station', 1), mkp('aeroporto', 'airport', 1), mkp('hospital', 'hospital', 1), mkp('hotel', 'hotel', 1), mkp('escola', 'school', 1),
    ],
  };

  Object.keys(stubData).forEach(lc => {
    const s = stubData[lc];
    const dest = DEST.find(d => d.lc === lc);
    LANG[lc] = {
      name: s.name, flag: dest ? dest.flag : '',
      culture: [{ icon: '\u{1F30F}', tip: 'Cultural deep dives for ' + s.name + ' are coming soon! Core scenarios are available now.' }],
      grammar: [{ point: 'Key pattern', example: s.greet, note: 'More grammar spotlights coming with each scenario.' }],
      emergency: [
        { icon: '\u{1F198}', phrase: s.helpPhrase, trans: 'Help!', cat: 'Emergency' },
        { icon: '\u{1F3E5}', phrase: s.hospitalPhrase, trans: 'Where is the hospital?', cat: 'Medical' },
      ],
      convos: [],
      placementTest: [
        { q: 'What does "' + s.word + '" mean?', opts: s.wordOpts, ans: s.wordAns, lvl: 'A1' },
      ],
      scenarios: [
        { id: 1, icon: '\u2708️', place: s.airport, title: 'At the airport', sub: 'Check in and navigate', xp: 15, done: false, current: true,
          ex: [{ type: 'tap', q: 'What does "' + s.word + '" mean?', word: s.word, emoji: '\u{1F44B}', opts: s.wordOpts, ans: s.wordAns }],
        },
        { id: 2, icon: '\u{1F37D}️', place: s.restaurant, title: 'At a restaurant', sub: 'Order food and drinks', xp: 20, done: false, locked: true },
      ],
      pb: stubPhraseBooks[lc] || [
        mkp(s.thankPhrase, s.name === 'Portuguese' ? 'Thank you (m/f)' : 'Thank you very much', 1),
        mkp(s.excusePhrase, 'Excuse me', 1),
      ],
    };
  });

  // Add Mandarin Chinese
  LANG.zh = CHINESE_LANG;

  return LANG;
}

/* ═══════════════════════════════════════
   SVG HELPERS (as React components)
═══════════════════════════════════════ */
function CompassSVG({ sz = 40 }) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" stroke="#DDD6C8" strokeWidth="2" />
      <circle cx="24" cy="24" r="15" stroke="#EEE9DF" strokeWidth="1" />
      <line x1="24" y1="3" x2="24" y2="8" stroke="#BFB5A5" strokeWidth="2" strokeLinecap="round" />
      <line x1="45" y1="24" x2="40" y2="24" stroke="#BFB5A5" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="45" x2="24" y2="40" stroke="#BFB5A5" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="24" x2="8" y2="24" stroke="#BFB5A5" strokeWidth="2" strokeLinecap="round" />
      <text x="24" y="13" textAnchor="middle" style={{ fontSize: '7px', fontWeight: 800, fill: '#4F8EF7', fontFamily: 'system-ui' }}>N</text>
      <polygon points="24,12 27,25 24,23 21,25" fill="#4F8EF7" />
      <polygon points="24,36 21,23 24,25 27,23" fill="#F59E0B" />
      <circle cx="24" cy="24" r="3" fill="#1A1A2E" />
    </svg>
  );
}

function MomentumRing({ val }) {
  const r = 14, c = 2 * Math.PI * r, off = c * (1 - val / 100);
  const col = val > 60 ? '#4F8EF7' : val > 30 ? '#F59E0B' : '#F87171';
  return (
    <svg width="34" height="34" viewBox="0 0 34 34">
      <circle cx="17" cy="17" r={r} fill="none" stroke="#EEE9DF" strokeWidth="3.5" />
      <circle cx="17" cy="17" r={r} fill="none" stroke={col} strokeWidth="3.5" strokeLinecap="round"
        strokeDasharray={c.toFixed(1)} strokeDashoffset={off.toFixed(1)} transform="rotate(-90 17 17)" />
      <text x="17" y="21" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 800, fill: col, fontFamily: 'system-ui' }}>{val}</text>
    </svg>
  );
}

function StarSVG({ col = '#F59E0B' }) {
  return <svg width="14" height="14" viewBox="0 0 16 16"><path d="M8 1l1.8 3.6L14 5.5l-3 2.9.7 4.1L8 10.5l-3.7 1.9.7-4.1-3-2.9 4.2-.9z" fill={col} /></svg>;
}

/* ProgressBar, SpeakBtn moved inside component to access theme-aware T */

function Confetti() {
  const cols = ['#0B6E6E', '#C06A00', '#2E7D4F', '#C0392B', '#5B21B6', '#F59E0B'];
  const pieces = [];
  for (let i = 0; i < 18; i++) {
    const c = cols[i % cols.length], x = Math.random() * 360 + 15, r = Math.random() * 360;
    const dur = (0.8 + Math.random() * 0.8) + 's';
    const delay = (Math.random() * 0.4) + 's';
    pieces.push(
      <div key={i} style={{
        position: 'absolute', width: 10, height: 10, borderRadius: 2,
        left: x, top: 20, background: c,
        animation: `confettiFall ${dur} ${delay} ease-in forwards`,
        opacity: 0, transform: `rotate(${r}deg)`,
      }} />
    );
  }
  return <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 100 }}>{pieces}</div>;
}

/* Chip moved inside component to access theme-aware T */

/* ═══════════════════════════════════════
   STORAGE HELPERS
═══════════════════════════════════════ */
const STORAGE_KEY = 'nw_lang_state';

function loadState() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function saveState(s) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      destId: s.dest ? s.dest.id : null,
      xp: s.xp, momentum: s.momentum, accuracy: s.accuracy,
      level: s.level, levelName: s.levelName,
      replays: s.replays, heatmap: s.heatmap,
    }));
  } catch (e) {}
}

/* ═══════════════════════════════════════
   KEYFRAME STYLES (injected once)
═══════════════════════════════════════ */
const KEYFRAMES = `
@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
@keyframes slideUpPanel{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes bounceIn{0%{opacity:0;transform:scale(.7)}60%{transform:scale(1.08)}80%{transform:scale(.97)}100%{opacity:1;transform:scale(1)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
@keyframes floatUp{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-40px)}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 0 0 rgba(11,110,110,.4)}50%{box-shadow:0 0 0 14px rgba(11,110,110,0)}}
@keyframes tickIn{0%{transform:scale(0)}60%{transform:scale(1.3)}100%{transform:scale(1)}}
@keyframes popIn{0%{opacity:0;transform:scale(.6) rotate(-10deg)}70%{transform:scale(1.1) rotate(3deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes typingBounce{0%,80%,100%{transform:scale(0);opacity:.5}40%{transform:scale(1);opacity:1}}
@keyframes confettiFall{0%{opacity:1;transform:translateY(-20px) rotate(0)}100%{opacity:0;transform:translateY(120px) rotate(720deg)}}
@keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes heartShake{0%,100%{transform:scale(1)}25%{transform:scale(1.3) rotate(-10deg)}50%{transform:scale(0.8) rotate(10deg)}75%{transform:scale(1.1) rotate(-5deg)}}
@keyframes heartFade{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0.3)}}
@keyframes reactionPop{0%{opacity:0;transform:translate(-50%,-50%) scale(.3)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}
@keyframes reactionFade{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(.6) translateY(-30px)}}
@keyframes micPulse{0%,100%{box-shadow:0 0 0 0 rgba(79,142,247,0.5)}50%{box-shadow:0 0 0 16px rgba(79,142,247,0)}}
`;

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function LanguagesPage() {
  const { theme } = useTheme();
  const T = getTokens(theme === 'dark');
  const { recordCall } = useSessionLimit();
  const gate = useProductGate('languages');
  const [showPaywall, setShowPaywall] = useState(false);

  /* ─── Theme-aware helper components ─── */
  function ProgressBar({ value, max, height = 10, cls = '' }) {
    const pct = Math.min(100, Math.round(value / max * 100));
    const bgColor = cls === 'amber' ? T.amber : cls === 'green' ? T.green : T.teal;
    return (
      <div style={{ height, background: T.n100, borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 100, background: bgColor, width: pct + '%', transition: 'width .5s cubic-bezier(.4,0,.2,1)' }} />
      </div>
    );
  }
  function SpeakBtn({ word, lc }) {
    return (
      <button onClick={() => speakText(word, lc)} title="Listen" style={{
        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        background: T.tealL, border: `2px solid ${T.teal}`,
        color: T.teal, fontSize: 16, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .15s',
      }}>
        {'\u{1F50A}'}
      </button>
    );
  }
  function Chip({ type, children }) {
    const map = {
      teal: { bg: T.tealL, color: T.tealD },
      green: { bg: T.greenL, color: T.greenD },
      amber: { bg: T.amberL, color: T.amberD },
      red: { bg: T.redL, color: T.redD },
      purple: { bg: T.purpleL, color: T.purple },
    };
    const s = map[type] || map.teal;
    return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 800, background: s.bg, color: s.color }}>{children}</span>;
  }

  function Reaction({ emoji, text }) {
    return (
      <div style={{ position:'absolute', top:'30%', left:'50%', transform:'translate(-50%,-50%)',
        zIndex:200, textAlign:'center', animation:'reactionPop .5s ease both', pointerEvents:'none' }}>
        <div style={{ fontSize:64 }}>{emoji}</div>
        {text && <div style={{ fontSize:18, fontWeight:800, color:T.n700, marginTop:8 }}>{text}</div>}
      </div>
    );
  }

  function showReaction(emoji, text) {
    if (reactionTimer.current) clearTimeout(reactionTimer.current);
    setReaction({ emoji, text });
    reactionTimer.current = setTimeout(() => setReaction(null), 1500);
  }

  function speakExerciseInstruction(ex) {
    if (!audioFirst || !ex) return;
    if (ex.type === 'tap') speakInstruction('Tap the word that means ' + ex.ans);
    else if (ex.type === 'listen') { /* already speaks the foreign phrase */ }
    else if (ex.type === 'build') speakInstruction('Build the sentence: ' + (ex.tr || ''));
    else if (ex.type === 'fill') {
      const readSentence = (ex.sentence || '').replace('___', 'blank');
      speakInstruction('Fill in the blank: ' + readSentence);
    }
    else if (ex.type === 'match') speakInstruction('Match each word to its meaning');
    else if (ex.type === 'speak') speakInstruction('Tap and say: ' + (ex.speak_word || ''));
  }

  const [LANG] = useState(() => buildLangData());

  // Mother tongue support
  const [motherTongue, setMotherTongue] = useState('en');
  function changeMotherTongue(id) {
    setMotherTongue(id);
    try { localStorage.setItem('nw_lang_mother_tongue', id); } catch (e) {}
  }
  // Shorthand for UI strings in current mother tongue
  function uiStr(key) { return getUIString(key, motherTongue); }
  function mtTrans(englishText) { return getTranslation(englishText, motherTongue); }

  const [phase, setPhase] = useState('landing');
  const [tab, setTab] = useState('learn');
  const [dest, setDest] = useState(null);
  const [ld, setLd] = useState(null);
  const [momentum, setMomentum] = useState(72);
  const [xp, setXp] = useState(340);
  const [replays, setReplays] = useState(0);
  const [accuracy, setAccuracy] = useState(84);
  const [level, setLevel] = useState('A1');
  const [levelName, setLevelName] = useState('Beginner');
  const [heatmap, setHeatmap] = useState([3, 0, 4, 2, 5, 1, 0]);

  // Hearts / Lives system
  const [hearts, setHearts] = useState(5);
  const [heartsOut, setHeartsOut] = useState(false);
  const [lostHeartIdx, setLostHeartIdx] = useState(-1);
  const [correctStreak, setCorrectStreak] = useState(0);

  // Audio-first mode
  const [audioFirst, setAudioFirst] = useState(true);

  // Animated Reactions
  const [reaction, setReaction] = useState(null); // { emoji, text }
  const reactionTimer = useRef(null);

  // Speak exercise state
  const [speakRecording, setSpeakRecording] = useState(false);
  const [speakResult, setSpeakResult] = useState(null); // { match, spoken, close }
  const [speakAttempts, setSpeakAttempts] = useState(0);
  const speakRecRef = useRef(null);

  // Exercise state
  const [inEx, setInEx] = useState(false);
  const [exSc, setExSc] = useState(null);
  const [exIdx, setExIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [chk, setChk] = useState(false);
  const [ok, setOk] = useState(false);
  const [built, setBuilt] = useState([]);
  const [matchSel, setMatchSel] = useState(null);
  const [matchDone, setMatchDone] = useState([]);
  const [matchR, setMatchR] = useState(null);
  const [shk, setShk] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [exDone, setExDone] = useState(false);
  const [exMistakes, setExMistakes] = useState(0);
  const [exEarned, setExEarned] = useState(0);

  // Grammar/Culture interstitials
  const [gramIdx, setGramIdx] = useState(0);
  const [cultIdx, setCultIdx] = useState(0);
  const [showGram, setShowGram] = useState(false);
  const [showCult, setShowCult] = useState(false);

  // Conversation state
  const [inConvo, setInConvo] = useState(false);
  const [convo, setConvo] = useState(null);
  const [convIdx, setConvIdx] = useState(0);
  const [convScore, setConvScore] = useState(0);
  const [convDone, setConvDone] = useState(false);
  const [convHist, setConvHist] = useState([]);

  // Free chat with Starky in target language
  const [freeChat, setFreeChat] = useState(false);
  const [freeMsgs, setFreeMsgs] = useState([]);
  const [freeInput, setFreeInput] = useState('');
  const [freeLoading, setFreeLoading] = useState(false);
  const freeChatEndRef = useRef(null);

  // Placement test state
  const [inTest, setInTest] = useState(false);
  const [testIdx, setTestIdx] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [toTest, setToTest] = useState(false);

  // Emergency
  const [showEmergency, setShowEmergency] = useState(false);

  // Load voices
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  // Load persisted state
  useEffect(() => {
    // Load mother tongue preference
    try {
      const savedMT = localStorage.getItem('nw_lang_mother_tongue');
      if (savedMT && MOTHER_TONGUES.find(m => m.id === savedMT)) setMotherTongue(savedMT);
    } catch (e) {}
    const saved = loadState();
    if (saved) {
      if (saved.xp != null) setXp(saved.xp);
      if (saved.momentum != null) setMomentum(saved.momentum);
      if (saved.accuracy != null) setAccuracy(saved.accuracy);
      if (saved.level) setLevel(saved.level);
      if (saved.levelName) setLevelName(saved.levelName);
      if (saved.replays != null) setReplays(saved.replays);
      if (saved.heatmap) setHeatmap(saved.heatmap);
      if (saved.destId) {
        const d = DEST.find(x => x.id === saved.destId);
        if (d) { setDest(d); setLd(LANG[d.lc] || LANG.fr); setPhase('main'); }
      }
    }
  }, [LANG]);

  // Save state on changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      saveState({ dest, xp, momentum, accuracy, level, levelName, replays, heatmap });
    }
  }, [dest, xp, momentum, accuracy, level, levelName, replays, heatmap]);

  // Auto-speak for exercises
  const autoSpeak = useCallback(() => {
    if (!inEx || exDone || !exSc) return;
    const ex = exSc.ex && exSc.ex[exIdx];
    if (!ex || !dest) return;
    const txt = ex.speak_word || ex.word || ex.hint || '';
    if (txt && ex.type !== 'match') setTimeout(() => speakText(txt, dest.lc), 500);
  }, [inEx, exDone, exSc, exIdx, dest]);

  /* ─── ACTIONS ─── */
  function go(p) {
    if (p === 'test') { setPhase('dest'); setToTest(true); return; }
    setPhase(p);
  }

  function pickDest(id) {
    const d = DEST.find(x => x.id === id);
    setDest(d);
    const langData = LANG[d.lc] || LANG.fr;
    setLd(langData);
    if (toTest) {
      setToTest(false);
      setInTest(true); setTestIdx(0); setTestScore(0); setSel(null); setChk(false); setOk(false);
      return;
    }
    setPhase('pace');
  }

  function pickPace() { setPhase('main'); setTab('learn'); }

  function testSel(o) { if (chk) return; sndTick(); setSel(o); }
  function checkTest() {
    if (!sel || !ld) return;
    const q = ld.placementTest[testIdx];
    const isOk = sel === q.ans;
    setOk(isOk); setChk(true);
    if (isOk) { sndOk(); setTestScore(s => s + 1); } else sndErr();
  }
  function nextTestQ() { setTestIdx(i => i + 1); setSel(null); setChk(false); setOk(false); }
  function doneTest() {
    setInTest(false);
    setPhase('pace');
  }

  function startEx(id) {
    if (!ld) return;
    if (gate.blocked) { setShowPaywall(true); return; }
    gate.recordRound();
    const sc = ld.scenarios.find(s => s.id === id);
    if (!sc || !sc.ex) return;
    setExSc(sc); setInEx(true); setExIdx(0); setSel(null); setChk(false); setOk(false);
    setBuilt([]); setMatchSel(null); setMatchDone([]); setMatchR(null);
    setShk(false); setShowXP(false); setExDone(false); setExMistakes(0); setExEarned(0);
    setShowGram(false); setShowCult(false);
    setHearts(5); setHeartsOut(false); setLostHeartIdx(-1); setCorrectStreak(0);
    setSpeakRecording(false); setSpeakResult(null); setSpeakAttempts(0);
    setReaction(null);
    setTimeout(() => {
      const ex = sc.ex && sc.ex[0];
      if (ex && dest) {
        if (audioFirst && ex.type !== 'listen') {
          setTimeout(() => speakExerciseInstruction(ex), 500);
        }
        const txt = ex.speak_word || ex.word || ex.hint || '';
        if (txt && ex.type !== 'match' && ex.type !== 'speak') setTimeout(() => speakText(txt, dest.lc), 500);
      }
    }, 300);
  }

  function closeEx() { setInEx(false); setShowGram(false); setShowCult(false); setHeartsOut(false); setReaction(null); setSpeakRecording(false); setSpeakResult(null); setSpeakAttempts(0); }
  function selOpt(o) { if (chk) return; sndTick(); setSel(o); }
  function addWord(w) { if (chk) return; sndTick(); setBuilt(b => [...b, w]); }
  function removeWord(i) { if (chk) return; sndPop(); setBuilt(b => { const n = [...b]; n.splice(i, 1); return n; }); }

  function matchClick(side, idx) {
    if (!exSc || !exSc.ex) return;
    const ex = exSc.ex[exIdx];
    const pairs = ex.pairs;
    sndTick();
    if (matchSel === null) { setMatchSel(side + idx); return; }
    const pSide = matchSel[0], pIdx = parseInt(matchSel.slice(1));
    if (pSide === side) { setMatchSel(side + idx); return; }
    const lIdx = side === 'l' ? idx : pIdx;
    const rIdx = side === 'r' ? idx : pIdx;
    const curMatchR = matchR || pairs.map(p => p[1]).sort(() => Math.random() - 0.5);
    if (!matchR) setMatchR(curMatchR);
    const rWord = curMatchR[rIdx];
    const correct = pairs[lIdx][1];
    if (rWord === correct) { sndOk(); setMatchDone(d => [...d, lIdx]); }
    else sndErr();
    setMatchSel(null);
  }

  const norm = s => s.toLowerCase().replace(/[\u00e0\u00e1\u00e2\u00e4]/g, 'a').replace(/[\u00e8\u00e9\u00ea\u00eb]/g, 'e').replace(/[\u00ec\u00ed\u00ee\u00ef]/g, 'i').replace(/[\u00f2\u00f3\u00f4\u00f6]/g, 'o').replace(/[\u00f9\u00fa\u00fb\u00fc]/g, 'u').replace(/[\u00e7]/g, 'c').replace(/[\u00f1]/g, 'n').replace(/[?!\u00bf\u00a1,.']/g, '').trim();

  function checkEx2() {
    if (!exSc || !exSc.ex) return;
    const ex = exSc.ex[exIdx];
    let isOk;
    if (ex.type === 'build') isOk = norm(built.join(' ')) === norm(ex.ans);
    else isOk = sel === ex.ans;
    setOk(isOk); setChk(true);
    const gain = Math.round(exSc.xp / Math.max(exSc.ex.length, 1));
    if (isOk) {
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);
      setExEarned(e => e + gain); setXp(x => x + gain);
      setMomentum(m => Math.min(100, m + 3));
      setAccuracy(a => Math.min(100, Math.round((a * 10 + 100) / 11)));
      setShowXP(true); sndOk();
      setTimeout(() => setShowXP(false), 900);
      // Earn a heart back on 3 correct in a row
      if (newStreak > 0 && newStreak % 3 === 0 && hearts < 5) {
        setHearts(h => Math.min(5, h + 1));
      }
      // Animated reaction
      if (newStreak >= 3 && newStreak % 3 === 0) {
        showReaction('\u{1F525}\u{1F525}\u{1F525}', 'ON FIRE!');
      } else {
        const emojis = ['\u{1F389}', '\u2B50', '\u{1F31F}', '\u{1F4AA}', '\u{1F525}', '\u2728'];
        showReaction(emojis[Math.floor(Math.random() * emojis.length)]);
      }
    } else {
      setCorrectStreak(0);
      setExMistakes(m => m + 1); setReplays(r => r + 1);
      setShk(true); sndErr();
      setTimeout(() => setShk(false), 600);
      // Hearts system
      const newHearts = hearts - 1;
      setLostHeartIdx(newHearts);
      setHearts(newHearts);
      setTimeout(() => setLostHeartIdx(-1), 800);
      if (newHearts <= 0) {
        setTimeout(() => setHeartsOut(true), 600);
      }
      showReaction('\u{1F4AA}', 'Try again!');
    }
    setHeatmap(h => { const n = [...h]; n[4] = Math.min(5, (n[4] || 0) + 1); return n; });
  }

  function nextQ() {
    if (!exSc || !exSc.ex) return;
    const sc = exSc;
    const last = exIdx >= sc.ex.length - 1;
    // Reset speak exercise state
    setSpeakRecording(false); setSpeakResult(null); setSpeakAttempts(0);
    if (last) {
      sc.done = true; sc.current = false;
      const idx = ld.scenarios.indexOf(sc);
      if (idx >= 0 && idx + 1 < ld.scenarios.length) {
        ld.scenarios[idx + 1].locked = false;
        ld.scenarios[idx + 1].current = true;
      }
      sc.ex.forEach(ex => {
        if (ex.type === 'build' && ex.hint && !ld.pb.find(p => p.p === ex.hint))
          ld.pb.unshift(mkp(ex.hint, ex.tr, 2));
      });
      setExDone(true); sndWin();
    } else {
      const newIdx = exIdx + 1;
      setExIdx(newIdx); setSel(null); setChk(false); setOk(false);
      setBuilt([]); setMatchSel(null); setMatchDone([]); setMatchR(null);
      setShk(false); setShowXP(false);
      const showG = ld.grammar && ld.grammar.length && newIdx > 0 && newIdx % 2 === 0;
      const showC = ld.culture && ld.culture.length && newIdx > 0 && newIdx % 3 === 0 && !showG;
      if (showG) { setShowGram(true); setGramIdx(g => g + 1); }
      else if (showC) { setShowCult(true); setCultIdx(c => c + 1); }
      else {
        setTimeout(() => {
          const ex = sc.ex && sc.ex[newIdx];
          if (ex && dest) {
            if (audioFirst && ex.type !== 'listen') speakExerciseInstruction(ex);
            const txt = ex.speak_word || ex.word || ex.hint || '';
            if (txt && ex.type !== 'match' && ex.type !== 'speak') speakText(txt, dest.lc);
          }
        }, 500);
      }
    }
  }

  function dismissGram() {
    setShowGram(false);
    setTimeout(() => {
      if (exSc && exSc.ex && exSc.ex[exIdx] && dest) {
        const ex = exSc.ex[exIdx];
        const txt = ex.speak_word || ex.word || ex.hint || '';
        if (txt && ex.type !== 'match') speakText(txt, dest.lc);
      }
    }, 300);
  }
  function dismissCult() {
    setShowCult(false);
    setTimeout(() => {
      if (exSc && exSc.ex && exSc.ex[exIdx] && dest) {
        const ex = exSc.ex[exIdx];
        const txt = ex.speak_word || ex.word || ex.hint || '';
        if (txt && ex.type !== 'match') speakText(txt, dest.lc);
      }
    }, 300);
  }

  function doneEx() { setInEx(false); setTab('learn'); }

  function startConvo(id) {
    if (!ld) return;
    const cv = (ld.convos || []).find(c => c.id === id);
    if (!cv) return;
    setConvo(cv); setInConvo(true); setConvIdx(0); setConvScore(0); setConvDone(false); setConvHist([]);
    if (cv.turns[0]) setTimeout(() => speakText(cv.turns[0].npc, dest && dest.lc), 600);
  }

  function pickConvo(ci) {
    const turn = convo.turns[convIdx];
    const ch = turn.choices[ci];
    sndTick();
    const q = ch.q;
    if (q >= 4) sndOk(); else if (q < 3) sndErr();
    setConvScore(s => s + (q >= 4 ? 1 : q >= 3 ? 0.5 : 0));
    setConvHist(h => [...h, { npc: turn.npc, npc_tr: turn.npc_tr, choice: ch.text, q }]);
    const newIdx = convIdx + 1;
    setConvIdx(newIdx);
    if (newIdx >= convo.turns.length) { setConvDone(true); sndWin(); }
    else setTimeout(() => speakText(convo.turns[newIdx].npc, dest && dest.lc), 500);
  }

  function endConvo() { setInConvo(false); }

  function handleShowEmergency() { setShowEmergency(true); if (!ld) setLd(LANG.fr); }
  function hideEmergency() { setShowEmergency(false); }

  /* ─── STYLE OBJECTS ─── */
  const sBtn = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '16px 24px', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 800, letterSpacing: '.02em', borderRadius: 16, transition: 'transform .1s, filter .1s', position: 'relative', top: 0, fontFamily: T.f };
  const sBtnPrimary = { ...sBtn, background: T.teal, color: '#fff', boxShadow: `0 5px 0 ${T.tealD}` };
  const sBtnSecondary = { ...sBtn, background: T.n0, color: T.n600, border: `2px solid ${T.n200}`, boxShadow: `0 4px 0 ${T.n200}` };
  const sBtnGreen = { ...sBtn, background: T.green, color: '#fff', boxShadow: `0 5px 0 ${T.greenD}` };
  const sBtnRed = { ...sBtn, background: T.red, color: '#fff', boxShadow: `0 5px 0 ${T.redD}` };
  const sBtnDisabled = { ...sBtn, background: T.n100, color: T.n300, boxShadow: `0 5px 0 ${T.n200}`, cursor: 'default' };

  function OptBtn({ text, letter, isSelected, isCorrect, isWrong, disabled, onClick }) {
    let bg = T.n0, border = `2px solid ${T.n200}`, shadow = `0 4px 0 ${T.n200}`, color = T.n700;
    let lBg = T.n50, lBorder = `2px solid ${T.n200}`, lColor = T.n700;
    if (isCorrect) { bg = T.greenL; border = `2px solid ${T.green}`; shadow = `0 4px 0 ${T.greenD}`; color = T.greenD; lBg = T.green; lBorder = `2px solid ${T.green}`; lColor = '#fff'; }
    else if (isWrong) { bg = T.redL; border = `2px solid ${T.red}`; shadow = `0 4px 0 ${T.redD}`; color = T.redD; lBg = T.red; lBorder = `2px solid ${T.red}`; lColor = '#fff'; }
    else if (isSelected) { bg = T.tealL; border = `2px solid ${T.teal}`; shadow = `0 4px 0 ${T.teal}`; color = T.tealD; lBg = T.teal; lBorder = `2px solid ${T.teal}`; lColor = '#fff'; }
    return (
      <button disabled={disabled} onClick={onClick} style={{
        width: '100%', padding: '15px 18px', borderRadius: 16,
        display: 'flex', alignItems: 'center', gap: 12,
        border, background: bg, cursor: disabled ? 'default' : 'pointer',
        transition: 'all .12s', boxShadow: shadow,
        fontSize: 15, fontWeight: 700, color, textAlign: 'left',
        marginBottom: 9, fontFamily: T.f,
      }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, flexShrink: 0, border: lBorder, background: lBg, color: lColor, transition: 'all .12s' }}>{letter}</div>
        <span>{text}</span>
      </button>
    );
  }

  /* ─── TOPBAR ─── */
  function TopBar({ showHearts = false }) {
    const due = ld ? ld.pb.filter(isDue).length : 0;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: T.n0, borderBottom: `1.5px solid ${T.n100}`, flexShrink: 0 }}>
        <MomentumRing val={momentum} />
        <div style={{ flex: 1, paddingLeft: 4 }}><div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.n400 }}>Momentum</div></div>
        {showHearts && (
          <div style={{ display: 'flex', gap: 2, fontSize: 16 }}>
            {[0,1,2,3,4].map(i => (
              <span key={i} style={{
                transition: 'all .3s',
                animation: lostHeartIdx === i ? 'heartShake .5s ease, heartFade .5s ease .3s forwards' : 'none',
              }}>{i < hearts ? '\u2764\uFE0F' : '\u{1F90D}'}</span>
            ))}
          </div>
        )}
        <button onClick={() => setAudioFirst(a => !a)} style={{
          background: audioFirst ? T.tealL : T.n100,
          border: `1.5px solid ${audioFirst ? T.teal : T.n200}`,
          borderRadius: 8, padding: '4px 8px', fontSize: 12, fontWeight: 700,
          cursor: 'pointer', color: audioFirst ? T.tealD : T.n400, fontFamily: T.f,
          display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0,
        }}>{'\u{1F50A}'} Audio</button>
        {due > 0 && <Chip type="amber">{'\u{1F504}'} {due} due</Chip>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 15, fontWeight: 800 }}><StarSVG /><span style={{ color: T.amber }}>{xp}</span></div>
        {dest && <span style={{ fontSize: 22, marginLeft: 8 }}>{dest.flag}</span>}
      </div>
    );
  }

  /* ─── BOTTOM NAV ─── */
  function BNav() {
    const tabs = [['learn', '\u{1F5FA}️', 'Journey'], ['chat', '\u{1F4AC}', 'Chat'], ['phrases', '\u{1F4D6}', 'Phrases'], ['profile', '\u{1F4CA}', 'Progress']];
    return (
      <div style={{ display: 'flex', background: T.n0, borderTop: `1.5px solid ${T.n100}`, flexShrink: 0, paddingBottom: 'env(safe-area-inset-bottom, 0)', zIndex: 50 }}>
        {tabs.map(t => {
          const active = tab === t[0];
          return (
            <button key={t[0]} onClick={() => setTab(t[0])} style={{
              flex: 1, height: 52, border: 'none', background: 'transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              cursor: 'pointer', position: 'relative', fontFamily: T.f,
            }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 32, height: 3, background: T.teal, borderRadius: '0 0 100px 100px', opacity: active ? 1 : 0, transition: 'opacity .2s' }} />
              <span style={{ fontSize: 20, transition: 'transform .2s', transform: active ? 'scale(1.1)' : 'scale(1)' }}>{t[1]}</span>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: active ? T.teal : T.n300, transition: 'color .2s' }}>{t[2]}</span>
            </button>
          );
        })}
      </div>
    );
  }

  /* ═══════════════════════════════════════
     SCREENS
  ═══════════════════════════════════════ */

  function LandingScreen() {
    const features = [
      ['\u{1F9E0}', 'SM-2 spaced repetition', 'Reviews phrases at the exact moment before you forget — scientifically proven'],
      ['\u{1F3AD}', '7 interactive exercise types', 'Tap, build, listen, match, fill-blank, pronunciation — all wired to audio'],
      ['\u{1F4AC}', 'Conversation simulator', 'Practice real dialogues with characters before your trip'],
      ['\u{1F30D}', 'Cultural intelligence', 'Customs, etiquette and faux pas woven into every lesson'],
      ['\u{1F4CA}', 'Learning analytics', 'Track your forgetting curve, accuracy and weekly progress'],
      ['\u{1F5FA}️', 'Destination-first', 'Tell us where you\'re going — content adapts to your goal'],
    ];
    return (
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: `linear-gradient(180deg, ${T.n50} 0%, ${T.n0} 40%)`, animation: 'slideUp .3s ease both' }}>
        <div style={{ padding: '32px 24px 24px', textAlign: 'center', borderBottom: `1.5px solid ${T.n100}` }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <CompassSVG sz={34} />
            <span style={{ fontSize: 22, fontWeight: 800, color: T.n700, fontFamily: T.f }}>Learn Languages</span>
          </div>
          <div style={{ marginBottom: 18, animation: 'bob 2.4s ease-in-out infinite' }}><CompassSVG sz={108} /></div>
          <p style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.15, color: T.n700, fontFamily: T.fs, marginBottom: 10, direction: (MOTHER_TONGUES.find(m => m.id === motherTongue) || {}).dir === 'rtl' ? 'rtl' : 'ltr' }}>
            {motherTongue === 'ur' ? '\u0627\u067E\u0646\u06CC \u0645\u0646\u0632\u0644 \u06A9\u06D2 \u0644\u06CC\u06D2\n\u0633\u06CC\u06A9\u06BE\u06CC\u06BA\u06D4' :
             motherTongue === 'sd' ? '\u067E\u0646\u0647\u0646\u062C\u064A \u0645\u0646\u0632\u0644 \u0644\u0627\u0621\u064A\n\u0633\u06A9\u0648.' :
             motherTongue === 'pa' ? '\u0627\u067E\u0646\u06CC \u0645\u0646\u0632\u0644 \u0644\u0626\u06CC\n\u0633\u06A9\u06BE\u0648\u06D4' :
             motherTongue === 'ps' ? '\u062F \u062E\u067E\u0644 \u0645\u0646\u0632\u0644 \u0644\u067E\u0627\u0631\u0647\n\u0632\u062F\u0647 \u06A9\u0693\u0626.' :
             <>Learn for your<br />destination.</>}
          </p>
          <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.6, color: T.n500, maxWidth: 290, margin: '0 auto' }}>Every lesson built around where you{"'"}re going and why {"—"} not random vocab lists.</p>
          {/* Mother Tongue Selector */}
          <div style={{ marginTop: 22, padding: '14px 0 6px' }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: T.n300, marginBottom: 10 }}>Your language / {'\u0622\u067E \u06A9\u06CC \u0632\u0628\u0627\u0646'}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6 }}>
              {MOTHER_TONGUES.map(mt => {
                const active = motherTongue === mt.id;
                const isRTL = mt.dir === 'rtl';
                return (
                  <button key={mt.id} onClick={() => changeMotherTongue(mt.id)} style={{
                    padding: '7px 14px', borderRadius: 100, fontSize: 13, fontWeight: 700,
                    border: active ? `2px solid ${T.teal}` : `1.5px solid ${T.n200}`,
                    background: active ? T.tealL : T.n0, color: active ? T.tealD : T.n500,
                    cursor: 'pointer', transition: 'all .15s', fontFamily: T.f,
                    direction: isRTL ? 'rtl' : 'ltr',
                  }}>{mt.native}</button>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 22px' }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '13px 0', borderBottom: `1.5px solid ${T.n100}` }}>
              <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{f[0]}</span>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.n600, marginBottom: 2 }}>{f[1]}</div>
                <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400 }}>{f[2]}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '14px 22px 100px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => go('test')} style={sBtnPrimary}>Take placement test</button>
          <button onClick={() => go('dest')} style={sBtnSecondary}>Choose destination →</button>
          <button onClick={handleShowEmergency} style={{ background: T.redL, color: T.red, border: `2px solid ${T.red}`, borderRadius: 16, padding: 12, fontSize: 13, fontWeight: 800, cursor: 'pointer', width: '100%', fontFamily: T.f }}>{'\u{1F198}'} Emergency phrases — trip in 24 hours?</button>
        </div>
      </div>
    );
  }

  function EmergencyScreen() {
    const langData = ld || LANG.fr;
    const cats = ['Emergency', 'Medical', 'Transport', 'Hotel', 'Payment', 'Directions', 'Communication'];
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', animation: 'slideUp .3s ease both' }}>
        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1.5px solid ${T.n100}`, background: T.redL, flexShrink: 0 }}>
          <button onClick={hideEmergency} style={{ width: 32, height: 32, borderRadius: '50%', background: T.redL, border: `1.5px solid ${T.red}`, fontSize: 14, color: T.red, cursor: 'pointer', fontFamily: T.f }}>✕</button>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.red }}>{'\u{1F198}'} Emergency Phrases</div>
            <p style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.red }}>{langData.name} survival kit — tap {'\u{1F50A}'} to hear any phrase</p>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '14px 14px' }}>
          {cats.map(cat => {
            const phrases = langData.emergency.filter(e => e.cat === cat);
            if (!phrases.length) return null;
            return (
              <div key={cat} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.n300, marginBottom: 8 }}>{cat}</div>
                {phrases.map((e, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: T.n0, borderRadius: 12, border: `1.5px solid ${T.n100}`, boxShadow: `0 2px 0 ${T.n100}`, marginBottom: 7 }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{e.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: T.n700, fontFamily: T.fs }}>{e.phrase}</div>
                      <div style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400 }}>{e.trans}</div>
                    </div>
                    <SpeakBtn word={e.phrase} lc={langData === LANG.fr ? 'fr' : dest ? dest.lc : 'fr'} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div style={{ padding: 14, borderTop: `1.5px solid ${T.n100}`, flexShrink: 0 }}>
          <button onClick={hideEmergency} style={sBtnRed}>Done — back to learning</button>
        </div>
      </div>
    );
  }

  function DestScreen() {
    return (
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', animation: 'slideUp .3s ease both' }}>
        <div style={{ padding: '24px 20px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.n300, marginBottom: 6 }}>Choose your destination</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, color: T.n700, marginBottom: 4 }}>Where are you headed?</h2>
          <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400 }}>Every lesson is tailored to your destination.</p>
        </div>
        <div style={{ padding: '0 14px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {DEST.map(d => (
            <div key={d.id} onClick={() => pickDest(d.id)} style={{
              padding: '18px 12px', background: T.n0, border: `2px solid ${T.n100}`, borderRadius: 16,
              cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5,
              transition: 'all .15s', boxShadow: `0 3px 0 ${T.n100}`,
            }}>
              <span style={{ fontSize: 34 }}>{d.flag}</span>
              <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.n600 }}>{d.name}</div>
              <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400, letterSpacing: '.04em' }}>{d.lang}</div>
              <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n300, letterSpacing: '.04em' }}>{d.tagline}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function TestScreen() {
    if (!ld) return null;
    const qs = ld.placementTest || [];
    if (testIdx >= qs.length) {
      const pct = qs.length ? testScore / qs.length : 0;
      const lvl = pct >= 0.8 ? 'B1' : pct >= 0.6 ? 'A2' : 'A1';
      const lvlName = pct >= 0.8 ? 'Intermediate' : pct >= 0.6 ? 'Elementary' : 'Beginner';
      // Apply test results
      if (level !== lvl) { setLevel(lvl); setLevelName(lvlName); }
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center', background: T.n0, animation: 'bounceIn .5s ease' }}>
          <div style={{ fontSize: 56, marginBottom: 8, animation: 'popIn .5s ease' }}>{pct >= 0.8 ? '\u{1F393}' : pct >= 0.6 ? '\u{1F4DA}' : '\u{1F331}'}</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, color: T.n700, marginBottom: 4 }}>You{"'"}re {lvlName}</h2>
          <Chip type="teal">Level {lvl} — {Math.round(pct * 100)}% score</Chip>
          <div style={{ background: T.tealL, border: `1.5px solid ${T.teal}`, borderRadius: 16, padding: 16, width: '100%', margin: '16px 0 24px', textAlign: 'left' }}>
            <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.teal }}>
              {lvl === 'A1' ? 'Starting from the foundations — rock-solid basics before real conversations.' :
                lvl === 'A2' ? 'You have the basics. Skipping straight to real conversational scenarios.' :
                  'Ready for advanced scenarios. Focus is on fluency and natural expression.'}
            </p>
          </div>
          <button onClick={doneTest} style={sBtnPrimary}>Start my journey →</button>
        </div>
      );
    }
    const q = qs[testIdx];
    const lets = ['A', 'B', 'C', 'D'];
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.n0, minHeight: 0 }}>
        <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1.5px solid ${T.n100}`, flexShrink: 0 }}>
          <div style={{ flex: 1 }}><ProgressBar value={testIdx} max={qs.length} height={8} cls="amber" /></div>
          <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400 }}>{testIdx}/{qs.length}</div>
        </div>
        <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <Chip type="purple">Placement test</Chip>
          <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.25, color: T.n700, margin: '12px 0 16px' }}>{q.q}</h3>
          {q.opts.map((o, i) => (
            <OptBtn key={i} text={o} letter={lets[i]}
              isCorrect={chk && o === q.ans} isWrong={chk && o === sel && o !== q.ans}
              isSelected={!chk && o === sel} disabled={chk}
              onClick={() => testSel(o)} />
          ))}
        </div>
        {chk ? (
          <div style={{ padding: '16px 20px', borderTop: '3px solid', borderColor: ok ? T.green : T.red, background: ok ? T.greenL : T.redL, flexShrink: 0, animation: 'slideUpPanel .25s cubic-bezier(.4,0,.2,1) both' }}>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3, color: ok ? T.green : T.red, marginBottom: 8 }}>{ok ? '✓ Correct!' : '✗ Answer: ' + q.ans}</div>
            <button onClick={nextTestQ} style={ok ? sBtnGreen : sBtnRed}>Continue →</button>
          </div>
        ) : (
          <div style={{ padding: '12px 20px', borderTop: `1.5px solid ${T.n100}`, flexShrink: 0 }}>
            <button onClick={checkTest} style={sel ? sBtnPrimary : sBtnDisabled} disabled={!sel}>Check</button>
          </div>
        )}
      </div>
    );
  }

  function PaceScreen() {
    const opts = [
      ['\u{1F331}', 'Light', '5–10 min — build the habit first', false],
      ['\u{1F3C3}', 'Regular', '15–20 min — the sweet spot', true],
      ['\u{1F525}', 'Deep dive', '25–40 min — fastest path to fluency', false],
    ];
    return (
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', animation: 'slideUp .3s ease both' }}>
        <div style={{ padding: '28px 20px 16px' }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>⏱️</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, color: T.n700, marginBottom: 4 }}>How much time daily?</h2>
          <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400 }}>Science shows 20 min daily beats 3 hrs on weekends by 3×.</p>
        </div>
        <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <div key={i} onClick={pickPace} style={{ padding: '18px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all .15s', background: T.n0, borderRadius: 16, border: `1.5px solid ${T.n100}`, boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: T.n50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{o[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.n600 }}>{o[1]}</div>
                <div style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400 }}>{o[2]}</div>
              </div>
              {o[3] && <Chip type="teal">Optimal</Chip>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function LearnScreen() {
    if (!ld || !dest) return null;
    const sc = ld.scenarios;
    const done = sc.filter(s => s.done).length;
    const pos = ['r', 'c', 'l', 'c', 'r', 'c', 'l'];
    return (
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: T.n50 }}>
        <TopBar />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: T.n0, borderBottom: `1.5px solid ${T.n100}` }}>
          <span style={{ fontSize: 24 }}>{dest.flag}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.n600 }}>{dest.name}</div>
            <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400, letterSpacing: '.04em', marginBottom: 5 }}>{ld.name} · Level {level} · {done}/{sc.length} complete</div>
            <ProgressBar value={done} max={sc.length} height={7} />
          </div>
          <Chip type="teal">{levelName}</Chip>
        </div>
        <div style={{ padding: '18px 0 40px' }}>
          {sc.map((s, i) => {
            const p = pos[i % pos.length];
            const jc = p === 'l' ? 'flex-start' : p === 'r' ? 'flex-end' : 'center';
            const pl = p === 'l' ? { paddingLeft: 28 } : p === 'r' ? { paddingRight: 28 } : {};
            let bg, border, shadow, filt = 'none';
            if (s.done) { bg = T.teal; border = 'none'; shadow = `0 5px 0 ${T.tealD}`; }
            else if (s.current) { bg = T.n0; border = `2.5px solid ${T.teal}`; shadow = `0 5px 0 ${T.teal}`; }
            else if (!s.locked) { bg = T.n0; border = `2px solid ${T.n200}`; shadow = `0 4px 0 ${T.n200}`; }
            else { bg = T.n100; border = `1.5px solid ${T.n200}`; shadow = `0 4px 0 ${T.n200}`; filt = 'grayscale(1) opacity(.4)'; }
            return (
              <div key={s.id} style={{ padding: '5px 0', display: 'flex', justifyContent: jc, ...pl }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  {s.current && (
                    <div style={{ background: T.n700, color: '#fff', padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: 800, letterSpacing: '.06em', marginBottom: 8, position: 'relative', animation: 'slideUp .25s ease' }}>
                      START
                      <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `5px solid ${T.n700}` }} />
                    </div>
                  )}
                  <button
                    onClick={() => { if (!s.locked && s.ex) startEx(s.id); }}
                    disabled={s.locked || !s.ex}
                    style={{
                      width: 68, height: 68, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 26, cursor: s.locked || !s.ex ? 'default' : 'pointer',
                      transition: 'transform .15s', outline: 'none',
                      background: bg, border, boxShadow: shadow,
                      animation: s.current ? 'glowPulse 2s ease-in-out infinite' : 'none',
                      position: 'relative', fontFamily: T.f,
                    }}>
                    <span style={{ filter: filt }}>{s.locked ? '\u{1F512}' : s.icon}</span>
                    {s.done && (
                      <div style={{
                        position: 'absolute', top: -3, right: -3, width: 22, height: 22,
                        background: T.green, borderRadius: '50%', border: `2.5px solid ${T.n50}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, color: '#fff', fontWeight: 900,
                        animation: 'tickIn .3s cubic-bezier(.34,1.56,.64,1)',
                      }}>✓</div>
                    )}
                  </button>
                  <div style={{ marginTop: 6, textAlign: 'center', maxWidth: 80, lineHeight: 1.2, fontSize: 11, fontWeight: 600, color: s.done ? T.green : s.current ? T.teal : T.n300, letterSpacing: '.04em' }}>{s.place}</div>
                </div>
              </div>
            );
          })}
          <div style={{ textAlign: 'center', padding: '24px 16px', color: T.n300 }}>
            <CompassSVG sz={44} />
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.n400, marginTop: 10 }}>More scenarios coming</div>
          </div>
        </div>
      </div>
    );
  }

  function HeartsOutScreen() {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 22px', textAlign: 'center', background: T.n0, animation: 'bounceIn .5s ease' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{'\u{1F494}'}</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, color: T.n700, marginBottom: 8 }}>Out of hearts!</h2>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: T.n500, marginBottom: 8 }}>You did great! Let{"'"}s try that again.</p>
        <Chip type="teal">Score so far: {exEarned} XP</Chip>
        <div style={{ display: 'flex', gap: 10, marginTop: 24, width: '100%', flexDirection: 'column' }}>
          <button onClick={() => { setHearts(5); setHeartsOut(false); setExIdx(0); setSel(null); setChk(false); setOk(false); setBuilt([]); setMatchSel(null); setMatchDone([]); setMatchR(null); setCorrectStreak(0); setSpeakRecording(false); setSpeakResult(null); setSpeakAttempts(0); }} style={sBtnPrimary}>{'\u2764\uFE0F'} Try again</button>
          <button onClick={() => { setInEx(false); setHeartsOut(false); }} style={sBtnSecondary}>Back to journey</button>
        </div>
      </div>
    );
  }

  function ExerciseScreen() {
    if (heartsOut) return <HeartsOutScreen />;
    if (showGram) return <GramCard />;
    if (showCult) return <CultCard />;
    if (exDone) return <ExResult />;
    if (!exSc || !exSc.ex) return null;
    const exs = exSc.ex;
    if (exIdx >= exs.length) { setExDone(true); return <ExResult />; }
    const ex = exs[exIdx];
    const prog = exIdx / exs.length;
    const lets = ['A', 'B', 'C', 'D'];
    const curMatchR = matchR || (ex.type === 'match' ? ex.pairs.map(p => p[1]).sort(() => Math.random() - 0.5) : null);
    if (ex.type === 'match' && !matchR && curMatchR) { setTimeout(() => setMatchR(curMatchR), 0); }

    let body = null;
    if (ex.type === 'tap' || ex.type === 'listen') {
      const isL = ex.type === 'listen';
      body = (
        <>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.teal, marginBottom: 10 }}>{isL ? uiStr('listenChoose') : uiStr('tapCorrect')}</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.25, color: T.n700, marginBottom: 18 }}>{ex.q}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 22 }}>
            {ex.emoji && <div style={{ fontSize: 70, lineHeight: 1, marginBottom: 12 }}>{ex.emoji}</div>}
            {ex.word ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ padding: '12px 30px', background: T.n50, border: `2px solid ${T.n200}`, borderRadius: 16, fontSize: 22, fontWeight: 700, color: T.n700 }}>{ex.word}</div>
                <SpeakBtn word={ex.word} lc={dest && dest.lc} />
              </div>
            ) : isL ? (
              <button onClick={() => speakText(ex.speak_word, dest && dest.lc)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 28px', background: T.tealL, border: `2px solid ${T.teal}`, borderRadius: 16, fontSize: 15, fontWeight: 700, color: T.tealD, cursor: 'pointer', fontFamily: T.f }}>
                <span style={{ fontSize: 24 }}>{'\u{1F50A}'}</span>Play phrase
              </button>
            ) : null}
          </div>
          {ex.opts.map((o, i) => (
            <OptBtn key={i} text={o} letter={lets[i]}
              isCorrect={chk && o === ex.ans} isWrong={chk && o === sel && o !== ex.ans}
              isSelected={!chk && o === sel} disabled={chk}
              onClick={() => selOpt(o)} />
          ))}
        </>
      );
    } else if (ex.type === 'build') {
      const used = {};
      built.forEach(w => { used[w] = (used[w] || 0) + 1; });
      const avail = {};
      ex.words.forEach(w => { avail[w] = (avail[w] || 0) + 1; });
      body = (
        <>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.teal, marginBottom: 10 }}>{uiStr('buildSentence')}</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.25, color: T.n700, marginBottom: 8 }}>{ex.q}</h3>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, padding: '10px 14px', background: T.n50, borderRadius: 12, border: `1.5px solid ${T.n100}` }}>
              <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400, fontStyle: 'italic' }}>{ex.tr}</p>
            </div>
            <SpeakBtn word={ex.hint || ''} lc={dest && dest.lc} />
          </div>
          <div style={{ minHeight: 56, padding: '12px 16px', background: T.n50, border: `2px dashed ${T.n200}`, borderRadius: 12, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 16 }}>
            {built.length ? built.map((w, i) => (
              <span key={i} onClick={() => removeWord(i)} style={{ padding: '7px 13px', background: T.teal, color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', borderBottom: `3px solid ${T.tealD}`, transition: 'all .1s' }}>{w}</span>
            )) : (
              <span style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400 }}>Tap words to build your sentence…</span>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '4px 0' }}>
            {ex.words.map((w, i) => {
              const u = (used[w] || 0) >= (avail[w] || 0);
              return (
                <button key={i} disabled={u} onClick={() => addWord(w)} style={{
                  padding: '10px 16px', background: u ? T.n100 : T.n0,
                  border: `2px solid ${u ? T.n100 : T.n200}`, borderBottomWidth: 4,
                  borderRadius: 12, fontSize: 15, fontWeight: 700,
                  color: u ? T.n100 : T.n700, cursor: u ? 'default' : 'pointer',
                  transition: 'all .1s', pointerEvents: u ? 'none' : 'auto', fontFamily: T.f,
                }}>{w}</button>
              );
            })}
          </div>
        </>
      );
    } else if (ex.type === 'fill') {
      const dSent = ex.sentence.split('___');
      body = (
        <>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.teal, marginBottom: 10 }}>{uiStr('fillBlank')}</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.25, color: T.n700, marginBottom: 6 }}>{ex.q}</h3>
          <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400, fontStyle: 'italic', marginBottom: 16 }}>{ex.tr}</p>
          <div style={{ padding: 14, background: T.n50, borderRadius: 12, border: `1.5px solid ${T.n100}`, marginBottom: 20, fontSize: 17, fontWeight: 700, color: T.n700, lineHeight: 1.6 }}>
            {dSent[0]}<span style={{ background: T.teal, color: '#fff', padding: '2px 10px', borderRadius: 8, fontWeight: 700 }}>{chk ? ex.ans : '___'}</span>{dSent[1]}
          </div>
          {ex.opts.map((o, i) => (
            <OptBtn key={i} text={o} letter={lets[i]}
              isCorrect={chk && o === ex.ans} isWrong={chk && o === sel && o !== ex.ans}
              isSelected={!chk && o === sel} disabled={chk}
              onClick={() => selOpt(o)} />
          ))}
        </>
      );
    } else if (ex.type === 'match') {
      const pairs = ex.pairs;
      const mR = curMatchR || [];
      body = (
        <>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.teal, marginBottom: 10 }}>{uiStr('matchPairs')}</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.25, color: T.n700, marginBottom: 18 }}>{ex.q}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {pairs.map((pair, i) => {
              const lMatched = matchDone.indexOf(i) !== -1;
              const lSel = matchSel === 'l' + i;
              const ri = pairs.findIndex(p => p[1] === mR[i]);
              const rMatched = matchDone.indexOf(ri) !== -1;
              const rSel = matchSel === 'r' + i;
              return [
                <button key={'l' + i} disabled={lMatched} onClick={() => matchClick('l', i)} style={{
                  padding: '12px 10px', borderRadius: 12, textAlign: 'center', fontSize: 14, fontWeight: 700,
                  border: `2px solid ${lMatched ? T.green : lSel ? T.teal : T.n200}`,
                  background: lMatched ? T.greenL : lSel ? T.tealL : T.n0,
                  boxShadow: `0 3px 0 ${lMatched ? T.greenD : lSel ? T.teal : T.n200}`,
                  color: lMatched ? T.greenD : lSel ? T.tealD : T.n700,
                  cursor: lMatched ? 'default' : 'pointer', transition: 'all .12s', fontFamily: T.f,
                }}>{pair[0]}</button>,
                <button key={'r' + i} disabled={rMatched} onClick={() => matchClick('r', i)} style={{
                  padding: '12px 10px', borderRadius: 12, textAlign: 'center', fontSize: 14, fontWeight: 700,
                  border: `2px solid ${rMatched ? T.green : rSel ? T.teal : T.n200}`,
                  background: rMatched ? T.greenL : rSel ? T.tealL : T.n0,
                  boxShadow: `0 3px 0 ${rMatched ? T.greenD : rSel ? T.teal : T.n200}`,
                  color: rMatched ? T.greenD : rSel ? T.tealD : T.n700,
                  cursor: rMatched ? 'default' : 'pointer', transition: 'all .12s', fontFamily: T.f,
                }}>{mR[i]}</button>,
              ];
            })}
          </div>
          {matchDone.length === pairs.length && (
            <div style={{ marginTop: 14, padding: '12px 14px', background: T.greenL, borderRadius: 12, border: `1.5px solid ${T.green}` }}>
              <p style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.green }}>✓ All matched! Well done.</p>
            </div>
          )}
        </>
      );
    } else if (ex.type === 'speak') {
      const handleSpeak = () => {
        if (speakRecording) return;
        setSpeakRecording(true); setSpeakResult(null);
        const langCode = VLANG[dest && dest.lc] || 'en-US';
        speakRecRef.current = startListening(ex.speak_word, langCode, (match, spoken, close, dist) => {
          setSpeakRecording(false);
          const newAttempts = speakAttempts + 1;
          setSpeakAttempts(newAttempts);
          if (match || dist === 0) {
            setSpeakResult({ match: true, spoken, close: false });
            sndOk();
            const gain = Math.round(exSc.xp / Math.max(exSc.ex.length, 1));
            setExEarned(e => e + gain); setXp(x => x + gain);
            setMomentum(m => Math.min(100, m + 3));
            const newStreak = correctStreak + 1;
            setCorrectStreak(newStreak);
            if (newStreak > 0 && newStreak % 3 === 0 && hearts < 5) setHearts(h => Math.min(5, h + 1));
            if (newStreak >= 3 && newStreak % 3 === 0) showReaction('\u{1F525}\u{1F525}\u{1F525}', 'ON FIRE!');
            else showReaction('\u2728', 'Perfect pronunciation!');
            setChk(true); setOk(true);
          } else if (close) {
            setSpeakResult({ match: false, spoken, close: true });
            if (newAttempts >= 3) { setChk(true); setOk(false); }
          } else {
            setSpeakResult({ match: false, spoken, close: false });
            sndErr();
            speakText(ex.speak_word, dest && dest.lc);
            if (newAttempts >= 3) { setChk(true); setOk(false); setCorrectStreak(0); }
          }
        });
      };
      body = (
        <>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.teal, marginBottom: 10 }}>{uiStr('speakWord')}</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.25, color: T.n700, marginBottom: 18 }}>{ex.q}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 22 }}>
            {ex.emoji && <div style={{ fontSize: 50, lineHeight: 1 }}>{ex.emoji}</div>}
            <div style={{ padding: '16px 36px', background: T.n50, border: `2px solid ${T.n200}`, borderRadius: 16, fontSize: 28, fontWeight: 700, color: T.n700 }}>{ex.speak_word}</div>
            <p style={{ fontSize: 14, color: T.n400 }}>{ex.tr}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <SpeakBtn word={ex.speak_word} lc={dest && dest.lc} />
              <span style={{ fontSize: 12, color: T.n400 }}>Listen first</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <button onClick={handleSpeak} disabled={speakRecording || chk} style={{
              width: 72, height: 72, borderRadius: '50%', fontSize: 32,
              background: speakRecording ? T.red : chk ? T.n100 : T.teal,
              color: '#fff', border: 'none', cursor: chk ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: speakRecording ? 'micPulse 1.5s ease-in-out infinite' : 'none',
              transition: 'all .2s', fontFamily: T.f,
            }}>{'\u{1F3A4}'}</button>
            <p style={{ fontSize: 13, fontWeight: 700, color: T.n500 }}>
              {speakRecording ? 'Listening...' : chk ? '' : '\u{1F3A4} Tap and say: ' + ex.speak_word}
            </p>
            {speakAttempts > 0 && !chk && <p style={{ fontSize: 11, color: T.n300 }}>Attempt {speakAttempts}/3</p>}
          </div>
          {speakResult && (
            <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 12, background: speakResult.match ? T.greenL : speakResult.close ? T.amberL : T.redL, border: `1.5px solid ${speakResult.match ? T.green : speakResult.close ? T.amber : T.red}`, animation: 'slideUp .25s ease both' }}>
              {speakResult.match ? (
                <p style={{ fontSize: 15, fontWeight: 700, color: T.green }}>Perfect pronunciation! ✨</p>
              ) : speakResult.close ? (
                <p style={{ fontSize: 15, fontWeight: 700, color: T.amberD }}>Almost! You said &quot;{speakResult.spoken}&quot;. Try again!</p>
              ) : (
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: T.red }}>Not quite.{speakResult.spoken ? ' You said "' + speakResult.spoken + '".' : ''}</p>
                  <p style={{ fontSize: 13, color: T.redD, marginTop: 4 }}>Listen again and try:</p>
                </div>
              )}
            </div>
          )}
        </>
      );
    }

    const rdy = ex.type === 'build' ? built.length > 0 : ex.type === 'match' ? matchDone.length === (ex.pairs ? ex.pairs.length : 0) : ex.type === 'speak' ? chk : !!sel;
    let bot;
    if (ex.type === 'speak' && chk) {
      bot = (
        <div style={{ padding: '20px 20px 16px', borderTop: '3px solid', borderColor: ok ? T.green : T.red, background: ok ? T.greenL : T.redL, flexShrink: 0, animation: 'slideUpPanel .25s cubic-bezier(.4,0,.2,1) both' }}>
          <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: ok ? T.green : T.red, marginBottom: 8 }}>{ok ? '\u2728 Great pronunciation!' : 'Nice try! Keep practising.'}</div>
          <button onClick={nextQ} style={ok ? sBtnGreen : sBtnRed}>Continue →</button>
        </div>
      );
    } else if (ex.type === 'speak' && !chk) {
      bot = (
        <div style={{ padding: '14px 18px', borderTop: `1.5px solid ${T.n100}` }}>
          <button style={sBtnDisabled} disabled>Tap the microphone above</button>
        </div>
      );
    } else if (chk && ex.type !== 'match') {
      bot = (
        <div style={{ padding: '20px 20px 16px', borderTop: '3px solid', borderColor: ok ? T.green : T.red, background: ok ? T.greenL : T.redL, flexShrink: 0, animation: 'slideUpPanel .25s cubic-bezier(.4,0,.2,1) both' }}>
          <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: ok ? T.green : T.red, marginBottom: ok ? 4 : 8 }}>{ok ? '\u2713  ' + uiStr('correct') : '\u2717  ' + uiStr('notQuite')}</div>
          {!ok ? (
            <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.redD, marginBottom: 12 }}>
              {(ex.type === 'fill' || ex.type === 'tap' || ex.type === 'listen') ? <>Answer: <strong>{ex.ans}</strong></> : <>Should be: <strong>{ex.hint}</strong></>}
              <br />Added to your replay queue {'\u{1F504}'}
            </p>
          ) : (
            <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.greenD, marginBottom: 10 }}>Momentum +3% · Keep it up!</p>
          )}
          <button onClick={nextQ} style={ok ? sBtnGreen : sBtnRed}>Continue →</button>
        </div>
      );
    } else {
      bot = (
        <div style={{ padding: '14px 18px', borderTop: `1.5px solid ${T.n100}` }}>
          {ex.type === 'match' && rdy ? (
            <button onClick={nextQ} style={sBtnPrimary}>Continue →</button>
          ) : ex.type !== 'match' ? (
            <button onClick={checkEx2} style={rdy ? sBtnPrimary : sBtnDisabled} disabled={!rdy}>Check answer</button>
          ) : (
            <button style={sBtnDisabled} disabled>Match all pairs to continue</button>
          )}
        </div>
      );
    }

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.n0, animation: shk ? 'shake .5s ease' : 'slideUp .3s ease' }}>
        <div style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1.5px solid ${T.n100}`, flexShrink: 0 }}>
          <button onClick={closeEx} style={{ width: 30, height: 30, borderRadius: '50%', background: T.n50, border: `1.5px solid ${T.n200}`, fontSize: 13, color: T.n400, cursor: 'pointer', fontFamily: T.f }}>✕</button>
          <div style={{ flex: 1 }}><ProgressBar value={prog} max={1} height={8} /></div>
          <div style={{ display: 'flex', gap: 2, fontSize: 14 }}>
            {[0,1,2,3,4].map(i => (
              <span key={i} style={{
                transition: 'all .3s',
                animation: lostHeartIdx === i ? 'heartShake .5s ease, heartFade .5s ease .3s forwards' : 'none',
              }}>{i < hearts ? '\u2764\uFE0F' : '\u{1F90D}'}</span>
            ))}
          </div>
          <button onClick={() => setAudioFirst(a => !a)} style={{
            background: audioFirst ? T.tealL : T.n100,
            border: `1.5px solid ${audioFirst ? T.teal : T.n200}`,
            borderRadius: 6, padding: '3px 6px', fontSize: 11, fontWeight: 700,
            cursor: 'pointer', color: audioFirst ? T.tealD : T.n400, fontFamily: T.f, flexShrink: 0,
          }}>{'\u{1F50A}'}</button>
          <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400 }}>{exIdx}/{exs.length}</div>
        </div>
        <div style={{ background: T.n50, padding: '9px 16px', borderBottom: `1.5px solid ${T.n100}`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 18 }}>{exSc.icon}</span>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.n300 }}>{exSc.place}</div>
        </div>
        <div style={{ flex: 1, padding: '14px 18px', overflowY: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative', minHeight: 0 }}>
          {showXP && <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 15, fontWeight: 900, color: T.teal, animation: 'floatUp .9s ease forwards', pointerEvents: 'none' }}>+{Math.round(exSc.xp / (exs.length || 1))} XP</div>}
          {reaction && <Reaction emoji={reaction.emoji} text={reaction.text} />}
          {body}
        </div>
        {bot}
      </div>
    );
  }

  function GramCard() {
    if (!ld || !ld.grammar || !ld.grammar.length) return null;
    const g = ld.grammar[gramIdx % ld.grammar.length];
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: 50, background: T.n0, display: 'flex', flexDirection: 'column', animation: 'slideIn .3s cubic-bezier(.4,0,.2,1) both', justifyContent: 'flex-start' }}>
        <div style={{ padding: '11px 16px', borderBottom: `1.5px solid ${T.n100}` }}><Chip type="purple">Grammar spotlight</Chip></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{'\u{1F4D6}'}</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, color: T.n700, marginBottom: 16 }}>{g.point}</h2>
          <div style={{ background: T.purpleL, border: '1.5px solid #C4B5FD', borderRadius: 16, padding: 16, width: '100%', marginBottom: 14 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: T.purple, fontFamily: T.fs }}>{g.example}</p>
          </div>
          <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.6, color: T.n500 }}>{g.note}</p>
        </div>
        <div style={{ padding: '16px 20px', borderTop: `1.5px solid ${T.n100}` }}>
          <button onClick={dismissGram} style={sBtnPrimary}>Got it — continue →</button>
        </div>
      </div>
    );
  }

  function CultCard() {
    if (!ld || !ld.culture || !ld.culture.length) return null;
    const c = ld.culture[cultIdx % ld.culture.length];
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: 50, background: T.n0, display: 'flex', flexDirection: 'column', animation: 'slideIn .3s cubic-bezier(.4,0,.2,1) both', justifyContent: 'flex-start' }}>
        <div style={{ padding: '11px 16px', borderBottom: `1.5px solid ${T.n100}` }}><Chip type="amber">Cultural insight</Chip></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>{c.icon}</div>
          <p style={{ fontSize: 19, fontFamily: T.fs, color: T.n700, lineHeight: 1.65, maxWidth: 290 }}>{c.tip}</p>
          {dest && <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400, letterSpacing: '.04em', marginTop: 14 }}>Local knowledge for {dest.name}</div>}
        </div>
        <div style={{ padding: '16px 20px', borderTop: `1.5px solid ${T.n100}` }}>
          <button onClick={dismissCult} style={{ ...sBtnPrimary, background: T.amber, boxShadow: `0 5px 0 ${T.amberD}` }}>Interesting — continue →</button>
        </div>
      </div>
    );
  }

  function ExResult() {
    if (!exSc) return null;
    const acc = exIdx > 0 ? Math.round((exIdx - exMistakes) / exIdx * 100) : 100;
    const stars = exMistakes === 0 ? 3 : exMistakes <= 1 ? 2 : 1;
    const str = ['\u2B50', '\u2B50\u2B50', '\u2B50\u2B50\u2B50'][stars - 1];
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 22px', textAlign: 'center', background: T.n0, animation: 'bounceIn .5s ease', position: 'relative' }}>
        <Confetti />
        <div style={{ fontSize: 48, marginBottom: 6, letterSpacing: 3, animation: 'popIn .6s ease' }}>{str}</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, color: T.n700, marginBottom: 4 }}>Scenario complete!</h2>
        <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400, marginBottom: 6 }}>{exSc.place}</p>
        <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.teal, fontWeight: 700, marginBottom: 24 }}>Phrases saved to Phrasebook + scheduled for review ✓</p>
        <div style={{ display: 'flex', gap: 10, width: '100%', marginBottom: 24 }}>
          {[
            ['\u{1F30A}', momentum + '%', 'Momentum', T.teal],
            ['\u2B50', '+' + exEarned, 'XP', T.amber],
            ['\u{1F3AF}', acc + '%', 'Accuracy', T.green],
            ['\u{1F504}', '' + exMistakes, 'Replays', T.red],
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '14px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: T.n0, borderRadius: 16, border: `1.5px solid ${T.n100}`, boxShadow: '0 1px 3px rgba(0,0,0,.08)', animation: 'countUp .4s ease both' }}>
              <span style={{ fontSize: 20 }}>{s[0]}</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: s[3] }}>{s[1]}</span>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.n300 }}>{s[2]}</span>
            </div>
          ))}
        </div>
        <button onClick={doneEx} style={sBtnPrimary}>Back to journey →</button>
      </div>
    );
  }

  /* ─── FREE CHAT WITH STARKY ─── */
  function startFreeChat() {
    if (gate.blocked) { setShowPaywall(true); return; }
    const langName = ld?.name || 'this language';
    const mtName = motherTongue !== 'en' ? MOTHER_TONGUES.find(m => m.id === motherTongue)?.name || 'your language' : 'English';
    const welcome = `Hi! I'm Starky — your ${langName} conversation partner! 🌟\n\nI'll chat with you in ${langName}, help you practice, and correct your grammar gently. You can reply in ${langName} or ${mtName} — I understand both!\n\nLet's start simple: How would you greet someone in ${langName}?`;
    setFreeMsgs([{ role: 'assistant', content: welcome }]);
    setFreeChat(true);
  }

  async function sendFreeMsg() {
    const text = freeInput.trim();
    if (!text || freeLoading) return;
    if (!recordCall()) { setShowPaywall(true); return; }
    gate.recordRound();
    setFreeInput('');
    const newMsgs = [...freeMsgs, { role: 'user', content: text }];
    setFreeMsgs(newMsgs);
    setFreeLoading(true);
    try {
      const langName = ld?.name || 'the target language';
      const mtName = motherTongue !== 'en' ? MOTHER_TONGUES.find(m => m.id === motherTongue)?.name || 'English' : 'English';
      const systemPrompt = `You are Starky, a warm and encouraging language tutor on NewWorld Education.
You are having a conversation with a student learning ${langName}. Their level is ${level} (${levelName}).
Their native language is ${mtName}.

RULES:
- Speak primarily in ${langName} with ${mtName} translations in parentheses
- For A1 beginners: use very simple phrases, 1-2 words at a time, always translate
- For A2: short sentences with translations for new words only
- For B1: mostly in ${langName}, only translate difficult words
- After every student message: first acknowledge what they said, then gently correct any grammar/spelling mistakes, then continue the conversation
- If they write in ${mtName} or English, respond in ${langName} with translation and encourage them to try in ${langName}
- Keep responses SHORT — 2-4 sentences max
- Be enthusiastic and celebrate every attempt
- End each message with a simple question to keep the conversation going
- Use emojis to make it fun and visual
- If they seem stuck, offer a helpful phrase they can try`;

      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          system: systemPrompt,
          messages: newMsgs.slice(-10).map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content || data.response || 'I had a moment — please try again!';
      const updatedMsgs = [...newMsgs, { role: 'assistant', content: reply }];
      setFreeMsgs(updatedMsgs);

      // Trigger session analysis every 5 user messages
      const userMsgCount = updatedMsgs.filter(m => m.role === 'user').length;
      if (userMsgCount === 5 || (userMsgCount > 5 && userMsgCount % 10 === 0)) {
        try {
          const profile = JSON.parse(localStorage.getItem('nw_user') || '{}');
          fetch('/api/session-complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentId: profile.email || 'anonymous',
              studentName: profile.name || 'Student',
              parentEmail: userMsgCount === 5 ? (profile.parentEmail || profile.email) : null,
              parentName: profile.name,
              grade: level,
              subject: (ld?.name || 'Language') + ' (Free Chat)',
              messages: updatedMsgs.slice(-20),
              sessionCount: userMsgCount,
            }),
          }).catch(() => {});
        } catch {}
      }
    } catch {
      setFreeMsgs(prev => [...prev, { role: 'assistant', content: 'Connection error — please try again!' }]);
    }
    setFreeLoading(false);
  }

  useEffect(() => { if (freeChat) freeChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [freeMsgs, freeLoading]);

  function FreeChatScreen() {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.n0, minHeight: 0 }}>
        <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1.5px solid ${T.n100}`, flexShrink: 0 }}>
          <button onClick={() => setFreeChat(false)} style={{ width: 30, height: 30, borderRadius: '50%', background: T.n50, border: `1.5px solid ${T.n200}`, fontSize: 13, color: T.n400, cursor: 'pointer', fontFamily: T.f }}>✕</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.n700 }}>Chat with Starky in {ld?.name}</div>
            <div style={{ fontSize: 11, color: T.n400 }}>Level {level} · conversation partner</div>
          </div>
          <Chip type="teal">LIVE</Chip>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          {freeMsgs.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 8 }}>
              {msg.role === 'assistant' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: T.tealL, border: `1px solid ${T.teal}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, marginTop: 2 }}>★</div>
              )}
              <div style={{
                maxWidth: '80%', padding: '10px 14px', borderRadius: 16,
                background: msg.role === 'user' ? T.teal : T.n50,
                color: msg.role === 'user' ? '#fff' : T.n700,
                border: msg.role === 'user' ? 'none' : `1px solid ${T.n100}`,
                fontSize: 14, lineHeight: 1.7, fontWeight: msg.role === 'user' ? 600 : 400,
                whiteSpace: 'pre-wrap',
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {freeLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: T.tealL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>★</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 0.2, 0.4].map((d, j) => <div key={j} style={{ width: 8, height: 8, borderRadius: '50%', background: T.teal, animation: `bounce 1s ${d}s ease-in-out infinite`, opacity: 0.7 }} />)}
              </div>
            </div>
          )}
          <div ref={freeChatEndRef} />
        </div>
        <div style={{ padding: '10px 14px', borderTop: `1.5px solid ${T.n100}`, display: 'flex', gap: 8, flexShrink: 0 }}>
          <input
            value={freeInput}
            onChange={e => setFreeInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendFreeMsg(); } }}
            placeholder={`Type in ${ld?.name || 'any language'}...`}
            style={{
              flex: 1, background: T.n50, border: `1.5px solid ${T.n100}`, borderRadius: 12,
              padding: '10px 14px', fontSize: 15, color: T.n700, fontFamily: T.f, outline: 'none',
            }}
          />
          <button onClick={sendFreeMsg} disabled={!freeInput.trim() || freeLoading} style={{
            width: 44, height: 44, borderRadius: 12, border: 'none',
            background: freeInput.trim() && !freeLoading ? T.teal : T.n100,
            color: freeInput.trim() && !freeLoading ? '#fff' : T.n300,
            fontSize: 18, fontWeight: 800, cursor: 'pointer', fontFamily: T.f, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>→</button>
        </div>
      </div>
    );
  }

  function ChatScreen() {
    if (freeChat) return <FreeChatScreen />;
    if (inConvo) return <ConvoScreen />;
    if (!ld || !dest) return null;
    const convos = ld.convos || [];
    return (
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: T.n50 }}>
        <TopBar />
        <div style={{ padding: '16px 16px 12px', background: T.n0, borderBottom: `1.5px solid ${T.n100}` }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.n300, marginBottom: 4 }}>Conversation practice</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, color: T.n700 }}>Chat Simulator</h2>
          <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400, marginTop: 3 }}>Talk with locals in {dest.name} before your trip.</p>
        </div>
        {/* FREE CHAT WITH STARKY — conversation partner */}
        <div style={{ padding: '12px 14px 0' }}>
          <div onClick={startFreeChat} style={{
            padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
            background: `linear-gradient(135deg, ${T.teal}15, ${T.teal}08)`,
            borderRadius: 16, border: `2px solid ${T.teal}40`,
            boxShadow: `0 2px 12px ${T.teal}15`, transition: 'all .15s',
            marginBottom: 4,
          }}>
            <div style={{ width: 54, height: 54, borderRadius: '50%', background: T.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, color: '#fff', fontWeight: 900 }}>★</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.teal }}>Chat with Starky in {ld?.name}</div>
              <p style={{ fontSize: 12, color: T.n400, marginTop: 2, lineHeight: 1.5 }}>Free conversation practice — Starky speaks {ld?.name}, corrects your grammar, and adapts to your level.</p>
              <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                {['Smart', 'Grammar help', 'Any topic'].map(tag => (
                  <span key={tag} style={{ fontSize: 9, fontWeight: 800, background: `${T.teal}15`, border: `1px solid ${T.teal}30`, borderRadius: 20, padding: '2px 8px', color: T.teal }}>{tag}</span>
                ))}
              </div>
            </div>
            <span style={{ fontSize: 22, color: T.teal }}>→</span>
          </div>
        </div>

        <div style={{ padding: '8px 14px 4px' }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.n300, marginBottom: 8 }}>Scripted scenarios</div>
        </div>

        <div style={{ padding: '0 14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {convos.length ? convos.map(cv => (
            <div key={cv.id} onClick={() => startConvo(cv.id)} style={{
              padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
              transition: 'all .15s', background: T.n0, borderRadius: 16,
              border: `1.5px solid ${T.n100}`, boxShadow: '0 1px 3px rgba(0,0,0,.08)',
            }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: T.n50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, border: `2px solid ${T.n100}` }}>{cv.npc.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.n600 }}>{cv.title}</div>
                <p style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400, letterSpacing: '.04em', marginTop: 2 }}>With {cv.npc.name} · {cv.npc.role}</p>
                <p style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.teal, letterSpacing: '.04em', marginTop: 4 }}>{cv.turns.length} exchanges</p>
              </div>
              <span style={{ fontSize: 22 }}>{cv.icon}</span>
            </div>
          )) : (
            <div style={{ padding: '32px 20px', textAlign: 'center', background: T.n0, borderRadius: 16, border: `1.5px solid ${T.n100}`, boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{'\u{1F4AC}'}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.25, color: T.n700, marginBottom: 8 }}>Conversations coming!</h3>
              <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400 }}>Complete the first few scenarios to unlock chat practice in {ld.name}.</p>
            </div>
          )}
          <div style={{ padding: 14, background: T.n50, borderRadius: 12, border: `1.5px solid ${T.n100}`, marginTop: 4 }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.n600, marginBottom: 6 }}>{'\u{1F4A1}'} Why conversation practice?</div>
            <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400 }}>Swain{"'"}s Output Hypothesis (1985): speaking forces your brain to process language at a depth that passive reading cannot achieve. Even 5 minutes of dialogue {'>'} 30 minutes of vocab.</p>
          </div>
        </div>
      </div>
    );
  }

  function ConvoScreen() {
    if (!convo || !dest) return null;
    if (convDone) {
      const pct = Math.round(convScore / convo.turns.length * 100);
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 22px', textAlign: 'center', background: T.n0, animation: 'bounceIn .5s ease' }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>{pct >= 80 ? '\u{1F3AD}' : pct >= 50 ? '\u{1F4AC}' : '\u{1F5E3}️'}</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, color: T.n700, marginBottom: 4 }}>Conversation complete!</h2>
          <Chip type={pct >= 80 ? 'teal' : pct >= 50 ? 'amber' : 'red'}>{pct}% natural responses</Chip>
          <div style={{ padding: 16, width: '100%', textAlign: 'left', margin: '20px 0 22px', background: T.n50, borderRadius: 12, border: `1.5px solid ${T.n100}` }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.n300, marginBottom: 10 }}>Your conversation</div>
            {convHist.map((h, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400, letterSpacing: '.04em', marginBottom: 3 }}>{convo.npc.name}:</div>
                <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400, fontStyle: 'italic', marginBottom: 5 }}>{h.npc_tr}</p>
                <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400, letterSpacing: '.04em', marginBottom: 3 }}>You:</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.teal }}>{h.choice}</div>
              </div>
            ))}
          </div>
          <button onClick={endConvo} style={sBtnPrimary}>Back to conversations</button>
        </div>
      );
    }
    const turn = convo.turns[convIdx];
    if (!turn) return null;
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.n0 }}>
        <div style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1.5px solid ${T.n100}`, flexShrink: 0 }}>
          <button onClick={endConvo} style={{ width: 30, height: 30, borderRadius: '50%', background: T.n50, border: `1.5px solid ${T.n200}`, fontSize: 13, color: T.n400, cursor: 'pointer', fontFamily: T.f }}>✕</button>
          <div style={{ flex: 1 }}><ProgressBar value={convIdx} max={convo.turns.length} height={7} /></div>
          <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400 }}>{convIdx}/{convo.turns.length}</div>
        </div>
        <div style={{ background: T.n50, padding: '10px 16px', borderBottom: `1.5px solid ${T.n100}`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ fontSize: 22 }}>{convo.npc.emoji}</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.n600 }}>{convo.npc.name}</div>
            <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400, letterSpacing: '.04em' }}>{convo.npc.role}</div>
          </div>
          <SpeakBtn word={turn.npc} lc={dest.lc} />
        </div>
        <div style={{ flex: 1, padding: '18px 16px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {convHist.map((h, i) => (
            <div key={i}>
              <div style={{ background: T.n50, border: `1.5px solid ${T.n100}`, borderRadius: '18px 18px 18px 4px', padding: '12px 16px', maxWidth: '78%', fontSize: 14, fontWeight: 500, color: T.n700, lineHeight: 1.55, animation: 'fadeIn .3s ease both' }}>{h.npc}</div>
              <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n300, letterSpacing: '.04em', textAlign: 'center' }}>{h.npc_tr}</div>
              <div style={{ background: T.teal, color: '#fff', borderRadius: '18px 18px 4px 18px', padding: '12px 16px', maxWidth: '78%', marginLeft: 'auto', fontSize: 14, fontWeight: 600, lineHeight: 1.55, animation: 'fadeIn .3s ease both' }}>{h.choice}</div>
            </div>
          ))}
          <div style={{ background: T.n50, border: `1.5px solid ${T.n100}`, borderRadius: '18px 18px 18px 4px', padding: '12px 16px', maxWidth: '78%', fontSize: 14, fontWeight: 500, color: T.n700, lineHeight: 1.55 }}>{turn.npc}</div>
          <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400, letterSpacing: '.04em', textAlign: 'center', fontStyle: 'italic' }}>{turn.npc_tr}</div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.n300, textAlign: 'center', marginTop: 6 }}>Choose your reply:</div>
          {turn.choices.map((ch, i) => {
            const qcol = ch.q >= 5 ? T.green : ch.q >= 4 ? T.teal : ch.q >= 3 ? T.amber : T.red;
            const qlbl = ch.q >= 5 ? 'Natural' : ch.q >= 4 ? 'Good' : ch.q >= 3 ? 'OK' : 'Awkward';
            return (
              <button key={i} onClick={() => pickConvo(i)} style={{
                padding: '13px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 14, fontWeight: 700, textAlign: 'left', transition: 'all .12s', color: T.n700,
                background: T.n0, borderRadius: 16, border: `1.5px solid ${T.n100}`, boxShadow: '0 1px 3px rgba(0,0,0,.08)',
                fontFamily: T.f,
              }}>
                <span style={{ flex: 1 }}>{ch.text}</span>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 100, background: qcol + '22', color: qcol }}>{qlbl}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function PhrasesScreen() {
    if (!ld || !dest) return null;
    const phs = ld.pb;
    const due = phs.filter(isDue);
    const cc = [T.red, T.amber, T.amber, T.green];
    const cl = ['Shaky', 'Learning', 'Good', 'Solid'];
    return (
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: T.n50 }}>
        <TopBar />
        <div style={{ padding: '14px 16px 12px', background: T.n0, borderBottom: `1.5px solid ${T.n100}`, display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.n300, marginBottom: 4 }}>SM-2 spaced repetition</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, color: T.n700 }}>Phrasebook</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
            <Chip type="teal">{phs.length} phrases</Chip>
            {due.length > 0 && <Chip type="amber">{due.length} due</Chip>}
          </div>
        </div>
        {due.length > 0 && (
          <div style={{ padding: '10px 14px', background: T.amberL, borderBottom: '1.5px solid #E0C070', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.amberD, fontWeight: 700 }}>{'\u{1F504}'} {due.length} phrase{due.length > 1 ? 's' : ''} ready for review</p>
            <button style={{ background: T.amber, color: '#fff', border: 'none', padding: '10px 18px', fontSize: 13, borderRadius: 12, fontWeight: 800, cursor: 'pointer', fontFamily: T.f }}>Review now</button>
          </div>
        )}
        <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
          {phs.map((ph, i) => {
            const c = cc[ph.c - 1] || T.n400;
            const l = cl[ph.c - 1] || '';
            const nr = ph.due ? new Date(ph.due).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : 'Today';
            return (
              <div key={i} style={{ padding: '12px 16px', background: T.n0, borderRadius: 12, border: `1.5px solid ${T.n100}`, display: 'flex', alignItems: 'center', gap: 12, boxShadow: `0 2px 0 ${T.n100}` }}>
                <div style={{ fontSize: 16 }}>{dest.flag}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.n700, fontFamily: T.fs }}>{ph.p}</div>
                  <div style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400 }}>{ph.t}{motherTongue !== 'en' ? (' \u00b7 ' + mtTrans(ph.t)) : ''}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400, letterSpacing: '.04em', marginTop: 3 }}>Next review: {nr}{ph.reps ? ' · ' + ph.reps + ' reps' : ' · new'}</div>
                </div>
                <SpeakBtn word={ph.p} lc={dest.lc} />
                <div style={{ textAlign: 'center', flexShrink: 0, marginLeft: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: c, margin: '0 auto 2px' }} />
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: c }}>{l}</div>
                </div>
              </div>
            );
          })}
          <div style={{ padding: 14, background: T.n50, borderRadius: 12, border: `1.5px solid ${T.n100}`, marginTop: 6 }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.n600, marginBottom: 6 }}>{'\u{1F9E0}'} How SM-2 works</div>
            <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400 }}>After each review you rate your recall (1–5). The algorithm then schedules that phrase at the exact optimal interval — 1 day, 6 days, 15 days... Brain imaging shows SRS learners develop native-like neural patterns after just 6 months.</p>
          </div>
        </div>
      </div>
    );
  }

  function ProfileScreen() {
    if (!ld || !dest) return null;
    const sc = ld.scenarios;
    const done = sc.filter(s => s.done).length;
    const lvl = Math.floor(xp / 100) + 1;
    const lxp = xp % 100;
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const hc = [T.n100, '#B7E4CC', '#6DC49A', '#2D9966', '#1D6B4F'];
    return (
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: T.n50 }}>
        <TopBar />
        <div style={{ background: T.n0, padding: '24px 18px 18px', borderBottom: `1.5px solid ${T.n100}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${T.teal}, ${T.amber})`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `3px solid ${T.n100}` }}>
              <CompassSVG sz={46} />
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: T.amber, width: 24, height: 24, borderRadius: '50%', border: `2.5px solid ${T.n0}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff' }}>{lvl}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.25, color: T.n700 }}>Language Explorer</h3>
            <p style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400, letterSpacing: '.04em', marginTop: 2 }}>{dest.name} · {ld.name} · Level {level}</p>
          </div>
        </div>
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ padding: 14, background: T.n0, borderRadius: 16, border: `1.5px solid ${T.n100}`, boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.n600 }}>Level {lvl}</span>
              <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400 }}>{lxp}/100 XP</span>
            </div>
            <ProgressBar value={lxp} max={100} height={10} cls="amber" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              ['\u{1F30A}', momentum + '%', 'Momentum', T.teal],
              ['\u2B50', '' + xp, 'Total XP', T.amber],
              ['\u{1F5FA}️', done + '/' + sc.length, 'Scenarios', T.teal],
              ['\u{1F4D6}', '' + ld.pb.length, 'Phrases', T.green],
              ['\u{1F3AF}', accuracy + '%', 'Accuracy', T.green],
              ['\u{1F504}', '' + replays, 'To review', T.red],
            ].map((s, i) => (
              <div key={i} style={{ padding: '14px 8px', textAlign: 'center', background: T.n0, borderRadius: 16, border: `1.5px solid ${T.n100}`, boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{s[0]}</div>
                <div style={{ fontSize: 19, fontWeight: 800, color: s[3] }}>{s[1]}</div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.n300, marginTop: 2 }}>{s[2]}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: 14, background: T.n0, borderRadius: 16, border: `1.5px solid ${T.n100}`, boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.n600 }}>{'\u{1F4C5}'} Streak Calendar</span>
              {(() => {
                let streak = 0;
                for (let i = heatmap.length - 1; i >= 0; i--) { if (heatmap[i] > 0) streak++; else break; }
                return streak > 0 ? (
                  <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 800, background: T.amberL, color: T.amberD }}>{'\u{1F525}'} {streak} day{streak > 1 ? 's' : ''} in a row!</span>
                ) : null;
              })()}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              {days.map((d, i) => {
                const isToday = i === 4;
                const practiced = heatmap[i] > 0;
                return (
                  <div key={i} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: isToday ? T.teal : T.n400 }}>{d}</div>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: isToday && practiced ? T.teal : practiced ? T.tealM : T.n200,
                      transition: 'all .3s',
                      boxShadow: isToday && practiced ? `0 0 8px ${T.teal}44` : 'none',
                    }} />
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400 }}>20 min daily beats 2h on weekends by 3x (distributed practice research).</p>
          </div>
          {/* Mother Tongue Selector in Profile */}
          <div style={{ padding: 14, background: T.n0, borderRadius: 16, border: `1.5px solid ${T.n100}`, boxShadow: '0 1px 3px rgba(0,0,0,.08)', marginBottom: 10 }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.n600, marginBottom: 10 }}>{'\u{1F30D}'} {uiStr('yourLanguage')} / {'\u0622\u067E \u06A9\u06CC \u0632\u0628\u0627\u0646'}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {MOTHER_TONGUES.map(mt => {
                const active = motherTongue === mt.id;
                const isRTL = mt.dir === 'rtl';
                return (
                  <button key={mt.id} onClick={() => changeMotherTongue(mt.id)} style={{
                    padding: '6px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700,
                    border: active ? `2px solid ${T.teal}` : `1.5px solid ${T.n200}`,
                    background: active ? T.tealL : T.n0, color: active ? T.tealD : T.n500,
                    cursor: 'pointer', transition: 'all .15s', fontFamily: T.f,
                    direction: isRTL ? 'rtl' : 'ltr',
                  }}>{mt.native}</button>
                );
              })}
            </div>
          </div>
          <div style={{ padding: 14, marginBottom: 40, background: T.n0, borderRadius: 16, border: `1.5px solid ${T.n100}`, boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.n600, marginBottom: 10 }}>{'\u{1F5FA}️'} Language journey</div>
            {[
              ['A1', 'Beginner', done > 0],
              ['A2', 'Elementary', false],
              ['B1', 'Intermediate', false],
              ['B2', 'Upper-Int.', false],
              ['C1', 'Advanced', false],
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: l[2] ? T.teal : T.n100,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 800, color: l[2] ? '#fff' : T.n400, flexShrink: 0,
                }}>{l[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, fontWeight: 700, color: level === l[0] ? T.teal : T.n600 }}>{l[1]}{level === l[0] ? ' ← you are here' : ''}</div>
                  <ProgressBar value={level === l[0] ? lxp : 0} max={100} height={4} cls={level === l[0] ? '' : 'amber'} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     MAIN RENDER
  ═══════════════════════════════════════ */
  function renderContent() {
    if (showEmergency) return <EmergencyScreen />;
    if (inTest) return <TestScreen />;
    if (inEx) return <ExerciseScreen />;
    if (phase === 'landing') return <LandingScreen />;
    if (phase === 'dest') return <DestScreen />;
    if (phase === 'pace') return <PaceScreen />;
    // Main tabs
    let tabContent = null;
    if (tab === 'learn') tabContent = <LearnScreen />;
    else if (tab === 'chat') tabContent = <ChatScreen />;
    else if (tab === 'phrases') tabContent = <PhrasesScreen />;
    else if (tab === 'profile') tabContent = <ProfileScreen />;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {tabContent}
        <BNav />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Learn Languages | NewWorld Education</title>
        <meta name="description" content="Learn French, Spanish, Japanese, German, Korean, Italian, Arabic, Portuguese and Mandarin Chinese with interactive exercises, conversation practice and spaced repetition — powered by NewWorld Education." />
        <meta property="og:title" content="Learn Languages | NewWorld Education" />
        <meta property="og:description" content="Master 9 languages with interactive exercises, real conversations and SM-2 spaced repetition." />
      </Head>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      {showPaywall && <ProductPaywall gate={gate} onClose={() => setShowPaywall(false)} T={T} />}
      <div style={{
        maxWidth: 480, margin: '0 auto',
        height: 'calc(100vh - 52px)', /* subtract shared Nav height */
        display: 'flex', flexDirection: 'column',
        background: T.n0, fontFamily: T.f,
        WebkitFontSmoothing: 'antialiased',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Trial/subscription badge */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 12px 0', flexShrink: 0 }}>
          <ProductTrialBadge gate={gate} T={T} />
        </div>
        {renderContent()}
      </div>
    </>
  );
}
