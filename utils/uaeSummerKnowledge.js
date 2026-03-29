/**
 * utils/uaeSummerKnowledge.js
 * UAE Summer Programme Knowledge Base
 *
 * Defines all UAE summer sessions by curriculum and track.
 * Auto-injects when userCountry === 'UAE' and summer phase is active (June-August).
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// BRITISH / IGCSE SUMMER SESSIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const BRITISH_SUMMER = {
  name: 'British / IGCSE Summer Sessions',
  sessions: [
    { title: 'IGCSE Subject Bridging: Grade 9 → 10', duration: 45, gradeRange: 'Grade 9', curriculum: 'British', covers: 'Preview of IGCSE Year 2 content. Focus on subjects where Grade 9 foundations are weakest. Subject-specific: Maths (functions, calculus intro), Sciences (paper 4 practical skills), English (directed writing and summary).' },
    { title: 'IGCSE to A Level Bridge: Sciences', duration: 45, gradeRange: 'Grade 10 → AS', curriculum: 'British', covers: 'Transition from IGCSE to AS Level. Key jumps: Physics (vectors, calculus-based mechanics), Chemistry (moles at depth, energetics, organic mechanisms), Biology (biochemistry, cell ultrastructure).' },
    { title: 'IGCSE to A Level Bridge: Humanities & Business', duration: 45, gradeRange: 'Grade 10 → AS', curriculum: 'British', covers: 'Transition to AS Level essay style. Economics: micro/macro distinction. Business: case study technique. History: source evaluation at A Level depth. Accounting: double-entry to full financial statements.' },
    { title: 'A Level Subject Introduction: Economics', duration: 30, gradeRange: 'AS Level', curriculum: 'British', covers: 'Micro and Macro foundations. Supply-demand diagrams, market failure, GDP, fiscal/monetary policy. Cambridge 9708 syllabus overview.' },
    { title: 'A Level Subject Introduction: Mathematics', duration: 45, gradeRange: 'AS Level', curriculum: 'British', covers: 'Pure Maths 1 preview: quadratics, coordinate geometry, differentiation, integration. Statistics 1: probability, discrete random variables.' },
    { title: 'A Level Subject Introduction: Sciences', duration: 45, gradeRange: 'AS Level', curriculum: 'British', covers: 'Physics: kinematics, forces, energy. Chemistry: atomic structure, bonding, stoichiometry. Biology: cell biology, enzymes, biological molecules.' },
    { title: 'Past Paper Intensive', duration: 45, gradeRange: 'Grade 10-12', curriculum: 'British', covers: 'Subject-specific past paper practice under timed conditions. Starky marks using Cambridge mark schemes, identifies pattern of lost marks, creates personalised revision plan.' },
    { title: 'Mark Scheme Mastery', duration: 30, gradeRange: 'Grade 10-12', curriculum: 'British', covers: 'Learn how Cambridge examiners mark. Understand command words (describe ≠ explain ≠ evaluate). Practice writing examiner-friendly answers. Review examiner reports for common errors.' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// IB DIPLOMA SUMMER SESSIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const IB_SUMMER = {
  name: 'IB Diploma Summer Sessions',
  sessions: [
    { title: 'IB Diploma Introduction', duration: 45, gradeRange: 'Grade 10 → DP1', curriculum: 'IB', covers: 'What is the IB Diploma? 6 subject groups + TOK + EE + CAS. How the 45-point system works. Choosing HL vs SL. What universities expect. Planning your 2-year journey.' },
    { title: 'Theory of Knowledge (TOK) Introduction', duration: 30, gradeRange: 'DP1', curriculum: 'IB', covers: 'What is TOK? Areas of Knowledge vs Ways of Knowing. How to identify knowledge questions. TOK Exhibition structure (3 objects). TOK Essay structure and prescribed titles. Real-world examples that work.' },
    { title: 'Extended Essay: Topic Selection & Planning', duration: 45, gradeRange: 'DP1-DP2', curriculum: 'IB', covers: 'Choosing a research question. What makes a good EE topic? Subject-specific advice (Sciences: experimental vs literature-based. History: primary sources. English: close textual analysis). The RPPF and supervisor process. Planning 4000 words across 6 months.' },
    { title: 'IA Preparation: Group 1-3', duration: 30, gradeRange: 'DP1-DP2', curriculum: 'IB', covers: 'Group 1 IO: choosing a global issue and two works. Group 2 IO: visual stimulus selection and theme connection. Group 3: Economics commentary (finding news articles), History investigation (source evaluation), Business research project.' },
    { title: 'IA Preparation: Group 4-6', duration: 30, gradeRange: 'DP1-DP2', curriculum: 'IB', covers: 'Group 4 Science IA: designing a focused experiment, data collection with uncertainties, evaluation criteria. Group 5 Maths Exploration: choosing a personal topic, balancing personal engagement with mathematical rigour. Group 6: portfolio development, process documentation.' },
    { title: 'IB Subject Bridging: Sciences', duration: 45, gradeRange: 'Grade 10 → DP1', curriculum: 'IB', covers: 'Bridge from MYP/IGCSE to DP Science. Key differences: IB Sciences are conceptual, not just computational. Data-based questions. Internal Assessment expectations. SL vs HL content differences.' },
    { title: 'IB Subject Bridging: Maths', duration: 45, gradeRange: 'Grade 10 → DP1', curriculum: 'IB', covers: 'AA vs AI: which is right for you? AA: pure maths, proofs, calculus-heavy. AI: statistics, modelling, applications. GDC calculator skills for both. Paper structure differences.' },
    { title: 'IB Subject Bridging: Humanities', duration: 30, gradeRange: 'Grade 10 → DP1', curriculum: 'IB', covers: 'History: historiography and source analysis at DP level. Economics: diagrams and real-world application. Psychology: research methods and ethical considerations. Geography: case study approach.' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// AMERICAN AP SUMMER SESSIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const AP_SUMMER = {
  name: 'American AP Summer Sessions',
  sessions: [
    { title: 'AP Subject Introduction', duration: 30, gradeRange: 'Grade 10-11', curriculum: 'American', covers: 'Overview of chosen AP course. Exam format (MCQ + FRQ). AP scoring 1-5 and what each score means for college credit. Study strategies and recommended resources. Course content preview.' },
    { title: 'SAT Reading & Writing Preparation', duration: 45, gradeRange: 'Grade 10-11', curriculum: 'American', covers: 'Digital SAT format. Evidence-based reading strategies: skim, scan, eliminate. Grammar rules: subject-verb agreement, comma splices, transitions. Practice with adaptive difficulty. Time management for 2 modules.' },
    { title: 'SAT Math Preparation', duration: 45, gradeRange: 'Grade 10-11', curriculum: 'American', covers: 'SAT Math content: algebra, advanced maths, problem solving, geometry/trig. Desmos calculator mastery. Student-produced response strategies. Common traps and how to avoid them. Practice with released College Board questions.' },
    { title: 'ACT Preparation', duration: 45, gradeRange: 'Grade 10-11', curriculum: 'American', covers: 'ACT vs SAT: which is better for you? ACT English (grammar), Math (calculator-allowed), Reading (4 passages), Science (data analysis). Time management — ACT is faster-paced than SAT. Practice with released ACT forms.' },
    { title: 'College Application Essay Preparation', duration: 30, gradeRange: 'Grade 11-12', curriculum: 'American', covers: 'Common App essay prompts. Personal statement structure: hook, development, insight. What admissions officers look for. Brainstorming unique topics. Writing voice vs academic writing. UAE-specific: applying from Dubai, international student context.' },
    { title: 'AP Past Paper Practice', duration: 45, gradeRange: 'Grade 11-12', curriculum: 'American', covers: 'Subject-specific AP FRQ practice under timed conditions. Starky scores using College Board rubrics. Focus on earning maximum partial credit. Review of common errors per subject.' },
    { title: 'AP Calculus Summer Preview', duration: 45, gradeRange: 'Grade 10 → 11', curriculum: 'American', covers: 'Pre-Calculus review (functions, trigonometry, limits). Introduction to AB and BC content. Derivative concept and rules. What to expect in the AP Calculus exam.' },
    { title: 'AP Science Summer Preview', duration: 45, gradeRange: 'Grade 10 → 11', curriculum: 'American', covers: 'Lab skills for AP Sciences. Experimental design fundamentals. Data analysis and graphing. Scientific writing style. Preview of AP Physics 1, AP Chemistry, AP Biology content.' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// CBSE SUMMER SESSIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const CBSE_SUMMER = {
  name: 'CBSE Summer Sessions',
  sessions: [
    { title: 'NCERT Chapter Completion (Catch-Up)', duration: 45, gradeRange: 'Class 9-12', curriculum: 'CBSE', covers: 'Complete unfinished NCERT chapters from the previous year. Starky identifies which chapters were skipped or poorly understood. Back-exercise practice. Exemplar problems for HOTS preparation. Focus on chapters with highest board exam weightage.' },
    { title: 'Class 10 Board Exam Preparation', duration: 45, gradeRange: 'Class 9 → 10', curriculum: 'CBSE', covers: 'Early board exam prep. Subject-wise: Maths (trigonometry, statistics, coordinate geometry), Science (chemical reactions, electricity, life processes), SST (nationalism, globalisation, development), English (writing formats, grammar, literature). NCERT mastery + PYQ practice.' },
    { title: 'Class 12 Board Exam Preparation', duration: 45, gradeRange: 'Class 11 → 12', curriculum: 'CBSE', covers: 'Head start on Class 12 boards. Science: complete Class 11 revision (board exams test Class 11 content too). Commerce: Accountancy Class 12 preview. Practice CBSE sample papers and PYQs. Time management for 3-hour papers.' },
    { title: 'JEE Foundation: Physics', duration: 45, gradeRange: 'Class 11-12', curriculum: 'CBSE', covers: 'JEE Physics: mechanics fundamentals (kinematics, Newton\'s laws, energy, rotational motion). HC Verma problem-solving approach. NCERT + reference book integration. Previous JEE Main/Advanced question practice.' },
    { title: 'JEE Foundation: Chemistry', duration: 45, gradeRange: 'Class 11-12', curriculum: 'CBSE', covers: 'JEE Chemistry: Organic (GOC, reaction mechanisms, named reactions), Physical (mole concept, thermodynamics, equilibrium), Inorganic (periodic table, coordination compounds). MS Chouhan and VK Jaiswal problem types.' },
    { title: 'JEE Foundation: Mathematics', duration: 45, gradeRange: 'Class 11-12', curriculum: 'CBSE', covers: 'JEE Maths: Algebra (quadratics, progressions, P&C, binomial theorem), Calculus (limits, differentiation, integration), Coordinate Geometry (straight lines, circles, conics). Cengage/Arihant problem patterns.' },
    { title: 'NEET Foundation: Biology', duration: 45, gradeRange: 'Class 11-12', curriculum: 'CBSE', covers: 'NEET Biology: NCERT line-by-line for Botany and Zoology. High-yield chapters: Human Physiology, Genetics, Ecology, Molecular Biology. Figure captions and table data — NEET tests these. Previous NEET question practice.' },
    { title: 'NEET Foundation: Chemistry', duration: 45, gradeRange: 'Class 11-12', curriculum: 'CBSE', covers: 'NEET Chemistry: Organic (functional groups, named reactions, biomolecules), Physical (Chemical Kinetics, Electrochemistry, Solutions), Inorganic (d-block, p-block, coordination compounds). NCERT-based questions only.' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// UAE MoE SUMMER SESSIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const MOE_SUMMER = {
  name: 'UAE MoE Summer Sessions',
  sessions: [
    { title: 'EmSAT English Preparation', duration: 45, gradeRange: 'Grade 10-12', curriculum: 'UAE MoE', covers: 'EmSAT English: Grammar & Vocabulary (25%), Reading (40%), Writing (35%). Practice with passages at EmSAT difficulty level. Essay structure for Writing section. Target: 1100+ for university admission, 1400+ for competitive programmes.' },
    { title: 'EmSAT Mathematics Preparation', duration: 45, gradeRange: 'Grade 10-12', curriculum: 'UAE MoE', covers: 'EmSAT Maths: Algebra (35%), Geometry (20%), Statistics (20%), Calculus (25% for Advanced Track). NO calculator allowed. Mental maths speed drills. Practice algebraic manipulation, factoring, equation solving without aids.' },
    { title: 'EmSAT Arabic Preparation', duration: 45, gradeRange: 'Grade 10-12', curriculum: 'UAE MoE', covers: 'EmSAT Arabic: Reading Comprehension (40%), Grammar/النحو والصرف (30%), Writing (30%). MSA (فصحى) not dialect. إعراب practice. Formal essay structure in Arabic. Reading newspaper-style passages.' },
    { title: 'EmSAT Physics Preparation', duration: 45, gradeRange: 'Grade 11-12', curriculum: 'UAE MoE', covers: 'EmSAT Physics: Mechanics, Waves & Optics, Electricity & Magnetism, Modern Physics. Conceptual understanding + numerical problem solving. Free body diagrams, circuit analysis, unit analysis.' },
    { title: 'EmSAT Chemistry Preparation', duration: 45, gradeRange: 'Grade 11-12', curriculum: 'UAE MoE', covers: 'EmSAT Chemistry: Atomic Structure & Bonding, Stoichiometry, Organic Chemistry, Thermochemistry. Mole calculations, periodic table trends, functional groups, balancing equations.' },
    { title: 'EmSAT Biology Preparation', duration: 45, gradeRange: 'Grade 11-12', curriculum: 'UAE MoE', covers: 'EmSAT Biology: Cell Biology, Genetics & Evolution, Human Biology, Ecology. Mitosis vs meiosis, Punnett squares, organ systems, food webs, energy pyramids.' },
    { title: 'EmSAT Computer Science Preparation', duration: 45, gradeRange: 'Grade 11-12', curriculum: 'UAE MoE', covers: 'EmSAT CS: Python programming, data structures (arrays, lists, dictionaries), algorithms (sorting, searching), networks (TCP/IP, DNS), cybersecurity basics.' },
    { title: 'Arabic Language Strengthening', duration: 30, gradeRange: 'All grades', curriculum: 'UAE MoE', covers: 'For students who need Arabic support over summer. Reading comprehension practice, grammar drills, writing exercises. Both Arabic First Language and Arabic Second Language tracks.' },
    { title: 'Islamic Education Revision', duration: 30, gradeRange: 'All grades', curriculum: 'UAE MoE', covers: 'Summer revision of Islamic Education. Quran recitation practice, Hadith review, Fiqh concepts, Seerah events. Age-appropriate content for each cycle.' },
    { title: 'MSC Reflection Sessions', duration: 30, gradeRange: 'All grades', curriculum: 'UAE MoE', covers: 'Moral, Social & Cultural Studies summer reflections. Community service project planning for next year. UAE values exploration. Digital citizenship in summer (social media, gaming, screen time balance).' },
    { title: 'Grade Bridge: Cycle 2 → Cycle 3', duration: 45, gradeRange: 'Grade 8 → 9', curriculum: 'UAE MoE', covers: 'Critical transition from middle school to high school. Choosing General vs Advanced vs Elite track. Preview of track-specific content. EmSAT awareness — what scores are needed and when.' },
    { title: 'Grade Bridge: General → Advanced Track', duration: 45, gradeRange: 'Grade 9-10', curriculum: 'UAE MoE', covers: 'For students switching from General to Advanced track. Gap analysis: what Advanced Track expects that General didn\'t cover. Maths and Science bridge content. EmSAT score targets for Advanced students.' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// CROSS-CURRICULUM SESSIONS (all UAE students)
// ═══════════════════════════════════════════════════════════════════════════════

export const CROSS_CURRICULUM_SUMMER = {
  name: 'Cross-Curriculum Summer Sessions (All Students)',
  sessions: [
    { title: 'English Language Strengthening', duration: 30, gradeRange: 'All grades', curriculum: 'All', covers: 'Grammar, vocabulary, reading comprehension, and writing skills. For students across all curricula who need to improve English proficiency. IELTS-style reading and writing practice for older students.' },
    { title: 'Arabic as Second Language', duration: 30, gradeRange: 'All grades', curriculum: 'All', covers: 'ASL summer practice for non-Arabic speaking students. Alphabet review, basic conversation, reading practice, writing. CEFR-aligned progression from A1 to B1. UAE-specific vocabulary and contexts.' },
    { title: 'Mathematics Foundations', duration: 45, gradeRange: 'All grades', curriculum: 'All', covers: 'Core maths skills regardless of curriculum. Number sense, fractions, decimals, percentages, basic algebra, geometry. Filling gaps that persist across all curricula. Calculator-free mental maths drills.' },
    { title: 'Study Skills & Exam Technique', duration: 30, gradeRange: 'Grade 7-12', curriculum: 'All', covers: 'Universal study skills: active recall, spaced repetition, practice testing. Exam technique: reading questions carefully, time allocation, answering the question asked. Note-taking methods (Cornell, mind maps). Revision planning.' },
    { title: 'University Preparation Workshop', duration: 45, gradeRange: 'Grade 11-12', curriculum: 'All', covers: 'UAE university admissions overview. UAEU, Khalifa, Zayed, AUS, NYUAD, Sorbonne Abu Dhabi requirements. Application timelines. Personal statement writing. Portfolio preparation for arts students. Scholarship opportunities in the UAE.' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// UAE SUMMER TRACKS — Full definitions
// ═══════════════════════════════════════════════════════════════════════════════

export const UAE_SUMMER_TRACKS = [
  { id: 'bridge', name: 'Bridge to Next Year', audience: 'Every student moving up a grade in September', duration: '54 days, 30 min/day', philosophy: 'Get ahead before classmates open their books.' },
  { id: 'emsat', name: 'EmSAT Intensive', audience: 'Grade 11-12 UAE MoE students', duration: '25 sessions per subject', philosophy: 'Every EmSAT point matters for university admission.' },
  { id: 'catchup', name: 'Catch Up & Close Gaps', audience: 'Students who struggled this year', duration: 'Self-paced', philosophy: 'No pressure. Patient. Confidence first.' },
  { id: 'sen', name: 'Students of Determination', audience: 'Inclusive summer — KHDA aligned', duration: 'Self-paced, no time pressure', philosophy: 'Same learning. Your way. Gentle Start Protocol every session.' },
  { id: 'university', name: 'University Ready', audience: 'Grade 12 graduates / university applicants', duration: '30 sessions', philosophy: 'Last chance to improve scores and prepare for first year.' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// EmSAT INTENSIVE SESSION PLANS (25 sessions per subject)
// ═══════════════════════════════════════════════════════════════════════════════

export const EMSAT_INTENSIVE = {
  universityTargets: {
    uaeu: { english: 1250, maths: 900, note: 'Science varies by programme' },
    aus: { english: 1500, maths: 1100 },
    khalifa: { english: 1400, maths: 1100, physics: 900 },
    zayed: { english: 1100, maths: 900 },
    hct: { english: 1100 },
  },
  english: {
    sessions1to5: 'Reading comprehension strategies — skimming, scanning, inference, main idea, vocabulary in context',
    sessions6to10: 'Vocabulary and grammar — articles, verb tenses, conditionals, prepositions, subject-verb agreement',
    sessions11to15: 'Writing structure — IELTS-style essay format, thesis statements, paragraph structure, transitions',
    sessions16to20: 'Past paper practice — timed conditions, score tracking, weakness identification',
    sessions21to25: 'Score improvement targeting — focus on weakest areas, rapid-fire grammar drills, final writing polish',
  },
  maths: {
    sessions1to5: 'Algebra and functions — factoring, quadratics, systems, function notation',
    sessions6to10: 'Geometry and trigonometry — angle relationships, circle theorems, trig ratios, identities',
    sessions11to15: 'Statistics and probability — mean/median/mode, standard deviation, probability rules, distributions',
    sessions16to20: 'Calculus basics (Advanced Track) — limits, derivatives (power/chain rule), basic integrals',
    sessions21to25: 'Past paper intensive — timed practice, mental maths speed drills, error pattern analysis',
  },
  physics: {
    sessions1to5: 'Mechanics — kinematics, Newton\'s laws, energy, momentum',
    sessions6to10: 'Electricity and magnetism — circuits, Ohm\'s law, Kirchhoff\'s laws, electromagnetic induction',
    sessions11to15: 'Waves and optics — wave properties, reflection, refraction, lenses, diffraction',
    sessions16to20: 'Modern physics — atomic structure, photoelectric effect, nuclear reactions, radioactivity',
    sessions21to25: 'Past paper intensive — concept application, unit analysis, free body diagrams',
  },
  chemistry: {
    sessions1to5: 'Atomic structure and bonding — electron configuration, ionic/covalent/metallic, intermolecular forces',
    sessions6to10: 'Organic chemistry — functional groups, IUPAC naming, reactions, isomerism',
    sessions11to15: 'Reactions and equilibrium — rates, Le Chatelier, acid-base, redox, electrochemistry',
    sessions16to20: 'Stoichiometry and analytical — mole calculations, titrations, gas laws',
    sessions21to25: 'Past paper intensive — calculation practice, concept integration, pattern recognition',
  },
  biology: {
    sessions1to5: 'Cell biology — cell structure, membrane transport, enzymes, cell division',
    sessions6to10: 'Genetics — DNA, transcription/translation, Mendelian genetics, Punnett squares, mutations',
    sessions11to15: 'Human physiology — circulatory, respiratory, nervous, endocrine, digestive systems',
    sessions16to20: 'Ecology — ecosystems, food webs, energy flow, biogeochemical cycles, biodiversity',
    sessions21to25: 'Past paper intensive — diagram interpretation, experimental design, data analysis',
  },
  arabic: {
    sessions1to5: 'Grammar and syntax — إعراب, verb conjugation, noun patterns, sentence structure',
    sessions6to10: 'Comprehension — newspaper articles, literary passages, informational texts',
    sessions11to15: 'Writing — formal essay structure, مقدمة/عرض/خاتمة, persuasive and analytical writing',
    sessions16to25: 'Past paper practice — timed reading, grammar speed drills, writing under exam conditions',
  },
  computerScience: {
    sessions1to5: 'Programming fundamentals — Python syntax, variables, loops, functions, error handling',
    sessions6to10: 'Data structures — arrays, lists, dictionaries, stacks, queues, trees',
    sessions11to15: 'Networks and systems — TCP/IP, HTTP, DNS, client-server, cybersecurity, encryption',
    sessions16to25: 'Past paper practice — code tracing, debugging, algorithm design, output prediction',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// UAE SUMMER PASSPORT BADGES
// ═══════════════════════════════════════════════════════════════════════════════

export const UAE_SUMMER_BADGES = [
  { id: 'early-riser', emoji: '🌅', name: 'Early Riser', threshold: 1, condition: 'First session before 9am' },
  { id: 'dubai-scholar', emoji: '🏙️', name: 'Dubai Scholar', threshold: 5, condition: '5 sessions completed' },
  { id: 'khda-champion', emoji: '🌟', name: 'KHDA Champion', threshold: 15, condition: '15 sessions — aligned with KHDA goals' },
  { id: 'uni-ready', emoji: '🎓', name: 'University Ready', threshold: 25, condition: '25 sessions — prepared for admissions' },
  { id: 'summer-champion', emoji: '🏆', name: 'Dubai Summer Champion', threshold: 40, condition: '40 sessions — true dedication' },
  { id: 'community-spirit', emoji: '🤝', name: 'Community Spirit', threshold: 0, condition: 'Completed Students of Determination track' },
  { id: 'global-learner', emoji: '🌍', name: 'Global Learner', threshold: 0, condition: 'Studied in 2+ languages' },
];

/**
 * Check if UAE summer is currently active (July 3 - August 26, 2026)
 */
export function isUAESummerActive() {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 6, 3); // July 3
  const end = new Date(year, 7, 26); // August 26
  return now >= start && now <= end;
}

/**
 * Check if a message is about UAE summer topics
 */
export function isUAESummerTopic(message) {
  if (!message) return false;
  const lower = message.toLowerCase();
  const triggers = [
    'summer programme', 'summer program', 'summer learning', 'summer school uae',
    'dubai summer', 'uae summer', 'summer session',
    'emsat prep summer', 'summer bridge', 'catch up summer',
    'summer passport', 'summer badge',
  ];
  return triggers.some(t => lower.includes(t));
}

/**
 * Get UAE summer prompt injection.
 * Injected when userCountry === 'UAE' and summer is active.
 */
export function getUAESummerPrompt(curriculum) {
  if (!isUAESummerActive()) return '';

  let prompt = `\nUAE SUMMER PROGRAMME — Summer is active (July 3 → August 26). 54 days. This student is in Dubai where temperatures exceed 45°C. Students stay indoors — prime learning time.\n`;
  prompt += `\nSTARKY UAE SUMMER IDENTITY: Dubai summer means 54 days indoors. Every other summer programme in Dubai costs AED 5,000 or more. Starky offers 10 free sessions to start — no credit card, no commitment. And Starky knows every curriculum your child follows.`;
  prompt += `\n5 Summer Tracks: Bridge to Next Year, EmSAT Intensive, Catch Up, Students of Determination, University Ready.`;
  prompt += `\nUAE Summer Passport: badges at 5/15/25/40 sessions (Dubai Scholar → KHDA Champion → University Ready → Dubai Summer Champion).`;

  // Curriculum-specific summer sessions
  const sessionMap = {
    british: BRITISH_SUMMER,
    american: AP_SUMMER,
    ib: IB_SUMMER,
    cbse: CBSE_SUMMER,
    moe: MOE_SUMMER,
    pakistani: BRITISH_SUMMER,
  };

  const curriculumSessions = sessionMap[curriculum];
  if (curriculumSessions) {
    prompt += `\n\n${curriculumSessions.name}:`;
    curriculumSessions.sessions.slice(0, 5).forEach(s => {
      prompt += `\n- ${s.title} (${s.duration}min, ${s.gradeRange}): ${s.covers.split('.')[0]}.`;
    });
  }

  // EmSAT intensive for MoE students
  if (curriculum === 'moe') {
    prompt += `\n\nEmSAT INTENSIVE: University score targets — UAEU English 1250/Maths 900, Khalifa English 1400/Maths 1100/Physics 900, AUS English 1500/Maths 1100.`;
    prompt += `\nEmSAT English: ${EMSAT_INTENSIVE.english.sessions1to5}. ${EMSAT_INTENSIVE.english.sessions11to15}.`;
    prompt += `\nEmSAT Maths: ${EMSAT_INTENSIVE.maths.sessions1to5}. No calculator — mental maths drills essential.`;
  }

  // Cross-curriculum sessions always available
  prompt += `\n\nCross-Curriculum (all students):`;
  CROSS_CURRICULUM_SUMMER.sessions.slice(0, 3).forEach(s => {
    prompt += `\n- ${s.title}: ${s.covers.split('.')[0]}.`;
  });

  // UAE-specific examples to use
  prompt += `\n\nUAE SUMMER EXAMPLES: Maths — Burj Khalifa height calculations, AED currency. Science — Dubai desert ecosystem, UAE oil chemistry, desalination. History — UAE formation 1971, Sheikh Zayed. English — Dubai newspaper articles, UAE culture.`;

  prompt += `\n\nSUMMER TEACHING RULES: Lighter tone — it's summer! Celebrate every session. Remind about Summer Passport badges. Connect learning to September readiness. Use Dubai examples. For Students of Determination: Gentle Start Protocol, no time pressure, celebrate every interaction. Opening: "Good morning. Summer in Dubai means we have time to learn at your pace. No rush. No pressure. What shall we explore today?"`;

  return prompt;
}
