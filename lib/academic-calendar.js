/**
 * lib/academic-calendar.js
 * Cambridge Academic Year Lifecycle System
 * Self-maintaining — automatically transitions between phases.
 * PERMANENT: This system drives Starky's behaviour across the entire year.
 */

export const CAMBRIDGE_CALENDAR = {
  series: [
    {
      name: "May/June 2026",
      exam_start: "2026-04-27",
      exam_end: "2026-06-09",
      results_date: "2026-08-13",
      registration_deadline: "2026-02-10",
      sprint_start: "2026-03-16",
    },
    {
      name: "Oct/Nov 2026",
      exam_start: "2026-09-28",
      exam_end: "2026-11-15",
      results_date: "2027-01-15",
      registration_deadline: "2026-08-06",
      sprint_start: "2026-08-17",
    },
    {
      name: "May/June 2027",
      exam_start: "2027-04-26",
      exam_end: "2027-06-08",
      results_date: "2027-08-12",
      registration_deadline: "2027-02-09",
      sprint_start: "2027-03-15",
    },
    {
      name: "Oct/Nov 2027",
      exam_start: "2027-09-27",
      exam_end: "2027-11-14",
      results_date: "2028-01-14",
      registration_deadline: "2027-08-05",
      sprint_start: "2027-08-16",
    },
    {
      name: "May/June 2028",
      exam_start: "2028-04-24",
      exam_end: "2028-06-07",
      results_date: "2028-08-10",
      registration_deadline: "2028-02-08",
      sprint_start: "2028-03-13",
    },
  ],
};

/**
 * Get the current academic phase for a student.
 * @param {string} studentExamSeries — e.g. "May/June 2026"
 * @returns {{ phase: string, daysUntil: number, milestone: string, series: object }}
 */
export function getCurrentPhase(studentExamSeries) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the student's exam series
  const series = CAMBRIDGE_CALENDAR.series.find(s => s.name === studentExamSeries);

  // If no series specified, find the next upcoming one
  const activeSeries = series || CAMBRIDGE_CALENDAR.series.find(s => new Date(s.exam_start) > today) || CAMBRIDGE_CALENDAR.series[0];

  const sprintStart = new Date(activeSeries.sprint_start);
  const examStart = new Date(activeSeries.exam_start);
  const examEnd = new Date(activeSeries.exam_end);
  const resultsDate = new Date(activeSeries.results_date);
  const resultsWeekEnd = new Date(resultsDate);
  resultsWeekEnd.setDate(resultsWeekEnd.getDate() + 7);

  const daysTo = (d) => Math.ceil((d.getTime() - today.getTime()) / 86400000);

  if (today >= sprintStart && today < examStart) {
    return { phase: 'FINAL_SPRINT', daysUntil: daysTo(examStart), milestone: 'Exams begin', series: activeSeries };
  }
  if (today >= examStart && today <= examEnd) {
    return { phase: 'EXAM_SERIES', daysUntil: daysTo(examEnd), milestone: 'Last paper', series: activeSeries };
  }
  if (today > examEnd && today < resultsDate) {
    return { phase: 'RESULTS_WAITING', daysUntil: daysTo(resultsDate), milestone: 'Results day', series: activeSeries };
  }
  if (today >= resultsDate && today <= resultsWeekEnd) {
    return { phase: 'RESULTS_DAY', daysUntil: 0, milestone: 'Results released', series: activeSeries };
  }

  // Check if we're in the build-up phase (Feb → sprint)
  const buildUpStart = new Date(activeSeries.sprint_start);
  buildUpStart.setMonth(buildUpStart.getMonth() - 2); // ~2 months before sprint
  if (today >= buildUpStart && today < sprintStart) {
    return { phase: 'BUILD_UP', daysUntil: daysTo(examStart), milestone: 'Exams', series: activeSeries };
  }

  // Default: foundation phase
  return { phase: 'FOUNDATION', daysUntil: daysTo(examStart), milestone: 'Next exams', series: activeSeries };
}

/**
 * Get the phase-specific Starky system prompt injection.
 */
export function getPhasePromptInjection(phase, daysUntil, seriesName) {
  const prompts = {
    FINAL_SPRINT: `ACADEMIC PHASE: FINAL SPRINT — ${daysUntil} days until ${seriesName} exams.
Focus exclusively on: past paper questions and mark scheme technique, common examiner errors for weak topics, exam timing and technique. Do NOT introduce new concepts. Do NOT explore tangents. Every response must earn marks.`,

    EXAM_SERIES: `ACADEMIC PHASE: EXAMS IN PROGRESS — ${seriesName}.
If student discusses a paper they just sat: do NOT mark it or tell them if they got it wrong. Redirect to the next paper. Keep them calm and forward-looking. If they ask about the next paper: focus on technique and key topics. Keep it concise — they need sleep.`,

    RESULTS_WAITING: `ACADEMIC PHASE: WAITING FOR RESULTS — approximately ${daysUntil} days until results.
Keep sessions light and exploratory. Forward-looking (next year content). Confidence-building. Do not reference past exam performance or second-guess their answers.`,

    RESULTS_DAY: `ACADEMIC PHASE: RESULTS RELEASED TODAY.
Read the student's emotional state first. Ask how they feel before giving any academic guidance. If disappointed: empathy before information. Never minimise. If happy: celebrate genuinely then guide what comes next.`,

    FOUNDATION: `ACADEMIC PHASE: FOUNDATION — ${daysUntil} days until next exams.
Focus on deep concept understanding, building strong foundations, making learning enjoyable. No exam pressure yet. Explore widely. Build curiosity. The exam will come — but not yet.`,

    BUILD_UP: `ACADEMIC PHASE: BUILD-UP — ${daysUntil} days until exams.
Transition from foundation to preparation. Begin past paper practice. Topic completion checks. Weakness identification accelerating. Urgency building but not yet exam-mode.`,
  };

  return prompts[phase] || prompts.FOUNDATION;
}
