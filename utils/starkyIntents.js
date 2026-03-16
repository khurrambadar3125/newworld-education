/**
 * starkyIntents.js
 * Intent detection for Starky — classifies every student message
 * before it reaches the AI, so the response is always appropriate.
 *
 * Usage:
 *   import { detectIntent, INTENTS } from './starkyIntents';
 *   const intent = detectIntent(message, userProfile);
 */

export const INTENTS = {
  HOMEWORK_HELP:    'homework_help',      // "I don't understand question 3"
  EXAM_PREP:        'exam_prep',          // "How do I prepare for O Level Chemistry"
  CONCEPT_EXPLAIN:  'concept_explain',    // "What is photosynthesis"
  PRACTICE_REQUEST: 'practice_request',   // "Give me questions on algebra"
  MARKING_REQUEST:  'marking_request',    // "Mark my essay / check my answer"
  EMOTIONAL:        'emotional',          // "I hate school", "I'm so stressed"
  SOCIAL_CHAT:      'social_chat',        // "What's your favourite colour?"
  OFF_TOPIC:        'off_topic',          // "Tell me a joke / what's the news"
  ESCALATE_DISTRESS:'escalate_distress',  // "I want to disappear" / distress signals
  ESCALATE_UNSAFE:  'escalate_unsafe',    // harmful / dangerous content requests
  ESCALATE_ABUSE:   'escalate_abuse',     // bullying, self-harm mentions
  IDENTITY_PROBE:   'identity_probe',     // "Are you ChatGPT?" / "Are you a real person?"
  PARENT_QUERY:     'parent_query',       // Parent asking about child progress
  UNKNOWN:          'unknown',
};

// ─── Keyword signal banks ───────────────────────────────────────────────────

const DISTRESS_SIGNALS = [
  'want to die', 'want to disappear', 'kill myself', 'end my life',
  'no point living', 'hate myself', 'worthless', 'nobody cares',
  'rather be dead', 'hurt myself', 'cutting', 'self harm', 'self-harm',
  'run away', 'leave forever', 'cant take it anymore', "can't take it anymore",
  'give up on life', 'not worth it', 'better off without me',
];

const UNSAFE_SIGNALS = [
  'how to make a bomb', 'how to make drugs', 'how to hack someone',
  'how to hurt someone', 'how to poison', 'buy drugs', 'buy weapons',
  'do something illegal', 'pirate software', 'cheat in exam', 'steal exam paper',
  'get exam paper early', 'leaked paper', 'watch porn', 'send nudes', 'naked pictures',
  'send me pictures of', 'meet me in person', 'where do you live',
];
// Note: "sex" removed — biology students ask about "sexual reproduction"
// Note: "illegal" removed as bare word — too many false positives
// Note: "how to hack" → "how to hack someone" to allow "how to hack my revision"

const ABUSE_SIGNALS = [
  'being bullied', 'someone hit me', 'teacher hit me', 'abused',
  'touches me', 'inappropriate touching', 'someone threatens me', 'threatened me',
  'blackmail', 'stalking me', 'hits me at home', 'beats me',
  'forced to do', 'uncle touches', 'cousin touches',
];
// Note: "scared of" removed — false positive on "scared of exams"
// Note: more specific phrases to reduce false positives while catching real abuse

const EMOTIONAL_SIGNALS = [
  'hate school', 'hate maths', 'hate this', 'so hard', 'too hard',
  'i give up', 'im stupid', "i'm stupid", 'so dumb', "i'm dumb",
  'stressed', 'anxious', 'worried', 'scared of exams', 'failing',
  'going to fail', 'terrible at', 'not good at', 'frustrated',
  'upset', 'crying', 'exhausted', 'tired of studying',
  'no one helps me', 'my teacher doesnt', "teacher doesn't",
];

const IDENTITY_PROBES = [
  'are you chatgpt', 'are you gpt', 'are you ai', 'are you real',
  'are you a robot', 'are you human', 'who made you', 'who created you',
  'are you claude', 'are you gemini', 'are you a person',
  'what ai are you', 'which company', 'are you from openai',
  // Roman Urdu
  'kya tum chatgpt ho', 'kya tum ai ho', 'tum kaun ho', 'tum robot ho',
  'tumhe kisne banaya',
];

const PARENT_SIGNALS = [
  'my child', 'my son', 'my daughter', 'my kid',
  'how is my child doing', 'child progress', 'parent here',
  'i am a parent', "i'm a parent", 'as a parent',
  'how do i teach', 'how to teach my', 'teach my daughter',
  'teach my son', 'teach my child', 'help me teach',
  'explain to my daughter', 'explain to my son',
  'what should i teach', 'study plan for my',
  // Roman Urdu
  'mera bacha', 'meri beti', 'mera beta',
  'beti ko kaise parhaun', 'bete ko kaise parhaun',
  'beti ki tayyari', 'bete ki tayyari',
  'parhai kaisi chal rahi hai', 'meri beti ka result',
  'bachon ko kaise samjhaun',
];

// ── Roman Urdu signals (Pakistani students type this way) ─────────────────
const ROMAN_URDU_HOMEWORK = [
  'samajh nahi aa raha', 'samajh nahi aya', 'ye kya hai', 'ye kaise hoga',
  'madad karo', 'help karo', 'mushkil hai', 'nahi aata', 'nahi ata',
  'question solve karo', 'kaise karu', 'kaise karun', 'batao ye',
];
const ROMAN_URDU_EMOTIONAL = [
  'main fail ho jaun ga', 'fail ho jaunga', 'bohat mushkil hai',
  'mujhe dar hai', 'tension ho rahi hai', 'pareshan hun',
  'kuch samajh nahi aata', 'thak gaya hun', 'thak gayi hun',
  'haar maan raha hun', 'haar maan rahi hun',
];
const ROMAN_URDU_PRACTICE = [
  'sawal do', 'question do', 'test lo', 'quiz lo', 'practice karao',
  'aur sawal', 'mushkil sawal do',
];
const ROMAN_URDU_EXPLAIN = [
  'ye kya hota hai', 'iska matlab', 'samjhao', 'samjha do',
  'kyun hota hai', 'kaise hota hai', 'define karo',
];
const ROMAN_URDU_DISTRESS = [
  'mar jana chahta hun', 'mar jana chahti hun', 'jeene ka mann nahi',
  'koi mera khayal nahi rakhta', 'zindagi se tang', 'khud ko hurt karna',
];

const ROMAN_URDU_MARKING = [
  'meri checking karo', 'marks batao', 'ye theek hai', 'jawab check karo', 'kitne marks milenge',
];
const ROMAN_URDU_EXAM_PREP = [
  'tayyari kaise karun', 'paper ki tayyari', 'revision kaise karun', 'konse topics zaroori hain', 'imtihan ki tips',
];

const MARKING_SIGNALS = [
  'mark my', 'check my answer', 'check my essay', 'grade this',
  'how many marks', 'did i get it right', 'is this correct',
  'correct my', 'review my', 'feedback on my', 'evaluate my',
  'what would i get', 'would this get full marks',
];

const PRACTICE_SIGNALS = [
  'give me questions', 'give me a question', 'practice questions',
  'test me', 'quiz me', 'more questions', 'can you test',
  'practice on', 'drill me', 'past paper question',
];

const EXAM_PREP_SIGNALS = [
  'how do i prepare', 'exam tips', 'revision tips', 'how to revise',
  'what topics', 'syllabus', 'past papers', 'how to study',
  'exam strategy', 'time management', 'which chapters',
  'important topics', 'will this come in exam', 'exam technique',
];

// ─── Core detector ───────────────────────────────────────────────────────────

/**
 * Detects the primary intent of a student message.
 * Returns { intent, confidence, signals }
 *
 * @param {string} message - Raw student message
 * @param {object} userProfile - { grade, gradeId, age, name, senFlag }
 * @returns {{ intent: string, confidence: number, signals: string[] }}
 */
export function detectIntent(message, userProfile = {}) {
  const msg = message.toLowerCase().trim();
  const signals = [];

  // ── Safety checks first — these always take priority ──────────────────────

  const distressMatch = DISTRESS_SIGNALS.find(s => msg.includes(s))
    || ROMAN_URDU_DISTRESS.find(s => msg.includes(s));
  if (distressMatch) {
    return { intent: INTENTS.ESCALATE_DISTRESS, confidence: 1.0, signals: [distressMatch] };
  }

  const abuseMatch = ABUSE_SIGNALS.find(s => msg.includes(s));
  if (abuseMatch) {
    return { intent: INTENTS.ESCALATE_ABUSE, confidence: 1.0, signals: [abuseMatch] };
  }

  const unsafeMatch = UNSAFE_SIGNALS.find(s => msg.includes(s));
  if (unsafeMatch) {
    return { intent: INTENTS.ESCALATE_UNSAFE, confidence: 1.0, signals: [unsafeMatch] };
  }

  // ── Identity probe ─────────────────────────────────────────────────────────
  const identityMatch = IDENTITY_PROBES.find(s => msg.includes(s));
  if (identityMatch) {
    return { intent: INTENTS.IDENTITY_PROBE, confidence: 0.95, signals: [identityMatch] };
  }

  // ── Parent query ───────────────────────────────────────────────────────────
  const parentMatch = PARENT_SIGNALS.find(s => msg.includes(s));
  if (parentMatch) {
    return { intent: INTENTS.PARENT_QUERY, confidence: 0.85, signals: [parentMatch] };
  }

  // ── Scoring system for ambiguous cases ────────────────────────────────────
  const scores = {
    [INTENTS.EMOTIONAL]:        0,
    [INTENTS.MARKING_REQUEST]:  0,
    [INTENTS.PRACTICE_REQUEST]: 0,
    [INTENTS.EXAM_PREP]:        0,
    [INTENTS.HOMEWORK_HELP]:    0,
    [INTENTS.CONCEPT_EXPLAIN]:  0,
    [INTENTS.SOCIAL_CHAT]:      0,
    [INTENTS.OFF_TOPIC]:        0,
  };

  EMOTIONAL_SIGNALS.forEach(s => { if (msg.includes(s)) { scores[INTENTS.EMOTIONAL] += 2; signals.push(s); } });
  ROMAN_URDU_EMOTIONAL.forEach(s => { if (msg.includes(s)) { scores[INTENTS.EMOTIONAL] += 2; signals.push(s); } });
  MARKING_SIGNALS.forEach(s => { if (msg.includes(s)) { scores[INTENTS.MARKING_REQUEST] += 3; signals.push(s); } });
  ROMAN_URDU_MARKING.forEach(s => { if (msg.includes(s)) { scores[INTENTS.MARKING_REQUEST] += 3; signals.push(s); } });
  PRACTICE_SIGNALS.forEach(s => { if (msg.includes(s)) { scores[INTENTS.PRACTICE_REQUEST] += 3; signals.push(s); } });
  ROMAN_URDU_PRACTICE.forEach(s => { if (msg.includes(s)) { scores[INTENTS.PRACTICE_REQUEST] += 3; signals.push(s); } });
  EXAM_PREP_SIGNALS.forEach(s => { if (msg.includes(s)) { scores[INTENTS.EXAM_PREP] += 2; signals.push(s); } });
  ROMAN_URDU_EXAM_PREP.forEach(s => { if (msg.includes(s)) { scores[INTENTS.EXAM_PREP] += 2; signals.push(s); } });
  ROMAN_URDU_HOMEWORK.forEach(s => { if (msg.includes(s)) { scores[INTENTS.HOMEWORK_HELP] += 2; signals.push(s); } });
  ROMAN_URDU_EXPLAIN.forEach(s => { if (msg.includes(s)) { scores[INTENTS.CONCEPT_EXPLAIN] += 2; signals.push(s); } });

  // Homework help signals — structural patterns
  if (/\bquestion\s+\d+\b/.test(msg)) scores[INTENTS.HOMEWORK_HELP] += 3;
  if (/\b(don't|dont|don't|cannot|can't|cant)\s+understand\b/.test(msg)) scores[INTENTS.HOMEWORK_HELP] += 2;
  if (/\bhelp\s+(me\s+)?(with|on|for)\b/.test(msg)) scores[INTENTS.HOMEWORK_HELP] += 2;
  if (/\bhomework\b/.test(msg)) scores[INTENTS.HOMEWORK_HELP] += 3;
  if (/\bassignment\b/.test(msg)) scores[INTENTS.HOMEWORK_HELP] += 2;

  // Concept explanation signals
  if (/\bwhat\s+is\b/.test(msg)) scores[INTENTS.CONCEPT_EXPLAIN] += 2;
  if (/\bwhat\s+are\b/.test(msg)) scores[INTENTS.CONCEPT_EXPLAIN] += 2;
  if (/\bhow\s+does\b/.test(msg)) scores[INTENTS.CONCEPT_EXPLAIN] += 2;
  if (/\bexplain\b/.test(msg)) scores[INTENTS.CONCEPT_EXPLAIN] += 3;
  if (/\bdefine\b/.test(msg)) scores[INTENTS.CONCEPT_EXPLAIN] += 2;
  if (/\bwhy\s+(do|does|is|are)\b/.test(msg)) scores[INTENTS.CONCEPT_EXPLAIN] += 2;

  // Social / off-topic
  if (/\b(favourite|favorite|like\s+more|prefer)\b/.test(msg)) scores[INTENTS.SOCIAL_CHAT] += 2;
  if (/\b(joke|funny|laugh|game|movie|cricket|food)\b/.test(msg)) scores[INTENTS.SOCIAL_CHAT] += 2;
  if (/\b(weather|news|politics|celebrity)\b/.test(msg)) scores[INTENTS.OFF_TOPIC] += 3;

  // Find highest score
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topIntent, topScore] = sorted[0];

  if (topScore === 0) {
    return { intent: INTENTS.UNKNOWN, confidence: 0.3, signals: [] };
  }

  const confidence = Math.min(0.95, 0.5 + (topScore * 0.1));
  return { intent: topIntent, confidence, signals: signals.slice(0, 5) };
}

/**
 * Returns true if this intent requires immediate escalation.
 * @param {string} intent
 */
export function requiresEscalation(intent) {
  return [
    INTENTS.ESCALATE_DISTRESS,
    INTENTS.ESCALATE_UNSAFE,
    INTENTS.ESCALATE_ABUSE,
  ].includes(intent);
}

/**
 * Returns the escalation type for logging/alerting.
 * @param {string} intent
 */
export function getEscalationType(intent) {
  const map = {
    [INTENTS.ESCALATE_DISTRESS]: 'DISTRESS',
    [INTENTS.ESCALATE_UNSAFE]:   'UNSAFE_CONTENT',
    [INTENTS.ESCALATE_ABUSE]:    'ABUSE_DISCLOSURE',
  };
  return map[intent] || null;
}
