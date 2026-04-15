#!/usr/bin/env node
/**
 * scripts/extract-mite-content.mjs — Extract questions from MiTE university PDFs
 * Saves to question_bank with curriculum='mite', level='University'
 */

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config({ path: '.env.vercel' });
config({ path: '.env.local' });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const MODEL = 'claude-haiku-4-5-20251001';

if (!ANTHROPIC_API_KEY || !SUPABASE_URL || !SUPABASE_SECRET_KEY) { console.error('Missing env vars'); process.exit(1); }

async function extractPDFText(filePath, maxPages = 30) {
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
  const buffer = fs.readFileSync(filePath);
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
  const pages = [];
  for (let i = 1; i <= Math.min(doc.numPages, maxPages); i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => item.str).join(' '));
  }
  return pages.join('\n\n').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ').replace(/\s{3,}/g, '  ').trim();
}

function chunkText(text, maxChars = 4000) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = start + maxChars;
    if (end < text.length) { const lb = text.lastIndexOf('\n\n', end); if (lb > start + maxChars * 0.5) end = lb; }
    chunks.push(text.slice(start, end));
    start = end;
  }
  return chunks;
}

function detectProgram(filename) {
  const f = filename.toLowerCase();
  if (f.includes('bba') || f.includes('management') || f.includes('marketing') || f.includes('accounting') || f.includes('mba')) return { subject: 'BBA', program: 'BBA' };
  if (f.includes('bscs') || f.includes('programming') || f.includes('data structure') || f.includes('dld') || f.includes('oop') || f.includes('database') || f.includes('algorithm')) return { subject: 'Computer Science', program: 'BSCS' };
  if (f.includes('law') || f.includes('lat') || f.includes('legal') || f.includes('constitution') || f.includes('criminal')) return { subject: 'Law', program: 'Law' };
  if (f.includes('gat') || f.includes('nat') || f.includes('nts') || f.includes('aptitude') || f.includes('verbal') || f.includes('quantitative')) return { subject: 'General Aptitude', program: 'General' };
  if (f.includes('math') || f.includes('calculus')) return { subject: 'Mathematics', program: 'BSCS' };
  if (f.includes('english') || f.includes('lcat') || f.includes('lums')) return { subject: 'BBA', program: 'BBA' };
  return { subject: 'General', program: 'General' };
}

async function extractFromChunk(chunk, meta) {
  const safeChunk = chunk.replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ').slice(0, 4000);
  const prompt = `Extract university entrance test / exam questions from this text. For MCQs include options A-D and correct answer. Return ONLY a JSON array:
[{"question":"text","type":"mcq","options":{"A":"opt","B":"opt","C":"opt","D":"opt"},"correctAnswer":"B","topic":"topic name","verified":true}]
If no questions found return []

Subject: ${meta.subject} (${meta.program})

TEXT:
${safeChunk}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 4000, messages: [{ role: 'user', content: prompt }] }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  let raw = (data.content?.[0]?.text || '').replace(/```json|```/g, '').trim();
  const s = raw.indexOf('['), e = raw.lastIndexOf(']');
  if (s >= 0 && e > s) raw = raw.slice(s, e + 1);
  try { return JSON.parse(raw); } catch { return []; }
}

async function saveToSupabase(questions, meta) {
  let saved = 0, errors = 0;
  for (const q of questions) {
    const body = JSON.stringify({
      subject: meta.subject, level: 'University', topic: q.topic || meta.program,
      difficulty: 'medium', type: q.type === 'mcq' ? 'mcq' : 'structured',
      curriculum: 'mite', question_text: (q.question || '').slice(0, 2000),
      options: (q.options && typeof q.options === 'object') ? q.options : null,
      correct_answer: String(q.correctAnswer || '').slice(0, 500),
      marks: 1, source: 'university_paper', verified: q.verified !== false,
    });
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/question_bank`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SUPABASE_SECRET_KEY, Authorization: `Bearer ${SUPABASE_SECRET_KEY}`, Prefer: 'return=minimal' }, body,
      });
      if (res.ok) saved++; else errors++;
    } catch { errors++; }
  }
  return { saved, errors };
}

// Main
const base = path.join(process.env.HOME, 'Downloads/mite-content');
const allPdfs = [];
const findPdfs = (p) => {
  if (!fs.existsSync(p)) return;
  fs.readdirSync(p).forEach(f => {
    const full = path.join(p, f);
    if (fs.statSync(full).isDirectory()) findPdfs(full);
    else if (f.endsWith('.pdf') && fs.statSync(full).size > 5000 && fs.statSync(full).size < 30000000) allPdfs.push(full);
  });
};
['bba', 'law', 'general-aptitude'].forEach(d => findPdfs(path.join(base, d)));
// Add key BSCS files (not all 500+)
const bscsDir = path.join(base, 'bscs');
if (fs.existsSync(bscsDir)) {
  fs.readdirSync(bscsDir).filter(f => f.endsWith('.pdf')).slice(0, 10).forEach(f => allPdfs.push(path.join(bscsDir, f)));
}

allPdfs.sort((a, b) => fs.statSync(a).size - fs.statSync(b).size);

console.log(`\n═══ MiTE CONTENT EXTRACTION ═══`);
console.log(`${allPdfs.length} PDFs to process\n`);

let grandTotal = 0, grandErrors = 0;

for (const fp of allPdfs) {
  const name = path.basename(fp);
  const meta = detectProgram(name);
  console.log(`📄 ${name} (${meta.program})`);

  try {
    const text = await extractPDFText(fp, 20);
    if (text.length < 100) { console.log('  ⚠ No text'); continue; }
    const chunks = chunkText(text);
    let fileQs = [];
    for (let i = 0; i < chunks.length; i++) {
      process.stdout.write(`  Chunk ${i+1}/${chunks.length}...`);
      try {
        const qs = await extractFromChunk(chunks[i], meta);
        fileQs.push(...qs);
        console.log(` ${qs.length} Qs`);
        await new Promise(r => setTimeout(r, 1000));
      } catch (e) { console.log(` ❌`); }
    }
    // Dedup
    const seen = new Set();
    fileQs = fileQs.filter(q => {
      const k = (q.question || '').slice(0, 80).toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return q.question && q.question.length > 10;
    });
    if (fileQs.length > 0) {
      const { saved, errors } = await saveToSupabase(fileQs, meta);
      console.log(`  Saved: ${saved} | Errors: ${errors}`);
      grandTotal += saved;
      grandErrors += errors;
    }
  } catch (e) { console.log(`  ❌ ${e.message}`); }
  console.log('');
}

console.log(`═══ DONE: ${grandTotal} questions saved, ${grandErrors} errors ═══`);
