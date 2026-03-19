/**
 * /api/cron/signal-analysis.js
 * Nightly pattern analysis — runs at 2am PKT (21:00 UTC) daily.
 * Reads signals from Supabase and stores insights.
 */

import { getSupabase } from '../../../utils/supabase';
import { analyseDay } from '../../../utils/patternEngine';

export default async function handler(req, res) {
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }

  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];

    console.log(`[SIGNAL ANALYSIS] Analysing ${dateStr}...`);
    const insights = await analyseDay(dateStr);

    // Store in Supabase
    const sb = getSupabase();
    if (sb) {
      await sb.from('platform_insights').upsert({
        date: dateStr,
        insight_type: 'daily',
        data: insights,
      }, { onConflict: 'date,insight_type' });
    }

    console.log(`[SIGNAL ANALYSIS] Done: ${insights.totalMessages} msgs, ${insights.uniqueStudents} students`);
    return res.status(200).json({ ok: true, date: dateStr, messages: insights.totalMessages });
  } catch (err) {
    console.error('[SIGNAL ANALYSIS ERROR]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
