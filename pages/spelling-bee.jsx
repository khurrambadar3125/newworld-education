import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { useTheme } from './_app';
import { useProductGate, ProductPaywall, ProductTrialBadge } from '../utils/productGate';

/* ═══════════════════════════════════════
   DESIGN TOKENS — theme-aware
═══════════════════════════════════════ */
function getTokens(isDark) {
  const accent = {
    teal: '#4F8EF7', tealD: '#3B7DE8', tealM: '#6BA3F9',
    tealL: isDark ? 'rgba(79,142,247,0.12)' : 'rgba(79,142,247,0.1)',
    tealXL: isDark ? 'rgba(79,142,247,0.06)' : 'rgba(79,142,247,0.05)',
    green: '#2BB55A', greenD: '#1D8C42', greenL: isDark ? 'rgba(43,181,90,0.12)' : '#E8F5EE',
    red: '#F87171', redD: '#DC2626', redL: isDark ? 'rgba(248,113,113,0.12)' : '#FDECEA',
    amber: '#F59E0B', amberD: '#D97706', amberL: isDark ? 'rgba(245,158,11,0.12)' : '#FEF3E0',
    purple: '#7C5CBF', purpleL: isDark ? 'rgba(124,92,191,0.12)' : '#EDE9FE',
  };
  if (isDark) {
    return {
      ...accent,
      n0: '#0D1221', n50: '#111827', n100: 'rgba(255,255,255,0.08)', n200: 'rgba(255,255,255,0.12)',
      n300: 'rgba(255,255,255,0.25)', n400: 'rgba(255,255,255,0.45)', n500: 'rgba(255,255,255,0.6)',
      n600: 'rgba(255,255,255,0.75)', n700: '#ffffff', n800: '#ffffff',
      f: "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    };
  }
  return {
    ...accent,
    n0: '#FFFFFF', n50: '#F5F7FA', n100: 'rgba(0,0,0,0.06)', n200: 'rgba(0,0,0,0.1)',
    n300: 'rgba(0,0,0,0.2)', n400: 'rgba(0,0,0,0.4)', n500: 'rgba(0,0,0,0.55)',
    n600: 'rgba(0,0,0,0.7)', n700: '#1A1A2E', n800: '#0D0D1A',
    f: "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  };
}

/* ═══════════════════════════════════════
   AUDIO ENGINE — Web Audio API
═══════════════════════════════════════ */
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

function speak(word, rate) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !word) return;
  window.speechSynthesis.cancel();
  const clean = word.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = 'en-US'; u.rate = rate || 0.82; u.pitch = 1.05;
  const vs = window.speechSynthesis.getVoices();
  const m = vs.find(v => v.lang === 'en-US') || vs.find(v => v.lang.startsWith('en'));
  if (m) u.voice = m;
  window.speechSynthesis.speak(u);
}

/* ═══════════════════════════════════════
   CONFETTI COMPONENT
═══════════════════════════════════════ */
function Confetti() {
  const cols = ['#C77DFF', '#63D2FF', '#FFC300', '#A8E063', '#FF8C69', '#FF6B9D', '#F4A261'];
  const pieces = [];
  for (let i = 0; i < 28; i++) {
    const c = cols[i % cols.length], x = Math.random() * 100, r = Math.random() * 360;
    const dur = (0.8 + Math.random() * 0.8) + 's';
    const delay = (Math.random() * 0.4) + 's';
    pieces.push(
      <div key={i} style={{
        position: 'absolute', width: 10, height: 10, borderRadius: 3,
        left: x + '%', top: 10, background: c,
        animation: `sbConfettiFall ${dur} ${delay} ease-in forwards`,
        opacity: 0, transform: `rotate(${r}deg)`,
      }} />
    );
  }
  return <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 100 }}>{pieces}</div>;
}

function FloatingXP({ amount }) {
  return (
    <div style={{
      position: 'absolute', top: -10, right: 10,
      color: '#A8E063', fontWeight: 900, fontSize: 20,
      animation: 'sbFloatUp 1.2s ease-out forwards',
      pointerEvents: 'none', zIndex: 101,
    }}>
      +{amount} XP
    </div>
  );
}

/* ═══════════════════════════════════════
   GRADES
═══════════════════════════════════════ */
const GRADES = [
  { id: 'kg', label: 'Nursery / KG', age: '3-5', emoji: '\u{1F331}', color: '#FFB347' },
  { id: 'g1', label: 'Grade 1', age: '5-6', emoji: '\u2B50', color: '#FF6B6B' },
  { id: 'g2', label: 'Grade 2', age: '6-7', emoji: '\u{1F308}', color: '#FF8E53' },
  { id: 'g3', label: 'Grade 3', age: '7-8', emoji: '\u{1F680}', color: '#FFC300' },
  { id: 'g4', label: 'Grade 4', age: '8-9', emoji: '\u{1F52C}', color: '#A8E063' },
  { id: 'g5', label: 'Grade 5', age: '9-10', emoji: '\u{1F30D}', color: '#4ECDC4' },
  { id: 'g6', label: 'Grade 6', age: '10-11', emoji: '\u{1F3C6}', color: '#63D2FF' },
];

/* ═══════════════════════════════════════
   GAME MODES
═══════════════════════════════════════ */
const MODES = [
  { id: 'classic', label: 'Classic', emoji: '\u{1F3A4}', desc: 'Listen & spell' },
  { id: 'unscramble', label: 'Unscramble', emoji: '\u{1F500}', desc: 'Unjumble letters' },
  { id: 'picture', label: 'Picture Spell', emoji: '\u{1F5BC}', desc: 'See & spell' },
  { id: 'speed', label: 'Speed Round', emoji: '\u26A1', desc: '30s challenge' },
];

/* ═══════════════════════════════════════
   WORD LISTS — 30+ per grade
═══════════════════════════════════════ */
const WORDS = {
  kg: [
    { word: 'CAT', meaning: 'A small furry pet', emoji: '\u{1F431}', sentence: 'The cat sat on the mat.' },
    { word: 'DOG', meaning: 'A loyal pet animal', emoji: '\u{1F415}', sentence: 'The dog loves to play fetch.' },
    { word: 'SUN', meaning: 'The bright star in our sky', emoji: '\u2600\uFE0F', sentence: 'The sun is very hot.' },
    { word: 'BUS', meaning: 'A big vehicle for passengers', emoji: '\u{1F68C}', sentence: 'I go to school by bus.' },
    { word: 'CUP', meaning: 'You drink water from it', emoji: '\u{1F964}', sentence: 'Give me a cup of water.' },
    { word: 'HAT', meaning: 'You wear it on your head', emoji: '\u{1F3A9}', sentence: 'She wore a red hat.' },
    { word: 'PEN', meaning: 'You write with it', emoji: '\u{1F58A}\uFE0F', sentence: 'I need a pen to write.' },
    { word: 'BED', meaning: 'You sleep on it', emoji: '\u{1F6CF}\uFE0F', sentence: 'Time to go to bed.' },
    { word: 'RED', meaning: 'A bright warm color', emoji: '\u2764\uFE0F', sentence: 'The apple is red.' },
    { word: 'BIG', meaning: 'Large in size', emoji: '\u{1F418}', sentence: 'The elephant is big.' },
    { word: 'RUN', meaning: 'Move fast on your feet', emoji: '\u{1F3C3}', sentence: 'I like to run in the park.' },
    { word: 'HOP', meaning: 'Jump on one foot', emoji: '\u{1F407}', sentence: 'The rabbit can hop high.' },
    { word: 'MAP', meaning: 'Shows you where places are', emoji: '\u{1F5FA}\uFE0F', sentence: 'Look at the map.' },
    { word: 'FAN', meaning: 'Blows cool air', emoji: '\u{1F32C}\uFE0F', sentence: 'Turn on the fan.' },
    { word: 'JAM', meaning: 'Sweet spread for bread', emoji: '\u{1F353}', sentence: 'I like jam on toast.' },
    { word: 'MOP', meaning: 'Used to clean floors', emoji: '\u{1F9F9}', sentence: 'Use the mop to clean.' },
    { word: 'NET', meaning: 'Used to catch things', emoji: '\u{1F3D0}', sentence: 'The fish are in the net.' },
    { word: 'PIG', meaning: 'A farm animal that oinks', emoji: '\u{1F437}', sentence: 'The pig rolls in the mud.' },
    { word: 'VAN', meaning: 'A big car for carrying things', emoji: '\u{1F690}', sentence: 'The van is blue.' },
    { word: 'WET', meaning: 'Covered in water', emoji: '\u{1F4A7}', sentence: 'My shirt is wet.' },
    { word: 'BOX', meaning: 'A container with sides', emoji: '\u{1F4E6}', sentence: 'Put it in the box.' },
    { word: 'FOX', meaning: 'A clever wild animal', emoji: '\u{1F98A}', sentence: 'The fox is very quick.' },
    { word: 'HEN', meaning: 'A female chicken', emoji: '\u{1F414}', sentence: 'The hen laid an egg.' },
    { word: 'JUG', meaning: 'A container for liquids', emoji: '\u{1F3FA}', sentence: 'Pour water from the jug.' },
    { word: 'LOG', meaning: 'A piece of a tree trunk', emoji: '\u{1FAB5}', sentence: 'Sit on the log.' },
    { word: 'NUT', meaning: 'A small hard-shelled fruit', emoji: '\u{1F95C}', sentence: 'The squirrel eats a nut.' },
    { word: 'RAT', meaning: 'A small rodent', emoji: '\u{1F400}', sentence: 'The rat ran away.' },
    { word: 'TEN', meaning: 'The number after nine', emoji: '\u{1F51F}', sentence: 'I have ten fingers.' },
    { word: 'ZIP', meaning: 'Closes your jacket', emoji: '\u{1F9E5}', sentence: 'Zip up your jacket.' },
    { word: 'GUM', meaning: 'You chew it', emoji: '\u{1F36C}', sentence: 'Do not swallow the gum.' },
  ],
  g1: [
    { word: 'FISH', meaning: 'An animal that lives in water', emoji: '\u{1F41F}', sentence: 'The fish swims in the pond.' },
    { word: 'TREE', meaning: 'A tall plant with leaves', emoji: '\u{1F333}', sentence: 'We sat under a tree.' },
    { word: 'BOOK', meaning: 'You read stories in it', emoji: '\u{1F4D6}', sentence: 'I love to read a book.' },
    { word: 'MILK', meaning: 'A white drink from cows', emoji: '\u{1F95B}', sentence: 'Drink your milk.' },
    { word: 'BIRD', meaning: 'An animal with feathers and wings', emoji: '\u{1F426}', sentence: 'The bird sings every morning.' },
    { word: 'FROG', meaning: 'A green jumping animal', emoji: '\u{1F438}', sentence: 'The frog lives near the pond.' },
    { word: 'STAR', meaning: 'A bright light in the night sky', emoji: '\u2B50', sentence: 'I can see a star.' },
    { word: 'RAIN', meaning: 'Water falling from the sky', emoji: '\u{1F327}\uFE0F', sentence: 'The rain is coming down.' },
    { word: 'BALL', meaning: 'A round toy you play with', emoji: '\u26BD', sentence: 'Kick the ball.' },
    { word: 'CAKE', meaning: 'A sweet baked treat', emoji: '\u{1F370}', sentence: 'We had cake at the party.' },
    { word: 'LAMP', meaning: 'Gives light in a room', emoji: '\u{1F4A1}', sentence: 'Turn on the lamp.' },
    { word: 'RING', meaning: 'Jewelry worn on a finger', emoji: '\u{1F48D}', sentence: 'She has a gold ring.' },
    { word: 'SHIP', meaning: 'A large boat', emoji: '\u{1F6A2}', sentence: 'The ship sailed the ocean.' },
    { word: 'DRUM', meaning: 'A musical instrument you hit', emoji: '\u{1F941}', sentence: 'He plays the drum.' },
    { word: 'MOON', meaning: 'Shines bright at night', emoji: '\u{1F319}', sentence: 'Look at the moon tonight.' },
    { word: 'NEST', meaning: 'Where birds lay eggs', emoji: '\u{1F426}', sentence: 'The bird built a nest.' },
    { word: 'KITE', meaning: 'Flies in the wind on a string', emoji: '\u{1FA81}', sentence: 'We fly kites on windy days.' },
    { word: 'ROAD', meaning: 'A path for cars and people', emoji: '\u{1F6E3}\uFE0F', sentence: 'Look both ways before crossing the road.' },
    { word: 'GATE', meaning: 'An opening in a fence or wall', emoji: '\u{1F3F0}', sentence: 'Close the gate behind you.' },
    { word: 'GOAT', meaning: 'A farm animal with horns', emoji: '\u{1F410}', sentence: 'The goat eats grass.' },
    { word: 'DUCK', meaning: 'A bird that swims and quacks', emoji: '\u{1F986}', sentence: 'The duck swam in the lake.' },
    { word: 'PARK', meaning: 'A green area to play in', emoji: '\u{1F3DE}\uFE0F', sentence: 'Let us go to the park.' },
    { word: 'HAND', meaning: 'Part of your body with five fingers', emoji: '\u270B', sentence: 'Raise your hand.' },
    { word: 'LION', meaning: 'The king of the jungle', emoji: '\u{1F981}', sentence: 'The lion roared loudly.' },
    { word: 'BELL', meaning: 'Makes a ringing sound', emoji: '\u{1F514}', sentence: 'The school bell rang.' },
    { word: 'CORN', meaning: 'A yellow vegetable on a cob', emoji: '\u{1F33D}', sentence: 'We had corn for dinner.' },
    { word: 'TENT', meaning: 'You sleep in it when camping', emoji: '\u26FA', sentence: 'We put up a tent.' },
    { word: 'ROSE', meaning: 'A beautiful flower', emoji: '\u{1F339}', sentence: 'She picked a red rose.' },
    { word: 'GOLD', meaning: 'A precious yellow metal', emoji: '\u{1F947}', sentence: 'He won a gold medal.' },
    { word: 'WORM', meaning: 'A small creature in the soil', emoji: '\u{1FAB1}', sentence: 'The worm lives in the ground.' },
  ],
  g2: [
    { word: 'HOUSE', meaning: 'A building where people live', emoji: '\u{1F3E0}', sentence: 'Our house has a red door.' },
    { word: 'WATER', meaning: 'A clear liquid we drink', emoji: '\u{1F4A7}', sentence: 'Drink plenty of water.' },
    { word: 'GREEN', meaning: 'The color of grass and leaves', emoji: '\u{1F49A}', sentence: 'The grass is green.' },
    { word: 'HAPPY', meaning: 'Feeling glad and joyful', emoji: '\u{1F60A}', sentence: 'I am happy today.' },
    { word: 'SMILE', meaning: 'A happy expression on your face', emoji: '\u{1F604}', sentence: 'Your smile is beautiful.' },
    { word: 'PLANT', meaning: 'A living thing that grows in soil', emoji: '\u{1F331}', sentence: 'Water the plant every day.' },
    { word: 'RIVER', meaning: 'A large flowing body of water', emoji: '\u{1F30A}', sentence: 'The river flows to the sea.' },
    { word: 'HORSE', meaning: 'A large animal you can ride', emoji: '\u{1F434}', sentence: 'The horse runs very fast.' },
    { word: 'BREAD', meaning: 'A baked food made from flour', emoji: '\u{1F35E}', sentence: 'We eat bread for breakfast.' },
    { word: 'TRAIN', meaning: 'A vehicle that runs on tracks', emoji: '\u{1F682}', sentence: 'The train is very fast.' },
    { word: 'CHAIR', meaning: 'You sit on it', emoji: '\u{1FA91}', sentence: 'Sit on the chair.' },
    { word: 'CLOUD', meaning: 'A white fluffy shape in the sky', emoji: '\u2601\uFE0F', sentence: 'The cloud looks like a sheep.' },
    { word: 'BEACH', meaning: 'Sandy area next to the sea', emoji: '\u{1F3D6}\uFE0F', sentence: 'We played at the beach.' },
    { word: 'TEETH', meaning: 'Hard white things in your mouth', emoji: '\u{1F9B7}', sentence: 'Brush your teeth twice a day.' },
    { word: 'SLEEP', meaning: 'Rest with your eyes closed', emoji: '\u{1F634}', sentence: 'I need to sleep early.' },
    { word: 'QUEEN', meaning: 'A female ruler of a country', emoji: '\u{1F451}', sentence: 'The queen wore a crown.' },
    { word: 'TIGER', meaning: 'A large striped wild cat', emoji: '\u{1F405}', sentence: 'The tiger lives in the jungle.' },
    { word: 'PIZZA', meaning: 'A flat round food with toppings', emoji: '\u{1F355}', sentence: 'I love cheese pizza.' },
    { word: 'LIGHT', meaning: 'What helps you see in the dark', emoji: '\u{1F4A1}', sentence: 'Turn on the light please.' },
    { word: 'SEVEN', meaning: 'The number after six', emoji: '\u0037\uFE0F\u20E3', sentence: 'There are seven days in a week.' },
    { word: 'EARTH', meaning: 'The planet we live on', emoji: '\u{1F30D}', sentence: 'Earth is our home.' },
    { word: 'MONEY', meaning: 'Used to buy things', emoji: '\u{1F4B0}', sentence: 'Save your money.' },
    { word: 'CANDY', meaning: 'A sweet treat', emoji: '\u{1F36C}', sentence: 'Do not eat too much candy.' },
    { word: 'SNAKE', meaning: 'A long reptile with no legs', emoji: '\u{1F40D}', sentence: 'The snake slithered away.' },
    { word: 'GRAPE', meaning: 'A small round purple fruit', emoji: '\u{1F347}', sentence: 'I like green grapes.' },
    { word: 'CHEST', meaning: 'A large strong box', emoji: '\u{1F4E6}', sentence: 'The treasure is in the chest.' },
    { word: 'CLIFF', meaning: 'A tall steep rock face', emoji: '\u{1F3D4}\uFE0F', sentence: 'Stand away from the cliff.' },
    { word: 'CRANE', meaning: 'A tall machine used for lifting', emoji: '\u{1F3D7}\uFE0F', sentence: 'The crane lifted heavy steel.' },
    { word: 'MASJID', meaning: 'A place of worship for Muslims', emoji: '\u{1F54C}', sentence: 'We go to the masjid on Friday.' },
    { word: 'MANGO', meaning: 'A sweet tropical fruit', emoji: '\u{1F96D}', sentence: 'Pakistan has the best mangoes.' },
  ],
  g3: [
    { word: 'SCHOOL', meaning: 'A place where children learn', emoji: '\u{1F3EB}', sentence: 'I love going to school.' },
    { word: 'FRIEND', meaning: 'Someone you like and trust', emoji: '\u{1F46B}', sentence: 'She is my best friend.' },
    { word: 'ANIMAL', meaning: 'A living creature that moves', emoji: '\u{1F43E}', sentence: 'My favourite animal is a rabbit.' },
    { word: 'GARDEN', meaning: 'An area where plants are grown', emoji: '\u{1F33B}', sentence: 'The flowers bloom in the garden.' },
    { word: 'BASKET', meaning: 'A container woven from strips', emoji: '\u{1F9FA}', sentence: 'Put the fruit in the basket.' },
    { word: 'WINDOW', meaning: 'An opening in a wall with glass', emoji: '\u{1FA9F}', sentence: 'Open the window for fresh air.' },
    { word: 'BRIDGE', meaning: 'A structure built over water or a road', emoji: '\u{1F309}', sentence: 'We crossed the bridge.' },
    { word: 'JUNGLE', meaning: 'A thick tropical forest', emoji: '\u{1F334}', sentence: 'Many animals live in the jungle.' },
    { word: 'ISLAND', meaning: 'Land surrounded by water', emoji: '\u{1F3DD}\uFE0F', sentence: 'The island has beautiful beaches.' },
    { word: 'POCKET', meaning: 'A small bag sewn into clothing', emoji: '\u{1F45C}', sentence: 'Put the keys in your pocket.' },
    { word: 'MARKET', meaning: 'A place where things are sold', emoji: '\u{1F6D2}', sentence: 'We buy vegetables from the market.' },
    { word: 'DESERT', meaning: 'A hot dry area with sand', emoji: '\u{1F3DC}\uFE0F', sentence: 'The desert is very hot.' },
    { word: 'ROCKET', meaning: 'A vehicle that flies into space', emoji: '\u{1F680}', sentence: 'The rocket launched into space.' },
    { word: 'PLANET', meaning: 'A large body orbiting a star', emoji: '\u{1FA90}', sentence: 'Earth is the third planet from the sun.' },
    { word: 'SUMMER', meaning: 'The hottest season of the year', emoji: '\u2600\uFE0F', sentence: 'I love summer holidays.' },
    { word: 'WINTER', meaning: 'The coldest season of the year', emoji: '\u2744\uFE0F', sentence: 'We wear warm clothes in winter.' },
    { word: 'SHADOW', meaning: 'A dark shape made when light is blocked', emoji: '\u{1F47B}', sentence: 'I saw my shadow on the wall.' },
    { word: 'CORNER', meaning: 'Where two walls or roads meet', emoji: '\u{1F4CD}', sentence: 'Turn left at the corner.' },
    { word: 'INSECT', meaning: 'A small creature with six legs', emoji: '\u{1F41B}', sentence: 'A butterfly is a beautiful insect.' },
    { word: 'MIRROR', meaning: 'A glass surface that reflects', emoji: '\u{1FA9E}', sentence: 'Look in the mirror.' },
    { word: 'PENCIL', meaning: 'A writing tool with graphite', emoji: '\u270F\uFE0F', sentence: 'Sharpen your pencil.' },
    { word: 'PICKLE', meaning: 'A preserved vegetable', emoji: '\u{1F952}', sentence: 'I like pickle with biryani.' },
    { word: 'PARROT', meaning: 'A colourful talking bird', emoji: '\u{1F99C}', sentence: 'The parrot can say hello.' },
    { word: 'MUSEUM', meaning: 'A building with historical items', emoji: '\u{1F3DB}\uFE0F', sentence: 'We visited the museum today.' },
    { word: 'BAZAAR', meaning: 'A busy marketplace', emoji: '\u{1F6D2}', sentence: 'The bazaar was full of people.' },
    { word: 'TROPHY', meaning: 'A prize for winning', emoji: '\u{1F3C6}', sentence: 'Our team won the trophy.' },
    { word: 'SPIDER', meaning: 'A creature with eight legs', emoji: '\u{1F577}\uFE0F', sentence: 'The spider spun a web.' },
    { word: 'TUNNEL', meaning: 'A passage through a mountain or underground', emoji: '\u{1F687}', sentence: 'The train went through the tunnel.' },
    { word: 'FABRIC', meaning: 'Cloth or material', emoji: '\u{1F9F5}', sentence: 'This fabric is very soft.' },
    { word: 'HONEST', meaning: 'Truthful and sincere', emoji: '\u{1F91D}', sentence: 'Always be honest.' },
  ],
  g4: [
    { word: 'KITCHEN', meaning: 'A room where food is cooked', emoji: '\u{1F373}', sentence: 'Mum is cooking in the kitchen.' },
    { word: 'HOLIDAY', meaning: 'A time of rest and fun', emoji: '\u{1F3D6}\uFE0F', sentence: 'We are going on holiday.' },
    { word: 'PICTURE', meaning: 'An image or photograph', emoji: '\u{1F5BC}\uFE0F', sentence: 'She drew a beautiful picture.' },
    { word: 'WEATHER', meaning: 'The condition of the atmosphere', emoji: '\u{1F326}\uFE0F', sentence: 'The weather is sunny today.' },
    { word: 'MORNING', meaning: 'The early part of the day', emoji: '\u{1F305}', sentence: 'Good morning, everyone!' },
    { word: 'COUNTRY', meaning: 'A nation with borders', emoji: '\u{1F30D}', sentence: 'Pakistan is a beautiful country.' },
    { word: 'CAPTAIN', meaning: 'The leader of a team or ship', emoji: '\u{1F9D1}\u200D\u2708\uFE0F', sentence: 'He is the captain of the team.' },
    { word: 'VILLAGE', meaning: 'A small settlement in the countryside', emoji: '\u{1F3D8}\uFE0F', sentence: 'My grandparents live in a village.' },
    { word: 'HISTORY', meaning: 'The study of past events', emoji: '\u{1F4DC}', sentence: 'I enjoy learning history.' },
    { word: 'TEACHER', meaning: 'A person who teaches', emoji: '\u{1F469}\u200D\u{1F3EB}', sentence: 'Our teacher is very kind.' },
    { word: 'BROTHER', meaning: 'A male sibling', emoji: '\u{1F466}', sentence: 'My brother plays cricket.' },
    { word: 'FEATHER', meaning: 'A light covering on birds', emoji: '\u{1FAB6}', sentence: 'The feather floated in the air.' },
    { word: 'LIBRARY', meaning: 'A place with many books', emoji: '\u{1F4DA}', sentence: 'I borrowed a book from the library.' },
    { word: 'WARRIOR', meaning: 'A brave fighter', emoji: '\u{1F93A}', sentence: 'The warrior defended the castle.' },
    { word: 'CHICKEN', meaning: 'A common farm bird', emoji: '\u{1F414}', sentence: 'We had chicken biryani.' },
    { word: 'PROBLEM', meaning: 'A question or difficulty', emoji: '\u{1F914}', sentence: 'Solve the maths problem.' },
    { word: 'FACTORY', meaning: 'A building where goods are made', emoji: '\u{1F3ED}', sentence: 'The factory makes toys.' },
    { word: 'CRICKET', meaning: 'A popular bat-and-ball sport', emoji: '\u{1F3CF}', sentence: 'We play cricket every evening.' },
    { word: 'HEALTHY', meaning: 'In good physical condition', emoji: '\u{1F4AA}', sentence: 'Eat fruit to stay healthy.' },
    { word: 'BLANKET', meaning: 'A warm covering for a bed', emoji: '\u{1F6CF}\uFE0F', sentence: 'I need a blanket, it is cold.' },
    { word: 'DIAMOND', meaning: 'A precious sparkling gemstone', emoji: '\u{1F48E}', sentence: 'A diamond shines brightly.' },
    { word: 'JOURNEY', meaning: 'Travelling from one place to another', emoji: '\u{1F6E4}\uFE0F', sentence: 'The journey took three hours.' },
    { word: 'MONSTER', meaning: 'A scary imaginary creature', emoji: '\u{1F47E}', sentence: 'There is no monster under the bed.' },
    { word: 'DOLPHIN', meaning: 'A smart sea mammal', emoji: '\u{1F42C}', sentence: 'The dolphin jumped out of the water.' },
    { word: 'SOLDIER', meaning: 'A person in the army', emoji: '\u{1F482}', sentence: 'The soldier stood guard.' },
    { word: 'CUSHION', meaning: 'A soft pillow for a chair', emoji: '\u{1F6CB}\uFE0F', sentence: 'Sit on the cushion.' },
    { word: 'DESSERT', meaning: 'A sweet dish after a meal', emoji: '\u{1F370}', sentence: 'We had dessert after dinner.' },
    { word: 'HARBOUR', meaning: 'A sheltered place for ships', emoji: '\u26F5', sentence: 'The boats are in the harbour.' },
    { word: 'CHARITY', meaning: 'Giving help to those in need', emoji: '\u{1F49B}', sentence: 'Charity begins at home.' },
    { word: 'STADIUM', meaning: 'A large sports ground', emoji: '\u{1F3DF}\uFE0F', sentence: 'The stadium was full of fans.' },
  ],
  g5: [
    { word: 'ELEPHANT', meaning: 'The largest land animal', emoji: '\u{1F418}', sentence: 'The elephant has a long trunk.' },
    { word: 'BIRTHDAY', meaning: 'The anniversary of being born', emoji: '\u{1F382}', sentence: 'Happy birthday to you!' },
    { word: 'SURPRISE', meaning: 'Something unexpected', emoji: '\u{1F381}', sentence: 'We planned a surprise party.' },
    { word: 'MOUNTAIN', meaning: 'A very high natural landform', emoji: '\u{1F3D4}\uFE0F', sentence: 'K2 is a famous mountain in Pakistan.' },
    { word: 'DISCOVER', meaning: 'To find something for the first time', emoji: '\u{1F50D}', sentence: 'Scientists discover new things.' },
    { word: 'TREASURE', meaning: 'Valuable things like gold and jewels', emoji: '\u{1F4B0}', sentence: 'The pirates found treasure.' },
    { word: 'ALPHABET', meaning: 'The set of letters in a language', emoji: '\u{1F524}', sentence: 'The English alphabet has 26 letters.' },
    { word: 'HOMEWORK', meaning: 'School work done at home', emoji: '\u{1F4DD}', sentence: 'Finish your homework before playing.' },
    { word: 'UMBRELLA', meaning: 'Protects you from rain', emoji: '\u2602\uFE0F', sentence: 'Take an umbrella, it might rain.' },
    { word: 'SANDWICH', meaning: 'Bread with filling in between', emoji: '\u{1F96A}', sentence: 'I had a cheese sandwich.' },
    { word: 'DOCUMENT', meaning: 'An official written paper', emoji: '\u{1F4C4}', sentence: 'Sign the document carefully.' },
    { word: 'STRENGTH', meaning: 'The quality of being strong', emoji: '\u{1F4AA}', sentence: 'Exercise builds strength.' },
    { word: 'DAUGHTER', meaning: 'A female child', emoji: '\u{1F467}', sentence: 'She is my eldest daughter.' },
    { word: 'MIDNIGHT', meaning: 'Twelve o\'clock at night', emoji: '\u{1F319}', sentence: 'The clock struck midnight.' },
    { word: 'NOTEBOOK', meaning: 'A book for writing notes', emoji: '\u{1F4D3}', sentence: 'Write it in your notebook.' },
    { word: 'MOSQUITO', meaning: 'A small biting insect', emoji: '\u{1F99F}', sentence: 'The mosquito buzzes at night.' },
    { word: 'KANGAROO', meaning: 'An Australian hopping animal', emoji: '\u{1F998}', sentence: 'A kangaroo carries its baby in a pouch.' },
    { word: 'PLATFORM', meaning: 'A raised flat surface', emoji: '\u{1F689}', sentence: 'Wait on the platform for the train.' },
    { word: 'CHAMPION', meaning: 'The winner of a competition', emoji: '\u{1F3C6}', sentence: 'Pakistan became champion!' },
    { word: 'COLOSSEUM', meaning: 'An ancient Roman arena', emoji: '\u{1F3DB}\uFE0F', sentence: 'The Colosseum is in Rome.' },
    { word: 'SCISSORS', meaning: 'A cutting tool with two blades', emoji: '\u2702\uFE0F', sentence: 'Use scissors to cut the paper.' },
    { word: 'CALENDAR', meaning: 'Shows days, weeks and months', emoji: '\u{1F4C5}', sentence: 'Check the calendar for the date.' },
    { word: 'HORRIBLE', meaning: 'Very bad or unpleasant', emoji: '\u{1F630}', sentence: 'The weather was horrible.' },
    { word: 'THOUSAND', meaning: 'The number 1000', emoji: '\u{1F4AF}', sentence: 'A thousand people came to the show.' },
    { word: 'DINOSAUR', meaning: 'A large prehistoric reptile', emoji: '\u{1F995}', sentence: 'Dinosaurs lived millions of years ago.' },
    { word: 'CROCODILE', meaning: 'A large reptile in rivers', emoji: '\u{1F40A}', sentence: 'The crocodile has sharp teeth.' },
    { word: 'BACKPACK', meaning: 'A bag carried on your back', emoji: '\u{1F392}', sentence: 'Pack your backpack for school.' },
    { word: 'PRACTICE', meaning: 'Repeating to get better', emoji: '\u{1F3AF}', sentence: 'Practice makes perfect.' },
    { word: 'SHOULDER', meaning: 'The joint connecting arm to body', emoji: '\u{1F4AA}', sentence: 'He carried the bag on his shoulder.' },
    { word: 'PATIENCE', meaning: 'The ability to wait calmly', emoji: '\u{1F54A}\uFE0F', sentence: 'Have patience, your turn will come.' },
  ],
  g6: [
    { word: 'EDUCATION', meaning: 'The process of learning', emoji: '\u{1F393}', sentence: 'Education is very important.' },
    { word: 'IMPORTANT', meaning: 'Of great value or significance', emoji: '\u2757', sentence: 'This is an important lesson.' },
    { word: 'WONDERFUL', meaning: 'Extremely good or marvellous', emoji: '\u{1F929}', sentence: 'What a wonderful day!' },
    { word: 'KNOWLEDGE', meaning: 'Information and understanding', emoji: '\u{1F4D6}', sentence: 'Knowledge is power.' },
    { word: 'ADVENTURE', meaning: 'An exciting or daring experience', emoji: '\u{1F3D5}\uFE0F', sentence: 'Life is a great adventure.' },
    { word: 'EXCELLENT', meaning: 'Extremely good, outstanding', emoji: '\u{1F31F}', sentence: 'She did an excellent job.' },
    { word: 'DANGEROUS', meaning: 'Likely to cause harm', emoji: '\u26A0\uFE0F', sentence: 'Swimming alone is dangerous.' },
    { word: 'BEAUTIFUL', meaning: 'Pleasing to the senses', emoji: '\u{1F338}', sentence: 'The sunset is beautiful.' },
    { word: 'TELEPHONE', meaning: 'A device for talking at a distance', emoji: '\u260E\uFE0F', sentence: 'The telephone is ringing.' },
    { word: 'DIFFERENT', meaning: 'Not the same as another', emoji: '\u{1F500}', sentence: 'Everyone is different and special.' },
    { word: 'CELEBRATE', meaning: 'To mark a special occasion', emoji: '\u{1F389}', sentence: 'Let us celebrate our success.' },
    { word: 'CONTINENT', meaning: 'A large area of land', emoji: '\u{1F30D}', sentence: 'Asia is the largest continent.' },
    { word: 'NIGHTMARE', meaning: 'A bad dream', emoji: '\u{1F47B}', sentence: 'I had a nightmare last night.' },
    { word: 'INVISIBLE', meaning: 'Cannot be seen', emoji: '\u{1F47B}', sentence: 'Air is invisible.' },
    { word: 'GYMNASIUM', meaning: 'A place for physical exercise', emoji: '\u{1F3CB}\uFE0F', sentence: 'We exercise in the gymnasium.' },
    { word: 'WRESTLING', meaning: 'A sport of grappling', emoji: '\u{1F93C}', sentence: 'Wrestling is popular in Pakistan.' },
    { word: 'BIOGRAPHY', meaning: 'A written account of a life', emoji: '\u{1F4D5}', sentence: 'I read a biography of Quaid-e-Azam.' },
    { word: 'DEMOCRACY', meaning: 'Government by the people', emoji: '\u{1F5F3}\uFE0F', sentence: 'Democracy gives everyone a voice.' },
    { word: 'MICROPHONE', meaning: 'A device that amplifies sound', emoji: '\u{1F3A4}', sentence: 'Speak into the microphone.' },
    { word: 'TRAMPOLINE', meaning: 'A bouncy surface for jumping', emoji: '\u{1F938}', sentence: 'The children love the trampoline.' },
    { word: 'ENTERPRISE', meaning: 'A bold or difficult project', emoji: '\u{1F680}', sentence: 'Starting a business is an enterprise.' },
    { word: 'ATMOSPHERE', meaning: 'The layer of air around Earth', emoji: '\u{1F30F}', sentence: 'The atmosphere protects us from the sun.' },
    { word: 'ASTRONOMER', meaning: 'A person who studies stars', emoji: '\u{1F52D}', sentence: 'The astronomer used a telescope.' },
    { word: 'TECHNOLOGY', meaning: 'The use of science for practical purposes', emoji: '\u{1F4BB}', sentence: 'Technology changes our lives.' },
    { word: 'PARLIAMENT', meaning: 'The law-making body of a country', emoji: '\u{1F3DB}\uFE0F', sentence: 'Parliament passes new laws.' },
    { word: 'LITERATURE', meaning: 'Written artistic works', emoji: '\u{1F4DA}', sentence: 'She loves English literature.' },
    { word: 'PHENOMENON', meaning: 'An extraordinary event', emoji: '\u{1F31F}', sentence: 'A rainbow is a natural phenomenon.' },
    { word: 'INCREDIBLE', meaning: 'Hard to believe, amazing', emoji: '\u{1F929}', sentence: 'The view was incredible.' },
    { word: 'COMPASSION', meaning: 'Sympathy and concern for others', emoji: '\u{1F49C}', sentence: 'Show compassion to everyone.' },
    { word: 'DISCIPLINE', meaning: 'Training to follow rules', emoji: '\u{1F4CF}', sentence: 'Discipline leads to success.' },
  ],
};

/* ═══════════════════════════════════════
   PROGRESS / STORAGE
═══════════════════════════════════════ */
const PROG_KEY = 'nw_spelling_progress';
function loadProgress() {
  if (typeof window === 'undefined') return { xp: 0, streak: 0, lastDay: null, mastered: {}, review: {}, level: 1 };
  try { const r = localStorage.getItem(PROG_KEY); if (r) return JSON.parse(r); } catch {}
  return { xp: 0, streak: 0, lastDay: null, mastered: {}, review: {}, level: 1 };
}
function saveProgress(d) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(PROG_KEY, JSON.stringify(d)); } catch {}
}

/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function pickWords(grade, n = 10) {
  const pool = WORDS[grade] || WORDS.kg;
  return shuffle(pool).slice(0, n);
}

function generateDistractors(word) {
  const letters = word.split('');
  const all = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const extra = shuffle(all.filter(l => !letters.includes(l))).slice(0, Math.max(4, Math.ceil(word.length * 0.6)));
  return shuffle([...letters, ...extra]);
}

function generateSpeedOptions(correctWord, grade) {
  const pool = WORDS[grade] || WORDS.kg;
  const others = pool.filter(w => w.word !== correctWord).map(w => w.word);
  const wrongOptions = shuffle(others).slice(0, 3);
  // Create misspellings
  const misspell = (w) => {
    const arr = w.split('');
    const i = Math.floor(Math.random() * arr.length);
    const vowels = 'AEIOU';
    const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
    if (vowels.includes(arr[i])) {
      arr[i] = vowels[Math.floor(Math.random() * vowels.length)];
    } else {
      arr[i] = consonants[Math.floor(Math.random() * consonants.length)];
    }
    const result = arr.join('');
    return result === correctWord ? result.slice(0, -1) + 'X' : result;
  };
  const options = [correctWord];
  // Add 1-2 misspellings and 1-2 other words
  if (wrongOptions.length >= 2) {
    options.push(misspell(correctWord), wrongOptions[0], misspell(correctWord));
  } else {
    options.push(misspell(correctWord), misspell(correctWord), misspell(correctWord));
  }
  return shuffle(options.slice(0, 4));
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function SpellingBee() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const T = getTokens(isDark);
  const gate = useProductGate('spelling-bee');
  const [showPaywall, setShowPaywall] = useState(false);

  // --- State ---
  const [grade, setGrade] = useState(null);
  const [mode, setMode] = useState(null);
  const [screen, setScreen] = useState('grade'); // grade | mode | play | results
  const [words, setWords] = useState([]);
  const [wordIdx, setWordIdx] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [available, setAvailable] = useState([]);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [score, setScore] = useState(0);
  const [roundResults, setRoundResults] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [xpAmount, setXpAmount] = useState(10);
  const [hintUsed, setHintUsed] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [progress, setProgress] = useState(null);

  // Speed round state
  const [speedTimer, setSpeedTimer] = useState(30);
  const [speedScore, setSpeedScore] = useState(0);
  const [speedTotal, setSpeedTotal] = useState(0);
  const [speedOptions, setSpeedOptions] = useState([]);
  const [speedFeedback, setSpeedFeedback] = useState(null);
  const [speedRunning, setSpeedRunning] = useState(false);
  const timerRef = useRef(null);
  const speedWordsRef = useRef([]);
  const speedIdxRef = useRef(0);

  // Keyboard ref
  const containerRef = useRef(null);

  // Load progress on mount
  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  // Update streak on mount
  useEffect(() => {
    if (!progress) return;
    const today = new Date().toDateString();
    if (progress.lastDay !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = progress.lastDay === yesterday ? progress.streak + 1 : 1;
      const updated = { ...progress, streak: newStreak, lastDay: today };
      setProgress(updated);
      saveProgress(updated);
    }
  }, [progress?.lastDay]);

  // --- Start game ---
  const startGame = useCallback((g, m) => {
    // Check product gate — block if trial expired or daily rounds used
    if (gate.blocked) { setShowPaywall(true); return; }
    gate.recordRound();
    setGrade(g);
    setMode(m);
    const w = pickWords(g, m === 'speed' ? 30 : 10);
    setWords(w);
    setWordIdx(0);
    setScore(0);
    setRoundResults([]);
    setFeedback(null);
    setShowConfetti(false);
    setShowXP(false);
    setHintUsed(false);
    setShowMeaning(false);

    if (m === 'speed') {
      speedWordsRef.current = w;
      speedIdxRef.current = 0;
      setSpeedTimer(30);
      setSpeedScore(0);
      setSpeedTotal(0);
      setSpeedRunning(true);
      setSpeedFeedback(null);
      const first = w[0];
      setSpeedOptions(generateSpeedOptions(first.word, g));
      setScreen('play');
      return;
    }

    if (m === 'classic' || m === 'picture') {
      const tiles = generateDistractors(w[0].word);
      setAvailable(tiles.map((l, i) => ({ letter: l, id: i, used: false })));
      setPlaced(Array(w[0].word.length).fill(null));
    } else if (m === 'unscramble') {
      const tiles = shuffle(w[0].word.split(''));
      setAvailable(tiles.map((l, i) => ({ letter: l, id: i, used: false })));
      setPlaced([]);
    }
    setScreen('play');

    // TTS for classic
    if (m === 'classic') {
      setTimeout(() => speak(w[0].word, 0.75), 400);
    }
  }, []);

  // Speed round timer
  useEffect(() => {
    if (!speedRunning) return;
    timerRef.current = setInterval(() => {
      setSpeedTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setSpeedRunning(false);
          sndWin();
          setScreen('results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [speedRunning]);

  // --- Setup word for current index ---
  const setupWord = useCallback((idx) => {
    if (idx >= words.length) {
      sndWin();
      setShowConfetti(true);
      setScreen('results');
      return;
    }
    const w = words[idx];
    setWordIdx(idx);
    setFeedback(null);
    setShowConfetti(false);
    setShowXP(false);
    setHintUsed(false);
    setShowMeaning(false);

    if (mode === 'classic' || mode === 'picture') {
      const tiles = generateDistractors(w.word);
      setAvailable(tiles.map((l, i) => ({ letter: l, id: i, used: false })));
      setPlaced(Array(w.word.length).fill(null));
      if (mode === 'classic') {
        setTimeout(() => speak(w.word, 0.75), 400);
      }
    } else if (mode === 'unscramble') {
      const tiles = shuffle(w.word.split(''));
      setAvailable(tiles.map((l, i) => ({ letter: l, id: i, used: false })));
      setPlaced([]);
    }
  }, [words, mode]);

  // --- Letter tap (classic / picture) ---
  const tapLetter = useCallback((tile) => {
    if (feedback) return;
    sndTick();
    if (mode === 'classic' || mode === 'picture') {
      const idx = placed.findIndex(p => p === null);
      if (idx === -1) return;
      const newPlaced = [...placed];
      newPlaced[idx] = tile;
      setPlaced(newPlaced);
      setAvailable(prev => prev.map(t => t.id === tile.id ? { ...t, used: true } : t));

      // Check if all filled
      if (newPlaced.every(p => p !== null)) {
        const attempt = newPlaced.map(p => p.letter).join('');
        checkAnswer(attempt);
      }
    } else if (mode === 'unscramble') {
      const newPlaced = [...placed, tile];
      setPlaced(newPlaced);
      setAvailable(prev => prev.map(t => t.id === tile.id ? { ...t, used: true } : t));

      if (newPlaced.length === words[wordIdx].word.length) {
        const attempt = newPlaced.map(p => p.letter).join('');
        checkAnswer(attempt);
      }
    }
  }, [placed, available, feedback, mode, words, wordIdx]);

  // --- Remove placed letter ---
  const removeLetter = useCallback((idx) => {
    if (feedback) return;
    sndPop();
    if (mode === 'classic' || mode === 'picture') {
      const tile = placed[idx];
      if (!tile) return;
      const newPlaced = [...placed];
      newPlaced[idx] = null;
      setPlaced(newPlaced);
      setAvailable(prev => prev.map(t => t.id === tile.id ? { ...t, used: false } : t));
    } else if (mode === 'unscramble') {
      const tile = placed[idx];
      if (!tile) return;
      const newPlaced = placed.filter((_, i) => i !== idx);
      setPlaced(newPlaced);
      setAvailable(prev => prev.map(t => t.id === tile.id ? { ...t, used: false } : t));
    }
  }, [placed, feedback, mode]);

  // --- Check answer ---
  const checkAnswer = useCallback((attempt) => {
    const correct = words[wordIdx].word;
    const isCorrect = attempt.toUpperCase() === correct.toUpperCase();
    const xp = mode === 'classic' ? 10 : mode === 'picture' ? 10 : mode === 'unscramble' ? 5 : 3;

    if (isCorrect) {
      sndOk();
      setFeedback('correct');
      setShowConfetti(true);
      setShowXP(true);
      setXpAmount(xp);
      setShowMeaning(true);
      setScore(prev => prev + 1);
      setRoundResults(prev => [...prev, { word: correct, correct: true }]);

      // Update progress
      setProgress(prev => {
        const key = correct.toLowerCase();
        const mastered = { ...prev.mastered };
        mastered[key] = (mastered[key] || 0) + 1;
        const review = { ...prev.review };
        if (mastered[key] >= 3) delete review[key];
        const updated = { ...prev, xp: prev.xp + xp, mastered, review, level: Math.floor((prev.xp + xp) / 100) + 1 };
        saveProgress(updated);
        return updated;
      });

      setTimeout(() => {
        setShowConfetti(false);
        setShowXP(false);
        setupWord(wordIdx + 1);
      }, 2200);
    } else {
      sndErr();
      setFeedback('wrong');
      setRoundResults(prev => [...prev, { word: correct, correct: false }]);

      // Add to review
      setProgress(prev => {
        const key = correct.toLowerCase();
        const review = { ...prev.review };
        review[key] = Date.now();
        const updated = { ...prev, review };
        saveProgress(updated);
        return updated;
      });
    }
  }, [words, wordIdx, mode, setupWord]);

  // --- Speed round answer ---
  const speedAnswer = useCallback((option) => {
    if (!speedRunning || speedFeedback) return;
    const currentWord = speedWordsRef.current[speedIdxRef.current];
    const isCorrect = option === currentWord.word;

    if (isCorrect) {
      sndOk();
      setSpeedFeedback('correct');
      setSpeedScore(prev => prev + 1);
    } else {
      sndErr();
      setSpeedFeedback('wrong');
    }
    setSpeedTotal(prev => prev + 1);

    setTimeout(() => {
      setSpeedFeedback(null);
      speedIdxRef.current += 1;
      if (speedIdxRef.current >= speedWordsRef.current.length) {
        speedIdxRef.current = 0;
        speedWordsRef.current = shuffle(speedWordsRef.current);
      }
      const next = speedWordsRef.current[speedIdxRef.current];
      setSpeedOptions(generateSpeedOptions(next.word, grade));
    }, 600);
  }, [speedRunning, speedFeedback, grade]);

  // --- Skip / next after wrong ---
  const nextWord = useCallback(() => {
    setupWord(wordIdx + 1);
  }, [wordIdx, setupWord]);

  // --- Hint: show first letter ---
  const hintFirst = useCallback(() => {
    if (feedback || hintUsed) return;
    setHintUsed(true);
    const w = words[wordIdx];
    if (mode === 'classic' || mode === 'picture') {
      if (placed[0] !== null) return;
      const first = w.word[0];
      const tile = available.find(t => t.letter === first && !t.used);
      if (tile) {
        const newPlaced = [...placed];
        newPlaced[0] = tile;
        setPlaced(newPlaced);
        setAvailable(prev => prev.map(t => t.id === tile.id ? { ...t, used: true } : t));
        sndTick();
      }
    }
  }, [feedback, hintUsed, words, wordIdx, placed, available, mode]);

  // --- Keyboard support ---
  useEffect(() => {
    if (screen !== 'play' || mode === 'speed') return;
    const handler = (e) => {
      if (feedback) return;
      const key = e.key.toUpperCase();
      if (key === 'BACKSPACE') {
        // Remove last placed letter
        if (mode === 'classic' || mode === 'picture') {
          const lastIdx = placed.map((p, i) => p ? i : -1).filter(i => i >= 0).pop();
          if (lastIdx !== undefined && lastIdx >= 0) removeLetter(lastIdx);
        } else if (mode === 'unscramble') {
          if (placed.length > 0) removeLetter(placed.length - 1);
        }
        return;
      }
      if (key.length === 1 && key >= 'A' && key <= 'Z') {
        const tile = available.find(t => t.letter === key && !t.used);
        if (tile) tapLetter(tile);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [screen, mode, feedback, placed, available, tapLetter, removeLetter]);

  // --- Results calculations ---
  const stars = score >= 10 ? 3 : score >= 8 ? 3 : score >= 6 ? 2 : score >= 1 ? 1 : 0;
  const xpEarned = roundResults.filter(r => r.correct).length * (mode === 'classic' ? 10 : mode === 'picture' ? 10 : mode === 'unscramble' ? 5 : 3);
  const masteredWords = roundResults.filter(r => r.correct).map(r => r.word);
  const reviewWords = roundResults.filter(r => !r.correct).map(r => r.word);

  // --- Current word ---
  const currentWord = words[wordIdx] || null;
  const gradeColor = GRADES.find(g => g.id === grade)?.color || T.teal;

  // --- Shareable text ---
  const shareText = () => {
    const txt = `I scored ${mode === 'speed' ? speedScore : score}/${mode === 'speed' ? speedTotal : words.length} on Spelling Bee (${GRADES.find(g => g.id === grade)?.label})! ${'*'.repeat(stars)} NewWorldEdu`;
    if (navigator.share) navigator.share({ text: txt }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(txt);
  };

  /* ═══════════════════════════════════════
     CSS KEYFRAMES
  ═══════════════════════════════════════ */
  const CSS = `
    @keyframes sbConfettiFall{0%{opacity:1;transform:translateY(-20px) rotate(0)}100%{opacity:0;transform:translateY(200px) rotate(720deg)}}
    @keyframes sbFloatUp{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-50px)}}
    @keyframes sbFadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes sbBounceIn{0%{opacity:0;transform:scale(.5)}60%{transform:scale(1.12)}80%{transform:scale(.95)}100%{opacity:1;transform:scale(1)}}
    @keyframes sbPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
    @keyframes sbShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
    @keyframes sbStarPop{0%{opacity:0;transform:scale(0) rotate(-30deg)}60%{transform:scale(1.3) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
    @keyframes sbTimerPulse{0%,100%{color:${T.red}}50%{color:${T.amber}}}
    @keyframes sbGlow{0%,100%{box-shadow:0 0 8px ${gradeColor}40}50%{box-shadow:0 0 20px ${gradeColor}80}}
    *{box-sizing:border-box}
    button:focus{outline:3px solid ${T.teal};outline-offset:2px}
    @media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}}
  `;

  /* ═══════════════════════════════════════
     STYLES
  ═══════════════════════════════════════ */
  const S = {
    page: { minHeight: 'calc(100vh - 52px)', background: T.n0, fontFamily: T.f, color: T.n700, padding: '0 16px 32px', overflowX: 'hidden' },
    wrap: { maxWidth: 520, margin: '0 auto', paddingTop: 16 },
    title: { fontSize: 28, fontWeight: 900, textAlign: 'center', margin: '0 0 4px', letterSpacing: '-0.5px' },
    sub: { fontSize: 13, color: T.n500, textAlign: 'center', margin: '0 0 20px' },
    card: { background: isDark ? T.n50 : T.n0, border: `1px solid ${T.n200}`, borderRadius: 16, padding: 16, marginBottom: 12, cursor: 'pointer', transition: 'all 0.2s' },
    btn: (color, full) => ({
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      padding: '12px 24px', borderRadius: 12, border: 'none', cursor: 'pointer',
      fontFamily: T.f, fontWeight: 700, fontSize: 15,
      background: color || T.teal, color: '#fff',
      width: full ? '100%' : 'auto', minHeight: 48,
      transition: 'all 0.15s',
    }),
    btnOutline: (color) => ({
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      padding: '10px 20px', borderRadius: 12, cursor: 'pointer',
      fontFamily: T.f, fontWeight: 700, fontSize: 14,
      background: 'transparent', color: color || T.teal,
      border: `2px solid ${color || T.teal}`,
      minHeight: 48, transition: 'all 0.15s',
    }),
    tile: (used) => ({
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 48, height: 48, borderRadius: 10, fontWeight: 800, fontSize: 20,
      fontFamily: T.f, cursor: used ? 'default' : 'pointer',
      background: used ? T.n100 : (isDark ? 'rgba(255,255,255,0.1)' : '#F0F4FF'),
      color: used ? T.n300 : T.n700,
      border: `2px solid ${used ? T.n200 : T.teal}`,
      transition: 'all 0.15s',
      opacity: used ? 0.4 : 1,
      userSelect: 'none',
    }),
    slot: (filled, correct, wrong) => ({
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 48, height: 48, borderRadius: 10, fontWeight: 800, fontSize: 22,
      fontFamily: T.f, cursor: filled ? 'pointer' : 'default',
      background: correct ? T.greenL : wrong ? T.redL : (isDark ? 'rgba(255,255,255,0.04)' : '#FAFBFF'),
      color: correct ? T.green : wrong ? T.red : T.n700,
      border: `2px dashed ${correct ? T.green : wrong ? T.red : T.n300}`,
      transition: 'all 0.15s',
      minWidth: 48,
    }),
    progressBar: { width: '100%', height: 6, borderRadius: 3, background: T.n100, marginBottom: 16, overflow: 'hidden' },
    progressFill: (pct) => ({ width: pct + '%', height: '100%', borderRadius: 3, background: gradeColor, transition: 'width 0.4s ease' }),
  };

  /* ═══════════════════════════════════════
     RENDER: GRADE SELECTOR
  ═══════════════════════════════════════ */
  const renderGradeSelector = () => (
    <div style={{ animation: 'sbFadeUp 0.4s ease' }}>
      <div style={{ textAlign: 'center', fontSize: 48, marginBottom: 8 }}>{'\u{1F41D}'}</div>
      <h1 style={S.title}>Spelling Bee</h1>
      <p style={S.sub}>Choose your grade to start</p>

      {/* Stats bar */}
      {progress && (
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap',
        }}>
          {[
            { label: 'XP', value: progress.xp, icon: '\u26A1' },
            { label: 'Level', value: progress.level, icon: '\u{1F31F}' },
            { label: 'Streak', value: progress.streak + 'd', icon: '\u{1F525}' },
            { label: 'Mastered', value: Object.keys(progress.mastered).filter(k => progress.mastered[k] >= 3).length, icon: '\u2705' },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '8px 14px', borderRadius: 10,
              background: isDark ? T.n100 : T.n50, minWidth: 64,
            }}>
              <div style={{ fontSize: 18 }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: T.n700 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: T.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gap: 10 }}>
        {GRADES.map(g => (
          <button
            key={g.id}
            aria-label={`Select ${g.label}`}
            onClick={() => { sndTick(); setGrade(g.id); setScreen('mode'); }}
            style={{
              ...S.card,
              display: 'flex', alignItems: 'center', gap: 14,
              borderLeft: `4px solid ${g.color}`,
              background: isDark ? T.n50 : '#fff',
            }}
          >
            <span style={{ fontSize: 28 }}>{g.emoji}</span>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: T.n700 }}>{g.label}</div>
              <div style={{ fontSize: 12, color: T.n400 }}>Ages {g.age}</div>
            </div>
            <span style={{ fontSize: 20, color: T.n300 }}>{'\u203A'}</span>
          </button>
        ))}
      </div>
    </div>
  );

  /* ═══════════════════════════════════════
     RENDER: MODE SELECTOR
  ═══════════════════════════════════════ */
  const renderModeSelector = () => (
    <div style={{ animation: 'sbFadeUp 0.4s ease' }}>
      <button
        onClick={() => { sndPop(); setScreen('grade'); }}
        style={{ ...S.btnOutline(T.n400), marginBottom: 16, padding: '8px 16px', fontSize: 13, border: `1px solid ${T.n200}`, background: isDark ? T.n100 : T.n50 }}
        aria-label="Back to grade selection"
      >
        {'\u2190'} Back
      </button>
      <h2 style={{ ...S.title, fontSize: 22 }}>
        {GRADES.find(g => g.id === grade)?.emoji} {GRADES.find(g => g.id === grade)?.label}
      </h2>
      <p style={S.sub}>Pick a game mode</p>

      <div style={{ display: 'grid', gap: 12 }}>
        {MODES.map(m => (
          <button
            key={m.id}
            aria-label={`Play ${m.label} mode`}
            onClick={() => { sndTick(); startGame(grade, m.id); }}
            style={{
              ...S.card,
              display: 'flex', alignItems: 'center', gap: 14,
              borderLeft: `4px solid ${gradeColor}`,
              background: isDark ? T.n50 : '#fff',
            }}
          >
            <span style={{ fontSize: 32 }}>{m.emoji}</span>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: T.n700 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: T.n400 }}>{m.desc}</div>
            </div>
            <span style={{ fontSize: 20, color: T.n300 }}>{'\u203A'}</span>
          </button>
        ))}
      </div>
    </div>
  );

  /* ═══════════════════════════════════════
     RENDER: CLASSIC / PICTURE MODE
  ═══════════════════════════════════════ */
  const renderClassicOrPicture = () => {
    if (!currentWord) return null;
    const isPicture = mode === 'picture';
    const pct = ((wordIdx) / words.length) * 100;

    return (
      <div style={{ animation: 'sbFadeUp 0.3s ease', position: 'relative' }} ref={containerRef}>
        {showConfetti && <Confetti />}
        {showXP && <FloatingXP amount={xpAmount} />}

        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <button
            onClick={() => { sndPop(); setScreen('mode'); setFeedback(null); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: T.n400, padding: 4, minWidth: 48, minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Back to mode selection"
          >
            {'\u2190'}
          </button>
          <div style={{ flex: 1 }}>
            <div style={S.progressBar}>
              <div style={S.progressFill(pct)} />
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.n400, minWidth: 40, textAlign: 'right' }}>
            {wordIdx + 1}/{words.length}
          </span>
        </div>

        {/* Word prompt area */}
        <div style={{
          textAlign: 'center', padding: '20px 16px', marginBottom: 16,
          background: isDark ? T.n100 : T.n50, borderRadius: 16,
          position: 'relative',
        }}>
          {isPicture && (
            <div style={{ fontSize: 64, marginBottom: 8, lineHeight: 1 }}>{currentWord.emoji}</div>
          )}

          {!isPicture && (
            <>
              <div style={{ fontSize: 13, color: T.n400, marginBottom: 8, fontWeight: 600 }}>
                {'\u{1F50A}'} Listen and spell the word
              </div>
              <button
                onClick={() => speak(currentWord.word, 0.75)}
                style={{
                  ...S.btn(gradeColor),
                  fontSize: 18, padding: '14px 32px',
                  animation: 'sbGlow 2s ease-in-out infinite',
                }}
                aria-label="Hear the word again"
              >
                {'\u{1F50A}'} Hear Word
              </button>
            </>
          )}

          {isPicture && (
            <div style={{ fontSize: 13, color: T.n400, fontWeight: 600 }}>
              Spell what you see!
            </div>
          )}
        </div>

        {/* Letter count hint */}
        <div style={{ textAlign: 'center', marginBottom: 12, fontSize: 12, color: T.n400, fontWeight: 600 }}>
          {currentWord.word.length} letters
        </div>

        {/* Answer slots */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap',
        }}>
          {placed.map((p, i) => (
            <button
              key={i}
              onClick={() => p && removeLetter(i)}
              aria-label={p ? `Remove letter ${p.letter} from position ${i + 1}` : `Empty slot ${i + 1}`}
              style={{
                ...S.slot(
                  !!p,
                  feedback === 'correct',
                  feedback === 'wrong',
                ),
                animation: feedback === 'correct' ? 'sbBounceIn 0.4s ease' : feedback === 'wrong' ? 'sbShake 0.4s ease' : 'none',
              }}
            >
              {p ? p.letter : ''}
            </button>
          ))}
        </div>

        {/* Hint buttons */}
        {!feedback && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
            {!isPicture && (
              <button
                onClick={() => speak(currentWord.word, 0.65)}
                style={S.btnOutline(T.n400)}
                aria-label="Hear word again slowly"
              >
                {'\u{1F50A}'} Slow
              </button>
            )}
            <button
              onClick={hintFirst}
              disabled={hintUsed}
              style={{
                ...S.btnOutline(hintUsed ? T.n300 : T.amber),
                opacity: hintUsed ? 0.5 : 1,
              }}
              aria-label="Hint: reveal first letter"
            >
              {'\u{1F4A1}'} First Letter
            </button>
          </div>
        )}

        {/* Meaning (shown on correct) */}
        {showMeaning && feedback === 'correct' && (
          <div style={{
            textAlign: 'center', padding: 14, marginBottom: 16,
            background: T.greenL, borderRadius: 12, animation: 'sbFadeUp 0.3s ease',
          }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: T.green, marginBottom: 4 }}>
              {'\u2705'} {currentWord.word}
            </div>
            <div style={{ fontSize: 13, color: T.n600 }}>{currentWord.meaning}</div>
            <div style={{ fontSize: 12, color: T.n400, marginTop: 4, fontStyle: 'italic' }}>
              "{currentWord.sentence}"
            </div>
          </div>
        )}

        {/* Wrong feedback */}
        {feedback === 'wrong' && (
          <div style={{
            textAlign: 'center', padding: 14, marginBottom: 16,
            background: T.redL, borderRadius: 12, animation: 'sbFadeUp 0.3s ease',
          }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: T.red, marginBottom: 4 }}>
              Almost! The word is: {currentWord.word}
            </div>
            <div style={{ fontSize: 13, color: T.n600 }}>{currentWord.meaning}</div>
            <button
              onClick={nextWord}
              style={{ ...S.btn(gradeColor), marginTop: 12 }}
              aria-label="Next word"
            >
              Next Word {'\u2192'}
            </button>
          </div>
        )}

        {/* Letter tiles */}
        {!feedback && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, padding: '0 8px',
          }}>
            {available.map(tile => (
              <button
                key={tile.id}
                onClick={() => !tile.used && tapLetter(tile)}
                disabled={tile.used}
                aria-label={`Letter ${tile.letter}`}
                style={S.tile(tile.used)}
              >
                {tile.letter}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ═══════════════════════════════════════
     RENDER: UNSCRAMBLE MODE
  ═══════════════════════════════════════ */
  const renderUnscramble = () => {
    if (!currentWord) return null;
    const pct = ((wordIdx) / words.length) * 100;

    return (
      <div style={{ animation: 'sbFadeUp 0.3s ease', position: 'relative' }}>
        {showConfetti && <Confetti />}
        {showXP && <FloatingXP amount={xpAmount} />}

        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <button
            onClick={() => { sndPop(); setScreen('mode'); setFeedback(null); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: T.n400, padding: 4, minWidth: 48, minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Back to mode selection"
          >
            {'\u2190'}
          </button>
          <div style={{ flex: 1 }}>
            <div style={S.progressBar}>
              <div style={S.progressFill(pct)} />
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.n400, minWidth: 40, textAlign: 'right' }}>
            {wordIdx + 1}/{words.length}
          </span>
        </div>

        {/* Emoji hint */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 48 }}>{currentWord.emoji}</span>
          <div style={{ fontSize: 13, color: T.n400, fontWeight: 600, marginTop: 4 }}>
            Unscramble the letters!
          </div>
        </div>

        {/* Answer zone */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20, minHeight: 56, flexWrap: 'wrap',
          padding: 12, borderRadius: 14, border: `2px dashed ${feedback === 'correct' ? T.green : feedback === 'wrong' ? T.red : T.n300}`,
          background: feedback === 'correct' ? T.greenL : feedback === 'wrong' ? T.redL : 'transparent',
          animation: feedback === 'correct' ? 'sbBounceIn 0.4s ease' : feedback === 'wrong' ? 'sbShake 0.4s ease' : 'none',
        }}>
          {placed.length === 0 && (
            <span style={{ color: T.n300, fontSize: 14, fontWeight: 600, alignSelf: 'center' }}>Tap letters in order</span>
          )}
          {placed.map((tile, i) => (
            <button
              key={tile.id}
              onClick={() => removeLetter(i)}
              aria-label={`Remove letter ${tile.letter}`}
              style={{
                ...S.tile(false),
                background: gradeColor,
                color: '#fff',
                borderColor: gradeColor,
              }}
            >
              {tile.letter}
            </button>
          ))}
        </div>

        {/* Meaning (shown on correct) */}
        {showMeaning && feedback === 'correct' && (
          <div style={{
            textAlign: 'center', padding: 14, marginBottom: 16,
            background: T.greenL, borderRadius: 12, animation: 'sbFadeUp 0.3s ease',
          }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: T.green, marginBottom: 4 }}>
              {'\u2705'} {currentWord.word}
            </div>
            <div style={{ fontSize: 13, color: T.n600 }}>{currentWord.meaning}</div>
          </div>
        )}

        {/* Wrong feedback */}
        {feedback === 'wrong' && (
          <div style={{
            textAlign: 'center', padding: 14, marginBottom: 16,
            background: T.redL, borderRadius: 12, animation: 'sbFadeUp 0.3s ease',
          }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: T.red, marginBottom: 4 }}>
              Almost! The word is: {currentWord.word}
            </div>
            <button
              onClick={nextWord}
              style={{ ...S.btn(gradeColor), marginTop: 12 }}
              aria-label="Next word"
            >
              Next Word {'\u2192'}
            </button>
          </div>
        )}

        {/* Available tiles */}
        {!feedback && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10,
          }}>
            {available.map(tile => (
              <button
                key={tile.id}
                onClick={() => !tile.used && tapLetter(tile)}
                disabled={tile.used}
                aria-label={`Letter ${tile.letter}`}
                style={{
                  ...S.tile(tile.used),
                  width: 54, height: 54, fontSize: 22,
                }}
              >
                {tile.letter}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ═══════════════════════════════════════
     RENDER: SPEED ROUND
  ═══════════════════════════════════════ */
  const renderSpeedRound = () => {
    const currentSpeedWord = speedWordsRef.current[speedIdxRef.current];
    if (!currentSpeedWord) return null;

    return (
      <div style={{ animation: 'sbFadeUp 0.3s ease', position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button
            onClick={() => { clearInterval(timerRef.current); setSpeedRunning(false); setScreen('mode'); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: T.n400, padding: 4, minWidth: 48, minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Quit speed round"
          >
            {'\u2715'}
          </button>
          <div style={{
            fontSize: 32, fontWeight: 900, color: speedTimer <= 10 ? T.red : T.n700,
            animation: speedTimer <= 10 ? 'sbTimerPulse 0.5s ease infinite' : 'none',
            fontFamily: T.f,
          }}>
            {speedTimer}s
          </div>
          <div style={{
            fontSize: 18, fontWeight: 800, color: T.green,
            background: T.greenL, padding: '6px 14px', borderRadius: 10,
          }}>
            {speedScore}
          </div>
        </div>

        {/* Word + emoji */}
        <div style={{
          textAlign: 'center', padding: '28px 16px', marginBottom: 20,
          background: isDark ? T.n100 : T.n50, borderRadius: 16,
        }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{currentSpeedWord.emoji}</div>
          <div style={{ fontSize: 14, color: T.n500, fontWeight: 600 }}>
            {currentSpeedWord.meaning}
          </div>
        </div>

        {/* Options (MCQ) */}
        <div style={{ display: 'grid', gap: 10 }}>
          {speedOptions.map((opt, i) => {
            const isCorrect = speedFeedback && opt === speedWordsRef.current[speedIdxRef.current]?.word;
            const isWrong = speedFeedback === 'wrong' && opt !== speedWordsRef.current[speedIdxRef.current]?.word;
            return (
              <button
                key={i}
                onClick={() => speedAnswer(opt)}
                disabled={!!speedFeedback}
                aria-label={`Option: ${opt}`}
                style={{
                  ...S.card,
                  textAlign: 'center', fontWeight: 800, fontSize: 18,
                  letterSpacing: 2,
                  borderColor: isCorrect ? T.green : speedFeedback === 'wrong' && opt === speedWordsRef.current[speedIdxRef.current]?.word ? T.green : 'transparent',
                  background: isCorrect ? T.greenL : (speedFeedback && opt !== speedWordsRef.current[speedIdxRef.current]?.word) ? (isDark ? T.n50 : '#fff') : isDark ? T.n50 : '#fff',
                  color: isCorrect ? T.green : T.n700,
                  padding: '16px 20px',
                  border: `2px solid ${isCorrect ? T.green : T.n200}`,
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════
     RENDER: RESULTS SCREEN
  ═══════════════════════════════════════ */
  const renderResults = () => {
    const isSpeed = mode === 'speed';
    const finalScore = isSpeed ? speedScore : score;
    const total = isSpeed ? speedTotal : words.length;
    const speedStars = isSpeed ? (speedScore >= 15 ? 3 : speedScore >= 10 ? 2 : speedScore >= 5 ? 1 : 0) : stars;
    const finalXP = isSpeed ? speedScore * 3 : xpEarned;

    return (
      <div style={{ animation: 'sbFadeUp 0.4s ease', textAlign: 'center', position: 'relative' }}>
        {showConfetti && <Confetti />}

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{'\u{1F41D}'}</div>
          <h2 style={{ ...S.title, fontSize: 24, marginBottom: 8 }}>
            {finalScore >= total * 0.8 ? 'Amazing!' : finalScore >= total * 0.5 ? 'Good effort!' : 'Keep practicing!'}
          </h2>
        </div>

        {/* Stars */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
          {[1, 2, 3].map(s => (
            <span key={s} style={{
              fontSize: 44,
              opacity: s <= speedStars ? 1 : 0.2,
              animation: s <= speedStars ? `sbStarPop 0.5s ${s * 0.2}s ease both` : 'none',
              filter: s <= speedStars ? 'none' : 'grayscale(1)',
            }}>
              {'\u2B50'}
            </span>
          ))}
        </div>

        {/* Score card */}
        <div style={{
          ...S.card, padding: 20, marginBottom: 16,
          borderLeft: `4px solid ${gradeColor}`,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900, color: T.n700 }}>{finalScore}/{total}</div>
              <div style={{ fontSize: 12, color: T.n400, fontWeight: 600 }}>CORRECT</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900, color: T.amber }}>+{finalXP}</div>
              <div style={{ fontSize: 12, color: T.n400, fontWeight: 600 }}>XP EARNED</div>
            </div>
          </div>
        </div>

        {/* Words breakdown (not for speed) */}
        {!isSpeed && roundResults.length > 0 && (
          <div style={{ ...S.card, padding: 16, textAlign: 'left', marginBottom: 16 }}>
            {masteredWords.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.green, marginBottom: 6, textTransform: 'uppercase' }}>
                  {'\u2705'} Mastered ({masteredWords.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {masteredWords.map((w, i) => (
                    <span key={i} style={{
                      padding: '4px 10px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                      background: T.greenL, color: T.green,
                    }}>
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {reviewWords.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.amber, marginBottom: 6, textTransform: 'uppercase' }}>
                  {'\u{1F504}'} To Review ({reviewWords.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {reviewWords.map((w, i) => (
                    <span key={i} style={{
                      padding: '4px 10px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                      background: T.amberL, color: T.amberD,
                    }}>
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => startGame(grade, mode)}
            style={S.btn(gradeColor, true)}
            aria-label="Play again"
          >
            {'\u{1F504}'} Play Again
          </button>
          <button
            onClick={() => { setScreen('mode'); }}
            style={S.btnOutline(T.n400)}
            aria-label="Change game mode"
          >
            Change Mode
          </button>
          <button
            onClick={() => { setScreen('grade'); setGrade(null); setMode(null); }}
            style={S.btnOutline(T.n400)}
            aria-label="Change grade"
          >
            Change Grade
          </button>
          <button
            onClick={shareText}
            style={S.btnOutline(gradeColor)}
            aria-label="Share your score"
          >
            {'\u{1F4E4}'} Share Score
          </button>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════
     RENDER: MAIN
  ═══════════════════════════════════════ */
  return (
    <>
      <Head>
        <title>Spelling Bee — NewWorldEdu</title>
        <meta name="description" content="World-class spelling bee game for KG to Grade 6. Classic, unscramble, picture spell, and speed round modes. Practice spelling with fun!" />
        <meta property="og:title" content="Spelling Bee — NewWorldEdu" />
        <meta property="og:description" content="Interactive spelling game for children. 4 game modes, 7 grades, 210+ words." />
      </Head>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div style={S.page}>
        {showPaywall && <ProductPaywall gate={gate} onClose={() => setShowPaywall(false)} T={T} />}
        <div style={S.wrap}>
          {/* Trial/subscription badge */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <ProductTrialBadge gate={gate} T={T} />
          </div>
          {screen === 'grade' && renderGradeSelector()}
          {screen === 'mode' && renderModeSelector()}
          {screen === 'play' && mode === 'classic' && renderClassicOrPicture()}
          {screen === 'play' && mode === 'picture' && renderClassicOrPicture()}
          {screen === 'play' && mode === 'unscramble' && renderUnscramble()}
          {screen === 'play' && mode === 'speed' && renderSpeedRound()}
          {screen === 'results' && renderResults()}
        </div>
      </div>
    </>
  );
}
