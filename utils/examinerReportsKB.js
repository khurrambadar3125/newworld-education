// ============================================================
// EXAMINER REPORTS KNOWLEDGE BASE
// Common mistakes identified by Cambridge examiners in their
// official examiner reports (Principal Examiner Reports).
//
// Each subject contains mistakes grouped by topic/paper.
// Used to catch students making errors that examiners
// specifically penalise, and correct them in real-time.
// ============================================================

const EXAMINER_REPORTS = {
  chemistry: [
    { topic: 'States of Matter', mistake: 'describing particles as "expanding" when heated', examinerComment: 'Particles do NOT expand. They move faster and further apart. Candidates who wrote "particles expand" lost the mark every time.', triggers: ['particles expand', 'particles get bigger', 'atoms expand when heated'] },
    { topic: 'States of Matter', mistake: 'confusing evaporation with boiling', examinerComment: 'Evaporation occurs at the surface at any temperature. Boiling occurs throughout the liquid at a fixed temperature. Many candidates failed to distinguish these.', triggers: ['evaporation.*same.*boiling', 'boiling.*surface'] },
    { topic: 'Atomic Structure', mistake: 'saying electrons orbit "like planets"', examinerComment: 'At O Level, electrons occupy shells/energy levels. The planetary model is outdated. Candidates should describe electron configuration using shell notation (2,8,1).', triggers: ['orbit like planet', 'electrons.*circle.*nucleus'] },
    { topic: 'Chemical Bonding', mistake: 'writing "atoms share electrons to be stable" without specifying full outer shell', examinerComment: 'Candidates must state that atoms share electrons to achieve a full outer shell (or octet/duplet). "To be stable" alone is too vague to earn the mark.', triggers: ['share.*to be stable', 'covalent.*stable'] },
    { topic: 'Chemical Bonding', mistake: 'saying ionic compounds conduct electricity when solid', examinerComment: 'Ionic compounds conduct ONLY when molten or dissolved — ions must be free to move. In solid state, ions are in fixed positions. This error was very common.', triggers: ['ionic.*conduct.*solid', 'salt.*conduct.*electricity'] },
    { topic: 'Stoichiometry', mistake: 'not showing working in mole calculations', examinerComment: 'Candidates who jumped straight to the answer without showing moles = mass/Mr lost method marks. Even with the wrong answer, method marks can save grades.', triggers: ['moles.*answer', 'calculate.*moles'] },
    { topic: 'Stoichiometry', mistake: 'using wrong units for concentration', examinerComment: 'Concentration must be in mol/dm3 or g/dm3. Many candidates used mol/cm3 or forgot to convert cm3 to dm3 (divide by 1000).', triggers: ['concentration.*cm3', 'mol.*per.*cm'] },
    { topic: 'Electrochemistry', mistake: 'confusing anode and cathode', examinerComment: 'Anode = positive electrode where oxidation occurs. Cathode = negative electrode where reduction occurs. OILRIG. A significant number lost marks on this basic point.', triggers: ['anode.*negative', 'cathode.*positive', 'anode.*reduction'] },
    { topic: 'Energetics', mistake: 'saying a catalyst changes the enthalpy change', examinerComment: 'A catalyst lowers activation energy ONLY. It does NOT change delta H. Candidates who stated a catalyst changes the energy released/absorbed were penalised.', triggers: ['catalyst.*change.*enthalpy', 'catalyst.*more energy', 'catalyst.*delta h'] },
    { topic: 'Rates of Reaction', mistake: 'saying higher temperature means "more energy in collisions" without mentioning frequency', examinerComment: 'Two marks available: (1) more frequent collisions AND (2) more particles with energy >= activation energy. Most candidates only gave one reason and lost a mark.', triggers: ['temperature.*faster.*collision'] },
    { topic: 'Equilibrium', mistake: 'saying a catalyst shifts equilibrium', examinerComment: 'A catalyst speeds up BOTH forward and reverse reactions equally. It does NOT shift the equilibrium position. This was the most common error in the equilibrium section.', triggers: ['catalyst.*shift.*equilibrium', 'catalyst.*more product'] },
    { topic: 'Acids and Bases', mistake: 'confusing strong/weak with concentrated/dilute', examinerComment: 'Strong/weak refers to degree of dissociation (ionisation). Concentrated/dilute refers to amount of solute per unit volume. These are independent properties.', triggers: ['strong.*concentrated.*same', 'weak.*dilute.*same', 'strong acid.*lots of'] },
    { topic: 'Organic Chemistry', mistake: 'writing molecular formula instead of structural formula', examinerComment: 'When asked for structural formula, candidates must show all bonds. C2H5OH is a molecular formula. CH3CH2OH or the displayed formula is required.', triggers: ['structural.*formula'] },
    { topic: 'Periodic Table', mistake: 'saying reactivity of halogens increases down the group', examinerComment: 'Halogen reactivity DECREASES down the group (F most reactive, I least). This is the opposite of Group I metals. Candidates frequently confused the two trends.', triggers: ['halogen.*more reactive.*down', 'halogen.*reactivity.*increase'] },
    { topic: 'Equations', mistake: 'missing state symbols', examinerComment: 'State symbols (s)(l)(g)(aq) are required in almost every equation at Cambridge. Missing state symbols is the single most common mark lost across all Chemistry papers.', triggers: ['equation', 'balanced equation', 'reaction.*equation'] },
    { topic: 'Metals', mistake: 'saying all metals react with dilute acid', examinerComment: 'Only metals above hydrogen in the reactivity series react with dilute acids. Copper, silver, gold do NOT react with dilute HCl or H2SO4.', triggers: ['all metals.*react.*acid', 'copper.*react.*acid', 'metal.*always.*acid'] },
  ],

  physics: [
    { topic: 'Forces', mistake: 'confusing mass and weight', examinerComment: 'Mass is measured in kg and does not change with location. Weight is a force measured in N (W=mg) and varies with gravitational field strength. This distinction is tested every year.', triggers: ['mass.*newton', 'weight.*kg', 'mass.*change.*moon'] },
    { topic: 'Forces', mistake: 'saying objects at constant velocity have no forces', examinerComment: 'Constant velocity = balanced forces (resultant force = zero), NOT no forces. A car at constant speed has driving force balanced by friction. Many candidates wrote "no force."', triggers: ['constant.*velocity.*no force', 'no force.*moving'] },
    { topic: 'Energy', mistake: 'saying energy is "used up" or "lost"', examinerComment: 'Energy is TRANSFERRED or DISSIPATED, never created or destroyed. Candidates who wrote "energy is lost" without clarifying "to the surroundings as heat" were penalised.', triggers: ['energy.*used up', 'energy.*lost', 'energy.*disappear', 'energy.*destroyed'] },
    { topic: 'Waves', mistake: 'saying sound travels through a vacuum', examinerComment: 'Sound is a longitudinal wave that requires a medium (solid, liquid, or gas). It cannot travel through a vacuum. This basic fact was still missed by many candidates.', triggers: ['sound.*vacuum', 'sound.*space', 'hear.*space'] },
    { topic: 'Waves', mistake: 'confusing transverse and longitudinal waves', examinerComment: 'Transverse: oscillation perpendicular to direction of travel (light, water). Longitudinal: oscillation parallel to direction (sound). Diagrams should show this clearly.', triggers: ['sound.*transverse', 'light.*longitudinal'] },
    { topic: 'Electricity', mistake: 'saying current is used up in a circuit', examinerComment: 'Current is the same at all points in a series circuit. It is NOT used up. Voltage (potential difference) drops across components. This misconception was widespread.', triggers: ['current.*used up', 'current.*less after', 'current.*consumed'] },
    { topic: 'Electricity', mistake: 'confusing series and parallel resistance rules', examinerComment: 'Series: R_total = R1 + R2. Parallel: 1/R_total = 1/R1 + 1/R2. Many candidates applied the wrong formula. In parallel, total resistance is always LESS than the smallest individual resistance.', triggers: ['parallel.*add.*resistance', 'series.*1/r'] },
    { topic: 'Thermal Physics', mistake: 'saying heat and temperature are the same', examinerComment: 'Temperature is a measure of average kinetic energy of particles. Heat is thermal energy transferred due to a temperature difference. They are different quantities.', triggers: ['heat.*temperature.*same', 'temperature.*thermal energy.*same'] },
    { topic: 'Nuclear Physics', mistake: 'saying alpha radiation is the most dangerous overall', examinerComment: 'Alpha is most ionising but least penetrating. Inside the body, alpha is most dangerous. Outside the body, gamma is most dangerous (most penetrating). Context matters.', triggers: ['alpha.*most dangerous', 'alpha.*worst radiation'] },
    { topic: 'Motion', mistake: 'reading speed from a distance-time graph as distance/time at a point', examinerComment: 'Speed at a point on a curved distance-time graph is found from the GRADIENT of the tangent at that point, not by dividing distance by time. This error was very common.', triggers: ['speed.*distance.*time.*point', 'speed.*graph.*divide'] },
    { topic: 'Pressure', mistake: 'confusing atmospheric pressure direction', examinerComment: 'Atmospheric pressure acts in ALL directions, not just downward. Candidates who drew pressure arrows only pointing down lost marks.', triggers: ['atmospheric.*pressure.*down.*only', 'air pressure.*push.*down'] },
    { topic: 'Magnetism', mistake: 'confusing magnetic and electric fields', examinerComment: 'Magnetic field lines go from North to South. Electric field lines go from positive to negative. Many candidates mixed the conventions. Field line arrows must be correct.', triggers: ['magnetic.*positive.*negative', 'field.*north.*positive'] },
  ],

  biology: [
    { topic: 'Cells', mistake: 'saying plant cells have no mitochondria', examinerComment: 'Plant cells DO have mitochondria — they need aerobic respiration too. Chloroplasts are for photosynthesis, mitochondria for respiration. Both are present.', triggers: ['plant.*no.*mitochondria', 'plant.*only.*chloroplast'] },
    { topic: 'Cells', mistake: 'confusing cell membrane and cell wall', examinerComment: 'Cell membrane: selectively permeable, controls entry/exit. Cell wall: fully permeable, provides structural support. All cells have membranes; only plant cells have walls.', triggers: ['cell wall.*selectively', 'membrane.*support.*structure', 'wall.*controls.*entry'] },
    { topic: 'Enzymes', mistake: 'saying enzymes are "killed" by high temperature', examinerComment: 'Enzymes are DENATURED, not killed — they are not alive. Denaturation changes the shape of the active site so the substrate can no longer fit. "Killed" = zero marks.', triggers: ['enzyme.*killed', 'enzyme.*die', 'enzyme.*dead'] },
    { topic: 'Enzymes', mistake: 'saying the enzyme changes shape to fit the substrate', examinerComment: 'The substrate fits the active site because of complementary shape (lock and key model at O Level). The enzyme has a specific active site shape. Do not describe induced fit at O Level unless specifically asked.', triggers: ['enzyme.*changes.*shape.*fit'] },
    { topic: 'Photosynthesis', mistake: 'saying plants only photosynthesise and do not respire', examinerComment: 'Plants respire 24 hours a day AND photosynthesise only in light. In daylight, photosynthesis rate exceeds respiration rate. At night, only respiration occurs.', triggers: ['plant.*only.*photosynthes', 'plant.*no.*respir', 'plant.*don\'t.*respir'] },
    { topic: 'Respiration', mistake: 'confusing respiration with breathing', examinerComment: 'Respiration is a chemical reaction in cells (glucose + oxygen → CO2 + water + energy). Breathing is a physical process of moving air in and out of lungs. They are NOT the same.', triggers: ['respiration.*breathing.*same', 'respir.*inhale.*exhale'] },
    { topic: 'Transport in Plants', mistake: 'saying water moves up by suction from leaves', examinerComment: 'Water moves up by transpiration pull (cohesion-tension) and root pressure. There is no "suction" — the pull is created by evaporation from leaf surfaces creating tension in xylem.', triggers: ['water.*suction.*leaves', 'plant.*suck.*water'] },
    { topic: 'Genetics', mistake: 'confusing genes, alleles, and chromosomes', examinerComment: 'Chromosome: structure of DNA + protein. Gene: section of DNA coding for one protein. Allele: different version of the same gene. Many candidates used these interchangeably.', triggers: ['gene.*chromosome.*same', 'allele.*gene.*same'] },
    { topic: 'Genetics', mistake: 'not using correct genetic diagram format', examinerComment: 'Genetic crosses must show: parental phenotypes, parental genotypes, gametes (in circles), Punnett square, offspring genotypes AND phenotypes with ratio. Missing any step loses marks.', triggers: ['genetic.*cross', 'punnett.*square', 'genetic.*diagram'] },
    { topic: 'Ecology', mistake: 'saying energy is recycled in an ecosystem', examinerComment: 'Energy FLOWS through an ecosystem (it is not recycled). Only NUTRIENTS are recycled. Energy enters as light, is transferred through trophic levels, and is lost as heat at each stage.', triggers: ['energy.*recycled', 'energy.*cycle.*ecosystem'] },
    { topic: 'Osmosis', mistake: 'describing osmosis without mentioning "partially permeable membrane"', examinerComment: 'The definition of osmosis MUST include: net movement of water molecules, from dilute to concentrated solution, through a partially permeable membrane. Missing any part loses marks.', triggers: ['osmosis'] },
    { topic: 'Nervous System', mistake: 'saying nerves carry messages', examinerComment: 'Neurons transmit electrical impulses (not "messages"). Specific terminology is required: impulse, not signal or message. Neurotransmitters cross synapses by diffusion.', triggers: ['nerve.*send.*message', 'nerve.*carry.*message', 'brain.*send.*message'] },
  ],

  mathematics: [
    { topic: 'Algebra', mistake: 'not showing working in "show that" questions', examinerComment: 'In "show that" questions, the answer is given. Full algebraic working from start to given answer is required. Writing only the answer = zero marks.', triggers: ['show that', 'prove that'] },
    { topic: 'Algebra', mistake: 'premature rounding in multi-step calculations', examinerComment: 'Candidates must keep full calculator values through intermediate steps and only round the final answer. Rounding too early introduces cumulative error and loses accuracy marks.', triggers: ['round', 'decimal place', 'significant figure'] },
    { topic: 'Geometry', mistake: 'not stating reasons in angle calculations', examinerComment: 'Every angle calculation must include the geometric reason: "angles in a triangle sum to 180°", "opposite angles of a cyclic quadrilateral sum to 180°", etc. Correct answer without reason = 1 mark lost.', triggers: ['angle', 'triangle', 'circle theorem'] },
    { topic: 'Trigonometry', mistake: 'using degrees when calculator is in radians mode (or vice versa)', examinerComment: 'Candidates frequently obtained wrong answers because their calculator was in the wrong mode. Check the question: if angles are in degrees, use degree mode.', triggers: ['radian', 'degree', 'trigonometr', 'sin.*cos.*tan'] },
    { topic: 'Statistics', mistake: 'plotting cumulative frequency at class midpoints', examinerComment: 'Cumulative frequency must be plotted at the UPPER class boundary, not the midpoint. This was the most common error in the statistics section.', triggers: ['cumulative frequency', 'ogive', 'class boundary'] },
    { topic: 'Graphs', mistake: 'not using a ruler for straight-line graphs', examinerComment: 'Straight lines drawn freehand lose marks. Use a ruler. For curves, draw a smooth curve through the points — do not join point-to-point with straight line segments.', triggers: ['graph', 'plot', 'straight line', 'curve'] },
    { topic: 'Vectors', mistake: 'confusing position vectors with direction vectors', examinerComment: 'A position vector gives the location of a point relative to the origin. A direction vector gives magnitude and direction of travel between two points. Candidates confused these regularly.', triggers: ['vector', 'position vector', 'direction vector'] },
    { topic: 'Probability', mistake: 'not expressing probability as a fraction, decimal, or percentage', examinerComment: 'Probability must be given as a fraction, decimal, or percentage. Expressing it as a ratio (e.g., 1:3) is NOT acceptable and will lose marks.', triggers: ['probability', 'chance', 'likely'] },
  ],

  economics: [
    { topic: 'Demand and Supply', mistake: 'confusing movement along a curve with a shift of the curve', examinerComment: 'A change in price causes movement ALONG the curve. A change in a non-price factor (income, tastes, etc.) causes a SHIFT of the curve. Candidates who drew the wrong type of change lost all marks.', triggers: ['demand.*shift', 'supply.*shift', 'movement.*along', 'demand.*increase'] },
    { topic: 'Elasticity', mistake: 'not using the correct formula for PED', examinerComment: 'PED = % change in quantity demanded / % change in price. Many candidates inverted the formula or forgot to express changes as percentages. The sign is negative but the magnitude is what matters.', triggers: ['elasticity', 'PED', 'price elastic'] },
    { topic: 'Market Failure', mistake: 'confusing private and social costs', examinerComment: 'Private costs are borne by the producer/consumer. External costs are borne by third parties. Social cost = private cost + external cost. Candidates who did not distinguish these clearly lost marks.', triggers: ['external.*cost', 'social.*cost', 'private.*cost', 'market failure'] },
    { topic: 'Macroeconomics', mistake: 'writing about inflation without distinguishing demand-pull from cost-push', examinerComment: 'Candidates must identify the TYPE of inflation: demand-pull (excess aggregate demand) or cost-push (rising production costs). Generic answers about "prices going up" scored poorly.', triggers: ['inflation', 'price.*rise', 'cost.*push', 'demand.*pull'] },
    { topic: 'Trade', mistake: 'confusing absolute and comparative advantage', examinerComment: 'Absolute advantage: producing more with the same resources. Comparative advantage: lower opportunity cost. Trade is based on comparative advantage, not absolute. This distinction is fundamental.', triggers: ['comparative advantage', 'absolute advantage', 'opportunity cost.*trade'] },
    { topic: 'Government Policy', mistake: 'not linking policy to specific economic objective', examinerComment: 'Every policy recommendation must be linked to a specific objective (growth, stability, employment, trade balance). Vague answers about "improving the economy" scored poorly.', triggers: ['fiscal policy', 'monetary policy', 'government.*intervention'] },
  ],

  english: [
    { topic: 'Comprehension', mistake: 'copying entire sentences from the passage', examinerComment: 'Candidates must use their OWN words. Lifting phrases directly from the passage does not demonstrate understanding. Paraphrase with synonyms and restructured sentences.', triggers: ['own words', 'paraphrase', 'comprehension', 'passage'] },
    { topic: 'Summary', mistake: 'exceeding the word limit in summary questions', examinerComment: 'Summary answers that exceed the word limit are penalised. Only content within the word limit is assessed. Candidates must select the MOST important points and express them concisely.', triggers: ['summary', 'word limit', 'summarise'] },
    { topic: 'Language Analysis', mistake: 'identifying a technique without explaining its effect', examinerComment: 'Naming a technique (metaphor, simile, alliteration) earns zero marks without explaining its EFFECT on the reader. "The writer uses a metaphor" = 0 marks. Must explain what feeling/image it creates.', triggers: ['metaphor', 'simile', 'technique', 'language.*effect', 'writer.*use'] },
    { topic: 'Directed Writing', mistake: 'not adopting the correct register and audience', examinerComment: 'If asked to write a letter/speech/article, candidates must match the format, tone, and audience. A formal letter written in casual language loses marks for register. Address the specified audience directly.', triggers: ['letter', 'speech', 'article', 'register', 'audience'] },
    { topic: 'Creative Writing', mistake: 'no clear narrative structure', examinerComment: 'The best creative writing has a clear beginning, development, and resolution. Many candidates started promisingly but ran out of time or ideas, leaving the ending rushed or absent.', triggers: ['creative writing', 'narrative', 'story', 'descriptive writing'] },
    { topic: 'Argumentative Writing', mistake: 'presenting only one side of the argument', examinerComment: 'Argumentative/discursive writing must present BOTH sides before reaching a conclusion. One-sided arguments, however well-written, cannot achieve top marks.', triggers: ['argument', 'discursive', 'persuasive', 'for and against'] },
  ],

  business: [
    { topic: 'Marketing', mistake: 'confusing market research methods with marketing methods', examinerComment: 'Market research is about gathering information (surveys, focus groups). Marketing is about promoting and selling products (advertising, pricing). Candidates frequently confused these concepts.', triggers: ['market research', 'marketing.*method', 'survey.*marketing'] },
    { topic: 'Finance', mistake: 'not showing formula in calculation questions', examinerComment: 'Calculation questions require: formula stated, values substituted, answer with units. Jumping to the answer without showing the formula loses method marks.', triggers: ['profit', 'revenue', 'break.*even', 'cash flow'] },
    { topic: 'Human Resources', mistake: 'listing motivation theories without applying to context', examinerComment: 'Simply naming "Maslow" or "Herzberg" without explaining how their theory applies to the specific business scenario in the question earns minimal marks. Application to context is key.', triggers: ['motivation', 'maslow', 'herzberg', 'taylor'] },
    { topic: 'Operations', mistake: 'confusing quality control and quality assurance', examinerComment: 'Quality control: checking products at the end. Quality assurance: building quality into every stage of production. Candidates who described QC when asked about QA (or vice versa) lost marks.', triggers: ['quality control', 'quality assurance', 'QC', 'QA'] },
    { topic: 'Case Study', mistake: 'giving generic answers not linked to the case study', examinerComment: 'Higher mark questions require analysis and evaluation linked to the SPECIFIC business in the case study. Generic textbook answers without reference to the given data scored poorly.', triggers: ['case study', 'the business', 'recommend.*business'] },
  ],

  computer_science: [
    { topic: 'Binary', mistake: 'confusing binary addition overflow', examinerComment: 'In 8-bit binary, the maximum value is 255 (11111111). If addition produces a 9th bit, this is an overflow error. Candidates must identify when overflow occurs.', triggers: ['binary.*addition', 'overflow', 'binary.*carry'] },
    { topic: 'Programming', mistake: 'not using pseudocode conventions', examinerComment: 'Cambridge has specific pseudocode conventions. Variables should be meaningful. Indentation is essential. Candidates who wrote vague or unindented pseudocode lost marks.', triggers: ['pseudocode', 'algorithm', 'flowchart'] },
    { topic: 'Data', mistake: 'confusing validation and verification', examinerComment: 'Validation: checking data is reasonable/acceptable (range check, type check). Verification: checking data has been accurately copied (double entry, visual check). These are different processes.', triggers: ['validation', 'verification', 'data.*check'] },
    { topic: 'Networks', mistake: 'confusing LAN and WAN characteristics', examinerComment: 'LAN: covers small area, owned by one organisation, high speed. WAN: covers large area, uses third-party infrastructure, lower speed. The Internet is the largest WAN.', triggers: ['LAN', 'WAN', 'network.*type'] },
    { topic: 'Security', mistake: 'confusing encryption and hashing', examinerComment: 'Encryption is reversible (decrypt with key). Hashing is one-way (cannot be reversed). Passwords should be hashed, not encrypted. Candidates who confused these lost marks on security questions.', triggers: ['encryption', 'hashing', 'password.*secur'] },
  ],

  accounting: [
    { topic: 'Double Entry', mistake: 'debiting income and crediting expenses', examinerComment: 'Income is CREDITED. Expenses are DEBITED. Assets are debited when they increase. Many candidates reversed the entries and lost marks throughout their financial statements.', triggers: ['debit', 'credit', 'double entry', 'journal'] },
    { topic: 'Financial Statements', mistake: 'incorrect format for income statement', examinerComment: 'Cambridge requires specific formatting: Sales, less Cost of Sales = Gross Profit, less Expenses = Net Profit. Wrong format even with correct figures loses marks.', triggers: ['income statement', 'profit.*loss', 'trading account'] },
    { topic: 'Depreciation', mistake: 'confusing straight-line and reducing balance methods', examinerComment: 'Straight-line: same amount each year. Reducing balance: percentage of decreasing book value. Candidates must show the formula and working for whichever method is specified.', triggers: ['depreciation', 'straight.*line', 'reducing.*balance'] },
    { topic: 'Bank Reconciliation', mistake: 'adding unpresented cheques to the bank statement balance', examinerComment: 'Unpresented cheques must be SUBTRACTED from the bank statement balance (bank thinks you have more money than you do). This error was extremely common.', triggers: ['bank reconciliation', 'unpresented', 'outstanding cheque'] },
  ],

  history: [
    { topic: 'Source Analysis', mistake: 'describing the source content instead of evaluating it', examinerComment: 'Source questions ask HOW USEFUL or HOW RELIABLE a source is. Describing what the source says earns minimal marks. Candidates must evaluate provenance (who, when, why) and cross-reference with own knowledge.', triggers: ['source', 'useful', 'reliable', 'provenance'] },
    { topic: 'Causation', mistake: 'listing causes without explaining links between them', examinerComment: 'High-mark causation questions require candidates to explain HOW causes are connected and which was most important. A simple list of causes without analysis of links between them cannot access top marks.', triggers: ['cause', 'why did', 'reason for', 'led to'] },
    { topic: 'Essay Writing', mistake: 'narrative account instead of analytical argument', examinerComment: 'History essays must ANALYSE, not narrate. "First this happened, then that happened" is narrative. "This happened BECAUSE of... which was significant because..." is analysis.', triggers: ['essay', 'how far', 'to what extent', 'assess'] },
  ],

  pakistan_studies: [
    { topic: 'Pakistan Movement', mistake: 'not using specific dates and figures', examinerComment: 'Candidates must include specific dates, names, and events. Vague references to "the leaders" or "around that time" lose marks. Specificity is rewarded: "14 August 1947", "Lahore Resolution 1940".', triggers: ['pakistan movement', 'independence', 'partition', '1947'] },
    { topic: 'Geography', mistake: 'giving general answers about agriculture without regional specifics', examinerComment: 'Candidates must name specific regions, crops, and conditions. "Pakistan grows wheat" is too vague. "Punjab is the main wheat-growing region due to fertile alluvial soil and canal irrigation" earns marks.', triggers: ['agriculture', 'farming', 'crops', 'irrigation'] },
  ],

  islamiyat: [
    { topic: 'Quran Passages', mistake: 'translating without explaining significance', examinerComment: 'Candidates must go beyond translation to explain the IMPORTANCE and APPLICATION of Quranic teachings. Translation alone earns limited marks. Explain how the teaching applies to Muslim life today.', triggers: ['quran', 'surah', 'ayah', 'verse', 'passage'] },
    { topic: 'History of Islam', mistake: 'narrative without evaluation of significance', examinerComment: 'Higher mark questions require candidates to explain WHY events were significant, not just what happened. "The Treaty of Hudaybiyyah was important because..." not just "The treaty was signed in 628 CE."', triggers: ['prophet', 'caliph', 'treaty', 'battle', 'significance'] },
  ],
};

// Subject ID → report key mapping (handles variations)
const SUBJECT_MAP = {
  chemistry: 'chemistry',
  physics: 'physics',
  biology: 'biology',
  mathematics: 'mathematics',
  math: 'mathematics',
  maths: 'mathematics',
  economics: 'economics',
  english: 'english',
  business: 'business',
  business_studies: 'business',
  computer_science: 'computer_science',
  computing: 'computer_science',
  accounting: 'accounting',
  history: 'history',
  pakistan_studies: 'pakistan_studies',
  islamiyat: 'islamiyat',
  // A Level subjects use same reports
  chemistry_al: 'chemistry',
  physics_al: 'physics',
  biology_al: 'biology',
  mathematics_al: 'mathematics',
  economics_al: 'economics',
  business_al: 'business',
  cs_al: 'computer_science',
};

/**
 * Check a student's answer against common examiner-reported mistakes.
 * Returns an array of matching reports: { topic, mistake, examinerComment }
 */
function checkExaminerMistakes(studentAnswer, subject) {
  if (!studentAnswer || !subject) return [];

  const key = SUBJECT_MAP[subject.toLowerCase()] || subject.toLowerCase();
  const reports = EXAMINER_REPORTS[key];
  if (!reports) return [];

  const lower = studentAnswer.toLowerCase();
  const matches = [];

  for (const report of reports) {
    for (const trigger of report.triggers) {
      if (lower.includes(trigger.toLowerCase())) {
        matches.push({
          topic: report.topic,
          mistake: report.mistake,
          examinerComment: report.examinerComment,
        });
        break; // one match per report entry is enough
      }
    }
  }

  return matches;
}

/**
 * Returns a prompt injection string if examiner-reported mistakes are detected,
 * or empty string if none found.
 */
function getExaminerReportInjection(studentAnswer, subject) {
  const mistakes = checkExaminerMistakes(studentAnswer, subject);
  if (!mistakes.length) return '';

  const lines = mistakes.map(m =>
    `- Topic: ${m.topic}\n  Common mistake detected: "${m.mistake}"\n  Examiner report says: "${m.examinerComment}"`
  ).join('\n');

  return `\n\n[EXAMINER REPORT CHECK]\nThe student has made mistake(s) that Cambridge examiners specifically penalise:\n${lines}\nCorrect this explicitly before moving on. Quote what the examiner report says so the student understands this is a real mark-losing error.`;
}

module.exports = {
  EXAMINER_REPORTS,
  checkExaminerMistakes,
  getExaminerReportInjection,
};
