// pages/special-needs.jsx
// ═══════════════════════════════════════════════════════════════════════
// STARKY FOR SPECIAL NEEDS — CONDITION × AGE MATRIX
//
// THE INSIGHT: A 5-year-old with autism learning phonics needs completely
// different support from a 15-year-old with autism preparing for GCSEs.
// Condition alone is not enough. Age/stage changes everything.
//
// SOLUTION: 3-step selector → condition × stage × focus
// Creates 7 × 4 × 5 = 140 distinct teaching profiles
// ═══════════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useSessionLimit } from "../utils/useSessionLimit";
import { getFullSENKnowledge } from "../utils/senKnowledge";
import LegalFooter from "../components/LegalFooter";
// Special-needs page uses the FULL knowledge base since it's the dedicated SEN section
const addKnowledgeToPrompt = (prompt) => prompt + "\n\n" + getFullSENKnowledge();

// ═══════════════════════════════════════════════════════════════════════
// AUDIO ENGINE — Web Audio API (adapted from languages.jsx)
// ═══════════════════════════════════════════════════════════════════════
let _senCtx = null;
function gSenCtx() { if (!_senCtx) try { _senCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} return _senCtx; }
function senTone(f, t, v, d, dl) {
  const c = gSenCtx(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain();
  o.connect(g); g.connect(c.destination); o.type = t || 'sine'; o.frequency.value = f;
  const ts = c.currentTime + (dl || 0);
  g.gain.setValueAtTime(0, ts); g.gain.linearRampToValueAtTime(v || 0.2, ts + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, ts + d);
  o.start(ts); o.stop(ts + d + 0.05);
}
function sndOk()   { senTone(523, 'sine', 0.22, 0.32, 0); senTone(659, 'sine', 0.22, 0.32, 0.16); }
function sndErr()  { senTone(220, 'sawtooth', 0.18, 0.28, 0); }
function sndWin()  { senTone(523, 'sine', 0.25, 0.5, 0); senTone(659, 'sine', 0.25, 0.45, 0.15); senTone(784, 'sine', 0.25, 0.45, 0.3); }
function sndTick() { senTone(900, 'sine', 0.06, 0.07, 0); }
function sndPop()  { senTone(1100, 'sine', 0.1, 0.12, 0); }

// ═══════════════════════════════════════════════════════════════════════
// XP / STREAK TRACKING — localStorage key: nw_sen_xp
// ═══════════════════════════════════════════════════════════════════════
const XP_KEY = "nw_sen_xp";
function loadXP() {
  if (typeof window === "undefined") return { xp: 0, sessions: 0, streak: 0, lastDay: null, correctStreak: 0 };
  try { const raw = localStorage.getItem(XP_KEY); if (raw) return JSON.parse(raw); } catch {}
  return { xp: 0, sessions: 0, streak: 0, lastDay: null, correctStreak: 0 };
}
function saveXP(data) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(XP_KEY, JSON.stringify(data)); } catch {}
}
function recordSessionXP(xpData) {
  const today = new Date().toISOString().split("T")[0];
  const updated = { ...xpData };
  updated.xp += 50; // session XP
  updated.sessions += 1;
  if (updated.lastDay === today) {
    // same day, no streak change
  } else if (updated.lastDay) {
    const last = new Date(updated.lastDay);
    const now = new Date(today);
    const diff = Math.floor((now - last) / 86400000);
    updated.streak = diff === 1 ? updated.streak + 1 : 1;
  } else {
    updated.streak = 1;
  }
  updated.lastDay = today;
  saveXP(updated);
  return updated;
}
function addCorrectXP(xpData) {
  const updated = { ...xpData, xp: xpData.xp + 10, correctStreak: (xpData.correctStreak || 0) + 1 };
  saveXP(updated);
  return updated;
}
function resetCorrectStreak(xpData) {
  const updated = { ...xpData, correctStreak: 0 };
  saveXP(updated);
  return updated;
}

// ═══════════════════════════════════════════════════════════════════════
// CONFETTI ANIMATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════
function SENConfetti() {
  const cols = ['#C77DFF', '#63D2FF', '#FFC300', '#A8E063', '#FF8C69', '#FF6B9D', '#F4A261'];
  const pieces = [];
  for (let i = 0; i < 24; i++) {
    const c = cols[i % cols.length], x = Math.random() * 100, r = Math.random() * 360;
    const dur = (0.8 + Math.random() * 0.8) + 's';
    const delay = (Math.random() * 0.4) + 's';
    pieces.push(
      <div key={i} style={{
        position: 'absolute', width: 10, height: 10, borderRadius: 3,
        left: x + '%', top: 10, background: c,
        animation: `senConfettiFall ${dur} ${delay} ease-in forwards`,
        opacity: 0, transform: `rotate(${r}deg)`,
      }} />
    );
  }
  return <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 100 }}>{pieces}</div>;
}

// ═══════════════════════════════════════════════════════════════════════
// FLOATING XP INDICATOR
// ═══════════════════════════════════════════════════════════════════════
function FloatingXP({ amount }) {
  return (
    <div style={{
      position: 'absolute', top: -10, right: 10,
      color: '#A8E063', fontWeight: 900, fontSize: 18,
      fontFamily: "'Nunito',sans-serif",
      animation: 'senFloatUp 1.2s ease-out forwards',
      pointerEvents: 'none', zIndex: 101,
    }}>
      +{amount} XP
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// HARDCODED SEN EXERCISES — per condition + stage
// Instant, no API call. SEN-appropriate: simpler, visual, large targets.
// ═══════════════════════════════════════════════════════════════════════
const SEN_EXERCISES = {
  // ── AUTISM ──
  autism_early: {
    match: [
      { pairs: [["Happy 😊", "Feeling good"], ["Sad 😢", "Feeling upset"], ["Angry 😠", "Feeling cross"], ["Scared 😨", "Feeling afraid"]] },
      { pairs: [["Red 🔴", "Apple colour"], ["Blue 🔵", "Sky colour"], ["Green 🟢", "Grass colour"], ["Yellow 🟡", "Sun colour"]] },
      { pairs: [["Cat 🐱", "Says meow"], ["Dog 🐶", "Says woof"], ["Cow 🐄", "Says moo"], ["Duck 🦆", "Says quack"]] },
      // Early Literacy
      { pairs: [["P ✏️", "Pen starts with P"], ["M 🥛", "Milk starts with M"], ["S ☀️", "Sun starts with S"], ["T 🌳", "Tree starts with T"]] },
      // Early Numeracy
      { pairs: [["1 🍎", "One apple"], ["2 🍌", "Two bananas"], ["3 🍊", "Three oranges"], ["4 🍇", "Four grapes"]] },
      // Nazra Quran
      { pairs: [["Alif ا", "First letter"], ["Ba ب", "Second letter"], ["Ta ت", "Third letter"], ["Tha ث", "Fourth letter"]] },
      // Communication
      { pairs: [["Please", "When you want something"], ["Thank you", "When someone helps you"], ["Sorry", "When you make a mistake"], ["Hello", "When you meet someone"]] },
    ],
    fill: [
      { sentence: "The cat says ___.", options: ["meow", "woof", "moo", "quack"], answer: "meow" },
      { sentence: "The sky is ___.", options: ["blue", "green", "red", "purple"], answer: "blue" },
      { sentence: "We eat with our ___.", options: ["mouth", "ears", "feet", "eyes"], answer: "mouth" },
      // Early Literacy
      { sentence: "The word 'mango' starts with ___.", options: ["M", "N", "B", "D"], answer: "M" },
      { sentence: "A book has a front ___ and a back.", options: ["cover", "wheel", "leg", "hat"], answer: "cover" },
      // Early Numeracy
      { sentence: "2 + 1 = ___.", options: ["2", "3", "4", "5"], answer: "3" },
      { sentence: "A square has ___ sides.", options: ["2", "3", "4", "5"], answer: "4" },
      // Nazra Quran
      { sentence: "The first letter of the Arabic alphabet is ___.", options: ["Ba", "Alif", "Ta", "Jim"], answer: "Alif" },
      // Communication
      { sentence: "When someone gives you a gift, you say ___.", options: ["sorry", "thank you", "goodbye", "help"], answer: "thank you" },
    ],
    truefalse: [
      { statement: "Fish can fly in the sky.", answer: false },
      { statement: "We sleep at night.", answer: true },
      { statement: "Ice cream is hot.", answer: false },
      // Early Literacy
      { statement: "The letter A comes before B.", answer: true },
      { statement: "The word 'ball' starts with D.", answer: false },
      // Early Numeracy
      { statement: "5 is more than 3.", answer: true },
      { statement: "A circle has corners.", answer: false },
      // Nazra Quran
      { statement: "The Arabic alphabet has 28 letters.", answer: true },
      // Communication
      { statement: "We say 'Assalam-o-Alaikum' to greet people.", answer: true },
    ],
    picture: [
      { scene: "Imagine you are at the park. You see a big red slide and a swing. What would you play on first?", prompt: "Tell me what you would do at the park!" },
      { scene: "You walk into a room and see a birthday cake with candles. What happens next?", prompt: "What do you do when you see the cake?" },
      { scene: "A friendly puppy comes up to you wagging its tail. How does the puppy feel?", prompt: "How is the puppy feeling?" },
      // Early Literacy
      { scene: "You have a book about animals. You open the first page and see a picture of a lion. What sound does the letter L make?", prompt: "Say the sound of L!" },
      // Early Numeracy
      { scene: "You have 2 red balls and 1 blue ball. How many balls do you have in total?", prompt: "Count all the balls!" },
      // Communication
      { scene: "Your friend shares their lunch with you. What words should you say to your friend?", prompt: "What do you say?" },
    ],
  },
  autism_primary: {
    match: [
      { pairs: [["Synonym", "Same meaning"], ["Antonym", "Opposite meaning"], ["Noun", "Person, place, thing"], ["Verb", "Action word"]] },
      { pairs: [["Addition +", "Putting together"], ["Subtraction -", "Taking away"], ["Multiply x", "Groups of"], ["Divide /", "Sharing equally"]] },
      { pairs: [["Solid", "Keeps its shape"], ["Liquid", "Takes shape of container"], ["Gas", "Fills all space"], ["Melting", "Solid becomes liquid"]] },
      // Maths
      { pairs: [["Perimeter", "Distance around a shape"], ["Area", "Space inside a shape"], ["Fraction", "Part of a whole"], ["Decimal", "Number with a dot"]] },
      { pairs: [["x4", "4 times table"], ["x6", "6 times table"], ["x8", "8 times table"], ["x9", "9 times table"]] },
      // English
      { pairs: [["Pronoun", "Replaces a noun (he, she, it)"], ["Conjunction", "Joins words (and, but, or)"], ["Preposition", "Shows position (in, on, at)"], ["Article", "A, an, the"]] },
      // Urdu
      { pairs: [["اسم", "Noun — naming word"], ["فعل", "Verb — action word"], ["صفت", "Adjective — describing word"], ["حرف", "Preposition — joining word"]] },
    ],
    fill: [
      { sentence: "5 + 3 = ___.", options: ["7", "8", "9", "6"], answer: "8" },
      { sentence: "A group of fish is called a ___.", options: ["school", "pack", "flock", "herd"], answer: "school" },
      { sentence: "Water freezes at ___ degrees Celsius.", options: ["0", "10", "50", "100"], answer: "0" },
      // Maths
      { sentence: "6 x 7 = ___.", options: ["36", "42", "48", "54"], answer: "42" },
      { sentence: "Half of 50 is ___.", options: ["20", "25", "30", "35"], answer: "25" },
      // English
      { sentence: "The children ___ playing in the park.", options: ["is", "are", "was", "am"], answer: "are" },
      { sentence: "A sentence always ends with a ___.", options: ["full stop", "comma", "colon", "dash"], answer: "full stop" },
      // Science
      { sentence: "The three states of matter are solid, liquid, and ___.", options: ["gas", "metal", "wood", "light"], answer: "gas" },
      // Urdu
      { sentence: "Pakistan ka qoumi phool ___ hai.", options: ["gulab", "chameli", "sunflower", "lily"], answer: "chameli" },
      // Islamiat
      { sentence: "Muslims pray ___ times a day.", options: ["3", "4", "5", "6"], answer: "5" },
      // Pakistan Studies
      { sentence: "The capital of Pakistan is ___.", options: ["Karachi", "Lahore", "Islamabad", "Peshawar"], answer: "Islamabad" },
    ],
    truefalse: [
      { statement: "The Earth goes around the Sun.", answer: true },
      { statement: "Spiders have 6 legs.", answer: false },
      { statement: "There are 7 days in a week.", answer: true },
      // Maths
      { statement: "A square has equal sides.", answer: true },
      { statement: "9 x 9 = 82.", answer: false },
      // English
      { statement: "'An' is used before words starting with a vowel sound.", answer: true },
      { statement: "A proper noun does not need a capital letter.", answer: false },
      // Science
      { statement: "Plants need sunlight, water, and soil to grow.", answer: true },
      // Islamiat
      { statement: "The first month of the Islamic calendar is Muharram.", answer: true },
      // Pakistan Studies
      { statement: "Pakistan has four provinces.", answer: true },
    ],
    picture: [
      { scene: "You are a scientist looking at a plant. It has droopy leaves and dry soil. What does it need?", prompt: "What would you give the plant?" },
      { scene: "You are in a shop and want to buy something that costs 50p. You have a pound coin. How much change?", prompt: "Work out the change!" },
      { scene: "Your friend looks sad at break time and is sitting alone. What could you do?", prompt: "How would you help your friend?" },
      // Maths
      { scene: "A cricket pitch is 22 yards long. If a player runs from one end to the other and back, how many yards did they run?", prompt: "Calculate the total distance!" },
      // English
      { scene: "Write a sentence using a noun, a verb, and an adjective about your school.", prompt: "Build a sentence with 3 parts!" },
      // Science
      { scene: "You plant a seed in soil, water it, and put it by the window. After 2 weeks, a small green shoot appears. What did the plant need to grow?", prompt: "What helped the plant grow?" },
    ],
  },
  // ── ADHD ──
  adhd_early: {
    match: [
      { pairs: [["1 🥇", "One"], ["2 🥈", "Two"], ["3 🥉", "Three"], ["4 🏅", "Four"]] },
      { pairs: [["Circle ⭕", "Round shape"], ["Square ⬜", "Four equal sides"], ["Triangle 🔺", "Three sides"], ["Star ⭐", "Five points"]] },
      { pairs: [["Morning 🌅", "Wake up time"], ["Afternoon ☀️", "Lunch time"], ["Evening 🌇", "Dinner time"], ["Night 🌙", "Sleep time"]] },
      // Early Literacy
      { pairs: [["E 🥚", "Egg starts with E"], ["F 🐸", "Frog starts with F"], ["G 🍇", "Grapes start with G"], ["H 🏠", "House starts with H"]] },
      // Early Numeracy
      { pairs: [["5 🖐️", "Five fingers"], ["6 🎲", "Six on a dice"], ["7 🌈", "Rainbow colours"], ["8 🐙", "Octopus legs"]] },
      // Nazra Quran
      { pairs: [["Alif ا", "Stands tall like a stick"], ["Ba ب", "Has one dot below"], ["Jim ج", "Has one dot below too"], ["Dal د", "Looks like a slide"]] },
      // Communication
      { pairs: [["Smile 😊", "You are happy"], ["Frown 😞", "You are upset"], ["Thumbs up 👍", "Good job!"], ["Wave 👋", "Hello or bye!"]] },
    ],
    fill: [
      { sentence: "After 2 comes ___.", options: ["1", "3", "4", "5"], answer: "3" },
      { sentence: "A triangle has ___ sides.", options: ["2", "3", "4", "5"], answer: "3" },
      { sentence: "We brush our teeth in the ___.", options: ["morning", "school", "park", "car"], answer: "morning" },
      // Early Literacy
      { sentence: "How many letters are in the word 'cat'? ___!", options: ["2", "3", "4", "5"], answer: "3" },
      { sentence: "The opposite of big is ___.", options: ["tall", "small", "fast", "red"], answer: "small" },
      // Early Numeracy
      { sentence: "An octopus has ___ legs — count them!", options: ["6", "7", "8", "9"], answer: "8" },
      { sentence: "You have 5 sweets and eat 2. You have ___ left!", options: ["2", "3", "4", "5"], answer: "3" },
      // Nazra Quran
      { sentence: "The letter Ba (ب) has ___ dot(s) below it.", options: ["0", "1", "2", "3"], answer: "1" },
      // Communication
      { sentence: "Before you speak, you should ___ for your turn.", options: ["wait", "shout", "run", "sleep"], answer: "wait" },
    ],
    truefalse: [
      { statement: "A banana is yellow.", answer: true },
      { statement: "Dogs can talk like people.", answer: false },
      { statement: "The moon comes out at night.", answer: true },
      // Early Literacy
      { statement: "Z is the last letter.", answer: true },
      { statement: "The word 'fish' has 5 letters.", answer: false },
      // Early Numeracy
      { statement: "10 is bigger than 7.", answer: true },
      { statement: "A triangle has 4 sides.", answer: false },
      // Nazra Quran
      { statement: "Arabic is read from right to left.", answer: true },
      // Communication
      { statement: "Listening is part of talking to someone.", answer: true },
    ],
    picture: [
      { scene: "You have 3 toy cars: red, blue, green. Your friend wants to play. How many cars can you share?", prompt: "How would you share?" },
      { scene: "Imagine you are a superhero! What is your superpower?", prompt: "Tell me about your superpower!" },
      { scene: "You find a big puddle after the rain. What would you do?", prompt: "What happens with the puddle?" },
      // Early Literacy
      { scene: "Quick! Name 3 things that start with the letter B. Ready? Go!", prompt: "Name 3 B words — fast!" },
      // Early Numeracy
      { scene: "You have 4 stickers and your friend gives you 3 more. Quick — how many now?", prompt: "Add them up super fast!" },
      // Communication
      { scene: "Your teacher is talking but you want to say something NOW. What is the best thing to do?", prompt: "What should you do?" },
    ],
  },
  adhd_primary: {
    match: [
      { pairs: [["Simile", "Like or as"], ["Metaphor", "Is something else"], ["Alliteration", "Same starting sound"], ["Rhyme", "Sounds the same"]] },
      { pairs: [["Heart ❤️", "Pumps blood"], ["Lungs 🫁", "Help us breathe"], ["Brain 🧠", "Controls thinking"], ["Stomach", "Digests food"]] },
      { pairs: [["x2", "Double it"], ["x5", "Ends in 0 or 5"], ["x10", "Add a zero"], ["x3", "Count in threes"]] },
      // Maths
      { pairs: [["Even", "2, 4, 6, 8..."], ["Odd", "1, 3, 5, 7..."], ["Prime", "Only divides by 1 and itself"], ["Square", "Number times itself"]] },
      { pairs: [["100 cm", "1 metre"], ["1000 m", "1 kilometre"], ["1000 g", "1 kilogram"], ["1000 ml", "1 litre"]] },
      // English
      { pairs: [["Exclamation", "Shows strong feeling!"], ["Question", "Asks something?"], ["Command", "Tells you to do something."], ["Statement", "Tells you a fact."]] },
      // Urdu
      { pairs: [["محاورہ", "Idiom — saying with hidden meaning"], ["ضرب المثل", "Proverb — wise old saying"], ["مترادف", "Synonym — same meaning"], ["متضاد", "Antonym — opposite meaning"]] },
    ],
    fill: [
      { sentence: "The opposite of hot is ___.", options: ["warm", "cold", "wet", "dry"], answer: "cold" },
      { sentence: "7 x 5 = ___.", options: ["30", "35", "40", "25"], answer: "35" },
      { sentence: "Plants need ___ to grow.", options: ["darkness", "sunlight", "ice", "noise"], answer: "sunlight" },
      // Maths
      { sentence: "8 x 8 = ___. Boom!", options: ["56", "62", "64", "72"], answer: "64" },
      { sentence: "A football match lasts ___ minutes.", options: ["45", "60", "80", "90"], answer: "90" },
      // English
      { sentence: "'Quickly' is an example of an ___.", options: ["noun", "adjective", "adverb", "pronoun"], answer: "adverb" },
      { sentence: "The plural of 'child' is ___.", options: ["childs", "children", "childes", "childrens"], answer: "children" },
      // Science
      { sentence: "The largest planet in our solar system is ___.", options: ["Mars", "Jupiter", "Saturn", "Earth"], answer: "Jupiter" },
      // Urdu
      { sentence: "Urdu mein 'kitaab' ka matlab ___ hai.", options: ["book", "pen", "bag", "chair"], answer: "book" },
      // Islamiat
      { sentence: "The holy month of fasting is called ___.", options: ["Shaban", "Ramadan", "Rajab", "Safar"], answer: "Ramadan" },
      // Pakistan Studies
      { sentence: "The highest mountain in Pakistan is ___.", options: ["K2", "Nanga Parbat", "Everest", "Tirich Mir"], answer: "K2" },
    ],
    truefalse: [
      { statement: "Whales are fish.", answer: false },
      { statement: "12 x 2 = 24.", answer: true },
      { statement: "The capital of Pakistan is Lahore.", answer: false },
      // Maths
      { statement: "7 is a prime number.", answer: true },
      { statement: "1 kilometre = 100 metres.", answer: false },
      // English
      { statement: "An adverb describes a verb.", answer: true },
      { statement: "The plural of 'mouse' is 'mouses'.", answer: false },
      // Science
      { statement: "Humans have 206 bones.", answer: true },
      // Islamiat
      { statement: "Zakat is one of the five pillars of Islam.", answer: true },
      // Pakistan Studies
      { statement: "K2 is the second highest mountain in the world.", answer: true },
    ],
    picture: [
      { scene: "You are a detective! There are muddy footprints leading to the kitchen. What happened?", prompt: "Solve the mystery!" },
      { scene: "You have 20 minutes of free time. You can read, draw, or play outside. Quick — pick one!", prompt: "What do you choose and why?" },
      { scene: "Your team needs a name for a science project about space. Think of the coolest name!", prompt: "What is your team name?" },
      // Maths
      { scene: "You score 45 runs in the first innings and 38 in the second. What is your total? Can you beat 100?", prompt: "Add up your score — fast!" },
      // English
      { scene: "Write the most exciting sentence you can about a cricket match using at least 2 adjectives!", prompt: "Make it exciting — go!" },
      // Science
      { scene: "If you could visit any planet, which one? Jupiter has 95 moons! Saturn has rings! Mars is red!", prompt: "Pick a planet — why?" },
    ],
  },
  // ── DYSLEXIA ──
  dyslexia_early: {
    match: [
      { pairs: [["A 🍎", "Apple sound"], ["B 🐝", "Bee sound"], ["C 🐱", "Cat sound"], ["D 🐶", "Dog sound"]] },
      { pairs: [["bat 🦇", "Rhymes with cat"], ["dog 🐕", "Rhymes with log"], ["sun ☀️", "Rhymes with fun"], ["top 🔝", "Rhymes with hop"]] },
      { pairs: [["Big 🐘", "Not small"], ["Hot 🔥", "Not cold"], ["Up ⬆️", "Not down"], ["Fast 🏃", "Not slow"]] },
      // Early Literacy
      { pairs: [["man 👨", "Rhymes with can"], ["bed 🛏️", "Rhymes with red"], ["pig 🐷", "Rhymes with big"], ["pot 🍯", "Rhymes with hot"]] },
      // Early Numeracy
      { pairs: [["2 ✌️", "Two fingers"], ["3 🔺", "Three sides on a triangle"], ["4 🚗", "Four wheels on a car"], ["5 ⭐", "Five points on a star"]] },
      // Nazra Quran
      { pairs: [["Alif ا", "A tall line"], ["Ba ب", "A boat with a dot"], ["Sin س", "Three teeth shape"], ["Mim م", "A round loop"]] },
      // Communication
      { pairs: [["Loud voice 📢", "Used when far away"], ["Quiet voice 🤫", "Used in a library"], ["Happy voice 😄", "When you feel good"], ["Sad voice 😢", "When you feel upset"]] },
    ],
    fill: [
      { sentence: "Cat rhymes with ___.", options: ["dog", "hat", "sun", "cup"], answer: "hat" },
      { sentence: "___ is the first letter of Ball.", options: ["A", "B", "C", "D"], answer: "B" },
      { sentence: "The colour of grass is ___.", options: ["red", "blue", "green", "white"], answer: "green" },
      // Early Literacy
      { sentence: "Dog and ___ rhyme.", options: ["cat", "log", "sun", "pen"], answer: "log" },
      { sentence: "The word 'run' ends with the sound ___.", options: ["n", "m", "t", "s"], answer: "n" },
      // Early Numeracy
      { sentence: "3 + 2 = ___.", options: ["4", "5", "6", "7"], answer: "5" },
      { sentence: "A car has ___ wheels.", options: ["2", "3", "4", "5"], answer: "4" },
      // Nazra Quran
      { sentence: "Arabic is read from ___ to left.", options: ["right", "left", "top", "bottom"], answer: "right" },
      // Communication
      { sentence: "In a library, we use a ___ voice.", options: ["loud", "quiet", "fast", "angry"], answer: "quiet" },
    ],
    truefalse: [
      { statement: "Cat and hat rhyme.", answer: true },
      { statement: "The word 'dog' starts with B.", answer: false },
      { statement: "Sun and fun sound alike at the end.", answer: true },
      // Early Literacy
      { statement: "Pen and hen sound alike at the end.", answer: true },
      { statement: "The word 'top' starts with the same sound as 'dog'.", answer: false },
      // Early Numeracy
      { statement: "4 is more than 2.", answer: true },
      { statement: "After 5 comes 4.", answer: false },
      // Nazra Quran
      { statement: "Alif is the first letter of the Arabic alphabet.", answer: true },
      // Communication
      { statement: "We can show feelings without words.", answer: true },
    ],
    picture: [
      { scene: "Close your eyes and listen: someone is clapping a rhythm — clap, clap, pause, clap. Can you copy it?", prompt: "Clap along!" },
      { scene: "Imagine the letter S is a snake. It goes ssssss. What other things make an S sound?", prompt: "What makes an S sound?" },
      { scene: "You see a shop sign but cannot read it. There is a picture of bread on it. What kind of shop is it?", prompt: "What shop is this?" },
      // Early Literacy
      { scene: "Listen to these words: map, mat, man. They all start the same. What sound do they start with?", prompt: "What is the starting sound?" },
      // Early Numeracy
      { scene: "Count on your fingers: 1, 2, 3, 4, 5. Now hold up 3 fingers. How many are down?", prompt: "How many fingers are down?" },
      // Communication
      { scene: "Your friend is telling you a story. What do you do to show you are listening?", prompt: "How do you show you are listening?" },
    ],
  },
  dyslexia_primary: {
    match: [
      { pairs: [["Prefix", "Goes at the start"], ["Suffix", "Goes at the end"], ["Root word", "The main part"], ["Syllable", "A beat in a word"]] },
      { pairs: [["Their", "Belonging to them"], ["There", "A place"], ["They're", "They are"], ["Then", "After that"]] },
      { pairs: [["Full stop .", "End of sentence"], ["Question mark ?", "Asking something"], ["Comma ,", "Short pause"], ["Exclamation !", "Surprise or shout"]] },
      // Maths
      { pairs: [["+ Plus", "Add together"], ["- Minus", "Take away"], ["x Times", "Groups of"], ["÷ Divide", "Share equally"]] },
      // English
      { pairs: [["Was", "Past tense of 'is'"], ["Were", "Past tense of 'are'"], ["Is", "Present tense (one)"], ["Are", "Present tense (many)"]] },
      // Urdu
      { pairs: [["الف", "First Urdu letter"], ["ب", "Second Urdu letter"], ["پ", "Third Urdu letter"], ["ت", "Fourth Urdu letter"]] },
    ],
    fill: [
      { sentence: "The children went to ___ school.", options: ["there", "their", "they're", "thier"], answer: "their" },
      { sentence: "Un-happy. The prefix 'un' means ___.", options: ["not", "very", "more", "again"], answer: "not" },
      { sentence: "'Beautiful' has ___ syllables.", options: ["2", "3", "4", "5"], answer: "3" },
      // Maths
      { sentence: "12 x 5 = ___.", options: ["50", "55", "60", "65"], answer: "60" },
      { sentence: "If you have Rs 100 and spend Rs 35, you have Rs ___ left.", options: ["55", "60", "65", "75"], answer: "65" },
      // English
      { sentence: "The cat sat ___ the mat.", options: ["on", "in", "to", "at"], answer: "on" },
      { sentence: "I ___ to school every day.", options: ["go", "goes", "going", "gone"], answer: "go" },
      // Science
      { sentence: "A magnet pulls things made of ___.", options: ["wood", "metal", "paper", "cloth"], answer: "metal" },
      // Urdu
      { sentence: "Urdu is written from ___ to left.", options: ["right", "left", "top", "bottom"], answer: "right" },
      // Islamiat
      { sentence: "The five daily prayers start with ___.", options: ["Fajr", "Zuhr", "Asr", "Maghrib"], answer: "Fajr" },
      // Pakistan Studies
      { sentence: "Pakistan became independent on 14th August ___.", options: ["1945", "1947", "1950", "1956"], answer: "1947" },
    ],
    truefalse: [
      { statement: "'Knight' and 'night' sound the same.", answer: true },
      { statement: "Every sentence needs a full stop or question mark.", answer: true },
      { statement: "'There' means belonging to someone.", answer: false },
      // Maths
      { statement: "Half of 100 is 50.", answer: true },
      { statement: "There are 100 centimetres in a kilometre.", answer: false },
      // English
      { statement: "'I' is always written as a capital letter.", answer: true },
      { statement: "A question ends with a full stop.", answer: false },
      // Science
      { statement: "Sound travels through air.", answer: true },
      // Islamiat
      { statement: "Fajr prayer is before sunrise.", answer: true },
      // Pakistan Studies
      { statement: "The Indus River flows through Pakistan.", answer: true },
    ],
    picture: [
      { scene: "You are writing a story about a dragon. The dragon is friendly! What does your dragon look like?", prompt: "Describe your dragon out loud!" },
      { scene: "Look at this word pattern: c-a-t, b-a-t, h-a-t. What letter is changing each time?", prompt: "Which letter changes?" },
      { scene: "Your friend sends you a message: 'Lets meet at the park.' Can you spot what is missing?", prompt: "What is missing from the message?" },
      // Maths
      { scene: "You buy a notebook for Rs 40 and a pen for Rs 20. How much did you spend in total?", prompt: "What is the total cost?" },
      // English
      { scene: "Think of your best friend. Say three sentences about them. Start each sentence differently.", prompt: "Tell me about your friend!" },
      // Science
      { scene: "You test a magnet on a spoon, a pencil, a coin, and a rubber. Which ones stick?", prompt: "What did the magnet pick up?" },
    ],
  },
  // ── DOWN SYNDROME ──
  ds_early: {
    match: [
      { pairs: [["Apple 🍎", "A fruit"], ["Car 🚗", "Goes on road"], ["Ball ⚽", "You kick it"], ["Book 📖", "You read it"]] },
      { pairs: [["Big 🐘", "Elephant"], ["Small 🐭", "Mouse"], ["Tall 🦒", "Giraffe"], ["Fast 🐆", "Cheetah"]] },
      { pairs: [["Eyes 👀", "We see"], ["Ears 👂", "We hear"], ["Nose 👃", "We smell"], ["Mouth 👄", "We taste"]] },
      // Early Literacy
      { pairs: [["A 🍎", "Apple"], ["B ⚽", "Ball"], ["C 🐱", "Cat"], ["D 🐶", "Dog"]] },
      // Early Numeracy
      { pairs: [["1 ☝️", "One finger up"], ["2 ✌️", "Two fingers up"], ["3 🤟", "Three fingers"], ["4 🖐️", "Almost a whole hand"]] },
      // Nazra Quran
      { pairs: [["Alif ا", "Looks like the number 1"], ["Ba ب", "Like a boat"], ["Mim م", "Like a circle"], ["Ha ه", "Like a small egg"]] },
      // Communication
      { pairs: [["Hello 👋", "We say this first"], ["Bye bye 👋", "We say this last"], ["Please 🙏", "We say this to ask nicely"], ["Thank you 🤗", "We say this after help"]] },
    ],
    fill: [
      { sentence: "We see with our ___.", options: ["ears", "eyes", "nose", "mouth"], answer: "eyes" },
      { sentence: "An apple is a ___.", options: ["fruit", "vegetable", "drink", "toy"], answer: "fruit" },
      { sentence: "We sleep in a ___.", options: ["bed", "car", "kitchen", "garden"], answer: "bed" },
      // Early Literacy
      { sentence: "A ___ is something you read.", options: ["book", "shoe", "cup", "ball"], answer: "book" },
      { sentence: "Your ___ is what people call you.", options: ["name", "shoe", "lunch", "bag"], answer: "name" },
      // Early Numeracy
      { sentence: "You have 1 ball. Ammi gives you 1 more. Now you have ___.", options: ["1", "2", "3", "4"], answer: "2" },
      { sentence: "A circle is ___.", options: ["round", "square", "pointy", "flat"], answer: "round" },
      // Nazra Quran
      { sentence: "The Quran is the holy book of ___.", options: ["Islam", "school", "cooking", "games"], answer: "Islam" },
      // Communication
      { sentence: "When we leave, we say ___.", options: ["hello", "bye bye", "sorry", "please"], answer: "bye bye" },
    ],
    truefalse: [
      { statement: "Birds can fly.", answer: true },
      { statement: "We eat soup with a fork.", answer: false },
      { statement: "The sun is hot.", answer: true },
      // Early Literacy
      { statement: "We read books with our eyes.", answer: true },
      { statement: "A pencil is used for eating.", answer: false },
      // Early Numeracy
      { statement: "3 comes after 2.", answer: true },
      { statement: "A square is round.", answer: false },
      // Nazra Quran
      { statement: "Muslims read the Quran.", answer: true },
      // Communication
      { statement: "Waving means hello or goodbye.", answer: true },
    ],
    picture: [
      { scene: "Look! A fluffy white cloud in the sky. What shape does it look like to you?", prompt: "What do you see in the cloud?" },
      { scene: "You hear music playing. It makes you want to dance! Show me your favourite dance move!", prompt: "Dance time!" },
      { scene: "Mummy gives you two biscuits. You eat one. How many are left?", prompt: "How many biscuits now?" },
      // Early Literacy
      { scene: "Your teacher shows you the letter A. Can you think of a fruit that starts with A?", prompt: "What fruit starts with A?" },
      // Early Numeracy
      { scene: "Ammi puts 3 roti on the table. Abbu eats 1. How many roti are left?", prompt: "How many roti now?" },
      // Communication
      { scene: "You walk into your classroom in the morning. What do you say to your teacher?", prompt: "What is your greeting?" },
    ],
  },
  ds_primary: {
    match: [
      { pairs: [["Coin 🪙", "Money"], ["Clock 🕐", "Tells time"], ["Map 🗺️", "Shows places"], ["Ruler 📏", "Measures length"]] },
      { pairs: [["Spring 🌸", "Flowers bloom"], ["Summer ☀️", "Very hot"], ["Autumn 🍂", "Leaves fall"], ["Winter ❄️", "Very cold"]] },
      { pairs: [["10p", "Ten pence"], ["50p", "Fifty pence"], ["£1", "One pound"], ["£5", "Five pounds"]] },
      // Maths
      { pairs: [["Rs 5", "Five rupees"], ["Rs 10", "Ten rupees"], ["Rs 20", "Twenty rupees"], ["Rs 50", "Fifty rupees"]] },
      // English
      { pairs: [["Cat", "An animal word"], ["Run", "An action word"], ["Big", "A describing word"], ["And", "A joining word"]] },
      // Urdu
      { pairs: [["پانی", "Water"], ["روٹی", "Roti/Bread"], ["دودھ", "Milk"], ["چاول", "Rice"]] },
    ],
    fill: [
      { sentence: "There are ___ months in a year.", options: ["10", "11", "12", "13"], answer: "12" },
      { sentence: "After Tuesday comes ___.", options: ["Monday", "Wednesday", "Thursday", "Friday"], answer: "Wednesday" },
      { sentence: "10 + 5 = ___.", options: ["14", "15", "16", "20"], answer: "15" },
      // Maths
      { sentence: "5 + 5 = ___.", options: ["8", "9", "10", "11"], answer: "10" },
      { sentence: "There are ___ days in a week.", options: ["5", "6", "7", "8"], answer: "7" },
      // English
      { sentence: "The ___ is shining in the sky.", options: ["sun", "run", "fun", "bun"], answer: "sun" },
      { sentence: "My name starts with a ___ letter.", options: ["capital", "small", "number", "funny"], answer: "capital" },
      // Science
      { sentence: "Rain comes from ___.", options: ["the ground", "clouds", "trees", "rivers"], answer: "clouds" },
      // Urdu
      { sentence: "'Ammi' means ___ in Urdu.", options: ["father", "mother", "brother", "sister"], answer: "mother" },
      // Islamiat
      { sentence: "Before praying, Muslims do ___.", options: ["wudu", "cooking", "sleeping", "playing"], answer: "wudu" },
      // Pakistan Studies
      { sentence: "The flag of Pakistan is green and ___.", options: ["red", "blue", "white", "yellow"], answer: "white" },
    ],
    truefalse: [
      { statement: "There are 7 days in a week.", answer: true },
      { statement: "January comes after February.", answer: false },
      { statement: "A square has 4 sides.", answer: true },
      // Maths
      { statement: "10 + 10 = 20.", answer: true },
      { statement: "A week has 5 days.", answer: false },
      // English
      { statement: "Names start with a capital letter.", answer: true },
      { statement: "'Run' is a describing word.", answer: false },
      // Science
      { statement: "Water can be a solid (ice), liquid (water), and gas (steam).", answer: true },
      // Islamiat
      { statement: "Muslims face Makkah when they pray.", answer: true },
      // Pakistan Studies
      { statement: "Pakistan's flag has a crescent and a star.", answer: true },
    ],
    picture: [
      { scene: "You go to the shop with £1. A drink costs 50p. Can you buy it? How much is left?", prompt: "Work out the money!" },
      { scene: "It is raining outside. What clothes do you need to wear?", prompt: "What do you put on?" },
      { scene: "You are helping to set the table for 4 people. How many plates, forks and cups do you need?", prompt: "Count what you need!" },
      // Maths
      { scene: "You go to the shop with Rs 50. A juice costs Rs 30. Do you have enough? How much is left?", prompt: "Work out the money!" },
      // English
      { scene: "Tell me about your favourite food. What is it? What colour is it? How does it taste?", prompt: "Describe your food!" },
      // Science
      { scene: "It is a sunny day. You leave ice cream outside. What happens to it?", prompt: "What happens to the ice cream?" },
    ],
  },
  // ── CEREBRAL PALSY ──
  cp_early: {
    match: [
      { pairs: [["Red 🔴", "Strawberry"], ["Yellow 🟡", "Banana"], ["Orange 🟠", "Orange"], ["Green 🟢", "Apple"]] },
      { pairs: [["Hot ☕", "Tea"], ["Cold 🧊", "Ice cream"], ["Soft 🧸", "Teddy"], ["Hard 🪨", "Rock"]] },
      { pairs: [["Clap 👏", "Hands together"], ["Wave 👋", "Say hello"], ["Point 👉", "Show something"], ["Nod", "Say yes"]] },
      // Early Literacy
      { pairs: [["L 🍋", "Lemon starts with L"], ["N 👃", "Nose starts with N"], ["R 🌈", "Rainbow starts with R"], ["W 🌊", "Water starts with W"]] },
      // Early Numeracy
      { pairs: [["Rectangle 📱", "Four sides, two longer"], ["Circle ⚽", "Perfectly round"], ["Triangle 📐", "Three sides and corners"], ["Square 🎲", "Four equal sides"]] },
      // Nazra Quran
      { pairs: [["Alif ا", "First Arabic letter"], ["Ya ي", "Last Arabic letter"], ["Noon ن", "Has a dot on top"], ["Waw و", "Looks like a hook"]] },
      // Communication
      { pairs: [["Asking", "Can I have water please?"], ["Telling", "The cat is on the mat."], ["Thanking", "Thank you for helping me."], ["Greeting", "Good morning!"]] },
    ],
    fill: [
      { sentence: "A strawberry is ___.", options: ["red", "blue", "green", "purple"], answer: "red" },
      { sentence: "Ice cream is ___.", options: ["hot", "cold", "hard", "loud"], answer: "cold" },
      { sentence: "We nod our head to say ___.", options: ["yes", "no", "maybe", "hello"], answer: "yes" },
      // Early Literacy
      { sentence: "The word 'parrot' starts with the letter ___.", options: ["P", "B", "T", "K"], answer: "P" },
      { sentence: "We use a ___ to write.", options: ["pencil", "spoon", "shoe", "cup"], answer: "pencil" },
      // Early Numeracy
      { sentence: "4 + 2 = ___.", options: ["5", "6", "7", "8"], answer: "6" },
      { sentence: "A triangle has ___ corners.", options: ["2", "3", "4", "5"], answer: "3" },
      // Nazra Quran
      { sentence: "The Arabic alphabet begins with Alif and ends with ___.", options: ["Ba", "Ya", "Sin", "Mim"], answer: "Ya" },
      // Communication
      { sentence: "When you need help, you can ___.", options: ["ask", "hide", "cry", "sleep"], answer: "ask" },
    ],
    truefalse: [
      { statement: "Ice is cold.", answer: true },
      { statement: "Rocks are soft.", answer: false },
      { statement: "We wave to say hello.", answer: true },
      // Early Literacy
      { statement: "The word 'cat' has 3 letters.", answer: true },
      { statement: "Q comes before A in the alphabet.", answer: false },
      // Early Numeracy
      { statement: "6 is greater than 4.", answer: true },
      { statement: "A rectangle has 3 sides.", answer: false },
      // Nazra Quran
      { statement: "The Quran is written in Arabic.", answer: true },
      // Communication
      { statement: "Saying 'please' is polite.", answer: true },
    ],
    picture: [
      { scene: "You are at the beach. You feel sand between your toes and hear waves. What else can you see?", prompt: "Describe the beach!" },
      { scene: "Your favourite song is playing. How does the music make you feel?", prompt: "Tell me about the music!" },
      { scene: "A butterfly lands on a flower near you. What colours is it?", prompt: "Describe the butterfly!" },
      // Early Literacy
      { scene: "You are learning to write the letter S. It curves like a snake! What other things look like the letter S?", prompt: "What looks like S?" },
      // Early Numeracy
      { scene: "You see shapes around you: the door is a rectangle, the clock is a circle. What shape is a book?", prompt: "What shape is the book?" },
      // Communication
      { scene: "A new child joins your class. They look nervous. What can you say to make them feel welcome?", prompt: "What would you say?" },
    ],
  },
  cp_primary: {
    match: [
      { pairs: [["Gravity", "Pulls things down"], ["Friction", "Slows things down"], ["Magnet", "Attracts metal"], ["Force", "Push or pull"]] },
      { pairs: [["Noun", "Naming word"], ["Adjective", "Describing word"], ["Verb", "Doing word"], ["Adverb", "How something is done"]] },
      { pairs: [["Perimeter", "Around the edge"], ["Area", "Inside the shape"], ["Volume", "Space inside"], ["Angle", "Where lines meet"]] },
      // Maths
      { pairs: [["Acute angle", "Less than 90°"], ["Right angle", "Exactly 90°"], ["Obtuse angle", "Between 90° and 180°"], ["Straight angle", "Exactly 180°"]] },
      { pairs: [["x7", "7, 14, 21, 28..."], ["x8", "8, 16, 24, 32..."], ["x9", "9, 18, 27, 36..."], ["x12", "12, 24, 36, 48..."]] },
      // English
      { pairs: [["Simile", "Uses 'like' or 'as'"], ["Metaphor", "Says something IS something else"], ["Alliteration", "Same starting sounds"], ["Onomatopoeia", "Words that sound like noises"]] },
      // Urdu
      { pairs: [["واحد", "Singular — one"], ["جمع", "Plural — many"], ["مذکر", "Masculine"], ["مؤنث", "Feminine"]] },
    ],
    fill: [
      { sentence: "Gravity pulls things ___.", options: ["up", "down", "sideways", "forward"], answer: "down" },
      { sentence: "An adjective is a ___ word.", options: ["doing", "describing", "naming", "joining"], answer: "describing" },
      { sentence: "The perimeter is the distance ___ a shape.", options: ["around", "inside", "through", "above"], answer: "around" },
      // Maths
      { sentence: "The angles in a triangle add up to ___ degrees.", options: ["90", "180", "270", "360"], answer: "180" },
      { sentence: "1/4 of 100 = ___.", options: ["10", "20", "25", "50"], answer: "25" },
      // English
      { sentence: "'She runs like a cheetah' is an example of a ___.", options: ["metaphor", "simile", "rhyme", "alliteration"], answer: "simile" },
      { sentence: "A ___ is a group of sentences about one topic.", options: ["paragraph", "chapter", "book", "letter"], answer: "paragraph" },
      // Science
      { sentence: "An animal that eats only plants is called a ___.", options: ["carnivore", "herbivore", "omnivore", "scavenger"], answer: "herbivore" },
      // Urdu
      { sentence: "Pakistan ki qoumi zuban ___ hai.", options: ["Urdu", "English", "Punjabi", "Sindhi"], answer: "Urdu" },
      // Islamiat
      { sentence: "The Quran has ___ surahs.", options: ["100", "114", "120", "130"], answer: "114" },
      // Pakistan Studies
      { sentence: "The founder of Pakistan is ___.", options: ["Allama Iqbal", "Quaid-e-Azam", "Liaquat Ali Khan", "Sir Syed Ahmed Khan"], answer: "Quaid-e-Azam" },
    ],
    truefalse: [
      { statement: "Magnets attract all objects.", answer: false },
      { statement: "A verb is a doing word.", answer: true },
      { statement: "The area of a shape is measured around the outside.", answer: false },
      // Maths
      { statement: "A right angle is 90 degrees.", answer: true },
      { statement: "12 x 12 = 124.", answer: false },
      // English
      { statement: "'Buzz' is an example of onomatopoeia.", answer: true },
      { statement: "A simile uses the word 'is' to compare.", answer: false },
      // Science
      { statement: "The Earth has one natural satellite called the Moon.", answer: true },
      // Islamiat
      { statement: "Hajj is performed in the month of Dhul Hijjah.", answer: true },
      // Pakistan Studies
      { statement: "Quaid-e-Azam's birthday is on 25th December.", answer: true },
    ],
    picture: [
      { scene: "Drop a ball and a feather at the same time. Which hits the ground first? Why?", prompt: "What do you think happens?" },
      { scene: "You are designing a bedroom. It is 3 metres by 4 metres. What is the area?", prompt: "Calculate the area!" },
      { scene: "Write a sentence about your favourite animal using at least one adjective.", prompt: "Describe your animal!" },
      // Maths
      { scene: "A rectangular garden is 10 metres long and 5 metres wide. What is the area?", prompt: "Calculate the area of the garden!" },
      // English
      { scene: "Write a short paragraph about Lahore using at least one simile and one describing word.", prompt: "Describe Lahore!" },
      // Science
      { scene: "Sort these animals: lion, cow, bear, rabbit. Which are herbivores? Which are carnivores? Which are omnivores?", prompt: "Sort the animals!" },
    ],
  },
  // ── VISUAL IMPAIRMENT ──
  vi_early: {
    match: [
      { pairs: [["Bell 🔔", "Ding ding"], ["Drum 🥁", "Boom boom"], ["Whistle", "Wheee"], ["Clap 👏", "Slap slap"]] },
      { pairs: [["Soft 🧸", "Teddy bear"], ["Rough", "Sandpaper"], ["Smooth", "Glass"], ["Bumpy", "Gravel path"]] },
      { pairs: [["Sweet 🍬", "Candy"], ["Sour 🍋", "Lemon"], ["Salty 🧂", "Crisps"], ["Bitter", "Dark chocolate"]] },
      // Early Literacy
      { pairs: [["A sound", "Ah like apple"], ["B sound", "Buh like ball"], ["C sound", "Kuh like cat"], ["D sound", "Duh like drum"]] },
      // Early Numeracy
      { pairs: [["1 clap", "One time"], ["2 claps", "Two times"], ["3 claps", "Three times"], ["4 claps", "Four times"]] },
      // Nazra Quran
      { pairs: [["Alif", "Sounds like 'a' in 'apple'"], ["Ba", "Sounds like 'b' in 'ball'"], ["Ta", "Sounds like 't' in 'top'"], ["Tha", "Sounds like 'th' in 'think'"]] },
      // Communication
      { pairs: [["Happy tone", "Voice goes up, sounds cheerful"], ["Sad tone", "Voice is low and slow"], ["Angry tone", "Voice is loud and sharp"], ["Scared tone", "Voice is shaky and quiet"]] },
    ],
    fill: [
      { sentence: "A bell goes ___.", options: ["ding", "boom", "splash", "pop"], answer: "ding" },
      { sentence: "Lemons taste ___.", options: ["sweet", "sour", "salty", "spicy"], answer: "sour" },
      { sentence: "A teddy bear feels ___.", options: ["rough", "soft", "hard", "cold"], answer: "soft" },
      // Early Literacy
      { sentence: "The word 'mango' has ___ sounds in it.", options: ["3", "4", "5", "6"], answer: "5" },
      { sentence: "A story has a beginning, a middle, and an ___.", options: ["end", "top", "side", "number"], answer: "end" },
      // Early Numeracy
      { sentence: "If you clap 2 times and then 3 times, you clapped ___ times.", options: ["4", "5", "6", "7"], answer: "5" },
      { sentence: "A hand has ___ fingers.", options: ["3", "4", "5", "6"], answer: "5" },
      // Nazra Quran
      { sentence: "When we recite the Quran, we use our ___.", options: ["voice", "feet", "hands", "eyes"], answer: "voice" },
      // Communication
      { sentence: "You can tell how someone feels by their tone of ___.", options: ["voice", "hair", "shoes", "name"], answer: "voice" },
    ],
    truefalse: [
      { statement: "Drums make a loud sound.", answer: true },
      { statement: "Sugar tastes sour.", answer: false },
      { statement: "Sandpaper feels smooth.", answer: false },
      // Early Literacy
      { statement: "Every word is made of sounds.", answer: true },
      { statement: "The word 'sun' starts with the sound F.", answer: false },
      // Early Numeracy
      { statement: "Two hands have ten fingers.", answer: true },
      { statement: "After the number 7 comes 6.", answer: false },
      // Nazra Quran
      { statement: "Alif makes a sound like the letter A in English.", answer: true },
      // Communication
      { statement: "We can hear if someone is happy or sad by their voice.", answer: true },
    ],
    picture: [
      { scene: "Close your eyes. Someone puts something cold and round in your hand. It smells sweet. What is it?", prompt: "Guess the fruit!" },
      { scene: "Listen: you hear birds singing, leaves rustling, and children laughing. Where are you?", prompt: "Describe the place!" },
      { scene: "You touch something fluffy that purrs. What animal is it?", prompt: "What is the animal?" },
      // Early Literacy
      { scene: "Listen carefully: someone says 'bat' then 'cat'. Only one sound changed. Which sound changed — the beginning, middle, or end?", prompt: "Which sound is different?" },
      // Early Numeracy
      { scene: "Hold out both hands. Count each finger by touching it. How many do you count on one hand? Now both?", prompt: "How many fingers in total?" },
      // Communication
      { scene: "Someone says 'I am fine' in a sad, slow voice. Do they really feel fine? How can you tell?", prompt: "How are they really feeling?" },
    ],
  },
  vi_primary: {
    match: [
      { pairs: [["Orbit", "Path around something"], ["Rotation", "Spinning on axis"], ["Eclipse", "Sun or Moon blocked"], ["Crater", "Hole on Moon"]] },
      { pairs: [["Simile", "Uses like or as"], ["Onomatopoeia", "Sound words"], ["Personification", "Human qualities"], ["Alliteration", "Same start sound"]] },
      { pairs: [["Half 1/2", "Two equal parts"], ["Quarter 1/4", "Four equal parts"], ["Third 1/3", "Three equal parts"], ["Whole", "All of it"]] },
      // Maths
      { pairs: [["Addition", "Combining two amounts"], ["Subtraction", "Finding the difference"], ["Multiplication", "Repeated addition"], ["Division", "Splitting into equal groups"]] },
      // English
      { pairs: [["Fiction", "Made-up stories"], ["Non-fiction", "True facts and information"], ["Poetry", "Writing with rhythm and feeling"], ["Drama", "A play with characters and dialogue"]] },
      // Urdu
      { pairs: [["Salam", "Greeting in Urdu"], ["Shukriya", "Thank you in Urdu"], ["Khuda Hafiz", "Goodbye in Urdu"], ["Ji", "Yes (respectful) in Urdu"]] },
    ],
    fill: [
      { sentence: "The Earth takes ___ days to orbit the Sun.", options: ["100", "365", "200", "400"], answer: "365" },
      { sentence: "'Buzz' and 'crash' are examples of ___.", options: ["simile", "onomatopoeia", "metaphor", "rhyme"], answer: "onomatopoeia" },
      { sentence: "Half of 20 is ___.", options: ["5", "8", "10", "15"], answer: "10" },
      // Maths
      { sentence: "9 x 6 = ___.", options: ["45", "54", "56", "63"], answer: "54" },
      { sentence: "A quarter of 40 is ___.", options: ["8", "10", "12", "20"], answer: "10" },
      // English
      { sentence: "A story that is not real is called ___.", options: ["fiction", "non-fiction", "biography", "report"], answer: "fiction" },
      { sentence: "A word that means the same as 'happy' is ___.", options: ["sad", "glad", "mad", "bad"], answer: "glad" },
      // Science
      { sentence: "The process by which plants make food is called ___.", options: ["digestion", "respiration", "photosynthesis", "evaporation"], answer: "photosynthesis" },
      // Urdu
      { sentence: "The Urdu word for 'teacher' is ___.", options: ["ustaad", "taalib", "dost", "bhai"], answer: "ustaad" },
      // Islamiat
      { sentence: "The call to prayer is called the ___.", options: ["Azaan", "Dua", "Salaam", "Surah"], answer: "Azaan" },
      // Pakistan Studies
      { sentence: "Pakistan shares a border with ___ countries.", options: ["2", "3", "4", "5"], answer: "4" },
    ],
    truefalse: [
      { statement: "The Earth rotates once every 24 hours.", answer: true },
      { statement: "A simile uses the word 'is' to compare.", answer: false },
      { statement: "A quarter of 100 is 25.", answer: true },
      // Maths
      { statement: "Multiplication is repeated addition.", answer: true },
      { statement: "100 divided by 4 is 20.", answer: false },
      // English
      { statement: "A biography is about a real person's life.", answer: true },
      { statement: "Poetry must always rhyme.", answer: false },
      // Science
      { statement: "All living things need energy to survive.", answer: true },
      // Islamiat
      { statement: "The Azaan is called out five times daily.", answer: true },
      // Pakistan Studies
      { statement: "Pakistan shares a border with China.", answer: true },
    ],
    picture: [
      { scene: "Imagine you are floating in space. You look down and see Earth below. Describe what you hear — or do you hear anything?", prompt: "What is space like?" },
      { scene: "You are listening to an audiobook about a magical forest. Describe the sounds you imagine in the forest.", prompt: "What sounds are there?" },
      { scene: "Someone reads you a riddle: 'I have hands but cannot clap.' What am I?", prompt: "Solve the riddle!" },
      // Maths
      { scene: "Imagine you have 36 sweets to share equally among 6 friends. How many does each person get?", prompt: "Work out the equal share!" },
      // English
      { scene: "Think of a story you heard recently. Retell it in your own words: what happened first, next, and last?", prompt: "Retell the story!" },
      // Science
      { scene: "Think about what happens when you breathe in and out. What gas do you take in? What gas do you breathe out?", prompt: "Explain breathing!" },
    ],
  },
  // ── HEARING IMPAIRMENT ──
  hi_early: {
    match: [
      { pairs: [["Happy 😊", "Smiling face"], ["Sad 😢", "Crying face"], ["Surprised 😮", "Open mouth"], ["Angry 😠", "Frowning face"]] },
      { pairs: [["Stop 🛑", "Red sign"], ["Go ✅", "Green light"], ["Slow ⚠️", "Yellow light"], ["Walk 🚶", "Person shape"]] },
      { pairs: [["Cup 🥤", "For drinking"], ["Plate 🍽️", "For eating"], ["Spoon 🥄", "For scooping"], ["Knife 🔪", "For cutting"]] },
      // Early Literacy
      { pairs: [["📖 Book", "Has pages to read"], ["✏️ Pencil", "For writing"], ["📝 Paper", "You write on it"], ["🎒 Bag", "Carry your things"]] },
      // Early Numeracy
      { pairs: [["1️⃣", "One"], ["2️⃣", "Two"], ["3️⃣", "Three"], ["4️⃣", "Four"]] },
      // Nazra Quran
      { pairs: [["ا Alif", "First letter — tall line"], ["ب Ba", "One dot below"], ["ت Ta", "Two dots above"], ["ث Tha", "Three dots above"]] },
      // Communication
      { pairs: [["Nodding ✅", "Means yes"], ["Shaking head ❌", "Means no"], ["Pointing 👉", "Shows where"], ["Clapping 👏", "Shows well done"]] },
    ],
    fill: [
      { sentence: "A red light means ___.", options: ["go", "stop", "walk", "run"], answer: "stop" },
      { sentence: "😊 This face is ___.", options: ["sad", "happy", "angry", "scared"], answer: "happy" },
      { sentence: "We drink from a ___.", options: ["plate", "cup", "spoon", "fork"], answer: "cup" },
      // Early Literacy
      { sentence: "The letter after A is ___.", options: ["C", "B", "D", "E"], answer: "B" },
      { sentence: "We ___ books to learn new things.", options: ["read", "throw", "eat", "kick"], answer: "read" },
      // Early Numeracy
      { sentence: "3 + 3 = ___.", options: ["5", "6", "7", "8"], answer: "6" },
      { sentence: "Show ___ fingers for the number five.", options: ["3", "4", "5", "6"], answer: "5" },
      // Nazra Quran
      { sentence: "The letter Ta (ت) has ___ dots above it.", options: ["1", "2", "3", "0"], answer: "2" },
      // Communication
      { sentence: "To say 'yes' without talking, you can ___.", options: ["nod", "clap", "point", "wave"], answer: "nod" },
    ],
    truefalse: [
      { statement: "A green traffic light means go.", answer: true },
      { statement: "😢 This face means happy.", answer: false },
      { statement: "We use a spoon to eat soup.", answer: true },
      // Early Literacy
      { statement: "B comes after A in the alphabet.", answer: true },
      { statement: "We write with a spoon.", answer: false },
      // Early Numeracy
      { statement: "2 + 2 = 4.", answer: true },
      { statement: "A triangle has 4 corners.", answer: false },
      // Nazra Quran
      { statement: "The letter Tha (ث) has three dots.", answer: true },
      // Communication
      { statement: "You can say hello by waving your hand.", answer: true },
    ],
    picture: [
      { scene: "Look at someone talking to you. Their mouth is making a big O shape. What sound are they making?", prompt: "What sound is that?" },
      { scene: "You see a person waving their arms and jumping up and down. How are they feeling?", prompt: "What emotion is this?" },
      { scene: "There is a sign with a picture of food on it. What kind of place is this?", prompt: "What place has this sign?" },
      // Early Literacy
      { scene: "You see the letters A, B, C, D on cards. Can you put them in order? What letter comes next?", prompt: "What letter comes after D?" },
      // Early Numeracy
      { scene: "Count the fingers in the picture: 👆👆👆. How many fingers do you see?", prompt: "How many fingers?" },
      // Communication
      { scene: "Your friend across the room wants to tell you something. They point to the door and wave. What do they mean?", prompt: "What is the message?" },
    ],
  },
  hi_primary: {
    match: [
      { pairs: [["Evaporation", "Liquid to gas"], ["Condensation", "Gas to liquid"], ["Precipitation", "Rain or snow"], ["Collection", "Water gathers"]] },
      { pairs: [["Paragraph", "Group of sentences"], ["Sentence", "Starts with capital"], ["Clause", "Has a verb"], ["Phrase", "Group of words"]] },
      { pairs: [["Fraction", "Part of whole"], ["Decimal", "Uses a dot"], ["Percentage", "Out of 100"], ["Ratio", "Comparing amounts"]] },
      // Maths
      { pairs: [["Numerator", "Top number of a fraction"], ["Denominator", "Bottom number of a fraction"], ["Mixed number", "Whole number and fraction"], ["Improper fraction", "Top bigger than bottom"]] },
      // English
      { pairs: [["Noun", "Person, place, or thing"], ["Verb", "Action word"], ["Adjective", "Describes a noun"], ["Adverb", "Describes a verb"]] },
      // Urdu
      { pairs: [["پاکستان", "Pakistan"], ["لاہور", "Lahore"], ["کراچی", "Karachi"], ["اسلام آباد", "Islamabad"]] },
    ],
    fill: [
      { sentence: "When water boils, it turns to ___.", options: ["ice", "steam", "juice", "oil"], answer: "steam" },
      { sentence: "Every sentence starts with a ___ letter.", options: ["small", "capital", "number", "symbol"], answer: "capital" },
      { sentence: "50% means ___ out of 100.", options: ["25", "50", "75", "100"], answer: "50" },
      // Maths
      { sentence: "7 x 8 = ___.", options: ["48", "54", "56", "63"], answer: "56" },
      { sentence: "In the fraction 3/4, the denominator is ___.", options: ["3", "4", "7", "12"], answer: "4" },
      // English
      { sentence: "The opposite of 'fast' is ___.", options: ["quick", "slow", "strong", "tall"], answer: "slow" },
      { sentence: "A ___ mark (?) shows a question.", options: ["question", "full", "exclamation", "speech"], answer: "question" },
      // Science
      { sentence: "The food chain starts with ___.", options: ["animals", "plants", "humans", "fish"], answer: "plants" },
      // Urdu
      { sentence: "Urdu uses the ___ script.", options: ["Nastaliq", "Roman", "Devanagari", "Chinese"], answer: "Nastaliq" },
      // Islamiat
      { sentence: "The direction of prayer for Muslims is called ___.", options: ["Qibla", "Mihrab", "Minaret", "Dome"], answer: "Qibla" },
      // Pakistan Studies
      { sentence: "The national anthem of Pakistan is called ___.", options: ["Qaumi Taranah", "Pakistan Zindabad", "Dil Dil Pakistan", "Mera Watan"], answer: "Qaumi Taranah" },
    ],
    truefalse: [
      { statement: "Rain is a form of precipitation.", answer: true },
      { statement: "A paragraph is a single sentence.", answer: false },
      { statement: "0.5 is the same as 1/2.", answer: true },
      // Maths
      { statement: "1/2 is the same as 2/4.", answer: true },
      { statement: "11 x 11 = 111.", answer: false },
      // English
      { statement: "Adjectives describe nouns.", answer: true },
      { statement: "A comma is used at the end of a sentence.", answer: false },
      // Science
      { statement: "Leaves are usually green because of chlorophyll.", answer: true },
      // Islamiat
      { statement: "The Qibla direction is towards Makkah.", answer: true },
      // Pakistan Studies
      { statement: "Islamabad is the largest city in Pakistan.", answer: false },
    ],
    picture: [
      { scene: "Draw the water cycle: sun heats water, it rises as steam, forms clouds, then falls as rain. Can you explain each step?", prompt: "Explain the water cycle!" },
      { scene: "You see a pie chart showing how students travel to school: half by car, quarter by bus, quarter by walking.", prompt: "What does the chart show?" },
      { scene: "Your friend writes: 'i went too the park and played with there dog.' Find 3 mistakes!", prompt: "Spot the errors!" },
      // Maths
      { scene: "A pizza is cut into 8 equal slices. You eat 3 slices. Write the fraction of pizza you ate.", prompt: "What fraction did you eat?" },
      // English
      { scene: "Write three sentences about your school day using past tense. What did you do first, next, and last?", prompt: "Write about your day!" },
      // Science
      { scene: "Draw a simple food chain: grass is eaten by a grasshopper, which is eaten by a frog, which is eaten by a snake.", prompt: "Explain the food chain!" },
    ],
  },
  // ── UNSURE / UNDIAGNOSED ──
  unsure_early: {
    match: [
      { pairs: [["Happy 😊", "Good feeling"], ["Sad 😢", "Bad feeling"], ["Tired 😴", "Need sleep"], ["Hungry 🍽️", "Need food"]] },
      { pairs: [["Red 🔴", "Stop colour"], ["Green 🟢", "Go colour"], ["Blue 🔵", "Water colour"], ["Yellow 🟡", "Sun colour"]] },
      { pairs: [["1", "One finger"], ["2", "Two fingers"], ["3", "Three fingers"], ["4", "Four fingers"]] },
      // Early Literacy
      { pairs: [["K ✈️", "Kite starts with K"], ["J 🧃", "Juice starts with J"], ["L 🍃", "Leaf starts with L"], ["I 🍦", "Ice cream starts with I"]] },
      // Early Numeracy
      { pairs: [["6 🎲", "Six dots on dice"], ["7 🌈", "Seven colours"], ["8 🕷️", "Eight spider legs"], ["9 🎱", "Nine ball"]] },
      // Nazra Quran
      { pairs: [["Alif ا", "The very first letter"], ["Ba ب", "The second letter"], ["Sin س", "Looks like three teeth"], ["Lam ل", "A tall curved letter"]] },
      // Communication
      { pairs: [["Inside voice 🤫", "Quiet and calm"], ["Outside voice 📣", "Loud enough to hear"], ["Asking voice ❓", "Goes up at the end"], ["Telling voice ✅", "Goes down at the end"]] },
    ],
    fill: [
      { sentence: "When you are tired, you need to ___.", options: ["eat", "sleep", "run", "shout"], answer: "sleep" },
      { sentence: "One plus one is ___.", options: ["1", "2", "3", "4"], answer: "2" },
      { sentence: "Grass is the colour ___.", options: ["red", "blue", "green", "yellow"], answer: "green" },
      // Early Literacy
      { sentence: "The word 'zoo' starts with the letter ___.", options: ["Z", "S", "X", "C"], answer: "Z" },
      { sentence: "A ___ tells a story with words and pictures.", options: ["book", "chair", "plate", "sock"], answer: "book" },
      // Early Numeracy
      { sentence: "5 + 1 = ___.", options: ["5", "6", "7", "8"], answer: "6" },
      { sentence: "How many sides does a rectangle have? ___.", options: ["3", "4", "5", "6"], answer: "4" },
      // Nazra Quran
      { sentence: "Muslims recite the Quran in the ___ language.", options: ["Arabic", "English", "Urdu", "Punjabi"], answer: "Arabic" },
      // Communication
      { sentence: "When you meet someone new, you can say ___.", options: ["hello", "goodbye", "sorry", "ouch"], answer: "hello" },
    ],
    truefalse: [
      { statement: "We need food when we are hungry.", answer: true },
      { statement: "3 comes before 2.", answer: false },
      { statement: "The sky is often blue.", answer: true },
      // Early Literacy
      { statement: "The letter C comes before D.", answer: true },
      { statement: "The word 'apple' starts with B.", answer: false },
      // Early Numeracy
      { statement: "8 is more than 5.", answer: true },
      { statement: "A circle has 2 sides.", answer: false },
      // Nazra Quran
      { statement: "The Arabic alphabet starts with the letter Alif.", answer: true },
      // Communication
      { statement: "Raising your hand in class is a good way to ask to speak.", answer: true },
    ],
    picture: [
      { scene: "It is a rainy day. What games can you play inside?", prompt: "What would you play?" },
      { scene: "You have crayons and paper. Draw your family! Who is in the picture?", prompt: "Tell me about your family!" },
      { scene: "You see a rainbow after the rain. How many colours can you name?", prompt: "Name the colours!" },
      // Early Literacy
      { scene: "You see a sign that says 'STOP'. What does the first letter S sound like? Can you think of another word starting with S?", prompt: "What starts with S?" },
      // Early Numeracy
      { scene: "You have 6 crayons. Your friend asks for 2. How many do you have left? Can you share?", prompt: "How many are left?" },
      // Communication
      { scene: "You want to play with a group of children at break time. How would you ask to join in?", prompt: "What would you say?" },
    ],
  },
  unsure_primary: {
    match: [
      { pairs: [["Continent", "Large land mass"], ["Country", "Has its own flag"], ["City", "Where many people live"], ["Village", "Small community"]] },
      { pairs: [["Past tense", "Already happened"], ["Present tense", "Happening now"], ["Future tense", "Will happen"], ["Verb", "Action word"]] },
      { pairs: [["Even number", "Divisible by 2"], ["Odd number", "Not divisible by 2"], ["Prime number", "Only 1 and itself"], ["Multiple", "Times table answer"]] },
      // Maths
      { pairs: [["Parallel lines", "Never meet"], ["Perpendicular lines", "Meet at right angles"], ["Diagonal", "Goes from corner to corner"], ["Radius", "Centre to edge of circle"]] },
      // English
      { pairs: [["Synonym", "Word with similar meaning"], ["Antonym", "Word with opposite meaning"], ["Homophone", "Same sound, different meaning"], ["Compound word", "Two words joined together"]] },
      // Urdu
      { pairs: [["Urdu", "Qoumi zuban"], ["Lahore", "Punjab ka darulhukumat"], ["Cricket", "Qoumi khel"], ["Jasmine", "Qoumi phool"]] },
    ],
    fill: [
      { sentence: "Pakistan is in the continent of ___.", options: ["Africa", "Asia", "Europe", "America"], answer: "Asia" },
      { sentence: "'She walked to school' is in the ___ tense.", options: ["past", "present", "future", "none"], answer: "past" },
      { sentence: "The first prime number is ___.", options: ["1", "2", "3", "4"], answer: "2" },
      // Maths
      { sentence: "11 x 12 = ___.", options: ["121", "132", "144", "156"], answer: "132" },
      { sentence: "0.5 is the same as ___.", options: ["1/3", "1/4", "1/2", "2/3"], answer: "1/2" },
      // English
      { sentence: "'Their', 'there', and 'they're' are called ___.", options: ["synonyms", "antonyms", "homophones", "verbs"], answer: "homophones" },
      { sentence: "The past tense of 'go' is ___.", options: ["goed", "went", "gone", "going"], answer: "went" },
      // Science
      { sentence: "Planets orbit around the ___.", options: ["Moon", "Sun", "Earth", "Stars"], answer: "Sun" },
      // Urdu
      { sentence: "Pakistan ka qoumi khel ___ hai.", options: ["cricket", "football", "hockey", "kabaddi"], answer: "hockey" },
      // Islamiat
      { sentence: "The five pillars of Islam include Shahada, Salat, Zakat, Sawm, and ___.", options: ["Hajj", "Jihad", "Dua", "Sadaqah"], answer: "Hajj" },
      // Pakistan Studies
      { sentence: "Pakistan's largest city by population is ___.", options: ["Lahore", "Karachi", "Islamabad", "Faisalabad"], answer: "Karachi" },
    ],
    truefalse: [
      { statement: "Asia is the largest continent.", answer: true },
      { statement: "9 is an even number.", answer: false },
      { statement: "'Running' is a verb.", answer: true },
      // Maths
      { statement: "A circle has 0 straight sides.", answer: true },
      { statement: "The perimeter of a square with sides of 5 cm is 15 cm.", answer: false },
      // English
      { statement: "'Butterfly' is a compound word.", answer: true },
      { statement: "'Big' and 'large' are antonyms.", answer: false },
      // Science
      { statement: "Earth is the third planet from the Sun.", answer: true },
      // Islamiat
      { statement: "Eid-ul-Fitr is celebrated after Ramadan.", answer: true },
      // Pakistan Studies
      { statement: "The four provinces of Pakistan are Punjab, Sindh, KPK, and Balochistan.", answer: true },
    ],
    picture: [
      { scene: "You are planning a trip to another city. What 3 things would you pack?", prompt: "What do you pack?" },
      { scene: "Look at a clock showing 3:30. The short hand points to 3 and the long hand points to 6. What time will it be in one hour?", prompt: "What time is it?" },
      { scene: "Write a sentence about something that happened yesterday, something happening today, and something you will do tomorrow.", prompt: "Use three tenses!" },
      // Maths
      { scene: "You are planning a cricket match. Each team needs 11 players. If 25 children want to play, how many are left out?", prompt: "How many are left over?" },
      // English
      { scene: "Create a sentence using a homophone pair. For example, use 'their' and 'there' in the same sentence.", prompt: "Write a sentence with homophones!" },
      // Science
      { scene: "Imagine you could travel to space. List 3 things you would need to survive and explain why.", prompt: "What do you need in space?" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // SECONDARY STAGE (Ages 11–16, O-Level / GCSE)
  // ═══════════════════════════════════════════════════════════════════════

  // ── AUTISM — SECONDARY ──
  autism_secondary: {
    match: [
      { pairs: [["Cell", "Basic unit of life"], ["Nucleus", "Controls the cell"], ["Mitochondria", "Powerhouse — makes energy"], ["Chromosome", "Carries genetic information"]] },
      { pairs: [["Treaty", "Formal agreement between nations"], ["Alliance", "Countries joined for a common goal"], ["Armistice", "Agreement to stop fighting"], ["Imperialism", "One country controlling another"]] },
      // Maths
      { pairs: [["Quadratic", "ax² + bx + c = 0"], ["Linear", "y = mx + c"], ["Simultaneous", "Two equations, two unknowns"], ["Inequality", "Uses < > signs"]] },
      // English
      { pairs: [["Protagonist", "Main character of the story"], ["Antagonist", "Character who opposes the main character"], ["Setting", "Where and when the story takes place"], ["Theme", "Central message or idea"]] },
    ],
    fill: [
      { sentence: "The ___ is the control centre of a cell.", options: ["nucleus", "mitochondria", "ribosome", "membrane"], answer: "nucleus", explanation: "The nucleus contains DNA and controls cell activities." },
      { sentence: "In the equation 2x + 4 = 10, x = ___.", options: ["2", "3", "4", "6"], answer: "3", explanation: "Subtract 4 from both sides: 2x = 6, then divide by 2: x = 3." },
      { sentence: "Photosynthesis converts light energy into ___ energy.", options: ["chemical", "kinetic", "thermal", "electrical"], answer: "chemical", explanation: "Plants store light energy as chemical energy in glucose." },
      // Maths
      { sentence: "The gradient of y = 3x + 5 is ___.", options: ["3", "5", "8", "15"], answer: "3", explanation: "In y = mx + c, m is the gradient. Here m = 3." },
      { sentence: "The sum of angles in a quadrilateral is ___ degrees.", options: ["180", "270", "360", "540"], answer: "360", explanation: "All quadrilaterals have interior angles adding to 360 degrees." },
      // Physics
      { sentence: "The unit of force is the ___.", options: ["joule", "newton", "watt", "volt"], answer: "newton", explanation: "Force is measured in newtons (N), named after Isaac Newton." },
      // Chemistry
      { sentence: "The chemical symbol for sodium is ___.", options: ["S", "So", "Na", "Sd"], answer: "Na", explanation: "Na comes from the Latin word 'natrium' for sodium." },
      // English
      { sentence: "A text that tries to convince you is called ___.", options: ["narrative", "persuasive", "descriptive", "informative"], answer: "persuasive", explanation: "Persuasive texts use arguments and evidence to convince the reader." },
      // Pakistan Studies
      { sentence: "The Lahore Resolution was passed in ___.", options: ["1935", "1940", "1945", "1947"], answer: "1940", explanation: "The Lahore Resolution of 1940 demanded a separate Muslim state." },
    ],
    truefalse: [
      { statement: "The Mughal Empire was founded by Babur in 1526.", answer: true, explanation: "Babur defeated Ibrahim Lodi at the Battle of Panipat and established Mughal rule." },
      { statement: "In a food chain, producers are at the top.", answer: false, explanation: "Producers (plants) are at the bottom — they make energy from sunlight." },
      { statement: "The atomic number of an element tells you the number of protons.", answer: true, explanation: "The atomic number equals the number of protons in the nucleus." },
      // Maths
      { statement: "The square root of 144 is 12.", answer: true, explanation: "12 x 12 = 144." },
      { statement: "Pi is exactly 3.14.", answer: false, explanation: "Pi is irrational and approximately 3.14159... It never terminates." },
      // Physics
      { statement: "Speed equals distance divided by time.", answer: true, explanation: "Speed = distance / time is the basic formula for speed." },
      // Chemistry
      { statement: "An acid has a pH less than 7.", answer: true, explanation: "Acids range from pH 0 to just below 7." },
      // English
      { statement: "An autobiography is written by the person it is about.", answer: true, explanation: "Auto = self. An autobiography is a self-written life story." },
      // Pakistan Studies
      { statement: "Sir Syed Ahmed Khan founded Aligarh Muslim University.", answer: true, explanation: "Sir Syed established MAO College in 1875, which became Aligarh Muslim University." },
    ],
    picture: [
      { scenario: "You set up an experiment: two identical plants, one in sunlight and one in a dark cupboard. After a week, the sunlit plant is green and healthy; the dark one is yellow and wilting.", prompt: "Step by step, explain what happened and why. What was the independent variable?" },
      { scenario: "You are given data showing that a car travels 60 km in the first hour, 45 km in the second hour, and 30 km in the third hour.", prompt: "Describe the pattern. Calculate the average speed. What might explain the change?" },
      // Maths
      { scenario: "You have the equation 2x + 3y = 12 and x + y = 5. Solve for x and y step by step.", prompt: "Show your working clearly. What are x and y?" },
    ],
  },

  // ── ADHD — SECONDARY ──
  adhd_secondary: {
    match: [
      { pairs: [["DNA", "Genetic code"], ["Atom", "Smallest particle"], ["Gravity", "Pulls things down"], ["Photon", "Particle of light"]] },
      { pairs: [["Revenue", "Money coming in"], ["Profit", "Revenue minus costs"], ["Tax", "Government takes a share"], ["Budget", "Plan for spending"]] },
      // Maths
      { pairs: [["Pythagoras", "a² + b² = c²"], ["BODMAS", "Order of operations"], ["Pi", "Roughly 3.14"], ["Hypotenuse", "Longest side of right triangle"]] },
    ],
    fill: [
      { sentence: "Speed = distance / ___.", options: ["time", "mass", "force", "area"], answer: "time", explanation: "Speed is how far you go divided by how long it takes." },
      { sentence: "The chemical symbol for water is ___.", options: ["CO2", "H2O", "NaCl", "O2"], answer: "H2O", explanation: "Two hydrogen atoms bonded to one oxygen atom." },
      { sentence: "The largest desert in the world is the ___.", options: ["Sahara", "Gobi", "Antarctic", "Thar"], answer: "Antarctic", explanation: "Surprised? Antarctica is technically the largest desert — it gets almost no precipitation!" },
      // Maths
      { sentence: "If a right triangle has sides 3 and 4, the hypotenuse is ___.", options: ["5", "6", "7", "8"], answer: "5", explanation: "3² + 4² = 9 + 16 = 25. The square root of 25 = 5. Classic Pythagoras!" },
      { sentence: "What is 15% of 200? ___.", options: ["15", "20", "30", "35"], answer: "30", explanation: "15/100 x 200 = 30. Quick shortcut: 10% is 20, 5% is 10, total = 30!" },
      // Physics
      { sentence: "Ohm's Law: V = I x ___.", options: ["R", "P", "W", "F"], answer: "R", explanation: "Voltage = Current x Resistance. V = IR. Memorise it!" },
      // Chemistry
      { sentence: "The chemical symbol for gold is ___.", options: ["Go", "Gd", "Au", "Ag"], answer: "Au", explanation: "Au from Latin 'aurum'. Silver is Ag from 'argentum'. Chemistry is weird!" },
      // Pakistan Studies
      { sentence: "The first capital of Pakistan was ___.", options: ["Islamabad", "Lahore", "Karachi", "Rawalpindi"], answer: "Karachi", explanation: "Karachi was Pakistan's first capital before Islamabad was built!" },
    ],
    truefalse: [
      { statement: "Octopuses have three hearts.", answer: true, explanation: "Two pump blood to the gills, one pumps it to the body. Wild!" },
      { statement: "Lightning never strikes the same place twice.", answer: false, explanation: "Totally false! Tall buildings like the Empire State Building get struck dozens of times a year." },
      { statement: "Sound travels faster than light.", answer: false, explanation: "Light is way faster — that is why you see lightning before hearing thunder." },
      // Maths
      { statement: "A negative number multiplied by a negative gives a positive.", answer: true, explanation: "(-) x (-) = (+). Two negatives make a positive!" },
      // Physics
      { statement: "In space, no one can hear you scream.", answer: true, explanation: "Sound needs a medium. Space is a vacuum — no medium, no sound!" },
      // Chemistry
      { statement: "Diamond is made entirely of carbon atoms.", answer: true, explanation: "Pure diamond is just carbon atoms in a giant covalent structure. Incredible!" },
      // Pakistan Studies
      { statement: "Pakistan won the Cricket World Cup in 1992.", answer: true, explanation: "Imran Khan led Pakistan to World Cup victory in 1992 in Melbourne!" },
    ],
    picture: [
      { scenario: "You have been given Rs 5,000 to start a small school tuck shop. You need to buy stock, set prices, and make a profit.", prompt: "Quick plan: What 3 items do you buy? What price do you sell them for? What is your expected profit?" },
      { scenario: "Design a 5-minute experiment to test which paper aeroplane design flies the furthest. You have 3 sheets of paper.", prompt: "What are your 3 designs? How do you make it a fair test? Go!" },
      // Maths
      { scenario: "You throw a ball upward. Its height in metres is h = 20t - 5t². When does it hit the ground?", prompt: "Solve for t when h = 0. What is the maximum height?" },
    ],
  },

  // ── DYSLEXIA — SECONDARY ──
  dyslexia_secondary: {
    match: [
      { pairs: [["Volcano", "Mountain that erupts lava"], ["Earthquake", "Ground shakes suddenly"], ["Tsunami", "Giant ocean wave"], ["Erosion", "Land worn away slowly"]] },
      { pairs: [["Democracy", "People choose leaders"], ["Dictatorship", "One ruler, total control"], ["Monarchy", "King or queen rules"], ["Republic", "Elected head of state"]] },
      // Maths
      { pairs: [["Ratio", "Comparing two amounts"], ["Proportion", "Two equal ratios"], ["Percentage", "Out of 100"], ["Fraction", "Part of a whole"]] },
    ],
    fill: [
      { sentence: "Plants take in ___ and release oxygen.", options: ["carbon dioxide", "nitrogen", "hydrogen", "helium"], answer: "carbon dioxide", explanation: "During photosynthesis, plants absorb CO2 and produce O2." },
      { sentence: "A right angle measures ___ degrees.", options: ["45", "90", "180", "360"], answer: "90", explanation: "A right angle is exactly 90 degrees — like the corner of a book." },
      { sentence: "Pakistan became independent in ___.", options: ["1945", "1947", "1950", "1952"], answer: "1947", explanation: "Pakistan gained independence on 14th August 1947." },
      // Maths
      { sentence: "20% of 150 is ___.", options: ["20", "25", "30", "35"], answer: "30", explanation: "20/100 x 150 = 30." },
      { sentence: "The ratio 4:8 in its simplest form is ___.", options: ["1:2", "2:4", "1:3", "2:3"], answer: "1:2", explanation: "Divide both by 4 to get 1:2." },
      // Physics
      { sentence: "Light travels in straight ___.", options: ["lines", "curves", "circles", "zigzags"], answer: "lines", explanation: "Light always travels in straight lines. This is called rectilinear propagation." },
      // Chemistry
      { sentence: "Acids turn litmus paper ___.", options: ["blue", "green", "red", "yellow"], answer: "red", explanation: "Acids turn blue litmus red. Alkalis turn red litmus blue." },
      // English
      { sentence: "The main idea of a paragraph is called the ___ sentence.", options: ["topic", "closing", "supporting", "linking"], answer: "topic", explanation: "The topic sentence tells the reader what the paragraph is about." },
      // Pakistan Studies
      { sentence: "The Two-Nation Theory said Hindus and Muslims are two separate ___.", options: ["countries", "nations", "cities", "tribes"], answer: "nations", explanation: "The Two-Nation Theory was the basis for creating Pakistan." },
    ],
    truefalse: [
      { statement: "The heart pumps blood around the body.", answer: true, explanation: "The heart is a muscle that pumps blood through arteries and veins." },
      { statement: "Gravity only exists on Earth.", answer: false, explanation: "Gravity exists everywhere — the Moon, the Sun, and all planets have gravity." },
      { statement: "Islamabad is the capital city of Pakistan.", answer: true, explanation: "Islamabad has been the capital since 1967." },
      // Maths
      { statement: "The mean is found by adding values and dividing by how many there are.", answer: true, explanation: "Mean = total of all values / number of values." },
      { statement: "A cube has 8 faces.", answer: false, explanation: "A cube has 6 faces, 12 edges, and 8 vertices." },
      // Physics
      { statement: "Metals are good conductors of electricity.", answer: true, explanation: "Metals have free electrons that allow current to flow easily." },
      // Chemistry
      { statement: "Water is made of hydrogen and oxygen.", answer: true, explanation: "H2O = two hydrogen atoms and one oxygen atom." },
      // English
      { statement: "Every essay needs an introduction and a conclusion.", answer: true, explanation: "A good essay has a clear beginning, middle, and end." },
      // Pakistan Studies
      { statement: "The Pakistan Movement was led by the Muslim League.", answer: true, explanation: "The All-India Muslim League, under Jinnah, led the Pakistan Movement." },
    ],
    picture: [
      { scenario: "Someone tells you: 'All birds can fly.' Think about penguins, ostriches, and kiwis.", prompt: "Is the statement true or false? Explain your reasoning in your own words." },
      { scenario: "A shop has a sale: 50% off everything. A jacket costs Rs 2,000 before the sale.", prompt: "What is the sale price? How did you work it out?" },
      // Maths
      { scenario: "A shirt costs Rs 2,500. It is on sale for 20% off. Work out the sale price.", prompt: "What is the new price? Show your steps." },
    ],
  },

  // ── DOWN SYNDROME — SECONDARY ──
  ds_secondary: {
    match: [
      { pairs: [["Rs 10 note", "Can buy a small snack"], ["Rs 100 note", "Can buy a meal"], ["Rs 500 note", "Can buy groceries"], ["Rs 1000 note", "Can buy clothes"]] },
      { pairs: [["Toothbrush", "Clean your teeth"], ["Oven", "Cook food"], ["Phone", "Call someone"], ["Key", "Open a door"]] },
      // Maths
      { pairs: [["50%", "Half of something"], ["25%", "A quarter"], ["10%", "One tenth"], ["100%", "The whole thing"]] },
    ],
    fill: [
      { sentence: "If something costs Rs 80 and you pay Rs 100, your change is Rs ___.", options: ["10", "20", "30", "40"], answer: "20", explanation: "100 minus 80 equals 20 rupees change." },
      { sentence: "To cross the road safely, you look ___ then right then left again.", options: ["left", "up", "down", "behind"], answer: "left", explanation: "In Pakistan, traffic comes from the left first, so look left first." },
      { sentence: "There are ___ hours in one day.", options: ["12", "20", "24", "30"], answer: "24", explanation: "A full day and night together make 24 hours." },
      // Maths
      { sentence: "50% of Rs 200 is Rs ___.", options: ["50", "100", "150", "200"], answer: "100", explanation: "Half of 200 is 100." },
      { sentence: "If a bus leaves at 10:00 and takes 2 hours, it arrives at ___.", options: ["11:00", "12:00", "1:00", "2:00"], answer: "12:00", explanation: "10:00 plus 2 hours = 12:00 noon." },
      // English
      { sentence: "A letter to a friend is called an ___ letter.", options: ["informal", "formal", "business", "official"], answer: "informal", explanation: "Informal letters are written to people we know well." },
      // Pakistan Studies
      { sentence: "Pakistan's Independence Day is on ___ August.", options: ["12th", "14th", "15th", "23rd"], answer: "14th", explanation: "Pakistan celebrates Independence Day on 14th August every year." },
      // Physics
      { sentence: "A magnet has two poles: north and ___.", options: ["east", "west", "south", "up"], answer: "south", explanation: "Every magnet has a north pole and a south pole." },
    ],
    truefalse: [
      { statement: "You should wash your hands before eating.", answer: true, explanation: "Washing hands removes germs and keeps you healthy." },
      { statement: "It is safe to talk to strangers who offer you a ride.", answer: false, explanation: "Never get in a car with someone you do not know. Tell a trusted adult." },
      { statement: "Drinking water is good for your body.", answer: true, explanation: "Your body needs water every day to stay healthy and strong." },
      // Maths
      { statement: "If you save Rs 10 every day for a week, you save Rs 70.", answer: true, explanation: "7 days x Rs 10 = Rs 70." },
      { statement: "25% means three quarters.", answer: false, explanation: "25% means one quarter. Three quarters is 75%." },
      // English
      { statement: "A formal letter starts with 'Dear Sir/Madam'.", answer: true, explanation: "Formal letters use polite openings like Dear Sir or Dear Madam." },
      // Pakistan Studies
      { statement: "Pakistan's national animal is the markhor.", answer: true, explanation: "The markhor is a mountain goat found in Pakistan's northern areas." },
      // Chemistry
      { statement: "Salt dissolves in water.", answer: true, explanation: "Salt (NaCl) dissolves in water to form a solution." },
    ],
    picture: [
      { scenario: "You are at a shop. You want to buy a drink for Rs 50 and a sandwich for Rs 150. You have Rs 200.", prompt: "Do you have enough money? How much is left over?" },
      { scenario: "You are at school and another student says something unkind to you.", prompt: "What would you do? Who could you talk to for help?" },
      // Maths
      { scenario: "You have Rs 500. You want to buy a bag for Rs 350 and a pen for Rs 100.", prompt: "Can you buy both? How much is left over?" },
    ],
  },

  // ── CEREBRAL PALSY — SECONDARY ──
  cp_secondary: {
    match: [
      { pairs: [["Respiration", "Releasing energy from glucose"], ["Photosynthesis", "Making glucose using light"], ["Diffusion", "Particles moving from high to low concentration"], ["Osmosis", "Water moving through a membrane"]] },
      { pairs: [["Metaphor", "Direct comparison without like/as"], ["Simile", "Comparison using like or as"], ["Personification", "Giving human traits to non-human things"], ["Hyperbole", "Extreme exaggeration for effect"]] },
      // Maths
      { pairs: [["Sine rule", "a/sin A = b/sin B"], ["Cosine rule", "a² = b² + c² - 2bc cos A"], ["Area of triangle", "Half base times height"], ["Circumference", "2 times pi times r"]] },
      // English
      { pairs: [["Dramatic irony", "Audience knows more than character"], ["Foreshadowing", "Hints at what will happen"], ["Pathetic fallacy", "Weather reflects mood"], ["Juxtaposition", "Placing contrasts side by side"]] },
    ],
    fill: [
      { sentence: "The chemical formula for carbon dioxide is ___.", options: ["CO", "CO2", "C2O", "H2O"], answer: "CO2", explanation: "One carbon atom bonded to two oxygen atoms." },
      { sentence: "The angles in a triangle add up to ___ degrees.", options: ["90", "180", "270", "360"], answer: "180", explanation: "Every triangle's interior angles sum to exactly 180 degrees." },
      { sentence: "Allama Iqbal is known as the poet of the ___.", options: ["West", "East", "South", "North"], answer: "East", explanation: "Allama Iqbal is called the Poet of the East (Shair-e-Mashriq)." },
      // Maths
      { sentence: "The circumference of a circle with radius 7 cm is ___ cm (use pi = 22/7).", options: ["22", "44", "88", "154"], answer: "44", explanation: "C = 2 x pi x r = 2 x 22/7 x 7 = 44 cm." },
      { sentence: "If 3x - 7 = 14, then x = ___.", options: ["3", "5", "7", "9"], answer: "7", explanation: "3x = 21, so x = 7." },
      // Physics
      { sentence: "Power is measured in ___.", options: ["newtons", "joules", "watts", "volts"], answer: "watts", explanation: "Power = energy / time, measured in watts (W)." },
      // Chemistry
      { sentence: "In the periodic table, elements are arranged by ___ number.", options: ["mass", "atomic", "charge", "group"], answer: "atomic", explanation: "Elements are arranged in order of increasing atomic (proton) number." },
      // English
      { sentence: "Pathetic fallacy uses ___ to reflect mood.", options: ["weather", "dialogue", "numbers", "facts"], answer: "weather", explanation: "When stormy weather reflects a character's anger, that is pathetic fallacy." },
      // Pakistan Studies
      { sentence: "The Objective Resolution was passed in ___.", options: ["1947", "1949", "1956", "1973"], answer: "1949", explanation: "The Objective Resolution of 1949 laid the foundation for Pakistan's constitution." },
    ],
    truefalse: [
      { statement: "Arteries carry blood away from the heart.", answer: true, explanation: "Arteries carry oxygenated blood from the heart to the body." },
      { statement: "Shakespeare wrote in the 20th century.", answer: false, explanation: "Shakespeare wrote in the late 16th and early 17th century." },
      { statement: "The pH of a neutral substance is 7.", answer: true, explanation: "Pure water has a pH of 7, which is neutral — neither acid nor alkali." },
      // Maths
      { statement: "The exterior angles of any polygon sum to 360 degrees.", answer: true, explanation: "Regardless of the number of sides, exterior angles always total 360 degrees." },
      { statement: "The area of a circle is 2 times pi times r.", answer: false, explanation: "Area = pi times r squared. The formula 2 pi r gives the circumference." },
      // Physics
      { statement: "Work done = force times distance in the direction of force.", answer: true, explanation: "W = F x d is the work done formula." },
      // Chemistry
      { statement: "Group 1 metals react vigorously with water.", answer: true, explanation: "Alkali metals like sodium and potassium react with water, sometimes explosively." },
      // English
      { statement: "Foreshadowing gives clues about future events in a story.", answer: true, explanation: "Authors use foreshadowing to hint at what will happen later." },
      // Pakistan Studies
      { statement: "The 1973 Constitution declared Pakistan an Islamic Republic.", answer: true, explanation: "The 1973 Constitution established Pakistan as the Islamic Republic of Pakistan." },
    ],
    picture: [
      { scenario: "You are analysing a poem that says: 'The wind howled through the empty streets.' Identify the literary technique used.", prompt: "Name the technique and explain its effect on the reader." },
      { scenario: "In an experiment, you add acid to an alkali and measure the pH. It starts at 12 and drops to 7.", prompt: "What happened? What is this reaction called? What might the products be?" },
      // Maths
      { scenario: "A circular park has a diameter of 28 metres. Calculate the area and the circumference (use pi = 22/7).", prompt: "Show both calculations step by step." },
    ],
  },

  // ── VISUAL IMPAIRMENT — SECONDARY ──
  vi_secondary: {
    match: [
      { pairs: [["Democracy", "Government by the people"], ["Inflation", "Rising prices over time"], ["Migration", "Movement of people to new places"], ["Constitution", "Supreme law of a country"]] },
      { pairs: [["Velocity", "Speed in a specific direction"], ["Acceleration", "Rate of change of velocity"], ["Momentum", "Mass multiplied by velocity"], ["Inertia", "Resistance to change in motion"]] },
      // Maths
      { pairs: [["Mean", "Sum of values divided by count"], ["Median", "Middle value in ordered data"], ["Mode", "Most frequently occurring value"], ["Range", "Difference between highest and lowest"]] },
    ],
    fill: [
      { sentence: "The three states of matter are solid, liquid, and ___.", options: ["gas", "plasma", "vapour", "mist"], answer: "gas", explanation: "Solid, liquid, and gas are the three common states of matter." },
      { sentence: "Pakistan's national language is ___.", options: ["English", "Punjabi", "Urdu", "Sindhi"], answer: "Urdu", explanation: "Urdu is the national language of Pakistan, used across all provinces." },
      { sentence: "An ecosystem includes living organisms and their ___ environment.", options: ["physical", "imaginary", "digital", "emotional"], answer: "physical", explanation: "An ecosystem is the interaction between living things and their physical surroundings." },
      // Maths
      { sentence: "The mean of 4, 6, 8, 10, 12 is ___.", options: ["6", "8", "10", "12"], answer: "8", explanation: "Sum = 40. 40 divided by 5 = 8." },
      { sentence: "Solve: 5(x - 2) = 15. x = ___.", options: ["3", "5", "7", "9"], answer: "5", explanation: "x - 2 = 3, so x = 5." },
      // Physics
      { sentence: "The speed of sound in air is approximately ___ m/s.", options: ["100", "343", "500", "1000"], answer: "343", explanation: "Sound travels at about 343 metres per second in air at room temperature." },
      // Chemistry
      { sentence: "An exothermic reaction ___ heat.", options: ["absorbs", "releases", "destroys", "stores"], answer: "releases", explanation: "Exothermic reactions release heat to the surroundings." },
      // English
      { sentence: "An oxymoron combines two ___ words.", options: ["similar", "contradictory", "long", "simple"], answer: "contradictory", explanation: "Examples: 'deafening silence' or 'bittersweet'." },
      // Pakistan Studies
      { sentence: "CPEC connects Pakistan with ___.", options: ["India", "China", "Iran", "Afghanistan"], answer: "China", explanation: "The China-Pakistan Economic Corridor connects Gwadar to Kashgar." },
    ],
    truefalse: [
      { statement: "Sound needs a medium to travel through.", answer: true, explanation: "Sound cannot travel through a vacuum — it needs air, water, or a solid." },
      { statement: "The Indus River flows through Balochistan and Punjab only.", answer: false, explanation: "The Indus flows through Gilgit-Baltistan, KPK, Punjab, and Sindh." },
      { statement: "Friction is a force that opposes motion.", answer: true, explanation: "Friction acts in the opposite direction to movement, slowing things down." },
      // Maths
      { statement: "The probability of a certain event is 1.", answer: true, explanation: "A certain event has probability 1, meaning it will definitely happen." },
      { statement: "The median of 3, 7, 9 is 7.", answer: true, explanation: "When data is ordered, the middle value is 7." },
      // Physics
      { statement: "A higher pitch sound has a higher frequency.", answer: true, explanation: "Pitch is directly related to frequency — higher frequency means higher pitch." },
      // Chemistry
      { statement: "Rusting is an example of oxidation.", answer: true, explanation: "Iron reacts with oxygen and water to form iron oxide (rust)." },
      // English
      { statement: "A monologue is when one character speaks alone.", answer: true, explanation: "Mono means one. A monologue is a long speech by one person." },
      // Pakistan Studies
      { statement: "Pakistan has coastline along the Arabian Sea.", answer: true, explanation: "Pakistan's southern coast stretches along the Arabian Sea in Sindh and Balochistan." },
    ],
    picture: [
      { scenario: "Imagine holding two objects: a tennis ball and a bowling ball. You drop both from the same height at the same time.", prompt: "Which hits the ground first? Explain your reasoning using what you know about gravity and air resistance." },
      { scenario: "Think about what happens when you boil a kettle. The water gets hotter and hotter, then starts to bubble.", prompt: "Explain the process step by step. What is happening to the water particles at each stage?" },
      // Maths
      { scenario: "Scores in 5 cricket matches: 35, 42, 28, 56, 39. Calculate the mean, median, and range.", prompt: "Find all three measures of central tendency." },
    ],
  },

  // ── HEARING IMPAIRMENT — SECONDARY ──
  hi_secondary: {
    match: [
      { pairs: [["Catalyst", "Speeds up a reaction"], ["Reactant", "Substance that reacts"], ["Product", "Substance that is formed"], ["Enzyme", "Biological catalyst"]] },
      { pairs: [["Thesis", "Main argument of an essay"], ["Evidence", "Facts that support your point"], ["Analysis", "Explaining what evidence means"], ["Conclusion", "Final summary of argument"]] },
      // Maths
      { pairs: [["Equation", "Statement with equals sign"], ["Expression", "No equals sign"], ["Formula", "Rule written with symbols"], ["Identity", "True for all values"]] },
    ],
    fill: [
      { sentence: "The powerhouse of the cell is the ___.", options: ["nucleus", "ribosome", "mitochondria", "membrane"], answer: "mitochondria", explanation: "Mitochondria carry out aerobic respiration to release energy." },
      { sentence: "In English writing, a new paragraph begins when there is a change of ___.", options: ["topic", "colour", "font", "page"], answer: "topic", explanation: "Each paragraph should focus on one main idea or point." },
      { sentence: "The area of a rectangle is length multiplied by ___.", options: ["width", "height", "perimeter", "diagonal"], answer: "width", explanation: "Area = length x width for all rectangles." },
      // Maths
      { sentence: "Factorise: x² - 9 = ___.", options: ["(x-3)(x+3)", "(x-9)(x+1)", "(x-3)(x-3)", "(x+9)(x-1)"], answer: "(x-3)(x+3)", explanation: "Difference of two squares: a² - b² = (a-b)(a+b)." },
      { sentence: "The nth term of 2, 5, 8, 11 is ___.", options: ["3n - 1", "3n + 1", "2n + 1", "n + 3"], answer: "3n - 1", explanation: "Common difference is 3. First term: 3(1) - 1 = 2. Correct." },
      // Physics
      { sentence: "The unit of electrical resistance is the ___.", options: ["ampere", "volt", "ohm", "watt"], answer: "ohm", explanation: "Resistance is measured in ohms." },
      // Chemistry
      { sentence: "The pH of pure water is ___.", options: ["0", "5", "7", "14"], answer: "7", explanation: "Pure water is neutral with a pH of exactly 7." },
      // English
      { sentence: "Direct speech uses ___ marks.", options: ["question", "speech", "exclamation", "bracket"], answer: "speech", explanation: "Speech marks show the exact words someone said." },
      // Pakistan Studies
      { sentence: "The national language of Pakistan is ___.", options: ["English", "Urdu", "Punjabi", "Pashto"], answer: "Urdu", explanation: "Urdu is the national language, while English is the official language." },
    ],
    truefalse: [
      { statement: "Enzymes are proteins that speed up chemical reactions in the body.", answer: true, explanation: "Enzymes are biological catalysts made of protein." },
      { statement: "The Quaid-e-Azam's full name was Muhammad Ali Jinnah.", answer: true, explanation: "Muhammad Ali Jinnah, known as Quaid-e-Azam (Great Leader), founded Pakistan." },
      { statement: "Parallel lines eventually meet at a point.", answer: false, explanation: "Parallel lines never meet — they stay the same distance apart forever." },
      // Maths
      { statement: "A scatter graph shows the relationship between two variables.", answer: true, explanation: "Scatter graphs plot pairs of data to reveal correlation." },
      { statement: "Correlation always means causation.", answer: false, explanation: "Two things can be correlated without one causing the other." },
      // Physics
      { statement: "Current flows from positive to negative in a circuit.", answer: true, explanation: "Conventional current flows from positive to negative terminal." },
      // Chemistry
      { statement: "Noble gases are very reactive.", answer: false, explanation: "Noble gases have full outer shells and are very unreactive." },
      // English
      { statement: "Reported speech uses the exact words of the speaker.", answer: false, explanation: "Reported speech paraphrases what was said, often changing tense." },
      // Pakistan Studies
      { statement: "Pakistan's parliament is called the Majlis-e-Shoora.", answer: true, explanation: "The parliament consists of the National Assembly and the Senate." },
    ],
    picture: [
      { scenario: "Read this passage: 'The government announced a new education policy. Some people support it because it increases funding. Others oppose it because it reduces local control.'", prompt: "Write a balanced paragraph: give one argument for and one against, then state your own view." },
      { scenario: "You are given a table of data showing temperature and the rate of enzyme activity. At 37C the rate is highest. At 60C it drops to zero.", prompt: "Describe the pattern in the data. Explain why enzyme activity stops at high temperatures." },
      // Maths
      { scenario: "A pie chart shows student preferences: 40% cricket, 25% football, 20% badminton, 15% other. There are 200 students.", prompt: "How many students chose each sport? Show your calculations." },
    ],
  },

  // ── UNSURE — SECONDARY ──
  unsure_secondary: {
    match: [
      { pairs: [["Photosynthesis", "Plants making food from light"], ["Evolution", "Species changing over time"], ["Globalisation", "World becoming more connected"], ["Urbanisation", "People moving to cities"]] },
      { pairs: [["Mean", "Add all values and divide by count"], ["Median", "Middle value when sorted"], ["Mode", "Most common value"], ["Range", "Highest minus lowest"]] },
      // Maths
      { pairs: [["Standard form", "Numbers as a times 10 to the n"], ["Index notation", "Powers and roots"], ["Surds", "Irrational root expressions"], ["Reciprocal", "1 divided by a number"]] },
    ],
    fill: [
      { sentence: "The longest river in Pakistan is the ___.", options: ["Jhelum", "Chenab", "Indus", "Ravi"], answer: "Indus", explanation: "The Indus River is approximately 3,180 km long — the longest in Pakistan." },
      { sentence: "An equation is balanced when both sides are ___.", options: ["different", "equal", "empty", "negative"], answer: "equal", explanation: "The equals sign means the left side has the same value as the right side." },
      { sentence: "The human body has ___ pairs of chromosomes.", options: ["21", "23", "25", "46"], answer: "23", explanation: "Humans have 23 pairs (46 total) chromosomes in each cell." },
      // Maths
      { sentence: "Express 0.0035 in standard form: ___.", options: ["3.5 x 10 to the -3", "35 x 10 to the -4", "3.5 x 10 to the 3", "0.35 x 10 to the -2"], answer: "3.5 x 10 to the -3", explanation: "Move decimal 3 places right: 3.5 x 10 to the -3." },
      { sentence: "The interior angle sum of a hexagon is ___ degrees.", options: ["540", "720", "900", "1080"], answer: "720", explanation: "(6-2) x 180 = 720 degrees." },
      // Physics
      { sentence: "Acceleration due to gravity on Earth is approximately ___ m/s².", options: ["5", "10", "15", "20"], answer: "10", explanation: "Gravity accelerates objects at approximately 9.8 m/s² (about 10 m/s²)." },
      // Chemistry
      { sentence: "Photosynthesis produces glucose and ___.", options: ["nitrogen", "oxygen", "hydrogen", "carbon"], answer: "oxygen", explanation: "6CO2 + 6H2O produces C6H12O6 + 6O2. Oxygen is released." },
      // English
      { sentence: "The purpose of a rhetorical question is to make the reader ___.", options: ["think", "laugh", "cry", "sleep"], answer: "think", explanation: "Rhetorical questions do not need an answer — they provoke thought." },
      // Pakistan Studies
      { sentence: "Pakistan's first constitution was adopted in ___.", options: ["1947", "1949", "1956", "1962"], answer: "1956", explanation: "Pakistan's first constitution was adopted on 23rd March 1956." },
    ],
    truefalse: [
      { statement: "The Earth's atmosphere is mostly nitrogen.", answer: true, explanation: "About 78% of the atmosphere is nitrogen, 21% oxygen." },
      { statement: "A verb is a describing word.", answer: false, explanation: "A verb is a doing/action word. An adjective is a describing word." },
      { statement: "The Karakoram Highway connects Pakistan and China.", answer: true, explanation: "The KKH runs from Islamabad to Kashgar, crossing the Karakoram mountains." },
      // Maths
      { statement: "The square root of 2 is an irrational number.", answer: true, explanation: "The square root of 2 cannot be expressed as a fraction — it goes on forever." },
      { statement: "The volume of a cube with side 3 cm is 9 cubic cm.", answer: false, explanation: "Volume = 3 cubed = 27 cubic cm." },
      // Physics
      { statement: "Weight is a force and is measured in newtons.", answer: true, explanation: "Weight = mass x gravity. Since gravity produces force, weight is in newtons." },
      // Chemistry
      { statement: "Compounds can be separated by physical methods.", answer: false, explanation: "Compounds need chemical reactions to separate. Mixtures use physical methods." },
      // English
      { statement: "An emotive language technique aims to trigger feelings.", answer: true, explanation: "Writers use emotive language to influence the reader's emotions." },
      // Pakistan Studies
      { statement: "Gwadar Port is located in Balochistan.", answer: true, explanation: "Gwadar is a deep-sea port on Balochistan's coast, part of CPEC." },
    ],
    picture: [
      { scenario: "You are given a bar chart showing the population of five Pakistani cities: Karachi (15M), Lahore (12M), Faisalabad (3M), Rawalpindi (2M), Islamabad (1M).", prompt: "Which city has the largest population? What is the total? Estimate how many times bigger Karachi is compared to Islamabad." },
      { scenario: "Your friend says: 'I revised for 2 hours but still failed the test.' They want your advice.", prompt: "Suggest three specific study strategies they could try. Why might each one help?" },
      // Maths
      { scenario: "A container is shaped like a cylinder with radius 5 cm and height 10 cm.", prompt: "Calculate the volume (use pi = 3.14). If you fill it with water, how many ml does it hold?" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // SIXTH FORM STAGE (Ages 16–18, A-Level)
  // ═══════════════════════════════════════════════════════════════════════

  // ── AUTISM — SIXTH FORM ──
  autism_sixthform: {
    match: [
      { pairs: [["Supply", "Amount producers offer at a given price"], ["Demand", "Amount consumers want at a given price"], ["Equilibrium", "Where supply equals demand"], ["Elasticity", "How responsive quantity is to price change"]] },
      { pairs: [["Classical conditioning", "Learning by association (Pavlov)"], ["Operant conditioning", "Learning by consequences (Skinner)"], ["Schema", "Mental framework for organising knowledge"], ["Cognitive dissonance", "Discomfort from conflicting beliefs"]] },
      // A-Level Maths
      { pairs: [["Differentiation", "Finding the rate of change"], ["Integration", "Finding the area under a curve"], ["Binomial expansion", "(a+b) to the n expanded as a series"], ["Logarithm", "Inverse of exponential function"]] },
      // Biology
      { pairs: [["ATP", "Energy currency of the cell"], ["DNA polymerase", "Enzyme that copies DNA"], ["mRNA", "Carries genetic code to ribosome"], ["tRNA", "Brings amino acids to ribosome"]] },
    ],
    fill: [
      { sentence: "When demand increases and supply stays the same, the price ___.", options: ["rises", "falls", "stays the same", "doubles"], answer: "rises", explanation: "Higher demand with fixed supply creates scarcity, pushing prices up." },
      { sentence: "The derivative of x² with respect to x is ___.", options: ["x", "2x", "2x²", "x³"], answer: "2x", explanation: "Using the power rule: bring down the exponent and reduce it by one." },
      { sentence: "In psychology, the independent variable is the one the researcher ___.", options: ["measures", "manipulates", "observes", "ignores"], answer: "manipulates", explanation: "The IV is deliberately changed to observe its effect on the DV." },
      // A-Level Maths
      { sentence: "The derivative of sin(x) is ___.", options: ["cos(x)", "-sin(x)", "-cos(x)", "tan(x)"], answer: "cos(x)", explanation: "d/dx [sin(x)] = cos(x) is a standard result." },
      { sentence: "ln(e) = ___.", options: ["0", "1", "e", "2"], answer: "1", explanation: "The natural log of e is 1 because e to the power 1 = e." },
      // Economics
      { sentence: "When supply decreases and demand stays the same, price ___.", options: ["rises", "falls", "stays same", "disappears"], answer: "rises", explanation: "Less supply with same demand creates scarcity, pushing price up." },
      // Psychology
      { sentence: "Milgram's study investigated ___.", options: ["memory", "obedience", "conformity", "aggression"], answer: "obedience", explanation: "Milgram studied obedience to authority using fake electric shocks." },
      // Biology
      { sentence: "The Krebs cycle takes place in the ___.", options: ["cytoplasm", "nucleus", "mitochondrial matrix", "ribosome"], answer: "mitochondrial matrix", explanation: "The Krebs cycle occurs in the matrix of the mitochondria." },
      // English
      { sentence: "In literary criticism, a text's deeper meaning beyond the literal is called ___.", options: ["subtext", "context", "pretext", "hypertext"], answer: "subtext", explanation: "Subtext is the underlying meaning beneath what is explicitly stated." },
    ],
    truefalse: [
      { statement: "GDP measures the total value of goods and services produced in a country.", answer: true, explanation: "Gross Domestic Product is the standard measure of a country's economic output." },
      { statement: "In classical conditioning, the unconditioned stimulus is learned.", answer: false, explanation: "The unconditioned stimulus naturally triggers a response — no learning needed." },
      { statement: "Entropy in a closed system always tends to increase.", answer: true, explanation: "The second law of thermodynamics states that entropy (disorder) increases over time." },
      // A-Level Maths
      { statement: "The integral of 1/x is ln|x| + C.", answer: true, explanation: "This is a standard integral that appears frequently in A-Level Maths." },
      { statement: "The chain rule is used for integrating composite functions.", answer: false, explanation: "The chain rule is for differentiation. Integration uses substitution." },
      // Economics
      { statement: "The State Bank of Pakistan sets monetary policy.", answer: true, explanation: "The SBP controls interest rates and money supply in Pakistan." },
      // Psychology
      { statement: "Ethical guidelines require informed consent from participants.", answer: true, explanation: "Participants must know what they are agreeing to before a study begins." },
      // Biology
      { statement: "Glycolysis occurs in the cytoplasm.", answer: true, explanation: "Glycolysis is the first stage of respiration and takes place in the cytoplasm." },
      // English
      { statement: "A bildungsroman is a coming-of-age novel.", answer: true, explanation: "Bildungsroman traces the growth and education of the protagonist." },
    ],
    picture: [
      { scenario: "Essay question: 'Evaluate the extent to which free market economics benefits developing countries like Pakistan.' You need to write a structured plan.", prompt: "Create a clear plan: introduction thesis, 3 body paragraphs (point, evidence, analysis for each), and a conclusion. Use the PEEL structure." },
      { scenario: "A psychology study claims that students who sleep 8 hours perform better in exams than those who sleep 5 hours. The sample was 20 students from one school.", prompt: "Evaluate this study. Discuss sample size, generalisability, confounding variables, and ethical considerations." },
      // A-Level Maths
      { scenario: "Find the stationary points of y = x cubed - 3x squared + 4. Determine if each is a maximum or minimum.", prompt: "Differentiate, set dy/dx = 0, and use the second derivative test." },
    ],
  },

  // ── ADHD — SIXTH FORM ──
  adhd_sixthform: {
    match: [
      { pairs: [["Opportunity cost", "What you give up when you choose"], ["Moral hazard", "Taking risks because you won't bear the cost"], ["Sunk cost", "Money spent that you can't get back"], ["Externality", "Cost or benefit affecting a third party"]] },
      { pairs: [["Mitosis", "Cell division for growth (identical)"], ["Meiosis", "Cell division for gametes (halved)"], ["Mutation", "Change in DNA sequence"], ["Genotype", "Genetic makeup of an organism"]] },
      // A-Level Maths
      { pairs: [["dy/dx", "First derivative"], ["d²y/dx²", "Second derivative"], ["Integral sign", "Integral symbol"], ["Sigma", "Sum of a series"]] },
    ],
    fill: [
      { sentence: "A recession is defined as ___ consecutive quarters of negative GDP growth.", options: ["one", "two", "three", "four"], answer: "two", explanation: "Two quarters of shrinking economy = recession. Quick and brutal." },
      { sentence: "The speed of light is approximately ___ m/s.", options: ["3 x 10⁶", "3 x 10⁸", "3 x 10¹⁰", "3 x 10¹²"], answer: "3 x 10⁸", explanation: "Light travels at about 300,000,000 metres per second. Nothing is faster." },
      { sentence: "In a normal distribution, approximately ___% of data falls within one standard deviation of the mean.", options: ["50", "68", "95", "99"], answer: "68", explanation: "The 68-95-99.7 rule. About 68% within 1 SD, 95% within 2, 99.7% within 3." },
      // A-Level Maths
      { sentence: "The integral of 3x² is ___.", options: ["x³ + C", "6x + C", "3x³ + C", "x³/3 + C"], answer: "x³ + C", explanation: "Increase power by 1 and divide: 3x³/3 = x³. Add C!" },
      { sentence: "If f(x) = e to the 2x, then f'(x) = ___.", options: ["e to the 2x", "2e to the 2x", "2e to the x", "e²"], answer: "2e to the 2x", explanation: "Chain rule: multiply by the derivative of the power. 2 times e to the 2x." },
      // Economics
      { sentence: "Pakistan's main export crop is ___.", options: ["wheat", "rice", "cotton", "sugarcane"], answer: "cotton", explanation: "Cotton is Pakistan's largest export crop. Pakistan is the 5th largest producer!" },
      // Psychology
      { sentence: "The fight-or-flight response is controlled by the ___ nervous system.", options: ["sympathetic", "parasympathetic", "central", "somatic"], answer: "sympathetic", explanation: "The sympathetic nervous system activates in danger. Adrenaline rush!" },
      // Biology
      { sentence: "The total ATP yield from one glucose molecule in aerobic respiration is approximately ___.", options: ["2", "4", "18", "38"], answer: "38", explanation: "Glycolysis (2) + Krebs (2) + oxidative phosphorylation (34) = about 38 ATP!" },
      // English
      { sentence: "The unreliable narrator technique makes the reader question the story's ___.", options: ["truth", "length", "genre", "author"], answer: "truth", explanation: "An unreliable narrator forces you to decide what is real. Mind games!" },
    ],
    truefalse: [
      { statement: "Bananas are technically berries, but strawberries are not.", answer: true, explanation: "Botanically, bananas qualify as berries. Strawberries are 'accessory fruits.' Mind blown." },
      { statement: "Humans only use 10% of their brains.", answer: false, explanation: "Total myth! Brain scans show we use virtually all parts of the brain." },
      { statement: "Hot water can freeze faster than cold water under certain conditions.", answer: true, explanation: "This is the Mpemba effect — counterintuitive but experimentally observed." },
      // A-Level Maths
      { statement: "A geometric sequence has a common ratio.", answer: true, explanation: "Each term is multiplied by the common ratio to get the next." },
      { statement: "log base 10 of 100 = 3.", answer: false, explanation: "log base 10 of 100 = 2 because 10 squared = 100. Close but no!" },
      // Economics
      { statement: "A monopoly means only one seller in the market.", answer: true, explanation: "Mono = one, poly = seller. One firm dominates the entire market." },
      // Psychology
      { statement: "Asch's study showed people conform even when the answer is clearly wrong.", answer: true, explanation: "About 75% conformed at least once. Peer pressure is real!" },
      // Biology
      { statement: "Red blood cells have no nucleus.", answer: true, explanation: "Mature red blood cells lose their nucleus to carry more haemoglobin!" },
      // English
      { statement: "Stream of consciousness mimics the flow of thoughts.", answer: true, explanation: "This technique shows the character's raw, unfiltered mental process." },
    ],
    picture: [
      { scenario: "Debate topic: 'Social media does more harm than good for young people.' You have 2 minutes to prepare your argument FOR the motion.", prompt: "Build your case: 3 punchy arguments with real-world evidence. Make it persuasive — go!" },
      { scenario: "You are launching a startup that solves one problem in Pakistan's education system. You have 60 seconds to pitch to an investor.", prompt: "What is the problem? What is your solution? Why will it work? Deliver your elevator pitch!" },
      // A-Level Maths
      { scenario: "A particle moves along a line with velocity v = 3t² - 12t + 9 m/s.", prompt: "When is the particle at rest? Find the displacement in the first 3 seconds." },
    ],
  },

  // ── DYSLEXIA — SIXTH FORM ──
  dyslexia_sixthform: {
    match: [
      { pairs: [["Inflation", "Prices going up over time"], ["Unemployment", "People who want jobs but cannot find them"], ["Interest rate", "Cost of borrowing money"], ["Exchange rate", "Value of one currency against another"]] },
      { pairs: [["Natural selection", "Survival of the fittest"], ["Adaptation", "Trait that helps survival"], ["Speciation", "One species becoming two"], ["Biodiversity", "Variety of life in an area"]] },
      // A-Level Maths
      { pairs: [["Gradient", "Steepness of a line"], ["Intercept", "Where the line crosses an axis"], ["Asymptote", "A line the curve approaches but never touches"], ["Tangent", "Line that just touches a curve"]] },
    ],
    fill: [
      { sentence: "When interest rates rise, borrowing becomes more ___.", options: ["expensive", "cheap", "common", "rare"], answer: "expensive", explanation: "Higher interest rates mean you pay more back on loans." },
      { sentence: "The human heart has ___ chambers.", options: ["2", "3", "4", "5"], answer: "4", explanation: "Two atria on top and two ventricles on the bottom." },
      { sentence: "In an essay, each paragraph should have one main ___.", options: ["word", "idea", "quote", "question"], answer: "idea", explanation: "One idea per paragraph keeps your writing clear and structured." },
      // A-Level Maths
      { sentence: "The gradient of the tangent to a curve at a point equals the ___.", options: ["derivative", "integral", "area", "intercept"], answer: "derivative", explanation: "The derivative gives the gradient at any point on the curve." },
      // Economics
      { sentence: "GDP stands for Gross ___ Product.", options: ["Daily", "Domestic", "Direct", "Digital"], answer: "Domestic", explanation: "GDP measures the total value of goods and services produced in a country." },
      // Psychology
      { sentence: "Short-term memory can hold about ___ items.", options: ["3", "5", "7", "12"], answer: "7", explanation: "Miller said short-term memory holds 7 plus or minus 2 items." },
      // Biology
      { sentence: "DNA is made of two strands twisted into a ___.", options: ["circle", "double helix", "square", "triangle"], answer: "double helix", explanation: "Watson and Crick discovered DNA's double helix shape in 1953." },
      // English
      { sentence: "An allegory tells one story but means ___.", options: ["nothing", "something else", "the same thing", "a joke"], answer: "something else", explanation: "Allegories use symbolism to convey a deeper message." },
    ],
    truefalse: [
      { statement: "DNA stands for deoxyribonucleic acid.", answer: true, explanation: "DNA is the molecule that carries genetic instructions." },
      { statement: "Pakistan has a federal system of government.", answer: true, explanation: "Pakistan is a federal republic with provinces that have their own governments." },
      { statement: "All metals are solid at room temperature.", answer: false, explanation: "Mercury is a metal that is liquid at room temperature." },
      // A-Level Maths
      { statement: "A quadratic equation can have at most 2 real roots.", answer: true, explanation: "Quadratics are degree 2, so they have at most 2 roots." },
      // Economics
      { statement: "Inflation means the general rise in prices over time.", answer: true, explanation: "When prices go up across the economy, that is inflation." },
      // Psychology
      { statement: "Long-term memory has unlimited capacity.", answer: true, explanation: "There is no known limit to how much long-term memory can store." },
      // Biology
      { statement: "Mitosis produces two identical daughter cells.", answer: true, explanation: "Mitosis creates two cells with the same chromosomes as the parent." },
      // English
      { statement: "Context means the time and place a text was written.", answer: true, explanation: "Understanding context helps you interpret what an author meant." },
    ],
    picture: [
      { scenario: "A company's profits went down by 20% this year. The CEO says it is because of the economy. A critic says it is because of bad management.", prompt: "Consider both sides. Which argument is stronger? What evidence would you need to decide?" },
      { scenario: "Think about this claim: 'Technology has made life easier for everyone.'", prompt: "Do you agree or disagree? Give two reasons for your view, using examples from real life." },
      // A-Level Maths
      { scenario: "Sketch the graph of y = 2 to the x. Describe what happens as x approaches negative infinity and positive infinity.", prompt: "Explain the shape, the asymptote, and the y-intercept." },
    ],
  },

  // ── DOWN SYNDROME — SIXTH FORM ──
  ds_sixthform: {
    match: [
      { pairs: [["CV", "Document listing your skills and experience"], ["Interview", "Meeting where employer asks you questions"], ["Reference", "Someone who says you are a good worker"], ["Salary", "Money you earn from a job"]] },
      { pairs: [["Debit card", "Money comes from your bank account"], ["Credit card", "You borrow money and pay back later"], ["Receipt", "Proof that you paid"], ["Budget", "Plan for how to spend your money"]] },
      // Maths (life skills)
      { pairs: [["Interest", "Extra money the bank pays you"], ["Percentage", "Number out of 100"], ["Discount", "Money taken off the price"], ["Tax", "Money paid to the government"]] },
    ],
    fill: [
      { sentence: "If you earn Rs 30,000 per month and spend Rs 25,000, you save Rs ___.", options: ["3,000", "5,000", "10,000", "25,000"], answer: "5,000", explanation: "30,000 minus 25,000 equals 5,000 rupees saved each month." },
      { sentence: "When catching a bus, you should wait at the ___.", options: ["bus stop", "traffic light", "roundabout", "car park"], answer: "bus stop", explanation: "Always wait at the designated bus stop where the bus will pull over safely." },
      { sentence: "In an emergency in Pakistan, you call ___.", options: ["999", "911", "1122", "100"], answer: "1122", explanation: "Rescue 1122 is the emergency number in Pakistan for ambulance and rescue." },
      // Maths
      { sentence: "If you save Rs 50,000 at 10% interest for 1 year, you earn Rs ___.", options: ["500", "5,000", "50,000", "55,000"], answer: "5,000", explanation: "10% of 50,000 = 5,000 rupees interest." },
      { sentence: "A 20% discount on Rs 1,000 saves you Rs ___.", options: ["100", "200", "300", "400"], answer: "200", explanation: "20/100 x 1,000 = Rs 200 saved." },
      // English
      { sentence: "When writing an essay, you should always include ___.", options: ["evidence", "pictures", "jokes", "songs"], answer: "evidence", explanation: "Good essays use evidence from the text to support their points." },
      // Psychology
      { sentence: "Psychology is the study of the ___ and behaviour.", options: ["mind", "body", "world", "weather"], answer: "mind", explanation: "Psychology studies how people think, feel, and behave." },
      // Biology
      { sentence: "The ___ carries blood away from the heart.", options: ["vein", "artery", "capillary", "nerve"], answer: "artery", explanation: "Arteries carry blood away from the heart. Remember: A for Away." },
    ],
    truefalse: [
      { statement: "You should arrive on time for a job interview.", answer: true, explanation: "Being on time shows respect and that you are reliable." },
      { statement: "You can use someone else's bank card without asking.", answer: false, explanation: "Using someone else's card without permission is not allowed — always use your own." },
      { statement: "Reading food labels helps you know what you are eating.", answer: true, explanation: "Food labels tell you about ingredients, calories, and expiry dates." },
      // Maths
      { statement: "If something costs Rs 100 and tax is 10%, the total is Rs 110.", answer: true, explanation: "Rs 100 + 10% tax (Rs 10) = Rs 110 total." },
      { statement: "50% off means you pay nothing.", answer: false, explanation: "50% off means you pay half the price, not zero." },
      // Psychology
      { statement: "Everyone's brain works differently.", answer: true, explanation: "No two brains are exactly alike — everyone has unique strengths." },
      // Biology
      { statement: "The heart pumps blood to the whole body.", answer: true, explanation: "The heart is a pump that sends blood to every part of your body." },
      // English
      { statement: "An essay should have a clear structure.", answer: true, explanation: "Introduction, body paragraphs, and conclusion keep writing organised." },
    ],
    picture: [
      { scenario: "You have a job interview tomorrow at a shop. You need to be there at 10 AM. The bus takes 30 minutes.", prompt: "What time should you leave? What should you wear? What might they ask you?" },
      { scenario: "You are at a train station for the first time. You need to buy a ticket, find the right platform, and get on the correct train.", prompt: "What steps do you take? Who can you ask for help if you are confused?" },
      // Maths
      { scenario: "You earn Rs 25,000 per month. Your expenses are: rent Rs 10,000, food Rs 5,000, transport Rs 3,000, phone Rs 2,000.", prompt: "How much can you save each month? What percentage of income is that?" },
    ],
  },

  // ── CEREBRAL PALSY — SIXTH FORM ──
  cp_sixthform: {
    match: [
      { pairs: [["Electrolysis", "Using electricity to decompose a compound"], ["Titration", "Finding concentration by neutralisation"], ["Chromatography", "Separating mixtures by solubility"], ["Distillation", "Separating by boiling points"]] },
      { pairs: [["Utilitarianism", "Greatest good for the greatest number"], ["Deontology", "Actions are right or wrong regardless of outcome"], ["Virtue ethics", "Focus on moral character"], ["Social contract", "People agree to rules for mutual benefit"]] },
      // A-Level Maths
      { pairs: [["Proof by contradiction", "Assume opposite, find impossibility"], ["Proof by induction", "Base case + inductive step"], ["Binomial theorem", "Expanding (a+b) to the n"], ["Partial fractions", "Breaking a fraction into simpler parts"]] },
      // Biology
      { pairs: [["Transcription", "DNA to mRNA in the nucleus"], ["Translation", "mRNA to protein at ribosome"], ["Replication", "DNA copying itself"], ["Mutation", "Change in base sequence"]] },
    ],
    fill: [
      { sentence: "The integral of 2x with respect to x is ___.", options: ["x²", "x² + C", "2x²", "2x² + C"], answer: "x² + C", explanation: "Integration reverses differentiation. The constant C accounts for unknowns." },
      { sentence: "In A-Level Biology, the lock-and-key model describes how ___ work.", options: ["enzymes", "hormones", "nerves", "muscles"], answer: "enzymes", explanation: "The enzyme's active site has a specific shape that fits only its substrate." },
      { sentence: "The Treaty of Westphalia (1648) established the principle of state ___.", options: ["sovereignty", "democracy", "federalism", "communism"], answer: "sovereignty", explanation: "Westphalia established that each state has authority over its own territory." },
      // A-Level Maths
      { sentence: "The binomial coefficient C(n,r) = n! / (r! times ___).", options: ["(n-r)!", "(n+r)!", "n!", "r!"], answer: "(n-r)!", explanation: "C(n,r) = n! / [r!(n-r)!] is the combinations formula." },
      { sentence: "d/dx [ln(2x+1)] = ___.", options: ["1/(2x+1)", "2/(2x+1)", "2x+1", "1/2x"], answer: "2/(2x+1)", explanation: "Chain rule: 1/(2x+1) times 2 = 2/(2x+1)." },
      // Economics
      { sentence: "Price elasticity of demand measures how quantity demanded responds to a change in ___.", options: ["supply", "price", "income", "taste"], answer: "price", explanation: "PED = % change in quantity demanded / % change in price." },
      // Psychology
      { sentence: "Bandura's Bobo doll study demonstrated ___ learning.", options: ["classical", "operant", "observational", "cognitive"], answer: "observational", explanation: "Children imitated aggressive behaviour they observed in adults." },
      // Biology
      { sentence: "A codon is a sequence of ___ bases on mRNA.", options: ["2", "3", "4", "5"], answer: "3", explanation: "Each codon of 3 bases codes for one amino acid." },
      // English
      { sentence: "Post-colonial literature explores the effects of ___.", options: ["colonialism", "technology", "weather", "fashion"], answer: "colonialism", explanation: "Post-colonial texts examine cultural identity after colonial rule." },
    ],
    truefalse: [
      { statement: "In physics, work is defined as force multiplied by distance.", answer: true, explanation: "Work (joules) = Force (newtons) x Distance (metres) in the direction of force." },
      { statement: "All chemical reactions are reversible.", answer: false, explanation: "Some reactions, like combustion, are irreversible under normal conditions." },
      { statement: "Pakistan's 1973 Constitution is still the governing document today.", answer: true, explanation: "The 1973 Constitution, with amendments, remains in force." },
      // A-Level Maths
      { statement: "The area under a velocity-time graph gives displacement.", answer: true, explanation: "Integrating velocity with respect to time gives displacement." },
      { statement: "All continuous functions are differentiable.", answer: false, explanation: "A function can be continuous but not differentiable (e.g., |x| at x=0)." },
      // Economics
      { statement: "Merit goods are under-provided by the free market.", answer: true, explanation: "Education and healthcare are merit goods — people undervalue their benefits." },
      // Psychology
      { statement: "The ego operates on the reality principle according to Freud.", answer: true, explanation: "The ego mediates between the id's desires and the real world." },
      // Biology
      { statement: "Semi-conservative replication means each new DNA molecule has one old and one new strand.", answer: true, explanation: "Meselson-Stahl proved DNA replication is semi-conservative." },
      // English
      { statement: "Feminist criticism examines gender representation in texts.", answer: true, explanation: "Feminist literary criticism analyses how texts portray and construct gender." },
    ],
    picture: [
      { scenario: "A-Level essay: 'To what extent was the partition of India in 1947 inevitable?' You have sources showing both political negotiation failures and grassroots communal tension.", prompt: "Plan a full essay: thesis statement, 3-4 analytical paragraphs, and a nuanced conclusion. Consider multiple perspectives." },
      { scenario: "You are given a graph showing the rate of reaction over time. The curve rises steeply at first, then levels off. Temperature was kept constant.", prompt: "Explain the shape of the curve. What is happening to reactant concentration? What would happen if you increased the temperature?" },
      // A-Level Maths
      { scenario: "Using proof by induction, prove that the sum of the first n natural numbers is n(n+1)/2.", prompt: "State the base case, the inductive hypothesis, and the inductive step clearly." },
    ],
  },

  // ── VISUAL IMPAIRMENT — SIXTH FORM ──
  vi_sixthform: {
    match: [
      { pairs: [["Empiricism", "Knowledge comes from experience"], ["Rationalism", "Knowledge comes from reason"], ["Positivism", "Only observable facts are valid"], ["Relativism", "Truth depends on perspective"]] },
      { pairs: [["Fiscal policy", "Government spending and taxation"], ["Monetary policy", "Central bank controls money supply"], ["Quantitative easing", "Central bank creates new money"], ["Austerity", "Cutting government spending to reduce debt"]] },
      // A-Level Maths
      { pairs: [["Arithmetic sequence", "Constant difference between terms"], ["Geometric sequence", "Constant ratio between terms"], ["Convergent series", "Sum approaches a finite value"], ["Divergent series", "Sum grows without bound"]] },
    ],
    fill: [
      { sentence: "In economics, a public good is non-excludable and non-___.", options: ["rival", "profitable", "legal", "taxable"], answer: "rival", explanation: "Public goods like street lighting can be used by many without reducing availability." },
      { sentence: "The process by which mRNA is made from DNA is called ___.", options: ["translation", "transcription", "replication", "mutation"], answer: "transcription", explanation: "Transcription copies DNA into mRNA in the nucleus." },
      { sentence: "In philosophy, an argument is valid when the conclusion ___ follows from the premises.", options: ["logically", "emotionally", "always", "sometimes"], answer: "logically", explanation: "Validity means if the premises are true, the conclusion must be true." },
      // A-Level Maths
      { sentence: "The 10th term of the arithmetic sequence 3, 7, 11, 15... is ___.", options: ["39", "43", "47", "51"], answer: "39", explanation: "a = 3, d = 4. T10 = 3 + (10-1) times 4 = 3 + 36 = 39." },
      { sentence: "If dy/dx = 0 and the second derivative is positive, the point is a ___.", options: ["maximum", "minimum", "inflection", "saddle"], answer: "minimum", explanation: "Positive second derivative means the curve is concave up — a minimum." },
      // Economics
      { sentence: "A progressive tax takes a larger percentage from ___.", options: ["lower incomes", "higher incomes", "everyone equally", "businesses only"], answer: "higher incomes", explanation: "Progressive taxation means higher earners pay a larger proportion." },
      // Psychology
      { sentence: "Cognitive Behavioural Therapy aims to change unhelpful ___.", options: ["thoughts", "genes", "reflexes", "hormones"], answer: "thoughts", explanation: "CBT helps people identify and change negative thinking patterns." },
      // Biology
      { sentence: "The part of the brain responsible for balance is the ___.", options: ["cerebrum", "cerebellum", "medulla", "hypothalamus"], answer: "cerebellum", explanation: "The cerebellum coordinates movement and balance." },
      // English
      { sentence: "The narrative voice in a novel determines whose ___ the story is told from.", options: ["perspective", "language", "age", "country"], answer: "perspective", explanation: "First person, third person limited, or omniscient — each shapes meaning." },
    ],
    truefalse: [
      { statement: "Correlation always implies causation.", answer: false, explanation: "Two things can be correlated without one causing the other — a fundamental principle in research." },
      { statement: "In Pakistan, the Senate represents the provinces equally.", answer: true, explanation: "Each province has equal representation in the Senate regardless of population." },
      { statement: "An exothermic reaction releases energy to the surroundings.", answer: true, explanation: "Exothermic reactions give out heat — like combustion or neutralisation." },
      // A-Level Maths
      { statement: "The derivative of a constant is zero.", answer: true, explanation: "Constants do not change, so their rate of change is zero." },
      { statement: "Integration always requires the +C constant.", answer: false, explanation: "Only indefinite integrals need +C. Definite integrals have limits and give a number." },
      // Economics
      { statement: "A trade deficit means a country imports more than it exports.", answer: true, explanation: "When imports exceed exports, the balance of trade is negative — a deficit." },
      // Psychology
      { statement: "Loftus and Palmer showed that leading questions can distort memory.", answer: true, explanation: "The wording of questions affected participants' memory of a car crash." },
      // Biology
      { statement: "Hormones travel through the bloodstream.", answer: true, explanation: "Hormones are chemical messengers transported via the blood to target organs." },
      // English
      { statement: "A soliloquy in drama is when a character speaks their thoughts aloud alone on stage.", answer: true, explanation: "Soliloquies reveal inner thoughts directly to the audience." },
    ],
    picture: [
      { scenario: "Consider this ethical dilemma: A self-driving car must choose between hitting one person or swerving into five people. There is no safe option.", prompt: "Analyse this using two ethical frameworks (e.g., utilitarianism vs deontology). What would each approach suggest? What is your own view?" },
      { scenario: "You are revising the topic of natural selection. Explain the full process to someone who has never studied biology.", prompt: "Walk through it step by step: variation, competition, survival, reproduction, and inheritance. Use a real-world example." },
      // A-Level Maths
      { scenario: "A ball is thrown upward with velocity v = 30 - 10t m/s. Find the maximum height reached.", prompt: "Integrate to find displacement. The ball reaches maximum height when v = 0." },
    ],
  },

  // ── HEARING IMPAIRMENT — SIXTH FORM ──
  hi_sixthform: {
    match: [
      { pairs: [["Covalent bond", "Atoms share electrons"], ["Ionic bond", "Electrons are transferred"], ["Metallic bond", "Electrons delocalised in a sea"], ["Hydrogen bond", "Weak attraction between polar molecules"]] },
      { pairs: [["Functionalism", "Society works like a body — each part has a role"], ["Marxism", "Society is shaped by class conflict"], ["Feminism", "Focus on gender inequality"], ["Interactionism", "Society is built through daily interactions"]] },
      // A-Level Maths
      { pairs: [["Scalar", "Has magnitude only"], ["Vector", "Has magnitude and direction"], ["Unit vector", "Magnitude of exactly 1"], ["Position vector", "Points from origin to a point"]] },
    ],
    fill: [
      { sentence: "In a covalent bond, atoms ___ electrons.", options: ["share", "transfer", "destroy", "absorb"], answer: "share", explanation: "Covalent bonding involves the sharing of electron pairs between atoms." },
      { sentence: "The standard form of 0.00045 is ___.", options: ["4.5 x 10⁻⁴", "45 x 10⁻⁴", "4.5 x 10⁴", "0.45 x 10⁻³"], answer: "4.5 x 10⁻⁴", explanation: "Move the decimal point 4 places to the right to get 4.5, so the power is -4." },
      { sentence: "In sociology, Durkheim studied the role of ___ in maintaining social order.", options: ["religion", "technology", "media", "sport"], answer: "religion", explanation: "Durkheim argued that religion creates shared values and social cohesion." },
      // A-Level Maths
      { sentence: "The magnitude of vector (3, 4) is ___.", options: ["5", "7", "12", "25"], answer: "5", explanation: "Square root of (3 squared + 4 squared) = square root of 25 = 5." },
      { sentence: "The equation of a circle with centre (0,0) and radius 5 is x² + y² = ___.", options: ["5", "10", "25", "50"], answer: "25", explanation: "x² + y² = r². When r = 5, r² = 25." },
      // Economics
      { sentence: "Market failure occurs when resources are not allocated ___.", options: ["efficiently", "quickly", "slowly", "privately"], answer: "efficiently", explanation: "Market failure means the free market does not achieve optimal allocation." },
      // Psychology
      { sentence: "Pavlov's dog experiment is an example of ___ conditioning.", options: ["classical", "operant", "observational", "social"], answer: "classical", explanation: "The dog learned to associate the bell with food — classical conditioning." },
      // Biology
      { sentence: "Haemoglobin carries ___ in red blood cells.", options: ["glucose", "oxygen", "carbon dioxide", "water"], answer: "oxygen", explanation: "Haemoglobin binds to oxygen in the lungs and releases it in tissues." },
      // English
      { sentence: "Dramatic irony occurs when the audience knows something the ___ does not.", options: ["character", "author", "publisher", "teacher"], answer: "character", explanation: "This creates tension and engagement as the audience anticipates events." },
    ],
    truefalse: [
      { statement: "Diamond and graphite are both forms of carbon.", answer: true, explanation: "They are allotropes of carbon — same element, different structures." },
      { statement: "In statistics, a Type I error means accepting a false hypothesis.", answer: false, explanation: "Type I error means rejecting a true null hypothesis (false positive)." },
      { statement: "The Pakistan Movement was led by the All-India Muslim League.", answer: true, explanation: "The Muslim League, under Jinnah's leadership, led the movement for a separate Muslim state." },
      // A-Level Maths
      { statement: "Two perpendicular lines have gradients whose product is -1.", answer: true, explanation: "If m1 times m2 = -1, the lines are perpendicular." },
      // Economics
      { statement: "Subsidies are payments from the government to producers.", answer: true, explanation: "Subsidies lower costs for producers and can reduce prices for consumers." },
      // Psychology
      { statement: "A case study examines one individual in great detail.", answer: true, explanation: "Case studies provide rich, in-depth data about a single person or group." },
      // Biology
      { statement: "Antibodies are produced by white blood cells.", answer: true, explanation: "B-lymphocytes produce antibodies as part of the immune response." },
      // English
      { statement: "A motif is a recurring element that supports the theme.", answer: true, explanation: "Motifs appear repeatedly to reinforce the central themes of a text." },
    ],
    picture: [
      { scenario: "You are writing an A-Level essay: 'Assess the view that education serves the interests of the ruling class.' You have Marxist, functionalist, and feminist perspectives.", prompt: "Write a detailed essay plan with an introduction, three analytical paragraphs (one per perspective), and a balanced conclusion." },
      { scenario: "You are given data: Group A (taught with visual aids) scored an average of 72%. Group B (taught without) scored 65%. Sample size: 30 per group.", prompt: "Is this a significant difference? Discuss sample size, variables that need controlling, and what statistical test you might use." },
      // A-Level Maths
      { scenario: "Points A(1,2) and B(5,6) are the endpoints of a diameter of a circle.", prompt: "Find the centre of the circle, the radius, and write the equation of the circle." },
    ],
  },

  // ── UNSURE — SIXTH FORM ──
  unsure_sixthform: {
    match: [
      { pairs: [["Globalisation", "Increasing worldwide interconnection"], ["Sustainability", "Meeting needs without harming the future"], ["Sovereignty", "Supreme authority within a territory"], ["Diplomacy", "Managing international relations peacefully"]] },
      { pairs: [["Hypothesis", "Testable prediction"], ["Variable", "Factor that can change"], ["Control group", "Group with no treatment for comparison"], ["Reliability", "Consistency of results when repeated"]] },
      // A-Level Maths
      { pairs: [["Iteration", "Repeating a process to get closer to answer"], ["Trapezium rule", "Estimating area using trapezoids"], ["Newton-Raphson", "Finding roots by tangent lines"], ["Recurrence relation", "Each term defined by previous terms"]] },
    ],
    fill: [
      { sentence: "CPEC stands for China-Pakistan ___ Corridor.", options: ["Economic", "Education", "Energy", "Export"], answer: "Economic", explanation: "The China-Pakistan Economic Corridor is a major infrastructure project." },
      { sentence: "The pH scale ranges from 0 to ___.", options: ["7", "10", "14", "100"], answer: "14", explanation: "0 is strongly acidic, 7 is neutral, and 14 is strongly alkaline." },
      { sentence: "A hypothesis must be ___.", options: ["testable", "correct", "complex", "published"], answer: "testable", explanation: "A good hypothesis can be tested through experimentation or observation." },
      // A-Level Maths
      { sentence: "The trapezium rule uses ___ to estimate area under a curve.", options: ["rectangles", "triangles", "trapezoids", "circles"], answer: "trapezoids", explanation: "The trapezium rule divides area into trapezoids for numerical integration." },
      { sentence: "cos²(x) + sin²(x) = ___.", options: ["0", "1", "2", "x"], answer: "1", explanation: "This is the Pythagorean identity — it holds for all values of x." },
      // Economics
      { sentence: "The law of demand states that as price rises, quantity demanded ___.", options: ["rises", "falls", "stays same", "doubles"], answer: "falls", explanation: "Higher prices lead to lower demand — this is the law of demand." },
      // Psychology
      { sentence: "Nature vs nurture asks whether behaviour is caused by ___ or environment.", options: ["genes", "friends", "food", "luck"], answer: "genes", explanation: "The nature-nurture debate examines genetic vs environmental influences." },
      // Biology
      { sentence: "The process of cell division that produces gametes is ___.", options: ["mitosis", "meiosis", "binary fission", "budding"], answer: "meiosis", explanation: "Meiosis produces sex cells (gametes) with half the chromosome number." },
      // English
      { sentence: "Intertextuality means one text references or relates to ___.", options: ["another text", "its author", "the reader", "the publisher"], answer: "another text", explanation: "Texts often allude to, quote, or respond to other works of literature." },
    ],
    truefalse: [
      { statement: "Pakistan is a member of the United Nations.", answer: true, explanation: "Pakistan joined the UN on 30 September 1947, shortly after independence." },
      { statement: "In a scientific experiment, you can change multiple variables at once.", answer: false, explanation: "You should only change one variable at a time to identify cause and effect." },
      { statement: "Critical thinking involves questioning evidence before accepting claims.", answer: true, explanation: "Critical thinking means evaluating evidence, logic, and assumptions carefully." },
      // A-Level Maths
      { statement: "Radians and degrees are two ways to measure angles.", answer: true, explanation: "360 degrees = 2 pi radians. Both measure angles but radians are used more in calculus." },
      { statement: "The function y = 1/x is defined at x = 0.", answer: false, explanation: "Division by zero is undefined. y = 1/x has an asymptote at x = 0." },
      // Economics
      { statement: "Free trade means no tariffs or quotas on imports.", answer: true, explanation: "Free trade removes barriers like tariffs, allowing goods to flow freely." },
      // Psychology
      { statement: "A double-blind study means neither participants nor researchers know who is in which group.", answer: true, explanation: "This reduces bias from both participants and researchers." },
      // Biology
      { statement: "All organisms are made of cells.", answer: true, explanation: "Cell theory states that all living things are composed of cells." },
      // English
      { statement: "Critical evaluation requires you to assess strengths and weaknesses of arguments.", answer: true, explanation: "Evaluation means weighing up evidence and making a judgement." },
    ],
    picture: [
      { scenario: "You are preparing for a university interview. The interviewer asks: 'What is the biggest challenge facing Pakistan in the next decade, and how would you address it?'", prompt: "Give a structured answer: identify the challenge, explain why it matters, and propose two realistic solutions with evidence." },
      { scenario: "You read two articles: one says social media improves access to information; the other says it spreads misinformation and harms mental health.", prompt: "Evaluate both arguments. What evidence supports each? Can both be true? What is your balanced conclusion?" },
      // A-Level Maths
      { scenario: "Use the Newton-Raphson method to find a root of x cubed - 2x - 5 = 0, starting with x0 = 2.", prompt: "Perform two iterations. Show the formula and your calculations." },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════
// UAE SEN EXERCISES — Supplement for UAE students (AED, UAE geography, local context)
// Keyed by exercise type. Mixed in when isUAE is true.
// ═══════════════════════════════════════════════════════════════════════
const UAE_EXERCISES = {
  // Money exercises — AED instead of Rs (replaces Pakistan money questions for UAE)
  money_fill: [
    { sentence: "If you have 10 AED and spend 3 AED, you have ___ left.", options: ["5", "6", "7", "8"], answer: "7" },
    { sentence: "A shawarma costs 8 AED. You pay with 10 AED. Your change is ___.", options: ["2 AED", "3 AED", "4 AED", "5 AED"], answer: "2 AED" },
    { sentence: "You have 50 AED. A book costs 35 AED. Your change is ___ AED.", options: ["10", "15", "20", "25"], answer: "15" },
    { sentence: "If you save 20 AED each week for 4 weeks, you have ___ AED.", options: ["60", "80", "100", "120"], answer: "80" },
  ],
  money_fill_sixthform: [
    { sentence: "If you earn 5,000 AED per month and spend 4,000 AED, you save ___ AED.", options: ["500", "1,000", "1,500", "2,000"], answer: "1,000", explanation: "5,000 minus 4,000 equals 1,000 dirhams saved each month." },
    { sentence: "A 20% discount on 500 AED saves you ___ AED.", options: ["50", "100", "150", "200"], answer: "100", explanation: "20/100 x 500 = 100 AED saved." },
    { sentence: "If you save 10,000 AED at 5% interest for 1 year, you earn ___ AED.", options: ["250", "500", "1,000", "5,000"], answer: "500", explanation: "5% of 10,000 = 500 AED interest." },
    { sentence: "In an emergency in the UAE, you call ___.", options: ["999", "911", "112", "100"], answer: "999", explanation: "999 is the emergency number in the UAE for police, ambulance, and fire." },
  ],
  // Geography — UAE instead of Pakistan
  geography_truefalse: [
    { statement: "The capital of the UAE is Abu Dhabi.", answer: true },
    { statement: "Dubai is the capital of the UAE.", answer: false },
    { statement: "The UAE has 7 emirates.", answer: true },
    { statement: "The Burj Khalifa is in Abu Dhabi.", answer: false },
    { statement: "The UAE is in the Middle East.", answer: true },
    { statement: "Sharjah is the largest emirate by area.", answer: false },
  ],
  geography_fill: [
    { sentence: "The tallest building in the world, the Burj Khalifa, is in ___.", options: ["Abu Dhabi", "Dubai", "Sharjah", "Riyadh"], answer: "Dubai" },
    { sentence: "The UAE has ___ emirates.", options: ["5", "6", "7", "8"], answer: "7" },
    { sentence: "The national language of the UAE is ___.", options: ["English", "Arabic", "Hindi", "Urdu"], answer: "Arabic" },
  ],
  // Social/picture scenarios with UAE context
  picture_primary: [
    { scene: "You visit the Dubai Mall. You have 50 AED. A toy costs 35 AED. How much change?", prompt: "Work out the money!" },
    { scene: "Your school in Abu Dhabi has a sports day. Describe what sports you would see.", prompt: "Describe the sports day!" },
    { scene: "You are planning a trip to Yas Island with your family. Tickets cost 120 AED each. There are 4 people in your family.", prompt: "How much will all the tickets cost? Show your working!" },
  ],
  picture_secondary: [
    { scene: "You are writing about the importance of Expo 2020 Dubai for the UAE economy.", prompt: "Give three reasons why international events boost a country's economy." },
    { scene: "A company in Dubai has 200 employees. 35% work remotely. How many work in the office?", prompt: "Calculate the number and show your working." },
  ],
  picture_sixthform: [
    { scenario: "You are preparing for a university interview. The interviewer asks: 'What is the biggest challenge facing the UAE in the next decade, and how would you address it?'", prompt: "Give a structured answer: identify the challenge, explain why it matters, and propose two realistic solutions with evidence." },
    { scenario: "You earn 8,000 AED per month. Your expenses are: rent 3,500 AED, food 1,500 AED, transport 800 AED, phone 300 AED.", prompt: "How much can you save each month? What percentage of income is that?" },
  ],
  // Match pairs — UAE context
  match_sixthform: [
    { pairs: [["Debit card", "Money comes from your bank account"], ["Credit card", "You borrow money and pay back later"], ["IBAN", "International bank account number"], ["Budget", "Plan for how to spend your money"]] },
  ],
};

// ── CONDITIONS ─────────────────────────────────────────────────────────
const CONDITIONS = [
  { id:"autism",    emoji:"🌟", name:"Autism Spectrum",      urdu:"آٹزم",           color:"#63D2FF", short:"ASD",      signs:"Social communication differences, routines, sensory sensitivity" },
  { id:"adhd",      emoji:"⚡", name:"ADHD",                  urdu:"توجہ کی کمی",   color:"#FFC300", short:"ADHD",     signs:"Can't sit still, loses focus, impulsive — often called 'naughty' but it's neurological" },
  { id:"dyslexia",  emoji:"🎵", name:"Dyslexia",              urdu:"ڈسلیکسیا",      color:"#FF8C69", short:"Dyslexia", signs:"Struggles with reading/spelling but bright in other ways — often undiagnosed in Pakistan" },
  { id:"ds",        emoji:"💛", name:"Down Syndrome",         urdu:"ڈاؤن سنڈروم",   color:"#A8E063", short:"DS",       signs:"Extra chromosome 21 — learning differences with tremendous strengths in empathy and memory" },
  { id:"cp",        emoji:"💪", name:"Cerebral Palsy",        urdu:"دماغی فالج",    color:"#C77DFF", short:"CP",       signs:"Movement and coordination challenges — cognitive ability is often fully intact" },
  { id:"vi",        emoji:"✨", name:"Visual Impairment",     urdu:"بصری معذوری",   color:"#FF6B9D", short:"VI",       signs:"Partial or full vision loss — exceptional verbal and auditory strengths" },
  { id:"hi",        emoji:"🎶", name:"Hearing Impairment",    urdu:"سماعت کی کمی",  color:"#F4A261", short:"HI",       signs:"Partial or full hearing loss — strong visual learners with full cognitive ability" },
  { id:"dyscalculia",emoji:"🔢", name:"Dyscalculia",           urdu:"ڈسکیلکولیا",    color:"#FF85A1", short:"Dyscalculia", signs:"Struggles with numbers, arithmetic, time, money — like dyslexia but for maths" },
  { id:"dyspraxia", emoji:"🤸", name:"Dyspraxia / DCD",        urdu:"ڈسپریکسیا",     color:"#7ECFC0", short:"DCD",      signs:"Coordination difficulties, clumsy, struggles with handwriting and organising thoughts" },
  { id:"dysgraphia",emoji:"✏️", name:"Dysgraphia",              urdu:"ڈسگرافیا",      color:"#FFB347", short:"Dysgraphia",signs:"Difficulty with writing — letter formation, spacing, translating thoughts to paper" },
  { id:"sensory",   emoji:"🌊", name:"Sensory Processing",      urdu:"حسی عمل",       color:"#B8D4E3", short:"SPD",      signs:"Overwhelmed by sounds, lights, textures — needs calm, predictable environment" },
  { id:"unsure",    emoji:"❓", name:"Not Sure / Undiagnosed",urdu:"تشخیص نہیں ہوئی",color:"#A78BFA", short:"SEN",     signs:"My child struggles at school but I don't have a diagnosis yet" },
];

// ── AGE/STAGE ─────────────────────────────────────────────────────────
const STAGES = [
  {
    id:"early", emoji:"🌱", name:"Early Years",
    ages:"Ages 3–6", grades:"Nursery · Reception · KG",
    color:"#A8E063",
    desc:"First steps in learning — play-based, sensory, joyful. Every milestone celebrated.",
    curriculum:"Early Years Foundation Stage / KG curriculum",
    subjects:["Early Literacy","Early Numeracy","Urdu","Communication","Nazra Quran","Sensory Play","Social Skills","Fine Motor Skills","Phonics Foundations","Shape & Colour"],
  },
  {
    id:"primary", emoji:"🌿", name:"Primary",
    ages:"Ages 6–11", grades:"Years 1–6 · Grades 1–5",
    color:"#63D2FF",
    desc:"Building foundations — reading, writing, maths, and discovering the world.",
    curriculum:"Primary National Curriculum / Elementary",
    subjects:["English & Reading","Maths","Urdu","Science","Islamiat","Nazra Quran","Writing","Spelling","Times Tables","Pakistan Studies","General Knowledge","Art","Computing"],
  },
  {
    id:"secondary", emoji:"🌳", name:"Secondary",
    ages:"Ages 11–16", grades:"Years 7–11 · GCSE · O-Levels",
    color:"#FFC300",
    desc:"Navigating complexity — exams, identity, and finding their place in the world.",
    curriculum:"GCSE / O-Level / Middle & High School",
    subjects:["English Language","Urdu","Maths","Biology","Chemistry","Physics","Pakistan Studies","Islamiat","Computer Science","History","Geography","Economics","Business","Art & Design"],
  },
  {
    id:"sixthform", emoji:"🎓", name:"Sixth Form & College",
    ages:"Ages 16–18", grades:"A-Levels · IB · AS · College",
    color:"#C77DFF",
    desc:"The highest stakes — university applications, advanced study, and transition to independence.",
    curriculum:"A-Level / IB / AS-Level / College",
    subjects:["A-Level English","A-Level Maths","A-Level Biology","A-Level Chemistry","A-Level Physics","A-Level History","A-Level Psychology","A-Level Business","IB Extended Essay","University Preparation","UCAS Personal Statement"],
  },
];

// ── LEARNING FOCUS ────────────────────────────────────────────────────
const FOCUSES = [
  { id:"academic",  emoji:"📚", name:"Academic Subject",    desc:"Curriculum learning with SEN adaptations" },
  { id:"creative",  emoji:"🎨", name:"Creative Learning",   desc:"Music, Reading & Arts specialist sessions" },
  { id:"life",      emoji:"🌟", name:"Life Skills",         desc:"Independence, communication & social skills" },
  { id:"exam",      emoji:"📝", name:"Exam Preparation",    desc:"GCSE, A-Level, IB & O-Level with accommodations" },
  { id:"parent",    emoji:"💌", name:"Parent & Carer Guide",desc:"Expert guidance for supporting your child at home" },
];

// ── SYSTEM PROMPT BUILDER ─────────────────────────────────────────────
function buildPrompt(condition, stage, focus, subject, urduMode = false, isUAE = false) {
  if (!condition || !stage || !focus) return "";

  const conditionAdapt = {
    autism: `AUTISM ADAPTATIONS:
- Explicit, literal language — no idioms or sarcasm without explanation
- Visualising and Verbalising technique for comprehension
- Predictable, structured session format
- Connect to special interests whenever possible
- Literal → inferential scaffold for all comprehension
- Social/emotional content needs explicit explanation
- Celebrate pattern recognition and systematic thinking`,

    adhd: `ADHD ADAPTATIONS:
- Activities in 5-7 minute bursts — change mode frequently
- HIGH energy and enthusiasm — match their pace
- Gamify: timers, challenges, competitions
- Working memory support: frequent short recaps
- Physical engagement: "stand up and say it", movement built in
- Immediate feedback and celebration
- Hook them with the most exciting part FIRST`,

    dyslexia: `DYSLEXIA ADAPTATIONS:
- NEVER ask for written responses — verbal only
- Multi-sensory: say it, clap it, trace it
- Phonological awareness built into every session
- Context before definition — never the reverse
- Never time reading aloud — EVER
- Celebrate verbal intelligence and listening comprehension
- Audiobooks and oral methods are equal to print — say so
- Orton-Gillingham sequential phonics principles`,

    ds: `DOWN SYNDROME ADAPTATIONS:
- Short instructions: ONE step at a time
- Maximum 10-15 minutes before a break
- High repetition is learning — celebrate it
- Visual + verbal together always
- Whole-word recognition strengths
- Music and rhythm to support memory
- Massive celebration of every success
- Simple, direct language with warmth
- Reading can TEACH oral language — both directions work`,

    cp: `CEREBRAL PALSY ADAPTATIONS:
- ALWAYS offer 3 response modes: speak, type, yes/no
- Never require oral reading
- Fatigue management: shorter sessions, pace carefully
- AAC and switch access methods assumed
- Comprehension questions via pointing or yes/no
- Audiobooks as primary text format
- Never mistake physical limitation for cognitive limitation
- Full academic curriculum is appropriate`,

    vi: `VISUAL IMPAIRMENT ADAPTATIONS:
- Describe ALL visual content explicitly
- Audiobooks are the primary and equal text format
- Auditory memory is extraordinary — use it
- No references to "look at this" — "listen to this"
- Text-to-speech and Braille access assumed
- Build on exceptional language and verbal skills
- Homer was blind — the literary tradition began this way
- Full academic and creative curriculum is appropriate`,

    dyscalculia: `DYSCALCULIA ADAPTATIONS (Butterworth / Bruner enactive-iconic-symbolic):
- CONCRETE before abstract ALWAYS — real-world example first, then visual, then symbol
- WRONG: "7 minus 3 equals 4." RIGHT: "You have 7 chocolates, eat 3. How many left?"
- Start with LANGUAGE then number: "What does sharing equally mean? That's division."
- Visual number lines for every arithmetic operation
- Times tables as PATTERNS not memorisation (9x table: digits always sum to 9)
- Remove unnecessary language from word problems — separate reading task from maths task
- Link physical movement to maths: "Take 7 steps forward, 3 back. Where are you?"
- Many students struggle with the language of maths more than the concept itself
- Money, time, measurement through real-life scenarios`,

    dyspraxia: `DYSPRAXIA / DCD ADAPTATIONS (EACD Guidelines 2019):
- Digital response ALWAYS — handwriting is physically demanding and cognitively exhausting
- Typed or voice-to-text responses eliminate the barrier entirely
- Sequence made EXPLICIT and EXTERNAL: "Step 1 only. Tell me when done."
- The student does NOT need to hold the full sequence — Starky holds it for them
- Allow time for verbal expression — excellent ideas may emerge fragmented
- Help organise thoughts: "You have 3 ideas. Let's take the first one."
- Celebrate THINKING, not presentation — quality of thought is the measure
- Three excellent ideas in fragmented sentences > empty well-formatted paragraphs`,

    dysgraphia: `DYSGRAPHIA ADAPTATIONS (Berninger & Wolf 2009):
- COMPLETELY separate thinking from writing — they compete for cognitive resources
- Stage 1: verbal ideas ONLY. No writing. "Tell me your 3 main ideas out loud."
- Stage 2: AFTER ideas are organised, now we write. Ideas preserved. Writing easier.
- Scaffolded structures: "The main reason was ___ because ___ led to ___"
- NEVER present a blank page — provide sentence starters and frames
- Cognitive load reduced by 70% with scaffolding
- Digital and voice-to-text ALWAYS encouraged — the idea is the product
- Evaluate THOUGHT, never volume — 3 precise sentences > 10 illegible ones
- "Can you speak your answer and then type what you said?"`,

    sensory: `SENSORY PROCESSING ADAPTATIONS (Ayres 1979/2005, Miller 2006):
- A student in sensory OVERLOAD cannot learn — the brain is managing the environment
- Shorter responses reduce visual overload
- Consistent formatting reduces unpredictable stimulation
- Calm, unhurried tone reduces cognitive stress
- Student controls pacing entirely — Starky NEVER rushes
- Very short, fragmented replies often signal overwhelm, NOT disengagement
- "I don't know" frequently means "I am at capacity right now"
- Response: "No problem. Let's do something simpler. Just one question."
- Reduce the load. Rebuild from the simpler foundation.
- Affects 5-16% of children. Common in ASD (69-93%), ADHD, DCD`,

    unsure: `UNDIAGNOSED / UNSURE CONDITION ADAPTATIONS:
- The child has NOT been formally diagnosed — treat this as a discovery session
- Ask the parent/student to describe the specific challenges they face before teaching
- Listen for clues: reading difficulty → dyslexia; hyperactivity/inattention → ADHD; social/communication differences → ASD; number difficulty → dyscalculia; coordination/writing → dyspraxia/dysgraphia
- Adapt your response style based on what you hear — do NOT assume
- Explicitly validate the parent: "Many children go undiagnosed for years — you've done the right thing by seeking support"
- Girls with ADHD, ASD, dyslexia present DIFFERENTLY — more internally, more masked, less disruptive. They are significantly underdiagnosed.
- Suggest that a formal assessment would help, but emphasise that Starky can help RIGHT NOW without one
- Apply ALL five SEN pillars: multisensory, chunking, processing time, repetition without shame, confidence is the curriculum
- Try multiple approaches — some may work better than others — report back what works`,

    hi: `HEARING IMPAIRMENT ADAPTATIONS:
- Clear, visual, written explanations preferred
- British Sign Language / ASL concepts acknowledged
- Lip-reading context: clear sentences, no mumbling
- Visual learning strategies prioritised
- Captioning and visual media mentioned where relevant
- Written language may differ from spoken — no correction
- Deaf culture and identity respected
- Full academic curriculum with visual adaptations`,
  };

  const stageContext = {
    early: `EARLY YEARS CONTEXT (Ages 3-6):
- Play-based learning is THE pedagogical approach — never desk-based instruction
- Every session should feel like an adventure, not a lesson
- Sensory engagement: touch, sound, movement
- Attention spans: 5-10 minutes maximum on any single activity
- Repetition and routine are comforting and effective
- Parents/carers are in the room — guide them too
- Every milestone is significant and deserves celebration
- Language: simple, warm, musical, full of delight`,

    primary: `PRIMARY CONTEXT (Ages 6-11, ${stage.curriculum}):
- National Curriculum foundations: literacy, numeracy, science, humanities
- Reading fluency and comprehension are central concerns
- Times tables, place value, basic operations
- Writing stamina builds slowly — scaffold with oral rehearsal first
- Topic-based learning works well — connect subjects
- Friendships and belonging matter enormously at this stage
- 20-30 minute focused sessions are appropriate
- Homework help and parent explanations are often needed`,

    secondary: `SECONDARY CONTEXT (Ages 11-16, ${stage.curriculum}):
- GCSE and O-Level preparation is the central academic concern
- Exam technique is a specific learnable skill — teach it
- Essay structure: PEEL, PEARL, argument + evidence
- Revision strategies adapted for the condition
- Social complexity of secondary school acknowledged
- Identity formation — this age group needs to feel capable
- SEN accommodations: extra time, reader, scribe — discuss these
- 45-60 minute sessions are appropriate`,

    sixthform: `SIXTH FORM CONTEXT (Ages 16-18, ${stage.curriculum}):
- A-Level, IB, AS-Level — high stakes assessment
- Extended writing, analysis, evaluation at university level
- UCAS personal statements and university preparation
- Independence and self-advocacy skills critical
- SEN exam accommodations and how to access them
- Transition planning: university, college, employment, independence
- Treat as an intellectual equal — high expectations
- 60+ minute sessions for complex work`,
  };

  const focusGuide = {
    academic: `ACADEMIC FOCUS — Subject: ${subject || "General"}
Teach this subject using evidence-based SEN adaptations. Break every concept into micro-steps. Check understanding before moving on. Use worked examples. Connect to real life. Celebrate every correct answer. Never move on while confusion remains.`,

    creative: `CREATIVE LEARNING FOCUS
Music, Reading, and Arts through specialist SEN lenses. For this session, use the creative curriculum as the context. Every creative activity should have an adapted version. Voice input is encouraged. Expression takes many forms.`,

    life: `LIFE SKILLS FOCUS
Independence, communication, social skills, self-advocacy, daily living skills. Connect everything to real scenarios the child will encounter. Role-play situations. Build confidence for navigating the world. For older students: money, transport, employment, relationships.`,

    exam: `EXAM PREPARATION FOCUS
Teach exam technique alongside content. SEN accommodations explained. Past paper questions worked through with adaptations. Revision strategies that work for this condition. Time management in exams. How to ask for extra support.`,

    parent: `PARENT/CARER GUIDANCE
Speak to the adult supporting this child. Practical, evidence-based guidance for home. What to do, what NOT to do. Common mistakes parents make with this condition and age group. Resources, organisations, support networks. How to advocate for your child at school.`,
  };

  const regionContext = isUAE ? `
UAE CONTEXT (for this student):
- Many students in UAE attend British curriculum schools (GEMS, Taaleem, ADNOC Schools), American curriculum (ACS), or IB schools
- SEN provision in UAE: Dubai KHDA provides SEN regulations. Abu Dhabi ADEK has People of Determination framework
- UAE Access Arrangements: schools apply through exam boards (Cambridge, Edexcel, AQA) for extra time, reader, scribe
- Dubai Autism Center, Rashid Centre for Disabled, Manzil Center — local SEN resources
- Currency: AED (Dirhams) not PKR. Use "10 AED" not "Rs 100" in examples
- Cultural context: diverse international students, English is the common language, Arabic is the national language
- Term "People of Determination" is preferred over "disabled" in UAE
- The student may follow British, American, IB, or MOE (Ministry of Education) curriculum — ask if unclear
- Arabic and English are both valid — respond in whichever language the parent/student uses
` : `
PAKISTAN CONTEXT (critical for this session):
- Many Pakistani children are UNDIAGNOSED — parents may not know the clinical term for their child's condition
- ADHD is commonly dismissed as "شرارتی بچہ" (naughty child) in Pakistan — NEVER use this framing
- Dyslexia (ڈسلیکسیا) is widely undiagnosed — if parents describe reading/spelling difficulty, treat as possible dyslexia
- Most Pakistani schools (including O Level schools like KGS, Nixor, Beaconhouse, City School) do NOT have dedicated SEN departments
- For O Level students: IBCC and Cambridge both offer exam accommodations (extra time, reader, scribe) — parents must apply through the school's Cambridge exam officer
- Cambridge Access Arrangements (AA) can be applied for via school — 25% extra time is most common
- If the parent mentions an Urdu-medium school or government school, the resources are EVEN more limited — be more explicit about home strategies
- Local resources in Pakistan: SELD Karachi, Autism Resource Center Lahore, NOWPDP for disability employment
- Urdu and English are both valid — respond in whichever language the parent/student uses
`;

  return addKnowledgeToPrompt(`You are Starky — a world-class specialist educational tutor for children with special educational needs.

CHILD PROFILE:
- Condition: ${condition.name} (${condition.short})
- Age/Stage: ${stage.name} — ${stage.ages} — ${stage.grades}
- Curriculum: ${stage.curriculum}
- Session Focus: ${focus.name}${subject ? " — " + subject : ""}

${conditionAdapt[condition.id]}

${stageContext[stage.id]}

${focusGuide[focus.id]}

YOUR CORE APPROACH:
1. Every response ends with "For the adult: [specific, practical, immediate action]"
2. Micro-step everything — never jump over a step
3. Celebrate every attempt, not just correct answers
4. Ask one question at a time maximum
5. Connect learning to the child's known interests
6. If the child is struggling, simplify further — never move on
7. If the child is flying, extend and challenge — never hold back
8. Use the child's name if given
9. Sessions end with a preview of what comes next — anticipation builds motivation

NEVER:
- Say "that's wrong" — say "almost! let's try another way"
- Use sarcasm, irony, or figurative language without explaining
- Give multi-part instructions at once
- Make the child feel they are behind or broken
- Assume one session looks like the last — check in fresh each time

Remember: You are not teaching a condition. You are teaching a child who happens to have a condition. The most important thing in every session is that they leave feeling more capable than when they arrived.

If the message is in Urdu or Arabic, respond in that language.
${urduMode ? "IMPORTANT: This session is in URDU MODE. Respond ENTIRELY in Urdu. All explanations, encouragement, and guidance must be in Urdu. Only keep English for technical Cambridge/exam terms with no Urdu equivalent." : ""}

${regionContext}`);
}

// ── PROGRESS ─────────────────────────────────────────────────────────
const PK = "nw_sen_progress";
function loadP() { try { return JSON.parse(localStorage.getItem(PK)||"{}"); } catch { return {}; } }
function saveP(p) { try { localStorage.setItem(PK, JSON.stringify(p)); } catch {} }

// ═══════════════════════════════════════════════════════════════════════

// ── SEN Drill Widget ─────────────────────────────────────────────
function SENDrillWidget({ condition, stage, subject, xpData, setXpData }) {
  const [active, setActive] = useState(false);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [celebration, setCelebration] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [senError, setSenError] = useState('');
  const [drillConfetti, setDrillConfetti] = useState(false);
  const [drillXPFloat, setDrillXPFloat] = useState(false);
  const [drillStreak, setDrillStreak] = useState(0);
  const feedbackRef = useRef(null);
  const [chosenSubject, setChosenSubject] = useState('');

  const CELEBRATIONS = [
    "🌟 Amazing try!", "⭐ You're doing great!", "🎉 Brilliant effort!",
    "🌈 Keep going, you've got this!", "💪 That was wonderful!",
    "🦋 You're a star!", "🎊 Fantastic attempt!", "🌺 So proud of you!",
  ];

  const senSubjects = subject
    ? [subject]
    : ['Maths','English','Science','Reading','Social Skills','Life Skills'];

  const generateQuestion = async (subj) => {
    if (loading) return;
    setLoading(true);
    setFeedback(null);
    setSelected('');
    setAnswer('');
    setHint(null);
    const sub = subj || chosenSubject || 'General Learning';
    try {
      const condName = condition?.name || 'Special Educational Needs';
      const stageName = stage?.name || 'Primary';
      const res = await fetch('/api/drill', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          action: 'generate',
          level: stageName,
          subject: sub,
          topic: 'Core concepts',
          difficulty: 'easy',
          questionType: 'mcq',
          isSEN: true,
          senCondition: condName,
        })
      });
      const data = await res.json();
      if (!data.error) {
        setQuestion(data);
        setQuestionCount(c => c + 1);
        setSenError('');
      } else { setSenError(data.error); }
    } catch { setSenError('Something went wrong. Let\'s try again!'); }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!question || loading) return;
    const ans = question.type === 'mcq' ? selected : answer.trim();
    if (!ans) return;
    setLoading(true);
    try {
      const res = await fetch('/api/drill', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          action: 'grade',
          level: stage?.name || 'Primary',
          subject: chosenSubject,
          topic: question.topic || 'General',
          question: question.question,
          studentAnswer: ans,
          questionType: question.type,
          options: question.options,
          marks: question.marks,
          isSEN: true,
        })
      });
      const data = await res.json();
      setFeedback(data);
      // Always celebrate — correct or not
      const cel = CELEBRATIONS[Math.floor(Math.random() * CELEBRATIONS.length)];
      setCelebration(data.correct ? "🌟 Correct! " + cel : cel);
      // Sound effects, confetti, XP
      if (data.correct) {
        const newStreak = drillStreak + 1;
        if (newStreak % 5 === 0) sndWin(); else sndOk();
        setDrillConfetti(true);
        setDrillXPFloat(true);
        setDrillStreak(newStreak);
        if (setXpData) setXpData(prev => addCorrectXP(prev));
        setTimeout(() => { setDrillConfetti(false); setDrillXPFloat(false); }, 2000);
      } else {
        sndErr();
        setDrillStreak(0);
        if (setXpData) setXpData(prev => resetCorrectStreak(prev));
      }
      setTimeout(() => feedbackRef.current?.scrollIntoView({behavior:'smooth',block:'start'}), 150);
    } catch { setSenError('Oops! Let\'s try again.'); }
    setLoading(false);
  };

  const getHint = async () => {
    if (!question || hintLoading) return;
    setHintLoading(true);
    try {
      const res = await fetch('/api/drill', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          action: 'hint',
          question: question.question,
          subject: chosenSubject,
          topic: question.topic || 'General',
          level: stage?.name || 'Primary',
        })
      });
      const data = await res.json();
      setHint(data.hint || 'Think about what you already know — you can do this!');
    } catch {
      setHint('Take your time — there is no rush. You can do this!');
    }
    setHintLoading(false);
  };

  if (!active) return (
    <div style={{background:"rgba(167,139,250,0.06)",border:"2px solid rgba(167,139,250,0.2)",borderRadius:20,padding:"28px 24px",textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:12}}>🎯</div>
      <div style={{fontWeight:900,fontSize:18,marginBottom:8,fontFamily:"'Nunito',sans-serif"}}>Ready to practise?</div>
      <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:20,lineHeight:1.7}}>
        No timer. No stress. Starky will cheer for every answer you give.
      </div>
      {!subject && (
        <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:16}}>
          {senSubjects.map(s => (
            <button key={s} aria-label={`Select subject: ${s}`} role="button" onClick={() => { sndTick(); setChosenSubject(s); }} style={{background:chosenSubject===s?"rgba(167,139,250,0.2)":"rgba(255,255,255,0.05)",border:`2px solid ${chosenSubject===s?"rgba(167,139,250,0.6)":"rgba(255,255,255,0.1)"}`,borderRadius:14,padding:"14px 20px",color:chosenSubject===s?"#A78BFA":"rgba(255,255,255,0.6)",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif",minHeight:52}}>
              {s}
            </button>
          ))}
        </div>
      )}
      <button
        aria-label="Start practice session"
        role="button"
        onClick={() => { sndTick(); setActive(true); generateQuestion(subject || chosenSubject); }}
        disabled={!subject && !chosenSubject}
        style={{background:"linear-gradient(135deg,#A78BFA,#7C5CBF)",border:"none",borderRadius:14,padding:"16px 32px",color:"#fff",fontWeight:900,fontSize:16,fontFamily:"'Nunito',sans-serif",cursor:"pointer",opacity:(!subject && !chosenSubject)?0.4:1,minHeight:52}}
      >
        Let's Start! ✨
      </button>
    </div>
  );

  return (
    <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"24px 20px",position:"relative",overflow:"hidden"}}>
      {/* Confetti on correct */}
      {drillConfetti && <SENConfetti />}
      {/* Floating XP */}
      {drillXPFloat && <FloatingXP amount={10} />}
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:8}}>
        <div style={{fontWeight:800,fontSize:13,color:"#A78BFA"}}>✨ Practice Zone · {chosenSubject || subject}</div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {drillStreak > 0 && (
            <div aria-label={`${drillStreak} correct answers in a row`} style={{background:"rgba(168,224,99,0.12)",border:"1px solid rgba(168,224,99,0.3)",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:800,color:"#A8E063"}}>
              🔥 {drillStreak} streak
            </div>
          )}
          <div style={{fontSize:12,color:"rgba(255,255,255,0.65)"}}>Question {questionCount}</div>
        </div>
      </div>

      {/* Error display */}
      {senError && (
        <div style={{background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:12,padding:"14px 16px",marginBottom:14,textAlign:"center"}}>
          <div style={{fontSize:14,color:"#F87171",fontWeight:700,marginBottom:6}}>{senError}</div>
          <button onClick={() => { setSenError(''); generateQuestion(chosenSubject || subject); }} style={{background:"rgba(248,113,113,0.15)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:10,padding:"8px 16px",color:"#F87171",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Try again</button>
        </div>
      )}
      {loading && !question && !senError && (
        <div style={{textAlign:"center",padding:"40px 0"}}>
          <div style={{fontSize:40,marginBottom:12}}>🌟</div>
          <div style={{fontSize:14,color:"rgba(255,255,255,0.5)"}}>Starky is finding the perfect question for you…</div>
        </div>
      )}

      {question && !loading && (
        <>
          {/* Hint always visible at top */}
          {!hint && !feedback && (
            <button aria-label="Get a hint" role="button" onClick={() => { sndTick(); getHint(); }} disabled={hintLoading} style={{width:"100%",background:"rgba(252,211,77,0.08)",border:"1px solid rgba(252,211,77,0.2)",borderRadius:12,padding:"12px",color:"#FCD34D",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:14,fontFamily:"'Nunito',sans-serif",minHeight:52}}>
              {hintLoading ? "🤔 Getting a hint for you…" : "💡 Can I have a hint please?"}
            </button>
          )}
          {hint && !feedback && (
            <div style={{background:"rgba(252,211,77,0.08)",border:"1px solid rgba(252,211,77,0.2)",borderRadius:12,padding:"12px 16px",marginBottom:14,fontSize:13,color:"rgba(255,255,255,0.85)",lineHeight:1.7}}>
              <strong style={{color:"#FCD34D"}}>💡 Hint: </strong>{hint}
            </div>
          )}

          {/* Question — bigger text for SEN */}
          <div style={{fontSize:18,lineHeight:1.8,color:"rgba(255,255,255,0.95)",background:"rgba(167,139,250,0.07)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:14,padding:"20px",marginBottom:20,fontFamily:"'Nunito',sans-serif",fontWeight:600}}>
            {question.question}
          </div>

          {/* MCQ options — large tap targets */}
          {question.type === 'mcq' && question.options && !feedback && (
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
              {Object.entries(question.options).map(([key, val]) => (
                <button key={key}
                  aria-label={`Option ${key}: ${val}`}
                  role="button"
                  onClick={() => { sndTick(); setSelected(key); }}
                  style={{background:selected===key?"rgba(167,139,250,0.15)":"rgba(255,255,255,0.04)",border:`2px solid ${selected===key?"rgba(167,139,250,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:14,padding:"18px 18px",cursor:"pointer",color:selected===key?"#A78BFA":"rgba(255,255,255,0.8)",fontSize:16,textAlign:"left",display:"flex",gap:12,alignItems:"center",fontFamily:"'Nunito',sans-serif",fontWeight:600,transition:"all 0.15s",minHeight:52}}>
                  <strong style={{fontSize:18,minWidth:28,color:selected===key?"#A78BFA":"rgba(255,255,255,0.4)"}}>{key}.</strong>
                  <span>{val}</span>
                  {selected===key && <span style={{marginLeft:"auto",fontSize:20}}>●</span>}
                </button>
              ))}
            </div>
          )}

          {/* MCQ after feedback */}
          {question.type === 'mcq' && question.options && feedback && (
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
              {Object.entries(question.options).map(([key, val]) => {
                const isSelected = selected===key;
                const isCorrect = key===question.correctOption;
                let bg="rgba(255,255,255,0.03)",border="rgba(255,255,255,0.06)",color="rgba(255,255,255,0.4)";
                if (isCorrect) { bg="rgba(74,222,128,0.1)"; border="rgba(74,222,128,0.35)"; color="#4ADE80"; }
                if (isSelected && !isCorrect) { bg="rgba(248,113,113,0.1)"; border="rgba(248,113,113,0.35)"; color="#F87171"; }
                return (
                  <div key={key} style={{background:bg,border:`2px solid ${border}`,borderRadius:14,padding:"14px 18px",color,fontSize:15,display:"flex",gap:12,alignItems:"center",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>
                    <strong style={{minWidth:28}}>{key}.</strong>
                    <span>{val}</span>
                    {isCorrect && <span style={{marginLeft:"auto",fontSize:20}}>✓</span>}
                    {isSelected && !isCorrect && <span style={{marginLeft:"auto",fontSize:20}}>✗</span>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Structured answer */}
          {question.type === 'structured' && !feedback && (
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Write your answer here — take all the time you need…"
              style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:12,color:"#fff",padding:"14px",fontSize:16,lineHeight:1.7,fontFamily:"'Nunito',sans-serif",outline:"none",resize:"vertical",minHeight:120,boxSizing:"border-box",marginBottom:16}}
            />
          )}

          {/* Feedback — always celebratory */}
          {feedback && (
            <div ref={feedbackRef} style={{background:"rgba(167,139,250,0.08)",border:"2px solid rgba(167,139,250,0.25)",borderRadius:16,padding:"20px",marginBottom:16}}>
              <div style={{fontSize:28,marginBottom:8,textAlign:"center"}}>{celebration}</div>
              <p style={{fontSize:15,color:"rgba(255,255,255,0.85)",lineHeight:1.8,margin:"0 0 12px",fontFamily:"'Nunito',sans-serif"}}>
                {feedback.feedback}
              </p>
              {feedback.modelAnswer && (
                <div style={{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"12px 14px",marginTop:10}}>
                  <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.65)",letterSpacing:"0.06em",marginBottom:6}}>THE ANSWER WAS</div>
                  <div style={{fontSize:14,color:"rgba(255,255,255,0.75)",lineHeight:1.7,fontFamily:"'Nunito',sans-serif"}}>{feedback.modelAnswer}</div>
                </div>
              )}
            </div>
          )}

          {/* Submit / Next */}
          {!feedback ? (
            <button
              aria-label="Submit your answer"
              role="button"
              onClick={() => { sndTick(); submitAnswer(); }}
              disabled={question.type==='mcq'?!selected:!answer.trim()}
              style={{width:"100%",background:"linear-gradient(135deg,#A78BFA,#7C5CBF)",border:"none",borderRadius:14,padding:"18px",color:"#fff",fontSize:16,fontWeight:900,fontFamily:"'Nunito',sans-serif",cursor:"pointer",opacity:(question.type==='mcq'?!selected:!answer.trim())?0.4:1,minHeight:52}}>
              {loading ? "Checking… 🌟" : "Submit My Answer ✨"}
            </button>
          ) : (
            <button
              aria-label="Next question"
              role="button"
              onClick={() => { sndTick(); generateQuestion(subject || chosenSubject); }}
              style={{width:"100%",background:"linear-gradient(135deg,#A78BFA,#7C5CBF)",border:"none",borderRadius:14,padding:"18px",color:"#fff",fontSize:16,fontWeight:900,fontFamily:"'Nunito',sans-serif",cursor:"pointer",minHeight:52}}>
              Next Question → ✨
            </button>
          )}

          <button aria-label="Take a break" role="button" onClick={() => { sndTick(); setActive(false); setQuestion(null); setFeedback(null); setQuestionCount(0); setDrillStreak(0); }}
            style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"14px",color:"rgba(255,255,255,0.65)",fontSize:14,fontFamily:"'Nunito',sans-serif",cursor:"pointer",marginTop:8,minHeight:52}}>
            Take a break 💜
          </button>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SEN QUICK EXERCISES — Local, no API, instant
// ═══════════════════════════════════════════════════════════════════════
function SENQuickExercises({ condition, stage, xpData, setXpData, isUAE }) {
  const [activeExType, setActiveExType] = useState(null); // 'match', 'fill', 'truefalse', 'picture'
  const [exIndex, setExIndex] = useState(0);
  const [exState, setExState] = useState(null); // exercise-specific state
  const [exFeedback, setExFeedback] = useState(null);
  const [showExConfetti, setShowExConfetti] = useState(false);
  const [showExXP, setShowExXP] = useState(false);
  const [pictureResponse, setPictureResponse] = useState('');

  const exKey = condition && stage ? `${condition.id}_${stage.id}` : null;
  let exercises = exKey ? SEN_EXERCISES[exKey] : null;

  // Mix in UAE exercises when student is in UAE
  if (exercises && isUAE) {
    const stageId = stage?.id || '';
    exercises = { ...exercises };
    // Replace Pakistan-specific money/geography questions with UAE versions
    if (exercises.fill) {
      const uaeFill = stageId === 'sixthform' ? UAE_EXERCISES.money_fill_sixthform : UAE_EXERCISES.money_fill;
      const uaeGeoFill = UAE_EXERCISES.geography_fill || [];
      if (uaeFill || uaeGeoFill.length) {
        // Filter out Pakistan-specific fill questions (Rs currency, Pakistan-specific content)
        const filtered = exercises.fill.filter(q =>
          !(/\bRs\b/.test(q.sentence)) &&
          !(/Pakistan ki qoumi/.test(q.sentence)) &&
          !(/emergency in Pakistan/.test(q.sentence)) &&
          !(/founder of Pakistan/.test(q.sentence))
        );
        exercises.fill = [...filtered, ...(uaeFill || []), ...uaeGeoFill];
      }
    }
    if (exercises.truefalse) {
      const uaeGeoTF = UAE_EXERCISES.geography_truefalse || [];
      // Filter out Pakistan Studies true/false
      const filtered = exercises.truefalse.filter(q =>
        !(/Quaid-e-Azam/.test(q.statement)) &&
        !(/Rs\s?\d/.test(q.statement))
      );
      exercises.truefalse = [...filtered, ...uaeGeoTF];
    }
    if (exercises.picture) {
      const uaePic = stageId === 'sixthform' ? UAE_EXERCISES.picture_sixthform
        : stageId === 'secondary' ? UAE_EXERCISES.picture_secondary
        : UAE_EXERCISES.picture_primary;
      if (uaePic) {
        // Filter out Pakistan-specific picture scenarios (Lahore, Pakistan references)
        const filtered = exercises.picture.filter(q =>
          !(/Lahore/.test(q.scene || q.scenario || '')) &&
          !(/Pakistan/.test(q.scene || q.scenario || q.prompt || '')) &&
          !(/Rs\s?\d/.test(q.scene || q.scenario || ''))
        );
        exercises.picture = [...filtered, ...uaePic];
      }
    }
    if (exercises.match && stageId === 'sixthform' && UAE_EXERCISES.match_sixthform) {
      exercises.match = [...exercises.match, ...UAE_EXERCISES.match_sixthform];
    }
  }

  const resetEx = () => { setActiveExType(null); setExIndex(0); setExState(null); setExFeedback(null); setShowExConfetti(false); setPictureResponse(''); };

  const triggerCorrect = () => {
    sndOk();
    setShowExConfetti(true);
    setShowExXP(true);
    setXpData(prev => addCorrectXP(prev));
    setTimeout(() => { setShowExConfetti(false); setShowExXP(false); }, 2000);
  };

  const triggerWrong = () => {
    sndErr();
  };

  if (!exercises) return null;

  // ── MATCH PAIRS EXERCISE ──
  const renderMatch = () => {
    const data = exercises.match[exIndex % exercises.match.length];
    if (!exState) {
      // shuffle pairs for display
      const left = data.pairs.map(p => p[0]);
      const right = [...data.pairs.map(p => p[1])].sort(() => Math.random() - 0.5);
      setExState({ left, right, matched: [], selectedLeft: null, wrongPair: null });
      return null;
    }
    const { left, right, matched, selectedLeft, wrongPair } = exState;
    const allMatched = matched.length === left.length;

    if (allMatched && !exFeedback) {
      setExFeedback('complete');
      triggerCorrect();
    }

    return (
      <div style={{ position:"relative" }}>
        {showExConfetti && <SENConfetti />}
        {showExXP && <FloatingXP amount={10} />}
        <div style={{ fontWeight:900, fontSize:15, color:"#A78BFA", marginBottom:14, fontFamily:"'Nunito',sans-serif" }}>Match the Pairs</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {left.map((item, i) => {
              const isMatched = matched.includes(i);
              const isSelected = selectedLeft === i;
              return (
                <button key={i}
                  aria-label={`Match term: ${item}`}
                  role="button"
                  onClick={() => {
                    if (isMatched) return;
                    sndTick();
                    setExState(prev => ({ ...prev, selectedLeft: i, wrongPair: null }));
                  }}
                  style={{
                    background: isMatched ? "rgba(168,224,99,0.15)" : isSelected ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.05)",
                    border: `2px solid ${isMatched ? "rgba(168,224,99,0.4)" : isSelected ? "#A78BFA" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 14, padding: "14px 12px", color: isMatched ? "#A8E063" : isSelected ? "#A78BFA" : "rgba(255,255,255,0.8)",
                    fontWeight: 700, fontSize: 14, cursor: isMatched ? "default" : "pointer",
                    fontFamily: "'Nunito',sans-serif", minHeight: 52, textAlign: "left",
                    opacity: isMatched ? 0.6 : 1, transition: "all 0.15s",
                  }}>
                  {isMatched ? "✓ " : ""}{item}
                </button>
              );
            })}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {right.map((item, ri) => {
              const matchedRightIndex = matched.findIndex(mi => {
                const originalPair = data.pairs[mi];
                return originalPair[1] === item;
              });
              const isMatched = matchedRightIndex !== -1;
              const isWrong = wrongPair === ri;
              return (
                <button key={ri}
                  aria-label={`Match definition: ${item}`}
                  role="button"
                  onClick={() => {
                    if (isMatched || selectedLeft === null) return;
                    sndTick();
                    // Check if this right item matches the selected left
                    const correctDef = data.pairs[selectedLeft][1];
                    if (item === correctDef) {
                      sndPop();
                      setExState(prev => ({ ...prev, matched: [...prev.matched, selectedLeft], selectedLeft: null, wrongPair: null }));
                    } else {
                      triggerWrong();
                      setExState(prev => ({ ...prev, wrongPair: ri }));
                      setTimeout(() => setExState(prev => prev ? ({ ...prev, wrongPair: null }) : prev), 800);
                    }
                  }}
                  style={{
                    background: isMatched ? "rgba(168,224,99,0.15)" : isWrong ? "rgba(248,113,113,0.15)" : "rgba(255,255,255,0.05)",
                    border: `2px solid ${isMatched ? "rgba(168,224,99,0.4)" : isWrong ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 14, padding: "14px 12px", color: isMatched ? "#A8E063" : isWrong ? "#F87171" : "rgba(255,255,255,0.8)",
                    fontWeight: 700, fontSize: 14, cursor: isMatched ? "default" : "pointer",
                    fontFamily: "'Nunito',sans-serif", minHeight: 52, textAlign: "left",
                    opacity: isMatched ? 0.6 : 1, transition: "all 0.15s",
                    animation: isWrong ? "senShake 0.4s ease" : "none",
                  }}>
                  {isMatched ? "✓ " : ""}{item}
                </button>
              );
            })}
          </div>
        </div>
        {allMatched && (
          <div style={{ textAlign:"center", padding:16 }}>
            <div style={{ fontSize:28, marginBottom:8 }}>🌟 All matched!</div>
            <button aria-label="Try another exercise" role="button" onClick={() => { setExIndex(i => i + 1); setExState(null); setExFeedback(null); }} style={{ background:"linear-gradient(135deg,#A78BFA,#7C5CBF)", border:"none", borderRadius:14, padding:"14px 28px", color:"#fff", fontWeight:900, fontSize:15, fontFamily:"'Nunito',sans-serif", cursor:"pointer", minHeight:52 }}>
              Next Set →
            </button>
          </div>
        )}
      </div>
    );
  };

  // ── FILL THE BLANK EXERCISE ──
  const renderFill = () => {
    const data = exercises.fill[exIndex % exercises.fill.length];
    return (
      <div style={{ position:"relative" }}>
        {showExConfetti && <SENConfetti />}
        {showExXP && <FloatingXP amount={10} />}
        <div style={{ fontWeight:900, fontSize:15, color:"#63D2FF", marginBottom:14, fontFamily:"'Nunito',sans-serif" }}>Fill the Blank</div>
        <div style={{ fontSize:18, lineHeight:1.8, color:"rgba(255,255,255,0.95)", background:"rgba(99,210,255,0.07)", border:"1px solid rgba(99,210,255,0.2)", borderRadius:14, padding:20, marginBottom:16, fontFamily:"'Nunito',sans-serif", fontWeight:600 }}>
          {data.sentence}
        </div>
        {!exFeedback && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:16 }}>
            {data.options.map(opt => (
              <button key={opt}
                aria-label={`Answer option: ${opt}`}
                role="button"
                onClick={() => {
                  sndTick();
                  if (opt === data.answer) {
                    setExFeedback('correct');
                    triggerCorrect();
                  } else {
                    setExFeedback('wrong');
                    triggerWrong();
                  }
                }}
                style={{
                  background: "rgba(255,255,255,0.05)", border: "2px solid rgba(255,255,255,0.12)",
                  borderRadius: 14, padding: "16px 14px", color: "rgba(255,255,255,0.85)",
                  fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: "'Nunito',sans-serif",
                  minHeight: 52, transition: "all 0.15s",
                }}>
                {opt}
              </button>
            ))}
          </div>
        )}
        {exFeedback && (
          <div style={{ textAlign:"center", padding:16 }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{exFeedback === 'correct' ? "🌟 Correct!" : "Almost! The answer was: " + data.answer}</div>
            <button aria-label="Next question" role="button" onClick={() => { setExIndex(i => i + 1); setExFeedback(null); }} style={{ background:"linear-gradient(135deg,#63D2FF,#4F8EF7)", border:"none", borderRadius:14, padding:"14px 28px", color:"#fff", fontWeight:900, fontSize:15, fontFamily:"'Nunito',sans-serif", cursor:"pointer", minHeight:52 }}>
              Next →
            </button>
          </div>
        )}
      </div>
    );
  };

  // ── TRUE OR FALSE EXERCISE ──
  const renderTrueFalse = () => {
    const data = exercises.truefalse[exIndex % exercises.truefalse.length];
    return (
      <div style={{ position:"relative" }}>
        {showExConfetti && <SENConfetti />}
        {showExXP && <FloatingXP amount={10} />}
        <div style={{ fontWeight:900, fontSize:15, color:"#FFC300", marginBottom:14, fontFamily:"'Nunito',sans-serif" }}>True or False?</div>
        <div style={{ fontSize:20, lineHeight:1.8, color:"rgba(255,255,255,0.95)", background:"rgba(255,195,0,0.07)", border:"1px solid rgba(255,195,0,0.2)", borderRadius:14, padding:20, marginBottom:20, fontFamily:"'Nunito',sans-serif", fontWeight:700, textAlign:"center" }}>
          {data.statement}
        </div>
        {!exFeedback && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <button aria-label="True" role="button" onClick={() => {
              sndTick();
              if (data.answer === true) { setExFeedback('correct'); triggerCorrect(); }
              else { setExFeedback('wrong'); triggerWrong(); }
            }} style={{ background:"rgba(168,224,99,0.1)", border:"2px solid rgba(168,224,99,0.3)", borderRadius:16, padding:"20px", color:"#A8E063", fontWeight:900, fontSize:20, cursor:"pointer", fontFamily:"'Nunito',sans-serif", minHeight:52 }}>
              ✓ TRUE
            </button>
            <button aria-label="False" role="button" onClick={() => {
              sndTick();
              if (data.answer === false) { setExFeedback('correct'); triggerCorrect(); }
              else { setExFeedback('wrong'); triggerWrong(); }
            }} style={{ background:"rgba(248,113,113,0.1)", border:"2px solid rgba(248,113,113,0.3)", borderRadius:16, padding:"20px", color:"#F87171", fontWeight:900, fontSize:20, cursor:"pointer", fontFamily:"'Nunito',sans-serif", minHeight:52 }}>
              ✗ FALSE
            </button>
          </div>
        )}
        {exFeedback && (
          <div style={{ textAlign:"center", padding:16 }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{exFeedback === 'correct' ? "🌟 Correct!" : `Almost! The answer was ${data.answer ? "TRUE" : "FALSE"}`}</div>
            <button aria-label="Next question" role="button" onClick={() => { setExIndex(i => i + 1); setExFeedback(null); }} style={{ background:"linear-gradient(135deg,#FFC300,#F4A261)", border:"none", borderRadius:14, padding:"14px 28px", color:"#060B20", fontWeight:900, fontSize:15, fontFamily:"'Nunito',sans-serif", cursor:"pointer", minHeight:52 }}>
              Next →
            </button>
          </div>
        )}
      </div>
    );
  };

  // ── PICTURE THIS EXERCISE ──
  const renderPicture = () => {
    const data = exercises.picture[exIndex % exercises.picture.length];
    return (
      <div style={{ position:"relative" }}>
        {showExConfetti && <SENConfetti />}
        {showExXP && <FloatingXP amount={10} />}
        <div style={{ fontWeight:900, fontSize:15, color:"#FF6B9D", marginBottom:14, fontFamily:"'Nunito',sans-serif" }}>Picture This!</div>
        <div style={{ fontSize:18, lineHeight:1.9, color:"rgba(255,255,255,0.95)", background:"rgba(255,107,157,0.07)", border:"1px solid rgba(255,107,157,0.2)", borderRadius:14, padding:20, marginBottom:14, fontFamily:"'Nunito',sans-serif", fontWeight:600 }}>
          {data.scene}
        </div>
        <div style={{ fontSize:14, color:"rgba(255,255,255,0.6)", marginBottom:12, fontWeight:700 }}>{data.prompt}</div>
        {!exFeedback && (
          <>
            <textarea
              value={pictureResponse}
              onChange={e => setPictureResponse(e.target.value)}
              aria-label="Your answer"
              placeholder="Type or speak your answer here..."
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"2px solid rgba(255,107,157,0.2)", borderRadius:12, color:"#fff", padding:"14px", fontSize:16, lineHeight:1.7, fontFamily:"'Nunito',sans-serif", outline:"none", resize:"vertical", minHeight:80, boxSizing:"border-box", marginBottom:12 }}
            />
            <button aria-label="Submit your answer" role="button" onClick={() => {
              if (!pictureResponse.trim()) return;
              sndTick();
              setExFeedback('done');
              triggerCorrect();
            }} disabled={!pictureResponse.trim()} style={{ width:"100%", background:pictureResponse.trim() ? "linear-gradient(135deg,#FF6B9D,#C77DFF)" : "rgba(255,255,255,0.08)", border:"none", borderRadius:14, padding:"14px", color:pictureResponse.trim() ? "#fff" : "rgba(255,255,255,0.3)", fontWeight:900, fontSize:15, fontFamily:"'Nunito',sans-serif", cursor:"pointer", minHeight:52, opacity:pictureResponse.trim()?1:0.5 }}>
              Share My Answer ✨
            </button>
          </>
        )}
        {exFeedback && (
          <div style={{ textAlign:"center", padding:16 }}>
            <div style={{ fontSize:28, marginBottom:8 }}>🌟 Wonderful imagination!</div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.5)", marginBottom:16 }}>Every answer is a great answer when you try your best.</div>
            <button aria-label="Next scenario" role="button" onClick={() => { setExIndex(i => i + 1); setExFeedback(null); setPictureResponse(''); }} style={{ background:"linear-gradient(135deg,#FF6B9D,#C77DFF)", border:"none", borderRadius:14, padding:"14px 28px", color:"#fff", fontWeight:900, fontSize:15, fontFamily:"'Nunito',sans-serif", cursor:"pointer", minHeight:52 }}>
              Next Scenario →
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ marginTop:16 }}>
      {!activeExType ? (
        <>
          <div style={{ fontSize:12, fontWeight:900, color:"rgba(255,255,255,0.6)", letterSpacing:2, textAlign:"center", marginBottom:12, marginTop:8 }}>QUICK EXERCISES</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
            {[
              { id:"match", emoji:"🔗", name:"Match Pairs", color:"#A78BFA", desc:"Tap to match terms" },
              { id:"fill", emoji:"✏️", name:"Fill the Blank", color:"#63D2FF", desc:"Find the missing word" },
              { id:"truefalse", emoji:"⚖️", name:"True or False", color:"#FFC300", desc:"Quick true/false" },
              { id:"picture", emoji:"🎨", name:"Picture This", color:"#FF6B9D", desc:"Imagine and respond" },
            ].map(ex => (
              <button key={ex.id}
                aria-label={`Start ${ex.name} exercise`}
                role="button"
                onClick={() => { sndTick(); setActiveExType(ex.id); setExIndex(0); setExState(null); setExFeedback(null); }}
                style={{
                  background: ex.color + "0A", border: "2px solid " + ex.color + "30", borderRadius: 16,
                  padding: "16px 12px", textAlign: "center", color: "#fff", cursor: "pointer",
                  fontFamily: "'Nunito',sans-serif", transition: "all 0.15s", minHeight: 52,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = ex.color + "18"; e.currentTarget.style.borderColor = ex.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = ex.color + "0A"; e.currentTarget.style.borderColor = ex.color + "30"; e.currentTarget.style.transform = "none"; }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{ex.emoji}</div>
                <div style={{ fontWeight: 900, fontSize: 13, color: ex.color }}>{ex.name}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{ex.desc}</div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"20px 18px", position:"relative", overflow:"hidden" }}>
          <button aria-label="Close exercise" role="button" onClick={resetEx} style={{ position:"absolute", top:12, right:12, background:"rgba(255,255,255,0.08)", border:"none", borderRadius:"50%", width:36, height:36, color:"rgba(255,255,255,0.5)", fontWeight:900, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", minHeight:52, minWidth:52, zIndex:10 }}>✕</button>
          {activeExType === 'match' && renderMatch()}
          {activeExType === 'fill' && renderFill()}
          {activeExType === 'truefalse' && renderTrueFalse()}
          {activeExType === 'picture' && renderPicture()}
        </div>
      )}
    </div>
  );
}

export default function SpecialNeedsPage() {
  const [step, setStep]           = useState(1); // 1=condition, 2=stage, 3=focus, 4=chat
  const [urduMode, setUrduMode]   = useState(false); // Urdu language toggle
  const [region, setRegion]       = useState('pk'); // pk, ae, sa, gb, other
  const isUAE = region === 'ae' || region === 'sa'; // UAE + Saudi share Gulf context
  const [condition, setCondition] = useState(null);
  const [stage, setStage]         = useState(null);
  const [focus, setFocus]         = useState(null);
  const [subject, setSubject]     = useState("");
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [isMobile, setIsMobile]   = useState(false);
  const [progress, setProgress]   = useState({});
  const [xpData, setXpData]       = useState({ xp: 0, sessions: 0, streak: 0, lastDay: null, correctStreak: 0 });
  const [chatMsgCount, setChatMsgCount] = useState(0);
  const [showChatConfetti, setShowChatConfetti] = useState(false);
  const [focusMode, setFocusMode]     = useState(false);
  const [safeSpace, setSafeSpace]     = useState(false); // Starky Safe Space — calm full-screen chat
  const chatEndRef = useRef(null);
  // SEN students get UNLIMITED sessions — never rate-limit special needs learners
  const { recordCall } = useSessionLimit();
  const limitReached = false;
  const callsLeft = 999;

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn(); window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  // Auto-detect region from timezone, user can override
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nw_sen_region');
      if (saved) { setRegion(saved); return; }
      const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
      if (tz.includes('dubai') || tz.includes('muscat')) setRegion('ae');
      else if (tz.includes('riyadh') || tz.includes('jeddah')) setRegion('sa');
      else if (tz.includes('london') || tz.includes('europe/london')) setRegion('gb');
    } catch {}
  }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);
  useEffect(() => { setProgress(loadP()); }, []);
  useEffect(() => { setXpData(loadXP()); }, []);
  useEffect(() => { try { if (localStorage.getItem('nw_sen_focus') === 'true') setFocusMode(true); } catch {} }, []);
  // Safe Space: if SEN profile has safestart enabled, or ?safestart query param, launch directly into calm chat
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const user = JSON.parse(localStorage.getItem('nw_user') || '{}');
      if (params.get('safestart') === '1' || (user.senFlag && localStorage.getItem('nw_sen_safestart') === 'true')) {
        const savedCondition = localStorage.getItem('nw_sen_last_condition');
        const savedStage = localStorage.getItem('nw_sen_last_stage');
        if (savedCondition && savedStage) {
          const c = CONDITIONS.find(x => x.id === savedCondition);
          const s = STAGES.find(x => x.id === savedStage);
          if (c && s) {
            setCondition(c); setStage(s);
            setFocus(FOCUSES.find(f => f.id === 'academic') || FOCUSES[0]);
            setSafeSpace(true); setFocusMode(true);
            const userName = user.name?.split(' ')[0] || '';
            setMessages([{ role: 'assistant', content: `Hello${userName ? ' ' + userName : ''}. I'm here.\nTake your time. What would you like to do?` }]);
            setStep(4);
          }
        }
      }
    } catch {}
  }, []);

  const accentColor = condition?.color || "#C77DFF";

  const CSS = `
    *{box-sizing:border-box} button:focus,textarea:focus,input:focus{outline:4px solid #FFC300;outline-offset:2px}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:4px}
    @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
    @keyframes glow{0%,100%{box-shadow:0 0 20px ${accentColor}30}50%{box-shadow:0 0 40px ${accentColor}60}}
    @keyframes senConfettiFall{0%{opacity:1;transform:translateY(-20px) rotate(0)}100%{opacity:0;transform:translateY(180px) rotate(720deg)}}
    @keyframes senFloatUp{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-50px)}}
    @keyframes senBounceIn{0%{opacity:0;transform:scale(.7)}60%{transform:scale(1.08)}80%{transform:scale(.97)}100%{opacity:1;transform:scale(1)}}
    @keyframes senShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
    @media (prefers-reduced-motion: reduce) {
      *{animation:none !important;transition:none !important}
    }
    .sen-focus-mode *{animation:none !important;transition:none !important}
    .sen-focus-mode{background:#0A0F1E !important;font-size:20px !important;line-height:1.8 !important;color:#fff !important}
    .sen-focus-mode *{color:inherit}
    .sen-focus-mode button,.sen-focus-mode a{color:inherit}
    @media (prefers-color-scheme: light){.sen-focus-mode{background:#FFFFFF !important;color:#1a1a1a !important}
      .sen-focus-mode *{color:inherit}}
    /* iOS button fix — ensure ENTIRE button area is clickable, not just the text */
    button,a,[role="button"]{-webkit-tap-highlight-color:transparent;touch-action:manipulation;cursor:pointer;-webkit-appearance:none;position:relative}
    button>*,button>span,button>div,[role="button"]>*{pointer-events:none}
    /* Responsive grids for SEN cards */
    .sen-grid-cards{display:grid;gap:12px;grid-template-columns:repeat(2,1fr)}
    @media(max-width:400px){.sen-grid-cards{grid-template-columns:1fr}}
    @media(min-width:769px){.sen-grid-cards{grid-template-columns:repeat(4,1fr)}}
    .sen-grid-quick{display:grid;gap:8px;grid-template-columns:repeat(2,1fr)}
    @media(max-width:400px){.sen-grid-quick{grid-template-columns:1fr}}
    @media(min-width:769px){.sen-grid-quick{grid-template-columns:repeat(4,1fr)}}
    /* Landscape phone — reduce chat height */
    @media(orientation:landscape) and (max-height:500px){
      .sen-chat-area{height:calc(100vh - 160px) !important;min-height:150px !important}
    }
  `;

  const S = {
    page: { minHeight:"100vh", background:"linear-gradient(135deg,#060B20 0%,#0D1635 60%,#060B20 100%)", fontFamily:"'Nunito',sans-serif", color:"#fff" },
    hdr:  { padding:isMobile?"12px 16px":"14px 28px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between" },
    btn:  { border:"none", cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"all 0.2s" },
  };

  const startChat = (focusOverride) => {
    const effectiveFocus = focusOverride || focus;
    if (!condition || !stage || !effectiveFocus) return;
    const key = `${condition.id}_${stage.id}`;
    const p = loadP();
    if (!p[key]) p[key] = { sessions:0, lastSeen:null };
    p[key].sessions++;
    p[key].lastSeen = new Date().toISOString().split("T")[0];
    saveP(p); setProgress(p);
    // Remember last condition/stage for Safe Space quick-launch
    try { localStorage.setItem('nw_sen_last_condition', condition.id); localStorage.setItem('nw_sen_last_stage', stage.id); } catch {}

    const welcome = `Hello! I'm Starky — your specialist tutor.

I'm set up to support a ${stage.name} student (${stage.ages}) with ${condition.name}.

${effectiveFocus.id === "parent"
  ? `You've chosen Parent & Carer guidance. I'm here to give you practical, evidence-based support for helping your child at home. Ask me anything — what to do, what to avoid, how to support specific challenges, or where to find more help.`
  : effectiveFocus.id === "academic" && subject
  ? `Today's focus: ${subject} — adapted for ${condition.name} at ${stage.name} level.\n\nEvery explanation will be broken into micro-steps. Every question is designed for this stage. Let's start!\n\nWhat would you like to work on in ${subject} today?`
  : effectiveFocus.id === "creative"
  ? `Creative learning — Music, Reading, and Arts — adapted for ${condition.name} at ${stage.name} level.\n\nWhich would you like to explore today — Music, Reading, or Arts?`
  : effectiveFocus.id === "life"
  ? `Life Skills for a ${stage.name} student with ${condition.name}.\n\nWhat area would you like to focus on? (Communication, independence, social situations, daily routines, self-advocacy...)`
  : effectiveFocus.id === "exam"
  ? `Exam preparation for ${stage.grades}, adapted for ${condition.name}.\n\nWhich subject or exam are we preparing for?`
  : `What would you like to work on today?`
}

${effectiveFocus.id !== "parent" ? `\n*For the adult:* Tell me your child's name if you'd like me to use it, and anything specific about how they're feeling today.` : ""}`;

    setMessages([{ role:"assistant", content:welcome }]);
    setChatMsgCount(0);
    setShowChatConfetti(false);
    setXpData(prev => recordSessionXP(prev));
    setStep(4);
  };

  const sendMessage = async (text) => {
    const txt = (text || input).trim();
    if (!txt || loading || limitReached) return;
    sndTick();
    setInput(""); recordCall();
    // UAE Summer Passport — increment stamp for SEN track
    try {
      const uc = localStorage.getItem('user_country');
      if (uc === 'UAE') {
        const now = new Date();
        if (now.getMonth() >= 6 && now.getMonth() <= 7) {
          const pp = JSON.parse(localStorage.getItem('nw_summer_uae_passport') || '{}');
          if (!pp.stamps) pp.stamps = [];
          pp.stamps.push({ date: now.toISOString(), subject: 'SEN — Students of Determination' });
          localStorage.setItem('nw_summer_uae_passport', JSON.stringify(pp));
        }
      }
    } catch {}
    const newCount = chatMsgCount + 1;
    setChatMsgCount(newCount);
    if (newCount === 5) {
      sndWin();
      setShowChatConfetti(true);
      setTimeout(() => setShowChatConfetti(false), 2500);
    }
    const prev = [...messages, { role:"user", content:txt }];
    setMessages(prev); setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:/* PERMANENT: Haiku 3 only. Never change without Khurrams approval. */ "claude-3-haiku-20240307",
          max_tokens:1500,
          system:buildPrompt(condition, stage, focus, subject, urduMode, isUAE),
          messages:prev.map(m => ({ role:m.role, content:m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Something went wrong — please try again.";
      setMessages(p => [...p, { role:"assistant", content:reply }]);
      // Signal collection
      try {
        const { recordMessageSignal, recordStrategySignal } = await import('../utils/signalCollector');
        const profile = JSON.parse(localStorage.getItem('nw_user') || '{}');
        const subjectName = subject || focus?.name;
        recordMessageSignal({ email: profile.email || 'anonymous', subject: subjectName, grade: profile.grade || '', userMessage: txt, starkyResponse: reply, sessionNumber: 1 });
        recordStrategySignal({ email: profile.email || 'anonymous', subject: subjectName, grade: profile.grade || '', starkyResponse: reply, userResponse: txt });
      } catch {}
      // Session-complete analysis
      try {
        const msgCount = prev.filter(m => m.role === 'user').length;
        if (msgCount === 5 || (msgCount > 5 && msgCount % 10 === 0)) {
          const profile = JSON.parse(localStorage.getItem('nw_user') || '{}');
          fetch('/api/session-complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentId: profile.email || 'anonymous',
              studentName: profile.name || 'Student',
              parentEmail: msgCount === 5 ? (profile.parentEmail || profile.email) : null,
              grade: profile.grade,
              subject: subject || focus?.name,
              messages: [...prev, { role:"assistant", content:reply }].slice(-20),
              isSEN: true,
              senType: condition?.id || null,
            }),
          }).catch(() => {});
        }
      } catch {}
      // Persist SEN flag to nw_user so StarkyBubble and other pages know this student has SEN
      try {
        const u = JSON.parse(localStorage.getItem('nw_user') || '{}');
        if (!u.senFlag && condition?.id) {
          localStorage.setItem('nw_user', JSON.stringify({ ...u, senFlag: true, senType: condition.id }));
        }
      } catch {}
    } catch {
      setMessages(p => [...p, { role:"assistant", content:"Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  const reset = () => { setStep(1); setCondition(null); setStage(null); setFocus(null); setSubject(""); setMessages([]); };

  const toggleFocusMode = () => {
    const next = !focusMode;
    setFocusMode(next);
    try { localStorage.setItem('nw_sen_focus', String(next)); } catch {}
  };

  // ── STEP INDICATOR ──────────────────────────────────────────────────
  const StepBar = () => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:32 }}>
      {[
        { n:1, label:"Condition" },
        { n:2, label:"Age & Stage" },
        { n:3, label:"Focus" },
        { n:4, label:"Learn" },
      ].map((s, i) => (
        <div key={s.n} style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{
            width:32, height:32, borderRadius:"50%",
            background: step >= s.n ? accentColor : "rgba(255,255,255,0.08)",
            border: "2px solid " + (step >= s.n ? accentColor : "rgba(255,255,255,0.15)"),
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:13, fontWeight:900,
            color: step >= s.n ? "#060B20" : "rgba(255,255,255,0.3)",
            transition:"all 0.3s",
            cursor: step > s.n ? "pointer" : "default",
          }} onClick={() => { if (step > s.n) { setStep(s.n); if (s.n <= 1) { setStage(null); setFocus(null); setSubject(''); setMessages([]); } if (s.n <= 2) { setFocus(null); setSubject(''); setMessages([]); } if (s.n <= 3) { setSubject(''); setMessages([]); } } }}>
            {step > s.n ? "✓" : s.n}
          </div>
          {!isMobile && <span style={{ fontSize:11, fontWeight:700, color: step >= s.n ? accentColor : "rgba(255,255,255,0.25)" }}>{s.label}</span>}
          {i < 3 && <div style={{ width:isMobile?16:28, height:2, background: step > s.n ? accentColor+"60" : "rgba(255,255,255,0.08)", borderRadius:2 }}/>}
        </div>
      ))}
    </div>
  );

  // ── SELECTED SUMMARY BAR ────────────────────────────────────────────
  const SummaryBar = () => {
    if (!condition && !stage) return null;
    return (
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:24 }}>
        {condition && (
          <button aria-label={`Change condition: ${condition.name}`} style={{ background:condition.color+"15", border:"1px solid "+condition.color+"40", borderRadius:20, padding:"6px 14px", minHeight:36, fontSize:12, fontWeight:800, color:condition.color, display:"flex", alignItems:"center", gap:5, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}
            onClick={() => { setStep(1); setStage(null); setFocus(null); setSubject(''); setMessages([]); }}>
            {condition.emoji} {condition.name} ×
          </button>
        )}
        {stage && (
          <button aria-label={`Change stage: ${stage.name}`} style={{ background:stage.color+"15", border:"1px solid "+stage.color+"40", borderRadius:20, padding:"6px 14px", minHeight:36, fontSize:12, fontWeight:800, color:stage.color, display:"flex", alignItems:"center", gap:5, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}
            onClick={() => { setStep(2); setFocus(null); setSubject(''); setMessages([]); }}>
            {stage.emoji} {stage.name} ×
          </button>
        )}
        {focus && (
          <button aria-label={`Change focus: ${focus.name}`} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:20, padding:"6px 14px", minHeight:36, fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.6)", display:"flex", alignItems:"center", gap:5, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}
            onClick={() => { setStep(3); setSubject(''); setMessages([]); }}>
            {focus.emoji} {focus.name} ×
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={focusMode ? 'sen-focus-mode' : ''} style={{...S.page, ...(focusMode ? {background:focusMode?'#0A0F1E':''}:{})}}><style>{CSS}</style>
      <Head>
        <title>Special Needs Support — NewWorldEdu</title>
        <meta name="description" content="Tutoring adapted for autism, ADHD, dyslexia, and Down syndrome. 140 teaching profiles with evidence-based strategies for Pakistani students." />
        <meta property="og:title" content="Special Needs Support — Adapted Tutoring" />
        <meta property="og:description" content="Tutoring adapted for autism, ADHD, dyslexia, and Down syndrome. 140 teaching profiles with evidence-based strategies for Pakistani students." />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      {/* HEADER */}
      <header style={S.hdr}>
        <a href="/" style={{ textDecoration:"none", fontWeight:900, fontSize:isMobile?13:15, color:"#fff" }}>
          NewWorldEdu<span style={{ color:"#4F8EF7" }}>★</span>
        </a>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {/* Focus Mode toggle */}
          <button
            onClick={toggleFocusMode}
            aria-label={focusMode ? "Turn off Focus Mode" : "Turn on Focus Mode — reduced visual complexity"}
            title="Focus Mode — removes distractions for easier learning"
            style={{ ...S.btn, background: focusMode ? "rgba(168,224,99,0.2)" : "rgba(255,255,255,0.05)", border: focusMode ? "1px solid rgba(168,224,99,0.5)" : "1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"6px 12px", color: focusMode ? "#A8E063" : "rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, minHeight:36 }}>
            Focus Mode {focusMode ? "●" : "○"}
          </button>
          {/* XP Badge — hidden in focus mode */}
          {!focusMode && (
          <div aria-label={`${xpData.xp} experience points, ${xpData.streak} day streak`} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(168,224,99,0.1)", border:"1px solid rgba(168,224,99,0.3)", borderRadius:20, padding:"4px 12px" }}>
            <span style={{ fontSize:14 }}>⭐</span>
            <span style={{ fontWeight:900, fontSize:12, color:"#A8E063" }}>{xpData.xp} XP</span>
            {xpData.streak > 0 && (
              <span style={{ fontWeight:700, fontSize:11, color:"#FFC300", marginLeft:2 }}>🔥 {xpData.streak}d</span>
            )}
          </div>
          )}
          {step > 1 && (
            <button onClick={reset} aria-label="Start over" role="button" style={{ ...S.btn, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"6px 12px", color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, minHeight:52, minWidth:52 }}>
              ← Start Over
            </button>
          )}
          <button
            onClick={() => { sndTick(); setUrduMode(u => !u); }}
            aria-label={urduMode ? "Switch to English mode" : "Switch to Urdu mode"}
            role="button"
            style={{ ...S.btn, background: urduMode ? "rgba(79,142,247,0.2)" : "rgba(255,255,255,0.05)", border: urduMode ? "1px solid rgba(79,142,247,0.5)" : "1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"6px 12px", color: urduMode ? "#4F8EF7" : "rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, minHeight:52, minWidth:52 }}
            title="Toggle Urdu language mode">
            {urduMode ? "اردو ✓" : "اردو"}
          </button>
          <a href="/parent?sen=1" style={{ background:"linear-gradient(135deg,#4ADE80,#22C55E)", borderRadius:12, padding:"7px 16px", color:"#060B20", fontWeight:900, fontSize:12, textDecoration:"none", minHeight:44, display:"flex", alignItems:"center" }}>Parent Register</a>
          <a href="/pricing" style={{ background:"linear-gradient(135deg,#4F8EF7,#7B5EA7)", borderRadius:12, padding:"7px 16px", color:"#fff", fontWeight:900, fontSize:12, textDecoration:"none", minHeight:44, display:"flex", alignItems:"center" }}>Plans</a>
        </div>
      </header>

      <div style={{ maxWidth:860, margin:"0 auto", padding:isMobile?"20px 16px":"40px 24px" }}>

        {/* ── STEP 1: CONDITION ─────────────────────────────────────── */}
        {step === 1 && (
          <div style={{ animation:"fadeUp 0.4s ease" }}>
            <div style={{ textAlign:"center", marginBottom:36 }}>
              <div style={{ fontSize:isMobile?48:64, marginBottom:12 }}>💜</div>
              <h1 style={{ fontSize:isMobile?24:40, fontWeight:900, margin:"0 0 10px", lineHeight:1.2 }}>
                Specialist Support for <span style={{ color:"#C77DFF" }}>Every Child</span>
              </h1>
              <p style={{ fontSize:isMobile?13:16, color:"rgba(255,255,255,0.55)", maxWidth:520, margin:"0 auto", lineHeight:1.9 }}>
                Starky adapts completely to your child — their condition, their age, their level, their needs. Let's start by telling Starky who they're teaching.
              </p>
            </div>

            {/* ── SAFE SPACE quick-launch ── */}
            {(() => { try { return localStorage.getItem('nw_sen_last_condition') && localStorage.getItem('nw_sen_last_stage'); } catch { return false; } })() && (
              <div style={{ marginBottom:24, display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
                <button onClick={() => {
                  try {
                    const c = CONDITIONS.find(x => x.id === localStorage.getItem('nw_sen_last_condition'));
                    const s = STAGES.find(x => x.id === localStorage.getItem('nw_sen_last_stage'));
                    if (c && s) {
                      setCondition(c); setStage(s);
                      setFocus(FOCUSES.find(f => f.id === 'academic') || FOCUSES[0]);
                      setSafeSpace(true); setFocusMode(true);
                      try { localStorage.setItem('nw_sen_focus', 'true'); } catch {}
                      const user = JSON.parse(localStorage.getItem('nw_user') || '{}');
                      const userName = user.name?.split(' ')[0] || '';
                      setMessages([{ role: 'assistant', content: `Hello${userName ? ' ' + userName : ''}. I'm here.\nTake your time. What would you like to do?` }]);
                      setStep(4);
                    }
                  } catch {}
                }} style={{ ...S.btn, background:"linear-gradient(135deg,rgba(168,224,99,0.12),rgba(99,210,255,0.08))", border:"1px solid rgba(168,224,99,0.25)", borderRadius:18, padding:"16px 28px", color:"#A8E063", fontSize:15, fontWeight:800 }}>
                  💜 Safe Space — Just Talk to Starky
                </button>
                <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:11, color:"rgba(255,255,255,0.6)", cursor:"pointer" }}>
                  <input type="checkbox" checked={(() => { try { return localStorage.getItem('nw_sen_safestart') === 'true'; } catch { return false; } })()}
                    onChange={e => { try { localStorage.setItem('nw_sen_safestart', e.target.checked ? 'true' : 'false'); } catch {} }}
                    style={{ accentColor:"#A8E063" }} />
                  Always open in Safe Space mode
                </label>
              </div>
            )}

            {/* ── COUNTRY SELECTOR ── */}
            <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:24, flexWrap:"wrap" }}>
              {[
                { id:'pk', flag:'🇵🇰', label:'Pakistan' },
                { id:'ae', flag:'🇦🇪', label:'UAE' },
                { id:'sa', flag:'🇸🇦', label:'Saudi Arabia' },
                { id:'gb', flag:'🇬🇧', label:'UK' },
                { id:'other', flag:'🌍', label:'Other' },
              ].map(c => (
                <button key={c.id} onClick={() => { setRegion(c.id); try { localStorage.setItem('nw_sen_region', c.id); } catch {} }}
                  style={{
                    display:"flex", alignItems:"center", gap:6,
                    padding:"8px 16px", borderRadius:12, cursor:"pointer",
                    border: region === c.id ? `2px solid ${accentColor}` : "2px solid rgba(255,255,255,0.1)",
                    background: region === c.id ? accentColor+"15" : "rgba(255,255,255,0.04)",
                    color: region === c.id ? accentColor : "rgba(255,255,255,0.6)",
                    fontSize:13, fontWeight:700, fontFamily:"'Nunito',sans-serif",
                    transition:"all 0.15s",
                  }}>
                  <span style={{ fontSize:18 }}>{c.flag}</span>{c.label}
                </button>
              ))}
            </div>

            <StepBar/>

            {/* ── SEN AWARENESS PANEL — Region-aware (UAE / Pakistan) ── */}
            {isUAE ? (
              <div style={{ background:"linear-gradient(135deg,rgba(167,139,250,0.08),rgba(79,142,247,0.06))", border:"1px solid rgba(167,139,250,0.2)", borderRadius:18, padding:"18px 20px", marginBottom:24 }}>
                <div style={{ fontSize:12, fontWeight:900, color:"#A78BFA", letterSpacing:1, marginBottom:12 }}>FOR PARENTS IN THE UAE — IMPORTANT</div>
                <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:10 }}>
                  {[
                    { icon:"⚡", en:"ADHD is underdiagnosed in the Gulf", desc:"Many children are labeled 'naughty' or 'lazy'. ADHD is neurological — early support changes everything." },
                    { icon:"🏫", en:"Your school MUST provide SEN support", desc:"KHDA (Dubai) and ADEK (Abu Dhabi) require inclusive education for all students." },
                    { icon:"📝", en:"Exam access arrangements available", desc:"Extra time, reader, scribe — apply through your school's exam officer for Cambridge, Edexcel, or AQA." },
                    { icon:"💙", en:"People of Determination", desc:"The UAE term for special needs. Your child has legal rights to educational support and accommodations." },
                  ].map(item => (
                    <div key={item.en} style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"12px 14px" }}>
                      <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                        <span style={{ fontSize:18, flexShrink:0 }}>{item.icon}</span>
                        <div>
                          <div style={{ fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.85)", marginBottom:2 }}>{item.en}</div>
                          <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", lineHeight:1.6 }}>{item.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ background:"linear-gradient(135deg,rgba(167,139,250,0.08),rgba(79,142,247,0.06))", border:"1px solid rgba(167,139,250,0.2)", borderRadius:18, padding:"18px 20px", marginBottom:24 }}>
                <div style={{ fontSize:12, fontWeight:900, color:"#A78BFA", letterSpacing:1, marginBottom:12 }}>🇵🇰 بچوں کے بارے میں اہم بات — IMPORTANT FOR PARENTS</div>
                <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:10 }}>
                  {[
                    { icon:"⚡", en:"ADHD is not 'naughtiness'", ur:"شرارت نہیں، ADHD ہے — علاج ممکن ہے", desc:"Restless, impulsive, loses focus? This is neurological, not a behaviour problem." },
                    { icon:"🎵", en:"Dyslexia is widely undiagnosed", ur:"ڈسلیکسیا — پاکستان میں اکثر تشخیص نہیں ہوتی", desc:"Struggles with reading/spelling but smart in other ways? This could be dyslexia." },
                    { icon:"🌟", en:"O Level students can get extra time", ur:"O Level طالب علم کو اضافی وقت مل سکتا ہے", desc:"Cambridge Access Arrangements: 25% extra time, reader, scribe — ask your school's exam officer." },
                    { icon:"❓", en:"No diagnosis yet? That's okay", ur:"تشخیص نہیں ہوئی؟ کوئی بات نہیں", desc:"Choose 'Not Sure' below — describe your child's challenges and Starky will adapt." },
                  ].map(item => (
                    <div key={item.en} style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"12px 14px" }}>
                      <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                        <span style={{ fontSize:18, flexShrink:0 }}>{item.icon}</span>
                        <div>
                          <div style={{ fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.85)", marginBottom:2 }}>{item.en}</div>
                          <div style={{ fontSize:11, fontWeight:700, color:"#A78BFA", marginBottom:4, direction:"rtl", textAlign:"right" }}>{item.ur}</div>
                          <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", lineHeight:1.6 }}>{item.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ fontSize:12, fontWeight:900, color:"rgba(255,255,255,0.6)", letterSpacing:2, textAlign:"center", marginBottom:16 }}>STEP 1 — SELECT CONDITION</div>

            <div className="sen-grid-cards" style={{ marginBottom:16 }}>
              {CONDITIONS.map(c => (
                <button key={c.id} aria-label={`Select condition: ${c.name}`} role="button" onClick={() => { sndTick(); setCondition(c); setStep(2); window.scrollTo({top:0,behavior:'smooth'}); }}
                  style={{ ...S.btn, background:c.color+"0A", border:"2px solid "+c.color+"30", borderRadius:18, padding:"18px 12px", textAlign:"center", color:"#fff", minHeight:52 }}
                  onMouseEnter={e => { e.currentTarget.style.background=c.color+"20"; e.currentTarget.style.borderColor=c.color; e.currentTarget.style.transform="translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=c.color+"0A"; e.currentTarget.style.borderColor=c.color+"30"; e.currentTarget.style.transform="none"; }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>{c.emoji}</div>
                  <div style={{ fontWeight:900, fontSize:13, color:c.color, lineHeight:1.3 }}>{c.name}</div>
                  <div style={{ fontSize:10, color:c.color+"88", marginTop:3, direction:"rtl" }}>{c.urdu}</div>
                  {progress[`${c.id}_early`] || progress[`${c.id}_primary`] || progress[`${c.id}_secondary`] || progress[`${c.id}_sixthform`] ? (
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", marginTop:4 }}>Previously used</div>
                  ) : null}
                </button>
              ))}
            </div>

            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"16px 20px", textAlign:"center" }}>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)", lineHeight:1.8 }}>
                Don't see your child's condition? Choose <strong style={{color:"#A78BFA"}}>Not Sure / Undiagnosed</strong> — Starky will adapt to what you describe.<br/>
                <span style={{fontSize:11, direction:"rtl", display:"inline-block", marginTop:4}}>تشخیص نہ ہو تو بھی کوئی بات نہیں — Starky آپ کے بچے کی مدد کرے گا۔</span>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: AGE/STAGE ─────────────────────────────────────── */}
        {step === 2 && (
          <div style={{ animation:"fadeUp 0.4s ease" }}>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <div style={{ fontSize:48, marginBottom:8 }}>{condition?.emoji}</div>
              <h2 style={{ fontSize:isMobile?22:34, fontWeight:900, margin:"0 0 8px" }}>
                How old is your <span style={{ color:condition?.color }}>child?</span>
              </h2>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.8 }}>
                A 5-year-old with {condition?.name} needs completely different support<br/>from a 15-year-old with {condition?.name}. Age changes everything.
              </p>
            </div>

            <StepBar/>
            <SummaryBar/>

            <div style={{ fontSize:12, fontWeight:900, color:"rgba(255,255,255,0.6)", letterSpacing:2, textAlign:"center", marginBottom:16 }}>STEP 2 — SELECT AGE & STAGE</div>

            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:14 }}>
              {STAGES.map(s => (
                <button key={s.id} aria-label={`Select stage: ${s.name}, ${s.ages}`} role="button" onClick={() => { sndTick(); setStage(s); setStep(3); window.scrollTo({top:0,behavior:'smooth'}); }}
                  style={{ ...S.btn, background:s.color+"08", border:"2px solid "+s.color+"25", borderRadius:20, padding:"22px 20px", textAlign:"left", color:"#fff", minHeight:52 }}
                  onMouseEnter={e => { e.currentTarget.style.background=s.color+"18"; e.currentTarget.style.borderColor=s.color; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=s.color+"08"; e.currentTarget.style.borderColor=s.color+"25"; e.currentTarget.style.transform="none"; }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:10 }}>
                    <div style={{ fontSize:36 }}>{s.emoji}</div>
                    <div>
                      <div style={{ fontWeight:900, fontSize:17, color:s.color }}>{s.name}</div>
                      <div style={{ fontSize:12, fontWeight:700, color:s.color+"AA" }}>{s.ages}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)" }}>{s.grades}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.7, marginBottom:10 }}>{s.desc}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {s.subjects.slice(0,4).map(sub => (
                      <span key={sub} style={{ background:s.color+"12", border:"1px solid "+s.color+"25", borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:700, color:s.color+"CC" }}>{sub}</span>
                    ))}
                    <span style={{ background:"rgba(255,255,255,0.05)", borderRadius:20, padding:"2px 8px", fontSize:10, color:"rgba(255,255,255,0.6)" }}>+{s.subjects.length-4} more</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: FOCUS ─────────────────────────────────────────── */}
        {step === 3 && (
          <div style={{ animation:"fadeUp 0.4s ease" }}>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <div style={{ fontSize:48, marginBottom:8 }}>🎯</div>
              <h2 style={{ fontSize:isMobile?22:34, fontWeight:900, margin:"0 0 8px" }}>
                What does your child <span style={{ color:accentColor }}>need today?</span>
              </h2>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.8 }}>
                {condition?.name} · {stage?.name} · {stage?.ages}
              </p>
            </div>

            <StepBar/>
            <SummaryBar/>

            <div style={{ fontSize:12, fontWeight:900, color:"rgba(255,255,255,0.6)", letterSpacing:2, textAlign:"center", marginBottom:16 }}>STEP 3 — SELECT LEARNING FOCUS</div>

            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)", gap:12, marginBottom:20 }}>
              {FOCUSES.map(f => (
                <button key={f.id} aria-label={`Select focus: ${f.name} — ${f.desc}`} role="button" onClick={() => { sndTick(); setFocus(f); window.scrollTo({top:0,behavior:'smooth'}); if (f.id !== "academic") { setTimeout(() => startChat(f), 200); } }}
                  style={{ ...S.btn, background: focus?.id===f.id ? accentColor+"18" : "rgba(255,255,255,0.04)", border:"2px solid "+(focus?.id===f.id ? accentColor : "rgba(255,255,255,0.08)"), borderRadius:18, padding:"18px 14px", textAlign:"left", color:"#fff", minHeight:52 }}
                  onMouseEnter={e => { e.currentTarget.style.background=accentColor+"12"; e.currentTarget.style.borderColor=accentColor+"50"; }}
                  onMouseLeave={e => { if(focus?.id!==f.id){e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";} }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{f.emoji}</div>
                  <div style={{ fontWeight:900, fontSize:14, color: focus?.id===f.id ? accentColor : "rgba(255,255,255,0.85)", marginBottom:4 }}>{f.name}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", lineHeight:1.6 }}>{f.desc}</div>
                </button>
              ))}
            </div>

            {/* Subject selector for Academic focus */}
            {focus?.id === "academic" && (
              <div style={{ background:accentColor+"0A", border:"1px solid "+accentColor+"25", borderRadius:18, padding:20, animation:"fadeUp 0.3s ease" }}>
                <div style={{ fontSize:12, fontWeight:900, color:accentColor, letterSpacing:1, marginBottom:14 }}>SELECT SUBJECT — {stage?.name.toUpperCase()}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
                  {stage?.subjects.map(sub => (
                    <button key={sub} onClick={() => setSubject(sub)}
                      style={{ ...S.btn, background: subject===sub ? accentColor : "rgba(255,255,255,0.05)", border:"1px solid "+(subject===sub ? accentColor : "rgba(255,255,255,0.12)"), borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:700, color: subject===sub ? "#060B20" : "rgba(255,255,255,0.55)" }}>
                      {sub}
                    </button>
                  ))}
                </div>
                <button onClick={startChat}
                  disabled={!subject}
                  style={{ ...S.btn, width:"100%", background: subject ? "linear-gradient(135deg,"+accentColor+","+accentColor+"BB)" : "rgba(255,255,255,0.08)", borderRadius:14, padding:"14px", color: subject ? "#060B20" : "rgba(255,255,255,0.25)", fontWeight:900, fontSize:15 }}>
                  {subject ? `Start session — ${subject} →` : "Select a subject above"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 4: CHAT ──────────────────────────────────────────── */}
        {step === 4 && (
          <div style={{ animation:"fadeUp 0.4s ease", position:"relative" }}>

            {/* Chat confetti — hidden in focus mode */}
            {showChatConfetti && !focusMode && <SENConfetti />}

            {/* Progress bar — hidden in focus mode */}
            {!focusMode && (
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <span style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.65)" }}>Session Progress</span>
                <span style={{ fontSize:11, fontWeight:800, color:"#A8E063" }}>{xpData.xp} / {Math.ceil((xpData.xp + 1) / 500) * 500} XP</span>
              </div>
              <div style={{ height:8, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:100, background:"linear-gradient(90deg,#A8E063,#63D2FF)", width: Math.min(100, (xpData.xp % 500) / 500 * 100) + "%", transition:"width 0.5s ease" }} />
              </div>
              <div style={{ display:"flex", gap:12, marginTop:6 }}>
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.6)" }}>Sessions: {xpData.sessions}</span>
                {xpData.streak > 0 && <span style={{ fontSize:10, color:"#FFC300" }}>🔥 {xpData.streak} day streak</span>}
                {chatMsgCount > 0 && <span style={{ fontSize:10, color:"rgba(255,255,255,0.6)" }}>Messages: {chatMsgCount}</span>}
              </div>
            </div>
            )}

            {/* Profile banner — simplified in focus mode */}
            {!focusMode ? (
            <div style={{ background:"linear-gradient(135deg,"+accentColor+"12,rgba(255,255,255,0.02))", border:"1px solid "+accentColor+"25", borderRadius:18, padding:"14px 18px", marginBottom:14, display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
              <div style={{ fontSize:28 }}>{condition?.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:900, fontSize:14, color:accentColor }}>
                  {condition?.name} · {stage?.name} · {stage?.ages}
                  {urduMode && <span style={{ fontSize:11, background:"rgba(79,142,247,0.2)", border:"1px solid rgba(79,142,247,0.4)", borderRadius:6, padding:"1px 8px", marginLeft:8, color:"#4F8EF7" }}>اردو</span>}
                </div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)" }}>
                  {focus?.emoji} {focus?.name}{subject ? " — "+subject : ""} · {stage?.grades}
                </div>
              </div>
              <button onClick={() => setStep(3)}
                style={{ ...S.btn, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"6px 12px", color:"rgba(255,255,255,0.7)", fontSize:11, fontWeight:700 }}>
                Change Focus
              </button>
            </div>
            ) : (
            <div style={{ padding:"8px 0", marginBottom:8, fontSize:13, color:"rgba(255,255,255,0.6)", fontWeight:600 }}>
              {condition?.name} · {stage?.name}{subject ? " — "+subject : ""}
            </div>
            )}

            {/* Chat */}
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, overflow:"hidden" }}>
              <div className="sen-chat-area" role="log" aria-label="Chat with Starky" aria-live="polite" style={{ height:isMobile?"calc(100vh - 280px)":"500px", minHeight:200, maxHeight:isMobile?400:600, overflowY:"auto", padding:isMobile?14:20, display:"flex", flexDirection:"column", gap:14, WebkitOverflowScrolling:"touch" }}>
                {messages.map((msg, i) => (
                  <div key={i}>
                    <div aria-label={msg.role==="assistant"?"Starky says":"You said"} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start", gap:10, animation:"fadeUp 0.3s ease" }}>
                      {msg.role==="assistant" && (
                        <div aria-hidden="true" style={{ width:32, height:32, borderRadius:"50%", background:accentColor+"20", border:"1px solid "+accentColor+"40", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0, marginTop:2 }}>💜</div>
                      )}
                      <div style={{ maxWidth:focusMode?"95%":"88%", padding:focusMode?"16px 20px":"13px 16px", borderRadius:16, background:msg.role==="user" ? (focusMode?"rgba(79,142,247,0.15)":"linear-gradient(135deg,"+accentColor+"CC,"+accentColor+"88)") : (focusMode?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.06)"), color:msg.role==="user" ? (focusMode?"#8BB8F7":"#060B20") : "rgba(255,255,255,0.93)", fontSize:focusMode?20:15, lineHeight:focusMode?1.8:1.85, fontWeight:msg.role==="user"?700:400, whiteSpace:"pre-wrap" }}>
                        {msg.content}
                      </div>
                    </div>
                    {!focusMode && (i + 1) >= 10 && (i + 1) % 10 === 0 && (
                      <div style={{ margin:"12px 0", padding:"14px 18px", background:"linear-gradient(135deg,"+accentColor+"12,rgba(255,255,255,0.03))", border:"1px solid "+accentColor+"30", borderRadius:16, textAlign:"center" }}>
                        <div style={{ fontSize:14, fontWeight:800, color:accentColor, marginBottom:8 }}>🌟 Session Check</div>
                        <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:10 }}>You've been learning for a while! What would you like to do?</div>
                        <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
                          <button onClick={()=>sendMessage("Let's keep going!")} style={{ background:accentColor+"22", border:"1px solid "+accentColor+"44", borderRadius:10, padding:"7px 16px", color:accentColor, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>Continue</button>
                          <button onClick={()=>{ setStep(1); setMessages([]); }} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"7px 16px", color:"rgba(255,255,255,0.6)", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>Take a Break</button>
                          <button onClick={async()=>{ try { const { shareLink } = await import('../utils/share'); const summary = messages.filter(m=>m.role==='assistant').slice(-1)[0]?.content?.slice(0,200)||''; await shareLink('drill',{name:condition?.name+' session',subject:subject||focus?.name||'SEN',pct:0,correct:messages.length,total:messages.length,weakAreas:[]},summary); alert('Session link copied!'); } catch{} }} style={{ background:"rgba(168,224,99,0.12)", border:"1px solid rgba(168,224,99,0.3)", borderRadius:10, padding:"7px 16px", color:"#A8E063", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>Share with Teacher</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:accentColor+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>💜</div>
                    <div style={{ display:"flex", gap:5 }}>
                      {[0,0.2,0.4].map((d,j) => <div key={j} style={{ width:9, height:9, borderRadius:"50%", background:accentColor, animation:`bounce 1s ${d}s ease-in-out infinite`, opacity:0.8 }}/>)}
                    </div>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.6)", fontStyle:"italic" }}>Starky is thinking...</span>
                  </div>
                )}
                <div ref={chatEndRef}/>
              </div>

              {/* Safe Space quick buttons — shown only at start of Safe Space session */}
              {safeSpace && messages.length <= 1 && !loading && (
                <div style={{ padding:"16px", display:"flex", gap:12, justifyContent:"center" }}>
                  <button onClick={() => sendMessage("I just want to talk.")}
                    style={{ ...S.btn, flex:1, maxWidth:200, background:"rgba(168,224,99,0.1)", border:"1px solid rgba(168,224,99,0.3)", borderRadius:14, padding:"16px", color:"#A8E063", fontSize:15, fontWeight:800 }}>
                    Just talk
                  </button>
                  <button onClick={() => sendMessage("Show me something interesting.")}
                    style={{ ...S.btn, flex:1, maxWidth:200, background:"rgba(99,210,255,0.1)", border:"1px solid rgba(99,210,255,0.3)", borderRadius:14, padding:"16px", color:"#63D2FF", fontSize:15, fontWeight:800 }}>
                    Something interesting
                  </button>
                </div>
              )}

              {/* Input */}
              <div style={{ padding:"12px 16px", borderTop:"1px solid "+accentColor+"15" }}>
                <textarea value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey&&isMobile) { e.preventDefault(); sendMessage(input); } if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)) sendMessage(input); }}
                  onFocus={e => { setTimeout(() => e.target.scrollIntoView({ behavior:'smooth', block:'nearest' }), 300); }}
                  aria-label={`Type your message to Starky about ${subject||focus?.name||"anything"}`}
                  placeholder={isMobile ? `Ask Starky anything... Enter to send` : `Ask Starky about ${subject||focus?.name||"anything"}... Ctrl+Enter to send`}
                  rows={isMobile?2:4}
                  style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid "+accentColor+"22", borderRadius:14, padding:"12px 14px", color:"#fff", fontSize:16, fontFamily:"'Nunito',sans-serif", resize:isMobile?"none":"vertical", lineHeight:1.7 }}/>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.55)" }}>
                    {isMobile ? 'Unlimited sessions · Enter to send' : 'Unlimited sessions for SEN students · Ctrl+Enter to send'}
                  </span>
                  <button aria-label="Send message" role="button" onClick={()=>sendMessage(input)} disabled={!input.trim()||loading||limitReached}
                    style={{ ...S.btn, background:input.trim()&&!loading ? "linear-gradient(135deg,"+accentColor+","+accentColor+"BB)" : "rgba(255,255,255,0.08)", borderRadius:14, padding:"12px 24px", color:input.trim()&&!loading?"#060B20":"rgba(255,255,255,0.3)", fontWeight:900, fontSize:14, minHeight:52 }}>
                    {loading?"Thinking...":"Send →"}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick prompts — hidden in focus mode */}
            {!focusMode && (
            <div className="sen-grid-quick" style={{ marginTop:12 }}>
              {[
                { e:"🔄", t:"Explain differently", p:`Explain that again in a completely different way — try a different approach, a different example, a different analogy.` },
                { e:"📋", t:"Step by step", p:`Break this down into the smallest possible steps. One thing at a time.` },
                { e:"✅", t:"Quick check", p:`Give me 3 quick questions to check understanding of what we just covered. Start simple.` },
                { e:"🌟", t:"Real life example", p:`Give me a real-life example of this that a ${stage?.ages} child with ${condition?.name} would find immediately relevant and interesting.` },
              ].map(q => (
                <button key={q.t} aria-label={q.t} role="button" onClick={() => sendMessage(q.p)}
                  style={{ ...S.btn, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"12px 10px", textAlign:"center", color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:700, minHeight:52 }}
                  onMouseEnter={e => { e.currentTarget.style.background=accentColor+"12"; e.currentTarget.style.color=accentColor; }}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="rgba(255,255,255,0.6)"; }}>
                  <div style={{ fontSize:18, marginBottom:4 }}>{q.e}</div>
                  {q.t}
                </button>
              ))}
            </div>
            )}

            {/* ── Quick Exercise Buttons — hidden in focus mode ─────── */}
            {!focusMode && <SENQuickExercises condition={condition} stage={stage} xpData={xpData} setXpData={setXpData} isUAE={isUAE} />}

            {/* Share session with teacher/therapist — hidden in focus mode */}
            {!focusMode && messages.length > 2 && (
              <button onClick={async () => {
                const { shareLink } = await import('../utils/share');
                const summary = messages.filter(m=>m.role==='assistant').slice(-1)[0]?.content?.slice(0,200) || '';
                const r = await shareLink('drill', { name: condition?.name + ' session', subject: subject || focus?.name || 'SEN', pct: 0, correct: messages.length, total: messages.length, weakAreas: [] },
                  `${condition?.name} learning session on NewWorldEdu — ${messages.length} messages. ${summary}`);
                if (r.method === 'clipboard') alert('Session link copied! Share with teacher or therapist.');
              }} style={{ ...S.btn, width:'100%', marginTop:12, background:'rgba(168,224,99,0.1)', border:'1px solid rgba(168,224,99,0.25)', borderRadius:14, padding:'12px', color:'#A8E063', fontWeight:700, fontSize:13 }}>
                📤 Share Session with Teacher / Therapist
              </button>
            )}
          </div>
        )}

        {/* CREATIVE LEARNING SECTION (visible on steps 1-3) */}
        {step < 4 && (
          <div style={{ marginTop:48, paddingTop:36, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:900, color:"rgba(255,255,255,0.6)", letterSpacing:2, marginBottom:8 }}>CREATIVE LEARNING</div>
              <div style={{ fontWeight:900, fontSize:isMobile?17:22, marginBottom:6 }}>Music, Reading & Arts — Built for Your Child</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)", lineHeight:1.8 }}>Specialist creative learning for every condition, every age.</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)", gap:12 }}>
              {[
                { href:`/music-for-all${condition?`?condition=${condition.id}`:''}`, emoji:"🎵", color:"#FFC300", name:"Music", desc:"Music therapy approaches for 7 SEN profiles. Rhythm, instruments, songwriting." },
                { href:`/reading-for-all${condition?`?condition=${condition.id}`:''}`, emoji:"📖", color:"#63D2FF", name:"Reading", desc:"Evidence-based reading for 7 profiles. Voice input. 120+ books. All ages." },
                { href:`/arts-for-all${condition?`?condition=${condition.id}`:''}`, emoji:"🎨", color:"#A8E063", name:"Arts", desc:"Adapted visual arts and creative expression. Every activity has an adaptive version." },
              ].map(s => (
                <a key={s.href} href={s.href} style={{ textDecoration:"none", background:s.color+"08", border:"1px solid "+s.color+"25", borderRadius:18, padding:16, display:"block", color:"#fff" }}
                  onMouseEnter={e=>{e.currentTarget.style.background=s.color+"15";e.currentTarget.style.borderColor=s.color+"50";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=s.color+"08";e.currentTarget.style.borderColor=s.color+"25";}}>
                  <div style={{ fontSize:28, marginBottom:6 }}>{s.emoji}</div>
                  <div style={{ fontWeight:900, fontSize:15, color:s.color, marginBottom:4 }}>{s.name}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", lineHeight:1.6 }}>{s.desc}</div>
                </a>
              ))}
            </div>
            <div style={{ background:"rgba(199,125,255,0.06)", border:"1px solid rgba(199,125,255,0.2)", borderRadius:14, padding:"14px 20px", marginTop:12, textAlign:"center" }}>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>All included in the </span>
              <span style={{ fontSize:12, fontWeight:800, color:"#C77DFF" }}>Special Needs Plan</span>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}> · </span>
              <a href="/pricing" style={{ fontSize:12, fontWeight:800, color:"#C77DFF", textDecoration:"none" }}>View Plans →</a>
            </div>

            {/* LANGUAGE & LITERACY — SEN-adapted */}
            <div style={{ marginTop:36, paddingTop:28, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ textAlign:"center", marginBottom:20 }}>
                <div style={{ fontSize:11, fontWeight:900, color:"rgba(255,255,255,0.6)", letterSpacing:2, marginBottom:8 }}>LANGUAGE & LITERACY</div>
                <div style={{ fontWeight:900, fontSize:isMobile?17:22, marginBottom:6 }}>Languages & Spelling — Adapted for Your Child</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)", lineHeight:1.8 }}>
                  {condition?.id === 'autism' ? 'Structured, predictable exercises with visual cues — ideal for autistic learners who thrive with routine and patterns.'
                  : condition?.id === 'adhd' ? 'Fast-paced games with hearts, XP, and celebrations — designed to hold attention and reward focus.'
                  : condition?.id === 'dyslexia' ? 'Audio-first mode means no reading needed. Hear every word spoken aloud. Spelling practice builds phonological awareness — the #1 intervention for dyslexia.'
                  : condition?.id === 'ds' ? 'Visual learning with big buttons, emojis, and celebrations. Whole-word recognition through picture spelling.'
                  : condition?.id === 'vi' ? 'Fully audio-based — every instruction spoken aloud. Pronunciation practice uses the microphone so your child speaks, not reads.'
                  : condition?.id === 'hi' ? 'Visual-first exercises with large text and colorful tiles. Spelling builds written language skills — critical for hearing impaired learners.'
                  : condition?.id === 'cp' ? 'Multiple response modes — tap, speak, or use switches. Large touch targets (52px+) for motor accessibility. Full curriculum at any pace.'
                  : condition?.id === 'unsure' ? 'Try different exercise types to discover what works best. Audio-first, visual, and interactive options — the platform adapts to your child.'
                  : 'Interactive exercises adapted for every need — audio-first, big buttons, visual cues, and celebrations.'}
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:12 }}>
                <a href="/languages" style={{ textDecoration:"none", background:"rgba(79,142,247,0.08)", border:"1px solid rgba(79,142,247,0.25)", borderRadius:18, padding:16, display:"block", color:"#fff" }}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(79,142,247,0.15)";e.currentTarget.style.borderColor="rgba(79,142,247,0.5)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(79,142,247,0.08)";e.currentTarget.style.borderColor="rgba(79,142,247,0.25)";}}>
                  <div style={{ fontSize:28, marginBottom:6 }}>🌍</div>
                  <div style={{ fontWeight:900, fontSize:15, color:"#4F8EF7", marginBottom:4 }}>Learn Languages</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", lineHeight:1.6, marginBottom:8 }}>
                    9 languages with audio-first mode — no reading needed. Pronunciation practice via microphone. Learn in Urdu, Sindhi, Punjabi, Pashto or English.
                  </div>
                  <div style={{ fontSize:10, fontWeight:800, color:"#4F8EF7", display:"flex", flexWrap:"wrap", gap:4 }}>
                    {['Audio-first', 'Hearts system', 'Pronunciation', 'Mother tongue'].map(t => (
                      <span key={t} style={{ background:"rgba(79,142,247,0.12)", border:"1px solid rgba(79,142,247,0.25)", borderRadius:20, padding:"2px 8px" }}>{t}</span>
                    ))}
                  </div>
                </a>
                <a href="/spelling-bee" style={{ textDecoration:"none", background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:18, padding:16, display:"block", color:"#fff" }}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(245,158,11,0.15)";e.currentTarget.style.borderColor="rgba(245,158,11,0.5)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(245,158,11,0.08)";e.currentTarget.style.borderColor="rgba(245,158,11,0.25)";}}>
                  <div style={{ fontSize:28, marginBottom:6 }}>🐝</div>
                  <div style={{ fontWeight:900, fontSize:15, color:"#F59E0B", marginBottom:4 }}>Spelling Bee</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", lineHeight:1.6, marginBottom:8 }}>
                    4 game modes — tap letters, unscramble, picture spell, speed round. 210 words across 7 grades. Every word spoken aloud.
                  </div>
                  <div style={{ fontSize:10, fontWeight:800, color:"#F59E0B", display:"flex", flexWrap:"wrap", gap:4 }}>
                    {['No typing needed', 'Audio TTS', 'XP & streaks', 'Big buttons'].map(t => (
                      <span key={t} style={{ background:"rgba(245,158,11,0.12)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:20, padding:"2px 8px" }}>{t}</span>
                    ))}
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* CREATIVE LEARNING SECTIONS — only on step 4 (steps 1-3 have their own above) */}
      {step === 4 && !focusMode && <div style={{marginTop:48,paddingTop:40,borderTop:"1px solid rgba(255,255,255,0.07)"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{display:"inline-block",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"4px 16px",fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.65)",letterSpacing:2,marginBottom:12}}>CREATIVE LEARNING</div>
          <h2 style={{fontSize:isMobile?20:28,fontWeight:900,margin:"0 0 8px",color:"#fff"}}>Music, Reading <span style={{color:"#C77DFF"}}>&</span> Arts</h2>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.7)",maxWidth:560,margin:"0 auto",lineHeight:1.8}}>Specialist creative learning built for children with autism, ADHD, dyslexia, Down syndrome, cerebral palsy, visual impairment, and complex communication needs.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)",gap:14}}>
          {[
            {href:`/music-for-all${condition?`?condition=${condition.id}`:''}`,emoji:"🎵",color:"#FFC300",name:"Music",tag:"Every child is musical",desc:"Music therapy approaches for 7 special needs profiles. Rhythm, instruments, songwriting and listening activities — each adapted to the child."},
            {href:`/reading-for-all${condition?`?condition=${condition.id}`:''}`,emoji:"📖",color:"#63D2FF",name:"Reading",tag:"Every child deserves a reading life",desc:"Evidence-based reading support across 7 profiles. Voice input so children can speak to Starky. 120+ books with specialist teaching modes."},
            {href:`/arts-for-all${condition?`?condition=${condition.id}`:''}`,emoji:"🎨",color:"#A8E063",name:"Arts",tag:"Every child has something to express",desc:"Adapted visual arts and creative expression. Low-tech and high-tech options. Every activity has an adaptive version for every need."},
          ].map(function(s){return(
            <a key={s.href} href={s.href} style={{textDecoration:"none",display:"block",background:s.color+"0A",border:"2px solid "+s.color+"30",borderRadius:20,padding:20,color:"#fff",transition:"all 0.15s"}}
              onMouseEnter={function(e){e.currentTarget.style.background=s.color+"18";e.currentTarget.style.borderColor=s.color;e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={function(e){e.currentTarget.style.background=s.color+"0A";e.currentTarget.style.borderColor=s.color+"30";e.currentTarget.style.transform="none";}}>
              <div style={{fontSize:36,marginBottom:10}}>{s.emoji}</div>
              <div style={{fontWeight:900,fontSize:18,color:s.color,marginBottom:4}}>{s.name}</div>
              <div style={{fontSize:12,fontStyle:"italic",color:s.color+"BB",marginBottom:10}}>{s.tag}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.7,marginBottom:14}}>{s.desc}</div>
              <div style={{background:s.color,borderRadius:10,padding:"9px 14px",textAlign:"center",fontWeight:900,fontSize:13,color:"#060B20"}}>Open {s.name} →</div>
            </a>
          );})}
        </div>
        <div style={{background:"rgba(199,125,255,0.06)",border:"1px solid rgba(199,125,255,0.2)",borderRadius:16,padding:"20px 28px",marginTop:16,textAlign:"center"}}>
          <div style={{fontWeight:800,fontSize:14,color:"rgba(255,255,255,0.8)",marginBottom:6}}>All included in the Special Needs Plan — $149.99/year</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.8,marginBottom:12}}>Full access to Music, Reading, and Arts — all 7 specialist profiles, 120+ books, evidence-based teaching, and parent guides.</div>
          <a href="/pricing" style={{display:"inline-block",background:"linear-gradient(135deg,#C77DFF,#7B5EA7)",borderRadius:12,padding:"10px 24px",color:"#fff",fontWeight:900,fontSize:13,textDecoration:"none"}}>View Plans</a>
        </div>
      </div>}

      {/* ── SEN Practice Zone ───────────────────────── */}
      <div style={{maxWidth:600,margin:"0 auto 40px",padding:"0 16px"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{display:"inline-block",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"4px 16px",fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.65)",letterSpacing:2,marginBottom:12}}>PRACTICE ZONE</div>
          <h2 style={{fontFamily:"'Nunito',sans-serif",fontSize:"clamp(22px,5vw,30px)",fontWeight:900,margin:"0 0 10px"}}>
            ✨ Practice at Your Pace
          </h2>
          <p style={{fontSize:14,color:"rgba(255,255,255,0.5)",lineHeight:1.7,maxWidth:420,margin:"0 auto"}}>
            No timer. No pressure. Starky celebrates every answer — right or wrong. Just learning, one step at a time.
          </p>
        </div>

        {condition ? (
          <SENDrillWidget condition={condition} stage={stage} subject={subject} xpData={xpData} setXpData={setXpData} />
        ) : (
          <div style={{background:"rgba(167,139,250,0.06)",border:"2px dashed rgba(167,139,250,0.2)",borderRadius:20,padding:"28px 24px",textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:12}}>💜</div>
            <div style={{fontWeight:800,fontSize:16,marginBottom:8,fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.8)"}}>Select your child's condition above</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.7}}>Once you tell Starky about your child, the Practice Zone will open — adapted specially for them.</div>
          </div>
        )}
      </div>

      <LegalFooter sen={true} />
    </div>
  );
}
