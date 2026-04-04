/**
 * pages/entrance-tests.jsx — Entrance Test Prep Hub
 * ─────────────────────────────────────────────────────────────────
 * Every A Level student needs an entrance test. We prepare them ALL.
 * Medical, Engineering, Business, Law, University.
 * Sequential nano learning makes monster tests manageable.
 */

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LegalFooter from '../components/LegalFooter';
import BottomNav from '../components/BottomNav';

const FIELDS = [
  {
    id: 'medical', name: 'Medical', icon: '🏥', color: '#EF4444',
    tagline: 'Become a Doctor',
    tests: [
      { name: 'MDCAT', country: '🇵🇰 Pakistan', desc: 'Medical & Dental College Admission Test. 200 MCQs, 3.5 hours.', subjects: ['Biology', 'Chemistry', 'Physics', 'English', 'Logical Reasoning'], candidates: '200,000+', seats: '~30,000', bankReady: true },
      { name: 'UCAT', country: '🇬🇧🇦🇪 UK/UAE/Australia', desc: 'University Clinical Aptitude Test. Computer-based, 2 hours.', subjects: ['Verbal Reasoning', 'Decision Making', 'Quantitative Reasoning', 'Abstract Reasoning', 'Situational Judgement'], candidates: '30,000+', bankReady: false },
      { name: 'BMAT', country: '🇬🇧 UK (Cambridge/Oxford)', desc: 'BioMedical Admissions Test. 2 hours.', subjects: ['Thinking Skills', 'Scientific Knowledge', 'Writing Task'], candidates: '5,000+', bankReady: false },
      { name: 'MCAT', country: '🇺🇸🇨🇦 USA/Canada', desc: 'Medical College Admission Test. 7.5 hours, 230 questions.', subjects: ['Bio/Biochem', 'Chem/Physics', 'Psychology/Sociology', 'Critical Analysis'], candidates: '85,000+', bankReady: false },
      { name: 'NEET', country: '🇮🇳 India', desc: 'National Eligibility cum Entrance Test. 180 MCQs, 3.5 hours.', subjects: ['Biology', 'Chemistry', 'Physics'], candidates: '2,000,000+', bankReady: true },
    ],
  },
  {
    id: 'engineering', name: 'Engineering', icon: '🔧', color: '#F97316',
    tagline: 'Build the Future',
    tests: [
      { name: 'ECAT', country: '🇵🇰 Pakistan', desc: 'Engineering College Admission Test.', subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'], candidates: '100,000+', bankReady: true },
      { name: 'JEE', country: '🇮🇳 India', desc: 'Joint Entrance Examination. India\'s toughest exam.', subjects: ['Mathematics', 'Physics', 'Chemistry'], candidates: '1,200,000+', bankReady: true },
      { name: 'GRE', country: '🌍 Global', desc: 'Graduate Record Examination. For masters/PhD programs.', subjects: ['Verbal Reasoning', 'Quantitative Reasoning', 'Analytical Writing'], candidates: '500,000+', bankReady: false },
    ],
  },
  {
    id: 'business', name: 'Business', icon: '💼', color: '#EAB308',
    tagline: 'Lead Tomorrow',
    tests: [
      { name: 'SAT', country: '🌍 Global', desc: 'Scholastic Assessment Test. 98 questions, 2h14m.', subjects: ['Reading & Writing', 'Math'], candidates: '2,200,000+', bankReady: true, bankCount: '10,000+' },
      { name: 'GMAT', country: '🌍 Global', desc: 'Graduate Management Admission Test. For MBA programs.', subjects: ['Quantitative', 'Verbal', 'Integrated Reasoning', 'Analytical Writing'], candidates: '200,000+', bankReady: false },
      { name: 'CAT', country: '🇮🇳 India', desc: 'Common Admission Test. For Indian IIMs.', subjects: ['Quantitative', 'Verbal', 'Data Interpretation', 'Logical Reasoning'], candidates: '250,000+', bankReady: false },
    ],
  },
  {
    id: 'law', name: 'Law', icon: '⚖️', color: '#7C3AED',
    tagline: 'Seek Justice',
    tests: [
      { name: 'LNAT', country: '🇬🇧 UK', desc: 'National Admissions Test for Law. Verbal reasoning + essay.', subjects: ['Verbal Reasoning', 'Essay Writing'], candidates: '30,000+', bankReady: false },
      { name: 'LSAT', country: '🇺🇸🌍 USA/Global', desc: 'Law School Admission Test. Logical + analytical reasoning.', subjects: ['Logical Reasoning', 'Analytical Reasoning', 'Reading Comprehension'], candidates: '170,000+', bankReady: false },
    ],
  },
  {
    id: 'university', name: 'University', icon: '🎓', color: '#4F8EF7',
    tagline: 'Your Future Starts Here',
    tests: [
      { name: 'SAT', country: '🌍 Global', desc: 'Already in our bank — 10,000+ verified questions.', subjects: ['Reading & Writing', 'Math'], bankReady: true, bankCount: '10,000+' },
      { name: 'ACT', country: '🇺🇸 USA', desc: 'Alternative to SAT. English, Math, Reading, Science.', subjects: ['English', 'Math', 'Reading', 'Science'], candidates: '1,400,000+', bankReady: false },
      { name: 'EmSAT', country: '🇦🇪 UAE', desc: 'Emirates Standardized Test. Mandatory for Grade 12.', subjects: ['English', 'Mathematics', 'Arabic', 'Physics', 'Chemistry', 'Biology'], candidates: '50,000+', bankReady: false },
    ],
  },
];

export default function EntranceTests() {
  const router = useRouter();
  const [selectedField, setSelectedField] = useState(null);
  const [expandedTest, setExpandedTest] = useState(null);

  return (
    <>
      <Head>
        <title>Entrance Test Prep — Medical, Engineering, Business, Law | NewWorld Education</title>
        <meta name="description" content="Prepare for MDCAT, UCAT, MCAT, ECAT, JEE, SAT, GMAT, LNAT, LSAT and more. Sequential nano learning makes monster tests manageable. Start free." />
        <meta property="og:title" content="Every A Level student needs an entrance test. We prepare them ALL." />
      </Head>

      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Sora',-apple-system,sans-serif" }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '60px 20px 40px', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#4F8EF7', letterSpacing: 2, marginBottom: 12 }}>AFTER A LEVELS</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 12px', lineHeight: 1.2 }}>
            Every dream needs an <span style={{ color: '#C9A84C' }}>entrance test</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.5)', lineHeight: 1.7 }}>
            Doctor. Engineer. Business leader. Lawyer. Whatever you want to become — there's a test between you and your dream. We prepare you for all of them.
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.3)', marginTop: 8 }}>
            Sequential nano learning breaks monster tests into 3-minute drills. In any language.
          </p>
        </div>

        {/* Field selector */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', padding: '0 20px 32px', flexWrap: 'wrap' }}>
          {FIELDS.map(f => (
            <button key={f.id} onClick={() => { setSelectedField(selectedField === f.id ? null : f.id); setExpandedTest(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: selectedField === f.id ? `${f.color}20` : 'rgba(255,255,255,.04)',
                color: selectedField === f.id ? f.color : 'rgba(255,255,255,.6)',
                fontWeight: 700, fontSize: 14,
                border: `1px solid ${selectedField === f.id ? `${f.color}40` : 'rgba(255,255,255,.08)'}`,
              }}>
              <span style={{ fontSize: 20 }}>{f.icon}</span>
              {f.name}
            </button>
          ))}
        </div>

        {/* All fields or selected field */}
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px 40px' }}>
          {(selectedField ? FIELDS.filter(f => f.id === selectedField) : FIELDS).map(field => (
            <div key={field.id} style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 28 }}>{field.icon}</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: field.color }}>{field.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>{field.tagline}</div>
                </div>
              </div>

              {field.tests.map(test => (
                <div key={test.name + field.id}
                  onClick={() => setExpandedTest(expandedTest === `${field.id}-${test.name}` ? null : `${field.id}-${test.name}`)}
                  style={{
                    background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)',
                    borderRadius: 14, padding: '18px 20px', marginBottom: 8, cursor: 'pointer',
                    borderColor: expandedTest === `${field.id}-${test.name}` ? `${field.color}30` : 'rgba(255,255,255,.06)',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18, fontWeight: 800 }}>{test.name}</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>{test.country}</span>
                        {test.bankReady && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#4ADE80', background: 'rgba(74,222,128,.1)', padding: '2px 8px', borderRadius: 4 }}>
                            {test.bankCount || 'BANK READY'}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 4 }}>{test.desc}</div>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,.2)', fontSize: 18 }}>{expandedTest === `${field.id}-${test.name}` ? '▾' : '▸'}</span>
                  </div>

                  {expandedTest === `${field.id}-${test.name}` && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.06)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: field.color, marginBottom: 8 }}>SUBJECTS TESTED</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                        {test.subjects.map(s => (
                          <span key={s} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: `${field.color}10`, color: field.color, fontWeight: 600 }}>{s}</span>
                        ))}
                      </div>
                      {test.candidates && (
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginBottom: 12 }}>
                          {test.candidates} candidates annually{test.seats ? ` · ${test.seats} seats` : ''}
                        </div>
                      )}
                      {test.bankReady ? (
                        <button onClick={(e) => { e.stopPropagation(); router.push(`/drill?subject=${test.subjects[0]}`); }}
                          style={{ background: field.color, color: '#000', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
                          Start Practicing →
                        </button>
                      ) : (
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', fontStyle: 'italic' }}>
                          Coming soon — we're building the verified bank for this test.
                          {(test.name === 'MDCAT' || test.name === 'ECAT' || test.name === 'NEET' || test.name === 'JEE') && (
                            <span> Our Bio/Chem/Physics/Maths bank already covers most of the syllabus. <a href="/drill" style={{ color: field.color, textDecoration: 'none' }}>Practice now →</a></span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* The Promise */}
        <div style={{ background: 'rgba(255,255,255,.02)', borderTop: '1px solid rgba(255,255,255,.04)', padding: '48px 20px', textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🎯</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>
              Prep courses charge <span style={{ color: '#EF4444' }}>$500-5,000</span>
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.5)', lineHeight: 1.7, marginBottom: 24 }}>
              We prepare you for <span style={{ color: '#C9A84C', fontWeight: 700 }}>$9.99/month</span>. Same content. Better method. Sequential nano learning breaks any test into 3-minute drills. Your phone becomes your prep course.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/drill" style={{ background: '#4F8EF7', color: '#fff', padding: '14px 32px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
                Start Free →
              </a>
              <a href={`https://wa.me/?text=${encodeURIComponent('Preparing for entrance tests? Free AI tutor with 50,000+ questions:\nhttps://www.newworld.education/entrance-tests')}`}
                target="_blank" rel="noopener noreferrer"
                style={{ background: '#25D366', color: '#fff', padding: '14px 32px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
                💬 Share with Friends
              </a>
            </div>
          </div>
        </div>

        <LegalFooter />
        <BottomNav />
      </div>
    </>
  );
}
