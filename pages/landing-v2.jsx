import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

/*
 * landing-v2.jsx — LESA.app design clone
 * Full-screen hero carousel, left sidebar nav, bottom bar,
 * yellow marquee, massive typography, slide progress bars
 */

const C = {
  bg: '#F0EEF6',
  primary: '#4F46E5',
  pink: '#F472B6',
  green: '#34D399',
  yellow: '#FBBF24',
  purple: '#A78BFA',
  navy: '#1a1a3e',
  text: '#1a1a2e',
  white: '#FFFFFF',
};

// ─── Slide data ───
const SLIDES = [
  {
    bg: '#4F46E5',         // indigo
    bigText: 'STARKY',
    tagline: 'The world\'s smartest AI tutor for every child',
    shapes: [
      { ch: '📚', x: '15%', y: '25%', size: 48, delay: 0 },
      { ch: '⭐', x: '80%', y: '20%', size: 36, delay: 0.5 },
      { ch: '🧠', x: '25%', y: '70%', size: 42, delay: 1 },
      { ch: '✏️', x: '75%', y: '65%', size: 38, delay: 1.5 },
      { ch: '🎯', x: '60%', y: '30%', size: 32, delay: 0.8 },
      { ch: '💡', x: '35%', y: '35%', size: 34, delay: 1.2 },
      { ch: '🌟', x: '70%', y: '75%', size: 30, delay: 0.3 },
    ],
    confetti: ['#F472B6', '#34D399', '#FBBF24', '#A78BFA', '#FFFFFF'],
  },
  {
    bg: '#6366f1',         // lighter indigo
    bigText: '89,000+',
    tagline: 'Verified Cambridge, Edexcel & SAT questions — zero AI filler',
    shapes: [
      { ch: '📝', x: '20%', y: '28%', size: 44, delay: 0 },
      { ch: '🎓', x: '78%', y: '22%', size: 40, delay: 0.6 },
      { ch: '📊', x: '18%', y: '68%', size: 38, delay: 1.1 },
      { ch: '🏆', x: '82%', y: '70%', size: 42, delay: 0.3 },
      { ch: '📖', x: '50%', y: '25%', size: 36, delay: 0.9 },
    ],
    confetti: ['#F472B6', '#34D399', '#FBBF24', '#FF6B6B', '#FFFFFF'],
  },
  {
    bg: '#FBBF24',         // yellow
    bigText: 'LEARN',
    tagline: 'KG to A Level. 30+ subjects. 16 languages. One platform.',
    shapes: [
      { ch: '🌍', x: '22%', y: '30%', size: 46, delay: 0 },
      { ch: '🚀', x: '76%', y: '25%', size: 40, delay: 0.4 },
      { ch: '💜', x: '20%', y: '65%', size: 36, delay: 0.8 },
      { ch: '🧪', x: '80%', y: '68%', size: 42, delay: 1.2 },
      { ch: '📐', x: '55%', y: '28%', size: 34, delay: 0.6 },
    ],
    confetti: ['#4F46E5', '#F472B6', '#34D399', '#1a1a2e', '#FFFFFF'],
  },
  {
    bg: '#1a1a3e',         // dark navy
    bigText: 'GROW',
    tagline: 'Better grades in 30 days. Trusted by schools in Pakistan & UAE.',
    shapes: [
      { ch: '🏫', x: '18%', y: '26%', size: 44, delay: 0 },
      { ch: '👨‍👩‍👧', x: '80%', y: '24%', size: 40, delay: 0.5 },
      { ch: '📈', x: '24%', y: '72%', size: 38, delay: 1.0 },
      { ch: '💪', x: '78%', y: '70%', size: 42, delay: 0.7 },
      { ch: '🌱', x: '52%', y: '30%', size: 36, delay: 1.3 },
    ],
    confetti: ['#F472B6', '#34D399', '#FBBF24', '#A78BFA', '#FFFFFF'],
  },
];

const SLIDE_DURATION = 5000; // ms per slide

const CSS = `
  /* ── Reset ── */
  .lv2-page * { margin: 0; padding: 0; box-sizing: border-box; }
  .lv2-page {
    font-family: 'Nunito', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    position: relative;
    color-scheme: light !important;
  }
  .lv2-page a { text-decoration: none; color: inherit; }

  /* ── Marquee ── */
  @keyframes lv2Marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  /* ── Floating shapes ── */
  @keyframes lv2ShapeFloat {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(8px, -18px) rotate(8deg); }
    50% { transform: translate(-5px, -10px) rotate(-5deg); }
    75% { transform: translate(10px, -22px) rotate(6deg); }
  }
  @keyframes lv2ShapePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }

  /* ── Confetti particles ── */
  @keyframes lv2ConfettiFall {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    100% { transform: translateY(40px) rotate(360deg); opacity: 0; }
  }

  /* ── Big text entrance ── */
  @keyframes lv2BigTextIn {
    0% { opacity: 0; transform: scale(0.85) translateY(40px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes lv2TaglineIn {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  /* ── Slide background transition ── */
  .lv2-slide-bg {
    transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* ── Progress bar fill ── */
  @keyframes lv2Progress {
    0% { width: 0%; }
    100% { width: 100%; }
  }

  /* ── Sidebar vertical text ── */
  .lv2-vertical-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
  }

  /* ── Button hover ── */
  .lv2-btn {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease,
                background 0.3s ease,
                color 0.3s ease;
  }
  .lv2-btn:hover {
    transform: translateY(-2px) scale(1.03);
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .lv2-sidebar { display: none !important; }
    .lv2-big-text { font-size: 20vw !important; }
    .lv2-bottom-bar { padding: 12px 16px !important; }
    .lv2-bottom-tagline { display: none !important; }
    .lv2-progress-row { padding: 0 16px !important; }
  }
`;

// ──────────────────────────────────────────────
// Yellow Marquee Ticker (top)
// ──────────────────────────────────────────────
function Marquee() {
  const items = [
    { emoji: '🎉', text: '89,000+ verified questions and growing!' },
    { emoji: '📚', text: 'Sign up and start learning for free!' },
    { emoji: '⭐', text: 'Cambridge exams start 23 April — are you ready?' },
    { emoji: '🌍', text: 'NewWorldEdu covers 16 languages and 30+ subjects!' },
    { emoji: '💜', text: 'SEN support available for every child' },
    { emoji: '🚀', text: 'Better grades in 30 days. Try Starky today!' },
  ];
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div style={{
      background: '#FBBF24',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '9px 0',
      position: 'absolute',
      top: 0, left: 0, right: 0,
      zIndex: 200,
    }}>
      <div style={{
        display: 'inline-flex',
        animation: 'lv2Marquee 50s linear infinite',
      }}>
        {repeated.map((item, i) => (
          <span key={i} style={{
            fontFamily: '"Nunito", sans-serif',
            fontWeight: 800,
            fontSize: 13,
            color: C.navy,
            marginRight: 56,
            flexShrink: 0,
            letterSpacing: '0.3px',
          }}>
            {item.emoji}  {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Left Sidebar
// ──────────────────────────────────────────────
function Sidebar({ currentSlide }) {
  const isLight = SLIDES[currentSlide]?.bg === '#FBBF24';
  const color = isLight ? C.navy : C.white;

  return (
    <div className="lv2-sidebar" style={{
      position: 'absolute',
      left: 0, top: 36, bottom: 0,
      width: 56,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '48px 0 80px',
      zIndex: 50,
      transition: 'color 0.6s ease',
    }}>
      {/* Hamburger */}
      <button style={{
        background: 'none', border: 'none',
        cursor: 'pointer', padding: 8,
        display: 'flex', flexDirection: 'column',
        gap: 5, alignItems: 'center',
      }} aria-label="Menu">
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 22, height: 2.5,
            background: color,
            borderRadius: 2,
            transition: 'background 0.6s ease',
          }} />
        ))}
      </button>

      {/* Vertical brand text */}
      <div className="lv2-vertical-text" style={{
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 900,
        fontSize: 16,
        letterSpacing: 6,
        color,
        transition: 'color 0.6s ease',
        userSelect: 'none',
      }}>
        NEWWORLDEDU
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Floating shapes layer per slide
// ──────────────────────────────────────────────
function FloatingShapes({ shapes, confetti, active }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: 'none',
      opacity: active ? 1 : 0,
      transition: 'opacity 0.6s ease',
    }}>
      {/* Emoji shapes */}
      {shapes.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: s.x, top: s.y,
          fontSize: s.size,
          animation: `lv2ShapeFloat ${4 + i * 0.5}s ease-in-out infinite`,
          animationDelay: `${s.delay}s`,
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
          zIndex: 2,
        }}>
          {s.ch}
        </div>
      ))}

      {/* Small confetti dots */}
      {confetti.map((color, i) => {
        const positions = [
          { x: '12%', y: '40%' }, { x: '88%', y: '35%' },
          { x: '30%', y: '80%' }, { x: '72%', y: '78%' },
          { x: '45%', y: '18%' }, { x: '58%', y: '82%' },
          { x: '8%', y: '55%' }, { x: '92%', y: '50%' },
          { x: '40%', y: '60%' }, { x: '65%', y: '45%' },
        ];
        const p = positions[i % positions.length];
        const shapes = ['●', '◆', '★', '■', '▲'];
        return (
          <div key={i} style={{
            position: 'absolute',
            left: p.x, top: p.y,
            color,
            fontSize: 8 + (i % 3) * 4,
            opacity: 0.6,
            animation: `lv2ShapePulse ${2 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}>
            {shapes[i % shapes.length]}
          </div>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────
// Hero slide content
// ──────────────────────────────────────────────
function SlideContent({ slide, active, index }) {
  const isLight = slide.bg === '#FBBF24';
  const textColor = isLight ? C.navy : C.white;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: active ? 1 : 0,
      transform: active ? 'scale(1)' : 'scale(0.95)',
      transition: 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
      pointerEvents: active ? 'auto' : 'none',
      zIndex: active ? 5 : 1,
    }}>
      {/* Giant text */}
      <h1 className="lv2-big-text" style={{
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 900,
        fontSize: 'min(18vw, 220px)',
        color: textColor,
        opacity: 0.95,
        letterSpacing: '-4px',
        lineHeight: 0.95,
        textAlign: 'center',
        userSelect: 'none',
        position: 'relative',
        zIndex: 3,
        textShadow: isLight ? 'none' : '0 4px 40px rgba(0,0,0,0.15)',
        animation: active ? 'lv2BigTextIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards' : 'none',
      }}>
        {slide.bigText}
      </h1>

      {/* Floating shapes */}
      <FloatingShapes shapes={slide.shapes} confetti={slide.confetti} active={active} />
    </div>
  );
}

// ──────────────────────────────────────────────
// Progress bars
// ──────────────────────────────────────────────
function ProgressBars({ current, total, isLight, onSlideClick }) {
  const barColor = isLight ? C.navy : C.white;

  return (
    <div className="lv2-progress-row" style={{
      position: 'absolute',
      bottom: 70,
      left: 80, right: 80,
      display: 'flex',
      gap: 12,
      zIndex: 100,
      padding: '0 48px',
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i}
          onClick={() => onSlideClick(i)}
          style={{
            flex: 1,
            height: 3,
            background: `${barColor}30`,
            borderRadius: 2,
            overflow: 'hidden',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <div style={{
            height: '100%',
            background: barColor,
            borderRadius: 2,
            width: i < current ? '100%' : i === current ? '0%' : '0%',
            animation: i === current ? `lv2Progress ${SLIDE_DURATION}ms linear forwards` : 'none',
            transition: i < current ? 'none' : 'none',
          }} />
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────
// Bottom bar
// ──────────────────────────────────────────────
function BottomBar({ currentSlide }) {
  const isLight = SLIDES[currentSlide]?.bg === '#FBBF24';
  const textColor = isLight ? C.navy : C.white;
  const tagline = SLIDES[currentSlide]?.tagline || '';

  return (
    <div className="lv2-bottom-bar" style={{
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 48px 16px 80px',
      zIndex: 100,
      transition: 'color 0.6s ease',
    }}>
      {/* Left: Get in touch */}
      <Link href="/contact" className="lv2-btn" style={{
        background: textColor,
        color: isLight ? '#FBBF24' : C.primary,
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 800,
        fontSize: 15,
        padding: '13px 30px',
        borderRadius: 100,
        display: 'inline-block',
      }}>
        Get in touch
      </Link>

      {/* Center: Tagline */}
      <p className="lv2-bottom-tagline" style={{
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 800,
        fontSize: 'clamp(16px, 2.2vw, 22px)',
        color: textColor,
        textAlign: 'center',
        flex: 1,
        padding: '0 24px',
        transition: 'color 0.6s ease',
        lineHeight: 1.3,
      }}>
        {tagline}
      </p>

      {/* Right: Start free */}
      <Link href="/start" className="lv2-btn" style={{
        background: textColor,
        color: isLight ? '#FBBF24' : C.primary,
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 800,
        fontSize: 15,
        padding: '13px 30px',
        borderRadius: 100,
        display: 'inline-block',
      }}>
        Start free →
      </Link>
    </div>
  );
}

// ══════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════
export default function LandingV2() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const total = SLIDES.length;

  // Auto-advance slides
  const goTo = useCallback((idx) => {
    setCurrent(idx);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total);
    }, SLIDE_DURATION);
  }, [total]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total);
    }, SLIDE_DURATION);
    return () => clearInterval(timerRef.current);
  }, [total]);

  const isLight = SLIDES[current]?.bg === '#FBBF24';

  return (
    <div className="lv2-page">
      <Head>
        <title>NewWorldEdu — Every Child Deserves a World-Class Tutor</title>
        <meta name="description" content="89,000+ verified Cambridge questions. 24/7 AI tutor in 16 languages. Better grades in 30 days." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── Background layers ── */}
      {SLIDES.map((slide, i) => (
        <div key={i} className="lv2-slide-bg" style={{
          position: 'absolute',
          inset: 0,
          background: slide.bg,
          opacity: i === current ? 1 : 0,
          zIndex: 0,
        }} />
      ))}

      {/* ── Yellow Marquee ── */}
      <Marquee />

      {/* ── Left Sidebar ── */}
      <Sidebar currentSlide={current} />

      {/* ── Slide Contents ── */}
      <div style={{ position: 'absolute', inset: 0, top: 36 }}>
        {SLIDES.map((slide, i) => (
          <SlideContent key={i} slide={slide} active={i === current} index={i} />
        ))}
      </div>

      {/* ── Progress Bars ── */}
      <ProgressBars
        current={current}
        total={total}
        isLight={isLight}
        onSlideClick={goTo}
      />

      {/* ── Bottom Bar ── */}
      <BottomBar currentSlide={current} />
    </div>
  );
}
