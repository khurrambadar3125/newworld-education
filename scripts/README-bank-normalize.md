# Bank Tag Normalization

One-off migration script: `scripts/normalize-bank-tags.mjs`

## What it does

Cleans up inconsistent `subject` and `level` values in the `question_bank` Supabase table so they match what the user-facing pages (subject pickers, filters, study plan APIs) actually send as query parameters.

Two passes:

1. **Level normalization** — collapses variants like `AS / A Level`, `alevel`, `a-level`, `IGCSE`, `o_level` into the canonical forms `A Level` and `O Level`.
2. **Subject normalization** — collapses variants like `Maths`/`Math` → `Mathematics`, `Islamiat` → `Islamiyat` (Cambridge canonical), `Pak Studies` → `Pakistan Studies`, `CS` → `Computer Science`, `Add Math` → `Additional Mathematics`, `Business` → `Business Studies`.
3. **Migrate `cambridge_test_answers`** — if that table has rows, they are batch-inserted (500 at a time) into `question_bank` with `verified: true`, `curriculum: 'cambridge'`, and `source: 'cambridge_test_answers_migration'`.

The script prints distinct levels and the first 20 distinct subjects before mutating anything, so you can sanity-check the picture first.

## Required env vars

```
SUPABASE_URL                  # or NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_KEY          # or SUPABASE_SERVICE_ROLE_KEY  (NOT the anon key — needs write)
```

Pull from `.env.vercel` or set inline.

## Dry-run (preview without writing)

The script as written **does** mutate. To preview only, edit each block from:

```js
const { count, error } = await sb
  .from('question_bank')
  .update({ level: newLevel })
  .eq('level', oldLevel)
  .select('id', { count: 'exact', head: true });
```

to:

```js
const { count, error } = await sb
  .from('question_bank')
  .select('id', { count: 'exact', head: true })
  .eq('level', oldLevel);
```

(i.e. drop `.update(...)` and just count rows that *would* be touched). Same pattern for the subject loop.

For the `cambridge_test_answers` migration block, comment out the `sb.from('question_bank').insert(transformed)` call — the rest will still log counts and a sample row.

## Backup before running

ALWAYS take a fresh backup first. From the repo root:

```
node scripts/backup-database.mjs
```

This dumps `question_bank` (and other core tables) to a timestamped file. See `reference_backup_restore.md` in memory for the restore path. The weekly backup may be stale — run a fresh one immediately before this migration.

## Run

```
node scripts/normalize-bank-tags.mjs
```

Single pass. It is idempotent — running it twice is safe (the second pass will report 0 fixes for already-normalized rows). The `cambridge_test_answers` migration is **not** idempotent on its own (will create duplicates if re-run while that source table still has rows). After a successful migration you should either:

- truncate `cambridge_test_answers`, or
- gate the migration block behind a `--migrate-cambridge` CLI flag before re-running.

## Expected outcomes

- `Distinct levels` shrinks to roughly: `['O Level', 'A Level', 'KG', 'Matric', 'SAT', 'GMAT', 'SEN', ...]` — no dashes, underscores, or `IGCSE`/`AS / A Level` variants left.
- `Distinct subjects` shows canonical Cambridge spellings — `Mathematics` not `Maths`, `Islamiyat` not `Islamiat`, `Computer Science` not `CS`.
- Total row count stays the same for the normalization pass (updates only).
- Total row count grows by however many rows were in `cambridge_test_answers` after the migration block.
- Subject pickers on `/sat`, `/o-level`, `/a-level`, `/mite-portal`, `/sen`, etc. should stop showing empty results that were caused by label mismatch (e.g. picker sends `Mathematics` but bank stored `Maths`).

## Post-run verification

```sql
select level, count(*) from question_bank group by level order by 2 desc;
select subject, count(*) from question_bank group by subject order by 2 desc limit 30;
```

Spot-check that no legacy variants remain. If any do, add them to `LEVEL_MAP` / `SUBJECT_MAP` and re-run.
