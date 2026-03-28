import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useSessionLimit } from "../utils/useSessionLimit";
import { AGE_GROUPS, ACTIVITIES, getSummerPrompt, BADGES } from "../utils/summerKnowledge";
import { CONTENT_PROTECTION } from "../utils/contentProtection";

// ── Audio ──
let _ctx = null;
function gCtx() { if (!_ctx) try { _ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch {} return _ctx; }
function tone(f,t,v,d,dl) { const c=gCtx(); if(!c) return; const o=c.createOscillator(),g=c.createGain(); o.connect(g);g.connect(c.destination);o.type=t||'sine';o.frequency.value=f; const ts=c.currentTime+(dl||0); g.gain.setValueAtTime(0,ts);g.gain.linearRampToValueAtTime(v||0.12,ts+0.02);g.gain.exponentialRampToValueAtTime(0.001,ts+d); o.start(ts);o.stop(ts+d+0.05); }
function sndTick(){tone(880,'sine',0.08,0.08)}
function sndWin(){tone(523,'sine',0.15,0.35);tone(659,'sine',0.15,0.3,0.1);tone(784,'sine',0.15,0.3,0.2);tone(1047,'sine',0.15,0.35,0.3)}

// ── Passport persistence ──
const PASS_KEY = "nw_summer_passport";
function loadPassport() { try { return JSON.parse(localStorage.getItem(PASS_KEY)||'{}'); } catch { return {}; } }
function savePassport(d) { try { localStorage.setItem(PASS_KEY, JSON.stringify(d)); } catch {} }

export default function SummerPage() {
  const [step, setStep] = useState(1); // 1=age, 2=hub, 3=activity
  const [group, setGroup] = useState(null);
  const [activity, setActivity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [passport, setPassport] = useState({});
  const chatEndRef = useRef(null);
  const { recordCall, limitReached } = useSessionLimit();

  useEffect(() => { const fn=()=>setIsMobile(window.innerWidth<768); fn(); window.addEventListener("resize",fn); return ()=>window.removeEventListener("resize",fn); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages, loading]);
  useEffect(() => { setPassport(loadPassport()); }, []);

  const totalStamps = passport.stamps?.length || 0;
  const streak = passport.streak?.current || 0;

  // Check if summer is active (June 1 - August 31)
  const now = new Date();
  const month = now.getMonth(); // 0-indexed
  const isSummerActive = month >= 5 && month <= 7; // June=5, July=6, Aug=7
  const summerStart = new Date(now.getFullYear(), 5, 1);
  const daysUntilSummer = !isSummerActive && month < 5 ? Math.ceil((summerStart - now) / 86400000) : 0;

  const startActivity = (act) => {
    setActivity(act);
    setMessages([{ role: 'assistant', content: `${act.emoji} Welcome to **${act.name}**!\n\n${act.desc}\n\nReady? Let's go!` }]);
    setStep(3);
    window.scrollTo({top:0,behavior:'smooth'});
  };

  const sendMessage = async (text) => {
    const txt = (text || input).trim();
    if (!txt || loading || limitReached) return;
    setInput(""); recordCall(); sndTick();
    const prev = [...messages, { role:"user", content:txt }];
    setMessages(prev); setLoading(true);
    try {
      const system = CONTENT_PROTECTION + '\n\n' + getSummerPrompt(group?.id, activity?.id);
      const res = await fetch("/api/chat", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model: /* PERMANENT: Haiku 3 only */ "claude-3-haiku-20240307", max_tokens: group?.id === 'scholars' ? 1200 : 800, system, messages: prev.map(m=>({role:m.role,content:m.content})) }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Something went wrong!";
      setMessages(p => [...p, { role:"assistant", content: reply }]);
      sndTick();

      // Record stamp after 3+ exchanges
      if (prev.filter(m=>m.role==='user').length === 3) {
        sndWin();
        const p = loadPassport();
        if (!p.stamps) p.stamps = [];
        p.stamps.push({ activity: activity?.id, group: group?.id, date: new Date().toISOString().split('T')[0] });
        if (!p.streak) p.streak = { current: 0, longest: 0, lastDate: null };
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now()-86400000).toISOString().split('T')[0];
        if (p.streak.lastDate === yesterday || p.streak.lastDate === today) {
          if (p.streak.lastDate === yesterday) p.streak.current++;
        } else { p.streak.current = 1; }
        p.streak.lastDate = today;
        if (p.streak.current > (p.streak.longest||0)) p.streak.longest = p.streak.current;
        savePassport(p); setPassport(p);
      }

      // Signal collection
      try {
        const { recordMessageSignal } = await import('../utils/signalCollector');
        const profile = JSON.parse(localStorage.getItem('nw_user')||'{}');
        recordMessageSignal({ email: profile.email||'anonymous', subject: `Summer-${activity?.name}`, grade: profile.grade||'', userMessage: txt, starkyResponse: reply, sessionNumber: 1 });
      } catch {}
    } catch {
      setMessages(p => [...p, { role:"assistant", content:"Connection error. Try again!" }]);
    }
    setLoading(false);
  };

  const accent = group?.color || '#FFC300';

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(180deg,#0D1221 0%,#1a2035 50%,#0D1221 100%)", fontFamily:"'Sora',-apple-system,sans-serif", color:"#fff" }}>
      <Head>
        <title>Summer School 2026 — NewWorldEdu</title>
        <meta name="description" content="Virtual summer school for Pakistani students. Fun activities, reading clubs, science experiments, and creative projects — powered by Starky." />
      </Head>

      {/* Header */}
      <header style={{ padding:isMobile?"12px 16px":"14px 28px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ textDecoration:"none", fontWeight:900, fontSize:15, color:"#fff" }}>NewWorldEdu<span style={{color:"#4F8EF7"}}>★</span></a>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          {totalStamps > 0 && <span style={{ fontSize:12, color:"#FFC300", fontWeight:700 }}>🌟 {totalStamps} stamps</span>}
          {streak > 0 && <span style={{ fontSize:12, color:"#FF8E53", fontWeight:700 }}>🔥 {streak}d</span>}
          {step > 1 && <button onClick={()=>{setStep(step===3?2:1);setMessages([]);}} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"6px 12px", color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>← Back</button>}
        </div>
      </header>

      <div style={{ maxWidth:600, margin:"0 auto", padding:isMobile?"24px 16px":"40px 24px" }}>

        {/* ═══ STEP 1: Age Group ═══ */}
        {step === 1 && (
          <div>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <div style={{ fontSize:56, marginBottom:8 }}>☀️</div>
              <h1 style={{ fontSize:isMobile?26:36, fontWeight:900, margin:"0 0 8px" }}>
                Summer School <span style={{color:"#FFC300"}}>2026</span>
              </h1>
              <p style={{ color:"rgba(255,255,255,0.55)", fontSize:15, margin:0 }}>Learn while you play. No homework. No pressure. Just fun.</p>
              {!isSummerActive && daysUntilSummer > 0 && (
                <div style={{ marginTop:12, background:"rgba(255,195,0,0.1)", border:"1px solid rgba(255,195,0,0.2)", borderRadius:12, padding:"10px 16px", fontSize:13, color:"#FFC300" }}>
                  ☀️ Summer School opens in {daysUntilSummer} days!
                </div>
              )}
            </div>

            <div style={{ display:"grid", gap:12 }}>
              {AGE_GROUPS.map((g, i) => (
                <button key={g.id} onClick={()=>{sndTick();setGroup(g);setStep(2);window.scrollTo({top:0,behavior:'smooth'});}}
                  style={{ display:"flex", alignItems:"center", gap:14, background:`${g.color}10`, border:`2px solid ${g.color}30`, borderRadius:18, padding:"18px", textAlign:"left", cursor:"pointer", fontFamily:"'Sora',sans-serif", width:"100%" }}>
                  <div style={{ fontSize:36 }}>{g.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:900, fontSize:17, color:g.color }}>{g.name}</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>{g.ages} · {g.desc}</div>
                  </div>
                  <div style={{ fontSize:20, color:"rgba(255,255,255,0.2)" }}>→</div>
                </button>
              ))}
            </div>

            {/* Passport summary */}
            {totalStamps > 0 && (
              <div style={{ marginTop:24, textAlign:"center" }}>
                <div style={{ fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.4)", marginBottom:8 }}>YOUR SUMMER PASSPORT</div>
                <div style={{ display:"flex", justifyContent:"center", gap:12 }}>
                  <div style={{ background:"rgba(255,195,0,0.1)", border:"1px solid rgba(255,195,0,0.2)", borderRadius:12, padding:"10px 20px", textAlign:"center" }}>
                    <div style={{ fontSize:22, fontWeight:900, color:"#FFC300" }}>{totalStamps}</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>Stamps</div>
                  </div>
                  <div style={{ background:"rgba(255,142,83,0.1)", border:"1px solid rgba(255,142,83,0.2)", borderRadius:12, padding:"10px 20px", textAlign:"center" }}>
                    <div style={{ fontSize:22, fontWeight:900, color:"#FF8E53" }}>{streak}</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>Day Streak</div>
                  </div>
                </div>
                {/* Badges */}
                <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:10, flexWrap:"wrap" }}>
                  {BADGES.filter(b => {
                    if (b.id === 'first_stamp') return totalStamps >= b.threshold;
                    if (b.id.startsWith('streak_')) return streak >= b.threshold;
                    if (b.id === 'champion') return totalStamps >= b.threshold;
                    return false;
                  }).map(b => (
                    <span key={b.id} style={{ fontSize:10, background:"rgba(255,255,255,0.06)", borderRadius:8, padding:"4px 8px", color:"rgba(255,255,255,0.6)" }}>{b.emoji} {b.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ STEP 2: Activity Hub ═══ */}
        {step === 2 && group && (
          <div>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:48, marginBottom:6 }}>{group.emoji}</div>
              <h2 style={{ fontSize:isMobile?22:28, fontWeight:900, margin:"0 0 4px", color:accent }}>{group.name}</h2>
              <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, margin:0 }}>{group.ages} · Pick any activity</p>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:12 }}>
              {(ACTIVITIES[group.id]||[]).map(act => (
                <button key={act.id} onClick={()=>{sndTick();startActivity(act);}}
                  style={{ background:`${act.color}10`, border:`1.5px solid ${act.color}25`, borderRadius:16, padding:"18px 16px", cursor:"pointer", textAlign:"left", fontFamily:"'Sora',sans-serif", width:"100%" }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>{act.emoji}</div>
                  <div style={{ fontWeight:800, fontSize:14, color:act.color, marginBottom:4 }}>{act.name}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.6 }}>{act.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Activity (Chat) ═══ */}
        {step === 3 && activity && (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <span style={{ fontSize:24 }}>{activity.emoji}</span>
              <span style={{ fontWeight:900, fontSize:15, color:activity.color }}>{activity.name}</span>
            </div>

            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, overflow:"hidden" }}>
              <div role="log" style={{ height:isMobile?"calc(100vh - 280px)":"420px", minHeight:200, maxHeight:500, overflowY:"auto", padding:isMobile?14:20, display:"flex", flexDirection:"column", gap:12, WebkitOverflowScrolling:"touch" }}>
                {messages.map((msg,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start", gap:8 }}>
                    {msg.role==="assistant" && <div style={{ width:28, height:28, borderRadius:"50%", background:`${accent}20`, border:`1px solid ${accent}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>☀️</div>}
                    <div style={{ maxWidth:"85%", padding:"12px 15px", borderRadius:16, background:msg.role==="user"?`linear-gradient(135deg,${accent}CC,${accent}88)`:"rgba(255,255,255,0.06)", color:msg.role==="user"?"#060B20":"rgba(255,255,255,0.9)", fontSize:15, lineHeight:1.8, fontWeight:msg.role==="user"?700:400, whiteSpace:"pre-wrap" }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && <div style={{ display:"flex", alignItems:"center", gap:6 }}><div style={{ width:28, height:28, borderRadius:"50%", background:`${accent}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>☀️</div><span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>Starky is thinking...</span></div>}
                <div ref={chatEndRef}/>
              </div>

              <div style={{ padding:"12px 16px", borderTop:`1px solid ${accent}15` }}>
                <div style={{ display:"flex", gap:8 }}>
                  <input value={input} onChange={e=>setInput(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();sendMessage();}}}
                    onFocus={e=>setTimeout(()=>e.target.scrollIntoView({behavior:'smooth',block:'nearest'}),300)}
                    placeholder="Type here..." style={{ flex:1, background:"rgba(255,255,255,0.04)", border:`1px solid ${accent}22`, borderRadius:14, padding:"12px 14px", color:"#fff", fontSize:16, fontFamily:"'Sora',sans-serif" }} />
                  <button onClick={()=>sendMessage()} disabled={!input.trim()||loading}
                    style={{ background:input.trim()&&!loading?`linear-gradient(135deg,${accent},${accent}BB)`:"rgba(255,255,255,0.08)", borderRadius:14, padding:"12px 20px", color:input.trim()&&!loading?"#060B20":"rgba(255,255,255,0.3)", fontWeight:900, fontSize:15, border:"none", cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>
                    {loading?"...":"→"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer style={{ padding:"40px 16px 20px", textAlign:"center", borderTop:"1px solid rgba(255,255,255,0.04)", marginTop:48 }}>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.2)" }}>Summer School 2026 · NewWorldEdu · khurram@newworld.education</div>
      </footer>
    </div>
  );
}
