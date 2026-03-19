/**
 * /api/cron/auto-improve.js
 * Weekly autonomous improvement — runs Sunday 3am PKT (Saturday 22:00 UTC).
 */

import { runAutoImprovements } from '../../../utils/autoImprover';

export default async function handler(req, res) {
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }

  try {
    console.log('[AUTO IMPROVE] Running...');
    const improvements = await runAutoImprovements();
    console.log(`[AUTO IMPROVE] ${improvements.length} improvements applied.`);
    return res.status(200).json({ ok: true, improvements });
  } catch (err) {
    console.error('[AUTO IMPROVE ERROR]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
