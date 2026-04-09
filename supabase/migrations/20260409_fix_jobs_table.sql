-- Fix jobs table primary key and constraints
-- Run this in Supabase SQL Editor if you get "duplicate key" errors

-- Option 1: If jobs table exists but has constraint issues, check structure
-- SELECT * FROM information_schema.columns WHERE table_name = 'jobs' ORDER BY ordinal_position;

-- Option 2: Ensure id is auto-incrementing primary key
-- This won't work if table already has data, but here's what the schema should look like:
/*
CREATE TABLE IF NOT EXISTS jobs (
  id BIGSERIAL PRIMARY KEY,
  employer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employer_auth_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  budget_type TEXT DEFAULT 'fixed',
  job_type TEXT DEFAULT 'full-time',
  experience_level TEXT DEFAULT 'entry',
  duration TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT jobs_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
*/

-- Option 3: If you're getting duplicate key errors, check for duplicate IDs
-- SELECT id, COUNT(*) FROM jobs GROUP BY id HAVING COUNT(*) > 1;

-- Option 4: If the id sequence is out of sync, reset it
-- SELECT setval('jobs_id_seq', (SELECT MAX(id) FROM jobs) + 1);
