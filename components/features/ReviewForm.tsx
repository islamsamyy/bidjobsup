'use client'

import { useState } from 'react'
import { createReview } from '@/lib/actions/reviews'
import { Star } from 'lucide-react'

interface ReviewFormProps {
  revieweeId: number
  jobId: number
  onSuccess: () => void
}

export default function ReviewForm({ revieweeId, jobId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) {
      setError('Please write a review')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await createReview({
        revieweeId,
        jobId,
        rating,
        comment,
      })

      if (result.success) {
        setRating(5)
        setComment('')
        onSuccess()
      } else {
        setError(result.error || 'Failed to submit review')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container/60 backdrop-blur-xl rounded-xl p-6 border border-white/5 space-y-4">
      {error && (
        <div className="bg-error/20 border border-error text-error px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
          Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="transition-all"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= rating
                    ? 'fill-secondary text-secondary'
                    : 'text-on-surface-variant/40'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
          Your Review ({comment.length}/1000)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 1000))}
          placeholder="Share your experience working with this specialist..."
          rows={4}
          className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 transition-all outline-none text-xs resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !comment.trim()}
        className="w-full px-4 py-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
