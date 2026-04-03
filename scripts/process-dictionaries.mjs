#!/usr/bin/env node
/**
 * scripts/process-dictionaries.mjs — Process Kaikki.org JSONL dictionary files
 * ─────────────────────────────────────────────────────────────────
 * Usage: node scripts/process-dictionaries.mjs /path/to/kaikki.org-dictionary-French.jsonl
 *
 * Reads JSONL, extracts: word, pronunciation, part of speech, definitions
 * Saves to Supabase dictionary_bank table
 * Prioritizes common words (shorter = more common generally)
 */

import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { basename } from 'path';
import { config } from 'dotenv';

config({ path: '.env.vercel' });
config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) { console.error('Missing SUPABASE env'); process.exit(1); }

// ── Topic classification based on glosses ──────────────────────────
function classifyTopic(glosses) {
  const text = (glosses || []).join(' ').toLowerCase();
  if (/food|eat|drink|cook|fruit|vegetable|meat|bread|rice|milk|coffee|tea|restaurant|kitchen/.test(text)) return 'Food & Drink';
  if (/family|mother|father|sister|brother|child|parent|wife|husband|baby/.test(text)) return 'Family';
  if (/house|room|door|window|bed|table|chair|home|apartment|building/.test(text)) return 'Home';
  if (/body|head|hand|foot|eye|ear|mouth|heart|blood|health|sick|doctor/.test(text)) return 'Body & Health';
  if (/school|study|learn|teach|book|write|read|class|student|teacher/.test(text)) return 'Education';
  if (/work|job|office|money|pay|buy|sell|business|company/.test(text)) return 'Work & Business';
  if (/travel|car|bus|train|plane|road|city|country|hotel|airport/.test(text)) return 'Travel';
  if (/time|day|week|month|year|hour|morning|evening|night|today|tomorrow/.test(text)) return 'Time';
  if (/weather|rain|sun|hot|cold|wind|snow|cloud|sky/.test(text)) return 'Weather & Nature';
  if (/color|red|blue|green|white|black|yellow|big|small|tall|short/.test(text)) return 'Descriptions';
  if (/number|one|two|three|first|second|count|math/.test(text)) return 'Numbers';
  if (/cloth|wear|shirt|dress|shoe|hat|coat/.test(text)) return 'Clothing';
  if (/animal|dog|cat|bird|fish|horse/.test(text)) return 'Animals';
  if (/say|speak|tell|ask|answer|call|word|language/.test(text)) return 'Communication';
  if (/feel|happy|sad|angry|love|hate|afraid|hope/.test(text)) return 'Emotions';
  return 'General';
}

// ── Difficulty based on word length + frequency signals ──────────────
function classifyDifficulty(word, pos, glosses) {
  const len = word.length;
  const text = (glosses || []).join(' ');
  // Common basic words tend to be shorter
  if (len <= 4 && /^(noun|verb|adj|adv|pron|det|prep|conj|num)$/.test(pos)) return 'easy';
  if (len <= 6) return 'easy';
  if (len <= 10) return 'medium';
  return 'hard';
}

// ── Batch save to Supabase ──────────────────────────────────────
async function saveBatch(rows) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/dictionary_bank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SECRET_KEY,
          'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(rows),
      });
      if (!res.ok) {
        const err = await res.text();
        if (attempt === 2) console.error(`  Save error: ${err.slice(0, 100)}`);
        else await new Promise(r => setTimeout(r, 2000));
        continue;
      }
      return rows.length;
    } catch (err) {
      if (attempt < 2) await new Promise(r => setTimeout(r, 3000));
      else console.error(`  Fetch error: ${err.message.slice(0, 60)}`);
    }
  }
  return 0;
}

// ── Main ──────────────────────────────────────
async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.log('Usage: node scripts/process-dictionaries.mjs /path/to/kaikki.org-dictionary-French.jsonl');
    process.exit(1);
  }

  // Detect language from filename
  const fileName = basename(filePath);
  const langMatch = fileName.match(/dictionary-(\w+)/);
  const language = langMatch ? langMatch[1] : 'Unknown';

  console.log(`\nProcessing: ${fileName}`);
  console.log(`Language: ${language}\n`);

  const rl = createInterface({ input: createReadStream(filePath), crlfDelay: Infinity });

  let batch = [];
  let total = 0;
  let saved = 0;
  let skipped = 0;
  const BATCH_SIZE = 100;
  const MAX_ENTRIES = 50000; // Limit per language to keep bank manageable

  for await (const line of rl) {
    if (total >= MAX_ENTRIES) break;

    try {
      const entry = JSON.parse(line);

      // Skip entries without useful data
      if (!entry.word || !entry.senses?.length) { skipped++; continue; }

      // Extract glosses (English definitions)
      const glosses = [];
      for (const sense of entry.senses) {
        if (sense.glosses) glosses.push(...sense.glosses);
      }
      if (glosses.length === 0) { skipped++; continue; }

      // Skip very long words (usually technical/compound)
      if (entry.word.length > 30) { skipped++; continue; }

      // Extract pronunciation
      let pronunciation = null;
      if (entry.sounds) {
        const ipa = entry.sounds.find(s => s.ipa);
        if (ipa) pronunciation = ipa.ipa;
      }

      const pos = entry.pos || null;
      const topic = classifyTopic(glosses);
      const difficulty = classifyDifficulty(entry.word, pos, glosses);

      batch.push({
        word: entry.word,
        language,
        lang_code: entry.lang_code || language.toLowerCase().slice(0, 2),
        pos,
        pronunciation,
        glosses: glosses.slice(0, 5), // Max 5 definitions
        etymology: entry.etymology_text?.slice(0, 200) || null,
        difficulty,
        topic,
      });

      total++;

      if (batch.length >= BATCH_SIZE) {
        const count = await saveBatch(batch);
        saved += count;
        batch = [];
        if (total % 5000 === 0) {
          console.log(`  ${total} processed, ${saved} saved, ${skipped} skipped`);
        }
        // Small delay to avoid overwhelming Supabase
        await new Promise(r => setTimeout(r, 100));
      }
    } catch {
      skipped++;
    }
  }

  // Save remaining batch
  if (batch.length > 0) {
    const count = await saveBatch(batch);
    saved += count;
  }

  console.log(`\n=== ${language}: ${saved} words saved (${skipped} skipped) ===\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
