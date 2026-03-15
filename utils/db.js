/**
 * utils/db.js
 * ─────────────────────────────────────────────────────
 * All database operations for NewWorldEdu.
 * Uses Vercel KV (Upstash Redis) under the hood.
 * To migrate to Supabase later: only change THIS file.
 * ─────────────────────────────────────────────────────
 */

import { kv } from '@vercel/kv';

// ── SUBSCRIBERS ──────────────────────────────────────

/**
 * Save a new subscriber
 */
export async function saveSubscriber({ name, email, grade, subject, studyTime }) {
  const id = email.toLowerCase().trim();
  const subscriber = {
    id,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    grade,
    subject,
    studyTime,
    subscribedAt: new Date().toISOString(),
    active: true,
    streakDays: 0,
    lastQuestionDate: null,
  };

  // Save subscriber by email (primary key)
  await kv.hset(`subscriber:${id}`, subscriber);

  // Add to subscribers index
  await kv.sadd('subscribers:all', id);

  // Add to grade+subject index for targeted sends
  await kv.sadd(`subscribers:${grade}:${subject}`, id);

  return subscriber;
}

/**
 * Get all subscribers
 */
export async function getAllSubscribers() {
  const ids = await kv.smembers('subscribers:all');
  if (!ids || ids.length === 0) return [];

  const subscribers = await Promise.all(
    ids.map(id => kv.hgetall(`subscriber:${id}`))
  );

  return subscribers.filter(Boolean).filter(s => s.active !== false);
}

/**
 * Get one subscriber by email
 */
export async function getSubscriber(email) {
  const id = email.toLowerCase().trim();
  return await kv.hgetall(`subscriber:${id}`);
}

/**
 * Check if email already subscribed
 */
export async function isSubscribed(email) {
  const id = email.toLowerCase().trim();
  const exists = await kv.exists(`subscriber:${id}`);
  return exists === 1;
}

/**
 * Unsubscribe
 */
export async function unsubscribe(email) {
  const id = email.toLowerCase().trim();
  await kv.hset(`subscriber:${id}`, { active: false });
}

// ── QUESTION HISTORY ─────────────────────────────────

/**
 * Record a question sent to a subscriber
 */
export async function recordQuestionSent({ email, grade, subject, question, date }) {
  const id = email.toLowerCase().trim();
  const dateKey = date || new Date().toISOString().split('T')[0];

  // Store question for this subscriber on this date
  await kv.hset(`questions:${id}:${dateKey}`, { question, grade, subject, sentAt: new Date().toISOString() });

  // Update subscriber's last question date and streak
  const subscriber = await kv.hgetall(`subscriber:${id}`);
  if (subscriber) {
    // Use Pakistan time (UTC+5) for consistent streak tracking
    const nowPKT = new Date(Date.now() + 5 * 3600000);
    const yesterday = new Date(nowPKT);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];

    const hadYesterday = await kv.exists(`questions:${id}:${yesterdayKey}`);
    const newStreak = hadYesterday ? (parseInt(subscriber.streakDays || 0) + 1) : 1;

    await kv.hset(`subscriber:${id}`, {
      lastQuestionDate: dateKey,
      streakDays: newStreak,
    });
  }
}

/**
 * Get recent questions sent to avoid repeats (last 30 days)
 */
export async function getRecentQuestions(email, days = 30) {
  const id = email.toLowerCase().trim();
  const questions = [];

  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const q = await kv.hgetall(`questions:${id}:${dateKey}`);
    if (q) questions.push(q.question);
  }

  return questions.filter(Boolean);
}

// ── STREAKS ───────────────────────────────────────────

/**
 * Get streak for a subscriber
 */
export async function getStreak(email) {
  const id = email.toLowerCase().trim();
  const sub = await kv.hgetall(`subscriber:${id}`);
  return sub ? parseInt(sub.streakDays || 0) : 0;
}

// ── STATS (for admin/parent dashboard) ───────────────

/**
 * Get platform stats
 */
export async function getStats() {
  const allIds = await kv.smembers('subscribers:all') || [];
  return {
    totalSubscribers: allIds.length,
    lastUpdated: new Date().toISOString(),
  };
}

// ── STUDENT MEMORY ────────────────────────────────────

/**
 * Save full student memory (weak topics, mistakes, subject, summary)
 */
export async function saveStudentMemory(email, memory) {
  const id = email.toLowerCase().trim();
  await kv.set(`memory:${id}`, JSON.stringify(memory));
}

/**
 * Get student memory by email
 */
export async function getStudentMemory(email) {
  const id = email.toLowerCase().trim();
  const raw = await kv.get(`memory:${id}`);
  if (!raw) return null;
  try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return null; }
}
