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

// Group raw topics into modules (syllabus-aligned)
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
    { module: 'Electricity', keywords: ['electric', 'current', 'voltage', 'resistance', 'circuit', 'ohm', 'power'] },
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
    const { data: topicData } = await supabase
      .from('question_bank')
      .select('topic')
      .eq('subject', subject)
      .eq('verified', true)
      .not('topic', 'is', null)
      .limit(5000);

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
