/**
 * pages/mite-portal.jsx — MiTE University × NewWorldEdu
 * ─────────────────────────────────────────────────────────────────
 * Not a demo. Not a prototype. A fully functional AI education
 * platform for Pakistan's most innovative university.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LegalFooter from '../components/LegalFooter';

const GOLD = '#C9A84C';

export default function MiTEPortal() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [profile, setProfile] = useState({});
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsMobile(window.innerWidth < 768);
    try { setProfile(JSON.parse(localStorage.getItem('nw_user') || '{}')); } catch {}
    const h = new Date().getHours();
    setTimeOfDay(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 21 ? 'Good evening' : 'Late night study?');
  }, []);

  const isRegistered = profile.name && profile.curriculum === 'mite';
  const firstName = profile.name?.split(' ')[0] || '';

  const S = {
    page: { minHeight: '100vh', background: '#080C18', color: '#FAF6EB', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 720, margin: '0 auto', padding: '0 16px' },
    glass: { background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 16, padding: '20px 18px', marginBottom: 10, backdropFilter: 'blur(10px)' },
  };

  return (
    <>
      <Head>
        <title>MiTE University — AI-Powered Learning Platform</title>
        <meta name="description" content="MiTE University's complete AI education platform. Entrance prep, course study, past papers, and faculty analytics for BBA, BSCS, and Law." />
      </Head>
      <div style={S.page}>
        <div style={S.container}>

          {/* ═══ HERO ═══ */}
          <div style={{ textAlign: 'center', padding: '52px 0 36px' }}>
            {isRegistered ? (
              <>
                <div style={{ fontSize: 14, color: 'rgba(250,246,235,0.4)' }}>{timeOfDay}</div>
                <h1 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 900, margin: '8px 0 0' }}>
                  {firstName}, <span style={{ color: GOLD }}>let's study.</span>
                </h1>
                <div style={{ fontSize: 13, color: 'rgba(250,246,235,0.35)', marginTop: 8 }}>
                  {profile.program} · Semester {profile.semester || '1'} · MiTE University
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'inline-block', background: `${GOLD}12`, border: `1px solid ${GOLD}25`, borderRadius: 100, padding: '5px 16px', fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.05em', marginBottom: 16 }}>
                  MiTE UNIVERSITY × NEWWORLDEDU
                </div>
                <h1 style={{ fontSize: isMobile ? 30 : 44, fontWeight: 900, margin: '0 0 12px', lineHeight: 1.15 }}>
                  1,851 real exam questions.<br />
                  <span style={{ color: GOLD }}>Zero hallucinations.</span>
                </h1>
                <p style={{ fontSize: 16, color: 'rgba(250,246,235,0.45)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 24px' }}>
                  19,000+ verified questions for BBA, BS-CS, BS-FD, and Accounting. Course support for every semester. An AI tutor that speaks your language. Built for MiTE.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => router.push('/mite-register')}
                    style={{ background: GOLD, color: '#080C18', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 900, cursor: 'pointer' }}>
                    Start Free — 14 Days →
                  </button>
                  <button onClick={() => router.push('/mite-faculty')}
                    style={{ background: 'transparent', border: `2px solid rgba(250,246,235,0.15)`, color: 'rgba(250,246,235,0.6)', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Faculty Login
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ═══ THE NUMBERS — what makes this real ═══ */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 28 }}>
            {[
              { n: '19K+', l: 'Questions', sub: 'Verified from source' },
              { n: '5', l: 'Programs', sub: 'BBA · CS · FD · Acct · MS' },
              { n: '40+', l: 'Courses', sub: 'All semesters' },
              { n: '8', l: 'Semesters', sub: 'Full curriculum' },
              { n: '24/7', l: 'AI Tutor', sub: 'Urdu + English' },
            ].map(s => (
              <div key={s.l} style={{ textAlign: 'center', padding: '14px 4px' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: GOLD }}>{s.n}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(250,246,235,0.5)' }}>{s.l}</div>
                <div style={{ fontSize: 8, color: 'rgba(250,246,235,0.25)' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* ═══ 11:14 PM SCENARIO — the hook ═══ */}
          <div style={{ ...S.glass, background: 'rgba(201,168,76,0.04)', borderColor: 'rgba(201,168,76,0.12)', marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontSize: 32, fontWeight: 900, color: GOLD, fontFamily: "'Georgia',serif" }}>11:14 PM</div>
                <div style={{ fontSize: 14, color: 'rgba(250,246,235,0.4)', fontStyle: 'italic', marginBottom: 12 }}>A MiTE student. Database Systems final tomorrow.</div>
                <div style={{ fontSize: 13, color: 'rgba(250,246,235,0.55)', lineHeight: 1.7 }}>
                  No tutor available. YouTube has 400 videos, none for your syllabus. ChatGPT doesn't know what your professor expects. Your notes are incomplete.
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: GOLD, marginBottom: 8 }}>WITH NEWWORLDEDU:</div>
                {[
                  'Opens the platform. Types "Binary Search Tree"',
                  'Gets verified MCQs on SQL, normalization, ER diagrams',
                  'Practices with real exam questions',
                  'Starky explains what they got wrong',
                  'Goes to bed knowing exactly what to write',
                ].map((t, i) => (
                  <div key={i} style={{ fontSize: 12, color: 'rgba(250,246,235,0.6)', padding: '3px 0' }}>
                    <span style={{ color: '#4ADE80', marginRight: 6 }}>✓</span>{t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ THREE ENTRY POINTS — clear, no confusion ═══ */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
            {[
              { icon: '🎯', title: 'Entrance Prep', desc: 'MiTE admission test practice — BBA, BS-CS, BS-FD sections', href: '/mite-prep', color: GOLD },
              { icon: '📚', title: 'Course Study', desc: '40+ courses across 5 programs. AI tutor per topic.', href: '/mite-study', color: '#4F8EF7' },
              { icon: '📕', title: 'Books & Resources', desc: 'HEC-prescribed textbooks + OpenStax free alternatives', href: '/mite-books', color: '#4ADE80' },
            ].map(f => (
              <a key={f.title} href={f.href}
                style={{ ...S.glass, textDecoration: 'none', cursor: 'pointer', textAlign: 'center', padding: '28px 16px', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.background = `${f.color}08`; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(250,246,235,0.06)'; e.currentTarget.style.background = 'rgba(250,246,235,0.03)'; }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 900, color: f.color, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(250,246,235,0.4)', lineHeight: 1.6 }}>{f.desc}</div>
              </a>
            ))}
          </div>

          {/* ═══ PROGRAMS — what's inside ═══ */}
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(250,246,235,0.25)', letterSpacing: 1, marginBottom: 10 }}>PROGRAMS</div>
          {[
            { name: 'BBA', icon: '💼', color: '#4F8EF7', courses: ['Principles of Management', 'Financial Accounting', 'Microeconomics', 'Marketing Management', 'Business Statistics', 'Organizational Behavior'], papers: 'OpenStax textbooks + HEC curriculum' },
            { name: 'BS-CS', icon: '💻', color: '#4ADE80', courses: ['Programming Fundamentals', 'Data Structures', 'OOP', 'Database Systems', 'Operating Systems', 'Computer Networks'], papers: '15K+ CS MCQs + NCEAC curriculum' },
            { name: 'BS-FD', icon: '🎨', color: '#7C3AED', courses: ['Fashion Illustration', 'Pattern Making', 'Textile Science', 'Color Theory', 'Digital Design (CAD)', 'Fashion Business'], papers: 'HEC Fashion Design curriculum' },
            { name: 'Accounting', icon: '📊', color: '#F97316', courses: ['Financial Accounting', 'Cost Accounting', 'Auditing', 'Taxation', 'Corporate Finance', 'Investment Analysis'], papers: 'ACCA specimen papers + MCQs' },
          ].map(prog => (
            <div key={prog.name} style={{ ...S.glass, marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>{prog.icon}</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: prog.color }}>{prog.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.35)' }}>{prog.papers}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {prog.courses.map(c => (
                  <span key={c} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: `${prog.color}10`, border: `1px solid ${prog.color}20`, color: prog.color, fontWeight: 600 }}>{c}</span>
                ))}
              </div>
            </div>
          ))}

          {/* ═══ WHAT MAKES THIS DIFFERENT ═══ */}
          <div style={{ ...S.glass, marginTop: 20, marginBottom: 20, background: 'rgba(250,246,235,0.02)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 14, textAlign: 'center' }}>WHY THIS ISN'T CHATGPT</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { bad: 'ChatGPT generates answers from training data — may be wrong', good: 'Our questions come from REAL IBA, FAST, LAT papers — verified' },
                { bad: 'Generic AI has no idea what your professor expects', good: 'Starky is trained on actual Pakistani university exam patterns' },
                { bad: 'No progress tracking, no weakness detection', good: 'Every answer tracked. Weak topics identified. Faculty can see.' },
                { bad: 'Available in English only', good: 'Works in English, Urdu, Roman Urdu — 16 languages' },
              ].map((row, i) => (
                <div key={i}>
                  <div style={{ fontSize: 11, color: 'rgba(239,68,68,0.6)', marginBottom: 4 }}>
                    <span style={{ marginRight: 4 }}>✗</span>{row.bad}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(74,222,128,0.8)', fontWeight: 600 }}>
                    <span style={{ marginRight: 4 }}>✓</span>{row.good}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ THE VISION ═══ */}
          <div style={{ ...S.glass, textAlign: 'center', padding: '28px 20px', background: 'rgba(201,168,76,0.03)', borderColor: 'rgba(201,168,76,0.1)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 8 }}>THE BIGGER PICTURE</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#FAF6EB', marginBottom: 8 }}>
              MiTE → Roots Millennium → Every student in Pakistan
            </div>
            <p style={{ fontSize: 13, color: 'rgba(250,246,235,0.45)', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 16px' }}>
              MiTE is part of The Millennium Trust — the same trust behind Roots Millennium Schools, Pakistan's third-largest K-12 network. One AI platform. From Grade 6 to graduation.
            </p>
            <a href="/mite-vision" style={{ display: 'inline-block', background: GOLD, color: '#080C18', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 800, textDecoration: 'none', marginTop: 12, cursor: 'pointer' }}>
              See the Full Vision →
            </a>
          </div>

          {/* ═══ FOOTER CTA ═══ */}
          <div style={{ textAlign: 'center', padding: '28px 0 40px' }}>
            {!isRegistered && (
              <button onClick={() => router.push('/mite-register')}
                style={{ background: GOLD, color: '#080C18', border: 'none', borderRadius: 12, padding: '16px 40px', fontSize: 16, fontWeight: 900, cursor: 'pointer', marginBottom: 12 }}>
                Start Free — 14 Days →
              </button>
            )}
            <div style={{ fontSize: 12, color: 'rgba(250,246,235,0.2)' }}>
              Built by <a href="/founder" style={{ color: 'rgba(250,246,235,0.3)', textDecoration: 'none' }}>Khurram Badar</a> · newworld.education
            </div>
          </div>

        </div>
      </div>
      <LegalFooter />
    </>
  );
}
