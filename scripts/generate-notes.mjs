#!/usr/bin/env node
/**
 * scripts/generate-notes.mjs — Nano Notes Generator
 * ─────────────────────────────────────────────────────────────────
 * Generates exam-focused revision notes for every chapter in SYLLABUS.
 * Uses Sonnet to create notes that combine:
 * - Mark scheme keywords from cambridgeExaminer.js
 * - Common mistakes from examiner reports
 * - Model answers from our question bank
 * - Key definitions in exact mark-scheme language
 *
 * Output: Inserts into Supabase `nano_notes` table
 *
 * Usage:
 *   node scripts/generate-notes.mjs --subject Chemistry
 *   node scripts/generate-notes.mjs --subject "Pakistan Studies"
 *   node scripts/generate-notes.mjs --all
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// ── Config ──────────────────────────────────────────────────────
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;
const MODEL = 'claude-sonnet-4-20250514'; // Sonnet for quality note generation

if (!ANTHROPIC_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SECRET_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Load SYLLABUS ───────────────────────────────────────────────
// Dynamic import of ESM module
const syllabusPath = path.join(process.cwd(), 'utils/syllabusStructure.js');
const syllabusModule = await import(syllabusPath);
const { SYLLABUS } = syllabusModule;

// ── Parse args ──────────────────────────────────────────────────
const args = process.argv.slice(2);
const subjectArg = args.find((_, i) => args[i - 1] === '--subject');
const doAll = args.includes('--all');
const dryRun = args.includes('--dry-run');

if (!subjectArg && !doAll) {
  console.log('Usage: node scripts/generate-notes.mjs --subject Chemistry');
  console.log('       node scripts/generate-notes.mjs --all');
  console.log('       Add --dry-run to preview without saving');
  process.exit(0);
}

const subjects = doAll ? Object.keys(SYLLABUS) : [subjectArg];

// ── Fetch existing questions for a topic (for model answers) ────
async function getTopicQuestions(subject, topicKeywords, limit = 5) {
  try {
    let query = supabase
      .from('question_bank')
      .select('question, correct_answer, mark_scheme, type, difficulty, source_paper')
      .eq('subject', subject)
      .eq('verified', true)
      .limit(limit);

    const { data } = await query;
    if (!data || data.length === 0) return [];

    // Filter by topic keywords
    return data.filter(q => {
      const text = (q.question || '').toLowerCase();
      return topicKeywords.some(kw => text.includes(kw.toLowerCase()));
    }).slice(0, 3);
  } catch { return []; }
}

// ── Call Sonnet to generate a note ──────────────────────────────
async function generateNote(subject, code, chapter, keywords, sampleQuestions) {
  const questionsContext = sampleQuestions.length > 0
    ? `\n\nSAMPLE QUESTIONS FROM OUR BANK FOR THIS TOPIC:\n${sampleQuestions.map((q, i) =>
        `Q${i + 1} (${q.type}, ${q.difficulty}): ${q.question}\nAnswer: ${q.correct_answer}\nMark scheme: ${q.mark_scheme || 'N/A'}\nSource: ${q.source_paper || 'Past paper'}`
      ).join('\n\n')}`
    : '';

  const prompt = `You are a Cambridge O Level ${subject} (${code}) examiner creating revision notes for Pakistani students.

Generate a concise, exam-focused Nano Note for this chapter:

SUBJECT: ${subject} (${code})
CHAPTER: ${chapter.name} (Chapter ${chapter.id})
TOPIC KEYWORDS: ${keywords.join(', ')}
${questionsContext}

Create the note in this EXACT JSON structure:
{
  "title": "${chapter.name}",
  "readTime": "8 min",
  "keyPoints": [
    "Point 1 using EXACT mark scheme language (bold the key term)",
    "Point 2...",
    "..."
  ],
  "definitions": [
    { "term": "Key Term", "definition": "Exact definition that earns the mark" }
  ],
  "howToAnswer": [
    { "commandWord": "State", "instruction": "Give one fact in one sentence. No explanation needed." },
    { "commandWord": "Explain", "instruction": "Give the point + reason using 'because' or 'this is because'" }
  ],
  "modelAnswer": {
    "question": "A real exam-style question for this topic",
    "marks": 3,
    "answer": "Full marks answer using mark scheme language",
    "markBreakdown": ["Mark 1: ...", "Mark 2: ...", "Mark 3: ..."]
  },
  "commonMistakes": [
    "Never say 'X' — always say 'Y' (from examiner reports)",
    "Students often confuse A with B...",
    "..."
  ],
  "examinerTips": [
    "This topic appears almost every year in Paper 2",
    "Always draw a labelled diagram for full marks"
  ],
  "formulas": ["formula1", "formula2"],
  "keyDiagramDescription": "Brief description of the essential diagram for this topic"
}

RULES:
1. keyPoints: 6-10 bullet points. Each point = 1 potential mark. Use EXACT Cambridge mark scheme phrases.
2. definitions: 3-5 key terms with definitions that would score full marks if asked "Define X"
3. commonMistakes: 3-5 real mistakes students make. Use examiner report language where possible.
4. modelAnswer: Write an answer that would score FULL MARKS. Show the mark allocation.
5. Everything must be exam-focused — what earns marks, what loses marks.
6. Use Pakistani context where relevant (e.g., Tarbela Dam for hydroelectric, Karachi for urban geography).
7. Keep it SHORT. This is a 2-3 page revision note, not a textbook chapter.
8. formulas: include any relevant formulas. Empty array if none.

Return ONLY valid JSON. No markdown, no explanation.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '';

  // Parse JSON from response
  try {
    // Try to find JSON in the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error(`  Failed to parse JSON for ${chapter.name}:`, e.message);
    console.error('  Response:', text.slice(0, 200));
    return null;
  }
}

// ── Save note to Supabase ───────────────────────────────────────
async function saveNote(subject, code, level, themeId, themeName, chapter, noteData) {
  const row = {
    subject,
    subject_code: code,
    level,
    theme: themeName,
    chapter_id: chapter.id,
    chapter_name: chapter.name,
    note_data: noteData,
    read_time_minutes: parseInt(noteData.readTime) || 8,
    key_points_count: noteData.keyPoints?.length || 0,
    definitions_count: noteData.definitions?.length || 0,
    mistakes_count: noteData.commonMistakes?.length || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Upsert — update if exists for this subject+chapter
  const { error } = await supabase
    .from('nano_notes')
    .upsert(row, { onConflict: 'subject,chapter_id' });

  if (error) {
    // Table might not exist yet — try creating it
    if (error.message?.includes('relation') || error.message?.includes('nano_notes') || error.code === '42P01') {
      console.error('  ⚠ nano_notes table does not exist. Creating...');
      console.error('  Run this SQL in Supabase:');
      console.error(`
  CREATE TABLE nano_notes (
    id SERIAL PRIMARY KEY,
    subject TEXT NOT NULL,
    subject_code TEXT,
    level TEXT DEFAULT 'O Level',
    theme TEXT,
    chapter_id TEXT NOT NULL,
    chapter_name TEXT NOT NULL,
    note_data JSONB NOT NULL,
    read_time_minutes INT DEFAULT 8,
    key_points_count INT DEFAULT 0,
    definitions_count INT DEFAULT 0,
    mistakes_count INT DEFAULT 0,
    views INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(subject, chapter_id)
  );
  ALTER TABLE nano_notes ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Anyone can read notes" ON nano_notes FOR SELECT USING (true);
      `);
      // Fallback: save to local file
      const fallbackPath = path.join(process.cwd(), 'data', 'nano-notes');
      fs.mkdirSync(fallbackPath, { recursive: true });
      const filename = `${subject.replace(/\s+/g, '-')}_${chapter.id}.json`;
      fs.writeFileSync(path.join(fallbackPath, filename), JSON.stringify(row, null, 2));
      console.log(`  💾 Saved to data/nano-notes/${filename} (Supabase fallback)`);
      return true;
    }
    console.error(`  ❌ Save error: ${error.message}`);
    return false;
  }
  return true;
}

// ── Main ────────────────────────────────────────────────────────
console.log('');
console.log('═══════════════════════════════════════════');
console.log('  NANO NOTES GENERATOR');
console.log('  Model: Sonnet 4 | Subjects:', subjects.length);
console.log('═══════════════════════════════════════════');
console.log('');

let totalGenerated = 0;
let totalFailed = 0;

for (const subjectName of subjects) {
  const entry = SYLLABUS[subjectName];
  if (!entry) {
    console.error(`Subject not found in SYLLABUS: ${subjectName}`);
    continue;
  }

  const totalChapters = entry.themes.reduce((s, t) => s + t.sections.length, 0);
  console.log(`📚 ${subjectName} (${entry.code}) — ${totalChapters} chapters`);

  for (const theme of entry.themes) {
    console.log(`  📖 ${theme.name}`);

    for (const section of theme.sections) {
      process.stdout.write(`    Ch ${section.id}: ${section.name}...`);

      if (dryRun) {
        console.log(' [DRY RUN — skipped]');
        continue;
      }

      try {
        // Get sample questions from bank for this topic
        const sampleQs = await getTopicQuestions(subjectName, section.keywords);

        // Generate note with Sonnet
        const noteData = await generateNote(subjectName, entry.code, section, section.keywords, sampleQs);

        if (!noteData) {
          console.log(' ❌ failed');
          totalFailed++;
          continue;
        }

        // Save to Supabase (or local fallback)
        const saved = await saveNote(subjectName, entry.code, entry.level, theme.name, theme.name, section, noteData);

        if (saved) {
          const pts = noteData.keyPoints?.length || 0;
          const defs = noteData.definitions?.length || 0;
          const mistakes = noteData.commonMistakes?.length || 0;
          console.log(` ✓ ${pts} points, ${defs} defs, ${mistakes} warnings`);
          totalGenerated++;
        } else {
          console.log(' ❌ save failed');
          totalFailed++;
        }

        // Rate limit — 1 request per second
        await new Promise(r => setTimeout(r, 2500)); // 2.5s delay — safe for parallel runs

      } catch (err) {
        console.log(` ❌ ${err.message}`);
        totalFailed++;
        // Wait longer on errors
        await new Promise(r => setTimeout(r, 3000));
      }
    }
  }
  console.log('');
}

console.log('═══════════════════════════════════════════');
console.log(`  DONE: ${totalGenerated} notes generated, ${totalFailed} failed`);
console.log('═══════════════════════════════════════════');
