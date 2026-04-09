-- Community Post Likes Table
CREATE TABLE IF NOT EXISTS community_post_likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_community_post_likes_post_id ON community_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_post_likes_user_id ON community_post_likes(user_id);

-- Community Post Comments Table
CREATE TABLE IF NOT EXISTS community_post_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_community_post_comments_post_id ON community_post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_post_comments_user_id ON community_post_comments(user_id);

-- Add engagement count columns to community_posts if they don't exist
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

-- Enable Row Level Security
ALTER TABLE community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_post_likes
CREATE POLICY "Anyone can view likes" ON community_post_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like posts" ON community_post_likes
  FOR INSERT WITH CHECK (auth.uid()::text = (SELECT auth_id::text FROM users WHERE id = user_id));

CREATE POLICY "Users can unlike their own likes" ON community_post_likes
  FOR DELETE USING (auth.uid()::text = (SELECT auth_id::text FROM users WHERE id = user_id));

-- RLS Policies for community_post_comments
CREATE POLICY "Anyone can view comments" ON community_post_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can comment on posts" ON community_post_comments
  FOR INSERT WITH CHECK (auth.uid()::text = (SELECT auth_id::text FROM users WHERE id = user_id));

CREATE POLICY "Users can delete their own comments" ON community_post_comments
  FOR DELETE USING (auth.uid()::text = (SELECT auth_id::text FROM users WHERE id = user_id));

CREATE POLICY "Users can update their own comments" ON community_post_comments
  FOR UPDATE USING (auth.uid()::text = (SELECT auth_id::text FROM users WHERE id = user_id));
