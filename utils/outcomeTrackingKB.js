/**
 * utils/outcomeTrackingKB.js
 * Outcome Tracking System — collect grade before/after to measure real impact.
 *
 * Flow:
 * 1. On registration: "What was your last predicted/actual grade?" → store grade_before
 * 2. After results day (August): email all students → collect grade_after
 * 3. Calculate: grade_improvement per student, aggregate % improved
 * 4. Publish: /our-results page with live running tally
 * 5. School reports: monthly automated per partner school
 */

// Cambridge grade point values for calculation
export const GRADE_POINTS = {
  'A*': 9, 'A': 8, 'B': 7, 'C': 6, 'D': 5, 'E': 4, 'U': 1,
  'a*': 9, 'a': 8, 'b': 7, 'c': 6, 'd': 5, 'e': 4, 'u': 1,
};

/**
 * Calculate grade improvement between before and after grades.
 * Returns: { improved: boolean, pointsGained: number, gradesGained: number }
 */
export function calculateImprovement(gradeBefore, gradeAfter) {
  const before = GRADE_POINTS[gradeBefore] || 0;
  const after = GRADE_POINTS[gradeAfter] || 0;
  const diff = after - before;

  return {
    improved: diff > 0,
    maintained: diff === 0,
    declined: diff < 0,
    pointsGained: diff,
    gradesGained: diff, // 1 point = 1 grade level
    gradeBefore,
    gradeAfter,
  };
}

/**
 * Aggregate outcomes across multiple students.
 * Input: array of { gradeBefore, gradeAfter }
 * Output: platform-wide statistics for /our-results
 */
export function aggregateOutcomes(outcomes) {
  if (!outcomes?.length) return { totalStudents: 0, improved: 0, percentImproved: 0 };

  let improved = 0;
  let totalGain = 0;
  let maintained = 0;

  for (const o of outcomes) {
    const result = calculateImprovement(o.gradeBefore, o.gradeAfter);
    if (result.improved) {
      improved++;
      totalGain += result.pointsGained;
    } else if (result.maintained) {
      maintained++;
    }
  }

  return {
    totalStudents: outcomes.length,
    improved,
    maintained,
    declined: outcomes.length - improved - maintained,
    percentImproved: Math.round((improved / outcomes.length) * 100),
    averageGradeGain: improved > 0 ? Math.round((totalGain / improved) * 10) / 10 : 0,
    percentMaintainedOrImproved: Math.round(((improved + maintained) / outcomes.length) * 100),
  };
}

/**
 * Generate a school partnership report.
 * Used for UJALA, Garage School, Deaf Reach partner reporting.
 */
export function generateSchoolReport(schoolName, students) {
  const active = students.filter(s => s.sessionsCompleted > 0);
  const withOutcomes = students.filter(s => s.gradeBefore && s.gradeAfter);
  const outcomes = withOutcomes.length > 0 ? aggregateOutcomes(withOutcomes) : null;

  const totalSessions = active.reduce((sum, s) => sum + (s.sessionsCompleted || 0), 0);
  const totalTopics = active.reduce((sum, s) => sum + (s.topicsCovered || 0), 0);
  const avgMinutes = active.length > 0
    ? Math.round(active.reduce((sum, s) => sum + (s.totalMinutes || 0), 0) / active.length)
    : 0;

  return {
    schoolName,
    reportDate: new Date().toISOString().split('T')[0],
    period: 'Monthly',

    engagement: {
      totalStudents: students.length,
      activeStudents: active.length,
      activationRate: Math.round((active.length / Math.max(1, students.length)) * 100),
      totalSessions,
      totalTopicsCovered: totalTopics,
      averageStudyMinutesPerStudent: avgMinutes,
    },

    outcomes: outcomes || { status: 'Awaiting exam results' },

    subjects: (() => {
      const subjectMap = {};
      active.forEach(s => {
        (s.subjects || []).forEach(subj => {
          if (!subjectMap[subj]) subjectMap[subj] = 0;
          subjectMap[subj]++;
        });
      });
      return Object.entries(subjectMap)
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, studentsUsing: count }));
    })(),
  };
}

/**
 * Email template for post-results grade collection.
 * Sent after Cambridge results day (August).
 */
export const RESULTS_COLLECTION_EMAIL = {
  subject: 'Tell Starky your Cambridge results — get your certificate!',
  triggerMonth: 8, // August
  body: `Hi {{name}},

Cambridge results are out! Tell Starky your grades and claim your personalised results certificate.

It takes 30 seconds:
1. Visit: https://newworld.education/our-results
2. Enter your results for each subject
3. Download your Starky Certificate

Your results help us improve Starky for the next generation of students.

With pride,
Starky & the NewWorldEdu team`,
};

/**
 * Outcome display text for the /our-results page.
 */
export function getOutcomeDisplayText(aggregated) {
  if (!aggregated || aggregated.totalStudents === 0) {
    return {
      headline: 'Results coming soon',
      subheadline: 'Our first cohort is sitting Cambridge exams this May/June 2026.',
      stats: [],
    };
  }

  return {
    headline: `${aggregated.percentImproved}% of Starky students improved their Cambridge grade`,
    subheadline: `Based on ${aggregated.totalStudents} students who shared their results`,
    stats: [
      { label: 'Students improved', value: `${aggregated.improved}/${aggregated.totalStudents}`, highlight: true },
      { label: 'Average grade gain', value: `+${aggregated.averageGradeGain} grades`, highlight: true },
      { label: 'Maintained or improved', value: `${aggregated.percentMaintainedOrImproved}%`, highlight: false },
    ],
  };
}
