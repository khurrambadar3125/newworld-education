-- ============================================================
-- question_bank — Structured Question Bank for NewWorldEdu
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS question_bank (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Classification
  subject       TEXT NOT NULL,
  level         TEXT NOT NULL,              -- 'O Level', 'A Level', 'KG', 'Grade 1', etc.
  topic         TEXT NOT NULL,
  difficulty    TEXT NOT NULL DEFAULT 'medium', -- easy, medium, hard
  type          TEXT NOT NULL DEFAULT 'mcq',    -- mcq, structured, extended
  curriculum    TEXT NOT NULL DEFAULT 'cambridge', -- cambridge, ib, cbse, snc, uae_moe, emsat

  -- Question content
  question_text TEXT NOT NULL,
  options       JSONB,                      -- MCQ: {"A":"...","B":"...","C":"...","D":"..."}
  correct_answer TEXT NOT NULL,             -- MCQ: "B", Structured: model answer text
  mark_scheme   TEXT,                       -- What earns marks
  marks         INTEGER NOT NULL DEFAULT 1,
  command_word  TEXT,                       -- explain, describe, evaluate, etc.

  -- Provenance
  source        TEXT NOT NULL DEFAULT 'ai_generated', -- ai_generated, examiner_curated, past_paper, live_capture
  verified      BOOLEAN DEFAULT FALSE,

  -- Performance tracking (updated as students use questions)
  times_served  INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  avg_score     REAL DEFAULT 0,             -- Running average: score/maxScore across all attempts
  quality_score REAL DEFAULT 0.5,           -- 0-1, auto-calculated. 0.3-0.7 correct rate = good calibration

  -- Timestamps
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes for fast lookups ──────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_qb_subject_level ON question_bank (subject, level);
CREATE INDEX IF NOT EXISTS idx_qb_topic ON question_bank (topic);
CREATE INDEX IF NOT EXISTS idx_qb_difficulty ON question_bank (difficulty);
CREATE INDEX IF NOT EXISTS idx_qb_type ON question_bank (type);
CREATE INDEX IF NOT EXISTS idx_qb_curriculum ON question_bank (curriculum);
CREATE INDEX IF NOT EXISTS idx_qb_quality ON question_bank (quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_qb_source ON question_bank (source);
CREATE INDEX IF NOT EXISTS idx_qb_subject_topic_diff ON question_bank (subject, topic, difficulty);

-- ── RLS (Row Level Security) ──────────────────────────────────
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;

-- Service role (our API) can do everything
CREATE POLICY "Service role full access" ON question_bank
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ── Auto-update updated_at ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_question_bank_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER question_bank_updated
  BEFORE UPDATE ON question_bank
  FOR EACH ROW
  EXECUTE FUNCTION update_question_bank_timestamp();

-- ── Quality score auto-calculation ────────────────────────────
-- Quality = how well-calibrated the question is
-- Best questions have 30-70% correct rate (not too easy, not too hard)
CREATE OR REPLACE FUNCTION calculate_quality_score()
RETURNS TRIGGER AS $$
DECLARE
  correct_rate REAL;
BEGIN
  IF NEW.times_served >= 3 THEN
    correct_rate := NEW.times_correct::REAL / NEW.times_served::REAL;
    -- Bell curve centered at 0.5: questions where ~50% get it right = highest quality
    -- score = 1 - 2*|rate - 0.5| but floored at 0.1
    NEW.quality_score := GREATEST(0.1, 1.0 - 2.0 * ABS(correct_rate - 0.5));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER question_bank_quality
  BEFORE UPDATE ON question_bank
  FOR EACH ROW
  WHEN (NEW.times_served IS DISTINCT FROM OLD.times_served)
  EXECUTE FUNCTION calculate_quality_score();
