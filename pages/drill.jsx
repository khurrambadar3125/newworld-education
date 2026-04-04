/**
 * pages/drill.jsx — Cambridge Past Paper Drill
 * Enhanced UX: timer, hints, live score, camera upload, better mobile
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useSpacedRep } from '../utils/useSpacedRep';
import useStreaks, { StreakWidget } from '../utils/useStreaks';
import { useSessionLimit, SessionLimitBanner, LimitReachedModal } from '../utils/useSessionLimit';
import LegalFooter from '../components/LegalFooter';
/* ─── Audio feedback engine ─── */
let _audioCtx = null;
function getAudioCtx() { if (!_audioCtx) try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch {} return _audioCtx; }
function playTone(f, type, vol, dur, delay) {
  const c = getAudioCtx(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain();
  o.connect(g); g.connect(c.destination); o.type = type || 'sine'; o.frequency.value = f;
  const t = c.currentTime + (delay || 0);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol || 0.2, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.start(t); o.stop(t + dur + 0.05);
}
function sndCorrect() { playTone(523, 'sine', 0.22, 0.32); playTone(659, 'sine', 0.22, 0.32, 0.16); }
function sndWrong() { playTone(220, 'sawtooth', 0.15, 0.25); }
function sndStreak() { playTone(523, 'sine', 0.25, 0.5); playTone(659, 'sine', 0.25, 0.45, 0.15); playTone(784, 'sine', 0.25, 0.45, 0.3); }
function sndTick() { playTone(900, 'sine', 0.06, 0.07); }

/* ─── Confetti component ─── */
function DrillConfetti() {
  const cols = ['#4F8EF7', '#A8E063', '#FFC300', '#FF6B6B', '#7C5CBF', '#63D2FF'];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 50 }}>
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute', width: 10, height: 10, borderRadius: 2,
          background: cols[i % cols.length],
          left: Math.random() * 100 + '%', top: -10,
          animation: `drillConfettiFall ${0.8 + Math.random() * 0.8}s ${Math.random() * 0.4}s ease-in forwards`,
          opacity: 0,
        }} />
      ))}
      <style>{`@keyframes drillConfettiFall{0%{opacity:1;transform:translateY(-20px) rotate(0)}100%{opacity:0;transform:translateY(120px) rotate(720deg)}}`}</style>
    </div>
  );
}

const TOPICS = {
  'Biology': ['Cell Structure & Organisation','Diffusion, Osmosis & Active Transport','Biological Molecules','Enzymes','Plant Nutrition (Photosynthesis)','Animal Nutrition & Digestion','Gas Exchange','Transport in Plants','Transport in Humans (Circulatory System)','Respiration','Excretion & Homeostasis','Coordination & Response (Nervous System)','Hormones & Endocrine System','Reproduction','Inheritance & Genetics','Variation & Natural Selection','Ecology & Environment','Human Influences on the Environment'],
  'Chemistry': ['Atomic Structure & The Periodic Table','Chemical Bonding','Stoichiometry & Moles','Acids, Bases & Salts','The Mole & Calculations','Electrolysis','Energy Changes in Chemical Reactions','Rates of Reaction','Equilibrium (Le Chatelier\'s Principle)','Redox Reactions','Group Properties (Group 1, 2, 7, 0)','Transition Metals','Organic Chemistry — Alkanes & Alkenes','Organic Chemistry — Alcohols & Acids','Polymers','Nitrogen & Sulfur Chemistry','Extraction of Metals','Water Chemistry'],
  'Physics': ['Measurements & Units','Motion (Kinematics)','Forces & Newton\'s Laws','Momentum & Impulse','Work, Energy & Power','Pressure','Thermal Physics (Heat Transfer)','Thermal Properties of Matter','Waves — Properties & Behaviour','Light & Optics','Sound','Electrostatics','Current Electricity & Circuits','Magnetic Effects of Current','Electromagnetic Induction','Atomic Structure & Radioactivity','Nuclear Physics','Space Physics'],
  'Mathematics': ['Number (Fractions, Decimals, Percentages)','Algebra — Expressions & Equations','Sequences & Series','Functions','Coordinate Geometry (Straight Lines)','Quadratic Equations & Graphs','Simultaneous Equations','Indices & Surds','Trigonometry (SOH CAH TOA)','Trigonometry (Sine & Cosine Rules)','Circle Theorems','Mensuration (Area & Volume)','Vectors','Matrices','Probability','Statistics (Mean, Median, Mode)','Differentiation','Integration'],
  'Economics': ['Basic Economic Problem','Supply & Demand','Price Elasticity','Market Structures','Production & Costs','National Income & GDP','Economic Growth','Unemployment','Inflation','Monetary Policy','Fiscal Policy','International Trade','Balance of Payments','Exchange Rates','Development Economics','Market Failure & Externalities'],
  'English Language': ['Reading Comprehension','Inference & Deduction','Summary Writing','Directed Writing','Descriptive Writing','Narrative Writing','Argumentative & Persuasive Writing','Report & Letter Writing','Language Analysis (Writer\'s Techniques)','Vocabulary in Context'],
  'Computer Science': ['Data Representation (Binary, Hex)','Number Conversions','Logic Gates & Boolean Algebra','Algorithms & Pseudocode','Flowcharts','Programming Concepts','Data Structures (Arrays, Lists)','Searching & Sorting Algorithms','Databases','Computer Networks','Internet & Web Technologies','Security & Encryption','Operating Systems','Hardware Components','Software Development Lifecycle'],
  'Pakistan Studies': ['Land & People of Pakistan','Physical Geography of Pakistan','Climate of Pakistan','Agriculture in Pakistan','Industry & Trade','Population & Urbanisation','Movement for Pakistan','Creation of Pakistan (1947)','Constitutional Development','Political History (1947–present)','Economic Development','Social Issues & Development'],
  'Geography': ['River Processes & Landforms','Earthquakes & Volcanoes','Weather & Climate','Rocks & Weathering','Population','Settlement','Migration','Urbanisation','Industry','Tourism','Agriculture & Food','Environmental Management','Map Skills (Grid References, Scale, Cross-sections)'],
  'History': ['Source Analysis Skills','WWI Causes & Consequences','Treaty of Versailles','League of Nations','Rise of Dictators','WWII Causes & Consequences','Cold War','Arab-Israeli Conflict','Indian Independence','Decolonisation','Civil Rights','International Relations 1919–1945','International Relations 1945–2000'],
  'Business Studies': ['Business Objectives & Stakeholders','Forms of Business Organisation','Marketing Mix','Market Research','Production Methods','Quality Management','Finance — Sources & Cash Flow','Profit & Loss, Break-Even','Human Resource Management','Motivation Theory','External Environment','Globalisation & Multinationals'],
  'Accounting': ['Double Entry Bookkeeping','Trial Balance','Income Statement (Trading & Profit/Loss)','Balance Sheet','Bank Reconciliation','Depreciation','Provisions for Bad Debts','Corrections of Errors','Suspense Accounts','Control Accounts','Cash Flow Statements','Incomplete Records','Partnership Accounts','Ratio Analysis'],
  'Sociology': ['Research Methods','Family','Education','Crime & Deviance','Social Inequality','Media','Social Stratification','Poverty','Globalisation','Theory — Functionalism','Theory — Marxism','Theory — Feminism','Theory — Interactionism'],
  'Additional Mathematics': ['Quadratics & Polynomials','Indices & Surds','Logarithms & Exponentials','Trigonometry (Identities & Equations)','Coordinate Geometry (Circles & Lines)','Differentiation (Chain, Product, Quotient)','Integration (Definite & Indefinite)','Kinematics (Displacement, Velocity, Acceleration)','Binomial Theorem','Permutations & Combinations','Matrices','Vectors in 2D'],
  'Statistics': ['Data Collection & Sampling','Averages & Measures of Spread','Cumulative Frequency & Box Plots','Histograms & Frequency Density','Probability (Combined Events)','Tree Diagrams & Venn Diagrams','Binomial Distribution','Normal Distribution','Correlation & Regression','Time Series','Index Numbers','Chi-Squared Test'],
  'Islamiyat': ['Life of the Prophet ﷺ — Makkan Period','Life of the Prophet ﷺ — Madinan Period','Quran — Selected Passages','Hadith — Selected Hadith','The Rightly-Guided Caliphs','Pillars of Islam','Articles of Faith','Islamic Practices (Worship)','Islamic Ethics & Morality','Islamic History — Spread of Islam'],
  'Urdu': ['Reading Comprehension (نثر)','Poetry Comprehension (نظم)','Essay Writing (مضمون نویسی)','Letter Writing (خط نویسی)','Summary Writing','Grammar (قواعد)','Translation','Vocabulary & Idioms (محاورے)','Story Writing','Dialogue Writing'],
  'Literature in English': ['Drama — Set Text Analysis','Prose — Set Text Analysis','Poetry Anthology','Unseen Poetry','Character Analysis','Theme Analysis','Writer\'s Techniques','Context (Social & Historical)','Comparative Analysis','Quotation Analysis'],
  'Psychology': ['Research Methods & Ethics','Cognitive Psychology','Social Psychology','Learning Theories','Biological Psychology','Abnormality','Health Psychology','Organisational Psychology'],
  'Law': ['English Legal System','Criminal Law — Offences Against Person','Criminal Law — Offences Against Property','Law of Tort — Negligence','Law of Tort — Nuisance & Occupiers','Contract Law — Formation','Contract Law — Terms & Vitiating Factors','Human Rights Law','Judicial Precedent','Statutory Interpretation'],
  'Further Mathematics': ['Proof by Induction','Complex Numbers','Polar Coordinates','Matrices (Eigenvalues & Eigenvectors)','Differential Equations','Vectors (3D)','Hyperbolic Functions','Further Calculus','Further Probability','Further Mechanics'],
  'Commerce': ['Home Trade & Retail','Wholesale & Distribution','International Trade','Transport & Communication','Insurance','Banking & Finance','Advertising','Business Documents','E-Commerce','Government & Trade'],
};

const DEFAULT_TOPICS = ['Key Concepts & Definitions','Core Theory','Data Analysis','Extended Response','Case Studies','Application Questions','Exam Technique','Common Mistakes'];
const getTopics = (subject) => TOPICS[subject] || DEFAULT_TOPICS;

const SUBJECTS_OLEVEL = ['Biology','Chemistry','Physics','Mathematics','English Language','Economics','Computer Science','Pakistan Studies','Accounting','Business Studies','Geography','History','Sociology','Additional Mathematics','Statistics'];
const SUBJECTS_ALEVEL = ['Biology','Chemistry','Physics','Mathematics','Further Mathematics','Economics','Computer Science','English Language','Psychology','Business Studies','Accounting','Sociology','Geography','History','Law'];

const GRADES_YOUNG = [
  { id:'kg',     label:'Nursery / KG', age:'3–5',  emoji:'🌱', color:'#FFB347' },
  { id:'grade1', label:'Grade 1',      age:'5–6',  emoji:'⭐', color:'#FF6B6B' },
  { id:'grade2', label:'Grade 2',      age:'6–7',  emoji:'🌈', color:'#FF8E53' },
  { id:'grade3', label:'Grade 3',      age:'7–8',  emoji:'🚀', color:'#FFC300' },
  { id:'grade4', label:'Grade 4',      age:'8–9',  emoji:'🔬', color:'#A8E063' },
  { id:'grade5', label:'Grade 5',      age:'9–10', emoji:'🌍', color:'#4ECDC4' },
  { id:'grade6', label:'Grade 6',      age:'10–11',emoji:'🏆', color:'#63D2FF' },
  { id:'grade7', label:'Grade 7',      age:'11–12',emoji:'⚡', color:'#A78BFA' },
  { id:'grade8', label:'Grade 8',      age:'12–13',emoji:'🌙', color:'#F472B6' },
  { id:'grade9', label:'Grade 9',      age:'13–14',emoji:'🎯', color:'#34D399' },
];

const SUBJECTS_YOUNG = ['Maths','English','Urdu','Science','Islamiat','Nazra Quran','General Knowledge','Social Studies','Computer','Sindhi','Pashto'];

const TOPICS_YOUNG = {
  'Maths':             ['Numbers & Counting','Addition & Subtraction','Multiplication & Division','Fractions','Decimals','Geometry & Shapes','Measurement','Time & Calendar','Algebra Basics','Word Problems'],
  'English':           ['Reading Comprehension','Grammar & Punctuation','Vocabulary','Spelling','Creative Writing','Poetry','Parts of Speech','Sentence Structure','Letter Writing','Story Writing'],
  'Science':           ['Plants & Animals','Human Body','Materials & Matter','Forces & Motion','Light & Sound','Earth & Space','Weather & Climate','Food & Nutrition','Electricity Basics','Environment'],
  'Urdu':              ['الفاظ کے معنی','گرامر','پڑھنا اور سمجھنا','مضمون نویسی','خط نویسی','محاورے','شاعری','کہانی','تلفظ','ادب'],
  'Islamiat':          ['Five Pillars of Islam','Quran & Surahs','Prophet Stories','Islamic Values','Prayers & Worship','Hadith','Islamic History','Ramadan & Eid','Zakat & Charity','Good Character'],
  'General Knowledge': ['Pakistan Geography','World Countries','Famous People','Science Facts','History Events','Sports','Animals & Nature','Technology','Culture & Traditions','Current Events'],
  'Computer':          ['Computer Basics','Input & Output Devices','Internet Safety','MS Word','MS Excel','Presentations','Coding Basics','Algorithms','Digital Citizenship','Problem Solving'],
  'Social Studies':    ['My Family & Community','Pakistan History','World Geography','Government & Citizenship','Economy Basics','Culture & Society','Human Rights','Environment','Transport','Communication'],
};

const QUESTION_TYPES = [
  { id:'mcq', label:'MCQ', desc:'Multiple choice' },
  { id:'structured', label:'Structured', desc:'Written answer' },
  { id:'mixed', label:'Mixed', desc:'Both types' },
];

const DIFFICULTIES = [
  { id:'easy', label:'Foundation', emoji:'🌱' },
  { id:'medium', label:'Exam level', emoji:'🎯' },
  { id:'hard', label:'Challenge', emoji:'🔥' },
];

// Session length and timer adapt by mode
// Young learners: shorter sessions, no timer pressure
// Exam mode: full sessions with timer
const getSessionConfig = (mode, youngGrade) => {
  if (mode === 'young') {
    const gId = (youngGrade?.id || '').toLowerCase();
    const isVeryYoung = ['kg','grade1','grade2','grade3'].includes(gId);
    return {
      sessionLength: isVeryYoung ? 5 : 7,
      timerMCQ: 0,        // no timer for young learners
      timerStructured: 0,
    };
  }
  return { sessionLength: 10, timerMCQ: 90, timerStructured: 240 };
};
const SESSION_LENGTH_DEFAULT = 10;

const isMob = typeof window !== 'undefined' && window.innerWidth < 640;
const S = {
  page: { minHeight:'100vh', background:'#080C18', color:'#fff', fontFamily:"-apple-system,BlinkMacSystemFont,'Inter',sans-serif", padding:'0 0 60px' },
  nav: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:isMob?'12px 14px':'14px 20px', borderBottom:'1px solid rgba(255,255,255,.07)', background:'rgba(8,12,24,.97)', position:'sticky', top:0, zIndex:50, WebkitBackdropFilter:'blur(12px)', backdropFilter:'blur(12px)' },
  navLogo: { fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:isMob?14:17, color:'#fff', textDecoration:'none', display:'flex', alignItems:'center', gap:6 },
  navRight: { display:'flex', alignItems:'center', gap:isMob?6:10 },
  navLink: { fontSize:isMob?11:13, color:'rgba(255,255,255,.5)', textDecoration:'none', padding:isMob?'5px 8px':'6px 12px', borderRadius:8, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)' },
  container: { maxWidth:680, margin:'0 auto', padding:isMob?'16px 12px':'24px 16px' },
  h1: { fontFamily:"'Sora',sans-serif", fontSize:isMob?20:26, fontWeight:800, margin:'0 0 6px', lineHeight:1.2 },
  subtitle: { fontSize:isMob?13:14, color:'rgba(255,255,255,.45)', margin:'0 0 28px', lineHeight:1.6 },
  card: { background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, padding:isMob?14:20, marginBottom:16 },
  label: { fontSize:11, fontWeight:700, letterSpacing:'.07em', textTransform:'uppercase', color:'rgba(255,255,255,.4)', marginBottom:10, display:'block' },
  grid2: { display:'grid', gridTemplateColumns:isMob?'1fr':'1fr 1fr', gap:8 },
  grid3: { display:'grid', gridTemplateColumns:isMob?'1fr 1fr':'repeat(3,1fr)', gap:8 },
  optionBtn: (selected) => ({ background:selected?'rgba(79,142,247,.15)':'rgba(255,255,255,.04)', border:`1px solid ${selected?'rgba(79,142,247,.5)':'rgba(255,255,255,.08)'}`, borderRadius:10, padding:'14px 14px', cursor:'pointer', color:selected?'#4F8EF7':'rgba(255,255,255,.65)', fontSize:14, fontWeight:selected?700:500, textAlign:'left', transition:'all .15s', WebkitTapHighlightColor:'transparent', minHeight:48 }),
  primaryBtn: { background:'linear-gradient(135deg,#4F8EF7,#6366F1)', border:'none', borderRadius:12, padding:'14px 28px', color:'#fff', fontSize:15, fontWeight:700, fontFamily:"'Sora',sans-serif", cursor:'pointer', width:'100%', marginTop:8, WebkitTapHighlightColor:'transparent' },
  ghostBtn: { background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:12, padding:'13px 28px', color:'rgba(255,255,255,.6)', fontSize:14, fontWeight:600, cursor:'pointer', width:'100%', marginTop:8, WebkitTapHighlightColor:'transparent' },
  badge: (color) => ({ display:'inline-block', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:100, background:`${color}22`, border:`1px solid ${color}55`, color, marginLeft:6, verticalAlign:'middle' }),
  questionText: { fontSize:16, lineHeight:1.75, color:'rgba(255,255,255,.9)', background:'rgba(79,142,247,.07)', border:'1px solid rgba(79,142,247,.2)', borderRadius:12, padding:'18px 20px', marginBottom:20 },
  textarea: { width:'100%', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:10, color:'#fff', padding:'12px 14px', fontSize:16, lineHeight:1.6, fontFamily:'inherit', outline:'none', resize:'vertical', minHeight:100, boxSizing:'border-box', WebkitAppearance:'none' },
  feedbackBox: (correct) => ({ background:correct?'rgba(74,222,128,.07)':'rgba(248,113,113,.07)', border:`1px solid ${correct?'rgba(74,222,128,.25)':'rgba(248,113,113,.25)'}`, borderRadius:14, padding:'18px 20px', marginBottom:16 }),
  scoreRow: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 },
  tipBox: { background:'rgba(251,191,36,.07)', border:'1px solid rgba(251,191,36,.2)', borderRadius:10, padding:'12px 16px', marginTop:14, fontSize:13, color:'rgba(255,255,255,.8)', lineHeight:1.6 },
  modelBox: { background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:10, padding:'12px 16px', marginTop:10, fontSize:13, color:'rgba(255,255,255,.65)', lineHeight:1.7 },
};

// ── Timer component ──────────────────────────────────────────────────────────
function QuestionTimer({ seconds, onExpire, paused }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => { setLeft(seconds); }, [seconds]);
  useEffect(() => {
    if (!seconds || paused || left <= 0) return;
    const id = setInterval(() => setLeft(p => { if (p <= 1) { clearInterval(id); onExpire(); return 0; } return p - 1; }), 1000);
    return () => clearInterval(id);
  }, [paused, seconds]);
  if (!seconds) return null; // No timer for young learners
  const pct = (left / seconds) * 100;
  const color = pct > 50 ? '#4ADE80' : pct > 20 ? '#FCD34D' : '#F87171';
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
      <div style={{ flex:1, height:6, borderRadius:100, background:'rgba(255,255,255,.08)', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:100, transition:'width 1s linear' }} />
      </div>
      <span style={{ fontSize:13, fontWeight:700, color, minWidth:32, textAlign:'right' }}>{left}s</span>
    </div>
  );
}

export default function DrillPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const sr = useSpacedRep(userProfile);
  const { logSession, streak, totalQuestions, badges } = useStreaks(userProfile?.email || userProfile?.name || 'guest');

  // Setup
  const [mode, setMode] = useState('');
  const [level, setLevel] = useState('O Level');
  const [youngGrade, setYoungGrade] = useState(null);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionType, setQuestionType] = useState('mixed');
  const [drillType, setDrillType] = useState(''); // weak_spots | command_words | mark_scheme | calculations | past_paper
  const [urlContext, setUrlContext] = useState(null); // summer track context

  // Camera
  const [cameraImage, setCameraImage] = useState(null);
  const [cameraMode, setCameraMode] = useState(false);
  const cameraRef = useRef(null);
  const fileRef = useRef(null);
  const subjectRef = useRef(null);
  const topicRef = useRef(null);
  const diffRef = useRef(null);
  const startRef = useRef(null);

  // Drill
  const [phase, setPhase] = useState('setup');
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [structuredAns, setStructuredAns] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hint, setHint] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Session config — adapts by mode/grade
  const sessionConfig = getSessionConfig(mode, youngGrade);
  const SESSION_LENGTH = sessionConfig.sessionLength;
  const TIMER_MCQ = sessionConfig.timerMCQ;
  const TIMER_STRUCTURED = sessionConfig.timerStructured;

  // Live score
  const [sessionResults, setSessionResults] = useState([]);
  const [questionNum, setQuestionNum] = useState(0);
  const [liveScore, setLiveScore] = useState(0);
  const [liveMax, setLiveMax] = useState(0);
  const [combo, setCombo] = useState(0); // consecutive correct answers
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => { if (showConfetti) { const t = setTimeout(() => setShowConfetti(false), 1500); return () => clearTimeout(t); } }, [showConfetti]);

  // Session limits
  const { limitReached, recordCall, callsLeft } = useSessionLimit(userProfile?.email);
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    try { const s = localStorage.getItem('nw_user'); if (s) setUserProfile(JSON.parse(s)); } catch {}
    // Restore last drill settings (so student doesn't re-pick mode/level/subject every time)
    try {
      const saved = localStorage.getItem('nw_drill_prefs');
      if (saved) {
        const prefs = JSON.parse(saved);
        if (prefs.mode) setMode(prefs.mode);
        if (prefs.level) setLevel(prefs.level);
        if (prefs.subject) setSubject(prefs.subject);
      }
    } catch {}
    // Read URL query params for summer track context
    const q = router.query;
    if (q.subject && !subject) setSubject(decodeURIComponent(q.subject));
    if (q.context) {
      setUrlContext(q.context);
      // Map context to default subject if no subject specified
      if (!q.subject && !subject) {
        const contextSubjects = { emsat: 'English Language', ib: 'Mathematics', university: 'English Language' };
        if (contextSubjects[q.context]) setSubject(contextSubjects[q.context]);
      }
    }
  }, [router.query]);

  const subjects = mode === 'young' ? SUBJECTS_YOUNG : (level === 'O Level' ? SUBJECTS_OLEVEL : SUBJECTS_ALEVEL);
  const youngTopics = subject && mode === 'young' ? (TOPICS_YOUNG[subject] || DEFAULT_TOPICS) : [];
  const topics = subject ? getTopics(subject) : [];
  const dueTopics = subject ? sr.getDueTopics(subject) : [];

  // Track which question IDs have been served this session (avoid repeats)
  const [servedBankIds, setServedBankIds] = useState([]);

  // ── Generate question ────────────────────────────────────────────────────────
  const generateQuestion = useCallback(async (targetTopic, imageData) => {
    setLoading(true); setError(''); setFeedback(null);
    setSelectedOption(''); setStructuredAns(''); setHint(null); setTimedOut(false);

    let t = targetTopic || topic;
    // "All Topics" mode: pick a random topic each question for variety
    if (t === '__ALL__') {
      const allTopics = getTopics(subject);
      t = allTopics[Math.floor(Math.random() * allTopics.length)];
    }
    let type = questionType;
    if (type === 'mixed') type = questionNum % 2 === 0 ? 'mcq' : 'structured';

    try {
      // ── Question Bank disabled — only human-verified questions will be served
      // when the bank is populated from verified past papers in the future.
      // For now, all questions are generated fresh by AI per session via /api/drill.

      // ── Fallback: direct AI generation via /api/drill ──────────────────────
      const body = { action:'generate', level, subject, topic:t, difficulty, questionType:type };
      // Pass country for curriculum-aware content serving
      try { body.country = localStorage.getItem('user_country') || 'PK'; } catch { body.country = 'PK'; }
      if (urlContext) body.context = urlContext;
      if (imageData) { body.imageBase64 = imageData.base64; body.imageType = imageData.type; }
      const res = await fetch('/api/drill', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
      let data;
      try { data = await res.json(); } catch { throw new Error('Invalid response'); }
      if (!res.ok || data.error) { setError(data?.error || 'Failed to generate question. Please try again.'); return; }
      setQuestion(data);
    } catch { setError('Failed to generate question. Please try again.'); }
    finally { setLoading(false); }
  }, [level, subject, topic, difficulty, questionType, questionNum, mode, urlContext, servedBankIds]);

  // ── Get hint ─────────────────────────────────────────────────────────────────
  const getHint = async () => {
    if (!question || hintLoading) return;
    setHintLoading(true);
    try {
      const res = await fetch('/api/drill', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action:'hint', question:question.question, subject, topic:question.topic||topic, level }) });
      const data = await res.json();
      setHint(data.hint || 'Think about the key concept in this topic…');
    } catch { setHint('Think step by step — what do you already know about this topic?'); }
    finally { setHintLoading(false); }
  };

  // ── Handle camera/file upload ────────────────────────────────────────────────
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate file type and size
    const allowed = ['image/jpeg','image/png','image/webp','image/heic','image/gif'];
    if (!file.type.startsWith('image/') && !allowed.includes(file.type)) {
      setError('Please upload an image file (photo, screenshot, or scan).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image too large (max 10MB). Try taking a closer photo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(',')[1];
      setCameraImage({ base64, type:file.type || 'image/jpeg', name:file.name });
      setCameraMode(false);
      setError('');
    };
    reader.onerror = () => setError('Could not read image. Please try again.');
    reader.readAsDataURL(file);
  };

  // ── Quick Start — auto-detect grade, pick subject, skip setup ──────────────
  const quickStart = (overrideSubject) => {
    if (limitReached) { setShowLimitModal(true); return; }
    const p = userProfile || {};
    const gradeId = (p.gradeId || '').toLowerCase();

    // Detect mode and level from profile
    const isYoung = ['kg','grade1','grade2','grade3','grade4','grade5','grade6','grade7','grade8','grade9'].includes(gradeId);
    const isALevel = gradeId.includes('alevel') || gradeId === 'grade11' || gradeId === 'grade12';

    const qsMode = isYoung ? 'young' : 'exam';
    const qsLevel = isALevel ? 'A Level' : 'O Level';

    // Pick subject: override > last used > first available
    const subjectList = isYoung ? SUBJECTS_YOUNG : (isALevel ? SUBJECTS_ALEVEL : SUBJECTS_OLEVEL);
    const qsSubject = overrideSubject || p.lastSubject || subjectList[0];

    // Set all state and start
    setMode(qsMode);
    setLevel(qsLevel);
    setSubject(qsSubject);
    setTopic('__ALL__');
    setDifficulty('medium');
    setQuestionType('mixed');
    setSessionResults([]); setQuestionNum(0); setLiveScore(0); setLiveMax(0); setCombo(0);
    setPhase('drilling');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);

    // Pick a random topic from the subject
    const allTopics = getTopics(qsSubject);
    const randomTopic = allTopics[Math.floor(Math.random() * allTopics.length)];
    generateQuestion(randomTopic);
  };

  // ── Start session ────────────────────────────────────────────────────────────
  const startSession = () => {
    if (limitReached) { setShowLimitModal(true); return; }
    if (cameraImage) {
      setSessionResults([]); setQuestionNum(0); setLiveScore(0); setLiveMax(0); setCombo(0);
      setPhase('drilling');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
      generateQuestion(topic || 'From uploaded question', cameraImage);
      setCameraImage(null);
      return;
    }
    if (!subject || !topic) return;
    // Save drill preferences so student doesn't re-pick every time
    try { localStorage.setItem('nw_drill_prefs', JSON.stringify({ mode, level, subject })); } catch {}
    setSessionResults([]); setQuestionNum(0); setLiveScore(0); setLiveMax(0); setCombo(0);
    setPhase('drilling');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    generateQuestion(topic);
  };

  // ── Submit answer ────────────────────────────────────────────────────────────
  const submitAnswer = async (forceSubmit = false) => {
    if (!question) return;
    const answer = question.type === 'mcq' ? selectedOption : structuredAns.trim();
    if (!answer && !forceSubmit) return;
    setLoading(true);
    try {
      let data;

      // ── MCQ: SERVER-SIDE grading — answer never sent to client ─────
      if (question.type === 'mcq' && question._bankId) {
        try {
          const gradeRes = await fetch('/api/question-bank/grade', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ bankId: question._bankId, answer: answer || '' }) });
          const gradeData = await gradeRes.json();
          data = {
            correct: gradeData.correct,
            score: gradeData.correct ? 1 : 0,
            maxScore: 1,
            feedback: gradeData.feedback || (gradeData.correct ? 'Correct!' : 'Incorrect'),
            modelAnswer: gradeData.modelAnswer || gradeData.correctAnswer,
            markSchemeHint: gradeData.markSchemeHint,
          };
        } catch {
          // If grade API fails, show neutral message — never guess
          data = { correct: null, score: 0, maxScore: 1, feedback: 'Could not verify answer. Please try again.', modelAnswer: '' };
        }
      }
      // ── MCQ: AI-generated (no bankId) — client fallback ─────
      else if (question.type === 'mcq' && question.correctOption) {
        const isCorrect = answer === question.correctOption;
        try {
          const res = await fetch('/api/drill', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action:'grade', level, subject, topic:question.topic||topic, question:question.question, studentAnswer:answer||'(no answer — time ran out)', questionType:'mcq', options:question.options, marks:1 }) });
          data = await res.json();
        } catch {
          data = {};
        }
        data.correct = isCorrect;
        data.score = isCorrect ? 1 : 0;
        data.maxScore = 1;
        if (!isCorrect) {
          data.feedback = data.feedback || `The correct answer is ${question.correctOption}: ${question.options?.[question.correctOption] || ''}`;
          data.modelAnswer = `${question.correctOption}: ${question.options?.[question.correctOption] || ''}`;
        }
      }
      // ── Structured: AI grading (partial credit makes sense here) ────────
      else {
        const res = await fetch('/api/drill', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action:'grade', level, subject, topic:question.topic||topic, question:question.question, studentAnswer:answer||'(no answer — time ran out)', questionType:question.type, options:question.options, marks:question.marks }) });
        try { data = await res.json(); } catch { throw new Error('Invalid response'); }
      }

      setFeedback(data);
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
      const t = question.topic || topic;
      const quality = typeof data.quality === 'number' ? Math.max(0, Math.min(5, data.quality)) : (data.correct === true ? 4 : data.correct === false ? 1 : 2);
      sr.recordAnswer(subject, t, quality);
      setSessionResults(prev => [...prev, { topic:t, correct:!!data.correct, score:data.score || 0, maxScore:data.maxScore || 1, quality }]);
      // Signal collection — drill performance
      try {
        const { recordDrillSignal } = await import('../utils/signalCollector');
        const profile = JSON.parse(localStorage.getItem('nw_user') || '{}');
        recordDrillSignal({ email: profile.email || 'anonymous', subject, topic: t, score: data.score || 0, maxScore: data.maxScore || 1, timePerQuestion: 0, hintsUsed: hint ? 1 : 0, completed: true });
      } catch {}
      // Question bank — record performance for quality scoring
      if (question._bankId) {
        try {
          fetch('/api/question-bank/record', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionId: question._bankId, score: data.score || 0, maxScore: data.maxScore || 1 }),
          });
        } catch {}
      }
      // Mastery tracking — feed every answer into the learning engine
      fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'record', questionId: question._bankId || null, subject, level, topic: t, correct: !!data.correct }),
      }).catch(() => {}); // Silent fail OK — mastery is secondary to drill experience
      setLiveScore(s => s + (data.score || 0));
      setLiveMax(m => m + (data.maxScore || 1));
      setCombo(c => {
        const next = data.correct ? c + 1 : 0;
        // Audio feedback
        if (data.correct) { if (next >= 5 && next % 5 === 0) sndStreak(); else sndCorrect(); }
        else sndWrong();
        // Confetti on streaks
        if (next >= 3 && data.correct) setShowConfetti(true);
        return next;
      });
    } catch { setError('Grading failed. Please try again.'); }
    finally { setLoading(false); }
  };

  // ── Timer expired ────────────────────────────────────────────────────────────
  const handleTimerExpire = () => { setTimedOut(true); submitAnswer(true); };

  // ── Next question ────────────────────────────────────────────────────────────
  const nextQuestion = () => {
    const nextNum = questionNum + 1;
    // Calculate from sessionResults directly to avoid stale state race condition
    const totalScore = sessionResults.reduce((s, r) => s + (r.score || 0), 0);
    const totalMax = sessionResults.reduce((s, r) => s + (r.maxScore || 1), 0);
    const sessionPct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
    if (nextNum >= SESSION_LENGTH) {
      logSession(subject, SESSION_LENGTH, sessionPct);
      try { recordCall(); } catch {} // Count drill session against daily limit
      setPhase('summary');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
      // Notify parent of drill results (fire and forget)
      try {
        const p = userProfile || {};
        if (p.email) {
          const weakAreas = sessionResults.filter(r => !r.correct).map(r => r.topic);
          fetch('/api/notify-parent', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parentEmail: p.parentEmail || p.email, studentName: p.name, type: 'drill', subject, score: totalScore, total: totalMax, weakAreas }),
          }).catch(() => {});
        }
      } catch {}
      return;
    }
    setQuestionNum(nextNum);
    const due = sr.getDueTopics(subject);
    const nextTopic = due.length ? due[questionNum % due.length] : topic;
    generateQuestion(nextTopic);
  };

  const sessionPct = liveMax > 0 ? Math.round((liveScore / liveMax) * 100) : 0;
  const correctCount = sessionResults.filter(r => r.correct).length;

  // ══════════════════════════════════════════════════════
  // SETUP SCREEN
  // ══════════════════════════════════════════════════════
  if (phase === 'setup') return (
    <>
      <Head>
        <title>Drill Mode ★ — NewWorldEdu</title>
        <meta name="description" content="Practice Cambridge O Level and A Level exam questions with timed drills, hints, and mark scheme grading. Free personalised practice for all subjects." />
        <meta property="og:title" content="Practice Drill — Cambridge Exam Questions" />
        <meta property="og:description" content="Practice Cambridge O Level and A Level exam questions with timed drills, hints, and mark scheme grading. Free personalised practice for all subjects." />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap" rel="stylesheet" />
      </Head>
      <div style={S.page}>
        <nav style={S.nav}>
          <Link href="/"><a style={S.navLogo}>NewWorldEdu<span style={{color:'#4F8EF7'}}>★</span></a></Link>
          <div style={S.navRight}>
            {sr.dueCount > 0 && <span style={{...S.badge('#FCD34D'),fontSize:12,fontWeight:700}}>{sr.dueCount} due</span>}
            <Link href="/"><a style={S.navLink}>← Home</a></Link>
          </div>
        </nav>

        <div style={S.container}>
          <h1 style={S.h1}>{urlContext === 'emsat' ? 'EmSAT Drill 🇦🇪' : urlContext === 'ib' ? 'IB Drill 🎓' : 'Drill Mode 📚'}</h1>
          <p style={S.subtitle}>{urlContext === 'emsat' ? 'EmSAT-targeted practice. University score targets: UAEU 1250+, AUS 1500+, Khalifa 1400+.' : urlContext === 'ib' ? 'IB Diploma practice — aligned with IB command terms and assessment criteria.' : 'Practice questions powered by Starky. Choose your level to begin.'}</p>
          {urlContext && (
            <div style={{background:'rgba(78,205,196,0.08)',border:'1px solid rgba(78,205,196,0.2)',borderRadius:12,padding:'10px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:13,fontWeight:700,color:'#4ECDC4'}}>☀️ UAE Summer Track: {urlContext === 'emsat' ? 'EmSAT Intensive' : urlContext === 'ib' ? 'IB Prep' : urlContext === 'university' ? 'University Ready' : urlContext}</span>
              <a href="/summer-uae" style={{fontSize:11,color:'rgba(255,255,255,0.4)',textDecoration:'none',marginLeft:'auto'}}>View all tracks →</a>
            </div>
          )}

          {/* Quick Start — one tap, auto-detects everything */}
          {!mode && userProfile?.gradeId && (
            <div style={{marginBottom:20}}>
              <button onClick={() => quickStart()} style={{...S.primaryBtn, marginTop:0, background:'linear-gradient(135deg,#4ADE80,#22C55E)', fontSize:16, padding:'16px 28px', display:'flex', alignItems:'center', justifyContent:'center', gap:10}}>
                ⚡ Quick Start — 10 Mixed Questions
              </button>
              <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8, marginTop:10}}>
                {(userProfile.gradeId?.includes('olevel') || userProfile.gradeId?.includes('alevel') || ['grade9','grade10','grade11','grade12'].includes(userProfile.gradeId)
                  ? (userProfile.gradeId?.includes('alevel') || ['grade11','grade12'].includes(userProfile.gradeId) ? SUBJECTS_ALEVEL : SUBJECTS_OLEVEL)
                  : SUBJECTS_YOUNG
                ).slice(0,6).map(s => (
                  <button key={s} onClick={() => quickStart(s)} style={{...S.optionBtn(false), textAlign:'center', padding:'10px 8px', fontSize:12, fontWeight:700}}>
                    {s}
                  </button>
                ))}
              </div>
              <div style={{textAlign:'center', marginTop:12}}>
                <span style={{fontSize:12, color:'rgba(255,255,255,0.3)'}}>or choose your own setup below ↓</span>
              </div>
            </div>
          )}

          {!mode && (
            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:16}}>
              <button onClick={() => setMode('young')} style={{background:'rgba(255,179,71,0.08)',border:'2px solid rgba(255,179,71,0.3)',borderRadius:18,padding:'20px 18px',cursor:'pointer',textAlign:'left'}}>
                <div style={{fontSize:26,marginBottom:6,color:'#fff'}}>🌟 Adventure Mode</div>
                <div style={{fontWeight:800,fontSize:15,color:'#FFB347',marginBottom:4}}>KG — Grade 9</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>Fun questions, no pressure, lots of encouragement. Ages 3–14.</div>
              </button>
              <button onClick={() => setMode('exam')} style={{background:'rgba(79,142,247,0.08)',border:'2px solid rgba(79,142,247,0.3)',borderRadius:18,padding:'20px 18px',cursor:'pointer',textAlign:'left'}}>
                <div style={{fontSize:26,marginBottom:6,color:'#fff'}}>🎓 Exam Mode</div>
                <div style={{fontWeight:800,fontSize:15,color:'#4F8EF7',marginBottom:4}}>O Level — A Level</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>Cambridge-style questions, timer, mark schemes, examiner tips.</div>
              </button>
            </div>
          )}

          {/* 📷 Camera Drill CTA */}
          <div style={{...S.card, borderColor:'rgba(167,139,250,.25)', background:'rgba(167,139,250,.06)', marginBottom:20}}>
            <div style={{fontWeight:800, fontSize:15, color:'#A78BFA', marginBottom:6}}>📷 Drill from a photo</div>
            <div style={{fontSize:13, color:'rgba(255,255,255,.5)', marginBottom:14, lineHeight:1.6}}>
              Point your camera at any past paper question — Starky reads it and builds your drill instantly.
            </div>
            {cameraImage ? (
              <div style={{display:'flex', alignItems:'center', gap:10, background:'rgba(167,139,250,.1)', border:'1px solid rgba(167,139,250,.3)', borderRadius:10, padding:'10px 14px'}}>
                <span style={{fontSize:20}}>📎</span>
                <span style={{fontSize:13, color:'#A78BFA', fontWeight:700}}>{cameraImage.name}</span>
                <button onClick={() => setCameraImage(null)} style={{marginLeft:'auto', background:'none', border:'none', color:'rgba(255,255,255,.4)', cursor:'pointer', fontSize:16}}>✕</button>
              </div>
            ) : (
              <div style={{display:'flex', gap:8}}>
                <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{display:'none'}} onChange={handleImageUpload} />
                <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleImageUpload} />
                <button onClick={() => cameraRef.current?.click()} style={{flex:1, background:'rgba(167,139,250,.15)', border:'1px solid rgba(167,139,250,.3)', borderRadius:10, padding:'10px', color:'#A78BFA', fontWeight:700, fontSize:13, cursor:'pointer'}}>
                  📷 Camera
                </button>
                <button onClick={() => fileRef.current?.click()} style={{flex:1, background:'rgba(167,139,250,.1)', border:'1px solid rgba(167,139,250,.2)', borderRadius:10, padding:'10px', color:'#A78BFA', fontWeight:700, fontSize:13, cursor:'pointer'}}>
                  📎 Upload
                </button>
              </div>
            )}
          </div>

          {mode === 'young' && (
            <>
              <div style={{...S.card,borderColor:'rgba(255,179,71,0.2)',background:'rgba(255,179,71,0.04)'}}>
                <span style={S.label}>My Grade</span>
                <div style={{display:'flex',flexDirection:'column',gap:7}}>
                  {GRADES_YOUNG.map(g => (
                    <button key={g.id} style={{...S.optionBtn(youngGrade?.id===g.id),display:'flex',alignItems:'center',gap:12,padding:'12px 14px'}} onClick={() => { setYoungGrade(g); setSubject(''); setTopic(''); setTimeout(() => subjectRef.current?.scrollIntoView({behavior:'smooth',block:'start'}), 150); }}>
                      <span style={{fontSize:20}}>{g.emoji}</span>
                      <div style={{textAlign:'left'}}>
                        <div style={{fontWeight:800,fontSize:14,color:youngGrade?.id===g.id?g.color:'#fff'}}>{g.label}</div>
                        <div style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Age {g.age}</div>
                      </div>
                      {youngGrade?.id===g.id && <span style={{marginLeft:'auto',color:g.color,fontSize:16}}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
              {youngGrade && (
                <div ref={subjectRef} style={{...S.card,borderColor:'rgba(255,179,71,0.2)'}}>
                  <span style={S.label}>Subject</span>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8}}>
                    {SUBJECTS_YOUNG.map(s => <button key={s} style={S.optionBtn(subject===s)} onClick={() => { setSubject(s); setTopic(''); }}>{s}</button>)}
                  </div>
                </div>
              )}
              {youngGrade && subject && (
                <div ref={topicRef} style={{...S.card,borderColor:'rgba(255,179,71,0.2)'}}>
                  <span style={S.label}>Topic</span>
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    {youngTopics.map(t => <button key={t} style={S.optionBtn(topic===t)} onClick={() => { setTopic(t); setTimeout(() => startRef.current?.scrollIntoView({behavior:'smooth',block:'start'}), 150); }}>{t}</button>)}
                  </div>
                </div>
              )}
              {youngGrade && subject && topic && (
                <button style={S.primaryBtn} onClick={() => { setLevel(youngGrade.label); startSession(); }}>
                  Start Adventure! 🌟
                </button>
              )}
              <button style={{...S.ghostBtn,marginTop:8}} onClick={() => { setMode(''); setYoungGrade(null); setSubject(''); setTopic(''); }}>← Back</button>
            </>
          )}

          {/* ═══ DRILL TYPE SELECTOR ═══ */}
          {mode === 'exam' && !drillType && (
            <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:16}}>
              <div style={{fontSize:16,fontWeight:800,marginBottom:4}}>Choose your drill type</div>
              {[
                { id: 'weak_spots', icon: '⚡', label: 'Weak Spots', desc: 'Questions from your lowest-scoring Nano goals. Fix what\'s broken.', note: 'Personalised — needs login', color: '#FF6B6B' },
                { id: 'command_words', icon: '📝', label: 'Command Words', desc: 'Same topic, different command words. Master what Cambridge is actually asking.', color: '#4F8EF7' },
                { id: 'mark_scheme', icon: '🎯', label: 'Mark Scheme Language', desc: 'Drill the exact phrases Cambridge requires. Write them until they are automatic.', color: '#C9A84C' },
                { id: 'calculations', icon: '🔢', label: 'Calculations', desc: 'Method under time pressure. Show all working. Units required.', note: 'Maths / Science / Accounting', color: '#4ADE80' },
                { id: 'past_paper', icon: '📚', label: 'Past Paper Style', desc: 'Cambridge-style questions by topic. Timed. Marked against the real mark scheme.', color: '#A78BFA' },
              ].map(dt => (
                <button key={dt.id} onClick={() => setDrillType(dt.id)} style={{ background: `${dt.color}08`, border: `1px solid ${dt.color}33`, borderRadius: 14, padding: '16px 18px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 22 }}>{dt.icon}</span>
                    <span style={{ fontWeight: 800, fontSize: 15, color: dt.color }}>{dt.label}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginLeft: 32 }}>{dt.desc}</div>
                  {dt.note && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 32, marginTop: 2 }}>{dt.note}</div>}
                </button>
              ))}
              <button onClick={() => { setMode(''); setDrillType(''); setSubject(''); setTopic(''); }} style={{ ...S.ghostBtn, marginTop: 4, fontSize: 12 }}>← Back to mode select</button>
            </div>
          )}

          {/* Level */}
          {mode === 'exam' && drillType && <><div style={S.card}>
            <span style={S.label}>Exam Level</span>
            <div style={S.grid2}>
              {['O Level','A Level'].map(l => (
                <button key={l} style={S.optionBtn(level===l)} onClick={() => { setLevel(l); setSubject(''); setTopic(''); }}>
                  {l==='O Level' ? '📚 O Level' : '🎓 A Level'}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div style={S.card}>
            <span style={S.label}>Subject</span>
            <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8}}>
              {subjects.map(s => <button key={s} style={S.optionBtn(subject===s)} onClick={() => { setSubject(s); setTopic(''); setTimeout(() => diffRef.current?.scrollIntoView({behavior:'smooth',block:'start'}), 150); }}>{s}</button>)}
            </div>
          </div>

          {/* Topic */}
          {subject && (
            <div style={S.card}>
              <span style={S.label}>Topic {topic === '__ALL__' ? '(All topics — mixed drill)' : ''}</span>
              <div style={{display:'grid', gridTemplateColumns:'1fr', gap:6}}>
                <button style={{...S.optionBtn(topic==='__ALL__'), background:topic==='__ALL__'?'rgba(168,224,99,.15)':'rgba(255,255,255,.06)', borderColor:topic==='__ALL__'?'rgba(168,224,99,.5)':'rgba(255,255,255,.1)', color:topic==='__ALL__'?'#A8E063':'rgba(255,255,255,.65)', fontWeight:700}} onClick={() => { setTopic('__ALL__'); setTimeout(() => startRef.current?.scrollIntoView({behavior:'smooth',block:'start'}), 150); }}>
                  🎯 All Topics — Mixed Drill
                </button>
                {dueTopics.map(t => (
                  <button key={t} style={S.optionBtn(topic===t)} onClick={() => { setTopic(t); setTimeout(() => startRef.current?.scrollIntoView({behavior:'smooth',block:'start'}), 150); }}>
                    {t}<span style={S.badge('#FCD34D')}>due</span>
                  </button>
                ))}
                {topics.filter(t => !dueTopics.includes(t)).map(t => {
                  const stats = sr.getTopicStats(subject, t);
                  return (
                    <button key={t} style={S.optionBtn(topic===t)} onClick={() => { setTopic(t); setTimeout(() => startRef.current?.scrollIntoView({behavior:'smooth',block:'start'}), 150); }}>
                      {t}
                      {stats && stats.reps >= 3 && stats.ef >= 2.0 && <span style={S.badge('#4ADE80')}>mastered</span>}
                      {stats && stats.totalSeen > 0 && !(stats.reps >= 3 && stats.ef >= 2.0) && <span style={S.badge('#94A3B8')}>{stats.totalSeen}×</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Difficulty */}
          <div ref={diffRef} style={S.card}>
            <span style={S.label}>Difficulty</span>
            <div style={S.grid3}>
              {DIFFICULTIES.map(d => (
                <button key={d.id} style={S.optionBtn(difficulty===d.id)} onClick={() => setDifficulty(d.id)}>
                  <div style={{fontSize:20, marginBottom:4}}>{d.emoji}</div>
                  <div style={{fontWeight:700, fontSize:13}}>{d.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question type */}
          <div style={S.card}>
            <span style={S.label}>Question Type</span>
            <div style={S.grid3}>
              {QUESTION_TYPES.map(q => (
                <button key={q.id} style={S.optionBtn(questionType===q.id)} onClick={() => setQuestionType(q.id)}>
                  <div style={{fontWeight:700, fontSize:13}}>{q.label}</div>
                  <div style={{fontSize:11, color:'rgba(255,255,255,.4)', marginTop:2}}>{q.desc}</div>
                </button>
              ))}
            </div>
          </div>

          </>
          }
          {mode === 'exam' && drillType && <><div ref={startRef} /><button
            style={{...S.primaryBtn, opacity:(!subject||!topic) && !cameraImage ? 0.4 : 1, cursor:(!subject||!topic) && !cameraImage ? 'not-allowed' : 'pointer'}}
            onClick={startSession}
            disabled={(!subject||!topic) && !cameraImage}
          >
            {cameraImage ? 'Drill from my photo →' : `Start ${SESSION_LENGTH}-Question Drill →`}
          </button>
          <button style={{...S.ghostBtn,marginTop:8}} onClick={() => { setMode(''); setDrillType(''); setSubject(''); setTopic(''); }}>← Back</button>
          </>
          }

          {sr.weakTopics.length > 0 && (
            <div style={{...S.card, marginTop:24, borderColor:'rgba(248,113,113,.2)', background:'rgba(248,113,113,.05)'}}>
              <span style={S.label}>⚠️ Your weak topics</span>
              {sr.weakTopics.map(c => (
                <button key={c.topic} style={{...S.optionBtn(false), marginBottom:6, display:'block', width:'100%'}}
                  onClick={() => { setSubject(c.subject); setTopic(c.topic); }}>
                  {c.subject} — {c.topic}<span style={S.badge('#F87171')}>weak</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  // ══════════════════════════════════════════════════════
  // DRILLING SCREEN
  // ══════════════════════════════════════════════════════
  if (phase === 'drilling') {
    const progress = Math.round((questionNum / SESSION_LENGTH) * 100);
    const timerSeconds = question?.type === 'structured' ? TIMER_STRUCTURED : TIMER_MCQ;

    return (
      <>
        <Head>
          <title>Drill — {subject} · NewWorldEdu</title>
          <link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap" rel="stylesheet" />
        </Head>
        <div style={{ ...S.page, position: 'relative' }}>
          {showConfetti && <DrillConfetti />}
          <nav style={S.nav}>
            <Link href="/"><a style={S.navLogo}>NewWorldEdu<span style={{color:'#4F8EF7'}}>★</span></a></Link>
            <div style={S.navRight}>
              {/* Live score */}
              <div style={{background:'rgba(79,142,247,.12)', border:'1px solid rgba(79,142,247,.25)', borderRadius:8, padding:'4px 10px', fontSize:13, fontWeight:800, color:'#4F8EF7'}}>
                {liveScore}/{liveMax} pts
              </div>
              {/* Combo */}
              {combo >= 2 && (
                <div style={{background:'rgba(252,211,77,.12)', border:'1px solid rgba(252,211,77,.25)', borderRadius:8, padding:'4px 10px', fontSize:13, fontWeight:800, color:'#FCD34D'}}>
                  🔥 {combo}×
                </div>
              )}
              <span style={{fontSize:13, color:'rgba(255,255,255,.5)', fontWeight:600}}>{questionNum+1}/{SESSION_LENGTH}</span>
              <button style={{...S.navLink, cursor:'pointer', border:'none', background:'rgba(255,255,255,.05)'}} onClick={() => setPhase('setup')}>✕ End</button>
            </div>
          </nav>

          <div style={S.container}>
            {/* Progress bar */}
            <div style={{height:6, borderRadius:100, overflow:'hidden', background:'rgba(255,255,255,.08)', marginBottom:20}}>
              <div style={{height:'100%', borderRadius:100, width:`${progress}%`, background:'linear-gradient(90deg,#4F8EF7,#6366F1)', transition:'width .4s ease'}} />
            </div>

            {/* Subject + topic */}
            <div style={{marginBottom:16, display:'flex', alignItems:'center', gap:8, flexWrap:'wrap'}}>
              <span style={{fontSize:12, fontWeight:700, color:'#4F8EF7'}}>{subject}</span>
              <span style={{color:'rgba(255,255,255,.2)'}}>·</span>
              <span style={{fontSize:12, color:'rgba(255,255,255,.45)'}}>{question?.topic||topic}</span>
              <span style={{color:'rgba(255,255,255,.2)'}}>·</span>
              <span style={{fontSize:12, color:'rgba(255,255,255,.45)', textTransform:'capitalize'}}>{difficulty}</span>
            </div>

            {loading && !question && (
              <div style={{...S.card, textAlign:'center', padding:'40px 20px'}}>
                <div style={{fontSize:32, marginBottom:12}}>⏳</div>
                <div style={{color:'rgba(255,255,255,.5)', fontSize:14}}>Starky is generating your question…</div>
              </div>
            )}

            {error && (
              <div style={{...S.card, borderColor:'rgba(248,113,113,.3)', marginBottom:16}}>
                <p style={{color:'#F87171', fontSize:14, margin:0}}>{error}</p>
                <button style={{...S.ghostBtn, marginTop:12}} onClick={() => generateQuestion(topic)}>Try Again</button>
              </div>
            )}

            {question && !loading && (
              <>
                {/* Timer */}
                {!feedback && (
                  <QuestionTimer
                    key={`${questionNum}-${question.question?.substring(0,20)}`}
                    seconds={timerSeconds}
                    onExpire={handleTimerExpire}
                    paused={!!feedback}
                  />
                )}

                {timedOut && !feedback && (
                  <div style={{background:'rgba(248,113,113,.08)', border:'1px solid rgba(248,113,113,.2)', borderRadius:10, padding:'10px 14px', marginBottom:12, fontSize:13, color:'#F87171', fontWeight:600}}>
                    ⏰ Time's up! Submitting…
                  </div>
                )}

                {/* Marks + type */}
                <div style={{marginBottom:12, display:'flex', gap:8, alignItems:'center'}}>
                  <span style={{...S.badge('#94A3B8'), fontSize:11}}>{question.marks} mark{question.marks!==1?'s':''}</span>
                  <span style={{...S.badge('#94A3B8'), fontSize:11}}>{question.type==='mcq'?'Multiple choice':'Structured'}</span>
                </div>

                {/* Question */}
                <div style={S.questionText}>{question.question}</div>

                {/* MCQ options */}
                {question.type==='mcq' && question.options && !feedback && (
                  <div style={{display:'flex', flexDirection:'column', gap:8, marginBottom:16}}>
                    {Object.entries(question.options).map(([key, val]) => {
                      const sel = selectedOption===key;
                      return (
                        <button key={key}
                          style={{background:sel?'rgba(79,142,247,.15)':'rgba(255,255,255,.04)', border:`1px solid ${sel?'rgba(79,142,247,.5)':'rgba(255,255,255,.08)'}`, borderRadius:10, padding:'12px 16px', cursor:'pointer', color:sel?'#4F8EF7':'rgba(255,255,255,.75)', fontSize:14, textAlign:'left', display:'flex', gap:10, alignItems:'flex-start', transition:'all .15s', WebkitTapHighlightColor:'transparent'}}
                          onClick={() => setSelectedOption(key)}>
                          <strong style={{minWidth:20, color:sel?'#4F8EF7':'rgba(255,255,255,.4)'}}>{key}.</strong>
                          <span>{val}</span>
                          {sel && <span style={{marginLeft:'auto', fontSize:16}}>●</span>}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* MCQ after feedback */}
                {question.type==='mcq' && question.options && feedback && (
                  <div style={{display:'flex', flexDirection:'column', gap:8, marginBottom:16}}>
                    {Object.entries(question.options).map(([key, val]) => {
                      const isSelected = selectedOption===key;
                      const correctKey = question.correctOption || (feedback.modelAnswer || '').charAt(0);
                      const isCorrect = key===correctKey;
                      let bg='rgba(255,255,255,.03)', border='rgba(255,255,255,.06)', color='rgba(255,255,255,.4)';
                      if (isCorrect) { bg='rgba(74,222,128,.1)'; border='rgba(74,222,128,.35)'; color='#4ADE80'; }
                      if (isSelected && !isCorrect) { bg='rgba(248,113,113,.1)'; border='rgba(248,113,113,.35)'; color='#F87171'; }
                      return (
                        <div key={key} style={{background:bg, border:`1px solid ${border}`, borderRadius:10, padding:'12px 16px', color, fontSize:14, display:'flex', gap:10, alignItems:'flex-start'}}>
                          <strong style={{minWidth:20}}>{key}.</strong>
                          <span>{val}</span>
                          {isCorrect && <span style={{marginLeft:'auto', fontSize:16}}>✓</span>}
                          {isSelected && !isCorrect && <span style={{marginLeft:'auto', fontSize:16}}>✗</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Structured answer */}
                {question.type==='structured' && !feedback && (
                  <div style={{marginBottom:16}}>
                    <span style={S.label}>Your answer</span>
                    <textarea style={S.textarea} placeholder="Write your answer here…" value={structuredAns} onChange={e => setStructuredAns(e.target.value)} />
                  </div>
                )}

                {/* Hint */}
                {!feedback && !hint && (
                  <button onClick={getHint} disabled={hintLoading} style={{background:'rgba(251,191,36,.08)', border:'1px solid rgba(251,191,36,.2)', borderRadius:10, padding:'9px 16px', color:'#FCD34D', fontSize:13, fontWeight:600, cursor:'pointer', marginBottom:12, width:'100%'}}>
                    {hintLoading ? '🤔 Getting hint…' : '💡 I need a hint'}
                  </button>
                )}
                {hint && !feedback && (
                  <div style={S.tipBox}><strong style={{color:'#FCD34D'}}>💡 Hint: </strong>{hint}</div>
                )}

                {/* Feedback */}
                {feedback && (
                  <div style={S.feedbackBox(feedback.correct)}>
                    <div style={S.scoreRow}>
                      <span style={{fontSize:22}}>{feedback.correct ? '✅' : '❌'}</span>
                      <span style={{fontWeight:800, fontSize:15, color:feedback.correct?'#4ADE80':'#F87171'}}>
                        {feedback.score} / {feedback.maxScore} marks
                      </span>
                    </div>

                    {/* WHY explanation — the key UX improvement */}
                    <p style={{margin:'0 0 10px', fontSize:14, color:'rgba(255,255,255,.85)', lineHeight:1.7}}>
                      {feedback.feedback}
                    </p>

                    {feedback.examinerTip && (
                      <div style={S.tipBox}>
                        <strong style={{color:'#FCD34D'}}>📌 Examiner tip: </strong>{feedback.examinerTip}
                      </div>
                    )}
                    {feedback.modelAnswer && (
                      <div style={S.modelBox}>
                        <strong style={{color:'rgba(255,255,255,.5)', fontSize:11, textTransform:'uppercase', letterSpacing:'.06em'}}>Model answer</strong>
                        <p style={{margin:'6px 0 0', lineHeight:1.7}}>{feedback.modelAnswer}</p>
                      </div>
                    )}

                    {/* Combo celebration */}
                    {combo >= 3 && (
                      <div style={{background:'rgba(252,211,77,.08)', border:'1px solid rgba(252,211,77,.2)', borderRadius:10, padding:'10px 14px', marginTop:12, fontSize:13, color:'#FCD34D', fontWeight:700, textAlign:'center'}}>
                        🔥 {combo} in a row! Keep going!
                      </div>
                    )}
                  </div>
                )}

                {/* Submit / Next */}
                {!feedback ? (
                  <button
                    style={{...S.primaryBtn, opacity:(question.type==='mcq'?!selectedOption:!structuredAns.trim())?0.4:1}}
                    disabled={question.type==='mcq'?!selectedOption:!structuredAns.trim()}
                    onClick={() => submitAnswer()}
                  >
                    {loading ? 'Checking…' : 'Submit Answer →'}
                  </button>
                ) : (
                  <button style={S.primaryBtn} onClick={nextQuestion}>
                    {questionNum+1>=SESSION_LENGTH ? 'See Results →' : `Next Question → (${questionNum+2}/${SESSION_LENGTH})`}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  // ══════════════════════════════════════════════════════
  // SUMMARY SCREEN
  // ══════════════════════════════════════════════════════
  const gradeEmoji = sessionPct>=80?'🌟':sessionPct>=60?'👍':'📖';
  const gradeText = sessionPct>=80?'Excellent work!':sessionPct>=60?'Good effort!':'Keep practising!';

  return (
    <>
      <Head>
        <title>Session Complete — NewWorldEdu</title>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap" rel="stylesheet" />
      </Head>
      <div style={S.page}>
        <nav style={S.nav}>
          <Link href="/"><a style={S.navLogo}>NewWorldEdu<span style={{color:'#4F8EF7'}}>★</span></a></Link>
        </nav>
        <div style={S.container}>
          {/* Score hero */}
          <div style={{...S.card, textAlign:'center', padding:'40px 24px', marginBottom:24, borderColor:'rgba(79,142,247,.2)', background:'rgba(79,142,247,.05)'}}>
            <div style={{fontSize:56, marginBottom:12}}>{gradeEmoji}</div>
            <h1 style={{...S.h1, fontSize:30, marginBottom:6}}>{gradeText}</h1>
            <div style={{fontSize:52, fontWeight:900, fontFamily:"'Sora',sans-serif", color:sessionPct>=80?'#4ADE80':sessionPct>=60?'#FCD34D':'#F87171', margin:'12px 0'}}>
              {sessionPct}%
            </div>
            <div style={{fontSize:14, color:'rgba(255,255,255,.45)'}}>
              {correctCount}/{sessionResults.length} correct · {liveScore}/{liveMax} marks
            </div>
          </div>


          {/* ── FEEL GREAT PANEL ─────────────────────────────────────── */}
          {(() => {
            const weakest = sessionResults.filter(r => !r.correct);
            const strongest = sessionResults.filter(r => r.correct);
            const focusTopic = weakest.length ? weakest[weakest.length-1].topic : null;
            const msg = sessionPct >= 90
              ? { emoji: '🌟', title: 'Outstanding!', body: `You nailed ${strongest.length} out of ${sessionResults.length} questions. You are in the top tier — keep this momentum.` }
              : sessionPct >= 75
              ? { emoji: '🔥', title: 'Really strong work!', body: `${strongest.length} correct. You are close to mastery — one more session like this and it will stick permanently.` }
              : sessionPct >= 55
              ? { emoji: '💪', title: 'Good effort!', body: `You got ${strongest.length} right. Every question you practise builds the pathway in your brain — you are making real progress.` }
              : { emoji: '⭐', title: 'Keep going — this is how learning works!', body: `Getting things wrong is not failing — it is your brain finding out exactly what to fix. That is what Starky is here for.` };
            return (
              <div style={{...S.card, borderColor: sessionPct>=75?'rgba(74,222,128,.25)':'rgba(79,142,247,.2)', background: sessionPct>=75?'rgba(74,222,128,.05)':'rgba(79,142,247,.05)', marginBottom:16}}>
                <div style={{fontSize:40, marginBottom:8}}>{msg.emoji}</div>
                <div style={{fontWeight:800, fontSize:18, marginBottom:8}}>{msg.title}</div>
                <div style={{fontSize:14, color:'rgba(255,255,255,.65)', lineHeight:1.7, marginBottom: focusTopic ? 16 : 0}}>{msg.body}</div>
                {focusTopic && (
                  <div style={{background:'rgba(255,255,255,.06)', borderRadius:10, padding:'12px 16px', marginTop:8}}>
                    <div style={{fontSize:11, fontWeight:700, color:'rgba(255,255,255,.4)', letterSpacing:1, marginBottom:4}}>ONE THING TO FOCUS ON NEXT</div>
                    <div style={{fontWeight:700, fontSize:15, color:'#FCD34D'}}>📌 {focusTopic}</div>
                    <div style={{fontSize:13, color:'rgba(255,255,255,.5)', marginTop:4}}>Ask Starky to explain this using a real-world analogy.</div>
                  </div>
                )}
              </div>
            );
          })()}
          {/* Streak */}
          <div style={{marginBottom:16}}><StreakWidget userId={userProfile?.email || userProfile?.name || 'guest'} /></div>

          {/* Breakdown */}
          <div style={S.card}>
            <span style={S.label}>Question breakdown</span>
            {sessionResults.map((r,i) => (
              <div key={i} style={{display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:i<sessionResults.length-1?'1px solid rgba(255,255,255,.05)':'none'}}>
                <span style={{fontSize:16}}>{r.correct?'✅':'❌'}</span>
                <span style={{flex:1, fontSize:13, color:'rgba(255,255,255,.7)'}}>{r.topic}</span>
                <span style={{fontSize:12, fontWeight:700, color:r.correct?'#4ADE80':'#F87171'}}>{r.score}/{r.maxScore}</span>
              </div>
            ))}
          </div>

          {/* Spaced rep */}
          {sr.dueCount > 0 && (
            <div style={{...S.card, borderColor:'rgba(252,211,77,.2)', background:'rgba(252,211,77,.05)'}}>
              <span style={S.label}>🔄 Due for review</span>
              <p style={{fontSize:13, color:'rgba(255,255,255,.55)', margin:'0 0 12px', lineHeight:1.6}}>
                Starky has scheduled {sr.dueCount} topic{sr.dueCount!==1?'s':''} for review based on your performance.
              </p>
            </div>
          )}

          {/* Subject mastery */}
          {subject && (
            <div style={S.card}>
              <span style={S.label}>{subject} mastery</span>
              <div style={{display:'flex', alignItems:'center', gap:12}}>
                <div style={{flex:1, height:8, borderRadius:100, background:'rgba(255,255,255,.08)', overflow:'hidden'}}>
                  <div style={{height:'100%', width:`${sr.getSubjectMastery(subject)}%`, background:'linear-gradient(90deg,#4F8EF7,#6366F1)', borderRadius:100, transition:'width .6s ease'}} />
                </div>
                <span style={{fontSize:14, fontWeight:800, color:'#4F8EF7', minWidth:36}}>{sr.getSubjectMastery(subject)}%</span>
              </div>
            </div>
          )}

          <button style={S.primaryBtn} onClick={() => { setPhase('drilling'); setQuestionNum(0); setSessionResults([]); setLiveScore(0); setLiveMax(0); setCombo(0); setError(''); setFeedback(null); generateQuestion(topic); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100); }}>
            Drill Again 🔄
          </button>

          {/* Share buttons */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:12}}>
            <button style={{...S.ghostBtn, marginTop:0, display:'flex', alignItems:'center', justifyContent:'center', gap:6}} onClick={async () => {
              const { shareLink } = await import('../utils/share');
              const weak = sessionResults.filter(r=>!r.correct).map(r=>r.topic);
              const r = await shareLink('challenge', { name:userProfile?.name, subject, topic, level, difficulty, pct:sessionPct, correct:correctCount, total:SESSION_LENGTH }, `I scored ${sessionPct}% on ${subject}! Can you beat me? 🎯`);
              if (r.method === 'clipboard') alert('Link copied! Send it to your friend.');
            }}>
              ⚔️ Challenge Friend
            </button>
            <button style={{...S.ghostBtn, marginTop:0, display:'flex', alignItems:'center', justifyContent:'center', gap:6}} onClick={async () => {
              const { shareLink } = await import('../utils/share');
              const weak = sessionResults.filter(r=>!r.correct).map(r=>r.topic);
              const r = await shareLink('drill', { name:userProfile?.name, subject, level, pct:sessionPct, correct:correctCount, total:SESSION_LENGTH, weakAreas:weak }, `${userProfile?.name||'Your child'} scored ${sessionPct}% on ${subject}!`);
              if (r.method === 'clipboard') alert('Link copied! Send it to your parent.');
            }}>
              📧 Share Results
            </button>
          </div>

          {/* ═══ NANO → DRILL → MOCK LOOP ═══ */}
          <div style={{...S.card, borderColor:'rgba(201,168,76,0.2)', background:'rgba(201,168,76,0.04)', marginTop:16}}>
            <span style={{...S.label, color:'#C9A84C'}}>What to do next</span>
            <a href="/nano" style={{display:'block', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', textDecoration:'none', color:'#fff', fontSize:13, lineHeight:1.7}}>
              <span style={{color:'#C9A84C', fontWeight:700}}>⚛️ Nano:</span> Go deeper on your weakest topic — master it one goal at a time
              <span style={{display:'block', color:'#4F8EF7', fontWeight:700, marginTop:4}}>→ Open Starky Nano</span>
            </a>
            <a href="/mocks" style={{display:'block', padding:'12px 0', textDecoration:'none', color:'#fff', fontSize:13, lineHeight:1.7}}>
              <span style={{color:'#C9A84C', fontWeight:700}}>📝 Mocks:</span> Test yourself under timed exam conditions with full marking
              <span style={{display:'block', color:'#4F8EF7', fontWeight:700, marginTop:4}}>→ Take a Starky Mock</span>
            </a>
          </div>

          <div style={{ display:'flex', gap:8, marginTop:12 }}>
            <a href="/leaderboard" style={{ flex:1, textAlign:'center', padding:'12px', borderRadius:12, background:'rgba(255,195,0,0.1)', border:'1px solid rgba(255,195,0,0.25)', color:'#FFC300', fontWeight:700, fontSize:13, textDecoration:'none' }}>🏆 Leaderboard</a>
            <a href="/past-papers" style={{ flex:1, textAlign:'center', padding:'12px', borderRadius:12, background:'rgba(99,210,255,0.1)', border:'1px solid rgba(99,210,255,0.25)', color:'#63D2FF', fontWeight:700, fontSize:13, textDecoration:'none' }}>📚 Past Papers</a>
          </div>

          <button style={S.ghostBtn} onClick={() => setPhase('setup')}>Change Subject / Topic</button>
          <Link href="/"><a style={{...S.ghostBtn, display:'block', textAlign:'center', textDecoration:'none', marginTop:8}}>Back to Starky Chat</a></Link>
        </div>
      </div>
      {showLimitModal && <LimitReachedModal onClose={() => setShowLimitModal(false)} />}
      <LegalFooter />    </>
  );
}
