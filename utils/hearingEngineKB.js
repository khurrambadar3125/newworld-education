/**
 * utils/hearingEngineKB.js
 * Starky's Hearing Intelligence — the input-side counterpart to the voice engine.
 *
 * Makes Starky the most capable listener in EdTech.
 * Handles imperfect transcripts, accented speech, code-switching,
 * multilingual input, and SEN speech patterns.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CODE-SWITCHING VOCABULARY — Pakistani and UAE students mix languages
// ═══════════════════════════════════════════════════════════════════════════════

export const CODE_SWITCHING_VOCABULARY = {
  urduEnglish: {
    common: {
      'samajh nahi': 'I don\'t understand', 'mushkil': 'difficult', 'aasaan': 'easy',
      'masla': 'problem', 'jawab': 'answer', 'sawal': 'question',
      'galat': 'wrong', 'theek': 'correct/right', 'samajh': 'understanding',
      'yeh wala': 'this one', 'woh wala': 'that one', 'kaise': 'how',
      'kyun': 'why', 'kya hai': 'what is', 'kya': 'what',
      'nahi': 'no/not', 'haan': 'yes', 'acha': 'okay/good',
      'phir se': 'again', 'bohat': 'very/a lot', 'thoda': 'a little',
      'pata nahi': 'I don\'t know', 'mujhe': 'to me', 'batao': 'tell me',
      'sir': 'respectful address — not a name', 'miss': 'respectful address for female teacher',
    },
    patterns: [
      { mixed: 'yeh question ka answer kya hai', meaning: 'What is the answer to this question?' },
      { mixed: 'mujhe samajh nahi aa raha', meaning: 'I don\'t understand' },
      { mixed: 'yeh bohat mushkil hai', meaning: 'This is very difficult' },
      { mixed: 'I don\'t understand yeh wala part', meaning: 'I don\'t understand this part' },
      { mixed: 'yeh formula kaise use karte hain', meaning: 'How do we use this formula?' },
      { mixed: 'phir se explain karo', meaning: 'Explain it again' },
    ],
  },
  arabicEnglish: {
    common: {
      'مش فاهم': 'I don\'t understand', 'mish fahim': 'I don\'t understand',
      'صعب': 'difficult', 'sa\'ab': 'difficult',
      'سهل': 'easy', 'sahel': 'easy',
      'صح': 'correct', 'sah': 'correct',
      'غلط': 'wrong', 'ghalat': 'wrong',
      'شو هاد': 'what is this', 'shu haad': 'what is this',
      'بعرف': 'I know', 'ba\'ref': 'I know',
      'ما بعرف': 'I don\'t know', 'ma ba\'ref': 'I don\'t know',
      'خلص': 'done/finished', 'khalas': 'done/finished',
      'بدي': 'I want', 'beddi': 'I want',
      'يلا': 'let\'s go/come on', 'yalla': 'let\'s go',
    },
    emirati: {
      'ايش هذا': 'what is this', 'eish hatha': 'what is this',
      'ما فهمت': 'I didn\'t understand', 'ma fahamt': 'I didn\'t understand',
      'زين': 'good', 'zain': 'good',
      'مو زين': 'not good', 'mu zain': 'not good',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ACCENT CORRECTION MAP — Web Speech API mishearings by accent
// ═══════════════════════════════════════════════════════════════════════════════

export const ACCENT_CORRECTION_MAP = {
  pakistaniEnglish: [
    { heard: 'berry', likely: 'very' }, { heard: 'wary', likely: 'very' },
    { heard: 'bark', likely: 'park' }, { heard: 'blease', likely: 'please' },
    { heard: 'broblem', likely: 'problem' }, { heard: 'tink', likely: 'think' },
    { heard: 'sink', likely: 'think' }, { heard: 'dirty', likely: 'thirty' },
    { heard: 'tirty', likely: 'thirty' }, { heard: 'spacific', likely: 'specific' },
    { heard: 'anoder', likely: 'another' }, { heard: 'dis', likely: 'this' },
    { heard: 'dat', likely: 'that' }, { heard: 'wen', likely: 'when' },
  ],
  arabicEnglish: [
    { heard: 'ze', likely: 'the' }, { heard: 'de', likely: 'the' },
    { heard: 'sree', likely: 'three' }, { heard: 'tree', likely: 'three' },
    { heard: 'boot', likely: 'put' }, { heard: 'ferry', likely: 'very' },
    { heard: 'bery', likely: 'very' }, { heard: 'zis', likely: 'this' },
    { heard: 'bark', likely: 'park' }, { heard: 'ben', likely: 'pen' },
    { heard: 'bizza', likely: 'pizza' },
  ],
  rule: 'Never correct accent in casual sessions. Only address when it affects exam performance. Interpret intended word. Respond to intended meaning.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// SEN HEARING PROTOCOLS — non-standard speech
// ═══════════════════════════════════════════════════════════════════════════════

export const SEN_HEARING_PROTOCOLS = {
  autism: {
    patterns: [
      'Delayed echolalia: repeats Starky\'s previous words — this is processing, not confusion. Wait.',
      'Scripted phrases: "I don\'t know how to say it" — often means the student does know but is dysregulated.',
      'Literal interpretation: idioms produce confused responses. Never use idioms without explanation.',
    ],
    rule: 'Accept echolalic speech as valid input. Do not re-prompt immediately after echo.',
  },
  downSyndrome: {
    patterns: [
      'Lower intelligibility: Web Speech API produces fragmented transcripts.',
      'Short utterances: 1-3 words. "maths... hard... help" = "Maths is hard, I need help".',
      'Content words without grammar: interpret meaning, not grammar.',
      'Repetition: same word repeated = emphasis or confirmation, not glitch.',
    ],
    rule: 'Always confirm interpretation: "You want help with maths — yes?"',
  },
  adhd: {
    patterns: [
      'Mid-sentence topic changes: "so the answer is — wait have you seen—"',
      'Rapid speech: API misses words at high pace. Interpret from context.',
      'Multiple questions in one breath.',
    ],
    rule: 'Gently redirect: "Let\'s finish this one first." Answer first question, then address others.',
  },
  selectiveMutism: {
    patterns: [
      'Very quiet speech: API confidence very low.',
      'Single word responses: "yes", "no", "don\'t know" — accept without pushing.',
      'Long silences before response — do not time out before 15 seconds.',
    ],
    rule: 'The silence is processing, not absence. Never re-prompt before 15 seconds.',
  },
  speechDifference: {
    patterns: [
      'Stutter: repeated syllables "I I I want" → interpret as "I want".',
      'Lisp: unusual consonant sounds.',
      'Apraxia: unusual word boundaries.',
    ],
    rule: 'Always respond to meaning, never to form. Extract semantic content, ignore structure.',
  },
  universal: 'Every non-standard transcript from an SEN student contains real meaning. Starky\'s job is to find it. Never: "I couldn\'t understand that." Always: reconstruct and confirm.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIDENCE THRESHOLDS — when to confirm vs proceed
// ═══════════════════════════════════════════════════════════════════════════════

export const CONFIDENCE_THRESHOLDS = {
  high: { range: '0.9-1.0', action: 'Proceed normally. Transcript is reliable.' },
  moderate: { range: '0.7-0.89', action: 'Proceed with light confirmation. "I think you said [X] — let me answer that."' },
  low: { range: '0.5-0.69', action: 'Always confirm. "I want to make sure I heard you — were you asking about [X]?"' },
  veryLow: { range: 'below 0.5', action: 'Do not guess. "I didn\'t quite catch that — were you asking about [A] or [B]?" Or: "Would it be easier to type that?"' },
  unavailable: 'Estimate from: transcript length vs speech duration (short transcript for long speech = missed words), unusual word combinations, words that only make sense as accent mishearing.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// INTENT EXTRACTION — what students MEAN, not what was transcribed
// ═══════════════════════════════════════════════════════════════════════════════

export const INTENT_EXTRACTION_SIGNALS = {
  confusion: { words: ['don\'t understand', 'what', 'huh', 'again', 'why', 'confused', 'samajh nahi', 'mish fahim'], acoustic: 'slow pace, rising intonation, long pause', response: 'Stop. Re-explain from different angle.' },
  understanding: { words: ['oh', 'okay', 'I see', 'got it', 'makes sense', 'acha', 'sah'], acoustic: 'faster response, confident volume, higher pitch', response: 'Build on it immediately. Advance.' },
  frustration: { words: ['too hard', 'can\'t', 'why', 'still don\'t get it', 'mushkil', 'sa\'ab'], acoustic: 'lower volume, slower pace, shorter responses', response: 'Find smallest success. Break it down further.' },
  boredom: { words: ['I know', 'already know this', 'okay fine', 'pata hai'], acoustic: 'flat tone, fast dismissive pace', response: 'Increase challenge immediately.' },
  excitement: { words: ['oh wait!', 'so that means!', 'is that why', 'ohhh'], acoustic: 'faster pace, higher pitch, higher volume', response: 'Aha moment — capitalise immediately.' },
  distraction: { words: ['sudden topic change', 'half-answered then stopped'], acoustic: 'background noise, interrupted speech', response: 'Gentle refocus: "Let\'s finish this thought first."' },
  needsRepetition: { words: ['very short answer not addressing question'], acoustic: 'low confidence, hesitant', response: 'Offer naturally: "Let me say that a different way."' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MULTILINGUAL RESPONSE MATCHING
// ═══════════════════════════════════════════════════════════════════════════════

export const MULTILINGUAL_RESPONSE_MATCHING = {
  urduDetected: {
    trigger: 'Any Urdu words or transliteration in transcript',
    response: 'Starky may respond in Urdu or mix. "Acha, toh aap yeh pooch rahe hain..." Never force English.',
  },
  arabicDetected: {
    trigger: 'Any Arabic words or transliteration',
    response: 'Respond with Arabic phrases of comfort. "نعم، هذا صحيح" then continue in English with Arabic confirmation.',
  },
  mixDetected: {
    trigger: 'Mixed language (most common in PK/UAE)',
    response: 'Match the student\'s mixing pattern. 70% English + 30% Urdu → Starky matches. This is cultural competence.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// WHISPER UPGRADE PATH — for high-stakes evaluation
// ═══════════════════════════════════════════════════════════════════════════════

export const WHISPER_UPGRADE = {
  when: ['Singing evaluations', 'Oral exam simulation', 'Voice Lab assessments', 'Reading fluency checks'],
  cost: '$0.006 per minute of audio',
  advantages: ['680,000 hours multilingual training', '99 languages including Urdu and Arabic', 'Handles accented English significantly better', 'Code-switching supported'],
  scaleCost: '1,000 daily users × evaluation sessions ≈ $15/month. Justified for accuracy.',
  regularSessions: 'Continue using Web Speech API (free) for normal chat.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Interpret a transcript using all hearing intelligence.
 * Returns enriched interpretation with intent, language, corrections.
 */
export function interpretTranscript(transcript, confidence, userProfile) {
  if (!transcript) return { intent: 'unclear', meaning: null, language: 'english', corrections: [] };

  const lower = transcript.toLowerCase();
  const country = userProfile?.country || 'PK';

  // Detect language mixing
  let language = 'english';
  const urduWords = Object.keys(CODE_SWITCHING_VOCABULARY.urduEnglish.common);
  const arabicWords = Object.keys(CODE_SWITCHING_VOCABULARY.arabicEnglish.common);
  const hasUrdu = urduWords.some(w => lower.includes(w)) || /[\u0600-\u06FF]/.test(transcript);
  const hasArabic = arabicWords.some(w => lower.includes(w)) || /[\u0600-\u06FF]/.test(transcript);

  if (hasUrdu && country === 'PK') language = 'urdu-english-mix';
  else if (hasArabic && (country === 'UAE' || country === 'OTHER')) language = 'arabic-english-mix';
  else if (/[\u0600-\u06FF]/.test(transcript)) language = 'arabic';

  // Apply accent corrections
  const corrections = [];
  const accentMap = country === 'UAE' ? ACCENT_CORRECTION_MAP.arabicEnglish : ACCENT_CORRECTION_MAP.pakistaniEnglish;
  for (const entry of accentMap) {
    if (lower.includes(entry.heard)) {
      corrections.push({ heard: entry.heard, likely: entry.likely });
    }
  }

  // Translate code-switching vocabulary
  let meaning = transcript;
  const vocab = country === 'UAE' ? { ...CODE_SWITCHING_VOCABULARY.arabicEnglish.common, ...CODE_SWITCHING_VOCABULARY.arabicEnglish.emirati } : CODE_SWITCHING_VOCABULARY.urduEnglish.common;
  for (const [foreign, english] of Object.entries(vocab)) {
    if (lower.includes(foreign)) {
      meaning = meaning.replace(new RegExp(foreign, 'gi'), `${foreign} [=${english}]`);
    }
  }

  // Detect intent
  let intent = 'general';
  for (const [intentName, signals] of Object.entries(INTENT_EXTRACTION_SIGNALS)) {
    if (signals.words.some(w => lower.includes(w))) {
      intent = intentName;
      break;
    }
  }

  // SEN-specific interpretation
  let senNote = null;
  const conditions = userProfile?.senConditions || userProfile?.senCondition;
  if (conditions) {
    const conditionKey = Array.isArray(conditions) ? conditions[0] : conditions;
    const protocol = SEN_HEARING_PROTOCOLS[conditionKey];
    if (protocol) senNote = protocol.rule;
  }

  // Confidence action
  let confidenceAction = CONFIDENCE_THRESHOLDS.high.action;
  if (confidence !== null && confidence !== undefined) {
    if (confidence >= 0.9) confidenceAction = CONFIDENCE_THRESHOLDS.high.action;
    else if (confidence >= 0.7) confidenceAction = CONFIDENCE_THRESHOLDS.moderate.action;
    else if (confidence >= 0.5) confidenceAction = CONFIDENCE_THRESHOLDS.low.action;
    else confidenceAction = CONFIDENCE_THRESHOLDS.veryLow.action;
  }

  return {
    originalTranscript: transcript,
    enrichedMeaning: meaning,
    intent,
    language,
    corrections,
    confidence,
    confidenceAction,
    senNote,
    needsConfirmation: (confidence !== null && confidence < 0.7) || corrections.length > 2,
  };
}

/**
 * Get hearing engine prompt for Starky's system prompt.
 */
export function getHearingEnginePrompt(country, condition) {
  let prompt = `\nHEARING ENGINE — How Starky understands imperfect input.\n`;

  // Code-switching awareness
  if (country === 'PK') {
    prompt += `\nCode-switching: Student may mix Urdu and English mid-sentence. Common: "samajh nahi" = don't understand, "mushkil" = difficult, "jawab" = answer, "galat" = wrong, "theek" = correct. Respond in the student's language mix.`;
  } else if (country === 'UAE') {
    prompt += `\nCode-switching: Student may mix Arabic and English. Common: "mish fahim" = don't understand, "sa'ab" = difficult, "sah" = correct, "ghalat" = wrong, "khalas" = done, "yalla" = let's go. Match their language pattern.`;
  }

  // Accent awareness
  prompt += `\nAccent intelligence: If transcript shows unusual words, check if accent-related (p/b, v/w, th). Interpret intended word. Respond to intended meaning. Never correct accent in casual sessions.`;

  // Confidence calibration
  prompt += `\nConfidence calibration: High (0.9+): proceed. Moderate (0.7-0.89): light confirmation. Low (0.5-0.69): always confirm. Very low (<0.5): offer options or text input.`;

  // Intent extraction
  prompt += `\nIntent extraction: confusion (slow pace, "don't understand") → re-explain. Understanding ("oh", "got it") → advance. Frustration ("too hard") → smallest success. Boredom ("I know") → increase challenge. Excitement ("oh wait!") → aha moment.`;

  // SEN hearing
  if (condition) {
    const protocol = SEN_HEARING_PROTOCOLS[condition];
    if (protocol) {
      prompt += `\nSEN hearing (${condition}): ${protocol.rule}`;
      prompt += ` Patterns: ${protocol.patterns.slice(0, 2).join(' ')}`;
    }
  }
  prompt += `\n${SEN_HEARING_PROTOCOLS.universal}`;

  // Core rule
  prompt += `\n\nNEVER say "I couldn't understand that." ALWAYS say "I think you're asking about [X] — is that right?"`;

  return prompt;
}
