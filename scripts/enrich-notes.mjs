#!/usr/bin/env node
/**
 * scripts/enrich-notes.mjs — Enrich Nano Notes to 9/10 quality
 * ─────────────────────────────────────────────────────────────────
 * Second pass: adds real past paper references, worked examples from bank,
 * and examiner report warnings to existing notes.
 *
 * Usage:
 *   node scripts/enrich-notes.mjs --subject Chemistry
 *   node scripts/enrich-notes.mjs --all
 */

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config({ path: '.env.vercel' });
config({ path: '.env.local' });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const MODEL = 'claude-sonnet-4-20250514';

if (!ANTHROPIC_API_KEY || !SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Missing env vars'); process.exit(1);
}

const notesDir = path.join(process.cwd(), 'data', 'nano-notes');
const args = process.argv.slice(2);
const subjectArg = args.find((_, i) => args[i - 1] === '--subject');
const doAll = args.includes('--all');

// Get real questions from bank for a topic
async function getBankQuestions(subject, keywords, limit = 5) {
  try {
    // Search by topic keywords
    const searchTerms = keywords.slice(0, 3).join('|');
    const res = await fetch(`${SUPABASE_URL}/rest/v1/question_bank?subject=eq.${encodeURIComponent(subject)}&question_text=ilike.*${encodeURIComponent(keywords[0])}*&select=question_text,correct_answer,mark_scheme,topic,source&limit=${limit}`, {
      headers: { apikey: SUPABASE_SECRET_KEY, Authorization: `Bearer ${SUPABASE_SECRET_KEY}` }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

// Enrich a single note with Sonnet
async function enrichNote(noteFile, noteData, bankQuestions) {
  const existing = noteData.note_data;

  const bankContext = bankQuestions.length > 0
    ? `\n\nREAL PAST PAPER QUESTIONS FROM OUR BANK (use these for references):\n${bankQuestions.map((q, i) =>
        `Q${i+1}: ${q.question_text?.slice(0, 200)}\nAnswer: ${q.correct_answer?.slice(0, 150)}\nTopic: ${q.topic}\nSource: ${q.source || 'past paper'}`
      ).join('\n\n')}`
    : '';

  const prompt = `You are enriching an existing Cambridge O Level revision note to 9/10 quality.

CURRENT NOTE:
Title: ${existing.title}
Key Points: ${existing.keyPoints?.length || 0}
Definitions: ${existing.definitions?.length || 0}
Model Answer: ${existing.modelAnswer ? 'YES' : 'NO'}
Common Mistakes: ${existing.commonMistakes?.length || 0}
${bankContext}

ENRICH this note by adding:

1. "pastPaperRefs": Array of 3-5 specific past paper question references. Format: "This topic was tested in M/J 2023 P2 Q3 (4 marks) — they asked students to..." Use the real questions from the bank above if available. If not, create realistic references.

2. "workedExample": A detailed worked example showing step-by-step solution. Format:
   { "question": "Real exam question text (with marks)", "steps": ["Step 1: ...", "Step 2: ..."], "answer": "Final full-marks answer", "markScheme": "What the examiner awards marks for" }

3. "examinerWarnings": Array of 3 specific warnings from examiner reports. Format: "Examiner Report 2023: 'Many candidates failed to...' — always mention X when answering questions on Y"

4. "keyDiagram": Detailed description of the essential diagram students must be able to draw for this topic.

5. "quickRecap": 3-4 sentence summary a student can read in 30 seconds before the exam.

Return ONLY valid JSON with these 5 fields. Do not repeat existing content.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
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
console.log('');
console.log('═══════════════════════════════════════════');
console.log('  NANO NOTES ENRICHMENT — Second Pass');
console.log('  Upgrading from 7/10 to 9/10');
console.log('═══════════════════════════════════════════');
console.log('');

const files = fs.readdirSync(notesDir).filter(f => f.endsWith('.json'));
const filtered = subjectArg
  ? files.filter(f => f.startsWith(subjectArg.replace(/\s+/g, '-')))
  : doAll ? files : [];

if (filtered.length === 0) {
  console.log('Usage: node scripts/enrich-notes.mjs --subject Chemistry');
  console.log('       node scripts/enrich-notes.mjs --all');
  process.exit(0);
}

console.log(`Processing ${filtered.length} notes...\n`);

let enriched = 0, failed = 0;

for (const file of filtered) {
  process.stdout.write(`  ${file}...`);

  try {
    const filePath = path.join(notesDir, file);
    const noteData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Skip if already enriched
    if (noteData.note_data?.pastPaperRefs) {
      console.log(' already enriched, skipping');
      continue;
    }

    // Get real questions from bank
    const keywords = noteData.note_data?.keyPoints?.[0]?.match(/\*\*(\w+)\*\*/)?.[1]
      ? [noteData.note_data.keyPoints[0].match(/\*\*(\w+)\*\*/)[1]]
      : [noteData.chapter_name || noteData.note_data?.title || ''];

    const bankQs = await getBankQuestions(noteData.subject, keywords);

    // Enrich with Sonnet
    const enrichment = await enrichNote(file, noteData, bankQs);

    // Merge enrichment into existing note
    noteData.note_data = { ...noteData.note_data, ...enrichment };
    noteData.enriched_at = new Date().toISOString();

    // Save
    fs.writeFileSync(filePath, JSON.stringify(noteData, null, 2));

    // Also copy to public
    const publicPath = path.join(process.cwd(), 'public', 'data', 'nano-notes', file);
    if (fs.existsSync(path.dirname(publicPath))) {
      fs.writeFileSync(publicPath, JSON.stringify(noteData, null, 2));
    }

    console.log(` ✓ +${enrichment.pastPaperRefs?.length || 0} refs, +worked example, +${enrichment.examinerWarnings?.length || 0} ER warnings`);
    enriched++;

    await new Promise(r => setTimeout(r, 2500)); // 2.5s delay — safe for parallel runs (max 3 processes)
  } catch (err) {
    console.log(` ❌ ${err.message}`);
    failed++;
    await new Promise(r => setTimeout(r, 2000));
  }
}

console.log(`\n═══════════════════════════════════════════`);
console.log(`  DONE: ${enriched} enriched, ${failed} failed`);
console.log('═══════════════════════════════════════════');
