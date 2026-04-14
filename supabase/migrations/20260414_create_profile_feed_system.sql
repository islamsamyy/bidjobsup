-- Create Profile Posts Table
CREATE TABLE IF NOT EXISTS profile_posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type VARCHAR(50) NOT NULL CHECK (post_type IN ('text', 'project', 'achievement')),
  title VARCHAR(255),
  description TEXT,
  image_url VARCHAR(500),
  project_link VARCHAR(500),
  achievement_type VARCHAR(100),
  media_urls TEXT[], -- JSON array of URLs for multiple images
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  visibility VARCHAR(50) DEFAULT 'public' CHECK (visibility IN ('public', 'connections', 'private')),
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create Post Likes Table
CREATE TABLE IF NOT EXISTS post_likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES profile_posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reaction_type VARCHAR(50) DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'celebrate', 'insightful', 'support')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create Post Comments Table
CREATE TABLE IF NOT EXISTS post_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES profile_posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id INTEGER REFERENCES post_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create Comment Likes Table
CREATE TABLE IF NOT EXISTS comment_likes (
  id SERIAL PRIMARY KEY,
  comment_id INTEGER NOT NULL REFERENCES post_comments(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Create Saved Posts Table
CREATE TABLE IF NOT EXISTS saved_posts (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES profile_posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  folder VARCHAR(100) DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create Post Mentions Table
CREATE TABLE IF NOT EXISTS post_mentions (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES profile_posts(id) ON DELETE CASCADE,
  mentioned_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profile_posts_user_id ON profile_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_posts_created_at ON profile_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profile_posts_post_type ON profile_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_profile_posts_visibility ON profile_posts(visibility);
CREATE INDEX IF NOT EXISTS idx_profile_posts_is_pinned ON profile_posts(is_pinned);

CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_id ON post_comments(parent_comment_id);

CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_saved_posts_user_id ON saved_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_posts_post_id ON saved_posts(post_id);

CREATE INDEX IF NOT EXISTS idx_post_mentions_post_id ON post_mentions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_mentions_mentioned_user_id ON post_mentions(mentioned_user_id);

-- Enable RLS
ALTER TABLE profile_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_mentions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profile Posts
CREATE POLICY "Users can view public and connections posts"
ON profile_posts FOR SELECT
USING (
  visibility = 'public' OR
  auth.uid()::integer = user_id OR
  (visibility = 'connections' AND EXISTS (
    SELECT 1 FROM connections
    WHERE (user_id_1 = auth.uid()::integer AND user_id_2 = profile_posts.user_id)
       OR (user_id_1 = profile_posts.user_id AND user_id_2 = auth.uid()::integer)
  ))
);

CREATE POLICY "Users can create their own posts"
ON profile_posts FOR INSERT
WITH CHECK (auth.uid()::integer = user_id);

CREATE POLICY "Users can update their own posts"
ON profile_posts FOR UPDATE
USING (auth.uid()::integer = user_id);

CREATE POLICY "Users can delete their own posts"
ON profile_posts FOR DELETE
USING (auth.uid()::integer = user_id);

-- RLS Policies for Post Likes
CREATE POLICY "Users can view all likes"
ON post_likes FOR SELECT
USING (true);

CREATE POLICY "Users can like posts"
ON post_likes FOR INSERT
WITH CHECK (auth.uid()::integer = user_id);

CREATE POLICY "Users can unlike posts"
ON post_likes FOR DELETE
USING (auth.uid()::integer = user_id);

-- RLS Policies for Post Comments
CREATE POLICY "Users can view comments on accessible posts"
ON post_comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profile_posts
    WHERE profile_posts.id = post_comments.post_id
    AND (visibility = 'public' OR auth.uid()::integer = user_id)
  )
);

CREATE POLICY "Users can create comments"
ON post_comments FOR INSERT
WITH CHECK (auth.uid()::integer = user_id);

CREATE POLICY "Users can update their own comments"
ON post_comments FOR UPDATE
USING (auth.uid()::integer = user_id);

CREATE POLICY "Users can delete their own comments"
ON post_comments FOR DELETE
USING (auth.uid()::integer = user_id);

-- RLS Policies for Saved Posts
CREATE POLICY "Users can view their own saved posts"
ON saved_posts FOR SELECT
USING (auth.uid()::integer = user_id);

CREATE POLICY "Users can save posts"
ON saved_posts FOR INSERT
WITH CHECK (auth.uid()::integer = user_id);

CREATE POLICY "Users can unsave posts"
ON saved_posts FOR DELETE
USING (auth.uid()::integer = user_id);

-- RLS Policies for Post Mentions
CREATE POLICY "Users can view mentions"
ON post_mentions FOR SELECT
USING (true);

CREATE POLICY "System can create mentions"
ON post_mentions FOR INSERT
WITH CHECK (true);
