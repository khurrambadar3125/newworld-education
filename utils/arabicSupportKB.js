/**
 * utils/arabicSupportKB.js
 * UAE Arabic Support Knowledge Base
 *
 * For UAE students studying Arabic as a subject (both Arabic B and First Language).
 * Starky explains Arabic concepts in English. Never generates paragraphs of Arabic.
 * May include individual Arabic words/short phrases (1-5 words) to illustrate.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// STARKY'S ARABIC IDENTITY — CRITICAL RULES
// ═══════════════════════════════════════════════════════════════════════════════

export const ARABIC_IDENTITY_RULES = {
  canDo: [
    'Explain Arabic grammar rules clearly in English',
    'Show individual Arabic words or short phrases (1-5 words) to illustrate a point',
    'Help students understand their Arabic class content',
    'Prepare students for Arabic tests and EmSAT Arabic',
    'Build vocabulary through themed English explanations',
    'Discuss Arabic literature themes, characters, and significance — in English',
    'Explain verb conjugation patterns with tables',
  ],
  cannotDo: [
    'Generate paragraphs of Arabic text',
    'Claim to be a native Arabic speaker or Arabic teacher',
    'Write essays or long passages in Arabic for the student',
    'Replace the student\'s Arabic teacher',
  ],
  openingStatement: 'I can help you understand your Arabic class — let me explain this in a way that makes sense.',
  writingRequest: 'I can help you understand Arabic concepts and prepare for your class, but for writing practice, it\'s best to write yourself and bring your work to me — then I can help you check if the concept is right. What grammar topic should we work on today?',
};

// ═══════════════════════════════════════════════════════════════════════════════
// ARABIC GRAMMAR RULES — explained in English
// ═══════════════════════════════════════════════════════════════════════════════

export const ARABIC_GRAMMAR_RULES = {
  // ── PRIMARY STAGE (Grade 1-5, Arabic B) ──
  primary: {
    sunMoonLetters: {
      name: 'Sun and Moon Letters',
      arabic: 'الحروف الشمسية والقمرية',
      explanation: 'When you add "al" (the) before a word, some letters "absorb" the "l" sound. Sun letters: ت ث د ذ ر ز س ش ص ض ط ظ ل ن — the "l" disappears and the first letter doubles. Moon letters: all others — the "l" stays. Example: الشمس is "ash-shams" not "al-shams" (sun letter). القمر is "al-qamar" (moon letter — the "l" stays).',
      commonMistake: 'Students say "al-shams" instead of "ash-shams" — remind them: if it\'s a sun letter, the "l" vanishes.',
    },
    genderSystem: {
      name: 'Gender in Arabic',
      arabic: 'المذكر والمؤنث',
      explanation: 'Every Arabic noun is either masculine or feminine. Most feminine nouns end in ة (taa marbuta). Examples: مدرسة (school — feminine), كتاب (book — masculine), معلمة (female teacher — feminine), معلم (male teacher — masculine). Adjectives MUST match: كتاب كبير (big book — masculine), مدرسة كبيرة (big school — feminine).',
      commonMistake: 'Students forget to add ة to adjectives when describing feminine nouns.',
    },
    definiteArticle: {
      name: 'The Definite Article "al"',
      arabic: 'أداة التعريف ال',
      explanation: 'Arabic has no word for "a/an" — a noun without "al" is automatically indefinite. Add ال to make it definite. كتاب = a book. الكتاب = the book. When a noun has "al", its adjective must also have "al": الكتاب الكبير (the big book).',
    },
    sentenceTypes: {
      name: 'Two Types of Arabic Sentences',
      arabic: 'الجملة الاسمية والجملة الفعلية',
      explanation: 'Nominal sentence (الجملة الاسمية): starts with a noun. الكتاب كبير = The book is big. There is NO "is" in Arabic — the sentence just has subject + predicate. Verbal sentence (الجملة الفعلية): starts with a verb. كتب الولد = The boy wrote. Verb comes FIRST, then subject.',
      commonMistake: 'Students try to add "is/am/are" — Arabic doesn\'t use these in present tense.',
    },
    singularDualPlural: {
      name: 'Singular, Dual, and Plural',
      arabic: 'المفرد والمثنى والجمع',
      explanation: 'Arabic has THREE number forms (English only has two). Singular: كتاب (one book). Dual: كتابان (two books — add ان). Plural: كتب (three or more books). The dual form is unique to Arabic — whenever there are exactly two of something, you use a special ending.',
    },
  },

  // ── INTERMEDIATE STAGE (Grade 6-9, Arabic B) ──
  intermediate: {
    verbConjugation: {
      name: 'Verb Conjugation — Past Tense',
      arabic: 'تصريف الفعل الماضي',
      explanation: 'Arabic verbs have a 3-letter root. The root ك-ت-ب means "writing". Past tense: كَتَبَ (kataba) = he wrote. كَتَبَتْ (katabat) = she wrote. كَتَبْتُ (katabtu) = I wrote. كَتَبْنا (katabna) = we wrote. كَتَبُوا (katabu) = they (m) wrote. The ROOT stays the same — only the endings change.',
      commonMistake: 'Students memorise each form separately instead of learning the pattern. Teach the pattern: the root stays, the prefix/suffix changes.',
    },
    verbConjugationPresent: {
      name: 'Verb Conjugation — Present Tense',
      arabic: 'تصريف الفعل المضارع',
      explanation: 'Present tense adds a PREFIX before the root. يَكْتُبُ (yaktubu) = he writes (prefix يـ). تَكْتُبُ (taktubu) = she writes (prefix تـ). أَكْتُبُ (aktubu) = I write (prefix أ). نَكْتُبُ (naktubu) = we write (prefix نـ). Pattern: PREFIX + root + vowel pattern.',
    },
    threeLetterRoot: {
      name: 'The 3-Letter Root System',
      arabic: 'الجذر الثلاثي',
      explanation: 'This is the KEY to Arabic vocabulary. Most words come from a 3-letter root. Root ك-ت-ب (k-t-b) = concept of writing. كَتَبَ = he wrote. كِتاب = book. كاتِب = writer. مَكتَبة = library. مَكتوب = written/letter. Once you know the root, you can guess related words. This is Arabic\'s superpower — and the fastest way to build vocabulary.',
    },
    conjunctions: {
      name: 'Conjunctions',
      arabic: 'حروف العطف والربط',
      explanation: 'و (wa) = and — most common. أو (aw) = or. لكن (lakin) = but. لأن (li-anna) = because. ثم (thumma) = then/next. Example: أحب القراءة لكن لا أحب الكتابة = I love reading but I don\'t love writing.',
    },
    prepositions: {
      name: 'Prepositions',
      arabic: 'حروف الجر',
      explanation: 'في (fi) = in. على (\'ala) = on. من (min) = from. إلى (ila) = to. عن (\'an) = about. بـ (bi) = with/by. لـ (li) = for. CRITICAL: prepositions put the following noun in the genitive case (مجرور). Students don\'t need to worry about case endings yet — just learn which preposition means what.',
    },
    innaAndSisters: {
      name: 'Inna and Its Sisters',
      arabic: 'إنَّ وأخواتها',
      explanation: 'Six particles that change how a nominal sentence works. إنَّ (inna) = indeed/verily. أنَّ (anna) = that. لكنَّ (lakinna) = but. كأنَّ (ka-anna) = as if. ليتَ (layta) = if only. لعلَّ (la\'alla) = perhaps. What they do: the noun after them takes the accusative case (منصوب). Example: إنَّ الكتابَ كبير = Indeed, the book is big. The "book" gets a fatha ending.',
      commonMistake: 'Students forget that the noun after إنَّ changes its ending — this is a common test question.',
    },
    kanaAndSisters: {
      name: 'Kana and Its Sisters',
      arabic: 'كانَ وأخواتها',
      explanation: 'Verbs that go at the start of a nominal sentence and put the predicate in the accusative case. كانَ (kana) = was. أصبح (asbaha) = became. ما زال (ma zala) = still is. ليس (laysa) = is not. Example: كان الولدُ سعيداً = The boy was happy. "Boy" stays nominative (مرفوع), "happy" becomes accusative (منصوب).',
    },
    brokenPlurals: {
      name: 'Broken Plurals',
      arabic: 'جمع التكسير',
      explanation: 'Arabic has TWO types of plurals. Sound plural: just add an ending (ون for masculine, ات for feminine). Broken plural: the WORD ITSELF changes shape. كتاب → كتب (books). ولد → أولاد (boys). بيت → بيوت (houses). There are 30+ broken plural patterns. Bad news: you mostly just have to memorise them. Good news: common ones repeat.',
      commonMistake: 'Students try to apply English logic (just add -s). Arabic plurals are unpredictable — flashcards are the best strategy.',
    },
  },

  // ── SECONDARY STAGE (Grade 10-12, Arabic First Language) ──
  secondary: {
    irab: {
      name: 'I\'rab — Grammatical Case Analysis',
      arabic: 'الإعراب',
      explanation: 'The system of showing a word\'s grammatical role through its ending. Three cases: Nominative (مرفوع — subject, predicate of nominal sentence) marked with damma ُ. Accusative (منصوب — object, predicate after كان/إن) marked with fatha َ. Genitive (مجرور — after prepositions, in possessive constructions) marked with kasra ِ. This is the most tested grammar topic in Grade 10-12 and EmSAT Arabic.',
      commonMistake: 'Students memorise case names but can\'t apply them to real sentences. Practice: take any sentence and identify why each word has its case.',
    },
    verbMoods: {
      name: 'Verb Moods',
      arabic: 'إعراب الفعل المضارع',
      explanation: 'Present tense verbs have THREE moods. Indicative (مرفوع): default mood, ends with damma. يكتبُ = he writes. Subjunctive (منصوب): after particles like أن, لن, كي, حتى. Ends with fatha. لن يكتبَ = he will not write. Jussive (مجزوم): after لم, لا الناهية, إذا. Ends with sukun. لم يكتبْ = he did not write.',
    },
    passiveVoice: {
      name: 'Passive Voice',
      arabic: 'الفعل المبني للمجهول',
      explanation: 'Arabic passive changes the vowel pattern of the verb. Active: كَتَبَ (kataba) = he wrote. Passive: كُتِبَ (kutiba) = it was written. Active present: يَكْتُبُ (yaktubu). Passive present: يُكْتَبُ (yuktabu). The subject of the passive verb is called نائب الفاعل (deputy subject) and takes the nominative case.',
    },
    rhetoric: {
      name: 'Rhetoric and Literary Devices',
      arabic: 'البلاغة',
      explanation: 'Three branches of Arabic rhetoric. بيان (Bayan — imagery): تشبيه (simile), استعارة (metaphor), كناية (allusion). معاني (Ma\'ani — meaning): خبر (declarative), إنشاء (non-declarative), إيجاز (conciseness), إطناب (elaboration). بديع (Badi\' — embellishment): طباق (antithesis), جناس (paronomasia), سجع (rhymed prose). These are tested in Arabic First Language exams — students must identify devices in poetry and prose.',
    },
    conditionals: {
      name: 'Conditional Sentences',
      arabic: 'أسلوب الشرط',
      explanation: 'If/then constructions. Two types: Definite conditional particles: إذا (idha — if/when, for likely events). Jussive conditional particles: إن (in — if, for unlikely events), من (man — whoever), ما (ma — whatever), مهما (mahma — whatever). Structure: particle + condition verb + answer verb. Both verbs go into jussive mood (مجزوم). إن تدرسْ تنجحْ = If you study, you will succeed.',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// UAE ARABIC VOCABULARY — themed lists explained in English
// ═══════════════════════════════════════════════════════════════════════════════

export const UAE_ARABIC_VOCABULARY = {
  greetings: [
    { arabic: 'السلام عليكم', transliteration: 'assalamu alaykum', english: 'Peace be upon you — formal Islamic greeting' },
    { arabic: 'مرحبا', transliteration: 'marhaba', english: 'Hello — general greeting' },
    { arabic: 'هلا', transliteration: 'hala', english: 'Hi/Welcome — Emirati informal' },
    { arabic: 'كيف حالك', transliteration: 'kayf halak/halik', english: 'How are you? (m/f)' },
    { arabic: 'شكراً', transliteration: 'shukran', english: 'Thank you' },
    { arabic: 'عفواً', transliteration: 'afwan', english: 'You\'re welcome / Excuse me' },
  ],
  school: [
    { arabic: 'كتاب', transliteration: 'kitab', english: 'book', root: 'ك-ت-ب (writing)' },
    { arabic: 'قلم', transliteration: 'qalam', english: 'pen', root: 'ق-ل-م (cutting/writing)' },
    { arabic: 'مدرسة', transliteration: 'madrasa', english: 'school', root: 'د-ر-س (studying)' },
    { arabic: 'معلم', transliteration: 'mu\'allim', english: 'teacher (m)', root: 'ع-ل-م (knowledge)' },
    { arabic: 'طالب', transliteration: 'talib', english: 'student (m)', root: 'ط-ل-ب (seeking)' },
    { arabic: 'صف', transliteration: 'saff', english: 'classroom/grade' },
    { arabic: 'واجب', transliteration: 'wajib', english: 'homework/duty' },
    { arabic: 'امتحان', transliteration: 'imtihan', english: 'exam' },
  ],
  uaeCulture: [
    { arabic: 'مجلس', transliteration: 'majlis', english: 'sitting room — Emirati cultural gathering place' },
    { arabic: 'فلج', transliteration: 'falaj', english: 'irrigation channel — traditional water system' },
    { arabic: 'برجيل', transliteration: 'barajeel', english: 'wind tower — traditional air conditioning' },
    { arabic: 'سوق', transliteration: 'souq', english: 'market — traditional marketplace' },
    { arabic: 'عبايا', transliteration: 'abaya', english: 'traditional women\'s outer garment' },
    { arabic: 'كندورة', transliteration: 'kandura', english: 'traditional men\'s garment' },
    { arabic: 'غترة', transliteration: 'ghutra', english: 'traditional men\'s head covering' },
    { arabic: 'عقال', transliteration: 'agal', english: 'cord worn over ghutra' },
    { arabic: 'يلا', transliteration: 'yalla', english: 'let\'s go — most common Gulf expression' },
    { arabic: 'خليجي', transliteration: 'khaleeji', english: 'Gulf Arab' },
  ],
  islamicTerms: [
    { arabic: 'ما شاء الله', transliteration: 'masha\'Allah', english: 'God has willed it — expression of appreciation' },
    { arabic: 'إن شاء الله', transliteration: 'insha\'Allah', english: 'If God wills — used for future plans' },
    { arabic: 'الحمد لله', transliteration: 'alhamdulillah', english: 'Praise be to God — gratitude expression' },
    { arabic: 'بسم الله', transliteration: 'bismillah', english: 'In the name of God — said before starting' },
    { arabic: 'سبحان الله', transliteration: 'subhan\'Allah', english: 'Glory to God — expression of wonder' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// EmSAT ARABIC TOPICS
// ═══════════════════════════════════════════════════════════════════════════════

export const EMSAT_ARABIC_TOPICS = {
  sections: {
    readingComprehension: { weight: '40%', arabic: 'فهم المقروء', desc: 'Academic passages — literary, informational, persuasive. Students must extract main ideas, infer meaning, identify author purpose.' },
    grammar: { weight: '30%', arabic: 'التطبيق النحوي', desc: 'I\'rab (case analysis), verb conjugation, inna/kana and sisters, conditional sentences, passive voice, relative pronouns.' },
    writing: { weight: '30%', arabic: 'الكتابة', desc: 'Formal Arabic essay: introduction (مقدمة), body with 2-3 main ideas (عرض), conclusion (خاتمة). MSA not dialect.' },
  },
  starkyStrategy: 'Starky explains what each section tests. Drills grammar rules in English. Builds vocabulary through themed sessions. Explains essay structure for the writing section. All explanations in English — Arabic words shown only as examples.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// ARABIC LITERATURE — themes explained in English
// ═══════════════════════════════════════════════════════════════════════════════

export const ARABIC_LITERATURE = {
  classical: [
    { title: 'The Suspended Odes (المعلقات)', author: 'Various (pre-Islamic)', significance: 'Seven long poems considered the pinnacle of Arabic poetry. Hung on the Kaaba walls. Students study: Imru al-Qays (love and nature), Antara (bravery and honour), Zuhayr (wisdom and peace).' },
    { title: 'Al-Mutanabbi Poetry', author: 'Al-Mutanabbi (915-965 CE)', significance: 'Most famous classical Arab poet. Known for pride, wit, and political commentary. His line "I am the one whose literature the blind can see" is famous. Widely taught in UAE Grade 10-12.' },
  ],
  modern: [
    { title: 'The Days (الأيام)', author: 'Taha Hussein', significance: 'Autobiography of blind Egyptian scholar. Most widely taught modern Arabic text in UAE and across Arab world. Themes: education, perseverance, rural vs urban Egypt.' },
    { title: 'Midaq Alley (زقاق المدق)', author: 'Naguib Mahfouz', significance: 'Nobel Prize winner. Egyptian social realism. Themes: poverty, ambition, tradition vs modernity. Mahfouz is the most studied Arab novelist globally.' },
    { title: 'Broken Wings (الأجنحة المتكسرة)', author: 'Gibran Khalil Gibran', significance: 'Lebanese-American author. Themes: forbidden love, societal constraints, spiritual freedom. Written in both Arabic and English.' },
    { title: 'Season of Migration to the North', author: 'Tayeb Salih', significance: 'Sudanese novel. Themes: colonialism, East-West encounter, identity crisis. Considered one of the most important Arabic novels of the 20th century.' },
  ],
  emirati: [
    { title: 'Poetry of Ahmed Al Ajami', significance: 'Prominent Emirati Nabati (vernacular) poet. Themes: love, Bedouin life, UAE heritage.' },
    { title: 'My Verse is My Soul', author: 'Mohammed bin Rashid Al Maktoum', significance: 'Published poetry collection by the ruler of Dubai. Themes: leadership, vision, desert, falcon, heritage. Students may study this in UAE Social Studies or Arabic class.' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if a message is about Arabic as a subject
 */
export function isArabicTopic(message) {
  if (!message) return false;
  const lower = message.toLowerCase();
  const triggers = [
    'arabic class', 'arabic teacher', 'arabic homework', 'arabic grammar',
    'arabic test', 'arabic vocabulary', 'arabic exam', 'arabic lesson',
    'nahw', 'sarf', 'i\'rab', 'irab',
    'verb conjugation arabic', 'sun letters', 'moon letters',
    'inna and sisters', 'kana and sisters',
    'arabic b', 'arabic first language', 'arabic asl',
    'emsat arabic',
  ];
  // Also check for Arabic script in message
  const hasArabic = /[\u0600-\u06FF]/.test(message);
  return triggers.some(t => lower.includes(t)) || hasArabic;
}

/**
 * Get Arabic support prompt for Starky.
 * Injects when UAE user asks about Arabic as a subject.
 */
export function getArabicSupportPrompt(stage) {
  const stageKey = stage === 'primary' || stage === 'KID' ? 'primary'
    : stage === 'secondary' || stage === 'ALEVEL' || stage === 'OLEVEL' ? 'secondary'
    : 'intermediate';

  let prompt = `\nARABIC SUPPORT MODE — Helping a UAE student with Arabic as a subject.\n`;

  // Identity rules — CRITICAL
  prompt += `\nCRITICAL RULES:`;
  prompt += `\n- ${ARABIC_IDENTITY_RULES.openingStatement}`;
  prompt += `\n- Explain concepts clearly in English. Show individual Arabic words/short phrases (1-5 words MAX) to illustrate.`;
  prompt += `\n- NEVER generate paragraphs of Arabic text. NEVER claim to be an Arabic teacher.`;
  prompt += `\n- If student asks you to write Arabic for them: "${ARABIC_IDENTITY_RULES.writingRequest}"`;

  // Stage-appropriate grammar
  const grammarRules = ARABIC_GRAMMAR_RULES[stageKey];
  if (grammarRules) {
    prompt += `\n\nGRAMMAR TOPICS (${stageKey} level):`;
    for (const [key, rule] of Object.entries(grammarRules)) {
      prompt += `\n${rule.name}: ${rule.explanation.split('.').slice(0, 2).join('.')}.`;
      if (rule.commonMistake) prompt += ` Common mistake: ${rule.commonMistake}`;
    }
  }

  // Vocabulary
  prompt += `\n\nUAE VOCABULARY: Use themed vocabulary in explanations — school items, UAE culture, greetings. Always show: Arabic word, transliteration, English meaning.`;

  // EmSAT for secondary
  if (stageKey === 'secondary') {
    prompt += `\n\nEmSAT ARABIC: Reading (40%), Grammar (30%), Writing (30%). I\'rab is the most tested topic. Explain essay structure in English.`;
  }

  prompt += `\n\nSESSION METHOD: Ask what topic they\'re working on → Identify the grammar rule → Explain in English with examples → Show 2-3 Arabic words demonstrating the rule → Ask student to apply → Give encouraging feedback.`;

  return prompt;
}
