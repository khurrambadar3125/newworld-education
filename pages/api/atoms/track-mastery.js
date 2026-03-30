/**
 * /api/atoms/track-mastery — Track student mastery of individual knowledge atoms
 * Called after each Starky conversation when nano-weakness maps to an atom ID
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SECRET_KEY || ''
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Return student's mastery map
    const { email, subject } = req.query;
    if (!email) return res.status(400).json({ error: 'email required' });

    try {
      let query = supabase
        .from('atom_mastery')
        .select('atom_id, score, attempts, last_seen, mastered')
        .eq('student_id', email);

      if (subject) query = query.eq('subject', subject.toLowerCase());

      const { data } = await query;
      return res.status(200).json({ mastery: data || [] });
    } catch {
      return res.status(200).json({ mastery: [] });
    }
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'GET or POST only' });

  const { student_id, atom_id, subject, score } = req.body;
  if (!student_id || !atom_id) return res.status(400).json({ error: 'student_id and atom_id required' });

  const masteryScore = typeof score === 'number' ? Math.min(10, Math.max(0, score)) : 5;

  try {
    const { data: existing } = await supabase
      .from('atom_mastery')
      .select('id, score, attempts, scores_history')
      .eq('student_id', student_id)
      .eq('atom_id', atom_id)
      .limit(1);

    if (existing?.length) {
      const history = existing[0].scores_history || [];
      history.push(masteryScore);
      if (history.length > 20) history.shift();
      const avg = history.reduce((a, b) => a + b, 0) / history.length;
      const mastered = history.slice(-3).length >= 3 && history.slice(-3).every(s => s >= 9);

      await supabase
        .from('atom_mastery')
        .update({
          score: Math.round(avg * 10) / 10,
          attempts: (existing[0].attempts || 0) + 1,
          scores_history: history,
          mastered,
          last_seen: new Date().toISOString(),
        })
        .eq('id', existing[0].id);
    } else {
      await supabase.from('atom_mastery').insert({
        student_id,
        atom_id,
        subject: subject || '',
        score: masteryScore,
        attempts: 1,
        scores_history: [masteryScore],
        mastered: masteryScore >= 9,
        first_seen: new Date().toISOString(),
        last_seen: new Date().toISOString(),
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[atoms/track-mastery]', err.message);
    return res.status(200).json({ success: true, note: 'fallback' });
  }
}
