/**
 * pages/nano-learn.jsx — Bank-First Nano Learning
 * ─────────────────────────────────────────────────────────────────
 * Sequential learning from the verified bank. NO chatbot. NO API calls.
 * 5 questions at a time. Master one concept before moving to next.
 * Works even when Claude API is down.
 *
 * URL: /nano-learn?subject=Mathematics&topic=Compound+Interest&level=O+Level
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LegalFooter from '../components/LegalFooter';
import BottomNav from '../components/BottomNav';

const MASTERY_MESSAGES = [
  { min: 100, emoji: '🌟', title: 'Perfect!', body: 'You\'ve mastered this concept. Moving to the next one.' },
  { min: 80, emoji: '🔥', title: 'Almost there!', body: 'One more round and you\'ll have it.' },
  { min: 60, emoji: '💪', title: 'Good effort!', body: 'Keep practising — you\'re building real understanding.' },
  { min: 0, emoji: '⭐', title: 'Keep going!', body: 'Every question you practise strengthens your brain.' },
];

export default function NanoLearn() {
  const router = useRouter();
  const { subject, topic, level = 'O Level', goalId } = router.query;

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [phase, setPhase] = useState('learning'); // learning | summary
  const [answeredIds, setAnsweredIds] = useState([]);

  // Load questions from bank
  useEffect(() => {
    if (!subject) return;
    setLoading(true);
    fetch(`/api/nano-learn?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic || '')}&level=${encodeURIComponent(level)}&count=5&excludeIds=${answeredIds.join(',')}`)
      .then(r => r.json())
      .then(data => {
        setQuestions(data.questions || []);
        setCurrent(0);
        setSelected(null);
        setFeedback(null);
        setResults([]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [subject, topic, level]);

  const q = questions[current];
  const totalQ = questions.length;

  const submitAnswer = async () => {
    if (!selected || !q || grading) return;
    setGrading(true);

    try {
      const res = await fetch('/api/nano-learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'grade', bankId: q._bankId, answer: selected }),
      });
      const data = await res.json();
      setFeedback(data);
      setResults(prev => [...prev, { correct: data.correct, question: q.question }]);
      setAnsweredIds(prev => [...prev, q._bankId]);

      // Track mastery
      fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'record', questionId: q._bankId, subject, level, topic: q.topic || topic, correct: data.correct }),
      }).catch(() => {});
    } catch {
      setFeedback({ correct: null, feedback: 'Could not verify. Try again.' });
    }
    setGrading(false);
  };

  const nextQuestion = () => {
    setSelected(null);
    setFeedback(null);
    if (current < totalQ - 1) {
      setCurrent(current + 1);
    } else {
      setPhase('summary');
    }
  };

  const loadMore = () => {
    setPhase('learning');
    setLoading(true);
    fetch(`/api/nano-learn?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic || '')}&level=${encodeURIComponent(level)}&count=5&excludeIds=${answeredIds.join(',')}`)
      .then(r => r.json())
      .then(data => {
        setQuestions(data.questions || []);
        setCurrent(0);
        setSelected(null);
        setFeedback(null);
        setResults([]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const correctCount = results.filter(r => r.correct).length;
  const pct = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;
  const masteryMsg = MASTERY_MESSAGES.find(m => pct >= m.min);

  return (
    <>
      <Head>
        <title>{topic || subject || 'Nano Learning'} — NewWorld Education</title>
      </Head>

      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px 80px', fontFamily: "'Sora',-apple-system,sans-serif" }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#4F8EF7', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>← Back</button>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{subject}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{topic || 'General'} · {level}</div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,.4)' }}>
              Loading questions from the bank...
            </div>
          )}

          {/* No questions */}
          {!loading && questions.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No verified questions available yet</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 20 }}>We're building the bank for this topic. Try another subject or topic.</div>
              <button onClick={() => router.push('/drill')} style={{ background: '#4F8EF7', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}>Try Practice Drill →</button>
            </div>
          )}

          {/* Learning Phase */}
          {phase === 'learning' && !loading && q && (
            <>
              {/* Progress bar */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                {questions.map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 4, borderRadius: 2,
                    background: i < current ? (results[i]?.correct ? '#4ADE80' : '#EF4444')
                      : i === current ? '#4F8EF7'
                      : 'rgba(255,255,255,.1)',
                  }} />
                ))}
              </div>

              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginBottom: 8 }}>
                Question {current + 1}/{totalQ} · {q.topic || topic}
              </div>

              {/* Question */}
              <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.6, marginBottom: 20 }}>
                {q.question}
              </div>

              {/* Image if available */}
              {q.image_url && !q.image_url.startsWith('vision_desc:') && (
                <div style={{ marginBottom: 16, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,.1)', background: '#fff' }}>
                  <img src={q.image_url} alt="Question diagram" style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }} loading="lazy" />
                </div>
              )}

              {/* MCQ Options */}
              {q.options && !feedback && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Object.entries(q.options).map(([key, val]) => (
                    <button key={key} onClick={() => setSelected(key)}
                      style={{
                        background: selected === key ? 'rgba(79,142,247,.15)' : 'rgba(255,255,255,.04)',
                        border: `1px solid ${selected === key ? 'rgba(79,142,247,.5)' : 'rgba(255,255,255,.08)'}`,
                        borderRadius: 12, padding: '14px 18px', cursor: 'pointer',
                        color: selected === key ? '#4F8EF7' : 'rgba(255,255,255,.7)',
                        fontSize: 15, textAlign: 'left', display: 'flex', gap: 10,
                      }}>
                      <strong style={{ minWidth: 20 }}>{key}.</strong>
                      <span>{val}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* After feedback — show correct/wrong */}
              {q.options && feedback && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Object.entries(q.options).map(([key, val]) => {
                    const correctKey = (feedback.correctAnswer || '').charAt(0);
                    const isCorrect = key === correctKey;
                    const isSelected = key === selected;
                    let bg = 'rgba(255,255,255,.03)', border = 'rgba(255,255,255,.06)', color = 'rgba(255,255,255,.4)';
                    if (isCorrect) { bg = 'rgba(74,222,128,.1)'; border = 'rgba(74,222,128,.35)'; color = '#4ADE80'; }
                    if (isSelected && !isCorrect) { bg = 'rgba(248,113,113,.1)'; border = 'rgba(248,113,113,.35)'; color = '#F87171'; }
                    return (
                      <div key={key} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: '14px 18px', color, fontSize: 15, display: 'flex', gap: 10 }}>
                        <strong style={{ minWidth: 20 }}>{key}.</strong>
                        <span>{val}</span>
                        {isCorrect && <span style={{ marginLeft: 'auto' }}>✓</span>}
                        {isSelected && !isCorrect && <span style={{ marginLeft: 'auto' }}>✗</span>}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div style={{
                  marginTop: 16, padding: 16, borderRadius: 12,
                  background: feedback.correct ? 'rgba(74,222,128,.08)' : 'rgba(248,113,113,.08)',
                  border: `1px solid ${feedback.correct ? 'rgba(74,222,128,.25)' : 'rgba(248,113,113,.25)'}`,
                }}>
                  <div style={{ fontWeight: 700, color: feedback.correct ? '#4ADE80' : '#F87171', marginBottom: 4 }}>
                    {feedback.correct ? '✅ Correct!' : '❌ Not quite'}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>{feedback.feedback}</div>
                  {feedback.markSchemeHint && !feedback.correct && (
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 8, fontStyle: 'italic' }}>
                      Mark scheme: {feedback.markSchemeHint}
                    </div>
                  )}
                </div>
              )}

              {/* Submit / Next button */}
              <div style={{ marginTop: 20 }}>
                {!feedback ? (
                  <button onClick={submitAnswer} disabled={!selected || grading}
                    style={{
                      width: '100%', padding: 16, borderRadius: 12, border: 'none',
                      background: selected ? '#4F8EF7' : 'rgba(255,255,255,.06)',
                      color: '#fff', fontSize: 16, fontWeight: 800, cursor: selected ? 'pointer' : 'default',
                      opacity: selected ? 1 : 0.4,
                    }}>
                    {grading ? 'Checking...' : 'Submit Answer'}
                  </button>
                ) : (
                  <button onClick={nextQuestion}
                    style={{
                      width: '100%', padding: 16, borderRadius: 12, border: 'none',
                      background: '#4F8EF7', color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer',
                    }}>
                    {current < totalQ - 1 ? 'Next Question →' : 'See Results'}
                  </button>
                )}
              </div>
            </>
          )}

          {/* Summary Phase */}
          {phase === 'summary' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>{masteryMsg?.emoji}</div>
              <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>{masteryMsg?.title}</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: pct >= 80 ? '#4ADE80' : pct >= 60 ? '#EAB308' : '#F97316', marginBottom: 8 }}>
                {correctCount}/{results.length}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', marginBottom: 24 }}>{masteryMsg?.body}</div>

              {/* Results breakdown */}
              <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 14, padding: 16, marginBottom: 24, textAlign: 'left' }}>
                {results.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < results.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
                    <span style={{ fontSize: 18 }}>{r.correct ? '✅' : '❌'}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', flex: 1 }}>{r.question?.slice(0, 60)}...</span>
                  </div>
                ))}
              </div>

              {/* Share score */}
              <div style={{ marginBottom: 24 }}>
                <a href={`https://wa.me/?text=${encodeURIComponent(`🎯 I just scored ${correctCount}/${results.length} on ${subject} (${topic || 'General'}) at NewWorldEdu!\n\nTry it free: https://www.newworld.education/nano-learn?subject=${encodeURIComponent(subject)}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  💬 Challenge a Friend
                </a>
              </div>

              {/* Next actions */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={loadMore}
                  style={{ background: '#4F8EF7', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  Practice More →
                </button>
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
