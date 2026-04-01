/**
 * pages/api/question-bank/stats.js
 * ─────────────────────────────────────────────────────────────────
 * View question bank statistics: counts, coverage, quality, gaps.
 * Protected: requires admin password.
 *
 * GET ?subject=Biology&level=O+Level&curriculum=cambridge
 * Returns: { total, bySubject, byDifficulty, byType, coverageGaps, ... }
 */

import { getBankStats } from '../../../utils/questionBank';
import { isAdmin } from '../../../utils/apiAuth';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });
  if (!isAdmin(req)) return res.status(401).json({ error: 'Admin auth required' });

  const { subject, level, curriculum } = req.query;

  try {
    const stats = await getBankStats({ subject, level, curriculum });
    return res.status(200).json(stats);
  } catch (err) {
    console.error('[Stats API Error]', err);
    return res.status(500).json({ error: 'Failed to get stats: ' + err.message });
  }
}
