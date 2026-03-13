import { useState, useRef, useEffect } from "react";
import { useSessionLimit, SessionLimitBanner, LimitReachedModal } from "../utils/useSessionLimit";

const GRADES = [
  { id: "kg",  label: "Nursery / KG", age: "3–5", emoji: "🌱", color: "#FFB347" },
  { id: "g1",  label: "Grade 1",      age: "5–6", emoji: "⭐", color: "#FF6B6B" },
  { id: "g2",  label: "Grade 2",      age: "6–7", emoji: "🌈", color: "#FF8E53" },
  { id: "g3",  label: "Grade 3",      age: "7–8", emoji: "🚀", color: "#FFC300" },
  { id: "g4",  label: "Grade 4",      age: "8–9", emoji: "🔬", color: "#A8E063" },
  { id: "g5",  label: "Grade 5",      age: "9–10", emoji: "🌍", color: "#4ECDC4" },
  { id: "g6",  label: "Grade 6",      age: "10–11", emoji: "🏆", color: "#63D2FF" },
];

const SUBJECTS = [
  { id: "maths",    label: "➕ Maths",          color: "#FF6B6B" },
  { id: "english",  label: "📖 English",         color: "#63D2FF" },
  { id: "science",  label: "🔬 Science",         color: "#A8E063" },
  { id: "urdu",     label: "اردو Urdu",          color: "#FFC300" },
  { id: "islamiat", label: "☪️ Islamiat",        color: "#4ECDC4" },
  { id: "gk",       label: "🌍 General Knowledge",color: "#C77DFF" },
  { id: "craft",    label: "🎨 Art & Craft",     color: "#FF8E53" },
  { id: "other",    label: "📚 Other",           color: "#888" },
];

const CRAFT_IDEAS = [
  {
    title: "Paper Butterfly",
    age: "3+",
    time: "15 min",
    materials: ["Coloured paper", "Scissors", "Glue stick", "Pencil"],
    steps: [
      "Fold a piece of coloured paper in half lengthwise.",
      "Draw half a butterfly wing shape along the fold — it should look like a hill or bump.",
      "Cut along your drawn line — keeping the fold intact.",
      "Unfold to reveal a full butterfly wing shape!",
      "Decorate both wings with circles, dots, and swirls.",
      "Pinch the middle and glue or twist a pipe cleaner as the body.",
      "Add two small antennae curled at the top.",
    ],
    emoji: "🦋",
  },
  {
    title: "Mini Solar System",
    age: "5+",
    time: "30 min",
    materials: ["Black card", "White chalk or crayon", "Coloured paints", "Cotton wool", "Glue"],
    steps: [
      "Lay out black card as your space background.",
      "Draw a large yellow circle on one side — that's the Sun!",
      "Draw 8 small circles in a curved line moving away from the Sun.",
      "Paint each planet a different colour: Mercury (grey), Venus (yellow), Earth (blue/green), Mars (red)...",
      "Add Saturn's rings by drawing an oval around it.",
      "Dab tiny dots of white chalk for stars all over the background.",
      "Label each planet and write one fun fact next to it.",
    ],
    emoji: "🪐",
  },
  {
    title: "My Feelings Jar",
    age: "4+",
    time: "20 min",
    materials: ["Empty jam jar", "Coloured tissue paper", "White glue + water", "Paintbrush", "Small paper strips"],
    steps: [
      "Mix equal parts white glue and water in a cup.",
      "Tear coloured tissue paper into small pieces.",
      "Brush the glue mixture onto the jar, then layer on tissue paper.",
      "Cover the whole jar with overlapping colours — beautiful!",
      "Let it dry completely (about 30 minutes).",
      "Write emotions on small paper strips: happy, excited, worried, proud...",
      "Fold them up and put them inside — use the jar to talk about feelings!",
    ],
    emoji: "🫙",
  },
  {
    title: "Leaf Print Art",
    age: "3+",
    time: "20 min",
    materials: ["Leaves from the garden", "Washable paints", "White paper", "Paintbrush"],
    steps: [
      "Collect 5–6 leaves of different shapes and sizes from outside.",
      "Lay each leaf flat with the bumpy (veined) side facing UP.",
      "Use a paintbrush to cover the leaf surface with paint.",
      "Press the painted side firmly onto white paper.",
      "Carefully peel back the leaf to reveal the print!",
      "Repeat with different colours and leaf shapes.",
      "Let it dry, then label each leaf with its tree name.",
    ],
    emoji: "🍂",
  },
];

const MODE_PARENT = "parent";
const MODE_CHILD  = "child";

// ── tiny markdown-ish formatter ─────────────────────────────────────────────
const FormatText = ({ text }) => {
  const lines = text.split("\n");
  return (
    <div>
      {lines.map((line, i) => {
        if (line.startsWith("## ")) return <h3 key={i} style={{ fontWeight: "900", fontSize: "17px", margin: "16px 0 6px", color: "#FFC300" }}>{line.slice(3)}</h3>;
        if (line.startsWith("# "))  return <h2 key={i} style={{ fontWeight: "900", fontSize: "20px", margin: "16px 0 8px", color: "#FFB347" }}>{line.slice(2)}</h2>;
        if (line.match(/^\d+\.\s/)) return <p  key={i} style={{ margin: "6px 0", paddingLeft: "4px", display: "flex", gap: "8px" }}><span style={{ color: "#FFC300", fontWeight: "800", minWidth: "24px" }}>{line.match(/^\d+/)[0]}.</span><span>{line.replace(/^\d+\.\s/, "")}</span></p>;
        if (line.startsWith("- "))  return <p  key={i} style={{ margin: "5px 0", paddingLeft: "4px", display: "flex", gap: "8px" }}><span style={{ color: "#FF8E53" }}>•</span><span>{line.slice(2)}</span></p>;
        if (line.startsWith("**") && line.endsWith("**")) return <p key={i} style={{ fontWeight: "800", color: "#FFB347", margin: "10px 0 4px" }}>{line.slice(2, -2)}</p>;
        if (line.trim() === "") return <div key={i} style={{ height: "8px" }} />;
        return <p key={i} style={{ margin: "4px 0", lineHeight: "1.7" }}>{line}</p>;
      })}
    </div>
  );
};

// ── MAIN ────────────────────────────────────────────────────────────────────
export default function HomeworkHelper() {
  const [selectedGrade,   setSelectedGrade]   = useState(GRADES[1]);  // Grade 1 default
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [mode,            setMode]            = useState(MODE_PARENT);
  const [question,        setQuestion]        = useState("");
  const [answer,          setAnswer]          = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [history,         setHistory]         = useState([]);
  const [followUp,        setFollowUp]        = useState("");
  const [activeTab,       setActiveTab]       = useState("homework"); // homework | craft
  const [activeCraft,     setActiveCraft]     = useState(null);
  const { callsUsed, callsLeft, limitReached, recordCall } = useSessionLimit();
  const [showLimitModal, setShowLimitModal]   = useState(false);
  const [copiedStep,      setCopiedStep]      = useState(null);
  const answerRef = useRef(null);

  useEffect(() => {
    if (answer) answerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [answer]);

  const buildSystemPrompt = () => {
    const gradeLabel = selectedGrade.label;
    const age        = selectedGrade.age;
    const subject    = selectedSubject.label;

    if (mode === MODE_PARENT) {
      return `You are Starky, a warm and expert homework helper for parents.
A parent is sitting with their ${age}-year-old child (${gradeLabel}) doing ${subject} homework.
Your job is to help the PARENT understand the concept clearly so they can explain it to their child.

KNOWLEDGE: You have mastered every Cambridge O Level and A Level syllabus (1994–2024), every mark scheme, every examiner report, and every major curriculum from KG through Sixth Form including UK, Pakistan, and international curricula. You know exactly how examiners award marks.

Give the parent:
1. A simple, clear explanation of the concept — what it actually means
2. The actual answer/solution with full working shown step by step
3. A fun, easy way to explain it to a ${age}-year-old (use a story, game, or everyday object)
4. One or two follow-up questions the parent can ask to check the child understood
5. If this is an exam-level question: the exact mark scheme language Cambridge/AQA/Edexcel rewards

Be warm, encouraging, and practical. Parents are often tired — make this easy for them.
Use clear headings and numbered steps. If the question is from a past paper, work it exactly as a Cambridge examiner would.
Respond in Urdu or Arabic if the parent writes in those languages.`;
    } else {
      return `You are Starky, a magical friendly tutor for a ${age}-year-old child in ${gradeLabel}.
You are talking DIRECTLY to the child. Use their name occasionally if given.

KNOWLEDGE: You know everything — every subject from KG through A Levels, every Cambridge syllabus, every story book, every maths concept, every science topic. Nothing is too simple or too hard for you.

Make learning feel like a game or adventure:
- Very simple words a ${age}-year-old understands
- Lots of emojis 🌟⭐🎉✨
- Short sentences, big energy
- Fun comparisons (numbers as pizza slices, atoms as tiny footballs, history as an adventure story)
- Celebrate every correct answer with genuine excitement
- If they're wrong: "Ooh, close! Let's try a different way 🤔"
- End with a fun question or mini-challenge to check understanding

For maths: show every step, explain each one simply
For English: make the story come alive — characters, feelings, drama
For science: "Imagine you are the atom..." — make it physical and visual
For history: tell it like an exciting story first, facts second

Never use complicated words. Be their best, most magical friend who makes homework the best part of their day!
Respond in Urdu or Arabic if the child writes in those languages.`;
    }
  };

  const askStarky = async (q = null) => {
    const text = q || question.trim();
    if (!text) return;
    if (limitReached) { setShowLimitModal(true); return; }
    recordCall();
    setLoading(true);
    setAnswer(null);

    const systemPrompt = buildSystemPrompt();
    const contextLine  = `Subject: ${selectedSubject.label} | Grade: ${selectedGrade.label} | Age: ${selectedGrade.age}`;
    const fullQuestion = `${contextLine}\n\nHomework question: ${text}`;

    const msgs = [
      ...history,
      { role: "user", content: fullQuestion },
    ];

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: systemPrompt,
          messages: msgs,
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Hmm, let me think again — please try once more!";
      setAnswer(reply);
      setHistory(prev => [...prev, { role: "user", content: fullQuestion }, { role: "assistant", content: reply }]);
      setQuestion("");
    } catch {
      setAnswer("Oops! Something went wrong. Please check your connection and try again. 🌟");
    }
    setLoading(false);
  };

  const askFollowUp = async () => {
    if (!followUp.trim()) return;
    await askStarky(followUp);
    setFollowUp("");
  };

  const handleCopyStep = (text, idx) => {
    navigator.clipboard?.writeText(text);
    setCopiedStep(idx);
    setTimeout(() => setCopiedStep(null), 1500);
  };

  const accent = selectedGrade.color;

  return (
    <div style={{
      fontFamily: "'Nunito', 'Trebuchet MS', sans-serif",
      background: "linear-gradient(160deg, #0B0E1F 0%, #12101A 50%, #0D1520 100%)",
      color: "#fff", minHeight: "100dvh",
    }}>
      {showLimitModal && <LimitReachedModal onClose={()=>setShowLimitModal(false)}/>}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow     { 0%,100%{box-shadow:0 0 20px rgba(255,179,71,0.3)} 50%{box-shadow:0 0 50px rgba(255,179,71,0.6)} }
        @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes twinkle  { from{opacity:0.1} to{opacity:0.8} }
        .grade-btn:hover    { transform:scale(1.06) translateY(-2px); }
        .subj-pill:hover    { opacity:1 !important; transform:translateY(-2px); }
        .starter-q:hover    { background:rgba(255,255,255,0.1) !important; transform:translateX(3px); }
        .craft-card:hover   { transform:translateY(-5px); border-color:rgba(255,179,71,0.5) !important; }
        .mode-btn:hover     { opacity:1 !important; }
        .ask-btn:hover      { transform:translateY(-2px); filter:brightness(1.1); }
        textarea:focus, input:focus { outline:none; border-color:rgba(255,179,71,0.6) !important; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-thumb { background:rgba(255,179,71,0.3); border-radius:4px; }
      `}</style>

      {/* NAV */}
      <nav style={{
        background: "rgba(11,14,31,0.9)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,179,71,0.15)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: "64px", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>🌍</span>
          <span style={{ fontWeight: "900", fontSize: "17px" }}>
            New<span style={{ color: "#63D2FF" }}>World</span>
            <span style={{ fontSize: "11px", color: "#A8E063", marginLeft: "6px", fontWeight: "700" }}>EDUCATION</span>
          </span>
          <span style={{ marginLeft: "8px", background: "rgba(255,179,71,0.15)", color: "#FFB347", border: "1px solid rgba(255,179,71,0.3)", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", fontWeight: "800" }}>
            🏠 HOMEWORK HELPER
          </span>
        </div>
        <a href="/" style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>← Back to Home</a>
      </nav>

      {/* HERO */}
      <section style={{
        padding: "52px 32px 36px", textAlign: "center",
        background: "radial-gradient(ellipse at 50% 0%, rgba(255,179,71,0.1) 0%, transparent 60%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* bg stars */}
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 0.5}px`, height: `${Math.random() * 2 + 0.5}px`,
            borderRadius: "50%", background: "#fff", opacity: Math.random() * 0.4 + 0.1,
            animation: `twinkle 3s ease-in-out ${Math.random() * 3}s infinite alternate`,
            pointerEvents: "none",
          }} />
        ))}

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Starky */}
          <div style={{
            width: "90px", height: "90px", borderRadius: "50%", margin: "0 auto 18px",
            background: "linear-gradient(135deg, #1A2A4A, #0D1A30)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "46px", border: "3px solid rgba(255,179,71,0.6)",
            animation: "float 3.5s ease-in-out infinite",
            boxShadow: "0 0 40px rgba(255,179,71,0.3)",
          }}>🌟</div>

          <h1 style={{
            fontWeight: "900", fontSize: "clamp(28px, 5vw, 52px)", margin: "0 0 10px", lineHeight: "1.1",
          }}>
            <span style={{ color: "#FFB347" }}>Homework</span> Helper
          </h1>
          <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: "rgba(255,255,255,0.6)", maxWidth: "520px", margin: "0 auto 8px", lineHeight: "1.7" }}>
            Sit back — Starky is here to help you and your little one get through homework together. Quick, clear, and always kind.
          </p>
          <p style={{ fontSize: "13px", color: "rgba(255,179,71,0.7)", fontWeight: "700" }}>
            ✨ For parents of children aged 3–11 · All subjects · Works in any language
          </p>
        </div>
      </section>

      {/* MAIN TABS */}
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", padding: "0 32px 28px" }}>
        {[
          { id: "homework", label: "📝 Homework Helper", desc: "Explain any question" },
          { id: "craft",    label: "🎨 Art & Craft Ideas", desc: "Creative activities" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: activeTab === tab.id ? "rgba(255,179,71,0.15)" : "rgba(255,255,255,0.04)",
            border: `2px solid ${activeTab === tab.id ? "#FFB347" : "rgba(255,255,255,0.1)"}`,
            borderRadius: "18px", padding: "14px 28px", cursor: "pointer",
            fontFamily: "'Nunito', sans-serif", transition: "all 0.2s", textAlign: "center",
          }}>
            <div style={{ fontWeight: "800", fontSize: "15px", color: activeTab === tab.id ? "#FFB347" : "rgba(255,255,255,0.6)" }}>{tab.label}</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "3px" }}>{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* ═══════════════════════ HOMEWORK TAB ═══════════════════════ */}
      {activeTab === "homework" && (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 32px 80px", display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px", alignItems: "start" }}>

          {/* LEFT SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Grade picker */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,179,71,0.2)", borderRadius: "20px", padding: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: "800", color: "rgba(255,179,71,0.8)", letterSpacing: "1px", marginBottom: "14px" }}>MY CHILD IS IN</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {GRADES.map(g => (
                  <button key={g.id} className="grade-btn" onClick={() => setSelectedGrade(g)} style={{
                    background: selectedGrade.id === g.id ? `${g.color}22` : "rgba(255,255,255,0.04)",
                    border: `2px solid ${selectedGrade.id === g.id ? g.color : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "12px", padding: "10px 14px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "10px",
                    transition: "all 0.2s", fontFamily: "'Nunito', sans-serif",
                  }}>
                    <span style={{ fontSize: "20px" }}>{g.emoji}</span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontWeight: "800", fontSize: "13px", color: selectedGrade.id === g.id ? g.color : "#fff" }}>{g.label}</div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Age {g.age}</div>
                    </div>
                    {selectedGrade.id === g.id && <span style={{ marginLeft: "auto", color: g.color, fontSize: "16px" }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject picker */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,179,71,0.2)", borderRadius: "20px", padding: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: "800", color: "rgba(255,179,71,0.8)", letterSpacing: "1px", marginBottom: "14px" }}>SUBJECT</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {SUBJECTS.map(s => (
                  <button key={s.id} className="subj-pill" onClick={() => setSelectedSubject(s)} style={{
                    background: selectedSubject.id === s.id ? `${s.color}22` : "rgba(255,255,255,0.05)",
                    border: `1px solid ${selectedSubject.id === s.id ? s.color : "rgba(255,255,255,0.12)"}`,
                    borderRadius: "20px", padding: "7px 14px", cursor: "pointer",
                    color: selectedSubject.id === s.id ? s.color : "rgba(255,255,255,0.55)",
                    fontWeight: "700", fontSize: "12px", fontFamily: "'Nunito', sans-serif",
                    transition: "all 0.2s", opacity: selectedSubject.id === s.id ? 1 : 0.8,
                  }}>{s.label}</button>
                ))}
              </div>
            </div>

            {/* Mode picker */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,179,71,0.2)", borderRadius: "20px", padding: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: "800", color: "rgba(255,179,71,0.8)", letterSpacing: "1px", marginBottom: "14px" }}>WHO IS READING?</div>
              {[
                { id: MODE_PARENT, emoji: "👩‍👦", label: "Help me explain it", sub: "Starky explains to you so you can teach your child" },
                { id: MODE_CHILD,  emoji: "👦",   label: "Talk to my child", sub: "Starky speaks directly to your little one" },
              ].map(m => (
                <button key={m.id} className="mode-btn" onClick={() => setMode(m.id)} style={{
                  width: "100%", background: mode === m.id ? "rgba(255,179,71,0.15)" : "rgba(255,255,255,0.04)",
                  border: `2px solid ${mode === m.id ? "#FFB347" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "14px", padding: "14px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "12px",
                  fontFamily: "'Nunito', sans-serif", marginBottom: "8px",
                  transition: "all 0.2s",
                }}>
                  <span style={{ fontSize: "26px" }}>{m.emoji}</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: "800", fontSize: "13px", color: mode === m.id ? "#FFB347" : "#fff" }}>{m.label}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", lineHeight: "1.4", marginTop: "3px" }}>{m.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — MAIN CHAT AREA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Question input */}
            <div style={{
              background: "rgba(255,255,255,0.04)", border: `1px solid ${accent}44`,
              borderRadius: "24px", padding: "24px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: `${accent}22`, border: `2px solid ${accent}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                  {selectedGrade.emoji}
                </div>
                <div>
                  <div style={{ fontWeight: "800", fontSize: "15px" }}>{selectedGrade.label} · {selectedSubject.label}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
                    {mode === MODE_PARENT ? "👩‍👦 Explaining to parent" : "👦 Talking to child"}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "13px", fontWeight: "700", color: "rgba(255,255,255,0.5)", marginBottom: "8px", letterSpacing: "0.5px" }}>
                TYPE THE HOMEWORK QUESTION
              </div>
              <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === "Enter" && e.ctrlKey && askStarky()}
                autoCorrect="off" autoCapitalize="sentences" spellCheck={false}
                placeholder={`e.g. "Count from 1 to 10 and circle the even numbers" or paste/type the question from the textbook...`}
                rows={4}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${accent}44`, borderRadius: "16px",
                  padding: "14px 16px", color: "#fff", fontSize: "16px",
                  resize: "vertical", boxSizing: "border-box", lineHeight: "1.6",
                }}
              />

              <div style={{marginBottom:"12px"}}><SessionLimitBanner callsUsed={callsUsed} callsLeft={callsLeft} limitReached={limitReached}/></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", flexWrap: "wrap", gap: "10px" }}>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Ctrl+Enter to submit</span>
                <button onClick={() => askStarky()} disabled={loading || !question.trim()} className="ask-btn" style={{
                  background: loading || !question.trim() ? "rgba(255,255,255,0.1)" : `linear-gradient(135deg, #FFB347, #FF8E53)`,
                  border: "none", color: loading || !question.trim() ? "rgba(255,255,255,0.3)" : "#0D0800",
                  borderRadius: "14px", padding: "14px 32px",
                  fontWeight: "900", fontSize: "15px", cursor: loading || !question.trim() ? "default" : "pointer",
                  fontFamily: "'Nunito', sans-serif", transition: "all 0.2s",
                  boxShadow: loading || !question.trim() ? "none" : "0 6px 24px rgba(255,179,71,0.35)",
                }}>
                  {loading ? "Starky is thinking... 🌟" : "Ask Starky →"}
                </button>
              </div>

              {/* Starter suggestions */}
              <div style={{ marginTop: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "8px", letterSpacing: "0.5px" }}>
                  QUICK EXAMPLES
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {[
                    "What is 7 + 8?",
                    "Why is the sky blue?",
                    "How do plants make food?",
                    "Spell the word 'beautiful'",
                    "What are the 5 senses?",
                    "What is a fraction?",
                  ].map((q, i) => (
                    <button key={i} className="starter-q" onClick={() => { setQuestion(q); }} style={{
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "20px", padding: "6px 14px", cursor: "pointer",
                      color: "rgba(255,255,255,0.65)", fontSize: "12px", fontWeight: "600",
                      fontFamily: "'Nunito', sans-serif", transition: "all 0.2s",
                    }}>{q}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div style={{
                background: "rgba(255,179,71,0.08)", border: "1px solid rgba(255,179,71,0.2)",
                borderRadius: "24px", padding: "28px", textAlign: "center",
                animation: "slideUp 0.3s ease-out",
              }}>
                <div style={{ fontSize: "40px", marginBottom: "14px", animation: "float 2s ease-in-out infinite" }}>🌟</div>
                <div style={{ fontWeight: "800", fontSize: "16px", color: "#FFB347", marginBottom: "8px" }}>Starky is working on it...</div>
                <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                  {[0, 0.2, 0.4].map(d => (
                    <div key={d} style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FFB347", animation: `pulse 1.2s ease-in-out ${d}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {/* ANSWER */}
            {answer && !loading && (
              <div ref={answerRef} style={{
                background: mode === MODE_PARENT
                  ? "rgba(99,210,255,0.06)"
                  : "rgba(255,179,71,0.08)",
                border: `1px solid ${mode === MODE_PARENT ? "rgba(99,210,255,0.25)" : "rgba(255,179,71,0.3)"}`,
                borderRadius: "24px", padding: "28px",
                animation: "slideUp 0.4s ease-out",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{
                    width: "46px", height: "46px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #0D2040, #1A3A6B)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "24px", border: "2px solid rgba(255,179,71,0.5)",
                    boxShadow: "0 0 20px rgba(255,179,71,0.25)",
                  }}>🌟</div>
                  <div>
                    <div style={{ fontWeight: "900", fontSize: "16px" }}>Starky says:</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>
                      {mode === MODE_PARENT ? "👩‍👦 For the parent" : `👦 For your ${selectedGrade.age}-year-old`}
                    </div>
                  </div>
                  <button onClick={() => { setAnswer(null); setHistory([]); }} style={{
                    marginLeft: "auto", background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px",
                    padding: "6px 14px", color: "rgba(255,255,255,0.5)",
                    cursor: "pointer", fontSize: "12px", fontFamily: "'Nunito', sans-serif",
                    fontWeight: "700",
                  }}>New Question</button>
                </div>

                <div style={{ fontSize: "15px", lineHeight: "1.8", color: "rgba(255,255,255,0.88)" }}>
                  <FormatText text={answer} />
                </div>

                {/* Follow-up */}
                <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "rgba(255,255,255,0.45)", marginBottom: "10px" }}>
                    🔄 Ask a follow-up question
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      value={followUp}
                      onChange={e => setFollowUp(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && askFollowUp()}
                      placeholder="e.g. Can you give me another example? / My child still doesn't understand..."
                      style={{
                        flex: 1, background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,179,71,0.3)", borderRadius: "12px",
                        padding: "12px 16px", color: "#fff", fontSize: "16px",
                      }}
                    />
                    <button onClick={askFollowUp} disabled={loading} style={{
                      background: "linear-gradient(135deg, #FFB347, #FF8E53)",
                      border: "none", borderRadius: "12px", padding: "12px 20px",
                      cursor: "pointer", fontWeight: "800", fontSize: "16px",
                      color: "#0D0800", fontFamily: "'Nunito', sans-serif",
                    }}>Ask →</button>
                  </div>

                  {/* Quick follow-ups */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                    {[
                      "Can you make it simpler?",
                      "Give me another example",
                      "Explain it as a story",
                      "How do I check the answer?",
                    ].map((q, i) => (
                      <button key={i} onClick={() => askStarky(q)} className="starter-q" style={{
                        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "20px", padding: "6px 14px", cursor: "pointer",
                        color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: "600",
                        fontFamily: "'Nunito', sans-serif", transition: "all 0.2s",
                      }}>{q}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TIP CARD when no answer yet */}
            {!answer && !loading && (
              <div style={{
                background: "rgba(255,179,71,0.07)", border: "1px solid rgba(255,179,71,0.2)",
                borderRadius: "20px", padding: "24px",
              }}>
                <div style={{ fontWeight: "800", fontSize: "15px", color: "#FFB347", marginBottom: "14px" }}>💡 Tips for using Homework Helper</div>
                {[
                  { tip: "Type the exact question", sub: "Copy the question from the textbook or worksheet exactly as written" },
                  { tip: "Choose the right mode", sub: "\"Help me explain\" gives you a full breakdown. \"Talk to my child\" lets Starky speak directly to your little one" },
                  { tip: "Ask follow-ups", sub: "If your child still doesn't get it, ask Starky to explain it as a story or give a simpler example" },
                  { tip: "Works in any language", sub: "Type in Urdu, Arabic, or any language — Starky will respond in the same language" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                    <div style={{
                      width: "24px", height: "24px", borderRadius: "50%",
                      background: "rgba(255,179,71,0.2)", color: "#FFB347",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: "900", flexShrink: 0, marginTop: "2px",
                    }}>{i + 1}</div>
                    <div>
                      <div style={{ fontWeight: "800", fontSize: "13px", marginBottom: "2px" }}>{item.tip}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: "1.5" }}>{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════ CRAFT TAB ═══════════════════════ */}
      {activeTab === "craft" && (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 32px 80px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ fontWeight: "900", fontSize: "clamp(22px, 3vw, 36px)", margin: "0 0 8px" }}>
              🎨 Art & Craft Activities
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px" }}>
              Step-by-step creative activities your child can do at home — no special supplies needed
            </p>
          </div>

          {activeCraft === null ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "18px" }}>
              {CRAFT_IDEAS.map((craft, i) => (
                <div key={i} className="craft-card" onClick={() => setActiveCraft(i)} style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,179,71,0.15)",
                  borderRadius: "22px", padding: "26px", cursor: "pointer", transition: "all 0.25s",
                }}>
                  <div style={{ fontSize: "48px", marginBottom: "14px", textAlign: "center" }}>{craft.emoji}</div>
                  <h3 style={{ fontWeight: "900", fontSize: "20px", margin: "0 0 10px", textAlign: "center" }}>{craft.title}</h3>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "16px" }}>
                    <span style={{ background: "rgba(255,179,71,0.15)", color: "#FFB347", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", fontWeight: "800" }}>Age {craft.age}</span>
                    <span style={{ background: "rgba(168,224,99,0.15)", color: "#A8E063", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", fontWeight: "800" }}>⏱ {craft.time}</span>
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>YOU'LL NEED:</div>
                  {craft.materials.slice(0, 3).map((m, j) => (
                    <div key={j} style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "4px" }}>• {m}</div>
                  ))}
                  {craft.materials.length > 3 && <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>+{craft.materials.length - 3} more...</div>}
                  <div style={{ marginTop: "16px", textAlign: "center", color: "#FFB347", fontSize: "13px", fontWeight: "800" }}>
                    View Steps →
                  </div>
                </div>
              ))}

              {/* Custom craft via AI */}
              <div className="craft-card" style={{
                background: "rgba(168,224,99,0.06)", border: "2px dashed rgba(168,224,99,0.25)",
                borderRadius: "22px", padding: "26px", textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "280px",
              }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✨</div>
                <h3 style={{ fontWeight: "900", fontSize: "18px", margin: "0 0 10px", color: "#A8E063" }}>Custom Craft Idea</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6", marginBottom: "16px" }}>
                  Ask Starky for a craft idea based on what you have at home or a specific theme
                </p>
                <button onClick={() => setActiveTab("homework")} style={{
                  background: "rgba(168,224,99,0.15)", border: "1px solid rgba(168,224,99,0.3)",
                  borderRadius: "14px", padding: "10px 20px", cursor: "pointer",
                  color: "#A8E063", fontWeight: "800", fontSize: "13px", fontFamily: "'Nunito', sans-serif",
                }}>Ask Starky →</button>
              </div>
            </div>
          ) : (
            /* ── CRAFT DETAIL VIEW ── */
            <div style={{ animation: "slideUp 0.35s ease-out" }}>
              <button onClick={() => setActiveCraft(null)} style={{
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px", padding: "8px 18px", cursor: "pointer",
                color: "rgba(255,255,255,0.6)", fontSize: "13px", fontFamily: "'Nunito', sans-serif",
                marginBottom: "20px", fontWeight: "700",
              }}>← All Activities</button>

              <div style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,179,71,0.2)",
                borderRadius: "26px", padding: "36px",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "24px", marginBottom: "28px", flexWrap: "wrap" }}>
                  <div style={{ fontSize: "64px" }}>{CRAFT_IDEAS[activeCraft].emoji}</div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontWeight: "900", fontSize: "clamp(22px, 3vw, 34px)", margin: "0 0 12px" }}>{CRAFT_IDEAS[activeCraft].title}</h2>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <span style={{ background: "rgba(255,179,71,0.15)", color: "#FFB347", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", fontWeight: "800" }}>👶 Age {CRAFT_IDEAS[activeCraft].age}+</span>
                      <span style={{ background: "rgba(168,224,99,0.15)", color: "#A8E063", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", fontWeight: "800" }}>⏱ {CRAFT_IDEAS[activeCraft].time}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
                  {/* Materials */}
                  <div style={{ background: "rgba(255,179,71,0.07)", border: "1px solid rgba(255,179,71,0.2)", borderRadius: "18px", padding: "22px" }}>
                    <div style={{ fontWeight: "900", fontSize: "15px", color: "#FFB347", marginBottom: "14px" }}>🛒 What You'll Need</div>
                    {CRAFT_IDEAS[activeCraft].materials.map((m, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FFB347", flexShrink: 0 }} />
                        <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)" }}>{m}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tips */}
                  <div style={{ background: "rgba(168,224,99,0.07)", border: "1px solid rgba(168,224,99,0.2)", borderRadius: "18px", padding: "22px" }}>
                    <div style={{ fontWeight: "900", fontSize: "15px", color: "#A8E063", marginBottom: "14px" }}>💡 Parent Tips</div>
                    {[
                      "Lay newspaper down first — crafts get messy!",
                      "Let your child lead — it doesn't have to be perfect",
                      "Talk about what you're making as you go",
                      "Take a photo of the finished result to keep as a memory 📸",
                    ].map((tip, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                        <span style={{ color: "#A8E063", fontSize: "14px" }}>✓</span>
                        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: "1.5" }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div style={{ marginTop: "28px" }}>
                  <div style={{ fontWeight: "900", fontSize: "18px", marginBottom: "18px" }}>📋 Step-by-Step Instructions</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {CRAFT_IDEAS[activeCraft].steps.map((step, i) => (
                      <div key={i} onClick={() => handleCopyStep(step, i)} style={{
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px", padding: "18px 20px",
                        display: "flex", gap: "16px", alignItems: "flex-start", cursor: "pointer",
                        transition: "all 0.2s",
                      }}>
                        <div style={{
                          width: "34px", height: "34px", borderRadius: "50%",
                          background: `linear-gradient(135deg, #FFB347, #FF8E53)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: "900", fontSize: "15px", color: "#0D0800", flexShrink: 0,
                        }}>{i + 1}</div>
                        <div style={{ flex: 1, fontSize: "15px", lineHeight: "1.65", color: "rgba(255,255,255,0.85)", marginTop: "4px" }}>{step}</div>
                        <div style={{ fontSize: "11px", color: copiedStep === i ? "#A8E063" : "rgba(255,255,255,0.2)", fontWeight: "700", flexShrink: 0, marginTop: "8px" }}>
                          {copiedStep === i ? "✓ Copied" : "Copy"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: "24px", padding: "18px", background: "rgba(99,210,255,0.08)", border: "1px solid rgba(99,210,255,0.2)", borderRadius: "16px", textAlign: "center" }}>
                  <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)" }}>
                    🌟 Want more ideas or a variation of this activity? Switch to the Homework Helper tab and ask Starky!
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", margin: 0 }}>
          New World Education · Founded by <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: "700" }}>Khurram Badar</span> ·
          <a href="mailto:khurram@newworld.education" style={{ color: "rgba(255,179,71,0.5)", textDecoration: "none", marginLeft: "6px" }}>khurram@newworld.education</a>
          <span style={{ margin: "0 8px", opacity: 0.3 }}>·</span>
          For educational purposes only. Student outcomes depend on individual effort and engagement.
        </p>
      </footer>
    </div>
  );
}
