import { getAuthUser } from '@/lib/auth-utils'
import DiscoveryFeedClient from './client'
import en from '@/locales/en.json'

export const dynamic = 'force-dynamic'

export default async function DiscoveryFeedPage() {
  const { profile: currentUser, supabase } = await getAuthUser()

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = en
    for (const k of keys) {
      value = value?.[k]
    }
    return typeof value === 'string' ? value : key
  }

  // Fetch all public posts with pagination
  const { data: postsData } = await supabase!
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
  const { data: commentsData } = await supabase!
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
          {t('discoveryFeed.title')}
        </h1>
        <p className="text-on-surface-variant text-lg">
          {t('discoveryFeed.subtitle')}
        </p>
      </div>

      {/* Feed Content */}
      {!posts || posts.length === 0 ? (
        <div className="glass border border-outline-variant/15 rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-outline-variant/30 block mb-4">
            trending_up
          </span>
          <p className="text-on-surface-variant text-lg">
            {t('discoveryFeed.noPosts')}
          </p>
          <p className="text-on-surface-variant text-sm mt-2">
            {t('discoveryFeed.noPostsSubtitle')}
          </p>
        </div>
      ) : (
        <DiscoveryFeedClient
          posts={posts || []}
          comments={comments || []}
          currentUserId={Number(currentUser?.id)}
        />
      )}
    </main>
  )
}
