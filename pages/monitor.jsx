/**
 * pages/monitor.jsx — Live Session Monitor for Khurram
 * ─────────────────────────────────────────────────────────────────
 * Watch Yusuf and Dina's study sessions in real-time.
 * Auto-refreshes every 15 seconds.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';

const MASTERY_NAMES = ['Not Started', 'Recall', 'Apply', 'Analyze', 'Exam Ready', 'Mastered'];
const MASTERY_COLORS = ['#555', '#EF4444', '#F97316', '#EAB308', '#4ADE80', '#4F8EF7'];

export default function Monitor() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = async (pw) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/monitor-sessions?password=${encodeURIComponent(pw || password)}`);
      if (res.status === 401) { setAuthenticated(false); setLoading(false); return; }
      const d = await res.json();
      setData(d);
      setAuthenticated(true);
      setLastRefresh(new Date());
    } catch {}
    setLoading(false);
  };

  // Auto-refresh every 15 seconds
  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(() => fetchData(), 15000);
    return () => clearInterval(interval);
  }, [authenticated, password]);

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 800, margin: '0 auto' },
    card: { background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 14, padding: '20px 18px', marginBottom: 16 },
    gold: { color: '#C9A84C' },
    green: { color: '#4ADE80' },
    blue: { color: '#4F8EF7' },
    dim: { color: 'rgba(255,255,255,.4)' },
  };

  if (!authenticated) return (
    <div style={S.page}>
      <div style={{ ...S.container, textAlign: 'center', paddingTop: 100 }}>
        <Head><title>Session Monitor | NewWorldEdu</title><meta name="robots" content="noindex" /></Head>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📡</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>Session Monitor</h1>
        <input type="password" placeholder="Dashboard password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchData(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', color: '#fff', fontSize: 16, width: 300, textAlign: 'center', marginBottom: 12, outline: 'none' }} />
        <br />
        <button onClick={() => fetchData()} style={{ background: '#4F8EF7', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          Enter
        </button>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <Head><title>📡 Live Monitor | NewWorldEdu</title><meta name="robots" content="noindex" /></Head>
      <div style={S.container}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>📡 Live Monitor</h1>
            <div style={S.dim}>
              {lastRefresh ? `Last refresh: ${lastRefresh.toLocaleTimeString()}` : 'Loading...'}
              {loading && ' ⟳'}
            </div>
          </div>
          <button onClick={() => fetchData()} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '8px 16px', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
            Refresh Now
          </button>
        </div>

        {/* Summary */}
        {data?.last24h && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            <div style={S.card}>
              <div style={{ fontSize: 28, fontWeight: 900, ...S.gold }}>{data.last24h.activeStudents}</div>
              <div style={{ fontSize: 12, ...S.dim }}>Active students (24h)</div>
            </div>
            <div style={S.card}>
              <div style={{ fontSize: 28, fontWeight: 900, ...S.blue }}>{data.last24h.totalQuestions}</div>
              <div style={{ fontSize: 12, ...S.dim }}>Questions attempted</div>
            </div>
            <div style={S.card}>
              <div style={{ fontSize: 28, fontWeight: 900, ...S.green }}>
                {data.last24h.totalQuestions > 0 ? Math.round((data.last24h.totalCorrect / data.last24h.totalQuestions) * 100) : 0}%
              </div>
              <div style={{ fontSize: 12, ...S.dim }}>Accuracy</div>
            </div>
          </div>
        )}

        {/* Tracked Students — Yusuf & Dina */}
        {data?.tracked && Object.entries(data.tracked).map(([email, student]) => (
          <div key={email} style={{ ...S.card, borderColor: student.totalAttempted > 0 ? 'rgba(74,222,128,.3)' : 'rgba(255,255,255,.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>
                  {student.name === 'Yusuf' ? '👦' : '👧'} {student.name}
                  {student.totalAttempted > 0 && <span style={{ ...S.green, fontSize: 12, marginLeft: 8 }}>● ACTIVE</span>}
                  {student.totalAttempted === 0 && <span style={{ ...S.dim, fontSize: 12, marginLeft: 8 }}>○ Not started yet</span>}
                </div>
                <div style={{ fontSize: 12, ...S.dim }}>{email}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 900, ...S.blue }}>{student.totalAttempted}</div>
                <div style={{ fontSize: 10, ...S.dim }}>questions</div>
              </div>
            </div>

            {student.totalAttempted > 0 && (
              <>
                {/* Accuracy */}
                <div style={{ fontSize: 13, marginBottom: 8 }}>
                  Accuracy: <span style={{ fontWeight: 800, color: student.totalCorrect / student.totalAttempted >= 0.7 ? '#4ADE80' : '#F97316' }}>
                    {Math.round((student.totalCorrect / student.totalAttempted) * 100)}%
                  </span>
                  ({student.totalCorrect}/{student.totalAttempted} correct)
                </div>

                {/* Subjects */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {student.subjectsCovered.map(s => (
                    <span key={s} style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: 'rgba(79,142,247,.1)', color: '#4F8EF7', border: '1px solid rgba(79,142,247,.2)' }}>{s}</span>
                  ))}
                </div>

                {/* Mastery */}
                {student.mastery.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, ...S.dim, marginBottom: 6 }}>TOPIC MASTERY</div>
                    {student.mastery.slice(0, 10).map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 12 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 4, background: MASTERY_COLORS[m.mastery_level], flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>{m.subject} — {m.topic}</div>
                        <div style={{ fontWeight: 700, color: MASTERY_COLORS[m.mastery_level] }}>{MASTERY_NAMES[m.mastery_level]}</div>
                        <div style={S.dim}>{m.questions_attempted > 0 ? `${Math.round((m.questions_correct / m.questions_attempted) * 100)}%` : ''}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recent Activity */}
                {student.recentActivity.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, ...S.dim, marginBottom: 6 }}>RECENT ACTIVITY</div>
                    {student.recentActivity.slice(0, 10).map((a, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', fontSize: 12 }}>
                        <span>{a.correct ? '✅' : '❌'}</span>
                        <span>{a.subject} — {a.topic}</span>
                        <span style={S.dim}>{new Date(a.created_at).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {student.totalAttempted === 0 && (
              <div style={{ fontSize: 13, ...S.dim, fontStyle: 'italic' }}>
                Waiting for {student.name} to start a study session...
              </div>
            )}
          </div>
        ))}

        {/* All Active Students */}
        {data?.students?.length > 0 && (
          <div style={S.card}>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>All Active Students (24h)</div>
            {data.students.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < data.students.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none', fontSize: 13 }}>
                <div style={{ flex: 1 }}>{s.email}</div>
                <div>{s.subjects.join(', ')}</div>
                <div style={{ fontWeight: 700, color: s.accuracy >= 70 ? '#4ADE80' : '#F97316' }}>{s.accuracy}%</div>
                <div style={S.dim}>{s.total} Qs</div>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div style={{ ...S.card, borderColor: 'rgba(201,168,76,.2)', background: 'rgba(201,168,76,.03)' }}>
          <div style={{ fontSize: 14, fontWeight: 800, ...S.gold, marginBottom: 8 }}>How to test with Yusuf & Dina</div>
          <ol style={{ fontSize: 13, lineHeight: 1.8, paddingLeft: 20, margin: 0, color: 'rgba(255,255,255,.7)' }}>
            <li>Ask them to open <strong>newworld.education/study</strong> on their phone/laptop</li>
            <li>Log in with Google (Yusuf: myusufkhurram1@gmail.com, Dina: dinakhurram1@gmail.com)</li>
            <li>Pick their level (O Level) and a subject</li>
            <li>Click any topic → they'll see <strong>Notes → Worked Example → Practice</strong></li>
            <li>This page auto-refreshes every 15 seconds — you'll see their progress appear here</li>
          </ol>
        </div>

      </div>
    </div>
  );
}
