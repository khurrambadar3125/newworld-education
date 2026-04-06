/**
 * pages/sindh-board.jsx — Sindh Board (BSEK/AKU-EB) Study Section
 * ─────────────────────────────────────────────────────────────────
 * For The Garage School and all Sindh Board matric students.
 * Class 9 & 10 — select subject → see chapters → read notes → practice.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSindhSubjectsWithMeta, getSindhChapters, SINDH_SYLLABUS } from '../utils/sindhBoardSyllabus';
import LegalFooter from '../components/LegalFooter';
import BottomNav from '../components/BottomNav';

const GOLD = '#C9A84C';
const subjects = getSindhSubjectsWithMeta();

export default function SindhBoardStudy() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState(9);
  const [chapters, setChapters] = useState([]);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [noteData, setNoteData] = useState({});

  useEffect(() => {
    if (!selectedSubject) { setChapters([]); return; }
    const ch = getSindhChapters(selectedSubject, selectedClass);
    setChapters(ch || []);
    setExpandedChapter(null);
  }, [selectedSubject, selectedClass]);

  // Load note when chapter expanded
  const loadNote = async (subject, classNum, chapterId) => {
    const key = `${subject}_${classNum}_${chapterId}`;
    if (noteData[key]) return;
    try {
      const filename = `Sindh-${subject.replace(/\s+/g, '-')}_${classNum}_${chapterId}.json`;
      const res = await fetch(`/data/nano-notes-sindh/${filename}`);
      if (res.ok) {
        const data = await res.json();
        setNoteData(prev => ({ ...prev, [key]: data.note_data }));
      }
    } catch {}
  };

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px 80px', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 600, margin: '0 auto' },
    card: { background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 14, padding: '16px 14px', marginBottom: 8 },
  };

  return (
    <>
      <Head>
        <title>Sindh Board Study — Class 9 & 10 | NewWorldEdu</title>
        <meta name="description" content="Free revision notes for Sindh Board (BSEK) Matric Class 9 and 10. Physics, Chemistry, Biology, Maths, and more. Aligned to STBB textbooks." />
      </Head>
      <div style={S.page}>
        <div style={S.container}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 8 }}>SINDH BOARD · BSEK · AKU-EB</div>
            <h1 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 8px' }}>
              Matric Study Path
            </h1>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, marginBottom: 4 }}>
              11 subjects · 159 chapters · Revision notes for every chapter
            </p>
            <p style={{ color: 'rgba(255,255,255,.25)', fontSize: 12 }}>
              اردو · سنڌي · English · پښتو · پنجابی — Starky speaks your language
            </p>
          </div>

          {/* Class Toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
            {[9, 10].map(c => (
              <button key={c} onClick={() => setSelectedClass(c)}
                style={{
                  padding: '10px 28px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700,
                  background: selectedClass === c ? 'rgba(79,142,247,.15)' : 'rgba(255,255,255,.03)',
                  border: selectedClass === c ? '2px solid #4F8EF7' : '1px solid rgba(255,255,255,.06)',
                  color: selectedClass === c ? '#4F8EF7' : 'rgba(255,255,255,.5)',
                }}>
                Class {c}
              </button>
            ))}
          </div>

          {/* Subject Grid */}
          {!selectedSubject && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {subjects.map(s => {
                const classChapters = selectedClass === 9
                  ? SINDH_SYLLABUS[s.name]?.class9?.chapters?.length || 0
                  : SINDH_SYLLABUS[s.name]?.class10?.chapters?.length || 0;
                return (
                  <button key={s.name} onClick={() => setSelectedSubject(s.name)}
                    style={{
                      ...S.card, cursor: 'pointer', textAlign: 'left',
                      borderColor: 'rgba(255,255,255,.06)',
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,.3)'}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)'}>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>
                      {classChapters} chapters · {s.group}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Chapter List */}
          {selectedSubject && (
            <>
              <button onClick={() => setSelectedSubject('')}
                style={{ background: 'none', border: 'none', color: '#4F8EF7', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 12, padding: 0 }}>
                ← All Subjects
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900 }}>{selectedSubject}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>Class {selectedClass} · {chapters.length} chapters · Sindh Board</div>
                </div>
              </div>

              {chapters.length === 0 && (
                <div style={{ ...S.card, textAlign: 'center', color: 'rgba(255,255,255,.4)' }}>
                  No chapters available for Class {selectedClass}. Try Class {selectedClass === 9 ? 10 : 9}.
                </div>
              )}

              {chapters.map((ch, i) => {
                const isExpanded = expandedChapter === ch.id;
                const noteKey = `${selectedSubject}_${selectedClass}_${ch.id}`;
                const note = noteData[noteKey];

                return (
                  <div key={ch.id} style={{ marginBottom: 6 }}>
                    <button
                      onClick={() => {
                        setExpandedChapter(isExpanded ? null : ch.id);
                        if (!isExpanded) loadNote(selectedSubject, selectedClass, ch.id);
                      }}
                      style={{
                        width: '100%', padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                        background: isExpanded ? 'rgba(79,142,247,.04)' : 'rgba(255,255,255,.03)',
                        border: isExpanded ? '1px solid rgba(79,142,247,.2)' : '1px solid rgba(255,255,255,.06)',
                        textAlign: 'left', color: '#fff', display: 'flex', alignItems: 'center', gap: 12,
                      }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 16, flexShrink: 0,
                        background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,.4)',
                      }}>
                        {ch.id}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{ch.name}</div>
                      </div>
                      <span style={{ color: 'rgba(255,255,255,.2)', fontSize: 14 }}>{isExpanded ? '▾' : '▸'}</span>
                    </button>

                    {/* Expanded: show note */}
                    {isExpanded && (
                      <div style={{ padding: '12px 16px 12px 60px' }}>
                        {!note && <div style={{ color: 'rgba(255,255,255,.3)', fontSize: 13 }}>Loading notes...</div>}
                        {note && (
                          <>
                            {/* Key Points */}
                            {note.keyPoints?.map((p, j) => (
                              <div key={j} style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', lineHeight: 1.7, padding: '3px 0' }}>
                                <span style={{ color: '#4ADE80', marginRight: 6 }}>•</span>{p}
                              </div>
                            ))}

                            {/* Definitions */}
                            {note.definitions?.length > 0 && (
                              <div style={{ marginTop: 10 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#4F8EF7', marginBottom: 4 }}>KEY DEFINITIONS</div>
                                {note.definitions.map((d, j) => (
                                  <div key={j} style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginBottom: 4 }}>
                                    <strong style={{ color: '#4F8EF7' }}>{d.term}:</strong> {d.definition}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Common Mistakes */}
                            {note.commonMistakes?.length > 0 && (
                              <div style={{ marginTop: 10 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', marginBottom: 4 }}>DON'T LOSE MARKS</div>
                                {note.commonMistakes.map((m, j) => (
                                  <div key={j} style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', padding: '2px 0' }}>
                                    <span style={{ color: '#EF4444', marginRight: 4 }}>✗</span>{m}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* MCQs */}
                            {note.mcqs?.length > 0 && (
                              <div style={{ marginTop: 10 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, marginBottom: 4 }}>PRACTICE MCQs</div>
                                {note.mcqs.map((q, j) => (
                                  <div key={j} style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.04)', borderRadius: 8, padding: '10px 12px', marginBottom: 6 }}>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', marginBottom: 6 }}>{q.question}</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                                      {Object.entries(q.options || {}).map(([key, val]) => (
                                        <div key={key} style={{ fontSize: 11, color: key === q.correct ? '#4ADE80' : 'rgba(255,255,255,.4)', padding: '4px 8px', borderRadius: 4, background: key === q.correct ? 'rgba(74,222,128,.06)' : 'transparent' }}>
                                          {key}) {val}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Ask Starky — with return URL so student comes back */}
                            <a href={`/?message=${encodeURIComponent(`I'm studying ${selectedSubject} Class ${selectedClass}, chapter "${ch.name}" (Sindh Board). Please explain the key concepts briefly then tell me to go back to my notes and practice.`)}&returnTo=${encodeURIComponent('/sindh-board')}`}
                              style={{ display: 'block', textAlign: 'center', fontSize: 12, color: '#4F8EF7', textDecoration: 'none', padding: '10px 0', marginTop: 8 }}>
                              Samajh nahi aaya? Starky se poochein →
                            </a>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* IBA Pipeline */}
          {!selectedSubject && (
            <>
              {/* Bootcamp CTA */}
              <a href="/bootcamp-sindh" style={{ display: 'block', background: 'rgba(79,142,247,.06)', border: '1px solid rgba(79,142,247,.2)', borderRadius: 14, padding: '18px 16px', marginTop: 16, textDecoration: 'none', textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#4F8EF7', marginBottom: 4 }}>🎯 Start a Bootcamp</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Set your goal. Get a daily study plan. Follow it until exam day.</div>
              </a>

              {/* University path */}
              <div style={{ background: 'rgba(201,168,76,.04)', border: '1px solid rgba(201,168,76,.15)', borderRadius: 14, padding: '20px 16px', marginTop: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 8 }}>YOUR FUTURE PATH</div>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
                  {['Master Matric', '→', 'Intermediate (FSc)', '→', 'Entry Tests', '→', 'IBA / LUMS / NUST'].map((s, i) => (
                    <span key={i} style={{ fontSize: 11, fontWeight: s === '→' ? 400 : 700, color: s === '→' ? 'rgba(255,255,255,.3)' : GOLD }}>{s}</span>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>Master your Matric subjects first. Entry test prep unlocks after.</div>
              </div>

              {/* Ask Starky */}
              <a href="/?message=I'm%20a%20Sindh%20Board%20student.%20Help%20me%20study." style={{ display: 'block', textAlign: 'center', fontSize: 13, color: '#4F8EF7', textDecoration: 'none', padding: '16px 0', marginTop: 8 }}>
                Need help? Talk to Starky in Urdu, Sindhi, or English →
              </a>
            </>
          )}

        </div>
      </div>
      <LegalFooter />
      <BottomNav />
    </>
  );
}
