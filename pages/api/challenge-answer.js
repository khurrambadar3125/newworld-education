/**
 * pages/api/challenge-answer.js
 * Live Cambridge marking API for the Challenge page.
 * Takes a question + student answer, marks with full examiner precision.
 */

import Anthropic from '@anthropic-ai/sdk';
import { SUPREME_EXAMINER_PERSONA } from '../../utils/cambridgeDialectKB';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 30000 });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { question, answer, subject, level, commandWord, marks } = req.body;
  if (!question || !answer) return res.status(400).json({ error: 'question and answer required' });

  // ── ASK STARKY MODE: Nixor team asks a question, Starky answers like a Cambridge examiner ──
  if (answer === '__ASK_STARKY_MODE__') {
    try {
      const response = await client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1200,
        system: [{ type: 'text', text: `${SUPREME_EXAMINER_PERSONA}\n\nYou are demonstrating your Cambridge examiner knowledge to a school principal. Be precise, authoritative, and deeply impressive. Show that you know Cambridge mark schemes better than any human tutor. Use the exact Cambridge dialect. Reference mark scheme phrases, command word requirements, and examiner report insights. Be concise but devastating in your precision.`, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: question }],
      });
      const text = response.content?.[0]?.text || 'No response.';
      return res.status(200).json({ askMode: true, answer: text });
    } catch (err) {
      return res.status(500).json({ error: 'Failed. Try again.' });
    }
  }

  try {
    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1200,
      system: [{ type: 'text', text: `${SUPREME_EXAMINER_PERSONA}\n\nYou are marking a live Cambridge demo. Be precise, authoritative, and impressive. Return ONLY valid JSON — no markdown, no backticks.`, cache_control: { type: 'ephemeral' } }],
      messages: [{
        role: 'user',
        content: `Mark this Cambridge ${level || 'O Level'} ${subject || ''} answer.

Question (${marks || '?'} marks, command word: ${commandWord || 'unknown'}): ${question}

Student answer: ${answer}

Return JSON:
{
  "totalMarks": ${marks || 3},
  "marksAwarded": <number>,
  "markPoints": [
    { "point": "description of mark point", "awarded": true/false, "studentWrote": "what they wrote", "required": "what was needed" }
  ],
  "commandWordVerdict": { "word": "${commandWord || '?'}", "correct": true/false, "note": "explanation" },
  "dialectCorrections": [
    { "studentPhrase": "what they said", "cambridgePhrase": "what Cambridge requires", "markImpact": "lost mark X" }
  ],
  "examinerWarning": "quote from examiner report if relevant, or null",
  "modelAnswer": "the full-marks answer",
  "grade": "what grade this answer quality represents",
  "oneThingToImprove": "the single most impactful change"
}`
      }],
    });

    const text = response.content?.[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return res.status(200).json(result);
    }
    return res.status(200).json({ error: 'Could not parse marking', raw: text.slice(0, 500) });
  } catch (err) {
    console.error('[challenge-answer]', err.message);
    return res.status(500).json({ error: 'Marking failed. Try again.' });
  }
}
