/**
 * pages/sindh-dashboard.jsx — Student Dashboard for Sindh Board students
 * ─────────────────────────────────────────────────────────────────
 * Shows: subjects progress, chapters completed, MCQ scores, what's next.
 * Data from localStorage (nw_sindh_progress).
 * Works for Garage School and all Sindh Board students.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SINDH_SYLLABUS, getSindhSubjectsWithMeta } from '../utils/sindhBoardSyllabus';
import GarageNav from '../components/GarageNav';
import LegalFooter from '../components/LegalFooter';

const GOLD = '#C9A84C';
const subjects = getSindhSubjectsWithMeta();

export default function SindhDashboard() {
  const router = useRouter();
  const [progress, setProgress] = useState({});
  const [selectedClass, setSelectedClass] = useState(9);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('nw_sindh_progress') || '{}');
      setProgress(saved);
      const profile = JSON.parse(localStorage.getItem('nw_user') || '{}');
      setStudentName(profile.name || '');
      // Try bootcamp name
      const bootcamp = JSON.parse(localStorage.getItem('nw_bootcamp_sindh') || '{}');
      if (bootcamp.studentName && !profile.name) setStudentName(bootcamp.studentName);
    } catch {}
  }, []);

  const completedChapters = progress.completedChapters || {};
  const chapterScores = progress.chapterScores || {};

  // Calculate stats
  const getSubjectStats = (subjectName) => {
    const chapters = SINDH_SYLLABUS[subjectName]?.[`class${selectedClass}`]?.chapters || [];
    const done = chapters.filter(c => completedChapters[`${subjectName}_${selectedClass}_${c.id}`]).length;
    const scores = chapters.map(c => chapterScores[`${subjectName}_${selectedClass}_${c.id}`]).filter(Boolean);
    const totalCorrect = scores.reduce((s, sc) => s + (sc.correct || 0), 0);
    const totalMcqs = scores.reduce((s, sc) => s + (sc.total || 0), 0);
    return { total: chapters.length, done, totalCorrect, totalMcqs, accuracy: totalMcqs > 0 ? Math.round((totalCorrect / totalMcqs) * 100) : 0 };
  };

  const allStats = subjects.map(s => ({ name: s.name, group: s.group, ...getSubjectStats(s.name) }));
  const overallDone = allStats.reduce((s, x) => s + x.done, 0);
  const overallTotal = allStats.reduce((s, x) => s + x.total, 0);
  const overallCorrect = allStats.reduce((s, x) => s + x.totalCorrect, 0);
  const overallMcqs = allStats.reduce((s, x) => s + x.totalMcqs, 0);
  const overallPct = overallTotal > 0 ? Math.round((overallDone / overallTotal) * 100) : 0;
  const overallAccuracy = overallMcqs > 0 ? Math.round((overallCorrect / overallMcqs) * 100) : 0;

  // Find next recommended chapter
  const getNextChapter = () => {
    for (const s of allStats) {
      if (s.done < s.total) {
        const chapters = SINDH_SYLLABUS[s.name]?.[`class${selectedClass}`]?.chapters || [];
        const next = chapters.find(c => !completedChapters[`${s.name}_${selectedClass}_${c.id}`]);
        if (next) return { subject: s.name, chapter: next };
      }
    }
    return null;
  };
  const nextChapter = getNextChapter();

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px 80px', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 600, margin: '0 auto' },
    card: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '16px 14px', marginBottom: 8 },
  };

  return (
    <>
      <Head><title>My Progress — Sindh Board | NewWorldEdu</title></Head>
      <div style={S.page}>
        <div style={S.container}>

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 4 }}>MY PROGRESS</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 4px' }}>
              {studentName ? `${studentName} ka Dashboard` : 'Aap ka Dashboard'}
            </h1>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>Sindh Board · Class {selectedClass}</div>
          </div>

          {/* Class Toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[9, 10].map(c => (
              <button key={c} onClick={() => setSelectedClass(c)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700,
                  background: selectedClass === c ? 'rgba(79,142,247,.15)' : 'rgba(255,255,255,.03)',
                  border: selectedClass === c ? '2px solid #4F8EF7' : '1px solid rgba(255,255,255,.06)',
                  color: selectedClass === c ? '#4F8EF7' : 'rgba(255,255,255,.5)',
                }}>
                Class {c}
              </button>
            ))}
          </div>

          {/* Overall Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
            <div style={S.card}>
              <div style={{ fontSize: 28, fontWeight: 900, color: overallPct >= 100 ? '#4ADE80' : '#4F8EF7' }}>{overallPct}%</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Complete</div>
              <div style={{ height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 2, marginTop: 4 }}>
                <div style={{ height: '100%', width: `${overallPct}%`, background: overallPct >= 100 ? '#4ADE80' : '#4F8EF7', borderRadius: 2 }} />
              </div>
            </div>
            <div style={S.card}>
              <div style={{ fontSize: 28, fontWeight: 900, color: overallAccuracy >= 70 ? '#4ADE80' : overallAccuracy >= 50 ? '#F97316' : '#EF4444' }}>
                {overallMcqs > 0 ? `${overallAccuracy}%` : '—'}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>MCQ Accuracy</div>
            </div>
            <div style={S.card}>
              <div style={{ fontSize: 28, fontWeight: 900, color: GOLD }}>{overallDone}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Chapters done</div>
            </div>
          </div>

          {/* Next Recommended */}
          {nextChapter && (
            <button onClick={() => router.push(`/sindh-board?subject=${encodeURIComponent(nextChapter.subject)}&class=${selectedClass}`)}
              style={{ width: '100%', padding: '16px 18px', marginBottom: 20, borderRadius: 14, background: '#4F8EF7', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#fff' }}>
              <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.7, marginBottom: 4 }}>AGLE CHAPTER</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{nextChapter.chapter.name}</div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>{nextChapter.subject} · Class {selectedClass}</div>
            </button>
          )}

          {overallDone === 0 && (
            <div style={{ ...S.card, textAlign: 'center', padding: '32px 16px', background: 'rgba(201,168,76,.04)', borderColor: 'rgba(201,168,76,.15)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📚</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: GOLD, marginBottom: 8 }}>Abhi tak koi chapter complete nahi hua</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 16 }}>Pehla chapter khatam karein — progress yahan dikhega</div>
              <button onClick={() => router.push('/sindh-board')}
                style={{ background: GOLD, color: '#0a0a0a', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                Study shuru karein →
              </button>
            </div>
          )}

          {/* Subject Breakdown */}
          {overallDone > 0 && (
            <>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: 1, marginBottom: 10 }}>SUBJECTS</div>
              {allStats.filter(s => s.total > 0).map(s => {
                const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
                return (
                  <button key={s.name} onClick={() => router.push(`/sindh-board?subject=${encodeURIComponent(s.name)}&class=${selectedClass}`)}
                    style={{ ...S.card, width: '100%', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                      borderColor: pct >= 100 ? 'rgba(74,222,128,.2)' : 'rgba(255,255,255,.1)',
                      background: pct >= 100 ? 'rgba(74,222,128,.04)' : 'rgba(255,255,255,.05)',
                    }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#FAF6EB' }}>{s.name}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: pct >= 100 ? '#4ADE80' : s.done > 0 ? '#4F8EF7' : 'rgba(255,255,255,.3)' }}>
                          {pct >= 100 ? '✓ Complete' : s.done > 0 ? `${s.done}/${s.total}` : 'Not started'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{s.group}</div>
                        {s.totalMcqs > 0 && <div style={{ fontSize: 11, color: s.accuracy >= 70 ? '#4ADE80' : '#F97316' }}>MCQ: {s.accuracy}%</div>}
                      </div>
                      {s.done > 0 && (
                        <div style={{ height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 2, marginTop: 6 }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: pct >= 100 ? '#4ADE80' : '#4F8EF7', borderRadius: 2 }} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </>
          )}

          {/* Recent Activity */}
          {Object.keys(chapterScores).length > 0 && (
            <>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: 1, marginTop: 20, marginBottom: 10 }}>RECENT CHAPTERS</div>
              {Object.entries(chapterScores)
                .filter(([k]) => k.includes(`_${selectedClass}_`))
                .sort(([, a], [, b]) => new Date(b.date || 0) - new Date(a.date || 0))
                .slice(0, 10)
                .map(([key, score]) => {
                  const parts = key.split('_');
                  const subject = parts[0];
                  return (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.04)', fontSize: 13 }}>
                      <span style={{ color: score.correct === score.total ? '#4ADE80' : '#F97316' }}>
                        {score.correct === score.total ? '✓' : '○'}
                      </span>
                      <div style={{ flex: 1, color: 'rgba(255,255,255,.7)' }}>{subject} — Ch {parts[parts.length - 1]}</div>
                      <div style={{ fontWeight: 700, color: score.correct === score.total ? '#4ADE80' : '#F97316' }}>
                        {score.correct}/{score.total}
                      </div>
                    </div>
                  );
                })}
            </>
          )}

          {/* Cambridge pathway */}
          <a href="/study" style={{ display: 'block', background: 'rgba(201,168,76,.04)', border: '1px solid rgba(201,168,76,.15)', borderRadius: 14, padding: '16px', marginTop: 24, textDecoration: 'none', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, marginBottom: 4 }}>READY FOR MORE?</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#FAF6EB' }}>Cambridge O Level & A Level bhi available hai</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>26 subjects · 334 revision notes · 50,000+ questions</div>
          </a>

        </div>
      </div>
      <LegalFooter />
      <GarageNav />
    </>
  );
}
