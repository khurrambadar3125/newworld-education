/**
 * subjectCatalog.js — single source of truth for filtering Pakistan-only subjects
 * out of UAE views (unless UAE family selected the Pakistani curriculum).
 *
 * Used by: home.jsx, study.jsx, past-papers.jsx, drill.jsx, mocks.jsx, nano.jsx,
 * special-needs.jsx, _app.jsx, StarkyBubble.jsx.
 */

// List of Pakistan-only subjects/IDs to strip from UAE users.
export const PAKISTAN_ONLY_SUBJECTS = [
  'Pakistan Studies', 'Islamiyat', 'Islamiat',
  'First Language Urdu', 'Second Language Urdu', 'Urdu',
  'Nazra Quran', 'Sindhi', 'Pashto',
  'Pakistan Studies (2059)', 'Islamiyat (2058)', 'Urdu (3247)',
  'pakistan_studies', 'islamiyat', 'urdu', // atom subject IDs
];

/**
 * Filter a list of subjects for a given country + curriculum.
 * Subjects can be strings or objects ({ id, name, label, title }).
 * UAE users always get Pakistan content stripped, UNLESS their UAE curriculum
 * is 'pakistani' (Pakistani-school expats who still want PK subjects).
 */
export function filterForCountry(subjects, userCountry, uaeCurriculum) {
  if (!Array.isArray(subjects)) return subjects;
  if (userCountry !== 'UAE') return subjects;
  if (uaeCurriculum === 'pakistani') return subjects;
  return subjects.filter(s => {
    const name = typeof s === 'string'
      ? s
      : (s?.name || s?.label || s?.id || s?.title || '');
    if (!name) return true;
    return !PAKISTAN_ONLY_SUBJECTS.some(pk => name === pk || name.includes(pk));
  });
}

/**
 * Check a single subject name/id against the Pakistan-only list.
 */
export function isPakistanOnlySubject(subjectName) {
  if (!subjectName) return false;
  return PAKISTAN_ONLY_SUBJECTS.some(pk =>
    subjectName === pk || subjectName.includes(pk)
  );
}
