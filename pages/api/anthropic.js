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
import { detectWeakness, saveWeakness } from '../../utils/weaknessDetector';
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
import { getSupabase } from '../../utils/supabase';

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
        built.systemPrompt += getIBDiplomaPrompt(subject);
      }

      // ── American curriculum injection — for UAE students on US curriculum ──
      if (userProfile?.uaeCurriculum === 'american' || isAmericanCurriculumTopic(message)) {
        built.systemPrompt += getAmericanCurriculumPrompt(subject);
      }

      // ── CBSE curriculum injection — for UAE students on Indian curriculum ──
      if (userProfile?.uaeCurriculum === 'cbse' || isCBSETopic(message)) {
        built.systemPrompt += getCBSECurriculumPrompt(subject);
      }

      // ── UAE MoE curriculum injection — for government school students ──
      if (userProfile?.uaeCurriculum === 'moe' || isMoETopic(message)) {
        built.systemPrompt += getMoECurriculumPrompt(subject);
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
          }
        });

        stream.on('error', (err) => {
          console.error('[STARKY STREAM ERROR]', err?.message);
          recordCircuitFailure();
          res.write(`data: ${JSON.stringify({ type: 'error', error: 'Something went wrong. Please try again!' })}\n\n`);
          res.end();
        });
      } catch (err) {
        recordCircuitFailure();
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
