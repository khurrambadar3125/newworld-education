/**
 * utils/saturdayFreeLogic.js
 * Starky Saturdays — weekly free subject rotation logic.
 * Extracted to utils so it can be imported by both pages and hooks without circular deps.
 */

const FREE_ROTATION = [
  { week: 1, subject: 'Mathematics', icon: '📐' },
  { week: 2, subject: 'Physics', icon: '⚡' },
  { week: 3, subject: 'Chemistry', icon: '🧪' },
  { week: 4, subject: 'Biology', icon: '🧬' },
  { week: 5, subject: 'English Language', icon: '📝' },
  { week: 6, subject: 'Economics', icon: '📊' },
];

function getWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
}

export function isSaturday() {
  // Check in PKT timezone (UTC+5)
  const now = new Date();
  const pkt = new Date(now.getTime() + (5 * 60 * 60 * 1000) - (now.getTimezoneOffset() * 60000));
  return pkt.getDay() === 6;
}

export function getThisWeeksFreeSubject() {
  const week = getWeekNumber();
  return FREE_ROTATION[(week - 1) % FREE_ROTATION.length];
}

export function isSaturdayFreeSubject(userSubject) {
  if (!isSaturday()) return false;
  const free = getThisWeeksFreeSubject();
  return userSubject?.toLowerCase().includes(free.subject.toLowerCase());
}

export { FREE_ROTATION };
