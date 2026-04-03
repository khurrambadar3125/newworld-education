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

import { getAnthropicClient } from '/../../utils/anthropicClient';
import { isAdmin } from '../../../utils/apiAuth';

const client = getAnthropicClient();

// Parse PDF text using pdf-parse (works on Vercel serverless)
async function extractPDFText(buffer) {
  const pdfParse = require('pdf-parse');
  const result = await pdfParse(buffer);
  return { text: result.text, numPages: result.numpages };
}

// Use Claude to parse questions from extracted text
// Auto-detect subject, level, paper number, and session from PDF header text
function detectMetadata(qpText) {
  const meta = { subject: 'Unknown', level: 'O Level', paper: 'Unknown', session: 'Unknown' };

  // Detect level: A Level or O Level (IGCSE)
  if (/A Level|AS Level|AS & A Level|9702|9701|9700|9709/i.test(qpText)) {
    meta.level = 'A Level';
  }

  // Detect subject code + paper variant e.g. "0625/12" or "9702/22"
  const codeMatch = qpText.match(/(\d{4})\/(\d{2})/);
  if (codeMatch) {
    meta.paper = codeMatch[2]; // e.g. "12", "22"
    const code = codeMatch[1];
    // Map common Cambridge subject codes
    const CODES = {
      '0580':'Mathematics','0606':'Additional Mathematics','0625':'Physics','0620':'Chemistry',
      '0610':'Biology','0450':'Business Studies','0455':'Economics','0478':'Computer Science',
      '0452':'Accounting','0417':'ICT','0460':'Geography','0470':'History','0453':'Commerce',
      '0500':'English Language','0475':'Literature in English','0448':'Pakistan Studies',
      '0493':'Islamiyat','0495':'Sociology','0486':'Literature in English','0587':'Urdu',
      '2058':'Islamiyat','2059':'Pakistan Studies','7110':'Statistics',
      '9702':'Physics','9701':'Chemistry','9700':'Biology','9709':'Mathematics',
      '9706':'Accounting','9708':'Economics','9618':'Computer Science','9990':'Psychology',
      '9093':'English Language','9084':'Law','9696':'Geography','9489':'History',
    };
    if (CODES[code]) meta.subject = CODES[code];
  }

  // Detect subject from text if code didn't match
  if (meta.subject === 'Unknown') {
    const subjectPatterns = [
      [/Physics/i, 'Physics'], [/Chemistry/i, 'Chemistry'], [/Biology/i, 'Biology'],
      [/Mathematics|Maths/i, 'Mathematics'], [/Additional Math/i, 'Additional Mathematics'],
      [/Business Studies/i, 'Business Studies'], [/Economics/i, 'Economics'],
      [/Computer Science/i, 'Computer Science'], [/Accounting/i, 'Accounting'],
      [/Geography/i, 'Geography'], [/History/i, 'History'], [/English Language/i, 'English Language'],
      [/Pakistan Studies/i, 'Pakistan Studies'], [/Islamiyat/i, 'Islamiyat'],
      [/Psychology/i, 'Psychology'], [/Sociology/i, 'Sociology'], [/Law/i, 'Law'],
    ];
    for (const [regex, name] of subjectPatterns) {
      if (regex.test(qpText.slice(0, 2000))) { meta.subject = name; break; }
    }
  }

  // Detect session: "October/November 2024" → "w24", "May/June 2024" → "s24", "February/March" → "m24"
  const sessionMatch = qpText.match(/(October\/November|May\/June|February\/March)\s+(20\d{2})/i);
  if (sessionMatch) {
    const yr = sessionMatch[2].slice(2);
    if (/october/i.test(sessionMatch[1])) meta.session = `w${yr}`;
    else if (/may/i.test(sessionMatch[1])) meta.session = `s${yr}`;
    else if (/february/i.test(sessionMatch[1])) meta.session = `m${yr}`;
  }

  return meta;
}

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
      sizeLimit: '50mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!isAdmin(req)) return res.status(401).json({ error: 'Admin auth required' });

  const { files } = req.body || {};

  if (!files || !Array.isArray(files) || files.length < 1) {
    return res.status(400).json({ error: 'Upload at least 1 PDF file' });
  }

  try {
    // Cambridge file naming: {code}_{session}_{type}_{variant}.pdf
    // Types: qp = question paper, ms = mark scheme, in = insert (question paper for some subjects),
    //        er = examiner report, gt = grade thresholds, ci = confidential instructions
    // We only care about: qp/in (questions) and ms (answers). Skip er, gt, ci, sp, sm, sf, etc.

    // Classify files by type from filename
    const classified = files.map(f => {
      const nameLower = f.name.toLowerCase();
      let type = 'unknown';
      if (/_qp[_.]/.test(nameLower) || /_qp\d/.test(nameLower)) type = 'qp';
      else if (/_in[_.]/.test(nameLower) || /_in\d/.test(nameLower)) type = 'qp'; // insert = question paper
      else if (/_ms[_.]/.test(nameLower) || /_ms\d/.test(nameLower)) type = 'ms';
      else if (/_er[_.]/.test(nameLower) || /_gt[_.]/.test(nameLower) || /_ci[_.]/.test(nameLower) ||
               /_sp[_.]/.test(nameLower) || /_sm[_.]/.test(nameLower) || /_sf[_.]/.test(nameLower)) type = 'skip';
      return { ...f, fileType: type };
    });

    const qpFiles = classified.filter(f => f.fileType === 'qp');
    const msFiles = classified.filter(f => f.fileType === 'ms');
    const unknownFiles = classified.filter(f => f.fileType === 'unknown');
    const skippedFiles = classified.filter(f => f.fileType === 'skip');

    // If we couldn't classify from names, check content
    if (qpFiles.length === 0 || msFiles.length === 0) {
      for (const f of unknownFiles) {
        const buffer = Buffer.from(f.base64, 'base64');
        const extracted = await extractPDFText(buffer);
        if (/mark scheme/i.test(extracted.text.slice(0, 1000))) {
          msFiles.push({ ...f, fileType: 'ms' });
        } else {
          qpFiles.push({ ...f, fileType: 'qp' });
        }
      }
    }

    if (qpFiles.length === 0 || msFiles.length === 0) {
      return res.status(400).json({
        error: `Could not find both question paper and mark scheme. Got ${qpFiles.length} QP(s), ${msFiles.length} MS(s). Skipped: ${skippedFiles.map(f => f.name).join(', ') || 'none'}. Make sure you include both the question paper (_qp_ or _in_) and mark scheme (_ms_) files.`,
      });
    }

    // Extract text from the QP and MS files
    const qpBuffer = Buffer.from(qpFiles[0].base64, 'base64');
    const msBuffer = Buffer.from(msFiles[0].base64, 'base64');
    const [qpResult, msResult] = await Promise.all([
      extractPDFText(qpBuffer),
      extractPDFText(msBuffer),
    ]);
    qpResult.name = qpFiles[0].name;
    msResult.name = msFiles[0].name;

    // Auto-detect metadata from the QP text
    const meta = detectMetadata(qpResult.text);
    // Also try to get metadata from filename (e.g. 2059_s21_qp_12.pdf)
    const fnMatch = qpFiles[0].name.match(/(\d{4})_([smw]\d{2})_(?:qp|in)_?(\d{0,2})/i);
    if (fnMatch) {
      if (meta.session === 'Unknown') meta.session = fnMatch[2];
      if (meta.paper === 'Unknown' && fnMatch[3]) meta.paper = fnMatch[3];
    }

    // Parse questions and map answers
    const questions = await parseQuestions(qpResult.text, msResult.text, meta.subject, meta.level);

    // Clean up and validate
    const cleaned = questions.map(q => ({
      ...q,
      marks: q.type === 'mcq' ? 1 : (q.marks || 1),
      subject: meta.subject,
      level: meta.level,
      paper: meta.paper,
      session: meta.session,
    }));

    return res.status(200).json({
      questions: cleaned,
      meta: {
        ...meta,
        qpFile: qpResult.name,
        msFile: msResult.name,
        qpPages: qpResult.numPages,
        msPages: msResult.numPages,
        totalQuestions: cleaned.length,
        verified: cleaned.filter(q => q.verified).length,
        unverified: cleaned.filter(q => !q.verified).length,
        skipped: skippedFiles.map(f => f.name),
      },
    });

  } catch (err) {
    console.error('[Extract API Error]', err);
    return res.status(500).json({ error: 'Failed to extract questions: ' + err.message });
  }
}
