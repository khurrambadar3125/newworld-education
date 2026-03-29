/**
 * /api/health — Quick platform health check
 * Returns status of all systems. Used by Claude Code on session start.
 * No auth required for basic check. Detailed check requires secret.
 */

import { getSupabase } from '../../utils/supabase';

export default async function handler(req, res) {
  const detailed = req.query.secret === process.env.CRON_SECRET || req.query.password === process.env.DASHBOARD_PASSWORD;
  const sb = getSupabase();
  const health = { status: 'ok', timestamp: new Date().toISOString(), checks: {} };

  // Quick Supabase check
  try {
    const { error } = await sb?.from('platform_insights').select('date').limit(1);
    health.checks.supabase = error ? 'error' : 'ok';
  } catch { health.checks.supabase = 'error'; }

  // Check recent errors from platform_insights
  if (detailed && sb) {
    try {
      const { data } = await sb.from('platform_insights')
        .select('data')
        .eq('insight_type', 'health_check')
        .order('date', { ascending: false })
        .limit(1);
      if (data?.[0]?.data) {
        health.lastHealthCheck = data[0].data;
      }
    } catch {}

    // Recent content violations
    try {
      const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
      const { data } = await sb.from('content_violations').select('id').gte('timestamp', oneDayAgo);
      health.checks.violations_24h = data?.length || 0;
    } catch {}

    // Recent news published
    try {
      const { data } = await sb.from('news_articles').select('id').gte('date', new Date(Date.now() - 86400000).toISOString().split('T')[0]);
      health.checks.news_24h = data?.length || 0;
    } catch {}

    // Total students with signals
    try {
      const { data } = await sb.from('student_signals').select('email').limit(1000);
      const unique = new Set(data?.map(d => d.email) || []);
      health.checks.total_students = unique.size;
    } catch {}

    // Total sessions analysed
    try {
      const { data } = await sb.from('teaching_insights').select('id').limit(10000);
      health.checks.total_sessions_analysed = data?.length || 0;
    } catch {}
  }

  // Overall status
  if (health.checks.supabase === 'error') health.status = 'degraded';

  res.status(200).json(health);
}
