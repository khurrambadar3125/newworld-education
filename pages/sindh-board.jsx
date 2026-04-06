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

  // Always set Sindh Board context — so nav routes correctly everywhere
  if (typeof window !== 'undefined') {
    try {
      const p = JSON.parse(localStorage.getItem('nw_user') || '{}');
      if (p.board !== 'sindh') { p.board = 'sindh'; p.curriculum = 'sindh'; localStorage.setItem('nw_user', JSON.stringify(p)); }
    } catch {}
  }
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
    card: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '16px 14px', marginBottom: 8 },
  };

  return (
    <>
      <Head>
        <title>Sindh Board Study — Class 9 & 10 | NewWorldEdu</title>
        <meta name="description" content="Free revision notes for Sindh Board (BSEK) Matric Class 9 and 10. Physics, Chemistry, Biology, Maths, and more. Aligned to STBB textbooks." />
      </Head>
      <div style={S.page}>
        <div style={S.container}>

          {/* Back button */}
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#4F8EF7', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 0, marginBottom: 12 }}>← Back</button>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 8 }}>SINDH BOARD · BSEK · AKU-EB</div>
            <h1 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 8px' }}>
              Matric Study Path
            </h1>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, marginBottom: 4 }}>
              11 subjects · 159 chapters · 50,000+ verified questions · Revision notes for every chapter
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
                      background: 'rgba(255,255,255,.05)', borderColor: 'rgba(255,255,255,.1)',
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,.4)'; e.currentTarget.style.background = 'rgba(201,168,76,.08)'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'; e.currentTarget.style.background = 'rgba(255,255,255,.05)'; }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#FAF6EB' }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', marginTop: 2 }}>
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
                        background: isExpanded ? 'rgba(79,142,247,.06)' : 'rgba(255,255,255,.05)',
                        border: isExpanded ? '2px solid rgba(79,142,247,.3)' : '1px solid rgba(255,255,255,.1)',
                        textAlign: 'left', color: '#FAF6EB', display: 'flex', alignItems: 'center', gap: 12,
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
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#FAF6EB' }}>{ch.name}</div>
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
                              <div key={j} style={{ fontSize: 15, color: 'rgba(255,255,255,.85)', lineHeight: 1.8, padding: '5px 0', borderBottom: j < note.keyPoints.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                                <span style={{ color: '#4ADE80', marginRight: 8, fontWeight: 700 }}>•</span>{p}
                              </div>
                            ))}

                            {/* Definitions */}
                            {note.definitions?.length > 0 && (
                              <div style={{ marginTop: 16, background: 'rgba(79,142,247,.04)', border: '1px solid rgba(79,142,247,.15)', borderRadius: 10, padding: '14px 16px' }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#4F8EF7', marginBottom: 8, letterSpacing: 1 }}>KEY DEFINITIONS</div>
                                {note.definitions.map((d, j) => (
                                  <div key={j} style={{ fontSize: 14, color: 'rgba(255,255,255,.75)', marginBottom: 8, lineHeight: 1.7 }}>
                                    <strong style={{ color: '#4F8EF7' }}>{d.term}:</strong> {d.definition}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Common Mistakes */}
                            {note.commonMistakes?.length > 0 && (
                              <div style={{ marginTop: 16, background: 'rgba(239,68,68,.04)', border: '1px solid rgba(239,68,68,.15)', borderRadius: 10, padding: '14px 16px' }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#EF4444', marginBottom: 8, letterSpacing: 1 }}>DON'T LOSE MARKS</div>
                                {note.commonMistakes.map((m, j) => (
                                  <div key={j} style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', padding: '4px 0', lineHeight: 1.7 }}>
                                    <span style={{ color: '#EF4444', marginRight: 6 }}>✗</span>{m}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* MCQs */}
                            {note.mcqs?.length > 0 && (
                              <div style={{ marginTop: 16 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, marginBottom: 8, letterSpacing: 1 }}>PRACTICE MCQs</div>
                                {note.mcqs.map((q, j) => (
                                  <div key={j} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '14px 16px', marginBottom: 8 }}>
                                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,.85)', marginBottom: 10, lineHeight: 1.6 }}>{q.question}</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                      {Object.entries(q.options || {}).map(([key, val]) => (
                                        <div key={key} style={{ fontSize: 13, color: key === q.correct ? '#4ADE80' : 'rgba(255,255,255,.5)', padding: '8px 12px', borderRadius: 8, background: key === q.correct ? 'rgba(74,222,128,.08)' : 'rgba(255,255,255,.02)', border: key === q.correct ? '1px solid rgba(74,222,128,.2)' : '1px solid rgba(255,255,255,.04)', fontWeight: key === q.correct ? 700 : 400 }}>
                                          {key}) {val}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Next chapter suggestion */}
                            {(() => {
                              const currentIdx = chapters.findIndex(c => c.id === ch.id);
                              const nextCh = currentIdx >= 0 && currentIdx < chapters.length - 1 ? chapters[currentIdx + 1] : null;
                              return nextCh ? (
                                <button onClick={() => { setExpandedChapter(nextCh.id); loadNote(selectedSubject, selectedClass, nextCh.id); }}
                                  style={{ display: 'block', width: '100%', textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#4ADE80', padding: '12px 16px', marginTop: 12, background: 'rgba(74,222,128,.06)', borderRadius: 10, border: '1px solid rgba(74,222,128,.15)', cursor: 'pointer' }}>
                                  Agle chapter: {nextCh.name} →
                                </button>
                              ) : (
                                <div style={{ textAlign: 'center', fontSize: 13, color: '#4ADE80', fontWeight: 700, padding: '12px 0', marginTop: 8 }}>
                                  Sab chapters hogaye! Bohat ache! 🎉
                                </div>
                              );
                            })()}
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

              {/* Cambridge O/A Level pathway */}
              <a href="/study" style={{ display: 'block', background: 'rgba(201,168,76,.04)', border: '1px solid rgba(201,168,76,.15)', borderRadius: 14, padding: '18px 16px', marginTop: 10, textDecoration: 'none', textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 4 }}>ALSO AVAILABLE</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#FAF6EB', marginBottom: 4 }}>Cambridge O Level & A Level</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>26 subjects · 353 chapters · 334 revision notes · Past paper questions</div>
              </a>

              {/* KG to 8 coming soon */}
              <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 14, padding: '16px', marginTop: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.5)', marginBottom: 4 }}>KG to Class 8 — Coming Soon</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>We're building revision notes for primary and middle school. Stay tuned.</div>
              </div>

              {/* Starky chat — stays on sindh-board, doesn't navigate away */}
              <div style={{ textAlign: 'center', padding: '16px 0', marginTop: 8 }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>
                  Koi sawaal hai? Starky aap ki madad karega — Urdu, Sindhi, ya English mein.
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.25)', marginTop: 4 }}>
                  Neeche Starky ka icon dabayein ★
                </div>
              </div>
            </>
          )}

        </div>
      </div>
      <LegalFooter />
      <BottomNav />
    </>
  );
}
