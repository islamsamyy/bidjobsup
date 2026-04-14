-- Create Invitations/Job Offers Table
CREATE TABLE IF NOT EXISTS invitations (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  message TEXT,
  proposed_budget DECIMAL(12, 2),
  proposed_deadline DATE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'withdrawn', 'expired')),
  responded_at TIMESTAMP WITH TIME ZONE,
  response_message TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(job_id, recipient_id)
);

-- Create Offers Table (for counter-offers and explicit offers)
CREATE TABLE IF NOT EXISTS offers (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  from_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) DEFAULT 'offer' CHECK (type IN ('offer', 'counter_offer', 'counter_counter_offer')),
  amount DECIMAL(12, 2) NOT NULL,
  deadline DATE,
  description TEXT,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'accepted', 'rejected', 'expired')),
  responded_at TIMESTAMP WITH TIME ZONE,
  response_message TEXT,
  parent_offer_id INTEGER REFERENCES offers(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Job Offer Notes/Comments Table
CREATE TABLE IF NOT EXISTS offer_notes (
  id SERIAL PRIMARY KEY,
  invitation_id INTEGER REFERENCES invitations(id) ON DELETE CASCADE,
  offer_id INTEGER REFERENCES offers(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_invitations_job_id ON invitations(job_id);
CREATE INDEX IF NOT EXISTS idx_invitations_sender_id ON invitations(sender_id);
CREATE INDEX IF NOT EXISTS idx_invitations_recipient_id ON invitations(recipient_id);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
CREATE INDEX IF NOT EXISTS idx_invitations_created_at ON invitations(created_at);
CREATE INDEX IF NOT EXISTS idx_invitations_expires_at ON invitations(expires_at);

CREATE INDEX IF NOT EXISTS idx_offers_job_id ON offers(job_id);
CREATE INDEX IF NOT EXISTS idx_offers_from_user_id ON offers(from_user_id);
CREATE INDEX IF NOT EXISTS idx_offers_to_user_id ON offers(to_user_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_created_at ON offers(created_at);
CREATE INDEX IF NOT EXISTS idx_offers_expires_at ON offers(expires_at);

CREATE INDEX IF NOT EXISTS idx_offer_notes_invitation_id ON offer_notes(invitation_id);
CREATE INDEX IF NOT EXISTS idx_offer_notes_offer_id ON offer_notes(offer_id);

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Invitations
CREATE POLICY "Users can view invitations they sent or received"
ON invitations FOR SELECT
USING (auth.uid()::integer = sender_id OR auth.uid()::integer = recipient_id);

CREATE POLICY "System can create invitations"
ON invitations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Sender can update invitations"
ON invitations FOR UPDATE
USING (auth.uid()::integer = sender_id);

CREATE POLICY "Recipient can respond to invitations"
ON invitations FOR UPDATE
USING (auth.uid()::integer = recipient_id AND (status = 'pending' OR status = 'open'));

-- RLS Policies for Offers
CREATE POLICY "Users can view offers they sent or received"
ON offers FOR SELECT
USING (auth.uid()::integer = from_user_id OR auth.uid()::integer = to_user_id);

CREATE POLICY "System can create offers"
ON offers FOR INSERT
WITH CHECK (true);

CREATE POLICY "Sender can update their offers"
ON offers FOR UPDATE
USING (auth.uid()::integer = from_user_id);

CREATE POLICY "Recipient can respond to offers"
ON offers FOR UPDATE
USING (auth.uid()::integer = to_user_id AND status = 'open');

-- RLS Policies for Offer Notes
CREATE POLICY "Users can view notes on their offers"
ON offer_notes FOR SELECT
USING (
  auth.uid()::integer = user_id OR
  EXISTS (
    SELECT 1 FROM offers
    WHERE offers.id = offer_notes.offer_id
    AND (auth.uid()::integer = offers.from_user_id OR auth.uid()::integer = offers.to_user_id)
  )
);

CREATE POLICY "Users can add notes to their offers"
ON offer_notes FOR INSERT
WITH CHECK (
  auth.uid()::integer = user_id AND
  EXISTS (
    SELECT 1 FROM offers
    WHERE offers.id = offer_notes.offer_id
    AND (auth.uid()::integer = offers.from_user_id OR auth.uid()::integer = offers.to_user_id)
  )
);
