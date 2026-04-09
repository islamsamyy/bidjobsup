'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Star, Trash2 } from 'lucide-react'
import { deleteReview } from '@/lib/actions/reviews'

interface Review {
  id: number
  rating: number
  comment: string
  created_at: string
  reviewer?: any
}

interface ReviewsListProps {
  talentId: number
  currentUserId?: number
}

export default function ReviewsList({ talentId, currentUserId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data, error } = await supabase
          .from('reviews')
          .select('id, rating, comment, created_at, reviewer_id')
          .eq('reviewee_id', talentId)
          .order('created_at', { ascending: false })

        if (!error && data) {
          // Fetch reviewer info for all reviews
          const reviewerIds = [...new Set(data.map(r => r.reviewer_id))]
          const { data: reviewers } = await supabase
            .from('users')
            .select('id, full_name, avatar_url')
            .in('id', reviewerIds)

          const reviewerMap: Record<number, any> = {}
          reviewers?.forEach(r => {
            reviewerMap[r.id] = r
          })

          const reviewsWithReviewers = data.map(r => ({
            ...r,
            reviewer: reviewerMap[r.reviewer_id]
          }))

          setReviews(reviewsWithReviewers)
          if (data.length > 0) {
            const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length
            setAverageRating(parseFloat(avg.toFixed(1)))
          }
        }
      } catch (err) {
        console.error('Error fetching reviews:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [talentId])

  const handleDeleteReview = async (reviewId: number) => {
    const confirmed = confirm('Are you sure you want to delete this review?')
    if (!confirmed) return

    try {
      const result = await deleteReview(reviewId)
      if (result.success) {
        setReviews(reviews.filter(r => r.id !== reviewId))
      }
    } catch (err) {
      console.error('Error deleting review:', err)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-[#1c181c] border border-[#292428] rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-[#292428] rounded w-1/3 mb-4" />
            <div className="h-3 bg-[#292428] rounded w-full mb-2" />
            <div className="h-3 bg-[#292428] rounded w-5/6" />
          </div>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-[#1c181c] border border-[#292428] rounded-3xl p-8 text-center">
        <p className="text-[#b0a9ad] text-sm">No reviews yet. Be the first to share your experience!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-[#1c181c] border border-[#292428] rounded-3xl p-8">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-black text-[#caa2f7] mb-2">{averageRating}</div>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i <= Math.round(averageRating) ? 'fill-[#caa2f7] text-[#caa2f7]' : 'text-[#4b474a]'}`}
                />
              ))}
            </div>
            <p className="text-[#b0a9ad] text-xs mt-2">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex-1 h-px bg-[#292428] ml-4" />
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="bg-[#1c181c] border border-[#292428] rounded-2xl p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-4">
                {review.reviewer?.avatar_url ? (
                  <img
                    src={review.reviewer.avatar_url}
                    alt={review.reviewer.full_name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-[#292428] rounded-xl flex items-center justify-center">
                    <span className="text-[#caa2f7] font-bold uppercase text-sm">
                      {review.reviewer?.full_name?.[0]}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-bold text-[#faf1f5] text-sm">{review.reviewer?.full_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i <= review.rating ? 'fill-[#caa2f7] text-[#caa2f7]' : 'text-[#4b474a]'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[#b0a9ad] text-[10px]">{formatDate(review.created_at)}</span>
                  </div>
                </div>
              </div>
              {currentUserId && (
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg text-[#b0a9ad] hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-[#b0a9ad] text-sm leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
