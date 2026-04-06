#!/usr/bin/env node
/**
 * scripts/extract-caie-topicals.mjs — Cambridge Topical Past Paper Extractor
 * ─────────────────────────────────────────────────────────────────
 * Extracts verified Cambridge O Level questions from topical past paper PDFs.
 * Uses Haiku for cost efficiency. Saves to question_bank.
 *
 * Usage:
 *   node scripts/extract-caie-topicals.mjs ~/Downloads/cambridge-pakistan-notes/caie-notes/Chemistry-5070-P1-Topical.pdf
 *   node scripts/extract-caie-topicals.mjs --all  (processes all CAIE topicals)
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { basename, join } from 'path';
import { config } from 'dotenv';

config({ path: '.env.vercel' });
config({ path: '.env.local' });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const MODEL = 'claude-3-haiku-20240307'; // Haiku for cost

if (!ANTHROPIC_API_KEY || !SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Missing env vars'); process.exit(1);
}

// ── Detect subject from filename ──────────────────────────────
function detectMeta(filename) {
  const f = filename.toLowerCase();
  const meta = { subject: 'Unknown', code: '', level: 'O Level', paper: '', curriculum: 'cambridge' };

  if (f.includes('chemistry') || f.includes('5070')) { meta.subject = 'Chemistry'; meta.code = '5070'; }
  if (f.includes('physics') || f.includes('5054')) { meta.subject = 'Physics'; meta.code = '5054'; }
  if (f.includes('biology') || f.includes('5090')) { meta.subject = 'Biology'; meta.code = '5090'; }
  if (f.includes('math') || f.includes('4024')) { meta.subject = 'Mathematics'; meta.code = '4024'; }
  if (f.includes('economics') || f.includes('2281')) { meta.subject = 'Economics'; meta.code = '2281'; }
  if (f.includes('accounting') || f.includes('7707')) { meta.subject = 'Accounting'; meta.code = '7707'; }
  if (f.includes('business') || f.includes('7115')) { meta.subject = 'Business Studies'; meta.code = '7115'; }
  if (f.includes('computer') || f.includes('2210')) { meta.subject = 'Computer Science'; meta.code = '2210'; }
  if (f.includes('islamiyat') || f.includes('2058')) { meta.subject = 'Islamiyat'; meta.code = '2058'; }

  if (f.includes('p1')) meta.paper = 'Paper 1';
  if (f.includes('p2')) meta.paper = 'Paper 2';
  if (f.includes('p4') || f.includes('atp')) meta.paper = 'Paper 4 (ATP)';

  return meta;
}

// ── Extract text from PDF ──────────────────────────────────────
async function extractPDFText(filePath, maxPages = 50) {
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
  const buffer = readFileSync(filePath);
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
  const pages = [];
  const numToProcess = Math.min(doc.numPages, maxPages);
  for (let i = 1; i <= numToProcess; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => item.str).join(' '));
  }
  return { text: pages.join('\n\n'), numPages: doc.numPages, processed: numToProcess };
}

// ── Chunk text ──────────────────────────────────────
function chunkText(text, maxChars = 6000) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = start + maxChars;
    if (end < text.length) {
      const lastBreak = text.lastIndexOf('\n\n', end);
      if (lastBreak > start + maxChars * 0.5) end = lastBreak;
    }
    chunks.push(text.slice(start, end));
    start = end;
  }
  return chunks;
}

// ── Extract questions from chunk ──────────────────────────────
async function extractFromChunk(chunk, meta) {
  const prompt = `You extract Cambridge O Level ${meta.subject} (${meta.code}) exam questions from a topical past paper PDF.

This is from ${meta.paper || 'a past paper'} organized by topic. Extract ALL questions you can find.

For MCQs: Extract question, all options (A-D), and correct answer.
For structured questions: Extract question text, marks, and the mark scheme answer if visible.

RULES:
- Keep question text concise but complete (include data/values given)
- Identify the TOPIC for each question (e.g., "Atomic Structure", "Electrochemistry", "Forces")
- Set verified=true only if you can see the correct answer/mark scheme
- Include the exam session if visible (e.g., "M/J 2019 P2 Q3")
- Output ONLY a JSON array

TEXT:
${chunk}

Extract as JSON array:
[{"question":"text","type":"mcq"|"structured","options":{"A":"...","B":"...","C":"...","D":"..."}|null,"correctAnswer":"answer","topic":"specific topic","marks":1,"session":"M/J 2019"|null,"verified":true|false}]

If NO questions found, return: []`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) { const err = await res.text(); throw new Error(`API ${res.status}: ${err.slice(0, 100)}`); }
  const data = await res.json();
  let raw = data.content?.filter(b => b.type === 'text').map(b => b.text).join('').trim().replace(/```json|```/g, '').trim();
  const jsonStart = raw.indexOf('[');
  const jsonEnd = raw.lastIndexOf(']');
  if (jsonStart >= 0 && jsonEnd > jsonStart) raw = raw.slice(jsonStart, jsonEnd + 1);
  try { return JSON.parse(raw); } catch { return []; }
}

// ── Save to Supabase ──────────────────────────────
async function saveToSupabase(questions, meta) {
  let saved = 0, errors = 0;
  for (const q of questions) {
    const body = JSON.stringify({
      subject: meta.subject,
      level: meta.level,
      topic: q.topic || 'General',
      difficulty: 'medium',
      type: q.type === 'mcq' ? 'mcq' : 'structured',
      curriculum: 'cambridge',
      question_text: q.question,
      options: q.options || null,
      correct_answer: q.correctAnswer || '',
      mark_scheme: q.type !== 'mcq' ? (q.correctAnswer || '') : null,
      marks: q.marks || 1,
      source: 'past_paper',
      source_paper: q.session || meta.paper || null,
      verified: q.verified !== false,
    });

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
        if (res.ok) { saved++; break; }
        else { if (attempt === 2) errors++; await new Promise(r => setTimeout(r, 2000)); }
      } catch { if (attempt === 2) errors++; await new Promise(r => setTimeout(r, 2000)); }
    }
  }
  return { saved, errors };
}

// ── Main ──────────────────────────────────────
const args = process.argv.slice(2);
let filePaths = [];

if (args.includes('--all')) {
  const dir = join(process.env.HOME, 'Downloads/cambridge-pakistan-notes/caie-notes');
  filePaths = readdirSync(dir).filter(f => f.endsWith('.pdf')).map(f => join(dir, f));
} else {
  filePaths = args.filter(f => f.endsWith('.pdf') && existsSync(f));
}

if (filePaths.length === 0) {
  console.log('Usage: node scripts/extract-caie-topicals.mjs --all');
  console.log('   or: node scripts/extract-caie-topicals.mjs /path/to/file.pdf');
  process.exit(0);
}

// Sort by file size — smallest first (faster wins)
filePaths.sort((a, b) => {
  try { return readFileSync(a).length - readFileSync(b).length; } catch { return 0; }
});

console.log('');
console.log('═══════════════════════════════════════════');
console.log('  CAIE TOPICAL PAST PAPER EXTRACTOR');
console.log(`  Model: Haiku 3 | Files: ${filePaths.length}`);
console.log('═══════════════════════════════════════════');
console.log('');

let grandTotal = 0, grandErrors = 0;

for (const fp of filePaths) {
  const name = basename(fp);
  const meta = detectMeta(name);
  console.log(`📄 ${name}`);
  console.log(`   Subject: ${meta.subject} (${meta.code}) | ${meta.paper}`);

  try {
    // Extract text (limit to 50 pages to avoid huge files)
    const { text, numPages, processed } = await extractPDFText(fp, 50);
    console.log(`   Pages: ${processed}/${numPages} | Text: ${(text.length / 1024).toFixed(0)} KB`);

    if (text.length < 100) { console.log('   ⚠ No extractable text — skipping (might be image-based)'); continue; }

    // Chunk and extract
    const chunks = chunkText(text);
    console.log(`   Chunks: ${chunks.length}`);

    let fileQuestions = [];
    for (let i = 0; i < chunks.length; i++) {
      process.stdout.write(`   Chunk ${i + 1}/${chunks.length}...`);
      try {
        const qs = await extractFromChunk(chunks[i], meta);
        fileQuestions.push(...qs);
        console.log(` ${qs.length} questions`);
        await new Promise(r => setTimeout(r, 800)); // Rate limit
      } catch (err) {
        console.log(` ❌ ${err.message.slice(0, 50)}`);
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    // Deduplicate by question text
    const seen = new Set();
    fileQuestions = fileQuestions.filter(q => {
      const key = (q.question || '').slice(0, 100).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return q.question && q.question.length > 10;
    });

    console.log(`   Extracted: ${fileQuestions.length} unique questions`);

    // Save to Supabase
    if (fileQuestions.length > 0) {
      const { saved, errors } = await saveToSupabase(fileQuestions, meta);
      console.log(`   Saved: ${saved} | Errors: ${errors}`);
      grandTotal += saved;
      grandErrors += errors;
    }

  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
  }
  console.log('');
}

console.log('═══════════════════════════════════════════');
console.log(`  DONE: ${grandTotal} questions saved, ${grandErrors} errors`);
console.log('═══════════════════════════════════════════');
