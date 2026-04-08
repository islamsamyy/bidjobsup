'use client'

import { useState } from 'react'
import { addComment, deleteComment } from '@/lib/actions/posts'
import { MessageSquare, Trash2 } from 'lucide-react'

interface Comment {
  id: number
  content: string
  user_id: number
  created_at: string
  user?: {
    full_name: string
    avatar_url?: string
  }
}

interface PostCommentsProps {
  postId: number
  initialComments: Comment[]
  currentUserId: number
  canDelete: (userId: number) => boolean
}

export default function PostComments({
  postId,
  initialComments,
  currentUserId,
  canDelete,
}: PostCommentsProps) {
  const [comments, setComments] = useState(initialComments)
  const [isExpanded, setIsExpanded] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const result = await addComment(postId, newComment)
      if (result.success) {
        setNewComment('')
        setComments([
          ...comments,
          {
            id: Date.now(),
            content: newComment,
            user_id: currentUserId,
            created_at: new Date().toISOString(),
          },
        ])
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    const result = await deleteComment(commentId)
    if (result.success) {
      setComments(comments.filter((c) => c.id !== commentId))
    }
  }

  return (
    <div className="space-y-4 mt-4 border-t border-outline-variant/10 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-on-surface transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </button>

      {isExpanded && (
        <div className="space-y-4">
          {/* Comments List */}
          {comments.length > 0 && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 bg-surface-container-lowest rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate">
                      {comment.user?.full_name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1 break-words">
                      {comment.content}
                    </p>
                  </div>
                  {canDelete(comment.user_id) && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="shrink-0 text-stone-600 hover:text-error transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="space-y-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a thoughtful comment..."
              maxLength={500}
              rows={2}
              className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 transition-all outline-none text-xs resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-stone-600">{newComment.length}/500</span>
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
