import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

/*
 * HeroCarousel.jsx — LESA-style full-screen hero carousel
 * 4 slides with auto-advance, floating emojis, progress bars, bottom bar
 * Import into any page: <HeroCarousel />
 */

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
    big: 'LEARN',
    tagline: 'KG to A Level. 30+ subjects. 16 languages. One platform.',
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

const EMOJI_POS = [
  { x: '12%', y: '22%' }, { x: '82%', y: '18%' }, { x: '8%', y: '62%' },
  { x: '88%', y: '58%' }, { x: '50%', y: '15%' }, { x: '28%', y: '72%' },
  { x: '72%', y: '72%' },
];

const CONFETTI = [
  { x: '18%', y: '38%', c: '#F472B6' }, { x: '85%', y: '42%', c: '#34D399' },
  { x: '32%', y: '78%', c: '#FBBF24' }, { x: '68%', y: '82%', c: '#A78BFA' },
  { x: '45%', y: '12%', c: '#fff' }, { x: '55%', y: '88%', c: '#FF6B6B' },
  { x: '10%', y: '50%', c: '#4F8EF7' }, { x: '90%', y: '55%', c: '#FBBF24' },
];

export default function HeroCarousel() {
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
  const dk = slide.dark;
  const tc = dk ? '#1a1a2e' : '#fff';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes hcMarq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes hcBigIn{0%{opacity:0;transform:scale(.82) translateY(50px)}100%{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes hcTagIn{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes hcFloat{0%,100%{transform:translateY(0) rotate(0)}33%{transform:translateY(-18px) rotate(6deg)}66%{transform:translateY(-8px) rotate(-4deg)}}
        @keyframes hcPulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.2);opacity:.7}}
        @keyframes hcProg{0%{width:0}100%{width:100%}}
        .hc-slide-bg{transition:opacity .8s cubic-bezier(.22,1,.36,1)}
        .hc-vert{writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg)}
        .hc-btn{transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s ease}
        .hc-btn:hover{transform:translateY(-2px) scale(1.03)}
        .hc-marq-track{display:flex;animation:hcMarq 50s linear infinite;will-change:transform}
        .hc-marq-track:hover{animation-play-state:paused}
        @media(max-width:768px){
          .hc-sidebar{display:none!important}
          .hc-big{font-size:18vw!important}
          .hc-bot-tag{display:none!important}
          .hc-prog-row{padding:0 16px!important;left:16px!important;right:16px!important}
          .hc-bot{padding:12px 16px!important}
        }
      `}} />

      <div style={{ position: 'relative', height: '70vh', minHeight: 480, width: '100%', overflow: 'hidden' }}>
        {/* Yellow marquee */}
        <div style={{ background: '#FBBF24', overflow: 'hidden', whiteSpace: 'nowrap', padding: '9px 0', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 200 }}>
          <div className="hc-marq-track">
            {[...Array(4)].flatMap(() => [
              { e: '🎉', t: '89,000+ verified questions and growing!' },
              { e: '📚', t: 'Start learning for free today!' },
              { e: '⭐', t: 'Cambridge exams start 23 April' },
              { e: '🌍', t: '16 languages. 30+ subjects.' },
              { e: '💜', t: 'SEN support for every child' },
              { e: '🚀', t: 'Better grades in 30 days!' },
            ]).map((m, i) => (
              <span key={i} style={{ fontFamily: "'Sora','Nunito',sans-serif", fontWeight: 800, fontSize: 13, color: '#1a1a2e', marginRight: 52, flexShrink: 0 }}>{m.e}  {m.t}</span>
            ))}
          </div>
        </div>

        {/* BG layers */}
        {SLIDES.map((s, i) => (
          <div key={i} className="hc-slide-bg" style={{ position: 'absolute', inset: 0, background: s.bg, opacity: i === cur ? 1 : 0, zIndex: 0 }} />
        ))}

        {/* Left sidebar */}
        <div className="hc-sidebar" style={{ position: 'absolute', left: 0, top: 36, bottom: 0, width: 52, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '44px 0 76px', zIndex: 50 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: 8 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 20, height: 2.5, background: tc, borderRadius: 2, transition: 'background .5s' }} />)}
          </div>
          <div className="hc-vert" style={{ fontFamily: "'Sora','Nunito',sans-serif", fontWeight: 900, fontSize: 13, letterSpacing: 5, color: tc, transition: 'color .5s', userSelect: 'none' }}>NEWWORLDEDU</div>
        </div>

        {/* Slide content */}
        {SLIDES.map((s, i) => {
          const active = i === cur;
          const isDk = s.dark;
          return (
            <div key={i} style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              opacity: active ? 1 : 0, transform: active ? 'scale(1)' : 'scale(.94)',
              transition: 'opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)',
              pointerEvents: active ? 'auto' : 'none', zIndex: active ? 5 : 1,
            }}>
              {/* Floating emojis */}
              {s.emojis.map((em, j) => (
                <div key={j} style={{
                  position: 'absolute', left: EMOJI_POS[j]?.x, top: EMOJI_POS[j]?.y,
                  fontSize: 36 + (j % 3) * 10, zIndex: 2,
                  animation: `hcFloat ${3.5 + j * .4}s ease-in-out infinite`,
                  animationDelay: `${j * .3}s`,
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,.2))',
                  pointerEvents: 'none',
                }}>{em}</div>
              ))}

              {/* Confetti dots */}
              {CONFETTI.map((dot, j) => (
                <div key={j} style={{
                  position: 'absolute', left: dot.x, top: dot.y,
                  width: 6 + j % 3 * 3, height: 6 + j % 3 * 3,
                  borderRadius: j % 2 === 0 ? '50%' : '2px',
                  background: dot.c, opacity: .4,
                  animation: `hcPulse ${2 + j * .3}s ease-in-out infinite`,
                  animationDelay: `${j * .25}s`,
                  pointerEvents: 'none',
                  transform: j % 3 === 2 ? 'rotate(45deg)' : 'none',
                }} />
              ))}

              {/* Big text */}
              <h1 className="hc-big" style={{
                fontFamily: "'Sora','Nunito',sans-serif", fontWeight: 900, fontSize: 'min(14vw, 160px)',
                color: isDk ? '#1a1a2e' : '#fff', opacity: .95, letterSpacing: -4, lineHeight: .95,
                textAlign: 'center', userSelect: 'none', position: 'relative', zIndex: 3,
                textShadow: isDk ? 'none' : '0 6px 40px rgba(0,0,0,.18)',
                animation: active ? 'hcBigIn .9s cubic-bezier(.22,1,.36,1) forwards' : 'none',
                marginBottom: 20,
              }}>{s.big}</h1>

              {/* Tagline inside hero */}
              <p style={{
                fontFamily: "'Sora','Nunito',sans-serif", fontWeight: 700,
                fontSize: 'clamp(16px, 2.5vw, 24px)',
                color: isDk ? 'rgba(26,26,46,.7)' : 'rgba(255,255,255,.8)',
                textAlign: 'center', maxWidth: 560, lineHeight: 1.4,
                position: 'relative', zIndex: 3, padding: '0 20px',
                animation: active ? 'hcTagIn .7s .4s cubic-bezier(.22,1,.36,1) both' : 'none',
              }}>{s.tagline}</p>
            </div>
          );
        })}

        {/* Progress bars */}
        <div className="hc-prog-row" style={{ position: 'absolute', bottom: 62, left: 76, right: 76, display: 'flex', gap: 10, zIndex: 100 }}>
          {SLIDES.map((_, i) => (
            <div key={i} onClick={() => goTo(i)} style={{ flex: 1, height: 3, background: `${tc}30`, borderRadius: 2, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ height: '100%', background: tc, borderRadius: 2, width: i < cur ? '100%' : '0%', animation: i === cur ? `hcProg ${SLIDE_MS}ms linear forwards` : 'none' }} />
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="hc-bot" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 48px 14px 76px', zIndex: 100 }}>
          <Link href="/contact" className="hc-btn" style={{ background: tc, color: dk ? '#FBBF24' : '#4F46E5', fontFamily: "'Sora','Nunito',sans-serif", fontWeight: 800, fontSize: 14, padding: '12px 28px', borderRadius: 100, display: 'inline-block' }}>Get in touch</Link>
          <p className="hc-bot-tag" style={{ fontFamily: "'Sora','Nunito',sans-serif", fontWeight: 800, fontSize: 'clamp(14px,2vw,20px)', color: tc, textAlign: 'center', flex: 1, padding: '0 20px', transition: 'color .5s', lineHeight: 1.35 }}>{slide.tagline}</p>
          <Link href="/start" className="hc-btn" style={{ background: tc, color: dk ? '#FBBF24' : '#4F46E5', fontFamily: "'Sora','Nunito',sans-serif", fontWeight: 800, fontSize: 14, padding: '12px 28px', borderRadius: 100, display: 'inline-block' }}>Start free →</Link>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: 96, left: '50%', transform: 'translateX(-50%)', zIndex: 100, opacity: .4, animation: 'hcFloat 2s ease-in-out infinite' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke={tc} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </>
  );
}
