#!/usr/bin/env node
/**
 * scripts/upload-topical.mjs — Process topical past paper compilations
 * ─────────────────────────────────────────────────────────────────
 * Usage: node scripts/upload-topical.mjs --subject "Chemistry" --level "O Level" /path/to/*.pdf
 *
 * Unlike upload-papers.mjs (which pairs QP+MS), this handles single-file
 * topical compilations where questions are organized by topic.
 * Uses Claude to extract questions and identify correct answers.
 */

import { readFileSync, existsSync } from 'fs';
import { basename } from 'path';
import { config } from 'dotenv';

config({ path: '.env.vercel' });
config({ path: '.env.local' });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!ANTHROPIC_API_KEY || !SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Missing env vars. Run: vercel env pull .env.vercel');
  process.exit(1);
}

// ── Extract PDF text ──────────────────────────────────────
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

// ── Detect topic from filename ──────────────────────────────────
function detectTopic(filename) {
  const n = filename.toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/qp|o level|cie|chemistry|physics|biology|\.pdf/gi, '')
    .replace(/\d+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  // Capitalize first letter of each word
  return n.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').trim() || 'General';
}

// ── Use Claude to extract questions ──────────────────────────────
async function parseQuestions(text, subject, level, topic) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514', // Admin tool only
      max_tokens: 8192,
      system: `You extract Cambridge exam questions from topical past paper compilations.
These are REAL Cambridge past paper questions compiled by topic.
For MCQs: identify the correct answer from your knowledge of Cambridge Chemistry.
For structured questions: provide the key marking points.
IMPORTANT: Keep answers SHORT. Output ONLY the JSON array.`,
      messages: [{
        role: 'user',
        content: `PAPER TEXT (${subject} ${level} — Topic: ${topic}):
${text.slice(0, 12000)}

Extract ALL questions as a JSON array. Be concise:
[{"number":1,"question":"short question text","type":"mcq"|"structured","options":{"A":"...","B":"...","C":"...","D":"..."}|null,"correctAnswer":"letter or short answer","marks":1,"topic":"${topic}","verified":true}]`
      }],
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  let raw = data.content.filter(b => b.type === 'text').map(b => b.text).join('').trim().replace(/```json|```/g, '').trim();
  const jsonStart = raw.indexOf('[');
  const jsonEnd = raw.lastIndexOf(']');
  if (jsonStart >= 0 && jsonEnd > jsonStart) raw = raw.slice(jsonStart, jsonEnd + 1);
  return JSON.parse(raw);
}

// ── Save to Supabase ──────────────────────────────────────
async function saveToSupabase(questions, subject, level) {
  let saved = 0, errors = 0;
  for (const q of questions) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/question_bank`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SECRET_KEY,
        'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        subject,
        level,
        topic: q.topic || 'General',
        difficulty: 'medium',
        type: q.type || 'mcq',
        curriculum: 'cambridge',
        question_text: q.question,
        options: q.options || null,
        correct_answer: q.correctAnswer || '',
        mark_scheme: q.type === 'mcq' ? null : q.correctAnswer,
        marks: q.type === 'mcq' ? 1 : (q.marks || 1),
        source: 'past_paper_topical',
        verified: true,
      }),
    });
    if (!res.ok) { errors++; } else { saved++; }
  }
  return { saved, errors };
}

// ── Main ──────────────────────────────────────
async function main() {
  // Parse args
  const args = process.argv.slice(2);
  let subject = 'Chemistry', level = 'O Level';
  const filePaths = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--subject' && args[i+1]) { subject = args[++i]; continue; }
    if (args[i] === '--level' && args[i+1]) { level = args[++i]; continue; }
    if (args[i].endsWith('.pdf') && existsSync(args[i])) filePaths.push(args[i]);
  }

  if (filePaths.length === 0) {
    console.log('Usage: node scripts/upload-topical.mjs --subject "Chemistry" --level "O Level" /path/to/*.pdf');
    process.exit(1);
  }

  console.log(`\nProcessing ${filePaths.length} topical PDFs for ${subject} (${level})\n`);

  let totalSaved = 0;

  for (const filePath of filePaths) {
    const name = basename(filePath);
    const topic = detectTopic(name);
    console.log(`--- ${name} ---`);
    console.log(`  Topic: ${topic}`);

    try {
      const { text, numPages } = await extractPDFText(filePath);
      console.log(`  Pages: ${numPages}`);

      const questions = await parseQuestions(text, subject, level, topic);
      console.log(`  Extracted: ${questions.length} questions`);

      if (questions.length === 0) { console.log('  No questions found.\n'); continue; }

      // Tag with metadata
      const tagged = questions.map(q => ({
        ...q,
        verified: true,
        topic: q.topic || topic,
      }));

      const { saved, errors } = await saveToSupabase(tagged, subject, level);
      console.log(`  SAVED: ${saved}${errors > 0 ? ` | Errors: ${errors}` : ''}\n`);
      totalSaved += saved;
    } catch (err) {
      console.error(`  Error: ${err.message}\n`);
    }
  }

  console.log(`\n=== TOTAL: ${totalSaved} ${subject} questions saved ===\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
