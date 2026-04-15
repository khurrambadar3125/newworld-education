#!/usr/bin/env node
/**
 * scripts/generate-sindh-notes.mjs — Sindh Board Nano Notes Generator
 * ─────────────────────────────────────────────────────────────────
 * Generates exam-focused revision notes for Sindh Board (BSEK/AKU-EB)
 * Class 9-10 subjects. Uses Sonnet for quality content.
 *
 * Key difference from Cambridge notes: Sindh Board expects
 * TEXTBOOK-EXACT definitions, not mark-scheme language.
 *
 * Usage:
 *   node scripts/generate-sindh-notes.mjs --all
 *   node scripts/generate-sindh-notes.mjs --subject Physics
 */

import fs from 'fs';
import path from 'path';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-haiku-4-5-20251001';

if (!ANTHROPIC_API_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1); }

// Load Sindh Board syllabus
const syllabusPath = path.join(process.cwd(), 'utils/sindhBoardSyllabus.js');
const { SINDH_SYLLABUS, getSindhSubjectsWithMeta } = await import(syllabusPath);

const args = process.argv.slice(2);
const subjectArg = args.find((_, i) => args[i - 1] === '--subject');
const doAll = args.includes('--all');

if (!subjectArg && !doAll) {
  console.log('Usage: node scripts/generate-sindh-notes.mjs --all');
  process.exit(0);
}

const subjects = doAll ? Object.keys(SINDH_SYLLABUS) : [subjectArg];
const notesDir = path.join(process.cwd(), 'data', 'nano-notes-sindh');
fs.mkdirSync(notesDir, { recursive: true });

async function generateSindhNote(subject, chapter, classNum) {
  const prompt = `You are a Sindh Textbook Board (STBB) Class ${classNum} ${subject} teacher creating revision notes for Pakistani students preparing for BSEK SSC exams in Karachi.

Generate a concise, exam-focused Nano Note for this chapter:

SUBJECT: ${subject} (Sindh Board, Class ${classNum})
CHAPTER: ${chapter.name} (Chapter ${chapter.id})
BOARD: BSEK (Board of Secondary Education Karachi) / AKU-EB
EXAM FORMAT: 20% MCQs + 80% Subjective (short + long questions)

IMPORTANT DIFFERENCES FROM CAMBRIDGE:
- Sindh Board expects TEXTBOOK-EXACT definitions — word for word from the STBB book
- Questions often ask "Define", "Differentiate", "Write a note on", "Derive"
- Students must memorize specific derivations and diagrams
- Past paper questions frequently repeat verbatim
- Use Pakistani context (Tarbela Dam, Karachi, Sindh rivers, etc.)

Create the note in this EXACT JSON structure:
{
  "title": "${chapter.name}",
  "readTime": "8 min",
  "board": "Sindh Board (BSEK)",
  "class": ${classNum},
  "keyPoints": [
    "Point 1 — use textbook-exact language where possible",
    "Point 2..."
  ],
  "definitions": [
    { "term": "Key Term", "definition": "Exact textbook definition that BSEK expects" }
  ],
  "importantQuestions": [
    { "type": "short", "question": "Common short question from past papers", "answer": "Model answer (2-3 lines)" },
    { "type": "long", "question": "Common long question (5-8 marks)", "answer": "Model answer with all key points" }
  ],
  "mcqs": [
    { "question": "Sample MCQ", "options": {"A": "opt1", "B": "opt2", "C": "opt3", "D": "opt4"}, "correct": "B" }
  ],
  "commonMistakes": [
    "Students often confuse X with Y",
    "Always write the formula before solving"
  ],
  "examTips": [
    "This chapter usually has 1 MCQ and 1 short question in every BSEK paper",
    "Memorize the diagram — it appears every year"
  ],
  "formulas": ["formula1", "formula2"],
  "keyDiagram": "Description of the essential diagram students must draw"
}

RULES:
1. keyPoints: 6-10 points using STBB textbook language
2. definitions: 3-5 key terms with EXACT definitions as they appear in STBB books
3. importantQuestions: 2 questions (1 short, 1 long) that frequently appear in BSEK exams
4. mcqs: 2-3 MCQs in the style BSEK asks
5. commonMistakes: 3-5 real mistakes students make
6. Use Pakistani examples and context
7. Keep it SHORT — 2-3 pages revision format
8. Remember: Sindh Board = memorize definitions + solve numericals, NOT application-based like Cambridge

Return ONLY valid JSON.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 2500, messages: [{ role: 'user', content: prompt }] }),
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in response');
  return JSON.parse(jsonMatch[0]);
}

console.log('');
console.log('═══════════════════════════════════════════');
console.log('  SINDH BOARD NANO NOTES GENERATOR');
console.log('  Model: Sonnet 4 | Board: BSEK/AKU-EB');
console.log('═══════════════════════════════════════════');
console.log('');

let total = 0, failed = 0;

for (const subjectName of subjects) {
  const entry = SINDH_SYLLABUS[subjectName];
  if (!entry) { console.error(`Subject not found: ${subjectName}`); continue; }

  const allChapters = [
    ...(entry.class9?.chapters || []).map(c => ({ ...c, classNum: 9 })),
    ...(entry.class10?.chapters || []).map(c => ({ ...c, classNum: 10 })),
  ];

  console.log(`📚 ${subjectName} — ${allChapters.length} chapters`);

  for (const chapter of allChapters) {
    process.stdout.write(`  Class ${chapter.classNum} Ch ${chapter.id}: ${chapter.name}...`);

    try {
      const noteData = await generateSindhNote(subjectName, chapter, chapter.classNum);
      const filename = `Sindh-${subjectName.replace(/\s+/g, '-')}_${chapter.classNum}_${chapter.id}.json`;
      const row = {
        subject: subjectName,
        board: 'sindh',
        class: chapter.classNum,
        chapter_id: chapter.id,
        chapter_name: chapter.name,
        note_data: noteData,
        created_at: new Date().toISOString(),
      };
      fs.writeFileSync(path.join(notesDir, filename), JSON.stringify(row, null, 2));
      console.log(` ✓ ${noteData.keyPoints?.length || 0} points, ${noteData.definitions?.length || 0} defs`);
      total++;
      await new Promise(r => setTimeout(r, 2500)); // 2.5s delay — safe for parallel runs
    } catch (err) {
      console.log(` ❌ ${err.message}`);
      failed++;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  console.log('');
}

console.log('═══════════════════════════════════════════');
console.log(`  DONE: ${total} notes, ${failed} failed`);
console.log('═══════════════════════════════════════════');
