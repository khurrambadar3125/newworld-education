/**
 * pages/daily-challenge.jsx — Wordle-style Daily Challenge
 * ─────────────────────────────────────────────────────────────────
 * Same 5 questions for ALL users every day. No login required.
 * Share your score → friend clicks → tries same questions → subscribes.
 * The Wordle effect: everyone solving the same puzzle = conversation.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import LegalFooter from '../components/LegalFooter';

export default function DailyChallenge() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  useEffect(() => {
    // Check if already completed today
    try {
      const saved = JSON.parse(localStorage.getItem('daily_challenge_result') || '{}');
      if (saved.date === new Date().toISOString().split('T')[0]) {
        setResult(saved);
        setAlreadyDone(true);
        setLoading(false);
        return;
      }
    } catch {}

    fetch('/api/daily-challenge')
      .then(r => r.json())
      .then(data => { setQuestions(data.questions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const selectAnswer = (key) => {
    if (result) return;
    setSelected(key);
  };

  const submitAnswer = () => {
    if (!selected) return;
    const newAnswers = [...answers, { questionId: questions[current].id, answer: selected }];
    setAnswers(newAnswers);
    setSelected(null);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // All answered — submit for scoring
      setSubmitting(true);
      fetch('/api/daily-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: newAnswers }),
      })
        .then(r => r.json())
        .then(data => {
          setResult(data);
          setSubmitting(false);
          // Save to localStorage so they can't redo
          try { localStorage.setItem('daily_challenge_result', JSON.stringify({ ...data, date: new Date().toISOString().split('T')[0] })); } catch {}
        })
        .catch(() => setSubmitting(false));
    }
  };

  const q = questions[current];

  return (
    <>
      <Head>
        <title>Daily Challenge — NewWorld Education</title>
        <meta name="description" content="5 questions. Same for everyone. How many can you get right? Share your score and challenge your friends." />
        <meta property="og:title" content="Daily Challenge — Can you get 5/5?" />
        <meta property="og:description" content="5 questions. Same for everyone today. Share your score!" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px', fontFamily: "'Sora',-apple-system,sans-serif" }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#4F8EF7', letterSpacing: 2, marginBottom: 8 }}>DAILY CHALLENGE</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px' }}>5 Questions. Same for Everyone.</h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.4)' }}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          {loading && <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,.4)' }}>Loading today's challenge...</div>}

          {/* Question */}
          {!loading && !result && q && (
            <div>
              {/* Progress dots */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
                {questions.map((_, i) => (
                  <div key={i} style={{
                    width: 12, height: 12, borderRadius: 6,
                    background: i < current ? '#4ADE80' : i === current ? '#4F8EF7' : 'rgba(255,255,255,.1)',
                    transition: 'all .3s',
                  }} />
                ))}
              </div>

              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginBottom: 8 }}>
                Question {current + 1}/5 · {q.subject} · {q.topic}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.6, marginBottom: 20 }}>
                {q.question}
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {q.options && Object.entries(q.options).map(([key, val]) => (
                  <button key={key} onClick={() => selectAnswer(key)}
                    style={{
                      background: selected === key ? 'rgba(79,142,247,.15)' : 'rgba(255,255,255,.04)',
                      border: `1px solid ${selected === key ? 'rgba(79,142,247,.5)' : 'rgba(255,255,255,.08)'}`,
                      borderRadius: 12, padding: '14px 18px', cursor: 'pointer',
                      color: selected === key ? '#4F8EF7' : 'rgba(255,255,255,.7)',
                      fontSize: 15, textAlign: 'left', display: 'flex', gap: 10,
                      WebkitTapHighlightColor: 'transparent', transition: 'all .15s',
                    }}>
                    <strong style={{ minWidth: 20, color: selected === key ? '#4F8EF7' : 'rgba(255,255,255,.3)' }}>{key}.</strong>
                    <span>{val}</span>
                  </button>
                ))}
              </div>

              <button onClick={submitAnswer} disabled={!selected}
                style={{
                  width: '100%', padding: 16, marginTop: 20,
                  background: selected ? '#4F8EF7' : 'rgba(255,255,255,.06)',
                  color: '#fff', border: 'none', borderRadius: 12,
                  fontSize: 16, fontWeight: 800, cursor: selected ? 'pointer' : 'default',
                  opacity: selected ? 1 : 0.4,
                }}>
                {current < questions.length - 1 ? 'Next Question →' : 'See My Score'}
              </button>
            </div>
          )}

          {submitting && <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,.4)' }}>Checking your answers...</div>}

          {/* Results */}
          {result && (
            <div style={{ textAlign: 'center' }}>
              {/* Emoji grid */}
              <div style={{ fontSize: 48, letterSpacing: 8, marginBottom: 16 }}>{result.emoji}</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: result.correct >= 4 ? '#4ADE80' : result.correct >= 3 ? '#EAB308' : '#F97316', marginBottom: 8 }}>
                {result.correct}/5
              </div>
              <div style={{ fontSize: 16, color: 'rgba(255,255,255,.5)', marginBottom: 32 }}>
                {result.correct === 5 ? 'Perfect! You\'re unstoppable!' : result.correct >= 4 ? 'Almost perfect! Amazing work.' : result.correct >= 3 ? 'Solid effort! Can your friends beat you?' : 'Good try! Challenge a friend to do better.'}
              </div>

              {/* Share buttons — THE VIRAL MECHANIC */}
              <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 16, padding: 24, marginBottom: 24, border: '1px solid rgba(255,255,255,.08)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.4)', marginBottom: 16 }}>CHALLENGE YOUR FRIENDS</div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href={result.whatsappLink} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 12, background: '#25D366', color: '#fff', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
                    💬 Share on WhatsApp
                  </a>
                  <a href={result.tweetLink} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 12, background: '#1DA1F2', color: '#fff', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
                    🐦 Share on X
                  </a>
                </div>
                <button onClick={() => { navigator.clipboard?.writeText(`${result.shareText}\n${result.shareUrl}`); }}
                  style={{ marginTop: 12, background: 'none', border: '1px solid rgba(255,255,255,.15)', borderRadius: 10, padding: '10px 20px', color: 'rgba(255,255,255,.5)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  📋 Copy Result
                </button>
              </div>

              {/* Come back tomorrow */}
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,.3)', marginBottom: 16 }}>
                New challenge tomorrow at midnight. Come back!
              </div>

              {/* CTA — convert to subscriber */}
              <div style={{ background: 'linear-gradient(135deg,rgba(79,142,247,.1),rgba(99,102,241,.1))', border: '1px solid rgba(79,142,247,.25)', borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Get a daily question in your inbox</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 16 }}>One Cambridge exam question every morning. Free.</div>
                <a href="/subscribe" style={{ display: 'inline-block', background: '#4F8EF7', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                  Subscribe Free →
                </a>
              </div>

              {/* Try more */}
              <div style={{ marginTop: 24, display: 'flex', gap: 10, justifyContent: 'center' }}>
                <a href="/drill" style={{ color: '#4F8EF7', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Practice Drill →</a>
                <a href="/free-practice-test" style={{ color: '#4F8EF7', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Full Practice Test →</a>
              </div>
            </div>
          )}
        </div>
      </div>
      <LegalFooter />
    </>
  );
}
