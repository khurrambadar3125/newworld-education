import { useState } from 'react';
import Head from 'next/head';

export default function AdminReferrals() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [overrideEmail, setOverrideEmail] = useState('');
  const [overrideMonths, setOverrideMonths] = useState('');
  const [overrideMsg, setOverrideMsg] = useState('');

  const load = async (pw) => {
    setLoading(true);
    try {
      const res = await fetch('/api/referral', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'admin', password: pw || password }) });
      const d = await res.json();
      if (d.error) { alert(d.error); return; }
      setData(d); setAuthed(true);
    } catch {} finally { setLoading(false); }
  };

  const override = async () => {
    if (!overrideEmail || !overrideMonths) return;
    try {
      await fetch('/api/referral', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'override', password, targetEmail: overrideEmail, months: overrideMonths }) });
      setOverrideMsg(`Added ${overrideMonths} months to ${overrideEmail}`);
      setOverrideEmail(''); setOverrideMonths('');
      load();
    } catch {}
  };

  const S = {
    page: { minHeight: '100vh', background: '#0D1221', color: '#fff', fontFamily: 'system-ui, sans-serif', padding: '40px 20px' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 16 },
    input: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, width: '100%', boxSizing: 'border-box' },
    btn: { background: '#4F8EF7', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14 },
  };

  if (!authed) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>🔐 Admin — Referrals</h1>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Admin password" style={{ ...S.input, marginBottom: 12 }} onKeyDown={e => e.key === 'Enter' && load()} />
        <button onClick={() => load()} style={S.btn}>Sign In</button>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <Head><title>Admin — Referrals</title></Head>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>🔐 Referral Admin</h1>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
          <div style={S.card}><div style={{ fontSize: 28, fontWeight: 900, color: '#4ADE80' }}>{data?.total || 0}</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Total Referrals</div></div>
          <div style={S.card}><div style={{ fontSize: 28, fontWeight: 900, color: '#4F8EF7' }}>{data?.referrers?.length || 0}</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Total Referrers</div></div>
          <div style={S.card}><div style={{ fontSize: 28, fontWeight: 900, color: '#FFC300' }}>{data?.referrers?.filter(r => r.tier)?.length || 0}</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>With Tiers</div></div>
        </div>

        {/* Override */}
        <div style={{ ...S.card, borderColor: 'rgba(248,113,113,0.3)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#F87171', marginBottom: 8 }}>⚠️ EMERGENCY OVERRIDE</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={overrideEmail} onChange={e => setOverrideEmail(e.target.value)} placeholder="user@email.com" style={{ ...S.input, flex: 2 }} />
            <input value={overrideMonths} onChange={e => setOverrideMonths(e.target.value)} placeholder="Months" type="number" style={{ ...S.input, flex: 1 }} />
            <button onClick={override} style={{ ...S.btn, background: '#F87171' }}>Add</button>
          </div>
          {overrideMsg && <div style={{ color: '#4ADE80', fontSize: 13, marginTop: 8 }}>{overrideMsg}</div>}
        </div>

        {/* Referrer list */}
        <div style={S.card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>ALL REFERRERS (sorted by count)</div>
          {data?.referrers?.map(r => (
            <div key={r.email} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 20 }}>{r.tier?.badge || '🌱'}</span>
              <div style={{ flex: 1, minWidth: 150 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{r.email}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{r.tier?.name || 'No tier'} · Code: {r.code}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#4ADE80' }}>{r.count} referrals</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{Math.round(r.freeMonths * 10) / 10} months</div>
              {r.unlimited && <span style={{ background: 'rgba(167,139,250,0.2)', color: '#A78BFA', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>∞ Unlimited</span>}
            </div>
          ))}
          {(!data?.referrers?.length) && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No referrers yet.</div>}
        </div>
      </div>
    </div>
  );
}
