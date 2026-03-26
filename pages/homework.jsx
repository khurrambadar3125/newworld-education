import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useSessionLimit, SessionLimitBanner, LimitReachedModal } from "../utils/useSessionLimit";

const GRADES = [
  { id: "kg",  label: "Nursery / KG", age: "3–5",  emoji: "🌱", color: "#FFB347" },
  { id: "g1",  label: "Grade 1",      age: "5–6",  emoji: "⭐", color: "#FF6B6B" },
  { id: "g2",  label: "Grade 2",      age: "6–7",  emoji: "🌈", color: "#FF8E53" },
  { id: "g3",  label: "Grade 3",      age: "7–8",  emoji: "🚀", color: "#FFC300" },
  { id: "g4",  label: "Grade 4",      age: "8–9",  emoji: "🔬", color: "#A8E063" },
  { id: "g5",  label: "Grade 5",      age: "9–10", emoji: "🌍", color: "#4ECDC4" },
  { id: "g6",  label: "Grade 6",      age: "10–11",emoji: "🏆", color: "#63D2FF" },
];

const SUBJECTS = [
  { id: "maths",    label: "➕ Maths",             color: "#FF6B6B" },
  { id: "english",  label: "📖 English",            color: "#63D2FF" },
  { id: "urdu",     label: "اردو Urdu",             color: "#FFC300" },
  { id: "science",  label: "🔬 Science",            color: "#A8E063" },
  { id: "islamiat", label: "☪️ Islamiat",           color: "#4ECDC4" },
  { id: "quran",    label: "📖 Nazra Quran",        color: "#2BB55A" },
  { id: "gk",       label: "🌍 General Knowledge",  color: "#C77DFF" },
  { id: "socialst", label: "🏛️ Social Studies",     color: "#4F8EF7" },
  { id: "sindhi",   label: "سنڌي Sindhi",           color: "#F59E0B" },
  { id: "pashto",   label: "پښتو Pashto",           color: "#F97316" },
  { id: "craft",    label: "🎨 Art & Craft",        color: "#FF8E53" },
  { id: "other",    label: "📚 Other",              color: "#888" },
];

const CRAFT_IDEAS = [
  {
    title: "Paper Butterfly",
    age: "3+", time: "15 min",
    materials: ["Coloured paper", "Scissors", "Glue stick", "Pencil"],
    steps: [
      "Fold a piece of coloured paper in half lengthwise.",
      "Draw half a butterfly wing shape along the fold — it should look like a hill or bump.",
      "Cut along your drawn line — keeping the fold intact.",
      "Unfold to reveal a full butterfly wing shape!",
      "Decorate both wings with circles, dots, and swirls.",
      "Pinch the middle and glue or twist a pipe cleaner as the body.",
      "Add two small antennae curled at the top.",
    ],
    emoji: "🦋",
  },
  {
    title: "Mini Solar System",
    age: "5+", time: "30 min",
    materials: ["Black card", "White chalk or crayon", "Coloured paints", "Cotton wool", "Glue"],
    steps: [
      "Lay out black card as your space background.",
      "Draw a large yellow circle on one side — that's the Sun!",
      "Draw 8 small circles in a curved line moving away from the Sun.",
      "Paint each planet a different colour: Mercury (grey), Venus (yellow), Earth (blue/green), Mars (red)...",
      "Add Saturn's rings by drawing an oval around it.",
      "Dab tiny dots of white chalk for stars all over the background.",
      "Label each planet and write one fun fact next to it.",
    ],
    emoji: "🪐",
  },
  {
    title: "My Feelings Jar",
    age: "4+", time: "20 min",
    materials: ["Empty jam jar", "Coloured tissue paper", "White glue + water", "Paintbrush", "Small paper strips"],
    steps: [
      "Mix equal parts white glue and water in a cup.",
      "Tear coloured tissue paper into small pieces.",
      "Brush the glue mixture onto the jar, then layer on tissue paper.",
      "Cover the whole jar with overlapping colours — beautiful!",
      "Let it dry completely (about 30 minutes).",
      "Write emotions on small paper strips: happy, excited, worried, proud...",
      "Fold them up and put them inside — use the jar to talk about feelings!",
    ],
    emoji: "🫙",
  },
  {
    title: "Leaf Print Art",
    age: "3+", time: "20 min",
    materials: ["Leaves from the garden", "Washable paints", "White paper", "Paintbrush"],
    steps: [
      "Collect 5–6 leaves of different shapes and sizes from outside.",
      "Lay each leaf flat with the bumpy (veined) side facing UP.",
      "Use a paintbrush to cover the leaf surface with paint.",
      "Press the painted side firmly onto white paper.",
      "Carefully peel back the leaf to reveal the print!",
      "Repeat with different colours and leaf shapes.",
      "Let it dry, then label each leaf with its tree name.",
    ],
    emoji: "🍂",
  },
];

const MODE_PARENT = "parent";
const MODE_CHILD  = "child";

/* ═══════════════════════════════════════
   MOTHER TONGUE / LANGUAGE SUPPORT
═══════════════════════════════════════ */
const HW_RTL_LANGS = ['ur', 'sd', 'pa', 'ps', 'bal', 'skr'];

const GRADE_UR = { kg: 'نرسری', g1: 'پہلی', g2: 'دوسری', g3: 'تیسری', g4: 'چوتھی', g5: 'پانچویں', g6: 'چھٹی' };
const SUBJECT_UR = { maths: 'ریاضی', english: 'انگریزی', science: 'سائنس', urdu: 'اردو', islamiat: 'اسلامیات', quran: 'ناظرہ قرآن', gk: 'جنرل نالج', socialst: 'معاشرتی علوم', sindhi: 'سنڌي', pashto: 'پښتو', craft: 'آرٹ', other: 'دیگر' };

const HOMEWORK_UI = {
  en: { funZone: 'Fun Practice Zone', funZoneSub: 'Tap to play — no typing needed!', keepPlaying: 'Keep playing!', countingGame: 'Counting Game', countingGameDesc: 'Tap the right answer!', spellingBee: 'Spelling Bee', spellingBeeDesc: 'Pick the correct spelling!', trueOrFalse: 'True or False', trueOrFalseDesc: 'Is this fact true?', matchIt: 'Match It', matchItDesc: 'Match the pairs!', amazing: 'AMAZING! ⭐🎉', almostTry: 'Almost! Try again next time! 💪', correct: 'Correct!', notQuite: 'Not quite — try again! 💪', howMany: 'HOW MANY DO YOU SEE?', pickSpelling: 'PICK THE CORRECT SPELLING', tapMatch: 'TAP TO MATCH THE PAIRS', finished: 'You finished all', exercises: 'exercises!', score: 'Score', outOf: 'out of', correctWord: 'correct', xpEarned: 'XP earned', total: 'Total', tryAnother: 'Try Another Subject', askStarky: 'Ask Starky for Help', back: '← Back', trueWord: 'TRUE', falseWord: 'FALSE', answerWas: 'Almost! The answer was' },
  ur: { funZone: 'مزیدار مشق زون', funZoneSub: 'کھیلنے کے لیے ٹیپ کریں — ٹائپنگ نہیں!', keepPlaying: '!کھیلتے رہو', countingGame: 'گنتی کا کھیل', countingGameDesc: '!صحیح جواب ٹیپ کرو', spellingBee: 'سپیلنگ بی', spellingBeeDesc: '!صحیح اسپیلنگ چنو', trueOrFalse: 'سچ یا جھوٹ', trueOrFalseDesc: '!کیا یہ بات سچ ہے؟', matchIt: 'ملاؤ', matchItDesc: '!جوڑے ملاؤ', amazing: '!شاندار ⭐🎉', almostTry: '!قریب تھے! اگلی بار پھر کوشش کرو 💪', correct: '!صحیح', notQuite: '!بالکل نہیں — دوبارہ کوشش کرو 💪', howMany: 'کتنے نظر آتے ہیں؟', pickSpelling: 'صحیح اسپیلنگ چنیں', tapMatch: 'جوڑے ملانے کے لیے ٹیپ کریں', finished: 'آپ نے سب', exercises: 'مشقیں مکمل کیں!', score: 'سکور', outOf: 'میں سے', correctWord: 'صحیح', xpEarned: 'حاصل کیے XP', total: 'کل', tryAnother: 'دوسرا مضمون آزمائیں', askStarky: 'Starky سے مدد لیں', back: 'واپس ←', trueWord: 'سچ', falseWord: 'جھوٹ', answerWas: '!قریب تھے! جواب تھا' },
  sd: { funZone: 'مزيدار مشق زون', funZoneSub: 'کيڏڻ لاءِ ٽيپ ڪريو — ٽائپنگ ناهي!', keepPlaying: '!کيڏيندا رهو', countingGame: 'ڳڻتي جي راند', countingGameDesc: '!صحيح جواب ٽيپ ڪريو', spellingBee: 'اسپيلنگ بي', spellingBeeDesc: '!صحيح اسپيلنگ چونڊيو', trueOrFalse: 'سچ يا ڪُوڙ', trueOrFalseDesc: '!ڇا هي ڳالهه سچ آهي؟', matchIt: 'ملايو', matchItDesc: '!جوڙا ملايو', amazing: '!شاندار ⭐🎉', almostTry: '!ويجهو هئا! اڳئين ڀيرو ڪوشش ڪريو 💪', correct: '!صحيح', notQuite: '!ان هيءَ نه — وري ڪوشش ڪريو 💪', howMany: 'ڪيترا نظر اچن ٿا؟', pickSpelling: 'صحيح اسپيلنگ چونڊيو', tapMatch: 'جوڙا ملائڻ لاءِ ٽيپ ڪريو', finished: 'توهان سڀ', exercises: 'مشقون مڪمل ڪيون!', score: 'سکور', outOf: 'مان', correctWord: 'صحيح', xpEarned: 'حاصل ٿيا XP', total: 'ڪل', tryAnother: 'ٻيو مضمون آزمايو', askStarky: 'Starky کان مدد وٺو', back: 'واپس ←', trueWord: 'سچ', falseWord: 'ڪوڙ', answerWas: '!ويجهو هئا! جواب هو' },
  pa: { funZone: 'مزیدار مشق زون', funZoneSub: 'کھیڈن لئی ٹیپ کرو — ٹائپنگ نہیں!', keepPlaying: '!کھیڈدے رہو', countingGame: 'گنتی دی کھیڈ', countingGameDesc: '!صحیح جواب ٹیپ کرو', spellingBee: 'سپیلنگ بی', spellingBeeDesc: '!صحیح اسپیلنگ چنو', trueOrFalse: 'سچ یا جھوٹ', trueOrFalseDesc: '!کیا ایہ گل سچ اے؟', matchIt: 'ملاؤ', matchItDesc: '!جوڑے ملاؤ', amazing: '!شاندار ⭐🎉', almostTry: '!نیڑے سی! اگلی واری فیر کوشش کرو 💪', correct: '!صحیح', notQuite: '!بالکل نئیں — فیر کوشش کرو 💪', howMany: 'کنے نظر آندے نے؟', pickSpelling: 'صحیح اسپیلنگ چنو', tapMatch: 'جوڑے ملان لئی ٹیپ کرو', finished: 'تسیں سب', exercises: 'مشقاں مکمل کیتیاں!', score: 'سکور', outOf: 'وچوں', correctWord: 'صحیح', xpEarned: 'حاصل کیتے XP', total: 'کل', tryAnother: 'ہور مضمون آزماؤ', askStarky: 'Starky توں مدد لو', back: 'واپس ←', trueWord: 'سچ', falseWord: 'جھوٹ', answerWas: '!نیڑے سی! جواب سی' },
  ps: { funZone: 'ساتیری تمرین زون', funZoneSub: 'د لوبې لپاره ټیپ کړئ — ټایپنگ نشته!', keepPlaying: '!لوبې ته دوام ورکړئ', countingGame: 'د شمیرنې لوبه', countingGameDesc: '!سم ځواب ټیپ کړئ', spellingBee: 'سپیلنگ بی', spellingBeeDesc: '!سمه سپیلنگ وټاکئ', trueOrFalse: 'ریښتیا یا دروغ', trueOrFalseDesc: '!ایا دا خبره ریښتیا ده؟', matchIt: 'سره یو ځای کړئ', matchItDesc: '!جوړه سره ملاوئ', amazing: '!حیرانونکی ⭐🎉', almostTry: '!نږدې وو! بل ځل بیا هڅه وکړئ 💪', correct: '!سم', notQuite: '!نه بالکل — بیا هڅه وکړئ 💪', howMany: 'څومره ګورئ؟', pickSpelling: 'سمه سپیلنگ وټاکئ', tapMatch: 'د جوړو لپاره ټیپ کړئ', finished: 'تاسو ټول', exercises: 'تمرینونه بشپړ کړل!', score: 'سکور', outOf: 'له', correctWord: 'سم', xpEarned: 'ترلاسه شوي XP', total: 'ټول', tryAnother: 'بل مضمون هڅه وکړئ', askStarky: 'له Starky مرسته وغواړئ', back: 'شاته ←', trueWord: 'ریښتیا', falseWord: 'دروغ', answerWas: '!نږدې وو! ځواب وو' },
  bal: { funZone: 'مزنین مشق زون', funZoneSub: 'بازیگ ءَ ٹیپ بکنیت — ٹائپنگ نیست!', keepPlaying: '!بازیگ ءَ دیم بدئیت', countingGame: 'شمارگ ئی بازیگ', countingGameDesc: '!راست جواب ٹیپ بکنیت', spellingBee: 'سپیلنگ بی', spellingBeeDesc: '!راست اسپیلنگ چاگرد بکنیت', trueOrFalse: 'راست یا غلط', trueOrFalseDesc: '!اے هبر راست اِنت؟', matchIt: 'ملّ بکنیت', matchItDesc: '!جوڑ ملّ بکنیت', amazing: '!ببرکت ⭐🎉', almostTry: '!نزّیک اَت! آئیندگ ءَ دگه کوشش بکنیت 💪', correct: '!راست', notQuite: '!نه — دگه کوشش بکنیت 💪', howMany: 'چنت دیست کنیت؟', pickSpelling: 'راست اسپیلنگ چاگرد بکنیت', tapMatch: 'جوڑ ملائتن ءَ ٹیپ بکنیت', finished: 'شما سجّ', exercises: 'مشق سر بوتنت!', score: 'سکور', outOf: 'ءَ', correctWord: 'راست', xpEarned: 'داتگین XP', total: 'ٹوٹل', tryAnother: 'دگه مضمون آزمائش بکنیت', askStarky: 'Starky ءَ کمک بلوٹیت', back: 'پدا ←', trueWord: 'راست', falseWord: 'غلط', answerWas: '!نزّیک اَت! جواب اَت' },
  skr: { funZone: 'مزیدار مشق زون', funZoneSub: 'کھیڈن کیتے ٹیپ کرو — ٹائپنگ نہیں!', keepPlaying: '!کھیڈدے رہو', countingGame: 'گنتی دی کھیڈ', countingGameDesc: '!صحیح جواب ٹیپ کرو', spellingBee: 'سپیلنگ بی', spellingBeeDesc: '!صحیح اسپیلنگ چنو', trueOrFalse: 'سچ یا جھوٹ', trueOrFalseDesc: '!کیا ایہ گل سچ ہے؟', matchIt: 'ملاؤ', matchItDesc: '!جوڑے ملاؤ', amazing: '!شاندار ⭐🎉', almostTry: '!نیڑے ہئے! اگلی واری فیر کوشش کرو 💪', correct: '!صحیح', notQuite: '!بالکل نئیں — فیر کوشش کرو 💪', howMany: 'کنے نظر آندے ہن؟', pickSpelling: 'صحیح اسپیلنگ چنو', tapMatch: 'جوڑے ملان کیتے ٹیپ کرو', finished: 'تساں سب', exercises: 'مشقاں مکمل کیتیاں!', score: 'سکور', outOf: 'وچوں', correctWord: 'صحیح', xpEarned: 'حاصل کیتے XP', total: 'کل', tryAnother: 'ہور مضمون آزماؤ', askStarky: 'Starky کنوں مدد لو', back: 'واپس ←', trueWord: 'سچ', falseWord: 'جھوٹ', answerWas: '!نیڑے ہئے! جواب ہئے' },
};

function getKidsLang() {
  if (typeof window === 'undefined') return 'en';
  try {
    const savedLang = localStorage.getItem('nw_kids_language');
    if (savedLang && HOMEWORK_UI[savedLang]) return savedLang;
    const user = JSON.parse(localStorage.getItem('nw_user'));
    if (user && user.language && HOMEWORK_UI[user.language]) return user.language;
  } catch (e) {}
  return 'en';
}

/* ═══ AUDIO ENGINE ═══ */
let _audioCtx=null;
function getAudioCtx(){if(typeof window==='undefined')return null;if(!_audioCtx)try{_audioCtx=new(window.AudioContext||window.webkitAudioContext)()}catch{}return _audioCtx}
function playTone(f,type,vol,dur,delay){const c=getAudioCtx();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type=type||'sine';o.frequency.value=f;const t=c.currentTime+(delay||0);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol||0.2,t+0.02);g.gain.exponentialRampToValueAtTime(0.001,t+dur);o.start(t);o.stop(t+dur+0.05)}
function sndOk(){playTone(523,'sine',0.22,0.32);playTone(659,'sine',0.22,0.32,0.16)}
function sndErr(){playTone(220,'sawtooth',0.15,0.25)}
function sndWin(){playTone(523,'sine',0.25,0.5);playTone(659,'sine',0.25,0.45,0.15);playTone(784,'sine',0.25,0.45,0.3)}
function sndTick(){playTone(900,'sine',0.06,0.07)}

/* ═══ FUN ZONE EXERCISE DATA ═══ */
const FUN_EXERCISES = {
  maths: {
    kg: [
      { type:'count', emoji:'🍎', items:3, options:[2,3,4,5] },
      { type:'count', emoji:'⭐', items:5, options:[3,4,5,6] },
      { type:'count', emoji:'🐟', items:2, options:[1,2,3,4] },
      { type:'count', emoji:'🎈', items:4, options:[2,3,4,6] },
      { type:'count', emoji:'🌺', items:1, options:[1,2,3,4] },
      { type:'count', emoji:'🐱', items:6, options:[4,5,6,7] },
      { type:'count', emoji:'🍌', items:7, options:[5,6,7,8] },
    ],
    g1: [
      { type:'count', emoji:'➕', items:null, question:'2 + 3 = ?', answer:5, options:[4,5,6,7] },
      { type:'count', emoji:'➕', items:null, question:'4 + 1 = ?', answer:5, options:[3,4,5,6] },
      { type:'count', emoji:'➕', items:null, question:'3 + 3 = ?', answer:6, options:[5,6,7,8] },
      { type:'count', emoji:'➕', items:null, question:'5 + 2 = ?', answer:7, options:[6,7,8,9] },
      { type:'count', emoji:'➕', items:null, question:'1 + 6 = ?', answer:7, options:[5,6,7,8] },
      { type:'count', emoji:'➕', items:null, question:'4 + 4 = ?', answer:8, options:[6,7,8,9] },
      { type:'count', emoji:'➕', items:null, question:'3 + 5 = ?', answer:8, options:[7,8,9,10] },
    ],
    g2: [
      { type:'count', emoji:'🔢', items:null, question:'9 + 6 = ?', answer:15, options:[13,14,15,16] },
      { type:'count', emoji:'🔢', items:null, question:'15 - 7 = ?', answer:8, options:[7,8,9,10] },
      { type:'count', emoji:'🔢', items:null, question:'8 + 9 = ?', answer:17, options:[15,16,17,18] },
      { type:'count', emoji:'🔢', items:null, question:'14 - 6 = ?', answer:8, options:[6,7,8,9] },
      { type:'count', emoji:'🔢', items:null, question:'7 + 8 = ?', answer:15, options:[14,15,16,17] },
      { type:'count', emoji:'🔢', items:null, question:'20 - 5 = ?', answer:15, options:[13,14,15,16] },
    ],
    g3: [
      { type:'count', emoji:'✖️', items:null, question:'2 × 6 = ?', answer:12, options:[10,11,12,14] },
      { type:'count', emoji:'✖️', items:null, question:'3 × 4 = ?', answer:12, options:[9,10,12,15] },
      { type:'count', emoji:'✖️', items:null, question:'5 × 3 = ?', answer:15, options:[10,12,15,20] },
      { type:'count', emoji:'✖️', items:null, question:'5 × 5 = ?', answer:25, options:[20,25,30,35] },
      { type:'count', emoji:'✖️', items:null, question:'3 × 7 = ?', answer:21, options:[18,20,21,24] },
      { type:'count', emoji:'✖️', items:null, question:'2 × 9 = ?', answer:18, options:[16,18,20,22] },
    ],
    g4: [
      { type:'count', emoji:'🍕', items:null, question:'1/2 + 1/2 = ?', answer:'1', options:['1/2','1','1 1/2','2'] },
      { type:'count', emoji:'🍕', items:null, question:'1/4 + 1/4 = ?', answer:'1/2', options:['1/4','1/2','3/4','1'] },
      { type:'count', emoji:'🍕', items:null, question:'3/4 - 1/4 = ?', answer:'1/2', options:['1/4','1/2','3/4','1'] },
      { type:'count', emoji:'🍕', items:null, question:'1/3 + 1/3 = ?', answer:'2/3', options:['1/3','2/3','1','1/2'] },
      { type:'count', emoji:'🍕', items:null, question:'Which is bigger: 1/2 or 1/4?', answer:'1/2', options:['1/4','1/2','Both equal','Neither'] },
    ],
    g5: [
      { type:'count', emoji:'🔟', items:null, question:'0.5 + 0.3 = ?', answer:'0.8', options:['0.7','0.8','0.9','1.0'] },
      { type:'count', emoji:'🔟', items:null, question:'1.2 + 0.8 = ?', answer:'2.0', options:['1.8','1.9','2.0','2.1'] },
      { type:'count', emoji:'🔟', items:null, question:'3.5 - 1.5 = ?', answer:'2.0', options:['1.5','2.0','2.5','3.0'] },
      { type:'count', emoji:'🔟', items:null, question:'0.25 + 0.75 = ?', answer:'1.0', options:['0.9','1.0','1.1','1.25'] },
      { type:'count', emoji:'🔟', items:null, question:'2.4 - 0.6 = ?', answer:'1.8', options:['1.6','1.8','2.0','2.2'] },
    ],
    g6: [
      { type:'count', emoji:'💯', items:null, question:'50% of 80 = ?', answer:'40', options:['30','35','40','45'] },
      { type:'count', emoji:'💯', items:null, question:'25% of 100 = ?', answer:'25', options:['20','25','30','50'] },
      { type:'count', emoji:'💯', items:null, question:'10% of 200 = ?', answer:'20', options:['10','20','30','40'] },
      { type:'count', emoji:'💯', items:null, question:'75% of 40 = ?', answer:'30', options:['20','25','30','35'] },
      { type:'count', emoji:'💯', items:null, question:'20% of 50 = ?', answer:'10', options:['5','10','15','20'] },
    ],
  },
  english: {
    kg: [
      { type:'spell', word:'A', image:'🍎', options:['A','B','C'], hint:'Apple starts with...' },
      { type:'spell', word:'B', image:'🐻', options:['A','B','D'], hint:'Bear starts with...' },
      { type:'spell', word:'C', image:'🐱', options:['C','K','S'], hint:'Cat starts with...' },
      { type:'spell', word:'D', image:'🐶', options:['B','D','P'], hint:'Dog starts with...' },
      { type:'spell', word:'S', image:'☀️', options:['S','C','Z'], hint:'Sun starts with...' },
      { type:'spell', word:'M', image:'🌙', options:['N','M','W'], hint:'Moon starts with...' },
    ],
    g1: [
      { type:'spell', word:'CAT', image:'🐱', options:['CAT','KAT','CET'] },
      { type:'spell', word:'DOG', image:'🐶', options:['DOG','DAG','DUG'] },
      { type:'spell', word:'SUN', image:'☀️', options:['SAN','SON','SUN'] },
      { type:'spell', word:'RED', image:'🔴', options:['RED','RID','RAD'] },
      { type:'spell', word:'BIG', image:'🐘', options:['BAG','BIG','BUG'] },
      { type:'spell', word:'HAT', image:'🎩', options:['HAT','HIT','HUT'] },
    ],
    g2: [
      { type:'spell', word:'FISH', image:'🐟', options:['FISH','FESH','FICH'] },
      { type:'spell', word:'TREE', image:'🌳', options:['TREE','TREA','TRIE'] },
      { type:'spell', word:'BIRD', image:'🐦', options:['BERD','BIRD','BRID'] },
      { type:'spell', word:'MOON', image:'🌙', options:['MONE','MOON','MUNE'] },
      { type:'spell', word:'STAR', image:'⭐', options:['STAR','STER','STOR'] },
      { type:'spell', word:'BOOK', image:'📖', options:['BUKE','BOOK','BOUK'] },
    ],
    g3: [
      { type:'spell', word:'BEAUTIFUL', image:'🌸', options:['BEAUTFUL','BEAUTIFUL','BUETIFUL'] },
      { type:'spell', word:'BECAUSE', image:'💡', options:['BECUZ','BECUSE','BECAUSE'] },
      { type:'spell', word:'FRIEND', image:'🤝', options:['FRIEND','FREND','FREIND'] },
      { type:'spell', word:'SCHOOL', image:'🏫', options:['SKOOL','SCHOOL','SHOOL'] },
      { type:'spell', word:'PEOPLE', image:'👨‍👩‍👧‍👦', options:['PEPLE','PEOPLE','PEPOLE'] },
    ],
    g4: [
      { type:'spell', word:'ENVIRONMENT', image:'🌍', options:['ENVIROMENT','ENVIRONMENT','ENVIORNMENT'] },
      { type:'spell', word:'GOVERNMENT', image:'🏛️', options:['GOVERMENT','GOVERNMENT','GOVRNMENT'] },
      { type:'spell', word:'KNOWLEDGE', image:'📚', options:['KNOWLEDGE','KNOWLEGE','KNOWLADGE'] },
      { type:'spell', word:'NECESSARY', image:'✅', options:['NECCESSARY','NECESARY','NECESSARY'] },
      { type:'spell', word:'SEPARATE', image:'↔️', options:['SEPARATE','SEPERATE','SEPARITE'] },
    ],
    g5: [
      { type:'spell', word:'ENCYCLOPEDIA', image:'📖', options:['ENCYCLOPEDIA','ENCICLOPEDIA','ENCYCLOPAEDIA'] },
      { type:'spell', word:'TEMPERATURE', image:'🌡️', options:['TEMPRATURE','TEMPERATURE','TEMPERTURE'] },
      { type:'spell', word:'INDEPENDENCE', image:'🏳️', options:['INDEPENDANCE','INDEPENDENCE','INDIPENDENCE'] },
      { type:'spell', word:'IMMEDIATELY', image:'⚡', options:['IMMEDIATELY','IMEDIATELY','IMMEDIATLY'] },
      { type:'spell', word:'DISAPPEAR', image:'🫥', options:['DISSAPEAR','DISAPEAR','DISAPPEAR'] },
    ],
    g6: [
      { type:'spell', word:'ACCOMMODATE', image:'🏨', options:['ACCOMODATE','ACCOMMODATE','ACOMODATE'] },
      { type:'spell', word:'OCCURRENCE', image:'🔄', options:['OCCURANCE','OCCURENCE','OCCURRENCE'] },
      { type:'spell', word:'CONSCIENCE', image:'💭', options:['CONSCIENCE','CONCIENCE','CONSIENCE'] },
      { type:'spell', word:'EXAGGERATE', image:'📢', options:['EXAGERATE','EXAGGERATE','EXAGGARATE'] },
      { type:'spell', word:'RHYTHM', image:'🥁', options:['RYTHM','RHYTHM','RYTHYM'] },
    ],
  },
  science: {
    kg: [
      { type:'truefalse', statement:'The Sun is hot', answer:true, emoji:'☀️' },
      { type:'truefalse', statement:'Fish can fly', answer:false, emoji:'🐟' },
      { type:'truefalse', statement:'Water is wet', answer:true, emoji:'💧' },
      { type:'truefalse', statement:'Trees are purple', answer:false, emoji:'🌳' },
      { type:'truefalse', statement:'Dogs have four legs', answer:true, emoji:'🐶' },
      { type:'truefalse', statement:'Ice is hot', answer:false, emoji:'🧊' },
    ],
    g1: [
      { type:'truefalse', statement:'The Sun is a star', answer:true, emoji:'☀️' },
      { type:'truefalse', statement:'Plants need water to grow', answer:true, emoji:'🌱' },
      { type:'truefalse', statement:'Humans have three eyes', answer:false, emoji:'👀' },
      { type:'truefalse', statement:'Birds lay eggs', answer:true, emoji:'🐣' },
      { type:'truefalse', statement:'Rocks are alive', answer:false, emoji:'🪨' },
      { type:'truefalse', statement:'Rain comes from clouds', answer:true, emoji:'🌧️' },
    ],
    g2: [
      { type:'truefalse', statement:'The Moon makes its own light', answer:false, emoji:'🌙' },
      { type:'truefalse', statement:'Magnets attract iron', answer:true, emoji:'🧲' },
      { type:'truefalse', statement:'Spiders are insects', answer:false, emoji:'🕷️' },
      { type:'truefalse', statement:'Sound travels through air', answer:true, emoji:'🔊' },
      { type:'truefalse', statement:'Earth is the closest planet to the Sun', answer:false, emoji:'🌍' },
      { type:'truefalse', statement:'Butterflies start as caterpillars', answer:true, emoji:'🦋' },
    ],
    g3: [
      { type:'truefalse', statement:'Plants make food using sunlight', answer:true, emoji:'🌿' },
      { type:'truefalse', statement:'The Earth is flat', answer:false, emoji:'🌍' },
      { type:'truefalse', statement:'Bones protect our brain', answer:true, emoji:'💀' },
      { type:'truefalse', statement:'Lightning is hotter than the Sun\'s surface', answer:true, emoji:'⚡' },
      { type:'truefalse', statement:'Sharks are mammals', answer:false, emoji:'🦈' },
    ],
    g4: [
      { type:'truefalse', statement:'Oxygen is the most common gas in air', answer:false, emoji:'🌬️' },
      { type:'truefalse', statement:'Light travels faster than sound', answer:true, emoji:'💡' },
      { type:'truefalse', statement:'The heart pumps blood around the body', answer:true, emoji:'❤️' },
      { type:'truefalse', statement:'All metals are magnetic', answer:false, emoji:'🧲' },
      { type:'truefalse', statement:'Dinosaurs lived millions of years ago', answer:true, emoji:'🦕' },
    ],
    g5: [
      { type:'truefalse', statement:'Photosynthesis happens in leaves', answer:true, emoji:'🍃' },
      { type:'truefalse', statement:'Venus is the hottest planet', answer:true, emoji:'🔥' },
      { type:'truefalse', statement:'Atoms are visible to the naked eye', answer:false, emoji:'🔬' },
      { type:'truefalse', statement:'The tongue has different taste zones', answer:false, emoji:'👅' },
      { type:'truefalse', statement:'Water boils at 100°C', answer:true, emoji:'💨' },
    ],
    g6: [
      { type:'truefalse', statement:'DNA carries genetic information', answer:true, emoji:'🧬' },
      { type:'truefalse', statement:'Gravity is stronger on the Moon than on Earth', answer:false, emoji:'🌙' },
      { type:'truefalse', statement:'The human body has 206 bones', answer:true, emoji:'🦴' },
      { type:'truefalse', statement:'Electrons are bigger than protons', answer:false, emoji:'⚛️' },
      { type:'truefalse', statement:'Sound cannot travel through space', answer:true, emoji:'🚀' },
    ],
  },
  islamiat: {
    g1: [
      { type:'truefalse', statement:'Muslims pray 5 times a day', answer:true, emoji:'🕌' },
      { type:'truefalse', statement:'The Holy Quran has 30 Paras', answer:true, emoji:'📖' },
      { type:'truefalse', statement:'Ramadan is the month of fasting', answer:true, emoji:'🌙' },
      { type:'truefalse', statement:'Friday prayer is called Jummah', answer:true, emoji:'🕌' },
      { type:'truefalse', statement:'Prophet Muhammad (PBUH) was born in Makkah', answer:true, emoji:'⭐' },
    ],
    g2: [
      { type:'truefalse', statement:'The Kaaba is in Madinah', answer:false, emoji:'🕋' },
      { type:'truefalse', statement:'Zakat is one of the 5 pillars of Islam', answer:true, emoji:'💝' },
      { type:'truefalse', statement:'Wudu is done before prayer', answer:true, emoji:'💧' },
      { type:'truefalse', statement:'Surah Al-Fatiha is the first surah', answer:true, emoji:'📖' },
      { type:'truefalse', statement:'Hajj is performed in Ramadan', answer:false, emoji:'🕌' },
    ],
    g3: [
      { type:'truefalse', statement:'There are 114 Surahs in the Quran', answer:true, emoji:'📖' },
      { type:'truefalse', statement:'Prophet Ibrahim (AS) built the Kaaba', answer:true, emoji:'🕋' },
      { type:'truefalse', statement:'Eid ul Fitr comes after Hajj', answer:false, emoji:'🎉' },
      { type:'truefalse', statement:'Salah is the second pillar of Islam', answer:true, emoji:'🕌' },
      { type:'truefalse', statement:'The Prophet (PBUH) received the first revelation in Cave Hira', answer:true, emoji:'⛰️' },
    ],
    g4: [
      { type:'truefalse', statement:'The first Muezzin of Islam was Bilal (RA)', answer:true, emoji:'🕌' },
      { type:'truefalse', statement:'Surah Ikhlas declares the oneness of Allah', answer:true, emoji:'📖' },
      { type:'truefalse', statement:'Prophet Nuh (AS) built an ark', answer:true, emoji:'🚢' },
      { type:'truefalse', statement:'Asr prayer has 3 Farz rakats', answer:false, emoji:'🕌' },
      { type:'truefalse', statement:'Sadaqah is compulsory charity', answer:false, emoji:'💝' },
    ],
    g5: [
      { type:'truefalse', statement:'The Quran was revealed over 23 years', answer:true, emoji:'📖' },
      { type:'truefalse', statement:'Prophet Musa (AS) parted the sea', answer:true, emoji:'🌊' },
      { type:'truefalse', statement:'Fajr prayer has 4 Farz rakats', answer:false, emoji:'🕌' },
      { type:'truefalse', statement:'The Battle of Badr was the first battle in Islam', answer:true, emoji:'⚔️' },
      { type:'truefalse', statement:'Zakat is 2.5% of savings', answer:true, emoji:'💰' },
    ],
    g6: [
      { type:'truefalse', statement:'The Treaty of Hudaibiyah was signed in 6 AH', answer:true, emoji:'📜' },
      { type:'truefalse', statement:'Surah Al-Baqarah is the longest surah', answer:true, emoji:'📖' },
      { type:'truefalse', statement:'Prophet Isa (AS) is mentioned more than Prophet Musa (AS) in the Quran', answer:false, emoji:'📖' },
      { type:'truefalse', statement:'The Hijrah was migration from Makkah to Madinah', answer:true, emoji:'🐪' },
      { type:'truefalse', statement:'There are 25 Prophets mentioned by name in the Quran', answer:true, emoji:'⭐' },
    ],
  },
  gk: {
    kg: [
      { type:'truefalse', statement:'Pakistan\'s flag is green and white', answer:true, emoji:'🇵🇰' },
      { type:'truefalse', statement:'A cat says "moo"', answer:false, emoji:'🐱' },
      { type:'truefalse', statement:'Bananas are yellow', answer:true, emoji:'🍌' },
      { type:'truefalse', statement:'Cars have wings', answer:false, emoji:'🚗' },
      { type:'truefalse', statement:'The sky is blue', answer:true, emoji:'🌤️' },
    ],
    g1: [
      { type:'truefalse', statement:'Islamabad is the capital of Pakistan', answer:true, emoji:'🏛️' },
      { type:'truefalse', statement:'There are 7 days in a week', answer:true, emoji:'📅' },
      { type:'truefalse', statement:'A triangle has 4 sides', answer:false, emoji:'🔺' },
      { type:'truefalse', statement:'Pakistan has 4 provinces', answer:true, emoji:'🗺️' },
      { type:'truefalse', statement:'The Earth goes around the Sun', answer:true, emoji:'🌍' },
    ],
    g2: [
      { type:'truefalse', statement:'K2 is the tallest mountain in the world', answer:false, emoji:'🏔️' },
      { type:'truefalse', statement:'Quaid-e-Azam founded Pakistan', answer:true, emoji:'🇵🇰' },
      { type:'truefalse', statement:'There are 12 months in a year', answer:true, emoji:'📆' },
      { type:'truefalse', statement:'The Indus River flows through Pakistan', answer:true, emoji:'🌊' },
      { type:'truefalse', statement:'Australia is a continent', answer:true, emoji:'🌏' },
    ],
    g3: [
      { type:'truefalse', statement:'Pakistan became independent on 14 August 1947', answer:true, emoji:'🇵🇰' },
      { type:'truefalse', statement:'The Sahara Desert is in Asia', answer:false, emoji:'🏜️' },
      { type:'truefalse', statement:'An octagon has 8 sides', answer:true, emoji:'🛑' },
      { type:'truefalse', statement:'Karachi is the largest city in Pakistan', answer:true, emoji:'🏙️' },
      { type:'truefalse', statement:'Penguins live in the Arctic', answer:false, emoji:'🐧' },
    ],
    g4: [
      { type:'truefalse', statement:'The Great Wall of China is visible from space', answer:false, emoji:'🧱' },
      { type:'truefalse', statement:'Pakistan\'s national language is Urdu', answer:true, emoji:'🇵🇰' },
      { type:'truefalse', statement:'The Amazon is the longest river in the world', answer:false, emoji:'🌊' },
      { type:'truefalse', statement:'There are 7 continents on Earth', answer:true, emoji:'🌍' },
      { type:'truefalse', statement:'Mount Everest is in the Himalayas', answer:true, emoji:'🏔️' },
    ],
    g5: [
      { type:'truefalse', statement:'The Thar Desert is in Sindh province', answer:true, emoji:'🏜️' },
      { type:'truefalse', statement:'Africa is the largest continent', answer:false, emoji:'🌍' },
      { type:'truefalse', statement:'The Pacific Ocean is the largest ocean', answer:true, emoji:'🌊' },
      { type:'truefalse', statement:'Pakistan shares a border with Iran', answer:true, emoji:'🗺️' },
      { type:'truefalse', statement:'The Eiffel Tower is in London', answer:false, emoji:'🗼' },
    ],
    g6: [
      { type:'truefalse', statement:'Allama Iqbal is the national poet of Pakistan', answer:true, emoji:'📜' },
      { type:'truefalse', statement:'The United Nations was founded in 1945', answer:true, emoji:'🇺🇳' },
      { type:'truefalse', statement:'The Dead Sea is the lowest point on Earth', answer:true, emoji:'🌊' },
      { type:'truefalse', statement:'Pakistan was the first Muslim country to have a nuclear weapon', answer:false, emoji:'⚛️' },
      { type:'truefalse', statement:'The Silk Road passed through Pakistan', answer:true, emoji:'🛤️' },
    ],
  },
  urdu: {
    g1: [
      { type:'match', pairs:[['سیب','Apple'],['بلی','Cat'],['کتاب','Book'],['پانی','Water']] },
      { type:'match', pairs:[['ماں','Mother'],['ابو','Father'],['چاند','Moon'],['ستارا','Star']] },
    ],
    g2: [
      { type:'match', pairs:[['گھر','House'],['درخت','Tree'],['پھول','Flower'],['مچھلی','Fish']] },
      { type:'match', pairs:[['آسمان','Sky'],['زمین','Earth'],['سورج','Sun'],['بارش','Rain']] },
    ],
    g3: [
      { type:'match', pairs:[['استاد','Teacher'],['طالب علم','Student'],['کتب خانہ','Library'],['مدرسہ','School']] },
      { type:'match', pairs:[['صبح','Morning'],['دوپہر','Afternoon'],['شام','Evening'],['رات','Night']] },
    ],
    g4: [
      { type:'match', pairs:[['محنت','Hard work'],['صبر','Patience'],['شکر','Gratitude'],['ہمت','Courage']] },
      { type:'match', pairs:[['جنگل','Forest'],['صحرا','Desert'],['دریا','River'],['پہاڑ','Mountain']] },
    ],
    g5: [
      { type:'match', pairs:[['آزادی','Freedom'],['تعلیم','Education'],['صحت','Health'],['ترقی','Progress']] },
      { type:'match', pairs:[['سائنسدان','Scientist'],['شاعر','Poet'],['مصور','Artist'],['ڈاکٹر','Doctor']] },
    ],
    g6: [
      { type:'match', pairs:[['جمہوریت','Democracy'],['معیشت','Economy'],['ثقافت','Culture'],['تاریخ','History']] },
      { type:'match', pairs:[['قومی زبان','National language'],['دارالحکومت','Capital'],['صوبہ','Province'],['آئین','Constitution']] },
    ],
  },
};

/* ═══ FunZone Component ═══ */
function FunZone({ grade, subject, accent, kidsLang }) {
  const hwUi = HOMEWORK_UI[kidsLang] || HOMEWORK_UI.en;
  const isHwRtl = HW_RTL_LANGS.includes(kidsLang);
  const hwRtlStyle = isHwRtl ? { direction: 'rtl', textAlign: 'right' } : {};
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [answered, setAnswered] = useState(false);
  const [xp, setXp] = useState(0);
  const [setComplete, setSetComplete] = useState(false);
  const [matchSelected, setMatchSelected] = useState(null); // for match game
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [activeGame, setActiveGame] = useState(null); // null = show card grid

  // Load XP from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nw_homework_xp');
      if (saved) setXp(parseInt(saved, 10) || 0);
    } catch {}
  }, []);

  const saveXp = (val) => {
    setXp(val);
    try { localStorage.setItem('nw_homework_xp', String(val)); } catch {}
  };

  // Get exercises for current grade+subject
  const subjectId = subject.id;
  const gradeId = grade.id;
  const exercises = FUN_EXERCISES[subjectId]?.[gradeId] || [];

  // Determine available game types for this subject
  const gameTypes = [];
  if (['maths'].includes(subjectId)) gameTypes.push({ id:'count', label:hwUi.countingGame, emoji:'🔢', desc:hwUi.countingGameDesc });
  if (['english'].includes(subjectId)) gameTypes.push({ id:'spell', label:hwUi.spellingBee, emoji:'🐝', desc:hwUi.spellingBeeDesc });
  if (['science','gk','islamiat'].includes(subjectId)) gameTypes.push({ id:'truefalse', label:hwUi.trueOrFalse, emoji:'✅', desc:hwUi.trueOrFalseDesc });
  if (['urdu'].includes(subjectId)) gameTypes.push({ id:'match', label:hwUi.matchIt, emoji:'🔗', desc:hwUi.matchItDesc });
  // Add match game for subjects that also have match data
  if (FUN_EXERCISES[subjectId]?.[gradeId]?.some(e => e.type === 'match') && !gameTypes.find(g => g.id === 'match')) {
    gameTypes.push({ id:'match', label:hwUi.matchIt, emoji:'🔗', desc:hwUi.matchItDesc });
  }
  // Universal true/false for subjects with truefalse data
  if (!gameTypes.find(g => g.id === 'truefalse') && exercises.some(e => e.type === 'truefalse')) {
    gameTypes.push({ id:'truefalse', label:hwUi.trueOrFalse, emoji:'✅', desc:hwUi.trueOrFalseDesc });
  }

  const currentExercises = exercises.filter(e => activeGame ? e.type === activeGame : true);
  const ex = currentExercises[currentIdx];

  const spawnConfetti = () => {
    const pieces = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      color: ['#FF6B6B','#FFB347','#A8E063','#63D2FF','#C77DFF','#FFC300','#FF8E53'][Math.floor(Math.random()*7)],
      delay: Math.random() * 0.3,
      size: 6 + Math.random() * 8,
    }));
    setConfettiPieces(pieces);
    setTimeout(() => setConfettiPieces([]), 1800);
  };

  const handleAnswer = (selected, correct) => {
    if (answered) return;
    sndTick();
    setAnswered(true);
    const isCorrect = String(selected) === String(correct);
    if (isCorrect) {
      sndOk();
      setFeedback('correct');
      setScore(s => s + 1);
      setStreak(s => s + 1);
      const newXp = xp + 5;
      saveXp(newXp);
      spawnConfetti();
    } else {
      sndErr();
      setFeedback('wrong');
      setStreak(0);
    }
    setTimeout(() => {
      if (currentIdx + 1 >= currentExercises.length) {
        // Set complete
        if (isCorrect) {
          const bonusXp = xp + 5 + 20;
          saveXp(bonusXp);
        }
        setSetComplete(true);
        sndWin();
        spawnConfetti();
      } else {
        setCurrentIdx(i => i + 1);
        setFeedback(null);
        setAnswered(false);
      }
    }, isCorrect ? 1200 : 1800);
  };

  const handleMatchTap = (item, side) => {
    if (matchedPairs.includes(item)) return;
    sndTick();
    if (!matchSelected) {
      setMatchSelected({ item, side });
      return;
    }
    if (matchSelected.side === side) {
      setMatchSelected({ item, side });
      return;
    }
    // Check if match
    const pairs = ex.pairs;
    const isMatch = pairs.some(([l, r]) =>
      (matchSelected.item === l && item === r) || (matchSelected.item === r && item === l)
    );
    if (isMatch) {
      sndOk();
      const newMatched = [...matchedPairs, matchSelected.item, item];
      setMatchedPairs(newMatched);
      setMatchSelected(null);
      const newXp = xp + 5;
      saveXp(newXp);
      spawnConfetti();
      if (newMatched.length === pairs.length * 2) {
        // All matched
        setTimeout(() => {
          const bonusXp = xp + 5 + 20;
          saveXp(bonusXp);
          setSetComplete(true);
          sndWin();
          spawnConfetti();
        }, 600);
      }
    } else {
      sndErr();
      setFeedback('wrong');
      setMatchSelected(null);
      setTimeout(() => setFeedback(null), 800);
    }
  };

  const resetGame = () => {
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setAnswered(false);
    setSetComplete(false);
    setMatchSelected(null);
    setMatchedPairs([]);
    setActiveGame(null);
  };

  if (!exercises.length || subjectId === 'craft' || subjectId === 'other') return null;

  const btnBase = {
    minHeight:'64px', borderRadius:'20px', fontWeight:'900', fontSize:'18px',
    cursor:'pointer', fontFamily:"'Nunito',sans-serif", transition:'all 0.15s',
    border:'3px solid transparent', display:'flex', alignItems:'center', justifyContent:'center',
    gap:'8px', padding:'12px 20px', width:'100%', boxSizing:'border-box',
  };

  // ── Game card grid (no active game) ──
  if (!activeGame) {
    return (
      <div style={{
        background:'rgba(255,255,255,0.04)', border:`2px solid ${accent}44`,
        borderRadius:'24px', padding:'24px', position:'relative', overflow:'hidden',
      }}>
        {/* XP bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px', flexWrap:'wrap', gap:'8px' }}>
          <div>
            <div style={{ fontWeight:'900', fontSize:'20px', color:accent, ...hwRtlStyle }}>{hwUi.funZone}</div>
            <div style={{ fontSize:'13px', color:'rgba(255,255,255,0.5)', marginTop:'2px', ...hwRtlStyle }}>{hwUi.funZoneSub}</div>
          </div>
          <div style={{
            background:`${accent}22`, border:`2px solid ${accent}66`, borderRadius:'16px',
            padding:'8px 16px', display:'flex', alignItems:'center', gap:'10px',
          }}>
            <span style={{ fontSize:'22px' }}>⭐</span>
            <div>
              <div style={{ fontWeight:'900', fontSize:'16px', color:accent }}>{xp} XP</div>
              <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.4)', ...hwRtlStyle }}>{hwUi.keepPlaying}</div>
            </div>
          </div>
        </div>

        {/* Game cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'12px' }}>
          {gameTypes.map(game => (
            <button key={game.id} onClick={() => { setActiveGame(game.id); setCurrentIdx(0); setScore(0); setStreak(0); setFeedback(null); setAnswered(false); setSetComplete(false); setMatchSelected(null); setMatchedPairs([]); }} style={{
              ...btnBase,
              background:`${accent}18`, border:`2px solid ${accent}55`,
              flexDirection:'column', minHeight:'120px', padding:'16px',
            }}>
              <span style={{ fontSize:'40px' }}>{game.emoji}</span>
              <span style={{ fontSize:'15px', color:accent }}>{game.label}</span>
              <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.45)', fontWeight:'600' }}>{game.desc}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Set complete screen ──
  if (setComplete) {
    return (
      <div style={{
        background:'rgba(255,255,255,0.04)', border:`2px solid ${accent}44`,
        borderRadius:'24px', padding:'32px', textAlign:'center', position:'relative', overflow:'hidden',
      }}>
        {/* Confetti */}
        {confettiPieces.map(p => (
          <div key={p.id} style={{
            position:'absolute', left:`${p.left}%`, top:'-10px',
            width:`${p.size}px`, height:`${p.size}px`, borderRadius:'50%',
            background:p.color, opacity:0.9,
            animation:`confettiFall 1.5s ${p.delay}s ease-out forwards`,
          }} />
        ))}
        <style>{`@keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(400px) rotate(720deg);opacity:0} }`}</style>

        <div style={{ fontSize:'64px', marginBottom:'16px' }}>🎉</div>
        <div style={{ fontWeight:'900', fontSize:'28px', color:accent, marginBottom:'8px', ...hwRtlStyle }}>{hwUi.amazing}</div>
        <div style={{ fontSize:'18px', color:'rgba(255,255,255,0.7)', marginBottom:'4px', ...hwRtlStyle }}>{hwUi.finished} {currentExercises.length} {hwUi.exercises}</div>
        <div style={{ fontSize:'16px', color:'rgba(255,255,255,0.6)', marginBottom:'4px', ...hwRtlStyle }}>{hwUi.score}: {score} {hwUi.outOf} {currentExercises.length} {hwUi.correctWord}</div>
        <div style={{ fontSize:'16px', color:accent, fontWeight:'800', marginBottom:'24px', ...hwRtlStyle }}>{hwUi.xpEarned}: +{score * 5 + 20}</div>
        <div style={{
          background:`${accent}22`, border:`2px solid ${accent}66`, borderRadius:'16px',
          padding:'12px 20px', display:'inline-flex', alignItems:'center', gap:'10px', marginBottom:'24px',
        }}>
          <span style={{ fontSize:'24px' }}>⭐</span>
          <span style={{ fontWeight:'900', fontSize:'20px', color:accent }}>{hwUi.total}: {xp} XP</span>
        </div>
        <br />
        <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', marginTop:'8px' }}>
          <button onClick={resetGame} style={{
            ...btnBase, width:'auto', display:'inline-flex',
            background:`linear-gradient(135deg, ${accent}, ${accent}CC)`,
            color:'#0D0800', fontSize:'16px', padding:'14px 32px',
            boxShadow:`0 6px 20px ${accent}55`, ...hwRtlStyle,
          }}>{hwUi.tryAnother}</button>
          <a href="/" style={{
            ...btnBase, width:'auto', display:'inline-flex', textDecoration:'none',
            background:'rgba(79,142,247,0.15)', border:'2px solid rgba(79,142,247,0.4)',
            color:'#4F8EF7', fontSize:'16px', padding:'14px 32px', ...hwRtlStyle,
          }}>{hwUi.askStarky}</a>
        </div>
      </div>
    );
  }

  if (!ex) return null;

  // ── Counting / number game ──
  if (ex.type === 'count') {
    const isEmojiCount = ex.items !== null && ex.items !== undefined && !ex.question;
    return (
      <div style={{
        background:'rgba(255,255,255,0.04)', border:`2px solid ${accent}44`,
        borderRadius:'24px', padding:'24px', position:'relative', overflow:'hidden',
      }}>
        {/* Confetti */}
        {confettiPieces.map(p => (
          <div key={p.id} style={{
            position:'absolute', left:`${p.left}%`, top:'-10px',
            width:`${p.size}px`, height:`${p.size}px`, borderRadius:'50%',
            background:p.color, opacity:0.9,
            animation:`confettiFall 1.5s ${p.delay}s ease-out forwards`,
          }} />
        ))}
        <style>{`@keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(400px) rotate(720deg);opacity:0} }`}</style>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px', flexWrap:'wrap', gap:'8px' }}>
          <button onClick={resetGame} style={{
            background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)',
            borderRadius:'12px', padding:'8px 14px', cursor:'pointer',
            color:'rgba(255,255,255,0.6)', fontSize:'13px', fontFamily:"'Nunito',sans-serif", fontWeight:'700',
          }}>{hwUi.back}</button>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <span style={{ fontWeight:'800', fontSize:'14px', color:'rgba(255,255,255,0.5)' }}>{currentIdx+1}/{currentExercises.length}</span>
            <div style={{
              background:`${accent}22`, border:`1px solid ${accent}66`, borderRadius:'12px',
              padding:'4px 12px', fontWeight:'900', fontSize:'14px', color:accent,
            }}>⭐ {xp} XP</div>
            {streak >= 2 && <div style={{
              background:'rgba(255,107,107,0.2)', border:'1px solid rgba(255,107,107,0.4)', borderRadius:'12px',
              padding:'4px 12px', fontWeight:'900', fontSize:'13px', color:'#FF6B6B',
            }}>🔥 {streak} streak!</div>}
          </div>
        </div>

        {/* Question */}
        <div style={{ textAlign:'center', marginBottom:'20px' }}>
          {isEmojiCount ? (
            <>
              <div style={{ fontSize:'14px', color:'rgba(255,255,255,0.5)', fontWeight:'700', marginBottom:'12px', ...hwRtlStyle }}>{hwUi.howMany}</div>
              <div style={{ fontSize:'48px', letterSpacing:'8px', marginBottom:'16px', lineHeight:'1.4' }}>
                {Array.from({ length: ex.items }, () => ex.emoji).join(' ')}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize:'48px', marginBottom:'12px' }}>{ex.emoji}</div>
              <div style={{ fontSize:'24px', fontWeight:'900', color:'#fff', marginBottom:'16px' }}>{ex.question}</div>
            </>
          )}
        </div>

        {/* Feedback */}
        {feedback === 'correct' && (
          <div style={{ textAlign:'center', marginBottom:'16px', animation:'slideUp 0.3s ease-out' }}>
            <span style={{ fontSize:'24px', fontWeight:'900', color:'#A8E063', ...hwRtlStyle }}>{hwUi.amazing} +5 XP</span>
          </div>
        )}
        {feedback === 'wrong' && (
          <div style={{ textAlign:'center', marginBottom:'16px', animation:'slideUp 0.3s ease-out' }}>
            <span style={{ fontSize:'20px', fontWeight:'900', color:'#FF8E53', ...hwRtlStyle }}>{hwUi.almostTry}</span>
          </div>
        )}

        {/* Options */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          {ex.options.map((opt, i) => {
            const correctAnswer = isEmojiCount ? ex.items : (ex.answer !== undefined ? ex.answer : ex.items);
            const isCorrect = String(opt) === String(correctAnswer);
            const wasChosen = answered && feedback;
            let bg = `${accent}18`;
            let borderC = `${accent}55`;
            if (wasChosen && isCorrect) { bg = 'rgba(168,224,99,0.25)'; borderC = '#A8E063'; }
            else if (wasChosen && !isCorrect && feedback === 'wrong') { bg = 'rgba(255,107,107,0.15)'; borderC = 'rgba(255,107,107,0.4)'; }
            return (
              <button key={i} onClick={() => handleAnswer(opt, correctAnswer)} disabled={answered} style={{
                ...btnBase, background:bg, borderColor:borderC,
                fontSize:'24px', color:'#fff',
                opacity: answered && !isCorrect ? 0.5 : 1,
                transform: wasChosen && isCorrect ? 'scale(1.05)' : 'scale(1)',
              }}>{opt}</button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Spelling game ──
  if (ex.type === 'spell') {
    return (
      <div style={{
        background:'rgba(255,255,255,0.04)', border:`2px solid ${accent}44`,
        borderRadius:'24px', padding:'24px', position:'relative', overflow:'hidden',
      }}>
        {confettiPieces.map(p => (
          <div key={p.id} style={{
            position:'absolute', left:`${p.left}%`, top:'-10px',
            width:`${p.size}px`, height:`${p.size}px`, borderRadius:'50%',
            background:p.color, opacity:0.9,
            animation:`confettiFall 1.5s ${p.delay}s ease-out forwards`,
          }} />
        ))}
        <style>{`@keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(400px) rotate(720deg);opacity:0} }`}</style>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px', flexWrap:'wrap', gap:'8px' }}>
          <button onClick={resetGame} style={{
            background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)',
            borderRadius:'12px', padding:'8px 14px', cursor:'pointer',
            color:'rgba(255,255,255,0.6)', fontSize:'13px', fontFamily:"'Nunito',sans-serif", fontWeight:'700',
          }}>{hwUi.back}</button>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <span style={{ fontWeight:'800', fontSize:'14px', color:'rgba(255,255,255,0.5)' }}>{currentIdx+1}/{currentExercises.length}</span>
            <div style={{
              background:`${accent}22`, border:`1px solid ${accent}66`, borderRadius:'12px',
              padding:'4px 12px', fontWeight:'900', fontSize:'14px', color:accent,
            }}>⭐ {xp} XP</div>
            {streak >= 2 && <div style={{
              background:'rgba(255,107,107,0.2)', border:'1px solid rgba(255,107,107,0.4)', borderRadius:'12px',
              padding:'4px 12px', fontWeight:'900', fontSize:'13px', color:'#FF6B6B',
            }}>🔥 {streak} streak!</div>}
          </div>
        </div>

        <div style={{ textAlign:'center', marginBottom:'20px' }}>
          <div style={{ fontSize:'64px', marginBottom:'8px' }}>{ex.image}</div>
          <div style={{ fontSize:'14px', color:'rgba(255,255,255,0.5)', fontWeight:'700', marginBottom:'8px' }}>
            {ex.hint || hwUi.pickSpelling}
          </div>
        </div>

        {feedback === 'correct' && (
          <div style={{ textAlign:'center', marginBottom:'16px', animation:'slideUp 0.3s ease-out' }}>
            <span style={{ fontSize:'24px', fontWeight:'900', color:'#A8E063', ...hwRtlStyle }}>{hwUi.amazing} +5 XP</span>
          </div>
        )}
        {feedback === 'wrong' && (
          <div style={{ textAlign:'center', marginBottom:'16px', animation:'slideUp 0.3s ease-out' }}>
            <span style={{ fontSize:'20px', fontWeight:'900', color:'#FF8E53', ...hwRtlStyle }}>{hwUi.almostTry}</span>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {ex.options.map((opt, i) => {
            const isCorrect = opt === ex.word;
            const wasChosen = answered && feedback;
            let bg = `${accent}18`;
            let borderC = `${accent}55`;
            if (wasChosen && isCorrect) { bg = 'rgba(168,224,99,0.25)'; borderC = '#A8E063'; }
            else if (wasChosen && !isCorrect) { bg = 'rgba(255,107,107,0.15)'; borderC = 'rgba(255,107,107,0.4)'; }
            return (
              <button key={i} onClick={() => handleAnswer(opt, ex.word)} disabled={answered} style={{
                ...btnBase, background:bg, borderColor:borderC,
                fontSize:'20px', color:'#fff', letterSpacing:'3px',
                opacity: answered && !isCorrect ? 0.5 : 1,
                transform: wasChosen && isCorrect ? 'scale(1.03)' : 'scale(1)',
              }}>{opt}</button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── True or False game ──
  if (ex.type === 'truefalse') {
    return (
      <div style={{
        background:'rgba(255,255,255,0.04)', border:`2px solid ${accent}44`,
        borderRadius:'24px', padding:'24px', position:'relative', overflow:'hidden',
      }}>
        {confettiPieces.map(p => (
          <div key={p.id} style={{
            position:'absolute', left:`${p.left}%`, top:'-10px',
            width:`${p.size}px`, height:`${p.size}px`, borderRadius:'50%',
            background:p.color, opacity:0.9,
            animation:`confettiFall 1.5s ${p.delay}s ease-out forwards`,
          }} />
        ))}
        <style>{`@keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(400px) rotate(720deg);opacity:0} }`}</style>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px', flexWrap:'wrap', gap:'8px' }}>
          <button onClick={resetGame} style={{
            background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)',
            borderRadius:'12px', padding:'8px 14px', cursor:'pointer',
            color:'rgba(255,255,255,0.6)', fontSize:'13px', fontFamily:"'Nunito',sans-serif", fontWeight:'700',
          }}>{hwUi.back}</button>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <span style={{ fontWeight:'800', fontSize:'14px', color:'rgba(255,255,255,0.5)' }}>{currentIdx+1}/{currentExercises.length}</span>
            <div style={{
              background:`${accent}22`, border:`1px solid ${accent}66`, borderRadius:'12px',
              padding:'4px 12px', fontWeight:'900', fontSize:'14px', color:accent,
            }}>⭐ {xp} XP</div>
            {streak >= 2 && <div style={{
              background:'rgba(255,107,107,0.2)', border:'1px solid rgba(255,107,107,0.4)', borderRadius:'12px',
              padding:'4px 12px', fontWeight:'900', fontSize:'13px', color:'#FF6B6B',
            }}>🔥 {streak} streak!</div>}
          </div>
        </div>

        <div style={{ textAlign:'center', marginBottom:'24px' }}>
          <div style={{ fontSize:'56px', marginBottom:'12px' }}>{ex.emoji || '🤔'}</div>
          <div style={{ fontSize:'22px', fontWeight:'900', color:'#fff', lineHeight:'1.4', maxWidth:'400px', margin:'0 auto' }}>
            {ex.statement}
          </div>
        </div>

        {feedback === 'correct' && (
          <div style={{ textAlign:'center', marginBottom:'16px', animation:'slideUp 0.3s ease-out' }}>
            <span style={{ fontSize:'24px', fontWeight:'900', color:'#A8E063', ...hwRtlStyle }}>{hwUi.amazing} +5 XP</span>
          </div>
        )}
        {feedback === 'wrong' && (
          <div style={{ textAlign:'center', marginBottom:'16px', animation:'slideUp 0.3s ease-out' }}>
            <span style={{ fontSize:'20px', fontWeight:'900', color:'#FF8E53', ...hwRtlStyle }}>{hwUi.answerWas} {ex.answer ? hwUi.trueWord : hwUi.falseWord}! 💪</span>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          {[true, false].map(val => {
            const isCorrect = val === ex.answer;
            const wasChosen = answered && feedback;
            let bg = val ? 'rgba(168,224,99,0.15)' : 'rgba(255,107,107,0.15)';
            let borderC = val ? 'rgba(168,224,99,0.4)' : 'rgba(255,107,107,0.4)';
            if (wasChosen && isCorrect) { bg = val ? 'rgba(168,224,99,0.35)' : 'rgba(255,107,107,0.35)'; }
            else if (wasChosen && !isCorrect) { bg = 'rgba(255,255,255,0.05)'; borderC = 'rgba(255,255,255,0.15)'; }
            return (
              <button key={String(val)} onClick={() => handleAnswer(val, ex.answer)} disabled={answered} style={{
                ...btnBase, background:bg, borderColor:borderC,
                fontSize:'22px', color:'#fff', minHeight:'80px',
                opacity: answered && !isCorrect ? 0.4 : 1,
                transform: wasChosen && isCorrect ? 'scale(1.05)' : 'scale(1)',
              }}>
                <span style={{ fontSize:'32px' }}>{val ? '✅' : '❌'}</span>
                {val ? hwUi.trueWord : hwUi.falseWord}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Match game ──
  if (ex.type === 'match') {
    const leftItems = ex.pairs.map(([l]) => l);
    const rightItems = ex.pairs.map(([, r]) => r);
    return (
      <div style={{
        background:'rgba(255,255,255,0.04)', border:`2px solid ${accent}44`,
        borderRadius:'24px', padding:'24px', position:'relative', overflow:'hidden',
      }}>
        {confettiPieces.map(p => (
          <div key={p.id} style={{
            position:'absolute', left:`${p.left}%`, top:'-10px',
            width:`${p.size}px`, height:`${p.size}px`, borderRadius:'50%',
            background:p.color, opacity:0.9,
            animation:`confettiFall 1.5s ${p.delay}s ease-out forwards`,
          }} />
        ))}
        <style>{`@keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(400px) rotate(720deg);opacity:0} }`}</style>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px', flexWrap:'wrap', gap:'8px' }}>
          <button onClick={resetGame} style={{
            background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)',
            borderRadius:'12px', padding:'8px 14px', cursor:'pointer',
            color:'rgba(255,255,255,0.6)', fontSize:'13px', fontFamily:"'Nunito',sans-serif", fontWeight:'700',
          }}>{hwUi.back}</button>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{
              background:`${accent}22`, border:`1px solid ${accent}66`, borderRadius:'12px',
              padding:'4px 12px', fontWeight:'900', fontSize:'14px', color:accent,
            }}>⭐ {xp} XP</div>
          </div>
        </div>

        <div style={{ textAlign:'center', marginBottom:'16px' }}>
          <div style={{ fontSize:'14px', color:'rgba(255,255,255,0.5)', fontWeight:'700', ...hwRtlStyle }}>{hwUi.tapMatch}</div>
        </div>

        {feedback === 'wrong' && (
          <div style={{ textAlign:'center', marginBottom:'12px', animation:'slideUp 0.3s ease-out' }}>
            <span style={{ fontSize:'18px', fontWeight:'900', color:'#FF8E53', ...hwRtlStyle }}>{hwUi.notQuite}</span>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {leftItems.map((item, i) => {
              const isMatched = matchedPairs.includes(item);
              const isSelected = matchSelected?.item === item && matchSelected?.side === 'left';
              return (
                <button key={i} onClick={() => !isMatched && handleMatchTap(item, 'left')} disabled={isMatched} style={{
                  ...btnBase, fontSize:'16px', color:'#fff', minHeight:'56px',
                  background: isMatched ? 'rgba(168,224,99,0.2)' : isSelected ? `${accent}33` : `${accent}15`,
                  borderColor: isMatched ? '#A8E063' : isSelected ? accent : `${accent}44`,
                  opacity: isMatched ? 0.5 : 1,
                  textDecoration: isMatched ? 'line-through' : 'none',
                  direction: /[\u0600-\u06FF]/.test(item) ? 'rtl' : 'ltr',
                }}>{item}</button>
              );
            })}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {rightItems.map((item, i) => {
              const isMatched = matchedPairs.includes(item);
              const isSelected = matchSelected?.item === item && matchSelected?.side === 'right';
              return (
                <button key={i} onClick={() => !isMatched && handleMatchTap(item, 'right')} disabled={isMatched} style={{
                  ...btnBase, fontSize:'16px', color:'#fff', minHeight:'56px',
                  background: isMatched ? 'rgba(168,224,99,0.2)' : isSelected ? `${accent}33` : 'rgba(255,255,255,0.08)',
                  borderColor: isMatched ? '#A8E063' : isSelected ? accent : 'rgba(255,255,255,0.2)',
                  opacity: isMatched ? 0.5 : 1,
                  textDecoration: isMatched ? 'line-through' : 'none',
                }}>{item}</button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

const FormatText = ({ text }) => {
  const lines = text.split("\n");
  return (
    <div>
      {lines.map((line, i) => {
        if (line.startsWith("## ")) return <h3 key={i} style={{ fontWeight:"900", fontSize:"17px", margin:"16px 0 6px", color:"#FFC300" }}>{line.slice(3)}</h3>;
        if (line.startsWith("# "))  return <h2 key={i} style={{ fontWeight:"900", fontSize:"20px", margin:"16px 0 8px", color:"#FFB347" }}>{line.slice(2)}</h2>;
        if (line.match(/^\d+\.\s/)) return <p  key={i} style={{ margin:"6px 0", paddingLeft:"4px", display:"flex", gap:"8px" }}><span style={{ color:"#FFC300", fontWeight:"800", minWidth:"24px" }}>{line.match(/^\d+/)[0]}.</span><span>{line.replace(/^\d+\.\s/, "")}</span></p>;
        if (line.startsWith("- "))  return <p  key={i} style={{ margin:"5px 0", paddingLeft:"4px", display:"flex", gap:"8px" }}><span style={{ color:"#FF8E53" }}>•</span><span>{line.slice(2)}</span></p>;
        if (line.startsWith("**") && line.endsWith("**")) return <p key={i} style={{ fontWeight:"800", color:"#FFB347", margin:"10px 0 4px" }}>{line.slice(2, -2)}</p>;
        if (line.trim() === "") return <div key={i} style={{ height:"8px" }} />;
        return <p key={i} style={{ margin:"4px 0", lineHeight:"1.7" }}>{line}</p>;
      })}
    </div>
  );
};

export default function HomeworkHelper() {
  const [selectedGrade,   setSelectedGrade]   = useState(GRADES[1]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [mode,            setMode]            = useState(MODE_PARENT);
  const [question,        setQuestion]        = useState("");
  const [answer,          setAnswer]          = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [history,         setHistory]         = useState([]);
  const [followUp,        setFollowUp]        = useState("");
  const [activeTab,       setActiveTab]       = useState("homework");
  const [activeCraft,     setActiveCraft]     = useState(null);
  const [showSidebar,     setShowSidebar]     = useState(false);
  const { callsUsed, callsLeft, limitReached, recordCall } = useSessionLimit();
  const [showLimitModal,  setShowLimitModal]  = useState(false);
  const [copiedStep,      setCopiedStep]      = useState(null);
  const answerRef = useRef(null);

  // Mother tongue / language support
  const [kidsLang, setKidsLang] = useState('en');
  useEffect(() => { setKidsLang(getKidsLang()); }, []);

  useEffect(() => {
    if (answer) answerRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });
  }, [answer]);

  const buildSystemPrompt = () => {
    const gradeLabel = selectedGrade.label;
    const age        = selectedGrade.age;
    const subject    = selectedSubject.label;

    if (mode === MODE_PARENT) {
      return `You are Starky, a warm and expert homework helper for parents.
A parent is sitting with their ${age}-year-old child (${gradeLabel}) doing ${subject} homework.
Your job is to help the PARENT understand the concept clearly so they can explain it to their child.

KNOWLEDGE: You have mastered every Cambridge O Level and A Level syllabus (1994–2024), every mark scheme, every examiner report, and every major curriculum from KG through Sixth Form including UK, Pakistan, and international curricula.

Give the parent:
1. A simple, clear explanation of the concept
2. The actual answer/solution with full working shown step by step
3. A fun, easy way to explain it to a ${age}-year-old (use a story, game, or everyday object)
4. One or two follow-up questions the parent can ask to check understanding

Be warm, encouraging, and practical. Use clear headings and numbered steps.
LANGUAGE: If the parent writes in Urdu, respond entirely in Urdu. If Arabic, respond in Arabic. Auto-detect and match their language.`;
    } else {
      return `You are Starky, a magical friendly tutor for a ${age}-year-old child in ${gradeLabel}.
You are talking DIRECTLY to the child. Subject: ${subject}.

Make learning feel like a game or adventure:
- Very simple words a ${age}-year-old understands
- Lots of emojis 🌟⭐🎉✨
- Short sentences, big energy, UNDER 50 WORDS per response
- Fun comparisons (numbers as pizza slices, atoms as tiny footballs)
- Celebrate every correct answer with genuine excitement
- If wrong: "Ooh, close! Let's try a different way 🤔"
- End with a fun question or mini-challenge

HANDS-ON ANCHORING — for every concept, suggest a physical action:
"Can you count on your fingers? 🖐️" "Write it on paper!" "Draw a circle around it!"
"Clap your hands 3 times — that's 3!" The screen SUPPORTS physical learning.

INDEPENDENT LEARNER — do NOT assume a parent is present.
"You can do this! Let's try together." NOT "Ask your mummy to help."
This child may be studying alone at the dining table. She is capable.

SHORT BURSTS — every interaction is maximum 5 minutes with a clear ending:
"Done! You got it! 🎉 Want to try one more or shall we stop here?"
Always give the child the choice to stop. Always celebrate completion.

WORKSHEET COMPANION — if student says "I have a worksheet" or mentions their school book:
"Which question are you on? Read it to me and let's figure it out together!"
The paper is the primary tool. Starky helps alongside it.

HOME ENVIRONMENT — never require silence. If student disappears mid-session:
"Take your time! I'm here whenever you're ready 🌟" No timeout. No pressure.

LANGUAGE: If the child writes in Urdu, respond entirely in Urdu. If Arabic, respond in Arabic. Auto-detect and match their language.`;
    }
  };

  const askStarky = async (q = null) => {
    const text = q || question.trim();
    if (!text) return;
    if (limitReached) { setShowLimitModal(true); return; }
    recordCall();
    setLoading(true);
    setAnswer(null);
    setShowSidebar(false);

    const systemPrompt = buildSystemPrompt();
    const contextLine  = `Subject: ${selectedSubject.label} | Grade: ${selectedGrade.label} | Age: ${selectedGrade.age}`;
    const fullQuestion = `${contextLine}\n\nHomework question: ${text}`;
    const msgs = [...history, { role:"user", content:fullQuestion }];

    try {
      const response = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: systemPrompt,
          messages: msgs,
        }),
      });
      const data = await response.json();
      const reply = data.content || data.error || "Hmm, let me think again — please try once more!";
      setAnswer(reply);
      setHistory(prev => [...prev, { role:"user", content:fullQuestion }, { role:"assistant", content:reply }]);
      setQuestion("");
      // Signal collection
      try {
        const { recordMessageSignal, recordStrategySignal } = await import('../utils/signalCollector');
        const profile = JSON.parse(localStorage.getItem('nw_user') || '{}');
        recordMessageSignal({ email: profile.email || 'anonymous', subject: selectedSubject.label, grade: profile.grade || '', userMessage: text, starkyResponse: reply, sessionNumber: 1 });
        recordStrategySignal({ email: profile.email || 'anonymous', subject: selectedSubject.label, grade: profile.grade || '', starkyResponse: reply, userResponse: text });
      } catch {}
      // Session-complete analysis
      try {
        const updatedHistory = [...history, { role:"user", content:fullQuestion }, { role:"assistant", content:reply }];
        const msgCount = updatedHistory.filter(m => m.role === 'user').length;
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
              subject: selectedSubject.label,
              messages: updatedHistory.slice(-20),
            }),
          }).catch(() => {});
        }
      } catch {}
    } catch {
      setAnswer("Oops! Something went wrong. Please check your connection and try again. 🌟");
    }
    setLoading(false);
  };

  const askFollowUp = async () => {
    if (!followUp.trim()) return;
    await askStarky(followUp);
    setFollowUp("");
  };

  const handleCopyStep = (text, idx) => {
    navigator.clipboard?.writeText(text);
    setCopiedStep(idx);
    setTimeout(() => setCopiedStep(null), 1500);
  };

  const accent = selectedGrade.color;

  return (
    <>
    <Head>
      <title>Homework Helper — NewWorldEdu</title>
      <meta name="description" content="Homework help for KG to Grade 6. Starky guides your child step by step without giving direct answers. Includes craft activities and parent mode." />
      <meta property="og:title" content="Homework Helper — KG to Grade 6" />
      <meta property="og:description" content="Homework help for KG to Grade 6. Starky guides your child step by step without giving direct answers. Includes craft activities and parent mode." />
    </Head>
    <div style={{
      fontFamily: "'Nunito', 'Trebuchet MS', sans-serif",
      background: "linear-gradient(160deg, #0B0E1F 0%, #12101A 50%, #0D1520 100%)",
      color: "#fff", minHeight: "100dvh",
    }}>
      {showLimitModal && <LimitReachedModal onClose={() => setShowLimitModal(false)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes slideUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes twinkle { from{opacity:0.1} to{opacity:0.8} }
        .grade-btn:hover   { transform:scale(1.04) translateY(-2px); }
        .subj-pill:hover   { opacity:1 !important; transform:translateY(-2px); }
        .starter-q:hover   { background:rgba(255,255,255,0.1) !important; transform:translateX(3px); }
        .craft-card:hover  { transform:translateY(-5px); border-color:rgba(255,179,71,0.5) !important; }
        .mode-btn:hover    { opacity:1 !important; }
        .ask-btn:hover     { transform:translateY(-2px); filter:brightness(1.1); }
        textarea:focus, input:focus { outline:none; border-color:rgba(255,179,71,0.6) !important; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,179,71,0.3); border-radius:4px; }

        /* Mobile sidebar overlay */
        .sidebar-overlay {
          display: none;
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          z-index: 200;
        }
        .sidebar-drawer {
          position: fixed; top: 0; left: 0; bottom: 0; width: 300px;
          background: #0D1020; overflow-y: auto; z-index: 201;
          padding: 20px; transform: translateX(-100%);
          transition: transform 0.3s ease; box-shadow: 4px 0 24px rgba(0,0,0,0.5);
        }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .main-grid { grid-template-columns: 1fr !important; }
          .main-grid-padding { padding: 0 16px 60px !important; }
          .sidebar-open .sidebar-overlay { display: block; }
          .sidebar-open .sidebar-drawer { transform: translateX(0); }
          .nav-back { font-size: 12px !important; padding: 6px 10px !important; }
          .hero-section { padding: 32px 16px 24px !important; }
          .tabs-row { padding: 0 16px 20px !important; gap: 8px !important; }
          .tab-btn { padding: 10px 14px !important; }
          .tab-btn-label { font-size: 13px !important; }
        }
        @media (min-width: 769px) {
          .mobile-sidebar-btn { display: none !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        background: "rgba(11,14,31,0.95)", WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,179,71,0.15)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", height: "56px", position: "sticky", top: 0, zIndex: 100,
        gap: "8px",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", minWidth:0, overflow:"hidden" }}>
          <span style={{ fontSize:"20px", flexShrink:0 }}>🌍</span>
          <span style={{ fontWeight:"900", fontSize:"15px", whiteSpace:"nowrap" }}>
            New<span style={{ color:"#63D2FF" }}>World</span>
            <span style={{ fontSize:"10px", color:"#A8E063", marginLeft:"5px", fontWeight:"700" }}>EDU</span>
          </span>
          <span style={{
            background: "rgba(255,179,71,0.15)", color:"#FFB347",
            border: "1px solid rgba(255,179,71,0.3)", borderRadius:"20px",
            padding: "3px 10px", fontSize:"10px", fontWeight:"800", whiteSpace:"nowrap",
          }}>🏠 HOMEWORK</span>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:"8px", flexShrink:0 }}>
          {/* Mobile sidebar toggle */}
          <button
            className="mobile-sidebar-btn"
            onClick={() => setShowSidebar(!showSidebar)}
            style={{
              background: "rgba(255,179,71,0.15)", border:"1px solid rgba(255,179,71,0.3)",
              borderRadius:"8px", padding:"6px 10px", cursor:"pointer",
              color:"#FFB347", fontSize:"12px", fontWeight:"800", fontFamily:"'Nunito',sans-serif",
            }}>
            ⚙️ Settings
          </button>

          <a href="/" className="nav-back" style={{
            color: "#fff", fontSize:"13px", fontWeight:"700",
            textDecoration: "none", background:"rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius:"8px",
            padding: "7px 14px", whiteSpace:"nowrap", flexShrink:0,
          }}>← Home</a>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      <div className={showSidebar ? "sidebar-overlay sidebar-open" : "sidebar-overlay"} onClick={() => setShowSidebar(false)} />
      <div className={showSidebar ? "sidebar-drawer sidebar-open" : "sidebar-drawer"}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
          <span style={{ fontWeight:"900", fontSize:"16px", color:"#FFB347" }}>Settings</span>
          <button onClick={() => setShowSidebar(false)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.5)", fontSize:"20px", cursor:"pointer" }}>✕</button>
        </div>
        <SidebarContent
          GRADES={GRADES} SUBJECTS={SUBJECTS}
          selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade}
          selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject}
          mode={mode} setMode={setMode}
          MODE_PARENT={MODE_PARENT} MODE_CHILD={MODE_CHILD}
        />
      </div>

      {/* HERO */}
      <section className="hero-section" style={{
        padding: "40px 20px 28px", textAlign:"center",
        background: "radial-gradient(ellipse at 50% 0%, rgba(255,179,71,0.1) 0%, transparent 60%)",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{
            width:"80px", height:"80px", borderRadius:"50%", margin:"0 auto 16px",
            background:"linear-gradient(135deg, #1A2A4A, #0D1A30)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"40px", border:"3px solid rgba(255,179,71,0.6)",
            animation:"float 3.5s ease-in-out infinite",
            boxShadow:"0 0 40px rgba(255,179,71,0.3)",
          }}>🌟</div>
          <h1 style={{ fontWeight:"900", fontSize:"clamp(24px,5vw,44px)", margin:"0 0 8px", lineHeight:"1.1" }}>
            <span style={{ color:"#FFB347" }}>Homework</span> Helper
          </h1>
          <p style={{ fontSize:"clamp(13px,2vw,16px)", color:"rgba(255,255,255,0.6)", maxWidth:"480px", margin:"0 auto 6px", lineHeight:"1.7" }}>
            Sit back — Starky is here to help you and your little one get through homework together.
          </p>
          <p style={{ fontSize:"12px", color:"rgba(255,179,71,0.7)", fontWeight:"700" }}>
            ✨ For parents of children aged 3–11 · All subjects · Works in any language
          </p>
        </div>
      </section>

      {/* MAIN TABS */}
      <div className="tabs-row" style={{ display:"flex", justifyContent:"center", gap:"12px", padding:"0 20px 24px", flexWrap:"wrap" }}>
        {[
          { id:"homework", label:"📝 Homework Helper", desc:"Explain any question" },
          { id:"craft",    label:"🎨 Art & Craft Ideas", desc:"Creative activities" },
        ].map(tab => (
          <button key={tab.id} className="tab-btn" onClick={() => setActiveTab(tab.id)} style={{
            background: activeTab===tab.id ? "rgba(255,179,71,0.15)" : "rgba(255,255,255,0.04)",
            border: `2px solid ${activeTab===tab.id ? "#FFB347" : "rgba(255,255,255,0.1)"}`,
            borderRadius:"16px", padding:"12px 22px", cursor:"pointer",
            fontFamily:"'Nunito',sans-serif", transition:"all 0.2s", textAlign:"center",
          }}>
            <div className="tab-btn-label" style={{ fontWeight:"800", fontSize:"14px", color:activeTab===tab.id ? "#FFB347" : "rgba(255,255,255,0.6)" }}>{tab.label}</div>
            <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.35)", marginTop:"2px" }}>{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* ═══ HOMEWORK TAB ═══ */}
      {activeTab === "homework" && (
        <div
          className="main-grid main-grid-padding"
          style={{
            maxWidth:"1100px", margin:"0 auto", padding:"0 20px 80px",
            display:"grid", gridTemplateColumns:"280px 1fr", gap:"20px", alignItems:"start",
          }}>

          {/* DESKTOP SIDEBAR */}
          <div className="desktop-sidebar">
            <SidebarContent
              GRADES={GRADES} SUBJECTS={SUBJECTS}
              selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade}
              selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject}
              mode={mode} setMode={setMode}
              MODE_PARENT={MODE_PARENT} MODE_CHILD={MODE_CHILD}
            />
          </div>

          {/* MAIN CHAT AREA */}
          <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

            {/* Current selection summary (mobile only) */}
            <div className="mobile-sidebar-btn" style={{
              background:"rgba(255,179,71,0.08)", border:"1px solid rgba(255,179,71,0.2)",
              borderRadius:"14px", padding:"12px 16px",
              display:"flex", alignItems:"center", justifyContent:"space-between",
            }}>
              <div style={{ fontSize:"13px" }}>
                <span style={{ fontWeight:"800", color:"#FFB347" }}>{selectedGrade.emoji} {selectedGrade.label}</span>
                <span style={{ color:"rgba(255,255,255,0.5)", margin:"0 6px" }}>·</span>
                <span style={{ color:"rgba(255,255,255,0.7)" }}>{selectedSubject.label}</span>
                <span style={{ color:"rgba(255,255,255,0.5)", margin:"0 6px" }}>·</span>
                <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px" }}>{mode === MODE_PARENT ? "👩‍👦 Parent mode" : "👦 Child mode"}</span>
              </div>
            </div>

            {/* ═══ FUN ZONE ═══ */}
            <FunZone grade={selectedGrade} subject={selectedSubject} accent={accent} kidsLang={kidsLang} />

            {/* Question input */}
            <div style={{
              background:"rgba(255,255,255,0.04)", border:`1px solid ${accent}44`,
              borderRadius:"20px", padding:"20px",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" }}>
                <div style={{
                  width:"38px", height:"38px", borderRadius:"50%",
                  background:`${accent}22`, border:`2px solid ${accent}66`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0,
                }}>{selectedGrade.emoji}</div>
                <div>
                  <div style={{ fontWeight:"800", fontSize:"14px" }}>{selectedGrade.label} · {selectedSubject.label}</div>
                  <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.45)" }}>
                    {mode === MODE_PARENT ? "👩‍👦 Explaining to parent" : "👦 Talking to child"}
                  </div>
                </div>
              </div>

              <div style={{ fontSize:"12px", fontWeight:"700", color:"rgba(255,255,255,0.5)", marginBottom:"8px", letterSpacing:"0.5px" }}>
                TYPE THE HOMEWORK QUESTION
              </div>
              <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key==="Enter" && e.ctrlKey && askStarky()}
                autoCorrect="off" autoCapitalize="sentences" spellCheck={false}
                placeholder={`e.g. "Count from 1 to 10 and circle the even numbers" or paste the question from the textbook...`}
                rows={4}
                style={{
                  width:"100%", background:"rgba(255,255,255,0.05)",
                  border:`1px solid ${accent}44`, borderRadius:"14px",
                  padding:"12px 14px", color:"#fff", fontSize:"16px",
                  resize:"vertical", boxSizing:"border-box", lineHeight:"1.6",
                  fontFamily:"'Nunito',sans-serif", WebkitAppearance:"none",
                }}
              />

              <div style={{ marginBottom:"10px", marginTop:"8px" }}>
                <SessionLimitBanner callsUsed={callsUsed} callsLeft={callsLeft} limitReached={limitReached} />
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"10px" }}>
                <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)" }}>Ctrl+Enter to submit</span>
                <button onClick={() => askStarky()} disabled={loading || !question.trim()} className="ask-btn" style={{
                  background: loading || !question.trim() ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #FFB347, #FF8E53)",
                  border:"none", color: loading || !question.trim() ? "rgba(255,255,255,0.3)" : "#0D0800",
                  borderRadius:"12px", padding:"12px 28px",
                  fontWeight:"900", fontSize:"15px", cursor: loading || !question.trim() ? "default" : "pointer",
                  fontFamily:"'Nunito',sans-serif", transition:"all 0.2s",
                  boxShadow: loading || !question.trim() ? "none" : "0 6px 20px rgba(255,179,71,0.35)",
                }}>
                  {loading ? "Starky is thinking... 🌟" : "Ask Starky →"}
                </button>
              </div>

              {/* Starter suggestions */}
              <div style={{ marginTop:"14px" }}>
                <div style={{ fontSize:"11px", fontWeight:"700", color:"rgba(255,255,255,0.3)", marginBottom:"8px", letterSpacing:"0.5px" }}>QUICK EXAMPLES</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"7px" }}>
                  {["What is 7 + 8?", "Why is the sky blue?", "How do plants make food?", "Spell 'beautiful'", "What are the 5 senses?", "What is a fraction?"].map((q, i) => (
                    <button key={i} className="starter-q" onClick={() => setQuestion(q)} style={{
                      background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:"20px", padding:"5px 12px", cursor:"pointer",
                      color:"rgba(255,255,255,0.65)", fontSize:"12px", fontWeight:"600",
                      fontFamily:"'Nunito',sans-serif", transition:"all 0.2s",
                    }}>{q}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div style={{
                background:"rgba(255,179,71,0.08)", border:"1px solid rgba(255,179,71,0.2)",
                borderRadius:"20px", padding:"28px", textAlign:"center", animation:"slideUp 0.3s ease-out",
              }}>
                <div style={{ fontSize:"36px", marginBottom:"12px", animation:"float 2s ease-in-out infinite" }}>🌟</div>
                <div style={{ fontWeight:"800", fontSize:"16px", color:"#FFB347", marginBottom:"8px" }}>Starky is working on it...</div>
                <div style={{ display:"flex", gap:"6px", justifyContent:"center" }}>
                  {[0, 0.2, 0.4].map(d => (
                    <div key={d} style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#FFB347", animation:`pulse 1.2s ease-in-out ${d}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {/* ANSWER */}
            {answer && !loading && (
              <div ref={answerRef} style={{
                background: mode===MODE_PARENT ? "rgba(99,210,255,0.06)" : "rgba(255,179,71,0.08)",
                border: `1px solid ${mode===MODE_PARENT ? "rgba(99,210,255,0.25)" : "rgba(255,179,71,0.3)"}`,
                borderRadius:"20px", padding:"24px", animation:"slideUp 0.4s ease-out",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"18px", paddingBottom:"14px", borderBottom:"1px solid rgba(255,255,255,0.08)", flexWrap:"wrap" }}>
                  <div style={{
                    width:"42px", height:"42px", borderRadius:"50%",
                    background:"linear-gradient(135deg, #0D2040, #1A3A6B)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"22px", border:"2px solid rgba(255,179,71,0.5)", flexShrink:0,
                  }}>🌟</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:"900", fontSize:"15px" }}>Starky says:</div>
                    <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.45)", marginTop:"2px" }}>
                      {mode===MODE_PARENT ? "👩‍👦 For the parent" : `👦 For your ${selectedGrade.age}-year-old`}
                    </div>
                  </div>
                  <button onClick={() => { setAnswer(null); setHistory([]); }} style={{
                    background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)",
                    borderRadius:"10px", padding:"6px 12px", color:"rgba(255,255,255,0.5)",
                    cursor:"pointer", fontSize:"12px", fontFamily:"'Nunito',sans-serif", fontWeight:"700",
                  }}>New Question</button>
                </div>

                <div style={{ fontSize:"15px", lineHeight:"1.8", color:"rgba(255,255,255,0.88)" }}>
                  <FormatText text={answer} />
                </div>

                {/* Follow-up */}
                <div style={{ marginTop:"22px", paddingTop:"18px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize:"13px", fontWeight:"700", color:"rgba(255,255,255,0.45)", marginBottom:"10px" }}>🔄 Ask a follow-up question</div>
                  <div style={{ display:"flex", gap:"10px" }}>
                    <input
                      value={followUp}
                      onChange={e => setFollowUp(e.target.value)}
                      onKeyDown={e => e.key==="Enter" && askFollowUp()}
                      placeholder="e.g. Can you give another example?"
                      style={{
                        flex:1, background:"rgba(255,255,255,0.05)",
                        border:"1px solid rgba(255,179,71,0.3)", borderRadius:"12px",
                        padding:"11px 14px", color:"#fff", fontSize:"15px",
                        fontFamily:"'Nunito',sans-serif",
                      }}
                    />
                    <button onClick={askFollowUp} disabled={loading} style={{
                      background:"linear-gradient(135deg, #FFB347, #FF8E53)",
                      border:"none", borderRadius:"12px", padding:"11px 18px",
                      cursor:"pointer", fontWeight:"800", fontSize:"16px",
                      color:"#0D0800", fontFamily:"'Nunito',sans-serif", flexShrink:0,
                    }}>Ask →</button>
                  </div>

                  <div style={{ display:"flex", flexWrap:"wrap", gap:"7px", marginTop:"10px" }}>
                    {["Can you make it simpler?", "Give me another example", "Explain it as a story", "How do I check the answer?"].map((q, i) => (
                      <button key={i} onClick={() => askStarky(q)} className="starter-q" style={{
                        background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                        borderRadius:"20px", padding:"5px 12px", cursor:"pointer",
                        color:"rgba(255,255,255,0.6)", fontSize:"12px", fontWeight:"600",
                        fontFamily:"'Nunito',sans-serif", transition:"all 0.2s",
                      }}>{q}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TIP CARD */}
            {!answer && !loading && (
              <div style={{
                background:"rgba(255,179,71,0.07)", border:"1px solid rgba(255,179,71,0.2)",
                borderRadius:"18px", padding:"20px",
              }}>
                <div style={{ fontWeight:"800", fontSize:"14px", color:"#FFB347", marginBottom:"14px" }}>💡 Tips for using Homework Helper</div>
                {[
                  { tip:"Type the exact question", sub:"Copy the question from the textbook or worksheet exactly as written" },
                  { tip:"Choose the right mode", sub:"On mobile tap ⚙️ Settings in the nav to switch grade, subject and mode" },
                  { tip:"Ask follow-ups", sub:"If your child still doesn't get it, ask Starky to explain it as a story" },
                  { tip:"Works in any language", sub:"Type in Urdu, Arabic, or any language — Starky responds in the same language" },
                ].map((item, i) => (
                  <div key={i} style={{ display:"flex", gap:"12px", marginBottom:"10px" }}>
                    <div style={{
                      width:"22px", height:"22px", borderRadius:"50%",
                      background:"rgba(255,179,71,0.2)", color:"#FFB347",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"11px", fontWeight:"900", flexShrink:0, marginTop:"2px",
                    }}>{i+1}</div>
                    <div>
                      <div style={{ fontWeight:"800", fontSize:"13px", marginBottom:"2px" }}>{item.tip}</div>
                      <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", lineHeight:"1.5" }}>{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ CRAFT TAB ═══ */}
      {activeTab === "craft" && (
        <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"0 20px 80px" }}>
          <div style={{ textAlign:"center", marginBottom:"28px" }}>
            <h2 style={{ fontWeight:"900", fontSize:"clamp(20px,3vw,34px)", margin:"0 0 8px" }}>🎨 Art & Craft Activities</h2>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px" }}>Step-by-step creative activities — no special supplies needed</p>
          </div>

          {activeCraft === null ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:"16px" }}>
              {CRAFT_IDEAS.map((craft, i) => (
                <div key={i} className="craft-card" onClick={() => setActiveCraft(i)} style={{
                  background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,179,71,0.15)",
                  borderRadius:"20px", padding:"22px", cursor:"pointer", transition:"all 0.25s",
                }}>
                  <div style={{ fontSize:"44px", marginBottom:"12px", textAlign:"center" }}>{craft.emoji}</div>
                  <h3 style={{ fontWeight:"900", fontSize:"18px", margin:"0 0 10px", textAlign:"center" }}>{craft.title}</h3>
                  <div style={{ display:"flex", gap:"8px", justifyContent:"center", marginBottom:"14px" }}>
                    <span style={{ background:"rgba(255,179,71,0.15)", color:"#FFB347", borderRadius:"20px", padding:"3px 10px", fontSize:"11px", fontWeight:"800" }}>Age {craft.age}</span>
                    <span style={{ background:"rgba(168,224,99,0.15)", color:"#A8E063", borderRadius:"20px", padding:"3px 10px", fontSize:"11px", fontWeight:"800" }}>⏱ {craft.time}</span>
                  </div>
                  {craft.materials.slice(0, 3).map((m, j) => (
                    <div key={j} style={{ fontSize:"12px", color:"rgba(255,255,255,0.6)", marginBottom:"3px" }}>• {m}</div>
                  ))}
                  {craft.materials.length > 3 && <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)" }}>+{craft.materials.length-3} more...</div>}
                  <div style={{ marginTop:"14px", textAlign:"center", color:"#FFB347", fontSize:"13px", fontWeight:"800" }}>View Steps →</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ animation:"slideUp 0.35s ease-out" }}>
              <button onClick={() => setActiveCraft(null)} style={{
                background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)",
                borderRadius:"10px", padding:"8px 16px", cursor:"pointer",
                color:"rgba(255,255,255,0.6)", fontSize:"13px", fontFamily:"'Nunito',sans-serif",
                marginBottom:"18px", fontWeight:"700",
              }}>← All Activities</button>

              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,179,71,0.2)", borderRadius:"24px", padding:"28px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:"20px", marginBottom:"24px", flexWrap:"wrap" }}>
                  <div style={{ fontSize:"56px" }}>{CRAFT_IDEAS[activeCraft].emoji}</div>
                  <div style={{ flex:1 }}>
                    <h2 style={{ fontWeight:"900", fontSize:"clamp(20px,3vw,32px)", margin:"0 0 12px" }}>{CRAFT_IDEAS[activeCraft].title}</h2>
                    <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
                      <span style={{ background:"rgba(255,179,71,0.15)", color:"#FFB347", borderRadius:"20px", padding:"5px 14px", fontSize:"12px", fontWeight:"800" }}>👶 Age {CRAFT_IDEAS[activeCraft].age}+</span>
                      <span style={{ background:"rgba(168,224,99,0.15)", color:"#A8E063", borderRadius:"20px", padding:"5px 14px", fontSize:"12px", fontWeight:"800" }}>⏱ {CRAFT_IDEAS[activeCraft].time}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:"20px" }}>
                  <div style={{ background:"rgba(255,179,71,0.07)", border:"1px solid rgba(255,179,71,0.2)", borderRadius:"16px", padding:"20px" }}>
                    <div style={{ fontWeight:"900", fontSize:"14px", color:"#FFB347", marginBottom:"12px" }}>🛒 What You'll Need</div>
                    {CRAFT_IDEAS[activeCraft].materials.map((m, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px" }}>
                        <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#FFB347", flexShrink:0 }} />
                        <span style={{ fontSize:"14px", color:"rgba(255,255,255,0.8)" }}>{m}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:"rgba(168,224,99,0.07)", border:"1px solid rgba(168,224,99,0.2)", borderRadius:"16px", padding:"20px" }}>
                    <div style={{ fontWeight:"900", fontSize:"14px", color:"#A8E063", marginBottom:"12px" }}>💡 Parent Tips</div>
                    {["Lay newspaper down first — crafts get messy!", "Let your child lead — it doesn't have to be perfect", "Talk about what you're making as you go", "Take a photo of the finished result 📸"].map((tip, i) => (
                      <div key={i} style={{ display:"flex", gap:"8px", marginBottom:"8px" }}>
                        <span style={{ color:"#A8E063", fontSize:"13px" }}>✓</span>
                        <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.65)", lineHeight:"1.5" }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop:"24px" }}>
                  <div style={{ fontWeight:"900", fontSize:"17px", marginBottom:"16px" }}>📋 Step-by-Step Instructions</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                    {CRAFT_IDEAS[activeCraft].steps.map((step, i) => (
                      <div key={i} onClick={() => handleCopyStep(step, i)} style={{
                        background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
                        borderRadius:"14px", padding:"16px 18px",
                        display:"flex", gap:"14px", alignItems:"flex-start", cursor:"pointer", transition:"all 0.2s",
                      }}>
                        <div style={{
                          width:"32px", height:"32px", borderRadius:"50%",
                          background:"linear-gradient(135deg, #FFB347, #FF8E53)",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontWeight:"900", fontSize:"14px", color:"#0D0800", flexShrink:0,
                        }}>{i+1}</div>
                        <div style={{ flex:1, fontSize:"14px", lineHeight:"1.65", color:"rgba(255,255,255,0.85)", marginTop:"4px" }}>{step}</div>
                        <div style={{ fontSize:"11px", color:copiedStep===i ? "#A8E063" : "rgba(255,255,255,0.2)", fontWeight:"700", flexShrink:0, marginTop:"7px" }}>
                          {copiedStep===i ? "✓ Copied" : "Copy"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ padding:"20px 20px", borderTop:"1px solid rgba(255,255,255,0.06)", textAlign:"center" }}>
        <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.25)", margin:0 }}>
          New World Education · Founded by <span style={{ color:"rgba(255,255,255,0.4)", fontWeight:"700" }}>Khurram Badar</span> ·
          <a href="mailto:khurram@newworld.education" style={{ color:"rgba(255,179,71,0.5)", textDecoration:"none", marginLeft:"6px" }}>khurram@newworld.education</a>
        </p>
      </footer>
    </div>
    </>
  );
}

// ── Sidebar extracted as a component so it works in both desktop and drawer ──
function SidebarContent({ GRADES, SUBJECTS, selectedGrade, setSelectedGrade, selectedSubject, setSelectedSubject, mode, setMode, MODE_PARENT, MODE_CHILD }) {
  const accent = selectedGrade.color;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

      {/* Grade picker */}
      <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,179,71,0.2)", borderRadius:"18px", padding:"18px" }}>
        <div style={{ fontSize:"11px", fontWeight:"800", color:"rgba(255,179,71,0.8)", letterSpacing:"1px", marginBottom:"12px" }}>MY CHILD IS IN</div>
        <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
          {GRADES.map(g => (
            <button key={g.id} className="grade-btn" onClick={() => setSelectedGrade(g)} style={{
              background: selectedGrade.id===g.id ? `${g.color}22` : "rgba(255,255,255,0.04)",
              border: `2px solid ${selectedGrade.id===g.id ? g.color : "rgba(255,255,255,0.1)"}`,
              borderRadius:"12px", padding:"9px 12px", cursor:"pointer",
              display:"flex", alignItems:"center", gap:"10px",
              transition:"all 0.2s", fontFamily:"'Nunito',sans-serif",
            }}>
              <span style={{ fontSize:"18px" }}>{g.emoji}</span>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontWeight:"800", fontSize:"13px", color:selectedGrade.id===g.id ? g.color : "#fff" }}>{g.label}</div>
                {GRADE_UR[g.id] && <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)", direction:"rtl", textAlign:"left", marginTop:"1px" }}>{GRADE_UR[g.id]}</div>}
                <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)" }}>Age {g.age}</div>
              </div>
              {selectedGrade.id===g.id && <span style={{ marginLeft:"auto", color:g.color, fontSize:"15px" }}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Subject picker */}
      <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,179,71,0.2)", borderRadius:"18px", padding:"18px" }}>
        <div style={{ fontSize:"11px", fontWeight:"800", color:"rgba(255,179,71,0.8)", letterSpacing:"1px", marginBottom:"12px" }}>SUBJECT</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"7px" }}>
          {SUBJECTS.map(s => (
            <button key={s.id} className="subj-pill" onClick={() => setSelectedSubject(s)} style={{
              background: selectedSubject.id===s.id ? `${s.color}22` : "rgba(255,255,255,0.05)",
              border: `1px solid ${selectedSubject.id===s.id ? s.color : "rgba(255,255,255,0.12)"}`,
              borderRadius:"20px", padding:"6px 12px", cursor:"pointer",
              color: selectedSubject.id===s.id ? s.color : "rgba(255,255,255,0.55)",
              fontWeight:"700", fontSize:"12px", fontFamily:"'Nunito',sans-serif",
              transition:"all 0.2s", opacity:selectedSubject.id===s.id ? 1 : 0.8,
              display:"flex", flexDirection:"column", alignItems:"center", gap:"1px",
            }}>
              <span>{s.label}</span>
              {SUBJECT_UR[s.id] && <span style={{ fontSize:"10px", direction:"rtl", opacity:0.7 }}>{SUBJECT_UR[s.id]}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Mode picker */}
      <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,179,71,0.2)", borderRadius:"18px", padding:"18px" }}>
        <div style={{ fontSize:"11px", fontWeight:"800", color:"rgba(255,179,71,0.8)", letterSpacing:"1px", marginBottom:"12px" }}>WHO IS READING?</div>
        {[
          { id:MODE_PARENT, emoji:"👩‍👦", label:"Help me explain it", sub:"Starky explains to you so you can teach your child" },
          { id:MODE_CHILD,  emoji:"👦",   label:"Talk to my child",  sub:"Starky speaks directly to your little one" },
        ].map(m => (
          <button key={m.id} className="mode-btn" onClick={() => setMode(m.id)} style={{
            width:"100%", background:mode===m.id ? "rgba(255,179,71,0.15)" : "rgba(255,255,255,0.04)",
            border:`2px solid ${mode===m.id ? "#FFB347" : "rgba(255,255,255,0.1)"}`,
            borderRadius:"12px", padding:"12px", cursor:"pointer",
            display:"flex", alignItems:"center", gap:"10px",
            fontFamily:"'Nunito',sans-serif", marginBottom:"8px", transition:"all 0.2s",
          }}>
            <span style={{ fontSize:"22px" }}>{m.emoji}</span>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontWeight:"800", fontSize:"13px", color:mode===m.id ? "#FFB347" : "#fff" }}>{m.label}</div>
              <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", lineHeight:"1.4", marginTop:"2px" }}>{m.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
