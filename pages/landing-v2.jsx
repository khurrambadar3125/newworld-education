import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

/*
 * landing-v2.jsx — LESA.app-inspired landing page
 * Design clone: soft lavender bg, massive rounded typography,
 * smooth scroll, GSAP-style scroll reveals, playful floating shapes,
 * curved section dividers, spring hover states
 * Content: NewWorldEdu
 */

// ─── Palette ───
const C = {
  bg: '#F0EEF6',
  bgDark: '#1a1a2e',
  primary: '#4F46E5',     // indigo
  primaryLight: '#6366f1',
  pink: '#F472B6',
  pinkBg: '#FDF2F8',
  green: '#34D399',
  greenBg: '#ECFDF5',
  yellow: '#FBBF24',
  yellowBg: '#FFFBEB',
  purple: '#A78BFA',
  purpleBg: '#F5F3FF',
  text: '#1a1a2e',
  textMuted: '#6B7280',
  white: '#FFFFFF',
  card: '#FFFFFF',
  border: 'rgba(0,0,0,0.06)',
};

const GLOBAL_CSS = `
  /* ── Reset & Base ── */
  .lv2 * { margin: 0; padding: 0; box-sizing: border-box; }
  .lv2 {
    background: ${C.bg};
    color: ${C.text};
    font-family: 'Nunito', sans-serif;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    color-scheme: light !important;
  }
  .lv2 a { text-decoration: none; color: inherit; }

  /* ── Smooth Scroll ── */
  html { scroll-behavior: smooth; }

  /* ── Marquee ── */
  @keyframes lv2Marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .lv2-marquee-track {
    display: flex;
    animation: lv2Marquee 45s linear infinite;
    will-change: transform;
  }
  .lv2-marquee-track:hover { animation-play-state: paused; }

  /* ── Floating Shapes ── */
  @keyframes lv2Float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    33% { transform: translateY(-15px) rotate(3deg); }
    66% { transform: translateY(-8px) rotate(-2deg); }
  }
  @keyframes lv2Spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes lv2Pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 0.7; }
  }
  @keyframes lv2Wobble {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-12px) rotate(5deg); }
    75% { transform: translateY(-6px) rotate(-3deg); }
  }

  /* ── Scroll Reveal ── */
  .lv2-reveal {
    opacity: 0;
    transform: translateY(60px);
    transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .lv2-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .lv2-reveal-left {
    opacity: 0;
    transform: translateX(-60px);
    transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .lv2-reveal-left.visible {
    opacity: 1;
    transform: translateX(0);
  }
  .lv2-reveal-right {
    opacity: 0;
    transform: translateX(60px);
    transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .lv2-reveal-right.visible {
    opacity: 1;
    transform: translateX(0);
  }
  .lv2-reveal-scale {
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .lv2-reveal-scale.visible {
    opacity: 1;
    transform: scale(1);
  }

  /* Stagger children */
  .lv2-stagger > * {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .lv2-stagger.visible > *:nth-child(1) { transition-delay: 0s; opacity: 1; transform: translateY(0); }
  .lv2-stagger.visible > *:nth-child(2) { transition-delay: 0.1s; opacity: 1; transform: translateY(0); }
  .lv2-stagger.visible > *:nth-child(3) { transition-delay: 0.2s; opacity: 1; transform: translateY(0); }
  .lv2-stagger.visible > *:nth-child(4) { transition-delay: 0.3s; opacity: 1; transform: translateY(0); }
  .lv2-stagger.visible > *:nth-child(5) { transition-delay: 0.4s; opacity: 1; transform: translateY(0); }
  .lv2-stagger.visible > *:nth-child(6) { transition-delay: 0.5s; opacity: 1; transform: translateY(0); }
  .lv2-stagger.visible > *:nth-child(7) { transition-delay: 0.6s; opacity: 1; transform: translateY(0); }
  .lv2-stagger.visible > *:nth-child(8) { transition-delay: 0.7s; opacity: 1; transform: translateY(0); }

  /* ── Hero word reveal ── */
  .lv2-hero-word {
    display: inline-block;
    opacity: 0;
    transform: translateY(50px) rotateX(40deg);
    animation: lv2WordIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  @keyframes lv2WordIn {
    to { opacity: 1; transform: translateY(0) rotateX(0deg); }
  }

  /* ── Card hover spring ── */
  .lv2-card {
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.4s ease;
  }
  .lv2-card:hover {
    transform: translateY(-8px) !important;
    box-shadow: 0 20px 60px rgba(79, 70, 229, 0.12) !important;
  }

  /* ── Button hover ── */
  .lv2-btn-fill {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease,
                background 0.3s ease;
  }
  .lv2-btn-fill:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 12px 35px rgba(79, 70, 229, 0.35);
  }
  .lv2-btn-outline {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .lv2-btn-outline:hover {
    background: ${C.primary} !important;
    color: ${C.white} !important;
    border-color: ${C.primary} !important;
    transform: translateY(-3px) scale(1.03);
  }

  /* ── Pill hover ── */
  .lv2-pill {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease;
  }
  .lv2-pill:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  }

  /* ── Gradient text ── */
  @keyframes lv2Gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .lv2-gradient-text {
    background: linear-gradient(135deg, ${C.primary}, ${C.pink}, ${C.primary});
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: lv2Gradient 5s ease infinite;
  }

  /* ── Nav ── */
  .lv2-nav {
    transition: background 0.4s ease,
                box-shadow 0.4s ease,
                backdrop-filter 0.4s ease;
  }

  /* ── Curved divider ── */
  .lv2-curve-top {
    position: absolute; top: -1px; left: 0; width: 100%;
    line-height: 0;
  }
  .lv2-curve-bottom {
    position: absolute; bottom: -1px; left: 0; width: 100%;
    line-height: 0;
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .lv2-grid-2 { grid-template-columns: 1fr !important; }
    .lv2-grid-3 { grid-template-columns: 1fr !important; }
    .lv2-grid-4 { grid-template-columns: 1fr 1fr !important; }
    .lv2-hero-h1 { font-size: 48px !important; }
    .lv2-nav-links { display: none !important; }
    .lv2-section { padding-left: 20px !important; padding-right: 20px !important; }
    .lv2-hero-btns { flex-direction: column !important; align-items: center !important; }
    .lv2-hero-btns a { width: 100% !important; max-width: 320px !important; text-align: center !important; }
  }
  @media (max-width: 640px) {
    .lv2-grid-4 { grid-template-columns: 1fr !important; }
    .lv2-hero-h1 { font-size: 36px !important; letter-spacing: -1px !important; }
  }
`;

// ──────────────────────────────────────────────
// Scroll reveal observer
// ──────────────────────────────────────────────
function useRevealObserver() {
  useEffect(() => {
    const targets = document.querySelectorAll('.lv2-reveal, .lv2-reveal-left, .lv2-reveal-right, .lv2-reveal-scale, .lv2-stagger');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
}

// ──────────────────────────────────────────────
// Animated counter
// ──────────────────────────────────────────────
function Counter({ to, suffix = '', duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const steps = 50;
        const inc = to / steps;
        let cur = 0;
        const iv = setInterval(() => {
          cur += inc;
          if (cur >= to) { setVal(to); clearInterval(iv); }
          else setVal(Math.floor(cur));
        }, duration / steps);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ──────────────────────────────────────────────
// Floating shape
// ──────────────────────────────────────────────
function Shape({ children, size, color, top, left, right, bottom, anim = 'lv2Float', delay = 0, opacity = 0.4 }) {
  const dur = anim === 'lv2Spin' ? `${10 + delay * 2}s` : `${4 + delay}s`;
  return (
    <div aria-hidden style={{
      position: 'absolute', top, left, right, bottom,
      width: size, height: size,
      color, fontSize: size,
      opacity,
      animation: `${anim} ${dur} ease-in-out infinite`,
      animationDelay: `${delay}s`,
      pointerEvents: 'none',
      userSelect: 'none',
      zIndex: 0,
      lineHeight: 1,
    }}>
      {children}
    </div>
  );
}

// Shapes as SVG-like rounded divs instead of text characters
function Dot({ size = 16, color = C.pink, ...pos }) {
  return <Shape size={`${size}px`} {...pos}><div style={{ width: size, height: size, borderRadius: '50%', background: color }} /></Shape>;
}
function Star({ size = 28, color = C.green, ...pos }) {
  return <Shape size={`${size}px`} color={color} {...pos}>★</Shape>;
}
function Diamond({ size = 20, color = C.pink, ...pos }) {
  return <Shape size={`${size}px`} color={color} {...pos}>◆</Shape>;
}
function Triangle({ size = 22, color = C.primary, ...pos }) {
  return <Shape size={`${size}px`} color={color} {...pos}>▲</Shape>;
}

// ──────────────────────────────────────────────
// Section wrapper
// ──────────────────────────────────────────────
function Section({ children, bg = 'transparent', style = {}, id, className = '', relative = false }) {
  return (
    <section id={id} className={`lv2-section ${className}`} style={{
      position: relative ? 'relative' : 'static',
      background: bg,
      padding: '80px 48px',
      ...style,
    }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// 1. MARQUEE
// ──────────────────────────────────────────────
function Marquee() {
  const items = [
    { emoji: '⭐', text: '89,000+ Verified Questions' },
    { emoji: '🚀', text: 'Cambridge Exams — 23 April' },
    { emoji: '💜', text: 'SEN Support Available' },
    { emoji: '🌍', text: '16 Languages' },
    { emoji: '📚', text: '30+ Subjects' },
    { emoji: '🎯', text: 'PhD-Level Exam Prep' },
    { emoji: '🧠', text: 'AI That Learns How You Learn' },
    { emoji: '🏫', text: 'Trusted by Schools' },
  ];
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div style={{
      background: C.pink,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '10px 0',
      zIndex: 50,
      position: 'relative',
    }}>
      <div className="lv2-marquee-track">
        {repeated.map((item, i) => (
          <span key={i} style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            fontSize: 13,
            color: C.white,
            marginRight: 48,
            flexShrink: 0,
            letterSpacing: '0.2px',
          }}>
            {item.emoji} {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// 2. NAVBAR
// ──────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className="lv2-nav" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 48px',
      background: scrolled ? 'rgba(240,238,246,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
      boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.06)' : 'none',
    }}>
      {/* Left links */}
      <div className="lv2-nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        {['Study', 'Practice', 'Past Papers', 'SAT Prep'].map((l) => (
          <Link key={l} href={l === 'Study' ? '/study' : l === 'Practice' ? '/drill' : l === 'Past Papers' ? '/past-papers' : '/sat'}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 14,
              fontWeight: 500,
              color: C.textMuted,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = C.primary}
            onMouseLeave={e => e.target.style.color = C.textMuted}
          >{l}</Link>
        ))}
      </div>

      {/* Center logo */}
      <Link href="/" style={{
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 900,
        fontSize: 24,
        color: C.primary,
        letterSpacing: '-0.5px',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
        NewWorldEdu ★
      </Link>

      {/* Right CTA */}
      <Link href="/start" className="lv2-btn-fill" style={{
        background: C.primary,
        color: C.white,
        fontFamily: '"DM Sans", sans-serif',
        fontWeight: 700,
        fontSize: 14,
        padding: '11px 28px',
        borderRadius: 100,
        boxShadow: '0 4px 14px rgba(79,70,229,0.25)',
      }}>
        Start Free →
      </Link>
    </nav>
  );
}

// ──────────────────────────────────────────────
// 3. HERO
// ──────────────────────────────────────────────
function Hero() {
  const line1 = 'Every Child Deserves a';
  const line2 = 'World-Class Tutor.';

  return (
    <Section style={{ padding: '100px 48px 80px', textAlign: 'center', position: 'relative', overflow: 'visible' }} relative>
      {/* Floating shapes */}
      <Star size={38} top="-30px" left="8%" delay={0} opacity={0.5} />
      <Dot size={18} color={C.yellow} top="60px" right="12%" delay={1.5} anim="lv2Pulse" opacity={0.6} />
      <Diamond size={22} color={C.pink} top="220px" left="3%" delay={0.8} anim="lv2Wobble" />
      <Triangle size={20} top="160px" right="5%" delay={2} />
      <Star size={20} color={C.yellow} top="350px" left="6%" delay={1.2} anim="lv2Wobble" opacity={0.5} />
      <Diamond size={28} color={C.green} top="310px" right="8%" delay={0.4} anim="lv2Pulse" />
      <Dot size={14} color={C.purple} top="420px" left="12%" delay={2.2} opacity={0.5} />

      {/* Headline */}
      <h1 className="lv2-hero-h1" style={{
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 900,
        fontSize: 80,
        lineHeight: 1.05,
        letterSpacing: '-3px',
        color: C.text,
        marginBottom: 6,
        position: 'relative',
        zIndex: 1,
      }}>
        {line1.split(' ').map((w, i) => (
          <span key={i} className="lv2-hero-word" style={{ animationDelay: `${i * 0.08}s`, marginRight: 16 }}>{w}</span>
        ))}
      </h1>
      <h1 className="lv2-hero-h1 lv2-gradient-text" style={{
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 900,
        fontSize: 80,
        lineHeight: 1.05,
        letterSpacing: '-3px',
        marginBottom: 32,
        position: 'relative',
        zIndex: 1,
        display: 'inline-block',
      }}>
        {line2.split(' ').map((w, i) => (
          <span key={i} className="lv2-hero-word" style={{ animationDelay: `${(5 + i) * 0.08}s`, marginRight: 16 }}>{w}</span>
        ))}
      </h1>

      {/* Subtext */}
      <p className="lv2-hero-word" style={{
        animationDelay: '0.7s',
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 20,
        color: C.textMuted,
        maxWidth: 500,
        margin: '0 auto 44px',
        lineHeight: 1.7,
        position: 'relative',
        zIndex: 1,
      }}>
        Better grades in 30 days. 24/7 AI tutor that adapts to every child. 16 languages. Every subject.
      </p>

      {/* Buttons */}
      <div className="lv2-hero-btns lv2-hero-word" style={{
        animationDelay: '0.85s',
        display: 'flex',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 52,
        position: 'relative',
        zIndex: 1,
        flexWrap: 'wrap',
      }}>
        <Link href="/start" className="lv2-btn-fill" style={{
          background: C.primary,
          color: C.white,
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 700,
          fontSize: 17,
          padding: '16px 40px',
          borderRadius: 100,
          boxShadow: '0 6px 24px rgba(79,70,229,0.3)',
        }}>
          Meet Starky — Free →
        </Link>
        <a href="#how-it-works" className="lv2-btn-outline" style={{
          color: C.primary,
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 700,
          fontSize: 17,
          padding: '16px 40px',
          borderRadius: 100,
          border: `2px solid ${C.primary}`,
          background: 'transparent',
        }}>
          See how it works
        </a>
      </div>

      {/* Stat pills */}
      <div className="lv2-hero-word lv2-stagger" style={{
        animationDelay: '1s',
        display: 'flex',
        justifyContent: 'center',
        gap: 10,
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 1,
      }}>
        {[
          { i: '📚', l: '89K+ Questions' },
          { i: '🤖', l: '24/7 AI Tutor' },
          { i: '🎯', l: '30+ Subjects' },
          { i: '🌍', l: '16 Languages' },
          { i: '🏫', l: 'KG to A Level' },
        ].map((s) => (
          <div key={s.l} className="lv2-pill" style={{
            background: C.white,
            padding: '8px 20px',
            borderRadius: 100,
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13,
            fontWeight: 600,
            color: C.text,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span style={{ fontSize: 16 }}>{s.i}</span> {s.l}
          </div>
        ))}
      </div>
    </Section>
  );
}

// ──────────────────────────────────────────────
// 4. TRUST ROW
// ──────────────────────────────────────────────
function Trust() {
  return (
    <Section style={{ padding: '32px 48px 48px' }}>
      <div className="lv2-reveal" style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 11,
          fontWeight: 700,
          color: '#B0AEC0',
          textTransform: 'uppercase',
          letterSpacing: 4,
          marginBottom: 20,
        }}>
          Trusted by schools in Pakistan & UAE
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          {['UJALA Centre', 'Garage School', 'Deaf Reach', 'Nixor College'].map((s) => (
            <div key={s} className="lv2-pill" style={{
              background: C.white,
              padding: '10px 26px',
              borderRadius: 100,
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13,
              fontWeight: 600,
              color: C.text,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              border: `1px solid ${C.border}`,
            }}>
              {s}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ──────────────────────────────────────────────
// 5. STATS — big animated numbers
// ──────────────────────────────────────────────
function Stats() {
  const stats = [
    { n: 89359, s: '+', label: 'Verified Questions', color: C.primary, bg: C.purpleBg, icon: '📚' },
    { n: 425, s: 'K+', label: 'Learning Items', color: C.pink, bg: C.pinkBg, icon: '🧠' },
    { n: 376, s: 'K+', label: 'Dictionary Words', color: C.green, bg: C.greenBg, icon: '📖' },
    { n: 16, s: '', label: 'Languages', color: C.yellow, bg: C.yellowBg, icon: '🌍' },
  ];

  return (
    <Section style={{ padding: '60px 48px 70px' }}>
      <div className="lv2-stagger lv2-grid-4" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 18,
      }}>
        {stats.map((s) => (
          <div key={s.label} className="lv2-card" style={{
            background: C.white,
            borderRadius: 24,
            padding: '36px 24px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: s.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 28,
            }}>{s.icon}</div>
            <div style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 900,
              fontSize: 40,
              color: s.color,
              letterSpacing: '-1px',
              lineHeight: 1,
            }}>
              <Counter to={s.n} suffix={s.s} />
            </div>
            <div style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 14,
              fontWeight: 500,
              color: C.textMuted,
              marginTop: 6,
            }}>{s.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ──────────────────────────────────────────────
// 6. HOW IT WORKS
// ──────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Pick your level', desc: 'KG, Primary, O Level, A Level, SAT, SEN — every stage from age 4 to university.', color: C.green },
    { n: '02', title: 'Starky teaches you', desc: 'AI tutor that adapts to how each child learns. Remembers strengths, weak spots, and moods.', color: C.pink },
    { n: '03', title: 'Real past papers', desc: '89,000+ verified Cambridge, Edexcel, SAT questions. Zero AI-generated filler. Bank-first.', color: C.primary },
    { n: '04', title: 'Watch them grow', desc: 'Spaced repetition, mastery tracking, grade predictions, and daily study plans — all automatic.', color: C.yellow },
  ];

  return (
    <Section id="how-it-works" bg={C.white} style={{ padding: '90px 48px', position: 'relative' }} relative>
      {/* Curved top */}
      <div className="lv2-curve-top">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,0 L0,0 Z" fill={C.bg} />
        </svg>
      </div>

      <div className="lv2-reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
        <span style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 12,
          fontWeight: 700,
          color: C.pink,
          textTransform: 'uppercase',
          letterSpacing: 4,
          display: 'block',
          marginBottom: 14,
        }}>How it works</span>
        <h2 style={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 900,
          fontSize: 44,
          color: C.text,
          letterSpacing: '-1.5px',
        }}>
          From zero to exam-ready.
        </h2>
      </div>

      <div className="lv2-stagger lv2-grid-4" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
      }}>
        {steps.map((s) => (
          <div key={s.n} className="lv2-card" style={{
            background: C.bg,
            borderRadius: 24,
            padding: '36px 28px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'none',
          }}>
            {/* Large faded number */}
            <span style={{
              position: 'absolute', top: 14, right: 18,
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 900, fontSize: 56,
              color: s.color, opacity: 0.1,
              lineHeight: 1,
            }}>{s.n}</span>

            <div style={{
              width: 40, height: 5, borderRadius: 3,
              background: s.color, marginBottom: 22,
            }} />
            <h3 style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 800, fontSize: 20,
              color: C.text, marginBottom: 10,
            }}>{s.title}</h3>
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 14, color: C.textMuted,
              lineHeight: 1.65,
            }}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Curved bottom */}
      <div className="lv2-curve-bottom">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z" fill={C.bg} />
        </svg>
      </div>
    </Section>
  );
}

// ──────────────────────────────────────────────
// 7. EXAMINER CARD + FEATURES
// ──────────────────────────────────────────────
function ExaminerSection() {
  const features = [
    { icon: '🧠', title: 'Learns How You Learn', desc: 'Remembers what worked, what didn\'t, and adapts every session.', bg: C.purpleBg },
    { icon: '📝', title: 'Real Exam Questions', desc: '89,000+ verified questions. Cambridge, Edexcel, SAT. No filler.', bg: C.pinkBg },
    { icon: '🌍', title: 'Any Language', desc: 'Study in Urdu, Arabic, Chinese, or 13 other languages.', bg: C.greenBg },
    { icon: '📊', title: 'Exam Compass', desc: 'AI predicts which topics are most likely to appear on your exam.', bg: C.yellowBg },
  ];

  return (
    <Section style={{ padding: '80px 48px' }}>
      <div className="lv2-grid-2" style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: 32,
        alignItems: 'start',
      }}>
        {/* Big card */}
        <div className="lv2-reveal-left lv2-card" style={{
          background: `linear-gradient(145deg, ${C.primary}, #6366f1)`,
          borderRadius: 28,
          padding: '52px 40px',
          color: C.white,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative blobs */}
          <div style={{
            position: 'absolute', top: -50, right: -50,
            width: 180, height: 180, borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }} />
          <div style={{
            position: 'absolute', bottom: -30, left: -30,
            width: 120, height: 120, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }} />

          <span style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.15)',
            padding: '6px 16px',
            borderRadius: 100,
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
            marginBottom: 24,
            backdropFilter: 'blur(4px)',
          }}>THE DIFFERENCE</span>

          <h2 style={{
            fontFamily: '"Nunito", sans-serif',
            fontWeight: 900,
            fontSize: 36,
            lineHeight: 1.15,
            marginBottom: 20,
            position: 'relative',
          }}>
            The examiner<br />inside the tutor.
          </h2>
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 16,
            lineHeight: 1.75,
            opacity: 0.9,
            marginBottom: 32,
            position: 'relative',
            maxWidth: 380,
          }}>
            Starky doesn't just teach — it thinks like a Cambridge examiner.
            Every question from real past papers. Every explanation matches
            the mark scheme.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', position: 'relative' }}>
            {['Cambridge', 'Edexcel', 'SAT', 'SEN', 'MiTE'].map((t) => (
              <span key={t} style={{
                background: 'rgba(255,255,255,0.15)',
                padding: '6px 16px',
                borderRadius: 100,
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 12, fontWeight: 600,
                backdropFilter: 'blur(4px)',
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Feature cards 2x2 */}
        <div className="lv2-reveal-right lv2-grid-2" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}>
          {features.map((f) => (
            <div key={f.title} className="lv2-card" style={{
              background: C.white,
              borderRadius: 22,
              padding: '28px 22px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: f.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, marginBottom: 14,
              }}>{f.icon}</div>
              <h3 style={{
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 800, fontSize: 16,
                color: C.text, marginBottom: 6,
              }}>{f.title}</h3>
              <p style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 13, color: C.textMuted,
                lineHeight: 1.55,
              }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ──────────────────────────────────────────────
// 8. SUBJECTS
// ──────────────────────────────────────────────
function Subjects() {
  const subjects = [
    { n: 'Mathematics', e: '📐', bg: '#EEF2FF' },
    { n: 'Physics', e: '⚡', bg: '#FFF7ED' },
    { n: 'Chemistry', e: '🧪', bg: '#ECFDF5' },
    { n: 'Biology', e: '🧬', bg: '#FDF2F8' },
    { n: 'English', e: '📝', bg: '#EFF6FF' },
    { n: 'Computer Sci', e: '💻', bg: '#F5F3FF' },
    { n: 'Urdu', e: '📖', bg: '#FFFBEB' },
    { n: 'Economics', e: '📊', bg: '#ECFEFF' },
    { n: 'Pak Studies', e: '🇵🇰', bg: '#ECFDF5' },
    { n: 'Islamiyat', e: '☪️', bg: '#FFF7ED' },
    { n: 'Business', e: '💼', bg: '#F7FEE7' },
    { n: 'Accounting', e: '🧮', bg: '#FEF2F2' },
    { n: 'SAT Prep', e: '🎯', bg: '#EDE7F6' },
    { n: 'SEN / SEND', e: '💜', bg: '#F5F3FF' },
    { n: 'Arabic', e: '🌙', bg: '#E0F2F1' },
    { n: '+ 20 more', e: '✨', bg: '#FFFDE7' },
  ];

  return (
    <Section bg={C.white} style={{ padding: '80px 48px', position: 'relative' }} relative>
      <div className="lv2-curve-top">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,0 L0,0 Z" fill={C.bg} />
        </svg>
      </div>

      <div className="lv2-reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
        <span style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 12, fontWeight: 700,
          color: C.green, textTransform: 'uppercase',
          letterSpacing: 4, display: 'block', marginBottom: 14,
        }}>What we cover</span>
        <h2 style={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 900, fontSize: 44,
          color: C.text, letterSpacing: '-1.5px',
        }}>Every subject. Every board.</h2>
      </div>

      <div className="lv2-stagger lv2-grid-4" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
      }}>
        {subjects.map((s) => (
          <div key={s.n} className="lv2-pill" style={{
            background: s.bg,
            borderRadius: 16,
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'default',
          }}>
            <span style={{ fontSize: 22 }}>{s.e}</span>
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 14, fontWeight: 600, color: C.text,
            }}>{s.n}</span>
          </div>
        ))}
      </div>

      <div className="lv2-curve-bottom">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z" fill={C.bg} />
        </svg>
      </div>
    </Section>
  );
}

// ──────────────────────────────────────────────
// 9. GRADES
// ──────────────────────────────────────────────
function Grades() {
  const levels = [
    { l: 'KG', a: '4–5', i: '🌱', c: '#A8E063' },
    { l: 'Primary', a: '5–10', i: '⭐', c: '#FFC300' },
    { l: 'Middle', a: '10–13', i: '🚀', c: '#FF8C69' },
    { l: 'Matric', a: '13–15', i: '📋', c: '#F06292' },
    { l: 'O Level', a: '14–16', i: '📚', c: C.primary },
    { l: 'A Level', a: '16–18', i: '🎓', c: '#7C4DFF' },
    { l: 'SAT', a: '16+', i: '🎯', c: C.pink },
    { l: 'SEN', a: 'All ages', i: '💜', c: '#AB47BC' },
  ];

  return (
    <Section style={{ padding: '80px 48px' }}>
      <div className="lv2-reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
        <span style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 12, fontWeight: 700,
          color: '#F59E0B', textTransform: 'uppercase',
          letterSpacing: 4, display: 'block', marginBottom: 14,
        }}>Complete coverage</span>
        <h2 style={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 900, fontSize: 44,
          color: C.text, letterSpacing: '-1.5px',
        }}>KG to A Level. One platform.</h2>
      </div>

      <div className="lv2-stagger lv2-grid-4" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
      }}>
        {levels.map((l) => (
          <div key={l.l} className="lv2-card" style={{
            background: C.white,
            borderRadius: 22,
            padding: '28px 22px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            borderBottom: `4px solid ${l.c}`,
          }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{l.i}</div>
            <div style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 800, fontSize: 19, color: C.text,
            }}>{l.l}</div>
            <div style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13, color: C.textMuted, marginTop: 4,
            }}>Ages {l.a}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ──────────────────────────────────────────────
// 10. TESTIMONIALS
// ──────────────────────────────────────────────
function Testimonials() {
  const items = [
    {
      q: '"My daughter went from C to A* in Chemistry in 3 months."',
      d: 'Real Cambridge past paper questions with examiner-style mark scheme explanations.',
      tag: 'O Level Parent', c: C.pink,
    },
    {
      q: '"He actually asks to study now. Starky made it fun."',
      d: 'Adaptive difficulty, streaks, and gentle encouragement keep kids engaged.',
      tag: 'KG Parent', c: C.green,
    },
    {
      q: '"Finally, SEN support that understands my child."',
      d: 'PhD-level special needs module with engagement model and effort grading.',
      tag: 'SEN Parent', c: C.primary,
    },
  ];

  return (
    <Section bg={C.white} style={{ padding: '90px 48px', position: 'relative' }} relative>
      <div className="lv2-curve-top">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,0 L0,0 Z" fill={C.bg} />
        </svg>
      </div>

      <div className="lv2-reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
        <span style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 12, fontWeight: 700,
          color: C.primary, textTransform: 'uppercase',
          letterSpacing: 4, display: 'block', marginBottom: 14,
        }}>Why families choose us</span>
        <h2 style={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 900, fontSize: 44,
          color: C.text, letterSpacing: '-1.5px',
        }}>Better than a £40/hr tutor.</h2>
      </div>

      <div className="lv2-stagger lv2-grid-3" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
      }}>
        {items.map((t) => (
          <div key={t.tag} className="lv2-card" style={{
            background: C.bg,
            borderRadius: 24,
            padding: '36px 28px',
            borderTop: `4px solid ${t.c}`,
            boxShadow: 'none',
          }}>
            <p style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 700, fontSize: 18,
              color: C.text, lineHeight: 1.4,
              marginBottom: 14, fontStyle: 'italic',
            }}>{t.q}</p>
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 14, color: C.textMuted,
              lineHeight: 1.65, marginBottom: 20,
            }}>{t.d}</p>
            <span style={{
              background: `${t.c}18`,
              color: t.c,
              padding: '5px 14px',
              borderRadius: 100,
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 12, fontWeight: 700,
            }}>{t.tag}</span>
          </div>
        ))}
      </div>

      <div className="lv2-curve-bottom">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z" fill={C.bg} />
        </svg>
      </div>
    </Section>
  );
}

// ──────────────────────────────────────────────
// 11. CTA BANNER
// ──────────────────────────────────────────────
function CTA() {
  return (
    <Section style={{ padding: '40px 48px 90px' }}>
      <div className="lv2-reveal-scale" style={{
        background: `linear-gradient(135deg, ${C.primary} 0%, #6366f1 40%, ${C.pink} 100%)`,
        backgroundSize: '200% 200%',
        animation: 'lv2Gradient 8s ease infinite',
        borderRadius: 32,
        padding: '72px 48px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative shapes */}
        <div aria-hidden style={{ position: 'absolute', top: 24, left: 48, fontSize: 48, opacity: 0.1, color: C.white }}>★</div>
        <div aria-hidden style={{ position: 'absolute', bottom: 24, right: 48, fontSize: 56, opacity: 0.08, color: C.white }}>◆</div>
        <div aria-hidden style={{ position: 'absolute', top: '50%', left: '8%', fontSize: 32, opacity: 0.08, color: C.white }}>●</div>
        <div aria-hidden style={{ position: 'absolute', top: '30%', right: '10%', fontSize: 28, opacity: 0.1, color: C.white }}>▲</div>

        <h2 style={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 900, fontSize: 42,
          color: C.white, marginBottom: 18,
          letterSpacing: '-1px', position: 'relative',
        }}>Ready to see the difference?</h2>
        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 18, color: 'rgba(255,255,255,0.88)',
          maxWidth: 460, margin: '0 auto 36px',
          lineHeight: 1.65, position: 'relative',
        }}>
          Join thousands of students across Pakistan and UAE. Start free — no credit card needed.
        </p>
        <Link href="/start" className="lv2-btn-fill" style={{
          background: C.white,
          color: C.primary,
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 700, fontSize: 17,
          padding: '17px 44px',
          borderRadius: 100,
          display: 'inline-block',
          position: 'relative',
          boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
        }}>Start Learning — Free →</Link>
      </div>
    </Section>
  );
}

// ──────────────────────────────────────────────
// 12. FOOTER
// ──────────────────────────────────────────────
function Footer() {
  const links = [
    { l: 'Study', h: '/study' },
    { l: 'Practice', h: '/drill' },
    { l: 'Past Papers', h: '/past-papers' },
    { l: 'SAT', h: '/sat' },
    { l: 'SEN', h: '/special-needs' },
    { l: 'Languages', h: '/languages' },
    { l: 'Privacy', h: '/privacy' },
    { l: 'Terms', h: '/terms' },
  ];

  return (
    <footer style={{
      textAlign: 'center',
      padding: '48px 24px',
      background: C.bg,
      borderTop: `1px solid ${C.border}`,
    }}>
      <div style={{
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 900, fontSize: 22,
        color: C.primary, marginBottom: 14,
      }}>NewWorldEdu ★</div>
      <p style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 14, color: C.textMuted,
        marginBottom: 24,
      }}>Every child deserves a world-class tutor.</p>
      <div style={{
        display: 'flex', justifyContent: 'center',
        gap: 24, flexWrap: 'wrap', marginBottom: 24,
      }}>
        {links.map((lk) => (
          <Link key={lk.l} href={lk.h} style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13, color: '#B0AEC0',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = C.primary}
            onMouseLeave={e => e.target.style.color = '#B0AEC0'}
          >{lk.l}</Link>
        ))}
      </div>
      <p style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 12, color: '#D0CFD8',
      }}>© {new Date().getFullYear()} NewWorldEdu. All rights reserved.</p>
    </footer>
  );
}

// ──────────────────────────────────────────────
// Background shapes (full page)
// ──────────────────────────────────────────────
function BgShapes() {
  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <Star size={44} color={C.green} top="10%" left="2%" delay={0} opacity={0.3} />
      <Diamond size={30} color={C.pink} top="20%" right="3%" delay={1.2} anim="lv2Wobble" opacity={0.3} />
      <Dot size={20} color={C.yellow} top="35%" left="4%" delay={0.6} anim="lv2Pulse" opacity={0.35} />
      <Triangle size={26} top="45%" right="4%" delay={2} opacity={0.25} />
      <Star size={20} color={C.pink} top="55%" left="3%" delay={1.8} anim="lv2Wobble" opacity={0.3} />
      <Diamond size={34} color={C.green} top="65%" right="5%" delay={0.3} anim="lv2Pulse" opacity={0.25} />
      <Dot size={16} color={C.purple} top="75%" left="5%" delay={1} opacity={0.3} />
      <Triangle size={22} color={C.yellow} top="85%" right="3%" delay={0.9} anim="lv2Wobble" opacity={0.25} />
    </div>
  );
}

// ══════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════
export default function LandingV2() {
  useRevealObserver();

  return (
    <div className="lv2">
      <Head>
        <title>NewWorldEdu — Every Child Deserves a World-Class Tutor</title>
        <meta name="description" content="89,000+ verified Cambridge questions. 24/7 AI tutor in 16 languages. Better grades in 30 days." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <BgShapes />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Marquee />
        <Nav />
        <Hero />
        <Trust />
        <Stats />
        <HowItWorks />
        <ExaminerSection />
        <Subjects />
        <Grades />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
