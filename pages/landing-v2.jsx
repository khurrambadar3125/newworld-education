import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

/*
 * landing-v2.jsx
 * LESA-style full-screen hero carousel + all homepage content below
 * Scroll-triggered animations, LESA layout patterns, NewWorldEdu content
 */

const C = {
  bg: '#0f0f1a',
  bgLight: '#181828',
  bgCard: '#1e1e32',
  primary: '#4F8EF7',
  green: '#34D399',
  pink: '#F472B6',
  yellow: '#FBBF24',
  purple: '#A78BFA',
  white: '#FFFFFF',
  text: '#e8e8f0',
  muted: '#9090a8',
  border: 'rgba(255,255,255,0.08)',
};

const SLIDES = [
  {
    bg: 'linear-gradient(135deg, #4F46E5 0%, #6366f1 100%)',
    big: 'STARKY',
    tagline: 'The world\'s smartest AI tutor for every child',
    emojis: ['📚','⭐','🧠','✏️','🎯','💡','🌟'],
  },
  {
    bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    big: '89,000+',
    tagline: 'Verified Cambridge, Edexcel & SAT questions — zero AI filler',
    emojis: ['📝','🎓','📊','🏆','📖','🔬','✅'],
  },
  {
    bg: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
    tagline: 'KG to A Level. 30+ subjects. 16 languages. One platform.',
    big: 'LEARN',
    dark: true,
    emojis: ['🌍','🚀','💜','🧪','📐','🎵','🌱'],
  },
  {
    bg: 'linear-gradient(135deg, #0f0f2e 0%, #1a1a3e 100%)',
    big: 'GROW',
    tagline: 'Better grades in 30 days. Trusted by schools in Pakistan & UAE.',
    emojis: ['🏫','👨‍👩‍👧','📈','💪','🌱','🎯','⭐'],
  },
];

const SLIDE_MS = 5000;

const CSS = `
  *{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  .lp{font-family:'Nunito',sans-serif;background:${C.bg};color:${C.text};-webkit-font-smoothing:antialiased;color-scheme:dark!important;overflow-x:hidden}
  .lp a{text-decoration:none;color:inherit}

  /* Marquee */
  @keyframes lpMarq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  .lp-marq-track{display:flex;animation:lpMarq 50s linear infinite;will-change:transform}
  .lp-marq-track:hover{animation-play-state:paused}

  /* Slide animations */
  @keyframes lpBigIn{0%{opacity:0;transform:scale(.82) translateY(50px)}100%{opacity:1;transform:scale(1) translateY(0)}}
  @keyframes lpTagIn{0%{opacity:0;transform:translateY(24px)}100%{opacity:1;transform:translateY(0)}}
  @keyframes lpFloat{0%,100%{transform:translateY(0) rotate(0)}33%{transform:translateY(-18px) rotate(6deg)}66%{transform:translateY(-8px) rotate(-4deg)}}
  @keyframes lpPulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.2);opacity:.7}}
  @keyframes lpProgress{0%{width:0}100%{width:100%}}
  .lp-slide-bg{transition:opacity .8s cubic-bezier(.22,1,.36,1)}

  /* Sidebar vertical text */
  .lp-vert{writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg)}

  /* Scroll reveal */
  .lp-r{opacity:0;transform:translateY(50px);transition:opacity .85s cubic-bezier(.22,1,.36,1),transform .85s cubic-bezier(.22,1,.36,1)}
  .lp-r.vis{opacity:1;transform:translateY(0)}
  .lp-rl{opacity:0;transform:translateX(-50px);transition:opacity .85s cubic-bezier(.22,1,.36,1),transform .85s cubic-bezier(.22,1,.36,1)}
  .lp-rl.vis{opacity:1;transform:translateX(0)}
  .lp-rr{opacity:0;transform:translateX(50px);transition:opacity .85s cubic-bezier(.22,1,.36,1),transform .85s cubic-bezier(.22,1,.36,1)}
  .lp-rr.vis{opacity:1;transform:translateX(0)}

  /* Stagger children */
  .lp-stag>*{opacity:0;transform:translateY(36px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
  .lp-stag.vis>*:nth-child(1){transition-delay:0s;opacity:1;transform:translateY(0)}
  .lp-stag.vis>*:nth-child(2){transition-delay:.07s;opacity:1;transform:translateY(0)}
  .lp-stag.vis>*:nth-child(3){transition-delay:.14s;opacity:1;transform:translateY(0)}
  .lp-stag.vis>*:nth-child(4){transition-delay:.21s;opacity:1;transform:translateY(0)}
  .lp-stag.vis>*:nth-child(5){transition-delay:.28s;opacity:1;transform:translateY(0)}
  .lp-stag.vis>*:nth-child(6){transition-delay:.35s;opacity:1;transform:translateY(0)}
  .lp-stag.vis>*:nth-child(7){transition-delay:.42s;opacity:1;transform:translateY(0)}
  .lp-stag.vis>*:nth-child(8){transition-delay:.49s;opacity:1;transform:translateY(0)}

  /* Card hover */
  .lp-card{transition:transform .4s cubic-bezier(.34,1.56,.64,1),box-shadow .4s ease,border-color .3s ease}
  .lp-card:hover{transform:translateY(-6px)!important;box-shadow:0 16px 48px rgba(79,142,247,.12)!important;border-color:rgba(79,142,247,.25)!important}

  /* Button */
  .lp-btn{transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s ease}
  .lp-btn:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 10px 30px rgba(79,142,247,.3)}

  /* Responsive */
  @media(max-width:900px){
    .lp-sidebar{display:none!important}
    .lp-big{font-size:22vw!important}
    .lp-bot-tag{display:none!important}
    .lp-g2{grid-template-columns:1fr!important}
    .lp-g3{grid-template-columns:1fr!important}
    .lp-g4{grid-template-columns:1fr 1fr!important}
    .lp-sec{padding:56px 20px!important}
    .lp-hero-btns{flex-direction:column!important;align-items:stretch!important}
  }
  @media(max-width:640px){
    .lp-g4{grid-template-columns:1fr!important}
    .lp-big{font-size:18vw!important}
  }
`;

// ─── Scroll reveal hook ───
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.lp-r,.lp-rl,.lp-rr,.lp-stag').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── Section wrapper ───
function Sec({ children, id, bg, style = {} }) {
  return (
    <section id={id} className="lp-sec" style={{ padding: '80px 48px', background: bg || 'transparent', position: 'relative', ...style }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>{children}</div>
    </section>
  );
}

// ─── Section header ───
function SH({ label, labelColor, title, light }) {
  return (
    <div className="lp-r" style={{ textAlign: 'center', marginBottom: 52 }}>
      {label && <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 12, fontWeight: 700, color: labelColor || C.primary, textTransform: 'uppercase', letterSpacing: 4, display: 'block', marginBottom: 14 }}>{label}</span>}
      <h2 style={{ fontFamily: '"Nunito",sans-serif', fontWeight: 900, fontSize: 'clamp(28px,4vw,42px)', color: light ? C.bg : C.white, letterSpacing: '-1px', lineHeight: 1.2 }}>{title}</h2>
    </div>
  );
}

// ═══════════════════════════════════════
// HERO CAROUSEL (LESA-style)
// ═══════════════════════════════════════
function HeroCarousel() {
  const [cur, setCur] = useState(0);
  const timer = useRef(null);
  const total = SLIDES.length;

  const goTo = useCallback((i) => {
    setCur(i);
    clearInterval(timer.current);
    timer.current = setInterval(() => setCur(p => (p + 1) % total), SLIDE_MS);
  }, [total]);

  useEffect(() => {
    timer.current = setInterval(() => setCur(p => (p + 1) % total), SLIDE_MS);
    return () => clearInterval(timer.current);
  }, [total]);

  const slide = SLIDES[cur];
  const dark = slide.dark;
  const tc = dark ? '#1a1a2e' : '#fff';

  // Emoji positions (scattered)
  const ePos = [
    { x: '12%', y: '22%' }, { x: '82%', y: '18%' }, { x: '8%', y: '62%' },
    { x: '88%', y: '58%' }, { x: '50%', y: '15%' }, { x: '28%', y: '72%' },
    { x: '72%', y: '72%' },
  ];

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* Marquee */}
      <div style={{ background: '#FBBF24', overflow: 'hidden', whiteSpace: 'nowrap', padding: '9px 0', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 200 }}>
        <div className="lp-marq-track">
          {[...Array(4)].flatMap(() => [
            { e: '🎉', t: '89,000+ verified questions and growing!' },
            { e: '📚', t: 'Start learning for free today!' },
            { e: '⭐', t: 'Cambridge exams start 23 April' },
            { e: '🌍', t: '16 languages. 30+ subjects.' },
            { e: '💜', t: 'SEN support for every child' },
            { e: '🚀', t: 'Better grades in 30 days!' },
          ]).map((m, i) => (
            <span key={i} style={{ fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 13, color: '#1a1a2e', marginRight: 52, flexShrink: 0 }}>{m.e}  {m.t}</span>
          ))}
        </div>
      </div>

      {/* Background layers */}
      {SLIDES.map((s, i) => (
        <div key={i} className="lp-slide-bg" style={{ position: 'absolute', inset: 0, background: s.bg, opacity: i === cur ? 1 : 0, zIndex: 0 }} />
      ))}

      {/* Sidebar */}
      <div className="lp-sidebar" style={{ position: 'absolute', left: 0, top: 36, bottom: 0, width: 52, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '44px 0 76px', zIndex: 50 }}>
        <button aria-label="Menu" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[0, 1, 2].map(i => <div key={i} style={{ width: 20, height: 2.5, background: tc, borderRadius: 2, transition: 'background .5s' }} />)}
        </button>
        <div className="lp-vert" style={{ fontFamily: '"Nunito",sans-serif', fontWeight: 900, fontSize: 14, letterSpacing: 5, color: tc, transition: 'color .5s', userSelect: 'none' }}>NEWWORLDEDU</div>
      </div>

      {/* Slide content */}
      {SLIDES.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: i === cur ? 1 : 0, transform: i === cur ? 'scale(1)' : 'scale(.94)',
          transition: 'opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)',
          pointerEvents: i === cur ? 'auto' : 'none', zIndex: i === cur ? 5 : 1,
        }}>
          {/* Floating emojis */}
          {s.emojis.map((em, j) => (
            <div key={j} style={{
              position: 'absolute', left: ePos[j]?.x, top: ePos[j]?.y,
              fontSize: 36 + (j % 3) * 8, zIndex: 2,
              animation: `lpFloat ${3.5 + j * .4}s ease-in-out infinite`,
              animationDelay: `${j * .3}s`,
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,.2))',
              pointerEvents: 'none',
            }}>{em}</div>
          ))}

          {/* Confetti dots */}
          {['#F472B6', '#34D399', '#FBBF24', '#A78BFA', '#fff', '#FF6B6B', '#4F8EF7', '#FBBF24'].map((col, j) => {
            const ps = [{ x: '18%', y: '38%' }, { x: '85%', y: '42%' }, { x: '32%', y: '78%' }, { x: '68%', y: '82%' }, { x: '45%', y: '12%' }, { x: '55%', y: '88%' }, { x: '10%', y: '50%' }, { x: '90%', y: '55%' }];
            return <div key={j} style={{ position: 'absolute', left: ps[j].x, top: ps[j].y, width: 6 + j % 3 * 3, height: 6 + j % 3 * 3, borderRadius: j % 2 === 0 ? '50%' : '2px', background: col, opacity: .45, animation: `lpPulse ${2 + j * .3}s ease-in-out infinite`, animationDelay: `${j * .25}s`, pointerEvents: 'none', transform: j % 3 === 2 ? 'rotate(45deg)' : 'none' }} />;
          })}

          {/* Big text */}
          <h1 className="lp-big" style={{
            fontFamily: '"Nunito",sans-serif', fontWeight: 900, fontSize: 'min(17vw, 200px)',
            color: s.dark ? '#1a1a2e' : '#fff', opacity: .95, letterSpacing: -4, lineHeight: .95,
            textAlign: 'center', userSelect: 'none', position: 'relative', zIndex: 3,
            textShadow: s.dark ? 'none' : '0 4px 40px rgba(0,0,0,.12)',
            animation: i === cur ? 'lpBigIn .9s cubic-bezier(.22,1,.36,1) forwards' : 'none',
          }}>{s.big}</h1>
        </div>
      ))}

      {/* Progress bars */}
      <div style={{ position: 'absolute', bottom: 62, left: 76, right: 76, display: 'flex', gap: 10, zIndex: 100 }}>
        {SLIDES.map((s, i) => (
          <div key={i} onClick={() => goTo(i)} style={{ flex: 1, height: 3, background: `${dark ? '#1a1a2e' : '#fff'}30`, borderRadius: 2, overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ height: '100%', background: dark ? '#1a1a2e' : '#fff', borderRadius: 2, width: i < cur ? '100%' : '0%', animation: i === cur ? `lpProgress ${SLIDE_MS}ms linear forwards` : 'none' }} />
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="lp-bot" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 48px 14px 76px', zIndex: 100 }}>
        <Link href="/contact" className="lp-btn" style={{ background: dark ? '#1a1a2e' : '#fff', color: dark ? '#FBBF24' : C.primary, fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 14, padding: '12px 28px', borderRadius: 100 }}>Get in touch</Link>
        <p className="lp-bot-tag" style={{ fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 'clamp(14px,2vw,20px)', color: dark ? '#1a1a2e' : '#fff', textAlign: 'center', flex: 1, padding: '0 20px', transition: 'color .5s', lineHeight: 1.3, animation: `lpTagIn .6s .3s cubic-bezier(.22,1,.36,1) both` }}>{slide.tagline}</p>
        <Link href="/start" className="lp-btn" style={{ background: dark ? '#1a1a2e' : '#fff', color: dark ? '#FBBF24' : C.primary, fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 14, padding: '12px 28px', borderRadius: 100 }}>Start free →</Link>
      </div>

      {/* Scroll hint */}
      <div style={{ position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)', zIndex: 100, opacity: .5, animation: 'lpFloat 2s ease-in-out infinite' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke={dark ? '#1a1a2e' : '#fff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// WHY STARKY
// ═══════════════════════════════════════
function WhyStarky() {
  const cards = [
    { icon: '🎙️', title: 'Voice Enabled', desc: 'Speak to Starky and hear responses out loud' },
    { icon: '📧', title: 'Parent Reports', desc: 'Email after every session with progress & next steps' },
    { icon: '🌍', title: '16 Languages', desc: 'Urdu, Arabic, English, Chinese — auto-detected' },
    { icon: '🎯', title: 'Knows where you lose marks', desc: 'Starky tracks every Cambridge mark scheme point you miss — and fixes it session by session' },
    { icon: '📅', title: 'Study plan for your exam', desc: 'Tell Starky your exam date. It builds a week-by-week plan that fixes your weak spots' },
    { icon: '🔮', title: 'Predicts mark loss', desc: 'If 87% with your profile lose marks on a topic — Starky tells you first' },
    { icon: '📆', title: 'Knows where you are', desc: 'Switches between foundation, exam prep, and results support — the right help at the right time' },
  ];

  return (
    <Sec>
      <SH label="Why Starky" title="Built to actually help your child" />
      <div className="lp-stag lp-g4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {cards.map(c => (
          <div key={c.title} className="lp-card" style={{ background: C.bgCard, borderRadius: 20, padding: '28px 22px', border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>{c.icon}</div>
            <h3 style={{ fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 16, color: C.white, marginBottom: 8, lineHeight: 1.3 }}>{c.title}</h3>
            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </Sec>
  );
}

// ═══════════════════════════════════════
// EXAMINER SECTION
// ═══════════════════════════════════════
function Examiner() {
  return (
    <Sec bg={C.bgLight}>
      <div className="lp-r" style={{ maxWidth: 720 }}>
        <h2 style={{ fontFamily: '"Nunito",sans-serif', fontWeight: 900, fontSize: 'clamp(30px,4.5vw,48px)', color: C.primary, lineHeight: 1.15, marginBottom: 24, letterSpacing: '-1px' }}>The examiner inside the tutor.</h2>
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 17, color: C.muted, lineHeight: 1.8 }}>Most tutors teach the subject. Starky teaches the mark scheme. 89,000+ verified questions. Every answer from the official mark scheme. Starky knows exactly what loses marks — and tells you what to write instead. From session one.</p>
      </div>
    </Sec>
  );
}

// ═══════════════════════════════════════
// DEVICES
// ═══════════════════════════════════════
function Devices() {
  return (
    <Sec>
      <SH title="Starky is always with you." />
      <p className="lp-r" style={{ textAlign: 'center', fontFamily: '"DM Sans",sans-serif', fontSize: 17, color: C.muted, maxWidth: 560, margin: '-32px auto 48px', lineHeight: 1.7 }}>Phone, tablet, or computer — your sessions, your progress, your history. Always in sync.</p>
      <div className="lp-stag lp-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {[
          { icon: '📱', name: 'Mobile', desc: 'Most students study on their phone. Starky is built for it.' },
          { icon: '💻', name: 'Desktop', desc: 'Deep study sessions on your laptop. Full screen, full focus.' },
          { icon: '📟', name: 'Tablet', desc: 'Read, write and learn. Starky works perfectly on your iPad.' },
        ].map(d => (
          <div key={d.name} className="lp-card" style={{ background: C.bgCard, borderRadius: 20, padding: '36px 28px', textAlign: 'center', border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{d.icon}</div>
            <h3 style={{ fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 20, color: C.white, marginBottom: 8 }}>{d.name}</h3>
            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{d.desc}</p>
          </div>
        ))}
      </div>
      <p className="lp-r" style={{ textAlign: 'center', fontFamily: '"DM Sans",sans-serif', fontSize: 14, color: C.muted, marginTop: 32, opacity: .7 }}>No app to download. Open your browser. Start learning.</p>
    </Sec>
  );
}

// ═══════════════════════════════════════
// HOW IT WORKS
// ═══════════════════════════════════════
function HowItWorks() {
  const steps = [
    { n: '1', title: 'Pick grade & subject', desc: 'KG to A Level. Every Cambridge and Matric subject.', color: C.primary },
    { n: '2', title: 'Chat or photograph', desc: 'Type your question, send a photo of your homework, or ask Starky to quiz you.', color: C.green },
    { n: '3', title: 'Learn step by step', desc: 'Starky guides you to the answer like a private tutor. Parents get a report after every session.', color: C.yellow },
  ];

  return (
    <Sec bg={C.bgLight}>
      <SH label="How Starky Works" labelColor={C.green} title="3 Simple Steps" />
      <div className="lp-stag lp-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {steps.map(s => (
          <div key={s.n} className="lp-card" style={{ background: C.bgCard, borderRadius: 20, padding: '36px 28px', textAlign: 'center', border: `1px solid ${C.border}` }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontFamily: '"Nunito",sans-serif', fontWeight: 900, fontSize: 24, color: s.color }}>{s.n}</div>
            <h3 style={{ fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 19, color: C.white, marginBottom: 10 }}>{s.title}</h3>
            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 14, color: C.muted, lineHeight: 1.65 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </Sec>
  );
}

// ═══════════════════════════════════════
// FOR PARENTS
// ═══════════════════════════════════════
function ForParents() {
  const cards = [
    { icon: '📋', title: 'Set Assignments', desc: 'Tell Starky what your child should study. They see it when they open the app — from any device.' },
    { icon: '📊', title: 'Track Progress', desc: 'See weak topics, recent mistakes, and session summaries. Know exactly where your child needs help.' },
    { icon: '💬', title: 'Send Feedback', desc: '"Great work on Chemistry! Focus on equations next." — messages your child sees next session.' },
    { icon: '📧', title: 'Session Reports', desc: 'Get an email after every study session with accuracy, strengths, weak areas, and what to practise next.' },
    { icon: '🎓', title: 'Teach with Starky', desc: 'Ask "How do I teach my daughter osmosis?" and get a step-by-step guide with mark scheme tips.' },
    { icon: '📱', title: 'Works Remotely', desc: 'You at the office, your child at home. Set assignments, check progress — all cross-device.' },
  ];

  return (
    <Sec>
      <SH label="For Parents" labelColor={C.pink} title="Stay involved in your child's education — even remotely" />
      <div className="lp-stag lp-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {cards.map(c => (
          <div key={c.title} className="lp-card" style={{ background: C.bgCard, borderRadius: 20, padding: '28px 22px', border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{c.icon}</div>
            <h3 style={{ fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 16, color: C.white, marginBottom: 8 }}>{c.title}</h3>
            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{c.desc}</p>
          </div>
        ))}
      </div>
      <div className="lp-r" style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 40, flexWrap: 'wrap' }}>
        <Link href="/parent" className="lp-btn" style={{ background: C.green, color: '#fff', fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 16, padding: '15px 36px', borderRadius: 100 }}>Open Parent Portal →</Link>
        <Link href="/special-needs" className="lp-btn" style={{ background: C.purple, color: '#fff', fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 16, padding: '15px 36px', borderRadius: 100 }}>💜 SEN Parent — Register Your Child</Link>
      </div>
    </Sec>
  );
}

// ═══════════════════════════════════════
// FOR TEACHERS
// ═══════════════════════════════════════
function ForTeachers() {
  const cards = [
    { icon: '📊', title: 'Student Overview', desc: 'See all your students in one place — who is active, who needs attention, who is improving.' },
    { icon: '⚠️', title: 'Weak Topic Alerts', desc: 'Instantly spot which students are struggling and on which topics. No more guessing.' },
    { icon: '❌', title: 'Mistake Tracking', desc: 'See the exact mistakes each student keeps making — with descriptions from Starky\'s analysis.' },
    { icon: '📈', title: 'Session Activity', desc: 'Track total sessions, last active date, current subject, and engagement for every student.' },
  ];

  return (
    <Sec bg={C.bgLight}>
      <SH label="For Teachers" labelColor={C.yellow} title="See every student's progress in one dashboard" />
      <div className="lp-stag lp-g4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {cards.map(c => (
          <div key={c.title} className="lp-card" style={{ background: C.bgCard, borderRadius: 20, padding: '28px 22px', border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{c.icon}</div>
            <h3 style={{ fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 16, color: C.white, marginBottom: 8 }}>{c.title}</h3>
            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{c.desc}</p>
          </div>
        ))}
      </div>
      <div className="lp-r" style={{ textAlign: 'center', marginTop: 36 }}>
        <Link href="/school" className="lp-btn" style={{ background: C.primary, color: '#fff', fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 16, padding: '15px 36px', borderRadius: 100, display: 'inline-block' }}>Open Teacher Dashboard →</Link>
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: C.muted, marginTop: 16 }}>Want Starky for your whole school? <Link href="/school" style={{ color: C.primary, fontWeight: 600 }}>See school plans →</Link></p>
      </div>
    </Sec>
  );
}

// ═══════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════
function Testimonials() {
  const reviews = [
    { q: '"My daughter used to dread Maths. After two weeks with Starky she looks forward to it. The session reports are incredible — I finally know what she\'s learning."', name: 'Fatima A.', loc: 'Parent, Karachi' },
    { q: '"Starky knew exactly what the O Level examiner wants. My son went from C to B in Physics in one month. Absolutely worth it."', name: 'Omar R.', loc: 'Parent, Dubai' },
    { q: '"میری بیٹی اب خود سے Starky سے پڑھتی ہے۔ پہلے ٹیوشن سے بھاگتی تھی۔ اب خود مانگتی ہے۔"', name: 'Nadia K.', loc: 'والدہ، لاہور' },
    { q: '"I was skeptical at first. But the session reports showed me exactly what he learned. After one month, his teacher noticed the improvement."', name: 'Bilal S.', loc: 'Parent, Islamabad' },
  ];

  return (
    <Sec>
      <SH label="What parents say" labelColor={C.pink} title="" />
      <div className="lp-stag" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 700, margin: '0 auto' }}>
        {reviews.map(r => (
          <div key={r.name} className="lp-card" style={{ background: C.bgCard, borderRadius: 20, padding: '32px 32px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
            <div style={{ color: '#FBBF24', fontSize: 18, marginBottom: 16, letterSpacing: 4 }}>★★★★★</div>
            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 16, color: '#c8c8d8', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 16, direction: r.name === 'Nadia K.' ? 'rtl' : 'ltr' }}>{r.q}</p>
            <p style={{ fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 14, color: C.white }}>{r.name} <span style={{ fontWeight: 500, color: C.muted }}>— {r.loc}</span></p>
          </div>
        ))}
      </div>
    </Sec>
  );
}

// ═══════════════════════════════════════
// SEN
// ═══════════════════════════════════════
function SEN() {
  return (
    <Sec bg={C.bgLight} style={{ textAlign: 'center' }}>
      <div className="lp-r">
        <div style={{ fontSize: 52, marginBottom: 16 }}>💜</div>
        <h2 style={{ fontFamily: '"Nunito",sans-serif', fontWeight: 900, fontSize: 32, color: C.white, marginBottom: 14 }}>Special Needs Support</h2>
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 16, color: C.muted, maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.7 }}>Dedicated mode for students with autism, ADHD, dyslexia, and Down syndrome — adapted pacing, unlimited patience.</p>
        <Link href="/special-needs" className="lp-btn" style={{ background: C.purple, color: '#fff', fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 16, padding: '15px 36px', borderRadius: 100, display: 'inline-block' }}>Learn About SEN Support →</Link>
      </div>
    </Sec>
  );
}

// ═══════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════
function Footer() {
  const flinks = [
    { e: '📖', l: "Today's Plan", h: '/learn' },
    { e: '🍎', l: 'Become Newton', h: '/become-newton' },
    { e: '🎯', l: 'Entrance Tests', h: '/entrance-tests' },
    { e: '⚡', l: 'Practice Drill', h: '/drill' },
    { e: '📝', l: 'Mock Exams', h: '/mocks' },
    { e: '🏆', l: 'Daily Challenge', h: '/daily-challenge' },
    { e: '🧭', l: 'Exam Compass', h: '/exam-compass' },
    { e: '🎓', l: 'SAT Prep', h: '/sat' },
    { e: '📚', l: 'Past Papers', h: '/past-papers' },
    { e: '💜', l: 'Special Needs', h: '/special-needs' },
    { e: '👨‍👩‍👧', l: 'Parents', h: '/parent' },
  ];
  const flinks2 = [
    { e: '🏫', l: 'School Partnerships', h: '/partner' },
    { e: '💳', l: 'Pricing', h: '/pricing' },
    { e: '📬', l: 'Daily Questions', h: '/subscribe' },
  ];

  return (
    <footer style={{ background: C.bg, borderTop: `1px solid ${C.border}`, padding: '56px 24px 32px', textAlign: 'center' }}>
      <div style={{ fontFamily: '"Nunito",sans-serif', fontWeight: 900, fontSize: 22, color: C.primary, marginBottom: 8 }}>NewWorldEdu★</div>
      <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 14, color: C.muted, marginBottom: 28 }}>Every child deserves a world-class tutor.</p>

      {/* Referral banner */}
      <Link href="/championship" className="lp-btn" style={{ background: C.green, color: '#fff', fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 100, display: 'inline-block', marginBottom: 32 }}>🏆 Refer Friends — Win Meta Ray-Ban + Free Months</Link>

      {/* Nav links */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
        {flinks.map(f => (
          <Link key={f.l} href={f.h} style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: C.muted, transition: 'color .2s' }} onMouseEnter={e => e.target.style.color = C.primary} onMouseLeave={e => e.target.style.color = C.muted}>{f.e} {f.l}</Link>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
        {flinks2.map(f => (
          <Link key={f.l} href={f.h} style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: C.muted, transition: 'color .2s' }} onMouseEnter={e => e.target.style.color = C.primary} onMouseLeave={e => e.target.style.color = C.muted}>{f.e} {f.l}</Link>
        ))}
      </div>

      {/* Bottom links */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 20 }}>
        <Link href="/championship" style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: C.green, fontWeight: 600 }}>🏆 Refer & Win — Championship + Free Months</Link>
        <Link href="/privacy" style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: C.muted }}>Privacy Policy</Link>
        <Link href="/terms" style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: C.muted }}>Terms of Service</Link>
      </div>

      {/* Country flags */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
        <span style={{ background: C.bgCard, padding: '8px 20px', borderRadius: 100, fontFamily: '"DM Sans",sans-serif', fontSize: 13, fontWeight: 600, color: C.white, border: `1px solid ${C.border}` }}>🇵🇰 Pakistan</span>
        <span style={{ background: C.bgCard, padding: '8px 20px', borderRadius: 100, fontFamily: '"DM Sans",sans-serif', fontSize: 13, fontWeight: 600, color: C.white, border: `1px solid ${C.border}` }}>🇦🇪 UAE</span>
      </div>

      <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 12, color: '#555' }}>© 2026 NewWorldEdu · khurram@newworld.education</p>
    </footer>
  );
}

// ══════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════
export default function LandingV2() {
  useReveal();

  return (
    <div className="lp">
      <Head>
        <title>NewWorldEdu — Every Child Deserves a World-Class Tutor</title>
        <meta name="description" content="89,000+ verified Cambridge questions. 24/7 AI tutor in 16 languages. Better grades in 30 days." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </Head>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <HeroCarousel />
      <WhyStarky />
      <Examiner />
      <Devices />
      <HowItWorks />
      <ForParents />
      <ForTeachers />
      <Testimonials />
      <SEN />
      <Footer />
    </div>
  );
}
