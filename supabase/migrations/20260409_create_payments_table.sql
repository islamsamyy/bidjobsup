-- Create Payments/Transactions Table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  contract_id INTEGER REFERENCES contracts(id) ON DELETE CASCADE,
  milestone_id INTEGER REFERENCES milestones(id) ON DELETE SET NULL,
  payer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method VARCHAR(50) DEFAULT 'credit_card' CHECK (payment_method IN ('credit_card', 'bank_transfer', 'paypal', 'stripe', 'escrow')),
  stripe_payment_intent_id VARCHAR(255),
  description TEXT,
  notes TEXT,
  refunded_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Escrow Table for tracking locked funds
CREATE TABLE IF NOT EXISTS escrow (
  id SERIAL PRIMARY KEY,
  contract_id INTEGER NOT NULL UNIQUE REFERENCES contracts(id) ON DELETE CASCADE,
  payment_id INTEGER REFERENCES payments(id) ON DELETE SET NULL,
  payer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'locked' CHECK (status IN ('locked', 'released', 'refunded')),
  release_date DATE,
  released_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  payment_id INTEGER REFERENCES payments(id) ON DELETE SET NULL,
  contract_id INTEGER REFERENCES contracts(id) ON DELETE CASCADE,
  from_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  description TEXT,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled')),
  paid_at TIMESTAMP WITH TIME ZONE,
  pdf_url VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Payment Receipts Table
CREATE TABLE IF NOT EXISTS payment_receipts (
  id SERIAL PRIMARY KEY,
  payment_id INTEGER NOT NULL UNIQUE REFERENCES payments(id) ON DELETE CASCADE,
  receipt_number VARCHAR(50) UNIQUE NOT NULL,
  payer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  pdf_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_payments_contract_id ON payments(contract_id);
CREATE INDEX IF NOT EXISTS idx_payments_payer_id ON payments(payer_id);
CREATE INDEX IF NOT EXISTS idx_payments_payee_id ON payments(payee_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

CREATE INDEX IF NOT EXISTS idx_escrow_contract_id ON escrow(contract_id);
CREATE INDEX IF NOT EXISTS idx_escrow_payer_id ON escrow(payer_id);
CREATE INDEX IF NOT EXISTS idx_escrow_payee_id ON escrow(payee_id);
CREATE INDEX IF NOT EXISTS idx_escrow_status ON escrow(status);

CREATE INDEX IF NOT EXISTS idx_invoices_contract_id ON invoices(contract_id);
CREATE INDEX IF NOT EXISTS idx_invoices_from_user_id ON invoices(from_user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_to_user_id ON invoices(to_user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_receipts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Payments
CREATE POLICY "Users can view their own payments"
ON payments FOR SELECT
USING (auth.uid()::integer = payer_id OR auth.uid()::integer = payee_id);

CREATE POLICY "System can create payments"
ON payments FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own payments"
ON payments FOR UPDATE
USING (auth.uid()::integer = payer_id);

-- RLS Policies for Escrow
CREATE POLICY "Users can view their own escrow"
ON escrow FOR SELECT
USING (auth.uid()::integer = payer_id OR auth.uid()::integer = payee_id);

CREATE POLICY "System can manage escrow"
ON escrow FOR INSERT
WITH CHECK (true);

CREATE POLICY "Payer can release escrow"
ON escrow FOR UPDATE
USING (auth.uid()::integer = payer_id);

-- RLS Policies for Invoices
CREATE POLICY "Users can view their own invoices"
ON invoices FOR SELECT
USING (auth.uid()::integer = from_user_id OR auth.uid()::integer = to_user_id);

CREATE POLICY "System can create invoices"
ON invoices FOR INSERT
WITH CHECK (true);

CREATE POLICY "Invoice creator can update"
ON invoices FOR UPDATE
USING (auth.uid()::integer = from_user_id);

-- RLS Policies for Payment Receipts
CREATE POLICY "Users can view their own receipts"
ON payment_receipts FOR SELECT
USING (auth.uid()::integer = payer_id OR auth.uid()::integer = payee_id);

CREATE POLICY "System can create receipts"
ON payment_receipts FOR INSERT
WITH CHECK (true);
