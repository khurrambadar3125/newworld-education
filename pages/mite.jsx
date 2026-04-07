/**
 * pages/mite.jsx — MiTE × NewWorldEdu Collaboration Page
 * ─────────────────────────────────────────────────────────────────
 * Millennium Institute of Technology and Entrepreneurship, Karachi
 * Gateway to Roots Millennium Schools network.
 */

import { useState } from 'react';
import Head from 'next/head';
import LegalFooter from '../components/LegalFooter';

const NAVY = '#0A1628';
const GOLD = '#C9A84C';
const WHITE = '#FAF6EB';
const BLUE = '#4F8EF7';

export default function MiTEPage() {
  const [isMobile, setIsMobile] = useState(false);
  if (typeof window !== 'undefined' && !isMobile && window.innerWidth < 768) setIsMobile(true);

  return (
    <div style={{ minHeight: '100vh', background: NAVY, fontFamily: "'Sora',-apple-system,sans-serif", color: WHITE }}>
      <Head>
        <title>MiTE × NewWorldEdu — AI-Powered Education for the Next Generation</title>
        <meta name="description" content="MiTE and NewWorldEdu bring AI-powered learning to university students. Entrance test prep, AI tutoring, and learning analytics for BBA and BS-CS programs." />
        <meta name="robots" content="noindex" />
      </Head>

      {/* ═══ HERO ═══ */}
      <section style={{ textAlign: 'center', padding: isMobile ? '48px 20px 40px' : '80px 24px 60px', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: isMobile ? 28 : 48, fontWeight: 900, margin: '0 0 20px', lineHeight: 1.15 }}>
          MiTE <span style={{ color: GOLD }}>× NewWorldEdu</span>
        </h1>

        <p style={{ fontSize: isMobile ? 16 : 20, color: 'rgba(250,246,235,0.6)', lineHeight: 1.8, maxWidth: 640, margin: '0 auto 32px' }}>
          Pakistan's first AI-powered learning platform meets Pakistan's most innovative university.
          Together, we build the future of education.
        </p>

        <div style={{ fontSize: 15, color: GOLD, fontWeight: 700 }}>
          Every MiTE student deserves an AI tutor that never sleeps.
        </div>
      </section>

      {/* ═══ WHY THIS MATTERS ═══ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '0 20px 40px' : '0 24px 60px' }}>
        <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 20, padding: isMobile ? '24px 20px' : '40px 36px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: '0.1em', marginBottom: 16 }}>THE OPPORTUNITY</div>

          <p style={{ fontSize: 16, color: 'rgba(250,246,235,0.7)', lineHeight: 1.9, margin: '0 0 16px' }}>
            MiTE students come from the best schools in Pakistan — many from <strong style={{ color: WHITE }}>Roots Millennium Schools</strong>, the country's third-largest K-12 network. They've done Cambridge O and A Levels. They know quality education.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(250,246,235,0.7)', lineHeight: 1.9, margin: '0 0 16px' }}>
            But university is different. The syllabus is wider. The competition is fiercer. And coaching centres don't exist for BBA or BS-CS programs.
          </p>
          <p style={{ fontSize: 16, color: GOLD, lineHeight: 1.9, margin: 0, fontWeight: 700 }}>
            NewWorldEdu fills that gap — with AI.
          </p>
        </div>
      </section>

      {/* ═══ THREE PILLARS ═══ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '0 20px 40px' : '0 24px 60px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: '0.1em', marginBottom: 20, textAlign: 'center' }}>WHAT WE BUILD FOR MiTE</div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 14 }}>

          {/* Pillar 1: Entrance Test Prep */}
          <div style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 16, padding: '28px 20px' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div>
            <div style={{ fontWeight: 800, fontSize: 17, color: GOLD, marginBottom: 8 }}>Entrance Test Prep</div>
            <div style={{ fontSize: 13, color: 'rgba(250,246,235,0.55)', lineHeight: 1.7 }}>
              AI-powered preparation for MiTE's BBA and BS-CS admission tests. Personalised practice from a verified question bank. Students arrive prepared — not guessing.
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(250,246,235,0.35)' }}>
              ✓ BBA aptitude + verbal reasoning<br/>
              ✓ BS-CS logical + programming aptitude<br/>
              ✓ General knowledge + current affairs<br/>
              ✓ Predicted grade before exam day
            </div>
          </div>

          {/* Pillar 2: AI Tutor */}
          <div style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 16, padding: '28px 20px' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>★</div>
            <div style={{ fontWeight: 800, fontSize: 17, color: GOLD, marginBottom: 8 }}>AI Tutor for Every Student</div>
            <div style={{ fontSize: 13, color: 'rgba(250,246,235,0.55)', lineHeight: 1.7 }}>
              Starky — a personal AI tutor available 24/7. Understands BBA and BS-CS syllabi. Answers in English, Urdu, or Roman Urdu. Never judges. Never gives up.
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(250,246,235,0.35)' }}>
              ✓ Course-specific revision notes<br/>
              ✓ Worked examples + practice questions<br/>
              ✓ Exam technique + model answers<br/>
              ✓ Available at midnight before exams<br/>
              ✓ 16+ languages including Urdu
            </div>
          </div>

          {/* Pillar 3: Faculty Dashboard */}
          <div style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 16, padding: '28px 20px' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
            <div style={{ fontWeight: 800, fontSize: 17, color: GOLD, marginBottom: 8 }}>Faculty Analytics Dashboard</div>
            <div style={{ fontSize: 13, color: 'rgba(250,246,235,0.55)', lineHeight: 1.7 }}>
              Real-time learning analytics for MiTE faculty. See which students are struggling, which topics need reinforcement, and how the cohort is performing — before results day.
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(250,246,235,0.35)' }}>
              ✓ Student activity monitoring<br/>
              ✓ Topic-level weakness detection<br/>
              ✓ Cohort performance heatmaps<br/>
              ✓ Automated intervention alerts<br/>
              ✓ Exam readiness predictions
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PLATFORM STATS ═══ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '0 20px 40px' : '0 24px 60px' }}>
        <div style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}20`, borderRadius: 20, padding: isMobile ? '28px 20px' : '40px 36px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: '0.1em', marginBottom: 24 }}>THE PLATFORM TODAY</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 20 }}>
            {[
              { n: '54,000+', l: 'Verified Questions' },
              { n: '500+', l: 'Revision Notes' },
              { n: '26', l: 'Cambridge Subjects' },
              { n: '24/7', l: 'AI Tutor Available' },
              { n: '16+', l: 'Languages' },
              { n: '₨0', l: 'To Start' },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: 28, fontWeight: 900, color: GOLD }}>{s.n}</div>
                <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.4)', fontWeight: 600 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THE VISION — ROOTS CONNECTION ═══ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '0 20px 40px' : '0 24px 60px' }}>
        <div style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 20, padding: isMobile ? '24px 20px' : '36px 32px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(250,246,235,0.35)', letterSpacing: '0.1em', marginBottom: 16 }}>THE BIGGER VISION</div>
          <h3 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 12px', color: WHITE }}>From Roots to MiTE — and Beyond</h3>
          <p style={{ fontSize: 15, color: 'rgba(250,246,235,0.6)', lineHeight: 1.8, margin: '0 0 12px' }}>
            MiTE is part of The Millennium Trust — the same trust behind <strong style={{ color: WHITE }}>Roots Millennium Schools</strong>, Pakistan's third-largest K-12 network. Thousands of Cambridge O and A Level students.
          </p>
          <p style={{ fontSize: 15, color: 'rgba(250,246,235,0.6)', lineHeight: 1.8, margin: '0 0 12px' }}>
            The opportunity: a single AI platform that serves a student from <strong style={{ color: GOLD }}>Grade 6 to graduation</strong>. Cambridge O Level → A Level → MiTE entrance → MiTE courses → career.
          </p>
          <p style={{ fontSize: 15, color: GOLD, lineHeight: 1.8, margin: 0, fontWeight: 700 }}>
            One student. One platform. An entire educational journey.
          </p>
        </div>
      </section>

      {/* ═══ ROADMAP ═══ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '0 20px 40px' : '0 24px 60px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: '0.1em', marginBottom: 20, textAlign: 'center' }}>COLLABORATION ROADMAP</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 16 }}>
          {[
            { n: '1', title: 'Pilot — 30 Days', sub: 'No cost. No commitment.', items: ['Free access for all MiTE students', 'Entrance test prep module activated', 'AI tutor available immediately', 'Weekly engagement report to faculty'], active: true },
            { n: '2', title: 'Integration — 90 Days', sub: 'Course-level deployment.', items: ['Custom content for BBA/BS-CS courses', 'Faculty analytics dashboard deployed', 'Student performance tracking', 'MiTE-branded experience'], active: false },
            { n: '3', title: 'Scale — Roots Network', sub: 'K-12 to university pipeline.', items: ['Extend to Roots Millennium Schools', 'Cambridge O/A Level content for Roots students', 'Seamless transition: school → university', 'Pakistan\'s first AI-integrated education network'], active: false },
          ].map(p => (
            <div key={p.n} style={{ background: 'rgba(250,246,235,0.03)', border: `1px solid ${p.active ? 'rgba(201,168,76,0.3)' : 'rgba(250,246,235,0.06)'}`, borderRadius: 14, padding: '24px 20px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: p.active ? GOLD : 'rgba(250,246,235,0.1)', color: p.active ? NAVY : 'rgba(250,246,235,0.4)', fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{p.n}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: p.active ? GOLD : WHITE, textAlign: 'center', marginBottom: 4 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: 'rgba(250,246,235,0.4)', textAlign: 'center', fontStyle: 'italic', marginBottom: 16 }}>{p.sub}</div>
              {p.items.map(t => (
                <div key={t} style={{ fontSize: 13, color: 'rgba(250,246,235,0.55)', padding: '5px 0' }}>
                  <span style={{ color: '#4ADE80', marginRight: 8 }}>→</span>{t}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ ABOUT NEWWORLDEDU ═══ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '0 20px 40px' : '0 24px 60px' }}>
        <div style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 20, padding: isMobile ? '24px 20px' : '36px 32px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(250,246,235,0.35)', letterSpacing: '0.1em', marginBottom: 16 }}>ABOUT NEWWORLDEDU</div>
          <p style={{ fontSize: 15, color: 'rgba(250,246,235,0.6)', lineHeight: 1.8, margin: '0 0 12px' }}>
            Built by <strong style={{ color: WHITE }}>Khurram Badar</strong> — a 30-year veteran of media, technology, and entrepreneurship across UAE, Pakistan, and the Gulf. Founder of Spotlight FZE (20 years at RAKEZ). Father of three Cambridge students.
          </p>
          <p style={{ fontSize: 15, color: 'rgba(250,246,235,0.6)', lineHeight: 1.8, margin: '0 0 12px' }}>
            NewWorldEdu is Pakistan's first AI-powered education platform with a <strong style={{ color: GOLD }}>verified question bank of 54,000+ real past paper questions</strong>, 500+ revision notes from qualified teachers, and an AI tutor that speaks 16 languages.
          </p>
          <p style={{ fontSize: 15, color: 'rgba(250,246,235,0.6)', lineHeight: 1.8, margin: 0 }}>
            Already deployed at <strong style={{ color: WHITE }}>The Garage School</strong> (550 students, Karachi). Ready for MiTE.
          </p>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '0 20px 40px' : '0 24px 60px', textAlign: 'center' }}>
        <h2 style={{ fontSize: isMobile ? 24 : 36, fontWeight: 900, margin: '0 0 16px' }}>
          Let's build the future of education.{' '}
          <span style={{ color: GOLD }}>Together.</span>
        </h2>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          <a href="/mite-prep" style={{ display: 'inline-block', background: GOLD, color: NAVY, fontSize: 15, fontWeight: 900, padding: '14px 32px', borderRadius: 12, textDecoration: 'none' }}>
            Try Entrance Test Prep →
          </a>
          <a href="/mite-study" style={{ display: 'inline-block', background: BLUE, color: '#fff', fontSize: 15, fontWeight: 900, padding: '14px 32px', borderRadius: 12, textDecoration: 'none' }}>
            Explore Courses →
          </a>
          <a href="/mite-faculty" style={{ display: 'inline-block', background: 'transparent', border: `2px solid ${GOLD}`, color: GOLD, fontSize: 15, fontWeight: 900, padding: '12px 32px', borderRadius: 12, textDecoration: 'none' }}>
            Faculty Dashboard
          </a>
        </div>
        <div style={{ fontSize: 14, color: 'rgba(250,246,235,0.3)' }}>
          Khurram Badar — <a href="mailto:khurram@newworld.education" style={{ color: GOLD, textDecoration: 'none' }}>khurram@newworld.education</a>
        </div>
      </section>

      <LegalFooter />
    </div>
  );
}
