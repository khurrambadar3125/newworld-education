/**
 * utils/globalKnowledgeBase.js
 * ─────────────────────────────────────────────────────────────────
 * Cambridge O/A Level topic-level knowledge base.
 * Each entry contains: common misconceptions, examiner tips,
 * mark scheme keywords, and typical student mistakes.
 *
 * Structured as: SUBJECT → TOPIC → { misconceptions, examinerTips, keywords, mistakes }
 * Used by getKnowledgeForTopic() to inject relevant context into Starky's prompt.
 */

const KNOWLEDGE_BASE = {
  // ══════════════════════════════════════════════════════════════
  // BIOLOGY (5090 / 9700)
  // ══════════════════════════════════════════════════════════════
  Biology: {
    'Osmosis': {
      misconceptions: [
        'Students think salt moves through the membrane — it is WATER that moves',
        'Students confuse osmosis with diffusion — osmosis is specifically water through a partially permeable membrane',
        'Students think osmosis requires energy — it is passive',
      ],
      examinerTips: [
        'Always say "partially permeable membrane" not just "membrane" — this exact phrase earns the mark',
        'State "from high water concentration to low water concentration" — direction matters',
        'For plant cells: "turgid" not "swollen", "plasmolysed" not "shrivelled"',
      ],
      keywords: ['partially permeable membrane', 'water potential', 'concentration gradient', 'turgid', 'plasmolysed', 'net movement'],
      mistakes: ['Saying "semi-permeable" instead of "partially permeable"', 'Forgetting to mention water molecules specifically'],
    },
    'Photosynthesis': {
      misconceptions: [
        'Students think plants only photosynthesise during the day and respire at night — plants respire 24/7',
        'Students think CO2 is "food" for plants — glucose is the food, CO2 is a raw material',
        'Students confuse the role of chlorophyll (absorbs light) with chloroplast (organelle where it happens)',
      ],
      examinerTips: [
        'Equation must be balanced: 6CO2 + 6H2O → C6H12O6 + 6O2',
        'Light-dependent reactions: thylakoid membranes. Calvin cycle: stroma — Cambridge loves this distinction',
        'Limiting factors: light intensity, CO2 concentration, temperature — know the graphs',
      ],
      keywords: ['chlorophyll', 'chloroplast', 'light energy', 'glucose', 'carbon dioxide', 'oxygen', 'stomata', 'limiting factor'],
      mistakes: ['Writing the equation unbalanced', 'Saying "plants breathe in CO2" — they absorb it through stomata'],
    },
    'Genetics & Inheritance': {
      misconceptions: [
        'Students think dominant means "more common" — it means it shows in heterozygotes',
        'Students confuse genotype (genetic makeup) with phenotype (physical appearance)',
        'Students think all genetic diseases are recessive — some are dominant (e.g. Huntington\'s)',
      ],
      examinerTips: [
        'Punnett squares: always show parental genotypes, gametes, and offspring ratios',
        'Use standard notation: uppercase for dominant, lowercase for recessive',
        'For sex-linked inheritance: show X^H X^h notation clearly',
      ],
      keywords: ['allele', 'genotype', 'phenotype', 'homozygous', 'heterozygous', 'dominant', 'recessive', 'codominance'],
      mistakes: ['Not labelling Punnett square axes with gametes', 'Giving ratios without showing working'],
    },
    'Respiration': {
      misconceptions: [
        'Students think respiration only happens in lungs — it happens in every cell',
        'Students confuse breathing (gas exchange) with respiration (energy release in cells)',
        'Students think anaerobic respiration produces no energy — it produces less, not zero',
      ],
      examinerTips: [
        'Aerobic: glucose + oxygen → carbon dioxide + water + energy',
        'Anaerobic in animals: glucose → lactic acid + energy',
        'Anaerobic in yeast: glucose → ethanol + carbon dioxide + energy (fermentation)',
      ],
      keywords: ['mitochondria', 'aerobic', 'anaerobic', 'ATP', 'lactic acid', 'fermentation', 'glucose', 'energy'],
      mistakes: ['Saying "respiration produces oxygen" — it USES oxygen', 'Confusing the word equation with the symbol equation'],
    },
    'Cell Structure': {
      misconceptions: [
        'Students think all cells have a nucleus — red blood cells and bacterial cells do not',
        'Students confuse cell wall (plants/bacteria) with cell membrane (all cells)',
        'Students think mitochondria produce oxygen — they use it to release energy',
      ],
      examinerTips: [
        'Know the difference between plant and animal cells — examiners test this every year',
        'Cell membrane = controls what enters/leaves. Cell wall = provides structure and support',
        'Magnification formula: magnification = image size / actual size',
      ],
      keywords: ['nucleus', 'cell membrane', 'cell wall', 'mitochondria', 'chloroplast', 'ribosome', 'vacuole', 'cytoplasm'],
      mistakes: ['Saying cells have "brains" instead of nuclei', 'Forgetting ribosomes when listing organelles'],
    },
    'Enzymes': {
      misconceptions: [
        'Students say enzymes are "killed" by high temperature — they are DENATURED (shape changes)',
        'Students think enzymes are used up in reactions — they are REUSED (catalysts)',
        'Students think all enzymes work best at 37°C — some organisms have different optimum temperatures',
      ],
      examinerTips: [
        'Lock and key model: substrate fits into active site — this is the standard O Level explanation',
        'Denaturation = active site shape changes, substrate can no longer fit',
        'pH and temperature both affect enzyme activity — know the graphs',
      ],
      keywords: ['active site', 'substrate', 'denature', 'optimum temperature', 'optimum pH', 'lock and key', 'catalyst', 'specific'],
      mistakes: ['Writing "enzymes die" instead of "enzymes denature"', 'Not mentioning the active site in explanations'],
    },
  },

  // ══════════════════════════════════════════════════════════════
  // CHEMISTRY (5070 / 9701)
  // ══════════════════════════════════════════════════════════════
  Chemistry: {
    'Atomic Structure': {
      misconceptions: [
        'Students confuse atomic number (protons) with mass number (protons + neutrons)',
        'Students think electrons have significant mass — their mass is negligible',
        'Students think isotopes are different elements — they are the SAME element with different neutrons',
      ],
      examinerTips: [
        'Electronic configuration: 2, 8, 8 pattern — always write it out for the first 20 elements',
        'Isotopes: same number of protons, different number of neutrons',
        'Relative atomic mass is an average accounting for isotope abundance',
      ],
      keywords: ['proton', 'neutron', 'electron', 'atomic number', 'mass number', 'isotope', 'electronic configuration', 'shells'],
      mistakes: ['Confusing proton number with nucleon number', 'Writing electron configuration without commas'],
    },
    'Chemical Bonding': {
      misconceptions: [
        'Students think ionic bonds involve sharing electrons — ionic = TRANSFER, covalent = SHARING',
        'Students think metals bond covalently — metals form metallic bonds (sea of electrons)',
        'Students think all covalent substances have low melting points — diamond and silicon dioxide are exceptions',
      ],
      examinerTips: [
        'Ionic: metal + non-metal. Covalent: non-metal + non-metal. Know this rule.',
        'Dot-and-cross diagrams: show ONLY outer shell electrons. Label which atom each electron came from.',
        'Properties: ionic = high mp, conducts when molten/dissolved. Covalent = low mp, does not conduct.',
      ],
      keywords: ['ionic', 'covalent', 'metallic', 'electrostatic attraction', 'shared pair', 'electron transfer', 'dot-and-cross'],
      mistakes: ['Not showing the charges on ions in dot-and-cross diagrams', 'Saying "molecules" when describing ionic compounds — they form lattices'],
    },
    'Organic Chemistry': {
      misconceptions: [
        'Students confuse alkanes (single bonds, saturated) with alkenes (double bond, unsaturated)',
        'Students think all organic compounds contain only C and H — many contain O, N, halogens too',
        'Students confuse addition reactions (alkenes) with substitution reactions (alkanes)',
      ],
      examinerTips: [
        'Alkanes: CnH2n+2, saturated, only single bonds, substitution reactions',
        'Alkenes: CnH2n, unsaturated, contain C=C double bond, addition reactions',
        'Test for unsaturation: bromine water turns from orange/brown to COLOURLESS (not clear)',
      ],
      keywords: ['saturated', 'unsaturated', 'homologous series', 'functional group', 'addition', 'substitution', 'polymerisation', 'cracking'],
      mistakes: ['Saying bromine water turns "clear" instead of "colourless"', 'Drawing structural formulae without showing all bonds'],
    },
    'Acids & Bases': {
      misconceptions: [
        'Students think all acids are dangerous — vinegar and citric acid are weak acids used daily',
        'Students confuse strong/weak acids with concentrated/dilute — strength = degree of ionisation',
        'Students think neutralisation always produces water + salt — it does, but the salt name depends on the acid',
      ],
      examinerTips: [
        'HCl → chloride salts, H2SO4 → sulfate salts, HNO3 → nitrate salts',
        'pH scale: 1-6 acidic, 7 neutral, 8-14 alkaline',
        'Universal indicator: red/orange = acid, green = neutral, blue/purple = alkali',
      ],
      keywords: ['pH', 'neutralisation', 'indicator', 'hydroxide', 'hydrogen ions', 'salt', 'base', 'alkali'],
      mistakes: ['Confusing bases with alkalis — all alkalis are bases but not all bases are alkalis', 'Forgetting water as a product of neutralisation'],
    },
    'Redox Reactions': {
      misconceptions: [
        'Students forget that oxidation and reduction always happen together (redox)',
        'Students think oxidation only involves oxygen — it also means loss of electrons or gain of oxygen',
        'Students confuse which species is oxidised vs reduced in electrochemical cells',
      ],
      examinerTips: [
        'OIL RIG: Oxidation Is Loss (of electrons), Reduction Is Gain (of electrons)',
        'In electrolysis: cations go to cathode (reduction), anions go to anode (oxidation)',
        'Reactivity series determines what is oxidised/reduced in displacement reactions',
      ],
      keywords: ['oxidation', 'reduction', 'electron transfer', 'oxidising agent', 'reducing agent', 'displacement', 'electrolysis'],
      mistakes: ['Getting OIL RIG backwards', 'Not identifying the oxidising and reducing agents separately'],
    },
  },

  // ══════════════════════════════════════════════════════════════
  // PHYSICS (5054 / 9702)
  // ══════════════════════════════════════════════════════════════
  Physics: {
    'Forces & Motion': {
      misconceptions: [
        'Students think a moving object must have a net force on it — constant velocity means balanced forces',
        'Students think heavier objects fall faster — in vacuum all objects fall at same rate (g)',
        'Students confuse mass (kg, constant) with weight (N, depends on gravitational field)',
      ],
      examinerTips: [
        'F = ma — always show: formula → substitution → calculation → unit',
        'Weight = mass × gravitational field strength (W = mg)',
        'Terminal velocity: weight = air resistance, acceleration = 0, constant speed',
      ],
      keywords: ['resultant force', 'acceleration', 'Newton', 'inertia', 'momentum', 'terminal velocity', 'friction', 'equilibrium'],
      mistakes: ['Forgetting units in calculations (N, m/s², kg)', 'Not drawing force arrows to scale in diagrams'],
    },
    'Electricity & Circuits': {
      misconceptions: [
        'Students think current is "used up" in a circuit — current is the SAME at all points in a series circuit',
        'Students confuse voltage (potential difference) with current — voltage drives current, current flows',
        'Students think a bigger battery means more current — it depends on resistance too (V=IR)',
      ],
      examinerTips: [
        'V = IR — Ohm\'s law. Always state the formula before substituting.',
        'Series: same current, voltage splits. Parallel: same voltage, current splits.',
        'Power = current × voltage (P = IV), Energy = power × time (E = Pt)',
      ],
      keywords: ['current', 'voltage', 'resistance', 'potential difference', 'ammeter', 'voltmeter', 'series', 'parallel', 'ohm'],
      mistakes: ['Drawing ammeter in parallel (should be series)', 'Drawing voltmeter in series (should be parallel)'],
    },
    'Waves & Light': {
      misconceptions: [
        'Students think sound can travel through vacuum — sound needs a medium, light does not',
        'Students confuse reflection (bouncing off) with refraction (bending through different medium)',
        'Students think the image in a plane mirror is behind the mirror — it is a virtual image',
      ],
      examinerTips: [
        'Wave equation: speed = frequency × wavelength (v = fλ)',
        'Reflection: angle of incidence = angle of reflection (both measured from NORMAL)',
        'Refraction: light bends towards normal when entering denser medium, away when leaving',
      ],
      keywords: ['wavelength', 'frequency', 'amplitude', 'transverse', 'longitudinal', 'reflection', 'refraction', 'diffraction', 'normal'],
      mistakes: ['Measuring angles from the surface instead of the normal', 'Confusing transverse and longitudinal waves'],
    },
    'Thermal Physics': {
      misconceptions: [
        'Students think heat and temperature are the same — heat is energy transferred, temperature is a measure of average KE',
        'Students think metals are cold — they feel cold because they conduct heat away from your hand quickly',
        'Students think boiling point changes with more heating — it stays constant during a state change',
      ],
      examinerTips: [
        'Specific heat capacity: E = mcΔT — show all working, state units (J, kg, °C)',
        'During state changes: temperature stays constant because energy breaks/forms bonds',
        'Conduction: particles vibrate and pass energy. Convection: hot fluid rises. Radiation: no medium needed.',
      ],
      keywords: ['conduction', 'convection', 'radiation', 'specific heat capacity', 'latent heat', 'kinetic energy', 'state change'],
      mistakes: ['Forgetting to convert temperatures to Kelvin when needed', 'Not explaining WHY temperature stays constant during boiling'],
    },
  },

  // ══════════════════════════════════════════════════════════════
  // MATHEMATICS (4024 / 9709)
  // ══════════════════════════════════════════════════════════════
  Mathematics: {
    'Algebra': {
      misconceptions: [
        'Students think x² + x² = x⁴ — it equals 2x²',
        'Students forget to flip the inequality sign when multiplying/dividing by a negative',
        'Students confuse expanding (removing brackets) with factorising (adding brackets)',
      ],
      examinerTips: [
        'Always show your working — method marks are given even if the final answer is wrong',
        'Check your answer by substituting back into the original equation',
        'For simultaneous equations: elimination or substitution — label which method you use',
      ],
      keywords: ['expand', 'factorise', 'simplify', 'solve', 'substitute', 'coefficient', 'term', 'expression', 'equation'],
      mistakes: ['Sign errors when expanding negative brackets', 'Not collecting like terms before solving'],
    },
    'Trigonometry': {
      misconceptions: [
        'Students use degrees in calculator when the question requires radians (or vice versa)',
        'Students apply SOH CAH TOA to non-right-angled triangles — use sine/cosine rule instead',
        'Students forget that sin, cos, tan have specific ranges — sin and cos are between -1 and 1',
      ],
      examinerTips: [
        'SOH CAH TOA: only for right-angled triangles',
        'Sine rule: a/sinA = b/sinB. Cosine rule: a² = b² + c² - 2bc·cosA',
        'Always check calculator is in correct mode (degrees vs radians)',
      ],
      keywords: ['sine', 'cosine', 'tangent', 'hypotenuse', 'opposite', 'adjacent', 'angle of elevation', 'angle of depression'],
      mistakes: ['Using the wrong trig ratio', 'Forgetting to find the angle (using inverse trig) vs finding the side'],
    },
    'Statistics & Probability': {
      misconceptions: [
        'Students think "the mean is always the best average" — median is better for skewed data',
        'Students confuse mutually exclusive with independent events',
        'Students think P(A or B) = P(A) + P(B) always — only true if mutually exclusive',
      ],
      examinerTips: [
        'For grouped data: use midpoints for estimated mean',
        'Cumulative frequency: plot upper boundaries, join with smooth curve',
        'Probability: all probabilities in a sample space must sum to 1',
      ],
      keywords: ['mean', 'median', 'mode', 'range', 'interquartile range', 'cumulative frequency', 'probability', 'expected frequency'],
      mistakes: ['Using class width instead of midpoint for grouped mean', 'Not reading cumulative frequency from the correct axis'],
    },
  },

  // ══════════════════════════════════════════════════════════════
  // ECONOMICS (2281 / 9708)
  // ══════════════════════════════════════════════════════════════
  Economics: {
    'Supply & Demand': {
      misconceptions: [
        'Students confuse a movement ALONG the curve (price change) with a SHIFT of the curve (non-price factor)',
        'Students think supply and demand always move in opposite directions — they can both shift',
        'Students forget that equilibrium is where supply EQUALS demand, not where they cross on the diagram',
      ],
      examinerTips: [
        'Diagrams: always label axes (Price, Quantity), curves (D, S), and equilibrium (P*, Q*)',
        'Movement along = price change. Shift = non-price factor (income, tastes, costs)',
        'Every "discuss" question needs BOTH sides + a conclusion',
      ],
      keywords: ['equilibrium', 'surplus', 'shortage', 'price mechanism', 'demand curve', 'supply curve', 'shift', 'movement along'],
      mistakes: ['Drawing unlabelled diagrams', 'Not explaining the direction of the shift and its effect on price AND quantity'],
    },
    'Market Failure': {
      misconceptions: [
        'Students think market failure means markets stop working — it means they work inefficiently',
        'Students confuse private costs with social costs (social = private + external)',
        'Students think all government intervention fixes market failure — it can cause government failure',
      ],
      examinerTips: [
        'External costs: pollution, congestion. External benefits: education, vaccination',
        'Merit goods: under-consumed (education). Demerit goods: over-consumed (cigarettes)',
        'For evaluation: always consider unintended consequences of government intervention',
      ],
      keywords: ['externality', 'social cost', 'private cost', 'merit good', 'demerit good', 'public good', 'free rider', 'subsidy', 'tax'],
      mistakes: ['Not distinguishing between external costs and external benefits', 'Forgetting to evaluate government intervention policies'],
    },
  },

  // ══════════════════════════════════════════════════════════════
  // PAKISTAN STUDIES (2059)
  // ══════════════════════════════════════════════════════════════
  'Pakistan Studies': {
    'Movement for Pakistan': {
      misconceptions: [
        'Students think the Pakistan Movement started with Jinnah — it began much earlier with Sir Syed Ahmad Khan',
        'Students confuse the Lahore Resolution (1940) with the creation of Pakistan (1947)',
        'Students think partition was peaceful — it involved massive violence, migration, and displacement',
      ],
      examinerTips: [
        '14-mark questions: need an argument WITH a judgement. "Was X more important than Y?" requires comparison',
        'Source questions: quote from the source, then add your own knowledge',
        'Always include dates, names, and specific events — vague answers lose marks',
      ],
      keywords: ['Two-Nation Theory', 'Lahore Resolution', 'Partition', 'Sir Syed Ahmad Khan', 'Allama Iqbal', 'Quaid-e-Azam', 'Muslim League', 'Congress'],
      mistakes: ['Writing narrative instead of analysis', 'Not linking events to the importance of the Pakistan Movement'],
    },
  },

  // ══════════════════════════════════════════════════════════════
  // COMPUTER SCIENCE (2210 / 9618)
  // ══════════════════════════════════════════════════════════════
  'Computer Science': {
    'Algorithms & Pseudocode': {
      misconceptions: [
        'Students write Python syntax in pseudocode — Cambridge has its own pseudocode syntax',
        'Students confuse linear search (check every element) with binary search (halve the list each time)',
        'Students think bubble sort is efficient — it is O(n²) and one of the slowest algorithms',
      ],
      examinerTips: [
        'Trace tables: follow the code EXACTLY line by line. Do not guess what it should do.',
        'Use Cambridge pseudocode syntax: IF...THEN...ELSE...ENDIF, WHILE...DO...ENDWHILE, FOR...TO...NEXT',
        'Binary search requires a SORTED list — state this in your answer',
      ],
      keywords: ['algorithm', 'pseudocode', 'trace table', 'linear search', 'binary search', 'bubble sort', 'merge sort', 'efficiency'],
      mistakes: ['Not initialising variables in pseudocode', 'Off-by-one errors in loop boundaries'],
    },
    'Data Representation': {
      misconceptions: [
        'Students confuse binary (base 2) with denary/decimal (base 10)',
        'Students think ASCII and Unicode are the same — Unicode supports more characters (including Urdu)',
        'Students forget that 1 byte = 8 bits, 1 KB = 1024 bytes (not 1000)',
      ],
      examinerTips: [
        'Binary to denary: write place values (128, 64, 32, 16, 8, 4, 2, 1) and add where there is a 1',
        'Hexadecimal: each hex digit = 4 binary digits. Convert via binary as intermediate step.',
        'Two\'s complement for negative numbers: flip all bits, add 1',
      ],
      keywords: ['binary', 'denary', 'hexadecimal', 'ASCII', 'Unicode', 'overflow', 'two\'s complement', 'bit', 'byte'],
      mistakes: ['Forgetting to show working in binary conversions', 'Confusing KB (1024) with kB (1000)'],
    },
  },

  // ══════════════════════════════════════════════════════════════
  // ENGLISH LANGUAGE (1123)
  // ══════════════════════════════════════════════════════════════
  'English Language': {
    'Summary Writing': {
      misconceptions: [
        'Students copy sentences directly from the passage — summaries must be in YOUR OWN WORDS',
        'Students include their own opinions — summaries are about the passage content only',
        'Students write too much — if the question says 160 words, do not exceed it',
      ],
      examinerTips: [
        'Read the question carefully: it tells you EXACTLY what to summarise',
        'Identify the content points first, then rephrase each one',
        'Copying = zero marks. Paraphrasing = full marks.',
      ],
      keywords: ['paraphrase', 'content point', 'own words', 'concise', 'relevant'],
      mistakes: ['Lifting phrases directly from the text', 'Including information not asked for in the question'],
    },
    'Directed Writing': {
      misconceptions: [
        'Students forget the FORMAT — if it asks for a letter, it must look like a letter',
        'Students focus only on content and ignore language/style marks',
        'Students think directed writing is just "write anything about the topic"',
      ],
      examinerTips: [
        'Format marks: letter (address, date, Dear..., sign off), speech (greeting, rhetorical questions), report (heading, subheadings)',
        'Use the bullet points from the question as your paragraph structure',
        'Include persuasive techniques: rhetorical questions, rule of three, emotive language',
      ],
      keywords: ['format', 'register', 'audience', 'purpose', 'persuasive', 'formal', 'informal'],
      mistakes: ['Wrong format (e.g. writing an essay when asked for a speech)', 'Not addressing all the bullet points'],
    },
  },

  // ══════════════════════════════════════════════════════════════
  // GEOGRAPHY (2217)
  // ══════════════════════════════════════════════════════════════
  Geography: {
    'River Processes': {
      misconceptions: [
        'Students think rivers only erode — they erode, transport, AND deposit',
        'Students confuse the upper course (V-shaped valley, waterfalls) with the lower course (floodplain, meanders)',
        'Students think oxbow lakes form instantly — they take decades as meanders get cut off',
      ],
      examinerTips: [
        'CASE STUDIES are essential — name the river, location, specific data',
        'Four types of erosion: hydraulic action, abrasion, attrition, solution',
        'Four types of transportation: traction, saltation, suspension, solution',
      ],
      keywords: ['erosion', 'transportation', 'deposition', 'meander', 'floodplain', 'oxbow lake', 'waterfall', 'gorge', 'levee'],
      mistakes: ['Not naming a specific river case study', 'Confusing the four types of erosion'],
    },
    'Earthquakes & Volcanoes': {
      misconceptions: [
        'Students think earthquakes only happen at plate boundaries — intraplate earthquakes exist',
        'Students confuse the focus (where it starts underground) with the epicentre (point on surface above)',
        'Students think all plate boundaries have volcanoes — conservative boundaries do not',
      ],
      examinerTips: [
        'Always include a named example with specific detail (place, date, magnitude, impacts)',
        'Constructive: plates move apart (Mid-Atlantic Ridge). Destructive: plates collide (Pacific Ring of Fire)',
        'Primary effects (immediate) vs secondary effects (long-term) — label them clearly',
      ],
      keywords: ['tectonic plates', 'focus', 'epicentre', 'magnitude', 'constructive', 'destructive', 'conservative', 'seismometer'],
      mistakes: ['Not distinguishing between primary and secondary effects', 'Generic answers without named case studies'],
    },
  },

  // ══════════════════════════════════════════════════════════════
  // ACCOUNTING (7707)
  // ══════════════════════════════════════════════════════════════
  Accounting: {
    'Double Entry': {
      misconceptions: [
        'Students debit expenses and credit income — but confuse which side for assets and liabilities',
        'Students think trial balance proves accounts are correct — it only proves debits equal credits',
        'Students confuse capital expenditure (buying an asset) with revenue expenditure (running costs)',
      ],
      examinerTips: [
        'DEAD CLIC: Debits = Expenses, Assets, Drawings. Credits = Liabilities, Income, Capital',
        'Every transaction has TWO entries — one debit and one credit of equal amount',
        'If the trial balance does not balance, open a suspense account',
      ],
      keywords: ['debit', 'credit', 'ledger', 'trial balance', 'suspense account', 'journal entry', 'double entry'],
      mistakes: ['Putting entries on the wrong side', 'Not balancing accounts before extracting trial balance'],
    },
  },
};

export default KNOWLEDGE_BASE;
