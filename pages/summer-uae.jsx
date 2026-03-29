import { useState, useEffect } from "react";
import Head from "next/head";

const UAE_BADGES = [
  { id: 'dubai-scholar', name: 'Dubai Scholar', emoji: '🏙️', threshold: 5, desc: '5 summer sessions completed' },
  { id: 'khda-champion', name: 'KHDA Champion', emoji: '🌟', threshold: 15, desc: '15 sessions — aligned with KHDA goals' },
  { id: 'uni-ready', name: 'University Ready', emoji: '🎓', threshold: 25, desc: '25 sessions — prepared for admissions' },
  { id: 'summer-champ', name: 'Summer Champion', emoji: '🏆', threshold: 40, desc: '40 sessions — true dedication' },
];

const TRACKS = [
  {
    id: 'bridge',
    emoji: '📚',
    name: 'Bridge to Next Year',
    audience: 'Students moving up a year in September',
    desc: 'Get ahead before school starts. Starky teaches next year\'s topics before your classmates even open their books.',
    subjects: 'All 5 curricula — British, American, IB, CBSE, UAE MoE',
    color: '#4F8EF7',
  },
  {
    id: 'university',
    emoji: '🎓',
    name: 'University Preparation',
    audience: 'Grade 11-12 students targeting UAE universities',
    desc: 'UAEU, AUS, Khalifa University, Zayed University — all require EmSAT. Starky prepares you for every EmSAT subject.',
    subjects: 'EmSAT English, Maths, Physics, Chemistry, Biology',
    color: '#4ECDC4',
  },
  {
    id: 'catchup',
    emoji: '🔄',
    name: 'Catch Up',
    audience: 'Students who struggled this year',
    desc: 'Summer is the best time to fix gaps before they become bigger problems next year. No pressure. Your pace. Starky\'s patience.',
    subjects: 'Any subject, any curriculum — Starky identifies your gaps',
    color: '#FFC300',
  },
  {
    id: 'sen',
    emoji: '💜',
    name: 'Students of Determination',
    audience: 'Inclusive summer — aligned with KHDA inclusive programmes',
    desc: 'Starky\'s summer programme is fully accessible for Students of Determination. Same learning. Your way.',
    subjects: 'All subjects with SEN adaptations — visual, auditory, motor, cognitive',
    color: '#C77DFF',
  },
];

const PASS_KEY = 'nw_summer_uae_passport';
function loadPassport() { try { return JSON.parse(localStorage.getItem(PASS_KEY) || '{}'); } catch { return {}; } }

export default function SummerUAEPage() {
  const [passport, setPassport] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => { const fn = () => setIsMobile(window.innerWidth < 768); fn(); window.addEventListener('resize', fn); return () => window.removeEventListener('resize', fn); }, []);
  useEffect(() => { setPassport(loadPassport()); }, []);

  const totalStamps = passport.stamps?.length || 0;
  const earnedBadges = UAE_BADGES.filter(b => totalStamps >= b.threshold);

  const now = new Date();
  const month = now.getMonth();
  const isSummerActive = month >= 5 && month <= 7;
  const summerStart = new Date(now.getFullYear(), 5, 1);
  const daysUntilSummer = !isSummerActive && month < 5 ? Math.ceil((summerStart - now) / 86400000) : 0;

  const launchTrack = (track) => {
    const params = new URLSearchParams();
    if (track.id === 'sen') {
      window.location.href = '/special-needs';
    } else if (track.id === 'university') {
      params.set('subject', 'EmSAT English');
      window.location.href = '/drill?' + params.toString();
    } else {
      window.location.href = '/#start-learning';
    }
  };

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#060B20;color:#fff}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    .su-card:hover{transform:translateY(-4px)!important;box-shadow:0 16px 48px rgba(0,0,0,0.4)!important}
  `;

  return (
    <>
      <Head>
        <title>UAE Summer Programme — NewWorldEdu</title>
        <meta name="description" content="Dubai summer learning programme. Every curriculum, every subject, every language. Free for all UAE students June–August 2026." />
      </Head>
      <style>{CSS}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#060B20 0%,#0C1A3A 50%,#060B20 100%)', fontFamily: "'Sora',sans-serif" }}>

        {/* ── NAV ── */}
        <nav style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#fff', fontWeight: 800, fontSize: 15 }}>NewWorldEdu<span style={{ color: '#4F8EF7' }}>★</span></a>
          <a href="/#start-learning" style={{ background: 'linear-gradient(135deg,#4F8EF7,#4ECDC4)', color: '#fff', padding: '8px 20px', borderRadius: 100, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Start Learning →</a>
        </nav>

        {/* ── HERO ── */}
        <section style={{ textAlign: 'center', padding: isMobile ? '48px 20px 32px' : '64px 20px 40px', maxWidth: 640, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(79,142,247,0.12)', border: '1px solid rgba(79,142,247,0.3)', borderRadius: 100, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: '#4F8EF7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
            ☀️ UAE Summer 2026
          </div>
          <h1 style={{ fontSize: 'clamp(28px,7vw,44px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 12 }}>
            Dubai Summer.<br /><em style={{ fontStyle: 'normal', background: 'linear-gradient(135deg,#4F8EF7,#4ECDC4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Every day counts.</em>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 24px' }}>
            While temperatures hit 45°C outside, Starky keeps your child learning — across every curriculum, every subject, every language.
          </p>

          {/* Stats bar */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 16 : 32, flexWrap: 'wrap', marginBottom: 12 }}>
            {[
              { n: 'Jun 1 → Aug 31', l: '92 days of summer' },
              { n: '5', l: 'Curricula' },
              { n: 'Free', l: 'No cost in summer' },
            ].map(s => (
              <div key={s.n} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#4ECDC4' }}>{s.n}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {!isSummerActive && daysUntilSummer > 0 && (
            <div style={{ background: 'rgba(255,195,0,0.1)', border: '1px solid rgba(255,195,0,0.25)', borderRadius: 14, padding: '10px 18px', fontSize: 13, color: '#FFC300', fontWeight: 700, display: 'inline-block', marginTop: 8 }}>
              ☀️ Summer starts in {daysUntilSummer} days
            </div>
          )}
          {isSummerActive && (
            <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 14, padding: '10px 18px', fontSize: 13, color: '#4ADE80', fontWeight: 700, display: 'inline-block', marginTop: 8 }}>
              ☀️ Summer is LIVE — start learning today
            </div>
          )}
        </section>

        {/* ── 4 TRACKS ── */}
        <section style={{ padding: '0 20px 48px', maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, textAlign: 'center', marginBottom: 24 }}>4 Summer Tracks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {TRACKS.map((t, i) => (
              <div key={t.id} className="su-card" style={{
                background: `${t.color}08`, border: `2px solid ${t.color}25`, borderRadius: 20,
                padding: isMobile ? '20px 18px' : '24px', cursor: 'pointer', transition: 'all 0.2s',
                animation: `fadeUp 0.4s ease ${i * 0.1}s both`,
              }} onClick={() => launchTrack(t)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <span style={{ fontSize: 32, lineHeight: 1 }}>{t.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900, fontSize: 16, color: t.color, marginBottom: 4 }}>Track {i + 1} — {t.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8, fontWeight: 600 }}>{t.audience}</div>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: 8 }}>{t.desc}</p>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>{t.subjects}</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, textAlign: 'right' }}>
                  <span style={{ background: t.color, color: '#060B20', padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 800 }}>Start this track →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SUMMER PASSPORT ── */}
        <section style={{ padding: '40px 20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>UAE Summer Passport</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>Complete summer sessions to earn badges. Your progress saves automatically.</p>

            {/* Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {UAE_BADGES.map(b => {
                const earned = totalStamps >= b.threshold;
                return (
                  <div key={b.id} style={{
                    background: earned ? `rgba(74,222,128,0.08)` : 'rgba(255,255,255,0.03)',
                    border: earned ? '1.5px solid rgba(74,222,128,0.3)' : '1.5px solid rgba(255,255,255,0.06)',
                    borderRadius: 16, padding: '16px 12px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 4, filter: earned ? 'none' : 'grayscale(1) opacity(0.3)' }}>{b.emoji}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: earned ? '#4ADE80' : 'rgba(255,255,255,0.3)' }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{b.desc}</div>
                    {!earned && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>{b.threshold - totalStamps} sessions to go</div>}
                  </div>
                );
              })}
            </div>

            {totalStamps > 0 && (
              <div style={{ marginTop: 16, fontSize: 14, fontWeight: 800, color: '#4ECDC4' }}>
                🎫 {totalStamps} session{totalStamps !== 1 ? 's' : ''} completed · {earnedBadges.length} badge{earnedBadges.length !== 1 ? 's' : ''} earned
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: '48px 20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>92 days. Zero wasted.</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            Every session this summer makes September easier. Starky is free, always available, and knows every curriculum in Dubai.
          </p>
          <a href="/#start-learning" style={{
            display: 'inline-block', background: 'linear-gradient(135deg,#4F8EF7,#4ECDC4)',
            color: '#fff', padding: '16px 36px', borderRadius: 100, fontSize: 16,
            fontWeight: 800, textDecoration: 'none', boxShadow: '0 8px 32px rgba(79,142,247,0.3)',
          }}>
            Start your UAE summer →
          </a>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ padding: '24px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
          © 2026 NewWorldEdu · newworld.education · Built for Dubai
        </footer>
      </div>
    </>
  );
}
