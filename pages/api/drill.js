/**
 * pages/api/drill.js
 * ─────────────────────────────────────────────────────────────────
 * Past paper drill API — generates Cambridge-style questions and grades answers.
 * Supports: generate, grade, hint actions
 * Supports: camera/image uploads for question extraction
 * Supports: KG–Grade 9 "adventure mode" (friendly, no pressure)
 * Supports: O/A Level "exam mode" (Cambridge precision)
 */

import Anthropic from '@anthropic-ai/sdk';
import { getKnowledgeForTopic } from '../../utils/getKnowledgeForTopic';
import { withErrorAlert } from '../../utils/errorAlert';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 25000 });

const SYSTEM = `You are an expert Cambridge examiner and question setter with 30 years of experience.
You know every mark scheme, examiner report, and common misconception for all Cambridge subjects.
You also know how to explain concepts to children from age 4 to 18 in age-appropriate language.
If the student writes in Urdu or Roman Urdu, generate the question and feedback in Urdu.
CRITICAL: Respond ONLY with valid JSON. No markdown, no backticks, no preamble.`;

const SYSTEM_YOUNG = `You are Starky, a magical friendly teacher who makes learning feel like an adventure.
You create fun, encouraging questions for children aged 4-14.
You ALWAYS celebrate effort, even wrong answers. You NEVER make a child feel bad.
If the student writes in Urdu or Roman Urdu, generate the question and feedback in Urdu.
CRITICAL: Respond ONLY with valid JSON. No markdown, no backticks, no preamble.`;

const DIFFICULTY_MAP = {
  easy:   'A straightforward recall or single-step question. 1-2 marks.',
  medium: 'A typical exam question requiring understanding and application. 2-4 marks.',
  hard:   'A challenging question requiring deeper analysis. 4-6 marks.',
};

// ── Determine if this is a young learner ────────────────────────────────────
function isYoungLearner(level) {
  const youngLevels = ['KG','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9'];
  return youngLevels.includes(level);
}

// ── Generate question prompt ─────────────────────────────────────────────────
function buildGeneratePrompt({ level, subject, topic, difficulty, questionType, imageBase64, imageType, context }) {
  const young = isYoungLearner(level);
  const diffDesc = DIFFICULTY_MAP[difficulty] || DIFFICULTY_MAP.medium;

  if (imageBase64) {
    const imgRandomPos = ['A','B','C','D'][Math.floor(Math.random() * 4)];
    return `Look at this past paper question image. Extract the question exactly and create a drill question from it.
Generate a ${questionType === 'mcq' ? `multiple choice question with 4 options (A,B,C,D). Place the correct answer at position ${imgRandomPos}` : 'short answer question'} based on what you see.
Subject context: ${subject || 'unknown'} · Level: ${level}

Return this JSON:
${questionType === 'mcq' ? `{"question":"extracted/adapted question text","type":"mcq","options":{"A":"...","B":"...","C":"...","D":"..."},"correctOption":"${imgRandomPos}","topic":"${topic||'From paper'}","difficulty":"${difficulty}","marks":1,"markSchemeHint":"why correct answer is correct"}` : `{"question":"extracted/adapted question text","type":"structured","topic":"${topic||'From paper'}","difficulty":"${difficulty}","marks":3,"markSchemeHint":"key marking points"}`}`;
  }

  if (young) {
    const youngRandomPos = ['A','B','C','D'][Math.floor(Math.random() * 4)];
    const typeInstr = questionType === 'mcq'
      ? `Make a FUN multiple choice question with 4 options (A,B,C,D). Use simple, friendly language. One answer is clearly correct. IMPORTANT: Place the correct answer at position ${youngRandomPos}.`
      : 'Make a short, simple question. Use friendly language a child can understand easily.';

    return `Create a ${level} level question about "${topic}" in ${subject}.
${typeInstr}
Make it fun and encouraging! Age-appropriate for ${level} students.

Return this JSON:
${questionType === 'mcq'
  ? `{"question":"fun friendly question text","type":"mcq","options":{"A":"option 1","B":"option 2","C":"option 3","D":"option 4"},"correctOption":"${youngRandomPos}","topic":"${topic}","difficulty":"${difficulty}","marks":1,"markSchemeHint":"why correct"}`
  : `{"question":"simple friendly question","type":"structured","topic":"${topic}","difficulty":"${difficulty}","marks":2,"markSchemeHint":"key points to award marks"}`}`;
  }

  const randomPos = ['A','B','C','D'][Math.floor(Math.random() * 4)];
  const typeInstr = questionType === 'mcq'
    ? `Generate a MULTIPLE CHOICE question with exactly 4 options (A,B,C,D). Only one is correct. Distractors should be common misconceptions. IMPORTANT: Place the correct answer at position ${randomPos} — do NOT always put it at A.`
    : 'Generate a SHORT ANSWER question requiring 2-4 sentences.';

  const contextInstr = context === 'emsat' ? `\nThis is an EmSAT-style question for UAE government school students. Use EmSAT format and difficulty level. Reference UAE curriculum standards. Include UAE-relevant examples where appropriate.`
    : context === 'ib' ? `\nThis is an IB Diploma-style question. Use IB command terms (analyse, evaluate, discuss, to what extent). Reference IB assessment criteria and mark bands.`
    : context === 'university' ? `\nThis is university entrance preparation. Focus on EmSAT-level questions targeting university admission scores (1100-1500 range).`
    : '';

  return `Generate a ${context === 'emsat' ? 'EmSAT' : context === 'ib' ? 'IB Diploma' : 'Cambridge ' + level} ${subject} exam question on: "${topic}".
Difficulty: ${diffDesc}${contextInstr}
${typeInstr}

Return this JSON:
${questionType === 'mcq'
  ? `{"question":"full question text","type":"mcq","options":{"A":"...","B":"...","C":"...","D":"..."},"correctOption":"${randomPos}","topic":"${topic}","difficulty":"${difficulty}","marks":1,"markSchemeHint":"why correct answer is correct"}`
  : `{"question":"full question text","type":"structured","topic":"${topic}","difficulty":"${difficulty}","marks":3,"markSchemeHint":"key marking points for full marks"}`}`;
}

// ── Grade prompt ─────────────────────────────────────────────────────────────
function buildGradePrompt({ level, subject, topic, question, studentAnswer, questionType, options, marks }) {
  const young = isYoungLearner(level);
  const optText = questionType === 'mcq' && options
    ? `Options were:\nA: ${options.A}\nB: ${options.B}\nC: ${options.C}\nD: ${options.D}\n` : '';

  if (young) {
    return `Grade this answer from a ${level} student (child aged ${level === 'KG' ? '4-5' : '5-14'}).
Question: ${question}
${optText}Student's answer: "${studentAnswer}"
Marks available: ${marks || 1}

Be WARM, ENCOURAGING and CELEBRATORY. Never make the child feel bad.
Even if wrong, find something positive. Use simple language, emojis.

Return this JSON:
{
  "correct": true or false,
  "quality": 0-5,
  "score": marks awarded,
  "maxScore": ${marks || 1},
  "feedback": "Warm encouraging feedback with emojis — 2 sentences. Always starts with something positive even if wrong.",
  "examinerTip": "One fun friendly tip to remember this for next time",
  "modelAnswer": "Simple clear answer in child-friendly language"
}`;
  }

  return `Grade this Cambridge ${level} ${subject} answer.
Topic: ${topic}
Question: ${question}
${optText}Student's answer: "${studentAnswer}"
Marks available: ${marks || (questionType === 'mcq' ? 1 : 3)}

Grade exactly as a Cambridge examiner. Be precise, fair, constructive.

Return this JSON:
{
  "correct": true or false,
  "quality": 0-5 where 0=blackout, 1=wrong, 2=partial understanding, 3=correct but incomplete, 4=correct good explanation, 5=perfect Cambridge answer,
  "score": marks awarded as integer,
  "maxScore": total marks available,
  "feedback": "2-3 sentences — warm, specific, in Starky's voice. What they got right, what was missing, encouraging.",
  "examinerTip": "One precise Cambridge examiner tip — the exact keyword/phrase mark schemes require for this topic",
  "modelAnswer": "Ideal Cambridge mark scheme answer — exactly what earns full marks"
}`;
}

// ── Hint prompt ──────────────────────────────────────────────────────────────
function buildHintPrompt({ level, subject, topic, question }) {
  const young = isYoungLearner(level);

  if (young) {
    return `A ${level} student is stuck on this question about ${topic} in ${subject}.
Question: "${question}"

Give a fun, encouraging hint that helps them think without giving away the answer.
Use simple words, maybe an analogy or story they can relate to.
Keep it to 1-2 sentences maximum.

Return JSON: {"hint": "your friendly hint here"}`;
  }

  return `A ${level} ${subject} student is stuck on this question about ${topic}.
Question: "${question}"

Give a Cambridge-style hint that guides their thinking without revealing the answer.
Reference the key concept they need to recall. Keep it to 1-2 sentences.

Return JSON: {"hint": "your hint here"}`;
}

// ── Per-IP rate limiting ─────────────────────────────────────────────────────
const drillRateMap = new Map();
function checkDrillRate(ip) {
  const now = Date.now();
  const entry = drillRateMap.get(ip);
  if (!entry || now - entry.t > 60000) { drillRateMap.set(ip, { t: now, c: 1 }); return true; }
  if (entry.c >= 15) return false; // max 15 drill API calls per minute
  entry.c++;
  return true;
}
// Cleanup every 5 min
setInterval(() => { const now = Date.now(); for (const [k, v] of drillRateMap) { if (now - v.t > 120000) drillRateMap.delete(k); } }, 300000);

// ── Handler ──────────────────────────────────────────────────────────────────
export default withErrorAlert(async function handler(req, res) {
  const origin = req.headers.origin;
  const allowed = ['https://newworld.education','https://www.newworld.education','http://localhost:3000'];
  if (allowed.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });

  // Rate limit check
  const ip = req.headers['x-forwarded-for'] || 'unknown';
  if (!checkDrillRate(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }

  const { action, ...params } = req.body || {};
  if (!action) return res.status(400).json({ error:'action required' });

  try {
    let prompt;
    let systemPrompt = SYSTEM;
    let messages;

    if (action === 'generate') {
      prompt = buildGeneratePrompt(params);
      systemPrompt = isYoungLearner(params.level) ? SYSTEM_YOUNG : SYSTEM;
      // Add context-specific system prompt for UAE tracks
      if (params.context === 'emsat') systemPrompt += '\nYou are generating EmSAT-style questions for UAE Ministry of Education students. Questions must match EmSAT format, difficulty, and scoring. Use UAE context: AED currency, Dubai/Abu Dhabi examples, UAE government and society.';
      else if (params.context === 'ib') systemPrompt += '\nYou are generating IB Diploma-style questions. Use IB command terms precisely. Questions must align with IB assessment objectives and criteria. Reference the IB mark band descriptors.';
      // Inject topic-specific misconceptions and examiner tips
      const topicKnowledge = getKnowledgeForTopic(params.topic || '', params.subject || '');
      if (topicKnowledge) systemPrompt += '\n' + topicKnowledge;

      // If image provided, use vision
      if (params.imageBase64) {
        messages = [{
          role: 'user',
          content: [
            { type:'image', source:{ type:'base64', media_type:params.imageType||'image/jpeg', data:params.imageBase64 } },
            { type:'text', text:prompt }
          ]
        }];
      } else {
        messages = [{ role:'user', content:prompt }];
      }
    } else if (action === 'grade') {
      prompt = buildGradePrompt(params);
      systemPrompt = isYoungLearner(params.level) ? SYSTEM_YOUNG : SYSTEM;
      messages = [{ role:'user', content:prompt }];
    } else if (action === 'hint') {
      prompt = buildHintPrompt(params);
      systemPrompt = isYoungLearner(params.level) ? SYSTEM_YOUNG : SYSTEM;
      messages = [{ role:'user', content:prompt }];
    } else {
      return res.status(400).json({ error:`Unknown action: ${action}` });
    }

    // Retry with exponential backoff for resilience under load
    let response;
    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        response = await client.messages.create({
          model: /* PERMANENT: Haiku 3 only. Never change without Khurram's approval. */ 'claude-3-haiku-20240307',
          max_tokens: 800,
          system: systemPrompt,
          messages,
        });
        break;
      } catch (retryErr) {
        if (retryErr?.status && retryErr.status < 500 && retryErr.status !== 429) throw retryErr;
        if (attempt === 2) throw retryErr;
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
      }
    }

    const raw = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')
      .trim()
      .replace(/```json|```/g, '')
      .trim();

    if (!raw) {
      console.error('[DRILL API] Empty response from Claude');
      throw new Error('Empty AI response');
    }

    let parsed;
    try { parsed = JSON.parse(raw); } catch (parseErr) {
      console.error('[DRILL API] JSON parse failed:', raw.slice(0, 200));
      throw parseErr;
    }
    return res.status(200).json(parsed);

  } catch (err) {
    console.error('[DRILL API ERROR]', err);
    if (action === 'generate') return res.status(500).json({ error:'Failed to generate question. Please try again.' });
    if (action === 'hint') return res.status(200).json({ hint:'Think about what you already know about this topic — start with the basics!' });
    return res.status(500).json({ correct:false, quality:0, score:0, maxScore:1, feedback:'Something went wrong. Please try again!', examinerTip:'', modelAnswer:'' });
  }
});
