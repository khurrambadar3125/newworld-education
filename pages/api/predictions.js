/**
 * /api/predictions — Get predicted risks for a student
 */
import { getSupabase } from '../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Email required' });

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
