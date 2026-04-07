/**
 * pages/mite-faculty.jsx — MiTE Faculty Analytics Dashboard
 * ─────────────────────────────────────────────────────────────────
 * Real-time learning analytics for MiTE faculty.
 * Student activity, topic weaknesses, cohort performance.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import LegalFooter from '../components/LegalFooter';

const GOLD = '#C9A84C';

export default function MiTEFaculty() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('all');

  const fetchData = async (pw) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/monitor-sessions?password=${encodeURIComponent(pw || password)}`);
      if (res.status === 401) { setAuthenticated(false); setLoading(false); return; }
      const d = await res.json();
      setData(d);
      setAuthenticated(true);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(() => fetchData(), 30000);
    return () => clearInterval(interval);
  }, [authenticated, password]);

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 900, margin: '0 auto' },
    card: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '16px 14px', marginBottom: 8 },
  };

  if (!authenticated) return (
    <div style={S.page}>
      <div style={{ ...S.container, textAlign: 'center', paddingTop: 100 }}>
        <Head><title>Faculty Dashboard — MiTE × NewWorldEdu</title><meta name="robots" content="noindex" /></Head>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>MiTE Faculty Dashboard</h1>
        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 14, marginBottom: 24 }}>Learning analytics for faculty and administration</p>
        <input type="password" placeholder="Faculty password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchData(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', color: '#fff', fontSize: 16, width: 300, textAlign: 'center', outline: 'none', marginBottom: 12 }} />
        <br />
        <button onClick={() => fetchData()} style={{ background: GOLD, color: '#0a0a0a', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Enter</button>
      </div>
    </div>
  );

  const students = data?.students || [];
  const tracked = data?.tracked || {};

  return (
    <div style={S.page}>
      <Head><title>📊 MiTE Faculty Dashboard | NewWorldEdu</title><meta name="robots" content="noindex" /></Head>
      <div style={S.container}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>📊 MiTE Faculty Dashboard</h1>
            <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 12 }}>
              Learning Analytics · Auto-refreshes every 30s {loading && '⟳'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'BBA', 'BSCS', 'Law'].map(p => (
              <button key={p} onClick={() => setSelectedProgram(p)}
                style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  background: selectedProgram === p ? 'rgba(79,142,247,.15)' : 'rgba(255,255,255,.03)',
                  border: selectedProgram === p ? '1px solid #4F8EF7' : '1px solid rgba(255,255,255,.06)',
                  color: selectedProgram === p ? '#4F8EF7' : 'rgba(255,255,255,.4)' }}>
                {p === 'all' ? 'All' : p}
              </button>
            ))}
          </div>
        </div>

        {/* Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
          <div style={S.card}>
            <div style={{ fontSize: 28, fontWeight: 900, color: GOLD }}>{data?.last24h?.activeStudents || 0}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Active Students (24h)</div>
          </div>
          <div style={S.card}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#4F8EF7' }}>{data?.last24h?.totalQuestions || 0}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Questions Attempted</div>
          </div>
          <div style={S.card}>
            <div style={{ fontSize: 28, fontWeight: 900, color: data?.last24h?.totalQuestions > 0 ? (data.last24h.totalCorrect / data.last24h.totalQuestions >= 0.7 ? '#4ADE80' : '#F97316') : 'rgba(255,255,255,.2)' }}>
              {data?.last24h?.totalQuestions > 0 ? Math.round((data.last24h.totalCorrect / data.last24h.totalQuestions) * 100) + '%' : '—'}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Avg Accuracy</div>
          </div>
          <div style={S.card}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#7C3AED' }}>{students.length}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Total Enrolled</div>
          </div>
        </div>

        {/* Intervention Alerts */}
        {students.filter(s => s.accuracy < 50 && s.total > 5).length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#EF4444', letterSpacing: 1, marginBottom: 8 }}>⚠ INTERVENTION NEEDED</div>
            {students.filter(s => s.accuracy < 50 && s.total > 5).map(s => (
              <div key={s.email} style={{ ...S.card, borderColor: 'rgba(239,68,68,.2)', background: 'rgba(239,68,68,.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{s.email}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{s.subjects?.join(', ')} · {s.total} Qs attempted</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#EF4444' }}>{s.accuracy}%</div>
              </div>
            ))}
          </div>
        )}

        {/* Student List */}
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: 1, marginBottom: 8 }}>ALL STUDENTS</div>

        {students.length === 0 && (
          <div style={{ ...S.card, textAlign: 'center', padding: '32px 16px' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📚</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: GOLD }}>No student activity yet</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginTop: 8 }}>
              Share newworld.education/mite-prep with students to begin
            </div>
          </div>
        )}

        {students.map(s => (
          <div key={s.email} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: s.total > 0 ? 'rgba(79,142,247,.1)' : 'rgba(255,255,255,.04)', border: `1px solid ${s.total > 0 ? 'rgba(79,142,247,.2)' : 'rgba(255,255,255,.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: s.total > 0 ? '#4F8EF7' : 'rgba(255,255,255,.3)', flexShrink: 0 }}>
              {(s.email || '?').charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{s.email}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>
                {s.subjects?.join(', ') || 'No subjects yet'} · {s.total} questions
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: s.accuracy >= 70 ? '#4ADE80' : s.total > 0 ? '#F97316' : 'rgba(255,255,255,.2)' }}>
                {s.total > 0 ? `${s.accuracy}%` : '—'}
              </div>
            </div>
          </div>
        ))}

        {/* Platform capabilities */}
        <div style={{ ...S.card, marginTop: 24, background: 'rgba(201,168,76,.04)', borderColor: 'rgba(201,168,76,.15)', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, marginBottom: 8 }}>PLATFORM CAPABILITIES</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, fontSize: 12, color: 'rgba(255,255,255,.5)' }}>
            <div>📊 Real-time analytics</div>
            <div>⚠️ Auto intervention alerts</div>
            <div>📈 Topic-level weakness detection</div>
            <div>🎯 Predicted exam readiness</div>
            <div>📧 Weekly faculty reports</div>
            <div>🔒 Student data privacy</div>
          </div>
        </div>

      </div>
      <LegalFooter />
    </div>
  );
}
