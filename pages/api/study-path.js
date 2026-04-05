/**
 * pages/api/study-path.js — Structured learning path API
 * ─────────────────────────────────────────────────────────────────
 * Returns modules + topics for a subject, organized as a structured path.
 * Groups raw bank topics into logical modules.
 * Includes mastery data per topic for the logged-in user.
 *
 * GET ?subject=Chemistry&level=O+Level
 */

import { getSupabase } from '../../utils/supabase';

// Group raw topics into modules (syllabus-aligned from official Cambridge syllabuses)
const MODULE_MAP = {
  Chemistry: [
    { module: 'Atomic Structure', keywords: ['atomic', 'atom', 'element', 'periodic', 'electron', 'proton', 'neutron', 'isotope'] },
    { module: 'Bonding & Structure', keywords: ['bond', 'ionic', 'covalent', 'metallic', 'structure', 'alloy'] },
    { module: 'Stoichiometry', keywords: ['mole', 'stoichiometry', 'formula', 'equation', 'calculation', 'mass', 'concentration'] },
    { module: 'States of Matter', keywords: ['state', 'solid', 'liquid', 'gas', 'diffusion', 'kinetic'] },
    { module: 'Acids, Bases & Salts', keywords: ['acid', 'base', 'salt', 'pH', 'neutrali', 'alkali', 'indicator'] },
    { module: 'Electrolysis', keywords: ['electrolysis', 'electrode', 'electrolyte', 'anode', 'cathode'] },
    { module: 'Energy Changes', keywords: ['energy', 'exothermic', 'endothermic', 'enthalpy', 'combustion'] },
    { module: 'Rates of Reaction', keywords: ['rate', 'catalyst', 'collision', 'activation'] },
    { module: 'Organic Chemistry', keywords: ['organic', 'alkane', 'alkene', 'polymer', 'hydrocarbon', 'ethanol', 'fermentation'] },
    { module: 'Metals & Reactivity', keywords: ['metal', 'reactivity', 'extraction', 'ore', 'rust', 'corrosion', 'redox'] },
  ],
  Physics: [
    { module: 'Forces & Motion', keywords: ['force', 'motion', 'speed', 'velocity', 'acceleration', 'momentum', 'newton'] },
    { module: 'Energy', keywords: ['energy', 'work', 'power', 'efficiency', 'transfer', 'conservation'] },
    { module: 'Waves', keywords: ['wave', 'sound', 'light', 'reflection', 'refraction', 'diffraction', 'lens'] },
    { module: 'Electricity', keywords: ['electric', 'current', 'voltage', 'resistance', 'circuit', 'ohm'] },
    { module: 'Magnetism', keywords: ['magnet', 'electromagnetic', 'motor', 'generator', 'transformer', 'induction'] },
    { module: 'Thermal Physics', keywords: ['thermal', 'heat', 'temperature', 'specific heat', 'conduction', 'convection', 'radiation'] },
    { module: 'Nuclear Physics', keywords: ['nuclear', 'radioactiv', 'half-life', 'alpha', 'beta', 'gamma', 'fission', 'fusion'] },
    { module: 'Space & Astrophysics', keywords: ['space', 'astrophysics', 'star', 'galaxy', 'universe', 'orbit', 'planet'] },
  ],
  Biology: [
    { module: 'Cells & Organisation', keywords: ['cell', 'organelle', 'microscop', 'tissue', 'organ'] },
    { module: 'Transport & Nutrition', keywords: ['transport', 'nutrition', 'digestion', 'enzyme', 'food', 'diet', 'osmosis', 'diffusion'] },
    { module: 'Respiration & Gas Exchange', keywords: ['respiration', 'breathing', 'lung', 'gas exchange', 'aerobic', 'anaerobic'] },
    { module: 'Photosynthesis & Plants', keywords: ['photosynthesis', 'plant', 'leaf', 'chlorophyll', 'xylem', 'phloem'] },
    { module: 'Reproduction & Inheritance', keywords: ['reproduction', 'inherit', 'gene', 'DNA', 'chromosome', 'mitosis', 'meiosis', 'mutation'] },
    { module: 'Ecology & Environment', keywords: ['ecology', 'environment', 'ecosystem', 'population', 'food chain', 'pollution', 'conservation'] },
    { module: 'Nervous System & Hormones', keywords: ['nervous', 'hormone', 'brain', 'reflex', 'homeostasis', 'insulin', 'diabetes'] },
    { module: 'Disease & Immunity', keywords: ['disease', 'immune', 'pathogen', 'bacteria', 'virus', 'vaccination', 'antibiotic'] },
  ],
  Mathematics: [
    { module: 'Number', keywords: ['number', 'fraction', 'decimal', 'percentage', 'ratio', 'proportion', 'standard form', 'index'] },
    { module: 'Algebra', keywords: ['algebra', 'equation', 'expression', 'formula', 'inequality', 'sequence', 'simultaneous', 'quadratic'] },
    { module: 'Geometry', keywords: ['geometry', 'angle', 'triangle', 'circle', 'polygon', 'area', 'volume', 'pythagoras', 'symmetry'] },
    { module: 'Trigonometry', keywords: ['trigonometry', 'sine', 'cosine', 'tangent', 'sin', 'cos', 'tan'] },
    { module: 'Statistics & Probability', keywords: ['statistics', 'probability', 'mean', 'median', 'mode', 'histogram', 'pie chart', 'cumulative'] },
    { module: 'Graphs & Functions', keywords: ['graph', 'function', 'coordinate', 'gradient', 'intercept', 'linear', 'curve'] },
    { module: 'Vectors & Transformations', keywords: ['vector', 'transformation', 'translation', 'rotation', 'reflection', 'enlargement', 'matrix'] },
  ],
  Geography: [
    { module: 'Population & Settlement', keywords: ['population', 'settlement', 'migration', 'urban', 'rural', 'density', 'distribution', 'demographic'] },
    { module: 'The Natural Environment', keywords: ['earthquake', 'volcano', 'river', 'coast', 'weather', 'climate', 'vegetation', 'flood', 'erosion', 'deposition'] },
    { module: 'Economic Development', keywords: ['development', 'food', 'industry', 'tourism', 'energy', 'water', 'environment', 'trade', 'resource'] },
  ],
  'Pakistan Studies': [
    { module: 'Islamic Thinkers & Mughal Empire', keywords: ['islam', 'mughal', 'shah waliullah', 'syed ahmad', 'thinker', 'decline', 'empire'] },
    { module: 'Pakistan Movement', keywords: ['movement', 'khilafat', 'congress', 'league', 'jinnah', 'iqbal', 'partition', 'lahore resolution', 'independence', '1947'] },
    { module: 'Nationhood & Governance', keywords: ['constitution', 'government', 'martial law', 'democracy', 'bangladesh', 'bhutto', 'zia', 'musharraf', 'benazir', 'nawaz'] },
    { module: 'Land & Resources of Pakistan', keywords: ['land', 'climate', 'topography', 'water', 'forest', 'mineral', 'irrigation', 'river'] },
    { module: 'Agriculture & Industry', keywords: ['agriculture', 'crop', 'industry', 'cotton', 'wheat', 'rice', 'textile', 'manufacturing', 'livestock'] },
    { module: 'Trade, Transport & Population', keywords: ['trade', 'transport', 'population', 'employment', 'export', 'import', 'telecommunication', 'port'] },
  ],
  Economics: [
    { module: 'Basic Economic Problem', keywords: ['economic problem', 'scarcity', 'opportunity cost', 'factor', 'production possibility'] },
    { module: 'Allocation of Resources', keywords: ['demand', 'supply', 'price', 'market', 'elasticity', 'equilibrium', 'allocation'] },
    { module: 'Microeconomic Decision Makers', keywords: ['bank', 'household', 'worker', 'trade union', 'firm', 'money'] },
    { module: 'Government & Macroeconomy', keywords: ['fiscal', 'monetary', 'inflation', 'unemployment', 'growth', 'gdp', 'tax', 'government', 'budget'] },
    { module: 'Economic Development', keywords: ['development', 'poverty', 'living standard', 'hdi'] },
    { module: 'International Trade', keywords: ['trade', 'globalisation', 'tariff', 'exchange rate', 'balance of payment', 'multinational', 'protection'] },
  ],
  Accounting: [
    { module: 'Fundamentals', keywords: ['accounting equation', 'book-keeping', 'basic term', 'concept'] },
    { module: 'Recording & Sources', keywords: ['double entry', 'ledger', 'journal', 'prime entry', 'document', 'receipt'] },
    { module: 'Verification', keywords: ['trial balance', 'bank reconciliation', 'control account', 'correction', 'error', 'suspense'] },
    { module: 'Accounting Procedures', keywords: ['depreciation', 'disposal', 'accrual', 'prepayment', 'bad debt', 'provision', 'inventory', 'capital', 'revenue'] },
    { module: 'Financial Statements', keywords: ['income statement', 'balance sheet', 'financial statement', 'profit', 'loss', 'partnership', 'sole trader', 'club', 'incomplete'] },
    { module: 'Analysis & Ratios', keywords: ['ratio', 'analysis', 'interpret', 'gross profit', 'net profit', 'liquidity', 'return'] },
  ],
  'Computer Science': [
    { module: 'Data Representation', keywords: ['binary', 'hexadecimal', 'data representation', 'ascii', 'unicode', 'image', 'sound', 'compression'] },
    { module: 'Hardware & Software', keywords: ['hardware', 'software', 'processor', 'memory', 'storage', 'input', 'output', 'operating system'] },
    { module: 'Networks & Internet', keywords: ['network', 'internet', 'protocol', 'tcp', 'ip', 'web', 'email', 'security', 'encryption'] },
    { module: 'Algorithms & Programming', keywords: ['algorithm', 'flowchart', 'pseudocode', 'programming', 'variable', 'loop', 'array', 'function', 'procedure'] },
    { module: 'Databases & Boolean Logic', keywords: ['database', 'sql', 'query', 'boolean', 'logic gate', 'truth table', 'and', 'or', 'not'] },
  ],
  'Business Studies': [
    { module: 'Understanding Business', keywords: ['business', 'enterprise', 'stakeholder', 'objective', 'growth', 'organisation', 'sole trader', 'partnership', 'limited'] },
    { module: 'People in Business', keywords: ['motivation', 'recruitment', 'training', 'organisation', 'communication', 'leadership'] },
    { module: 'Marketing', keywords: ['marketing', 'market research', 'segmentation', 'product', 'price', 'promotion', 'place', 'brand'] },
    { module: 'Operations', keywords: ['production', 'productivity', 'quality', 'stock', 'location', 'cost', 'break-even'] },
    { module: 'Finance', keywords: ['finance', 'cash flow', 'income statement', 'balance sheet', 'source of finance', 'ratio'] },
    { module: 'External Influences', keywords: ['government', 'economic', 'legal', 'environmental', 'ethical', 'globalisation', 'exchange rate'] },
  ],
  Commerce: [
    { module: 'Commerce & Production', keywords: ['commerce', 'production', 'supply chain', 'trade', 'digital'] },
    { module: 'Commercial Operations', keywords: ['retail', 'wholesale', 'enterprise', 'outsourcing', 'communication'] },
    { module: 'Global Trade', keywords: ['international', 'global', 'import', 'export', 'supply chain risk'] },
    { module: 'Logistics', keywords: ['transport', 'warehouse', 'logistics', 'distribution'] },
    { module: 'Aids to Trade', keywords: ['advertising', 'banking', 'insurance', 'finance'] },
    { module: 'Sustainability & Ethics', keywords: ['sustainability', 'ethics', 'consumer protection', 'environment'] },
  ],
  History: [
    { module: 'Treaties & League of Nations', keywords: ['versailles', 'treaty', 'league of nations', 'wilson', 'peace'] },
    { module: 'Rise of Dictators', keywords: ['hitler', 'nazi', 'fascis', 'mussolini', 'stalin', 'dictator', 'appeasement'] },
    { module: 'World War II', keywords: ['world war', 'ww2', 'wwii', 'blitz', 'holocaust', 'hiroshima', 'normandy'] },
    { module: 'Cold War', keywords: ['cold war', 'berlin', 'cuba', 'nato', 'warsaw', 'soviet', 'ussr', 'communis', 'capitalism'] },
    { module: 'Decolonisation & Development', keywords: ['decoloni', 'independence', 'civil rights', 'apartheid', 'united nations'] },
  ],
  Sociology: [
    { module: 'Research Methods', keywords: ['research', 'method', 'survey', 'interview', 'questionnaire', 'observation', 'data'] },
    { module: 'Identity & Social Control', keywords: ['identity', 'social control', 'socialisation', 'norms', 'values', 'culture'] },
    { module: 'Social Stratification', keywords: ['stratification', 'class', 'inequality', 'poverty', 'wealth', 'gender', 'ethnicity'] },
    { module: 'Family', keywords: ['family', 'household', 'marriage', 'divorce', 'nuclear', 'extended'] },
    { module: 'Education', keywords: ['education', 'school', 'curriculum', 'achievement', 'attainment'] },
    { module: 'Crime & Deviance', keywords: ['crime', 'deviance', 'punishment', 'prison', 'law', 'police'] },
  ],
  'English Language': [
    { module: 'Reading Comprehension', keywords: ['comprehension', 'reading', 'passage', 'extract', 'meaning', 'inference', 'explicit', 'implicit'] },
    { module: 'Writer\'s Craft', keywords: ['language', 'technique', 'effect', 'imagery', 'metaphor', 'simile', 'tone', 'style'] },
    { module: 'Summary Writing', keywords: ['summary', 'summarise', 'key points', 'concise'] },
    { module: 'Directed Writing', keywords: ['directed', 'speech', 'letter', 'report', 'article', 'persuasive', 'argument'] },
    { module: 'Composition', keywords: ['narrative', 'descriptive', 'composition', 'creative writing', 'story'] },
  ],
  Islamiyat: [
    { module: 'Qur\'an', keywords: ['quran', 'qur\'an', 'surah', 'ayah', 'revelation', 'tafsir'] },
    { module: 'Prophet Muhammad (PBUH)', keywords: ['prophet', 'muhammad', 'seerah', 'makkah', 'madinah', 'hijrah', 'sunnah'] },
    { module: 'Hadith', keywords: ['hadith', 'hadis', 'saying', 'tradition'] },
    { module: 'Caliphs & Early Islam', keywords: ['caliph', 'abu bakr', 'umar', 'uthman', 'ali', 'rashidun', 'rightly guided'] },
    { module: 'Pillars & Articles of Faith', keywords: ['pillar', 'salah', 'zakat', 'hajj', 'fasting', 'shahadah', 'iman', 'faith', 'belief'] },
  ],
  'Additional Mathematics': [
    { module: 'Algebra', keywords: ['algebra', 'equation', 'inequality', 'quadratic', 'polynomial', 'remainder', 'factor', 'binomial'] },
    { module: 'Functions', keywords: ['function', 'inverse', 'composite', 'modulus', 'logarithm', 'exponential'] },
    { module: 'Coordinate Geometry', keywords: ['coordinate', 'straight line', 'circle', 'gradient', 'midpoint'] },
    { module: 'Trigonometry', keywords: ['trigonometry', 'sine', 'cosine', 'tangent', 'identity', 'radian'] },
    { module: 'Calculus', keywords: ['differentiation', 'integration', 'derivative', 'gradient', 'tangent', 'area under'] },
    { module: 'Kinematics', keywords: ['kinematics', 'velocity', 'displacement', 'acceleration'] },
  ],
};

// Fallback: create modules from topic first words
function autoGroupTopics(topics) {
  const groups = {};
  for (const t of topics) {
    const firstWord = (t.topic || '').split(/[\s,&-]/)[0] || 'General';
    const key = firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  }
  return Object.entries(groups)
    .map(([name, topics]) => ({ module: name, topics }))
    .sort((a, b) => b.topics.length - a.topics.length);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const { subject, level = 'O Level' } = req.query;
  if (!subject) return res.status(400).json({ error: 'subject required' });

  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'DB not configured' });

  try {
    // Get all topics for this subject with question counts
    let query = supabase
      .from('question_bank')
      .select('topic')
      .eq('subject', subject)
      .eq('verified', true)
      .not('topic', 'is', null)
      .limit(5000);
    // Filter by level if not mixing
    if (level) query = query.eq('level', level);
    const { data: topicData } = await query;

    if (!topicData?.length) {
      return res.status(200).json({ subject, level, modules: [], totalTopics: 0 });
    }

    // Count questions per topic
    const topicCounts = {};
    for (const t of topicData) {
      const topic = t.topic?.trim();
      if (!topic || topic === 'General') continue;
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    }

    const topics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, questionCount: count }))
      .filter(t => t.questionCount >= 2)
      .sort((a, b) => b.questionCount - a.questionCount);

    // Group into modules
    const moduleMap = MODULE_MAP[subject];
    let modules;

    if (moduleMap) {
      modules = moduleMap.map(m => {
        const matched = topics.filter(t =>
          m.keywords.some(kw => t.topic.toLowerCase().includes(kw))
        );
        return { module: m.module, topics: matched, totalQuestions: matched.reduce((s, t) => s + t.questionCount, 0) };
      }).filter(m => m.topics.length > 0);

      // Add unmatched topics as "Other"
      const matchedTopics = new Set(modules.flatMap(m => m.topics.map(t => t.topic)));
      const unmatched = topics.filter(t => !matchedTopics.has(t.topic));
      if (unmatched.length > 0) {
        modules.push({ module: 'Other Topics', topics: unmatched, totalQuestions: unmatched.reduce((s, t) => s + t.questionCount, 0) });
      }
    } else {
      modules = autoGroupTopics(topics);
    }

    // Get mastery data if user is logged in
    let mastery = {};
    const userEmail = req.headers['x-student-email'];
    if (userEmail) {
      const { data: masteryData } = await supabase
        .from('topic_mastery')
        .select('topic, mastery_level, questions_attempted, questions_correct')
        .eq('user_id', userEmail)
        .eq('subject', subject);

      if (masteryData) {
        for (const m of masteryData) {
          mastery[m.topic] = m;
        }
      }
    }

    // Enrich topics with mastery
    for (const mod of modules) {
      for (const topic of mod.topics) {
        const m = mastery[topic.topic];
        topic.masteryLevel = m?.mastery_level || 0;
        topic.attempted = m?.questions_attempted || 0;
        topic.accuracy = m?.questions_attempted > 0 ? Math.round((m.questions_correct / m.questions_attempted) * 100) : null;
      }
      mod.masteredCount = mod.topics.filter(t => t.masteryLevel >= 4).length;
      mod.progress = mod.topics.length > 0 ? Math.round((mod.masteredCount / mod.topics.length) * 100) : 0;
    }

    return res.status(200).json({
      subject,
      level,
      modules,
      totalTopics: topics.length,
      totalQuestions: topics.reduce((s, t) => s + t.questionCount, 0),
    });
  } catch (err) {
    console.error('[study-path] Error:', err.message);
    return res.status(500).json({ error: 'Failed to load study path' });
  }
}
