/**
 * pages/challenge.jsx — The Nixor Boardroom Demo
 *
 * One page. One question. Type your answer. Get marked by a Cambridge examiner in real time.
 * This is what you open on a laptop and hand to a principal.
 */

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

// Fallback challenges — used only if the question bank API fails
const FALLBACK_CHALLENGES = [
  { id: 'bio_enzyme', subject: 'Biology', level: 'O Level', commandWord: 'Explain', marks: 3, question: 'Explain why enzymes are described as specific.', hint: 'Think about shape. Think about the active site. Think about what can bind.', topic: 'Enzymes' },
  { id: 'chem_rate', subject: 'Chemistry', level: 'O Level', commandWord: 'Explain', marks: 3, question: 'Explain why increasing the temperature increases the rate of a chemical reaction.', hint: 'Three mark points: kinetic energy, collisions, activation energy.', topic: 'Rates of Reaction' },
  { id: 'phys_weight', subject: 'Physics', level: 'O Level', commandWord: 'Explain', marks: 2, question: 'Explain the difference between mass and weight.', hint: 'One is a force. One is not. Units matter.', topic: 'Forces' },
  { id: 'econ_demand', subject: 'Economics', level: 'O Level', commandWord: 'Distinguish', marks: 2, question: 'Distinguish between a change in demand and a change in quantity demanded.', hint: 'One shifts the curve. One moves along it.', topic: 'Demand' },
  { id: 'eng_analyse', subject: 'English Language', level: 'O Level', commandWord: 'Analyse', marks: 3, question: 'Analyse how the writer uses language to create a sense of danger in the following extract:\n\n"The silence pressed against him like something solid, broken only by the distant crack of splitting ice."', hint: 'Name the technique. Quote. Explain the effect on the reader.', topic: 'Language Analysis' },
  { id: 'bio_osmosis', subject: 'Biology', level: 'O Level', commandWord: 'Define', marks: 2, question: 'Define osmosis.', hint: 'Every qualifying word is a mark point. Miss one word, lose one mark.', topic: 'Osmosis' },
  { id: 'chem_ionic', subject: 'Chemistry', level: 'O Level', commandWord: 'Describe', marks: 3, question: 'Describe the formation of an ionic bond between sodium and chlorine.', hint: 'Transfer, not sharing. State what happens to the electrons. Name the ions formed.', topic: 'Chemical Bonding' },
  { id: 'phys_current', subject: 'Physics', level: 'O Level', commandWord: 'State', marks: 1, question: 'State what is meant by electric current.', hint: 'One sentence. Precise. Not "flow of electrons".', topic: 'Electricity' },
  { id: 'hist_eval', subject: 'History', level: 'O Level', commandWord: 'Evaluate', marks: 4, question: 'Evaluate the significance of the Lahore Resolution (1940) in the creation of Pakistan.', hint: 'State what it was. Explain why it mattered. Consider counter-arguments. Reach a judgement.', topic: 'Creation of Pakistan' },
  { id: 'math_show', subject: 'Mathematics', level: 'O Level', commandWord: 'Show that', marks: 3, question: 'The nth term of a sequence is 3n + 7. Show that the sum of the first 20 terms is 690.', hint: 'Do NOT start with 690. Work forward. Show every step.', topic: 'Sequences' },
];

const COMMAND_WORD_GUIDE = {
  'State': { demand: 'Give a brief, factual answer. One or two sentences maximum. No explanation needed.', markSignal: '1 mark — one fact only' },
  'Define': { demand: 'Give the precise Cambridge definition. Every qualifying word matters.', markSignal: '1-2 marks — precision is everything' },
  'Describe': { demand: 'Say WHAT happens. Step by step. Do NOT explain why.', markSignal: '2-3 marks — observable sequence' },
  'Explain': { demand: 'Say WHAT happens AND WHY. Must use "because" or "therefore". Both parts needed.', markSignal: '3-4 marks — cause and effect required' },
  'Evaluate': { demand: 'Consider arguments FOR and AGAINST. Reach a supported conclusion. Without a judgement you cannot reach the top band.', markSignal: '4-6 marks — judgement is mandatory' },
  'Analyse': { demand: 'Break down into parts. Examine each. Show HOW and WHY, with evidence.', markSignal: '3-4 marks — depth over breadth' },
  'Distinguish': { demand: 'State the difference clearly. Use comparative language (whereas, unlike, in contrast).', markSignal: '2 marks — both sides must be stated' },
  'Show that': { demand: 'Prove the given answer is correct. Do NOT use the given answer in your working — that is a circular argument and scores 0.', markSignal: '3-4 marks — independent derivation' },
  'Calculate': { demand: 'Show formula. Show substitution. Show working. Include units. Answer only = 0.', markSignal: '2-4 marks — method marks available' },
};

export default function ChallengePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [shuffled, setShuffled] = useState([]);
  const [idx, setIdx] = useState(0);
  const [mode, setMode] = useState('answer'); // answer | ask
  const [askQuestion, setAskQuestion] = useState('');
  const [askResult, setAskResult] = useState(null);
  const [askLoading, setAskLoading] = useState(false);
  const [fromDeck, setFromDeck] = useState(false);
  const answerRef = useRef(null);
  const questionRef = useRef(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn(); window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    // Try loading verified questions from the bank first
    async function loadChallenges() {
      try {
        const res = await fetch('/api/question-bank/serve-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ level: 'O Level', limit: 10 }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.questions?.length >= 5) {
            const bankChallenges = data.questions.map((q, i) => ({
              id: q._bankId || `bank_${i}`,
              subject: q.subject || 'General',
              level: q.level || 'O Level',
              commandWord: q.commandWord || (q.type === 'mcq' ? 'Select' : 'Explain'),
              marks: q.marks || 1,
              question: q.question,
              hint: q.markSchemeHint || 'Think carefully about what the examiner is looking for.',
              topic: q.topic || 'General',
              type: q.type,
              options: q.options,
              _bankId: q._bankId,
              _source: 'verified_bank',
            }));
            const s = bankChallenges.sort(() => Math.random() - 0.5);
            setShuffled(s);
            setChallenge(s[0]);
            return;
          }
        }
      } catch { /* fall through to fallback */ }
      // Fallback to hardcoded challenges
      const s = [...FALLBACK_CHALLENGES].sort(() => Math.random() - 0.5);
      setShuffled(s);
      setChallenge(s[0]);
    }
    loadChallenges();
    if (typeof window !== 'undefined' && document.referrer.includes('/nixor')) setFromDeck(true);
  }, []);

  const selectChallenge = (c, i) => {
    setChallenge(c);
    setIdx(i);
    setAnswer('');
    setResult(null);
    setShowHint(false);
    setAskResult(null);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => answerRef.current?.focus(), 300);
    }, 100);
  };

  const nextChallenge = () => {
    const next = (idx + 1) % shuffled.length;
    selectChallenge(shuffled[next], next);
  };

  const submitAnswer = async () => {
    if (!answer.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/challenge-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: challenge.question,
          answer: answer.trim(),
          subject: challenge.subject,
          level: challenge.level,
          commandWord: challenge.commandWord,
          marks: challenge.marks,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: 'Marking failed. Try again.' });
    }
    setLoading(false);
  };

  const submitAskStarky = async () => {
    if (!askQuestion.trim() || askLoading) return;
    setAskLoading(true);
    setAskResult(null);
    try {
      const res = await fetch('/api/challenge-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: askQuestion.trim(),
          answer: '__ASK_STARKY_MODE__',
          subject: 'general',
          level: 'O Level',
          commandWord: 'explain',
          marks: 3,
        }),
      });
      const data = await res.json();
      setAskResult(data);
    } catch {
      setAskResult({ error: 'Something went wrong. Try again.' });
    }
    setAskLoading(false);
  };

  const cwGuide = challenge ? COMMAND_WORD_GUIDE[challenge.commandWord] : null;
  const pct = result?.marksAwarded != null ? Math.round((result.marksAwarded / (result.totalMarks || challenge?.marks || 1)) * 100) : null;
  const gradeColor = pct >= 80 ? '#4ADE80' : pct >= 60 ? '#FFC300' : pct != null ? '#FF6B6B' : '#4F8EF7';

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', fontFamily: "'Sora',-apple-system,sans-serif", color: '#FAF6EB' }}>
      <Head>
        <title>Cambridge Challenge — Can You Score Full Marks? | NewWorldEdu</title>
        <meta name="description" content="One Cambridge exam question. Type your answer. Get marked by an AI examiner in real time. See exactly which marks you earned and which you lost." />
      </Head>

      <style jsx global>{`
        @keyframes challengeFadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .challenge-fadein { animation: challengeFadeIn 0.5s ease both; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      {/* Header */}
      <header style={{ padding: '14px 24px', borderBottom: '1px solid rgba(250,246,235,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {fromDeck && <a href="/nixor" style={{ fontSize: 12, color: 'rgba(250,246,235,0.4)', textDecoration: 'none', fontWeight: 700 }}>&larr; Back to deck</a>}
          <a href="/" style={{ textDecoration: 'none', fontWeight: 900, fontSize: 15, color: '#FAF6EB' }}>
            NewWorldEdu<span style={{ color: '#C9A84C', marginLeft: 4 }}>★</span>
          </a>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => { setMode('answer'); setAskResult(null); }} style={{ background: mode === 'answer' ? 'rgba(201,168,76,0.15)' : 'rgba(250,246,235,0.04)', border: mode === 'answer' ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(250,246,235,0.08)', borderRadius: 8, padding: '6px 14px', color: mode === 'answer' ? '#C9A84C' : 'rgba(250,246,235,0.4)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Answer a question</button>
          <button onClick={() => { setMode('ask'); setResult(null); }} style={{ background: mode === 'ask' ? 'rgba(79,142,247,0.15)' : 'rgba(250,246,235,0.04)', border: mode === 'ask' ? '1px solid rgba(79,142,247,0.4)' : '1px solid rgba(250,246,235,0.08)', borderRadius: 8, padding: '6px 14px', color: mode === 'ask' ? '#4F8EF7' : 'rgba(250,246,235,0.4)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Ask Starky anything</button>
        </div>
      </header>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: isMobile ? '24px 16px 60px' : '40px 24px 80px' }}>

        {/* ═══ ASK STARKY MODE ═══ */}
        {mode === 'ask' && (
          <div className="challenge-fadein">
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <h1 style={{ fontSize: isMobile ? 26 : 38, fontWeight: 900, margin: '0 0 12px', lineHeight: 1.2 }}>
                Ask Starky{' '}
                <span style={{ background: 'linear-gradient(135deg,#4F8EF7,#6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>anything.</span>
              </h1>
              <p style={{ color: 'rgba(250,246,235,0.5)', fontSize: 15, margin: 0, lineHeight: 1.7, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
                Ask any Cambridge exam question, any topic, any subject. Starky answers with the precision of a Senior Cambridge Examiner — mark scheme phrases, command word awareness, examiner report knowledge.
              </p>
            </div>
            <textarea value={askQuestion} onChange={e => setAskQuestion(e.target.value)} placeholder="Ask any Cambridge question... e.g. &quot;Explain why increasing temperature increases the rate of reaction&quot;" disabled={askLoading}
              style={{ width: '100%', minHeight: 120, padding: '16px', borderRadius: 14, border: '1px solid rgba(79,142,247,0.2)', background: 'rgba(79,142,247,0.04)', color: '#FAF6EB', fontSize: 15, lineHeight: 1.7, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 12 }} />
            <button onClick={submitAskStarky} disabled={askLoading || !askQuestion.trim()}
              style={{ width: '100%', padding: '16px 28px', borderRadius: 14, border: 'none', background: askLoading ? 'rgba(79,142,247,0.3)' : '#4F8EF7', color: '#fff', fontSize: 16, fontWeight: 900, cursor: askLoading ? 'default' : 'pointer', fontFamily: "'Sora',sans-serif", opacity: !askQuestion.trim() ? 0.4 : 1 }}>
              {askLoading ? <span style={{ animation: 'pulse 1.5s infinite' }}>Starky is thinking...</span> : 'Ask Starky →'}
            </button>
            {askResult && !askResult.error && (
              <div className="challenge-fadein" style={{ marginTop: 20, background: 'rgba(79,142,247,0.04)', border: '1px solid rgba(79,142,247,0.15)', borderRadius: 16, padding: isMobile ? '20px' : '28px' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#4F8EF7', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Starky — Cambridge Examiner Response</div>
                <div style={{ fontSize: 15, color: 'rgba(250,246,235,0.8)', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{askResult.answer}</div>
              </div>
            )}
            {askResult?.error && <div style={{ color: '#FF6B6B', textAlign: 'center', marginTop: 16, fontSize: 14 }}>{askResult.error}</div>}
          </div>
        )}

        {/* ═══ ANSWER MODE ═══ */}
        {/* Hero — only before first answer */}
        {mode === 'answer' && !result && !loading && (
          <div style={{ textAlign: 'center', marginBottom: 32 }} className="challenge-fadein">
            <h1 style={{ fontSize: isMobile ? 26 : 38, fontWeight: 900, margin: '0 0 12px', lineHeight: 1.2 }}>
              Can you score{' '}
              <span style={{ background: 'linear-gradient(135deg,#C9A84C,#E8D48B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                full marks?
              </span>
            </h1>
            <p style={{ color: 'rgba(250,246,235,0.5)', fontSize: 15, margin: 0, lineHeight: 1.7, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
              One Cambridge exam question. Type your answer. A Cambridge examiner marks it in real time — showing exactly which marks you earned and which you lost.
            </p>
          </div>
        )}

        {mode === 'answer' && challenge && (
          <div className="challenge-fadein" ref={questionRef}>
            {/* Question Card */}
            <div style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 20, padding: isMobile ? '20px' : '28px', marginBottom: 16 }}>
              {/* Subject + Level badge */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 100, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C', letterSpacing: '0.04em' }}>{challenge.subject}</span>
                <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 100, background: 'rgba(250,246,235,0.04)', border: '1px solid rgba(250,246,235,0.08)', color: 'rgba(250,246,235,0.5)' }}>{challenge.level}</span>
                <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 100, background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)', color: '#4F8EF7' }}>{challenge.marks} mark{challenge.marks !== 1 ? 's' : ''}</span>
              </div>

              {/* Command word banner */}
              {cwGuide && (
                <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#C9A84C', marginBottom: 4 }}>
                    Command word: {challenge.commandWord.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(250,246,235,0.6)', lineHeight: 1.6 }}>{cwGuide.demand}</div>
                  <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.35)', marginTop: 4 }}>{cwGuide.markSignal}</div>
                </div>
              )}

              {/* Question text */}
              <div style={{ fontSize: isMobile ? 17 : 20, fontWeight: 700, lineHeight: 1.7, color: '#FAF6EB', whiteSpace: 'pre-line' }}>
                {challenge.question}
              </div>

              {/* Hint toggle */}
              {challenge.hint && !result && (
                <button onClick={() => setShowHint(!showHint)} style={{ background: 'none', border: 'none', color: 'rgba(201,168,76,0.5)', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginTop: 12, padding: 0 }}>
                  {showHint ? '▾ Hide hint' : '▸ Need a hint?'}
                </button>
              )}
              {showHint && (
                <div style={{ fontSize: 13, color: '#C9A84C', marginTop: 8, padding: '10px 14px', background: 'rgba(201,168,76,0.06)', borderRadius: 10, lineHeight: 1.6 }}>
                  💡 {challenge.hint}
                </div>
              )}
            </div>

            {/* Answer area */}
            {!result && (
              <div style={{ marginBottom: 16 }}>
                <textarea
                  ref={answerRef}
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  disabled={loading}
                  style={{
                    width: '100%', minHeight: 140, padding: '16px', borderRadius: 14,
                    border: '1px solid rgba(250,246,235,0.12)', background: 'rgba(250,246,235,0.04)',
                    color: '#FAF6EB', fontSize: 15, lineHeight: 1.7, fontFamily: 'inherit',
                    outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={submitAnswer}
                  disabled={loading || !answer.trim()}
                  style={{
                    width: '100%', marginTop: 12, padding: '16px 28px', borderRadius: 14,
                    border: 'none', background: loading ? 'rgba(201,168,76,0.3)' : '#C9A84C',
                    color: '#0A1628', fontSize: 16, fontWeight: 900, cursor: loading ? 'default' : 'pointer',
                    fontFamily: "'Sora',sans-serif", opacity: !answer.trim() ? 0.4 : 1,
                  }}
                >
                  {loading ? (
                    <span style={{ animation: 'pulse 1.5s infinite' }}>Cambridge examiner is marking...</span>
                  ) : (
                    'Mark my answer →'
                  )}
                </button>
              </div>
            )}

            {/* ═══ RESULTS ═══ */}
            {result && !result.error && (
              <div className="challenge-fadein">
                {/* Score banner */}
                <div style={{ textAlign: 'center', padding: '28px 20px', background: `${gradeColor}08`, border: `1px solid ${gradeColor}33`, borderRadius: 20, marginBottom: 16 }}>
                  <div style={{ fontSize: 52, fontWeight: 900, color: gradeColor }}>
                    {result.marksAwarded}/{result.totalMarks || challenge.marks}
                  </div>
                  <div style={{ fontSize: 14, color: 'rgba(250,246,235,0.5)', marginTop: 4 }}>
                    {pct >= 80 ? 'Full marks territory.' : pct >= 60 ? 'Good — but marks were left on the table.' : 'Significant marks lost. Read the corrections carefully.'}
                  </div>
                </div>

                {/* Mark points breakdown */}
                {result.markPoints?.length > 0 && (
                  <div style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.08)', borderRadius: 16, padding: isMobile ? '16px' : '20px', marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(250,246,235,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Mark Points</div>
                    {result.markPoints.map((mp, i) => (
                      <div key={i} style={{ padding: '10px 0', borderBottom: i < result.markPoints.length - 1 ? '1px solid rgba(250,246,235,0.05)' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <span style={{ fontSize: 16, flexShrink: 0 }}>{mp.awarded ? '✅' : '❌'}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: mp.awarded ? '#4ADE80' : '#FF6B6B', marginBottom: 2 }}>
                              Mark {i + 1}: {mp.awarded ? 'Awarded' : 'Not awarded'}
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(250,246,235,0.6)', lineHeight: 1.6 }}>{mp.point}</div>
                            {!mp.awarded && mp.required && (
                              <div style={{ fontSize: 12, color: '#C9A84C', marginTop: 4 }}>
                                Cambridge requires: &ldquo;{mp.required}&rdquo;
                              </div>
                            )}
                            {!mp.awarded && mp.studentWrote && (
                              <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.35)', marginTop: 2 }}>
                                You wrote: &ldquo;{mp.studentWrote}&rdquo;
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Command word verdict */}
                {result.commandWordVerdict && (
                  <div style={{ background: result.commandWordVerdict.correct ? 'rgba(74,222,128,0.04)' : 'rgba(255,107,107,0.04)', border: `1px solid ${result.commandWordVerdict.correct ? 'rgba(74,222,128,0.15)' : 'rgba(255,107,107,0.15)'}`, borderRadius: 14, padding: '14px 18px', marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: result.commandWordVerdict.correct ? '#4ADE80' : '#FF6B6B', marginBottom: 4 }}>
                      {result.commandWordVerdict.correct ? '✅' : '❌'} Command Word: {(result.commandWordVerdict.word || challenge.commandWord).toUpperCase()}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(250,246,235,0.6)', lineHeight: 1.6 }}>{result.commandWordVerdict.note}</div>
                  </div>
                )}

                {/* Dialect corrections */}
                {result.dialectCorrections?.length > 0 && (
                  <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 14, padding: '14px 18px', marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#C9A84C', marginBottom: 8 }}>Cambridge Language Corrections</div>
                    {result.dialectCorrections.map((dc, i) => (
                      <div key={i} style={{ fontSize: 12, color: 'rgba(250,246,235,0.6)', lineHeight: 1.7, padding: '4px 0' }}>
                        <span style={{ color: '#FF6B6B' }}>&ldquo;{dc.studentPhrase}&rdquo;</span>
                        <span style={{ color: 'rgba(250,246,235,0.3)', margin: '0 6px' }}>→</span>
                        <span style={{ color: '#4ADE80' }}>&ldquo;{dc.cambridgePhrase}&rdquo;</span>
                        {dc.markImpact && <span style={{ color: 'rgba(250,246,235,0.35)', marginLeft: 6 }}>({dc.markImpact})</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Examiner warning */}
                {result.examinerWarning && (
                  <div style={{ background: 'rgba(255,107,107,0.04)', border: '1px solid rgba(255,107,107,0.12)', borderRadius: 14, padding: '14px 18px', marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#FF6B6B', marginBottom: 4 }}>⚠️ Examiner Report</div>
                    <div style={{ fontSize: 12, color: 'rgba(250,246,235,0.6)', lineHeight: 1.7, fontStyle: 'italic' }}>{result.examinerWarning}</div>
                  </div>
                )}

                {/* Model answer */}
                {result.modelAnswer && (
                  <div style={{ background: 'rgba(74,222,128,0.03)', border: '1px solid rgba(74,222,128,0.12)', borderRadius: 14, padding: '14px 18px', marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#4ADE80', marginBottom: 6 }}>Full Marks Answer</div>
                    <div style={{ fontSize: 13, color: 'rgba(250,246,235,0.75)', lineHeight: 1.8 }}>{result.modelAnswer}</div>
                  </div>
                )}

                {/* One thing to improve */}
                {result.oneThingToImprove && (
                  <div style={{ background: 'rgba(79,142,247,0.04)', border: '1px solid rgba(79,142,247,0.12)', borderRadius: 14, padding: '14px 18px', marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#4F8EF7', marginBottom: 4 }}>The Single Most Important Improvement</div>
                    <div style={{ fontSize: 13, color: 'rgba(250,246,235,0.7)', lineHeight: 1.7 }}>{result.oneThingToImprove}</div>
                  </div>
                )}

                {/* Product suggestions */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  <a href="/nano" style={{ flex: 1, minWidth: 140, textAlign: 'center', padding: '10px 14px', borderRadius: 10, background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', textDecoration: 'none', fontSize: 12, fontWeight: 700, color: '#C9A84C' }}>⚛️ Master this in Nano</a>
                  <a href="/drill" style={{ flex: 1, minWidth: 140, textAlign: 'center', padding: '10px 14px', borderRadius: 10, background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.15)', textDecoration: 'none', fontSize: 12, fontWeight: 700, color: '#4F8EF7' }}>⚡ Practice in Drill</a>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 10, flexDirection: isMobile ? 'column' : 'row' }}>
                  <button onClick={() => { setAnswer(''); setResult(null); setShowHint(false); setTimeout(() => answerRef.current?.focus(), 200); }}
                    style={{ flex: 1, padding: '14px', borderRadius: 12, border: '1px solid rgba(201,168,76,0.3)', background: 'transparent', color: '#C9A84C', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
                    Try again
                  </button>
                  <button onClick={nextChallenge}
                    style={{ flex: 1, padding: '14px', borderRadius: 12, border: 'none', background: '#C9A84C', color: '#0A1628', fontSize: 14, fontWeight: 900, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
                    Next question →
                  </button>
                </div>
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <a href={fromDeck ? '/nixor' : '/'} style={{ fontSize: 13, color: 'rgba(250,246,235,0.35)', textDecoration: 'none', fontWeight: 600 }}>
                    {fromDeck ? '← Back to presentation' : '← Back to home'}
                  </a>
                </div>
              </div>
            )}

            {result?.error && (
              <div style={{ color: '#FF6B6B', fontSize: 14, textAlign: 'center', padding: 20 }}>
                {result.error}
                <br />
                <button onClick={() => setResult(null)} style={{ marginTop: 12, background: 'none', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 10, padding: '8px 20px', color: '#FF6B6B', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>Try again</button>
              </div>
            )}
          </div>
        )}

        {/* Question picker — only in answer mode */}
        {mode === 'answer' && <details style={{ marginTop: 32 }}>
          <summary style={{ cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'rgba(250,246,235,0.35)', padding: '8px 0' }}>Choose a different question ({shuffled.length} available)</summary>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            {shuffled.map((c, i) => (
              <button key={c.id} onClick={() => { setMode('answer'); selectChallenge(c, i); }}
                style={{ background: challenge?.id === c.id ? 'rgba(201,168,76,0.08)' : 'rgba(250,246,235,0.02)', border: challenge?.id === c.id ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(250,246,235,0.06)', borderRadius: 12, padding: '12px 16px', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#FAF6EB', marginBottom: 2 }}>{c.subject} — {c.commandWord}</div>
                <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.4)' }}>{c.question.slice(0, 60)}...</div>
              </button>
            ))}
          </div>
        </details>}

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 40, padding: '24px 0', borderTop: '1px solid rgba(250,246,235,0.06)' }}>
          <div style={{ fontSize: 13, color: 'rgba(250,246,235,0.4)', marginBottom: 12 }}>This is Starky — the AI tutor built for Cambridge students.</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/nano" style={{ fontSize: 13, fontWeight: 700, color: '#C9A84C', textDecoration: 'none', padding: '10px 20px', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 10 }}>⚛️ Starky Nano</a>
            <a href="/drill" style={{ fontSize: 13, fontWeight: 700, color: '#4F8EF7', textDecoration: 'none', padding: '10px 20px', border: '1px solid rgba(79,142,247,0.3)', borderRadius: 10 }}>📝 Practice Drill</a>
            <a href="/mocks" style={{ fontSize: 13, fontWeight: 700, color: '#A78BFA', textDecoration: 'none', padding: '10px 20px', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 10 }}>📋 Mock Exams</a>
          </div>
        </div>
      </div>

      <footer style={{ padding: '20px 16px', textAlign: 'center', borderTop: '1px solid rgba(250,246,235,0.04)' }}>
        <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.2)' }}>&copy; 2026 NewWorldEdu &middot; newworld.education</div>
      </footer>
    </div>
  );
}
