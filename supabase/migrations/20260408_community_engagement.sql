-- Community engagement tables for likes and comments on posts
-- Enables users to engage with community posts

-- Table for post likes
CREATE TABLE IF NOT EXISTS public.community_post_likes (
  id serial PRIMARY KEY,
  post_id integer NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id integer NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  -- Ensure each user can only like a post once
  UNIQUE(post_id, user_id)
);

-- Table for post comments
CREATE TABLE IF NOT EXISTS public.community_post_comments (
  id serial PRIMARY KEY,
  post_id integer NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id integer NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_community_post_likes_post_id ON public.community_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_post_likes_user_id ON public.community_post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_community_post_comments_post_id ON public.community_post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_post_comments_user_id ON public.community_post_comments(user_id);

-- Add comments
COMMENT ON TABLE public.community_post_likes IS 'Tracks which users have liked which community posts';
COMMENT ON TABLE public.community_post_comments IS 'Stores comments on community posts with user attribution';
