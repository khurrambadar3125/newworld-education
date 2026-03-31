/**
 * markSchemeKB.js — Cambridge Mark Scheme Language Knowledge Base
 *
 * Stores the EXACT phrases Cambridge mark schemes accept and reject,
 * per subject per topic. Used to teach students examiner-approved language.
 */

const MARK_SCHEME_KB = [
  // ═══════════════════════════════════════════
  // BIOLOGY
  // ═══════════════════════════════════════════
  {
    id: "ms_bio_001",
    subject: "biology",
    level: "o_level",
    topic: "Osmosis",
    concept: "osmosis definition",
    acceptedPhrases: [
      "net movement of water molecules",
      "net movement of water molecules from a region of higher water potential to a region of lower water potential",
      "net movement of water molecules through a partially permeable membrane"
    ],
    rejectedPhrases: [
      "water moves",
      "water goes",
      "water travels",
      "water flows",
      "movement of water"
    ],
    examinerNote: "Examiners require 'net movement of water molecules' — saying just 'water moves' loses the mark. 'Net' and 'molecules' are both essential.",
    markSchemeQuote: "net movement of water molecules (1) through a partially permeable membrane (1) from a region of higher water potential to a region of lower water potential (1)"
  },
  {
    id: "ms_bio_002",
    subject: "biology",
    level: "o_level",
    topic: "Enzymes",
    concept: "enzyme denaturation",
    acceptedPhrases: [
      "denatured",
      "active site changes shape",
      "active site is altered",
      "enzyme is denatured",
      "tertiary structure is altered"
    ],
    rejectedPhrases: [
      "killed",
      "destroyed",
      "broken",
      "dies",
      "stops working",
      "enzyme is dead"
    ],
    examinerNote: "Examiners will not award marks for 'killed' or 'destroyed' — only 'denatured' is accepted. Enzymes are not alive and cannot be killed.",
    markSchemeQuote: "denatured (1)"
  },
  {
    id: "ms_bio_003",
    subject: "biology",
    level: "o_level",
    topic: "Photosynthesis",
    concept: "photosynthesis definition",
    acceptedPhrases: [
      "light energy",
      "light energy is absorbed by chlorophyll",
      "light energy is converted to chemical energy",
      "uses light energy to convert carbon dioxide and water into glucose and oxygen"
    ],
    rejectedPhrases: [
      "energy",
      "uses energy",
      "needs energy",
      "the plant uses energy to make food"
    ],
    examinerNote: "Must specify 'light energy' — just 'energy' is too vague and will not score. The source of energy must be explicit.",
    markSchemeQuote: "light energy (1) absorbed by chlorophyll (1)"
  },
  {
    id: "ms_bio_004",
    subject: "biology",
    level: "o_level",
    topic: "Diffusion",
    concept: "diffusion definition",
    acceptedPhrases: [
      "net movement",
      "net movement of molecules",
      "net movement of particles from a region of higher concentration to a region of lower concentration",
      "net movement down a concentration gradient"
    ],
    rejectedPhrases: [
      "movement",
      "molecules move",
      "particles spread",
      "things move from high to low"
    ],
    examinerNote: "The word 'net' is essential — without it the definition is incomplete and will not score the first mark.",
    markSchemeQuote: "net movement (1) of molecules/particles from a region of higher concentration to a region of lower concentration (1)"
  },
  {
    id: "ms_bio_005",
    subject: "biology",
    level: "o_level",
    topic: "Active transport",
    concept: "active transport definition",
    acceptedPhrases: [
      "against concentration gradient",
      "against the concentration gradient using energy",
      "movement of molecules against a concentration gradient requiring energy from respiration",
      "requires ATP",
      "requires energy from respiration"
    ],
    rejectedPhrases: [
      "moves molecules",
      "uses energy to move things",
      "goes against the flow",
      "opposite of diffusion"
    ],
    examinerNote: "Both 'against concentration gradient' AND 'energy/ATP' must be mentioned for full marks. Missing either one loses a mark.",
    markSchemeQuote: "against concentration gradient (1) using energy/ATP (1)"
  },
  {
    id: "ms_bio_006",
    subject: "biology",
    level: "o_level",
    topic: "Respiration",
    concept: "energy in respiration",
    acceptedPhrases: [
      "energy released",
      "energy is released from glucose",
      "energy released from the breakdown of glucose",
      "releases energy for life processes"
    ],
    rejectedPhrases: [
      "energy made",
      "energy produced",
      "energy created",
      "makes energy",
      "produces energy",
      "creates energy"
    ],
    examinerNote: "Energy is 'released' not 'made' or 'produced'. Energy cannot be created (conservation of energy). This is a very common error that loses marks.",
    markSchemeQuote: "energy released (1) from glucose (1)"
  },
  {
    id: "ms_bio_007",
    subject: "biology",
    level: "o_level",
    topic: "Cell division",
    concept: "mitosis outcome",
    acceptedPhrases: [
      "genetically identical",
      "two genetically identical daughter cells",
      "produces genetically identical cells",
      "daughter cells are genetically identical to the parent cell"
    ],
    rejectedPhrases: [
      "same",
      "same cells",
      "identical cells",
      "copies",
      "makes two cells the same"
    ],
    examinerNote: "Must say 'genetically identical' — just 'same' or 'identical' without 'genetically' does not score. The specification demands this precise phrase.",
    markSchemeQuote: "two genetically identical (1) daughter cells (1)"
  },
  {
    id: "ms_bio_008",
    subject: "biology",
    level: "o_level",
    topic: "Blood",
    concept: "haemoglobin and oxygen",
    acceptedPhrases: [
      "combines with",
      "haemoglobin combines with oxygen",
      "haemoglobin binds to oxygen",
      "oxyhaemoglobin is formed",
      "associates with oxygen"
    ],
    rejectedPhrases: [
      "carries",
      "transports",
      "haemoglobin carries oxygen",
      "takes oxygen around the body"
    ],
    examinerNote: "For top marks, haemoglobin 'combines with' oxygen to form oxyhaemoglobin — 'carries' is a lower-level answer that may not score full marks at IGCSE.",
    markSchemeQuote: "haemoglobin combines with oxygen (1) to form oxyhaemoglobin (1)"
  },
  {
    id: "ms_bio_009",
    subject: "biology",
    level: "o_level",
    topic: "Enzymes",
    concept: "enzyme specificity",
    acceptedPhrases: [
      "complementary shape",
      "active site has a complementary shape to the substrate",
      "enzyme-substrate complex",
      "substrate binds to the active site",
      "only the specific substrate can bind because its shape is complementary to the active site"
    ],
    rejectedPhrases: [
      "lock and key",
      "fits like a lock and key",
      "the enzyme is specific",
      "only one substrate fits",
      "the enzyme matches the substrate"
    ],
    examinerNote: "Students commonly write 'fits like a lock and key' — examiners do not award this phrase. 'Complementary shape' is required. Writing 'the enzyme is specific' without explaining WHY (complementary shape) scores 0 for the explanation mark.",
    markSchemeQuote: "active site has a complementary shape to the substrate (1) substrate binds to the active site forming an enzyme-substrate complex (1) only the specific substrate can bind because its shape is complementary (1)",
    commandWord: "explain",
    modelAnswer: "The enzyme is specific to its substrate because the active site has a complementary shape to the substrate molecule. This means only that specific substrate can bind to form an enzyme-substrate complex. Other molecules cannot bind because their shape is not complementary to the active site.",
    marks: 3
  },

  // ═══════════════════════════════════════════
  // CHEMISTRY
  // ═══════════════════════════════════════════
  {
    id: "ms_chem_001",
    subject: "chemistry",
    level: "o_level",
    topic: "Rates of reaction",
    concept: "collision theory",
    acceptedPhrases: [
      "more frequent successful collisions",
      "increased frequency of successful collisions",
      "more successful collisions per unit time",
      "particles collide more frequently with enough energy"
    ],
    rejectedPhrases: [
      "more collisions",
      "particles collide more",
      "they hit each other more",
      "more reactions happen"
    ],
    examinerNote: "Must say 'more frequent SUCCESSFUL collisions' — just 'more collisions' does not score because not all collisions lead to a reaction.",
    markSchemeQuote: "more frequent successful collisions (1) per unit time (1)"
  },
  {
    id: "ms_chem_009",
    subject: "chemistry",
    level: "o_level",
    topic: "Rates of reaction",
    concept: "effect of temperature on rate",
    acceptedPhrases: [
      "more kinetic energy",
      "particles move faster",
      "more frequent successful collisions",
      "greater proportion of particles have energy equal to or greater than the activation energy",
      "more particles exceed the activation energy"
    ],
    rejectedPhrases: [
      "more collisions",
      "particles collide more",
      "particles move around more",
      "reaction goes faster",
      "higher temperature makes it react quicker"
    ],
    examinerNote: "Students who write only 'more collisions' lose mark 2 — Cambridge requires 'more frequent SUCCESSFUL collisions'. Students who omit activation energy entirely cannot score mark 3. All three mark points are needed for full marks.",
    markSchemeQuote: "particles have more kinetic energy / move faster (1) more frequent successful collisions (1) greater proportion of particles have energy >= activation energy (1)",
    commandWord: "explain",
    modelAnswer: "Increasing temperature gives particles more kinetic energy, so they move faster. This leads to more frequent successful collisions between reacting particles. A greater proportion of particles now have energy equal to or greater than the activation energy.",
    marks: 3
  },
  {
    id: "ms_chem_002",
    subject: "chemistry",
    level: "o_level",
    topic: "Rates of reaction",
    concept: "activation energy",
    acceptedPhrases: [
      "minimum energy required",
      "minimum energy required for a reaction to occur",
      "minimum energy needed for a successful collision",
      "minimum energy for particles to react"
    ],
    rejectedPhrases: [
      "energy needed",
      "energy to react",
      "energy for the reaction",
      "amount of energy needed"
    ],
    examinerNote: "'Minimum' is the key word — without it the definition does not score. 'Energy needed' alone is too vague.",
    markSchemeQuote: "minimum energy required (1) for a reaction to occur / for a successful collision (1)"
  },
  {
    id: "ms_chem_003",
    subject: "chemistry",
    level: "o_level",
    topic: "Bonding",
    concept: "ionic bonding",
    acceptedPhrases: [
      "transfer of electrons",
      "electrons are transferred from metal to non-metal",
      "electrostatic attraction between oppositely charged ions",
      "metal atom loses electrons, non-metal atom gains electrons"
    ],
    rejectedPhrases: [
      "sharing of electrons",
      "electrons are shared",
      "atoms share electrons",
      "they swap electrons"
    ],
    examinerNote: "Ionic bonding is 'transfer' of electrons, NOT 'sharing'. Confusing these two is an automatic zero for the bonding question.",
    markSchemeQuote: "transfer of electrons (1) from metal to non-metal atom (1) electrostatic attraction between oppositely charged ions (1)"
  },
  {
    id: "ms_chem_004",
    subject: "chemistry",
    level: "o_level",
    topic: "Bonding",
    concept: "covalent bonding",
    acceptedPhrases: [
      "sharing of electron pairs",
      "shared pair of electrons",
      "a shared pair of electrons between two atoms",
      "atoms share one or more pairs of electrons"
    ],
    rejectedPhrases: [
      "sharing electrons",
      "electrons are shared",
      "atoms share electrons",
      "they share their electrons"
    ],
    examinerNote: "Must say 'electron PAIRS' or 'pair of electrons' — just 'sharing electrons' without 'pairs' does not get the mark.",
    markSchemeQuote: "shared pair of electrons (1)"
  },
  {
    id: "ms_chem_005",
    subject: "chemistry",
    level: "o_level",
    topic: "Electrolysis",
    concept: "cathode reaction",
    acceptedPhrases: [
      "gain electrons",
      "reduced",
      "cations gain electrons and are reduced",
      "positive ions gain electrons at the cathode",
      "reduction occurs at the cathode"
    ],
    rejectedPhrases: [
      "gets electrons",
      "attracts ions",
      "ions go to cathode",
      "things go to negative electrode"
    ],
    examinerNote: "Must mention BOTH 'gain electrons' AND 'reduced/reduction' for full marks. Either one alone only scores 1 mark.",
    markSchemeQuote: "cations/positive ions gain electrons (1) reduced/reduction (1)"
  },
  {
    id: "ms_chem_006",
    subject: "chemistry",
    level: "o_level",
    topic: "Equilibrium",
    concept: "dynamic equilibrium",
    acceptedPhrases: [
      "rate of forward reaction equals rate of reverse reaction",
      "rate of forward reaction equals rate of backward reaction",
      "forward and reverse reactions occur at equal rates",
      "concentrations of reactants and products remain constant"
    ],
    rejectedPhrases: [
      "reaction stops",
      "balanced",
      "equal amounts of products and reactants",
      "nothing changes",
      "both sides are the same"
    ],
    examinerNote: "BOTH rates (forward AND reverse) must be mentioned and stated as equal. Saying 'the reaction is balanced' or 'equal amounts' will not score.",
    markSchemeQuote: "rate of forward reaction (1) equals rate of reverse/backward reaction (1)"
  },
  {
    id: "ms_chem_007",
    subject: "chemistry",
    level: "a_level",
    topic: "Acids and bases",
    concept: "Bronsted-Lowry acid",
    acceptedPhrases: [
      "proton donor",
      "a proton donor",
      "donates a proton",
      "donates H+ ions"
    ],
    rejectedPhrases: [
      "gives H+ ions",
      "releases H+",
      "has H+ ions",
      "produces hydrogen ions"
    ],
    examinerNote: "At A Level, an acid is defined as a 'proton donor' (Bronsted-Lowry). 'Gives H+ ions' is O Level language and will not score at A Level.",
    markSchemeQuote: "proton donor (1)"
  },
  {
    id: "ms_chem_008",
    subject: "chemistry",
    level: "o_level",
    topic: "Acids and bases",
    concept: "pH definition",
    acceptedPhrases: [
      "concentration of H+ ions",
      "measure of the concentration of hydrogen ions",
      "negative log of hydrogen ion concentration",
      "-log[H+]"
    ],
    rejectedPhrases: [
      "amount of acid",
      "how acidic something is",
      "strength of acid",
      "how strong the acid is"
    ],
    examinerNote: "pH is about 'concentration of H+ ions' not 'amount of acid'. 'Strength' refers to dissociation, not pH — confusing these is a common error.",
    markSchemeQuote: "concentration of H+ ions (1)"
  },

  // ═══════════════════════════════════════════
  // PHYSICS
  // ═══════════════════════════════════════════
  {
    id: "ms_phys_001",
    subject: "physics",
    level: "o_level",
    topic: "Forces",
    concept: "weight vs mass",
    acceptedPhrases: [
      "weight is a force",
      "weight is a force measured in newtons",
      "weight is the gravitational force acting on an object",
      "mass is measured in kilograms, weight in newtons"
    ],
    rejectedPhrases: [
      "weight is how heavy something is",
      "weight and mass are the same",
      "weight is in kg",
      "mass is weight"
    ],
    examinerNote: "Weight is a FORCE measured in NEWTONS — must distinguish clearly from mass (kg). Saying 'weight is how heavy' will not score.",
    markSchemeQuote: "weight is a force (1) measured in newtons (1)"
  },
  {
    id: "ms_phys_002",
    subject: "physics",
    level: "o_level",
    topic: "Motion",
    concept: "speed vs velocity",
    acceptedPhrases: [
      "direction",
      "velocity includes direction",
      "velocity is speed in a given direction",
      "velocity is a vector quantity — has magnitude and direction"
    ],
    rejectedPhrases: [
      "velocity is the same as speed",
      "how fast something moves",
      "velocity is just speed"
    ],
    examinerNote: "Velocity MUST include 'direction' — without mentioning direction, the answer cannot distinguish velocity from speed and scores 0.",
    markSchemeQuote: "speed in a given direction (1)"
  },
  {
    id: "ms_phys_003",
    subject: "physics",
    level: "o_level",
    topic: "Energy",
    concept: "work done",
    acceptedPhrases: [
      "force multiplied by distance moved in the direction of the force",
      "force x distance in direction of force",
      "W = Fd where d is in the direction of the force"
    ],
    rejectedPhrases: [
      "force times distance",
      "force multiplied by distance",
      "F times d",
      "energy used"
    ],
    examinerNote: "'In the direction of the force' is ESSENTIAL — without this qualifier, the definition is incomplete and loses a mark.",
    markSchemeQuote: "force (1) multiplied by distance moved in the direction of the force (1)"
  },
  {
    id: "ms_phys_004",
    subject: "physics",
    level: "o_level",
    topic: "Energy",
    concept: "power definition",
    acceptedPhrases: [
      "rate of energy transfer",
      "rate of doing work",
      "energy transferred per unit time",
      "work done per unit time"
    ],
    rejectedPhrases: [
      "amount of energy",
      "how much energy",
      "energy used",
      "total energy transferred"
    ],
    examinerNote: "'Rate' is the key word — power is energy per unit TIME. Saying 'amount of energy' confuses power with energy and scores 0.",
    markSchemeQuote: "rate of energy transfer (1) / work done per unit time (1)"
  },
  {
    id: "ms_phys_005",
    subject: "physics",
    level: "o_level",
    topic: "Forces",
    concept: "pressure definition",
    acceptedPhrases: [
      "force per unit area",
      "force divided by area",
      "P = F/A"
    ],
    rejectedPhrases: [
      "force on an area",
      "pushing force",
      "how hard something presses",
      "force over area"
    ],
    examinerNote: "'Per unit area' is essential — 'force on an area' or 'force over area' is too vague and will not score.",
    markSchemeQuote: "force per unit area (1)"
  },
  {
    id: "ms_phys_006",
    subject: "physics",
    level: "o_level",
    topic: "Waves",
    concept: "particle behaviour in waves",
    acceptedPhrases: [
      "particles oscillate",
      "particles vibrate",
      "particles vibrate about a fixed point",
      "particles oscillate about their mean position"
    ],
    rejectedPhrases: [
      "particles move",
      "particles travel",
      "particles go up and down",
      "particles move along"
    ],
    examinerNote: "Particles 'oscillate' or 'vibrate' — they do NOT 'move' (which implies net displacement). Waves transfer energy, not matter.",
    markSchemeQuote: "particles oscillate/vibrate (1) about a fixed/mean position (1)"
  },
  {
    id: "ms_phys_007",
    subject: "physics",
    level: "o_level",
    topic: "Electricity",
    concept: "electric current",
    acceptedPhrases: [
      "rate of flow of charge",
      "charge flowing per unit time",
      "I = Q/t"
    ],
    rejectedPhrases: [
      "flow of electrons",
      "electricity flowing",
      "electrons moving through a wire",
      "movement of electrons"
    ],
    examinerNote: "Current is 'rate of flow of CHARGE' not 'flow of electrons'. 'Charge' is the correct term — in electrolytes, ions carry current, not electrons.",
    markSchemeQuote: "rate of flow of charge (1)"
  },

  // ═══════════════════════════════════════════
  // ECONOMICS
  // ═══════════════════════════════════════════
  {
    id: "ms_econ_001",
    subject: "economics",
    level: "o_level",
    topic: "Demand",
    concept: "demand vs quantity demanded",
    acceptedPhrases: [
      "quantity demanded",
      "the quantity demanded at a given price",
      "a change in quantity demanded is a movement along the demand curve",
      "a change in demand is a shift of the demand curve"
    ],
    rejectedPhrases: [
      "demand",
      "demand changes",
      "demand goes up",
      "more demand"
    ],
    examinerNote: "'Demand' and 'quantity demanded' are different concepts. 'Demand' shifts the curve; 'quantity demanded' moves along it. Confusing them loses marks.",
    markSchemeQuote: "change in quantity demanded (1) movement along the curve (1)"
  },
  {
    id: "ms_econ_002",
    subject: "economics",
    level: "o_level",
    topic: "Market equilibrium",
    concept: "equilibrium definition",
    acceptedPhrases: [
      "quantity demanded equals quantity supplied",
      "where demand meets supply",
      "the price at which quantity demanded equals quantity supplied",
      "no excess demand or excess supply"
    ],
    rejectedPhrases: [
      "supply equals demand",
      "everything is balanced",
      "the price is right",
      "market is balanced"
    ],
    examinerNote: "BOTH 'quantity demanded' AND 'quantity supplied' must be stated as equal. Just saying 'supply equals demand' is imprecise and will not score full marks.",
    markSchemeQuote: "quantity demanded equals quantity supplied (1) at the equilibrium price (1)"
  },
  {
    id: "ms_econ_003",
    subject: "economics",
    level: "o_level",
    topic: "Elasticity",
    concept: "price elasticity of demand",
    acceptedPhrases: [
      "percentage change in quantity demanded divided by percentage change in price",
      "PED = %ΔQd / %ΔP",
      "elastic if PED > 1",
      "inelastic if PED < 1"
    ],
    rejectedPhrases: [
      "how much demand changes",
      "sensitivity of demand",
      "how price affects demand"
    ],
    examinerNote: "Must give the FORMULA and INTERPRET the value. A numerical answer alone scores 0. Must state whether elastic (>1) or inelastic (<1) and what that means.",
    markSchemeQuote: "% change in quantity demanded / % change in price (1) interpretation of value (1)"
  },
  {
    id: "ms_econ_004",
    subject: "economics",
    level: "o_level",
    topic: "Evaluation",
    concept: "evaluation technique",
    acceptedPhrases: [
      "a conclusion",
      "a judgement",
      "on balance",
      "overall, this suggests",
      "weighing up the arguments",
      "therefore, the most significant factor is"
    ],
    rejectedPhrases: [
      "there are advantages and disadvantages",
      "there are pros and cons",
      "it depends"
    ],
    examinerNote: "Must reach a CONCLUSION or JUDGEMENT — listing both sides without concluding is analysis, not evaluation. Top marks require a supported judgement.",
    markSchemeQuote: "supported judgement/conclusion (1)"
  },
  {
    id: "ms_econ_005",
    subject: "economics",
    level: "o_level",
    topic: "Inflation",
    concept: "types of inflation",
    acceptedPhrases: [
      "demand-pull inflation",
      "cost-push inflation",
      "demand-pull: caused by excess aggregate demand",
      "cost-push: caused by rising costs of production"
    ],
    rejectedPhrases: [
      "prices go up",
      "things get more expensive",
      "too much money",
      "inflation is when prices rise"
    ],
    examinerNote: "Must distinguish 'demand-pull' from 'cost-push' when asked about causes. Naming only one type or giving a generic answer will not score full marks.",
    markSchemeQuote: "demand-pull (1) cost-push (1) with explanation of each (2)"
  },

  // ═══════════════════════════════════════════
  // ENGLISH
  // ═══════════════════════════════════════════
  {
    id: "ms_eng_001",
    subject: "english",
    level: "o_level",
    topic: "Language analysis",
    concept: "PEE/PQE technique",
    acceptedPhrases: [
      "identify the technique",
      "quote from the text",
      "explain the effect on the reader",
      "the writer uses [technique] in '[quote]' which creates a sense of",
      "this makes the reader feel"
    ],
    rejectedPhrases: [
      "the writer uses a metaphor",
      "this is effective",
      "the quote shows",
      "it is a good description"
    ],
    examinerNote: "Must do ALL THREE: identify technique, provide a quote, AND explain effect on reader. 2 out of 3 does not score full marks. 'This is effective' without saying WHY scores 0.",
    markSchemeQuote: "technique identified (1) quotation (1) effect on reader explained (1)"
  },
  {
    id: "ms_eng_002",
    subject: "english",
    level: "o_level",
    topic: "Summary writing",
    concept: "own words requirement",
    acceptedPhrases: [
      "in own words",
      "paraphrase",
      "using your own words",
      "rephrase the original"
    ],
    rejectedPhrases: [
      "copy from text",
      "lifted phrases",
      "exact words from passage"
    ],
    examinerNote: "Summary answers MUST be 'in own words' — lifted phrases from the passage score 0 even if the content is correct. Paraphrasing is mandatory.",
    markSchemeQuote: "in own words (1) — lifted phrases score 0"
  },
  {
    id: "ms_eng_003",
    subject: "english",
    level: "o_level",
    topic: "Comparison",
    concept: "comparative connectives",
    acceptedPhrases: [
      "similarly",
      "whereas",
      "however",
      "in contrast",
      "on the other hand",
      "both texts",
      "while Text A... Text B"
    ],
    rejectedPhrases: [
      "Text A says... Text B says",
      "in the first text... in the second text",
      "one text is about... the other is about"
    ],
    examinerNote: "Must use COMPARATIVE connectives (similarly, whereas, however, in contrast). Describing each text separately without comparing loses marks — this is 'parallel description', not comparison.",
    markSchemeQuote: "comparative/contrastive connectives used (1) integrated comparison (1)"
  },

  // ═══════════════════════════════════════════
  // MATHEMATICS
  // ═══════════════════════════════════════════
  {
    id: "ms_maths_001",
    subject: "mathematics",
    level: "o_level",
    topic: "Probability",
    concept: "probability notation",
    acceptedPhrases: [
      "between 0 and 1",
      "as a fraction",
      "as a decimal between 0 and 1",
      "0 ≤ P ≤ 1"
    ],
    rejectedPhrases: [
      "percentage",
      "as a percent",
      "50%",
      "out of 100"
    ],
    examinerNote: "Probability answers MUST be between 0 and 1 (fraction or decimal). Percentage answers score 0 — even if the calculation is correct.",
    markSchemeQuote: "answer as fraction/decimal between 0 and 1 (1) — percentage = 0 marks"
  },
  {
    id: "ms_maths_002",
    subject: "mathematics",
    level: "o_level",
    topic: "Proof",
    concept: "show that questions",
    acceptedPhrases: [
      "work from the given information",
      "derive the answer independently",
      "show each step of working",
      "do not use the given answer in your working"
    ],
    rejectedPhrases: [
      "use the answer to work backwards",
      "substitute the answer in",
      "start with the given answer",
      "circular argument"
    ],
    examinerNote: "In 'show that' questions, you MUST NOT use the given answer in your working — this is a circular argument and scores 0. Work forward from the given information.",
    markSchemeQuote: "independent derivation without using the given result (M marks)"
  },
  {
    id: "ms_maths_003",
    subject: "mathematics",
    level: "o_level",
    topic: "Accuracy",
    concept: "significant figures",
    acceptedPhrases: [
      "give answer to appropriate degree of accuracy",
      "match accuracy of given data",
      "3 significant figures unless otherwise stated",
      "do not round intermediate calculations"
    ],
    rejectedPhrases: [
      "round to nearest whole number",
      "give exact answer when approximate is needed",
      "premature rounding"
    ],
    examinerNote: "Final answer must match the accuracy of given data — typically 3 significant figures. Premature rounding in working loses accuracy marks.",
    markSchemeQuote: "final answer to 3 s.f. or accuracy of given data (A1)"
  }
];

// ─────────────────────────────────────────────
// EXPORTS: Lookup & checking functions
// ─────────────────────────────────────────────

/**
 * Get all mark scheme entries for a given subject
 */
function getMarkSchemeBySubject(subject) {
  const s = subject.toLowerCase().trim();
  return MARK_SCHEME_KB.filter(entry => entry.subject === s);
}

/**
 * Get mark scheme entries for a specific subject + topic
 */
function getMarkSchemeByTopic(subject, topic) {
  const s = subject.toLowerCase().trim();
  const t = topic.toLowerCase().trim();
  return MARK_SCHEME_KB.filter(
    entry => entry.subject === s && entry.topic.toLowerCase() === t
  );
}

/**
 * Scan a student's answer for rejected phrases and return corrections
 * Returns an array of { rejected, accepted, examinerNote, concept } objects
 */
function checkStudentAnswer(subject, studentText) {
  const s = subject.toLowerCase().trim();
  const text = studentText.toLowerCase();
  const corrections = [];

  const subjectEntries = MARK_SCHEME_KB.filter(entry => entry.subject === s);

  for (const entry of subjectEntries) {
    for (const rejected of entry.rejectedPhrases) {
      if (text.includes(rejected.toLowerCase())) {
        corrections.push({
          rejected,
          accepted: entry.acceptedPhrases[0],
          allAccepted: entry.acceptedPhrases,
          examinerNote: entry.examinerNote,
          concept: entry.concept,
          topic: entry.topic
        });
        break; // one correction per entry to avoid duplicates
      }
    }
  }

  return corrections;
}

/**
 * Get the primary accepted phrase for a concept within a subject
 */
function getAcceptedPhrase(subject, concept) {
  const s = subject.toLowerCase().trim();
  const c = concept.toLowerCase().trim();
  const entry = MARK_SCHEME_KB.find(
    e => e.subject === s && e.concept.toLowerCase() === c
  );
  return entry ? entry.acceptedPhrases[0] : null;
}

module.exports = {
  MARK_SCHEME_KB,
  getMarkSchemeBySubject,
  getMarkSchemeByTopic,
  checkStudentAnswer,
  getAcceptedPhrase
};
