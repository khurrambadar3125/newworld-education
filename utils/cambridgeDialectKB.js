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

// ─────────────────────────────────────────────
// CAMBRIDGE MARKING PHILOSOPHY
// How Cambridge examiners actually think
// ─────────────────────────────────────────────

const CAMBRIDGE_MARKING_PHILOSOPHY = {
  corePhilosophy: "Cambridge mark schemes reward positive achievement. Examiners look for what students know, not what they don't.",
  markingConventions: {
    ECF: "Error Carried Forward — correct method using wrong earlier answer still earns marks",
    BOD: "Benefit of Doubt — ambiguous answers that could be correct get the mark",
    ORA: "Or Reverse Argument — valid reverse statement earns the mark",
    OWTTE: "Or Words To That Effect — concept matters not exact phrasing",
    levelOfResponse: "Extended writing is marked by quality of argument not quantity of points. Band 1 requires sustained argument with conclusion.",
  },
  markSchemeNotation: {
    "/": "Alternative accepted answers",
    ";": "Mark point boundary",
    "()": "Required clarification",
    "NOT": "Explicitly rejected — scores 0",
    "IGNORE": "Neither gains nor loses marks",
    "DO NOT ALLOW": "Contradicts Cambridge understanding — must be corrected",
  },
};

// ─────────────────────────────────────────────
// CAMBRIDGE DIALECT — Full precision entries
// Every concept Cambridge tests with exact
// accepted/rejected phrases
// ─────────────────────────────────────────────

const CAMBRIDGE_DIALECT = [
  // ═══ BIOLOGY ═══
  {
    concept: 'osmosis',
    cambridgeAccepts: ['net movement of water molecules from a region of higher water potential to a region of lower water potential through a partially permeable membrane', 'net movement of water molecules', 'partially permeable membrane', 'water potential gradient'],
    cambridgeRejects: ['water moves', 'from dilute to concentrated', 'semi-permeable membrane', 'movement of water'],
    markSchemeNote: 'All three components required — missing "net" loses 1 mark, missing "water molecules" loses 1 mark, missing "partially permeable" loses 1 mark.',
    subject: 'biology',
    level: 'o_level',
  },
  {
    concept: 'enzyme denaturation',
    cambridgeAccepts: ['denatured', 'active site changes shape', 'tertiary structure is altered', 'enzyme is denatured'],
    cambridgeRejects: ['killed', 'destroyed', 'broken down', 'dies', 'stops working'],
    markSchemeNote: 'Enzymes are proteins, not living organisms. They cannot be "killed". Only "denatured" is accepted.',
    subject: 'biology',
    level: 'o_level',
  },
  {
    concept: 'enzyme specificity',
    cambridgeAccepts: ['complementary shape to the substrate', 'active site is complementary in shape', 'enzyme-substrate complex'],
    cambridgeRejects: ['lock and key', 'fits perfectly', 'matches the substrate'],
    markSchemeNote: 'Lock and key may get 1 mark at O Level only — scores 0 at A Level. "Complementary shape" is the required phrase.',
    subject: 'biology',
    level: 'o_level',
  },
  {
    concept: 'active transport',
    cambridgeAccepts: ['movement against the concentration gradient', 'requires ATP', 'requires energy from respiration', 'active process using energy'],
    cambridgeRejects: ['uphill', 'requires energy', 'uses energy to move things'],
    markSchemeNote: 'At A Level, "requires energy" alone is insufficient — must specify ATP or energy from respiration. Must state "against concentration gradient".',
    subject: 'biology',
    level: 'o_level',
  },
  {
    concept: 'mitosis outcome',
    cambridgeAccepts: ['two genetically identical cells', 'two genetically identical daughter cells', 'diploid cells'],
    cambridgeRejects: ['identical cells', 'same cells', 'clones', 'copies'],
    markSchemeNote: 'Must say "genetically identical" — "identical" or "same" alone does not score.',
    subject: 'biology',
    level: 'o_level',
  },
  {
    concept: 'photosynthesis energy',
    cambridgeAccepts: ['light energy', 'light energy absorbed by chlorophyll', 'light energy converted to chemical energy'],
    cambridgeRejects: ['energy', 'heat energy', 'sun energy', 'solar energy'],
    markSchemeNote: 'Must specify "light energy" — "energy" alone is too vague and will not score.',
    subject: 'biology',
    level: 'o_level',
  },
  {
    concept: 'haemoglobin and oxygen',
    cambridgeAccepts: ['haemoglobin combines with oxygen to form oxyhaemoglobin', 'haemoglobin associates with oxygen', 'binds to oxygen'],
    cambridgeRejects: ['carries oxygen', 'absorbs oxygen', 'holds oxygen'],
    markSchemeNote: '"Combines with" is the precise term. "Carries" is everyday language that may not score full marks at IGCSE.',
    subject: 'biology',
    level: 'o_level',
  },
  {
    concept: 'diffusion',
    cambridgeAccepts: ['net movement of particles from a region of higher concentration to a region of lower concentration', 'net movement down a concentration gradient'],
    cambridgeRejects: ['movement of particles', 'particles spread out', 'things move from high to low'],
    markSchemeNote: 'Must include "net" and "concentration gradient". Missing "net" loses the first mark.',
    subject: 'biology',
    level: 'o_level',
  },
  {
    concept: 'respiration energy',
    cambridgeAccepts: ['energy released', 'energy is released from glucose', 'ATP produced'],
    cambridgeRejects: ['energy made', 'energy created', 'energy produced'],
    markSchemeNote: 'Energy is "released" not "made" or "produced". Energy cannot be created (conservation of energy).',
    subject: 'biology',
    level: 'o_level',
  },

  // ═══ CHEMISTRY ═══
  {
    concept: 'effect of temperature on rate',
    cambridgeAccepts: ['more frequent successful collisions', 'more particles have energy greater than or equal to activation energy', 'increased kinetic energy of particles'],
    cambridgeRejects: ['more collisions', 'particles move faster', 'reaction goes faster'],
    markSchemeNote: 'Two separate marks — collision frequency AND activation energy both required. "More collisions" without "successful" loses mark 1. Omitting activation energy loses mark 2.',
    subject: 'chemistry',
    level: 'o_level',
  },
  {
    concept: 'ionic bonding',
    cambridgeAccepts: ['transfer of electrons', 'electrostatic attraction between oppositely charged ions', 'metal loses electrons, non-metal gains electrons'],
    cambridgeRejects: ['sharing of electrons', 'gives electrons', 'attraction between ions'],
    markSchemeNote: 'Must say "oppositely charged" ions — "attraction between ions" alone is insufficient. Transfer NOT sharing.',
    subject: 'chemistry',
    level: 'o_level',
  },
  {
    concept: 'covalent bonding',
    cambridgeAccepts: ['sharing of a pair of electrons', 'shared pair of electrons', 'atoms share one or more pairs of electrons'],
    cambridgeRejects: ['sharing electrons', 'atoms share electrons'],
    markSchemeNote: 'Must say "pair of electrons" or "electron pairs" — "sharing electrons" without "pair" does not score.',
    subject: 'chemistry',
    level: 'o_level',
  },
  {
    concept: 'dynamic equilibrium',
    cambridgeAccepts: ['rate of forward reaction equals rate of reverse reaction', 'concentrations of reactants and products remain constant'],
    cambridgeRejects: ['reaction has stopped', 'concentrations are equal', 'balanced'],
    markSchemeNote: 'Must mention BOTH rates (forward AND reverse) as equal. Mentioning only one rate does not score.',
    subject: 'chemistry',
    level: 'o_level',
  },
  {
    concept: 'electrolysis cathode',
    cambridgeAccepts: ['reduction occurs at cathode', 'cations gain electrons at cathode', 'cathode is negative electrode'],
    cambridgeRejects: ['cathode is positive', 'anode is negative'],
    markSchemeNote: 'Must state BOTH gain electrons AND reduced for full marks. Cathode is NEGATIVE in electrolysis.',
    subject: 'chemistry',
    level: 'o_level',
  },
  {
    concept: 'acid definition O Level',
    cambridgeAccepts: ['substance that produces hydrogen ions in solution', 'produces H+ ions in aqueous solution'],
    cambridgeRejects: ['contains hydrogen', 'has H atoms'],
    markSchemeNote: 'Must say "produces H+ ions in solution" — "contains hydrogen" is insufficient.',
    subject: 'chemistry',
    level: 'o_level',
  },
  {
    concept: 'acid definition A Level',
    cambridgeAccepts: ['proton donor', 'species that donates H+', 'Bronsted-Lowry acid'],
    cambridgeRejects: ['produces H+ ions', 'gives H+ ions'],
    markSchemeNote: 'At A Level, "proton donor" is required (Bronsted-Lowry definition). O Level language does not score.',
    subject: 'chemistry',
    level: 'a_level',
  },
  {
    concept: 'catalyst',
    cambridgeAccepts: ['provides alternative reaction pathway with lower activation energy', 'lowers activation energy', 'alternative pathway'],
    cambridgeRejects: ['speeds up reaction', 'reduces energy needed', 'makes reaction faster'],
    markSchemeNote: '"Speeds up reaction" alone is insufficient. Must state "alternative pathway" AND "lower activation energy".',
    subject: 'chemistry',
    level: 'o_level',
  },

  // ═══ PHYSICS ═══
  {
    concept: 'weight vs mass',
    cambridgeAccepts: ['weight is a force measured in newtons', 'mass is amount of matter measured in kilograms', 'weight = mass × gravitational field strength'],
    cambridgeRejects: ['weight is how heavy something is', 'weight and mass are the same'],
    markSchemeNote: 'Weight is a FORCE (N). Mass is measured in kg. Must distinguish clearly.',
    subject: 'physics',
    level: 'o_level',
  },
  {
    concept: 'velocity vs speed',
    cambridgeAccepts: ['velocity is speed in a stated direction', 'velocity is a vector quantity', 'speed with direction'],
    cambridgeRejects: ['velocity is faster', 'velocity is the same as speed'],
    markSchemeNote: 'Must include "direction" — without it, the definition cannot distinguish velocity from speed.',
    subject: 'physics',
    level: 'o_level',
  },
  {
    concept: 'work done',
    cambridgeAccepts: ['force multiplied by distance moved in the direction of the force', 'W = Fd where d is in direction of force'],
    cambridgeRejects: ['force times distance', 'energy used'],
    markSchemeNote: '"In the direction of the force" is essential — without this qualifier the definition loses a mark.',
    subject: 'physics',
    level: 'o_level',
  },
  {
    concept: 'electric current',
    cambridgeAccepts: ['rate of flow of charge', 'charge per unit time', 'I = Q/t'],
    cambridgeRejects: ['flow of electrons', 'electricity flowing', 'electrons moving'],
    markSchemeNote: '"Rate of flow of CHARGE" not "flow of electrons". In electrolytes, ions carry current, not electrons.',
    subject: 'physics',
    level: 'o_level',
  },
  {
    concept: 'transverse waves',
    cambridgeAccepts: ['oscillations perpendicular to direction of energy transfer', 'vibrations at right angles to wave direction'],
    cambridgeRejects: ['waves go up and down', 'particles move up and down'],
    markSchemeNote: 'Must use "perpendicular" or "at right angles" to "direction of energy transfer".',
    subject: 'physics',
    level: 'o_level',
  },
  {
    concept: 'longitudinal waves',
    cambridgeAccepts: ['oscillations parallel to direction of energy transfer', 'compressions and rarefactions', 'vibrations along the direction of wave travel'],
    cambridgeRejects: ['waves go back and forth', 'particles push each other'],
    markSchemeNote: 'Must use "parallel" and ideally mention "compressions and rarefactions".',
    subject: 'physics',
    level: 'o_level',
  },
  {
    concept: 'power',
    cambridgeAccepts: ['rate of energy transfer', 'energy transferred per unit time', 'work done per unit time', 'P = W/t', 'P = E/t'],
    cambridgeRejects: ['amount of energy', 'how much energy', 'total energy'],
    markSchemeNote: '"Rate" is the key word. Power = energy per TIME. "Amount of energy" is energy, not power.',
    subject: 'physics',
    level: 'o_level',
  },

  // ═══ ECONOMICS ═══
  {
    concept: 'demand definition',
    cambridgeAccepts: ['quantity consumers are willing and able to buy at a given price', 'effective demand', 'willingness and ability to purchase'],
    cambridgeRejects: ['how much people want', 'amount bought', 'what people need'],
    markSchemeNote: 'Must include BOTH "willing" AND "able" AND "at a given price". Missing any one loses a mark.',
    subject: 'economics',
    level: 'o_level',
  },
  {
    concept: 'market equilibrium',
    cambridgeAccepts: ['quantity demanded equals quantity supplied', 'no excess demand or excess supply', 'market clearing price'],
    cambridgeRejects: ['demand equals supply', 'everything is sold', 'market is balanced'],
    markSchemeNote: 'Must say "quantity demanded" and "quantity supplied" — not "demand" and "supply".',
    subject: 'economics',
    level: 'o_level',
  },
  {
    concept: 'price elasticity of demand',
    cambridgeAccepts: ['percentage change in quantity demanded divided by percentage change in price', '%ΔQd / %ΔP'],
    cambridgeRejects: ['change in demand divided by change in price', 'how much demand changes with price'],
    markSchemeNote: 'Must be PERCENTAGE changes. Must say "quantity demanded" not "demand".',
    subject: 'economics',
    level: 'o_level',
  },
  {
    concept: 'inflation',
    cambridgeAccepts: ['sustained rise in the general price level', 'persistent increase in the general level of prices'],
    cambridgeRejects: ['prices rising', 'things getting more expensive', 'cost of living goes up'],
    markSchemeNote: 'Must include "sustained" (not temporary) and "general" (not one product). Both words are mark-earning.',
    subject: 'economics',
    level: 'o_level',
  },

  // ═══ ENGLISH ═══
  {
    concept: 'language analysis structure',
    cambridgeAccepts: ['identify technique, embed quotation, explain effect on reader', 'writer uses [technique] in "[quote]" which creates a sense of [effect]'],
    cambridgeRejects: ['technique identified without effect', 'this is effective', 'the writer uses a metaphor'],
    markSchemeNote: 'Must do ALL THREE: technique + quote + effect. 2 out of 3 does not score full marks. "This is effective" without explaining WHAT effect scores 0.',
    subject: 'english',
    level: 'o_level',
  },
  {
    concept: 'summary writing',
    cambridgeAccepts: ['points in own words', 'paraphrased content', 'concise and accurate'],
    cambridgeRejects: ['lifted phrases from passage', 'copied text', 'direct quotation in summary'],
    markSchemeNote: 'Lifted phrases score 0 even if content is correct. Must be in own words.',
    subject: 'english',
    level: 'o_level',
  },

  // ═══ MATHEMATICS ═══
  {
    concept: 'probability answers',
    cambridgeAccepts: ['value between 0 and 1', 'fraction', 'decimal between 0 and 1'],
    cambridgeRejects: ['percentage', 'greater than 1', 'ratio format'],
    markSchemeNote: 'Probability MUST be between 0 and 1. Percentage answers score 0 even if calculation is correct.',
    subject: 'mathematics',
    level: 'o_level',
  },
  {
    concept: 'show that questions',
    cambridgeAccepts: ['independent derivation working towards given answer', 'show every step of working', 'do not use given answer in working'],
    cambridgeRejects: ['circular argument using given answer', 'substituting the answer in', 'working backwards from answer'],
    markSchemeNote: 'Using the given answer in your working is a circular argument and scores 0 for ALL method marks.',
    subject: 'mathematics',
    level: 'o_level',
  },
];

// ─────────────────────────────────────────────
// CAMBRIDGE HIDDEN RULES
// The unwritten rules examiners enforce
// ─────────────────────────────────────────────

const CAMBRIDGE_HIDDEN_RULES = {
  chemistry: [
    'State symbols (s)(l)(g)(aq) required in all equations — missing = mark lost',
    'Write formula before substituting values in calculations',
    'Never change formulae when balancing — coefficients only',
    'Organic structures: every bond must be shown correctly',
    'Percentage yield and atom economy are different — confusing scores 0',
  ],
  physics: [
    'Units required on ALL numerical answers — correct answer without units loses final mark',
    'Ray diagrams must be ruled with directional arrows',
    'g = 9.8 N/kg unless question states otherwise — not 10',
    'Graph descriptions must quote specific values — "increases" alone is incomplete',
  ],
  biology: [
    'Never say "food" — say glucose in biological processes',
    'Osmosis refers to water only — never "glucose moves by osmosis"',
    'Cell surface membrane and cell wall are different structures',
    'Punnett squares must show gametes — missing gametes loses marks',
    'Mitosis order: interphase, prophase, metaphase, anaphase, telophase',
  ],
  economics: [
    'Diagram without labels scores 0 — every axis, curve and point must be labelled',
    'Evaluation requires conclusion — "it depends" alone is not a conclusion',
    'Shift OF curve vs movement ALONG curve — confusing loses marks',
    'Percentage change: always use original value as denominator',
  ],
  history: [
    'Narrative scores Band 3 maximum — analysis of significance reaches Band 1',
    'Every claim needs specific evidence: dates, names, events',
    'Counter-argument required for Band 1',
    'A Level: historiography expected — name a historian and engage with their interpretation',
    'Conclusion must be a definitive judgement',
  ],
  english_literature: [
    'Block quotations suggest imprecise selection — use embedded quotes',
    'Describing what happens = retelling = Band 3 maximum',
    'Context must be woven into analysis not a separate paragraph',
    'Effect on reader is the mark — technique without effect = half marks',
  ],
  mathematics: [
    'Show that: never use given answer in working — circular = 0',
    'Method marks available for wrong answers — always show working',
    'Round only at final answer — carry full precision through working',
    'Probability tree branches must sum to 1 at each node',
  ],
  accounting: [
    'Accounting equation must balance at every step',
    'Depreciation: deduct from asset AND show as expense — missing either loses marks',
    'Revenue vs capital expenditure distinction tested every year',
    'Ratio requires comparison to benchmark — ratio alone cannot earn evaluation marks',
    'Cash and profit are different — confusing is most penalised error',
  ],
  computer_science: [
    'Pseudocode must be consistent — mixing conventions loses marks',
    'Trace tables must show every variable change at every step',
    'Big O: simplified form only — O(n²) not O(2n²+3n)',
    'Binary conversion: show working — answer only scores 0',
  ],
};

module.exports = {
  UNIVERSAL_DIALECT,
  SCIENCE_DIALECT,
  HUMANITIES_DIALECT,
  ENGLISH_DIALECT,
  MATHS_DIALECT,
  BUSINESS_DIALECT,
  SUPREME_EXAMINER_PERSONA,
  CAMBRIDGE_MARKING_PHILOSOPHY,
  CAMBRIDGE_DIALECT,
  CAMBRIDGE_HIDDEN_RULES,
  getDialectBySubject,
  checkDialect,
  getDialectInjection,
};
