/**
 * pages/api/summarize.js
 * Generates a brief session summary after a Starky conversation.
 *
 * Called by useSessionMemory.finalizeSession() when the chat closes.
 * Returns:
 *   { summary, weakTopics, currentSubject }
 */

import { getAnthropicClient } from '../../utils/anthropicClient';

const client = getAnthropicClient();

const ALLOWED_ORIGINS = [
  'https://newworld.education',
  'https://www.newworld.education',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
].filter(Boolean);

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { conversationHistory = [], userProfile = {} } = req.body;

    if (!conversationHistory.length) {
      return res.status(400).json({ error: 'No conversation to summarize' });
    }

    // Format the conversation for the prompt
    const convoText = conversationHistory
      .filter(m => m.role && m.content && typeof m.content === 'string')
      .slice(-20)
      .map(m => `${m.role === 'user' ? 'Student' : 'Starky'}: ${m.content}`)
      .join('\n');

    const grade = userProfile.grade || '';
    const name = userProfile.name?.split(' ')[0] || 'the student';

    const prompt = `You are analysing a tutoring session between Starky (AI tutor) and ${name}${grade ? ` (${grade})` : ''}.

Here is the conversation:
---
${convoText}
---

Respond with ONLY a valid JSON object — no markdown, no backticks, no extra text. Use this exact structure:
{
  "summary": "2-3 sentence plain English summary of what was covered and how the student did. Start with the subject/topic.",
  "weakTopics": ["topic1", "topic2"],
  "currentSubject": "the main subject studied e.g. Chemistry, Maths, Biology"
}

Rules:
- summary: max 60 words, factual, useful for context in the next session
- weakTopics: list only topics the student genuinely struggled with (max 4). Empty array if none.
- currentSubject: single subject name only, or empty string if mixed/unclear`;

    const response = await client.messages.create({
      model: /* PERMANENT: Haiku 3 only. Never change without Khurram's approval. */ 'claude-haiku-4-5-20251001', // use Haiku — fast and cheap for summaries
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')
      .trim();

    // Safe JSON parse
    let parsed = {};
    try {
      // Strip any accidental markdown fences
      const clean = raw.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      // If parsing fails, return a basic summary from the raw text
      return res.status(200).json({
        summary: raw.substring(0, 200),
        weakTopics: [],
        currentSubject: '',
      });
    }

    return res.status(200).json({
      summary: typeof parsed.summary === 'string' ? parsed.summary.substring(0, 300) : '',
      weakTopics: Array.isArray(parsed.weakTopics) ? parsed.weakTopics.slice(0, 4) : [],
      currentSubject: typeof parsed.currentSubject === 'string' ? parsed.currentSubject : '',
    });

  } catch (error) {
    console.error('[SUMMARIZE ERROR]', error);
    // Graceful fail — the session still works without a summary
    return res.status(200).json({ summary: '', weakTopics: [], currentSubject: '' });
  }
}
