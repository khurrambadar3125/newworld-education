/**
 * utils/curriculumBooks.js
 * ─────────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH — which books/resources belong to which
 * curriculum, in which country, for which subjects and grades.
 *
 * Problem this solves:
 *   Until now there was NO authoritative mapping. Pages mixed Pakistan
 *   and UAE subject lists, Pakistan Studies/Islamiyat/Urdu leaked into
 *   UAE views, and question-bank seeding used inconsistent book
 *   references.
 *
 * Rules (ABSOLUTE — must be respected by every consumer):
 *   1. UAE curricula MUST NEVER include:
 *        - Pakistan Studies (2059)
 *        - Islamiyat (2058)
 *        - First Language Urdu
 *        - Second Language Urdu
 *      The one exception is `uae-pakistani` (Pakistani expat schools).
 *   2. Cambridge syllabus codes are load-bearing:
 *        4024 Maths O Level, 4037 Add Maths,
 *        5054 Physics, 5070 Chemistry, 5090 Biology,
 *        2059 Pakistan Studies, 2058 Islamiyat, 3248 First Language Urdu.
 *   3. Books listed are real, published books. Where a mapping is
 *      uncertain the entry carries `needsVerification: true`.
 *   4. Every curriculum defines at least Maths / Physics / Chemistry /
 *      Biology / English.
 *
 * Consumers: /nano, /onboarding, seedBank scripts, examCompass,
 * starkyAtomsKB, Starky system prompt, partner demo page.
 */

// ──────────────────────────────────────────────────────────────────
// Shared book sets
// ──────────────────────────────────────────────────────────────────

const SINDH_STBB = (cls) => ({
  publisher: 'Sindh Textbook Board (STBB), Jamshoro',
  official: true,
  note: `Class ${cls} — BSEK / BISE Hyderabad / Sukkur / Larkana / Mirpurkhas`,
});

const FEDERAL_NBF = (cls) => ({
  publisher: 'National Book Foundation (NBF), Islamabad',
  official: true,
  note: `Class ${cls} — FBISE (Federal Board), Islamabad capital territory + Cantt schools`,
});

const CAIE = 'Cambridge Assessment International Education (CAIE)';
const CUP = 'Cambridge University Press';
const OUP = 'Oxford University Press';
const HODDER = 'Hodder Education';
const PEARSON = 'Pearson Education';

// ──────────────────────────────────────────────────────────────────
// Cambridge O Level subject bank (shared by pk- and uae- variants)
// Source of truth for syllabus codes: CAIE syllabus PDFs 2023-2025.
// ──────────────────────────────────────────────────────────────────

const CAMBRIDGE_OLEVEL_SUBJECTS = {
  'Mathematics (4024)': {
    syllabusCode: '4024',
    books: [
      { title: 'Mathematics for Cambridge O Level — Coursebook', publisher: CUP, official: true },
      { title: 'Mathematics for Cambridge O Level', author: 'Audrey Simpson', publisher: CUP },
      { title: 'New Syllabus Mathematics (Books 1-4)', author: 'Dr Yeap Ban Har et al.', publisher: 'Shinglee / OUP' },
      { title: 'Complete Mathematics for Cambridge O Level', author: 'David Rayner', publisher: OUP },
    ],
    pastPapers: 'CAIE 4024 — 1994 to latest series',
  },
  'Additional Mathematics (4037)': {
    syllabusCode: '4037',
    books: [
      { title: 'Additional Mathematics for O Level', author: 'Ho Soo Thong & Khor Nyak Hiong', publisher: 'Shinglee / Panpac' },
      { title: 'Cambridge O Level Additional Mathematics Coursebook', publisher: CUP },
      { title: 'Understanding Additional Mathematics', author: 'C. P. Lee', publisher: OUP },
    ],
    pastPapers: 'CAIE 4037 — 2002 to latest series',
  },
  'Statistics (4040)': {
    syllabusCode: '4040',
    books: [
      { title: 'Cambridge O Level Statistics', author: 'Dean Chalmers', publisher: CUP },
    ],
    pastPapers: 'CAIE 4040',
  },
  'Physics (5054)': {
    syllabusCode: '5054',
    books: [
      { title: 'Cambridge O Level Physics Coursebook', author: 'David Sang', publisher: CUP, official: true },
      { title: 'Complete Physics for Cambridge O Level', author: 'Stephen Pople', publisher: OUP },
      { title: 'Physics Matters for GCE O Level', author: 'Charles Chew', publisher: 'Marshall Cavendish' },
    ],
    pastPapers: 'CAIE 5054 — 1994 to latest series',
  },
  'Chemistry (5070)': {
    syllabusCode: '5070',
    books: [
      { title: 'Cambridge O Level Chemistry Coursebook', author: 'Roger Norris & Bryan Earl', publisher: CUP, official: true },
      { title: 'Complete Chemistry for Cambridge O Level', author: 'RoseMarie Gallagher & Paul Ingram', publisher: OUP },
      { title: 'Chemistry Matters for GCE O Level', author: 'Tan Yin Toon', publisher: 'Marshall Cavendish' },
    ],
    pastPapers: 'CAIE 5070 — 1994 to latest series',
  },
  'Biology (5090)': {
    syllabusCode: '5090',
    books: [
      { title: 'Cambridge O Level Biology Coursebook', author: 'Mary Jones & Geoff Jones', publisher: CUP, official: true },
      { title: 'Complete Biology for Cambridge O Level', author: 'Ron Pickering', publisher: OUP },
    ],
    pastPapers: 'CAIE 5090',
  },
  'Combined Science (5129)': {
    syllabusCode: '5129',
    books: [
      { title: 'Cambridge O Level Combined Science', publisher: CUP, needsVerification: true },
    ],
    pastPapers: 'CAIE 5129',
  },
  'English Language (1123)': {
    syllabusCode: '1123',
    books: [
      { title: 'Cambridge O Level English Language Coursebook', author: 'John Reynolds', publisher: CUP, official: true },
      { title: 'Oxford English for Cambridge O Level', author: 'Rachel Redford', publisher: OUP },
    ],
    pastPapers: 'CAIE 1123',
  },
  'Literature in English (2010)': {
    syllabusCode: '2010',
    books: [
      { title: 'Cambridge O Level Literature in English', publisher: CUP },
      { title: 'Set texts — as per current CAIE prescription', publisher: 'Various', needsVerification: true },
    ],
    pastPapers: 'CAIE 2010',
  },
  'Computer Science (2210)': {
    syllabusCode: '2210',
    books: [
      { title: 'Cambridge IGCSE and O Level Computer Science Coursebook', author: 'David Watson & Helen Williams', publisher: CUP, official: true },
      { title: 'Computer Science for Cambridge IGCSE & O Level', author: 'Sarah Lawrey', publisher: HODDER },
    ],
    pastPapers: 'CAIE 2210',
  },
  'Economics (2281)': {
    syllabusCode: '2281',
    books: [
      { title: 'Cambridge O Level Economics Coursebook', author: 'Susan Grant', publisher: CUP, official: true },
    ],
    pastPapers: 'CAIE 2281',
  },
  'Business Studies (7115)': {
    syllabusCode: '7115',
    books: [
      { title: 'Cambridge O Level Business Studies', author: 'Karen Borrington & Peter Stimpson', publisher: HODDER },
    ],
    pastPapers: 'CAIE 7115',
  },
  'Accounting (7707)': {
    syllabusCode: '7707',
    books: [
      { title: 'Cambridge O Level Principles of Accounts', author: 'Catherine Coucom', publisher: CUP, official: true },
    ],
    pastPapers: 'CAIE 7707',
  },
  'Sociology (2251)': {
    syllabusCode: '2251',
    books: [
      { title: 'Cambridge O Level Sociology', author: 'Jonathan Blundell', publisher: CUP },
    ],
    pastPapers: 'CAIE 2251',
  },
  'Environmental Management (5014)': {
    syllabusCode: '5014',
    books: [
      { title: 'Cambridge O Level Environmental Management', author: 'Muriel Fretwell & Rachel Kingham', publisher: CUP },
    ],
    pastPapers: 'CAIE 5014',
  },
};

// Pakistan-only Cambridge O Level subjects
const CAMBRIDGE_OLEVEL_PK_ONLY = {
  'Pakistan Studies (2059)': {
    syllabusCode: '2059',
    books: [
      { title: 'The History and Culture of Pakistan', author: 'Nigel Kelly', publisher: 'Peak Publishing', official: true },
      { title: 'The Environment of Pakistan', author: 'Huma Naz Sethi', publisher: OUP, official: true },
    ],
    pastPapers: 'CAIE 2059',
  },
  'Islamiyat (2058)': {
    syllabusCode: '2058',
    books: [
      { title: 'Islamiyat for Students', author: 'Farkhanda Noor Muhammad', publisher: 'Ferozsons', official: true },
      { title: 'A Textbook of Islamiyat for O Level', author: 'Mokhtar Wafi', publisher: OUP },
    ],
    pastPapers: 'CAIE 2058',
  },
  'First Language Urdu (3248)': {
    syllabusCode: '3248',
    books: [
      { title: 'First Language Urdu — CAIE set texts and grammar', publisher: 'Various', needsVerification: true },
    ],
    pastPapers: 'CAIE 3248',
  },
  'Second Language Urdu (3247)': {
    syllabusCode: '3247',
    books: [
      { title: 'Second Language Urdu Coursebook', publisher: OUP, needsVerification: true },
    ],
    pastPapers: 'CAIE 3247',
  },
};

// Cambridge A Level subject bank
const CAMBRIDGE_ALEVEL_SUBJECTS = {
  'Mathematics (9709)': {
    syllabusCode: '9709',
    books: [
      { title: 'Cambridge International AS & A Level Mathematics: Pure Mathematics 1 & 2-3', publisher: CUP, official: true },
      { title: 'Cambridge International AS & A Level Mathematics: Mechanics / Probability & Statistics', publisher: CUP, official: true },
    ],
    pastPapers: 'CAIE 9709',
  },
  'Further Mathematics (9231)': {
    syllabusCode: '9231',
    books: [
      { title: 'Cambridge International AS & A Level Further Mathematics Coursebook', publisher: CUP },
    ],
    pastPapers: 'CAIE 9231',
  },
  'Physics (9702)': {
    syllabusCode: '9702',
    books: [
      { title: 'Cambridge International AS & A Level Physics Coursebook', author: 'David Sang, Graham Jones et al.', publisher: CUP, official: true },
    ],
    pastPapers: 'CAIE 9702',
  },
  'Chemistry (9701)': {
    syllabusCode: '9701',
    books: [
      { title: 'Cambridge International AS & A Level Chemistry Coursebook', author: 'Lawrie Ryan & Roger Norris', publisher: CUP, official: true },
    ],
    pastPapers: 'CAIE 9701',
  },
  'Biology (9700)': {
    syllabusCode: '9700',
    books: [
      { title: 'Cambridge International AS & A Level Biology Coursebook', author: 'Mary Jones, Richard Fosbery et al.', publisher: CUP, official: true },
    ],
    pastPapers: 'CAIE 9700',
  },
  'English Language (9093)': {
    syllabusCode: '9093',
    books: [
      { title: 'Cambridge International AS & A Level English Language Coursebook', publisher: CUP },
    ],
    pastPapers: 'CAIE 9093',
  },
  'Literature in English (9695)': {
    syllabusCode: '9695',
    books: [
      { title: 'Cambridge International AS & A Level Literature in English', publisher: CUP },
    ],
    pastPapers: 'CAIE 9695',
  },
  'Economics (9708)': {
    syllabusCode: '9708',
    books: [
      { title: 'Cambridge International AS & A Level Economics Coursebook', author: 'Colin Bamford & Susan Grant', publisher: CUP, official: true },
    ],
    pastPapers: 'CAIE 9708',
  },
  'Business (9609)': {
    syllabusCode: '9609',
    books: [
      { title: 'Cambridge International AS & A Level Business Coursebook', author: 'Peter Stimpson & Alastair Farquharson', publisher: CUP },
    ],
    pastPapers: 'CAIE 9609',
  },
  'Accounting (9706)': {
    syllabusCode: '9706',
    books: [
      { title: 'Cambridge International AS & A Level Accounting', author: 'Ian Harrison', publisher: HODDER },
    ],
    pastPapers: 'CAIE 9706',
  },
  'Computer Science (9618)': {
    syllabusCode: '9618',
    books: [
      { title: 'Cambridge International AS & A Level Computer Science Coursebook', author: 'Sylvia Langfield & Dave Duddell', publisher: CUP, official: true },
    ],
    pastPapers: 'CAIE 9618',
  },
  'Psychology (9990)': {
    syllabusCode: '9990',
    books: [
      { title: 'Cambridge International AS & A Level Psychology Coursebook', author: 'Julia Russell', publisher: CUP },
    ],
    pastPapers: 'CAIE 9990',
  },
  'General Paper (8021)': {
    syllabusCode: '8021',
    books: [
      { title: 'Cambridge International AS Level English General Paper Coursebook', publisher: CUP },
    ],
    pastPapers: 'CAIE 8021',
  },
};

// Edexcel IGCSE subject bank
const EDEXCEL_IGCSE_SUBJECTS = {
  'Mathematics A (4MA1)': {
    syllabusCode: '4MA1',
    books: [
      { title: 'Pearson Edexcel International GCSE (9-1) Mathematics A Student Book 1 & 2', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel 4MA1 — Jan 2011 to latest series',
    topics: ['Number', 'Algebra', 'Sequences, functions and graphs', 'Geometry', 'Vectors and transformation geometry', 'Statistics', 'Probability'],
  },
  'Mathematics B (4MB1)': {
    syllabusCode: '4MB1',
    books: [
      { title: 'Pearson Edexcel International GCSE (9-1) Mathematics B Student Book', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel 4MB1 — alternative linear maths route',
    topics: ['Number', 'Algebra', 'Functions and graphs', 'Calculus (introductory)', 'Matrices', 'Geometry and trigonometry', 'Vectors', 'Statistics', 'Probability'],
    needsVerification: true,
    verificationNote: 'Confirm Mathematics B still offered under 4MB1 code and Pearson publishes a dedicated student book.',
  },
  'Further Pure Mathematics (4PM1)': {
    syllabusCode: '4PM1',
    books: [
      { title: 'Pearson Edexcel International GCSE Further Pure Mathematics', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4PM1',
    topics: ['Logarithmic functions and indices', 'Trigonometry', 'The quadratic function', 'Identities and inequalities', 'Graphs', 'Series', 'Binomial series', 'Scalar and vector quantities', 'Rectangular Cartesian coordinates', 'Calculus'],
  },
  'Physics (4PH1)': {
    syllabusCode: '4PH1',
    books: [
      { title: 'Edexcel International GCSE (9-1) Physics Student Book', author: 'Brian Arnold, Penny Johnson, Steve Woolley', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel 4PH1',
    topics: ['Forces and motion', 'Electricity', 'Waves', 'Energy resources and energy transfers', 'Solids, liquids and gases', 'Magnetism and electromagnetism', 'Radioactivity and particles', 'Astrophysics'],
  },
  'Chemistry (4CH1)': {
    syllabusCode: '4CH1',
    books: [
      { title: 'Edexcel International GCSE (9-1) Chemistry Student Book', author: 'Jim Clark', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel 4CH1',
    topics: ['Principles of chemistry', 'Inorganic chemistry', 'Physical chemistry', 'Organic chemistry'],
  },
  'Biology (4BI1)': {
    syllabusCode: '4BI1',
    books: [
      { title: 'Edexcel International GCSE (9-1) Biology Student Book', author: 'Erica Larkcom, Philip Bradfield', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel 4BI1',
    topics: ['The nature and variety of living organisms', 'Structures and functions in living organisms', 'Reproduction and inheritance', 'Ecology and the environment', 'Use of biological resources'],
  },
  'Human Biology (4HB1)': {
    syllabusCode: '4HB1',
    books: [
      { title: 'Pearson Edexcel International GCSE (9-1) Human Biology Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4HB1',
    topics: ['The nature of human beings and other living organisms', 'Structures and functions in human beings', 'Reproduction and inheritance in humans', 'Humans and their environment', 'Use of biological resources'],
    needsVerification: true,
    verificationNote: 'Human Biology 4HB1 — confirm current spec + student book ISBN.',
  },
  'Combined Science (Double Award) (4SD0)': {
    syllabusCode: '4SD0',
    books: [
      { title: 'Pearson Edexcel International GCSE (9-1) Science (Double Award) Student Book 1 & 2', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel 4SD0 (Double Award) / legacy 4SC0',
    topics: ['Biology: organisms, structure and function, reproduction, ecology, use of biological resources', 'Chemistry: principles, inorganic, physical, organic chemistry', 'Physics: forces and motion, electricity, waves, energy, solids/liquids/gases, magnetism, radioactivity'],
  },
  'English Language A (4EA1)': {
    syllabusCode: '4EA1',
    books: [
      { title: 'Edexcel International GCSE (9-1) English Language A Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4EA1',
    topics: ['Non-fiction texts (Anthology)', 'Reading and analysis', 'Transactional writing', 'Imaginative writing', 'Spoken language (coursework endorsement)'],
  },
  'English Literature (4ET1)': {
    syllabusCode: '4ET1',
    books: [
      { title: 'Edexcel International GCSE (9-1) English Literature Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4ET1',
    topics: ['Poetry and Modern Prose (Anthology)', 'Modern Drama', 'Literary Heritage Texts', 'Unseen Poetry'],
  },
  'ICT (4IT1)': {
    syllabusCode: '4IT1',
    books: [
      { title: 'Edexcel International GCSE ICT Student Book', author: 'Roger Crawford', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4IT1',
    topics: ['Digital devices', 'Connectivity', 'Operating online', 'Online goods and services', 'Applying information and communication technology', 'Software skills'],
  },
  'Computer Science (4CP0)': {
    syllabusCode: '4CP0',
    books: [
      { title: 'Pearson Edexcel International GCSE (9-1) Computer Science Student Book', author: 'David Waller', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4CP0',
    topics: ['Computational thinking', 'Data', 'Computers', 'Communication and the internet', 'The bigger picture (ethical, legal, environmental)', 'Problem solving with programming'],
    needsVerification: true,
    verificationNote: 'Confirm current Pearson Computer Science iGCSE code (4CP0 vs legacy 4CN0/4CS0) and student book author.',
  },
  'Geography (4GE1)': {
    syllabusCode: '4GE1',
    books: [
      { title: 'Pearson Edexcel International GCSE (9-1) Geography Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4GE1',
    topics: ['Physical Geography: river environments, coastal environments, hazardous environments', 'Human Geography: economic activity and energy, rural and urban environments, global issues', 'Geographical investigations and fieldwork'],
  },
  'History (4HI1)': {
    syllabusCode: '4HI1',
    books: [
      { title: 'Pearson Edexcel International GCSE (9-1) History Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4HI1',
    topics: ['Depth studies (e.g. Germany 1918-45, USA 1918-41, USSR 1924-53)', 'Breadth studies / investigations', 'Source analysis and interpretation'],
  },
  'Accounting (4AC1)': {
    syllabusCode: '4AC1',
    books: [
      { title: 'Pearson Edexcel International GCSE (9-1) Accounting Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4AC1',
    topics: ['The accounting system (double entry, ledgers, trial balance)', 'Control systems (bank reconciliations, control accounts, suspense accounts)', 'Preparing financial statements', 'Accounting concepts and decision making', 'Partnerships and limited companies', 'Analysis and communication of accounting information'],
  },
  'Commerce (4CM1)': {
    syllabusCode: '4CM1',
    books: [
      { title: 'Pearson Edexcel International GCSE Commerce Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4CM1',
    topics: ['Commerce in context', 'Production', 'Trade', 'Aids to trade (banking, insurance, transport, communications, warehousing, advertising)', 'Consumer protection'],
    needsVerification: true,
    verificationNote: 'Confirm Pearson currently publishes a dedicated Commerce student book under 4CM1.',
  },
  'Arabic (First Language) (4AA1)': {
    syllabusCode: '4AA1',
    books: [
      { title: 'Pearson Edexcel International GCSE (9-1) Arabic (First Language) resources', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4AA1',
    topics: ['Reading comprehension (literary and non-literary Arabic texts)', 'Writing (transactional and creative)', 'Arabic literature (set texts and poetry)', 'Grammar and linguistic analysis'],
    needsVerification: true,
    verificationNote: 'Arabic First Language — official Pearson student book title may differ; often delivered via endorsed third-party Arabic publishers.',
  },
  'Arabic (Second Language) (4AR1)': {
    syllabusCode: '4AR1',
    books: [
      { title: 'Pearson Edexcel International GCSE (9-1) Arabic (Second Language) resources', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4AR1',
    topics: ['Listening', 'Reading', 'Writing', 'Speaking (endorsement)', 'Topic areas: home and abroad, education and employment, personal life and relationships, the world around us, social activities, fitness and health'],
    needsVerification: true,
    verificationNote: 'Arabic Second Language 4AR1 — verify endorsed student book availability.',
  },
  'French (4FR1)': {
    syllabusCode: '4FR1',
    books: [
      { title: 'Pearson Edexcel International GCSE (9-1) French Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4FR1',
    topics: ['Home and abroad', 'Education and employment', 'Personal life and relationships', 'The world around us', 'Social activities, fitness and health'],
  },
  'Spanish (4SP1)': {
    syllabusCode: '4SP1',
    books: [
      { title: 'Pearson Edexcel International GCSE (9-1) Spanish Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4SP1',
    topics: ['Home and abroad', 'Education and employment', 'Personal life and relationships', 'The world around us', 'Social activities, fitness and health'],
  },
  'Urdu (4UR0)': {
    syllabusCode: '4UR0',
    books: [
      { title: 'Pearson Edexcel International GCSE Urdu resources (endorsed)', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4UR0',
    topics: ['Reading comprehension (Urdu literary and non-literary texts)', 'Writing in Urdu (transactional and creative)', 'Translation', 'Urdu literature and grammar'],
    audience: 'For expat Pakistani families in UAE only — not part of the standard UAE British curriculum offer.',
    needsVerification: true,
    verificationNote: 'Confirm 4UR0 still available (Pearson periodically withdraws minority-language iGCSEs) and current student book.',
  },
  'Religious Studies (4RS1)': {
    syllabusCode: '4RS1',
    books: [
      { title: 'Pearson Edexcel International GCSE (9-1) Religious Studies Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4RS1',
    topics: ['Beliefs and values', 'The role of religion in the lives of adherents today', 'The role of religion in society and global issues (two religions studied from: Christianity, Islam, Judaism, Hinduism, Sikhism, Buddhism)'],
    needsVerification: true,
    verificationNote: 'Verify current 4RS1 spec structure (religions offered may have changed).',
  },
  'Physical Education (4PE1)': {
    syllabusCode: '4PE1',
    books: [
      { title: 'Pearson Edexcel International GCSE (9-1) Physical Education Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4PE1',
    topics: ['Fitness and body systems', 'Health and performance', 'Practical performance (coursework)', 'Personal Exercise Programme (coursework)'],
  },
  'Economics (4EC1)': {
    syllabusCode: '4EC1',
    books: [
      { title: 'Edexcel International GCSE (9-1) Economics Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4EC1',
    topics: ['The market system', 'Business economics', 'Government and the economy', 'The global economy'],
  },
  'Business (4BS1)': {
    syllabusCode: '4BS1',
    books: [
      { title: 'Edexcel International GCSE (9-1) Business Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4BS1',
    topics: ['Business activity and influences on business', 'People in business', 'Business finance', 'Marketing', 'Business operations'],
  },
};

// Edexcel International Advanced Level (IAL) subject bank
// IAL is modular: AS = Units 1-3, A2 = Units 4-6. Used widely in UAE British schools post-16.
const EDEXCEL_IAL_SUBJECTS = {
  'Mathematics (WMA11-WMA14, WFM01-WFM02, WST01-WST03, WDM11, WME01)': {
    syllabusCode: 'WMA / WFM / WST / WME / WDM (modular)',
    books: [
      { title: 'Pearson Edexcel International A Level Mathematics Pure Mathematics 1 Student Book', publisher: PEARSON, official: true },
      { title: 'Pearson Edexcel International A Level Mathematics Pure Mathematics 2 Student Book', publisher: PEARSON, official: true },
      { title: 'Pearson Edexcel International A Level Mathematics Pure Mathematics 3 Student Book', publisher: PEARSON, official: true },
      { title: 'Pearson Edexcel International A Level Mathematics Pure Mathematics 4 Student Book', publisher: PEARSON, official: true },
      { title: 'Pearson Edexcel International A Level Mathematics Mechanics 1 Student Book', publisher: PEARSON, official: true },
      { title: 'Pearson Edexcel International A Level Mathematics Mechanics 2 Student Book', publisher: PEARSON, official: true },
      { title: 'Pearson Edexcel International A Level Mathematics Statistics 1 Student Book', publisher: PEARSON, official: true },
      { title: 'Pearson Edexcel International A Level Mathematics Statistics 2 Student Book', publisher: PEARSON, official: true },
      { title: 'Pearson Edexcel International A Level Mathematics Decision Mathematics 1 Student Book', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel IAL WMA / WFM / WST / WME / WDM — Jan 2014 to latest series',
    units: {
      AS: ['P1 (WMA11)', 'P2 (WMA12)', 'M1 (WME01)', 'S1 (WST01)', 'D1 (WDM11)', 'FP1 (WFM01)'],
      A2: ['P3 (WMA13)', 'P4 (WMA14)', 'M2 (WME02)', 'S2 (WST02)', 'S3 (WST03)', 'FP2 (WFM02)', 'FP3 (WFM03)', 'D2 (WDM12)'],
    },
    topics: ['Pure Mathematics (algebra, functions, trigonometry, calculus, series, vectors, numerical methods)', 'Mechanics (kinematics, forces, moments, energy, momentum, projectiles)', 'Statistics (probability, distributions, hypothesis testing, correlation and regression)', 'Decision Mathematics (algorithms, graph theory, linear programming)'],
  },
  'Further Mathematics': {
    syllabusCode: 'WFM01-WFM03 + additional applied units',
    books: [
      { title: 'Pearson Edexcel International A Level Further Pure Mathematics 1 Student Book', publisher: PEARSON, official: true },
      { title: 'Pearson Edexcel International A Level Further Pure Mathematics 2 Student Book', publisher: PEARSON, official: true },
      { title: 'Pearson Edexcel International A Level Further Pure Mathematics 3 Student Book', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel IAL WFM01-WFM03 plus applied units',
    units: {
      AS: ['FP1 (WFM01)', 'plus two additional applied units'],
      A2: ['FP2 (WFM02)', 'FP3 (WFM03)', 'plus applied units (M2/M3, S2/S3, D1/D2)'],
    },
    topics: ['Further pure algebra and proof', 'Complex numbers', 'Matrices', 'Series', 'Polar coordinates', 'Hyperbolic functions', 'Differential equations', 'Vectors'],
  },
  'Physics (WPH11-WPH14)': {
    syllabusCode: 'WPH11, WPH12, WPH13 (AS) / WPH14, WPH15, WPH16 (A2)',
    books: [
      { title: 'Pearson Edexcel International A Level Physics Student Book 1', publisher: PEARSON, official: true },
      { title: 'Pearson Edexcel International A Level Physics Student Book 2', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel IAL WPH11-WPH16 — Jan 2014 to latest series',
    units: {
      AS: ['Unit 1: Mechanics and Materials (WPH11)', 'Unit 2: Waves and Electricity (WPH12)', 'Unit 3: Practical Skills in Physics I (WPH13)'],
      A2: ['Unit 4: Further Mechanics, Fields and Particles (WPH14)', 'Unit 5: Thermodynamics, Radiation, Oscillations and Cosmology (WPH15)', 'Unit 6: Practical Skills in Physics II (WPH16)'],
    },
    topics: ['Mechanics and Materials', 'Waves and Electricity', 'Practical Skills in Physics I', 'Further Mechanics, Fields and Particles', 'Thermodynamics, Radiation, Oscillations and Cosmology', 'Practical Skills in Physics II'],
    needsVerification: true,
    verificationNote: 'Current IAL Physics uses WPH11-WPH16 (6 units). Prompt brief listed WPH11-WPH14 only — code range corrected.',
  },
  'Chemistry (WCH11-WCH14)': {
    syllabusCode: 'WCH11, WCH12, WCH13 (AS) / WCH14, WCH15, WCH16 (A2)',
    books: [
      { title: 'Pearson Edexcel International A Level Chemistry Student Book 1', publisher: PEARSON, official: true },
      { title: 'Pearson Edexcel International A Level Chemistry Student Book 2', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel IAL WCH11-WCH16 — Jan 2014 to latest series',
    units: {
      AS: ['Unit 1: Structure, Bonding and Introduction to Organic Chemistry (WCH11)', 'Unit 2: Energetics, Group Chemistry, Halogenoalkanes and Alcohols (WCH12)', 'Unit 3: Practical Skills in Chemistry I (WCH13)'],
      A2: ['Unit 4: Rates, Equilibria and Further Organic Chemistry (WCH14)', 'Unit 5: Transition Metals and Organic Nitrogen Chemistry (WCH15)', 'Unit 6: Practical Skills in Chemistry II (WCH16)'],
    },
    topics: ['Structure, Bonding and Introduction to Organic Chemistry', 'Energetics, Group Chemistry, Halogenoalkanes and Alcohols', 'Practical Skills in Chemistry I', 'Rates, Equilibria and Further Organic Chemistry', 'Transition Metals and Organic Nitrogen Chemistry', 'Practical Skills in Chemistry II'],
    needsVerification: true,
    verificationNote: 'Current IAL Chemistry uses WCH11-WCH16. Prompt brief listed WCH11-WCH14 only.',
  },
  'Biology (WBI11-WBI14)': {
    syllabusCode: 'WBI11, WBI12, WBI13 (AS) / WBI14, WBI15, WBI16 (A2)',
    books: [
      { title: 'Pearson Edexcel International A Level Biology Student Book 1', publisher: PEARSON, official: true },
      { title: 'Pearson Edexcel International A Level Biology Student Book 2', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel IAL WBI11-WBI16 — Jan 2014 to latest series',
    units: {
      AS: ['Unit 1: Molecules, Diet, Transport and Health (WBI11)', 'Unit 2: Cells, Development, Biodiversity and Conservation (WBI12)', 'Unit 3: Practical Skills in Biology I (WBI13)'],
      A2: ['Unit 4: Energy, Environment, Microbiology and Immunity (WBI14)', 'Unit 5: Respiration, Internal Environment, Coordination and Gene Technology (WBI15)', 'Unit 6: Practical Skills in Biology II (WBI16)'],
    },
    topics: ['Molecules, Diet, Transport and Health', 'Cells, Development, Biodiversity and Conservation', 'Practical Skills in Biology I', 'Energy, Environment, Microbiology and Immunity', 'Respiration, Internal Environment, Coordination and Gene Technology', 'Practical Skills in Biology II'],
    needsVerification: true,
    verificationNote: 'Current IAL Biology uses WBI11-WBI16. Prompt brief listed WBI11-WBI14 only.',
  },
  'English Language (WEN01-WEN02)': {
    syllabusCode: 'WEN01 (AS) / WEN02 (A2)',
    books: [
      { title: 'Pearson Edexcel International A Level English Language Student Book', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel IAL WEN01-WEN02',
    units: {
      AS: ['Unit 1: Language: Context and Identity (WEN01)'],
      A2: ['Unit 2: Language in Transition (WEN02)'],
    },
    topics: ['Language and context', 'Identity and representation', 'Language change over time', 'Spoken and written modes', 'Directed writing'],
  },
  'English Literature (WET01-WET04)': {
    syllabusCode: 'WET01, WET02 (AS) / WET03, WET04 (A2)',
    books: [
      { title: 'Pearson Edexcel International A Level English Literature Student Book', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel IAL WET01-WET04',
    units: {
      AS: ['Unit 1: Poetry and Prose (WET01)', 'Unit 2: Drama (WET02)'],
      A2: ['Unit 3: Shakespeare and Pre-20th Century Texts (WET03)', 'Unit 4: Literary Genres (Coursework) (WET04)'],
    },
    topics: ['Poetry (set anthology and wider reading)', 'Prose fiction', 'Drama and Shakespeare', 'Literary genres and contexts', 'Critical reading and unseen analysis'],
  },
  'Economics (WEC11-WEC14)': {
    syllabusCode: 'WEC11, WEC12 (AS) / WEC13, WEC14 (A2)',
    books: [
      { title: 'Pearson Edexcel International A Level Economics Student Book 1', publisher: PEARSON, official: true },
      { title: 'Pearson Edexcel International A Level Economics Student Book 2', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel IAL WEC11-WEC14',
    units: {
      AS: ['Unit 1: Markets in Action (WEC11)', 'Unit 2: Macroeconomic Performance and Policy (WEC12)'],
      A2: ['Unit 3: Business Behaviour (WEC13)', 'Unit 4: Developments in the Global Economy (WEC14)'],
    },
    topics: ['Markets in Action (microeconomics)', 'Macroeconomic Performance and Policy', 'Business Behaviour (firms, market structures)', 'Developments in the Global Economy (trade, development, financial markets)'],
  },
  'Accounting (WAC11-WAC12)': {
    syllabusCode: 'WAC11 (AS) / WAC12 (A2)',
    books: [
      { title: 'Pearson Edexcel International A Level Accounting Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel IAL WAC11-WAC12',
    units: {
      AS: ['Unit 1: The Accounting System and Costing (WAC11)'],
      A2: ['Unit 2: Corporate and Management Accounting (WAC12)'],
    },
    topics: ['The accounting system and double entry', 'Financial statements for sole traders and partnerships', 'Introduction to costing', 'Limited company accounts', 'Management accounting and decision making', 'Budgets and standard costing'],
    needsVerification: true,
    verificationNote: 'Confirm IAL Accounting currently a 2-unit qualification and Pearson student book ISBN.',
  },
  'Business (WBS11-WBS14)': {
    syllabusCode: 'WBS11, WBS12 (AS) / WBS13, WBS14 (A2)',
    books: [
      { title: 'Pearson Edexcel International A Level Business Student Book 1', publisher: PEARSON, official: true },
      { title: 'Pearson Edexcel International A Level Business Student Book 2', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel IAL WBS11-WBS14',
    units: {
      AS: ['Unit 1: Business and its Environment (WBS11)', 'Unit 2: Managing Business Activities (WBS12)'],
      A2: ['Unit 3: Business Decisions and Strategy (WBS13)', 'Unit 4: Global Business (WBS14)'],
    },
    topics: ['Business and its environment', 'Managing business activities (finance, operations, marketing, HR)', 'Business decisions and strategy', 'Global business and international trade'],
  },
  'Geography (WGE01-WGE04)': {
    syllabusCode: 'WGE01, WGE02 (AS) / WGE03, WGE04 (A2)',
    books: [
      { title: 'Pearson Edexcel International A Level Geography Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel IAL WGE01-WGE04',
    units: {
      AS: ['Unit 1: Global Challenges (WGE01)', 'Unit 2: Geographical Investigations (WGE02)'],
      A2: ['Unit 3: Contested Planet (WGE03)', 'Unit 4: Geographical Research (WGE04)'],
    },
    topics: ['Global challenges (climate, population)', 'Geographical investigations and fieldwork', 'Contested planet (energy, water, biodiversity)', 'Geographical research (synoptic)'],
    needsVerification: true,
    verificationNote: 'Confirm IAL Geography still offered under WGE codes — some IAL humanities are periodically withdrawn.',
  },
  'History (WHI01-WHI04)': {
    syllabusCode: 'WHI01, WHI02 (AS) / WHI03, WHI04 (A2)',
    books: [
      { title: 'Pearson Edexcel International A Level History Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel IAL WHI01-WHI04',
    units: {
      AS: ['Unit 1: Depth Study with interpretations (WHI01)', 'Unit 2: Breadth Study with source evaluation (WHI02)'],
      A2: ['Unit 3: Thematic study (WHI03)', 'Unit 4: International study in breadth (WHI04)'],
    },
    topics: ['Depth studies (e.g. Russia, Germany, USA)', 'Breadth studies', 'Source evaluation and historical interpretations', 'Thematic and international studies'],
    needsVerification: true,
    verificationNote: 'Confirm current IAL History unit codes and topic options.',
  },
  'Psychology (WPS01-WPS04)': {
    syllabusCode: 'WPS01, WPS02 (AS) / WPS03, WPS04 (A2)',
    books: [
      { title: 'Pearson Edexcel International A Level Psychology Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel IAL WPS01-WPS04',
    units: {
      AS: ['Unit 1: Foundations in Psychology (WPS01)', 'Unit 2: Applications of Psychology (WPS02)'],
      A2: ['Unit 3: Health Psychology (WPS03)', 'Unit 4: Clinical Psychology and Psychological Skills (WPS04)'],
    },
    topics: ['Foundations: social, cognitive, biological, learning approaches', 'Applications: criminological, child, health psychology', 'Health and clinical psychology', 'Research methods and psychological skills'],
    needsVerification: true,
    verificationNote: 'Verify current IAL Psychology unit structure.',
  },
  'Information Technology (WIT11-WIT13)': {
    syllabusCode: 'WIT11, WIT12 (AS) / WIT13 (A2)',
    books: [
      { title: 'Pearson Edexcel International A Level Information Technology Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel IAL WIT11-WIT13',
    units: {
      AS: ['Unit 1: IT Systems (WIT11)', 'Unit 2: IT in Organisations (WIT12)'],
      A2: ['Unit 3: IT Project Management and Problem Solving (WIT13)'],
    },
    topics: ['IT systems, hardware and software', 'Networks and data', 'IT in organisations', 'Project management', 'Problem solving with IT'],
    needsVerification: true,
    verificationNote: 'Confirm IAL IT is currently offered as WIT11-WIT13 (some IAL IT specs have been restructured).',
  },
  'Arabic (WAR01-WAR04)': {
    syllabusCode: 'WAR01, WAR02 (AS) / WAR03, WAR04 (A2)',
    books: [
      { title: 'Pearson Edexcel International A Level Arabic resources (endorsed)', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel IAL WAR01-WAR04',
    units: {
      AS: ['Unit 1: Spoken Expression and Response in Arabic (WAR01)', 'Unit 2: Understanding and Written Response in Arabic (WAR02)'],
      A2: ['Unit 3: Understanding and Spoken Response in Arabic (WAR03)', 'Unit 4: Research, Understanding and Written Response in Arabic (WAR04)'],
    },
    topics: ['Spoken and written Arabic', 'Arab society and culture', 'Literature, media and the arts in the Arab world', 'Research-based essay in Arabic'],
    needsVerification: true,
    verificationNote: 'Verify current IAL Arabic unit codes/structure — endorsed resources typically from third-party Arabic publishers.',
  },
};

// Helper — strip Pakistan-specific subjects
function withoutPakistanSubjects(subjectsMap) {
  const clone = { ...subjectsMap };
  delete clone['Pakistan Studies (2059)'];
  delete clone['Islamiyat (2058)'];
  delete clone['First Language Urdu (3248)'];
  delete clone['Second Language Urdu (3247)'];
  return clone;
}

// ──────────────────────────────────────────────────────────────────
// CURRICULUM_BOOKS — the exported map
// ──────────────────────────────────────────────────────────────────

export const CURRICULUM_BOOKS = {

  // ═══════════════ PAKISTAN ═══════════════

  'pk-sindh-board': {
    country: 'Pakistan',
    label: 'Sindh Board (BSEK / BISE Hyderabad / Sukkur / Larkana / Mirpurkhas)',
    grades: ['grade1','grade2','grade3','grade4','grade5','grade6','grade7','grade8','grade9','grade10'],
    medium: ['English', 'Urdu', 'Sindhi'],
    subjects: {
      'Mathematics': {
        grades: ['grade6','grade7','grade8','grade9','grade10'],
        books: [
          { title: 'Mathematics for Class IX (Science Group)', ...SINDH_STBB('IX') },
          { title: 'Mathematics for Class X (Science Group)', ...SINDH_STBB('X') },
          { title: 'General Mathematics for Class IX-X (Arts Group)', ...SINDH_STBB('IX-X') },
        ],
        pastPapers: 'BSEK Karachi 2010-2024',
      },
      'Physics': {
        grades: ['grade9','grade10'],
        books: [{ title: 'A Text Book of Physics for Class IX-X', ...SINDH_STBB('IX-X'), publisher: 'Royal Corporation / STBB' }],
        pastPapers: 'BSEK Karachi 2010-2024',
      },
      'Chemistry': {
        grades: ['grade9','grade10'],
        books: [{ title: 'Chemistry for Class IX-X', ...SINDH_STBB('IX-X') }],
        pastPapers: 'BSEK Karachi 2010-2024',
      },
      'Biology': {
        grades: ['grade9','grade10'],
        books: [{ title: 'Biology for Class IX-X', ...SINDH_STBB('IX-X') }],
        pastPapers: 'BSEK Karachi 2010-2024',
      },
      'English': {
        grades: ['grade1','grade2','grade3','grade4','grade5','grade6','grade7','grade8','grade9','grade10'],
        books: [{ title: 'English Textbook (per class)', ...SINDH_STBB('I-X') }],
        pastPapers: 'BSEK Karachi 2010-2024',
      },
      'Urdu': { books: [{ title: 'Urdu Textbook (per class)', ...SINDH_STBB('I-X') }] },
      'Sindhi': { books: [{ title: 'Sindhi Textbook (per class)', ...SINDH_STBB('I-X') }] },
      'Islamiat': { books: [{ title: 'Islamiat Textbook (per class)', ...SINDH_STBB('I-X') }] },
      'Pakistan Studies': { grades: ['grade9','grade10'], books: [{ title: 'Pakistan Studies for Class IX-X', ...SINDH_STBB('IX-X') }] },
      'Computer Science': { grades: ['grade9','grade10'], books: [{ title: 'Computer Science for Class IX-X', ...SINDH_STBB('IX-X') }] },
      'Social Studies': { grades: ['grade4','grade5','grade6','grade7','grade8'], books: [{ title: 'Social Studies (per class)', ...SINDH_STBB('IV-VIII') }] },
      'General Science': { grades: ['grade6','grade7','grade8'], books: [{ title: 'General Science (per class)', ...SINDH_STBB('VI-VIII') }] },
    },
  },

  'pk-federal-board': {
    country: 'Pakistan',
    label: 'Federal Board (FBISE, Islamabad)',
    grades: ['grade1','grade2','grade3','grade4','grade5','grade6','grade7','grade8','grade9','grade10','grade11','grade12'],
    medium: ['English', 'Urdu'],
    subjects: {
      'Mathematics': { books: [{ title: 'Mathematics SSC-I & SSC-II', ...FEDERAL_NBF('IX-X') }], pastPapers: 'FBISE 2005-2024' },
      'Physics': { books: [{ title: 'Physics SSC-I & SSC-II', ...FEDERAL_NBF('IX-X') }], pastPapers: 'FBISE 2005-2024' },
      'Chemistry': { books: [{ title: 'Chemistry SSC-I & SSC-II', ...FEDERAL_NBF('IX-X') }], pastPapers: 'FBISE 2005-2024' },
      'Biology': { books: [{ title: 'Biology SSC-I & SSC-II', ...FEDERAL_NBF('IX-X') }], pastPapers: 'FBISE 2005-2024' },
      'English': { books: [{ title: 'English Textbook (per class)', ...FEDERAL_NBF('I-XII') }] },
      'Urdu': { books: [{ title: 'Urdu Textbook (per class)', ...FEDERAL_NBF('I-XII') }] },
      'Pakistan Studies': { grades: ['grade9','grade10'], books: [{ title: 'Pakistan Studies SSC', ...FEDERAL_NBF('IX-X') }] },
      'Islamiat': { books: [{ title: 'Islamiat (per class)', ...FEDERAL_NBF('I-XII') }] },
      'Computer Science': { grades: ['grade9','grade10','grade11','grade12'], books: [{ title: 'Computer Science', ...FEDERAL_NBF('IX-XII') }] },
    },
  },

  'pk-cambridge-olevel': {
    country: 'Pakistan',
    label: 'Cambridge O Level (Pakistan)',
    board: CAIE,
    grades: ['grade9','grade10','grade11'],
    subjects: { ...CAMBRIDGE_OLEVEL_SUBJECTS, ...CAMBRIDGE_OLEVEL_PK_ONLY },
  },

  'pk-cambridge-alevel': {
    country: 'Pakistan',
    label: 'Cambridge A Level (Pakistan)',
    board: CAIE,
    grades: ['grade11','grade12','grade13'],
    subjects: CAMBRIDGE_ALEVEL_SUBJECTS,
  },

  'pk-edexcel-igcse': {
    country: 'Pakistan',
    label: 'Edexcel International GCSE (Pakistan)',
    board: 'Pearson Edexcel International',
    grades: ['grade9','grade10','grade11'],
    subjects: EDEXCEL_IGCSE_SUBJECTS,
  },

  // ═══════════════ UAE ═══════════════
  // UAE RULE: NO Pakistan Studies, NO Islamiyat, NO Urdu (1st/2nd Language).
  // Islamic Education + Arabic are provided via the MANDATORY MoE overlay,
  // not via these curriculum subject maps.

  'uae-british-cambridge-olevel': {
    country: 'UAE',
    label: 'Cambridge O Level (UAE British schools)',
    board: CAIE,
    grades: ['year10','year11'],
    subjects: withoutPakistanSubjects(CAMBRIDGE_OLEVEL_SUBJECTS),
  },

  'uae-british-cambridge-alevel': {
    country: 'UAE',
    label: 'Cambridge A Level (UAE British schools)',
    board: CAIE,
    grades: ['year12','year13'],
    subjects: CAMBRIDGE_ALEVEL_SUBJECTS, // no Pakistan subjects in A Level bank
  },

  'uae-british-edexcel-igcse': {
    country: 'UAE',
    label: 'Edexcel International GCSE (UAE British schools)',
    board: 'Pearson Edexcel International',
    grades: ['grade9','grade10','grade11'],
    subjects: withoutPakistanSubjects(EDEXCEL_IGCSE_SUBJECTS),
    notes: 'International GCSE equivalent to O Level. Pearson Edexcel Board. Also known as iGCSE.',
  },

  'uae-british-edexcel-ial': {
    country: 'UAE',
    label: 'Edexcel International Advanced Level (UAE British schools)',
    board: 'Pearson Edexcel International',
    grades: ['alevel1'],
    subjects: withoutPakistanSubjects(EDEXCEL_IAL_SUBJECTS),
    notes: 'International A Level equivalent. Modular structure: AS (Units 1-3) + A2 (Units 4-6). Widely accepted by UAE/UK/international universities.',
  },

  'uae-american': {
    country: 'UAE',
    label: 'American Curriculum / Common Core + AP (UAE)',
    board: 'College Board + state Common Core',
    grades: ['kg','grade1','grade2','grade3','grade4','grade5','grade6','grade7','grade8','grade9','grade10','grade11','grade12'],
    subjects: {
      'Mathematics (Common Core)': {
        books: [
          { title: 'Glencoe Math Course 1-3', publisher: 'McGraw-Hill' },
          { title: 'enVision Mathematics', publisher: 'Savvas / Pearson' },
          { title: 'Big Ideas Math', author: 'Ron Larson & Laurie Boswell', publisher: 'Big Ideas Learning' },
        ],
      },
      'Algebra / Geometry / Pre-Calculus': {
        books: [
          { title: 'Algebra 1, Geometry, Algebra 2', author: 'Ron Larson', publisher: 'Houghton Mifflin Harcourt' },
          { title: 'Precalculus', author: 'Ron Larson', publisher: 'Cengage' },
        ],
      },
      'AP Calculus AB/BC': {
        books: [
          { title: 'Calculus — Early Transcendentals', author: 'James Stewart', publisher: 'Cengage', official: true },
          { title: 'Calculus', author: 'Ron Larson & Bruce Edwards', publisher: 'Cengage' },
          { title: 'Barron\'s AP Calculus', publisher: 'Barron\'s' },
        ],
        pastPapers: 'College Board AP Calculus — released FRQs 1998 to latest',
      },
      'AP Statistics': {
        books: [
          { title: 'The Practice of Statistics', author: 'Starnes, Tabor, Yates, Moore', publisher: 'W. H. Freeman', official: true },
        ],
      },
      'Physics (High School)': {
        books: [
          { title: 'Physics — Principles with Applications', author: 'Douglas Giancoli', publisher: PEARSON, official: true },
          { title: 'Conceptual Physics', author: 'Paul Hewitt', publisher: PEARSON },
        ],
      },
      'AP Physics 1/2': {
        books: [
          { title: 'Physics — Principles with Applications', author: 'Douglas Giancoli', publisher: PEARSON },
          { title: '5 Steps to a 5: AP Physics 1', publisher: 'McGraw-Hill' },
        ],
      },
      'AP Physics C': {
        books: [
          { title: 'Fundamentals of Physics', author: 'Halliday, Resnick & Walker', publisher: 'Wiley', official: true },
          { title: 'University Physics with Modern Physics', author: 'Young & Freedman', publisher: PEARSON },
        ],
      },
      'Chemistry (High School)': {
        books: [
          { title: 'Chemistry', author: 'Steven Zumdahl & Susan Zumdahl', publisher: 'Cengage', official: true },
          { title: 'Chemistry — The Central Science', author: 'Brown, LeMay, Bursten', publisher: PEARSON },
        ],
      },
      'AP Chemistry': {
        books: [
          { title: 'Chemistry', author: 'Steven Zumdahl', publisher: 'Cengage', official: true },
          { title: 'Princeton Review — Cracking the AP Chemistry Exam', publisher: 'Princeton Review' },
        ],
      },
      'Biology (High School)': {
        books: [
          { title: 'Biology', author: 'Miller & Levine', publisher: PEARSON },
        ],
      },
      'AP Biology': {
        books: [
          { title: 'Campbell Biology', author: 'Lisa Urry, Michael Cain et al.', publisher: PEARSON, official: true },
          { title: 'Barron\'s AP Biology', publisher: 'Barron\'s' },
        ],
      },
      'AP Environmental Science': {
        books: [
          { title: 'Environmental Science for AP', author: 'Andrew Friedland & Rick Relyea', publisher: 'W. H. Freeman' },
        ],
      },
      'English Language Arts': {
        books: [
          { title: 'myPerspectives English Language Arts', publisher: 'Savvas / Pearson' },
          { title: 'Collections', publisher: 'Houghton Mifflin Harcourt' },
        ],
      },
      'AP English Language / Literature': {
        books: [
          { title: 'Barron\'s AP English Language and Composition', publisher: 'Barron\'s' },
          { title: 'Princeton Review — Cracking the AP English Literature Exam', publisher: 'Princeton Review' },
        ],
      },
      'US History / AP US History': {
        books: [
          { title: 'The American Pageant', author: 'David Kennedy & Lizabeth Cohen', publisher: 'Cengage', official: true },
          { title: 'AMSCO AP US History', publisher: 'Perfection Learning' },
        ],
      },
      'AP World History': {
        books: [
          { title: 'Ways of the World', author: 'Robert Strayer', publisher: 'Bedford/St. Martin\'s' },
        ],
      },
      'AP Computer Science A': {
        books: [
          { title: 'Barron\'s AP Computer Science A', publisher: 'Barron\'s' },
          { title: 'Java Methods — Object-Oriented Programming', author: 'Maria & Gary Litvin', publisher: 'Skylight' },
        ],
      },
      'SAT Prep': {
        books: [
          { title: 'The Official SAT Study Guide (Digital)', publisher: 'College Board', official: true },
          { title: 'Cracking the SAT', publisher: 'Princeton Review' },
          { title: 'Barron\'s SAT', publisher: 'Barron\'s' },
        ],
        pastPapers: 'College Board practice tests (Digital SAT Bluebook)',
      },
      'ACT Prep': {
        books: [
          { title: 'The Official ACT Prep Guide', publisher: 'ACT Inc.', official: true },
        ],
      },
    },
  },

  'uae-ib': {
    country: 'UAE',
    label: 'International Baccalaureate (UAE IB schools — PYP / MYP / DP)',
    board: 'International Baccalaureate Organization (IBO)',
    grades: ['pyp','myp1','myp2','myp3','myp4','myp5','dp1','dp2'],
    subjects: {
      'Maths AA SL/HL': {
        books: [
          { title: 'Mathematics: Analysis and Approaches SL / HL', author: 'Paul Fannon, Vesna Kadelburg et al.', publisher: CUP, official: true },
          { title: 'Mathematics for the IB Diploma: Analysis and Approaches', author: 'Haese Mathematics', publisher: 'Haese', official: true },
        ],
        pastPapers: 'IBO — May and November sessions',
      },
      'Maths AI SL/HL': {
        books: [
          { title: 'Mathematics: Applications and Interpretation SL / HL', author: 'Haese Mathematics', publisher: 'Haese', official: true },
          { title: 'Oxford IB Mathematics: Applications and Interpretation', publisher: OUP },
        ],
      },
      'Physics (IB DP)': {
        books: [
          { title: 'Physics for the IB Diploma', author: 'K. A. Tsokos', publisher: CUP, official: true },
          { title: 'Oxford IB Physics Course Companion', author: 'David Homer, Michael Bowen-Jones', publisher: OUP },
        ],
      },
      'Chemistry (IB DP)': {
        books: [
          { title: 'Chemistry for the IB Diploma', author: 'Steve Owen', publisher: CUP },
          { title: 'Pearson Baccalaureate Chemistry Higher Level', author: 'Catrin Brown & Mike Ford', publisher: PEARSON },
          { title: 'Chemistry — The Central Science', author: 'Brown, LeMay, Bursten', publisher: PEARSON },
        ],
      },
      'Biology (IB DP)': {
        books: [
          { title: 'Biology for the IB Diploma', author: 'Andrew Allott & David Mindorff', publisher: OUP, official: true },
          { title: 'Pearson Baccalaureate Biology Higher Level', author: 'Alan Damon', publisher: PEARSON },
        ],
      },
      'English A: Literature / Lang & Lit': {
        books: [
          { title: 'English A: Literature Course Companion', publisher: OUP, official: true },
          { title: 'English A: Language and Literature Course Companion', publisher: OUP },
          { title: 'Prescribed Reading List (PRL) set texts — per current IB list', needsVerification: true },
        ],
      },
      'Economics (IB DP)': {
        books: [
          { title: 'Economics for the IB Diploma', author: 'Ellie Tragakes', publisher: CUP, official: true },
        ],
      },
      'Business Management (IB DP)': {
        books: [
          { title: 'Business Management for the IB Diploma', author: 'Peter Stimpson & Alex Smith', publisher: CUP },
        ],
      },
      'Computer Science (IB DP)': {
        books: [
          { title: 'Computer Science for the IB Diploma', author: 'Kostas Dimitriou & Markos Hatzitaskos', publisher: CUP },
        ],
      },
      'Theory of Knowledge (TOK)': {
        books: [
          { title: 'Theory of Knowledge for the IB Diploma', author: 'Nicholas Alchin & Carolyn Henly', publisher: HODDER, official: true },
        ],
      },
      'Extended Essay (EE)': {
        books: [
          { title: 'Extended Essay for the IB Diploma — Skills for Success', author: 'Kosta Lekanides', publisher: HODDER },
        ],
      },
      'CAS (Creativity, Activity, Service)': {
        books: [
          { title: 'IB CAS Guide (current edition)', publisher: 'IBO', official: true },
        ],
      },
    },
  },

  'uae-cbse': {
    country: 'UAE',
    label: 'CBSE / NCERT (UAE Indian schools)',
    board: 'Central Board of Secondary Education (CBSE), New Delhi',
    grades: ['grade1','grade2','grade3','grade4','grade5','grade6','grade7','grade8','grade9','grade10','grade11','grade12'],
    medium: ['English', 'Hindi'],
    subjects: {
      'Mathematics': {
        books: [
          { title: 'NCERT Mathematics (per class)', publisher: 'NCERT, New Delhi', official: true },
          { title: 'R. D. Sharma Mathematics', author: 'R. D. Sharma', publisher: 'Dhanpat Rai' },
          { title: 'R. S. Aggarwal Mathematics', author: 'R. S. Aggarwal', publisher: 'Bharati Bhawan' },
        ],
        pastPapers: 'CBSE board exams 2010-2024 + sample papers',
      },
      'Science (Classes 6-10)': {
        books: [{ title: 'NCERT Science (per class)', publisher: 'NCERT, New Delhi', official: true }],
      },
      'Physics (Classes 11-12)': {
        books: [
          { title: 'NCERT Physics Part I & II (Class 11-12)', publisher: 'NCERT, New Delhi', official: true },
          { title: 'Concepts of Physics Vol. 1 & 2', author: 'H. C. Verma', publisher: 'Bharati Bhawan' },
        ],
      },
      'Chemistry (Classes 11-12)': {
        books: [
          { title: 'NCERT Chemistry Part I & II (Class 11-12)', publisher: 'NCERT', official: true },
          { title: 'Modern ABC of Chemistry', publisher: 'Modern Publishers' },
        ],
      },
      'Biology (Classes 11-12)': {
        books: [
          { title: 'NCERT Biology (Class 11-12)', publisher: 'NCERT', official: true },
          { title: 'Trueman\'s Elementary Biology', publisher: 'Trueman Book Company' },
        ],
      },
      'English': {
        books: [
          { title: 'NCERT Honeydew / Beehive / Flamingo / Hornbill (per class)', publisher: 'NCERT', official: true },
        ],
      },
      'Hindi': {
        books: [{ title: 'NCERT Hindi — Kshitij, Kritika, Aaroh, Vitan (per class)', publisher: 'NCERT', official: true }],
      },
      'Social Science': {
        books: [{ title: 'NCERT History / Geography / Civics / Economics (per class)', publisher: 'NCERT', official: true }],
      },
      'Computer Science (Python)': {
        books: [{ title: 'NCERT Computer Science with Python (Class 11-12)', publisher: 'NCERT', official: true }],
      },
      'Accountancy': {
        books: [{ title: 'NCERT Accountancy Part I & II (Class 11-12)', publisher: 'NCERT', official: true }],
      },
      'Business Studies': {
        books: [{ title: 'NCERT Business Studies (Class 11-12)', publisher: 'NCERT', official: true }],
      },
      'Economics': {
        books: [{ title: 'NCERT Indian Economic Development / Macroeconomics / Microeconomics', publisher: 'NCERT', official: true }],
      },
    },
  },

  'uae-moe': {
    country: 'UAE',
    label: 'UAE Ministry of Education (national government curriculum)',
    board: 'UAE Ministry of Education (MoE)',
    grades: ['kg1','kg2','grade1','grade2','grade3','grade4','grade5','grade6','grade7','grade8','grade9','grade10','grade11','grade12'],
    medium: ['Arabic (Arabic/Islamic/Social)', 'English (STEM)'],
    subjects: {
      'Arabic Language (First Language)': {
        books: [{ title: 'MoE Arabic Language Textbook (per grade)', publisher: 'UAE Ministry of Education', official: true }],
      },
      'Islamic Education': {
        books: [{ title: 'MoE Islamic Education Textbook (per grade)', publisher: 'UAE Ministry of Education', official: true }],
      },
      'Social Studies (UAE)': {
        books: [{ title: 'MoE Social Studies — UAE Identity, Citizenship & History', publisher: 'UAE Ministry of Education', official: true }],
      },
      'Moral, Social & Cultural Studies': {
        books: [{ title: 'UAE Moral Education / MSC Curriculum Resource', publisher: 'UAE Ministry of Education', official: true }],
      },
      'Mathematics (MoE)': {
        books: [
          { title: 'McGraw-Hill Reveal Math (MoE-adopted)', publisher: 'McGraw-Hill Education', needsVerification: true },
          { title: 'MoE Mathematics Teacher & Student Guide', publisher: 'UAE Ministry of Education', official: true },
        ],
      },
      'Science (MoE)': {
        books: [
          { title: 'McGraw-Hill Inspire Science (MoE-adopted)', publisher: 'McGraw-Hill Education', needsVerification: true },
        ],
      },
      'Physics (Advanced Track)': {
        books: [{ title: 'MoE Physics — Advanced Stream (Grades 10-12)', publisher: 'UAE MoE / McGraw-Hill', needsVerification: true }],
      },
      'Chemistry (Advanced Track)': {
        books: [{ title: 'MoE Chemistry — Advanced Stream (Grades 10-12)', publisher: 'UAE MoE / McGraw-Hill', needsVerification: true }],
      },
      'Biology (Advanced Track)': {
        books: [{ title: 'MoE Biology — Advanced Stream (Grades 10-12)', publisher: 'UAE MoE / McGraw-Hill', needsVerification: true }],
      },
      'English Language': {
        books: [
          { title: 'McGraw-Hill Wonders / Bridges English (MoE-adopted)', publisher: 'McGraw-Hill Education', needsVerification: true },
        ],
      },
      'Computer Science / ICT': {
        books: [{ title: 'MoE Computing, Design & Innovation Resource', publisher: 'UAE MoE', needsVerification: true }],
      },
      'EmSAT Achieve — English': { books: [{ title: 'EmSAT Achieve English Prep', publisher: 'UAE MoE / Official practice', official: true }], pastPapers: 'EmSAT official practice tests' },
      'EmSAT Achieve — Mathematics': { books: [{ title: 'EmSAT Achieve Mathematics Prep', publisher: 'UAE MoE', official: true }] },
      'EmSAT Achieve — Arabic': { books: [{ title: 'EmSAT Achieve Arabic Prep', publisher: 'UAE MoE', official: true }] },
      'EmSAT Achieve — Physics': { books: [{ title: 'EmSAT Achieve Physics Prep', publisher: 'UAE MoE', official: true }] },
      'EmSAT Achieve — Chemistry': { books: [{ title: 'EmSAT Achieve Chemistry Prep', publisher: 'UAE MoE', official: true }] },
      'EmSAT Achieve — Biology': { books: [{ title: 'EmSAT Achieve Biology Prep', publisher: 'UAE MoE', official: true }] },
    },
  },

  'uae-pakistani': {
    country: 'UAE',
    label: 'UAE Pakistani Schools (expat community — follow Cambridge / Federal)',
    board: 'CAIE + FBISE',
    grades: ['grade1','grade2','grade3','grade4','grade5','grade6','grade7','grade8','grade9','grade10','grade11','grade12'],
    note: 'The only UAE curriculum where Pakistan Studies, Islamiyat and Urdu are valid — these schools serve Pakistani expats.',
    subjects: {
      ...CAMBRIDGE_OLEVEL_SUBJECTS,
      ...CAMBRIDGE_OLEVEL_PK_ONLY,
      // Add Federal-equivalents for younger years
      'Urdu (Federal, Classes 1-8)': { books: [{ title: 'Urdu Textbook', ...FEDERAL_NBF('I-VIII') }] },
      'Islamiat (Federal, Classes 1-10)': { books: [{ title: 'Islamiat Textbook', ...FEDERAL_NBF('I-X') }] },
      'Pakistan Studies (Federal, 9-10)': { books: [{ title: 'Pakistan Studies', ...FEDERAL_NBF('IX-X') }] },
    },
  },
};

// ──────────────────────────────────────────────────────────────────
// UAE MANDATORY OVERLAY — applied on top of ANY uae-* curriculum
// ──────────────────────────────────────────────────────────────────

export const UAE_MANDATORY_OVERLAY = {
  'Islamic Education (UAE MoE)': {
    mandatoryFor: 'All Muslim students in UAE private schools (regardless of main curriculum)',
    exemption: 'Non-Muslim students take Moral Education instead',
    books: [{ title: 'MoE Islamic Education Textbook (per grade)', publisher: 'UAE Ministry of Education', official: true }],
  },
  'Arabic (First Language — Arab students)': {
    mandatoryFor: 'Arab nationality students in UAE private schools',
    books: [{ title: 'MoE Arabic Language Textbook', publisher: 'UAE Ministry of Education', official: true }],
  },
  'Arabic (Second Language — non-Arab)': {
    mandatoryFor: 'All non-Arab students in UAE private schools',
    books: [{ title: 'MoE Arabic as a Second Language Textbook', publisher: 'UAE Ministry of Education', official: true }],
  },
  'UAE Social Studies': {
    mandatoryFor: 'All students in UAE private schools',
    books: [{ title: 'MoE Social Studies — UAE Identity & Citizenship', publisher: 'UAE Ministry of Education', official: true }],
  },
};

// ──────────────────────────────────────────────────────────────────
// Helper functions
// ──────────────────────────────────────────────────────────────────

/**
 * Get the books array for a (curriculum, subject, grade) triple.
 * Returns [] if not found.
 */
export function getBooksFor(curriculumId, subject, grade) {
  const curriculum = CURRICULUM_BOOKS[curriculumId];
  if (!curriculum) return [];
  const subj = curriculum.subjects?.[subject];
  if (!subj) return [];
  if (grade && Array.isArray(subj.grades) && !subj.grades.includes(grade)) return [];
  return subj.books || [];
}

/**
 * Return all curriculum IDs for a country ('Pakistan' | 'UAE').
 */
export function getCurriculumList(country) {
  return Object.entries(CURRICULUM_BOOKS)
    .filter(([, c]) => !country || c.country === country)
    .map(([id, c]) => ({ id, label: c.label, country: c.country }));
}

/**
 * Return the list of subjects for a curriculum (optionally filtered by grade).
 */
export function getSubjectsFor(curriculumId, grade) {
  const curriculum = CURRICULUM_BOOKS[curriculumId];
  if (!curriculum) return [];
  const entries = Object.entries(curriculum.subjects || {});
  if (!grade) return entries.map(([name]) => name);
  return entries
    .filter(([, s]) => !Array.isArray(s.grades) || s.grades.includes(grade))
    .map(([name]) => name);
}

/**
 * UAE filter: remove Pakistan-only subjects from a subject list.
 * Used by legacy pages that still hold their own subject arrays.
 */
export function filterUAESubjects(subjectList) {
  const forbidden = new Set([
    'Pakistan Studies', 'Islamiyat', 'Islamic Studies',
    'First Language Urdu', 'Second Language Urdu', 'Urdu',
    'Pakistan Studies (2059)', 'Islamiyat (2058)',
    'First Language Urdu (3248)', 'Second Language Urdu (3247)',
  ]);
  return (subjectList || []).filter((s) => !forbidden.has(s));
}

/**
 * Get UAE mandatory subjects overlay (applies on top of any uae-* curriculum).
 */
export function getUAEMandatoryOverlay() {
  return UAE_MANDATORY_OVERLAY;
}

/**
 * Lookup a curriculum by ID.
 */
export function getCurriculum(curriculumId) {
  return CURRICULUM_BOOKS[curriculumId] || null;
}

// ──────────────────────────────────────────────────────────────────
// EDEXCEL_NOTES — factual study-notes references (no copyrighted content)
// Spec URLs follow the public Pearson qualifications site pattern.
// ──────────────────────────────────────────────────────────────────

export const EDEXCEL_NOTES = {
  // ─── iGCSE ───
  'Physics (4PH1)': {
    level: 'iGCSE',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/physics-2017.html',
    topics: ['Forces and motion', 'Electricity', 'Waves', 'Energy resources and energy transfers', 'Solids, liquids and gases', 'Magnetism and electromagnetism', 'Radioactivity and particles', 'Astrophysics'],
    keyFormulas: 'See Pearson formula sheet on the official spec page.',
    examTips: 'Paper 1 (2hr): core + extension. Paper 2 (1hr 15min): extension only. Calculator allowed both papers.',
    commonMistakes: ['Unit conversion errors (kJ vs J, km/h vs m/s)', 'Confusing mass vs weight', 'Forgetting to square velocity in KE', 'Mixing up series vs parallel circuit rules'],
    revisionGuideTitle: 'CGP Edexcel International GCSE (9-1) Physics Revision Guide',
  },
  'Chemistry (4CH1)': {
    level: 'iGCSE',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/chemistry-2017.html',
    topics: ['Principles of chemistry', 'Inorganic chemistry', 'Physical chemistry', 'Organic chemistry'],
    keyFormulas: 'Moles = mass / Mr. Concentration = moles / volume. Empirical formula calculations.',
    examTips: 'Paper 1 (2hr): core + extension. Paper 2 (1hr 15min): extension only. Calculator allowed. Periodic table provided.',
    commonMistakes: ['Balancing equations (forgetting state symbols)', 'Confusing ionic vs covalent bonding explanations', 'Mole calculation rounding', 'Incomplete observations for practical questions'],
    revisionGuideTitle: 'CGP Edexcel International GCSE (9-1) Chemistry Revision Guide',
  },
  'Biology (4BI1)': {
    level: 'iGCSE',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/biology-2017.html',
    topics: ['The nature and variety of living organisms', 'Structures and functions in living organisms', 'Reproduction and inheritance', 'Ecology and the environment', 'Use of biological resources'],
    keyFormulas: 'Magnification = image size / actual size. Percentage change calculations for osmosis.',
    examTips: 'Paper 1 (2hr): core + extension. Paper 2 (1hr 15min): extension only. Calculator allowed.',
    commonMistakes: ['Confusing mitosis and meiosis', 'Vague answers on enzyme action (lock and key vs induced fit)', 'Missing control variables in experiment questions', 'Not using data from the stimulus'],
    revisionGuideTitle: 'CGP Edexcel International GCSE (9-1) Biology Revision Guide',
  },
  'Mathematics A (4MA1)': {
    level: 'iGCSE',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/mathematics-a-2016.html',
    topics: ['Number', 'Algebra', 'Sequences, functions and graphs', 'Geometry', 'Vectors and transformation geometry', 'Statistics', 'Probability'],
    keyFormulas: 'Quadratic formula, sine rule, cosine rule, area = 1/2 ab sin C. Formulae sheet provided in exam.',
    examTips: 'Paper 1 (2hr) and Paper 2 (2hr), both calculator-allowed. Foundation and Higher tiers.',
    commonMistakes: ['Losing method marks by not showing working', 'Rounding too early', 'Mis-reading Higher tier algebraic fractions', 'Forgetting units on final answers'],
    revisionGuideTitle: 'CGP Edexcel International GCSE (9-1) Maths Revision Guide',
  },
  'Mathematics B (4MB1)': {
    level: 'iGCSE',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/mathematics-b-2016.html',
    topics: ['Number', 'Algebra', 'Functions and graphs', 'Introductory calculus', 'Matrices', 'Geometry and trigonometry', 'Vectors', 'Statistics', 'Probability'],
    keyFormulas: 'Formula sheet provided. Includes calculus, matrix and vector formulae.',
    examTips: 'Two papers, calculator-allowed. Single-tier (no Foundation/Higher split).',
    commonMistakes: ['Matrix multiplication order', 'Differentiation sign errors', 'Skipping working in multi-step geometry'],
    revisionGuideTitle: 'Pearson Edexcel International GCSE (9-1) Mathematics B Student Book',
    needsVerification: true,
    verificationNote: 'Confirm Maths B revision guide availability from third-party publishers.',
  },
  'English Language A (4EA1)': {
    level: 'iGCSE',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/english-language-a-2016.html',
    topics: ['Non-fiction anthology texts', 'Reading and analysis of unseen texts', 'Transactional writing', 'Imaginative writing'],
    keyFormulas: 'N/A — essay and comprehension-based.',
    examTips: 'Paper 1 (2hr 15min): anthology + unseen non-fiction + transactional writing. Paper 2 (1hr 30min): unseen + imaginative writing. No calculator.',
    commonMistakes: ['Missing PEE/PEEL structure', 'Quoting too long instead of embedding', 'Not adapting register to audience in transactional tasks', 'Ignoring the writer\'s methods question stem'],
    revisionGuideTitle: 'CGP Edexcel International GCSE (9-1) English Language Revision Guide',
  },
  'English Literature (4ET1)': {
    level: 'iGCSE',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/english-literature-2016.html',
    topics: ['Poetry and Modern Prose (Anthology)', 'Modern Drama', 'Literary Heritage Texts', 'Unseen Poetry'],
    keyFormulas: 'N/A — essay-based.',
    examTips: 'Paper 1 (2hr): poetry anthology + modern prose + modern drama. Paper 2 (1hr 30min): literary heritage + unseen poetry. Closed book for most sections.',
    commonMistakes: ['Retelling plot instead of analysing', 'Generic comments on language without evidence', 'Ignoring context (AO4) where assessed', 'Weak comparative structure in unseen poetry'],
    revisionGuideTitle: 'CGP Edexcel International GCSE (9-1) English Literature Revision Guide',
  },
  'Economics (4EC1)': {
    level: 'iGCSE',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/economics-2017.html',
    topics: ['The market system', 'Business economics', 'Government and the economy', 'The global economy'],
    keyFormulas: 'Price elasticity of demand, price elasticity of supply, income elasticity — standard %ΔQ / %ΔP formulae.',
    examTips: 'Paper 1 (1hr 30min) + Paper 2 (1hr 30min). Calculator allowed. Mix of MCQ, data response, and extended response.',
    commonMistakes: ['Confusing shifts vs movements along curves', 'Mixing up microeconomic and macroeconomic indicators', 'Ignoring data in case study questions'],
    revisionGuideTitle: 'Pearson Edexcel International GCSE (9-1) Economics Student Book',
  },
  'Business (4BS1)': {
    level: 'iGCSE',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/business-2017.html',
    topics: ['Business activity and influences on business', 'People in business', 'Business finance', 'Marketing', 'Business operations'],
    keyFormulas: 'Gross profit margin, net profit margin, break-even, ROCE (basic).',
    examTips: 'Paper 1 (1hr 30min) + Paper 2 (1hr 30min). Calculator allowed. Case study led.',
    commonMistakes: ['Not applying answers to the case study context', 'Unbalanced evaluation (one-sided arguments)', 'Calculation errors on margin / break-even'],
    revisionGuideTitle: 'Pearson Edexcel International GCSE (9-1) Business Student Book',
  },
  'Accounting (4AC1)': {
    level: 'iGCSE',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/accounting-2017.html',
    topics: ['The accounting system', 'Control systems', 'Preparing financial statements', 'Accounting concepts and decision making', 'Partnerships and limited companies', 'Analysis and communication'],
    keyFormulas: 'Profit ratios, liquidity ratios (current ratio, acid test), efficiency ratios.',
    examTips: 'Two written papers. Calculator allowed. Neat columnar layout matters — marks awarded for format.',
    commonMistakes: ['Wrong sides on debit/credit entries', 'Forgetting closing inventory in trading account', 'Missing narratives in journal entries'],
    revisionGuideTitle: 'Pearson Edexcel International GCSE (9-1) Accounting Student Book',
  },
  'Computer Science (4CP0)': {
    level: 'iGCSE',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/computer-science-2017.html',
    topics: ['Computational thinking', 'Data (binary, hex, data representation)', 'Computers (hardware, software, systems)', 'Communication and the internet', 'The bigger picture', 'Problem solving with programming'],
    keyFormulas: 'Binary/hex conversions, logical operators, Big-O intuition (no formal proof required).',
    examTips: 'Paper 1: principles of CS (written). Paper 2: application of CS (written, may include on-paper code). Python is the typical chosen language.',
    commonMistakes: ['Off-by-one errors in pseudocode', 'Confusing compiler vs interpreter', 'Weak explanations of why a data structure is appropriate'],
    revisionGuideTitle: 'Pearson Edexcel International GCSE (9-1) Computer Science Student Book',
    needsVerification: true,
    verificationNote: 'Confirm current iGCSE CS paper structure (spec has been revised).',
  },

  // ─── IAL ───
  'IAL Physics (WPH11-WPH16)': {
    level: 'IAL',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-a-levels/physics-international-2018.html',
    topics: ['Mechanics and Materials', 'Waves and Electricity', 'Practical Skills in Physics I', 'Further Mechanics, Fields and Particles', 'Thermodynamics, Radiation, Oscillations and Cosmology', 'Practical Skills in Physics II'],
    keyFormulas: 'Data and formulae booklet provided in every unit exam.',
    examTips: 'Modular: AS = Units 1, 2, 3. A2 = Units 4, 5, 6. Practical units (3 and 6) are written papers on practical skills, not assessed coursework. Calculator allowed.',
    commonMistakes: ['Sign errors in SHM', 'Confusing gravitational vs electric field equations', 'Misreading log axes on graphs', 'Poor uncertainty / significant figures treatment in practical papers'],
    revisionGuideTitle: 'Pearson Edexcel International A Level Physics Student Book 1 & 2',
  },
  'IAL Chemistry (WCH11-WCH16)': {
    level: 'IAL',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-a-levels/chemistry-international-2018.html',
    topics: ['Structure, Bonding and Introduction to Organic Chemistry', 'Energetics, Group Chemistry, Halogenoalkanes and Alcohols', 'Practical Skills in Chemistry I', 'Rates, Equilibria and Further Organic Chemistry', 'Transition Metals and Organic Nitrogen Chemistry', 'Practical Skills in Chemistry II'],
    keyFormulas: 'Data booklet provided (periodic table, ionisation energies, bond enthalpies, standard electrode potentials).',
    examTips: 'Units 1, 2, 4, 5 are content papers. Units 3, 6 are practical skills written papers. Calculator allowed.',
    commonMistakes: ['Drawing mechanisms with wrong curly-arrow origins', 'Mixing up Kc, Kp, Ka expressions', 'Incorrect NMR splitting predictions', 'Not using data booklet values'],
    revisionGuideTitle: 'Pearson Edexcel International A Level Chemistry Student Book 1 & 2',
  },
  'IAL Biology (WBI11-WBI16)': {
    level: 'IAL',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-a-levels/biology-international-2018.html',
    topics: ['Molecules, Diet, Transport and Health', 'Cells, Development, Biodiversity and Conservation', 'Practical Skills in Biology I', 'Energy, Environment, Microbiology and Immunity', 'Respiration, Internal Environment, Coordination and Gene Technology', 'Practical Skills in Biology II'],
    keyFormulas: 'Statistical tests (t-test, chi-squared, Spearman) — formulae provided.',
    examTips: 'Units 1, 2, 4, 5 content; Units 3, 6 practical skills written papers. Calculator allowed.',
    commonMistakes: ['Weak use of statistical test conclusions (p-value wording)', 'Confusing photosynthesis stages', 'Vague explanations of kidney ultrafiltration', 'Ignoring data in synoptic questions'],
    revisionGuideTitle: 'Pearson Edexcel International A Level Biology Student Book 1 & 2',
  },
  'IAL Mathematics': {
    level: 'IAL',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-a-levels/mathematics-international-2018.html',
    topics: ['Pure Mathematics (P1-P4)', 'Mechanics (M1-M3)', 'Statistics (S1-S3)', 'Decision Mathematics (D1-D2)'],
    keyFormulas: 'Formulae booklet provided. Includes integration standard results, Taylor/Maclaurin, statistical distributions.',
    examTips: 'Fully modular. Standard A Level = P1 P2 P3 P4 + two applied units. Calculator allowed (graphical calculators permitted).',
    commonMistakes: ['Missing +C in indefinite integrals', 'Radian/degree mode errors', 'Incorrect limits after substitution', 'Forgetting to check domain of inverse functions'],
    revisionGuideTitle: 'Pearson Edexcel International A Level Mathematics Pure Mathematics 1-4 Student Books',
  },
  'IAL Further Mathematics': {
    level: 'IAL',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-a-levels/further-mathematics-international-2018.html',
    topics: ['Further Pure 1-3 (complex numbers, matrices, series, polar, hyperbolics, differential equations)', 'Plus additional applied units (M2/M3, S2/S3, D1/D2)'],
    keyFormulas: 'Formulae booklet provided.',
    examTips: 'Taken alongside Mathematics. FP1 at AS, FP2/FP3 at A2. Calculator allowed.',
    commonMistakes: ['Argument of complex number in wrong quadrant', 'Matrix inverse sign errors', 'Missing integrating factor in first-order ODEs'],
    revisionGuideTitle: 'Pearson Edexcel International A Level Further Pure Mathematics 1-3 Student Books',
  },
  'IAL Economics (WEC11-WEC14)': {
    level: 'IAL',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-a-levels/economics-international-2018.html',
    topics: ['Markets in Action', 'Macroeconomic Performance and Policy', 'Business Behaviour', 'Developments in the Global Economy'],
    keyFormulas: 'Elasticities, multiplier = 1/(1-MPC), GDP / inflation / unemployment calculations.',
    examTips: 'Four units across AS + A2. Each unit: MCQ + data response + essay. Calculator allowed.',
    commonMistakes: ['Unbalanced evaluation', 'Ignoring diagram labelling', 'Confusing nominal vs real variables', 'Weak application to case study data'],
    revisionGuideTitle: 'Pearson Edexcel International A Level Economics Student Book 1 & 2',
  },
  'IAL Business (WBS11-WBS14)': {
    level: 'IAL',
    officialSpec: 'https://qualifications.pearson.com/en/qualifications/edexcel-a-levels/business-international-2018.html',
    topics: ['Business and its Environment', 'Managing Business Activities', 'Business Decisions and Strategy', 'Global Business'],
    keyFormulas: 'Investment appraisal (payback, ARR, NPV), ratio analysis, capacity utilisation.',
    examTips: 'Four units AS + A2. Heavy case-study based. Calculator allowed.',
    commonMistakes: ['Listing rather than analysing', 'Weak strategic recommendations without justification', 'Poor use of numerical data provided'],
    revisionGuideTitle: 'Pearson Edexcel International A Level Business Student Book 1 & 2',
  },
};

// Export IAL subjects so other pages (e.g. /uae portals) can consume directly
export { EDEXCEL_IGCSE_SUBJECTS, EDEXCEL_IAL_SUBJECTS };

export default CURRICULUM_BOOKS;
