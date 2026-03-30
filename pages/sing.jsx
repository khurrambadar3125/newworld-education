import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useSessionLimit } from '../utils/useSessionLimit';
import { SINGING_CURRICULUM, GENRE_KNOWLEDGE, SEN_SINGING_ADAPTATIONS, SINGING_DIAGNOSTIC, UAE_SINGING_SUMMER_TRACK, SINGING_PHILOSOPHY, getSingingPrompt, isSingingTopic } from '../utils/singingKB';

const PROG_KEY = 'nw_singing_progress';
function loadProg() { try { return JSON.parse(localStorage.getItem(PROG_KEY) || '{}'); } catch { return {}; } }
function saveProg(d) { try { localStorage.setItem(PROG_KEY, JSON.stringify(d)); } catch {} }

// Audio
let _ctx = null;
function gCtx() { if (!_ctx) try { _ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch {} return _ctx; }
function tone(f, t, v, d, dl) { const c = gCtx(); if (!c) return; const o = c.createOscillator(), g = c.createGain(); o.connect(g); g.connect(c.destination); o.type = t || 'sine'; o.frequency.value = f; const ts = c.currentTime + (dl || 0); g.gain.setValueAtTime(0, ts); g.gain.linearRampToValueAtTime(v || 0.12, ts + 0.02); g.gain.exponentialRampToValueAtTime(0.001, ts + d); o.start(ts); o.stop(ts + d + 0.05); }
function sndWin() { tone(523, 'sine', 0.15, 0.3); tone(659, 'sine', 0.15, 0.25, 0.1); tone(784, 'sine', 0.15, 0.3, 0.2); }

const LEVELS = [
  { id: 'level1', ...SINGING_CURRICULUM.level1, color: '#4ADE80', icon: '🌱' },
  { id: 'level2', ...SINGING_CURRICULUM.level2, color: '#FFC300', icon: '⭐' },
  { id: 'level3', ...SINGING_CURRICULUM.level3, color: '#4F8EF7', icon: '🎤' },
  { id: 'level4', ...SINGING_CURRICULUM.level4, color: '#C77DFF', icon: '🌟' },
];

const GENRES = [
  { id: 'bollywood', name: 'Bollywood', icon: '🎬', color: '#FF8E53', desc: 'Hindi film music — ornaments, emotion, melody' },
  { id: 'nasheed', name: 'Nasheeds', icon: '🕌', color: '#4ECDC4', desc: 'Islamic devotional — pure voice, spiritual expression' },
  { id: 'qawwali', name: 'Qawwali', icon: '🎶', color: '#FF6B6B', desc: 'Sufi music — chest voice power, repetition, trance' },
  { id: 'arabicMaqam', name: 'Arabic Maqam', icon: '🇦🇪', color: '#FFC300', desc: 'Quarter tones, ornaments, emotional expression' },
  { id: 'westernPop', name: 'Pop / Contemporary', icon: '🎵', color: '#4F8EF7', desc: 'Mixed voice, authenticity, modern technique' },
];

export default function SingPage() {
  const [step, setStep] = useState(1); // 1=landing, 2=level, 3=genre, 4=chat
  const [level, setLevel] = useState(null);
  const [genre, setGenre] = useState(null);
  const [progress, setProgress] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Chat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const { callsLeft, limitReached, recordCall } = useSessionLimit();

  useEffect(() => { const fn = () => setIsMobile(window.innerWidth < 768); fn(); window.addEventListener('resize', fn); return () => window.removeEventListener('resize', fn); }, []);
  useEffect(() => { setProgress(loadProg()); }, []);
  useEffect(() => { if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const startSession = (selectedGenre) => {
    setGenre(selectedGenre);
    setStep(4);
    sndWin();

    const age = level?.ageRange?.split('-')[0] || '10';
    const greeting = `Welcome to your singing session! ${SINGING_PHILOSOPHY}\n\nYour level: **${level?.name}** (age ${level?.ageRange})\n${selectedGenre ? `Genre: **${selectedGenre.name}**\n` : ''}\nLet's start with a warm-up. Can you do a gentle hum for me? Just a comfortable "mmmm" on any note you like. If you can't use the mic, just type "ready" and I'll guide you with text.\n\n${SINGING_DIAGNOSTIC.questions[0]}`;

    setMessages([{ role: 'assistant', content: greeting }]);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading || limitReached) return;
    setInput('');
    recordCall();
    const newMsgs = [...messages, { role: 'user', content: text }];
    setMessages([...newMsgs, { role: 'assistant', content: '...' }]);
    setLoading(true);

    try {
      const singingPrompt = getSingingPrompt(parseInt(level?.ageRange?.split('-')[0]) || 10, null);
      const genreContext = genre ? `Genre focus: ${genre.name}. ${GENRE_KNOWLEDGE[genre.id]?.technique || ''}` : '';

      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
          systemOverride: `You are Starky, a joyful singing tutor. ${singingPrompt}\n${genreContext}\n\nKeep responses warm, encouraging, and specific. For voice descriptions, be vivid and kind. Always find something genuine to praise. Limit corrections to ONE thing per response. End every response with a next step or exercise.`,
          voiceInput: true,
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullReply = '';
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          for (const line of decoder.decode(value, { stream: true }).split('\n')) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try { const d = JSON.parse(line.slice(6)); if (d.text) fullReply += d.text; } catch {}
            }
          }
          setMessages([...newMsgs, { role: 'assistant', content: fullReply || '...' }]);
        }
      }
      if (fullReply) {
        setMessages([...newMsgs, { role: 'assistant', content: fullReply }]);
        // Update progress
        const updated = { ...progress, sessions: (progress.sessions || 0) + 1, lastSession: new Date().toISOString() };
        setProgress(updated);
        saveProg(updated);

        // Summer passport stamp
        try {
          const uc = localStorage.getItem('user_country');
          if (uc === 'UAE' || uc === 'PK') {
            const now = new Date();
            if (now.getMonth() >= 6 && now.getMonth() <= 7) {
              const pp = JSON.parse(localStorage.getItem('nw_summer_uae_passport') || '{}');
              if (!pp.stamps) pp.stamps = [];
              pp.stamps.push({ date: now.toISOString(), subject: 'Singing' });
              localStorage.setItem('nw_summer_uae_passport', JSON.stringify(pp));
            }
          }
        } catch {}
      }
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: 'Oops! Try again in a moment.' }]);
    } finally { setLoading(false); }
  };

  const f = "'Sora',sans-serif";
  const max = { maxWidth: 580, margin: '0 auto' };

  // ═══ STEP 1: Landing ═══
  if (step === 1) return (
    <>
      <Head>
        <title>Learn to Sing with Starky — NewWorldEdu</title>
        <meta name="description" content="Every voice is beautiful. Starky teaches singing — no judgement, no comparison, no failure. Bollywood, Qawwali, Nasheeds, Pop, Arabic Maqam." />
      </Head>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}.sg-card:hover{transform:translateY(-3px)!important;box-shadow:0 12px 40px rgba(0,0,0,0.35)!important}`}</style>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#060B20,#0A1628,#060B20)', fontFamily: f, padding: '0 20px' }}>
        <div style={{ ...max, paddingTop: 48, paddingBottom: 48 }}>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🎤</div>
            <h1 style={{ fontSize: 'clamp(28px,7vw,40px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 12 }}>
              Learn to Sing<br />
              <span style={{ background: 'linear-gradient(135deg,#FF8E53,#FFC300)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>with Starky.</span>
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: 440, margin: '0 auto' }}>
              Every voice is beautiful. Every voice can improve. No judgement. No comparison. No failure. Just a patient tutor who celebrates every attempt.
            </p>
          </div>

          {/* Benefits */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            {['Improves reading', 'Builds confidence', 'Strengthens memory', 'Reduces anxiety', 'Cultural pride'].map(b => (
              <span key={b} style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '4px 12px' }}>{b}</span>
            ))}
          </div>

          {/* Level Selection */}
          <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: 'center', marginBottom: 16 }}>Choose your level.</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
            {LEVELS.map(l => (
              <button key={l.id} className="sg-card" onClick={() => { setLevel(l); setStep(2); }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, background: `${l.color}06`, border: `1.5px solid ${l.color}20`, borderRadius: 16, padding: '16px 14px', cursor: 'pointer', fontFamily: f, color: '#fff', textAlign: 'left', transition: 'all 0.2s', width: '100%' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${l.color}15`, border: `1.5px solid ${l.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{l.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: l.color }}>{l.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Age {l.ageRange}</div>
                </div>
                {progress.sessions > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: '#4ADE80', background: 'rgba(74,222,128,0.1)', borderRadius: 100, padding: '3px 8px' }}>{progress.sessions} sessions</span>}
              </button>
            ))}
          </div>

          {/* SEN note */}
          <div style={{ background: 'rgba(199,125,255,0.05)', border: '1px solid rgba(199,125,255,0.12)', borderRadius: 14, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#C77DFF', marginBottom: 4 }}>Singing for Students of Determination</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
              Adapted for autism, ADHD, Down syndrome, deaf students, anxiety, and cerebral palsy. Music therapy that feels like play.
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textDecoration: 'none' }}>← Back to home</a>
          </div>
        </div>
      </div>
    </>
  );

  // ═══ STEP 2: Genre Selection ═══
  if (step === 2) return (
    <>
      <Head><title>Choose Your Style — Sing with Starky</title></Head>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}.sg-genre:hover{transform:translateY(-2px)!important;border-color:rgba(255,255,255,0.2)!important}`}</style>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#060B20,#0A1628,#060B20)', fontFamily: f, padding: '0 20px' }}>
        <div style={{ ...max, paddingTop: 32, paddingBottom: 48 }}>
          <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', fontFamily: f, fontWeight: 600, marginBottom: 16 }}>← Back</button>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>What do you want to sing?</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Choose a genre or skip to start with warm-ups.</p>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {GENRES.map(g => (
              <button key={g.id} className="sg-genre" onClick={() => startSession(g)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, background: `${g.color}06`, border: `1.5px solid ${g.color}20`, borderRadius: 14, padding: '14px 12px', cursor: 'pointer', fontFamily: f, color: '#fff', textAlign: 'left', transition: 'all 0.2s' }}>
                <span style={{ fontSize: 24 }}>{g.icon}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: g.color }}>{g.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{g.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <button onClick={() => startSession(null)} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px', cursor: 'pointer', fontFamily: f, color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 700 }}>
            Skip genre — just warm me up and teach me →
          </button>
        </div>
      </div>
    </>
  );

  // ═══ STEP 4: Chat with Starky ═══
  const trackColor = genre?.color || '#FFC300';
  return (
    <>
      <Head><title>Singing Session — NewWorldEdu</title></Head>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ minHeight: '100vh', background: '#060B20', fontFamily: f, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => { setStep(2); setMessages([]); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', fontFamily: f }}>← Back</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: trackColor }}>🎤 Singing with Starky</span>
            {genre && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 6 }}>· {genre.name}</span>}
          </div>
          <div style={{ width: 40 }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ maxWidth: '85%', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? 'rgba(255,142,83,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${m.role === 'user' ? 'rgba(255,142,83,0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 16, padding: '12px 16px' }}>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff">$1</strong>').replace(/\n/g, '<br>') }} />
            </div>
          ))}
          {loading && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Starky is listening...</div>}
          <div ref={chatEndRef} />
        </div>

        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Describe what you sang, or ask Starky..."
            style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14, fontFamily: f, outline: 'none' }} />
          <button onClick={sendMessage} disabled={loading || !input.trim()}
            style={{ background: trackColor, color: '#060B20', border: 'none', borderRadius: 12, padding: '12px 18px', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: f, opacity: loading || !input.trim() ? 0.4 : 1 }}>
            Send
          </button>
        </div>
      </div>
    </>
  );
}
