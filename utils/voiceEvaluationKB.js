/**
 * utils/voiceEvaluationKB.js
 * Voice & Speech Evaluation Knowledge Base
 *
 * Starky as expert speech evaluator — pronunciation, fluency,
 * reading accuracy, and speaking quality assessment.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// READING FLUENCY RUBRICS — by age/grade
// ═══════════════════════════════════════════════════════════════════════════════

export const READING_FLUENCY_RUBRICS = {
  speedTargets: {
    'KG-Grade 2': { min: 60, max: 90, unit: 'WPM', note: 'Slow and careful is fine at this age' },
    'Grade 3-5': { min: 90, max: 120, unit: 'WPM', note: 'Developing fluency — some expression expected' },
    'Grade 6-8': { min: 120, max: 150, unit: 'WPM', note: 'Fluent with expression and pausing at punctuation' },
    'Grade 9+': { min: 150, max: 200, unit: 'WPM', note: 'Fluent, expressive, appropriate emphasis' },
  },
  accuracyBands: {
    excellent: { min: 95, label: 'Excellent', feedback: 'Outstanding accuracy — you read almost every word correctly.' },
    good: { min: 90, label: 'Good', feedback: 'Strong reading — just a few words tripped you up.' },
    developing: { min: 85, label: 'Developing', feedback: 'You\'re getting there — let\'s work on the words you found tricky.' },
    needsSupport: { min: 0, label: 'Needs support', feedback: 'Reading is a skill that grows with practice — let\'s slow down and try again together.' },
  },
  evaluationMethod: [
    'Step 1 — Accuracy: Compare transcript word-by-word against original passage. Flag mismatches.',
    'Step 2 — Fluency score: Calculate percentage of correct words.',
    'Step 3 — Speed: Calculate WPM from duration and word count. Compare to grade target.',
    'Step 4 — Feedback: State score, identify specific errors, give encouragement, offer one tip.',
  ],
  feedbackFormat: 'You read [X] out of [Y] words correctly — that\'s [%]% accuracy. [If errors]: I noticed you said "[wrong]" instead of "[right]". [Encouragement]. [One specific tip to improve].',
  igcseReading: 'IGCSE assesses: comprehension (can student explain what they read?), inference (reading between the lines), language awareness (noticing literary techniques when reading aloud).',
  emsatReading: 'EmSAT English evaluates: reading rate appropriate for level, pronunciation of academic vocabulary, expression and intonation.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRONUNCIATION PATTERNS — by mother tongue
// ═══════════════════════════════════════════════════════════════════════════════

export const PRONUNCIATION_PATTERNS = {
  arabic: {
    name: 'Arabic speakers',
    context: 'Largest group in UAE schools — Emirati, Egyptian, Jordanian, Syrian, Lebanese',
    errors: [
      { sound: '/p/ vs /b/', example: '"park" → "bark", "pen" → "ben"', tip: 'Put your lips together and pop — like blowing out a candle. That\'s /p/. Feel the puff of air on your hand.', severity: 'high' },
      { sound: '/v/ vs /b/ or /f/', example: '"very" → "bery" or "fery"', tip: 'Bite your bottom lip gently and hum — /v/ is a buzzing sound. Feel the vibration.', severity: 'high' },
      { sound: 'Short vowels', example: '"bit" vs "beat" vs "but" — all sound similar', tip: 'English has 12+ vowel sounds. Arabic has 3. Use a mirror — watch your mouth change shape for each vowel.', severity: 'high' },
      { sound: '/th/ sounds', example: '"three" → "sree" or "tree". "the" → "ze" or "de"', tip: 'Stick your tongue between your teeth and blow. That\'s the "th" sound. Touch your front teeth with your tongue tip.', severity: 'medium' },
      { sound: 'Final consonant clusters', example: '"asked" → "ast", "helped" → "help"', tip: 'English loves ending words with multiple consonants. Practise: "ast" then add "k" at the start to get "asked". Build it up slowly.', severity: 'medium' },
      { sound: '/ŋ/ (ng)', example: '"sing" → "sing-g", "running" → "running-g"', tip: 'The "ng" sound should fade out — don\'t release it into a hard "g". Hold the sound at the back of your mouth.', severity: 'low' },
      { sound: 'Word stress', example: 'Stressing wrong syllable — "hoTEL" correct, "HOtel" wrong', tip: 'English word stress changes meaning. Listen to native speakers and mark the stressed syllable.', severity: 'medium' },
    ],
  },
  urduHindi: {
    name: 'Urdu/Hindi speakers',
    context: 'Pakistani students + large Indian community in UAE',
    errors: [
      { sound: 'Retroflex /t/ and /d/', example: 'English t/d are alveolar (tongue behind upper teeth), Urdu t/d are retroflex (tongue curled back)', tip: 'Touch the bumpy ridge just behind your upper teeth with your tongue tip — that\'s where English t/d are made. Don\'t curl your tongue back.', severity: 'medium' },
      { sound: '/w/ vs /v/', example: '"very" → "wery", "vet" → "wet"', tip: '/v/ = top teeth on bottom lip + buzzing. /w/ = round your lips like saying "oo". They\'re completely different mouth shapes.', severity: 'high' },
      { sound: 'Vowel length', example: 'Not distinguishing "ship" vs "sheep", "bit" vs "beat"', tip: 'Short vowels are quick and relaxed. Long vowels are stretched and tense. Practise pairs: ship/sheep, bit/beat, pull/pool.', severity: 'medium' },
      { sound: 'Word stress', example: '"phoTOgraphy" vs "PHOtography"', tip: 'English stress patterns follow rules. Nouns often stress the first syllable, verbs the second. Listen and repeat.', severity: 'medium' },
      { sound: '"The" pronunciation', example: '"the" → "dee" or "de"', tip: '"The" before consonants = "thuh". "The" before vowels = "thee". "Thuh book" but "thee apple".', severity: 'low' },
      { sound: 'Aspirated consonants', example: 'Adding too much aspiration to k/p/t in all positions', tip: 'In English, k/p/t are only strongly aspirated at the start of stressed syllables. "top" has aspiration, "stop" does not.', severity: 'low' },
    ],
  },
  malayalam: {
    name: 'Malayalam speakers',
    context: 'Large Kerala community in UAE (Dubai, Sharjah)',
    errors: [
      { sound: '/w/ replaced with /v/', example: '"water" → "vater", "what" → "vat"', tip: 'Round your lips into an "oo" shape, then open them — that\'s /w/. /v/ uses your teeth on your lip.', severity: 'high' },
      { sound: 'Retroflex influence', example: 'Similar to Urdu — tongue position too far back', tip: 'English sounds are made further forward in the mouth. Touch behind your upper teeth, not the roof.', severity: 'medium' },
      { sound: 'Final consonant devoicing', example: '"dog" → "dok", "bag" → "bak"', tip: 'Keep your voice buzzing through the final consonant. Put your hand on your throat — you should feel vibration on "dog" but not on "dock".', severity: 'medium' },
    ],
  },
  tagalog: {
    name: 'Tagalog speakers',
    context: 'Filipino community in UAE',
    errors: [
      { sound: '/f/ vs /p/', example: '"fifteen" → "pipteen", "fifty" → "pipty"', tip: '/f/ = top teeth on bottom lip + blow. /p/ = both lips together + pop. Practise: "fifteen fifty-five".', severity: 'high' },
      { sound: '/v/ vs /b/', example: '"very" → "bery", "van" → "ban"', tip: 'Same as Arabic speakers — /v/ needs top teeth on bottom lip with buzzing.', severity: 'high' },
      { sound: 'Vowel reduction', example: 'Pronouncing all vowels fully instead of using schwa', tip: 'In English, unstressed syllables often use the schwa sound /ə/ — a lazy "uh". "about" = "uh-BOUT" not "AH-bout".', severity: 'medium' },
    ],
  },
  general: {
    name: 'All non-native speakers',
    errors: [
      { sound: 'Silent letters', words: ['knight', 'know', 'wrap', 'psychology', 'island', 'debt', 'subtle', 'colonel'], tip: 'English has many silent letters from its history — French, Latin, Greek origins. These must be memorised.' },
      { sound: '-ed endings', rule: '/t/ after voiceless (walked, stopped, watched). /d/ after voiced (played, opened, called). /ɪd/ after t/d (wanted, needed).', tip: 'Listen: "walked" = "walkt", "played" = "playd", "wanted" = "want-id". Only add a syllable after t or d.' },
      { sound: '-s endings', rule: '/s/ after voiceless (books, cats). /z/ after voiced (dogs, trees). /ɪz/ after s/z/sh/ch (buses, watches).', tip: '"Books" = "bookss". "Dogs" = "dogzz". "Buses" = "bus-iz". Listen to the final sound of the root word.' },
      { sound: 'Schwa /ə/', rule: 'The most common English sound. Found in unstressed syllables: about, again, teacher, banana, police.', tip: 'Schwa is a lazy, relaxed "uh". Don\'t pronounce every vowel fully — unstressed syllables are quick and quiet.' },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CEFR SPEAKING DESCRIPTORS
// ═══════════════════════════════════════════════════════════════════════════════

export const CEFR_DESCRIPTORS = {
  A1: { level: 'Beginner', desc: 'Can say simple words and phrases. "My name is..." "I like..." Very limited vocabulary. Frequent pauses.' },
  A2: { level: 'Elementary', desc: 'Can describe simple things in short sentences. Many errors but basic communication achieved.' },
  B1: { level: 'Intermediate', desc: 'Can speak about familiar topics with reasonable fluency. Some errors but communicates effectively.' },
  B2: { level: 'Upper-Intermediate', desc: 'Can speak fluently on most topics. Few errors. Good vocabulary range. Can express opinions.' },
  C1: { level: 'Advanced', desc: 'Can speak spontaneously and fluently. Rich vocabulary. Rare errors. Can handle complex topics.' },
  C2: { level: 'Mastery', desc: 'Near-native. Full control of language. Natural, fluent, precise. No systematic errors.' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// IELTS SPEAKING BAND DESCRIPTORS
// ═══════════════════════════════════════════════════════════════════════════════

export const IELTS_BANDS = {
  4: { desc: 'Frequent long pauses. Limited vocabulary. Many errors. Noticeable effort to communicate.' },
  5: { desc: 'Can communicate but with difficulty. Noticeable mother tongue influence. Repetitive vocabulary. Frequent errors.' },
  6: { desc: 'Effective communication despite some errors. Adequate vocabulary. Willing to speak at length. Some self-correction.' },
  7: { desc: 'Flexible use of language. Some imprecision. Good range of vocabulary and structures. Mostly fluent.' },
  8: { desc: 'Fluent and natural. Only occasional errors. Wide vocabulary used precisely. Fully developed responses.' },
  9: { desc: 'Expert user. No errors. Natural and effortless fluency. Full range of pronunciation features.' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PHONICS SOUNDS — for young learner evaluation
// ═══════════════════════════════════════════════════════════════════════════════

export const PHONICS_SOUNDS = {
  phase2: {
    name: 'Phase 2 (KG-Grade 1)',
    sounds: ['s', 'a', 't', 'p', 'i', 'n', 'm', 'd', 'g', 'o', 'c', 'k', 'ck', 'e', 'u', 'r', 'h', 'b', 'f', 'ff', 'l', 'll', 'ss'],
  },
  phase3: {
    name: 'Phase 3 (Grade 1)',
    sounds: ['j', 'v', 'w', 'x', 'y', 'z', 'zz', 'qu'],
    digraphs: ['ch', 'sh', 'th', 'ng'],
    vowelDigraphs: ['ai', 'ee', 'igh', 'oa', 'oo', 'ar', 'or', 'ur', 'ow', 'oi', 'ear', 'air', 'ure', 'er'],
  },
  phase5: {
    name: 'Phase 5 (Grade 2)',
    splitDigraphs: ['a-e', 'e-e', 'i-e', 'o-e', 'u-e'],
    alternativeSpellings: ['ay', 'ou', 'ie', 'ea', 'oy', 'ir', 'ue', 'aw', 'wh', 'ph', 'ew'],
  },
  funTips: {
    'sh': 'Sounds like telling someone to be quiet — shhhh!',
    'ch': 'Sounds like a train — ch-ch-ch-ch!',
    'th': 'Stick your tongue out a tiny bit and blow — thhhh!',
    'ng': 'Like the end of "sing" — hold it and hum!',
    'oo': 'Like an owl — oooo! (short: book. long: moon)',
    'ai': 'Like when it rains — "ai" as in "rain"!',
    'ee': 'Like a squeak — eee! As in "tree"!',
    'igh': 'Like the night sky — "igh" as in "light"!',
    'oa': 'Like a goat — "oa" as in "boat"!',
    'oi': 'Like a coin dropping — "oi" as in "coin"!',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPEAKING TOPICS — by curriculum
// ═══════════════════════════════════════════════════════════════════════════════

export const SPEAKING_TOPICS = {
  igcse: [
    'Describe a person who has influenced you',
    'Talk about a place you would like to visit and why',
    'What are the advantages and disadvantages of social media?',
    'Discuss the importance of education in your life',
    'Describe a challenge you overcame and what you learned',
    'What would you change about your school if you could?',
    'Talk about a book or film that made an impression on you',
    'Discuss whether competition is good or bad for students',
  ],
  ib: [
    'How does language shape our identity?',
    'Analyse the use of imagery in your set text',
    'Discuss the theme of power in your set text',
    'How does the author use structure to create meaning?',
    'To what extent does context influence our reading of a text?',
    'How do different perspectives shape our understanding of a global issue?',
  ],
  emsat: [
    'Describe your daily routine',
    'Talk about your favourite subject and why you enjoy it',
    'What is important to you in a future career?',
    'Describe your city or hometown',
    'What are the benefits of technology in education?',
    'Talk about a person you admire and why',
  ],
  ielts: [
    'Part 1: Tell me about your studies and plans',
    'Part 1: What hobbies do you enjoy in your free time?',
    'Part 1: Do you prefer eating at home or in restaurants?',
    'Part 2: Describe a time you helped someone',
    'Part 2: Describe a place you visited that surprised you',
    'Part 3: How has technology changed the way people communicate?',
    'Part 3: Do you think education will change in the future?',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// STARKY'S VOICE FEEDBACK LANGUAGE — by age
// ═══════════════════════════════════════════════════════════════════════════════

export const FEEDBACK_LANGUAGE = {
  young: {
    ageRange: 'KG-Grade 5',
    celebrate: 'Always celebrate first: "Wow, you spoke so clearly!"',
    correct: 'Never say "wrong" — say "Let\'s try that one again — you\'re so close!"',
    encourage: 'End with: "Every time you practise, you get better!"',
    tone: 'Warm, playful, amazed at their effort.',
  },
  middle: {
    ageRange: 'Grade 6-9',
    celebrate: 'Balanced: "Good effort — here\'s what went well and what to work on"',
    correct: 'Specific: "I noticed you paused a lot on longer words — that\'s totally normal at this stage"',
    encourage: '"Your vocabulary is growing — I could tell you were reaching for new words"',
    tone: 'Supportive but honest. Treat them as growing learners.',
  },
  secondary: {
    ageRange: 'Grade 10-12',
    celebrate: 'Professional: "Your speaking score would be approximately Band 6 on IELTS"',
    correct: 'Examiner language: "To improve to Band 7, focus on: [specific point]"',
    encourage: 'Grade-focused: "For EmSAT speaking, strengthen your vocabulary range"',
    tone: 'Professional, exam-oriented, constructive.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if message is about voice/speaking/pronunciation
 */
export function isVoiceTopic(message) {
  if (!message) return false;
  const lower = message.toLowerCase();
  const triggers = [
    'pronunciation', 'pronounce', 'how do i say', 'how to say',
    'speaking test', 'speaking assessment', 'oral exam', 'oral test',
    'reading aloud', 'read aloud', 'read out loud',
    'ielts speaking', 'emsat speaking', 'igcse oral',
    'my accent', 'my pronunciation', 'speak english better',
    'fluency', 'reading fluency', 'reading speed',
    'voice evaluation', 'evaluate my speaking', 'check my pronunciation',
    'i said it wrong', 'how is this pronounced',
  ];
  return triggers.some(t => lower.includes(t));
}

/**
 * Get voice evaluation prompt for Starky.
 */
export function getVoiceEvalPrompt(stage, motherTongue) {
  let prompt = `\nVOICE & SPEECH EVALUATION MODE — Starky as expert speech evaluator.\n`;

  // Reading fluency method
  prompt += `\nREADING EVALUATION: ${READING_FLUENCY_RUBRICS.evaluationMethod.join(' ')}`;
  prompt += `\nFeedback format: ${READING_FLUENCY_RUBRICS.feedbackFormat}`;

  // Speed targets for this stage
  const stageMap = { KID: 'KG-Grade 2', MIDDLE: 'Grade 3-5', OLEVEL: 'Grade 6-8', ALEVEL: 'Grade 9+' };
  const speedTarget = READING_FLUENCY_RUBRICS.speedTargets[stageMap[stage] || 'Grade 6-8'];
  if (speedTarget) prompt += `\nSpeed target: ${speedTarget.min}-${speedTarget.max} ${speedTarget.unit}. ${speedTarget.note}`;

  // Mother tongue pronunciation patterns
  const tongueMap = { arabic: 'arabic', urdu: 'urduHindi', hindi: 'urduHindi', malayalam: 'malayalam', tagalog: 'tagalog' };
  const patterns = PRONUNCIATION_PATTERNS[tongueMap[motherTongue?.toLowerCase()] || 'general'];
  if (patterns && patterns.errors) {
    prompt += `\n\nPRONUNCIATION PATTERNS (${patterns.name}):`;
    patterns.errors.slice(0, 4).forEach(e => {
      prompt += `\n- ${e.sound}: ${e.example || e.words?.join(', ')}. Tip: ${e.tip}`;
    });
  }

  // General errors all non-native speakers make
  prompt += `\n\nUNIVERSAL ERRORS: ${PRONUNCIATION_PATTERNS.general.errors.map(e => `${e.sound}: ${e.rule || e.tip}`).join('. ')}`;

  // Age-appropriate feedback language
  const feedbackStyle = stage === 'KID' ? FEEDBACK_LANGUAGE.young
    : stage === 'MIDDLE' ? FEEDBACK_LANGUAGE.middle
    : FEEDBACK_LANGUAGE.secondary;
  prompt += `\n\nFEEDBACK STYLE (${feedbackStyle.ageRange}): ${feedbackStyle.celebrate} ${feedbackStyle.correct} ${feedbackStyle.encourage} Tone: ${feedbackStyle.tone}`;

  // CEFR for reference
  prompt += `\n\nCEFR LEVELS: A1=Beginner, A2=Elementary, B1=Intermediate, B2=Upper-Intermediate, C1=Advanced, C2=Mastery. Assign level based on fluency, accuracy, range, and pronunciation.`;

  // Exam criteria if secondary
  if (stage === 'OLEVEL' || stage === 'ALEVEL') {
    prompt += `\n\nIELTS BANDS: 5=Difficulty but communicates, 6=Effective despite errors, 7=Flexible and fluent, 8=Only occasional errors. Give approximate band.`;
    prompt += `\nEmSAT SPEAKING: Evaluate on task completion, fluency/coherence, vocabulary range, grammar accuracy, pronunciation.`;
  }

  return prompt;
}
