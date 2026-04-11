import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useTheme } from './_app';

/* ═══════════════════════════════════════
   DESIGN TOKENS — theme-aware
═══════════════════════════════════════ */
function getTokens(isDark) {
  const accent = {
    teal: '#4F8EF7', tealD: '#3B7DE8', tealM: '#6BA3F9',
    tealL: isDark ? 'rgba(79,142,247,0.12)' : 'rgba(79,142,247,0.1)',
    green: '#2BB55A', greenD: '#1D8C42',
    red: '#F87171', redD: '#DC2626',
    amber: '#F59E0B', amberD: '#D97706',
    purple: '#7C5CBF', purpleL: isDark ? 'rgba(124,92,191,0.12)' : '#EDE9FE',
  };
  if (isDark) {
    return {
      ...accent,
      n0: '#0D1221', n50: '#111827', n100: 'rgba(255,255,255,0.08)', n200: 'rgba(255,255,255,0.12)',
      n300: 'rgba(255,255,255,0.25)', n400: 'rgba(255,255,255,0.45)', n500: 'rgba(255,255,255,0.6)',
      n600: 'rgba(255,255,255,0.75)', n700: '#ffffff', n800: '#ffffff',
      f: "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    };
  }
  return {
    ...accent,
    n0: '#FFFFFF', n50: '#F5F7FA', n100: 'rgba(0,0,0,0.06)', n200: 'rgba(0,0,0,0.1)',
    n300: 'rgba(0,0,0,0.2)', n400: 'rgba(0,0,0,0.4)', n500: 'rgba(0,0,0,0.55)',
    n600: 'rgba(0,0,0,0.7)', n700: '#1a1a2e', n800: '#060B20',
    f: "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  };
}

/* ═══════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════ */
const AGE_OPTIONS = [
  { age: 5, emoji: '🌱', color: '#2BB55A', label: '5' },
  { age: 6, emoji: '⭐', color: '#FFC300', label: '6' },
  { age: 7, emoji: '🌈', color: '#FF8E53', label: '7' },
  { age: 8, emoji: '🚀', color: '#FF6B6B', label: '8' },
  { age: 9, emoji: '🔬', color: '#4F8EF7', label: '9' },
  { age: 10, emoji: '🌍', color: '#7C5CBF', label: '10' },
];

const AGE_TO_GRADE = { 5: 'kg', 6: 'grade1', 7: 'grade2', 8: 'grade3', 9: 'grade4', 10: 'grade5' };

const AVATARS = ['🦁', '🐱', '🐶', '🦋', '🌟', '🚀', '🎨', '🧸'];

/* ═══════════════════════════════════════
   MOTHER TONGUE / LANGUAGE SUPPORT
═══════════════════════════════════════ */
const RTL_LANGS = ['ur', 'sd', 'pa', 'ps', 'bal', 'skr'];

const LANG_BUTTONS = [
  { id: 'en', label: 'English' },
  { id: 'ur', label: 'اردو' },
  { id: 'sd', label: 'سنڌي' },
  { id: 'pa', label: 'پنجابی' },
  { id: 'ps', label: 'پښتو' },
  { id: 'bal', label: 'بلوچی' },
  { id: 'skr', label: 'سرائیکی' },
];

const KIDS_UI = {
  en: { hi: "Hi! I'm Starky!", ready: "Ready to learn? Let's go!", name: "What's your name?", age: "How old are you?", avatar: "Pick your look!", email: "What's your parent's email?", next: "Next →", start: "Start Learning! 🎉", skip: "Skip — I'll add it later", dashboard: "My Activities", chatStarky: "Chat with Starky", chatStarkySub: "Ask me anything!", phonics: "Phonics", phonicsSub: "Learn to read!", spellingBee: "Spelling Bee", spellingBeeSub: "Spell words & win!", languages: "Languages", languagesSub: "Learn French, Spanish & more!", homeworkHelp: "Homework Help", homeworkHelpSub: "Need help? I'm here!", practice: "Practice", practiceSub: "Fun quizzes & games!", artCraft: "Art & Craft", artCraftSub: "Draw, paint, create!", changeProfile: "Change my profile", yourFriend: "Your learning friend" },
  ur: { hi: "!ہیلو! میں Starky ہوں", ready: "!سیکھنے کے لیے تیار ہو? چلو", name: "تمہارا نام کیا ہے؟", age: "تم کتنے سال کے ہو؟", avatar: "!اپنا لک چنو", email: "والدین کی ای میل؟", next: "اگلا →", start: "!سیکھنا شروع کریں 🎉", skip: "بعد میں", dashboard: "میری سرگرمیاں", chatStarky: "Starky سے بات کرو", chatStarkySub: "!مجھ سے کچھ بھی پوچھو", phonics: "فونکس", phonicsSub: "!پڑھنا سیکھو", spellingBee: "سپیلنگ بی", spellingBeeSub: "!الفاظ بولو اور جیتو", languages: "زبانیں", languagesSub: "!فرینچ، سپینش اور بہت کچھ سیکھو", homeworkHelp: "ہوم ورک مدد", homeworkHelpSub: "!مدد چاہیے؟ میں حاضر ہوں", practice: "مشق", practiceSub: "!مزیدار کوئز اور گیمز", artCraft: "آرٹ اینڈ کرافٹ", artCraftSub: "!بناؤ، رنگ کرو، تخلیق کرو", changeProfile: "پروفائل بدلیں", yourFriend: "تمہارا سیکھنے والا دوست" },
  sd: { hi: "!هيلو! مان Starky آهيان", ready: "!سکڻ لاءِ تيار آهيو? هلو", name: "توهان جو نالو ڇا آهي؟", age: "توهان ڪيترن سالن جا آهيو؟", avatar: "!پنهنجو لک چونڊيو", email: "والدين جي اي ميل؟", next: "اڳيون →", start: "!سکڻ شروع ڪريو 🎉", skip: "بعد ۾", dashboard: "منهنجيون سرگرميون", chatStarky: "Starky سان ڳالهايو", chatStarkySub: "!مون کان ڪجهه به پڇو", spellingBee: "اسپيلنگ بي", spellingBeeSub: "!لفظ ٻڌايو ۽ کٽايو", languages: "ٻوليون", languagesSub: "!فرينچ، اسپيني ۽ وڌيڪ سکو", homeworkHelp: "هوم ورڪ مدد", homeworkHelpSub: "!مدد گهرجي؟ مان حاضر آهيان", practice: "مشق", practiceSub: "!مزيدار ڪوئز ۽ راند", artCraft: "آرٽ ۽ ڪرافٽ", artCraftSub: "!ٺاهيو، رنگ ڀريو، ڪجهه نئون ٺاهيو", changeProfile: "پروفائل بدلايو", yourFriend: "توهان جو سکيا وارو ساٿي" },
  pa: { hi: "!ہیلو! میں Starky ہاں", ready: "!سکھن لئی تیار او? چلو", name: "تہاڈا ناں کیا اے؟", age: "تسیں کنے سال دے او؟", avatar: "!اپنا لک چنو", email: "والدین دی ای میل؟", next: "اگلا →", start: "!سکھنا شروع کرو 🎉", skip: "بعد وچ", dashboard: "میریاں سرگرمیاں", chatStarky: "Starky نال گل کرو", chatStarkySub: "!مینوں کجھ وی پچھو", spellingBee: "سپیلنگ بی", spellingBeeSub: "!لفظ بولو تے جِتو", languages: "بولیاں", languagesSub: "!فرینچ، سپینش تے ہور سکھو", homeworkHelp: "ہوم ورک مدد", homeworkHelpSub: "!مدد چاہیدی؟ میں حاضر آں", practice: "مشق", practiceSub: "!مزیدار کوئز تے گیمز", artCraft: "آرٹ تے کرافٹ", artCraftSub: "!بناؤ، رنگ کرو، تخلیق کرو", changeProfile: "پروفائل بدلو", yourFriend: "تہاڈا سکھن والا یار" },
  ps: { hi: "!سلام! زه Starky یم", ready: "!زده کړې ته تیار یاست? راځئ", name: "ستاسو نوم څه دی؟", age: "تاسو څو کلن یاست؟", avatar: "!خپل لک وټاکئ", email: "د والدینو بریښنالیک؟", next: "بل →", start: "!زده کړه پیل کړئ 🎉", skip: "وروسته", dashboard: "زما فعالیتونه", chatStarky: "له Starky سره خبرې وکړئ", chatStarkySub: "!ما نه هر څه پوښتنه وکړئ", spellingBee: "سپیلنگ بی", spellingBeeSub: "!توری ووایاست او وګټئ", languages: "ژبې", languagesSub: "!فرانسوي، هسپانوي او نور زده کړئ", homeworkHelp: "د کورنیو دندو مرسته", homeworkHelpSub: "!مرستې ته اړتیا لرئ؟ زه دلته یم", practice: "تمرین", practiceSub: "!ساتیري کوئزونه او لوبې", artCraft: "آرټ او کرافټ", artCraftSub: "!جوړ کړئ، رنګ کړئ، پیدا کړئ", changeProfile: "پروفایل بدل کړئ", yourFriend: "ستاسو د زده کړې ملګری" },
  bal: { hi: "!سلام! من Starky اِن", ready: "!بوانت ءَ تیار ایت? بیاییت", name: "شمئی نام چیا اِنت؟", age: "شما چنت سال ایت؟", avatar: "!وتی لک چاگرد بکنیت", email: "والدین ئی ایمیل؟", next: "بعدی →", start: "!بوانت شروع بکنیت 🎉", skip: "بعد ءَ", dashboard: "منی سرگرمی", chatStarky: "Starky گون هبر بکنیت", chatStarkySub: "!من ءَ چیزے پرس بکنیت", spellingBee: "سپیلنگ بی", spellingBeeSub: "!لبز بگوشیت ءُ بباریت", languages: "زبان", languagesSub: "!فرینچ، سپینش ءُ گیشتر بوانیت", homeworkHelp: "هوم ورک کمک", homeworkHelpSub: "!کمک لوٹیت؟ من اِدا اِن", practice: "مشق", practiceSub: "!مزنین کوئز ءُ بازیگ", artCraft: "آرٹ ءُ کرافٹ", artCraftSub: "!جوڑ بکنیت، رنگ بکنیت، پیدا بکنیت", changeProfile: "پروفائل بدل بکنیت", yourFriend: "شمئی بوانتی یارے" },
  skr: { hi: "!ہیلو! میں Starky ہاں", ready: "!سکھن کیتے تیار او? چلو", name: "تھاڈا ناں کیا ہے؟", age: "تساں کنے سال دے او؟", avatar: "!اپنا لک چنو", email: "والدین دی ای میل؟", next: "اگلا →", start: "!سکھنا شروع کرو 🎉", skip: "بعد وچ", dashboard: "میریاں سرگرمیاں", chatStarky: "Starky نال گل کرو", chatStarkySub: "!میکوں کجھ وی پچھو", spellingBee: "سپیلنگ بی", spellingBeeSub: "!لفظ بولو تے جِتو", languages: "بولیاں", languagesSub: "!فرینچ، سپینش تے ہور سکھو", homeworkHelp: "ہوم ورک مدد", homeworkHelpSub: "!مدد چاہیدی؟ میں حاضر ہاں", practice: "مشق", practiceSub: "!مزیدار کوئز تے گیمز", artCraft: "آرٹ تے کرافٹ", artCraftSub: "!بناؤ، رنگ کرو، تخلیق کرو", changeProfile: "پروفائل بدلو", yourFriend: "تھاڈا سکھن والا یار" },
};

const DASHBOARD_CARDS = [
  { emoji: '⭐', key: 'chatStarky', subKey: 'chatStarkySub', bg: '#FFC300', action: 'starky' },
  { emoji: '📖', key: 'phonics', subKey: 'phonicsSub', bg: '#63D2FF', href: '/phonics' },
  { emoji: '🐝', key: 'spellingBee', subKey: 'spellingBeeSub', bg: '#FF8E53', href: '/spelling-bee' },
  { emoji: '🌍', key: 'languages', subKey: 'languagesSub', bg: '#4ECDC4', href: '/languages' },
  { emoji: '📝', key: 'homeworkHelp', subKey: 'homeworkHelpSub', bg: '#63D2FF', href: '/homework' },
  { emoji: '🎯', key: 'practice', subKey: 'practiceSub', bg: '#A8E063', href: '/homework' },
  { emoji: '🎨', key: 'artCraft', subKey: 'artCraftSub', bg: '#FF6B6B', href: '/arts' },
];

/* ═══════════════════════════════════════
   SOUND EFFECTS — Web Audio API
═══════════════════════════════════════ */
function sndTick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(880, ctx.currentTime);
    g.gain.setValueAtTime(0.1, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.1);
  } catch (e) {}
}

function sndWin() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      g.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.12);
      o.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
  } catch (e) {}
}

/* ═══════════════════════════════════════
   CONFETTI
═══════════════════════════════════════ */
function launchConfetti(containerRef) {
  if (!containerRef.current) return;
  const colors = ['#FFC300', '#FF6B6B', '#4F8EF7', '#2BB55A', '#FF8E53', '#7C5CBF', '#A8E063', '#4ECDC4'];
  for (let i = 0; i < 50; i++) {
    const el = document.createElement('div');
    const size = Math.random() * 8 + 4;
    el.style.cssText = `
      position:fixed;top:${Math.random()*30}%;left:${Math.random()*100}%;
      width:${size}px;height:${size}px;border-radius:${Math.random()>0.5?'50%':'2px'};
      background:${colors[Math.floor(Math.random()*colors.length)]};
      pointer-events:none;z-index:9999;
      animation:confettiFall ${1.5+Math.random()*2}s ease-out forwards;
      animation-delay:${Math.random()*0.4}s;opacity:0;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function KidsZone() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const t = getTokens(isDark);
  const containerRef = useRef(null);

  // Screens: 'welcome' | 'register' | 'dashboard'
  const [screen, setScreen] = useState('welcome');
  const [regStep, setRegStep] = useState(1);
  const [mounted, setMounted] = useState(false);

  // Mother tongue / language
  const [lang, setLang] = useState('en');
  const ui = KIDS_UI[lang] || KIDS_UI.en;
  const isRtl = RTL_LANGS.includes(lang);
  const rtlStyle = isRtl ? { direction: 'rtl', textAlign: 'right' } : {};

  // Registration data
  const [name, setName] = useState('');
  const [age, setAge] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [parentEmail, setParentEmail] = useState('');

  // Stored user
  const [user, setUser] = useState(null);

  // Helper to change language and persist
  function changeLang(code) {
    setLang(code);
    try { localStorage.setItem('nw_kids_language', code); } catch (e) {}
  }

  // Check for existing kid user on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = JSON.parse(localStorage.getItem('nw_user'));
      if (stored && stored.isKid) {
        setUser(stored);
        setScreen('dashboard');
        if (stored.language) setLang(stored.language);
      }
    } catch (e) {}
    // Also read standalone language preference
    try {
      const savedLang = localStorage.getItem('nw_kids_language');
      if (savedLang && KIDS_UI[savedLang]) setLang(savedLang);
    } catch (e) {}
  }, []);

  // Complete registration
  function completeRegistration(skipEmail) {
    const gradeId = AGE_TO_GRADE[age] || 'grade1';
    const userData = {
      name,
      age,
      grade: gradeId,
      gradeId,
      avatar,
      email: skipEmail ? '' : parentEmail,
      parentEmail: skipEmail ? '' : parentEmail,
      language: lang,
      isKid: true,
      registeredAt: new Date().toISOString(),
    };
    localStorage.setItem('nw_user', JSON.stringify(userData));
    setUser(userData);
    sndWin();
    launchConfetti(containerRef);
    setTimeout(() => setScreen('dashboard'), 800);
  }

  // Reset profile
  function resetProfile() {
    localStorage.removeItem('nw_user');
    setUser(null);
    setName('');
    setAge(null);
    setAvatar(null);
    setRegStep(1);
    setScreen('welcome');
  }

  // Read XP
  const [xp, setXp] = useState(0);
  useEffect(() => {
    try {
      const hwXp = parseInt(localStorage.getItem('nw_homework_xp') || '0', 10);
      const spRaw = localStorage.getItem('nw_spelling_progress');
      let spXp = 0;
      if (spRaw) {
        const sp = JSON.parse(spRaw);
        spXp = (sp.totalCorrect || 0) * 10;
      }
      setXp(hwXp + spXp);
    } catch (e) {}
  }, [screen]);

  const wrap = {
    minHeight: 'calc(100vh - 52px)',
    background: isDark
      ? 'linear-gradient(180deg, #0D1221 0%, #1a1035 100%)'
      : 'linear-gradient(180deg, #FFF8E7 0%, #FFE8F0 50%, #E8F4FD 100%)',
    fontFamily: t.f,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 16px',
    overflow: 'hidden',
  };

  const inner = {
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 40,
  };

  if (!mounted) return <div style={wrap} />;

  /* ─── WELCOME SCREEN ─── */
  if (screen === 'welcome') {
    return (
      <>
        <Head>
          <title>Kids Zone — NewWorldEdu ★</title>
          <meta name="description" content="Fun learning for kids aged 5-10. Spelling Bee, Languages, Homework Help, and more with Starky your learning star!" />
        </Head>
        <style jsx global>{`
          @keyframes starBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
          @keyframes btnBounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
          @keyframes confettiFall { 0%{opacity:1;transform:translateY(0) rotate(0deg)} 100%{opacity:0;transform:translateY(100vh) rotate(720deg)} }
        `}</style>
        <div style={wrap} ref={containerRef}>
          <div style={{...inner, justifyContent:'center', minHeight:'calc(100vh - 52px)', paddingTop:0}}>
            <div style={{
              fontSize: 100,
              animation: 'starBounce 2s ease-in-out infinite',
              marginBottom: 16,
              lineHeight: 1,
              textShadow: '0 4px 24px rgba(255,195,0,0.4)',
            }}>★</div>
            <div style={{
              fontSize: 28,
              fontWeight: 800,
              color: t.n800,
              marginBottom: 8,
              textAlign: 'center',
              ...rtlStyle,
            }}>{ui.hi}</div>
            <div style={{
              fontSize: 16,
              color: t.n500,
              marginBottom: 24,
              textAlign: 'center',
              ...rtlStyle,
            }}>{ui.yourFriend}</div>

            {/* ── Mother tongue selector ── */}
            <div style={{ textAlign: 'center', marginBottom: 24, width: '100%', maxWidth: 360 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.n500, marginBottom: 10 }}>
                Your language / آپ کی زبان
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                {LANG_BUTTONS.map(lb => (
                  <button
                    key={lb.id}
                    onClick={() => { sndTick(); changeLang(lb.id); }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 12,
                      border: lang === lb.id ? '3px solid #FFC300' : `2px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
                      background: lang === lb.id ? (isDark ? 'rgba(255,195,0,0.15)' : 'rgba(255,195,0,0.12)') : (isDark ? 'rgba(255,255,255,0.06)' : '#fff'),
                      color: lang === lb.id ? '#D97706' : t.n700,
                      fontSize: 14,
                      fontWeight: 700,
                      fontFamily: t.f,
                      cursor: 'pointer',
                      direction: RTL_LANGS.includes(lb.id) ? 'rtl' : 'ltr',
                      transition: 'all 0.15s',
                    }}
                  >{lb.label}</button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { sndTick(); setScreen('register'); setRegStep(1); }}
              style={{
                display: 'block',
                width: '100%',
                maxWidth: 320,
                height: 80,
                background: 'linear-gradient(135deg, #FFC300, #FF8E53)',
                color: '#060B20',
                border: 'none',
                borderRadius: 20,
                fontSize: 22,
                fontWeight: 800,
                fontFamily: t.f,
                cursor: 'pointer',
                animation: 'btnBounce 2s ease-in-out infinite',
                boxShadow: '0 8px 32px rgba(255,195,0,0.3)',
                ...rtlStyle,
              }}
            >
              {ui.ready}</button>
          </div>
        </div>
      </>
    );
  }

  /* ─── REGISTRATION SCREEN ─── */
  if (screen === 'register') {
    return (
      <>
        <Head>
          <title>Kids Zone — NewWorldEdu ★</title>
          <meta name="description" content="Fun learning for kids aged 5-10. Spelling Bee, Languages, Homework Help, and more with Starky your learning star!" />
        </Head>
        <style jsx global>{`
          @keyframes popIn { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
          @keyframes confettiFall { 0%{opacity:1;transform:translateY(0) rotate(0deg)} 100%{opacity:0;transform:translateY(100vh) rotate(720deg)} }
        `}</style>
        <div style={wrap} ref={containerRef}>
          <div style={inner}>
            {/* Progress dots */}
            <div style={{display:'flex',gap:8,marginBottom:32}}>
              {[1,2,3,4].map(s => (
                <div key={s} style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: s <= regStep ? '#FFC300' : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'),
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>

            {/* Step 1: Name */}
            {regStep === 1 && (
              <div style={{textAlign:'center',width:'100%'}}>
                <div style={{fontSize:32,marginBottom:8}}>😊</div>
                <div style={{fontSize:24,fontWeight:800,color:t.n800,marginBottom:24,...rtlStyle}}>{ui.name}</div>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Type your name here..."
                  autoFocus
                  style={{
                    width: '100%',
                    maxWidth: 320,
                    fontSize: 24,
                    fontWeight: 600,
                    fontFamily: t.f,
                    textAlign: 'center',
                    padding: '16px 20px',
                    border: `3px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
                    borderRadius: 16,
                    background: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
                    color: t.n800,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#FFC300'; setTimeout(() => e.target.scrollIntoView({ behavior:'smooth', block:'center' }), 300); }}
                  onBlur={e => e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}
                  onKeyDown={e => { if (e.key === 'Enter' && name.trim().length >= 2) { sndTick(); setRegStep(2); } }}
                />
                <button
                  onClick={() => { sndTick(); setRegStep(2); }}
                  disabled={name.trim().length < 2}
                  style={{
                    display: 'block',
                    width: '100%',
                    maxWidth: 320,
                    margin: '24px auto 0',
                    marginBottom: 120,
                    height: 64,
                    background: name.trim().length >= 2 ? 'linear-gradient(135deg, #4F8EF7, #7C5CBF)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'),
                    color: name.trim().length >= 2 ? '#fff' : t.n400,
                    border: 'none',
                    borderRadius: 16,
                    fontSize: 20,
                    fontWeight: 700,
                    fontFamily: t.f,
                    cursor: name.trim().length >= 2 ? 'pointer' : 'default',
                  }}
                >
                  {ui.next}
                </button>
              </div>
            )}

            {/* Step 2: Age */}
            {regStep === 2 && (
              <div style={{textAlign:'center',width:'100%'}}>
                <div style={{fontSize:32,marginBottom:8}}>🎂</div>
                <div style={{fontSize:24,fontWeight:800,color:t.n800,marginBottom:24,...rtlStyle}}>{ui.age}</div>
                <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:16,maxWidth:320,margin:'0 auto'}}>
                  {AGE_OPTIONS.map((opt, i) => (
                    <button
                      key={opt.age}
                      onClick={() => { sndTick(); setAge(opt.age); setTimeout(() => setRegStep(3), 300); }}
                      style={{
                        width: 80, height: 80,
                        borderRadius: '50%',
                        border: age === opt.age ? `4px solid ${opt.color}` : '4px solid transparent',
                        background: isDark ? `${opt.color}22` : `${opt.color}20`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontFamily: t.f,
                        animation: `popIn 0.4s ease-out ${i * 0.08}s both`,
                        transition: 'transform 0.15s',
                      }}
                      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
                      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                      onTouchStart={e => e.currentTarget.style.transform = 'scale(0.9)'}
                      onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <span style={{fontSize:20,lineHeight:1}}>{opt.emoji}</span>
                      <span style={{fontSize:18,fontWeight:800,color:opt.color,marginTop:2}}>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Avatar */}
            {regStep === 3 && (
              <div style={{textAlign:'center',width:'100%'}}>
                <div style={{fontSize:32,marginBottom:8}}>🎭</div>
                <div style={{fontSize:24,fontWeight:800,color:t.n800,marginBottom:24,...rtlStyle}}>{ui.avatar}</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,maxWidth:340,margin:'0 auto'}}>
                  {AVATARS.map((av, i) => (
                    <button
                      key={av}
                      onClick={() => { sndTick(); setAvatar(av); setTimeout(() => setRegStep(4), 300); }}
                      style={{
                        width: 70, height: 70,
                        borderRadius: 16,
                        border: avatar === av ? '4px solid #FFC300' : `3px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                        background: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 36,
                        cursor: 'pointer',
                        animation: `popIn 0.4s ease-out ${i * 0.06}s both`,
                        transition: 'transform 0.15s',
                      }}
                      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
                      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                      onTouchStart={e => e.currentTarget.style.transform = 'scale(0.9)'}
                      onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Parent Email */}
            {regStep === 4 && (
              <div style={{textAlign:'center',width:'100%'}}>
                <div style={{fontSize:32,marginBottom:8}}>📧</div>
                <div style={{fontSize:24,fontWeight:800,color:t.n800,marginBottom:8,...rtlStyle}}>{ui.email}</div>
                <div style={{fontSize:14,color:t.n500,marginBottom:24}}>So we can send them your learning report!</div>
                <input
                  type="email"
                  value={parentEmail}
                  onChange={e => setParentEmail(e.target.value.trim())}
                  placeholder="parent@email.com"
                  autoFocus
                  style={{
                    width: '100%',
                    maxWidth: 320,
                    fontSize: 20,
                    fontWeight: 600,
                    fontFamily: t.f,
                    textAlign: 'center',
                    padding: '16px 20px',
                    border: `3px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
                    borderRadius: 16,
                    background: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
                    color: t.n800,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#FFC300'; setTimeout(() => e.target.scrollIntoView({ behavior:'smooth', block:'center' }), 300); }}
                  onBlur={e => e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}
                  inputMode="email"
                />
                <button
                  onClick={() => completeRegistration(false)}
                  disabled={!parentEmail.includes('@')}
                  style={{
                    display: 'block',
                    width: '100%',
                    maxWidth: 320,
                    margin: '24px auto 0',
                    height: 64,
                    background: parentEmail.includes('@') ? 'linear-gradient(135deg, #FFC300, #FF8E53)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'),
                    color: parentEmail.includes('@') ? '#060B20' : t.n400,
                    border: 'none',
                    borderRadius: 16,
                    fontSize: 20,
                    fontWeight: 800,
                    fontFamily: t.f,
                    cursor: parentEmail.includes('@') ? 'pointer' : 'default',
                    boxShadow: parentEmail.includes('@') ? '0 6px 24px rgba(255,195,0,0.3)' : 'none',
                  }}
                >
                  {ui.start}
                </button>
                <button
                  onClick={() => completeRegistration(true)}
                  style={{
                    display: 'block',
                    margin: '16px auto 0',
                    background: 'none',
                    border: 'none',
                    color: t.n400,
                    fontSize: 14,
                    fontFamily: t.f,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    ...rtlStyle,
                  }}
                >
                  {ui.skip}
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  /* ─── DASHBOARD SCREEN ─── */
  if (screen === 'dashboard') {
    const u = user || {};
    return (
      <>
        <Head>
          <title>Kids Zone — NewWorldEdu ★</title>
          <meta name="description" content="Fun learning for kids aged 5-10. Spelling Bee, Languages, Homework Help, and more with Starky your learning star!" />
        </Head>
        <style jsx global>{`
          @keyframes slideUp { 0%{transform:translateY(30px);opacity:0} 100%{transform:translateY(0);opacity:1} }
          @keyframes confettiFall { 0%{opacity:1;transform:translateY(0) rotate(0deg)} 100%{opacity:0;transform:translateY(100vh) rotate(720deg)} }
        `}</style>
        <div style={wrap} ref={containerRef}>
          <div style={inner}>
            {/* Greeting */}
            <div style={{
              textAlign: 'center',
              marginBottom: 24,
              animation: 'slideUp 0.5s ease-out both',
            }}>
              <div style={{fontSize:48,lineHeight:1,marginBottom:4}}>{u.avatar || '⭐'}</div>
              <h1 style={{fontSize:22,fontWeight:800,color:t.n800,margin:0}}>Hi {u.name || 'Friend'}! 👋</h1>
              {xp > 0 && (
                <div style={{
                  display: 'inline-block',
                  marginTop: 8,
                  padding: '4px 14px',
                  background: isDark ? 'rgba(255,195,0,0.15)' : 'rgba(255,195,0,0.2)',
                  borderRadius: 50,
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#D97706',
                }}>⭐ {xp} XP</div>
              )}
            </div>

            {/* Activity Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 14,
              width: '100%',
              marginBottom: 24,
            }}>
              {DASHBOARD_CARDS.map((card, i) => (
                <a
                  key={card.title}
                  href={card.href || '#'}
                  onClick={e => {
                    sndTick();
                    if (card.action === 'starky') {
                      e.preventDefault();
                      window.location.href = '/demo';
                    }
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 120,
                    background: isDark ? `${card.bg}18` : `${card.bg}20`,
                    border: `2px solid ${isDark ? `${card.bg}30` : `${card.bg}40`}`,
                    borderRadius: 20,
                    padding: '16px 12px',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.12s',
                    animation: `slideUp 0.4s ease-out ${i * 0.08}s both`,
                  }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  onTouchStart={e => e.currentTarget.style.transform = 'scale(0.95)'}
                  onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span style={{fontSize:40,lineHeight:1,marginBottom:8}}>{card.emoji}</span>
                  <span style={{fontSize:18,fontWeight:700,color:t.n800,textAlign:'center',...rtlStyle}}>{ui[card.key] || card.key}</span>
                  <span style={{fontSize:12,color:t.n500,marginTop:4,textAlign:'center',...rtlStyle}}>{ui[card.subKey] || card.subKey}</span>
                </a>
              ))}
            </div>

            {/* Change profile link */}
            <button
              onClick={resetProfile}
              style={{
                background: 'none',
                border: 'none',
                color: t.n400,
                fontSize: 13,
                fontFamily: t.f,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {ui.changeProfile}
            </button>
          </div>
        </div>
      </>
    );
  }

  return null;
}
