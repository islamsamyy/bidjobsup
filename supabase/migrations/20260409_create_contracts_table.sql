-- Create Contracts Table
CREATE TABLE IF NOT EXISTS contracts (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  freelancer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled', 'disputed')),
  start_date DATE,
  end_date DATE,
  deadline DATE,
  milestone_count INTEGER DEFAULT 0,
  paid_amount DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Milestones Table
CREATE TABLE IF NOT EXISTS milestones (
  id SERIAL PRIMARY KEY,
  contract_id INTEGER NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'approved', 'paid', 'disputed')),
  due_date DATE,
  completed_date DATE,
  submission_notes TEXT,
  approval_notes TEXT,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_contracts_job_id ON contracts(job_id);
CREATE INDEX IF NOT EXISTS idx_contracts_freelancer_id ON contracts(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_employer_id ON contracts(employer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);

CREATE INDEX IF NOT EXISTS idx_milestones_contract_id ON milestones(contract_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones(status);

-- Enable RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Contracts
CREATE POLICY "Users can view their own contracts"
ON contracts FOR SELECT
USING (auth.uid()::integer = freelancer_id OR auth.uid()::integer = employer_id);

CREATE POLICY "Both parties can view contract details"
ON contracts FOR SELECT
USING (auth.uid()::integer = freelancer_id OR auth.uid()::integer = employer_id);

CREATE POLICY "System can create contracts"
ON contracts FOR INSERT
WITH CHECK (true);

CREATE POLICY "Both parties can update their contracts"
ON contracts FOR UPDATE
USING (auth.uid()::integer = freelancer_id OR auth.uid()::integer = employer_id);

-- RLS Policies for Milestones
CREATE POLICY "Users can view milestones of their contracts"
ON milestones FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM contracts
    WHERE contracts.id = milestones.contract_id
    AND (auth.uid()::integer = contracts.seeker_id OR auth.uid()::integer = contracts.employer_id)
  )
);

CREATE POLICY "System can insert milestones"
ON milestones FOR INSERT
WITH CHECK (true);

CREATE POLICY "Both parties can update milestones"
ON milestones FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM contracts
    WHERE contracts.id = milestones.contract_id
    AND (auth.uid()::integer = contracts.seeker_id OR auth.uid()::integer = contracts.employer_id)
  )
);
