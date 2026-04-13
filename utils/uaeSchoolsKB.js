// uaeSchoolsKB.js
// Researched data on UAE's major international private schools.
// Sources: each school's official website, KHDA / ADEK inspection reports,
// WhichSchoolAdvisor, SchoolsCompared, Bayut school guides, school admissions pages.
// Last updated: 2026-04-13
//
// Regulators:
//   KHDA  = Knowledge and Human Development Authority (Dubai)
//   ADEK  = Abu Dhabi Department of Education and Knowledge
//   SPEA  = Sharjah Private Education Authority
//
// UAE law mandates Arabic for ALL students, Islamic Studies for Muslim students,
// and UAE Social Studies (Moral, Social and Cultural Studies / "MSC") for all
// students in private schools — regardless of curriculum.

export const REGULATORS = {
  dubai: 'KHDA',
  'abu-dhabi': 'ADEK',
  sharjah: 'SPEA',
};

export const KHDA_RATING_SCALE = [
  'Outstanding',
  'Very Good',
  'Good',
  'Acceptable',
  'Weak',
  'Very Weak',
];

// UAE-mandated subjects all licensed private schools must deliver.
// (Even British / IB / American / Indian schools must comply.)
export const UAE_MANDATORY_SUBJECTS = [
  'Arabic (A — for native speakers)',
  'Arabic (B — for non-native speakers)',
  'Islamic Studies (compulsory for Muslim students, in Arabic)',
  'UAE Social Studies / Moral, Social and Cultural Studies (MSC)',
];

// ---------------------------------------------------------------------------
// SCHOOLS
// ---------------------------------------------------------------------------

export const UAE_SCHOOLS = {
  // ---------------- GEMS Education ----------------

  'gems-wellington-international': {
    name: 'GEMS Wellington International School',
    operator: 'GEMS Education',
    city: 'Dubai',
    area: 'Al Sufouh',
    curriculum: 'British + IB',
    examBoards: ['Cambridge IGCSE', 'Pearson Edexcel IGCSE', 'IB Diploma', 'IB Career-related Programme', 'A Level (from 2025-26)'],
    khdaRating: 'Outstanding',
    khdaRatingHistory: 'Outstanding every year since 2009-10 (14 consecutive years as of 2022-23)',
    levels: {
      eyfs: 'FS1-FS2',
      primary: 'Year 1-6',
      secondary: 'Year 7-11',
      sixthForm: 'Year 12-13 (IB DP, IB CP, and from 2025-26 A Level)',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    notes: '26% of 2024 iGCSE/GCSE grades were Grade 9; 81% scored 6-9. 100% pass rate IB CP 2024.',
    website: 'https://www.wellingtoninternationalschool.com',
    sources: [
      'https://web.khda.gov.ae/en/Education-Directory/Schools/School-Details?Id=272&CenterID=122',
      'https://whichschooladvisor.com/uae/school-review/gems-wellington-international-school-dubai',
      'https://en.wikipedia.org/wiki/GEMS_Wellington_International_School',
    ],
    verified: true,
  },

  'gems-wellington-academy-silicon-oasis': {
    name: 'GEMS Wellington Academy — Silicon Oasis',
    operator: 'GEMS Education',
    city: 'Dubai',
    area: 'Dubai Silicon Oasis',
    curriculum: 'British + IB',
    examBoards: ['Cambridge IGCSE', 'Pearson Edexcel IGCSE', 'A Level', 'BTEC Level 3', 'IB Diploma', 'IB Career-related'],
    khdaRating: 'Outstanding',
    levels: {
      eyfs: 'FS1-FS2',
      primary: 'Year 1-6',
      secondary: 'Year 7-11',
      sixthForm: 'Year 12-13 (A Level + BTEC + IBDP + IBCP)',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    notes: 'First British-curriculum school in UAE to offer IB, A Levels and BTEC together.',
    website: 'https://www.gemswellingtonacademy-dso.com',
    sources: [
      'https://www.gemswellingtonacademy-dso.com/en/curriculum-overview',
      'https://www.ibo.org/en/school/050260',
    ],
    verified: true,
  },

  'gems-wellington-academy-al-khail': {
    name: 'GEMS Wellington Academy — Al Khail',
    operator: 'GEMS Education',
    city: 'Dubai',
    area: 'Dubai Hills',
    curriculum: 'British',
    examBoards: ['Cambridge IGCSE', 'Pearson Edexcel IGCSE / GCSE', 'A Level', 'BTEC'],
    khdaRating: 'Very Good',
    levels: {
      eyfs: 'FS1-FS2',
      primary: 'Year 1-6',
      secondary: 'Year 7-11',
      sixthForm: 'Year 12-13 (A Level + BTEC)',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    website: 'https://www.gemswellingtonacademy-alkhail.com',
    sources: [
      'https://whichschooladvisor.com/uae/school-review/gems-wellington-academy-al-khail',
    ],
    verified: true,
  },

  'gems-jumeirah-college': {
    name: 'GEMS Jumeirah College',
    operator: 'GEMS Education',
    city: 'Dubai',
    area: 'Al Safa',
    curriculum: 'British',
    examBoards: ['AQA', 'Cambridge Assessment (CAIE)', 'Pearson Edexcel', 'WJEC/CBAC'],
    accreditations: ['BSME', 'CES', 'DASSA', 'COBIS', 'Duke of Edinburgh International Award'],
    khdaRating: 'Outstanding',
    khdaRatingHistory: 'Outstanding continuously since 2010-11',
    levels: {
      secondary: 'Year 7-11 (GCSE/IGCSE; choice of Combined Science or Triple Science)',
      sixthForm: 'Year 12-13 (AS / A Level)',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    notes: 'Secondary-only school. School claims top 1% globally for GCSE/A Level outcomes.',
    website: 'https://www.gemsjc.com',
    sources: [
      'https://www.gemsjc.com/Learning/Course-Options',
      'https://edcare.ae/schools/jumeirah-college/curriculum',
    ],
    verified: true,
  },

  'gems-modern-academy': {
    name: 'GEMS Modern Academy',
    operator: 'GEMS Education',
    city: 'Dubai',
    area: 'Nad Al Sheba',
    curriculum: 'Indian (CISCE) + IB',
    examBoards: ['IB PYP', 'CISCE (ICSE / ISC)', 'IB MYP', 'IB Diploma'],
    khdaRating: 'Outstanding',
    khdaRatingHistory: 'Outstanding every year since 2011 (11 consecutive inspections to 2023-24)',
    levels: {
      primary: 'Pre-K to Grade 5 (IB PYP)',
      middle: 'Grade 6-10 (CISCE/ICSE OR IB MYP — dual pathway)',
      senior: 'Grade 11-12 (ISC OR IB Diploma)',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    notes: 'Does NOT follow CBSE — uses CISCE (ICSE/ISC). Only Indian-curriculum school in UAE rated Outstanding. ~3,825 students.',
    website: 'https://www.gemsmodernacademy-dubai.com',
    sources: [
      'https://www.gemsmodernacademy-dubai.com/',
      'https://whichschooladvisor.com/uae/school-review/gems-modern-academy',
    ],
    verified: true,
  },

  'gems-world-academy': {
    name: 'GEMS World Academy',
    operator: 'GEMS Education',
    city: 'Dubai',
    area: 'Al Barsha',
    curriculum: 'IB (full continuum)',
    examBoards: ['IB PYP', 'IB MYP', 'IB Diploma (DP)', 'IB Career-related Programme (CP)'],
    accreditations: ['Council of International Schools (CIS)', 'New England Association of Schools and Colleges (NEASC)'],
    khdaRating: 'Very Good',
    levels: {
      primary: 'Pre-K to Grade 5 (PYP)',
      middle: 'Grade 6-10 (MYP)',
      senior: 'Grade 11-12 (DP or CP)',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    notes: 'One of only two IB schools in UAE accredited to deliver all four IB programmes.',
    website: 'https://www.gemsworldacademy-dubai.com',
    sources: [
      'https://www.gemsworldacademy-dubai.com/en/curriculum-overview',
      'https://web.khda.gov.ae/en/Education-Directory/Schools/School-Details?Id=4433&CenterID=1477',
    ],
    verified: true,
  },

  // ---------------- SABIS / Choueifat ----------------

  'choueifat-dubai-al-sufouh': {
    name: 'The International School of Choueifat — Dubai (Al Sufouh)',
    operator: 'SABIS Network',
    city: 'Dubai',
    area: 'Al Sufouh',
    curriculum: 'SABIS (proprietary) — bridges British + American',
    examBoards: ['Cambridge IGCSE', 'Cambridge O Level', 'AS / A Level', 'AP (College Board)', 'SAT', 'TOEFL'],
    khdaRating: 'Acceptable',
    levels: {
      kg: 'KG1-KG2',
      primary: 'Grade 1-5',
      middle: 'Grade 6-8',
      secondary: 'Grade 9-12',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    notes: 'Original SABIS Dubai campus, opened 1993, ~4,000 students. Students may sit either British (IGCSE/A Level) or American (AP/SAT) external exams.',
    website: 'https://iscdubai.sabis.net',
    sources: [
      'https://iscdubai.sabis.net/',
      'https://web.khda.gov.ae/en/Educational-Consultation-for-Parents/SABIS-Curriculum',
      'https://whichschooladvisor.com/uae/school-review/the-international-school-of-choueifat-dubai',
    ],
    verified: true,
  },

  'choueifat-dubai-investment-park': {
    name: 'The International School of Choueifat — Dubai Investment Park',
    operator: 'SABIS Network',
    city: 'Dubai',
    area: 'Dubai Investment Park 1',
    curriculum: 'SABIS',
    examBoards: ['Cambridge IGCSE', 'AS / A Level', 'AP', 'SAT'],
    khdaRating: 'Acceptable',
    khdaRatingHistory: 'Acceptable for 8+ consecutive inspections',
    levels: {
      kg: 'KG1-KG2',
      primary: 'Grade 1-5',
      middle: 'Grade 6-8',
      secondary: 'Grade 9-12',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    notes: '~3,000 students KG1-Grade 12.',
    website: 'https://iscdip.sabis.net',
    sources: [
      'https://iscdip.sabis.net/',
      'https://edcare.ae/schools/the-international-school-of-choueifat-dubai-investment-park',
    ],
    verified: true,
  },

  // ---------------- Standalone British schools ----------------

  'kings-school-dubai': {
    name: "Kings' School Dubai (Umm Suqeim)",
    operator: "Kings' Education",
    city: 'Dubai',
    area: 'Umm Suqeim',
    curriculum: 'British (Primary only)',
    examBoards: [],
    khdaRating: 'Outstanding',
    khdaRatingHistory: 'Outstanding every year since KHDA inspections began in 2008',
    levels: { eyfs: 'FS1-FS2', primary: 'Year 1-6' },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    notes: 'Primary only. Pupils typically progress to Kings\' Al Barsha or other secondary providers.',
    website: 'https://kings-edu.com',
    sources: [
      'https://whichschooladvisor.com/uae/school-review/kings-school-dubai',
      'https://web.khda.gov.ae/en/Education-Directory/Schools/School-Details?Id=273&CenterID=115',
    ],
    verified: true,
  },

  'kings-school-al-barsha': {
    name: "Kings' School Al Barsha",
    operator: "Kings' Education",
    city: 'Dubai',
    area: 'Al Barsha',
    curriculum: 'British (all-through)',
    examBoards: ['GCSE', 'Cambridge IGCSE', 'Pearson Edexcel IGCSE', 'BTEC Level 2', 'A Level', 'BTEC Level 3'],
    khdaRating: 'Outstanding',
    levels: {
      eyfs: 'FS1-FS2',
      primary: 'Year 1-6',
      secondary: 'Year 7-11',
      sixthForm: 'Year 12-13 (A Level + BTEC L3)',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    website: 'https://kings-edu.com/albarsha',
    sources: [
      'https://whichschooladvisor.com/uae/school-review/kings-school-al-barsha',
      'https://edcare.ae/schools/kings-school-al-barsha',
    ],
    verified: true,
  },

  'jess-jumeirah': {
    name: 'Jumeirah English Speaking School (JESS) — Jumeirah',
    operator: 'JESS Dubai',
    city: 'Dubai',
    area: 'Jumeirah',
    curriculum: 'British (Primary)',
    examBoards: [],
    khdaRating: 'Outstanding',
    levels: { eyfs: 'FS1-FS2', primary: 'Year 1-6' },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    notes: 'Primary campus. Secondary students progress to JESS Arabian Ranches.',
    website: 'https://www.jess.sch.ae',
    sources: [
      'https://web.khda.gov.ae/en/Education-Directory/Schools/School-Details?Id=200&CenterID=51',
      'https://en.wikipedia.org/wiki/Jumeirah_English_Speaking_School',
    ],
    verified: true,
  },

  'jess-arabian-ranches': {
    name: 'Jumeirah English Speaking School (JESS) — Arabian Ranches',
    operator: 'JESS Dubai',
    city: 'Dubai',
    area: 'Arabian Ranches',
    curriculum: 'British + IB',
    examBoards: ['Cambridge IGCSE', 'Pearson Edexcel IGCSE / GCSE', 'IB Diploma', 'IB Career-related (linked to BTEC)'],
    khdaRating: 'Outstanding',
    levels: {
      eyfs: 'FS1-FS2',
      primary: 'Year 1-6',
      secondary: 'Year 7-11 (IGCSE/GCSE)',
      sixthForm: 'Year 12-13 (IB DP / IB CP)',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    notes: 'July 2025: average IB DP score 38; 2 students achieved 45/45; 33% scored 40+. Highest IB average in UAE.',
    website: 'https://www.jess.sch.ae',
    sources: [
      'https://whichschooladvisor.com/uae/school-review/jumeirah-english-speaking-school',
      'https://www.internationalschoolparent.com/schools/jess-dubai-english-school/',
    ],
    verified: true,
  },

  'desc-dubai-english-speaking-college': {
    name: 'Dubai English Speaking College (DESC)',
    operator: 'DESS / DESC Group',
    city: 'Dubai',
    area: 'Academic City',
    curriculum: 'British',
    examBoards: ['Cambridge IGCSE', 'Pearson Edexcel IGCSE / GCSE', 'AS / A Level', 'BTEC Level 3'],
    khdaRating: 'Outstanding',
    khdaRatingHistory: 'Outstanding every year since 2012-13',
    levels: {
      secondary: 'Year 7-11 (IGCSE/GCSE)',
      sixthForm: 'Year 12-13 (24+ A Level options + BTEC L3)',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    notes: 'Sixth Formers select 3 A Levels from 24 GCE options.',
    website: 'http://www.descdubai.com',
    sources: [
      'https://en.wikipedia.org/wiki/Dubai_English_Speaking_College',
      'https://whichschooladvisor.com/uae/school-review/dubai-english-speaking-college',
    ],
    verified: true,
  },

  'dubai-college': {
    name: 'Dubai College',
    operator: 'Independent (UK-style)',
    city: 'Dubai',
    area: 'Al Sufouh',
    curriculum: 'British',
    examBoards: ['GCSE (CAIE / Edexcel / AQA mix)', 'AS / A Level'],
    khdaRating: 'Outstanding',
    khdaRatingHistory: 'Outstanding for 12+ consecutive inspections',
    levels: {
      secondary: 'Year 7-11 (10 GCSEs + short-course ICT)',
      sixthForm: 'Year 12-13 (4 AS Levels narrowed to A Levels; minimum entry: 5 B grades at GCSE)',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    notes: 'Selective entry. Uses GCSE (not exclusively IGCSE). Strong Oxbridge/Russell Group destination record.',
    website: 'https://www.dubaicollege.org',
    sources: [
      'https://www.dubaicollege.org/academics/curriculum',
      'https://whichschooladvisor.com/uae/school-review/dubai-college',
    ],
    verified: true,
  },

  'repton-school-dubai': {
    name: 'Repton School Dubai',
    operator: 'Repton (UK partnership)',
    city: 'Dubai',
    area: 'Nad Al Sheba',
    curriculum: 'British + IB',
    examBoards: ['Cambridge IGCSE', 'Pearson Edexcel IGCSE', 'A Level (since Sep 2021)', 'IB Diploma', 'IB Career-related'],
    khdaRating: 'Outstanding',
    khdaRatingHistory: 'Outstanding for all 7 inspections since 2014-15',
    levels: {
      eyfs: 'FS1-FS2',
      primary: 'Year 1-6',
      secondary: 'Year 7-11 (IGCSE prep from Year 9; certificates after Year 11)',
      sixthForm: 'Year 12-13 (A Level / IBDP / IBCP)',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    website: 'https://www.reptondubai.org',
    sources: [
      'https://whichschooladvisor.com/uae/school-review/repton-school-dubai',
      'https://en.wikipedia.org/wiki/Repton_School_Dubai',
    ],
    verified: true,
  },

  // ---------------- Abu Dhabi ----------------

  'cranleigh-abu-dhabi': {
    name: 'Cranleigh Abu Dhabi',
    operator: 'Aldar Education (in partnership with Cranleigh UK)',
    city: 'Abu Dhabi',
    area: 'Saadiyat Island',
    curriculum: 'British',
    examBoards: ['Pearson Edexcel IGCSE', 'Pearson Edexcel A Level', 'BTEC Level 3'],
    adekRating: 'Outstanding',
    adekRatingHistory: 'Outstanding since 2018-19; reaffirmed in October 2025 ADEK Irtiqa inspection',
    levels: {
      eyfs: 'FS1-FS2',
      primary: 'Year 1-6',
      secondary: 'Year 7-11 (Edexcel IGCSE)',
      sixthForm: 'Year 12-13 (Edexcel A Level + BTEC L3 Business / Sport / IT)',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    notes: 'Compulsory IGCSEs: English Language, English Literature, Mathematics, Sciences. Arabic compulsory per ADEK.',
    website: 'https://www.cranleigh.ae',
    sources: [
      'https://schoolscompared.com/uae/school/cranleigh-abu-dhabi/curriculum-academics-results',
      'https://www.aldar.com/education/schools/cranleigh-abu-dhabi',
    ],
    verified: true,
  },

  'british-school-al-khubairat': {
    name: 'The British School Al Khubairat (BSAK)',
    operator: 'Al Khubairat Community School (independent, UK-linked)',
    city: 'Abu Dhabi',
    area: 'Mushrif',
    curriculum: 'British',
    examBoards: ['Cambridge IGCSE', 'Pearson Edexcel IGCSE', 'AS / A Level', 'BTEC Level 3'],
    adekRating: 'Outstanding (all 6 Irtiqaa standards)',
    accreditations: ['British Schools Overseas (BSO) — Outstanding'],
    levels: {
      eyfs: 'FS1-FS2',
      primary: 'Year 1-6',
      secondary: 'Year 7-11 (IGCSE)',
      sixthForm: 'Year 12-13 (23 A Level options + BTEC L3 Sport / Business / Engineering / E-Sports)',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    notes: '2024-25: 66% of IGCSE grades A*-A; 58% of A Level grades A*-A; 100% Distinction/Distinction* on BTEC. One of very few UAE schools holding Outstanding from BOTH ADEK and BSO.',
    website: 'https://www.britishschool.sch.ae',
    sources: [
      'https://edcare.ae/schools/the-british-school-al-khubairat/curriculum',
      'https://whichschooladvisor.com/uae/school-review/british-school-al-khubairat-abu-dhabi',
      'https://schoolscompared.com/uae/school/british-school-al-khubairat-abu-dhabi',
    ],
    verified: true,
  },

  // ---------------- IB-only ----------------

  'dubai-international-academy-emirates-hills': {
    name: 'Dubai International Academy — Emirates Hills',
    operator: 'Innoventures Education',
    city: 'Dubai',
    area: 'Emirates Hills',
    curriculum: 'IB (full continuum)',
    examBoards: ['IB PYP', 'IB MYP', 'IB Diploma', 'IB Career-related'],
    khdaRating: 'Outstanding',
    khdaRatingHistory: 'Outstanding 2022-23 and 2023-24 — only full-IB-continuum school in Dubai with this rating',
    levels: {
      primary: 'KG to Grade 5 (PYP)',
      middle: 'Grade 6-10 (MYP)',
      senior: 'Grade 11-12 (DP or CP)',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    notes: 'First school in UAE to offer the full IB continuum. ~2,700 students, 85+ nationalities. 100% IB DP pass rate; Class of 2024 secured $13M+ in scholarships.',
    website: 'https://www.diadubai.com',
    sources: [
      'https://en.wikipedia.org/wiki/Dubai_International_Academy',
      'https://whichschooladvisor.com/uae/school-review/dubai-international-academy-emirates-hills',
    ],
    verified: true,
  },

  // ---------------- Pakistani-curriculum (UAE expat) ----------------

  'pakistan-education-academy-dubai': {
    name: 'Pakistan Education Academy (PEA)',
    operator: 'Pakistan Association Dubai (community school)',
    city: 'Dubai',
    area: 'Oud Metha',
    curriculum: 'Pakistani (FBISE)',
    examBoards: ['FBISE — SSC (Grade 10)', 'FBISE — HSSC (Grade 12)'],
    khdaRating: 'Acceptable',
    levels: {
      primary: 'KG to Grade 5',
      middle: 'Grade 6-8',
      secondary: 'Grade 9-10 (SSC)',
      senior: 'Grade 11-12 (HSSC / FSc / FA)',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    notes: 'Affiliated to Federal Board of Intermediate and Secondary Education (FBISE), Islamabad. Serves Pakistani expat community in Dubai. Subjects include Islamiyat, Pakistan Studies, Urdu alongside Maths / Physics / Chemistry / Biology / CS in English.',
    website: 'https://www.pea.ae',
    sources: [
      'https://www.pea.ae/',
      'https://www.bayut.com/schools/pakistan-education-academy/',
    ],
    verified: true,
  },

  'pakistan-community-welfare-school-abu-dhabi': {
    name: 'Pakistan Community Welfare School (PCWS)',
    operator: 'Pakistan Community Welfare Society',
    city: 'Abu Dhabi',
    area: 'Al Mushrif',
    curriculum: 'Pakistani (FBISE)',
    examBoards: ['FBISE — SSC', 'FBISE — HSSC'],
    adekRating: 'Acceptable',
    levels: {
      primary: 'KG to Grade 5',
      secondary: 'Grade 6-10 (SSC)',
      senior: 'Grade 11-12 (HSSC)',
    },
    mandatorySubjects: UAE_MANDATORY_SUBJECTS,
    website: '',
    sources: [
      'https://www.bayut.com/schools/pakistan-community-welfare-school-abu-dhabi/',
    ],
    verified: false,
  },

  // ---------------- Reference school in Khurram's memory ----------------
  // NOTE: per project memory reference_haque_academy.md the school referenced
  // is "Cambridge KG-O Level". The only "Haque Academy" with public records
  // is in KARACHI, Pakistan (not Dubai). Including for cross-reference only.

  'haque-academy-karachi': {
    name: 'Haque Academy',
    operator: 'Independent (Cambridge Affiliate Centre)',
    city: 'Karachi',
    country: 'Pakistan',
    area: 'DHA',
    curriculum: 'British (Cambridge)',
    examBoards: ['Cambridge IGCSE', 'Cambridge O Level'],
    khdaRating: null,
    levels: {
      primary: 'Grade 1 onwards',
      secondary: 'O Level (typically 9 subjects: English Language, Mathematics, Urdu, Islamiat, Pakistan Studies + electives Physics / Chemistry / Biology)',
    },
    mandatorySubjects: ['Urdu', 'Islamiat', 'Pakistan Studies (per CAIE Pakistan track)'],
    notes: 'Established Aug 2008. Cambridge Affiliate Centre. Does NOT offer A Level. Referenced in Khurram\'s project memory (kids attend) — note this is a Karachi school, not a UAE/Dubai school despite memory tag.',
    website: 'https://www.haqueacademy.edu.pk',
    sources: [
      'https://www.haqueacademy.edu.pk/academics/olevel',
      'https://en.wikipedia.org/wiki/Haque_Academy',
    ],
    verified: true,
  },
};

// ---------------------------------------------------------------------------
// COMMONLY USED SUBJECT CODES (reference table)
// ---------------------------------------------------------------------------
// Cambridge codes are 4-digit (0xxx). Edexcel iGCSE codes start "4" (4MA1 etc).
// A Level Edexcel International (IAL) codes typically start "WMA" / "WPH" etc.

export const COMMON_SUBJECT_CODES = {
  cambridgeIGCSE: {
    'Mathematics (Core/Extended)': '0580',
    'Mathematics (Additional)': '0606',
    'Mathematics (International)': '0607',
    'English — First Language': '0500',
    'English — Second Language': '0510 / 0511',
    'English Literature': '0475',
    'Biology': '0610',
    'Chemistry': '0620',
    'Physics': '0625',
    'Combined Science': '0653',
    'Co-ordinated Sciences (Double)': '0654',
    'Computer Science': '0478',
    'ICT': '0417',
    'Economics': '0455',
    'Business Studies': '0450',
    'Geography': '0460',
    'History': '0470',
    'Arabic — First Language': '0508',
    'Arabic — Foreign Language': '0544',
    'Islamiyat': '0493',
    'Pakistan Studies': '0448',
    'Urdu — First Language': '0539',
  },
  cambridgeOLevel: {
    'Mathematics (Syllabus D)': '4024',
    'Additional Mathematics': '4037',
    'English Language': '1123',
    'Biology': '5090',
    'Chemistry': '5070',
    'Physics': '5054',
    'Islamiyat': '2058',
    'Pakistan Studies': '2059',
    'Urdu (First Language)': '3247',
    'Computer Science': '2210',
  },
  edexcelIGCSE: {
    'Mathematics A': '4MA1',
    'Mathematics B': '4MB1',
    'Further Pure Mathematics': '4PM1',
    'English Language A': '4EA1',
    'English Language B': '4EB1',
    'English Literature': '4ET1',
    'Biology': '4BI1',
    'Chemistry': '4CH1',
    'Physics': '4PH1',
    'Double Award Science': '4SD0',
    'Human Biology': '4HB1',
    'Computer Science': '4CP0',
    'ICT': '4IT1',
    'Economics': '4EC1',
    'Business': '4BS1',
    'Geography': '4GE1',
    'History': '4HI1',
    'Arabic (First Language)': '4AA1',
    'Arabic (Foreign Language)': '4AR1',
  },
  edexcelIAL: {
    'Mathematics': 'WMA',
    'Further Mathematics': 'WFM',
    'Physics': 'WPH',
    'Chemistry': 'WCH',
    'Biology': 'WBI',
    'Economics': 'WEC',
    'Business': 'WBS',
    'English Language': 'WEN',
    'English Literature': 'WET',
  },
};

// ---------------------------------------------------------------------------
// GROUP HELPERS
// ---------------------------------------------------------------------------

export const SCHOOLS_BY_CURRICULUM = {
  british: [
    'gems-jumeirah-college',
    'gems-wellington-academy-al-khail',
    'kings-school-dubai',
    'kings-school-al-barsha',
    'jess-jumeirah',
    'desc-dubai-english-speaking-college',
    'dubai-college',
    'cranleigh-abu-dhabi',
    'british-school-al-khubairat',
  ],
  britishPlusIB: [
    'gems-wellington-international',
    'gems-wellington-academy-silicon-oasis',
    'jess-arabian-ranches',
    'repton-school-dubai',
  ],
  ib: [
    'gems-world-academy',
    'dubai-international-academy-emirates-hills',
  ],
  indianCISCE: [
    'gems-modern-academy',
  ],
  sabis: [
    'choueifat-dubai-al-sufouh',
    'choueifat-dubai-investment-park',
  ],
  pakistani: [
    'pakistan-education-academy-dubai',
    'pakistan-community-welfare-school-abu-dhabi',
  ],
  // No CBSE schools currently captured in this KB (GEMS Modern is CISCE not CBSE).
  // Add CBSE schools (e.g. The Indian High School Dubai, Our Own English High) in future.
};

export const SCHOOLS_BY_CITY = {
  dubai: [
    'gems-wellington-international',
    'gems-wellington-academy-silicon-oasis',
    'gems-wellington-academy-al-khail',
    'gems-jumeirah-college',
    'gems-modern-academy',
    'gems-world-academy',
    'choueifat-dubai-al-sufouh',
    'choueifat-dubai-investment-park',
    'kings-school-dubai',
    'kings-school-al-barsha',
    'jess-jumeirah',
    'jess-arabian-ranches',
    'desc-dubai-english-speaking-college',
    'dubai-college',
    'repton-school-dubai',
    'dubai-international-academy-emirates-hills',
    'pakistan-education-academy-dubai',
  ],
  'abu-dhabi': [
    'cranleigh-abu-dhabi',
    'british-school-al-khubairat',
    'pakistan-community-welfare-school-abu-dhabi',
  ],
  karachi: [
    'haque-academy-karachi', // reference only — not a UAE school
  ],
};

export const SCHOOLS_BY_REGULATOR = {
  KHDA: SCHOOLS_BY_CITY.dubai,
  ADEK: SCHOOLS_BY_CITY['abu-dhabi'],
};

// ---------------------------------------------------------------------------
// LOOKUP HELPERS
// ---------------------------------------------------------------------------

export function findSchool(slug) {
  return UAE_SCHOOLS[slug] || null;
}

export function findSchoolsByCurriculum(curriculumKey) {
  return (SCHOOLS_BY_CURRICULUM[curriculumKey] || []).map((s) => UAE_SCHOOLS[s]);
}

export function findSchoolsByCity(city) {
  return (SCHOOLS_BY_CITY[city] || []).map((s) => UAE_SCHOOLS[s]);
}

export function getSubjectCode(board, subject) {
  const table = COMMON_SUBJECT_CODES[board];
  if (!table) return null;
  return table[subject] || null;
}

export function listOutstandingSchools() {
  return Object.entries(UAE_SCHOOLS)
    .filter(([, s]) => (s.khdaRating || '').startsWith('Outstanding') || (s.adekRating || '').startsWith('Outstanding'))
    .map(([slug, s]) => ({ slug, name: s.name, city: s.city }));
}

// ---------------------------------------------------------------------------
// BACKGROUND FACTS (for content generation context)
// ---------------------------------------------------------------------------

export const UAE_EDUCATION_FACTS = {
  totalPrivateSchools: '~220 (Dubai) + ~200 (Abu Dhabi)',
  curriculaInUAE: 17,
  topThreeCurricula: ['British (largest, ~40% market share of private students)', 'Indian (CBSE + CISCE)', 'American (AP / Common Core)'],
  britishExamBoardsUsed: ['Cambridge International (CAIE)', 'Pearson Edexcel International', 'OxfordAQA', 'AQA', 'WJEC/CBAC'],
  notable2026Disruption: 'June 2026 Cambridge IGCSE/O Level/AS/A Level exams cancelled in UAE; OxfordAQA also cancelled — students rebooked to alternative sittings.',
  gemsFootprint: 'GEMS Education operates 40+ schools across the UAE.',
  mandatoryAcrossAllCurricula: UAE_MANDATORY_SUBJECTS,
  regulators: REGULATORS,
};

export default UAE_SCHOOLS;
