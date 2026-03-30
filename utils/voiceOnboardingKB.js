/**
 * utils/voiceOnboardingKB.js
 * Universal Voice Onboarding — No forms. Just Starky listening.
 *
 * By the end of 90 seconds, Starky knows exactly who this person is
 * and has configured itself completely — invisibly.
 *
 * Every user. Every country. Students, parents, SEN parents, teachers.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ENTRY POINT GREETINGS — different opening for each page
// ═══════════════════════════════════════════════════════════════════════════════

export const ENTRY_GREETINGS = {
  homepage: {
    pk: "Assalam-o-Alaikum! I'm Starky — your personal tutor. I just need to know a few things about you so I can teach you the right way. Press the mic and tell me — are you a student or are you a parent looking for your child?",
    uae: "Marhaba! I'm Starky — your personal tutor. I just need to know a few things about you so I can teach you the right way. Press the mic and tell me — are you a student or are you a parent?",
    other: "Hello! I'm Starky — your personal tutor. I just need to know a few things about you so I can teach you the right way. Are you a student or a parent?",
  },
  specialNeeds: "Hello — welcome. I'm Starky. I'm here to support every kind of learner. Before we start, I'd love to understand your child better. Can you press the mic and tell me a little about them? Just speak naturally — tell me whatever you'd like me to know.",
  parent: "Hello — I'm Starky. I'm going to be your child's personal tutor. To do that well, I need to understand them. Can you tell me about your child? Their name, how old they are, and what they find difficult?",
  phonics: "Hello! I'm Starky — I help young children learn to read. Can you tell me a bit about your child? How old are they and what's their name?",
  summer: "Welcome to Starky's summer programme! Are you a student ready to learn, or a parent signing up your child?",
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONDITION EXTRACTION — natural language → SEN mapping
// ═══════════════════════════════════════════════════════════════════════════════

export const CONDITION_PATTERNS = [
  // Confirmed conditions — parent names it directly
  { pattern: /\b(has|have|diagnosed with|on the spectrum)\b.*\bautis/i, condition: 'autism', confidence: 'confirmed' },
  { pattern: /\bautis(m|tic)\b/i, condition: 'autism', confidence: 'confirmed' },
  { pattern: /\badhd\b/i, condition: 'adhd', confidence: 'confirmed' },
  { pattern: /\b(has|have|diagnosed with)\b.*\bdown.?s/i, condition: 'down_syndrome', confidence: 'confirmed' },
  { pattern: /\bdown.?s?\s*syndrome\b/i, condition: 'down_syndrome', confidence: 'confirmed' },
  { pattern: /\bdyslexia|dyslexic\b/i, condition: 'dyslexia', confidence: 'confirmed' },
  { pattern: /\bdyscalculia\b/i, condition: 'dyscalculia', confidence: 'confirmed' },
  { pattern: /\bdyspraxia|dcd\b/i, condition: 'dyspraxia', confidence: 'confirmed' },
  { pattern: /\bdysgraphia\b/i, condition: 'dysgraphia', confidence: 'confirmed' },
  { pattern: /\bcerebral\s*palsy\b/i, condition: 'cerebral_palsy', confidence: 'confirmed' },
  { pattern: /\b(is|he'?s|she'?s)\s+deaf\b/i, condition: 'deaf', confidence: 'confirmed' },
  { pattern: /\bhearing\s*(impair|loss|aid|problem)/i, condition: 'hearing_impairment', confidence: 'confirmed' },
  { pattern: /\bvisual(ly)?\s*(impair|blind)/i, condition: 'visual_impairment', confidence: 'confirmed' },
  { pattern: /\bsensory\s*processing/i, condition: 'sensory_processing', confidence: 'confirmed' },
  { pattern: /\bspeech\s*(and\s*)?language/i, condition: 'speech_language', confidence: 'confirmed' },

  // Signal conditions — parent describes behaviours
  { pattern: /can'?t\s+(sit\s+still|focus|concentrate|pay\s+attention)/i, condition: 'adhd', confidence: 'signal' },
  { pattern: /loses?\s+focus|easily\s+distracted|fidgets?\s+a\s+lot/i, condition: 'adhd', confidence: 'signal' },
  { pattern: /doesn'?t?\s+(make\s+)?eye\s+contact|avoids?\s+eye/i, condition: 'autism', confidence: 'signal' },
  { pattern: /doesn'?t?\s+(like|handle)\s+(change|noise|loud)/i, condition: 'autism', confidence: 'signal' },
  { pattern: /trouble\s+(with\s+)?reading|can'?t\s+read|hates?\s+reading/i, condition: 'dyslexia', confidence: 'signal' },
  { pattern: /letters?\s+(look|jump|move|backwards|reversed)/i, condition: 'dyslexia', confidence: 'signal' },
  { pattern: /struggles?\s+with\s+(number|math|count)/i, condition: 'dyscalculia', confidence: 'signal' },
  { pattern: /can'?t\s+hear\s+(properly|well)|hearing\s+not\s+perfect/i, condition: 'hearing_impairment', confidence: 'signal' },
  { pattern: /slow\s+learner|behind\s+(in\s+)?class|falls?\s+behind/i, condition: 'general_learning', confidence: 'signal' },
  { pattern: /very\s+anxious|gets?\s+(very\s+)?anxious|panic/i, condition: 'anxiety', confidence: 'signal' },
  { pattern: /non.?verbal|doesn'?t?\s+(speak|talk)/i, condition: 'non_verbal', confidence: 'signal' },
  { pattern: /learning\s+(difficult|disabilit|problem|challenge)/i, condition: 'general_learning', confidence: 'signal' },
];

// Severity hints
export const SEVERITY_PATTERNS = [
  { pattern: /\b(severe|severely|profound|significant|major)\b/i, severity: 'severe' },
  { pattern: /\b(mild|slight|minor|a\s+bit|a\s+little)\b/i, severity: 'mild' },
  { pattern: /\b(moderate|somewhat|fairly)\b/i, severity: 'moderate' },
  { pattern: /\b(high.?function|level\s*[12]|asperger)/i, severity: 'mild' },
  { pattern: /\b(non.?verbal|can'?t\s+(speak|walk|write))\b/i, severity: 'severe' },
];

// Parent emotion from transcript patterns
export const PARENT_EMOTION_PATTERNS = [
  { pattern: /i'?m?\s+(so\s+)?worried|i\s+don'?t\s+know\s+what\s+to\s+do|desperate|helpless/i, emotion: 'anxious' },
  { pattern: /we'?ve\s+tried\s+everything|exhausted|tired\s+of|fed\s+up|give\s+up/i, emotion: 'exhausted' },
  { pattern: /i\s+think\s+he\s+can|she'?s?\s+smart|but\s+he\s+loves?|bright\s+kid/i, emotion: 'hopeful' },
  { pattern: /diagnosed\s+at|his\s+report\s+says?|according\s+to|the\s+doctor\s+said/i, emotion: 'matter_of_fact' },
];

/**
 * Extract conditions from natural language parent speech
 */
export function extractConditionFromNaturalLanguage(transcript) {
  if (!transcript) return { conditions: [], severity: null, emotion: null };

  const conditions = [];
  for (const p of CONDITION_PATTERNS) {
    if (p.pattern.test(transcript)) {
      const existing = conditions.find(c => c.condition === p.condition);
      if (!existing) {
        conditions.push({ condition: p.condition, confidence: p.confidence });
      } else if (p.confidence === 'confirmed') {
        existing.confidence = 'confirmed';
      }
    }
  }

  let severity = null;
  for (const s of SEVERITY_PATTERNS) {
    if (s.pattern.test(transcript)) { severity = s.severity; break; }
  }

  let emotion = null;
  for (const e of PARENT_EMOTION_PATTERNS) {
    if (e.pattern.test(transcript)) { emotion = e.emotion; break; }
  }

  // Extract child name (simple heuristic)
  let childName = null;
  const nameMatch = transcript.match(/(?:name\s+is|called|named|he'?s|she'?s)\s+([A-Z][a-z]+)/i);
  if (nameMatch) childName = nameMatch[1];

  // Extract age
  let childAge = null;
  const ageMatch = transcript.match(/(?:he'?s|she'?s|is)\s+(\d{1,2})\s*(?:years?|yrs?)?/i) ||
                   transcript.match(/(\d{1,2})\s*(?:years?\s*old|year\s*old)/i);
  if (ageMatch) childAge = parseInt(ageMatch[1]);

  // Extract grade
  let childGrade = null;
  const gradeMatch = transcript.match(/(?:grade|year|class)\s+(\d{1,2}|kg|kindergarten)/i);
  if (gradeMatch) childGrade = gradeMatch[1];

  // Extract strengths
  const strengths = [];
  const strengthMatch = transcript.match(/(?:but\s+(?:he|she)\s+)?loves?\s+(\w+)/gi);
  if (strengthMatch) strengthMatch.forEach(m => {
    const word = m.replace(/but\s+(?:he|she)\s+loves?\s+/i, '');
    if (word.length > 2) strengths.push(word);
  });

  return { conditions, severity, emotion, childName, childAge, childGrade, strengths };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONDITION AUTO-CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const CONDITION_CONFIG = {
  autism: {
    enable: ['Gentle Start Protocol', 'predictable session structure', 'visual/written mode', 'sensory sensitivity awareness'],
    disable: ['time pressure', 'sudden changes', 'loud audio effects'],
    teachingMode: 'gentle',
    note: 'Calm, predictable, visual-first. Always warn before transitions.',
  },
  adhd: {
    enable: ['short session mode (5-7 min segments)', 'frequent encouragement', 'movement break prompts', 'gamification elements'],
    disable: ['long unbroken sessions', 'monotone delivery'],
    teachingMode: 'active',
    note: 'Short bursts, high energy, lots of variety. Celebrate every win.',
  },
  dyslexia: {
    enable: ['audio-first mode', 'phonics support', 'multi-sensory teaching', 'larger text display'],
    disable: ['timed reading activities', 'heavy text walls'],
    teachingMode: 'multi_sensory',
    note: 'Listen more, read less. Break words into sounds. Never rush reading.',
  },
  down_syndrome: {
    enable: ['very simple language', 'repetition and consolidation', 'celebratory feedback', 'visual learning mode'],
    disable: ['complex sentence structures', 'abstract concepts without concrete examples'],
    teachingMode: 'gentle',
    note: 'Repeat, celebrate, simplify. Every achievement matters.',
  },
  deaf: {
    enable: ['Deaf Mode (text-first)', 'visual instructions', 'sign language awareness', 'high contrast mode'],
    disable: ['audio reliance', 'spoken-only instructions'],
    teachingMode: 'deaf',
    note: 'No audio dependency whatsoever. Everything visual and written.',
  },
  hearing_impairment: {
    enable: ['clear text captions', 'high contrast mode', 'reduced audio dependency'],
    disable: ['audio-only content'],
    teachingMode: 'visual_first',
    note: 'Support audio with visual. Don\'t eliminate audio — supplement it.',
  },
  cerebral_palsy: {
    enable: ['motor consideration mode', 'mic preferred over typing', 'extended response time', 'assistive tech compatibility'],
    disable: ['activities requiring fast typing', 'time-pressure tasks'],
    teachingMode: 'accessible',
    note: 'Voice input is primary. Extended time for everything. Never rush motor tasks.',
  },
  dyscalculia: {
    enable: ['visual number representations', 'concrete examples', 'step-by-step maths', 'number line visuals'],
    disable: ['mental arithmetic under pressure', 'abstract number problems'],
    teachingMode: 'visual_maths',
    note: 'Make numbers visible and concrete. Use real-world examples. Never say "it\'s easy".',
  },
  anxiety: {
    enable: ['Safe Space Protocol', 'breathing prompts', 'very gentle correction', 'predictable structure'],
    disable: ['time pressure', 'surprise elements', 'competitive features'],
    teachingMode: 'gentle',
    note: 'Safety first. Predictable. Never surprise. Always validate feelings.',
  },
  general_learning: {
    enable: ['universal gentle approach', 'simplified language', 'extra repetition', 'visual aids'],
    disable: ['assumptions about prior knowledge'],
    teachingMode: 'supportive',
    note: 'Start from where they are, not where they should be. No judgement.',
  },
  non_verbal: {
    enable: ['picture/symbol communication', 'yes/no tap responses', 'AAC awareness', 'visual choice boards'],
    disable: ['open-ended verbal questions', 'typing-heavy activities'],
    teachingMode: 'aac',
    note: 'Communication happens in many ways. Honour every form of expression.',
  },
};

// Multi-condition priority
export const MULTI_CONDITION_RULES = {
  principle: 'Safety first. Most restrictive condition leads. Child\'s individual preferences override general rules.',
  commonPairs: {
    'adhd+dyslexia': 'Short sessions (ADHD) + audio-first (dyslexia). Very common co-occurrence (~50%).',
    'autism+adhd': 'Calm/predictable structure (autism) + short bursts (ADHD). Start with autism approach, add ADHD variety within structure.',
    'autism+anxiety': 'Gentle Start Protocol + Safe Space Protocol. Maximum gentleness. Never push.',
    'autism+sensory': 'Full sensory awareness. Check: is screen brightness ok? Any sounds disturbing? Reduce all stimuli.',
    'cerebral_palsy+any': 'Motor accessibility always applies regardless of other conditions. Voice input priority.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIRMATION TEMPLATES — Starky reflects back what it understood
// ═══════════════════════════════════════════════════════════════════════════════

export const CONFIRMATION_TEMPLATES = {
  senParent: {
    template: "Thank you for sharing that with me. From what you've told me, it sounds like {name} is {age} years old{grade_clause}{condition_clause}. {teaching_plan} Is that right?",
    gradeClause: ' and in {grade}',
    conditionClause: {
      confirmed: ' and has {condition}',
      signal: ' and may have some challenges with {area}',
      multiple: ' and has {conditions}',
    },
    teachingPlan: {
      autism: "I'll make sure every session starts gently, stays calm, and follows a predictable pattern.",
      adhd: "I'll keep sessions short and varied with lots of encouragement.",
      dyslexia: "I'll use lots of listening and speaking rather than heavy reading, and take spelling slowly.",
      down_syndrome: "I'll keep things simple, repeat often, and celebrate every step forward.",
      deaf: "Everything will be visual and text-based — no audio dependency at all.",
      anxiety: "I'll create a safe, calm space where there's never any pressure.",
      general: "I'll start gently and learn as we go — there's no rush and no pressure.",
    },
  },
  undiagnosed: "That's completely fine — you don't need a diagnosis for Starky to help. I'll work with {name} as {pronoun} is. I'll observe how {pronoun} learns and adapt as we go. What matters is that {pronoun} feels comfortable.",
};

// ═══════════════════════════════════════════════════════════════════════════════
// TEACHER ONBOARDING
// ═══════════════════════════════════════════════════════════════════════════════

export const TEACHER_ONBOARDING = {
  greeting: "Welcome! How many students will be using Starky in your class? And what subject and grade are you teaching?",
  extractFields: ['subject', 'grade', 'curriculum', 'class_size', 'school_type'],
  configuration: {
    mode: 'classroom',
    vocabulary: 'appropriate for grade level',
    content: 'curriculum-specific (IGCSE/CBSE/IB etc.)',
    style: 'group-friendly teaching',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// UNIVERSAL PROFILE SCHEMA — stored after onboarding
// ═══════════════════════════════════════════════════════════════════════════════

export const UNIVERSAL_PROFILE_SCHEMA = {
  user_type: null,              // 'student' | 'parent' | 'sen_parent' | 'teacher'
  child_name: null,
  child_age: null,
  child_grade: null,
  country: null,                // 'PK' | 'UAE' | 'OTHER'
  curriculum: null,             // 'cambridge' | 'cbse' | 'ib' | 'american' | 'moe'
  conditions: [],               // [{ condition, confidence, severity }]
  strengths: [],                // ['maths', 'drawing', ...]
  teaching_mode: 'standard',    // 'standard' | 'gentle' | 'sen' | 'deaf' | 'active' | 'aac'
  parent_emotion_at_onboarding: null,
  onboarding_complete: false,
  onboarding_timestamp: null,
  voice_baseline: null,
};

const PROFILE_KEY = 'nw_universal_profile';

export function loadUniversalProfile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null'); } catch { return null; }
}

export function saveUniversalProfile(profile) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch {}
}

/**
 * Build universal profile from extracted onboarding data
 */
export function buildUniversalProfile(extracted, userType, country) {
  const profile = { ...UNIVERSAL_PROFILE_SCHEMA };
  profile.user_type = userType;
  profile.child_name = extracted.childName;
  profile.child_age = extracted.childAge;
  profile.child_grade = extracted.childGrade;
  profile.country = country;
  profile.strengths = extracted.strengths || [];
  profile.parent_emotion_at_onboarding = extracted.emotion;
  profile.onboarding_complete = true;
  profile.onboarding_timestamp = new Date().toISOString();

  // Map conditions with severity
  profile.conditions = (extracted.conditions || []).map(c => ({
    condition: c.condition,
    confidence: c.confidence,
    severity: extracted.severity || 'unsure',
  }));

  // Determine teaching mode from conditions
  if (profile.conditions.length === 0) {
    profile.teaching_mode = 'standard';
  } else {
    const confirmed = profile.conditions.filter(c => c.confidence === 'confirmed');
    const primary = confirmed[0] || profile.conditions[0];
    const config = CONDITION_CONFIG[primary.condition];
    profile.teaching_mode = config?.teachingMode || 'gentle';
  }

  saveUniversalProfile(profile);
  return profile;
}

/**
 * Configure Starky for detected condition(s)
 */
export function configureForCondition(conditions) {
  const config = { enable: [], disable: [], notes: [] };
  for (const c of conditions) {
    const cc = CONDITION_CONFIG[c.condition];
    if (cc) {
      config.enable.push(...cc.enable);
      config.disable.push(...cc.disable);
      config.notes.push(cc.note);
    }
  }
  // Deduplicate
  config.enable = [...new Set(config.enable)];
  config.disable = [...new Set(config.disable)];
  return config;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROMPT GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate the universal onboarding prompt for Starky.
 * Injected when profile exists and is complete.
 */
export function getUniversalOnboardingPrompt(profile) {
  if (!profile || !profile.onboarding_complete) return '';

  let prompt = `\nSTUDENT PROFILE (from voice onboarding):\n`;
  prompt += `User type: ${profile.user_type}.`;
  if (profile.child_name) prompt += ` Child's name: ${profile.child_name}.`;
  if (profile.child_age) prompt += ` Age: ${profile.child_age}.`;
  if (profile.child_grade) prompt += ` Grade: ${profile.child_grade}.`;
  if (profile.country) prompt += ` Country: ${profile.country}.`;
  if (profile.curriculum) prompt += ` Curriculum: ${profile.curriculum}.`;

  // Conditions
  if (profile.conditions.length > 0) {
    prompt += `\nConditions: ${profile.conditions.map(c => `${c.condition} (${c.confidence}, ${c.severity})`).join(', ')}.`;
    const config = configureForCondition(profile.conditions);
    prompt += `\nENABLED: ${config.enable.join(', ')}.`;
    prompt += `\nDISABLED: ${config.disable.join(', ')}.`;
    prompt += `\nTeaching notes: ${config.notes.join(' ')}`;

    // Multi-condition handling
    if (profile.conditions.length > 1) {
      const pair = profile.conditions.map(c => c.condition).sort().join('+');
      const pairNote = MULTI_CONDITION_RULES.commonPairs[pair];
      if (pairNote) prompt += `\nMulti-condition: ${pairNote}`;
      prompt += `\nPriority: ${MULTI_CONDITION_RULES.principle}`;
    }
  }

  // Strengths
  if (profile.strengths.length > 0) {
    prompt += `\nStrengths: ${profile.strengths.join(', ')}. USE THESE — connect difficult topics to their strengths.`;
  }

  // Parent emotion
  if (profile.parent_emotion_at_onboarding) {
    const emotionGuide = {
      anxious: 'Parent was anxious at onboarding — give reassurance. Show progress. Be extra communicative.',
      exhausted: 'Parent was exhausted at onboarding — be efficient. Don\'t add burden. Show value quickly.',
      hopeful: 'Parent was hopeful at onboarding — match their optimism. Build on strengths they mentioned.',
      matter_of_fact: 'Parent was clinical/factual at onboarding — match their tone. Be precise. Give data.',
    };
    prompt += `\n${emotionGuide[profile.parent_emotion_at_onboarding] || ''}`;
  }

  prompt += `\nTeaching mode: ${profile.teaching_mode}.`;
  prompt += `\n\nCRITICAL: Always greet ${profile.child_name || 'this student'} by name. Never repeat onboarding questions. Reference what was shared. Build trust by remembering.`;

  return prompt;
}

/**
 * Generate confirmation message for parent
 */
export function confirmWithParent(extracted) {
  const tmpl = CONFIRMATION_TEMPLATES.senParent;
  let msg = tmpl.template;

  msg = msg.replace('{name}', extracted.childName || 'your child');
  msg = msg.replace('{age}', extracted.childAge || 'young');

  // Grade clause
  if (extracted.childGrade) {
    msg = msg.replace('{grade_clause}', tmpl.gradeClause.replace('{grade}', `Grade ${extracted.childGrade}`));
  } else {
    msg = msg.replace('{grade_clause}', '');
  }

  // Condition clause
  if (extracted.conditions.length > 0) {
    const conditionNames = extracted.conditions.map(c => c.condition.replace(/_/g, ' ')).join(' and ');
    if (extracted.conditions.some(c => c.confidence === 'confirmed')) {
      msg = msg.replace('{condition_clause}', ` and has ${conditionNames}`);
    } else {
      msg = msg.replace('{condition_clause}', ` and may have some challenges with ${conditionNames}`);
    }
  } else {
    msg = msg.replace('{condition_clause}', '');
  }

  // Teaching plan
  const primaryCondition = extracted.conditions[0]?.condition;
  const plan = tmpl.teachingPlan[primaryCondition] || tmpl.teachingPlan.general;
  msg = msg.replace('{teaching_plan}', plan);

  return msg;
}

/**
 * Process parent speech — full pipeline
 */
export function processParentSpeech(transcript) {
  const extracted = extractConditionFromNaturalLanguage(transcript);
  const confirmation = confirmWithParent(extracted);
  return { extracted, confirmation };
}
