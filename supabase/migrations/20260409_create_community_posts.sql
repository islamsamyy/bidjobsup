-- Create community_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS community_posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at);

-- Enable RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view posts" ON community_posts
  FOR SELECT USING (true);

CREATE POLICY "Users can create posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid()::text = (SELECT auth_id::text FROM users WHERE id = user_id));

CREATE POLICY "Users can delete their own posts" ON community_posts
  FOR DELETE USING (auth.uid()::text = (SELECT auth_id::text FROM users WHERE id = user_id));

CREATE POLICY "Users can update their own posts" ON community_posts
  FOR UPDATE USING (auth.uid()::text = (SELECT auth_id::text FROM users WHERE id = user_id));
