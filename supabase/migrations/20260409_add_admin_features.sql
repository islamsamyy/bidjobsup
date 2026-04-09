-- Add admin role to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));

-- Add moderation fields to jobs
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS flagged BOOLEAN DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS moderation_status VARCHAR(20) DEFAULT 'approved' CHECK (moderation_status IN ('approved', 'pending', 'rejected'));

-- Create reports table for content flagging
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  reported_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_type VARCHAR(50) NOT NULL, -- 'job', 'user', 'review', 'comment'
  reported_id INTEGER NOT NULL,
  reason VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_jobs_flagged ON jobs(flagged);
CREATE INDEX IF NOT EXISTS idx_jobs_moderation_status ON jobs(moderation_status);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reports
CREATE POLICY "Users can view reports they made"
ON reports FOR SELECT
USING (auth.uid()::integer = reported_by);

CREATE POLICY "System can create reports"
ON reports FOR INSERT
WITH CHECK (true);
