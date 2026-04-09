-- Create Disputes Table
CREATE TABLE IF NOT EXISTS disputes (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  contract_id INTEGER REFERENCES contracts(id) ON DELETE CASCADE,
  initiated_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  against_user INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  reason VARCHAR(100) NOT NULL CHECK (reason IN ('quality_issue', 'missed_deadline', 'non_payment', 'scope_change', 'communication', 'other')),
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved', 'escalated', 'closed')),
  resolution TEXT,
  resolved_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Dispute Evidence Table for file uploads
CREATE TABLE IF NOT EXISTS dispute_evidence (
  id SERIAL PRIMARY KEY,
  dispute_id INTEGER NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_url VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Dispute Messages Table for discussion
CREATE TABLE IF NOT EXISTS dispute_messages (
  id SERIAL PRIMARY KEY,
  dispute_id INTEGER NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_disputes_job_id ON disputes(job_id);
CREATE INDEX IF NOT EXISTS idx_disputes_initiated_by ON disputes(initiated_by);
CREATE INDEX IF NOT EXISTS idx_disputes_against_user ON disputes(against_user);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_created_at ON disputes(created_at);

CREATE INDEX IF NOT EXISTS idx_dispute_evidence_dispute_id ON dispute_evidence(dispute_id);
CREATE INDEX IF NOT EXISTS idx_dispute_messages_dispute_id ON dispute_messages(dispute_id);

-- Enable RLS
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Disputes
CREATE POLICY "Users can view disputes they are involved in"
ON disputes FOR SELECT
USING (auth.uid()::integer = initiated_by OR auth.uid()::integer = against_user);

CREATE POLICY "System can create disputes"
ON disputes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update disputes they initiated"
ON disputes FOR UPDATE
USING (auth.uid()::integer = initiated_by);

-- RLS Policies for Dispute Evidence
CREATE POLICY "Users can view evidence from disputes they're involved in"
ON dispute_evidence FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM disputes
    WHERE disputes.id = dispute_evidence.dispute_id
    AND (auth.uid()::integer = disputes.initiated_by OR auth.uid()::integer = disputes.against_user)
  )
);

CREATE POLICY "Users can upload evidence to their disputes"
ON dispute_evidence FOR INSERT
WITH CHECK (
  auth.uid()::integer = user_id AND
  EXISTS (
    SELECT 1 FROM disputes
    WHERE disputes.id = dispute_evidence.dispute_id
    AND (auth.uid()::integer = disputes.initiated_by OR auth.uid()::integer = disputes.against_user)
  )
);

-- RLS Policies for Dispute Messages
CREATE POLICY "Users can view messages from disputes they're involved in"
ON dispute_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM disputes
    WHERE disputes.id = dispute_messages.dispute_id
    AND (auth.uid()::integer = disputes.initiated_by OR auth.uid()::integer = disputes.against_user)
  )
);

CREATE POLICY "Users can add messages to disputes they're involved in"
ON dispute_messages FOR INSERT
WITH CHECK (
  auth.uid()::integer = user_id AND
  EXISTS (
    SELECT 1 FROM disputes
    WHERE disputes.id = dispute_messages.dispute_id
    AND (auth.uid()::integer = disputes.initiated_by OR auth.uid()::integer = disputes.against_user)
  )
);
