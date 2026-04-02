/**
 * pages/api/todays-plan.js — Personalized daily learning plan
 * ─────────────────────────────────────────────────────────────────
 * GET /api/todays-plan?subject=Chemistry&level=O+Level
 * Returns: today's activities, mastery summary, streak info
 */

import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { getTodaysPlan } from '../../utils/studyPlanEngine';
import { getDueCount } from '../../utils/spacedRepEngine';
import { getAllMastery } from '../../utils/masteryEngine';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Login required' });
  }

  const userId = session.user.email;
  const { subject, level = 'O Level' } = req.query || {};

  try {
    if (!subject) {
      // No subject specified — return overview across all subjects
      const [allMastery, dueCount] = await Promise.all([
        getAllMastery(userId),
        getDueCount(userId),
      ]);

      return res.status(200).json({
        overview: true,
        subjects: allMastery,
        reviewsDue: dueCount,
        message: dueCount > 0
          ? `You have ${dueCount} reviews due. Start there.`
          : allMastery.length > 0
            ? 'Pick a subject to see your plan.'
            : 'Start a diagnostic test to build your first plan.',
      });
    }

    const plan = await getTodaysPlan(userId, subject, level);
    return res.status(200).json(plan);
  } catch (err) {
    console.error('[todays-plan] Error:', err.message);
    return res.status(500).json({ error: 'Failed to generate plan' });
  }
}
