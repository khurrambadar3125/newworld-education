/**
 * utils/useStreaks.js
 * Streaks + Badges system for NewWorldEdu
 * 
 * INSTALL:
 * import useStreaks from '../utils/useStreaks';
 * const { streak, badges, todayDone, logSession } = useStreaks(userId);
 * 
 * Call logSession(subject, questionsAnswered, score) after each drill session.
 * Render <StreakBadge streak={streak} /> anywhere in your UI.
 */

import { useState, useEffect } from 'react';

const BADGES = [
  { id: 'first_drill',    label: 'First Step',      emoji: '🌱', desc: 'Completed your first drill',         condition: s => s.totalSessions >= 1 },
  { id: 'streak_3',       label: '3-Day Streak',    emoji: '🔥', desc: '3 days in a row',                   condition: s => s.currentStreak >= 3 },
  { id: 'streak_7',       label: 'Week Warrior',    emoji: '⚡', desc: '7 days in a row',                   condition: s => s.currentStreak >= 7 },
  { id: 'streak_30',      label: 'Iron Habit',      emoji: '💎', desc: '30 days in a row',                  condition: s => s.currentStreak >= 30 },
  { id: 'questions_50',   label: '50 Questions',    emoji: '📚', desc: 'Answered 50 questions total',       condition: s => s.totalQuestions >= 50 },
  { id: 'questions_200',  label: '200 Questions',   emoji: '🎯', desc: 'Answered 200 questions total',      condition: s => s.totalQuestions >= 200 },
  { id: 'questions_500',  label: '500 Club',        emoji: '🏆', desc: '500 questions answered',            condition: s => s.totalQuestions >= 500 },
  { id: 'perfect_score',  label: 'Perfect Score',   emoji: '✨', desc: 'Got 100% on a drill session',       condition: s => s.hasPerfect },
  { id: 'multi_subject',  label: 'Well-Rounded',    emoji: '🌍', desc: 'Drilled 4+ different subjects',     condition: s => Object.keys(s.subjectSessions || {}).length >= 4 },
  { id: 'night_owl',      label: 'Night Owl',       emoji: '🦉', desc: 'Studied after 10pm',               condition: s => s.hasNightSession },
  { id: 'early_bird',     label: 'Early Bird',      emoji: '🐦', desc: 'Studied before 7am',               condition: s => s.hasEarlySession },
  { id: 'comeback',       label: 'Comeback Kid',    emoji: '💪', desc: 'Returned after a 3+ day break',    condition: s => s.hadComeback },
];

function getTodayKey() {
  // Use Pakistan time (UTC+5) so streaks align with the student's actual day
  return new Date(Date.now() + 5 * 3600000).toISOString().slice(0, 10); // 'YYYY-MM-DD' in PKT
}

function getStorageKey(userId) {
  return `nw_streaks_${userId || 'guest'}`;
}

function loadData(userId) {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveData(userId, data) {
  try { localStorage.setItem(getStorageKey(userId), JSON.stringify(data)); } catch {}
}

function initData() {
  return {
    currentStreak:    0,
    longestStreak:    0,
    totalSessions:    0,
    totalQuestions:   0,
    lastActiveDate:   null,
    activeDates:      [],         // ['YYYY-MM-DD', ...]
    subjectSessions:  {},         // { Chemistry: 3, Biology: 1 }
    earnedBadges:     [],         // badge ids
    hasPerfect:       false,
    hasNightSession:  false,
    hasEarlySession:  false,
    hadComeback:      false,
  };
}

export default function useStreaks(userId) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = loadData(userId);
    setData(saved || initData());
  }, [userId]);

  const todayKey    = getTodayKey();
  const todayDone   = data?.activeDates?.includes(todayKey) || false;
  const streak      = data?.currentStreak || 0;
  const longestStreak = data?.longestStreak || 0;
  const totalSessions = data?.totalSessions || 0;
  const totalQuestions = data?.totalQuestions || 0;

  // Compute which badges are earned
  const badges = data ? BADGES.map(b => ({
    ...b,
    earned: data.earnedBadges.includes(b.id) || b.condition(data),
    isNew:  !data.earnedBadges.includes(b.id) && b.condition(data),
  })) : [];

  const logSession = (subject, questionsAnswered = 0, scorePercent = 0) => {
    setData(prev => {
      if (!prev) return prev;
      const today = getTodayKey();
      const yesterday = new Date(Date.now() + 5 * 3600000 - 86400000).toISOString().slice(0, 10); // yesterday in PKT

      // Streak logic
      let newStreak = prev.currentStreak;
      let hadComeback = prev.hadComeback;

      if (prev.lastActiveDate === yesterday) {
        newStreak += 1; // continuing streak
      } else if (prev.lastActiveDate === today) {
        // already logged today — no change
      } else if (prev.lastActiveDate) {
        // broke streak
        const daysSince = Math.floor((Date.now() - new Date(prev.lastActiveDate)) / 86400000);
        if (daysSince >= 3) hadComeback = true;
        newStreak = 1;
      } else {
        newStreak = 1; // first ever
      }

      const hour = new Date().getHours();
      const hasNightSession = prev.hasNightSession || hour >= 22;
      const hasEarlySession = prev.hasEarlySession || hour < 7;

      const updated = {
        ...prev,
        currentStreak:   newStreak,
        longestStreak:   Math.max(prev.longestStreak, newStreak),
        totalSessions:   prev.totalSessions + 1,
        totalQuestions:  prev.totalQuestions + questionsAnswered,
        lastActiveDate:  today,
        activeDates:     prev.activeDates.includes(today)
                           ? prev.activeDates
                           : [...prev.activeDates.slice(-60), today],
        subjectSessions: {
          ...prev.subjectSessions,
          [subject]: (prev.subjectSessions[subject] || 0) + 1,
        },
        hasPerfect:      prev.hasPerfect || scorePercent >= 100,
        hasNightSession,
        hasEarlySession,
        hadComeback,
      };

      // Award new badges
      const newlyEarned = BADGES
        .filter(b => !updated.earnedBadges.includes(b.id) && b.condition(updated))
        .map(b => b.id);
      updated.earnedBadges = [...updated.earnedBadges, ...newlyEarned];

      saveData(userId, updated);
      return updated;
    });
  };

  return {
    streak,
    longestStreak,
    totalSessions,
    totalQuestions,
    todayDone,
    badges,
    logSession,
    rawData: data,
  };
}

// ─── StreakBadge UI Component ─────────────────────────────────────────────────
export function StreakWidget({ userId }) {
  const { streak, todayDone, badges, totalQuestions } = useStreaks(userId);
  const earned = badges.filter(b => b.earned);
  const newBadges = badges.filter(b => b.isNew);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Streak counter */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: streak > 0 ? 'rgba(251,146,60,.1)' : 'rgba(255,255,255,.04)',
        border: `1px solid ${streak > 0 ? 'rgba(251,146,60,.25)' : 'rgba(255,255,255,.08)'}`,
        borderRadius: 14, padding: '14px 18px',
      }}>
        <span style={{ fontSize: 28 }}>{streak > 0 ? '🔥' : '💤'}</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: streak > 0 ? '#FB923C' : 'rgba(255,255,255,.4)',
            fontFamily: "'Sora',sans-serif" }}>
            {streak} day{streak !== 1 ? 's' : ''} streak
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>
            {todayDone ? '✓ Today done' : 'Not studied today yet'} · {totalQuestions} questions total
          </div>
        </div>
      </div>

      {/* New badge toast */}
      {newBadges.map(b => (
        <div key={b.id} style={{
          background: 'rgba(74,222,128,.1)', border: '1px solid rgba(74,222,128,.3)',
          borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span style={{ fontSize: 22 }}>{b.emoji}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#4ADE80' }}>New badge: {b.label}!</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>{b.desc}</div>
          </div>
        </div>
      ))}

      {/* Badge shelf */}
      {earned.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {earned.map(b => (
            <div key={b.id} title={b.desc}
              style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
                borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6,
                cursor: 'default' }}>
              <span style={{ fontSize: 16 }}>{b.emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.6)' }}>{b.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
