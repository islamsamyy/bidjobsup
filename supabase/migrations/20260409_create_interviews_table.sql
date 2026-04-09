-- Create Interviews/Scheduling Table
CREATE TABLE IF NOT EXISTS interviews (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  contract_id INTEGER REFERENCES contracts(id) ON DELETE CASCADE,
  freelancer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled')),
  meeting_url VARCHAR(500),
  meeting_platform VARCHAR(50),
  notes TEXT,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Interview Notes Table
CREATE TABLE IF NOT EXISTS interview_notes (
  id SERIAL PRIMARY KEY,
  interview_id INTEGER NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_interviews_job_id ON interviews(job_id);
CREATE INDEX IF NOT EXISTS idx_interviews_freelancer_id ON interviews(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_interviews_employer_id ON interviews(employer_id);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled_time ON interviews(scheduled_time);

CREATE INDEX IF NOT EXISTS idx_interview_notes_interview_id ON interview_notes(interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_notes_user_id ON interview_notes(user_id);

-- Enable RLS
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Interviews
CREATE POLICY "Users can view their own interviews"
ON interviews FOR SELECT
USING (auth.uid()::integer = freelancer_id OR auth.uid()::integer = employer_id);

CREATE POLICY "System can create interviews"
ON interviews FOR INSERT
WITH CHECK (true);

CREATE POLICY "Both parties can update their interviews"
ON interviews FOR UPDATE
USING (auth.uid()::integer = freelancer_id OR auth.uid()::integer = employer_id);

-- RLS Policies for Interview Notes
CREATE POLICY "Users can view notes from their interviews"
ON interview_notes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM interviews
    WHERE interviews.id = interview_notes.interview_id
    AND (auth.uid()::integer = interviews.freelancer_id OR auth.uid()::integer = interviews.employer_id)
  )
);

CREATE POLICY "Users can add notes to their interviews"
ON interview_notes FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM interviews
    WHERE interviews.id = interview_notes.interview_id
    AND (auth.uid()::integer = interviews.freelancer_id OR auth.uid()::integer = interviews.employer_id)
  )
);
