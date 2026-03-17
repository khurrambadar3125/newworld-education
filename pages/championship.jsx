import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Championship() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinForm, setJoinForm] = useState({ name: '', school: '', dob: '' });
  const [joined, setJoined] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('nw_user') || '{}');
    setEmail(user.email || '');
    setJoinForm(f => ({ ...f, name: user.name || '' }));
    fetch(`/api/championship/join?email=${encodeURIComponent(user.email || '')}`)
      .then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  const handleJoin = async () => {
    if (!email) { alert('Please register on the homepage first.'); return; }
    if (!joinForm.name.trim()) return;
    setJoining(true);
    try {
      await fetch('/api/championship/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'join', email, name: joinForm.name, school: joinForm.school, dob: joinForm.dob, termsVersion: '1.0' }) });
      setJoined(true);
      // Reload data
      const r = await fetch(`/api/championship/join?email=${encodeURIComponent(email)}`);
      setData(await r.json());
    } catch {} finally { setJoining(false); }
  };

  const shareWhatsApp = () => {
    const user = JSON.parse(localStorage.getItem('nw_user') || '{}');
    const code = user.email ? btoa(user.email).slice(0, 12) : '';
    const text = `I am competing to win Meta Ray-Ban glasses on NewWorld Education — Pakistan's smartest AI tutor. Join here: newworld.education/championship — T&Cs apply. Pakistan residents only.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const config = data?.config;
  const profile = data?.profile;
  const board = data?.leaderboard || [];
  const schoolBoard = data?.schoolBoard || [];

  const S = {
    page: { minHeight: '100vh', background: 'linear-gradient(135deg,#060B20,#1a0a2e)', color: '#fff', fontFamily: "'Nunito',-apple-system,sans-serif" },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, marginBottom: 16 },
  };

  if (loading) return <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div>Loading championship...</div></div>;

  return (
    <div style={S.page}>
      <Head>
        <title>NewWorld Championship — Win Meta Ray-Ban</title>
        <meta name="description" content="Refer friends to NewWorld Education and win Meta Ray-Ban glasses. Free to enter. Pakistan residents only." />
        <meta property="og:title" content="NewWorld Championship — Win Meta Ray-Ban" />
        <meta property="og:description" content="Refer friends and win prizes. Free competition for Pakistani students." />
      </Head>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>🏆</div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#FFC300', letterSpacing: 2, marginBottom: 8 }}>
            {config?.status === 'active' ? `SEASON ${config.season} · ${config.daysLeft} DAYS LEFT` : config?.status === 'gap' ? 'NEXT SEASON STARTING SOON' : `SEASON ${config?.season || 1}`}
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 8px', lineHeight: 1.2 }}>
            NewWorld <span style={{ color: '#FFC300' }}>Championship</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
            Refer friends to NewWorldEdu. Win real prizes. Free to enter.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,195,0,0.1)', border: '1px solid rgba(255,195,0,0.3)', borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#FFC300' }}>🆓 Free to enter</span>
            <span style={{ background: 'rgba(255,195,0,0.1)', border: '1px solid rgba(255,195,0,0.3)', borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#FFC300' }}>🇵🇰 Pakistan only</span>
            <span style={{ background: 'rgba(255,195,0,0.1)', border: '1px solid rgba(255,195,0,0.3)', borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#FFC300' }}>👥 {data?.participantCount || 0} competing</span>
          </div>
        </div>

        {/* Prizes */}
        <div style={S.card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 12 }}>PRIZES</div>
          {[
            { rank: '🥇 1st', prize: config?.prize1 || 'Meta Ray-Ban Gen 2', value: 'Worth Rs 80,000+' },
            { rank: '🥈 2nd', prize: config?.prize2 || 'AirPods', value: 'Worth Rs 15,000+' },
            { rank: '🥉 3rd', prize: config?.prize3 || 'Rs 5,000 Mobile Credit', value: '' },
          ].map(p => (
            <div key={p.rank} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 20, width: 40 }}>{p.rank}</span>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 800 }}>{p.prize}</div>{p.value && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{p.value}</div>}</div>
            </div>
          ))}
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>Or hit {config?.targetReferrals || 100} referrals during the season to win 1st place instantly.</div>
        </div>

        {/* Personal rank card */}
        {profile?.joined && (
          <div style={{ ...S.card, borderColor: 'rgba(255,195,0,0.3)', background: 'rgba(255,195,0,0.05)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#FFC300', marginBottom: 8 }}>YOUR POSITION</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#FFC300' }}>{profile.points} referrals</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
              {board.find(b => b.points === profile.points) ? `Rank #${board.findIndex(b => b.points === profile.points) + 1}` : 'Not yet on leaderboard'}
            </div>
            <button onClick={shareWhatsApp} style={{ width: '100%', background: 'linear-gradient(135deg,#25D366,#128C7E)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
              💬 Share & Get More Referrals
            </button>
          </div>
        )}

        {/* Join CTA */}
        {!profile?.joined && config?.status === 'active' && (
          <div style={{ ...S.card, borderColor: 'rgba(74,222,128,0.3)' }}>
            {!showJoin ? (
              <button onClick={() => setShowJoin(true)} style={{ width: '100%', background: 'linear-gradient(135deg,#4ADE80,#22C55E)', color: '#060B20', border: 'none', borderRadius: 14, padding: '16px', fontWeight: 900, fontSize: 16, cursor: 'pointer', fontFamily: 'inherit' }}>
                🏆 Join the Championship — Free
              </button>
            ) : (
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>Join Season {config.season}</div>
                <input value={joinForm.name} onChange={e => setJoinForm({ ...joinForm, name: e.target.value })} placeholder="Your name" style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, marginBottom: 8, boxSizing: 'border-box' }} />
                <input value={joinForm.school} onChange={e => setJoinForm({ ...joinForm, school: e.target.value })} placeholder="Your school (optional)" style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, marginBottom: 8, boxSizing: 'border-box' }} />
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12, cursor: 'pointer' }}>
                  <input type="checkbox" required style={{ marginTop: 2 }} />
                  I confirm I am 18+ OR have my parent's permission. I agree to the <a href="/championship/terms" style={{ color: '#4F8EF7' }}>Terms</a> and <a href="/privacy" style={{ color: '#4F8EF7' }}>Privacy Policy</a>.
                </label>
                <button onClick={handleJoin} disabled={joining || !joinForm.name.trim()} style={{ width: '100%', background: joining ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#4ADE80,#22C55E)', color: '#060B20', border: 'none', borderRadius: 14, padding: '14px', fontWeight: 900, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {joining ? 'Joining...' : 'Join Championship →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        <div style={S.card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 12 }}>🏆 TOP 10 STUDENTS</div>
          {board.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, textAlign: 'center', padding: 20 }}>No referrals yet — be the first!</div>
          ) : board.map(b => (
            <div key={b.rank} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: b.rank <= 3 ? '#FFC300' : 'rgba(255,255,255,0.4)', width: 28 }}>#{b.rank}</span>
              <div style={{ flex: 1 }}><span style={{ fontWeight: 700 }}>{b.name}</span> <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>· {b.school}</span></div>
              <span style={{ fontWeight: 800, color: '#4ADE80' }}>{b.points}</span>
            </div>
          ))}
        </div>

        {/* School leaderboard */}
        {schoolBoard.length > 0 && (
          <div style={S.card}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 12 }}>🏫 TOP 5 SCHOOLS</div>
            {schoolBoard.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: s.rank === 1 ? '#FFC300' : 'rgba(255,255,255,0.4)', width: 24 }}>#{s.rank}</span>
                <span style={{ flex: 1, fontWeight: 600 }}>{s.name}</span>
                <span style={{ fontWeight: 800, color: '#4F8EF7' }}>{s.points} pts</span>
              </div>
            ))}
          </div>
        )}

        {/* Legal footer */}
        <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.25)', lineHeight: 1.8, marginTop: 24 }}>
          Free to enter. No purchase necessary. Prizes funded by NewWorld Education.<br />
          Open to Pakistan residents aged 5-18. Parental consent required under 18.<br />
          <a href="/championship/terms" style={{ color: 'rgba(255,255,255,0.35)' }}>Full Terms & Conditions</a> · <a href="/privacy" style={{ color: 'rgba(255,255,255,0.35)' }}>Privacy Policy</a><br />
          This is not a lottery, pyramid scheme, or MLM. Winners determined by referral count.
        </div>
      </div>
    </div>
  );
}
