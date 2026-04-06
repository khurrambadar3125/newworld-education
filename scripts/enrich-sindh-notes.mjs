#!/usr/bin/env node
/**
 * scripts/enrich-sindh-notes.mjs — Enrich Sindh Board notes to 9/10
 * Same as enrich-notes.mjs but for Sindh Board content.
 */

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config({ path: '.env.vercel' });
config({ path: '.env.local' });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-20250514';

if (!ANTHROPIC_API_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1); }

const notesDir = path.join(process.cwd(), 'data', 'nano-notes-sindh');
const publicDir = path.join(process.cwd(), 'public', 'data', 'nano-notes-sindh');

async function enrichNote(noteData) {
  const existing = noteData.note_data;

  const prompt = `You are enriching a Sindh Board (BSEK) revision note to 9/10 quality.

CURRENT NOTE:
Title: ${existing.title}
Board: Sindh Board (BSEK/AKU-EB)
Class: ${noteData.class || '9'}
Key Points: ${existing.keyPoints?.length || 0}
Definitions: ${existing.definitions?.length || 0}

Add these 5 enrichments. Return ONLY valid JSON:

1. "pastPaperRefs": 3-4 BSEK past paper references. Format: "BSEK 2023 SSC-II Q5 (5 marks) — asked students to define and differentiate..."

2. "workedExample": A worked example in BSEK exam style:
   { "question": "BSEK-style question with marks", "steps": ["Step 1...", "Step 2..."], "answer": "Full marks answer using textbook definitions", "markScheme": "What earns each mark" }

3. "examinerWarnings": 3 warnings. Format: "Students often lose marks by writing general answers instead of textbook-exact definitions. Always use the STBB textbook phrasing."

4. "quickRecap": 3-4 sentence summary for last-minute revision before exam.

5. "importantFormulas": Any formulas or key equations for this topic (empty array if none).

Remember: Sindh Board expects TEXTBOOK-EXACT definitions, not application-based answers like Cambridge.`;

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

console.log('\n═══ SINDH BOARD NOTES ENRICHMENT ═══\n');

const files = fs.readdirSync(notesDir).filter(f => f.endsWith('.json'));
console.log(`Processing ${files.length} Sindh Board notes...\n`);

let enriched = 0, failed = 0, skipped = 0;

for (const file of files) {
  const filePath = path.join(notesDir, file);
  const noteData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (noteData.note_data?.pastPaperRefs) { skipped++; continue; }

  process.stdout.write(`  ${file}...`);
  try {
    const enrichment = await enrichNote(noteData);
    noteData.note_data = { ...noteData.note_data, ...enrichment };
    noteData.enriched_at = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(noteData, null, 2));
    if (fs.existsSync(publicDir)) fs.writeFileSync(path.join(publicDir, file), JSON.stringify(noteData, null, 2));
    console.log(` ✓`);
    enriched++;
    await new Promise(r => setTimeout(r, 2500));
  } catch (err) {
    console.log(` ❌ ${err.message}`);
    failed++;
    await new Promise(r => setTimeout(r, 3000));
  }
}

console.log(`\n═══ DONE: ${enriched} enriched, ${skipped} skipped, ${failed} failed ═══`);
