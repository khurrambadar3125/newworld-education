/**
 * pages/founding.jsx — First 100 Founding Students Campaign
 * ─────────────────────────────────────────────────────────────────
 * Exclusive invitation. Live counter. Mystery goody bag.
 * Referral tiers: bring friends → upgrade your rewards.
 *
 * Psychology: Exclusivity + Mystery + FOMO + Tangible Reward
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import LegalFooter from '../components/LegalFooter';

const GOLD = '#C9A84C';
const NAVY = '#080C18';

const REWARD_TIERS = [
  { id: 'founding', label: 'Founding Student', referrals: 0, emoji: '🎓', color: '#C9A84C', perks: ['Mystery Goody Bag delivered to your door', '3 months FREE premium access', 'Founding Student badge on your profile', 'Your name on the Founders Wall forever'] },
  { id: 'ambassador', label: 'Student Ambassador', referrals: 3, emoji: '⭐', color: '#4ADE80', perks: ['Everything in Founding Student', 'UPGRADED Mystery Box (bigger, better)', '6 months FREE premium access', 'Ambassador badge + priority support'] },
  { id: 'champion', label: 'Campus Champion', referrals: 10, emoji: '🏆', color: '#4F8EF7', perks: ['Everything in Ambassador', 'PREMIUM Mystery Box', '12 months FREE premium access', 'Entry into iPad lottery draw', 'Feature on our social media'] },
  { id: 'legend', label: 'NewWorld Legend', referrals: 25, emoji: '👑', color: '#7C3AED', perks: ['Everything in Champion', 'Guaranteed premium gift', 'LIFETIME free access', 'Dinner with the founder', 'Top of the Founders Wall'] },
];

export default function FoundingPage() {
  const [spotsLeft, setSpotsLeft] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', school: '', grade: '', city: 'Karachi', role: 'student' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referredBy, setReferredBy] = useState('');

  // Check URL for referral code
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) setReferredBy(ref);
    } catch {}
  }, []);

  // Load spots remaining
  useEffect(() => {
    fetch('/api/founding?action=spots')
      .then(r => r.json())
      .then(d => setSpotsLeft(d.spotsLeft ?? 100))
      .catch(() => setSpotsLeft(100));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) { setError('Name and email required'); return; }
    setLoading(true); setError('');

    try {
      const res = await fetch('/api/founding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, referredBy }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      setReferralCode(data.referralCode || '');
      setSpotsLeft(data.spotsLeft);
      setSubmitted(true);
    } catch { setError('Something went wrong. Try again.'); }
    setLoading(false);
  };

  const shareUrl = `https://www.newworld.education/founding?ref=${referralCode}`;
  const shareText = `I just became a Founding Student at NewWorldEdu — Pakistan's first AI Cambridge tutor. Only ${spotsLeft} spots left. Goody bag delivered to your door! 🎁`;

  const S = {
    page: { minHeight: '100vh', background: NAVY, color: '#FAF6EB', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 600, margin: '0 auto', padding: '0 16px' },
    card: { background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 16, padding: '24px 20px', marginBottom: 14 },
    input: { width: '100%', padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(250,246,235,0.1)', background: 'rgba(250,246,235,0.05)', color: '#FAF6EB', fontSize: 15, outline: 'none', marginBottom: 10, boxSizing: 'border-box' },
  };

  // ═══ CONFIRMATION SCREEN ═══
  if (submitted) return (
    <div style={S.page}>
      <Head><title>You're In! — Founding Student | NewWorldEdu</title></Head>
      <div style={{ ...S.container, textAlign: 'center', paddingTop: 60, paddingBottom: 60 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px' }}>
          You're Founding Student <span style={{ color: GOLD }}>#{101 - (spotsLeft || 100)}</span>
        </h1>
        <p style={{ color: 'rgba(250,246,235,0.5)', fontSize: 15, marginBottom: 24 }}>
          Your goody bag is being prepared. We'll contact you for delivery details.
        </p>

        {/* Referral section */}
        <div style={{ ...S.card, background: 'rgba(201,168,76,0.04)', borderColor: 'rgba(201,168,76,0.2)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 12 }}>UPGRADE YOUR REWARDS</div>
          <p style={{ fontSize: 14, color: 'rgba(250,246,235,0.6)', marginBottom: 16 }}>
            Share your link. Every friend who joins upgrades YOUR goody bag.
          </p>

          {/* Referral link */}
          <div style={{ background: 'rgba(250,246,235,0.06)', borderRadius: 10, padding: '12px 14px', fontSize: 13, wordBreak: 'break-all', color: GOLD, marginBottom: 16 }}>
            {shareUrl}
          </div>

          {/* Share buttons */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`} target="_blank" rel="noopener"
              style={{ padding: '10px 18px', borderRadius: 10, background: '#25D366', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
              💬 WhatsApp
            </a>
            <button onClick={() => { navigator.clipboard?.writeText(shareUrl); }}
              style={{ padding: '10px 18px', borderRadius: 10, background: 'rgba(250,246,235,0.1)', border: 'none', color: '#FAF6EB', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              📋 Copy Link
            </button>
          </div>

          {/* Reward tiers */}
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(250,246,235,0.3)', letterSpacing: 1, marginBottom: 10 }}>REWARD TIERS</div>
          {REWARD_TIERS.map(tier => (
            <div key={tier.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(250,246,235,0.04)' }}>
              <span style={{ fontSize: 20 }}>{tier.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: tier.color }}>{tier.label}</div>
                <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.35)' }}>{tier.referrals === 0 ? 'You' : `Refer ${tier.referrals} friends`}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Start learning CTA */}
        <a href="/try" style={{ display: 'block', background: GOLD, color: NAVY, fontSize: 16, fontWeight: 900, padding: '16px 0', borderRadius: 12, textDecoration: 'none', marginBottom: 12 }}>
          Start Learning Now →
        </a>
        <div style={{ fontSize: 12, color: 'rgba(250,246,235,0.3)' }}>Your 3 months of free premium access are active.</div>
      </div>
      <LegalFooter />
    </div>
  );

  // ═══ REGISTRATION SCREEN ═══
  return (
    <div style={S.page}>
      <Head>
        <title>Be a Founding Student — First 100 Only | NewWorldEdu</title>
        <meta name="description" content="Join as one of the first 100 Founding Students of NewWorldEdu. Mystery goody bag delivered to your door. Free premium access. Limited spots." />
      </Head>
      <div style={S.container}>

        {/* Urgency banner */}
        {spotsLeft !== null && spotsLeft <= 100 && (
          <div style={{ textAlign: 'center', padding: '12px 0', marginTop: 20 }}>
            <span style={{ background: spotsLeft <= 20 ? 'rgba(239,68,68,0.15)' : 'rgba(201,168,76,0.12)', border: `1px solid ${spotsLeft <= 20 ? 'rgba(239,68,68,0.3)' : 'rgba(201,168,76,0.25)'}`, borderRadius: 100, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: spotsLeft <= 20 ? '#EF4444' : GOLD }}>
              {spotsLeft <= 0 ? '🔴 ALL SPOTS TAKEN' : `🔥 Only ${spotsLeft} spots left`}
            </span>
          </div>
        )}

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
          <div style={{ fontSize: 14, fontWeight: 900 }}>NewWorldEdu<span style={{ color: GOLD, marginLeft: 4 }}>★</span></div>
          <h1 style={{ fontSize: 30, fontWeight: 900, margin: '20px 0 12px', lineHeight: 1.2 }}>
            Become a<br />
            <span style={{ color: GOLD }}>Founding Student.</span>
          </h1>
          <p style={{ color: 'rgba(250,246,235,0.5)', fontSize: 15, lineHeight: 1.7, maxWidth: 440, margin: '0 auto' }}>
            The first 100 students to join NewWorldEdu will receive a mystery goody bag delivered to their door — plus 3 months of free premium access.
          </p>
        </div>

        {/* What's in it for you */}
        <div style={S.card}>
          <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 14 }}>WHAT FOUNDING STUDENTS GET</div>
          {[
            { emoji: '🎁', text: 'Mystery Goody Bag — delivered to your door via courier', sub: 'Contents are a surprise. We promise you\'ll love it.' },
            { emoji: '⭐', text: '3 months FREE premium access — all 17 subjects', sub: 'Rs 8,550 value. Revision notes, past papers, AI tutor, everything.' },
            { emoji: '🏆', text: 'Founding Student badge — forever on your profile', sub: 'You were here first. That matters.' },
            { emoji: '📜', text: 'Your name on the Founders Wall', sub: 'First 100 names displayed permanently on our website.' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{item.emoji}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#FAF6EB' }}>{item.text}</div>
                <div style={{ fontSize: 12, color: 'rgba(250,246,235,0.4)' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Referral tiers preview */}
        <div style={S.card}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(250,246,235,0.35)', letterSpacing: 1, marginBottom: 10 }}>BRING FRIENDS → UPGRADE YOUR BAG</div>
          {REWARD_TIERS.map(tier => (
            <div key={tier.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(250,246,235,0.04)' }}>
              <span style={{ fontSize: 24 }}>{tier.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: tier.color }}>{tier.label}</div>
                <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.4)' }}>
                  {tier.referrals === 0 ? 'Sign up today' : `Refer ${tier.referrals} friends`} — {tier.perks[tier.perks.length - 2]}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Registration form */}
        <div style={{ ...S.card, background: 'rgba(201,168,76,0.03)', borderColor: 'rgba(201,168,76,0.15)' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: GOLD, marginBottom: 16, textAlign: 'center' }}>Claim Your Spot</div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 0 }}>
              <button type="button" onClick={() => setFormData(f => ({ ...f, role: 'student' }))}
                style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: formData.role === 'student' ? '2px solid ' + GOLD : '1px solid rgba(250,246,235,0.1)', background: formData.role === 'student' ? 'rgba(201,168,76,0.1)' : 'transparent', color: '#FAF6EB', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginBottom: 10 }}>
                🎓 I'm a Student
              </button>
              <button type="button" onClick={() => setFormData(f => ({ ...f, role: 'parent' }))}
                style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: formData.role === 'parent' ? '2px solid ' + GOLD : '1px solid rgba(250,246,235,0.1)', background: formData.role === 'parent' ? 'rgba(201,168,76,0.1)' : 'transparent', color: '#FAF6EB', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginBottom: 10 }}>
                👨‍👩‍👧 I'm a Parent
              </button>
            </div>

            <input type="text" placeholder={formData.role === 'parent' ? "Your child's name" : "Your name"} value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} style={S.input} required />
            <input type="email" placeholder="Email address" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} style={S.input} required />
            <input type="tel" placeholder="WhatsApp number (for delivery)" value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} style={S.input} />
            <input type="text" placeholder="School name" value={formData.school} onChange={e => setFormData(f => ({ ...f, school: e.target.value }))} style={S.input} />

            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <select value={formData.grade} onChange={e => setFormData(f => ({ ...f, grade: e.target.value }))} style={{ ...S.input, flex: 1, marginBottom: 0 }}>
                <option value="">Grade/Level</option>
                <option value="O1">O1 (Grade 9)</option>
                <option value="O2">O2 (Grade 10)</option>
                <option value="AS">AS Level</option>
                <option value="A2">A2 Level</option>
              </select>
              <select value={formData.city} onChange={e => setFormData(f => ({ ...f, city: e.target.value }))} style={{ ...S.input, flex: 1, marginBottom: 0 }}>
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {error && <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 10 }}>{error}</div>}

            <button type="submit" disabled={loading || (spotsLeft !== null && spotsLeft <= 0)}
              style={{ width: '100%', padding: 16, borderRadius: 12, border: 'none', background: GOLD, color: NAVY, fontSize: 16, fontWeight: 900, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Claiming your spot...' : spotsLeft <= 0 ? 'All spots taken' : '🎁 Claim My Spot — Founding Student'}
            </button>
          </form>

          <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.25)', textAlign: 'center', marginTop: 10 }}>
            No payment required. Goody bag delivered free.
          </div>
        </div>

        {/* Trust */}
        <div style={{ textAlign: 'center', padding: '20px 0 40px' }}>
          <div style={{ fontSize: 13, color: 'rgba(250,246,235,0.3)' }}>
            50,000+ verified Cambridge questions · 17 subjects · Built in Pakistan for Pakistan
          </div>
        </div>
      </div>
      <LegalFooter />
    </div>
  );
}
