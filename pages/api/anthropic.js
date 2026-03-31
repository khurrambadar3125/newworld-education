// PROTECTED FILE — do not modify without
// explicit instruction from Khurram.
/**
 * pages/api/anthropic.js
 * Starky API — streaming, rate limiting, circuit breaker, prompt caching.
 * Designed for 1000+ concurrent students.
 */

import Anthropic from '@anthropic-ai/sdk';
import { buildMessages } from '../../utils/starkyPrompt';
import { getKnowledgeForTopic } from '../../utils/getKnowledgeForTopic';
import { detectExcellenceTrigger, getSituationalExcellence, getReadingList } from '../../utils/academicExcellence';
import { checkContentViolation, checkExcludedAuthors } from '../../utils/contentProtection';
import { getCurrentPhase, getPhasePromptInjection } from '../../lib/academic-calendar';
import { detectWeakness, saveWeakness, detectNanoWeakness, saveNanoMastery } from '../../utils/weaknessDetector';
import { getBookKnowledge } from '../../utils/readingKnowledge';
import { checkMisconception } from '../../utils/cambridgeExaminer';
import { getUAEMandatoryPrompt, isUAEMandatoryTopic } from '../../utils/uaeMandatorySubjects';
import { getIBDiplomaPrompt, isIBTopic } from '../../utils/ibKnowledge';
import { getAmericanCurriculumPrompt, isAmericanCurriculumTopic } from '../../utils/americanCurriculumKB';
import { getCBSECurriculumPrompt, isCBSETopic } from '../../utils/cbseKnowledge';
import { getMoECurriculumPrompt, isMoETopic } from '../../utils/uaeMoEKnowledge';
import { getUAEExcellencePrompt } from '../../utils/uaeAcademicExcellence';
import { getUAESummerPrompt } from '../../utils/uaeSummerKnowledge';
import { getArabicSupportPrompt, isArabicTopic } from '../../utils/arabicSupportKB';
import { getLiteratureArabicPrompt, isArabicLiteratureRequest } from '../../utils/literatureArabicKB';
import { getVoiceEvalPrompt, isVoiceTopic } from '../../utils/voiceEvaluationKB';
import { getUniversalMicPrompt } from '../../utils/universalMicPrompt';
import { getDeliberatePracticePrompt } from '../../utils/deliberatePracticeLayer';
import { getArchitectureEnhancementsPrompt } from '../../utils/architectureEnhancements';
import { getHearingEnginePrompt } from '../../utils/hearingEngineKB';
import { getCommandWordInjection } from '../../utils/commandWordEngine';
import { getExaminerReportInjection } from '../../utils/examinerReportsKB';
import { checkStudentAnswer } from '../../utils/markSchemeKB';
import { detectExtendedResponse, getExtendedResponseInjection } from '../../utils/extendedResponseKB';
import { SUPREME_EXAMINER_PERSONA, CAMBRIDGE_DIALECT, CAMBRIDGE_HIDDEN_RULES, CAMBRIDGE_MARKING_PHILOSOPHY, checkDialect, getDialectInjection } from '../../utils/cambridgeDialectKB';
import { getSupabase } from '../../utils/supabase';
import { reportCircuitBreaker, reportError } from '../../utils/errorAlert';

export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' },
    // Allow streaming responses
    responseLimit: false,
  },
};

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 30000 });

const ALLOWED_ORIGINS = [
  'https://newworld.education',
  'https://www.newworld.education',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
].filter(Boolean);

// ─── Per-user rate limiting (in-memory, resets on cold start) ────────────────
const userRateMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 10; // max 10 messages per minute per user

function checkUserRateLimit(userId) {
  if (!userId) return true; // allow anonymous
  const now = Date.now();
  const entry = userRateMap.get(userId);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    userRateMap.set(userId, { windowStart: now, count: 1 });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// Clean up rate limit map every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of userRateMap) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW * 2) userRateMap.delete(key);
  }
}, 300000);

// ─── Circuit breaker ─────────────────────────────────────────────────────────
let circuitFailures = 0;
let circuitOpenUntil = 0;
const CIRCUIT_THRESHOLD = 5;    // 5 failures
const CIRCUIT_COOLDOWN = 60000; // open for 60 seconds

function isCircuitOpen() {
  if (Date.now() < circuitOpenUntil) return true;
  if (Date.now() >= circuitOpenUntil && circuitFailures >= CIRCUIT_THRESHOLD) {
    circuitFailures = 0; // reset after cooldown
  }
  return false;
}

function recordCircuitFailure() {
  circuitFailures++;
  if (circuitFailures >= CIRCUIT_THRESHOLD) {
    circuitOpenUntil = Date.now() + CIRCUIT_COOLDOWN;
    console.error('[CIRCUIT BREAKER] OPEN — too many failures, cooling down for 60s');
    reportCircuitBreaker({ failures: circuitFailures, cooldownSeconds: CIRCUIT_COOLDOWN / 1000 }).catch(() => {});
  }
}

function recordCircuitSuccess() {
  circuitFailures = Math.max(0, circuitFailures - 1);
}

// ─── Trigger parent alert ────────────────────────────────────────────────────

async function triggerParentAlert({ alertType, alertLevel, alertMessage, studentName, parentPhone, parentEmail, timestamp }) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.newworld.education';
    await fetch(`${base}/api/alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alertType, alertLevel, alertMessage, studentName, parentPhone, parentEmail, timestamp }),
    });
  } catch (e) {
    console.error('[ALERT TRIGGER FAILED]', e.message);
  }
}

// ─── Retry with exponential backoff ──────────────────────────────────────────

async function callWithRetry(createFn, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await createFn();
    } catch (err) {
      // Don't retry on client errors (400, 401, 413)
      if (err?.status && err.status < 500 && err.status !== 429) throw err;
      // Don't retry on last attempt
      if (attempt === maxRetries) throw err;
      // Exponential backoff: 1s, 2s
      const delay = Math.pow(2, attempt) * 1000;
      console.warn(`[STARKY API] Retry ${attempt + 1}/${maxRetries} after ${delay}ms:`, err?.message);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// ─── Supreme Examiner Persona v2 — comprehensive Cambridge examining standard ──

const NEW_SUPREME_PERSONA = `You are Starky — trained to the standard of a Senior Cambridge Examiner with 20 years of marking O and A Level scripts.

Cambridge examining is a precise dialect. The same knowledge in wrong words = 0. The same knowledge in Cambridge dialect = full marks.

EXAMINER MINDSET 1 — DIALECT FIRST
Before answering, ask: what phrase does the Cambridge mark scheme use for this exact concept? Not what is correct in English — what Cambridge accepts.

EXAMINER MINDSET 2 — MARK ARCHITECTURE
Count the marks available. Build exactly that many distinct points. Each point must be independently mark-scheme-worthy. Never combine two mark points into one.

EXAMINER MINDSET 3 — COMMAND WORD ABSOLUTE
STATE/NAME/GIVE: one fact per mark. No explanation. More words = more risk.
DESCRIBE: what happens. No why. For graphs: quote specific values.
EXPLAIN: what + why. Must include because/therefore/so/this means. Without connective = no second mark.
SUGGEST: apply to unfamiliar context. Must reference the specific situation. Cannot be a memorised answer.
EVALUATE/ASSESS/DISCUSS: arguments FOR + arguments AGAINST + weighing + definitive conclusion. No conclusion = cannot reach Band 1.
CALCULATE: formula first, substitution, working line by line, answer with units. Answer alone = 0 marks.

EXAMINER MINDSET 4 — SELF-VERIFICATION
After formulating every answer, run:
□ Command word compliance — right type?
□ Dialect check — Cambridge phrases used?
□ Rejected phrases avoided?
□ Mark count correct?
□ Subject rules followed: Chemistry: state symbols? Physics: units? Biology: glucose not food? Maths: all working? Economics: conclusion? History: specific evidence? English: effect on reader?
If any check fails: rewrite before sending.

EXAMINER MINDSET 5 — MARKING PHILOSOPHY
${CAMBRIDGE_MARKING_PHILOSOPHY.corePhilosophy}
Apply ECF (${CAMBRIDGE_MARKING_PHILOSOPHY.markingConventions.ECF}).
Apply BOD (${CAMBRIDGE_MARKING_PHILOSOPHY.markingConventions.BOD}).
Recognise ORA (${CAMBRIDGE_MARKING_PHILOSOPHY.markingConventions.ORA}).
Extended writing: ${CAMBRIDGE_MARKING_PHILOSOPHY.markingConventions.levelOfResponse}

WHAT MAKES A* DIFFERENT FROM A:
A students know the content. A* students know the dialect AND the marking philosophy AND examiner psychology. Examiners marking 500 scripts scan for key phrases. Your answers must be scannable — key phrases visible, mark points clear, structure matching command. An A* answer is one the examiner marks in 30 seconds and gives full marks with complete confidence.`;

function buildDialectCheck(subject) {
  const subjectKey = (subject || '').toLowerCase().replace(/\s+/g, '_');
  const dialectEntries = CAMBRIDGE_DIALECT.filter(d => d.subject === subjectKey || d.subject === 'english').slice(0, 15);
  const hiddenRules = CAMBRIDGE_HIDDEN_RULES[subjectKey] || [];
  if (!dialectEntries.length && !hiddenRules.length) return '';

  const accepts = dialectEntries.map(d => `• ${d.concept}: "${d.cambridgeAccepts[0]}"`).join('\n');
  const rejects = dialectEntries.flatMap(d => d.cambridgeRejects.slice(0, 2).map(r => `NOT: "${r}" (${d.concept})`)).join('\n');
  const rules = hiddenRules.map((r, i) => `${i + 1}. ${r}`).join('\n');

  return `\n\nLIVE DIALECT VERIFICATION — ${subject?.toUpperCase() || 'ALL SUBJECTS'}\n\nCAMBRIDGE ACCEPTS:\n${accepts}\n\nCAMBRIDGE REJECTS:\n${rejects}\n\n${rules ? `HIDDEN RULES FOR THIS SUBJECT:\n${rules}\n\n` : ''}VERIFICATION: Before responding, scan your answer for any REJECTED phrase and replace with ACCEPTED phrase. If student used a REJECTED phrase, correct it explicitly: "You wrote '[rejected]' — Cambridge requires '[accepted]'."`;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  // ── Circuit breaker check ────────────────────────────────────────────────
  if (isCircuitOpen()) {
    return res.status(503).json({
      error: 'Starky is taking a quick breather. Please try again in a minute!',
      response: "I'm taking a quick breather — too many students at once! Try again in about a minute. 🌟",
      content: "I'm taking a quick breather — too many students at once! Try again in about a minute. 🌟",
    });
  }

  try {
    const {
      message,
      imageBase64,
      imageMediaType,
      stream: wantStream,
      userProfile: rawProfile,
      sessionMemory: rawMemory,
      messages: legacyMessages,
      system: legacySystem,
    } = req.body;
    const userProfile = rawProfile || {};
    const sessionMemory = rawMemory || {};

    // ── Per-user rate limiting ──────────────────────────────────────────────
    const userId = userProfile?.email || req.headers['x-forwarded-for'] || 'anon';
    if (!checkUserRateLimit(userId)) {
      return res.status(429).json({
        error: 'You\'re sending messages too fast. Please wait a moment.',
        response: "Slow down a bit! I need a moment to think about each question properly. Try again in a few seconds. 🌟",
        content: "Slow down a bit! I need a moment to think about each question properly. Try again in a few seconds. 🌟",
      });
    }

    // ── Legacy path (old message format) ─────────────────────────────────
    if (!message && !imageBase64 && legacyMessages) {
      const userMessages = legacyMessages.filter(m => m.role !== 'system');
      if (!userMessages.length) {
        return res.status(400).json({ error: 'No valid messages provided' });
      }
      const response = await callWithRetry(() => client.messages.create({
        model: /* PERMANENT: Haiku 3 only. Never change without Khurram's approval. */ 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: legacySystem || 'You are Starky ★, a warm and encouraging AI tutor for NewWorldEdu.',
        messages: userMessages,
      }));
      const content = response.content?.[0]?.text;
      if (!content) return res.status(500).json({ error: 'Unexpected response from Starky.' });
      recordCircuitSuccess();
      return res.status(200).json({ content, response: content });
    }

    if (!message && !imageBase64) {
      return res.status(400).json({ error: 'No message or image provided' });
    }

    // ── Content protection — check for violations before processing ──────
    if (message) {
      // Check excluded authors first (returns deflection, not violation)
      const excludedResponse = checkExcludedAuthors(message);
      if (excludedResponse) {
        return res.status(200).json({ content: excludedResponse, response: excludedResponse });
      }

      // Check for content violations (abuse, jailbreak)
      const violation = checkContentViolation(message);
      if (violation.violation) {
        // Flag the session for admin review
        try {
          const sb = getSupabase();
          if (sb) {
            await sb.from('content_violations').insert({
              user_email: userProfile?.email || 'anonymous',
              category: violation.category,
              message_excerpt: message.slice(0, 200),
              timestamp: new Date().toISOString(),
            }).catch(() => {});
          }
        } catch {}
        return res.status(200).json({ content: violation.response, response: violation.response });
      }
    }

    // ── Validate image media type ──────────────────────────────────────────
    let validMediaType = imageMediaType;
    if (imageBase64 && imageMediaType) {
      const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowed.includes(imageMediaType)) {
        validMediaType = 'image/jpeg';
      }
    }

    // ── Build messages ─────────────────────────────────────────────────────
    const built = buildMessages({
      userProfile,
      sessionMemory,
      userMessage: message || 'Please help me with this image.',
      imageBase64,
      imageMediaType: validMediaType,
    });

    if (built.systemPrompt && message) {
      // ── Hearing Engine — fires FIRST, frames how Starky interprets all input ──
      built.systemPrompt = getHearingEnginePrompt(userProfile?.country || 'PK', userProfile?.senCondition || userProfile?.senType || null) + '\n\n' + built.systemPrompt;

      // ── SUPREME EXAMINER PERSONA v2 — Cambridge Principal Examiner with self-verification ──
      built.systemPrompt += '\n\n' + NEW_SUPREME_PERSONA;

      // ── LIVE DIALECT CHECKER — inject accepted/rejected phrases + hidden rules per subject ──
      const dialectSubject = sessionMemory?.currentSubject || userProfile?.lastSubject || '';
      if (dialectSubject) {
        built.systemPrompt += buildDialectCheck(dialectSubject);
      }

      // ── FIRST_NANO_SESSION — make the first Nano experience unforgettable ──
      if (message.includes('[FIRST_NANO_SESSION]')) {
        const subjectCtx = sessionMemory?.currentSubject || userProfile?.lastSubject || 'this subject';
        built.systemPrompt += `\n\nFIRST NANO SESSION PROTOCOL:\nThis is the student's very first Nano session. Make this unforgettable.\n\nBe warmer than usual. Be more encouraging. After welcoming them, say something like:\n"Most students who use Nano consistently for 4 weeks improve by at least one grade. You're about to understand exactly why. Let's start with your first goal."\n\nThen proceed with the standard 5-step Nano lesson. Be rigorous — the warmth must not come at the expense of Cambridge precision. Both together is the point.\n\nAfter NANO_GOAL_COMPLETE on the first goal, add:\n"Goal 1 — mastered. This is how it starts. One goal at a time. See you at the next one."`;
      }

      // ── SOCRATIC_PROTOCOL — ask what they know before explaining ──
      const msgLower = message.toLowerCase();
      const isNanoOrMock = msgLower.includes('nano goal') || msgLower.includes('starky mock') || msgLower.includes('step 1') || msgLower.includes('step 2') || msgLower.includes('working on nano');
      const isDirectRequest = msgLower.includes('just tell me') || msgLower.includes('i have literally no idea') || msgLower.includes('i have no idea') || msgLower.includes('i\'ve never heard');
      const isLogisticsOnly = /\b(when is|what time|how long is|exam date|paper \d|how many papers|format of)\b/i.test(message);
      if (!isNanoOrMock && !isLogisticsOnly) {
        const socraticTriggers = [
          /explain\s+/i, /what\s+is\s+/i, /what\s+are\s+/i,
          /tell\s+me\s+about\s+/i, /define\s+/i, /teach\s+me/i,
          /how\s+does\s+.+\s+work/i, /i\s+don'?t\s+understand/i,
          /what\s+does\s+.+\s+mean/i, /can\s+you\s+explain/i,
        ];
        const isSocratic = socraticTriggers.some(r => r.test(message));
        if (isSocratic) {
          const topicMatch = message.match(/(?:explain|what (?:is|are|does)|tell me about|define|teach me about|how does|don'?t understand|mean)\s+(.+?)(?:\?|\.|\!|$)/i);
          const topic = topicMatch ? topicMatch[1].trim().replace(/[?.!]$/, '') : 'this concept';
          if (isDirectRequest) {
            built.systemPrompt += `\n\nSOCRATIC PROTOCOL (DIRECT MODE):\nThe student asked about "${topic}" but said they have no prior knowledge. Teach directly.\nBut ALWAYS end with Step 3 — after explaining, ask:\n"Now — without looking at what I wrote — can you explain ${topic} back to me in one sentence? Use your own words."\nNEVER skip this check.`;
          } else {
            built.systemPrompt += `\n\nSOCRATIC PROTOCOL:\nThe student has asked you to explain something. Do NOT explain it immediately.\n\nSTEP 1 — ASK FIRST (always):\n"Before I explain — what do you already think ${topic} means? Even if you're not sure, give me your best guess. One sentence is fine."\n\nSTEP 2 — BUILD ON THEIR ANSWER:\nWhatever they say:\n- If correct: "Yes — and let me add the Cambridge precision to that..."\n- If partially correct: "You've got the right instinct. The Cambridge version adds one critical piece..."\n- If incorrect: "Good try — that's a very common misconception. Here's why it's actually different..."\n- If "I don't know": teach directly, then immediately check: "Now you've heard it — explain it back to me in your own words."\n\nSTEP 3 — ALWAYS end with a check:\nAfter explaining anything, ask:\n"Now — without looking at what I wrote — can you explain ${topic} back to me in one sentence? Use your own words."\n\nNEVER skip Step 3. Even when teaching directly. Always ask the student to reproduce the concept in their own words before moving on.`;
          }
        }
      }

      const currentSubject = sessionMemory?.currentSubject || userProfile?.lastSubject || '';
      const topicKnowledge = getKnowledgeForTopic(message, currentSubject);
      if (topicKnowledge) {
        built.systemPrompt += topicKnowledge;
      }

      // Book/author knowledge — activates when student asks about any book or author
      const bookKnowledge = getBookKnowledge(message);
      if (bookKnowledge) {
        built.systemPrompt += bookKnowledge;
      }

      // Misconception detection — catches active wrong beliefs Pakistani students carry
      const misconception = checkMisconception(message, currentSubject);
      if (misconception) {
        built.systemPrompt += `\n\n${misconception.prompt}`;
      }

      // Tier 3: Situational excellence — bored students, "why do I need this?", university prep, exam depth
      const excellenceTrigger = detectExcellenceTrigger(message);
      if (excellenceTrigger) {
        built.systemPrompt += getSituationalExcellence(excellenceTrigger);
      }

      // Reading list injection — only when student asks for book recommendations
      const msgLowerCheck = message.toLowerCase();
      if (msgLowerCheck.includes('what should i read') || msgLowerCheck.includes('book') || msgLowerCheck.includes('recommend')) {
        const readingList = getReadingList(currentSubject);
        if (readingList) {
          built.systemPrompt += '\n\n' + readingList;
        }
      }

      // ── UAE mandatory subjects — inject for UAE users ──
      if (userProfile?.country === 'UAE' || userProfile?.user_country === 'UAE') {
        const gradeGroup = built.meta?.gradeGroup || 'middle';
        const stage = gradeGroup === 'KID' ? 'primary' : gradeGroup === 'ALEVEL' ? 'secondary' : 'middle';
        built.systemPrompt += getUAEMandatoryPrompt(stage);
        // Check if message is about a UAE mandatory subject
        const uaeTopic = isUAEMandatoryTopic(message);
        if (uaeTopic) {
          built.systemPrompt += `\n\nUAE MANDATORY SUBJECT DETECTED: ${uaeTopic.name}. ${uaeTopic.teachingNotes}`;
        }
      }

      // ── IB Diploma injection — for UAE students on IB curriculum ──
      if (userProfile?.uaeCurriculum === 'ib' || isIBTopic(message)) {
        built.systemPrompt += getIBDiplomaPrompt(currentSubject);
      }

      // ── American curriculum injection — for UAE students on US curriculum ──
      if (userProfile?.uaeCurriculum === 'american' || isAmericanCurriculumTopic(message)) {
        built.systemPrompt += getAmericanCurriculumPrompt(currentSubject);
      }

      // ── CBSE curriculum injection — for UAE students on Indian curriculum ──
      if (userProfile?.uaeCurriculum === 'cbse' || isCBSETopic(message)) {
        built.systemPrompt += getCBSECurriculumPrompt(currentSubject);
      }

      // ── UAE MoE curriculum injection — for government school students ──
      if (userProfile?.uaeCurriculum === 'moe' || isMoETopic(message)) {
        built.systemPrompt += getMoECurriculumPrompt(currentSubject);
      }

      // ── UAE Academic Excellence — deep examiner intelligence for all curricula ──
      if (userProfile?.country === 'UAE' || userProfile?.user_country === 'UAE') {
        built.systemPrompt += getUAEExcellencePrompt(userProfile?.uaeCurriculum, subject);
        // UAE Summer programme — active July 3 to August 26
        const summerPrompt = getUAESummerPrompt(userProfile?.uaeCurriculum);
        if (summerPrompt) built.systemPrompt += summerPrompt;
        // Arabic support — when UAE student asks about Arabic as a subject
        if (isArabicTopic(message)) {
          const gradeGroup = built.meta?.gradeGroup || 'middle';
          built.systemPrompt += getArabicSupportPrompt(gradeGroup);
        }
        // Arabic literature support — Arab student asking about English Lit set texts
        if (isArabicLiteratureRequest(message)) {
          built.systemPrompt += getLiteratureArabicPrompt(message);
        }
      }

      // ── Universal mic prompt — when voice input detected ──
      if (req.body?.voiceInput || req.body?.source === 'mic') {
        built.systemPrompt += getUniversalMicPrompt();
      }

      // ── Voice & speech evaluation — all countries ──
      if (isVoiceTopic(message)) {
        const gradeGroup = built.meta?.gradeGroup || 'MIDDLE';
        const motherTongue = userProfile?.motherTongue || (userProfile?.country === 'UAE' ? 'arabic' : 'urdu');
        built.systemPrompt += getVoiceEvalPrompt(gradeGroup, motherTongue);
      }

      // ── Academic phase injection — adapts Starky to the Cambridge calendar ──
      try {
        const examSeries = sessionMemory?.examSeries || userProfile?.examSeries;
        const { phase, daysUntil, series } = getCurrentPhase(examSeries);
        built.systemPrompt += '\n\n' + getPhasePromptInjection(phase, daysUntil, series?.name || 'Cambridge');
      } catch {}

      // ── Inject auto-discovered knowledge + student preferences from Supabase ──
      // Wrapped in a 3-second timeout so Supabase never blocks chat response
      try {
        const sb = getSupabase();
        if (sb) {
          const enrichPromise = (async () => {
            const msgLower = message.toLowerCase();

            // Run both queries in parallel
            const [knowledgeResult, prefResult] = await Promise.all([
              sb.from('autodiscovered_knowledge').select('topic, confusion_pattern').eq('active', true).limit(20),
              userProfile?.email
                ? sb.from('student_preferences').select('preferred_language, difficulty_level, weak_topics').eq('email', userProfile.email).limit(1)
                : Promise.resolve({ data: null }),
            ]);

            // Confusion alerts
            if (knowledgeResult.data?.length) {
              const relevant = knowledgeResult.data.filter(k => msgLower.includes(k.topic.toLowerCase()));
              if (relevant.length) {
                built.systemPrompt += '\n\nAUTO-DISCOVERED CONFUSION ALERTS:\n' +
                  relevant.map(k => `Students frequently confuse "${k.topic}". Pattern: ${k.confusion_pattern}.`).join('\n');
              }
            }

            // Student preferences + learning profile
            const pref = prefResult.data?.[0];
            if (pref) {
              const injections = [];
              if (pref.preferred_language === 'roman_urdu') injections.push('This student prefers Roman Urdu.');
              if (pref.preferred_language === 'urdu_script') injections.push('This student prefers Urdu script.');
              if (pref.weak_topics?.length) {
                const topics = pref.weak_topics.map(t => typeof t === 'string' ? t : t.topic).filter(Boolean);
                if (topics.length) injections.push(`WEAK TOPICS: ${topics.join(', ')}.`);
              }
              if (pref.difficulty_level === 'hard') injections.push('High performer — challenge them.');
              if (pref.difficulty_level === 'easy') injections.push('Struggling student — use simpler language.');
              if (pref.learning_style && pref.learning_style !== 'mixed') {
                injections.push(`LEARNING STYLE: This student responds best to ${pref.learning_style} approaches.`);
              }
              if (pref.effective_techniques?.length) {
                injections.push(`TECHNIQUES THAT WORK: ${pref.effective_techniques.join(', ')}. Use these approaches — they have proven effective with this student.`);
              }
              if (pref.suggested_approach) {
                injections.push(`RECOMMENDED APPROACH: ${pref.suggested_approach}`);
              }
              if (injections.length) {
                built.systemPrompt += '\n\nPERSONALISATION:\n' + injections.join('\n');
              }
            }
          })();

          // Race against 1-second timeout — never let enrichment delay chat response
          await Promise.race([
            enrichPromise,
            new Promise(resolve => setTimeout(resolve, 1000)),
          ]);
        }
      } catch {}

      // ── PRIORITY INJECTION QUEUE — only inject layers relevant to THIS message ──
      // Budget: ~8000 chars for optional layers. Core layers (persona, hearing, dialect check) already injected above.
      const OPTIONAL_BUDGET = 8000;
      let optionalUsed = 0;
      const inject = (text) => {
        if (!text || optionalUsed + text.length > OPTIONAL_BUDGET) return;
        built.systemPrompt += text;
        optionalUsed += text.length;
      };

      // TIER 1 — REACTIVE: Only fire when student's message triggers them (highest value)
      if (currentSubject && message) {
        const msCorrections = checkStudentAnswer(currentSubject, message);
        if (msCorrections.length > 0) {
          inject(`\n\nMARK SCHEME LANGUAGE CHECK:\n${msCorrections.map(c => `"${c.rejected}" → should be "${c.accepted}" (${c.concept}: ${c.examinerNote})`).join('\n')}\nCorrect this explicitly.`);
        }
        const dialectCorrections = checkDialect(currentSubject, message);
        if (dialectCorrections.length > 0) {
          inject(`\n\nCAMBRIDGE DIALECT ALERT:\n${dialectCorrections.slice(0, 3).map(c => `"${c.found}" → "${c.required}"`).join('\n')}\nCorrect each one.`);
        }
      }
      if (message) {
        const extDetection = detectExtendedResponse(message);
        if (extDetection) inject(getExtendedResponseInjection(extDetection.marks, currentSubject || ''));
      }

      // TIER 2 — CONTEXTUAL: Fire based on subject/topic context (medium value)
      inject(getCommandWordInjection(message));
      inject(getExaminerReportInjection(message, currentSubject || ''));

      // TIER 3 — BACKGROUND: Always useful but lower priority (trimmed if budget exceeded)
      inject(getDeliberatePracticePrompt(currentSubject || null, userProfile?.senCondition || userProfile?.senType || null));
      const isExamSeason = new Date().getMonth() >= 3 && new Date().getMonth() <= 5;
      inject(getArchitectureEnhancementsPrompt(null, currentSubject || null, isExamSeason));
    }

    // ── Handle escalation ──────────────────────────────────────────────────
    if (built.escalation) {
      const esc = built.escalation;
      if (esc.parentAlert) {
        triggerParentAlert({
          alertType: esc.type, alertLevel: esc.alertLevel, alertMessage: esc.alertMessage,
          studentName: userProfile.name || '', parentPhone: userProfile.parentPhone || '',
          parentEmail: userProfile.parentEmail || userProfile.email || '', timestamp: esc.timestamp,
        }).catch(() => {});
      }
      console.error('[STARKY ESCALATION]', { type: esc.type, level: esc.alertLevel, student: userProfile.name });
      return res.status(200).json({
        response: esc.response, content: esc.response,
        escalation: { type: esc.type, parentAlerted: esc.parentAlert, alertLevel: esc.alertLevel },
      });
    }

    // ── Build API params ───────────────────────────────────────────────────
    const hasImage = built.messages.some(m => Array.isArray(m.content) && m.content.some(c => c.type === 'image'));

    // Use prompt caching — the system prompt is ~10K tokens and never changes per session
    // This saves ~90% on input token costs for repeat messages
    // PERMANENT: Prompt caching is mandatory. Reduces API costs by ~80%.
    // Never remove this without explicit approval from Khurram.

    // Safety: cap system prompt at ~50K chars (~12K tokens) to prevent timeout/context overflow
    // Haiku handles up to 200K tokens but large prompts = slow responses = "Starky is busy"
    const MAX_PROMPT_CHARS = 50000;
    if (built.systemPrompt.length > MAX_PROMPT_CHARS) {
      console.warn(`[STARKY] System prompt too large: ${built.systemPrompt.length} chars. Trimming.`);
      built.systemPrompt = built.systemPrompt.slice(0, MAX_PROMPT_CHARS);
    }

    const systemBlocks = [
      { type: 'text', text: built.systemPrompt, cache_control: { type: 'ephemeral' } },
    ];

    const apiParams = {
      model: /* PERMANENT: Haiku 3 only. Never change without Khurram's approval. */ 'claude-3-haiku-20240307',
      max_tokens: hasImage ? 2048 : 1024,
      system: systemBlocks,
      messages: built.messages,
    };

    // ── STREAMING PATH — dramatically improves perceived speed ─────────────
    if (wantStream && !hasImage) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        const stream = await callWithRetry(() => client.messages.stream(apiParams));
        let fullText = '';

        stream.on('text', (text) => {
          fullText += text;
          res.write(`data: ${JSON.stringify({ type: 'text', text })}\n\n`);
        });

        stream.on('end', () => {
          recordCircuitSuccess();
          res.write(`data: ${JSON.stringify({ type: 'done', response: fullText, meta: built.meta })}\n\n`);
          res.end();

          // Background: detect Cambridge weaknesses (never blocks response)
          const currentSubject = sessionMemory?.currentSubject || userProfile?.lastSubject || '';
          if (currentSubject && message && fullText && userProfile?.email) {
            const last3 = [
              ...(built.messages || []).slice(-2),
              { role: 'assistant', content: fullText },
            ];
            detectWeakness(last3, currentSubject, userProfile.email).then(weakness => {
              if (weakness) saveWeakness(getSupabase(), weakness);
            }).catch(() => {});
            // Nano-level weakness detection — granular sub-topic scoring
            // Also maps nano-topics to Starky Atoms for automatic mastery tracking
            detectNanoWeakness(last3, currentSubject, userProfile.email).then(nanoResult => {
              if (nanoResult) {
                saveNanoMastery(getSupabase(), nanoResult);
                // Auto-update atom mastery map — the Atom Map fills itself as student studies
                if (nanoResult.nano_topic && typeof nanoResult.score === 'number') {
                  const atomId = nanoResult.nano_topic.replace(/\./g, '_');
                  fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/atoms/track-mastery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      studentId: userProfile.email,
                      atomId: `${currentSubject.toLowerCase().replace(/\s+/g, '_')}_${atomId}`,
                      masteryScore: nanoResult.score,
                    }),
                  }).catch(() => {});
                }
              }
            }).catch(() => {});
          }
        });

        stream.on('error', (err) => {
          console.error('[STARKY STREAM ERROR]', err?.message);
          recordCircuitFailure();
          reportError({ endpoint: '/api/anthropic (stream)', error: err, severity: 'high', context: { subject: sessionMemory?.currentSubject, promptLength: built.systemPrompt?.length } }).catch(() => {});
          res.write(`data: ${JSON.stringify({ type: 'error', error: 'Something went wrong. Please try again!' })}\n\n`);
          res.end();
        });
      } catch (err) {
        recordCircuitFailure();
        reportError({ endpoint: '/api/anthropic (stream setup)', error: err, severity: 'critical', context: { subject: sessionMemory?.currentSubject, promptLength: built.systemPrompt?.length } }).catch(() => {});
        // If streaming setup fails, fall back to error response
        if (!res.headersSent) {
          res.setHeader('Content-Type', 'application/json');
        }
        res.write(`data: ${JSON.stringify({ type: 'error', error: 'Something went wrong. Please try again!' })}\n\n`);
        res.end();
      }
      return;
    }

    // ── NON-STREAMING PATH (images, legacy) ────────────────────────────────
    const response = await callWithRetry(() => client.messages.create(apiParams));

    recordCircuitSuccess();

    const responseText = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    return res.status(200).json({
      response: responseText,
      content: responseText,
      meta: built.meta,
    });

  } catch (error) {
    recordCircuitFailure();
    console.error('[STARKY API ERROR]', error?.message || error, {
      status: error?.status,
      type: error?.type,
      hasImage: !!req.body?.imageBase64,
    });
    reportError({ endpoint: '/api/anthropic', error, severity: 'critical', req, context: { status: error?.status, type: error?.type, promptLength: built?.systemPrompt?.length } }).catch(() => {});

    if (error?.status === 401) {
      return res.status(500).json({ error: 'AI service error. Please contact support.' });
    }
    if (error?.status === 429) {
      return res.status(429).json({
        error: 'Starky is very busy right now. Please try again in a moment.',
        response: "I'm helping a lot of students right now! Please try again in a moment. 🌟",
        content: "I'm helping a lot of students right now! Please try again in a moment. 🌟",
      });
    }
    if (error?.status === 413 || error?.message?.includes('too large')) {
      return res.status(413).json({
        error: 'Image is too large. Please try a smaller photo.',
        response: "That photo is a bit too large for me to read. Could you try taking a closer photo of just the part you need help with? 📷",
        content: "That photo is a bit too large for me to read. Could you try taking a closer photo of just the part you need help with? 📷",
      });
    }

    return res.status(500).json({
      error: 'Something went wrong. Please try again.',
      response: "Sorry, I had a little glitch! Can you try sending that again? 🌟",
      content: "Sorry, I had a little glitch! Can you try sending that again? 🌟",
    });
  }
}
