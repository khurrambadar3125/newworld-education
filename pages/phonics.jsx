import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useSessionLimit } from "../utils/useSessionLimit";
import LegalFooter from "../components/LegalFooter";
import { PHASES, PHONICS_SYSTEM_PROMPT, getPhonicsPhaseContext } from "../utils/phonicsKB";
import { CONTENT_PROTECTION } from "../utils/contentProtection";

// ── Audio engine (from kids.jsx pattern) ──────────────────────────────
let _ctx = null;
function gCtx() { if (!_ctx) try { _ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){} return _ctx; }
function tone(f,t,v,d,dl) {
  const c=gCtx(); if(!c) return;
  const o=c.createOscillator(),g=c.createGain();
  o.connect(g);g.connect(c.destination);o.type=t||'sine';o.frequency.value=f;
  const ts=c.currentTime+(dl||0);
  g.gain.setValueAtTime(0,ts);g.gain.linearRampToValueAtTime(v||0.15,ts+0.02);
  g.gain.exponentialRampToValueAtTime(0.001,ts+d);
  o.start(ts);o.stop(ts+d+0.05);
}
function sndTick(){tone(880,'sine',0.1,0.1)}
function sndWin(){tone(523,'sine',0.2,0.4);tone(659,'sine',0.2,0.35,0.12);tone(784,'sine',0.2,0.35,0.24);tone(1047,'sine',0.2,0.4,0.36)}
function sndOk(){tone(523,'sine',0.18,0.25);tone(659,'sine',0.18,0.25,0.12)}

// ── Progress persistence ──────────────────────────────────────────────
const PROG_KEY = "nw_phonics_progress";
function loadProg() { try { return JSON.parse(localStorage.getItem(PROG_KEY)||'{}'); } catch { return {}; } }
function saveProg(d) { try { localStorage.setItem(PROG_KEY, JSON.stringify(d)); } catch {} }

export default function PhonicsPage() {
  const [step, setStep] = useState(1); // 1=phase select, 2=activity select, 3=chat
  const [phase, setPhase] = useState(null);
  const [activity, setActivity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState({});
  const chatEndRef = useRef(null);
  const { callsLeft, limitReached, recordCall } = useSessionLimit();

  useEffect(() => { const fn = () => setIsMobile(window.innerWidth < 768); fn(); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);
  useEffect(() => { setProgress(loadProg()); }, []);

  const accent = phase?.color || "#63D2FF";

  const startChat = (act) => {
    if (!phase) return;
    setActivity(act);
    const prog = loadProg();
    const key = phase.id;
    if (!prog[key]) prog[key] = { sessions: 0 };
    prog[key].sessions++;
    saveProg(prog); setProgress(prog);

    const greeting = phase.num === 1
      ? `👂 Welcome to Phase 1 — Listening First!\n\nBefore we look at any letters, let's train your ears to hear sounds.\n\n${act ? act.desc : "Ready? Let's play a listening game!"}`
      : `🔤 Welcome to Phase ${phase.num} — ${phase.name}!\n\n${act ? act.desc : `Let's practise the sounds in this phase. Ready?`}`;

    setMessages([{ role: "assistant", content: greeting }]);
    setStep(3);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const sendMessage = async (text) => {
    const txt = (text || input).trim();
    if (!txt || loading || limitReached) return;
    setInput(""); recordCall(); sndTick();
    const prev = [...messages, { role: "user", content: txt }];
    setMessages(prev); setLoading(true);
    try {
      const system = CONTENT_PROTECTION + '\n\n' + PHONICS_SYSTEM_PROMPT + getPhonicsPhaseContext(phase?.id);
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: /* PERMANENT: Haiku 3 only. Never change without Khurrams approval. */ "claude-3-haiku-20240307", max_tokens: 800, system, messages: prev.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Something went wrong. Let's try again!";
      setMessages(p => [...p, { role: "assistant", content: reply }]);
      sndOk();
      // Signal collection
      try {
        const { recordMessageSignal } = await import('../utils/signalCollector');
        const profile = JSON.parse(localStorage.getItem('nw_user') || '{}');
        recordMessageSignal({ email: profile.email || 'anonymous', subject: 'Phonics', grade: profile.grade || 'KG', userMessage: txt, starkyResponse: reply, sessionNumber: 1 });
      } catch {}
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "Connection error. Let's try again!" }]);
    }
    setLoading(false);
  };

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
    *{box-sizing:border-box}
    button:focus,textarea:focus,input:focus{outline:4px solid #FFC300;outline-offset:2px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes popIn{0%{transform:scale(0)}60%{transform:scale(1.15)}100%{transform:scale(1)}}
    @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
  `;

  const S = {
    page: { minHeight: "100vh", background: "linear-gradient(135deg,#060B20 0%,#0D1635 60%,#060B20 100%)", fontFamily: "'Nunito',sans-serif", color: "#fff" },
    btn: { border: "none", cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.15s" },
  };

  return (
    <div style={S.page}><style>{CSS}</style>
      <Head>
        <title>Phonics — Learn to Read with Starky</title>
        <meta name="description" content="Systematic phonics teaching for children ages 3-7. Letters and Sounds programme. Learn to read from zero with Starky." />
      </Head>

      {/* Header */}
      <header style={{ padding: isMobile ? "12px 16px" : "14px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/kids" style={{ textDecoration: "none", fontWeight: 900, fontSize: isMobile ? 13 : 15, color: "#fff" }}>
          ← Kids Zone
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {step > 1 && (
            <button onClick={() => { setStep(1); setPhase(null); setActivity(null); setMessages([]); }}
              style={{ ...S.btn, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "6px 12px", color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700 }}>
              ← Phases
            </button>
          )}
          <a href="/" style={{ textDecoration: "none", fontWeight: 900, fontSize: 13, color: "#4F8EF7" }}>NewWorldEdu★</a>
        </div>
      </header>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: isMobile ? "20px 16px" : "40px 24px" }}>

        {/* ── STEP 1: Phase Selection ────────────────────────── */}
        {step === 1 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 56, marginBottom: 10 }}>📖</div>
              <h1 style={{ fontSize: isMobile ? 24 : 36, fontWeight: 900, margin: "0 0 8px" }}>
                Learn to <span style={{ color: "#63D2FF" }}>Read</span> with Starky
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 460, margin: "0 auto", lineHeight: 1.8 }}>
                Step-by-step phonics — from listening to sounds all the way to reading real stories.
              </p>
            </div>

            {/* Diagnostic button */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <button onClick={() => { setPhase(PHASES[1]); startChat({ title: 'Diagnostic', desc: "Let's play a sounds game! I'll show you some letters — you tell me the sound they make. This helps me know where to start.", emoji: '🎯' }); }}
                style={{ ...S.btn, background: "linear-gradient(135deg,rgba(79,142,247,0.15),rgba(168,224,99,0.1))", border: "1px solid rgba(79,142,247,0.3)", borderRadius: 16, padding: "14px 28px", color: "#4F8EF7", fontSize: 14, fontWeight: 800 }}>
                🎯 Not sure where to start? Take the Phonics Check
              </button>
            </div>

            {/* Phase cards */}
            <div style={{ display: "grid", gap: 14 }}>
              {PHASES.map((p, i) => {
                const prog = progress[p.id];
                return (
                  <button key={p.id} onClick={() => { sndTick(); setPhase(p); setStep(2); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100); }}
                    style={{ ...S.btn, display: "flex", alignItems: "center", gap: 14, background: `${p.color}10`, border: `2px solid ${p.color}30`, borderRadius: 18, padding: "16px 18px", textAlign: "left", animation: `fadeUp 0.4s ease ${i * 0.08}s both`, width: "100%" }}>
                    <div style={{ fontSize: 36, lineHeight: 1 }}>{p.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 900, fontSize: 16, color: p.color }}>Phase {p.num}: {p.name}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{p.ages} — {p.desc}</div>
                      {prog?.sessions > 0 && <div style={{ fontSize: 10, color: "#A8E063", marginTop: 4, fontWeight: 700 }}>✓ {prog.sessions} session{prog.sessions > 1 ? 's' : ''} completed</div>}
                    </div>
                    <div style={{ fontSize: 20, color: "rgba(255,255,255,0.2)" }}>→</div>
                  </button>
                );
              })}
            </div>

            {/* Links */}
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
              <a href="/reading" style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textDecoration: "none", fontWeight: 700 }}>📚 Reading</a>
              <a href="/spelling-bee" style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textDecoration: "none", fontWeight: 700 }}>🐝 Spelling Bee</a>
              <a href="/kids" style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textDecoration: "none", fontWeight: 700 }}>⭐ Kids Zone</a>
            </div>
          </div>
        )}

        {/* ── STEP 2: Activity Selection ─────────────────────── */}
        {step === 2 && phase && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>{phase.emoji}</div>
              <h2 style={{ fontSize: isMobile ? 22 : 30, fontWeight: 900, margin: "0 0 6px", color: phase.color }}>Phase {phase.num}: {phase.name}</h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{phase.ages} — {phase.desc}</p>
            </div>

            {/* Sound overview for Phases 2+ */}
            {phase.sounds?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 10 }}>SOUNDS IN THIS PHASE</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {phase.sounds.flatMap(s => s.letters).map(letter => (
                    <div key={letter} style={{ background: `${phase.color}15`, border: `1px solid ${phase.color}35`, borderRadius: 12, padding: "8px 14px", fontSize: 18, fontWeight: 900, color: phase.color, minWidth: 44, textAlign: "center" }}>
                      {letter}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tricky words for this phase */}
            {phase.trickyWords?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 10 }}>TRICKY WORDS TO LEARN</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {phase.trickyWords.map(w => (
                    <span key={w} style={{ background: "rgba(255,195,0,0.1)", border: "1px solid rgba(255,195,0,0.25)", borderRadius: 8, padding: "4px 10px", fontSize: 13, fontWeight: 700, color: "#FFC300" }}>{w}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Activity cards */}
            {phase.activities?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 10 }}>ACTIVITIES</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                  {phase.activities.map(act => (
                    <button key={act.title} onClick={() => { sndTick(); startChat(act); }}
                      style={{ ...S.btn, background: `${phase.color}10`, border: `1px solid ${phase.color}25`, borderRadius: 16, padding: "14px 12px", textAlign: "center", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700 }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>{act.emoji}</div>
                      {act.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Start learning button */}
            <button onClick={() => { sndWin(); startChat(null); }}
              style={{ ...S.btn, width: "100%", background: `linear-gradient(135deg,${phase.color},${phase.color}BB)`, borderRadius: 16, padding: "16px", color: "#060B20", fontSize: 16, fontWeight: 900, marginTop: 8 }}>
              Start Learning Phase {phase.num} →
            </button>
          </div>
        )}

        {/* ── STEP 3: Chat ────────────────────────────────────── */}
        {step === 3 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            {/* Phase badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 24 }}>{phase?.emoji}</span>
              <span style={{ fontWeight: 900, fontSize: 14, color: accent }}>Phase {phase?.num}: {phase?.name}</span>
              {activity && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>— {activity.title}</span>}
            </div>

            {/* Chat area */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden" }}>
              <div role="log" aria-label="Phonics chat with Starky" style={{ height: isMobile ? 380 : 460, overflowY: "auto", padding: isMobile ? 14 : 20, display: "flex", flexDirection: "column", gap: 12 }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 8, animation: "fadeUp 0.3s ease" }}>
                    {msg.role === "assistant" && <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${accent}20`, border: `1px solid ${accent}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>⭐</div>}
                    <div style={{ maxWidth: "85%", padding: "12px 15px", borderRadius: 16, background: msg.role === "user" ? `linear-gradient(135deg,${accent}CC,${accent}88)` : "rgba(255,255,255,0.06)", color: msg.role === "user" ? "#060B20" : "rgba(255,255,255,0.9)", fontSize: 15, lineHeight: 1.8, fontWeight: msg.role === "user" ? 700 : 400, whiteSpace: "pre-wrap" }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${accent}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⭐</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[0, 0.2, 0.4].map((d, j) => <div key={j} style={{ width: 8, height: 8, borderRadius: "50%", background: accent, animation: `bounce 1s ${d}s ease-in-out infinite`, opacity: 0.7 }} />)}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: "12px 16px", borderTop: `1px solid ${accent}15` }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } }}
                    placeholder="Type or say the sound..."
                    style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: `1px solid ${accent}22`, borderRadius: 14, padding: "12px 14px", color: "#fff", fontSize: 16, fontFamily: "'Nunito',sans-serif" }} />
                  <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                    style={{ ...S.btn, background: input.trim() && !loading ? `linear-gradient(135deg,${accent},${accent}BB)` : "rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 20px", color: input.trim() && !loading ? "#060B20" : "rgba(255,255,255,0.3)", fontWeight: 900, fontSize: 15 }}>
                    {loading ? "..." : "→"}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick prompts */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 12 }}>
              {[
                { e: "🔊", t: "Say the sound", p: "What sound does the next letter make? Show me and I'll try!" },
                { e: "📖", t: "Read a sentence", p: "Give me a sentence to read using only the sounds I know." },
                { e: "🎮", t: "Play a game", p: "Can we play a phonics game? Make it fun!" },
                { e: "🔄", t: "Review sounds", p: "Let's review the sounds I've already learned. Quick fire!" },
              ].map(q => (
                <button key={q.t} onClick={() => sendMessage(q.p)}
                  style={{ ...S.btn, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "10px 8px", textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700 }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{q.e}</div>
                  {q.t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ padding: "40px 16px 20px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: 48 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
          Phonics programme based on Letters and Sounds (UK DfES 2007) · Orton-Gillingham multisensory method
        </div>
      </footer>
      <LegalFooter sen={true} />
    </div>
  );
}
