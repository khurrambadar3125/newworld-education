import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useSessionLimit, LimitReachedModal } from "../utils/useSessionLimit";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

const SUBJECTS = [
  {
    id: "olevel", emoji: "📚", label: "O Level", color: "#A8E063",
    placeholder: "Ask about Biology, Chemistry, Physics, Maths, English...",
    starters: [
      "Explain photosynthesis step by step for O Level.",
      "What is the difference between ionic and covalent bonding?",
      "How do I write an O Level essay for full marks?",
      "Explain Newton's Second Law with examples.",
    ],
    system: `You are Starky ⭐, an expert Cambridge O Level tutor on NewWorldEdu.

ALWAYS follow these rules:
- Align every answer to Cambridge CAIE O Level syllabus and mark schemes.
- Show what an examiner wants to see. Use Cambridge command words: describe, explain, evaluate, state.
- Always reply in the SAME language the student writes in. If they write Urdu, reply in Urdu.
- Show full working for maths and science calculations — never skip steps.
- NEVER invent mark scheme points or syllabus content. If unsure, say "I'd check the Cambridge syllabus for this — here's what I know for certain..."
- NEVER discuss anything unrelated to education and learning.
- Keep answers clear and structured. End with an exam tip when relevant.
- Max 250 words unless the question genuinely needs more.`,
  },
  {
    id: "alevel", emoji: "🏆", label: "A Level", color: "#C77DFF",
    placeholder: "Ask about any A Level subject — essays, concepts, exam technique...",
    starters: [
      "How do I structure a Cambridge A Level Economics essay?",
      "Explain the Keynesian vs Monetarist debate.",
      "How do I evaluate a Business question for top marks?",
      "Explain elasticity of demand with real examples.",
    ],
    system: `You are Starky ⭐, an expert Cambridge A Level tutor on NewWorldEdu.

ALWAYS follow these rules:
- Align all content to Cambridge CAIE A Level syllabi and mark schemes.
- For essays: guide on structure — intro, analysis, evaluation, conclusion. Use real examples.
- Always reply in the SAME language the student writes in.
- For evaluations: present BOTH sides before concluding.
- NEVER invent statistics, case studies, or exam content. Be honest when unsure.
- NEVER discuss topics outside academics.
- Push students to think critically — guide them toward the answer rather than just giving it.
- Structured responses. Use headers or numbered steps for complex answers.`,
  },
  {
    id: "maths", emoji: "🔢", label: "Mathematics", color: "#FF6B6B",
    placeholder: "Any maths problem — show me the question and I'll work through it!",
    starters: [
      "Solve: x² + 5x + 6 = 0 with full working.",
      "Explain differentiation from first principles.",
      "How do I find the area under a curve?",
      "Help me understand probability tree diagrams.",
    ],
    system: `You are Starky ⭐, a patient Mathematics tutor for all levels (KG to A Level) on NewWorldEdu.

ALWAYS follow these rules:
- Show FULL step-by-step working for every problem. Never skip steps.
- Explain the reasoning behind each step — not just the calculation.
- Always reply in the SAME language the student writes in.
- If the student makes an error, identify it kindly and explain why.
- NEVER guess or approximate when an exact answer exists.
- Adapt to the student's level based on how they write.
- End with: "Want me to give you a similar practice question?" when appropriate.`,
  },
  {
    id: "primary", emoji: "🌱", label: "KG – Grade 5", color: "#FFC300",
    placeholder: "Ask me anything! I love helping young learners!",
    starters: [
      "Can you explain fractions with a fun story?",
      "What are the planets in our solar system?",
      "Help me understand multiplication!",
      "Why do leaves change colour in autumn?",
    ],
    system: `You are Starky ⭐, a warm and patient AI tutor for children aged 4–11 on NewWorldEdu.

ALWAYS follow these rules:
- Use very simple words. Maximum 2 short sentences per point.
- Use lots of emojis to make it fun and visual 🎉.
- Always reply in the SAME language the child writes in.
- Break explanations into numbered steps.
- Celebrate every question with genuine warmth — never make a child feel silly.
- NEVER make up facts. If unsure, say "Great question! Here's what I know..."
- NEVER discuss topics unrelated to learning.
- Keep answers short and fun. Max 120 words. End with a follow-up question or encouragement.`,
  },
  {
    id: "middle", emoji: "🚀", label: "Grade 6–9", color: "#56CCF2",
    placeholder: "Ask about any subject — Maths, Science, English, History...",
    starters: [
      "Explain the water cycle step by step.",
      "How do I solve algebraic equations?",
      "What caused World War One?",
      "Help me write a better essay introduction.",
    ],
    system: `You are Starky ⭐, an encouraging AI tutor for students aged 11–14 on NewWorldEdu.

ALWAYS follow these rules:
- Use clear, age-appropriate language — friendly but not childish.
- Always reply in the SAME language the student writes in.
- Show step-by-step working for maths and science problems.
- Use real-world examples students will recognise.
- NEVER make up facts, statistics, or quotes. Be honest when unsure.
- NEVER discuss topics outside school learning.
- Keep answers focused — max 200 words. End with: "Does that make sense? Want me to try explaining it differently?"`,
  },
  {
    id: "university", emoji: "🎓", label: "University / BBA", color: "#63D2FF",
    placeholder: "Ask about Marketing, Business, Economics, Finance...",
    starters: [
      "Explain the consumer decision journey with examples.",
      "What is the difference between B2B and B2C marketing?",
      "Help me structure a business report introduction.",
      "Explain Porter's Five Forces with a real company.",
    ],
    system: `You are Starky ⭐, an expert university-level AI tutor on NewWorldEdu.

ALWAYS follow these rules:
- Use academic language appropriate for undergraduate level.
- Always reply in the SAME language the student writes in.
- Use real company examples (global and Pakistan/regional where relevant).
- Structure explanations: definition → theory → real example → application.
- For reports and essays: guide on academic structure and citation approach.
- NEVER invent statistics, research findings, or case studies. Acknowledge uncertainty honestly.
- NEVER discuss topics outside business and academic education.
- Encourage critical thinking. Present multiple perspectives before concluding.`,
  },
];

const ChatMessage = ({ msg, color }) => {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 12, animation: "fadeUp 0.2s ease-out",
    }}>
      {!isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: `linear-gradient(135deg, ${color}, ${color}88)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0, marginRight: 8, marginTop: 2,
        }}>⭐</div>
      )}
      <div style={{
        maxWidth: "78%",
        background: isUser ? `linear-gradient(135deg, ${color}CC, ${color}99)` : "rgba(255,255,255,0.07)",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        padding: "10px 14px", color: "#fff", fontSize: 14, lineHeight: 1.65,
        whiteSpace: "pre-wrap",
        border: isUser ? "none" : "1px solid rgba(255,255,255,0.1)",
        wordBreak: "break-word",
      }}>{msg.content}</div>
    </div>
  );
};

const TypingDots = ({ color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
    <div style={{
      width: 30, height: 30, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}, ${color}88)`,
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
    }}>⭐</div>
    <div style={{
      background: "rgba(255,255,255,0.07)", borderRadius: "18px 18px 18px 4px",
      padding: "12px 16px", border: "1px solid rgba(255,255,255,0.1)",
      display: "flex", gap: 5, alignItems: "center",
    }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: color,
          animation: `bounce 1.2s ${i*0.2}s ease-in-out infinite`,
        }}/>
      ))}
    </div>
  </div>
);

// Voice input
function useSpeechInput() {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef(null);
  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) setSupported(true);
  }, []);
  const toggle = (onResult) => {
    if (listening) { recRef.current?.stop(); setListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = 'en-US'; rec.interimResults = false;
    rec.onresult = (e) => { const t = e.results?.[0]?.[0]?.transcript; if (t && onResult) onResult(t); setListening(false); };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec; rec.start(); setListening(true);
  };
  return { listening, supported, toggle };
}

export default function DemoPage() {
  const isMobile = useIsMobile();
  const [activeId, setActiveId] = useState("olevel");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Read active child from parent portal OR nw_user to pick the right default tab
  const [childName, setChildName] = useState('');
  useEffect(() => {
    try {
      // Check parent portal active child first
      const activeChild = JSON.parse(localStorage.getItem('nw_active_child') || 'null');
      if (activeChild?.grade) {
        const g = (activeChild.grade || '').toLowerCase();
        // Map child grade to the right subject tab
        if (['kg', 'nursery', 'reception', 'grade 1', 'grade 2', 'grade 3', 'grade 4', 'grade 5', 'grade1', 'grade2', 'grade3', 'grade4', 'grade5'].some(k => g.includes(k))) {
          setActiveId('primary');
        } else if (['grade 6', 'grade 7', 'grade 8', 'grade 9', 'grade 10', 'grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'matric', 'middle'].some(k => g.includes(k))) {
          setActiveId('olevel'); // closest match for middle/matric
        } else if (g.includes('a level') || g.includes('alevel') || g.includes('as level')) {
          setActiveId('alevel');
        }
        if (activeChild.name) setChildName(activeChild.name);
        // Sync parent email for session limits
        const parent = JSON.parse(localStorage.getItem('nw_parent') || '{}');
        if (parent.email) {
          const user = JSON.parse(localStorage.getItem('nw_user') || '{}');
          if (!user.email || user.email !== parent.email || user.senFlag !== !!activeChild.senCondition) {
            localStorage.setItem('nw_user', JSON.stringify({ ...user, name: activeChild.name, email: parent.email, grade: activeChild.grade, parentEmail: parent.email, senFlag: !!activeChild.senCondition, senType: activeChild.senCondition || null }));
          }
        }
        return;
      }
      // Fallback: check nw_user
      const user = JSON.parse(localStorage.getItem('nw_user') || '{}');
      if (user.gradeId) {
        const g = user.gradeId.toLowerCase();
        if (['kg', 'grade1', 'grade2', 'grade3', 'grade4', 'grade5'].includes(g)) setActiveId('primary');
        else if (['grade6', 'grade7', 'grade8', 'grade9', 'grade10'].includes(g)) setActiveId('olevel');
        else if (g.includes('alevel')) setActiveId('alevel');
      }
      if (user.name) setChildName(user.name);
    } catch {}
  }, []);

  const { callsLeft, limitReached, recordCall } = useSessionLimit((() => { try { return JSON.parse(localStorage.getItem('nw_user') || '{}').email; } catch { return ''; } })());
  const [showLimit, setShowLimit] = useState(false);
  const voice = useSpeechInput();
  const cameraRef = useRef(null);
  const fileRef = useRef(null);
  const [imageData, setImageData] = useState(null);

  const subject = SUBJECTS.find(s => s.id === activeId);

  useEffect(() => { setMessages([]); setInput(""); }, [activeId]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text) => {
    const t = text || input.trim();
    if (!t && !imageData) return;
    if (loading) return;
    if (limitReached) { setShowLimit(true); return; }
    recordCall();
    const currentImage = imageData;
    setInput("");
    setImageData(null);
    setLoading(true);

    // Build message content — text only or text + image
    let userContent = t || 'Please help me with this image.';
    const displayMsg = currentImage ? `📷 [Image attached] ${t || ''}`.trim() : t;
    const history = [...messages, { role: "user", content: displayMsg }];
    setMessages(history);

    try {
      // If image attached, use /api/anthropic which handles images
      if (currentImage) {
        const base64 = currentImage.split(',')[1];
        const mediaType = currentImage.split(';')[0].split(':')[1] || 'image/jpeg';
        const res = await fetch("/api/anthropic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userContent,
            imageBase64: base64,
            imageMediaType: mediaType,
            userProfile: { name: childName || 'Student', grade: subject.label },
            sessionMemory: { currentSubject: subject.label },
          }),
        });
        const data = await res.json();
        const reply = data.content || data.response || "Let me look at that — try again! 🌟";
        setMessages(prev => [...prev, { role: "assistant", content: reply }]);
        // Signal collection
        try {
          const { recordMessageSignal, recordStrategySignal } = await import('../utils/signalCollector');
          const profile = JSON.parse(localStorage.getItem('nw_user') || '{}');
          recordMessageSignal({ email: profile.email || 'anonymous', subject: subject.label, grade: profile.grade || '', userMessage: userContent, starkyResponse: reply, sessionNumber: 1 });
          recordStrategySignal({ email: profile.email || 'anonymous', subject: subject.label, grade: profile.grade || '', starkyResponse: reply, userResponse: userContent });
        } catch {}
      } else {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            max_tokens: 800,
            system: subject.system,
            messages: history.map(m => ({ role: m.role, content: m.content })),
          }),
        });
        const data = await res.json();
        const reply = data.content?.[0]?.text || "Let me think about that — try asking again! 🌟";
        setMessages(prev => [...prev, { role: "assistant", content: reply }]);
        // Signal collection
        try {
          const { recordMessageSignal, recordStrategySignal } = await import('../utils/signalCollector');
          const profile = JSON.parse(localStorage.getItem('nw_user') || '{}');
          recordMessageSignal({ email: profile.email || 'anonymous', subject: subject.label, grade: profile.grade || '', userMessage: t, starkyResponse: reply, sessionNumber: 1 });
          recordStrategySignal({ email: profile.email || 'anonymous', subject: subject.label, grade: profile.grade || '', starkyResponse: reply, userResponse: t });
        } catch {}
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong — please try again! 🌟" }]);
    }
    setLoading(false);
    // Session-complete analysis
    try {
      const updatedMessages = [...history, { role: "assistant", content: "..." }];
      const msgCount = updatedMessages.filter(m => m.role === 'user').length;
      if (msgCount === 5 || (msgCount > 5 && msgCount % 10 === 0)) {
        const profile = JSON.parse(localStorage.getItem('nw_user') || '{}');
        fetch('/api/session-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: profile.email || 'anonymous',
            studentName: profile.name || 'Student',
            parentEmail: msgCount === 5 ? (profile.parentEmail || profile.email) : null,
            grade: profile.grade,
            subject: subject.label,
            messages: updatedMessages.slice(-20),
          }),
        }).catch(() => {});
      }
    } catch {}
  };

  return (
    <>
    <Head>
      <title>Chat with Starky — NewWorldEdu</title>
      <meta name="description" content="Chat with Starky, your personal tutor. Cambridge O Level and A Level exam preparation, homework help, and concept explanations in 16 languages." />
      <meta property="og:title" content="Chat with Starky — Personal Tutor" />
      <meta property="og:description" content="Chat with Starky, your personal tutor. Cambridge O Level and A Level exam preparation, homework help, and concept explanations in 16 languages." />
    </Head>
    <div style={{
      fontFamily: "'Nunito','Segoe UI',sans-serif",
      background: "#060B20", color: "#fff",
      height: "100dvh", display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:4px;}
        textarea:focus{outline:none;}
        .spill::-webkit-scrollbar{display:none;}
        .subj-btn{transition:all 0.15s;cursor:pointer;border:none;}
        .starter{transition:all 0.15s;cursor:pointer;text-align:left;width:100%;}
        .starter:hover{background:rgba(255,255,255,0.09)!important;transform:translateX(3px);}
      `}</style>

      {showLimit && <LimitReachedModal onClose={() => setShowLimit(false)} />}

      {/* HEADER */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "10px 14px" : "12px 28px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(6,11,32,0.98)", flexShrink: 0,
      }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🌍</span>
          <span style={{ fontWeight: 900, fontSize: 15, color: "#fff" }}>
            NewWorld <span style={{ color: "#63D2FF" }}>EDUCATION</span>
          </span>
        </a>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/special-needs" style={{
            background: "rgba(168,99,255,0.15)", border: "1px solid rgba(168,99,255,0.3)",
            color: "#C77DFF", padding: "5px 12px", borderRadius: 20,
            fontSize: 12, fontWeight: 700, textDecoration: "none",
          }}>💜 {isMobile ? "Special" : "Special Needs"}</a>
          <a href="/parent" style={{
            background: "rgba(255,195,0,0.12)", border: "1px solid rgba(255,195,0,0.3)",
            color: "#FFC300", padding: "5px 12px", borderRadius: 20,
            fontSize: 12, fontWeight: 700, textDecoration: "none",
          }}>{isMobile ? "👨‍👧‍👦" : "👨‍👧‍👦 Parents"}</a>
          {childName && (
            <a href="/parent" style={{ background:'rgba(168,224,99,0.12)', border:'1px solid rgba(168,224,99,0.3)', color:'#A8E063', padding:'5px 12px', borderRadius:20, fontSize:12, fontWeight:700, textDecoration:'none' }}>👨‍👩‍👧 Parent</a>
          )}
        </div>
      </div>

      {/* SUBJECT TABS */}
      <div className="spill" style={{
        display: "flex", gap: 6, overflowX: "auto",
        padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)", flexShrink: 0,
      }}>
        {SUBJECTS.map(s => (
          <button key={s.id} className="subj-btn" onClick={() => setActiveId(s.id)} style={{
            background: activeId === s.id ? `${s.color}22` : "rgba(255,255,255,0.04)",
            border: `1.5px solid ${activeId === s.id ? s.color+"88" : "rgba(255,255,255,0.08)"}`,
            color: activeId === s.id ? s.color : "rgba(255,255,255,0.45)",
            borderRadius: 20, padding: "6px 14px",
            fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
            fontFamily: "'Nunito',sans-serif",
          }}>
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {/* CHAT */}
      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "12px" : "20px 28px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {/* Empty state */}
          {messages.length === 0 && (
            <div style={{ animation: "fadeUp 0.3s ease-out" }}>
              <div style={{
                textAlign: "center", padding: isMobile ? "20px 12px" : "32px 24px",
                marginBottom: 16,
              }}>
                <div style={{
                  width: 60, height: 60, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${subject.color}, ${subject.color}66)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, margin: "0 auto 14px",
                }}>⭐</div>
                <div style={{ fontWeight: 900, fontSize: isMobile ? 20 : 24, marginBottom: 8 }}>
                  Hi! I'm Starky {subject.emoji}
                </div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.6 }}>
                  Your tutor for <span style={{ color: subject.color, fontWeight: 700 }}>{subject.label}</span>.
                  Ask me anything or tap a question below.
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {subject.starters.map((q, i) => (
                  <button key={i} className="starter" onClick={() => send(q)} style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${subject.color}33`,
                    borderRadius: 14, padding: "11px 16px",
                    color: "rgba(255,255,255,0.75)", fontSize: 14,
                    fontFamily: "'Nunito',sans-serif",
                  }}>
                    <span style={{ color: subject.color, marginRight: 8 }}>→</span>{q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((m, i) => <ChatMessage key={i} msg={m} color={subject.color} />)}
          {loading && <TypingDots color={subject.color} />}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* INPUT */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: isMobile ? "10px 12px" : "12px 28px",
        background: "rgba(6,11,32,0.98)", flexShrink: 0,
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {/* Image preview */}
          {imageData && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '6px 12px', marginBottom: 8, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              <span>📷 Image attached</span>
              <button onClick={() => setImageData(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14, marginLeft: 'auto' }}>✕</button>
            </div>
          )}
          {/* Hidden file inputs */}
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => {
            const file = e.target.files?.[0]; if (!file) return;
            const reader = new FileReader(); reader.onload = () => setImageData(reader.result); reader.readAsDataURL(file);
            e.target.value = '';
          }} />
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
            const file = e.target.files?.[0]; if (!file) return;
            const reader = new FileReader(); reader.onload = () => setImageData(reader.result); reader.readAsDataURL(file);
            e.target.value = '';
          }} />
          <div style={{
            display: "flex", gap: 8, alignItems: "flex-end",
            background: "rgba(255,255,255,0.06)",
            border: `1.5px solid ${subject.color}44`,
            borderRadius: 18, padding: "9px 12px",
          }}>
            {/* Mic button */}
            {voice.supported && (
              <button onClick={() => voice.toggle(t => setInput(prev => (prev ? prev + ' ' : '') + t))} style={{
                width: 38, height: 38, borderRadius: 12, border: 'none', flexShrink: 0,
                background: voice.listening ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.08)',
                color: voice.listening ? '#F87171' : 'rgba(255,255,255,0.5)',
                fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }} title="Voice input">
                {voice.listening ? '⏹' : '🎙️'}
              </button>
            )}
            {/* Camera button */}
            <button onClick={() => cameraRef.current?.click()} style={{
              width: 38, height: 38, borderRadius: 12, border: 'none', flexShrink: 0,
              background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',
              fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} title="Take photo">
              📷
            </button>
            {/* File upload button */}
            <button onClick={() => fileRef.current?.click()} style={{
              width: 38, height: 38, borderRadius: 12, border: 'none', flexShrink: 0,
              background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',
              fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} title="Upload image">
              📎
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              placeholder={childName ? `Hi ${childName}! ${subject.placeholder}` : subject.placeholder}
              rows={1}
              style={{
                flex: 1, background: "none", border: "none", color: "#fff",
                fontSize: 14, lineHeight: 1.5, resize: "none", maxHeight: 100,
                fontFamily: "'Nunito',sans-serif",
              }}
              onInput={e => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
              }}
            />
            <button
              onClick={() => send()}
              disabled={(!input.trim() && !imageData) || loading}
              style={{
                background: (input.trim() || imageData) && !loading
                  ? `linear-gradient(135deg, ${subject.color}, ${subject.color}AA)`
                  : "rgba(255,255,255,0.08)",
                border: "none", borderRadius: 12,
                width: 38, height: 38, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, color: "#fff", cursor: (input.trim() || imageData) ? "pointer" : "not-allowed",
                transition: "all 0.15s",
              }}
            >
              {loading
                ? <div style={{ width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.7s linear infinite" }}/>
                : "→"}
            </button>
          </div>
          {limitReached && (
            <div style={{ textAlign:'center', padding:'10px 14px', margin:'8px 0 0', background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:12 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#FF6B6B', marginBottom:6 }}>Daily sessions used up!</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginBottom:8 }}>Try these free features:</div>
              <div style={{ display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap' }}>
                <a href="/spelling-bee" style={{fontSize:11,fontWeight:700,color:'#FFC300',textDecoration:'none',background:'rgba(255,192,0,0.1)',border:'1px solid rgba(255,192,0,0.25)',borderRadius:100,padding:'4px 12px'}}>🐝 Spelling Bee</a>
                <a href="/languages" style={{fontSize:11,fontWeight:700,color:'#7C5CBF',textDecoration:'none',background:'rgba(124,92,191,0.1)',border:'1px solid rgba(124,92,191,0.25)',borderRadius:100,padding:'4px 12px'}}>🌍 Languages</a>
                <a href="/countdown" style={{fontSize:11,fontWeight:700,color:'#63D2FF',textDecoration:'none',background:'rgba(99,210,255,0.1)',border:'1px solid rgba(99,210,255,0.25)',borderRadius:100,padding:'4px 12px'}}>⏱️ Countdown</a>
                <a href="/leaderboard" style={{fontSize:11,fontWeight:700,color:'#A8E063',textDecoration:'none',background:'rgba(168,224,99,0.1)',border:'1px solid rgba(168,224,99,0.25)',borderRadius:100,padding:'4px 12px'}}>🏆 Leaderboard</a>
              </div>
            </div>
          )}
          <div style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.18)", marginTop: 5 }}>
            Powered by NewWorldEdu{childName ? ` · ${childName}` : ''}{limitReached ? '' : ` · ${callsLeft} sessions remaining`}
          </div>
          <div style={{ display:'flex', gap:8, justifyContent:'center', padding:'8px 14px', flexWrap:'wrap' }}>
            {[
              { href:'/drill', label:'🎯 Drill', color:'#4F8EF7' },
              { href:'/homework', label:'📝 Homework', color:'#A8E063' },
              { href:'/essay', label:'✍️ Essay', color:'#FFC300' },
              { href:'/past-papers', label:'📚 Papers', color:'#63D2FF' },
              { href:'/languages', label:'🌍 Languages', color:'#7C5CBF' },
              { href:'/spelling-bee', label:'🐝 Spelling', color:'#F59E0B' },
            ].map(l => (
              <a key={l.href} href={l.href} style={{ fontSize:10, fontWeight:700, color:l.color, textDecoration:'none', padding:'4px 10px', borderRadius:20, background:l.color+'15', border:`1px solid ${l.color}30` }}>{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
