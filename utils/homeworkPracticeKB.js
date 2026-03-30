/**
 * utils/homeworkPracticeKB.js
 * Complete Homework, Practice Assignment & Voice Evaluation System
 *
 * Every session ends with a specific assignment.
 * Every assignment is evaluated when the student returns.
 * A session without homework is a conversation.
 * A session with homework is the beginning of transformation.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// HOMEWORK ASSIGNMENT FORMULA — every assignment has exactly 5 elements
// ═══════════════════════════════════════════════════════════════════════════════

export const HOMEWORK_FORMULA = {
  elements: [
    'WHAT to practice — specific, not vague',
    'HOW to practice — the method, not just the task',
    'HOW LONG — duration per day and number of days',
    'HOW TO RECORD — what clip to send back to Starky',
    'THE SUCCESS SIGNAL — how student knows they\'ve done it right',
  ],
  wrong: '"Practice your singing this week."',
  right: '"Practice the first verse of \'Tum Hi Ho\' every morning. Specifically focus on the phrase \'Tum hi ho...\' — breathe before \'ho\' so you have air to hold that note. Practice 10 minutes every morning for 3 days. On day 3, record yourself singing just that one line. You\'ll know you\'ve got it when you can hold \'ho\' for 4 full counts without your voice wavering."',
  sessionStructure: '[Session opens] → [Evaluate last homework via voice clip] → [Teach new material] → [Practice in session] → [Assign homework] → [Session closes]. This loop repeats forever. This is how progress compounds.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOMEWORK BY SUBJECT
// ═══════════════════════════════════════════════════════════════════════════════

export const HOMEWORK_BY_SUBJECT = {
  singing: {
    dailyWarmUp: { task: '5 minutes every morning: lip trills 1 min, humming scales 2 min, target phrase 5 times slowly.', duration: '5 min/day', days: 'every day' },
    techniqueWeekly: { template: 'This week your one job is {technique}. Every time you practice your song, focus ONLY on this. Not the whole song. Just this one thing.', duration: '10 min/day', days: '3-7 days' },
    songPhrase: { template: 'Learn just the first 4 bars of {song}. Perfect those 4 bars. Record yourself on day 3 and day 7. Compare the two recordings yourself before showing Starky.', duration: '10 min/day', days: '7 days', clip: 'Day 3 + Day 7 recordings' },
  },
  mathematics: {
    procedural: { template: '5 problems tonight. Timed — set a timer for 20 minutes. If you finish before the timer, check every step. If you don\'t finish, mark where you stopped and why.', duration: '20 min', days: '1 day' },
    conceptual: { template: 'Explain {concept} to someone at home — parent, sibling, anyone. If you can explain it clearly, you understand it. Tell me tomorrow what questions they asked you.', duration: '10 min', days: '1 day' },
    problemSolving: { template: 'Try this one hard problem. Don\'t expect to solve it completely. Spend 20 minutes attempting it. Write everything you try. The attempt is the homework — not the answer.', duration: '20 min', days: '1 day' },
  },
  english: {
    readingAloud: { template: 'Read {passage} aloud twice. Record the second reading. I want to hear: your pace, your expression, your pronunciation.', duration: '10 min', clip: '2 min recording of second reading' },
    vocabulary: { template: '3 new words from today. Use each one in a sentence before tomorrow. Say them aloud — the word, the definition, your sentence. Record this — 30 seconds total.', duration: '5 min', clip: '30 sec recording' },
    essayPlanning: { template: 'Don\'t write the essay yet. Plan it. Speak your argument aloud for 2 minutes — no notes. Record it. When you open Starky, play it back. We\'ll build the essay from what you said.', duration: '5 min', clip: '2 min recording' },
  },
  science: {
    conceptExplanation: { template: 'Explain {concept} in your own words — spoken aloud. As if you\'re teaching a 10-year-old. Record 60 seconds. Bring it back.', duration: '5 min', clip: '60 sec recording' },
    observation: { template: 'Do {observation}. Describe what you saw — in detail, in your own words. Speak it, don\'t write it. 1 minute recording.', duration: '15 min', clip: '1 min recording' },
  },
  history: {
    argumentPractice: { template: 'You have 2 minutes to argue {position}. Speak it aloud. Record it. Doesn\'t matter if you believe it — argue it convincingly.', duration: '5 min', clip: '2 min recording' },
  },
  languages: {
    speakingPractice: { template: 'Say these 5 sentences aloud 10 times each. Record the 10th repetition of each. Bring back the recording. I\'ll compare your first and last.', duration: '10 min', clip: '5 recordings' },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE CLIP TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export const CLIP_TYPES = {
  homeworkEval: { name: 'Homework Evaluation Clip', when: 'Start of each new session', what: 'Student reads back, sings, or speaks their homework', duration: '30s-3min', purpose: 'Evaluate what was practiced, what improved' },
  checkpoint: { name: 'Checkpoint Clip', when: 'Every 2 weeks', what: 'Standard benchmark — same task every time', duration: '60-90s', purpose: 'Direct comparison across weeks — measurable growth' },
  breakthrough: { name: 'Breakthrough Clip', when: 'Moment of achievement', what: 'Whatever the student just did that they couldn\'t before', duration: 'however long', purpose: 'Evidence of growth, stored permanently, celebrated' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CLIP EVALUATION RUBRICS
// ═══════════════════════════════════════════════════════════════════════════════

export const CLIP_EVALUATION_RUBRICS = {
  singing: {
    dimensions: ['pitch_accuracy', 'breath_control', 'tone_quality', 'rhythm', 'confidence'],
    scale: {
      1: 'Significant issues — struggling', 2: 'Major challenges apparent', 3: 'Basic ability emerging',
      4: 'Developing — some control', 5: 'Inconsistent — good moments mixed with lapses',
      6: 'Good foundation — mostly accurate', 7: 'Solid — minor lapses only',
      8: 'Strong — confident and controlled', 9: 'Excellent — near-professional', 10: 'Professional level',
    },
  },
  speaking: {
    dimensions: ['fluency', 'clarity', 'pace', 'expression', 'confidence'],
  },
  academic: {
    dimensions: ['accuracy', 'clarity', 'depth', 'language', 'structure'],
  },
};

/**
 * Evaluate a clip against rubric dimensions
 */
export function evaluateClip(type, scores) {
  const rubric = CLIP_EVALUATION_RUBRICS[type];
  if (!rubric) return null;

  const dims = rubric.dimensions;
  const total = dims.reduce((sum, d) => sum + (scores[d] || 0), 0);
  const overall = Math.round((total / dims.length) * 10) / 10;

  return {
    type,
    dimensions: dims.map(d => ({ name: d.replace(/_/g, ' '), score: scores[d] || 0 })),
    overall,
    date: new Date().toISOString(),
  };
}

/**
 * Compare two clips and generate progress report
 */
export function compareClips(previous, current, studentName) {
  if (!previous || !current) return null;

  const improvements = current.dimensions.map((d, i) => ({
    name: d.name,
    before: previous.dimensions[i]?.score || 0,
    after: d.score,
    diff: d.score - (previous.dimensions[i]?.score || 0),
  }));

  const biggestGain = improvements.reduce((best, d) => d.diff > best.diff ? d : best, improvements[0]);

  return {
    studentName,
    previousDate: previous.date,
    currentDate: current.date,
    improvements,
    overallBefore: previous.overall,
    overallAfter: current.overall,
    overallDiff: Math.round((current.overall - previous.overall) * 10) / 10,
    biggestImprovement: biggestGain,
    summary: `${biggestGain.name}: ${biggestGain.before}/10 → ${biggestGain.after}/10 (+${biggestGain.diff})`,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEN HOMEWORK ADAPTATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const SEN_HOMEWORK_ADAPTATIONS = {
  autism: {
    rules: ['Identical structure every time', 'Extremely specific — no ambiguity', 'Duration stated exactly: "10 minutes, not 11, not 9"', 'Clear success signal: "You\'ll know you\'re done when..."', 'One task, one method, one outcome — no choice paralysis'],
  },
  adhd: {
    rules: ['Micro-tasks: "Step 1 only. Don\'t think about step 2 yet."', 'Time-boxed: "Set a timer for 7 minutes. That\'s it."', 'Varied format each session for novelty', 'Immediately rewarding', 'Written AND spoken: Starky says it AND shows it on screen'],
  },
  dyslexia: {
    rules: ['Audio-first: record the assignment and play it back', 'Never reading-heavy unless goal IS reading practice', 'Short: 10 minutes max per task', 'Voice recording preferred over written response'],
  },
  downSyndrome: {
    rules: ['One thing only — never two', 'Demonstrated during session before assigned', 'Very short: 5-10 minutes max', 'Attached to a loved activity where possible', 'Parent informed — parent must co-practice'],
  },
  anxiety: {
    rules: ['Low stakes: "Just for you and me. No one else sees it."', 'Opt-out built in: "If this feels too much, just come back anyway."', 'Process-focused: "The attempt is the homework. Not the result."', 'Small: anxiety shrinks in front of tiny tasks'],
  },
  visionImpairment: {
    rules: ['Audio instructions — read aloud by Starky', 'Recording-based response — no written submission', 'Duration clear: "When the timer rings, you\'re done."'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// RETURN SESSION PROTOCOL
// ═══════════════════════════════════════════════════════════════════════════════

export const RETURN_SESSION_PROTOCOL = {
  opening: 'Welcome back, {name}. Last session you were working on {topic}. I gave you {homework}. Before we start today — let me hear how it went.',
  voiceSubjects: 'Press the mic and sing/read/speak {assigned_clip}.',
  academicSubjects: 'Tell me about the problem you found hardest.',

  outcomes: {
    improved: {
      response: 'I can hear the difference. {specific_improvement}. That happened because you practiced. Now let\'s build on this.',
    },
    notMuchImprovement: {
      response: 'You practiced — I can hear that you tried. The improvement is smaller than we hoped. That\'s normal. Some weeks are smaller than others. Let me listen again and figure out what specifically needs adjusting.',
      action: 'Identify exact blocker. Focus entire session there.',
    },
    didntPractice: {
      response: 'No problem. Let\'s do a quick catch-up clip now — I\'ll evaluate where you are today, and we\'ll set a smaller goal for this week.',
      action: 'Give smaller, easier homework. Investigate (gently) what got in the way. Adjust practice plan to fit student\'s real life.',
      goldenRule: 'A student who comes back without having practiced is still coming back. That is the most important thing. Never make returning feel like failure.',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PARENT HOMEWORK SUMMARY
// ═══════════════════════════════════════════════════════════════════════════════

export const PARENT_HOMEWORK_SUMMARY = {
  template: `{child_name}'s homework from today's session:
Subject: {subject}
Task: {task}
How to help: {parent_action}
Time needed: {duration}
What to listen for: {success_signal}
How to send Starky the clip: {clip_instructions}`,

  parentRules: [
    'NEVER correct during practice — let them finish. Let them record and bring it to Starky.',
    'Celebrate the attempt, not just the result — "Did you practice today? That\'s the win."',
    'Practice alongside them sometimes — your presence matters even if you don\'t know the subject.',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOMEWORK TRACKING
// ═══════════════════════════════════════════════════════════════════════════════

export const HOMEWORK_RECORD_SCHEMA = {
  homework_assigned: null,     // { task, subject, duration, clip_required }
  homework_returned: false,
  clip_quality_delta: null,    // improvement from previous clip
  days_since_last_session: 0,
  student_comment: null,
};

const HW_KEY = 'nw_homework_history';

export function loadHomeworkHistory() {
  try { return JSON.parse(localStorage.getItem(HW_KEY) || '[]'); } catch { return []; }
}

function saveHomeworkHistory(history) {
  try { localStorage.setItem(HW_KEY, JSON.stringify(history)); } catch {}
}

/**
 * Generate homework assignment based on subject and session content
 */
export function generateHomework(subject, topic, level, condition) {
  const templates = HOMEWORK_BY_SUBJECT[subject?.toLowerCase()];
  if (!templates) {
    // Generic homework
    return {
      task: `Practice what we worked on today: ${topic}. Spend 15 focused minutes. Record yourself explaining what you learned — 60 seconds.`,
      method: 'Speak it aloud. Recording helps you hear yourself.',
      duration: '15 min/day for 2 days',
      clip: '60 second explanation recording',
      successSignal: 'You\'ll know it\'s working when you can explain it without looking at notes.',
    };
  }

  // Pick appropriate template
  const keys = Object.keys(templates);
  const template = templates[keys[0]]; // default to first template type

  // SEN adaptation
  let adaptation = null;
  if (condition && SEN_HOMEWORK_ADAPTATIONS[condition]) {
    adaptation = SEN_HOMEWORK_ADAPTATIONS[condition].rules[0];
  }

  return {
    task: template.template?.replace('{concept}', topic).replace('{song}', topic).replace('{passage}', topic).replace('{technique}', topic).replace('{observation}', topic).replace('{position}', topic) || template.task,
    method: template.template ? 'Follow the instructions exactly. One thing at a time.' : 'Practice daily as described.',
    duration: template.duration,
    days: template.days || '2-3 days',
    clip: template.clip || 'Record when ready',
    successSignal: 'You\'ll know you\'ve got it when it feels easier than yesterday.',
    senAdaptation: adaptation,
  };
}

/**
 * Track homework completion
 */
export function trackHomeworkCompletion(completed, clipDelta, comment) {
  const history = loadHomeworkHistory();
  history.push({
    date: new Date().toISOString(),
    completed,
    clipDelta: clipDelta || null,
    comment: comment || null,
  });
  if (history.length > 100) history.splice(0, history.length - 100);
  saveHomeworkHistory(history);

  // Calculate completion rate
  const recent = history.slice(-20);
  const completionRate = recent.filter(h => h.completed).length / recent.length;
  return { completionRate, totalAssigned: history.length, totalCompleted: history.filter(h => h.completed).length };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROMPT GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get homework system prompt for Starky
 */
export function getHomeworkPrompt(lastHomework, subject, condition) {
  let prompt = `\nHOMEWORK SYSTEM — Every session ends with a specific assignment.\n`;
  prompt += `\nFormula: ${HOMEWORK_FORMULA.elements.join('. ')}.`;
  prompt += `\nSession structure: ${HOMEWORK_FORMULA.sessionStructure}`;

  // Return session protocol
  if (lastHomework) {
    prompt += `\n\nLast homework assigned: "${lastHomework.task}"`;
    prompt += `\nRETURN PROTOCOL: Start session by evaluating homework. ${RETURN_SESSION_PROTOCOL.opening.replace('{homework}', lastHomework.task)}`;
    prompt += `\nIf practiced and improved: celebrate specifically. If tried but didn't improve much: identify blocker gently. If didn't practice: NO SHAME. "${RETURN_SESSION_PROTOCOL.outcomes.didntPractice.goldenRule}"`;
  }

  // SEN adaptation
  if (condition && SEN_HOMEWORK_ADAPTATIONS[condition]) {
    prompt += `\n\nSEN homework rules (${condition}): ${SEN_HOMEWORK_ADAPTATIONS[condition].rules.join('. ')}.`;
  }

  // Clip evaluation
  prompt += `\n\nCLIP EVALUATION: When student shares a recording, evaluate on appropriate rubric (singing: pitch/breath/tone/rhythm/confidence, speaking: fluency/clarity/pace/expression/confidence, academic: accuracy/clarity/depth/language/structure). Score each 1-10. Compare to previous clip if available.`;

  prompt += `\n\nALWAYS end the session with homework. The 5 elements: WHAT, HOW, HOW LONG, HOW TO RECORD, SUCCESS SIGNAL. Never vague. Always specific.`;
  prompt += `\nWrong: "${HOMEWORK_FORMULA.wrong}" Right: specific task with method, duration, recording, and success signal.`;

  return prompt;
}
