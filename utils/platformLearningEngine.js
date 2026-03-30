/**
 * utils/platformLearningEngine.js
 * Autonomous Learning Architecture — NewWorldEdu gets smarter after every session.
 *
 * Every session is a data point. Every mistake reveals a gap.
 * Every improvement reveals what works. The platform compounds. Forever.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION LEARNING RECORD — captured after every session
// ═══════════════════════════════════════════════════════════════════════════════

export const SESSION_RECORD_SCHEMA = {
  session_id: null,
  timestamp: null,
  user_type: null,           // student/parent/sen_parent/teacher
  country: null,             // PAK/UAE/OTHER
  curriculum: null,          // cambridge/cbse/ib/american/moe
  grade: null,
  subject: null,
  conditions: [],            // SEN conditions if any

  // Quality signals
  session_length_minutes: 0,
  messages_exchanged: 0,
  student_questions_asked: 0,  // student-initiated = high engagement
  starky_questions_asked: 0,
  session_abandoned_early: false,
  session_extended: false,     // student asked for more

  // Learning signals
  topics_covered: [],
  questions_starky_couldnt_answer: [],
  concepts_repeated: [],       // same concept 3+ times = explanation needs work
  student_confirmed_understanding: false,
  student_expressed_confusion: false,

  // Voice signals
  voice_confidence_start: null,
  voice_confidence_end: null,
  confidence_delta: null,

  // Content gaps
  topics_not_in_kb: [],
  wrong_answers_detected: [],

  // Effectiveness
  student_rating: null,
  parent_rating: null,
  learning_outcome_estimated: null, // high/medium/low
};

// ═══════════════════════════════════════════════════════════════════════════════
// THE FIVE LEARNING LOOPS
// ═══════════════════════════════════════════════════════════════════════════════

export const LEARNING_LOOPS = {
  loop1_contentGaps: {
    name: 'Content Gap Detection',
    trigger: 'After every session',
    detection: 'Starky hedged, said "I\'m not certain", "you may want to verify", "I\'ll do my best"',
    action: 'Log question to content gaps. Group by subject, curriculum, grade.',
    threshold: 'Same gap appears 3+ times from different students → auto-generate KB enhancement.',
    example: '3 Grade 9 Cambridge students asked about Edexcel IGCSE Chemistry → Add Edexcel Chemistry to cambridgeExaminer.js',
  },

  loop2_explanationEffectiveness: {
    name: 'Explanation Effectiveness',
    trigger: 'Same concept explained 3+ times in one session',
    detection: 'Count re-explanations per concept per session',
    action: 'Flag explanation for rewrite. Try alternative approach next time.',
    example: 'Grade 8 students keep re-asking about quadratic equations → try visual analogy first, then formula, then worked example',
  },

  loop3_successPatterns: {
    name: 'Success Pattern Recognition',
    trigger: 'Session extended voluntarily + "I get it!" + positive confidence delta + low re-explanations',
    action: 'Log teaching approach, examples used, student profile. Build SUCCESS_PATTERNS library.',
    example: 'Cricket examples for probability with Grade 7 Pakistani boys → 40% faster understanding. Apply to similar profiles.',
  },

  loop4_struggleMapping: {
    name: 'Student Struggle Mapping',
    trigger: 'Aggregate across all sessions',
    metrics: [
      'Topics with most "I don\'t understand" moments by curriculum',
      'Grades that struggle most with which subjects',
      'SEN conditions that struggle with which teaching styles',
    ],
    output: 'STRUGGLE_MAP: Grade 10 Cambridge → Chemistry → Organic Chemistry is hardest platform-wide',
    action: 'Starky proactively intensifies coverage of high-struggle areas',
  },

  loop5_kbAutoEnhancement: {
    name: 'Knowledge Base Auto-Enhancement',
    trigger: 'Weekly cron (Sunday 3am PKT)',
    steps: [
      'Collect all content gaps from the week',
      'Rank by frequency (how many students hit this gap?)',
      'For gaps with 5+ instances: generate enhancement text via Claude',
      'Append to relevant knowledge base file',
      'Deploy automatically',
      'Send weekly report to Khurram',
    ],
    reportFormat: 'This week Starky learned: {new_topics} new topics. Most common gap: {top_gap}. Sessions improved: {count}.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STRUGGLE MAP — aggregated across all sessions
// ═══════════════════════════════════════════════════════════════════════════════

const STRUGGLE_MAP_KEY = 'nw_struggle_map';

export function getStruggleMap() {
  try { return JSON.parse(localStorage.getItem(STRUGGLE_MAP_KEY) || '{}'); } catch { return {}; }
}

function saveStruggleMap(map) {
  try { localStorage.setItem(STRUGGLE_MAP_KEY, JSON.stringify(map)); } catch {}
}

function updateStruggleMap(record) {
  const map = getStruggleMap();
  const key = `${record.curriculum || 'unknown'}:${record.grade || 'unknown'}:${record.subject || 'unknown'}`;

  if (!map[key]) map[key] = { confusion_count: 0, topics: {}, total_sessions: 0 };
  map[key].total_sessions += 1;

  if (record.student_expressed_confusion) map[key].confusion_count += 1;

  for (const topic of (record.concepts_repeated || [])) {
    if (!map[key].topics[topic]) map[key].topics[topic] = 0;
    map[key].topics[topic] += 1;
  }

  saveStruggleMap(map);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUCCESS PATTERNS — what works
// ═══════════════════════════════════════════════════════════════════════════════

const SUCCESS_KEY = 'nw_success_patterns';

export function getSuccessPatterns() {
  try { return JSON.parse(localStorage.getItem(SUCCESS_KEY) || '[]'); } catch { return []; }
}

function logSuccessPattern(record) {
  if (!record.session_extended && !record.student_confirmed_understanding) return;
  if (record.concepts_repeated?.length > 2) return; // too many re-explanations = not a success

  const patterns = getSuccessPatterns();
  patterns.push({
    date: new Date().toISOString(),
    curriculum: record.curriculum,
    grade: record.grade,
    subject: record.subject,
    topics: record.topics_covered,
    conditions: record.conditions,
    confidence_delta: record.confidence_delta,
    outcome: record.learning_outcome_estimated,
  });

  // Keep last 200 patterns
  if (patterns.length > 200) patterns.splice(0, patterns.length - 200);
  try { localStorage.setItem(SUCCESS_KEY, JSON.stringify(patterns)); } catch {}
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT GAPS — what Starky doesn't know
// ═══════════════════════════════════════════════════════════════════════════════

const GAPS_KEY = 'nw_content_gaps';

function getContentGaps() {
  try { return JSON.parse(localStorage.getItem(GAPS_KEY) || '[]'); } catch { return []; }
}

function logContentGaps(record) {
  if (!record.questions_starky_couldnt_answer?.length && !record.topics_not_in_kb?.length) return;

  const gaps = getContentGaps();
  const newGaps = [
    ...(record.questions_starky_couldnt_answer || []).map(q => ({
      type: 'unanswered_question',
      content: q,
      curriculum: record.curriculum,
      grade: record.grade,
      subject: record.subject,
      date: new Date().toISOString(),
    })),
    ...(record.topics_not_in_kb || []).map(t => ({
      type: 'missing_topic',
      content: t,
      curriculum: record.curriculum,
      grade: record.grade,
      subject: record.subject,
      date: new Date().toISOString(),
    })),
  ];

  gaps.push(...newGaps);
  if (gaps.length > 500) gaps.splice(0, gaps.length - 500);
  try { localStorage.setItem(GAPS_KEY, JSON.stringify(gaps)); } catch {}
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGING-SPECIFIC LEARNING
// ═══════════════════════════════════════════════════════════════════════════════

export const SINGING_LEARNING = {
  track: [
    'Which warm-up exercises produced the most improvement?',
    'Which genre is most popular by age/country/curriculum?',
    'Which SEN condition responds best to which singing approach?',
    'Which songs get the most students to complete the programme?',
  ],
  output: 'SINGING_EFFECTIVENESS_MAP — Starky automatically recommends warm-ups that work best for each student profile.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE ONBOARDING LEARNING
// ═══════════════════════════════════════════════════════════════════════════════

export const ONBOARDING_LEARNING = {
  track: 'Natural language parents use to describe SEN conditions',
  action: 'Add new phrases to condition detection vocabulary',
  correction: 'If Starky misidentified a condition (parent corrected) → log phrase that caused confusion → add to training examples',
  example: 'Parent said "he\'s in his own world" → Starky didn\'t detect autism → Add "in his own world" to autism signal phrases',
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRIVACY RULES
// ═══════════════════════════════════════════════════════════════════════════════

export const PRIVACY_RULES = [
  'No personally identifiable information stored in learning records',
  'All learning is from aggregate patterns, not individual students',
  'Session records anonymised within 24 hours',
  'Parents can opt out of contributing to platform learning',
  'Never use voice recordings for training — only text transcripts and metadata',
];

// ═══════════════════════════════════════════════════════════════════════════════
// CRON SCHEDULE
// ═══════════════════════════════════════════════════════════════════════════════

export const CRON_SCHEDULE = {
  daily: {
    time: '3am PKT',
    tasks: [
      'Aggregate session records from last 24 hours',
      'Update STRUGGLE_MAP',
      'Flag critical content gaps (5+ same question unanswered)',
      'Generate parent progress summaries',
    ],
  },
  weekly: {
    time: 'Sunday 3am PKT',
    tasks: [
      'Full content gap analysis',
      'Success pattern extraction',
      'Knowledge base enhancement generation',
      'Weekly learning report to Khurram',
      'CLAUDE.md update with new learnings',
    ],
  },
  monthly: {
    tasks: [
      'Full platform intelligence audit',
      'Which KBs have grown most?',
      'Which student segments improved most?',
      'What is Starky\'s weakest subject? → Priority for next month',
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOUND EFFECT — the moat
// ═══════════════════════════════════════════════════════════════════════════════

export const COMPOUND_EFFECT = {
  session_1: 'Starky knows what it knows.',
  after_1000: 'Starky has filled 50 content gaps.',
  after_10000: 'Starky has mapped every struggle point for every curriculum, grade, condition, and country.',
  after_100000: 'Starky is the most knowledgeable educational AI tutor in the world — because it learned from every student who ever used it.',
  principle: 'Every competitor starts from zero. NewWorldEdu compounds. Forever.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Log a complete session learning record.
 * Called at the end of every session — student, parent, SEN, singing, all.
 */
export function logSession(record) {
  if (!record) return;

  // Ensure record has required fields
  const full = { ...SESSION_RECORD_SCHEMA, ...record, timestamp: new Date().toISOString() };
  if (!full.session_id) full.session_id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Estimate learning outcome if not provided
  if (!full.learning_outcome_estimated) {
    const positive = (full.student_confirmed_understanding ? 2 : 0)
      + (full.session_extended ? 2 : 0)
      + ((full.confidence_delta || 0) > 0 ? 1 : 0)
      + (full.student_questions_asked > 2 ? 1 : 0);
    const negative = (full.session_abandoned_early ? 3 : 0)
      + (full.student_expressed_confusion ? 1 : 0)
      + ((full.concepts_repeated?.length || 0) > 2 ? 1 : 0);
    full.learning_outcome_estimated = positive >= 4 ? 'high' : negative >= 3 ? 'low' : 'medium';
  }

  // Run all five learning loops
  updateStruggleMap(full);
  logSuccessPattern(full);
  logContentGaps(full);

  // Store record locally (anonymised — no name/email)
  try {
    const records = JSON.parse(localStorage.getItem('nw_session_records') || '[]');
    records.push({
      id: full.session_id,
      ts: full.timestamp,
      curriculum: full.curriculum,
      grade: full.grade,
      subject: full.subject,
      outcome: full.learning_outcome_estimated,
      gaps: full.questions_starky_couldnt_answer?.length || 0,
      repeats: full.concepts_repeated?.length || 0,
      extended: full.session_extended,
      abandoned: full.session_abandoned_early,
    });
    if (records.length > 100) records.splice(0, records.length - 100);
    localStorage.setItem('nw_session_records', JSON.stringify(records));
  } catch {}

  // Try to send to Supabase via API (non-blocking)
  try {
    fetch('/api/platform/log-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: full.session_id,
        timestamp: full.timestamp,
        country: full.country,
        curriculum: full.curriculum,
        grade: full.grade,
        subject: full.subject,
        outcome: full.learning_outcome_estimated,
        gaps_count: full.questions_starky_couldnt_answer?.length || 0,
        repeat_count: full.concepts_repeated?.length || 0,
        extended: full.session_extended,
        abandoned: full.session_abandoned_early,
        voice_delta: full.confidence_delta,
        conditions: full.conditions,
      }),
    }).catch(() => {});
  } catch {}

  return full;
}

/**
 * Generate KB enhancement suggestion from accumulated gaps.
 * Used by weekly cron to identify what Starky needs to learn.
 */
export function generateKBEnhancement() {
  const gaps = getContentGaps();
  if (gaps.length === 0) return null;

  // Group by subject + curriculum
  const grouped = {};
  for (const gap of gaps) {
    const key = `${gap.curriculum}:${gap.subject}`;
    if (!grouped[key]) grouped[key] = { count: 0, questions: [], curriculum: gap.curriculum, subject: gap.subject, grades: new Set() };
    grouped[key].count += 1;
    grouped[key].questions.push(gap.content);
    if (gap.grade) grouped[key].grades.add(gap.grade);
  }

  // Sort by frequency
  const ranked = Object.values(grouped).sort((a, b) => b.count - a.count);

  // Return top gaps that need enhancement (5+ instances)
  const critical = ranked.filter(g => g.count >= 5);
  const important = ranked.filter(g => g.count >= 3 && g.count < 5);

  return {
    critical: critical.map(g => ({
      curriculum: g.curriculum,
      subject: g.subject,
      frequency: g.count,
      grades: [...g.grades],
      sampleQuestions: g.questions.slice(0, 5),
    })),
    important: important.map(g => ({
      curriculum: g.curriculum,
      subject: g.subject,
      frequency: g.count,
      grades: [...g.grades],
      sampleQuestions: g.questions.slice(0, 3),
    })),
    totalGaps: gaps.length,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generate weekly learning report for Khurram.
 */
export function weeklyLearningReport() {
  const gaps = getContentGaps();
  const patterns = getSuccessPatterns();
  const struggles = getStruggleMap();
  const enhancement = generateKBEnhancement();

  // Count sessions this week
  let sessionsThisWeek = 0;
  try {
    const records = JSON.parse(localStorage.getItem('nw_session_records') || '[]');
    const weekAgo = Date.now() - 7 * 86400000;
    sessionsThisWeek = records.filter(r => new Date(r.ts).getTime() > weekAgo).length;
  } catch {}

  // Top struggle areas
  const struggleEntries = Object.entries(struggles)
    .sort((a, b) => b[1].confusion_count - a[1].confusion_count)
    .slice(0, 5);

  return {
    period: 'Last 7 days',
    sessionsAnalysed: sessionsThisWeek,
    contentGapsFound: gaps.length,
    criticalGaps: enhancement?.critical?.length || 0,
    successPatternsLogged: patterns.length,
    topStruggleAreas: struggleEntries.map(([key, val]) => ({
      area: key,
      confusionCount: val.confusion_count,
      hardestTopics: Object.entries(val.topics).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t, c]) => `${t} (${c}x)`),
    })),
    kbEnhancementNeeded: enhancement?.critical || [],
    generatedAt: new Date().toISOString(),
  };
}
