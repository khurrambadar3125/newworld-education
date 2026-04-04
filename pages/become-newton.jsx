/**
 * pages/become-newton.jsx — Become Newton: The Maths Section
 * ─────────────────────────────────────────────────────────────────
 * From counting to calculus. Every maths question from every source
 * (Cambridge, Edexcel, SAT, KS1, KS2, 11+) in one unified journey.
 * Sequential nano learning. Multilingual. Create mathematical geniuses.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LegalFooter from '../components/LegalFooter';
import BottomNav from '../components/BottomNav';

const GOLD = '#C9A84C';

// The Newton Journey — 10 levels from counting to genius
const LEVELS = [
  {
    id: 1, name: 'Number Explorer', icon: '🔢', color: '#4ADE80',
    desc: 'Counting, adding, subtracting. Where every mathematician begins.',
    topics: ['Counting', 'Addition', 'Subtraction', 'Number Recognition', 'Shapes'],
    ageRange: 'KG — Grade 2', difficulty: 'Foundation',
    sources: ['KS1 SATs', 'Cambridge Primary'],
  },
  {
    id: 2, name: 'Pattern Finder', icon: '🔍', color: '#4ADE80',
    desc: 'Fractions, decimals, multiplication. Seeing patterns everywhere.',
    topics: ['Multiplication', 'Division', 'Fractions', 'Decimals', 'Patterns', 'Time & Money'],
    ageRange: 'Grade 3 — 5', difficulty: 'Foundation',
    sources: ['KS2 SATs', 'Cambridge Primary'],
  },
  {
    id: 3, name: 'Problem Solver', icon: '🧩', color: '#EAB308',
    desc: 'Ratios, percentages, basic equations. Thinking like a mathematician.',
    topics: ['Ratios', 'Percentages', 'Basic Equations', 'Data Handling', 'Angles', 'Probability'],
    ageRange: 'Grade 6 — 7', difficulty: 'Intermediate',
    sources: ['KS3 SATs', '11+ Papers'],
  },
  {
    id: 4, name: 'Algebra Warrior', icon: '⚔️', color: '#EAB308',
    desc: 'Linear equations, Pythagoras, trigonometry. The language of maths.',
    topics: ['Linear Equations', 'Simultaneous Equations', 'Pythagoras', 'Trigonometry', 'Indices', 'Standard Form'],
    ageRange: 'Grade 8 — 9', difficulty: 'Intermediate',
    sources: ['Edexcel iGCSE', 'Cambridge O Level'],
  },
  {
    id: 5, name: 'Cambridge Scholar', icon: '🎓', color: '#4F8EF7',
    desc: 'Full O Level Mathematics. Every topic the examiner tests.',
    topics: ['Number', 'Algebra', 'Geometry', 'Statistics', 'Probability', 'Mensuration', 'Matrices', 'Vectors', 'Transformations'],
    ageRange: 'O Level / IGCSE', difficulty: 'Advanced',
    sources: ['Cambridge 4024', 'Edexcel 4MA1', 'SAT Math'],
  },
  {
    id: 6, name: 'Beyond O Level', icon: '🚀', color: '#4F8EF7',
    desc: 'Additional Mathematics. Functions, calculus introduction, kinematics.',
    topics: ['Functions', 'Quadratics', 'Binomial Theorem', 'Calculus Intro', 'Kinematics', 'Trigonometric Identities'],
    ageRange: 'Additional Maths', difficulty: 'Advanced',
    sources: ['Cambridge 4037', 'Edexcel Further Pure'],
  },
  {
    id: 7, name: 'Pure Mathematician', icon: '📐', color: '#7C3AED',
    desc: 'A Level Pure Mathematics. Differentiation, integration, series.',
    topics: ['Differentiation', 'Integration', 'Series', 'Vectors', 'Proof', 'Coordinate Geometry', 'Exponentials & Logarithms'],
    ageRange: 'A Level Pure', difficulty: 'Expert',
    sources: ['Cambridge 9709', 'Edexcel Pure Maths Year 1+2', 'SAT Advanced'],
  },
  {
    id: 8, name: 'Applied Mathematician', icon: '📊', color: '#7C3AED',
    desc: 'Statistics and Mechanics. Probability, distributions, forces.',
    topics: ['Statistical Diagrams', 'Probability Distributions', 'Hypothesis Testing', 'Forces', 'Kinematics', 'Moments'],
    ageRange: 'A Level Stats & Mechanics', difficulty: 'Expert',
    sources: ['Cambridge 9709', 'Edexcel Stats & Mechanics Year 1+2'],
  },
  {
    id: 9, name: 'Further Mathematician', icon: '🌌', color: '#EC4899',
    desc: 'Complex numbers, matrices, polar coordinates. The frontier.',
    topics: ['Complex Numbers', 'Matrices', 'Polar Coordinates', 'Hyperbolic Functions', 'Differential Equations', 'Further Integration'],
    ageRange: 'Further Maths', difficulty: 'Expert',
    sources: ['Cambridge 9231', 'Edexcel Further Pure 1-3'],
  },
  {
    id: 10, name: 'Newton', icon: '🍎', color: '#EF4444',
    desc: 'Think like Newton. Proof. Olympiad problems. Mathematical creativity.',
    topics: ['Mathematical Proof', 'Number Theory', 'Combinatorics', 'Optimization', 'Mathematical Modelling', 'Research Problems'],
    ageRange: 'Genius Level', difficulty: 'Genius',
    sources: ['Olympiad Papers', 'University Entrance', 'Research Problems'],
  },
];

export default function BecomeNewton() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState(null);

  return (
    <>
      <Head>
        <title>Become Newton — Master Mathematics | NewWorld Education</title>
        <meta name="description" content="From counting to calculus. 10 levels. Every maths question from Cambridge, Edexcel, SAT combined. Create mathematical geniuses. Free to start." />
        <meta property="og:title" content="Become Newton — Can you reach Level 10?" />
        <meta property="og:description" content="From counting to calculus in 10 levels. The world's most comprehensive maths journey." />
      </Head>

      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Sora',-apple-system,sans-serif" }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '60px 20px 40px', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🍎</div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px', lineHeight: 1.2 }}>
            Become <span style={{ color: GOLD }}>Newton</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,.5)', lineHeight: 1.7, margin: '0 0 8px' }}>
            From counting to calculus. 10 levels. Every maths question from Cambridge, Edexcel, and SAT — combined into one journey.
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.3)' }}>
            Available in Urdu, Sindhi, Arabic, and 15+ languages.
          </p>
        </div>

        {/* The Journey — 10 Levels */}
        <div style={{ maxWidth: 650, margin: '0 auto', padding: '0 20px 40px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: 2, textAlign: 'center', marginBottom: 24 }}>THE JOURNEY</div>

          {/* Connecting line */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 28, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #4ADE80, #4F8EF7, #7C3AED, #EC4899, #EF4444)' }} />

            {LEVELS.map((level, i) => (
              <div key={level.id}
                onClick={() => setSelectedLevel(selectedLevel === level.id ? null : level.id)}
                style={{
                  position: 'relative', marginBottom: 12, cursor: 'pointer',
                  marginLeft: i % 2 === 0 ? 0 : 20,
                }}>
                {/* Node */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 28, flexShrink: 0,
                    background: `${level.color}15`, border: `2px solid ${level.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, zIndex: 1,
                    boxShadow: selectedLevel === level.id ? `0 0 20px ${level.color}44` : 'none',
                    transition: 'all .2s',
                  }}>
                    {level.icon}
                  </div>

                  <div style={{ flex: 1, paddingTop: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: level.color, letterSpacing: 1 }}>LEVEL {level.id}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,.25)' }}>{level.ageRange}</span>
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 800 }}>{level.name}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginTop: 2 }}>{level.desc}</div>

                    {/* Expanded content */}
                    {selectedLevel === level.id && (
                      <div style={{ marginTop: 12, background: 'rgba(255,255,255,.03)', borderRadius: 12, padding: 16, border: `1px solid ${level.color}22` }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: level.color, marginBottom: 8 }}>TOPICS</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                          {level.topics.map(t => (
                            <span key={t} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: `${level.color}10`, color: level.color, fontWeight: 600 }}>{t}</span>
                          ))}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginBottom: 12 }}>
                          Sources: {level.sources.join(' · ')}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); router.push(`/drill?subject=Mathematics&level=${level.id <= 5 ? 'O Level' : 'A Level'}&topic=${level.topics[0]}`); }}
                          style={{
                            background: level.color, color: '#000', border: 'none', borderRadius: 10,
                            padding: '10px 24px', fontSize: 14, fontWeight: 800, cursor: 'pointer',
                          }}>
                          Start Level {level.id} →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ background: 'rgba(255,255,255,.02)', borderTop: '1px solid rgba(255,255,255,.04)', padding: '40px 20px' }}>
          <div style={{ maxWidth: 650, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, textAlign: 'center' }}>
            {[
              { n: '10', l: 'Levels' },
              { n: '5,000+', l: 'Maths Questions' },
              { n: '6', l: 'Exam Boards' },
              { n: '15+', l: 'Languages' },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: 28, fontWeight: 900, color: GOLD }}>{s.n}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* The Newton Promise */}
        <div style={{ maxWidth: 650, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🍎</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>
            Newton didn't have a tutor. <span style={{ color: GOLD }}>You have one who thinks like Newton.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.45)', lineHeight: 1.8, marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
            Every question from Cambridge, Edexcel, and SAT — combined. Every answer verified against the mark scheme. Every topic broken into tiny steps you can master in 3 minutes. In any language you speak.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/drill?subject=Mathematics')}
              style={{ background: GOLD, color: '#000', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
              Start Your Journey
            </button>
            <button onClick={() => router.push('/daily-challenge')}
              style={{ background: 'rgba(255,255,255,.06)', color: '#fff', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '14px 32px', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
              Daily Challenge
            </button>
          </div>

          {/* Share */}
          <div style={{ marginTop: 32 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', marginBottom: 8 }}>KNOW SOMEONE WHO SHOULD BE HERE?</div>
            <a href={`https://wa.me/?text=${encodeURIComponent('🍎 Become Newton — from counting to calculus in 10 levels. Free maths mastery journey:\nhttps://www.newworld.education/become-newton')}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10, background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              💬 Share on WhatsApp
            </a>
          </div>
        </div>

        <LegalFooter />
        <BottomNav />
      </div>
    </>
  );
}
