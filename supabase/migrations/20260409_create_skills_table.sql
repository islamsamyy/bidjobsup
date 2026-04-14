-- Create Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  proficiency_level VARCHAR(50) DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  endorsement_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  verified_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Create Skill Endorsements Table
CREATE TABLE IF NOT EXISTS skill_endorsements (
  id SERIAL PRIMARY KEY,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  endorsed_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(skill_id, endorsed_by_user_id)
);

-- Create Skill Verifications Table
CREATE TABLE IF NOT EXISTS skill_verifications (
  id SERIAL PRIMARY KEY,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  verified_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  verification_type VARCHAR(50) CHECK (verification_type IN ('endorsement', 'certification', 'portfolio_item', 'test_passed')),
  details TEXT,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(skill_id, verified_by_user_id, verification_type)
);

-- Create Skill Categories Table for standardization
CREATE TABLE IF NOT EXISTS skill_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  parent_category_id INTEGER REFERENCES skill_categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert common skill categories
INSERT INTO skill_categories (name, description, icon) VALUES
('Programming', 'Software development and coding skills', 'code'),
('Design', 'Visual and UX/UI design skills', 'design_services'),
('Marketing', 'Digital marketing and promotion skills', 'trending_up'),
('Business', 'Business management and strategy skills', 'business_center'),
('Writing', 'Content writing and copywriting skills', 'edit'),
('Data', 'Data analysis and data science skills', 'analytics'),
('Project Management', 'Project planning and management skills', 'assignment'),
('Sales', 'Sales and business development skills', 'shopping_bag'),
('Customer Service', 'Customer support and service skills', 'support_agent'),
('Finance', 'Financial management and accounting skills', 'account_balance'),
('Legal', 'Legal and compliance skills', 'gavel'),
('HR', 'Human resources skills', 'people'),
('Operations', 'Operations and logistics skills', 'engineering'),
('Quality Assurance', 'QA and testing skills', 'verified'),
('DevOps', 'DevOps and infrastructure skills', 'cloud'),
('Cloud Computing', 'Cloud platforms and services', 'cloud_queue'),
('Mobile Development', 'Mobile app development skills', 'smartphone'),
('Web Development', 'Web development skills', 'web'),
('Artificial Intelligence', 'AI and machine learning skills', 'smart_toy'),
('Cybersecurity', 'Security and cybersecurity skills', 'security');

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_is_featured ON skills(is_featured);
CREATE INDEX IF NOT EXISTS idx_skills_verified ON skills(verified);
CREATE INDEX IF NOT EXISTS idx_skills_endorsement_count ON skills(endorsement_count DESC);

CREATE INDEX IF NOT EXISTS idx_skill_endorsements_skill_id ON skill_endorsements(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_endorsements_endorsed_by ON skill_endorsements(endorsed_by_user_id);

CREATE INDEX IF NOT EXISTS idx_skill_verifications_skill_id ON skill_verifications(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_verifications_verified_by ON skill_verifications(verified_by_user_id);

-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Skills
CREATE POLICY "Users can view all skills"
ON skills FOR SELECT
USING (true);

CREATE POLICY "Users can create their own skills"
ON skills FOR INSERT
WITH CHECK (auth.uid()::integer = user_id);

CREATE POLICY "Users can update their own skills"
ON skills FOR UPDATE
USING (auth.uid()::integer = user_id);

CREATE POLICY "Users can delete their own skills"
ON skills FOR DELETE
USING (auth.uid()::integer = user_id);

-- RLS Policies for Skill Endorsements
CREATE POLICY "Users can view all endorsements"
ON skill_endorsements FOR SELECT
USING (true);

CREATE POLICY "Users can create endorsements"
ON skill_endorsements FOR INSERT
WITH CHECK (auth.uid()::integer = endorsed_by_user_id);

CREATE POLICY "Users can delete their endorsements"
ON skill_endorsements FOR DELETE
USING (auth.uid()::integer = endorsed_by_user_id);

-- RLS Policies for Skill Verifications
CREATE POLICY "Users can view all verifications"
ON skill_verifications FOR SELECT
USING (true);

CREATE POLICY "System can create verifications"
ON skill_verifications FOR INSERT
WITH CHECK (true);

-- RLS for Skill Categories (read-only)
CREATE POLICY "Users can view skill categories"
ON skill_categories FOR SELECT
USING (true);
