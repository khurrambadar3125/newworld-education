import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSessionLimit } from '../utils/useSessionLimit';
import { useTheme } from './_app';

const GRADE_GROUPS = [
  { label: 'Primary — KG to Grade 5', color: '#A8E063', grades: [
    { id: 'kg', label: 'KG', age: '4–5', emoji: '🌱' },
    { id: 'grade1', label: 'Grade 1', age: '5–6', emoji: '⭐' },
    { id: 'grade2', label: 'Grade 2', age: '6–7', emoji: '🌈' },
    { id: 'grade3', label: 'Grade 3', age: '7–8', emoji: '🚀' },
    { id: 'grade4', label: 'Grade 4', age: '8–9', emoji: '🌊' },
    { id: 'grade5', label: 'Grade 5', age: '9–10', emoji: '🔬' },
  ]},
  { label: 'Middle School — Grade 6 to 8', color: '#FFC300', grades: [
    { id: 'grade6', label: 'Grade 6', age: '10–11', emoji: '🧬' },
    { id: 'grade7', label: 'Grade 7', age: '11–12', emoji: '⚡' },
    { id: 'grade8', label: 'Grade 8', age: '12–13', emoji: '🌍' },
  ]},
  { label: 'Matric — Grade 9 & 10 Board', color: '#FF8C69', grades: [
    { id: 'grade9', label: 'Grade 9', age: '13–14', emoji: '🎯' },
    { id: 'grade10', label: 'Grade 10', age: '14–15', emoji: '📋' },
  ]},
  { label: 'Cambridge — O & A Level', color: '#4F8EF7', grades: [
    { id: 'olevel1', label: 'O Level', age: '14–16', emoji: '📚' },
    { id: 'alevel1', label: 'AS / A Level', age: '16–18', emoji: '🎓' },
  ]},
];
const GRADES = GRADE_GROUPS.flatMap(g => g.grades);

// Subject lists per grade band
// SNC (Single National Curriculum 2020) + Provincial Board subjects — Pakistan
const SUBJECTS_PRIMARY = ['Maths', 'English', 'Urdu', 'Science', 'Islamiat', 'Nazra Quran', 'General Knowledge', 'Social Studies', 'Drawing / Art', 'Sindhi', 'Pashto'];
const SUBJECTS_MIDDLE = ['Maths', 'English', 'Urdu', 'Science', 'Pakistan Studies', 'Islamiat', 'Nazra Quran', 'Computer', 'Social Studies', 'Arabic', 'Home Economics', 'Drawing / Art', 'Sindhi', 'Pashto'];
const SUBJECTS_MATRIC = [
  // Science group
  'Maths', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu', 'Pakistan Studies', 'Islamiat', 'Computer Science',
  // Arts / General group
  'General Maths', 'General Science', 'Civics', 'Economics', 'Education', 'Arabic', 'Home Economics',
  // Provincial
  'Sindhi', 'Pashto',
];
const SUBJECTS_GENERAL = SUBJECTS_MATRIC;

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

function formatMsg(text) {
  if (!text) return '<span style="opacity:0.4">...</span>';
  if (text === '...') return '<span style="opacity:0.4">Starky is typing...</span>';
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^#{1,3}\s+(.+)$/gm, '<strong style="font-size:1.1em">$1</strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#4F8EF7">$1</strong>')
    .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(79,142,247,0.15);padding:2px 6px;border-radius:4px;font-size:0.9em">$1</code>')
    .replace(/^(\d+)\.\s+/gm, '<span style="color:#4F8EF7;font-weight:700">$1.</span> ')
    .replace(/^[-•]\s+/gm, '<span style="color:#4F8EF7">•</span> ')
    .replace(/\n/g, '<br>');
}

export default function Home() {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [showAudienceSelector, setShowAudienceSelector] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Grade classification — used in greetings, suggestion chips, subject lists
  const gradeId = (selectedGrade?.id || '').toLowerCase();
  const isYoung = ['kg','grade1','grade2','grade3','grade4','grade5'].includes(gradeId);
  const isMiddle = ['grade6','grade7','grade8'].includes(gradeId);
  const isMatric = ['grade9','grade10'].includes(gradeId);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
      r.lang = (navigator.language || '').startsWith('ur') ? 'ur-PK' : 'en-US';
      r.onresult = (e) => { const t = e.results?.[0]?.[0]?.transcript; if (t) { setInput(t); setIsListening(false); setTimeout(() => { const btn = document.querySelector('.sb2'); if (btn && !btn.disabled) btn.click(); }, 300); } else { setIsListening(false); } };
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
    const clean = text
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')  // strip ALL emojis
      .replace(/[\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '')  // variation selectors, joiners, tags
      .replace(/[★*_`#]/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/\n+/g, ' ')
      .trim()
      .substring(0, 400);
    const utt = new SpeechSynthesisUtterance(clean);
    utt.lang = 'en-US';
    utt.rate = 0.95; utt.pitch = 1.05; utt.volume = 1;
    const voices = synthRef.current.getVoices();
    const v = voices.find(v => v.name.includes('Google US English'))
      || voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'))
      || voices.find(v => v.lang === 'en-US')
      || voices.find(v => v.lang.startsWith('en'));
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
    // Let users try Starky WITHOUT registration first — show reg after 2 messages
    launchChat();
  };

  const handleRegSubmit = () => {
    if (!regName.trim()) { setRegError('Please enter your name'); return; }
    if (!regEmail.trim() || !regEmail.includes('@')) { setRegError('Please enter a valid email'); return; }
    const profile = {
      name: regName.trim(),
      email: regEmail.trim(),
      role: regRole,
      grade: selectedGrade?.label || '',
      gradeId: selectedGrade?.id || '',
      gradeAge: selectedGrade?.age || '',
      joinedAt: new Date().toISOString(),
      // Parent communication: when role is parent OR student is young, the registering email is the parent's
      parentEmail: regEmail.trim(),
    };
    localStorage.setItem('nw_user', JSON.stringify(profile));
    setUserProfile(profile);
    setShowRegModal(false);
    // Generate referral code + link to referrer if came via referral link
    fetch('/api/referral', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'register', email: profile.email }) }).catch(() => {});
    try {
      const refCode = localStorage.getItem('nw_referral_code');
      if (refCode) {
        fetch('/api/referral', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'link', email: profile.email, code: refCode }) }).catch(() => {});
        localStorage.removeItem('nw_referral_code');
      }
    } catch {}
    launchChat(profile, selectedSubject);
  };

  const launchChat = (profile, subjectOverride) => {
    const p = profile || userProfile;
    const firstName = p?.name?.split(' ')[0] || 'there';
    const subject = subjectOverride || selectedSubject;
    setChatStarted(true);
    const isParent = userProfile?.role === 'parent';

    let greeting;
    if (isYoung) {
      greeting = `Hi ${firstName}! 👋🌟 I'm Starky — your learning star!\n\n${subject ? `Let's learn ${subject} together! 🎯` : `What shall we learn? Tell me! 🎤`}\n\nYou can talk to me, or tap the 🎤 button to speak!\n\n💡 Besides chatting, you can also try the Spelling Bee 🐝, Practice Drills 🎯, and Exam Countdown ⏱️ — all free!`;
    } else if (isMiddle) {
      greeting = `Hey ${firstName}! I'm Starky ★\n\n${subject ? `Let's work on ${subject}. ` : ''}I know your entire syllabus — every chapter, every concept. You can ask me anything, photograph your textbook, or say "quiz me" and I'll test you.\n\nWhat do you need help with?\n\n💡 Also try: Practice Drills, Spelling Bee, and Exam Countdown — all free!`;
    } else if (isMatric) {
      greeting = `Hey ${firstName}! Starky here ★\n\nI know the ${subject || 'Matric'} board syllabus front to back — every numerical, every definition, every diagram the BISE examiner expects.\n\n${subject ? `Try me — ask anything about ${subject}, send a photo of your notes, or say "quiz me".` : 'Type your question, photograph your notes, or say "quiz me".'}\n\nRoman Urdu mein bhi pooch sakte ho 🇵🇰\n\n💡 Also try: Practice Drills, Exam Countdown, and Spelling Bee — all free!`;
    } else {
      greeting = `Hey ${firstName}! Starky here ★\n\nI've gone through every ${subject || 'Cambridge'} past paper, mark scheme, and examiner report from 1994 to 2024.\n\n${subject ? `Ask me anything about ${subject} — past paper question, concept explanation, or say "quiz me on ${subject}".` : 'Ask me anything — homework, exam prep, or photograph your notes.'}\n\nCommand words, mark allocation, examiner expectations — I know it all.\n\n💡 Also try: Practice Drills, Past Papers Hub, and Exam Countdown — all free!`;
    }
    if (isParent) greeting += '\n\nاردو میں بھی پوچھ سکتے ہو 🇵🇰';
    setMessages([{ role: 'assistant', content: greeting }]);
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const sendMessage = async (override) => {
    const text = (override || input).trim();
    if (!text || loading || isLimitReached) return;
    // After 2 free messages, prompt registration to save progress
    const msgCount = messages.filter(m => m.role === 'user').length;
    if (!userProfile && msgCount >= 2) { setShowRegModal(true); return; }
    const userMsg = { role: 'user', content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    stopSpeaking();

    const p = userProfile || {};

    try {
      // Use the full prompt engineering system — grade-differentiated prompts
      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          stream: true,
          userProfile: {
            ...p,
            gradeId: selectedGrade?.id || p.gradeId || '',
            grade: selectedGrade?.label || p.grade || '',
            gradeAge: selectedGrade?.age || p.gradeAge || '',
          },
          sessionMemory: { currentSubject: selectedSubject || '', conversationHistory: newMsgs.slice(-10) },
        }),
      });

      if (!res.ok) {
        let errData = {};
        try { errData = await res.json(); } catch {}
        throw new Error(errData.error || `API ${res.status}`);
      }

      let data = {};
      let reply = '';

      // Handle streaming response
      if (res.headers.get('content-type')?.includes('text/event-stream')) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        const streamIdx = newMsgs.length;
        setMessages([...newMsgs, { role: 'assistant', content: '...' }]);
        setLoading(false);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
              const evt = JSON.parse(line.slice(6));
              if (evt.type === 'text') {
                reply += evt.text;
                setMessages(prev => { const u = [...prev]; u[streamIdx] = { role: 'assistant', content: reply }; return u; });
              } else if (evt.type === 'error') { throw new Error(evt.error); }
            } catch (pe) { if (pe.message && !pe.message.includes('JSON')) throw pe; }
          }
        }
        data = { response: reply };
      } else {
        try { data = await res.json(); } catch(e) { data = {}; }
        reply = data.response || data.content || '';
      }
      const finalReply = reply || data.response || data.content || "Starky is busy — please try again in a moment!";
      // Only set messages if not already set by streaming
      if (!res.headers.get('content-type')?.includes('text/event-stream')) {
        setMessages([...newMsgs, { role: 'assistant', content: finalReply }]);
      }
      try { recordCall(); } catch(e) {}
      try { if (voiceSupported && finalReply.length < 400) speakText(finalReply); } catch(e) {}
      try {
        if (newMsgs.filter(m => m.role === 'user').length >= 5 && p.email) {
          fetch('/api/session-complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId: p.email, studentName: p.name, parentEmail: p.email, parentName: p.name, grade: selectedGrade?.label, subject: selectedSubject || 'General', messages: newMsgs, isSEN: !!p.senFlag, senType: p.senType || null, sessionCount }),
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

        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap" rel="stylesheet" />
      </Head>
      <style jsx global>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#080C18;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;color:#fff}
        .cs{display:flex;flex-direction:column;height:100dvh;max-width:680px;margin:0 auto}
        .ch{display:flex;align-items:center;justify-content:space-between;padding:calc(12px + env(safe-area-inset-top)) 16px 12px;background:#080C18;border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0}
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
        .msg.assistant strong{color:#4F8EF7;font-weight:700}
        .msg.typing{opacity:.5;font-style:italic}
        .lw{margin:0 16px 12px;padding:18px 20px;background:rgba(255,60,60,.07);border:1px solid rgba(255,60,60,.18);border-radius:16px;text-align:center}
        .lw p{font-size:14px;color:rgba(255,255,255,.65);margin-bottom:14px;line-height:1.6}
        .lw a{display:inline-block;background:linear-gradient(135deg,#4F8EF7,#7C5CBF);color:#fff;padding:12px 28px;border-radius:100px;font-family:'Sora',sans-serif;font-size:15px;font-weight:700;text-decoration:none}
        .cia{padding:10px 16px calc(14px + env(safe-area-inset-bottom));background:#080C18;border-top:1px solid rgba(255,255,255,.07);flex-shrink:0}
        .ir{display:flex;gap:8px;align-items:flex-end}
        .ta{flex:1;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:14px;color:#fff;padding:12px 14px;font-size:16px;font-family:inherit;outline:none;resize:none;max-height:100px;-webkit-appearance:none}
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
            <button className="ib" onClick={() => { if (messages.length > 2 && !confirm('Leave this chat? Your conversation will be lost.')) return; setChatStarted(false); setMessages([]); stopSpeaking(); }}>← Back</button>
          </div>
        </div>
        {!isLimitReached && remaining <= 2 && (
          <div className={`sb ${remaining <= 1 ? 'd' : 'w'}`}>{remaining} session{remaining !== 1 ? 's' : ''} remaining today</div>
        )}
        <div className="cm">
          {messages.map((m, i) => m.role === 'assistant'
            ? <div key={i} className={`msg ${m.role}`} dangerouslySetInnerHTML={{ __html: formatMsg(m.content) }} />
            : <div key={i} className={`msg ${m.role}`}>{m.content}</div>
          )}
          {loading && <div className="msg assistant typing">Starky is thinking…</div>}
          {/* Quick suggestion chips — grade-appropriate */}
          {(messages.length <= 1 || (messages.length > 0 && messages.length % 6 === 0)) && !loading && (
            <div style={{display:'flex',flexWrap:'wrap',gap:8,padding:'8px 0'}}>
              {(isYoung
                ? (selectedSubject
                  ? [`Help me with ${selectedSubject}`, `Quiz me on ${selectedSubject}!`, `Explain something fun in ${selectedSubject}`, 'I have homework — help me!']
                  : ['Help me with my homework 📝', 'Teach me something new! 🌟', 'Quiz me! 🎯', 'I don\'t understand something'])
                : isMiddle || isMatric
                ? (selectedSubject
                  ? [`Explain a topic in ${selectedSubject}`, `Quiz me on ${selectedSubject}`, `Help with my ${selectedSubject} homework`, `How to get top marks in ${selectedSubject}?`]
                  : ['Help me with homework', 'Quiz me on a topic', 'Explain something I don\'t understand', 'How to prepare for board exams?'])
                : selectedSubject
                ? [
                    `Explain a key concept in ${selectedSubject}`,
                    `Quiz me on ${selectedSubject}`,
                    `How do I get an A* in ${selectedSubject}?`,
                    `Common mistakes in ${selectedSubject}`,
                  ]
                : [
                    'Help me with my homework',
                    'Quiz me on a topic',
                    'Explain something I don\'t understand',
                    'How do I prepare for exams?',
                  ]
              ).map(s => (
                <button key={s} onClick={() => sendMessage(s)} style={{background:'rgba(79,142,247,0.1)',border:'1px solid rgba(79,142,247,0.25)',borderRadius:100,padding:'8px 14px',fontSize:13,fontWeight:600,color:'#4F8EF7',cursor:'pointer',fontFamily:'inherit'}}>{s}</button>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {isLimitReached ? (
          <div className="lw"><p>You've used all your free sessions for today.<br />Upgrade to keep learning without limits.</p><Link href="/pricing"><a>See Plans — from Rs 8,300/mo →</a></Link>
            <div style={{marginTop:12,display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center'}}>
              <a href="/spelling-bee" style={{fontSize:12,fontWeight:700,color:'#FFC300',textDecoration:'none',background:'rgba(255,192,0,0.1)',border:'1px solid rgba(255,192,0,0.25)',borderRadius:100,padding:'6px 14px'}}>🐝 Spelling Bee</a>
              <a href="/languages" style={{fontSize:12,fontWeight:700,color:'#7C5CBF',textDecoration:'none',background:'rgba(124,92,191,0.1)',border:'1px solid rgba(124,92,191,0.25)',borderRadius:100,padding:'6px 14px'}}>🌍 Languages</a>
              <a href="/countdown" style={{fontSize:12,fontWeight:700,color:'#63D2FF',textDecoration:'none',background:'rgba(99,210,255,0.1)',border:'1px solid rgba(99,210,255,0.25)',borderRadius:100,padding:'6px 14px'}}>⏱️ Countdown</a>
              <a href="/leaderboard" style={{fontSize:12,fontWeight:700,color:'#A8E063',textDecoration:'none',background:'rgba(168,224,99,0.1)',border:'1px solid rgba(168,224,99,0.25)',borderRadius:100,padding:'6px 14px'}}>🏆 Leaderboard</a>
            </div>
          </div>
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
        <title>NewWorldEdu ★ — Personal Tutor | KG to A Levels</title>
        <meta name="description" content="Meet Starky — your child's personal tutor. 24/7, 16 languages, KG to A Levels. Start your 7-day trial." />

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
        .dr{position:fixed;top:56px;left:0;right:0;bottom:0;background:rgba(8,12,24,.98);z-index:99;padding:20px;padding-bottom:calc(20px + env(safe-area-inset-bottom,0));overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
        .dr a{display:block;padding:16px;border-bottom:1px solid rgba(255,255,255,.05);color:rgba(255,255,255,.8);text-decoration:none;font-size:17px;font-weight:500}
        .hero{padding:40px 20px 32px;text-align:center;background:radial-gradient(ellipse 80% 40% at 50% 0%,rgba(79,142,247,.1) 0%,transparent 70%)}
        .hb{display:inline-flex;align-items:center;gap:6px;background:rgba(79,142,247,.1);border:1px solid rgba(79,142,247,.22);border-radius:100px;padding:5px 14px;font-size:12px;color:#4F8EF7;font-weight:600;letter-spacing:.05em;margin-bottom:18px;text-transform:uppercase}
        .hero h1{font-family:'Sora',sans-serif;font-size:clamp(28px,8vw,52px);font-weight:800;line-height:1.15;letter-spacing:-.03em;margin-bottom:14px}
        .hero h1 em{font-style:normal;background:linear-gradient(135deg,#4F8EF7,#A78BFA);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .hs{font-size:16px;color:rgba(255,255,255,.5);line-height:1.7;margin-bottom:26px;max-width:340px;margin-left:auto;margin-right:auto}
        .hc{display:flex;flex-direction:column;gap:10px;align-items:center}
        .bp{display:block;width:100%;max-width:320px;background:linear-gradient(135deg,#4F8EF7,#6366F1);color:#fff;border:none;border-radius:14px;padding:16px 24px;font-size:17px;font-weight:700;font-family:'Sora',sans-serif;cursor:pointer;text-decoration:none;text-align:center;box-shadow:0 8px 28px rgba(79,142,247,.28);-webkit-tap-highlight-color:transparent;animation:ctaPulse 2s ease-in-out infinite}
        @keyframes ctaPulse{0%{box-shadow:0 8px 28px rgba(79,142,247,.28)}50%{box-shadow:0 8px 36px rgba(79,142,247,.5),0 0 0 8px rgba(79,142,247,.1)}100%{box-shadow:0 8px 28px rgba(79,142,247,.28)}}
        .bo{display:block;width:100%;max-width:320px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.75);border-radius:14px;padding:15px 24px;font-size:16px;font-weight:600;font-family:'Sora',sans-serif;cursor:pointer;text-decoration:none;text-align:center;-webkit-tap-highlight-color:transparent}
        .pr{display:flex;justify-content:center;gap:24px;margin-top:26px;flex-wrap:wrap}
        .pi{text-align:center}
        .pn{font-family:'Sora',sans-serif;font-size:22px;font-weight:800;background:linear-gradient(135deg,#4F8EF7,#A78BFA);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .pl{font-size:11px;color:rgba(255,255,255,.38);margin-top:2px}
        .sec{padding:36px 20px}
        .sl{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:14px;text-align:center}
        .st{font-family:'Sora',sans-serif;font-size:20px;font-weight:700;text-align:center;margin-bottom:18px;line-height:1.3}
        .gg{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;max-width:480px;margin:0 auto}
        @media(min-width:420px){.gg{grid-template-columns:repeat(3,1fr)}}
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
        .stb{display:block;width:100%;max-width:320px;margin:0 auto;background:linear-gradient(135deg,#4F8EF7,#6366F1);color:#fff;border:none;border-radius:14px;padding:16px 32px;font-size:17px;font-weight:700;font-family:'Sora',sans-serif;cursor:pointer;box-shadow:0 8px 28px rgba(79,142,247,.28);-webkit-tap-highlight-color:transparent}
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
        .mi{width:100%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#fff;padding:12px 14px;font-size:16px;outline:none;-webkit-appearance:none}
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

        /* ── Light mode overrides for homepage ── */
        [data-theme="light"] body{background:var(--bg-primary);color:var(--text-primary)}
        [data-theme="light"] .nav{background:var(--nav-bg);border-color:var(--border)}
        [data-theme="light"] .nl{color:var(--text-primary)}
        [data-theme="light"] .nh{background:var(--bg-card);color:var(--text-primary)}
        [data-theme="light"] .dr{background:rgba(255,255,255,.98)}
        [data-theme="light"] .dr a{color:var(--text-secondary);border-color:var(--border)}
        [data-theme="light"] .hero h1{color:var(--text-primary)}
        [data-theme="light"] .hs{color:var(--text-muted)}
        [data-theme="light"] .bo{background:var(--bg-card);border-color:var(--border);color:var(--text-secondary)}
        [data-theme="light"] .sec{color:var(--text-primary)}
        [data-theme="light"] .sl{color:var(--text-muted)}
        [data-theme="light"] .st{color:var(--text-primary)}
        [data-theme="light"] .gb{background:var(--bg-card);border-color:var(--border)}
        [data-theme="light"] .gb.s{background:rgba(79,142,247,.1);border-color:rgba(79,142,247,.35)}
        [data-theme="light"] .gn{color:var(--text-primary)}
        [data-theme="light"] .ga{color:var(--text-muted)}
        [data-theme="light"] .sbb{background:var(--bg-card);border-color:var(--border);color:var(--text-secondary)}
        [data-theme="light"] .sbb.s{background:rgba(124,92,191,.1);border-color:rgba(124,92,191,.35);color:#7C5CBF}
        [data-theme="light"] .ft{background:var(--bg-card);border-color:var(--border)}
        [data-theme="light"] .fc{background:var(--bg-card);border-color:var(--border)}
        [data-theme="light"] .ftit{color:var(--text-primary)}
        [data-theme="light"] .fd{color:var(--text-muted)}
        [data-theme="light"] .qs{color:var(--text-primary)}
        [data-theme="light"] .qc{background:var(--bg-card);border-color:var(--border)}
        [data-theme="light"] .qt{color:var(--text-secondary)}
        [data-theme="light"] .qa{color:var(--text-muted)}
        [data-theme="light"] .qa strong{color:var(--text-secondary)}
        [data-theme="light"] .sen{background:linear-gradient(135deg,rgba(228,93,156,.05),rgba(124,92,191,.05));border-color:rgba(228,93,156,.1)}
        [data-theme="light"] .sen h2{color:var(--text-primary)}
        [data-theme="light"] .sen p{color:var(--text-muted)}
        [data-theme="light"] .foot{border-color:var(--border)}
        [data-theme="light"] .fl{color:var(--text-primary)}
        [data-theme="light"] .ftag{color:var(--text-muted)}
        [data-theme="light"] .flinks a{color:var(--text-muted)}
        [data-theme="light"] .fc2{color:var(--text-muted)}
        [data-theme="light"] .pl{color:var(--text-muted)}
        [data-theme="light"] .qst{color:var(--text-primary)}
        /* Modal */
        [data-theme="light"] .md{background:#fff;border-color:var(--border)}
        [data-theme="light"] .md h2{color:var(--text-primary)}
        [data-theme="light"] .md p{color:var(--text-muted)}
        [data-theme="light"] .mlb{color:var(--text-muted)}
        [data-theme="light"] .mi{background:var(--input-bg);border-color:var(--input-border);color:var(--text-primary)}
        [data-theme="light"] .mi::placeholder{color:var(--text-faint)}
        [data-theme="light"] .rb{background:var(--bg-card);border-color:var(--border);color:var(--text-secondary)}
        [data-theme="light"] .rb.s{background:rgba(79,142,247,.1);border-color:rgba(79,142,247,.35);color:#3B7DE8}
        [data-theme="light"] .mfine{color:var(--text-faint)}
        [data-theme="light"] .me{color:#dc2626}
        /* Chat area */
        [data-theme="light"] .mb{background:var(--bg-card) !important;border-color:var(--border) !important;color:var(--text-primary) !important}

        /* ── Broad inline style overrides for light mode ── */
        /* Catch all inline rgba(255,255,255,...) text colors on the homepage */
        [data-theme="light"] .sec [style*="rgba(255,255,255"]{color:var(--text-muted) !important}
        [data-theme="light"] .sec [style*="fontWeight:800"]{color:var(--text-primary) !important}
        [data-theme="light"] .sec [style*="fontWeight: 800"]{color:var(--text-primary) !important}
        [data-theme="light"] .hero [style*="rgba(255,255,255"]{color:var(--text-muted) !important}
        /* Comparison table */
        [data-theme="light"] .sec > div[style*="rgba(255,255,255,0.03)"]{background:var(--bg-card) !important;border-color:var(--border) !important}
        [data-theme="light"] .sec > div div[style*="borderBottom"]{border-color:var(--border) !important}
        [data-theme="light"] .sec [style*="color:\'rgba(255,255,255"]{color:var(--text-muted) !important}
        /* School/dashboard link text */
        [data-theme="light"] .sec a[style*="rgba(255,255,255"]{color:var(--text-muted) !important}
        /* Cambridge section inline buttons */
        [data-theme="light"] section[style*="background:#0A0F1E"],
        [data-theme="light"] section[style*="background: #0A0F1E"]{background:var(--bg-secondary) !important}
        /* The O/A Level section heading and descriptions */
        [data-theme="light"] section p[style*="rgba(255,255,255"]{color:var(--text-muted) !important}
        [data-theme="light"] section button[style*="rgba(255,255,255,0.05)"]{background:var(--bg-card) !important;border-color:var(--border) !important;color:var(--text-secondary) !important}
        [data-theme="light"] section button[style*="rgba(255,255,255,0.04)"]{background:var(--bg-card) !important;border-color:var(--border) !important;color:var(--text-secondary) !important}
        /* Menu links in light mode */
        [data-theme="light"] .dr div[style*="rgba(255,255,255"]{color:var(--text-muted) !important}
      `}</style>

      {/* Registration Modal */}
      {showRegModal && (
        <div className="mo" onClick={e => { if (e.target.classList.contains('mo') && !regName.trim() && !regEmail.trim()) setShowRegModal(false); }}>
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
          <button className="nh" onClick={toggleTheme} aria-label="Toggle light/dark mode" title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>{theme === 'dark' ? '☀️' : '🌙'}</button>
          <button className="nh" onClick={() => { const next = !menuOpen; setMenuOpen(next); document.body.style.overflow = next ? 'hidden' : ''; }}>{menuOpen?'✕':'☰'}</button>
        </div>
      </nav>
      {menuOpen && (
        <div className="dr" onClick={() => { setMenuOpen(false); document.body.style.overflow = ''; }}>
          <a href="/" style={{fontWeight:700,borderBottom:'1px solid rgba(255,255,255,0.1)'}}>🏠 Home</a>
          <div style={{padding:'14px 16px 4px',fontSize:11,fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)'}}>Learn</div>
          <a href="/drill">🎯 Practice Drill</a>
          <a href="/past-papers">📚 Past Papers</a>
          <a href="/homework">📝 Homework Help</a>
          <a href="/essay">✍️ Essay Marking</a>
          <a href="/textbooks">📖 Textbooks</a>
          <a href="/languages">🌍 Languages</a>
          <a href="/spelling-bee">🐝 Spelling Bee</a>
          <div style={{padding:'14px 16px 4px',fontSize:11,fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)'}}>Tools</div>
          <a href="/countdown">⏱️ Exam Countdown</a>
          <a href="/subscribe">📬 Daily Questions</a>
          <a href="/leaderboard">🏆 Leaderboard</a>
          <div style={{padding:'14px 16px 4px',fontSize:11,fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)'}}>Creative</div>
          <a href="/arts">🎨 Arts</a>
          <a href="/music">🎵 Music</a>
          <a href="/reading">📚 Reading</a>
          <div style={{padding:'14px 16px 4px',fontSize:11,fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)'}}>Parents & Schools</div>
          <a href="/parent">👨‍👩‍👧 Parent Portal</a>
          <a href="/special-needs">💜 Special Needs</a>
          <a href="/dashboard">📊 Teacher Dashboard</a>
          <a href="/school">🏫 For Schools</a>
          <div style={{padding:'12px 16px',marginTop:8,borderTop:'1px solid rgba(255,255,255,0.08)'}}>
            <a href="/pricing" style={{fontWeight:700,color:'#4F8EF7'}}>💳 Plans & Pricing</a>
          </div>
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

      {/* Urdu strip removed — Cambridge students use English/Roman Urdu. Starky auto-detects Roman Urdu. */}

      <section className="hero">
        <div className="hb">★ Starky — KG to A Levels</div>
        <h1>Every Child Deserves a <em>World-Class</em> Tutor</h1>
        <p className="hs">Better grades in 30 days. 24/7. 16 languages. Every subject.</p>

        {!showAudienceSelector ? (
          <div className="hc">
            <button className="bp" onClick={() => setShowAudienceSelector(true)}
              style={{fontSize:18,padding:'18px 32px',maxWidth:400}}>
              Meet your personal tutor. Start learning →
            </button>
          </div>
        ) : (
          <div style={{maxWidth:400,margin:'0 auto',animation:'fadeUp 0.3s ease'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
              <a href="#start-learning" onClick={()=>setShowAudienceSelector(false)}
                style={{background:'rgba(79,142,247,0.1)',border:'2px solid rgba(79,142,247,0.3)',borderRadius:16,padding:'20px 12px',textAlign:'center',textDecoration:'none',color:'#4F8EF7',fontWeight:800,fontSize:15,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                <span style={{fontSize:28}}>👨‍🎓</span>I am a Student
              </a>
              <a href="/parent"
                style={{background:'rgba(74,222,128,0.1)',border:'2px solid rgba(74,222,128,0.3)',borderRadius:16,padding:'20px 12px',textAlign:'center',textDecoration:'none',color:'#4ADE80',fontWeight:800,fontSize:15,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                <span style={{fontSize:28}}>👨‍👩‍👧</span>I am a Parent
              </a>
              <a href="/dashboard"
                style={{background:'rgba(255,195,0,0.1)',border:'2px solid rgba(255,195,0,0.3)',borderRadius:16,padding:'20px 12px',textAlign:'center',textDecoration:'none',color:'#FFC300',fontWeight:800,fontSize:15,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                <span style={{fontSize:28}}>👩‍🏫</span>I am a Teacher
              </a>
              <a href="/parent?sen=1"
                style={{background:'rgba(199,125,255,0.1)',border:'2px solid rgba(199,125,255,0.3)',borderRadius:16,padding:'20px 12px',textAlign:'center',textDecoration:'none',color:'#C77DFF',fontWeight:800,fontSize:15,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                <span style={{fontSize:28}}>💜</span>My Child Has Special Needs
              </a>
            </div>
            <button onClick={() => { setShowAudienceSelector(false); setTimeout(() => { const el = document.querySelector('.starky-fab'); if (el) el.click(); }, 200); }}
              style={{background:'none',border:'none',color:'rgba(255,255,255,0.4)',fontSize:13,cursor:'pointer',fontFamily:"'Sora',sans-serif",display:'block',margin:'0 auto'}}>
              Just show me the tutor →
            </button>
          </div>
        )}

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
        <div style={{maxWidth:480,margin:'0 auto'}}>
          {GRADE_GROUPS.map(group => (
            <div key={group.label} style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:800,color:group.color,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:8,paddingLeft:4}}>{group.label}</div>
              <div className="gg">
                {group.grades.map(g => (
                  <button key={g.id} className={`gb ${selectedGrade?.id===g.id?'s':''}`} onClick={() => { setSelectedGrade(g); setTimeout(() => document.getElementById("subject-section")?.scrollIntoView({behavior:"smooth",block:"center"}), 150); }}>
                    <span className="ge">{g.emoji}</span>
                    <span className="gn">{g.label}</span>
                    <span className="ga">Age {g.age}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {selectedGrade && (
          <>
            <div id="subject-section" style={{marginTop:28}}>
              <div className="sl">Step 2 of 2 — Optional</div>
              <div className="st" style={{marginBottom:14}}>Pick a subject</div>
              <div className="sr">
                {(selectedGrade?.id?.includes('olevel') ? SUBJECTS_OLEVEL
                  : selectedGrade?.id?.includes('alevel') ? SUBJECTS_ALEVEL
                  : ['kg','grade1','grade2','grade3','grade4','grade5'].includes(selectedGrade?.id) ? SUBJECTS_PRIMARY
                  : ['grade6','grade7','grade8'].includes(selectedGrade?.id) ? SUBJECTS_MIDDLE
                  : ['grade9','grade10'].includes(selectedGrade?.id) ? SUBJECTS_MATRIC
                  : SUBJECTS_GENERAL).map(s => (
                  <button key={s} className={`sbb ${selectedSubject===s?'s':''}`} onClick={() => { setSelectedSubject(s); if(!userProfile){setShowRegModal(true);}else{launchChat(null,s);} }}>{s}</button>
                ))}
              </div>
            </div>
            <div className="sw">
              <button className="stb" disabled={!selectedGrade} onClick={handleStartChat}>
                {!selectedGrade ? 'Select your grade above ↑' : !selectedSubject ? 'Chat with Starky →' : userProfile?.name ? `Continue as ${userProfile.name.split(' ')[0]} →` : 'Start with Starky ★'}
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
            {[{id:'olevel1',label:'📚 O Level'},{id:'alevel1',label:'🎓 A Level'}].map(t=>(
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
          {(selectedGrade?.id?.includes('olevel')||selectedGrade?.id?.includes('alevel')) && (
            <>
              <p style={{fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:14}}>Tap a subject to start — Starky launches instantly ★</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginBottom:8}}>
                {(selectedGrade?.id?.includes('olevel') ? SUBJECTS_OLEVEL : SUBJECTS_ALEVEL).map(s=>(
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
          {(!selectedGrade||(!selectedGrade?.id?.includes('olevel')&&!selectedGrade?.id?.includes('alevel'))) && (
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

      {/* How it works — for parents who want to understand Starky */}
      <section className="sec" style={{background:'rgba(79,142,247,0.04)',borderTop:'1px solid rgba(79,142,247,0.1)',borderBottom:'1px solid rgba(79,142,247,0.1)'}}>
        <div className="sl">How Starky works</div>
        <div className="st">3 Simple Steps</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,maxWidth:700,margin:'0 auto'}}>
          <div style={{textAlign:'center',padding:20}}>
            <div style={{fontSize:40,marginBottom:8}}>1️⃣</div>
            <div style={{fontWeight:800,fontSize:15,marginBottom:4}}>Pick grade & subject</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>KG to A Level. Every Cambridge and Matric subject.</div>
          </div>
          <div style={{textAlign:'center',padding:20}}>
            <div style={{fontSize:40,marginBottom:8}}>2️⃣</div>
            <div style={{fontWeight:800,fontSize:15,marginBottom:4}}>Chat or photograph</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>Type your question, send a photo of your homework, or ask Starky to quiz you.</div>
          </div>
          <div style={{textAlign:'center',padding:20}}>
            <div style={{fontSize:40,marginBottom:8}}>3️⃣</div>
            <div style={{fontWeight:800,fontSize:15,marginBottom:4}}>Learn step by step</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>Starky guides you to the answer like a private tutor. Parents get a report after every session.</div>
          </div>
        </div>
      </section>

      {/* Parent section — what parents can do */}
      <section className="sec" style={{background:'rgba(74,222,128,0.04)',borderTop:'1px solid rgba(74,222,128,0.1)',borderBottom:'1px solid rgba(74,222,128,0.1)'}}>
        <div className="sl">For Parents</div>
        <div className="st">Stay involved in your child's education — even remotely</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,maxWidth:700,margin:'0 auto 24px'}}>
          {[
            { emoji:'📋', title:'Set Assignments', desc:'Tell Starky what your child should study. They see it when they open the app — from any device.' },
            { emoji:'📊', title:'Track Progress', desc:'See weak topics, recent mistakes, and session summaries. Know exactly where your child needs help.' },
            { emoji:'💬', title:'Send Feedback', desc:'Write a message your child sees on their next session. "Great work on Chemistry! Focus on equations next."' },
            { emoji:'📧', title:'Session Reports', desc:'Get an email after every study session with accuracy, strengths, weak areas, and what to practise next.' },
            { emoji:'🎓', title:'Teach with Starky', desc:'Ask Starky "How do I teach my daughter osmosis?" and get a step-by-step guide with mark scheme tips.' },
            { emoji:'📱', title:'Works Remotely', desc:'You at the office, your child at home. Set assignments, check progress, and send feedback — all cross-device.' },
          ].map(f => (
            <div key={f.title} style={{textAlign:'center',padding:16}}>
              <div style={{fontSize:32,marginBottom:6}}>{f.emoji}</div>
              <div style={{fontWeight:800,fontSize:14,marginBottom:4}}>{f.title}</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>{f.desc}</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/parent" style={{display:'inline-block',background:'linear-gradient(135deg,#4ADE80,#22C55E)',color:'#060B20',padding:'14px 32px',borderRadius:100,fontWeight:800,fontSize:15,textDecoration:'none'}}>Open Parent Portal →</a>
          <a href="/parent?sen=1" style={{display:'inline-block',background:'linear-gradient(135deg,#C77DFF,#A78BFA)',color:'#fff',padding:'14px 32px',borderRadius:100,fontWeight:800,fontSize:15,textDecoration:'none'}}>💜 SEN Parent — Register Your Child</a>
        </div>
      </section>

      {/* For Teachers section */}
      <section className="sec" style={{background:'rgba(79,142,247,0.04)',borderTop:'1px solid rgba(79,142,247,0.1)',borderBottom:'1px solid rgba(79,142,247,0.1)'}}>
        <div className="sl">For Teachers</div>
        <div className="st">See every student's progress in one dashboard</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,maxWidth:700,margin:'0 auto 24px'}}>
          {[
            { emoji:'📊', title:'Student Overview', desc:'See all your students in one place — who is active, who needs attention, who is improving.' },
            { emoji:'⚠️', title:'Weak Topic Alerts', desc:'Instantly spot which students are struggling and on which topics. No more guessing.' },
            { emoji:'❌', title:'Mistake Tracking', desc:'See the exact mistakes each student keeps making — with descriptions from Starky\'s analysis.' },
            { emoji:'📈', title:'Session Activity', desc:'Track total sessions, last active date, current subject, and engagement for every student.' },
          ].map(f => (
            <div key={f.title} style={{textAlign:'center',padding:16}}>
              <div style={{fontSize:32,marginBottom:6}}>{f.emoji}</div>
              <div style={{fontWeight:800,fontSize:14,marginBottom:4}}>{f.title}</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>{f.desc}</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center'}}>
          <a href="/dashboard" style={{display:'inline-block',background:'linear-gradient(135deg,#4F8EF7,#6366F1)',color:'#fff',padding:'14px 32px',borderRadius:100,fontWeight:800,fontSize:15,textDecoration:'none'}}>Open Teacher Dashboard →</a>
          <div style={{marginTop:10}}><a href="/school" style={{color:'rgba(255,255,255,0.4)',fontSize:13,textDecoration:'none'}}>Want Starky for your whole school? See school plans →</a></div>
        </div>
      </section>

      {/* Trust comparison — why Starky vs human tutor */}
      <section className="sec">
        <div className="sl">Why parents choose Starky</div>
        <div style={{maxWidth:560,margin:'0 auto',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,overflow:'hidden'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
            <div style={{padding:'12px 8px',fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.3)'}}></div>
            <div style={{padding:'12px 8px',fontSize:11,fontWeight:700,color:'#4F8EF7',textAlign:'center'}}>Starky</div>
            <div style={{padding:'12px 8px',fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.4)',textAlign:'center'}}>Human Tutor</div>
          </div>
          {[
            ['Available','24/7','3x per week'],
            ['Subjects','All subjects','1-2 subjects'],
            ['Cost/month','Rs 8,300','Rs 8,000-15,000 per subject'],
            ['Past papers','30 years of papers','From memory'],
            ['Parent reports','After every session','Rarely'],
            ['Patience','Unlimited','Human'],
          ].map(([label,starky,tutor],i) => (
            <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',borderBottom:i<5?'1px solid rgba(255,255,255,0.04)':'none'}}>
              <div style={{padding:'10px 8px',fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.5)'}}>{label}</div>
              <div style={{padding:'10px 8px',fontSize:12,fontWeight:700,color:'#4ADE80',textAlign:'center'}}>{starky}</div>
              <div style={{padding:'10px 8px',fontSize:12,color:'rgba(255,255,255,0.35)',textAlign:'center'}}>{tutor}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="qs">
        <div className="sl">What parents say</div>
        <div className="qc"><div className="qst">★★★★★</div><p className="qt">"My daughter used to dread Maths. After two weeks with Starky she looks forward to it. The session reports are incredible — I finally know what she's learning."</p><div className="qa"><strong>Fatima A.</strong> — Parent, Karachi</div></div>
        <div className="qc"><div className="qst">★★★★★</div><p className="qt">"Starky knew exactly what the O Level examiner wants. My son went from C to B in Physics in one month. Absolutely worth it."</p><div className="qa"><strong>Omar R.</strong> — Parent, Dubai</div></div>
        <div className="qc"><div className="qst">★★★★★</div><p className="qt">"میری بیٹی اب خود سے Starky سے پڑھتی ہے۔ پہلے ٹیوشن سے بھاگتی تھی۔ اب خود مانگتی ہے۔"</p><div className="qa"><strong>Nadia K.</strong> — والدہ، لاہور</div></div>
        <div className="qc"><div className="qst">★★★★★</div><p className="qt">"I was skeptical at first. But the session reports showed me exactly what he learned. After one month, his teacher noticed the improvement."</p><div className="qa"><strong>Bilal S.</strong> — Parent, Islamabad</div></div>
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
        <a href="/championship" style={{display:'inline-block',background:'linear-gradient(135deg,#FFC300,#FF8E53)',border:'none',borderRadius:100,padding:'12px 28px',color:'#060B20',fontWeight:800,fontSize:14,cursor:'pointer',marginTop:12,fontFamily:'inherit',textDecoration:'none'}}>
          🏆 Refer Friends — Win Meta Ray-Ban + Free Months
        </a>
        <div className="flinks">
          <a href="/special-needs">Special Needs</a>
          <a href="/parent">Parents</a>
          <a href="/pricing">Pricing</a>
          <a href="/past-papers">Past Papers</a>
          <a href="/drill">Practice Drill</a>
          <a href="/textbooks">Textbooks</a>
          <a href="/homework">Homework Help</a>
          <a href="/arts">Arts</a>
          <a href="/music">Music</a>
          <a href="/reading">Reading</a>
          <a href="/arts-for-all">Arts for All</a>
          <a href="/music-for-all">Music for All</a>
          <a href="/reading-for-all">Reading for All</a>
          <a href="/ibcc">IBCC Calculator</a>
          <a href="/school">For Schools</a>
          <a href="/subscribe">Daily Questions</a>
          <a href="/leaderboard">Leaderboard</a>
          <a href="/dashboard">Teacher Dashboard</a>
        </div>
        <div style={{display:'flex',gap:16,justifyContent:'center',marginTop:8,flexWrap:'wrap'}}>
          <a href="/championship" style={{color:'rgba(255,195,0,0.5)',fontSize:12,textDecoration:'none',fontWeight:700}}>🏆 Refer & Win — Championship + Free Months</a>
          <a href="/privacy" style={{color:'rgba(255,255,255,0.3)',fontSize:12,textDecoration:'none'}}>Privacy Policy</a>
          <a href="/terms" style={{color:'rgba(255,255,255,0.3)',fontSize:12,textDecoration:'none'}}>Terms of Service</a>
        </div>
        <div className="fc2">© 2026 NewWorldEdu · khurram@newworld.education</div>
      </footer>
    </>
  );
}
