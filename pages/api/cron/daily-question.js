/**
 * pages/api/cron/daily-question.js
 * ─────────────────────────────────────────────────────────────────
 * Vercel Cron Job — runs daily at 7:00 AM PKT (02:00 UTC)
 * 
 * What it does:
 *   1. Loads all registered users from the user store (localStorage-based
 *      registrations are client-side, so this uses a simple Vercel KV / 
 *      email list stored as an env var for now — see RECIPIENTS below)
 *   2. For each user, generates a Cambridge-style question via Claude
 *   3. Sends a beautiful email via Resend
 *
 * SETUP:
 *   Add to Vercel env vars:
 *     CRON_SECRET        = any random string, e.g. "nwe_cron_2026"
 *     DAILY_Q_RECIPIENTS = JSON array: [{"email":"x@y.com","name":"Ali","grade":"O Level","subject":"Biology"}]
 *
 * Secured with CRON_SECRET header — Vercel sends this automatically.
 * ─────────────────────────────────────────────────────────────────
 */

import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { dailyQuestionEmail } from '../../../utils/dailyQuestionEmail';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

// ── Verify this is called by Vercel cron, not a random visitor ───────────────
function isAuthorised(req) {
  const secret = req.headers['authorization']?.replace('Bearer ', '');
  return secret === process.env.CRON_SECRET;
}

// ── Generate one question for a student ─────────────────────────────────────
async function generateDailyQuestion({ grade, subject }) {
  const prompt = `Generate a single Cambridge ${grade} ${subject} exam question.

Return ONLY valid JSON, no markdown, no preamble:
{
  "question": "The full question text",
  "type": "mcq",
  "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "correctOption": "A",
  "difficulty": "medium",
  "topic": "Topic name",
  "markschemeHint": "Key points examiners look for (1-2 sentences)"
}

Rules:
- Make it a real Cambridge-style MCQ (4 options)
- Difficulty: medium (exam level, not too easy, not a trick)
- The question must test understanding, not just recall
- correctOption must be the single best answer`;

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001', // Haiku — cheap for daily sends
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0]?.text || '';
  // Strip any markdown fences just in case
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// ── Main handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Only allow GET (Vercel cron) or POST with secret
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthorised(req)) {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  // Load recipient list from env var
  let recipients = [];
  try {
    recipients = JSON.parse(process.env.DAILY_Q_RECIPIENTS || '[]');
  } catch {
    return res.status(500).json({ error: 'DAILY_Q_RECIPIENTS env var is invalid JSON' });
  }

  if (!recipients.length) {
    return res.status(200).json({ sent: 0, message: 'No recipients configured' });
  }

  const results = [];

  for (const user of recipients) {
    try {
      // Generate question
      const q = await generateDailyQuestion({
        grade: user.grade || 'O Level',
        subject: user.subject || 'Biology',
      });

      // Build answer URL — links to drill page with subject pre-selected
      const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.newworld.education';
      const answerUrl = `${base}/drill?subject=${encodeURIComponent(user.subject || 'Biology')}&topic=${encodeURIComponent(q.topic || '')}&answer=${encodeURIComponent(q.correctOption || '')}&from=daily`;

      // Render email
      const html = dailyQuestionEmail({
        studentName: user.name || 'Student',
        grade: user.grade || 'O Level',
        subject: user.subject || 'Biology',
        question: q.question,
        options: q.options,
        questionType: q.type || 'mcq',
        difficulty: q.difficulty || 'medium',
        answerUrl,
        streakDays: user.streakDays || 0,
      });

      // Send email
      const { error } = await resend.emails.send({
        from: 'Starky ★ <starky@newworld.education>',
        to: user.email,
        subject: `★ Daily ${user.subject || 'Science'} Question — ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}`,
        html,
      });

      if (error) {
        results.push({ email: user.email, status: 'failed', error: error.message });
      } else {
        results.push({ email: user.email, status: 'sent', subject: user.subject, topic: q.topic });
      }

    } catch (err) {
      results.push({ email: user.email, status: 'error', error: err.message });
    }
  }

  const sent = results.filter(r => r.status === 'sent').length;
  console.log(`[DAILY QUESTION] Sent ${sent}/${recipients.length}`, results);

  return res.status(200).json({
    sent,
    total: recipients.length,
    results,
    timestamp: new Date().toISOString(),
  });
}
