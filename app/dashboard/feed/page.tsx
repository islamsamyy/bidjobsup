import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DiscoveryFeedClient from './client'

export const dynamic = 'force-dynamic'

export default async function DiscoveryFeedPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/sign-in')
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('id, full_name, avatar_url')
    .eq('auth_id', user.id)
    .single()

  if (!currentUser) {
    redirect('/join')
  }

  // Fetch all public posts with pagination
  const { data: postsData } = await supabase
    .from('profile_posts')
    .select(`
      id,
      content,
      post_type,
      title,
      description,
      image_url,
      project_link,
      achievement_type,
      likes_count,
      comments_count,
      created_at,
      user_id,
      user:user_id(id, full_name, avatar_url, headline),
      post_likes!left(id, reaction_type),
      saved_posts!left(id)
    `)
    .eq('visibility', 'public')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(50)

  const posts = postsData?.map(p => ({
    ...p,
    user: p.user && Array.isArray(p.user) ? p.user[0] : p.user,
    post_likes: p.post_likes && Array.isArray(p.post_likes) ? p.post_likes : [],
    saved_posts: p.saved_posts && Array.isArray(p.saved_posts) ? p.saved_posts : [],
  }))

  // Fetch comments for all posts
  const { data: commentsData } = await supabase
    .from('post_comments')
    .select(`
      id,
      post_id,
      content,
      created_at,
      user:user_id(id, full_name, avatar_url),
      comment_likes:comment_likes(id)
    `)
    .in('post_id', (posts || []).map(p => p.id))
    .is('deleted_at', null)
    .limit(300)

  const comments = commentsData?.map(c => ({
    ...c,
    user: c.user && Array.isArray(c.user) ? c.user[0] : c.user,
    comment_likes: c.comment_likes && Array.isArray(c.comment_likes) ? c.comment_likes : [],
  }))

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-headline text-5xl font-bold text-on-surface mb-2">
          Professional Feed
        </h1>
        <p className="text-on-surface-variant text-lg">
          Discover achievements and insights from the professional community
        </p>
      </div>

      {/* Feed Content */}
      {!posts || posts.length === 0 ? (
        <div className="glass border border-outline-variant/15 rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-outline-variant/30 block mb-4">
            trending_up
          </span>
          <p className="text-on-surface-variant text-lg">
            No posts yet
          </p>
          <p className="text-on-surface-variant text-sm mt-2">
            Be the first to share your professional achievements!
          </p>
        </div>
      ) : (
        <DiscoveryFeedClient
          posts={posts || []}
          comments={comments || []}
          currentUserId={currentUser.id}
        />
      )}
    </main>
  )
}
