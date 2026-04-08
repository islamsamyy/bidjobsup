-- Create ATS Analysis History Table
CREATE TABLE IF NOT EXISTS ats_analysis_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  job_title VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  ats_score INTEGER NOT NULL CHECK (ats_score >= 0 AND ats_score <= 100),
  keyword_match_percentage INTEGER NOT NULL CHECK (keyword_match_percentage >= 0 AND keyword_match_percentage <= 100),
  missing_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  present_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  recommendations JSONB DEFAULT '[]'::JSONB,
  cv_version VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ats_history_user_date
ON ats_analysis_history(user_id, analysis_date DESC);

-- Create index for searching by job title
CREATE INDEX IF NOT EXISTS idx_ats_history_job_title
ON ats_analysis_history(job_title);

-- Add RLS policies
ALTER TABLE ats_analysis_history ENABLE ROW LEVEL SECURITY;

-- Users can only view their own analyses
CREATE POLICY "Users can view their own analyses"
ON ats_analysis_history FOR SELECT
USING (auth.uid()::integer = user_id);

-- Users can only insert their own analyses
CREATE POLICY "Users can create their own analyses"
ON ats_analysis_history FOR INSERT
WITH CHECK (auth.uid()::integer = user_id);

-- Users can only delete their own analyses
CREATE POLICY "Users can delete their own analyses"
ON ats_analysis_history FOR DELETE
USING (auth.uid()::integer = user_id);
