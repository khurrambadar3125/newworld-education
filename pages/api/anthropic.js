/**
 * pages/api/anthropic.js
 * Starky API — with live parent alert firing on escalation.
 */

import Anthropic from '@anthropic-ai/sdk';
import { buildMessages } from '../../utils/starkyPrompt';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ALLOWED_ORIGINS = [
  'https://newworld.education',
  'https://www.newworld.education',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
].filter(Boolean);

// ─── Trigger parent alert (calls /api/alert internally) ──────────────────────

async function triggerParentAlert({ alertType, alertLevel, alertMessage, studentName, parentPhone, parentEmail, timestamp }) {
  try {
    // Build base URL from environment, fallback to production
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.newworld.education';

    await fetch(`${base}/api/alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alertType,
        alertLevel,
        alertMessage,
        studentName,
        parentPhone,
        parentEmail,
        timestamp,
      }),
    });
  } catch (e) {
    // Never let alert failure crash the main response
    console.error('[ALERT TRIGGER FAILED]', e.message);
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    const {
      message,
      imageBase64,
      imageMediaType,
      userProfile   = {},
      sessionMemory = {},
      // Legacy support: if old StarkyBubble sends messages array + system, handle it
      messages: legacyMessages,
      system: legacySystem,
    } = req.body;

    // ── Legacy path (old message format) ─────────────────────────────────────
    if (!message && !imageBase64 && legacyMessages) {
      const userMessages = legacyMessages.filter(m => m.role !== 'system');
      if (!userMessages.length) {
        return res.status(400).json({ error: 'No valid messages provided' });
      }
      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: legacySystem || 'You are Starky ★, a warm and encouraging AI tutor for NewWorldEdu.',
        messages: userMessages,
      });
      const content = response.content?.[0]?.text;
      if (!content) return res.status(500).json({ error: 'Unexpected response from Starky.' });
      return res.status(200).json({ content, response: content });
    }

    if (!message && !imageBase64) {
      return res.status(400).json({ error: 'No message or image provided' });
    }

    // ── Build messages using full prompt system ───────────────────────────────
    const built = buildMessages({
      userProfile,
      sessionMemory,
      userMessage: message || 'Please help me with this image.',
      imageBase64,
      imageMediaType,
    });

    // ── Handle escalation — fire alert then return safe response ─────────────
    if (built.escalation) {
      const esc = built.escalation;

      // Fire parent alert (non-blocking — don't await, never crash on failure)
      if (esc.parentAlert) {
        triggerParentAlert({
          alertType:    esc.type,
          alertLevel:   esc.alertLevel,
          alertMessage: esc.alertMessage,
          studentName:  userProfile.name || '',
          parentPhone:  userProfile.parentPhone || '',
          parentEmail:  userProfile.parentEmail || userProfile.email || '',
          timestamp:    esc.timestamp,
        }).catch(() => {}); // swallow — never block the student response
      }

      // Log escalation always
      console.error('[STARKY ESCALATION]', {
        type:      esc.type,
        level:     esc.alertLevel,
        student:   userProfile.name,
        signals:   esc.detectedSignals,
        timestamp: esc.timestamp,
      });

      return res.status(200).json({
        response: esc.response,
        content:  esc.response, // legacy compat
        escalation: {
          type:          esc.type,
          parentAlerted: esc.parentAlert,
          alertLevel:    esc.alertLevel,
        },
      });
    }

    // ── Normal Claude response ────────────────────────────────────────────────
    // Use more tokens for image responses (need room for deep analysis)
    const hasImage = built.messages.some(m => Array.isArray(m.content) && m.content.some(c => c.type === 'image'));
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: hasImage ? 2048 : 1024,
      system: built.systemPrompt,
      messages: built.messages,
    });

    const responseText = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    return res.status(200).json({
      response: responseText,
      content:  responseText, // legacy compat
      meta:     built.meta,
    });

  } catch (error) {
    console.error('[STARKY API ERROR]', error);

    if (error?.status === 401) {
      return res.status(500).json({ error: 'AI authentication failed. Please contact support.' });
    }
    if (error?.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached. Please wait a moment and try again.' });
    }

    return res.status(500).json({
      error:    'Something went wrong. Please try again.',
      response: "Sorry, I had a little glitch! Can you try sending that again? 🌟",
      content:  "Sorry, I had a little glitch! Can you try sending that again? 🌟",
    });
  }
}
