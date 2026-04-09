-- Create Portfolio Items Table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  project_url VARCHAR(500),
  skills TEXT[],
  completion_date DATE,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_portfolio_user_id
ON portfolio_items(user_id);

CREATE INDEX IF NOT EXISTS idx_portfolio_featured
ON portfolio_items(user_id, featured);

-- Add RLS policies
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Users can view any portfolio
CREATE POLICY "Anyone can view portfolio"
ON portfolio_items FOR SELECT
USING (true);

-- Users can only create/edit/delete their own portfolio
CREATE POLICY "Users can create their own portfolio"
ON portfolio_items FOR INSERT
WITH CHECK (auth.uid()::integer = user_id);

CREATE POLICY "Users can edit their own portfolio"
ON portfolio_items FOR UPDATE
USING (auth.uid()::integer = user_id);

CREATE POLICY "Users can delete their own portfolio"
ON portfolio_items FOR DELETE
USING (auth.uid()::integer = user_id);
