-- add-verification-columns.sql
-- Honest verification tracking for question_bank.
-- Previously: `verified` boolean conflated "human-reviewed" with "AI-stamped".
-- Now: `verified_by` tells exactly who/what verified, NULL = unverified.
--
-- HOW TO RUN:
--   Supabase Dashboard → SQL Editor → paste this file → Run
--   OR: psql <conn-string> < scripts/add-verification-columns.sql
--
-- Idempotent — safe to run multiple times.

-- ─── Add columns ───
ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS verified_by TEXT;

ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS verification_confidence SMALLINT;

-- ─── Indexes for fast serving queries ───
CREATE INDEX IF NOT EXISTS idx_question_bank_verified_by
  ON question_bank (verified_by)
  WHERE verified_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_question_bank_verified_serve
  ON question_bank (subject, level, verified_by)
  WHERE verified_by IS NOT NULL;

-- ─── Valid verified_by values (for reference — not enforced) ───
-- 'khurram_review'       → Khurram manually reviewed via /api/question-bank/save-verified
-- 'cambridge_pdf_ai'     → Extracted from Cambridge QP+MS PDF via upload-papers.mjs
--                          (source is genuine Cambridge content, answer mapping is Haiku-matched)
-- 'edexcel_pdf_ai'       → Same as above for Edexcel (future use)
-- 'external_csv'         → From third-party MCQ CSV (Sanfoundry, etc.)
-- 'textbook_bank'        → From published textbook source
-- NULL                   → Not verified (AI-generated, unknown provenance)

-- ─── Verification (not run, informational) ───
-- SELECT verified_by, COUNT(*) FROM question_bank GROUP BY verified_by;
