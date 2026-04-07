#!/usr/bin/env node
/**
 * scripts/replace-remaining.mjs — Replace the remaining 143 unverified notes
 * Uses the newly downloaded text-based PDFs from PMT, ZNotes, etc.
 */

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config({ path: '.env.vercel' });
config({ path: '.env.local' });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-20250514';
if (!ANTHROPIC_API_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1); }

const textNotesBase = path.join(process.env.HOME, 'Downloads/cambridge-pakistan-notes/text-notes');
const notesDir = path.join(process.cwd(), 'data', 'nano-notes');
const publicDir = path.join(process.cwd(), 'public', 'data', 'nano-notes');

const SUBJECT_MAP = {
  'Physics': 'o-level-physics-5054',
  'Biology': 'o-level-biology-5090',
  'A-Level-Physics': 'a-level-physics-9702',
  'A-Level-Chemistry': 'a-level-chemistry-9701',
  'A-Level-Biology': 'a-level-biology-9700',
  'A-Level-Computer-Science': 'a-level-cs-9618',
  'A-Level-Psychology': 'a-level-psychology-9990',
  'A-Level-Accounting': 'a-level-accounting-9706',
  'A-Level-Business': 'a-level-business-9609',
  'Urdu': 'urdu-3247',
  'History': 'history-2147',
};

async function extractPDFText(filePath, maxPages = 20) {
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

async function rewriteNote(noteData, verifiedText, chapterName) {
  const prompt = `Rewrite this revision note using ONLY the verified teacher content below.

CHAPTER: ${chapterName}
SUBJECT: ${noteData.subject}

VERIFIED SOURCE:
${verifiedText.slice(0, 6000)}

Return JSON using ONLY facts from the source:
{
  "keyPoints": ["6-10 points"],
  "definitions": [{"term": "...", "definition": "..."}],
  "commonMistakes": ["3-5"],
  "examinerTips": ["2-3"],
  "quickRecap": "3-4 sentences"
}
Return ONLY valid JSON.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 2000, messages: [{ role: 'user', content: prompt }] }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  const match = (data.content?.[0]?.text || '').match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON');
  return JSON.parse(match[0]);
}

console.log('\n═══ REPLACE REMAINING 143 UNVERIFIED NOTES ═══\n');

let replaced = 0, failed = 0, skipped = 0;

for (const [prefix, dirName] of Object.entries(SUBJECT_MAP)) {
  const sourceDir = path.join(textNotesBase, dirName);
  if (!fs.existsSync(sourceDir)) { console.log(`⚠ ${prefix}: ${dirName} not found`); continue; }

  // Read source PDFs
  let allText = '';
  const pdfs = fs.readdirSync(sourceDir).filter(f => f.endsWith('.pdf')).slice(0, 6);
  console.log(`📚 ${prefix} — ${pdfs.length} source PDFs`);

  for (const pdf of pdfs) {
    try {
      const text = await extractPDFText(path.join(sourceDir, pdf), 15);
      if (text.length > 100) allText += '\n\n' + text;
    } catch {}
  }

  if (allText.length < 200) { console.log('  ⚠ Not enough text'); continue; }

  // Find unverified notes for this subject
  const noteFiles = fs.readdirSync(notesDir)
    .filter(f => f.startsWith(prefix) && f.endsWith('.json'))
    .filter(f => {
      const data = JSON.parse(fs.readFileSync(path.join(notesDir, f), 'utf8'));
      return !data.verified_content;
    });

  console.log(`  ${noteFiles.length} unverified notes to replace`);

  for (const noteFile of noteFiles) {
    process.stdout.write(`    ${noteFile}...`);
    try {
      const notePath = path.join(notesDir, noteFile);
      const noteData = JSON.parse(fs.readFileSync(notePath, 'utf8'));
      const chapterName = noteData.chapter_name || noteData.note_data?.title || '';

      const newContent = await rewriteNote(noteData, allText.slice(0, 8000), chapterName);
      noteData.note_data.keyPoints = newContent.keyPoints || noteData.note_data.keyPoints;
      noteData.note_data.definitions = newContent.definitions || noteData.note_data.definitions;
      noteData.note_data.commonMistakes = newContent.commonMistakes || noteData.note_data.commonMistakes;
      noteData.note_data.examinerTips = newContent.examinerTips || noteData.note_data.examinerTips;
      noteData.note_data.quickRecap = newContent.quickRecap || noteData.note_data.quickRecap;
      noteData.verified_content = true;
      noteData.verified_at = new Date().toISOString();

      fs.writeFileSync(notePath, JSON.stringify(noteData, null, 2));
      if (fs.existsSync(publicDir)) fs.writeFileSync(path.join(publicDir, noteFile), JSON.stringify(noteData, null, 2));
      console.log(' ✓');
      replaced++;
      await new Promise(r => setTimeout(r, 2500));
    } catch (err) {
      console.log(` ❌ ${err.message}`);
      failed++;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  console.log('');
}

console.log(`═══ DONE: ${replaced} replaced, ${failed} failed ═══`);
