#!/usr/bin/env node
/**
 * scripts/extract-sat-books.mjs — SAT Book Question Extractor
 * ─────────────────────────────────────────────────────────────────
 * Usage: node scripts/extract-sat-books.mjs /path/to/SAT-*.pdf
 *
 * Processes SAT prep books and practice tests:
 * 1. Reads full PDF text
 * 2. Splits into chunks (Claude can handle ~10K chars)
 * 3. Extracts all MCQ/grid-in questions with answers
 * 4. Saves to Supabase question_bank with source='sat_book'
 *
 * Handles: Real SAT practice tests, SAT II Subject Tests, prep workbooks
 */

import { readFileSync, existsSync } from 'fs';
import { basename } from 'path';
import { config } from 'dotenv';

config({ path: '.env.vercel' });
config({ path: '.env.local' });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!ANTHROPIC_API_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1); }
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) { console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY'); process.exit(1); }

// ── Detect SAT book type from filename ──────────────────────────
function detectBookMeta(filename) {
  const f = filename.toLowerCase();
  const meta = { subject: 'SAT', level: 'SAT', section: 'General', isAnswerKey: false };

  if (f.includes('answer')) meta.isAnswerKey = true;
  if (f.includes('real-sat')) { meta.section = 'Practice Test'; meta.subject = 'SAT'; }
  if (f.includes('math')) meta.section = 'Math';
  if (f.includes('reading') || f.includes('critical-reading')) meta.section = 'Reading & Writing';
  if (f.includes('writing')) meta.section = 'Reading & Writing';
  if (f.includes('biology') || f.includes('bio')) { meta.section = 'Biology'; meta.subject = 'SAT Subject'; }
  if (f.includes('physics')) { meta.section = 'Physics'; meta.subject = 'SAT Subject'; }
  if (f.includes('history')) { meta.section = 'History'; meta.subject = 'SAT Subject'; }
  if (f.includes('literature')) { meta.section = 'Literature'; meta.subject = 'SAT Subject'; }
  if (f.includes('subject-test')) meta.subject = 'SAT Subject';
  if (f.includes('sat-ii')) meta.subject = 'SAT Subject';

  // Extract test number from Real-SAT-N
  const testMatch = filename.match(/Real-SAT-(\d+)/i);
  if (testMatch) meta.testNumber = testMatch[1];

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

// ── Split text into chunks ──────────────────────────────────────
function chunkText(text, maxChars = 8000) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = start + maxChars;
    // Try to break at a paragraph boundary
    if (end < text.length) {
      const lastBreak = text.lastIndexOf('\n\n', end);
      if (lastBreak > start + maxChars * 0.5) end = lastBreak;
    }
    chunks.push(text.slice(start, end));
    start = end;
  }
  return chunks;
}

// ── Use Claude to extract questions from a chunk ──────────────────
async function extractFromChunk(chunk, meta, answerText) {
  const systemPrompt = `You extract SAT exam questions from prep books and practice tests.
You are given a chunk of text from a SAT book. Extract ALL questions you can find.

For MCQs: Extract the question, all options (A-E), and the correct answer.
For grid-in math: Extract the question and the correct numerical answer.

If answer keys are provided separately, match questions to their answers.
If no answers are available in this chunk, set verified to false.

IMPORTANT:
- Keep question text concise (max 200 chars)
- Include enough context for the question to stand alone
- Tag each question with its section (Math, Reading & Writing, or subject for SAT II)
- Output ONLY the JSON array — no text before or after.`;

  const userPrompt = `BOOK: ${meta.subject} — ${meta.section}${meta.testNumber ? ` (Test ${meta.testNumber})` : ''}

TEXT CHUNK:
${chunk}

${answerText ? `ANSWER KEY:\n${answerText.slice(0, 4000)}` : ''}

Extract ALL questions as a JSON array. Be concise:
[{"number":1,"question":"question text","type":"mcq"|"grid_in","options":{"A":"...","B":"...","C":"...","D":"...","E":"..."}|null,"correctAnswer":"letter or number","section":"Math"|"Reading & Writing"|"Biology"|"Physics"|"History"|"Literature","topic":"specific topic","verified":true|false}]

If there are NO questions in this chunk (just explanatory text), return: []`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  let raw = data.content.filter(b => b.type === 'text').map(b => b.text).join('').trim().replace(/```json|```/g, '').trim();
  const jsonStart = raw.indexOf('[');
  const jsonEnd = raw.lastIndexOf(']');
  if (jsonStart >= 0 && jsonEnd > jsonStart) raw = raw.slice(jsonStart, jsonEnd + 1);
  try {
    return JSON.parse(raw);
  } catch {
    console.log('    Could not parse JSON from this chunk, skipping');
    return [];
  }
}

// ── Save to Supabase (with retry) ──────────────────────────────
async function saveToSupabase(questions) {
  let saved = 0, errors = 0;
  for (const q of questions) {
    const body = JSON.stringify({
      subject: q.subject || 'SAT',
      level: q.level || 'SAT',
      topic: q.topic || q.section || 'General',
      difficulty: 'medium',
      type: q.type === 'grid_in' ? 'structured' : 'mcq',
      curriculum: 'sat',
      question_text: q.question,
      options: q.options || null,
      correct_answer: q.correctAnswer || '',
      mark_scheme: q.type === 'grid_in' ? q.correctAnswer : null,
      marks: 1,
      command_word: null,
      source: 'sat_book',
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
        if (!res.ok) {
          const err = await res.text();
          console.error(`    Save error: ${err.slice(0, 100)}`);
          errors++;
        } else {
          saved++;
        }
        break;
      } catch (fetchErr) {
        if (attempt < 2) {
          await new Promise(r => setTimeout(r, (attempt + 1) * 3000));
        } else {
          console.error(`    Save failed: ${fetchErr.message.slice(0, 60)}`);
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
    console.log('Usage: node scripts/extract-sat-books.mjs /path/to/SAT-*.pdf');
    process.exit(1);
  }

  console.log(`\nFound ${filePaths.length} PDF files\n`);

  // Separate answer keys from question books
  const books = [];
  const answerKeys = {};
  for (const fp of filePaths) {
    const name = basename(fp);
    const meta = detectBookMeta(name);
    if (meta.isAnswerKey) {
      // Match answer key to its test: Real-SAT-1-Answer → Real-SAT-1
      const testMatch = name.match(/Real-SAT-(\d+)/i);
      if (testMatch) answerKeys[testMatch[1]] = fp;
    } else {
      books.push({ path: fp, name, meta });
    }
  }

  console.log(`  Books: ${books.length}`);
  console.log(`  Answer keys: ${Object.keys(answerKeys).length}`);

  let totalSaved = 0;

  for (const book of books) {
    console.log(`\n--- ${book.name} ---`);

    // Extract text
    console.log('  Extracting PDF text...');
    const { text, numPages } = await extractPDFText(book.path);
    console.log(`  ${numPages} pages, ${text.length} chars`);

    // Load answer key if available
    let answerText = '';
    if (book.meta.testNumber && answerKeys[book.meta.testNumber]) {
      console.log(`  Loading answer key: ${basename(answerKeys[book.meta.testNumber])}`);
      const ak = await extractPDFText(answerKeys[book.meta.testNumber]);
      answerText = ak.text;
    }

    // Split into chunks
    const chunks = chunkText(text);
    console.log(`  Split into ${chunks.length} chunks`);

    let bookTotal = 0;

    for (let i = 0; i < chunks.length; i++) {
      console.log(`  Chunk ${i + 1}/${chunks.length}...`);

      // Extract questions with retry
      let questions = [];
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          questions = await extractFromChunk(chunks[i], book.meta, answerText);
          break;
        } catch (err) {
          if (attempt < 2) {
            console.log(`    Error: ${err.message.slice(0, 60)}, retrying in ${(attempt + 1) * 5}s...`);
            await new Promise(r => setTimeout(r, (attempt + 1) * 5000));
          } else {
            console.error(`    Failed after 3 attempts: ${err.message.slice(0, 60)}`);
          }
        }
      }

      if (questions.length === 0) continue;

      // Tag with metadata
      const tagged = questions.map(q => ({
        ...q,
        subject: book.meta.subject === 'SAT Subject' ? `SAT ${q.section || book.meta.section}` : 'SAT',
        level: 'SAT',
        section: q.section || book.meta.section,
      }));

      // Save
      const { saved, errors } = await saveToSupabase(tagged);
      bookTotal += saved;
      if (saved > 0) console.log(`    Extracted ${questions.length}, saved ${saved}${errors > 0 ? ` (${errors} errors)` : ''}`);

      // Rate limit pause
      await new Promise(r => setTimeout(r, 2000));
    }

    console.log(`  BOOK TOTAL: ${bookTotal} questions saved\n`);
    totalSaved += bookTotal;
  }

  console.log(`\n=== TOTAL: ${totalSaved} SAT questions saved from ${books.length} books ===\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
