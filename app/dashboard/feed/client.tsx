'use client'

import { useState } from 'react'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { likePost, addComment, savePost } from '@/lib/actions/profile-feed'
import Link from 'next/link'

interface Post {
  id: number
  content: string
  post_type: string
  title?: string
  description?: string
  image_url?: string
  project_link?: string
  achievement_type?: string
  likes_count: number
  comments_count: number
  created_at: string
  user?: { id: number; full_name: string; avatar_url?: string; headline?: string }
  post_likes?: Array<{ id: number; reaction_type: string }>
  saved_posts?: Array<{ id: number }>
}

interface Comment {
  id: number
  post_id: number
  content: string
  created_at: string
  user?: { id: number; full_name: string; avatar_url?: string }
  comment_likes?: Array<{ id: number }>
}

export default function DiscoveryFeedClient({
  posts: initialPosts,
  comments: initialComments,
  currentUserId,
}: {
  posts: Post[]
  comments: Comment[]
  currentUserId: number
}) {
  const { t, dir } = useLanguage()
  const [postComments, setPostComments] = useState<{ [key: number]: string }>({})
  const [loadingPost, setLoadingPost] = useState<number | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'text' | 'project' | 'achievement'>('all')

  const filteredPosts = initialPosts.filter(
    p => filterType === 'all' || p.post_type === filterType
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const handleLike = async (postId: number) => {
    setLoadingPost(postId)
    try {
      await likePost(postId)
    } finally {
      setLoadingPost(null)
    }
  }

  const handleComment = async (postId: number) => {
    const content = postComments[postId]
    if (!content?.trim()) return

    setLoadingPost(postId)
    try {
      await addComment({ postId, content })
      setPostComments(prev => ({ ...prev, [postId]: '' }))
    } finally {
      setLoadingPost(null)
    }
  }

  return (
    <div dir={dir} className="space-y-8">
      {/* Filters */}
      <div className="glass border border-outline-variant/15 rounded-xl p-6">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-3">
          {t('discoveryFeed.filterByType')}
        </p>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'text', 'project', 'achievement'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all ${
                filterType === type
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container hover:bg-surface-bright text-on-surface'
              }`}
            >
              {type === 'all' ? t('common.all') : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="glass border border-outline-variant/15 rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant/30 block mb-4">
              search
            </span>
            <p className="text-on-surface-variant">
              {t('discoveryFeed.noResults')}
            </p>
          </div>
        ) : (
          filteredPosts.map(post => {
            const postCommentsList = initialComments.filter(c => c.post_id === post.id)
            const isLiked = post.post_likes?.some(l => l.reaction_type === 'like')
            const isSaved = post.saved_posts?.length ?? 0 > 0

            return (
              <div key={post.id} className="glass border border-outline-variant/15 rounded-xl p-8 hover:border-outline-variant/30 transition-colors">
                {/* Post Header */}
                <div className="flex items-start gap-4 mb-6">
                  <Link href={`/talent/${post.user?.id}`}>
                    {post.user?.avatar_url ? (
                      <img
                        src={post.user?.avatar_url}
                        alt={post.user?.full_name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0 hover:opacity-80 transition-opacity"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold">
                          {post.user?.full_name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </Link>

                  <div className="flex-1">
                    <Link
                      href={`/talent/${post.user?.id}`}
                      className="text-on-surface font-semibold hover:text-primary transition-colors"
                    >
                      {post.user?.full_name}
                    </Link>
                    {post.user?.headline && (
                      <p className="text-on-surface-variant text-sm">{post.user?.headline}</p>
                    )}
                    <p className="text-on-surface-variant text-xs mt-1">
                      {formatDate(post.created_at)}
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${
                    post.post_type === 'text'
                      ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                      : post.post_type === 'project'
                      ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                      : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {post.post_type}
                  </span>
                </div>

                {/* Post Content */}
                <div className="mb-6">
                  {post.title && (
                    <h3 className="text-lg font-semibold text-on-surface mb-3">{post.title}</h3>
                  )}
                  <p className="text-on-surface leading-relaxed whitespace-pre-wrap mb-4 line-clamp-4">
                    {post.content}
                  </p>
                  {post.description && (
                    <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                      {post.description}
                    </p>
                  )}

                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt="Post"
                      className="w-full rounded-lg object-cover max-h-96 mb-4"
                    />
                  )}

                  {post.project_link && (
                    <a
                      href={post.project_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors font-semibold text-sm"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      {t('discoveryFeed.viewProject')}
                    </a>
                  )}
                </div>

                {/* Post Stats */}
                <div className="flex gap-4 text-on-surface-variant text-sm mb-6 pb-6 border-b border-outline-variant/10">
                  <span>
                    <span className="font-semibold text-on-surface">{post.likes_count}</span> {t('profileFeed.likes').replace('{{count}}', post.likes_count !== 1 ? 's' : '')}
                  </span>
                  <span>
                    <span className="font-semibold text-on-surface">{postCommentsList.length}</span> {t('profileFeed.comments').replace('{{count}}', postCommentsList.length !== 1 ? 's' : '')}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    disabled={loadingPost === post.id}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-widest transition-all ${
                      isLiked
                        ? 'bg-primary/20 text-primary hover:bg-primary/30'
                        : 'bg-surface-container hover:bg-surface-bright text-on-surface'
                    } disabled:opacity-50`}
                  >
                    <span className="material-symbols-outlined text-sm">thumb_up</span>
                    {t('common.like')}
                  </button>
                  <button
                    onClick={() => savePost(post.id)}
                    disabled={loadingPost === post.id}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-widest transition-all ${
                      isSaved
                        ? 'bg-secondary/20 text-secondary hover:bg-secondary/30'
                        : 'bg-surface-container hover:bg-surface-bright text-on-surface'
                    } disabled:opacity-50`}
                  >
                    <span className="material-symbols-outlined text-sm">bookmark</span>
                    {t('common.save')}
                  </button>
                </div>

                {/* Comments Preview */}
                {postCommentsList.length > 0 && (
                  <div className="mb-6 space-y-3 pb-6 border-b border-outline-variant/10">
                    {postCommentsList.slice(0, 2).map(comment => (
                      <div key={comment.id} className="flex gap-2">
                        {comment.user?.avatar_url ? (
                          <img
                            src={comment.user?.avatar_url}
                            alt={comment.user?.full_name}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-outline-variant/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold">
                              {comment.user?.full_name?.[0]?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 text-sm">
                          <span className="font-semibold text-on-surface">
                            {comment.user?.full_name}
                          </span>
                          <span className="text-on-surface-variant ml-2 line-clamp-1">
                            {comment.content}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={postComments[post.id] || ''}
                    onChange={e => setPostComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder={t('profileFeed.addComment')}
                    className="input-inset flex-1"
                    maxLength={1000}
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    disabled={loadingPost === post.id || !postComments[post.id]?.trim()}
                    className="bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
