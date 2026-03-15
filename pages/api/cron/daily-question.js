/**
 * pages/api/cron/daily-question.js
 * ─────────────────────────────────────────────────────
 * Sends daily Cambridge questions to ALL subscribers.
 * Runs once daily at 02:00 UTC = 07:00 PKT.
 * Study time preference is stored for future Pro plan upgrade (multi-run support).
 * Falls back to DAILY_Q_RECIPIENTS env var if KV is empty.
 * ─────────────────────────────────────────────────────
 */

import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { dailyQuestionEmail } from '../../../utils/dailyQuestionEmail';
import { getAllSubscribers, recordQuestionSent, getRecentQuestions } from '../../../utils/db';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend    = new Resend(process.env.RESEND_API_KEY);

function isAuthorised(req) {
  const auth = req.headers['authorization'];
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

async function generateQuestion(grade, subject, recentQuestions = []) {
  const avoidList = recentQuestions.length > 0
    ? `\n\nDo NOT repeat these recent questions:\n${recentQuestions.slice(0, 10).map((q, i) => `${i+1}. ${q}`).join('\n')}`
    : '';

  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: `You are a Cambridge examiner. Generate ONE challenging exam-style question for a ${grade} student studying ${subject}.

Requirements:
- Cambridge O/A Level style if applicable
- Clear, unambiguous question
- Appropriate difficulty for ${grade}
- Include mark allocation e.g. [4 marks]
- Do NOT include the answer${avoidList}

Return ONLY the question text. Nothing else.`,
    }],
  });

  return msg.content[0].text.trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!isAuthorised(req)) return res.status(401).json({ error: 'Unauthorized' });

  const results = [];
  const errors  = [];
  const today   = new Date().toISOString().split('T')[0];

  try {
    // ── Get recipients: KV first, fallback to env var ──
    let recipients = await getAllSubscribers();

    // Fallback to env var (for Yusuf, Dina, Saira and any manual entries)
    if (recipients.length === 0) {
      try {
        const envRecipients = JSON.parse(process.env.DAILY_Q_RECIPIENTS || '[]');
        recipients = envRecipients.map(r => ({
          name: r.name,
          email: r.email,
          grade: r.grade,
          subject: r.subject,
          studyTime: '07:00',
          fromEnv: true,
        }));
      } catch {
        return res.status(500).json({ error: 'No recipients found' });
      }
    } else {
      // Also include env var recipients (Yusuf, Dina, Saira) who aren't in KV yet
      try {
        const envRecipients = JSON.parse(process.env.DAILY_Q_RECIPIENTS || '[]');
        for (const r of envRecipients) {
          const alreadyInKV = recipients.find(s => s.email === r.email);
          if (!alreadyInKV) {
            recipients.push({
              name: r.name,
              email: r.email,
              grade: r.grade,
              subject: r.subject,
              studyTime: '07:00',
              fromEnv: true,
            });
          }
        }
      } catch {}
    }

    // ── Send to all recipients (Hobby plan: single daily run at 07:00 PKT) ──
    // Study time preference stored for future Pro plan upgrade
    for (const recipient of recipients) {
      try {
        // Get recent questions to avoid repeats
        const recentQs = recipient.fromEnv ? [] : await getRecentQuestions(recipient.email, 30);

        // Generate question
        const question = await generateQuestion(recipient.grade, recipient.subject, recentQs);

        // Build email HTML
        const html = dailyQuestionEmail({
          studentName: recipient.name,
          grade:       recipient.grade,
          subject:     recipient.subject,
          question,
          questionType: 'structured',
          difficulty:   'medium',
          answerUrl:    `https://www.newworld.education/?subject=${encodeURIComponent(recipient.subject)}&grade=${encodeURIComponent(recipient.grade)}`,
          streakDays:   0,
        });

        // Send email
        await resend.emails.send({
          from:    'Starky ★ <hello@newworld.education>',
          to:      recipient.email,
          subject: `Your daily ${recipient.subject} question — ${new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'short' })}`,
          html,
        });

        // Record in KV (skip env-only recipients)
        if (!recipient.fromEnv) {
          await recordQuestionSent({
            email:    recipient.email,
            grade:    recipient.grade,
            subject:  recipient.subject,
            question,
            date:     today,
          });
        }

        results.push({ name: recipient.name, email: recipient.email, subject: recipient.subject, ok: true });
      } catch (err) {
        errors.push({ name: recipient.name, email: recipient.email, error: err.message });
      }
    }

    return res.status(200).json({
      sent:       results.length,
      total:      recipients.length,
      errorCount: errors.length,
      results,
      errors,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
