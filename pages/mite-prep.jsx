/**
 * pages/mite-prep.jsx — MiTE Entrance Test Prep
 * ─────────────────────────────────────────────────────────────────
 * AI-powered preparation for BBA and BS-CS admission tests.
 * Practice questions, timed tests, score tracking.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LegalFooter from '../components/LegalFooter';

const GOLD = '#C9A84C';

const PROGRAMS = [
  {
    id: 'bba', name: 'BBA', icon: '💼', color: '#4F8EF7',
    desc: 'Business Administration Entrance',
    sections: [
      { id: 'verbal', name: 'Verbal Reasoning', topics: ['Reading Comprehension', 'Sentence Completion', 'Vocabulary', 'Critical Reasoning', 'Analogies'] },
      { id: 'quant', name: 'Quantitative Aptitude', topics: ['Percentages & Ratios', 'Algebra', 'Data Interpretation', 'Arithmetic', 'Geometry Basics'] },
      { id: 'logical', name: 'Logical Reasoning', topics: ['Pattern Recognition', 'Syllogisms', 'Coding-Decoding', 'Blood Relations', 'Seating Arrangements'] },
      { id: 'gk', name: 'General Knowledge', topics: ['Pakistan Current Affairs', 'Business & Economics', 'World Affairs', 'Science & Technology'] },
    ],
  },
  {
    id: 'bscs', name: 'BSCS', icon: '💻', color: '#4ADE80',
    desc: 'Computer Science Entrance',
    sections: [
      { id: 'math', name: 'Mathematics', topics: ['Algebra & Functions', 'Calculus Basics', 'Discrete Mathematics', 'Probability & Statistics', 'Matrices'] },
      { id: 'logic', name: 'Logical & Analytical', topics: ['Algorithm Thinking', 'Pattern Recognition', 'Number Series', 'Data Structures Concepts', 'Boolean Logic'] },
      { id: 'cs', name: 'Computer Fundamentals', topics: ['Binary & Hexadecimal', 'Programming Concepts', 'Databases', 'Networking Basics', 'OS Concepts'] },
      { id: 'english', name: 'English Proficiency', topics: ['Comprehension', 'Grammar', 'Vocabulary', 'Essay Writing'] },
    ],
  },
];

export default function MiTEPrep() {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState('select'); // select | practice | results

  // Serve questions from verified bank
  const startPractice = async (program, section) => {
    setSelectedProgram(program);
    setSelectedSection(section);
    setLoading(true);
    setPhase('practice');
    setScore({ correct: 0, total: 0 });
    setCurrentQ(0);

    try {
      // Fetch 5 questions from the verified bank — try mite first, then cambridge
      const fetched = [];
      const excludeIds = [];
      for (let i = 0; i < 5; i++) {
        // Try mite curriculum first
        let res = await fetch('/api/question-bank/serve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: program.id === 'bscs' ? 'Computer Science' : section.name,
            level: program.id === 'bscs' ? 'O Level' : 'University',
            type: 'mcq',
            curriculum: program.id === 'bscs' ? 'cambridge' : 'mite',
            excludeIds,
          }),
        });
        let data = await res.json();
        if (data.question && data.options) {
          fetched.push({
            question: data.question,
            options: data.options,
            correct: data.correctOption || data.correct,
            explanation: data.markSchemeHint || data.explanation || '',
            _bankId: data._bankId,
          });
          if (data._bankId) excludeIds.push(data._bankId);
        }
      }
      setQuestions(fetched.length > 0 ? fetched : []);
    } catch {
      setQuestions([]);
    }
    setLoading(false);
  };

  const submitAnswer = () => {
    if (!selected || revealed) return;
    setRevealed(true);
    const isCorrect = selected === questions[currentQ]?.correct;
    setScore(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
  };

  const nextQuestion = () => {
    if (currentQ >= questions.length - 1) {
      setPhase('results');
      return;
    }
    setCurrentQ(prev => prev + 1);
    setSelected(null);
    setRevealed(false);
  };

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px 40px', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 600, margin: '0 auto' },
    card: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '20px 18px', marginBottom: 12 },
  };

  return (
    <>
      <Head>
        <title>MiTE Entrance Test Prep | NewWorldEdu</title>
        <meta name="description" content="MiTE Entrance Test Preparation — practice questions, mock tests, and study plans." />
      </Head>
      <div style={S.page}>
        <div style={S.container}>

          <button onClick={() => phase === 'select' ? router.push('/mite') : setPhase('select')}
            style={{ background: 'none', border: 'none', color: '#4F8EF7', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>← Back</button>

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 8 }}>MiTE ENTRANCE TEST PREP</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>
              {phase === 'select' ? 'Choose Your Program' : selectedProgram?.name + ' — ' + selectedSection?.name}
            </h1>
          </div>

          {/* Program Selection */}
          {phase === 'select' && (
            <>
              {PROGRAMS.map(prog => (
                <div key={prog.id} style={{ ...S.card, borderColor: `${prog.color}33` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 28 }}>{prog.icon}</span>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: prog.color }}>{prog.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>{prog.desc}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {prog.sections.map(sec => (
                      <button key={sec.id} onClick={() => startPractice(prog, sec)}
                        style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                          background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', color: '#fff', fontSize: 13, fontWeight: 600 }}
                        onMouseOver={e => e.currentTarget.style.borderColor = prog.color}
                        onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)'}>
                        {sec.name}
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginTop: 2 }}>{sec.topics.length} topics</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Loading */}
          {phase === 'practice' && loading && (
            <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,.4)' }}>
              Loading {selectedProgram?.name} questions from verified bank...
            </div>
          )}

          {/* Practice */}
          {phase === 'practice' && !loading && questions.length > 0 && (
            <>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginBottom: 8 }}>
                Question {currentQ + 1} of {questions.length} · Score: {score.correct}/{score.total}
              </div>

              <div style={S.card}>
                <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.7, marginBottom: 16, color: '#FAF6EB' }}>
                  {questions[currentQ]?.question}
                </div>

                {Object.entries(questions[currentQ]?.options || {}).map(([key, val]) => {
                  let bg = 'rgba(255,255,255,.03)';
                  let border = '1px solid rgba(255,255,255,.06)';
                  let color = 'rgba(255,255,255,.7)';

                  if (revealed) {
                    if (key === questions[currentQ]?.correct) { bg = 'rgba(74,222,128,.1)'; border = '1px solid rgba(74,222,128,.3)'; color = '#4ADE80'; }
                    else if (key === selected) { bg = 'rgba(239,68,68,.1)'; border = '1px solid rgba(239,68,68,.3)'; color = '#EF4444'; }
                  } else if (key === selected) {
                    bg = 'rgba(79,142,247,.1)'; border = '1px solid rgba(79,142,247,.3)'; color = '#4F8EF7';
                  }

                  return (
                    <button key={key} onClick={() => !revealed && setSelected(key)}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 10, marginBottom: 6, textAlign: 'left',
                        background: bg, border, color, fontSize: 14, cursor: revealed ? 'default' : 'pointer', fontWeight: key === selected ? 700 : 400 }}>
                      {key}) {val}
                    </button>
                  );
                })}

                {revealed && questions[currentQ]?.explanation && (
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', marginTop: 8, padding: '8px 12px', background: 'rgba(255,255,255,.02)', borderRadius: 8, lineHeight: 1.6 }}>
                    {questions[currentQ].explanation}
                  </div>
                )}
              </div>

              {!revealed && (
                <button onClick={submitAnswer} disabled={!selected}
                  style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: selected ? '#4F8EF7' : 'rgba(255,255,255,.06)', color: '#fff', fontSize: 15, fontWeight: 800, cursor: selected ? 'pointer' : 'default', opacity: selected ? 1 : 0.4 }}>
                  Submit Answer
                </button>
              )}

              {revealed && (
                <button onClick={nextQuestion}
                  style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: GOLD, color: '#0a0a0a', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
                  {currentQ >= questions.length - 1 ? 'See Results' : 'Next Question →'}
                </button>
              )}
            </>
          )}

          {/* Results */}
          {phase === 'results' && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{score.correct === score.total ? '🎉' : score.correct >= score.total / 2 ? '👍' : '📚'}</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: score.correct === score.total ? '#4ADE80' : score.correct >= score.total / 2 ? GOLD : '#EF4444' }}>
                {score.correct}/{score.total}
              </div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', marginBottom: 24 }}>
                {score.correct === score.total ? 'Perfect! You\'re ready.' : score.correct >= score.total / 2 ? 'Good — keep practicing.' : 'More practice needed.'}
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => startPractice(selectedProgram, selectedSection)}
                  style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: '#4F8EF7', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                  Practice Again
                </button>
                <button onClick={() => setPhase('select')}
                  style={{ padding: '12px 24px', borderRadius: 10, border: '1px solid rgba(255,255,255,.1)', background: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                  Try Another Section
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                <a href="/mite-study" style={{ fontSize: 12, color: '#4F8EF7', textDecoration: 'none', fontWeight: 700 }}>📚 Go to Course Study</a>
                <span style={{ color: 'rgba(255,255,255,.15)' }}>·</span>
                <a href="/mite-portal" style={{ fontSize: 12, color: '#C9A84C', textDecoration: 'none', fontWeight: 700 }}>🏠 Back to Portal</a>
              </div>
            </div>
          )}

        </div>
      </div>
      <LegalFooter />
    </>
  );
}
