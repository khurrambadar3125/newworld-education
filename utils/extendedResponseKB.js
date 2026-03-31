/**
 * extendedResponseKB.js — Extended Response Coaching Knowledge Base
 *
 * Provides frameworks, time allocations, band descriptors, and sentence starters
 * for 6+ mark extended response questions across all Cambridge subjects.
 */

// ─────────────────────────────────────────────
// TIME ALLOCATION
// ─────────────────────────────────────────────

function getTimeAllocation(marks) {
  if (marks >= 20) return '30-35 minutes';
  if (marks >= 15) return '22-25 minutes';
  if (marks >= 12) return '18-20 minutes';
  if (marks >= 10) return '15 minutes';
  if (marks >= 8) return '12 minutes';
  if (marks >= 6) return '8-10 minutes';
  return '5 minutes';
}

// ─────────────────────────────────────────────
// SUBJECT FRAMEWORKS
// ─────────────────────────────────────────────

const FRAMEWORKS = {
  economics: {
    framework: 'DEED (Define, Explain, Example, Diagram/Evaluate)',
    steps: [
      'DEFINE: Define the key economic term precisely using textbook language.',
      'EXPLAIN: Explain the economic theory or mechanism — show cause and effect chains.',
      'EXAMPLE: Give a real-world example or diagram to support your argument.',
      'EVALUATE: Weigh both sides. Consider short-run vs long-run, stakeholders affected, assumptions. Reach a JUDGEMENT.',
    ],
  },
  biology: {
    framework: 'Point-Evidence-Explain-Link (PEEL)',
    steps: [
      'POINT: State the biological principle or process clearly.',
      'EVIDENCE: Use specific biological terminology — name enzymes, molecules, structures.',
      'EXPLAIN: Explain the mechanism step by step — what happens at the molecular/cellular level.',
      'LINK: Link back to the question and explain the significance or consequence.',
    ],
  },
  chemistry: {
    framework: 'Claim-Evidence-Reasoning (CER)',
    steps: [
      'CLAIM: State your answer to the question directly.',
      'EVIDENCE: Provide specific chemical data — equations, observations, values.',
      'REASONING: Explain WHY the evidence supports your claim using chemical principles.',
      'EVALUATE: If asked, consider limitations, alternative explanations, or industrial significance.',
    ],
  },
  physics: {
    framework: 'State-Explain-Apply-Calculate (SEAC)',
    steps: [
      'STATE: State the relevant physics law or principle.',
      'EXPLAIN: Explain what the law means in the context of this question.',
      'APPLY: Apply it to the specific scenario — identify the variables.',
      'CALCULATE/CONCLUDE: Show working or reach a conclusion with correct units.',
    ],
  },
  english: {
    framework: 'PEE Chain (Point-Evidence-Effect)',
    steps: [
      'POINT: Identify the writer\'s technique or method.',
      'EVIDENCE: Embed a SHORT quotation — never more than one sentence.',
      'EFFECT: Analyse the effect on the reader — what does it make them think, feel, or imagine?',
      'DEVELOP: Add a second layer of analysis — connotations, alternative interpretations, structural purpose.',
      'COMPARE: If comparing, use connectives (similarly, whereas, in contrast) to integrate texts.',
    ],
  },
  history: {
    framework: 'PEE + Judgement',
    steps: [
      'POINT: State your argument — take a clear position.',
      'EVIDENCE: Support with specific historical evidence — dates, names, events, statistics.',
      'EXPLAIN: Explain HOW the evidence supports your argument — show causation, not just correlation.',
      'COUNTER: Consider the counter-argument with its own evidence.',
      'JUDGEMENT: Reach a clear, supported conclusion — which argument is stronger and WHY?',
    ],
  },
  geography: {
    framework: 'Case Study Chain',
    steps: [
      'POINT: State the geographical process or factor.',
      'EVIDENCE: Use case study data — named places, specific figures, dates.',
      'EXPLAIN: Explain the geographical mechanism — why does this happen here?',
      'EVALUATE: Consider scale (local/national/global), sustainability, and different stakeholder perspectives.',
    ],
  },
  'business studies': {
    framework: 'Point-Application-Analysis-Evaluation (PAAE)',
    steps: [
      'POINT: State the business concept or theory.',
      'APPLICATION: Apply it to the specific business in the case study — use data from the extract.',
      'ANALYSIS: Analyse the impact — show chains of reasoning (this leads to... which means... resulting in...).',
      'EVALUATION: Weigh up — consider short-term vs long-term, quantitative vs qualitative, and reach a justified recommendation.',
    ],
  },
  default: {
    framework: 'PEEL (Point-Evidence-Explain-Link)',
    steps: [
      'POINT: State your answer or argument clearly.',
      'EVIDENCE: Support with specific facts, data, or examples.',
      'EXPLAIN: Explain HOW the evidence supports your point — show reasoning.',
      'LINK: Link back to the question. For evaluation questions, weigh both sides and reach a conclusion.',
    ],
  },
};

function getFramework(subject) {
  if (!subject) return FRAMEWORKS.default;
  const s = subject.toLowerCase().trim();
  // Try exact match first
  if (FRAMEWORKS[s]) return FRAMEWORKS[s];
  // Try partial matches
  if (s.includes('econ')) return FRAMEWORKS.economics;
  if (s.includes('bio')) return FRAMEWORKS.biology;
  if (s.includes('chem')) return FRAMEWORKS.chemistry;
  if (s.includes('phys')) return FRAMEWORKS.physics;
  if (s.includes('eng') || s.includes('lit')) return FRAMEWORKS.english;
  if (s.includes('hist')) return FRAMEWORKS.history;
  if (s.includes('geo')) return FRAMEWORKS.geography;
  if (s.includes('business') || s.includes('commerce')) return FRAMEWORKS['business studies'];
  return FRAMEWORKS.default;
}

// ─────────────────────────────────────────────
// BAND DESCRIPTORS (generic Cambridge)
// ─────────────────────────────────────────────

const BAND_DESCRIPTORS = [
  {
    band: 1,
    label: 'Excellent (Top Band)',
    description: 'Thorough, well-developed response with evaluation and supported judgement. Uses precise terminology throughout. Analysis shows depth and sophistication.',
    percentage: '80-100%',
  },
  {
    band: 2,
    label: 'Good',
    description: 'Sound response with good knowledge and some analysis. May lack full evaluation or the conclusion is not fully supported.',
    percentage: '60-79%',
  },
  {
    band: 3,
    label: 'Adequate',
    description: 'Basic response showing some relevant knowledge. Limited analysis — mostly descriptive. Little or no evaluation.',
    percentage: '40-59%',
  },
  {
    band: 4,
    label: 'Limited',
    description: 'Superficial response with gaps in knowledge. Assertions without evidence. No evaluation or conclusion.',
    percentage: '0-39%',
  },
];

// ─────────────────────────────────────────────
// SENTENCE STARTERS
// ─────────────────────────────────────────────

const EVALUATION_STARTERS = [
  'However, it could be argued that...',
  'On the other hand...',
  'A limitation of this argument is...',
  'While this is true in the short run, in the long run...',
  'This depends on the assumption that...',
  'The counter-argument is that...',
  'Nevertheless, the evidence suggests...',
  'Although [X], it is important to consider [Y]...',
  'The significance of this factor is debatable because...',
  'Critics of this view would argue...',
];

const CONCLUSION_STARTERS = [
  'On balance, the most significant factor is... because...',
  'Overall, I would argue that... because the evidence shows...',
  'In conclusion, while both [X] and [Y] are important, [X] is more significant because...',
  'Therefore, the strongest argument is... as it is supported by...',
  'Having weighed both sides, I conclude that... primarily because...',
  'Ultimately, the key factor is... since without it...',
];

// ─────────────────────────────────────────────
// DETECTION: Scan message for extended response triggers
// ─────────────────────────────────────────────

const HIGH_MARK_COMMAND_WORDS = [
  'evaluate', 'assess', 'discuss', 'to what extent',
  'analyse', 'justify', 'compare and contrast',
];

function detectExtendedResponse(message) {
  if (!message) return null;
  const lower = message.toLowerCase();

  // Check for explicit mark counts: "[N] marks" where N >= 6
  const markMatch = lower.match(/(\d+)\s*marks?/);
  if (markMatch) {
    const marks = parseInt(markMatch[1], 10);
    if (marks >= 6) return { marks, trigger: 'explicit_marks' };
  }

  // Check for "essay" or "extended response"
  if (lower.includes('essay') || lower.includes('extended response')) {
    return { marks: 12, trigger: 'essay_keyword' };
  }

  // Check for high-mark command words
  for (const cmd of HIGH_MARK_COMMAND_WORDS) {
    if (lower.includes(cmd)) {
      return { marks: 8, trigger: `command_word:${cmd}` };
    }
  }

  return null;
}

// ─────────────────────────────────────────────
// INJECTION: Build the coaching prompt
// ─────────────────────────────────────────────

function getExtendedResponseInjection(marks, subject) {
  const framework = getFramework(subject);
  const time = getTimeAllocation(marks);
  const bandText = BAND_DESCRIPTORS.map(b =>
    `Band ${b.band} (${b.label}, ${b.percentage}): ${b.description}`
  ).join('\n');
  const evalStarters = EVALUATION_STARTERS.slice(0, 5).map(s => `  - "${s}"`).join('\n');
  const conclusionStarters = CONCLUSION_STARTERS.slice(0, 4).map(s => `  - "${s}"`).join('\n');

  return `\n\nEXTENDED RESPONSE COACH (${marks}-mark question detected):
This student is answering a ${marks}-mark extended response question.

INJECT THIS GUIDANCE BEFORE THEY WRITE:

1. TIME: They have ${time} for this answer.

2. PLAN FIRST: Tell them to spend 2-3 minutes planning before writing. Outline their key points, evidence, and conclusion before starting.

3. FRAMEWORK: They should use the ${framework.framework} framework:
${framework.steps.map(s => `   - ${s}`).join('\n')}

4. EVALUATION: For ${marks}+ marks, evaluation is ESSENTIAL. Without a clear conclusion they CANNOT reach the top mark band.

5. SENTENCE STARTERS for evaluation:
${evalStarters}

   For conclusions:
${conclusionStarters}

After they submit their answer:

6. MARK AGAINST BAND DESCRIPTORS:
${bandText}
Tell them which band their answer is in and exactly what they need to do to reach Band 1.

7. IDENTIFY THE ONE THING: "The single most important improvement you can make to reach A* on this answer is: [give specific, actionable instruction]"`;
}

module.exports = {
  detectExtendedResponse,
  getExtendedResponseInjection,
  getFramework,
  getTimeAllocation,
  BAND_DESCRIPTORS,
  EVALUATION_STARTERS,
  CONCLUSION_STARTERS,
};
