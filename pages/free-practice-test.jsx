/**
 * pages/free-practice-test.jsx — Lead Magnet Landing Page
 * ─────────────────────────────────────────────────────────────────
 * Free Cambridge diagnostic test that captures email leads.
 * Designed for sharing on: Facebook O Level groups, WhatsApp, school networks.
 *
 * Flow: Select grade/subject → Enter name+email → Take 5 free questions → See score → CTA
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SUBJECTS_OLEVEL = ['Biology','Chemistry','Physics','Mathematics','English Language','Economics','Computer Science','Pakistan Studies','Accounting','Business Studies','Geography','History','Islamiyat','Urdu','Sociology','Additional Mathematics','Statistics','Literature in English'];
const SUBJECTS_ALEVEL = ['Biology','Chemistry','Physics','Mathematics','Economics','Computer Science','English Language','Psychology','Business Studies','Accounting','Geography','History','Sociology','Law','Further Mathematics'];

export default function FreePracticeTest() {
  const [isMob, setIsMob] = useState(false);
  useEffect(() => { setIsMob(window.innerWidth < 640); }, []);

  // Flow phases
  const [phase, setPhase] = useState('landing'); // landing, select, capture, testing, results

  // Selection
  const [level, setLevel] = useState('');
  const [subject, setSubject] = useState('');

  // Lead capture
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [captureError, setCaptureError] = useState('');

  // Test
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);

  const subjects = level === 'A Level' ? SUBJECTS_ALEVEL : SUBJECTS_OLEVEL;

  // ── Capture lead ──────────────────────────────────────────────
  const captureLead = async () => {
    if (!name.trim() || !email.trim()) { setCaptureError('Please enter your name and email'); return; }
    if (!email.includes('@')) { setCaptureError('Please enter a valid email'); return; }
    setCapturing(true); setCaptureError('');
    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), grade: level, subject, source: 'free_test' }),
      });
      const data = await res.json();
      if (res.ok) {
        // Store locally
        localStorage.setItem('nw_lead', JSON.stringify({ name, email, grade: level, subject }));
        setPhase('testing');
        loadQuestion();
      } else {
        setCaptureError(data.error || 'Something went wrong');
      }
    } catch { setCaptureError('Network error. Please try again.'); }
    finally { setCapturing(false); }
  };

  // ── Load question from question bank ──────────────────────────
  const loadQuestion = async () => {
    setLoading(true); setFeedback(null); setSelectedOption('');
    try {
      const res = await fetch('/api/question-bank/serve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject, level, difficulty: 'medium',
          type: 'mcq', curriculum: 'cambridge',
          excludeIds: questions.map(q => q._bankId).filter(Boolean),
        }),
      });
      if (res.ok) {
        const q = await res.json();
        setQuestions(prev => [...prev, q]);
      }
    } catch {}
    finally { setLoading(false); }
  };

  // ── Grade answer ──────────────────────────────────────────────
  const submitAnswer = async () => {
    if (!selectedOption) return;
    const q = questions[currentQ];
    setLoading(true);
    try {
      // For MCQs, we can grade locally if we have the correct option
      const correctOption = q.correctOption;
      let data;
      if (correctOption && q.type === 'mcq') {
        // MCQ: DETERMINISTIC grading — NEVER trust AI for right/wrong
        const isCorrect = selectedOption === correctOption;
        data = {
          correct: isCorrect,
          score: isCorrect ? 1 : 0,
          maxScore: 1,
          quality: isCorrect ? 4 : 1,
          feedback: isCorrect
            ? 'Correct! Well done.'
            : `The correct answer is ${correctOption}: ${q.options?.[correctOption] || ''}. ${q.markSchemeHint || ''}`,
          examinerTip: q.markSchemeHint || '',
          modelAnswer: `${correctOption}: ${q.options?.[correctOption] || ''}`,
        };
      } else {
        const res = await fetch('/api/drill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'grade', level, subject, topic: q.topic,
            question: q.question, studentAnswer: selectedOption,
            questionType: 'mcq', options: q.options, marks: q.marks || 1,
          }),
        });
        data = await res.json();
      }
      setFeedback(data);
      setScore(s => s + (data.score || 0));
      setMaxScore(m => m + (data.maxScore || 1));
      setAnswers(prev => [...prev, { question: q, answer: selectedOption, feedback: data }]);

      // Track performance in question bank
      if (q._bankId) {
        fetch('/api/question-bank/record', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId: q._bankId, score: data.score || 0, maxScore: data.maxScore || 1 }),
        }).catch(() => {});
      }
    } catch {}
    finally { setLoading(false); }
  };

  const nextQuestion = () => {
    if (currentQ >= 4) {
      setPhase('results');
      return;
    }
    setCurrentQ(c => c + 1);
    setFeedback(null);
    setSelectedOption('');
    loadQuestion();
  };

  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const grade = pct >= 90 ? 'A*' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'E';

  return (
    <>
      <Head>
        <title>Free Cambridge Practice Test | NewWorld Education</title>
        <meta name="description" content="Take a free Cambridge O Level / A Level practice test. 5 exam-style questions with instant marking. See where you stand — for free." />
        <meta property="og:title" content="Free Cambridge Practice Test — Are You A* Ready?" />
        <meta property="og:description" content="5 real exam questions. Instant marking. See your predicted grade. No signup fee." />
        <meta property="og:url" content="https://newworld.education/free-practice-test" />
        <meta property="og:type" content="website" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight:'100vh', background:'#080C18', color:'#fff', fontFamily:"'Sora','Inter',sans-serif" }}>
        {/* Nav */}
        <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:isMob?'12px 16px':'14px 28px', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
          <Link href="/" style={{ fontWeight:800, fontSize:isMob?14:17, color:'#fff', textDecoration:'none', display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:20 }}>★</span> NewWorld
          </Link>
          <span style={{ fontSize:11, color:'rgba(255,255,255,.3)', fontWeight:600, letterSpacing:'.05em' }}>FREE DIAGNOSTIC</span>
        </nav>

        <div style={{ maxWidth:640, margin:'0 auto', padding:isMob?'20px 16px':'40px 20px' }}>

          {/* ── LANDING ──────────────────────────────────────── */}
          {phase === 'landing' && (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>★</div>
              <h1 style={{ fontSize:isMob?24:32, fontWeight:800, margin:'0 0 12px', lineHeight:1.2 }}>
                Are You A* Ready?
              </h1>
              <p style={{ fontSize:isMob?14:16, color:'rgba(255,255,255,.5)', lineHeight:1.7, margin:'0 0 32px', maxWidth:480, marginLeft:'auto', marginRight:'auto' }}>
                Take a free 5-question Cambridge diagnostic test. Get instant marking using real examiner standards. See exactly where you stand.
              </p>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:32, textAlign:'left' }}>
                {[
                  { icon:'🎯', text:'5 real exam questions' },
                  { icon:'⚡', text:'Instant AI marking' },
                  { icon:'📊', text:'Predicted grade' },
                  { icon:'🔓', text:'100% free, no card' },
                ].map((f, i) => (
                  <div key={i} style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:12, padding:'14px 16px', display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:20 }}>{f.icon}</span>
                    <span style={{ fontSize:13, color:'rgba(255,255,255,.7)' }}>{f.text}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => setPhase('select')} style={{
                background:'linear-gradient(135deg,#4F8EF7,#6366F1)', border:'none', borderRadius:14,
                padding:'16px 40px', color:'#fff', fontSize:16, fontWeight:700, cursor:'pointer', width:'100%', maxWidth:360,
                fontFamily:"'Sora',sans-serif",
              }}>
                Start Free Test →
              </button>

              <p style={{ fontSize:12, color:'rgba(255,255,255,.25)', marginTop:16 }}>
                Used by students at Nixor, Beaconhouse, City School, and more
              </p>
            </div>
          )}

          {/* ── SELECT LEVEL + SUBJECT ───────────────────────── */}
          {phase === 'select' && (
            <div>
              <h2 style={{ fontSize:isMob?18:22, fontWeight:700, margin:'0 0 20px' }}>Choose your exam level</h2>

              {!level ? (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  {['O Level', 'A Level'].map(l => (
                    <button key={l} onClick={() => setLevel(l)} style={{
                      background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)',
                      borderRadius:14, padding:'24px 16px', color:'#fff', fontSize:16, fontWeight:600,
                      cursor:'pointer', textAlign:'center',
                    }}>
                      <div style={{ fontSize:28, marginBottom:8 }}>{l === 'O Level' ? '📘' : '📗'}</div>
                      Cambridge {l}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                    <span style={{ fontSize:12, padding:'4px 12px', borderRadius:100, background:'rgba(79,142,247,.15)', color:'#4F8EF7', fontWeight:600 }}>
                      {level}
                    </span>
                    <button onClick={() => { setLevel(''); setSubject(''); }} style={{ background:'none', border:'none', color:'rgba(255,255,255,.3)', fontSize:12, cursor:'pointer' }}>Change</button>
                  </div>
                  <h2 style={{ fontSize:isMob?18:22, fontWeight:700, margin:'0 0 16px' }}>Pick your subject</h2>
                  <div style={{ display:'grid', gridTemplateColumns:isMob?'1fr 1fr':'repeat(3,1fr)', gap:8 }}>
                    {subjects.map(s => (
                      <button key={s} onClick={() => { setSubject(s); setPhase('capture'); }} style={{
                        background: 'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)',
                        borderRadius:10, padding:'14px 12px', color:'rgba(255,255,255,.75)', fontSize:13,
                        fontWeight:500, cursor:'pointer', textAlign:'left',
                      }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── CAPTURE EMAIL ─────────────────────────────────── */}
          {phase === 'capture' && (
            <div>
              <div style={{ display:'flex', gap:8, marginBottom:20 }}>
                <span style={{ fontSize:12, padding:'4px 12px', borderRadius:100, background:'rgba(79,142,247,.15)', color:'#4F8EF7', fontWeight:600 }}>{level}</span>
                <span style={{ fontSize:12, padding:'4px 12px', borderRadius:100, background:'rgba(79,142,247,.15)', color:'#4F8EF7', fontWeight:600 }}>{subject}</span>
              </div>

              <h2 style={{ fontSize:isMob?18:22, fontWeight:700, margin:'0 0 6px' }}>Almost ready!</h2>
              <p style={{ fontSize:14, color:'rgba(255,255,255,.45)', margin:'0 0 24px' }}>
                Enter your details to start the test. We'll email your results + a free study plan.
              </p>

              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,.4)', display:'block', marginBottom:6 }}>YOUR NAME</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ahmed Khan"
                  style={{ width:'100%', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:10, color:'#fff', padding:'13px 16px', fontSize:15, outline:'none', boxSizing:'border-box' }}
                />
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,.4)', display:'block', marginBottom:6 }}>EMAIL ADDRESS</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. ahmed@gmail.com"
                  onKeyDown={e => e.key === 'Enter' && captureLead()}
                  style={{ width:'100%', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:10, color:'#fff', padding:'13px 16px', fontSize:15, outline:'none', boxSizing:'border-box' }}
                />
              </div>

              {captureError && <p style={{ color:'#F87171', fontSize:13, marginBottom:12 }}>{captureError}</p>}

              <button onClick={captureLead} disabled={capturing} style={{
                background:'linear-gradient(135deg,#4F8EF7,#6366F1)', border:'none', borderRadius:12,
                padding:'14px 28px', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%',
                opacity: capturing ? 0.6 : 1, fontFamily:"'Sora',sans-serif",
              }}>
                {capturing ? 'Starting...' : 'Start My Free Test →'}
              </button>

              <p style={{ fontSize:11, color:'rgba(255,255,255,.2)', marginTop:12, textAlign:'center' }}>
                No spam. No credit card. Just 5 questions and your results.
              </p>
            </div>
          )}

          {/* ── TESTING ───────────────────────────────────────── */}
          {phase === 'testing' && (
            <div>
              {/* Progress bar */}
              <div style={{ display:'flex', gap:6, marginBottom:20 }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{
                    flex:1, height:4, borderRadius:100,
                    background: i < currentQ ? '#4ADE80' : i === currentQ ? '#4F8EF7' : 'rgba(255,255,255,.1)',
                  }} />
                ))}
              </div>

              <div style={{ fontSize:12, color:'rgba(255,255,255,.3)', marginBottom:16, fontWeight:600 }}>
                QUESTION {currentQ + 1} OF 5 — {subject} ({level})
              </div>

              {loading && !questions[currentQ] ? (
                <div style={{ textAlign:'center', padding:40, color:'rgba(255,255,255,.4)' }}>
                  <div style={{ fontSize:32, marginBottom:12 }}>★</div>
                  Loading your question...
                </div>
              ) : questions[currentQ] ? (
                <>
                  <div style={{
                    fontSize:15, lineHeight:1.75, color:'rgba(255,255,255,.9)',
                    background:'rgba(79,142,247,.07)', border:'1px solid rgba(79,142,247,.2)',
                    borderRadius:12, padding:'18px 20px', marginBottom:20,
                  }}>
                    {questions[currentQ].question}
                  </div>

                  {questions[currentQ].options && (
                    <div style={{ display:'grid', gap:8, marginBottom:20 }}>
                      {Object.entries(questions[currentQ].options).map(([key, val]) => (
                        <button key={key} onClick={() => !feedback && setSelectedOption(key)} style={{
                          background: feedback
                            ? key === (questions[currentQ].correctOption || feedback.modelAnswer)
                              ? 'rgba(74,222,128,.12)' : key === selectedOption && !feedback.correct ? 'rgba(248,113,113,.12)' : 'rgba(255,255,255,.04)'
                            : selectedOption === key ? 'rgba(79,142,247,.15)' : 'rgba(255,255,255,.04)',
                          border: `1px solid ${feedback
                            ? key === (questions[currentQ].correctOption || feedback.modelAnswer) ? 'rgba(74,222,128,.4)' : key === selectedOption && !feedback.correct ? 'rgba(248,113,113,.4)' : 'rgba(255,255,255,.08)'
                            : selectedOption === key ? 'rgba(79,142,247,.5)' : 'rgba(255,255,255,.08)'}`,
                          borderRadius:10, padding:'13px 16px', cursor: feedback ? 'default' : 'pointer',
                          color:'rgba(255,255,255,.8)', fontSize:14, textAlign:'left',
                          display:'flex', gap:10, alignItems:'flex-start',
                        }}>
                          <span style={{ fontWeight:700, minWidth:20, color: selectedOption === key ? '#4F8EF7' : 'rgba(255,255,255,.3)' }}>{key}.</span>
                          <span>{val}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {!feedback ? (
                    <button onClick={submitAnswer} disabled={!selectedOption || loading} style={{
                      background:'linear-gradient(135deg,#4F8EF7,#6366F1)', border:'none', borderRadius:12,
                      padding:'14px 28px', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%',
                      opacity: !selectedOption || loading ? 0.5 : 1, fontFamily:"'Sora',sans-serif",
                    }}>
                      {loading ? 'Marking...' : 'Submit Answer'}
                    </button>
                  ) : (
                    <div>
                      <div style={{
                        background: feedback.correct ? 'rgba(74,222,128,.07)' : 'rgba(248,113,113,.07)',
                        border: `1px solid ${feedback.correct ? 'rgba(74,222,128,.25)' : 'rgba(248,113,113,.25)'}`,
                        borderRadius:14, padding:'16px 18px', marginBottom:16,
                      }}>
                        <div style={{ fontSize:14, fontWeight:700, color: feedback.correct ? '#4ADE80' : '#F87171', marginBottom:6 }}>
                          {feedback.correct ? 'Correct!' : 'Not quite'}
                        </div>
                        <div style={{ fontSize:13, color:'rgba(255,255,255,.7)', lineHeight:1.6 }}>{feedback.feedback}</div>
                        {feedback.examinerTip && (
                          <div style={{ marginTop:10, fontSize:12, color:'rgba(251,191,36,.8)', background:'rgba(251,191,36,.07)', border:'1px solid rgba(251,191,36,.15)', borderRadius:8, padding:'10px 12px' }}>
                            <strong>Examiner tip:</strong> {feedback.examinerTip}
                          </div>
                        )}
                      </div>

                      <button onClick={nextQuestion} style={{
                        background:'linear-gradient(135deg,#4F8EF7,#6366F1)', border:'none', borderRadius:12,
                        padding:'14px 28px', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%',
                        fontFamily:"'Sora',sans-serif",
                      }}>
                        {currentQ >= 4 ? 'See My Results →' : 'Next Question →'}
                      </button>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          )}

          {/* ── RESULTS ───────────────────────────────────────── */}
          {phase === 'results' && (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>
                {pct >= 80 ? '🌟' : pct >= 60 ? '📈' : '💪'}
              </div>
              <h1 style={{ fontSize:isMob?24:30, fontWeight:800, margin:'0 0 8px' }}>
                Your Predicted Grade: <span style={{ color:'#4F8EF7' }}>{grade}</span>
              </h1>
              <p style={{ fontSize:16, color:'rgba(255,255,255,.5)', marginBottom:28 }}>
                {score}/{maxScore} marks — {subject} ({level})
              </p>

              {/* Score breakdown */}
              <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, padding:20, marginBottom:24, textAlign:'left' }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.07em', color:'rgba(255,255,255,.3)', marginBottom:12 }}>YOUR ANSWERS</div>
                {answers.map((a, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom: i < answers.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none' }}>
                    <span style={{ fontSize:18 }}>{a.feedback.correct ? '✅' : '❌'}</span>
                    <span style={{ fontSize:13, color:'rgba(255,255,255,.6)', flex:1 }}>Q{i+1}: {a.question.question?.slice(0, 60)}...</span>
                    <span style={{ fontSize:12, fontWeight:600, color: a.feedback.correct ? '#4ADE80' : '#F87171' }}>{a.feedback.score}/{a.feedback.maxScore}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{
                background:'linear-gradient(135deg,rgba(79,142,247,.1),rgba(99,102,241,.1))',
                border:'1px solid rgba(79,142,247,.25)', borderRadius:16, padding:24, marginBottom:20,
              }}>
                <h3 style={{ fontSize:18, fontWeight:700, margin:'0 0 8px' }}>
                  {pct >= 80 ? 'You\'re close to A* — let\'s get you there' : pct >= 60 ? 'Good foundation — Starky can push you higher' : 'Starky can help you improve fast'}
                </h3>
                <p style={{ fontSize:13, color:'rgba(255,255,255,.5)', margin:'0 0 16px', lineHeight:1.6 }}>
                  Get 10 free AI tutoring sessions. Starky learns your weak spots and teaches you the exact words examiners want to see.
                </p>
                <a href="/drill" style={{
                  background:'linear-gradient(135deg,#4F8EF7,#6366F1)', border:'none', borderRadius:12,
                  padding:'14px 32px', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer',
                  textDecoration:'none', display:'inline-block', fontFamily:"'Sora',sans-serif",
                }}>
                  Continue Practising Free →
                </a>
              </div>

              {/* Share */}
              <div style={{ marginBottom:20 }}>
                <p style={{ fontSize:13, color:'rgba(255,255,255,.3)', marginBottom:10 }}>Challenge your friends:</p>
                <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
                  <a href={`https://wa.me/?text=${encodeURIComponent(`I scored ${pct}% (${grade}) on a free Cambridge ${subject} test! Try it: https://newworld.education/free-practice-test`)}`}
                    target="_blank" rel="noopener" style={{
                      background:'#25D366', color:'#fff', padding:'10px 20px', borderRadius:10,
                      fontSize:13, fontWeight:600, textDecoration:'none',
                    }}>
                    Share on WhatsApp
                  </a>
                  <button onClick={() => { navigator.clipboard?.writeText(`I scored ${pct}% (${grade}) on a free Cambridge ${subject} test! Try it: https://newworld.education/free-practice-test`); }} style={{
                    background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)', color:'rgba(255,255,255,.6)',
                    padding:'10px 20px', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer',
                  }}>
                    Copy Link
                  </button>
                </div>
              </div>

              <p style={{ fontSize:11, color:'rgba(255,255,255,.2)' }}>
                newworld.education — AI tutoring for Cambridge students
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
