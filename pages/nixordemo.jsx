/**
 * pages/nixordemo.jsx — Nixor College Partnership Demo Page
 * ─────────────────────────────────────────────────────────────────
 * Recreated from nixordemo.spotlightdubai.com with updated stats.
 * Single scrolling page — interactive demo, stats, features, CTA.
 */

import { useState } from 'react';
import Head from 'next/head';

const NAVY = '#080C18';
const GOLD = '#C9A84C';
const BLUE = '#4F8EF7';
const GREEN = '#4ADE80';
const DIM = 'rgba(255,255,255,0.4)';

export default function NixorDemoPage() {
  const [demoQuestion, setDemoQuestion] = useState('');
  const [demoAnswer, setDemoAnswer] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);

  const askStarky = async () => {
    if (!demoQuestion.trim() || demoLoading) return;
    setDemoLoading(true);
    setDemoAnswer('');
    try {
      const res = await fetch('/api/drill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', subject: 'Chemistry', level: 'O Level', topic: demoQuestion, questionType: 'structured', difficulty: 'medium' }),
      });
      const data = await res.json();
      setDemoAnswer(data.question || 'Try asking a specific Cambridge O or A Level question.');
    } catch { setDemoAnswer('Something went wrong. Try again.'); }
    setDemoLoading(false);
  };

  const s = {
    section: { maxWidth: 1000, margin: '0 auto', padding: '80px 24px' },
    heading: { fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 16 },
    sub: { fontSize: 18, color: DIM, lineHeight: 1.7, marginBottom: 32 },
    gold: { color: GOLD },
    green: { color: GREEN },
    card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '28px 24px' },
    statNum: { fontSize: 36, fontWeight: 900, color: GOLD, marginBottom: 4 },
    statLabel: { fontSize: 13, color: DIM, lineHeight: 1.5 },
  };

  return (
    <>
      <Head>
        <title>NewWorldEdu for Nixor College — AI-Powered Cambridge Tutoring</title>
        <meta name="description" content="Pakistan's first Cambridge O and A Level institution powered by AI. 4,507 verified past paper questions. Zero hallucinations." />
        <meta name="robots" content="noindex" />
      </Head>

      <div style={{ background: NAVY, color: '#fff', fontFamily: "'Inter','Sora',-apple-system,sans-serif", minHeight: '100vh' }}>

        {/* ── HERO ────────────────────────────────────────── */}
        <div style={{ ...s.section, paddingTop: 100, paddingBottom: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, letterSpacing: '0.15em', marginBottom: 24 }}>NEWWORLDEDU FOR NIXOR COLLEGE</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 20, maxWidth: 800, margin: '0 auto 20px' }}>
            Pakistan's first Cambridge institution powered by{' '}
            <span style={s.gold}>4,507 verified past paper questions</span>
          </h1>
          <p style={{ fontSize: 20, color: DIM, maxWidth: 650, margin: '0 auto 40px', lineHeight: 1.7 }}>
            No more coaching centres. No more AI hallucinations. Every question your students practise is a real Cambridge question with the real mark scheme answer.
          </p>
          <a href="/challenge" style={{ display: 'inline-block', background: GOLD, color: NAVY, fontSize: 16, fontWeight: 800, padding: '16px 40px', borderRadius: 12, textDecoration: 'none' }}>
            Try Starky Now — Ask Any Cambridge Question
          </a>
        </div>

        {/* ── STATS ────────────────────────────────────────── */}
        <div style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ ...s.section, padding: '48px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
            {[
              { n: '4,507', l: 'Verified Cambridge\npast paper questions' },
              { n: '10', l: 'O Level subjects\nwith full coverage' },
              { n: 'Zero', l: 'AI hallucinations\nall answers from mark schemes' },
              { n: '24/7', l: 'Available always\nno booking required' },
            ].map(st => (
              <div key={st.n}>
                <div style={s.statNum}>{st.n}</div>
                <div style={{ ...s.statLabel, whiteSpace: 'pre-line' }}>{st.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── THE PROBLEM ────────────────────────────────────── */}
        <div style={s.section}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={s.heading}>It's <span style={s.gold}>11:14 PM</span>. Chemistry Paper 2 is tomorrow.</h2>
            <p style={s.sub}>What does your student do?</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ ...s.card, borderColor: 'rgba(255,80,80,0.15)', background: 'rgba(255,80,80,0.03)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#FF6B6B', letterSpacing: '0.12em', marginBottom: 16 }}>WITHOUT STARKY</div>
              {['Tutor unavailable at 11pm', 'WhatsApp groups have no Cambridge depth', "YouTube doesn't know the mark scheme", 'ChatGPT gives correct-sounding wrong answers', 'They go to bed uncertain', 'They lose marks they could have saved'].map((t, i) => (
                <div key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', padding: '10px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ color: '#FF6B6B', marginRight: 10 }}>&#10007;</span>{t}
                </div>
              ))}
            </div>
            <div style={{ ...s.card, borderColor: 'rgba(74,222,128,0.15)', background: 'rgba(74,222,128,0.03)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: GREEN, letterSpacing: '0.12em', marginBottom: 16 }}>WITH STARKY</div>
              {['Opens Starky. Types the question', 'Gets a REAL Cambridge past paper question', 'Mark scheme answer — from the actual mark scheme', 'Examiner warning: "students always lose marks here by..."', 'Student writes their answer. Starky marks it', 'They go to bed knowing exactly what to write'].map((t, i) => (
                <div key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', padding: '10px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ color: GREEN, marginRight: 10 }}>&#10003;</span>{t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── NOT AI. VERIFIED. ────────────────────────────── */}
        <div style={{ background: 'rgba(201,168,76,0.04)', borderTop: '1px solid rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <div style={s.section}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={s.heading}>Not AI-generated. <span style={s.gold}>Verified from source.</span></h2>
              <p style={s.sub}>Every question comes from official Cambridge past papers. Every answer comes from the official mark scheme. Zero hallucinations.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              {[
                { title: 'ChatGPT', items: ['Generates questions from training data', 'Answers can be confidently wrong', 'No mark scheme knowledge', 'No examiner report intelligence', 'Cannot predict Cambridge grades'], bad: true },
                { title: 'Starky', items: ['4,507 real Cambridge past paper questions', 'Every answer from the official mark scheme', '64 examiner report insights loaded', '70+ grade boundaries from 2021-2025', 'Predicted grade from real Cambridge data'], bad: false },
                { title: 'Human Tutor', items: ['Limited to 1 student at a time', 'Rs 5,000-15,000 per hour', 'Unavailable at 11pm', 'May not know latest mark schemes', 'Cannot track every student daily'], bad: true },
              ].map(col => (
                <div key={col.title} style={{ ...s.card, borderColor: col.bad ? 'rgba(255,255,255,0.06)' : 'rgba(201,168,76,0.3)', background: col.bad ? 'rgba(255,255,255,0.02)' : 'rgba(201,168,76,0.04)' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: col.bad ? DIM : GOLD, marginBottom: 16, textAlign: 'center' }}>{col.title}</div>
                  {col.items.map((t, i) => (
                    <div key={i} style={{ fontSize: 13, color: col.bad ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.7)', padding: '8px 0' }}>
                      <span style={{ color: col.bad ? '#FF6B6B' : GREEN, marginRight: 8 }}>{col.bad ? '&#10007;' : '&#10003;'}</span>{t}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SUBJECT COVERAGE ────────────────────────────── */}
        <div style={s.section}>
          <h2 style={{ ...s.heading, textAlign: 'center' }}>10 Subjects. <span style={s.gold}>Real Past Papers.</span></h2>
          <p style={{ ...s.sub, textAlign: 'center' }}>Every subject populated from official Cambridge QP + Mark Scheme pairs</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {[
              { subject: 'Chemistry', code: '5070', qs: '1,427' },
              { subject: 'Mathematics', code: '4024', qs: '752' },
              { subject: 'Biology', code: '5090', qs: '523' },
              { subject: 'Commerce', code: '7100', qs: '458' },
              { subject: 'Computer Science', code: '2210', qs: '357' },
              { subject: 'Add Maths', code: '4037', qs: '295' },
              { subject: 'Pak Studies', code: '2059', qs: '243' },
              { subject: 'Economics', code: '2281', qs: '233' },
              { subject: 'Business Studies', code: '7115', qs: '122' },
              { subject: 'English Language', code: '1123', qs: '97' },
            ].map(sub => (
              <div key={sub.code} style={{ ...s.card, textAlign: 'center', padding: '20px 12px' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: GOLD }}>{sub.qs}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginTop: 4 }}>{sub.subject}</div>
                <div style={{ fontSize: 11, color: DIM }}>{sub.code}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES ────────────────────────────────────── */}
        <div style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div style={s.section}>
            <h2 style={{ ...s.heading, textAlign: 'center' }}>What Makes Starky <span style={s.gold}>Different</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 32 }}>
              {[
                { title: 'Verified Question Bank', desc: '4,507 questions extracted from official Cambridge past papers with mark scheme answers. No AI generation. Every answer traceable to the source document.' },
                { title: 'Examiner Intelligence', desc: '64 insights from official Cambridge Principal Examiner Reports. Starky knows exactly what loses marks and warns students before they make the same mistakes.' },
                { title: 'Cambridge Dialect', desc: 'Mark scheme language precision. "Net movement of water molecules" not "water moves". "Denatured" not "killed". The exact phrases that earn marks.' },
                { title: 'Grade Prediction', desc: '70+ official grade boundaries from 2021-2025. Predicted Cambridge grade based on real thresholds, not estimates.' },
                { title: 'Nano Learning (2,803 Goals)', desc: 'Sequential mastery across 30 subjects. Each atom taught, tested, and marked. Only advances when mastery is genuine.' },
                { title: 'SEN — First in the World', desc: 'Dedicated modes for deaf, autistic, and students with learning differences. 240 teaching profiles. No other Cambridge AI platform has this.' },
                { title: 'Drill, Mocks, Challenge', desc: 'Every practice feature serves from the verified bank. Real Cambridge questions in drill mode, mock exams, and free practice tests.' },
                { title: 'Every Language', desc: '16+ languages including Urdu, Arabic, and Roman Urdu. Students can ask in their language, get Cambridge-standard answers.' },
              ].map(f => (
                <div key={f.title} style={s.card}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: GOLD, marginBottom: 8 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── HOW IT WORKS ────────────────────────────────── */}
        <div style={s.section}>
          <h2 style={{ ...s.heading, textAlign: 'center' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginTop: 32 }}>
            {[
              { n: '1', title: 'Student opens Starky', desc: 'Phone, tablet or computer. No app. No download. Opens instantly.' },
              { n: '2', title: 'Picks subject and topic', desc: 'Nano page shows their full Cambridge journey by subject, unit and exam weight.' },
              { n: '3', title: 'Practises with real questions', desc: 'Every question from a real Cambridge past paper. Every answer from the real mark scheme.' },
              { n: '4', title: 'Grade prediction updates', desc: 'After every session, predicted Cambridge grade updates based on official grade boundaries.' },
            ].map(step => (
              <div key={step.n} style={{ ...s.card, textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: GOLD, color: NAVY, fontSize: 20, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{step.n}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 12, color: DIM, lineHeight: 1.7 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PARTNERSHIP ROADMAP ────────────────────────── */}
        <div style={{ background: 'rgba(201,168,76,0.04)', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
          <div style={s.section}>
            <h2 style={{ ...s.heading, textAlign: 'center' }}>The Nixor Partnership</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 32 }}>
              {[
                { n: '1', title: 'Pilot Now', sub: 'No cost. No commitment.', items: ['8 weeks free access for all Nixor students', 'Nothing to install — opens in any browser', 'Weekly engagement report shared with Nixor', '4,507 verified questions available immediately'], active: true },
                { n: '2', title: 'Results Month 2', sub: 'Publishable grade improvement data.', items: ['Predicted grade per student shared with faculty', 'Subject-level weakness analysis across cohort', 'Strongest and weakest topics visible by class', 'Before vs after Starky grade comparison'], active: false },
                { n: '3', title: 'The Nixor AI Lab', sub: "Pakistan's first AI-integrated A Level college.", items: ['Timetabled Starky Hours in free periods', 'Co-branded Nixor AI experience', 'Faculty dashboard with aggregate analytics', 'The hybrid model — Cambridge excellence + AI'], active: false },
              ].map(p => (
                <div key={p.n} style={{ ...s.card, borderColor: p.active ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: p.active ? GOLD : 'rgba(255,255,255,0.1)', color: p.active ? NAVY : DIM, fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{p.n}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: p.active ? GOLD : '#fff', textAlign: 'center', marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: DIM, textAlign: 'center', fontStyle: 'italic', marginBottom: 16 }}>{p.sub}</div>
                  {p.items.map(t => (
                    <div key={t} style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', padding: '6px 0' }}>
                      <span style={{ color: GREEN, marginRight: 8 }}>&#8594;</span>{t}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: GOLD }}>
              Phase 1: No cost. No contract. No IT setup. 8 weeks. Then we talk about what Pakistan's first AI college looks like.
            </div>
          </div>
        </div>

        {/* ── CTA ────────────────────────────────────────── */}
        <div style={{ ...s.section, textAlign: 'center', paddingBottom: 100 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 12 }}>
            Nixor has produced Pakistan's best Cambridge students for decades.
          </h2>
          <p style={{ fontSize: 24, color: GOLD, fontWeight: 700, marginBottom: 32 }}>
            Starky is built to support exactly those students.
          </p>
          <a href="/challenge" style={{ display: 'inline-block', background: GOLD, color: NAVY, fontSize: 18, fontWeight: 900, padding: '18px 48px', borderRadius: 14, textDecoration: 'none', marginBottom: 16 }}>
            Try Starky Now
          </a>
          <div style={{ fontSize: 14, color: DIM, marginBottom: 32 }}>newworld.education/challenge</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>
            Khurram Badar — <a href="mailto:khurram@newworld.education" style={{ color: GOLD, textDecoration: 'none' }}>khurram@newworld.education</a>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)', marginTop: 8 }}>NewWorldEdu — Academic excellence, available everywhere</div>
        </div>
      </div>
    </>
  );
}
