// pakistanSchoolsKB.js
// Researched data on Pakistan's major elite private schools.
// Sources: each school's official website, Wikipedia, and admissions/curriculum pages
// referenced in the `source` field per school. Only facts verifiable on public pages
// are included. Where a claim could not be verified directly from the school's own
// site (e.g. WebFetch was blocked), `verified` is set to false and `notes` explain.
//
// Last updated: 2026-04-13
//
// IMPORTANT: This file contains only public, factual metadata (curriculum, board
// affiliations, grade ranges, publisher names). It does NOT reproduce any
// copyrighted textbook content or past paper material.

export const PAKISTAN_SCHOOLS = {
  'karachi-grammar': {
    name: 'Karachi Grammar School',
    shortName: 'KGS',
    city: 'Karachi',
    founded: 1847,
    approxStudents: 2400,
    coed: true,
    ageRange: '3-19',
    curriculumOffered: ['Cambridge CAIE'],
    levels: {
      junior: { board: 'Cambridge Primary', yearsCovered: ['Years 1-6'] },
      secondary: { board: 'Cambridge O Level / IGCSE', yearsCovered: ['Years 7-11'] },
      aLevel: { board: 'Cambridge AS / A Level', yearsCovered: ['Years 12-13'] },
    },
    subjectsOffered: {
      // KGS A Level structure: 4 core AS subjects + a 5th from "Block E".
      // Specific subject codes are not published on the public admissions page.
    },
    booksReferenced: [
      // No public booklist published; KGS is a Cambridge school so titles are
      // typically Cambridge University Press, OUP Pakistan, and Hodder Education.
    ],
    examCentre: 'British Council / Cambridge',
    website: 'https://kgs.edu.pk',
    sources: [
      'https://kgs.edu.pk/admissions-a-level/',
      'https://kgs.edu.pk/admissions-admission-regulations/',
      'https://en.wikipedia.org/wiki/Karachi_Grammar_School',
    ],
    verified: true,
    notes: 'Pakistan\'s oldest school. Pure Cambridge pathway: O Level/IGCSE then AS/A Level. A Level requires 4 core + 1 elective from Block E. No public IB or Edexcel offering.',
  },

  'beaconhouse': {
    name: 'Beaconhouse School System',
    shortName: 'BSS',
    city: 'Multi-city (HQ Lahore)',
    founded: 1975,
    approxStudents: 280000, // network-wide across Pakistan + overseas
    coed: true,
    ageRange: '3-19',
    curriculumOffered: ['Cambridge CAIE', 'Matric/FBISE (selected branches)'],
    levels: {
      primary: { board: 'Beaconhouse internal / Cambridge Primary', yearsCovered: ['Pre-school to Grade 5'] },
      middle: { board: 'Beaconhouse internal pre-O Level pathway', yearsCovered: ['Grades 6-8'] },
      secondary: { board: 'Cambridge O Level and IGCSE', yearsCovered: ['Grades 9-11'] },
      aLevel: { board: 'Cambridge AS / A Level', yearsCovered: ['Grades 12-13'] },
    },
    subjectsOffered: {},
    booksReferenced: [],
    website: 'https://www.beaconhouse.net',
    sources: [
      'https://www.beaconhouse.net/cie-o-level-and-igcse/',
      'https://www.beaconhouse.net/cie-a-level/',
      'https://en.wikipedia.org/wiki/Beaconhouse_School_System',
    ],
    verified: true,
    notes: 'Largest private school network in Pakistan. A Level programme started Sept 1992. The CAIE pages mix O Level and IGCSE — branches may stream students into either, depending on subject (e.g. Urdu, Pak Studies, Islamiat typically O Level codes; sciences and maths often IGCSE). No verifiable Edexcel partnership at the school-system level despite the search query mentioning it.',
  },

  'the-city-school': {
    name: 'The City School',
    shortName: 'TCS',
    city: 'Multi-city (HQ Lahore)',
    founded: 1978,
    approxStudents: 150000, // network-wide estimate
    campusCount: 160, // "over 160 schools in 49 cities"
    coed: true,
    ageRange: '3-18',
    curriculumOffered: ['Cambridge CAIE'],
    levels: {
      primary: { board: 'UK National Curriculum derived', yearsCovered: ['Nursery to Class 5'] },
      middle: { board: 'TCS internal pre-O Level', yearsCovered: ['Classes 6-8'] },
      secondary: { board: 'Cambridge O Level / IGCSE (CAIE)', yearsCovered: ['Classes 9-11'] },
      aLevel: { board: 'Cambridge AS / A Level (CAIE)', yearsCovered: ['Classes 12-13'] },
    },
    subjectsOffered: {},
    booksReferenced: [],
    website: 'https://thecityschool.edu.pk',
    sources: [
      'https://thecityschool.edu.pk/academics/secondary/o-level/',
      'https://thecityschool.edu.pk/academics/secondary/a-level/',
      'https://en.wikipedia.org/wiki/The_City_School_(Pakistan)',
    ],
    verified: true,
    notes: '160+ campuses across 49 cities plus joint ventures in UAE, KSA, Philippines and Malaysia. Curriculum explicitly described as "derived from UK national curriculum" then transitioning to CAIE for IGCSE/O/A. No published IB or Edexcel pathway.',
  },

  'lahore-grammar': {
    name: 'Lahore Grammar School',
    shortName: 'LGS',
    city: 'Multi-city (HQ Lahore)',
    founded: 1980,
    approxStudents: 70000, // network estimate; ~70+ campuses
    campusCount: 70,
    coed: true, // varies by branch; some single-sex (e.g. Boys, Defence)
    ageRange: '3-19',
    curriculumOffered: ['Cambridge CAIE'],
    levels: {
      primary: { board: 'LGS internal / Cambridge Primary', yearsCovered: ['Pre-school to Class 5'] },
      middle: { board: 'LGS internal pre-IGCSE', yearsCovered: ['Classes 6-8'] },
      secondary: { board: 'Cambridge IGCSE (transitioning fully from O Level)', yearsCovered: ['Classes 9-11'] },
      aLevel: { board: 'Cambridge AS / A Level', yearsCovered: ['Classes 12-13'] },
    },
    subjectsOffered: {
      'Literature in English': { code: '0475', tier: 'IGCSE' },
      'World History': { code: '0470', tier: 'IGCSE' },
      'Global Perspectives': { code: '0457', tier: 'IGCSE' },
    },
    booksReferenced: [],
    website: 'https://lgs.edu.pk',
    sources: [
      'https://lgs.edu.pk/alevel/',
      'https://lgs.edu.pk/senior-school/',
      'https://lgs.edu.pk/global-perspectives-pilot-school/',
      'https://en.wikipedia.org/wiki/Lahore_Grammar_School',
    ],
    verified: true,
    notes: 'Beginning with the O Level batch of 2025, LGS switched to all IGCSE (except Urdu, which remains O Level). A Level since 1995. LGS 55 Main is the only Pakistani school chosen for Cambridge\'s Global Perspectives pilot. 110+ A Level subject combinations available.',
  },

  'aitchison': {
    name: 'Aitchison College',
    shortName: 'Aitchison',
    city: 'Lahore',
    founded: 1886,
    approxStudents: 2500,
    coed: false, // boys only
    ageRange: '6-18',
    curriculumOffered: ['Cambridge CAIE', 'FBISE Matric/FSc'],
    levels: {
      junior: { board: 'Cambridge Primary', yearsCovered: ['Junior School'] },
      prep: { board: 'Cambridge Lower Secondary', yearsCovered: ['Prep School'] },
      secondary: { board: 'Cambridge IGCSE OR FBISE Matric (student streams)', yearsCovered: ['Years 10-11'] },
      aLevel: { board: 'Cambridge AS / A2 OR FBISE FSc (Pre-Med stream)', yearsCovered: ['Years 12-13'] },
    },
    subjectsOffered: {
      // Confirmed example IGCSE bundle from public page (Section C1-B):
      'Biology': { code: '0610', tier: 'IGCSE' },
      'Chemistry': { code: '0620', tier: 'IGCSE' },
      'Physics': { code: '0625', tier: 'IGCSE' },
      'Additional Mathematics': { code: '0606', tier: 'IGCSE' },
    },
    booksReferenced: [],
    examCentre: 'Official Cambridge Examination Centre on campus',
    website: 'https://www.aitchison.edu.pk',
    sources: [
      'https://www.aitchison.edu.pk/academics-overview',
      'https://www.aitchison.edu.pk/senior-school',
      'https://aitchison.edu.pk/academics/a2-level',
      'https://en.wikipedia.org/wiki/Aitchison_College',
    ],
    verified: true,
    notes: 'Cambridge school since 1935. Boys-only, boarding + day. Dual-track: Year 10-11 boys may opt National (FBISE Matric) or International (Cambridge IGCSE) stream. Has its own SAT Centre and College Board affiliation.',
  },

  'roots-international': {
    name: 'Roots International Schools & Colleges',
    shortName: 'Roots',
    city: 'Multi-city (HQ Islamabad)',
    founded: 1988,
    approxStudents: 30000, // network estimate
    coed: true,
    ageRange: '3-19',
    curriculumOffered: ['Cambridge CAIE', 'IB (PYP, others at Millennium group)', 'Matric (selected branches)'],
    levels: {
      primary: { board: 'UK National Curriculum + IB Primary Years Programme (PYP)', yearsCovered: ['Pre-school to Grade 5'] },
      secondary: { board: 'Cambridge IGCSE / O Level OR local Matric', yearsCovered: ['Grades 6-11'] },
      aLevel: { board: 'Cambridge AS / A Level (and IB DP at some campuses)', yearsCovered: ['Grades 12-13'] },
    },
    subjectsOffered: {},
    booksReferenced: [],
    website: 'https://www.rootsinternational.edu.pk',
    sources: [
      'https://www.rootsinternational.edu.pk/igcse/',
      'https://en.wikipedia.org/wiki/Roots_International_Schools',
    ],
    verified: true,
    notes: 'Two related but separate networks: Roots International Schools & Colleges (RISC) and Roots Millennium Schools (the latter operates four IB programmes). DHA branch covers ages 3-19 with full Cambridge pathway. Mixed curriculum portfolio is the differentiator — the only school in this list with confirmed IB World School status at sister campuses.',
  },

  'nixor-college': {
    name: 'Nixor College',
    shortName: 'Nixor',
    city: 'Karachi',
    founded: 2005,
    approxStudents: 1500, // estimate; A Level only
    coed: true,
    ageRange: '16-19',
    curriculumOffered: ['Cambridge CAIE'],
    levels: {
      aLevel: { board: 'Cambridge AS / A Level', yearsCovered: ['XI-XIII'] },
    },
    subjectsOffered: {
      // Open-choice model; no fixed clusters. NP (Nixor Preparatory) classes
      // explicitly named in: Accounts, Economics, Mathematics.
    },
    booksReferenced: [],
    website: 'https://www.nixorcollege.org',
    sources: [
      'https://www.nixorcollege.org/',
      'https://www.nixorcollege.org/unique-features',
      'https://www.nixorcollege.org/admissions',
    ],
    verified: true,
    notes: 'A Level-only college. Distinctive feature: no subject clusters — students freely combine any 3+ A Level subjects subject only to scheduling. Sister O Level operation at nixorols.org covers Years 7-11.',
  },

  'bay-view-academy': {
    name: 'Bay View Academy',
    shortName: 'BVA',
    city: 'Karachi',
    founded: 1986,
    approxStudents: 3000, // multi-campus estimate
    coed: true,
    ageRange: '3-19',
    curriculumOffered: ['Cambridge CAIE'],
    levels: {
      primary: { board: 'BVA pre-prep / Cambridge Primary', yearsCovered: ['Pre-school to Class 5'] },
      secondary: { board: 'Cambridge O Level (CAIE)', yearsCovered: ['Classes 6-11'] },
      aLevel: { board: 'Cambridge AS / A Level', yearsCovered: ['Classes 12-13'] },
    },
    subjectsOffered: {
      'English Language': { tier: 'O Level', compulsory: true },
      'English Literature': { tier: 'O Level', compulsory: true },
      'Mathematics': { tier: 'O Level', compulsory: true },
      'Urdu': { tier: 'O Level', compulsory: true },
      'Pakistan Studies': { tier: 'O Level', compulsory: true },
      'Islamiat': { tier: 'O Level', compulsory: true },
      // Plus a "wide range" of electives (not exhaustively published).
    },
    booksReferenced: [],
    website: 'https://bva.edu.pk',
    sources: [
      'https://bva.edu.pk/',
      'https://bayviewhighschool.edu.pk/',
      'https://bva.edu.pk/senior-educational-approach-philosophy/',
    ],
    verified: true,
    notes: 'Three campuses: Clifton, PECHS, DHA. Strong O Level results history including Top in the World / Top in Pakistan recognition through June 2025 sittings.',
  },

  'generations-school': {
    name: "Generation's School",
    shortName: 'Generations',
    city: 'Karachi',
    founded: 1990,
    approxStudents: 2000, // estimate
    coed: true,
    ageRange: '3-19',
    curriculumOffered: ['Cambridge CAIE'],
    levels: {
      primary: { board: "Generation's internal / Cambridge Primary", yearsCovered: ['Playgroup to Class 5'] },
      secondary: { board: 'Cambridge O Level / IGCSE (CAIE)', yearsCovered: ['Classes 6-11'] },
      aLevel: { board: 'Cambridge AS / A Level (Generation\'s College)', yearsCovered: ['Classes 12-13'] },
    },
    subjectsOffered: {},
    booksReferenced: [
      // Cambridge case study indicates use of Cambridge Global English series.
    ],
    website: 'https://generations.edu.pk',
    sources: [
      'https://generations.edu.pk/',
      'https://generations.edu.pk/generations-college-programme/',
      'https://www.cambridge.org/gb/files/4316/2092/0602/Preparing_to_Teach_Global_English_Case_Study.pdf',
    ],
    verified: true,
    notes: 'First O Level batch in 2001. Featured in Cambridge\'s "Outstanding Cambridge Learners" (Brilliance of Pakistan) lists annually. South Campus designed by noted Pakistani architects (ArchNet record).',
  },

  'haque-academy': {
    name: 'Haque Academy',
    shortName: 'Haque',
    city: 'Karachi',
    founded: 1977,
    approxStudents: 1500, // estimate
    coed: true,
    ageRange: '3-16', // O Level only — no A Level on campus
    curriculumOffered: ['Cambridge CAIE'],
    levels: {
      primary: { board: 'Cambridge Primary', yearsCovered: ['Kindergarten to Class 5'] },
      middle: { board: 'Cambridge Lower Secondary', yearsCovered: ['Classes 6-8'] },
      secondary: { board: 'Cambridge O Level (CAIE)', yearsCovered: ['Classes 9-11'] },
      // No A Level offered on campus; students transition to A Level colleges.
    },
    subjectsOffered: {
      // Core (5 compulsory)
      'English Language': { tier: 'O Level', compulsory: true },
      'Mathematics': { tier: 'O Level', compulsory: true },
      'Urdu': { tier: 'O Level', compulsory: true },
      'Islamiat': { tier: 'O Level', compulsory: true },
      'Pakistan Studies': { tier: 'O Level', compulsory: true },
      // Electives (12 options, students take 4 to make 9 total)
      'Physics': { tier: 'O Level', elective: true },
      'Chemistry': { tier: 'O Level', elective: true },
      'Biology': { tier: 'O Level', elective: true },
      'Additional Mathematics': { tier: 'O Level', elective: true },
      'ICT': { tier: 'O Level', elective: true },
      'Economics': { tier: 'O Level', elective: true },
      'Business Studies': { tier: 'O Level', elective: true },
      'Accounts': { tier: 'O Level', elective: true },
      'Global Perspectives': { tier: 'O Level / IGCSE', elective: true },
      'Sociology': { tier: 'O Level', elective: true },
      'Art': { tier: 'O Level', elective: true },
      'Literature': { tier: 'O Level', elective: true },
    },
    booksReferenced: [],
    website: 'https://www.haqueacademy.edu.pk',
    sources: [
      'https://www.haqueacademy.edu.pk/',
      'https://www.haqueacademy.edu.pk/academics/olevel',
    ],
    verified: true,
    notes: 'Cambridge International Affiliate Centre. KG to O Level only — graduates progress to A Level colleges elsewhere. Each student sits 9 O Level subjects (5 core + 4 electives). >50% of cohort scores A* or A. Khurram\'s daughter Rania attends here (per platform memory).',
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Find schools by curriculum string match (case-insensitive substring match).
 * Examples: schoolsByCurriculum('Cambridge'), schoolsByCurriculum('IB').
 */
export function schoolsByCurriculum(curriculum) {
  const needle = String(curriculum || '').toLowerCase();
  return Object.entries(PAKISTAN_SCHOOLS)
    .filter(([, s]) =>
      (s.curriculumOffered || []).some((c) => c.toLowerCase().includes(needle))
    )
    .map(([id, s]) => ({ id, ...s }));
}

/** Find schools by city (case-insensitive substring match). */
export function schoolsByCity(city) {
  const needle = String(city || '').toLowerCase();
  return Object.entries(PAKISTAN_SCHOOLS)
    .filter(([, s]) => (s.city || '').toLowerCase().includes(needle))
    .map(([id, s]) => ({ id, ...s }));
}

/** Find schools that offer a given level key (e.g. 'aLevel', 'primary'). */
export function schoolsByLevel(levelKey) {
  return Object.entries(PAKISTAN_SCHOOLS)
    .filter(([, s]) => s.levels && s.levels[levelKey])
    .map(([id, s]) => ({ id, ...s }));
}

/** Find schools offering a specific subject (case-insensitive name match). */
export function schoolsBySubject(subjectName) {
  const needle = String(subjectName || '').toLowerCase();
  return Object.entries(PAKISTAN_SCHOOLS)
    .filter(([, s]) =>
      Object.keys(s.subjectsOffered || {}).some((k) =>
        k.toLowerCase().includes(needle)
      )
    )
    .map(([id, s]) => ({ id, ...s }));
}

/** Quick aggregate: which boards dominate the elite-school market? */
export function curriculumSummary() {
  const counts = {};
  for (const s of Object.values(PAKISTAN_SCHOOLS)) {
    for (const c of s.curriculumOffered || []) {
      counts[c] = (counts[c] || 0) + 1;
    }
  }
  return counts;
}

export default PAKISTAN_SCHOOLS;
