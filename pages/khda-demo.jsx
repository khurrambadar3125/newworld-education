import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function KHDADemoPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => { const fn = () => setIsMobile(window.innerWidth < 768); fn(); window.addEventListener('resize', fn); return () => window.removeEventListener('resize', fn); }, []);

  const f = "'Sora',sans-serif";
  const max = { maxWidth: 680, margin: '0 auto' };
  const sectionPad = { padding: isMobile ? '48px 20px' : '64px 20px' };
  const heading = (s) => ({ fontSize: `clamp(${s - 8}px,5vw,${s}px)`, fontWeight: 900, lineHeight: 1.15, fontFamily: f });

  const MANDATORY = [
    { name: 'Islamic Education', arabic: 'التربية الإسلامية', desc: 'UAE MoE standards. Quran, Hadith, Fiqh, Seerah — taught with scholarly accuracy. Arabic and English streams supported.', color: '#4ECDC4' },
    { name: 'Arabic as Second Language', arabic: 'العربية لغير الناطقين بها', desc: 'CEFR-aligned A1→B2. All private school students. Starky teaches reading, writing, grammar, and conversation with UAE vocabulary.', color: '#4F8EF7' },
    { name: 'Moral, Social & Cultural Studies', arabic: 'الدراسات الأخلاقية', desc: 'All four pillars: Character, Community, Cultural, Civic. Portfolio-based assessment support. Sheikh Zayed values integration.', color: '#FFC300' },
    { name: 'UAE Social Studies', arabic: 'الدراسات الاجتماعية', desc: 'Seven emirates, Federation history, UAE government, Vision 2071, economic diversification, space programme.', color: '#FF8E53' },
  ];

  const CURRICULA = [
    { flag: '🇬🇧', name: 'British', sub: 'IGCSE / A Level', pct: '37%', detail: '44 Cambridge subjects. 30 years of past papers. Mark scheme mastery. Examiner report intelligence.', color: '#4F8EF7' },
    { flag: '🎓', name: 'IB', sub: 'Diploma Programme', pct: '12%', detail: 'All 6 subject groups. TOK essay + exhibition. Extended Essay. IA per subject. IB command terms.', color: '#4ECDC4' },
    { flag: '🇺🇸', name: 'American', sub: 'AP / SAT / ACT', pct: '14%', detail: 'All AP subjects with FRQ rubrics. SAT Digital prep. ACT prep. College application essays.', color: '#FF6B6B' },
    { flag: '🇮🇳', name: 'CBSE', sub: 'Indian curriculum', pct: '18%', detail: 'Class 9-12. Science/Commerce/Arts streams. NCERT mastery. JEE and NEET foundation.', color: '#FF8E53' },
    { flag: '🇦🇪', name: 'UAE MoE', sub: 'National curriculum', pct: '19%', detail: 'Cycle 1-3. General/Advanced/Elite tracks. All 7 EmSAT subjects with university score targets.', color: '#FFC300' },
  ];

  const SEN_CONDITIONS = [
    'Autism Spectrum', 'ADHD', 'Dyslexia', 'Down Syndrome', 'Cerebral Palsy',
    'Visual Impairment', 'Hearing Impairment / Deaf', 'Dyscalculia',
    'Dyspraxia / DCD', 'Dysgraphia', 'Sensory Processing', 'Speech & Language',
  ];

  const STATS = [
    { n: '42', l: 'Pages', color: '#4F8EF7' },
    { n: '40', l: 'Utils / Knowledge Bases', color: '#4ECDC4' },
    { n: '65+', l: 'API Routes', color: '#FFC300' },
    { n: '23', l: 'Cron Jobs', color: '#FF8E53' },
    { n: '5', l: 'Curricula', color: '#C77DFF' },
    { n: '12', l: 'SEN Conditions', color: '#4ADE80' },
    { n: '16', l: 'Languages', color: '#FF6B6B' },
    { n: '240', l: 'SEN Teaching Profiles', color: '#A78BFA' },
  ];

  return (
    <>
      <Head>
        <title>NewWorldEdu — KHDA Demo</title>
        <meta name="description" content="NewWorldEdu — the only AI tutor built for Dubai. All 5 curricula, 4 mandatory subjects, 12 SEN conditions. KHDA-aligned." />
        <meta name="robots" content="noindex" />
      </Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#060B20;color:#fff}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        .kd-card:hover{transform:translateY(-2px)!important;box-shadow:0 8px 32px rgba(0,0,0,0.3)!important}
      `}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#060B20 0%,#0A1628 40%,#060B20 100%)', fontFamily: f }}>

        {/* ════════════ SECTION 1 — HERO ════════════ */}
        <section style={{ textAlign: 'center', padding: isMobile ? '56px 20px 40px' : '80px 20px 56px', ...max }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(79,142,247,0.12)', border: '1px solid rgba(79,142,247,0.3)', borderRadius: 100, padding: '5px 16px', fontSize: 11, fontWeight: 700, color: '#4F8EF7', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 20 }}>
            KHDA Partnership Demo
          </div>

          <h1 style={{ ...heading(44), marginBottom: 8 }}>
            NewWorldEdu
          </h1>
          <h1 style={{ ...heading(32), background: 'linear-gradient(135deg,#4F8EF7,#4ECDC4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16 }}>
            Built for Dubai.
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 32px' }}>
            The only AI tutor that knows every curriculum KHDA oversees.
          </p>

          <a href="/?country=uae" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#4F8EF7,#4ECDC4)', color: '#fff', padding: '18px 40px', borderRadius: 100, fontSize: 17, fontWeight: 800, textDecoration: 'none', boxShadow: '0 8px 32px rgba(79,142,247,0.3)' }}>
            Try Starky now →
          </a>

          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 12 }}>No login required for demo. 10 free sessions.</p>
        </section>

        {/* ════════════ SECTION 2 — KHDA MANDATORY SUBJECTS ════════════ */}
        <section style={{ ...sectionPad, background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={max}>
            <h2 style={{ ...heading(28), textAlign: 'center', marginBottom: 6 }}>All 4 mandatory subjects. Covered.</h2>
            <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>Every private school student in Dubai must study these — regardless of curriculum.</p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
              {MANDATORY.map(m => (
                <div key={m.name} className="kd-card" style={{ background: `${m.color}06`, border: `1.5px solid ${m.color}20`, borderRadius: 18, padding: '20px 18px', transition: 'all 0.2s' }}>
                  <div style={{ fontWeight: 900, fontSize: 15, color: m.color, marginBottom: 2 }}>{m.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 8, direction: 'rtl', fontWeight: 600 }}>{m.arabic}</div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)', borderRadius: 100, padding: '7px 20px', fontSize: 12, fontWeight: 800, color: '#4F8EF7' }}>
                Aligned with KHDA Resolution 194 (2023)
              </span>
            </div>
          </div>
        </section>

        {/* ════════════ SECTION 3 — 5 CURRICULA ════════════ */}
        <section style={sectionPad}>
          <div style={max}>
            <h2 style={{ ...heading(28), textAlign: 'center', marginBottom: 6 }}>5 curricula. 90% of Dubai students.</h2>
            <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>Dubai has 17 curricula. Starky knows the 5 that serve 90% of students.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CURRICULA.map(c => (
                <div key={c.name} className="kd-card" onClick={() => setActiveTab(activeTab === c.name ? null : c.name)} style={{ background: 'rgba(255,255,255,0.03)', border: `1.5px solid ${activeTab === c.name ? c.color + '40' : 'rgba(255,255,255,0.06)'}`, borderRadius: 16, padding: '16px 18px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 28 }}>{c.flag}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: c.color }}>{c.name} <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>({c.sub})</span></div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{c.pct} of Dubai private school students</div>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 16 }}>{activeTab === c.name ? '▼' : '▶'}</span>
                  </div>
                  {activeTab === c.name && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                      {c.detail}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ SECTION 4 — STUDENTS OF DETERMINATION ════════════ */}
        <section style={{ ...sectionPad, background: 'rgba(199,125,255,0.03)', borderTop: '1px solid rgba(199,125,255,0.08)', borderBottom: '1px solid rgba(199,125,255,0.08)' }}>
          <div style={max}>
            <h2 style={{ ...heading(28), textAlign: 'center', marginBottom: 6 }}>Fully inclusive. KHDA-aligned.</h2>
            <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Built for People of Determination from Day 1 — not added as an afterthought.</p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 8, marginBottom: 20 }}>
              {SEN_CONDITIONS.map(c => (
                <div key={c} style={{ background: 'rgba(199,125,255,0.06)', border: '1px solid rgba(199,125,255,0.15)', borderRadius: 10, padding: '10px 12px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>{c}</div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { name: 'Gentle Start Protocol', desc: 'Every SEN session begins with comfort, safety, and no pressure. The student controls the pace.' },
                { name: 'Deaf Mode', desc: '8 rules for hearing-impaired students. No audio dependency. Visual-first. BSL/ASL awareness.' },
                { name: '240 Teaching Profiles', desc: '12 conditions × 4 stages × 5 severity levels. Each student gets personalised pedagogy.' },
              ].map(f => (
                <div key={f.name} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px 16px' }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#C77DFF', marginBottom: 6 }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              <a href="/special-needs" style={{ background: 'rgba(199,125,255,0.12)', border: '1px solid rgba(199,125,255,0.3)', borderRadius: 100, padding: '8px 20px', fontSize: 13, fontWeight: 700, color: '#C77DFF', textDecoration: 'none' }}>Try SEN module →</a>
              <a href="/zayd-mode" style={{ background: 'rgba(99,210,255,0.12)', border: '1px solid rgba(99,210,255,0.3)', borderRadius: 100, padding: '8px 20px', fontSize: 13, fontWeight: 700, color: '#63D2FF', textDecoration: 'none' }}>Try Zayd Mode →</a>
              <a href="/iep" style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 100, padding: '8px 20px', fontSize: 13, fontWeight: 700, color: '#4ADE80', textDecoration: 'none' }}>Generate IEP →</a>
            </div>
          </div>
        </section>

        {/* ════════════ SECTION 5 — PLATFORM SCALE ════════════ */}
        <section style={sectionPad}>
          <div style={max}>
            <h2 style={{ ...heading(28), textAlign: 'center', marginBottom: 6 }}>Not a prototype. A platform.</h2>
            <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>Built over 12 months. In production. Serving students today.</p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 10 }}>
              {STATS.map(s => (
                <div key={s.l} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ SECTION 6 — SELF-IMPROVING ════════════ */}
        <section style={{ ...sectionPad, background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={max}>
            <h2 style={{ ...heading(28), textAlign: 'center', marginBottom: 6 }}>Self-improving. Every session.</h2>
            <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>Starky learns from every student interaction and improves autonomously.</p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
              {[
                { time: 'Every session', what: 'Signal collection — learning patterns, misconceptions, engagement levels' },
                { time: 'Daily 9pm', what: 'Signal analysis — cross-student patterns identified and logged' },
                { time: 'Saturday 10pm', what: 'Auto-improver — Starky\'s teaching is enhanced based on weekly patterns' },
                { time: 'Daily 10am', what: 'Evolution report — email to founder with platform improvements' },
                { time: 'Daily 11pm', what: 'Predictive analysis — identifies what students will struggle with next' },
                { time: 'Every 6 hours', what: 'Self-heal — checks all systems, fixes issues, alerts if needed' },
              ].map(c => (
                <div key={c.time} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 90, fontSize: 11, fontWeight: 800, color: '#4ECDC4', paddingTop: 2 }}>{c.time}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{c.what}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ SECTION 7 — SUMMER PROGRAMME ════════════ */}
        <section style={sectionPad}>
          <div style={max}>
            <h2 style={{ ...heading(28), textAlign: 'center', marginBottom: 6 }}>UAE Summer Programme 2026</h2>
            <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>July 1 – August 26. 54 days. 5 tracks. All curricula.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { name: 'Bridge to Next Year', desc: 'Get ahead before September. All 5 curricula.', color: '#4F8EF7' },
                { name: 'EmSAT Intensive', desc: '25 sessions per subject. University score targets.', color: '#4ECDC4' },
                { name: 'Catch Up', desc: 'Fix gaps from this year. No pressure.', color: '#FFC300' },
                { name: 'Students of Determination', desc: 'Inclusive summer. KHDA-aligned.', color: '#C77DFF' },
                { name: 'University Ready', desc: 'EmSAT improvement. Personal statements. Applications.', color: '#FF6B6B' },
              ].map(t => (
                <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 12, background: `${t.color}06`, border: `1px solid ${t.color}20`, borderRadius: 12, padding: '12px 16px' }}>
                  <div style={{ width: 4, height: 32, borderRadius: 4, background: t.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: t.color }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <a href="/summer-uae" style={{ fontSize: 13, fontWeight: 700, color: '#4F8EF7', textDecoration: 'none' }}>View full summer programme →</a>
            </div>
          </div>
        </section>

        {/* ════════════ SECTION 8 — PARTNERSHIP CTA ════════════ */}
        <section style={{ ...sectionPad, background: 'rgba(79,142,247,0.04)' }}>
          <div style={{ ...max, textAlign: 'center' }}>
            <h2 style={{ ...heading(30), marginBottom: 12 }}>Partner with NewWorldEdu.</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.6 }}>
              Free for individual students. School partnerships available. Contact us to bring Starky to your institution.
            </p>

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
              <a href="/?country=uae" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#4F8EF7,#4ECDC4)', color: '#fff', padding: '16px 36px', borderRadius: 100, fontSize: 16, fontWeight: 800, textDecoration: 'none' }}>
                Try Starky now →
              </a>
              <a href="mailto:khurram@newworld.education" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.15)', color: '#fff', padding: '16px 36px', borderRadius: 100, fontSize: 16, fontWeight: 800, textDecoration: 'none' }}>
                Contact Khurram →
              </a>
            </div>

            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
              khurram@newworld.education · newworld.education
            </div>

            <div style={{ marginTop: 20 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)', borderRadius: 100, padding: '7px 20px', fontSize: 12, fontWeight: 800, color: '#4F8EF7' }}>
                KHDA Education 33 Aligned
              </span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '20px', textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.15)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          © 2026 NewWorldEdu · newworld.education · Built in Dubai
        </footer>
      </div>
    </>
  );
}
