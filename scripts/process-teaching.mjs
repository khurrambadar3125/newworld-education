#!/usr/bin/env node
/**
 * scripts/process-teaching.mjs — Process solution bank PDFs into teaching_bank
 * ─────────────────────────────────────────────────────────────────
 * Reads worked solution PDFs, extracts step-by-step content,
 * saves to teaching_bank table for nano-teach Step 1 (LEARN).
 *
 * Usage: node scripts/process-teaching.mjs /path/to/*.pdf
 */

import { readFileSync, existsSync } from 'fs';
import { basename } from 'path';
import { config } from 'dotenv';

config({ path: '.env.vercel' });
config({ path: '.env.local' });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) { console.error('Missing SUPABASE env'); process.exit(1); }

// Topic mapping from filename patterns
function detectMeta(filename) {
  const f = filename.toLowerCase();
  const meta = { subject: 'Mathematics', level: 'A Level', curriculum: 'edexcel', chapter: '', topic: '', title: '' };

  // Detect chapter from exercise number
  const exMatch = f.match(/ex(\d+)([a-z])/);
  if (exMatch) {
    meta.chapter = `Chapter ${exMatch[1]}`;
    meta.title = `Exercise ${exMatch[1]}${exMatch[2].toUpperCase()}`;
  }

  const mixMatch = f.match(/ex(\d+)(?:mix|m)/);
  if (mixMatch) {
    meta.chapter = `Chapter ${mixMatch[1]}`;
    meta.title = `Mixed Exercise ${mixMatch[1]}`;
  }

  const revMatch = f.match(/review.*?(\d+)/i);
  if (revMatch) {
    meta.chapter = `Review ${revMatch[1]}`;
    meta.title = `Review Exercise ${revMatch[1]}`;
  }

  const pracMatch = f.match(/practice/i);
  if (pracMatch) {
    meta.title = 'Practice Exam Paper';
    meta.chapter = 'Practice';
  }

  // Detect Pure Maths year
  if (f.includes('p1') || f.includes('year_1') || f.includes('year-1')) {
    meta.topic = 'Pure Maths Year 1';
  } else if (f.includes('p2') || f.includes('year_2') || f.includes('year-2')) {
    meta.topic = 'Pure Maths Year 2';
  }

  // Topic mapping by chapter number (Edexcel Pure Maths Year 1)
  const chapterTopics = {
    '1': 'Algebraic Expressions', '2': 'Quadratics', '3': 'Equations and Inequalities',
    '4': 'Graphs and Transformations', '5': 'Straight Line Graphs', '6': 'Circles',
    '7': 'Algebraic Methods', '8': 'The Binomial Expansion', '9': 'Trigonometric Ratios',
    '10': 'Trigonometric Identities', '11': 'Vectors', '12': 'Differentiation',
    '13': 'Integration', '14': 'Exponentials and Logarithms',
  };
  if (exMatch && chapterTopics[exMatch[1]]) {
    meta.topic = chapterTopics[exMatch[1]];
  }

  // D1 = Decision Maths
  if (f.startsWith('d1')) { meta.topic = 'Decision Mathematics 1'; meta.subject = 'Further Mathematics'; }
  if (f.startsWith('s1')) { meta.topic = 'Statistics 1'; }
  if (f.startsWith('m1')) { meta.topic = 'Mechanics 1'; }
  if (f.startsWith('c1')) { meta.topic = 'Core Pure 1'; }
  if (f.startsWith('c2')) { meta.topic = 'Core Pure 2'; }
  if (f.startsWith('fp')) { meta.topic = 'Further Pure'; meta.subject = 'Further Mathematics'; }

  return meta;
}

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

async function saveToTeachingBank(entry) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/teaching_bank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SECRET_KEY,
          'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(entry),
      });
      if (res.ok) return true;
      if (attempt === 2) { const err = await res.text(); console.error(`  Save error: ${err.slice(0, 80)}`); }
      else await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      if (attempt === 2) console.error(`  Fetch error: ${err.message.slice(0, 60)}`);
      else await new Promise(r => setTimeout(r, 3000));
    }
  }
  return false;
}

async function main() {
  const filePaths = process.argv.slice(2).filter(f => f.endsWith('.pdf') && existsSync(f));
  if (filePaths.length === 0) {
    console.log('Usage: node scripts/process-teaching.mjs /path/to/*.pdf');
    process.exit(1);
  }

  console.log(`\nProcessing ${filePaths.length} teaching files\n`);

  let saved = 0, errors = 0;

  for (const filePath of filePaths) {
    const name = basename(filePath);
    const meta = detectMeta(name);

    try {
      const { text, numPages } = await extractPDFText(filePath);

      // Save as teaching content — the full text IS the lesson
      const ok = await saveToTeachingBank({
        subject: meta.subject,
        level: meta.level,
        topic: meta.topic || 'General',
        chapter: meta.chapter,
        content_type: 'worked_example',
        title: meta.title || name.replace('.pdf', ''),
        content: text.slice(0, 10000), // Cap at 10K chars
        source: 'solution_bank',
        curriculum: meta.curriculum,
        difficulty: 'medium',
      });

      if (ok) {
        saved++;
        if (saved % 20 === 0) console.log(`  ${saved} saved...`);
      } else {
        errors++;
      }
    } catch (err) {
      console.error(`  Error: ${name} — ${err.message.slice(0, 60)}`);
      errors++;
    }
  }

  console.log(`\n=== TOTAL: ${saved} teaching items saved, ${errors} errors ===\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
