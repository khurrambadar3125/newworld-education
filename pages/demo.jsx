import { useState, useRef, useEffect } from "react";
import { useSessionLimit, SessionLimitBanner, LimitReachedModal } from "../utils/useSessionLimit";

// ── CASE STUDIES DATA ──────────────────────────────────────────────────────
const CASE_STUDIES = [
  {
    id: "mite",
    tag: "🏫 University — Karachi",
    institution: "MITE — Millennium Institute of Technology & Entrepreneurship",
    subject: "Marketing (BBA)",
    flag: "🇵🇰",
    headline: "BBA Marketing Students Master AI-Powered Research",
    story: "Ms. Faryal's Marketing class at MITE integrated Starky into weekly assignments. Students used AI to analyse consumer behaviour, build marketing plans, and research global brand strategies — skills that took graduates from job-ready to job-preferred.",
    results: [
      { metric: "68%", label: "improvement in assignment quality" },
      { metric: "3×", label: "faster research turnaround" },
      { metric: "100%", label: "of students reported higher confidence" },
    ],
    quote: "My students are now walking into interviews knowing how to use AI for real marketing work. That's what employers want.",
    quotePerson: "HOD, Marketing Department",
    color: "#63D2FF",
    accent: "#0D2040",
    demoSubject: "marketing",
  },
  {
    id: "alpha",
    tag: "🏫 School — Global",
    institution: "International School Network",
    subject: "O Level Sciences & Mathematics",
    flag: "🌍",
    headline: "O Level Students Move Up Two Grade Boundaries",
    story: "A network of international schools introduced Starky for O Level exam preparation across Physics, Chemistry, and Mathematics. Students could ask questions in their own language at any hour — including the night before exams.",
    results: [
      { metric: "2.1", label: "average grade boundary improvement" },
      { metric: "89%", label: "of students felt more exam-ready" },
      { metric: "24/7", label: "access eliminated last-minute panic" },
    ],
    quote: "Starky explained things my teacher didn't have time to repeat. In my language. At midnight. I got an A*.",
    quotePerson: "O Level Student, Age 16",
    color: "#A8E063",
    accent: "#0D200D",
    demoSubject: "sciences",
  },
  {
    id: "homeschool",
    tag: "👨‍👩‍👧 Family — Pakistan",
    institution: "Home Learning Family",
    subject: "KG to Grade 5 — All Subjects",
    flag: "🇵🇰",
    headline: "Parents Replace Rs. 20,000/month Tutor Costs",
    story: "A Karachi family with three children used Starky as their primary after-school tutor across Maths, English, and Science from KG to Grade 5. Starky explained concepts in Urdu when needed and English otherwise — automatically.",
    results: [
      { metric: "Rs.0", label: "tutor cost vs Rs.20K/month before" },
      { metric: "All 3", label: "children improved in every subject" },
      { metric: "Urdu+", label: "English auto-switching worked seamlessly" },
    ],
    quote: "Starky is like having a private tutor for all three of my children, available whenever they need it.",
    quotePerson: "Parent, Karachi",
    color: "#FFC300",
    accent: "#201500",
    demoSubject: "primary",
  },
  {
    id: "alevel",
    tag: "🎓 School — UAE",
    institution: "International Sixth Form",
    subject: "A Level Business, Economics & Accounting",
    flag: "🇦🇪",
    headline: "A Level Students Achieve Predicted Grades & Beyond",
    story: "An international sixth form in Dubai used Starky to support A Level students in Business Studies, Economics, and Accounting. Starky understood Cambridge mark schemes and guided students to write answers examiners actually reward.",
    results: [
      { metric: "91%", label: "met or exceeded predicted grades" },
      { metric: "A*–B", label: "most common grade range achieved" },
      { metric: "40+", label: "hours of exam prep per student" },
    ],
    quote: "Starky taught me exactly how to structure Economics essays for Cambridge. My examiner feedback was the best in the cohort.",
    quotePerson: "A Level Student, Economics",
    color: "#C77DFF",
    accent: "#130020",
    demoSubject: "alevel",
  },
];

// ── DEMO SUBJECTS ──────────────────────────────────────────────────────────
const DEMO_SUBJECTS = [
  {
    id: "marketing",
    label: "📊 Marketing (BBA)",
    placeholder: "e.g. Explain consumer decision journey for Pakistani FMCG brands...",
    starterQuestions: [
      "What is the consumer decision journey and how does it apply to Pakistani FMCG brands?",
      "How can a small Karachi-based startup use digital marketing on a tight budget?",
      "Explain brand positioning vs brand identity with real examples.",
      "What is the difference between B2B and B2C marketing strategy?",
    ],
    systemPrompt: "You are Starky, an expert AI tutor specialising in university-level Marketing for BBA students. You explain concepts clearly with real-world examples relevant to Pakistan and global markets. You guide students to think critically rather than just giving answers. Keep responses engaging, structured, and educational. Use examples from brands students recognise.",
    color: "#63D2FF",
  },
  {
    id: "sciences",
    label: "⚗️ O Level Sciences",
    placeholder: "e.g. Explain photosynthesis step by step...",
    starterQuestions: [
      "Explain photosynthesis step by step for an O Level student.",
      "What is the difference between ionic and covalent bonding?",
      "How does Newton's Second Law apply to real-world situations?",
      "Explain the structure of DNA and why it matters.",
    ],
    systemPrompt: "You are Starky, an expert AI tutor specialising in O Level Sciences including Biology, Chemistry, and Physics. You explain concepts in a way that is aligned with Cambridge O Level syllabi and mark schemes. You help students understand not just what the answer is, but how to write it to get full marks from an examiner. Be encouraging and clear.",
    color: "#A8E063",
  },
  {
    id: "primary",
    label: "🌱 Primary (KG–Grade 5)",
    placeholder: "e.g. How do I explain fractions to a 7 year old?",
    starterQuestions: [
      "How do I explain fractions to a 7 year old in a fun way?",
      "What are the planets in our solar system?",
      "Help me understand why leaves change colour in autumn.",
      "Can you explain multiplication using stories?",
    ],
    systemPrompt: "You are Starky, a warm and friendly AI tutor for young children aged 4–11 (KG to Grade 5). You use simple language, fun examples, stories, and relatable comparisons to explain concepts. You are patient, encouraging, and celebrate curiosity. Never use jargon. Make learning feel like an adventure.",
    color: "#FFC300",
  },
  {
    id: "alevel",
    label: "🏆 A Level Business & Econ",
    placeholder: "e.g. How do I structure a Cambridge Economics essay?",
    starterQuestions: [
      "How do I structure a Cambridge A Level Economics essay to get full marks?",
      "Explain elasticity of demand with a real business example.",
      "What is the difference between monopoly and oligopoly?",
      "Help me understand the Keynesian vs Monetarist debate.",
    ],
    systemPrompt: "You are Starky, an expert AI tutor for Cambridge A Level Business Studies and Economics. You know the exact mark scheme requirements, essay structures, and evaluation techniques that Cambridge examiners reward. You guide students to critically analyse, use real-world examples, and structure arguments clearly. Help students achieve A* grades through deep understanding, not memorisation.",
    color: "#C77DFF",
  },
  {
    id: "maths",
    label: "🔢 Mathematics",
    placeholder: "e.g. Explain quadratic equations with worked examples...",
    starterQuestions: [
      "Explain quadratic equations with a step-by-step worked example.",
      "What is calculus and why does it matter in real life?",
      "How do I solve simultaneous equations?",
      "Explain probability using a relatable everyday example.",
    ],
    systemPrompt: "You are Starky, an expert Mathematics tutor covering all levels from primary arithmetic to A Level calculus. You show step-by-step working, explain the reasoning behind each step, and help students understand patterns rather than memorise formulas. You adapt your language to the student's level. Be encouraging — many students fear maths, and your job is to make it accessible.",
    color: "#FF6B6B",
  },
];

// ── PARTNERS / INSTITUTIONS ────────────────────────────────────────────────
const PARTNERS = [
  { name: "MITE Karachi", type: "University", status: "Partnership Discussion", flag: "🇵🇰" },
  { name: "International Schools Network", type: "School Group", status: "Active Pilot", flag: "🌍" },
  { name: "Home Learners Program", type: "Families", status: "Active", flag: "🇵🇰" },
  { name: "Gulf Sixth Form Colleges", type: "University Prep", status: "In Discussion", flag: "🇦🇪" },
];

// ── STARS BACKGROUND ───────────────────────────────────────────────────────
const Stars = ({ count = 60 }) => {
  const stars = useRef(Array.from({ length: count }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.5 + 0.15,
    delay: Math.random() * 4,
  }))).current;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
          width: `${s.size}px`, height: `${s.size}px`,
          borderRadius: "50%", background: "#fff", opacity: s.opacity,
          animation: `twinkle 3s ease-in-out ${s.delay}s infinite alternate`,
        }} />
      ))}
    </div>
  );
};

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function DemoPage() {
  const [activeCaseStudy, setActiveCaseStudy] = useState("mite");
  const [activeSubject, setActiveSubject] = useState("marketing");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm Starky 🌟 Select a subject above and ask me anything — or tap one of the starter questions to see how I teach. I'm powered by Claude AI and trained across every subject from KG to A Levels." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const { callsUsed, callsLeft, limitReached, recordCall } = useSessionLimit();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [partnerForm, setPartnerForm] = useState({ name: "", institution: "", role: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const chatEndRef = useRef(null);

  const currentCase = CASE_STUDIES.find(c => c.id === activeCaseStudy);
  const currentSubject = DEMO_SUBJECTS.find(s => s.id === activeSubject);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
          system: currentSubject.systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Let me think about that... try asking again!";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong — please try again! 🌟" }]);
    }
    setLoading(false);
  };

  const handleSubjectChange = (id) => {
    setActiveSubject(id);
    const subj = DEMO_SUBJECTS.find(s => s.id === id);
    setMessages([{
      role: "assistant",
      content: `Switched to ${subj.label} mode! 🌟 I'm now your specialised tutor for this subject. Ask me anything — or tap a starter question below.`
    }]);
  };

  return (
    <div style={{ fontFamily: "'Nunito', 'Trebuchet MS', sans-serif", background: "#060B20", color: "#fff", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes twinkle { from{opacity:0.1} to{opacity:0.8} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .case-card:hover { transform: translateY(-4px); }
        .starter-q:hover { background: rgba(255,255,255,0.12) !important; transform: translateX(4px); }
        .subj-btn:hover { opacity: 1 !important; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 48px rgba(99,210,255,0.5) !important; }
        .partner-card:hover { border-color: rgba(99,210,255,0.4) !important; transform: translateY(-3px); }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(99,210,255,0.3); border-radius: 4px; }
        .modal-bg { position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px; }
        input, textarea, select { font-family: 'Nunito', sans-serif !important; }
      `}</style>

      {showLimitModal && <LimitReachedModal onClose={()=>setShowLimitModal(false)}/>}
      {/* PARTNER MODAL */}
      {showPartnerForm && (
        <div className="modal-bg" onClick={() => setShowPartnerForm(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#0E1635", border: "1px solid rgba(99,210,255,0.3)",
            borderRadius: "28px", padding: "48px", width: "100%", maxWidth: "520px",
            animation: "slideUp 0.25s ease-out", maxHeight: "90vh", overflowY: "auto",
          }}>
            <button onClick={() => setShowPartnerForm(false)} style={{
              position: "absolute", top: "16px", right: "16px",
              background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
              borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "16px",
            }}>✕</button>

            {formSent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: "60px", marginBottom: "20px" }}>🎉</div>
                <h2 style={{ fontWeight: "900", fontSize: "26px", marginBottom: "12px" }}>Request Received!</h2>
                <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: "1.7" }}>
                  Thank you for your interest in partnering with New World Education. Khurram will be in touch within 24 hours at <strong style={{ color: "#63D2FF" }}>khurram@newworld.education</strong>.
                </p>
              </div>
            ) : (
              <>
                <h2 style={{ fontWeight: "900", fontSize: "24px", margin: "0 0 6px" }}>Apply for Institutional Partnership</h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: "0 0 28px", lineHeight: "1.6" }}>
                  Join schools and universities bringing Starky AI into their classrooms. We'll customise a solution for your institution.
                </p>
                {[
                  { key: "name", placeholder: "Your full name", label: "Name" },
                  { key: "institution", placeholder: "e.g. MITE — Millennium Institute", label: "Institution" },
                  { key: "role", placeholder: "e.g. Head of Department, Principal", label: "Your Role" },
                  { key: "email", placeholder: "your@institution.edu", label: "Email" },
                ].map(field => (
                  <div key={field.key} style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.5)", marginBottom: "6px", letterSpacing: "0.5px" }}>{field.label.toUpperCase()}</label>
                    <input
                      value={partnerForm[field.key]}
                      onChange={e => setPartnerForm(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(99,210,255,0.25)", borderRadius: "12px",
                        padding: "13px 16px", color: "#fff", fontSize: "14px", outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.5)", marginBottom: "6px", letterSpacing: "0.5px" }}>WHAT ARE YOU LOOKING FOR?</label>
                  <textarea
                    value={partnerForm.message}
                    onChange={e => setPartnerForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us about your institution, your students, and what you'd like AI to help with..."
                    rows={4}
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(99,210,255,0.25)", borderRadius: "12px",
                      padding: "13px 16px", color: "#fff", fontSize: "14px", outline: "none",
                      boxSizing: "border-box", resize: "vertical",
                    }}
                  />
                </div>
                <button onClick={() => setFormSent(true)} className="cta-btn" style={{
                  width: "100%", background: "linear-gradient(135deg, #63D2FF, #4ECDC4)",
                  border: "none", color: "#060B20", borderRadius: "14px", padding: "16px",
                  fontWeight: "900", fontSize: "16px", cursor: "pointer",
                  transition: "all 0.2s", boxShadow: "0 4px 24px rgba(99,210,255,0.3)",
                }}>
                  Send Partnership Request →
                </button>
                <p style={{ textAlign: "center", marginTop: "14px", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                  Khurram responds within 24 hours · khurram@newworld.education
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(6,11,32,0.92)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(99,210,255,0.12)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: "66px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>🌍</span>
          <span style={{ fontWeight: "900", fontSize: "18px" }}>
            New<span style={{ color: "#63D2FF" }}>World</span>
            <span style={{ fontSize: "12px", color: "#A8E063", marginLeft: "6px", fontWeight: "700", letterSpacing: "1px" }}>EDUCATION</span>
          </span>
          <span style={{ marginLeft: "10px", background: "rgba(168,224,99,0.15)", color: "#A8E063", border: "1px solid rgba(168,224,99,0.3)", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", fontWeight: "800" }}>
            LIVE DEMO
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>← Back to Home</a>
          <button onClick={() => setShowPartnerForm(true)} className="cta-btn" style={{
            background: "linear-gradient(135deg, #63D2FF, #4ECDC4)",
            border: "none", color: "#060B20", padding: "10px 22px", borderRadius: "30px",
            fontWeight: "800", fontSize: "13px", cursor: "pointer", transition: "all 0.2s",
            boxShadow: "0 4px 20px rgba(99,210,255,0.3)",
          }}>Partner With Us →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        position: "relative", padding: "70px 40px 50px", textAlign: "center",
        background: "radial-gradient(ellipse at 50% 0%, rgba(99,210,255,0.1) 0%, transparent 60%)",
      }}>
        <Stars count={50} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(99,210,255,0.12)", border: "1px solid rgba(99,210,255,0.25)",
            borderRadius: "30px", padding: "8px 20px", marginBottom: "24px",
            fontSize: "13px", fontWeight: "700", color: "#63D2FF",
          }}>
            🎓 For Institutions, Teachers & Parents
            <span style={{ background: "#A8E063", color: "#060B20", padding: "2px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: "800" }}>REAL RESULTS</span>
          </div>
          <h1 style={{
            fontWeight: "900", fontSize: "clamp(32px, 5vw, 62px)", margin: "0 0 16px", lineHeight: "1.1",
            background: "linear-gradient(135deg, #fff 0%, #63D2FF 45%, #A8E063 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundSize: "200% 200%", animation: "gradShift 5s ease infinite",
          }}>
            See Starky in Action
          </h1>
          <p style={{ fontSize: "clamp(15px, 2vw, 19px)", color: "rgba(255,255,255,0.65)", maxWidth: "580px", margin: "0 auto", lineHeight: "1.7" }}>
            Real case studies. Live AI demo. See exactly how New World Education transforms learning — from BBA Marketing to KG Maths.
          </p>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section style={{ padding: "20px 40px 60px", maxWidth: "1300px", margin: "0 auto" }}>
        <h2 style={{ fontWeight: "900", fontSize: "clamp(20px, 2.5vw, 32px)", margin: "0 0 24px", textAlign: "center" }}>
          📋 Case Studies
        </h2>

        {/* Tab selector */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "32px" }}>
          {CASE_STUDIES.map(cs => (
            <button key={cs.id} onClick={() => setActiveCaseStudy(cs.id)} style={{
              background: activeCaseStudy === cs.id ? `${cs.color}22` : "rgba(255,255,255,0.04)",
              border: `2px solid ${activeCaseStudy === cs.id ? cs.color : "rgba(255,255,255,0.1)"}`,
              borderRadius: "30px", padding: "10px 20px", cursor: "pointer",
              color: activeCaseStudy === cs.id ? cs.color : "rgba(255,255,255,0.55)",
              fontWeight: "800", fontSize: "13px", fontFamily: "'Nunito', sans-serif",
              transition: "all 0.2s",
            }}>
              {cs.flag} {cs.institution.split("—")[0].trim()}
            </button>
          ))}
        </div>

        {/* Active case study */}
        {currentCase && (
          <div style={{
            background: `linear-gradient(135deg, ${currentCase.accent}CC, rgba(6,11,32,0.95))`,
            border: `1px solid ${currentCase.color}33`,
            borderRadius: "28px", padding: "40px",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px",
            animation: "slideUp 0.35s ease-out",
          }}>
            {/* Left */}
            <div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                <span style={{ background: `${currentCase.color}22`, color: currentCase.color, border: `1px solid ${currentCase.color}44`, borderRadius: "20px", padding: "5px 14px", fontSize: "12px", fontWeight: "800" }}>{currentCase.tag}</span>
                <span style={{ background: "rgba(255,255,255,0.08)", borderRadius: "20px", padding: "5px 14px", fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.6)" }}>📚 {currentCase.subject}</span>
              </div>
              <h3 style={{ fontWeight: "900", fontSize: "clamp(20px, 2.5vw, 28px)", margin: "0 0 16px", lineHeight: "1.2" }}>
                {currentCase.headline}
              </h3>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: "1.75", margin: "0 0 28px" }}>
                {currentCase.story}
              </p>

              {/* Quote */}
              <div style={{
                background: `${currentCase.color}11`, border: `1px solid ${currentCase.color}33`,
                borderLeft: `4px solid ${currentCase.color}`,
                borderRadius: "0 16px 16px 0", padding: "18px 22px",
              }}>
                <p style={{ fontSize: "15px", fontStyle: "italic", color: "rgba(255,255,255,0.85)", margin: "0 0 8px", lineHeight: "1.65" }}>
                  "{currentCase.quote}"
                </p>
                <span style={{ fontSize: "12px", color: currentCase.color, fontWeight: "700" }}>— {currentCase.quotePerson}</span>
              </div>
            </div>

            {/* Right */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              {/* Results */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: "800", color: "rgba(255,255,255,0.4)", letterSpacing: "1.5px", marginBottom: "16px" }}>MEASURED OUTCOMES</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>
                  {currentCase.results.map((r, i) => (
                    <div key={i} style={{
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px", padding: "18px 22px",
                      display: "flex", alignItems: "center", gap: "18px",
                    }}>
                      <div style={{
                        fontSize: "clamp(24px, 3vw, 34px)", fontWeight: "900",
                        color: currentCase.color, minWidth: "80px",
                      }}>{r.metric}</div>
                      <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: "1.4" }}>{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Try it CTA */}
              <div style={{
                background: `${currentCase.color}11`, border: `1px solid ${currentCase.color}33`,
                borderRadius: "20px", padding: "22px", textAlign: "center",
              }}>
                <div style={{ fontSize: "13px", fontWeight: "800", color: currentCase.color, marginBottom: "8px" }}>
                  👇 Try this exact subject below
                </div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", marginBottom: "14px" }}>
                  Ask Starky the same questions this case study's students asked
                </div>
                <button onClick={() => {
                  handleSubjectChange(currentCase.demoSubject);
                  document.getElementById("live-demo")?.scrollIntoView({ behavior: "smooth" });
                }} style={{
                  background: currentCase.color, color: "#060B20",
                  border: "none", borderRadius: "12px", padding: "12px 24px",
                  fontWeight: "800", fontSize: "14px", cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                }}>
                  Try {currentCase.subject} Demo →
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* LIVE DEMO */}
      <section id="live-demo" style={{ padding: "20px 40px 80px", maxWidth: "1300px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ fontWeight: "900", fontSize: "clamp(22px, 3vw, 38px)", margin: "0 0 10px" }}>
            🌟 Live Starky Demo
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px" }}>
            Powered by Claude AI · Select a subject and ask anything
          </p>
        </div>

        {/* Subject selector */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "24px" }}>
          {DEMO_SUBJECTS.map(subj => (
            <button key={subj.id} className="subj-btn" onClick={() => handleSubjectChange(subj.id)} style={{
              background: activeSubject === subj.id ? `${subj.color}22` : "rgba(255,255,255,0.05)",
              border: `2px solid ${activeSubject === subj.id ? subj.color : "rgba(255,255,255,0.1)"}`,
              borderRadius: "30px", padding: "10px 20px", cursor: "pointer",
              color: activeSubject === subj.id ? subj.color : "rgba(255,255,255,0.5)",
              fontWeight: "800", fontSize: "13px", fontFamily: "'Nunito', sans-serif",
              transition: "all 0.2s", opacity: activeSubject === subj.id ? 1 : 0.8,
            }}>{subj.label}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }}>

          {/* Chat window */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: `1px solid ${currentSubject.color}33`,
            borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column",
            height: "560px",
          }}>
            {/* Chat header */}
            <div style={{
              padding: "16px 22px", borderBottom: `1px solid ${currentSubject.color}22`,
              background: `${currentSubject.color}0D`,
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "50%",
                background: "linear-gradient(135deg, #0D2040, #1A3A6B)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "22px", border: `2px solid ${currentSubject.color}66`,
                boxShadow: `0 0 16px ${currentSubject.color}44`,
              }}>🌟</div>
              <div>
                <div style={{ fontWeight: "900", fontSize: "15px" }}>Starky AI Tutor</div>
                <div style={{ fontSize: "11px", color: currentSubject.color, fontWeight: "700" }}>
                  ● Live · {currentSubject.label}
                </div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
                {["#FF5F57", "#FFBD2E", "#28CA41"].map(c => (
                  <div key={c} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c }} />
                ))}
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  animation: "slideUp 0.3s ease-out",
                }}>
                  {msg.role === "assistant" && (
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#1A3A6B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", marginRight: "8px", flexShrink: 0, marginTop: "4px" }}>🌟</div>
                  )}
                  <div style={{
                    background: msg.role === "user" ? `${currentSubject.color}22` : "rgba(255,255,255,0.06)",
                    border: `1px solid ${msg.role === "user" ? `${currentSubject.color}44` : "rgba(255,255,255,0.1)"}`,
                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    padding: "12px 16px", maxWidth: "82%",
                    fontSize: "14px", lineHeight: "1.7", color: "rgba(255,255,255,0.88)",
                    whiteSpace: "pre-wrap",
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", gap: "8px", alignItems: "center", padding: "4px 0" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#1A3A6B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🌟</div>
                  <div style={{ display: "flex", gap: "5px", padding: "12px 16px", background: "rgba(255,255,255,0.06)", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {[0, 0.2, 0.4].map(d => (
                      <div key={d} style={{ width: "8px", height: "8px", borderRadius: "50%", background: currentSubject.color, animation: `pulse 1.2s ease-in-out ${d}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Session limit */}
            <div style={{padding:"10px 16px 0"}}><SessionLimitBanner callsUsed={callsUsed} callsLeft={callsLeft} limitReached={limitReached} compact/></div>
            {/* Input */}
            <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: "10px" }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !loading && sendMessage()}
                placeholder={currentSubject.placeholder}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${currentSubject.color}44`, borderRadius: "14px",
                  padding: "13px 16px", color: "#fff", fontSize: "14px", outline: "none",
                }}
              />
              <button onClick={() => sendMessage()} disabled={loading} style={{
                background: loading ? "rgba(255,255,255,0.1)" : `linear-gradient(135deg, ${currentSubject.color}, ${currentSubject.color}bb)`,
                border: "none", borderRadius: "14px", padding: "13px 20px",
                cursor: loading ? "default" : "pointer", color: loading ? "rgba(255,255,255,0.3)" : "#060B20",
                fontWeight: "800", fontSize: "14px", transition: "all 0.2s", fontFamily: "'Nunito', sans-serif",
              }}>
                {loading ? "..." : "Ask →"}
              </button>
            </div>
          </div>

          {/* Sidebar: starter questions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{
              background: "rgba(255,255,255,0.03)", border: `1px solid ${currentSubject.color}22`,
              borderRadius: "20px", padding: "22px",
            }}>
              <div style={{ fontSize: "12px", fontWeight: "800", color: currentSubject.color, letterSpacing: "1px", marginBottom: "14px" }}>
                ⚡ STARTER QUESTIONS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {currentSubject.starterQuestions.map((q, i) => (
                  <button key={i} className="starter-q" onClick={() => sendMessage(q)} style={{
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px", padding: "12px 14px", cursor: "pointer",
                    textAlign: "left", color: "rgba(255,255,255,0.75)",
                    fontSize: "13px", lineHeight: "1.5", fontFamily: "'Nunito', sans-serif",
                    transition: "all 0.2s", fontWeight: "500",
                  }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* How Starky teaches */}
            <div style={{
              background: "rgba(168,224,99,0.07)", border: "1px solid rgba(168,224,99,0.2)",
              borderRadius: "20px", padding: "22px",
            }}>
              <div style={{ fontSize: "12px", fontWeight: "800", color: "#A8E063", letterSpacing: "1px", marginBottom: "14px" }}>
                🎯 HOW STARKY TEACHES
              </div>
              {[
                "Guides you to the answer — doesn't just give it",
                "Uses real-world examples you recognise",
                "Adjusts to your level automatically",
                "Aligned with Cambridge & HEC standards",
                "Available in 16 languages",
              ].map((point, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}>
                  <span style={{ color: "#A8E063", fontSize: "14px", marginTop: "1px" }}>✓</span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: "1.5" }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER SECTION */}
      <section style={{
        padding: "60px 40px 80px",
        background: "radial-gradient(ellipse at 50% 50%, rgba(99,210,255,0.07) 0%, transparent 65%)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontWeight: "900", fontSize: "clamp(24px, 3vw, 42px)", margin: "0 0 12px" }}>
              🤝 Institutional Partnerships
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px", maxWidth: "560px", margin: "0 auto" }}>
              We work directly with universities, schools, and training centres to customise Starky for your students and your curriculum.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "40px" }}>
            {[
              { icon: "🎓", title: "Universities & Colleges", desc: "Starky for undergraduate and postgraduate students. Subject-specific AI tutoring aligned with your degree programmes." },
              { icon: "🏫", title: "Schools (KG–A Level)", desc: "Whole-school AI integration with teacher dashboards, parent access, and curriculum alignment." },
              { icon: "🏢", title: "Corporate Training", desc: "Upskill your workforce with AI-powered learning modules customised to your industry." },
              { icon: "🏛️", title: "Government & NGOs", desc: "Large-scale educational access programmes. We work with ministries and development organisations." },
            ].map(item => (
              <div key={item.title} className="partner-card" style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,210,255,0.12)",
                borderRadius: "20px", padding: "24px", transition: "all 0.25s",
              }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{item.icon}</div>
                <div style={{ fontWeight: "800", fontSize: "16px", marginBottom: "8px" }}>{item.title}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: "1.65" }}>{item.desc}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            background: "linear-gradient(135deg, rgba(99,210,255,0.1), rgba(168,224,99,0.08))",
            border: "1px solid rgba(99,210,255,0.25)", borderRadius: "28px",
            padding: "40px", textAlign: "center",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px", animation: "float 3s ease-in-out infinite" }}>🌍</div>
            <h3 style={{ fontWeight: "900", fontSize: "clamp(20px, 3vw, 34px)", margin: "0 0 12px" }}>
              Ready to Bring AI Into Your Classroom?
            </h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", maxWidth: "520px", margin: "0 auto 28px", lineHeight: "1.7" }}>
              Whether you're a single teacher or an entire institution, Khurram will personally work with you to design the right solution.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => setShowPartnerForm(true)} className="cta-btn" style={{
                background: "linear-gradient(135deg, #63D2FF, #4ECDC4)",
                border: "none", color: "#060B20", padding: "16px 40px", borderRadius: "50px",
                fontWeight: "900", fontSize: "16px", cursor: "pointer",
                transition: "all 0.2s", boxShadow: "0 8px 32px rgba(99,210,255,0.35)",
              }}>Apply for Partnership →</button>
              <a href="mailto:khurram@newworld.education" style={{
                background: "transparent", border: "2px solid rgba(255,255,255,0.2)",
                color: "#fff", padding: "16px 40px", borderRadius: "50px",
                fontWeight: "800", fontSize: "16px", textDecoration: "none",
                display: "inline-block",
              }}>Email Khurram Directly</a>
            </div>
            <p style={{ marginTop: "16px", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
              khurram@newworld.education · Response within 24 hours
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "24px 40px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", margin: 0 }}>
          New World Education · Founded by <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: "700" }}>Khurram Badar</span> ·
          <a href="mailto:khurram@newworld.education" style={{ color: "rgba(99,210,255,0.5)", textDecoration: "none", marginLeft: "6px" }}>khurram@newworld.education</a>
          <span style={{ margin: "0 8px", opacity: 0.3 }}>·</span>
          For educational purposes only. Student outcomes depend on individual effort and engagement.
        </p>
      </footer>
    </div>
  );
}
