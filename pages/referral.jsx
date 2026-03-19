import { useState, useEffect } from 'react';
import Head from 'next/head';

const TIERS = [
  { min: 1,  name: 'Star',       badge: '⭐', freeMonths: 1,  desc: '1 free month' },
  { min: 5,  name: 'Champion',   badge: '🏆', freeMonths: 3,  desc: '3 free months + weekly study plan' },
  { min: 10, name: 'Ambassador', badge: '🚀', freeMonths: 6,  desc: '6 free months + unlimited sessions' },
  { min: 25, name: 'Legend',     badge: '👑', freeMonths: 12, desc: '12 free months forever + founder contact' },
];

export default function ReferralPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      let user = {};
      try { user = JSON.parse(localStorage.getItem('nw_user') || '{}'); } catch {}
      if (user.email) {
        setEmail(user.email);
        loadProfile(user.email);
      } else {
        setLoading(false);
      }
    } catch { setLoading(false); }
  }, []);

  const loadProfile = async (em) => {
    try {
      // Register code if doesn't exist
      await fetch('/api/referral', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'register', email: em }) });
      const res = await fetch(`/api/referral?action=profile&email=${encodeURIComponent(em)}`);
      const data = await res.json();
      setProfile(data);
    } catch { setError('Could not load referral profile. Please try again.'); } finally { setLoading(false); }
  };

  const link = profile?.code ? `https://www.newworld.education/join/${profile.code}` : '';
  const currentTier = profile?.tier;
  const nextTier = TIERS.find(t => t.min > (profile?.count || 0));
  const progress = nextTier ? ((profile?.count || 0) / nextTier.min) * 100 : 100;

  const copyLink = () => {
    navigator.clipboard?.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = `My child uses Starky on NewWorld Education — Pakistan's smartest tutor. Try it free: ${link} 🌟`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const S = {
    page: { minHeight: '100vh', background: '#080C18', color: '#fff', fontFamily: "'Nunito', -apple-system, sans-serif", padding: '0 0 80px' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, marginBottom: 16 },
  };

  return (
    <div style={S.page}>
      <Head>
        <title>Refer Friends — Earn Free Months — NewWorldEdu</title>
        <meta name="description" content="Refer friends to NewWorld Education and earn free months. Star, Champion, Ambassador, and Legend tiers with automatic rewards." />
      </Head>

      {/* Championship banner */}
      <div style={{background:'linear-gradient(135deg,rgba(255,195,0,0.1),rgba(255,142,83,0.1))',border:'1px solid rgba(255,195,0,0.25)',padding:'14px 20px',textAlign:'center'}}>
        <a href="/championship" style={{color:'#FFC300',fontWeight:800,fontSize:14,textDecoration:'none'}}>
          🏆 Your referrals also count in the Championship — win Meta Ray-Ban! View leaderboard →
        </a>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🎁</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px' }}>Refer Friends, Learn Free</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.7 }}>
            Share NewWorldEdu with other parents. When their child is active for 7 days, you earn free months automatically.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
        ) : !email ? (
          <div style={{ ...S.card, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>👤</div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Sign up first</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 16 }}>You need an account to get your referral link.</div>
            <a href="/" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#4F8EF7,#6366F1)', color: '#fff', padding: '12px 28px', borderRadius: 100, fontWeight: 700, textDecoration: 'none' }}>Start Learning →</a>
          </div>
        ) : (
          <>
            {/* Current tier */}
            <div style={{ ...S.card, textAlign: 'center', borderColor: currentTier ? 'rgba(255,195,0,0.3)' : 'rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>{currentTier?.badge || '🌱'}</div>
              <div style={{ fontWeight: 900, fontSize: 20, color: '#FFC300', marginBottom: 4 }}>
                {currentTier?.name || 'No tier yet'}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                {profile?.count || 0} referral{(profile?.count || 0) !== 1 ? 's' : ''} confirmed
                {profile?.freeMonths > 0 && ` · ${Math.round(profile.freeMonths * 10) / 10} free months remaining`}
              </div>
            </div>

            {/* Progress to next tier */}
            {nextTier && (
              <div style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>Next: {nextTier.badge} {nextTier.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#FFC300' }}>{profile?.count || 0} / {nextTier.min}</span>
                </div>
                <div style={{ height: 8, borderRadius: 100, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(progress, 100)}%`, background: 'linear-gradient(90deg, #FFC300, #FF8E53)', borderRadius: 100, transition: 'width 0.5s' }} />
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>
                  {nextTier.min - (profile?.count || 0)} more referral{nextTier.min - (profile?.count || 0) !== 1 ? 's' : ''} to unlock: {nextTier.desc}
                </div>
              </div>
            )}

            {/* Referral link */}
            <div style={S.card}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 8 }}>YOUR REFERRAL LINK</div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: '#4F8EF7', wordBreak: 'break-all', marginBottom: 12 }}>{link}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={shareWhatsApp} style={{ flex: 1, background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                  💬 Share on WhatsApp
                </button>
                <button onClick={copyLink} style={{ flex: 1, background: 'rgba(79,142,247,0.15)', border: '1px solid rgba(79,142,247,0.3)', color: '#4F8EF7', borderRadius: 12, padding: '13px', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {copied ? '✓ Copied!' : '📋 Copy Link'}
                </button>
              </div>
            </div>

            {/* All tiers */}
            <div style={S.card}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 12 }}>TIER REWARDS</div>
              {TIERS.map(tier => {
                const reached = (profile?.count || 0) >= tier.min;
                return (
                  <div key={tier.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: reached ? 1 : 0.5 }}>
                    <span style={{ fontSize: 24 }}>{tier.badge}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{tier.name} <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>({tier.min}+ referrals)</span></div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{tier.desc}</div>
                    </div>
                    {reached && <span style={{ color: '#4ADE80', fontWeight: 700, fontSize: 12 }}>✓ Earned</span>}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
