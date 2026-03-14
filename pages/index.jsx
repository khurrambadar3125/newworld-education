import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSessionLimit } from '../utils/useSessionLimit';

const GRADES = [
  { id: 'kg', label: 'KG', age: '4–5', emoji: '🌱' },
  { id: 'grade1', label: 'Grade 1', age: '5–6', emoji: '⭐' },
  { id: 'grade2', label: 'Grade 2', age: '6–7', emoji: '🌈' },
  { id: 'grade3', label: 'Grade 3', age: '7–8', emoji: '🚀' },
  { id: 'grade4', label: 'Grade 4', age: '8–9', emoji: '🌊' },
  { id: 'grade5', label: 'Grade 5', age: '9–10', emoji: '🔬' },
  { id: 'grade6', label: 'Grade 6', age: '10–11', emoji: '🧬' },
  { id: 'grade7', label: 'Grade 7', age: '11–12', emoji: '⚡' },
  { id: 'grade8', label: 'Grade 8', age: '12–13', emoji: '🌍' },
  { id: 'grade9', label: 'Grade 9', age: '13–14', emoji: '🎯' },
  { id: 'olevel', label: 'O Level', age: '14–16', emoji: '📚' },
  { id: 'aslevel', label: 'AS Level', age: '16–17', emoji: '🏆' },
  { id: 'alevel', label: 'A Level', age: '17–18', emoji: '🎓' },
];

// KG to Grade 9 — general subjects
const SUBJECTS_GENERAL = ['Maths', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science', 'Urdu', 'Economics'];

// O Level specific subjects
const SUBJECTS_OLEVEL = [
  'Mathematics', 'Additional Mathematics', 'Statistics',
  'Physics', 'Chemistry', 'Biology', 'Combined Science', 'Human & Social Biology', 'Environmental Management', 'Agriculture',
  'English Language', 'Literature in English', 'First Language Urdu', 'Second Language Urdu', 'Arabic', 'French', 'German', 'Spanish',
  'Pakistan Studies', 'History', 'Geography', 'Sociology', 'Economics', 'Islamiyat', 'Islamic Religion & Culture',
  'Business Studies', 'Accounting', 'Commerce', 'Travel & Tourism',
  'Computer Science', 'Art & Design', 'Food & Nutrition', 'Fashion & Textiles',
];

// AS Level & A Level specific subjects
const SUBJECTS_ALEVEL = [
  'Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology', 'Marine Science',
  'English Language', 'Literature in English', 'Language & Literature in English',
  'Urdu', 'Arabic', 'French', 'German', 'Spanish', 'Chinese', 'Hindi',
  'History', 'Geography', 'Sociology', 'Psychology', 'Law', 'Economics',
  'Business Studies', 'Accounting', 'Thinking Skills', 'Global Perspectives',
  'Computer Science', 'Information Technology', 'Design & Technology',
  'Islamic Studies', 'Divinity', 'Art & Design', 'Music', 'Physical Education', 'General Paper', 'Media Studies',
];

export default function Home() {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Registration
  const [showRegModal, setShowRegModal] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState('parent');
  const [regError, setRegError] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  // Voice
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [sttSupported, setSTTSupported] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { callsUsed: sessionCount, callsLeft, limitReached: isLimitReached, recordCall } = useSessionLimit(userProfile?.email);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nw_user');
      if (saved) setUserProfile(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setVoiceSupported(true);
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const r = new SR();
      r.continuous = false;
      r.interimResults = false;
      r.lang = 'en-US';
      r.onresult = (e) => { setInput(prev => prev + e.results[0][0].transcript); setIsListening(false); };
      r.onerror = () => setIsListening(false);
      r.onend = () => setIsListening(false);
      recognitionRef.current = r;
      setSTTSupported(true);
    }
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const speakText = useCallback((text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const clean = text.replace(/[★\*_`#]/g, '').replace(/\n+/g, ' ').substring(0, 400);
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 0.95; utt.pitch = 1.05; utt.volume = 1;
    const voices = synthRef.current.getVoices();
    const v = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (v) utt.voice = v;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    synthRef.current.speak(utt);
  }, []);

  const stopSpeaking = () => { synthRef.current?.cancel(); setIsSpeaking(false); };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) { recognitionRef.current.stop(); setIsListening(false); }
    else { stopSpeaking(); recognitionRef.current.start(); setIsListening(true); }
  };

  const handleStartChat = () => {
    if (!selectedGrade) return;
    if (!userProfile) { setShowRegModal(true); return; }
    launchChat();
  };

  const handleRegSubmit = () => {
    if (!regName.trim()) { setRegError('Please enter your name'); return; }
    if (!regEmail.trim() || !regEmail.includes('@')) { setRegError('Please enter a valid email'); return; }
    const profile = { name: regName.trim(), email: regEmail.trim(), role: regRole, grade: selectedGrade?.label || '', gradeId: selectedGrade?.id || '', gradeAge: selectedGrade?.age || '', joinedAt: new Date().toISOString() };
    localStorage.setItem('nw_user', JSON.stringify(profile));
    setUserProfile(profile);
    setShowRegModal(false);
    launchChat(profile, selectedSubject);
  };

  const launchChat = (profile, subjectOverride) => {
    const p = profile || userProfile;
    const firstName = p?.name?.split(' ')[0] || 'there';
    const subject = subjectOverride || selectedSubject;
    setChatStarted(true);
    const greeting = `Hi ${firstName}! I'm Starky ★\n\nI'm your personal tutor for ${selectedGrade.label}${subject ? ` — ${subject}` : ''}.\n\nWhat would you like to work on today? Ask me anything — homework help, exam prep, or a concept you want to understand better.`;
    setMessages([{ role: 'assistant', content: greeting }]);
    if (voiceSupported) setTimeout(() => speakText(greeting), 500);
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const sendMessage = async (override) => {
    const text = (override || input).trim();
    if (!text || loading || isLimitReached) return;
    const userMsg = { role: 'user', content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    stopSpeaking();

    const p = userProfile || {};
    const sys = `You are Starky (★), the AI teacher at NewWorldEdu (newworld.education). Teaching ${p.name || 'a student'} in ${selectedGrade?.label || 'school'}${selectedSubject ? `, subject: ${selectedSubject}` : ''}.

PERSONALITY: Warm, encouraging, zero judgment. Celebrate every small win. For KG–Grade 5: playful, simple words. For O/A Level: sharp, Cambridge exam-focused.

METHOD: Use Socratic questioning — NEVER give direct answers. Guide the student to discover. Break into small steps. End every reply with a check question OR next step.

NEVER SAY: "That's wrong", "You should know this", "Let's move on"
ALWAYS: "Not quite — and that tells me something useful!", keep responses concise — 3 short paragraphs max.

CAMBRIDGE KNOWLEDGE: You have studied 30 years of past papers (1994-2024) for ALL O Level subjects (Biology 5090, Chemistry 5070, Physics 5054, Mathematics 4024, Additional Mathematics 4037, English Language 1123, Literature in English 2010, Pakistan Studies 2059, Islamiyat 2058, History 2134, Geography 2217, Economics 2281, Business Studies 7115, Accounting 7707, Computer Science 2210, Sociology 2251, and all others) and ALL A Level subjects (Biology 9700, Chemistry 9701, Physics 9702, Mathematics 9709, Psychology 9990, Law 9084, English Language 9093, Literature in English 9695, Economics 9708, Business 9707, History 9489, Geography 9696, Sociology 9699, Computer Science 9608, Media Studies 9607, and all others). You know every mark scheme, examiner report, and Cambridge textbook. You know exactly what examiners want.`;

    try {
      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs, system: sys }),
      });
      let data = {};
      try { data = await res.json(); } catch(e) { data = {}; }
      const reply = (res.ok && data.content) ? data.content : (data.error || "Starky is busy — please try again in a moment!");
      setMessages([...newMsgs, { role: 'assistant', content: reply }]);
      try { recordCall(); } catch(e) {}
      try { if (voiceSupported) speakText(reply); } catch(e) {}
      try {
        if (newMsgs.filter(m => m.role === 'user').length >= 5 && p.email) {
          fetch('/api/session-complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId: p.email, studentName: p.name, parentEmail: p.email, parentName: p.name, grade: selectedGrade?.label, subject: selectedSubject || 'General', messages: newMsgs, isSEN: false, sessionCount }),
          }).catch(() => {});
        }
      } catch(e) {}
    } catch(e) {
      setMessages([...newMsgs, { role: 'assistant', content: 'Starky is busy — please try again in a moment!' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const remaining = callsLeft;


  // ── EXAM SEASON BANNER — Zone 4 Pakistan precise dates ──
  const getExamBanner = () => {
    const now = new Date();
    const m = now.getMonth() + 1; // 1-12
    const d = now.getDate();

    // Cambridge Zone 4 May/June 2026: 23 Apr – 9 Jun
    // Countdown window: from today until 23 Apr
    const examStart = new Date(now.getFullYear(), 3, 23); // April 23
    const examEnd   = new Date(now.getFullYear(), 5, 9);  // June 9
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeksToStart = Math.ceil((examStart - now) / msPerWeek);

    // Pre-exam countdown: Jan–Apr 22
    if (now < examStart && m >= 1 && m <= 4) {
      const weekLabel = weeksToStart === 1 ? "1 week" : `${weeksToStart} weeks`;
      return {
        msg: `📅 Cambridge O & A Level exams start 23 April — ${weekLabel} away. Starky has memorised every past paper and mark scheme.`,
        color: "#A78BFA", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)"
      };
    }
    // Active exam window: Apr 23 – Jun 9
    if (now >= examStart && now <= examEnd) {
      return {
        msg: "🎯 Cambridge exams are happening NOW — use Starky for mark scheme practice, essay feedback, and last-minute revision. Every mark counts.",
        color: "#4F8EF7", bg: "rgba(79,142,247,0.12)", border: "rgba(79,142,247,0.3)"
      };
    }
    // MDCAT / ECAT window: Jul–Aug
    if (m >= 7 && m <= 8) {
      return {
        msg: "⚡ MDCAT & ECAT season — Starky covers Biology, Chemistry, Physics & English MCQs for your entry test. Start now.",
        color: "#FF8C69", bg: "rgba(255,140,105,0.12)", border: "rgba(255,140,105,0.3)"
      };
    }
    // Oct/Nov registration and prep: Sep–Nov
    if (m >= 9 && m <= 11) {
      return {
        msg: "📚 Cambridge Oct/Nov session is coming — now is the time to lock in your subjects and start revision with Starky.",
        color: "#2BB55A", bg: "rgba(43,181,90,0.12)", border: "rgba(43,181,90,0.3)"
      };
    }
    return null;
  };
  const examBanner = getExamBanner();

  // ── CHAT VIEW ──
  if (chatStarted) return (
    <>
      <Head>
        <title>Starky ★ — NewWorldEdu</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap" rel="stylesheet" />
      </Head>
      <style jsx global>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#080C18;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;color:#fff}
        .cs{display:flex;flex-direction:column;height:100dvh;max-width:680px;margin:0 auto}
        .ch{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#080C18;border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0}
        .chl{display:flex;align-items:center;gap:10px}
        .av{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#4F8EF7,#7C5CBF);display:flex;align-items:center;justify-content:center;font-size:17px;font-family:'Sora',sans-serif;font-weight:800;flex-shrink:0}
        .cn{font-family:'Sora',sans-serif;font-size:15px;font-weight:700}
        .cs2{font-size:11px;color:rgba(255,255,255,.38);margin-top:1px}
        .chr{display:flex;align-items:center;gap:8px}
        .ib{background:rgba(255,255,255,.07);border:none;color:rgba(255,255,255,.6);border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;padding:8px 12px;white-space:nowrap}
        .ib.sp{background:rgba(124,92,191,.2);color:#A78BFA;animation:pulse 1s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        .sb{padding:6px 16px;font-size:11px;text-align:center;flex-shrink:0;color:rgba(255,255,255,.28)}
        .sb.w{color:#ffaa00}.sb.d{color:#ff6060}
        .cm{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;-webkit-overflow-scrolling:touch}
        .msg{max-width:86%;line-height:1.65;font-size:15px;padding:12px 16px;border-radius:18px;white-space:pre-wrap;word-break:break-word}
        .msg.user{align-self:flex-end;background:linear-gradient(135deg,#4F8EF7,#6366F1);border-bottom-right-radius:4px}
        .msg.assistant{align-self:flex-start;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.08);border-bottom-left-radius:4px}
        .msg.typing{opacity:.5;font-style:italic}
        .lw{margin:0 16px 12px;padding:18px 20px;background:rgba(255,60,60,.07);border:1px solid rgba(255,60,60,.18);border-radius:16px;text-align:center}
        .lw p{font-size:14px;color:rgba(255,255,255,.65);margin-bottom:14px;line-height:1.6}
        .lw a{display:inline-block;background:linear-gradient(135deg,#4F8EF7,#7C5CBF);color:#fff;padding:12px 28px;border-radius:100px;font-family:'Sora',sans-serif;font-size:15px;font-weight:700;text-decoration:none}
        .cia{padding:10px 16px 14px;background:#080C18;border-top:1px solid rgba(255,255,255,.07);flex-shrink:0}
        .ir{display:flex;gap:8px;align-items:flex-end}
        .ta{flex:1;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:14px;color:#fff;padding:12px 14px;font-size:15px;font-family:inherit;outline:none;resize:none;max-height:100px;-webkit-appearance:none}
        .ta::placeholder{color:rgba(255,255,255,.28)}
        .ta:focus{border-color:rgba(79,142,247,.4)}
        .sb2{width:46px;height:46px;border-radius:12px;flex-shrink:0;background:linear-gradient(135deg,#4F8EF7,#6366F1);border:none;cursor:pointer;font-size:20px;color:#fff;display:flex;align-items:center;justify-content:center}
        .sb2:disabled{opacity:.35;cursor:not-allowed}
        .mb{width:46px;height:46px;border-radius:12px;flex-shrink:0;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center}
        .mb.li{background:rgba(255,80,80,.2);border-color:rgba(255,80,80,.4);animation:pulse .6s infinite}
      `}</style>
      <div className="cs">
        <div className="ch">
          <div className="chl">
            <div className="av">★</div>
            <div><div className="cn">Starky</div><div className="cs2">{selectedGrade?.label}{selectedSubject ? ` · ${selectedSubject}` : ''}</div></div>
          </div>
          <div className="chr">
            {isSpeaking && <button className="ib sp" onClick={stopSpeaking}>🔊 Stop</button>}
            <button className="ib" onClick={() => { setChatStarted(false); setMessages([]); stopSpeaking(); }}>← Back</button>
          </div>
        </div>
        {!isLimitReached && (
          <div className={`sb ${remaining <= 5 ? 'd' : remaining <= 10 ? 'w' : ''}`}>{remaining} sessions remaining today</div>
        )}
        <div className="cm">
          {messages.map((m, i) => <div key={i} className={`msg ${m.role}`}>{m.content}</div>)}
          {loading && <div className="msg assistant typing">Starky is thinking…</div>}
          <div ref={messagesEndRef} />
        </div>
        {isLimitReached ? (
          <div className="lw"><p>You've used all your free sessions for today.<br />Upgrade to keep learning without limits.</p><Link href="/pricing"><a>See Plans — from $29.99/mo →</a></Link></div>
        ) : (
          <div className="cia">
            <div className="ir">
              {sttSupported && <button className={`mb ${isListening ? 'li' : ''}`} onClick={toggleListening}>{isListening ? '⏹' : '🎙️'}</button>}
              <textarea ref={inputRef} className="ta" placeholder={isListening ? 'Listening…' : 'Ask Starky anything…'} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} rows={1} disabled={loading || isListening} />
              <button className="sb2" onClick={() => sendMessage()} disabled={loading || !input.trim()}>↑</button>
            </div>
          </div>
        )}
      </div>
    </>
  );

  // ── LANDING VIEW ──
  return (
    <>
      <Head>
        <title>NewWorldEdu ★ — AI Tutor | KG to A Levels</title>
        <meta name="description" content="Meet Starky — your child's personal AI teacher. 24/7, 16 languages, KG to A Levels. Start your 7-day trial." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <style jsx global>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#080C18;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;color:#fff;overflow-x:hidden;-webkit-font-smoothing:antialiased}
        .nav{position:sticky;top:0;z-index:100;background:rgba(8,12,24,.96);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.07);padding:0 16px;display:flex;align-items:center;justify-content:space-between;height:56px}
        .nl{font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:#fff;text-decoration:none;letter-spacing:-.02em}
        .nl span{color:#4F8EF7}
        .nr{display:flex;align-items:center;gap:8px}
        .np{background:linear-gradient(135deg,#4F8EF7,#7C5CBF);color:#fff;border:none;padding:8px 18px;border-radius:100px;font-size:14px;font-weight:700;font-family:'Sora',sans-serif;cursor:pointer;text-decoration:none;white-space:nowrap}
        .nh{background:rgba(255,255,255,.07);border:none;color:#fff;width:38px;height:38px;border-radius:8px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center}
        .dr{position:fixed;top:56px;left:0;right:0;bottom:0;background:rgba(8,12,24,.98);z-index:99;padding:20px}
        .dr a{display:block;padding:16px;border-bottom:1px solid rgba(255,255,255,.05);color:rgba(255,255,255,.8);text-decoration:none;font-size:17px;font-weight:500}
        .hero{padding:40px 20px 32px;text-align:center;background:radial-gradient(ellipse 80% 40% at 50% 0%,rgba(79,142,247,.1) 0%,transparent 70%)}
        .hb{display:inline-flex;align-items:center;gap:6px;background:rgba(79,142,247,.1);border:1px solid rgba(79,142,247,.22);border-radius:100px;padding:5px 14px;font-size:12px;color:#4F8EF7;font-weight:600;letter-spacing:.05em;margin-bottom:18px;text-transform:uppercase}
        .hero h1{font-family:'Sora',sans-serif;font-size:clamp(28px,8vw,52px);font-weight:800;line-height:1.15;letter-spacing:-.03em;margin-bottom:14px}
        .hero h1 em{font-style:normal;background:linear-gradient(135deg,#4F8EF7,#A78BFA);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .hs{font-size:16px;color:rgba(255,255,255,.5);line-height:1.7;margin-bottom:26px;max-width:340px;margin-left:auto;margin-right:auto}
        .hc{display:flex;flex-direction:column;gap:10px;align-items:center}
        .bp{display:block;width:100%;max-width:320px;background:linear-gradient(135deg,#4F8EF7,#6366F1);color:#fff;border:none;border-radius:14px;padding:16px 24px;font-size:17px;font-weight:700;font-family:'Sora',sans-serif;cursor:pointer;text-decoration:none;text-align:center;box-shadow:0 8px 28px rgba(79,142,247,.28);-webkit-tap-highlight-color:transparent}
        .bo{display:block;width:100%;max-width:320px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.75);border-radius:14px;padding:15px 24px;font-size:16px;font-weight:600;font-family:'Sora',sans-serif;cursor:pointer;text-decoration:none;text-align:center;-webkit-tap-highlight-color:transparent}
        .pr{display:flex;justify-content:center;gap:24px;margin-top:26px;flex-wrap:wrap}
        .pi{text-align:center}
        .pn{font-family:'Sora',sans-serif;font-size:22px;font-weight:800;background:linear-gradient(135deg,#4F8EF7,#A78BFA);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .pl{font-size:11px;color:rgba(255,255,255,.38);margin-top:2px}
        .sec{padding:36px 20px}
        .sl{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:14px;text-align:center}
        .st{font-family:'Sora',sans-serif;font-size:20px;font-weight:700;text-align:center;margin-bottom:18px;line-height:1.3}
        .gg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:480px;margin:0 auto}
        .gb{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:14px 6px;cursor:pointer;text-align:center;-webkit-tap-highlight-color:transparent;display:flex;flex-direction:column;align-items:center;gap:4px;transition:all .15s}
        .gb.s{background:rgba(79,142,247,.13);border-color:rgba(79,142,247,.45)}
        .gb:active{transform:scale(.95)}
        .ge{font-size:22px;line-height:1}
        .gn{font-family:'Sora',sans-serif;font-size:12px;font-weight:700}
        .ga{font-size:10px;color:rgba(255,255,255,.32)}
        .sr{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:480px;margin:0 auto}
        .sbb{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:100px;padding:8px 16px;font-size:13px;font-weight:500;cursor:pointer;color:rgba(255,255,255,.65);-webkit-tap-highlight-color:transparent;transition:all .15s}
        .sbb.s{background:rgba(124,92,191,.18);border-color:rgba(124,92,191,.45);color:#A78BFA}
        .sw{text-align:center;margin-top:26px}
        .stb{display:inline-block;min-width:220px;background:linear-gradient(135deg,#4F8EF7,#6366F1);color:#fff;border:none;border-radius:14px;padding:16px 32px;font-size:17px;font-weight:700;font-family:'Sora',sans-serif;cursor:pointer;box-shadow:0 8px 28px rgba(79,142,247,.28);-webkit-tap-highlight-color:transparent}
        .stb:disabled{opacity:.3;cursor:not-allowed;box-shadow:none}
        .ft{padding:36px 20px;background:rgba(255,255,255,.02);border-top:1px solid rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.05)}
        .fg{display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:480px;margin:18px auto 0}
        .fc{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:16px;padding:18px 14px}
        .fi{font-size:24px;margin-bottom:10px;display:block}
        .ftit{font-family:'Sora',sans-serif;font-size:13px;font-weight:700;margin-bottom:6px}
        .fd{font-size:12px;color:rgba(255,255,255,.42);line-height:1.55}
        .qs{padding:36px 20px;text-align:center}
        .qc{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:22px 18px;max-width:480px;margin:14px auto}
        .qst{font-size:14px;margin-bottom:10px;letter-spacing:3px}
        .qt{font-size:15px;line-height:1.7;color:rgba(255,255,255,.75);margin-bottom:12px;font-style:italic}
        .qa{font-size:12px;color:rgba(255,255,255,.35)}
        .qa strong{color:rgba(255,255,255,.6)}
        .sen{padding:32px 20px;background:linear-gradient(135deg,rgba(228,93,156,.07),rgba(124,92,191,.07));border-top:1px solid rgba(228,93,156,.12);border-bottom:1px solid rgba(228,93,156,.12);text-align:center}
        .sen h2{font-family:'Sora',sans-serif;font-size:20px;font-weight:700;margin-bottom:10px}
        .sen p{font-size:14px;color:rgba(255,255,255,.5);line-height:1.7;margin-bottom:18px}
        .bsen{display:inline-block;background:linear-gradient(135deg,#E05F9A,#7C5CBF);color:#fff;border:none;border-radius:100px;padding:13px 28px;font-size:15px;font-weight:700;font-family:'Sora',sans-serif;cursor:pointer;text-decoration:none}
        .foot{padding:30px 20px;text-align:center;border-top:1px solid rgba(255,255,255,.05)}
        .fl{font-family:'Sora',sans-serif;font-size:17px;font-weight:800;margin-bottom:6px}
        .fl span{color:#4F8EF7}
        .ftag{font-size:12px;color:rgba(255,255,255,.6);margin-bottom:18px}
        .flinks{display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin-bottom:16px}
        .flinks a{font-size:13px;color:rgba(255,255,255,.55);text-decoration:none}
        .fc2{font-size:11px;color:rgba(255,255,255,.5)}
        /* Modal */
        .mo{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:200;display:flex;align-items:flex-end;justify-content:center}
        @media(min-width:480px){.mo{align-items:center;padding:20px}}
        .md{background:#10162A;border:1px solid rgba(255,255,255,.1);border-radius:24px 24px 0 0;padding:28px 24px 36px;width:100%;max-width:480px}
        @media(min-width:480px){.md{border-radius:20px}}
        .md h2{font-family:'Sora',sans-serif;font-size:20px;font-weight:800;margin-bottom:6px}
        .md p{font-size:14px;color:rgba(255,255,255,.45);margin-bottom:22px;line-height:1.6}
        .mf{margin-bottom:14px}
        .mlb{font-size:12px;font-weight:600;color:rgba(255,255,255,.4);letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px;display:block}
        .mi{width:100%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#fff;padding:12px 14px;font-size:15px;outline:none;-webkit-appearance:none}
        .mi::placeholder{color:rgba(255,255,255,.25)}
        .mi:focus{border-color:rgba(79,142,247,.4)}
        .rr{display:flex;gap:8px}
        .rb{flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:10px;color:rgba(255,255,255,.6);padding:10px 8px;font-size:13px;font-weight:600;cursor:pointer;text-align:center;-webkit-tap-highlight-color:transparent}
        .rb.s{background:rgba(79,142,247,.15);border-color:rgba(79,142,247,.4);color:#4F8EF7}
        .me{font-size:13px;color:#ff6b6b;margin-bottom:12px}
        .ms{width:100%;background:linear-gradient(135deg,#4F8EF7,#6366F1);color:#fff;border:none;border-radius:12px;padding:15px;font-size:16px;font-weight:700;font-family:'Sora',sans-serif;cursor:pointer;margin-top:4px}
        .mfine{font-size:11px;color:rgba(255,255,255,.2);text-align:center;margin-top:10px;line-height:1.6}
        @media(min-width:640px){
          .hero{padding:56px 40px 44px}
          .gg{grid-template-columns:repeat(4,1fr)}
          .fg{grid-template-columns:repeat(4,1fr)}
          .hc{flex-direction:row;justify-content:center}
          .bp,.bo{width:auto}
        }
      `}</style>

      {/* Registration Modal */}
      {showRegModal && (
        <div className="mo" onClick={e => { if (e.target.classList.contains('mo')) setShowRegModal(false); }}>
          <div className="md">
            <h2>Almost there! ★</h2>
            <p>Create your account to start learning with Starky. We'll send you a learning report after your first session.</p>
            <div className="mf">
              <label className="mlb">Your Name</label>
              <input className="mi" placeholder="e.g. Fatima or Mr. Ahmed" value={regName} onChange={e => setRegName(e.target.value)} autoFocus />
            </div>
            <div className="mf">
              <label className="mlb">Email Address</label>
              <input className="mi" type="email" placeholder="your@email.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
            </div>
            <div className="mf">
              <label className="mlb">I am a…</label>
              <div className="rr">
                {['parent','student','teacher'].map(r => (
                  <button key={r} className={`rb ${regRole===r?'s':''}`} onClick={() => setRegRole(r)}>
                    {r==='parent'?'👨‍👩‍👧 Parent':r==='student'?'👦 Student':'👩‍🏫 Teacher'}
                  </button>
                ))}
              </div>
            </div>
            {regError && <div className="me">{regError}</div>}
            <button className="ms" onClick={handleRegSubmit}>Start Learning with Starky →</button>
            <p className="mfine">No spam. 7-day trial included. Cancel anytime.</p>
          </div>
        </div>
      )}

      <nav className="nav">
        <a href="/" className="nl">NewWorldEdu<span>★</span></a>
        <div className="nr">
          <a href="/pricing" className="np">Plans</a>
          <button className="nh" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen?'✕':'☰'}</button>
        </div>
      </nav>
      {menuOpen && (
        <div className="dr" onClick={() => setMenuOpen(false)}>
          <a href="/">🏠 Home</a>
          <a href="/special-needs">💜 Special Needs</a>
          <a href="/parent">👨‍👩‍👧 Parent Portal</a>
          <a href="/pricing">💳 Plans & Pricing</a>
          <a href="/past-papers">📚 Past Papers</a>
        
            <a href="/textbooks" className="nl">📖 Textbooks</a>
            <a href="/arts" className="nl">🎨 Learn Arts</a>
            <a href="/music" className="nl">🎵 Learn Music</a>
            <a href="/reading" className="nl">📚 Lets READ</a>
          <a href="/homework">🏠 Homework Help</a>
          <a href="/subscribe">📬 Daily Questions</a>
          <a href="/leaderboard">🏆 Leaderboard</a>
          <a href="/school">🏫 For Schools</a>
          </div>
      )}

      {/* ── EXAM SEASON BANNER ── */}
      {examBanner && (
        <div style={{background:examBanner.bg,border:`1px solid ${examBanner.border}`,padding:'11px 20px',display:'flex',alignItems:'center',justifyContent:'center',gap:'16px',flexWrap:'wrap'}}>
          <span style={{fontSize:'13px',fontWeight:'600',color:examBanner.color,lineHeight:1.5}}>{examBanner.msg}</span>
          <a href="#start-learning" style={{display:'inline-flex',alignItems:'center',gap:'5px',background:examBanner.color,color:'#080C18',borderRadius:'100px',padding:'6px 16px',fontSize:'12px',fontWeight:'800',textDecoration:'none',whiteSpace:'nowrap',flexShrink:0,fontFamily:"'Sora',sans-serif"}}>
            Try Starky ★
          </a>
        </div>
      )}

      {/* ── URDU HELP BUTTON ONLY ── */}
      <div style={{background:'rgba(255,255,255,0.02)',borderBottom:'1px solid rgba(255,255,255,0.05)',padding:'8px 20px',display:'flex',justifyContent:'flex-end'}}>
        <a onClick={() => window.dispatchEvent(new CustomEvent("starky-urdu"))} style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'rgba(79,142,247,0.1)',border:'1px solid rgba(79,142,247,0.25)',borderRadius:'100px',padding:'6px 14px',fontSize:'12px',fontWeight:'700',color:'#4F8EF7',textDecoration:'none'}}>
        </a>
      </div>

      <section className="hero">
        <div className="hb">★ Starky — KG to A Levels</div>
        <h1>Every Child Deserves a <em>World-Class</em> Tutor</h1>
        <button onClick={()=>document.getElementById('oa-level')?.scrollIntoView({behavior:'smooth'})} style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(167,139,250,0.12)',border:'2px solid rgba(167,139,250,0.5)',borderRadius:'50px',padding:'10px 22px',margin:'0 0 14px',cursor:'pointer',fontFamily:"'Sora',sans-serif",fontWeight:'700',fontSize:'clamp(12px,1.4vw,14px)',color:'#A78BFA',transition:'all 0.2s'}} onMouseEnter={e=>{e.currentTarget.style.background='rgba(167,139,250,0.22)';e.currentTarget.style.transform='translateY(-2px)';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(167,139,250,0.12)';e.currentTarget.style.transform='translateY(0)';}}>
          <span>📚</span> O Level &amp; A Level — see how Starky gets you to A* <span style={{opacity:0.6}}>↓</span>
        </button>
        <p className="hs">Better grades in 30 days. 24/7.</p>
        <div className="hc">
          <a href="#start-learning" className="bp">Start Learning →</a>
          <a href="/special-needs" className="bo">💜 Special Needs</a>
          <button className="bo" onClick={() => { window.dispatchEvent(new CustomEvent('starky-scan')); }} style={{background:'rgba(167,139,250,0.12)',border:'2px solid rgba(167,139,250,0.4)',color:'#A78BFA'}}>📷 Scan & Learn</button>
        </div>
        <div className="pr">
          <div className="pi"><div className="pn">16</div><div className="pl">Languages</div></div>
          <div className="pi"><div className="pn">24/7</div><div className="pl">Available</div></div>
          <div className="pi"><div className="pn">KG–A</div><div className="pl">All Grades</div></div>
          <div className="pi"><div className="pn">7 Days</div><div className="pl">Free Trial</div></div>
        </div>
      </section>

      <section className="sec" id="start-learning">
        <div className="sl">Step 1 of 2</div>
        <div className="st">Select your child's grade</div>
        <div className="gg">
          {GRADES.map(g => (
            <button key={g.id} className={`gb ${selectedGrade?.id===g.id?'s':''}`} onClick={() => { setSelectedGrade(g); setTimeout(() => document.getElementById("subject-section")?.scrollIntoView({behavior:"smooth",block:"center"}), 150); }}>
              <span className="ge">{g.emoji}</span>
              <span className="gn">{g.label}</span>
              <span className="ga">Age {g.age}</span>
            </button>
          ))}
        </div>
        {selectedGrade && (
          <>
            <div id="subject-section" style={{marginTop:28}}>
              <div className="sl">Step 2 of 2 — Optional</div>
              <div className="st" style={{marginBottom:14}}>Pick a subject</div>
              <div className="sr">
                {(selectedGrade?.id === 'olevel' ? SUBJECTS_OLEVEL : selectedGrade?.id === 'aslevel' || selectedGrade?.id === 'alevel' ? SUBJECTS_ALEVEL : SUBJECTS_GENERAL).map(s => (
                  <button key={s} className={`sbb ${selectedSubject===s?'s':''}`} onClick={() => { setSelectedSubject(s); if(!userProfile){setShowRegModal(true);}else{launchChat(null,s);} }}>{s}</button>
                ))}
              </div>
            </div>
            <div className="sw">
              <button className="stb" onClick={handleStartChat}>
                {userProfile ? `Continue as ${userProfile.name.split(' ')[0]} →` : 'Start with Starky ★'}
              </button>
            </div>
          </>
        )}
      </section>

      {/* ── O & A LEVEL SECTION ── */}
      <section id="oa-level" style={{padding:'40px 20px',background:'linear-gradient(180deg,rgba(124,92,191,0.08) 0%,rgba(8,12,24,0) 100%)',borderTop:'1px solid rgba(167,139,250,0.15)'}}>
        <div style={{maxWidth:480,margin:'0 auto',textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(167,139,250,0.12)',border:'1px solid rgba(167,139,250,0.3)',borderRadius:100,padding:'4px 14px',fontSize:11,fontWeight:700,color:'#A78BFA',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:16}}>📚 Cambridge O &amp; A Level</div>
          <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:'clamp(22px,6vw,34px)',fontWeight:800,lineHeight:1.2,marginBottom:12}}>Your A* Starts Here</h2>
          <p style={{fontSize:14,color:'rgba(255,255,255,0.5)',lineHeight:1.7,marginBottom:28}}>Starky has studied every Cambridge syllabus, past paper, mark scheme and examiner report from 1994 to 2024. Select your level to explore your subjects.</p>

          {/* Toggle O / A Level */}
          <div style={{display:'flex',gap:10,justifyContent:'center',marginBottom:24}}>
            {[{id:'olevel',label:'📚 O Level'},{id:'alevel',label:'🎓 A Level'}].map(t=>(
              <button key={t.id}
                onClick={()=>setSelectedGrade(GRADES.find(g=>g.id===t.id))}
                style={{padding:'10px 26px',borderRadius:100,border:'2px solid',fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:"'Sora',sans-serif",transition:'all 0.2s',
                  background:selectedGrade?.id===t.id?'linear-gradient(135deg,#7C5CBF,#4F8EF7)':'rgba(255,255,255,0.04)',
                  borderColor:selectedGrade?.id===t.id?'transparent':'rgba(255,255,255,0.12)',
                  color:selectedGrade?.id===t.id?'#fff':'rgba(255,255,255,0.5)'}}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Subject pills — only show when O or A level selected */}
          {(selectedGrade?.id==='olevel'||selectedGrade?.id==='aslevel'||selectedGrade?.id==='alevel') && (
            <>
              <p style={{fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:14}}>Tap a subject to start — Starky launches instantly ★</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginBottom:8}}>
                {(selectedGrade?.id==='olevel' ? SUBJECTS_OLEVEL : SUBJECTS_ALEVEL).map(s=>(
                  <button key={s}
                    onClick={()=>{ setSelectedSubject(s); if(!userProfile){setShowRegModal(true);}else{launchChat(null,s);} }}
                    style={{padding:'9px 18px',borderRadius:100,border:'1px solid rgba(255,255,255,0.1)',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'Sora',sans-serif",transition:'all 0.15s',WebkitTapHighlightColor:'transparent',background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.7)'}}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(124,92,191,0.3)';e.currentTarget.style.borderColor='rgba(167,139,250,0.5)';e.currentTarget.style.color='#A78BFA';}}
                    onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';e.currentTarget.style.color='rgba(255,255,255,0.7)';}}>
                    {s}
                  </button>
                ))}
              </div>
              <p style={{fontSize:11,color:'rgba(255,255,255,0.25)',marginTop:10}}>30 years of past papers · All mark schemes · Free</p>
            </>
          )}

          {/* If no grade selected yet, show prompt */}
          {(!selectedGrade||(selectedGrade?.id!=='olevel'&&selectedGrade?.id!=='aslevel'&&selectedGrade?.id!=='alevel')) && (
            <p style={{fontSize:13,color:'rgba(255,255,255,0.3)',marginTop:8}}>Select O Level or A Level above to see your subjects</p>
          )}
        </div>
      </section>

      <section className="ft">
        <div className="sl">Why Starky</div>
        <div className="st">Built to actually help your child</div>
        <div className="fg">
          <div className="fc"><span className="fi">🎙️</span><div className="ftit">Voice Enabled</div><div className="fd">Speak to Starky and hear responses out loud</div></div>
          <div className="fc"><span className="fi">📧</span><div className="ftit">Parent Reports</div><div className="fd">Email after every session with progress & next steps</div></div>
          <div className="fc"><span className="fi">🌍</span><div className="ftit">16 Languages</div><div className="fd">Urdu, Arabic, English, Chinese — auto-detected</div></div>
          <div className="fc"><span className="fi">🎯</span><div className="ftit">Exam-Focused</div><div className="fd">O/A Level students get Cambridge-style feedback</div></div>
        </div>
      </section>

      <section className="qs">
        <div className="sl">What parents say</div>
        <div className="qc"><div className="qst">★★★★★</div><p className="qt">"My daughter used to dread Maths. After two weeks with Starky she looks forward to it. The session reports are incredible — I finally know what she's learning."</p><div className="qa"><strong>Fatima A.</strong> — Parent, Karachi</div></div>
        <div className="qc"><div className="qst">★★★★★</div><p className="qt">"Starky knew exactly what the O Level examiner wants. My son went from C to B in Physics in one month. Absolutely worth it."</p><div className="qa"><strong>Omar R.</strong> — Parent, Dubai</div></div>
      </section>

      <section className="sen">
        <div style={{fontSize:34,marginBottom:10}}>💜</div>
        <h2>Special Needs Support</h2>
        <p>Dedicated mode for students with autism, ADHD, dyslexia, and Down syndrome — adapted pacing, unlimited patience.</p>
        <Link href="/special-needs"><a className="bsen">Learn About SEN Support →</a></Link>
      </section>

      <footer className="foot">
        <div className="fl">NewWorldEdu<span>★</span></div>
        <div className="ftag">Every child deserves a world-class tutor.</div>
        <div className="flinks">
          <a href="/special-needs">Special Needs</a>
          <a href="/parent">Parents</a>
          <a href="/pricing">Pricing</a>
          <a href="/past-papers">Past Papers</a>
          <a href="/textbooks">Textbooks</a>
          <a href="/homework">Homework Help</a>
          <a href="/arts">Arts</a>
          <a href="/music">Music</a>
          <a href="/reading">Reading</a>
          <a href="/arts-for-all">Arts for All</a>
          <a href="/music-for-all">Music for All</a>
          <a href="/reading-for-all">Reading for All</a>
          <a href="/ibcc">IBCC Calculator</a>
        </div>
        <div className="fc2">© 2026 NewWorldEdu · khurram@newworld.education</div>
      </footer>
    </>
  );
}
