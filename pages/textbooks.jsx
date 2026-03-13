// pages/textbooks.jsx
// ─────────────────────────────────────────────────────────────────────────────
// TEXTBOOKS HUB — Starky has read every Cambridge textbook.
// 1. CHAPTER BROWSER     — all chapters per subject, click to explain
// 2. AI CONCEPT TUTOR    — paste any textbook paragraph → Starky explains it
// 3. PDF UPLOAD          — upload a textbook page → AI reads & teaches it
// 4. PROGRESS TRACKING   — localStorage tracks chapters studied
// 5. CHAPTER PLAN        — pick exam date → day-by-day chapter schedule
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import { useSessionLimit } from "../utils/useSessionLimit";
import Head from "next/head";

// ── PROGRESS STORAGE ─────────────────────────────────────────────────────────
const PROGRESS_KEY = "nw_tb_progress";
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); } catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch {}
}
function recordSession(subjectId, chapterLabel) {
  const p = loadProgress();
  if (!p[subjectId]) p[subjectId] = { sessions: 0, chapters: [], lastStudied: null };
  p[subjectId].sessions += 1;
  p[subjectId].lastStudied = new Date().toISOString().split("T")[0];
  if (chapterLabel && !p[subjectId].chapters.includes(chapterLabel)) {
    p[subjectId].chapters = [...p[subjectId].chapters, chapterLabel];
  }
  saveProgress(p);
  return p;
}

// ── SUBJECT DATABASE ─────────────────────────────────────────────────────────
const SUBJECTS = {
  olevel: [
    { id:"o-maths", name:"Mathematics D", code:"4024", emoji:"🔢", color:"#63D2FF",
      chapters:["Number & computation","Algebra — expressions & equations","Functions & graphs","Coordinate geometry","Trigonometry","Mensuration (area & volume)","Matrices & transformations","Statistics — data handling","Probability","Vectors"],
      keyConceptss:["Quadratic equations","Pythagoras & trig","Simultaneous equations","Probability trees"],
      studyTip:"Work every example in the book before looking at the solution. Mathematics is a doing subject — reading is not enough.",
      books:[
        { label:"Cambridge IGCSE Mathematics (Pemberton)", href:"https://www.hoddereducation.com/igcsemaths" },
        { label:"Cambridge O Level Maths (Audrey Simpson)", href:"https://www.cambridge.org/gb/education/exam-preparation/cambridge-o-level/mathematics-d" },
        { label:"Free Revision Notes — Save My Exams", href:"https://www.savemyexams.com/o-level/maths/cie/" },
      ]},
    { id:"o-physics", name:"Physics", code:"5054", emoji:"⚛️", color:"#A8E063",
      chapters:["Measurements & units","Kinematics — motion","Forces & Newton's laws","Work, energy & power","Pressure","Thermal physics","Waves & light","Sound","Electricity & circuits","Magnetism & electromagnetism","Nuclear physics"],
      keyConceptss:["v = u + at equations","Ohm's Law & circuits","Wave properties","Nuclear decay"],
      studyTip:"Draw diagrams for EVERY physics concept — a circuit, a ray diagram, a force diagram. Visual memory beats text memory.",
      books:[
        { label:"Cambridge O Level Physics (Sang)", href:"https://www.cambridge.org/gb/education/exam-preparation/cambridge-o-level/physics" },
        { label:"Free Notes — Physics & Maths Tutor", href:"https://www.physicsandmathstutor.com/physics-revision/o-level/" },
        { label:"CIE Physics Revision — Save My Exams", href:"https://www.savemyexams.com/o-level/physics/cie/" },
      ]},
    { id:"o-chemistry", name:"Chemistry", code:"5070", emoji:"🧪", color:"#C77DFF",
      chapters:["Kinetic particle theory","Atomic structure","Bonding — ionic, covalent, metallic","Chemical formulae & equations","Acids, bases & salts","The Periodic Table","Metals & reactivity","Redox reactions","Organic chemistry","Rates of reaction","Electrochemistry","Water & environment"],
      keyConceptss:["Balancing equations","Organic homologous series","Acid-base reactions","Electrolysis"],
      studyTip:"Make flashcards for every named reaction. Chemistry is mostly pattern recognition — if you know the reactions, you can answer anything.",
      books:[
        { label:"Cambridge O Level Chemistry (Harwood)", href:"https://www.cambridge.org/gb/education/exam-preparation/cambridge-o-level/chemistry" },
        { label:"Free Notes — Chemistry Guide", href:"https://chemistryguide.org/olevel" },
        { label:"Save My Exams — O Level Chemistry", href:"https://www.savemyexams.com/o-level/chemistry/cie/" },
      ]},
    { id:"o-biology", name:"Biology", code:"5090", emoji:"🧬", color:"#FF8C69",
      chapters:["Cell structure & organisation","Diffusion, osmosis & active transport","Biological molecules","Plant nutrition (photosynthesis)","Animal nutrition & digestion","Transport in plants","Transport in animals (circulatory system)","Disease & immunity","Respiration","Excretion","Coordination (nervous & hormonal)","Reproduction","Inheritance & genetics","Variation & natural selection","Ecology & environment","Biotechnology"],
      keyConceptss:["Mitosis vs meiosis","Photosynthesis equation","Genetics & Punnett squares","Food webs"],
      studyTip:"For every system (circulatory, digestive, nervous), draw the FULL diagram from memory. Diagrams earn marks others miss.",
      books:[
        { label:"Cambridge O Level Biology (Jones & Jones)", href:"https://www.cambridge.org/gb/education/exam-preparation/cambridge-o-level/biology" },
        { label:"Free Notes — Biology Corner", href:"https://www.biologycorner.com" },
        { label:"Save My Exams — O Level Biology", href:"https://www.savemyexams.com/o-level/biology/cie/" },
      ]},
    { id:"o-english", name:"English Language", code:"1123", emoji:"📖", color:"#FFC300",
      chapters:["Reading skills — comprehension","Inference & deduction","Summary writing techniques","Directed writing formats","Descriptive writing","Narrative writing","Transactional writing — letters, reports","Vocabulary in context","Grammar & punctuation essentials","Planning & structuring answers"],
      keyConceptss:["Summary in own words","Directed writing tone","Descriptive language techniques","Inference evidence"],
      studyTip:"Read a quality newspaper article every day. Vocabulary and reading speed are built over weeks, not nights.",
      books:[
        { label:"Cambridge IGCSE English First Language (Hayward)", href:"https://www.cambridge.org/gb/education/exam-preparation/igcse/english-first-language" },
        { label:"Free Practice — British Council", href:"https://learnenglish.britishcouncil.org" },
        { label:"Revision Guide — Save My Exams", href:"https://www.savemyexams.com/o-level/english-language/cie/" },
      ]},
    { id:"o-economics", name:"Economics", code:"2281", emoji:"📊", color:"#FFC300",
      chapters:["Basic economic problem & scarcity","Demand — theory & shifts","Supply — theory & shifts","Price mechanism & equilibrium","Price elasticity","Market failure","Government intervention","National income & GDP","Inflation & deflation","Unemployment","International trade","Exchange rates","Development economics"],
      keyConceptss:["Supply & demand diagrams","Elasticity calculations","Fiscal vs monetary policy","Comparative advantage"],
      studyTip:"Every diagram must have fully labelled axes, curves, equilibrium point, and a shift arrow. Never draw a blank diagram.",
      books:[
        { label:"Cambridge O Level Economics (Stimpson)", href:"https://www.cambridge.org/gb/education/exam-preparation/cambridge-o-level/economics" },
        { label:"Free Notes — Economics Help", href:"https://www.economicshelp.org" },
        { label:"Save My Exams — O Level Economics", href:"https://www.savemyexams.com/o-level/economics/cie/" },
      ]},
  ],
  alevel: [
    { id:"a-maths", name:"Mathematics", code:"9709", emoji:"🔢", color:"#63D2FF",
      chapters:["Pure 1 — Quadratics & functions","Pure 1 — Coordinate geometry","Pure 1 — Circular measure","Pure 1 — Trigonometry","Pure 1 — Differentiation","Pure 1 — Integration","Pure 2 — Logarithms & exponentials","Pure 2 — Trigonometric identities","Pure 3 — Complex numbers","Pure 3 — Differential equations","Statistics 1 — Probability","Statistics 1 — Distributions","Statistics 2 — Hypothesis testing","Mechanics 1 — Kinematics & forces","Mechanics 2 — Work & energy"],
      keyConceptss:["Chain/product/quotient rules","Integration by parts","Normal distribution","Newton's laws in 2D"],
      studyTip:"For every formula, derive it once from first principles so you understand WHY it works. You'll never forget it again.",
      books:[
        { label:"Cambridge A Level Maths Pure 1 (Pemberton)", href:"https://www.cambridge.org/gb/education/exam-preparation/as-and-a-level/mathematics" },
        { label:"A Level Maths Revision — ExamSolutions", href:"https://www.examsolutions.net" },
        { label:"Save My Exams — A Level Maths", href:"https://www.savemyexams.com/a-level/maths/cie/" },
      ]},
    { id:"a-physics", name:"Physics", code:"9702", emoji:"⚛️", color:"#A8E063",
      chapters:["Physical quantities & units","Kinematics","Dynamics & Newton's laws","Forces & equilibrium","Work, energy & power","Momentum","Motion in a circle","Gravitational fields","Temperature & ideal gases","Thermodynamics","Oscillations (SHM)","Waves","Superposition & diffraction","Electric fields","Capacitance","Magnetic fields","Electromagnetic induction","Alternating currents","Quantum physics","Nuclear physics","Medical imaging","Astronomy"],
      keyConceptss:["Simple harmonic motion equations","Capacitor discharge","Electromagnetic induction","Quantum energy levels"],
      studyTip:"Practical skills (Paper 3) are learned by doing. Borrow lab equipment or simulate online — theory alone won't help you here.",
      books:[
        { label:"Cambridge A Level Physics (Sang et al.)", href:"https://www.cambridge.org/gb/education/exam-preparation/as-and-a-level/physics" },
        { label:"A Level Physics — Isaac Physics", href:"https://isaacphysics.org" },
        { label:"Save My Exams — A Level Physics", href:"https://www.savemyexams.com/a-level/physics/cie/" },
      ]},
    { id:"a-chemistry", name:"Chemistry", code:"9701", emoji:"🧪", color:"#C77DFF",
      chapters:["Atomic structure & periodicity","Chemical bonding","States of matter","Chemical energetics","Electrochemistry","Equilibria","Reaction kinetics","The Periodic Table — Group trends","Nitrogen & sulfur chemistry","Introduction to organic chemistry","Alkanes & alkenes","Halogenoalkanes","Alcohols & carbonyl compounds","Carboxylic acids & esters","Nitrogen compounds — amines & amides","Polymerisation","Transition metals","Analytical techniques (NMR, IR, MS)"],
      keyConceptss:["Organic mechanisms — curly arrows","Le Chatelier's principle","Transition metal complexes","Spectroscopic analysis"],
      studyTip:"Organic mechanisms must be memorised perfectly. One wrong curly arrow can cost 3 marks. Practise drawing them daily.",
      books:[
        { label:"Cambridge A Level Chemistry (Harwood & Lodge)", href:"https://www.cambridge.org/gb/education/exam-preparation/as-and-a-level/chemistry" },
        { label:"Organic Chemistry Mechanisms — ChemGuide", href:"https://www.chemguide.co.uk" },
        { label:"Save My Exams — A Level Chemistry", href:"https://www.savemyexams.com/a-level/chemistry/cie/" },
      ]},
    { id:"a-biology", name:"Biology", code:"9700", emoji:"🧬", color:"#FF8C69",
      chapters:["Cell structure — ultrastructure","Biological molecules","Enzymes","Cell membranes & transport","The mitotic cell cycle","Nucleic acids & protein synthesis","Transport in plants (xylem & phloem)","Transport in animals","Gas exchange","Infectious diseases & immunity","Energy & respiration","Photosynthesis","Homeostasis (osmotic & temperature)","Control & coordination","Inheritance — genetics & chi-squared","Evolution & natural selection","Biodiversity & classification","Genetic technology & biotechnology"],
      keyConceptss:["DNA replication & transcription","Krebs cycle & oxidative phosphorylation","Genetic crosses & probability","Ecosystem energy flow"],
      studyTip:"Biology has huge content — use Cornell notes. After each chapter: summarise in 5 bullet points, then teach it out loud to yourself.",
      books:[
        { label:"Cambridge A Level Biology (Jones & Gregory)", href:"https://www.cambridge.org/gb/education/exam-preparation/as-and-a-level/biology" },
        { label:"A Level Biology Revision — Biology Online", href:"https://www.biology-online.org" },
        { label:"Save My Exams — A Level Biology", href:"https://www.savemyexams.com/a-level/biology/cie/" },
      ]},
    { id:"a-economics", name:"Economics", code:"9708", emoji:"📊", color:"#FFC300",
      chapters:["Basic economic concepts","Theory of demand & consumer behaviour","Theory of supply & production","Market equilibrium & price mechanism","Elasticities","Market failure & externalities","Government microeconomic policies","National income accounting","AD/AS model","Consumption & investment","Money supply & monetary policy","Government fiscal policy","Unemployment & inflation","Economic growth & development","International trade theory","Balance of payments","Exchange rate systems","Development economics"],
      keyConceptss:["AD/AS model shifts","Elasticity of demand","Market failure diagrams","Monetary vs fiscal policy"],
      studyTip:"Economics essays require evaluation at every step. Never just explain — always ask 'But does this always apply?' That's where A grades come from.",
      books:[
        { label:"Cambridge A Level Economics (Stimpson & Farquharson)", href:"https://www.cambridge.org/gb/education/exam-preparation/as-and-a-level/economics" },
        { label:"Economics Revision — Economics Help", href:"https://www.economicshelp.org" },
        { label:"Save My Exams — A Level Economics", href:"https://www.savemyexams.com/a-level/economics/cie/" },
      ]},
    { id:"a-business", name:"Business Studies", code:"9609", emoji:"💼", color:"#63D2FF",
      chapters:["Business activity & objectives","Stakeholders","Business structure & organisation","Business finance — sources","Cost classification & break-even","Financial statements & ratios","Marketing mix — 4 Ps","Market research","Marketing strategy","Operations management","Capacity & lean production","Human resource management","Motivation theory","Organisational structure","Business strategy","Globalisation & international business","Business ethics & sustainability"],
      keyConceptss:["Break-even analysis","Financial ratio interpretation","Marketing mix evaluation","Motivation theories — Maslow, Herzberg"],
      studyTip:"Every Business answer needs a context reference. Generic theory without linking to the case study scenario scores below 50%.",
      books:[
        { label:"Cambridge A Level Business (Stimpson & Smith)", href:"https://www.cambridge.org/gb/education/exam-preparation/as-and-a-level/business" },
        { label:"Business Revision — Tutor2U", href:"https://www.tutor2u.net/business/alevel" },
        { label:"Save My Exams — A Level Business", href:"https://www.savemyexams.com/a-level/business/cie/" },
      ]},
    { id:"a-cs", name:"Computer Science", code:"9618", emoji:"💻", color:"#C77DFF",
      chapters:["Data representation","Communication & networking","Hardware","Logic gates & Boolean algebra","Processors & computer architecture","System software — OS","Security & ethics","Algorithm design & problem solving","Data structures — arrays, stacks, queues","Linked lists & trees","Sorting & searching algorithms","Recursion","Object-oriented programming","File handling","Databases & SQL","Software development cycle","Programming paradigms"],
      keyConceptss:["Pseudocode & trace tables","Binary/hex conversions","OOP — classes & inheritance","Networking — TCP/IP"],
      studyTip:"Trace tables must be done mechanically — follow what the code says, never what you think it should do. One wrong step ruins every line after.",
      books:[
        { label:"Cambridge A Level Computer Science (Langfield)", href:"https://www.cambridge.org/gb/education/exam-preparation/as-and-a-level/computer-science" },
        { label:"CS Revision — Craig'n'Dave", href:"https://craigndave.org" },
        { label:"Save My Exams — A Level CS", href:"https://www.savemyexams.com/a-level/computer-science/cie/" },
      ]},
  ],
};

// ── SYSTEM PROMPT ─────────────────────────────────────────────────────────────
function buildSystemPrompt(level, subject) {
  const lvl  = level === "olevel" ? "Cambridge O Level" : "Cambridge A Level";
  const subj = subject ? `${subject.name} (${subject.code})` : "Cambridge curriculum";
  return `You are Starky, a world-class ${lvl} ${subj} textbook tutor. You have read and mastered every Cambridge-endorsed textbook for this subject.

YOUR MISSION: Help students deeply understand textbook content so they can apply it confidently in exams.

CAPABILITIES:
- Explain any chapter or concept from scratch with clear examples
- Break down difficult textbook paragraphs the student pastes in
- Read uploaded textbook pages (PDFs/images) and teach the content
- Create practice questions directly from chapter content
- Build chapter-by-chapter study schedules given an exam date
- Create summaries, mind maps (text format), and flashcard sets
- Connect concepts across chapters to show the big picture
- Identify the most important concepts per chapter for exam focus

TEACHING STYLE:
- Start simple, build up — never assume prior knowledge
- Use analogies and real-world examples
- End every explanation with a quick check question to confirm understanding
- For calculations: show every single step with reasoning
- For theory: explain the WHY not just the WHAT

RESPONSE FORMAT:
1. Brief concept intro (1-2 sentences)
2. Step-by-step explanation with examples
3. A "Key Points to Remember" summary (3-5 bullets)
4. A quick check question at the end

Respond in the student's language if they write in Arabic or Urdu.`;
}

// ── QUICK START TILES ────────────────────────────────────────────────────────
function promptTiles(subject) {
  return [
    { emoji:"📖", label:"Explain this chapter",      prompt:`I'm starting a new chapter. Give me a complete beginner-friendly explanation of the first chapter in ${subject?.name||"this subject"} with examples.` },
    { emoji:"📋", label:"Summarise key concepts",    prompt:`Summarise the most important concepts I must know for ${subject?.name||"this subject"} in a clear, structured format with bullet points.` },
    { emoji:"✍️", label:"Make practice questions",   prompt:`Create 5 exam-style practice questions based on the core textbook content of ${subject?.name||"this subject"}, with full worked answers.` },
    { emoji:"🔍", label:"Explain this paragraph",    prompt:`I'm going to paste a textbook paragraph I don't understand. Please break it down step by step and explain it like I'm a complete beginner.` },
    { emoji:"🧠", label:"Build a mind map",          prompt:`Create a detailed text mind map of all the key topics and how they connect in ${subject?.name||"this subject"}. Show relationships between chapters.` },
    { emoji:"🃏", label:"Create flashcards",         prompt:`Create 10 flashcard-style Q&A pairs covering the most important facts and definitions in ${subject?.name||"this subject"}.` },
    { emoji:"❓", label:"Why do I need to know this?",prompt:`For ${subject?.name||"this subject"}, explain how each chapter connects to the exam. Which chapters are worth the most marks and why?` },
    { emoji:"📄", label:"I uploaded a textbook page",prompt:`I've uploaded a textbook page. Please read it carefully, identify the main concept being taught, and give me a full explanation with examples.` },
  ];
}

// ── CHAPTER PLAN MODAL ────────────────────────────────────────────────────────
function ChapterPlanModal({ subject, level, onClose, onSend }) {
  const [examDate, setExamDate]   = useState("");
  const [hoursDay, setHoursDay]   = useState("1");
  const [weakChapters, setWeak]   = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const daysLeft = examDate ? Math.max(0, Math.floor((new Date(examDate) - new Date()) / 86400000)) : null;
  const toggle = (c) => setWeak(p => p.includes(c) ? p.filter(x=>x!==c) : [...p,c]);

  const generate = () => {
    if (!examDate) return;
    const weakNote = weakChapters.length > 0
      ? `Give extra time to these chapters the student finds difficult: ${weakChapters.join(", ")}.`
      : `Spread chapters evenly, prioritising these key concepts: ${subject.keyConceptss.join(", ")}.`;
    const prompt = `I have my Cambridge ${level==="olevel"?"O Level":"A Level"} ${subject.name} exam on ${examDate}. That is ${daysLeft} days from today (${today}).

Build me a complete chapter-by-chapter study plan covering all ${daysLeft} days.

All chapters to cover: ${subject.chapters.join(", ")}.

${weakNote}

Study hours per day: ${hoursDay} hour(s).

Format the plan as:
- Group by week (Week 1, Week 2, etc.)
- Each day: chapter to study, activity (read & notes / worked examples / self-test questions), time
- Include at least 2 full revision days (review all chapters) 
- Final 3 days: light review only, no new chapters
- End with a motivational message

Make it realistic, achievable, and specific.`;
    onSend(prompt);
    onClose();
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"linear-gradient(135deg,#0E1635,#0A1228)", border:`1px solid ${subject.color}44`, borderRadius:24, padding:32, width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
          <div>
            <h2 style={{ margin:"0 0 4px", fontWeight:900, fontSize:22, fontFamily:"'Nunito',sans-serif" }}>📅 Build My Chapter Plan</h2>
            <p style={{ margin:0, color:"rgba(255,255,255,0.4)", fontSize:13 }}>{subject.emoji} {subject.name} · {level==="olevel"?"O Level":"A Level"} · {subject.chapters.length} chapters</p>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)", border:"none", color:"#fff", borderRadius:"50%", width:32, height:32, cursor:"pointer", fontSize:16, flexShrink:0 }}>✕</button>
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ display:"block", fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.45)", letterSpacing:1, marginBottom:8 }}>EXAM DATE *</label>
          <input type="date" value={examDate} min={today} onChange={e=>setExamDate(e.target.value)}
            style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:`1px solid ${examDate?subject.color+"66":"rgba(255,255,255,0.15)"}`, borderRadius:12, padding:"12px 16px", color:"#fff", fontSize:16, fontFamily:"'Nunito',sans-serif", boxSizing:"border-box", colorScheme:"dark" }} />
          {daysLeft !== null && (
            <div style={{ marginTop:8, fontSize:13, fontWeight:700, color:daysLeft<14?"#FF6B6B":"#A8E063" }}>
              {daysLeft===0?"⚠️ Exam is today!": daysLeft===1?"⚠️ Exam is tomorrow!": daysLeft<14?`⚠️ ${daysLeft} days — let's be efficient`:`✅ ${daysLeft} days — great, enough time for full coverage`}
            </div>
          )}
        </div>

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

        <div style={{ marginBottom:24 }}>
          <label style={{ display:"block", fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.45)", letterSpacing:1, marginBottom:8 }}>
            WEAK CHAPTERS <span style={{ fontWeight:600, color:"rgba(255,255,255,0.25)" }}>(optional — tap chapters you find hardest)</span>
          </label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {subject.chapters.map(c=>(
              <button key={c} onClick={()=>toggle(c)} style={{
                padding:"6px 12px", borderRadius:20, cursor:"pointer",
                fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:11,
                background: weakChapters.includes(c)?`${subject.color}25`:"rgba(255,255,255,0.05)",
                border:`1px solid ${weakChapters.includes(c)?subject.color:"rgba(255,255,255,0.12)"}`,
                color: weakChapters.includes(c)?subject.color:"rgba(255,255,255,0.5)",
              }}>{weakChapters.includes(c)?"✓ ":""}{c}</button>
            ))}
          </div>
        </div>

        <button onClick={generate} disabled={!examDate} style={{
          width:"100%", padding:"16px", borderRadius:14, border:"none",
          background: examDate?`linear-gradient(135deg,${subject.color},${subject.color}BB)`:"rgba(255,255,255,0.08)",
          color: examDate?"#060B20":"rgba(255,255,255,0.3)",
          fontWeight:900, fontSize:16, cursor:examDate?"pointer":"default",
          fontFamily:"'Nunito',sans-serif",
        }}>
          {examDate?`📅 Generate My ${daysLeft}-Day Chapter Plan →`:"Select your exam date first"}
        </button>
        <p style={{ textAlign:"center", marginTop:10, fontSize:11, color:"rgba(255,255,255,0.25)", fontFamily:"'Nunito',sans-serif" }}>
          Starky builds a complete personalised chapter schedule
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
        Your study sessions are tracked here automatically. Tap any chapter or Quick Start tile to begin! 📚
      </div>
    </div>
  );

  const notStudied = subject && subData
    ? subject.chapters.filter(c => !subData.chapters.some(sc => sc.toLowerCase().includes(c.split(" ")[0].toLowerCase())))
    : [];

  return (
    <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"14px" }}>
      <div style={{ fontSize:10, fontWeight:900, color:"rgba(255,255,255,0.3)", letterSpacing:1, marginBottom:12 }}>📈 MY PROGRESS</div>
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
      {subData && subject && (
        <div style={{ marginBottom:10 }}>
          <div style={{ fontSize:11, fontWeight:800, color:subject.color, marginBottom:6 }}>
            {subject.emoji} {subject.name} — {subData.sessions} session{subData.sessions!==1?"s":""}
          </div>
          {subData.chapters.length > 0 && (
            <>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginBottom:4 }}>Chapters studied:</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:6 }}>
                {subData.chapters.slice(0,5).map(c=>(
                  <span key={c} style={{ background:`${subject.color}15`, border:`1px solid ${subject.color}30`, borderRadius:8, padding:"2px 7px", fontSize:10, fontWeight:700, color:subject.color }}>✓ {c.split(" ").slice(0,3).join(" ")}</span>
                ))}
              </div>
            </>
          )}
          {subData.lastStudied && (
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.2)" }}>Last studied: {subData.lastStudied}</div>
          )}
        </div>
      )}
      {notStudied.length > 0 && (
        <div style={{ background:"rgba(255,107,107,0.07)", border:"1px solid rgba(255,107,107,0.2)", borderRadius:10, padding:"10px 12px" }}>
          <div style={{ fontSize:10, fontWeight:900, color:"#FF6B6B", marginBottom:5 }}>📚 NOT YET STUDIED</div>
          {notStudied.slice(0,4).map(c=>(
            <div key={c} style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginBottom:2 }}>• {c}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function TextbooksPage() {
  const [level,   setLevel]   = useState(null);
  const [subject, setSubject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showChapterPlan, setShowChapterPlan] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState({});

  const [pdfData,    setPdfData]    = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef   = useRef(null);

  const { callsUsed, callsLeft, limitReached, recordCall } = useSessionLimit();

  useEffect(()=>{
    const fn=()=>setIsMobile(window.innerWidth<768);
    fn(); window.addEventListener("resize",fn);
    return ()=>window.removeEventListener("resize",fn);
  },[]);
  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,loading]);
  useEffect(()=>{ setProgress(loadProgress()); },[]);

  const handlePdfUpload = (file) => {
    if (!file || file.type!=="application/pdf") { alert("Please select a PDF file."); return; }
    if (file.size > 10*1024*1024) { alert("PDF must be under 10MB."); return; }
    setPdfLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => { setPdfData({ base64: e.target.result.split(",")[1], name: file.name }); setPdfLoading(false); };
    reader.onerror = () => { setPdfLoading(false); alert("Could not read file."); };
    reader.readAsDataURL(file);
  };
  const clearPdf = () => { setPdfData(null); if(fileInputRef.current) fileInputRef.current.value=""; };

  const selectSubject = (subj) => {
    setSubject(subj);
    setMessages([{
      role:"assistant",
      content:`Hi! I'm Starky, your ${level==="olevel"?"O Level":"A Level"} ${subj.name} textbook tutor. 📚\n\nI've read every Cambridge-endorsed textbook for this subject cover to cover. I know every chapter, every concept, every worked example.\n\n**How to use me:**\n• Tap any chapter below to get a full explanation\n• Tap a Quick Start tile to get going immediately\n• Paste any paragraph you don't understand\n• Upload a textbook page as a PDF 📤\n• Tap 📅 Build My Chapter Plan for a day-by-day schedule\n\nWhat would you like to master today?`,
    }]);
  };

  const sendMessage = async (text) => {
    const txt = (text||input).trim();
    if ((!txt && !pdfData) || loading) return;

    const newProg = recordSession(subject?.id, null);
    setProgress(newProg);
    recordCall();

    const msgText = txt || "(Please read the uploaded textbook page and explain the main concept being taught)";
    setInput("");
    setLoading(true);

    const displayMsg = { role:"user", content: pdfData?`📄 [${pdfData.name}] ${msgText}`:msgText };
    const prevMessages = [...messages, displayMsg];
    setMessages(prevMessages);

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
      const res = await fetch("/api/chat", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-haiku-4-5-20251001", max_tokens:1500, system: buildSystemPrompt(level, subject), messages: apiMessages }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Something went wrong — please try again!";
      setMessages(prev=>[...prev,{role:"assistant",content:reply}]);
    } catch {
      setMessages(prev=>[...prev,{role:"assistant",content:"Something went wrong. Please try again!"}]);
    }
    setLoading(false);
  };

  const S = {
    page:{ minHeight:"100dvh", background:"linear-gradient(135deg,#060B20 0%,#0C1A3A 60%,#060B20 100%)", fontFamily:"'Nunito',sans-serif", color:"#fff" },
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

  // ── LEVEL SELECTOR ─────────────────────────────────────────────────────────
  if (!level) return (
    <div style={S.page}><style>{CSS}</style>
      <header style={S.hdr}>
        <a href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontWeight:900, fontSize:15, color:"#fff" }}>NewWorldEdu<span style={{color:"#4F8EF7"}}>★</span></span>
        </a>
        <a href="/past-papers" style={{ color:"rgba(255,255,255,0.4)", fontSize:12, textDecoration:"none", fontWeight:700 }}>📄 Past Papers</a>
      </header>
      <div style={{ maxWidth:680, margin:"0 auto", padding:isMobile?"32px 16px":"56px 24px", textAlign:"center" }}>
        <div style={{ fontSize:isMobile?48:64, marginBottom:12 }}>📚</div>
        <h1 style={{ fontSize:isMobile?26:38, fontWeight:900, margin:"0 0 12px", lineHeight:1.2 }}>
          Textbooks <span style={{ color:"#A8E063" }}>Hub</span>
        </h1>
        <p style={{ fontSize:isMobile?14:16, color:"rgba(255,255,255,0.5)", maxWidth:480, margin:"0 auto 36px", lineHeight:1.75 }}>
          Starky has read every Cambridge textbook. Ask it to explain any chapter, concept, or paragraph — instantly, any time.
        </p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:48 }}>
          {["📖 Every Cambridge chapter","📤 Upload textbook pages","🤖 AI concept explanations","🃏 Auto-generated flashcards","📅 Chapter study plan","📈 Progress tracking","🆓 Free to start"].map(p=>(
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
      </div>
    </div>
  );

  // ── SUBJECT SELECTOR ───────────────────────────────────────────────────────
  const subjects   = SUBJECTS[level];
  const levelLabel = level==="olevel"?"O Level":"A Level";
  const levelColor = level==="olevel"?"#A8E063":"#63D2FF";

  if (!subject) return (
    <div style={S.page}><style>{CSS}</style>
      <header style={S.hdr}>
        <a href="/" style={{ textDecoration:"none", fontWeight:900, fontSize:15, color:"#fff" }}>NewWorldEdu<span style={{color:"#4F8EF7"}}>★</span></a>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <button onClick={()=>setLevel(null)} style={{ ...S.btn, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"6px 14px", color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:700 }}>← Change level</button>
        </div>
      </header>
      <div style={{ maxWidth:820, margin:"0 auto", padding:isMobile?"24px 16px":"40px 24px" }}>
        <div style={{ marginBottom:28, textAlign:"center" }}>
          <div style={{ display:"inline-block", background:`${levelColor}15`, border:`1px solid ${levelColor}35`, borderRadius:20, padding:"6px 18px", fontSize:13, fontWeight:800, color:levelColor, marginBottom:12 }}>Cambridge {levelLabel}</div>
          <h2 style={{ fontSize:isMobile?22:28, fontWeight:900, margin:"0 0 6px" }}>Choose your subject</h2>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", margin:0 }}>Chapter browser · AI explanations · PDF upload · chapter plan · progress tracking</p>
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
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", fontWeight:600, marginBottom:10 }}>{subj.code} · {subj.chapters.length} chapters</div>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                  {subj.keyConceptss.slice(0,2).map(t=>(
                    <span key={t} style={{ background:`${subj.color}15`, border:`1px solid ${subj.color}30`, borderRadius:8, padding:"2px 7px", fontSize:10, fontWeight:700, color:subj.color }}>📌 {t}</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── MAIN STUDY INTERFACE ───────────────────────────────────────────────────
  return (
    <div style={S.page}><style>{CSS}</style>

      {showChapterPlan && <ChapterPlanModal subject={subject} level={level} onClose={()=>setShowChapterPlan(false)} onSend={sendMessage}/>}
      <input ref={fileInputRef} type="file" accept="application/pdf" style={{display:"none"}} onChange={e=>handlePdfUpload(e.target.files[0])}/>

      <header style={S.hdr}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <a href="/" style={{ textDecoration:"none", fontWeight:900, fontSize:isMobile?13:15, color:"#fff" }}>NewWorldEdu<span style={{color:"#4F8EF7"}}>★</span></a>
          {!isMobile&&<><span style={{color:"rgba(255,255,255,0.2)"}}>›</span><a href="/past-papers" style={{color:"rgba(255,255,255,0.4)",fontSize:13,textDecoration:"none"}}>Past Papers</a><span style={{color:"rgba(255,255,255,0.2)"}}>›</span><span style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>Textbooks</span></>}
          <span style={{color:"rgba(255,255,255,0.2)"}}>›</span>
          <span style={{ fontWeight:800, fontSize:13, color:subject.color }}>{subject.emoji} {subject.name}</span>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={()=>setShowChapterPlan(true)} style={{ ...S.btn, background:`${subject.color}18`, border:`1px solid ${subject.color}45`, borderRadius:10, padding:"6px 12px", color:subject.color, fontSize:12, fontWeight:800 }}>
            📅 Chapter Plan
          </button>
          <button onClick={()=>{setSubject(null);setMessages([]);clearPdf();}} style={{ ...S.btn, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"6px 12px", color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700 }}>
            ← Subjects
          </button>
        </div>
      </header>

      <div style={{ maxWidth:980, margin:"0 auto", padding:isMobile?"12px":"20px 24px", display:"grid", gridTemplateColumns:isMobile?"1fr":"272px 1fr", gap:16 }}>

        {/* LEFT SIDEBAR */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

          {/* Subject info */}
          <div style={{ ...S.card, background:`${subject.color}0E`, borderColor:`${subject.color}35`, padding:"16px 14px" }}>
            <div style={{fontSize:26,marginBottom:6}}>{subject.emoji}</div>
            <div style={{ fontWeight:900, fontSize:16, color:subject.color, marginBottom:2 }}>{subject.name}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:12 }}>{levelLabel} · Code {subject.code} · {subject.chapters.length} chapters</div>
            <div style={{ fontSize:10, fontWeight:900, color:"rgba(255,255,255,0.35)", letterSpacing:1, marginBottom:6 }}>📌 KEY CONCEPTS</div>
            {subject.keyConceptss.map(t=>(
              <div key={t} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:subject.color, flexShrink:0 }}/>
                <span style={{ fontSize:12, fontWeight:600 }}>{t}</span>
              </div>
            ))}
            <div style={{ marginTop:12, padding:"10px 12px", background:"rgba(255,193,0,0.08)", border:"1px solid rgba(255,193,0,0.2)", borderRadius:12 }}>
              <div style={{ fontSize:10, fontWeight:900, color:"#FFC300", marginBottom:4 }}>💡 STUDY TIP</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)", lineHeight:1.6 }}>{subject.studyTip}</div>
            </div>
          </div>

          {/* Free textbook links */}
          <div style={{ ...S.card, padding:"14px" }}>
            <div style={{ fontSize:10, fontWeight:900, color:"rgba(255,255,255,0.35)", letterSpacing:1, marginBottom:8, textTransform:"uppercase" }}>📚 Recommended Textbooks</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", lineHeight:1.6, marginBottom:10 }}>
              Open in a new tab, then upload pages here or paste text for Starky to explain.
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {subject.books.map((b,i)=>{
                const colors = [
                  { bg:"rgba(168,224,99,0.08)",  border:"rgba(168,224,99,0.22)",  c:"#A8E063" },
                  { bg:"rgba(99,210,255,0.08)",  border:"rgba(99,210,255,0.22)",  c:"#63D2FF" },
                  { bg:"rgba(199,125,255,0.08)", border:"rgba(199,125,255,0.22)", c:"#C77DFF" },
                ];
                const cl = colors[i % colors.length];
                return (
                  <a key={b.label} href={b.href} target="_blank" rel="noopener noreferrer"
                    style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 11px", background:cl.bg, border:`1px solid ${cl.border}`, borderRadius:10, textDecoration:"none", color:"#fff", fontSize:12, fontWeight:700 }}>
                    <span>{b.label}</span><span style={{fontSize:9,color:cl.c}}>Open →</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Chapter list */}
          <div style={{ ...S.card, padding:"14px" }}>
            <div style={{ fontSize:10, fontWeight:900, color:"rgba(255,255,255,0.35)", letterSpacing:1, marginBottom:10, textTransform:"uppercase" }}>📖 All Chapters — tap to explain</div>
            {subject.chapters.map((c,i)=>(
              <div key={c} style={{ display:"flex", alignItems:"flex-start", gap:7, marginBottom:5 }}>
                <span style={{ fontSize:10, color:subject.color, fontWeight:900, flexShrink:0, marginTop:2 }}>{i+1}.</span>
                <button onClick={()=>sendMessage(`Explain "${c}" from Cambridge ${levelLabel} ${subject.name} fully. Start from the basics, give worked examples, and end with 3 key points to remember.`)}
                  style={{ ...S.btn, background:"none", color:"rgba(255,255,255,0.55)", fontSize:11, fontWeight:600, textAlign:"left", padding:0 }}
                  onMouseEnter={e=>{e.currentTarget.style.color="#fff";}}
                  onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.55)";}}>
                  {c}
                </button>
              </div>
            ))}
          </div>

          <ProgressPanel progress={progress} subject={subject}/>
        </div>

        {/* RIGHT — CHAT */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

          {/* Quick start tiles */}
          <div style={{ ...S.card, padding:"14px 14px 10px" }}>
            <div style={{ fontSize:10, fontWeight:900, color:"rgba(255,255,255,0.35)", letterSpacing:1, marginBottom:10, textTransform:"uppercase" }}>⚡ Quick Start — tap to begin instantly</div>
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

          {/* Action bar */}
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setShowChapterPlan(true)}
              style={{ ...S.btn, flex:1, background:`${subject.color}12`, border:`1px solid ${subject.color}35`, borderRadius:14, padding:"12px 16px", color:subject.color, fontWeight:800, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
              onMouseEnter={e=>{e.currentTarget.style.background=`${subject.color}22`;}}
              onMouseLeave={e=>{e.currentTarget.style.background=`${subject.color}12`;}}>
              📅 Build My Chapter Plan
            </button>
            <button onClick={()=>fileInputRef.current?.click()} disabled={pdfLoading}
              style={{ ...S.btn, flex:1, background:"rgba(199,125,255,0.1)", border:"1px solid rgba(199,125,255,0.3)", borderRadius:14, padding:"12px 16px", color:"#C77DFF", fontWeight:800, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {pdfLoading?<span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⏳</span>:"📤"}
              {pdfLoading?"Reading PDF...":"Upload Textbook Page (PDF)"}
            </button>
          </div>

          {pdfData&&(
            <div style={{ background:"rgba(199,125,255,0.1)", border:"1px solid rgba(199,125,255,0.35)", borderRadius:14, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:"#C77DFF" }}>📄 PDF attached: {pdfData.name}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>Starky will read and explain this page when you send your message</div>
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

            <div style={{ padding:"12px 16px", borderTop:`1px solid ${subject.color}15` }}>
              <div style={{ fontSize:10, fontWeight:800, color:"rgba(255,255,255,0.3)", marginBottom:8, letterSpacing:0.5 }}>
                PASTE ANY TEXTBOOK PARAGRAPH, TYPE YOUR QUESTION, OR UPLOAD A PAGE ABOVE:
              </div>
              <textarea
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)) sendMessage(); }}
                autoCorrect="off" autoCapitalize="sentences" spellCheck={false}
                placeholder={pdfData?"PDF attached ✓ — ask: 'Explain the main concept' or 'Create practice questions from this page'":"Paste a paragraph you don't understand, ask about any chapter, or type a concept you want explained..."}
                rows={isMobile?3:4}
                style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:`1px solid ${pdfData?"#C77DFF44":subject.color+"25"}`, borderRadius:14, padding:"12px 14px", color:"#fff", fontSize:16, fontFamily:"'Nunito',sans-serif", resize:"vertical", lineHeight:1.6 }}
              />
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8, gap:8 }}>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.2)", fontWeight:600 }}>Ctrl+Enter to send</span>
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
