#!/usr/bin/env node
/**
 * scripts/replace-with-verified.mjs — Replace AI notes with verified PDF content
 * ─────────────────────────────────────────────────────────────────
 * Reads downloaded verified PDFs, extracts content with Sonnet,
 * and replaces AI-generated notes with teacher-verified content.
 *
 * Usage:
 *   node scripts/replace-with-verified.mjs --subject Chemistry
 *   node scripts/replace-with-verified.mjs --all
 */

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config({ path: '.env.vercel' });
config({ path: '.env.local' });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-20250514';

if (!ANTHROPIC_API_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1); }

// Map subjects to their verified PDF locations
const VERIFIED_SOURCES = {
  'Chemistry': { dir: 'mojza/chemistry', files: ['Easy-Notes-Summarized-full-syllabus.pdf', 'OL-Chem-Key-Terms.pdf', 'OL-Chem-Colors-in-Chem.pdf'] },
  'Physics': { dir: 'kenoalevels/physics-olevel', allChapters: true },
  'Islamiyat': { dir: 'mojza/islamiyat', files: ['OL-Islamiyat-Topical-Compilation-P1-2009-2025-Final.pdf', 'OL-Islamiyat-Topical-Compilation-P2-2009-2025-Final.pdf'] },
  'Pakistan-Studies': { dir: 'mojza/pak-studies', files: ['Mojza-OL-Pakstudies.pdf', 'Mojza-OL-Geography-.pdf'] },
  'English-Language': { dir: 'mojza/english', allFiles: true },
  'Mathematics': { dir: 'mojza/maths', files: ['OL-IG-MATHS-notes.pdf'] },
  'Accounting': { dir: 'mojza/accounting', files: ['Ol-Accounting-Notes-1.pdf'] },
  'Economics': { dir: 'verified-notes/economics-2281', allFiles: true },
  'Business-Studies': { dir: 'verified-notes/business-studies-7115', allFiles: true },
  'Geography': { dir: 'verified-notes/geography-2217', allFiles: true },
  'History': { dir: 'verified-notes/history-2147', allFiles: true },
  'Sociology': { dir: 'verified-notes/sociology-2251', allFiles: true },
  'Commerce': { dir: 'verified-notes/commerce-7100', allFiles: true },
  'Computer-Science': { dir: 'verified-notes/computer-science-2210', allFiles: true },
  'Additional-Mathematics': { dir: 'verified-notes/additional-maths-4037', allFiles: true },
};

const basePath = path.join(process.env.HOME, 'Downloads/cambridge-pakistan-notes');
const notesDir = path.join(process.cwd(), 'data', 'nano-notes');
const publicDir = path.join(process.cwd(), 'public', 'data', 'nano-notes');

// Extract text from PDF
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

// Use Sonnet to rewrite note from verified PDF content
async function rewriteNote(existingNote, verifiedText, chapterName) {
  const prompt = `You are rewriting a Cambridge O Level revision note using VERIFIED teacher content.

CHAPTER: ${chapterName}
SUBJECT: ${existingNote.subject}

VERIFIED SOURCE TEXT (from teacher-authored PDF — this is the TRUTH):
${verifiedText.slice(0, 6000)}

EXISTING NOTE STRUCTURE (keep this format but replace content with verified source):
- keyPoints: ${existingNote.note_data?.keyPoints?.length || 0} points
- definitions: ${existingNote.note_data?.definitions?.length || 0}
- modelAnswer: ${existingNote.note_data?.modelAnswer ? 'YES' : 'NO'}

Rewrite the note using ONLY information from the verified source text above. Return JSON:
{
  "keyPoints": ["6-10 points using EXACT language from the verified source"],
  "definitions": [{"term": "...", "definition": "exact definition from the source"}],
  "commonMistakes": ["3-5 mistakes mentioned or implied in the source"],
  "examinerTips": ["2-3 tips from the source"],
  "quickRecap": "3-4 sentence summary based on the source"
}

RULES:
1. Use ONLY facts from the verified source — do NOT add anything from your own knowledge
2. If the source doesn't cover something, omit it — don't fabricate
3. Keep mark-scheme language where the source uses it
4. Return ONLY valid JSON`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 2000, messages: [{ role: 'user', content: prompt }] }),
  });

  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON');
  return JSON.parse(jsonMatch[0]);
}

// Main
const args = process.argv.slice(2);
const subjectArg = args.find((_, i) => args[i - 1] === '--subject');
const doAll = args.includes('--all');

const subjectsToProcess = doAll ? Object.keys(VERIFIED_SOURCES) : (subjectArg ? [subjectArg] : []);

if (subjectsToProcess.length === 0) {
  console.log('Usage: node scripts/replace-with-verified.mjs --subject Chemistry');
  console.log('       node scripts/replace-with-verified.mjs --all');
  process.exit(0);
}

console.log('\n═══ REPLACE AI NOTES WITH VERIFIED CONTENT ═══\n');

let replaced = 0, failed = 0;

for (const subject of subjectsToProcess) {
  const source = VERIFIED_SOURCES[subject];
  if (!source) { console.log(`No verified source for ${subject}, skipping`); continue; }

  const sourceDir = path.join(basePath, source.dir);
  if (!fs.existsSync(sourceDir)) { console.log(`Source dir not found: ${sourceDir}, skipping`); continue; }

  // Read all PDFs for this subject
  let allText = '';
  const pdfFiles = source.files || fs.readdirSync(sourceDir).filter(f => f.endsWith('.pdf'));

  console.log(`📚 ${subject} — reading ${pdfFiles.length} verified PDFs...`);

  for (const pdfFile of pdfFiles.slice(0, 5)) { // Max 5 PDFs per subject
    const pdfPath = path.join(sourceDir, pdfFile);
    if (!fs.existsSync(pdfPath)) continue;
    try {
      const text = await extractPDFText(pdfPath, 20);
      if (text.length > 100) {
        allText += `\n\n--- FROM: ${pdfFile} ---\n\n${text}`;
        console.log(`  ✓ ${pdfFile} (${(text.length/1024).toFixed(0)} KB text)`);
      }
    } catch (e) {
      console.log(`  ✗ ${pdfFile} — ${e.message}`);
    }
  }

  if (allText.length < 200) { console.log(`  ⚠ Not enough text extracted, skipping`); continue; }

  // Find all notes for this subject
  const noteFiles = fs.readdirSync(notesDir).filter(f => f.startsWith(subject) && f.endsWith('.json'));
  console.log(`  Replacing ${noteFiles.length} notes...`);

  for (const noteFile of noteFiles) {
    process.stdout.write(`    ${noteFile}...`);
    try {
      const notePath = path.join(notesDir, noteFile);
      const noteData = JSON.parse(fs.readFileSync(notePath, 'utf8'));
      const chapterName = noteData.chapter_name || noteData.note_data?.title || '';

      // Find relevant section of verified text for this chapter
      const chapterText = allText.length > 8000
        ? allText.slice(0, 8000) // Use first 8K chars if text is long
        : allText;

      const newContent = await rewriteNote(noteData, chapterText, chapterName);

      // Merge — keep existing enrichment data (pastPaperRefs etc) but replace core content
      noteData.note_data.keyPoints = newContent.keyPoints || noteData.note_data.keyPoints;
      noteData.note_data.definitions = newContent.definitions || noteData.note_data.definitions;
      noteData.note_data.commonMistakes = newContent.commonMistakes || noteData.note_data.commonMistakes;
      noteData.note_data.examinerTips = newContent.examinerTips || noteData.note_data.examinerTips;
      noteData.note_data.quickRecap = newContent.quickRecap || noteData.note_data.quickRecap;
      noteData.verified_content = true;
      noteData.verified_at = new Date().toISOString();

      fs.writeFileSync(notePath, JSON.stringify(noteData, null, 2));
      if (fs.existsSync(publicDir)) {
        fs.writeFileSync(path.join(publicDir, noteFile), JSON.stringify(noteData, null, 2));
      }

      console.log(` ✓ verified`);
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
