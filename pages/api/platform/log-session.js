/**
 * /api/platform/log-session — Stores anonymised session learning records.
 * Called automatically at end of every session.
 * Non-blocking — failure here never affects the student experience.
 */

import { getSupabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const sb = getSupabase();
    if (!sb) return res.status(200).json({ ok: true, stored: false, reason: 'no supabase' });

    const data = req.body;
    if (!data?.session_id) return res.status(200).json({ ok: true, stored: false, reason: 'no session_id' });

    // Store anonymised record — no name, no email, no PII
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
    }).then(() => {});

    return res.status(200).json({ ok: true, stored: true });
  } catch (e) {
    // Never fail — this is non-critical
    return res.status(200).json({ ok: true, stored: false, reason: 'error' });
  }
}
