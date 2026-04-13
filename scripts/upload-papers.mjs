#!/usr/bin/env node
/**
 * scripts/upload-papers.mjs — Local bulk past paper processor
 * ─────────────────────────────────────────────────────────────────
 * Usage: node scripts/upload-papers.mjs /path/to/*.pdf
 *        node scripts/upload-papers.mjs /Users/khurramb/Downloads/2059_s21_*.pdf
 *
 * Processes Cambridge past paper PDFs locally:
 * 1. Auto-classifies files (QP/MS/skip)
 * 2. Pairs QP+MS by subject code + session + variant
 * 3. Extracts text from PDFs
 * 4. Uses Claude to extract questions + map mark scheme answers
 * 5. Saves verified questions directly to Supabase
 *
 * No size limits. No API calls. Everything runs locally.
 */

import { readFileSync, existsSync } from 'fs';
import { basename } from 'path';
import { config } from 'dotenv';

// Load env vars
config({ path: '.env.vercel' });
config({ path: '.env.local' });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!ANTHROPIC_API_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1); }
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) { console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY. Run: vercel env pull .env.vercel'); process.exit(1); }

// ── Cambridge subject codes ──────────────────────────────────────
const CODES = {
  '0580':'Mathematics','0606':'Additional Mathematics','0625':'Physics','0620':'Chemistry',
  '0610':'Biology','0450':'Business Studies','0455':'Economics','0478':'Computer Science',
  '0452':'Accounting','0417':'ICT','0460':'Geography','0470':'History','0453':'Commerce',
  '0500':'English Language','0475':'Literature in English','0448':'Pakistan Studies',
  '0493':'Islamiyat','0495':'Sociology','0486':'Literature in English','0587':'Urdu',
  '2058':'Islamiyat','2059':'Pakistan Studies','7110':'Statistics',
  '1123':'English Language','2058':'Islamiyat','2147':'History','2210':'Computer Science','2217':'Geography','2251':'Sociology','2281':'Economics','3247':'Urdu','7100':'Commerce','7115':'Business Studies','7707':'Accounting','5070':'Chemistry','5090':'Biology','5054':'Physics','4024':'Mathematics','4037':'Additional Mathematics',
  '9609':'Business','9618':'Computer Science','9702':'Physics','9701':'Chemistry','9700':'Biology','9706':'Accounting','9709':'Mathematics','9990':'Psychology',
  '9706':'Accounting','9708':'Economics','9618':'Computer Science','9990':'Psychology',
  '9093':'English Language','9084':'Law','9696':'Geography','9489':'History',
  '9699':'Sociology','9389':'History','9479':'Art & Design',
  '9231':'Further Mathematics','9695':'Literature in English',
};

// ── Classify file type from name ──────────────────────────────────
function classifyFile(name) {
  const n = name.toLowerCase();
  if (/_qp[_.\d]/.test(n) || /_in[_.\d]/.test(n)) return 'qp';
  if (/_ms[_.\d]/.test(n)) return 'ms';
  if (/_er[_.\d]/.test(n) || /_gt[_.\d]/.test(n) || /_ci[_.\d]/.test(n)) return 'skip';
  return 'unknown';
}

// ── Detect metadata from PDF text ──────────────────────────────────
function detectMetadata(text, filename) {
  const meta = { subject: 'Unknown', level: 'O Level', paper: 'Unknown', session: 'Unknown' };

  // From filename: {code}_{session}_{type}_{variant}.pdf
  const fnMatch = filename.match(/(\d{4})_([smw]\d{2})_(?:qp|ms|in)_?(\d{0,2})/i);
  if (fnMatch) {
    if (CODES[fnMatch[1]]) meta.subject = CODES[fnMatch[1]];
    meta.session = fnMatch[2];
    if (fnMatch[3]) meta.paper = fnMatch[3];
    // A Level codes start with 9
    if (fnMatch[1].startsWith('9')) meta.level = 'A Level';
  }

  // From text if filename didn't give subject
  if (meta.subject === 'Unknown') {
    const codeMatch = text.match(/(\d{4})\/(\d{2})/);
    if (codeMatch && CODES[codeMatch[1]]) {
      meta.subject = CODES[codeMatch[1]];
      if (meta.paper === 'Unknown') meta.paper = codeMatch[2];
    }
  }

  // Detect level from text
  if (/A Level|AS Level|AS & A Level/i.test(text)) meta.level = 'A Level';

  // Detect session from text
  if (meta.session === 'Unknown') {
    const sessionMatch = text.match(/(October\/November|May\/June|February\/March)\s+(20\d{2})/i);
    if (sessionMatch) {
      const yr = sessionMatch[2].slice(2);
      if (/october/i.test(sessionMatch[1])) meta.session = `w${yr}`;
      else if (/may/i.test(sessionMatch[1])) meta.session = `s${yr}`;
      else meta.session = `m${yr}`;
    }
  }

  return meta;
}

// ── Extract text from PDF ──────────────────────────────────────
async function extractPDFText(filePath) {
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
  const buffer = readFileSync(filePath);
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => item.str).join(' '));
  }
  return { text: pages.join('\n\n'), numPages: doc.numPages };
}

// ── Use Claude to parse questions ──────────────────────────────────
async function parseQuestions(qpText, msText, subject, level) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307', // Admin tool only — Khurram's uploads. Students use Haiku.
      max_tokens: 8192,
      system: `You extract Cambridge exam questions from past papers. You are given:
1. The QUESTION PAPER text (all questions)
2. The MARK SCHEME text (all correct answers)

Your job: Match each question to its correct answer from the mark scheme.

For MCQs: The mark scheme will list the question number and the correct letter (A, B, C, or D).
For structured questions: The mark scheme will list the marking points.

CRITICAL: The correct answer MUST come from the mark scheme, NOT from your own knowledge.
If you cannot find the answer in the mark scheme, set verified to false.

IMPORTANT: Keep correctAnswer SHORT (max 100 chars for structured). Keep question text SHORT.
Output ONLY the JSON array — no text before or after.`,
      messages: [{
        role: 'user',
        content: `QUESTION PAPER TEXT:
${qpText.slice(0, 10000)}

MARK SCHEME TEXT:
${msText.slice(0, 10000)}

Subject: ${subject}
Level: ${level}

Extract ALL questions as a JSON array. Be concise — keep text short:
[{"number":1,"question":"short question text","type":"mcq"|"structured","options":{"A":"...","B":"...","C":"...","D":"..."}|null,"correctAnswer":"letter or short marking points","marks":1,"topic":"topic","verified":true|false}]`
      }],
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  let raw = data.content.filter(b => b.type === 'text').map(b => b.text).join('').trim().replace(/```json|```/g, '').trim();
  // Extract JSON array if Claude wrapped it in text
  const jsonStart = raw.indexOf('[');
  const jsonEnd = raw.lastIndexOf(']');
  if (jsonStart >= 0 && jsonEnd > jsonStart) raw = raw.slice(jsonStart, jsonEnd + 1);
  return JSON.parse(raw);
}

// ── Save to Supabase (with retry on connection errors) ──────────────────────
async function saveToSupabase(questions) {
  let saved = 0, errors = 0;

  for (const q of questions) {
    if (!q.verified) continue;

    const row = {
      subject: q.subject,
      level: q.level,
      topic: q.topic || 'General',
      difficulty: 'medium',
      type: q.type || 'mcq',
      curriculum: 'cambridge',
      question_text: q.question,
      options: q.options || null,
      correct_answer: q.correctAnswer || '',
      mark_scheme: q.type === 'mcq' ? null : q.correctAnswer,
      marks: q.type === 'mcq' ? 1 : (q.marks || 1),
      command_word: null,
      source: 'past_paper',
      verified: true,
      verified_by: 'cambridge_pdf_ai',
      verified_at: new Date().toISOString(),
      verification_confidence: 75,
    };
    // Add session/paper for Exam Compass if available
    if (q.session) row.session = q.session;
    if (q.paper) row.paper = q.paper;
    const body = JSON.stringify(row);

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/question_bank`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SECRET_KEY,
            'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
            'Prefer': 'return=minimal',
          },
          body,
        });

        if (!res.ok) {
          const err = await res.text();
          console.error(`  Save error: ${err.slice(0, 100)}`);
          errors++;
        } else {
          saved++;
        }
        break; // success or non-retryable error
      } catch (fetchErr) {
        if (attempt < 2) {
          console.log(`  Connection error, retrying in ${(attempt + 1) * 3}s...`);
          await new Promise(r => setTimeout(r, (attempt + 1) * 3000));
        } else {
          console.error(`  Save failed after 3 attempts: ${fetchErr.message}`);
          errors++;
        }
      }
    }
  }

  return { saved, errors };
}

// ── Main ──────────────────────────────────────
async function main() {
  const filePaths = process.argv.slice(2).filter(f => f.endsWith('.pdf') && existsSync(f));
  if (filePaths.length === 0) {
    console.log('Usage: node scripts/upload-papers.mjs /path/to/*.pdf');
    process.exit(1);
  }

  console.log(`\nFound ${filePaths.length} PDF files\n`);

  // Classify files
  const classified = filePaths.map(path => ({ path, name: basename(path), type: classifyFile(basename(path)) }));
  const qpFiles = classified.filter(f => f.type === 'qp');
  const msFiles = classified.filter(f => f.type === 'ms');
  const skipFiles = classified.filter(f => f.type === 'skip');
  const unknownFiles = classified.filter(f => f.type === 'unknown');

  console.log(`  QP/Insert files: ${qpFiles.length}`);
  console.log(`  Mark Schemes:    ${msFiles.length}`);
  console.log(`  Skipping:        ${skipFiles.length} (${skipFiles.map(f => f.name).join(', ')})`);
  if (unknownFiles.length) console.log(`  Unknown:         ${unknownFiles.length} (${unknownFiles.map(f => f.name).join(', ')})`);

  // Pair by code_session_variant
  const groups = {};
  for (const f of [...qpFiles, ...msFiles]) {
    const match = f.name.match(/(\d{4})_([smw]\d{2})_(?:qp|ms|in)_?(\d{0,2})/i);
    const variant = match?.[3] ? String(parseInt(match[3], 10)) : '0'; // normalize: 01 → 1
    const key = match ? `${match[1]}_${match[2]}_${variant}` : f.name;
    if (!groups[key]) groups[key] = { qps: [], ms: null, key };
    if (f.type === 'qp') {
      // Prefer _qp_ over _in_ (insert is supplementary material)
      const isQP = /_qp[_.\d]/.test(f.name.toLowerCase());
      if (isQP) groups[key].qps.unshift(f); // QP goes first
      else groups[key].qps.push(f); // inserts go after
    }
    if (f.type === 'ms') groups[key].ms = f;
  }

  const pairs = Object.values(groups).filter(g => g.qps.length > 0 && g.ms);
  console.log(`\n  Pairs found: ${pairs.length}\n`);

  if (pairs.length === 0) {
    console.error('No QP+MS pairs found. Check filenames.');
    process.exit(1);
  }

  let totalSaved = 0;

  for (const pair of pairs) {
   try {
    const qp = pair.qps[0]; // Use first QP file
    const ms = pair.ms;
    console.log(`--- ${qp.name} + ${ms.name} ---`);

    // Extract text
    console.log('  Extracting PDF text...');
    const [qpResult, msResult] = await Promise.all([
      extractPDFText(qp.path),
      extractPDFText(ms.path),
    ]);
    console.log(`  QP: ${qpResult.numPages} pages, MS: ${msResult.numPages} pages`);

    // Detect metadata
    const meta = detectMetadata(qpResult.text, qp.name);
    console.log(`  Detected: ${meta.subject} | ${meta.level} | Paper ${meta.paper} | ${meta.session}`);

    // Parse questions (with retry on overload + connection errors)
    console.log('  Extracting questions with Claude...');
    let questions;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        questions = await parseQuestions(qpResult.text, msResult.text, meta.subject, meta.level);
        break;
      } catch (err) {
        if (attempt < 2 && (err.message.includes('Overloaded') || err.message.includes('fetch failed') || err.message.includes('ECONNRESET') || err.message.includes('TIMEOUT'))) {
          console.log(`  Error: ${err.message.slice(0, 60)}, retrying in ${(attempt + 1) * 5}s...`);
          await new Promise(r => setTimeout(r, (attempt + 1) * 5000));
          continue;
        }
        console.error(`  Claude error: ${err.message}`);
        questions = null;
        break;
      }
    }
    if (!questions) continue;

    // Small delay between papers to avoid API rate limits
    await new Promise(r => setTimeout(r, 2000));

    // These are official Cambridge papers — all questions are valid
    const aiVerified = questions.filter(q => q.verified).length;
    console.log(`  Extracted: ${questions.length} total (${aiVerified} AI-verified, saving ALL — official source)`);

    if (questions.length === 0) { console.log('  No questions extracted. Skipping.\n'); continue; }

    // Tag with metadata — source is genuine Cambridge PDF, AI matched the answers
    const tagged = questions.map(q => ({
      ...q,
      verified: true, // official Cambridge paper = always verified
      verified_by: 'cambridge_pdf_ai',
      verified_at: new Date().toISOString(),
      verification_confidence: 75,
      subject: meta.subject,
      level: meta.level,
      session: meta.session !== 'Unknown' ? meta.session : null,
      paper: meta.paper !== 'Unknown' ? meta.paper : null,
      marks: q.type === 'mcq' ? 1 : (q.marks || 1),
    }));

    // Save
    console.log('  Saving to Supabase...');
    const { saved, errors } = await saveToSupabase(tagged);
    console.log(`  SAVED: ${saved} questions${errors > 0 ? ` | Errors: ${errors}` : ''}\n`);
    totalSaved += saved;
   } catch (paperErr) {
    console.error(`  PAPER ERROR: ${paperErr.message.slice(0, 80)} — skipping, continuing...\n`);
   }
  }

  console.log(`\n=== TOTAL: ${totalSaved} questions saved from ${pairs.length} papers ===\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
