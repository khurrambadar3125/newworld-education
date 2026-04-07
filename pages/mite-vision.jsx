/**
 * pages/mite-vision.jsx — The Full Vision: Roots → MiTE → Pakistan
 */

import { useState } from 'react';
import Head from 'next/head';
import LegalFooter from '../components/LegalFooter';

const GOLD = '#C9A84C';

const STAGES = [
  {
    stage: '01', name: 'Roots Millennium Schools', sub: 'K-12 · Cambridge O & A Level', color: '#4ADE80',
    desc: 'Pakistan\'s third-largest K-12 network. Thousands of students studying Cambridge curriculum across the country.',
    what: ['17 O Level subjects with verified revision notes', '9 A Level subjects with textbook-accurate chapters', '54,000+ verified past paper questions', 'AI tutor that speaks 16 languages', 'SEN support for students with learning differences'],
    href: '/study',
  },
  {
    stage: '02', name: 'MiTE University', sub: 'BBA · BSCS · Law', color: '#4F8EF7',
    desc: 'Where Roots graduates become professionals. AI-powered entrance prep and course support for every program.',
    what: ['1,851 verified entrance test questions (IBA, LAT, FAST)', '24 courses across 3 programs', '520 FAST NUCES past papers for BSCS', '15 LAT papers (2020-2024) for Law', 'Faculty analytics dashboard'],
    href: '/mite-portal',
  },
  {
    stage: '03', name: 'Professional Certifications', sub: 'CFA · ACCA · PMP · AWS', color: '#7C3AED',
    desc: 'After graduation, the learning continues. Professional certification prep powered by the same AI platform.',
    what: ['ACCA exam preparation', 'CFA Level 1-3 study support', 'PMP certification prep', 'AWS / Azure cloud certifications', 'Continuous professional development'],
    href: null,
    coming: true,
  },
  {
    stage: '04', name: 'Every Student in Pakistan', sub: '100 million minds', color: GOLD,
    desc: 'The endgame. One AI platform that serves every student — from KG to career. Every board, every language, every ability level.',
    what: ['Cambridge + Sindh Board + Federal Board + Punjab Board', 'University entrance + undergraduate courses', 'Professional certifications', 'Urdu, Sindhi, Punjabi, Pashto, English', 'Special needs support — first in Pakistan'],
    href: null,
    coming: true,
  },
];

export default function MiTEVision() {
  const [isMobile, setIsMobile] = useState(false);
  if (typeof window !== 'undefined' && !isMobile && window.innerWidth < 768) setIsMobile(true);

  const S = {
    page: { minHeight: '100vh', background: '#080C18', color: '#FAF6EB', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 720, margin: '0 auto', padding: '0 16px' },
  };

  return (
    <>
      <Head>
        <title>The Vision — From Roots to Every Student in Pakistan</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={S.page}>
        <div style={S.container}>

          <a href="/mite-portal" style={{ display: 'inline-block', fontSize: 13, color: '#4F8EF7', textDecoration: 'none', fontWeight: 700, padding: '20px 0' }}>← Back to Portal</a>

          <div style={{ textAlign: 'center', padding: '20px 0 40px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.12em', marginBottom: 12 }}>THE VISION</div>
            <h1 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 900, margin: '0 0 16px', lineHeight: 1.2 }}>
              One platform.<br />
              <span style={{ color: GOLD }}>From first class to last promotion.</span>
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(250,246,235,0.4)', lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
              Not four different apps. Not ten different subscriptions. One AI platform that grows with the student — from Grade 6 to CEO.
            </p>
          </div>

          {/* Timeline */}
          {STAGES.map((stage, i) => (
            <div key={stage.stage} style={{ position: 'relative', paddingLeft: 40, marginBottom: 32 }}>
              {/* Timeline line */}
              {i < STAGES.length - 1 && (
                <div style={{ position: 'absolute', left: 15, top: 40, bottom: -32, width: 2, background: `linear-gradient(to bottom, ${stage.color}, ${STAGES[i+1].color})` }} />
              )}
              {/* Stage number */}
              <div style={{ position: 'absolute', left: 0, top: 0, width: 32, height: 32, borderRadius: 16, background: stage.coming ? 'rgba(250,246,235,0.06)' : `${stage.color}20`, border: `2px solid ${stage.coming ? 'rgba(250,246,235,0.1)' : stage.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: stage.coming ? 'rgba(250,246,235,0.3)' : stage.color }}>
                {stage.stage}
              </div>

              {/* Content */}
              <div style={{ background: 'rgba(250,246,235,0.03)', border: `1px solid ${stage.coming ? 'rgba(250,246,235,0.06)' : `${stage.color}20`}`, borderRadius: 16, padding: '24px 20px', opacity: stage.coming ? 0.6 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: stage.color }}>{stage.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(250,246,235,0.35)' }}>{stage.sub}</div>
                  </div>
                  {stage.coming && <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: 'rgba(250,246,235,0.06)', color: 'rgba(250,246,235,0.3)' }}>COMING</span>}
                  {!stage.coming && stage.href && <a href={stage.href} style={{ fontSize: 11, fontWeight: 700, color: stage.color, textDecoration: 'none' }}>Open →</a>}
                </div>

                <p style={{ fontSize: 13, color: 'rgba(250,246,235,0.5)', lineHeight: 1.7, margin: '0 0 12px' }}>{stage.desc}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {stage.what.map(w => (
                    <div key={w} style={{ fontSize: 12, color: stage.coming ? 'rgba(250,246,235,0.25)' : 'rgba(250,246,235,0.55)' }}>
                      <span style={{ color: stage.coming ? 'rgba(250,246,235,0.15)' : stage.color, marginRight: 6 }}>✓</span>{w}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Quote */}
          <div style={{ textAlign: 'center', padding: '20px 0 40px' }}>
            <p style={{ fontSize: 18, fontStyle: 'italic', color: 'rgba(250,246,235,0.5)', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 16px' }}>
              "Pakistan has 100 million citizens under 15. The platform to unlock their potential doesn't exist yet. We're building it."
            </p>
            <a href="/founder" style={{ fontSize: 13, color: GOLD, textDecoration: 'none', fontWeight: 700 }}>— Khurram Badar, Founder</a>
          </div>

        </div>
      </div>
      <LegalFooter />
    </>
  );
}
