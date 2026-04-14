import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileFeedClient from './client'

export const dynamic = 'force-dynamic'

export default async function ProfileFeedPage({
  params,
}: {
  params: Promise<{ id?: string }>
}) {
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

  // Fetch user's posts
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
      updated_at,
      user_id,
      user:user_id(id, full_name, avatar_url),
      post_likes!left(id, reaction_type),
      saved_posts!left(id)
    `)
    .eq('user_id', currentUser.id)
    .is('deleted_at', null)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  const posts = postsData?.map(p => ({
    ...p,
    user: p.user && Array.isArray(p.user) ? p.user[0] : p.user,
    post_likes: p.post_likes && Array.isArray(p.post_likes) ? p.post_likes : [],
    saved_posts: p.saved_posts && Array.isArray(p.saved_posts) ? p.saved_posts : [],
  }))

  // Fetch post comments with user info
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
    .order('created_at', { ascending: false })

  const comments = commentsData?.map(c => ({
    ...c,
    user: c.user && Array.isArray(c.user) ? c.user[0] : c.user,
    comment_likes: c.comment_likes && Array.isArray(c.comment_likes) ? c.comment_likes : [],
  }))

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline text-5xl font-bold text-on-surface mb-2">
              Profile Feed
            </h1>
            <p className="text-on-surface-variant text-lg">
              Share your achievements, projects, and insights
            </p>
          </div>
          <Link
            href="/dashboard/seeker"
            className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors font-semibold uppercase tracking-widest text-sm"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Profile
          </Link>
        </div>
      </div>

      {/* Create Post Section */}
      <div className="mb-12 glass border border-outline-variant/15 rounded-xl p-8">
        <h2 className="text-xl font-semibold text-on-surface mb-6">Create a Post</h2>
      </div>

      {/* Posts List */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold text-on-surface">Your Posts</h2>
        {!posts || posts.length === 0 ? (
          <div className="glass border border-outline-variant/15 rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant/30 block mb-4">
              edit_note
            </span>
            <p className="text-on-surface-variant text-lg mb-4">
              No posts yet
            </p>
            <p className="text-on-surface-variant text-sm">
              Start sharing your achievements and projects to build your professional presence.
            </p>
          </div>
        ) : (
          <ProfileFeedClient
            posts={posts || []}
            comments={comments || []}
            currentUserId={currentUser.id}
          />
        )}
      </div>
    </main>
  )
}
