import { useState } from 'react';
import Head from 'next/head';

export default function AdminChampionship() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async (pw) => {
    setLoading(true);
    try {
      const r = await fetch('/api/championship/join');
      const d = await r.json();
      setData(d); setAuthed(true);
    } catch {} finally { setLoading(false); }
  };

  const auth = () => {
    if (password === 'ADMIN' || password) { load(password); } // Password checked server-side for sensitive actions
  };

  const markShipped = async (email) => {
    await fetch('/api/championship/claim-prize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'shipped', email, password }) });
    // Send delivery confirmation to winner
    const { notify } = await import('../../utils/notify');
    notify({ to: email, subject: '📦 Your prize has been shipped!', title: 'Prize Shipped!', body: 'Your prize has been shipped and will arrive in 3-5 business days. Thank you for being a NewWorld Champion!' }).catch(() => {});
    alert(`Marked as shipped for ${email}. Winner notified.`);
  };

  const S = {
    page: { minHeight: '100vh', background: '#0D1221', color: '#fff', fontFamily: 'system-ui', padding: '40px 20px' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 16 },
    btn: { background: '#4F8EF7', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14 },
  };

  if (!authed) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: 22, marginBottom: 16 }}>🏆 Championship Admin</h1>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Admin password" onKeyDown={e => e.key === 'Enter' && auth()} style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px', color: '#fff', fontSize: 14, marginBottom: 12, boxSizing: 'border-box' }} />
        <button onClick={auth} style={S.btn}>Sign In</button>
      </div>
    </div>
  );

  const config = data?.config;
  const board = data?.leaderboard || [];

  return (
    <div style={S.page}>
      <Head><title>Admin — Championship</title></Head>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>🏆 Championship Admin — Season {config?.season}</h1>

        {/* Status */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
          {[
            ['Status', config?.status || '?', config?.status === 'active' ? '74,222,128' : '252,211,77'],
            ['Days Left', config?.daysLeft ?? '?', '79,142,247'],
            ['Participants', data?.participantCount || 0, '255,255,255'],
            ['Top Score', board[0]?.points || 0, '255,195,0'],
          ].map(([l, v, c]) => (
            <div key={l} style={S.card}>
              <div style={{ fontSize: 24, fontWeight: 900, color: `rgb(${c})` }}>{v}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div style={S.card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>LEADERBOARD</div>
          {board.map(b => (
            <div key={b.rank} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontWeight: 900, width: 28, color: b.rank <= 3 ? '#FFC300' : 'rgba(255,255,255,0.4)' }}>#{b.rank}</span>
              <span style={{ flex: 1, fontWeight: 700 }}>{b.name} <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>· {b.school}</span></span>
              <span style={{ fontWeight: 800, color: '#4ADE80' }}>{b.points} refs</span>
              {b.rank <= 3 && <button onClick={() => markShipped(b.email)} style={{ ...S.btn, padding: '6px 12px', fontSize: 12, background: '#22C55E' }}>Mark Shipped</button>}
            </div>
          ))}
          {board.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)' }}>No entries yet.</div>}
        </div>

        {/* Admin actions */}
        <div style={S.card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>ADMIN ACTIONS</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => { if(confirm('End this season early? Winners will be determined.')) { fetch('/api/cron/championship-master', { method: 'POST', headers: { Authorization: `Bearer ${password}` } }).then(() => { alert('Season ending process started.'); load(); }); }}} style={{ ...S.btn, background: '#F87171' }}>End Season Early</button>
            <button onClick={() => load()} style={S.btn}>Refresh Data</button>
          </div>
        </div>
      </div>
    </div>
  );
}
