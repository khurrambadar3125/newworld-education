-- ============================================================
-- leads — Email lead capture for NewWorldEdu growth engine
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS leads (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  grade       TEXT,                          -- 'O Level', 'A Level', 'Grade 5', etc.
  subject     TEXT,                          -- Primary subject interest
  country     TEXT DEFAULT 'Pakistan',
  source      TEXT NOT NULL DEFAULT 'organic', -- free_test, school_demo, referral, social, organic
  status      TEXT DEFAULT 'new',             -- new, welcomed, engaged, converted, unsubscribed

  -- Drip sequence tracking
  welcome_sent    BOOLEAN DEFAULT FALSE,
  drip_step       INTEGER DEFAULT 0,         -- 0=not started, 1-5=which email sent
  last_drip_at    TIMESTAMPTZ,

  -- Engagement
  test_completed  BOOLEAN DEFAULT FALSE,
  test_score      INTEGER,
  sessions_count  INTEGER DEFAULT 0,
  converted_at    TIMESTAMPTZ,               -- When they signed up for real

  -- Timestamps
  captured_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads (source);
CREATE INDEX IF NOT EXISTS idx_leads_drip ON leads (drip_step, status);
CREATE INDEX IF NOT EXISTS idx_leads_grade ON leads (grade);

-- RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON leads
  FOR ALL USING (true) WITH CHECK (true);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_leads_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_timestamp();
