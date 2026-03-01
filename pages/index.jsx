import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useSessionLimit, SessionLimitBanner, LimitReachedModal } from "../utils/useSessionLimit";

const GRADES = [
  { id:"kg",  label:"KG",       age:"4-5",   color:"#FF6B6B", emoji:"🌱" },
  { id:"g1",  label:"Grade 1",  age:"5-6",   color:"#FF8E53", emoji:"⭐" },
  { id:"g2",  label:"Grade 2",  age:"6-7",   color:"#FFC300", emoji:"🌈" },
  { id:"g3",  label:"Grade 3",  age:"7-8",   color:"#A8E063", emoji:"🚀" },
  { id:"g4",  label:"Grade 4",  age:"8-9",   color:"#56CCF2", emoji:"🌊" },
  { id:"g5",  label:"Grade 5",  age:"9-10",  color:"#6FCF97", emoji:"🔬" },
  { id:"g6",  label:"Grade 6",  age:"10-11", color:"#4ECDC4", emoji:"🧬" },
  { id:"g7",  label:"Grade 7",  age:"11-12", color:"#45B7D1", emoji:"⚡" },
  { id:"g8",  label:"Grade 8",  age:"12-13", color:"#3498DB", emoji:"🌍" },
  { id:"g9",  label:"Grade 9",  age:"13-14", color:"#5C6BC0", emoji:"🎯" },
  { id:"o",   label:"O Level",  age:"14-16", color:"#8E44AD", emoji:"📚" },
  { id:"as",  label:"AS Level", age:"16-17", color:"#6C3483", emoji:"🏆" },
  { id:"a",   label:"A Level",  age:"17-18", color:"#C0392B", emoji:"⭐" },
];

const LANG_TICKER = [
  "English","العربية","اردو","Français","Español","हिन्दी",
  "中文","Filipino","Português","Bahasa","Türkçe","Русский",
  "বাংলা","Kiswahili","한국어","日本語"
];

const LANGUAGES = [
  { name:"English",   flag:"🇬🇧", dir:"ltr", sample:"Ask me anything!",                    speakers:"1.5B" },
  { name:"العربية",  flag:"🇦🇪", dir:"rtl", sample:"اسألني أي شيء!",                      speakers:"420M" },
  { name:"اردو",     flag:"🇵🇰", dir:"rtl", sample:"مجھ سے کچھ بھی پوچھیں!",             speakers:"230M" },
  { name:"Français", flag:"🇫🇷", dir:"ltr", sample:"Posez-moi n'importe quelle question!", speakers:"300M" },
  { name:"Español",  flag:"🇪🇸", dir:"ltr", sample:"¡Pregúntame lo que quieras!",          speakers:"500M" },
  { name:"हिन्दी",   flag:"🇮🇳", dir:"ltr", sample:"मुझसे कुछ भी पूछें!",                speakers:"600M" },
  { name:"中文",     flag:"🇨🇳", dir:"ltr", sample:"问我任何问题！",                         speakers:"1.1B" },
  { name:"Filipino", flag:"🇵🇭", dir:"ltr", sample:"Tanungin mo ako ng kahit ano!",        speakers:"90M"  },
  { name:"Português",flag:"🇧🇷", dir:"ltr", sample:"Pergunte-me qualquer coisa!",           speakers:"260M" },
  { name:"Bahasa",   flag:"🇮🇩", dir:"ltr", sample:"Tanyakan apa saja!",                   speakers:"270M" },
  { name:"Türkçe",   flag:"🇹🇷", dir:"ltr", sample:"Bana her şeyi sor!",                   speakers:"80M"  },
  { name:"Русский",  flag:"🇷🇺", dir:"ltr", sample:"Спроси меня о чём угодно!",            speakers:"258M" },
  { name:"বাংলা",   flag:"🇧🇩", dir:"ltr", sample:"আমাকে যেকোনো কিছু জিজ্ঞাসা করুন!",  speakers:"230M" },
  { name:"Kiswahili",flag:"🇰🇪", dir:"ltr", sample:"Niulize chochote!",                    speakers:"200M" },
  { name:"한국어",   flag:"🇰🇷", dir:"ltr", sample:"무엇이든 물어보세요!",                  speakers:"77M"  },
  { name:"日本語",   flag:"🇯🇵", dir:"ltr", sample:"何でも聞いてください！",                 speakers:"125M" },
];

const SUBJECTS = [
  { icon:"🔢", name:"Mathematics",       desc:"From counting to calculus"          },
  { icon:"⚗️", name:"Sciences",          desc:"Physics, Chemistry, Biology"        },
  { icon:"📖", name:"Languages",         desc:"English, Literature, Writing"       },
  { icon:"🏛️", name:"History",           desc:"Ancient to modern world"            },
  { icon:"💻", name:"Computing & AI",    desc:"Coding, digital skills, AI literacy"},
  { icon:"🌍", name:"Earth & Environment",desc:"Climate, sustainability, our planet"},
  { icon:"🎨", name:"Arts & Creativity", desc:"Expression, design, music"          },
  { icon:"📐", name:"Geography",         desc:"Physical & human geography"         },
];

const PARTNERS = [
  { flag:"🏛️", name:"Ministries of Education",   desc:"National curriculum integration and large-scale deployment across public school systems" },
  { flag:"🏫", name:"Universities & Colleges",    desc:"AI-powered tutoring for undergraduate and postgraduate students across all disciplines"  },
  { flag:"🌐", name:"International Schools",      desc:"Cambridge, IB, and local curriculum alignment for premium global school networks"        },
  { flag:"🤝", name:"NGOs & Development Bodies",  desc:"UNESCO, UNICEF, and development agencies bringing quality education to underserved communities" },
];

const TESTIMONIALS = [
  { name:"Aisha",       role:"O Level Student",   country:"🇵🇰 Pakistan", text:"Starky explained organic chemistry in Urdu at 11pm before my exam. I got an A*!",                             grade:"O Level" },
  { name:"Lucas",       role:"Grade 5 Student",   country:"🇧🇷 Brazil",   text:"I love the learning games! I learned about the solar system and now I want to be an astronaut.",             grade:"Grade 5" },
  { name:"Mrs. Al-Farsi",role:"Science Teacher",  country:"🇦🇪 UAE",      text:"As a teacher, I finally have an AI assistant that works in Arabic for my students automatically.",           grade:"Teacher" },
  { name:"Wei Chen",    role:"A Level Student",   country:"🇨🇳 China",    text:"Starky explains difficult Physics concepts in Chinese. My predicted grades went from B to A.",               grade:"A Level" },
];

// ── ASSESSMENT MODAL ────────────────────────────────────────────────────────
const AssessmentModal = ({ session, grade, onClose }) => {
  const [email, setEmail]       = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [sent, setSent]         = useState(false);
  const [report, setReport]     = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const generate = async () => {
      try {
        const history = session.map(m =>
          `${m.from === "user" ? "Student" : "Starky"}: ${m.text}`
        ).join("\n");

        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({
            model:"claude-haiku-4-5-20251001",
            max_tokens:1000,
            system:`You are Starky, the world's most encouraging AI tutor. 
Based on a student's learning session, generate a warm, personalised Learning Report.

FORMAT YOUR RESPONSE AS JSON with these exact keys:
{
  "headline": "A short celebratory headline (max 10 words, exciting!)",
  "topicsCovered": ["topic 1", "topic 2", "topic 3"],
  "strengthSpotted": "One specific strength you noticed in their questions/curiosity (2 sentences, very specific and genuine)",
  "starMoment": "The single best thing they did or asked in this session (1-2 sentences)",
  "encouragement": "A powerful, personal encouragement message (3-4 sentences). Make the student feel genuinely capable and excited to come back. Reference the actual topic they studied.",
  "nextChallenge": "One exciting thing to explore next time that builds on today (1 sentence, make it sound like an adventure)",
  "score": a number from 78 to 99 (their 'Curiosity Score' for today)
}

Be genuinely warm, specific, and uplifting. This report should make a student smile and feel proud.
Never be generic. Reference what they actually studied.`,
            messages:[{
              role:"user",
              content:`Grade: ${grade?.label || "Unknown"}\n\nSession transcript:\n${history || "Student asked about their subject and Starky helped explain it clearly."}`
            }]
          })
        });
        const data = await res.json();
        const text = data.content?.[0]?.text || "{}";
        const clean = text.replace(/```json|```/g,"").trim();
        setReport(JSON.parse(clean));
      } catch {
        setReport({
          headline:"Brilliant session today! 🌟",
          topicsCovered:["Subject exploration","Critical thinking","Problem solving"],
          strengthSpotted:"You asked really thoughtful questions today — that curiosity is the hallmark of a great learner.",
          starMoment:"The way you engaged with the topic showed genuine interest and a desire to truly understand, not just get the answer.",
          encouragement:"Every question you asked today made you smarter. Learning isn't about knowing everything — it's about being brave enough to ask. And you did exactly that. Keep this momentum going and you'll be amazed at how far you travel.",
          nextChallenge:"Next time, let's explore a harder challenge in this topic and see how much you've grown!",
          score:88
        });
      }
      setLoading(false);
    };
    generate();
  }, []);

  const handleSend = () => {
    if (!email.trim()) return;
    setSent(true);
  };

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:500,
      display:"flex", alignItems:"center", justifyContent:"center", padding:"20px",
    }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"linear-gradient(160deg,#0E1635,#0A1220)",
        border:"1px solid rgba(168,224,99,0.3)", borderRadius:"32px",
        padding:"40px", width:"100%", maxWidth:"560px",
        maxHeight:"90vh", overflowY:"auto",
        animation:"slideUp 0.3s ease-out", position:"relative",
      }}>
        <button onClick={onClose} style={{
          position:"absolute", top:"16px", right:"16px",
          background:"rgba(255,255,255,0.1)", border:"none", color:"#fff",
          borderRadius:"50%", width:"32px", height:"32px", cursor:"pointer", fontSize:"16px",
        }}>✕</button>

        {loading ? (
          <div style={{textAlign:"center", padding:"40px 0"}}>
            <div style={{fontSize:"56px", marginBottom:"20px", animation:"float 2s ease-in-out infinite"}}>🌟</div>
            <div style={{fontWeight:"900", fontSize:"20px", marginBottom:"12px", color:"#A8E063"}}>
              Starky is writing your report...
            </div>
            <div style={{fontSize:"14px", color:"rgba(255,255,255,0.5)"}}>Analysing today's session</div>
            <div style={{display:"flex",gap:"6px",justifyContent:"center",marginTop:"20px"}}>
              {[0,0.2,0.4].map(d=>(
                <div key={d} style={{width:"10px",height:"10px",borderRadius:"50%",background:"#A8E063",animation:`pulse 1.2s ease-in-out ${d}s infinite`}}/>
              ))}
            </div>
          </div>
        ) : sent ? (
          <div style={{textAlign:"center", padding:"20px 0"}}>
            <div style={{fontSize:"64px", marginBottom:"20px"}}>🎉</div>
            <h2 style={{fontWeight:"900", fontSize:"26px", marginBottom:"12px", color:"#A8E063"}}>
              Report Sent!
            </h2>
            <p style={{color:"rgba(255,255,255,0.65)", lineHeight:"1.7", marginBottom:"20px"}}>
              Your Learning Report has been sent to <strong style={{color:"#63D2FF"}}>{email}</strong>
              {parentEmail && <> and <strong style={{color:"#63D2FF"}}>{parentEmail}</strong></>}.
              Check your inbox — Starky is proud of you! 🌟
            </p>
            <button onClick={onClose} style={{
              background:"linear-gradient(135deg,#A8E063,#6FCF97)",
              border:"none", borderRadius:"14px", padding:"14px 36px",
              fontWeight:"900", fontSize:"15px", cursor:"pointer", color:"#060B20",
              fontFamily:"'Nunito',sans-serif",
            }}>Keep Learning →</button>
          </div>
        ) : report && (
          <>
            {/* Score ring */}
            <div style={{textAlign:"center", marginBottom:"24px"}}>
              <div style={{
                width:"110px", height:"110px", borderRadius:"50%",
                background:`conic-gradient(#A8E063 ${report.score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 16px", position:"relative",
              }}>
                <div style={{
                  width:"88px", height:"88px", borderRadius:"50%",
                  background:"#0E1635", display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center",
                }}>
                  <div style={{fontWeight:"900", fontSize:"28px", color:"#A8E063", lineHeight:1}}>{report.score}</div>
                  <div style={{fontSize:"10px", color:"rgba(255,255,255,0.4)", fontWeight:"700"}}>CURIOSITY SCORE</div>
                </div>
              </div>
              <h2 style={{fontWeight:"900", fontSize:"22px", margin:"0 0 6px", color:"#A8E063"}}>
                {report.headline}
              </h2>
              <div style={{fontSize:"13px", color:"rgba(255,255,255,0.45)"}}>
                {grade?.label} · Session Complete
              </div>
            </div>

            {/* Topics */}
            <div style={{marginBottom:"20px"}}>
              <div style={{fontSize:"11px",fontWeight:"800",color:"rgba(255,255,255,0.35)",letterSpacing:"1px",marginBottom:"10px"}}>TODAY YOU EXPLORED</div>
              <div style={{display:"flex", flexWrap:"wrap", gap:"8px"}}>
                {report.topicsCovered.map((t,i)=>(
                  <span key={i} style={{background:"rgba(99,210,255,0.12)",border:"1px solid rgba(99,210,255,0.25)",borderRadius:"20px",padding:"5px 14px",fontSize:"12px",fontWeight:"700",color:"#63D2FF"}}>{t}</span>
                ))}
              </div>
            </div>

            {/* Star moment */}
            <div style={{background:"rgba(255,195,0,0.1)",border:"1px solid rgba(255,195,0,0.25)",borderRadius:"16px",padding:"16px 18px",marginBottom:"16px"}}>
              <div style={{fontSize:"12px",fontWeight:"800",color:"#FFC300",marginBottom:"6px"}}>⭐ STAR MOMENT</div>
              <div style={{fontSize:"14px",color:"rgba(255,255,255,0.8)",lineHeight:"1.65"}}>{report.starMoment}</div>
            </div>

            {/* Strength */}
            <div style={{background:"rgba(168,224,99,0.09)",border:"1px solid rgba(168,224,99,0.22)",borderRadius:"16px",padding:"16px 18px",marginBottom:"16px"}}>
              <div style={{fontSize:"12px",fontWeight:"800",color:"#A8E063",marginBottom:"6px"}}>💪 STRENGTH SPOTTED</div>
              <div style={{fontSize:"14px",color:"rgba(255,255,255,0.8)",lineHeight:"1.65"}}>{report.strengthSpotted}</div>
            </div>

            {/* Encouragement */}
            <div style={{background:"rgba(99,210,255,0.08)",border:"1px solid rgba(99,210,255,0.2)",borderLeft:"4px solid #63D2FF",borderRadius:"0 16px 16px 0",padding:"16px 20px",marginBottom:"16px"}}>
              <div style={{fontSize:"12px",fontWeight:"800",color:"#63D2FF",marginBottom:"6px"}}>🌟 FROM STARKY</div>
              <div style={{fontSize:"14px",color:"rgba(255,255,255,0.85)",lineHeight:"1.75",fontStyle:"italic"}}>"{report.encouragement}"</div>
            </div>

            {/* Next challenge */}
            <div style={{background:"rgba(255,107,107,0.09)",border:"1px solid rgba(255,107,107,0.22)",borderRadius:"16px",padding:"14px 18px",marginBottom:"24px"}}>
              <div style={{fontSize:"12px",fontWeight:"800",color:"#FF6B6B",marginBottom:"6px"}}>🚀 NEXT CHALLENGE</div>
              <div style={{fontSize:"14px",color:"rgba(255,255,255,0.8)",lineHeight:"1.6"}}>{report.nextChallenge}</div>
            </div>

            {/* Email capture */}
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"20px",padding:"22px"}}>
              <div style={{fontWeight:"900",fontSize:"15px",marginBottom:"6px"}}>📧 Send this report to your inbox</div>
              <div style={{fontSize:"13px",color:"rgba(255,255,255,0.45)",marginBottom:"16px"}}>Keep a record of every session. Parents can be CC'd too.</div>
              <input
                value={email}
                onChange={e=>setEmail(e.target.value)}
                placeholder="Your email address"
                style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(168,224,99,0.3)",borderRadius:"12px",padding:"12px 16px",color:"#fff",fontSize:"14px",outline:"none",boxSizing:"border-box",marginBottom:"10px",fontFamily:"'Nunito',sans-serif"}}
              />
              <input
                value={parentEmail}
                onChange={e=>setParentEmail(e.target.value)}
                placeholder="Parent's email (optional)"
                style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"12px",padding:"12px 16px",color:"#fff",fontSize:"14px",outline:"none",boxSizing:"border-box",marginBottom:"14px",fontFamily:"'Nunito',sans-serif"}}
              />
              <button onClick={handleSend} style={{
                width:"100%",background:"linear-gradient(135deg,#A8E063,#6FCF97)",
                border:"none",borderRadius:"12px",padding:"14px",
                fontWeight:"900",fontSize:"15px",cursor:"pointer",color:"#060B20",
                fontFamily:"'Nunito',sans-serif",
              }}>Send My Learning Report 🌟</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ── STARS ───────────────────────────────────────────────────────────────────
const Stars = ({count=70}) => {
  const stars = useRef(Array.from({length:count},(_,i)=>({
    id:i, x:Math.random()*100, y:Math.random()*100,
    size:Math.random()*2.5+0.4, opacity:Math.random()*0.6+0.15, delay:Math.random()*4,
  }))).current;
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {stars.map(s=>(
        <div key={s.id} style={{
          position:"absolute",left:`${s.x}%`,top:`${s.y}%`,
          width:`${s.size}px`,height:`${s.size}px`,
          borderRadius:"50%",background:"#fff",opacity:s.opacity,
          animation:`twinkle 3s ease-in-out ${s.delay}s infinite alternate`,
        }}/>
      ))}
    </div>
  );
};

// ── MAIN ────────────────────────────────────────────────────────────────────
export default function NewWorldEducation() {
  const { isMobile, isTablet } = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab,       setActiveTab]       = useState("students");
  const [selectedGrade,   setSelectedGrade]   = useState(null);
  const [langIndex,       setLangIndex]       = useState(0);
  const [starkySpeaking,  setStarkySpeaking]  = useState(false);
  const [starkyMessage,   setStarkyMessage]   = useState("Hi! I'm Starky 🌟 I'm your personal AI teacher — I've studied every textbook from KG to A Levels in 16 languages. Ask me anything!");
  const [chatInput,       setChatInput]       = useState("");
  const [chatHistory,     setChatHistory]     = useState([]);
  const [showAuthModal,   setShowAuthModal]   = useState(false);
  const [authMode,        setAuthMode]        = useState("signup");
  const [showAssessment,  setShowAssessment]  = useState(false);
  const [sessionMessages, setSessionMessages] = useState([]);
  const [sessionActive,   setSessionActive]   = useState(false);
  const chatEndRef = useRef(null);
  const { callsUsed, callsLeft, limitReached, recordCall } = useSessionLimit();
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(()=>{
    const iv = setInterval(()=>setLangIndex(i=>(i+1)%LANG_TICKER.length),1600);
    return ()=>clearInterval(iv);
  },[]);

  useEffect(()=>{
    chatEndRef.current?.scrollIntoView({behavior:"smooth"});
  },[chatHistory]);

  const starkyResponses = [
    "Great question! Let me break that down step by step for you 🌟",
    "I know this topic well — here's how it works...",
    "This is key for your exams. Let me guide you through it! 🎯",
    "Regular practice with me will definitely improve your grades! 🏆",
    "Shall I explain this in a different language? Just ask! 🌍",
  ];

  const handleChat = () => {
    if (!chatInput.trim()) return;
    if (limitReached) { setShowLimitModal(true); return; }
    recordCall();
    const msg = { from:"user", text:chatInput };
    setChatHistory(h=>[...h,msg]);
    setSessionMessages(h=>[...h,msg]);
    setSessionActive(true);
    const reply = starkyResponses[Math.floor(Math.random()*starkyResponses.length)];
    setTimeout(()=>{
      const r = {from:"starky",text:reply};
      setChatHistory(h=>[...h,r]);
      setSessionMessages(h=>[...h,r]);
    },700);
    setChatInput("");
  };

  const handleGradeSelect = g=>{
    setSelectedGrade(g);
    setStarkyMessage(`Perfect! I'm ready for ${g.label} (ages ${g.age}). ${g.emoji} What subject shall we explore?`);
    setStarkySpeaking(true);
    setTimeout(()=>setStarkySpeaking(false),2500);
  };

  const handleEndSession = ()=>{
    if (sessionMessages.length>0) setShowAssessment(true);
  };

  return (
    <>
    <Head>
      <title>NewWorld Education — AI Tutor for Every Student | KG to A Levels</title>
      <meta name="description" content="Meet Starky — your free AI tutor available 24/7 in 16 languages, covering every subject from KG to A Levels. Trusted by students in Pakistan, UAE, Saudi Arabia and worldwide." />
      <meta name="keywords" content="AI tutor, online tutoring, O Level, A Level, Cambridge, Pakistan, UAE, Saudi Arabia, KG, free education, Starky, special needs tutor" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href="https://www.newworld.education/" />
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.newworld.education/" />
      <meta property="og:title" content="NewWorld Education — Free AI Tutor for Every Student" />
      <meta property="og:description" content="Starky is your personal AI teacher — available 24/7, in your language, covering KG to A Levels. Like having a private tutor at zero cost, for every child on Earth." />
      <meta property="og:image" content="https://www.newworld.education/og-image.png" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="NewWorld Education — Free AI Tutor" />
      <meta name="twitter:description" content="Your personal AI teacher — available 24/7 in 16 languages, KG to A Levels." />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div style={{fontFamily:"'Nunito','Trebuchet MS',sans-serif",background:"#060B20",color:"#fff",minHeight:"100vh",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes twinkle  { from{opacity:0.1} to{opacity:0.85} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(1.4);opacity:0} }
        @keyframes orbit    { from{transform:rotate(0deg) translateX(145px)} to{transform:rotate(360deg) translateX(145px)} }
        @keyframes orbit2   { from{transform:rotate(0deg) translateX(175px)} to{transform:rotate(-360deg) translateX(175px)} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradShift{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .grade-btn:hover   { transform:scale(1.1) translateY(-4px); z-index:2; }
        .cta-primary:hover { transform:translateY(-3px); box-shadow:0 16px 48px rgba(99,210,255,0.55)!important; }
        .cta-secondary:hover{ border-color:rgba(255,255,255,0.5)!important; transform:translateY(-2px); }
        .feature-card:hover { transform:translateY(-4px); border-color:rgba(99,210,255,0.4)!important; }
        .subject-card:hover { transform:translateY(-5px); border-color:rgba(168,224,99,0.5)!important; }
        .testimonial:hover  { transform:translateY(-4px); }
        .partner-card:hover { transform:translateY(-5px); border-color:rgba(99,210,255,0.4)!important; }
        .tab-btn:hover { color:#fff!important; }
        textarea:focus,input:focus{ outline:none; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:rgba(99,210,255,0.3);border-radius:4px}
      `}</style>

      {showLimitModal && <LimitReachedModal onClose={()=>setShowLimitModal(false)} grade={selectedGrade}/>}
      {/* ASSESSMENT MODAL */}
      {showAssessment && (
        <AssessmentModal
          session={sessionMessages}
          grade={selectedGrade}
          onClose={()=>setShowAssessment(false)}
        />
      )}

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={()=>setShowAuthModal(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#0E1635",border:"1px solid rgba(99,210,255,0.3)",borderRadius:"28px",padding:"48px",width:"100%",maxWidth:"440px",animation:"slideUp 0.25s ease-out",position:"relative"}}>
            <button onClick={()=>setShowAuthModal(false)} style={{position:"absolute",top:"16px",right:"16px",background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",borderRadius:"50%",width:"32px",height:"32px",cursor:"pointer",fontSize:"16px"}}>✕</button>
            <div style={{textAlign:"center",marginBottom:"28px"}}>
              <div style={{fontSize:"44px",marginBottom:"12px"}}>🌟</div>
              <h2 style={{fontWeight:"900",fontSize:"24px",margin:"0 0 6px"}}>{authMode==="signup"?"Join New World Education":"Welcome Back"}</h2>
              <p style={{color:"rgba(255,255,255,0.5)",fontSize:"13px",margin:0}}>{authMode==="signup"?"Start your learning journey today":"Continue where you left off"}</p>
            </div>
            <button style={{width:"100%",background:"#fff",color:"#1a1a1a",border:"none",borderRadius:"14px",padding:"15px",fontWeight:"800",fontSize:"14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"12px",fontFamily:"'Nunito',sans-serif",marginBottom:"18px",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"16px"}}>
              <div style={{flex:1,height:"1px",background:"rgba(255,255,255,0.1)"}}/>
              <span style={{color:"rgba(255,255,255,0.35)",fontSize:"12px"}}>or</span>
              <div style={{flex:1,height:"1px",background:"rgba(255,255,255,0.1)"}}/>
            </div>
            <input placeholder="Email address" style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(99,210,255,0.25)",borderRadius:"12px",padding:"13px 16px",color:"#fff",fontSize:"14px",outline:"none",marginBottom:"10px",boxSizing:"border-box",fontFamily:"'Nunito',sans-serif"}}/>
            {authMode==="signup"&&<select style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(99,210,255,0.25)",borderRadius:"12px",padding:"13px 16px",color:"rgba(255,255,255,0.7)",fontSize:"14px",outline:"none",marginBottom:"10px",boxSizing:"border-box",fontFamily:"'Nunito',sans-serif"}}><option value="">I am a... Student / Teacher / Parent</option><option>Student</option><option>Teacher</option><option>Parent</option></select>}
            <button className="cta-primary" style={{width:"100%",background:"linear-gradient(135deg,#63D2FF,#4ECDC4)",border:"none",borderRadius:"12px",padding:"15px",color:"#060B20",fontWeight:"900",fontSize:"15px",cursor:"pointer",fontFamily:"'Nunito',sans-serif",transition:"all 0.2s",boxShadow:"0 4px 20px rgba(99,210,255,0.3)",marginBottom:"14px"}}>
              {authMode==="signup"?"Create My Account →":"Sign In →"}
            </button>
            <p style={{textAlign:"center",fontSize:"12px",color:"rgba(255,255,255,0.35)",margin:0}}>
              {authMode==="signup"?"Already have an account? ":"New here? "}
              <span onClick={()=>setAuthMode(authMode==="signup"?"login":"signup")} style={{color:"#63D2FF",cursor:"pointer",fontWeight:"700"}}>{authMode==="signup"?"Sign in":"Create account"}</span>
            </p>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(6,11,32,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(99,210,255,0.1)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:isMobile?"0 16px":"0 40px",height:"68px",flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <span style={{fontSize:"24px"}}>🌍</span>
          <span style={{fontWeight:"900",fontSize:"19px"}}>New<span style={{color:"#63D2FF"}}>World</span><span style={{fontSize:"11px",color:"#A8E063",marginLeft:"6px",fontWeight:"700",letterSpacing:"1px"}}>EDUCATION</span></span>
        </div>
        {!isMobile && <div style={{display:"flex",gap:"28px",alignItems:"center"}}>
          {["Students","Teachers","Parents","Partners"].map(item=>(
            <span key={item} className="tab-btn" style={{color:"rgba(255,255,255,0.55)",cursor:"pointer",fontSize:"14px",fontWeight:"600",transition:"color 0.2s"}}>{item}</span>
          ))}
        </div>}
        {!isMobile ? (
          <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
            <a href="/special-needs" style={{background:"linear-gradient(135deg,rgba(168,99,255,0.2),rgba(168,99,255,0.1))",border:"1px solid rgba(168,99,255,0.4)",color:"#C77DFF",padding:"9px 18px",borderRadius:"30px",fontWeight:"800",fontSize:"13px",textDecoration:"none",fontFamily:"'Nunito',sans-serif"}}>💜 Special Needs</a>
            <a href="/parent" style={{background:"linear-gradient(135deg,rgba(255,193,0,0.15),rgba(255,193,0,0.08))",border:"1px solid rgba(255,193,0,0.35)",color:"#FFC300",padding:"9px 18px",borderRadius:"30px",fontWeight:"800",fontSize:"13px",textDecoration:"none",fontFamily:"'Nunito',sans-serif"}}>👨‍👧‍👦 Parent Portal</a>
            <a href="/demo" style={{background:"linear-gradient(135deg,#63D2FF,#4ECDC4)",border:"none",color:"#060B20",padding:"10px 20px",borderRadius:"30px",fontWeight:"800",fontSize:"13px",textDecoration:"none",fontFamily:"'Nunito',sans-serif",boxShadow:"0 4px 20px rgba(99,210,255,0.3)"}}>⭐ Try Starky →</a>
          </div>
        ) : (
          <button onClick={()=>setMenuOpen(m=>!m)} style={{background:"none",border:"none",color:"#fff",fontSize:"26px",cursor:"pointer",padding:"4px 8px",lineHeight:1}}>
            {menuOpen?"✕":"☰"}
          </button>
        )}
        {isMobile && menuOpen && (
          <div style={{position:"fixed",top:"68px",left:0,right:0,background:"rgba(6,11,32,0.98)",borderBottom:"1px solid rgba(99,210,255,0.15)",padding:"16px 20px",display:"flex",flexDirection:"column",gap:"4px",zIndex:99,backdropFilter:"blur(20px)"}}>
            {["Students","Teachers","Parents","Partners"].map(item=>(
              <span key={item} onClick={()=>setMenuOpen(false)} style={{fontSize:"16px",color:"rgba(255,255,255,0.75)",cursor:"pointer",fontWeight:"700",padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>{item}</span>
            ))}
            <a href="/special-needs" onClick={()=>setMenuOpen(false)} style={{color:"#C77DFF",fontWeight:"800",fontSize:"16px",textDecoration:"none",padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>💜 Special Needs</a>
            <a href="/parent" onClick={()=>setMenuOpen(false)} style={{color:"#FFC300",fontWeight:"800",fontSize:"16px",textDecoration:"none",padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>👨‍👧‍👦 Parent Portal</a>
            <a href="/demo" onClick={()=>setMenuOpen(false)} style={{color:"#63D2FF",fontWeight:"800",fontSize:"16px",textDecoration:"none",padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>⭐ Try Starky</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:isMobile?"80px 16px 40px":"100px 40px 60px",background:"radial-gradient(ellipse at 50% 0%,rgba(99,210,255,0.1) 0%,transparent 60%),radial-gradient(ellipse at 80% 80%,rgba(168,224,99,0.07) 0%,transparent 50%)"}}>
        <Stars/>

        {/* World's No 1 banner */}
        <div style={{
          background:"linear-gradient(135deg,rgba(255,195,0,0.15),rgba(255,142,83,0.12))",
          border:"1px solid rgba(255,195,0,0.4)", borderRadius:"50px",
          padding:"10px 28px", marginBottom:"22px",
          display:"flex", alignItems:"center", gap:"10px",
          animation:"slideUp 0.4s ease-out",
          boxShadow:"0 0 40px rgba(255,195,0,0.15)",
        }}>
          <span style={{fontSize:"18px"}}>🏆</span>
          <span style={{
            fontWeight:"900", fontSize:"clamp(12px,1.5vw,15px)",
            background:"linear-gradient(135deg,#FFC300,#FFB347,#FF8E53)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            backgroundSize:"200% auto", animation:"shimmer 3s linear infinite",
            letterSpacing:"0.5px",
          }}>World's No.1 AI Educational Resource</span>
          <span style={{fontSize:"18px"}}>🏆</span>
        </div>

        <div style={{background:"rgba(99,210,255,0.1)",border:"1px solid rgba(99,210,255,0.25)",borderRadius:"30px",padding:"8px 22px",marginBottom:"24px",fontSize:"13px",fontWeight:"700",color:"#63D2FF",display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap",justifyContent:"center"}}>
          🌍 Global AI School — KG to A Levels
          <span style={{background:"#A8E063",color:"#060B20",padding:"2px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:"800"}}>16 LANGUAGES</span>
          <span style={{background:"rgba(168,224,99,0.2)",color:"#A8E063",padding:"2px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:"800"}}>FREE TRIAL</span>
        </div>

        <h1 style={{fontWeight:"900",fontSize:"clamp(34px,6vw,70px)",textAlign:"center",lineHeight:"1.08",margin:"0 0 18px",background:"linear-gradient(135deg,#fff 0%,#63D2FF 45%,#A8E063 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundSize:"200% 200%",animation:"gradShift 5s ease infinite"}}>
          Every Child Deserves<br/>a World-Class Tutor
        </h1>

        <div style={{background:"rgba(168,224,99,0.1)",border:"1px solid rgba(168,224,99,0.28)",borderRadius:"50px",padding:"10px 24px",marginBottom:"16px",fontSize:"clamp(13px,1.6vw,16px)",fontWeight:"800",color:"#A8E063",display:"flex",alignItems:"center",gap:"8px",justifyContent:"center",flexWrap:"wrap",textAlign:"center"}}>
          ⚡ Brilliant education in focused minutes — not wasted hours
        </div>

        <p style={{fontSize:"clamp(15px,1.8vw,19px)",color:"rgba(255,255,255,0.65)",textAlign:"center",maxWidth:"600px",margin:"0 0 32px",lineHeight:"1.72",fontWeight:"500"}}>
          Meet <strong style={{color:"#63D2FF"}}>Starky</strong> — your personal AI teacher, available 24/7, in your language, covering every subject from KG to A Levels. Like having a private tutor at zero cost, for every child on Earth.
        </p>

        <div style={{display:"flex",gap:"14px",marginBottom:"52px",flexWrap:"wrap",justifyContent:"center"}}>
          <button onClick={()=>{setAuthMode("signup");setShowAuthModal(true);}} className="cta-primary" style={{background:"linear-gradient(135deg,#63D2FF,#4ECDC4)",border:"none",color:"#060B20",padding:isMobile?"14px 28px":"18px 44px",borderRadius:"50px",fontWeight:"900",fontSize:isMobile?"15px":"17px",cursor:"pointer",transition:"all 0.2s",boxShadow:"0 8px 32px rgba(99,210,255,0.4)"}}>Start Learning Free →</button>
          <button onClick={()=>window.location.href="/demo"} className="cta-secondary" style={{background:"transparent",border:"2px solid rgba(255,255,255,0.2)",color:"#fff",padding:"18px 44px",borderRadius:"50px",fontWeight:"800",fontSize:"17px",cursor:"pointer",fontFamily:"'Nunito',sans-serif",transition:"all 0.2s"}}>Meet Starky 🌟</button>
        </div>

        {/* GRADE SELECTOR */}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(99,210,255,0.16)",borderRadius:"26px",padding:"28px 32px",maxWidth:"940px",width:"100%",textAlign:"center",backdropFilter:"blur(12px)"}}>
          <h3 style={{margin:"0 0 20px",fontSize:"14px",fontWeight:"800",color:"#63D2FF",letterSpacing:"1.5px",textTransform:"uppercase"}}>Select Your Grade to Begin</h3>
          <div style={{display:"flex",flexWrap:"wrap",gap:"9px",justifyContent:"center"}}>
            {GRADES.map(g=>(
              <button key={g.id} className="grade-btn" onClick={()=>handleGradeSelect(g)} style={{background:selectedGrade?.id===g.id?`linear-gradient(135deg,${g.color}CC,${g.color}88)`:"rgba(255,255,255,0.06)",border:`2px solid ${selectedGrade?.id===g.id?g.color:"rgba(255,255,255,0.12)"}`,borderRadius:"15px",padding:"10px 12px",cursor:"pointer",color:"#fff",fontWeight:"700",fontSize:"11px",transition:"all 0.22s",fontFamily:"'Nunito',sans-serif",boxShadow:selectedGrade?.id===g.id?`0 0 24px ${g.color}44`:"none",minWidth:"68px"}}>
                <div style={{fontSize:"16px",marginBottom:"4px"}}>{g.emoji}</div>
                <div style={{fontSize:"10px",fontWeight:"800"}}>{g.label}</div>
                <div style={{fontSize:"9px",opacity:0.55,marginTop:"2px"}}>Age {g.age}</div>
              </button>
            ))}
          </div>
          {selectedGrade&&(
            <div style={{marginTop:"20px",padding:"14px 22px",background:`linear-gradient(135deg,${selectedGrade.color}18,${selectedGrade.color}0C)`,border:`1px solid ${selectedGrade.color}44`,borderRadius:"16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"10px",animation:"slideUp 0.3s ease-out"}}>
              <span style={{fontWeight:"700",fontSize:"14px"}}><span style={{color:selectedGrade.color,fontWeight:"900"}}>{selectedGrade.emoji} {selectedGrade.label}</span> selected — Starky is ready for ages {selectedGrade.age}</span>
              <button onClick={()=>{setAuthMode("signup");setShowAuthModal(true);}} style={{background:selectedGrade.color,border:"none",color:"#060B20",padding:"10px 22px",borderRadius:"20px",fontWeight:"800",fontSize:"13px",cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Start {selectedGrade.label} →</button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{display:"flex",gap:isMobile?"24px":"48px",marginTop:isMobile?"32px":"48px",flexWrap:"wrap",justifyContent:"center"}}>
          {[{value:"1B+",label:"Students Who Need This"},{value:"16",label:"Languages Supported"},{value:"13",label:"Grade Levels"},{value:"24/7",label:"Starky Availability"}].map(stat=>(
            <div key={stat.label} style={{textAlign:"center"}}>
              <div style={{fontSize:"clamp(26px,4vw,40px)",fontWeight:"900",background:"linear-gradient(135deg,#63D2FF,#A8E063)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{stat.value}</div>
              <div style={{fontSize:"11px",color:"rgba(255,255,255,0.4)",fontWeight:"600",marginTop:"4px"}}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STARKY SECTION */}
      <section style={{padding:isMobile?"40px 16px":"80px 40px",background:"radial-gradient(ellipse at 40% 50%,rgba(99,210,255,0.07) 0%,transparent 65%)",position:"relative"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto",display:"flex",alignItems:"center",gap:isMobile?"32px":"72px",flexWrap:"wrap",justifyContent:"center",flexDirection:isMobile?"column":"row"}}>

          {/* Avatar */}
          <div style={{flex:"0 0 auto",textAlign:"center",position:"relative",width:isMobile?"200px":"300px"}}>
            <div style={{position:"relative",width:isMobile?"200px":"300px",height:isMobile?"200px":"300px",margin:"0 auto"}}>
              <div style={{position:"absolute",inset:"-30px",borderRadius:"50%",border:"1px solid rgba(99,210,255,0.12)"}}/>
              <div style={{position:"absolute",inset:"-60px",borderRadius:"50%",border:"1px dashed rgba(168,224,99,0.09)"}}/>
              <div style={{position:"absolute",top:"50%",left:"50%",width:0,height:0}}>
                <div style={{position:"absolute",width:"12px",height:"12px",borderRadius:"50%",background:"#63D2FF",marginLeft:"-6px",marginTop:"-6px",animation:"orbit 5s linear infinite",transformOrigin:"6px 6px"}}/>
              </div>
              <div style={{position:"absolute",top:"50%",left:"50%",width:0,height:0}}>
                <div style={{position:"absolute",width:"9px",height:"9px",borderRadius:"50%",background:"#A8E063",marginLeft:"-4.5px",marginTop:"-4.5px",animation:"orbit2 7s linear infinite",transformOrigin:"4.5px 4.5px"}}/>
              </div>
              <div onClick={()=>{setStarkySpeaking(true);setTimeout(()=>setStarkySpeaking(false),2500);}} style={{width:"300px",height:"300px",borderRadius:"50%",background:"linear-gradient(135deg,#0D2040,#1A3A6B,#0D2040)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"110px",cursor:"pointer",border:`4px solid ${starkySpeaking?"#63D2FF":"rgba(99,210,255,0.35)"}`,animation:"float 4s ease-in-out infinite",transition:"border-color 0.3s,box-shadow 0.3s",boxShadow:starkySpeaking?"0 0 70px rgba(99,210,255,0.7)":"0 0 40px rgba(99,210,255,0.2)",position:"relative",zIndex:2}}>
                🌟
                {starkySpeaking&&<div style={{position:"absolute",inset:"-6px",borderRadius:"50%",border:"2px solid rgba(99,210,255,0.5)",animation:"pulse-ring 1.1s ease-out infinite"}}/>}
              </div>
            </div>
            <div style={{marginTop:"22px"}}>
              <div style={{fontWeight:"900",fontSize:"28px",letterSpacing:"-0.5px"}}>Starky <span style={{color:"#63D2FF"}}>AI Teacher</span></div>
              <div style={{fontSize:"12px",color:"rgba(255,255,255,0.4)",marginTop:"6px"}}>Powered by Claude · Your AI Teacher</div>
              <div style={{display:"flex",gap:"7px",justifyContent:"center",marginTop:"14px",flexWrap:"wrap"}}>
                {["🎙️ Voice","🌐 16 Languages","📚 Every Textbook","🧑‍🏫 Your AI Teacher"].map(tag=>(
                  <span key={tag} style={{background:"rgba(99,210,255,0.1)",border:"1px solid rgba(99,210,255,0.25)",borderRadius:"20px",padding:"4px 11px",fontSize:"10px",fontWeight:"700",color:"#63D2FF"}}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Chat */}
          <div style={{flex:1,minWidth:"300px",maxWidth:"580px"}}>
            <div style={{background:"rgba(99,210,255,0.07)",border:"1px solid rgba(99,210,255,0.18)",borderRadius:"26px",padding:"32px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"}}>
                <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#A8E063",animation:"pulse-ring 2s ease-out infinite"}}/>
                <span style={{fontSize:"11px",fontWeight:"800",color:"#A8E063",letterSpacing:"1px"}}>STARKY IS LIVE</span>
              </div>
              <h2 style={{fontWeight:"900",fontSize:"clamp(20px,3vw,32px)",margin:"0 0 18px",lineHeight:"1.2"}}>
                Your Personal Teacher,<br/><span style={{color:"#63D2FF"}}>Always Available</span>
              </h2>
              <div style={{background:"rgba(99,210,255,0.1)",border:"1px solid rgba(99,210,255,0.2)",borderRadius:"18px 18px 18px 4px",padding:"14px 18px",marginBottom:"16px",fontSize:"14px",lineHeight:"1.65",fontWeight:"500",animation:"slideUp 0.4s ease-out"}}>
                🌟 {starkyMessage}
              </div>

              {/* Chat history */}
              <div style={{maxHeight:"160px",overflowY:"auto",marginBottom:"12px"}}>
                {chatHistory.slice(-6).map((msg,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:msg.from==="user"?"flex-end":"flex-start",marginBottom:"8px",animation:"slideUp 0.3s ease-out"}}>
                    <div style={{background:msg.from==="user"?"rgba(99,210,255,0.18)":"rgba(168,224,99,0.12)",borderRadius:msg.from==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"9px 14px",maxWidth:"82%",fontSize:"13px",fontWeight:"500",border:`1px solid ${msg.from==="user"?"rgba(99,210,255,0.25)":"rgba(168,224,99,0.22)"}`}}>
                      {msg.from==="starky"&&"🌟 "}{msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef}/>
              </div>

              <div style={{marginBottom:"10px"}}><SessionLimitBanner callsUsed={callsUsed} callsLeft={callsLeft} limitReached={limitReached} compact/></div>
              <div style={{display:"flex",gap:"9px",marginBottom:"12px"}}>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleChat()} placeholder="Ask Starky anything... in any language! 🌍" style={{flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(99,210,255,0.28)",borderRadius:"14px",padding:"13px 16px",color:"#fff",fontSize:"13px",outline:"none",fontFamily:"'Nunito',sans-serif"}}/>
                <button onClick={handleChat} style={{background:"linear-gradient(135deg,#63D2FF,#4ECDC4)",border:"none",borderRadius:"14px",padding:"13px 18px",cursor:"pointer",fontSize:"16px"}}>→</button>
              </div>

              {/* End session button */}
              {sessionActive&&(
                <button onClick={handleEndSession} style={{width:"100%",background:"linear-gradient(135deg,rgba(168,224,99,0.15),rgba(168,224,99,0.08))",border:"1px solid rgba(168,224,99,0.35)",borderRadius:"14px",padding:"12px",cursor:"pointer",color:"#A8E063",fontWeight:"800",fontSize:"13px",fontFamily:"'Nunito',sans-serif",transition:"all 0.2s",marginBottom:"12px"}}>
                  ✅ End Session & Get My Learning Report →
                </button>
              )}

              <div style={{padding:"13px 16px",background:"rgba(168,224,99,0.08)",border:"1px solid rgba(168,224,99,0.2)",borderRadius:"14px"}}>
                <div style={{fontSize:"11px",fontWeight:"800",color:"#A8E063",marginBottom:"4px"}}>🏆 O Level & A Level Students</div>
                <div style={{fontSize:"12px",color:"rgba(255,255,255,0.62)",lineHeight:"1.55"}}>
                  Starky knows your syllabus, past papers & mark schemes. Students who study with Starky regularly <strong style={{color:"#A8E063"}}>move up 1–2 grade boundaries</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TABS */}
      <section style={{padding:"70px 40px"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"36px"}}>
            <h2 style={{fontWeight:"900",fontSize:"clamp(24px,4vw,46px)",margin:"0 0 22px"}}>Built for <span style={{color:"#63D2FF"}}>Everyone</span></h2>
            <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
              {[{id:"students",label:"👦 Students",color:"#63D2FF"},{id:"teachers",label:"👩‍🏫 Teachers",color:"#A8E063"},{id:"parents",label:"👨‍👩‍👧 Parents",color:"#FFC300"}].map(tab=>(
                <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{background:activeTab===tab.id?`${tab.color}1A`:"rgba(255,255,255,0.04)",border:`2px solid ${activeTab===tab.id?tab.color:"rgba(255,255,255,0.1)"}`,borderRadius:"30px",padding:"12px 28px",color:activeTab===tab.id?tab.color:"rgba(255,255,255,0.5)",fontWeight:"800",fontSize:"14px",cursor:"pointer",transition:"all 0.2s",fontFamily:"'Nunito',sans-serif"}}>{tab.label}</button>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"16px",animation:"slideUp 0.35s ease-out"}}>
            {activeTab==="students"&&[
              {icon:"🌟",title:"Meet Starky",desc:"Your AI teacher who never gets tired, never judges, and always has time. Ask anything, any time, in your language."},
              {icon:"📊",title:"Learning Reports",desc:"After every session, Starky generates a personalised Learning Report sent to your email with your Curiosity Score and next challenge."},
              {icon:"🎮",title:"AI Learning Games",desc:"Collaborative multiplayer games that teach real concepts. Learn with students from every corner of the world."},
              {icon:"📈",title:"Grade Improvement",desc:"O & A Level students see real grade jumps. Starky focuses on exactly what examiners want to see."},
              {icon:"🌐",title:"16 Languages",desc:"Auto-detects your language. Study in English, Arabic, Urdu, Chinese, Filipino, French, and 10 more languages."},
              {icon:"🎓",title:"KG to A Level",desc:"One platform that grows with you — from your first ABCs all the way to your final A Level exams."},
            ].map(item=>(
              <div key={item.title} className="feature-card" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(99,210,255,0.1)",borderRadius:"20px",padding:"24px",transition:"all 0.25s"}}>
                <div style={{fontSize:"32px",marginBottom:"12px"}}>{item.icon}</div>
                <div style={{fontWeight:"800",fontSize:"15px",marginBottom:"8px"}}>{item.title}</div>
                <div style={{fontSize:"13px",color:"rgba(255,255,255,0.55)",lineHeight:"1.65"}}>{item.desc}</div>
              </div>
            ))}
            {activeTab==="teachers"&&[
              {icon:"❤️",title:"Starky Works For You",desc:"Starky is not here to replace you. It handles repetitive Q&A, explanations, and practice — so you can do what only a great teacher can: inspire, mentor, and connect."},
              {icon:"🌙",title:"Give Yourself Your Evenings Back",desc:"No more staying late to answer the same question twenty times. Starky is there for students 24/7 so you don't have to be."},
              {icon:"📝",title:"Lesson Planning in Minutes",desc:"Describe your topic and year group — Starky generates a full lesson plan, worksheet, and assessment in seconds. You review, adjust, and teach."},
              {icon:"📊",title:"Know Every Student",desc:"See exactly where each student is struggling before you walk into class. Spend your lesson time where it matters most — not guessing."},
              {icon:"📧",title:"Parent Communication Done",desc:"Every student session generates a Learning Report sent to parents automatically. Fewer parent queries, more teaching time."},
              {icon:"🌐",title:"Teach Any Class, Any Language",desc:"Students who speak Urdu, Arabic, or Chinese get Starky's explanations in their language. You teach — Starky translates and reinforces."},
            ].map(item=>(
              <div key={item.title} className="feature-card" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(168,224,99,0.1)",borderRadius:"20px",padding:"24px",transition:"all 0.25s"}}>
                <div style={{fontSize:"32px",marginBottom:"12px"}}>{item.icon}</div>
                <div style={{fontWeight:"800",fontSize:"15px",marginBottom:"8px"}}>{item.title}</div>
                <div style={{fontSize:"13px",color:"rgba(255,255,255,0.55)",lineHeight:"1.65"}}>{item.desc}</div>
              </div>
            ))}
            {activeTab==="parents"&&[
              {icon:"👁️",title:"Parent Dashboard",desc:"See exactly what your child is learning, how many hours they study, and where they need more support."},
              {icon:"📧",title:"Session Reports to Your Inbox",desc:"After every Starky session, you receive your child's Learning Report by email — their Curiosity Score, star moment, and next challenge."},
              {icon:"🔒",title:"Safe & Monitored",desc:"Age-appropriate content, parental controls, no ads, no data selling. Your child's safety is our priority."},
              {icon:"🌍",title:"Global Standards",desc:"Your child learns to the same standard as students in the world's top international schools."},
              {icon:"🔔",title:"Study Alerts",desc:"Get notified when your child completes sessions, earns achievements, or needs a gentle nudge."},
              {icon:"🏆",title:"Grade Tracking",desc:"Monitor grade improvements over time. Parents consistently see upward grade trends within weeks."},
            ].map(item=>(
              <div key={item.title} className="feature-card" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,195,0,0.1)",borderRadius:"20px",padding:"24px",transition:"all 0.25s"}}>
                <div style={{fontSize:"32px",marginBottom:"12px"}}>{item.icon}</div>
                <div style={{fontWeight:"800",fontSize:"15px",marginBottom:"8px"}}>{item.title}</div>
                <div style={{fontSize:"13px",color:"rgba(255,255,255,0.55)",lineHeight:"1.65"}}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEARNING REPORT SHOWCASE */}
      <section style={{padding:isMobile?"32px 16px":"60px 40px",background:"rgba(168,224,99,0.04)",borderTop:"1px solid rgba(168,224,99,0.1)",borderBottom:"1px solid rgba(168,224,99,0.1)"}}>
        <div style={{maxWidth:"960px",margin:"0 auto",display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:isMobile?"24px":"48px",alignItems:"center",flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:"11px",fontWeight:"800",color:"#A8E063",letterSpacing:"1.5px",marginBottom:"14px"}}>AFTER EVERY SESSION</div>
            <h2 style={{fontWeight:"900",fontSize:"clamp(24px,3.5vw,42px)",margin:"0 0 16px",lineHeight:"1.15"}}>
              Your Personal<br/><span style={{color:"#A8E063"}}>Learning Report</span>
            </h2>
            <p style={{fontSize:"15px",color:"rgba(255,255,255,0.62)",lineHeight:"1.75",marginBottom:"24px"}}>
              When every session ends, Starky analyses what was covered and generates a warm, encouraging report — sent directly to your inbox. Parents receive a copy too.
            </p>
            {[
              {icon:"🏆",text:"Your Curiosity Score for the session"},
              {icon:"⭐",text:"Your Star Moment — the best thing you did"},
              {icon:"💪",text:"A strength Starky spotted in you"},
              {icon:"🚀",text:"Your next challenge — to bring you back"},
              {icon:"📧",text:"Emailed to you and your parents automatically"},
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",gap:"12px",alignItems:"flex-start",marginBottom:"12px"}}>
                <span style={{fontSize:"18px",marginTop:"1px"}}>{item.icon}</span>
                <span style={{fontSize:"14px",color:"rgba(255,255,255,0.72)",lineHeight:"1.5"}}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Mock report card */}
          <div style={{background:"linear-gradient(160deg,#0E1635,#0A1220)",border:"1px solid rgba(168,224,99,0.25)",borderRadius:"24px",padding:"28px",animation:"float 4s ease-in-out infinite"}}>
            <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"20px"}}>
              <div style={{width:"52px",height:"52px",borderRadius:"50%",background:"conic-gradient(#A8E063 320deg,rgba(255,255,255,0.08) 0deg)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                <div style={{width:"42px",height:"42px",borderRadius:"50%",background:"#0E1635",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <div style={{fontWeight:"900",fontSize:"16px",color:"#A8E063",lineHeight:1}}>89</div>
                  <div style={{fontSize:"7px",color:"rgba(255,255,255,0.3)",fontWeight:"700"}}>SCORE</div>
                </div>
              </div>
              <div>
                <div style={{fontWeight:"900",fontSize:"15px",color:"#A8E063"}}>Outstanding session! 🌟</div>
                <div style={{fontSize:"11px",color:"rgba(255,255,255,0.4)"}}>O Level · Chemistry</div>
              </div>
            </div>
            {[
              {label:"⭐ STAR MOMENT",color:"#FFC300",text:"The way you questioned the reaction mechanism showed real scientific thinking."},
              {label:"💪 STRENGTH SPOTTED",color:"#A8E063",text:"Your curiosity about 'why' — not just 'what' — sets you apart as a learner."},
              {label:"🚀 NEXT CHALLENGE",color:"#63D2FF",text:"Next time: let's tackle organic chemistry naming conventions — you're ready!"},
            ].map((item,i)=>(
              <div key={i} style={{background:`${item.color}0D`,border:`1px solid ${item.color}22`,borderRadius:"12px",padding:"12px 14px",marginBottom:"10px"}}>
                <div style={{fontSize:"10px",fontWeight:"800",color:item.color,marginBottom:"5px"}}>{item.label}</div>
                <div style={{fontSize:"12px",color:"rgba(255,255,255,0.72)",lineHeight:"1.5"}}>{item.text}</div>
              </div>
            ))}
            <div style={{marginTop:"14px",padding:"12px",background:"rgba(99,210,255,0.08)",border:"1px solid rgba(99,210,255,0.18)",borderRadius:"12px",textAlign:"center"}}>
              <div style={{fontSize:"11px",color:"rgba(255,255,255,0.4)",marginBottom:"4px"}}>Report sent to</div>
              <div style={{fontSize:"12px",color:"#63D2FF",fontWeight:"700"}}>student@email.com · parent@email.com</div>
            </div>
          </div>
        </div>
      </section>


      {/* TEACHERS CONFIDENCE SECTION */}
      <section style={{padding:"70px 40px",background:"linear-gradient(160deg,rgba(168,224,99,0.06) 0%,transparent 60%)",borderTop:"1px solid rgba(168,224,99,0.12)"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"60px",alignItems:"center",flexWrap:"wrap"}}>

            {/* Left — manifesto */}
            <div>
              <div style={{fontSize:"11px",fontWeight:"800",color:"rgba(168,224,99,0.7)",letterSpacing:"1.5px",marginBottom:"14px"}}>FOR EVERY TEACHER WORLDWIDE</div>
              <h2 style={{fontWeight:"900",fontSize:"clamp(26px,3.5vw,44px)",margin:"0 0 20px",lineHeight:"1.15"}}>
                AI Is Not Your Enemy.<br/>
                <span style={{color:"#A8E063"}}>It's Your Best Assistant.</span>
              </h2>
              <p style={{fontSize:"16px",color:"rgba(255,255,255,0.65)",lineHeight:"1.8",marginBottom:"20px"}}>
                We hear you. There is a lot of noise about AI "replacing" teachers. We want to say something clearly:
              </p>
              <div style={{background:"rgba(168,224,99,0.1)",border:"1px solid rgba(168,224,99,0.3)",borderLeft:"4px solid #A8E063",borderRadius:"0 16px 16px 0",padding:"20px 24px",marginBottom:"24px"}}>
                <p style={{fontSize:"17px",fontWeight:"800",color:"#fff",lineHeight:"1.7",margin:0}}>
                  "No algorithm can replicate the look a great teacher gives a struggling student that says <em style={{color:"#A8E063"}}>'I believe in you.'</em> That is irreplaceable. Starky knows this — and it's built to make <em style={{color:"#A8E063"}}>you</em> more powerful, not redundant."
                </p>
              </div>
              <p style={{fontSize:"15px",color:"rgba(255,255,255,0.58)",lineHeight:"1.75",marginBottom:"0"}}>
                Starky handles the repetitive work — answering the same question for the 15th time, generating worksheets, tracking who's falling behind. You get to focus on what you trained for: teaching, mentoring, and changing lives.
              </p>
            </div>

            {/* Right — what changes for teachers */}
            <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
              {[
                { before:"Answering the same question 20 times", after:"Starky answers it — you teach forward", icon:"🔁" },
                { before:"Staying late to mark and plan", after:"AI drafts it in seconds — you refine in minutes", icon:"🌙" },
                { before:"Not knowing who's struggling until it's too late", after:"Live insights before you walk into class", icon:"📊" },
                { before:"Students too shy to ask in class", after:"Starky fields their questions privately, 24/7", icon:"🤫" },
                { before:"Parent queries about homework and progress", after:"Automated Learning Reports sent after every session", icon:"📧" },
              ].map((item,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"16px 18px",display:"flex",gap:"14px",alignItems:"flex-start"}}>
                  <span style={{fontSize:"22px",marginTop:"2px"}}>{item.icon}</span>
                  <div>
                    <div style={{fontSize:"12px",color:"rgba(255,107,107,0.8)",fontWeight:"700",marginBottom:"4px",textDecoration:"line-through",opacity:0.7}}>{item.before}</div>
                    <div style={{fontSize:"13px",color:"rgba(168,224,99,0.9)",fontWeight:"700"}}>{item.after}</div>
                  </div>
                </div>
              ))}
              <div style={{background:"rgba(168,224,99,0.1)",border:"1px solid rgba(168,224,99,0.25)",borderRadius:"16px",padding:"16px 18px",textAlign:"center",marginTop:"4px"}}>
                <div style={{fontSize:"13px",fontWeight:"800",color:"#A8E063",marginBottom:"6px"}}>🏫 Free for every teacher, always</div>
                <div style={{fontSize:"12px",color:"rgba(255,255,255,0.5)"}}>No institution purchase needed. Any teacher anywhere can sign up and start using Starky with their class today.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUBJECTS */}
      <section style={{padding:"70px 40px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <h2 style={{textAlign:"center",fontWeight:"900",fontSize:"clamp(24px,3vw,42px)",margin:"0 0 10px"}}>Every Subject. <span style={{color:"#A8E063"}}>Every Level.</span></h2>
          <p style={{textAlign:"center",color:"rgba(255,255,255,0.5)",marginBottom:"36px",fontSize:"14px"}}>Starky has read every textbook from KG to A Levels — ask about anything</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(195px,1fr))",gap:"13px"}}>
            {SUBJECTS.map(sub=>(
              <div key={sub.name} className="subject-card" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"18px",padding:"20px",cursor:"pointer",transition:"all 0.25s"}}>
                <div style={{fontSize:"30px",marginBottom:"10px"}}>{sub.icon}</div>
                <div style={{fontWeight:"800",fontSize:"14px",marginBottom:"4px"}}>{sub.name}</div>
                <div style={{fontSize:"12px",color:"rgba(255,255,255,0.42)"}}>{sub.desc}</div>
                {sub.name==="Earth & Environment"&&<div style={{marginTop:"9px",background:"rgba(168,224,99,0.12)",borderRadius:"10px",padding:"4px 10px",fontSize:"10px",color:"#A8E063",fontWeight:"800",display:"inline-block"}}>🌍 Featured</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O/A LEVEL PROMISE */}
      <section style={{padding:"70px 40px",background:"radial-gradient(ellipse at 50% 50%,rgba(168,224,99,0.07) 0%,transparent 60%)"}}>
        <div style={{maxWidth:"860px",margin:"0 auto",textAlign:"center"}}>
          <div style={{fontSize:"48px",marginBottom:"18px"}}>🏆</div>
          <h2 style={{fontWeight:"900",fontSize:"clamp(24px,4vw,50px)",margin:"0 0 18px",lineHeight:"1.1"}}>
            O Level & A Level Students:<br/><span style={{color:"#A8E063"}}>Your A* Is Within Reach</span>
          </h2>
          <p style={{fontSize:"16px",color:"rgba(255,255,255,0.65)",maxWidth:"640px",margin:"0 auto 36px",lineHeight:"1.75"}}>
            Starky has studied every Cambridge syllabus, past paper, mark scheme, and examiner report. It doesn't just help you understand — it helps you <strong style={{color:"#A8E063"}}>score</strong>.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:"14px",marginBottom:"36px"}}>
            {[{icon:"📈",label:"1–2 Grade Boundaries",desc:"Average improvement for regular users"},{icon:"⏰",label:"Night Before Exams",desc:"Starky is there at 2am when you need it"},{icon:"🎯",label:"Examiner-Focused",desc:"Starky knows exactly what Cambridge wants"},{icon:"📧",label:"Learning Reports",desc:"Email after every session to track your growth"}].map(item=>(
              <div key={item.label} style={{background:"rgba(168,224,99,0.07)",border:"1px solid rgba(168,224,99,0.16)",borderRadius:"18px",padding:"20px"}}>
                <div style={{fontSize:"28px",marginBottom:"10px"}}>{item.icon}</div>
                <div style={{fontWeight:"800",fontSize:"13px",color:"#A8E063",marginBottom:"5px"}}>{item.label}</div>
                <div style={{fontSize:"12px",color:"rgba(255,255,255,0.5)"}}>{item.desc}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>{setAuthMode("signup");setShowAuthModal(true);}} className="cta-primary" style={{background:"linear-gradient(135deg,#A8E063,#6FCF97)",border:"none",color:"#060B20",padding:"17px 46px",borderRadius:"50px",fontWeight:"900",fontSize:"16px",cursor:"pointer",transition:"all 0.2s",boxShadow:"0 8px 32px rgba(168,224,99,0.3)"}}>
            Start Improving My Grades →
          </button>
        </div>
      </section>

      {/* LANGUAGES */}
      <section style={{padding:isMobile?"32px 16px":"60px 40px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{maxWidth:"980px",margin:"0 auto",textAlign:"center"}}>
          <h2 style={{fontWeight:"900",fontSize:"clamp(22px,3vw,42px)",margin:"0 0 10px"}}>Automatic <span style={{color:"#63D2FF"}}>Multilingual</span> Learning</h2>
          <p style={{color:"rgba(255,255,255,0.5)",marginBottom:"32px",fontSize:"14px"}}>Starky detects your language automatically. No settings, no switching — just talk. Reaching over <strong style={{color:"#63D2FF"}}>6 billion speakers</strong>.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:"11px"}}>
            {LANGUAGES.map(lang=>(
              <div key={lang.name} style={{background:"rgba(99,210,255,0.06)",border:"1px solid rgba(99,210,255,0.14)",borderRadius:"16px",padding:"14px 16px",textAlign:lang.dir==="rtl"?"right":"left"}}>
                <div style={{display:"flex",justifyContent:lang.dir==="rtl"?"flex-end":"flex-start",alignItems:"center",gap:"7px",marginBottom:"7px"}}>
                  <span style={{fontSize:"20px"}}>{lang.flag}</span>
                  <span style={{fontSize:"10px",background:"rgba(168,224,99,0.13)",color:"#A8E063",padding:"2px 7px",borderRadius:"10px",fontWeight:"700"}}>{lang.speakers}</span>
                </div>
                <div style={{fontWeight:"800",fontSize:"13px",color:"#63D2FF"}}>{lang.name}</div>
                <div style={{fontSize:"9px",color:"rgba(255,255,255,0.33)",marginTop:"3px",direction:lang.dir,lineHeight:"1.4"}}>{lang.sample}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTITUTIONAL PARTNERSHIPS */}
      <section style={{padding:"70px 40px",background:"rgba(255,255,255,0.02)",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"44px"}}>
            <div style={{fontSize:"11px",fontWeight:"800",color:"rgba(99,210,255,0.7)",letterSpacing:"1.5px",marginBottom:"12px"}}>BUILDING THE FUTURE OF EDUCATION</div>
            <h2 style={{fontWeight:"900",fontSize:"clamp(24px,4vw,46px)",margin:"0 0 14px"}}>
              Institutional &<br/><span style={{color:"#63D2FF"}}>Government Partnerships</span>
            </h2>
            <p style={{color:"rgba(255,255,255,0.55)",fontSize:"15px",maxWidth:"580px",margin:"0 auto",lineHeight:"1.7"}}>
              New World Education is free for every student on Earth. We work with governments, ministries, and institutions to bring AI education to entire populations at scale.
            </p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"18px",marginBottom:"44px"}}>
            {PARTNERS.map(p=>(
              <div key={p.name} className="partner-card" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(99,210,255,0.1)",borderRadius:"22px",padding:"26px",transition:"all 0.25s"}}>
                <div style={{fontSize:"36px",marginBottom:"14px"}}>{p.flag}</div>
                <div style={{fontWeight:"900",fontSize:"16px",marginBottom:"10px"}}>{p.name}</div>
                <div style={{fontSize:"13px",color:"rgba(255,255,255,0.55)",lineHeight:"1.65"}}>{p.desc}</div>
              </div>
            ))}
          </div>
          <div style={{background:"linear-gradient(135deg,rgba(99,210,255,0.09),rgba(168,224,99,0.06))",border:"1px solid rgba(99,210,255,0.22)",borderRadius:"26px",padding:"36px",textAlign:"center"}}>
            <div style={{fontSize:"42px",marginBottom:"14px",animation:"float 3s ease-in-out infinite"}}>🤝</div>
            <h3 style={{fontWeight:"900",fontSize:"clamp(20px,3vw,32px)",margin:"0 0 12px"}}>Partner With New World Education</h3>
            <p style={{color:"rgba(255,255,255,0.58)",fontSize:"15px",maxWidth:"500px",margin:"0 auto 24px",lineHeight:"1.7"}}>
              Whether you're a ministry of education, a school network, or an NGO — Khurram will work directly with you to design the right solution for your students.
            </p>
            <div style={{display:"flex",gap:"14px",justifyContent:"center",flexWrap:"wrap"}}>
              <a href="mailto:khurram@newworld.education" className="cta-primary" style={{background:"linear-gradient(135deg,#63D2FF,#4ECDC4)",border:"none",color:"#060B20",padding:"15px 38px",borderRadius:"50px",fontWeight:"900",fontSize:"15px",cursor:"pointer",textDecoration:"none",transition:"all 0.2s",boxShadow:"0 8px 32px rgba(99,210,255,0.3)",display:"inline-block"}}>
                Contact Khurram →
              </a>
              <a href="mailto:khurram@newworld.education" style={{background:"transparent",border:"2px solid rgba(255,255,255,0.2)",color:"#fff",padding:"15px 38px",borderRadius:"50px",fontWeight:"800",fontSize:"15px",textDecoration:"none",display:"inline-block"}}>
                khurram@newworld.education
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:"70px 40px"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <h2 style={{textAlign:"center",fontWeight:"900",fontSize:"clamp(22px,3vw,40px)",margin:"0 0 44px"}}>Students Worldwide <span style={{color:"#63D2FF"}}>Love Starky</span></h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"16px"}}>
            {TESTIMONIALS.map(t=>(
              <div key={t.name} className="testimonial" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"20px",padding:"24px",transition:"all 0.25s"}}>
                <div style={{fontSize:"26px",marginBottom:"12px"}}>💬</div>
                <p style={{fontSize:"14px",lineHeight:"1.7",color:"rgba(255,255,255,0.78)",fontStyle:"italic",margin:"0 0 16px"}}>"{t.text}"</p>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                  <div>
                    <div style={{fontWeight:"800",fontSize:"14px"}}>{t.name}</div>
                    <div style={{fontSize:"11px",color:"rgba(255,255,255,0.4)"}}>{t.role} · {t.country}</div>
                  </div>
                  <div style={{background:"rgba(99,210,255,0.12)",borderRadius:"20px",padding:"4px 11px",fontSize:"10px",color:"#63D2FF",fontWeight:"700",whiteSpace:"nowrap"}}>{t.grade}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{padding:"90px 40px",textAlign:"center",background:"radial-gradient(ellipse at 50% 50%,rgba(99,210,255,0.09) 0%,transparent 60%)",position:"relative",overflow:"hidden"}}>
        <Stars count={50}/>
        <div style={{position:"relative",zIndex:1}}>
          {/* No.1 badge again */}
          <div style={{display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(255,195,0,0.12)",border:"1px solid rgba(255,195,0,0.35)",borderRadius:"50px",padding:"8px 22px",marginBottom:"22px",fontSize:"13px",fontWeight:"800"}}>
            <span>🏆</span>
            <span style={{background:"linear-gradient(135deg,#FFC300,#FF8E53)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>World's No.1 AI Educational Resource — Free Forever</span>
            <span>🏆</span>
          </div>
          <div style={{fontSize:"56px",marginBottom:"18px",animation:"float 3s ease-in-out infinite"}}>🌍</div>
          <h2 style={{fontWeight:"900",fontSize:"clamp(28px,5vw,60px)",margin:"0 0 16px",lineHeight:"1.1",background:"linear-gradient(135deg,#fff 0%,#63D2FF 50%,#A8E063 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            Begin Your New World<br/>of Learning Today
          </h2>
          <p style={{fontSize:"17px",color:"rgba(255,255,255,0.6)",maxWidth:"500px",margin:"0 auto 36px",lineHeight:"1.7"}}>
            Join students from every country discovering a smarter, faster, kinder way to learn — with Starky, for free.
          </p>
          <div style={{display:"flex",gap:"14px",justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>{setAuthMode("signup");setShowAuthModal(true);}} className="cta-primary" style={{background:"linear-gradient(135deg,#63D2FF,#4ECDC4)",border:"none",color:"#060B20",padding:"18px 48px",borderRadius:"50px",fontWeight:"900",fontSize:"17px",cursor:"pointer",transition:"all 0.2s",boxShadow:"0 8px 32px rgba(99,210,255,0.4)"}}>Create My Free Account →</button>
            <button onClick={()=>window.location.href="/demo"} style={{background:"transparent",border:"2px solid rgba(255,255,255,0.2)",color:"#fff",padding:"18px 48px",borderRadius:"50px",fontWeight:"800",fontSize:"17px",cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Meet Starky 🌟</button>
          </div>
          <p style={{marginTop:"16px",fontSize:"12px",color:"rgba(255,255,255,0.3)"}}>Sign up with Google · No credit card · Always free</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{background:"rgba(255,255,255,0.02)",borderBottom:"1px solid rgba(255,255,255,0.04)",padding:"22px 40px",textAlign:"center"}}>
          <p style={{fontSize:"12px",color:"rgba(255,255,255,0.28)",maxWidth:"860px",margin:"0 auto",lineHeight:"1.7"}}>
            <strong style={{color:"rgba(255,255,255,0.42)"}}>Educational Disclaimer:</strong> New World Education is an AI-powered platform designed solely for educational purposes. All content provided by Starky AI Tutor is intended to support and supplement learning only. Student results, grades, and academic outcomes are entirely dependent on each individual student's own effort, dedication, and application. New World Education does not guarantee specific academic results. Use of this platform does not replace formal schooling, qualified teachers, or official examination preparation advice.
          </p>
        </div>
        <div style={{padding:"28px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"16px"}}>
          <div>
            <div style={{fontWeight:"900",fontSize:"17px",marginBottom:"4px"}}>New<span style={{color:"#63D2FF"}}>World</span> <span style={{color:"#A8E063",fontSize:"11px",letterSpacing:"1px"}}>EDUCATION</span></div>
            <div style={{fontSize:"11px",color:"rgba(255,255,255,0.28)"}}>🌍 World's No.1 AI Educational Resource · KG to A Levels · 16 Languages · Free</div>
          </div>
          <div style={{display:"flex",gap:"22px",alignItems:"center",flexWrap:"wrap"}}>
            {["Privacy","Terms"].map(item=>(
              <span key={item} style={{fontSize:"13px",color:"rgba(255,255,255,0.32)",cursor:"pointer"}}>{item}</span>
            ))}
            <a href="mailto:khurram@newworld.education" style={{fontSize:"13px",color:"rgba(255,255,255,0.32)",textDecoration:"none"}}>Contact</a>
            <span style={{fontSize:"13px",color:"rgba(255,255,255,0.32)",cursor:"pointer"}}>News</span>
          </div>
        </div>
        <div style={{padding:"14px 40px 24px",textAlign:"center",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
          <p style={{fontSize:"12px",color:"rgba(255,255,255,0.2)",margin:0}}>
            Founded & built by <span style={{color:"rgba(255,255,255,0.42)",fontWeight:"700"}}>Khurram Badar</span>
            <span style={{margin:"0 8px",opacity:0.3}}>·</span>
            <a href="mailto:khurram@newworld.education" style={{color:"rgba(99,210,255,0.45)",textDecoration:"none"}}>khurram@newworld.education</a>
            <span style={{margin:"0 8px",opacity:0.3}}>·</span>
            © {new Date().getFullYear()} New World Education. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
    </>
  );
}
