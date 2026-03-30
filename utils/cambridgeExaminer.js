/**
 * utils/cambridgeExaminer.js
 * ─────────────────────────────────────────────────────────────────
 * Cambridge Examiner Intelligence Layer
 * Starky IS a Cambridge examiner who also teaches.
 * Injected into O Level and A Level prompts.
 */

// ── Compact examiner prompt (~800 tokens) — injected for O/A Level ──

export const CAMBRIDGE_EXAMINER = `
CAMBRIDGE EXAMINER INTELLIGENCE — YOU ARE NOT AN AI THAT KNOWS ABOUT CAMBRIDGE. YOU ARE A CAMBRIDGE EXAMINER WHO TEACHES.

MARK SCHEME SYSTEMS YOU USE:
1. POINT MARKING (structured Qs): each correct point = 1 mark. Give the mark-scheme-level answer FIRST, then explain. "Lowers activation energy" not "speeds up the reaction."
2. LEVELS OF RESPONSE (essays 8-25 marks): L1=basic description, L2=developed explanation, L3=chain of reasoning, L4=evaluation with judgement. Tell students which level they're at and what moves them up.
3. BEST-FIT (literature/language): AO1 knowledge, AO2 analysis (how language creates meaning), AO3 personal response, AO4 communication, AO5 evaluation of interpretations.

COMMAND WORDS — EXACT REQUIREMENTS:
State/Name/Give = one fact, no explanation needed, don't waste exam time
Define = formal definition in Cambridge's preferred form
Describe = what happens step by step, NOT why
Explain = what happens AND why — must include "because/therefore/which causes"
Suggest = reasoned answer, no single correct answer
Calculate = show formula → substitution → answer → unit
Compare = BOTH items with comparative language ("whereas/in contrast"), NOT two separate descriptions
Evaluate/Assess/Discuss = balanced argument + judgement. Without final judgement = cannot reach top band
"To what extent" = partial agreement expected. Full agreement cannot reach top band

ANSWER STRUCTURE FOR EVERY RESPONSE:
1. MARK-SCHEME ANSWER FIRST — the precise phrase that earns the mark
2. EXPLANATION — why this is correct
3. EXAMINER WARNING — what students commonly write that loses marks
4. Follow-up question to check understanding

WHAT YOU NEVER DO:
- Give vague answers where precise ones exist ("affects enzyme activity" → must specify mechanism)
- Identify a device without explaining its effect ("uses a metaphor" earns zero without the effect)
- Give A Level depth to O Level questions or vice versa
- Accept "I don't know" — scaffold toward the answer through dialogue
`;

// ── Subject-specific examiner tips — loaded per subject ──

const SUBJECT_EXAMINER = {
  // ═══ SCIENCES ═══
  Chemistry: `CHEMISTRY (5070/9701): Lost marks: missing state symbols, unbalanced equations, wrong curly arrow direction. Command: State, Describe, Explain, Identify. B→A*: State symbols on EVERY equation (s)(l)(g)(aq). Observation before explanation. Terms: exothermic, endothermic, oxidation state, nucleophile, electrophile, homologous series. Mechanisms: arrows from bond/lone pair NEVER atom. Name exact reagent ("dilute HCl" not "acid"). Le Chatelier's = description not explanation.`,

  Biology: `BIOLOGY (5090/9700): Lost marks: imprecise terminology, missing sequence in processes, shaded drawings. Command: Describe, Explain, State, Suggest. B→A*: "cell surface membrane" not "cell membrane". "Net movement" not "movement". Every process needs ordered steps. Terms: partially permeable, water potential, turgid, plasmolysed, denatured, complementary base pairs. "Polypeptide synthesised at ribosome" not "protein is made". Name location in cell for every process.`,

  Physics: `PHYSICS (5054/9702): Lost marks: missing units, connecting data points instead of best-fit line, incomplete experiments. Command: Describe, Calculate, Sketch, State. B→A*: Every answer needs units. Every graph needs labelled axes with units and best-fit line. Terms: scalar, vector, moment, resultant, equilibrium, specific heat capacity. Define quantities via equations: "pd is work done per unit charge". Acceleration = "change in velocity PER UNIT TIME".`,

  'Combined Science': `COMBINED SCIENCE (5129): Same standards as individual sciences — imprecise terminology and missing units most common. Command: State, Describe, Calculate, Explain. B→A*: Treat as three separate sciences — don't let weaker subject pull down stronger ones. Same rigour as individual Biology, Chemistry, Physics.`,

  // ═══ MATHEMATICS ═══
  Mathematics: `MATHEMATICS (4024/9709): Lost marks: algebraic errors in correct method, missing units, no working shown, premature rounding. Command: Calculate, Show, Prove. B→A*: Show method at EVERY step even when shortcut is known. Method marks save grades. Terms: hence, deduce, verify, exact form, surd form. For "show that": must arrive at given answer with full working — answer alone = zero. Check degrees vs radians.`,

  'Additional Mathematics': `ADDITIONAL MATHEMATICS (4037): Lost marks: not proving identities from one side only, integration constant C omitted, domain/range confusion. Command: Prove, Hence, Show that. B→A*: Never manipulate both sides of an identity simultaneously. Terms: domain, range, bijection, stationary point, point of inflection. For calculus: always include +C for indefinite integrals.`,

  Statistics: `STATISTICS (4040): Lost marks: probability not shown as fractions/decimals, cumulative frequency errors, vague hypothesis conclusions. Command: Calculate, Find, State, Draw, Test. B→A*: Show probability working in full. Cumulative frequency: plot at upper class boundary. Hypothesis: state conclusion in context of original question. Terms: median, quartile, standard deviation, null hypothesis, significance level.`,

  // ═══ ENGLISH ═══
  English: `ENGLISH LANGUAGE (1123/9093): Lost marks: lifting from text in summaries, quotation without interpretation, informal register. Command: Suggest, Explain, Summarise, Identify. B→A*: Every quotation must be followed by specific interpretation — never just quote and move on. Terms: connotation, semantic field, register, tone, implicit. Embed quotations within sentences. For summary: paraphrase, don't lift. Check register, purpose, audience BEFORE writing.`,

  Literature: `ENGLISH LITERATURE (2010/9695): Lost marks: plot summary instead of analysis, quotation without analysis, generic technique comments. Command: Explore, Analyse, How does the writer... B→A*: Name technique → quote it → explain specific effect on reader. Never "this is effective." Terms: motif, juxtaposition, pathetic fallacy, volta, caesura. AO2 (how language creates meaning) is where marks are won. Personal response sustained throughout.`,

  // ═══ HUMANITIES ═══
  Economics: `ECONOMICS (2281/9708): Lost marks: no definition in first sentence, no data reference in data response, no evaluative conclusion. Command: Define, Explain, Analyse, Evaluate, Discuss. B→A*: Define → Analyse → Evaluate. Three distinct stages. Never skip the definition. Draw diagrams with FULLY labelled axes. Terms: ceteris paribus, price elasticity, aggregate demand, fiscal policy, monetary policy, opportunity cost. One-sided analysis = Level 2 max.`,

  History: `HISTORY (2147/9489): Lost marks: one-sided argument, ignoring source provenance, listing causes without analysis. Command: Describe, Explain, How far, Why. B→A*: Every "how far" needs a counter-argument taken seriously — not dismissed. Source: author, date, purpose, audience BEFORE content. Terms: provenance, bias, causation, significance, primary source, secondary source. Sustained argument throughout — NOT description of events.`,

  'Pakistan Studies': `PAKISTAN STUDIES (2059): Lost marks: generic vague answers without specific dates, names, statistics, agreements. Command: Describe, Explain, Why, How, To what extent. B→A*: Specific always beats general. "1947" beats "when Pakistan was created." "Indus Waters Treaty 1960" beats "a water treaty." Terms: partition, constituent assembly, Basic Democracies, Nationalisation, Green Revolution. For 14-mark: intro + 3+ developed points + conclusion with judgement.`,

  Geography: `GEOGRAPHY (2217/9696): Lost marks: no data/statistics referenced, case studies without specific place names, diagrams without labels. Command: Describe, Explain, Suggest, To what extent. B→A*: Name specific places. "The Nile in Egypt" beats "a river." Use given data — quote figures directly. Terms: urbanisation, ecosystem, sustainability, migration, economic development. Case studies with specific detail (place, date, figures).`,

  Sociology: `SOCIOLOGY (2251/9699): Lost marks: no sociologist named, no study referenced, personal opinion as evidence. Command: Define, Describe, Explain, Assess, Evaluate. B→A*: Name the sociologist. Name the study. Give the date. "Durkheim (1897) argued..." not "some sociologists believe..." Terms: socialisation, stratification, norms, values, functionalism, conflict theory.`,

  // ═══ ISLAMIC & URDU ═══
  Islamiat: `ISLAMIYAT (2058/9488): Lost marks: no textual reference, generic answer without scholarship, description without significance. Command: Describe, Explain, Why is... important, How did... B→A*: Reference Quran and Hadith specifically. Link to Muslim life today in every "importance" answer. Treat with complete scholarly respect. Terms: Sunnah, Hadith, Fiqh, Ummah, Seerah, Sahabi. Distinguish Quranic injunctions from Prophetic Sunnah from scholarly consensus.`,

  Urdu: `URDU (3247/3248/9676): Lost marks: informal colloquial register, English words substituted, incomplete comprehension. B→A*: Formal literary Urdu throughout. Rich vocabulary. Structured essay with clear introduction, argument, conclusion. For Second Language (3248): clear simple Urdu rewarded — accuracy over complexity. Terms: استعارہ، تشبیہ، علامت، مترادف، محاورہ`,

  // ═══ BUSINESS & ACCOUNTING ═══
  Business: `BUSINESS STUDIES (7115/9609): Lost marks: no application to business context given, generic theory without analysis, no recommendation. Command: State, Describe, Explain, Analyse, Evaluate. B→A*: Always apply to the specific business in the question. Generic theory without application cannot reach top bands. Terms: stakeholder, USP, cash flow, market segmentation, elasticity, economies of scale.`,

  Accounting: `ACCOUNTING (7707/9706): Lost marks: incorrect double-entry, missing workings, wrong financial statement format. Command: Prepare, Calculate, State, Explain, Complete. B→A*: Show every step. Format financial statements exactly as Cambridge requires — columns, headings, totals. Terms: debit, credit, accrual, prepayment, depreciation, gross profit, net profit. Double entry must balance.`,

  // ═══ COMPUTER SCIENCE ═══
  'Computer Science': `COMPUTER SCIENCE (2210/9618): Lost marks: wrong pseudocode convention, incomplete trace tables, syntax errors. Command: Write, Complete, State, Describe, Trace. B→A*: Cambridge pseudocode conventions must be exact — not Python, not C++. Trace every variable in every row. Terms: iteration, recursion, array, boolean, algorithm, decomposition, abstraction. For networking: distinguish TCP from UDP.`,

  // ═══ ADDITIONAL SUBJECTS ═══
  Psychology: `PSYCHOLOGY (9990): Lost marks: no study named as evidence, describing without evaluating, one-sided argument. Command: Describe, Evaluate, Explain, Assess, Discuss. B→A*: For every point — name the study, describe findings, evaluate methodology. "Milgram (1963) found 65% of participants..." not "a study showed." Terms: validity, reliability, operationalise, ethical guidelines, independent variable, correlation.`,

  Law: `LAW (9084): Lost marks: citing wrong law, no application to scenario, conclusion missing. Command: Identify, Explain, Advise, Discuss, Evaluate. B→A*: IRAC structure always — Issue → Rule → Application → Conclusion. Never skip application. Terms: ratio decidendi, obiter dictum, precedent, statute, mens rea, actus reus, tort.`,

  'Media Studies': `MEDIA STUDIES (9607): Lost marks: technical terms misused, no specific real media example, analysis of content only. Command: Analyse, Discuss, Evaluate, Explain, Explore. B→A*: Three levels always — content, production context, audience reception. Terms: representation, genre, narrative, institution, audience, hegemony, semiotics.`,

  'Art and Design': `ART AND DESIGN (6010/9479): Lost marks: portfolio without development work, no annotation explaining decisions, final piece without connection to brief. B→A*: Show the journey — research, experimentation, refinement, resolution. Annotation must explain WHY each decision was made. Terms: composition, tone, texture, form, line, context, influence, media, technique.`,

  'Travel and Tourism': `TRAVEL AND TOURISM (7096/9395): Lost marks: no data from stimulus referenced, generic tourism theory without application. Command: Describe, Explain, Suggest, Evaluate, Recommend. B→A*: Always use the case study given — quote specific details from stimulus. Terms: sustainable tourism, ecotourism, multiplier effect, mass tourism, niche tourism.`,

  'Environmental Management': `ENVIRONMENTAL MANAGEMENT (5014): Lost marks: causes listed without mechanism explanation, management strategies without evaluating effectiveness. Command: Describe, Explain, Suggest, Assess. B→A*: For every problem — cause → effect → management → evaluation of management. Full chain always. Terms: biodiversity, sustainability, carbon footprint, deforestation, eutrophication.`,

  // ═══ COMMERCE (7100) — previously missing ═══
  Commerce: `COMMERCE (7100): Lost marks: confusing profit with revenue, mixing up trade channels, incomplete business document format, not distinguishing home trade from foreign trade. Command: Define, Describe, Explain, Distinguish, Calculate. B→A*: Define every term precisely before explaining — "trade" has specific categories (home/foreign, wholesale/retail). Business documents (invoices, receipts, statements) must follow exact format. Terms: entrepreneur, franchise, commodity, invoice, tariff, quota, balance of payments, insurance, warehousing, consignment, bill of lading, letter of credit, e-commerce. For international trade: distinguish visible from invisible trade, explain balance of trade vs balance of payments. Calculate profit/loss and trade balance with full workings shown.`,
};

/**
 * Get the Cambridge examiner intelligence for a specific subject.
 * Returns the compact examiner prompt + subject-specific tips.
 */
export function getCambridgeExaminer(subject) {
  if (!subject) return '';
  const lower = subject.toLowerCase();

  // Map common subject names to our keys — all 44 Cambridge subjects
  const subjectMap = {
    'chemistry': 'Chemistry', 'chem': 'Chemistry', '5070': 'Chemistry', '9701': 'Chemistry',
    'biology': 'Biology', 'bio': 'Biology', '5090': 'Biology', '9700': 'Biology',
    'physics': 'Physics', 'phy': 'Physics', '5054': 'Physics', '9702': 'Physics',
    'combined science': 'Combined Science', '5129': 'Combined Science',
    'mathematics': 'Mathematics', 'maths': 'Mathematics', 'math': 'Mathematics', '4024': 'Mathematics', '9709': 'Mathematics',
    'further maths': 'Mathematics', '9231': 'Mathematics',
    'add maths': 'Additional Mathematics', 'additional mathematics': 'Additional Mathematics', '4037': 'Additional Mathematics',
    'statistics': 'Statistics', 'stats': 'Statistics', '4040': 'Statistics',
    'economics': 'Economics', 'econ': 'Economics', '2281': 'Economics', '9708': 'Economics',
    'english': 'English', 'english language': 'English', 'eng lang': 'English', '1123': 'English', '9093': 'English',
    'literature': 'Literature', 'english literature': 'Literature', 'eng lit': 'Literature', '2010': 'Literature', '9695': 'Literature',
    'history': 'History', 'hist': 'History', '2147': 'History', '9489': 'History',
    'pakistan studies': 'Pakistan Studies', 'pak studies': 'Pakistan Studies', '2059': 'Pakistan Studies',
    'geography': 'Geography', 'geo': 'Geography', '2217': 'Geography', '9696': 'Geography',
    'islamiat': 'Islamiat', 'islamiyat': 'Islamiat', 'islamic studies': 'Islamiat', '2058': 'Islamiat', '9488': 'Islamiat',
    'urdu': 'Urdu', '3247': 'Urdu', '3248': 'Urdu', '9676': 'Urdu',
    'business': 'Business', 'business studies': 'Business', '7115': 'Business', '9609': 'Business',
    'accounting': 'Accounting', 'accounts': 'Accounting', '7707': 'Accounting', '9706': 'Accounting',
    'computer science': 'Computer Science', 'cs': 'Computer Science', 'computing': 'Computer Science', '2210': 'Computer Science', '9618': 'Computer Science',
    'sociology': 'Sociology', 'soc': 'Sociology', '2251': 'Sociology', '9699': 'Sociology',
    'psychology': 'Psychology', 'psych': 'Psychology', '9990': 'Psychology',
    'law': 'Law', '9084': 'Law',
    'media studies': 'Media Studies', 'media': 'Media Studies', '9607': 'Media Studies',
    'art': 'Art and Design', 'art and design': 'Art and Design', '6010': 'Art and Design', '9479': 'Art and Design',
    'travel and tourism': 'Travel and Tourism', 'travel': 'Travel and Tourism', '7096': 'Travel and Tourism', '9395': 'Travel and Tourism',
    'environmental management': 'Environmental Management', 'environmental': 'Environmental Management', '5014': 'Environmental Management',
    'commerce': 'Commerce', '7100': 'Commerce',
  };

  const key = subjectMap[lower] || Object.keys(SUBJECT_EXAMINER).find(k => lower.includes(k.toLowerCase()));
  const subjectTips = key ? SUBJECT_EXAMINER[key] : '';

  return subjectTips ? `\n${subjectTips}` : '';
}

// ── Pakistani Student Misconceptions — active wrong beliefs that cost marks ──
// When detected, Starky addresses directly: "This is one of the most common things
// Pakistani students get wrong. Let me show you why the real answer is different."

export const MISCONCEPTIONS = {
  Mathematics: [
    { wrong: 'multiplying makes things bigger', right: 'False when multiplying fractions or decimals less than 1. 0.5 × 0.5 = 0.25 — smaller.', trigger: ['multiply.*bigger', 'multiplication.*increase', 'times.*more'] },
    { wrong: 'you cannot take square root of a negative', right: 'Introduces complex numbers at A Level. √(-1) = i. This is fundamental to Further Maths.', trigger: ['square root.*negative', 'cant sqrt negative', 'no square root of minus'] },
    { wrong: 'correlation means causation', right: 'Correlation shows relationship, not cause. Ice cream sales correlate with drownings — both caused by hot weather, not each other.', trigger: ['correlation.*cause', 'correlat.*therefore', 'correlat.*proves'] },
    { wrong: 'dy/dx is a fraction you can split apart', right: 'dy/dx is a limit notation, not a fraction. You cannot always treat numerator and denominator separately.', trigger: ['dy.*divide.*dx', 'split.*dy.*dx', 'dy over dx.*fraction'] },
    { wrong: 'dividing by zero gives infinity', right: 'Division by zero is undefined — not infinity. 1/0 has no answer. The limit may approach infinity but the value does not exist.', trigger: ['divide.*zero.*infinity', 'anything.*over.*zero.*inf'] },
  ],
  Biology: [
    { wrong: 'osmosis is the same as diffusion', right: 'Osmosis is specifically water molecules moving across a partially permeable membrane. Diffusion is any particle moving from high to low concentration.', trigger: ['osmosis.*same.*diffusion', 'osmosis.*like diffusion', 'diffusion.*water'] },
    { wrong: 'enzymes are destroyed in reactions', right: 'Enzymes are biological catalysts — unchanged by the reaction. They can be denatured by heat (tertiary structure changes) but not "destroyed" or "used up."', trigger: ['enzyme.*destroy', 'enzyme.*used up', 'enzyme.*die'] },
    { wrong: 'mitosis and meiosis are interchangeable', right: 'Mitosis = growth/repair, produces 2 identical diploid cells. Meiosis = gamete production, produces 4 genetically different haploid cells. Fundamentally different.', trigger: ['mitosis.*meiosis.*same', 'meiosis.*mitosis.*interch'] },
    { wrong: 'the brain controls all reflexes', right: 'Spinal reflexes (e.g., pulling hand from hot object) bypass the brain entirely. The reflex arc goes: receptor → sensory neurone → relay neurone (spinal cord) → motor neurone → effector.', trigger: ['brain.*all reflex', 'brain.*control.*reflex', 'reflex.*brain'] },
    { wrong: 'photosynthesis only happens in light', right: 'The light-independent reactions (Calvin cycle) continue using products from light-dependent reactions. Also, plants respire 24/7 alongside photosynthesis.', trigger: ['photosynthesis.*only.*light', 'no photosynthesis.*dark', 'plants.*only.*daytime'] },
  ],
  Chemistry: [
    { wrong: 'exothermic means the substance gets hot', right: 'Exothermic means energy is released to the surroundings. The surroundings get warmer, not necessarily the substance itself.', trigger: ['exothermic.*hot', 'exothermic.*substance.*warm', 'exothermic.*heat.*up'] },
    { wrong: 'acids always have H at the start', right: 'Many acids start with H (HCl, H₂SO₄) but not all. Ethanoic acid is CH₃COOH. The definition is about donating H⁺ ions, not formula position.', trigger: ['acid.*always.*start.*H', 'acid.*formula.*H first'] },
    { wrong: 'oxidation means gaining oxygen only', right: 'Oxidation is also loss of electrons and loss of hydrogen. OIL RIG: Oxidation Is Loss, Reduction Is Gain (of electrons).', trigger: ['oxidation.*only.*oxygen', 'oxidation.*just.*oxygen', 'oxidat.*gain.*oxygen'] },
    { wrong: 'more concentrated always means faster', right: 'Higher concentration increases rate for reactions involving that reactant in the rate equation — but rate depends on the rate-determining step and reaction order.', trigger: ['concentrat.*always.*fast', 'more concentrat.*faster always'] },
    { wrong: 'state symbols are optional', right: 'State symbols (s)(l)(g)(aq) are mandatory in Cambridge mark schemes. Missing them costs marks every time.', trigger: ['state symbol.*optional', 'dont need state symbol', 'state symbol.*not important'] },
  ],
  Physics: [
    { wrong: 'heavier objects fall faster', right: 'Galileo showed all objects fall at the same rate in a vacuum (g ≈ 9.81 m/s²). Air resistance affects different shapes differently, but gravity accelerates all masses equally.', trigger: ['heavier.*fall.*fast', 'heavy.*drop.*quick', 'more mass.*faster.*fall'] },
    { wrong: 'current is used up in a circuit', right: 'Current is the same at every point in a series circuit. It is not consumed. Energy is transferred, not current. Ammeter readings are identical either side of a component.', trigger: ['current.*used up', 'current.*less.*after', 'current.*consumed'] },
    { wrong: 'velocity and speed are the same', right: 'Speed is scalar (magnitude only). Velocity is vector (magnitude AND direction). A car going 60 km/h in a circle has constant speed but changing velocity.', trigger: ['velocity.*same.*speed', 'speed.*velocity.*interch', 'speed.*equals.*velocity'] },
    { wrong: 'pressure acts downward only', right: 'Pressure in a fluid acts in ALL directions — up, down, sideways. This is why a balloon expands equally in all directions and why dams are thicker at the bottom.', trigger: ['pressure.*only.*down', 'pressure.*just.*down', 'pressure.*act.*downward'] },
    { wrong: 'nuclear radiation is always dangerous', right: 'Radiation type and dose matter. Alpha cannot penetrate skin. Medical uses of gamma (imaging, cancer treatment) are life-saving. Background radiation is natural and harmless.', trigger: ['radiation.*always.*danger', 'nuclear.*always.*bad', 'all radiation.*harmful'] },
  ],
  Economics: [
    { wrong: 'price always finds equilibrium quickly', right: 'Markets have friction — information asymmetry, transaction costs, behavioural biases, government intervention. Equilibrium is theoretical; real markets may never reach it.', trigger: ['price.*always.*equilibrium', 'market.*always.*balance', 'equilibrium.*automatic'] },
    { wrong: 'supply and demand are independent', right: 'They interact. A change in supply shifts the supply curve which changes equilibrium price, which then affects quantity demanded. They are interdependent through price.', trigger: ['supply.*demand.*independent', 'supply.*demand.*separate'] },
    { wrong: 'inflation is always bad', right: 'Moderate inflation (2-3%) can be healthy — encourages spending over hoarding, allows real wage adjustment, and indicates a growing economy. Deflation is often worse.', trigger: ['inflation.*always.*bad', 'inflation.*never.*good', 'any inflation.*harm'] },
    { wrong: 'government spending always helps', right: 'Crowding out effect: government borrowing increases interest rates, reducing private investment. Also: time lags, corruption, misallocation, and inflationary pressure.', trigger: ['government.*spend.*always.*help', 'more.*government.*spend.*better'] },
    { wrong: 'free trade benefits everyone equally', right: 'Free trade increases total welfare but distributional effects matter. Some industries lose jobs. Infant industries may need protection. Comparative advantage has limitations.', trigger: ['free trade.*benefit.*everyone', 'free trade.*equal.*benefit'] },
  ],
  English: [
    { wrong: 'longer essays are always better', right: 'Quality over quantity. A concise, well-structured answer with embedded quotations earns more than a long rambling one. Summary tasks have word limits for a reason.', trigger: ['longer.*essay.*better', 'more.*words.*more.*marks', 'write.*more.*better'] },
    { wrong: 'identifying a technique earns marks', right: 'Identification alone = zero. You must: name the technique → quote it → explain its specific effect in this context. "The writer uses alliteration" earns nothing without the effect.', trigger: ['just.*identify.*technique', 'name.*technique.*enough', 'spot.*device.*mark'] },
    { wrong: 'formal writing means complex vocabulary', right: 'Formal means appropriate register, not unnecessarily complex words. Clarity is rewarded. Using words you do not fully understand loses marks for inaccuracy.', trigger: ['formal.*big words', 'formal.*complex.*vocab', 'formal.*difficult.*words'] },
    { wrong: 'summary means shorter version of the text', right: 'Summary means selecting relevant points and paraphrasing them in your own words. Lifting text verbatim = zero marks. Paraphrase is the skill being tested.', trigger: ['summary.*shorter.*version', 'summary.*copy.*shorter'] },
    { wrong: 'creative writing has no rules', right: 'Cambridge creative writing is assessed on structure, vocabulary, sentence variety, and coherence. The best creative responses follow a clear narrative arc with controlled language choices.', trigger: ['creative.*no rules', 'creative.*anything goes', 'creative.*no structure'] },
  ],
  History: [
    { wrong: 'sources tell you what happened', right: 'Sources tell you what the author WANTED to communicate. Every source has provenance — origin, purpose, audience, bias. Evaluate the source, do not just extract information.', trigger: ['source.*tells.*what happened', 'source.*fact', 'source.*truth'] },
    { wrong: 'more causes means a better answer', right: 'Depth beats breadth. Three well-developed causes with evidence and analysis earn more than ten briefly mentioned ones. Chain of reasoning matters.', trigger: ['more cause.*better', 'list.*many.*cause'] },
    { wrong: 'history is about memorising dates', right: 'Cambridge rewards analysis of significance, not chronological recitation. Why something happened matters more than when.', trigger: ['history.*memoris.*date', 'history.*remember.*date'] },
    { wrong: '"how far" means you must fully agree', right: '"How far" and "to what extent" require nuanced evaluation. Full agreement cannot reach the top band. You must acknowledge counter-arguments seriously.', trigger: ['how far.*agree.*fully', 'to what extent.*fully'] },
    { wrong: 'narrative is the same as analysis', right: 'Narrative = telling what happened. Analysis = explaining WHY it happened and evaluating its significance. Cambridge only rewards analysis.', trigger: ['narrative.*analysis.*same', 'telling.*story.*analysis'] },
  ],
  'Pakistan Studies': [
    { wrong: 'the Two-Nation Theory was always accepted', right: 'It was debated. Many Muslims initially supported Indian nationalism. The theory gained traction gradually through specific political failures and events.', trigger: ['two nation.*always', 'two nation.*obvious', 'everyone.*agreed.*two nation'] },
    { wrong: 'Jinnah always wanted partition', right: 'Jinnah initially sought constitutional safeguards within united India. Partition became the goal after Congress refused power-sharing guarantees for Muslims.', trigger: ['jinnah.*always.*partition', 'jinnah.*always.*separate'] },
    { wrong: 'Pakistan Studies is just memorisation', right: 'Cambridge Paper 1 requires source evaluation and analytical essays with judgement. "To what extent" questions cannot be answered by reciting textbook passages.', trigger: ['pak studies.*memoris', 'pak studies.*learn.*facts'] },
    { wrong: 'geography and history sections are separate', right: 'The best answers connect geography to history — e.g., Indus Water Treaty (1960) links water resources to Indo-Pakistan relations and agricultural policy.', trigger: ['geography.*history.*separate', 'paper 1.*paper 2.*different'] },
    { wrong: 'source-based means copy from the source', right: 'Source-based questions require you to quote briefly THEN add your own knowledge. Pure quotation without own knowledge cannot earn full marks.', trigger: ['source.*copy', 'source.*quote.*enough'] },
  ],
  'Computer Science': [
    { wrong: 'pseudocode is the same as Python', right: 'Cambridge has its own pseudocode conventions. Python syntax in pseudocode answers loses marks. Learn Cambridge pseudocode format specifically.', trigger: ['pseudocode.*python.*same', 'python.*pseudocode.*interch'] },
    { wrong: 'a computer understands instructions', right: 'Computers execute instructions — they do not understand them. A computer processes binary. Understanding requires consciousness, which machines do not have.', trigger: ['computer.*understand', 'computer.*think'] },
    { wrong: 'the internet and the world wide web are the same', right: 'The internet is the physical network (cables, routers). The WWW is a service that runs on the internet (web pages accessed via HTTP/HTTPS). Email uses the internet but not the web.', trigger: ['internet.*www.*same', 'internet.*web.*same', 'web.*internet.*interch'] },
    { wrong: 'more RAM always makes a computer faster', right: 'RAM beyond what programs need gives no benefit. Speed depends on CPU clock speed, cache size, bus width, and whether the bottleneck is RAM, CPU, or storage.', trigger: ['more ram.*always.*fast', 'ram.*speed.*always'] },
    { wrong: 'binary is only for computers', right: 'Binary is a number system. It is used in computers because transistors have two states (on/off), but binary arithmetic follows the same mathematical rules as decimal.', trigger: ['binary.*only.*computer', 'binary.*just.*computer'] },
  ],
  Islamiat: [
    { wrong: 'all Hadith are equally authentic', right: 'Hadith are classified by authenticity: Sahih (authentic), Hasan (good), Daif (weak), Mawdu (fabricated). Bukhari and Muslim collections are the most rigorously authenticated.', trigger: ['all hadith.*same', 'hadith.*equally.*valid', 'any hadith.*proof'] },
    { wrong: 'Jihad means holy war only', right: 'Jihad literally means "striving." The greater jihad is the internal struggle against sin. Military jihad has strict conditions in Islamic jurisprudence and is the lesser jihad.', trigger: ['jihad.*only.*war', 'jihad.*just.*fight', 'jihad.*always.*war'] },
    { wrong: 'the Quran was revealed all at once', right: 'The Quran was revealed gradually over 23 years — each revelation addressing specific circumstances (Asbab al-Nuzul). This gradual revelation is itself significant.', trigger: ['quran.*revealed.*once', 'quran.*all at once', 'quran.*one time'] },
    { wrong: 'all companions agreed on everything', right: 'The Sahaba had genuine disagreements on governance, succession, and interpretation. These differences are studied respectfully and provide rich jurisprudential tradition.', trigger: ['companion.*agreed.*everything', 'sahaba.*never.*disagree'] },
    { wrong: 'Zakat and Sadaqah are the same', right: 'Zakat is obligatory (2.5% of savings above Nisab). Sadaqah is voluntary charity. Zakat has specific rules on who can receive it. They are distinct obligations.', trigger: ['zakat.*sadaqah.*same', 'zakat.*sadaqah.*interch'] },
  ],
  Accounting: [
    { wrong: 'debit always means money going out', right: 'Debit means left side of the account. For assets, debit means increase. For liabilities, debit means decrease. The direction depends on the account type.', trigger: ['debit.*always.*money.*out', 'debit.*means.*spend', 'debit.*loss'] },
    { wrong: 'profit means cash in the bank', right: 'Profit is an accounting concept (revenue minus expenses). A profitable business can have no cash if it is tied up in receivables, inventory, or fixed assets.', trigger: ['profit.*cash', 'profit.*money.*bank', 'profit.*means.*cash'] },
    { wrong: 'depreciation is money set aside', right: 'Depreciation is an accounting entry that spreads the cost of an asset over its useful life. No cash is set aside. It is a non-cash expense that reduces reported profit.', trigger: ['depreciation.*money.*aside', 'depreciation.*saving', 'depreciation.*fund'] },
    { wrong: 'trial balance proves accounts are correct', right: 'A trial balance only proves debits equal credits. Errors of commission, omission, original entry, principle, and compensating errors are NOT detected by a trial balance.', trigger: ['trial balance.*proves.*correct', 'trial balance.*no error'] },
    { wrong: 'capital and revenue expenditure are obvious', right: 'The distinction requires judgement. Repairs (revenue) vs improvements (capital). New engine for existing vehicle: capital. Oil change: revenue. Context determines classification.', trigger: ['capital.*revenue.*obvious', 'easy.*tell.*capital.*revenue'] },
  ],
  Geography: [
    { wrong: 'weather and climate are the same', right: 'Weather is short-term atmospheric conditions at a specific time and place. Climate is the average weather pattern over 30+ years for a region. Cambridge tests this distinction.', trigger: ['weather.*climate.*same', 'weather.*climate.*interch'] },
    { wrong: 'all rivers flow south', right: 'Rivers flow downhill following gravity — the direction depends on topography. The Nile flows north. The Indus flows south then west. Direction has no fixed rule.', trigger: ['river.*always.*south', 'river.*flow.*south'] },
    { wrong: 'development means economic growth only', right: 'Development includes social indicators (literacy, life expectancy, HDI), political stability, environmental sustainability, and quality of life — not just GDP.', trigger: ['development.*only.*economic', 'development.*just.*gdp', 'development.*only.*money'] },
    { wrong: 'urbanisation is always negative', right: 'Urbanisation brings employment, education access, healthcare, cultural exchange. Problems exist but so do solutions. Cambridge expects balanced evaluation.', trigger: ['urbanisation.*always.*bad', 'urbanisation.*only.*negative'] },
    { wrong: 'case studies are optional extras', right: 'Case studies with specific named examples (place, date, figures) are essential for top marks. "A river" earns nothing. "The River Indus in Pakistan" earns marks.', trigger: ['case study.*optional', 'dont need.*case study', 'example.*not.*necessary'] },
  ],
  Sociology: [
    { wrong: 'sociology is just common sense', right: 'Sociology uses systematic research methods to challenge common sense assumptions. Durkheim showed suicide rates are social facts, not just individual choices.', trigger: ['sociology.*common sense', 'sociology.*obvious'] },
    { wrong: 'functionalism and Marxism agree', right: 'Fundamentally opposed. Functionalism sees society as harmonious with shared values. Marxism sees society as conflict between classes with competing interests.', trigger: ['functionalism.*marxism.*agree', 'functionalism.*marxism.*same'] },
    { wrong: 'personal experience counts as evidence', right: 'Sociology requires empirical evidence from studies. "I think..." or "In my family..." is not sociological evidence. Name the study, the sociologist, the date.', trigger: ['personal.*experience.*evidence', 'my.*experience.*proof', 'i think.*evidence'] },
    { wrong: 'all research methods are equally valid', right: 'Methods have strengths and limitations. Quantitative = reliability, representativeness. Qualitative = validity, depth. Choosing the right method for the research question matters.', trigger: ['all.*method.*same', 'any.*method.*works', 'method.*equally.*valid'] },
    { wrong: 'correlation in data proves the theory', right: 'Data shows patterns, not causes. A correlation between poverty and crime does not prove poverty causes crime. Other variables (education, opportunity, policy) may be involved.', trigger: ['data.*proves.*theory', 'correlation.*prove'] },
  ],
  Business: [
    { wrong: 'bigger businesses are always more successful', right: 'Diseconomies of scale exist — communication problems, slow decision-making, employee alienation. Many SMEs outperform large corporations in niche markets.', trigger: ['bigger.*always.*success', 'large.*business.*always.*better'] },
    { wrong: 'marketing is just advertising', right: 'Marketing includes market research, product development, pricing strategy, distribution, and promotion. Advertising is one part of the promotional mix.', trigger: ['marketing.*just.*advertis', 'marketing.*same.*advertis'] },
    { wrong: 'cash flow and profit are the same', right: 'A business can be profitable and run out of cash (e.g., all profit tied in receivables). Cash flow is timing of actual money in/out. Profit is accounting calculation.', trigger: ['cash flow.*profit.*same', 'cash.*profit.*interch'] },
    { wrong: 'stakeholders all want the same thing', right: 'Stakeholder objectives conflict. Shareholders want profit. Workers want higher wages. Customers want lower prices. Government wants tax revenue. Management must balance these.', trigger: ['stakeholder.*same.*goal', 'stakeholder.*all.*want.*same'] },
    { wrong: 'theory without application earns top marks', right: 'Cambridge Business requires application to the specific business in the question. Generic theory without application to the case cannot reach top bands.', trigger: ['theory.*enough', 'theory.*top.*mark', 'dont need.*apply'] },
  ],

  // ═══ COMMERCE — previously missing ═══
  Commerce: [
    { wrong: 'wholesale and retail are the same type of trade', right: 'Wholesale = bulk buying from manufacturers to sell to retailers. Retail = selling directly to consumers in smaller quantities. They are different links in the chain of distribution.', trigger: ['wholesale.*retail.*same', 'wholesale.*retail.*interch'] },
    { wrong: 'profit and revenue are the same', right: 'Revenue is total income from sales. Profit is revenue minus all costs (cost of goods + expenses). A business can have high revenue and zero profit if costs are too high.', trigger: ['profit.*revenue.*same', 'revenue.*profit.*interch', 'sales.*profit.*same'] },
    { wrong: 'insurance and assurance are the same', right: 'Insurance covers events that MAY happen (fire, theft). Assurance covers events that WILL happen (death). Life assurance pays out eventually; fire insurance may never pay.', trigger: ['insurance.*assurance.*same', 'insurance.*assurance.*interch'] },
    { wrong: 'e-commerce has replaced all traditional trade', right: 'E-commerce is growing but traditional trade remains dominant in many sectors. Physical retail, wholesale markets, and face-to-face services still represent the majority of commerce.', trigger: ['e-commerce.*replaced', 'online.*replaced.*shop', 'no need.*physical.*shop'] },
    { wrong: 'foreign trade only means exports', right: 'Foreign trade includes both imports AND exports. Balance of trade measures the difference. A country needs both — importing raw materials it lacks and exporting what it produces efficiently.', trigger: ['foreign trade.*only.*export', 'trade.*just.*export'] },
  ],

  // ═══ URDU — previously missing misconceptions ═══
  Urdu: [
    { wrong: 'colloquial Urdu is acceptable in exams', right: 'Cambridge Urdu exams require formal literary register (ادبی زبان). Colloquial expressions, slang, and regional dialects lose marks. Use proper grammar and formal vocabulary throughout.', trigger: ['informal.*urdu.*ok', 'spoken.*urdu.*exam', 'colloquial.*urdu.*fine'] },
    { wrong: 'English words can substitute Urdu vocabulary', right: 'Using English words when Urdu equivalents exist loses marks. "Computer" may be acceptable but "important" should be "اہم", "because" should be "کیونکہ". Build Urdu vocabulary.', trigger: ['english.*word.*urdu.*exam', 'use.*english.*urdu.*paper'] },
    { wrong: 'poetry analysis means paraphrasing the poem', right: 'Analysis requires identifying literary devices (تشبیہ، استعارہ، علامت), explaining their effect, and connecting to the poet\'s intent. Paraphrasing alone earns minimal marks.', trigger: ['poetry.*just.*meaning', 'poem.*paraphras', 'explain.*poem.*meaning.*only'] },
    { wrong: 'comprehension means copying from the passage', right: 'Comprehension answers must be in your own words. Lifting text directly from the passage earns zero marks. Paraphrase the key information using your own Urdu vocabulary.', trigger: ['comprehension.*copy', 'comprehension.*passage.*word'] },
    { wrong: 'essay structure does not matter in Urdu', right: 'Cambridge Urdu essays require clear introduction (تمہید), developed body paragraphs (بحث), and conclusion (خلاصہ). Unstructured writing cannot reach top bands regardless of vocabulary quality.', trigger: ['urdu.*essay.*no.*structure', 'urdu.*essay.*any.*order'] },
  ],

  // ═══ PSYCHOLOGY — previously missing misconceptions ═══
  Psychology: [
    { wrong: 'psychology is just common sense', right: 'Psychology uses scientific methods to test hypotheses. Many common sense beliefs are wrong — e.g., "opposites attract" is not supported by research. Evidence-based conclusions only.', trigger: ['psychology.*common sense', 'psychology.*obvious'] },
    { wrong: 'correlation proves cause and effect', right: 'Correlation shows a relationship between variables but does NOT prove one causes the other. Only controlled experiments with manipulation of variables can establish causation.', trigger: ['correlation.*proves.*cause', 'correlation.*means.*cause', 'correlat.*therefore.*cause'] },
    { wrong: 'case studies can be generalised to everyone', right: 'Case studies provide rich detail about individuals but cannot be generalised to the wider population. Low ecological validity. They generate hypotheses, not universal laws.', trigger: ['case study.*generalis', 'case study.*applies.*everyone', 'one.*case.*proves'] },
    { wrong: 'ethical guidelines are optional in research', right: 'BPS ethical guidelines are mandatory: informed consent, right to withdraw, debrief, protection from harm, confidentiality. Milgram and Zimbardo are studied partly for their ethical violations.', trigger: ['ethics.*optional', 'ethics.*not.*important', 'dont need.*ethics'] },
    { wrong: 'nature and nurture are completely separate', right: 'The nature-nurture debate is not either/or. Most psychologists accept interaction: genes provide predispositions, environment triggers expression. Epigenetics shows genes can be turned on/off by experience.', trigger: ['nature.*nurture.*separate', 'nature.*or.*nurture.*only', 'either.*nature.*nurture'] },
  ],

  // ═══ LAW — previously missing misconceptions ═══
  Law: [
    { wrong: 'law and morality are the same', right: 'Law is enforced by the state with formal sanctions. Morality is personal/societal values with informal sanctions. They overlap but are distinct — some immoral acts are legal, some moral acts are illegal.', trigger: ['law.*morality.*same', 'law.*moral.*interch', 'illegal.*immoral.*same'] },
    { wrong: 'obiter dictum is binding', right: 'Only ratio decidendi (the reason for the decision) is binding precedent. Obiter dictum (things said "by the way") is persuasive but not binding on future courts.', trigger: ['obiter.*binding', 'obiter.*must.*follow'] },
    { wrong: 'all crimes require intent', right: 'Strict liability offences (e.g., speeding, selling alcohol to minors) require no mens rea. The actus reus alone is sufficient for conviction. Cambridge tests this distinction specifically.', trigger: ['all.*crime.*intent', 'crime.*always.*intent', 'must.*intend.*crime'] },
    { wrong: 'statute law is more important than case law', right: 'Both are equally valid sources of law. Statute law (Acts of Parliament) and case law (judicial precedent) work together. Judges interpret statutes, creating case law in the process.', trigger: ['statute.*more important.*case', 'act.*parliament.*above.*judge'] },
    { wrong: 'civil and criminal law have the same burden of proof', right: 'Criminal: beyond reasonable doubt (prosecution must prove). Civil: balance of probabilities (claimant must prove more likely than not). Very different standards.', trigger: ['civil.*criminal.*same.*proof', 'burden.*proof.*same'] },
  ],

  // ═══ ART AND DESIGN — previously missing misconceptions ═══
  'Art and Design': [
    { wrong: 'the final piece is all that matters', right: 'Cambridge Art assesses the entire portfolio journey: research, experimentation, development, and refinement. A brilliant final piece without documented process cannot achieve top marks.', trigger: ['final.*piece.*all.*matter', 'only.*final.*work.*count', 'just.*final.*piece'] },
    { wrong: 'copying from photos earns good marks', right: 'Direct copying shows technical skill but not creativity or personal response. Cambridge rewards original interpretation, experimentation with media, and development of ideas from multiple sources.', trigger: ['copy.*photo.*good', 'copy.*photo.*mark', 'realistic.*copy.*best'] },
    { wrong: 'annotation is optional in portfolios', right: 'Written annotation explaining your creative decisions is mandatory. Without it, examiners cannot follow your thinking process. Annotate every development: why this colour? Why this composition?', trigger: ['annotation.*optional', 'dont need.*write.*art', 'art.*no.*writing'] },
    { wrong: 'art is purely subjective so any answer works', right: 'Cambridge uses specific assessment objectives: AO1 (record), AO2 (explore), AO3 (develop), AO4 (present). Meeting these criteria is measurable, not purely subjective.', trigger: ['art.*subjective', 'art.*anything.*goes', 'art.*no.*wrong.*answer'] },
    { wrong: 'digital art is not accepted', right: 'Cambridge accepts digital media alongside traditional. Photography, digital illustration, and mixed media are all valid. The key is demonstrating skill, creativity, and development process.', trigger: ['digital.*not.*accepted', 'digital.*not.*allowed', 'must.*traditional.*art'] },
  ],
};

/**
 * Check if a student's message contains a known misconception.
 * Returns the misconception object if found, null otherwise.
 */
export function checkMisconception(message, subject) {
  if (!message || !subject) return null;
  const lower = message.toLowerCase();

  const subjectKey = Object.keys(MISCONCEPTIONS).find(k =>
    subject.toLowerCase().includes(k.toLowerCase())
  );
  if (!subjectKey) return null;

  for (const m of MISCONCEPTIONS[subjectKey]) {
    for (const trigger of m.trigger) {
      const regex = new RegExp(trigger, 'i');
      if (regex.test(lower)) {
        return {
          subject: subjectKey,
          wrong: m.wrong,
          right: m.right,
          prompt: `MISCONCEPTION DETECTED: The student appears to believe "${m.wrong}". This is one of the most common wrong beliefs Pakistani students carry. Address it directly: "Actually — this is one of the most common things Pakistani students get wrong. Let me show you why the real answer is different." Then explain: ${m.right}`,
        };
      }
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAMBRIDGE QUESTION TYPE TAXONOMY
// The complete classification of every question type across Cambridge papers.
// When Starky gives a question, it identifies the type and reminds the student
// what that type demands before they answer.
// ═══════════════════════════════════════════════════════════════════════════════

export const CAMBRIDGE_QUESTION_TYPES = {

  // ── STRUCTURED QUESTIONS (most common across all papers) ──

  STATE: {
    id: 1,
    type: 'structured',
    command: 'State',
    aliases: ['Name', 'Give', 'Identify', 'List'],
    description: 'One fact, one mark. No explanation needed.',
    examinerExpects: 'A single precise fact using correct terminology. No extra words. No "because." One fact per mark available.',
    commonErrors: [
      'Writing an explanation when only a fact is needed — wastes time',
      'Using vague language instead of precise Cambridge terminology',
      'Giving two answers hoping one is right — examiner marks the FIRST answer only',
    ],
    modelStructure: '[Precise fact using correct term]. Full stop. Move on.',
    marksGuide: 'Usually 1 mark per fact. If 2 marks: give 2 separate facts.',
  },

  DESCRIBE: {
    id: 2,
    type: 'structured',
    command: 'Describe',
    aliases: ['Outline', 'What happens'],
    description: 'What happens, step by step. No "why" — just the sequence.',
    examinerExpects: 'A clear sequence of events or observations in order. Each step should be a separate point. No causal reasoning required.',
    commonErrors: [
      'Including explanations (why) when only description (what) is asked',
      'Missing steps in a sequence — every stage must be named',
      'Not using chronological or logical order',
    ],
    modelStructure: 'Step 1: [what happens first]. Step 2: [what happens next]. Step 3: [what happens then].',
    marksGuide: '1 mark per distinct descriptive point. If 4 marks: need 4 separate observations/steps.',
  },

  EXPLAIN: {
    id: 3,
    type: 'structured',
    command: 'Explain',
    aliases: ['Why does', 'Account for', 'Give reasons for'],
    description: 'What happens AND why. The word "because" must appear.',
    examinerExpects: 'A statement of what happens PLUS a causal reason. Must include linking words: "because", "therefore", "which causes", "this leads to", "as a result."',
    commonErrors: [
      'Describing without explaining — stating what happens but not WHY',
      'Missing the causal link between statement and reason',
      'Not using enough connective language to show reasoning chain',
    ],
    modelStructure: '[What happens] because [reason]. This causes [consequence] therefore [outcome].',
    marksGuide: 'Usually 2-4 marks. 1 mark for statement + 1 mark for each developed reason/consequence.',
  },

  CALCULATE: {
    id: 4,
    type: 'structured',
    command: 'Calculate',
    aliases: ['Work out', 'Find', 'Determine'],
    description: 'Show formula, substitute values, give answer with correct units and significant figures.',
    examinerExpects: 'Formula → Substitution → Working → Final answer with UNITS. Even if the final answer is wrong, correct method earns method marks.',
    commonErrors: [
      'Not showing working — answer alone may earn 0 even if correct',
      'Missing units on the final answer — automatic mark deduction',
      'Premature rounding — round only at the final step',
      'Wrong number of significant figures when specified',
    ],
    modelStructure: 'Formula: [equation]. Substituting: [values]. Working: [steps]. Answer: [value] [unit].',
    marksGuide: 'Method marks for correct formula + substitution. Accuracy mark for final answer. Unit mark separate.',
  },

  DEFINE: {
    id: 5,
    type: 'structured',
    command: 'Define',
    aliases: ['What is meant by'],
    description: 'A precise scientific, economic, or literary definition in Cambridge\'s preferred form.',
    examinerExpects: 'The exact Cambridge-approved definition. Not a description, not an example, not your own words — the formal definition from the syllabus.',
    commonErrors: [
      'Giving an example instead of a definition — "like when..." is not a definition',
      'Using circular definitions — "speed is how fast something goes"',
      'Adding unnecessary extra information that dilutes the precision',
    ],
    modelStructure: '[Term] is [precise formal definition using key qualifying words].',
    marksGuide: 'Usually 1-2 marks. Must include ALL key words from the mark scheme definition.',
  },

  GIVE_A_REASON: {
    id: 6,
    type: 'structured',
    command: 'Give a reason',
    aliases: ['Why', 'State and explain'],
    description: 'A single causal statement linking cause to effect.',
    examinerExpects: 'One clear reason with a logical cause-effect link. Not a list — a single developed point.',
    commonErrors: [
      'Giving multiple weak reasons instead of one strong developed reason',
      'Stating a fact without the causal link',
      'Being too vague — "it affects the results" instead of specifying HOW',
    ],
    modelStructure: '[Cause/Factor] leads to [Effect] because [Mechanism].',
    marksGuide: '1-2 marks. Statement mark + development/mechanism mark.',
  },

  SUGGEST: {
    id: 7,
    type: 'structured',
    command: 'Suggest',
    aliases: ['Suggest a reason', 'What might'],
    description: 'Apply knowledge to an unfamiliar context. No single correct answer.',
    examinerExpects: 'A reasoned answer applying scientific/economic/historical principles to a new situation. Multiple valid answers exist — mark scheme accepts any reasonable suggestion with justification.',
    commonErrors: [
      'Not justifying the suggestion — must include reasoning',
      'Being afraid to commit to an answer because there is no single right one',
      'Ignoring the data or context given in the question',
    ],
    modelStructure: '[Suggestion] because [reasoning based on principles]. This would [expected outcome].',
    marksGuide: '1 mark for valid suggestion + 1 mark for justified reasoning.',
  },

  COMPARE: {
    id: 8,
    type: 'structured',
    command: 'Compare',
    aliases: ['Compare and contrast', 'What are the similarities and differences'],
    description: 'Similarities AND differences. Must address BOTH items with comparative language.',
    examinerExpects: 'Explicit comparative statements using "whereas", "in contrast", "both", "similarly." NOT two separate descriptions side by side — must actively compare.',
    commonErrors: [
      'Writing two separate descriptions instead of comparative statements',
      'Only giving differences without similarities (or vice versa)',
      'Not using comparative language — just listing features of each',
    ],
    modelStructure: 'Both [A] and [B] [similarity]. However, [A] [feature] whereas [B] [different feature].',
    marksGuide: '1 mark per valid comparative point. Must include at least one similarity AND one difference for full marks.',
  },

  EVALUATE: {
    id: 9,
    type: 'structured',
    command: 'Evaluate',
    aliases: ['Assess', 'How effective', 'How successful'],
    description: 'Arguments for AND against, then a final supported judgement.',
    examinerExpects: 'Balanced consideration of strengths and weaknesses, advantages and disadvantages, or arguments for and against. MUST end with a reasoned conclusion/judgement. Without final judgement = cannot reach top band.',
    commonErrors: [
      'One-sided argument — only giving advantages OR disadvantages',
      'No conclusion — listing points without making a final judgement',
      'Conclusion that contradicts the evidence presented',
      'No evidence to support the evaluation points',
    ],
    modelStructure: 'For: [point + evidence]. Against: [point + evidence]. Overall: [judgement] because [key reason].',
    marksGuide: 'Top band requires: both sides considered + evidence used + reasoned conclusion.',
  },

  DISCUSS: {
    id: 10,
    type: 'structured',
    command: 'Discuss',
    aliases: ['Consider'],
    description: 'Thorough examination of all aspects of a topic.',
    examinerExpects: 'Multiple perspectives examined with evidence. Similar to evaluate but broader — requires exploration of different viewpoints, theories, or interpretations rather than just for/against.',
    commonErrors: [
      'Treating "discuss" as "describe" — must include analysis, not just information',
      'Ignoring alternative perspectives or counter-arguments',
      'No structure — jumping between points without logical flow',
    ],
    modelStructure: 'One perspective: [view + evidence]. Alternative: [view + evidence]. Further consideration: [nuance]. Conclusion: [balanced summary].',
    marksGuide: 'Highest marks for breadth of perspectives + depth of analysis + coherent structure.',
  },

  TO_WHAT_EXTENT: {
    id: 11,
    type: 'structured',
    command: 'To what extent',
    aliases: ['How far', 'How far do you agree'],
    description: 'Weighted judgement — partial agreement expected. Full agreement cannot reach top band.',
    examinerExpects: 'A nuanced answer acknowledging multiple perspectives. Full agreement ("totally", "completely") = Level 2 max. Partial agreement with qualifying language expected. Must weigh evidence on both sides.',
    commonErrors: [
      'Fully agreeing or disagreeing — nuance is mandatory for top marks',
      'Not quantifying the extent — "to a large/small/moderate extent because..."',
      'Listing points without weighing their relative importance',
    ],
    modelStructure: 'To a [large/moderate/limited] extent, [position] because [strongest evidence]. However, [counter-evidence] suggests [qualification]. Overall, [weighted judgement].',
    marksGuide: 'Top band: sustained argument + counter-argument taken seriously + weighted conclusion.',
  },

  ANALYSE: {
    id: 12,
    type: 'structured',
    command: 'Analyse',
    aliases: ['Break down', 'Examine'],
    description: 'Break down into components and examine each part separately.',
    examinerExpects: 'Systematic decomposition of a concept, process, or argument into its constituent parts. Each component examined for its role, significance, and relationship to other parts.',
    commonErrors: [
      'Describing the whole without breaking it into parts',
      'Listing components without examining their significance',
      'Not showing how parts relate to each other or the whole',
    ],
    modelStructure: 'Component 1: [identify + examine significance]. Component 2: [identify + examine significance]. Relationship: [how parts interact]. Overall significance: [synthesis].',
    marksGuide: 'Marks for identifying components + examining each + showing relationships.',
  },

  // ── EXTENDED WRITING QUESTION TYPES ──

  ESSAY_LITERATURE: {
    id: 13,
    type: 'extended',
    command: 'Essay (English Literature)',
    aliases: ['How does the writer', 'Explore how', 'Write about'],
    description: 'PEA/PETAL structure with AO1 (knowledge), AO2 (analysis of language), AO3 (personal response).',
    examinerExpects: 'Sustained analytical essay with embedded quotations. Every quotation must be analysed for language effect. Personal response woven throughout — not bolted on at the end. AO2 (how language creates meaning) is where top marks are earned.',
    commonErrors: [
      'Retelling the plot instead of analysing language and technique',
      'Quoting without analysis — quotation alone earns nothing',
      'Identifying techniques without explaining their specific effect',
      'No personal response — just describing what the writer does',
      'Not structuring around the question — answering a different question',
    ],
    modelStructure: 'Introduction: [thesis responding to question]. Paragraph 1: Point → Evidence (embedded quote) → Technique → Analysis of effect → Link to question. [Repeat for 3-4 paragraphs]. Conclusion: [synthesise argument].',
    marksGuide: 'AO1: 25%. AO2: 50% (most important). AO3: 25%. Focus on AO2 — how language creates meaning.',
  },

  DATA_RESPONSE: {
    id: 14,
    type: 'extended',
    command: 'Data response (Economics/Business)',
    aliases: ['Refer to the data', 'Using the information provided', 'With reference to'],
    description: 'Extract data, analyse trends, evaluate implications.',
    examinerExpects: 'Direct reference to specific data points (quote the numbers). Analysis of what the data shows. Evaluation of implications, limitations, and context beyond the data.',
    commonErrors: [
      'Not quoting specific figures from the data — "the data shows an increase" vs "the data shows a 15% increase from 2020 to 2023"',
      'Only describing data without analysing causes or implications',
      'Ignoring limitations of the data (sample size, time period, context)',
      'Not connecting data to economic/business theory',
    ],
    modelStructure: 'Data extraction: "[specific figure]" shows [observation]. Analysis: This suggests [interpretation] because [theory]. Evaluation: However, [limitation/alternative explanation]. Conclusion: [judgement supported by data].',
    marksGuide: 'Marks split between: data use (must quote specific figures) + analysis + evaluation.',
  },

  CASE_STUDY: {
    id: 15,
    type: 'extended',
    command: 'Case study (Business)',
    aliases: ['Advise', 'Recommend', 'With reference to the case'],
    description: 'Apply business theory to a real or fictional business context.',
    examinerExpects: 'Theory applied to the SPECIFIC business in the question. Generic theory without application to this business cannot reach top bands. Must reference details from the case study by name.',
    commonErrors: [
      'Writing generic theory without mentioning the specific business',
      'Not using information given in the case study extract',
      'Making recommendations without justifying why they suit THIS business',
      'Ignoring constraints mentioned in the case (budget, size, market)',
    ],
    modelStructure: 'Context: [business situation from case]. Theory: [relevant concept]. Application: For [business name], this means [specific application]. Recommendation: [action] because [justified by case details].',
    marksGuide: 'Application marks require explicit reference to case study details. Knowledge alone is not enough.',
  },

  SOURCE_ANALYSIS: {
    id: 16,
    type: 'extended',
    command: 'Source analysis (History)',
    aliases: ['How useful is Source', 'How far does Source', 'What can you learn from Source'],
    description: 'Evaluate source provenance, content, and reliability.',
    examinerExpects: 'Three-layer analysis: (1) Content — what does the source say? (2) Provenance — who wrote it, when, why, for whom? (3) Evaluation — how useful/reliable is it, and what are its limitations?',
    commonErrors: [
      'Only describing what the source says without evaluating reliability',
      'Ignoring provenance — author, date, purpose, audience',
      'Treating all sources as equally reliable',
      'Not cross-referencing with own knowledge to test accuracy',
      'Using vague terms like "biased" without explaining how the bias manifests',
    ],
    modelStructure: 'Content: Source [X] states [key information]. Provenance: Written by [author] in [date] for [purpose/audience]. Evaluation: This makes it [useful/limited] because [specific reason]. However, [counter-point about reliability]. Cross-reference: Own knowledge [confirms/contradicts] because [evidence].',
    marksGuide: 'Content analysis: basic marks. Provenance evaluation: mid-range. Cross-referencing + nuanced judgement: top band.',
  },

  HYPOTHESIS_EVALUATION: {
    id: 17,
    type: 'extended',
    command: 'Hypothesis evaluation (Science)',
    aliases: ['Plan an experiment', 'Design an investigation', 'How would you test'],
    description: 'Method design, results prediction, and conclusion drawing.',
    examinerExpects: 'Clear hypothesis → controlled method (independent, dependent, control variables) → results prediction → conclusion with reference to data. Must identify variables explicitly.',
    commonErrors: [
      'Not identifying independent, dependent, and control variables',
      'Vague method — must be detailed enough for someone else to repeat',
      'Not explaining how to make it a fair test (controlling variables)',
      'Drawing conclusions not supported by the results described',
      'Missing safety precautions where relevant',
    ],
    modelStructure: 'Hypothesis: [prediction]. Variables: IV = [what you change], DV = [what you measure], CV = [what you keep the same]. Method: [step-by-step]. Expected results: [prediction with reasoning]. Conclusion: [relates back to hypothesis].',
    marksGuide: 'Marks for: hypothesis (1) + variables identified (2-3) + method detail (2-3) + conclusion linked to hypothesis (1-2).',
  },

  REPORT_WRITING: {
    id: 18,
    type: 'extended',
    command: 'Report writing (English Language)',
    aliases: ['Write a report', 'Write a letter', 'Write a speech', 'Write an article'],
    description: 'Correct format + appropriate register + relevant content.',
    examinerExpects: 'Correct format for the specific text type (report: title + headings + formal register; letter: address + greeting + sign-off; speech: rhetorical devices + direct address; article: headline + engaging opening). Register must match purpose and audience.',
    commonErrors: [
      'Wrong format — writing an essay when a report is asked for',
      'Wrong register — informal tone in a formal report, or formal in a speech to friends',
      'No audience awareness — not adjusting language for who will read/hear it',
      'Missing format features (no headings in a report, no sign-off in a letter)',
      'Not addressing all bullet points given in the question',
    ],
    modelStructure: 'Format: [correct text type layout]. Opening: [engaging, appropriate to form]. Body: [organised by headings/paragraphs, addressing all points]. Tone: [matched to audience and purpose]. Closing: [appropriate to form].',
    marksGuide: 'Content marks: addressing all bullet points. Language marks: vocabulary + sentence variety + accuracy. Format marks: correct text type features.',
  },
};

/**
 * Get the question type guidance for a specific command word.
 * Returns the full question type object including examiner expectations,
 * common errors, and model answer structure.
 */
export function getQuestionTypeGuidance(commandWord) {
  if (!commandWord) return null;
  const lower = commandWord.toLowerCase().trim();

  for (const qt of Object.values(CAMBRIDGE_QUESTION_TYPES)) {
    if (qt.command.toLowerCase() === lower) return qt;
    if (qt.aliases && qt.aliases.some(a => lower.includes(a.toLowerCase()))) return qt;
  }
  return null;
}

/**
 * Detect question type from a question text.
 * Scans for command words and returns the matching question type.
 */
export function detectQuestionType(questionText) {
  if (!questionText) return null;
  const lower = questionText.toLowerCase();

  // Check in priority order — more specific commands first
  const priorityOrder = [
    'TO_WHAT_EXTENT', 'HYPOTHESIS_EVALUATION', 'SOURCE_ANALYSIS',
    'CASE_STUDY', 'DATA_RESPONSE', 'ESSAY_LITERATURE', 'REPORT_WRITING',
    'EVALUATE', 'DISCUSS', 'ANALYSE', 'COMPARE', 'SUGGEST',
    'EXPLAIN', 'DESCRIBE', 'CALCULATE', 'DEFINE', 'GIVE_A_REASON', 'STATE',
  ];

  for (const key of priorityOrder) {
    const qt = CAMBRIDGE_QUESTION_TYPES[key];
    const allCommands = [qt.command, ...(qt.aliases || [])];
    for (const cmd of allCommands) {
      if (lower.includes(cmd.toLowerCase())) {
        return qt;
      }
    }
  }
  return null;
}
