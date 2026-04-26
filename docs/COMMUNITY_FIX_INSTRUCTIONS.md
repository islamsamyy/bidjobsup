# Community Page Error Fix

## Problem
The community page throws "Something went wrong" error because it's trying to query `community_post_likes` and `community_post_comments` tables that don't exist yet in Supabase.

## Solution

### Step 1: Go to Supabase SQL Editor
1. Go to https://app.supabase.com
2. Select your project
3. Click "SQL Editor" on the left sidebar
4. Click "New Query"

### Step 2: Copy and Run This SQL

```sql
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
```

### Step 3: Execute Query
- Click the "RUN" button (or Ctrl+Enter)
- You should see "Success. No rows returned." message

### Step 4: Refresh Your Browser
- Go back to http://localhost:3000/community
- The page should now load without errors
- You'll see the community feed with ability to:
  - Create posts
  - Like posts
  - Comment on posts
  - Delete your own posts/comments

## What Was Added

### Tables Created:
- **community_post_likes** — Track which users liked which posts (prevents duplicates)
- **community_post_comments** — Store comments on posts with author info

### Features Enabled:
- ❤️ Like button on posts (toggles on/off)
- 💬 Comment section on posts
- 👤 Comment authors shown with avatar
- 🗑️ Delete own comments
- 📊 Comment & like counts displayed

### Data Structure:
```
community_post_likes:
  - id (primary key)
  - post_id (which post was liked)
  - user_id (who liked it)
  - created_at (when)
  - UNIQUE constraint (prevents double-likes)

community_post_comments:
  - id (primary key)
  - post_id (which post)
  - user_id (who commented)
  - content (what they said)
  - created_at (when)
```

## Troubleshooting

**If you get an error "relation community_posts does not exist":**
- This means the main `community_posts` table doesn't exist either
- Check if you created community posts earlier
- If not, the community feature needs additional setup

**If you get "duplicate key value violates unique constraint":**
- This means the tables already exist (you already ran this)
- That's fine! The page should work now

**If the page still shows an error after running the SQL:**
- Refresh your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check that there are no TypeScript errors in the terminal
- The build should pass: `npm run build`

## After the Migration

The community page will now support:
1. ✅ Creating posts
2. ✅ Liking/unliking posts
3. ✅ Adding comments to posts
4. ✅ Deleting your own posts and comments
5. ✅ Real-time engagement metrics

You can now go to http://localhost:3000/community and see the feed working!
