/**
 * pages/books.jsx — Books & Syllabus
 * ─────────────────────────────────────────────────────────────────
 * Free textbooks for Sindh Board and Cambridge students.
 * Saves students thousands of rupees on buying/printing books.
 */

import { useState } from 'react';
import Head from 'next/head';
import LegalFooter from '../components/LegalFooter';
import GarageNav from '../components/GarageNav';

const GOLD = '#C9A84C';

// Textbooks hosted on archive.org and Taleem360 (free, no login required)
const SINDH_BOOKS = [
  { subject: 'Physics', icon: '⚛️',
    class9: 'https://archive.org/download/PAKISTANITEXTBOOKS/9TH%20PHYSICS%20Textbook%20KP.pdf',
    class10: 'https://archive.org/download/PAKISTANITEXTBOOKS/10TH%20PHYSICS%20Textbook%20KP.pdf' },
  { subject: 'Chemistry', icon: '🧪',
    class9: 'https://archive.org/download/PAKISTANITEXTBOOKS/CHEMISTRY%209TH%20FBISE.pdf',
    class10: 'https://archive.org/download/PAKISTANITEXTBOOKS/CHEMISTRY%2010TH%20FBISE.pdf' },
  { subject: 'Biology', icon: '🧬',
    class9: 'https://archive.org/download/PAKISTANITEXTBOOKS/Biology%201ST%20Year%20FBISE%20SCANNED.pdf',
    class10: 'https://archive.org/download/PAKISTANITEXTBOOKS/Biology%202nd%20Year%20FBISE.pdf' },
  { subject: 'Mathematics', icon: '🔢',
    class9: 'https://archive.org/download/PAKISTANITEXTBOOKS/1st%20Year%20Mathematics%20Textbook%20KP.pdf',
    class10: 'https://archive.org/download/PAKISTANITEXTBOOKS/2nd%20Year%20Mathematics%20Textbook.pdf' },
  { subject: 'English', icon: '📖',
    class9: 'https://archive.org/download/PAKISTANITEXTBOOKS/2018-G11-ENGLISH%20BOOK%20I.pdf',
    class10: 'https://archive.org/download/PAKISTANITEXTBOOKS/2nd%20Year%20English%20Textbook.pdf' },
  { subject: 'Pakistan Studies', icon: '🇵🇰',
    class9: 'https://archive.org/download/PAKISTANITEXTBOOKS/2nd%20Year%20Pakistan%20Studies%20Textbook%20KP.pdf',
    class10: null },
  { subject: 'Islamiat', icon: '☪️',
    class9: 'https://archive.org/download/PAKISTANITEXTBOOKS/1st%20Year%20Islamiat%20Textbook%20KP.pdf',
    class10: null },
  { subject: 'Urdu', icon: '✍️',
    class9: 'https://archive.org/download/PAKISTANITEXTBOOKS/1st%20Year%20Urdu%20Textbook%20KP.pdf',
    class10: 'https://archive.org/download/PAKISTANITEXTBOOKS/2nd%20Year%20Urdu%20Textbook%20KP.pdf' },
];

export default function BooksPage() {
  const [tab, setTab] = useState('sindh');

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px 80px', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 600, margin: '0 auto' },
    card: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '16px 14px', marginBottom: 8 },
  };

  return (
    <>
      <Head>
        <title>Books & Syllabus — Free Textbooks | NewWorldEdu</title>
        <meta name="description" content="Free textbook PDFs for Sindh Board and Cambridge O Level students. Read online or download. Saves thousands of rupees on printing." />
      </Head>
      <div style={S.page}>
        <div style={S.container}>

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 8 }}>BOOKS & SYLLABUS</div>
            <h1 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 8px' }}>Free Textbooks</h1>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>
              Read online or download. No printing costs. Saves Rs 1,000s.
            </p>
          </div>

          {/* Tab toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, justifyContent: 'center' }}>
            {[
              { id: 'sindh', label: 'Sindh Board (Matric)' },
              { id: 'cambridge', label: 'Cambridge O/A Level' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700,
                  background: tab === t.id ? 'rgba(79,142,247,.15)' : 'rgba(255,255,255,.03)',
                  border: tab === t.id ? '2px solid #4F8EF7' : '1px solid rgba(255,255,255,.06)',
                  color: tab === t.id ? '#4F8EF7' : 'rgba(255,255,255,.5)',
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Sindh Board Books */}
          {tab === 'sindh' && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: 1, marginBottom: 10 }}>
                STBB TEXTBOOKS — SINDH BOARD
              </div>
              {SINDH_BOOKS.map(book => (
                <div key={book.subject} style={S.card}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <span style={{ fontSize: 24 }}>{book.icon}</span>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#FAF6EB' }}>{book.subject}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {book.class9 && (
                      <a href={book.class9} target="_blank" rel="noopener"
                        style={{ flex: 1, padding: '10px 0', borderRadius: 8, background: 'rgba(79,142,247,.08)', border: '1px solid rgba(79,142,247,.15)', color: '#4F8EF7', textDecoration: 'none', textAlign: 'center', fontSize: 13, fontWeight: 700 }}>
                        Class 9 Book
                      </a>
                    )}
                    {book.class10 && (
                      <a href={book.class10} target="_blank" rel="noopener"
                        style={{ flex: 1, padding: '10px 0', borderRadius: 8, background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.15)', color: '#4ADE80', textDecoration: 'none', textAlign: 'center', fontSize: 13, fontWeight: 700 }}>
                        Class 10 Book
                      </a>
                    )}
                    {!book.class10 && <div style={{ flex: 1, padding: '10px 0', textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,.2)' }}>Class 10 coming soon</div>}
                  </div>
                </div>
              ))}

              <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,.25)' }}>
                Source: Sindh Textbook Board (STBB) · Taleem360 · Free for educational use
              </div>
            </>
          )}

          {/* Cambridge Books */}
          {tab === 'cambridge' && (
            <div style={{ padding: '16px 0' }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#FAF6EB', marginBottom: 4 }}>Cambridge Textbooks</div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', lineHeight: 1.7 }}>
                  Cambridge textbooks are copyrighted. Our revision notes cover every chapter — 334 notes across 26 subjects.
                </p>
              </div>
              <a href="/study" style={{ display: 'block', ...S.card, textDecoration: 'none', textAlign: 'center', borderColor: 'rgba(79,142,247,.2)', background: 'rgba(79,142,247,.04)' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#4F8EF7', marginBottom: 4 }}>📖 O Level Revision Notes</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>17 subjects · 202 notes · Every textbook chapter covered</div>
              </a>
              <a href="/study?level=A+Level" style={{ display: 'block', ...S.card, textDecoration: 'none', textAlign: 'center', borderColor: 'rgba(201,168,76,.2)', background: 'rgba(201,168,76,.04)' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: GOLD, marginBottom: 4 }}>📖 A Level Revision Notes</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>9 subjects · 132 notes · AS + A2 chapters covered</div>
              </a>
            </div>
          )}

          {/* Sindh Board Revision Notes — same as Cambridge section */}
          {tab === 'sindh' && (
            <a href="/sindh-board" style={{ display: 'block', ...S.card, textDecoration: 'none', textAlign: 'center', marginTop: 16, borderColor: 'rgba(79,142,247,.2)', background: 'rgba(79,142,247,.04)' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#4F8EF7', marginBottom: 4 }}>📝 Sindh Board Revision Notes</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>12 subjects · 169 notes · Class 9 & 10 · Interactive MCQs</div>
            </a>
          )}

          {/* Link to study */}
          <a href="/sindh-board" style={{ display: 'block', background: 'rgba(201,168,76,.04)', border: '1px solid rgba(201,168,76,.15)', borderRadius: 14, padding: '16px', marginTop: 20, textDecoration: 'none', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: GOLD }}>Read the book. Then study the notes. Then practice.</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 4 }}>Go to Matric Study Path →</div>
          </a>

        </div>
      </div>
      <LegalFooter />
      <GarageNav />
    </>
  );
}
