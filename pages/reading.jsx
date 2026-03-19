import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useSessionLimit } from "../utils/useSessionLimit";

const STAGES = [
  { id:"early", emoji:"🌱", name:"Early Years", ages:"Ages 3–6", grades:"Nursery · KG", color:"#A8E063",
    topics:["Phonological Awareness","Letter Sounds (Phonics)","Rhyming Games","Picture Books","Storytelling","Sight Words","Print Awareness","Reading Aloud Together"],
    desc:"First steps in reading — letters, sounds, stories, and the magic of books." },
  { id:"primary", emoji:"🌿", name:"Primary", ages:"Ages 6–11", grades:"Years 1–6", color:"#63D2FF",
    topics:["Reading Comprehension","Phonics & Decoding","Fluency","Vocabulary Building","Fiction Analysis","Non-Fiction Reading","Poetry","Spelling Strategies"],
    desc:"Building confident readers — comprehension, fluency, and a love of books." },
  { id:"secondary", emoji:"🌳", name:"Secondary", ages:"Ages 11–16", grades:"Years 7–11 · GCSE", color:"#FFC300",
    topics:["GCSE English Literature","GCSE English Language","Shakespeare","19th Century Fiction","Modern Texts","Unseen Poetry","Anthology Poetry","Reading Non-Fiction"],
    desc:"GCSE English — texts, language analysis, and literary criticism." },
  { id:"sixthform", emoji:"🎓", name:"Sixth Form", ages:"Ages 16–18", grades:"A-Level · IB", color:"#C77DFF",
    topics:["A-Level Literature","Unseen Texts","Comparative Essays","Literary Theory","IB Language & Literature","Critical Analysis","Personal Study","University Preparation"],
    desc:"A-Level and IB — advanced literary analysis, theory, and critical writing." },
];

function buildPrompt(stage, topic) {
  const stagePrompts = {
    early: `You are Starky, a warm and playful early reading teacher (ages 3-6).
APPROACH: Everything is fun, musical, and game-like. 
For phonics: clap syllables, make letter sounds together, rhyme words.
For books: ask "What do you see?" "What happens next?" "How does she feel?"
Speak to the child directly. Short sentences. Lots of praise.
Never rush — phonological awareness at this age IS reading development.
Parent note at end: [one simple activity to do at home tonight]`,
    primary: `You are Starky, an encouraging primary reading and English teacher (ages 6-11, ${stage.grades}).
Focus: ${topic || "reading skills"} at primary level.
For comprehension: literal → inferential → evaluative questions in that order.
For phonics/decoding: systematic, multisensory, explicit.
For vocabulary: context first, then definition, then use it in a sentence.
For writing: oral rehearsal before pen to paper.
Always praise attempt before correcting. Make books feel like adventures.`,
    secondary: `You are Starky, a GCSE English specialist (ages 11-16, ${stage.grades}).
Focus: ${topic || "GCSE English"}.
CAMBRIDGE IGCSE ENGLISH (0522/0500) + UK GCSE: You know every mark scheme, Assessment Objective, and examiner report.
Cambridge English Language: directed writing, informative/descriptive writing, summary skills — all examined.
Cambridge English Literature (0475): poetry, prose, drama — extract questions + essay questions.
UK GCSE AOs: AO1 (ideas/textual evidence), AO2 (language/structure/form analysis), AO3 (context), AO4 (accuracy).
Paragraph structure: PEEL (Point, Evidence, Explain, Link) for literature; IDEA (Identify, Detail, Effect, Analysis) for language.
Language analysis: identify technique → name it precisely → quote it → effect on reader → writer's intent.
Shakespeare: always context + character + theme + language + quote — all five.
19th century fiction, modern texts, unseen poetry: all covered with exam technique.
Examiner tip: Most marks lost by IDENTIFYING a technique but not EXPLAINING its effect. Drill the "because/which suggests/this implies" chain.
Mark scheme awareness: top marks require personal interpretation supported by precise textual evidence.`,
    sixthform: `You are Starky, an A-Level and IB English Literature specialist (ages 16-18).
Focus: ${topic || "A-Level Literature"}.
CAMBRIDGE A-LEVEL ENGLISH (9695) + UK A-LEVEL: You know every mark scheme, Assessment Objective, and examiner expectation.
Cambridge A-Level English Literature: Paper 1 (poetry & prose pre-1900), Paper 2 (drama), Coursework (personal study).
UK A-Level AOs: AO1 (articulate argument), AO2 (language/form/structure analysis), AO3 (connections across texts), AO4 (contexts), AO5 (critical perspectives).
Essay structure: clear thesis → textual evidence (precise quotes) → literary analysis → critical or contextual perspective → development of argument.
IB English: Paper 1 (unseen commentary — HOW meaning is created), Paper 2 (comparative essay — two works), HL Essay (independent literary analysis).
Critical perspectives: bring in relevant critics but evaluate them — never treat critics as authorities to agree with.
Comparative essays: always link back to the question. Never summarise. Always ANALYSE.
Command words: Analyse (how it works), Evaluate (how successfully), Explore (multiple readings), Compare (meaningful connections with evidence).
Treat the student as an intellectual equal. Push back on underdeveloped arguments — help them think harder, not differently.`,
  };
  return stagePrompts[stage.id] + `\n\nCurrent topic: ${topic || stage.topics[0]}\nStage: ${stage.name} (${stage.ages})\n\nIf the student writes in Urdu or Arabic, respond in that language.`;
}

export default function ReadingPage() {
  const [step, setStep] = useState(1);
  const [stage, setStage] = useState(null);
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const chatEndRef = useRef(null);
  const { callsLeft, limitReached, recordCall } = useSessionLimit();

  useEffect(() => { const fn = () => setIsMobile(window.innerWidth < 768); fn(); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  const accent = stage?.color || "#63D2FF";

  const startChat = () => {
    if (!stage || !topic) return;
    setMessages([{ role:"assistant", content:`📚 Welcome to Reading with Starky!\n\nYou're a **${stage.name}** student (${stage.ages}) and we're working on **${topic}** today.\n\nReady to dive in? Ask me anything, share something you're reading, or I can set you a task to start.` }]);
    setStep(3);
  };

  const sendMessage = async (text) => {
    const txt = (text || input).trim();
    if (!txt || loading || limitReached) return;
    setInput(""); recordCall();
    const prev = [...messages, { role:"user", content:txt }];
    setMessages(prev); setLoading(true);
    try {
      const res = await fetch("/api/chat", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-haiku-4-5-20251001", max_tokens:1200, system:buildPrompt(stage, topic), messages:prev.map(m=>({role:m.role,content:m.content})) }) });
      const data = await res.json();
      setMessages(p => [...p, { role:"assistant", content:data.content?.[0]?.text || "Something went wrong." }]);
    } catch { setMessages(p => [...p, { role:"assistant", content:"Connection error. Please try again." }]); }
    setLoading(false);
  };

  const CSS = `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');*{box-sizing:border-box}button:focus,textarea:focus{outline:none}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:4px}@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`;

  return (
    <>
    <Head>
      <title>Reading — NewWorldEdu</title>
      <meta name="description" content="Guided reading for Cambridge students. Comprehension practice, vocabulary building, and literary analysis with personalised support." />
      <meta property="og:title" content="Reading — NewWorldEdu" />
      <meta property="og:description" content="Guided reading for Cambridge students. Comprehension practice, vocabulary building, and literary analysis with personalised support." />
    </Head>
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#060B20 0%,#0D1635 60%,#060B20 100%)", fontFamily:"'Nunito',sans-serif", color:"#fff" }}>
      <style>{CSS}</style>
      <header style={{ padding:isMobile?"12px 16px":"14px 28px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <a href="/" style={{ textDecoration:"none", fontWeight:900, fontSize:15, color:"#fff" }}>NewWorldEdu<span style={{ color:"#4F8EF7" }}>★</span></a>
        <div style={{ display:"flex", gap:10 }}>
          {step > 1 && <button onClick={() => { setStep(1); setStage(null); setTopic(""); setMessages([]); }} style={{ border:"none", cursor:"pointer", background:"rgba(255,255,255,0.05)", borderRadius:10, padding:"6px 12px", color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, fontFamily:"inherit" }}>← Start Over</button>}
          <a href="/pricing" style={{ background:"linear-gradient(135deg,#4F8EF7,#7B5EA7)", borderRadius:12, padding:"7px 16px", color:"#fff", fontWeight:900, fontSize:12, textDecoration:"none" }}>Plans</a>
        </div>
      </header>

      <div style={{ maxWidth:820, margin:"0 auto", padding:isMobile?"20px 16px":"40px 24px" }}>

        {step === 1 && (
          <div style={{ animation:"fadeUp 0.4s ease" }}>
            <div style={{ textAlign:"center", marginBottom:36 }}>
              <div style={{ fontSize:isMobile?52:72, marginBottom:12 }}>📚</div>
              <h1 style={{ fontSize:isMobile?26:44, fontWeight:900, margin:"0 0 10px" }}>Reading with <span style={{ color:"#63D2FF" }}>Starky</span></h1>
              <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", maxWidth:500, margin:"0 auto", lineHeight:1.9 }}>From first sounds to A-Level essays. Starky teaches reading and English at your exact level.</p>
            </div>
            <div style={{ fontSize:11, fontWeight:900, color:"rgba(255,255,255,0.3)", letterSpacing:2, textAlign:"center", marginBottom:16 }}>SELECT YOUR LEVEL</div>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:14 }}>
              {STAGES.map(s => (
                <button key={s.id} onClick={() => { setStage(s); setStep(2); }}
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

        {step === 2 && (
          <div style={{ animation:"fadeUp 0.4s ease" }}>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <div style={{ fontSize:44, marginBottom:8 }}>{stage.emoji}</div>
              <h2 style={{ fontSize:isMobile?22:32, fontWeight:900, margin:"0 0 6px" }}>What shall we <span style={{ color:accent }}>focus on?</span></h2>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.8 }}>{stage.name} · {stage.ages} · {stage.grades}</p>
            </div>
            <div style={{ background:accent+"0A", border:"1px solid "+accent+"25", borderRadius:18, padding:20 }}>
              <div style={{ fontSize:11, fontWeight:900, color:accent, letterSpacing:1, marginBottom:14 }}>SELECT TOPIC</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
                {stage.topics.map(t => (
                  <button key={t} onClick={() => setTopic(t)}
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

        {step === 3 && (
          <div style={{ animation:"fadeUp 0.4s ease" }}>
            <div style={{ background:"linear-gradient(135deg,"+accent+"12,rgba(255,255,255,0.02))", border:"1px solid "+accent+"25", borderRadius:18, padding:"12px 18px", marginBottom:14, display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
              <span style={{ fontSize:24 }}>📚</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:900, fontSize:13, color:accent }}>{stage.name} · {stage.ages}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{topic} · {stage.grades}</div>
              </div>
              <button onClick={() => setStep(2)} style={{ border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", background:"rgba(255,255,255,0.06)", borderRadius:10, padding:"5px 10px", color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:700, fontFamily:"inherit" }}>Change Topic</button>
            </div>
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, overflow:"hidden" }}>
              <div style={{ height:isMobile?420:500, overflowY:"auto", padding:isMobile?14:20, display:"flex", flexDirection:"column", gap:12 }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start", gap:10, animation:"fadeUp 0.3s ease" }}>
                    {msg.role==="assistant" && <div style={{ width:30, height:30, borderRadius:"50%", background:accent+"20", border:"1px solid "+accent+"40", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, marginTop:2 }}>📚</div>}
                    <div style={{ maxWidth:"88%", padding:"12px 15px", borderRadius:16, background:msg.role==="user"?"linear-gradient(135deg,"+accent+"CC,"+accent+"88)":"rgba(255,255,255,0.06)", color:msg.role==="user"?"#060B20":"#fff", fontSize:13, lineHeight:1.85, fontWeight:msg.role==="user"?700:400, whiteSpace:"pre-wrap" }}>{msg.content}</div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:30, height:30, borderRadius:"50%", background:accent+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>📚</div>
                    <div style={{ display:"flex", gap:4 }}>{[0,0.2,0.4].map((d,j) => <div key={j} style={{ width:8, height:8, borderRadius:"50%", background:accent, animation:`bounce 1s ${d}s ease-in-out infinite`, opacity:0.8 }}/>)}</div>
                  </div>
                )}
                <div ref={chatEndRef}/>
              </div>
              {limitReached ? (
                <div style={{ padding:"16px", borderTop:"1px solid rgba(255,107,107,0.2)", background:"rgba(255,107,107,0.06)", textAlign:"center" }}>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginBottom:10 }}>
                    ⭐ You've used today's 5 free sessions — great work!
                  </div>
                  <a href="/pricing" style={{ display:"inline-block", background:"linear-gradient(135deg,#FFC300,#FF8E53)", borderRadius:12, padding:"10px 24px", fontWeight:900, fontSize:13, color:"#060B20", textDecoration:"none", fontFamily:"'Nunito',sans-serif" }}>
                    Unlock Unlimited Sessions 🚀
                  </a>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:8 }}>Sessions reset at midnight · Plans from $29.99/mo</div>
                </div>
              ) : (
              <div style={{ padding:"12px 16px", borderTop:"1px solid "+accent+"15" }}>
                <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&(e.ctrlKey||e.metaKey))sendMessage(input);}} placeholder={`Ask Starky about ${topic}... Ctrl+Enter to send`} rows={3}
                  style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid "+accent+"22", borderRadius:14, padding:"11px 13px", color:"#fff", fontSize:13, fontFamily:"'Nunito',sans-serif", resize:"vertical", lineHeight:1.6 }}/>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.2)" }}>{callsLeft<=10&&!limitReached?`${callsLeft} calls left`:""}</span>
                  <button onClick={()=>sendMessage(input)} disabled={!input.trim()||loading||limitReached}
                    style={{ border:"none", cursor:input.trim()&&!loading?"pointer":"default", background:input.trim()&&!loading?"linear-gradient(135deg,"+accent+","+accent+"BB)":"rgba(255,255,255,0.08)", borderRadius:12, padding:"9px 22px", color:input.trim()&&!loading?"#060B20":"rgba(255,255,255,0.3)", fontWeight:900, fontSize:13, fontFamily:"inherit" }}>
                    {loading?"Thinking...":"Send →"}
                  </button>
                </div>
              </div>
              )}
            </div>
            <div style={{ marginTop:10, display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:8 }}>
              {[
                { e:"📝", t:"Analyse this", p:`Help me analyse a passage or text for ${topic} at ${stage.name} level.` },
                { e:"🎯", t:"Set me a task", p:`Give me a reading or writing task for ${topic} at ${stage.name} level.` },
                { e:"✅", t:"Test me", p:`Give me 3 comprehension or analysis questions on ${topic}.` },
                { e:"💡", t:"Top tips", p:`What are the top tips for doing well in ${topic} at ${stage.name} level?` },
              ].map(q => (
                <button key={q.t} onClick={()=>sendMessage(q.p)}
                  style={{ border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer", background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"9px 8px", textAlign:"center", color:"rgba(255,255,255,0.55)", fontSize:11, fontWeight:700, fontFamily:"inherit" }}
                  onMouseEnter={e=>{e.currentTarget.style.background=accent+"12";e.currentTarget.style.color=accent;e.currentTarget.style.borderColor=accent+"40";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.color="rgba(255,255,255,0.55)";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}>
                  <div style={{ fontSize:16, marginBottom:3 }}>{q.e}</div>{q.t}
                </button>
              ))}
            </div>
          </div>
        )}

        
            <div style={{ marginTop:24, background:"linear-gradient(135deg,#FF8C6915,#C77DFF10)", border:"1px solid #FF8C6930", borderRadius:18, padding:"18px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
              <div>
                <div style={{ fontWeight:900, fontSize:14, color:"#FF8C69", marginBottom:4 }}>🎨 Creative Bundle — $79.99/month</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.7 }}>Unlimited Music, Arts & Reading. All ages KG to A-Level. 7-day free trial.</div>
              </div>
              <a href="/pricing" style={{ background:"linear-gradient(135deg,#FF8C69,#C77DFF)", borderRadius:12, padding:"9px 20px", color:"#fff", fontWeight:900, fontSize:13, textDecoration:"none", whiteSpace:"nowrap" }}>View Plans →</a>
            </div>
        <div style={{ marginTop:32, paddingTop:20, borderTop:"1px solid rgba(255,255,255,0.05)", textAlign:"center" }}>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.2)", lineHeight:1.8, maxWidth:560, margin:"0 auto" }}>
            NewWorldEdu is an educational platform — not a replacement for qualified teachers.{" "}
            <a href="/disclaimer" style={{ color:"rgba(255,255,255,0.3)", textDecoration:"underline" }}>Disclaimer</a>
            {" · "}© 2026 NewWorldEdu
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
