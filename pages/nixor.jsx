/**
 * pages/nixor.jsx — Nixor Boardroom Pitch Deck
 * Full-screen web presentation. Open in browser, press F11.
 * Arrow keys or click to navigate. Live demo links embedded.
 */

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';

const NAVY = '#0A1628';
const GOLD = '#C9A84C';
const WHITE = '#FAF6EB';
const DIM = 'rgba(250,246,235,0.4)';

const SLIDES = [

  // ═══ SLIDE 1 — TITLE ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 60px' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: GOLD, letterSpacing: '0.15em', marginBottom: 32 }}>NEWWORLDEDU</div>
      <h1 style={{ fontSize: 72, fontWeight: 900, color: WHITE, margin: '0 0 24px', lineHeight: 1.1 }}>
        The AI tutor that marks{' '}
        <span style={{ color: GOLD }}>like a Cambridge examiner.</span>
      </h1>
      <p style={{ fontSize: 24, color: DIM, maxWidth: 700, lineHeight: 1.7 }}>
        Every subject. Every student. Every mark scheme phrase.<br />24 hours a day. Rs 2,850/month.
      </p>
      <div style={{ marginTop: 48, fontSize: 14, color: 'rgba(250,246,235,0.25)' }}>newworld.education</div>
    </div>
  ),

  // ═══ SLIDE 2 — STUDENT STORY ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 80px' }}>
      <div style={{ fontSize: 48, marginBottom: 24 }}>&#128218;</div>
      <p style={{ fontSize: 36, color: WHITE, fontWeight: 700, lineHeight: 1.6, maxWidth: 800, margin: '0 0 32px' }}>
        &ldquo;My daughter wrote <span style={{ color: '#FF6B6B' }}>&lsquo;the enzyme is killed&rsquo;</span> in her mock exam.
        She lost the mark. The tutor never corrected her.&rdquo;
      </p>
      <p style={{ fontSize: 36, color: GOLD, fontWeight: 900, lineHeight: 1.6, maxWidth: 800, margin: 0 }}>
        Starky catches that in real time and teaches her to write{' '}
        <span style={{ color: '#4ADE80' }}>&ldquo;denatured&rdquo;</span>{' '}
        — the only word Cambridge accepts.
      </p>
      <div style={{ marginTop: 48, fontSize: 16, color: DIM }}>This is not tutoring. This is examiner-level precision.</div>
    </div>
  ),

  // ═══ SLIDE 3 — THE STATEMENT (Tutopiya comparison) ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 80px' }}>
      <div style={{ marginBottom: 48 }}>
        <p style={{ fontSize: 36, color: WHITE, fontWeight: 700, lineHeight: 1.6, margin: '0 0 12px' }}>
          The best human tutor on Pakistan&apos;s top platform has delivered 4,000 lessons across 17 years.
        </p>
        <p style={{ fontSize: 52, color: GOLD, fontWeight: 900, lineHeight: 1.3, margin: 0 }}>
          Starky delivers that in a week.
        </p>
      </div>

      <div style={{ width: '100%', height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: '8px 0 48px' }} />

      <div>
        <p style={{ fontSize: 30, color: WHITE, fontWeight: 600, lineHeight: 1.6, margin: '0 0 12px' }}>
          Starky doesn&apos;t compete with online tutoring platforms.
        </p>
        <p style={{ fontSize: 48, color: GOLD, fontWeight: 900, lineHeight: 1.3, margin: 0 }}>
          It makes them obsolete.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 64 }}>
        <div style={{ fontSize: 14, color: 'rgba(250,246,235,0.3)', lineHeight: 1.7 }}>
          Tutopiya: human tutors, limited slots, Rs 5,000–15,000/hour, one student at a time.
        </div>
        <div style={{ fontSize: 14, color: 'rgba(201,168,76,0.5)', lineHeight: 1.7, textAlign: 'right' }}>
          Starky: 24/7, every subject, every student, Rs 2,850/month.
        </div>
      </div>
    </div>
  ),

  // ═══ SLIDE 4 — WHAT STARKY IS ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 80px' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, letterSpacing: '0.15em', marginBottom: 20 }}>WHAT STARKY IS</div>
      <h2 style={{ fontSize: 52, fontWeight: 900, color: WHITE, margin: '0 0 40px', lineHeight: 1.2 }}>
        An AI tutor trained to the standard of a{' '}
        <span style={{ color: GOLD }}>Senior Cambridge Examiner.</span>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {[
          { n: '57', label: 'Cambridge command words mastered', sub: 'State vs Describe vs Explain — Starky knows the difference' },
          { n: '191', label: 'Examiner report entries', sub: 'Real mistakes Cambridge examiners penalise — caught in real time' },
          { n: '2,803', label: 'Nano learning goals', sub: 'Every O and A Level subject broken into single concepts' },
          { n: '30', label: 'Subjects covered', sub: '16 O Level + 11 A Level + 3 additional — with 100+ goals each' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 16, padding: '28px 24px' }}>
            <div style={{ fontSize: 44, fontWeight: 900, color: GOLD, marginBottom: 8 }}>{s.n}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: WHITE, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 13, color: DIM, lineHeight: 1.6 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  ),

  // ═══ SLIDE 5 — THE THREE PRODUCTS ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 80px' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, letterSpacing: '0.15em', marginBottom: 20 }}>THREE PRODUCTS, ONE LOOP</div>
      <h2 style={{ fontSize: 42, fontWeight: 900, color: WHITE, margin: '0 0 40px' }}>
        Learn. Practise. Test. Repeat.
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {[
          { icon: '&#9883;&#65039;', name: 'Starky Nano', desc: 'Every Cambridge subject broken into single learning goals. Starky teaches it. Tests it. Confirms mastery before moving on.', link: '/nano', color: GOLD },
          { icon: '&#9889;', name: 'Practice Drill', desc: '5 modes: Weak Spots, Command Words, Mark Scheme Language, Calculations, Past Paper. Fixes what\'s broken.', link: '/drill', color: '#4F8EF7' },
          { icon: '&#128221;', name: 'Starky Mocks', desc: 'Timed mock exams with pre-exam briefing, question guides, and diagnostic marking against real mark schemes.', link: '/mocks', color: '#A78BFA' },
        ].map(p => (
          <div key={p.name} style={{ background: 'rgba(250,246,235,0.03)', border: `1px solid ${p.color}33`, borderRadius: 16, padding: '32px 24px' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: p.icon }} />
            <div style={{ fontSize: 20, fontWeight: 900, color: p.color, marginBottom: 10 }}>{p.name}</div>
            <div style={{ fontSize: 14, color: 'rgba(250,246,235,0.6)', lineHeight: 1.7 }}>{p.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 32, fontSize: 18, color: DIM }}>
        Nano teaches it &rarr; Drill practises it &rarr; Mock tests it &rarr; Weakness found &rarr; Nano fixes it &rarr; repeat
      </div>
    </div>
  ),

  // ═══ SLIDE 6 — SEN SUPPORT ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 80px' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#4ADE80', letterSpacing: '0.15em', marginBottom: 20 }}>INCLUSION</div>
      <h2 style={{ fontSize: 48, fontWeight: 900, color: WHITE, margin: '0 0 16px' }}>
        240 adaptive teaching profiles for{' '}
        <span style={{ color: '#4ADE80' }}>special educational needs.</span>
      </h2>
      <p style={{ fontSize: 20, color: DIM, margin: '0 0 36px', lineHeight: 1.7, maxWidth: 700 }}>
        Autism, ADHD, dyslexia, Down syndrome, hearing impairment, visual impairment — 12 conditions, 4 grade levels, 5 severity tiers.
        Every student gets a tutor that adapts to them.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {[
          { name: 'Zayd Mode', desc: 'Built for our own student with autism. Gentle start, safe space, focus mode.', color: '#4ADE80' },
          { name: 'Deaf Mode', desc: '8 rules for hearing-impaired students. Visual-first, no audio dependencies.', color: '#63D2FF' },
          { name: 'Dyslexia Support', desc: 'OpenDyslexic font, simplified sentences, no timed pressure.', color: '#FFC300' },
        ].map(s => (
          <div key={s.name} style={{ background: 'rgba(250,246,235,0.03)', border: `1px solid ${s.color}33`, borderRadius: 14, padding: '24px 20px' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: s.color, marginBottom: 8 }}>{s.name}</div>
            <div style={{ fontSize: 13, color: 'rgba(250,246,235,0.55)', lineHeight: 1.7 }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  ),

  // ═══ SLIDE 8 — SCHOOL PARTNERSHIP ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 80px' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, letterSpacing: '0.15em', marginBottom: 20 }}>FOR NIXOR</div>
      <h2 style={{ fontSize: 48, fontWeight: 900, color: WHITE, margin: '0 0 32px', lineHeight: 1.2 }}>
        What a Nixor partnership looks like.
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {[
          { title: 'Every student gets Starky', desc: 'Unlimited access to Nano, Drill, Mocks. 24/7. Every subject Nixor teaches.' },
          { title: 'Teacher dashboard', desc: 'Real-time view of every student\'s weak topics, session activity, and progress.' },
          { title: 'Parent reports', desc: 'Automatic email after every session. Parents see exactly what their child studied.' },
          { title: 'Exam preparation', desc: '27 days to Cambridge exams. Starky generates personalised revision plans from each student\'s weaknesses.' },
          { title: 'SEN inclusion', desc: '240 teaching profiles. Every student learns in the way that works for them.' },
          { title: 'Cost', desc: 'School licence. Fraction of one human tutor\'s salary. Covers every student in every subject.' },
        ].map(f => (
          <div key={f.title} style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 14, padding: '24px 20px' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: GOLD, marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: 14, color: 'rgba(250,246,235,0.55)', lineHeight: 1.7 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  ),

  // ═══ SLIDE 9 — WHAT PARENTS WILL SEE ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 80px' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#4ADE80', letterSpacing: '0.15em', marginBottom: 20 }}>PARENT EXPERIENCE</div>
      <h2 style={{ fontSize: 44, fontWeight: 900, color: WHITE, margin: '0 0 32px' }}>
        What Nixor parents will see.
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 14, padding: '24px 20px' }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#4ADE80', marginBottom: 8 }}>After every session</div>
          <div style={{ fontSize: 14, color: 'rgba(250,246,235,0.6)', lineHeight: 1.7 }}>
            Email report: what their child studied, which topics they struggled with, what Starky recommended next. No more &ldquo;what did you learn today?&rdquo; &ldquo;nothing.&rdquo;
          </div>
        </div>
        <div style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 14, padding: '24px 20px' }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#4ADE80', marginBottom: 8 }}>Weekly progress</div>
          <div style={{ fontSize: 14, color: 'rgba(250,246,235,0.6)', lineHeight: 1.7 }}>
            Sunday email: goals mastered this week, strongest subject, weakest subject, exam countdown, recommended next goal. Parents see progress without asking.
          </div>
        </div>
        <div style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 14, padding: '24px 20px' }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: GOLD, marginBottom: 8 }}>Cambridge precision</div>
          <div style={{ fontSize: 14, color: 'rgba(250,246,235,0.6)', lineHeight: 1.7 }}>
            Parents paying Rs 500,000+ in school fees want to know their child is being taught the mark scheme, not just the textbook. Starky shows them exactly which marks their child earns and loses.
          </div>
        </div>
        <div style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 14, padding: '24px 20px' }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: GOLD, marginBottom: 8 }}>Available at 2am</div>
          <div style={{ fontSize: 14, color: 'rgba(250,246,235,0.6)', lineHeight: 1.7 }}>
            When their child is studying at midnight before an exam, Starky is there. No tutor appointment needed. No scheduling. No Rs 5,000/hour. Just open the app.
          </div>
        </div>
      </div>
    </div>
  ),

  // ═══ SLIDE 10 — WHY NOW ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 80px' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#FF6B6B', letterSpacing: '0.15em', marginBottom: 20 }}>WHY NOW</div>
      <h2 style={{ fontSize: 48, fontWeight: 900, color: WHITE, margin: '0 0 24px', lineHeight: 1.2 }}>
        Cambridge exams start in{' '}
        <span style={{ color: '#FF6B6B' }}>{Math.max(0, Math.ceil((new Date('2026-04-27') - new Date()) / 86400000))} days.</span>
      </h2>
      <p style={{ fontSize: 22, color: DIM, maxWidth: 700, lineHeight: 1.7, margin: '0 0 32px' }}>
        Every day a Nixor student spends without Starky is a day their competitor at Karachi Grammar, LGS, or Beaconhouse is gaining an edge.
      </p>
      <p style={{ fontSize: 22, color: GOLD, fontWeight: 700, maxWidth: 700, lineHeight: 1.7, margin: 0 }}>
        The schools that adopt AI first will produce the next generation of A* students. The ones that wait will wonder why their results dropped.
      </p>
    </div>
  ),

  // ═══ SLIDE 11 — LIVE DEMO (last before The Ask — opens new tab) ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 80px' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, letterSpacing: '0.15em', marginBottom: 20 }}>LIVE DEMO</div>
      <h2 style={{ fontSize: 48, fontWeight: 900, color: WHITE, margin: '0 0 16px' }}>
        The Cambridge Challenge
      </h2>
      <p style={{ fontSize: 20, color: DIM, margin: '0 0 40px', lineHeight: 1.7 }}>
        One Cambridge exam question. Type your answer. Get marked by a Cambridge examiner in real time.
        See exactly which marks you earned and which you lost.
      </p>
      <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 20, padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: WHITE, marginBottom: 12 }}>Try it yourself.</div>
        <div style={{ fontSize: 16, color: DIM, marginBottom: 24 }}>Hand this laptop to any teacher or student in the room.</div>
        <a href="/challenge" target="_blank" rel="noopener" style={{ display: 'inline-block', background: GOLD, color: NAVY, fontSize: 20, fontWeight: 900, padding: '18px 48px', borderRadius: 14, textDecoration: 'none' }}>
          Open Cambridge Challenge &rarr;
        </a>
      </div>
    </div>
  ),

  // ═══ SLIDE 12 — THE ASK ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 80px' }}>
      <h2 style={{ fontSize: 56, fontWeight: 900, color: WHITE, margin: '0 0 24px', lineHeight: 1.2 }}>
        Give us <span style={{ color: GOLD }}>one class</span> for <span style={{ color: GOLD }}>one month.</span>
      </h2>
      <p style={{ fontSize: 24, color: DIM, maxWidth: 700, lineHeight: 1.7, margin: '0 0 40px' }}>
        We will show you the difference in their next mock exam results.
        No risk. No commitment. Just data.
      </p>
      <div style={{ display: 'flex', gap: 20 }}>
        <a href="/challenge" target="_blank" rel="noopener" style={{ display: 'inline-block', background: GOLD, color: NAVY, fontSize: 18, fontWeight: 900, padding: '16px 40px', borderRadius: 14, textDecoration: 'none' }}>
          Try the Challenge now &rarr;
        </a>
        <a href="/school" target="_blank" rel="noopener" style={{ display: 'inline-block', background: 'transparent', border: `2px solid ${GOLD}`, color: GOLD, fontSize: 18, fontWeight: 900, padding: '14px 40px', borderRadius: 14, textDecoration: 'none' }}>
          School partnerships &rarr;
        </a>
      </div>
      <div style={{ marginTop: 64, fontSize: 14, color: 'rgba(250,246,235,0.2)' }}>
        Khurram Badar &middot; khurram@newworld.education &middot; newworld.education
      </div>
    </div>
  ),
];

export default function NixorDeck() {
  const [slide, setSlide] = useState(0);
  const total = SLIDES.length;

  const next = useCallback(() => setSlide(s => Math.min(s + 1, total - 1)), [total]);
  const prev = useCallback(() => setSlide(s => Math.max(s - 1, 0)), []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      if (e.key === 'Home') { e.preventDefault(); setSlide(0); }
      if (e.key === 'End') { e.preventDefault(); setSlide(total - 1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, total]);

  const SlideComponent = SLIDES[slide];

  return (
    <div style={{ width: '100vw', height: '100vh', background: NAVY, fontFamily: "'Sora',-apple-system,sans-serif", overflow: 'hidden', position: 'relative' }}>
      <Head>
        <title>NewWorldEdu — Nixor Presentation</title>
        <meta name="robots" content="noindex" />
      </Head>

      <style jsx global>{`
        @keyframes deckFadeIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .deck-slide { animation: deckFadeIn 0.4s ease both; }
        .deck-arrow { opacity: 0.15; transition: opacity 0.2s; }
        .deck-arrow:hover { opacity: 0.7; }
      `}</style>

      <div className="deck-slide" key={slide} style={{ width: '100%', height: '100%' }}>
        <SlideComponent />
      </div>

      {/* Left arrow */}
      {slide > 0 && (
        <button className="deck-arrow" onClick={prev}
          style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(250,246,235,0.08)', border: 'none', borderRadius: 12, width: 48, height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: WHITE, zIndex: 10 }}>
          &#8592;
        </button>
      )}

      {/* Right arrow */}
      {slide < total - 1 && (
        <button className="deck-arrow" onClick={next}
          style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(201,168,76,0.15)', border: `1px solid rgba(201,168,76,0.3)`, borderRadius: 12, width: 48, height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: GOLD, zIndex: 10 }}>
          &#8594;
        </button>
      )}

      {/* Progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(250,246,235,0.06)' }}>
        <div style={{ height: '100%', width: `${((slide + 1) / total) * 100}%`, background: GOLD, transition: 'width 0.3s ease' }} />
      </div>

      {/* Slide counter */}
      <div style={{ position: 'absolute', bottom: 12, right: 20, fontSize: 12, color: 'rgba(250,246,235,0.15)', fontWeight: 700 }}>
        {slide + 1} / {total}
      </div>

      {/* Navigation dots */}
      <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={(e) => { e.stopPropagation(); setSlide(i); }}
            style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 4, border: 'none', background: i === slide ? GOLD : 'rgba(250,246,235,0.1)', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }} />
        ))}
      </div>
    </div>
  );
}
