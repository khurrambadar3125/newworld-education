/**
 * /api/cron/question-bank-grow.js
 * ─────────────────────────────────────────────────────────────────
 * Daily cron — identifies thin topics and auto-generates questions to fill gaps.
 * Runs at 2am PKT (21:00 UTC).
 *
 * Strategy:
 * 1. Find topics with fewer than 10 questions
 * 2. Generate 5 MCQ + 5 structured per thin topic
 * 3. Cap at 20 topics per run to control API costs
 */

import Anthropic from '@anthropic-ai/sdk';
import { findThinTopics, saveQuestion, getBankStats } from '../../../utils/questionBank';
import { getKnowledgeForTopic } from '../../../utils/getKnowledgeForTopic';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 30000 });

const SYSTEM = `You are an expert Cambridge examiner and question setter with 30 years of experience.
You know every mark scheme, examiner report, and common misconception for all Cambridge subjects.
CRITICAL: Respond ONLY with valid JSON arrays. No markdown, no backticks, no preamble.`;

// All subjects and their levels for initial seeding
const SEED_SUBJECTS = {
  'O Level': [
    'Biology', 'Chemistry', 'Physics', 'Mathematics', 'English Language',
    'Economics', 'Computer Science', 'Pakistan Studies', 'Accounting',
    'Business Studies', 'Geography', 'History', 'Sociology',
    'Additional Mathematics', 'Statistics',
  ],
  'A Level': [
    'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Further Mathematics',
    'Economics', 'Computer Science', 'English Language', 'Psychology',
    'Business Studies', 'Accounting', 'Sociology', 'Geography', 'History', 'Law',
  ],
};

// Topic lists (reuse from drill.jsx structure)
const TOPICS = {
  'Biology': ['Cell Structure & Organisation','Diffusion, Osmosis & Active Transport','Biological Molecules','Enzymes','Plant Nutrition (Photosynthesis)','Animal Nutrition & Digestion','Gas Exchange','Transport in Plants','Transport in Humans (Circulatory System)','Respiration','Excretion & Homeostasis','Coordination & Response (Nervous System)','Hormones & Endocrine System','Reproduction','Inheritance & Genetics','Variation & Natural Selection','Ecology & Environment','Human Influences on the Environment'],
  'Chemistry': ['Atomic Structure & The Periodic Table','Chemical Bonding','Stoichiometry & Moles','Acids, Bases & Salts','The Mole & Calculations','Electrolysis','Energy Changes in Chemical Reactions','Rates of Reaction','Equilibrium','Redox Reactions','Organic Chemistry — Alkanes & Alkenes','Organic Chemistry — Alcohols & Acids','Polymers','Extraction of Metals'],
  'Physics': ['Measurements & Units','Motion (Kinematics)','Forces & Newton\'s Laws','Momentum & Impulse','Work, Energy & Power','Pressure','Thermal Physics (Heat Transfer)','Waves — Properties & Behaviour','Light & Optics','Sound','Current Electricity & Circuits','Magnetic Effects of Current','Electromagnetic Induction','Atomic Structure & Radioactivity'],
  'Mathematics': ['Number (Fractions, Decimals, Percentages)','Algebra — Expressions & Equations','Sequences & Series','Functions','Coordinate Geometry (Straight Lines)','Quadratic Equations & Graphs','Simultaneous Equations','Indices & Surds','Trigonometry (SOH CAH TOA)','Circle Theorems','Mensuration (Area & Volume)','Vectors','Probability','Statistics (Mean, Median, Mode)','Differentiation','Integration'],
  'Economics': ['Basic Economic Problem','Supply & Demand','Price Elasticity','Market Structures','Production & Costs','National Income & GDP','Economic Growth','Unemployment','Inflation','Monetary Policy','Fiscal Policy','International Trade','Balance of Payments','Exchange Rates','Market Failure & Externalities'],
  'English Language': ['Reading Comprehension','Inference & Deduction','Summary Writing','Directed Writing','Descriptive Writing','Narrative Writing','Argumentative & Persuasive Writing','Language Analysis'],
  'Computer Science': ['Data Representation (Binary, Hex)','Logic Gates & Boolean Algebra','Algorithms & Pseudocode','Programming Concepts','Data Structures (Arrays, Lists)','Searching & Sorting Algorithms','Databases','Computer Networks','Security & Encryption'],
  'Pakistan Studies': ['Physical Geography of Pakistan','Climate of Pakistan','Agriculture in Pakistan','Industry & Trade','Movement for Pakistan','Creation of Pakistan (1947)','Constitutional Development','Political History (1947–present)'],
  'Accounting': ['Double Entry Bookkeeping','Trial Balance','Income Statement','Balance Sheet','Bank Reconciliation','Depreciation','Cash Flow Statements','Ratio Analysis'],
  'Business Studies': ['Business Objectives & Stakeholders','Marketing Mix','Market Research','Production Methods','Finance — Sources & Cash Flow','Human Resource Management','Motivation Theory','Globalisation & Multinationals'],
  'Geography': ['River Processes & Landforms','Earthquakes & Volcanoes','Weather & Climate','Population','Settlement','Migration','Urbanisation','Environmental Management'],
  'History': ['WWI Causes & Consequences','Treaty of Versailles','League of Nations','Rise of Dictators','WWII Causes & Consequences','Cold War','Decolonisation','International Relations 1919–1945'],
  'Sociology': ['Research Methods','Family','Education','Crime & Deviance','Social Inequality','Media','Social Stratification'],
  'Additional Mathematics': ['Quadratics & Polynomials','Indices & Surds','Logarithms & Exponentials','Trigonometry (Identities & Equations)','Coordinate Geometry (Circles & Lines)','Differentiation','Integration','Kinematics','Binomial Theorem'],
  'Statistics': ['Data Collection & Sampling','Averages & Measures of Spread','Cumulative Frequency & Box Plots','Probability (Combined Events)','Binomial Distribution','Normal Distribution','Correlation & Regression'],
  'Further Mathematics': ['Complex Numbers','Matrices (Eigenvalues & Eigenvectors)','Differential Equations','Vectors (3D)','Further Calculus','Further Probability'],
  'Psychology': ['Research Methods & Ethics','Cognitive Psychology','Social Psychology','Learning Theories','Biological Psychology','Abnormality'],
  'Law': ['English Legal System','Criminal Law','Law of Tort — Negligence','Contract Law — Formation','Human Rights Law','Judicial Precedent'],
};

async function generateBatch(subject, level, topic, questionType, count) {
  const diffDesc = questionType === 'mcq'
    ? 'Mix of easy (1-mark recall) and medium (2-mark application) questions.'
    : 'Mix of medium (3-mark explain/describe) and hard (4-6 mark evaluate/discuss) questions.';

  const prompt = questionType === 'mcq'
    ? `Generate ${count} UNIQUE Cambridge ${level} ${subject} MCQs on: "${topic}".
${diffDesc}
Each question must test a DIFFERENT aspect. Vary correct option positions (A/B/C/D).
Return JSON array: [{"question":"...","type":"mcq","options":{"A":"...","B":"...","C":"...","D":"..."},"correctOption":"A/B/C/D","difficulty":"easy or medium","marks":1,"markSchemeHint":"why correct","commandWord":"state/identify/which"}]`
    : `Generate ${count} UNIQUE Cambridge ${level} ${subject} structured questions on: "${topic}".
${diffDesc}
Each question must test a DIFFERENT skill. Use varied command words.
Return JSON array: [{"question":"...","type":"structured","difficulty":"medium or hard","marks":3,"markSchemeHint":"marking points","commandWord":"explain/describe/evaluate"}]`;

  let systemPrompt = SYSTEM;
  const topicKnowledge = getKnowledgeForTopic(topic, subject);
  if (topicKnowledge) systemPrompt += '\n' + topicKnowledge;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 3000,
    system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = response.content.filter(b => b.type === 'text').map(b => b.text).join('').trim().replace(/```json|```/g, '').trim();
  let questions = JSON.parse(raw);
  if (!Array.isArray(questions)) questions = [questions];
  return questions;
}

export default async function handler(req, res) {
  // ── DISABLED: AI question generation disabled — verified sources only ──
  // Question bank now populated exclusively from official Cambridge past papers
  // uploaded via scripts/upload-papers.mjs or /upload-papers page.
  // AI-generated questions are no longer acceptable.
  // To re-enable, remove this early return.
  return res.status(200).json({
    status: 'disabled',
    reason: 'AI question generation disabled — verified sources only. Upload past papers via scripts/upload-papers.mjs',
    bankStats: 'Use /api/question-bank/serve-batch to check bank contents',
  });

  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }

  const startTime = Date.now();
  const log = [];
  let totalSaved = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  try {
    // Check current bank size
    const currentStats = await getBankStats();
    log.push(`Bank size: ${currentStats.total} questions`);

    // ── Phase 1: Find thin topics ────────────────────────────────
    const thinTopics = await findThinTopics({ minQuestions: 10 });

    // ── Phase 2: If bank is empty, do initial seeding ────────────
    if (currentStats.total === 0) {
      log.push('Bank is empty — running initial seed');
      // Seed top 5 subjects with 3 topics each (controlled cost)
      const seedTargets = [];
      for (const [level, subjects] of Object.entries(SEED_SUBJECTS)) {
        for (const subj of subjects.slice(0, 5)) {
          const topics = TOPICS[subj];
          if (topics) {
            for (const t of topics.slice(0, 3)) {
              seedTargets.push({ subject: subj, level, topic: t });
            }
          }
        }
      }

      for (const target of seedTargets.slice(0, 15)) {
        try {
          const mcqs = await generateBatch(target.subject, target.level, target.topic, 'mcq', 5);
          for (const q of mcqs) {
            try {
              const r = await saveQuestion({
                subject: target.subject, level: target.level, topic: target.topic,
                difficulty: q.difficulty || 'medium', type: 'mcq', curriculum: 'cambridge',
                questionText: q.question, options: q.options, correctAnswer: q.correctOption,
                markScheme: q.markSchemeHint, marks: q.marks || 1, commandWord: q.commandWord,
                source: 'ai_generated',
              });
              if (r.saved) totalSaved++; else totalSkipped++;
            } catch { totalErrors++; }
          }
          log.push(`Seeded ${target.subject} / ${target.topic}: ${mcqs.length} MCQs`);
        } catch (err) {
          log.push(`FAILED: ${target.subject} / ${target.topic}: ${err.message}`);
          totalErrors++;
        }
      }
    }

    // ── Phase 3: Fill thin topics (max 20 per run) ───────────────
    else {
      const targets = thinTopics.slice(0, 20);
      log.push(`Found ${thinTopics.length} thin topics, processing ${targets.length}`);

      for (const target of targets) {
        try {
          // Generate 5 MCQ + 3 structured
          const mcqs = await generateBatch(target.subject, 'O Level', target.topic, 'mcq', 5);
          const structured = await generateBatch(target.subject, 'O Level', target.topic, 'structured', 3);

          for (const q of [...mcqs, ...structured]) {
            try {
              const r = await saveQuestion({
                subject: target.subject, level: 'O Level', topic: target.topic,
                difficulty: q.difficulty || 'medium', type: q.type || 'mcq', curriculum: 'cambridge',
                questionText: q.question, options: q.options || null,
                correctAnswer: q.type === 'mcq' ? q.correctOption : (q.markSchemeHint || ''),
                markScheme: q.markSchemeHint, marks: q.marks || 1, commandWord: q.commandWord,
                source: 'ai_generated',
              });
              if (r.saved) totalSaved++; else totalSkipped++;
            } catch { totalErrors++; }
          }
          log.push(`Filled ${target.subject} / ${target.topic}: +${mcqs.length + structured.length}`);
        } catch (err) {
          log.push(`FAILED: ${target.subject} / ${target.topic}: ${err.message}`);
          totalErrors++;
        }
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[QB GROW] Done in ${elapsed}s — saved:${totalSaved} skipped:${totalSkipped} errors:${totalErrors}`);

    return res.status(200).json({
      ok: true,
      saved: totalSaved,
      skipped: totalSkipped,
      errors: totalErrors,
      elapsed: `${elapsed}s`,
      log,
    });

  } catch (err) {
    console.error('[QB GROW ERROR]', err);
    return res.status(500).json({ error: err.message, log });
  }
}
