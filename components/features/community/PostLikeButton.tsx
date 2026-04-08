'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { likePost, unlikePost } from '@/lib/actions/posts'

interface PostLikeButtonProps {
  postId: number
  initialLikeCount: number
  isLiked: boolean
}

export default function PostLikeButton({ postId, initialLikeCount, isLiked: initialIsLiked }: PostLikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleLike = async () => {
    setIsLoading(true)
    try {
      if (isLiked) {
        const result = await unlikePost(postId)
        if (result.success) {
          setIsLiked(false)
          setLikeCount(Math.max(0, likeCount - 1))
        }
      } else {
        const result = await likePost(postId)
        if (result.success) {
          setIsLiked(true)
          setLikeCount(likeCount + 1)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 transition-all ${
        isLiked
          ? 'text-tertiary'
          : 'text-stone-500 hover:text-tertiary'
      } disabled:opacity-50`}
    >
      <Heart
        className={`w-5 h-5 transition-all ${isLiked ? 'fill-current' : ''}`}
      />
      <span className="text-xs font-bold uppercase tracking-widest">{likeCount}</span>
    </button>
  )
}
