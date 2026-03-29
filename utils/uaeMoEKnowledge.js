/**
 * utils/uaeMoEKnowledge.js
 * UAE Ministry of Education (MoE) National Curriculum Knowledge Base
 *
 * For UAE government school students and private schools following MoE curriculum.
 * Covers KG to Grade 12, EmSAT, national curriculum structure.
 * Auto-injects when uaeCurriculum === 'moe'.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

export const MOE_SUBJECTS = {
  kindergarten: {
    name: 'KG1-KG2 (Foundation Stage)',
    ageRange: '4-6 years',
    subjects: [
      { code: 'arabic', name: 'Arabic Language', medium: 'Arabic' },
      { code: 'english', name: 'English Language', medium: 'English' },
      { code: 'islamic', name: 'Islamic Education', medium: 'Arabic' },
      { code: 'maths', name: 'Mathematics', medium: 'Bilingual' },
      { code: 'science', name: 'Science', medium: 'English' },
    ],
    tips: `KG in UAE MoE schools is play-based learning transitioning to structured learning in KG2. Arabic is taught as first language from KG1 — letter recognition, basic vocabulary, short sentences. English is introduced alongside Arabic — UAE MoE schools are increasingly bilingual. Islamic Education at this stage: basic duas, stories of prophets at age-appropriate level. Maths: number recognition 1-20, basic shapes, simple addition. The curriculum follows the UAE National Standards Framework — not Common Core, not British EYFS. UAE identity content starts from KG: flag, national anthem, Emirati heritage.`,
  },

  cycle1: {
    name: 'Cycle 1 — Grades 1-4 (Primary)',
    subjects: [
      { code: 'arabic', name: 'Arabic Language', mandatory: true },
      { code: 'english', name: 'English Language', mandatory: true },
      { code: 'maths', name: 'Mathematics', mandatory: true },
      { code: 'science', name: 'Science', mandatory: true },
      { code: 'islamic', name: 'Islamic Education', mandatory: true },
      { code: 'msc', name: 'Moral, Social & Cultural Studies', mandatory: true },
      { code: 'sst', name: 'Social Studies', mandatory: true },
      { code: 'art', name: 'Art', mandatory: true },
      { code: 'pe', name: 'Physical Education', mandatory: true },
      { code: 'ict', name: 'ICT / Design & Technology', mandatory: true },
    ],
    tips: `Cycle 1 establishes the bilingual foundation. Arabic is taught 6-7 periods per week, English 5-6 periods. Maths and Science are taught in English from Grade 1 in MoE schools (since 2017 reform). Islamic Education is in Arabic for Muslim students; non-Muslim students take Moral Education. Social Studies covers UAE geography, history, and national identity — taught in Arabic. MSC (Moral, Social & Cultural Studies) replaced standalone Moral Education in 2023-24. Assessment is continuous — no high-stakes exams in Cycle 1. Report cards use descriptors: Exceeding, Meeting, Approaching, Beginning.`,
  },

  cycle2: {
    name: 'Cycle 2 — Grades 5-8 (Middle)',
    subjects: [
      { code: 'arabic', name: 'Arabic Language', mandatory: true },
      { code: 'english', name: 'English Language', mandatory: true },
      { code: 'maths', name: 'Mathematics', mandatory: true },
      { code: 'science', name: 'Science', mandatory: true },
      { code: 'islamic', name: 'Islamic Education', mandatory: true },
      { code: 'msc', name: 'Moral, Social & Cultural Studies', mandatory: true },
      { code: 'sst', name: 'Social Studies', mandatory: true },
      { code: 'ict', name: 'Design & Technology / Computing', mandatory: true },
      { code: 'art', name: 'Art & Music', mandatory: true },
      { code: 'pe', name: 'Physical Education & Health', mandatory: true },
    ],
    tips: `Cycle 2 introduces centralised assessments. End-of-term exams are set by MoE, not individual schools. Maths and Science continue in English — students must be proficient in English mathematical and scientific vocabulary. Arabic Language focuses on grammar (nahw and sarf), reading comprehension, essay writing, and literature. Islamic Education covers Quran recitation with Tajweed, Hadith study, Fiqh basics, and Islamic history. Social Studies deepens UAE knowledge: Federation formation, seven emirates, government structure, economic development. Grade 8 is a critical year — performance determines pathway options for Cycle 3. Elective subjects may be introduced (additional languages, advanced ICT).`,
  },

  cycle3General: {
    name: 'Cycle 3 — Grades 9-12 (General Track)',
    subjects: [
      { code: 'arabic', name: 'Arabic Language', mandatory: true },
      { code: 'english', name: 'English Language', mandatory: true },
      { code: 'maths', name: 'Mathematics', mandatory: true },
      { code: 'science', name: 'General Sciences', mandatory: true },
      { code: 'islamic', name: 'Islamic Education', mandatory: true },
      { code: 'sst', name: 'Social Studies', mandatory: true },
      { code: 'msc', name: 'Moral, Social & Cultural Studies', mandatory: true },
    ],
    tips: `The General Track is for students not pursuing the Advanced (Science) or Elite tracks. It prepares students for vocational training, applied technology colleges, or general university programmes. EmSAT scores in the General Track determine university eligibility — students must achieve minimum scores in English, Maths, Arabic, and Physics for federal university admission. General Track students can still enter university if EmSAT scores are sufficient. The curriculum covers all core subjects but at a standard level — less depth in Maths and Science compared to the Advanced Track.`,
  },

  cycle3Advanced: {
    name: 'Cycle 3 — Grades 9-12 (Advanced/Science Track)',
    subjects: [
      { code: 'arabic', name: 'Arabic Language', mandatory: true },
      { code: 'english', name: 'English Language', mandatory: true },
      { code: 'maths', name: 'Advanced Mathematics', mandatory: true },
      { code: 'physics', name: 'Physics', mandatory: true },
      { code: 'chemistry', name: 'Chemistry', mandatory: true },
      { code: 'biology', name: 'Biology', mandatory: true },
      { code: 'islamic', name: 'Islamic Education', mandatory: true },
      { code: 'sst', name: 'Social Studies', mandatory: true },
      { code: 'cs', name: 'Computer Science', mandatory: false },
    ],
    tips: `The Advanced Track is the university-preparation pathway — equivalent to science stream. Students take separate Physics, Chemistry, Biology instead of General Science. Advanced Mathematics covers calculus, statistics, and advanced algebra. This track is required for engineering, medicine, and science degrees at UAE federal universities (UAEU, Zayed University, Khalifa University). EmSAT Achieve scores in the Advanced Track are higher — students must aim for 1100+ in English and 900+ in Maths for competitive programmes. The Elite Track (added 2020) offers even more rigorous content for students targeting top universities. Grade 12 marks + EmSAT scores together determine university placement — both matter.`,
  },
};

/**
 * EmSAT (Emirates Standardised Test) — UAE national university entrance exam
 */
export const EMSAT_STRUCTURE = {
  name: 'EmSAT (Emirates Standard Test)',
  purpose: 'National standardised test for UAE university admission. Mandatory for all Grade 12 students in UAE government schools. Also accepted by many private schools.',
  tests: {
    emsatEnglish: {
      name: 'EmSAT Achieve — English',
      score: '500-2000',
      sections: ['Grammar & Vocabulary', 'Reading', 'Writing'],
      duration: '135 minutes',
      universityMinimum: '1100 for most federal university programmes, 1400+ for competitive programmes',
      tips: 'EmSAT English is closest to IELTS in format. Reading section has academic passages — practice skimming and scanning. Writing section requires a structured essay (introduction, body, conclusion). Grammar questions test verb tenses, articles, prepositions, conditionals. For Emirati students: common errors are article usage (a/an/the), subject-verb agreement, and passive voice construction. Practice with past EmSAT papers from MoE website.',
    },
    emsatMaths: {
      name: 'EmSAT Achieve — Mathematics',
      score: '500-2000',
      sections: ['Algebra', 'Geometry', 'Statistics & Probability', 'Calculus (Advanced Track)'],
      duration: '120 minutes',
      universityMinimum: '600 for general programmes, 900+ for engineering/science',
      tips: 'EmSAT Maths is computer-based — students must be comfortable with digital tools. Algebra and functions carry the most weight. For Advanced Track students: calculus questions (limits, derivatives, integrals) appear. Calculator is NOT allowed — strong mental maths is essential. Practice without calculator from Grade 10 onwards. Common mistakes: sign errors, forgetting to check domain restrictions, misreading graph questions.',
    },
    emsatArabic: {
      name: 'EmSAT Achieve — Arabic',
      score: '500-2000',
      sections: ['Reading Comprehension', 'Grammar (النحو والصرف)', 'Writing'],
      duration: '120 minutes',
      universityMinimum: '600 for most programmes, 1000+ for Arabic-medium programmes',
      tips: 'EmSAT Arabic tests Modern Standard Arabic (MSA), not Emirati dialect. Reading passages include literary, informational, and persuasive texts. Grammar section tests إعراب (i\'rab — case endings), verb conjugation, and sentence structure. Writing requires formal Arabic essay with clear structure. For non-native Arabic speakers (expatriate students): focus on reading comprehension strategies and basic grammar rules. For native speakers: writing section is where most marks are gained or lost — practice structured essay format.',
    },
    emsatPhysics: {
      name: 'EmSAT Achieve — Physics',
      score: '500-2000',
      sections: ['Mechanics', 'Waves & Optics', 'Electricity & Magnetism', 'Modern Physics'],
      duration: '90 minutes',
      universityMinimum: '600 for science programmes, 800+ for engineering',
      tips: 'EmSAT Physics questions are conceptual and numerical. Students must understand the physics behind formulas — not just plug and chug. Mechanics (kinematics, forces, energy) carries the highest weight. Electricity questions often involve circuit analysis — practice Kirchhoff\'s laws. Modern Physics (atomic structure, radioactivity) is shorter but frequently tested. Draw free body diagrams for every mechanics problem. Units matter — always include units in your answer.',
    },
    emsatChemistry: {
      name: 'EmSAT Achieve — Chemistry',
      score: '500-2000',
      sections: ['Atomic Structure & Bonding', 'Stoichiometry', 'Organic Chemistry', 'Thermochemistry'],
      duration: '90 minutes',
      tips: 'Stoichiometry is the backbone — mole calculations appear in every section. Organic Chemistry: know functional groups, naming conventions, and basic reactions. Periodic table trends (electronegativity, ionisation energy, atomic radius) are always tested. Balance equations before calculating — unbalanced equations give wrong molar ratios.',
    },
    emsatBiology: {
      name: 'EmSAT Achieve — Biology',
      score: '500-2000',
      sections: ['Cell Biology', 'Genetics & Evolution', 'Human Biology', 'Ecology'],
      duration: '90 minutes',
      tips: 'Cell biology and genetics carry the most marks. Know mitosis vs meiosis cold — draw the stages. Genetics: practice Punnett squares for mono and dihybrid crosses, codominance, sex-linked inheritance. Human biology: circulatory, respiratory, nervous systems — know the pathway of blood, gas exchange, nerve impulse. Ecology: food webs, energy pyramids, carbon/nitrogen cycles. Diagrams help — even in a computer-based test, understanding visual representations is key.',
    },
    emsatCS: {
      name: 'EmSAT Achieve — Computer Science',
      score: '500-2000',
      sections: ['Programming (Python)', 'Data Structures', 'Algorithms', 'Networks & Security'],
      duration: '90 minutes',
      tips: 'EmSAT CS uses Python as the programming language. Students must trace code output, identify errors, and write code snippets. Data structures: arrays, lists, dictionaries, stacks, queues. Algorithms: sorting (bubble, selection, insertion), searching (linear, binary). Networks: know TCP/IP, HTTP, DNS basics. Cybersecurity: encryption types, threats, firewalls. UAE context: UAE Cybersecurity Council, smart government initiatives.',
    },
  },
  uaeContext: 'EmSAT is administered by MoE and mandatory for Grade 12 government school students. Private school students can also take EmSAT. Results are used by UAE federal universities (UAEU, Zayed University, Higher Colleges of Technology, Khalifa University) for admission. EmSAT is free for UAE students. Tests are computer-based and held multiple times per year. Some universities accept EmSAT in lieu of IELTS/TOEFL for English proficiency.',
};

/**
 * MoE grading system
 */
export const MOE_GRADING = {
  cycle1_2: {
    system: 'Continuous assessment with descriptors',
    descriptors: {
      'Exceeding (E)': 'Student exceeds grade-level expectations',
      'Meeting (M)': 'Student meets grade-level expectations',
      'Approaching (A)': 'Student is approaching grade-level expectations',
      'Beginning (B)': 'Student is at beginning level — needs support',
    },
  },
  cycle3: {
    system: 'Percentage-based with letter grades',
    grades: {
      'A+': '97-100', 'A': '93-96', 'A-': '90-92',
      'B+': '86-89', 'B': '83-85', 'B-': '80-82',
      'C+': '76-79', 'C': '73-75', 'C-': '70-72',
      'D+': '66-69', 'D': '60-65',
      'F': 'Below 60 — Fail',
    },
    passMarks: '60% minimum in each subject',
    assessment: 'Continuous assessment (30-40%) + End-of-term exam (60-70%)',
  },
  distinction: 'MoE vs private school grading: MoE uses its own grading scale, not A*-G (British) or GPA (American). University admission depends on EmSAT scores + Grade 12 marks combined.',
};

/**
 * What makes MoE curriculum different
 */
export const MOE_DISTINCTIVE = {
  bilingual: 'Maths and Science taught in English since 2017 — but Arabic, Islamic Education, Social Studies remain in Arabic. Students must be genuinely bilingual.',
  nationalIdentity: 'Strong emphasis on UAE identity, values, and heritage throughout all subjects. Sheikh Zayed\'s legacy, UAE Vision 2071, tolerance, and innovation are woven into every subject.',
  emsat: 'EmSAT is the gateway exam — unlike SAT (optional) or GCSE (curriculum-specific), EmSAT is mandatory for federal university entry. It determines placement, not just admission.',
  tracks: 'Cycle 3 (Grades 9-12) splits into General and Advanced tracks. Track determines university pathway — Advanced is required for STEM degrees.',
  islamicEducation: 'Islamic Education is examined and mandatory for Muslim students across all cycles. It is a full academic subject, not optional enrichment.',
  reforms: 'Since 2017: English-medium for STEM, standardised MoE exams, EmSAT introduction, competency-based curriculum, AI and coding from Grade 1. The curriculum is rapidly modernising.',
};

/**
 * Full subject list for the grade selector
 */
export const MOE_SUBJECT_LIST = [
  // Core
  'Arabic Language', 'English Language', 'Mathematics', 'Science',
  'Islamic Education', 'Social Studies', 'Moral Social & Cultural Studies',
  // Cycle 3 Advanced
  'Advanced Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  // General
  'Art', 'Physical Education', 'Design & Technology',
  // EmSAT Prep
  'EmSAT English Prep', 'EmSAT Maths Prep', 'EmSAT Arabic Prep',
  'EmSAT Physics Prep', 'EmSAT Chemistry Prep', 'EmSAT Biology Prep',
  'EmSAT Computer Science Prep',
];

/**
 * Get MoE curriculum prompt for Starky injection.
 * Auto-injects when uaeCurriculum === 'moe'.
 */
export function getMoECurriculumPrompt(subject) {
  let prompt = `\nUAE MINISTRY OF EDUCATION CURRICULUM — This student follows the UAE national MoE curriculum.\n`;

  // Key distinction
  prompt += `\nKEY: This is the UAE GOVERNMENT school curriculum — different from British, American, and IB curricula used in private schools.`;
  prompt += `\n${MOE_DISTINCTIVE.bilingual}`;
  prompt += `\n${MOE_DISTINCTIVE.emsat}\n`;

  // Grading
  prompt += `\nGRADING (Cycle 3): ${MOE_GRADING.cycle3.assessment}. Pass mark: ${MOE_GRADING.cycle3.passMarks}.`;
  prompt += `\n${MOE_GRADING.distinction}\n`;

  // Subject-specific tips
  if (subject) {
    const subjectLower = subject.toLowerCase();

    // EmSAT prep
    if (subjectLower.includes('emsat')) {
      prompt += `\n\nEmSAT PREPARATION:`;
      for (const [key, test] of Object.entries(EMSAT_STRUCTURE.tests)) {
        if (subjectLower.includes(test.name.toLowerCase().split('—')[1]?.trim().split(' ')[0]?.toLowerCase() || '')) {
          prompt += `\n${test.name}: Score ${test.score}. Duration: ${test.duration}. University minimum: ${test.universityMinimum || 'varies'}.`;
          prompt += `\nTIPS: ${test.tips}`;
          prompt += `\n${EMSAT_STRUCTURE.uaeContext}`;
          return prompt;
        }
      }
      // General EmSAT overview
      for (const [key, test] of Object.entries(EMSAT_STRUCTURE.tests)) {
        prompt += `\n${test.name}: ${test.score} score range. ${test.universityMinimum || ''}`;
      }
      prompt += `\n${EMSAT_STRUCTURE.uaeContext}`;
      return prompt;
    }

    // Match to cycle/subject groups
    for (const [key, group] of Object.entries(MOE_SUBJECTS)) {
      const match = group.subjects?.find(s =>
        subjectLower.includes(s.name.toLowerCase()) ||
        subjectLower.includes(s.code)
      );
      if (match || (group.tips && group.tips.toLowerCase().includes(subjectLower))) {
        prompt += `\n\n${group.name} TIPS: ${group.tips}`;
        break;
      }
    }
  }

  prompt += `\n\nMoE TEACHING RULES FOR STARKY:`;
  prompt += `\n- This is the UAE national curriculum — respect it as the official government programme`;
  prompt += `\n- Arabic subjects: respond in Arabic when student writes in Arabic, or explain in English if they prefer`;
  prompt += `\n- Islamic Education: teach with scholarly respect, reference Quran and Hadith accurately`;
  prompt += `\n- Maths and Science are in English — but students may think in Arabic, so bridge both languages`;
  prompt += `\n- EmSAT is critical — treat it like SAT/GCSE in importance for this student`;
  prompt += `\n- UAE identity content is not filler — it is examined and assessed`;
  prompt += `\n- Know the track system: General vs Advanced determines university pathway`;
  prompt += `\n- Use UAE examples: AED currency, Dubai/Abu Dhabi geography, Sheikh Zayed values`;
  prompt += `\n- For Emirati students: connect to national pride, Vision 2071, innovation agenda`;
  prompt += `\n- Social Studies and MSC are in Arabic — help with English explanations when asked`;

  return prompt;
}

/**
 * Check if a message is about MoE curriculum content
 */
export function isMoETopic(message) {
  if (!message) return false;
  const lower = message.toLowerCase();
  const triggers = [
    'moe curriculum', 'ministry of education', 'uae curriculum', 'government school',
    'emsat', 'emsat achieve', 'emsat english', 'emsat maths', 'emsat arabic',
    'emsat physics', 'emsat chemistry', 'emsat biology',
    'cycle 1', 'cycle 2', 'cycle 3', 'advanced track', 'general track', 'elite track',
    'uae national curriculum', 'moe school', 'moe exam',
    'moral social cultural', 'msc subject',
    'zayed university admission', 'uaeu admission', 'khalifa university',
    'higher colleges of technology', 'hct admission',
  ];
  return triggers.some(t => lower.includes(t));
}
