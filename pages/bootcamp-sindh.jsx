/**
 * pages/bootcamp-sindh.jsx — Sindh Board Bootcamp
 * ─────────────────────────────────────────────────────────────────
 * Goal-driven study for Sindh Board (BSEK/AKU-EB) Class 9-10 students.
 * Same concept as Cambridge bootcamp but uses Sindh Board syllabus.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SINDH_SYLLABUS, getSindhSubjectsWithMeta, getSindhChapters } from '../utils/sindhBoardSyllabus';
import LegalFooter from '../components/LegalFooter';
import GarageNav from '../components/GarageNav';

const GOLD = '#C9A84C';
const SUBJECTS = Object.keys(SINDH_SYLLABUS);

const GOALS = [
  { id: 'agrade', label: 'Get A-1 Grade', emoji: '🌟', desc: 'Score 80%+ in every subject. Master every chapter.', color: '#C9A84C' },
  { id: 'pass', label: 'Pass my exams', emoji: '✅', desc: 'Focus on high-weight chapters. Secure 50%+.', color: '#4F8EF7' },
  { id: 'improve', label: 'Improve my marks', emoji: '📈', desc: 'Go from where I am to better marks in every subject.', color: '#4ADE80' },
  { id: 'weak', label: 'Fix weak subjects', emoji: '🔧', desc: 'Target subjects I keep failing in.', color: '#F97316' },
];

export default function SindhBootcamp() {
  const router = useRouter();
  const [step, setStep] = useState('welcome');
  const [studentName, setStudentName] = useState('');
  const [selectedClass, setSelectedClass] = useState(9);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [plan, setPlan] = useState(null);
  const [todaysTasks, setTodaysTasks] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('nw_bootcamp_sindh') || 'null');
      if (saved?.active) { setPlan(saved); setStep('active'); generateTodaysTasks(saved); }
    } catch {}
  }, []);

  const toggleSubject = (s) => setSelectedSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const createPlan = () => {
    const allChapters = [];
    selectedSubjects.forEach(subj => {
      const chapters = getSindhChapters(subj, selectedClass) || [];
      chapters.forEach(ch => {
        allChapters.push({ subject: subj, chapterId: ch.id, chapterName: ch.name, class: selectedClass, completed: false, day: 0 });
      });
    });

    const daysLeft = 30; // Default 30 day bootcamp
    const chaptersPerDay = Math.max(1, Math.ceil(allChapters.length / daysLeft));
    allChapters.forEach((ch, i) => { ch.day = Math.floor(i / chaptersPerDay) + 1; });

    const bootcampPlan = {
      active: true, studentName, class: selectedClass, subjects: selectedSubjects,
      goal: selectedGoal, board: 'sindh', daysLeft, totalChapters: allChapters.length,
      chaptersPerDay, chapters: allChapters, startDate: new Date().toISOString(),
      currentDay: 1, completedChapters: 0,
    };

    localStorage.setItem('nw_bootcamp_sindh', JSON.stringify(bootcampPlan));
    // Also mark student as Sindh Board
    try {
      const profile = JSON.parse(localStorage.getItem('nw_user') || '{}');
      profile.board = 'sindh'; profile.curriculum = 'sindh';
      localStorage.setItem('nw_user', JSON.stringify(profile));
    } catch {}
    setPlan(bootcampPlan); setStep('active'); generateTodaysTasks(bootcampPlan);
  };

  const generateTodaysTasks = (p) => {
    const daysSinceStart = Math.max(1, Math.ceil((new Date() - new Date(p.startDate)) / (1000 * 60 * 60 * 24)));
    const today = p.chapters.filter(ch => ch.day === daysSinceStart && !ch.completed);
    const tasks = today.length > 0 ? today : p.chapters.filter(ch => !ch.completed).slice(0, p.chaptersPerDay);
    setTodaysTasks(tasks);
  };

  const progressPct = plan ? Math.round((plan.completedChapters / plan.totalChapters) * 100) : 0;

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px 80px', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 600, margin: '0 auto' },
    card: { background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 14, padding: '20px 18px', marginBottom: 12 },
    btn: (active) => ({ width: '100%', padding: 16, borderRadius: 12, border: 'none', background: active ? '#4F8EF7' : 'rgba(255,255,255,.06)', color: '#fff', fontSize: 16, fontWeight: 800, cursor: active ? 'pointer' : 'default', opacity: active ? 1 : 0.4, marginTop: 16 }),
  };

  return (
    <>
      <Head><title>Sindh Board Bootcamp — Matric Study Plan | NewWorldEdu</title></Head>
      <div style={S.page}>
        <div style={S.container}>

          {step === 'welcome' && (
            <div style={{ textAlign: 'center', paddingTop: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
              <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Matric <span style={{ color: GOLD }}>Bootcamp</span></h1>
              <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 15, lineHeight: 1.7, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
                Apna goal bataiye. Main aap ka personal study plan banata hoon — har roz, har chapter, exam tak.
              </p>
              <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 13, marginBottom: 24 }}>
                Tell me your goal. I'll create your daily plan until exam day.
              </p>
              <input type="text" placeholder="Aap ka naam? (Your name)" value={studentName}
                onChange={e => setStudentName(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', color: '#fff', fontSize: 16, textAlign: 'center', outline: 'none', marginBottom: 12, boxSizing: 'border-box' }} />
              <button onClick={() => setStep('class')} style={S.btn(studentName.length > 0)}>Chalein, shuru karein →</button>
            </div>
          )}

          {step === 'class' && (
            <>
              <button onClick={() => setStep('welcome')} style={{ background: 'none', border: 'none', color: '#4F8EF7', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>← Back</button>
              <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>{studentName}, aap kaun si class mein hain?</h2>
              <div style={{ display: 'flex', gap: 12 }}>
                {[9, 10].map(c => (
                  <button key={c} onClick={() => { setSelectedClass(c); setStep('subjects'); }}
                    style={{ flex: 1, padding: '24px 16px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                      background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', color: '#fff' }}>
                    <div style={{ fontSize: 32, fontWeight: 900 }}>{c}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>Class {c} (SSC-{c === 9 ? 'I' : 'II'})</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 'subjects' && (
            <>
              <button onClick={() => setStep('class')} style={{ background: 'none', border: 'none', color: '#4F8EF7', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>← Back</button>
              <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Aap ke subjects, {studentName}?</h2>
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, marginBottom: 16 }}>Ek ya sab — jo chahein select karein.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {SUBJECTS.map(s => {
                  const selected = selectedSubjects.includes(s);
                  const chapters = getSindhChapters(s, selectedClass) || [];
                  return (
                    <button key={s} onClick={() => toggleSubject(s)}
                      style={{ padding: '14px 12px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                        background: selected ? 'rgba(79,142,247,.1)' : 'rgba(255,255,255,.03)',
                        border: selected ? '2px solid #4F8EF7' : '1px solid rgba(255,255,255,.06)', color: '#fff' }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{s}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>{chapters.length} chapters</div>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setStep('goal')} style={S.btn(selectedSubjects.length > 0)}>Agle step →</button>
            </>
          )}

          {step === 'goal' && (
            <>
              <button onClick={() => setStep('subjects')} style={{ background: 'none', border: 'none', color: '#4F8EF7', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>← Back</button>
              <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>Aap ka goal kya hai?</h2>
              {GOALS.map(g => (
                <button key={g.id} onClick={() => { setSelectedGoal(g); }}
                  style={{ ...S.card, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
                    borderColor: selectedGoal?.id === g.id ? g.color : 'rgba(255,255,255,.06)',
                    background: selectedGoal?.id === g.id ? `${g.color}10` : 'rgba(255,255,255,.03)' }}>
                  <span style={{ fontSize: 28 }}>{g.emoji}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: selectedGoal?.id === g.id ? g.color : '#fff' }}>{g.label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>{g.desc}</div>
                  </div>
                </button>
              ))}
              <button onClick={createPlan} style={{ ...S.btn(!!selectedGoal), background: selectedGoal ? GOLD : 'rgba(255,255,255,.06)', color: selectedGoal ? '#0a0a0a' : '#fff' }}>
                🎯 Mera Bootcamp Shuru Karein
              </button>
            </>
          )}

          {step === 'active' && plan && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1 }}>MATRIC BOOTCAMP</div>
                  <h2 style={{ fontSize: 20, fontWeight: 900, margin: '4px 0 0' }}>{plan.studentName} ka Plan</h2>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>Class {plan.class} · {plan.goal?.emoji} {plan.goal?.label}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: progressPct >= 70 ? '#4ADE80' : '#4F8EF7' }}>{progressPct}%</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>complete</div>
                </div>
              </div>

              <div style={{ height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 3, marginBottom: 20, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressPct}%`, background: `linear-gradient(90deg, #4F8EF7, ${GOLD})`, borderRadius: 3 }} />
              </div>

              <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 10 }}>AAJ KE CHAPTERS</div>

              {todaysTasks.length === 0 && (
                <div style={{ ...S.card, textAlign: 'center', background: 'rgba(74,222,128,.04)', borderColor: 'rgba(74,222,128,.2)' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#4ADE80' }}>Aaj ka kaam hogaya! Bohat ache!</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>Kal aaiye — naye chapters milenge, InshaAllah.</div>
                </div>
              )}

              {todaysTasks.map((task, i) => (
                <div key={`${task.subject}-${task.chapterId}`} style={{
                  ...S.card, display: 'flex', alignItems: 'center', gap: 14,
                  borderColor: i === 0 ? 'rgba(79,142,247,.3)' : 'rgba(255,255,255,.06)',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 18, flexShrink: 0, background: i === 0 ? 'rgba(79,142,247,.15)' : 'rgba(255,255,255,.04)', border: `2px solid ${i === 0 ? '#4F8EF7' : 'rgba(255,255,255,.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: i === 0 ? '#4F8EF7' : 'rgba(255,255,255,.3)' }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{task.chapterName}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>{task.subject} · Ch {task.chapterId}</div>
                  </div>
                  <button onClick={() => router.push(`/sindh-board?subject=${encodeURIComponent(task.subject)}&class=${task.class}`)}
                    style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: i === 0 ? '#4F8EF7' : 'rgba(255,255,255,.06)', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                    {i === 0 ? 'Shuru →' : 'Open'}
                  </button>
                </div>
              ))}

              <button onClick={() => { localStorage.removeItem('nw_bootcamp_sindh'); setPlan(null); setStep('welcome'); setSelectedSubjects([]); setSelectedGoal(null); }}
                style={{ background: 'none', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '10px 20px', color: 'rgba(255,255,255,.3)', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginTop: 24, display: 'block', width: '100%' }}>
                Reset Bootcamp
              </button>
            </>
          )}

        </div>
      </div>
      <LegalFooter />
      <GarageNav />
    </>
  );
}
