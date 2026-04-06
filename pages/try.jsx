/**
 * pages/try.jsx — Zero-Friction Entry Point
 * ─────────────────────────────────────────────────────────────────
 * This is where email campaign links land.
 * NO LOGIN REQUIRED. Student picks subject → starts immediately.
 * Captures email after first session (not before).
 *
 * Flow: Email CTA → /try → Pick subject → Start learning → Capture email after
 */

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SYLLABUS, getTopicsForSubject } from '../utils/syllabusStructure';
import LegalFooter from '../components/LegalFooter';

const GOLD = '#C9A84C';
const SUBJECTS = Object.keys(SYLLABUS);

const POPULAR = ['Chemistry', 'Physics', 'Mathematics', 'Biology', 'Pakistan Studies', 'Islamiyat', 'English Language', 'Accounting'];

export default function TryPage() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showAll, setShowAll] = useState(false);

  const goToStudy = (subject) => {
    // Save that they came from campaign
    try { localStorage.setItem('nw_source', 'campaign'); } catch {}
    router.push(`/study?subject=${encodeURIComponent(subject)}&level=O+Level`);
  };

  const goToBootcamp = () => {
    try { localStorage.setItem('nw_source', 'campaign'); } catch {}
    router.push('/bootcamp');
  };

  const goToChallenge = () => {
    try { localStorage.setItem('nw_source', 'campaign'); } catch {}
    router.push('/daily-challenge');
  };

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 600, margin: '0 auto', padding: '0 16px' },
  };

  return (
    <>
      <Head>
        <title>Try Starky Free — Cambridge O Level AI Tutor | NewWorldEdu</title>
        <meta name="description" content="Start learning Cambridge O Level subjects with AI-powered revision notes, past paper questions, and mark scheme intelligence. No login needed. Free." />
      </Head>
      <div style={S.page}>
        <div style={S.container}>

          {/* Hero */}
          <div style={{ textAlign: 'center', padding: '60px 0 40px' }}>
            <div style={{ fontSize: 14, fontWeight: 900 }}>NewWorldEdu<span style={{ color: GOLD, marginLeft: 4 }}>★</span></div>
            <h1 style={{ fontSize: 32, fontWeight: 900, margin: '20px 0 12px', lineHeight: 1.2 }}>
              Pick a subject.<br />
              <span style={{ color: GOLD }}>Start learning now.</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 15, lineHeight: 1.7, maxWidth: 420, margin: '0 auto' }}>
              Revision notes. Worked examples. Past paper practice. Mark scheme language. All free. No login needed.
            </p>
          </div>

          {/* Popular Subjects */}
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: 1, marginBottom: 10 }}>MOST POPULAR</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 20 }}>
            {POPULAR.map(s => {
              const chapters = getTopicsForSubject(s).length;
              return (
                <button key={s} onClick={() => goToStudy(s)}
                  style={{
                    padding: '18px 14px', borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                    background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)',
                    color: '#fff', transition: 'all 0.2s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,.4)'; e.currentTarget.style.background = 'rgba(201,168,76,.04)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)'; e.currentTarget.style.background = 'rgba(255,255,255,.03)'; }}>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{s}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 4 }}>{chapters} chapters · Revision notes ready</div>
                </button>
              );
            })}
          </div>

          {/* All Subjects */}
          {!showAll && (
            <button onClick={() => setShowAll(true)}
              style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,.06)', background: 'none', color: 'rgba(255,255,255,.4)', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 20 }}>
              Show all {SUBJECTS.length} subjects ▾
            </button>
          )}

          {showAll && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 20 }}>
              {SUBJECTS.filter(s => !POPULAR.includes(s)).map(s => (
                <button key={s} onClick={() => goToStudy(s)}
                  style={{ padding: '14px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'left', background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.04)', color: '#fff' }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{s}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.25)' }}>{getTopicsForSubject(s).length} chapters</div>
                </button>
              ))}
            </div>
          )}

          {/* Alternative entry points */}
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: 1, marginBottom: 10 }}>OR TRY THESE</div>

          <button onClick={goToChallenge}
            style={{ width: '100%', padding: '16px 18px', borderRadius: 14, cursor: 'pointer', textAlign: 'left', background: 'rgba(79,142,247,.06)', border: '1px solid rgba(79,142,247,.2)', color: '#fff', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 28 }}>🏆</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>Daily Challenge</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Same 5 questions for everyone. Can you top the leaderboard?</div>
            </div>
          </button>

          <button onClick={goToBootcamp}
            style={{ width: '100%', padding: '16px 18px', borderRadius: 14, cursor: 'pointer', textAlign: 'left', background: 'rgba(201,168,76,.04)', border: '1px solid rgba(201,168,76,.15)', color: '#fff', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 28 }}>🎯</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>Start a Bootcamp</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Set your goal. Get a personalized daily plan. Follow it until exam day.</div>
            </div>
          </button>

          {/* What you get */}
          <div style={{ background: 'rgba(201,168,76,.03)', border: '1px solid rgba(201,168,76,.1)', borderRadius: 14, padding: '20px 18px', margin: '24px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 12 }}>WHAT YOU GET — FREE</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, textAlign: 'left' }}>
              {[
                { icon: '📝', text: 'Revision notes for every chapter' },
                { icon: '📖', text: 'Worked examples with full answers' },
                { icon: '⚡', text: '50,000+ verified past paper questions' },
                { icon: '⚠️', text: 'Common mistakes from examiner reports' },
                { icon: '🎯', text: 'Mark scheme language — exact phrases' },
                { icon: '🌍', text: 'Works in Urdu, English, any language' },
              ].map(f => (
                <div key={f.text} style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', lineHeight: 1.5 }}>
                  <span style={{ marginRight: 6 }}>{f.icon}</span>{f.text}
                </div>
              ))}
            </div>
          </div>

          {/* Trust */}
          <div style={{ textAlign: 'center', padding: '0 0 40px' }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.3)', marginBottom: 8 }}>
              Built for Pakistani Cambridge students by a Pakistani father.
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.2)' }}>
              17 subjects · 193 textbook chapters · 50,000+ questions · Free to start
            </div>
          </div>

        </div>
        <LegalFooter />
      </div>
    </>
  );
}
