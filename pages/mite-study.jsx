/**
 * pages/mite-study.jsx — MiTE University Study Section
 * ─────────────────────────────────────────────────────────────────
 * AI tutor for BBA, BS-CS, BS-FD, and Accounting undergraduate courses.
 * Students select course → topic → get AI-powered study support.
 */

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LegalFooter from '../components/LegalFooter';

const GOLD = '#C9A84C';

const COURSES = {
  BBA: {
    icon: '💼', color: '#4F8EF7',
    semesters: [
      { sem: 'Semester 1', courses: [
        { name: 'Principles of Management', topics: ['Planning', 'Organizing', 'Leading', 'Controlling', 'Decision Making', 'Organizational Structure'] },
        { name: 'Financial Accounting', topics: ['Double Entry', 'Trial Balance', 'Income Statement', 'Balance Sheet', 'Cash Flow', 'Depreciation', 'Bank Reconciliation'] },
        { name: 'Business Mathematics', topics: ['Interest & Annuities', 'Matrices', 'Linear Programming', 'Statistics', 'Probability'] },
        { name: 'English Composition', topics: ['Essay Writing', 'Report Writing', 'Business Communication', 'Presentation Skills'] },
        { name: 'Microeconomics', topics: ['Supply & Demand', 'Elasticity', 'Market Structures', 'Consumer Theory', 'Production Costs'] },
      ]},
      { sem: 'Semester 2', courses: [
        { name: 'Marketing Management', topics: ['Marketing Mix (4Ps)', 'Consumer Behavior', 'Market Segmentation', 'Branding', 'Digital Marketing'] },
        { name: 'Macroeconomics', topics: ['GDP & National Income', 'Inflation', 'Unemployment', 'Monetary Policy', 'Fiscal Policy', 'International Trade'] },
        { name: 'Business Statistics', topics: ['Descriptive Statistics', 'Probability Distributions', 'Hypothesis Testing', 'Regression', 'Correlation'] },
        { name: 'Business Law', topics: ['Contract Law', 'Company Law', 'Partnership Act', 'Consumer Protection', 'Employment Law'] },
      ]},
    ],
  },
  BSCS: {
    icon: '💻', color: '#4ADE80',
    semesters: [
      { sem: 'Semester 1', courses: [
        { name: 'Introduction to Programming', topics: ['Variables & Data Types', 'Control Flow', 'Functions', 'Arrays', 'OOP Basics', 'File Handling'] },
        { name: 'Calculus', topics: ['Limits', 'Differentiation', 'Integration', 'Applications', 'Sequences & Series'] },
        { name: 'Digital Logic Design', topics: ['Number Systems', 'Boolean Algebra', 'Logic Gates', 'Combinational Circuits', 'Sequential Circuits', 'Flip-Flops'] },
        { name: 'English Communication', topics: ['Technical Writing', 'Presentation', 'Report Writing', 'Professional Email'] },
      ]},
      { sem: 'Semester 2', courses: [
        { name: 'Data Structures', topics: ['Arrays', 'Linked Lists', 'Stacks & Queues', 'Trees', 'Graphs', 'Sorting Algorithms', 'Searching'] },
        { name: 'Object-Oriented Programming', topics: ['Classes & Objects', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction', 'Design Patterns'] },
        { name: 'Discrete Mathematics', topics: ['Set Theory', 'Relations', 'Graph Theory', 'Combinatorics', 'Proof Techniques', 'Recurrence Relations'] },
        { name: 'Database Systems', topics: ['ER Diagrams', 'SQL', 'Normalization', 'Transactions', 'Indexing', 'NoSQL Basics'] },
      ]},
    ],
  },
  'BS-FD': {
    icon: '🎨', color: '#7C3AED',
    semesters: [
      { sem: 'Semester 1', courses: [
        { name: 'Fashion Illustration', topics: ['Figure Drawing', 'Fashion Croquis', 'Rendering Techniques', 'Fabric Illustration', 'Digital Illustration'] },
        { name: 'Pattern Making', topics: ['Body Measurements', 'Basic Blocks', 'Dart Manipulation', 'Pattern Grading', 'Draping Techniques'] },
        { name: 'Textile Science', topics: ['Fiber Properties', 'Fabric Construction', 'Finishing Processes', 'Fabric Identification', 'Sustainable Textiles'] },
        { name: 'Color Theory & Design', topics: ['Color Wheel', 'Color Harmonies', 'Design Elements', 'Design Principles', 'Visual Composition'] },
      ]},
      { sem: 'Semester 2', courses: [
        { name: 'Garment Construction', topics: ['Sewing Techniques', 'Seam Types', 'Fasteners', 'Fitting & Alterations', 'Quality Control'] },
        { name: 'History of Fashion', topics: ['Ancient Costume', 'Western Fashion History', 'South Asian Fashion', 'Contemporary Designers', 'Fashion Movements'] },
        { name: 'Digital Design (CAD)', topics: ['Adobe Illustrator for Fashion', 'Photoshop Techniques', 'Technical Drawings', 'Portfolio Layout', 'Print Design'] },
      ]},
    ],
  },
  Accounting: {
    icon: '📊', color: '#F97316',
    semesters: [
      { sem: 'Semester 1', courses: [
        { name: 'Financial Accounting', topics: ['Double Entry', 'Trial Balance', 'Income Statement', 'Balance Sheet', 'Cash Flow', 'Depreciation', 'Bank Reconciliation'] },
        { name: 'Business Mathematics', topics: ['Interest & Annuities', 'Matrices', 'Linear Programming', 'Statistics', 'Probability'] },
        { name: 'Microeconomics', topics: ['Supply & Demand', 'Elasticity', 'Market Structures', 'Consumer Theory', 'Production Costs'] },
        { name: 'Business Communication', topics: ['Report Writing', 'Business Letters', 'Presentation Skills', 'Professional Email'] },
      ]},
      { sem: 'Semester 2', courses: [
        { name: 'Cost Accounting', topics: ['Cost Classification', 'Job Costing', 'Process Costing', 'Budgeting', 'Variance Analysis'] },
        { name: 'Taxation', topics: ['Income Tax Ordinance', 'Tax Computation', 'Sales Tax', 'Withholding Tax', 'Tax Filing'] },
        { name: 'Corporate Finance', topics: ['Time Value of Money', 'Capital Budgeting', 'Risk & Return', 'Cost of Capital', 'Working Capital'] },
      ]},
    ],
  },
};

export default function MiTEStudy() {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px 40px', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 600, margin: '0 auto' },
    card: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '16px 14px', marginBottom: 8 },
  };

  return (
    <>
      <Head><title>MiTE Study — AI Tutor for University Courses | NewWorldEdu</title></Head>
      <div style={S.page}>
        <div style={S.container}>

          <button onClick={() => selectedCourse ? setSelectedCourse(null) : selectedProgram ? setSelectedProgram(null) : router.push('/mite')}
            style={{ background: 'none', border: 'none', color: '#4F8EF7', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>← Back</button>

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 8 }}>MiTE STUDY</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 8px' }}>
              {selectedCourse ? selectedCourse.name : selectedProgram ? COURSES[selectedProgram].icon + ' ' + selectedProgram : 'Choose Your Program'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>
              {selectedCourse ? 'Pick a topic → Ask Starky anything about it' : 'AI-powered study support for every course'}
            </p>
          </div>

          {/* Program Selection */}
          {!selectedProgram && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {Object.entries(COURSES).map(([key, prog]) => (
                <button key={key} onClick={() => setSelectedProgram(key)}
                  style={{ ...S.card, cursor: 'pointer', textAlign: 'center', padding: '28px 14px', borderColor: `${prog.color}22` }}
                  onMouseOver={e => e.currentTarget.style.borderColor = prog.color}
                  onMouseOut={e => e.currentTarget.style.borderColor = `${prog.color}22`}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{prog.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: prog.color }}>{key}</div>
                </button>
              ))}
            </div>
          )}

          {/* Course List */}
          {selectedProgram && !selectedCourse && (
            <>
              {COURSES[selectedProgram].semesters.map(sem => (
                <div key={sem.sem}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: 1, marginTop: 16, marginBottom: 8 }}>{sem.sem.toUpperCase()}</div>
                  {sem.courses.map(course => (
                    <button key={course.name} onClick={() => setSelectedCourse(course)}
                      style={{ ...S.card, width: '100%', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#FAF6EB' }}>{course.name}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>{course.topics.length} topics</div>
                      </div>
                      <span style={{ color: 'rgba(255,255,255,.2)' }}>▸</span>
                    </button>
                  ))}
                </div>
              ))}
            </>
          )}

          {/* Topic List → Starky */}
          {selectedCourse && (
            <>
              {selectedCourse.topics.map(topic => (
                <a key={topic}
                  href={`/?message=${encodeURIComponent(`I'm studying ${selectedCourse.name} at MiTE University (${selectedProgram} program). Please explain "${topic}" in detail with examples. After explaining, tell me to go back to my course page to continue studying.`)}&returnTo=${encodeURIComponent('/mite-study')}`}
                  style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', cursor: 'pointer' }}
                  onMouseOver={e => e.currentTarget.style.borderColor = COURSES[selectedProgram]?.color || '#4F8EF7'}
                  onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'}>
                  <div style={{ width: 32, height: 32, borderRadius: 16, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'rgba(255,255,255,.3)', flexShrink: 0 }}>★</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#FAF6EB' }}>{topic}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>Tap to study with Starky</div>
                  </div>
                  <span style={{ color: COURSES[selectedProgram]?.color || '#4F8EF7', fontSize: 12, fontWeight: 700 }}>Learn →</span>
                </a>
              ))}

              <div style={{ ...S.card, marginTop: 16, textAlign: 'center', background: 'rgba(201,168,76,.04)', borderColor: 'rgba(201,168,76,.15)' }}>
                <div style={{ fontSize: 13, color: GOLD, fontWeight: 700 }}>Practice for this course?</div>
                <a href="/mite-prep" style={{ fontSize: 12, color: '#4F8EF7', textDecoration: 'none' }}>Go to Entrance Test Prep →</a>
              </div>
            </>
          )}

        </div>
      </div>
      <LegalFooter />
    </>
  );
}
