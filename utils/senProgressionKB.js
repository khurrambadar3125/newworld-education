/**
 * utils/senProgressionKB.js — SEN Progression Framework
 * ─────────────────────────────────────────────────────────────────
 * Encodes UK statutory SEN assessment frameworks:
 * - Engagement Model (5 areas, 4 levels each)
 * - P-Scales 4-8 (early subject-specific attainment)
 * - Pre-Key Stage Standards 1-4 (approaching national curriculum)
 * - Blank's Levels of Questioning (1-4)
 * - Condition-specific progression parameters
 *
 * Used by: Starky's SEN prompt, IEP generation, adaptive engine,
 *          study plan generator, progress dashboard
 *
 * Sources: DfE Engagement Model guidance (2020), QCA P-Scales (2009),
 *          DfE Pre-Key Stage Standards (2020), Blank (1978)
 */

// ── The Complete SEN Progression Ladder ──────────────────────────
// Engagement Model → P-Scales 4-8 → Pre-Key Stage 1-4 → KS1 → KS2 → O Level → A Level
export const PROGRESSION_LADDER = [
  { id: 'engagement', name: 'Engagement Model', description: 'Pre-subject learning. Measuring exploration, realisation, anticipation, persistence, initiation.', ageEquiv: 'Developmental', order: 0 },
  { id: 'p4', name: 'P-Scale 4', description: 'Shows awareness that activities have outcomes.', ageEquiv: '~2-3 years developmental', order: 1 },
  { id: 'p5', name: 'P-Scale 5', description: 'Can produce single elements (single words, single numbers).', ageEquiv: '~3-4 years developmental', order: 2 },
  { id: 'p6', name: 'P-Scale 6', description: 'Can combine elements (two-word phrases, simple calculations with objects).', ageEquiv: '~4-5 years developmental', order: 3 },
  { id: 'p7', name: 'P-Scale 7', description: 'Can apply skills in familiar contexts with support.', ageEquiv: '~5 years developmental', order: 4 },
  { id: 'p8', name: 'P-Scale 8', description: 'Can apply skills in some unfamiliar contexts.', ageEquiv: '~5-6 years developmental', order: 5 },
  { id: 'pks1', name: 'Pre-Key Stage 1', description: 'Early development. Recognizes some letters/numbers. Beginning awareness.', ageEquiv: 'Below Year 1', order: 6 },
  { id: 'pks2', name: 'Pre-Key Stage 2', description: 'Growing development. Decodes some CVC words. Counts with reliability.', ageEquiv: 'Below Year 1', order: 7 },
  { id: 'pks3', name: 'Pre-Key Stage 3', description: 'Working towards KS1. Reads simple sentences. Add/subtract within 10.', ageEquiv: 'Approaching Year 1', order: 8 },
  { id: 'pks4', name: 'Pre-Key Stage 4', description: 'Just below KS1. Reading with fluency. Operations to 20. Writing sentences.', ageEquiv: 'Approaching Year 1', order: 9 },
  { id: 'el1', name: 'Entry Level 1', description: 'Functional Skills Entry Level 1. Basic reading, simple number work.', ageEquiv: 'Pre-KS1 functional', order: 10 },
  { id: 'el2', name: 'Entry Level 2', description: 'Functional Skills Entry Level 2. Equivalent to KS1.', ageEquiv: 'KS1 equivalent', order: 11 },
  { id: 'el3', name: 'Entry Level 3', description: 'Functional Skills Entry Level 3. Equivalent to KS2.', ageEquiv: 'KS2 equivalent', order: 12 },
  { id: 'ks1', name: 'KS1', description: 'Key Stage 1 (Year 2, age 6-7).', ageEquiv: 'Year 2', order: 13 },
  { id: 'ks2', name: 'KS2', description: 'Key Stage 2 (Year 6, age 10-11).', ageEquiv: 'Year 6', order: 14 },
  { id: 'olevel', name: 'O Level', description: 'Cambridge O Level / GCSE equivalent.', ageEquiv: 'Year 11', order: 15 },
  { id: 'alevel', name: 'A Level', description: 'Cambridge A Level.', ageEquiv: 'Year 13', order: 16 },
];

// ── Engagement Model (statutory since Sept 2021) ──────────────────
// For students working below the level of the national curriculum
// who are not engaged in subject-specific study
export const ENGAGEMENT_MODEL = {
  areas: [
    {
      id: 'exploration',
      name: 'Exploration',
      description: 'Investigating, discovering, experimenting with the environment and learning materials.',
      levels: {
        not_yet: 'Does not investigate or interact with learning materials independently.',
        emerging: 'Beginning to touch, look at, or move toward stimuli when presented.',
        developing: 'Actively investigates materials, tries different actions, shows curiosity.',
        secure: 'Independently explores new materials, investigates cause and effect, experiments with different approaches.',
      },
      indicators: [
        'Touches or manipulates materials',
        'Looks at objects or screens with focus',
        'Moves toward stimuli',
        'Tries different actions with materials',
        'Shows curiosity about new items',
      ],
    },
    {
      id: 'realisation',
      name: 'Realisation',
      description: 'Having "aha" moments — recognizing that their actions produce results.',
      levels: {
        not_yet: 'Does not show recognition that actions produce results.',
        emerging: 'Occasionally shows surprise or pleasure when an action produces a result.',
        developing: 'Repeats actions that caused an effect, smiles or vocalizes at results.',
        secure: 'Consistently recognizes cause-and-effect, shows delight in discoveries, shares discoveries with others.',
      },
      indicators: [
        'Smiles at a result',
        'Repeats an action that caused an effect',
        'Shows surprise at unexpected outcomes',
        'Pauses to observe the result of an action',
        'Vocalizes or gestures to indicate awareness',
      ],
    },
    {
      id: 'anticipation',
      name: 'Anticipation',
      description: 'Predicting what happens next based on prior experience.',
      levels: {
        not_yet: 'Does not show signs of predicting what comes next.',
        emerging: 'Occasionally looks toward or reaches for the next item in a familiar sequence.',
        developing: 'Regularly anticipates next steps in familiar routines, shows readiness.',
        secure: 'Reliably predicts next steps, prepares for upcoming actions, shows excitement about what\'s coming.',
      },
      indicators: [
        'Reaches for the next item in a sequence',
        'Looks toward the door when a bell rings',
        'Prepares for a routine step before it happens',
        'Shows excitement before a preferred activity',
        'Demonstrates readiness for transitions',
      ],
    },
    {
      id: 'persistence',
      name: 'Persistence',
      description: 'Sustaining attention and effort, trying again after difficulty.',
      levels: {
        not_yet: 'Disengages immediately when facing difficulty or when interest wanes.',
        emerging: 'Maintains focus for brief periods. Occasionally tries again after a first failure.',
        developing: 'Sustains attention for increasing durations. Tries alternative approaches when first attempt fails.',
        secure: 'Maintains engagement through challenges. Tries multiple approaches. Returns to a task after a break.',
      },
      indicators: [
        'Tries again after failure',
        'Maintains focus for increasing durations',
        'Returns to a task after interruption',
        'Tries a different approach when stuck',
        'Completes multi-step activities',
      ],
    },
    {
      id: 'initiation',
      name: 'Initiation',
      description: 'Starting activities or making requests independently without prompting.',
      levels: {
        not_yet: 'Does not start activities independently. Waits for direction.',
        emerging: 'Occasionally initiates a familiar activity or makes a request with minimal prompting.',
        developing: 'Regularly initiates familiar activities. Makes choices. Requests help when needed.',
        secure: 'Independently starts activities, makes requests, chooses topics, directs own learning.',
      },
      indicators: [
        'Opens the app independently',
        'Chooses a topic or activity without prompting',
        'Asks for help',
        'Requests a specific type of content',
        'Directs the conversation or activity',
      ],
    },
  ],
};

// ── Blank's Levels of Questioning ──────────────────────────────
// Framework for grading language complexity in questions
export const BLANKS_LEVELS = [
  {
    level: 1,
    name: 'Matching Perception',
    description: 'Questions about what is directly visible/present.',
    examples: ['What can you see?', 'Point to the cat.', 'What is this?', 'Find something red.'],
    cognitiveSkill: 'Labeling, identifying, matching',
    senApplication: 'Starting point for all SEN students with speech & language needs. Also the base for severe intellectual disability and early autism intervention.',
  },
  {
    level: 2,
    name: 'Selective Analysis',
    description: 'Questions requiring description of features of what is present.',
    examples: ['What is the boy doing?', 'What color is it?', 'How many are there?', 'Where is the dog?'],
    cognitiveSkill: 'Describing, classifying, categorizing',
    senApplication: 'Move to Level 2 only when Level 1 is secure. Appropriate for moderate intellectual disability, emerging language skills.',
  },
  {
    level: 3,
    name: 'Reordering Perception',
    description: 'Questions requiring inference from what is present.',
    examples: ['What will happen next?', 'How are these the same?', 'What is different?', 'What happened before this?'],
    cognitiveSkill: 'Predicting, comparing, sequencing, inferring',
    senApplication: 'Requires working memory and inference. Challenging for autism (theory of mind), ADHD (sustained attention), Down Syndrome (abstract reasoning). Use visual supports.',
  },
  {
    level: 4,
    name: 'Reasoning',
    description: 'Questions about what is NOT present — hypothetical, causal, evaluative.',
    examples: ['Why did she do that?', 'What would happen if...?', 'How could we fix this?', 'What do you think about...?'],
    cognitiveSkill: 'Reasoning, evaluating, problem-solving, hypothesizing',
    senApplication: 'Most SEN students need significant scaffolding at Level 4. 2e/gifted SEN students may excel here despite struggling with lower levels in specific modalities.',
  },
];

// ── Condition-Specific Nano Learning Parameters ──────────────────
export const SEN_NANO_PARAMS = {
  autism_mild:         { sessionMins: 15, itemsPerSession: 6, newToReviewRatio: '1:4', breakEveryMins: 10, breakAnnounced: true, transitionWarning: true },
  autism_severe:       { sessionMins: 6, itemsPerSession: 2, newToReviewRatio: '1:6', breakEveryMins: null, breakStudentInitiated: true, transitionWarning: true },
  adhd:               { sessionMins: 9, itemsPerSession: 7, newToReviewRatio: '1:2', breakEveryMins: 6, noveltyRequired: true, immediateReward: true },
  dyslexia:           { sessionMins: 18, itemsPerSession: 5, newToReviewRatio: '1:3', breakAfterNewPhoneme: true, multisensory: true, cumulativeReview: true },
  dyscalculia:        { sessionMins: 12, itemsPerSession: 4, newToReviewRatio: '1:4', concreteFirst: true, noTimePressure: true },
  down_syndrome:      { sessionMins: 10, itemsPerSession: 3, newToReviewRatio: '1:5', breakEveryMins: 5, overLearning: true, visualFirst: true, enthusiasticFeedback: true },
  cerebral_palsy:     { sessionMins: 12, itemsPerSession: 4, newToReviewRatio: '1:3', fatigueAware: true, extendedResponseTime: true, motorAdapted: true },
  visual_impairment:  { sessionMins: 18, itemsPerSession: 6, newToReviewRatio: '1:3', audioFirst: true, screenReaderCompat: true },
  hearing_impairment: { sessionMins: 18, itemsPerSession: 6, newToReviewRatio: '1:3', visualFirst: true, captioning: true, noAudioReliance: true },
  speech_language:    { sessionMins: 12, itemsPerSession: 4, newToReviewRatio: '1:4', blanksLevel: 1, colourfulSemantics: true, preTeachVocab: true },
  intellectual_mild:  { sessionMins: 12, itemsPerSession: 3, newToReviewRatio: '1:5', functionalContext: true, overLearning: true, concreteOnly: true },
  intellectual_severe: { sessionMins: 6, itemsPerSession: 1, newToReviewRatio: '1:8', engagementModel: true, causeEffect: true },
  emotional_behavioral: { sessionMins: 12, itemsPerSession: 4, newToReviewRatio: '1:3', regulationFirst: true, predictableStructure: true, choiceAlways: true, neverPunitive: true, repairAfterRupture: true },
  gifted_2e:          { sessionMins: 25, itemsPerSession: 10, newToReviewRatio: '1:1', depthNotBreadth: true, metacognition: true, selfDirected: true, challengeIntellect: true },
};

// ── Effort-Based Grading System ──────────────────────────────
export const EFFORT_GRADES = [
  { level: 5, name: 'Mastered', description: 'Correct, confident, no scaffold needed.', color: '#4F8EF7', action: 'Record as secure. Advance to harder content.' },
  { level: 4, name: 'Emerging', description: 'Correct after one prompt or scaffold.', color: '#4ADE80', action: 'Record as developing. Reduce scaffold next time.' },
  { level: 3, name: 'Supported', description: 'Correct with significant support.', color: '#EAB308', action: 'Record as emerging. Keep scaffold. Revisit.' },
  { level: 2, name: 'Attempted', description: 'Incorrect but evidence of reasoning.', color: '#F97316', action: 'Record as productive struggle. Teach the gap. This IS learning.' },
  { level: 1, name: 'Not Yet', description: 'No response or no attempt.', color: '#EF4444', action: 'NOT failure. Record as not ready. Revisit at lower tier.' },
];

// ── Feedback Rules per Condition ──────────────────────────────
export const FEEDBACK_RULES = {
  autism: { noSuddenSounds: true, noFlashes: true, calmText: true, consistentFormat: true, simpleCheckmark: true, noFireworks: true },
  adhd: { immediateReward: true, canAnimate: true, canSound: true, brief: true, energetic: true, novelty: true },
  anxiety: { noRed: true, noXmarks: true, softColors: true, noTestFormat: true, gentleLanguage: true },
  down_syndrome: { enthusiastic: true, warm: true, social: true, sameCelebrationEachTime: true, predictable: true },
  visual_impairment: { audioOnly: true, distinctSounds: true, ttsConfirmation: true, noVisualReliance: true },
  hearing_impairment: { visualOnly: true, prominentVisual: true, noAudioReliance: true },
  emotional_behavioral: { neverPunitive: true, unconditionalPositive: true, regulationFirst: true, repairRupture: true },
};

// ── Frustration Detection Thresholds ──────────────────────────
export const FRUSTRATION_PROTOCOL = {
  signals: [
    'Response length trending downward within session',
    'Increased "I dont know" / "idk" / "?" / "..." / single characters',
    'Response time increasing (withdrawing, not processing)',
    'Repeated identical responses (stimming or frustration)',
    'Session abandoned without goodbye',
    'Explicit frustration: "stupid", "I cant", "I hate this", "Im dumb"',
    'Shift from longer responses to monosyllables',
  ],
  levels: [
    { level: 1, name: 'Mild', trigger: '1 signal in last 3 exchanges', response: 'Reduce complexity by one tier. "Lets try this a different way."' },
    { level: 2, name: 'Moderate', trigger: '2 signals in last 3 exchanges', response: 'Switch to mastered content for 2 items. Guarantee success. "You definitely know this one."' },
    { level: 3, name: 'Significant', trigger: '3+ signals OR explicit frustration', response: 'Stop teaching. Be present. "No more questions. Im just here. Take your time."' },
    { level: 4, name: 'Crisis', trigger: 'Crisis language or self-harm indicators', response: '"You sound like youre having a hard time. Thats completely OK. If you need to talk to someone you trust, thats always the right thing to do."' },
  ],
};

// ── Spaced Repetition Intervals per Condition ──────────────────
export const SR_INTERVALS = {
  standard:           [1, 3, 7, 14, 30, 60],
  down_syndrome:      [1, 1, 2, 4, 7, 14, 30],
  intellectual:       [1, 1, 2, 4, 7, 14, 30],
  adhd:               [1, 2, 5, 14, 30],
  dyslexia_phonics:   [1, 2, 3, 7, 14], // plus cumulative review every session
  autism:             [1, 3, 7, 14, 30], // must demonstrate in 2+ contexts
};

// ── Mastery Thresholds per Condition ──────────────────────────
export const MASTERY_THRESHOLDS = {
  standard:      { accuracy: 0.8, sessions: 3, description: '80% accuracy across 3 consecutive sessions' },
  down_syndrome: { accuracy: 0.9, sessions: 5, description: '90% accuracy across 5 sessions (over-learning)' },
  intellectual:  { accuracy: 0.9, sessions: 5, description: '90% accuracy across 5 sessions' },
  adhd:          { accuracy: 0.8, sessions: 2, description: '80% accuracy across 2 sessions (faster to maintain novelty)' },
  autism:        { accuracy: 0.8, sessions: 3, contexts: 2, description: '80% across 3 sessions in 2+ different contexts (generalization check)' },
  dyslexia:      { accuracy: 0.8, sessions: 3, description: '80% across 3 sessions' },
};

// ── Age-Appropriate Dignity Rules ──────────────────────────────
export const DIGNITY_RULES = [
  'A 14-year-old working at Entry Level 1 uses adult contexts (job applications, not nursery rhymes)',
  'A teenager learning to count uses money, not teddies',
  'Visual supports for older students use photographs, not cartoons',
  'Language is age-appropriate even when content is simplified',
  'Never use "baby" voices, tones, or language regardless of developmental level',
  'Interests of the STUDENT determine context, not assumed interests of their developmental level',
  'Celebrate progress without condescension',
];

// ── Colourful Semantics Framework ──────────────────────────────
export const COLOURFUL_SEMANTICS = {
  elements: [
    { role: 'WHO', color: 'orange', question: 'Who is it?', example: 'The boy' },
    { role: 'WHAT DOING', color: 'yellow', question: 'What are they doing?', example: 'is kicking' },
    { role: 'WHAT', color: 'green', question: 'What?', example: 'the ball' },
    { role: 'WHERE', color: 'blue', question: 'Where?', example: 'in the park' },
    { role: 'WHEN', color: 'purple', question: 'When?', example: 'after school' },
    { role: 'WHY', color: 'pink', question: 'Why?', example: 'because he was happy' },
  ],
  progression: [
    'Stage 1: WHO + WHAT DOING (2-element sentences)',
    'Stage 2: WHO + WHAT DOING + WHAT (3-element sentences)',
    'Stage 3: WHO + WHAT DOING + WHAT + WHERE (4-element sentences)',
    'Stage 4: Add WHEN and WHY (5-6 element sentences)',
    'Stage 5: Complex sentences with conjunctions',
  ],
};

// ── Helper: Determine progression level from assessment data ──────
export function determineLevel(assessmentData) {
  const { canRecognizeLetters, canBlendCVC, canReadSentences, canCount, canAddSubtract, engagementScore } = assessmentData;

  if (!canRecognizeLetters && !canCount && engagementScore < 3) return 'engagement';
  if (!canRecognizeLetters && canCount) return 'p5';
  if (canRecognizeLetters && !canBlendCVC) return 'pks1';
  if (canBlendCVC && !canReadSentences) return 'pks2';
  if (canReadSentences && canAddSubtract) return 'pks4';
  if (canReadSentences) return 'pks3';
  return 'p6';
}

// ── Helper: Get nano params for a student ──────────────────────
export function getNanoParams(condition, severity) {
  const key = severity === 'severe' ? `${condition}_severe` : condition;
  return SEN_NANO_PARAMS[key] || SEN_NANO_PARAMS[condition] || SEN_NANO_PARAMS.adhd; // safe fallback
}
