#!/usr/bin/env node
/**
 * scripts/upload-sen.mjs — SEN Content Auto-Classifier + Extractor
 * ─────────────────────────────────────────────────────────────────
 * Processes Functional Skills, KS1, KS2, and Phonics PDFs.
 * Auto-detects: level, subject, exam board, paper type (QP/MS/insert)
 * Pairs QP+MS automatically, extracts questions, saves to bank.
 *
 * Usage: node scripts/upload-sen.mjs /path/to/*.pdf
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
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) { console.error('Missing SUPABASE env'); process.exit(1); }

// ── Auto-classify file from filename ──────────────────────────────
function classifyFile(name) {
  const n = name.toLowerCase();
  const meta = {
    isMS: false, isQP: false, isInsert: false, isScoreTable: false,
    level: 'Unknown', subject: 'Unknown', examBoard: 'Unknown',
    session: null, paperNum: null, curriculum: 'functional_skills',
  };

  // Detect type
  if (n.includes('-ms') || n.includes('mark-scheme') || n.includes('marking-scheme') || n.includes('mark_scheme')) meta.isMS = true;
  else if (n.includes('insert') || n.includes('booklet') || n.includes('text-booklet') || n.includes('reading-booklet')) meta.isInsert = true;
  else if (n.includes('raw-score') || n.includes('scaled-score') || n.includes('threshold')) meta.isScoreTable = true;
  else meta.isQP = true;

  // Detect exam board
  if (n.includes('aqa')) meta.examBoard = 'AQA';
  else if (n.includes('edexcel')) meta.examBoard = 'Edexcel';
  else if (n.includes('city-and-guilds') || n.includes('city_guilds')) meta.examBoard = 'City & Guilds';
  else if (n.includes('ncfe')) meta.examBoard = 'NCFE';
  else if (n.includes('ks1')) { meta.examBoard = 'DfE'; meta.curriculum = 'ks1'; }
  else if (n.includes('ks2')) { meta.examBoard = 'DfE'; meta.curriculum = 'ks2'; }

  // Detect level
  if (n.includes('entry-level-1') || n.includes('entry_level_1') || n.includes('el1')) meta.level = 'Entry Level 1';
  else if (n.includes('entry-level-2') || n.includes('entry_level_2') || n.includes('el2')) meta.level = 'Entry Level 2';
  else if (n.includes('entry-level-3') || n.includes('entry_level_3') || n.includes('el3')) meta.level = 'Entry Level 3';
  else if (n.includes('level-2') || n.includes('level_2') || n.includes('level 2')) meta.level = 'Functional Level 2';
  else if (n.includes('level-1') || n.includes('level_1') || n.includes('level 1')) meta.level = 'Functional Level 1';
  else if (n.includes('ks1')) meta.level = 'KS1';
  else if (n.includes('ks2')) meta.level = 'KS2';

  // Detect subject
  if (n.includes('maths') || n.includes('mathematics') || n.includes('math')) meta.subject = 'Mathematics';
  else if (n.includes('reading')) meta.subject = 'English Reading';
  else if (n.includes('writing')) meta.subject = 'English Writing';
  else if (n.includes('spelling')) meta.subject = 'Spelling';
  else if (n.includes('grammar') || n.includes('punctuation') || n.includes('spag')) meta.subject = 'Grammar & Punctuation';
  else if (n.includes('english')) meta.subject = 'English';
  else if (n.includes('phonics')) meta.subject = 'Phonics';

  // Detect session/year
  const yearMatch = n.match(/(\d{4})/);
  if (yearMatch) meta.session = yearMatch[1];

  // Detect paper number
  const paperMatch = n.match(/paper[- _]?(\d)/i);
  if (paperMatch) meta.paperNum = paperMatch[1];

  // Detect sample vs past
  if (n.includes('sample')) meta.session = 'sample';
  if (n.includes('practice')) meta.session = 'practice';

  return meta;
}

// ── Group key for pairing ──────────────────────────────────────
function groupKey(meta) {
  return `${meta.examBoard}|${meta.level}|${meta.subject}|${meta.session || 'x'}|${meta.paperNum || 'x'}`;
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

// ── Detect level/subject from PDF text if filename didn't give enough ──
function enrichFromText(meta, text) {
  if (meta.level === 'Unknown') {
    if (/Entry Level 1/i.test(text)) meta.level = 'Entry Level 1';
    else if (/Entry Level 2/i.test(text)) meta.level = 'Entry Level 2';
    else if (/Entry Level 3/i.test(text)) meta.level = 'Entry Level 3';
    else if (/Level 1/i.test(text) && /Functional/i.test(text)) meta.level = 'Functional Level 1';
    else if (/Level 2/i.test(text) && /Functional/i.test(text)) meta.level = 'Functional Level 2';
    else if (/Key Stage 1|KS1|Year 2/i.test(text)) meta.level = 'KS1';
    else if (/Key Stage 2|KS2|Year 6/i.test(text)) meta.level = 'KS2';
  }
  if (meta.subject === 'Unknown' || meta.subject === 'English') {
    if (/mathematics|maths|arithmetic|number|calculation/i.test(text.slice(0, 500))) meta.subject = 'Mathematics';
    else if (/reading/i.test(text.slice(0, 500))) meta.subject = 'English Reading';
    else if (/writing/i.test(text.slice(0, 500))) meta.subject = 'English Writing';
    else if (/spelling/i.test(text.slice(0, 500))) meta.subject = 'Spelling';
    else if (/grammar|punctuation/i.test(text.slice(0, 500))) meta.subject = 'Grammar & Punctuation';
  }
  if (meta.examBoard === 'Unknown') {
    if (/AQA/i.test(text)) meta.examBoard = 'AQA';
    else if (/Pearson|Edexcel/i.test(text)) meta.examBoard = 'Edexcel';
    else if (/City.*Guilds/i.test(text)) meta.examBoard = 'City & Guilds';
    else if (/NCFE/i.test(text)) meta.examBoard = 'NCFE';
    else if (/Standards.*Testing/i.test(text)) meta.examBoard = 'DfE';
  }
  return meta;
}

// ── Use Claude to parse questions ──────────────────────────────
async function parseQuestions(qpText, msText, meta) {
  const levelDesc = meta.level.includes('Entry') ? `This is a ${meta.level} paper — designed for learners with special educational needs or working below GCSE level. Questions are simple and accessible.`
    : meta.level === 'KS1' ? 'This is a KS1 (Year 2, age 6-7) paper. Questions are very simple — basic reading, counting, shapes.'
    : meta.level === 'KS2' ? 'This is a KS2 (Year 6, age 10-11) paper. Questions are intermediate level.'
    : `This is a ${meta.level} Functional Skills paper.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: `You extract exam questions from UK educational assessment papers. ${levelDesc}

You are given:
1. The QUESTION PAPER text
2. The MARK SCHEME text (correct answers)

Match each question to its correct answer from the mark scheme.
Tag each question with its topic (e.g., "Addition", "Fractions", "Reading Comprehension", "Spelling", "Grammar").
Set difficulty based on the level: Entry Level 1 = very_easy, Entry Level 2 = easy, Entry Level 3 = easy, KS1 = easy, KS2 = medium, Level 1 = medium, Level 2 = hard.

CRITICAL: The correct answer MUST come from the mark scheme.
Output ONLY the JSON array — no text before or after.`,
      messages: [{
        role: 'user',
        content: `QUESTION PAPER:
${qpText.slice(0, 12000)}

MARK SCHEME:
${msText.slice(0, 8000)}

Subject: ${meta.subject}
Level: ${meta.level}
Exam Board: ${meta.examBoard}

Extract ALL questions as JSON:
[{"number":1,"question":"question text","type":"mcq"|"structured"|"spelling"|"reading","options":{"A":"...","B":"...","C":"...","D":"..."}|null,"correctAnswer":"answer","marks":1,"topic":"specific topic","difficulty":"very_easy|easy|medium|hard","verified":true|false,"senLevel":"${meta.level}"}]`
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
async function saveToSupabase(questions) {
  let saved = 0, errors = 0;
  for (const q of questions) {
    if (!q.verified) continue;
    const row = {
      subject: q.subject || 'English',
      level: q.senLevel || 'KS1',
      topic: q.topic || 'General',
      difficulty: q.difficulty || 'easy',
      type: q.type || 'structured',
      curriculum: q.curriculum || 'functional_skills',
      question_text: q.question,
      options: q.options || null,
      correct_answer: q.correctAnswer || '',
      mark_scheme: q.type !== 'mcq' ? q.correctAnswer : null,
      marks: q.marks || 1,
      source: 'sen_paper',
      verified: true,
    };

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
          body: JSON.stringify(row),
        });
        if (!res.ok) { errors++; } else { saved++; }
        break;
      } catch (err) {
        if (attempt < 2) await new Promise(r => setTimeout(r, (attempt + 1) * 3000));
        else errors++;
      }
    }
  }
  return { saved, errors };
}

// ── Main ──────────────────────────────────────
async function main() {
  const filePaths = process.argv.slice(2).filter(f => f.endsWith('.pdf') && existsSync(f));
  if (filePaths.length === 0) {
    console.log('Usage: node scripts/upload-sen.mjs /path/to/*.pdf');
    process.exit(1);
  }

  console.log(`\nFound ${filePaths.length} PDF files\n`);

  // Classify all files
  const classified = filePaths.map(path => {
    const name = basename(path);
    const meta = classifyFile(name);
    return { path, name, meta };
  });

  const qpFiles = classified.filter(f => f.meta.isQP);
  const msFiles = classified.filter(f => f.meta.isMS);
  const inserts = classified.filter(f => f.meta.isInsert);
  const scoreTables = classified.filter(f => f.meta.isScoreTable);

  console.log(`  Question Papers: ${qpFiles.length}`);
  console.log(`  Mark Schemes:    ${msFiles.length}`);
  console.log(`  Inserts/Booklets: ${inserts.length}`);
  console.log(`  Score Tables:    ${scoreTables.length} (skipping)\n`);

  // Print classification
  for (const f of [...qpFiles, ...msFiles].slice(0, 10)) {
    console.log(`  ${f.name}`);
    console.log(`    → ${f.meta.examBoard} | ${f.meta.level} | ${f.meta.subject} | ${f.meta.isMS ? 'MS' : 'QP'}`);
  }
  if (qpFiles.length + msFiles.length > 10) console.log(`  ... and ${qpFiles.length + msFiles.length - 10} more\n`);

  // Pair QP + MS by group key
  const groups = {};
  for (const f of [...qpFiles, ...msFiles]) {
    const key = groupKey(f.meta);
    if (!groups[key]) groups[key] = { qp: null, ms: null, meta: f.meta, key };
    if (f.meta.isMS) groups[key].ms = f;
    else groups[key].qp = f;
  }

  // Also try looser matching — same board+level+subject
  for (const g of Object.values(groups)) {
    if (g.qp && !g.ms) {
      // Find any MS with same board+level+subject
      const looseMS = msFiles.find(f =>
        f.meta.examBoard === g.meta.examBoard &&
        f.meta.level === g.meta.level &&
        f.meta.subject === g.meta.subject &&
        !Object.values(groups).some(g2 => g2.ms === f)
      );
      if (looseMS) g.ms = looseMS;
    }
  }

  const pairs = Object.values(groups).filter(g => g.qp && g.ms);
  const qpOnly = Object.values(groups).filter(g => g.qp && !g.ms);

  console.log(`\n  Paired (QP+MS): ${pairs.length}`);
  console.log(`  QP without MS:  ${qpOnly.length}\n`);

  let totalSaved = 0;

  for (const pair of pairs) {
    const qp = pair.qp;
    const ms = pair.ms;
    console.log(`--- ${qp.name} + ${ms.name} ---`);

    try {
      // Extract text
      const [qpResult, msResult] = await Promise.all([
        extractPDFText(qp.path),
        extractPDFText(ms.path),
      ]);

      // Enrich metadata from text
      const meta = enrichFromText({ ...pair.meta }, qpResult.text);
      console.log(`  ${meta.examBoard} | ${meta.level} | ${meta.subject} | ${qpResult.numPages}p + ${msResult.numPages}p`);

      // Extract questions
      console.log('  Extracting with Claude...');
      let questions;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          questions = await parseQuestions(qpResult.text, msResult.text, meta);
          break;
        } catch (err) {
          if (attempt < 2) {
            console.log(`  Retrying in ${(attempt + 1) * 5}s...`);
            await new Promise(r => setTimeout(r, (attempt + 1) * 5000));
          } else {
            console.error(`  Failed: ${err.message.slice(0, 60)}`);
            questions = null;
          }
        }
      }
      if (!questions) continue;

      await new Promise(r => setTimeout(r, 2000));

      console.log(`  Extracted: ${questions.length} questions`);
      if (questions.length === 0) continue;

      // Tag with metadata
      const tagged = questions.map(q => ({
        ...q,
        verified: true,
        subject: meta.subject === 'Unknown' ? 'English' : meta.subject,
        senLevel: meta.level,
        curriculum: meta.curriculum,
      }));

      // Save
      const { saved, errors } = await saveToSupabase(tagged);
      console.log(`  SAVED: ${saved}${errors > 0 ? ` | Errors: ${errors}` : ''}\n`);
      totalSaved += saved;
    } catch (err) {
      console.error(`  ERROR: ${err.message.slice(0, 80)}\n`);
    }
  }

  console.log(`\n=== TOTAL: ${totalSaved} SEN questions saved from ${pairs.length} papers ===\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
