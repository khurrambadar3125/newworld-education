import { useState, useEffect } from 'react';
import Head from 'next/head';

const O_LEVEL_SUBJECTS = [
  'Physics (5054)', 'Chemistry (5070)', 'Biology (5090)', 'Mathematics (4024)',
  'Additional Mathematics (4037)', 'English Language (1123)', 'English Literature (2010)',
  'Urdu (3247)', 'Pakistan Studies (2059)', 'Islamiyat (2058)', 'Computer Science (2210)',
  'Economics (2281)', 'Commerce (7100)', 'Accounting (7707)', 'History (2147)',
  'Geography (2217)', 'Sociology (2251)',
];

const A_LEVEL_SUBJECTS = [
  'Physics (9702)', 'Chemistry (9701)', 'Biology (9700)', 'Mathematics (9709)',
  'Further Mathematics (9231)', 'English Language (9093)', 'English Literature (9695)',
  'Economics (9708)', 'Business (9609)', 'Accounting (9706)', 'Computer Science (9618)',
  'Psychology (9990)', 'Sociology (9699)', 'History (9489)', 'Geography (9696)', 'Law (9084)',
];

export default function Mocks() {
  const [isMobile, setIsMobile] = useState(false);
  const [step, setStep] = useState('register'); // register | subjects | exam | results
  const [form, setForm] = useState({ name: '', email: '', school: '', grade: 'O Level', country: 'PK' });
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [mockSession, setMockSession] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn(); window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // Check if already registered
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nw_mocks_registration');
      if (saved) {
        const data = JSON.parse(saved);
        setForm(data.form || form);
        setSelectedSubjects(data.subjects || []);
        setRegistered(true);
        setStep('subjects');
      }
    } catch {}
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const handleRegister = async () => {
    if (!form.name || !form.email) return setError('Name and email are required');
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/mocks/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subjects: selectedSubjects }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('nw_mocks_registration', JSON.stringify({ form, subjects: selectedSubjects }));
        setRegistered(true);
        setStep('subjects');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const toggleSubject = (s) => {
    setSelectedSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const startMock = async (subject) => {
    setLoading(true);
    try {
      const res = await fetch('/api/mocks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, subject, grade: form.grade }),
      });
      const data = await res.json();
      if (data.questions?.length) {
        setQuestions(data.questions);
        setMockSession({ subject, startTime: Date.now() });
        setCurrentQ(0);
        setAnswers({});
        setTimeLeft(data.timeLimit || 3600); // 60 min default
        setStep('exam');
      }
    } catch {}
    setLoading(false);
  };

  const submitAnswer = (qIndex, answer) => {
    setAnswers(prev => ({ ...prev, [qIndex]: answer }));
    if (qIndex < questions.length - 1) setCurrentQ(qIndex + 1);
  };

  const submitMock = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mocks/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          subject: mockSession?.subject,
          grade: form.grade,
          answers,
          questions,
          duration: mockSession ? Math.round((Date.now() - mockSession.startTime) / 60000) : 0,
        }),
      });
      const data = await res.json();
      setResults(data);
      setStep('results');
    } catch {}
    setLoading(false);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const subjects = form.grade === 'A Level' ? A_LEVEL_SUBJECTS : O_LEVEL_SUBJECTS;

  const S = {
    page: { minHeight: '100vh', background: '#080C18', fontFamily: "'Sora',-apple-system,sans-serif", color: '#fff' },
    container: { maxWidth: 700, margin: '0 auto', padding: isMobile ? '24px 16px' : '40px 24px' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: isMobile ? '16px' : '24px' },
    btn: { background: 'linear-gradient(135deg,#4F8EF7,#6366F1)', border: 'none', borderRadius: 12, padding: '14px 28px', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: "'Sora',sans-serif", width: '100%' },
    input: { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 14, fontFamily: "'Sora',sans-serif", outline: 'none', marginBottom: 12, boxSizing: 'border-box' },
  };

  return (
    <div style={S.page}>
      <Head>
        <title>Starky Mocks — AI Cambridge Mock Exams | NewWorldEdu</title>
        <meta name="description" content="Starky Mocks: Pakistan's first AI-powered Cambridge Mock Exam. Free registration. Timed papers. Instant AI marking with examiner feedback." />
      </Head>

      {/* Header */}
      <header style={{ padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ textDecoration: 'none', fontWeight: 900, fontSize: 15, color: '#fff' }}>
          NewWorldEdu<span style={{ color: '#4F8EF7' }}>★</span>
        </a>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="/demo" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 700 }}>Study</a>
          <a href="/drill" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 700 }}>Practice</a>
        </div>
      </header>

      <div style={S.container}>

        {/* ═══ REGISTRATION ═══ */}
        {step === 'register' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
              <h1 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 900, margin: '0 0 10px', background: 'linear-gradient(135deg,#4F8EF7,#6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Starky Mocks
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: 0, lineHeight: 1.7 }}>
                Pakistan's first AI Cambridge Mock Exam. April 2026. Free.
              </p>
            </div>

            <div style={S.card}>
              <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 16px' }}>Register for Starky Mocks</h2>

              <input style={S.input} placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input style={S.input} placeholder="Email address" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <input style={S.input} placeholder="School name (optional)" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} />

              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                {['O Level', 'A Level'].map(g => (
                  <button key={g} onClick={() => setForm({ ...form, grade: g })}
                    style={{ flex: 1, padding: '10px', borderRadius: 10, border: form.grade === g ? '2px solid #4F8EF7' : '1px solid rgba(255,255,255,0.15)', background: form.grade === g ? 'rgba(79,142,247,0.15)' : 'rgba(255,255,255,0.04)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
                    {g}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                {['PK', 'UAE'].map(c => (
                  <button key={c} onClick={() => setForm({ ...form, country: c })}
                    style={{ flex: 1, padding: '10px', borderRadius: 10, border: form.country === c ? '2px solid #4F8EF7' : '1px solid rgba(255,255,255,0.15)', background: form.country === c ? 'rgba(79,142,247,0.15)' : 'rgba(255,255,255,0.04)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
                    {c === 'PK' ? 'Pakistan' : 'UAE'}
                  </button>
                ))}
              </div>

              <h3 style={{ fontSize: 14, fontWeight: 800, margin: '0 0 10px' }}>Select your subjects:</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {subjects.map(s => (
                  <button key={s} onClick={() => toggleSubject(s)}
                    style={{ padding: '6px 14px', borderRadius: 8, border: selectedSubjects.includes(s) ? '2px solid #4F8EF7' : '1px solid rgba(255,255,255,0.12)', background: selectedSubjects.includes(s) ? 'rgba(79,142,247,0.15)' : 'transparent', color: selectedSubjects.includes(s) ? '#4F8EF7' : 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
                    {s}
                  </button>
                ))}
              </div>

              {error && <p style={{ color: '#FF6B6B', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}

              <button onClick={handleRegister} disabled={loading} style={{ ...S.btn, opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Registering...' : 'Register — Free'}
              </button>
            </div>
          </>
        )}

        {/* ═══ SUBJECT SELECTION (post-registration) ═══ */}
        {step === 'subjects' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h1 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 900, margin: '0 0 8px' }}>
                Choose a mock exam
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0 }}>
                Each mock is timed and marked by Starky with Cambridge examiner-level feedback.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(selectedSubjects.length > 0 ? selectedSubjects : subjects).map(s => (
                <button key={s} onClick={() => startMock(s)} disabled={loading}
                  style={{ ...S.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{s}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Timed mock · 10 questions · AI marking</div>
                  </div>
                  <span style={{ color: '#4F8EF7', fontWeight: 800, fontSize: 13 }}>Start →</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ═══ EXAM IN PROGRESS ═══ */}
        {step === 'exam' && questions.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>{mockSession?.subject}</h2>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
                  Question {currentQ + 1} of {questions.length}
                </p>
              </div>
              <div style={{ background: timeLeft < 300 ? 'rgba(255,107,107,0.15)' : 'rgba(79,142,247,0.15)', border: `1px solid ${timeLeft < 300 ? 'rgba(255,107,107,0.3)' : 'rgba(79,142,247,0.3)'}`, borderRadius: 10, padding: '8px 16px', fontWeight: 900, fontSize: 18, color: timeLeft < 300 ? '#FF6B6B' : '#4F8EF7' }}>
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 100, height: 6, marginBottom: 20, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 100, background: 'linear-gradient(90deg,#4F8EF7,#4ADE80)', width: `${((currentQ + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>

            <div style={S.card}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                {questions[currentQ]?.marks} mark{questions[currentQ]?.marks !== 1 ? 's' : ''} · {questions[currentQ]?.type === 'mcq' ? 'MCQ' : 'Structured'}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.7, marginBottom: 20 }}>
                {questions[currentQ]?.question}
              </div>

              {questions[currentQ]?.type === 'mcq' && questions[currentQ]?.options ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {questions[currentQ].options.map((opt, i) => (
                    <button key={i} onClick={() => submitAnswer(currentQ, opt)}
                      style={{ padding: '12px 16px', borderRadius: 10, border: answers[currentQ] === opt ? '2px solid #4F8EF7' : '1px solid rgba(255,255,255,0.12)', background: answers[currentQ] === opt ? 'rgba(79,142,247,0.15)' : 'rgba(255,255,255,0.04)', color: '#fff', textAlign: 'left', fontSize: 14, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
                      {String.fromCharCode(65 + i)}. {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <textarea
                    placeholder="Write your answer here..."
                    value={answers[currentQ] || ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [currentQ]: e.target.value }))}
                    style={{ ...S.input, minHeight: 120, resize: 'vertical', marginBottom: 0 }}
                  />
                  <button onClick={() => { if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1); }}
                    style={{ ...S.btn, marginTop: 12 }}>
                    {currentQ < questions.length - 1 ? 'Next Question →' : 'Review Answers'}
                  </button>
                </div>
              )}
            </div>

            {/* Question nav */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
              {questions.map((_, i) => (
                <button key={i} onClick={() => setCurrentQ(i)}
                  style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: answers[i] ? 'rgba(74,222,128,0.2)' : i === currentQ ? 'rgba(79,142,247,0.2)' : 'rgba(255,255,255,0.06)', color: answers[i] ? '#4ADE80' : '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Submit button */}
            {Object.keys(answers).length >= questions.length * 0.5 && (
              <button onClick={submitMock} disabled={loading} style={{ ...S.btn, marginTop: 20, background: 'linear-gradient(135deg,#4ADE80,#22C55E)', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Starky is marking...' : 'Submit Mock Exam'}
              </button>
            )}
          </>
        )}

        {/* ═══ RESULTS ═══ */}
        {step === 'results' && results && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
              <h1 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 900, margin: '0 0 8px' }}>
                Mock Results
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0 }}>
                {mockSession?.subject} · {form.grade}
              </p>
            </div>

            <div style={{ ...S.card, textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#4F8EF7', marginBottom: 4 }}>
                {results.score || 0}/{results.maxScore || questions.length}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: results.grade === 'A*' ? '#4ADE80' : '#FFC300', marginBottom: 8 }}>
                Predicted Grade: {results.grade || 'Pending'}
              </div>
              {results.percentile && (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                  You scored higher than {results.percentile}% of students
                </div>
              )}
            </div>

            {/* Per-question feedback */}
            {results.feedback?.map((f, i) => (
              <div key={i} style={{ ...S.card, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontWeight: 800, fontSize: 14 }}>Q{i + 1}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: f.correct ? '#4ADE80' : '#FF6B6B' }}>
                    {f.correct ? 'Correct' : 'Needs work'} · {f.marksAwarded}/{f.marksAvailable}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 4 }}>
                  {f.feedback}
                </div>
                {f.examinerTip && (
                  <div style={{ fontSize: 12, color: 'rgba(79,142,247,0.7)', fontStyle: 'italic' }}>
                    Examiner tip: {f.examinerTip}
                  </div>
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => { setStep('subjects'); setResults(null); }} style={{ ...S.btn, flex: 1 }}>
                Take another mock
              </button>
              <a href="/student-dashboard" style={{ ...S.btn, flex: 1, textAlign: 'center', textDecoration: 'none', background: 'rgba(255,255,255,0.08)' }}>
                View dashboard
              </a>
            </div>
          </>
        )}
      </div>

      <footer style={{ padding: '20px 16px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>© 2026 NewWorldEdu · newworld.education</div>
      </footer>
    </div>
  );
}
