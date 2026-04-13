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
