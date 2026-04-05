/**
 * pages/garageschool.jsx — The Garage School × NewWorldEdu Partnership
 *
 * Shabina Mustafa founded The Garage School in 1999 with 14 children in her garage.
 * 25 years later, 550+ underprivileged children study there.
 * This page shows what AI-powered education can do for them.
 */

import { useState } from 'react';
import Head from 'next/head';
import LegalFooter from '../components/LegalFooter';

const NAVY = '#0A1628';
const GOLD = '#C9A84C';
const GREEN = '#4ADE80';
const WHITE = '#FAF6EB';

export default function GarageSchoolPage() {
  const [isMobile, setIsMobile] = useState(false);
  if (typeof window !== 'undefined' && !isMobile && window.innerWidth < 768) setIsMobile(true);

  return (
    <div style={{ minHeight: '100vh', background: NAVY, fontFamily: "'Sora',-apple-system,sans-serif", color: WHITE }}>
      <Head>
        <title>Shabina &amp; Khurram Collaboration — The Garage School × NewWorldEdu</title>
        <meta name="description" content="The Garage School and NewWorldEdu bring AI-powered Cambridge-standard tutoring to 550+ underprivileged children in Karachi. Pakistan's first AI school partnership." />
      </Head>

      {/* Header */}
      <header style={{ padding: '14px 24px', borderBottom: '1px solid rgba(250,246,235,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ textDecoration: 'none', fontWeight: 900, fontSize: 15, color: WHITE }}>
          NewWorldEdu<span style={{ color: GOLD, marginLeft: 4 }}>★</span>
        </a>
        <a href="/" style={{ fontSize: 12, color: 'rgba(250,246,235,0.4)', textDecoration: 'none', fontWeight: 700 }}>← Back to Home</a>
      </header>

      {/* ═══ HERO ═══ */}
      <section style={{ textAlign: 'center', padding: isMobile ? '48px 20px 40px' : '80px 24px 60px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, alignItems: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.12em', padding: '6px 16px', border: `1px solid ${GOLD}33`, borderRadius: 100, background: `${GOLD}08` }}>PARTNERSHIP</div>
        </div>

        <h1 style={{ fontSize: isMobile ? 28 : 48, fontWeight: 900, margin: '0 0 20px', lineHeight: 1.15 }}>
          Shabina &amp; Khurram{' '}
          <span style={{ color: GOLD }}>Collaboration</span>
        </h1>
        <div style={{ fontSize: 16, color: 'rgba(250,246,235,0.4)', marginBottom: 8 }}>The Garage School × NewWorldEdu</div>

        <p style={{ fontSize: isMobile ? 16 : 20, color: 'rgba(250,246,235,0.6)', lineHeight: 1.8, maxWidth: 640, margin: '0 auto 32px' }}>
          In 1999, Shabina Mustafa started teaching 14 children in her garage in Clifton, Karachi.
          Over 25 years later, over 550 underprivileged children study at The Garage School.
          Now, every one of them gets a personal AI tutor.
        </p>

        <div style={{ fontSize: 15, color: GOLD, fontWeight: 700 }}>
          Pakistan&apos;s first AI-powered school for underprivileged children.
        </div>
      </section>

      {/* ═══ THE STORY ═══ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '0 20px 40px' : '0 24px 60px' }}>
        <div style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 20, padding: isMobile ? '24px 20px' : '40px 36px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(250,246,235,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>The Story</div>

          <p style={{ fontSize: 16, color: 'rgba(250,246,235,0.7)', lineHeight: 1.9, margin: '0 0 16px' }}>
            In November 1999, a young girl named <strong style={{ color: WHITE }}>Somia</strong> was denied admission to a vocational school because she could not read or write. Her mother asked Shabina Mustafa for help.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(250,246,235,0.7)', lineHeight: 1.9, margin: '0 0 16px' }}>
            Shabina started teaching Somia and 13 other children in her garage at Minerva Court Apartments, Clifton. She hand-drew lined paper and made exercise books from scrap materials.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(250,246,235,0.7)', lineHeight: 1.9, margin: '0 0 16px' }}>
            Today, The Garage School — operated under the <strong style={{ color: WHITE }}>Safi Benevolent Trust</strong> (named after Shabina&apos;s late husband, Flight Lieutenant Syed Safi Mustafa, who was martyred in the 1971 war) — serves over <strong style={{ color: GOLD }}>550 underprivileged children</strong> from Shah Rasool Colony and Neelum Colony in DHA Phase-V, Karachi.
          </p>
          <p style={{ fontSize: 16, color: GOLD, lineHeight: 1.9, margin: 0, fontWeight: 700 }}>
            Shabina proved that one person, one garage, and one decision can change hundreds of lives. Now we add AI.
          </p>
        </div>
      </section>

      {/* ═══ WHAT EVERY CHILD GETS ═══ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '0 20px 40px' : '0 24px 60px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, textAlign: 'center' }}>What Every Garage School Student Gets</div>
        <h2 style={{ fontSize: isMobile ? 24 : 36, fontWeight: 900, textAlign: 'center', margin: '0 0 28px' }}>
          A personal tutor who knows their syllabus, speaks their language, and never gives up on them.
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
          {[
            { icon: '⚛️', title: 'Structured Study Paths', desc: '50,000+ verified questions across 17 textbook-accurate subjects. Learn → Guided → Practice → Master. Exact chapters from real Cambridge coursebooks.' },
            { icon: '⚡', title: 'Practice Drill', desc: '5 drill modes including Weak Spots — automatically finds what each student struggles with and drills it.' },
            { icon: '📝', title: 'Mock Exams', desc: 'Timed exams with Cambridge-level marking. Pre-exam briefing. Post-exam revision plan.' },
            { icon: '💜', title: 'Special Needs Support', desc: '17 conditions, PhD-level SEN support. ADHD, dyslexia, autism, hearing impairment, Down Syndrome — all supported with adaptive teaching.' },
            { icon: '🎙️', title: 'Voice Enabled', desc: 'Students can speak to Starky in Urdu or English. Perfect for early learners who can\'t type yet.' },
            { icon: '📧', title: 'Teacher Reports', desc: 'Every session logged. Teachers see which students are struggling and which topics need classroom reinforcement.' },
            { icon: '🌍', title: 'Urdu + English', desc: 'Starky auto-detects language. Students can ask in Roman Urdu and get Cambridge-precise answers.' },
            { icon: '📚', title: 'Every Subject', desc: 'Matric curriculum alignment. English, Urdu, Maths, Science, Islamiat, Pakistan Studies — all covered.' },
          ].map(f => (
            <div key={f.title} style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 14, padding: '20px 18px' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 15, color: GOLD, marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(250,246,235,0.55)', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ BY THE NUMBERS ═══ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '0 20px 40px' : '0 24px 60px' }}>
        <div style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}20`, borderRadius: 20, padding: isMobile ? '28px 20px' : '40px 36px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>By the Numbers</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 20 }}>
            {[
              { n: '550+', l: 'Students' },
              { n: '25', l: 'Years' },
              { n: '50,000+', l: 'Verified Questions' },
              { n: '34+', l: 'Subjects Covered' },
              { n: '24/7', l: 'AI Tutor Available' },
              { n: '₨0', l: 'Cost to Students' },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: 28, fontWeight: 900, color: GOLD }}>{s.n}</div>
                <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT SHABINA ═══ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '0 20px 40px' : '0 24px 60px' }}>
        <div style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 20, padding: isMobile ? '24px 20px' : '36px 32px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(250,246,235,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>The Founder</div>
          <h3 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 12px', color: WHITE }}>Shabina Mustafa</h3>
          <p style={{ fontSize: 15, color: 'rgba(250,246,235,0.6)', lineHeight: 1.8, margin: '0 0 12px' }}>
            Widowed at 21 when Flight Lieutenant Syed Safi Mustafa was martyred in the 1971 war, Shabina raised her son alone while working 32 years at Saudi Arabian Airlines. After retirement, she dedicated her life to education.
          </p>
          <p style={{ fontSize: 15, color: 'rgba(250,246,235,0.6)', lineHeight: 1.8, margin: '0 0 12px' }}>
            Recipient of the <strong style={{ color: WHITE }}>Azm Award (2011)</strong> for her contribution to education. Board President of Safi Benevolent Trust since 1999.
          </p>
          <p style={{ fontSize: 15, color: GOLD, lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
            &ldquo;Every child deserves the chance to read, write, and dream. A garage was enough to start. AI will take them further than I ever could alone.&rdquo;
          </p>
        </div>
      </section>

      {/* ═══ THE VISION ═══ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '0 20px 40px' : '0 24px 60px', textAlign: 'center' }}>
        <h2 style={{ fontSize: isMobile ? 24 : 36, fontWeight: 900, margin: '0 0 16px' }}>
          Pakistan&apos;s First{' '}
          <span style={{ color: GREEN }}>AI School</span>
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(250,246,235,0.6)', lineHeight: 1.8, maxWidth: 600, margin: '0 auto 28px' }}>
          The Garage School becomes the first school in Pakistan where every student — regardless of background, income, or ability — has access to an AI tutor trained to Cambridge examiner standards. If it works here, it works anywhere.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/study" style={{ display: 'inline-block', background: GOLD, color: NAVY, fontSize: 15, fontWeight: 900, padding: '14px 32px', borderRadius: 12, textDecoration: 'none' }}>
            Start Learning Now →
          </a>
          <a href="/school" style={{ display: 'inline-block', background: 'transparent', border: `2px solid ${GOLD}`, color: GOLD, fontSize: 15, fontWeight: 900, padding: '12px 32px', borderRadius: 12, textDecoration: 'none' }}>
            School Partnerships →
          </a>
        </div>
      </section>

      {/* ═══ PRESS ═══ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '0 20px 40px' : '0 24px 60px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(250,246,235,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, textAlign: 'center' }}>Press Coverage</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {['Dawn', 'The News', 'Gulf News', 'Standard Chartered', 'GlobalGiving'].map(p => (
            <span key={p} style={{ fontSize: 12, fontWeight: 700, color: 'rgba(250,246,235,0.3)', padding: '6px 14px', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 100 }}>{p}</span>
          ))}
        </div>
      </section>

      <LegalFooter />
    </div>
  );
}
