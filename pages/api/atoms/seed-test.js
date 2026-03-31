/**
 * pages/api/atoms/seed-test.js
 * Seeds test mastery data for khurram@newworld.education so weekly-progress email can be tested.
 * GET /api/atoms/seed-test?test=true
 * GET /api/atoms/seed-test?test=true&clear=true  — removes test data
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SECRET_KEY || ''
);

const TEST_STUDENT = 'khurram@newworld.education';

const SEED_DATA = [
  // Chemistry — 4 mastered this week, 2 in progress
  { atom_id: 'chem_rate_001', mastery_score: 8, times_seen: 3, last_seen: daysAgo(1) },
  { atom_id: 'chem_rate_002', mastery_score: 9, times_seen: 2, last_seen: daysAgo(2) },
  { atom_id: 'chem_bond_001', mastery_score: 7, times_seen: 4, last_seen: daysAgo(3) },
  { atom_id: 'chem_bond_002', mastery_score: 8, times_seen: 2, last_seen: daysAgo(0) },
  { atom_id: 'chem_equil_001', mastery_score: 4, times_seen: 2, last_seen: daysAgo(1) },
  { atom_id: 'chem_acid_001', mastery_score: 3, times_seen: 1, last_seen: daysAgo(5) },
  // Biology — 2 mastered this week, 1 in progress
  { atom_id: 'bio_osmosis_001', mastery_score: 9, times_seen: 3, last_seen: daysAgo(2) },
  { atom_id: 'bio_enzyme_001', mastery_score: 8, times_seen: 2, last_seen: daysAgo(4) },
  { atom_id: 'bio_photo_001', mastery_score: 5, times_seen: 2, last_seen: daysAgo(1) },
  // Physics — 1 mastered older, 1 in progress
  { atom_id: 'phys_force_001', mastery_score: 7, times_seen: 3, last_seen: daysAgo(10) },
  { atom_id: 'phys_wave_001', mastery_score: 2, times_seen: 1, last_seen: daysAgo(3) },
];

function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });
  if (req.query.test !== 'true') return res.status(401).json({ error: 'Add ?test=true' });

  try {
    // Clear mode
    if (req.query.clear === 'true') {
      const { error } = await supabase
        .from('atom_mastery')
        .delete()
        .eq('student_id', TEST_STUDENT);
      if (error) throw error;
      return res.status(200).json({ cleared: true, student: TEST_STUDENT });
    }

    // Delete existing test data first
    await supabase.from('atom_mastery').delete().eq('student_id', TEST_STUDENT);

    // Insert seed data
    const rows = SEED_DATA.map(d => ({ student_id: TEST_STUDENT, ...d }));
    const { error } = await supabase.from('atom_mastery').insert(rows);
    if (error) throw error;

    const mastered = SEED_DATA.filter(d => d.mastery_score >= 7).length;
    const inProgress = SEED_DATA.filter(d => d.mastery_score >= 1 && d.mastery_score < 7).length;

    return res.status(200).json({
      seeded: true,
      student: TEST_STUDENT,
      records: SEED_DATA.length,
      mastered,
      inProgress,
      message: `Now hit /api/weekly-progress?test=true to send the test email`,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
