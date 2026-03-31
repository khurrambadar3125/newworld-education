/**
 * cambridgeDialectKB.js — Cambridge Examination Dialect Knowledge Base
 *
 * The specific vocabulary, phrasing, and language conventions that
 * Cambridge examiners USE in mark schemes and EXPECT in student answers.
 *
 * This is not general English — this is Cambridge Dialect:
 * the precise register that earns marks vs the everyday language that loses them.
 *
 * Every entry maps: what students say → what Cambridge requires → why it matters.
 */

// ─────────────────────────────────────────────
// UNIVERSAL CAMBRIDGE DIALECT RULES
// These apply across ALL subjects
// ─────────────────────────────────────────────

const UNIVERSAL_DIALECT = [
  {
    rule: 'Never say "shows" — say "suggests", "implies", "indicates", or "demonstrates"',
    why: '"Shows" is too definitive. Cambridge rewards hedged, analytical language.',
    subjects: ['all'],
  },
  {
    rule: 'Never say "a lot" — quantify or say "significant", "substantial", "considerable"',
    why: 'Vague quantifiers score 0 for analysis marks. Precision is rewarded.',
    subjects: ['all'],
  },
  {
    rule: 'Never say "thing" or "stuff" — name it precisely',
    why: 'Cambridge penalises imprecise vocabulary at every level.',
    subjects: ['all'],
  },
  {
    rule: 'Never start with "I think" in science/maths — state the fact directly',
    why: 'Science answers are evidence-based, not opinion-based. "I think the rate increases" → "The rate increases because..."',
    subjects: ['science', 'maths'],
  },
  {
    rule: 'Always use "because" or "therefore" in EXPLAIN questions — never leave causation implicit',
    why: 'The explanation mark requires explicit causal connection. Implied reasoning scores 0.',
    subjects: ['all'],
  },
  {
    rule: 'Use "whereas" or "however" in COMPARE questions — never describe separately',
    why: 'Parallel description (Text A says X. Text B says Y.) is not comparison. Must use comparative connectives.',
    subjects: ['all'],
  },
  {
    rule: 'Say "this leads to" or "this results in" — never "and then"',
    why: '"And then" is narrative. Cambridge rewards analytical chains of reasoning.',
    subjects: ['all'],
  },
  {
    rule: 'End EVALUATE answers with "On balance..." or "Overall..." — never leave without a judgement',
    why: 'Evaluation without conclusion cannot reach the top mark band. The judgement IS the evaluation.',
    subjects: ['all'],
  },
];

// ─────────────────────────────────────────────
// SCIENCE DIALECT
// ─────────────────────────────────────────────

const SCIENCE_DIALECT = {
  biology: [
    { student: 'water moves', cambridge: 'net movement of water molecules', context: 'osmosis' },
    { student: 'enzyme is killed', cambridge: 'enzyme is denatured', context: 'denaturation' },
    { student: 'energy is made', cambridge: 'energy is released', context: 'respiration' },
    { student: 'energy is produced', cambridge: 'energy is released', context: 'respiration' },
    { student: 'the same cells', cambridge: 'genetically identical cells', context: 'mitosis' },
    { student: 'carries oxygen', cambridge: 'combines with oxygen', context: 'haemoglobin' },
    { student: 'food is broken down', cambridge: 'large insoluble molecules are broken down into small soluble molecules', context: 'digestion' },
    { student: 'the plant makes food', cambridge: 'the plant synthesises glucose using light energy', context: 'photosynthesis' },
    { student: 'energy', cambridge: 'light energy', context: 'photosynthesis' },
    { student: 'things move from high to low', cambridge: 'net movement down a concentration gradient', context: 'diffusion' },
    { student: 'uses energy', cambridge: 'requires energy from respiration / ATP', context: 'active transport' },
    { student: 'the cell divides', cambridge: 'the cell undergoes mitosis', context: 'cell division' },
    { student: 'DNA copies itself', cambridge: 'DNA replicates', context: 'cell division' },
    { student: 'the gene is passed on', cambridge: 'the allele is inherited', context: 'genetics' },
    { student: 'survival of the fittest', cambridge: 'organisms with advantageous characteristics are more likely to survive and reproduce', context: 'natural selection' },
    { student: 'germs', cambridge: 'pathogens', context: 'disease' },
    { student: 'fights disease', cambridge: 'produces antibodies', context: 'immune system' },
    { student: 'the blood cleans itself', cambridge: 'the kidneys filter the blood', context: 'excretion' },
  ],
  chemistry: [
    { student: 'more collisions', cambridge: 'more frequent successful collisions', context: 'rates' },
    { student: 'energy needed', cambridge: 'minimum energy required', context: 'activation energy' },
    { student: 'sharing electrons', cambridge: 'sharing of electron pairs', context: 'covalent bonding' },
    { student: 'swapping electrons', cambridge: 'transfer of electrons', context: 'ionic bonding' },
    { student: 'gets electrons', cambridge: 'gains electrons / is reduced', context: 'electrolysis cathode' },
    { student: 'gives H+ ions', cambridge: 'proton donor', context: 'Bronsted-Lowry acid (A Level)' },
    { student: 'amount of acid', cambridge: 'concentration of H+ ions', context: 'pH' },
    { student: 'reaction stops', cambridge: 'rate of forward reaction equals rate of reverse reaction', context: 'equilibrium' },
    { student: 'the catalyst makes it faster', cambridge: 'the catalyst provides an alternative reaction pathway with a lower activation energy', context: 'catalysis' },
    { student: 'dissolves', cambridge: 'dissociates into ions', context: 'electrolytes' },
    { student: 'rusting', cambridge: 'oxidation of iron in the presence of water and oxygen', context: 'corrosion' },
    { student: 'burns', cambridge: 'undergoes combustion', context: 'energetics' },
    { student: 'gives off heat', cambridge: 'exothermic — enthalpy change is negative', context: 'energetics' },
    { student: 'takes in heat', cambridge: 'endothermic — enthalpy change is positive', context: 'energetics' },
    { student: 'the atom is stable', cambridge: 'the atom has a full outer electron shell', context: 'bonding' },
    { student: 'strong bond', cambridge: 'high bond energy', context: 'energetics' },
    { student: 'particles expand', cambridge: 'particles move further apart', context: 'states of matter' },
  ],
  physics: [
    { student: 'weight is how heavy', cambridge: 'weight is a force measured in newtons', context: 'forces' },
    { student: 'velocity is speed', cambridge: 'velocity is speed in a given direction', context: 'motion' },
    { student: 'force times distance', cambridge: 'force multiplied by distance moved in the direction of the force', context: 'work done' },
    { student: 'amount of energy', cambridge: 'rate of energy transfer', context: 'power' },
    { student: 'force on area', cambridge: 'force per unit area', context: 'pressure' },
    { student: 'particles move', cambridge: 'particles oscillate about a fixed point', context: 'waves' },
    { student: 'flow of electrons', cambridge: 'rate of flow of charge', context: 'current' },
    { student: 'energy is lost', cambridge: 'energy is dissipated to the surroundings', context: 'energy transfers' },
    { student: 'energy is used up', cambridge: 'energy is transferred', context: 'energy conservation' },
    { student: 'no forces acting', cambridge: 'resultant force is zero / forces are balanced', context: 'equilibrium' },
    { student: 'gets hotter', cambridge: 'internal energy increases / average kinetic energy of particles increases', context: 'thermal physics' },
    { student: 'heat rises', cambridge: 'hot fluid is less dense and rises', context: 'convection' },
    { student: 'the wire resists', cambridge: 'the component has resistance', context: 'electricity' },
    { student: 'bounces back', cambridge: 'is reflected', context: 'waves' },
    { student: 'bends', cambridge: 'is refracted', context: 'waves' },
  ],
};

// ─────────────────────────────────────────────
// HUMANITIES DIALECT
// ─────────────────────────────────────────────

const HUMANITIES_DIALECT = {
  history: [
    { student: 'because of', cambridge: 'this was significant because', context: 'causation' },
    { student: 'it happened because', cambridge: 'the primary/immediate cause was', context: 'causation' },
    { student: 'this led to', cambridge: 'this was a catalyst for / this precipitated', context: 'consequences' },
    { student: 'everyone thought', cambridge: 'contemporary opinion suggests / sources indicate', context: 'evidence' },
    { student: 'it was good/bad', cambridge: 'it can be argued that this was beneficial/detrimental because', context: 'evaluation' },
    { student: 'the most important reason', cambridge: 'arguably the most significant factor was... however, it must be considered that', context: 'evaluation' },
    { student: 'I think', cambridge: 'the evidence suggests', context: 'analysis' },
  ],
  economics: [
    { student: 'demand changes', cambridge: 'quantity demanded changes / demand curve shifts', context: 'demand theory' },
    { student: 'prices go up', cambridge: 'there is inflationary pressure / the price level rises', context: 'inflation' },
    { student: 'the economy grows', cambridge: 'real GDP increases', context: 'economic growth' },
    { student: 'people lose jobs', cambridge: 'unemployment rises / there is structural/cyclical unemployment', context: 'unemployment' },
    { student: 'the government spends more', cambridge: 'expansionary fiscal policy is implemented', context: 'fiscal policy' },
    { student: 'it depends', cambridge: 'the outcome depends on the magnitude of... relative to...', context: 'evaluation' },
    { student: 'supply and demand are equal', cambridge: 'quantity demanded equals quantity supplied at the equilibrium price', context: 'equilibrium' },
    { student: 'the market fails', cambridge: 'there is a misallocation of resources / market failure occurs due to', context: 'market failure' },
  ],
  geography: [
    { student: 'the river gets bigger', cambridge: 'discharge increases downstream', context: 'river processes' },
    { student: 'the land wears away', cambridge: 'erosion occurs through hydraulic action / abrasion / attrition', context: 'erosion' },
    { student: 'people move to cities', cambridge: 'rural-to-urban migration occurs due to push-pull factors', context: 'urbanisation' },
    { student: 'the environment is damaged', cambridge: 'environmental degradation occurs / biodiversity is reduced', context: 'environmental management' },
    { student: 'it rains more', cambridge: 'precipitation increases', context: 'climate' },
  ],
  pakistan_studies: [
    { student: 'Pakistan was created because', cambridge: 'the key factors that led to the creation of Pakistan include', context: 'independence movement' },
    { student: 'the Two-Nation Theory says', cambridge: 'the Two-Nation Theory, as articulated by Allama Iqbal and later adopted by Jinnah, posits that', context: 'ideology' },
    { student: 'it was important because', cambridge: 'its significance lies in the fact that', context: 'significance' },
  ],
};

// ─────────────────────────────────────────────
// ENGLISH DIALECT
// ─────────────────────────────────────────────

const ENGLISH_DIALECT = [
  { student: 'the writer uses a metaphor', cambridge: 'the writer employs the metaphor "[quote]" to convey', context: 'technique identification' },
  { student: 'this is effective', cambridge: 'this creates a sense of... / this evokes', context: 'effect analysis' },
  { student: 'it makes the reader think', cambridge: 'the reader is compelled to consider / this prompts the reader to reflect on', context: 'reader response' },
  { student: 'the mood is sad', cambridge: 'the writer establishes a melancholic / sombre tone through', context: 'mood/tone' },
  { student: 'the word means', cambridge: 'the word connotes / the connotations of this word suggest', context: 'language analysis' },
  { student: 'in the poem', cambridge: 'the poet / the speaker', context: 'poetry analysis — never say "in the poem"' },
  { student: 'the story is about', cambridge: 'the narrative explores the theme of', context: 'theme analysis' },
  { student: 'the character is nice/mean', cambridge: 'the character is portrayed as benevolent/antagonistic through', context: 'characterisation' },
  { student: 'it says', cambridge: 'the text states / the extract reveals', context: 'textual reference' },
  { student: 'at the start', cambridge: 'initially / at the outset of the text', context: 'structure' },
  { student: 'at the end', cambridge: 'the denouement / in the concluding lines', context: 'structure' },
  { student: 'the writer repeats', cambridge: 'the writer employs repetition of "[X]" to emphasise', context: 'techniques' },
  { student: 'both texts are about', cambridge: 'while both texts address the theme of..., Text A does so through... whereas Text B', context: 'comparison' },
];

// ─────────────────────────────────────────────
// MATHS DIALECT
// ─────────────────────────────────────────────

const MATHS_DIALECT = [
  { student: 'the answer is', cambridge: '[show working] = [answer] [units]', context: 'all calculations' },
  { student: 'I used the formula', cambridge: 'State the formula, substitute values, show working line-by-line', context: 'method marks' },
  { student: 'round to 2 dp', cambridge: 'give your answer correct to 3 significant figures unless otherwise stated', context: 'accuracy' },
  { student: 'it goes up', cambridge: 'the function is increasing / the gradient is positive', context: 'graph analysis' },
  { student: 'the graph is steep', cambridge: 'the rate of change is high / the gradient is large', context: 'graph analysis' },
  { student: 'the lines cross', cambridge: 'the simultaneous solution / the point of intersection', context: 'simultaneous equations' },
  { student: 'the answer proves it', cambridge: 'hence shown / QED (do not use the given answer in your working)', context: 'show that questions' },
];

// ─────────────────────────────────────────────
// BUSINESS / ACCOUNTING DIALECT
// ─────────────────────────────────────────────

const BUSINESS_DIALECT = [
  { student: 'the business makes money', cambridge: 'revenue exceeds costs / the business generates a profit', context: 'profitability' },
  { student: 'the business grows', cambridge: 'the business experiences organic/external growth', context: 'growth strategies' },
  { student: 'workers are happy', cambridge: 'employee motivation increases / job satisfaction improves', context: 'HRM' },
  { student: 'customers want it', cambridge: 'there is market demand / consumer demand exists for', context: 'marketing' },
  { student: 'it costs too much', cambridge: 'the cost exceeds the budget / there is a negative cost-benefit outcome', context: 'finance' },
  { student: 'they should do X', cambridge: 'it is recommended that the business [X] because... however, this depends on', context: 'evaluation' },
  { student: 'profit goes up', cambridge: 'net profit margin increases', context: 'ratio analysis' },
];

// ─────────────────────────────────────────────
// SUPREME EXAMINER PERSONA
// The injection that transforms Starky into
// a Cambridge Principal Examiner
// ─────────────────────────────────────────────

const SUPREME_EXAMINER_PERSONA = `SUPREME EXAMINER PERSONA — ACTIVE

You are no longer just a tutor. You are a Cambridge Principal Examiner with 20 years of marking experience.

Your standards:
1. PRECISION IS NON-NEGOTIABLE. If a student writes "the enzyme is killed" you do not let it slide. You stop, correct it to "denatured", and explain that this single word is the difference between 0 and 1 mark.

2. COMMAND WORDS ARE LAW. If the question says "Explain" and the student only describes, you call it out immediately: "You described what happens but not WHY. You have answered a different question. This costs you marks."

3. MARK SCHEME LANGUAGE IS THE CURRENCY. You know exactly which phrases Cambridge accepts and which it rejects. You teach students to write in Cambridge dialect — the precise register that earns marks.

4. YOU MARK LIKE AN EXAMINER. Not "good try!" — instead: "Mark 1: awarded. Mark 2: not awarded — you wrote 'more collisions' but the mark scheme requires 'more frequent successful collisions'. Mark 3: not awarded — activation energy was not mentioned."

5. YOU ARE WARM BUT RIGOROUS. You never make a student feel stupid. But you never let imprecision pass. The warmth is in HOW you correct, not in WHETHER you correct. Every correction is an act of care — you are preventing mark loss on exam day.

6. YOU THINK IN MARK POINTS. Every answer has a fixed number of mark points. You can see them. You teach students to see them too. "This is a 3-mark question. That means Cambridge wants 3 distinct points. You gave 2. Here is the third one you missed."

7. YOU QUOTE EXAMINER REPORTS. When a student makes a common mistake, you say: "Cambridge examiners specifically note that students always lose marks here by doing exactly what you just did." Then you show them the correct version.

8. YOU BUILD EXAM MUSCLE MEMORY. You don't just correct — you make students rewrite. "Write that sentence again using the Cambridge phrase." Repetition builds the neural pathways that fire automatically in the exam hall.

This persona applies to every interaction. Even casual questions get precise answers. A student asks "what is osmosis?" — you don't say "water moving through a membrane." You say: "The net movement of water molecules from a region of higher water potential to a region of lower water potential through a partially permeable membrane. Every word in that sentence is a mark point. Miss one, lose a mark."`;

// ─────────────────────────────────────────────
// LOOKUP FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Get all dialect corrections for a subject
 */
function getDialectBySubject(subject) {
  const s = subject.toLowerCase().trim().replace(/\s+/g, '_');
  const entries = [];
  // Add universal rules
  entries.push(...UNIVERSAL_DIALECT);
  // Add subject-specific
  if (SCIENCE_DIALECT[s]) entries.push(...SCIENCE_DIALECT[s].map(d => ({ ...d, type: 'science' })));
  if (HUMANITIES_DIALECT[s]) entries.push(...HUMANITIES_DIALECT[s].map(d => ({ ...d, type: 'humanities' })));
  if (s.includes('english') || s.includes('literature')) entries.push(...ENGLISH_DIALECT.map(d => ({ ...d, type: 'english' })));
  if (s.includes('math') || s.includes('statistics')) entries.push(...MATHS_DIALECT.map(d => ({ ...d, type: 'maths' })));
  if (s.includes('business') || s.includes('account') || s.includes('commerce')) entries.push(...BUSINESS_DIALECT.map(d => ({ ...d, type: 'business' })));
  // Fallback: try broader categories
  if (entries.length <= UNIVERSAL_DIALECT.length) {
    if (['biology', 'chemistry', 'physics'].some(sci => s.includes(sci))) {
      const key = ['biology', 'chemistry', 'physics'].find(sci => s.includes(sci));
      if (SCIENCE_DIALECT[key]) entries.push(...SCIENCE_DIALECT[key].map(d => ({ ...d, type: 'science' })));
    }
    if (['history', 'economics', 'geography', 'pakistan'].some(h => s.includes(h))) {
      const key = Object.keys(HUMANITIES_DIALECT).find(k => s.includes(k.replace('_', '')));
      if (key && HUMANITIES_DIALECT[key]) entries.push(...HUMANITIES_DIALECT[key].map(d => ({ ...d, type: 'humanities' })));
    }
  }
  return entries;
}

/**
 * Scan student text for dialect violations and return corrections
 */
function checkDialect(subject, studentText) {
  const corrections = [];
  const text = studentText.toLowerCase();
  const dialect = getDialectBySubject(subject);

  for (const entry of dialect) {
    if (entry.student && text.includes(entry.student.toLowerCase())) {
      corrections.push({
        found: entry.student,
        required: entry.cambridge,
        context: entry.context || '',
      });
    }
  }
  return corrections;
}

/**
 * Build a dialect injection for Starky's system prompt
 */
function getDialectInjection(subject) {
  const dialect = getDialectBySubject(subject);
  const subjectEntries = dialect.filter(d => d.student && d.cambridge);
  if (!subjectEntries.length) return '';

  const corrections = subjectEntries.slice(0, 15).map(d =>
    `"${d.student}" → "${d.cambridge}"${d.context ? ` (${d.context})` : ''}`
  ).join('\n');

  return `\n\nCAMBRIDGE DIALECT — ${subject.toUpperCase()}:
When this student writes any of these phrases, correct them to the Cambridge version:
${corrections}
Every correction is a mark saved on exam day.`;
}

module.exports = {
  UNIVERSAL_DIALECT,
  SCIENCE_DIALECT,
  HUMANITIES_DIALECT,
  ENGLISH_DIALECT,
  MATHS_DIALECT,
  BUSINESS_DIALECT,
  SUPREME_EXAMINER_PERSONA,
  getDialectBySubject,
  checkDialect,
  getDialectInjection,
};
