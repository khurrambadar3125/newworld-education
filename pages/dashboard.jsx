import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setError('');
    const res = await fetch('/api/dashboard-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.role) {
      setRole(data.role);
      sessionStorage.setItem('dash_role', data.role);
      sessionStorage.setItem('dash_pw', password);
      loadData(password);
    } else {
      setError('Incorrect password');
    }
  };

  const loadData = async (pw) => {
    const token = pw || sessionStorage.getItem('dash_pw');
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard-data', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.status === 401) { setRole(null); sessionStorage.clear(); return; }
      const data = await res.json();
      setStudents(data.students || []);
      setStats(data.stats || {});
    } finally { setLoading(false); }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('dash_role');
    if (saved) { setRole(saved); loadData(); }
  }, []);

  const S = {
    page: { minHeight: '100vh', background: '#0D1221', color: '#fff', fontFamily: 'system-ui,sans-serif', padding: '0 0 80px' },
    nav: { padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 },
    label: { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 },
    badge: (color) => ({ background: `rgba(${color},0.15)`, color: `rgb(${color})`, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }),
  };

  if (!role) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏫</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>Teacher Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>NewWorld Education</p>
        </div>
        <div style={{ ...S.card }}>
          <span style={S.label}>Password</span>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Enter dashboard password"
            style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 15, marginBottom: 12, boxSizing: 'border-box' }} />
          {error && <div style={{ color: '#F87171', fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button onClick={login} style={{ width: '100%', background: '#4F8EF7', color: '#fff', border: 'none', padding: '12px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
            Sign In →
          </button>
        </div>
      </div>
    </div>
  );

  const flagged = students.filter(s => s.weakTopics?.length || s.recentMistakes?.length);
  const active7d = students.filter(s => {
    if (!s.lastSeen) return false;
    return (Date.now() - new Date(s.lastSeen)) < 7 * 24 * 60 * 60 * 1000;
  });

  return (
    <>
      <Head><title>Teacher Dashboard — NewWorld Education</title></Head>
      <div style={S.page}>
        <div style={S.nav}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>← Home</button>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#4F8EF7' }}>★ Teacher Dashboard</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: 100 }}>{role}</span>
          <button onClick={() => { sessionStorage.removeItem('dash_role'); setRole(null); }} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Sign out</button>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              ['Total Students', students.length, '255,255,255'],
              ['Active (7 days)', active7d.length, '74,222,128'],
              ['Need Attention', flagged.length, '252,211,77'],
              ['Avg Streak', students.length ? Math.round(students.reduce((a,s) => a + (parseInt(s.streakDays)||0), 0) / students.length) + ' days' : '—', '79,142,247'],
            ].map(([label, value, color]) => (
              <div key={label} style={{ ...S.card, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: `rgb(${color})` }}>{value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Flagged students */}
          {flagged.length > 0 && (
            <div style={{ ...S.card, borderColor: 'rgba(252,211,77,0.2)', background: 'rgba(252,211,77,0.03)', marginBottom: 24 }}>
              <span style={S.label}>⚠️ Students needing attention ({flagged.length})</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {flagged.map(s => (
                  <button key={s.email} onClick={() => setSelected(selected?.email === s.email ? null : s)}
                    style={{ background: 'rgba(252,211,77,0.1)', border: '1px solid rgba(252,211,77,0.3)', color: '#FCD34D', padding: '6px 14px', borderRadius: 100, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                    {s.name || s.email} · {s.grade}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Student deep dive */}
          {selected && (
            <div style={{ ...S.card, borderColor: 'rgba(79,142,247,0.3)', background: 'rgba(79,142,247,0.05)', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>{selected.name || selected.email}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{selected.grade} · {selected.subject} · {selected.email}</div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', padding: '4px 12px', borderRadius: 8, cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <span style={S.label}>Streak</span>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#FCD34D' }}>🔥 {selected.streakDays || 0} days</div>
                </div>
                <div>
                  <span style={S.label}>Last Active</span>
                  <div style={{ fontSize: 14 }}>{selected.lastSeen ? new Date(selected.lastSeen).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : 'Never'}</div>
                </div>
                <div>
                  <span style={S.label}>Current Subject</span>
                  <div style={{ fontSize: 14 }}>{selected.currentSubject || '—'}</div>
                </div>
                <div>
                  <span style={S.label}>Total Sessions</span>
                  <div style={{ fontSize: 14 }}>{selected.totalSessions || 0}</div>
                </div>
              </div>
              {selected.weakTopics?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <span style={S.label}>Weak Topics</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {selected.weakTopics.map(t => <span key={t} style={{ ...S.badge('252,211,77'), padding: '4px 12px' }}>{t}</span>)}
                  </div>
                </div>
              )}
              {selected.recentMistakes?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <span style={S.label}>Recent Mistakes</span>
                  {selected.recentMistakes.slice(-5).reverse().map((m, i) => (
                    <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13 }}>
                      <span style={{ fontWeight: 700, color: '#F87171' }}>{m.topic}</span>
                      {m.description && <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: 8 }}>— {m.description.slice(0, 80)}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* All students table */}
          <div style={S.card}>
            <span style={S.label}>All Students ({students.length})</span>
            {loading ? <div style={{ color: 'rgba(255,255,255,0.4)', padding: '20px 0' }}>Loading...</div> : students.length === 0 ? (
              <div style={{ color: 'rgba(255,255,255,0.3)', padding: '20px 0', fontSize: 14 }}>No students yet. They appear here once they sign in and use Starky.</div>
            ) : students.map(s => (
              <div key={s.email} onClick={() => setSelected(selected?.email === s.email ? null : s)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', opacity: selected?.email === s.email ? 1 : 0.85 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(79,142,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#4F8EF7', flexShrink: 0 }}>
                  {(s.name || s.email || '?')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name || s.email}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{s.grade}{s.subject ? ` · ${s.subject}` : ''}</div>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', display: 'flex', gap: 12, alignItems: 'center' }}>
                  {s.streakDays > 0 && <span style={{ color: '#FCD34D' }}>🔥{s.streakDays}d</span>}
                  {s.weakTopics?.length > 0 && <span style={S.badge('252,211,77')}>{s.weakTopics.length} weak</span>}
                  {s.recentMistakes?.length > 0 && <span style={S.badge('248,113,113')}>{s.recentMistakes.length} mistakes</span>}
                  {s.currentSubject && <span style={{ color: 'rgba(255,255,255,0.3)' }}>{s.currentSubject}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
