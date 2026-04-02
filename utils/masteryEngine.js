/**
 * utils/masteryEngine.js — Topic Mastery Engine
 * ─────────────────────────────────────────────────────────────────
 * Tracks student mastery per topic through 5 levels:
 *   Level 0: Not started
 *   Level 1: Recall (easy MCQs, 80%+ to advance)
 *   Level 2: Apply (medium questions, 70%+ to advance)
 *   Level 3: Analyze (hard/structured, 70%+ to advance)
 *   Level 4: Exam Standard (real past paper questions, 75%+)
 *   Level 5: Mastery (retain over time via spaced repetition)
 *
 * Every answer updates mastery. Mastery can degrade if SR reviews are failed.
 */

import { getSupabase } from './supabase';

export const MASTERY_LEVELS = {
  0: { name: 'Not Started', color: '#555', threshold: 0, minQuestions: 0, difficulty: null },
  1: { name: 'Recall', color: '#EF4444', threshold: 0.8, minQuestions: 10, difficulty: 'easy' },
  2: { name: 'Apply', color: '#F97316', threshold: 0.7, minQuestions: 10, difficulty: 'medium' },
  3: { name: 'Analyze', color: '#EAB308', threshold: 0.7, minQuestions: 8, difficulty: 'hard' },
  4: { name: 'Exam Ready', color: '#4ADE80', threshold: 0.75, minQuestions: 8, difficulty: 'hard' },
  5: { name: 'Mastered', color: '#4F8EF7', threshold: 0.8, minQuestions: 5, difficulty: null },
};

/**
 * Get mastery data for a student across all topics in a subject
 */
export async function getSubjectMastery(userId, subject, level = 'O Level') {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('topic_mastery')
    .select('*')
    .eq('user_id', userId)
    .eq('subject', subject)
    .eq('level', level)
    .order('mastery_level', { ascending: false });

  if (error) { console.error('[Mastery] getSubjectMastery error:', error.message); return []; }
  return data || [];
}

/**
 * Get all subjects + overall mastery for a student
 */
export async function getAllMastery(userId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('topic_mastery')
    .select('subject, level, mastery_level, questions_attempted, questions_correct')
    .eq('user_id', userId);

  if (error) return [];

  // Group by subject
  const subjects = {};
  for (const row of (data || [])) {
    const key = `${row.subject}|${row.level}`;
    if (!subjects[key]) subjects[key] = { subject: row.subject, level: row.level, topics: 0, mastered: 0, totalAttempted: 0, totalCorrect: 0 };
    subjects[key].topics++;
    if (row.mastery_level >= 4) subjects[key].mastered++;
    subjects[key].totalAttempted += row.questions_attempted;
    subjects[key].totalCorrect += row.questions_correct;
  }

  return Object.values(subjects).map(s => ({
    ...s,
    accuracy: s.totalAttempted > 0 ? Math.round((s.totalCorrect / s.totalAttempted) * 100) : 0,
    masteryPercent: s.topics > 0 ? Math.round((s.mastered / s.topics) * 100) : 0,
  }));
}

/**
 * Record an answer and update mastery
 */
export async function recordAnswer(userId, questionId, subject, level, topic, correct, activityType = 'drill') {
  const supabase = getSupabase();

  // 1. Save to student_progress
  await supabase.from('student_progress').insert({
    user_id: userId,
    question_id: questionId,
    subject,
    level,
    topic,
    correct,
    activity_type: activityType,
  });

  // 2. Upsert topic_mastery
  const { data: existing } = await supabase
    .from('topic_mastery')
    .select('*')
    .eq('user_id', userId)
    .eq('subject', subject)
    .eq('level', level)
    .eq('topic', topic)
    .single();

  if (existing) {
    const attempted = existing.questions_attempted + 1;
    const correctCount = existing.questions_correct + (correct ? 1 : 0);
    const streak = correct ? existing.current_streak + 1 : 0;
    const bestStreak = Math.max(streak, existing.best_streak);

    // Check if student should level up
    const newLevel = calculateLevel(existing.mastery_level, attempted, correctCount, streak);

    await supabase.from('topic_mastery').update({
      questions_attempted: attempted,
      questions_correct: correctCount,
      current_streak: streak,
      best_streak: bestStreak,
      mastery_level: newLevel,
      last_activity: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', existing.id);

    return { masteryLevel: newLevel, levelChanged: newLevel !== existing.mastery_level, attempted, correctCount };
  } else {
    // First time seeing this topic
    const newLevel = correct ? 1 : 0;
    await supabase.from('topic_mastery').insert({
      user_id: userId,
      subject,
      level,
      topic,
      mastery_level: newLevel,
      questions_attempted: 1,
      questions_correct: correct ? 1 : 0,
      current_streak: correct ? 1 : 0,
      best_streak: correct ? 1 : 0,
      last_activity: new Date().toISOString(),
    });
    return { masteryLevel: newLevel, levelChanged: true, attempted: 1, correctCount: correct ? 1 : 0 };
  }
}

/**
 * Calculate mastery level based on performance
 */
function calculateLevel(currentLevel, attempted, correct, streak) {
  const accuracy = attempted > 0 ? correct / attempted : 0;

  // Can't skip levels — must progress through each
  const nextLevel = currentLevel + 1;
  if (nextLevel > 5) return 5;

  const req = MASTERY_LEVELS[nextLevel];
  if (!req) return currentLevel;

  // Need minimum questions AND accuracy threshold to level up
  // Use a rolling window of recent questions for advancement
  const recentWindow = req.minQuestions;
  if (attempted >= recentWindow && accuracy >= req.threshold) {
    return nextLevel;
  }

  // Degradation: if accuracy drops below 50% with 10+ attempts, drop a level
  if (currentLevel > 0 && attempted >= 10 && accuracy < 0.5) {
    return Math.max(0, currentLevel - 1);
  }

  return currentLevel;
}

/**
 * Get diagnostic results — accuracy per topic for a subject
 */
export async function getDiagnosticResults(userId, subject, level = 'O Level') {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('student_progress')
    .select('topic, correct')
    .eq('user_id', userId)
    .eq('subject', subject)
    .eq('level', level);

  if (error || !data) return [];

  // Group by topic
  const topics = {};
  for (const row of data) {
    if (!topics[row.topic]) topics[row.topic] = { topic: row.topic, attempted: 0, correct: 0 };
    topics[row.topic].attempted++;
    if (row.correct) topics[row.topic].correct++;
  }

  return Object.values(topics).map(t => ({
    ...t,
    accuracy: Math.round((t.correct / t.attempted) * 100),
    status: t.correct / t.attempted >= 0.8 ? 'strong' : t.correct / t.attempted >= 0.5 ? 'needs_work' : 'weak',
  })).sort((a, b) => a.accuracy - b.accuracy);
}
