/**
 * utils/uaeSpellingKB.js
 * UAE Bilingual Spelling Knowledge Base — Arabic + English
 *
 * For UAE students across all curricula needing English and Arabic spelling.
 * IGCSE, IB, AP English spelling + Arabic spelling for ASL and first language.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ENGLISH SPELLING LISTS — by difficulty, aligned to UAE curricula
// ═══════════════════════════════════════════════════════════════════════════════

export const ENGLISH_SPELLING = {
  foundation: {
    name: 'Foundation (KG–Grade 4)',
    words: [
      { word: 'because', trap: 'students write "becuz" or "becouse"', rule: 'Big Elephants Can Always Understand Small Elephants (mnemonic)' },
      { word: 'friend', trap: '"freind" — i before e confusion', rule: 'fri-END — a friend to the END' },
      { word: 'beautiful', trap: '"beutiful" — missing a', rule: 'Big Elephants Are Ugly — B.E.A.U.tiful' },
      { word: 'different', trap: '"diffrent" — missing second e', rule: 'differ-ent — say "differ" first' },
      { word: 'favourite', trap: '"favorite" (US) vs "favourite" (British)', rule: 'British spelling uses -our: colour, favourite, honour. IGCSE requires British spelling.' },
      { word: 'Wednesday', trap: '"Wensday"', rule: 'Wed-nes-day — pronounce all three syllables when spelling' },
      { word: 'library', trap: '"libary" — missing first r', rule: 'li-BRA-ry — think of a BRA in the library (silly but memorable)' },
      { word: 'tomorrow', trap: '"tommorow" or "tomorow"', rule: 'tom-OR-ROW — one m, two r\'s' },
      { word: 'separate', trap: '"seperate" — most common misspelling in English', rule: 'there\'s A RAT in sepARATE' },
      { word: 'receive', trap: '"recieve"', rule: 'i before e EXCEPT after c: receive, ceiling, deceive' },
      { word: 'together', trap: '"togather"', rule: 'to-GET-HER — get her together' },
      { word: 'environment', trap: '"enviroment" — missing n', rule: 'environ-MENT — iron is in the environment' },
    ],
    uaeContext: 'Dubai, Abu Dhabi, mosque, Eid, Ramadan, sheikh, souk, dirham, Emirati, desert',
  },

  intermediate: {
    name: 'Intermediate (Grade 5–8)',
    words: [
      { word: 'necessary', trap: '"neccessary" or "neccesary"', rule: 'one Collar, two Socks — 1 c, 2 s\'s' },
      { word: 'accommodation', trap: '"accomodation"', rule: 'two c\'s, two m\'s — think of a big hotel with double rooms' },
      { word: 'definitely', trap: '"definately" — most common adult misspelling', rule: 'de-FINITE-ly — the word FINITE is inside it' },
      { word: 'occurred', trap: '"occured" — missing second r', rule: 'two c\'s, two r\'s — double trouble' },
      { word: 'embarrass', trap: '"embarass" or "embarras"', rule: 'two r\'s, two s\'s — I turned Really Red And felt So Silly' },
      { word: 'immediately', trap: '"immediatly"', rule: 'immediate + ly — don\'t drop the e? Actually you do: immediately' },
      { word: 'argument', trap: '"arguement"', rule: 'argue loses its e when it becomes argument' },
      { word: 'government', trap: '"goverment"', rule: 'govern + ment — you GOVERN the government' },
      { word: 'independent', trap: '"independant"', rule: '-ent not -ant. Think: independENT studENT' },
      { word: 'privilege', trap: '"priviledge" or "privelege"', rule: 'no d, no a — privi-LEGE' },
      { word: 'curriculum', trap: '"cirriculum" or "curricullum"', rule: 'two r\'s, one l — think: curr-IC-u-lum' },
      { word: 'millennium', trap: '"millenium"', rule: 'two l\'s, two n\'s — mill-ENN-ium' },
    ],
    uaeContext: 'Government, curriculum, independent, development, sustainability, tolerance, technology, entrepreneurship',
  },

  advanced: {
    name: 'Advanced (Grade 9–10 / IGCSE)',
    words: [
      { word: 'conscience', trap: '"concience" or "concsience"', rule: 'con-SCIENCE — there\'s SCIENCE in your conscience' },
      { word: 'maintenance', trap: '"maintainence"', rule: 'maintain loses its second a: mainten-ANCE' },
      { word: 'manoeuvre', trap: '"manouvre" or "maneuver" (US)', rule: 'British: manoeuvre. American: maneuver. IGCSE uses British.' },
      { word: 'bureaucracy', trap: '"beauracracy"', rule: 'bureau + cracy — a BUREAU runs the bureaucracy' },
      { word: 'entrepreneur', trap: 'Almost everyone misspells this', rule: 'entre-PRE-neur — French origin, pronounce all parts' },
      { word: 'exaggerate', trap: '"exagerate"', rule: 'two g\'s — the word itself exaggerates the g' },
      { word: 'Mediterranean', trap: '"Mediteranean"', rule: 'one d, one t, two r\'s — Medi-TERR-anean (TERRA = earth)' },
      { word: 'questionnaire', trap: '"questionaire"', rule: 'question + naire — two n\'s because it\'s French' },
      { word: 'surveillance', trap: '"surveilance"', rule: 'sur-VEILL-ance — VEILL from French "watch" (veiller)' },
      { word: 'miscellaneous', trap: 'Almost always misspelled', rule: 'mis-CELL-aneous — there\'s a CELL in there' },
      { word: 'supersede', trap: '"supercede"', rule: 'The ONLY English word ending in -sede. All others use -cede (precede, recede).' },
      { word: 'idiosyncrasy', trap: '"idiosyncracy"', rule: '-crasy not -cracy. This is not a democracy of idiots.' },
    ],
    igcseNote: 'IGCSE English Language Paper 1 (Reading) deducts marks for spelling errors in summary writing. Paper 2 (Directed Writing) requires accurate spelling for top band marks. IGCSE uses British English spelling throughout.',
  },

  examLevel: {
    name: 'Exam Level (A Level / IB / AP)',
    words: [
      { word: 'onomatopoeia', trap: 'Literary term — frequently misspelled in essays', rule: 'ono-mato-poeia — sounds like what it means' },
      { word: 'antithesis', trap: '"antithisis"', rule: 'anti-THESIS — the opposite of a thesis' },
      { word: 'soliloquy', trap: '"soliliquy"', rule: 'solo + loquy (loqui = speak in Latin). Speaking alone.' },
      { word: 'denouement', trap: '"denoument"', rule: 'French: dé-noue-ment. The unknotting of the plot.' },
      { word: 'juxtaposition', trap: '"juxtapostion"', rule: 'juxta-POSITION — placing things side by side' },
      { word: 'surreptitious', trap: '"sureptitious"', rule: 'two r\'s — sur-REP-titious (secretive)' },
      { word: 'acquiesce', trap: '"aquiesce" or "acquiece"', rule: 'ac-QUI-esce — to quietly agree' },
      { word: 'bourgeoisie', trap: 'French import — everyone struggles', rule: 'bour-GEOIS-ie — the middle class' },
      { word: 'reconnaissance', trap: '"reconaisance"', rule: 'recon-NAISS-ance — French military term, two s\'s' },
      { word: 'unequivocally', trap: '"unequivically"', rule: 'un-equivocal-ly — no equivocation, no "i" before the "cal"' },
    ],
    ibNote: 'IB English A Literature and Language & Literature essays are assessed on language quality. Consistent spelling errors drop the Language criterion (Criterion D) by one band. IB command terms must be spelled correctly: analyse (not analyze — IB uses British), evaluate, juxtapose.',
    apNote: 'AP English uses American spelling: analyze, color, center. But literary terms must still be spelled correctly regardless of variety.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ARABIC SPELLING — Common errors for UAE students
// ═══════════════════════════════════════════════════════════════════════════════

export const ARABIC_SPELLING = {
  commonErrors: [
    { error: 'Hamza placement', arabic: 'همزة', desc: 'Students confuse hamza on alif (أ), on waw (ؤ), on ya (ئ), and on the line (ء). Rule depends on the vowel: fatha→alif, damma→waw, kasra→ya.', example: 'مسؤول not مسأول, رئيس not رءيس', level: 'All levels' },
    { error: 'Taa marbuta vs Haa', arabic: 'ة vs ه', desc: 'Students confuse ة (taa marbuta — feminine ending) with ه (haa). Taa marbuta has two dots, haa does not.', example: 'مدرسة (school) not مدرسه, جميلة (beautiful) not جميله', level: 'Foundation' },
    { error: 'Alif maqsura vs Ya', arabic: 'ى vs ي', desc: 'Alif maqsura (ى) looks like ya (ي) without dots. Common in verb endings and proper nouns.', example: 'على (on) not علي, إلى (to) not إلي, موسى (Musa) not موسي', level: 'Intermediate' },
    { error: 'Shadda omission', arabic: 'شدّة', desc: 'Students forget to write shadda (ّ) which doubles a consonant. Changes meaning.', example: 'درّس (he taught) vs درس (he studied), كلّم (he spoke to) vs كلم (he injured)', level: 'All levels' },
    { error: 'Sun and moon letters', arabic: 'حروف شمسية وقمرية', desc: 'After ال (the), sun letters assimilate the ل sound, moon letters don\'t. Affects pronunciation and sometimes spelling.', example: 'الشمس (ash-shams, not al-shams), القمر (al-qamar — correct)', level: 'Foundation' },
    { error: 'Tanween spelling', arabic: 'تنوين', desc: 'Tanween (ً ٌ ٍ) is often omitted or misplaced. Critical for grammar.', example: 'كتاباً (a book, accusative) — the ً must be on the alif after taa marbuta nouns', level: 'Intermediate' },
    { error: 'Connecting vs non-connecting letters', arabic: 'حروف لا تتصل بما بعدها', desc: 'Six letters never connect to the next letter: ا د ذ ر ز و. Students sometimes try to connect them.', example: 'دار not دـار, زيت not زـيت', level: 'Foundation' },
    { error: 'Long vowels vs short vowels', arabic: 'حركات طويلة وقصيرة', desc: 'Confusing ا (long a) with fatha, و (long u) with damma, ي (long i) with kasra in spelling.', example: 'كاتب (writer) needs the alif, كتب (books) does not', level: 'Foundation' },
  ],

  uaeVocabulary: [
    { arabic: 'الإمارات', english: 'The Emirates', level: 'Foundation' },
    { arabic: 'الاتحاد', english: 'The Union (Federation)', level: 'Foundation' },
    { arabic: 'التسامح', english: 'Tolerance', level: 'Intermediate' },
    { arabic: 'الاستدامة', english: 'Sustainability', level: 'Advanced' },
    { arabic: 'ريادة الأعمال', english: 'Entrepreneurship', level: 'Advanced' },
    { arabic: 'الذكاء الاصطناعي', english: 'Artificial Intelligence', level: 'Advanced' },
    { arabic: 'مجلس', english: 'Majlis (council/sitting room)', level: 'Foundation' },
    { arabic: 'براجيل', english: 'Barajeel (wind tower)', level: 'Intermediate' },
    { arabic: 'العالة', english: 'Al Ayyala (traditional dance)', level: 'Intermediate' },
    { arabic: 'السدو', english: 'Al Sadu (traditional weaving)', level: 'Intermediate' },
    { arabic: 'الفلج', english: 'Falaj (water channel)', level: 'Foundation' },
    { arabic: 'المهرجان', english: 'Festival', level: 'Foundation' },
  ],

  bilingualPairs: [
    { english: 'government', arabic: 'حكومة', note: 'Both tricky to spell — English: govern+ment, Arabic: hamza placement' },
    { english: 'environment', arabic: 'بيئة', note: 'English: environ+ment (missing n trap), Arabic: hamza on ya' },
    { english: 'education', arabic: 'تعليم', note: 'English: -tion ending, Arabic: shadda on lam' },
    { english: 'technology', arabic: 'تكنولوجيا', note: 'English: -ology ending, Arabic: borrowed word — check transliteration' },
    { english: 'university', arabic: 'جامعة', note: 'English: -sity ending, Arabic: taa marbuta' },
    { english: 'independence', arabic: 'استقلال', note: 'English: -ence not -ance, Arabic: alif at start' },
    { english: 'development', arabic: 'تطوير', note: 'English: develop+ment (no e), Arabic: standard form' },
    { english: 'sustainability', arabic: 'استدامة', note: 'English: sustain+ability, Arabic: taa marbuta ending' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// IB / IGCSE / AP SPELLING REQUIREMENTS
// ═══════════════════════════════════════════════════════════════════════════════

export const CURRICULUM_SPELLING = {
  igcse: {
    standard: 'British English',
    impact: 'IGCSE English Language: spelling errors in Paper 1 summary and Paper 2 directed writing reduce marks. Consistent errors drop the band. Key rule: use British spelling throughout — colour, favourite, analyse, centre.',
    criticalWords: ['analyse', 'colour', 'favourite', 'honour', 'neighbour', 'programme', 'centre', 'defence', 'licence', 'practise (verb)', 'practice (noun)'],
  },
  ib: {
    standard: 'British or American — but must be CONSISTENT throughout',
    impact: 'IB Criterion D (Language) drops a band for inconsistent or frequent spelling errors. Choose one variety and stick with it for the entire essay. Most Dubai IB schools use British.',
    criticalWords: ['analyse/analyze', 'colour/color', 'favour/favor', 'programme/program', 'defence/defense', 'licence/license'],
  },
  ap: {
    standard: 'American English',
    impact: 'AP English essays are scored holistically. Spelling alone won\'t fail you, but consistent errors undermine the Sophistication point. Literary terms MUST be correct.',
    criticalWords: ['analyze', 'color', 'favorite', 'honor', 'neighbor', 'program', 'center', 'defense', 'license', 'practice (both)'],
  },
  cbse: {
    standard: 'British English (NCERT uses British)',
    impact: 'CBSE English papers deduct 0.5 marks per spelling error in writing sections. Grammar and spelling combined can cost up to 4 marks.',
    criticalWords: ['colour', 'favourite', 'honour', 'programme', 'centre', 'analyse'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EmSAT ENGLISH VOCABULARY — most tested academic words
// ═══════════════════════════════════════════════════════════════════════════════

export const EMSAT_VOCABULARY = {
  name: 'EmSAT English (University Entry)',
  words: [
    { word: 'acknowledge', trap: '"acknowlege" — missing d', rule: 'ac-KNOW-ledge — you KNOW to acknowledge' },
    { word: 'collaboration', trap: '"colaberation"', rule: 'col-LABOR-ation — there\'s LABOR inside it' },
    { word: 'predominantly', trap: '"predominately"', rule: 'predominant + ly — keep the "ant"' },
    { word: 'consequently', trap: '"consequintly"', rule: 'consequent + ly — QUENT not QUINT' },
    { word: 'significantly', trap: '"signifcantly"', rule: 'significant + ly — don\'t skip the "i" before "cant"' },
    { word: 'infrastructure', trap: '"infrastrucure"', rule: 'infra-STRUCTURE — the STRUCTURE is inside' },
    { word: 'diversification', trap: '"diversifaction"', rule: 'diversif-IC-ation — think UAE economic diversification' },
    { word: 'sustainability', trap: '"sustainablity"', rule: 'sustain-ABIL-ity — ABILITY to sustain' },
    { word: 'entrepreneurial', trap: 'Everyone misspells this', rule: 'entrepreneur + ial — master the French root first' },
    { word: 'implementation', trap: '"implimentation"', rule: 'implement + ation — IMPLEMENT not IMPLIMENT' },
    { word: 'comprehensive', trap: '"comprahensive"', rule: 'compre-HENS-ive — there are HENS in comprehensive' },
    { word: 'deterioration', trap: '"deteriation"', rule: 'de-TERIOR-ation — TERIOR (like inferior) + ation' },
  ],
  uaeContext: 'These words appear frequently in EmSAT English reading passages and writing prompts. Topics: UAE economy, sustainability, technology, society, education.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// UAE CULTURAL TERMS IN ENGLISH — must-know vocabulary
// ═══════════════════════════════════════════════════════════════════════════════

export const UAE_CULTURAL_WORDS = [
  { word: 'Emirati', trap: '"Emerati" or "Emarati"', rule: 'E-mir-ati — from Emir (prince/commander)' },
  { word: 'Majlis', trap: '"Majles" or "Mejlis"', rule: 'Maj-lis — from Arabic مجلس (sitting place)' },
  { word: 'Falaj', trap: '"Fallaj" or "Felaj"', rule: 'Fa-laj — traditional irrigation channel, plural: Aflaj' },
  { word: 'Abaya', trap: '"Abaia" or "Abaaya"', rule: 'A-ba-ya — three syllables, no double a' },
  { word: 'Kandura', trap: '"Kandoora" or "Kantura"', rule: 'Kan-du-ra — traditional men\'s garment (also dishdasha)' },
  { word: 'Wadi', trap: '"Waddi" or "Wady"', rule: 'Wa-di — dry riverbed, as in Wadi Rum, Wadi Shawka' },
  { word: 'Sheikh', trap: '"Sheik" or "Shaikh"', rule: 'Sheikh — most common English transliteration (also Shaikh in UAE)' },
  { word: 'Khalifa', trap: '"Kalifa" or "Khaleefa"', rule: 'Kha-li-fa — as in Burj Khalifa, Khalifa University' },
  { word: 'Dirham', trap: '"Dhiram" or "Derham"', rule: 'Dir-ham — UAE currency (AED = Arab Emirates Dirham)' },
  { word: 'Souq', trap: '"Souk" or "Sooq"', rule: 'Souq — traditional market. Both "souq" and "souk" are accepted.' },
  { word: 'Ramadan', trap: '"Ramadhan" or "Ramazan"', rule: 'Ra-ma-dan — Arabic spelling uses ض. English standard: Ramadan.' },
  { word: 'Eid', trap: '"Eed" or "Eeed"', rule: 'Eid — one syllable. Eid al-Fitr, Eid al-Adha.' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// WEEKLY CHALLENGE STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════

export const WEEKLY_CHALLENGE = {
  structure: '15 words per week. Mixed difficulty from all levels. New list every Monday.',
  scoring: { perfect: 15, excellent: 12, good: 9, pass: 6 },
  streakBonus: 'Complete 3 weeks in a row = UAE Spelling Champion badge',
};

/**
 * Get UAE spelling system prompt for Starky.
 */
export function getUAESpellingPrompt(track, level) {
  let prompt = `\nUAE BILINGUAL SPELLING — Teaching spelling in both English and Arabic.\n`;

  if (track === 'english') {
    const lvl = ENGLISH_SPELLING[level] || ENGLISH_SPELLING.foundation;
    prompt += `\nTrack: English Spelling (${lvl.name}).`;
    prompt += `\nWords: ${lvl.words.slice(0, 5).map(w => `${w.word} (trap: ${w.trap})`).join(', ')}.`;
    prompt += `\nRules: ${lvl.words.slice(0, 3).map(w => `${w.word}: ${w.rule}`).join('. ')}.`;
    prompt += `\nUAE context words: ${lvl.uaeContext || 'Use Dubai and UAE vocabulary in example sentences.'}.`;
    prompt += `\nFor IGCSE students: ${CURRICULUM_SPELLING.igcse.impact}`;
  } else {
    prompt += `\nTrack: Arabic Spelling.`;
    prompt += `\nCommon errors: ${ARABIC_SPELLING.commonErrors.slice(0, 4).map(e => `${e.error} — ${e.desc.split('.')[0]}`).join('. ')}.`;
    prompt += `\nUAE vocabulary: ${ARABIC_SPELLING.uaeVocabulary.slice(0, 5).map(v => `${v.arabic} (${v.english})`).join(', ')}.`;
  }

  prompt += `\n\nSPELLING TEACHING RULES:`;
  prompt += `\n- Give the word, then ask the student to spell it`;
  prompt += `\n- If wrong: show the correct spelling, explain the rule/mnemonic, give a UAE example sentence`;
  prompt += `\n- If right: celebrate, give a harder word`;
  prompt += `\n- Use mnemonics and visual tricks — these stick better than rules`;
  prompt += `\n- For bilingual pairs: show both English and Arabic spelling together`;
  prompt += `\n- Never shame spelling errors — they are learning opportunities`;

  return prompt;
}
