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
  },
  'Further Pure Mathematics (4PM1)': {
    syllabusCode: '4PM1',
    books: [
      { title: 'Pearson Edexcel International GCSE Further Pure Mathematics', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4PM1',
  },
  'Physics (4PH1)': {
    syllabusCode: '4PH1',
    books: [
      { title: 'Edexcel International GCSE (9-1) Physics Student Book', author: 'Brian Arnold, Penny Johnson, Steve Woolley', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel 4PH1',
  },
  'Chemistry (4CH1)': {
    syllabusCode: '4CH1',
    books: [
      { title: 'Edexcel International GCSE (9-1) Chemistry Student Book', author: 'Jim Clark', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel 4CH1',
  },
  'Biology (4BI1)': {
    syllabusCode: '4BI1',
    books: [
      { title: 'Edexcel International GCSE (9-1) Biology Student Book', author: 'Erica Larkcom, Philip Bradfield', publisher: PEARSON, official: true },
    ],
    pastPapers: 'Edexcel 4BI1',
  },
  'English Language A (4EA1)': {
    syllabusCode: '4EA1',
    books: [
      { title: 'Edexcel International GCSE (9-1) English Language A Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4EA1',
  },
  'English Literature (4ET1)': {
    syllabusCode: '4ET1',
    books: [
      { title: 'Edexcel International GCSE (9-1) English Literature Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4ET1',
  },
  'ICT (4IT1)': {
    syllabusCode: '4IT1',
    books: [
      { title: 'Edexcel International GCSE ICT Student Book', author: 'Roger Crawford', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4IT1',
  },
  'Economics (4EC1)': {
    syllabusCode: '4EC1',
    books: [
      { title: 'Edexcel International GCSE (9-1) Economics Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4EC1',
  },
  'Business (4BS1)': {
    syllabusCode: '4BS1',
    books: [
      { title: 'Edexcel International GCSE (9-1) Business Student Book', publisher: PEARSON },
    ],
    pastPapers: 'Edexcel 4BS1',
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
    grades: ['year10','year11'],
    subjects: EDEXCEL_IGCSE_SUBJECTS,
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

export default CURRICULUM_BOOKS;
