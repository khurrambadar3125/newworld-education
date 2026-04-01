/**
 * gradePredictionEngine.js — Cambridge Grade Boundaries & Prediction
 *
 * Official Cambridge CAIE grade thresholds from published documents.
 * Used to predict grades based on student performance in practice tests.
 *
 * Sources: Cambridge CAIE official grade threshold documents.
 * Only verified data from published documents. Never estimated.
 */

// ── GRADE BOUNDARIES ──────────────────────────────────────────
// Each entry: { maxMarks, grades, note, source }
// Grades are MINIMUM marks needed for each grade.

const GRADE_BOUNDARIES = {

  // ── PAKISTAN STUDIES 2059 — June 2021 ──
  // Source: Cambridge CAIE 2059_s21_gt Official Grade Thresholds
  pakistan_studies_s21_p1: {
    maxMarks: 75,
    A: 46, B: 37, C: 29, D: 23, E: 18,
    note: 'Component 1 — History and Culture of Pakistan. Source: Cambridge 2059 June 2021 Grade Thresholds',
  },
  pakistan_studies_s21_p2: {
    maxMarks: 75,
    A: 45, B: 38, C: 31, D: 25, E: 19,
    note: 'Component 2 — Environment of Pakistan. Source: Cambridge 2059 June 2021 Grade Thresholds',
  },
  pakistan_studies_s21_overall: {
    maxMarks: 150,
    'A*': 107, A: 91, B: 75, C: 60, D: 48, E: 37,
    note: 'Overall combined grade. Maximum 150 after weighting. Components 01 and 02 combined. A* does not exist at individual component level — only overall. Source: Cambridge 2059 June 2021 Grade Thresholds',
  },

  // ── PAKISTAN STUDIES 2059 — November 2021 ──
  // Source: Cambridge CAIE 2059_w21_gt Official Grade Thresholds
  pakistan_studies_w21_p1: {
    maxMarks: 75,
    A: 46, B: 38, C: 31, D: 24, E: 18,
    note: 'Component 1 — History and Culture of Pakistan. Source: Cambridge 2059 November 2021 Grade Thresholds',
  },
  pakistan_studies_w21_p2: {
    maxMarks: 75,
    A: 42, B: 35, C: 27, D: 23, E: 18,
    note: 'Component 2 — Environment of Pakistan. Source: Cambridge 2059 November 2021 Grade Thresholds',
  },
  pakistan_studies_w21_overall: {
    maxMarks: 150,
    'A*': 103, A: 88, B: 73, C: 58, D: 47, E: 36,
    note: 'Overall combined grade. Source: Cambridge 2059 November 2021 Grade Thresholds',
  },

  // ── June 2022 ──
  pakistan_studies_s22_p1: { maxMarks: 75, A: 45, B: 36, C: 27, D: 22, E: 17, note: 'Source: Cambridge 2059 June 2022' },
  pakistan_studies_s22_p2: { maxMarks: 75, A: 45, B: 37, C: 29, D: 23, E: 18, note: 'Source: Cambridge 2059 June 2022' },
  pakistan_studies_s22_overall: { maxMarks: 150, 'A*': 107, A: 90, B: 73, C: 56, D: 45, E: 35, note: 'Source: Cambridge 2059 June 2022' },

  // ── November 2022 ──
  pakistan_studies_w22_p1: { maxMarks: 75, A: 46, B: 38, C: 30, D: 23, E: 15, note: 'Source: Cambridge 2059 November 2022' },
  pakistan_studies_w22_p2: { maxMarks: 75, A: 43, B: 34, C: 26, D: 19, E: 13, note: 'Source: Cambridge 2059 November 2022' },
  pakistan_studies_w22_overall: { maxMarks: 150, 'A*': 106, A: 89, B: 72, C: 56, D: 42, E: 28, note: 'Source: Cambridge 2059 November 2022' },

  // ── June 2023 ──
  pakistan_studies_s23_p1: { maxMarks: 75, A: 45, B: 37, C: 29, D: 23, E: 17, note: 'Source: Cambridge 2059 June 2023' },
  pakistan_studies_s23_p2: { maxMarks: 75, A: 46, B: 37, C: 28, D: 23, E: 18, note: 'Source: Cambridge 2059 June 2023' },
  pakistan_studies_s23_overall: { maxMarks: 150, 'A*': 108, A: 91, B: 74, C: 57, D: 46, E: 35, note: 'Source: Cambridge 2059 June 2023' },

  // ── November 2023 ──
  pakistan_studies_w23_p1: { maxMarks: 75, A: 46, B: 37, C: 28, D: 22, E: 16, note: 'Source: Cambridge 2059 November 2023' },
  pakistan_studies_w23_p2: { maxMarks: 75, A: 45, B: 36, C: 27, D: 22, E: 17, note: 'Source: Cambridge 2059 November 2023' },
  pakistan_studies_w23_overall: { maxMarks: 150, 'A*': 109, A: 91, B: 73, C: 55, D: 44, E: 33, note: 'Source: Cambridge 2059 November 2023' },

  // ── June 2024 ──
  pakistan_studies_s24_p1: { maxMarks: 75, A: 47, B: 39, C: 32, D: 26, E: 20, note: 'Source: Cambridge 2059 June 2024' },
  pakistan_studies_s24_p2: { maxMarks: 75, A: 47, B: 38, C: 29, D: 23, E: 18, note: 'Source: Cambridge 2059 June 2024' },
  pakistan_studies_s24_overall: { maxMarks: 150, 'A*': 111, A: 94, B: 77, C: 61, D: 49, E: 38, note: 'Source: Cambridge 2059 June 2024' },

  // ── November 2024 ──
  pakistan_studies_w24_p1: { maxMarks: 75, A: 48, B: 40, C: 31, D: 25, E: 20, note: 'Source: Cambridge 2059 November 2024' },
  pakistan_studies_w24_p2: { maxMarks: 75, A: 50, B: 40, C: 31, D: 26, E: 21, note: 'Source: Cambridge 2059 November 2024' },
  pakistan_studies_w24_overall: { maxMarks: 150, 'A*': 116, A: 98, B: 80, C: 62, D: 51, E: 41, note: 'Source: Cambridge 2059 November 2024' },

  // ── June 2025 ──
  pakistan_studies_s25_p1: { maxMarks: 75, A: 44, B: 36, C: 29, D: 23, E: 18, note: 'Source: Cambridge 2059 June 2025' },
  pakistan_studies_s25_p2: { maxMarks: 75, A: 48, B: 39, C: 30, D: 25, E: 20, note: 'Source: Cambridge 2059 June 2025' },
  pakistan_studies_s25_overall: { maxMarks: 150, 'A*': 109, A: 92, B: 75, C: 59, D: 48, E: 38, note: 'Source: Cambridge 2059 June 2025' },

  // ── November 2025 ──
  pakistan_studies_w25_p1: { maxMarks: 75, A: 49, B: 40, C: 31, D: 26, E: 21, note: 'Source: Cambridge 2059 November 2025' },
  pakistan_studies_w25_p2: { maxMarks: 75, A: 53, B: 44, C: 35, D: 30, E: 25, note: 'Source: Cambridge 2059 November 2025' },
  pakistan_studies_w25_overall: { maxMarks: 150, 'A*': 120, A: 102, B: 84, C: 66, D: 56, E: 46, note: 'Source: Cambridge 2059 November 2025' },

};

// ── GRADE PREDICTION ──────────────────────────────────────────

/**
 * Predict grade from marks and subject/component.
 * @param {string} key - e.g. 'pakistan_studies_p1', 'pakistan_studies_overall'
 * @param {number} marks - student's marks
 * @returns {{ grade: string, percentage: number, nextGrade: string|null, marksNeeded: number|null }}
 */
function predictGrade(key, marks) {
  const boundary = GRADE_BOUNDARIES[key];
  if (!boundary) return { grade: 'Unknown', percentage: 0, nextGrade: null, marksNeeded: null };

  const percentage = Math.round((marks / boundary.maxMarks) * 100);

  // Grade order from highest to lowest
  const grades = ['A*', 'A', 'B', 'C', 'D', 'E'];
  let grade = 'U'; // Ungraded
  let nextGrade = null;
  let marksNeeded = null;

  for (const g of grades) {
    if (boundary[g] !== undefined && marks >= boundary[g]) {
      grade = g;
      // Find next grade up
      const idx = grades.indexOf(g);
      if (idx > 0) {
        const higher = grades[idx - 1];
        if (boundary[higher] !== undefined) {
          nextGrade = higher;
          marksNeeded = boundary[higher] - marks;
        }
      }
      break;
    }
  }

  // If ungraded, next grade is E
  if (grade === 'U' && boundary.E !== undefined) {
    nextGrade = 'E';
    marksNeeded = boundary.E - marks;
  }

  return { grade, percentage, nextGrade, marksNeeded };
}

/**
 * Get all available boundaries for a subject.
 * @param {string} subject - e.g. 'pakistan_studies'
 * @returns {Object} all matching boundaries
 */
function getBoundariesForSubject(subject) {
  const results = {};
  for (const [key, value] of Object.entries(GRADE_BOUNDARIES)) {
    if (key.startsWith(subject)) {
      results[key] = value;
    }
  }
  return results;
}

module.exports = {
  GRADE_BOUNDARIES,
  predictGrade,
  getBoundariesForSubject,
};
