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
 * Get all subscribers — with in-memory cache to reduce KV reads at scale
 */
let _subscriberCache = null;
let _subscriberCacheTime = 0;
const SUBSCRIBER_CACHE_TTL = 120000; // 2 minutes

export async function getAllSubscribers() {
  // Return cache if fresh (prevents N+1 queries on every dashboard load)
  if (_subscriberCache && Date.now() - _subscriberCacheTime < SUBSCRIBER_CACHE_TTL) {
    return _subscriberCache;
  }

  const ids = await kv.smembers('subscribers:all');
  if (!ids || ids.length === 0) return [];

  // Batch in chunks of 50 to avoid overwhelming KV
  const CHUNK = 50;
  const subscribers = [];
  for (let i = 0; i < ids.length; i += CHUNK) {
    const chunk = ids.slice(i, i + CHUNK);
    const results = await Promise.all(chunk.map(id => kv.hgetall(`subscriber:${id}`)));
    subscribers.push(...results);
  }

  const active = subscribers.filter(Boolean).filter(s => s.active !== false);
  _subscriberCache = active;
  _subscriberCacheTime = Date.now();
  return active;
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

  // Batch all 30 days into parallel requests (not sequential)
  const dateKeys = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dateKeys.push(d.toISOString().split('T')[0]);
  }

  const results = await Promise.all(
    dateKeys.map(dateKey => kv.hgetall(`questions:${id}:${dateKey}`))
  );

  return results.filter(Boolean).map(q => q.question).filter(Boolean);
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
