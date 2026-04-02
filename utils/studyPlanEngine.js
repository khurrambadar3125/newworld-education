/**
 * utils/studyPlanEngine.js — Intelligent Study Plan Generator
 * ─────────────────────────────────────────────────────────────────
 * Takes: subject, exam date, current mastery levels, available time
 * Returns: week-by-week plan with daily activities
 * Prioritizes: weak topics first, high-mark topics first, spaced review throughout
 */

import { getSupabase } from './supabase';
import { getSubjectMastery } from './masteryEngine';
import { getDueCount } from './spacedRepEngine';

/**
 * Get all unique topics for a subject from the question bank
 */
export async function getSubjectTopics(subject, level = 'O Level') {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('question_bank')
    .select('topic')
    .eq('subject', subject)
    .eq('level', level)
    .eq('verified', true)
    .not('topic', 'is', null);

  if (error || !data) return [];

  // Count questions per topic
  const counts = {};
  for (const row of data) {
    const t = row.topic?.trim();
    if (!t || t === 'General') continue;
    counts[t] = (counts[t] || 0) + 1;
  }

  return Object.entries(counts)
    .filter(([, count]) => count >= 3) // Only topics with enough questions
    .map(([topic, count]) => ({ topic, questionCount: count }))
    .sort((a, b) => b.questionCount - a.questionCount);
}

/**
 * Generate a study plan
 */
export async function generateStudyPlan(userId, subject, level = 'O Level', examDate, hoursPerWeek = 5) {
  // Get all topics and current mastery
  const [topics, mastery] = await Promise.all([
    getSubjectTopics(subject, level),
    getSubjectMastery(userId, subject, level),
  ]);

  if (topics.length === 0) return { error: 'No topics found for this subject' };

  // Map mastery by topic
  const masteryMap = {};
  for (const m of mastery) {
    masteryMap[m.topic] = m;
  }

  // Score topics by priority: weak + frequent in exams = highest priority
  const prioritized = topics.map(t => {
    const m = masteryMap[t.topic];
    const masteryLevel = m?.mastery_level || 0;
    const accuracy = m && m.questions_attempted > 0 ? m.questions_correct / m.questions_attempted : 0;

    // Priority score: lower mastery = higher priority, more questions = more important
    let priority = (5 - masteryLevel) * 20; // 0-100 based on mastery gap
    priority += Math.min(t.questionCount / 2, 20); // 0-20 based on exam frequency
    if (accuracy < 0.5 && m?.questions_attempted >= 5) priority += 30; // Bonus for truly weak topics
    if (masteryLevel === 0) priority += 15; // Never attempted bonus

    return { ...t, masteryLevel, accuracy: Math.round(accuracy * 100), priority };
  }).sort((a, b) => b.priority - a.priority);

  // Calculate weeks until exam
  const now = new Date();
  const exam = examDate ? new Date(examDate) : new Date(now.getTime() + 8 * 7 * 24 * 60 * 60 * 1000);
  const weeksUntilExam = Math.max(1, Math.round((exam - now) / (7 * 24 * 60 * 60 * 1000)));

  // Distribute topics across weeks
  const plan = [];
  const topicsPerWeek = Math.ceil(prioritized.length / Math.max(weeksUntilExam - 1, 1)); // Save last week for review

  for (let w = 0; w < weeksUntilExam; w++) {
    const isLastWeek = w === weeksUntilExam - 1;
    const isSecondLast = w === weeksUntilExam - 2;

    if (isLastWeek) {
      // Last week: full mock + targeted review
      plan.push({
        week: w + 1,
        focus: 'Final Review',
        activities: [
          { type: 'mock', description: 'Full mock exam under timed conditions' },
          { type: 'review', description: 'Review all mistakes from the mock' },
          { type: 'sr_review', description: 'Clear all spaced repetition reviews' },
          { type: 'weak_focus', description: 'Targeted practice on weakest 3 topics', topics: prioritized.slice(0, 3).map(t => t.topic) },
          { type: 'exam_technique', description: 'Command word practice + time management' },
        ],
      });
    } else if (isSecondLast) {
      // Second to last: mock + review
      plan.push({
        week: w + 1,
        focus: 'Mock Practice',
        activities: [
          { type: 'mock', description: 'Practice mock exam' },
          { type: 'review', description: 'Review mock results + study weak areas' },
          { type: 'sr_review', description: 'Daily spaced repetition reviews' },
          { type: 'mixed_practice', description: 'Mixed-topic practice (interleaving)' },
        ],
      });
    } else {
      // Regular week: learn new topics + review
      const weekTopics = prioritized.slice(w * topicsPerWeek, (w + 1) * topicsPerWeek);
      plan.push({
        week: w + 1,
        focus: weekTopics.length > 0 ? weekTopics.map(t => t.topic).join(', ') : 'Review',
        topics: weekTopics.map(t => ({
          topic: t.topic,
          masteryLevel: t.masteryLevel,
          accuracy: t.accuracy,
          targetLevel: Math.min(t.masteryLevel + 2, 4),
        })),
        activities: [
          { type: 'sr_review', description: 'Daily spaced repetition reviews (every day)' },
          ...weekTopics.map(t => ({
            type: 'topic_practice',
            topic: t.topic,
            description: `${t.topic}: ${t.masteryLevel === 0 ? 'Start with easy questions' : `Level up from ${t.masteryLevel} to ${Math.min(t.masteryLevel + 2, 4)}`}`,
            questionsTarget: 15,
          })),
          { type: 'micro_test', description: 'Friday mini-mock: 10 mixed questions, 15 minutes' },
        ],
      });
    }
  }

  return {
    subject,
    level,
    examDate: exam.toISOString().split('T')[0],
    weeksUntilExam,
    totalTopics: prioritized.length,
    topicBreakdown: {
      weak: prioritized.filter(t => t.masteryLevel <= 1).length,
      developing: prioritized.filter(t => t.masteryLevel === 2 || t.masteryLevel === 3).length,
      strong: prioritized.filter(t => t.masteryLevel >= 4).length,
    },
    plan,
    prioritizedTopics: prioritized,
  };
}

/**
 * Get today's activities for a student
 */
export async function getTodaysPlan(userId, subject, level = 'O Level') {
  const supabase = getSupabase();
  const activities = [];

  // 1. Spaced repetition reviews due
  const dueCount = await getDueCount(userId);
  if (dueCount > 0) {
    activities.push({
      type: 'sr_review',
      title: 'Daily Review',
      description: `${dueCount} questions due for review`,
      count: dueCount,
      priority: 1, // Always first
      icon: '🔄',
      link: `/drill?mode=review`,
    });
  }

  // 2. Get current mastery + find weakest topic to practice
  const mastery = await getSubjectMastery(userId, subject, level);
  const weakest = mastery
    .filter(m => m.mastery_level < 4)
    .sort((a, b) => a.mastery_level - b.mastery_level || a.questions_correct / (a.questions_attempted || 1) - b.questions_correct / (b.questions_attempted || 1));

  if (weakest.length > 0) {
    const target = weakest[0];
    activities.push({
      type: 'topic_practice',
      title: `Practice: ${target.topic}`,
      description: `Level ${target.mastery_level} → ${target.mastery_level + 1}. ${10 - (target.questions_attempted % 10)} questions to go.`,
      topic: target.topic,
      masteryLevel: target.mastery_level,
      priority: 2,
      icon: '📚',
      link: `/drill?subject=${encodeURIComponent(subject)}&level=${encodeURIComponent(level)}&topic=${encodeURIComponent(target.topic)}`,
    });
  }

  // 3. Mistake review (questions got wrong recently)
  const { data: recentMistakes } = await supabase
    .from('student_progress')
    .select('id')
    .eq('user_id', userId)
    .eq('subject', subject)
    .eq('correct', false)
    .order('created_at', { ascending: false })
    .limit(5);

  if (recentMistakes?.length > 0) {
    activities.push({
      type: 'mistake_review',
      title: 'Fix Your Mistakes',
      description: `${recentMistakes.length} recent mistakes to review`,
      count: recentMistakes.length,
      priority: 3,
      icon: '🔧',
      link: `/drill?mode=mistakes&subject=${encodeURIComponent(subject)}`,
    });
  }

  // 4. Micro-test (always available)
  activities.push({
    type: 'micro_test',
    title: 'Quick Test',
    description: '5 questions, 3 minutes. Test yourself.',
    priority: 4,
    icon: '⚡',
    link: `/drill?mode=micro&subject=${encodeURIComponent(subject)}&level=${encodeURIComponent(level)}`,
  });

  // 5. Daily challenge
  activities.push({
    type: 'daily_challenge',
    title: 'Daily Challenge',
    description: '1 hard question. Bonus XP.',
    priority: 5,
    icon: '🏆',
    link: '/challenge',
  });

  return {
    date: new Date().toISOString().split('T')[0],
    subject,
    level,
    activities: activities.sort((a, b) => a.priority - b.priority),
    mastery: mastery.length > 0 ? {
      topicsTotal: mastery.length,
      topicsMastered: mastery.filter(m => m.mastery_level >= 4).length,
      overallAccuracy: mastery.reduce((sum, m) => sum + m.questions_correct, 0) / Math.max(mastery.reduce((sum, m) => sum + m.questions_attempted, 0), 1),
    } : null,
  };
}
