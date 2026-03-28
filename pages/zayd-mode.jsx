import { useState, useEffect, useRef } from "react";
import Head from "next/head";

/**
 * /zayd-mode — Visual matching mode for severe autism
 * No text instructions. No typing. Just: image + tap + celebrate.
 *
 * Three session types in progression:
 * Type 1: Image → Image match (tap the same picture)
 * Type 2: Image → Word match (tap the word that matches the picture)
 * Type 3: Letter → Sound match (tap the sound the letter makes)
 *
 * Designed from observation of Zayd — a 14-year-old with severe autism
 * who independently navigates to counting/matching content on YouTube.
 * Format mirrors what he already chooses: animated character, counting,
 * predictable structure, 10/10 counter, calm celebration.
 */

// ── Audio — gentle, predictable ──
let _ctx = null;
function gCtx() { if (!_ctx) try { _ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch {} return _ctx; }
function tone(f,t,v,d,dl) { const c=gCtx(); if(!c) return; const o=c.createOscillator(),g=c.createGain(); o.connect(g);g.connect(c.destination);o.type=t||'sine';o.frequency.value=f; const ts=c.currentTime+(dl||0); g.gain.setValueAtTime(0,ts);g.gain.linearRampToValueAtTime(v||0.1,ts+0.03);g.gain.exponentialRampToValueAtTime(0.001,ts+d); o.start(ts);o.stop(ts+d+0.05); }
function sndCorrect() { tone(523,'sine',0.12,0.25); tone(659,'sine',0.12,0.2,0.15); }
function sndComplete() { tone(523,'sine',0.15,0.4); tone(659,'sine',0.15,0.35,0.12); tone(784,'sine',0.15,0.35,0.24); tone(1047,'sine',0.15,0.4,0.36); }

// ── Image-word pairs — familiar Pakistani context ──
const PAIRS = [
  { img: '🐱', word: 'cat', urdu: 'بلی' },
  { img: '🐕', word: 'dog', urdu: 'کتا' },
  { img: '🐦', word: 'bird', urdu: 'چڑیا' },
  { img: '🐟', word: 'fish', urdu: 'مچھلی' },
  { img: '🌳', word: 'tree', urdu: 'درخت' },
  { img: '🌻', word: 'flower', urdu: 'پھول' },
  { img: '☀️', word: 'sun', urdu: 'سورج' },
  { img: '🌙', word: 'moon', urdu: 'چاند' },
  { img: '⭐', word: 'star', urdu: 'ستارا' },
  { img: '🍎', word: 'apple', urdu: 'سیب' },
  { img: '🍌', word: 'banana', urdu: 'کیلا' },
  { img: '🥭', word: 'mango', urdu: 'آم' },
  { img: '🚗', word: 'car', urdu: 'گاڑی' },
  { img: '✈️', word: 'plane', urdu: 'جہاز' },
  { img: '🏠', word: 'house', urdu: 'گھر' },
  { img: '👦', word: 'boy', urdu: 'لڑکا' },
  { img: '👧', word: 'girl', urdu: 'لڑکی' },
  { img: '👨', word: 'father', urdu: 'ابو' },
  { img: '👩', word: 'mother', urdu: 'امی' },
  { img: '📖', word: 'book', urdu: 'کتاب' },
  { img: '✏️', word: 'pencil', urdu: 'پنسل' },
  { img: '⚽', word: 'ball', urdu: 'گیند' },
  { img: '🎒', word: 'bag', urdu: 'بستہ' },
  { img: '🥛', word: 'milk', urdu: 'دودھ' },
  { img: '🍞', word: 'bread', urdu: 'روٹی' },
  { img: '💧', word: 'water', urdu: 'پانی' },
  { img: '🔴', word: 'red', urdu: 'لال' },
  { img: '🔵', word: 'blue', urdu: 'نیلا' },
  { img: '🟢', word: 'green', urdu: 'ہرا' },
  { img: '🟡', word: 'yellow', urdu: 'پیلا' },
];

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LETTER_SOUNDS = {
  A: '/a/ as in apple', B: '/b/ as in ball', C: '/k/ as in cat', D: '/d/ as in dog',
  E: '/e/ as in egg', F: '/f/ as in fish', G: '/g/ as in go', H: '/h/ as in hat',
  I: '/i/ as in insect', J: '/j/ as in jump', K: '/k/ as in kite', L: '/l/ as in lemon',
  M: '/m/ as in moon', N: '/n/ as in nest', O: '/o/ as in octopus', P: '/p/ as in pen',
  Q: '/kw/ as in queen', R: '/r/ as in run', S: '/s/ as in sun', T: '/t/ as in tree',
  U: '/u/ as in umbrella', V: '/v/ as in van', W: '/w/ as in water', X: '/ks/ as in box',
  Y: '/y/ as in yellow', Z: '/z/ as in zip',
};

// ── Progress persistence ──
const PROG_KEY = 'nw_zayd_progress';
function loadProg() { try { return JSON.parse(localStorage.getItem(PROG_KEY) || '{}'); } catch { return {}; } }
function saveProg(d) { try { localStorage.setItem(PROG_KEY, JSON.stringify(d)); } catch {} }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export default function ZaydMode() {
  const [sessionType, setSessionType] = useState(null); // 1=img-img, 2=img-word, 3=letter-sound
  const [round, setRound] = useState(0); // 0-9 (10 rounds per session)
  const [score, setScore] = useState(0);
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState({});
  const [characterState, setCharacterState] = useState('idle'); // idle, pointing, celebrating

  useEffect(() => { setProgress(loadProg()); }, []);

  const startSession = (type) => {
    setSessionType(type);
    setRound(0);
    setScore(0);
    setDone(false);
    setFeedback(null);

    if (type === 1 || type === 2) {
      const shuffled = shuffle(PAIRS).slice(0, 10);
      setItems(shuffled);
      setupRound(shuffled, 0, type);
    } else {
      const shuffled = shuffle(LETTERS).slice(0, 10);
      setItems(shuffled);
      setupLetterRound(shuffled, 0);
    }
    setCharacterState('pointing');
  };

  const setupRound = (itemList, idx, type) => {
    const target = itemList[idx];
    if (type === 1) {
      // Image → Image: show target image, pick from 2 images
      const wrong = shuffle(PAIRS.filter(p => p.word !== target.word))[0];
      const opts = shuffle([
        { value: target.img, label: target.img, correct: true },
        { value: wrong.img, label: wrong.img, correct: false },
      ]);
      setCurrent(target);
      setOptions(opts);
    } else {
      // Image → Word: show image, pick from 2 words
      const wrong = shuffle(PAIRS.filter(p => p.word !== target.word))[0];
      const opts = shuffle([
        { value: target.word, label: target.word, correct: true },
        { value: wrong.word, label: wrong.word, correct: false },
      ]);
      setCurrent(target);
      setOptions(opts);
    }
  };

  const setupLetterRound = (letterList, idx) => {
    const target = letterList[idx];
    const wrong = shuffle(LETTERS.filter(l => l !== target))[0];
    const opts = shuffle([
      { value: target, label: LETTER_SOUNDS[target], correct: true },
      { value: wrong, label: LETTER_SOUNDS[wrong], correct: false },
    ]);
    setCurrent({ letter: target, sound: LETTER_SOUNDS[target] });
    setOptions(opts);
  };

  const handleTap = (opt) => {
    if (feedback) return; // prevent double-tap

    if (opt.correct) {
      setFeedback('correct');
      setScore(s => s + 1);
      setCharacterState('celebrating');
      sndCorrect();
    } else {
      setFeedback('wrong');
      setCharacterState('idle');
    }

    // Move to next round after a pause
    setTimeout(() => {
      setFeedback(null);
      setCharacterState('pointing');
      const nextRound = round + 1;

      if (nextRound >= 10) {
        // Session complete
        setDone(true);
        setCharacterState('celebrating');
        sndComplete();
        // Save progress
        const p = loadProg();
        p.totalSessions = (p.totalSessions || 0) + 1;
        p.totalCorrect = (p.totalCorrect || 0) + score + (opt.correct ? 1 : 0);
        p.lastSession = new Date().toISOString().split('T')[0];
        if (!p.typeProgress) p.typeProgress = {};
        p.typeProgress[sessionType] = (p.typeProgress[sessionType] || 0) + 1;
        saveProg(p);
        setProgress(p);

        // Signal collection
        try {
          const profile = JSON.parse(localStorage.getItem('nw_user') || '{}');
          fetch('/api/signals', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ signals: [{ type: 'drill', email: profile.email || 'anonymous', subject: 'Zayd Mode', topic: `Type ${sessionType}`, score: score + (opt.correct ? 1 : 0), max_score: 10, completed: true }] }),
          }).catch(() => {});
        } catch {}
        return;
      }

      setRound(nextRound);
      if (sessionType === 3) {
        setupLetterRound(items, nextRound);
      } else {
        setupRound(items, nextRound, sessionType);
      }
    }, 1200);
  };

  // ── Starky animated character (inline SVG) ──
  const StarkyCharacter = ({ state }) => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
      <svg viewBox="0 0 120 120" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        {/* Body circle */}
        <circle cx="60" cy="60" r="50" fill="#0D1635" stroke="#4F8EF7" strokeWidth="3" />
        {/* Star on forehead */}
        <polygon points="60,18 63,26 72,26 65,31 68,40 60,35 52,40 55,31 48,26 57,26" fill="#FFC300" />
        {/* Eyes */}
        <ellipse cx="44" cy="52" rx="6" ry="7" fill="white" />
        <circle cx="44" cy="52" r="3" fill="#4F8EF7" />
        <ellipse cx="76" cy="52" rx="6" ry="7" fill="white" />
        <circle cx="76" cy="52" r="3" fill="#4F8EF7" />
        {/* Mouth based on state */}
        {state === 'celebrating' ? (
          <ellipse cx="60" cy="74" rx="12" ry="8" fill="white" opacity="0.9" />
        ) : state === 'pointing' ? (
          <ellipse cx="60" cy="74" rx="8" ry="4" fill="white" opacity="0.7" />
        ) : (
          <path d="M 46 72 Q 60 80 74 72" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        )}
        {/* Pointing hand when pointing */}
        {state === 'pointing' && (
          <g>
            <line x1="105" y1="55" x2="120" y2="45" stroke="#4F8EF7" strokeWidth="3" strokeLinecap="round" />
            <circle cx="120" cy="43" r="4" fill="#4F8EF7" />
          </g>
        )}
      </svg>
    </div>
  );

  const S = {
    page: { minHeight: '100vh', background: '#0A0F1E', fontFamily: "'Nunito','Sora',sans-serif", color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 16px' },
    optBtn: (isCorrectFeedback, isWrongFeedback) => ({
      width: '100%', maxWidth: 280, minHeight: 80, borderRadius: 20, border: 'none', cursor: 'pointer',
      fontSize: 32, fontWeight: 800, fontFamily: "'Nunito',sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      background: isCorrectFeedback ? 'rgba(74,222,128,0.2)' : isWrongFeedback ? 'rgba(255,107,107,0.15)' : 'rgba(255,255,255,0.06)',
      border: isCorrectFeedback ? '3px solid #4ADE80' : isWrongFeedback ? '3px solid #FF6B6B' : '3px solid rgba(255,255,255,0.1)',
      color: isCorrectFeedback ? '#4ADE80' : isWrongFeedback ? '#FF6B6B' : '#fff',
      transition: 'all 0.15s',
    }),
  };

  // ── Session selector ──
  if (!sessionType) {
    return (
      <div style={S.page}>
        <Head>
          <title>Starky's World — NewWorldEdu</title>
          <meta name="description" content="Visual learning mode for children with severe autism. Image matching, word matching, letter sounds — all tap-based." />
        </Head>
        <StarkyCharacter state="idle" />
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px', textAlign: 'center' }}>Starky's World</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 28px', textAlign: 'center' }}>Tap to start</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 300 }}>
          <button onClick={() => startSession(1)} style={{ ...S.optBtn(false, false), fontSize: 18, minHeight: 70, background: 'rgba(255,142,83,0.1)', border: '3px solid rgba(255,142,83,0.3)', color: '#FF8E53' }}>
            🖼️ Match Pictures
          </button>
          <button onClick={() => startSession(2)} style={{ ...S.optBtn(false, false), fontSize: 18, minHeight: 70, background: 'rgba(79,142,247,0.1)', border: '3px solid rgba(79,142,247,0.3)', color: '#4F8EF7' }}>
            📖 Match Words
          </button>
          <button onClick={() => startSession(3)} style={{ ...S.optBtn(false, false), fontSize: 18, minHeight: 70, background: 'rgba(168,224,99,0.1)', border: '3px solid rgba(168,224,99,0.3)', color: '#A8E063' }}>
            🔤 Letter Sounds
          </button>
        </div>

        {progress.totalSessions > 0 && (
          <div style={{ marginTop: 24, textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
            Sessions: {progress.totalSessions} · Correct: {progress.totalCorrect}
          </div>
        )}
      </div>
    );
  }

  // ── Session complete ──
  if (done) {
    return (
      <div style={S.page}>
        <Head><title>Done! — Starky's World</title></Head>
        <StarkyCharacter state="celebrating" />
        <div style={{ fontSize: 64, marginBottom: 12 }}>🌟</div>
        <div style={{ fontSize: 48, fontWeight: 900, color: '#FFC300', marginBottom: 8 }}>{score}/10</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 28 }}>Done!</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => startSession(sessionType)} style={{ background: 'rgba(79,142,247,0.15)', border: '2px solid rgba(79,142,247,0.3)', borderRadius: 16, padding: '16px 28px', color: '#4F8EF7', fontWeight: 800, fontSize: 16, cursor: 'pointer', fontFamily: "'Nunito',sans-serif" }}>
            Again
          </button>
          <button onClick={() => { setSessionType(null); setDone(false); }} style={{ background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '16px 28px', color: 'rgba(255,255,255,0.6)', fontWeight: 800, fontSize: 16, cursor: 'pointer', fontFamily: "'Nunito',sans-serif" }}>
            Back
          </button>
        </div>
      </div>
    );
  }

  // ── Active session ──
  return (
    <div style={S.page}>
      <Head><title>Starky's World</title></Head>

      {/* Counter — always visible, top right */}
      <div style={{ position: 'fixed', top: 16, right: 16, fontSize: 20, fontWeight: 900, color: '#FFC300', zIndex: 10 }}>
        {round + 1}/10
      </div>

      {/* Score dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: i < score ? '#4ADE80' : i === round ? '#FFC300' : 'rgba(255,255,255,0.1)' }} />
        ))}
      </div>

      <StarkyCharacter state={characterState} />

      {/* Target — what the student needs to match */}
      <div style={{ fontSize: sessionType === 3 ? 72 : 80, marginBottom: 24, textAlign: 'center', lineHeight: 1, minHeight: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {sessionType === 3 ? current?.letter : current?.img}
      </div>

      {sessionType === 3 && (
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 16, textAlign: 'center' }}>
          What sound does this letter make?
        </div>
      )}

      {/* Options — two big tap targets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 300 }}>
        {options.map((opt, i) => {
          const isCorrectFeedback = feedback === 'correct' && opt.correct;
          const isWrongFeedback = feedback === 'wrong' && !opt.correct;
          return (
            <button key={i} onClick={() => handleTap(opt)} style={S.optBtn(isCorrectFeedback, isWrongFeedback)}>
              {sessionType === 1 ? (
                <span style={{ fontSize: 48 }}>{opt.label}</span>
              ) : sessionType === 2 ? (
                <span style={{ fontSize: 28, fontWeight: 800 }}>{opt.label}</span>
              ) : (
                <span style={{ fontSize: 16, fontWeight: 600 }}>{opt.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback overlay */}
      {feedback === 'correct' && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 72, zIndex: 100, pointerEvents: 'none', animation: 'fadeUp 0.6s ease forwards' }}>
          ✓
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from { opacity:1; transform:translate(-50%,-50%) scale(1); } to { opacity:0; transform:translate(-50%,-70%) scale(1.5); } }
      `}</style>
    </div>
  );
}
