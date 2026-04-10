---
name: seed-bank
description: Seed verified questions from CSV/JSON/PDF files into the Supabase question_bank table. Use when uploading new question content to the platform.
allowed-tools: Bash(node *) Bash(ls *) Bash(wc *) Bash(head *) Bash(cat *) Read Grep Glob
---

# Seed Question Bank

Upload verified questions from local files into the Supabase `question_bank` table.

## RULES
- NEVER use AI to generate questions. Only seed from verified source files.
- ALWAYS preview the file format before seeding (head/sample).
- ALWAYS report: total parsed, total saved, total errors.
- ALWAYS use `mark_scheme` field for explanations (NOT `explanation` — that column doesn't exist).
- Load env vars from `.env.vercel`: `export $(grep -E '^SUPABASE_' .env.vercel | xargs)`
- Use `@supabase/supabase-js` client for inserts (NOT raw fetch — it fails on batch).
- Batch size: 100 rows per insert.
- Tag `source` field with the origin (e.g., 'sanfoundry', 'iba', 'cambridge_pp').
- Set `verified: true` and `quality_score: 0.8` for verified sources.

## STEPS

1. **Ask**: What file(s) to seed? What subject/curriculum/level to tag?
2. **Preview**: Read first 20-30 lines to understand the format.
3. **Parse**: Write a Node.js parser for the specific format (CSV, JSON, multi-line text).
4. **Validate**: Check parsed count, show 2-3 sample questions.
5. **Confirm**: Show total count and tags before inserting.
6. **Seed**: Insert in batches of 100 via Supabase client.
7. **Report**: Total saved, errors, new bank total.

## SUPPORTED FORMATS

### Sanfoundry CSV (multi-line blocks)
```
index,"
1. Question text?
a) Option A
b) Option B
c) Option C
d) Option D
View AnswerAnswer: b
Explanation: Why b is correct."
```

### Simple CSV (comma-separated)
```
question,optA,optB,optC,optD,correct
```

### JSON array
```json
[{"question":"text","options":{"A":"","B":"","C":"","D":""},"correct":"B"}]
```

## REQUIRED FIELDS FOR question_bank TABLE
```
subject, level, topic, difficulty, type, curriculum,
question_text, options (JSON), correct_answer,
marks, source, verified, quality_score
```

## OPTIONAL FIELDS
```
mark_scheme, command_word, session, paper, image_url, source_page
```

## CHECK AFTER SEEDING
```javascript
const { count } = await sb.from('question_bank').select('id', { count: 'exact', head: true });
console.log('Total questions in bank:', count);
```
