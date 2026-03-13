/**
 * utils/useSpacedRep.js
 * ─────────────────────────────────────────────────────────────────
 * SM-2 spaced repetition algorithm for NewWorldEdu drill system.
 *
 * Stores per-user in localStorage under key `nw_sr_{userId}`.
 * Each topic card has:
 *   ef          — ease factor (starts 2.5, min 1.3)
 *   interval    — days until next review (starts 1)
 *   reps        — consecutive correct answers
 *   nextReview  — Unix timestamp of next due date
 *   lastSeen    — Unix timestamp of last attempt
 *   totalSeen   — total attempts
 *
 * Usage:
 *   const sr = useSpacedRep(userProfile);
 *   const due = sr.getDueTopics('Chemistry');
 *   sr.recordAnswer('Chemistry', 'Moles', 4);  // quality 0–5
 *   sr.getTopicStats('Chemistry', 'Moles');
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_PREFIX = 'nw_sr_';
const DEFAULT_EF     = 2.5;
const MIN_EF         = 1.3;

function getKey(userProfile) {
  return STORAGE_PREFIX + (userProfile?.email || userProfile?.gradeId || 'guest');
}

function loadData(userProfile) {
  try {
    const raw = localStorage.getItem(getKey(userProfile));
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveData(userProfile, data) {
  try { localStorage.setItem(getKey(userProfile), JSON.stringify(data)); } catch {}
}

/**
 * SM-2 core — given previous state + quality (0–5), returns new state.
 * quality: 0-2 = fail, 3 = hard pass, 4 = good, 5 = easy
 */
function sm2(card, quality) {
  const q   = Math.max(0, Math.min(5, quality));
  const now = Date.now();

  // Failed — reset repetitions
  if (q < 3) {
    return {
      ...card,
      reps:       0,
      interval:   1,
      ef:         Math.max(MIN_EF, card.ef - 0.2),
      nextReview: now + 1 * 24 * 60 * 60 * 1000, // 1 day
      lastSeen:   now,
      totalSeen:  (card.totalSeen || 0) + 1,
    };
  }

  // Passed — update ease factor
  const newEf = Math.max(MIN_EF, card.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  // Calculate next interval
  let newInterval;
  if (card.reps === 0)      newInterval = 1;
  else if (card.reps === 1) newInterval = 6;
  else                      newInterval = Math.round(card.interval * newEf);

  return {
    ...card,
    reps:       card.reps + 1,
    interval:   newInterval,
    ef:         newEf,
    nextReview: now + newInterval * 24 * 60 * 60 * 1000,
    lastSeen:   now,
    totalSeen:  (card.totalSeen || 0) + 1,
  };
}

/** Stable card key: "Subject::Topic" */
const cardKey = (subject, topic) => `${subject}::${topic}`;

/** Returns a new card with default values */
function newCard(subject, topic) {
  return {
    subject, topic,
    ef:         DEFAULT_EF,
    interval:   1,
    reps:       0,
    nextReview: Date.now(), // due immediately (new card)
    lastSeen:   null,
    totalSeen:  0,
  };
}

export function useSpacedRep(userProfile) {
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);

  // Load on mount / profile change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setData(loadData(userProfile));
    setLoaded(true);
  }, [userProfile?.email, userProfile?.gradeId]);

  const persist = useCallback((newData) => {
    setData(newData);
    saveData(userProfile, newData);
  }, [userProfile]);

  /**
   * Record an answer for a topic.
   * quality: 0 = blackout, 1 = wrong, 2 = wrong+hint, 3 = hard, 4 = good, 5 = easy
   */
  const recordAnswer = useCallback((subject, topic, quality) => {
    const key      = cardKey(subject, topic);
    const existing = data[key] || newCard(subject, topic);
    const updated  = sm2(existing, quality);
    persist({ ...data, [key]: updated });
    return updated;
  }, [data, persist]);

  /**
   * Returns all topics for a subject that are due today (or overdue).
   * Sorted by most overdue first.
   */
  const getDueTopics = useCallback((subject) => {
    const now = Date.now();
    return Object.values(data)
      .filter(c => c.subject === subject && c.nextReview <= now)
      .sort((a, b) => a.nextReview - b.nextReview)
      .map(c => c.topic);
  }, [data]);

  /**
   * Returns all topics the student has ever seen for a subject.
   */
  const getSeenTopics = useCallback((subject) => {
    return Object.values(data)
      .filter(c => c.subject === subject && c.totalSeen > 0)
      .sort((a, b) => b.totalSeen - a.totalSeen)
      .map(c => c.topic);
  }, [data]);

  /**
   * Stats for a single topic card.
   */
  const getTopicStats = useCallback((subject, topic) => {
    return data[cardKey(subject, topic)] || null;
  }, [data]);

  /**
   * Returns all topics due across ALL subjects.
   */
  const getAllDue = useCallback(() => {
    const now = Date.now();
    return Object.values(data)
      .filter(c => c.nextReview <= now)
      .sort((a, b) => a.nextReview - b.nextReview);
  }, [data]);

  /**
   * Number of topics due today across all subjects.
   */
  const dueCount = Object.values(data).filter(c => c.nextReview <= Date.now()).length;

  /**
   * Weak topics: cards with ef < 1.8 (struggled consistently).
   */
  const weakTopics = Object.values(data)
    .filter(c => c.ef < 1.8 && c.totalSeen >= 2)
    .sort((a, b) => a.ef - b.ef)
    .slice(0, 5);

  /**
   * Overall mastery % for a subject (cards with reps >= 3 and ef >= 2.0).
   */
  const getSubjectMastery = useCallback((subject) => {
    const all     = Object.values(data).filter(c => c.subject === subject);
    if (!all.length) return 0;
    const mastered = all.filter(c => c.reps >= 3 && c.ef >= 2.0).length;
    return Math.round((mastered / all.length) * 100);
  }, [data]);

  /**
   * Returns the best next topic to study for a subject (most overdue, or new).
   */
  const getNextDueTopic = useCallback((subject, allTopics = []) => {
    // First: overdue topics
    const due = getDueTopics(subject);
    if (due.length) return { topic: due[0], isNew: false, isDue: true };

    // Then: topics never seen
    const seen = new Set(getSeenTopics(subject));
    const unseen = allTopics.filter(t => !seen.has(t));
    if (unseen.length) return { topic: unseen[0], isNew: true, isDue: false };

    // All seen, nothing due — pick soonest upcoming
    const upcoming = Object.values(data)
      .filter(c => c.subject === subject)
      .sort((a, b) => a.nextReview - b.nextReview);
    if (upcoming.length) {
      const msUntil = upcoming[0].nextReview - Date.now();
      const daysUntil = Math.ceil(msUntil / (1000 * 60 * 60 * 24));
      return { topic: upcoming[0].topic, isNew: false, isDue: false, daysUntil };
    }

    return null;
  }, [data, getDueTopics, getSeenTopics]);

  return {
    loaded,
    recordAnswer,
    getDueTopics,
    getSeenTopics,
    getTopicStats,
    getAllDue,
    getNextDueTopic,
    getSubjectMastery,
    dueCount,
    weakTopics,
  };
}
