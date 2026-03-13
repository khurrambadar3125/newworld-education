import { useState, useRef, useEffect } from "react";
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

export default function DemoPage() {
  const isMobile = useIsMobile();
  const [activeId, setActiveId] = useState("olevel");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const { callsLeft, limitReached, recordCall } = useSessionLimit();
  const [showLimit, setShowLimit] = useState(false);

  const subject = SUBJECTS.find(s => s.id === activeId);

  useEffect(() => { setMessages([]); setInput(""); }, [activeId]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text) => {
    const t = text || input.trim();
    if (!t || loading) return;
    if (limitReached) { setShowLimit(true); return; }
    recordCall();
    setInput("");
    setLoading(true);
    const history = [...messages, { role: "user", content: t }];
    setMessages(history);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 800,
          system: subject.system,
          messages: history.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Let me think about that — try asking again! 🌟";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong — please try again! 🌟" }]);
    }
    setLoading(false);
  };

  return (
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
                  Your AI tutor for <span style={{ color: subject.color, fontWeight: 700 }}>{subject.label}</span>.
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
          <div style={{
            display: "flex", gap: 10, alignItems: "flex-end",
            background: "rgba(255,255,255,0.06)",
            border: `1.5px solid ${subject.color}44`,
            borderRadius: 18, padding: "9px 12px",
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              placeholder={subject.placeholder}
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
              disabled={!input.trim() || loading}
              style={{
                background: input.trim() && !loading
                  ? `linear-gradient(135deg, ${subject.color}, ${subject.color}AA)`
                  : "rgba(255,255,255,0.08)",
                border: "none", borderRadius: 12,
                width: 38, height: 38, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, color: "#fff", cursor: input.trim() ? "pointer" : "not-allowed",
                transition: "all 0.15s",
              }}
            >
              {loading
                ? <div style={{ width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.7s linear infinite" }}/>
                : "→"}
            </button>
          </div>
          <div style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.18)", marginTop: 5 }}>
            Powered by Claude AI · NewWorldEdu · {callsLeft} free sessions remaining
          </div>
        </div>
      </div>
    </div>
  );
}
