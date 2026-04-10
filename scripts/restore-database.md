# NewWorldEdu — One-Click Restore Guide

If everything goes down, follow these steps to restore from zero.

## Prerequisites
- Node.js installed
- Git installed
- A Supabase account (free tier works)
- A Vercel account
- The latest backup folder from Desktop (newworld-backup-YYYY-MM-DD)

---

## Step 1: Get the code

```bash
git clone https://github.com/khurrambadar3125/newworld-education.git
cd newworld-education
npm install
```

## Step 2: Create new Supabase project

1. Go to supabase.com → New Project
2. Name: "newworld-platform"
3. Region: closest to Pakistan (Singapore or Mumbai)
4. Save the new: SUPABASE_URL, SUPABASE_SECRET_KEY, SUPABASE_PUBLISHABLE_KEY

## Step 3: Create tables

Go to Supabase SQL Editor and run the table creation SQL.
The most critical table is question_bank:

```sql
CREATE TABLE question_bank (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  level TEXT NOT NULL,
  topic TEXT,
  difficulty TEXT DEFAULT 'medium',
  type TEXT DEFAULT 'mcq',
  curriculum TEXT DEFAULT 'cambridge',
  question_text TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT,
  mark_scheme TEXT,
  marks INT DEFAULT 1,
  command_word TEXT,
  source TEXT,
  verified BOOLEAN DEFAULT false,
  times_served INT DEFAULT 0,
  times_correct INT DEFAULT 0,
  avg_score FLOAT DEFAULT 0,
  quality_score FLOAT DEFAULT 0.5,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  session TEXT,
  paper TEXT,
  image_url TEXT,
  source_page TEXT
);
```

Create similar tables for all others (see backup JSON files for column structure).

## Step 4: Import data from backup

```bash
# Set env vars
export SUPABASE_URL="your-new-url"
export SUPABASE_SECRET_KEY="your-new-key"

# Import each table
node -e "
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
const data = JSON.parse(fs.readFileSync('path/to/backup/question_bank.json'));
async function restore() {
  for (let i = 0; i < data.length; i += 100) {
    const batch = data.slice(i, i + 100);
    const { error } = await sb.from('question_bank').insert(batch);
    if (error) console.log('Error at', i, error.message);
    else process.stdout.write('.');
  }
  console.log('Done:', data.length, 'rows');
}
restore();
"
```

Repeat for each table JSON file.

## Step 5: Enable RLS

```sql
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "service_role_full" ON %I FOR ALL USING (auth.role() = ''service_role'') WITH CHECK (auth.role() = ''service_role'')', t);
  END LOOP;
END $$;
```

## Step 6: Set up environment variables

Create `.env.vercel` with all keys:
```
SUPABASE_URL=...
SUPABASE_SECRET_KEY=...
ANTHROPIC_API_KEY=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_SECRET=...
RESEND_API_KEY=...
DASHBOARD_ADMIN_PASSWORD=...
CRON_SECRET=...
```

## Step 7: Deploy to Vercel

```bash
npx vercel --prod
```

Or connect the GitHub repo to Vercel dashboard for auto-deploy.

## Step 8: Set DNS

Point newworld.education to the new Vercel deployment.

## Step 9: Verify

```bash
curl https://www.newworld.education/api/health
```

---

## Emergency contacts
- Vercel: vercel.com/support
- Supabase: supabase.com/support
- Anthropic: console.anthropic.com
- Domain registrar: wherever newworld.education is registered
