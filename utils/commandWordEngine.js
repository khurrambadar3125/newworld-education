// ============================================================
// COMMAND WORD ENGINE
// Complete Cambridge command word knowledge base.
// Every command word used across O and A Level with full
// definitions, mark signals, must-include requirements,
// mark-losing errors, weak/strong examples, and subject mapping.
//
// Source: Cambridge Assessment International Education
// Command Words defined in syllabi for O Level and A Level.
// ============================================================

const COMMAND_WORDS = [

  // ═══ LOW-DEMAND COMMAND WORDS (1–2 marks) ═══════════════════

  {
    word: 'state',
    definition: 'Express in clear terms — one fact, no explanation needed.',
    marksSignalled: '1 mark. Any explanation is wasted time.',
    mustInclude: ['single fact or term'],
    willLoseMarks: ['explanation', 'because', 'therefore'],
    weakExample: 'State the products of complete combustion. Answer: CO2 is produced because carbon is oxidised.',
    strongExample: 'CO2 and H2O',
    subjects: ['chemistry', 'physics', 'biology', 'mathematics', 'economics', 'business', 'computer_science', 'accounting', 'history', 'geography', 'islamiyat', 'pakistan_studies', 'sociology'],
  },

  {
    word: 'define',
    definition: 'Give the precise meaning of a term using subject-specific terminology.',
    marksSignalled: '1–2 marks. Every qualifying word in the definition matters.',
    mustInclude: ['precise technical definition', 'key qualifying words'],
    willLoseMarks: ['vague description', 'examples only'],
    weakExample: 'Define osmosis. Answer: when water moves through a membrane.',
    strongExample: 'Net movement of water molecules from a region of high water potential to low water potential through a partially permeable membrane.',
    subjects: ['chemistry', 'physics', 'biology', 'economics', 'business', 'computer_science', 'accounting', 'sociology'],
  },

  {
    word: 'name',
    definition: 'Identify something specifically — give the exact term, not a description.',
    marksSignalled: '1 mark. One or two words only.',
    mustInclude: ['specific name not description'],
    willLoseMarks: ['description instead of name'],
    weakExample: 'Name the organelle that produces energy. Answer: the one with the folds inside it.',
    strongExample: 'Mitochondrion',
    subjects: ['chemistry', 'physics', 'biology', 'economics', 'business', 'computer_science', 'accounting', 'history', 'geography'],
  },

  {
    word: 'give',
    definition: 'Provide a specific piece of information without explanation.',
    marksSignalled: '1 mark. Direct answer only.',
    mustInclude: ['direct answer'],
    willLoseMarks: ['unnecessary explanation'],
    weakExample: 'Give one use of copper. Answer: copper is used for electrical wiring because it is a good conductor of electricity and is ductile.',
    strongExample: 'Electrical wiring',
    subjects: ['chemistry', 'physics', 'biology', 'economics', 'business', 'computer_science', 'accounting', 'history', 'geography', 'islamiyat'],
  },

  {
    word: 'identify',
    definition: 'Select and name from given information or stimulus material.',
    marksSignalled: '1 mark. Must refer to the specific data/source given.',
    mustInclude: ['specific identification from stimulus'],
    willLoseMarks: ['general knowledge not from stimulus'],
    weakExample: 'Identify the trend from the graph. Answer: graphs usually show an increase.',
    strongExample: 'The rate of reaction increases steadily from 0 to 30 seconds, then levels off at 40 cm3.',
    subjects: ['chemistry', 'physics', 'biology', 'mathematics', 'economics', 'business', 'computer_science', 'accounting', 'history', 'geography'],
  },

  {
    word: 'list',
    definition: 'Write items one after another with no explanation.',
    marksSignalled: '1 mark per item. No sentences needed.',
    mustInclude: ['items listed clearly'],
    willLoseMarks: ['explanations added to items', 'connected prose when list is asked'],
    weakExample: 'List two greenhouse gases. Answer: Carbon dioxide is a greenhouse gas because it traps heat. Methane is another one.',
    strongExample: 'Carbon dioxide, methane',
    subjects: ['chemistry', 'physics', 'biology', 'economics', 'business', 'computer_science', 'geography'],
  },

  // ═══ MEDIUM-DEMAND COMMAND WORDS (2–4 marks) ════════════════

  {
    word: 'describe',
    definition: 'Say what happens or what something is like — NOT why it happens.',
    marksSignalled: '2–4 marks. Focus on observable features and data.',
    mustInclude: ['what happens', 'observable features', 'data quotes if graph given'],
    willLoseMarks: ['explanation of why', 'causes'],
    weakExample: 'Describe the graph. Answer: the rate increases because temperature rises.',
    strongExample: 'The rate increases from 2 cm3/s at 20\u00B0C to 8 cm3/s at 40\u00B0C. The rate doubles for every 10\u00B0C rise in temperature.',
    subjects: ['chemistry', 'physics', 'biology', 'mathematics', 'economics', 'english', 'business', 'computer_science', 'accounting', 'history', 'geography', 'islamiyat', 'pakistan_studies', 'sociology'],
  },

  {
    word: 'outline',
    definition: 'Give a brief description of the main points without detailed explanation.',
    marksSignalled: '2–3 marks. Breadth over depth.',
    mustInclude: ['key points only', 'no detail needed'],
    willLoseMarks: ['excessive detail'],
    weakExample: 'Outline the stages of mitosis. Answer: First, the DNA replicates and each chromosome consists of two sister chromatids joined at the centromere. The nuclear envelope then begins to break down...',
    strongExample: 'Prophase: chromosomes condense. Metaphase: chromosomes line up at equator. Anaphase: chromatids separate to poles. Telophase: nuclear envelope reforms.',
    subjects: ['chemistry', 'physics', 'biology', 'economics', 'business', 'computer_science', 'history', 'geography', 'sociology'],
  },

  {
    word: 'suggest',
    definition: 'Apply knowledge to an unfamiliar context — the answer is not directly in the syllabus.',
    marksSignalled: '2–3 marks. Credit logical reasoning even if unexpected.',
    mustInclude: ['logical application of principles', 'answer not directly in syllabus'],
    willLoseMarks: ['memorised answer', 'answer that ignores the context given'],
    weakExample: 'Suggest why the enzyme works better at pH 7. Answer: because enzymes work best at neutral pH.',
    strongExample: 'At pH 7 the active site shape is complementary to the substrate. The ionic bonds maintaining the active site shape are not disrupted at this pH.',
    subjects: ['chemistry', 'physics', 'biology', 'economics', 'english', 'business', 'computer_science', 'geography', 'sociology'],
  },

  {
    word: 'explain',
    definition: 'State what happens AND give reasons why, using connective words.',
    marksSignalled: '2–4 marks. One mark for what, one for why. Must link them.',
    mustInclude: ['what happens', 'why it happens', 'connective word: because/therefore/so/this means'],
    willLoseMarks: ['describe only \u2014 no why', 'why only \u2014 no what'],
    weakExample: 'Explain why diffusion is faster at higher temperatures. Answer: because particles have more energy.',
    strongExample: 'At higher temperatures particles have greater kinetic energy therefore they move faster. This means the concentration gradient is maintained and the rate of net movement from high to low concentration increases.',
    subjects: ['chemistry', 'physics', 'biology', 'mathematics', 'economics', 'english', 'business', 'computer_science', 'accounting', 'history', 'geography', 'islamiyat', 'pakistan_studies', 'sociology'],
  },

  {
    word: 'account for',
    definition: 'Give full reasons for something — explain all contributing factors.',
    marksSignalled: '3–4 marks. All contributing factors needed.',
    mustInclude: ['full causal explanation', 'all contributing factors'],
    willLoseMarks: ['partial explanation'],
    weakExample: 'Account for the fall in demand. Answer: people stopped buying it.',
    strongExample: 'Demand fell due to three factors: a 15% price increase reduced quantity demanded (law of demand), a substitute product launched at lower price, and consumer income fell during the recession reducing purchasing power.',
    subjects: ['economics', 'business', 'history', 'geography', 'sociology'],
  },

  {
    word: 'predict',
    definition: 'Use knowledge to forecast what will happen in a given situation.',
    marksSignalled: '1–2 marks. Must give reasoning if marks allow.',
    mustInclude: ['specific prediction', 'reasoning if marks allow'],
    willLoseMarks: ['vague answer', 'no figure if data given'],
    weakExample: 'Predict what happens. Answer: it will change.',
    strongExample: 'The pH will decrease below 7 because adding HCl increases the concentration of H+ ions in the solution.',
    subjects: ['chemistry', 'physics', 'biology', 'mathematics', 'economics', 'geography'],
  },

  {
    word: 'deduce',
    definition: 'Reach a conclusion by reasoning from given information or data.',
    marksSignalled: '2–3 marks. Must reference the data provided.',
    mustInclude: ['conclusion drawn FROM the data given', 'reference to the data'],
    willLoseMarks: ['general knowledge answer', 'conclusion not supported by data'],
    weakExample: 'Deduce which element is a metal. Answer: metals are shiny and conduct electricity.',
    strongExample: 'Element X must be a metal because the data shows it has high electrical conductivity (450 S/m) and a high melting point (1085\u00B0C), both characteristic of metallic bonding.',
    subjects: ['chemistry', 'physics', 'biology', 'mathematics', 'economics'],
  },

  // ═══ CALCULATION COMMAND WORDS ══════════════════════════════

  {
    word: 'calculate',
    definition: 'Work out a numerical answer — full working, correct units, correct significant figures.',
    marksSignalled: '2–4 marks. Method marks even if final answer wrong.',
    mustInclude: ['all working shown', 'correct units', 'correct significant figures'],
    willLoseMarks: ['answer only with no working', 'wrong or missing units', 'answer rounded incorrectly'],
    weakExample: 'Calculate speed. Answer: 5.',
    strongExample: 'speed = distance / time = 100 m / 20 s = 5 m/s',
    subjects: ['chemistry', 'physics', 'biology', 'mathematics', 'economics', 'business', 'computer_science', 'accounting'],
  },

  {
    word: 'determine',
    definition: 'Find a value from given data, a graph, or calculation.',
    marksSignalled: '2–3 marks. Must show how value was obtained.',
    mustInclude: ['value extracted from data', 'method shown', 'units'],
    willLoseMarks: ['no method shown'],
    weakExample: 'Determine the gradient. Answer: 2.',
    strongExample: 'gradient = \u0394y / \u0394x = (80 \u2212 20) / (30 \u2212 0) = 60 / 30 = 2.0 cm3/s',
    subjects: ['chemistry', 'physics', 'biology', 'mathematics', 'economics'],
  },

  {
    word: 'show that',
    definition: 'Prove a given statement is true with full working — do NOT use the given answer in your working.',
    marksSignalled: '2–4 marks. Answer alone = zero. Every step required.',
    mustInclude: ['full working leading to given answer', 'do not use the given answer in working'],
    willLoseMarks: ['assuming the answer in working', 'incomplete working'],
    weakExample: 'Show that x = 5. Answer: x = 5 as required.',
    strongExample: '2x + 3 = 13. Subtract 3: 2x = 10. Divide by 2: x = 5.',
    subjects: ['chemistry', 'physics', 'mathematics'],
  },

  {
    word: 'derive',
    definition: 'Arrive at a formula or relationship through logical mathematical steps from known equations.',
    marksSignalled: '3–4 marks. Every algebraic step must be shown.',
    mustInclude: ['starting equation stated', 'every algebraic step shown', 'final derived expression'],
    willLoseMarks: ['skipped steps', 'starting from the answer'],
    weakExample: 'Derive v = u + at. Answer: from the definition of acceleration.',
    strongExample: 'Acceleration a = (v \u2212 u) / t. Multiply both sides by t: at = v \u2212 u. Rearrange: v = u + at.',
    subjects: ['physics', 'mathematics'],
  },

  {
    word: 'estimate',
    definition: 'Give an approximate value using reasonable assumptions.',
    marksSignalled: '1–2 marks. Assumptions must be stated.',
    mustInclude: ['approximate value', 'assumptions stated'],
    willLoseMarks: ['no assumptions given', 'unreasonable estimate'],
    weakExample: 'Estimate the height of the building. Answer: quite tall.',
    strongExample: 'Assuming each floor is approximately 3 m high and the building has 10 floors, estimated height = 10 \u00D7 3 = 30 m.',
    subjects: ['physics', 'mathematics'],
  },

  {
    word: 'sketch',
    definition: 'Draw a diagram or graph showing the correct shape/trend with labels and key features.',
    marksSignalled: '2–3 marks. Shape and labels matter, exact values only if specified.',
    mustInclude: ['correct shape or trend', 'labelled axes or key features'],
    willLoseMarks: ['wrong shape', 'no labels', 'point-to-point straight lines on a curve'],
    weakExample: 'Sketch the graph. Answer: [unlabelled wiggly line].',
    strongExample: '[Smooth curve starting at origin, rising steeply then levelling off. X-axis: time/s, Y-axis: volume of gas/cm3. Asymptote labelled.]',
    subjects: ['chemistry', 'physics', 'biology', 'mathematics'],
  },

  {
    word: 'solve',
    definition: 'Find the value(s) of the unknown. Show all working and state all solutions.',
    marksSignalled: '2–4 marks. Method marks available.',
    mustInclude: ['all working shown', 'all solutions stated'],
    willLoseMarks: ['missing a solution', 'no working'],
    weakExample: 'Solve x\u00B2 = 9. Answer: x = 3.',
    strongExample: 'x\u00B2 = 9. x = \u00B13. Therefore x = 3 or x = \u22123.',
    subjects: ['mathematics', 'physics'],
  },

  {
    word: 'verify',
    definition: 'Check that a given answer is correct by substituting back or using an alternative method.',
    marksSignalled: '1–2 marks.',
    mustInclude: ['substitution or alternative method', 'confirmation statement'],
    willLoseMarks: ['repeating the same method', 'no conclusion'],
    weakExample: 'Verify x = 4. Answer: x = 4 is correct.',
    strongExample: 'Substituting x = 4 into LHS: 2(4) + 3 = 11. RHS = 11. LHS = RHS, so x = 4 is verified.',
    subjects: ['mathematics'],
  },

  {
    word: 'simplify',
    definition: 'Reduce an expression to its simplest form.',
    marksSignalled: '1–2 marks.',
    mustInclude: ['expression in simplest form', 'steps shown'],
    willLoseMarks: ['incomplete simplification', 'errors in algebra'],
    weakExample: 'Simplify 6x/3. Answer: 6x/3.',
    strongExample: '6x / 3 = 2x',
    subjects: ['mathematics'],
  },

  {
    word: 'factorise',
    definition: 'Write an expression as a product of its factors.',
    marksSignalled: '1–2 marks.',
    mustInclude: ['fully factorised expression'],
    willLoseMarks: ['incomplete factorisation', 'expanding instead'],
    weakExample: 'Factorise x\u00B2 + 5x + 6. Answer: x(x + 5) + 6.',
    strongExample: 'x\u00B2 + 5x + 6 = (x + 2)(x + 3)',
    subjects: ['mathematics'],
  },

  {
    word: 'hence',
    definition: 'Use the result from the PREVIOUS part to answer this part. Cannot use an independent method.',
    marksSignalled: '2–3 marks. Must build on prior working.',
    mustInclude: ['reference to previous result', 'method builds on prior answer'],
    willLoseMarks: ['independent method that ignores previous part', 'starting from scratch'],
    weakExample: 'Hence find the area. Answer: area = 1/2 \u00D7 base \u00D7 height = 1/2 \u00D7 10 \u00D7 6 = 30.',
    strongExample: 'From part (a), the height = 6 cm. Therefore area = 1/2 \u00D7 10 \u00D7 6 = 30 cm\u00B2.',
    subjects: ['mathematics', 'physics'],
  },

  // ═══ HIGH-DEMAND COMMAND WORDS (4–8+ marks) ═════════════════

  {
    word: 'evaluate',
    definition: 'Weigh arguments for AND against, then reach a justified conclusion.',
    marksSignalled: '4–8 marks. No conclusion = cannot access top band.',
    mustInclude: ['points FOR', 'points AGAINST', 'weighing of evidence', 'clear conclusion'],
    willLoseMarks: ['one-sided answer', 'no conclusion', 'conclusion not justified'],
    weakExample: 'Evaluate the use of nuclear power. Answer: Nuclear power is good because it produces a lot of energy.',
    strongExample: 'Nuclear power produces large amounts of energy with no CO2 emissions, addressing climate change. However waste remains radioactive for thousands of years and accidents like Chernobyl cause lasting environmental damage. On balance the long-term waste problem outweighs the short-term energy benefits unless safe storage can be guaranteed.',
    subjects: ['chemistry', 'physics', 'biology', 'economics', 'english', 'business', 'computer_science', 'history', 'geography', 'islamiyat', 'pakistan_studies', 'sociology'],
  },

  {
    word: 'assess',
    definition: 'Weigh evidence and reach a judgement about importance, significance, or effectiveness.',
    marksSignalled: '4–8 marks. Must judge relative importance.',
    mustInclude: ['evidence for multiple viewpoints', 'weighing of relative importance', 'clear judgement'],
    willLoseMarks: ['description without judgement', 'no conclusion'],
    weakExample: 'Assess the importance of the Lahore Resolution. Answer: It was very important.',
    strongExample: 'The Lahore Resolution (1940) was a turning point because it formally demanded a separate Muslim state, unifying the Muslim League behind one goal. However some argue the 1937 election losses were more important as they proved Congress would not protect Muslim interests. On balance, the Resolution was the most significant single event as it gave the Pakistan movement a clear constitutional objective.',
    subjects: ['economics', 'business', 'history', 'geography', 'islamiyat', 'pakistan_studies', 'sociology'],
  },

  {
    word: 'discuss',
    definition: 'Thorough examination of all aspects of a topic with evidence and multiple perspectives.',
    marksSignalled: '4–8 marks. Must be balanced.',
    mustInclude: ['multiple perspectives', 'developed points with evidence', 'balanced treatment'],
    willLoseMarks: ['one-sided treatment', 'list of points without development'],
    weakExample: 'Discuss the effects of deforestation. Answer: Deforestation is bad because it kills animals.',
    strongExample: 'Deforestation reduces biodiversity as habitats are destroyed, with an estimated 80% of terrestrial species relying on forests. It also increases atmospheric CO2 as carbon sinks are removed. However, it provides agricultural land for growing populations and timber for economic development. In developing countries, the economic pressure often outweighs environmental concerns in the short term.',
    subjects: ['chemistry', 'physics', 'biology', 'economics', 'english', 'business', 'computer_science', 'history', 'geography', 'islamiyat', 'pakistan_studies', 'sociology'],
  },

  {
    word: 'justify',
    definition: 'Give reasons to support a decision or conclusion, linked to the specific context.',
    marksSignalled: '3–6 marks. Reasons must be evidence-based.',
    mustInclude: ['specific reasons linked to context', 'evidence to support position'],
    willLoseMarks: ['unsupported assertion', 'reasons not linked to context'],
    weakExample: 'Justify the use of renewable energy. Answer: because it is better.',
    strongExample: 'Renewable energy is justified for this island community because: (1) importing fossil fuels costs $2M/year which solar would eliminate after 5-year payback, (2) the island receives 2400 hours of sunshine annually making solar viable, (3) energy independence protects against supply disruption from storms that block shipping.',
    subjects: ['chemistry', 'physics', 'biology', 'economics', 'english', 'business', 'computer_science', 'history', 'geography', 'islamiyat', 'sociology'],
  },

  {
    word: 'analyse',
    definition: 'Break something down into its component parts and examine each, showing how they relate.',
    marksSignalled: '4–6 marks. Must examine relationships.',
    mustInclude: ['identification of components', 'examination of each', 'relationships between components'],
    willLoseMarks: ['description only', 'no examination of relationships'],
    weakExample: 'Analyse the population pyramid. Answer: it shows different age groups.',
    strongExample: 'The pyramid has a wide base (0\u201314: 35%) indicating high birth rate, narrowing sharply at 15\u201364 (55%) suggesting high mortality or emigration, and a very narrow top (65+: 10%). The wide base combined with the narrow middle suggests a developing country with high dependency ratio, which strains healthcare and education resources.',
    subjects: ['chemistry', 'physics', 'biology', 'economics', 'english', 'business', 'computer_science', 'history', 'geography', 'sociology'],
  },

  {
    word: 'examine',
    definition: 'Look at something carefully and in detail with critical engagement.',
    marksSignalled: '4–6 marks.',
    mustInclude: ['detailed treatment', 'critical engagement with evidence'],
    willLoseMarks: ['superficial treatment'],
    weakExample: 'Examine the causes of inflation. Answer: prices go up.',
    strongExample: 'Demand-pull inflation occurs when aggregate demand exceeds aggregate supply \u2014 for example during economic booms when consumer spending and investment rise. Cost-push inflation results from rising production costs such as oil price increases. In the given case, the data shows wages rising 8% while output grew only 2%, indicating cost-push inflation as the dominant factor.',
    subjects: ['economics', 'business', 'history', 'geography', 'sociology'],
  },

  {
    word: 'compare',
    definition: 'Identify similarities AND differences \u2014 both items must be addressed in every point.',
    marksSignalled: '3\u20136 marks. Must use comparative language.',
    mustInclude: ['explicit similarity statements', 'explicit difference statements', 'both items addressed in each point'],
    willLoseMarks: ['only similarities', 'only differences', 'describing each separately without comparing'],
    weakExample: 'Compare mitosis and meiosis. Answer: Mitosis produces 2 cells. Meiosis produces 4 cells.',
    strongExample: 'Both mitosis and meiosis begin with DNA replication. However mitosis produces 2 genetically identical diploid cells whereas meiosis produces 4 genetically different haploid cells. Mitosis is used for growth and repair while meiosis produces gametes for sexual reproduction.',
    subjects: ['chemistry', 'physics', 'biology', 'economics', 'english', 'business', 'computer_science', 'accounting', 'history', 'geography', 'sociology'],
  },

  {
    word: 'contrast',
    definition: 'Identify ONLY the differences between two things.',
    marksSignalled: '2\u20134 marks. Differences only.',
    mustInclude: ['explicit differences only', 'both items addressed'],
    willLoseMarks: ['similarities included'],
    weakExample: 'Contrast arteries and veins. Answer: Arteries carry blood. Veins also carry blood.',
    strongExample: 'Arteries have thick muscular walls to withstand high pressure, whereas veins have thin walls with valves to prevent backflow. Arteries carry blood away from the heart under high pressure, while veins return blood to the heart under low pressure.',
    subjects: ['chemistry', 'physics', 'biology', 'economics', 'business', 'history', 'geography', 'sociology'],
  },

  {
    word: 'distinguish between',
    definition: 'State the key difference that separates two things.',
    marksSignalled: '2\u20133 marks. The defining difference.',
    mustInclude: ['the defining difference', 'both items named'],
    willLoseMarks: ['similarities', 'vague answer'],
    weakExample: 'Distinguish between speed and velocity. Answer: they are different.',
    strongExample: 'Speed is a scalar quantity (magnitude only) while velocity is a vector quantity (magnitude AND direction). An object moving at constant speed in a circle has changing velocity because its direction changes.',
    subjects: ['chemistry', 'physics', 'biology', 'economics', 'business', 'computer_science', 'accounting'],
  },

  {
    word: 'to what extent',
    definition: 'Argue both for and against a statement, then conclude with the degree to which you agree.',
    marksSignalled: '6\u20138 marks. Must qualify \u2014 not simply agree or disagree.',
    mustInclude: ['argument for the statement', 'argument against or qualifying the statement', 'conclusion stating the extent with justification'],
    willLoseMarks: ['simple yes/no answer', 'no qualification', 'no conclusion'],
    weakExample: 'To what extent was the Treaty of Versailles fair? Answer: It was not fair.',
    strongExample: 'The Treaty was fair to an extent: Germany had caused massive destruction and reparations reflected the damage. However the \u00A36.6 billion reparations crippled the German economy, and the war guilt clause ignored shared responsibility. The disarmament terms also left Germany vulnerable. On balance, the punitive approach was disproportionate and ultimately counterproductive as it fuelled resentment that contributed to WWII.',
    subjects: ['economics', 'english', 'business', 'history', 'geography', 'islamiyat', 'pakistan_studies', 'sociology'],
  },

  {
    word: 'how far do you agree',
    definition: 'Same structure as "to what extent" \u2014 argue both sides, reach a qualified judgement.',
    marksSignalled: '6\u20138 marks. Must show both agreement and disagreement.',
    mustInclude: ['agreement with reasons', 'disagreement or qualification with reasons', 'overall judgement'],
    willLoseMarks: ['no qualification', 'no conclusion'],
    weakExample: 'How far do you agree that education reduces poverty? Answer: I agree completely.',
    strongExample: 'Education does reduce poverty by increasing human capital and earning potential \u2014 UNESCO data shows each year of schooling increases earnings by 10%. However education alone is insufficient: structural barriers like corruption, lack of infrastructure, and economic instability limit its impact. In countries with strong institutions, education is the primary driver; in fragile states, other interventions must come first.',
    subjects: ['economics', 'english', 'business', 'history', 'geography', 'islamiyat', 'pakistan_studies', 'sociology'],
  },

  {
    word: 'comment on',
    definition: 'Give an informed opinion with reasons, referencing data if provided.',
    marksSignalled: '2\u20134 marks. Not just description.',
    mustInclude: ['opinion', 'reasons', 'reference to data if given'],
    willLoseMarks: ['description only', 'opinion without reasoning'],
    weakExample: 'Comment on the data. Answer: the data shows numbers.',
    strongExample: 'The data shows a 25% decline in biodiversity index from 2010 to 2020. This is concerning because it exceeds the predicted 15% decline, suggesting conservation measures have been less effective than expected. The steepest drop (2015\u20132017) coincides with the expansion of palm oil plantations in the region.',
    subjects: ['economics', 'english', 'business', 'history', 'geography', 'sociology'],
  },

  // ═══ BUSINESS & ECONOMICS SPECIFIC ══════════════════════════

  {
    word: 'recommend',
    definition: 'Make a choice or decision with clear justification, weighing alternatives.',
    marksSignalled: '4\u20136 marks. Must justify the choice over alternatives.',
    mustInclude: ['clear recommendation', 'justification linked to context', 'consideration of alternatives'],
    willLoseMarks: ['no justification', 'ignoring alternatives', 'not linked to case study'],
    weakExample: 'Recommend a pricing strategy. Answer: they should use competitive pricing.',
    strongExample: 'I recommend penetration pricing because the market has two established competitors and the product has no unique features. This will attract price-sensitive customers and build market share quickly. Cost-plus pricing was considered but rejected as the firm needs volume to achieve economies of scale.',
    subjects: ['economics', 'business'],
  },

  {
    word: 'advise',
    definition: 'Give a course of action with clear reasons, related to the specific context.',
    marksSignalled: '4\u20136 marks. Must be context-specific.',
    mustInclude: ['specific course of action', 'reasons linked to context'],
    willLoseMarks: ['generic advice', 'not linked to case study'],
    weakExample: 'Advise the business. Answer: they should advertise more.',
    strongExample: 'I advise expanding into the online market because: the case study shows 60% of their target demographic (18\u201325) shop online, current revenue is declining 8% annually from physical stores, and the initial investment of $50,000 has a projected payback period of 18 months based on the sales forecast provided.',
    subjects: ['economics', 'business', 'accounting'],
  },

  // ═══ ENGLISH & HUMANITIES SPECIFIC ══════════════════════════

  {
    word: 'explore',
    definition: 'Investigate a topic in depth, considering multiple angles, evidence, and interpretations.',
    marksSignalled: '4\u20138 marks. Show breadth and depth.',
    mustInclude: ['multiple angles', 'evidence from text', 'developed interpretations'],
    willLoseMarks: ['single perspective', 'surface-level treatment', 'no textual evidence'],
    weakExample: 'Explore how the writer creates tension. Answer: the writer uses short sentences.',
    strongExample: 'Tension is created through a combination of short, declarative sentences ("He stopped. Listened. Nothing.") which mirror the character\'s fragmented thought process, and the semantic field of darkness ("shadow", "void", "engulfed") which creates a claustrophobic atmosphere. The shift to present tense in paragraph 3 further heightens immediacy.',
    subjects: ['english', 'history', 'islamiyat', 'pakistan_studies', 'sociology'],
  },

  {
    word: 'measure',
    definition: 'Use an appropriate instrument to find a value. State the instrument and method.',
    marksSignalled: '1\u20132 marks.',
    mustInclude: ['instrument named', 'method described'],
    willLoseMarks: ['wrong instrument', 'no method'],
    weakExample: 'Measure the length. Answer: use a ruler.',
    strongExample: 'Measure the diameter of the wire using a micrometer screw gauge. Close the jaws gently on the wire and read the main scale and thimble scale. Take readings at three different points and calculate the mean.',
    subjects: ['physics', 'chemistry', 'biology'],
  },

  {
    word: 'prove',
    definition: 'Construct a formal logical argument with every step justified.',
    marksSignalled: '3\u20135 marks. Formal proof required.',
    mustInclude: ['stated assumptions', 'every logical step justified', 'conclusion clearly stated'],
    willLoseMarks: ['skipped steps', 'unjustified leaps', 'circular reasoning'],
    weakExample: 'Prove that the sum of angles in a triangle is 180\u00B0. Answer: we know it is 180\u00B0.',
    strongExample: 'Draw line PQ through vertex A parallel to BC. Angle PAB = angle ABC (alternate angles, PQ \u2225 BC). Angle QAC = angle ACB (alternate angles). Angles PAB + BAC + QAC = 180\u00B0 (angles on a straight line). Therefore ABC + BAC + ACB = 180\u00B0.',
    subjects: ['mathematics'],
  },
];


// ═══ EXAM TECHNIQUE RULES ═════════════════════════════════════

const EXAM_TECHNIQUE_RULES = [
  '1 mark = approximately 1 minute of writing time.',
  'Explain = must include because/therefore/so/this means or no second mark.',
  'Compare = must address BOTH items in every point \u2014 not describe each separately.',
  'Evaluate = must reach a conclusion or loses top marks.',
  'Describe a graph = must quote specific values with units.',
  'Calculate = always show formula first, then substitution, then answer with units.',
  'Show that = never use the given answer in your working.',
  'Suggest = answer must come from context, not memorised facts.',
  'Extended writing = plan before you write, even 2 minutes saves marks.',
  'Running out of time = write key points as bullet list \u2014 partial credit given.',
  'Always check: have I answered what was actually asked?',
  'Command word determines structure \u2014 identify it before writing a word.',
];


// ═══ HELPER FUNCTIONS ═════════════════════════════════════════

/**
 * Get full command word object by word string.
 * Returns null if not found.
 */
function getCommandWord(word) {
  if (!word) return null;
  const lower = word.toLowerCase().trim();
  return COMMAND_WORDS.find(cw => cw.word === lower) || null;
}

/**
 * Get all command words relevant to a subject.
 */
function getCommandWordsBySubject(subject) {
  if (!subject) return [];
  const lower = subject.toLowerCase().trim();
  return COMMAND_WORDS.filter(cw => cw.subjects.includes(lower));
}

/**
 * Returns all exam technique rules.
 */
function getTechniqueRules() {
  return EXAM_TECHNIQUE_RULES;
}

/**
 * Scans a student's message for Cambridge command words.
 * Returns an array of full command word objects for each detected word.
 * Only matches command words that appear in question-like contexts.
 */
function detectCommandWords(message) {
  if (!message || typeof message !== 'string') return [];

  const lower = message.toLowerCase();
  const detected = [];
  const seen = new Set();

  for (const cw of COMMAND_WORDS) {
    if (seen.has(cw.word)) continue;

    // Match the command word in contexts where it's likely a question instruction:
    // - Start of message or after line break
    // - After "question says", "it asks", "I need to", "how do I", "I have to"
    // - Inside quotes (student quoting the question)
    // - After question marks or colons
    const escaped = escapeRegex(cw.word);
    const patterns = [
      new RegExp(`(?:^|\\n|[?:;]\\s*)${escaped}\\b`, 'i'),
      new RegExp(`(?:question|asks?|need to|have to|told to|supposed to|wants? me to)\\s+${escaped}\\b`, 'i'),
      new RegExp(`["'\`]\\s*${escaped}\\b`, 'i'),
      new RegExp(`\\b${escaped}\\s+(?:the|how|why|what|this|these|those|each|two|three|four|five|one|a |an )`, 'i'),
    ];

    if (patterns.some(p => p.test(lower))) {
      detected.push(cw);
      seen.add(cw.word);
    }
  }

  return detected;
}

/**
 * Returns a prompt injection string for detected command words,
 * or empty string if none found. Uses the rich mustInclude/willLoseMarks data.
 */
function getCommandWordInjection(message) {
  const detected = detectCommandWords(message);
  if (!detected.length) return '';

  const lines = detected.map(d => {
    let injection = `- Command word "${d.word.toUpperCase()}": ${d.definition}`;
    injection += `\n  Marks signalled: ${d.marksSignalled}`;
    injection += `\n  Student MUST include: ${d.mustInclude.join('; ')}`;
    injection += `\n  Student WILL LOSE marks if: ${d.willLoseMarks.join('; ')}`;
    if (d.strongExample) {
      injection += `\n  Strong answer example: "${d.strongExample}"`;
    }
    return injection;
  }).join('\n');

  return `\n\n[COMMAND WORD DETECTION]\nThe student is answering a question with Cambridge command word(s) detected:\n${lines}\nIf the student's answer doesn't meet these requirements, correct them BEFORE marking. Explain exactly what the command word demands and how their answer falls short.`;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


module.exports = {
  COMMAND_WORDS,
  EXAM_TECHNIQUE_RULES,
  getCommandWord,
  getCommandWordsBySubject,
  getTechniqueRules,
  detectCommandWords,
  getCommandWordInjection,
};
