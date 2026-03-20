/**
 * motherTongue.js
 * Pakistani mother tongue support for language learning.
 * Allows users to learn foreign languages using their native language as the base.
 *
 * Supported base languages:
 *   English, Urdu, Sindhi, Punjabi, Pashto, Balochi, Saraiki
 *
 * Usage:
 *   import { MOTHER_TONGUES, getTranslation, UI_STRINGS } from '../utils/motherTongue';
 *   const meaning = getTranslation('hello', 'fr', 'sindhi'); // Returns Sindhi translation
 */

export const MOTHER_TONGUES = [
  { id: 'en', name: 'English', native: 'English', flag: '🇬🇧', dir: 'ltr' },
  { id: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰', dir: 'rtl' },
  { id: 'sd', name: 'Sindhi', native: 'سنڌي', flag: '🇵🇰', dir: 'rtl' },
  { id: 'pa', name: 'Punjabi', native: 'پنجابی', flag: '🇵🇰', dir: 'rtl' },
  { id: 'ps', name: 'Pashto', native: 'پښتو', flag: '🇵🇰', dir: 'rtl' },
  { id: 'bal', name: 'Balochi', native: 'بلوچی', flag: '🇵🇰', dir: 'rtl' },
  { id: 'skr', name: 'Saraiki', native: 'سرائیکی', flag: '🇵🇰', dir: 'rtl' },
];

// UI strings in each mother tongue — used for buttons, instructions, feedback
export const UI_STRINGS = {
  en: {
    tapCorrect: 'Tap the correct answer',
    listenChoose: 'Listen and choose',
    buildSentence: 'Build the sentence',
    fillBlank: 'Fill in the blank',
    matchPairs: 'Match the pairs',
    speakWord: 'Say this word',
    correct: 'Correct!',
    almostRight: 'Almost! Try again',
    notQuite: 'Not quite',
    hearAgain: 'Hear again',
    hint: 'Hint',
    nextWord: 'Next',
    tryAgain: 'Try again',
    wellDone: 'Well done!',
    amazing: 'Amazing!',
    keepGoing: 'Keep going!',
    hearts: 'Hearts',
    score: 'Score',
    yourLanguage: 'Your language',
    learnIn: 'Learn in',
    check: 'Check',
    continueBtn: 'Continue →',
    startLearning: 'Start Learning!',
    backToJourney: 'Back to journey',
    gotIt: 'Got it',
    playPhrase: 'Play phrase',
    listenFirst: 'Listen first',
    tapMic: 'Tap the microphone',
    matchAllPairs: 'Match all pairs',
    done: 'Done',
    startJourney: 'Start my journey →',
  },
  ur: {
    tapCorrect: 'صحیح جواب پر ٹیپ کریں',
    listenChoose: 'سنیں اور چنیں',
    buildSentence: 'جملہ بنائیں',
    fillBlank: 'خالی جگہ پُر کریں',
    matchPairs: 'جوڑے ملائیں',
    speakWord: 'یہ لفظ بولیں',
    correct: '!بالکل صحیح',
    almostRight: '!قریب قریب! دوبارہ کوشش کریں',
    notQuite: 'بالکل نہیں',
    hearAgain: 'دوبارہ سنیں',
    hint: 'اشارہ',
    nextWord: 'اگلا',
    tryAgain: 'دوبارہ کوشش کریں',
    wellDone: '!شاباش',
    amazing: '!لاجواب',
    keepGoing: '!جاری رکھیں',
    hearts: 'دل',
    score: 'اسکور',
    yourLanguage: 'آپ کی زبان',
    learnIn: 'سیکھیں',
    check: 'چیک کریں',
    continueBtn: 'اگلا →',
    startLearning: '!سیکھنا شروع کریں',
    backToJourney: 'سفر پر واپس',
    gotIt: 'سمجھ آ گیا',
    playPhrase: 'جملہ سنیں',
    listenFirst: 'پہلے سنیں',
    tapMic: 'مائیکروفون دبائیں',
    matchAllPairs: 'سب جوڑے ملائیں',
    done: 'ہو گیا',
    startJourney: 'سفر شروع کریں →',

  },
  sd: {
    tapCorrect: 'صحيح جواب تي ٽيپ ڪريو',
    listenChoose: 'ٻڌو ۽ چونڊيو',
    buildSentence: 'جملو ٺاهيو',
    fillBlank: 'خالي جاءِ ڀريو',
    matchPairs: 'جوڙا ملايو',
    speakWord: 'هي لفظ چئو',
    correct: '!بلڪل صحيح',
    almostRight: '!ويجهو ويجهو! ٻيهر ڪوشش ڪريو',
    notQuite: 'بلڪل نه',
    hearAgain: 'ٻيهر ٻڌو',
    hint: 'اشارو',
    nextWord: 'اڳيون',
    tryAgain: 'ٻيهر ڪوشش ڪريو',
    wellDone: '!شاباش',
    amazing: '!لاجواب',
    keepGoing: '!جاري رکو',
    hearts: 'دل',
    score: 'اسڪور',
    yourLanguage: 'توهان جي ٻولي',
    learnIn: 'سکو',
    check: 'چيڪ ڪريو',
    continueBtn: 'اڳيون →',
    startLearning: '!سکڻ شروع ڪريو',
    backToJourney: 'سفر تي واپس',
    gotIt: 'سمجھ ۾ آيو',
    playPhrase: 'جملو ٻڌو',
    listenFirst: 'پهريان ٻڌو',
    tapMic: 'مائيڪروفون دٻايو',
    matchAllPairs: 'سڀ جوڙا ملايو',
    done: 'ٿي ويو',
    startJourney: 'سفر شروع ڪريو →',

  },
  pa: {
    tapCorrect: 'صحیح جواب تے ٹیپ کرو',
    listenChoose: 'سنو تے چنو',
    buildSentence: 'جملہ بناؤ',
    fillBlank: 'خالی جگہ بھرو',
    matchPairs: 'جوڑے ملاؤ',
    speakWord: 'ایہ لفظ بولو',
    correct: '!بالکل صحیح',
    almostRight: '!نیڑے نیڑے! فیر کوشش کرو',
    notQuite: 'بالکل نئیں',
    hearAgain: 'فیر سنو',
    hint: 'اشارہ',
    nextWord: 'اگلا',
    tryAgain: 'فیر کوشش کرو',
    wellDone: '!شاباش',
    amazing: '!کمال',
    keepGoing: '!جاری رکھو',
    hearts: 'دل',
    score: 'سکور',
    yourLanguage: 'تہاڈی بولی',
    learnIn: 'سکھو',
    check: 'چیک کرو',
    continueBtn: 'اگلا →',
    startLearning: '!سکھنا شروع کرو',
    backToJourney: 'سفر تے واپس',
    gotIt: 'سمجھ آ گئی',
    playPhrase: 'جملہ سنو',
    listenFirst: 'پہلاں سنو',
    tapMic: 'مائیکروفون دبو',
    matchAllPairs: 'سب جوڑے ملاؤ',
    done: 'ہو گیا',
    startJourney: 'سفر شروع کرو →',

  },
  ps: {
    tapCorrect: 'سمه ځواب باندې ټپ وکړئ',
    listenChoose: 'واورئ او غوره کړئ',
    buildSentence: 'جمله جوړ کړئ',
    fillBlank: 'خالي ځای ډک کړئ',
    matchPairs: 'جوړه کړئ',
    speakWord: 'دا لفظ ووایاست',
    correct: '!بالکل سمه',
    almostRight: '!نږدې نږدې! بیا هڅه وکړئ',
    notQuite: 'بالکل نه',
    hearAgain: 'بیا واورئ',
    hint: 'اشاره',
    nextWord: 'بل',
    tryAgain: 'بیا هڅه وکړئ',
    wellDone: '!شاباش',
    amazing: '!عالي',
    keepGoing: '!دوام ورکړئ',
    hearts: 'زړونه',
    score: 'سکور',
    yourLanguage: 'ستاسو ژبه',
    learnIn: 'زده کړئ',
    check: 'وګورئ',
    continueBtn: 'بل →',
    startLearning: '!زده کړه پیل کړئ',
    backToJourney: 'سفر ته واپس',
    gotIt: 'پوه شوم',
    playPhrase: 'جمله واورئ',
    listenFirst: 'لومړی واورئ',
    tapMic: 'مایکروفون کیکاږئ',
    matchAllPairs: 'ټول جوړه کړئ',
    done: 'شو',
    startJourney: 'سفر پیل کړئ →',

  },
  bal: {
    tapCorrect: 'راست جواب ءَ تیپ کنیت',
    listenChoose: 'گوش بکنیت و چاگرد بکنیت',
    buildSentence: 'جمله جوڑ بکنیت',
    fillBlank: 'هالیگ جاه ءَ پُر بکنیت',
    matchPairs: 'جوڑ بکنیت',
    speakWord: 'اے لبز ءَ بگوشیت',
    correct: '!بلکل راست',
    almostRight: '!نزّیک! پدا کوشست بکنیت',
    notQuite: 'بلکل نه',
    hearAgain: 'پدا گوش بکنیت',
    hint: 'اشاره',
    nextWord: 'بعدی',
    tryAgain: 'پدا کوشست بکنیت',
    wellDone: '!شاباش',
    amazing: '!شگفت',
    keepGoing: '!دوام بدئیت',
    hearts: 'دل',
    score: 'اسکور',
    yourLanguage: 'شمئی زبان',
    learnIn: 'بوانیت',
    check: 'چيڪ بکنيت',
    continueBtn: 'بعدي →',
    startLearning: '!بوانت شروع بکنيت',
    backToJourney: 'سفر ءَ واپس',
    gotIt: 'سمجھ بوت',
    playPhrase: 'جمله گوش بکنيت',
    listenFirst: 'اول گوش بکنيت',
    tapMic: 'مائيکروفون ءَ دب بکنيت',
    matchAllPairs: 'سجلهين جوڑ بکنيت',
    done: 'بوت',
    startJourney: 'سفر شروع بکنيت →',

  },
  skr: {
    tapCorrect: 'صحیح جواب تے ٹیپ کرو',
    listenChoose: 'سنو تے چنو',
    buildSentence: 'جملہ بناؤ',
    fillBlank: 'خالی جگہ بھرو',
    matchPairs: 'جوڑے ملاؤ',
    speakWord: 'ایہ لفظ بولو',
    correct: '!بالکل صحیح',
    almostRight: '!نیڑے نیڑے! ولا کوشش کرو',
    notQuite: 'بالکل کائنی',
    hearAgain: 'ولا سنو',
    hint: 'اشارہ',
    nextWord: 'اگلا',
    tryAgain: 'ولا کوشش کرو',
    wellDone: '!شاباش',
    amazing: '!کمال',
    keepGoing: '!جاری رکھو',
    hearts: 'دل',
    score: 'سکور',
    yourLanguage: 'تھاݙی بولی',
    learnIn: 'سکھو',
    check: 'چیک کرو',
    continueBtn: 'اگلا →',
    startLearning: '!سکھنا شروع کرو',
    backToJourney: 'سفر تے واپس',
    gotIt: 'سمجھ آ ڳئی',
    playPhrase: 'جملہ سنو',
    listenFirst: 'پہلاں سنو',
    tapMic: 'مائیکروفون دبو',
    matchAllPairs: 'سب جوڑے ملاؤ',
    done: 'تھی ڳیا',
    startJourney: 'سفر شروع کرو →',

  },
};

// Core word translations — meanings in each Pakistani language
// Format: { english: { ur: 'urdu', sd: 'sindhi', pa: 'punjabi', ps: 'pashto' } }
export const WORD_TRANSLATIONS = {
  // Greetings
  'Hello': { ur: 'ہیلو / سلام', sd: 'سلام / هيلو', pa: 'سلام / ہیلو', ps: 'سلام / ستړی مشې', bal: 'سلام', skr: 'سلام / ہیلو' },
  'Goodbye': { ur: 'خدا حافظ', sd: 'خدا حافظ', pa: 'اللہ حافظ', ps: 'په مخه دې ښه', bal: 'خدا حافظ', skr: 'اللہ حافظ' },
  'Thank you': { ur: 'شکریہ', sd: 'مهرباني', pa: 'شکریہ', ps: 'مننه', bal: 'مهربانی', skr: 'شکریہ' },
  'Please': { ur: 'براہ کرم', sd: 'مهرباني ڪري', pa: 'مہربانی', ps: 'مهرباني وکړئ', bal: 'مهربانی', skr: 'مہربانی' },
  'Yes': { ur: 'ہاں / جی', sd: 'ها', pa: 'ہاں / جی', ps: 'هو', bal: 'بلے', skr: 'ہاں / جی' },
  'No': { ur: 'نہیں', sd: 'نه', pa: 'نئیں', ps: 'نه', bal: 'نه', skr: 'کائنی' },

  // Common words used in exercises
  'Hello, my name is…': { ur: 'ہیلو، میرا نام ہے…', sd: 'هيلو، منهنجو نالو آهي…', pa: 'ہیلو، میرا ناں اے…', ps: 'سلام، زما نوم دی…', bal: 'سلام، منی نام اِنت…', skr: 'ہیلو، میرا ناں ہے…' },
  'The bill please': { ur: 'بل دے دیں', sd: 'بل ڏيو', pa: 'بل دے دیو', ps: 'بل راکړئ', bal: 'بل بدئیت', skr: 'بل دے ڈیو' },
  'Where is the metro?': { ur: 'میٹرو کہاں ہے؟', sd: 'ميٽرو ڪٿي آهي؟', pa: 'میٹرو کتھے اے؟', ps: 'میټرو چیرته ده؟', bal: 'میٹرو کجا اِنت؟', skr: 'میٹرو کتھاں ہے؟' },
  'I don\'t understand': { ur: 'مجھے سمجھ نہیں آیا', sd: 'مون کي سمجھ ۾ نه آيو', pa: 'مینوں سمجھ نئیں آئی', ps: 'ما ته پوه نه شوم', bal: 'من ءَ پهم نه بوت', skr: 'میکوں سمجھ نئیں آئی' },
  'Can you repeat?': { ur: 'کیا آپ دہرا سکتے ہیں؟', sd: 'ڇا توهان ورجائي سگهو ٿا؟', pa: 'کیا تسیں دوبارہ کہہ سکدے او؟', ps: 'تاسو بیا ویلای شئ؟', bal: 'شما پدا گوشت بکنیت؟', skr: 'کیا تساں ولا کہہ سکدے او؟' },
  'Thank you very much': { ur: 'بہت بہت شکریہ', sd: 'تمام گھڻي مهرباني', pa: 'بوہت بوہت شکریہ', ps: 'ډیره مننه', bal: 'گیشتر مهربانی', skr: 'بوہت بوہت شکریہ' },

  // Food & drink
  'A coffee, please': { ur: 'ایک کافی دیں', sd: 'هڪ ڪافي ڏيو', pa: 'اک کافی دیو', ps: 'یوه قهوه راکړئ', bal: 'یک قهوه بدئیت', skr: 'اک کافی ڈیو' },
  'Water': { ur: 'پانی', sd: 'پاڻي', pa: 'پانی', ps: 'اوبه', bal: 'آپ', skr: 'پانی' },
  'The menu please': { ur: 'مینیو دکھائیں', sd: 'مينيو ڏيکاريو', pa: 'مینیو دکھاؤ', ps: 'مینو راکړئ', bal: 'مینیو بدئیت', skr: 'مینیو ڈکھاؤ' },

  // Directions
  'On the left': { ur: 'بائیں طرف', sd: 'کاٻي پاسي', pa: 'کھبے پاسے', ps: 'کیڼ لاس ته', bal: 'چپ دستا', skr: 'کھبے پاسے' },
  'Straight ahead': { ur: 'سیدھا آگے', sd: 'سڌو اڳتي', pa: 'سیدھا اگے', ps: 'مخ په وړاندې', bal: 'سیدا پیش ءَ', skr: 'سیدھا اگے' },
  'Help!': { ur: 'مدد!', sd: 'مدد!', pa: 'مدد!', ps: 'مرسته!', bal: 'کمک!', skr: 'مدد!' },

  // Animals (for young learners)
  'A small furry pet': { ur: 'ایک چھوٹا پالتو جانور', sd: 'هڪ ننڍو پالتو جانور', pa: 'اک نکا پالتو جانور', ps: 'یو کوچنی کورنی حیوان', bal: 'یک هُرد پالگ جانور', skr: 'اک نکا پالتو جانور' },
  'A loyal pet animal': { ur: 'ایک وفادار پالتو جانور', sd: 'هڪ وفادار پالتو جانور', pa: 'اک وفادار پالتو جانور', ps: 'یو وفادار کورنی حیوان', bal: 'یک وفادار پالگ جانور', skr: 'اک وفادار پالتو جانور' },
  'The bright star in our sky': { ur: 'ہمارے آسمان کا روشن ستارہ', sd: 'اسان جي آسمان جو روشن تارو', pa: 'ساڈے اسمان دا چمکدا تارا', ps: 'زموږ د اسمان روښانه ستوری', bal: 'ما ئی آسمان ئی روشنیں استار', skr: 'ساݙے اسمان دا چمکدا تارا' },
};

/**
 * Get translation of a meaning/phrase in the user's mother tongue.
 * Falls back to English if translation not available.
 */
export function getTranslation(englishText, motherTongueId) {
  if (motherTongueId === 'en') return englishText;
  const translations = WORD_TRANSLATIONS[englishText];
  if (translations && translations[motherTongueId]) {
    return translations[motherTongueId];
  }
  // Try Urdu as fallback for all Pakistani languages (widely understood)
  if (translations && translations.ur && motherTongueId !== 'en') {
    return translations.ur;
  }
  return englishText;
}

/**
 * Get UI string in the user's mother tongue.
 */
export function getUIString(key, motherTongueId) {
  const strings = UI_STRINGS[motherTongueId] || UI_STRINGS.en;
  return strings[key] || UI_STRINGS.en[key] || key;
}
