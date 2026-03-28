/**
 * /api/cron/cambridge-4k
 * Generates AND answers 4,000 Cambridge questions using Haiku 3.
 * Questions are generated on-the-fly per subject/topic/type, then answered.
 * Auto-chains batches. One trigger runs everything.
 *
 * Cost estimate: ~$6 for 4,000 questions at Haiku 3 pricing.
 * Runtime: ~40 minutes with auto-chaining.
 */

import Anthropic from '@anthropic-ai/sdk';
import { getSupabase } from '../../../utils/supabase';

export const config = { api: { bodyParser: true }, maxDuration: 300 };

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 30000 });

// ── 4,000 question specifications: subject × topic × type × marks ──────

const QUESTION_SPECS = [];

// Helper to add questions for a subject — each topic × each type = one question
function addQuestions(subject, level, code, topics, types) {
  topics.forEach(topic => {
    types.forEach(t => {
      QUESTION_SPECS.push({ subject, level, code, topic, type: t.type, marks: t.marks, commandWord: t.cmd });
    });
  });
}

// Standard question type sets — gives 5 types per topic = more coverage
const SCIENCE_TYPES = [
  { type: 'structured', marks: 3, cmd: 'explain' },
  { type: 'structured', marks: 4, cmd: 'describe' },
  { type: 'extended', marks: 6, cmd: 'discuss' },
  { type: 'calculation', marks: 3, cmd: 'calculate' },
  { type: 'define', marks: 2, cmd: 'define' },
];
const SCIENCE_A2_TYPES = [
  { type: 'structured', marks: 4, cmd: 'explain' },
  { type: 'extended', marks: 8, cmd: 'discuss' },
  { type: 'data', marks: 5, cmd: 'analyse' },
  { type: 'mechanism', marks: 4, cmd: 'describe' },
  { type: 'essay', marks: 10, cmd: 'evaluate' },
];
const HUMANITIES_TYPES = [
  { type: 'structured', marks: 4, cmd: 'explain' },
  { type: 'essay', marks: 8, cmd: 'evaluate' },
  { type: 'data', marks: 4, cmd: 'analyse' },
  { type: 'define', marks: 2, cmd: 'define' },
  { type: 'structured', marks: 3, cmd: 'describe' },
];
const MATHS_TYPES = [
  { type: 'calculation', marks: 3, cmd: 'calculate' },
  { type: 'calculation', marks: 4, cmd: 'solve' },
  { type: 'proof', marks: 3, cmd: 'show that' },
  { type: 'application', marks: 5, cmd: 'find' },
  { type: 'interpret', marks: 3, cmd: 'state' },
];

// ═══ BIOLOGY — 150 questions (15 O topics × 5 types + 15 A topics × 5 types) ═══
addQuestions('Biology', 'O Level', '5090',
  ['Cell structure', 'Enzymes', 'Nutrition in humans', 'Nutrition in plants', 'Transport in plants', 'Transport in animals', 'Respiration aerobic', 'Respiration anaerobic', 'Excretion and kidneys', 'Nervous coordination', 'Hormonal coordination', 'Reproduction in plants', 'Reproduction in humans', 'Inheritance and genetics', 'Ecology and ecosystems', 'Osmosis and diffusion', 'Photosynthesis', 'Disease and immunity', 'DNA structure', 'Food tests'],
  SCIENCE_TYPES
);
addQuestions('Biology', 'A Level', '9700',
  ['Biological molecules', 'Cell membranes and transport', 'Mitosis', 'Meiosis', 'Gene expression', 'Natural selection', 'Biodiversity', 'Gas exchange in mammals', 'Gas exchange in fish', 'Infectious diseases', 'Antibodies and immunity', 'Energy and ATP', 'Respiration Krebs cycle', 'Photosynthesis light reactions', 'Photosynthesis Calvin cycle', 'Homeostasis', 'Nervous system', 'Hormonal control', 'Genetic technology', 'Ecology succession'],
  SCIENCE_A2_TYPES
);

// ═══ CHEMISTRY — 200 questions ═══
addQuestions('Chemistry', 'O Level', '5070',
  ['Atomic structure', 'Ionic bonding', 'Covalent bonding', 'Metallic bonding', 'Stoichiometry and mole', 'Electrolysis', 'Chemical energetics', 'Rates of reaction', 'Reversible reactions', 'Acids and bases', 'Salts preparation', 'Periodic table trends', 'Group I metals', 'Group VII halogens', 'Transition metals', 'Organic alkanes', 'Organic alkenes', 'Organic alcohols', 'Polymers', 'Experimental chemistry'],
  SCIENCE_TYPES
);
addQuestions('Chemistry', 'A Level', '9701',
  ['Atomic orbitals', 'Ionisation energy', 'Lattice energy', 'Born Haber cycle', 'Kinetics rate equations', 'Equilibrium Kc Kp', 'Organic mechanisms SN1 SN2', 'Elimination reactions', 'Carbonyl compounds', 'Carboxylic acids derivatives', 'Amines and amino acids', 'Polymers condensation', 'Chromatography and spectroscopy', 'Mass spectrometry', 'Infrared spectroscopy', 'Transition metal chemistry', 'Electrode potentials', 'Enthalpy Hess law', 'Entropy and free energy', 'Buffer calculations'],
  SCIENCE_A2_TYPES
);

// ═══ PHYSICS — 200 questions ═══
addQuestions('Physics', 'O Level', '5054',
  ['Measurement and units', 'Speed velocity acceleration', 'Free fall', 'Newtons laws', 'Momentum', 'Turning effects moments', 'Centre of gravity', 'Pressure in fluids', 'Energy conservation', 'Work and power', 'Kinetic energy', 'Thermal expansion', 'Heat transfer', 'Specific heat capacity', 'Transverse longitudinal waves', 'Sound waves', 'Light reflection', 'Light refraction', 'Total internal reflection', 'Electromagnetic spectrum'],
  SCIENCE_TYPES
);
addQuestions('Physics', 'A Level', '9702',
  ['Circular motion centripetal', 'Gravitational field strength', 'Gravitational potential', 'Orbits and satellites', 'Simple harmonic motion', 'Damping and resonance', 'Ideal gas equation', 'Kinetic theory', 'Coulombs law', 'Electric field strength', 'Electric potential', 'Capacitance charging', 'Capacitance energy', 'Magnetic force on wire', 'Magnetic force on charge', 'Electromagnetic induction Faraday', 'Alternating current rms', 'Photoelectric effect', 'Wave particle duality', 'Nuclear binding energy'],
  SCIENCE_A2_TYPES
);

// ═══ MATHEMATICS — 200 questions ═══
addQuestions('Mathematics', 'O Level', '4024',
  ['Number operations', 'Fractions decimals percentages', 'Ratio proportion', 'Indices and standard form', 'Algebraic expressions', 'Linear equations', 'Quadratic equations', 'Simultaneous equations', 'Inequalities graphical', 'Sequences nth term', 'Functions notation', 'Angles in polygons', 'Circle theorems', 'Similarity congruence', 'Pythagoras theorem', 'Trigonometry SOHCAHTOA', 'Area volume surface area', 'Coordinate geometry line', 'Probability basic', 'Statistics averages'],
  MATHS_TYPES
);
addQuestions('Mathematics', 'A Level', '9709',
  ['Quadratics completing square', 'Functions composite inverse', 'Coordinate geometry circles', 'Circular measure radians', 'Trigonometric identities', 'Trigonometric equations', 'Arithmetic series', 'Geometric series', 'Binomial expansion', 'Differentiation chain rule', 'Differentiation product quotient', 'Differentiation applications', 'Integration by substitution', 'Integration by parts', 'Definite integrals area', 'Vectors dot product', 'Normal distribution', 'Binomial distribution', 'Hypothesis testing', 'Mechanics forces equilibrium'],
  MATHS_TYPES
);

// ═══ ECONOMICS — 200 questions ═══
addQuestions('Economics', 'O Level', '2217',
  ['Scarcity opportunity cost', 'Demand and supply curves', 'Price elasticity of demand', 'Market equilibrium', 'Market failure externalities', 'Government intervention price', 'Inflation causes', 'Unemployment types', 'GDP measurement', 'International trade advantages', 'Exchange rate determination', 'Development indicators', 'Money and banking', 'Fiscal policy tools', 'Monetary policy tools', 'Globalisation effects', 'Poverty cycle', 'Privatisation', 'Trade protection tariffs', 'Balance of payments'],
  HUMANITIES_TYPES
);
addQuestions('Economics', 'A Level', '9708',
  ['Utility maximisation', 'Costs short run long run', 'Revenue and profit', 'Perfect competition', 'Monopoly', 'Oligopoly game theory', 'Monopolistic competition', 'Labour market wages', 'Income distribution Gini', 'Government failure', 'AD AS model', 'Multiplier effect', 'Phillips curve', 'Quantity theory money', 'Keynesian vs monetarist', 'Supply side policies', 'Exchange rate systems', 'WTO and trade agreements', 'Developing economies', 'Structural adjustment'],
  HUMANITIES_TYPES
);

// ═══ ENGLISH LANGUAGE — 150 questions ═══
addQuestions('English Language', 'O Level', '3247',
  ['Reading comprehension inference', 'Summary writing paraphrase', 'Directed writing formal letter', 'Directed writing speech', 'Directed writing report', 'Directed writing article', 'Narrative opening', 'Descriptive writing setting', 'Argumentative essay', 'Language analysis techniques', 'Register formal informal', 'Audience awareness', 'Vocabulary in context', 'Sentence structure effects', 'Paragraph organisation'],
  [{ type: 'analysis', marks: 5, cmd: 'analyse' }, { type: 'writing', marks: 8, cmd: 'write' }, { type: 'summary', marks: 4, cmd: 'summarise' }, { type: 'structured', marks: 3, cmd: 'identify' }, { type: 'writing', marks: 6, cmd: 'write' }]
);
addQuestions('English Language', 'A Level', '9093',
  ['Text analysis persuasion', 'Text analysis narrative', 'Comparative commentary', 'Language and gender', 'Language and power', 'Language change historical', 'Child language acquisition', 'World Englishes', 'Phonology', 'Morphology', 'Semantics and pragmatics', 'Discourse spoken written', 'Commentary on own writing', 'Directed writing A2 speech', 'Directed writing A2 editorial'],
  [{ type: 'analysis', marks: 8, cmd: 'analyse' }, { type: 'essay', marks: 12, cmd: 'evaluate' }, { type: 'writing', marks: 10, cmd: 'write' }, { type: 'comparison', marks: 8, cmd: 'compare' }, { type: 'commentary', marks: 6, cmd: 'comment' }]
);

// ═══ PAKISTAN STUDIES — 200 questions ═══
addQuestions('Pakistan Studies', 'O Level', '2059',
  ['Two Nation Theory origins', 'Sir Syed Ahmad Khan', 'Allama Iqbal philosophy', 'Quaid-e-Azam leadership', 'Lahore Resolution 1940', 'Partition and independence', 'Constitution 1956', 'Constitution 1962', 'Constitution 1973', 'Kashmir dispute', 'Physical geography mountains', 'River systems Indus', 'Climate zones', 'Agriculture major crops', 'Industry development', 'CPEC significance', 'Population challenges', 'Water resources crisis', 'Cultural heritage', 'Foreign policy neighbours', 'Bangladesh crisis 1971', 'Indus Water Treaty', 'Nuclear programme', 'Education system', 'Khilafat Movement', 'Lucknow Pact 1916', 'Simon Commission', 'Round Table Conferences', 'Cabinet Mission', 'Mountbatten Plan', 'Simla Deputation 1906', 'Muslim League formation', 'Cripps Mission', 'Direct Action Day', 'Mineral resources', 'Transport infrastructure', 'Trade and commerce', 'Urbanisation challenges', 'Energy crisis', 'Democratic development'],
  [{ type: 'structured', marks: 4, cmd: 'explain' }, { type: 'essay', marks: 14, cmd: 'evaluate' }, { type: 'source', marks: 4, cmd: 'use the source' }, { type: 'structured', marks: 3, cmd: 'describe' }, { type: 'essay', marks: 7, cmd: 'explain why' }]
);

// ═══ ISLAMIAT — 200 questions ═══
addQuestions('Islamiat', 'O Level', '2058',
  ['Shahada meaning', 'Salah importance', 'Zakat calculation', 'Sawm Ramadan', 'Hajj rituals', 'Quran revelation stages', 'Surah Al-Fatiha themes', 'Surah Al-Ikhlas tawheed', 'Surah Al-Nas protection', 'Surah Al-Falaq', 'Surah Ayatul Kursi', 'Hadith Bukhari', 'Hadith Muslim', 'Prophet life Makkah', 'Prophet life Madinah', 'Hijrah significance', 'Treaty of Hudaibiya', 'Battle of Badr', 'Battle of Uhud', 'Battle of Khandaq', 'Conquest of Makkah', 'Farewell Sermon', 'Abu Bakr caliphate', 'Umar caliphate', 'Usman caliphate', 'Ali caliphate', 'Islamic law sources', 'Jihad concept', 'Islamic ethics', 'Concept of Akhirah', 'Rights of parents', 'Rights of neighbours', 'Islamic economics Riba', 'Women in Islam', 'Islamic Golden Age', 'Education in Islam', 'Justice in Islam', 'Tawheed Risalah Akhirah', 'Sunnah importance', 'Ijtihad and consensus'],
  [{ type: 'structured', marks: 4, cmd: 'describe' }, { type: 'essay', marks: 10, cmd: 'explain importance' }, { type: 'structured', marks: 3, cmd: 'state' }, { type: 'essay', marks: 7, cmd: 'explain' }, { type: 'structured', marks: 4, cmd: 'give an account' }]
);

// ═══ COMPUTER SCIENCE — 150 questions ═══
addQuestions('Computer Science', 'O Level', '2210',
  ['Binary denary hex conversion', 'ASCII Unicode', 'Logic gates AND OR NOT', 'Truth tables', 'Data storage images sound', 'Compression lossy lossless', 'Network topologies', 'TCP IP protocols', 'Internet security threats', 'Encryption', 'Databases tables', 'SQL queries', 'Algorithms searching', 'Algorithms sorting', 'Programming pseudocode loops'],
  [{ type: 'structured', marks: 3, cmd: 'describe' }, { type: 'coding', marks: 4, cmd: 'write pseudocode' }, { type: 'structured', marks: 3, cmd: 'explain' }, { type: 'calculation', marks: 2, cmd: 'convert' }, { type: 'structured', marks: 4, cmd: 'compare' }]
);
addQuestions('Computer Science', 'A Level', '9618',
  ['Binary floating point', 'Communication protocols', 'Processor architecture', 'Fetch decode execute', 'Operating system management', 'Cybersecurity', 'Ethics AI', 'Normalisation databases', 'Algorithm complexity Big O', 'Recursion', 'OOP inheritance', 'OOP polymorphism', 'Linked lists stacks queues', 'Trees and graphs', 'Boolean algebra'],
  [{ type: 'structured', marks: 4, cmd: 'explain' }, { type: 'coding', marks: 6, cmd: 'write algorithm' }, { type: 'extended', marks: 8, cmd: 'discuss' }, { type: 'structured', marks: 3, cmd: 'describe' }, { type: 'calculation', marks: 3, cmd: 'calculate' }]
);

// ═══ URDU — 100 questions ═══
addQuestions('Urdu', 'O Level', '3204',
  ['Nazm analysis technique', 'Nazm theme message', 'Nasr comprehension', 'Nasr theme analysis', 'Essay writing argumentative', 'Essay writing descriptive', 'Formal letter writing', 'Informal letter writing', 'Application writing', 'Grammar parts of speech', 'Grammar sentence structure', 'Comprehension passage', 'Translation Urdu to English', 'Translation English to Urdu', 'Ghazal appreciation', 'Summary writing Urdu', 'Dialogue writing', 'Story writing', 'Idioms and proverbs', 'Vocabulary usage'],
  [{ type: 'analysis', marks: 5, cmd: 'analyse' }, { type: 'writing', marks: 8, cmd: 'write' }, { type: 'structured', marks: 3, cmd: 'explain' }, { type: 'translation', marks: 4, cmd: 'translate' }, { type: 'writing', marks: 6, cmd: 'write' }]
);

// ═══ BUSINESS STUDIES — 150 questions ═══
addQuestions('Business Studies', 'O Level', '7115',
  ['Business objectives', 'Sole traders partnerships', 'Marketing mix 4Ps', 'Market research methods', 'Operations quality control', 'Finance sources', 'Cash flow management', 'Human resources recruitment', 'Motivation theories', 'Organisational structure', 'Communication methods', 'External environment PEST', 'Stakeholders', 'Business plans', 'Break even analysis'],
  HUMANITIES_TYPES
);
addQuestions('Business Studies', 'A Level', '9609',
  ['Strategic analysis SWOT', 'Porters Five Forces', 'Investment appraisal', 'Marketing strategy STP', 'Operations lean production', 'HRM talent management', 'Corporate culture', 'Mergers acquisitions', 'Global strategy', 'Innovation and RD', 'Corporate social responsibility', 'Financial ratios', 'Strategic direction Ansoff', 'Change management', 'Decision trees'],
  HUMANITIES_TYPES
);

// ═══ GEOGRAPHY — 150 questions ═══
addQuestions('Geography', 'O Level', '2217',
  ['River processes erosion', 'River landforms meanders', 'Coastal processes', 'Coastal management', 'Plate tectonics', 'Earthquakes causes effects', 'Volcanoes types', 'Weather instruments', 'Climate zones', 'Tropical storms', 'Population growth', 'Population policies', 'Settlement hierarchy', 'Rural urban migration', 'Urbanisation problems', 'Industry location', 'Tourism impacts', 'Farming types', 'Deforestation causes', 'Water supply challenges'],
  [{ type: 'structured', marks: 4, cmd: 'describe' }, { type: 'extended', marks: 7, cmd: 'explain' }, { type: 'data', marks: 3, cmd: 'interpret' }, { type: 'case study', marks: 5, cmd: 'use a named example' }, { type: 'structured', marks: 3, cmd: 'state' }]
);

// ═══ LITERATURE — 150 questions ═══
addQuestions('Literature in English', 'O Level', '3248',
  ['Shakespeare Macbeth themes', 'Shakespeare Othello characters', 'Shakespeare Merchant Venice', 'Poetry imagery analysis', 'Poetry structure form', 'Poetry comparison two poems', 'Prose character development', 'Prose narrative technique', 'Prose setting atmosphere', 'Drama dramatic irony', 'Unseen poetry response', 'Unseen prose response', 'Context historical social', 'Writers methods language', 'Personal response interpretation'],
  [{ type: 'analysis', marks: 8, cmd: 'analyse' }, { type: 'essay', marks: 12, cmd: 'explore' }, { type: 'comparison', marks: 8, cmd: 'compare' }, { type: 'analysis', marks: 6, cmd: 'how does the writer' }, { type: 'essay', marks: 10, cmd: 'discuss' }]
);

// ═══ HISTORY — 150 questions ═══
addQuestions('History', 'A Level', '9389',
  ['Causes of WW1 alliances', 'Causes of WW1 imperialism', 'Treaty of Versailles terms', 'Weimar Republic challenges', 'Rise of Hitler factors', 'Nazi domestic policies', 'Cold War origins Yalta Potsdam', 'Berlin Blockade', 'Korean War', 'Cuban Missile Crisis', 'Vietnam War', 'Decolonisation Africa', 'Decolonisation India', 'Russian Revolution causes', 'Stalins USSR', 'Chinese Revolution Mao', 'Civil Rights MLK', 'Civil Rights Malcolm X', 'Apartheid and Mandela', 'Fall of Berlin Wall', 'Gorbachev reforms', 'Arab Israeli conflict', 'European integration', 'Womens suffrage', 'Industrial Revolution effects', 'French Revolution causes', 'Napoleonic Wars', 'Unification of Germany', 'Unification of Italy', 'Ottoman Empire decline'],
  [{ type: 'source', marks: 6, cmd: 'evaluate' }, { type: 'essay', marks: 15, cmd: 'to what extent' }, { type: 'structured', marks: 5, cmd: 'explain' }, { type: 'source', marks: 4, cmd: 'compare sources' }, { type: 'essay', marks: 10, cmd: 'how far do you agree' }]
);

// ═══ ACCOUNTING — 100 questions ═══
addQuestions('Accounting', 'O Level', '7110',
  ['Double entry bookkeeping', 'Trial balance', 'Income statement', 'Balance sheet', 'Cash flow statement', 'Bank reconciliation', 'Depreciation methods', 'Bad debts provision', 'Inventory valuation', 'Suspense accounts', 'Partnership accounts', 'Limited company accounts', 'Ratio analysis', 'Budgeting', 'Cost accounting', 'Capital and revenue', 'Accruals prepayments', 'Correction of errors', 'Club accounts', 'Manufacturing accounts'],
  [{ type: 'calculation', marks: 4, cmd: 'prepare' }, { type: 'structured', marks: 3, cmd: 'explain' }, { type: 'calculation', marks: 5, cmd: 'calculate' }, { type: 'structured', marks: 4, cmd: 'describe' }, { type: 'analysis', marks: 3, cmd: 'analyse' }]
);

// ═══ SOCIOLOGY — 100 questions ═══
addQuestions('Sociology', 'O Level', '2251',
  ['Functionalism', 'Marxism', 'Feminism', 'Family types', 'Education and inequality', 'Crime and deviance', 'Media influence', 'Social stratification', 'Poverty', 'Research methods', 'Gender socialisation', 'Ethnicity and identity', 'Youth subcultures', 'Religion and society', 'Globalisation culture', 'Power and politics', 'Health inequalities', 'Work and employment', 'Urbanisation sociology', 'Social mobility'],
  HUMANITIES_TYPES
);

// ═══ ADDITIONAL MATHS — 100 questions ═══
addQuestions('Additional Mathematics', 'O Level', '4037',
  ['Quadratic inequalities', 'Surds and indices', 'Polynomials factor theorem', 'Partial fractions', 'Binomial theorem', 'Logarithms equations', 'Trigonometric identities', 'Trigonometric equations', 'Coordinate geometry circles', 'Linear law', 'Calculus differentiation', 'Calculus integration', 'Kinematics displacement', 'Kinematics velocity acceleration', 'Permutations combinations', 'Matrices transformations', 'Vectors position', 'Sets and Venn diagrams', 'Relative velocity', 'Modulus functions'],
  MATHS_TYPES
);

const TOTAL_QUESTIONS = QUESTION_SPECS.length;

export default async function handler(req, res) {
  const auth = req.headers.authorization || req.query.secret;
  if (auth !== process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.query.count === '1') {
    return res.status(200).json({ total_specifications: TOTAL_QUESTIONS, message: `${TOTAL_QUESTIONS} question specs ready. Run with ?start=0&batch=10 to begin.` });
  }

  const sb = getSupabase();
  const batchSize = parseInt(req.query.batch || '10');
  const startIdx = parseInt(req.query.start || '0');
  const endIdx = Math.min(startIdx + batchSize, TOTAL_QUESTIONS);

  const results = [];
  let answered = 0;

  for (let i = startIdx; i < endIdx; i++) {
    const spec = QUESTION_SPECS[i];
    try {
      // Step 1: Generate a Cambridge question
      const genResponse = await client.messages.create({
        model: /* PERMANENT: Haiku 3 only. Never change without Khurram's approval. */ 'claude-3-haiku-20240307',
        max_tokens: 300,
        system: `You are a Cambridge ${spec.level} ${spec.subject} (${spec.code}) examiner. Generate ONE exam question. Topic: ${spec.topic}. Question type: ${spec.type}. Command word: ${spec.commandWord}. Marks: [${spec.marks}]. Output ONLY the question text with mark allocation. No preamble. Cambridge format.`,
        messages: [{ role: 'user', content: `Generate a ${spec.marks}-mark ${spec.commandWord} question on ${spec.topic} for ${spec.subject} ${spec.level} (${spec.code}).` }],
      });
      const question = genResponse.content?.[0]?.text || '';
      if (!question) continue;

      // Step 2: Answer the question
      const ansResponse = await client.messages.create({
        model: /* PERMANENT: Haiku 3 only. Never change without Khurram's approval. */ 'claude-3-haiku-20240307',
        max_tokens: 600,
        system: `You are Starky, a Cambridge ${spec.level} ${spec.subject} examiner-tutor. Answer with mark-scheme precision. Give the mark-scheme answer first, then brief explanation. Use exact Cambridge terminology. Be concise and exam-focused.`,
        messages: [{ role: 'user', content: question }],
      });
      const answer = ansResponse.content?.[0]?.text || '';

      results.push({ subject: spec.subject, level: spec.level, topic: spec.topic, type: spec.type, marks: spec.marks, question, answer, status: 'answered', index: i });
      answered++;

      // Store in Supabase
      if (sb) {
        await sb.from('cambridge_test_answers').insert({
          subject: spec.subject, question, answer,
          model: /* PERMANENT: Haiku 3 only. Never change without Khurram's approval. */ 'claude-3-haiku-20240307',
          timestamp: new Date().toISOString(),
          question_index: i + 1000, // offset from the original 400
        }).catch(() => {});
      }
    } catch (err) {
      results.push({ subject: spec.subject, topic: spec.topic, status: 'error', error: err.message, index: i });
    }
  }

  // Auto-chain next batch
  if (endIdx < TOTAL_QUESTIONS) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.newworld.education';
    fetch(`${baseUrl}/api/cron/cambridge-4k?secret=${process.env.CRON_SECRET}&batch=${batchSize}&start=${endIdx}`, { method: 'GET' }).catch(() => {});
  }

  return res.status(200).json({
    total_specs: TOTAL_QUESTIONS,
    batch_start: startIdx,
    batch_end: endIdx,
    answered_in_batch: answered,
    next_start: endIdx < TOTAL_QUESTIONS ? endIdx : null,
    complete: endIdx >= TOTAL_QUESTIONS,
    progress: `${Math.min(endIdx, TOTAL_QUESTIONS)}/${TOTAL_QUESTIONS} (${((Math.min(endIdx, TOTAL_QUESTIONS) / TOTAL_QUESTIONS) * 100).toFixed(1)}%)`,
  });
}
