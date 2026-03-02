// utils/sessionAnalysis.js
export function getDefaultAnalysis(studentName, subject, isSEN) {
  if (isSEN) {
    return {
      topicsCovered: [subject], focusDurationMinutes: 15, emotionalComfort: 'comfortable',
      independentResponses: 5, communicationAttempts: 8,
      strengths: ['Showed up and engaged'], supportsNeeded: ['Continued patient support'],
      nextGoals: ['Continue building on today'],
      starkyPersonalMessage: `You did wonderfully today, ${studentName}. I'm so proud of you. ★`,
      parentSummary: `${studentName} had a positive session today working on ${subject}.`,
      overallMood: 'positive', progressIndicators: ['Engaged with session']
    };
  }
  return {
    topicsCovered: [subject], accuracyPercent: 70, durationMinutes: 20,
    strengths: ['Engaged with the material'], weakAreas: ['Continue practising'],
    nextGoals: [`Review ${subject} concepts covered today`],
    starkyPersonalMessage: `Great work today, ${studentName}! Keep going. ★`,
    parentSummary: `${studentName} had a productive session working on ${subject} today.`,
    overallMood: 'positive', engagementLevel: 'medium',
    careerConnection: `${subject} skills open many career doors.`
  };
}

export function getDefaultStudyPlan(studentName, grade, subjects) {
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
  return {
    weekOf: new Date().toDateString(), studentName, grade,
    days: days.map((day, i) => ({ day, sessions: [{ subject: subjects[i % subjects.length], topic: 'Review and practice', duration: '30 minutes', focusArea: 'Core concepts', tip: 'Start with what you find easiest to build momentum' }] })),
    weeklyGoal: 'Build consistency and confidence in all subjects',
    parentTip: `Ask "${studentName}, what was the most interesting thing Starky taught you today?"`
  };
}
