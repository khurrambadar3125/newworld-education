import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useSessionLimit } from "../utils/useSessionLimit";
import LegalFooter from "../components/LegalFooter";
import { ARABIC_UNIQUE_SOUNDS, ENGLISH_HARD_FOR_ARABIC, BILINGUAL_MAPPINGS, UAE_PHONICS_WORDS, getUAEPhonicsPrompt } from "../utils/uaePhonicsKB";

const PROG_KEY = "nw_phonics_uae_progress";
function loadProg() { try { return JSON.parse(localStorage.getItem(PROG_KEY) || '{}'); } catch { return {}; } }
function saveProg(d) { try { localStorage.setItem(PROG_KEY, JSON.stringify(d)); } catch {} }

// Audio
let _ctx = null;
function gCtx() { if (!_ctx) try { _ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch {} return _ctx; }
function tone(f, t, v, d, dl) { const c = gCtx(); if (!c) return; const o = c.createOscillator(), g = c.createGain(); o.connect(g); g.connect(c.destination); o.type = t || 'sine'; o.frequency.value = f; const ts = c.currentTime + (dl || 0); g.gain.setValueAtTime(0, ts); g.gain.linearRampToValueAtTime(v || 0.12, ts + 0.02); g.gain.exponentialRampToValueAtTime(0.001, ts + d); o.start(ts); o.stop(ts + d + 0.05); }
function sndTick() { tone(880, 'sine', 0.1, 0.1); }
function sndWin() { tone(523, 'sine', 0.2, 0.4); tone(659, 'sine', 0.2, 0.35, 0.12); tone(784, 'sine', 0.2, 0.35, 0.24); }

export default function PhonicsUAEPage() {
  const [step, setStep] = useState(1); // 1=track select, 2=sound cards, 3=chat
  const [track, setTrack] = useState(null); // 'arabic' | 'english'
  const [selectedSound, setSelectedSound] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const { callsLeft, limitReached, recordCall } = useSessionLimit();

  useEffect(() => { const fn = () => setIsMobile(window.innerWidth < 768); fn(); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { setProgress(loadProg()); }, []);

  const startSession = (sound) => {
    setSelectedSound(sound);
    setStep(3);
    const isArabic = track === 'arabic';
    const greeting = isArabic
      ? `Marhaba! Today we're learning the sound **${sound.letter} (${sound.name})**.\n\n${sound.desc}\n\n**UAE word:** ${sound.uaeWord}\n\n**How to make this sound:** ${sound.practice}\n\nLet's practise! Try saying the sound and I'll help you get it right.`
      : `Hello! Today we're working on the **"${sound.sound}"** sound.\n\n**The challenge:** ${sound.issue}\n\n**Examples:** ${sound.examples.join(', ')}\n\n**How to fix it:** ${sound.fix}\n\n**UAE practice:** ${sound.uaeExample}\n\nLet's practise! Type a sentence using a word with the "${sound.sound}" sound.`;
    setMessages([{ role: 'assistant', content: greeting }]);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading || limitReached) return;
    sndTick();
    setInput("");
    recordCall();
    const newMsgs = [...messages, { role: 'user', content: text }];
    setMessages([...newMsgs, { role: 'assistant', content: '...' }]);
    setLoading(true);

    try {
      const phonicsPrompt = getUAEPhonicsPrompt(track);
      const soundContext = track === 'arabic'
        ? `Current sound: ${selectedSound.letter} (${selectedSound.name}). ${selectedSound.desc}. Practice tip: ${selectedSound.practice}. UAE word: ${selectedSound.uaeWord}.`
        : `Current sound: "${selectedSound.sound}". Issue: ${selectedSound.issue}. Fix: ${selectedSound.fix}. UAE example: ${selectedSound.uaeExample}.`;

      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
          systemOverride: `You are Starky, a bilingual phonics tutor for UAE students. ${phonicsPrompt}\n\n${soundContext}\n\nTeach with patience. Celebrate every attempt. Use UAE examples. Keep responses short (2-3 paragraphs max). If the student makes a pronunciation-related error, gently correct it with the contrast technique.`,
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullReply = '';
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
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
        const soundKey = track === 'arabic' ? selectedSound.letter : selectedSound.sound;
        const updated = { ...progress };
        if (!updated[soundKey]) updated[soundKey] = { sessions: 0 };
        updated[soundKey].sessions += 1;
        updated[soundKey].lastPractised = new Date().toISOString();
        setProgress(updated);
        saveProg(updated);

        // UAE Summer Passport stamp
        try {
          const uc = localStorage.getItem('user_country');
          if (uc === 'UAE') {
            const now = new Date();
            if (now.getMonth() >= 6 && now.getMonth() <= 7) {
              const pp = JSON.parse(localStorage.getItem('nw_summer_uae_passport') || '{}');
              if (!pp.stamps) pp.stamps = [];
              pp.stamps.push({ date: now.toISOString(), subject: `Phonics — ${soundKey}` });
              localStorage.setItem('nw_summer_uae_passport', JSON.stringify(pp));
            }
          }
        } catch {}
      }
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: 'Oops! Starky is busy — try again in a moment.' }]);
    } finally {
      setLoading(false);
    }
  };

  const f = "'Sora',sans-serif";

  // ═══ STEP 1: Track Selection ═══
  if (step === 1) return (
    <>
      <Head>
        <title>UAE Bilingual Phonics — NewWorldEdu</title>
        <meta name="description" content="Arabic-English bilingual phonics for UAE students. Learn Arabic sounds as an English speaker or English sounds as an Arabic speaker." />
      </Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .ph-track:hover{transform:translateY(-3px)!important;box-shadow:0 12px 40px rgba(0,0,0,0.35)!important}
      `}</style>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#060B20,#0A1628,#060B20)', fontFamily: f, padding: '0 20px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', paddingTop: 48, paddingBottom: 48 }}>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-block', background: 'rgba(79,142,247,0.12)', border: '1px solid rgba(79,142,247,0.3)', borderRadius: 100, padding: '5px 16px', fontSize: 11, fontWeight: 700, color: '#4F8EF7', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
              UAE Bilingual Phonics
            </div>
            <h1 style={{ fontSize: 'clamp(24px,6vw,36px)', fontWeight: 900, lineHeight: 1.2, marginBottom: 12 }}>
              From Arabic to English.<br />From English to Arabic.<br />
              <span style={{ background: 'linear-gradient(135deg,#4F8EF7,#4ECDC4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Starky teaches both.</span>
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
              Interactive phonics designed for Dubai's bilingual classrooms. Arabic↔English sound mastery with UAE examples.
            </p>
          </div>

          {/* Two tracks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <button className="ph-track" onClick={() => { setTrack('arabic'); setStep(2); }} style={{ background: 'rgba(78,205,196,0.06)', border: '2px solid rgba(78,205,196,0.2)', borderRadius: 20, padding: 24, cursor: 'pointer', textAlign: 'left', fontFamily: f, color: '#fff', transition: 'all 0.2s' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🇦🇪 → 🇬🇧</div>
              <div style={{ fontWeight: 900, fontSize: 18, color: '#4ECDC4', marginBottom: 4 }}>Arabic Phonics</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>For English speakers learning Arabic sounds</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                Learn the 10 Arabic sounds that don't exist in English — ع، غ، خ، ح، ص، ض، ط، ظ، ق، ه. With UAE words you already know: Khalifa, Abu Dhabi, Souq, Eid.
              </p>
              <div style={{ marginTop: 12, color: '#4ECDC4', fontSize: 13, fontWeight: 800 }}>Start Arabic phonics →</div>
            </button>

            <button className="ph-track" onClick={() => { setTrack('english'); setStep(2); }} style={{ background: 'rgba(79,142,247,0.06)', border: '2px solid rgba(79,142,247,0.2)', borderRadius: 20, padding: 24, cursor: 'pointer', textAlign: 'left', fontFamily: f, color: '#fff', transition: 'all 0.2s' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🇬🇧 → 🇦🇪</div>
              <div style={{ fontWeight: 900, fontSize: 18, color: '#4F8EF7', marginBottom: 4 }}>English Phonics</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>For Arabic speakers learning English sounds</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                Master the sounds Arabic doesn't have — p, v, ch, ng, consonant clusters. Fix "bark" → "park" and "fery" → "very" with Dubai examples.
              </p>
              <div style={{ marginTop: 12, color: '#4F8EF7', fontSize: 13, fontWeight: 800 }}>Start English phonics →</div>
            </button>
          </div>

          {/* Bilingual mapping preview */}
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.3)', marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sound Bridge</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
              {BILINGUAL_MAPPINGS.filter(m => m.arabic !== '—').slice(0, 10).map(m => (
                <span key={m.arabic} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '6px 10px', fontSize: 13, fontWeight: 700 }}>
                  <span style={{ color: '#4ECDC4' }}>{m.arabic}</span>
                  <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 4px' }}>=</span>
                  <span style={{ color: '#4F8EF7' }}>{m.english}</span>
                </span>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textDecoration: 'none' }}>← Back to home</a>
          </div>
        </div>
      </div>
    </>
  );

  // ═══ STEP 2: Sound Cards ═══
  if (step === 2) {
    const sounds = track === 'arabic' ? ARABIC_UNIQUE_SOUNDS : ENGLISH_HARD_FOR_ARABIC;
    const trackColor = track === 'arabic' ? '#4ECDC4' : '#4F8EF7';
    const trackTitle = track === 'arabic' ? 'Arabic Sounds' : 'English Sounds';

    return (
      <>
        <Head><title>{trackTitle} — UAE Phonics — NewWorldEdu</title></Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');
          *{box-sizing:border-box;margin:0;padding:0}
          .ph-sound:hover{transform:translateY(-2px)!important;border-color:${trackColor}60!important}
        `}</style>
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#060B20,#0A1628,#060B20)', fontFamily: f, padding: '0 20px' }}>
          <div style={{ maxWidth: 560, margin: '0 auto', paddingTop: 32, paddingBottom: 48 }}>

            <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', fontFamily: f, fontWeight: 600, marginBottom: 16 }}>← Back to tracks</button>

            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>{track === 'arabic' ? 'Arabic Sounds for English Speakers' : 'English Sounds for Arabic Speakers'}</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Tap a sound to start practising with Starky.</p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
              {sounds.map((s, i) => {
                const key = track === 'arabic' ? s.letter : s.sound;
                const sessions = progress[key]?.sessions || 0;
                const isExpanded = expandedCard === i;

                return (
                  <div key={i} className="ph-sound" style={{ background: 'rgba(255,255,255,0.03)', border: `1.5px solid rgba(255,255,255,0.08)`, borderRadius: 16, padding: '16px 14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div onClick={() => setExpandedCard(isExpanded ? null : i)} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${trackColor}15`, border: `1.5px solid ${trackColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: track === 'arabic' ? 24 : 16, fontWeight: 900, color: trackColor, flexShrink: 0 }}>
                        {track === 'arabic' ? s.letter : s.sound}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>{track === 'arabic' ? s.name : s.sound.toUpperCase()}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track === 'arabic' ? s.desc.split('.')[0] : s.issue.split('—')[0]}</div>
                      </div>
                      {sessions > 0 && <span style={{ fontSize: 10, fontWeight: 800, color: '#4ADE80', background: 'rgba(74,222,128,0.1)', borderRadius: 100, padding: '2px 8px' }}>{sessions}x</span>}
                    </div>

                    {isExpanded && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 10 }}>
                          {track === 'arabic' ? s.practice : s.fix}
                        </p>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>
                          {track === 'arabic' ? `UAE word: ${s.uaeWord}` : `UAE: ${s.uaeExample}`}
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); startSession(s); }} style={{ width: '100%', background: trackColor, color: '#060B20', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: f }}>
                          Practise this sound with Starky →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ═══ STEP 3: Chat with Starky ═══
  const trackColor = track === 'arabic' ? '#4ECDC4' : '#4F8EF7';
  return (
    <>
      <Head><title>Phonics Practice — NewWorldEdu</title></Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
      `}</style>
      <div style={{ minHeight: '100vh', background: '#060B20', fontFamily: f, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => { setStep(2); setMessages([]); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', fontFamily: f }}>← Sounds</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: trackColor }}>
              {track === 'arabic' ? `${selectedSound?.letter} ${selectedSound?.name}` : `"${selectedSound?.sound}" sound`}
            </span>
          </div>
          <div style={{ width: 60 }} />
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ maxWidth: '85%', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? 'rgba(79,142,247,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${m.role === 'user' ? 'rgba(79,142,247,0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 16, padding: '12px 16px' }}>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff">$1</strong>').replace(/\n/g, '<br>') }} />
            </div>
          ))}
          {loading && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Starky is thinking...</div>}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={track === 'arabic' ? 'Try saying the sound or ask a question...' : 'Type a word with this sound...'}
            style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14, fontFamily: f, outline: 'none' }} />
          <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ background: trackColor, color: '#060B20', border: 'none', borderRadius: 12, padding: '12px 18px', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: f, opacity: loading || !input.trim() ? 0.4 : 1 }}>
            Send
          </button>
        </div>
      </div>
      <LegalFooter sen={true} />
    </>
  );
}
