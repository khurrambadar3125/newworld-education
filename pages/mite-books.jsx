/**
 * pages/mite-books.jsx — MiTE University Books & Resources
 * HEC-prescribed textbooks + free OpenStax alternatives
 */

import { useState } from 'react';
import Head from 'next/head';
import LegalFooter from '../components/LegalFooter';

const GOLD = '#C9A84C';

const PROGRAMS = [
  {
    name: 'BBA', icon: '💼', color: '#4F8EF7',
    books: [
      { course: 'Principles of Management', book: 'Management', author: 'Robbins & Coulter', free: 'https://openstax.org/details/books/principles-management' },
      { course: 'Financial Accounting', book: 'Financial Accounting', author: 'Horngren / Kieso', free: 'https://openstax.org/details/books/principles-financial-accounting' },
      { course: 'Microeconomics', book: 'Principles of Microeconomics', author: 'Mankiw', free: 'https://openstax.org/details/books/principles-microeconomics-3e' },
      { course: 'Macroeconomics', book: 'Principles of Macroeconomics', author: 'Mankiw', free: 'https://openstax.org/details/books/principles-macroeconomics-3e' },
      { course: 'Business Statistics', book: 'Introductory Business Statistics', author: 'Holmes et al', free: 'https://openstax.org/details/books/introductory-business-statistics-2e' },
      { course: 'Organizational Behavior', book: 'Organizational Behavior', author: 'Robbins & Judge', free: 'https://openstax.org/details/books/organizational-behavior' },
      { course: 'Business Ethics', book: 'Business Ethics', author: 'OpenStax', free: 'https://openstax.org/details/books/business-ethics' },
      { course: 'Marketing', book: 'Principles of Marketing', author: 'Kotler & Armstrong', free: 'https://openstax.org/details/books/principles-marketing' },
    ],
  },
  {
    name: 'BS-CS', icon: '💻', color: '#4ADE80',
    books: [
      { course: 'Programming Fundamentals', book: 'C++ How to Program', author: 'Deitel & Deitel', free: null },
      { course: 'Data Structures', book: 'Data Structures & Algorithm Analysis', author: 'Mark Allen Weiss', free: null },
      { course: 'Database Systems', book: 'Database System Concepts', author: 'Silberschatz, Korth, Sudarshan', free: null },
      { course: 'Operating Systems', book: 'Operating System Concepts', author: 'Silberschatz, Galvin, Gagne', free: null },
      { course: 'Computer Networks', book: 'Computer Networking: A Top-Down Approach', author: 'Kurose & Ross', free: null },
      { course: 'Algorithms', book: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest, Stein (CLRS)', free: null },
      { course: 'Artificial Intelligence', book: 'Artificial Intelligence: A Modern Approach', author: 'Russell & Norvig', free: null },
      { course: 'Calculus', book: 'Calculus Volume 1', author: 'OpenStax', free: 'https://openstax.org/details/books/calculus-volume-1' },
      { course: 'Linear Algebra', book: 'College Algebra', author: 'OpenStax', free: 'https://openstax.org/details/books/college-algebra-2e' },
    ],
  },
];

export default function MiTEBooks() {
  const [selectedProgram, setSelectedProgram] = useState(null);

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px 40px', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 640, margin: '0 auto' },
    card: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '16px 14px', marginBottom: 8 },
  };

  return (
    <>
      <Head><title>Books & Resources — MiTE University | NewWorldEdu</title></Head>
      <div style={S.page}>
        <div style={S.container}>
          <a href="/mite-portal" style={{ fontSize: 13, color: '#4F8EF7', textDecoration: 'none', fontWeight: 700 }}>← Back to Portal</a>

          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 8 }}>BOOKS & RESOURCES</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 8px' }}>Prescribed Textbooks</h1>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>HEC-prescribed curriculum. Free OpenStax alternatives where available.</p>
          </div>

          {/* Program selector */}
          {!selectedProgram && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {PROGRAMS.map(p => (
                <button key={p.name} onClick={() => setSelectedProgram(p)}
                  style={{ ...S.card, cursor: 'pointer', textAlign: 'center', padding: '24px 14px', borderColor: `${p.color}22` }}
                  onMouseOver={e => e.currentTarget.style.borderColor = p.color}
                  onMouseOut={e => e.currentTarget.style.borderColor = `${p.color}22`}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{p.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: p.color }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>{p.books.length} textbooks</div>
                </button>
              ))}
            </div>
          )}

          {/* Book list */}
          {selectedProgram && (
            <>
              <button onClick={() => setSelectedProgram(null)} style={{ background: 'none', border: 'none', color: '#4F8EF7', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}>← All Programs</button>

              <div style={{ fontSize: 18, fontWeight: 900, color: selectedProgram.color, marginBottom: 16 }}>{selectedProgram.icon} {selectedProgram.name} Textbooks</div>

              {selectedProgram.books.map((b, i) => (
                <div key={i} style={S.card}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 4 }}>{b.course}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#FAF6EB' }}>{b.book}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 2 }}>{b.author}</div>
                  {b.note && <div style={{ fontSize: 11, color: GOLD, marginTop: 4 }}>{b.note}</div>}
                  {b.free && (
                    <a href={b.free} target="_blank" rel="noopener"
                      style={{ display: 'inline-block', marginTop: 8, fontSize: 12, fontWeight: 700, color: '#4ADE80', textDecoration: 'none', padding: '4px 12px', borderRadius: 6, background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.15)' }}>
                      📖 Free on OpenStax →
                    </a>
                  )}
                </div>
              ))}
            </>
          )}

        </div>
      </div>
      <LegalFooter />
    </>
  );
}
