/**
 * pages/api/study-plan.js — Study plan generator + mastery tracking
 * ─────────────────────────────────────────────────────────────────
 * POST /api/study-plan { action: 'generate', subject, level, examDate, hoursPerWeek }
 * POST /api/study-plan { action: 'record', questionId, subject, level, topic, correct }
 * POST /api/study-plan { action: 'diagnostic', subject, level }
 * GET  /api/study-plan?action=mastery&subject=Chemistry&level=O+Level
 */

import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { generateStudyPlan, getSubjectTopics } from '../../utils/studyPlanEngine';
import { recordAnswer, getSubjectMastery, getDiagnosticResults } from '../../utils/masteryEngine';
import { addToQueue, processReview } from '../../utils/spacedRepEngine';
import { getSupabase } from '../../utils/supabase';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Login required' });
  }

  const userId = session.user.email;

  // GET requests
  if (req.method === 'GET') {
    const { action, subject, level = 'O Level' } = req.query;

    if (action === 'mastery' && subject) {
      const mastery = await getSubjectMastery(userId, subject, level);
      return res.status(200).json({ mastery });
    }

    if (action === 'topics' && subject) {
      const topics = await getSubjectTopics(subject, level);
      return res.status(200).json({ topics });
    }

    if (action === 'diagnostic' && subject) {
      const results = await getDiagnosticResults(userId, subject, level);
      return res.status(200).json({ results });
    }

    return res.status(400).json({ error: 'Invalid action' });
  }

  // POST requests
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST or GET only' });

  const { action } = req.body || {};

  try {
    // Generate study plan
    if (action === 'generate') {
      const { subject, level = 'O Level', examDate, hoursPerWeek = 5 } = req.body;
      if (!subject) return res.status(400).json({ error: 'Missing subject' });

      const plan = await generateStudyPlan(userId, subject, level, examDate, hoursPerWeek);

      // Save plan to database
      const supabase = getSupabase();
      // Deactivate existing plans for this subject, then insert new
      await supabase.from('study_plans').update({ active: false }).eq('user_id', userId).eq('subject', subject).eq('level', level);
      await supabase.from('study_plans').insert({
        user_id: userId,
        subject,
        level,
        exam_date: plan.examDate,
        plan: plan,
        active: true,
      });

      return res.status(200).json(plan);
    }

    // Record an answer + update mastery + SR queue
    if (action === 'record') {
      const { questionId, subject, level = 'O Level', topic, correct } = req.body;
      if (!subject || !topic || correct === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Update mastery
      const result = await recordAnswer(userId, questionId, subject, level, topic, correct, 'drill');

      // If wrong, add to SR queue
      if (!correct && questionId) {
        await addToQueue(userId, questionId, subject, topic);
      }

      // If this was a SR review, process it
      if (questionId && req.body.isReview) {
        const quality = correct ? 4 : 1;
        await processReview(userId, questionId, quality);
      }

      return res.status(200).json({
        ...result,
        message: result.levelChanged
          ? `Level up! ${topic}: Level ${result.masteryLevel}`
          : correct ? 'Correct!' : 'Added to review queue',
      });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (err) {
    console.error('[study-plan] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
