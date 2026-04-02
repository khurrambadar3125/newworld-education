/**
 * pages/api/exam-compass.js — Exam Compass API
 * ─────────────────────────────────────────────────────────────────
 * Free feature: forecasts likely Cambridge exam topics based on
 * past paper pattern analysis. No login required.
 *
 * GET /api/exam-compass?subject=Chemistry&level=O+Level
 * GET /api/exam-compass?action=subjects  (list available subjects)
 */

import { generateForecast, getRadarSubjects, getNextSession } from '../../utils/examCompassEngine';

export default async function handler(req, res) {
  // CORS for public access
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');

  const { action, subject, level = 'O Level', session } = req.query || {};

  try {
    // List available subjects
    if (action === 'subjects') {
      const subjects = await getRadarSubjects();
      return res.status(200).json({
        subjects,
        nextSession: getNextSession(),
      });
    }

    // Generate forecast
    if (!subject) {
      return res.status(400).json({ error: 'Missing subject parameter' });
    }

    const forecast = await generateForecast(subject, level, session || null);

    return res.status(200).json(forecast);
  } catch (err) {
    console.error('[exam-compass] Error:', err.message);
    return res.status(500).json({ error: 'Forecast generation failed' });
  }
}
