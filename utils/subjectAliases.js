/**
 * utils/subjectAliases.js
 * Fuzzy matchers for subject/level/topic normalization.
 * Used by /api/ask and any unified search endpoint.
 *
 * Maps user-typed variations ("maths", "islamiat", "alevel") to
 * Cambridge canonical names used in the question_bank table.
 */

export const SUBJECT_ALIASES = {
  'maths': 'Mathematics',
  'math': 'Mathematics',
  'mathematics': 'Mathematics',
  'addmath': 'Additional Mathematics',
  'add maths': 'Additional Mathematics',
  'additional maths': 'Additional Mathematics',
  'additional mathematics': 'Additional Mathematics',
  'further maths': 'Further Mathematics',
  'physics': 'Physics',
  'chemistry': 'Chemistry',
  'chem': 'Chemistry',
  'biology': 'Biology',
  'bio': 'Biology',
  'english': 'English Language',
  'english language': 'English Language',
  'english literature': 'Literature in English',
  'literature': 'Literature in English',
  'pak studies': 'Pakistan Studies',
  'pakistan studies': 'Pakistan Studies',
  'pakstudies': 'Pakistan Studies',
  // Canonical: "Islamiat" (Cambridge spelling, confirmed from research on 10 Pakistani elite schools)
  'islamiat': 'Islamiat',
  'islamiyat': 'Islamiat',
  'islamic studies': 'Islamiat',
  'urdu': 'First Language Urdu',
  'urdu 1': 'First Language Urdu',
  'first language urdu': 'First Language Urdu',
  'second language urdu': 'Second Language Urdu',
  'urdu 2': 'Second Language Urdu',
  'cs': 'Computer Science',
  'computer science': 'Computer Science',
  'computing': 'Computer Science',
  'business': 'Business Studies',
  'business studies': 'Business Studies',
  'accounting': 'Accounting',
  'accounts': 'Accounting',
  'economics': 'Economics',
  'econ': 'Economics',
  'geography': 'Geography',
  'geo': 'Geography',
  'history': 'History',
  'sociology': 'Sociology',
  'statistics': 'Statistics',
  'stats': 'Statistics',

  // ── Edexcel iGCSE subject aliases ──────────────────────────
  '4ma1': 'Mathematics A (4MA1)',
  'mathematics a': 'Mathematics A (4MA1)',
  'maths a': 'Mathematics A (4MA1)',
  '4mb1': 'Mathematics B (4MB1)',
  'mathematics b': 'Mathematics B (4MB1)',
  'maths b': 'Mathematics B (4MB1)',
  '4pm1': 'Further Pure Mathematics (4PM1)',
  'further pure maths': 'Further Pure Mathematics (4PM1)',
  'further pure mathematics': 'Further Pure Mathematics (4PM1)',
  '4ph1': 'Physics (4PH1)',
  '4ch1': 'Chemistry (4CH1)',
  '4bi1': 'Biology (4BI1)',
  '4hb1': 'Human Biology (4HB1)',
  'human biology': 'Human Biology (4HB1)',
  '4ea1': 'English Language A (4EA1)',
  'english language a': 'English Language A (4EA1)',
  '4et1': 'English Literature (4ET1)',
  '4ec1': 'Economics (4EC1)',
  '4bs1': 'Business (4BS1)',
  '4ac1': 'Accounting (4AC1)',
  '4cp0': 'Computer Science (4CP0)',
  '4cm1': 'Commerce (4CM1)',
  '4ge1': 'Geography (4GE1)',
  '4hi1': 'History (4HI1)',
  '4it1': 'ICT (4IT1)',
  'ict edexcel': 'ICT (4IT1)',
  '4aa1': 'Arabic First Language (4AA1)',
  'arabic first language': 'Arabic First Language (4AA1)',
  '4rs1': 'Religious Studies (4RS1)',
  'religious studies': 'Religious Studies (4RS1)',
};

export const LEVEL_ALIASES = {
  'kg': 'KG',
  'primary': 'Primary',
  'middle': 'Middle',
  'matric': 'Matric',
  'olevel': 'O Level',
  'o level': 'O Level',
  'o-level': 'O Level',
  'igcse': 'O Level',
  'i-gcse': 'O Level',
  'gcse': 'O Level',
  'alevel': 'A Level',
  'a level': 'A Level',
  'a-level': 'A Level',
  'as level': 'A Level',
  'as / a level': 'A Level',
  'as/a level': 'A Level',
  'as': 'A Level',
  'a2': 'A Level',
  'sat': 'SAT',
  'sen': 'SEN',
  'special needs': 'SEN',
};

export function normalizeSubject(input) {
  if (!input) return null;
  const key = String(input).trim().toLowerCase();
  return SUBJECT_ALIASES[key] || input;
}

export function normalizeLevel(input) {
  if (!input) return null;
  const key = String(input).trim().toLowerCase();
  return LEVEL_ALIASES[key] || input;
}

export function normalizeTopic(input) {
  return input ? String(input).trim() : null;
}
