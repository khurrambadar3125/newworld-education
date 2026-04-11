import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useSessionLimit } from '../utils/useSessionLimit';

const FEATURES = [
  { id: 'oral-exam', icon: '🎓', title: 'Oral Exam Simulator', desc: 'Practice your oral exam with Starky as examiner. Get a real band score and feedback.', badge: 'IGCSE | IB | A Level', color: '#4F8EF7', prompt: 'You are a Cambridge IGCSE English oral examiner. Ask one exam-style question. After the student answers, evaluate on: Content (5), Language (5), Fluency (5), Interaction (5) = total /20. Give the score and one specific improvement.', question: 'Tell me about a person who has had a significant influence on your life. Why is this person important to you?', duration: 90 },
  { id: 'reading-fluency', icon: '📖', title: 'Reading Fluency Check', desc: 'Read a passage aloud. Starky finds every mispronunciation and tells you what to practise.', badge: 'All Ages', color: '#4F8EF7', prompt: 'Compare the student\'s spoken transcript to the original passage word by word. Calculate accuracy %. Calculate WPM. List words that differed. Give pronunciation tips for each mispronounced word. Be encouraging.', passage: 'The sun rose slowly over the mountains, casting long shadows across the valley. Birds began their morning songs as the first light touched the river, turning it to liquid gold. In the village below, doors were opening and the smell of fresh bread drifted through narrow streets.', duration: 60 },
  { id: 'pronunciation', icon: '🗣️', title: 'Pronunciation Trainer', desc: 'Starky says a word. You repeat it. Starky tells you if you got it right.', badge: 'All Ages | ESL', color: '#4ADE80', prompt: 'You are a pronunciation coach. Give the student one word at a time. After they attempt it, check if the transcript matches. If correct: celebrate and give next word. If wrong: explain the correct pronunciation with a tip. 10 words per session.', words: ['necessary', 'particularly', 'environment', 'comfortable', 'temperature', 'February', 'library', 'Wednesday', 'schedule', 'pronunciation'], duration: 120 },
  { id: 'debate', icon: '💬', title: 'Debate Coach', desc: 'Argue your position for 90 seconds. Starky evaluates argument, vocabulary, and delivery.', badge: 'IB | A Level', color: '#C77DFF', prompt: 'You are a debate coach. Evaluate the student\'s argument on: Structure (was there a clear position + evidence + conclusion?), Evidence (did they give examples?), Vocabulary (range and precision), Persuasiveness (would this convince someone?), Delivery (pace, confidence, clarity). Score each /10. Give one specific tip.', motion: 'This House believes that artificial intelligence will do more harm than good in education.', duration: 90 },
  { id: 'speaking', icon: '🌟', title: 'Speaking Assessment', desc: 'Speak for 60 seconds on any topic. Get your CEFR level and specific feedback.', badge: 'CEFR | IELTS | EmSAT', color: '#4F8EF7', prompt: 'Evaluate the student\'s speaking on CEFR criteria. Assign a level (A1-C2). Evaluate: Fluency and coherence, Vocabulary range, Grammar range and accuracy, Pronunciation. Give the CEFR level and specific feedback for each criterion.', topic: 'Describe a skill you would like to learn and explain why it interests you.', duration: 60 },
  { id: 'mental-maths', icon: '🔢', title: 'Mental Maths', desc: 'Starky gives a problem. You answer aloud. Timed. Build mental arithmetic confidence.', badge: 'All Ages', color: '#4ADE80', prompt: 'You are a mental maths coach. Give one problem at a time (appropriate to student level). The student says the answer aloud. Check the transcript for the number. Correct → next problem. Wrong → show working, then next. 10 problems. Give speed + accuracy score at end.', duration: 120 },
  { id: 'story-voice', icon: '📚', title: 'Story Voice', desc: 'Tell Starky a story — any story. 2 minutes. Get vocabulary and creativity feedback.', badge: 'Ages 5-14', color: '#C77DFF', prompt: 'Evaluate the student\'s story on: Vocabulary range (varied words?), Sentence variety (not all same structure?), Coherence (does it make sense?), Imagination (original ideas?), Fluency (smooth delivery?). Score each /10. Give creative, encouraging feedback. Suggest a prompt for next time.', starter: 'Once upon a time, in a city where it never rained...', duration: 120 },
  { id: 'presentation', icon: '🎤', title: 'Presentation Practice', desc: 'Deliver a 2-minute presentation. Starky evaluates pace, structure, and vocabulary.', badge: 'IB | University', color: '#4F8EF7', prompt: 'Evaluate the presentation on: Opening hook (did they grab attention?), Structure (clear beginning/middle/end?), Pace (too fast/slow/just right?), Vocabulary (appropriate, varied?), Conclusion (strong ending?). Score each /10. One specific improvement tip.', duration: 120 },
  { id: 'poetry', icon: '🌸', title: 'Poetry Recitation', desc: 'Recite a poem from memory. Starky checks accuracy, expression, and pace.', badge: 'IGCSE | IB', color: '#4F8EF7', prompt: 'Compare the student\'s recitation transcript to the original poem. Calculate word accuracy %. Evaluate expression and pace. For IGCSE/IB coursework: give specific feedback on how to improve the recitation for assessment.', poem: 'I met a traveller from an antique land,\nWho said — "Two vast and trunkless legs of stone\nStand in the desert. Near them, on the sand,\nHalf sunk a shattered visage lies, whose frown,\nAnd wrinkled lip, and sneer of cold command,\nTell that its sculptor well those passions read\nWhich yet survive, stamped on these lifeless things,\nThe hand that mocked them, and the heart that fed;\nAnd on the pedestal, these words appear:\nMy name is Ozymandias, King of Kings;\nLook on my Works, ye Mighty, and despair!\nNothing beside remains. Round the decay\nOf that colossal Wreck, boundless and bare\nThe lone and level sands stretch far away."', duration: 90 },
  { id: 'wellbeing', icon: '💙', title: 'Wellbeing Check-In', desc: 'Tell Starky how you\'re feeling. Starky adjusts today\'s session to match your energy.', badge: 'All Users | SEN', color: '#4ECDC4', prompt: 'The student is checking in about how they feel. Listen carefully to their tone and words. Respond with warmth — name what you heard. Then suggest an appropriate session type: "Based on what I heard, let\'s [gentle session / energetic session / creative session / just talk] today." Never diagnose. Only observe and adapt.', question: 'How are you feeling today? Just speak naturally — 30 seconds.', duration: 30 },
];

const PROG_KEY = 'nw_voice_lab_progress';
function loadProg() { try { return JSON.parse(localStorage.getItem(PROG_KEY) || '{}'); } catch { return {}; } }
function saveProg(d) { try { localStorage.setItem(PROG_KEY, JSON.stringify(d)); } catch {} }

export default function VoiceLabPage() {
  const [step, setStep] = useState('grid'); // grid | active
  const [feature, setFeature] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState({});
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const { recordCall, limitReached } = useSessionLimit();

  useEffect(() => { const fn = () => setIsMobile(window.innerWidth < 768); fn(); window.addEventListener('resize', fn); return () => window.removeEventListener('resize', fn); }, []);
  useEffect(() => { setProgress(loadProg()); }, []);
  useEffect(() => { if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const startFeature = (f) => {
    setFeature(f);
    setStep('active');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    let greeting = '';
    if (f.id === 'reading-fluency') greeting = `**Reading Fluency Check**\n\nRead this passage aloud. Speak clearly and at your natural pace.\n\n---\n${f.passage}\n---\n\nWhen you\'re ready, press the mic or type what you read.`;
    else if (f.id === 'pronunciation') greeting = `**Pronunciation Trainer**\n\nI\'ll give you 10 words. Say each one clearly.\n\nFirst word: **${f.words[0]}**\n\nSay it aloud or type it.`;
    else if (f.id === 'debate') greeting = `**Debate Coach**\n\nMotion: *"${f.motion}"*\n\nDo you want to argue **For** or **Against**?\n\nOnce you choose, you\'ll have 90 seconds to make your case.`;
    else if (f.id === 'story-voice') greeting = `**Story Voice**\n\nHere\'s your story starter:\n\n*"${f.starter}"*\n\nContinue the story for 2 minutes. Let your imagination run. Ready when you are.`;
    else if (f.id === 'poetry') greeting = `**Poetry Recitation — Ozymandias (Shelley)**\n\nStudy this poem. When you\'re ready, I\'ll hide the text and you recite from memory.\n\n${f.poem}\n\nType "ready" when you\'ve memorised it.`;
    else if (f.id === 'wellbeing') greeting = `**Wellbeing Check-In** 💙\n\nHow are you feeling today?\n\nJust speak naturally — there\'s no right or wrong answer. 30 seconds is enough.`;
    else if (f.id === 'mental-maths') greeting = `**Mental Maths** 🔢\n\n10 questions. Answer as fast as you can — speak or type.\n\nQuestion 1: What is 17 × 8?`;
    else greeting = `**${f.title}**\n\n${f.question || f.topic || 'Ready when you are.'}\n\nSpeak into the mic or type your response.`;
    setMessages([{ role: 'assistant', content: greeting }]);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading || limitReached) return;
    setInput('');
    recordCall();
    const newMsgs = [...messages, { role: 'user', content: text }];
    setMessages([...newMsgs, { role: 'assistant', content: '...' }]);
    setLoading(true);

    try {
      const context = feature.passage ? `\nOriginal passage: "${feature.passage}"` : '';
      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
          systemOverride: `You are Starky in Voice Lab mode. ${feature.prompt}${context}\nKeep responses concise and encouraging. Use specific scores where appropriate. Always end with one actionable next step.`,
          voiceInput: true,
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullReply = '';
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          for (const line of decoder.decode(value, { stream: true }).split('\n')) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try { const d = JSON.parse(line.slice(6)); if (d.text) fullReply += d.text; } catch {}
            }
          }
          setMessages([...newMsgs, { role: 'assistant', content: fullReply || '...' }]);
        }
      }
      if (fullReply) {
        setMessages([...newMsgs, { role: 'assistant', content: fullReply }]);
        // Save progress
        const updated = { ...progress };
        if (!updated[feature.id]) updated[feature.id] = { attempts: 0, lastDate: null };
        updated[feature.id].attempts += 1;
        updated[feature.id].lastDate = new Date().toISOString();
        setProgress(updated);
        saveProg(updated);

        // Summer passport stamp
        try {
          const uc = localStorage.getItem('user_country');
          const now = new Date();
          if (now.getMonth() >= 6 && now.getMonth() <= 7) {
            const pp = JSON.parse(localStorage.getItem('nw_summer_uae_passport') || '{}');
            if (!pp.stamps) pp.stamps = [];
            pp.stamps.push({ date: now.toISOString(), subject: `Voice Lab — ${feature.title}` });
            localStorage.setItem('nw_summer_uae_passport', JSON.stringify(pp));
          }
        } catch {}
      }
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: 'Connection issue — try again.' }]);
    } finally { setLoading(false); }
  };

  const f = "'Sora',sans-serif";

  // ═══ GRID VIEW ═══
  if (step === 'grid') return (
    <>
      <Head>
        <title>Voice Lab — NewWorldEdu</title>
        <meta name="description" content="Your voice is your most powerful learning tool. Oral exams, reading fluency, pronunciation, debate, singing, mental maths — all voice-powered." />
      </Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        .vl-card{transition:all 0.2s;cursor:pointer}
        .vl-card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,0.35)}
        @keyframes waveform{0%,100%{height:8px}50%{height:24px}}
      `}</style>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#060B20,#0A1628,#060B20)', fontFamily: f, padding: '0 20px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', paddingTop: 48, paddingBottom: 48 }}>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            {/* Waveform animation */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginBottom: 16, height: 32, alignItems: 'center' }}>
              {[0, 0.15, 0.3, 0.1, 0.25, 0.35, 0.05, 0.2, 0.3, 0.15, 0.25, 0.1].map((d, i) => (
                <div key={i} style={{ width: 3, borderRadius: 2, background: `linear-gradient(180deg, #4F8EF7, #4ECDC4)`, animation: `waveform 1.2s ease-in-out ${d}s infinite`, height: 8 }} />
              ))}
            </div>
            <h1 style={{ fontSize: 'clamp(24px,6vw,36px)', fontWeight: 900, lineHeight: 1.2, marginBottom: 10 }}>
              Your Voice Is Your Most Powerful<br />
              <span style={{ background: 'linear-gradient(135deg,#4F8EF7,#4ECDC4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Learning Tool</span>
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, maxWidth: 460, margin: '0 auto' }}>
              Starky listens, evaluates, and helps you improve — across reading, speaking, singing, exams, and wellbeing.
            </p>
          </div>

          {/* Feature grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
            {FEATURES.map(ft => {
              const attempts = progress[ft.id]?.attempts || 0;
              return (
                <div key={ft.id} className="vl-card" onClick={() => startFeature(ft)}
                  style={{ background: `${ft.color}06`, border: `1.5px solid ${ft.color}18`, borderRadius: 18, padding: '18px 16px', position: 'relative' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{ft.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: ft.color, marginBottom: 4 }}>{ft.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, marginBottom: 10 }}>{ft.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 100, padding: '2px 8px' }}>{ft.badge}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: ft.color }}>Start →</span>
                  </div>
                  {attempts > 0 && (
                    <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 700, color: '#4ADE80', background: 'rgba(74,222,128,0.1)', borderRadius: 100, padding: '2px 8px' }}>{attempts}x</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Badge progress */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
              {Object.keys(progress).length}/10 features tried
              {Object.keys(progress).length >= 10 && <span style={{ color: '#FFC300', marginLeft: 8 }}>🏆 Voice Master!</span>}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textDecoration: 'none' }}>← Back to home</a>
          </div>
        </div>
      </div>
    </>
  );

  // ═══ ACTIVE FEATURE ═══
  return (
    <>
      <Head><title>{feature?.title} — Voice Lab — NewWorldEdu</title></Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ minHeight: '100vh', background: '#060B20', fontFamily: f, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => { setStep('grid'); setMessages([]); setFeature(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', fontFamily: f }}>← Lab</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: feature?.color || '#4F8EF7' }}>{feature?.icon} {feature?.title}</span>
          </div>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.04)', borderRadius: 100, padding: '2px 8px' }}>{feature?.badge}</span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ maxWidth: '88%', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? `${feature?.color || '#4F8EF7'}15` : 'rgba(255,255,255,0.04)', border: `1px solid ${m.role === 'user' ? (feature?.color || '#4F8EF7') + '25' : 'rgba(255,255,255,0.06)'}`, borderRadius: 16, padding: '12px 16px' }}>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff">$1</strong>').replace(/\*(.+?)\*/g, '<em style="color:rgba(255,255,255,0.6)">$1</em>').replace(/---/g, '<hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:8px 0">').replace(/\n/g, '<br>') }} />
            </div>
          ))}
          {loading && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Starky is evaluating...</div>}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Speak or type your response..."
            style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14, fontFamily: f, outline: 'none' }} />
          <button onClick={sendMessage} disabled={loading || !input.trim()}
            style={{ background: feature?.color || '#4F8EF7', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 18px', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: f, opacity: loading || !input.trim() ? 0.4 : 1 }}>
            Send
          </button>
        </div>
      </div>
    </>
  );
}
