/**
 * pages/garage-admin.jsx — Shabina's Teacher Dashboard for The Garage School
 * ─────────────────────────────────────────────────────────────────
 * Shows all Garage School student activity:
 * - Who's studying, what subject, when
 * - Chapter completion across all students
 * - MCQ accuracy by subject
 * - Who needs help (low accuracy)
 * - Total platform usage stats
 *
 * Password protected. Auto-refreshes every 30 seconds.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import LegalFooter from '../components/LegalFooter';

const GOLD = '#C9A84C';

export default function GarageAdmin() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = async (pw) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/garage-admin?password=${encodeURIComponent(pw || password)}`);
      if (res.status === 401) { setAuthenticated(false); setLoading(false); return; }
      const data = await res.json();
      setStudents(data.students || []);
      setAuthenticated(true);
      setLastRefresh(new Date());
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(() => fetchData(), 30000);
    return () => clearInterval(interval);
  }, [authenticated, password]);

  const totalStudents = students.length;
  const activeToday = students.filter(s => {
    const last = s.lastActive ? new Date(s.lastActive) : null;
    return last && (Date.now() - last.getTime()) < 24 * 60 * 60 * 1000;
  }).length;
  const totalChaptersDone = students.reduce((s, st) => s + (st.chaptersDone || 0), 0);
  const totalMcqsAnswered = students.reduce((s, st) => s + (st.mcqsAnswered || 0), 0);
  const avgAccuracy = totalMcqsAnswered > 0
    ? Math.round(students.reduce((s, st) => s + (st.mcqsCorrect || 0), 0) / totalMcqsAnswered * 100)
    : 0;

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 800, margin: '0 auto' },
    card: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '16px 14px', marginBottom: 8 },
  };

  if (!authenticated) return (
    <div style={S.page}>
      <div style={{ ...S.container, textAlign: 'center', paddingTop: 100 }}>
        <Head><title>Teacher Dashboard — The Garage School | NewWorldEdu</title><meta name="robots" content="noindex" /></Head>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🏫</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Garage School Dashboard</h1>
        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 14, marginBottom: 24 }}>For Shabina Mustafa and teachers</p>
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchData(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', color: '#fff', fontSize: 16, width: 300, textAlign: 'center', outline: 'none', marginBottom: 12 }} />
        <br />
        <button onClick={() => fetchData()} style={{ background: GOLD, color: '#0a0a0a', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Enter</button>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <Head><title>🏫 Garage School Dashboard | NewWorldEdu</title><meta name="robots" content="noindex" /></Head>
      <div style={S.container}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>🏫 Garage School Dashboard</h1>
            <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 12 }}>
              For Shabina Mustafa · {lastRefresh ? `Updated: ${lastRefresh.toLocaleTimeString()}` : ''} {loading && '⟳'}
            </div>
          </div>
          <button onClick={() => fetchData()} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '8px 16px', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>Refresh</button>
        </div>

        {/* Overview Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
          <div style={S.card}>
            <div style={{ fontSize: 28, fontWeight: 900, color: GOLD }}>{totalStudents}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Total Students</div>
          </div>
          <div style={S.card}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#4ADE80' }}>{activeToday}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Active Today</div>
          </div>
          <div style={S.card}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#4F8EF7' }}>{totalChaptersDone}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Chapters Done</div>
          </div>
          <div style={S.card}>
            <div style={{ fontSize: 28, fontWeight: 900, color: avgAccuracy >= 70 ? '#4ADE80' : '#F97316' }}>{avgAccuracy}%</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Avg MCQ Accuracy</div>
          </div>
        </div>

        {/* Students who need help */}
        {students.filter(s => s.accuracy < 50 && s.mcqsAnswered > 0).length > 0 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#EF4444', letterSpacing: 1, marginBottom: 8 }}>NEEDS ATTENTION</div>
            {students.filter(s => s.accuracy < 50 && s.mcqsAnswered > 0).map(s => (
              <div key={s.id} style={{ ...S.card, borderColor: 'rgba(239,68,68,.2)', background: 'rgba(239,68,68,.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{s.name || s.email || 'Student'}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>Class {s.class || '?'} · {s.weakSubject || 'Multiple subjects'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#EF4444' }}>{s.accuracy}%</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>accuracy</div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* All Students */}
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: 1, marginTop: 16, marginBottom: 8 }}>ALL STUDENTS</div>

        {students.length === 0 && (
          <div style={{ ...S.card, textAlign: 'center', padding: '32px 16px' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📚</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: GOLD }}>Abhi koi student registered nahi hai</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginTop: 8 }}>
              Students ko newworld.education/garageschool bhejein — woh automatically register ho jayenge
            </div>
          </div>
        )}

        {students.map(s => (
          <div key={s.id} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18, flexShrink: 0,
              background: s.chaptersDone > 0 ? 'rgba(74,222,128,.1)' : 'rgba(255,255,255,.04)',
              border: `1px solid ${s.chaptersDone > 0 ? 'rgba(74,222,128,.2)' : 'rgba(255,255,255,.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: s.chaptersDone > 0 ? '#4ADE80' : 'rgba(255,255,255,.3)',
            }}>
              {s.name ? s.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{s.name || s.email || 'Student'}</div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>
                <span>Class {s.class || '?'}</span>
                <span>{s.chaptersDone || 0} chapters</span>
                {s.mcqsAnswered > 0 && <span style={{ color: s.accuracy >= 70 ? '#4ADE80' : '#F97316' }}>MCQ: {s.accuracy}%</span>}
                {s.lastActive && <span>{new Date(s.lastActive).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>}
              </div>
              {s.subjects?.length > 0 && (
                <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                  {s.subjects.map(sub => (
                    <span key={sub} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(79,142,247,.08)', color: '#4F8EF7', border: '1px solid rgba(79,142,247,.15)' }}>{sub}</span>
                  ))}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: s.accuracy >= 70 ? '#4ADE80' : s.mcqsAnswered > 0 ? '#F97316' : 'rgba(255,255,255,.2)' }}>
                {s.mcqsAnswered > 0 ? `${s.accuracy}%` : '—'}
              </div>
            </div>
          </div>
        ))}

      </div>
      <LegalFooter />
    </div>
  );
}
