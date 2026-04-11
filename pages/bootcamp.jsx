/**
 * pages/bootcamp.jsx — Goal-Driven Intensive Study Bootcamp
 * ─────────────────────────────────────────────────────────────────
 * Student registers → sets goal → platform creates personalized plan →
 * auto-executes daily: exactly what to study, no choices, no confusion.
 *
 * "You want A* in Chemistry? Here's your plan. Day 1: States of Matter."
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { SYLLABUS, getTopicsForSubject, getThemesForSubject } from '../utils/syllabusStructure';
import LegalFooter from '../components/LegalFooter';
import BottomNav from '../components/BottomNav';

const GOLD = '#C9A84C';
const SUBJECTS = Object.keys(SYLLABUS);

const GOALS = [
  { id: 'astar', label: 'Get A*', emoji: '🌟', desc: 'Master every chapter. Leave nothing to chance.', color: '#C9A84C' },
  { id: 'improve', label: 'Improve my grade', emoji: '📈', desc: 'Go from where I am to one grade higher.', color: '#4ADE80' },
  { id: 'pass', label: 'Pass the exam', emoji: '✅', desc: 'Focus on high-weight topics. Secure the grade.', color: '#4F8EF7' },
  { id: 'weak', label: 'Fix my weak topics', emoji: '🔧', desc: 'Target what I keep getting wrong.', color: '#F97316' },
  { id: 'revision', label: 'Full revision', emoji: '📚', desc: 'Cover everything before exam day.', color: '#7C3AED' },
];

const EXAM_SESSIONS = [
  { id: 'mj26', label: 'May/June 2026', date: '2026-05-01' },
  { id: 'on26', label: 'Oct/Nov 2026', date: '2026-10-01' },
  { id: 'mj27', label: 'May/June 2027', date: '2027-05-01' },
  { id: 'custom', label: 'Custom date', date: null },
];

export default function Bootcamp() {
  const router = useRouter();
  const { data: session } = useSession();

  // Registration state
  const [step, setStep] = useState('welcome'); // welcome | subjects | goal | exam | plan | active
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [examSession, setExamSession] = useState(null);
  const [customDate, setCustomDate] = useState('');
  const [studentName, setStudentName] = useState('');
  const [currentGrade, setCurrentGrade] = useState('');

  // Active bootcamp state
  const [plan, setPlan] = useState(null);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load existing bootcamp from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('nw_bootcamp') || 'null');
      if (saved?.active) {
        setPlan(saved);
        setStep('active');
        generateTodaysTasks(saved);
      }
    } catch {}
  }, []);

  const toggleSubject = (s) => {
    setSelectedSubjects(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const getExamDate = () => {
    if (examSession?.date) return new Date(examSession.date);
    if (customDate) return new Date(customDate);
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // default 30 days
  };

  const getDaysLeft = () => {
    const d = getExamDate();
    return Math.max(1, Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24)));
  };

  // Generate the bootcamp plan
  const createPlan = () => {
    const daysLeft = getDaysLeft();
    const examDate = getExamDate().toISOString();

    // Build chapter list across all selected subjects
    const allChapters = [];
    selectedSubjects.forEach(subj => {
      const themes = getThemesForSubject(subj);
      themes.forEach(theme => {
        theme.sections.forEach(section => {
          allChapters.push({
            subject: subj,
            theme: theme.theme,
            chapterId: section.id,
            chapterName: section.name,
            completed: false,
            mastered: false,
            day: 0, // will be assigned
          });
        });
      });
    });

    // Distribute chapters across days
    const chaptersPerDay = Math.max(1, Math.ceil(allChapters.length / daysLeft));
    allChapters.forEach((ch, i) => {
      ch.day = Math.floor(i / chaptersPerDay) + 1;
    });

    const bootcampPlan = {
      active: true,
      studentName: studentName || session?.user?.name || 'Student',
      email: session?.user?.email || '',
      subjects: selectedSubjects,
      goal: selectedGoal,
      examDate,
      daysLeft,
      totalChapters: allChapters.length,
      chaptersPerDay,
      chapters: allChapters,
      startDate: new Date().toISOString(),
      currentDay: 1,
      completedChapters: 0,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('nw_bootcamp', JSON.stringify(bootcampPlan));
    setPlan(bootcampPlan);
    setStep('active');
    generateTodaysTasks(bootcampPlan);
  };

  // Get today's tasks from the plan
  const generateTodaysTasks = (p) => {
    const daysSinceStart = Math.max(1, Math.ceil((new Date() - new Date(p.startDate)) / (1000 * 60 * 60 * 24)));
    const updatedPlan = { ...p, currentDay: daysSinceStart };

    const today = p.chapters.filter(ch => ch.day === daysSinceStart && !ch.completed);
    // If today's done, show tomorrow's
    const tasks = today.length > 0 ? today : p.chapters.filter(ch => !ch.completed).slice(0, p.chaptersPerDay);
    setTodaysTasks(tasks);

    localStorage.setItem('nw_bootcamp', JSON.stringify(updatedPlan));
    setPlan(updatedPlan);
  };

  const markCompleted = (chapterId, subject) => {
    const updated = { ...plan };
    const ch = updated.chapters.find(c => c.chapterId === chapterId && c.subject === subject);
    if (ch) {
      ch.completed = true;
      updated.completedChapters = updated.chapters.filter(c => c.completed).length;
      localStorage.setItem('nw_bootcamp', JSON.stringify(updated));
      setPlan(updated);
      generateTodaysTasks(updated);
    }
  };

  const progressPct = plan ? Math.round((plan.completedChapters / plan.totalChapters) * 100) : 0;

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px 80px', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 600, margin: '0 auto' },
    card: { background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 14, padding: '20px 18px', marginBottom: 12 },
    btn: (active) => ({ width: '100%', padding: 16, borderRadius: 12, border: 'none', background: active ? '#4F8EF7' : 'rgba(255,255,255,.06)', color: '#fff', fontSize: 16, fontWeight: 800, cursor: active ? 'pointer' : 'default', opacity: active ? 1 : 0.4, marginTop: 16 }),
    goldBtn: { width: '100%', padding: 16, borderRadius: 12, border: 'none', background: GOLD, color: '#0a0a0a', fontSize: 16, fontWeight: 800, cursor: 'pointer', marginTop: 16 },
  };

  return (
    <>
      <Head>
        <title>Bootcamp — Intensive Study Plan | NewWorldEdu</title>
        <meta name="description" content="Starky Bootcamp — intensive exam prep for Cambridge O Level students. 89,000+ verified questions. Start free." />
      </Head>
      <div style={S.page}>
        <div style={S.container}>

          {/* ═══ STEP 1: WELCOME ═══ */}
          {step === 'welcome' && (
            <div style={{ textAlign: 'center', paddingTop: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
              <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>
                Starky <span style={{ color: GOLD }}>Bootcamp</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 15, lineHeight: 1.7, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
                Tell me your goal. I'll create a personalized study plan and guide you through it — one chapter at a time, every single day, until exam day.
              </p>
              <p style={{ color: GOLD, fontSize: 13, fontWeight: 700, marginBottom: 32 }}>
                No decisions. No confusion. Just follow the plan.
              </p>

              <input type="text" placeholder="What's your name?" value={studentName}
                onChange={e => setStudentName(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', color: '#fff', fontSize: 16, textAlign: 'center', outline: 'none', marginBottom: 12 }} />

              <button onClick={() => setStep('subjects')} style={S.btn(studentName.length > 0)}>
                Let's start →
              </button>
            </div>
          )}

          {/* ═══ STEP 2: SELECT SUBJECTS ═══ */}
          {step === 'subjects' && (
            <>
              <button onClick={() => setStep('welcome')} style={{ background: 'none', border: 'none', color: '#4F8EF7', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>← Back</button>
              <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Which subjects, {studentName}?</h2>
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, marginBottom: 20 }}>Pick the subjects you want to bootcamp. Pick 1 or pick all — we'll plan accordingly.</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {SUBJECTS.map(s => {
                  const selected = selectedSubjects.includes(s);
                  const topicCount = getTopicsForSubject(s).length;
                  return (
                    <button key={s} onClick={() => toggleSubject(s)}
                      style={{
                        padding: '14px 12px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                        background: selected ? 'rgba(79,142,247,.1)' : 'rgba(255,255,255,.03)',
                        border: selected ? '2px solid #4F8EF7' : '1px solid rgba(255,255,255,.06)',
                        color: '#fff',
                      }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{s}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>{topicCount} chapters</div>
                    </button>
                  );
                })}
              </div>

              <button onClick={() => setStep('goal')} style={S.btn(selectedSubjects.length > 0)}>
                Next: Set your goal →
              </button>
            </>
          )}

          {/* ═══ STEP 3: SET GOAL ═══ */}
          {step === 'goal' && (
            <>
              <button onClick={() => setStep('subjects')} style={{ background: 'none', border: 'none', color: '#4F8EF7', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>← Back</button>
              <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>What's your goal?</h2>
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, marginBottom: 20 }}>Be honest. The plan adjusts based on what you want to achieve.</p>

              {GOALS.map(g => (
                <button key={g.id} onClick={() => setSelectedGoal(g)}
                  style={{
                    ...S.card, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
                    borderColor: selectedGoal?.id === g.id ? g.color : 'rgba(255,255,255,.06)',
                    background: selectedGoal?.id === g.id ? `${g.color}10` : 'rgba(255,255,255,.03)',
                  }}>
                  <span style={{ fontSize: 28 }}>{g.emoji}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: selectedGoal?.id === g.id ? g.color : '#fff' }}>{g.label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>{g.desc}</div>
                  </div>
                </button>
              ))}

              {selectedGoal?.id === 'improve' && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 6 }}>What's your current grade?</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['U', 'E', 'D', 'C', 'B', 'A'].map(g => (
                      <button key={g} onClick={() => setCurrentGrade(g)}
                        style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: currentGrade === g ? '2px solid #4ADE80' : '1px solid rgba(255,255,255,.1)', background: currentGrade === g ? 'rgba(74,222,128,.1)' : 'rgba(255,255,255,.03)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => setStep('exam')} style={S.btn(!!selectedGoal)}>
                Next: When's your exam? →
              </button>
            </>
          )}

          {/* ═══ STEP 4: EXAM DATE ═══ */}
          {step === 'exam' && (
            <>
              <button onClick={() => setStep('goal')} style={{ background: 'none', border: 'none', color: '#4F8EF7', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>← Back</button>
              <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>When's your exam?</h2>
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, marginBottom: 20 }}>This determines how intense your bootcamp will be.</p>

              {EXAM_SESSIONS.map(es => (
                <button key={es.id} onClick={() => { setExamSession(es); if (es.id !== 'custom') setCustomDate(''); }}
                  style={{
                    ...S.card, cursor: 'pointer', textAlign: 'center',
                    borderColor: examSession?.id === es.id ? '#4F8EF7' : 'rgba(255,255,255,.06)',
                    background: examSession?.id === es.id ? 'rgba(79,142,247,.1)' : 'rgba(255,255,255,.03)',
                  }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{es.label}</div>
                  {es.date && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>{Math.ceil((new Date(es.date) - new Date()) / (1000 * 60 * 60 * 24))} days away</div>}
                </button>
              ))}

              {examSession?.id === 'custom' && (
                <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', color: '#fff', fontSize: 14, marginTop: 12 }} />
              )}

              {examSession && (
                <div style={{ ...S.card, background: 'rgba(201,168,76,.04)', borderColor: 'rgba(201,168,76,.2)', marginTop: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, marginBottom: 4 }}>YOUR BOOTCAMP</div>
                  <div style={{ fontSize: 24, fontWeight: 900 }}>{selectedSubjects.length} subject{selectedSubjects.length > 1 ? 's' : ''}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,.5)' }}>
                    {selectedSubjects.reduce((sum, s) => sum + getTopicsForSubject(s).length, 0)} chapters in {getDaysLeft()} days
                  </div>
                  <div style={{ fontSize: 13, color: GOLD, marginTop: 4 }}>
                    ~{Math.ceil(selectedSubjects.reduce((sum, s) => sum + getTopicsForSubject(s).length, 0) / getDaysLeft())} chapters per day
                  </div>
                </div>
              )}

              <button onClick={createPlan} style={S.goldBtn}>
                🎯 Start My Bootcamp
              </button>
            </>
          )}

          {/* ═══ ACTIVE BOOTCAMP ═══ */}
          {step === 'active' && plan && (
            <>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1 }}>BOOTCAMP</div>
                  <h2 style={{ fontSize: 20, fontWeight: 900, margin: '4px 0 0' }}>{plan.studentName}'s Plan</h2>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>
                    {plan.goal?.emoji} {plan.goal?.label} · Day {plan.currentDay} of {plan.daysLeft}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: progressPct >= 70 ? '#4ADE80' : '#4F8EF7' }}>{progressPct}%</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>complete</div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 3, marginBottom: 20, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressPct}%`, background: `linear-gradient(90deg, #4F8EF7, ${GOLD})`, borderRadius: 3, transition: 'width 0.6s' }} />
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
                <div style={S.card}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#4ADE80' }}>{plan.completedChapters}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)' }}>Completed</div>
                </div>
                <div style={S.card}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#4F8EF7' }}>{plan.totalChapters - plan.completedChapters}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)' }}>Remaining</div>
                </div>
                <div style={S.card}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: GOLD }}>{Math.max(0, Math.ceil((new Date(plan.examDate) - new Date()) / (1000 * 60 * 60 * 24)))}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)' }}>Days left</div>
                </div>
              </div>

              {/* Today's Tasks */}
              <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 10 }}>TODAY'S CHAPTERS</div>

              {todaysTasks.length === 0 && (
                <div style={{ ...S.card, textAlign: 'center', background: 'rgba(74,222,128,.04)', borderColor: 'rgba(74,222,128,.2)' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#4ADE80' }}>Today's done!</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>Come back tomorrow for your next chapters.</div>
                </div>
              )}

              {todaysTasks.map((task, i) => (
                <div key={`${task.subject}-${task.chapterId}`} style={{
                  ...S.card, display: 'flex', alignItems: 'center', gap: 14,
                  borderColor: i === 0 ? 'rgba(79,142,247,.3)' : 'rgba(255,255,255,.06)',
                  background: i === 0 ? 'rgba(79,142,247,.04)' : 'rgba(255,255,255,.03)',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 18, flexShrink: 0,
                    background: i === 0 ? 'rgba(79,142,247,.15)' : 'rgba(255,255,255,.04)',
                    border: `2px solid ${i === 0 ? '#4F8EF7' : 'rgba(255,255,255,.1)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 800, color: i === 0 ? '#4F8EF7' : 'rgba(255,255,255,.3)',
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{task.chapterName}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>{task.subject} · Ch {task.chapterId}</div>
                  </div>
                  <button
                    onClick={() => router.push(`/nano-teach?subject=${encodeURIComponent(task.subject)}&topic=${encodeURIComponent(task.chapterName)}&level=O+Level`)}
                    style={{
                      padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: i === 0 ? '#4F8EF7' : 'rgba(255,255,255,.06)',
                      color: '#fff', fontSize: 12, fontWeight: 700,
                    }}>
                    {i === 0 ? 'Start →' : 'Open'}
                  </button>
                </div>
              ))}

              {/* Subject breakdown */}
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: 1, marginTop: 24, marginBottom: 10 }}>SUBJECTS</div>
              {plan.subjects.map(subj => {
                const total = plan.chapters.filter(c => c.subject === subj).length;
                const done = plan.chapters.filter(c => c.subject === subj && c.completed).length;
                const pct = Math.round((done / total) * 100);
                return (
                  <div key={subj} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{subj}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>{done}/{total} chapters</div>
                      <div style={{ height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 2, marginTop: 6 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: pct >= 100 ? '#4ADE80' : '#4F8EF7', borderRadius: 2 }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: pct >= 100 ? '#4ADE80' : 'rgba(255,255,255,.3)' }}>
                      {pct >= 100 ? '✓' : `${pct}%`}
                    </div>
                  </div>
                );
              })}

              {/* Reset */}
              <button onClick={() => { localStorage.removeItem('nw_bootcamp'); setPlan(null); setStep('welcome'); setSelectedSubjects([]); setSelectedGoal(null); setExamSession(null); }}
                style={{ background: 'none', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '10px 20px', color: 'rgba(255,255,255,.3)', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginTop: 24, display: 'block', width: '100%' }}>
                Reset Bootcamp
              </button>
            </>
          )}

        </div>
      </div>
      <LegalFooter />
      <BottomNav />
    </>
  );
}
