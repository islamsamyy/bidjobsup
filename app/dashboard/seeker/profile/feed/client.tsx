'use client'

import { useState } from 'react'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { createPost, likePost, addComment, deletePost, savePost } from '@/lib/actions/profile-feed'
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
  user?: { id: number; full_name: string; avatar_url?: string }
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

export const CreatePost = ({ userId }: { userId: number }) => {
  const { t, dir } = useLanguage()
  const [content, setContent] = useState('')
  const [postType, setPostType] = useState<'text' | 'project' | 'achievement'>('text')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await createPost({
        content,
        postType,
        title: title || undefined,
        description: description || undefined,
        visibility: 'public',
      })

      if (result.error) {
        setError(result.error)
      } else {
        setContent('')
        setTitle('')
        setDescription('')
        setPostType('text')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir={dir}>
      {error && (
        <div className="bg-error/10 text-error px-4 py-3 rounded-lg text-sm border border-error/30">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-2">
          Post Type
        </label>
        <div className="flex gap-2">
          {(['text', 'project', 'achievement'] as const).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setPostType(type)}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all ${
                postType === type
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container hover:bg-surface-bright text-on-surface'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-2">
          {postType === 'text' ? 'What do you want to share?' : 'Title'}
        </label>
        <input
          type="text"
          value={postType === 'text' ? content : title}
          onChange={e => postType === 'text' ? setContent(e.target.value) : setTitle(e.target.value)}
          placeholder={postType === 'text' ? 'Share an update, achievement, or insight...' : 'Post title'}
          className="input-inset w-full"
          maxLength={postType === 'text' ? 5000 : 255}
        />
        <div className="text-xs text-on-surface-variant mt-1">
          {postType === 'text' ? `${content.length}/5000` : `${title.length}/255`}
        </div>
      </div>

      {postType !== 'text' && (
        <>
          <div>
            <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add more details about your achievement or project..."
              className="input-inset w-full h-24"
              maxLength={1000}
            />
            <div className="text-xs text-on-surface-variant mt-1">
              {description.length}/1000
            </div>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="w-full bg-primary text-on-primary px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Publishing...' : 'Publish Post'}
      </button>
    </form>
  )
}

export const PostsList = ({
  posts,
  comments,
  currentUserId,
}: {
  posts: Post[]
  comments: Comment[]
  currentUserId: number
}) => {
  const { t, dir } = useLanguage()
  const [postComments, setPostComments] = useState<{ [key: number]: string }>({})
  const [loadingPost, setLoadingPost] = useState<number | null>(null)

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

  const handleDelete = async (postId: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setLoadingPost(postId)
      try {
        await deletePost(postId)
      } finally {
        setLoadingPost(null)
      }
    }
  }

  return (
    <div className="space-y-6">
      {posts.map(post => {
        const postCommentsList = comments.filter(c => c.post_id === post.id)
        const isLiked = post.post_likes?.some(l => l.reaction_type === 'like')
        const isSaved = post.saved_posts?.length ?? 0 > 0

        return (
          <div key={post.id} className="glass border border-outline-variant/15 rounded-xl p-8">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4 flex-1">
                {post.user?.avatar_url ? (
                  <img
                    src={post.user.avatar_url}
                    alt={post.user.full_name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">
                      {post.user?.full_name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <Link
                    href={`/talent/${post.user?.id}`}
                    className="text-on-surface font-semibold hover:text-primary transition-colors"
                  >
                    {post.user?.full_name}
                  </Link>
                  <p className="text-on-surface-variant text-sm">{formatDate(post.created_at)}</p>
                </div>
              </div>

              {post.user?.id === currentUserId && (
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 hover:bg-error/10 rounded-lg text-on-surface-variant hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              )}
            </div>

            {/* Post Content */}
            <div className="mb-6">
              {post.title && (
                <h3 className="text-xl font-semibold text-on-surface mb-3">{post.title}</h3>
              )}
              <p className="text-on-surface leading-relaxed whitespace-pre-wrap mb-4">
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
                  className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors font-semibold uppercase tracking-widest text-sm"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  View Project
                </a>
              )}
            </div>

            {/* Post Stats */}
            <div className="flex gap-4 text-on-surface-variant text-sm mb-6 pb-6 border-b border-outline-variant/10">
              <span>
                <span className="font-semibold text-on-surface">{post.likes_count}</span> Like
                {post.likes_count !== 1 ? 's' : ''}
              </span>
              <span>
                <span className="font-semibold text-on-surface">{postCommentsList.length}</span> Comment
                {postCommentsList.length !== 1 ? 's' : ''}
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
                Like
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
                Save
              </button>
            </div>

            {/* Comments Section */}
            {postCommentsList.length > 0 && (
              <div className="mb-6 space-y-4 pb-6 border-b border-outline-variant/10">
                <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">
                  Comments
                </h4>
                {postCommentsList.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    {comment.user?.avatar_url ? (
                      <img
                        src={comment.user.avatar_url}
                        alt={comment.user.full_name}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-outline-variant/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold">
                          {comment.user?.full_name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold text-on-surface">
                          {comment.user?.full_name}
                        </span>
                        <span className="text-on-surface-variant ml-2">{comment.content}</span>
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <div className="flex gap-3">
              <input
                type="text"
                value={postComments[post.id] || ''}
                onChange={e => setPostComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                placeholder="Add a comment..."
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
      })}
    </div>
  )
}
