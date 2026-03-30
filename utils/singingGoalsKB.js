/**
 * utils/singingGoalsKB.js
 * Permanent Singing Goals Knowledge Base — year-round, goal-driven singing.
 *
 * Every student who sings has a goal. Starky finds that goal
 * in the first conversation and builds every session around it — forever.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// GOAL CATEGORIES — 7 paths
// ═══════════════════════════════════════════════════════════════════════════════

export const SINGING_GOALS = {
  fun: {
    id: 'fun',
    name: 'Joyful Path',
    trigger: 'just for fun, I love singing, enjoy singing, sing along, hobby',
    desc: 'No pressure. No grades. No evaluation unless wanted.',
    focus: 'Favourite songs, confidence, expression. Every session is a celebration.',
    evaluation: 'Only if student requests it. Otherwise pure enjoyment.',
  },
  performance: {
    id: 'performance',
    name: 'Performance Path',
    trigger: 'perform, school concert, talent show, annual day, stage, audience',
    desc: 'Working toward a specific live performance.',
    focus: 'Specific song mastery, performance confidence, stage presence.',
    planning: 'Starky works backward from the event date.',
    timeline: 'Ask: "When is your event?" Then reverse-engineer weekly plan.',
  },
  exam: {
    id: 'exam',
    name: 'Exam Path',
    trigger: 'ABRSM, grade 1, grade 2, grade 3, grade 4, grade 5, grade 6, grade 7, grade 8, music exam, Trinity, singing exam',
    desc: 'Preparing for a formal singing examination.',
    focus: 'Exact syllabus requirements, sight-singing, aural tests, repertoire.',
    planning: 'Which grade? Which syllabus? When is the exam? Reverse-engineer from date.',
  },
  career: {
    id: 'career',
    name: 'Career Path',
    trigger: 'professional, YouTube, music career, famous, singer, industry, Coke Studio, recording',
    desc: 'Most ambitious and comprehensive path.',
    focus: 'Genre selection, technique mastery, recording skills, industry knowledge.',
  },
  exploration: {
    id: 'exploration',
    name: 'Exploration Path',
    trigger: 'my parents want me to, I don\'t know, not sure, teacher told me, try it',
    desc: 'Starky\'s job: find the spark within 3 sessions.',
    focus: 'Try different genres, styles, approaches. Pivot when engagement appears.',
  },
  therapeutic: {
    id: 'therapeutic',
    name: 'Therapeutic Path',
    trigger: 'SEN, special needs, autism, communication, non-verbal, speech, therapy',
    desc: 'No performance pressure ever. Voice as communication, confidence, joy.',
    focus: 'Celebrate every sound produced. Report to parent on voice usage improvement.',
  },
  cultural: {
    id: 'cultural',
    name: 'Cultural Path',
    trigger: 'Arabic, Urdu, Quran recitation, Tajweed, qawwali, nasheed, maqam, classical, heritage',
    desc: 'Language-specific vocal training connected to cultural identity.',
    focus: 'Maqam/Tajweed/classical Urdu music theory. Heritage and pride.',
  },
};

/**
 * Extract goal from natural speech
 */
export function extractGoalFromSpeech(transcript) {
  if (!transcript) return null;
  const lower = transcript.toLowerCase();
  for (const [key, goal] of Object.entries(SINGING_GOALS)) {
    const triggers = goal.trigger.split(', ');
    if (triggers.some(t => lower.includes(t))) return goal;
  }
  return SINGING_GOALS.exploration; // default: let's find out together
}

// ═══════════════════════════════════════════════════════════════════════════════
// ABRSM CURRICULUM — full singing grades 1-8
// ═══════════════════════════════════════════════════════════════════════════════

export const ABRSM_CURRICULUM = {
  overview: 'ABRSM Singing Grades 1-8. Common in UAE British/IB/IGCSE schools. Starky knows the complete syllabus.',
  grades: {
    1: {
      songs: '3 songs from ABRSM syllabus lists (A, B, C)',
      sightSinging: 'Short simple melody, stepwise motion, 4 bars',
      aural: 'Clap rhythm back, identify pitch changes (higher/lower), sing from memory',
      marks: 'Pass: 100/150 | Merit: 120 | Distinction: 130',
      starkyTeaches: 'Song preparation, basic sight-singing, rhythm clapping, pitch matching',
    },
    2: { songs: '3 songs — wider range, more dynamics', sightSinging: 'Simple melody with small intervals', aural: 'Clap rhythm, sing back melody, identify dynamics', marks: 'Pass: 100/150 | Merit: 120 | Distinction: 130' },
    3: { songs: '3 songs — increased vocal demand, expression', sightSinging: 'Melody with intervals up to a 5th', aural: 'Identify time signature, sing intervals, describe musical features', marks: 'Pass: 100/150 | Merit: 120 | Distinction: 130' },
    4: { songs: '3 songs — technical requirement increases', sightSinging: 'More complex melody, accidentals', aural: 'Sing from score, identify modulation, describe texture', marks: 'Pass: 100/150 | Merit: 120 | Distinction: 130' },
    5: { songs: '3 songs — significant vocal maturity expected', sightSinging: 'Melody with larger intervals, chromatic notes', aural: 'Sing from score in two parts, identify cadences, detailed analysis', marks: 'Pass: 100/150 | Merit: 120 | Distinction: 130', note: 'Grade 5 Theory required before Grade 6 practical' },
    6: { songs: '3 songs — advanced technique required', marks: 'Pass: 100/150 | Merit: 120 | Distinction: 130' },
    7: { songs: '3 songs — near-professional standard', marks: 'Pass: 100/150 | Merit: 120 | Distinction: 130' },
    8: { songs: '3 songs — diploma-entry level', marks: 'Pass: 100/150 | Merit: 120 | Distinction: 130', note: 'Highest practical grade. DipABRSM is next.' },
  },
  performanceGrades: {
    desc: '4 songs in one continuous performance. Video submission. No supporting tests.',
    note: 'Available remotely — UAE students can submit from home.',
    starkyHelps: 'Repertoire selection, programme building, video recording preparation, continuous performance stamina.',
  },
  musicalTheatre: {
    desc: 'Songs from shows 1920s-present. Skills: character, storytelling, stage presence.',
    note: 'Popular in UAE international schools and drama departments.',
  },
  timelinePlanning: 'Student tells Starky when exam is. Starky reverse-engineers: Weeks 1-4 Song A, Weeks 5-8 Song B, Weeks 9-12 Song C, Weeks 13-14 sight-singing intensive, Weeks 15-16 full run-throughs and aural preparation.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// IB & GCSE SINGING REQUIREMENTS
// ═══════════════════════════════════════════════════════════════════════════════

export const IB_GCSE_SINGING_REQUIREMENTS = {
  ibMusic: {
    name: 'IB Music HL/SL — Vocal Component',
    assessment: {
      internal: 'Recorded performance — solo singing',
      external: 'Written paper on music theory and analysis',
    },
    criteria: [
      'Technical skills: pitch, rhythm, tone quality, breath',
      'Expressive skills: dynamics, phrasing, characterisation',
      'Stylistic awareness: understanding the genre and period',
      'Structural understanding: knowing the form of what they sing',
    ],
    repertoireByPeriod: [
      { period: 'Baroque (1600-1750)', composers: 'Handel, Purcell', focus: 'ornaments, continuo style' },
      { period: 'Classical (1750-1820)', composers: 'Mozart, Haydn', focus: 'clear diction, elegant phrasing' },
      { period: 'Romantic (1820-1900)', composers: 'Schubert, Brahms', focus: 'rich tone, emotional depth' },
      { period: '20th Century/Contemporary', composers: 'wide variety', focus: 'stylistic flexibility required' },
    ],
  },
  gcseMusic: {
    name: 'GCSE Music (Edexcel/AQA/OCR)',
    nea: '30% of GCSE grade',
    solo: 'Solo performance minimum 1 minute',
    ensemble: 'Another piece performed with others',
    starkyPrepares: 'Appropriate repertoire, technical accuracy, recording quality, accompanying track use, grade boundary awareness.',
  },
  aLevelMusic: {
    name: 'A Level Music',
    recital: 'Solo performance recital: 10-12 minutes of music',
    standard: 'High technical standard required',
    starkyHelps: 'Build recital programme, rehearsal schedule, stamina for sustained performance.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// REGIONAL GOALS — Pakistan and UAE
// ═══════════════════════════════════════════════════════════════════════════════

export const REGIONAL_GOALS = {
  pakistan: {
    schoolConcert: {
      name: 'School Concert / Annual Function',
      desc: 'Most common goal for Pakistani students.',
      starkyPrepares: 'One Bollywood/Urdu song polished to performance standard. Weeks before event: run-throughs, feedback, performance tips.',
    },
    tvAspirations: {
      name: 'TV/Radio/Coke Studio Aspirations',
      desc: 'Students dreaming of PTV, ARY Music, Coke Studio.',
      starkyProvides: 'Industry knowledge, how auditions work, what selectors look for, realistic timeline.',
    },
    qawwali: {
      name: 'Qawwali Path',
      desc: 'Chest voice development, spiritual connection to text, call-and-response, breath for long phrases.',
    },
    nasheeds: {
      name: 'Nasheeds for School/Madrasa',
      desc: 'Arabic pronunciation, simple melodies, performance in Islamic context.',
    },
  },
  uae: {
    schoolConcert: {
      name: 'KHDA School Concert / Annual Day',
      desc: 'Students from British, IB, CBSE, American schools all perform.',
      starkyPrepares: 'Culturally appropriate songs, bilingual performance options, professional delivery.',
    },
    nationalDay: {
      name: 'UAE National Day (December 2)',
      desc: 'UAE students perform for National Day.',
      starkyTeaches: 'UAE National Anthem correct pronunciation, appropriate Emirati songs, UAE cultural music context.',
    },
    arabicSinging: {
      name: 'Arabic Singing',
      desc: 'Maqam awareness, quarter tones, ornaments.',
      artists: 'Fairuz, Umm Kulthum, Kadim Al Saher, Nancy Ajram.',
    },
    culturalEvents: {
      name: 'Emirates Festival / Cultural Events',
      desc: 'Stage confidence, microphone use, audience connection.',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SINGING CALENDAR — annual events both countries
// ═══════════════════════════════════════════════════════════════════════════════

export const SINGING_CALENDAR = {
  pakistan: [
    { month: 'March', event: 'Pakistan Day (23 March)', songs: 'National songs, patriotic' },
    { month: 'Ramadan', event: 'Nasheed season', note: 'No music for some students, nasheeds only' },
    { month: 'Eid', event: 'Celebration songs' },
    { month: 'Aug/Sep', event: 'Independence Day + new school year' },
    { month: 'December', event: 'School annual functions', note: 'Performance season — busiest time' },
  ],
  uae: [
    { month: 'September', event: 'New academic year', note: 'New goals set' },
    { month: 'November', event: 'ABRSM exam session + KHDA inspections' },
    { month: 'December 2', event: 'UAE National Day', note: 'Emirati songs, national anthems' },
    { month: 'March', event: 'ABRSM exam session' },
    { month: 'Ramadan', event: 'Nasheeds, reduced music for some' },
    { month: 'June', event: 'ABRSM exam session + end of year concerts' },
    { month: 'July-August', event: 'Summer singing programme' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// GOAL TRACKING PROFILE
// ═══════════════════════════════════════════════════════════════════════════════

export const SINGING_GOAL_PROFILE_SCHEMA = {
  goal_type: null,             // fun/performance/exam/career/therapeutic/cultural/exploration
  goal_description: null,      // student's own words
  goal_target: {
    exam: null,                // "ABRSM Grade 3"
    event: null,               // "School concert March 2027"
    milestone: null,           // "Sing one full song confidently"
  },
  goal_deadline: null,
  genre_preference: [],
  songs_in_progress: [],
  songs_completed: [],
  milestones: [],              // [{ title, achieved_date, detail }]
  scores_history: [],          // [{ date, checkpoint, pitch, breath, tone, rhythm, confidence, overall }]
  total_sessions: 0,
  first_session_date: null,
  last_session_date: null,
};

const GOAL_KEY = 'nw_singing_goals';

export function loadSingingGoals() {
  try { return JSON.parse(localStorage.getItem(GOAL_KEY) || 'null'); } catch { return null; }
}

export function saveSingingGoals(profile) {
  try { localStorage.setItem(GOAL_KEY, JSON.stringify(profile)); } catch {}
}

/**
 * Track goal progress — called after every singing session
 */
export function trackGoalProgress(profile, sessionData) {
  const p = profile || { ...SINGING_GOAL_PROFILE_SCHEMA };
  p.total_sessions += 1;
  p.last_session_date = new Date().toISOString();
  if (!p.first_session_date) p.first_session_date = p.last_session_date;

  // Add score to history if checkpoint data provided
  if (sessionData?.scores) {
    p.scores_history.push({
      date: new Date().toISOString(),
      checkpoint: sessionData.checkpoint || p.total_sessions,
      ...sessionData.scores,
    });
    if (p.scores_history.length > 50) p.scores_history = p.scores_history.slice(-50);
  }

  // Track song completion
  if (sessionData?.songCompleted && !p.songs_completed.includes(sessionData.songCompleted)) {
    p.songs_completed.push(sessionData.songCompleted);
    p.milestones.push({ title: `Song complete: ${sessionData.songCompleted}`, achieved_date: new Date().toISOString() });
  }

  // Auto-milestones
  if (p.total_sessions === 1 && !p.milestones.find(m => m.title === 'First singing session')) {
    p.milestones.push({ title: 'First singing session', achieved_date: p.first_session_date });
  }
  if (p.songs_completed.length === 1 && !p.milestones.find(m => m.title === 'First full song')) {
    p.milestones.push({ title: 'First full song', achieved_date: new Date().toISOString() });
  }
  if (p.total_sessions === 100 && !p.milestones.find(m => m.title === '100 sessions')) {
    p.milestones.push({ title: '100 sessions', achieved_date: new Date().toISOString() });
  }

  saveSingingGoals(p);
  return p;
}

/**
 * Generate singing summary for returning student
 */
export function generateSingingSummary(profile) {
  if (!profile) return null;
  const latest = profile.scores_history?.slice(-1)[0];
  const first = profile.scores_history?.[0];

  return {
    goal: profile.goal_type ? SINGING_GOALS[profile.goal_type]?.name : 'Not set yet',
    goalDescription: profile.goal_description,
    totalSessions: profile.total_sessions,
    songsCompleted: profile.songs_completed.length,
    songsInProgress: profile.songs_in_progress,
    milestones: profile.milestones.length,
    latestOverall: latest?.overall || null,
    firstOverall: first?.overall || null,
    improvement: latest && first ? (latest.overall || 0) - (first.overall || 0) : null,
    deadline: profile.goal_deadline,
    daysUntilDeadline: profile.goal_deadline ? Math.ceil((new Date(profile.goal_deadline) - new Date()) / 86400000) : null,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROMPT GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get singing goals prompt for Starky
 */
export function getSingingGoalsPrompt(profile) {
  let prompt = `\nSINGING GOALS — This student has a permanent singing journey.\n`;

  if (!profile || !profile.goal_type) {
    prompt += `\nGOAL DISCOVERY NEEDED. Ask: "Before we start — tell me one thing. Why do you want to learn to sing? Just speak naturally. There's no wrong answer."`;
    prompt += `\n7 goal paths: Joyful (fun), Performance (concert/event), Exam (ABRSM/Trinity), Career (professional/YouTube), Exploration (unsure), Therapeutic (SEN), Cultural (Arabic/Urdu/heritage).`;
    return prompt;
  }

  const goal = SINGING_GOALS[profile.goal_type];
  const summary = generateSingingSummary(profile);

  prompt += `\nGoal: ${goal?.name || profile.goal_type} — "${profile.goal_description || 'no description yet'}"`;
  prompt += `\nSessions: ${summary.totalSessions}. Songs completed: ${summary.songsCompleted}. Milestones: ${summary.milestones}.`;

  if (summary.latestOverall !== null) {
    prompt += `\nLatest overall: ${summary.latestOverall}/10.`;
    if (summary.improvement !== null && summary.improvement > 0) prompt += ` Improved +${summary.improvement} since first session.`;
  }

  if (summary.deadline) {
    prompt += `\nDeadline: ${profile.goal_deadline}. ${summary.daysUntilDeadline} days remaining.`;
    if (summary.daysUntilDeadline < 14) prompt += ` URGENT — less than 2 weeks!`;
  }

  // Goal-specific guidance
  if (profile.goal_type === 'exam') {
    const grade = profile.goal_target?.exam;
    if (grade) {
      const gradeNum = parseInt(grade.match(/\d/)?.[0]);
      const abrsm = ABRSM_CURRICULUM.grades[gradeNum];
      if (abrsm) {
        prompt += `\nABRSM ${grade}: ${abrsm.songs}. ${abrsm.sightSinging ? 'Sight-singing: ' + abrsm.sightSinging : ''}. Marks: ${abrsm.marks}.`;
      }
    }
    prompt += `\nTimeline: ${ABRSM_CURRICULUM.timelinePlanning}`;
  }

  if (profile.goal_type === 'performance') {
    prompt += `\nPerformance goal: ${profile.goal_target?.event || 'event not specified'}. Work backward from date. Focus: song mastery, confidence, stage presence.`;
  }

  if (profile.goal_type === 'therapeutic') {
    prompt += `\nTherapeutic path: No performance pressure ever. Celebrate every sound. Report to parent on voice usage improvement.`;
  }

  // Returning student greeting
  if (summary.totalSessions > 0) {
    prompt += `\n\nRETURNING STUDENT: Greet by name. Reference last session. Show progress toward goal. "Welcome back! Last session we worked on [X]. Ready to continue toward [goal]?"`;
  }

  return prompt;
}