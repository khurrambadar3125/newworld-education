# How to upload Edexcel past papers

The pipeline at `scripts/upload-papers.mjs` is now Edexcel-aware. It auto-detects Edexcel vs Cambridge from filename patterns (and content) and tags rows accordingly:

- Cambridge → `verified_by='cambridge_pdf_ai'`, `curriculum='cambridge'`
- Edexcel → `verified_by='edexcel_pdf_ai'`, `curriculum='edexcel'`

Existing 38K Cambridge rows are untouched.

## Folder structure

Place PDFs at: `~/Desktop/past-papers/edexcel/<subject-code>/<year>-<session>-<paper>/`

Example:
- `~/Desktop/past-papers/edexcel/4MA1/2023-Jan-1F/`
  - `QP.pdf` (question paper)
  - `MS.pdf` (mark scheme)

The detector keys off the subject code in the filename (e.g. `4MA1`, `WPH01`), so as long as the code appears somewhere in the filename it will be routed to the Edexcel branch.

## Supported subjects (codes)

### iGCSE
- 4MA1 — Mathematics A
- 4MB1 — Mathematics B
- 4PM1 — Further Pure Mathematics
- 4PH1 — Physics
- 4CH1 — Chemistry
- 4BI1 — Biology
- 4HB1 — Human Biology
- 4EA1 — English Language A
- 4ET1 — English Literature
- 4EC1 — Economics
- 4BS1 — Business
- 4AC1 — Accounting
- 4CP0 — Computer Science
- 4CM1 — Commerce
- 4GE1 — Geography
- 4HI1 — History
- 4IT1 — ICT
- 4AA1 — Arabic First Language
- 4RS1 — Religious Studies

### IAL (International A Level) prefixes
- WMA — Mathematics, WFM — Further Mathematics, WPH — Physics, WCH — Chemistry, WBI — Biology
- WAC — Accounting, WGE — Geography, WHI — History, WPS — Psychology
- WEC — Economics, WBS — Business, WEN — English Language, WET — English Literature, WAR — Arabic

## Run the upload

```bash
cd /Users/khurramb/projects/newworld-platform
export $(grep -E "^(SUPABASE_URL|SUPABASE_SECRET_KEY|ANTHROPIC_API_KEY)=" .env.vercel | xargs -I{} echo {})
export SUPABASE_SERVICE_KEY="$SUPABASE_SECRET_KEY"
node scripts/upload-papers.mjs ~/Desktop/past-papers/edexcel/4MA1/**/*.pdf
```

Or pass a glob of mixed Cambridge + Edexcel PDFs — the pipeline detects each pair independently.

## Expected cost

~$0.003 per paper processed (Haiku extraction, prompt-cached). For 100 Edexcel papers ≈ $0.30.

## Verification

After upload, spot-check with:

```sql
select curriculum, verified_by, count(*)
from question_bank
where verified_by in ('cambridge_pdf_ai','edexcel_pdf_ai')
group by 1,2 order by 1,2;
```

Edexcel rows should show `curriculum='edexcel'` / `verified_by='edexcel_pdf_ai'`.

## Serving logic

`pages/api/ask.js` routes by `userProfile.curriculum`:

- `uae-british-edexcel-igcse` → Edexcel first, Cambridge fallback
- `uae-british-cambridge-olevel` → Cambridge only
- Any other `uae-*` → Edexcel first, Cambridge fallback
- Pakistan / default → no board filter
