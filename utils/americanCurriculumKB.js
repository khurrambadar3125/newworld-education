/**
 * utils/americanCurriculumKB.js
 * American Curriculum Knowledge Base
 *
 * For UAE students selecting American curriculum.
 * Covers AP subjects, SAT/ACT, Common Core standards, GPA system.
 * Auto-injects when uaeCurriculum === 'american'.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

export const AMERICAN_SUBJECTS = {
  apMaths: {
    name: 'AP Mathematics',
    subjects: [
      { code: 'calc-ab', name: 'AP Calculus AB', score: '1-5' },
      { code: 'calc-bc', name: 'AP Calculus BC', score: '1-5' },
      { code: 'stats', name: 'AP Statistics', score: '1-5' },
      { code: 'precalc', name: 'AP Precalculus', score: '1-5' },
    ],
    examinerTips: `AP Calculus AB covers limits, derivatives, integrals, and the Fundamental Theorem of Calculus. BC includes everything in AB plus sequences, series, parametric/polar/vector functions, and advanced integration techniques. The exam has two sections: Multiple Choice (45 questions, 1h45m — calculator allowed on part) and Free Response (6 questions, 1h30m — calculator allowed on 2). Free Response scoring: students earn points for each correct step — show ALL working. Common mistakes: forgetting +C on indefinite integrals, not justifying conclusions (e.g. "by the Intermediate Value Theorem, since f is continuous on [a,b] and..."), sign errors on chain rule. AP Statistics: emphasis on experimental design, probability, inference. Students must interpret results in CONTEXT — generic statistical statements lose marks. Use UAE data examples: Dubai population growth, UAE temperature data, economic diversification statistics.`,
    iaGuidance: `No IA in AP — purely exam-based. But College Board recommends practice with released FRQs (Free Response Questions). Students should time themselves: ~15 minutes per FRQ. Mark scheme gives partial credit — always attempt every part.`,
  },

  apSciences: {
    name: 'AP Sciences',
    subjects: [
      { code: 'phys-1', name: 'AP Physics 1', score: '1-5' },
      { code: 'phys-2', name: 'AP Physics 2', score: '1-5' },
      { code: 'phys-cm', name: 'AP Physics C: Mechanics', score: '1-5' },
      { code: 'phys-em', name: 'AP Physics C: E&M', score: '1-5' },
      { code: 'chem', name: 'AP Chemistry', score: '1-5' },
      { code: 'bio', name: 'AP Biology', score: '1-5' },
      { code: 'enviro', name: 'AP Environmental Science', score: '1-5' },
    ],
    examinerTips: `AP Physics 1 is algebra-based — covers Newtonian mechanics, rotational motion, simple harmonic motion, waves, circuits. Physics C is calculus-based and split into Mechanics and E&M. AP Chemistry: 9 units covering atomic structure, bonding, intermolecular forces, kinetics, equilibrium, acids/bases, thermodynamics, electrochemistry. The exam emphasises lab skills — students must describe experimental procedures, identify variables, analyse data. AP Biology: 8 units — evolution, cellular processes, genetics, ecology. Long FRQs require students to design experiments and justify with biological reasoning. Common UAE context: desert ecology, water desalination chemistry, solar energy physics, marine biology of the Gulf.`,
    iaGuidance: `AP Science exams include lab-based FRQs. Students should practice designing controlled experiments: identify independent/dependent/controlled variables, describe data collection methods, explain expected results. College Board provides released FRQs with scoring rubrics — use these for practice.`,
  },

  apEnglish: {
    name: 'AP English',
    subjects: [
      { code: 'eng-lang', name: 'AP English Language & Composition', score: '1-5' },
      { code: 'eng-lit', name: 'AP English Literature & Composition', score: '1-5' },
    ],
    examinerTips: `AP English Language focuses on rhetorical analysis — how writers use language to persuade, inform, or entertain. Students analyse non-fiction texts: speeches, essays, letters, articles. Three FRQs: Synthesis (use sources to build argument), Rhetorical Analysis (analyse how an author builds their case), Argument (defend/challenge/qualify a claim). AP English Literature focuses on literary analysis — poetry, prose, drama. Three FRQs: Poetry Analysis, Prose Fiction Analysis, Literary Argument (use works studied to support a thesis). Both exams: the thesis statement must be defensible and specific. Body paragraphs need textual evidence with commentary — never just quote without analysis. Use the "So what?" test: after every point, explain WHY it matters. Common mistake: summarising instead of analysing.`,
    iaGuidance: `No IA — exam only. Multiple Choice (45% of score) tests close reading. Free Response (55%) requires timed essays — practice writing complete analytical essays in 40 minutes. College Board rubric: Thesis (0-1), Evidence/Commentary (0-4), Sophistication (0-1) = 6 points per essay.`,
  },

  apSocialSciences: {
    name: 'AP Social Sciences',
    subjects: [
      { code: 'us-hist', name: 'AP US History', score: '1-5' },
      { code: 'world-hist', name: 'AP World History: Modern', score: '1-5' },
      { code: 'euro-hist', name: 'AP European History', score: '1-5' },
      { code: 'gov', name: 'AP US Government & Politics', score: '1-5' },
      { code: 'comp-gov', name: 'AP Comparative Government', score: '1-5' },
      { code: 'econ-micro', name: 'AP Microeconomics', score: '1-5' },
      { code: 'econ-macro', name: 'AP Macroeconomics', score: '1-5' },
      { code: 'psych', name: 'AP Psychology', score: '1-5' },
      { code: 'human-geo', name: 'AP Human Geography', score: '1-5' },
    ],
    examinerTips: `AP History exams all follow the same structure: Multiple Choice + Short Answer + Document-Based Question (DBQ) + Long Essay. The DBQ is critical — students must analyse 7 documents, use at least 6, provide historical context, and make a complex argument. HIPP analysis for each document: Historical context, Intended audience, Purpose, Point of view. AP Economics: graphs are ESSENTIAL — supply/demand, cost curves, AS/AD, Phillips Curve, money market. Always label axes and curves. Micro focuses on firm behaviour and market structures. Macro covers GDP, inflation, unemployment, fiscal/monetary policy. AP Psychology: 9 units covering biological bases, sensation, learning, cognition, development, personality, abnormal psych, social psych. UAE context for Human Geography: Dubai's rapid urbanisation, UAE migration patterns, cultural landscape of the Gulf.`,
    iaGuidance: `History DBQ scoring: Thesis (1), Contextualisation (1), Evidence from documents (3), Evidence beyond documents (1), Complex understanding (1) = 7 points. Students must practise under timed conditions — 60 minutes for the full DBQ including 15 minutes reading time.`,
  },

  apComputerScience: {
    name: 'AP Computer Science',
    subjects: [
      { code: 'csa', name: 'AP Computer Science A', score: '1-5' },
      { code: 'csp', name: 'AP Computer Science Principles', score: '1-5' },
    ],
    examinerTips: `AP Computer Science A is Java-based. Topics: variables, control structures, arrays, ArrayLists, 2D arrays, inheritance, recursion. The exam has 40 MCQs and 4 FRQs. FRQ types: Methods and Control Structures, Class Design, Array/ArrayList, 2D Array. Students must write syntactically correct Java — missing semicolons and brackets cost marks. AP CSP is broader: internet, data, algorithms, programming (any language), and the impact of computing. Includes a Create Performance Task (program + written response, submitted before exam). UAE context: UAE's AI strategy, smart city initiatives, Dubai's blockchain strategy, Abu Dhabi's technology sector.`,
    iaGuidance: `AP CSA: no project — purely exam-based. AP CSP: Create Performance Task submitted to College Board — students build a program that includes an algorithm with sequencing, selection, and iteration, plus a list/collection. Must write a Personalised Project Reference used during the exam.`,
  },

  apArts: {
    name: 'AP Arts & Languages',
    subjects: [
      { code: 'art-draw', name: 'AP Art & Design: Drawing', score: '1-5' },
      { code: 'art-2d', name: 'AP Art & Design: 2-D', score: '1-5' },
      { code: 'art-3d', name: 'AP Art & Design: 3-D', score: '1-5' },
      { code: 'music-theory', name: 'AP Music Theory', score: '1-5' },
      { code: 'art-hist', name: 'AP Art History', score: '1-5' },
      { code: 'spanish', name: 'AP Spanish Language', score: '1-5' },
      { code: 'french', name: 'AP French Language', score: '1-5' },
      { code: 'arabic', name: 'AP Arabic Language & Culture', score: '1-5' },
    ],
    examinerTips: `AP Art & Design is portfolio-based — no sit-down exam. Students submit: Sustained Investigation (15 digital images showing inquiry-based art process) + Selected Works (5 physical works showing skill). AP Music Theory: aural skills (melodic/harmonic dictation, sight-singing) + written skills (part-writing, analysis). AP Art History: 250 required images across 10 content areas. AP Arabic Language & Culture is particularly relevant for UAE students — covers interpersonal, interpretive, and presentational communication in MSA. UAE context: Islamic geometric patterns for Art & Design, traditional Gulf architecture, Emirati music traditions.`,
    iaGuidance: `AP Art & Design: portfolio submitted digitally by May deadline. Sustained Investigation must show artistic growth and experimentation — not 15 finished pieces but a process of development. Include artist statements explaining choices and connections.`,
  },
};

/**
 * SAT exam structure
 */
export const SAT_STRUCTURE = {
  name: 'SAT (Digital)',
  totalScore: '400-1600',
  sections: {
    readingWriting: {
      name: 'Reading and Writing',
      score: '200-800',
      time: '64 minutes (2 modules, 32 min each)',
      questions: '54 questions total',
      content: [
        'Craft and Structure — words in context, text structure, cross-text connections',
        'Information and Ideas — central ideas, command of evidence, inferences',
        'Standard English Conventions — grammar, punctuation, sentence structure',
        'Expression of Ideas — rhetorical synthesis, transitions',
      ],
      tips: 'Digital SAT is adaptive — Module 2 difficulty adjusts based on Module 1 performance. Read the passage carefully — every answer is supported by the text. For grammar questions: shorter is usually better. Eliminate obviously wrong answers first.',
    },
    maths: {
      name: 'Math',
      score: '200-800',
      time: '70 minutes (2 modules, 35 min each)',
      questions: '44 questions total',
      calculator: 'Built-in Desmos calculator available for ALL questions',
      content: [
        'Algebra — linear equations, systems, inequalities, functions',
        'Advanced Math — quadratics, polynomials, exponential, rational functions',
        'Problem Solving & Data Analysis — ratios, percentages, probability, statistics',
        'Geometry & Trigonometry — area, volume, circles, triangles, trig ratios',
      ],
      tips: 'Desmos calculator is available for every maths question — learn to use it efficiently. For student-produced responses: check if the answer makes sense in context. Common trap: the question asks for 2x, not x. Read the LAST line of every question carefully.',
    },
  },
  uaeContext: 'SAT is accepted by all American curriculum universities in UAE (AUD, UOWD) and internationally. Many UAE students take SAT for US university applications. Digital SAT launched 2024 — shorter than old SAT (2h14m vs 3h). Score optional at many US universities post-COVID but still recommended for scholarships.',
};

/**
 * ACT exam overview
 */
export const ACT_STRUCTURE = {
  name: 'ACT',
  totalScore: '1-36 (composite average)',
  sections: [
    { name: 'English', questions: 75, time: '45 min', score: '1-36', content: 'Grammar, punctuation, sentence structure, rhetorical skills' },
    { name: 'Math', questions: 60, time: '60 min', score: '1-36', content: 'Pre-algebra, algebra, geometry, trigonometry — calculator allowed' },
    { name: 'Reading', questions: 40, time: '35 min', score: '1-36', content: '4 passages: literary narrative, social science, humanities, natural science' },
    { name: 'Science', questions: 40, time: '35 min', score: '1-36', content: 'Data interpretation, research summaries, conflicting viewpoints — no science knowledge needed' },
    { name: 'Writing (optional)', questions: 1, time: '40 min', score: '2-12', content: 'Argumentative essay on a given issue' },
  ],
  tips: 'ACT Science section tests data analysis, NOT science knowledge — treat it like a reading comprehension test with graphs. Time management is critical on ACT — less time per question than SAT. For the Reading section: read the questions first, then scan the passage for answers.',
};

/**
 * Common Core standards overview by grade band
 */
export const COMMON_CORE = {
  elementary: {
    grades: 'K-5',
    mathFocus: 'Number sense, addition/subtraction fluency, multiplication/division, fractions, measurement, geometry basics',
    elaFocus: 'Phonics, decoding, reading fluency, comprehension strategies, narrative/informational writing, grammar fundamentals',
  },
  middle: {
    grades: '6-8',
    mathFocus: 'Ratios/proportions, expressions/equations, geometry (area, volume, transformations), statistics/probability, introduction to functions',
    elaFocus: 'Close reading, textual evidence, argumentative/informational/narrative writing, research skills, vocabulary acquisition',
  },
  highSchool: {
    grades: '9-12',
    mathFocus: 'Algebra I/II, Geometry, Pre-Calculus — emphasis on mathematical practices: reasoning, modelling, precision',
    elaFocus: 'Complex literary/informational texts, evidence-based argument, research papers, synthesis across sources, rhetorical analysis',
  },
};

/**
 * American grading system
 */
export const AMERICAN_GRADING = {
  letterGrades: {
    'A+': { gpa: 4.0, percent: '97-100', description: 'Exceptional' },
    'A':  { gpa: 4.0, percent: '93-96', description: 'Excellent' },
    'A-': { gpa: 3.7, percent: '90-92', description: 'Very good' },
    'B+': { gpa: 3.3, percent: '87-89', description: 'Good' },
    'B':  { gpa: 3.0, percent: '83-86', description: 'Above average' },
    'B-': { gpa: 2.7, percent: '80-82', description: 'Satisfactory' },
    'C+': { gpa: 2.3, percent: '77-79', description: 'Average' },
    'C':  { gpa: 2.0, percent: '73-76', description: 'Below average' },
    'C-': { gpa: 1.7, percent: '70-72', description: 'Passing' },
    'D':  { gpa: 1.0, percent: '60-69', description: 'Poor' },
    'F':  { gpa: 0.0, percent: 'Below 60', description: 'Failing' },
  },
  apScoring: {
    5: 'Extremely well qualified — equivalent to A in college course',
    4: 'Well qualified — equivalent to A-/B+ in college course',
    3: 'Qualified — equivalent to B/C in college course (minimum for most college credit)',
    2: 'Possibly qualified — rarely accepted for credit',
    1: 'No recommendation — not accepted for credit',
  },
  weightedGPA: 'AP and Honors classes add 1.0 and 0.5 to the GPA respectively. A student earning an A in AP Chemistry gets 5.0, not 4.0. This is the "weighted GPA" — important for class rank and college admissions.',
  uaeContext: 'UAE American curriculum schools use the US GPA system. Most UAE universities (AUD, UOWD, Middlesex Dubai) require minimum 2.0-2.5 GPA. For US universities: NYU Abu Dhabi expects 3.7+ unweighted GPA. Scholarships typically require 3.5+ GPA. College Board AP exams are administered at UAE test centres in May each year.',
};

/**
 * Full subject list for the grade selector
 */
export const AMERICAN_SUBJECT_LIST = [
  // Core
  'English Language Arts', 'Mathematics', 'Algebra', 'Geometry', 'Pre-Calculus',
  'US History', 'World History', 'Government', 'Economics', 'Geography',
  'Biology', 'Chemistry', 'Physics', 'Earth Science', 'Environmental Science',
  // AP
  'AP Calculus AB', 'AP Calculus BC', 'AP Statistics',
  'AP Physics 1', 'AP Physics C', 'AP Chemistry', 'AP Biology', 'AP Environmental Science',
  'AP English Language', 'AP English Literature',
  'AP US History', 'AP World History', 'AP European History',
  'AP Microeconomics', 'AP Macroeconomics', 'AP Psychology', 'AP Human Geography',
  'AP Computer Science A', 'AP Computer Science Principles',
  'AP Art History', 'AP Music Theory', 'AP Arabic',
  // SAT/ACT
  'SAT Prep', 'ACT Prep',
];

/**
 * Get American curriculum prompt for Starky injection.
 * Auto-injects when uaeCurriculum === 'american'.
 */
export function getAmericanCurriculumPrompt(subject) {
  let prompt = `\nAMERICAN CURRICULUM — This student follows the US/Common Core curriculum with AP courses.\n`;

  // Grading
  prompt += `\nGRADING: GPA scale 0.0-4.0 (weighted up to 5.0 for AP). Letter grades A-F. AP exams scored 1-5.`;
  prompt += `\n${AMERICAN_GRADING.weightedGPA}`;
  prompt += `\n${AMERICAN_GRADING.uaeContext}\n`;

  // SAT overview
  prompt += `\nSAT (Digital): ${SAT_STRUCTURE.totalScore} total. Reading/Writing (${SAT_STRUCTURE.sections.readingWriting.time}) + Math (${SAT_STRUCTURE.sections.maths.time}). ${SAT_STRUCTURE.uaeContext}`;

  // Subject-specific tips
  if (subject) {
    const subjectLower = subject.toLowerCase();

    // SAT/ACT prep
    if (subjectLower.includes('sat')) {
      prompt += `\n\nSAT PREP:\nReading & Writing: ${SAT_STRUCTURE.sections.readingWriting.tips}`;
      prompt += `\nMath: ${SAT_STRUCTURE.sections.maths.tips}`;
      return prompt;
    }
    if (subjectLower.includes('act')) {
      prompt += `\n\nACT PREP: ${ACT_STRUCTURE.tips}`;
      ACT_STRUCTURE.sections.forEach(s => { prompt += `\n${s.name}: ${s.questions} questions in ${s.time}. ${s.content}`; });
      return prompt;
    }

    // AP subjects
    for (const [key, group] of Object.entries(AMERICAN_SUBJECTS)) {
      const match = group.subjects?.find(s =>
        subjectLower.includes(s.name.toLowerCase()) ||
        subjectLower.includes(s.code.replace(/-/g, ' '))
      );
      if (match || group.examinerTips.toLowerCase().includes(subjectLower)) {
        prompt += `\n\n${group.name} TIPS: ${group.examinerTips}`;
        break;
      }
    }
  }

  prompt += `\n\nAMERICAN CURRICULUM TEACHING RULES FOR STARKY:`;
  prompt += `\n- Use American English spelling (color not colour, analyze not analyse)`;
  prompt += `\n- Reference AP scoring criteria when helping with AP subjects`;
  prompt += `\n- For AP FRQs: teach students to show all working and justify every step`;
  prompt += `\n- SAT prep: focus on time management and elimination strategies`;
  prompt += `\n- Common Core standards: emphasise mathematical practices and close reading`;
  prompt += `\n- GPA context: explain how each grade affects their GPA`;
  prompt += `\n- UAE context: use Dubai, Abu Dhabi examples. Currency is AED not USD`;
  prompt += `\n- College prep: connect AP scores to university admission requirements`;

  return prompt;
}

/**
 * Check if a message is about American curriculum content
 */
export function isAmericanCurriculumTopic(message) {
  if (!message) return false;
  const lower = message.toLowerCase();
  const triggers = [
    'ap calculus', 'ap chemistry', 'ap physics', 'ap biology', 'ap english',
    'ap history', 'ap psychology', 'ap economics', 'ap computer science',
    'ap exam', 'ap class', 'ap course', 'advanced placement',
    'sat prep', 'sat reading', 'sat math', 'sat writing', 'sat score',
    'act prep', 'act test', 'act score',
    'common core', 'gpa', 'grade point average',
    'college board', 'free response question', 'frq',
    'american curriculum', 'us curriculum',
  ];
  return triggers.some(t => lower.includes(t));
}
