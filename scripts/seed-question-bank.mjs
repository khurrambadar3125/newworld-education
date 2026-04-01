#!/usr/bin/env node
/**
 * scripts/seed-question-bank.mjs
 * ─────────────────────────────────────────────────────────────────
 * Bulk question bank seeder — Cambridge A* quality standard.
 *
 * Injects REAL Cambridge examiner intelligence into every question:
 * - Mark scheme accepted/rejected phrases
 * - Examiner report common mistakes
 * - Global knowledge base misconceptions
 * - Command word precision requirements
 *
 * Usage: node scripts/seed-question-bank.mjs
 *
 * Resumable — tracks progress in .seed-progress.json
 * Cost: ~$50-60 for 200K questions (Haiku)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── Load env vars ────────────────────────────────────────────────
function loadEnv() {
  const envFile = resolve(ROOT, '.env.seed');
  if (!existsSync(envFile)) {
    console.error('Missing .env.seed — run: npx vercel env pull .env.seed');
    process.exit(1);
  }
  const lines = readFileSync(envFile, 'utf8').split('\n');
  for (const line of lines) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}
loadEnv();

// ── Dependencies ─────────────────────────────────────────────────
const Anthropic = (await import('@anthropic-ai/sdk')).default;
const { createClient } = await import('@supabase/supabase-js');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 45000 });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

// ── Load Cambridge intelligence from codebase ────────────────────
function loadCambridgeIntelligence() {
  const intel = { markSchemes: {}, examinerReports: {}, globalKB: {}, commandWords: [] };

  // Load mark scheme KB
  try {
    const msRaw = readFileSync(resolve(ROOT, 'utils/markSchemeKB.js'), 'utf8');
    const msMatch = msRaw.match(/const MARK_SCHEME_KB = \[([\s\S]*?)\];\s*(?:module|export|function|const|\/\/)/);
    if (msMatch) {
      // Parse entries by subject+topic
      const entries = msRaw.match(/\{[^{}]*subject:[^{}]*acceptedPhrases:[^{}]*\}/gs) || [];
      for (const entry of entries) {
        const subj = entry.match(/subject:\s*["']([^"']+)/)?.[1] || '';
        const topic = entry.match(/topic:\s*["']([^"']+)/)?.[1] || '';
        const accepted = (entry.match(/acceptedPhrases:\s*\[([\s\S]*?)\]/)?.[1] || '').match(/["']([^"']+)["']/g)?.map(s => s.replace(/["']/g, '')) || [];
        const rejected = (entry.match(/rejectedPhrases:\s*\[([\s\S]*?)\]/)?.[1] || '').match(/["']([^"']+)["']/g)?.map(s => s.replace(/["']/g, '')) || [];
        const note = entry.match(/examinerNote:\s*["']([^"']+)/)?.[1] || '';
        const quote = entry.match(/markSchemeQuote:\s*["']([^"']+)/)?.[1] || '';
        const key = `${subj}|${topic}`.toLowerCase();
        if (!intel.markSchemes[key]) intel.markSchemes[key] = [];
        intel.markSchemes[key].push({ accepted, rejected, note, quote });
      }
    }
  } catch (e) { console.log('Mark scheme KB load skipped:', e.message); }

  // Load examiner reports
  try {
    const erRaw = readFileSync(resolve(ROOT, 'utils/examinerReportsKB.js'), 'utf8');
    const subjects = erRaw.match(/(\w+):\s*\[/g)?.map(s => s.replace(/:\s*\[$/, '')) || [];
    for (const subj of subjects) {
      const regex = new RegExp(`${subj}:\\s*\\[([\\s\\S]*?)\\]`, 'm');
      const block = erRaw.match(regex)?.[1] || '';
      const entries = block.match(/\{[^{}]*topic:[^{}]*mistake:[^{}]*\}/gs) || [];
      for (const entry of entries) {
        const topic = entry.match(/topic:\s*['"]([^'"]+)/)?.[1] || '';
        const mistake = entry.match(/mistake:\s*['"]([^'"]+)/)?.[1] || '';
        const comment = entry.match(/examinerComment:\s*['"]([^'"]+)/)?.[1] || '';
        const key = `${subj}|${topic}`.toLowerCase();
        if (!intel.examinerReports[key]) intel.examinerReports[key] = [];
        intel.examinerReports[key].push({ mistake, comment });
      }
    }
  } catch (e) { console.log('Examiner reports load skipped:', e.message); }

  // Load global KB
  try {
    const gkRaw = readFileSync(resolve(ROOT, 'utils/globalKnowledgeBase.js'), 'utf8');
    const subjBlocks = gkRaw.match(/(\w[\w\s&]+):\s*\{[^]*?(?=\n  \w[\w\s&]+:\s*\{|\n\};)/g) || [];
    // Simplified: extract misconceptions and examiner tips per subject/topic
    for (const block of subjBlocks) {
      const subjMatch = block.match(/^(\w[\w\s&]+):/);
      if (!subjMatch) continue;
      const subj = subjMatch[1].trim();
      const topicBlocks = block.match(/'([^']+)':\s*\{([\s\S]*?)\}/g) || [];
      for (const tb of topicBlocks) {
        const topicMatch = tb.match(/'([^']+)'/);
        if (!topicMatch) continue;
        const topic = topicMatch[1];
        const misconceptions = (tb.match(/misconceptions:\s*\[([\s\S]*?)\]/)?.[1] || '').match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || [];
        const tips = (tb.match(/examinerTips:\s*\[([\s\S]*?)\]/)?.[1] || '').match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || [];
        const keywords = (tb.match(/keywords:\s*\[([\s\S]*?)\]/)?.[1] || '').match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || [];
        const key = `${subj}|${topic}`.toLowerCase();
        intel.globalKB[key] = { misconceptions, tips, keywords };
      }
    }
  } catch (e) { console.log('Global KB load skipped:', e.message); }

  return intel;
}

const INTEL = loadCambridgeIntelligence();
console.log(`Loaded intelligence: ${Object.keys(INTEL.markSchemes).length} mark scheme topics, ${Object.keys(INTEL.examinerReports).length} examiner report topics, ${Object.keys(INTEL.globalKB).length} global KB topics\n`);

// ── Progress tracking ────────────────────────────────────────────
const PROGRESS_FILE = resolve(ROOT, '.seed-progress.json');

function loadProgress() {
  if (existsSync(PROGRESS_FILE)) {
    return JSON.parse(readFileSync(PROGRESS_FILE, 'utf8'));
  }
  return { completed: {}, totalSaved: 0, totalSkipped: 0, totalErrors: 0, startedAt: new Date().toISOString() };
}

function saveProgress(progress) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// ── Build Cambridge intelligence injection for a topic ───────────
function getTopicIntelligence(subject, topic) {
  const lines = [];
  const subjLower = subject.toLowerCase();

  // Search mark schemes (fuzzy match on topic)
  for (const [key, entries] of Object.entries(INTEL.markSchemes)) {
    const [s, t] = key.split('|');
    if (s === subjLower && (topic.toLowerCase().includes(t) || t.includes(topic.toLowerCase().split(/[\s—(]/)[0]))) {
      for (const e of entries.slice(0, 2)) {
        if (e.accepted.length) lines.push(`MARK SCHEME REQUIREMENT: Examiners accept ONLY: "${e.accepted[0]}". They REJECT: "${e.rejected.slice(0, 2).join('", "')}". ${e.note}`);
        if (e.quote) lines.push(`EXACT MARK SCHEME: ${e.quote}`);
      }
    }
  }

  // Search examiner reports (fuzzy match)
  for (const [key, entries] of Object.entries(INTEL.examinerReports)) {
    const [s, t] = key.split('|');
    if (s === subjLower && (topic.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(topic.toLowerCase().split(/[\s—(]/)[0].toLowerCase()))) {
      for (const e of entries.slice(0, 3)) {
        lines.push(`EXAMINER REPORT: Common mistake — "${e.mistake}". Examiner says: "${e.comment}"`);
      }
    }
  }

  // Search global KB (fuzzy match)
  for (const [key, data] of Object.entries(INTEL.globalKB)) {
    const [s, t] = key.split('|');
    if (s.toLowerCase() === subjLower && (topic.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(topic.toLowerCase().split(/[\s—(]/)[0].toLowerCase()))) {
      if (data.misconceptions.length) lines.push(`STUDENT MISCONCEPTIONS: ${data.misconceptions.slice(0, 2).join('. ')}`);
      if (data.tips.length) lines.push(`EXAMINER TIPS: ${data.tips.slice(0, 2).join('. ')}`);
      if (data.keywords.length) lines.push(`KEYWORDS FOR FULL MARKS: ${data.keywords.join(', ')}`);
    }
  }

  return lines.length > 0 ? '\n\nCAMBRIDGE EXAMINER INTELLIGENCE FOR THIS TOPIC:\n' + lines.join('\n') : '';
}

// ── Subject/Topic database ───────────────────────────────────────
const SUBJECTS = {
  'O Level': {
    'Biology': ['Cell Structure & Organisation','Diffusion, Osmosis & Active Transport','Biological Molecules','Enzymes','Plant Nutrition (Photosynthesis)','Animal Nutrition & Digestion','Gas Exchange','Transport in Plants','Transport in Humans (Circulatory System)','Respiration','Excretion & Homeostasis','Coordination & Response (Nervous System)','Hormones & Endocrine System','Reproduction','Inheritance & Genetics','Variation & Natural Selection','Ecology & Environment','Human Influences on the Environment'],
    'Chemistry': ['Atomic Structure & The Periodic Table','Chemical Bonding','Stoichiometry & Moles','Acids, Bases & Salts','The Mole & Calculations','Electrolysis','Energy Changes in Chemical Reactions','Rates of Reaction','Equilibrium','Redox Reactions','Organic Chemistry — Alkanes & Alkenes','Organic Chemistry — Alcohols & Acids','Polymers','Extraction of Metals','Water Chemistry'],
    'Physics': ['Measurements & Units','Motion (Kinematics)','Forces & Newton\'s Laws','Momentum & Impulse','Work, Energy & Power','Pressure','Thermal Physics (Heat Transfer)','Thermal Properties of Matter','Waves — Properties & Behaviour','Light & Optics','Sound','Current Electricity & Circuits','Magnetic Effects of Current','Electromagnetic Induction','Atomic Structure & Radioactivity'],
    'Mathematics': ['Number (Fractions, Decimals, Percentages)','Algebra — Expressions & Equations','Sequences & Series','Functions','Coordinate Geometry (Straight Lines)','Quadratic Equations & Graphs','Simultaneous Equations','Indices & Surds','Trigonometry (SOH CAH TOA)','Trigonometry (Sine & Cosine Rules)','Circle Theorems','Mensuration (Area & Volume)','Vectors','Matrices','Probability','Statistics (Mean, Median, Mode)','Differentiation','Integration'],
    'Economics': ['Basic Economic Problem','Supply & Demand','Price Elasticity','Market Structures','Production & Costs','National Income & GDP','Economic Growth','Unemployment','Inflation','Monetary Policy','Fiscal Policy','International Trade','Balance of Payments','Exchange Rates','Market Failure & Externalities'],
    'English Language': ['Reading Comprehension','Inference & Deduction','Summary Writing','Directed Writing','Descriptive Writing','Narrative Writing','Argumentative & Persuasive Writing','Report & Letter Writing','Language Analysis (Writer\'s Techniques)','Vocabulary in Context'],
    'Computer Science': ['Data Representation (Binary, Hex)','Number Conversions','Logic Gates & Boolean Algebra','Algorithms & Pseudocode','Flowcharts','Programming Concepts','Data Structures (Arrays, Lists)','Searching & Sorting Algorithms','Databases','Computer Networks','Internet & Web Technologies','Security & Encryption','Operating Systems','Hardware Components','Software Development Lifecycle'],
    'Pakistan Studies': ['Land & People of Pakistan','Physical Geography of Pakistan','Climate of Pakistan','Agriculture in Pakistan','Industry & Trade','Population & Urbanisation','Movement for Pakistan','Creation of Pakistan (1947)','Constitutional Development','Political History (1947–present)','Economic Development','Social Issues & Development'],
    'Accounting': ['Double Entry Bookkeeping','Trial Balance','Income Statement (Trading & Profit/Loss)','Balance Sheet','Bank Reconciliation','Depreciation','Provisions for Bad Debts','Corrections of Errors','Suspense Accounts','Control Accounts','Cash Flow Statements','Incomplete Records','Partnership Accounts','Ratio Analysis'],
    'Business Studies': ['Business Objectives & Stakeholders','Forms of Business Organisation','Marketing Mix','Market Research','Production Methods','Quality Management','Finance — Sources & Cash Flow','Profit & Loss, Break-Even','Human Resource Management','Motivation Theory','External Environment','Globalisation & Multinationals'],
    'Geography': ['River Processes & Landforms','Earthquakes & Volcanoes','Weather & Climate','Rocks & Weathering','Population','Settlement','Migration','Urbanisation','Industry','Tourism','Agriculture & Food','Environmental Management','Map Skills'],
    'History': ['Source Analysis Skills','WWI Causes & Consequences','Treaty of Versailles','League of Nations','Rise of Dictators','WWII Causes & Consequences','Cold War','Arab-Israeli Conflict','Indian Independence','Decolonisation','Civil Rights','International Relations 1919–1945','International Relations 1945–2000'],
    'Sociology': ['Research Methods','Family','Education','Crime & Deviance','Social Inequality','Media','Social Stratification','Poverty','Globalisation','Theory — Functionalism','Theory — Marxism','Theory — Feminism','Theory — Interactionism'],
    'Additional Mathematics': ['Quadratics & Polynomials','Indices & Surds','Logarithms & Exponentials','Trigonometry (Identities & Equations)','Coordinate Geometry (Circles & Lines)','Differentiation (Chain, Product, Quotient)','Integration (Definite & Indefinite)','Kinematics','Binomial Theorem','Permutations & Combinations','Matrices','Vectors in 2D'],
    'Statistics': ['Data Collection & Sampling','Averages & Measures of Spread','Cumulative Frequency & Box Plots','Histograms & Frequency Density','Probability (Combined Events)','Tree Diagrams & Venn Diagrams','Binomial Distribution','Normal Distribution','Correlation & Regression','Time Series','Index Numbers'],
    'Islamiyat': ['Life of the Prophet — Makkan Period','Life of the Prophet — Madinan Period','Quran — Selected Passages','Hadith — Selected Hadith','The Rightly-Guided Caliphs','Pillars of Islam','Articles of Faith','Islamic Practices (Worship)','Islamic Ethics & Morality','Islamic History — Spread of Islam'],
    'Urdu': ['Reading Comprehension','Poetry Comprehension','Essay Writing','Letter Writing','Summary Writing','Grammar','Translation','Vocabulary & Idioms','Story Writing','Dialogue Writing'],
    'Commerce': ['Home Trade & Retail','Wholesale & Distribution','International Trade','Transport & Communication','Insurance','Banking & Finance','Advertising','Business Documents','E-Commerce','Government & Trade'],
    'Literature in English': ['Drama — Set Text Analysis','Prose — Set Text Analysis','Poetry Anthology','Unseen Poetry','Character Analysis','Theme Analysis','Writer\'s Techniques','Context (Social & Historical)','Comparative Analysis','Quotation Analysis'],
    'Psychology': ['Research Methods & Ethics','Cognitive Psychology','Social Psychology','Learning Theories','Biological Psychology','Abnormality','Health Psychology'],
    'Law': ['English Legal System','Criminal Law — Offences Against Person','Criminal Law — Offences Against Property','Law of Tort — Negligence','Contract Law — Formation','Contract Law — Terms & Vitiating Factors','Human Rights Law','Judicial Precedent','Statutory Interpretation'],
  },
  'A Level': {
    'Biology': ['Cell Structure (Advanced)','Biological Molecules (Proteins, Lipids, Carbs, Nucleic Acids)','Enzymes (Kinetics & Inhibition)','Cell Division (Mitosis & Meiosis)','Transport Across Membranes','Gas Exchange (Detailed)','Circulatory System (Advanced)','Immunity & Disease','Ecology & Energy Flow','Photosynthesis (Light & Dark Reactions)','Respiration (Glycolysis, Krebs, ETC)','Homeostasis','Nervous System & Synapses','Hormonal Coordination','Genetics & Inheritance (Advanced)','Gene Technology & Genetic Engineering','Natural Selection & Evolution','Biodiversity & Classification'],
    'Chemistry': ['Atomic Structure & Ionisation Energy','Chemical Bonding (Advanced)','States of Matter & Intermolecular Forces','Chemical Energetics (Hess\'s Law, Born-Haber)','Electrochemistry','Equilibria (Kc, Kp, Ksp)','Reaction Kinetics (Rate Equations)','Group 2 & Group 17 Chemistry','Nitrogen & Sulfur Chemistry','Transition Metal Chemistry','Organic Chemistry — Halogenoalkanes','Organic Chemistry — Carbonyl Compounds','Organic Chemistry — Carboxylic Acids & Esters','Organic Chemistry — Nitrogen Compounds','Polymerisation','Analytical Chemistry (Mass Spec, IR, NMR)','Chemical Energetics (Entropy & Free Energy)'],
    'Physics': ['Circular Motion','Gravitational Fields','Electric Fields','Capacitance','Magnetic Fields','Electromagnetic Induction (Advanced)','Alternating Currents','Quantum Physics','Nuclear Physics (Advanced)','Thermal Physics (Advanced)','Ideal Gases','Oscillations (SHM)','Waves (Superposition & Interference)','Communication Systems','Medical Imaging','Particle Physics'],
    'Mathematics': ['Pure Maths — Proof','Pure Maths — Algebra & Functions','Pure Maths — Coordinate Geometry (Advanced)','Pure Maths — Sequences & Series (Advanced)','Pure Maths — Trigonometry (Advanced)','Pure Maths — Exponentials & Logarithms','Pure Maths — Differentiation (Advanced)','Pure Maths — Integration (Advanced)','Pure Maths — Numerical Methods','Pure Maths — Vectors (3D)','Statistics — Statistical Sampling','Statistics — Data Presentation','Statistics — Probability (Advanced)','Statistics — Statistical Distributions','Statistics — Hypothesis Testing','Mechanics — Forces & Motion','Mechanics — Moments','Mechanics — Projectiles'],
    'Further Mathematics': ['Complex Numbers','Matrices (Eigenvalues & Eigenvectors)','Proof by Induction','Series & Summation','Polar Coordinates','Hyperbolic Functions','Differential Equations','Further Calculus (Reduction Formulae)','Further Vectors','Further Probability','Further Mechanics','Numerical Methods (Advanced)'],
    'Economics': ['Basic Economic Problem (Advanced)','Supply & Demand (Advanced)','Elasticity (PED, YED, XED)','Market Failure & Government Intervention','Theory of the Firm','Labour Market','National Income Accounting','Macroeconomic Objectives','Monetary Policy (Advanced)','Fiscal Policy (Advanced)','Supply-Side Policies','International Trade & Protectionism','Balance of Payments & Exchange Rates','Economic Development','Inequality & Poverty'],
    'Computer Science': ['Data Representation (Advanced)','Communication & Networking','Hardware & Software','Processor Architecture','Databases & SQL','Algorithm Design','Programming Paradigms (OOP, Functional)','Data Structures (Trees, Graphs, Hash Tables)','Computational Thinking','Software Engineering','Artificial Intelligence','Boolean Algebra & Logic Circuits'],
    'English Language': ['Language Change','Language & Gender','Language & Power','Language & Technology','Child Language Acquisition','World Englishes','Discourse Analysis','Phonology, Morphology & Syntax','Semantics & Pragmatics','Language Investigation'],
    'Psychology': ['Social Psychology','Cognitive Psychology','Biological Psychology','Learning Approaches','Psychopathology','Research Methods (Advanced)','Issues & Debates','Biopsychology','Relationships','Schizophrenia','Aggression','Forensic Psychology'],
    'Business Studies': ['Business Objectives & Strategy','Marketing Strategy','Operational Management','Financial Analysis','Human Resource Strategy','Strategic Management','Business Ethics & CSR','Globalisation & International Business','Digital Technology in Business','Change Management'],
    'Accounting': ['Financial Statements (Advanced)','Ratio Analysis (Advanced)','Budgeting','Standard Costing & Variance Analysis','Marginal & Absorption Costing','Capital Investment Appraisal','Cash Flow Management','Partnership & Company Accounts (Advanced)','Consolidated Financial Statements','Regulatory Framework & Accounting Standards'],
    'Sociology': ['Socialisation, Culture & Identity','Research Methods (Advanced)','Families & Households','Education (Advanced)','Crime & Deviance (Advanced)','Beliefs in Society','Global Development','Media (Advanced)','Health','Social Inequality & Stratification (Advanced)','Theory & Methods','Power & Politics'],
    'Geography': ['Hydrology & Fluvial Geomorphology','Coastal Environments','Hazardous Environments','Hot Arid & Semi-Arid Environments','Population Dynamics','Migration (Advanced)','Urban Environments','Rural Environments','Energy Security','Environmental Management','Global Governance','Tropical Environments'],
    'History': ['The Cold War (Advanced)','The Russian Revolution','Nazi Germany','The Causes of WWI (Advanced)','The Causes of WWII (Advanced)','Decolonisation & Independence Movements','The Arab-Israeli Conflict (Advanced)','Civil Rights in the USA','Mao\'s China','The British Empire','International Relations 1945–2000 (Advanced)'],
    'Law': ['English Legal System (Advanced)','Criminal Law (Advanced)','Tort Law (Advanced)','Contract Law (Advanced)','EU Law','Human Rights Law (Advanced)','Land Law','Equity & Trusts','Law of Evidence','Jurisprudence'],
  },
};

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const TYPES = ['mcq', 'structured'];

// ── The A* quality system prompt ─────────────────────────────────
const SYSTEM = `You are a SENIOR Cambridge Principal Examiner who has set and marked thousands of real Cambridge IGCSE and A Level papers.

YOUR QUALITY STANDARD:
- Every question you write could appear on a REAL Cambridge past paper
- MCQ distractors must be REAL student misconceptions (from examiner reports), not obviously wrong
- Structured questions must use EXACT Cambridge command words with correct mark allocation
- Mark schemes must use the PRECISE language Cambridge examiners accept — no vague answers
- Questions must test genuine understanding, not just recall

COMMAND WORD PRECISION:
- "State" = 1 mark, one fact, NO explanation
- "Define" = 1-2 marks, precise technical definition with qualifying words
- "Describe" = 2-3 marks, factual account of what happens (no "why")
- "Explain" = 2-4 marks, must include BECAUSE/DUE TO/SINCE — reason is required
- "Suggest" = 2-3 marks, apply knowledge to unfamiliar context
- "Compare" = must have BOTH similarities AND differences with explicit linking words
- "Evaluate/Discuss/To what extent" = 4-8 marks, arguments FOR and AGAINST with conclusion
- "Calculate" = show formula, substitution, answer with correct unit

MCQ QUALITY RULES:
- Correct answer must be unambiguously correct
- Distractors must be plausible misconceptions that real students would choose
- All options must be similar length and grammatically parallel
- Never make the correct answer obviously different from distractors

STRUCTURED QUESTION QUALITY RULES:
- Mark scheme must list SPECIFIC mark points, not vague descriptions
- Use Cambridge mark scheme format: "point (1)" for each mark
- Include marks that students commonly miss (from examiner reports)
- Model answer must score FULL marks — no missing points

CRITICAL: Return ONLY a valid JSON array. No markdown, no backticks, no preamble.`;

// ── Generate a batch with full Cambridge intelligence ────────────
async function generateBatch(subject, level, topic, difficulty, type, count) {
  const topicIntel = getTopicIntelligence(subject, topic);

  const diffDesc = {
    easy: `EASY (1-2 marks): Tests recall and basic understanding. A well-prepared student should get this right. Tests: definitions, names, labels, simple identification.`,
    medium: `MEDIUM (2-4 marks): Tests application and understanding. Requires the student to USE knowledge, not just recall it. Tests: explain why, describe how, apply to context.`,
    hard: `HARD (4-8 marks): Tests analysis, evaluation, and synthesis. Requires structured argument, multiple perspectives, or multi-step reasoning. Tests: evaluate, discuss, compare, to what extent.`,
  }[difficulty];

  const prompt = type === 'mcq'
    ? `Generate ${count} Cambridge ${level} ${subject} MULTIPLE CHOICE questions on: "${topic}".

DIFFICULTY: ${diffDesc}

RULES FOR A* QUALITY MCQs:
- Each question tests a DIFFERENT concept within this topic
- The correct answer is precise and unambiguous
- Distractors are REAL mistakes students make (not silly options)
- Options are grammatically parallel and similar length
- Vary correct answer position across A/B/C/D
- For "easy": test definitions, key terms, basic facts
- For "medium": test application — give a scenario and ask what happens
- For "hard": test common misconceptions — the wrong answers should LOOK right to unprepared students
${topicIntel}

Return a JSON array of ${count} objects:
[{"question":"full question (include any data/diagrams described in text)","type":"mcq","options":{"A":"...","B":"...","C":"...","D":"..."},"correctOption":"letter","difficulty":"${difficulty}","marks":1,"markSchemeHint":"EXACT Cambridge-accepted answer with explanation of WHY other options are wrong","commandWord":"state/identify/which"}]`

    : `Generate ${count} Cambridge ${level} ${subject} STRUCTURED questions on: "${topic}".

DIFFICULTY: ${diffDesc}

RULES FOR A* QUALITY STRUCTURED QUESTIONS:
- Each question uses a DIFFERENT command word appropriate to difficulty
- Easy: state, define, name, give, identify (1-2 marks)
- Medium: describe, explain, outline, suggest (2-4 marks)
- Hard: evaluate, discuss, compare, to what extent, analyse (4-8 marks)
- Mark scheme uses EXACT Cambridge-accepted phrases (not vague descriptions)
- Mark scheme format: "point 1 (1) + point 2 (1) + point 3 (1)" showing how each mark is earned
- For "explain" questions: the mark scheme MUST include a reason (because/due to)
- Model answer must demonstrate the PRECISE language examiners require
${topicIntel}

Return a JSON array of ${count} objects:
[{"question":"full question text with any context/data","type":"structured","difficulty":"${difficulty}","marks":${difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 6},"markSchemeHint":"point 1 (1) + point 2 (1) — using EXACT Cambridge mark scheme language","commandWord":"the specific command word used"}]`;

  let response;
  for (let attempt = 0; attempt <= 2; attempt++) {
    try {
      response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4000,
        system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: prompt }],
      });
      break;
    } catch (err) {
      if (attempt === 2) throw err;
      if (err?.status === 429) {
        await sleep(5000 * (attempt + 1)); // Back off on rate limit
      } else if (err?.status >= 500) {
        await sleep(2000);
      } else {
        throw err;
      }
    }
  }

  const raw = response.content.filter(b => b.type === 'text').map(b => b.text).join('').trim().replace(/```json|```/g, '').trim();
  let questions = JSON.parse(raw);
  if (!Array.isArray(questions)) questions = [questions];
  return questions;
}

// ── Save questions to Supabase ───────────────────────────────────
async function saveBatch(questions, subject, level, topic, difficulty, type) {
  const rows = questions.map(q => ({
    subject,
    level,
    topic,
    difficulty: q.difficulty || difficulty,
    type: q.type || type,
    curriculum: 'cambridge',
    question_text: q.question,
    options: q.options || null,
    correct_answer: q.type === 'mcq' ? q.correctOption : (q.markSchemeHint || ''),
    mark_scheme: q.markSchemeHint || null,
    marks: q.marks || 1,
    command_word: q.commandWord || null,
    source: 'ai_generated',
  }));

  const { data, error } = await supabase.from('question_bank').insert(rows).select('id');
  if (error) throw new Error(error.message);
  return data?.length || 0;
}

// ── Count existing questions ─────────────────────────────────────
async function countExisting(subject, level, topic, difficulty, type) {
  const { count, error } = await supabase.from('question_bank')
    .select('id', { count: 'exact', head: true })
    .eq('subject', subject).eq('level', level).eq('topic', topic)
    .eq('difficulty', difficulty).eq('type', type);
  if (error) return 0;
  return count || 0;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ── Main ─────────────────────────────────────────────────────────
async function main() {
  const progress = loadProgress();
  const TARGET_PER_COMBO = 15;
  const BATCH_SIZE = 10;
  const CONCURRENCY = 3;

  // Build work list
  const workList = [];
  for (const [level, subjects] of Object.entries(SUBJECTS)) {
    for (const [subject, topics] of Object.entries(subjects)) {
      for (const topic of topics) {
        for (const difficulty of DIFFICULTIES) {
          for (const type of TYPES) {
            const key = `${level}|${subject}|${topic}|${difficulty}|${type}`;
            if (!progress.completed[key]) {
              workList.push({ level, subject, topic, difficulty, type, key });
            }
          }
        }
      }
    }
  }

  const totalCombos = Object.entries(SUBJECTS).reduce((sum, [, subjects]) =>
    sum + Object.entries(subjects).reduce((s2, [, topics]) =>
      s2 + topics.length * DIFFICULTIES.length * TYPES.length, 0), 0);
  const completedCombos = Object.keys(progress.completed).length;

  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║   NewWorldEdu Question Bank — A* Quality Cambridge Seeder   ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log(`║  Total combos:     ${totalCombos.toString().padStart(6)}                                ║`);
  console.log(`║  Already done:     ${completedCombos.toString().padStart(6)}                                ║`);
  console.log(`║  Remaining:        ${workList.length.toString().padStart(6)}                                ║`);
  console.log(`║  Target/combo:     ${TARGET_PER_COMBO.toString().padStart(6)}                                ║`);
  console.log(`║  Questions saved:  ${progress.totalSaved.toString().padStart(6)}                                ║`);
  console.log(`║  Intelligence:     mark schemes + examiner reports + KB      ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  if (workList.length === 0) {
    console.log('All combos completed! Increase TARGET_PER_COMBO for more.');
    return;
  }

  const startTime = Date.now();
  let batchNum = 0;

  for (let i = 0; i < workList.length; i += CONCURRENCY) {
    const chunk = workList.slice(i, i + CONCURRENCY);

    const results = await Promise.allSettled(chunk.map(async (work) => {
      const { level, subject, topic, difficulty, type, key } = work;
      const existing = await countExisting(subject, level, topic, difficulty, type);
      const needed = TARGET_PER_COMBO - existing;

      if (needed <= 0) {
        progress.completed[key] = true;
        return { key, saved: 0, status: 'full' };
      }

      const toGenerate = Math.min(needed, BATCH_SIZE);
      const questions = await generateBatch(subject, level, topic, difficulty, type, toGenerate);
      const saved = await saveBatch(questions, subject, level, topic, difficulty, type);
      progress.totalSaved += saved;
      if (existing + saved >= TARGET_PER_COMBO) progress.completed[key] = true;
      return { key, saved, status: 'ok' };
    }));

    batchNum++;
    const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    const done = Object.keys(progress.completed).length;
    const pct = ((done / totalCombos) * 100).toFixed(1);

    for (const r of results) {
      if (r.status === 'fulfilled') {
        const { key, saved, status } = r.value;
        const parts = key.split('|');
        const label = `${parts[1]} / ${parts[2]}`;
        if (status === 'ok') console.log(`  ✓ ${label} [${parts[3]} ${parts[4]}] → +${saved}`);
      } else {
        console.log(`  ✗ Error: ${r.reason?.message?.slice(0, 80)}`);
        progress.totalErrors++;
      }
    }

    saveProgress(progress);

    if (batchNum % 10 === 0) {
      console.log(`\n── ${pct}% | ${progress.totalSaved} saved | ${progress.totalErrors} errors | ${elapsed} min ──\n`);
    }

    await sleep(600);
  }

  const totalElapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n═══ COMPLETE: ${progress.totalSaved} questions | ${progress.totalErrors} errors | ${totalElapsed} min ═══`);
  saveProgress(progress);
}

main().catch(err => { console.error('\nFATAL:', err); process.exit(1); });
