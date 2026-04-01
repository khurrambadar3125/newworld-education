/**
 * pages/api/cron/daily-question.js
 * ─────────────────────────────────────────────────────
 * Sends daily Cambridge questions to subscribers at their chosen study time.
 * Runs 5x daily at UTC 01,03,09,13,15 (PKT 06,08,14,18,20).
 * Each run sends only to subscribers whose studyTime matches the current PKT hour.
 * Falls back to DAILY_Q_RECIPIENTS env var if KV is empty.
 * ─────────────────────────────────────────────────────
 */

import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { dailyQuestionEmail } from '../../../utils/dailyQuestionEmail';
import { getAllSubscribers, recordQuestionSent, getRecentQuestions } from '../../../utils/db';
import { getRandomQuestion, toClientFormat } from '../../../utils/questionBank';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend    = new Resend(process.env.RESEND_API_KEY);

function isAuthorised(req) {
  const auth = req.headers['authorization'];
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

async function generateQuestion(grade, subject, recentQuestions = []) {
  // ── VERIFIED BANK FIRST — try real Cambridge past paper questions ──
  try {
    const level = (grade || '').includes('A Level') ? 'A Level' : 'O Level';
    const bankQ = await getRandomQuestion({ subject, level, curriculum: 'cambridge' });
    if (bankQ) {
      const formatted = toClientFormat(bankQ);
      return `${formatted.question}${formatted.marks ? ` [${formatted.marks} marks]` : ''}`;
    }
  } catch (bankErr) {
    console.error('[daily-question] Bank fetch failed, using AI fallback:', bankErr.message);
  }

  // ── AI FALLBACK — only if bank has no questions for this subject ──
  const avoidList = recentQuestions.length > 0
    ? `\n\nDo NOT repeat these recent questions:\n${recentQuestions.slice(0, 10).map((q, i) => `${i+1}. ${q}`).join('\n')}`
    : '';

  const msg = await anthropic.messages.create({
    model: /* PERMANENT: Haiku 3 only. Never change without Khurram's approval. */ 'claude-3-haiku-20240307',
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

    // ── Filter by study time: send only to subscribers whose hour matches now ──
    const nowPKT = new Date(Date.now() + 5 * 3600000);
    const currentHour = nowPKT.getUTCHours();
    const currentHHMM = String(currentHour).padStart(2, '0') + ':00';

    const eligible = recipients.filter(r => {
      const st = r.studyTime || '07:00';
      const stHour = parseInt(st.split(':')[0]);
      return stHour === currentHour;
    });

    if (eligible.length === 0) {
      return res.status(200).json({ sent: 0, total: recipients.length, eligible: 0, currentPKT: currentHHMM });
    }

    for (const recipient of eligible) {
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
      eligible:   eligible.length,
      currentPKT: currentHHMM,
      errorCount: errors.length,
      results,
      errors,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
