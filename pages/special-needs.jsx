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
import { addKnowledgeToPrompt } from "../utils/senKnowledge";

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
    ],
    fill: [
      { sentence: "The cat says ___.", options: ["meow", "woof", "moo", "quack"], answer: "meow" },
      { sentence: "The sky is ___.", options: ["blue", "green", "red", "purple"], answer: "blue" },
      { sentence: "We eat with our ___.", options: ["mouth", "ears", "feet", "eyes"], answer: "mouth" },
    ],
    truefalse: [
      { statement: "Fish can fly in the sky.", answer: false },
      { statement: "We sleep at night.", answer: true },
      { statement: "Ice cream is hot.", answer: false },
    ],
    picture: [
      { scene: "Imagine you are at the park. You see a big red slide and a swing. What would you play on first?", prompt: "Tell me what you would do at the park!" },
      { scene: "You walk into a room and see a birthday cake with candles. What happens next?", prompt: "What do you do when you see the cake?" },
      { scene: "A friendly puppy comes up to you wagging its tail. How does the puppy feel?", prompt: "How is the puppy feeling?" },
    ],
  },
  autism_primary: {
    match: [
      { pairs: [["Synonym", "Same meaning"], ["Antonym", "Opposite meaning"], ["Noun", "Person, place, thing"], ["Verb", "Action word"]] },
      { pairs: [["Addition +", "Putting together"], ["Subtraction -", "Taking away"], ["Multiply x", "Groups of"], ["Divide /", "Sharing equally"]] },
      { pairs: [["Solid", "Keeps its shape"], ["Liquid", "Takes shape of container"], ["Gas", "Fills all space"], ["Melting", "Solid becomes liquid"]] },
    ],
    fill: [
      { sentence: "5 + 3 = ___.", options: ["7", "8", "9", "6"], answer: "8" },
      { sentence: "A group of fish is called a ___.", options: ["school", "pack", "flock", "herd"], answer: "school" },
      { sentence: "Water freezes at ___ degrees Celsius.", options: ["0", "10", "50", "100"], answer: "0" },
    ],
    truefalse: [
      { statement: "The Earth goes around the Sun.", answer: true },
      { statement: "Spiders have 6 legs.", answer: false },
      { statement: "There are 7 days in a week.", answer: true },
    ],
    picture: [
      { scene: "You are a scientist looking at a plant. It has droopy leaves and dry soil. What does it need?", prompt: "What would you give the plant?" },
      { scene: "You are in a shop and want to buy something that costs 50p. You have a pound coin. How much change?", prompt: "Work out the change!" },
      { scene: "Your friend looks sad at break time and is sitting alone. What could you do?", prompt: "How would you help your friend?" },
    ],
  },
  // ── ADHD ──
  adhd_early: {
    match: [
      { pairs: [["1 🥇", "One"], ["2 🥈", "Two"], ["3 🥉", "Three"], ["4 🏅", "Four"]] },
      { pairs: [["Circle ⭕", "Round shape"], ["Square ⬜", "Four equal sides"], ["Triangle 🔺", "Three sides"], ["Star ⭐", "Five points"]] },
      { pairs: [["Morning 🌅", "Wake up time"], ["Afternoon ☀️", "Lunch time"], ["Evening 🌇", "Dinner time"], ["Night 🌙", "Sleep time"]] },
    ],
    fill: [
      { sentence: "After 2 comes ___.", options: ["1", "3", "4", "5"], answer: "3" },
      { sentence: "A triangle has ___ sides.", options: ["2", "3", "4", "5"], answer: "3" },
      { sentence: "We brush our teeth in the ___.", options: ["morning", "school", "park", "car"], answer: "morning" },
    ],
    truefalse: [
      { statement: "A banana is yellow.", answer: true },
      { statement: "Dogs can talk like people.", answer: false },
      { statement: "The moon comes out at night.", answer: true },
    ],
    picture: [
      { scene: "You have 3 toy cars: red, blue, green. Your friend wants to play. How many cars can you share?", prompt: "How would you share?" },
      { scene: "Imagine you are a superhero! What is your superpower?", prompt: "Tell me about your superpower!" },
      { scene: "You find a big puddle after the rain. What would you do?", prompt: "What happens with the puddle?" },
    ],
  },
  adhd_primary: {
    match: [
      { pairs: [["Simile", "Like or as"], ["Metaphor", "Is something else"], ["Alliteration", "Same starting sound"], ["Rhyme", "Sounds the same"]] },
      { pairs: [["Heart ❤️", "Pumps blood"], ["Lungs 🫁", "Help us breathe"], ["Brain 🧠", "Controls thinking"], ["Stomach", "Digests food"]] },
      { pairs: [["x2", "Double it"], ["x5", "Ends in 0 or 5"], ["x10", "Add a zero"], ["x3", "Count in threes"]] },
    ],
    fill: [
      { sentence: "The opposite of hot is ___.", options: ["warm", "cold", "wet", "dry"], answer: "cold" },
      { sentence: "7 x 5 = ___.", options: ["30", "35", "40", "25"], answer: "35" },
      { sentence: "Plants need ___ to grow.", options: ["darkness", "sunlight", "ice", "noise"], answer: "sunlight" },
    ],
    truefalse: [
      { statement: "Whales are fish.", answer: false },
      { statement: "12 x 2 = 24.", answer: true },
      { statement: "The capital of Pakistan is Lahore.", answer: false },
    ],
    picture: [
      { scene: "You are a detective! There are muddy footprints leading to the kitchen. What happened?", prompt: "Solve the mystery!" },
      { scene: "You have 20 minutes of free time. You can read, draw, or play outside. Quick — pick one!", prompt: "What do you choose and why?" },
      { scene: "Your team needs a name for a science project about space. Think of the coolest name!", prompt: "What is your team name?" },
    ],
  },
  // ── DYSLEXIA ──
  dyslexia_early: {
    match: [
      { pairs: [["A 🍎", "Apple sound"], ["B 🐝", "Bee sound"], ["C 🐱", "Cat sound"], ["D 🐶", "Dog sound"]] },
      { pairs: [["bat 🦇", "Rhymes with cat"], ["dog 🐕", "Rhymes with log"], ["sun ☀️", "Rhymes with fun"], ["top 🔝", "Rhymes with hop"]] },
      { pairs: [["Big 🐘", "Not small"], ["Hot 🔥", "Not cold"], ["Up ⬆️", "Not down"], ["Fast 🏃", "Not slow"]] },
    ],
    fill: [
      { sentence: "Cat rhymes with ___.", options: ["dog", "hat", "sun", "cup"], answer: "hat" },
      { sentence: "___ is the first letter of Ball.", options: ["A", "B", "C", "D"], answer: "B" },
      { sentence: "The colour of grass is ___.", options: ["red", "blue", "green", "white"], answer: "green" },
    ],
    truefalse: [
      { statement: "Cat and hat rhyme.", answer: true },
      { statement: "The word 'dog' starts with B.", answer: false },
      { statement: "Sun and fun sound alike at the end.", answer: true },
    ],
    picture: [
      { scene: "Close your eyes and listen: someone is clapping a rhythm — clap, clap, pause, clap. Can you copy it?", prompt: "Clap along!" },
      { scene: "Imagine the letter S is a snake. It goes ssssss. What other things make an S sound?", prompt: "What makes an S sound?" },
      { scene: "You see a shop sign but cannot read it. There is a picture of bread on it. What kind of shop is it?", prompt: "What shop is this?" },
    ],
  },
  dyslexia_primary: {
    match: [
      { pairs: [["Prefix", "Goes at the start"], ["Suffix", "Goes at the end"], ["Root word", "The main part"], ["Syllable", "A beat in a word"]] },
      { pairs: [["Their", "Belonging to them"], ["There", "A place"], ["They're", "They are"], ["Then", "After that"]] },
      { pairs: [["Full stop .", "End of sentence"], ["Question mark ?", "Asking something"], ["Comma ,", "Short pause"], ["Exclamation !", "Surprise or shout"]] },
    ],
    fill: [
      { sentence: "The children went to ___ school.", options: ["there", "their", "they're", "thier"], answer: "their" },
      { sentence: "Un-happy. The prefix 'un' means ___.", options: ["not", "very", "more", "again"], answer: "not" },
      { sentence: "'Beautiful' has ___ syllables.", options: ["2", "3", "4", "5"], answer: "3" },
    ],
    truefalse: [
      { statement: "'Knight' and 'night' sound the same.", answer: true },
      { statement: "Every sentence needs a full stop or question mark.", answer: true },
      { statement: "'There' means belonging to someone.", answer: false },
    ],
    picture: [
      { scene: "You are writing a story about a dragon. The dragon is friendly! What does your dragon look like?", prompt: "Describe your dragon out loud!" },
      { scene: "Look at this word pattern: c-a-t, b-a-t, h-a-t. What letter is changing each time?", prompt: "Which letter changes?" },
      { scene: "Your friend sends you a message: 'Lets meet at the park.' Can you spot what is missing?", prompt: "What is missing from the message?" },
    ],
  },
  // ── DOWN SYNDROME ──
  ds_early: {
    match: [
      { pairs: [["Apple 🍎", "A fruit"], ["Car 🚗", "Goes on road"], ["Ball ⚽", "You kick it"], ["Book 📖", "You read it"]] },
      { pairs: [["Big 🐘", "Elephant"], ["Small 🐭", "Mouse"], ["Tall 🦒", "Giraffe"], ["Fast 🐆", "Cheetah"]] },
      { pairs: [["Eyes 👀", "We see"], ["Ears 👂", "We hear"], ["Nose 👃", "We smell"], ["Mouth 👄", "We taste"]] },
    ],
    fill: [
      { sentence: "We see with our ___.", options: ["ears", "eyes", "nose", "mouth"], answer: "eyes" },
      { sentence: "An apple is a ___.", options: ["fruit", "vegetable", "drink", "toy"], answer: "fruit" },
      { sentence: "We sleep in a ___.", options: ["bed", "car", "kitchen", "garden"], answer: "bed" },
    ],
    truefalse: [
      { statement: "Birds can fly.", answer: true },
      { statement: "We eat soup with a fork.", answer: false },
      { statement: "The sun is hot.", answer: true },
    ],
    picture: [
      { scene: "Look! A fluffy white cloud in the sky. What shape does it look like to you?", prompt: "What do you see in the cloud?" },
      { scene: "You hear music playing. It makes you want to dance! Show me your favourite dance move!", prompt: "Dance time!" },
      { scene: "Mummy gives you two biscuits. You eat one. How many are left?", prompt: "How many biscuits now?" },
    ],
  },
  ds_primary: {
    match: [
      { pairs: [["Coin 🪙", "Money"], ["Clock 🕐", "Tells time"], ["Map 🗺️", "Shows places"], ["Ruler 📏", "Measures length"]] },
      { pairs: [["Spring 🌸", "Flowers bloom"], ["Summer ☀️", "Very hot"], ["Autumn 🍂", "Leaves fall"], ["Winter ❄️", "Very cold"]] },
      { pairs: [["10p", "Ten pence"], ["50p", "Fifty pence"], ["£1", "One pound"], ["£5", "Five pounds"]] },
    ],
    fill: [
      { sentence: "There are ___ months in a year.", options: ["10", "11", "12", "13"], answer: "12" },
      { sentence: "After Tuesday comes ___.", options: ["Monday", "Wednesday", "Thursday", "Friday"], answer: "Wednesday" },
      { sentence: "10 + 5 = ___.", options: ["14", "15", "16", "20"], answer: "15" },
    ],
    truefalse: [
      { statement: "There are 7 days in a week.", answer: true },
      { statement: "January comes after February.", answer: false },
      { statement: "A square has 4 sides.", answer: true },
    ],
    picture: [
      { scene: "You go to the shop with £1. A drink costs 50p. Can you buy it? How much is left?", prompt: "Work out the money!" },
      { scene: "It is raining outside. What clothes do you need to wear?", prompt: "What do you put on?" },
      { scene: "You are helping to set the table for 4 people. How many plates, forks and cups do you need?", prompt: "Count what you need!" },
    ],
  },
  // ── CEREBRAL PALSY ──
  cp_early: {
    match: [
      { pairs: [["Red 🔴", "Strawberry"], ["Yellow 🟡", "Banana"], ["Orange 🟠", "Orange"], ["Green 🟢", "Apple"]] },
      { pairs: [["Hot ☕", "Tea"], ["Cold 🧊", "Ice cream"], ["Soft 🧸", "Teddy"], ["Hard 🪨", "Rock"]] },
      { pairs: [["Clap 👏", "Hands together"], ["Wave 👋", "Say hello"], ["Point 👉", "Show something"], ["Nod", "Say yes"]] },
    ],
    fill: [
      { sentence: "A strawberry is ___.", options: ["red", "blue", "green", "purple"], answer: "red" },
      { sentence: "Ice cream is ___.", options: ["hot", "cold", "hard", "loud"], answer: "cold" },
      { sentence: "We nod our head to say ___.", options: ["yes", "no", "maybe", "hello"], answer: "yes" },
    ],
    truefalse: [
      { statement: "Ice is cold.", answer: true },
      { statement: "Rocks are soft.", answer: false },
      { statement: "We wave to say hello.", answer: true },
    ],
    picture: [
      { scene: "You are at the beach. You feel sand between your toes and hear waves. What else can you see?", prompt: "Describe the beach!" },
      { scene: "Your favourite song is playing. How does the music make you feel?", prompt: "Tell me about the music!" },
      { scene: "A butterfly lands on a flower near you. What colours is it?", prompt: "Describe the butterfly!" },
    ],
  },
  cp_primary: {
    match: [
      { pairs: [["Gravity", "Pulls things down"], ["Friction", "Slows things down"], ["Magnet", "Attracts metal"], ["Force", "Push or pull"]] },
      { pairs: [["Noun", "Naming word"], ["Adjective", "Describing word"], ["Verb", "Doing word"], ["Adverb", "How something is done"]] },
      { pairs: [["Perimeter", "Around the edge"], ["Area", "Inside the shape"], ["Volume", "Space inside"], ["Angle", "Where lines meet"]] },
    ],
    fill: [
      { sentence: "Gravity pulls things ___.", options: ["up", "down", "sideways", "forward"], answer: "down" },
      { sentence: "An adjective is a ___ word.", options: ["doing", "describing", "naming", "joining"], answer: "describing" },
      { sentence: "The perimeter is the distance ___ a shape.", options: ["around", "inside", "through", "above"], answer: "around" },
    ],
    truefalse: [
      { statement: "Magnets attract all objects.", answer: false },
      { statement: "A verb is a doing word.", answer: true },
      { statement: "The area of a shape is measured around the outside.", answer: false },
    ],
    picture: [
      { scene: "Drop a ball and a feather at the same time. Which hits the ground first? Why?", prompt: "What do you think happens?" },
      { scene: "You are designing a bedroom. It is 3 metres by 4 metres. What is the area?", prompt: "Calculate the area!" },
      { scene: "Write a sentence about your favourite animal using at least one adjective.", prompt: "Describe your animal!" },
    ],
  },
  // ── VISUAL IMPAIRMENT ──
  vi_early: {
    match: [
      { pairs: [["Bell 🔔", "Ding ding"], ["Drum 🥁", "Boom boom"], ["Whistle", "Wheee"], ["Clap 👏", "Slap slap"]] },
      { pairs: [["Soft 🧸", "Teddy bear"], ["Rough", "Sandpaper"], ["Smooth", "Glass"], ["Bumpy", "Gravel path"]] },
      { pairs: [["Sweet 🍬", "Candy"], ["Sour 🍋", "Lemon"], ["Salty 🧂", "Crisps"], ["Bitter", "Dark chocolate"]] },
    ],
    fill: [
      { sentence: "A bell goes ___.", options: ["ding", "boom", "splash", "pop"], answer: "ding" },
      { sentence: "Lemons taste ___.", options: ["sweet", "sour", "salty", "spicy"], answer: "sour" },
      { sentence: "A teddy bear feels ___.", options: ["rough", "soft", "hard", "cold"], answer: "soft" },
    ],
    truefalse: [
      { statement: "Drums make a loud sound.", answer: true },
      { statement: "Sugar tastes sour.", answer: false },
      { statement: "Sandpaper feels smooth.", answer: false },
    ],
    picture: [
      { scene: "Close your eyes. Someone puts something cold and round in your hand. It smells sweet. What is it?", prompt: "Guess the fruit!" },
      { scene: "Listen: you hear birds singing, leaves rustling, and children laughing. Where are you?", prompt: "Describe the place!" },
      { scene: "You touch something fluffy that purrs. What animal is it?", prompt: "What is the animal?" },
    ],
  },
  vi_primary: {
    match: [
      { pairs: [["Orbit", "Path around something"], ["Rotation", "Spinning on axis"], ["Eclipse", "Sun or Moon blocked"], ["Crater", "Hole on Moon"]] },
      { pairs: [["Simile", "Uses like or as"], ["Onomatopoeia", "Sound words"], ["Personification", "Human qualities"], ["Alliteration", "Same start sound"]] },
      { pairs: [["Half 1/2", "Two equal parts"], ["Quarter 1/4", "Four equal parts"], ["Third 1/3", "Three equal parts"], ["Whole", "All of it"]] },
    ],
    fill: [
      { sentence: "The Earth takes ___ days to orbit the Sun.", options: ["100", "365", "200", "400"], answer: "365" },
      { sentence: "'Buzz' and 'crash' are examples of ___.", options: ["simile", "onomatopoeia", "metaphor", "rhyme"], answer: "onomatopoeia" },
      { sentence: "Half of 20 is ___.", options: ["5", "8", "10", "15"], answer: "10" },
    ],
    truefalse: [
      { statement: "The Earth rotates once every 24 hours.", answer: true },
      { statement: "A simile uses the word 'is' to compare.", answer: false },
      { statement: "A quarter of 100 is 25.", answer: true },
    ],
    picture: [
      { scene: "Imagine you are floating in space. You look down and see Earth below. Describe what you hear — or do you hear anything?", prompt: "What is space like?" },
      { scene: "You are listening to an audiobook about a magical forest. Describe the sounds you imagine in the forest.", prompt: "What sounds are there?" },
      { scene: "Someone reads you a riddle: 'I have hands but cannot clap.' What am I?", prompt: "Solve the riddle!" },
    ],
  },
  // ── HEARING IMPAIRMENT ──
  hi_early: {
    match: [
      { pairs: [["Happy 😊", "Smiling face"], ["Sad 😢", "Crying face"], ["Surprised 😮", "Open mouth"], ["Angry 😠", "Frowning face"]] },
      { pairs: [["Stop 🛑", "Red sign"], ["Go ✅", "Green light"], ["Slow ⚠️", "Yellow light"], ["Walk 🚶", "Person shape"]] },
      { pairs: [["Cup 🥤", "For drinking"], ["Plate 🍽️", "For eating"], ["Spoon 🥄", "For scooping"], ["Knife 🔪", "For cutting"]] },
    ],
    fill: [
      { sentence: "A red light means ___.", options: ["go", "stop", "walk", "run"], answer: "stop" },
      { sentence: "😊 This face is ___.", options: ["sad", "happy", "angry", "scared"], answer: "happy" },
      { sentence: "We drink from a ___.", options: ["plate", "cup", "spoon", "fork"], answer: "cup" },
    ],
    truefalse: [
      { statement: "A green traffic light means go.", answer: true },
      { statement: "😢 This face means happy.", answer: false },
      { statement: "We use a spoon to eat soup.", answer: true },
    ],
    picture: [
      { scene: "Look at someone talking to you. Their mouth is making a big O shape. What sound are they making?", prompt: "What sound is that?" },
      { scene: "You see a person waving their arms and jumping up and down. How are they feeling?", prompt: "What emotion is this?" },
      { scene: "There is a sign with a picture of food on it. What kind of place is this?", prompt: "What place has this sign?" },
    ],
  },
  hi_primary: {
    match: [
      { pairs: [["Evaporation", "Liquid to gas"], ["Condensation", "Gas to liquid"], ["Precipitation", "Rain or snow"], ["Collection", "Water gathers"]] },
      { pairs: [["Paragraph", "Group of sentences"], ["Sentence", "Starts with capital"], ["Clause", "Has a verb"], ["Phrase", "Group of words"]] },
      { pairs: [["Fraction", "Part of whole"], ["Decimal", "Uses a dot"], ["Percentage", "Out of 100"], ["Ratio", "Comparing amounts"]] },
    ],
    fill: [
      { sentence: "When water boils, it turns to ___.", options: ["ice", "steam", "juice", "oil"], answer: "steam" },
      { sentence: "Every sentence starts with a ___ letter.", options: ["small", "capital", "number", "symbol"], answer: "capital" },
      { sentence: "50% means ___ out of 100.", options: ["25", "50", "75", "100"], answer: "50" },
    ],
    truefalse: [
      { statement: "Rain is a form of precipitation.", answer: true },
      { statement: "A paragraph is a single sentence.", answer: false },
      { statement: "0.5 is the same as 1/2.", answer: true },
    ],
    picture: [
      { scene: "Draw the water cycle: sun heats water, it rises as steam, forms clouds, then falls as rain. Can you explain each step?", prompt: "Explain the water cycle!" },
      { scene: "You see a pie chart showing how students travel to school: half by car, quarter by bus, quarter by walking.", prompt: "What does the chart show?" },
      { scene: "Your friend writes: 'i went too the park and played with there dog.' Find 3 mistakes!", prompt: "Spot the errors!" },
    ],
  },
  // ── UNSURE / UNDIAGNOSED ──
  unsure_early: {
    match: [
      { pairs: [["Happy 😊", "Good feeling"], ["Sad 😢", "Bad feeling"], ["Tired 😴", "Need sleep"], ["Hungry 🍽️", "Need food"]] },
      { pairs: [["Red 🔴", "Stop colour"], ["Green 🟢", "Go colour"], ["Blue 🔵", "Water colour"], ["Yellow 🟡", "Sun colour"]] },
      { pairs: [["1", "One finger"], ["2", "Two fingers"], ["3", "Three fingers"], ["4", "Four fingers"]] },
    ],
    fill: [
      { sentence: "When you are tired, you need to ___.", options: ["eat", "sleep", "run", "shout"], answer: "sleep" },
      { sentence: "One plus one is ___.", options: ["1", "2", "3", "4"], answer: "2" },
      { sentence: "Grass is the colour ___.", options: ["red", "blue", "green", "yellow"], answer: "green" },
    ],
    truefalse: [
      { statement: "We need food when we are hungry.", answer: true },
      { statement: "3 comes before 2.", answer: false },
      { statement: "The sky is often blue.", answer: true },
    ],
    picture: [
      { scene: "It is a rainy day. What games can you play inside?", prompt: "What would you play?" },
      { scene: "You have crayons and paper. Draw your family! Who is in the picture?", prompt: "Tell me about your family!" },
      { scene: "You see a rainbow after the rain. How many colours can you name?", prompt: "Name the colours!" },
    ],
  },
  unsure_primary: {
    match: [
      { pairs: [["Continent", "Large land mass"], ["Country", "Has its own flag"], ["City", "Where many people live"], ["Village", "Small community"]] },
      { pairs: [["Past tense", "Already happened"], ["Present tense", "Happening now"], ["Future tense", "Will happen"], ["Verb", "Action word"]] },
      { pairs: [["Even number", "Divisible by 2"], ["Odd number", "Not divisible by 2"], ["Prime number", "Only 1 and itself"], ["Multiple", "Times table answer"]] },
    ],
    fill: [
      { sentence: "Pakistan is in the continent of ___.", options: ["Africa", "Asia", "Europe", "America"], answer: "Asia" },
      { sentence: "'She walked to school' is in the ___ tense.", options: ["past", "present", "future", "none"], answer: "past" },
      { sentence: "The first prime number is ___.", options: ["1", "2", "3", "4"], answer: "2" },
    ],
    truefalse: [
      { statement: "Asia is the largest continent.", answer: true },
      { statement: "9 is an even number.", answer: false },
      { statement: "'Running' is a verb.", answer: true },
    ],
    picture: [
      { scene: "You are planning a trip to another city. What 3 things would you pack?", prompt: "What do you pack?" },
      { scene: "Look at a clock showing 3:30. The short hand points to 3 and the long hand points to 6. What time will it be in one hour?", prompt: "What time is it?" },
      { scene: "Write a sentence about something that happened yesterday, something happening today, and something you will do tomorrow.", prompt: "Use three tenses!" },
    ],
  },
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
function buildPrompt(condition, stage, focus, subject, urduMode = false) {
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

    unsure: `UNDIAGNOSED / UNSURE CONDITION ADAPTATIONS:
- The child has NOT been formally diagnosed — treat this as a discovery session
- Ask the parent/student to describe the specific challenges they face before teaching
- Listen for clues: reading difficulty → dyslexia; hyperactivity/inattention → ADHD; social/communication differences → ASD
- Adapt your response style based on what you hear — do NOT assume
- Explicitly validate the parent: "Many Pakistani children go undiagnosed for years — you've done the right thing by seeking support"
- Suggest that a formal assessment would help, but emphasise that Starky can help RIGHT NOW without one
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

  const pakistanContext = `
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

${pakistanContext}`);
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

  const CELEBRATIONS = [
    "🌟 Amazing try!", "⭐ You're doing great!", "🎉 Brilliant effort!",
    "🌈 Keep going, you've got this!", "💪 That was wonderful!",
    "🦋 You're a star!", "🎊 Fantastic attempt!", "🌺 So proud of you!",
  ];

  const senSubjects = subject
    ? [subject]
    : ['Maths','English','Science','Reading','Social Skills','Life Skills'];

  const [chosenSubject, setChosenSubject] = useState('');

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
          <div style={{fontSize:12,color:"rgba(255,255,255,0.35)"}}>Question {questionCount}</div>
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
                  <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",letterSpacing:"0.06em",marginBottom:6}}>THE ANSWER WAS</div>
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
            style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"14px",color:"rgba(255,255,255,0.4)",fontSize:14,fontFamily:"'Nunito',sans-serif",cursor:"pointer",marginTop:8,minHeight:52}}>
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
function SENQuickExercises({ condition, stage, xpData, setXpData }) {
  const [activeExType, setActiveExType] = useState(null); // 'match', 'fill', 'truefalse', 'picture'
  const [exIndex, setExIndex] = useState(0);
  const [exState, setExState] = useState(null); // exercise-specific state
  const [exFeedback, setExFeedback] = useState(null);
  const [showExConfetti, setShowExConfetti] = useState(false);
  const [showExXP, setShowExXP] = useState(false);
  const [pictureResponse, setPictureResponse] = useState('');

  const exKey = condition && stage ? `${condition.id}_${stage.id}` : null;
  const exercises = exKey ? SEN_EXERCISES[exKey] : null;

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
          <div style={{ fontSize:12, fontWeight:900, color:"rgba(255,255,255,0.3)", letterSpacing:2, textAlign:"center", marginBottom:12, marginTop:8 }}>QUICK EXERCISES</div>
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
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);
  useEffect(() => { setProgress(loadP()); }, []);
  useEffect(() => { setXpData(loadXP()); }, []);

  const accentColor = condition?.color || "#C77DFF";

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
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
          model:"claude-haiku-4-5-20251001",
          max_tokens:1500,
          system:buildPrompt(condition, stage, focus, subject, urduMode),
          messages:prev.map(m => ({ role:m.role, content:m.content })),
        }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role:"assistant", content:data.content?.[0]?.text || "Something went wrong — please try again." }]);
    } catch {
      setMessages(p => [...p, { role:"assistant", content:"Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  const reset = () => { setStep(1); setCondition(null); setStage(null); setFocus(null); setSubject(""); setMessages([]); };

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
    <div style={S.page}><style>{CSS}</style>
      <Head>
        <title>Special Needs Support — NewWorldEdu</title>
        <meta name="description" content="AI tutoring adapted for autism, ADHD, dyslexia, and Down syndrome. 140 teaching profiles with evidence-based strategies for Pakistani students." />
        <meta property="og:title" content="Special Needs Support — Adapted AI Tutoring" />
        <meta property="og:description" content="AI tutoring adapted for autism, ADHD, dyslexia, and Down syndrome. 140 teaching profiles with evidence-based strategies for Pakistani students." />
      </Head>

      {/* HEADER */}
      <header style={S.hdr}>
        <a href="/" style={{ textDecoration:"none", fontWeight:900, fontSize:isMobile?13:15, color:"#fff" }}>
          NewWorldEdu<span style={{ color:"#4F8EF7" }}>★</span>
        </a>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {/* XP Badge */}
          <div aria-label={`${xpData.xp} experience points, ${xpData.streak} day streak`} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(168,224,99,0.1)", border:"1px solid rgba(168,224,99,0.3)", borderRadius:20, padding:"4px 12px" }}>
            <span style={{ fontSize:14 }}>⭐</span>
            <span style={{ fontWeight:900, fontSize:12, color:"#A8E063" }}>{xpData.xp} XP</span>
            {xpData.streak > 0 && (
              <span style={{ fontWeight:700, fontSize:11, color:"#FFC300", marginLeft:2 }}>🔥 {xpData.streak}d</span>
            )}
          </div>
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
          <a href="/pricing" style={{ background:"linear-gradient(135deg,#4F8EF7,#7B5EA7)", borderRadius:12, padding:"7px 16px", color:"#fff", fontWeight:900, fontSize:12, textDecoration:"none", minHeight:52, display:"flex", alignItems:"center" }}>Plans</a>
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

            <StepBar/>

            {/* ── PAKISTAN SEN AWARENESS PANEL ── */}
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
                        <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", lineHeight:1.6 }}>{item.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize:12, fontWeight:900, color:"rgba(255,255,255,0.3)", letterSpacing:2, textAlign:"center", marginBottom:16 }}>STEP 1 — SELECT CONDITION</div>

            <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:12, marginBottom:16 }}>
              {CONDITIONS.map(c => (
                <button key={c.id} aria-label={`Select condition: ${c.name}`} role="button" onClick={() => { sndTick(); setCondition(c); setStep(2); }}
                  style={{ ...S.btn, background:c.color+"0A", border:"2px solid "+c.color+"30", borderRadius:18, padding:"18px 12px", textAlign:"center", color:"#fff", minHeight:52 }}
                  onMouseEnter={e => { e.currentTarget.style.background=c.color+"20"; e.currentTarget.style.borderColor=c.color; e.currentTarget.style.transform="translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=c.color+"0A"; e.currentTarget.style.borderColor=c.color+"30"; e.currentTarget.style.transform="none"; }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>{c.emoji}</div>
                  <div style={{ fontWeight:900, fontSize:13, color:c.color, lineHeight:1.3 }}>{c.name}</div>
                  <div style={{ fontSize:10, color:c.color+"88", marginTop:3, direction:"rtl" }}>{c.urdu}</div>
                  {progress[`${c.id}_early`] || progress[`${c.id}_primary`] || progress[`${c.id}_secondary`] || progress[`${c.id}_sixthform`] ? (
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginTop:4 }}>Previously used</div>
                  ) : null}
                </button>
              ))}
            </div>

            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"16px 20px", textAlign:"center" }}>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.8 }}>
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

            <div style={{ fontSize:12, fontWeight:900, color:"rgba(255,255,255,0.3)", letterSpacing:2, textAlign:"center", marginBottom:16 }}>STEP 2 — SELECT AGE & STAGE</div>

            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:14 }}>
              {STAGES.map(s => (
                <button key={s.id} aria-label={`Select stage: ${s.name}, ${s.ages}`} role="button" onClick={() => { sndTick(); setStage(s); setStep(3); }}
                  style={{ ...S.btn, background:s.color+"08", border:"2px solid "+s.color+"25", borderRadius:20, padding:"22px 20px", textAlign:"left", color:"#fff", minHeight:52 }}
                  onMouseEnter={e => { e.currentTarget.style.background=s.color+"18"; e.currentTarget.style.borderColor=s.color; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=s.color+"08"; e.currentTarget.style.borderColor=s.color+"25"; e.currentTarget.style.transform="none"; }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:10 }}>
                    <div style={{ fontSize:36 }}>{s.emoji}</div>
                    <div>
                      <div style={{ fontWeight:900, fontSize:17, color:s.color }}>{s.name}</div>
                      <div style={{ fontSize:12, fontWeight:700, color:s.color+"AA" }}>{s.ages}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{s.grades}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.7, marginBottom:10 }}>{s.desc}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {s.subjects.slice(0,4).map(sub => (
                      <span key={sub} style={{ background:s.color+"12", border:"1px solid "+s.color+"25", borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:700, color:s.color+"CC" }}>{sub}</span>
                    ))}
                    <span style={{ background:"rgba(255,255,255,0.05)", borderRadius:20, padding:"2px 8px", fontSize:10, color:"rgba(255,255,255,0.3)" }}>+{s.subjects.length-4} more</span>
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

            <div style={{ fontSize:12, fontWeight:900, color:"rgba(255,255,255,0.3)", letterSpacing:2, textAlign:"center", marginBottom:16 }}>STEP 3 — SELECT LEARNING FOCUS</div>

            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)", gap:12, marginBottom:20 }}>
              {FOCUSES.map(f => (
                <button key={f.id} aria-label={`Select focus: ${f.name} — ${f.desc}`} role="button" onClick={() => { sndTick(); setFocus(f); if (f.id !== "academic") { setTimeout(() => startChat(f), 200); } }}
                  style={{ ...S.btn, background: focus?.id===f.id ? accentColor+"18" : "rgba(255,255,255,0.04)", border:"2px solid "+(focus?.id===f.id ? accentColor : "rgba(255,255,255,0.08)"), borderRadius:18, padding:"18px 14px", textAlign:"left", color:"#fff", minHeight:52 }}
                  onMouseEnter={e => { e.currentTarget.style.background=accentColor+"12"; e.currentTarget.style.borderColor=accentColor+"50"; }}
                  onMouseLeave={e => { if(focus?.id!==f.id){e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";} }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{f.emoji}</div>
                  <div style={{ fontWeight:900, fontSize:14, color: focus?.id===f.id ? accentColor : "rgba(255,255,255,0.85)", marginBottom:4 }}>{f.name}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", lineHeight:1.6 }}>{f.desc}</div>
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

            {/* Chat confetti */}
            {showChatConfetti && <SENConfetti />}

            {/* Progress bar — XP towards next level */}
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <span style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.4)" }}>Session Progress</span>
                <span style={{ fontSize:11, fontWeight:800, color:"#A8E063" }}>{xpData.xp} / {Math.ceil((xpData.xp + 1) / 500) * 500} XP</span>
              </div>
              <div style={{ height:8, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:100, background:"linear-gradient(90deg,#A8E063,#63D2FF)", width: Math.min(100, (xpData.xp % 500) / 500 * 100) + "%", transition:"width 0.5s ease" }} />
              </div>
              <div style={{ display:"flex", gap:12, marginTop:6 }}>
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>Sessions: {xpData.sessions}</span>
                {xpData.streak > 0 && <span style={{ fontSize:10, color:"#FFC300" }}>🔥 {xpData.streak} day streak</span>}
                {chatMsgCount > 0 && <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>Messages: {chatMsgCount}</span>}
              </div>
            </div>

            {/* Profile banner */}
            <div style={{ background:"linear-gradient(135deg,"+accentColor+"12,rgba(255,255,255,0.02))", border:"1px solid "+accentColor+"25", borderRadius:18, padding:"14px 18px", marginBottom:14, display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
              <div style={{ fontSize:28 }}>{condition?.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:900, fontSize:14, color:accentColor }}>
                  {condition?.name} · {stage?.name} · {stage?.ages}
                  {urduMode && <span style={{ fontSize:11, background:"rgba(79,142,247,0.2)", border:"1px solid rgba(79,142,247,0.4)", borderRadius:6, padding:"1px 8px", marginLeft:8, color:"#4F8EF7" }}>اردو</span>}
                </div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>
                  {focus?.emoji} {focus?.name}{subject ? " — "+subject : ""} · {stage?.grades}
                </div>
              </div>
              <button onClick={() => setStep(3)}
                style={{ ...S.btn, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"6px 12px", color:"rgba(255,255,255,0.45)", fontSize:11, fontWeight:700 }}>
                Change Focus
              </button>
            </div>

            {/* Chat */}
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, overflow:"hidden" }}>
              <div role="log" aria-label="Chat with Starky" aria-live="polite" style={{ height:isMobile?400:500, overflowY:"auto", padding:isMobile?14:20, display:"flex", flexDirection:"column", gap:14 }}>
                {messages.map((msg, i) => (
                  <div key={i} aria-label={msg.role==="assistant"?"Starky says":"You said"} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start", gap:10, animation:"fadeUp 0.3s ease" }}>
                    {msg.role==="assistant" && (
                      <div aria-hidden="true" style={{ width:32, height:32, borderRadius:"50%", background:accentColor+"20", border:"1px solid "+accentColor+"40", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0, marginTop:2 }}>💜</div>
                    )}
                    <div style={{ maxWidth:"88%", padding:"13px 16px", borderRadius:16, background:msg.role==="user" ? "linear-gradient(135deg,"+accentColor+"CC,"+accentColor+"88)" : "rgba(255,255,255,0.06)", color:msg.role==="user" ? "#060B20" : "rgba(255,255,255,0.93)", fontSize:15, lineHeight:1.85, fontWeight:msg.role==="user"?700:400, whiteSpace:"pre-wrap" }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:accentColor+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>💜</div>
                    <div style={{ display:"flex", gap:5 }}>
                      {[0,0.2,0.4].map((d,j) => <div key={j} style={{ width:9, height:9, borderRadius:"50%", background:accentColor, animation:`bounce 1s ${d}s ease-in-out infinite`, opacity:0.8 }}/>)}
                    </div>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)", fontStyle:"italic" }}>Starky is thinking...</span>
                  </div>
                )}
                <div ref={chatEndRef}/>
              </div>

              {/* Input */}
              <div style={{ padding:"12px 16px", borderTop:"1px solid "+accentColor+"15" }}>
                <textarea value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e => { if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)) sendMessage(input); }}
                  aria-label={`Type your message to Starky about ${subject||focus?.name||"anything"}`}
                  placeholder={`Ask Starky about ${subject||focus?.name||"anything"}... Ctrl+Enter to send`}
                  rows={isMobile?3:4}
                  style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid "+accentColor+"22", borderRadius:14, padding:"12px 14px", color:"#fff", fontSize:15, fontFamily:"'Nunito',sans-serif", resize:"vertical", lineHeight:1.7 }}/>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.2)" }}>
                    Unlimited sessions for SEN students · Ctrl+Enter to send
                  </span>
                  <button aria-label="Send message" role="button" onClick={()=>sendMessage(input)} disabled={!input.trim()||loading||limitReached}
                    style={{ ...S.btn, background:input.trim()&&!loading ? "linear-gradient(135deg,"+accentColor+","+accentColor+"BB)" : "rgba(255,255,255,0.08)", borderRadius:14, padding:"12px 24px", color:input.trim()&&!loading?"#060B20":"rgba(255,255,255,0.3)", fontWeight:900, fontSize:14, minHeight:52 }}>
                    {loading?"Thinking...":"Send →"}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick prompts */}
            <div style={{ marginTop:12, display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:8 }}>
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

            {/* ── Quick Exercise Buttons ─────────────────── */}
            <SENQuickExercises condition={condition} stage={stage} xpData={xpData} setXpData={setXpData} />

            {/* Share session with teacher/therapist */}
            {messages.length > 2 && (
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
              <div style={{ fontSize:11, fontWeight:900, color:"rgba(255,255,255,0.3)", letterSpacing:2, marginBottom:8 }}>CREATIVE LEARNING</div>
              <div style={{ fontWeight:900, fontSize:isMobile?17:22, marginBottom:6 }}>Music, Reading & Arts — Built for Your Child</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.8 }}>Specialist creative learning for every condition, every age.</div>
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
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", lineHeight:1.6 }}>{s.desc}</div>
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
                <div style={{ fontSize:11, fontWeight:900, color:"rgba(255,255,255,0.3)", letterSpacing:2, marginBottom:8 }}>LANGUAGE & LITERACY</div>
                <div style={{ fontWeight:900, fontSize:isMobile?17:22, marginBottom:6 }}>Languages & Spelling — Adapted for Your Child</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.8 }}>
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
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", lineHeight:1.6, marginBottom:8 }}>
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
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", lineHeight:1.6, marginBottom:8 }}>
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
      {step === 4 && <div style={{marginTop:48,paddingTop:40,borderTop:"1px solid rgba(255,255,255,0.07)"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{display:"inline-block",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"4px 16px",fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",letterSpacing:2,marginBottom:12}}>CREATIVE LEARNING</div>
          <h2 style={{fontSize:isMobile?20:28,fontWeight:900,margin:"0 0 8px",color:"#fff"}}>Music, Reading <span style={{color:"#C77DFF"}}>&</span> Arts</h2>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.45)",maxWidth:560,margin:"0 auto",lineHeight:1.8}}>Specialist creative learning built for children with autism, ADHD, dyslexia, Down syndrome, cerebral palsy, visual impairment, and complex communication needs.</p>
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
          <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.8,marginBottom:12}}>Full access to Music, Reading, and Arts — all 7 specialist profiles, 120+ books, evidence-based teaching, and parent guides.</div>
          <a href="/pricing" style={{display:"inline-block",background:"linear-gradient(135deg,#C77DFF,#7B5EA7)",borderRadius:12,padding:"10px 24px",color:"#fff",fontWeight:900,fontSize:13,textDecoration:"none"}}>View Plans</a>
        </div>
      </div>}

      {/* ── SEN Practice Zone ───────────────────────── */}
      <div style={{maxWidth:600,margin:"0 auto 40px",padding:"0 16px"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{display:"inline-block",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"4px 16px",fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",letterSpacing:2,marginBottom:12}}>PRACTICE ZONE</div>
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
            <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.7}}>Once you tell Starky about your child, the Practice Zone will open — adapted specially for them.</div>
          </div>
        )}
      </div>

    </div>
  );
}
