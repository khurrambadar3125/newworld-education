import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { useTheme } from '../pages/_app';
import { useSessionLimit } from '../utils/useSessionLimit';
import Nav from '../components/Nav';

/* ═══════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════ */
const T = {
  teal: '#0B6E6E', tealD: '#084E4E', tealM: '#0D8585', tealL: '#E6F4F4', tealXL: '#F0F9F9',
  green: '#2E7D4F', greenD: '#1D5C38', greenL: '#E8F5EE',
  red: '#C0392B', redD: '#96261F', redL: '#FDECEA',
  amber: '#C06A00', amberD: '#9A5200', amberL: '#FEF3E0',
  purple: '#5B21B6', purpleL: '#EDE9FE',
  n0: '#FFFFFF', n50: '#F8F6F1', n100: '#EEE9DF', n200: '#DDD6C8', n300: '#BFB5A5',
  n400: '#9B8F7E', n500: '#706558', n600: '#4A4138', n700: '#2C251E', n800: '#1A1410',
  f: "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  fs: "Georgia, 'Times New Roman', serif",
};

/* ═══════════════════════════════════════
   AUDIO ENGINE
═══════════════════════════════════════ */
const VLANG = { fr: 'fr-FR', es: 'es-ES', ja: 'ja-JP', de: 'de-DE', ko: 'ko-KR', it: 'it-IT', ar: 'ar-SA', pt: 'pt-BR' };
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

function speakText(text, lc, rate) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const clean = text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = VLANG[lc] || 'en-US'; u.rate = rate || 0.84; u.pitch = 1.05;
  const vs = window.speechSynthesis.getVoices();
  const m = vs.find(v => v.lang === u.lang) || vs.find(v => v.lang.startsWith(u.lang.split('-')[0]));
  if (m) u.voice = m;
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
      { icon: '\u{1F44B}', tip: 'Greet friends with "la bise" \u2014 cheek kisses. Typically 2 in Paris, varies by region.' },
      { icon: '\u{1F550}', tip: 'Restaurants rarely open before 7:30pm. Dinner is a social event, not a quick meal.' },
    ],
    grammar: [
      { point: 'Adjectives follow the noun', example: 'un livre int\u00e9ressant \u2014 NOT un int\u00e9ressant livre', note: 'French adjectives almost always go AFTER the noun they describe.' },
      { point: '"Tu" vs "Vous" for "you"', example: 'Vous parlez fran\u00e7ais? (formal) / Tu parles? (friendly)', note: 'Use "vous" with strangers, shopkeepers and elders. "Tu" with friends.' },
      { point: 'Accents change meaning', example: '"ou" = or   \u00b7   "o\u00f9" = where', note: 'That accent completely changes the word. Pronunciation changes too.' },
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
            { text: 'Coffee please', tr: '(in English \u2014 she might understand!)', q: 1 },
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
      { id: 1, icon: '\u2708\uFE0F', place: '\u00c0 l\'a\u00e9roport', title: 'Checking in', sub: 'Bag count, seat preference, boarding pass', xp: 15, done: true,
        ex: [
          { type: 'tap', q: 'What does "Bonjour" mean?', word: 'Bonjour', emoji: '\u{1F44B}', opts: ['Goodbye', 'Hello', 'Thank you', 'Please'], ans: 'Hello' },
          { type: 'listen', q: 'Listen and choose what you heard:', speak_word: 'J\'ai une valise', emoji: '\u{1F9F3}', opts: ['I have one bag', 'I have two bags', 'Where is my bag?', 'My bag is heavy'], ans: 'I have one bag' },
          { type: 'build', q: 'Ask for a window seat:', hint: 'Je voudrais un si\u00e8ge c\u00f4t\u00e9 fen\u00eatre', words: ['Je', 'voudrais', 'un', 'si\u00e8ge', 'c\u00f4t\u00e9', 'fen\u00eatre', 'couloir', 'deux'], ans: 'Je voudrais un si\u00e8ge c\u00f4t\u00e9 fen\u00eatre', tr: 'I would like a window seat' },
          { type: 'fill', q: 'Complete the sentence:', sentence: 'J\'ai ___ valises.', opts: ['une', 'deux', 'trois', 'beaucoup'], ans: 'deux', tr: 'I have two suitcases' },
        ],
      },
      { id: 2, icon: '\u{1F37D}\uFE0F', place: 'Au restaurant', title: 'Ordering your meal', sub: 'Order food, drinks, ask for the bill', xp: 20, done: false, current: true,
        ex: [
          { type: 'tap', q: 'The waiter says "Bonsoir" \u2014 what does it mean?', word: 'Bonsoir', emoji: '\u{1F319}', opts: ['Good morning', 'Good evening', 'Enjoy your meal', 'The bill'], ans: 'Good evening' },
          { type: 'listen', q: 'Listen and choose what you heard:', speak_word: 'La carte, s\'il vous pla\u00eet', emoji: '\u{1F4CB}', opts: ['The menu please', 'The bill please', 'A table for two', 'I want to order'], ans: 'The menu please' },
          { type: 'match', q: 'Match each phrase to its English meaning:', pairs: [['L\'addition', 'The bill'], ['La carte', 'The menu'], ['Bon app\u00e9tit', 'Enjoy your meal'], ['C\'\u00e9tait d\u00e9licieux', 'It was delicious']] },
          { type: 'build', q: 'Order water and the set menu:', hint: 'Une carafe d\'eau et le menu s\'il vous pla\u00eet', words: ['Une', 'carafe', 'd\'eau', 'et', 'le', 'menu', 's\'il', 'vous', 'pla\u00eet', 'vin'], ans: 'Une carafe d\'eau et le menu s\'il vous pla\u00eet', tr: 'A jug of water and the set menu please' },
          { type: 'fill', q: 'Ask for the bill:', sentence: 'L\'___, s\'il vous pla\u00eet.', opts: ['menu', 'addition', 'carte', 'dessert'], ans: 'addition', tr: 'The bill please' },
        ],
      },
      { id: 3, icon: '\u{1F5FA}\uFE0F', place: 'Dans la rue', title: 'Asking directions', sub: 'Left, right, straight ahead, landmarks', xp: 20, done: false, locked: false,
        ex: [
          { type: 'tap', q: 'What does "\u00e0 gauche" mean?', word: '\u00e0 gauche', emoji: '\u2B05\uFE0F', opts: ['To the right', 'On the left', 'Straight ahead', 'It\'s far'], ans: 'On the left' },
          { type: 'listen', q: 'Listen and choose what you heard:', speak_word: 'C\'est tout droit', emoji: '\u2B06\uFE0F', opts: ['Go straight ahead', 'Turn right', 'Turn left', 'It\'s nearby'], ans: 'Go straight ahead' },
          { type: 'fill', q: 'Complete the question:', sentence: 'Excusez-moi, ___ est la gare?', opts: ['qui', 'quoi', 'o\u00f9', 'quand'], ans: 'o\u00f9', tr: 'Excuse me, where is the station?' },
          { type: 'build', q: 'Ask where the nearest metro is:', hint: 'Excusez-moi o\u00f9 est le m\u00e9tro le plus proche', words: ['Excusez-moi', 'o\u00f9', 'est', 'le', 'm\u00e9tro', 'le', 'plus', 'proche', 'loin'], ans: 'Excusez-moi o\u00f9 est le m\u00e9tro le plus proche', tr: 'Excuse me where is the nearest metro?' },
        ],
      },
      { id: 4, icon: '\u{1F3E8}', place: '\u00c0 l\'h\u00f4tel', title: 'Hotel check-in', sub: 'Confirm booking, request amenities', xp: 20, done: false, locked: true },
      { id: 5, icon: '\u{1F6D2}', place: 'Au march\u00e9', title: 'At the market', sub: 'Ask prices, negotiate, make a purchase', xp: 20, done: false, locked: true },
      { id: 6, icon: '\u{1F91D}', place: 'Rencontres', title: 'Meeting locals', sub: 'Introduce yourself, small talk', xp: 25, done: false, locked: true },
    ],
    pb: [mkp('Bonjour, je m\'appelle\u2026', 'Hello, my name is\u2026', 3), mkp('L\'addition, s\'il vous pla\u00eet', 'The bill please', 3), mkp('O\u00f9 est le m\u00e9tro?', 'Where is the metro?', 2), mkp('Je ne comprends pas', 'I don\'t understand', 2), mkp('Pouvez-vous r\u00e9p\u00e9ter?', 'Can you repeat?', 1), mkp('Merci beaucoup', 'Thank you very much', 3)],
  };

  LANG.es = {
    name: 'Spanish', flag: '\u{1F1F2}\u{1F1FD}',
    culture: [
      { icon: '\u{1F550}', tip: '"Ma\u00f1ana" means tomorrow but culturally signals "not urgently". Expect flexible timing.' },
      { icon: '\u{1F37D}\uFE0F', tip: 'The main meal is lunch (2\u20134pm). Many businesses close for siesta in smaller cities.' },
      { icon: '\u{1F336}\uFE0F', tip: 'Always ask "\u00bfEst\u00e1 muy picante?" before ordering. Mexicans love heat \u2014 visitors often don\'t.' },
      { icon: '\u{1F917}', tip: 'Mexicans are very warm. First names are used quickly. Personal space is closer than in Europe.' },
    ],
    grammar: [
      { point: 'Everything has gender (m/f)', example: 'el libro (book, m) \u00b7 la mesa (table, f)', note: 'Articles and adjectives must match the gender. El/la = the. Un/una = a.' },
      { point: 'Two verbs for "to be"', example: 'Soy ingl\u00e9s (permanent) \u00b7 Estoy cansado (temporary)', note: '"Ser" for permanent traits. "Estar" for states, locations, feelings.' },
      { point: 'Questions have \u00bf at both ends', example: '\u00bfHablas espa\u00f1ol? \u2014 Do you speak Spanish?', note: 'The opening \u00bf signals a question is coming \u2014 useful when reading aloud.' },
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
        id: 'lost', icon: '\u{1F5FA}\uFE0F', title: 'Getting un-lost',
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
      { q: '"El libro ___ sobre la mesa" \u2014 choose:', opts: ['est\u00e1', 'es', 'son', 'estoy'], ans: 'est\u00e1', lvl: 'B1' },
    ],
    scenarios: [
      { id: 1, icon: '\u2708\uFE0F', place: 'En el aeropuerto', title: 'Checking in', sub: 'Name, bags, seat preference', xp: 15, done: true,
        ex: [
          { type: 'tap', q: 'What does "Hola" mean?', word: 'Hola', emoji: '\u{1F44B}', opts: ['Goodbye', 'Hello', 'Thank you', 'Please'], ans: 'Hello' },
          { type: 'listen', q: 'Listen and choose what you heard:', speak_word: 'Tengo una maleta', emoji: '\u{1F9F3}', opts: ['I have one bag', 'I have two bags', 'Where is my bag?', 'My bag is lost'], ans: 'I have one bag' },
          { type: 'build', q: 'Tell them your name and bag count:', hint: 'Me llamo Carlos y tengo una maleta', words: ['Me', 'llamo', 'Carlos', 'y', 'tengo', 'una', 'maleta', 'dos', 'bolsas'], ans: 'Me llamo Carlos y tengo una maleta', tr: 'My name is Carlos and I have one suitcase' },
        ],
      },
      { id: 2, icon: '\u{1F37D}\uFE0F', place: 'En el restaurante', title: 'Ordering your meal', sub: 'Order food, drinks, get the bill', xp: 20, done: false, current: true,
        ex: [
          { type: 'tap', q: 'The waiter asks "\u00bfQu\u00e9 desea?" \u2014 what does it mean?', word: '\u00bfQu\u00e9 desea?', emoji: '\u{1F374}', opts: ['Are you ready?', 'What would you like?', 'Enjoy your meal', 'Here is the menu'], ans: 'What would you like?' },
          { type: 'listen', q: 'Listen and choose what you heard:', speak_word: 'La cuenta, por favor', emoji: '\u{1F4B3}', opts: ['The bill please', 'The menu please', 'One more drink', 'I want to pay'], ans: 'The bill please' },
          { type: 'match', q: 'Match each Spanish phrase to its meaning:', pairs: [['La cuenta', 'The bill'], ['La carta', 'The menu'], ['\u00a1Buen provecho!', 'Enjoy your meal'], ['\u00bfQu\u00e9 recomienda?', 'What do you recommend?']] },
          { type: 'build', q: 'Order water and the menu:', hint: 'Una agua y la carta por favor', words: ['Una', 'agua', 'y', 'la', 'carta', 'por', 'favor', 'vino', 'mesa'], ans: 'Una agua y la carta por favor', tr: 'A water and the menu please' },
        ],
      },
      { id: 3, icon: '\u{1F5FA}\uFE0F', place: 'En la calle', title: 'Asking directions', sub: 'Left, right, straight ahead', xp: 20, done: false, locked: false,
        ex: [
          { type: 'tap', q: 'What does "a la izquierda" mean?', word: 'a la izquierda', emoji: '\u2B05\uFE0F', opts: ['To the right', 'Straight ahead', 'On the left', 'It\'s far'], ans: 'On the left' },
          { type: 'fill', q: 'Ask where the metro is:', sentence: 'Disculpe, \u00bf___ est\u00e1 el metro?', opts: ['qui\u00e9n', 'cu\u00e1ndo', 'd\u00f3nde', 'c\u00f3mo'], ans: 'd\u00f3nde', tr: 'Excuse me, where is the metro?' },
          { type: 'build', q: 'Ask where the nearest metro is:', hint: 'Disculpe d\u00f3nde est\u00e1 el metro m\u00e1s cercano', words: ['Disculpe', 'd\u00f3nde', 'est\u00e1', 'el', 'metro', 'm\u00e1s', 'cercano', 'lejos'], ans: 'Disculpe d\u00f3nde est\u00e1 el metro m\u00e1s cercano', tr: 'Excuse me where is the nearest metro?' },
        ],
      },
      { id: 4, icon: '\u{1F3E8}', place: 'En el hotel', title: 'Hotel check-in', sub: 'Confirm booking, request amenities', xp: 20, done: false, locked: true },
      { id: 5, icon: '\u{1F6D2}', place: 'En el mercado', title: 'At the market', sub: 'Ask prices, buy items', xp: 20, done: false, locked: true },
      { id: 6, icon: '\u{1F91D}', place: 'Conociendo gente', title: 'Meeting locals', sub: 'Introduce yourself, small talk', xp: 25, done: false, locked: true },
    ],
    pb: [mkp('Hola, me llamo\u2026', 'Hello, my name is\u2026', 3), mkp('La cuenta, por favor', 'The bill please', 3), mkp('\u00bfD\u00f3nde est\u00e1 el metro?', 'Where is the metro?', 2), mkp('No entiendo', 'I don\'t understand', 2), mkp('\u00bfPuede repetir?', 'Can you repeat?', 1), mkp('Muchas gracias', 'Thank you very much', 3)],
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
        { id: 1, icon: '\u2708\uFE0F', place: s.airport, title: 'At the airport', sub: 'Check in and navigate', xp: 15, done: false, current: true,
          ex: [{ type: 'tap', q: 'What does "' + s.word + '" mean?', word: s.word, emoji: '\u{1F44B}', opts: s.wordOpts, ans: s.wordAns }],
        },
        { id: 2, icon: '\u{1F37D}\uFE0F', place: s.restaurant, title: 'At a restaurant', sub: 'Order food and drinks', xp: 20, done: false, locked: true },
      ],
      pb: [
        mkp(s.thankPhrase, s.name === 'Portuguese' ? 'Thank you (m/f)' : 'Thank you very much', 1),
        mkp(s.excusePhrase, 'Excuse me', 1),
      ],
    };
  });

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
      <text x="24" y="13" textAnchor="middle" style={{ fontSize: '7px', fontWeight: 800, fill: '#0B6E6E', fontFamily: 'system-ui' }}>N</text>
      <polygon points="24,12 27,25 24,23 21,25" fill="#0B6E6E" />
      <polygon points="24,36 21,23 24,25 27,23" fill="#C06A00" />
      <circle cx="24" cy="24" r="3" fill="#2C251E" />
    </svg>
  );
}

function MomentumRing({ val }) {
  const r = 14, c = 2 * Math.PI * r, off = c * (1 - val / 100);
  const col = val > 60 ? '#0B6E6E' : val > 30 ? '#C06A00' : '#C0392B';
  return (
    <svg width="34" height="34" viewBox="0 0 34 34">
      <circle cx="17" cy="17" r={r} fill="none" stroke="#EEE9DF" strokeWidth="3.5" />
      <circle cx="17" cy="17" r={r} fill="none" stroke={col} strokeWidth="3.5" strokeLinecap="round"
        strokeDasharray={c.toFixed(1)} strokeDashoffset={off.toFixed(1)} transform="rotate(-90 17 17)" />
      <text x="17" y="21" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 800, fill: col, fontFamily: 'system-ui' }}>{val}</text>
    </svg>
  );
}

function StarSVG({ col = '#C06A00' }) {
  return <svg width="14" height="14" viewBox="0 0 16 16"><path d="M8 1l1.8 3.6L14 5.5l-3 2.9.7 4.1L8 10.5l-3.7 1.9.7-4.1-3-2.9 4.2-.9z" fill={col} /></svg>;
}

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
      \u{1F50A}
    </button>
  );
}

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
`;

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function LanguagesPage() {
  useTheme(); // imported but not using CSS vars — keeping own design system
  const { recordCall } = useSessionLimit(); // only for Chat tab API calls if needed

  const [LANG] = useState(() => buildLangData());

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
    const sc = ld.scenarios.find(s => s.id === id);
    if (!sc || !sc.ex) return;
    setExSc(sc); setInEx(true); setExIdx(0); setSel(null); setChk(false); setOk(false);
    setBuilt([]); setMatchSel(null); setMatchDone([]); setMatchR(null);
    setShk(false); setShowXP(false); setExDone(false); setExMistakes(0); setExEarned(0);
    setShowGram(false); setShowCult(false);
    setTimeout(() => {
      const ex = sc.ex && sc.ex[0];
      if (ex && dest) {
        const txt = ex.speak_word || ex.word || ex.hint || '';
        if (txt && ex.type !== 'match') setTimeout(() => speakText(txt, dest.lc), 500);
      }
    }, 300);
  }

  function closeEx() { setInEx(false); setShowGram(false); setShowCult(false); }
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
      setExEarned(e => e + gain); setXp(x => x + gain);
      setMomentum(m => Math.min(100, m + 3));
      setAccuracy(a => Math.min(100, Math.round((a * 10 + 100) / 11)));
      setShowXP(true); sndOk();
      setTimeout(() => setShowXP(false), 900);
    } else {
      setExMistakes(m => m + 1); setReplays(r => r + 1);
      setShk(true); sndErr();
      setTimeout(() => setShk(false), 600);
    }
    setHeatmap(h => { const n = [...h]; n[4] = Math.min(5, (n[4] || 0) + 1); return n; });
  }

  function nextQ() {
    if (!exSc || !exSc.ex) return;
    const sc = exSc;
    const last = exIdx >= sc.ex.length - 1;
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
            const txt = ex.speak_word || ex.word || ex.hint || '';
            if (txt && ex.type !== 'match') speakText(txt, dest.lc);
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
  function TopBar() {
    const due = ld ? ld.pb.filter(isDue).length : 0;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: T.n0, borderBottom: `1.5px solid ${T.n100}`, flexShrink: 0 }}>
        <MomentumRing val={momentum} />
        <div style={{ flex: 1, paddingLeft: 4 }}><div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.n400 }}>Momentum</div></div>
        {due > 0 && <Chip type="amber">\u{1F504} {due} due</Chip>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 15, fontWeight: 800 }}><StarSVG /><span style={{ color: T.amber }}>{xp}</span></div>
        {dest && <span style={{ fontSize: 22, marginLeft: 8 }}>{dest.flag}</span>}
      </div>
    );
  }

  /* ─── BOTTOM NAV ─── */
  function BNav() {
    const tabs = [['learn', '\u{1F5FA}\uFE0F', 'Journey'], ['chat', '\u{1F4AC}', 'Chat'], ['phrases', '\u{1F4D6}', 'Phrases'], ['profile', '\u{1F4CA}', 'Progress']];
    return (
      <div style={{ display: 'flex', background: T.n0, borderTop: `1.5px solid ${T.n100}`, flexShrink: 0, paddingBottom: 'env(safe-area-inset-bottom, 0)' }}>
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
      ['\u{1F9E0}', 'SM-2 spaced repetition', 'Reviews phrases at the exact moment before you forget \u2014 scientifically proven'],
      ['\u{1F3AD}', '6 interactive exercise types', 'Tap, build, listen, match, fill-blank \u2014 all working, all wired to audio'],
      ['\u{1F4AC}', 'Conversation simulator', 'Practice real dialogues with AI characters before your trip'],
      ['\u{1F30D}', 'Cultural intelligence', 'Customs, etiquette and faux pas woven into every lesson'],
      ['\u{1F4CA}', 'Learning analytics', 'Track your forgetting curve, accuracy and weekly progress'],
      ['\u{1F5FA}\uFE0F', 'Destination-first', 'Tell us where you\'re going \u2014 content adapts to your goal'],
    ];
    return (
      <div style={{ flex: 1, overflowY: 'auto', background: `linear-gradient(180deg, ${T.n50} 0%, ${T.n0} 40%)`, animation: 'slideUp .3s ease both' }}>
        <div style={{ padding: '32px 24px 24px', textAlign: 'center', borderBottom: `1.5px solid ${T.n100}` }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <CompassSVG sz={34} />
            <span style={{ fontSize: 22, fontWeight: 800, color: T.n700, fontFamily: T.f }}>Learn Languages</span>
          </div>
          <div style={{ marginBottom: 18, animation: 'bob 2.4s ease-in-out infinite' }}><CompassSVG sz={108} /></div>
          <p style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.15, color: T.n700, fontFamily: T.fs, marginBottom: 10 }}>Learn for your<br />destination.</p>
          <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.6, color: T.n500, maxWidth: 290, margin: '0 auto' }}>Every lesson built around where you're going and why \u2014 not random vocab lists.</p>
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
        <div style={{ padding: '14px 22px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => go('test')} style={sBtnPrimary}>Take placement test</button>
          <button onClick={() => go('dest')} style={sBtnSecondary}>Choose destination \u2192</button>
          <button onClick={handleShowEmergency} style={{ background: T.redL, color: T.red, border: `2px solid ${T.red}`, borderRadius: 16, padding: 12, fontSize: 13, fontWeight: 800, cursor: 'pointer', width: '100%', fontFamily: T.f }}>{'\u{1F198}'} Emergency phrases \u2014 trip in 24 hours?</button>
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
          <button onClick={hideEmergency} style={{ width: 32, height: 32, borderRadius: '50%', background: T.redL, border: `1.5px solid ${T.red}`, fontSize: 14, color: T.red, cursor: 'pointer', fontFamily: T.f }}>\u2715</button>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.red }}>{'\u{1F198}'} Emergency Phrases</div>
            <p style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.red }}>{langData.name} survival kit \u2014 tap {'\u{1F50A}'} to hear any phrase</p>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px' }}>
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
          <button onClick={hideEmergency} style={sBtnRed}>Done \u2014 back to learning</button>
        </div>
      </div>
    );
  }

  function DestScreen() {
    return (
      <div style={{ flex: 1, overflowY: 'auto', animation: 'slideUp .3s ease both' }}>
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
          <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, color: T.n700, marginBottom: 4 }}>You're {lvlName}</h2>
          <Chip type="teal">Level {lvl} \u2014 {Math.round(pct * 100)}% score</Chip>
          <div style={{ background: T.tealL, border: `1.5px solid ${T.teal}`, borderRadius: 16, padding: 16, width: '100%', margin: '16px 0 24px', textAlign: 'left' }}>
            <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.teal }}>
              {lvl === 'A1' ? 'Starting from the foundations \u2014 rock-solid basics before real conversations.' :
                lvl === 'A2' ? 'You have the basics. Skipping straight to real conversational scenarios.' :
                  'Ready for advanced scenarios. Focus is on fluency and natural expression.'}
            </p>
          </div>
          <button onClick={doneTest} style={sBtnPrimary}>Start my journey \u2192</button>
        </div>
      );
    }
    const q = qs[testIdx];
    const lets = ['A', 'B', 'C', 'D'];
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.n0 }}>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1.5px solid ${T.n100}`, flexShrink: 0 }}>
          <div style={{ flex: 1 }}><ProgressBar value={testIdx} max={qs.length} height={8} cls="amber" /></div>
          <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400 }}>{testIdx}/{qs.length}</div>
        </div>
        <div style={{ flex: 1, padding: '22px 20px', overflow: 'auto' }}>
          <Chip type="purple">Placement test</Chip>
          <h3 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.25, color: T.n700, margin: '16px 0 22px' }}>{q.q}</h3>
          {q.opts.map((o, i) => (
            <OptBtn key={i} text={o} letter={lets[i]}
              isCorrect={chk && o === q.ans} isWrong={chk && o === sel && o !== q.ans}
              isSelected={!chk && o === sel} disabled={chk}
              onClick={() => testSel(o)} />
          ))}
        </div>
        {chk ? (
          <div style={{ padding: '20px 20px 16px', borderTop: '3px solid', borderColor: ok ? T.green : T.red, background: ok ? T.greenL : T.redL, flexShrink: 0, animation: 'slideUpPanel .25s cubic-bezier(.4,0,.2,1) both' }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: ok ? T.green : T.red, marginBottom: 10 }}>{ok ? '\u2713 Correct!' : '\u2717 Answer: ' + q.ans}</div>
            <button onClick={nextTestQ} style={ok ? sBtnGreen : sBtnRed}>Continue \u2192</button>
          </div>
        ) : (
          <div style={{ padding: '14px 20px', borderTop: `1.5px solid ${T.n100}` }}>
            <button onClick={checkTest} style={sel ? sBtnPrimary : sBtnDisabled} disabled={!sel}>Check</button>
          </div>
        )}
      </div>
    );
  }

  function PaceScreen() {
    const opts = [
      ['\u{1F331}', 'Light', '5\u201310 min \u2014 build the habit first', false],
      ['\u{1F3C3}', 'Regular', '15\u201320 min \u2014 the sweet spot', true],
      ['\u{1F525}', 'Deep dive', '25\u201340 min \u2014 fastest path to fluency', false],
    ];
    return (
      <div style={{ flex: 1, overflowY: 'auto', animation: 'slideUp .3s ease both' }}>
        <div style={{ padding: '28px 20px 16px' }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>\u23F1\uFE0F</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, color: T.n700, marginBottom: 4 }}>How much time daily?</h2>
          <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400 }}>Science shows 20 min daily beats 3 hrs on weekends by 3\u00d7.</p>
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
      <div style={{ flex: 1, overflowY: 'auto', background: T.n50 }}>
        <TopBar />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: T.n0, borderBottom: `1.5px solid ${T.n100}` }}>
          <span style={{ fontSize: 24 }}>{dest.flag}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.n600 }}>{dest.name}</div>
            <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400, letterSpacing: '.04em', marginBottom: 5 }}>{ld.name} \u00b7 Level {level} \u00b7 {done}/{sc.length} complete</div>
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
                      }}>\u2713</div>
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

  function ExerciseScreen() {
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
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.teal, marginBottom: 10 }}>{isL ? 'LISTEN AND CHOOSE' : 'TAP THE CORRECT ANSWER'}</div>
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
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.teal, marginBottom: 10 }}>BUILD THE SENTENCE</div>
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
              <span style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400 }}>Tap words to build your sentence\u2026</span>
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
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.teal, marginBottom: 10 }}>FILL IN THE BLANK</div>
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
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.teal, marginBottom: 10 }}>MATCH THE PAIRS</div>
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
              <p style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.green }}>\u2713 All matched! Well done.</p>
            </div>
          )}
        </>
      );
    }

    const rdy = ex.type === 'build' ? built.length > 0 : ex.type === 'match' ? matchDone.length === (ex.pairs ? ex.pairs.length : 0) : !!sel;
    const bot = chk && ex.type !== 'match' ? (
      <div style={{ padding: '20px 20px 16px', borderTop: '3px solid', borderColor: ok ? T.green : T.red, background: ok ? T.greenL : T.redL, flexShrink: 0, animation: 'slideUpPanel .25s cubic-bezier(.4,0,.2,1) both' }}>
        <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: ok ? T.green : T.red, marginBottom: ok ? 4 : 8 }}>{ok ? '\u2713  Correct!' : '\u2717  Not quite'}</div>
        {!ok ? (
          <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.redD, marginBottom: 12 }}>
            {(ex.type === 'fill' || ex.type === 'tap' || ex.type === 'listen') ? <>Answer: <strong>{ex.ans}</strong></> : <>Should be: <strong>{ex.hint}</strong></>}
            <br />Added to your replay queue {'\u{1F504}'}
          </p>
        ) : (
          <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.greenD, marginBottom: 10 }}>Momentum +3% \u00b7 Keep it up!</p>
        )}
        <button onClick={nextQ} style={ok ? sBtnGreen : sBtnRed}>Continue \u2192</button>
      </div>
    ) : (
      <div style={{ padding: '14px 18px', borderTop: `1.5px solid ${T.n100}` }}>
        {ex.type === 'match' && rdy ? (
          <button onClick={nextQ} style={sBtnPrimary}>Continue \u2192</button>
        ) : ex.type !== 'match' ? (
          <button onClick={checkEx2} style={rdy ? sBtnPrimary : sBtnDisabled} disabled={!rdy}>Check answer</button>
        ) : (
          <button style={sBtnDisabled} disabled>Match all pairs to continue</button>
        )}
      </div>
    );

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.n0, animation: shk ? 'shake .5s ease' : 'slideUp .3s ease' }}>
        <div style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1.5px solid ${T.n100}`, flexShrink: 0 }}>
          <button onClick={closeEx} style={{ width: 30, height: 30, borderRadius: '50%', background: T.n50, border: `1.5px solid ${T.n200}`, fontSize: 13, color: T.n400, cursor: 'pointer', fontFamily: T.f }}>\u2715</button>
          <div style={{ flex: 1 }}><ProgressBar value={prog} max={1} height={8} /></div>
          <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400 }}>{exIdx}/{exs.length}</div>
        </div>
        <div style={{ background: T.n50, padding: '9px 16px', borderBottom: `1.5px solid ${T.n100}`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 18 }}>{exSc.icon}</span>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.n300 }}>{exSc.place}</div>
        </div>
        <div style={{ flex: 1, padding: '20px 18px', overflow: 'auto', position: 'relative' }}>
          {showXP && <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 15, fontWeight: 900, color: T.teal, animation: 'floatUp .9s ease forwards', pointerEvents: 'none' }}>+{Math.round(exSc.xp / (exs.length || 1))} XP</div>}
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
          <button onClick={dismissGram} style={sBtnPrimary}>Got it \u2014 continue \u2192</button>
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
          <button onClick={dismissCult} style={{ ...sBtnPrimary, background: T.amber, boxShadow: `0 5px 0 ${T.amberD}` }}>Interesting \u2014 continue \u2192</button>
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
        <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.teal, fontWeight: 700, marginBottom: 24 }}>Phrases saved to Phrasebook + scheduled for review \u2713</p>
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
        <button onClick={doneEx} style={sBtnPrimary}>Back to journey \u2192</button>
      </div>
    );
  }

  function ChatScreen() {
    if (inConvo) return <ConvoScreen />;
    if (!ld || !dest) return null;
    const convos = ld.convos || [];
    return (
      <div style={{ flex: 1, overflowY: 'auto', background: T.n50 }}>
        <TopBar />
        <div style={{ padding: '16px 16px 12px', background: T.n0, borderBottom: `1.5px solid ${T.n100}` }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T.n300, marginBottom: 4 }}>Conversation practice</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, color: T.n700 }}>Chat Simulator</h2>
          <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400, marginTop: 3 }}>Talk with locals in {dest.name} before your trip.</p>
        </div>
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {convos.length ? convos.map(cv => (
            <div key={cv.id} onClick={() => startConvo(cv.id)} style={{
              padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
              transition: 'all .15s', background: T.n0, borderRadius: 16,
              border: `1.5px solid ${T.n100}`, boxShadow: '0 1px 3px rgba(0,0,0,.08)',
            }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: T.n50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, border: `2px solid ${T.n100}` }}>{cv.npc.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.n600 }}>{cv.title}</div>
                <p style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400, letterSpacing: '.04em', marginTop: 2 }}>With {cv.npc.name} \u00b7 {cv.npc.role}</p>
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
            <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400 }}>Swain's Output Hypothesis (1985): speaking forces your brain to process language at a depth that passive reading cannot achieve. Even 5 minutes of dialogue {'>'} 30 minutes of vocab.</p>
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
          <div style={{ fontSize: 52, marginBottom: 8 }}>{pct >= 80 ? '\u{1F3AD}' : pct >= 50 ? '\u{1F4AC}' : '\u{1F5E3}\uFE0F'}</div>
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
          <button onClick={endConvo} style={{ width: 30, height: 30, borderRadius: '50%', background: T.n50, border: `1.5px solid ${T.n200}`, fontSize: 13, color: T.n400, cursor: 'pointer', fontFamily: T.f }}>\u2715</button>
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
      <div style={{ flex: 1, overflowY: 'auto', background: T.n50 }}>
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
                  <div style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400 }}>{ph.t}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400, letterSpacing: '.04em', marginTop: 3 }}>Next review: {nr}{ph.reps ? ' \u00b7 ' + ph.reps + ' reps' : ' \u00b7 new'}</div>
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
            <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400 }}>After each review you rate your recall (1\u20135). The algorithm then schedules that phrase at the exact optimal interval \u2014 1 day, 6 days, 15 days... Brain imaging shows SRS learners develop native-like neural patterns after just 6 months.</p>
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
      <div style={{ flex: 1, overflowY: 'auto', background: T.n50 }}>
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
            <p style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400, letterSpacing: '.04em', marginTop: 2 }}>{dest.name} \u00b7 {ld.name} \u00b7 Level {level}</p>
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
              ['\u{1F5FA}\uFE0F', done + '/' + sc.length, 'Scenarios', T.teal],
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
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.n600, marginBottom: 10 }}>{'\u{1F4C5}'} Weekly heatmap</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 }}>
              {days.map((d, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4, color: T.n400, letterSpacing: '.04em', marginBottom: 4 }}>{d}</div>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: heatmap[i] ? hc[Math.min(4, heatmap[i])] : T.n100 }} />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: T.n400 }}>20 min daily beats 2h on weekends by 3\u00d7 (distributed practice research).</p>
          </div>
          <div style={{ padding: 14, marginBottom: 40, background: T.n0, borderRadius: 16, border: `1.5px solid ${T.n100}`, boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: T.n600, marginBottom: 10 }}>{'\u{1F5FA}\uFE0F'} Language journey</div>
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
                  <div style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, fontWeight: 700, color: level === l[0] ? T.teal : T.n600 }}>{l[1]}{level === l[0] ? ' \u2190 you are here' : ''}</div>
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
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {tabContent}
        <BNav />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Learn Languages | NewWorld Education</title>
        <meta name="description" content="Learn French, Spanish, Japanese, German, Korean, Italian, Arabic and Portuguese with interactive exercises, conversation practice and spaced repetition \u2014 powered by NewWorld Education." />
        <meta property="og:title" content="Learn Languages | NewWorld Education" />
        <meta property="og:description" content="Master 8 languages with interactive exercises, real conversations and SM-2 spaced repetition." />
      </Head>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <div style={{
        maxWidth: 480, margin: '0 auto', minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        background: T.n0, fontFamily: T.f,
        WebkitFontSmoothing: 'antialiased',
        position: 'relative', overflow: 'hidden',
      }}>
        {renderContent()}
      </div>
    </>
  );
}
