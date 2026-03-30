/**
 * utils/deliberatePracticeLayer.js
 * Master Practice Intelligence Layer — enhances EVERY KB without changing any.
 *
 * Injects into every session alongside existing KBs.
 * Nothing replaced. Everything enhanced.
 * The difference between a tutor who teaches and a tutor who produces mastery.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// THE FOUR LAWS OF EFFECTIVE PRACTICE
// ═══════════════════════════════════════════════════════════════════════════════

export const FOUR_LAWS_OF_PRACTICE = {
  spacedRepetition: {
    name: 'Spaced Repetition (The Forgetting Curve)',
    science: 'Memory decays predictably. Reviewing just before forgetting consolidates memory exponentially more than cramming.',
    schedule: [
      { stage: 1, delay: '1 day', retention: 'Restored + strengthened' },
      { stage: 2, delay: '3 days', retention: 'Further strengthened' },
      { stage: 3, delay: '7 days', retention: 'Deeper consolidation' },
      { stage: 4, delay: '14 days', retention: 'Approaching long-term' },
      { stage: 5, delay: '30 days', retention: 'Long-term established' },
      { stage: 6, delay: '90 days', retention: 'Mastery level' },
    ],
    delayMs: [86400000, 259200000, 604800000, 1209600000, 2592000000, 7776000000],
  },

  retrievalPractice: {
    name: 'Retrieval Practice (Testing IS Learning)',
    science: 'Retrieving information from memory strengthens memory more than re-reading. A test IS the learning.',
    types: [
      { name: 'Free Recall', desc: '"Without looking — what do you remember about [topic]?"', power: 'Highest' },
      { name: 'Cued Recall', desc: '"The formula starts with... can you complete it?"', power: 'High — scaffolded' },
      { name: 'Multiple Choice', desc: '"Was it A, B, C, or D?"', power: 'Medium — quick' },
      { name: 'Short Answer', desc: '"Explain in one sentence why [concept] matters."', power: 'High — builds understanding' },
      { name: 'Teach-Back', desc: '"Now explain it to me as if I\'m the student."', power: 'Highest — teaching is ultimate retrieval' },
    ],
    rule: 'Never re-explain without first asking the student to retrieve. Even partial retrieval before re-teaching doubles retention.',
  },

  interleaving: {
    name: 'Interleaving (Mix It Up)',
    science: 'Students who practice topics in mixed order outperform single-topic practice by 50-125% on transfer tests.',
    why: 'Blocked practice lets the brain get lazy — it knows what\'s coming. Mixed practice forces identification of the problem type before solving — exactly what exams require.',
    rule: 'After mastery at basic level, never practise in isolation again. Always mix with related concepts.',
  },

  desirableDifficulty: {
    name: 'Desirable Difficulty (The Edge of Ability)',
    science: 'Learning maximised at the edge of ability. Too easy → no growth. Too hard → shutdown.',
    progression: 'Correct 3x in a row → increase difficulty. Fail 2x in a row → step back. Mixed results → stay.',
    analogy: 'Identical to how Mehdi Hassan approached riyaz. He never sang what he could already sing perfectly.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION ARC — every session follows this pattern
// ═══════════════════════════════════════════════════════════════════════════════

export const SESSION_ARC_TEMPLATE = {
  steps: [
    { name: 'Retrieval First', duration: '2-3 min', what: '"Last time we covered [topic]. Without looking — what do you remember?" Accept partial. Celebrate what they got. Fill in what\'s missed briefly.' },
    { name: 'Spaced Review', duration: '1-2 min', what: 'Check review schedule. If something is due today, do it before new content. 30 seconds. One question. Move on.' },
    { name: 'New Content', duration: 'Main session', what: 'Teach. Immediately give retrieval question. If correct → advance. If not → re-explain from different angle → retrieve again. Never move forward until retrieval succeeds once.' },
    { name: 'Interleave', duration: '3-5 min', what: 'Mix today\'s new concept with a previous concept. "You just learned [new]. Now a problem mixing [new] with [old]." Harder. That\'s the point.' },
    { name: 'Preview', duration: '1 min', what: '"Today we covered [X]. Next session: [Y]. Before next time — think about [one retrieval question]." Primes memory for next session.' },
  ],
  overhead: '2 minutes of retrieval + review overhead. Doubles retention. Worth it every time.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUBJECT-SPECIFIC PRACTICE PROTOCOLS
// ═══════════════════════════════════════════════════════════════════════════════

export const SUBJECT_PRACTICE_PROTOCOLS = {
  mathematics: {
    spacing: '1 → 3 → 7 → 14 → 30 days',
    retrieval: 'Always work new problems — never re-read solutions',
    interleaving: 'Mix algebra, geometry, statistics from Week 3 onwards',
    difficulty: 'One harder problem than comfort level per session',
    starky: '"Reading maths is not doing maths. The only way to learn maths is to do maths."',
  },
  sciences: {
    spacing: '1 → 4 → 10 → 21 → 45 days (longer — more content)',
    retrieval: 'Explain the concept without notes before reviewing notes',
    interleaving: 'Mix topics within subject (forces + electricity + waves)',
    difficulty: 'Application questions before formula recall',
    starky: '"Understanding the formula is step 1. Knowing when to use it — that\'s the exam question."',
  },
  languages: {
    spacing: 'Vocabulary daily for 7 days, then weekly',
    retrieval: 'Use the word in a sentence before looking it up again',
    interleaving: 'Mix reading, writing, speaking, listening — never one alone',
    difficulty: 'Authentic texts slightly above current level',
    starky: '"The Beatles learned to play by playing. Language is learned by using it."',
  },
  humanities: {
    spacing: '2 → 6 → 15 → 30 days',
    retrieval: 'Explain the event in your own words',
    interleaving: 'Mix time periods and themes',
    difficulty: 'Causation questions not just recall',
    starky: '"Don\'t memorise dates. Understand why things happened. The dates will follow."',
  },
  singing: {
    spacing: 'Exercises daily. Songs every 2-3 days.',
    retrieval: 'Sing from memory before referencing lyrics',
    interleaving: 'Mix technical exercises with emotional song practice',
    difficulty: 'One phrase beyond comfort each session',
    starky: '"Mehdi Hassan never sang what he could already sing. He always worked at the edge. That\'s riyaz."',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SEN-ADAPTED PRACTICE PROTOCOLS
// ═══════════════════════════════════════════════════════════════════════════════

export const SEN_PRACTICE_PROTOCOLS = {
  adhd: {
    spacing: '1 → 2 → 5 → 10 → 21 days (shorter — more frequent)',
    session: '5 min practice → 2 min break → 5 min practice',
    retrieval: 'Gamified — "beat your score from last time"',
    interleaving: 'High — variety sustains attention',
    difficulty: 'Slightly lower ceiling — success builds dopamine',
    starky: '"Short. Sharp. Frequent. That\'s your practice formula."',
  },
  autism: {
    spacing: 'Predictable and announced — never surprise reviews. "We always start Tuesday with a review of Sunday."',
    session: 'Same opening ritual every session',
    retrieval: 'Same format every time — predictability IS the support',
    interleaving: 'Gradual — introduce mixing only when student is secure',
    difficulty: 'Conservative — mastery of one thing builds safety',
    starky: '"We\'ll follow the same pattern every session. You\'ll always know what\'s coming."',
  },
  dyslexia: {
    spacing: 'More frequent, shorter reviews',
    retrieval: 'Verbal not written — speak the answer',
    interleaving: 'Audio and visual together — multimodal retrieval',
    difficulty: 'Reading level one step below, thinking level at grade',
    starky: '"Your memory is strong. Your retrieval just works differently. Let\'s find your way."',
  },
  downSyndrome: {
    spacing: '1 → 2 → 4 → 7 → 14 days (very frequent)',
    retrieval: 'Short, single-answer questions',
    interleaving: 'Minimal — master one thing fully before introducing another',
    difficulty: 'Very gradual increments',
    starky: '"We did this yesterday. Can you do it again today? Yes — even better."',
  },
  anxiety: {
    spacing: 'Regular and predictable — routine reduces anxiety',
    retrieval: 'Private — never in front of others',
    interleaving: 'Moderate — too much variety increases anxiety',
    difficulty: 'Lower threshold — success builds confidence first',
    starky: '"No surprise questions. You\'ll always know what\'s coming. Whatever you remember — that\'s right."',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// FORGETTING CURVE TRACKER
// ═══════════════════════════════════════════════════════════════════════════════

const FC_KEY = 'nw_forgetting_curve';

function loadForgettingCurve() {
  try { return JSON.parse(localStorage.getItem(FC_KEY) || '{"concepts":[]}'); } catch { return { concepts: [] }; }
}

function saveForgettingCurve(data) {
  try { localStorage.setItem(FC_KEY, JSON.stringify(data)); } catch {}
}

/**
 * Add a concept to the forgetting curve tracker
 */
export function teachConcept(concept, subject, curriculum, grade) {
  const data = loadForgettingCurve();
  const existing = data.concepts.find(c => c.concept === concept && c.subject === subject);
  if (existing) return existing; // already tracked

  const now = new Date();
  const entry = {
    id: `fc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    concept,
    subject,
    curriculum,
    grade,
    first_taught: now.toISOString(),
    reviews: [],
    current_stage: 1,
    mastery_achieved: false,
    mastery_date: null,
  };

  // Schedule first review
  entry.next_review = new Date(now.getTime() + FOUR_LAWS_OF_PRACTICE.spacedRepetition.delayMs[0]).toISOString();

  data.concepts.push(entry);
  if (data.concepts.length > 200) data.concepts = data.concepts.slice(-200);
  saveForgettingCurve(data);
  return entry;
}

/**
 * Update forgetting curve after a review attempt
 */
export function updateForgettingCurve(conceptId, result, confidence) {
  const data = loadForgettingCurve();
  const entry = data.concepts.find(c => c.id === conceptId);
  if (!entry) return null;

  const now = new Date();
  entry.reviews.push({
    date: now.toISOString(),
    stage: entry.current_stage,
    result, // 'correct' | 'partial' | 'incorrect'
    confidence, // 0-10
  });

  if (result === 'correct') {
    // Advance to next stage
    if (entry.current_stage < 6) {
      entry.current_stage += 1;
      entry.next_review = new Date(now.getTime() + FOUR_LAWS_OF_PRACTICE.spacedRepetition.delayMs[entry.current_stage - 1]).toISOString();
    }
    // Check mastery (stage 6 + confidence 8+)
    if (entry.current_stage >= 6 && confidence >= 8) {
      entry.mastery_achieved = true;
      entry.mastery_date = now.toISOString();
    }
  } else if (result === 'incorrect') {
    // Reset to stage 1
    entry.current_stage = 1;
    entry.next_review = new Date(now.getTime() + FOUR_LAWS_OF_PRACTICE.spacedRepetition.delayMs[0]).toISOString();
  } else {
    // Partial — stay at current stage, review sooner
    const halfDelay = FOUR_LAWS_OF_PRACTICE.spacedRepetition.delayMs[Math.max(0, entry.current_stage - 2)] || FOUR_LAWS_OF_PRACTICE.spacedRepetition.delayMs[0];
    entry.next_review = new Date(now.getTime() + halfDelay).toISOString();
  }

  saveForgettingCurve(data);
  return entry;
}

/**
 * Get concepts due for review today
 */
export function getDueReviews() {
  const data = loadForgettingCurve();
  const now = new Date();
  return data.concepts.filter(c =>
    !c.mastery_achieved &&
    c.next_review &&
    new Date(c.next_review) <= now
  ).sort((a, b) => new Date(a.next_review) - new Date(b.next_review));
}

/**
 * Get mastery statistics
 */
export function getMasteryStats() {
  const data = loadForgettingCurve();
  const total = data.concepts.length;
  const mastered = data.concepts.filter(c => c.mastery_achieved).length;
  const inProgress = data.concepts.filter(c => !c.mastery_achieved && c.reviews.length > 0).length;
  const due = getDueReviews().length;
  return { total, mastered, inProgress, due, masteryRate: total > 0 ? Math.round((mastered / total) * 100) : 0 };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CROSS-KB ENHANCEMENT INJECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const CROSS_KB_ENHANCEMENTS = {
  cambridgeExaminer: 'After every concept: retrieval question. After 3 sessions on one topic: interleave. Exam simulation: retrieval under time pressure.',
  youngLearnerKB: 'After every story: "what happened?" (free recall). Review favourites from previous sessions. Songs and rhymes as retrieval — melody aids recall.',
  phonicsKB: 'Sound retrieval: hear a sound, retrieve the letter. Interleave sounds: never drill one alone for 3+ minutes. Return to difficult sounds every 2 days.',
  singingKB: 'Riyaz as deliberate practice framework. Record and compare across sessions. Interleave technique and song.',
  weaknessDetector: 'Detected weakness → immediate spacing schedule created. Review every session until mastery.',
  iconicSingersKB: '"Last session I told you about Mehdi Hassan. What do you remember?" Artists as memory anchors.',
  practiceKB: 'The practice KB teaches about practice. The practice layer makes it happen. Complete loop.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// STARKY'S PRACTICE RESPONSES
// ═══════════════════════════════════════════════════════════════════════════════

export const PRACTICE_LAYER_RESPONSES = {
  retrievalRight: 'That\'s exactly it. Your memory held it perfectly. Now here\'s a harder version...',
  retrievalWrong: 'That\'s useful — it means we review now rather than later. Let me show you from a different angle...',
  neverSay: '"You forgot it." Always: "Your memory needs one more look at this."',
  introducingInterleave: 'You\'ve got [A] solid. Now I\'m mixing it with [B]. This will feel harder — that\'s exactly the point. The hard feeling is your brain building stronger connections.',
  alreadyKnowThis: '"Perfect — then retrieve it without me. What do you remember?" If they can → confirm. If not → "This is why we review. Knowing and owning are different."',
  wantToMoveFaster: '"Moving faster is the wrong goal. Retaining longer is the right goal. Mehdi Hassan practiced the same ragas for 60 years. Not because he didn\'t know them — because he wanted to own them."',
  plateau: '"Plateaus are not failure. They are your brain consolidating. The progress is happening — you can\'t see it yet. The breakthrough comes when you least expect it."',
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROMPT GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate the deliberate practice layer prompt for Starky.
 * Injected into EVERY session alongside existing KBs.
 */
export function getDeliberatePracticePrompt(subject, condition) {
  let prompt = `\nDELIBERATE PRACTICE LAYER — enhances this session:\n`;

  // Four laws summary
  prompt += `\n4 Laws: 1) Spaced repetition (review just before forgetting). 2) Retrieval practice (test IS learning — never re-explain without asking student to retrieve first). 3) Interleaving (mix topics after basic mastery — 50-125% better). 4) Desirable difficulty (edge of ability — correct 3x → harder, fail 2x → easier).`;

  // Session arc
  prompt += `\nSESSION ARC: Retrieval first (2-3min) → Spaced review if due (1-2min) → New content with immediate retrieval → Interleave with previous → Preview next session.`;

  // Due reviews
  const due = getDueReviews();
  if (due.length > 0) {
    prompt += `\n\nREVIEW DUE TODAY (${due.length} concepts):`;
    due.slice(0, 3).forEach(c => {
      prompt += `\n- ${c.concept} (${c.subject}, stage ${c.current_stage}/6, taught ${Math.round((Date.now() - new Date(c.first_taught).getTime()) / 86400000)}d ago)`;
    });
    prompt += `\nStart session with retrieval of these before new content.`;
  }

  // Subject protocol
  const protocol = SUBJECT_PRACTICE_PROTOCOLS[subject?.toLowerCase()];
  if (protocol) {
    prompt += `\n\nSubject protocol (${subject}): Spacing: ${protocol.spacing}. Retrieval: ${protocol.retrieval}. Interleaving: ${protocol.interleaving}.`;
    prompt += `\n${protocol.starky}`;
  }

  // SEN adaptation
  if (condition) {
    const sen = SEN_PRACTICE_PROTOCOLS[condition];
    if (sen) {
      prompt += `\n\nSEN practice (${condition}): ${sen.spacing}. ${sen.retrieval}. ${sen.difficulty}. ${sen.starky}`;
    }
  }

  // Mastery stats
  const stats = getMasteryStats();
  if (stats.total > 0) {
    prompt += `\n\nStudent mastery: ${stats.mastered}/${stats.total} concepts mastered (${stats.masteryRate}%). ${stats.due} due for review today.`;
  }

  // Key responses
  prompt += `\n\nIf student says "I already know this": "${PRACTICE_LAYER_RESPONSES.alreadyKnowThis}"`;
  prompt += `\nIf student wants to move faster: "${PRACTICE_LAYER_RESPONSES.wantToMoveFaster}"`;
  prompt += `\n${PRACTICE_LAYER_RESPONSES.neverSay}`;

  return prompt;
}

/**
 * Generate a complete practice session structure
 */
export function generatePracticeSession(subject, dueReviews, newTopic, previousTopics) {
  return {
    step1_retrieval: dueReviews.length > 0
      ? { type: 'spaced_review', concepts: dueReviews.slice(0, 2).map(c => c.concept), prompt: `Before new content — quick review. What do you remember about ${dueReviews[0]?.concept}?` }
      : previousTopics?.length > 0
        ? { type: 'free_recall', topic: previousTopics[0], prompt: `Last time we covered ${previousTopics[0]}. What do you remember?` }
        : null,
    step2_newContent: { topic: newTopic, rule: 'Teach → immediate retrieval → if correct advance, if not re-explain from different angle → retrieve again' },
    step3_interleave: previousTopics?.length > 0
      ? { mix: [newTopic, previousTopics[0]], prompt: `Now a problem mixing ${newTopic} with ${previousTopics[0]}. This is harder. That's the point.` }
      : null,
    step4_preview: { nextTopic: 'to be determined', prompt: `Today we covered ${newTopic}. Think about this before next time: [one retrieval question].` },
    step5_homework: { subject, topic: newTopic, rule: 'Specific task + method + duration + recording + success signal' },
  };
}
