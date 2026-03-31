/**
 * /api/predictions — Get predicted risks for a student
 */
import { getSupabase } from '../../utils/supabase';

import { validateStudentAccess, isAdmin } from '../../utils/apiAuth';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Email required' });

  // Auth: student can only view their own predictions, or admin
  if (!isAdmin(req)) {
    const access = validateStudentAccess(req, email);
    if (!access.valid) return res.status(403).json({ error: 'Unauthorised' });
  }

  const sb = getSupabase();
  if (!sb) return res.status(200).json({ predictions: [] });

  try {
    const { data } = await sb.from('student_predictions')
      .select('*')
      .eq('student_id', email)
      .eq('actioned', false)
      .order('prediction_confidence', { ascending: true })
      .limit(10);

    return res.status(200).json({ predictions: data || [] });
  } catch (err) {
    return res.status(200).json({ predictions: [], error: err.message });
  }
}
