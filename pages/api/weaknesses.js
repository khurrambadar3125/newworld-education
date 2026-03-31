/**
 * /api/weaknesses — Query Cambridge weaknesses for a student
 * GET ?email=...&token=... — returns all weaknesses for the student
 */

import { getSupabase } from '../../utils/supabase';

import { validateStudentAccess, isAdmin } from '../../utils/apiAuth';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Email required' });

  // Auth: student can only view their own weaknesses, or admin
  if (!isAdmin(req)) {
    const access = validateStudentAccess(req, email);
    if (!access.valid) return res.status(403).json({ error: 'Unauthorised — provide x-student-email header matching the queried email' });
  }

  const sb = getSupabase();
  if (!sb) return res.status(200).json({ weaknesses: [], resolved: [] });

  try {
    // Get unresolved weaknesses
    const { data: active, error: e1 } = await sb.from('cambridge_weaknesses')
      .select('*')
      .eq('student_id', email)
      .eq('resolved', false)
      .order('severity', { ascending: true }) // high first (alphabetical: h < l < m)
      .order('frequency', { ascending: false });

    // Get resolved weaknesses
    const { data: resolved, error: e2 } = await sb.from('cambridge_weaknesses')
      .select('*')
      .eq('student_id', email)
      .eq('resolved', true)
      .order('resolved_at', { ascending: false })
      .limit(10);

    // Sort active: high severity first, then by frequency
    const severityOrder = { high: 0, medium: 1, low: 2 };
    const sorted = (active || []).sort((a, b) => {
      const sev = (severityOrder[a.severity] || 2) - (severityOrder[b.severity] || 2);
      if (sev !== 0) return sev;
      return (b.frequency || 1) - (a.frequency || 1);
    });

    return res.status(200).json({
      weaknesses: sorted,
      resolved: resolved || [],
      total_active: sorted.length,
      total_resolved: (resolved || []).length,
    });
  } catch (err) {
    return res.status(200).json({ weaknesses: [], resolved: [], error: err.message });
  }
}
