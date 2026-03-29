/**
 * utils/ibKnowledge.js
 * IB Diploma Programme Knowledge Base
 *
 * For UAE students selecting IB curriculum.
 * Covers all 6 subject groups + TOK, EE, CAS.
 * Includes examiner intelligence, IA guidance, and common pitfalls.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

export const IB_SUBJECTS = {
  // Group 1: Studies in Language and Literature
  group1: {
    name: 'Group 1 — Language & Literature',
    subjects: [
      { code: 'eng-a-lit', name: 'English A: Literature', levels: ['SL', 'HL'] },
      { code: 'eng-a-langlit', name: 'English A: Language & Literature', levels: ['SL', 'HL'] },
      { code: 'ara-a-lit', name: 'Arabic A: Literature', levels: ['SL', 'HL'] },
      { code: 'ara-a-langlit', name: 'Arabic A: Language & Literature', levels: ['SL', 'HL'] },
      { code: 'fre-a-lit', name: 'French A: Literature', levels: ['SL', 'HL'] },
      { code: 'hin-a-lit', name: 'Hindi A: Literature', levels: ['SL', 'HL'] },
      { code: 'urd-a-lit', name: 'Urdu A: Literature', levels: ['SL', 'HL'] },
    ],
    examinerTips: `Group 1 is NOT a language exam — it tests literary analysis and critical thinking. Students must go beyond plot summary. The IO (Individual Oral) is 15 minutes: 10-minute prepared analysis of a global issue through two works (one studied, one free choice) + 5-minute Q&A. Common mistake: students describe instead of analyse. Use PEE (Point, Evidence, Explanation) or better yet PEEL (Point, Evidence, Explanation, Link). For Paper 1 (Guided Literary Analysis), students get an unseen text — teach close reading skills: tone, imagery, structure, narrator perspective. Paper 2 (Comparative Essay) requires genuine comparison, not two separate essays side by side. HL students also write an HL Essay (1200-1500 words) on a work studied.`,
    iaGuidance: `Individual Oral (IO): 15 minutes total. Students choose a global issue (e.g. power, identity, culture, inequality) and connect it through TWO works — one literary, one non-literary or from a different part of the course. The body of work must be the student's own selection. Criterion A: Knowledge and understanding (10 marks). Criterion B: Analysis and evaluation (10 marks). Criterion C: Focus and organisation (10 marks). Criterion D: Language (10 marks). Total: 40 marks.`,
  },

  // Group 2: Language Acquisition
  group2: {
    name: 'Group 2 — Language Acquisition',
    subjects: [
      { code: 'eng-b', name: 'English B', levels: ['SL', 'HL'] },
      { code: 'ara-b', name: 'Arabic B', levels: ['SL', 'HL'] },
      { code: 'fre-b', name: 'French B', levels: ['SL', 'HL'] },
      { code: 'spa-b', name: 'Spanish B', levels: ['SL', 'HL'] },
      { code: 'man-b', name: 'Mandarin B', levels: ['SL', 'HL'] },
      { code: 'ger-b', name: 'German B', levels: ['SL', 'HL'] },
      { code: 'ita-b', name: 'Italian B', levels: ['SL', 'HL'] },
      { code: 'jpn-b', name: 'Japanese B', levels: ['SL', 'HL'] },
      { code: 'hin-b', name: 'Hindi B', levels: ['SL', 'HL'] },
      { code: 'ara-ab', name: 'Arabic Ab Initio', levels: ['SL'] },
      { code: 'fre-ab', name: 'French Ab Initio', levels: ['SL'] },
      { code: 'spa-ab', name: 'Spanish Ab Initio', levels: ['SL'] },
      { code: 'ger-ab', name: 'German Ab Initio', levels: ['SL'] },
      { code: 'ita-ab', name: 'Italian Ab Initio', levels: ['SL'] },
      { code: 'jpn-ab', name: 'Japanese Ab Initio', levels: ['SL'] },
      { code: 'man-ab', name: 'Mandarin Ab Initio', levels: ['SL'] },
    ],
    examinerTips: `Language B is for students with prior experience in the language. Ab Initio is for beginners (SL only). Five themes: Identities, Experiences, Human Ingenuity, Social Organisation, Sharing the Planet. Paper 1: Productive skills (writing). Paper 2: Receptive skills (reading comprehension). The Individual Oral is based on a visual stimulus linked to a theme — students must not simply describe the image but connect it to the theme and their own experience. Common pitfall: students prepare memorised answers instead of engaging authentically with the stimulus. For Arabic B in UAE: students often confuse MSA (Modern Standard Arabic) with Emirati dialect — IB exams use MSA.`,
    iaGuidance: `Individual Oral: Based on a visual stimulus (photo, advertisement, infographic) linked to one of the 5 prescribed themes. SL: 12-15 minutes. HL: 12-15 minutes with additional discussion of a literary extract. Students choose the stimulus themselves from a set provided by the teacher. Must demonstrate ability to discuss ideas, not just describe.`,
  },

  // Group 3: Individuals and Societies
  group3: {
    name: 'Group 3 — Individuals & Societies',
    subjects: [
      { code: 'econ', name: 'Economics', levels: ['SL', 'HL'] },
      { code: 'bus', name: 'Business Management', levels: ['SL', 'HL'] },
      { code: 'hist', name: 'History', levels: ['SL', 'HL'] },
      { code: 'geo', name: 'Geography', levels: ['SL', 'HL'] },
      { code: 'psych', name: 'Psychology', levels: ['SL', 'HL'] },
      { code: 'gp', name: 'Global Politics', levels: ['SL', 'HL'] },
      { code: 'ess', name: 'Environmental Systems & Societies', levels: ['SL'] },
      { code: 'phil', name: 'Philosophy', levels: ['SL', 'HL'] },
    ],
    examinerTips: `Economics: Diagrams are ESSENTIAL — every economics answer should include a relevant, fully labelled diagram. Students lose easy marks by drawing diagrams without labels or with incorrect axes. The commentary IA (3 commentaries, 800 words each) must use REAL news articles as stimulus — not textbook scenarios. Each commentary covers a different section of the syllabus (Micro, Macro, International, Development). Business Management: The toolkit is key — SWOT, PEST, Ansoff, Porter's Five Forces, Boston Matrix. Paper 1 uses a pre-released case study (HL). History: Arguments must be balanced — the best answers acknowledge counter-arguments. Use specific evidence (dates, names, statistics). For UAE students: Islamic civilisation topics and Middle East history are available.`,
    iaGuidance: `Economics IA: Portfolio of 3 commentaries (800 words each). Each based on a different published news article. Each covers a different section of the syllabus. Must include diagrams. Max 3 articles as source material per commentary. Business Management IA: Research project (SL: 1500 words, HL: 2000 words) on a real organisation answering a specific research question. History IA: Historical investigation (2200 words) — student chooses topic, evaluates sources, analyses evidence.`,
  },

  // Group 4: Sciences
  group4: {
    name: 'Group 4 — Sciences',
    subjects: [
      { code: 'phys', name: 'Physics', levels: ['SL', 'HL'] },
      { code: 'chem', name: 'Chemistry', levels: ['SL', 'HL'] },
      { code: 'bio', name: 'Biology', levels: ['SL', 'HL'] },
      { code: 'cs', name: 'Computer Science', levels: ['SL', 'HL'] },
      { code: 'des-tech', name: 'Design Technology', levels: ['SL', 'HL'] },
      { code: 'sports', name: 'Sports, Exercise & Health Science', levels: ['SL', 'HL'] },
    ],
    examinerTips: `IB Sciences are conceptual, not just computational. Students must explain the physics/chemistry/biology BEHIND the maths. Data-based questions (Paper 3 Section A) test graph reading, uncertainty calculation, and experimental design — these are free marks that many students throw away. For Chemistry: organic chemistry naming conventions follow IUPAC strictly. For Physics: always state assumptions in problem-solving. For Biology: draw and label diagrams from memory — especially cell structure, DNA replication, photosynthesis light reactions. The Group 4 Project is collaborative (10 hours) — students from different science subjects work together on a common theme. Common UAE context: desalination (Chem/Physics), marine ecosystems (Biology), solar energy (Physics), sustainable cities (ESS).`,
    iaGuidance: `Science IA: Individual investigation (6-12 pages). Students design their own experiment, collect data, analyse results, evaluate methodology. Assessed on: Personal Engagement (2), Exploration (6), Analysis (6), Evaluation (6), Communication (4) = 24 marks. The research question must be focused and testable. Raw data tables, processed data with uncertainties, and graph analysis are essential. Computer Science IA: Product development (solution to a real client's problem) with documentation covering planning, design, development, testing, and evaluation.`,
  },

  // Group 5: Mathematics
  group5: {
    name: 'Group 5 — Mathematics',
    subjects: [
      { code: 'math-aa', name: 'Mathematics: Analysis & Approaches', levels: ['SL', 'HL'] },
      { code: 'math-ai', name: 'Mathematics: Applications & Interpretation', levels: ['SL', 'HL'] },
    ],
    examinerTips: `Two maths courses since 2019 — AA (Analysis & Approaches) is for students heading towards pure maths, engineering, physics. AI (Applications & Interpretation) is for social sciences, business, design. AA HL is the hardest IB maths — calculus-heavy, proof-based. AI HL uses more statistics and modelling. GDC (Graphing Display Calculator) is REQUIRED for both — TI-84 or TI-Nspire. Students MUST show working even when using GDC — "by GDC" alone loses marks. For Paper 1 (no calculator): algebraic fluency is essential. Paper 2 (with GDC): know how to use solver, regression, graph analysis functions. Common mistake: not reading the mark scheme correctly — [M] marks are for method, [A] marks for answer, [R] marks for reasoning.`,
    iaGuidance: `Maths IA (Exploration): 12-20 pages. Student chooses a topic that interests them and explores it mathematically. Assessed on: Presentation (4), Mathematical Communication (4), Personal Engagement (3), Reflection (3), Use of Mathematics (6) = 20 marks. Topics should be personal and interesting — not generic textbook problems. Good IAs connect maths to real life, sport, music, art, architecture. UAE context ideas: geometry of Islamic art patterns, mathematics of Dubai Expo pavilions, statistical analysis of UAE demographic data, optimisation of desalination processes.`,
  },

  // Group 6: The Arts
  group6: {
    name: 'Group 6 — The Arts',
    subjects: [
      { code: 'vis-arts', name: 'Visual Arts', levels: ['SL', 'HL'] },
      { code: 'music', name: 'Music', levels: ['SL', 'HL'] },
      { code: 'theatre', name: 'Theatre', levels: ['SL', 'HL'] },
      { code: 'film', name: 'Film', levels: ['SL', 'HL'] },
      { code: 'dance', name: 'Dance', levels: ['SL', 'HL'] },
    ],
    examinerTips: `Group 6 is optional — students can take a second subject from Groups 1-4 instead. Visual Arts: the Process Portfolio (40% HL, 40% SL) documents artistic development through experimentation, not just finished pieces. The Comparative Study analyses artworks from different cultural contexts. Music: SL students create a musical links investigation (2400 words) and present a collection of pieces. HL adds solo performance and composition. Theatre: collaborative and solo performance projects — research notebook is essential evidence. Film: independent film production + comparative film study.`,
    iaGuidance: `Visual Arts: Exhibition (40% SL, 40% HL) — curated selection of resolved artworks. Process Portfolio (40%) — screens showing artistic journey. Comparative Study (20%) — 10-15 screens comparing artworks across cultures. Music IA: Musical Links Investigation (SL) or composition portfolio (HL). Theatre: Solo Theatre Piece (HL) — 4-7 minute original performance based on a theatre theorist.`,
  },

  // Core: TOK, EE, CAS
  core: {
    tok: {
      name: 'Theory of Knowledge (TOK)',
      description: 'Core requirement — explores how we know what we know',
      examinerTips: `TOK is about KNOWLEDGE, not opinions. The TOK Exhibition (1/3 of grade) requires 3 real-world objects linked to a prescribed prompt — students must explain how each object demonstrates a knowledge issue. The TOK Essay (2/3 of grade, 1600 words max) answers one of 6 prescribed titles — these change every exam session. Key concepts: Ways of Knowing (reason, emotion, language, sense perception, imagination, faith, intuition, memory), Areas of Knowledge (maths, natural sciences, human sciences, history, arts, ethics, religious knowledge, indigenous knowledge). Common mistake: students write philosophy essays instead of TOK essays — TOK requires specific real-world examples and personal knowledge questions. Best answers use the knowledge framework: scope, methods, historical development, links to personal knowledge.`,
    },
    ee: {
      name: 'Extended Essay (EE)',
      description: 'Core requirement — 4000-word independent research essay',
      examinerTips: `The EE is a 4000-word research paper in one of the student's 6 subjects (or World Studies for interdisciplinary). It requires a focused research question, academic referencing, and original analysis. Most popular subjects: History, English, Biology, Economics. The supervisor provides 3 mandatory reflection sessions (documented in RPPF — Reflections on Planning and Progress Form). Grading: A-E, combined with TOK for up to 3 bonus points. Common mistakes: research question too broad, relying on secondary sources only, exceeding word count. For sciences: the EE can be experimental (original lab work) or literature-based. UAE context: students can research UAE-specific topics — water security, economic diversification, cultural heritage preservation, sustainable architecture.`,
    },
    cas: {
      name: 'Creativity, Activity, Service (CAS)',
      description: 'Core requirement — 18 months of experiences',
      guidance: `CAS is NOT assessed with a grade — it is a completion requirement. Students must demonstrate involvement in Creativity (arts, creative thinking), Activity (physical exertion, healthy lifestyle), and Service (unpaid, voluntary exchange). Minimum 18 months. Students must complete a CAS Project (collaborative, at least one month). They maintain a CAS Portfolio with reflections. The 7 Learning Outcomes must all be evidenced at least once. UAE context: many schools partner with local charities, environmental organisations (beach cleanups, mangrove planting), and cultural institutions. Dubai Cares and Emirates Red Crescent are popular Service partners.`,
    },
  },
};

/**
 * IB Diploma grading — how the 45-point system works
 */
export const IB_GRADING = {
  subjectGrades: '1-7 per subject (7 is highest). 6 subjects × 7 = 42 points maximum from subjects.',
  bonusPoints: 'Up to 3 bonus points from TOK + EE combination (matrix). Total maximum: 45 points.',
  diplomaRequirements: [
    'Minimum 24 points total',
    'Minimum 12 points from HL subjects',
    'Minimum 9 points from SL subjects',
    'No grade 1 in any subject',
    'No more than two grade 2s',
    'No more than three grade 3s or below',
    'TOK and EE both completed (not grade E in both)',
    'CAS requirements met',
    'Academic honesty — no plagiarism',
  ],
  uaeContext: 'UAE universities (AUD, UOWD, Zayed University, Khalifa University, NYU Abu Dhabi, Sorbonne Abu Dhabi) all accept IB Diploma. NYU Abu Dhabi typically requires 36+. Most UAE universities accept 24+ for admission. UK universities: Russell Group typically wants 36-38+ with specific HL grades.',
  gradeBoundaries: {
    7: 'Excellent — approximately 80%+ (varies by subject and session)',
    6: 'Very good — approximately 70-79%',
    5: 'Good — approximately 60-69%',
    4: 'Satisfactory — approximately 50-59%',
    3: 'Mediocre — approximately 40-49%',
    2: 'Poor — approximately 30-39%',
    1: 'Very poor — below 30%',
  },
};

/**
 * IB subject lists for the curriculum selector
 */
export const IB_SUBJECT_LIST = [
  // Group 1
  'English A: Literature', 'English A: Language & Literature',
  'Arabic A: Literature', 'Arabic A: Language & Literature',
  'Urdu A: Literature', 'Hindi A: Literature', 'French A: Literature',
  // Group 2
  'English B', 'Arabic B', 'French B', 'Spanish B', 'Mandarin B',
  'Arabic Ab Initio', 'French Ab Initio', 'Spanish Ab Initio',
  // Group 3
  'Economics', 'Business Management', 'History', 'Geography',
  'Psychology', 'Global Politics', 'ESS', 'Philosophy',
  // Group 4
  'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'Design Technology', 'Sports Science',
  // Group 5
  'Maths AA SL', 'Maths AA HL', 'Maths AI SL', 'Maths AI HL',
  // Group 6
  'Visual Arts', 'Music', 'Theatre', 'Film', 'Dance',
  // Core
  'Theory of Knowledge', 'Extended Essay',
];

/**
 * Get IB-specific prompt for Starky when student is on IB curriculum.
 * Injected into system prompt when uaeCurriculum === 'ib'.
 */
export function getIBDiplomaPrompt(subject) {
  let prompt = `\nIB DIPLOMA PROGRAMME — This student follows the International Baccalaureate curriculum.\n`;

  prompt += `\nIB GRADING: ${IB_GRADING.subjectGrades} ${IB_GRADING.bonusPoints}`;
  prompt += `\nDiploma requires: minimum 24/45 points, no grade 1s, CAS + TOK + EE completed.`;
  prompt += `\n${IB_GRADING.uaeContext}\n`;

  // Add core components
  prompt += `\nTOK: ${IB_SUBJECTS.core.tok.examinerTips.split('.').slice(0, 3).join('.')}.`;
  prompt += `\nEE: ${IB_SUBJECTS.core.ee.examinerTips.split('.').slice(0, 3).join('.')}.`;
  prompt += `\nCAS: ${IB_SUBJECTS.core.cas.guidance.split('.').slice(0, 3).join('.')}.`;

  // Add subject-specific tips if subject matches
  if (subject) {
    const subjectLower = subject.toLowerCase();
    for (const [groupKey, group] of Object.entries(IB_SUBJECTS)) {
      if (groupKey === 'core') continue;
      const match = group.subjects?.find(s =>
        subjectLower.includes(s.name.toLowerCase()) ||
        subjectLower.includes(s.code.replace(/-/g, ' '))
      );
      if (match || group.examinerTips.toLowerCase().includes(subjectLower)) {
        prompt += `\n\n${group.name} EXAMINER TIPS: ${group.examinerTips}`;
        prompt += `\nIA GUIDANCE: ${group.iaGuidance}`;
        break;
      }
    }
  }

  prompt += `\n\nIB TEACHING RULES FOR STARKY:`;
  prompt += `\n- Always clarify SL vs HL — content differs significantly`;
  prompt += `\n- Reference IB command terms precisely: "outline" ≠ "discuss" ≠ "evaluate" ≠ "to what extent"`;
  prompt += `\n- For exam prep: Paper 1 vs Paper 2 vs Paper 3 have different formats per subject`;
  prompt += `\n- IA guidance is critical — many IB students lose marks on IA, not exams`;
  prompt += `\n- Always mention the mark scheme criteria by name when giving feedback`;
  prompt += `\n- TOK connections: when teaching any subject, note potential TOK links`;
  prompt += `\n- UAE context: use Dubai, Abu Dhabi, UAE examples where relevant`;
  prompt += `\n- GDC calculator: for Maths, always mention whether GDC is allowed for that paper`;

  return prompt;
}

/**
 * IB command terms — these have specific meanings in IB exams
 */
export const IB_COMMAND_TERMS = {
  analyse: 'Break down in order to bring out the essential elements or structure',
  annotate: 'Add brief notes to a diagram or graph',
  calculate: 'Obtain a numerical answer showing the relevant stages in the working',
  classify: 'Arrange or order by class or category',
  compare: 'Give an account of the similarities between two (or more) items',
  'compare and contrast': 'Give an account of similarities and differences between two (or more) items',
  construct: 'Display information in a diagrammatic or logical form',
  deduce: 'Reach a conclusion from the information given',
  demonstrate: 'Make clear by reasoning or evidence, illustrating with examples',
  describe: 'Give a detailed account',
  determine: 'Obtain the only possible answer',
  discuss: 'Offer a considered and balanced review that includes a range of arguments',
  distinguish: 'Make clear the differences between two or more concepts or items',
  draw: 'Represent by means of a labelled, accurate diagram or graph',
  estimate: 'Obtain an approximate value',
  evaluate: 'Make an appraisal by weighing up the strengths and limitations',
  examine: 'Consider an argument or concept in a way that uncovers the assumptions and interrelationships',
  explain: 'Give a detailed account including reasons or causes',
  explore: 'Undertake a systematic process of discovery',
  formulate: 'Express precisely and systematically the relevant concept(s) or argument(s)',
  identify: 'Provide an answer from a number of possibilities',
  interpret: 'Use knowledge and understanding to recognize trends and draw conclusions from given information',
  investigate: 'Observe, study, or make a detailed and systematic examination',
  justify: 'Give valid reasons or evidence to support an answer or conclusion',
  label: 'Add labels to a diagram',
  list: 'Give a sequence of brief answers with no explanation',
  outline: 'Give a brief account or summary',
  predict: 'Give an expected result',
  sketch: 'Represent by means of a diagram or graph (without exact precision)',
  state: 'Give a specific name, value or other brief answer without explanation',
  suggest: 'Propose a solution, hypothesis or other possible answer',
  summarize: 'Abstract a general theme or major point(s)',
  'to what extent': 'Consider the merits or otherwise of an argument or concept — requires conclusion',
};

/**
 * Check if a message is about IB-specific content
 */
export function isIBTopic(message) {
  if (!message) return false;
  const lower = message.toLowerCase();
  const triggers = [
    'ib diploma', 'ib programme', 'ib program', 'international baccalaureate',
    'tok', 'theory of knowledge', 'extended essay', 'cas project',
    'ib exam', 'ib hl', 'ib sl', 'ib maths', 'ib physics', 'ib chemistry',
    'ib biology', 'ib economics', 'ib history', 'ib english',
    'maths aa', 'maths ai', 'math aa', 'math ai',
    'ib ia', 'internal assessment ib', 'ib command terms',
    'ib grade boundaries', 'ib points', 'ib 45',
    'group 1', 'group 2', 'group 3', 'group 4', 'group 5', 'group 6',
    'ib paper 1', 'ib paper 2', 'ib paper 3',
  ];
  return triggers.some(t => lower.includes(t));
}
