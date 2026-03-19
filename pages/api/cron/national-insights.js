/**
 * /api/cron/national-insights.js
 * Daily at 6am PKT (01:00 UTC) — builds anonymised national data from Supabase.
 */

import { getSupabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }

  try {
    const sb = getSupabase();
    if (!sb) return res.status(200).json({ ok: true, error: 'No Supabase' });

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Aggregate from daily insights
    const { data: rows } = await sb.from('platform_insights')
      .select('data').eq('insight_type', 'daily')
      .gte('date', weekAgo.toISOString().split('T')[0]).limit(7);

    const topicConfusion = {};
    const subjectActivity = {};
    const hourlyActivity = new Array(24).fill(0);
    const gradeActivity = {};
    let totalMessages = 0, totalStudents = 0;

    for (const row of (rows || [])) {
      const ins = row.data || {};
      totalMessages += ins.totalMessages || 0;
      totalStudents += ins.uniqueStudents || 0;
      for (const t of (ins.topConfusionTopics || [])) topicConfusion[t.topic] = (topicConfusion[t.topic] || 0) + t.confusionCount;
      for (const [s, c] of Object.entries(ins.subjectActivity || {})) subjectActivity[s] = (subjectActivity[s] || 0) + c;
      for (const [g, c] of Object.entries(ins.gradeActivity || {})) gradeActivity[g] = (gradeActivity[g] || 0) + c;
      (ins.hourlyActivity || []).forEach((c, h) => { hourlyActivity[h] += c; });
    }

    const peakHourUTC = hourlyActivity.indexOf(Math.max(...hourlyActivity));
    const peakHourPKT = (peakHourUTC + 5) % 24;

    const nationalInsights = {
      weekOf: new Date().toISOString().split('T')[0],
      totalMessagesThisWeek: totalMessages,
      activeStudentsThisWeek: totalStudents,
      mostConfusedTopics: Object.entries(topicConfusion).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t),
      mostActiveSubjects: Object.entries(subjectActivity).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([s]) => s),
      mostActiveGrades: Object.entries(gradeActivity).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([g]) => g),
      peakStudyTime: `${peakHourPKT}:00 - ${(peakHourPKT + 1) % 24}:00 PKT`,
      updatedAt: new Date().toISOString(),
    };

    // Store as insight
    await sb.from('platform_insights').upsert({
      date: new Date().toISOString().split('T')[0],
      insight_type: 'national',
      data: nationalInsights,
    }, { onConflict: 'date,insight_type' });

    return res.status(200).json({ ok: true, ...nationalInsights });
  } catch (err) {
    console.error('[NATIONAL INSIGHTS ERROR]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
