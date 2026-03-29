/**
 * utils/cbseKnowledge.js
 * CBSE (Central Board of Secondary Education) Knowledge Base
 *
 * For UAE students selecting Indian CBSE curriculum.
 * Covers Class 9-12, Science/Commerce/Arts streams, JEE/NEET, NCERT.
 * Auto-injects when uaeCurriculum === 'cbse'.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

export const CBSE_SUBJECTS = {
  class9_10: {
    name: 'Class 9-10 (Secondary)',
    subjects: [
      { code: 'maths', name: 'Mathematics', mandatory: true },
      { code: 'science', name: 'Science', mandatory: true },
      { code: 'sst', name: 'Social Science', mandatory: true },
      { code: 'english', name: 'English', mandatory: true },
      { code: 'hindi', name: 'Hindi', mandatory: false },
      { code: 'it', name: 'Information Technology', mandatory: false },
      { code: 'ai', name: 'Artificial Intelligence', mandatory: false },
    ],
    examinerTips: `Class 10 board exams are the first major national exam. NCERT textbooks are the ONLY source for board exams — every question comes from NCERT. Students who memorise NCERT examples and back-exercise solutions score 90+. Science paper: Physics (light, electricity, magnetic effects), Chemistry (acids-bases, metals, carbon compounds, periodic table), Biology (life processes, heredity, environment). Each section carries equal marks. Maths: real numbers, polynomials, coordinate geometry, trigonometry, statistics, probability — practice NCERT exemplar problems for HOTS questions. Social Science: History (nationalism, industrialisation), Geography (resources, agriculture, manufacturing), Political Science (democracy, federalism), Economics (development, sectors, money). English: two papers — Language (reading, writing, grammar) and Literature (First Flight + Footprints Without Feet). For UAE Indian students: many struggle with Hindi — schools in Dubai offer alternative languages or Hindi at basic level.`,
    markScheme: 'Each subject: 80 marks (theory) + 20 marks (internal assessment). Pass mark: 33% per subject. Distinction: 75%+.',
  },

  scienceStream: {
    name: 'Class 11-12 Science Stream',
    subjects: [
      { code: 'phys', name: 'Physics', mandatory: true },
      { code: 'chem', name: 'Chemistry', mandatory: true },
      { code: 'maths', name: 'Mathematics', mandatory: false, note: 'PCM stream' },
      { code: 'bio', name: 'Biology', mandatory: false, note: 'PCB stream' },
      { code: 'eng', name: 'English Core', mandatory: true },
      { code: 'cs', name: 'Computer Science (Python)', mandatory: false },
      { code: 'ip', name: 'Informatics Practices', mandatory: false },
      { code: 'pe', name: 'Physical Education', mandatory: false },
    ],
    examinerTips: `Physics: Electrostatics and Optics are highest-weightage chapters in Class 12. Numericals carry 3-5 marks each — show every step with units. Derivations MUST follow NCERT format exactly — examiners check derivation steps against the textbook. Ray diagrams must be drawn with ruler. Chemistry: Organic Chemistry reactions (Class 12) are most feared — memorise named reactions (Wurtz, Kolbe, Reimer-Tiemann, Cannizzaro). Inorganic Chemistry: p-block elements require rote memorisation of exceptions. Physical Chemistry: Electrochemistry and Chemical Kinetics — practice numericals from NCERT + exemplar. Biology: diagrams are ESSENTIAL — label every part. Human Reproduction and Genetics chapters carry maximum marks. Ecology is the easiest chapter — never skip it. Mathematics: Calculus (integration + differentiation) carries 35+ marks in Class 12. Practice NCERT miscellaneous exercises — board questions are often rephrased from these.`,
    jeeNeet: `JEE Main + Advanced (for IIT admission): Physics, Chemistry, Maths. JEE Main: 90 questions, 300 marks, 3 hours. JEE Advanced: 2 papers of 3 hours each. NEET (for medical admission): Physics, Chemistry, Biology. 200 questions, 720 marks, 3h20m. UAE students can appear for JEE/NEET at Dubai test centres. Many Dubai CBSE schools offer integrated JEE/NEET coaching from Class 11. NCERT is foundation for both — but JEE/NEET require HC Verma (Physics), MS Chouhan (Organic Chemistry), DC Pandey (Physics problems) level of preparation.`,
  },

  commerceStream: {
    name: 'Class 11-12 Commerce Stream',
    subjects: [
      { code: 'acc', name: 'Accountancy', mandatory: true },
      { code: 'bst', name: 'Business Studies', mandatory: true },
      { code: 'eco', name: 'Economics', mandatory: true },
      { code: 'eng', name: 'English Core', mandatory: true },
      { code: 'maths', name: 'Mathematics (optional)', mandatory: false },
      { code: 'ip', name: 'Informatics Practices', mandatory: false },
      { code: 'pe', name: 'Physical Education', mandatory: false },
    ],
    examinerTips: `Accountancy: two parts — Financial Accounting (Partnership, Company Accounts) and Computerised Accounting (Class 12). Journal entries MUST balance — even one wrong entry costs the entire question's marks. Cash Flow Statement and Ratio Analysis are high-scoring if practiced. Business Studies: case-study-based questions since 2023 — students must apply concepts to real scenarios, not just define terms. Management Principles (Fayol + Taylor) and Marketing chapters are most frequently tested. Economics: Macro (National Income, Money & Banking, Government Budget, Balance of Payments) + Micro (Demand-Supply, Production, Cost, Market Structures). Diagrams are mandatory for full marks in Economics — revenue curves, cost curves, equilibrium. For UAE students: use UAE economic examples — Dubai's trade economy, UAE banking sector, Expo 2020 economic impact.`,
  },

  artsStream: {
    name: 'Class 11-12 Arts/Humanities Stream',
    subjects: [
      { code: 'hist', name: 'History', mandatory: false },
      { code: 'polsci', name: 'Political Science', mandatory: false },
      { code: 'geo', name: 'Geography', mandatory: false },
      { code: 'psych', name: 'Psychology', mandatory: false },
      { code: 'socio', name: 'Sociology', mandatory: false },
      { code: 'eng', name: 'English Core', mandatory: true },
      { code: 'hindi', name: 'Hindi Elective/Core', mandatory: false },
      { code: 'painting', name: 'Painting', mandatory: false },
      { code: 'pe', name: 'Physical Education', mandatory: false },
    ],
    examinerTips: `History: Class 12 covers Indian History from earliest times to modern India. Source-based questions carry 4-5 marks — read the source extract carefully, answer in context. Map work is compulsory — practice locating Harappan sites, Mughal centres, 1857 centres. Political Science: Indian Constitution and contemporary world politics. Compare-and-contrast questions are common — always present both sides. Geography: Physical and Human Geography — map work carries 5 marks (locate and label). Psychology: Class 12 focuses on applied topics — Psychological Disorders, Therapeutic Approaches, Attitude and Social Cognition. Case studies are now included — apply concepts to given scenarios. For UAE Indian students in Arts: this stream is less common in Dubai schools but valid for Delhi University, JNU, and other top Indian universities.`,
  },
};

/**
 * NCERT curriculum structure
 */
export const NCERT_STRUCTURE = {
  description: 'NCERT (National Council of Educational Research and Training) publishes the official textbooks used by CBSE. Every board exam question is based on NCERT content.',
  keyPrinciple: 'NCERT is the Bible of CBSE. Students who master every NCERT example, exercise, and in-text question will score 90%+ in boards. For competitive exams (JEE/NEET), NCERT is the foundation — then build on it with reference books.',
  textbooks: {
    science9: 'NCERT Science Class 9 (single book covering Physics, Chemistry, Biology)',
    science10: 'NCERT Science Class 10 (single book)',
    physics11: 'NCERT Physics Part 1 & Part 2 (Class 11)',
    physics12: 'NCERT Physics Part 1 & Part 2 (Class 12)',
    chemistry11: 'NCERT Chemistry Part 1 & Part 2 (Class 11)',
    chemistry12: 'NCERT Chemistry Part 1 & Part 2 (Class 12)',
    maths11: 'NCERT Mathematics (Class 11)',
    maths12: 'NCERT Mathematics Part 1 & Part 2 (Class 12)',
    biology11: 'NCERT Biology (Class 11)',
    biology12: 'NCERT Biology (Class 12)',
  },
  supplementary: [
    'NCERT Exemplar — harder problems, essential for HOTS and competitive exams',
    'Previous Year Questions (PYQs) — last 10 years of CBSE board papers',
    'Sample Papers — released by CBSE each December for upcoming boards',
  ],
};

/**
 * CBSE grading system
 */
export const CBSE_GRADING = {
  class10: {
    system: 'Percentage-based since 2018 (CGPA discontinued for Class 10)',
    marksheet: 'Individual subject marks out of 100 (80 theory + 20 internal)',
    passMarks: '33% in each subject, 33% aggregate',
    grades: {
      'A1': '91-100', 'A2': '81-90', 'B1': '71-80', 'B2': '61-70',
      'C1': '51-60', 'C2': '41-50', 'D': '33-40', 'E (Fail)': 'Below 33',
    },
  },
  class12: {
    system: 'Percentage-based. Best of 4 subjects used for university cutoffs.',
    passMarks: '33% in each subject (theory + practical combined), minimum 33% in theory alone',
    compartment: 'Fail in 1-2 subjects: compartment exam (re-sit). Fail in 3+: repeat year.',
  },
  uaeContext: 'CBSE schools in UAE (GEMS, Indian High School Dubai, Delhi Private School, NIMS) follow the same curriculum and exam pattern as India. Class 10 and 12 board exams are conducted simultaneously worldwide. Results typically in May (Class 10) and July (Class 12). UAE CBSE students can apply to Indian universities using CBSE board marks. Many Dubai families supplement with tuition centres in Karama, Bur Dubai, and Sharjah for competitive exam prep.',
};

/**
 * Full subject list for the grade selector
 */
export const CBSE_SUBJECT_LIST = [
  // Class 9-10
  'Mathematics', 'Science', 'Social Science', 'English', 'Hindi',
  'Information Technology', 'Artificial Intelligence',
  // Class 11-12 Science
  'Physics', 'Chemistry', 'Biology', 'Mathematics (Class 11-12)',
  'Computer Science (Python)', 'Informatics Practices',
  // Class 11-12 Commerce
  'Accountancy', 'Business Studies', 'Economics',
  // Class 11-12 Arts
  'History', 'Political Science', 'Geography', 'Psychology', 'Sociology',
  // Competitive
  'JEE Preparation', 'NEET Preparation',
  // General
  'Physical Education', 'English Core', 'Painting',
];

/**
 * Get CBSE curriculum prompt for Starky injection.
 * Auto-injects when uaeCurriculum === 'cbse'.
 */
export function getCBSECurriculumPrompt(subject) {
  let prompt = `\nCBSE CURRICULUM — This student follows the Indian CBSE/NCERT curriculum.\n`;

  // Grading
  prompt += `\nGRADING: ${CBSE_GRADING.class12.system} Pass marks: ${CBSE_GRADING.class12.passMarks}.`;
  prompt += `\n${CBSE_GRADING.uaeContext}\n`;

  // NCERT importance
  prompt += `\nNCERT RULE: ${NCERT_STRUCTURE.keyPrinciple}`;

  // Subject-specific tips
  if (subject) {
    const subjectLower = subject.toLowerCase();

    // JEE/NEET prep
    if (subjectLower.includes('jee')) {
      prompt += `\n\nJEE PREPARATION: ${CBSE_SUBJECTS.scienceStream.jeeNeet}`;
      prompt += `\nFocus on PCM — Physics (HC Verma level), Chemistry (organic reactions + physical chemistry numericals), Maths (calculus, coordinate geometry, algebra).`;
      return prompt;
    }
    if (subjectLower.includes('neet')) {
      prompt += `\n\nNEET PREPARATION: ${CBSE_SUBJECTS.scienceStream.jeeNeet}`;
      prompt += `\nFocus on PCB — Physics (NCERT + DC Pandey), Chemistry (NCERT + MS Chouhan for organic), Biology (NCERT is 90% of NEET — read line by line).`;
      return prompt;
    }

    // Match to subject groups
    for (const [key, group] of Object.entries(CBSE_SUBJECTS)) {
      const match = group.subjects?.find(s =>
        subjectLower.includes(s.name.toLowerCase()) ||
        subjectLower.includes(s.code)
      );
      if (match || group.examinerTips.toLowerCase().includes(subjectLower)) {
        prompt += `\n\n${group.name} TIPS: ${group.examinerTips}`;
        if (group.jeeNeet) prompt += `\n\nCOMPETITIVE EXAMS: ${group.jeeNeet}`;
        break;
      }
    }
  }

  prompt += `\n\nCBSE TEACHING RULES FOR STARKY:`;
  prompt += `\n- NCERT is supreme — always reference NCERT textbook content first`;
  prompt += `\n- For board exams: teach NCERT examples, back-exercises, and exemplar problems`;
  prompt += `\n- Derivations must follow NCERT format exactly — examiners match step-by-step`;
  prompt += `\n- Diagrams are mandatory for full marks in Science and Geography`;
  prompt += `\n- For Class 10: emphasise that EVERY question comes from NCERT`;
  prompt += `\n- For Class 12: best of 4 subjects determines university cutoff — strategise accordingly`;
  prompt += `\n- JEE/NEET students: NCERT first, then reference books (HC Verma, DC Pandey, MS Chouhan)`;
  prompt += `\n- UAE context: use Dubai/Sharjah examples, Indian community references, AED not INR`;
  prompt += `\n- Hindi medium students may need English explanations of Hindi textbook concepts`;
  prompt += `\n- Previous Year Questions (PYQs) are the best predictor of board exam patterns`;

  return prompt;
}

/**
 * Check if a message is about CBSE content
 */
export function isCBSETopic(message) {
  if (!message) return false;
  const lower = message.toLowerCase();
  const triggers = [
    'cbse', 'ncert', 'class 9', 'class 10', 'class 11', 'class 12',
    'board exam', 'board paper', 'cbse board',
    'jee main', 'jee advanced', 'neet exam', 'neet prep',
    'ncert exemplar', 'ncert solutions', 'previous year question',
    'pcm', 'pcb', 'science stream', 'commerce stream', 'arts stream',
    'cgpa', 'compartment exam',
    'indian curriculum', 'cbse curriculum',
    'hc verma', 'dc pandey', 'rd sharma', 'rs aggarwal',
    'accountancy class', 'business studies class',
  ];
  return triggers.some(t => lower.includes(t));
}
