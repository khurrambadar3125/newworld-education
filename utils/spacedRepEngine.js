/**
 * utils/spacedRepEngine.js — Spaced Repetition Scheduler (SM-2 Algorithm)
 * ─────────────────────────────────────────────────────────────────
 * Every wrong answer enters the SR queue. The algorithm surfaces it
 * at optimal intervals: 1, 3, 7, 14, 30, 60 days.
 *
 * Based on SuperMemo SM-2 algorithm.
 * Quality scale: 0-5 (0=no recall, 5=perfect recall)
 */

import { getSupabase } from './supabase';

/**
 * Calculate next interval using SM-2 algorithm
 * @param {number} quality - 0 to 5 (0=wrong, 3=correct with difficulty, 5=perfect)
 * @param {number} repetitions - number of successful reviews
 * @param {number} easeFactor - current ease factor (min 1.3)
 * @param {number} interval - current interval in days
 */
export function sm2(quality, repetitions, easeFactor, interval) {
  let newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  let newInterval, newReps;

  if (quality < 3) {
    // Wrong — reset to beginning
    newReps = 0;
    newInterval = 1;
  } else {
    newReps = repetitions + 1;
    if (newReps === 1) newInterval = 1;
    else if (newReps === 2) newInterval = 3;
    else newInterval = Math.round(interval * newEF);
  }

  // Cap at 180 days
  if (newInterval > 180) newInterval = 180;

  return {
    easeFactor: Math.round(newEF * 100) / 100,
    interval: newInterval,
    repetitions: newReps,
    nextReview: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000),
  };
}

/**
 * Get questions due for review today
 */
export async function getDueReviews(userId, limit = 20) {
  const supabase = getSupabase();
  // First get due SR items
  const { data: srItems, error } = await supabase
    .from('sr_queue')
    .select('*')
    .eq('user_id', userId)
    .lte('next_review', new Date().toISOString())
    .order('next_review', { ascending: true })
    .limit(limit);

  if (error || !srItems?.length) return [];

  // Then fetch the questions separately (avoids FK join issues)
  const questionIds = srItems.map(s => s.question_id).filter(Boolean);
  if (questionIds.length === 0) return [];

  const { data: questions } = await supabase
    .from('question_bank')
    .select('id, question_text, type, options, topic, subject, level, difficulty, marks')
    .in('id', questionIds);

  const qMap = {};
  for (const q of (questions || [])) qMap[q.id] = q;

  return srItems
    .filter(s => qMap[s.question_id])
    .map(s => ({ ...s, question: qMap[s.question_id] }));
}

/**
 * Get count of reviews due today
 */
export async function getDueCount(userId) {
  const supabase = getSupabase();
  const { count, error } = await supabase
    .from('sr_queue')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .lte('next_review', new Date().toISOString());

  if (error) return 0;
  return count || 0;
}

/**
 * Add a wrong answer to the SR queue (or reset if already there)
 */
export async function addToQueue(userId, questionId, subject, topic) {
  if (!userId || !questionId) return; // Skip if invalid
  const supabase = getSupabase();
  const { error } = await supabase
    .from('sr_queue')
    .upsert({
      user_id: userId,
      question_id: questionId,
      subject,
      topic,
      ease_factor: 2.5,
      interval_days: 1,
      repetitions: 0,
      next_review: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
      last_reviewed: new Date().toISOString(),
    }, { onConflict: 'user_id,question_id' });

  if (error) console.error('[SR] addToQueue error:', error.message);
}

/**
 * Process a review result — update the SR schedule
 * @param {string} queueId - sr_queue row id
 * @param {number} quality - 0 to 5
 */
export async function processReview(userId, questionId, quality) {
  const supabase = getSupabase();

  // Get current SR data
  const { data: current } = await supabase
    .from('sr_queue')
    .select('*')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .single();

  if (!current) return;

  const result = sm2(
    quality,
    current.repetitions,
    current.ease_factor,
    current.interval_days,
  );

  // If card has interval > 90 days and quality >= 4, it's "graduated" — remove from queue
  if (result.interval > 90 && quality >= 4) {
    await supabase.from('sr_queue').delete().eq('id', current.id);
    return { graduated: true };
  }

  // Update the queue entry
  const { error } = await supabase
    .from('sr_queue')
    .update({
      ease_factor: result.easeFactor,
      interval_days: result.interval,
      repetitions: result.repetitions,
      next_review: result.nextReview.toISOString(),
      last_reviewed: new Date().toISOString(),
    })
    .eq('id', current.id);

  if (error) console.error('[SR] processReview error:', error.message);
  return { nextReview: result.nextReview, interval: result.interval };
}
