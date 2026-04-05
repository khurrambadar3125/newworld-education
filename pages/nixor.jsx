/**
 * pages/nixor.jsx — Nixor College Partnership Pitch Deck
 * Based on Khurram's original PPTX — rebuilt as a web presentation.
 * Arrow keys or click arrows to navigate. F11 for fullscreen.
 */

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';

const NAVY = '#0A1628';
const GOLD = '#C9A84C';
const WHITE = '#FAF6EB';
const DIM = 'rgba(250,246,235,0.4)';
const CARD = 'rgba(250,246,235,0.03)';
const BORDER = 'rgba(201,168,76,0.2)';

const SLIDES = [

  // ═══ SLIDE 1 — TITLE ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 60px' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: GOLD, letterSpacing: '0.2em', marginBottom: 40 }}>FOR NIXOR COLLEGE</div>
      <h1 style={{ fontSize: 64, fontWeight: 900, color: WHITE, margin: '0 0 20px', lineHeight: 1.1, fontFamily: "'Georgia','Times New Roman',serif" }}>
        Everything your teachers<br />cannot give you —<br />
        <span style={{ color: GOLD }}>available always.</span>
      </h1>
      <div style={{ width: 80, height: 3, background: GOLD, margin: '24px auto' }} />
      <p style={{ fontSize: 18, color: DIM, marginBottom: 32 }}>Cambridge O and A Level &middot; Pakistan and UAE &middot; 24/7</p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        {[
          { n: '50,000+', l: 'Verified Questions' },
          { n: '17 Subjects', l: 'Textbook Chapters' },
          { n: 'Predicted', l: 'Cambridge Grade' },
        ].map(s => (
          <div key={s.l} style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: '14px 28px', minWidth: 180 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: GOLD }}>{s.n}</div>
            <div style={{ fontSize: 12, color: DIM }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32, fontSize: 14, color: 'rgba(250,246,235,0.2)' }}>newworld.education/study</div>
    </div>
  ),

  // ═══ SLIDE 2 — 11:14 PM SCENARIO ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 56, fontWeight: 900, color: GOLD, fontFamily: "'Georgia',serif" }}>11:14 PM</div>
        <div style={{ fontSize: 18, color: DIM, fontStyle: 'italic' }}>A Nixor student. Chemistry A Level Paper 2 is tomorrow.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: 'rgba(255,50,50,0.04)', border: '1px solid rgba(255,50,50,0.15)', borderRadius: 16, padding: '28px 24px' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#FF6B6B', letterSpacing: '0.12em', marginBottom: 16 }}>WITHOUT STARKY</div>
          {['Tutor unavailable at 11pm', 'WhatsApp groups have no Cambridge depth', "YouTube doesn't know the mark scheme", 'ChatGPT answers correctly but not in Cambridge dialect', 'They go to bed uncertain', 'They lose 8 marks they could have saved'].map((t, i) => (
            <div key={i} style={{ fontSize: 15, color: 'rgba(250,246,235,0.5)', padding: '8px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <span style={{ color: '#FF6B6B', marginRight: 8 }}>&#10007;</span>{t}
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: 16, padding: '28px 24px' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#4ADE80', letterSpacing: '0.12em', marginBottom: 16 }}>WITH STARKY</div>
          {['Opens Starky. Types the question', 'Command word identified instantly', 'Mark scheme phrase given — Cambridge dialect', 'Examiner warning: students always lose marks here by...', 'Student writes the answer. Starky marks it', 'They go to bed knowing exactly what to write'].map((t, i) => (
            <div key={i} style={{ fontSize: 15, color: 'rgba(250,246,235,0.7)', padding: '8px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <span style={{ color: '#4ADE80', marginRight: 8 }}>&#10003;</span>{t}
            </div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 24, fontSize: 16, color: GOLD, fontStyle: 'italic' }}>This is what Starky is.</div>
    </div>
  ),

  // ═══ SLIDE 3 — THE STATEMENT ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 80px' }}>
      <p style={{ fontSize: 32, color: WHITE, fontWeight: 700, lineHeight: 1.5, margin: '0 0 8px', fontFamily: "'Georgia',serif" }}>
        The best tutor on any platform has delivered<br />4,000 lessons across 17 years.
      </p>
      <p style={{ fontSize: 56, color: GOLD, fontWeight: 900, lineHeight: 1.2, margin: '0 0 24px', fontFamily: "'Georgia',serif", textDecoration: 'underline', textDecorationColor: GOLD, textUnderlineOffset: 8 }}>
        Starky delivers that in a week.
      </p>
      <p style={{ fontSize: 24, color: WHITE, fontWeight: 600, margin: '0 0 4px' }}>Starky doesn&apos;t compete with online tutoring platforms.</p>
      <p style={{ fontSize: 40, color: GOLD, fontWeight: 900, margin: '0 0 40px', fontFamily: "'Georgia',serif" }}>It makes them obsolete.</p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, color: 'rgba(250,246,235,0.25)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 20px' }}>Human tutor: slots, booking, Rs 5,000-15,000/hr, one student at a time</div>
        <div style={{ fontSize: 13, color: GOLD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 20px' }}>Starky: 24/7, every subject, every student, Rs 2,850/month</div>
      </div>
    </div>
  ),

  // ═══ SLIDE 4 — WHAT STARKY IS (6 cards) ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 60px' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: '0.15em', marginBottom: 12, textAlign: 'center' }}>WHAT STARKY IS</div>
      <h2 style={{ fontSize: 32, fontWeight: 900, color: WHITE, margin: '0 0 28px', textAlign: 'center' }}>
        <span style={{ color: GOLD, fontFamily: "'Georgia',serif", fontStyle: 'italic' }}>A Senior Cambridge Examiner.</span>{' '}Available at midnight. For Rs 2,850 a month.
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {[
          { title: 'Cambridge Dialect', desc: '32 precision entries — exact phrases Cambridge mark schemes accept and reject. "Denatured" not "killed". "Net movement of water molecules" not "water moves".' },
          { title: 'Command Word Mastery', desc: '57 command words fully mapped with subject-specific variations. Before every answer, Starky tells students exactly what Cambridge requires.' },
          { title: 'Examiner Reports (191+)', desc: '191 mistakes Cambridge examiners have specifically flagged across 15 subjects — loaded and active on every single response.' },
          { title: 'Structured Study Paths', desc: '17 subjects with exact textbook chapters. Learn → Guided → Practice → Master. 50,000+ verified questions from the bank. Zero AI dependency for core learning.' },
          { title: 'Predicted Grade', desc: 'Based on Nano mastery, mock scores and study consistency — shows each student their predicted Cambridge grade and exactly what to fix.' },
          { title: 'SEN — First in the World', desc: 'Dedicated mode for deaf, autistic, and students with learning differences. 240 teaching profiles. No other Cambridge AI platform has attempted this.' },
        ].map(c => (
          <div key={c.title} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 18px' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: GOLD, marginBottom: 8 }}>{c.title}</div>
            <div style={{ fontSize: 13, color: 'rgba(250,246,235,0.55)', lineHeight: 1.7 }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  ),

  // ═══ SLIDE 5 — GLOBAL PICTURE ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 60px' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: '0.15em', marginBottom: 20, textAlign: 'center' }}>THE GLOBAL PICTURE</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: CARD, border: '1px solid rgba(250,246,235,0.06)', borderRadius: 14, padding: '28px 24px' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: WHITE, marginBottom: 16 }}>Where the World Actually Stands</div>
          {['Westminster, Eton, Harrow — AI policies, not AI tutors', 'UK Government AI tutor target: end of 2027', 'Pakistan not in scope of any global AI initiative', '76% of UK teachers have had zero AI training', 'Cambridge International has no AI tutor for students', 'Alef Education UAE: Arabic government curriculum only'].map((t, i) => (
            <div key={i} style={{ fontSize: 14, color: 'rgba(250,246,235,0.45)', padding: '8px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>— {t}</div>
          ))}
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '28px 24px' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: GOLD, marginBottom: 16 }}>NewWorldEdu — Today</div>
          {['50,000+ verified questions — real Cambridge past papers', 'Pakistan live tonight — Urdu support included', '17 subjects with textbook-accurate chapters', 'SEN dedicated mode — first in the world', '96+ examiner reports loaded', 'Structured study paths: Learn → Guided → Practice → Master'].map((t, i) => (
            <div key={i} style={{ fontSize: 14, color: 'rgba(250,246,235,0.7)', padding: '8px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <span style={{ color: '#4ADE80', marginRight: 8 }}>&#10003;</span>{t}
            </div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: GOLD }}>The UK Government&apos;s AI tutor doesn&apos;t exist yet. Starky exists now — built for Cambridge, built for Pakistan.</div>
    </div>
  ),

  // ═══ SLIDE 6 — COMPARISON TABLE ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 40px' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: '0.12em', marginBottom: 20, textAlign: 'center' }}>PAKISTAN&apos;S FIRST AI CAMBRIDGE TUTOR — BUILT FOR STUDENTS LIKE YOURS</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            <th style={{ padding: '12px', textAlign: 'left', color: DIM, borderBottom: `1px solid ${BORDER}` }}></th>
            <th style={{ padding: '12px', textAlign: 'center', color: NAVY, background: GOLD, borderRadius: '8px 8px 0 0', fontWeight: 800 }}>NewWorldEdu</th>
            <th style={{ padding: '12px', textAlign: 'center', color: DIM, borderBottom: `1px solid ${BORDER}` }}>General AI Tools</th>
            <th style={{ padding: '12px', textAlign: 'center', color: DIM, borderBottom: `1px solid ${BORDER}` }}>Khan Academy</th>
            <th style={{ padding: '12px', textAlign: 'center', color: DIM, borderBottom: `1px solid ${BORDER}` }}>Human Coaching</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Conversational AI tutor', '✅', 'Partial', '✅', '✅'],
            ['Cambridge O/A Level depth', '✅', '❌', 'General only', 'Varies'],
            ['Mark scheme language', '✅', '❌', '❌', 'Rarely'],
            ['Examiner report knowledge', '✅', '❌', '❌', '❌'],
            ['Pakistan / Urdu support', '✅', '❌', '❌', '❌'],
            ['SEN dedicated mode', '✅ First in world', '❌', '❌', '❌'],
            ['Available 24/7', '✅', '✅', '✅', '❌'],
            ['Predicted Cambridge grade', '✅', '❌', '❌', '❌'],
            ['Cost per month', 'Rs 2,850', 'Free/paid', 'Free', 'Rs 5,000+/hr'],
          ].map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(250,246,235,0.04)' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '10px 12px', textAlign: j === 0 ? 'left' : 'center', color: j === 0 ? 'rgba(250,246,235,0.6)' : j === 1 ? (cell.includes('✅') ? '#4ADE80' : GOLD) : cell === '❌' ? '#FF6B6B' : 'rgba(250,246,235,0.5)', fontWeight: j === 1 ? 700 : 400, fontSize: 13 }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),

  // ═══ SLIDE 7 — THE OPPORTUNITY FOR NIXOR ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 60px' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: '0.15em', marginBottom: 24, textAlign: 'center' }}>THE OPPORTUNITY FOR NIXOR</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '28px 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: GOLD, letterSpacing: '0.1em', marginBottom: 16 }}>FOR YOUR STUDENTS</div>
          {['Cambridge examiner intelligence at midnight', 'Mark scheme language — not just correct answers', 'Predicted grade updates every session', 'Structured study paths — textbook chapters, not random topics', 'Starky Mocks with instant AI marking', 'No more coaching centre dependency'].map(t => (
            <div key={t} style={{ fontSize: 14, color: 'rgba(250,246,235,0.6)', padding: '8px 0' }}>&rarr; {t}</div>
          ))}
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '28px 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: GOLD, letterSpacing: '0.1em', marginBottom: 16 }}>FOR NIXOR</div>
          {["Pakistan's first AI-integrated A Level college", 'Measurable grade improvement data', 'Aggregate performance analytics by subject', 'Weakness data informs your teaching', 'Zero IT infrastructure required', 'Phase 3: The Nixor AI Lab — the hybrid model'].map(t => (
            <div key={t} style={{ fontSize: 14, color: 'rgba(250,246,235,0.6)', padding: '8px 0' }}>&rarr; {t}</div>
          ))}
        </div>
      </div>
    </div>
  ),

  // ═══ SLIDE 8 — HOW IT WORKS ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 60px' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: '0.15em', marginBottom: 28, textAlign: 'center' }}>HOW IT WORKS</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
        {[
          { n: '1', title: 'Student opens Starky', desc: 'Phone, tablet or computer. No app. No download. Opens instantly — even at 11pm before an exam.' },
          { n: '2', title: 'Opens structured study path', desc: 'Textbook-accurate chapters — Chemistry 22ch, Physics 25ch, Maths 10ch. Exactly as their coursebook reads.' },
          { n: '3', title: '4-step nano lesson', desc: 'Step 1: Worked example with answer. Step 2: Guided with hints. Step 3: Practice — real past paper Qs. Step 4: Mastery confirmed.' },
          { n: '4', title: 'Grade prediction updates', desc: "After every session the student's predicted Cambridge grade updates. Teacher sees the same data." },
        ].map(s => (
          <div key={s.n} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '24px 20px', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: GOLD, color: NAVY, fontSize: 20, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{s.n}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: WHITE, marginBottom: 10 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: 'rgba(250,246,235,0.5)', lineHeight: 1.7 }}>{s.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: '0.1em' }}>LIVE DEMO</span>
        <span style={{ fontSize: 14, color: DIM, marginLeft: 12 }}>newworld.education/study — Open the structured study path right now.</span>
      </div>
    </div>
  ),

  // ═══ SLIDE 9 — PLATFORM TODAY (8 stats) ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 60px' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: '0.15em', marginBottom: 28, textAlign: 'center' }}>THE PLATFORM TODAY</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14 }}>
        {[
          { n: '50,000+', l: 'Verified past paper\nquestions in the bank' },
          { n: '17', l: 'Subjects with textbook-\naccurate chapter structure' },
          { n: '34+', l: 'Cambridge + Edexcel\nsubjects covered' },
          { n: '96+', l: 'Examiner reports\nloaded' },
          { n: '24/7', l: 'Always available\nno booking required' },
          { n: '16+', l: 'Languages including\nUrdu and Arabic' },
          { n: 'Rs 2,850', l: 'Per student per month\nvs Rs 15,000+/hr tutor' },
          { n: 'SEN', l: 'Dedicated mode\nFirst in the World' },
        ].map(s => (
          <div key={s.n} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '24px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: GOLD, marginBottom: 8 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.45)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  ),

  // ═══ SLIDE 10 — PARTNERSHIP ROADMAP ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 60px' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: '0.15em', marginBottom: 28, textAlign: 'center' }}>THE NIXOR PARTNERSHIP ROADMAP</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {[
          { n: '1', title: 'Pilot Now', sub: 'No cost. No commitment. No IT setup.', items: ['8 weeks free access for all Nixor students', 'Starky available tonight — nothing to install', 'Weekly engagement report shared with Nixor', 'Starky Mocks: free Cambridge mock exams, instant AI marking'], btn: 'Start this week', btnColor: GOLD },
          { n: '2', title: 'Results Month 2', sub: 'Grade improvement data — publishable.', items: ['Predicted grade per student shared with Nixor', 'Subject-level weakness analysis across the cohort', 'Strongest and weakest topics visible by class', 'Outcome tracking: grade before vs after Starky'], btn: 'Measure impact', btnColor: 'rgba(250,246,235,0.3)' },
          { n: '3', title: 'The Nixor AI Lab', sub: "Pakistan's first AI-integrated A Level college.", items: ['Timetabled Starky Hours — free periods become AI study', 'TAs present for motivation, not instruction', 'Co-branded Nixor AI experience for students', 'The Alpha hybrid model — built for Cambridge, in Karachi'], btn: 'Lead Pakistan', btnColor: 'rgba(250,246,235,0.3)' },
        ].map(p => (
          <div key={p.n} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '28px 22px' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: p.n === '1' ? GOLD : 'rgba(250,246,235,0.15)', color: p.n === '1' ? NAVY : DIM, fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{p.n}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: p.n === '1' ? GOLD : WHITE, textAlign: 'center', marginBottom: 4 }}>{p.title}</div>
            <div style={{ fontSize: 12, color: DIM, textAlign: 'center', fontStyle: 'italic', marginBottom: 16 }}>{p.sub}</div>
            {p.items.map(t => (
              <div key={t} style={{ fontSize: 13, color: 'rgba(250,246,235,0.55)', padding: '6px 0' }}>&rarr; {t}</div>
            ))}
            <div style={{ marginTop: 16, padding: '10px 0', borderRadius: 8, background: p.btnColor, textAlign: 'center', fontSize: 13, fontWeight: 800, color: p.n === '1' ? NAVY : DIM }}>{p.btn}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: GOLD }}>Phase 1: No cost. No contract. No IT setup. 8 weeks. Then we talk about what Pakistan&apos;s first AI college looks like.</div>
    </div>
  ),

  // ═══ SLIDE 11 — CLOSE + CHALLENGE ═══
  () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 80px' }}>
      <p style={{ fontSize: 36, color: WHITE, fontWeight: 700, lineHeight: 1.5, margin: '0 0 12px', fontFamily: "'Georgia',serif" }}>
        Nixor has produced Pakistan&apos;s best<br />Cambridge students for decades.
      </p>
      <p style={{ fontSize: 32, color: GOLD, fontWeight: 700, lineHeight: 1.5, margin: '0 0 24px', fontFamily: "'Georgia',serif" }}>
        Starky is built to support exactly those students.
      </p>
      <p style={{ fontSize: 22, color: DIM, lineHeight: 1.6, margin: '0 0 40px' }}>
        Not to replace what makes Nixor great.<br />To give your students everything else.
      </p>
      <a href="/study" target="_blank" rel="noopener" style={{ display: 'block', background: GOLD, color: NAVY, fontSize: 22, fontWeight: 900, padding: '20px 40px', borderRadius: 14, textDecoration: 'none', textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
        newworld.education/study
      </a>
      <div style={{ textAlign: 'center', marginTop: 12, fontSize: 14, color: DIM, fontStyle: 'italic' }}>Open the structured study path right now. Pick any subject.</div>
      <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, fontWeight: 700, color: WHITE }}>Available now. No setup. No cost to begin.</div>
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
        <title>NewWorldEdu — For Nixor College</title>
        <meta name="robots" content="noindex" />
      </Head>

      <style jsx global>{`
        @keyframes deckFadeIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .deck-slide { animation: deckFadeIn 0.4s ease both; }
        .deck-arrow { opacity: 0.15; transition: opacity 0.2s; }
        .deck-arrow:hover { opacity: 0.7; }
      `}</style>

      {/* Gold top border like PPT */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${GOLD}, ${GOLD})` }} />

      <div className="deck-slide" key={slide} style={{ width: '100%', height: '100%' }}>
        <SlideComponent />
      </div>

      {slide > 0 && (
        <button className="deck-arrow" onClick={prev}
          style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(250,246,235,0.08)', border: 'none', borderRadius: 12, width: 48, height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: WHITE, zIndex: 10 }}>
          &#8592;
        </button>
      )}
      {slide < total - 1 && (
        <button className="deck-arrow" onClick={next}
          style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: `rgba(201,168,76,0.15)`, border: `1px solid rgba(201,168,76,0.3)`, borderRadius: 12, width: 48, height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: GOLD, zIndex: 10 }}>
          &#8594;
        </button>
      )}

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(250,246,235,0.06)' }}>
        <div style={{ height: '100%', width: `${((slide + 1) / total) * 100}%`, background: GOLD, transition: 'width 0.3s ease' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 12, right: 20, fontSize: 12, color: 'rgba(250,246,235,0.15)', fontWeight: 700 }}>
        {slide + 1} / {total}
      </div>
      <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={(e) => { e.stopPropagation(); setSlide(i); }}
            style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 4, border: 'none', background: i === slide ? GOLD : 'rgba(250,246,235,0.1)', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }} />
        ))}
      </div>
    </div>
  );
}
