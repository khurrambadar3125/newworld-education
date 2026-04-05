/**
 * pages/study.jsx — THE Main Student Experience
 * ─────────────────────────────────────────────────────────────────
 * One page. One path. Select subject → see modules → start learning.
 * No choices. No confusion. The platform decides what you learn next.
 *
 * Replaces the need for: /drill, /nano, /learn (separate pages)
 * Everything is HERE: structured path → lessons → quizzes → mastery
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import LegalFooter from '../components/LegalFooter';
import BottomNav from '../components/BottomNav';
import { useJourney } from '../utils/journeyTracker';

const SUBJECTS = {
  'O Level': ['Mathematics','Chemistry','Physics','Biology','Economics','Accounting','Computer Science','Pakistan Studies','English Language','Business Studies','Commerce','History','Geography','Sociology','Islamiyat','Urdu','Additional Mathematics'],
  'A Level': ['Mathematics','Chemistry','Physics','Biology','Economics','Business','Computer Science','Psychology','Accounting','History','Geography','Sociology','English Language','Law','Further Mathematics','Literature in English'],
};

const MASTERY_COLORS = ['#555','#EF4444','#F97316','#EAB308','#4ADE80','#4F8EF7'];
const MASTERY_NAMES = ['Not Started','Recall','Apply','Analyze','Exam Ready','Mastered'];

export default function Study() {
  const router = useRouter();
  const { data: session } = useSession();
  const journey = useJourney();

  const [level, setLevel] = useState(router.query.level || 'O Level');
  const [subject, setSubject] = useState(router.query.subject || '');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedModule, setExpandedModule] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Load structured path when subject selected
  useEffect(() => {
    if (!subject) return;
    setLoading(true);
    journey.enter('study', { subject, level });
    const headers = {};
    try { const email = JSON.parse(localStorage.getItem('nw_user') || '{}').email; if (email) headers['x-student-email'] = email; } catch {}
    fetch(`/api/study-path?subject=${encodeURIComponent(subject)}&level=${encodeURIComponent(level)}`, { headers })
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(data => {
        setModules(data.modules || []);
        setTotalQuestions(data.totalQuestions || 0);
        setLoading(false);
        const first = (data.modules || []).find(m => m.progress < 100);
        if (first) setExpandedModule(first.module);
      })
      .catch(() => { setLoading(false); setModules([]); });
  }, [subject, level]);

  // Check for continue from journey
  const [continueData, setContinueData] = useState(null);
  useEffect(() => {
    try {
      const j = JSON.parse(localStorage.getItem('nw_journey') || '{}');
      if (j.current?.page === 'nano-teach' && j.current?.subject) {
        setContinueData(j.current);
      }
    } catch {}
  }, []);

  // Find next topic to study (first unmastered in first incomplete module)
  const getNextTopic = () => {
    for (const mod of modules) {
      for (const topic of mod.topics) {
        if (topic.masteryLevel < 4) {
          return { topic: topic.topic, module: mod.module };
        }
      }
    }
    return null;
  };

  const startLearning = (topicName) => {
    router.push(`/nano-teach?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topicName)}&level=${encodeURIComponent(level)}`);
  };

  const overallProgress = modules.length > 0
    ? Math.round(modules.reduce((s, m) => s + m.progress, 0) / modules.length)
    : 0;

  return (
    <>
      <Head>
        <title>{subject ? `${subject} — Study Path` : 'Study'} | NewWorld Education</title>
        <meta name="description" content="Structured learning path. Select your subject, follow the modules, master every topic." />
      </Head>

      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px 80px', fontFamily: "'Sora',-apple-system,sans-serif" }}>
        <div style={{ maxWidth: 650, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 4px' }}>Study</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', margin: 0 }}>Select your subject. Follow the path. Master every topic.</p>
          </div>

          {/* Continue where you left off */}
          {continueData && !subject && (
            <a href={`/nano-teach?subject=${encodeURIComponent(continueData.subject)}&topic=${encodeURIComponent(continueData.topic || '')}&level=${encodeURIComponent(continueData.level || 'O Level')}`}
              style={{ display: 'block', padding: '16px 18px', marginBottom: 20, borderRadius: 14, background: 'rgba(79,142,247,.08)', border: '1px solid rgba(79,142,247,.2)', textDecoration: 'none', color: '#fff' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#4F8EF7', marginBottom: 4 }}>CONTINUE WHERE YOU LEFT OFF</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{continueData.topic || continueData.subject}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{continueData.subject} · Step {continueData.step || 1}/4</div>
            </a>
          )}

          {/* Level selector */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {['O Level', 'A Level'].map(l => (
              <button key={l} onClick={() => { setLevel(l); setSubject(''); setModules([]); }}
                style={{ padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', background: level === l ? '#4F8EF7' : 'rgba(255,255,255,.06)', color: level === l ? '#fff' : 'rgba(255,255,255,.5)', fontWeight: 700, fontSize: 13 }}>
                {l}
              </button>
            ))}
          </div>

          {/* Subject selector */}
          {!subject && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 16 }}>
              {(SUBJECTS[level] || []).map(s => (
                <button key={s} onClick={() => setSubject(s)}
                  style={{
                    background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
                    borderRadius: 12, padding: '18px 14px', cursor: 'pointer',
                    textAlign: 'left', color: '#fff',
                  }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{s}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginTop: 4 }}>Tap to start →</div>
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,.4)' }}>Loading your study path...</div>}

          {/* Study Path — Modules */}
          {subject && modules.length > 0 && !loading && (
            <>
              {/* Subject header + progress */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 8 }}>
                <div>
                  <button onClick={() => { setSubject(''); setModules([]); }} style={{ background: 'none', border: 'none', color: '#4F8EF7', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 0, marginBottom: 4, display: 'block' }}>← Change Subject</button>
                  <div style={{ fontSize: 20, fontWeight: 900 }}>{subject}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>{modules.length} modules · {totalQuestions} questions</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: overallProgress >= 60 ? '#4ADE80' : '#4F8EF7' }}>{overallProgress}%</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>complete</div>
                </div>
              </div>

              {/* Quick Start — next topic */}
              {(() => {
                const next = getNextTopic();
                if (!next) return null;
                return (
                  <button onClick={() => startLearning(next.topic)}
                    style={{ width: '100%', padding: '16px 18px', marginBottom: 20, borderRadius: 14, background: '#4F8EF7', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#fff' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.7, marginBottom: 4 }}>START NEXT LESSON</div>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>{next.topic}</div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>{next.module} → Learn → Practice → Master</div>
                  </button>
                );
              })()}

              {/* Module list */}
              {modules.map((mod, mi) => (
                <div key={mod.module} style={{ marginBottom: 8 }}>
                  {/* Module header */}
                  <button onClick={() => setExpandedModule(expandedModule === mod.module ? null : mod.module)}
                    style={{
                      width: '100%', padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                      background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)',
                      textAlign: 'left', color: '#fff', display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 18, flexShrink: 0,
                      background: mod.progress >= 100 ? 'rgba(79,142,247,.15)' : mod.progress > 0 ? 'rgba(74,222,128,.1)' : 'rgba(255,255,255,.04)',
                      border: `2px solid ${mod.progress >= 100 ? '#4F8EF7' : mod.progress > 0 ? '#4ADE80' : 'rgba(255,255,255,.1)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 800, color: mod.progress >= 100 ? '#4F8EF7' : 'rgba(255,255,255,.4)',
                    }}>
                      {mod.progress >= 100 ? '✓' : mi + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{mod.module}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>
                        {mod.topics.length} topics · {mod.totalQuestions} questions · {mod.masteredCount}/{mod.topics.length} mastered
                      </div>
                      {/* Mini progress bar */}
                      <div style={{ height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 2, marginTop: 6, maxWidth: 200 }}>
                        <div style={{ height: '100%', width: `${mod.progress}%`, background: mod.progress >= 100 ? '#4F8EF7' : '#4ADE80', borderRadius: 2 }} />
                      </div>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,.2)', fontSize: 16 }}>{expandedModule === mod.module ? '▾' : '▸'}</span>
                  </button>

                  {/* Expanded topics */}
                  {expandedModule === mod.module && (
                    <div style={{ padding: '8px 0 8px 48px' }}>
                      {mod.topics.map((topic, ti) => (
                        <div key={topic.topic}
                          onClick={() => startLearning(topic.topic)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginBottom: 4,
                            borderRadius: 10, cursor: 'pointer', transition: 'background .15s',
                          }}
                          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,.04)'}
                          onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                          {/* Mastery dot */}
                          <div style={{
                            width: 10, height: 10, borderRadius: 5, flexShrink: 0,
                            background: MASTERY_COLORS[topic.masteryLevel],
                          }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: topic.masteryLevel >= 4 ? 'rgba(255,255,255,.5)' : '#fff' }}>
                              {topic.topic}
                            </div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>
                              {topic.questionCount} questions · {MASTERY_NAMES[topic.masteryLevel]}
                              {topic.accuracy !== null ? ` · ${topic.accuracy}%` : ''}
                            </div>
                          </div>
                          <span style={{ fontSize: 12, color: topic.masteryLevel >= 4 ? '#4F8EF7' : '#4ADE80', fontWeight: 700 }}>
                            {topic.masteryLevel >= 4 ? '✓' : 'Learn →'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* No modules */}
          {subject && modules.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No study path available yet</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 20 }}>We're building content for {subject}. Try another subject or use Practice Drill.</div>
              <button onClick={() => router.push('/drill?subject=' + encodeURIComponent(subject))} style={{ background: '#4F8EF7', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}>Practice Drill →</button>
            </div>
          )}

        </div>
      </div>

      <LegalFooter />
      <BottomNav />
    </>
  );
}
