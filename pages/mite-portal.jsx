/**
 * pages/mite-portal.jsx — MiTE University Complete Portal
 * ─────────────────────────────────────────────────────────────────
 * The ultimate education platform for MiTE University.
 * Students, faculty, and administration — everything in one place.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LegalFooter from '../components/LegalFooter';

const GOLD = '#C9A84C';
const BLUE = '#4F8EF7';
const GREEN = '#4ADE80';
const PURPLE = '#7C3AED';

const STUDENT_FEATURES = [
  { icon: '🎯', title: 'Entrance Test Prep', desc: 'BBA, BSCS, Law — AI-powered practice with real past papers', href: '/mite-prep', color: GOLD },
  { icon: '📚', title: 'Course Study', desc: 'Notes, examples, and practice for every semester course', href: '/mite-study', color: BLUE },
  { icon: '📝', title: 'Past Papers Archive', desc: 'IBA, LUMS, FAST, LAT — real exam papers to practice', href: '/mite-papers', color: GREEN },
  { icon: '🎯', title: 'My Bootcamp', desc: 'Set your goal. Get a daily study plan. Follow it.', href: '/mite-bootcamp', color: PURPLE },
  { icon: '📊', title: 'My Progress', desc: 'Track accuracy, courses completed, weak areas', href: '/mite-progress', color: '#F97316' },
  { icon: '★', title: 'Ask Starky', desc: 'Your 24/7 AI tutor — any course, any topic, any language', href: '/?message=I%20am%20a%20MiTE%20University%20student.%20Help%20me%20study.', color: '#EAB308' },
];

const FACULTY_FEATURES = [
  { icon: '📊', title: 'Student Analytics', desc: 'Real-time performance data for your class', href: '/mite-faculty' },
  { icon: '⚠️', title: 'Intervention Alerts', desc: 'Auto-detect students falling behind', href: '/mite-faculty' },
  { icon: '📋', title: 'Course Reports', desc: 'Topic-level weakness analysis per course', href: '/mite-faculty' },
];

const PROGRAMS = [
  { id: 'bba', name: 'BBA', icon: '💼', color: BLUE, courses: 9, desc: 'Business Administration', semesters: 2 },
  { id: 'bscs', name: 'BSCS', icon: '💻', color: GREEN, courses: 8, desc: 'Computer Science', semesters: 2 },
  { id: 'law', name: 'Law', icon: '⚖️', color: PURPLE, courses: 7, desc: 'Law Program', semesters: 2 },
];

export default function MiTEPortal() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [role, setRole] = useState('student');
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
      try {
        const p = JSON.parse(localStorage.getItem('nw_user') || '{}');
        if (p.name) setStudentName(p.name);
      } catch {}
    }
  }, []);

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 800, margin: '0 auto', padding: '0 16px' },
    card: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '20px 18px', marginBottom: 10 },
  };

  return (
    <>
      <Head>
        <title>MiTE University Portal — AI-Powered Education | NewWorldEdu</title>
        <meta name="description" content="MiTE University's AI-powered learning platform. Entrance test prep, course study, past papers, and faculty analytics for BBA, BSCS, and Law programs." />
      </Head>
      <div style={S.page}>
        <div style={S.container}>

          {/* Hero */}
          <div style={{ textAlign: 'center', padding: '48px 0 32px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 12 }}>MiTE UNIVERSITY × NEWWORLDEDU</div>
            <h1 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 900, margin: '0 0 12px', lineHeight: 1.2 }}>
              {studentName ? `Welcome, ${studentName.split(' ')[0]}` : 'Your University.'} <span style={{ color: GOLD }}>Your AI Tutor.</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
              BBA · BSCS · Law — entrance prep, course study, past papers, and 24/7 AI support
            </p>
          </div>

          {/* Role Toggle */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
            {[
              { id: 'student', label: '🎓 Student', color: BLUE },
              { id: 'faculty', label: '👨‍🏫 Faculty', color: GOLD },
            ].map(r => (
              <button key={r.id} onClick={() => setRole(r.id)}
                style={{
                  padding: '10px 24px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700,
                  background: role === r.id ? `${r.color}20` : 'rgba(255,255,255,.03)',
                  border: role === r.id ? `2px solid ${r.color}` : '1px solid rgba(255,255,255,.06)',
                  color: role === r.id ? r.color : 'rgba(255,255,255,.5)',
                }}>
                {r.label}
              </button>
            ))}
          </div>

          {/* Student View */}
          {role === 'student' && (
            <>
              {/* Quick Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
                {[
                  { n: '54K+', l: 'Questions', c: GOLD },
                  { n: '500+', l: 'Notes', c: BLUE },
                  { n: '3', l: 'Programs', c: GREEN },
                  { n: '24/7', l: 'AI Tutor', c: PURPLE },
                ].map(s => (
                  <div key={s.l} style={S.card}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: s.c }}>{s.n}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)' }}>{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Programs */}
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: 1, marginBottom: 10 }}>YOUR PROGRAM</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
                {PROGRAMS.map(p => (
                  <button key={p.id} onClick={() => router.push('/mite-study')}
                    style={{ ...S.card, cursor: 'pointer', textAlign: 'center', padding: '20px 10px', borderColor: `${p.color}22` }}
                    onMouseOver={e => e.currentTarget.style.borderColor = p.color}
                    onMouseOut={e => e.currentTarget.style.borderColor = `${p.color}22`}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{p.icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: p.color }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>{p.courses} courses · {p.semesters} semesters</div>
                  </button>
                ))}
              </div>

              {/* Features Grid */}
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: 1, marginBottom: 10 }}>EVERYTHING YOU NEED</div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 8, marginBottom: 24 }}>
                {STUDENT_FEATURES.map(f => (
                  <a key={f.title} href={f.href}
                    style={{ ...S.card, display: 'flex', alignItems: 'flex-start', gap: 14, textDecoration: 'none', cursor: 'pointer' }}
                    onMouseOver={e => e.currentTarget.style.borderColor = f.color}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'}>
                    <span style={{ fontSize: 24, flexShrink: 0 }}>{f.icon}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: f.color, marginBottom: 2 }}>{f.title}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', lineHeight: 1.5 }}>{f.desc}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Register CTA */}
              {!studentName && (
                <div style={{ ...S.card, textAlign: 'center', background: 'rgba(201,168,76,.04)', borderColor: 'rgba(201,168,76,.15)', padding: '24px 20px' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: GOLD, marginBottom: 8 }}>Not registered yet?</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 16 }}>Create your account to track progress and save your work</div>
                  <button onClick={() => router.push('/mite-register')}
                    style={{ background: GOLD, color: '#0a0a0a', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                    Register →
                  </button>
                </div>
              )}

              {/* Cambridge pathway */}
              <a href="/study" style={{ display: 'block', ...S.card, textDecoration: 'none', textAlign: 'center', borderColor: 'rgba(79,142,247,.15)', background: 'rgba(79,142,247,.03)', marginTop: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: BLUE }}>Also available: Cambridge O & A Level</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>26 subjects · 334 verified notes · 54K+ past paper questions</div>
              </a>
            </>
          )}

          {/* Faculty View */}
          {role === 'faculty' && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: 1, marginBottom: 10 }}>FACULTY TOOLS</div>
              {FACULTY_FEATURES.map(f => (
                <a key={f.title} href={f.href}
                  style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', cursor: 'pointer' }}
                  onMouseOver={e => e.currentTarget.style.borderColor = GOLD}
                  onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'}>
                  <span style={{ fontSize: 24 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: GOLD }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>{f.desc}</div>
                  </div>
                </a>
              ))}

              <div style={{ ...S.card, marginTop: 16, textAlign: 'center', background: 'rgba(201,168,76,.04)', borderColor: 'rgba(201,168,76,.15)' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: GOLD, marginBottom: 8 }}>What Faculty Gets</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: 'rgba(255,255,255,.5)', textAlign: 'left' }}>
                  <div>📊 Real-time student activity</div>
                  <div>⚠️ Auto intervention alerts</div>
                  <div>📈 Topic-level weakness data</div>
                  <div>🎯 Exam readiness predictions</div>
                  <div>📧 Weekly automated reports</div>
                  <div>🔒 FERPA-compliant privacy</div>
                </div>
              </div>
            </>
          )}

          {/* About */}
          <div style={{ textAlign: 'center', padding: '24px 0 40px' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.2)' }}>
              Powered by NewWorldEdu · 54,000+ verified questions · AI tutor in 16 languages
            </div>
            <a href="/founder" style={{ fontSize: 11, color: 'rgba(255,255,255,.15)', textDecoration: 'none' }}>Built by Khurram Badar</a>
          </div>

        </div>
      </div>
      <LegalFooter />
    </>
  );
}
