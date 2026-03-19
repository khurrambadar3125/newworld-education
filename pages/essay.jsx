/**
 * pages/essay.jsx
 * Cambridge Essay Marking — newworld.education/essay
 * O Level & A Level | Examiner marks by band descriptors
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SUBJECTS = {
  olevel: ['English Language', 'Literature in English', 'History', 'Pakistan Studies',
           'Economics', 'Business Studies', 'Geography', 'Sociology', 'Islamiyat'],
  alevel: ['English Language', 'Literature in English', 'History', 'Economics',
           'Business', 'Sociology', 'Psychology', 'Law', 'Geography'],
};

const GRADE_COLOURS = {
  'A*': '#4ADE80', A: '#4ADE80', B: '#86EFAC', C: '#FCD34D',
  D: '#FB923C', E: '#F87171', U: '#EF4444',
};

const BAND_COLOURS = {
  Excellent: '#4ADE80', Good: '#86EFAC', Satisfactory: '#FCD34D',
  Weak: '#FB923C', Poor: '#F87171',
};

function Pill({ label, colour }) {
  return (
    <span style={{ display: 'inline-block', background: `${colour}22`, border: `1px solid ${colour}55`,
      color: colour, borderRadius: 100, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>
      {label}
    </span>
  );
}

function ScoreBar({ score, max, colour }) {
  const pct = Math.round((score / max) * 100);
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11,
        color: 'rgba(255,255,255,.4)', marginBottom: 4 }}>
        <span>{score}/{max}</span><span>{pct}%</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,.07)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: colour, borderRadius: 10, transition: 'width .6s ease' }} />
      </div>
    </div>
  );
}

export default function EssayPage() {
  const [level,      setLevel]      = useState('olevel');
  const [subject,    setSubject]    = useState('');
  const [question,   setQuestion]   = useState('');
  const [essay,      setEssay]      = useState('');
  const [result,     setResult]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  // Auto-save essay to localStorage every 3 seconds
  useEffect(() => {
    if (!essay && !question) return;
    const t = setTimeout(() => {
      try { localStorage.setItem('nw_essay_draft', JSON.stringify({ essay, question, subject, level })); } catch {}
    }, 3000);
    return () => clearTimeout(t);
  }, [essay, question, subject, level]);

  // Restore draft on mount
  useEffect(() => {
    try {
      const draft = JSON.parse(localStorage.getItem('nw_essay_draft') || 'null');
      if (draft?.essay) { setEssay(draft.essay); setQuestion(draft.question || ''); setSubject(draft.subject || ''); setLevel(draft.level || 'olevel'); }
    } catch {}
  }, []);

  // Warn before leaving with unsaved essay
  useEffect(() => {
    const handler = (e) => { if (essay.length > 100 && !result) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [essay, result]);

  const handleMark = async () => {
    if (!subject)          return setError('Please select a subject.');
    if (!question.trim())  return setError('Please enter the exam question.');
    if (wordCount < 50)    return setError('Essay must be at least 50 words.');
    setError(''); setLoading(true); setResult(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const r = await fetch('/api/essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, level, question, essay }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      let data;
      try { data = await r.json(); } catch { throw new Error('Invalid response'); }
      if (!r.ok || data.error) setError(data?.error || 'Marking failed. Please try again.');
      else {
        setResult(data);
        try { localStorage.removeItem('nw_essay_draft'); } catch {}
        // Notify parent about essay result
        try {
          const u = JSON.parse(localStorage.getItem('nw_user') || '{}');
          if (u.email) {
            fetch('/api/notify-parent', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ parentEmail: u.parentEmail || u.email, studentName: u.name, type: 'essay', subject, grade: data.grade }),
            }).catch(() => {});
          }
        } catch {}
      }
    } catch (err) { setError(err?.name === 'AbortError' ? 'Marking took too long. Please try again.' : 'Connection error. Please try again.'); }
    finally { setLoading(false); }
  };

  const reset = () => { setResult(null); setEssay(''); setQuestion(''); setError(''); try { localStorage.removeItem('nw_essay_draft'); } catch {} window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const gradeColour = result ? (GRADE_COLOURS[result.grade] || '#4F8EF7') : '#4F8EF7';
  const pct = result ? Math.round((result.totalScore / result.maxScore) * 100) : 0;

  return (
    <>
      <Head>
        <title>Essay Marking ★ — NewWorldEdu</title>
        <meta name="description" content="Get your essay marked using Cambridge band descriptors. O Level and A Level essay grading with examiner feedback, model answers, and improvement tips." />
        <meta property="og:title" content="Essay Marking — Cambridge Band Descriptors" />
        <meta property="og:description" content="Get your essay marked using Cambridge band descriptors. O Level and A Level essay grading with examiner feedback, model answers, and improvement tips." />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#080C18', color: '#fff',
        fontFamily: "-apple-system,BlinkMacSystemFont,'Inter',sans-serif", paddingBottom: 80 }}>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,.07)',
          background: 'rgba(8,12,24,.9)', position: 'sticky', top: 0, zIndex: 50, WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}>
          <Link href="/"><a style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 17,
            color: '#fff', textDecoration: 'none' }}>NewWorldEdu<span style={{ color: '#4F8EF7' }}>★</span></a></Link>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/drill"><a style={{ fontSize: 12, fontWeight: 700, color: '#4F8EF7',
              textDecoration: 'none', padding: '6px 12px', borderRadius: 8,
              background: 'rgba(79,142,247,.1)', border: '1px solid rgba(79,142,247,.2)' }}>📚 Drill</a></Link>
            <Link href="/"><a style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', textDecoration: 'none',
              padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,.05)',
              border: '1px solid rgba(255,255,255,.08)' }}>← Home</a></Link>
          </div>
        </nav>

        <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px' }}>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 26, fontWeight: 800, margin: '0 0 6px' }}>
            Essay Marking ✍️
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.4)', margin: '0 0 28px', lineHeight: 1.6 }}>
            Cambridge-style marking by band descriptors. Get examiner feedback instantly.
          </p>

          {!result ? (
            <>
              {/* Level + Subject */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {[['olevel','O Level'],['alevel','A Level']].map(([k,l]) => (
                  <button key={k} onClick={() => { setLevel(k); setSubject(''); }}
                    style={{ padding: '8px 20px', borderRadius: 100, fontSize: 13, fontWeight: 700,
                      cursor: 'pointer', border: 'none', fontFamily: 'inherit',
                      background: level === k ? 'linear-gradient(135deg,#4F8EF7,#6366F1)' : 'rgba(255,255,255,.07)',
                      color: level === k ? '#fff' : 'rgba(255,255,255,.5)' }}>{l}</button>
                ))}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.5)',
                  display: 'block', marginBottom: 8 }}>Subject</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SUBJECTS[level].map(s => (
                    <button key={s} onClick={() => setSubject(s)}
                      style={{ padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit',
                        background: subject === s ? 'rgba(167,139,250,.2)' : 'rgba(255,255,255,.05)',
                        color: subject === s ? '#A78BFA' : 'rgba(255,255,255,.5)',
                        border: `1px solid ${subject === s ? 'rgba(167,139,250,.4)' : 'rgba(255,255,255,.08)'}` }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.5)',
                  display: 'block', marginBottom: 8 }}>Exam Question</label>
                <textarea value={question} onChange={e => setQuestion(e.target.value)}
                  placeholder="Paste the essay question here..."
                  rows={3}
                  style={{ width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)',
                    borderRadius: 12, padding: '14px 16px', color: '#fff', fontSize: 16, fontFamily: 'inherit',
                    resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6, WebkitAppearance: 'none' }} />
              </div>

              {/* Essay */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.5)' }}>Your Essay</label>
                  <span style={{ fontSize: 12, color: wordCount < 50 ? '#F87171' : 'rgba(255,255,255,.35)' }}>
                    {wordCount} words {wordCount < 50 ? '(min 50)' : ''}
                  </span>
                </div>
                <textarea value={essay} onChange={e => setEssay(e.target.value)}
                  placeholder="Paste or type your essay here..."
                  rows={12}
                  style={{ width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)',
                    borderRadius: 12, padding: '14px 16px', color: '#fff', fontSize: 16, fontFamily: 'inherit',
                    resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.8, WebkitAppearance: 'none' }} />
              </div>

              {error && <div style={{ color: '#F87171', fontSize: 13, marginBottom: 12 }}>⚠️ {error}</div>}

              <button onClick={handleMark} disabled={loading}
                style={{ width: '100%', padding: '15px', borderRadius: 14, fontFamily: "'Sora',sans-serif",
                  fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', border: 'none',
                  background: loading ? 'rgba(255,255,255,.08)' : 'linear-gradient(135deg,#4F8EF7,#6366F1)',
                  color: loading ? 'rgba(255,255,255,.4)' : '#fff', transition: 'all .2s' }}>
                {loading ? '⏳ Marking your essay...' : 'Mark My Essay →'}
              </button>
            </>
          ) : (
            /* ─── Results ─── */
            <>
              {/* Score hero */}
              <div style={{ background: `linear-gradient(135deg,${gradeColour}18,${gradeColour}08)`,
                border: `1px solid ${gradeColour}35`, borderRadius: 20, padding: '28px 24px',
                marginBottom: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,.3)', marginBottom: 12 }}>
                  {subject} · {level === 'alevel' ? 'A Level' : 'O Level'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(40px, 12vw, 64px)', fontWeight: 900,
                    color: gradeColour, lineHeight: 1 }}>{result.totalScore}</span>
                  <span style={{ fontSize: 'clamp(18px, 5vw, 24px)', color: 'rgba(255,255,255,.3)' }}>/ {result.maxScore}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
                  <Pill label={`Grade ${result.grade}`} colour={gradeColour} />
                  <Pill label={result.band} colour={BAND_COLOURS[result.band] || '#4F8EF7'} />
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,.07)', borderRadius: 10,
                  overflow: 'hidden', maxWidth: 300, margin: '0 auto' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: gradeColour,
                    borderRadius: 10, transition: 'width .8s ease' }} />
                </div>
              </div>

              {/* Examiner verdict */}
              <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 16, padding: '18px 20px', marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', marginBottom: 10,
                  textTransform: 'uppercase', letterSpacing: '.08em' }}>📋 Examiner Verdict</div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,.75)', lineHeight: 1.8, margin: 0 }}>
                  {result.examinerVerdict}
                </p>
              </div>

              {/* Section breakdown */}
              <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 16, padding: '18px 20px', marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4F8EF7', marginBottom: 14,
                  textTransform: 'uppercase', letterSpacing: '.08em' }}>📊 Section Breakdown</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {result.sections?.map((sec, i) => {
                    const secPct = sec.score / sec.maxScore;
                    const secColour = secPct >= .75 ? '#4ADE80' : secPct >= .5 ? '#FCD34D' : '#F87171';
                    return (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between',
                          marginBottom: 4, alignItems: 'baseline' }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{sec.criterion}</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: secColour }}>{sec.score}/{sec.maxScore}</span>
                        </div>
                        <ScoreBar score={sec.score} max={sec.maxScore} colour={secColour} />
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', margin: '8px 0 0', lineHeight: 1.6 }}>{sec.feedback}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Model opener */}
              {result.modelOpener && (
                <div style={{ background: 'rgba(74,222,128,.07)', border: '1px solid rgba(74,222,128,.2)',
                  borderRadius: 14, padding: '16px 20px', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#4ADE80', marginBottom: 8,
                    textTransform: 'uppercase', letterSpacing: '.08em' }}>✨ Model Opening Sentence</div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.8)', fontStyle: 'italic',
                    lineHeight: 1.7, margin: 0 }}>"{result.modelOpener}"</p>
                </div>
              )}

              {/* Missing keywords */}
              {result.keywordsMissing?.length > 0 && (
                <div style={{ background: 'rgba(252,211,77,.07)', border: '1px solid rgba(252,211,77,.2)',
                  borderRadius: 14, padding: '16px 20px', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#FCD34D', marginBottom: 10,
                    textTransform: 'uppercase', letterSpacing: '.08em' }}>🔑 Missing Cambridge Keywords</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {result.keywordsMissing.map((kw, i) => (
                      <span key={i} style={{ background: 'rgba(252,211,77,.1)', border: '1px solid rgba(252,211,77,.25)',
                        color: '#FCD34D', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600 }}>{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {result.improvements?.length > 0 && (
                <div style={{ background: 'rgba(248,113,113,.07)', border: '1px solid rgba(248,113,113,.2)',
                  borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#F87171', marginBottom: 12,
                    textTransform: 'uppercase', letterSpacing: '.08em' }}>🎯 How to Improve</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {result.improvements.map((imp, i) => (
                      <div key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', lineHeight: 1.7,
                        paddingLeft: 14, borderLeft: '2px solid rgba(248,113,113,.4)' }}>{imp}</div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={reset}
                  style={{ flex: 1, padding: '13px', borderRadius: 12, fontFamily: "'Sora',sans-serif",
                    fontSize: 14, fontWeight: 800, cursor: 'pointer', border: 'none',
                    background: 'linear-gradient(135deg,#4F8EF7,#6366F1)', color: '#fff' }}>
                  Mark Another Essay
                </button>
                <Link href="/drill">
                  <a style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flex: 1, padding: '13px', borderRadius: 12, fontFamily: "'Sora',sans-serif",
                    fontSize: 14, fontWeight: 800, textDecoration: 'none',
                    background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', color: '#fff' }}>
                    📚 Drill Mode
                  </a>
                </Link>
              </div>
              <button onClick={async () => {
                const { shareLink } = await import('../utils/share');
                const r = await shareLink('essay', { subject, level, grade:result.grade, band:result.band, score:result.totalScore, maxScore:level==='olevel'?15:20 }, `I got ${result.grade} on my ${subject} essay!`);
                if (r.method === 'clipboard') alert('Link copied!');
              }} style={{ width: '100%', padding: '12px', borderRadius: 12, fontFamily: "'Sora',sans-serif",
                fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 8,
                background: 'rgba(168,224,99,.1)', border: '1px solid rgba(168,224,99,.25)', color: '#A8E063' }}>
                📤 Share Result
              </button>
              <a href="/past-papers" style={{ display:'block', textAlign:'center', padding:'12px', borderRadius:12, background:'rgba(99,210,255,0.08)', border:'1px solid rgba(99,210,255,0.2)', color:'#63D2FF', fontWeight:700, fontSize:13, textDecoration:'none', marginTop:8 }}>📚 Find more essay questions in Past Papers</a>
            </>
          )}
        </div>
      </div>
    </>
  );
}
