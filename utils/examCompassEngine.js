/**
 * utils/topicRadarEngine.js — Exam Compass (Forecast Engine)
 * ─────────────────────────────────────────────────────────────────
 * Analyzes Cambridge past paper patterns to forecast likely topics
 * for upcoming exams. Free feature that replaces PapaCambridge's
 * $25-240 predicted papers.
 *
 * Algorithm:
 * 1. Build topic × session matrix from question_bank
 * 2. Detect rotation patterns (Cambridge tests every topic within 2-3 years)
 * 3. Calculate gap scores (overdue topics = high probability)
 * 4. Correlate with examiner report emphasis
 * 5. Generate ranked forecast with confidence labels
 */

import { getSupabase } from './supabase';

// ── Session ordering (canonical timeline) ──────────────────────────
// Sessions: m=Feb/March, s=May/June, w=Oct/November
const SESSION_ORDER = [];
for (let yr = 19; yr <= 26; yr++) {
  SESSION_ORDER.push(`m${yr}`, `s${yr}`, `w${yr}`);
}

function sessionIndex(s) {
  const idx = SESSION_ORDER.indexOf(s);
  return idx >= 0 ? idx : -1;
}

function sessionsBetween(a, b) {
  const ia = sessionIndex(a);
  const ib = sessionIndex(b);
  if (ia < 0 || ib < 0) return 0;
  return Math.abs(ib - ia);
}

// ── Get next upcoming session ──────────────────────────────────────
export function getNextSession() {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const yr = now.getFullYear() % 100; // 26
  if (month <= 2) return `m${yr}`;
  if (month <= 5) return `s${yr}`;
  if (month <= 9) return `w${yr}`;
  return `m${yr + 1}`;
}

// ── Build topic × session matrix ──────────────────────────────────
export async function buildTopicMatrix(subject, level) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('question_bank')
    .select('topic, session')
    .eq('subject', subject)
    .eq('level', level)
    .eq('source', 'past_paper')
    .not('session', 'is', null)
    .not('topic', 'is', null);

  if (error || !data || data.length === 0) return null;

  // Build matrix: { topic → Set of sessions }
  const matrix = {};
  const allSessions = new Set();

  for (const row of data) {
    if (!row.topic || !row.session) continue;
    const topic = row.topic.trim();
    if (!matrix[topic]) matrix[topic] = new Set();
    matrix[topic].add(row.session);
    allSessions.add(row.session);
  }

  // Sort sessions chronologically
  const sortedSessions = [...allSessions].sort((a, b) => sessionIndex(a) - sessionIndex(b));

  return { matrix, sessions: sortedSessions, totalQuestions: data.length };
}

// ── Detect rotation patterns ──────────────────────────────────────
export function detectPatterns(matrix, sessions) {
  const patterns = {};
  const latestSession = sessions[sessions.length - 1];

  for (const [topic, topicSessions] of Object.entries(matrix)) {
    const sorted = [...topicSessions].sort((a, b) => sessionIndex(a) - sessionIndex(b));

    // Calculate average gap between appearances
    let totalGap = 0;
    let gapCount = 0;
    for (let i = 1; i < sorted.length; i++) {
      const gap = sessionsBetween(sorted[i - 1], sorted[i]);
      if (gap > 0) { totalGap += gap; gapCount++; }
    }
    const avgGap = gapCount > 0 ? totalGap / gapCount : sessions.length;

    // Sessions since last appearance
    const lastSeen = sorted[sorted.length - 1];
    const gapSinceLast = sessionsBetween(lastSeen, latestSession);

    // Frequency: how many sessions out of total
    const frequency = topicSessions.size / sessions.length;

    patterns[topic] = {
      avgGap: Math.round(avgGap * 10) / 10,
      lastSeen,
      gapSinceLast,
      appearances: topicSessions.size,
      totalSessions: sessions.length,
      frequency: Math.round(frequency * 100),
      sessions: sorted,
    };
  }

  return patterns;
}

// ── Calculate forecast scores ──────────────────────────────────────
export function calculateForecast(patterns, targetSession, examinerData = null) {
  const forecast = [];

  for (const [topic, p] of Object.entries(patterns)) {
    // Skip topics that appeared in only 1 session (not enough data)
    if (p.appearances < 1) continue;

    // ── Gap Score (60% weight) ──
    // Higher = more overdue = more likely to appear
    let gapScore;
    if (p.avgGap > 0) {
      gapScore = Math.min((p.gapSinceLast / p.avgGap) * 60, 60);
    } else {
      gapScore = p.gapSinceLast > 2 ? 50 : 20;
    }

    // ── Frequency Score (25% weight) ──
    // Topics that appear frequently are important (Cambridge must cover the syllabus)
    const freqScore = (p.frequency / 100) * 25;

    // ── Recency penalty (15% weight) ──
    // If tested very recently (last session), slight penalty
    let recencyScore;
    if (p.gapSinceLast === 0) recencyScore = 2;        // Just tested — unlikely to repeat
    else if (p.gapSinceLast === 1) recencyScore = 5;    // One session ago — possible
    else if (p.gapSinceLast >= 4) recencyScore = 15;    // Long gap — very likely
    else recencyScore = p.gapSinceLast * 3;

    // ── Examiner emphasis bonus ──
    let examinerBonus = 0;
    if (examinerData) {
      const entries = examinerData.filter(e =>
        e.topic?.toLowerCase().includes(topic.toLowerCase()) ||
        topic.toLowerCase().includes(e.topic?.toLowerCase() || '')
      );
      examinerBonus = Math.min(entries.length * 3, 10);
    }

    const totalScore = Math.min(Math.round(gapScore + freqScore + recencyScore + examinerBonus), 100);

    // Determine label
    let label;
    if (totalScore >= 75) label = 'Very Likely';
    else if (totalScore >= 55) label = 'Likely';
    else if (totalScore >= 35) label = 'Possible';
    else label = 'Less Likely';

    // Determine confidence based on data quality
    let confidence;
    if (p.totalSessions >= 6 && p.appearances >= 3) confidence = 'high';
    else if (p.totalSessions >= 4 && p.appearances >= 2) confidence = 'medium';
    else confidence = 'low';

    forecast.push({
      topic,
      score: totalScore,
      label,
      confidence,
      lastSeen: p.lastSeen,
      gapSessions: p.gapSinceLast,
      appearances: p.appearances,
      avgGap: p.avgGap,
      frequency: p.frequency,
    });
  }

  // Sort by score descending
  return forecast.sort((a, b) => b.score - a.score);
}

// ── Main forecast generator ──────────────────────────────────────
export async function generateForecast(subject, level = 'O Level', targetSession = null) {
  if (!targetSession) targetSession = getNextSession();

  const matrixData = await buildTopicMatrix(subject, level);
  if (!matrixData) {
    return {
      subject, level, targetSession,
      error: 'Not enough data — need questions with session tags',
      forecast: [],
      dataPoints: 0,
    };
  }

  const patterns = detectPatterns(matrixData.matrix, matrixData.sessions);

  // Try to load examiner report data
  let examinerData = null;
  try {
    const { EXAMINER_REPORTS } = await import('./examinerReportsKB.js');
    if (EXAMINER_REPORTS) {
      examinerData = EXAMINER_REPORTS.filter(e =>
        e.subject?.toLowerCase().includes(subject.toLowerCase()) ||
        subject.toLowerCase().includes(e.subject?.toLowerCase() || '')
      );
    }
  } catch { /* no examiner data available */ }

  const forecast = calculateForecast(patterns, targetSession, examinerData);

  return {
    subject,
    level,
    targetSession,
    generatedAt: new Date().toISOString(),
    sessionsAnalyzed: matrixData.sessions.length,
    sessionRange: `${matrixData.sessions[0]} — ${matrixData.sessions[matrixData.sessions.length - 1]}`,
    dataPoints: matrixData.totalQuestions,
    topicsTracked: Object.keys(patterns).length,
    forecast,
  };
}

// ── Get available subjects with enough data for forecasting ──────
export async function getRadarSubjects() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('question_bank')
    .select('subject, level, session')
    .eq('source', 'past_paper')
    .not('session', 'is', null);

  if (error || !data) return [];

  // Group by subject+level, count distinct sessions
  const groups = {};
  for (const row of data) {
    const key = `${row.subject}|${row.level}`;
    if (!groups[key]) groups[key] = { subject: row.subject, level: row.level, sessions: new Set(), count: 0 };
    groups[key].sessions.add(row.session);
    groups[key].count++;
  }

  return Object.values(groups)
    .filter(g => g.sessions.size >= 3) // Need at least 3 sessions for patterns
    .map(g => ({
      subject: g.subject,
      level: g.level,
      sessions: g.sessions.size,
      questions: g.count,
    }))
    .sort((a, b) => b.questions - a.questions);
}
