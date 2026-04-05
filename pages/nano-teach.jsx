/**
 * pages/nano-teach.jsx — Platform Education: TEACH then TEST
 * ─────────────────────────────────────────────────────────────────
 * 4-step nano teaching flow. 3 minutes. One concept.
 * Step 1: LEARN — worked example (answer IS the lesson)
 * Step 2: GUIDED — question with hints
 * Step 3: PRACTICE — 3 questions, no hints
 * Step 4: MASTER — results + next concept
 *
 * ZERO Claude API calls. Everything from the verified bank.
 * Works even when API is completely down.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LegalFooter from '../components/LegalFooter';
import BottomNav from '../components/BottomNav';

export default function NanoTeach() {
  const router = useRouter();
  const { subject, topic, level = 'O Level' } = router.query;

  const [data, setData] = useState(null);
  const [phase, setPhase] = useState('learn'); // learn | guided | practice | master
  const [loading, setLoading] = useState(true);

  // Guided state
  const [guidedSelected, setGuidedSelected] = useState(null);
  const [guidedFeedback, setGuidedFeedback] = useState(null);
  const [showHints, setShowHints] = useState(false);

  // Practice state
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceSelected, setPracticeSelected] = useState(null);
  const [practiceFeedback, setPracticeFeedback] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!subject) return;
    setLoading(true);
    fetch(`/api/nano-teach?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic || '')}&level=${encodeURIComponent(level)}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [subject, topic, level]);

  const gradeAnswer = async (bankId, answer) => {
    const res = await fetch('/api/nano-learn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'grade', bankId, answer }),
    });
    return res.json();
  };

  const submitGuided = async () => {
    if (!guidedSelected || !data?.guidedQuestion) return;
    const fb = await gradeAnswer(data.guidedQuestion._bankId, guidedSelected);
    setGuidedFeedback(fb);
    setResults(prev => [...prev, { correct: fb.correct }]);
    // Track mastery
    fetch('/api/study-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'record', questionId: data.guidedQuestion._bankId, subject, level, topic: data.guidedQuestion.topic || topic, correct: fb.correct })
    }).catch(() => {});
  };

  const submitPractice = async () => {
    if (!practiceSelected || !data?.practiceQuestions?.[practiceIdx]) return;
    const q = data.practiceQuestions[practiceIdx];
    const fb = await gradeAnswer(q._bankId, practiceSelected);
    setPracticeFeedback(fb);
    setResults(prev => [...prev, { correct: fb.correct }]);
    fetch('/api/study-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'record', questionId: q._bankId, subject, level, topic: q.topic || topic, correct: fb.correct })
    }).catch(() => {});
  };

  const nextPractice = () => {
    setPracticeSelected(null);
    setPracticeFeedback(null);
    if (practiceIdx < (data?.practiceQuestions?.length || 0) - 1) {
      setPracticeIdx(practiceIdx + 1);
    } else {
      setPhase('master');
    }
  };

  const correctCount = results.filter(r => r.correct).length;
  const totalAnswered = results.length;
  const pct = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px 80px', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 600, margin: '0 auto' },
    phase: (active) => ({ fontSize: 10, fontWeight: 700, letterSpacing: 2, padding: '4px 10px', borderRadius: 6, display: 'inline-block', marginBottom: 16,
      background: active ? 'rgba(79,142,247,.15)' : 'rgba(255,255,255,.04)', color: active ? '#4F8EF7' : 'rgba(255,255,255,.25)' }),
    card: { background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 14, padding: '20px 18px', marginBottom: 16 },
    greenCard: { background: 'rgba(74,222,128,.06)', border: '1px solid rgba(74,222,128,.2)', borderRadius: 14, padding: '20px 18px', marginBottom: 16 },
    btn: (active) => ({ width: '100%', padding: 16, borderRadius: 12, border: 'none', background: active ? '#4F8EF7' : 'rgba(255,255,255,.06)', color: '#fff', fontSize: 16, fontWeight: 800, cursor: active ? 'pointer' : 'default', opacity: active ? 1 : 0.4 }),
  };

  if (loading) return <div style={S.page}><div style={S.container}><div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,.4)' }}>Loading lesson...</div></div></div>;
  if (!data || data.error) return (
    <div style={S.page}><div style={S.container}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No lessons available for this topic yet</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 20 }}>We're building the bank. Try another topic.</div>
        <button onClick={() => router.push('/learn')} style={{ background: '#4F8EF7', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}>Go to Today's Plan</button>
      </div>
    </div></div>
  );

  const we = data.workedExample;
  const gq = data.guidedQuestion;
  const pq = data.practiceQuestions?.[practiceIdx];

  return (
    <>
      <Head><title>{topic || subject} — Learn | NewWorld Education</title></Head>
      <div style={S.page}>
        <div style={S.container}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#4F8EF7', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>← Back</button>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{subject}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{topic || 'General'}</div>
            </div>
          </div>

          {/* Phase indicators */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
            {['LEARN', 'GUIDED', 'PRACTICE', 'MASTER'].map((p, i) => (
              <span key={p} style={S.phase(phase === p.toLowerCase())}>{p}</span>
            ))}
          </div>

          {/* ═══ STEP 1: LEARN — Worked Example ═══ */}
          {phase === 'learn' && we && (
            <>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#4ADE80', letterSpacing: 1, marginBottom: 12 }}>📖 LEARN — Study this worked example</div>

              {/* The question */}
              <div style={S.card}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginBottom: 8 }}>QUESTION</div>
                <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.6 }}>{we.question}</div>
                {we.image_url && !we.image_url.startsWith('vision_desc:') && (
                  <img src={we.image_url} alt="Diagram" style={{ width: '100%', maxHeight: 250, objectFit: 'contain', marginTop: 12, borderRadius: 8, background: '#fff' }} />
                )}
              </div>

              {/* The answer — THIS IS THE LESSON */}
              <div style={S.greenCard}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#4ADE80', letterSpacing: 1, marginBottom: 8 }}>✅ CORRECT ANSWER — What the examiner expects</div>
                {we.options && we.correctOption && (
                  <div style={{ marginBottom: 12 }}>
                    {Object.entries(we.options).map(([key, val]) => (
                      <div key={key} style={{
                        padding: '10px 14px', marginBottom: 4, borderRadius: 8,
                        background: key === we.correctOption ? 'rgba(74,222,128,.15)' : 'rgba(255,255,255,.03)',
                        border: `1px solid ${key === we.correctOption ? 'rgba(74,222,128,.4)' : 'rgba(255,255,255,.06)'}`,
                        color: key === we.correctOption ? '#4ADE80' : 'rgba(255,255,255,.5)',
                        fontWeight: key === we.correctOption ? 700 : 400,
                      }}>
                        <strong>{key}.</strong> {val} {key === we.correctOption && ' ✓'}
                      </div>
                    ))}
                  </div>
                )}
                {we.markScheme && (
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.7, padding: '12px 0', borderTop: '1px solid rgba(74,222,128,.15)' }}>
                    <strong style={{ color: '#4ADE80' }}>Mark scheme:</strong> {we.markScheme}
                  </div>
                )}
              </div>

              {/* Key takeaway */}
              <div style={{ background: 'rgba(79,142,247,.08)', border: '1px solid rgba(79,142,247,.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4F8EF7', marginBottom: 4 }}>💡 KEY TAKEAWAY</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)' }}>
                  Study the correct answer above. Notice the exact words used. The examiner awards marks for specific phrases, not general understanding.
                </div>
              </div>

              <button onClick={() => setPhase('guided')} style={S.btn(true)}>
                I understand — test me →
              </button>
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <a href={`/?message=${encodeURIComponent(`I'm learning ${topic || subject} and need help understanding: ${we?.question?.slice(0, 80)}`)}&subject=${encodeURIComponent(subject)}&from=nano-teach&returnTo=${encodeURIComponent(router.asPath)}`}
                  style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>
                  Stuck? Ask Starky for help →
                </a>
              </div>
            </>
          )}

          {/* ═══ STEP 2: GUIDED — With Hints ═══ */}
          {phase === 'guided' && gq && (
            <>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#EAB308', letterSpacing: 1, marginBottom: 12 }}>🎯 GUIDED — Try this with help available</div>

              <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.6, marginBottom: 16 }}>{gq.question}</div>

              {/* Hint toggle */}
              {!guidedFeedback && (
                <button onClick={() => setShowHints(!showHints)} style={{ background: 'rgba(234,179,8,.1)', border: '1px solid rgba(234,179,8,.3)', borderRadius: 8, padding: '8px 14px', color: '#EAB308', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginBottom: 12, display: 'block' }}>
                  {showHints ? '🔒 Hide Hints' : '💡 Show Hints'}
                </button>
              )}
              {showHints && !guidedFeedback && gq.hints && (
                <div style={{ background: 'rgba(234,179,8,.06)', border: '1px solid rgba(234,179,8,.15)', borderRadius: 10, padding: 14, marginBottom: 12 }}>
                  {gq.hints.map((h, i) => <div key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginBottom: 4 }}>💡 {h}</div>)}
                </div>
              )}

              {/* Options */}
              {gq.options && !guidedFeedback && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {Object.entries(gq.options).map(([key, val]) => (
                    <button key={key} onClick={() => setGuidedSelected(key)} style={{
                      background: guidedSelected === key ? 'rgba(79,142,247,.15)' : 'rgba(255,255,255,.04)',
                      border: `1px solid ${guidedSelected === key ? 'rgba(79,142,247,.5)' : 'rgba(255,255,255,.08)'}`,
                      borderRadius: 12, padding: '14px 18px', cursor: 'pointer', color: guidedSelected === key ? '#4F8EF7' : 'rgba(255,255,255,.7)',
                      fontSize: 15, textAlign: 'left', display: 'flex', gap: 10,
                    }}>
                      <strong style={{ minWidth: 20 }}>{key}.</strong><span>{val}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* After feedback */}
              {guidedFeedback && gq.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {Object.entries(gq.options).map(([key, val]) => {
                    const correctKey = (guidedFeedback.correctAnswer || '').charAt(0);
                    const isCorrect = key === correctKey;
                    const isSelected = key === guidedSelected;
                    return (
                      <div key={key} style={{
                        background: isCorrect ? 'rgba(74,222,128,.1)' : isSelected && !isCorrect ? 'rgba(248,113,113,.1)' : 'rgba(255,255,255,.03)',
                        border: `1px solid ${isCorrect ? 'rgba(74,222,128,.35)' : isSelected && !isCorrect ? 'rgba(248,113,113,.35)' : 'rgba(255,255,255,.06)'}`,
                        borderRadius: 12, padding: '14px 18px', color: isCorrect ? '#4ADE80' : isSelected && !isCorrect ? '#F87171' : 'rgba(255,255,255,.4)',
                        fontSize: 15, display: 'flex', gap: 10,
                      }}>
                        <strong style={{ minWidth: 20 }}>{key}.</strong><span>{val}</span>
                        {isCorrect && <span style={{ marginLeft: 'auto' }}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              )}

              {guidedFeedback && (
                <div style={{ ...S.card, borderColor: guidedFeedback.correct ? 'rgba(74,222,128,.25)' : 'rgba(248,113,113,.25)', background: guidedFeedback.correct ? 'rgba(74,222,128,.06)' : 'rgba(248,113,113,.06)' }}>
                  <div style={{ fontWeight: 700, color: guidedFeedback.correct ? '#4ADE80' : '#F87171', marginBottom: 4 }}>
                    {guidedFeedback.correct ? '✅ Correct!' : '❌ Not quite — study the answer above'}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>{guidedFeedback.feedback}</div>
                </div>
              )}

              {!guidedFeedback ? (
                <button onClick={submitGuided} disabled={!guidedSelected} style={S.btn(!!guidedSelected)}>Submit Answer</button>
              ) : (
                <button onClick={() => { setPhase('practice'); setPracticeIdx(0); }} style={S.btn(true)}>Continue to Practice →</button>
              )}
              {!guidedFeedback && (
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <a href={`/?message=${encodeURIComponent(`I'm stuck on this ${topic || subject} question: ${gq?.question?.slice(0, 80)}`)}&subject=${encodeURIComponent(subject)}&from=nano-teach&returnTo=${encodeURIComponent(router.asPath)}`}
                    style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>
                    Stuck? Ask Starky →
                  </a>
                </div>
              )}
            </>
          )}

          {/* ═══ STEP 3: PRACTICE — No hints ═══ */}
          {phase === 'practice' && pq && (
            <>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#F97316', letterSpacing: 1, marginBottom: 12 }}>⚡ PRACTICE — No hints. You've got this.</div>

              {/* Progress */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {(data.practiceQuestions || []).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 2,
                    background: i < practiceIdx ? (results[i + 1]?.correct ? '#4ADE80' : '#EF4444') : i === practiceIdx ? '#F97316' : 'rgba(255,255,255,.1)' }} />
                ))}
              </div>

              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginBottom: 8 }}>Question {practiceIdx + 1}/{data.practiceQuestions?.length || 0}</div>
              <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.6, marginBottom: 16 }}>{pq.question}</div>

              {pq.options && !practiceFeedback && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {Object.entries(pq.options).map(([key, val]) => (
                    <button key={key} onClick={() => setPracticeSelected(key)} style={{
                      background: practiceSelected === key ? 'rgba(249,115,22,.15)' : 'rgba(255,255,255,.04)',
                      border: `1px solid ${practiceSelected === key ? 'rgba(249,115,22,.5)' : 'rgba(255,255,255,.08)'}`,
                      borderRadius: 12, padding: '14px 18px', cursor: 'pointer', color: practiceSelected === key ? '#F97316' : 'rgba(255,255,255,.7)',
                      fontSize: 15, textAlign: 'left', display: 'flex', gap: 10,
                    }}>
                      <strong style={{ minWidth: 20 }}>{key}.</strong><span>{val}</span>
                    </button>
                  ))}
                </div>
              )}

              {practiceFeedback && pq.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {Object.entries(pq.options).map(([key, val]) => {
                    const correctKey = (practiceFeedback.correctAnswer || '').charAt(0);
                    const isCorrect = key === correctKey;
                    const isSelected = key === practiceSelected;
                    return (
                      <div key={key} style={{
                        background: isCorrect ? 'rgba(74,222,128,.1)' : isSelected && !isCorrect ? 'rgba(248,113,113,.1)' : 'rgba(255,255,255,.03)',
                        border: `1px solid ${isCorrect ? 'rgba(74,222,128,.35)' : isSelected && !isCorrect ? 'rgba(248,113,113,.35)' : 'rgba(255,255,255,.06)'}`,
                        borderRadius: 12, padding: '14px 18px', fontSize: 15, display: 'flex', gap: 10,
                        color: isCorrect ? '#4ADE80' : isSelected && !isCorrect ? '#F87171' : 'rgba(255,255,255,.4)',
                      }}>
                        <strong style={{ minWidth: 20 }}>{key}.</strong><span>{val}</span>
                        {isCorrect && <span style={{ marginLeft: 'auto' }}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              )}

              {practiceFeedback && (
                <div style={{ ...S.card, borderColor: practiceFeedback.correct ? 'rgba(74,222,128,.25)' : 'rgba(248,113,113,.25)', background: practiceFeedback.correct ? 'rgba(74,222,128,.06)' : 'rgba(248,113,113,.06)', marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, color: practiceFeedback.correct ? '#4ADE80' : '#F87171' }}>
                    {practiceFeedback.correct ? '✅ Correct!' : '❌ Not quite'}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', marginTop: 4 }}>{practiceFeedback.feedback}</div>
                </div>
              )}

              {!practiceFeedback ? (
                <button onClick={submitPractice} disabled={!practiceSelected} style={S.btn(!!practiceSelected)}>Submit</button>
              ) : (
                <button onClick={nextPractice} style={S.btn(true)}>
                  {practiceIdx < (data.practiceQuestions?.length || 0) - 1 ? 'Next →' : 'See Results'}
                </button>
              )}
            </>
          )}

          {/* ═══ STEP 4: MASTER — Results ═══ */}
          {phase === 'master' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>{pct >= 75 ? '🌟' : pct >= 50 ? '💪' : '⭐'}</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: pct >= 75 ? '#4ADE80' : pct >= 50 ? '#EAB308' : '#F97316', marginBottom: 8 }}>
                {correctCount}/{totalAnswered}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                {pct >= 75 ? 'Concept mastered!' : pct >= 50 ? 'Getting there!' : 'Let\'s reinforce this'}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 24 }}>
                {topic || subject}
              </div>

              {/* What you learned */}
              <div style={{ ...S.greenCard, textAlign: 'left' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#4ADE80', marginBottom: 8 }}>✅ YOU LEARNED</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,.6)' }}>
                  {we?.markScheme ? `Key answer: ${we.markScheme.slice(0, 150)}` : `Topic: ${topic || subject}`}
                </div>
              </div>

              {/* Share */}
              <div style={{ marginBottom: 24 }}>
                <a href={`https://wa.me/?text=${encodeURIComponent(`📚 I just learned ${topic || subject} and scored ${correctCount}/${totalAnswered} on NewWorldEdu!\n\nhttps://www.newworld.education/nano-teach?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic || '')}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  💬 Challenge a Friend
                </a>
              </div>

              {/* Next actions */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                {pct >= 75 && data.nextTopic ? (
                  <button onClick={() => router.push(`/nano-teach?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(data.nextTopic)}&level=${encodeURIComponent(level)}`)}
                    style={{ background: '#4F8EF7', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    Next: {data.nextTopic} →
                  </button>
                ) : (
                  <button onClick={() => { setPhase('learn'); setResults([]); setGuidedSelected(null); setGuidedFeedback(null); setPracticeIdx(0); setPracticeSelected(null); setPracticeFeedback(null); setShowHints(false); }}
                    style={{ background: '#F97316', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    Retry This Topic
                  </button>
                )}
                <button onClick={() => router.push('/learn')}
                  style={{ background: 'rgba(255,255,255,.06)', color: '#fff', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '12px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  Today's Plan
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      <LegalFooter />
      <BottomNav />
    </>
  );
}
