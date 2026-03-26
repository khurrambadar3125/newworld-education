// pages/parent.jsx
// ─────────────────────────────────────────────────────────────────────────────
// PARENT PORTAL
//
// Solves three problems from the original list:
//   #6  Under-10s have no email — parent signs up, children just tap their avatar
//   #7  One parent, multiple children — up to 4 child profiles under one account
//   #3  MITE menu — "Try Starky" and "Parent Portal" now visible in homepage nav
//
// Storage: localStorage (no backend required)
//   nw_parent       = { email, parentName, children: [{ id, name, grade, avatar, color }] }
//   nw_active_child = { id, name, grade, avatar, color }
//   nw_child_{id}   = sessions used by that child (mirrors nw_sessions_used for them)
//
// Flow:
//   1. Parent enters email + their name → account created in localStorage
//   2. Parent adds children: name + grade + avatar (no child email needed)
//   3. "Who's learning today?" screen — big tappable avatars
//   4. Child taps their avatar → saved as active child → redirect to /demo
//   5. demo.jsx reads nw_active_child and personalises greeting + tracks sessions
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import Head from "next/head";

// ── Child Progress Component — shows weak topics, mistakes, last session from KV ──
function ChildProgress({ children, parentEmail }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const fetchChild = async (child) => {
    if (data[child.id]) { setExpanded(expanded === child.id ? null : child.id); return; }
    setExpanded(child.id); setLoading(true);
    try {
      const childEmail = child.email;
      if (!childEmail) { setData(d => ({ ...d, [child.id]: null })); setLoading(false); return; }
      const res = await fetch('/api/parent-data', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentEmail, childEmail }),
      });
      const result = await res.json();
      setData(d => ({ ...d, [child.id]: result.memory || null }));
    } catch { setData(d => ({ ...d, [child.id]: null })); }
    setLoading(false);
  };

  return (
    <div style={{marginTop:20,background:"rgba(79,142,247,0.06)",border:"1px solid rgba(79,142,247,0.18)",borderRadius:20,padding:"20px 22px"}}>
      <div style={{fontWeight:900,fontSize:15,color:"#4F8EF7",marginBottom:4}}>📊 Child Progress</div>
      <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginBottom:14}}>Tap a child to see their weak topics and recent mistakes</div>
      {children.map(child => (
        <div key={child.id} style={{marginBottom:10}}>
          <button onClick={() => fetchChild(child)} style={{width:"100%",textAlign:"left",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"12px 14px",cursor:"pointer",color:"#fff",fontFamily:"'Nunito',sans-serif"}}>
            <span style={{fontSize:18,marginRight:8}}>{child.avatar}</span>
            <span style={{fontWeight:800,color:child.color}}>{child.name}</span>
            <span style={{float:"right",color:"rgba(255,255,255,0.3)"}}>{expanded === child.id ? '▼' : '▶'}</span>
          </button>
          {expanded === child.id && (
            <div style={{padding:"12px 14px",background:"rgba(255,255,255,0.02)",borderRadius:"0 0 14px 14px",border:"1px solid rgba(255,255,255,0.06)",borderTop:"none"}}>
              {loading ? <div style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>Loading...</div>
              : !data[child.id] ? <div style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>No session data yet. They need to study with Starky first.</div>
              : (
                <>
                  <div style={{display:"flex",gap:10,marginBottom:10,flexWrap:"wrap"}}>
                    <div style={{background:"rgba(168,224,99,0.1)",border:"1px solid rgba(168,224,99,0.25)",borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:700}}>
                      <span style={{color:"#A8E063"}}>{data[child.id].totalSessions || 0}</span> sessions
                    </div>
                    {data[child.id].currentSubject && (
                      <div style={{background:"rgba(79,142,247,0.1)",border:"1px solid rgba(79,142,247,0.25)",borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:700}}>
                        📚 <span style={{color:"#4F8EF7"}}>{data[child.id].currentSubject}</span>
                      </div>
                    )}
                    {data[child.id].lastSeen && (
                      <div style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"8px 12px",fontSize:12,color:"rgba(255,255,255,0.4)"}}>
                        Last seen: {new Date(data[child.id].lastSeen).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  {data[child.id].weakTopics?.length > 0 && (
                    <div style={{marginBottom:10}}>
                      <div style={{fontSize:11,fontWeight:800,color:"#FFC300",marginBottom:6}}>⚠️ WEAK TOPICS</div>
                      {data[child.id].weakTopics.map((t,i) => (
                        <div key={i} style={{fontSize:13,color:"rgba(255,255,255,0.6)",padding:"2px 0"}}>• {t}</div>
                      ))}
                    </div>
                  )}
                  {data[child.id].recentMistakes?.length > 0 && (
                    <div>
                      <div style={{fontSize:11,fontWeight:800,color:"#F87171",marginBottom:6}}>❌ RECENT MISTAKES</div>
                      {data[child.id].recentMistakes.slice(0,5).map((m,i) => (
                        <div key={i} style={{fontSize:13,color:"rgba(255,255,255,0.6)",padding:"2px 0"}}>• <strong>{m.topic}:</strong> {m.description}</div>
                      ))}
                    </div>
                  )}
                  {data[child.id].sessionSummary && (
                    <div style={{marginTop:10,fontSize:13,color:"rgba(255,255,255,0.5)",fontStyle:"italic",lineHeight:1.6}}>
                      💬 Last session: {data[child.id].sessionSummary}
                    </div>
                  )}
                  {/* Parent feedback — sends message to child's next Starky session */}
                  <ParentFeedback child={child} parentName={parentEmail} />
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ParentFeedback({ child, parentName }) {
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  if (!child.email) return <div style={{marginTop:10,fontSize:12,color:"rgba(255,255,255,0.25)"}}>Add your child's email to send them feedback remotely.</div>;
  return (
    <div style={{marginTop:12}}>
      <div style={{fontSize:11,fontWeight:800,color:"#A78BFA",marginBottom:6}}>💬 SEND FEEDBACK TO {child.name.toUpperCase()}</div>
      {sent ? <div style={{fontSize:13,color:"#4ADE80"}}>Sent! They'll see it when they open Starky.</div> : (
        <div style={{display:"flex",gap:8}}>
          <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Great work on Chemistry! Focus on equations next."
            style={{flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"8px 12px",color:"#fff",fontSize:13,fontFamily:"'Nunito',sans-serif"}} />
          <button onClick={async () => {
            if (!msg.trim()) return;
            try { await fetch('/api/assignment', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ childEmail:child.email, feedback:msg.trim(), parentName }) }); } catch {}
            setSent(true); setMsg(''); setTimeout(()=>setSent(false),3000);
          }} style={{background:"linear-gradient(135deg,#A78BFA,#7C5CBF)",border:"none",borderRadius:10,padding:"8px 16px",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif",whiteSpace:"nowrap"}}>
            Send →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Set Assignment Component — parent tells Starky what child should study next ──
function SetAssignment({ children, parentName }) {
  const [selectedChild, setSelectedChild] = useState(null);
  const [topic, setTopic] = useState('');
  const [saved, setSaved] = useState(null); // null | 'synced' | 'local'
  const [sending, setSending] = useState(false);

  const save = async () => {
    if (!selectedChild || !topic.trim()) return;
    const child = children.find(c => c.id === selectedChild);
    const childEmail = child?.email;
    setSending(true);

    // Save to KV (cross-device) if child has email, otherwise localStorage fallback
    let kvSaved = false;
    if (childEmail) {
      try {
        const res = await fetch('/api/assignment', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ childEmail, topic: topic.trim(), parentName }),
        });
        if (res.ok) kvSaved = true;
      } catch {}
    }
    // Also save localStorage as fallback (same-device)
    try { localStorage.setItem(`nw_assignment_${selectedChild}`, JSON.stringify({ topic: topic.trim(), setAt: new Date().toISOString(), setBy: parentName || 'parent' })); } catch {}

    setSaved(kvSaved ? 'synced' : 'local'); setSending(false);
    setTimeout(() => setSaved(null), 4000);
    setTopic('');
  };

  return (
    <div style={{marginTop:20,background:"rgba(167,139,250,0.06)",border:"1px solid rgba(167,139,250,0.18)",borderRadius:20,padding:"20px 22px"}}>
      <div style={{fontWeight:900,fontSize:15,color:"#A78BFA",marginBottom:4}}>📋 Set Assignment</div>
      <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginBottom:14}}>Tell Starky what your child should study next. They'll see it when they open Starky.</div>
      <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
        {children.map(c => (
          <button key={c.id} onClick={() => setSelectedChild(c.id)} style={{
            background: selectedChild === c.id ? `${c.color}20` : "rgba(255,255,255,0.04)",
            border: `1px solid ${selectedChild === c.id ? c.color : "rgba(255,255,255,0.08)"}`,
            borderRadius:10, padding:"8px 14px", cursor:"pointer", color: selectedChild === c.id ? c.color : "rgba(255,255,255,0.6)",
            fontWeight:700, fontSize:13, fontFamily:"'Nunito',sans-serif",
          }}>
            {c.avatar} {c.name}
          </button>
        ))}
      </div>
      {selectedChild && (
        <>
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Urdu Paper 1 — nazm analysis, Chapter 5 Biology"
            style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,padding:"12px 14px",color:"#fff",fontSize:14,fontFamily:"'Nunito',sans-serif",boxSizing:"border-box",marginBottom:10}} />
          <button onClick={save} disabled={!topic.trim()} style={{
            width:"100%",background:topic.trim()?"linear-gradient(135deg,#A78BFA,#7C5CBF)":"rgba(255,255,255,0.06)",
            border:"none",borderRadius:12,padding:"12px",color:topic.trim()?"#fff":"rgba(255,255,255,0.3)",
            fontWeight:800,fontSize:14,cursor:topic.trim()?"pointer":"not-allowed",fontFamily:"'Nunito',sans-serif",
          }}>
            {saved === 'synced' ? '✅ Saved — your child will see it!' : saved === 'local' ? '✅ Saved on this device only' : 'Set Assignment →'}
          </button>
        </>
      )}
    </div>
  );
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const STORAGE_KEY   = "nw_parent";
const ACTIVE_KEY    = "nw_active_child";
const PAYPAL        = "https://paypal.me/NewWorldEdu";

const AVATARS = ["🦁","🐯","🐻","🦊","🦄","🐬","🦋","🐉","🦅","🌟","🚀","🎸"];
const COLORS  = ["#63D2FF","#A8E063","#FFC300","#FF8C69","#C77DFF","#FF6B6B","#52C97A","#63D2FF"];

const GRADES = [
  { id:"nursery",  label:"Nursery / KG",    age:"3–5",  emoji:"🧸" },
  { id:"grade12",  label:"Grade 1–2",       age:"6–7",  emoji:"🌱" },
  { id:"grade34",  label:"Grade 3–4",       age:"8–9",  emoji:"🌿" },
  { id:"grade56",  label:"Grade 5–6",       age:"10–11",emoji:"🌳" },
  { id:"grade78",  label:"Grade 7–8",       age:"12–13",emoji:"📚" },
  { id:"olevel",   label:"O Level",         age:"14–16",emoji:"🎓" },
  { id:"alevel",   label:"A Level",         age:"16–18",emoji:"🏆" },
  { id:"uni",      label:"University",      age:"18+",  emoji:"🎓" },
];

// ── STORAGE HELPERS ──────────────────────────────────────────────────────────
function loadAccount() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch { return null; }
}
function saveAccount(acc) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(acc)); } catch {} }

function loadChildSessions(childId) {
  return parseInt(localStorage.getItem(`nw_child_${childId}`) || "0", 10);
}

function setActiveChild(child) {
  try {
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(child));
    // Also sync the global session counter to this child's usage
    localStorage.setItem("nw_sessions_used", String(loadChildSessions(child.id)));
  } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ParentPage() {
  const [account,   setAccount]   = useState(null);   // loaded account or null
  const [screen,    setScreen]    = useState("check"); // check|setup|add-child|pick-child|dashboard
  const [isMobile,  setIsMobile]  = useState(false);

  // Setup form
  const [parentName,  setParentName]  = useState("");
  const [email,       setEmail]       = useState("");
  const [emailErr,    setEmailErr]    = useState("");

  // Add child form
  const [childName,   setChildName]   = useState("");
  const [childEmail,  setChildEmail]  = useState("");
  const [childGrade,  setChildGrade]  = useState("");
  const [childSEN,      setChildSEN]      = useState([]);  // array of condition ids (multiple selection)
  const [childSeverity, setChildSeverity] = useState("");  // mild, moderate, severe
  const [childAvatar,   setChildAvatar]   = useState("🦁");
  const [childColor,    setChildColor]    = useState("#63D2FF");
  const [addErr,        setAddErr]        = useState("");

  const SEN_OPTIONS = [
    { id:'', label:'No special needs' },
    { id:'autism', label:'🌟 Autism Spectrum', color:'#63D2FF' },
    { id:'adhd', label:'⚡ ADHD', color:'#FFC300' },
    { id:'dyslexia', label:'🎵 Dyslexia', color:'#FF8C69' },
    { id:'ds', label:'💛 Down Syndrome', color:'#A8E063' },
    { id:'cp', label:'💪 Cerebral Palsy', color:'#C77DFF' },
    { id:'vi', label:'✨ Visual Impairment', color:'#FFC300' },
    { id:'hi', label:'🎵 Hearing Impairment', color:'#FF6B6B' },
    { id:'dyscalculia', label:'🔢 Dyscalculia', color:'#FF85A1' },
    { id:'dyspraxia', label:'🤸 Dyspraxia / DCD', color:'#7ECFC0' },
    { id:'dysgraphia', label:'✏️ Dysgraphia', color:'#FFB347' },
    { id:'sensory', label:'🌊 Sensory Processing', color:'#B8D4E3' },
    { id:'unsure', label:'❓ Not Sure / Undiagnosed', color:'#A78BFA' },
  ];
  const SEVERITY_OPTIONS = [
    { id:'mild', label:'Mild', color:'#A8E063', desc:'Can read and write independently. Needs some support with complex tasks.' },
    { id:'moderate', label:'Moderate', color:'#FFC300', desc:'Can read but struggles with writing. Needs regular support and adapted teaching.' },
    { id:'severe', label:'Severe', color:'#FF6B6B', desc:'Cannot read or write independently. Needs full support and specialist approaches.' },
    { id:'unsure', label:'Not sure', color:'#A78BFA', desc:'I don\'t know the severity yet — Starky will adapt as we learn together.' },
  ];
  const [editingId,   setEditingId]   = useState(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn(); window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const [senMode, setSenMode] = useState(false); // SEN parent registration flow

  // On mount — check if account exists + detect ?sen=1 query param
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('sen') === '1') setSenMode(true);
    } catch {}
    const acc = loadAccount();
    if (acc && acc.email) {
      setAccount(acc);
      // If they have children → go to child picker. Otherwise → dashboard to add.
      setScreen(acc.children?.length > 0 ? "pick-child" : "dashboard");
    } else {
      setScreen("setup");
    }
  }, []);

  // ── SETUP: Parent creates account ────────────────────────────────────────
  const handleSetup = () => {
    if (!parentName.trim()) { setEmailErr("Please enter your name."); return; }
    if (!email.includes("@")) { setEmailErr("Please enter a valid email."); return; }
    const acc = { email: email.trim(), parentName: parentName.trim(), children: [] };
    saveAccount(acc);
    setAccount(acc);
    setEmailErr("");
    setScreen("dashboard");
    // SEN mode: auto-open add child flow with SEN prompt
    if (senMode) {
      setTimeout(() => {
        setChildSEN(['unsure']); // pre-select "Not Sure / Undiagnosed" as default
        setScreen("dashboard"); // dashboard has the add child form
      }, 100);
    }
  };

  // ── ADD CHILD ─────────────────────────────────────────────────────────────
  const handleAddChild = () => {
    if (!childName.trim()) { setAddErr("Please enter the child's name."); return; }
    // Grade is optional for SEN children — they may not fit standard grade levels
    if (!childGrade && childSEN.length === 0) { setAddErr("Please pick a grade or select a SEN condition."); return; }
    if (account.children.length >= 4 && !editingId) { setAddErr("Maximum 4 children per account."); return; }

    const senData = childSEN.length > 0 ? {
      senCondition: childSEN[0], // primary condition (for backward compatibility)
      senConditions: childSEN,   // all conditions (new: multiple selection)
      senSeverity: childSeverity || 'unsure',
    } : { senCondition: '', senConditions: [], senSeverity: '' };

    const updated = { ...account };
    if (editingId) {
      updated.children = updated.children.map(c =>
        c.id === editingId
          ? { ...c, name: childName.trim(), email: childEmail.trim() || c.email, grade: childGrade || c.grade || 'SEN', ...senData, avatar: childAvatar, color: childColor }
          : c
      );
      setEditingId(null);
    } else {
      const id = `child_${Date.now()}`;
      updated.children = [...updated.children, {
        id, name: childName.trim(), email: childEmail.trim() || '', grade: childGrade || 'SEN',
        ...senData, avatar: childAvatar, color: childColor,
      }];
    }
    saveAccount(updated);
    setAccount(updated);
    setChildName(""); setChildEmail(""); setChildGrade(""); setChildSEN([]); setChildSeverity(""); setChildAvatar("🦁"); setChildColor("#63D2FF"); setAddErr("");
    setScreen("pick-child");
  };

  const startEdit = (child) => {
    setEditingId(child.id);
    setChildName(child.name);
    setChildGrade(child.grade || '');
    setChildSEN(child.senConditions || (child.senCondition ? [child.senCondition] : []));
    setChildSeverity(child.senSeverity || '');
    setChildAvatar(child.avatar);
    setChildColor(child.color);
    setScreen("add-child");
  };

  const removeChild = (id) => {
    const updated = { ...account, children: account.children.filter(c => c.id !== id) };
    saveAccount(updated);
    setAccount(updated);
  };

  // ── SELECT CHILD → go to demo ────────────────────────────────────────────
  const selectChild = (child) => {
    setActiveChild(child);
    window.location.href = "/demo";
  };

  // ── LOGOUT ───────────────────────────────────────────────────────────────
  const logout = () => {
    if (confirm("This will clear the account from this device. Continue?")) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVE_KEY);
      setAccount(null);
      setScreen("setup");
    }
  };

  // ── STYLES ────────────────────────────────────────────────────────────────
  const S = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg,#060B20 0%,#0C1A3A 60%,#060B20 100%)",
      fontFamily: "'Nunito',sans-serif", color: "#fff",
    },
    hdr: {
      padding: isMobile ? "14px 16px" : "14px 28px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    },
    card: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: 20, padding: isMobile ? "24px 18px" : "32px 28px",
    },
    input: {
      width: "100%", background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14,
      padding: "13px 16px", color: "#fff", fontSize: 15,
      fontFamily: "'Nunito',sans-serif", boxSizing: "border-box",
      outline: "none",
    },
    btn: (primary, color = "#A8E063") => ({
      width: "100%", padding: "14px", borderRadius: 14, border: "none",
      background: primary
        ? `linear-gradient(135deg,${color},${color}CC)`
        : "rgba(255,255,255,0.06)",
      color: primary ? "#060B20" : "#fff",
      fontWeight: 900, fontSize: 15, cursor: "pointer",
      fontFamily: "'Nunito',sans-serif", transition: "all 0.15s",
    }),
  };

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
    *{box-sizing:border-box} button:focus,input:focus,select:focus{outline:none}
    ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:4px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
    @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
    .child-card:hover{transform:translateY(-4px)!important;box-shadow:0 12px 40px rgba(0,0,0,0.4)!important}
    .child-card:active{transform:scale(0.97)!important}
  `;

  const Header = () => (
    <header style={S.hdr}>
      <a href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:8 }}>
        <span style={{fontSize:20}}>🌍</span>
        <span style={{fontWeight:900,fontSize:16}}>NewWorld <span style={{color:"#63D2FF"}}>EDUCATION</span></span>
      </a>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        {account && (
          <span style={{fontSize:13,color:"rgba(255,255,255,0.4)",fontWeight:700}}>
            👋 {account.parentName}
          </span>
        )}
        {account && screen !== "pick-child" && (
          <button onClick={()=>setScreen("pick-child")}
            style={{...S.btn(false),width:"auto",padding:"7px 14px",fontSize:12,borderRadius:10}}>
            👧 Children
          </button>
        )}
        {account && (
          <button onClick={()=>setScreen("dashboard")}
            style={{...S.btn(false),width:"auto",padding:"7px 14px",fontSize:12,borderRadius:10}}>
            ⚙️ Manage
          </button>
        )}
      </div>
    </header>
  );

  // ── LOADING STATE ────────────────────────────────────────────────────────
  if (screen === "check") return (
    <div style={S.page}><style>{CSS}</style>
      <Header/>
      <div style={{textAlign:"center",padding:"80px 16px",color:"rgba(255,255,255,0.4)"}}>Loading…</div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // SEN FAST-TRACK REGISTRATION — radically simple for SEN parents
  // One screen: name + email + child name → condition selection → done → /special-needs
  // ════════════════════════════════════════════════════════════════════════════
  const [senStep, setSenStep] = useState(1); // 1=details, 2=condition
  const [senChildName, setSenChildName] = useState("");

  const handleSenFastTrack = () => {
    if (!parentName.trim() || !email.includes("@") || !senChildName.trim()) {
      setEmailErr("Please fill in all three fields."); return;
    }
    setEmailErr("");
    setSenStep(2); // go to condition selection
    window.scrollTo({top:0,behavior:'smooth'});
  };

  const handleSenComplete = (conditions, severity) => {
    // Create account + child in one go
    const acc = loadAccount();
    const account = acc?.email ? acc : { email: email.trim(), parentName: parentName.trim(), children: [] };
    const id = `child_${Date.now()}`;
    account.children = [...(account.children || []), {
      id, name: senChildName.trim(), email: '', grade: 'SEN',
      senCondition: conditions[0] || 'unsure',
      senConditions: conditions,
      senSeverity: severity || 'unsure',
      avatar: '💜', color: '#C77DFF',
    }];
    account.email = email.trim();
    account.parentName = parentName.trim();
    saveAccount(account);
    // Set as active child and bridge to nw_user
    try {
      localStorage.setItem('nw_active_child', JSON.stringify(account.children[account.children.length - 1]));
      const user = JSON.parse(localStorage.getItem('nw_user') || '{}');
      localStorage.setItem('nw_user', JSON.stringify({
        ...user, name: senChildName.trim(), email: email.trim(), grade: 'SEN',
        parentEmail: email.trim(), senFlag: true, senType: conditions[0] || 'unsure',
        senConditions: conditions, senSeverity: severity || 'unsure',
      }));
    } catch {}
    // Go straight to special-needs
    window.location.href = '/special-needs';
  };

  if (senMode && screen === "setup") return (
    <div style={S.page}><style>{CSS}</style>
      <Header/>
      <div style={{maxWidth:440, margin:"0 auto", padding: isMobile?"28px 16px":"56px 24px", animation:"fadeUp 0.4s ease-out"}}>

        {senStep === 1 && (<>
          <div style={{textAlign:"center", marginBottom:24}}>
            <div style={{fontSize:56, marginBottom:10}}>💜</div>
            <h1 style={{fontSize:isMobile?22:28, fontWeight:900, margin:"0 0 8px", lineHeight:1.2}}>
              Register Your Child
            </h1>
            <p style={{color:"rgba(255,255,255,0.6)", fontSize:15, lineHeight:1.7, margin:0}}>
              Three fields. That's all. Then Starky is ready for your child.
            </p>
          </div>

          <div style={S.card}>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <label style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.5)",display:"block",marginBottom:6}}>Your Name</label>
                <input style={{...S.input,fontSize:16,padding:"14px 16px"}} value={parentName} onChange={e=>setParentName(e.target.value)}
                  placeholder="Your name" autoFocus/>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.5)",display:"block",marginBottom:6}}>Your Email</label>
                <input style={{...S.input,fontSize:16,padding:"14px 16px"}} type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  placeholder="your@email.com"/>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.5)",display:"block",marginBottom:6}}>Your Child's Name</label>
                <input style={{...S.input,fontSize:16,padding:"14px 16px"}} value={senChildName} onChange={e=>setSenChildName(e.target.value)}
                  placeholder="Child's first name" onKeyDown={e=>e.key==="Enter"&&handleSenFastTrack()}/>
              </div>

              {emailErr && <div style={{color:"#FF6B6B",fontSize:13,fontWeight:700}}>{emailErr}</div>}

              <button onClick={handleSenFastTrack}
                style={{width:"100%",background:"linear-gradient(135deg,#C77DFF,#A78BFA)",color:"#fff",border:"none",borderRadius:14,padding:"16px",fontSize:17,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif",marginTop:4}}>
                Next →
              </button>
            </div>
          </div>
        </>)}

        {senStep === 2 && (<>
          <div style={{textAlign:"center", marginBottom:20}}>
            <h2 style={{fontSize:isMobile?20:26, fontWeight:900, margin:"0 0 6px"}}>
              What does {senChildName || 'your child'} need help with?
            </h2>
            <p style={{color:"rgba(255,255,255,0.5)", fontSize:13, margin:0}}>
              Tap all that apply. You can change this later.
            </p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr",gap:10,marginBottom:20}}>
            {SEN_OPTIONS.filter(s=>s.id).map(s => {
              const sel = childSEN.includes(s.id);
              return (
                <button key={s.id} onClick={()=>setChildSEN(prev => sel ? prev.filter(x=>x!==s.id) : [...prev, s.id])}
                  style={{
                    padding:"14px 16px", borderRadius:14, cursor:"pointer", border:"none",
                    fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:15, textAlign:"left",
                    background: sel ? (s.color||"#A78BFA")+"22" : "rgba(255,255,255,0.04)",
                    outline: sel ? `2px solid ${s.color||"#A78BFA"}` : "1px solid rgba(255,255,255,0.1)",
                    color: sel ? "#fff" : "rgba(255,255,255,0.7)",
                    display:"flex",alignItems:"center",gap:12,minHeight:52,
                  }}>
                  <span style={{fontSize:12,width:20,textAlign:"center"}}>{sel ? "✓" : ""}</span>
                  {s.label}
                </button>
              );
            })}
          </div>

          {childSEN.length > 0 && (<>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.6)",marginBottom:10}}>How much support does {senChildName || 'your child'} need?</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr",gap:8}}>
                {SEVERITY_OPTIONS.map(sv => (
                  <button key={sv.id} onClick={()=>setChildSeverity(sv.id)}
                    style={{
                      padding:"14px 16px", borderRadius:14, cursor:"pointer", border:"none",
                      fontFamily:"'Nunito',sans-serif", fontWeight:600, fontSize:14, textAlign:"left",
                      background: childSeverity===sv.id ? sv.color+"20" : "rgba(255,255,255,0.04)",
                      outline: childSeverity===sv.id ? `2px solid ${sv.color}` : "1px solid rgba(255,255,255,0.1)",
                      color: childSeverity===sv.id ? sv.color : "rgba(255,255,255,0.65)",
                    }}>
                    <div style={{fontWeight:800}}>{sv.label}</div>
                    <div style={{fontSize:12,opacity:0.7,marginTop:2}}>{sv.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={()=>handleSenComplete(childSEN, childSeverity)}
              style={{width:"100%",background:"linear-gradient(135deg,#C77DFF,#A78BFA)",color:"#fff",border:"none",borderRadius:14,padding:"16px",fontSize:17,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
              Start Learning with Starky →
            </button>
          </>)}

          {childSEN.length === 0 && (
            <div style={{textAlign:"center",padding:"20px",color:"rgba(255,255,255,0.4)",fontSize:13}}>
              Select at least one condition above to continue
            </div>
          )}

          <button onClick={()=>setSenStep(1)}
            style={{display:"block",margin:"16px auto 0",background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
            ← Go back
          </button>
        </>)}
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN 1 — SETUP (first visit — regular parent, non-SEN)
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "setup") return (
    <div style={S.page}><style>{CSS}</style>
      <Header/>
      <div style={{maxWidth:480, margin:"0 auto", padding: isMobile?"32px 16px":"64px 24px", animation:"fadeUp 0.4s ease-out"}}>

        <div style={{textAlign:"center", marginBottom:28}}>
          <div style={{fontSize:56, marginBottom:12}}>👨‍👧‍👦</div>
          <h1 style={{fontSize:isMobile?24:30, fontWeight:900, margin:"0 0 10px", lineHeight:1.2}}>
            Parent Portal
          </h1>
          <p style={{color:"rgba(255,255,255,0.6)", fontSize:15, lineHeight:1.7, margin:"0 0 20px"}}>
            Stay involved in your child's Cambridge preparation — even from your office.
          </p>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, textAlign:"left", marginBottom:24}}>
            {[
              {emoji:"📋", text:"Set assignments remotely"},
              {emoji:"📊", text:"See weak topics & mistakes"},
              {emoji:"💬", text:"Send feedback to your child"},
              {emoji:"📧", text:"Get session reports by email"},
              {emoji:"🎓", text:"Ask Starky how to teach topics"},
              {emoji:"📱", text:"Works across devices"},
            ].map(f => (
              <div key={f.text} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:10}}>
                <span style={{fontSize:18}}>{f.emoji}</span>
                <span style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.7)"}}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={S.card}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div>
              <label style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",letterSpacing:1,display:"block",marginBottom:6}}>YOUR NAME</label>
              <input style={S.input} value={parentName} onChange={e=>setParentName(e.target.value)}
                placeholder="e.g. Fatima" onKeyDown={e=>e.key==="Enter"&&handleSetup()}/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",letterSpacing:1,display:"block",marginBottom:6}}>YOUR EMAIL</label>
              <input style={S.input} type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="parent@email.com" onKeyDown={e=>e.key==="Enter"&&handleSetup()}/>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:5}}>
                Your children do not need an email address.
              </div>
            </div>

            {emailErr && <div style={{color:"#FF6B6B",fontSize:13,fontWeight:700}}>{emailErr}</div>}

            <button onClick={handleSetup} style={S.btn(true)}>
              Create Family Account →
            </button>

            <div style={{textAlign:"center",fontSize:12,color:"rgba(255,255,255,0.3)"}}>
              Already have an account?{" "}
              <button onClick={()=>{
                const em = prompt("Enter the email you used to set up your account:");
                if (!em) return;
                // Simple: if they enter the right email, we just keep the existing account
                // Since it's all localStorage, the account IS there if it's the same device
                const acc = loadAccount();
                if (acc && acc.email.toLowerCase()===em.toLowerCase()) {
                  setAccount(acc);
                  setScreen(acc.children?.length>0?"pick-child":"dashboard");
                } else {
                  alert("Account not found on this device. If you're on a new device, please create a new account.");
                }
              }} style={{background:"none",border:"none",color:"#63D2FF",cursor:"pointer",fontWeight:800,fontSize:12,fontFamily:"'Nunito',sans-serif"}}>
                Sign in here
              </button>
            </div>
          </div>
        </div>

        {/* Why no email for kids */}
        <div style={{marginTop:20,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            ["👶","Children under 10 don't need an email"],
            ["👨‍👧‍👦","Up to 4 children, one family account"],
            ["📊","Sessions tracked per child separately"],
            ["🔒","Parent controls everything"],
          ].map(([emoji,text])=>(
            <div key={text} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"flex-start",gap:10}}>
              <span style={{fontSize:18,flexShrink:0}}>{emoji}</span>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN 2 — ADD / EDIT CHILD
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "add-child") return (
    <div style={S.page}><style>{CSS}</style>
      <Header/>
      <div style={{maxWidth:520, margin:"0 auto", padding: isMobile?"24px 16px":"48px 24px", animation:"fadeUp 0.35s ease-out"}}>

        <button onClick={()=>setScreen(account.children?.length>0?"pick-child":"dashboard")}
          style={{...S.btn(false),width:"auto",padding:"8px 16px",fontSize:13,borderRadius:12,marginBottom:24}}>
          ← Back
        </button>

        <h2 style={{fontSize:isMobile?22:26,fontWeight:900,margin:"0 0 6px"}}>
          {editingId ? "Edit Child Profile" : "Add a Child"}
        </h2>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:13,margin:"0 0 24px"}}>
          {editingId ? "Update the details below." : `Child ${(account.children?.length||0)+1} of 4 — no email needed!`}
        </p>

        <div style={S.card}>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            {/* Name */}
            <div>
              <label style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",letterSpacing:1,display:"block",marginBottom:6}}>CHILD'S NAME</label>
              <input style={S.input} value={childName} onChange={e=>setChildName(e.target.value)}
                placeholder="e.g. Zain, Sara, Ali"/>
            </div>

            {/* Child email — for remote teaching */}
            <div>
              <label style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",letterSpacing:1,display:"block",marginBottom:6}}>CHILD'S EMAIL <span style={{fontWeight:400,opacity:0.6}}>(for remote progress tracking)</span></label>
              <input style={S.input} type="email" value={childEmail} onChange={e=>setChildEmail(e.target.value)}
                placeholder="The email they use on NewWorldEdu"/>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:4}}>Enter the same email your child registered with on the platform. This lets you see their progress remotely.</div>
            </div>

            {/* Grade */}
            <div>
              <label style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",letterSpacing:1,display:"block",marginBottom:8}}>GRADE / YEAR</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                {GRADES.map(g=>(
                  <button key={g.id} onClick={()=>setChildGrade(g.id)}
                    style={{
                      padding:"10px 12px", borderRadius:12, cursor:"pointer",
                      fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:12, textAlign:"left",
                      background: childGrade===g.id?"rgba(168,224,99,0.15)":"rgba(255,255,255,0.04)",
                      border: `1.5px solid ${childGrade===g.id?"#A8E063":"rgba(255,255,255,0.1)"}`,
                      color: childGrade===g.id?"#A8E063":"rgba(255,255,255,0.6)",
                      display:"flex",alignItems:"center",gap:8,
                    }}>
                    <span style={{fontSize:18}}>{g.emoji}</span>
                    <span>
                      <div>{g.label}</div>
                      <div style={{fontSize:10,fontWeight:600,opacity:0.6}}>Ages {g.age}</div>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* SEN Condition — multiple selection */}
            <div>
              <label style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.5)",letterSpacing:1,display:"block",marginBottom:4}}>SPECIAL EDUCATIONAL NEEDS <span style={{fontWeight:400,opacity:0.6}}>(select all that apply)</span></label>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:8}}>You can select more than one condition. Tap to select, tap again to remove.</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                {SEN_OPTIONS.filter(s=>s.id).map(s=>{
                  const selected = childSEN.includes(s.id);
                  return (
                  <button key={s.id} onClick={()=>setChildSEN(prev => selected ? prev.filter(x=>x!==s.id) : [...prev, s.id])}
                    style={{
                      padding:"10px 12px", borderRadius:12, cursor:"pointer",
                      fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:12, textAlign:"left",
                      background: selected ? (s.color||"#A78BFA")+"20" : "rgba(255,255,255,0.04)",
                      border: `1.5px solid ${selected ? (s.color||"#A78BFA") : "rgba(255,255,255,0.1)"}`,
                      color: selected ? (s.color||"#A78BFA") : "rgba(255,255,255,0.6)",
                    }}>
                    {selected ? "✓ " : ""}{s.label}
                  </button>
                  );
                })}
              </div>

              {/* Severity selector — shown when any SEN condition is selected */}
              {childSEN.length > 0 && (
                <div style={{marginTop:14}}>
                  <label style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.5)",letterSpacing:1,display:"block",marginBottom:8}}>SEVERITY LEVEL</label>
                  <div style={{display:"grid",gridTemplateColumns:"1fr",gap:8}}>
                    {SEVERITY_OPTIONS.map(sv=>(
                      <button key={sv.id} onClick={()=>setChildSeverity(sv.id)}
                        style={{
                          padding:"12px 14px", borderRadius:12, cursor:"pointer",
                          fontFamily:"'Nunito',sans-serif", fontWeight:600, fontSize:13, textAlign:"left",
                          background: childSeverity===sv.id ? sv.color+"18" : "rgba(255,255,255,0.04)",
                          border: `1.5px solid ${childSeverity===sv.id ? sv.color : "rgba(255,255,255,0.1)"}`,
                          color: childSeverity===sv.id ? sv.color : "rgba(255,255,255,0.6)",
                        }}>
                        <div style={{fontWeight:800,marginBottom:2}}>{sv.label}</div>
                        <div style={{fontSize:11,opacity:0.7,lineHeight:1.5}}>{sv.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {childSEN.length > 0 && (
                <div style={{marginTop:10,background:"rgba(167,139,250,0.08)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:12,padding:"12px 14px"}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#A78BFA",marginBottom:4}}>💜 SEN Support Active — {childSEN.length} condition{childSEN.length>1?'s':''} selected{childSeverity ? ` · ${childSeverity}` : ''}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.6}}>
                    Your child will get unlimited sessions, adapted teaching, and specialist support. Grade is optional for SEN children.
                    <a href="/special-needs" style={{color:"#A78BFA",marginLeft:4}}>Open SEN Portal →</a>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div>
              <label style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",letterSpacing:1,display:"block",marginBottom:8}}>PICK AN AVATAR</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {AVATARS.map(a=>(
                  <button key={a} onClick={()=>setChildAvatar(a)}
                    style={{
                      width:44,height:44,borderRadius:"50%",cursor:"pointer",fontSize:22,
                      background: childAvatar===a?"rgba(168,224,99,0.2)":"rgba(255,255,255,0.06)",
                      border: `2px solid ${childAvatar===a?"#A8E063":"rgba(255,255,255,0.1)"}`,
                      transition:"all 0.15s",
                    }}>{a}</button>
                ))}
              </div>
            </div>

            {/* Colour */}
            <div>
              <label style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",letterSpacing:1,display:"block",marginBottom:8}}>THEME COLOUR</label>
              <div style={{display:"flex",gap:8}}>
                {COLORS.map(c=>(
                  <button key={c} onClick={()=>setChildColor(c)}
                    style={{
                      width:32,height:32,borderRadius:"50%",cursor:"pointer",
                      background:c, border: `3px solid ${childColor===c?"#fff":"transparent"}`,
                      transition:"all 0.15s",
                    }}/>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div style={{background:`${childColor}12`,border:`1px solid ${childColor}35`,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:`${childColor}25`,border:`2px solid ${childColor}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>
                {childAvatar}
              </div>
              <div>
                <div style={{fontWeight:900,fontSize:16,color:childColor}}>{childName||"Child's name"}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>
                  {childGrade ? GRADES.find(g=>g.id===childGrade)?.label : "Pick a grade"}
                </div>
              </div>
            </div>

            {addErr && <div style={{color:"#FF6B6B",fontSize:13,fontWeight:700}}>{addErr}</div>}

            <button onClick={handleAddChild} style={S.btn(true,childColor)}>
              {editingId ? "Save Changes ✓" : "Add Child →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN 3 — "WHO'S LEARNING TODAY?" child picker
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "pick-child") {
    const children = account?.children || [];
    return (
      <div style={S.page}><style>{CSS}</style>
        <Header/>
        <div style={{maxWidth:640, margin:"0 auto", padding: isMobile?"28px 16px":"56px 24px", animation:"fadeUp 0.35s ease-out"}}>

          <div style={{textAlign:"center", marginBottom:36}}>
            <div style={{fontSize:isMobile?40:52, marginBottom:10, animation:"bounce 2s ease-in-out infinite"}}>👋</div>
            <h1 style={{fontSize:isMobile?22:30, fontWeight:900, margin:"0 0 8px"}}>
              Who's learning today?
            </h1>
            <p style={{color:"rgba(255,255,255,0.4)", fontSize:14, margin:0}}>
              Tap your name to start with Starky
            </p>
          </div>

          {/* Child cards — big, tappable */}
          <div style={{display:"grid", gridTemplateColumns: children.length===1?"1fr":isMobile?"1fr 1fr":"1fr 1fr", gap:14, marginBottom:24}}>
            {children.map(child => {
              const sessions = loadChildSessions(child.id);
              const grade    = GRADES.find(g=>g.id===child.grade);
              return (
                <button key={child.id} className="child-card" onClick={()=>selectChild(child)}
                  style={{
                    background:`${child.color}10`, border:`2px solid ${child.color}40`,
                    borderRadius:22, padding: isMobile?"24px 16px":"32px 24px",
                    cursor:"pointer", color:"#fff", textAlign:"center",
                    transition:"all 0.2s", boxShadow:"0 4px 24px rgba(0,0,0,0.3)",
                    position:"relative",
                  }}>
                  {/* Sessions badge */}
                  {sessions > 0 && (
                    <div style={{
                      position:"absolute",top:10,right:10,
                      background:`${child.color}20`,border:`1px solid ${child.color}40`,
                      borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:800,color:child.color
                    }}>{sessions} sessions</div>
                  )}
                  {/* SEN badge — shows conditions + severity */}
                  {(child.senCondition || child.senConditions?.length > 0) && (
                    <div style={{
                      position:"absolute",top:10,left:10,
                      background:"rgba(167,139,250,0.2)",border:"1px solid rgba(167,139,250,0.4)",
                      borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:800,color:"#A78BFA",
                      maxWidth:"80%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"
                    }}>💜 {(child.senConditions || [child.senCondition]).filter(Boolean).map(id => SEN_OPTIONS.find(s=>s.id===id)?.label?.replace(/^[^\s]+\s/,'') || id).join(' · ')}{child.senSeverity ? ` · ${child.senSeverity}` : ''}</div>
                  )}
                  {/* Avatar */}
                  <div style={{
                    width:isMobile?64:80, height:isMobile?64:80, borderRadius:"50%",
                    background:`${child.color}20`, border:`3px solid ${child.color}60`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:isMobile?34:44, margin:"0 auto 14px",
                  }}>{child.avatar}</div>
                  {/* Name */}
                  <div style={{fontWeight:900, fontSize:isMobile?18:22, color:child.color, marginBottom:4}}>
                    {child.name}
                  </div>
                  {/* Grade */}
                  <div style={{fontSize:12, color:"rgba(255,255,255,0.45)", fontWeight:700}}>
                    {grade?.label || child.grade}
                  </div>
                  {/* Tap hint */}
                  <div style={{marginTop:12,fontSize:11,color:`${child.color}AA`,fontWeight:700,letterSpacing:0.5}}>
                    TAP TO START →
                  </div>
                </button>
              );
            })}

            {/* Add child button if < 4 */}
            {children.length < 4 && (
              <button onClick={()=>setScreen("add-child")}
                style={{
                  background:"rgba(255,255,255,0.03)", border:"2px dashed rgba(255,255,255,0.15)",
                  borderRadius:22, padding: isMobile?"24px 16px":"32px 24px",
                  cursor:"pointer", color:"rgba(255,255,255,0.35)", textAlign:"center",
                  transition:"all 0.2s", display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center", gap:10,
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.35)";e.currentTarget.style.color="rgba(255,255,255,0.6)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.15)";e.currentTarget.style.color="rgba(255,255,255,0.35)";}}>
                <div style={{fontSize:36}}>＋</div>
                <div style={{fontWeight:800, fontSize:13}}>Add Child</div>
                <div style={{fontSize:11}}>{4 - children.length} slots remaining</div>
              </button>
            )}
          </div>

          {/* Parent controls */}
          <div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
            <button onClick={()=>setScreen("dashboard")}
              style={{...S.btn(false),width:"auto",padding:"9px 18px",fontSize:12,borderRadius:12}}>
              ⚙️ Manage Profiles
            </button>
            <a href="/demo"
              style={{...S.btn(false),width:"auto",padding:"9px 18px",fontSize:12,borderRadius:12,textDecoration:"none",display:"inline-flex",alignItems:"center"}}>
              ⭐ Open Starky directly
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN 4 — PARENT DASHBOARD (manage children)
  // ════════════════════════════════════════════════════════════════════════════
  const children = account?.children || [];
  const totalSessions = children.reduce((sum,c)=>sum+loadChildSessions(c.id),0);

  return (
    <div style={S.page}><style>{CSS}</style>
      <Head>
        <title>Parent Portal — NewWorldEdu</title>
        <meta name="description" content="Parent portal for NewWorldEdu. Track your child's Cambridge exam preparation, set assignments, view weak topics, and get session reports." />
        <meta property="og:title" content="Parent Portal — NewWorldEdu" />
        <meta property="og:description" content="Parent portal for NewWorldEdu. Track your child's Cambridge exam preparation, set assignments, view weak topics, and get session reports." />
      </Head>
      <Header/>
      <div style={{maxWidth:640, margin:"0 auto", padding: isMobile?"20px 16px":"40px 24px", animation:"fadeUp 0.35s ease-out"}}>

        {/* Header */}
        <div style={{marginBottom:28}}>
          <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.4)",marginBottom:4}}>
            👨‍👧‍👦 Family Dashboard
          </div>
          <h2 style={{fontSize:isMobile?22:28,fontWeight:900,margin:"0 0 4px"}}>
            Welcome, {account?.parentName}
          </h2>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.35)"}}>{account?.email}</div>
        </div>

        {/* Stats */}
        {children.length > 0 && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:24}}>
            {[
              ["👶",children.length,"Children"],
              ["⭐",totalSessions,"Total Sessions"],
              ["📚",Math.max(...children.map(c=>loadChildSessions(c.id)),0),"Most Active"],
            ].map(([icon,val,label])=>(
              <div key={label} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"14px",textAlign:"center"}}>
                <div style={{fontSize:20,marginBottom:4}}>{icon}</div>
                <div style={{fontSize:24,fontWeight:900,color:"#A8E063"}}>{val}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:700}}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Children list */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:900,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:12,textTransform:"uppercase"}}>
            Child Profiles
          </div>

          {children.length === 0 ? (
            <div style={{...S.card,textAlign:"center",padding:"32px 24px"}}>
              <div style={{fontSize:44,marginBottom:12}}>👶</div>
              <div style={{fontWeight:800,fontSize:16,marginBottom:8}}>No children added yet</div>
              <div style={{color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:20}}>Add your first child — they won't need an email.</div>
              <button onClick={()=>setScreen("add-child")} style={{background:"linear-gradient(135deg,#4F8EF7,#7C5CBF)",border:"none",color:"#fff",borderRadius:14,padding:"14px 28px",fontFamily:"'Nunito',sans-serif",fontWeight:900,fontSize:16,cursor:"pointer",boxShadow:"0 4px 16px rgba(79,142,247,0.3)"}}>
                🎉 Add Your First Child
              </button>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {children.map(child => {
                const sessions = loadChildSessions(child.id);
                const grade    = GRADES.find(g=>g.id===child.grade);
                return (
                  <div key={child.id} style={{
                    background:`${child.color}0A`, border:`1px solid ${child.color}30`,
                    borderRadius:18, padding:"16px 18px",
                    display:"flex", alignItems:"center", gap:14,
                  }}>
                    <div style={{width:48,height:48,borderRadius:"50%",background:`${child.color}20`,border:`2px solid ${child.color}60`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>
                      {child.avatar}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:900,fontSize:16,color:child.color}}>{child.name}</div>
                      <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>
                        {grade?.label} · {sessions} session{sessions!==1?"s":""}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>startEdit(child)}
                        style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 12px",color:"rgba(255,255,255,0.6)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
                        Edit
                      </button>
                      <button onClick={()=>{ if(confirm(`Remove ${child.name}?`)) removeChild(child.id); }}
                        style={{background:"rgba(255,107,107,0.1)",border:"1px solid rgba(255,107,107,0.25)",borderRadius:10,padding:"7px 12px",color:"#FF6B6B",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {children.length < 4 && (
            <button onClick={()=>setScreen("add-child")} style={S.btn(true)}>
              ＋ Add Child Profile
            </button>
          )}
          {children.length > 0 && (
            <button onClick={()=>setScreen("pick-child")} style={S.btn(false)}>
              👧 Who's Learning Today?
            </button>
          )}
          <a href="/demo" style={{...S.btn(false),textDecoration:"none",textAlign:"center",display:"block"}}>
            ⭐ Go to Starky
          </a>
        </div>


        {/* Ask Them Tonight Card */}
        {children.length > 0 && (
          <div style={{marginTop:20,background:"rgba(79,142,247,0.08)",border:"1px solid rgba(79,142,247,0.2)",borderRadius:20,padding:"20px 22px"}}>
            <div style={{fontWeight:900,fontSize:15,color:"#4F8EF7",marginBottom:4}}>💬 Ask Them Tonight</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginBottom:14}}>No subject knowledge needed — just listen</div>
            {children.slice(0,3).map(child => {
              const questions = [
                "What did you learn with Starky today?",
                "Can you teach me one thing you studied today?",
                "What was the hardest question Starky asked you?",
                "If you had to explain today's topic to a friend, what would you say?",
              ];
              const q = questions[Math.floor(Math.random() * questions.length)];
              return (
                <div key={child.id} style={{marginBottom:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"12px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <span style={{fontSize:18}}>{child.avatar}</span>
                    <span style={{fontWeight:800,fontSize:13,color:child.color}}>{child.name}</span>
                  </div>
                  <div style={{fontSize:14,color:"#fff",fontStyle:"italic",lineHeight:1.6}}>"{q}"</div>
                </div>
              );
            })}
          </div>
        )}
        {/* Child Progress — fetches from KV */}
        {children.length > 0 && (
          <ChildProgress children={children} parentEmail={account?.email} />
        )}

        {/* Set Assignment */}
        {children.length > 0 && (
          <SetAssignment children={children} parentName={account?.parentName} />
        )}

        {/* SEN Guide — show if any child has SEN condition */}
        {children.some(c => c.senCondition) && (
          <div style={{marginTop:20,background:"rgba(167,139,250,0.06)",border:"1px solid rgba(167,139,250,0.18)",borderRadius:20,padding:"20px 22px"}}>
            <div style={{fontWeight:900,fontSize:15,color:"#A78BFA",marginBottom:4}}>💜 Special Needs Support</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.7,marginBottom:14}}>
              Your SEN child gets unlimited sessions, adapted teaching, and specialist support. Here's what's available:
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
              {[
                {emoji:"🎓",text:"140 teaching profiles adapted by condition × age × focus"},
                {emoji:"🔊",text:"Voice input + auto-speak for non-readers"},
                {emoji:"Aa",text:"Dyslexia-friendly font + cream background"},
                {emoji:"♿",text:"Large buttons for motor difficulties"},
                {emoji:"🎵",text:"Music, reading & arts therapy — all SEN-adapted"},
                {emoji:"📧",text:"Session reports with SEN progress to your email"},
              ].map(f => (
                <div key={f.text} style={{display:"flex",alignItems:"flex-start",gap:6,fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.5}}>
                  <span style={{flexShrink:0}}>{f.emoji}</span> {f.text}
                </div>
              ))}
            </div>
            {children.filter(c=>c.senCondition).map(child => (
              <a key={child.id} href={`/special-needs`}
                style={{display:"block",textAlign:"center",background:"linear-gradient(135deg,#A78BFA,#7C5CBF)",borderRadius:14,padding:"13px",color:"#fff",fontWeight:900,fontSize:14,textDecoration:"none",marginBottom:8}}>
                Open {child.name}'s SEN Portal →
              </a>
            ))}
          </div>
        )}

        {/* Subscription section */}
        <div style={{marginTop:28,background:"rgba(168,224,99,0.06)",border:"1px solid rgba(168,224,99,0.2)",borderRadius:20,padding:"20px 22px"}}>
          <div style={{fontWeight:900,fontSize:15,color:"#A8E063",marginBottom:8}}>🎓 Family Plan — $69.99/mo</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.7,marginBottom:16}}>
            Get unlimited sessions for all {children.length || "your"} children, plus priority support and monthly learning reports.
          </div>
          <a href="/pricing"
            style={{display:"block",textAlign:"center",background:"linear-gradient(135deg,#A8E063,#7DC940)",borderRadius:14,padding:"13px",color:"#060B20",fontWeight:900,fontSize:14,textDecoration:"none"}}>
            💳 View Family Plan →
          </a>
        </div>

        {/* Danger zone */}
        <div style={{marginTop:20,textAlign:"center"}}>
          <button onClick={logout}
            style={{background:"none",border:"none",color:"rgba(255,255,255,0.2)",fontSize:12,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
            Clear account from this device
          </button>
        </div>
      </div>
    </div>
  );
}
