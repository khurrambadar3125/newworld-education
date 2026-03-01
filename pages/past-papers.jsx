// pages/past-papers.jsx
// ─────────────────────────────────────────────────────────────────────────────
// PAST PAPERS HUB — ALL FEATURES COMPLETE:
// 1. CURATED DIRECTORY  — GCEGuide/PapaCambridge links by subject
// 2. AI STUDY COMPANION — paste questions, get worked solutions + mark scheme
// 3. PDF UPLOAD         — upload past paper PDF → AI reads & works it live
// 4. PROGRESS TRACKING  — localStorage tracks sessions, topics, weak spots
// 5. STUDY PLAN         — date picker → day-by-day revision schedule from AI
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import { useSessionLimit, TrialBanner, UpgradeModal } from "../utils/useSessionLimit";
import Head from "next/head";

// ── PROGRESS STORAGE ─────────────────────────────────────────────────────────
const PROGRESS_KEY = "nw_progress";
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); } catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch {}
}
function recordSubjectSession(subjectId, topicLabel) {
  const p = loadProgress();
  if (!p[subjectId]) p[subjectId] = { sessions: 0, topics: [], lastStudied: null };
  p[subjectId].sessions += 1;
  p[subjectId].lastStudied = new Date().toISOString().split("T")[0];
  if (topicLabel && !p[subjectId].topics.includes(topicLabel)) {
    p[subjectId].topics = [...p[subjectId].topics, topicLabel];
  }
  saveProgress(p);
  return p;
}

// ── SUBJECT DATABASE ─────────────────────────────────────────────────────────
const SUBJECTS = {
  olevel: [
    { id:"o-maths",     name:"Mathematics D",    code:"4024", emoji:"🔢", color:"#63D2FF",
      gceguide: "https://papers.gceguide.com/O%20Levels/Mathematics%20D%20(4024)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/o-level/mathematics-d-4024",
      topTopics:["Algebra & quadratics","Trigonometry","Coordinate geometry","Statistics & probability","Matrices","Transformations","Mensuration"],
      highFreq: ["Trigonometry","Algebra","Statistics"],
      commandWords:["Calculate","Show that","Find","Prove"],
      examinerTip:"Show ALL working — method marks are awarded even if the final answer is wrong. Never skip steps." },
    { id:"o-physics",   name:"Physics",           code:"5054", emoji:"⚛️", color:"#A8E063",
      gceguide: "https://papers.gceguide.com/O%20Levels/Physics%20(5054)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/o-level/physics-5054",
      topTopics:["Forces & motion","Electricity & circuits","Waves & light","Thermal physics","Magnetism","Nuclear physics"],
      highFreq: ["Electricity","Forces & motion","Waves"],
      commandWords:["State","Explain","Describe","Calculate","Define"],
      examinerTip:"State = one word/phrase. Explain = 'because'. Describe = detail. Wrong verb costs marks." },
    { id:"o-chemistry", name:"Chemistry",          code:"5070", emoji:"🧪", color:"#C77DFF",
      gceguide: "https://papers.gceguide.com/O%20Levels/Chemistry%20(5070)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/o-level/chemistry-5070",
      topTopics:["Atomic structure","Bonding","Acids & bases","Redox reactions","Organic chemistry","Rates of reaction","Periodic table"],
      highFreq: ["Organic chemistry","Acids & bases","Redox"],
      commandWords:["State","Describe","Explain","Predict"],
      examinerTip:"Organic chemistry appears in BOTH papers every year. Master alkanes, alkenes, alcohols and polymers." },
    { id:"o-biology",   name:"Biology",            code:"5090", emoji:"🧬", color:"#FF8C69",
      gceguide: "https://papers.gceguide.com/O%20Levels/Biology%20(5090)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/o-level/biology-5090",
      topTopics:["Cell biology","Transport in plants & animals","Respiration & photosynthesis","Reproduction","Genetics & inheritance","Ecology","Biotechnology"],
      highFreq: ["Genetics","Transport","Respiration/Photosynthesis"],
      commandWords:["State","Describe","Explain","Suggest"],
      examinerTip:"Genetics questions appear every single year. Punnett squares and inheritance — non-negotiable." },
    { id:"o-english",   name:"English Language",   code:"1123", emoji:"📖", color:"#FFC300",
      gceguide: "https://papers.gceguide.com/O%20Levels/English%20Language%20(1123)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/o-level/english-language-1123",
      topTopics:["Reading comprehension","Summary writing","Directed writing","Narrative composition","Descriptive composition"],
      highFreq: ["Summary writing","Directed writing"],
      commandWords:["Summarise","Explain","Describe","Compare"],
      examinerTip:"Summary writing: use YOUR OWN words — never copy from the passage. Aim for exactly the word count asked." },
    { id:"o-urdu",      name:"Urdu",               code:"3247", emoji:"✍️", color:"#63D2FF",
      gceguide: "https://papers.gceguide.com/O%20Levels/Urdu%20(3247)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/o-level/urdu-3247",
      topTopics:["Reading comprehension","Essay writing","Letter writing","Summary"],
      highFreq: ["Essay writing","Comprehension"],
      commandWords:["لکھیں","بیان کریں","خلاصہ کریں"],
      examinerTip:"مقالے میں ابتداء، تفصیل اور خاتمہ واضح ہونا ضروری ہے۔ ہر پیراگراف ایک خیال پر ہو۔" },
    { id:"o-islamiyat", name:"Islamiyat",           code:"2058", emoji:"☪️", color:"#52C97A",
      gceguide: "https://papers.gceguide.com/O%20Levels/Islamiyat%20(2058)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/o-level/islamiyat-2058",
      topTopics:["Life of the Prophet ﷺ","Quran — selected passages","Hadith — selected","The Rightly-Guided Caliphs","Islamic practices"],
      highFreq: ["Life of Prophet ﷺ","Quranic passages","Hadith"],
      commandWords:["Describe","Explain","How does this teach Muslims?"],
      examinerTip:"Always end with 'This teaches Muslims that...' — it earns the evaluation mark most students miss." },
    { id:"o-history",   name:"History",             code:"2147", emoji:"🏛️", color:"#FF6B6B",
      gceguide: "https://papers.gceguide.com/O%20Levels/History%20(2147)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/o-level/history-2147",
      topTopics:["Source analysis","WWI causes","WWII causes","Cold War","League of Nations","Indian independence"],
      highFreq: ["Source questions","Causation essays"],
      commandWords:["How far do you agree?","Why?","Describe","What does Source A tell us?"],
      examinerTip:"Source questions: cross-reference sources with each other AND your own knowledge. Never treat one source alone." },
    { id:"o-economics", name:"Economics",           code:"2281", emoji:"📊", color:"#FFC300",
      gceguide: "https://papers.gceguide.com/O%20Levels/Economics%20(2281)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/o-level/economics-2281",
      topTopics:["Supply & demand","Market structures","Macroeconomics","International trade","Government policies","Labour market"],
      highFreq: ["Supply & demand diagrams","Evaluation questions"],
      commandWords:["Define","Explain","Discuss","Analyse"],
      examinerTip:"Every 'discuss' needs BOTH sides + a conclusion. One-sided answers cannot exceed 6/10." },
  ],
  alevel: [
    { id:"a-maths",     name:"Mathematics",        code:"9709", emoji:"🔢", color:"#63D2FF",
      gceguide: "https://papers.gceguide.com/A%20Levels/Mathematics%20(9709)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/as-and-a-level/mathematics-9709",
      topTopics:["Pure 1: Functions, Differentiation, Integration","Pure 2: Logarithms, Trigonometry","Pure 3: Complex numbers, Differential equations","Statistics 1 & 2","Mechanics 1 & 2"],
      highFreq: ["Calculus","Trigonometry","Statistics"],
      commandWords:["Find","Show that","Hence","Prove"],
      examinerTip:"'Hence' means use your previous answer. If you can't see how, you made an error above." },
    { id:"a-physics",   name:"Physics",            code:"9702", emoji:"⚛️", color:"#A8E063",
      gceguide: "https://papers.gceguide.com/A%20Levels/Physics%20(9702)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/as-and-a-level/physics-9702",
      topTopics:["Mechanics","Electricity","Waves","Thermal physics","Fields","Nuclear physics","Quantum physics","Practical skills"],
      highFreq: ["Practical Paper 3","Mechanics","Electricity"],
      commandWords:["State","Explain","Suggest","Sketch","Calculate"],
      examinerTip:"Paper 3 (practical) = 23 marks. Most marks lost on measurement uncertainty — practise this separately." },
    { id:"a-chemistry", name:"Chemistry",           code:"9701", emoji:"🧪", color:"#C77DFF",
      gceguide: "https://papers.gceguide.com/A%20Levels/Chemistry%20(9701)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/as-and-a-level/chemistry-9701",
      topTopics:["Organic chemistry mechanisms","Equilibria","Electrochemistry","Acids & bases","Transition metals","Reaction kinetics"],
      highFreq: ["Organic mechanisms","Equilibria","Electrochemistry"],
      commandWords:["Suggest a mechanism","Explain why","Predict","State and explain"],
      examinerTip:"Curly arrows must start from bond or lone pair and point where electrons go. Wrong arrows lose marks." },
    { id:"a-biology",   name:"Biology",             code:"9700", emoji:"🧬", color:"#FF8C69",
      gceguide: "https://papers.gceguide.com/A%20Levels/Biology%20(9700)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/as-and-a-level/biology-9700",
      topTopics:["Cell biology & membranes","DNA & protein synthesis","Genetics & inheritance","Transport","Immunity","Ecology","Biotechnology"],
      highFreq: ["Genetics","DNA/Protein synthesis","Ecology"],
      commandWords:["Describe","Explain","Compare","Suggest"],
      examinerTip:"Comparison questions: parallel structure always — what A does AND what B does for each point." },
    { id:"a-economics", name:"Economics",           code:"9708", emoji:"📊", color:"#FFC300",
      gceguide: "https://papers.gceguide.com/A%20Levels/Economics%20(9708)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/as-and-a-level/economics-9708",
      topTopics:["Microeconomics: elasticity, market failure","Macroeconomics: GDP, inflation","International trade","Development economics","Monetary & fiscal policy"],
      highFreq: ["Evaluation essays","Data response","Market failure"],
      commandWords:["Explain","Analyse","Discuss","Evaluate","To what extent"],
      examinerTip:"Evaluation = A grade. Challenge every argument: 'However, this depends on...' or 'In the long run...'" },
    { id:"a-business",  name:"Business Studies",    code:"9609", emoji:"💼", color:"#63D2FF",
      gceguide: "https://papers.gceguide.com/A%20Levels/Business%20(9609)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/as-and-a-level/business-9609",
      topTopics:["Business organisations & objectives","Marketing","Operations management","Finance & accounting","HR management","Strategy & globalisation"],
      highFreq: ["Case studies","Financial ratio analysis","Strategy questions"],
      commandWords:["Recommend","Analyse","Discuss","Evaluate"],
      examinerTip:"All papers require case study data. Generic answers without referencing the business score poorly." },
    { id:"a-accounts",  name:"Accounting",          code:"9706", emoji:"📒", color:"#A8E063",
      gceguide: "https://papers.gceguide.com/A%20Levels/Accounting%20(9706)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/as-and-a-level/accounting-9706",
      topTopics:["Financial statements","Partnership accounts","Limited company accounts","Cash flow statements","Cost & management accounting","Budgeting & variance"],
      highFreq: ["Income statements","Cash flow","Management accounting"],
      commandWords:["Prepare","Calculate","Explain","Advise"],
      examinerTip:"Always balance your accounts. If it doesn't balance, find the error rather than leaving it unbalanced." },
    { id:"a-english",   name:"English Lang & Lit",  code:"9093", emoji:"📝", color:"#FF6B6B",
      gceguide: "https://papers.gceguide.com/A%20Levels/English%20Language%20(9093)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/as-and-a-level/english-language-9093",
      topTopics:["Language analysis","Directed writing","Coursework","Prose & poetry analysis","Drama"],
      highFreq: ["Language analysis","Directed writing"],
      commandWords:["Analyse","Compare","Comment on","Explore"],
      examinerTip:"Embed quotations: introduce it, quote it, analyse the specific language choice. Never drop a quote alone." },
    { id:"a-cs",        name:"Computer Science",    code:"9618", emoji:"💻", color:"#C77DFF",
      gceguide: "https://papers.gceguide.com/A%20Levels/Computer%20Science%20(9618)/",
      papacam:  "https://pastpapers.papacambridge.com/papers/caie/as-and-a-level/computer-science-9618",
      topTopics:["Data structures","Algorithms & pseudocode","OOP","Databases","Networking & security","Systems software"],
      highFreq: ["Pseudocode tracing","OOP","Networking"],
      commandWords:["Trace","Write","Describe","Explain"],
      examinerTip:"Pseudocode trace: follow the code EXACTLY, never what you think it should do." },
  ],
};

// ── AI SYSTEM PROMPT ─────────────────────────────────────────────────────────
function buildSystemPrompt(level, subject) {
  const lvl  = level === "olevel" ? "Cambridge O Level" : "Cambridge A Level";
  const subj = subject ? `${subject.name} (${subject.code})` : "Cambridge examinations";
  return `You are Starky, an expert ${lvl} ${subj} AI tutor who knows Cambridge mark schemes deeply.

YOUR MISSION: Help students get the highest possible grades using exactly what Cambridge examiners reward.

CAPABILITIES:
- Work through any past paper question (typed OR from uploaded PDF) — show every step
- Break down mark schemes: explain WHY each mark point earns marks  
- Create authentic Cambridge practice questions with full mark schemes
- Build personalised day-by-day revision plans when given an exam date
- Explain any syllabus concept clearly with worked examples
- Identify and fix common Cambridge student mistakes
- Teach command word techniques (state/describe/explain/analyse/evaluate/discuss)

MARK SCHEME LANGUAGE:
- You know exactly what Cambridge examiners want to read
- You clearly distinguish: "state" (one word/phrase) vs "describe" (detail) vs "explain" (because) vs "analyse" (examine) vs "evaluate" (judge both sides)

WORKED SOLUTIONS FORMAT:
1. Identify question type and marks available
2. Work through each step clearly
3. State which step earns which mark
4. Add an examiner tip at the end

PDF PAPERS: If a student uploads a PDF, read ALL questions and ask which to work through (or work through all if asked).

STUDY PLANS: When given an exam date and days remaining, produce a detailed week-by-week or day-by-day plan. Include: topic schedule, past paper practice days, revision days, and rest before exam. Format clearly.

Use the student's language (Arabic/Urdu) when they write in it.`;
}

// ── PROMPT TILES ─────────────────────────────────────────────────────────────
function promptTiles(subject) {
  return [
    { emoji:"📋", label:"Work through a question",    prompt:`I'm going to paste a past paper question. Work through it fully, show all steps, and tell me which step earns which mark.` },
    { emoji:"🔍", label:"Break down a mark scheme",   prompt:`I'm going to paste a mark scheme. Explain WHY each mark point earns marks and what the examiner is looking for.` },
    { emoji:"📊", label:"Topic frequency analysis",   prompt:`For ${subject?.name||"this subject"}, which topics appeared most frequently over the last 30 years? Which are almost guaranteed to appear?` },
    { emoji:"✍️", label:"Generate practice question", prompt:`Create an authentic Cambridge ${subject?.name||"exam"} question at exam difficulty, with a full mark scheme.` },
    { emoji:"❓", label:"Why is my answer wrong?",    prompt:`My answer was: [paste]. The mark scheme says: [paste]. Explain exactly where I went wrong and what I should have written.` },
    { emoji:"💡", label:"Explain this concept",       prompt:`Please explain [topic] from Cambridge ${subject?.name||"syllabus"} from scratch with a worked example.` },
    { emoji:"🎯", label:"Command word coaching",      prompt:`Teach me the exact difference between "state", "describe", "explain", "analyse", "evaluate" in Cambridge ${subject?.name||"exams"} with examples.` },
    { emoji:"📄", label:"I uploaded a PDF paper",     prompt:`I've uploaded a past paper PDF. Please read all the questions, then tell me which ones you can see, and ask which I'd like to work through.` },
  ];
}

// ── STUDY PLAN MODAL ──────────────────────────────────────────────────────────
function StudyPlanModal({ subject, level, onClose, onSend }) {
  const [examDate, setExamDate]   = useState("");
  const [hoursDay, setHoursDay]   = useState("1");
  const [focusAreas, setFocus]    = useState([]);
  const today = new Date().toISOString().split("T")[0];

  const daysLeft = examDate
    ? Math.max(0, Math.floor((new Date(examDate) - new Date()) / 86400000))
    : null;

  const toggle = (t) => setFocus(p => p.includes(t) ? p.filter(x=>x!==t) : [...p,t]);

  const generate = () => {
    if (!examDate) return;
    const focusNote = focusAreas.length > 0
      ? `The student wants extra focus on: ${focusAreas.join(", ")}.`
      : `Prioritise high-frequency topics: ${subject.highFreq.join(", ")}.`;
    const prompt = `I have my Cambridge ${level==="olevel"?"O Level":"A Level"} ${subject.name} exam on ${examDate}. That is ${daysLeft} days from today (${today}).

Please build me a detailed day-by-day revision plan for all ${daysLeft} days.

${focusNote}

All syllabus topics to cover: ${subject.topTopics.join(", ")}.

Study hours per day: ${hoursDay} hour(s).

Format the plan as:
- Group by week (Week 1, Week 2, etc.)
- Each day: topic to study, what activity (notes / past paper questions / mark scheme review), time to spend
- Include at least 2 full past paper practice days
- Final 3 days: review and rest only, no new content
- End with an encouragement message for the exam

Make it realistic and achievable.`;
    onSend(prompt);
    onClose();
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"linear-gradient(135deg,#0E1635,#0A1228)", border:`1px solid ${subject.color}44`, borderRadius:24, padding:32, width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto" }}>
        
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
          <div>
            <h2 style={{ margin:"0 0 4px", fontWeight:900, fontSize:22, fontFamily:"'Nunito',sans-serif" }}>📅 Build My Study Plan</h2>
            <p style={{ margin:0, color:"rgba(255,255,255,0.4)", fontSize:13 }}>{subject.emoji} {subject.name} · {level==="olevel"?"O Level":"A Level"}</p>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)", border:"none", color:"#fff", borderRadius:"50%", width:32, height:32, cursor:"pointer", fontSize:16, fontFamily:"sans-serif", flexShrink:0 }}>✕</button>
        </div>

        {/* Exam date */}
        <div style={{ marginBottom:20 }}>
          <label style={{ display:"block", fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.45)", letterSpacing:1, marginBottom:8 }}>EXAM DATE *</label>
          <input type="date" value={examDate} min={today} onChange={e=>setExamDate(e.target.value)}
            style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:`1px solid ${examDate?subject.color+"66":"rgba(255,255,255,0.15)"}`, borderRadius:12, padding:"12px 16px", color:"#fff", fontSize:15, fontFamily:"'Nunito',sans-serif", boxSizing:"border-box", colorScheme:"dark" }} />
          {daysLeft !== null && (
            <div style={{ marginTop:8, fontSize:13, fontWeight:700, color:daysLeft<14?"#FF6B6B":"#A8E063" }}>
              {daysLeft===0?"⚠️ Exam is today!": daysLeft===1?"⚠️ Exam is tomorrow!": daysLeft<14?`⚠️ ${daysLeft} days to go — let's make every one count`:`✅ ${daysLeft} days — great, time to plan well`}
            </div>
          )}
        </div>

        {/* Hours per day */}
        <div style={{ marginBottom:20 }}>
          <label style={{ display:"block", fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.45)", letterSpacing:1, marginBottom:8 }}>STUDY HOURS PER DAY</label>
          <div style={{ display:"flex", gap:8 }}>
            {["0.5","1","1.5","2","3","4+"].map(h=>(
              <button key={h} onClick={()=>setHoursDay(h)} style={{
                flex:1, padding:"10px 4px", borderRadius:10, cursor:"pointer",
                fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:13,
                background: hoursDay===h?`${subject.color}22`:"rgba(255,255,255,0.05)",
                border:`2px solid ${hoursDay===h?subject.color:"rgba(255,255,255,0.1)"}`,
                color: hoursDay===h?subject.color:"rgba(255,255,255,0.55)",
              }}>{h}h</button>
            ))}
          </div>
        </div>

        {/* Focus areas */}
        <div style={{ marginBottom:24 }}>
          <label style={{ display:"block", fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.45)", letterSpacing:1, marginBottom:8 }}>
            FOCUS AREAS <span style={{ fontWeight:600, color:"rgba(255,255,255,0.25)" }}>(optional — tap topics you find hardest)</span>
          </label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {subject.topTopics.map(t=>(
              <button key={t} onClick={()=>toggle(t)} style={{
                padding:"6px 12px", borderRadius:20, cursor:"pointer",
                fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:11,
                background: focusAreas.includes(t)?`${subject.color}25`:"rgba(255,255,255,0.05)",
                border:`1px solid ${focusAreas.includes(t)?subject.color:"rgba(255,255,255,0.12)"}`,
                color: focusAreas.includes(t)?subject.color:"rgba(255,255,255,0.5)",
              }}>{focusAreas.includes(t)?"✓ ":""}{t}</button>
            ))}
          </div>
        </div>

        {/* Generate */}
        <button onClick={generate} disabled={!examDate} style={{
          width:"100%", padding:"16px", borderRadius:14, border:"none",
          background: examDate?`linear-gradient(135deg,${subject.color},${subject.color}BB)`:"rgba(255,255,255,0.08)",
          color: examDate?"#060B20":"rgba(255,255,255,0.3)",
          fontWeight:900, fontSize:16, cursor:examDate?"pointer":"default",
          fontFamily:"'Nunito',sans-serif",
        }}>
          {examDate?`📅 Generate My ${daysLeft}-Day Revision Plan →`:"Select your exam date first"}
        </button>
        <p style={{ textAlign:"center", marginTop:10, fontSize:11, color:"rgba(255,255,255,0.25)", fontFamily:"'Nunito',sans-serif" }}>
          Starky will build a complete personalised schedule
        </p>
      </div>
    </div>
  );
}

// ── PROGRESS PANEL ────────────────────────────────────────────────────────────
function ProgressPanel({ progress, subject }) {
  const subData = subject ? (progress[subject.id] || null) : null;
  const total   = Object.values(progress).reduce((s,d)=>s+(d.sessions||0),0);
  const subjectCount = Object.keys(progress).length;

  if (total === 0) return (
    <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"14px" }}>
      <div style={{ fontSize:10, fontWeight:900, color:"rgba(255,255,255,0.3)", letterSpacing:1, marginBottom:8 }}>📈 MY PROGRESS</div>
      <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", lineHeight:1.65 }}>
        Your study sessions are tracked automatically here. Ask Starky a question to begin! 🌟
      </div>
    </div>
  );

  const notStudied = subject && subData
    ? subject.topTopics.filter(t => !subData.topics.some(st => st.toLowerCase().includes(t.split(" ")[0].toLowerCase())))
    : [];

  return (
    <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"14px" }}>
      <div style={{ fontSize:10, fontWeight:900, color:"rgba(255,255,255,0.3)", letterSpacing:1, marginBottom:12 }}>📈 MY PROGRESS</div>

      {/* Overall stats */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <div style={{ flex:1, background:`${subject?.color||"#63D2FF"}12`, border:`1px solid ${subject?.color||"#63D2FF"}28`, borderRadius:12, padding:"10px 8px", textAlign:"center" }}>
          <div style={{ fontSize:22, fontWeight:900, color:subject?.color||"#63D2FF" }}>{total}</div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", fontWeight:700 }}>SESSIONS</div>
        </div>
        <div style={{ flex:1, background:"rgba(168,224,99,0.08)", border:"1px solid rgba(168,224,99,0.2)", borderRadius:12, padding:"10px 8px", textAlign:"center" }}>
          <div style={{ fontSize:22, fontWeight:900, color:"#A8E063" }}>{subjectCount}</div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", fontWeight:700 }}>SUBJECTS</div>
        </div>
      </div>

      {/* This subject detail */}
      {subData && subject && (
        <div style={{ marginBottom:10 }}>
          <div style={{ fontSize:11, fontWeight:800, color:subject.color, marginBottom:6 }}>
            {subject.emoji} {subject.name} — {subData.sessions} session{subData.sessions!==1?"s":""}
          </div>
          {subData.topics.length > 0 && (
            <>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginBottom:4 }}>Topics studied:</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:6 }}>
                {subData.topics.slice(0,6).map(t=>(
                  <span key={t} style={{ background:`${subject.color}15`, border:`1px solid ${subject.color}30`, borderRadius:8, padding:"2px 7px", fontSize:10, fontWeight:700, color:subject.color }}>✓ {t}</span>
                ))}
              </div>
            </>
          )}
          {subData.lastStudied && (
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.2)" }}>Last studied: {subData.lastStudied}</div>
          )}
        </div>
      )}

      {/* Not yet practised */}
      {notStudied.length > 0 && (
        <div style={{ background:"rgba(255,107,107,0.07)", border:"1px solid rgba(255,107,107,0.2)", borderRadius:10, padding:"10px 12px" }}>
          <div style={{ fontSize:10, fontWeight:900, color:"#FF6B6B", marginBottom:5 }}>⚠️ NOT YET PRACTISED</div>
          {notStudied.slice(0,4).map(t=>(
            <div key={t} style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginBottom:2 }}>• {t}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function PastPapersPage() {
  const [level,   setLevel]   = useState(null);
  const [subject, setSubject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showUpgrade,   setShowUpgrade]   = useState(false);
  const [showStudyPlan, setShowStudyPlan] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState({});

  // PDF state
  const [pdfData,    setPdfData]    = useState(null);   // { base64, name }
  const [pdfLoading, setPdfLoading] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef   = useRef(null);

  const { callsUsed, callsLeft, limitReached, trialActive, trialPct, recordCall } = useSessionLimit();

  useEffect(()=>{
    const fn=()=>setIsMobile(window.innerWidth<768);
    fn(); window.addEventListener("resize",fn);
    return ()=>window.removeEventListener("resize",fn);
  },[]);
  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,loading]);
  useEffect(()=>{ setProgress(loadProgress()); },[]);

  // ── PDF UPLOAD ───────────────────────────────────────────────────────────
  const handlePdfUpload = (file) => {
    if (!file || file.type!=="application/pdf") { alert("Please select a PDF file."); return; }
    if (file.size > 10*1024*1024) { alert("PDF must be under 10MB. Try a smaller file or paste the question text instead."); return; }
    setPdfLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => { setPdfData({ base64: e.target.result.split(",")[1], name: file.name }); setPdfLoading(false); };
    reader.onerror = () => { setPdfLoading(false); alert("Could not read file — try again."); };
    reader.readAsDataURL(file);
  };
  const clearPdf = () => { setPdfData(null); if(fileInputRef.current) fileInputRef.current.value=""; };

  // ── SELECT SUBJECT ────────────────────────────────────────────────────────
  const selectSubject = (subj) => {
    setSubject(subj);
    setMessages([{
      role:"assistant",
      content:`Hi! I'm Starky, your ${level==="olevel"?"O Level":"A Level"} ${subj.name} specialist. 🎓\n\nI know every past paper pattern, exactly what Cambridge examiners reward, and the most common mistakes students make.\n\n**To get started:**\n• Tap any Quick Start tile below\n• Paste a question directly\n• Upload a past paper PDF 📤\n• Tap 📅 Build My Study Plan for a day-by-day revision schedule`,
    }]);
  };

  // ── SEND MESSAGE ──────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const txt = (text||input).trim();
    if ((!txt && !pdfData) || loading) return;
    if (limitReached) { setShowUpgrade(true); return; }
    recordCall();

    // Track progress in localStorage
    const newProg = recordSubjectSession(subject?.id, null);
    setProgress(newProg);

    const msgText = txt || "(Please read the uploaded PDF and list all questions you can see)";
    setInput("");
    setLoading(true);

    // Build user message for display
    const displayMsg = { role:"user", content: pdfData?`📄 [${pdfData.name}] ${msgText}`:msgText };
    const prevMessages = [...messages, displayMsg];
    setMessages(prevMessages);

    // Build API messages — last message may include PDF
    const apiMessages = prevMessages.map((m, i) => {
      if (i === prevMessages.length-1 && pdfData) {
        return {
          role:"user",
          content:[
            { type:"document", source:{ type:"base64", media_type:"application/pdf", data:pdfData.base64 } },
            { type:"text", text:msgText },
          ],
        };
      }
      return { role:m.role, content:typeof m.content==="string"?m.content:msgText };
    });

    clearPdf();

    try {
      const res  = await fetch("/api/chat",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-haiku-4-5-20251001", max_tokens:1500, system:buildSystemPrompt(level,subject), messages:apiMessages }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Something went wrong — try again!";
      setMessages(prev=>[...prev,{role:"assistant",content:reply}]);
    } catch {
      setMessages(prev=>[...prev,{role:"assistant",content:"Something went wrong. Please try again!"}]);
    }
    setLoading(false);
  };

  // ── SHARED STYLES ────────────────────────────────────────────────────────
  const S = {
    page:{ minHeight:"100vh", background:"linear-gradient(135deg,#060B20 0%,#0C1A3A 60%,#060B20 100%)", fontFamily:"'Nunito',sans-serif", color:"#fff" },
    hdr: { padding:isMobile?"12px 16px":"14px 28px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between" },
    card:{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:18 },
    btn: { border:"none", cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"all 0.15s" },
  };
  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
    *{box-sizing:border-box} button:focus{outline:none} input:focus,textarea:focus{outline:none}
    ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:4px}
    @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(1);opacity:0.5}
  `;

  // ── LEVEL SELECTOR ────────────────────────────────────────────────────────
  if (!level) return (
    <div style={S.page}><style>{CSS}</style>
      <header style={S.hdr}>
        <a href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:18 }}>🌍</span>
          <span style={{ fontWeight:900, fontSize:15, color:"#fff" }}>NewWorld <span style={{ color:"#63D2FF" }}>EDUCATION</span></span>
        </a>
        <a href="/demo" style={{ color:"rgba(255,255,255,0.4)", fontSize:12, textDecoration:"none", fontWeight:700 }}>← Back to Starky</a>
      </header>
      <div style={{ maxWidth:680, margin:"0 auto", padding:isMobile?"32px 16px":"56px 24px", textAlign:"center" }}>
        <div style={{ fontSize:isMobile?48:64, marginBottom:12 }}>📚</div>
        <h1 style={{ fontSize:isMobile?26:38, fontWeight:900, margin:"0 0 12px", lineHeight:1.2 }}>
          Past Papers <span style={{ color:"#A8E063" }}>Hub</span>
        </h1>
        <p style={{ fontSize:isMobile?14:16, color:"rgba(255,255,255,0.5)", maxWidth:480, margin:"0 auto 36px", lineHeight:1.75 }}>
          30 years of Cambridge papers, AI-worked solutions, PDF upload, and a personalised day-by-day study plan. No printing needed.
        </p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:48 }}>
          {["📄 30+ years of papers","📤 Upload PDF papers","🤖 AI mark scheme coach","📊 Topic frequency analysis","📅 Day-by-day study plan","📈 Progress tracking","🆓 Free to start"].map(p=>(
            <span key={p} style={{ background:"rgba(168,224,99,0.1)", border:"1px solid rgba(168,224,99,0.25)", borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:700, color:"#A8E063" }}>{p}</span>
          ))}
        </div>
        <div style={{ fontSize:13, fontWeight:900, color:"rgba(255,255,255,0.35)", letterSpacing:2, marginBottom:16 }}>CHOOSE YOUR LEVEL</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, maxWidth:420, margin:"0 auto" }}>
          {[{ id:"olevel",label:"O Level",sub:"Ages 14–16 · Cambridge CAIE",emoji:"📗",color:"#A8E063" },
            { id:"alevel",label:"A Level",sub:"Ages 16–18 · Cambridge CAIE",emoji:"📘",color:"#63D2FF" }].map(l=>(
            <button key={l.id} onClick={()=>setLevel(l.id)}
              style={{ ...S.btn, background:`${l.color}10`, border:`2px solid ${l.color}40`, borderRadius:22, padding:isMobile?"24px 16px":"30px 20px", color:"#fff" }}
              onMouseEnter={e=>{e.currentTarget.style.background=`${l.color}20`;e.currentTarget.style.borderColor=l.color;e.currentTarget.style.transform="translateY(-3px)";}}
              onMouseLeave={e=>{e.currentTarget.style.background=`${l.color}10`;e.currentTarget.style.borderColor=`${l.color}40`;e.currentTarget.style.transform="none";}}>
              <div style={{ fontSize:44, marginBottom:10 }}>{l.emoji}</div>
              <div style={{ fontWeight:900, fontSize:24, color:l.color, marginBottom:4 }}>{l.label}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontWeight:600 }}>{l.sub}</div>
            </button>
          ))}
        </div>
        {trialActive&&<div style={{marginTop:40}}><TrialBanner callsUsed={callsUsed} callsLeft={callsLeft} limitReached={limitReached} trialPct={trialPct}/></div>}
      </div>
    </div>
  );

  // ── SUBJECT SELECTOR ──────────────────────────────────────────────────────
  const subjects   = SUBJECTS[level];
  const levelLabel = level==="olevel"?"O Level":"A Level";
  const levelColor = level==="olevel"?"#A8E063":"#63D2FF";

  if (!subject) return (
    <div style={S.page}><style>{CSS}</style>
      <header style={S.hdr}>
        <a href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:18 }}>🌍</span>
          <span style={{ fontWeight:900, fontSize:15, color:"#fff" }}>NewWorld <span style={{ color:"#63D2FF" }}>EDUCATION</span></span>
        </a>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <button onClick={()=>setLevel(null)} style={{ ...S.btn, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"6px 14px", color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:700 }}>← Change level</button>
          <a href="/demo" style={{ color:"rgba(255,255,255,0.4)", fontSize:12, textDecoration:"none", fontWeight:700 }}>← Starky</a>
        </div>
      </header>
      <div style={{ maxWidth:820, margin:"0 auto", padding:isMobile?"24px 16px":"40px 24px" }}>
        <div style={{ marginBottom:28, textAlign:"center" }}>
          <div style={{ display:"inline-block", background:`${levelColor}15`, border:`1px solid ${levelColor}35`, borderRadius:20, padding:"6px 18px", fontSize:13, fontWeight:800, color:levelColor, marginBottom:12 }}>Cambridge {levelLabel}</div>
          <h2 style={{ fontSize:isMobile?22:28, fontWeight:900, margin:"0 0 6px" }}>Choose your subject</h2>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", margin:0 }}>AI tutor · PDF upload · study plan · progress tracking</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(3,1fr)", gap:10 }}>
          {subjects.map(subj=>{
            const subProg = progress[subj.id];
            return (
              <button key={subj.id} onClick={()=>selectSubject(subj)}
                style={{ ...S.btn, ...S.card, padding:isMobile?"16px 12px":"20px 16px", textAlign:"left", color:"#fff", position:"relative" }}
                onMouseEnter={e=>{e.currentTarget.style.background=`${subj.color}12`;e.currentTarget.style.borderColor=`${subj.color}45`;e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.09)";e.currentTarget.style.transform="none";}}>
                {subProg&&<div style={{ position:"absolute", top:10, right:10, background:`${subj.color}20`, border:`1px solid ${subj.color}40`, borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:800, color:subj.color }}>{subProg.sessions} sessions</div>}
                <div style={{ fontSize:isMobile?28:32, marginBottom:8 }}>{subj.emoji}</div>
                <div style={{ fontWeight:900, fontSize:isMobile?13:15, color:subj.color, marginBottom:2 }}>{subj.name}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", fontWeight:600, marginBottom:10 }}>{subj.code}</div>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                  {subj.highFreq.slice(0,2).map(t=>(
                    <span key={t} style={{ background:`${subj.color}15`, border:`1px solid ${subj.color}30`, borderRadius:8, padding:"2px 7px", fontSize:10, fontWeight:700, color:subj.color }}>🔥 {t}</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
        {trialActive&&<div style={{marginTop:24}}><TrialBanner callsUsed={callsUsed} callsLeft={callsLeft} limitReached={limitReached} trialPct={trialPct}/></div>}
      </div>
    </div>
  );

  // ── MAIN STUDY INTERFACE ──────────────────────────────────────────────────
  return (
    <div style={S.page}><style>{CSS}</style>

      {/* Modals */}
      {showStudyPlan && <StudyPlanModal subject={subject} level={level} onClose={()=>setShowStudyPlan(false)} onSend={sendMessage}/>}
      {showUpgrade   && <UpgradeModal onClose={()=>setShowUpgrade(false)}/>}

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="application/pdf" style={{display:"none"}} onChange={e=>handlePdfUpload(e.target.files[0])}/>

      {/* Header */}
      <header style={S.hdr}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <a href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}>
            <span style={{fontSize:16}}>🌍</span>
            <span style={{ fontWeight:900, fontSize:isMobile?13:15, color:"#fff" }}>NewWorld</span>
          </a>
          {!isMobile&&<><span style={{color:"rgba(255,255,255,0.2)"}}>›</span><span style={{color:"rgba(255,255,255,0.5)",fontSize:13}}>Past Papers Hub</span></>}
          <span style={{color:"rgba(255,255,255,0.2)"}}>›</span>
          <span style={{ fontWeight:800, fontSize:13, color:subject.color }}>{subject.emoji} {subject.name}</span>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={()=>setShowStudyPlan(true)} style={{ ...S.btn, background:`${subject.color}18`, border:`1px solid ${subject.color}45`, borderRadius:10, padding:"6px 12px", color:subject.color, fontSize:12, fontWeight:800 }}>
            📅 Study Plan
          </button>
          <button onClick={()=>{setSubject(null);setMessages([]);clearPdf();}} style={{ ...S.btn, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"6px 12px", color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700 }}>
            ← Subjects
          </button>
        </div>
      </header>

      {trialActive&&<TrialBanner callsUsed={callsUsed} callsLeft={callsLeft} limitReached={limitReached} trialPct={trialPct} compact/>}

      {/* Layout */}
      <div style={{ maxWidth:980, margin:"0 auto", padding:isMobile?"12px":"20px 24px", display:"grid", gridTemplateColumns:isMobile?"1fr":"272px 1fr", gap:16 }}>

        {/* LEFT SIDEBAR */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

          {/* Subject info */}
          <div style={{ ...S.card, background:`${subject.color}0E`, borderColor:`${subject.color}35`, padding:"16px 14px" }}>
            <div style={{fontSize:26,marginBottom:6}}>{subject.emoji}</div>
            <div style={{ fontWeight:900, fontSize:16, color:subject.color, marginBottom:2 }}>{subject.name}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:12 }}>{levelLabel} · Code {subject.code}</div>
            <div style={{ fontSize:10, fontWeight:900, color:"rgba(255,255,255,0.35)", letterSpacing:1, marginBottom:6 }}>🔥 HIGH-FREQUENCY TOPICS</div>
            {subject.highFreq.map(t=>(
              <div key={t} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:subject.color, flexShrink:0 }}/>
                <span style={{ fontSize:12, fontWeight:600 }}>{t}</span>
              </div>
            ))}
            <div style={{ marginTop:12, padding:"10px 12px", background:"rgba(255,193,0,0.08)", border:"1px solid rgba(255,193,0,0.2)", borderRadius:12 }}>
              <div style={{ fontSize:10, fontWeight:900, color:"#FFC300", marginBottom:4 }}>💡 EXAMINER TIP</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)", lineHeight:1.6 }}>{subject.examinerTip}</div>
            </div>
          </div>

          {/* Download links */}
          <div style={{ ...S.card, padding:"14px" }}>
            <div style={{ fontSize:10, fontWeight:900, color:"rgba(255,255,255,0.35)", letterSpacing:1, marginBottom:8, textTransform:"uppercase" }}>📄 Download Past Papers</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", lineHeight:1.6, marginBottom:10 }}>
              Free papers — open in a new tab, then paste questions here or upload the PDF.
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {[
                { href:subject.gceguide, label:"🗂️ GCE Guide",       sub:"1993–2025 →", bg:"rgba(168,224,99,0.08)",  border:"rgba(168,224,99,0.22)",  c:"#A8E063" },
                { href:subject.papacam,  label:"📂 PapaCambridge",   sub:"All series →", bg:"rgba(99,210,255,0.08)", border:"rgba(99,210,255,0.22)",  c:"#63D2FF" },
                { href:`https://epastpapers.com/cie/${level==="olevel"?"o-level":"a-level"}/`, label:"📁 ePastPapers", sub:"With mark schemes →", bg:"rgba(199,125,255,0.08)", border:"rgba(199,125,255,0.22)", c:"#C77DFF" },
              ].map(l=>(
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                  style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 11px", background:l.bg, border:`1px solid ${l.border}`, borderRadius:10, textDecoration:"none", color:"#fff", fontSize:12, fontWeight:700 }}>
                  <span>{l.label}</span><span style={{fontSize:9,color:l.c}}>{l.sub}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Topics list */}
          <div style={{ ...S.card, padding:"14px" }}>
            <div style={{ fontSize:10, fontWeight:900, color:"rgba(255,255,255,0.35)", letterSpacing:1, marginBottom:10, textTransform:"uppercase" }}>📚 All Syllabus Topics</div>
            {subject.topTopics.map((t,i)=>(
              <div key={t} style={{ display:"flex", alignItems:"flex-start", gap:7, marginBottom:5 }}>
                <span style={{ fontSize:10, color:subject.color, fontWeight:900, flexShrink:0, marginTop:2 }}>{i+1}.</span>
                <button onClick={()=>sendMessage(`Explain "${t}" from Cambridge ${levelLabel} ${subject.name} from scratch with a worked example.`)}
                  style={{ ...S.btn, background:"none", color:"rgba(255,255,255,0.55)", fontSize:11, fontWeight:600, textAlign:"left", padding:0 }}
                  onMouseEnter={e=>{e.currentTarget.style.color="#fff";}}
                  onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.55)";}}>
                  {t}
                </button>
              </div>
            ))}
          </div>

          {/* Progress */}
          <ProgressPanel progress={progress} subject={subject}/>
        </div>

        {/* RIGHT — CHAT */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

          {/* Quick start tiles */}
          <div style={{ ...S.card, padding:"14px 14px 10px" }}>
            <div style={{ fontSize:10, fontWeight:900, color:"rgba(255,255,255,0.35)", letterSpacing:1, marginBottom:10, textTransform:"uppercase" }}>⚡ Quick Start — tap to begin, no typing needed</div>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:7 }}>
              {promptTiles(subject).map(tile=>(
                <button key={tile.label} onClick={()=>sendMessage(tile.prompt)}
                  style={{ ...S.btn, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:12, padding:"11px 9px", color:"#fff", textAlign:"center", fontSize:11, fontWeight:700, lineHeight:1.4 }}
                  onMouseEnter={e=>{e.currentTarget.style.background=`${subject.color}15`;e.currentTarget.style.borderColor=`${subject.color}45`;}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.09)";}}>
                  <div style={{fontSize:20,marginBottom:5}}>{tile.emoji}</div>{tile.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action bar: Study Plan + PDF Upload */}
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setShowStudyPlan(true)}
              style={{ ...S.btn, flex:1, background:`${subject.color}12`, border:`1px solid ${subject.color}35`, borderRadius:14, padding:"12px 16px", color:subject.color, fontWeight:800, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
              onMouseEnter={e=>{e.currentTarget.style.background=`${subject.color}22`;}}
              onMouseLeave={e=>{e.currentTarget.style.background=`${subject.color}12`;}}>
              📅 Build My Study Plan
            </button>
            <button onClick={()=>fileInputRef.current?.click()} disabled={pdfLoading}
              style={{ ...S.btn, flex:1, background:"rgba(199,125,255,0.1)", border:"1px solid rgba(199,125,255,0.3)", borderRadius:14, padding:"12px 16px", color:"#C77DFF", fontWeight:800, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {pdfLoading?<span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⏳</span>:"📤"}
              {pdfLoading?"Reading PDF...":"Upload Past Paper PDF"}
            </button>
          </div>

          {/* PDF attached badge */}
          {pdfData&&(
            <div style={{ background:"rgba(199,125,255,0.1)", border:"1px solid rgba(199,125,255,0.35)", borderRadius:14, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:"#C77DFF" }}>📄 PDF attached: {pdfData.name}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>Starky will read this paper when you send your next message</div>
              </div>
              <button onClick={clearPdf} style={{ ...S.btn, background:"rgba(255,255,255,0.08)", borderRadius:"50%", width:28, height:28, color:"rgba(255,255,255,0.5)", fontSize:14 }}>✕</button>
            </div>
          )}

          {/* Chat window */}
          <div style={{ ...S.card, overflow:"hidden", display:"flex", flexDirection:"column" }}>
            <div style={{ height:isMobile?340:460, overflowY:"auto", padding:isMobile?14:20, display:"flex", flexDirection:"column", gap:14 }}>
              {messages.map((msg,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start", gap:10 }}>
                  {msg.role==="assistant"&&(
                    <div style={{ width:28, height:28, borderRadius:"50%", background:`${subject.color}20`, border:`1px solid ${subject.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0, marginTop:2 }}>{subject.emoji}</div>
                  )}
                  <div style={{
                    maxWidth:"88%", padding:"12px 16px", borderRadius:16,
                    background:msg.role==="user"?`linear-gradient(135deg,${subject.color}CC,${subject.color}99)`:"rgba(255,255,255,0.06)",
                    color:msg.role==="user"?"#060B20":"#fff",
                    fontSize:14, lineHeight:1.75, fontWeight:msg.role==="user"?700:400, whiteSpace:"pre-wrap",
                  }}>{msg.content}</div>
                </div>
              ))}
              {loading&&(
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:`${subject.color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>{subject.emoji}</div>
                  <div style={{ display:"flex", gap:5 }}>
                    {[0,0.2,0.4].map((d,i)=>(
                      <div key={i} style={{ width:9, height:9, borderRadius:"50%", background:subject.color, animation:`bounce 1s ${d}s ease-in-out infinite`, opacity:0.8 }}/>
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef}/>
            </div>

            {/* Input */}
            <div style={{ padding:"12px 16px", borderTop:`1px solid ${subject.color}15` }}>
              <div style={{ fontSize:10, fontWeight:800, color:"rgba(255,255,255,0.3)", marginBottom:8, letterSpacing:0.5 }}>
                PASTE A QUESTION, TYPE YOUR QUERY, OR UPLOAD A PDF ABOVE:
              </div>
              <textarea
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)) sendMessage(); }}
                placeholder={pdfData?"PDF attached ✓ — ask: 'Work through question 3' or 'What topics are in this paper?'":"Paste a past paper question, mark scheme, or ask Starky anything about this subject..."}
                rows={isMobile?3:4}
                style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:`1px solid ${pdfData?"#C77DFF44":subject.color+"25"}`, borderRadius:14, padding:"12px 14px", color:"#fff", fontSize:14, fontFamily:"'Nunito',sans-serif", resize:"vertical", lineHeight:1.6 }}
              />
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8, gap:8 }}>
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.2)", fontWeight:600 }}>Ctrl+Enter to send</span>
                  {!limitReached&&(
                    <span style={{ fontSize:11, fontWeight:800, color:callsLeft<=5?"#FF6B6B":"#A8E063" }}>
                      · {callsLeft} session{callsLeft!==1?"s":""} left
                    </span>
                  )}
                </div>
                <button onClick={()=>sendMessage()} disabled={(!input.trim()&&!pdfData)||loading}
                  style={{ ...S.btn, background:(input.trim()||pdfData)&&!loading?`linear-gradient(135deg,${subject.color},${subject.color}CC)`:"rgba(255,255,255,0.08)", borderRadius:14, padding:"10px 24px", color:(input.trim()||pdfData)&&!loading?"#060B20":"rgba(255,255,255,0.3)", fontWeight:900, fontSize:14 }}>
                  {loading?"Thinking...":pdfData&&!input.trim()?"Send PDF →":"Send →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
