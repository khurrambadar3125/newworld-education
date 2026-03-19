/**
 * /api/insights.js
 * Public API for national learning insights from Supabase.
 */

import { getSupabase } from '../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const sb = getSupabase();
    if (!sb) return res.status(200).json({});

    const { data } = await sb.from('platform_insights')
      .select('data')
      .eq('insight_type', 'national')
      .order('date', { ascending: false })
      .limit(1)
      .single();

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    return res.status(200).json(data?.data || {});
  } catch {
    return res.status(200).json({});
  }
}
