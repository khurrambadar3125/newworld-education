import Head from 'next/head';
import { useState, useEffect } from 'react';
import { getThisWeeksFreeSubject, isSaturdayFreeSubject, isSaturday, FREE_ROTATION } from '../utils/saturdayFreeLogic';

// Extended tips for display on this page
const TIPS = {
  'Mathematics': 'Master algebra, geometry, and trigonometry with unlimited sessions',
  'Physics': 'Forces, energy, waves, electricity — all free today',
  'Chemistry': 'Bonding, reactions, organic chemistry — unlimited access',
  'Biology': 'Cells, genetics, ecology, enzymes — study all day',
  'English Language': 'Comprehension, summary, essay writing — practice without limits',
  'Economics': 'Supply, demand, macro, micro — all marks free today',
};

// Re-export for backwards compatibility
export { getThisWeeksFreeSubject, isSaturdayFreeSubject };

export default function StarkySaturdays() {
  const [isMobile, setIsMobile] = useState(false);
  const thisWeek = getThisWeeksFreeSubject();
  const saturday = isSaturday();

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn(); window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const S = {
    page: { minHeight: '100vh', background: '#080C18', fontFamily: "'Sora',-apple-system,sans-serif", color: '#fff' },
    container: { maxWidth: 700, margin: '0 auto', padding: isMobile ? '24px 16px' : '40px 24px' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: isMobile ? '16px' : '24px' },
  };

  return (
    <div style={S.page}>
      <Head>
        <title>Starky Saturdays — Free unlimited access every Saturday | NewWorldEdu</title>
        <meta name="description" content="Every Saturday, one Cambridge subject is completely free on Starky. No limit. No login. Tell your friends." />
      </Head>

      <header style={{ padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ textDecoration: 'none', fontWeight: 900, fontSize: 15, color: '#fff' }}>
          NewWorldEdu<span style={{ color: '#4F8EF7' }}>★</span>
        </a>
        <a href="/demo" style={{ background: 'linear-gradient(135deg,#4F8EF7,#6366F1)', borderRadius: 10, padding: '6px 14px', color: '#fff', fontWeight: 800, fontSize: 12, textDecoration: 'none' }}>
          Start Learning
        </a>
      </header>

      <div style={S.container}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{thisWeek.icon}</div>
          <h1 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 900, margin: '0 0 12px', background: 'linear-gradient(135deg,#FFC300,#FF6B6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Starky Saturdays
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, margin: '0 0 20px', lineHeight: 1.7 }}>
            Every Saturday: one subject free all day. No session limit. Tell your friends.
          </p>
        </div>

        {/* This week's free subject */}
        <div style={{ ...S.card, background: saturday ? 'rgba(74,222,128,0.08)' : 'rgba(79,142,247,0.06)', border: saturday ? '2px solid rgba(74,222,128,0.3)' : '1px solid rgba(79,142,247,0.15)', marginBottom: 24, textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: saturday ? '#4ADE80' : 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            {saturday ? 'FREE RIGHT NOW' : 'This Saturday'}
          </div>
          <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 900, marginBottom: 8 }}>
            {thisWeek.subject}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 20px' }}>
            {TIPS[thisWeek.subject] || ''}
          </p>
          {saturday && (
            <a href={`/demo?subject=${encodeURIComponent(thisWeek.subject)}&from=starky-saturdays`}
              style={{ display: 'inline-block', background: 'linear-gradient(135deg,#4ADE80,#22C55E)', borderRadius: 14, padding: '14px 32px', color: '#fff', fontWeight: 800, fontSize: 16, textDecoration: 'none' }}>
              Start free session now
            </a>
          )}
        </div>

        {/* Full rotation schedule */}
        <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 14px' }}>6-week rotation</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
          {FREE_ROTATION.map((r) => {
            const isThis = r.subject === thisWeek.subject;
            return (
              <div key={r.week} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 14, background: isThis ? 'rgba(79,142,247,0.06)' : undefined, border: isThis ? '1px solid rgba(79,142,247,0.2)' : undefined }}>
                <span style={{ fontSize: 28 }}>{r.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{r.subject}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Week {r.week}</div>
                </div>
                {isThis && (
                  <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 6, background: 'rgba(79,142,247,0.15)', border: '1px solid rgba(79,142,247,0.3)', color: '#4F8EF7', fontWeight: 700 }}>
                    This week
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* How it works */}
        <div style={S.card}>
          <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 14px' }}>How it works</h2>
          {[
            { step: '1', text: 'Every Saturday, one Cambridge subject is completely free — no session limit' },
            { step: '2', text: 'The subject rotates weekly across the 6 core subjects' },
            { step: '3', text: 'All other subjects still work normally with your plan' },
            { step: '4', text: 'Sessions count toward your streak and progress tracking' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(79,142,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#4F8EF7', flexShrink: 0 }}>
                {s.step}
              </span>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ padding: '20px 16px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>© 2026 NewWorldEdu · newworld.education</div>
      </footer>
    </div>
  );
}
