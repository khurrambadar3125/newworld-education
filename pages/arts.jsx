import { useState, useRef, useEffect, useCallback } from "react";
import Head from "next/head";
import { useSessionLimit } from "../utils/useSessionLimit";
import { getArtsPrompt } from "../utils/artsKnowledge";

const STAGES = [
  { id:"early", emoji:"🌱", name:"Early Years", ages:"Ages 3–6", grades:"Nursery · KG", color:"#FF8C69",
    topics:["Colour Mixing","Finger Painting","Drawing Shapes","Collage","Printing","Clay & Dough","Nature Art","Self Portraits"],
    desc:"Joyful making — colour, texture, mess, and creative exploration." },
  { id:"primary", emoji:"🌿", name:"Primary", ages:"Ages 6–11", grades:"Years 1–6", color:"#A8E063",
    topics:["Drawing Techniques","Painting","Sculpture","Famous Artists","Colour Theory","Pattern & Texture","Printmaking","Digital Art"],
    desc:"Building creative skills — techniques, artists, and visual thinking." },
  { id:"secondary", emoji:"🌳", name:"Secondary", ages:"Ages 11–16", grades:"Years 7–11 · GCSE", color:"#FFC300",
    topics:["GCSE Art Portfolio","Drawing from Observation","Painting Techniques","Mixed Media","Sculpture","Art History","Photography","Artist Studies"],
    desc:"GCSE Art — portfolio building, techniques, and critical studies." },
  { id:"sixthform", emoji:"🎓", name:"Sixth Form", ages:"Ages 16–18", grades:"A-Level · IB", color:"#C77DFF",
    topics:["A-Level Portfolio","Personal Investigation","Critical & Contextual Studies","Fine Art","Graphic Design","Photography A-Level","IB Visual Arts","University Portfolio Prep"],
    desc:"A-Level and IB Art — personal voice, critical writing, and portfolio." },
];

const ART_PROJECTS = {
  early: [
    { title: 'Rainbow Handprint', emoji: '🌈', time: '15 min', materials: ['Paper', 'Paint', 'Water cup'],
      steps: ['Spread paint on your palm', 'Press hand firmly on paper', 'Lift carefully — look!', 'Wash hand, pick new colour', 'Make a rainbow of handprints!', 'Add eyes and smiles to each one'] },
    { title: 'Paper Plate Animal', emoji: '🦁', time: '20 min', materials: ['Paper plate', 'Crayons', 'Scissors', 'Glue'],
      steps: ['Draw a big circle face on the plate', 'Cut strips of paper for the mane', 'Glue strips around the edge', 'Draw eyes, nose, and whiskers', 'Add triangle ears at the top', 'Give your lion a name!'] },
    { title: 'Dot Painting', emoji: '🎨', time: '10 min', materials: ['Paper', 'Cotton buds', 'Paint'],
      steps: ['Dip cotton bud in paint', 'Press dots on the paper', 'Make a pattern — circles, lines, flowers', 'Try mixing colours by dotting wet on wet', 'Fill the whole page with dots!'] },
  ],
  primary: [
    { title: 'Self Portrait', emoji: '🖼️', time: '30 min', materials: ['Paper', 'Pencil', 'Mirror', 'Colours'],
      steps: ['Look in the mirror — really look!', 'Draw an oval for your face shape', 'Eyes go halfway down — not at the top!', 'Add nose, mouth, ears at the right positions', 'Draw your hair — what shape is it?', 'Add colour — skin tone first, then details', 'Sign your name like a real artist!'] },
    { title: 'Perspective Drawing', emoji: '🏙️', time: '25 min', materials: ['Paper', 'Ruler', 'Pencil'],
      steps: ['Draw a dot in the centre — this is your vanishing point', 'Draw light lines from the dot to each corner', 'Draw a road getting narrower toward the point', 'Add buildings on each side — tall near you, short far away', 'Add windows and doors', 'Shade one side of each building (shadow side)', 'Add tiny people far away, bigger ones close up'] },
    { title: 'Colour Wheel', emoji: '🎡', time: '20 min', materials: ['Paper', 'Red, blue, yellow paint', 'Brush'],
      steps: ['Draw a large circle and divide into 6 sections', 'Paint red, blue, yellow in alternate sections (primary colours)', 'Mix red + yellow → orange. Paint between red and yellow', 'Mix blue + yellow → green. Paint between blue and yellow', 'Mix red + blue → purple. Paint between red and blue', 'You made a colour wheel! Label each colour'] },
  ],
  secondary: [
    { title: 'Tonal Study', emoji: '✏️', time: '30 min', materials: ['Paper', 'Pencil range (HB-6B)', 'Rubber'],
      steps: ['Choose a simple object (cup, fruit, shoe)', 'Sketch the outline lightly', 'Find the light source — which side is brightest?', 'Shade the darkest areas with 6B pencil', 'Build up mid-tones with HB-2B', 'Leave the highlights white (use rubber to lift)', 'Add cast shadow underneath the object'] },
  ],
  sixthform: [
    { title: 'Artist Response Study', emoji: '🎨', time: '45 min', materials: ['Sketchbook', 'Mixed media', 'Printed reference'],
      steps: ['Choose an artist from your research', 'Analyse their use of formal elements (line, tone, colour, texture)', 'Create a small study copying their technique', 'Now create your OWN piece using their technique but YOUR subject', 'Write 100-word annotation: what you learned, how you adapted it', 'Photograph and add to your portfolio page'] },
  ],
};

const CANVAS_COLORS = [
  { name:'Black', hex:'#000000' },
  { name:'Red', hex:'#E53E3E' },
  { name:'Blue', hex:'#3182CE' },
  { name:'Green', hex:'#38A169' },
  { name:'Yellow', hex:'#ECC94B' },
  { name:'Orange', hex:'#ED8936' },
  { name:'Purple', hex:'#9F7AEA' },
  { name:'Brown', hex:'#8B6914' },
];

const BRUSH_SIZES = [
  { name:'Thin', size:2 },
  { name:'Medium', size:6 },
  { name:'Thick', size:14 },
];

/* ── Sound Engine ── */
let _ctx=null;
function gCtx(){if(!_ctx)try{_ctx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}return _ctx}
function tone(f,t,v,d,dl){const c=gCtx();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=t;o.frequency.value=f;g.gain.value=0;o.connect(g);g.connect(c.destination);const now=c.currentTime+(dl||0);g.gain.setValueAtTime(v,now);g.gain.exponentialRampToValueAtTime(0.001,now+d);o.start(now);o.stop(now+d+0.05)}
function sndTick(){tone(900,'sine',0.06,0.07)}
function sndOk(){tone(523,'sine',0.22,0.32);tone(659,'sine',0.22,0.32,0.16)}
function sndWin(){tone(523,'sine',0.25,0.5);tone(659,'sine',0.25,0.45,0.15);tone(784,'sine',0.25,0.45,0.3)}

function buildPrompt(stage, topic) {
  // Use the comprehensive arts knowledge base, age-gated
  return getArtsPrompt(stage.id, topic);
}

export default function ArtsPage() {
  const [step, setStep] = useState(1);
  const [stage, setStage] = useState(null);
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const chatEndRef = useRef(null);
  const { callsLeft, limitReached, recordCall } = useSessionLimit();

  // Drawing canvas state
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(6);
  const [isEraser, setIsEraser] = useState(false);
  const [strokes, setStrokes] = useState([]); // store canvas snapshots for undo
  const currentPathRef = useRef([]);

  // Image upload state
  const [uploadedImage, setUploadedImage] = useState(null); // { base64, preview }
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Guided projects state
  const [activeProject, setActiveProject] = useState(null); // { project, currentStep }
  const [projectCompleted, setProjectCompleted] = useState(false);

  // Gallery state
  const [gallery, setGallery] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryViewing, setGalleryViewing] = useState(null);
  const [artXP, setArtXP] = useState(0);

  // Celebrations
  const [confetti, setConfetti] = useState(false);
  const [floatingXP, setFloatingXP] = useState(null);

  // What's Next card
  const [showWhatsNext, setShowWhatsNext] = useState(false);

  // Canvas sending state
  const [sendingDrawing, setSendingDrawing] = useState(false);

  useEffect(() => { const fn = () => setIsMobile(window.innerWidth < 768); fn(); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  // Load gallery from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('nw_art_gallery') || '[]');
      setGallery(saved);
      const xp = parseInt(localStorage.getItem('nw_art_xp') || '0', 10);
      setArtXP(xp);
    } catch(e) {}
  }, []);

  // Show "What's Next" after 5+ messages
  useEffect(() => {
    if (messages.filter(m => m.role === 'user').length >= 5 && !showWhatsNext) {
      setShowWhatsNext(true);
    }
  }, [messages, showWhatsNext]);

  const accent = stage?.color || "#FF8C69";

  // ── Gallery helpers ──
  function saveToGallery(title, imageData) {
    const entry = { id: Date.now(), title, image: imageData, date: new Date().toLocaleDateString() };
    const updated = [entry, ...gallery].slice(0, 50);
    setGallery(updated);
    localStorage.setItem('nw_art_gallery', JSON.stringify(updated));
  }

  function addXP(amount) {
    const newXP = artXP + amount;
    setArtXP(newXP);
    localStorage.setItem('nw_art_xp', String(newXP));
    setFloatingXP(amount);
    setTimeout(() => setFloatingXP(null), 1500);
  }

  function triggerConfetti() {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3000);
  }

  // ── Canvas helpers ──
  function getCanvasCoords(e) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches && e.touches[0]) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }

  function saveStrokeSnapshot() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const snapshot = canvas.toDataURL();
    setStrokes(prev => [...prev.slice(-9), snapshot]);
  }

  function startDraw(e) {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveStrokeSnapshot();
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#FFFFFF' : brushColor;
    ctx.lineWidth = isEraser ? 20 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setDrawing(true);
  }

  function draw(e) {
    if (!drawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function endDraw() {
    if (!drawing) return;
    setDrawing(false);
  }

  function undoCanvas() {
    sndTick();
    if (strokes.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const last = strokes[strokes.length - 1];
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = last;
    setStrokes(prev => prev.slice(0, -1));
  }

  function clearCanvas() {
    sndTick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveStrokeSnapshot();
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Initialize canvas white background
  useEffect(() => {
    if (step === 3 && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = 600; // 300px * 2 for retina
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [step]);

  async function showDrawing() {
    sndTick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const base64 = canvas.toDataURL('image/png').split(',')[1];
    setSendingDrawing(true);
    // Save to gallery
    saveToGallery('Drawing — ' + (topic || 'Free Draw'), canvas.toDataURL('image/png'));
    addXP(5);
    const userMsg = { role: 'user', content: '[Sent a drawing to Starky for feedback]' };
    const prev = [...messages, userMsg];
    setMessages(prev);
    setLoading(true);
    recordCall();
    try {
      const res = await fetch('/api/anthropic', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: /* PERMANENT: Haiku 3 only. Never change without Khurram's approval. */ 'claude-haiku-4-5-20251001', max_tokens: 1200,
          system: buildPrompt(stage, topic) + '\n\nThe student is sharing a drawing they made on the digital canvas. Give warm, encouraging, specific feedback. Notice colours, shapes, composition. Suggest one thing to try next.',
          messages: prev.map(m => ({ role: m.role, content: m.content })).slice(0, -1).concat([{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/png', data: base64 } },
              { type: 'text', text: 'Here is my drawing! What do you think?' }
            ]
          }])
        })
      });
      const data = await res.json();
      setMessages(p => [...p, { role: 'assistant', content: data.content?.[0]?.text || 'I can see your drawing! Great work — keep creating!' }]);
    } catch(e) {
      setMessages(p => [...p, { role: 'assistant', content: 'Connection error. But keep drawing — your work looks great!' }]);
    }
    setLoading(false);
    setSendingDrawing(false);
  }

  // ── Image upload helpers ──
  function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    sndTick();
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(',')[1];
      setUploadedImage({ base64, preview: ev.target.result, mediaType: file.type });
    };
    reader.readAsDataURL(file);
  }

  // ── Chat ──
  const startChat = () => {
    if (!stage || !topic) return;
    setMessages([{ role:"assistant", content:`🎨 Welcome to Arts with Starky!\n\nYou're a **${stage.name}** student (${stage.ages}) and we're exploring **${topic}** today.\n\nArt is about looking, thinking, and making. Let's start — ask me anything, share your work for feedback, or I'll set you a task to begin.` }]);
    setStep(3);
  };

  const sendMessage = async (text) => {
    const txt = (text || input).trim();
    if (!txt || loading || limitReached) return;
    setInput(""); recordCall();

    const hasImage = !!uploadedImage;
    const displayContent = hasImage ? `${txt}\n[Attached an image]` : txt;
    const prev = [...messages, { role:"user", content: displayContent }];
    setMessages(prev); setLoading(true);

    if (hasImage) {
      // Save uploaded image to gallery
      saveToGallery('Upload — ' + (topic || 'Artwork'), uploadedImage.preview);
      addXP(5);
    }

    try {
      if (hasImage) {
        // Use /api/anthropic for image messages
        const apiMessages = prev.map(m => ({ role: m.role, content: m.content })).slice(0, -1).concat([{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: uploadedImage.mediaType || 'image/jpeg', data: uploadedImage.base64 } },
            { type: 'text', text: txt }
          ]
        }]);
        const res = await fetch('/api/anthropic', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: /* PERMANENT: Haiku 3 only. Never change without Khurram's approval. */ 'claude-haiku-4-5-20251001', max_tokens: 1200, system: buildPrompt(stage, topic) + '\n\nThe student is sharing artwork or an image. Give warm, specific, encouraging feedback. Notice techniques, colours, composition, effort.', messages: apiMessages })
        });
        const data = await res.json();
        const reply = data.content?.[0]?.text || 'Something went wrong.';
        setMessages(p => [...p, { role: 'assistant', content: reply }]);
        // Signal collection
        try {
          const { recordMessageSignal, recordStrategySignal } = await import('../utils/signalCollector');
          const profile = JSON.parse(localStorage.getItem('nw_user') || '{}');
          recordMessageSignal({ email: profile.email || 'anonymous', subject: 'Arts - ' + topic, grade: profile.grade || '', userMessage: txt, starkyResponse: reply, sessionNumber: 1 });
          recordStrategySignal({ email: profile.email || 'anonymous', subject: 'Arts - ' + topic, grade: profile.grade || '', starkyResponse: reply, userResponse: txt });
        } catch {}
      } else {
        // Text-only uses /api/chat
        const res = await fetch("/api/chat", { method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ model:/* PERMANENT: Haiku 3 only. Never change without Khurrams approval. */ "claude-haiku-4-5-20251001", max_tokens:1200, system:buildPrompt(stage, topic), messages:prev.map(m=>({role:m.role,content:m.content})) }) });
        const data = await res.json();
        const reply = data.content?.[0]?.text || "Something went wrong.";
        setMessages(p => [...p, { role:"assistant", content:reply }]);
        // Signal collection
        try {
          const { recordMessageSignal, recordStrategySignal } = await import('../utils/signalCollector');
          const profile = JSON.parse(localStorage.getItem('nw_user') || '{}');
          recordMessageSignal({ email: profile.email || 'anonymous', subject: 'Arts - ' + topic, grade: profile.grade || '', userMessage: txt, starkyResponse: reply, sessionNumber: 1 });
          recordStrategySignal({ email: profile.email || 'anonymous', subject: 'Arts - ' + topic, grade: profile.grade || '', starkyResponse: reply, userResponse: txt });
        } catch {}
      }
    } catch { setMessages(p => [...p, { role:"assistant", content:"Connection error. Please try again." }]); }
    // Session-complete analysis
    try {
      const msgCount = prev.filter(m => m.role === 'user').length;
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
            subject: 'Arts - ' + topic,
            messages: messages.slice(-20),
          }),
        }).catch(() => {});
      }
    } catch {}
    setLoading(false);
    setUploadedImage(null);
  };

  // ── Project step handlers ──
  function startProject(project) {
    sndTick();
    setActiveProject({ project, currentStep: 0 });
    setProjectCompleted(false);
  }

  function nextProjectStep() {
    sndOk();
    addXP(10);
    if (activeProject.currentStep >= activeProject.project.steps.length - 1) {
      // Project complete
      setProjectCompleted(true);
      sndWin();
      triggerConfetti();
      addXP(25);
    } else {
      setActiveProject(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  }

  function closeProject() {
    sndTick();
    setActiveProject(null);
    setProjectCompleted(false);
  }

  const CSS = `*{box-sizing:border-box}button:focus,textarea:focus{outline:none}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:4px}@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}@keyframes floatUp{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-60px)}}@keyframes starPulse{0%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:0.7}100%{transform:scale(1);opacity:1}}`;

  const stageProjects = stage ? (ART_PROJECTS[stage.id] || []) : [];

  return (
    <>
    <Head>
      <title>Arts — NewWorldEdu</title>
      <meta name="description" content="Learn arts and creative expression with personalised guidance. Drawing, design, and art history for all ages and abilities." />
      <meta property="og:title" content="Arts — NewWorldEdu" />
      <meta property="og:description" content="Learn arts and creative expression with personalised guidance. Drawing, design, and art history for all ages and abilities." />
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
    </Head>
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#060B20 0%,#0D1635 60%,#060B20 100%)", fontFamily:"'Nunito',sans-serif", color:"#fff", position:"relative", overflow:"hidden" }}>
      <style>{CSS}</style>

      {/* ── Confetti Overlay ── */}
      {confetti && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, pointerEvents:"none", zIndex:9999 }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{
              position:"absolute",
              top: -20,
              left: `${Math.random() * 100}%`,
              width: 8 + Math.random() * 8,
              height: 8 + Math.random() * 8,
              background: ['#FF8C69','#A8E063','#FFC300','#C77DFF','#4F8EF7','#E53E3E','#38A169'][i % 7],
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              animation: `confettiFall ${2 + Math.random() * 2}s ${Math.random() * 0.5}s ease-in forwards`,
            }} />
          ))}
        </div>
      )}

      {/* ── Floating XP ── */}
      {floatingXP && (
        <div style={{ position:"fixed", top:"40%", left:"50%", transform:"translateX(-50%)", zIndex:9999, pointerEvents:"none", fontSize:32, fontWeight:900, color:"#FFC300", textShadow:"0 2px 20px rgba(255,195,0,0.5)", animation:"floatUp 1.5s ease forwards" }}>
          +{floatingXP} XP
        </div>
      )}

      <header style={{ padding:isMobile?"12px 16px":"14px 28px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ textDecoration:"none", fontWeight:900, fontSize:15, color:"#fff" }}>NewWorldEdu<span style={{ color:"#4F8EF7" }}>★</span></a>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          {artXP > 0 && <span style={{ background:"linear-gradient(135deg,#FFC300,#FF8E53)", borderRadius:20, padding:"4px 12px", fontSize:11, fontWeight:900, color:"#060B20" }}>Art XP: {artXP}</span>}
          {step > 1 && <button onClick={() => { sndTick(); setStep(1); setStage(null); setTopic(""); setMessages([]); setActiveProject(null); setProjectCompleted(false); }} style={{ border:"none", cursor:"pointer", background:"rgba(255,255,255,0.05)", borderRadius:10, padding:"6px 12px", color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, fontFamily:"inherit" }}>← Start Over</button>}
          <a href="/pricing" style={{ background:"linear-gradient(135deg,#4F8EF7,#7B5EA7)", borderRadius:12, padding:"7px 16px", color:"#fff", fontWeight:900, fontSize:12, textDecoration:"none" }}>Plans</a>
        </div>
      </header>

      <div style={{ maxWidth:820, margin:"0 auto", padding:isMobile?"20px 16px":"40px 24px" }}>

        {/* ═══ STEP 1: Stage Selector ═══ */}
        {step === 1 && (
          <div style={{ animation:"fadeUp 0.4s ease" }}>
            <div style={{ textAlign:"center", marginBottom:36 }}>
              <div style={{ fontSize:isMobile?52:72, marginBottom:12 }}>🎨</div>
              <h1 style={{ fontSize:isMobile?26:44, fontWeight:900, margin:"0 0 10px" }}>Arts with <span style={{ color:"#FF8C69" }}>Starky</span></h1>
              <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", maxWidth:500, margin:"0 auto", lineHeight:1.9 }}>From finger painting to A-Level portfolios. Starky teaches art at your exact level — technique, creativity, and critical thinking.</p>
            </div>
            <div style={{ fontSize:11, fontWeight:900, color:"rgba(255,255,255,0.3)", letterSpacing:2, textAlign:"center", marginBottom:16 }}>SELECT YOUR LEVEL</div>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:14 }}>
              {STAGES.map(s => (
                <button key={s.id} onClick={() => { sndTick(); setStage(s); setStep(2); }}
                  style={{ border:"2px solid "+s.color+"30", cursor:"pointer", background:s.color+"08", borderRadius:20, padding:"22px 20px", textAlign:"left", color:"#fff", fontFamily:"inherit", transition:"all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background=s.color+"18"; e.currentTarget.style.borderColor=s.color; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=s.color+"08"; e.currentTarget.style.borderColor=s.color+"30"; e.currentTarget.style.transform="none"; }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                    <span style={{ fontSize:32 }}>{s.emoji}</span>
                    <div>
                      <div style={{ fontWeight:900, fontSize:17, color:s.color }}>{s.name}</div>
                      <div style={{ fontSize:12, color:s.color+"AA" }}>{s.ages}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>{s.grades}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.7, marginBottom:10 }}>{s.desc}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {s.topics.slice(0,4).map(t => <span key={t} style={{ background:s.color+"12", border:"1px solid "+s.color+"25", borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:700, color:s.color+"CC" }}>{t}</span>)}
                    <span style={{ background:"rgba(255,255,255,0.04)", borderRadius:20, padding:"2px 8px", fontSize:10, color:"rgba(255,255,255,0.3)" }}>+{s.topics.length-4} more</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ STEP 2: Topic Selector ═══ */}
        {step === 2 && (
          <div style={{ animation:"fadeUp 0.4s ease" }}>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <div style={{ fontSize:44, marginBottom:8 }}>{stage.emoji}</div>
              <h2 style={{ fontSize:isMobile?22:32, fontWeight:900, margin:"0 0 6px" }}>What shall we <span style={{ color:accent }}>create?</span></h2>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.8 }}>{stage.name} · {stage.ages} · {stage.grades}</p>
            </div>
            <div style={{ background:accent+"0A", border:"1px solid "+accent+"25", borderRadius:18, padding:20 }}>
              <div style={{ fontSize:11, fontWeight:900, color:accent, letterSpacing:1, marginBottom:14 }}>SELECT TOPIC</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
                {stage.topics.map(t => (
                  <button key={t} onClick={() => { sndTick(); setTopic(t); }}
                    style={{ border:"1px solid "+(topic===t ? accent : "rgba(255,255,255,0.12)"), cursor:"pointer", background:topic===t ? accent : "rgba(255,255,255,0.05)", borderRadius:20, padding:"7px 14px", fontSize:12, fontWeight:700, color:topic===t ? "#060B20" : "rgba(255,255,255,0.6)", fontFamily:"inherit", transition:"all 0.15s" }}>
                    {t}
                  </button>
                ))}
              </div>
              <button onClick={startChat} disabled={!topic}
                style={{ border:"none", cursor:topic?"pointer":"default", width:"100%", background:topic ? "linear-gradient(135deg,"+accent+","+accent+"BB)" : "rgba(255,255,255,0.08)", borderRadius:14, padding:"14px", color:topic?"#060B20":"rgba(255,255,255,0.25)", fontWeight:900, fontSize:15, fontFamily:"inherit" }}>
                {topic ? `Start — ${topic} →` : "Select a topic above"}
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Main Creative Experience ═══ */}
        {step === 3 && (
          <div style={{ animation:"fadeUp 0.4s ease" }}>
            {/* Stage/Topic header bar */}
            <div style={{ background:"linear-gradient(135deg,"+accent+"12,rgba(255,255,255,0.02))", border:"1px solid "+accent+"25", borderRadius:18, padding:"12px 18px", marginBottom:14, display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
              <span style={{ fontSize:24 }}>🎨</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:900, fontSize:13, color:accent }}>{stage.name} · {stage.ages}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{topic} · {stage.grades}</div>
              </div>
              <button onClick={() => { sndTick(); setStep(2); }} style={{ border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", background:"rgba(255,255,255,0.06)", borderRadius:10, padding:"5px 10px", color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:700, fontFamily:"inherit" }}>Change Topic</button>
            </div>

            {/* ═══ GUIDED ART PROJECTS ═══ */}
            {stageProjects.length > 0 && (
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:11, fontWeight:900, color:"rgba(255,255,255,0.3)", letterSpacing:2, marginBottom:10 }}>GUIDED ART PROJECTS</div>

                {/* Active project expanded view */}
                {activeProject && !projectCompleted && (
                  <div style={{ background:"linear-gradient(135deg,"+accent+"12,rgba(255,255,255,0.03))", border:"2px solid "+accent+"40", borderRadius:18, padding:isMobile?16:20, marginBottom:14, animation:"fadeUp 0.3s ease" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:28 }}>{activeProject.project.emoji}</span>
                        <div>
                          <div style={{ fontWeight:900, fontSize:15, color:accent }}>{activeProject.project.title}</div>
                          <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>Step {activeProject.currentStep + 1} of {activeProject.project.steps.length}</div>
                        </div>
                      </div>
                      <button onClick={closeProject} style={{ border:"none", cursor:"pointer", background:"rgba(255,255,255,0.08)", borderRadius:8, padding:"4px 10px", color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:700, fontFamily:"inherit" }}>Close</button>
                    </div>
                    {/* Progress bar */}
                    <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:10, height:6, marginBottom:16, overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:10, background:`linear-gradient(90deg,${accent},${accent}BB)`, width:`${((activeProject.currentStep + 1) / activeProject.project.steps.length) * 100}%`, transition:"width 0.4s ease" }} />
                    </div>
                    <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:14, padding:"16px 18px", marginBottom:14, fontSize:15, fontWeight:700, lineHeight:1.8, color:"#fff" }}>
                      <span style={{ color:accent, marginRight:8 }}>Step {activeProject.currentStep + 1}:</span>
                      {activeProject.project.steps[activeProject.currentStep]}
                    </div>
                    <button onClick={nextProjectStep} style={{ border:"none", cursor:"pointer", width:"100%", background:`linear-gradient(135deg,${accent},${accent}BB)`, borderRadius:14, padding:"13px", color:"#060B20", fontWeight:900, fontSize:14, fontFamily:"inherit" }}>
                      {activeProject.currentStep >= activeProject.project.steps.length - 1 ? "Done! Complete Project" : "Done! Next step →"}
                    </button>
                  </div>
                )}

                {/* Project completed celebration */}
                {projectCompleted && activeProject && (
                  <div style={{ background:"linear-gradient(135deg,#FFC30018,#FF8C6912)", border:"2px solid #FFC30060", borderRadius:18, padding:24, marginBottom:14, textAlign:"center", animation:"fadeUp 0.3s ease" }}>
                    <div style={{ fontSize:52, marginBottom:8, animation:"starPulse 1s ease infinite" }}>⭐</div>
                    <div style={{ fontWeight:900, fontSize:20, color:"#FFC300", marginBottom:6 }}>Project Complete!</div>
                    <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginBottom:16 }}>Amazing work on "{activeProject.project.title}"! You earned 35 XP!</div>
                    <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                      <button onClick={() => { sndTick(); cameraInputRef.current?.click(); }} style={{ border:"none", cursor:"pointer", background:`linear-gradient(135deg,${accent},${accent}BB)`, borderRadius:12, padding:"10px 20px", color:"#060B20", fontWeight:900, fontSize:13, fontFamily:"inherit" }}>
                        Show Starky your finished work!
                      </button>
                      <button onClick={closeProject} style={{ border:"1px solid rgba(255,255,255,0.15)", cursor:"pointer", background:"rgba(255,255,255,0.06)", borderRadius:12, padding:"10px 20px", color:"rgba(255,255,255,0.5)", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {/* Project cards grid */}
                {!activeProject && (
                  <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)", gap:10 }}>
                    {stageProjects.map((proj, idx) => (
                      <div key={idx} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:16, transition:"all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor=accent+"50"; e.currentTarget.style.background=accent+"0A"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                          <span style={{ fontSize:24 }}>{proj.emoji}</span>
                          <div>
                            <div style={{ fontWeight:900, fontSize:13, color:"#fff" }}>{proj.title}</div>
                            <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{proj.time} · {proj.steps.length} steps</div>
                          </div>
                        </div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
                          {proj.materials.map(m => <span key={m} style={{ background:"rgba(255,255,255,0.06)", borderRadius:8, padding:"2px 7px", fontSize:10, color:"rgba(255,255,255,0.4)" }}>{m}</span>)}
                        </div>
                        <button onClick={() => startProject(proj)} style={{ border:"none", cursor:"pointer", width:"100%", background:`linear-gradient(135deg,${accent}25,${accent}10)`, border:`1px solid ${accent}30`, borderRadius:10, padding:"8px", color:accent, fontWeight:800, fontSize:12, fontFamily:"inherit" }}>
                          Start this project →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══ DRAWING CANVAS ═══ */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:900, color:"rgba(255,255,255,0.3)", letterSpacing:2, marginBottom:10 }}>DRAWING CANVAS</div>
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, overflow:"hidden", padding:14 }}>
                {/* Canvas */}
                <canvas
                  ref={canvasRef}
                  style={{ width:"100%", height:300, borderRadius:12, cursor:"crosshair", touchAction:"none", background:"#fff", display:"block" }}
                  onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
                  onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
                />

                {/* Color picker */}
                <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:12, flexWrap:"wrap" }}>
                  <span style={{ fontSize:10, fontWeight:800, color:"rgba(255,255,255,0.3)", marginRight:4 }}>COLOUR</span>
                  {CANVAS_COLORS.map(c => (
                    <button key={c.hex} onClick={() => { sndTick(); setBrushColor(c.hex); setIsEraser(false); }}
                      style={{
                        width:28, height:28, borderRadius:"50%", border: brushColor===c.hex && !isEraser ? `3px solid ${accent}` : "2px solid rgba(255,255,255,0.2)",
                        background:c.hex, cursor:"pointer", padding:0, transition:"all 0.15s",
                        boxShadow: brushColor===c.hex && !isEraser ? `0 0 8px ${accent}60` : "none"
                      }}
                      title={c.name}
                    />
                  ))}
                </div>

                {/* Brush size + tools */}
                <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:10, flexWrap:"wrap" }}>
                  <span style={{ fontSize:10, fontWeight:800, color:"rgba(255,255,255,0.3)", marginRight:4 }}>SIZE</span>
                  {BRUSH_SIZES.map(b => (
                    <button key={b.name} onClick={() => { sndTick(); setBrushSize(b.size); setIsEraser(false); }}
                      style={{
                        border: brushSize===b.size && !isEraser ? `2px solid ${accent}` : "1px solid rgba(255,255,255,0.15)",
                        cursor:"pointer", background: brushSize===b.size && !isEraser ? accent+"20" : "rgba(255,255,255,0.06)",
                        borderRadius:10, padding:"5px 12px", fontSize:11, fontWeight:700, color: brushSize===b.size && !isEraser ? accent : "rgba(255,255,255,0.5)", fontFamily:"inherit"
                      }}>
                      {b.name}
                    </button>
                  ))}
                  <div style={{ width:1, height:20, background:"rgba(255,255,255,0.1)", margin:"0 4px" }}/>
                  <button onClick={() => { sndTick(); setIsEraser(true); }}
                    style={{ border: isEraser ? `2px solid ${accent}` : "1px solid rgba(255,255,255,0.15)", cursor:"pointer", background: isEraser ? accent+"20" : "rgba(255,255,255,0.06)", borderRadius:10, padding:"5px 12px", fontSize:11, fontWeight:700, color: isEraser ? accent : "rgba(255,255,255,0.5)", fontFamily:"inherit" }}>
                    Eraser
                  </button>
                  <button onClick={undoCanvas}
                    style={{ border:"1px solid rgba(255,255,255,0.15)", cursor:"pointer", background:"rgba(255,255,255,0.06)", borderRadius:10, padding:"5px 12px", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.5)", fontFamily:"inherit" }}>
                    Undo
                  </button>
                  <button onClick={clearCanvas}
                    style={{ border:"1px solid rgba(255,107,107,0.25)", cursor:"pointer", background:"rgba(255,107,107,0.08)", borderRadius:10, padding:"5px 12px", fontSize:11, fontWeight:700, color:"rgba(255,107,107,0.7)", fontFamily:"inherit" }}>
                    Clear
                  </button>
                </div>

                {/* Show Starky button */}
                <button onClick={showDrawing} disabled={sendingDrawing || loading || limitReached}
                  style={{ marginTop:12, border:"none", cursor:sendingDrawing?"default":"pointer", width:"100%", background:`linear-gradient(135deg,${accent},${accent}BB)`, borderRadius:14, padding:"13px", color:"#060B20", fontWeight:900, fontSize:14, fontFamily:"inherit", opacity:sendingDrawing?0.6:1 }}>
                  {sendingDrawing ? "Sending to Starky..." : "Show Starky my drawing!"}
                </button>
              </div>
            </div>

            {/* ═══ CHAT ═══ */}
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, overflow:"hidden" }}>
              <div style={{ height:isMobile?420:500, overflowY:"auto", padding:isMobile?14:20, display:"flex", flexDirection:"column", gap:12 }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start", gap:10, animation:"fadeUp 0.3s ease" }}>
                    {msg.role==="assistant" && <div style={{ width:30, height:30, borderRadius:"50%", background:accent+"20", border:"1px solid "+accent+"40", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, marginTop:2 }}>🎨</div>}
                    <div style={{ maxWidth:"88%", padding:"12px 15px", borderRadius:16, background:msg.role==="user"?"linear-gradient(135deg,"+accent+"CC,"+accent+"88)":"rgba(255,255,255,0.06)", color:msg.role==="user"?"#060B20":"#fff", fontSize:13, lineHeight:1.85, fontWeight:msg.role==="user"?700:400, whiteSpace:"pre-wrap" }}>{msg.content}</div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:30, height:30, borderRadius:"50%", background:accent+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🎨</div>
                    <div style={{ display:"flex", gap:4 }}>{[0,0.2,0.4].map((d,j) => <div key={j} style={{ width:8, height:8, borderRadius:"50%", background:accent, animation:`bounce 1s ${d}s ease-in-out infinite`, opacity:0.8 }}/>)}</div>
                  </div>
                )}

                {/* "What's Next" inline card */}
                {showWhatsNext && !loading && (
                  <div style={{ background:"linear-gradient(135deg,#FFC30010,#FF8C6908)", border:"1px solid #FFC30025", borderRadius:16, padding:"14px 16px", animation:"fadeUp 0.4s ease" }}>
                    <div style={{ fontWeight:900, fontSize:13, color:"#FFC300", marginBottom:4 }}>Want to create something?</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>Try a guided project above! Or show me your artwork with the camera.</div>
                  </div>
                )}

                <div ref={chatEndRef}/>
              </div>
              {limitReached ? (
                <div style={{ padding:"16px", borderTop:"1px solid rgba(255,107,107,0.2)", background:"rgba(255,107,107,0.06)", textAlign:"center" }}>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginBottom:10 }}>
                    You've used today's 5 free sessions — great work!
                  </div>
                  <a href="/pricing" style={{ display:"inline-block", background:"linear-gradient(135deg,#FFC300,#FF8E53)", borderRadius:12, padding:"10px 24px", fontWeight:900, fontSize:13, color:"#060B20", textDecoration:"none", fontFamily:"'Nunito',sans-serif" }}>
                    Unlock Unlimited Sessions
                  </a>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:8 }}>Sessions reset at midnight · Plans from $29.99/mo</div>
                </div>
              ) : (
              <div style={{ padding:"12px 16px", borderTop:"1px solid "+accent+"15" }}>
                {/* Image preview */}
                {uploadedImage && (
                  <div style={{ marginBottom:10, display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ position:"relative" }}>
                      <img src={uploadedImage.preview} style={{ width:60, height:60, objectFit:"cover", borderRadius:10, border:"2px solid "+accent+"40" }} alt="Upload preview" />
                      <button onClick={() => setUploadedImage(null)} style={{ position:"absolute", top:-6, right:-6, width:18, height:18, borderRadius:"50%", background:"#E53E3E", border:"none", color:"#fff", fontSize:11, fontWeight:900, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1, padding:0 }}>×</button>
                    </div>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>Show Starky your artwork for feedback!</span>
                  </div>
                )}
                <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
                  {/* Camera button */}
                  <button onClick={() => { sndTick(); cameraInputRef.current?.click(); }} title="Take photo" style={{ border:"1px solid rgba(255,255,255,0.12)", cursor:"pointer", background:"rgba(255,255,255,0.05)", borderRadius:12, padding:"9px 10px", fontSize:16, lineHeight:1, flexShrink:0, color:"rgba(255,255,255,0.6)" }}>
                    📷
                  </button>
                  <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={handleImageSelect} />
                  {/* File upload button */}
                  <button onClick={() => { sndTick(); fileInputRef.current?.click(); }} title="Upload image" style={{ border:"1px solid rgba(255,255,255,0.12)", cursor:"pointer", background:"rgba(255,255,255,0.05)", borderRadius:12, padding:"9px 10px", fontSize:16, lineHeight:1, flexShrink:0, color:"rgba(255,255,255,0.6)" }}>
                    📎
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleImageSelect} />
                  {/* Text input */}
                  <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&(e.ctrlKey||e.metaKey))sendMessage(input);}} placeholder={`Ask Starky about ${topic}... Ctrl+Enter to send`} rows={2}
                    style={{ flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid "+accent+"22", borderRadius:14, padding:"10px 13px", color:"#fff", fontSize:13, fontFamily:"'Nunito',sans-serif", resize:"vertical", lineHeight:1.6 }}/>
                  <button onClick={()=>sendMessage(input)} disabled={(!input.trim()&&!uploadedImage)||loading||limitReached}
                    style={{ border:"none", cursor:(input.trim()||uploadedImage)&&!loading?"pointer":"default", background:(input.trim()||uploadedImage)&&!loading?"linear-gradient(135deg,"+accent+","+accent+"BB)":"rgba(255,255,255,0.08)", borderRadius:12, padding:"9px 18px", color:(input.trim()||uploadedImage)&&!loading?"#060B20":"rgba(255,255,255,0.3)", fontWeight:900, fontSize:13, fontFamily:"inherit", flexShrink:0 }}>
                    {loading?"Thinking...":"Send →"}
                  </button>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:6 }}>
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.2)" }}>{callsLeft<=10&&!limitReached?`${callsLeft} calls left`:""}</span>
                </div>
              </div>
              )}
            </div>

            {/* Quick prompt buttons */}
            <div style={{ marginTop:10, display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:8 }}>
              {[
                { e:"🖌️", t:"Teach a technique", p:`Teach me a specific technique for ${topic} at ${stage.name} level, step by step.` },
                { e:"🎭", t:"Artist study", p:`Recommend an artist relevant to ${topic} at ${stage.name} level and tell me about them.` },
                { e:"✅", t:"Feedback please", p:`I'd like feedback on my ${topic} work. What should I focus on to improve?` },
                { e:"💡", t:"Give me ideas", p:`Give me 3 creative project ideas for ${topic} at ${stage.name} level.` },
              ].map(q => (
                <button key={q.t} onClick={()=>{sndTick();sendMessage(q.p);}}
                  style={{ border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer", background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"9px 8px", textAlign:"center", color:"rgba(255,255,255,0.55)", fontSize:11, fontWeight:700, fontFamily:"inherit" }}
                  onMouseEnter={e=>{e.currentTarget.style.background=accent+"12";e.currentTarget.style.color=accent;e.currentTarget.style.borderColor=accent+"40";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.color="rgba(255,255,255,0.55)";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}>
                  <div style={{ fontSize:16, marginBottom:3 }}>{q.e}</div>{q.t}
                </button>
              ))}
            </div>

            {/* ═══ MY GALLERY ═══ */}
            <div style={{ marginTop:20 }}>
              <button onClick={() => { sndTick(); setShowGallery(!showGallery); }}
                style={{ border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"12px 18px", width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", fontFamily:"inherit" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:20 }}>🖼️</span>
                  <div style={{ textAlign:"left" }}>
                    <div style={{ fontWeight:900, fontSize:13, color:"#fff" }}>My Gallery</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{gallery.length} artwork{gallery.length !== 1 ? 's' : ''} saved</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  {artXP > 0 && <span style={{ background:"linear-gradient(135deg,#FFC300,#FF8E53)", borderRadius:12, padding:"3px 10px", fontSize:10, fontWeight:900, color:"#060B20" }}>{artXP} XP</span>}
                  <span style={{ fontSize:14, color:"rgba(255,255,255,0.4)", transform:showGallery?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</span>
                </div>
              </button>
              {showGallery && (
                <div style={{ marginTop:10, animation:"fadeUp 0.3s ease" }}>
                  {gallery.length === 0 ? (
                    <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"30px 20px", textAlign:"center" }}>
                      <div style={{ fontSize:32, marginBottom:8 }}>🎨</div>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>No artworks yet! Draw on the canvas or upload a photo to start your gallery.</div>
                    </div>
                  ) : (
                    <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(3,1fr)", gap:10 }}>
                      {gallery.map(item => (
                        <div key={item.id} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, overflow:"hidden", cursor:"pointer" }}
                          onClick={() => setGalleryViewing(item)}>
                          <img src={item.image} style={{ width:"100%", height:120, objectFit:"cover", display:"block" }} alt={item.title} />
                          <div style={{ padding:"8px 10px" }}>
                            <div style={{ fontWeight:700, fontSize:11, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title}</div>
                            <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>{item.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Gallery full-size viewer overlay */}
            {galleryViewing && (
              <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.9)", zIndex:9998, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20 }}
                onClick={() => setGalleryViewing(null)}>
                <img src={galleryViewing.image} style={{ maxWidth:"90%", maxHeight:"70vh", borderRadius:16, objectFit:"contain" }} alt={galleryViewing.title} />
                <div style={{ marginTop:14, textAlign:"center" }}>
                  <div style={{ fontWeight:900, fontSize:16, color:"#fff" }}>{galleryViewing.title}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{galleryViewing.date}</div>
                </div>
                <div style={{ display:"flex", gap:10, marginTop:14 }}>
                  <button onClick={(e) => { e.stopPropagation(); sndTick(); }} style={{ border:"1px solid rgba(255,255,255,0.2)", cursor:"pointer", background:"rgba(255,255,255,0.1)", borderRadius:12, padding:"8px 18px", color:"#fff", fontWeight:700, fontSize:12, fontFamily:"inherit" }}>
                    Share with teacher
                  </button>
                  <button onClick={() => setGalleryViewing(null)} style={{ border:"none", cursor:"pointer", background:"rgba(255,255,255,0.15)", borderRadius:12, padding:"8px 18px", color:"#fff", fontWeight:700, fontSize:12, fontFamily:"inherit" }}>
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ═══ CROSS-LINKS ═══ */}
        {step === 3 && (
          <div style={{ marginTop:24, display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:10 }}>
            {[
              { emoji:"🎵", label:"Music", href:"/music", color:"#4F8EF7" },
              { emoji:"📖", label:"Reading", href:"/reading", color:"#A8E063" },
              { emoji:"💜", label:"Special Needs Arts", href:"/arts-for-all", color:"#C77DFF" },
              { emoji:"🐝", label:"Spelling Bee", href:"/spelling-bee", color:"#FFC300" },
            ].map(link => (
              <a key={link.href} href={link.href} onClick={sndTick}
                style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"14px 12px", textAlign:"center", textDecoration:"none", transition:"all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=link.color+"50"; e.currentTarget.style.background=link.color+"0A"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}>
                <div style={{ fontSize:24, marginBottom:4 }}>{link.emoji}</div>
                <div style={{ fontWeight:800, fontSize:12, color:link.color }}>{link.label}</div>
              </a>
            ))}
          </div>
        )}

        {/* ═══ Pricing Banner ═══ */}
        <div style={{ marginTop:24, background:"linear-gradient(135deg,#FF8C6915,#C77DFF10)", border:"1px solid #FF8C6930", borderRadius:18, padding:"18px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontWeight:900, fontSize:14, color:"#FF8C69", marginBottom:4 }}>Creative Bundle — $79.99/month</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.7 }}>Unlimited Music, Arts & Reading. All ages KG to A-Level. 7-day free trial.</div>
          </div>
          <a href="/pricing" style={{ background:"linear-gradient(135deg,#FF8C69,#C77DFF)", borderRadius:12, padding:"9px 20px", color:"#fff", fontWeight:900, fontSize:13, textDecoration:"none", whiteSpace:"nowrap" }}>View Plans →</a>
        </div>

        {/* ═══ Footer ═══ */}
        <div style={{ marginTop:32, paddingTop:20, borderTop:"1px solid rgba(255,255,255,0.05)", textAlign:"center" }}>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.2)", lineHeight:1.8, maxWidth:560, margin:"0 auto" }}>
            NewWorldEdu is an educational platform — not a replacement for qualified art teachers.{" "}
            <a href="/terms" style={{ color:"rgba(255,255,255,0.3)", textDecoration:"underline" }}>Disclaimer</a>
            {" · "}© 2026 NewWorldEdu
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
