-- NewWorld Education: Self-Improving Learning Loop Tables
-- Run this in Supabase SQL Editor

-- 1. Strategy signals — captures what teaching techniques Starky used and how students responded
CREATE TABLE IF NOT EXISTS strategy_signals (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL DEFAULT 'anonymous',
  subject text,
  grade text,
  strategies text[] DEFAULT '{}',       -- e.g. {'game', 'analogy', 'socratic'}
  engagement text DEFAULT 'unknown',     -- high, medium, low, unknown
  session_number int DEFAULT 1,
  message_index int DEFAULT 0,
  starky_preview text,                   -- first 300 chars of Starky's response
  user_preview text,                     -- first 200 chars of user's response
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_strategy_signals_created ON strategy_signals(created_at);
CREATE INDEX IF NOT EXISTS idx_strategy_signals_grade ON strategy_signals(grade);
CREATE INDEX IF NOT EXISTS idx_strategy_signals_engagement ON strategy_signals(engagement);

-- 2. Teaching insights — deep session analysis from Claude after every completed session
CREATE TABLE IF NOT EXISTS teaching_insights (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL,
  grade text,
  subject text,
  what_worked text[] DEFAULT '{}',        -- techniques that got good engagement
  what_didnt_work text[] DEFAULT '{}',    -- techniques that fell flat
  learning_style text DEFAULT 'mixed',    -- visual, auditory, kinesthetic, reading, mixed
  engagement_peaks text[] DEFAULT '{}',   -- moments of peak engagement
  suggested_approach text,                -- best approach for this student next time
  engagement_level text DEFAULT 'medium', -- high, medium, low
  mood text DEFAULT 'neutral',
  accuracy int,
  is_sen boolean DEFAULT false,
  sen_type text,
  session_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teaching_insights_created ON teaching_insights(created_at);
CREATE INDEX IF NOT EXISTS idx_teaching_insights_email ON teaching_insights(email);
CREATE INDEX IF NOT EXISTS idx_teaching_insights_grade ON teaching_insights(grade);

-- 3. Add new columns to student_preferences (if table already exists)
-- These store the learned per-student teaching profile
DO $$
BEGIN
  ALTER TABLE student_preferences ADD COLUMN IF NOT EXISTS learning_style text DEFAULT 'mixed';
  ALTER TABLE student_preferences ADD COLUMN IF NOT EXISTS effective_techniques text[] DEFAULT '{}';
  ALTER TABLE student_preferences ADD COLUMN IF NOT EXISTS suggested_approach text DEFAULT '';
EXCEPTION WHEN undefined_table THEN
  CREATE TABLE student_preferences (
    email text PRIMARY KEY,
    preferred_language text,
    difficulty_level text,
    weak_topics jsonb DEFAULT '[]',
    learning_style text DEFAULT 'mixed',
    effective_techniques text[] DEFAULT '{}',
    suggested_approach text DEFAULT '',
    updated_at timestamptz DEFAULT now()
  );
END $$;

-- 4. KV backup table — nightly backup of all Redis data into Postgres
CREATE TABLE IF NOT EXISTS kv_backups (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  backup_date date NOT NULL,
  kv_key text NOT NULL,
  kv_value text,
  category text DEFAULT 'other',       -- memory, subscriber, session, session_index, system
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kv_backups_date ON kv_backups(backup_date);
CREATE INDEX IF NOT EXISTS idx_kv_backups_category ON kv_backups(category);
CREATE INDEX IF NOT EXISTS idx_kv_backups_key ON kv_backups(kv_key);
