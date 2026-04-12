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
    markSchemeQuote: "net movement of water molecules (1) through a partially permeable membrane (1) from a region of higher water potential to a region of lower water potential (1)",
    commandWord: ["define", "state", "explain"],
    extensionQuestion: "A student placed a red blood cell in 10% salt solution and observed it shrink within seconds. Explain what happened using the phrase 'net movement of water molecules' and refer to water potential on both sides of the partially permeable membrane."
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
    markSchemeQuote: "denatured (1)",
    commandWord: ["explain", "describe", "state"],
    extensionQuestion: "A scientist measures enzyme activity at 80°C and finds no reaction occurring. Explain why, and predict what would happen if she cooled the enzyme back down to 37°C. Your answer must include the phrase 'shape of the active site' and explain why the change is irreversible."
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
    markSchemeQuote: "light energy (1) absorbed by chlorophyll (1)",
    commandWord: ["define", "state", "describe", "explain"],
    extensionQuestion: "A gardener grows lettuce under green-coloured glass and notices the plants die. Explain why, using the phrase 'light energy is absorbed by chlorophyll' and referring to the colours of light chlorophyll actually absorbs."
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
    markSchemeQuote: "net movement (1) of molecules/particles from a region of higher concentration to a region of lower concentration (1)",
    commandWord: ["define", "state", "explain"],
    extensionQuestion: "A perfume bottle is opened at the front of a classroom. After 30 seconds a student at the back smells it. Using the phrase 'net movement of particles from a region of higher concentration to a region of lower concentration', explain why the smell eventually becomes undetectable."
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
    markSchemeQuote: "against concentration gradient (1) using energy/ATP (1)",
    commandWord: ["define", "explain", "describe", "compare"],
    extensionQuestion: "Root hair cells absorb mineral ions from soil where the concentration is much lower than inside the cell. A researcher treats the roots with cyanide (which stops respiration) and uptake ceases. Explain this observation using the phrases 'against the concentration gradient' and 'energy from respiration'."
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
    markSchemeQuote: "energy released (1) from glucose (1)",
    commandWord: ["define", "state", "explain", "describe"],
    extensionQuestion: "A marathon runner's muscle cells generate heat and contract rapidly during a race. Using the phrase 'energy released from glucose', explain why the runner feels hot and why they must keep eating carbohydrates. Do not use the words 'make' or 'produce'."
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
    markSchemeQuote: "two genetically identical (1) daughter cells (1)",
    commandWord: ["describe", "explain", "state", "compare"],
    extensionQuestion: "A strawberry plant reproduces asexually via runners to form a colony of offspring. A disease then wipes out the entire colony in days. Using the phrase 'genetically identical daughter cells', explain why all the offspring died while a neighbouring colony grown from seed survived."
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
    markSchemeQuote: "haemoglobin combines with oxygen (1) to form oxyhaemoglobin (1)",
    commandWord: ["describe", "explain", "state"],
    extensionQuestion: "A climber at 5,000 m altitude has a blood oxygen saturation of only 75% compared to 98% at sea level. Using the phrase 'haemoglobin combines with oxygen to form oxyhaemoglobin', explain why this happens and predict how the climber's body adapts over several weeks."
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
    commandWord: ["explain", "describe", "state"],
    modelAnswer: "The enzyme is specific to its substrate because the active site has a complementary shape to the substrate molecule. This means only that specific substrate can bind to form an enzyme-substrate complex. Other molecules cannot bind because their shape is not complementary to the active site.",
    marks: 3,
    extensionQuestion: "A pharmaceutical company designs a drug molecule with almost the same shape as a natural substrate to block an enzyme in a virus. Using the phrases 'active site', 'complementary shape' and 'enzyme-substrate complex', explain how the drug works and predict what would happen if the virus mutated to slightly change the active site shape."
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
    markSchemeQuote: "more frequent successful collisions (1) per unit time (1)",
    commandWord: ["explain", "describe", "state"],
    extensionQuestion: "A student doubles the concentration of hydrochloric acid reacting with marble chips and finds the reaction finishes in half the time. Using the phrase 'more frequent successful collisions per unit time', explain this result — and explain why doubling the concentration does NOT always exactly halve the time."
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
    commandWord: ["explain", "describe"],
    modelAnswer: "Increasing temperature gives particles more kinetic energy, so they move faster. This leads to more frequent successful collisions between reacting particles. A greater proportion of particles now have energy equal to or greater than the activation energy.",
    marks: 3,
    extensionQuestion: "A reaction has a very high activation energy and barely proceeds at 25°C, but at 50°C the rate increases over tenfold — far more than you'd expect from just particles moving faster. Using the phrase 'greater proportion of particles have energy equal to or greater than the activation energy', explain why this small temperature rise has such a large effect."
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
    markSchemeQuote: "minimum energy required (1) for a reaction to occur / for a successful collision (1)",
    commandWord: ["define", "state", "explain"],
    extensionQuestion: "Hydrogen and oxygen gas can be mixed in a balloon at room temperature and sit indefinitely without reacting, but a single spark causes an explosion. Using the phrase 'minimum energy required for a successful collision', explain both observations."
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
    markSchemeQuote: "transfer of electrons (1) from metal to non-metal atom (1) electrostatic attraction between oppositely charged ions (1)",
    commandWord: ["describe", "explain", "state", "compare"],
    extensionQuestion: "Magnesium chloride has the formula MgCl2 but sodium chloride is NaCl. Using the phrases 'transfer of electrons' and 'electrostatic attraction between oppositely charged ions', explain why magnesium combines with two chlorines but sodium only combines with one."
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
    markSchemeQuote: "shared pair of electrons (1)",
    commandWord: ["define", "describe", "explain", "state"],
    extensionQuestion: "Nitrogen gas (N2) is extremely unreactive and requires huge amounts of energy to break apart in industrial processes. Using the phrase 'shared pair of electrons' and referring to how many pairs are shared in N2, explain why this molecule is so unreactive."
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
    markSchemeQuote: "cations/positive ions gain electrons (1) reduced/reduction (1)",
    commandWord: ["describe", "explain", "state"],
    extensionQuestion: "In the electrolysis of molten aluminium oxide, aluminium is produced at the cathode while oxygen is produced at the anode. Using the phrases 'cations gain electrons' and 'reduction occurs at the cathode', write the half-equation for the cathode and explain why the aluminium industry requires enormous electricity supplies."
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
    markSchemeQuote: "rate of forward reaction (1) equals rate of reverse/backward reaction (1)",
    commandWord: ["define", "explain", "describe", "state"],
    extensionQuestion: "A chemist seals nitrogen and hydrogen in a flask; after an hour the ammonia concentration stops changing but a radioactive tracer added to the N2 is later detected in NH3 molecules. Using the phrase 'rate of forward reaction equals rate of reverse reaction', explain what this tracer experiment tells us about equilibrium."
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
    markSchemeQuote: "proton donor (1)",
    commandWord: ["define", "state", "explain", "compare"],
    extensionQuestion: "In the reaction NH3 + H2O ⇌ NH4+ + OH-, water acts as the acid, but in HCl + H2O → H3O+ + Cl- water acts as the base. Using the phrase 'proton donor', explain how water can behave as both an acid and a base and name the term for such substances."
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
    markSchemeQuote: "concentration of H+ ions (1)",
    commandWord: ["define", "state", "calculate", "explain", "compare"],
    extensionQuestion: "A student dilutes a pH 2 solution by a factor of 10 and measures the new pH as 3, not 20. Using the phrase 'concentration of H+ ions' and the relationship pH = -log[H+], explain why pH changes logarithmically rather than linearly with dilution."
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
    markSchemeQuote: "weight is a force (1) measured in newtons (1)",
    commandWord: ["define", "state", "explain", "compare", "calculate"],
    extensionQuestion: "An astronaut with a mass of 70 kg travels to the Moon where g = 1.6 N/kg. Using the phrase 'weight is a force measured in newtons', calculate her weight on Earth and the Moon, then explain why her mass is unchanged but her weight differs."
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
    markSchemeQuote: "speed in a given direction (1)",
    commandWord: ["define", "state", "compare", "explain"],
    extensionQuestion: "A car travels around a circular track at a constant 30 m/s. Using the phrase 'speed in a given direction', explain why the car's speed is constant but its velocity is continuously changing, and state what this means for the car's acceleration."
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
    markSchemeQuote: "force (1) multiplied by distance moved in the direction of the force (1)",
    commandWord: ["define", "state", "calculate", "explain"],
    extensionQuestion: "A waiter walks 10 m across a restaurant carrying a tray with a 5 N drink on it at constant height. Using the phrase 'force multiplied by distance moved in the direction of the force', calculate the work done on the drink and explain your answer — even though the waiter is clearly exerting effort."
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
    markSchemeQuote: "rate of energy transfer (1) / work done per unit time (1)",
    commandWord: ["define", "state", "calculate", "compare", "explain"],
    extensionQuestion: "A 1000 W kettle boils water in 2 minutes; a 2000 W kettle boils the same water in 1 minute. Using the phrase 'rate of energy transfer', explain why both kettles transfer the same total energy but have different powers."
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
    markSchemeQuote: "force per unit area (1)",
    commandWord: ["define", "state", "calculate", "explain"],
    extensionQuestion: "A woman wearing stiletto heels (contact area 1 cm²) can damage a wooden floor that a 3,000 kg elephant (contact area 400 cm² per foot) walks over without harm. Using the phrase 'force per unit area', calculate both pressures and explain why the lighter person causes more damage."
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
    markSchemeQuote: "particles oscillate/vibrate (1) about a fixed/mean position (1)",
    commandWord: ["describe", "state", "explain", "compare"],
    extensionQuestion: "A floating duck bobs up and down on the surface of a pond as water waves pass by but does not travel with the waves toward the shore. Using the phrase 'particles oscillate about a fixed/mean position', explain this observation and state what a wave actually transfers."
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
    markSchemeQuote: "rate of flow of charge (1)",
    commandWord: ["define", "state", "calculate", "explain"],
    extensionQuestion: "In a copper wire, current is carried by free electrons; in a salt solution, current is carried by positive and negative ions moving in opposite directions. Using the phrase 'rate of flow of charge', explain why the same definition of current applies to both cases — and calculate the current if 60 C of charge flows through a solution in 30 s."
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
    markSchemeQuote: "change in quantity demanded (1) movement along the curve (1)",
    commandWord: ["define", "explain", "compare", "analyse", "describe"],
    extensionQuestion: "Coffee prices fall by 20% in one week; the next month a viral health study claims coffee prevents heart disease. Using the phrases 'change in quantity demanded (movement along the curve)' and 'change in demand (shift of the curve)', distinguish between the two separate effects on the coffee market."
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
    markSchemeQuote: "quantity demanded equals quantity supplied (1) at the equilibrium price (1)",
    commandWord: ["define", "explain", "analyse", "describe"],
    extensionQuestion: "A government fixes a maximum rent below the free-market equilibrium. Using the phrase 'quantity demanded equals quantity supplied', explain why this creates a shortage of rental housing and predict two non-price consequences this might cause."
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
    markSchemeQuote: "% change in quantity demanded / % change in price (1) interpretation of value (1)",
    commandWord: ["calculate", "explain", "analyse", "evaluate"],
    extensionQuestion: "A cigarette company raises its price by 20% and sales fall by only 5%, yet a new restaurant raises its prices by 10% and loses 30% of customers. Using the formula '% change in quantity demanded / % change in price', calculate both PED values and evaluate which business has the stronger pricing power and why."
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
    markSchemeQuote: "supported judgement/conclusion (1)",
    commandWord: ["evaluate", "discuss", "assess", "analyse"],
    extensionQuestion: "'The government should subsidise electric cars to reduce pollution.' Using the phrases 'on balance' and 'therefore, the most significant factor is', write a one-paragraph evaluation that weighs at least two arguments on each side and reaches a supported judgement — do not end by saying 'it depends'."
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
    markSchemeQuote: "demand-pull (1) cost-push (1) with explanation of each (2)",
    commandWord: ["define", "explain", "describe", "analyse", "compare"],
    extensionQuestion: "In 2022 UK inflation rose sharply: the Bank of England cited both rising global oil prices and strong post-Covid consumer spending. Using the phrases 'demand-pull: caused by excess aggregate demand' and 'cost-push: caused by rising costs of production', explain how both types contributed and suggest why policy response is harder when both occur together."
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
    markSchemeQuote: "technique identified (1) quotation (1) effect on reader explained (1)",
    commandWord: ["analyse", "explain", "discuss", "evaluate"],
    extensionQuestion: "Take the phrase 'the wind clawed at the shutters' from a gothic short story. Using the PEE structure — identify the technique, quote the phrase, and explain the effect on the reader — write a response that goes beyond 'it creates tension' and explores what specifically the technique makes the reader feel or imagine."
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
    markSchemeQuote: "in own words (1) — lifted phrases score 0",
    commandWord: ["describe", "explain", "suggest"],
    extensionQuestion: "A passage says: 'The torrential downpour decimated the crops, leaving the farmers destitute.' Using the technique of 'paraphrase / using your own words', rewrite this sentence for a summary answer, keeping the meaning but changing every key vocabulary word. Explain why lifting even one of these words would lose marks."
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
    markSchemeQuote: "comparative/contrastive connectives used (1) integrated comparison (1)",
    commandWord: ["compare", "discuss", "analyse", "evaluate"],
    extensionQuestion: "Text A is a travel brochure calling Venice 'a timeless jewel afloat on turquoise waters'; Text B is a news article describing Venice as 'a sinking city overwhelmed by mass tourism'. Using the connectives 'whereas' and 'in contrast', write one integrated paragraph that compares the writers' attitudes — do NOT describe each text in separate sentences."
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
    markSchemeQuote: "answer as fraction/decimal between 0 and 1 (1) — percentage = 0 marks",
    commandWord: ["calculate", "state", "show that"],
    extensionQuestion: "A bag contains 3 red, 5 blue and 2 green beads. A student calculates the probability of drawing red then green without replacement and writes their answer as '6.7%'. Using the convention that probability must be given as a fraction or decimal between 0 and 1, rewrite the answer in acceptable form and explain what the correct working should look like."
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
    markSchemeQuote: "independent derivation without using the given result (M marks)",
    commandWord: ["show that", "prove"],
    extensionQuestion: "A question states: 'A rectangle has perimeter 20 cm and area A cm². Show that A = 10x - x² where x is one side length.' Using the principle 'work from the given information without using the given answer', set out the full derivation starting from the perimeter condition, clearly stating at each line why you have not used the target equation."
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
    markSchemeQuote: "final answer to 3 s.f. or accuracy of given data (A1)",
    commandWord: ["calculate", "state", "show that"],
    extensionQuestion: "A student calculates the hypotenuse of a right triangle with sides 7.42 cm and 5.19 cm. They round each to 1 decimal place first (7.4 and 5.2), then compute the hypotenuse as 9.04 cm. Using the principle 'do not round intermediate calculations' and 'final answer to 3 s.f.', redo the calculation correctly and state the true answer."
  },

  // ═══════════════════════════════════════════
  // A LEVEL — BIOLOGY
  // ═══════════════════════════════════════════
  {
    id: "ms_bio_a_001",
    subject: "biology",
    level: "a_level",
    topic: "Cell signalling",
    concept: "action potential propagation",
    acceptedPhrases: [
      "depolarisation",
      "voltage-gated sodium ion channels open",
      "influx of sodium ions",
      "reaches threshold potential",
      "all-or-nothing response"
    ],
    rejectedPhrases: [
      "electricity travels down the neuron",
      "the signal moves",
      "sodium comes in",
      "the charge flips"
    ],
    examinerNote: "At A Level, must reference 'voltage-gated' channels and 'threshold potential'. Generic 'charge flips' language is GCSE-level and will not score the A Level marks.",
    markSchemeQuote: "voltage-gated sodium ion channels open (1) influx of Na+ causes depolarisation (1) threshold potential reached / all-or-nothing (1)",
    commandWord: ["describe", "explain", "state"],
    extensionQuestion: "Local anaesthetics such as lidocaine work by blocking voltage-gated sodium ion channels. Using the phrases 'voltage-gated sodium ion channels open', 'influx of sodium ions' and 'threshold potential', explain why the patient feels no pain and why the effect wears off gradually rather than suddenly."
  },
  {
    id: "ms_bio_a_002",
    subject: "biology",
    level: "a_level",
    topic: "Genetics",
    concept: "transcription",
    acceptedPhrases: [
      "RNA polymerase",
      "complementary base pairing",
      "template strand",
      "mRNA is synthesised in the 5' to 3' direction",
      "uracil replaces thymine"
    ],
    rejectedPhrases: [
      "DNA becomes RNA",
      "makes a copy of DNA",
      "RNA is made from DNA",
      "copying the gene"
    ],
    examinerNote: "A Level demands 'RNA polymerase', 'template strand' and 'complementary base pairing' — loose GCSE phrasing like 'DNA becomes RNA' does not score.",
    markSchemeQuote: "RNA polymerase binds to promoter (1) uses template strand (1) complementary base pairing — U with A (1) mRNA synthesised 5' to 3' (1)",
    commandWord: ["describe", "explain", "state"],
    extensionQuestion: "A virus infects a cell and uses its own RNA polymerase, which lacks a proofreading function. Using the phrases 'RNA polymerase', 'template strand' and 'complementary base pairing', explain why viral mRNA contains more errors than human mRNA and predict one consequence for vaccine design."
  },

  // ═══════════════════════════════════════════
  // A LEVEL — PHYSICS
  // ═══════════════════════════════════════════
  {
    id: "ms_phys_a_001",
    subject: "physics",
    level: "a_level",
    topic: "Electromagnetic induction",
    concept: "Faraday's and Lenz's laws",
    acceptedPhrases: [
      "rate of change of flux linkage",
      "induced EMF is proportional to the rate of change of flux linkage",
      "induced current opposes the change producing it",
      "EMF = -dΦ/dt"
    ],
    rejectedPhrases: [
      "the magnet induces current",
      "moving the magnet creates electricity",
      "the field makes a current flow",
      "flux makes voltage"
    ],
    examinerNote: "Must explicitly reference 'rate of change of flux linkage' (Faraday) AND 'opposes the change' (Lenz). GCSE-style 'moving the magnet makes electricity' scores 0 at A Level.",
    markSchemeQuote: "induced EMF = rate of change of flux linkage (1) direction opposes the change producing it (1)",
    commandWord: ["state", "explain", "describe", "calculate"],
    extensionQuestion: "A magnet dropped through a copper pipe falls much more slowly than one dropped through a plastic pipe. Using the phrases 'rate of change of flux linkage' and 'induced current opposes the change producing it', explain this observation and predict what would happen if the copper pipe had a vertical slit cut along its length."
  },
  {
    id: "ms_phys_a_002",
    subject: "physics",
    level: "a_level",
    topic: "Simple Harmonic Motion",
    concept: "definition of SHM",
    syllabusCode: "9702",
    acceptedPhrases: [
      "acceleration is directly proportional to displacement from a fixed point",
      "acceleration is always directed towards the fixed point",
      "a = -ω²x",
      "a ∝ -x"
    ],
    rejectedPhrases: [
      "it oscillates back and forth",
      "it vibrates like a spring",
      "it moves like a pendulum",
      "force pulls it back to the middle"
    ],
    examinerNote: "Must include BOTH conditions: proportional to displacement AND directed towards equilibrium (opposite sign). Omitting the negative sign / 'towards fixed point' loses the second mark every time.",
    markSchemeQuote: "acceleration proportional to displacement from a fixed point (1) acceleration (always) directed towards that fixed point / opposite in direction to displacement (1)",
    commandWord: ["define", "state", "explain"],
    extensionQuestion: "A spring–mass system has period 0.50 s. The mass is pulled 4.0 cm from equilibrium and released. Calculate the maximum acceleration, state its direction at t = 0, and explain — using a = -ω²x — why the acceleration is zero as it passes through equilibrium despite the velocity being maximum there."
  },
  {
    id: "ms_phys_a_003",
    subject: "physics",
    level: "a_level",
    topic: "Circular Motion",
    concept: "centripetal force and acceleration",
    syllabusCode: "9702",
    acceptedPhrases: [
      "resultant force directed towards the centre of the circle",
      "centripetal acceleration = v²/r = ω²r",
      "force is perpendicular to velocity so no work is done",
      "speed is constant but velocity changes because direction changes"
    ],
    rejectedPhrases: [
      "centrifugal force pushes it outwards",
      "the object wants to fly outwards",
      "circular motion needs a force to keep it going",
      "centripetal force speeds it up"
    ],
    examinerNote: "Centrifugal force is NOT accepted at A Level — examiners mark zero on any answer invoking it in an inertial frame. Must identify the centripetal force as the RESULTANT, and state it is perpendicular to velocity (hence constant speed, changing direction).",
    markSchemeQuote: "resultant force acts towards centre of circle (1) perpendicular to velocity (1) magnitude = mv²/r (1) speed constant but velocity changes due to change in direction (1)",
    commandWord: ["state", "explain", "show that", "calculate"],
    extensionQuestion: "A conical pendulum of string length 1.2 m swings so the string makes 30° with the vertical. Derive an expression for the period in terms of L, g and θ, and explain — using the phrase 'perpendicular to velocity' — why the tension does no work on the bob despite being the only non-vertical force."
  },
  {
    id: "ms_phys_a_004",
    subject: "physics",
    level: "a_level",
    topic: "Gravitational Fields",
    concept: "gravitational potential",
    syllabusCode: "9702",
    acceptedPhrases: [
      "work done per unit mass in bringing a small test mass from infinity to the point",
      "φ = -GM/r",
      "potential is negative because gravitational force is attractive",
      "work done moving between two points = m(φ₂ - φ₁) = mΔφ"
    ],
    rejectedPhrases: [
      "the energy a mass has in a field",
      "how strong gravity is at that point",
      "potential is how much pull there is",
      "gravitational potential is GM/r"
    ],
    examinerNote: "Three non-negotiables: (1) 'per unit mass', (2) 'from infinity', (3) the negative sign. Dropping any of these loses marks. Students confuse potential (scalar, J kg⁻¹) with field strength (vector, N kg⁻¹) — mark schemes penalise this heavily.",
    markSchemeQuote: "work done per unit mass (1) in bringing a (small test) mass from infinity to the point (1) φ = -GM/r with negative sign explained by attractive force (1)",
    commandWord: ["define", "state", "calculate", "show that"],
    extensionQuestion: "A satellite of mass 800 kg is moved from a circular orbit of radius 7.0 × 10⁶ m to one of radius 4.2 × 10⁷ m around Earth (M = 6.0 × 10²⁴ kg). Calculate the work done against the gravitational field, and explain why this is less than the change in the satellite's total mechanical energy."
  },
  {
    id: "ms_phys_a_005",
    subject: "physics",
    level: "a_level",
    topic: "Capacitors",
    concept: "capacitance, energy stored and time constant",
    syllabusCode: "9702",
    acceptedPhrases: [
      "capacitance = charge stored per unit potential difference, C = Q/V",
      "energy stored = ½CV² = ½QV = ½Q²/C",
      "area under a Q–V graph represents energy stored",
      "time constant τ = RC is the time for charge/voltage to fall to 1/e of its initial value"
    ],
    rejectedPhrases: [
      "capacitance is how much charge it holds",
      "energy stored is QV",
      "the time constant is how long it takes to discharge",
      "capacitors store electricity"
    ],
    examinerNote: "'Energy = QV' (without the ½) is the single most common error — zero marks. The factor of ½ comes from the average pd during charging. For τ, must say '1/e (≈ 37%) of initial value', NOT 'fully discharged'.",
    markSchemeQuote: "C = Q/V (1) energy stored = ½QV because average pd during charging is V/2 (1) τ = RC; after time τ, charge falls to 1/e of Q₀ (1)",
    commandWord: ["define", "show that", "calculate", "explain"],
    extensionQuestion: "A 470 μF capacitor charged to 12 V discharges through a 22 kΩ resistor. Calculate the initial energy stored, the time for the voltage to fall to 3.0 V, and explain — referencing ½CV² — why exactly half the initial energy is dissipated when the voltage reaches V₀/√2."
  },
  {
    id: "ms_phys_a_006",
    subject: "physics",
    level: "a_level",
    topic: "Nuclear Decay",
    concept: "activity, decay constant and half-life",
    syllabusCode: "9702",
    acceptedPhrases: [
      "decay constant λ = probability per unit time that a nucleus will decay",
      "activity A = λN",
      "half-life t½ = ln2 / λ",
      "radioactive decay is random and spontaneous"
    ],
    rejectedPhrases: [
      "half-life is the time for half the sample to disappear",
      "activity is how radioactive something is",
      "λ is the speed of decay",
      "the nucleus decides to decay"
    ],
    examinerNote: "'Random AND spontaneous' are both required — random means unpredictable for individual nuclei, spontaneous means unaffected by external conditions (T, P, chemical state). Half-life must say 'half the UNDECAYED nuclei remaining', not 'half the sample disappears'.",
    markSchemeQuote: "decay is random (cannot predict which nucleus) and spontaneous (unaffected by external conditions) (1) A = λN (1) t½ = ln2/λ where t½ is time for number of undecayed nuclei to halve (1)",
    commandWord: ["define", "state", "show that", "calculate"],
    extensionQuestion: "A sample of ²¹⁴Po (t½ = 164 μs) contains 4.0 × 10¹² atoms. Calculate the initial activity, and explain — using 'A = λN' — why, despite the enormous activity, a GM tube placed next to it may register far fewer counts than expected."
  },
  {
    id: "ms_phys_a_007",
    subject: "physics",
    level: "a_level",
    topic: "Photoelectric Effect",
    concept: "threshold frequency and work function",
    syllabusCode: "9702",
    acceptedPhrases: [
      "one photon interacts with one electron",
      "work function φ = minimum energy to remove an electron from the metal surface",
      "hf = φ + ½mv²max",
      "below threshold frequency no electrons are emitted regardless of intensity"
    ],
    rejectedPhrases: [
      "light gives the electron energy to escape",
      "bright light knocks out more electrons with more energy",
      "the wave heats the metal until electrons escape",
      "photons push the electrons out"
    ],
    examinerNote: "The '1 photon : 1 electron' interaction is the whole point — this is why intensity (more photons) gives more electrons but not more KE. Students who write 'light is absorbed' lose the mark. Must use Einstein's equation in the exact form hf = φ + KEmax.",
    markSchemeQuote: "one photon absorbed by one electron (1) if hf < φ no emission occurs (threshold frequency) (1) hf = φ + ½mv²max where ½mv²max is maximum KE of photoelectron (1)",
    commandWord: ["explain", "state", "calculate", "show that"],
    extensionQuestion: "Light of wavelength 420 nm is incident on a caesium surface (φ = 2.1 eV). Calculate the maximum KE of emitted photoelectrons and the stopping potential. Then explain — in terms of the photon model — why doubling the light intensity doubles the photocurrent but leaves the stopping potential unchanged."
  },
  {
    id: "ms_phys_a_008",
    subject: "physics",
    level: "a_level",
    topic: "Ideal Gas and Kinetic Theory",
    concept: "pV = nRT and internal energy",
    syllabusCode: "9702",
    acceptedPhrases: [
      "pV = nRT where n is number of moles",
      "pV = ⅓Nm<c²> linking macroscopic pressure to mean square speed",
      "internal energy of an ideal gas depends only on temperature",
      "mean translational KE per molecule = (3/2)kT"
    ],
    rejectedPhrases: [
      "gas molecules push on the walls to make pressure",
      "hotter gas has more energy so higher pressure",
      "internal energy is heat inside the gas",
      "molecules all move at the same speed"
    ],
    examinerNote: "'Internal energy of an IDEAL gas = total random kinetic energy of molecules only' — no potential energy term because intermolecular forces are assumed zero. This is the distinguishing feature from real gases. Must use 'mean square speed <c²>', not 'average speed squared'.",
    markSchemeQuote: "pV = nRT (ideal gas equation) (1) pV = ⅓Nm<c²> from kinetic theory (1) internal energy = sum of random KE of molecules only (no PE for ideal gas) (1) mean KE = (3/2)kT ∝ T in kelvin (1)",
    commandWord: ["state", "show that", "calculate", "explain"],
    extensionQuestion: "A sealed container holds 0.20 mol of helium at 300 K. Calculate the root mean square speed of the atoms and the total internal energy. Then explain — using 'internal energy depends only on temperature' — why compressing the gas isothermally requires heat to be removed even though no change in internal energy occurs."
  },
  {
    id: "ms_phys_a_009",
    subject: "physics",
    level: "a_level",
    topic: "Waves and Interference",
    concept: "two-source interference and double-slit fringe spacing",
    syllabusCode: "9702",
    acceptedPhrases: [
      "coherent sources have a constant phase difference and the same frequency",
      "path difference = nλ for constructive interference, (n + ½)λ for destructive",
      "fringe spacing x = λD/a",
      "superposition: displacements add at a point where waves meet"
    ],
    rejectedPhrases: [
      "the waves join together to make bigger waves",
      "coherent means the waves are the same",
      "light is in phase so it interferes",
      "bright fringes are where waves meet"
    ],
    examinerNote: "'Coherent' REQUIRES 'constant phase difference' — saying 'in phase' is not enough and loses the mark (two sources π out of phase are still coherent). Fringe spacing formula only valid when a ≪ D and for small angles. Must reference 'path difference', not just 'distance'.",
    markSchemeQuote: "coherent = constant phase difference (and same frequency) (1) constructive when path difference = nλ (1) destructive when path difference = (n + ½)λ (1) fringe spacing x = λD/a where a is slit separation, D is slit-to-screen distance (1)",
    commandWord: ["define", "state", "show that", "calculate", "explain"],
    extensionQuestion: "In a Young's double-slit experiment, light of wavelength 590 nm illuminates slits 0.25 mm apart; fringes are observed on a screen 1.8 m away. Calculate the fringe spacing. Then explain, using 'path difference = (n + ½)λ', what happens to the pattern when one slit is covered with a thin sheet of glass that introduces a path length equivalent to an extra λ/2."
  },

  // ═══════════════════════════════════════════
  // A LEVEL — ECONOMICS
  // ═══════════════════════════════════════════
  {
    id: "ms_econ_a_001",
    subject: "economics",
    level: "a_level",
    topic: "Market failure",
    concept: "negative externalities",
    acceptedPhrases: [
      "marginal social cost exceeds marginal private cost",
      "MSC > MPC",
      "third parties bear costs",
      "welfare loss / deadweight loss",
      "socially optimal output is lower than free market output"
    ],
    rejectedPhrases: [
      "pollution is bad for society",
      "other people suffer",
      "externalities are negative",
      "the market fails"
    ],
    examinerNote: "A Level requires 'marginal social cost', 'marginal private cost' and identification of 'welfare loss'. GCSE-style descriptions ('pollution is bad') cannot access A Level marks.",
    markSchemeQuote: "MSC > MPC (1) welfare loss triangle identified (1) free market output exceeds socially optimal (1)",
    commandWord: ["define", "explain", "analyse", "evaluate", "discuss"],
    extensionQuestion: "A coal-fired power station emits sulphur dioxide that damages nearby forests. Using the phrases 'marginal social cost exceeds marginal private cost' and 'welfare loss', draw the relevant diagram in words and evaluate whether a Pigouvian tax or tradeable pollution permits would more efficiently internalise the externality."
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
