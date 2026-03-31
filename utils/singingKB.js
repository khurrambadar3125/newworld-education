/**
 * utils/singingKB.js
 * Starky's Complete Singing Knowledge Base
 *
 * Every child wants to sing. Most are afraid to try.
 * Starky removes that fear completely.
 * No judgement. No comparison. No failure.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// WHY SINGING MATTERS — evidence-based
// ═══════════════════════════════════════════════════════════════════════════════

export const SINGING_BENEFITS = {
  academic: [
    'Singing strengthens phonological awareness — directly improves reading',
    'Breath control from singing improves stamina and focus',
    'Learning lyrics strengthens memory and vocabulary',
    'Rhythm training improves mathematical understanding of patterns',
    'Performing builds public speaking confidence',
  ],
  sen: {
    autism: 'Music engages neural pathways that social language doesn\'t. Rhythm provides the predictability autistic students crave. Singing together is social interaction without social pressure. Non-verbal autistic children often sing before they speak. Music therapy improves social communication in 71% of autistic children.',
    downSyndrome: 'Singing exercises oral motor muscles — directly improves speech clarity. Rhythm helps with word sequencing and sentence formation. Deep breathing from singing strengthens respiratory muscles. Music makes speech therapy feel like play.',
    adhd: 'Rhythmic singing provides the predictable structure ADHD brains need. Active music-making builds attentional skills. Call-and-response keeps engagement high. Singing releases dopamine — the neurotransmitter ADHD brains lack.',
    deaf: 'Rhythm and vibration are felt, not just heard. Hand signs + song = powerful language reinforcement. Bone conduction allows deaf students to feel music. Singing improves lipreading by matching mouth shapes to sounds.',
    cerebralPalsy: 'Controlled breathing from singing improves breath support for speech. Singing at own pace removes pressure of conversation timing.',
    selectiveMutism: 'Many selectively mute children will sing when they won\'t speak. Singing is a "safer" form of voice use — less social pressure. Success in singing builds confidence to use voice in other contexts.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SINGING CURRICULUM — 4 levels by age
// ═══════════════════════════════════════════════════════════════════════════════

export const SINGING_CURRICULUM = {
  level1: {
    name: 'Little Voices',
    ageRange: '4-8',
    weeks: [
      { week: 1, focus: 'Finding your singing voice — different from speaking voice', songs: ['Twinkle Twinkle', 'Row Your Boat', 'Head Shoulders Knees and Toes'] },
      { week: 2, focus: 'Singing high and low — siren sounds, animal noises', songs: ['Old MacDonald', 'Incy Wincy Spider'] },
      { week: 3, focus: 'Breathing like a singer — balloon breath, candle breath', songs: ['Wheels on the Bus', 'If You\'re Happy and You Know It'] },
      { week: 4, focus: 'Singing with expression — happy, sad, silly voices', songs: ['Baa Baa Black Sheep', 'London Bridge'] },
    ],
    approach: 'Starky teaches through play, never through correction. Every attempt is celebrated.',
  },
  level2: {
    name: 'Growing Voices',
    ageRange: '8-12',
    weeks: [
      { week: 1, focus: 'Posture and breath — the singer\'s body', exercises: ['Stand tall', 'Shoulder rolls', 'Deep belly breaths'] },
      { week: 2, focus: 'Warm-ups: lip trills, humming, scales', exercises: ['Lip trill slides', 'Hum on mah-may-mee-moh-moo', 'Simple 5-note scales'] },
      { week: 3, focus: 'Pitch accuracy — matching notes', exercises: ['Echo singing', 'Pitch matching games', 'Simple intervals'] },
      { week: 4, focus: 'Your first song — complete performance', songs: ['Age-appropriate pop', 'Nasheeds', 'Simple Bollywood'] },
    ],
    approach: 'Build foundation skills. Introduce musical vocabulary gently. One song fully learned.',
  },
  level3: {
    name: 'Finding Your Voice',
    ageRange: '12-16',
    weeks: [
      { week: 1, focus: 'Voice type discovery — soprano, alto, tenor, baritone' },
      { week: 2, focus: 'Chest voice vs head voice vs mix — what each feels like' },
      { week: 3, focus: 'Vibrato — what it is, how it develops naturally (never forced)' },
      { week: 4, focus: 'Song interpretation — meaning and emotion in performance' },
      { week: 5, focus: 'Vocal health — protecting your instrument, hydration, rest' },
      { week: 6, focus: 'Performance — recording, reviewing, self-evaluation' },
    ],
    approach: 'Self-discovery. The voice is changing — honour that. For teenage boys: voice breaks are normal, never mocked.',
  },
  level4: {
    name: 'Superstar Track',
    ageRange: '14+',
    modules: [
      'Advanced breath support and resonance',
      'Register transitions — chest to head seamlessly',
      'Genre-specific technique: classical, pop, qawwali, nasheed, Bollywood, Arabic maqam',
      'Performance skills: stage presence, mic technique, recording',
      'Audition preparation: GCSE Music, IB Music, conservatory',
    ],
    approach: 'Professional-level training. Genre specialisation. Audition readiness.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// GENRE KNOWLEDGE
// ═══════════════════════════════════════════════════════════════════════════════

export const GENRE_KNOWLEDGE = {
  bollywood: {
    name: 'Bollywood / Hindi Film Music',
    songs: [
      { title: 'Lag Ja Gale', artist: 'Lata Mangeshkar', teaches: 'legato, breath control, sustained phrasing' },
      { title: 'Tum Hi Ho', artist: 'Arijit Singh', teaches: 'emotional phrasing, contemporary technique, dynamic range' },
      { title: 'Kal Ho Na Ho', artist: 'Sonu Nigam', teaches: 'breath control, wide range, expression' },
      { title: 'Abhi Na Jao', artist: 'Asha Bhosle', teaches: 'ornaments (gamak), expression, conversational singing' },
    ],
    technique: 'Indian classical base, ornaments (gamak, meend), nasal resonance quality, raga awareness. The voice should sound like it is speaking through melody.',
  },
  qawwali: {
    name: 'Qawwali (Sufi devotional)',
    songs: [
      { title: 'Dam Mast Qalandar', artist: 'Nusrat Fateh Ali Khan', teaches: 'chest voice power, spiritual expression, build and release' },
      { title: 'Allah Hoo', artist: 'Nusrat Fateh Ali Khan', teaches: 'breath projection, repetition as trance, group dynamics' },
    ],
    technique: 'Powerful chest voice, call-and-response, repetitive build, spiritual connection to text. The voice is an instrument of devotion.',
  },
  nasheed: {
    name: 'Nasheeds (Islamic devotional)',
    songs: [
      { title: 'Tala al Badru Alayna', artist: 'Traditional', teaches: 'simple melody, group singing, historical significance (Prophet\'s arrival in Madinah)' },
      { title: 'Mawlaya', artist: 'Maher Zain', teaches: 'accessible contemporary nasheed, modern production, clear diction' },
    ],
    technique: 'Clear Arabic pronunciation, spiritual intention (niyyah), simple melodies with feeling. Many nasheeds are a cappella — voice alone carries everything.',
  },
  arabicMaqam: {
    name: 'Arabic Maqam Music',
    maqamat: [
      { name: 'Maqam Rast', desc: 'Like major scale but with slightly flat third. The "mother maqam". Bright, joyful.' },
      { name: 'Maqam Bayati', desc: 'Most common Arabic maqam. Emotional, versatile. Quarter-tone on second degree.' },
      { name: 'Maqam Hijaz', desc: 'Distinctive "Middle Eastern" sound. Augmented second interval. Dramatic, passionate.' },
    ],
    technique: 'Quarter tones (between Western semitones) — Starky NEVER marks these as "out of tune". Ornaments: morshed, layali. Arabic vocal tradition values emotion and ornamentation over pure pitch perfection.',
  },
  westernPop: {
    name: 'Western Pop / Contemporary',
    techniques: [
      { style: 'Breathy intimacy', artist: 'Billie Eilish', desc: 'Soft, close-mic technique. Emotion through restraint.' },
      { style: 'Chest voice power', artist: 'Adele', desc: 'Full chest voice, strong mix, emotional delivery.' },
      { style: 'Falsetto and mix', artist: 'Coldplay / Harry Styles', desc: 'Floating high notes, gentle transitions.' },
    ],
    technique: 'Mixed voice is the foundation of modern pop. Breath support + emotional connection. Less about perfection, more about authenticity.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SEN SINGING ADAPTATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const SEN_SINGING_ADAPTATIONS = {
  autism: {
    approach: 'Structured, predictable, no surprises. Same warm-up every time.',
    startWith: ['Old MacDonald (predictable pattern, animal sounds)', 'Wheels on the Bus (actions match words)', 'Songs with clear repetitive structure'],
    starkyStyle: 'We always start with the same warm-up song. That\'s our signal that singing time has begun.',
    never: 'Unexpected changes, open-ended "sing whatever you want"',
    always: 'Same structure, same opening, celebrate every attempt',
  },
  downSyndrome: {
    approach: 'Songs that target specific sounds. Coordinate with speech therapy targets.',
    startWith: ['Songs with many target sounds', 'Slow tempo, clear diction', 'Hand gestures matching lyrics'],
    starkyStyle: 'Let\'s sing it together — you copy what I say. When we sing this word, our mouth makes this shape...',
  },
  adhd: {
    approach: 'Call and response, short bursts, high energy, beat-based.',
    startWith: ['Clap the beat first, then add words', 'Call-and-response songs', 'Songs with physical movement: stamp, clap, sway'],
    starkyStyle: 'Switch songs every 3-4 minutes — variety sustains engagement.',
  },
  deaf: {
    approach: 'Rhythm is the foundation, not pitch. Feel the beat through vibration.',
    startWith: ['Hands on speaker/table to feel vibration', 'Hand signs for lyrics (BSL/ASL song)', 'Humming felt in skull and chest (bone conduction)'],
    starkyStyle: 'Celebrate rhythm accuracy before pitch accuracy. Evelyn Glennie is deaf and the world\'s greatest percussionist — inspire with her story.',
  },
  anxiety: {
    approach: 'Singing alone with Starky before any performance. Start with humming.',
    progression: ['Humming — no words, just sound', 'Vocalize on neutral syllables: "mah", "la", "mmm"', 'Single words in song', 'Full phrases', 'Complete song'],
    starkyStyle: 'Your voice belongs to you. We only use it when you\'re ready. Never rush. Never record without permission. Never share.',
  },
  cerebralPalsy: {
    approach: 'Adapted to whatever vocal production is possible.',
    startWith: ['Short phrases with long rests for breath recovery', 'Any sustained vocalization is celebrated', 'Focus on expression and intention over accuracy'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SINGING LESSON STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════

export const LESSON_STRUCTURE = {
  welcome: { duration: '30 seconds', script: 'Welcome to your singing session, {name}! Today we\'re going to {goal}. Ready? Let\'s start with your warm-up.' },
  warmUp: {
    duration: '3-5 minutes',
    exercises: [
      'Lip trills: "Let\'s warm up those lips — brrrrr on a comfortable note."',
      'Humming: "Hum gently — feel it vibrate in your lips and nose."',
      'Sirens: "Slide from low to high like a siren — no strain, just glide."',
      'Vowels: "mah-may-mee-moh-moo on a comfortable pitch."',
    ],
  },
  techniqueFocus: { duration: '5 minutes', rule: 'One skill per session. Only one. Exercise → practice → Starky feedback → try again.' },
  songWork: { duration: '10 minutes', method: 'Line by line. Never the whole song at once. Listen → model → student sings → positive feedback → refine one thing.' },
  celebration: { duration: '1 minute', rule: 'Always end on a success. Record a 30-second clip if student agrees. Compare to last session → evidence of growth.' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// UAE SUMMER SINGING TRACK
// ═══════════════════════════════════════════════════════════════════════════════

export const UAE_SINGING_SUMMER_TRACK = {
  name: 'Summer Singing Programme',
  dates: 'July 3 → August 26, 2026',
  duration: '54 days, one session per day',
  weeks: [
    { weeks: '1-2', focus: 'Finding Your Voice', content: 'Voice type discovery, basic warm-up routine, first song selected by student' },
    { weeks: '3-4', focus: 'Building the Foundation', content: 'Breath control exercises, pitch accuracy work, learning one verse of chosen song' },
    { weeks: '5-6', focus: 'Growing Confidence', content: 'Complete song performance, record and review, start second song' },
    { weeks: '7-8', focus: 'Summer Performance', content: 'Polish chosen songs, self-evaluation (compare Week 1 to Week 8), earn Summer Singing Champion badge' },
  ],
  badges: [
    { emoji: '🎤', name: 'First Note', desc: 'First singing session complete' },
    { emoji: '🎵', name: 'Warm-Up Warrior', desc: '5 sessions of warm-up' },
    { emoji: '🌟', name: 'Pitch Perfect', desc: 'First pitch accuracy milestone' },
    { emoji: '🎼', name: 'Song Complete', desc: 'First full song performed' },
    { emoji: '🏆', name: 'Summer Singer', desc: '20 sessions complete' },
    { emoji: '🌍', name: 'World Singer', desc: 'Sang in 2+ languages' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// STARKY'S CORE SINGING PHILOSOPHY
// ═══════════════════════════════════════════════════════════════════════════════

export const SINGING_PHILOSOPHY = `Every voice is beautiful. Every voice can improve. The goal is not to sound like Atif Aslam or Umm Kulthum. The goal is to sound more like the best version of yourself.`;

export const SINGING_WELLBEING = {
  emotional: 'Singing releases oxytocin (bonding) and reduces cortisol (stress). For anxious students: gentle singing calms. For excited students: channel energy into a big song. For sad students: never force — "Would you like to sing, or just talk today?"',
  identity: 'A Pakistani student who can sing qawwali has a superpower. A UAE student who can perform a nasheed with proper Arabic pronunciation has cultural pride. A British curriculum student who can sing for GCSE Music has an academic advantage. An autistic student who sings has found a voice that works differently.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// SELF-ASSESSMENT DIAGNOSTIC
// ═══════════════════════════════════════════════════════════════════════════════

export const SINGING_DIAGNOSTIC = {
  questions: [
    'When someone plays a note on a piano or keyboard — can you match it with your voice?',
    'Do you run out of breath in the middle of a phrase when singing?',
    'Does your voice crack or break when you go higher?',
    'Has anyone ever told you, unprompted, that you have a nice voice?',
    'When you speak — would you say your voice is deep, medium, or high?',
    'Have you ever had any singing training before?',
  ],
  interpretation: {
    pitchMatching: 'Can match → good ear. Cannot → ear training needed first.',
    breathControl: 'Runs out → breath support exercises before anything else.',
    registerBreaks: 'Cracks on high notes → work on smooth register transitions.',
    naturalTalent: 'Compliments received → confidence boost. None → build from scratch, no problem.',
    voiceType: 'Deep → likely baritone/contralto. Medium → likely tenor/mezzo. High → likely soprano/treble.',
    experience: 'Trained → build on foundation. Untrained → start from basics, no assumptions.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if message is about singing
 */
export function isSingingTopic(message) {
  if (!message) return false;
  const lower = message.toLowerCase();
  const triggers = [
    'sing', 'singing', 'song', 'voice training', 'vocal', 'pitch',
    'learn to sing', 'teach me to sing', 'music lesson', 'warm up voice',
    'nasheed', 'qawwali', 'bollywood song', 'maqam',
    'my voice', 'voice type', 'soprano', 'alto', 'tenor', 'baritone',
    'breath control singing', 'vibrato', 'head voice', 'chest voice',
    'gcse music', 'ib music singing', 'singing evaluation',
  ];
  return triggers.some(t => lower.includes(t));
}

/**
 * Get singing prompt for Starky
 */
export function getSingingPrompt(age, condition) {
  let prompt = `\nSINGING MODE — Starky as patient, joyful singing tutor.\n`;
  prompt += `\nPhilosophy: ${SINGING_PHILOSOPHY}`;

  // Age-appropriate level
  const level = age <= 8 ? SINGING_CURRICULUM.level1
    : age <= 12 ? SINGING_CURRICULUM.level2
    : age <= 16 ? SINGING_CURRICULUM.level3
    : SINGING_CURRICULUM.level4;
  prompt += `\nLevel: ${level.name} (age ${level.ageRange}). ${level.approach}`;

  // SEN adaptation
  if (condition) {
    const adaptation = SEN_SINGING_ADAPTATIONS[condition];
    if (adaptation) {
      prompt += `\n\nSEN SINGING ADAPTATION (${condition}): ${adaptation.approach}`;
      prompt += `\nStart with: ${adaptation.startWith.join('. ')}.`;
      if (adaptation.starkyStyle) prompt += `\nStyle: ${adaptation.starkyStyle}`;
      if (adaptation.never) prompt += `\nNever: ${adaptation.never}`;
    }
  }

  // Lesson structure
  prompt += `\n\nSESSION STRUCTURE: Welcome (30s) → Warm-up (3-5min) → Technique: ONE skill only (5min) → Song work line by line (10min) → Celebration (1min).`;

  // Evaluation rules
  prompt += `\n\nEVALUATION RULES: ALWAYS start positive. Limit corrections to ONE thing per session. Never say "out of tune" — say "that note is a little flat, try lifting it." Never say "your voice isn't good." For children: celebrate courage. For teenage boys: voice changes are NEVER mocked.`;
  prompt += `\nEvaluation order: 1. What went well 2. One thing to improve 3. Concrete exercise 4. Encouragement.`;

  // Genre awareness
  prompt += `\n\nGENRE AWARENESS: Bollywood (ornaments, nasal quality), Qawwali (chest power, spiritual expression), Nasheeds (Arabic pronunciation, devotion), Arabic Maqam (quarter tones are NOT out of tune), Western Pop (mixed voice, authenticity). Match student's cultural background.`;

  prompt += `\n\n${SINGING_WELLBEING.emotional}`;

  // Progress evaluation system
  prompt += `\n\nPROGRESS SYSTEM: 5 checkpoints over 8 weeks. Baseline (Day 1) → Week 2 → Week 4 (halfway) → Week 6 → Final (Week 8). Every session starts with a 60-second mini-eval. Compare to baseline every time. Level gates: must demonstrate skills before advancing. NEVER say "failed" — say "almost there, one more week on [skill]". Parent reports every 2 weeks.`;

  return prompt;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGING PROGRESS EVALUATION SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

export const CHECKPOINT_SCHEMA = {
  checkpoint: 0,
  date: null,
  pitch_accuracy: 0,     // 0-10
  breath_control: 0,     // 0-10
  tone_quality: 0,       // 0-10
  rhythm: 0,             // 0-10
  confidence: 0,         // 0-10
  overall: 0,            // 0-10
  voice_type_estimate: null, // soprano/mezzo/alto/tenor/baritone/bass/treble
  biggest_strength: null,
  biggest_opportunity: null,
  starky_notes: null,
  audio_duration: 0,
  transcript: null,
};

export const EVALUATION_CHECKPOINTS = {
  baseline: {
    checkpoint: 0,
    name: 'Baseline',
    timing: 'Day 1, before any teaching',
    task: 'Record 30-60 second clip: a song they know, OR scales (mah-may-mee-moh-moo up and down), OR sustain any note for 5 seconds.',
    feedbackFormat: 'Thank you for singing for me, {name}. Here\'s what I heard: Your biggest strength right now is {strength}. The area with the most room to grow is {opportunity}. Over the next 8 weeks, that\'s exactly what we\'re going to work on. Let\'s start.',
  },
  week2: {
    checkpoint: 1,
    name: 'Week 2 Check',
    timing: 'After breath and warm-up work',
    task: 'Same clip type as baseline.',
    compareTo: 'baseline',
    improvedFeedback: 'Your {area} has improved — {specific detail, e.g. "you held that phrase 2 seconds longer than week 1"}.',
    noChangeFeedback: 'That\'s completely normal — these things take time. Here\'s what to focus on this week...',
  },
  halfway: {
    checkpoint: 2,
    name: 'Halfway',
    timing: 'Week 4',
    task: 'Perform the song they\'ve been working on.',
    evaluates: ['Pitch accuracy on each phrase', 'Breath management across the whole song', 'Diction and clarity', 'Expression and commitment'],
    compareTo: 'baseline + checkpoint 1',
    format: 'Report card: simple, encouraging, specific.',
  },
  week6: {
    checkpoint: 3,
    name: 'Week 6 Check',
    timing: 'Week 6',
    task: 'Same song, refined.',
    action: 'Identify what improved, what still needs work. Adjust remaining 2 weeks to target weak areas.',
  },
  final: {
    checkpoint: 4,
    name: 'Final — Summer Singing Report',
    timing: 'Week 8, Day 54',
    task: 'Record same type of clip as Day 1 PLUS their chosen song.',
    reportFormat: `{name}'s Summer Singing Journey — July to August 2026

Day 1 vs Day 54:
- Pitch accuracy: {baseline}/10 → {final}/10 (+{diff} points)
- Breath control: {baseline}/10 → {final}/10 (+{diff} points)
- Tone quality: {baseline}/10 → {final}/10 (+{diff} points)
- Rhythm: {baseline}/10 → {final}/10 (+{diff} points)
- Overall: {baseline}/10 → {final}/10 (+{diff} points)

What you mastered this summer:
{skills_list}

What to work on next:
{next_steps}

Songs performed:
{songs_list}

Starky says:
{personal_message}`,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL GATE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

export const LEVEL_GATES = {
  level1to2: {
    name: 'Level 1 → Level 2',
    requirements: [
      'Can sustain a note for 3+ seconds without major pitch drift',
      'Can match at least one note Starky demonstrates',
      'Has completed all 4 week-1 sessions',
      'Knows one complete song (even if imperfect)',
    ],
  },
  level2to3: {
    name: 'Level 2 → Level 3',
    requirements: [
      'Pitch accuracy at least 6/10 on a simple scale',
      'Breath control — no mid-phrase gasping on short phrases',
      'Can sing a full verse of their chosen song',
      'Voice type confirmed',
    ],
  },
  level3to4: {
    name: 'Level 3 → Level 4',
    requirements: [
      'Chest voice and head voice both accessible',
      'Pitch accuracy 7/10+',
      'Can perform a complete song with expression',
      'Has recorded and reviewed at least 3 clips',
    ],
  },
  failResponse: 'You\'re almost there. Let\'s do one more week on {skill} and then we\'ll move forward. Here\'s what to practise...',
  neverSay: ['failed', 'not ready', 'not good enough', 'can\'t move on'],
};

// ═══════════════════════════════════════════════════════════════════════════════
// WEEKLY MICRO-CHECKS
// ═══════════════════════════════════════════════════════════════════════════════

export const MICRO_CHECK = {
  duration: '60 seconds at the start of every session',
  method: 'Before we start — sing this phrase for me: [simple phrase]. Starky evaluates vs last session.',
  trends: {
    improving: 'I can hear the difference from last time. Keep doing what you\'re doing.',
    plateauing: 'You\'re consistent — let\'s try a new exercise to push through this.',
    regressing: 'Your voice sounds a little different today. Have you been resting it? Let\'s do a gentle session today and come back stronger tomorrow.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PARENT PROGRESS REPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export const PARENT_REPORT_FORMAT = {
  frequency: 'Every 2 weeks',
  template: `{child_name}'s Singing Progress — Week {week}

This week {name} worked on: {skills}
What we noticed: {observations}
What to encourage at home: {home_activity}
How they're doing overall: {honest_sentence}

Next 2 weeks we'll focus on: {preview}`,
  storage: 'Supabase if logged in, localStorage for guests.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// SINGING PROFILE — stored per student
// ═══════════════════════════════════════════════════════════════════════════════

export const SINGING_PROFILE_SCHEMA = {
  singing_programme_enrolled: false,
  singing_start_date: null,
  singing_genre: null,          // bollywood/qawwali/nasheed/arabic/western/mixed
  singing_checkpoints: [],      // [{ checkpoint, scores, date }]
  current_level: 1,             // 1-4
  songs_completed: [],          // ['song name']
  badges_earned: [],            // ['badge id']
  summer_report_generated: false,
  weekly_micro_checks: [],      // [{ date, trend, score }]
  parent_reports_sent: [],      // [{ week, date }]
};

const SING_PROFILE_KEY = 'nw_singing_profile';

export function loadSingingProfile() {
  try { return JSON.parse(localStorage.getItem(SING_PROFILE_KEY) || 'null'); } catch { return null; }
}

export function saveSingingProfile(profile) {
  try { localStorage.setItem(SING_PROFILE_KEY, JSON.stringify(profile)); } catch {}
}

/**
 * Record a checkpoint evaluation
 */
export function recordCheckpoint(profile, checkpointNum, scores) {
  const p = profile || { ...SINGING_PROFILE_SCHEMA };
  if (!p.singing_programme_enrolled) {
    p.singing_programme_enrolled = true;
    p.singing_start_date = new Date().toISOString();
  }
  p.singing_checkpoints.push({
    checkpoint: checkpointNum,
    scores: { ...scores },
    date: new Date().toISOString(),
  });
  saveSingingProfile(p);
  return p;
}

/**
 * Record a weekly micro-check
 */
export function recordMicroCheck(profile, trend, score) {
  const p = profile || { ...SINGING_PROFILE_SCHEMA };
  p.weekly_micro_checks.push({ date: new Date().toISOString(), trend, score });
  if (p.weekly_micro_checks.length > 20) p.weekly_micro_checks = p.weekly_micro_checks.slice(-20);
  saveSingingProfile(p);
  return p;
}

/**
 * Check if student can advance to next level
 */
export function checkLevelGate(currentLevel, profile) {
  const gates = { 1: LEVEL_GATES.level1to2, 2: LEVEL_GATES.level2to3, 3: LEVEL_GATES.level3to4 };
  const gate = gates[currentLevel];
  if (!gate) return { canAdvance: true, requirements: [] };

  // Simple check: latest checkpoint scores must meet thresholds
  const latest = profile?.singing_checkpoints?.slice(-1)[0]?.scores;
  if (!latest) return { canAdvance: false, requirements: gate.requirements };

  const checks = [];
  if (currentLevel === 1) {
    checks.push(latest.breath_control >= 3);   // sustain 3+ seconds
    checks.push(latest.pitch_accuracy >= 3);    // match at least one note
    checks.push((profile.weekly_micro_checks?.length || 0) >= 4); // 4 sessions
    checks.push((profile.songs_completed?.length || 0) >= 1);     // one song
  } else if (currentLevel === 2) {
    checks.push(latest.pitch_accuracy >= 6);
    checks.push(latest.breath_control >= 5);
    checks.push((profile.songs_completed?.length || 0) >= 1);
    checks.push(!!latest.voice_type_estimate);
  } else if (currentLevel === 3) {
    checks.push(latest.pitch_accuracy >= 7);
    checks.push(latest.tone_quality >= 6);
    checks.push((profile.songs_completed?.length || 0) >= 2);
    checks.push((profile.singing_checkpoints?.length || 0) >= 3);
  }

  const passed = checks.filter(Boolean).length;
  const total = checks.length;
  return {
    canAdvance: passed === total,
    passed,
    total,
    requirements: gate.requirements,
    missing: gate.requirements.filter((_, i) => !checks[i]),
  };
}

/**
 * Generate summer singing report comparing baseline to final
 */
export function generateSummerReport(profile, studentName) {
  if (!profile?.singing_checkpoints?.length) return null;
  const baseline = profile.singing_checkpoints.find(c => c.checkpoint === 0);
  const final = profile.singing_checkpoints.slice(-1)[0];
  if (!baseline || !final) return null;

  const dims = ['pitch_accuracy', 'breath_control', 'tone_quality', 'rhythm', 'confidence'];
  const improvements = dims.map(d => ({
    name: d.replace(/_/g, ' '),
    before: baseline.scores[d] || 0,
    after: final.scores[d] || 0,
    diff: (final.scores[d] || 0) - (baseline.scores[d] || 0),
  }));

  const overallBefore = baseline.scores.overall || 0;
  const overallAfter = final.scores.overall || 0;

  return {
    studentName,
    startDate: profile.singing_start_date,
    endDate: final.date,
    improvements,
    overallBefore,
    overallAfter,
    overallDiff: overallAfter - overallBefore,
    songsCompleted: profile.songs_completed || [],
    badgesEarned: profile.badges_earned || [],
    totalSessions: profile.weekly_micro_checks?.length || 0,
    genre: profile.singing_genre,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// YOUNG LEARNER SINGING PROTOCOL — ages 5-10
// Starky uses this protocol automatically when the student is a young learner
// or in young learner / SEN mode.
// ═══════════════════════════════════════════════════════════════════════════════

export const YOUNG_LEARNER_SONGS = {
  urdu: [
    { title: 'Sohni Dharti', desc: 'Pakistan national children\'s song — simple melody, patriotic, easy words', ageRange: '5-10', difficulty: 1 },
    { title: 'Mast Qalandar (simplified)', desc: 'Repetitive chorus, children love it — simplified version for young voices', ageRange: '7-10', difficulty: 2 },
    { title: 'Aloo Kachalu', desc: 'Classic Urdu nursery rhyme — playful, bouncy, perfect for ages 5-7', ageRange: '5-7', difficulty: 1 },
    { title: 'Billo Rani', desc: 'Simple Urdu children\'s song — gentle melody, easy to learn', ageRange: '5-8', difficulty: 1 },
  ],
  english: [
    { title: 'Twinkle Twinkle Little Star', desc: 'Universal starting point — 5-note range, every child knows it', ageRange: '5-7', difficulty: 1 },
    { title: 'Do Re Mi (from Sound of Music)', desc: 'Teaches solfège naturally through play — builds musical ear', ageRange: '6-10', difficulty: 2 },
    { title: 'You Are My Sunshine', desc: 'Simple, warm, builds confidence — gentle melody, reassuring lyrics', ageRange: '5-9', difficulty: 1 },
    { title: 'Row Row Row Your Boat', desc: 'Good for breath control and round singing — can be done as a canon', ageRange: '5-7', difficulty: 1 },
  ],
  bollywood: [
    { title: 'Lakdi Ki Kathi', desc: 'Simple, rhythmic, great for young children — iconic Bollywood children\'s song', ageRange: '5-8', difficulty: 1 },
    { title: 'Chanda Mama', desc: 'Classic lullaby — gentle range, builds head voice naturally', ageRange: '5-7', difficulty: 1 },
    { title: 'Chhota Baccha Jaan Ke Na', desc: 'Fun, playful, children love the energy — great for movement', ageRange: '5-9', difficulty: 1 },
  ],
  arabic: [
    { title: 'Yalla Yalla', desc: 'Simple, repetitive — good starting song for UAE children', ageRange: '5-8', difficulty: 1 },
    { title: 'Ana Watani', desc: 'Patriotic UAE children\'s song — builds pride and gentle vocal control', ageRange: '6-10', difficulty: 2 },
  ],
};

export const SESSION_STRUCTURE_YOUNG = {
  totalDuration: '10-15 minutes maximum',
  phases: [
    { minutes: '1-2', name: 'Physical + Voice Warm-up', desc: 'Body warm-up then voice warm-up — never skip' },
    { minutes: '3-10', name: 'Song Learning', desc: 'One song only — whole-part-whole method' },
    { minutes: '11-13', name: 'Full Performance Run-through', desc: 'Child sings the whole song — this is THEIR moment' },
    { minutes: '14-15', name: 'Celebration Ending', desc: 'Specific praise, milestone check, parent note' },
  ],
  performanceEnding: {
    beforePerformance: 'Now sing it one more time — this is YOUR performance. I am your audience.',
    afterPerformance: 'That was a real performance. I am so proud of you. Your voice is getting stronger every time.',
  },
};

export const YOUNG_LEARNER_SINGING_PROTOCOL = {

  // ── SECTION 1: Physical Warm-up (always first) ──
  physicalWarmUp: {
    order: 1,
    rule: 'ALWAYS do this before any singing. Never skip.',
    script: `Before we sing, let's wake up our body.
Stand up tall like a tree.
Take a big breath in through your nose...
and blow it out slowly like you're blowing a birthday candle.
Let's do that 3 times.`,
  },

  // ── SECTION 2: Voice Warm-up (always second) ──
  voiceWarmUp: {
    order: 2,
    rule: 'ALWAYS do this after physical warm-up. Never skip.',
    script: `Now let's wake up our voice.
Can you make a siren sound?
Start low... and go high...
Now come back down low again.
Let's do that twice.`,
  },

  // ── SECTION 3: Teaching Method ──
  teachingMethod: {
    order: 3,
    name: 'Whole-Part-Whole',
    steps: [
      'Sing or play the WHOLE song once so the child hears it completely before attempting it',
      'Teach phrase by phrase — line 1 only first, child repeats, Starky praises specifically',
      'Add line 2 — child sings lines 1 and 2 together',
      'Continue adding one line at a time until the whole song is learned',
      'End with a full performance of the WHOLE song',
    ],
    neverDo: [
      'NEVER give the whole song to sing at once',
      'NEVER correct more than one thing per session',
      'NEVER use the word "wrong"',
    ],
    insteadOfWrong: 'Let\'s try that line one more time.',
  },

  // ── SECTION 4: Praise Rules ──
  praiseRules: {
    order: 4,
    rule: 'Specific praise only — never generic.',
    banned: [
      'Good job!',
      'Well done!',
      'Nice!',
      'Great!',
    ],
    goodExamples: [
      'I love how you held that note at the end — that took real breath control.',
      'Your voice sounded so clear on that line.',
      'You remembered all the words — well done.',
      'I noticed you took a big breath before that long phrase — that is exactly what singers do.',
      'You sang that high note without any strain — your voice is really opening up.',
      'The way you sang that softly was beautiful — controlling your volume is a real skill.',
    ],
  },

  // ── SECTION 5: Song Repertoire ──
  songRepertoire: YOUNG_LEARNER_SONGS,

  // ── SECTION 6: Session Structure ──
  sessionStructure: SESSION_STRUCTURE_YOUNG,

  // ── SECTION 7: Parent Report After Session ──
  parentReport: {
    order: 7,
    rule: 'Generate after EVERY young learner singing session.',
    template: `{childName} practiced singing today for {minutes} minutes.
We worked on {songName}.
Today's focus: {focus}.
Improvement noticed: {observation}.
Practice for tomorrow: {suggestion}.`,
    focusOptions: ['breath control', 'pitch', 'memory', 'rhythm', 'expression', 'confidence', 'diction'],
  },

  // ── SECTION 8: Signs of Progress to Celebrate ──
  milestones: {
    order: 8,
    signs: [
      { milestone: 'First time child sings without prompting', celebration: 'You just sang on your own without me asking — that means you WANTED to sing. That is a milestone.' },
      { milestone: 'First time child holds a note for 3+ beats', celebration: 'You just held that note for a long time — that means your breath control is getting stronger. That is a milestone. Remember this moment.' },
      { milestone: 'First time child sings a whole phrase in one breath', celebration: 'You just sang that whole line in one breath — real singers do that. That is a milestone. Remember this moment.' },
      { milestone: 'First time child sings in tune on a familiar song', celebration: 'You just sang every note in the right place — your ear is getting sharper. That is a milestone. Remember this moment.' },
      { milestone: 'First time child performs without stopping', celebration: 'You just sang the whole song from start to finish without stopping — that is a real performance. That is a milestone. Remember this moment.' },
    ],
    milestonePhrase: 'That is a milestone. Remember this moment. You just {achievement} for the first time.',
  },
};
