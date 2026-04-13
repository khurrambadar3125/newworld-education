// pages/by-school.jsx
// School-first onboarding: pick school -> pick grade -> profile auto-populated -> /learn.
// Replaces the 7-step dropdown flow for the 31 schools already in our KBs.

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import SchoolPicker from '../components/SchoolPicker';
import { schoolToProfile, gradesFromSchool } from '../utils/schoolProfileMap';
import { writeStudentProfile } from '../utils/studentProfile';

export default function BySchool() {
  const [school, setSchool] = useState(null);
  const [grade, setGrade] = useState(null);

  const handleStart = () => {
    const profile = schoolToProfile(school, grade);
    writeStudentProfile(profile);
    const levelLabel = grade?.label?.replace(/\s*\([^)]*\)/, '').trim() || 'O Level';
    window.location.href = `/learn?level=${encodeURIComponent(levelLabel)}`;
  };

  return (
    <>
      <Head>
        <title>Pick your school — NewWorldEdu</title>
        <meta name="description" content="Start by picking your school. We'll set up your curriculum, exam board, and books automatically." />
      </Head>
      <div style={{ background: '#080C18', minHeight: '100vh', color: '#fff', padding: '48px 20px 80px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}>
            ← Back
          </Link>
          <h1
            style={{
              fontFamily: "'Sora',sans-serif",
              fontSize: 'clamp(28px,5vw,44px)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginTop: 24,
              marginBottom: 12,
            }}
          >
            {!school ? 'Pick your school' : `Welcome, ${school.name.split(' ')[0]} student`}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
            {!school
              ? "We'll auto-detect your curriculum, exam board, and books. Skip the dropdowns."
              : "Pick your year — we'll take you to the right study plan."}
          </p>

          {!school && <SchoolPicker onSelect={setSchool} />}

          {school && !grade && (
            <div>
              <div
                style={{
                  background: 'rgba(79,142,247,0.08)',
                  border: '1px solid rgba(79,142,247,0.3)',
                  borderRadius: 12,
                  padding: '16px 20px',
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: '#4F8EF7',
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    marginBottom: 6,
                  }}
                >
                  Detected
                </div>
                <div style={{ fontSize: 15 }}>
                  <strong>{school.name}</strong>
                  {school.city ? ` · ${school.city}` : null}
                  <br />
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                    Curriculum: {(school.curriculumOffered || []).join(' · ') || '—'}
                    <br />
                    {(school.examBoards && school.examBoards.length > 0)
                      ? `Board: ${school.examBoards.join(' · ')}`
                      : (school.examBoard ? `Board: ${school.examBoard}` : null)}
                  </span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
                {gradesFromSchool(school).map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGrade(g)}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 12,
                      padding: '20px 16px',
                      cursor: 'pointer',
                      color: '#fff',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{g.label}</div>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.5)',
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                      }}
                    >
                      Ages {g.age}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSchool(null)}
                style={{
                  marginTop: 24,
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                ← Pick a different school
              </button>
            </div>
          )}

          {school && grade && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
                All set, {school.name.split(' ')[0]} {grade.label}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, marginBottom: 32 }}>
                Curriculum, books, and past papers are configured for your school.
              </p>
              <button
                onClick={handleStart}
                style={{
                  background: 'linear-gradient(135deg,#4F8EF7,#6366F1)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 14,
                  padding: '18px 40px',
                  fontSize: 17,
                  fontWeight: 700,
                  fontFamily: "'Sora',sans-serif",
                  cursor: 'pointer',
                  boxShadow: '0 8px 28px rgba(79,142,247,0.3)',
                }}
              >
                Start Learning →
              </button>
              <div style={{ marginTop: 16 }}>
                <button
                  onClick={() => setGrade(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  ← Pick a different year
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
