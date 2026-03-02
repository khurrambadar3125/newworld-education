import { useState, useRef, useEffect } from "react";
import { useSessionLimit, LimitReachedModal } from "../utils/useSessionLimit";

// ── SPECIAL NEEDS PROFILES ─────────────────────────────────────────────────
const PROFILES = [
  {
    id: "dyslexia",
    emoji: "📖",
    label: "Dyslexia",
    color: "#63D2FF",
    description: "Reading & writing support",
    placeholder: "Type your question — Starky will keep answers short and clear...",
    starterQuestions: [
      "Can you explain this in very simple words?",
      "Help me understand — one step at a time please.",
      "What does this word mean?",
      "Can you use a story to explain this?",
    ],
    systemPrompt: `You are Starky ⭐, a warm and deeply patient AI tutor on NewWorld Education, specifically trained to support students with dyslexia.

RULES YOU MUST ALWAYS FOLLOW:
- Use very SHORT sentences. Never more than 15 words per sentence.
- Use SIMPLE words only. No difficult vocabulary unless you explain it immediately.
- Break every explanation into NUMBERED steps (1, 2, 3...).
- Use LOTS of emojis to make text visually friendly and easier to scan.
- NEVER give a wall of text. Use line breaks between every sentence.
- Repeat key points in a different way if the student seems confused.
- Always respond in the SAME language the student writes in. If they write Urdu, reply in Urdu.
- CELEBRATE every question. Never make the student feel bad for asking again.
- If a student says "I don't understand", simplify even further and try a different approach.
- You help with ANY subject — reading, writing, maths, science, anything.`,
  },
  {
    id: "adhd",
    emoji: "⚡",
    label: "ADHD",
    color: "#FFC300",
    description: "Focus & attention support",
    placeholder: "Ask anything — Starky will keep it short, fun and energetic!",
    starterQuestions: [
      "Give me the most important point in 3 sentences.",
      "Make this topic interesting for me!",
      "Can we do this in quick steps?",
      "Give me a fun way to remember this.",
    ],
    systemPrompt: `You are Starky ⭐, an energetic and focused AI tutor on NewWorld Education, specifically trained to support students with ADHD.

RULES YOU MUST ALWAYS FOLLOW:
- Keep responses SHORT and PUNCHY. Get to the point fast.
- Use BULLET POINTS and numbered lists — never long paragraphs.
- Make content EXCITING. Use energy, enthusiasm, and fun comparisons.
- Use emojis frequently to break up text and add visual interest ⚡🎯🔥
- Give ONE idea at a time. Never overwhelm with multiple concepts.
- Use BOLD for the most important words so they stand out.
- Add memory tricks, mnemonics, or funny analogies to help retention.
- Always respond in the SAME language the student writes in.
- End every response with ONE clear action: "Your next step is..."
- You help with ANY subject. Make every topic feel like a mission.`,
  },
  {
    id: "autism",
    emoji: "🌟",
    label: "Autism Spectrum",
    color: "#A8E063",
    description: "Clear & structured learning",
    placeholder: "Ask your question — Starky will be clear, calm and predictable...",
    starterQuestions: [
      "Explain this step by step with clear rules.",
      "What are the exact steps to solve this?",
      "Give me a clear and logical explanation.",
      "Can you explain this without metaphors?",
    ],
    systemPrompt: `You are Starky ⭐, a calm, structured, and reliable AI tutor on NewWorld Education, specifically trained to support students on the autism spectrum.

RULES YOU MUST ALWAYS FOLLOW:
- Be PREDICTABLE. Always structure responses the same way: explanation, then example, then summary.
- Be LITERAL and PRECISE. Avoid idioms, sarcasm, or figurative language unless you explain them.
- Use CLEAR numbered steps for any process.
- Be CONSISTENT in tone — always calm, neutral, and reassuring.
- Avoid AMBIGUITY. If something could be interpreted two ways, clarify both.
- Use CONCRETE examples from real life, not abstract concepts.
- Do NOT use excessive exclamation marks or false enthusiasm — be genuine.
- Always respond in the SAME language the student writes in.
- If the student asks the same question again, answer it again patiently without comment.
- You help with ANY subject. Precision and clarity are your strengths.`,
  },
  {
    id: "visual",
    emoji: "👁️",
    label: "Visual Impairment",
    color: "#C77DFF",
    description: "Screen-reader friendly",
    placeholder: "Ask anything — Starky will describe everything clearly in words...",
    starterQuestions: [
      "Describe this concept completely in words.",
      "Explain this without needing to see diagrams.",
      "What does this look like — describe it to me.",
      "Give me a full verbal explanation.",
    ],
    systemPrompt: `You are Starky ⭐, a thoughtful and descriptive AI tutor on NewWorld Education, specifically trained to support students with visual impairments.

RULES YOU MUST ALWAYS FOLLOW:
- DESCRIBE everything in words. Never say "as you can see" or "look at this".
- For diagrams or visual concepts, provide a FULL verbal description (e.g. "Imagine a circle divided into four equal parts...").
- Use CLEAR structure with headings and numbered sections so screen readers work well.
- Keep formatting SIMPLE — avoid complex tables or ASCII art.
- For maths, describe equations in plain language ("x squared plus 2x minus 3 equals zero").
- Always respond in the SAME language the student writes in.
- Be thorough — give complete descriptions so nothing visual is missed.
- You help with ANY subject. Your strength is turning the visual into the verbal.`,
  },
  {
    id: "hearing",
    emoji: "🤝",
    label: "Hearing Impairment",
    color: "#FF6B6B",
    description: "Text & visual learning",
    placeholder: "Ask anything — Starky communicates fully through text and visuals...",
    starterQuestions: [
      "Explain this fully in writing please.",
      "Can you use diagrams or visual descriptions?",
      "Help me understand without any audio.",
      "Explain this concept clearly in text.",
    ],
    systemPrompt: `You are Starky ⭐, an expressive and visual AI tutor on NewWorld Education, specifically trained to support students with hearing impairments.

RULES YOU MUST ALWAYS FOLLOW:
- Communicate FULLY through text. Never reference audio, sounds, or "listen to this".
- Use VISUAL descriptions and word-pictures to explain concepts.
- Use emojis, symbols, and formatting to add expressiveness to text.
- Structure responses CLEARLY with headers and bullet points.
- For concepts that are typically taught through audio (music, language sounds), describe them visually and textually.
- Always respond in the SAME language the student writes in.
- Be EXPRESSIVE in writing — compensate for the lack of tone of voice with clear, warm language.
- You help with ANY subject. Text is your superpower.`,
  },
];

// ── STARS BACKGROUND ───────────────────────────────────────────────────────
const Stars = ({ count = 40 }) => {
  const stars = useRef(Array.from({ length: count }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.4 + 0.1,
    delay: Math.random() * 4,
  }))).current;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
          width: `${s.size}px`, height: `${s.size}px`,
          borderRadius: "50%", background: "#fff", opacity: s.opacity,
          animation: `twinkle 3s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
};

// ── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function SpecialPage() {
  const [activeProfile, setActiveProfile] = useState(PROFILES[0]);
  const [messages, setMessages]           = useState([{ role: "assistant", content: `Hi there! 💜 I'm Starky ⭐ — your personal AI teacher.\n\nI'm specially trained to teach YOU in the way that works best for you.\n\nJust ask me anything — any subject, any language. I'm here for you! ★` }]);
  const [input, setInput]                 = useState("");
  const [loading, setLoading]             = useState(false);
  const chatEndRef                        = useRef(null);
  const { callsUsed, callsLeft, limitReached, recordCall, FREE_DAILY_LIMIT } = useSessionLimit();
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const handleProfileChange = (profile) => {
    setActiveProfile(profile);
    setMessages([{ role: "assistant", content: `Switching to ${profile.emoji} ${profile.label} mode!\n\nI'm now fully focused on teaching in a way that works best for you. Ask me anything — I'm ready! 🌟` }]);
    setInput("");
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    if (limitReached) { setShowLimitModal(true); return; }
    recordCall();
    setInput("");
    setLoading(true);
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: activeProfile.systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Let me try that again for you! 🌟";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong — please try again! I'm still here for you 💜" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#060B20 0%,#0D1B3E 50%,#060B20 100%)", fontFamily: "'Nunito',sans-serif", position: "relative", overflowX: "hidden" }}>
      <Stars />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes twinkle { 0%,100%{opacity:0.1} 50%{opacity:0.6} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .profile-btn:hover { transform: translateY(-2px); }
        .starter-btn:hover { background: rgba(255,255,255,0.1) !important; }
        .send-btn:hover { opacity: 0.85; transform: scale(1.05); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      `}</style>

      {/* HEADER */}
      <header style={{ position: "relative", zIndex: 10, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>🌍</span>
          <span style={{ fontWeight: "900", fontSize: "18px", color: "#fff", letterSpacing: "-0.5px" }}>
            NewWorld <span style={{ color: "#63D2FF" }}>EDUCATION</span>
          </span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ background: "rgba(168,224,99,0.15)", border: "1px solid rgba(168,224,99,0.3)", color: "#A8E063", padding: "5px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "800" }}>
            💜 INCLUSIVE LEARNING
          </span>
          <a href="/demo" style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", textDecoration: "none", fontWeight: "700" }}>← Standard Mode</a>
        </div>
      </header>

      {/* HERO */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "40px 24px 20px" }}>
        <div style={{ fontSize: "48px", animation: "float 4s ease-in-out infinite", marginBottom: "12px" }}>💜</div>
        <h1 style={{ fontSize: "clamp(24px,4vw,42px)", fontWeight: "900", color: "#fff", margin: "0 0 12px", letterSpacing: "-1px" }}>
          Starky for <span style={{ color: "#A8E063" }}>Every Learner</span>
        </h1>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", maxWidth: "560px", margin: "0 auto 8px", lineHeight: 1.6 }}>
          Every child learns differently. Starky adapts to <strong style={{ color: "#fff" }}>your way</strong> of learning — with patience, care, and zero judgment.
        </p>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
          Free forever · Any subject · Any language · Always kind
        </p>
      </div>

      {/* PROFILE SELECTOR */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: "760px", margin: "24px auto", padding: "0 16px" }}>
        <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.45)", fontWeight: "700", letterSpacing: "1px", marginBottom: "12px" }}>
          SELECT YOUR LEARNING STYLE
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          {PROFILES.map(p => (
            <button key={p.id} className="profile-btn" onClick={() => handleProfileChange(p)} style={{
              background: activeProfile.id === p.id ? `linear-gradient(135deg,${p.color}33,${p.color}18)` : "rgba(255,255,255,0.05)",
              border: `2px solid ${activeProfile.id === p.id ? p.color : "rgba(255,255,255,0.1)"}`,
              borderRadius: "16px", padding: "12px 18px", cursor: "pointer", color: "#fff",
              fontWeight: "800", fontSize: "13px", transition: "all 0.2s", fontFamily: "'Nunito',sans-serif",
              boxShadow: activeProfile.id === p.id ? `0 0 20px ${p.color}33` : "none",
            }}>
              <span style={{ fontSize: "18px", display: "block", marginBottom: "4px" }}>{p.emoji}</span>
              {p.label}
              <span style={{ display: "block", fontSize: "10px", color: "rgba(255,255,255,0.5)", fontWeight: "600", marginTop: "2px" }}>{p.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: "760px", margin: "0 auto 40px", padding: "0 16px" }}>
        <div style={{ background: "rgba(13,22,50,0.8)", border: `1px solid ${activeProfile.color}33`, borderRadius: "24px", overflow: "hidden", backdropFilter: "blur(20px)" }}>

          {/* Chat header */}
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${activeProfile.color}22`, display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: `linear-gradient(135deg,${activeProfile.color}33,${activeProfile.color}18)`, border: `2px solid ${activeProfile.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", animation: "float 4s ease-in-out infinite" }}>
              ⭐
            </div>
            <div>
              <div style={{ fontWeight: "900", fontSize: "15px", color: "#fff" }}>Starky AI Tutor</div>
              <div style={{ fontSize: "12px", color: activeProfile.color, fontWeight: "700" }}>
                <span style={{ display: "inline-block", width: "6px", height: "6px", background: "#A8E063", borderRadius: "50%", marginRight: "6px", verticalAlign: "middle", animation: "pulse 2s infinite" }} />
                {activeProfile.emoji} {activeProfile.label} Mode · Always here for you 💜
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ height: "380px", overflowY: "auto", padding: "20px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: "14px", animation: "fadeIn 0.3s ease-out" }}>
                {msg.role === "assistant" && (
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `${activeProfile.color}22`, border: `1px solid ${activeProfile.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", marginRight: "8px", flexShrink: 0, marginTop: "2px" }}>⭐</div>
                )}
                <div style={{
                  maxWidth: "82%", padding: "12px 16px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: msg.role === "user" ? `linear-gradient(135deg,${activeProfile.color}CC,${activeProfile.color}99)` : "rgba(255,255,255,0.06)",
                  color: msg.role === "user" ? "#060B20" : "#fff",
                  fontSize: "14px", lineHeight: "1.65", fontWeight: msg.role === "user" ? "700" : "500",
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `${activeProfile.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>⭐</div>
                <span style={{ animation: "pulse 1s infinite" }}>Starky is thinking... 💜</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Starter questions */}
          <div style={{ padding: "0 16px 12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {activeProfile.starterQuestions.map((q, i) => (
              <button key={i} className="starter-btn" onClick={() => sendMessage(q)} style={{
                background: "rgba(255,255,255,0.05)", border: `1px solid ${activeProfile.color}33`,
                borderRadius: "20px", padding: "6px 14px", color: "rgba(255,255,255,0.7)",
                fontSize: "12px", cursor: "pointer", fontFamily: "'Nunito',sans-serif",
                fontWeight: "600", transition: "all 0.2s",
              }}>
                {q.length > 40 ? q.slice(0, 40) + "…" : q}
              </button>
            ))}
          </div>

          {/* Session counter hidden from child — parent handles billing via portal */}

          {/* Input */}
          <div style={{ padding: "12px 16px 16px", borderTop: `1px solid ${activeProfile.color}22`, display: "flex", gap: "10px" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder={activeProfile.placeholder}
              style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: `1px solid ${activeProfile.color}33`, borderRadius: "14px", padding: "13px 16px", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "'Nunito',sans-serif" }}
            />
            <button className="send-btn" onClick={() => sendMessage()} style={{
              background: `linear-gradient(135deg,${activeProfile.color},${activeProfile.color}BB)`,
              border: "none", borderRadius: "14px", padding: "13px 20px", color: "#060B20",
              fontWeight: "900", fontSize: "14px", cursor: "pointer", transition: "all 0.2s",
              fontFamily: "'Nunito',sans-serif",
            }}>
              Ask →
            </button>
          </div>
        </div>

        {/* How Starky helps */}
        <div style={{ marginTop: "20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "20px 24px" }}>
          <div style={{ fontWeight: "900", fontSize: "14px", color: activeProfile.color, marginBottom: "14px" }}>
            💜 How Starky supports {activeProfile.emoji} {activeProfile.label} learners
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              ["✂️", "Shorter, clearer sentences"],
              ["🔁", "Patient repetition — never frustrated"],
              ["🌍", "Responds in your language"],
              ["📋", "Step-by-step breakdowns"],
              ["🎉", "Celebrates every question"],
              ["💬", "Zero judgment, always kind"],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "rgba(255,255,255,0.65)" }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showLimitModal && <LimitReachedModal onClose={() => setShowLimitModal(false)} />}

      {/* FOOTER */}
      <footer style={{ position: "relative", zIndex: 2, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", margin: 0 }}>
          💜 Every child deserves a world-class tutor · NewWorld Education · Free forever
        </p>
      </footer>
    </div>
  );
}