/**
 * /api/platform/log-session — Stores anonymised session learning records.
 * Called automatically at end of every session.
 * Non-blocking — failure here never affects the student experience.
 */

import { getSupabase } from '../../../utils/supabase';

// Engagement score: 0-10 based on duration, messages, student initiative, extension
// Baseline: 20 min session, 10 messages = score 5
function calculateEngagement(data, durationMinutes) {
  if (data.abandoned) return Math.min(3, Math.round(((data.messages_count || 0) / 10) * 3));
  const dur = Math.min((durationMinutes || 0) / 20, 2.0);
  const msg = Math.min((data.messages_count || 0) / 10, 2.0);
  const init = (data.messages_count > 0) ? ((data.student_initiated_messages || 0) / data.messages_count) : 0;
  const ext = data.extended ? 1.5 : 1.0;
  return Math.min(10, Math.round(dur * 3 + msg * 3 + init * 2 + ext * 2));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const sb = getSupabase();
    if (!sb) return res.status(200).json({ ok: true, stored: false, reason: 'no supabase' });

    const data = req.body;
    if (!data?.session_id) return res.status(200).json({ ok: true, stored: false, reason: 'no session_id' });

    // Store anonymised record — no name, no email, no PII
    // Engagement tracking: duration, messages, initiative, extension, abandonment
    const sessionStart = data.session_start ? new Date(data.session_start) : null;
    const sessionEnd = data.session_end ? new Date(data.session_end) : new Date();
    const durationMinutes = sessionStart ? Math.round((sessionEnd - sessionStart) / 60000) : null;
    const engagementScore = calculateEngagement(data, durationMinutes);

    await sb.from('platform_learning').insert({
      session_id: data.session_id,
      created_at: data.timestamp || new Date().toISOString(),
      country: data.country || null,
      curriculum: data.curriculum || null,
      grade: data.grade || null,
      subject: data.subject || null,
      outcome: data.outcome || null,
      gaps_count: data.gaps_count || 0,
      repeat_count: data.repeat_count || 0,
      extended: data.extended || false,
      abandoned: data.abandoned || false,
      voice_delta: data.voice_delta || null,
      conditions: data.conditions || [],
      // ── Engagement tracking fields ──
      session_start: sessionStart?.toISOString() || null,
      session_end: sessionEnd.toISOString(),
      session_duration_minutes: durationMinutes,
      messages_count: data.messages_count || 0,
      student_initiated_messages: data.student_initiated_messages || 0,
      engagement_score: engagementScore,
      condition: data.condition || null,
    }).then(() => {});

    return res.status(200).json({ ok: true, stored: true });
  } catch (e) {
    // Never fail — this is non-critical
    return res.status(200).json({ ok: true, stored: false, reason: 'error' });
  }
}
