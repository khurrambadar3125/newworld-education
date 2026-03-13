/**
 * pages/drill.jsx
 * ─────────────────────────────────────────────────────────────────
 * Cambridge Past Paper Drill — with SM-2 spaced repetition.
 *
 * Flow:
 *   Setup → Drilling (Question → Answer → Feedback → Next) → Session Summary
 */

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSpacedRep } from '../utils/useSpacedRep';
import useStreaks, { StreakWidget } from '../utils/useStreaks';

// ─── Topic lists per subject ──────────────────────────────────────────────────

const TOPICS = {
  'Biology': [
    'Cell Structure & Organisation', 'Diffusion, Osmosis & Active Transport',
    'Biological Molecules', 'Enzymes', 'Plant Nutrition (Photosynthesis)',
    'Animal Nutrition & Digestion', 'Gas Exchange', 'Transport in Plants',
    'Transport in Humans (Circulatory System)', 'Respiration',
    'Excretion & Homeostasis', 'Coordination & Response (Nervous System)',
    'Hormones & Endocrine System', 'Reproduction', 'Inheritance & Genetics',
    'Variation & Natural Selection', 'Ecology & Environment',
    'Human Influences on the Environment',
  ],
  'Chemistry': [
    'Atomic Structure & The Periodic Table', 'Chemical Bonding',
    'Stoichiometry & Moles', 'Acids, Bases & Salts',
    'The Mole & Calculations', 'Electrolysis',
    'Energy Changes in Chemical Reactions', 'Rates of Reaction',
    'Equilibrium (Le Chatelier\'s Principle)', 'Redox Reactions',
    'Group Properties (Group 1, 2, 7, 0)', 'Transition Metals',
    'Organic Chemistry — Alkanes & Alkenes', 'Organic Chemistry — Alcohols & Acids',
    'Polymers', 'Nitrogen & Sulfur Chemistry',
    'Extraction of Metals', 'Water Chemistry',
  ],
  'Physics': [
    'Measurements & Units', 'Motion (Kinematics)',
    'Forces & Newton\'s Laws', 'Momentum & Impulse',
    'Work, Energy & Power', 'Pressure',
    'Thermal Physics (Heat Transfer)', 'Thermal Properties of Matter',
    'Waves — Properties & Behaviour', 'Light & Optics',
    'Sound', 'Electrostatics',
    'Current Electricity & Circuits', 'Magnetic Effects of Current',
    'Electromagnetic Induction', 'Atomic Structure & Radioactivity',
    'Nuclear Physics', 'Space Physics',
  ],
  'Mathematics': [
    'Number (Fractions, Decimals, Percentages)', 'Algebra — Expressions & Equations',
    'Sequences & Series', 'Functions',
    'Coordinate Geometry (Straight Lines)', 'Quadratic Equations & Graphs',
    'Simultaneous Equations', 'Indices & Surds',
    'Trigonometry (SOH CAH TOA)', 'Trigonometry (Sine & Cosine Rules)',
    'Circle Theorems', 'Mensuration (Area & Volume)',
    'Vectors', 'Matrices',
    'Probability', 'Statistics (Mean, Median, Mode)',
    'Differentiation', 'Integration',
  ],
  'Economics': [
    'Basic Economic Problem', 'Supply & Demand',
    'Price Elasticity', 'Market Structures',
    'Production & Costs', 'National Income & GDP',
    'Economic Growth', 'Unemployment',
    'Inflation', 'Monetary Policy',
    'Fiscal Policy', 'International Trade',
    'Balance of Payments', 'Exchange Rates',
    'Development Economics', 'Market Failure & Externalities',
  ],
  'English Language': [
    'Reading Comprehension', 'Inference & Deduction',
    'Summary Writing', 'Directed Writing',
    'Descriptive Writing', 'Narrative Writing',
    'Argumentative & Persuasive Writing', 'Report & Letter Writing',
    'Language Analysis (Writer\'s Techniques)', 'Vocabulary in Context',
  ],
  'Computer Science': [
    'Data Representation (Binary, Hex)', 'Number Conversions',
    'Logic Gates & Boolean Algebra', 'Algorithms & Pseudocode',
    'Flowcharts', 'Programming Concepts',
    'Data Structures (Arrays, Lists)', 'Searching & Sorting Algorithms',
    'Databases', 'Computer Networks',
    'Internet & Web Technologies', 'Security & Encryption',
    'Operating Systems', 'Hardware Components',
    'Software Development Lifecycle',
  ],
  'Pakistan Studies': [
    'Land & People of Pakistan', 'Physical Geography of Pakistan',
    'Climate of Pakistan', 'Agriculture in Pakistan',
    'Industry & Trade', 'Population & Urbanisation',
    'Movement for Pakistan', 'Creation of Pakistan (1947)',
    'Constitutional Development', 'Political History (1947–present)',
    'Economic Development', 'Social Issues & Development',
  ],
};

// Default topics for subjects not in the list
const DEFAULT_TOPICS = [
  'Key Concepts & Definitions', 'Core Theory', 'Data Analysis',
  'Extended Response', 'Case Studies', 'Application Questions',
  'Exam Technique', 'Common Mistakes',
];

function getTopics(subject) {
  return TOPICS[subject] || DEFAULT_TOPICS;
}

const SUBJECTS_OLEVEL = [
  'Biology', 'Chemistry', 'Physics', 'Mathematics', 'English Language',
  'Economics', 'Computer Science', 'Pakistan Studies', 'Accounting',
  'Business Studies', 'Geography', 'History', 'Sociology',
  'Additional Mathematics', 'Statistics',
];

const SUBJECTS_ALEVEL = [
  'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Further Mathematics',
  'Economics', 'Computer Science', 'English Language', 'Psychology',
  'Business Studies', 'Accounting', 'Sociology', 'Geography', 'History', 'Law',
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  page: {
    minHeight: '100vh',
    background: '#080C18',
    color: '#fff',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
    padding: '0 0 60px',
  },
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px',
    borderBottom: '1px solid rgba(255,255,255,.07)',
    background: 'rgba(8,12,24,.9)',
    position: 'sticky', top: 0, zIndex: 50,
    backdropFilter: 'blur(12px)',
  },
  navLogo: {
    fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 17,
    color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
  },
  navRight: { display: 'flex', alignItems: 'center', gap: 10 },
  navLink: {
    fontSize: 13, color: 'rgba(255,255,255,.5)', textDecoration: 'none',
    padding: '6px 12px', borderRadius: 8,
    background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)',
  },
  container: { maxWidth: 680, margin: '0 auto', padding: '32px 20px' },
  h1: {
    fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 800,
    margin: '0 0 6px', lineHeight: 1.2,
  },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,.45)', margin: '0 0 32px', lineHeight: 1.6 },
  card: {
    background: 'rgba(255,255,255,.04)',
    border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 16, padding: 20, marginBottom: 16,
  },
  label: {
    fontSize: 11, fontWeight: 700, letterSpacing: '.07em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,.4)',
    marginBottom: 10, display: 'block',
  },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 },
  optionBtn: (selected) => ({
    background: selected ? 'rgba(79,142,247,.15)' : 'rgba(255,255,255,.04)',
    border: `1px solid ${selected ? 'rgba(79,142,247,.5)' : 'rgba(255,255,255,.08)'}`,
    borderRadius: 10, padding: '10px 14px', cursor: 'pointer',
    color: selected ? '#4F8EF7' : 'rgba(255,255,255,.65)',
    fontSize: 13, fontWeight: selected ? 700 : 500,
    textAlign: 'left', transition: 'all .15s',
    WebkitTapHighlightColor: 'transparent',
  }),
  primaryBtn: {
    background: 'linear-gradient(135deg, #4F8EF7, #6366F1)',
    border: 'none', borderRadius: 12, padding: '14px 28px',
    color: '#fff', fontSize: 15, fontWeight: 700,
    fontFamily: "'Sora', sans-serif",
    cursor: 'pointer', width: '100%', marginTop: 8,
    WebkitTapHighlightColor: 'transparent',
  },
  ghostBtn: {
    background: 'rgba(255,255,255,.05)',
    border: '1px solid rgba(255,255,255,.1)',
    borderRadius: 12, padding: '13px 28px',
    color: 'rgba(255,255,255,.6)', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', width: '100%', marginTop: 8,
    WebkitTapHighlightColor: 'transparent',
  },
  badge: (color) => ({
    display: 'inline-block', fontSize: 10, fontWeight: 700,
    padding: '2px 8px', borderRadius: 100,
    background: `${color}22`, border: `1px solid ${color}55`,
    color, marginLeft: 6, verticalAlign: 'middle',
  }),
  questionText: {
    fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,.9)',
    background: 'rgba(79,142,247,.07)',
    border: '1px solid rgba(79,142,247,.2)',
    borderRadius: 12, padding: '18px 20px', marginBottom: 20,
  },
  textarea: {
    width: '100%', background: 'rgba(255,255,255,.06)',
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 10, color: '#fff', padding: '12px 14px',
    fontSize: 14, lineHeight: 1.6, fontFamily: 'inherit',
    outline: 'none', resize: 'vertical', minHeight: 100,
    boxSizing: 'border-box',
  },
  feedbackBox: (correct) => ({
    background: correct ? 'rgba(74,222,128,.07)' : 'rgba(248,113,113,.07)',
    border: `1px solid ${correct ? 'rgba(74,222,128,.25)' : 'rgba(248,113,113,.25)'}`,
    borderRadius: 14, padding: '18px 20px', marginBottom: 16,
  }),
  scoreRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 12,
  },
  tipBox: {
    background: 'rgba(251,191,36,.07)',
    border: '1px solid rgba(251,191,36,.2)',
    borderRadius: 10, padding: '12px 16px', marginTop: 14,
    fontSize: 13, color: 'rgba(255,255,255,.8)', lineHeight: 1.6,
  },
  modelBox: {
    background: 'rgba(255,255,255,.04)',
    border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 10, padding: '12px 16px', marginTop: 10,
    fontSize: 13, color: 'rgba(255,255,255,.65)', lineHeight: 1.7,
  },
  progressBar: (pct, color) => ({
    height: 6, borderRadius: 100, overflow: 'hidden',
    background: 'rgba(255,255,255,.08)', marginBottom: 20,
    position: 'relative',
  }),
};

const QUESTION_TYPES = [
  { id: 'mcq',        label: 'MCQ',         desc: 'Multiple choice' },
  { id: 'structured', label: 'Structured',  desc: 'Written answer' },
  { id: 'mixed',      label: 'Mixed',       desc: 'Both types' },
];

const DIFFICULTIES = [
  { id: 'easy',   label: 'Foundation', emoji: '🌱' },
  { id: 'medium', label: 'Exam level',  emoji: '🎯' },
  { id: 'hard',   label: 'Challenge',  emoji: '🔥' },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function DrillPage() {
  const [userProfile, setUserProfile] = useState(null);
  const sr = useSpacedRep(userProfile);
  const { logSession, streakDays, totalQuestions, badges } = useStreaks(userProfile);

  // Setup state
  const [level,        setLevel]        = useState('O Level');
  const [subject,      setSubject]      = useState('');
  const [topic,        setTopic]        = useState('');
  const [difficulty,   setDifficulty]   = useState('medium');
  const [questionType, setQuestionType] = useState('mixed');

  // Drill state
  const [phase,          setPhase]          = useState('setup'); // setup | drilling | summary
  const [question,       setQuestion]       = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [structuredAns,  setStructuredAns]  = useState('');
  const [feedback,       setFeedback]       = useState(null);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState('');

  // Session tracking
  const [sessionResults, setSessionResults] = useState([]);
  const [questionNum,    setQuestionNum]    = useState(0);
  const SESSION_LENGTH = 10;

  useEffect(() => {
    try {
      const s = localStorage.getItem('nw_user');
      if (s) setUserProfile(JSON.parse(s));
    } catch {}
  }, []);

  const subjects = level === 'O Level' ? SUBJECTS_OLEVEL : SUBJECTS_ALEVEL;
  const topics   = subject ? getTopics(subject) : [];
  const dueTopics = subject ? sr.getDueTopics(subject) : [];

  // ── Generate question ───────────────────────────────────────────────────────
  const generateQuestion = useCallback(async (targetTopic) => {
    setLoading(true);
    setError('');
    setFeedback(null);
    setSelectedOption('');
    setStructuredAns('');

    const t = targetTopic || topic;
    let type = questionType;
    if (type === 'mixed') type = questionNum % 2 === 0 ? 'mcq' : 'structured';

    try {
      const res = await fetch('/api/drill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', level, subject, topic: t, difficulty, questionType: type }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setQuestion(data);
    } catch {
      setError('Failed to generate question. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [level, subject, topic, difficulty, questionType, questionNum]);

  // ── Start session ───────────────────────────────────────────────────────────
  const startSession = () => {
    if (!subject || !topic) return;
    setSessionResults([]);
    setQuestionNum(0);
    setPhase('drilling');
    generateQuestion(topic);
  };

  // ── Submit answer ───────────────────────────────────────────────────────────
  const submitAnswer = async () => {
    if (!question) return;
    const answer = question.type === 'mcq' ? selectedOption : structuredAns.trim();
    if (!answer) return;
    setLoading(true);

    try {
      const res = await fetch('/api/drill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'grade',
          level, subject,
          topic: question.topic || topic,
          question: question.question,
          studentAnswer: answer,
          questionType: question.type,
          options: question.options,
          marks: question.marks,
        }),
      });
      const data = await res.json();
      setFeedback(data);

      // Record in spaced rep
      const t = question.topic || topic;
      sr.recordAnswer(subject, t, data.quality ?? (data.correct ? 4 : 1));

      // Record in session
      setSessionResults(prev => [...prev, {
        topic: t, correct: data.correct,
        score: data.score, maxScore: data.maxScore,
        quality: data.quality,
      }]);
    } catch {
      setError('Grading failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Next question ───────────────────────────────────────────────────────────
  const nextQuestion = () => {
    const nextNum = questionNum + 1;
    if (nextNum >= SESSION_LENGTH) {
      // Log completed session to streaks before showing summary
      logSession(subject, SESSION_LENGTH, sessionPct);
      setPhase('summary');
      return;
    }
    setQuestionNum(nextNum);

    // If there are due topics, cycle through them; otherwise stick with selected topic
    const due = sr.getDueTopics(subject);
    const nextTopic = due.length ? due[questionNum % due.length] : topic;
    generateQuestion(nextTopic);
  };

  // ── Session stats ───────────────────────────────────────────────────────────
  const sessionScore  = sessionResults.reduce((s, r) => s + (r.score || 0), 0);
  const sessionMax    = sessionResults.reduce((s, r) => s + (r.maxScore || 1), 0);
  const sessionPct    = sessionMax > 0 ? Math.round((sessionScore / sessionMax) * 100) : 0;
  const correctCount  = sessionResults.filter(r => r.correct).length;

  // ─── Render: Setup ───────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <>
        <Head>
          <title>Drill Mode ★ — NewWorldEdu</title>
          <link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap" rel="stylesheet" />
        </Head>
        <div style={S.page}>
          <nav style={S.nav}>
            <Link href="/"><a style={S.navLogo}>NewWorldEdu<span style={{ color: '#4F8EF7' }}>★</span></a></Link>
            <div style={S.navRight}>
              {sr.dueCount > 0 && (
                <span style={{ ...S.badge('#FCD34D'), fontSize: 12, fontWeight: 700 }}>
                  {sr.dueCount} due for review
                </span>
              )}
              <Link href="/"><a style={S.navLink}>← Home</a></Link>
            </div>
          </nav>

          <div style={S.container}>
            <h1 style={S.h1}>Past Paper Drill 📚</h1>
            <p style={S.subtitle}>
              Cambridge exam questions, generated fresh every time. Starky tracks what you struggle with and brings those topics back automatically.
            </p>

            {/* Level */}
            <div style={S.card}>
              <span style={S.label}>Exam Level</span>
              <div style={S.grid2}>
                {['O Level', 'A Level'].map(l => (
                  <button key={l} style={S.optionBtn(level === l)} onClick={() => { setLevel(l); setSubject(''); setTopic(''); }}>
                    {l === 'O Level' ? '📚 O Level' : '🎓 A Level'}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div style={S.card}>
              <span style={S.label}>Subject</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {subjects.map(s => (
                  <button key={s} style={S.optionBtn(subject === s)} onClick={() => { setSubject(s); setTopic(''); }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            {subject && (
              <div style={S.card}>
                <span style={S.label}>Topic</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: 6 }}>
                  {/* Due topics first */}
                  {dueTopics.map(t => (
                    <button key={t} style={S.optionBtn(topic === t)} onClick={() => setTopic(t)}>
                      {t}
                      <span style={S.badge('#FCD34D')}>due</span>
                    </button>
                  ))}
                  {/* All other topics */}
                  {topics.filter(t => !dueTopics.includes(t)).map(t => {
                    const stats = sr.getTopicStats(subject, t);
                    return (
                      <button key={t} style={S.optionBtn(topic === t)} onClick={() => setTopic(t)}>
                        {t}
                        {stats && stats.reps >= 3 && stats.ef >= 2.0 && (
                          <span style={S.badge('#4ADE80')}>mastered</span>
                        )}
                        {stats && stats.totalSeen > 0 && !(stats.reps >= 3 && stats.ef >= 2.0) && (
                          <span style={S.badge('#94A3B8')}>{stats.totalSeen}×</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Difficulty */}
            <div style={S.card}>
              <span style={S.label}>Difficulty</span>
              <div style={S.grid3}>
                {DIFFICULTIES.map(d => (
                  <button key={d.id} style={S.optionBtn(difficulty === d.id)} onClick={() => setDifficulty(d.id)}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{d.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{d.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question type */}
            <div style={S.card}>
              <span style={S.label}>Question Type</span>
              <div style={S.grid3}>
                {QUESTION_TYPES.map(q => (
                  <button key={q.id} style={S.optionBtn(questionType === q.id)} onClick={() => setQuestionType(q.id)}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{q.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{q.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              style={{ ...S.primaryBtn, opacity: (!subject || !topic) ? 0.4 : 1, cursor: (!subject || !topic) ? 'not-allowed' : 'pointer' }}
              onClick={startSession}
              disabled={!subject || !topic}
            >
              Start {SESSION_LENGTH}-Question Drill →
            </button>

            {sr.weakTopics.length > 0 && (
              <div style={{ ...S.card, marginTop: 24, borderColor: 'rgba(248,113,113,.2)', background: 'rgba(248,113,113,.05)' }}>
                <span style={S.label}>⚠️ Your weak topics (click to drill)</span>
                {sr.weakTopics.map(c => (
                  <button key={c.topic} style={{ ...S.optionBtn(false), marginBottom: 6, display: 'block', width: '100%' }}
                    onClick={() => { setSubject(c.subject); setTopic(c.topic); }}>
                    {c.subject} — {c.topic}
                    <span style={S.badge('#F87171')}>weak</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // ─── Render: Drilling ────────────────────────────────────────────────────────
  if (phase === 'drilling') {
    const pct = Math.round((questionNum / SESSION_LENGTH) * 100);
    return (
      <>
        <Head>
          <title>Drill — {subject} · NewWorldEdu</title>
          <link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap" rel="stylesheet" />
        </Head>
        <div style={S.page}>
          <nav style={S.nav}>
            <Link href="/"><a style={S.navLogo}>NewWorldEdu<span style={{ color: '#4F8EF7' }}>★</span></a></Link>
            <div style={S.navRight}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', fontWeight: 600 }}>
                {questionNum + 1} / {SESSION_LENGTH}
              </span>
              <button style={{ ...S.navLink, cursor: 'pointer', border: 'none', background: 'rgba(255,255,255,.05)' }}
                onClick={() => setPhase('setup')}>
                ✕ End
              </button>
            </div>
          </nav>

          <div style={S.container}>
            {/* Progress bar */}
            <div style={S.progressBar(pct)}>
              <div style={{ height: '100%', borderRadius: 100, width: `${pct}%`, background: 'linear-gradient(90deg, #4F8EF7, #6366F1)', transition: 'width .4s ease' }} />
            </div>

            {/* Subject + topic header */}
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#4F8EF7' }}>{subject}</span>
              <span style={{ color: 'rgba(255,255,255,.2)' }}>·</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>{question?.topic || topic}</span>
              <span style={{ color: 'rgba(255,255,255,.2)' }}>·</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', textTransform: 'capitalize' }}>{difficulty}</span>
            </div>

            {loading && !question && (
              <div style={{ ...S.card, textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
                <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 14 }}>Starky is generating your question…</div>
              </div>
            )}

            {error && (
              <div style={{ ...S.card, borderColor: 'rgba(248,113,113,.3)', marginBottom: 16 }}>
                <p style={{ color: '#F87171', fontSize: 14, margin: 0 }}>{error}</p>
                <button style={{ ...S.ghostBtn, marginTop: 12 }} onClick={() => generateQuestion(topic)}>Try Again</button>
              </div>
            )}

            {question && !loading && (
              <>
                {/* Marks badge */}
                <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ ...S.badge('#94A3B8'), fontSize: 11 }}>{question.marks} mark{question.marks !== 1 ? 's' : ''}</span>
                  <span style={{ ...S.badge('#94A3B8'), fontSize: 11 }}>{question.type === 'mcq' ? 'Multiple choice' : 'Structured'}</span>
                </div>

                {/* Question */}
                <div style={S.questionText}>{question.question}</div>

                {/* MCQ options */}
                {question.type === 'mcq' && question.options && !feedback && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {Object.entries(question.options).map(([key, val]) => {
                      let borderColor = 'rgba(255,255,255,.08)';
                      let bg = 'rgba(255,255,255,.04)';
                      let color = 'rgba(255,255,255,.75)';
                      if (selectedOption === key) { borderColor = 'rgba(79,142,247,.5)'; bg = 'rgba(79,142,247,.15)'; color = '#4F8EF7'; }
                      return (
                        <button key={key}
                          style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 10, padding: '12px 16px', cursor: 'pointer', color, fontSize: 14, textAlign: 'left', display: 'flex', gap: 10, alignItems: 'flex-start', transition: 'all .15s', WebkitTapHighlightColor: 'transparent' }}
                          onClick={() => setSelectedOption(key)}>
                          <strong style={{ minWidth: 20, color: 'rgba(255,255,255,.4)' }}>{key}.</strong>
                          <span>{val}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* MCQ options after feedback — show correct/wrong */}
                {question.type === 'mcq' && question.options && feedback && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {Object.entries(question.options).map(([key, val]) => {
                      const isSelected = selectedOption === key;
                      const isCorrect  = key === question.correctOption;
                      let bg = 'rgba(255,255,255,.03)'; let border = 'rgba(255,255,255,.06)'; let color = 'rgba(255,255,255,.4)';
                      if (isCorrect)          { bg = 'rgba(74,222,128,.1)';  border = 'rgba(74,222,128,.35)';  color = '#4ADE80'; }
                      if (isSelected && !isCorrect) { bg = 'rgba(248,113,113,.1)'; border = 'rgba(248,113,113,.35)'; color = '#F87171'; }
                      return (
                        <div key={key} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '12px 16px', color, fontSize: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <strong style={{ minWidth: 20 }}>{key}.</strong>
                          <span>{val}</span>
                          {isCorrect && <span style={{ marginLeft: 'auto', fontSize: 16 }}>✓</span>}
                          {isSelected && !isCorrect && <span style={{ marginLeft: 'auto', fontSize: 16 }}>✗</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Structured answer textarea */}
                {question.type === 'structured' && !feedback && (
                  <div style={{ marginBottom: 16 }}>
                    <span style={S.label}>Your answer</span>
                    <textarea
                      style={S.textarea}
                      placeholder="Write your answer here…"
                      value={structuredAns}
                      onChange={e => setStructuredAns(e.target.value)}
                    />
                  </div>
                )}

                {/* Feedback */}
                {feedback && (
                  <div style={S.feedbackBox(feedback.correct)}>
                    <div style={S.scoreRow}>
                      <span style={{ fontSize: 20 }}>{feedback.correct ? '✅' : '❌'}</span>
                      <span style={{ fontWeight: 800, fontSize: 15, color: feedback.correct ? '#4ADE80' : '#F87171' }}>
                        {feedback.score} / {feedback.maxScore} marks
                      </span>
                    </div>
                    <p style={{ margin: '0 0 10px', fontSize: 14, color: 'rgba(255,255,255,.85)', lineHeight: 1.7 }}>
                      {feedback.feedback}
                    </p>
                    {feedback.examinerTip && (
                      <div style={S.tipBox}>
                        <strong style={{ color: '#FCD34D' }}>📌 Examiner tip: </strong>{feedback.examinerTip}
                      </div>
                    )}
                    {feedback.modelAnswer && (
                      <div style={S.modelBox}>
                        <strong style={{ color: 'rgba(255,255,255,.5)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em' }}>Model answer</strong>
                        <p style={{ margin: '6px 0 0', lineHeight: 1.7 }}>{feedback.modelAnswer}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Submit / Next */}
                {!feedback ? (
                  <button
                    style={{ ...S.primaryBtn, opacity: (question.type === 'mcq' ? !selectedOption : !structuredAns.trim()) ? 0.4 : 1 }}
                    disabled={question.type === 'mcq' ? !selectedOption : !structuredAns.trim()}
                    onClick={submitAnswer}
                  >
                    {loading ? 'Checking…' : 'Submit Answer →'}
                  </button>
                ) : (
                  <button style={S.primaryBtn} onClick={nextQuestion}>
                    {questionNum + 1 >= SESSION_LENGTH ? 'See Results →' : `Next Question → (${questionNum + 1}/${SESSION_LENGTH})`}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  // ─── Render: Summary ─────────────────────────────────────────────────────────
  const gradeEmoji = sessionPct >= 80 ? '🌟' : sessionPct >= 60 ? '👍' : '📖';
  const gradeText  = sessionPct >= 80 ? 'Excellent work!' : sessionPct >= 60 ? 'Good effort!' : 'Keep practising!';

  return (
    <>
      <Head>
        <title>Session Complete — NewWorldEdu</title>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap" rel="stylesheet" />
      </Head>
      <div style={S.page}>
        <nav style={S.nav}>
          <Link href="/"><a style={S.navLogo}>NewWorldEdu<span style={{ color: '#4F8EF7' }}>★</span></a></Link>
        </nav>

        <div style={S.container}>
          {/* Score hero */}
          <div style={{ ...S.card, textAlign: 'center', padding: '40px 24px', marginBottom: 24, borderColor: 'rgba(79,142,247,.2)', background: 'rgba(79,142,247,.05)' }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>{gradeEmoji}</div>
            <h1 style={{ ...S.h1, fontSize: 30, marginBottom: 6 }}>{gradeText}</h1>
            <div style={{ fontSize: 52, fontWeight: 900, fontFamily: "'Sora',sans-serif", color: sessionPct >= 80 ? '#4ADE80' : sessionPct >= 60 ? '#FCD34D' : '#F87171', margin: '12px 0' }}>
              {sessionPct}%
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,.45)' }}>
              {correctCount} / {sessionResults.length} correct · {sessionScore} / {sessionMax} marks
            </div>
          </div>

          {/* Streak widget */}
          <div style={{ marginBottom: 16 }}>
            <StreakWidget />
          </div>

          {/* Per-question results */}
          <div style={S.card}>
            <span style={S.label}>Question breakdown</span>
            {sessionResults.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < sessionResults.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
                <span style={{ fontSize: 16 }}>{r.correct ? '✅' : '❌'}</span>
                <span style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,.7)' }}>{r.topic}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: r.correct ? '#4ADE80' : '#F87171' }}>
                  {r.score}/{r.maxScore}
                </span>
              </div>
            ))}
          </div>

          {/* Spaced rep status */}
          {sr.dueCount > 0 && (
            <div style={{ ...S.card, borderColor: 'rgba(252,211,77,.2)', background: 'rgba(252,211,77,.05)' }}>
              <span style={S.label}>🔄 Due for review</span>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', margin: '0 0 12px', lineHeight: 1.6 }}>
                Starky has scheduled {sr.dueCount} topic{sr.dueCount !== 1 ? 's' : ''} for review based on your performance. Come back tomorrow to drill them.
              </p>
            </div>
          )}

          {/* Subject mastery */}
          {subject && (
            <div style={S.card}>
              <span style={S.label}>{subject} mastery</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, height: 8, borderRadius: 100, background: 'rgba(255,255,255,.08)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${sr.getSubjectMastery(subject)}%`, background: 'linear-gradient(90deg, #4F8EF7, #6366F1)', borderRadius: 100, transition: 'width .6s ease' }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#4F8EF7', minWidth: 36 }}>{sr.getSubjectMastery(subject)}%</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <button style={S.primaryBtn} onClick={() => { setPhase('drilling'); setQuestionNum(0); setSessionResults([]); generateQuestion(topic); }}>
            Drill Again 🔄
          </button>
          <button style={S.ghostBtn} onClick={() => setPhase('setup')}>
            Change Subject / Topic
          </button>
          <Link href="/"><a style={{ ...S.ghostBtn, display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 8 }}>
            Back to Starky Chat
          </a></Link>
        </div>
      </div>
    </>
  );
}
