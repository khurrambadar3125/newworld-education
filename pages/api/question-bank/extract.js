/**
 * pages/api/question-bank/extract.js
 * ─────────────────────────────────────────────────────────────────
 * Extracts questions from Cambridge past paper PDFs and maps
 * correct answers from the corresponding mark scheme PDF.
 *
 * POST: multipart form with 'qp' (question paper) and 'ms' (mark scheme) files
 * Returns: { questions: [...], subject, paper, session }
 *
 * Admin-only. Questions returned for review before saving.
 */

import Anthropic from '@anthropic-ai/sdk';
import { isAdmin } from '../../../utils/apiAuth';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 60000 });

// Parse PDF text using pdfjs-dist
async function extractPDFText(buffer) {
  const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
  const data = new Uint8Array(buffer);
  const doc = await pdfjsLib.getDocument({ data }).promise;
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map(item => item.str).join(' ');
    pages.push(text);
  }
  return { text: pages.join('\n\n--- PAGE BREAK ---\n\n'), numPages: doc.numPages };
}

// Use Claude to parse questions from extracted text
async function parseQuestions(qpText, msText, subject, level) {
  const response = await client.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 4000,
    system: `You extract Cambridge exam questions from past papers. You are given:
1. The QUESTION PAPER text (all questions)
2. The MARK SCHEME text (all correct answers)

Your job: Match each question to its correct answer from the mark scheme.

For MCQs: The mark scheme will list the question number and the correct letter (A, B, C, or D).
For structured questions: The mark scheme will list the marking points.

CRITICAL: The correct answer MUST come from the mark scheme, NOT from your own knowledge.
If you cannot find the answer in the mark scheme, set verified to false.

Return ONLY a valid JSON array.`,
    messages: [{
      role: 'user',
      content: `QUESTION PAPER TEXT:
${qpText.slice(0, 12000)}

MARK SCHEME TEXT:
${msText.slice(0, 8000)}

Subject: ${subject || 'Unknown'}
Level: ${level || 'O Level'}

Extract ALL questions. For each question return:
[{
  "number": 1,
  "question": "full question text",
  "type": "mcq" or "structured",
  "options": {"A": "...", "B": "...", "C": "...", "D": "..."} or null,
  "correctAnswer": "A/B/C/D" for MCQ or "marking points text" for structured,
  "marks": number of marks,
  "topic": "best guess topic name",
  "verified": true if answer found in mark scheme, false if unsure
}]`
    }],
  });

  const raw = response.content.filter(b => b.type === 'text').map(b => b.text).join('').trim().replace(/```json|```/g, '').trim();
  return JSON.parse(raw);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!isAdmin(req)) return res.status(401).json({ error: 'Admin auth required' });

  const { qpBase64, msBase64, subject, level, paper, session } = req.body || {};

  if (!qpBase64 || !msBase64) {
    return res.status(400).json({ error: 'Both question paper (qpBase64) and mark scheme (msBase64) are required' });
  }

  try {
    // Extract text from both PDFs
    const qpBuffer = Buffer.from(qpBase64, 'base64');
    const msBuffer = Buffer.from(msBase64, 'base64');

    const [qpResult, msResult] = await Promise.all([
      extractPDFText(qpBuffer),
      extractPDFText(msBuffer),
    ]);

    // Parse questions and map answers
    const questions = await parseQuestions(qpResult.text, msResult.text, subject, level);

    // Clean up and validate
    const cleaned = questions.map(q => ({
      ...q,
      marks: q.type === 'mcq' ? 1 : (q.marks || 1),
      subject: subject || 'Unknown',
      level: level || 'O Level',
      paper: paper || 'Unknown',
      session: session || 'Unknown',
    }));

    return res.status(200).json({
      questions: cleaned,
      meta: {
        subject,
        level,
        paper,
        session,
        qpPages: qpResult.numPages,
        msPages: msResult.numPages,
        totalQuestions: cleaned.length,
        verified: cleaned.filter(q => q.verified).length,
        unverified: cleaned.filter(q => !q.verified).length,
      },
    });

  } catch (err) {
    console.error('[Extract API Error]', err);
    return res.status(500).json({ error: 'Failed to extract questions: ' + err.message });
  }
}
