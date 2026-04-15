#!/usr/bin/env node
/**
 * scripts/replace-alevel-verified.mjs — Replace A Level AI notes with verified content
 */

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config({ path: '.env.vercel' });
config({ path: '.env.local' });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-haiku-4-5-20251001';

if (!ANTHROPIC_API_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1); }

const basePath = path.join(process.env.HOME, 'Downloads/cambridge-pakistan-notes');
const notesDir = path.join(process.cwd(), 'data', 'nano-notes');
const publicDir = path.join(process.cwd(), 'public', 'data', 'nano-notes');

const A_LEVEL_SOURCES = {
  'A-Level-Chemistry': { dir: 'a-level/chemistry-9701', allFiles: true },
  'A-Level-Physics': { dir: 'kenoalevels/physics-as', allFiles: true, extra: 'kenoalevels/physics-a2' },
  'A-Level-Mathematics': { dir: 'a-level/maths-9709', allFiles: true },
  'A-Level-Biology': { dir: 'a-level/biology-9700', allFiles: true },
  'A-Level-Economics': { dir: 'a-level/economics-9708/pmt-notes', allFiles: true },
  'A-Level-Business': { dir: 'a-level/business-9609', allFiles: true },
  'A-Level-Computer-Science': { dir: 'a-level/computer-science-9618', allFiles: true },
  'A-Level-Psychology': { dir: 'a-level/psychology-9990', allFiles: true },
  'A-Level-Accounting': { dir: 'a-level/accounting-9706', allFiles: true },
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
  const prompt = `Rewrite this Cambridge A Level revision note using VERIFIED teacher content.

CHAPTER: ${chapterName}
SUBJECT: ${noteData.subject}

VERIFIED SOURCE (teacher-authored — this is the TRUTH):
${verifiedText.slice(0, 6000)}

Return JSON with ONLY facts from the source:
{
  "keyPoints": ["6-10 points from the verified source"],
  "definitions": [{"term": "...", "definition": "from the source"}],
  "commonMistakes": ["3-5 from the source"],
  "examinerTips": ["2-3 from the source"],
  "quickRecap": "3-4 sentence summary"
}

Use ONLY the source. Do NOT add from your own knowledge. Return ONLY valid JSON.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 2000, messages: [{ role: 'user', content: prompt }] }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON');
  return JSON.parse(match[0]);
}

console.log('\n═══ REPLACE A LEVEL AI NOTES WITH VERIFIED ═══\n');

let replaced = 0, failed = 0;

for (const [subject, source] of Object.entries(A_LEVEL_SOURCES)) {
  const sourceDir = path.join(basePath, source.dir);
  if (!fs.existsSync(sourceDir)) { console.log(`⚠ ${subject}: source not found`); continue; }

  let allText = '';
  const pdfFiles = fs.readdirSync(sourceDir).filter(f => f.endsWith('.pdf')).slice(0, 5);

  // Also check extra dir (for Physics AS+A2)
  if (source.extra) {
    const extraDir = path.join(basePath, source.extra);
    if (fs.existsSync(extraDir)) {
      pdfFiles.push(...fs.readdirSync(extraDir).filter(f => f.endsWith('.pdf')).slice(0, 3).map(f => path.join('..', source.extra.split('/').pop(), f)));
    }
  }

  console.log(`📚 ${subject} — ${pdfFiles.length} source PDFs`);

  for (const pdfFile of pdfFiles.slice(0, 5)) {
    const pdfPath = pdfFile.startsWith('..') ? path.join(basePath, source.extra || '', path.basename(pdfFile)) : path.join(sourceDir, pdfFile);
    if (!fs.existsSync(pdfPath)) continue;
    try {
      const text = await extractPDFText(pdfPath, 15);
      if (text.length > 100) allText += `\n\n${text}`;
    } catch {}
  }

  if (allText.length < 200) { console.log(`  ⚠ Not enough text`); continue; }

  const noteFiles = fs.readdirSync(notesDir).filter(f => f.startsWith(subject) && f.endsWith('.json'));
  console.log(`  Replacing ${noteFiles.length} notes...`);

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

      console.log(` ✓`);
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
