/**
 * pages/founder.jsx — About the Founder
 * ─────────────────────────────────────────────────────────────────
 * Khurram Badar — the story behind NewWorldEdu.
 */

import Head from 'next/head';
import LegalFooter from '../components/LegalFooter';

const GOLD = '#C9A84C';
const NAVY = '#080C18';

const TIMELINE = [
  { year: '1982', title: 'Manila, Philippines', desc: 'Grew up during the Marcos era. Attended St. Augustine International School. Witnessed a revolution at age 7.' },
  { year: '1994', title: 'Citibank Pakistan', desc: 'Part of the founding team launching credit cards in Pakistan.' },
  { year: '1995', title: 'Dawn News & Journalism', desc: 'Writer at Dawn News, MAG The Weekly, Dawn Images. Published over 200 articles across his career.' },
  { year: '1996', title: 'TCS Private Limited', desc: 'GM Marketing under Khalid Nawaz Awan. First taste of building logistics at national scale.' },
  { year: '2002', title: 'Founded Spotlight FZE, Dubai', desc: 'Launched at Dubai Media City. Premier events, production, and artist management. Top-5 event company in UAE by 2004.' },
  { year: '2002', title: 'Gulf News Columnist', desc: 'Weekly "RADIO GAGA" column reviewing UAE radio. One of Dubai\'s first media critics.' },
  { year: '2005', title: 'Atif Aslam\'s Dubai Debut', desc: 'Brought Atif Aslam to Dubai before mainstream fame. Later: Ali Zafar, Fawad Khan, Kailash Kher, Ali Azmat.' },
  { year: '2006', title: 'Dubai Rock 2006', desc: 'Sole conception, production, execution. The event that put Spotlight on the map.' },
  { year: '2006', title: 'Jermaine Jackson', desc: 'Managed UAE PR for the Jackson 5 member. Connected him to Geo TV and Pakistan\'s entertainment industry.' },
  { year: '2007', title: 'Spotlight FZE → RAKEZ', desc: 'Moved to Ras Al Khaimah Economic Zone. Licensed for broadcast TV and production. Approaching 20-year milestone with RAKEZ.' },
  { year: '2009', title: 'SkyH2O — Water from Air', desc: 'COO of atmospheric water generation company. UAE and Singapore operations.' },
  { year: '2024', title: 'Returned to Pakistan', desc: 'Back at TCS building AI. Simultaneously started NewWorldEdu — because his own children needed it.' },
  { year: '2025', title: 'NewWorldEdu', desc: 'Solo-built an AI education platform with 50,000+ verified questions, 353 textbook chapters, and 202 revision notes. For Pakistan, by Pakistan.' },
];

const MENTORS = [
  { name: 'Abdul Sattar Edhi', title: 'Pakistan\'s Greatest Humanitarian', quote: 'Accumulation is not the point. Impact is the point.' },
  { name: 'H.D. Habib', title: 'First Chairman, Habib Bank Limited', quote: null },
];

export default function FounderPage() {
  return (
    <div style={{ minHeight: '100vh', background: NAVY, color: '#FAF6EB', fontFamily: "'Sora',-apple-system,sans-serif" }}>
      <Head>
        <title>Khurram Badar — Founder | NewWorldEdu</title>
        <meta name="description" content="Khurram Badar — journalist, entrepreneur, father. The story behind NewWorldEdu, Pakistan's first AI-powered Cambridge tutor." />
      </Head>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 16px' }}>

        {/* Header */}
        <header style={{ padding: '14px 0', borderBottom: '1px solid rgba(250,246,235,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ textDecoration: 'none', fontWeight: 900, fontSize: 15, color: '#FAF6EB' }}>NewWorldEdu<span style={{ color: GOLD, marginLeft: 4 }}>★</span></a>
          <a href="/" style={{ fontSize: 12, color: 'rgba(250,246,235,0.4)', textDecoration: 'none', fontWeight: 700 }}>← Back to Home</a>
        </header>

        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '60px 0 40px' }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: `linear-gradient(135deg, ${GOLD}, #E8D48B)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36, fontWeight: 900, color: NAVY }}>KB</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 8px', lineHeight: 1.2 }}>Khurram Badar</h1>
          <p style={{ color: GOLD, fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>Founder, NewWorldEdu</p>
          <p style={{ color: 'rgba(250,246,235,0.5)', fontSize: 15, lineHeight: 1.8, maxWidth: 500, margin: '0 auto' }}>
            Journalist. Entrepreneur. Father of three Cambridge students. Building Pakistan's first AI-powered education platform — because his own children needed it.
          </p>
        </section>

        {/* The Why */}
        <section style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 16, padding: '28px 24px', marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 12 }}>WHY I BUILT THIS</div>
          <p style={{ fontSize: 15, color: 'rgba(250,246,235,0.7)', lineHeight: 1.9, margin: '0 0 12px' }}>
            My son Yusuf is in O2. My daughter Dina is in O1. Both at Haque Academy, Karachi.
          </p>
          <p style={{ fontSize: 15, color: 'rgba(250,246,235,0.7)', lineHeight: 1.9, margin: '0 0 12px' }}>
            I watched them come home from school, then go to tuition from 4pm to 8pm, then study until midnight. I watched us spend more on coaching centres than on school fees. I watched teachers charge Rs 25,000 per subject per month to teach in groups of 30 — where my children couldn't even ask a question.
          </p>
          <p style={{ fontSize: 15, color: 'rgba(250,246,235,0.7)', lineHeight: 1.9, margin: '0 0 12px' }}>
            I thought: there has to be a better way. A tutor that's available at 11pm when the exam is tomorrow. A tutor that knows the mark scheme. A tutor that never gives up on a student. A tutor that costs less than one hour of coaching.
          </p>
          <p style={{ fontSize: 15, color: GOLD, lineHeight: 1.9, margin: 0, fontWeight: 700 }}>
            So I built one.
          </p>
        </section>

        {/* Quote */}
        <div style={{ textAlign: 'center', padding: '20px 0 32px' }}>
          <p style={{ fontSize: 20, fontStyle: 'italic', color: 'rgba(250,246,235,0.6)', lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
            "The future of Pakistan is not in oil, not in remittances, not in the IMF. It is in those 100 million minds — if we build the systems to unlock them before the window closes."
          </p>
        </div>

        {/* Journey */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(250,246,235,0.3)', letterSpacing: 1, marginBottom: 16 }}>THE JOURNEY</div>
          {TIMELINE.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ width: 56, flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: GOLD }}>{item.year}</div>
              </div>
              <div style={{ borderLeft: '2px solid rgba(201,168,76,0.2)', paddingLeft: 16, paddingBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#FAF6EB', marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(250,246,235,0.5)', lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Mentors */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(250,246,235,0.3)', letterSpacing: 1, marginBottom: 12 }}>MENTORED BY</div>
          {MENTORS.map(m => (
            <div key={m.name} style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 12, padding: '14px 16px', marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#FAF6EB' }}>{m.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(250,246,235,0.4)' }}>{m.title}</div>
              {m.quote && <div style={{ fontSize: 13, color: GOLD, fontStyle: 'italic', marginTop: 4 }}>"{m.quote}"</div>}
            </div>
          ))}
        </section>

        {/* Countries */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(250,246,235,0.3)', letterSpacing: 1, marginBottom: 12 }}>COUNTRIES LIVED & WORKED</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Philippines', 'Pakistan', 'London', 'Saudi Arabia', 'Bahrain', 'Dubai', 'Singapore'].map(c => (
              <span key={c} style={{ fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(250,246,235,0.08)', color: 'rgba(250,246,235,0.5)' }}>{c}</span>
            ))}
          </div>
        </section>

        {/* Spotlight */}
        <section style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 16, padding: '24px 20px', marginBottom: 32 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#FAF6EB', marginBottom: 4 }}>Spotlight FZE</div>
          <div style={{ fontSize: 12, color: 'rgba(250,246,235,0.4)', marginBottom: 8 }}>Founded 2002 · RAKEZ, Ras Al Khaimah · Approaching 20-year milestone</div>
          <p style={{ fontSize: 13, color: 'rgba(250,246,235,0.6)', lineHeight: 1.7, margin: 0 }}>
            Premier events, production, and artist management company. Top-5 event company in UAE (2004-2010). Licensed for broadcast TV and production. RAKEZ deeply values the 20-year relationship.
          </p>
        </section>

        {/* Connect */}
        <section style={{ textAlign: 'center', padding: '0 0 48px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(250,246,235,0.3)', letterSpacing: 1, marginBottom: 12 }}>CONNECT</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://khurrambadar.com" target="_blank" rel="noopener" style={{ fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: `1px solid ${GOLD}33`, color: GOLD, textDecoration: 'none' }}>khurrambadar.com</a>
            <a href="https://linkedin.com/in/khurrambadar" target="_blank" rel="noopener" style={{ fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(250,246,235,0.08)', color: 'rgba(250,246,235,0.5)', textDecoration: 'none' }}>LinkedIn</a>
            <a href="https://x.com/khurrambadar" target="_blank" rel="noopener" style={{ fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(250,246,235,0.08)', color: 'rgba(250,246,235,0.5)', textDecoration: 'none' }}>X / Twitter</a>
            <a href="mailto:khurram@newworld.education" style={{ fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(250,246,235,0.08)', color: 'rgba(250,246,235,0.5)', textDecoration: 'none' }}>Email</a>
          </div>
        </section>

      </div>
      <LegalFooter />
    </div>
  );
}
