// pages/special-needs.jsx
// ═══════════════════════════════════════════════════════════════════════
// STARKY FOR SPECIAL NEEDS — CONDITION × AGE MATRIX
//
// THE INSIGHT: A 5-year-old with autism learning phonics needs completely
// different support from a 15-year-old with autism preparing for GCSEs.
// Condition alone is not enough. Age/stage changes everything.
//
// SOLUTION: 3-step selector → condition × stage × focus
// Creates 7 × 4 × 5 = 140 distinct teaching profiles
// ═══════════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useSessionLimit } from "../utils/useSessionLimit";
import { addKnowledgeToPrompt } from "../utils/senKnowledge";

// ── CONDITIONS ─────────────────────────────────────────────────────────
const CONDITIONS = [
  { id:"autism",    emoji:"🌟", name:"Autism Spectrum",      urdu:"آٹزم",           color:"#63D2FF", short:"ASD",      signs:"Social communication differences, routines, sensory sensitivity" },
  { id:"adhd",      emoji:"⚡", name:"ADHD",                  urdu:"توجہ کی کمی",   color:"#FFC300", short:"ADHD",     signs:"Can't sit still, loses focus, impulsive — often called 'naughty' but it's neurological" },
  { id:"dyslexia",  emoji:"🎵", name:"Dyslexia",              urdu:"ڈسلیکسیا",      color:"#FF8C69", short:"Dyslexia", signs:"Struggles with reading/spelling but bright in other ways — often undiagnosed in Pakistan" },
  { id:"ds",        emoji:"💛", name:"Down Syndrome",         urdu:"ڈاؤن سنڈروم",   color:"#A8E063", short:"DS",       signs:"Extra chromosome 21 — learning differences with tremendous strengths in empathy and memory" },
  { id:"cp",        emoji:"💪", name:"Cerebral Palsy",        urdu:"دماغی فالج",    color:"#C77DFF", short:"CP",       signs:"Movement and coordination challenges — cognitive ability is often fully intact" },
  { id:"vi",        emoji:"✨", name:"Visual Impairment",     urdu:"بصری معذوری",   color:"#FF6B9D", short:"VI",       signs:"Partial or full vision loss — exceptional verbal and auditory strengths" },
  { id:"hi",        emoji:"🎶", name:"Hearing Impairment",    urdu:"سماعت کی کمی",  color:"#F4A261", short:"HI",       signs:"Partial or full hearing loss — strong visual learners with full cognitive ability" },
  { id:"unsure",    emoji:"❓", name:"Not Sure / Undiagnosed",urdu:"تشخیص نہیں ہوئی",color:"#A78BFA", short:"SEN",     signs:"My child struggles at school but I don't have a diagnosis yet" },
];

// ── AGE/STAGE ─────────────────────────────────────────────────────────
const STAGES = [
  {
    id:"early", emoji:"🌱", name:"Early Years",
    ages:"Ages 3–6", grades:"Nursery · Reception · KG",
    color:"#A8E063",
    desc:"First steps in learning — play-based, sensory, joyful. Every milestone celebrated.",
    curriculum:"Early Years Foundation Stage / KG curriculum",
    subjects:["Early Literacy","Early Numeracy","Communication","Sensory Play","Social Skills","Fine Motor Skills","Phonics Foundations","Shape & Colour"],
  },
  {
    id:"primary", emoji:"🌿", name:"Primary",
    ages:"Ages 6–11", grades:"Years 1–6 · Grades 1–5",
    color:"#63D2FF",
    desc:"Building foundations — reading, writing, maths, and discovering the world.",
    curriculum:"Primary National Curriculum / Elementary",
    subjects:["English & Reading","Maths","Science","Writing","Spelling","Times Tables","History","Geography","Art","Computing"],
  },
  {
    id:"secondary", emoji:"🌳", name:"Secondary",
    ages:"Ages 11–16", grades:"Years 7–11 · GCSE · O-Levels",
    color:"#FFC300",
    desc:"Navigating complexity — exams, identity, and finding their place in the world.",
    curriculum:"GCSE / O-Level / Middle & High School",
    subjects:["English Literature","English Language","Maths","Biology","Chemistry","Physics","History","Geography","ICT","Business","Religious Studies","Art & Design"],
  },
  {
    id:"sixthform", emoji:"🎓", name:"Sixth Form & College",
    ages:"Ages 16–18", grades:"A-Levels · IB · AS · College",
    color:"#C77DFF",
    desc:"The highest stakes — university applications, advanced study, and transition to independence.",
    curriculum:"A-Level / IB / AS-Level / College",
    subjects:["A-Level English","A-Level Maths","A-Level Biology","A-Level Chemistry","A-Level Physics","A-Level History","A-Level Psychology","A-Level Business","IB Extended Essay","University Preparation","UCAS Personal Statement"],
  },
];

// ── LEARNING FOCUS ────────────────────────────────────────────────────
const FOCUSES = [
  { id:"academic",  emoji:"📚", name:"Academic Subject",    desc:"Curriculum learning with SEN adaptations" },
  { id:"creative",  emoji:"🎨", name:"Creative Learning",   desc:"Music, Reading & Arts specialist sessions" },
  { id:"life",      emoji:"🌟", name:"Life Skills",         desc:"Independence, communication & social skills" },
  { id:"exam",      emoji:"📝", name:"Exam Preparation",    desc:"GCSE, A-Level, IB & O-Level with accommodations" },
  { id:"parent",    emoji:"💌", name:"Parent & Carer Guide",desc:"Expert guidance for supporting your child at home" },
];

// ── SYSTEM PROMPT BUILDER ─────────────────────────────────────────────
function buildPrompt(condition, stage, focus, subject, urduMode = false) {
  if (!condition || !stage || !focus) return "";

  const conditionAdapt = {
    autism: `AUTISM ADAPTATIONS:
- Explicit, literal language — no idioms or sarcasm without explanation
- Visualising and Verbalising technique for comprehension
- Predictable, structured session format
- Connect to special interests whenever possible
- Literal → inferential scaffold for all comprehension
- Social/emotional content needs explicit explanation
- Celebrate pattern recognition and systematic thinking`,

    adhd: `ADHD ADAPTATIONS:
- Activities in 5-7 minute bursts — change mode frequently
- HIGH energy and enthusiasm — match their pace
- Gamify: timers, challenges, competitions
- Working memory support: frequent short recaps
- Physical engagement: "stand up and say it", movement built in
- Immediate feedback and celebration
- Hook them with the most exciting part FIRST`,

    dyslexia: `DYSLEXIA ADAPTATIONS:
- NEVER ask for written responses — verbal only
- Multi-sensory: say it, clap it, trace it
- Phonological awareness built into every session
- Context before definition — never the reverse
- Never time reading aloud — EVER
- Celebrate verbal intelligence and listening comprehension
- Audiobooks and oral methods are equal to print — say so
- Orton-Gillingham sequential phonics principles`,

    ds: `DOWN SYNDROME ADAPTATIONS:
- Short instructions: ONE step at a time
- Maximum 10-15 minutes before a break
- High repetition is learning — celebrate it
- Visual + verbal together always
- Whole-word recognition strengths
- Music and rhythm to support memory
- Massive celebration of every success
- Simple, direct language with warmth
- Reading can TEACH oral language — both directions work`,

    cp: `CEREBRAL PALSY ADAPTATIONS:
- ALWAYS offer 3 response modes: speak, type, yes/no
- Never require oral reading
- Fatigue management: shorter sessions, pace carefully
- AAC and switch access methods assumed
- Comprehension questions via pointing or yes/no
- Audiobooks as primary text format
- Never mistake physical limitation for cognitive limitation
- Full academic curriculum is appropriate`,

    vi: `VISUAL IMPAIRMENT ADAPTATIONS:
- Describe ALL visual content explicitly
- Audiobooks are the primary and equal text format
- Auditory memory is extraordinary — use it
- No references to "look at this" — "listen to this"
- Text-to-speech and Braille access assumed
- Build on exceptional language and verbal skills
- Homer was blind — the literary tradition began this way
- Full academic and creative curriculum is appropriate`,

    unsure: `UNDIAGNOSED / UNSURE CONDITION ADAPTATIONS:
- The child has NOT been formally diagnosed — treat this as a discovery session
- Ask the parent/student to describe the specific challenges they face before teaching
- Listen for clues: reading difficulty → dyslexia; hyperactivity/inattention → ADHD; social/communication differences → ASD
- Adapt your response style based on what you hear — do NOT assume
- Explicitly validate the parent: "Many Pakistani children go undiagnosed for years — you've done the right thing by seeking support"
- Suggest that a formal assessment would help, but emphasise that Starky can help RIGHT NOW without one
- Try multiple approaches — some may work better than others — report back what works`,

    hi: `HEARING IMPAIRMENT ADAPTATIONS:
- Clear, visual, written explanations preferred
- British Sign Language / ASL concepts acknowledged
- Lip-reading context: clear sentences, no mumbling
- Visual learning strategies prioritised
- Captioning and visual media mentioned where relevant
- Written language may differ from spoken — no correction
- Deaf culture and identity respected
- Full academic curriculum with visual adaptations`,
  };

  const stageContext = {
    early: `EARLY YEARS CONTEXT (Ages 3-6):
- Play-based learning is THE pedagogical approach — never desk-based instruction
- Every session should feel like an adventure, not a lesson
- Sensory engagement: touch, sound, movement
- Attention spans: 5-10 minutes maximum on any single activity
- Repetition and routine are comforting and effective
- Parents/carers are in the room — guide them too
- Every milestone is significant and deserves celebration
- Language: simple, warm, musical, full of delight`,

    primary: `PRIMARY CONTEXT (Ages 6-11, ${stage.curriculum}):
- National Curriculum foundations: literacy, numeracy, science, humanities
- Reading fluency and comprehension are central concerns
- Times tables, place value, basic operations
- Writing stamina builds slowly — scaffold with oral rehearsal first
- Topic-based learning works well — connect subjects
- Friendships and belonging matter enormously at this stage
- 20-30 minute focused sessions are appropriate
- Homework help and parent explanations are often needed`,

    secondary: `SECONDARY CONTEXT (Ages 11-16, ${stage.curriculum}):
- GCSE and O-Level preparation is the central academic concern
- Exam technique is a specific learnable skill — teach it
- Essay structure: PEEL, PEARL, argument + evidence
- Revision strategies adapted for the condition
- Social complexity of secondary school acknowledged
- Identity formation — this age group needs to feel capable
- SEN accommodations: extra time, reader, scribe — discuss these
- 45-60 minute sessions are appropriate`,

    sixthform: `SIXTH FORM CONTEXT (Ages 16-18, ${stage.curriculum}):
- A-Level, IB, AS-Level — high stakes assessment
- Extended writing, analysis, evaluation at university level
- UCAS personal statements and university preparation
- Independence and self-advocacy skills critical
- SEN exam accommodations and how to access them
- Transition planning: university, college, employment, independence
- Treat as an intellectual equal — high expectations
- 60+ minute sessions for complex work`,
  };

  const focusGuide = {
    academic: `ACADEMIC FOCUS — Subject: ${subject || "General"}
Teach this subject using evidence-based SEN adaptations. Break every concept into micro-steps. Check understanding before moving on. Use worked examples. Connect to real life. Celebrate every correct answer. Never move on while confusion remains.`,

    creative: `CREATIVE LEARNING FOCUS
Music, Reading, and Arts through specialist SEN lenses. For this session, use the creative curriculum as the context. Every creative activity should have an adapted version. Voice input is encouraged. Expression takes many forms.`,

    life: `LIFE SKILLS FOCUS
Independence, communication, social skills, self-advocacy, daily living skills. Connect everything to real scenarios the child will encounter. Role-play situations. Build confidence for navigating the world. For older students: money, transport, employment, relationships.`,

    exam: `EXAM PREPARATION FOCUS
Teach exam technique alongside content. SEN accommodations explained. Past paper questions worked through with adaptations. Revision strategies that work for this condition. Time management in exams. How to ask for extra support.`,

    parent: `PARENT/CARER GUIDANCE
Speak to the adult supporting this child. Practical, evidence-based guidance for home. What to do, what NOT to do. Common mistakes parents make with this condition and age group. Resources, organisations, support networks. How to advocate for your child at school.`,
  };

  const pakistanContext = `
PAKISTAN CONTEXT (critical for this session):
- Many Pakistani children are UNDIAGNOSED — parents may not know the clinical term for their child's condition
- ADHD is commonly dismissed as "شرارتی بچہ" (naughty child) in Pakistan — NEVER use this framing
- Dyslexia (ڈسلیکسیا) is widely undiagnosed — if parents describe reading/spelling difficulty, treat as possible dyslexia
- Most Pakistani schools (including O Level schools like KGS, Nixor, Beaconhouse, City School) do NOT have dedicated SEN departments
- For O Level students: IBCC and Cambridge both offer exam accommodations (extra time, reader, scribe) — parents must apply through the school's Cambridge exam officer
- Cambridge Access Arrangements (AA) can be applied for via school — 25% extra time is most common
- If the parent mentions an Urdu-medium school or government school, the resources are EVEN more limited — be more explicit about home strategies
- Local resources in Pakistan: SELD Karachi, Autism Resource Center Lahore, NOWPDP for disability employment
- Urdu and English are both valid — respond in whichever language the parent/student uses
`;

  return addKnowledgeToPrompt(`You are Starky — a world-class specialist educational tutor for children with special educational needs.

CHILD PROFILE:
- Condition: ${condition.name} (${condition.short})
- Age/Stage: ${stage.name} — ${stage.ages} — ${stage.grades}
- Curriculum: ${stage.curriculum}
- Session Focus: ${focus.name}${subject ? " — " + subject : ""}

${conditionAdapt[condition.id]}

${stageContext[stage.id]}

${focusGuide[focus.id]}

YOUR CORE APPROACH:
1. Every response ends with "For the adult: [specific, practical, immediate action]"
2. Micro-step everything — never jump over a step
3. Celebrate every attempt, not just correct answers
4. Ask one question at a time maximum
5. Connect learning to the child's known interests
6. If the child is struggling, simplify further — never move on
7. If the child is flying, extend and challenge — never hold back
8. Use the child's name if given
9. Sessions end with a preview of what comes next — anticipation builds motivation

NEVER:
- Say "that's wrong" — say "almost! let's try another way"
- Use sarcasm, irony, or figurative language without explaining
- Give multi-part instructions at once
- Make the child feel they are behind or broken
- Assume one session looks like the last — check in fresh each time

Remember: You are not teaching a condition. You are teaching a child who happens to have a condition. The most important thing in every session is that they leave feeling more capable than when they arrived.

If the message is in Urdu or Arabic, respond in that language.
${urduMode ? "IMPORTANT: This session is in URDU MODE. Respond ENTIRELY in Urdu. All explanations, encouragement, and guidance must be in Urdu. Only keep English for technical Cambridge/exam terms with no Urdu equivalent." : ""}

${pakistanContext}`);
}

// ── PROGRESS ─────────────────────────────────────────────────────────
const PK = "nw_sen_progress";
function loadP() { try { return JSON.parse(localStorage.getItem(PK)||"{}"); } catch { return {}; } }
function saveP(p) { try { localStorage.setItem(PK, JSON.stringify(p)); } catch {} }

// ═══════════════════════════════════════════════════════════════════════

// ── SEN Drill Widget ─────────────────────────────────────────────
function SENDrillWidget({ condition, stage, subject }) {
  const [active, setActive] = useState(false);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [celebration, setCelebration] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [senError, setSenError] = useState('');
  const feedbackRef = useRef(null);

  const CELEBRATIONS = [
    "🌟 Amazing try!", "⭐ You're doing great!", "🎉 Brilliant effort!",
    "🌈 Keep going, you've got this!", "💪 That was wonderful!",
    "🦋 You're a star!", "🎊 Fantastic attempt!", "🌺 So proud of you!",
  ];

  const senSubjects = subject
    ? [subject]
    : ['Maths','English','Science','Reading','Social Skills','Life Skills'];

  const [chosenSubject, setChosenSubject] = useState('');

  const generateQuestion = async (subj) => {
    if (loading) return;
    setLoading(true);
    setFeedback(null);
    setSelected('');
    setAnswer('');
    setHint(null);
    const sub = subj || chosenSubject || 'General Learning';
    try {
      const condName = condition?.name || 'Special Educational Needs';
      const stageName = stage?.name || 'Primary';
      const res = await fetch('/api/drill', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          action: 'generate',
          level: stageName,
          subject: sub,
          topic: 'Core concepts',
          difficulty: 'easy',
          questionType: 'mcq',
          isSEN: true,
          senCondition: condName,
        })
      });
      const data = await res.json();
      if (!data.error) {
        setQuestion(data);
        setQuestionCount(c => c + 1);
        setSenError('');
      } else { setSenError(data.error); }
    } catch { setSenError('Something went wrong. Let\'s try again!'); }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!question || loading) return;
    const ans = question.type === 'mcq' ? selected : answer.trim();
    if (!ans) return;
    setLoading(true);
    try {
      const res = await fetch('/api/drill', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          action: 'grade',
          level: stage?.name || 'Primary',
          subject: chosenSubject,
          topic: question.topic || 'General',
          question: question.question,
          studentAnswer: ans,
          questionType: question.type,
          options: question.options,
          marks: question.marks,
          isSEN: true,
        })
      });
      const data = await res.json();
      setFeedback(data);
      // Always celebrate — correct or not
      const cel = CELEBRATIONS[Math.floor(Math.random() * CELEBRATIONS.length)];
      setCelebration(data.correct ? "🌟 Correct! " + cel : cel);
      setTimeout(() => feedbackRef.current?.scrollIntoView({behavior:'smooth',block:'start'}), 150);
    } catch { setSenError('Oops! Let\'s try again.'); }
    setLoading(false);
  };

  const getHint = async () => {
    if (!question || hintLoading) return;
    setHintLoading(true);
    try {
      const res = await fetch('/api/drill', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          action: 'hint',
          question: question.question,
          subject: chosenSubject,
          topic: question.topic || 'General',
          level: stage?.name || 'Primary',
        })
      });
      const data = await res.json();
      setHint(data.hint || 'Think about what you already know — you can do this!');
    } catch {
      setHint('Take your time — there is no rush. You can do this!');
    }
    setHintLoading(false);
  };

  if (!active) return (
    <div style={{background:"rgba(167,139,250,0.06)",border:"2px solid rgba(167,139,250,0.2)",borderRadius:20,padding:"28px 24px",textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:12}}>🎯</div>
      <div style={{fontWeight:900,fontSize:18,marginBottom:8,fontFamily:"'Nunito',sans-serif"}}>Ready to practise?</div>
      <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:20,lineHeight:1.7}}>
        No timer. No stress. Starky will cheer for every answer you give.
      </div>
      {!subject && (
        <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:16}}>
          {senSubjects.map(s => (
            <button key={s} onClick={() => setChosenSubject(s)} style={{background:chosenSubject===s?"rgba(167,139,250,0.2)":"rgba(255,255,255,0.05)",border:`2px solid ${chosenSubject===s?"rgba(167,139,250,0.6)":"rgba(255,255,255,0.1)"}`,borderRadius:14,padding:"12px 20px",color:chosenSubject===s?"#A78BFA":"rgba(255,255,255,0.6)",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
              {s}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => { setActive(true); generateQuestion(subject || chosenSubject); }}
        disabled={!subject && !chosenSubject}
        style={{background:"linear-gradient(135deg,#A78BFA,#7C5CBF)",border:"none",borderRadius:14,padding:"14px 32px",color:"#fff",fontWeight:900,fontSize:16,fontFamily:"'Nunito',sans-serif",cursor:"pointer",opacity:(!subject && !chosenSubject)?0.4:1}}
      >
        Let's Start! ✨
      </button>
    </div>
  );

  return (
    <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"24px 20px"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div style={{fontWeight:800,fontSize:13,color:"#A78BFA"}}>✨ Practice Zone · {chosenSubject || subject}</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.35)"}}>Question {questionCount}</div>
      </div>

      {loading && !question && (
        <div style={{textAlign:"center",padding:"40px 0"}}>
          <div style={{fontSize:40,marginBottom:12}}>🌟</div>
          <div style={{fontSize:14,color:"rgba(255,255,255,0.5)"}}>Starky is finding the perfect question for you…</div>
        </div>
      )}

      {question && !loading && (
        <>
          {/* Hint always visible at top */}
          {!hint && !feedback && (
            <button onClick={getHint} disabled={hintLoading} style={{width:"100%",background:"rgba(252,211,77,0.08)",border:"1px solid rgba(252,211,77,0.2)",borderRadius:12,padding:"10px",color:"#FCD34D",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:14,fontFamily:"'Nunito',sans-serif"}}>
              {hintLoading ? "🤔 Getting a hint for you…" : "💡 Can I have a hint please?"}
            </button>
          )}
          {hint && !feedback && (
            <div style={{background:"rgba(252,211,77,0.08)",border:"1px solid rgba(252,211,77,0.2)",borderRadius:12,padding:"12px 16px",marginBottom:14,fontSize:13,color:"rgba(255,255,255,0.85)",lineHeight:1.7}}>
              <strong style={{color:"#FCD34D"}}>💡 Hint: </strong>{hint}
            </div>
          )}

          {/* Question — bigger text for SEN */}
          <div style={{fontSize:18,lineHeight:1.8,color:"rgba(255,255,255,0.95)",background:"rgba(167,139,250,0.07)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:14,padding:"20px",marginBottom:20,fontFamily:"'Nunito',sans-serif",fontWeight:600}}>
            {question.question}
          </div>

          {/* MCQ options — large tap targets */}
          {question.type === 'mcq' && question.options && !feedback && (
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
              {Object.entries(question.options).map(([key, val]) => (
                <button key={key}
                  onClick={() => setSelected(key)}
                  style={{background:selected===key?"rgba(167,139,250,0.15)":"rgba(255,255,255,0.04)",border:`2px solid ${selected===key?"rgba(167,139,250,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:14,padding:"16px 18px",cursor:"pointer",color:selected===key?"#A78BFA":"rgba(255,255,255,0.8)",fontSize:16,textAlign:"left",display:"flex",gap:12,alignItems:"center",fontFamily:"'Nunito',sans-serif",fontWeight:600,transition:"all 0.15s"}}>
                  <strong style={{fontSize:18,minWidth:28,color:selected===key?"#A78BFA":"rgba(255,255,255,0.4)"}}>{key}.</strong>
                  <span>{val}</span>
                  {selected===key && <span style={{marginLeft:"auto",fontSize:20}}>●</span>}
                </button>
              ))}
            </div>
          )}

          {/* MCQ after feedback */}
          {question.type === 'mcq' && question.options && feedback && (
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
              {Object.entries(question.options).map(([key, val]) => {
                const isSelected = selected===key;
                const isCorrect = key===question.correctOption;
                let bg="rgba(255,255,255,0.03)",border="rgba(255,255,255,0.06)",color="rgba(255,255,255,0.4)";
                if (isCorrect) { bg="rgba(74,222,128,0.1)"; border="rgba(74,222,128,0.35)"; color="#4ADE80"; }
                if (isSelected && !isCorrect) { bg="rgba(248,113,113,0.1)"; border="rgba(248,113,113,0.35)"; color="#F87171"; }
                return (
                  <div key={key} style={{background:bg,border:`2px solid ${border}`,borderRadius:14,padding:"14px 18px",color,fontSize:15,display:"flex",gap:12,alignItems:"center",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>
                    <strong style={{minWidth:28}}>{key}.</strong>
                    <span>{val}</span>
                    {isCorrect && <span style={{marginLeft:"auto",fontSize:20}}>✓</span>}
                    {isSelected && !isCorrect && <span style={{marginLeft:"auto",fontSize:20}}>✗</span>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Structured answer */}
          {question.type === 'structured' && !feedback && (
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Write your answer here — take all the time you need…"
              style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:12,color:"#fff",padding:"14px",fontSize:16,lineHeight:1.7,fontFamily:"'Nunito',sans-serif",outline:"none",resize:"vertical",minHeight:120,boxSizing:"border-box",marginBottom:16}}
            />
          )}

          {/* Feedback — always celebratory */}
          {feedback && (
            <div ref={feedbackRef} style={{background:"rgba(167,139,250,0.08)",border:"2px solid rgba(167,139,250,0.25)",borderRadius:16,padding:"20px",marginBottom:16}}>
              <div style={{fontSize:28,marginBottom:8,textAlign:"center"}}>{celebration}</div>
              <p style={{fontSize:15,color:"rgba(255,255,255,0.85)",lineHeight:1.8,margin:"0 0 12px",fontFamily:"'Nunito',sans-serif"}}>
                {feedback.feedback}
              </p>
              {feedback.modelAnswer && (
                <div style={{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"12px 14px",marginTop:10}}>
                  <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",letterSpacing:"0.06em",marginBottom:6}}>THE ANSWER WAS</div>
                  <div style={{fontSize:14,color:"rgba(255,255,255,0.75)",lineHeight:1.7,fontFamily:"'Nunito',sans-serif"}}>{feedback.modelAnswer}</div>
                </div>
              )}
            </div>
          )}

          {/* Submit / Next */}
          {!feedback ? (
            <button
              onClick={submitAnswer}
              disabled={question.type==='mcq'?!selected:!answer.trim()}
              style={{width:"100%",background:"linear-gradient(135deg,#A78BFA,#7C5CBF)",border:"none",borderRadius:14,padding:"16px",color:"#fff",fontSize:16,fontWeight:900,fontFamily:"'Nunito',sans-serif",cursor:"pointer",opacity:(question.type==='mcq'?!selected:!answer.trim())?0.4:1}}>
              {loading ? "Checking… 🌟" : "Submit My Answer ✨"}
            </button>
          ) : (
            <button
              onClick={() => generateQuestion(subject || chosenSubject)}
              style={{width:"100%",background:"linear-gradient(135deg,#A78BFA,#7C5CBF)",border:"none",borderRadius:14,padding:"16px",color:"#fff",fontSize:16,fontWeight:900,fontFamily:"'Nunito',sans-serif",cursor:"pointer"}}>
              Next Question → ✨
            </button>
          )}

          <button onClick={() => { setActive(false); setQuestion(null); setFeedback(null); setQuestionCount(0); }}
            style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"13px",color:"rgba(255,255,255,0.4)",fontSize:14,fontFamily:"'Nunito',sans-serif",cursor:"pointer",marginTop:8}}>
            Take a break 💜
          </button>
        </>
      )}
    </div>
  );
}

export default function SpecialNeedsPage() {
  const [step, setStep]           = useState(1); // 1=condition, 2=stage, 3=focus, 4=chat
  const [urduMode, setUrduMode]   = useState(false); // Urdu language toggle
  const [condition, setCondition] = useState(null);
  const [stage, setStage]         = useState(null);
  const [focus, setFocus]         = useState(null);
  const [subject, setSubject]     = useState("");
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [isMobile, setIsMobile]   = useState(false);
  const [progress, setProgress]   = useState({});
  const chatEndRef = useRef(null);
  // SEN students get UNLIMITED sessions — never rate-limit special needs learners
  const { recordCall } = useSessionLimit();
  const limitReached = false;
  const callsLeft = 999;

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn(); window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);
  useEffect(() => { setProgress(loadP()); }, []);

  const accentColor = condition?.color || "#C77DFF";

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
    *{box-sizing:border-box} button:focus,textarea:focus,input:focus{outline:none}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:4px}
    @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
    @keyframes glow{0%,100%{box-shadow:0 0 20px ${accentColor}30}50%{box-shadow:0 0 40px ${accentColor}60}}
    @media (prefers-reduced-motion: reduce) {
      *{animation:none !important;transition:none !important}
    }
  `;

  const S = {
    page: { minHeight:"100vh", background:"linear-gradient(135deg,#060B20 0%,#0D1635 60%,#060B20 100%)", fontFamily:"'Nunito',sans-serif", color:"#fff" },
    hdr:  { padding:isMobile?"12px 16px":"14px 28px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between" },
    btn:  { border:"none", cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"all 0.2s" },
  };

  const startChat = (focusOverride) => {
    const effectiveFocus = focusOverride || focus;
    if (!condition || !stage || !effectiveFocus) return;
    const key = `${condition.id}_${stage.id}`;
    const p = loadP();
    if (!p[key]) p[key] = { sessions:0, lastSeen:null };
    p[key].sessions++;
    p[key].lastSeen = new Date().toISOString().split("T")[0];
    saveP(p); setProgress(p);

    const welcome = `Hello! I'm Starky — your specialist tutor.

I'm set up to support a ${stage.name} student (${stage.ages}) with ${condition.name}.

${effectiveFocus.id === "parent"
  ? `You've chosen Parent & Carer guidance. I'm here to give you practical, evidence-based support for helping your child at home. Ask me anything — what to do, what to avoid, how to support specific challenges, or where to find more help.`
  : effectiveFocus.id === "academic" && subject
  ? `Today's focus: ${subject} — adapted for ${condition.name} at ${stage.name} level.\n\nEvery explanation will be broken into micro-steps. Every question is designed for this stage. Let's start!\n\nWhat would you like to work on in ${subject} today?`
  : effectiveFocus.id === "creative"
  ? `Creative learning — Music, Reading, and Arts — adapted for ${condition.name} at ${stage.name} level.\n\nWhich would you like to explore today — Music, Reading, or Arts?`
  : effectiveFocus.id === "life"
  ? `Life Skills for a ${stage.name} student with ${condition.name}.\n\nWhat area would you like to focus on? (Communication, independence, social situations, daily routines, self-advocacy...)`
  : effectiveFocus.id === "exam"
  ? `Exam preparation for ${stage.grades}, adapted for ${condition.name}.\n\nWhich subject or exam are we preparing for?`
  : `What would you like to work on today?`
}

${effectiveFocus.id !== "parent" ? `\n*For the adult:* Tell me your child's name if you'd like me to use it, and anything specific about how they're feeling today.` : ""}`;

    setMessages([{ role:"assistant", content:welcome }]);
    setStep(4);
  };

  const sendMessage = async (text) => {
    const txt = (text || input).trim();
    if (!txt || loading || limitReached) return;
    setInput(""); recordCall();
    const prev = [...messages, { role:"user", content:txt }];
    setMessages(prev); setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001",
          max_tokens:1500,
          system:buildPrompt(condition, stage, focus, subject, urduMode),
          messages:prev.map(m => ({ role:m.role, content:m.content })),
        }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role:"assistant", content:data.content?.[0]?.text || "Something went wrong — please try again." }]);
    } catch {
      setMessages(p => [...p, { role:"assistant", content:"Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  const reset = () => { setStep(1); setCondition(null); setStage(null); setFocus(null); setSubject(""); setMessages([]); };

  // ── STEP INDICATOR ──────────────────────────────────────────────────
  const StepBar = () => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:32 }}>
      {[
        { n:1, label:"Condition" },
        { n:2, label:"Age & Stage" },
        { n:3, label:"Focus" },
        { n:4, label:"Learn" },
      ].map((s, i) => (
        <div key={s.n} style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{
            width:32, height:32, borderRadius:"50%",
            background: step >= s.n ? accentColor : "rgba(255,255,255,0.08)",
            border: "2px solid " + (step >= s.n ? accentColor : "rgba(255,255,255,0.15)"),
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:13, fontWeight:900,
            color: step >= s.n ? "#060B20" : "rgba(255,255,255,0.3)",
            transition:"all 0.3s",
            cursor: step > s.n ? "pointer" : "default",
          }} onClick={() => { if (step > s.n) { setStep(s.n); if (s.n <= 1) { setStage(null); setFocus(null); setSubject(''); setMessages([]); } if (s.n <= 2) { setFocus(null); setSubject(''); setMessages([]); } if (s.n <= 3) { setSubject(''); setMessages([]); } } }}>
            {step > s.n ? "✓" : s.n}
          </div>
          {!isMobile && <span style={{ fontSize:11, fontWeight:700, color: step >= s.n ? accentColor : "rgba(255,255,255,0.25)" }}>{s.label}</span>}
          {i < 3 && <div style={{ width:isMobile?16:28, height:2, background: step > s.n ? accentColor+"60" : "rgba(255,255,255,0.08)", borderRadius:2 }}/>}
        </div>
      ))}
    </div>
  );

  // ── SELECTED SUMMARY BAR ────────────────────────────────────────────
  const SummaryBar = () => {
    if (!condition && !stage) return null;
    return (
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:24 }}>
        {condition && (
          <div style={{ background:condition.color+"15", border:"1px solid "+condition.color+"40", borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:800, color:condition.color, display:"flex", alignItems:"center", gap:5, cursor:"pointer" }}
            onClick={() => setStep(1)}>
            {condition.emoji} {condition.name} ×
          </div>
        )}
        {stage && (
          <div style={{ background:stage.color+"15", border:"1px solid "+stage.color+"40", borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:800, color:stage.color, display:"flex", alignItems:"center", gap:5, cursor:"pointer" }}
            onClick={() => setStep(2)}>
            {stage.emoji} {stage.name} ×
          </div>
        )}
        {focus && (
          <div style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.6)", display:"flex", alignItems:"center", gap:5, cursor:"pointer" }}
            onClick={() => setStep(3)}>
            {focus.emoji} {focus.name} ×
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={S.page}><style>{CSS}</style>
      <Head>
        <title>Special Needs Support — NewWorldEdu</title>
        <meta name="description" content="AI tutoring adapted for autism, ADHD, dyslexia, and Down syndrome. 140 teaching profiles with evidence-based strategies for Pakistani students." />
        <meta property="og:title" content="Special Needs Support — Adapted AI Tutoring" />
        <meta property="og:description" content="AI tutoring adapted for autism, ADHD, dyslexia, and Down syndrome. 140 teaching profiles with evidence-based strategies for Pakistani students." />
      </Head>

      {/* HEADER */}
      <header style={S.hdr}>
        <a href="/" style={{ textDecoration:"none", fontWeight:900, fontSize:isMobile?13:15, color:"#fff" }}>
          NewWorldEdu<span style={{ color:"#4F8EF7" }}>★</span>
        </a>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {step > 1 && (
            <button onClick={reset} style={{ ...S.btn, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"6px 12px", color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700 }}>
              ← Start Over
            </button>
          )}
          <button
            onClick={() => setUrduMode(u => !u)}
            style={{ ...S.btn, background: urduMode ? "rgba(79,142,247,0.2)" : "rgba(255,255,255,0.05)", border: urduMode ? "1px solid rgba(79,142,247,0.5)" : "1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"6px 12px", color: urduMode ? "#4F8EF7" : "rgba(255,255,255,0.5)", fontSize:11, fontWeight:700 }}
            title="Toggle Urdu language mode">
            {urduMode ? "اردو ✓" : "اردو"}
          </button>
          <a href="/pricing" style={{ background:"linear-gradient(135deg,#4F8EF7,#7B5EA7)", borderRadius:12, padding:"7px 16px", color:"#fff", fontWeight:900, fontSize:12, textDecoration:"none" }}>Plans</a>
        </div>
      </header>

      <div style={{ maxWidth:860, margin:"0 auto", padding:isMobile?"20px 16px":"40px 24px" }}>

        {/* ── STEP 1: CONDITION ─────────────────────────────────────── */}
        {step === 1 && (
          <div style={{ animation:"fadeUp 0.4s ease" }}>
            <div style={{ textAlign:"center", marginBottom:36 }}>
              <div style={{ fontSize:isMobile?48:64, marginBottom:12 }}>💜</div>
              <h1 style={{ fontSize:isMobile?24:40, fontWeight:900, margin:"0 0 10px", lineHeight:1.2 }}>
                Specialist Support for <span style={{ color:"#C77DFF" }}>Every Child</span>
              </h1>
              <p style={{ fontSize:isMobile?13:16, color:"rgba(255,255,255,0.55)", maxWidth:520, margin:"0 auto", lineHeight:1.9 }}>
                Starky adapts completely to your child — their condition, their age, their level, their needs. Let's start by telling Starky who they're teaching.
              </p>
            </div>

            <StepBar/>

            {/* ── PAKISTAN SEN AWARENESS PANEL ── */}
            <div style={{ background:"linear-gradient(135deg,rgba(167,139,250,0.08),rgba(79,142,247,0.06))", border:"1px solid rgba(167,139,250,0.2)", borderRadius:18, padding:"18px 20px", marginBottom:24 }}>
              <div style={{ fontSize:12, fontWeight:900, color:"#A78BFA", letterSpacing:1, marginBottom:12 }}>🇵🇰 بچوں کے بارے میں اہم بات — IMPORTANT FOR PARENTS</div>
              <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:10 }}>
                {[
                  { icon:"⚡", en:"ADHD is not 'naughtiness'", ur:"شرارت نہیں، ADHD ہے — علاج ممکن ہے", desc:"Restless, impulsive, loses focus? This is neurological, not a behaviour problem." },
                  { icon:"🎵", en:"Dyslexia is widely undiagnosed", ur:"ڈسلیکسیا — پاکستان میں اکثر تشخیص نہیں ہوتی", desc:"Struggles with reading/spelling but smart in other ways? This could be dyslexia." },
                  { icon:"🌟", en:"O Level students can get extra time", ur:"O Level طالب علم کو اضافی وقت مل سکتا ہے", desc:"Cambridge Access Arrangements: 25% extra time, reader, scribe — ask your school's exam officer." },
                  { icon:"❓", en:"No diagnosis yet? That's okay", ur:"تشخیص نہیں ہوئی؟ کوئی بات نہیں", desc:"Choose 'Not Sure' below — describe your child's challenges and Starky will adapt." },
                ].map(item => (
                  <div key={item.en} style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"12px 14px" }}>
                    <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                      <span style={{ fontSize:18, flexShrink:0 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.85)", marginBottom:2 }}>{item.en}</div>
                        <div style={{ fontSize:11, fontWeight:700, color:"#A78BFA", marginBottom:4, direction:"rtl", textAlign:"right" }}>{item.ur}</div>
                        <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", lineHeight:1.6 }}>{item.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize:12, fontWeight:900, color:"rgba(255,255,255,0.3)", letterSpacing:2, textAlign:"center", marginBottom:16 }}>STEP 1 — SELECT CONDITION</div>

            <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:12, marginBottom:16 }}>
              {CONDITIONS.map(c => (
                <button key={c.id} onClick={() => { setCondition(c); setStep(2); }}
                  style={{ ...S.btn, background:c.color+"0A", border:"2px solid "+c.color+"30", borderRadius:18, padding:"18px 12px", textAlign:"center", color:"#fff" }}
                  onMouseEnter={e => { e.currentTarget.style.background=c.color+"20"; e.currentTarget.style.borderColor=c.color; e.currentTarget.style.transform="translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=c.color+"0A"; e.currentTarget.style.borderColor=c.color+"30"; e.currentTarget.style.transform="none"; }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>{c.emoji}</div>
                  <div style={{ fontWeight:900, fontSize:13, color:c.color, lineHeight:1.3 }}>{c.name}</div>
                  <div style={{ fontSize:10, color:c.color+"88", marginTop:3, direction:"rtl" }}>{c.urdu}</div>
                  {progress[`${c.id}_early`] || progress[`${c.id}_primary`] || progress[`${c.id}_secondary`] || progress[`${c.id}_sixthform`] ? (
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginTop:4 }}>Previously used</div>
                  ) : null}
                </button>
              ))}
            </div>

            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"16px 20px", textAlign:"center" }}>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.8 }}>
                Don't see your child's condition? Choose <strong style={{color:"#A78BFA"}}>Not Sure / Undiagnosed</strong> — Starky will adapt to what you describe.<br/>
                <span style={{fontSize:11, direction:"rtl", display:"inline-block", marginTop:4}}>تشخیص نہ ہو تو بھی کوئی بات نہیں — Starky آپ کے بچے کی مدد کرے گا۔</span>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: AGE/STAGE ─────────────────────────────────────── */}
        {step === 2 && (
          <div style={{ animation:"fadeUp 0.4s ease" }}>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <div style={{ fontSize:48, marginBottom:8 }}>{condition?.emoji}</div>
              <h2 style={{ fontSize:isMobile?22:34, fontWeight:900, margin:"0 0 8px" }}>
                How old is your <span style={{ color:condition?.color }}>child?</span>
              </h2>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.8 }}>
                A 5-year-old with {condition?.name} needs completely different support<br/>from a 15-year-old with {condition?.name}. Age changes everything.
              </p>
            </div>

            <StepBar/>
            <SummaryBar/>

            <div style={{ fontSize:12, fontWeight:900, color:"rgba(255,255,255,0.3)", letterSpacing:2, textAlign:"center", marginBottom:16 }}>STEP 2 — SELECT AGE & STAGE</div>

            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:14 }}>
              {STAGES.map(s => (
                <button key={s.id} onClick={() => { setStage(s); setStep(3); }}
                  style={{ ...S.btn, background:s.color+"08", border:"2px solid "+s.color+"25", borderRadius:20, padding:"22px 20px", textAlign:"left", color:"#fff" }}
                  onMouseEnter={e => { e.currentTarget.style.background=s.color+"18"; e.currentTarget.style.borderColor=s.color; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=s.color+"08"; e.currentTarget.style.borderColor=s.color+"25"; e.currentTarget.style.transform="none"; }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:10 }}>
                    <div style={{ fontSize:36 }}>{s.emoji}</div>
                    <div>
                      <div style={{ fontWeight:900, fontSize:17, color:s.color }}>{s.name}</div>
                      <div style={{ fontSize:12, fontWeight:700, color:s.color+"AA" }}>{s.ages}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{s.grades}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.7, marginBottom:10 }}>{s.desc}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {s.subjects.slice(0,4).map(sub => (
                      <span key={sub} style={{ background:s.color+"12", border:"1px solid "+s.color+"25", borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:700, color:s.color+"CC" }}>{sub}</span>
                    ))}
                    <span style={{ background:"rgba(255,255,255,0.05)", borderRadius:20, padding:"2px 8px", fontSize:10, color:"rgba(255,255,255,0.3)" }}>+{s.subjects.length-4} more</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: FOCUS ─────────────────────────────────────────── */}
        {step === 3 && (
          <div style={{ animation:"fadeUp 0.4s ease" }}>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <div style={{ fontSize:48, marginBottom:8 }}>🎯</div>
              <h2 style={{ fontSize:isMobile?22:34, fontWeight:900, margin:"0 0 8px" }}>
                What does your child <span style={{ color:accentColor }}>need today?</span>
              </h2>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.8 }}>
                {condition?.name} · {stage?.name} · {stage?.ages}
              </p>
            </div>

            <StepBar/>
            <SummaryBar/>

            <div style={{ fontSize:12, fontWeight:900, color:"rgba(255,255,255,0.3)", letterSpacing:2, textAlign:"center", marginBottom:16 }}>STEP 3 — SELECT LEARNING FOCUS</div>

            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)", gap:12, marginBottom:20 }}>
              {FOCUSES.map(f => (
                <button key={f.id} onClick={() => { setFocus(f); if (f.id !== "academic") { setTimeout(() => startChat(f), 200); } }}
                  style={{ ...S.btn, background: focus?.id===f.id ? accentColor+"18" : "rgba(255,255,255,0.04)", border:"2px solid "+(focus?.id===f.id ? accentColor : "rgba(255,255,255,0.08)"), borderRadius:18, padding:"18px 14px", textAlign:"left", color:"#fff" }}
                  onMouseEnter={e => { e.currentTarget.style.background=accentColor+"12"; e.currentTarget.style.borderColor=accentColor+"50"; }}
                  onMouseLeave={e => { if(focus?.id!==f.id){e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";} }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{f.emoji}</div>
                  <div style={{ fontWeight:900, fontSize:14, color: focus?.id===f.id ? accentColor : "rgba(255,255,255,0.85)", marginBottom:4 }}>{f.name}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", lineHeight:1.6 }}>{f.desc}</div>
                </button>
              ))}
            </div>

            {/* Subject selector for Academic focus */}
            {focus?.id === "academic" && (
              <div style={{ background:accentColor+"0A", border:"1px solid "+accentColor+"25", borderRadius:18, padding:20, animation:"fadeUp 0.3s ease" }}>
                <div style={{ fontSize:12, fontWeight:900, color:accentColor, letterSpacing:1, marginBottom:14 }}>SELECT SUBJECT — {stage?.name.toUpperCase()}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
                  {stage?.subjects.map(sub => (
                    <button key={sub} onClick={() => setSubject(sub)}
                      style={{ ...S.btn, background: subject===sub ? accentColor : "rgba(255,255,255,0.05)", border:"1px solid "+(subject===sub ? accentColor : "rgba(255,255,255,0.12)"), borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:700, color: subject===sub ? "#060B20" : "rgba(255,255,255,0.55)" }}>
                      {sub}
                    </button>
                  ))}
                </div>
                <button onClick={startChat}
                  disabled={!subject}
                  style={{ ...S.btn, width:"100%", background: subject ? "linear-gradient(135deg,"+accentColor+","+accentColor+"BB)" : "rgba(255,255,255,0.08)", borderRadius:14, padding:"14px", color: subject ? "#060B20" : "rgba(255,255,255,0.25)", fontWeight:900, fontSize:15 }}>
                  {subject ? `Start session — ${subject} →` : "Select a subject above"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 4: CHAT ──────────────────────────────────────────── */}
        {step === 4 && (
          <div style={{ animation:"fadeUp 0.4s ease" }}>

            {/* Profile banner */}
            <div style={{ background:"linear-gradient(135deg,"+accentColor+"12,rgba(255,255,255,0.02))", border:"1px solid "+accentColor+"25", borderRadius:18, padding:"14px 18px", marginBottom:14, display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
              <div style={{ fontSize:28 }}>{condition?.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:900, fontSize:14, color:accentColor }}>
                  {condition?.name} · {stage?.name} · {stage?.ages}
                  {urduMode && <span style={{ fontSize:11, background:"rgba(79,142,247,0.2)", border:"1px solid rgba(79,142,247,0.4)", borderRadius:6, padding:"1px 8px", marginLeft:8, color:"#4F8EF7" }}>اردو</span>}
                </div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>
                  {focus?.emoji} {focus?.name}{subject ? " — "+subject : ""} · {stage?.grades}
                </div>
              </div>
              <button onClick={() => setStep(3)}
                style={{ ...S.btn, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"6px 12px", color:"rgba(255,255,255,0.45)", fontSize:11, fontWeight:700 }}>
                Change Focus
              </button>
            </div>

            {/* Chat */}
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, overflow:"hidden" }}>
              <div role="log" aria-label="Chat with Starky" aria-live="polite" style={{ height:isMobile?400:500, overflowY:"auto", padding:isMobile?14:20, display:"flex", flexDirection:"column", gap:14 }}>
                {messages.map((msg, i) => (
                  <div key={i} aria-label={msg.role==="assistant"?"Starky says":"You said"} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start", gap:10, animation:"fadeUp 0.3s ease" }}>
                    {msg.role==="assistant" && (
                      <div aria-hidden="true" style={{ width:32, height:32, borderRadius:"50%", background:accentColor+"20", border:"1px solid "+accentColor+"40", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0, marginTop:2 }}>💜</div>
                    )}
                    <div style={{ maxWidth:"88%", padding:"13px 16px", borderRadius:16, background:msg.role==="user" ? "linear-gradient(135deg,"+accentColor+"CC,"+accentColor+"88)" : "rgba(255,255,255,0.06)", color:msg.role==="user" ? "#060B20" : "rgba(255,255,255,0.93)", fontSize:15, lineHeight:1.85, fontWeight:msg.role==="user"?700:400, whiteSpace:"pre-wrap" }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:accentColor+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>💜</div>
                    <div style={{ display:"flex", gap:5 }}>
                      {[0,0.2,0.4].map((d,j) => <div key={j} style={{ width:9, height:9, borderRadius:"50%", background:accentColor, animation:`bounce 1s ${d}s ease-in-out infinite`, opacity:0.8 }}/>)}
                    </div>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)", fontStyle:"italic" }}>Starky is thinking...</span>
                  </div>
                )}
                <div ref={chatEndRef}/>
              </div>

              {/* Input */}
              <div style={{ padding:"12px 16px", borderTop:"1px solid "+accentColor+"15" }}>
                <textarea value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e => { if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)) sendMessage(input); }}
                  aria-label={`Type your message to Starky about ${subject||focus?.name||"anything"}`}
                  placeholder={`Ask Starky about ${subject||focus?.name||"anything"}... Ctrl+Enter to send`}
                  rows={isMobile?3:4}
                  style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid "+accentColor+"22", borderRadius:14, padding:"12px 14px", color:"#fff", fontSize:15, fontFamily:"'Nunito',sans-serif", resize:"vertical", lineHeight:1.7 }}/>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.2)" }}>
                    Unlimited sessions for SEN students · Ctrl+Enter to send
                  </span>
                  <button onClick={()=>sendMessage(input)} disabled={!input.trim()||loading||limitReached}
                    style={{ ...S.btn, background:input.trim()&&!loading ? "linear-gradient(135deg,"+accentColor+","+accentColor+"BB)" : "rgba(255,255,255,0.08)", borderRadius:14, padding:"10px 24px", color:input.trim()&&!loading?"#060B20":"rgba(255,255,255,0.3)", fontWeight:900, fontSize:14 }}>
                    {loading?"Thinking...":"Send →"}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick prompts */}
            <div style={{ marginTop:12, display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:8 }}>
              {[
                { e:"🔄", t:"Explain differently", p:`Explain that again in a completely different way — try a different approach, a different example, a different analogy.` },
                { e:"📋", t:"Step by step", p:`Break this down into the smallest possible steps. One thing at a time.` },
                { e:"✅", t:"Quick check", p:`Give me 3 quick questions to check understanding of what we just covered. Start simple.` },
                { e:"🌟", t:"Real life example", p:`Give me a real-life example of this that a ${stage?.ages} child with ${condition?.name} would find immediately relevant and interesting.` },
              ].map(q => (
                <button key={q.t} onClick={() => sendMessage(q.p)}
                  style={{ ...S.btn, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"10px 10px", textAlign:"center", color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:700 }}
                  onMouseEnter={e => { e.currentTarget.style.background=accentColor+"12"; e.currentTarget.style.color=accentColor; }}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="rgba(255,255,255,0.6)"; }}>
                  <div style={{ fontSize:18, marginBottom:4 }}>{q.e}</div>
                  {q.t}
                </button>
              ))}
            </div>

            {/* Share session with teacher/therapist */}
            {messages.length > 2 && (
              <button onClick={async () => {
                const { shareLink } = await import('../utils/share');
                const summary = messages.filter(m=>m.role==='assistant').slice(-1)[0]?.content?.slice(0,200) || '';
                const r = await shareLink('drill', { name: condition?.name + ' session', subject: subject || focus?.name || 'SEN', pct: 0, correct: messages.length, total: messages.length, weakAreas: [] },
                  `${condition?.name} learning session on NewWorldEdu — ${messages.length} messages. ${summary}`);
                if (r.method === 'clipboard') alert('Session link copied! Share with teacher or therapist.');
              }} style={{ ...S.btn, width:'100%', marginTop:12, background:'rgba(168,224,99,0.1)', border:'1px solid rgba(168,224,99,0.25)', borderRadius:14, padding:'12px', color:'#A8E063', fontWeight:700, fontSize:13 }}>
                📤 Share Session with Teacher / Therapist
              </button>
            )}
          </div>
        )}

        {/* CREATIVE LEARNING SECTION (visible on steps 1-3) */}
        {step < 4 && (
          <div style={{ marginTop:48, paddingTop:36, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:900, color:"rgba(255,255,255,0.3)", letterSpacing:2, marginBottom:8 }}>CREATIVE LEARNING</div>
              <div style={{ fontWeight:900, fontSize:isMobile?17:22, marginBottom:6 }}>Music, Reading & Arts — Built for Your Child</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.8 }}>Specialist creative learning for every condition, every age.</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)", gap:12 }}>
              {[
                { href:`/music-for-all${condition?`?condition=${condition.id}`:''}`, emoji:"🎵", color:"#FFC300", name:"Music", desc:"Music therapy approaches for 7 SEN profiles. Rhythm, instruments, songwriting." },
                { href:`/reading-for-all${condition?`?condition=${condition.id}`:''}`, emoji:"📖", color:"#63D2FF", name:"Reading", desc:"Evidence-based reading for 7 profiles. Voice input. 120+ books. All ages." },
                { href:`/arts-for-all${condition?`?condition=${condition.id}`:''}`, emoji:"🎨", color:"#A8E063", name:"Arts", desc:"Adapted visual arts and creative expression. Every activity has an adaptive version." },
              ].map(s => (
                <a key={s.href} href={s.href} style={{ textDecoration:"none", background:s.color+"08", border:"1px solid "+s.color+"25", borderRadius:18, padding:16, display:"block", color:"#fff" }}
                  onMouseEnter={e=>{e.currentTarget.style.background=s.color+"15";e.currentTarget.style.borderColor=s.color+"50";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=s.color+"08";e.currentTarget.style.borderColor=s.color+"25";}}>
                  <div style={{ fontSize:28, marginBottom:6 }}>{s.emoji}</div>
                  <div style={{ fontWeight:900, fontSize:15, color:s.color, marginBottom:4 }}>{s.name}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", lineHeight:1.6 }}>{s.desc}</div>
                </a>
              ))}
            </div>
            <div style={{ background:"rgba(199,125,255,0.06)", border:"1px solid rgba(199,125,255,0.2)", borderRadius:14, padding:"14px 20px", marginTop:12, textAlign:"center" }}>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>All included in the </span>
              <span style={{ fontSize:12, fontWeight:800, color:"#C77DFF" }}>Special Needs Plan — $149.99/year</span>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}> · </span>
              <a href="/pricing" style={{ fontSize:12, fontWeight:800, color:"#C77DFF", textDecoration:"none" }}>View Plans →</a>
            </div>
          </div>
        )}
      </div>
      {/* CREATIVE LEARNING SECTIONS */}
      <div style={{marginTop:48,paddingTop:40,borderTop:"1px solid rgba(255,255,255,0.07)"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{display:"inline-block",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"4px 16px",fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",letterSpacing:2,marginBottom:12}}>CREATIVE LEARNING</div>
          <h2 style={{fontSize:isMobile?20:28,fontWeight:900,margin:"0 0 8px",color:"#fff"}}>Music, Reading <span style={{color:"#C77DFF"}}>&</span> Arts</h2>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.45)",maxWidth:560,margin:"0 auto",lineHeight:1.8}}>Specialist creative learning built for children with autism, ADHD, dyslexia, Down syndrome, cerebral palsy, visual impairment, and complex communication needs.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)",gap:14}}>
          {[
            {href:`/music-for-all${condition?`?condition=${condition.id}`:''}`,emoji:"🎵",color:"#FFC300",name:"Music",tag:"Every child is musical",desc:"Music therapy approaches for 7 special needs profiles. Rhythm, instruments, songwriting and listening activities — each adapted to the child."},
            {href:`/reading-for-all${condition?`?condition=${condition.id}`:''}`,emoji:"📖",color:"#63D2FF",name:"Reading",tag:"Every child deserves a reading life",desc:"Evidence-based reading support across 7 profiles. Voice input so children can speak to Starky. 120+ books with specialist teaching modes."},
            {href:`/arts-for-all${condition?`?condition=${condition.id}`:''}`,emoji:"🎨",color:"#A8E063",name:"Arts",tag:"Every child has something to express",desc:"Adapted visual arts and creative expression. Low-tech and high-tech options. Every activity has an adaptive version for every need."},
          ].map(function(s){return(
            <a key={s.href} href={s.href} style={{textDecoration:"none",display:"block",background:s.color+"0A",border:"2px solid "+s.color+"30",borderRadius:20,padding:20,color:"#fff",transition:"all 0.15s"}}
              onMouseEnter={function(e){e.currentTarget.style.background=s.color+"18";e.currentTarget.style.borderColor=s.color;e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={function(e){e.currentTarget.style.background=s.color+"0A";e.currentTarget.style.borderColor=s.color+"30";e.currentTarget.style.transform="none";}}>
              <div style={{fontSize:36,marginBottom:10}}>{s.emoji}</div>
              <div style={{fontWeight:900,fontSize:18,color:s.color,marginBottom:4}}>{s.name}</div>
              <div style={{fontSize:12,fontStyle:"italic",color:s.color+"BB",marginBottom:10}}>{s.tag}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.7,marginBottom:14}}>{s.desc}</div>
              <div style={{background:s.color,borderRadius:10,padding:"9px 14px",textAlign:"center",fontWeight:900,fontSize:13,color:"#060B20"}}>Open {s.name} →</div>
            </a>
          );})}
        </div>
        <div style={{background:"rgba(199,125,255,0.06)",border:"1px solid rgba(199,125,255,0.2)",borderRadius:16,padding:"20px 28px",marginTop:16,textAlign:"center"}}>
          <div style={{fontWeight:800,fontSize:14,color:"rgba(255,255,255,0.8)",marginBottom:6}}>All included in the Special Needs Plan — $149.99/year</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.8,marginBottom:12}}>Full access to Music, Reading, and Arts — all 7 specialist profiles, 120+ books, evidence-based teaching, and parent guides.</div>
          <a href="/pricing" style={{display:"inline-block",background:"linear-gradient(135deg,#C77DFF,#7B5EA7)",borderRadius:12,padding:"10px 24px",color:"#fff",fontWeight:900,fontSize:13,textDecoration:"none"}}>View Plans</a>
        </div>
      </div>

      {/* ── SEN Practice Zone ───────────────────────── */}
      <div style={{maxWidth:600,margin:"0 auto 40px",padding:"0 16px"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{display:"inline-block",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"4px 16px",fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",letterSpacing:2,marginBottom:12}}>PRACTICE ZONE</div>
          <h2 style={{fontFamily:"'Nunito',sans-serif",fontSize:"clamp(22px,5vw,30px)",fontWeight:900,margin:"0 0 10px"}}>
            ✨ Practice at Your Pace
          </h2>
          <p style={{fontSize:14,color:"rgba(255,255,255,0.5)",lineHeight:1.7,maxWidth:420,margin:"0 auto"}}>
            No timer. No pressure. Starky celebrates every answer — right or wrong. Just learning, one step at a time.
          </p>
        </div>

        {condition ? (
          <SENDrillWidget condition={condition} stage={stage} subject={subject} />
        ) : (
          <div style={{background:"rgba(167,139,250,0.06)",border:"2px dashed rgba(167,139,250,0.2)",borderRadius:20,padding:"28px 24px",textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:12}}>💜</div>
            <div style={{fontWeight:800,fontSize:16,marginBottom:8,fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.8)"}}>Select your child's condition above</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.7}}>Once you tell Starky about your child, the Practice Zone will open — adapted specially for them.</div>
          </div>
        )}
      </div>

    </div>
  );
}
