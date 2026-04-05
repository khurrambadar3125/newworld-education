/**
 * pages/learn.jsx — Today's Plan (Main Learning Hub)
 * ─────────────────────────────────────────────────────────────────
 * The primary student experience. Shows personalized daily activities,
 * mastery progress, and study plan. Replaces "pick an activity" with
 * "here's what you should do today."
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProgressRing from '../components/ProgressRing';
import StreakFlame from '../components/StreakFlame';
import XPBar from '../components/XPBar';
import SkillTree from '../components/SkillTree';
import BottomNav from '../components/BottomNav';
import { useJourney } from '../utils/journeyTracker';
import LegalFooter from '../components/LegalFooter';
import { getSyllabusSubjects } from '../utils/syllabusStructure';
const SUBJECTS = getSyllabusSubjects();

const MASTERY_COLORS = ['#555','#EF4444','#F97316','#EAB308','#4ADE80','#4F8EF7'];
const MASTERY_NAMES = ['Not Started','Recall','Apply','Analyze','Exam Ready','Mastered'];

export default function Learn() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState(router.query.subject || '');
  const [selectedLevel, setSelectedLevel] = useState(router.query.level || 'O Level');
  const [plan, setPlan] = useState(null);
  const [overview, setOverview] = useState(null);
  const [mastery, setMastery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load overview on mount
  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/todays-plan')
      .then(r => { if (!r.ok) throw new Error('Failed to load'); return r.json(); })
      .then(data => { setOverview(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [status]);

  // Load subject-specific plan
  useEffect(() => {
    if (!selectedSubject || status !== 'authenticated') return;
    setLoading(true);
    Promise.all([
      fetch(`/api/todays-plan?subject=${encodeURIComponent(selectedSubject)}&level=${encodeURIComponent(selectedLevel)}`).then(r => r.json()),
      fetch(`/api/study-plan?action=mastery&subject=${encodeURIComponent(selectedSubject)}&level=${encodeURIComponent(selectedLevel)}`).then(r => r.json()),
    ]).then(([planData, masteryData]) => {
      setPlan(planData);
      setMastery(masteryData.mastery || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedSubject, selectedLevel, status]);

  if (status === 'loading') return null;
  if (status === 'unauthenticated') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Start Learning</h1>
          <p style={{ color: 'rgba(255,255,255,.5)', marginBottom: 24 }}>Sign in to get your personalized study plan</p>
          <button onClick={() => router.push('/login')} style={{ background: '#4F8EF7', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px' },
    container: { maxWidth: 700, margin: '0 auto' },
    header: { marginBottom: 28 },
    greeting: { fontSize: 24, fontWeight: 800, marginBottom: 4 },
    subtitle: { fontSize: 14, color: 'rgba(255,255,255,.5)' },
    card: { background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '16px 18px', marginBottom: 10, cursor: 'pointer', transition: 'all .15s' },
    sectionTitle: { fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.4)', letterSpacing: 1, marginBottom: 12, marginTop: 24 },
  };

  const firstName = session?.user?.name?.split(' ')[0] || 'there';

  return (
    <>
      <Head>
        <title>Learn — NewWorld Education</title>
        <meta name="description" content="Your personalized learning plan. Practice smarter, not harder." />
      </Head>

      <div style={S.page}>
        <div style={S.container}>

          {/* Header */}
          <div style={S.header}>
            <div style={S.greeting}>Hey {firstName} 👋</div>
            <div style={S.subtitle}>
              {overview?.reviewsDue > 0
                ? `You have ${overview.reviewsDue} reviews due today`
                : 'Ready to learn?'}
            </div>
          </div>

          {/* Continue where you left off */}
          {(() => {
            try {
              const j = JSON.parse(localStorage.getItem('nw_journey') || '{}');
              if (j.current?.page === 'nano-teach' && j.current?.subject) {
                return (
                  <a href={`/nano-teach?subject=${encodeURIComponent(j.current.subject)}&topic=${encodeURIComponent(j.current.topic || '')}&level=${encodeURIComponent(j.current.level || 'O Level')}`}
                    style={{ display: 'block', padding: '14px 18px', marginBottom: 16, borderRadius: 12, background: 'rgba(79,142,247,.08)', border: '1px solid rgba(79,142,247,.2)', textDecoration: 'none', color: '#fff' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#4F8EF7', marginBottom: 4 }}>CONTINUE WHERE YOU LEFT OFF</div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{j.current.topic || j.current.subject} — Step {j.current.step || 1}/4</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{j.current.subject} · {j.current.level || 'O Level'}</div>
                  </a>
                );
              }
            } catch {}
            return null;
          })()}

          {/* Subject selector */}
          <div style={S.sectionTitle}>YOUR SUBJECT</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {['O Level', 'A Level'].map(l => (
              <button key={l} onClick={() => { setSelectedLevel(l); setSelectedSubject(''); setPlan(null); }}
                style={{ padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: selectedLevel === l ? '#4F8EF7' : 'rgba(255,255,255,.06)', color: selectedLevel === l ? '#fff' : 'rgba(255,255,255,.5)', fontWeight: 700, fontSize: 12 }}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {SUBJECTS.map(s => (
              <button key={s} onClick={() => setSelectedSubject(s)}
                style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: selectedSubject === s ? 'rgba(79,142,247,.2)' : 'rgba(255,255,255,.04)', color: selectedSubject === s ? '#4F8EF7' : 'rgba(255,255,255,.5)', fontWeight: 600, fontSize: 12 }}>
                {s}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,.4)' }}>Loading your plan...</div>}
          {error && <div style={{ textAlign: 'center', padding: 24, color: '#F97316', background: 'rgba(249,115,22,.08)', borderRadius: 12, margin: '16px 0' }}>Something went wrong. <button onClick={() => window.location.reload()} style={{ color: '#4F8EF7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Try again</button></div>}

          {/* Today's Plan */}
          {plan && !loading && (
            <>
              <div style={S.sectionTitle}>TODAY'S PLAN</div>
              {plan.activities?.map((a, i) => (
                <div key={i} onClick={() => router.push(a.link || '/drill')}
                  style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 14 }}
                  onMouseOver={e => e.currentTarget.style.border = '1px solid rgba(79,142,247,.3)'}
                  onMouseOut={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,.08)'}>
                  <span style={{ fontSize: 28, minWidth: 36, textAlign: 'center' }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 2 }}>{a.description}</div>
                  </div>
                  <span style={{ fontSize: 18, color: 'rgba(255,255,255,.2)' }}>→</span>
                </div>
              ))}

              {/* Mastery Overview */}
              {mastery.length > 0 && (
                <>
                  <div style={S.sectionTitle}>TOPIC MASTERY</div>
                  <div style={{ background: 'rgba(255,255,255,.03)', borderRadius: 14, padding: 16, border: '1px solid rgba(255,255,255,.06)' }}>
                    {/* Summary bar */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 16, justifyContent: 'center' }}>
                      {[
                        { label: 'Topics', value: mastery.length },
                        { label: 'Mastered', value: mastery.filter(m => m.mastery_level >= 4).length, color: '#4ADE80' },
                        { label: 'In Progress', value: mastery.filter(m => m.mastery_level > 0 && m.mastery_level < 4).length, color: '#EAB308' },
                        { label: 'Not Started', value: mastery.filter(m => m.mastery_level === 0).length, color: '#555' },
                      ].map(({ label, value, color }) => (
                        <div key={label} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color: color || '#fff' }}>{value}</div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontWeight: 600 }}>{label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Topic list */}
                    {mastery.sort((a, b) => a.mastery_level - b.mastery_level).map(m => (
                      <div key={m.topic} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.04)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: 4, background: MASTERY_COLORS[m.mastery_level] }} />
                        <div style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,.7)' }}>{m.topic}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: MASTERY_COLORS[m.mastery_level] }}>
                          {MASTERY_NAMES[m.mastery_level]}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>
                          {m.questions_attempted > 0 ? `${Math.round(m.questions_correct / m.questions_attempted * 100)}%` : '—'}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* No mastery yet — start diagnostic */}
              {mastery.length === 0 && (
                <div style={{ ...S.card, textAlign: 'center', padding: 32 }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🎯</div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Start Your Diagnostic</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginBottom: 16 }}>
                    Take a quick 20-question test to find your strengths and weaknesses
                  </div>
                  <button onClick={() => router.push(`/drill?subject=${encodeURIComponent(selectedSubject)}&level=${encodeURIComponent(selectedLevel)}&mode=diagnostic`)}
                    style={{ background: '#4F8EF7', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Start Diagnostic
                  </button>
                </div>
              )}
            </>
          )}

          {/* No subject selected */}
          {!selectedSubject && !loading && (
            <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,.3)' }}>
              Select a subject above to see your learning plan
            </div>
          )}

        </div>
      </div>

      <LegalFooter />
      <BottomNav />
    </>
  );
}
