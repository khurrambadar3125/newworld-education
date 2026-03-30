/**
 * /api/atoms/get-mastery.js
 * GET — Return all atom_mastery records for a student + subject.
 *
 * Query params: studentId, subject
 * Returns: { mastery: [{ atom_id, mastery_score, times_seen, last_seen }] }
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SECRET_KEY || ''
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const { studentId, subject } = req.query;

  if (!studentId) {
    return res.status(400).json({ error: 'studentId required' });
  }

  try {
    let query = supabase
      .from('atom_mastery')
      .select('atom_id, mastery_score, times_seen, last_seen')
      .eq('student_id', studentId);

    // Filter by subject prefix if provided (atom IDs start with subject abbreviation)
    if (subject) {
      const prefixMap = {
        chemistry: 'chem_',
        physics: 'phys_',
        biology: 'bio_',
        mathematics: 'math_',
        economics: 'econ_',
        english: 'eng_',
      };
      const prefix = prefixMap[subject.toLowerCase()] || '';
      if (prefix) {
        query = query.like('atom_id', `${prefix}%`);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('[atoms/get-mastery]', error.message);
      return res.status(200).json({ mastery: [] });
    }

    return res.status(200).json({ mastery: data || [] });
  } catch (err) {
    console.error('[atoms/get-mastery]', err.message);
    return res.status(200).json({ mastery: [] });
  }
}
