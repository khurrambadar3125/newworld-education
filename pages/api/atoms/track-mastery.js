/**
 * /api/atoms/track-mastery.js
 * POST — Upsert atom mastery for a student.
 *
 * Receives: { studentId, atomId, masteryScore }
 * Upserts to Supabase atom_mastery table:
 *   { student_id, atom_id, mastery_score, times_seen, last_seen }
 * UNIQUE constraint on (student_id, atom_id).
 */

import { createClient } from '@supabase/supabase-js';
import { validateStudentAccess, isCron } from '../../../utils/apiAuth';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SECRET_KEY || ''
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { studentId, atomId, masteryScore } = req.body;

  if (!studentId || !atomId) {
    return res.status(400).json({ error: 'studentId and atomId required' });
  }

  // Auth: student can only update their own mastery, or internal calls from anthropic.js
  const referer = req.headers['referer'] || '';
  const isInternal = referer.includes('newworld.education') || referer.includes('localhost') || !referer;
  if (!isInternal && !isCron(req)) {
    const access = validateStudentAccess(req, studentId);
    if (!access.valid) return res.status(403).json({ error: access.error });
  }

  const score = typeof masteryScore === 'number' ? Math.min(10, Math.max(0, masteryScore)) : 0;

  try {
    // Check if record exists
    const { data: existing } = await supabase
      .from('atom_mastery')
      .select('id, times_seen')
      .eq('student_id', studentId)
      .eq('atom_id', atomId)
      .limit(1);

    if (existing?.length) {
      // Update existing record
      await supabase
        .from('atom_mastery')
        .update({
          mastery_score: score,
          times_seen: (existing[0].times_seen || 0) + 1,
          last_seen: new Date().toISOString(),
        })
        .eq('id', existing[0].id);
    } else {
      // Insert new record
      await supabase.from('atom_mastery').insert({
        student_id: studentId,
        atom_id: atomId,
        mastery_score: score,
        times_seen: 1,
        last_seen: new Date().toISOString(),
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[atoms/track-mastery]', err.message);
    return res.status(200).json({ success: true, note: 'fallback' });
  }
}
