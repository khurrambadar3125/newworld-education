/**
 * patternEngine.js
 * Nightly pattern analysis — reads day's signals from Supabase,
 * identifies what's working and what's not.
 */

import { getSupabase } from './supabase';

/**
 * Analyse all signals from a given date.
 */
export async function analyseDay(date) {
  const sb = getSupabase();
  if (!sb) return { date, error: 'No Supabase' };

  const dayStart = `${date}T00:00:00Z`;
  const dayEnd = `${date}T23:59:59Z`;

  const insights = {
    date,
    totalMessages: 0,
    totalDrills: 0,
    totalConfusions: 0,
    uniqueStudents: 0,
    topConfusionTopics: [],
    gradeActivity: {},
    subjectActivity: {},
    languageBreakdown: {},
    hourlyActivity: new Array(24).fill(0),
    sentimentBreakdown: { positive: 0, neutral: 0, frustrated: 0, confused: 0 },
    dropoffStages: {},
  };

  // ── Message signals ────────────────────────────────────────────────
  const { data: messages } = await sb.from('student_signals')
    .select('email, subject, grade, language, sentiment, metadata')
    .gte('created_at', dayStart).lte('created_at', dayEnd)
    .limit(10000);

  if (messages?.length) {
    insights.totalMessages = messages.length;
    const students = new Set();
    for (const m of messages) {
      students.add(m.email);
      if (m.grade) insights.gradeActivity[m.grade] = (insights.gradeActivity[m.grade] || 0) + 1;
      if (m.subject) insights.subjectActivity[m.subject] = (insights.subjectActivity[m.subject] || 0) + 1;
      if (m.language) insights.languageBreakdown[m.language] = (insights.languageBreakdown[m.language] || 0) + 1;
      if (m.sentiment) insights.sentimentBreakdown[m.sentiment] = (insights.sentimentBreakdown[m.sentiment] || 0) + 1;
      const hour = m.metadata?.hourOfDay;
      if (hour !== undefined) insights.hourlyActivity[hour]++;
    }
    insights.uniqueStudents = students.size;
  }

  // ── Confusion signals ──────────────────────────────────────────────
  const { data: confusions } = await sb.from('confusion_signals')
    .select('topic, grade, confusion_type, email')
    .gte('created_at', dayStart).lte('created_at', dayEnd)
    .limit(5000);

  if (confusions?.length) {
    insights.totalConfusions = confusions.length;
    const topicMap = {};
    for (const c of confusions) {
      const t = c.topic || 'unknown';
      if (!topicMap[t]) topicMap[t] = { count: 0, students: new Set() };
      topicMap[t].count++;
      topicMap[t].students.add(c.email);
    }
    insights.topConfusionTopics = Object.entries(topicMap)
      .map(([topic, d]) => ({ topic, confusionCount: d.count, uniqueStudents: d.students.size }))
      .sort((a, b) => b.confusionCount - a.confusionCount)
      .slice(0, 10);
  }

  // ── Drill signals ──────────────────────────────────────────────────
  const { count: drillCount } = await sb.from('drill_signals')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', dayStart).lte('created_at', dayEnd);
  insights.totalDrills = drillCount || 0;

  // ── Dropoff signals ────────────────────────────────────────────────
  const { data: dropoffs } = await sb.from('dropoff_signals')
    .select('stage')
    .gte('created_at', dayStart).lte('created_at', dayEnd)
    .limit(5000);

  if (dropoffs?.length) {
    for (const d of dropoffs) {
      const s = d.stage || 'unknown';
      insights.dropoffStages[s] = (insights.dropoffStages[s] || 0) + 1;
    }
  }

  return insights;
}

/**
 * Identify topics needing auto-discovered confusion alerts (last 7 days).
 * Only returns topics where 10+ unique students showed confusion.
 */
export async function identifyConfusionTopics() {
  const sb = getSupabase();
  if (!sb) return [];

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { data } = await sb.from('confusion_signals')
    .select('topic, grade, email, confusion_type, original_question')
    .gte('created_at', weekAgo.toISOString())
    .limit(5000);

  if (!data?.length) return [];

  const topicMap = {};
  for (const c of data) {
    const t = c.topic || 'unknown';
    if (!topicMap[t]) topicMap[t] = { students: new Set(), count: 0, examples: [], grade: c.grade };
    topicMap[t].students.add(c.email);
    topicMap[t].count++;
    if (topicMap[t].examples.length < 5) {
      topicMap[t].examples.push({ question: c.original_question?.substring(0, 150), type: c.confusion_type });
    }
  }

  return Object.entries(topicMap)
    .filter(([_, d]) => d.students.size >= 10) // Conservative: 10+ students
    .map(([topic, d]) => ({
      topic,
      grade: d.grade,
      uniqueStudents: d.students.size,
      totalConfusions: d.count,
      examples: d.examples,
    }))
    .sort((a, b) => b.uniqueStudents - a.uniqueStudents);
}
