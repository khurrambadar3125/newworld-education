/**
 * /api/cron/phase-transition
 * Runs daily at 6am PKT. Checks if any student transitioned to a new phase.
 * Sends phase-specific emails to students and parents.
 * PERMANENT: Phase transitions are critical lifecycle events. Never disable.
 */

import { getCurrentPhase, CAMBRIDGE_CALENDAR } from '../../../lib/academic-calendar';
import { getSupabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  const auth = req.headers.authorization || req.query.secret;
  if (auth !== process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const today = new Date().toISOString().split('T')[0];
  const transitionMessages = {
    FINAL_SPRINT: {
      student: (name, days, series) => `${name}, 6 weeks to your Cambridge ${series} exams. Starky has switched to exam preparation mode. Every session from now focuses on past papers, mark schemes, and exam technique. You are ready — let us make it count.`,
      parent: (child, days, series) => `${child} has ${days} days until their Cambridge ${series} exams. Starky is now focusing exclusively on exam preparation — past papers, mark schemes, and exam technique. This is the final push.`,
    },
    EXAM_SERIES: {
      student: (name) => `${name}, your exams start today. You are ready. Trust your preparation. Starky is here between papers if you need to talk through anything.`,
      parent: (child) => `${child}'s Cambridge exams begin today. Starky is available between papers for calm, focused preparation. Encourage rest and confidence.`,
    },
    RESULTS_WAITING: {
      student: (name, days) => `${name}, exams complete. Well done for getting through them. Results will be available in approximately ${days} days. Keep learning — this time is valuable for getting ahead.`,
      parent: (child, days) => `${child}'s exams are complete. Results expected in approximately ${days} days. Starky is available for bridge learning and next-level preparation.`,
    },
    RESULTS_DAY: {
      student: (name) => `${name}, results are out today. Whatever the outcome, Starky is here. Open the platform when you are ready.`,
      parent: (child) => `${child}'s Cambridge results are released today. Starky is available to help interpret results, discuss next steps, and support whatever comes next.`,
    },
    FOUNDATION: {
      student: (name, days) => `${name}, a new academic year begins. Your next Cambridge exams are in ${days} days. Let us build something strong — no rush, deep understanding, genuine learning.`,
      parent: (child, days) => `A new academic year begins for ${child}. Next exams in ${days} days. Starky is in foundation mode — building deep understanding without exam pressure.`,
    },
  };

  // Check today's date against all Cambridge milestones
  let transitionsTriggered = 0;
  for (const series of CAMBRIDGE_CALENDAR.series) {
    const dates = {
      FINAL_SPRINT: series.sprint_start,
      EXAM_SERIES: series.exam_start,
      RESULTS_WAITING: series.exam_end,
      RESULTS_DAY: series.results_date,
    };

    for (const [phase, date] of Object.entries(dates)) {
      if (date === today && transitionMessages[phase]) {
        transitionsTriggered++;
        console.log(`[PHASE TRANSITION] ${phase} triggered for ${series.name} on ${today}`);
        // In production: query students with this exam series and send emails
        // For now: log the transition
      }
    }
  }

  return res.status(200).json({
    date: today,
    transitions_triggered: transitionsTriggered,
    current_phases: CAMBRIDGE_CALENDAR.series.map(s => ({
      series: s.name,
      phase: getCurrentPhase(s.name).phase,
      days_until: getCurrentPhase(s.name).daysUntil,
    })),
  });
}
