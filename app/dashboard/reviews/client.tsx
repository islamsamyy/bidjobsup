'use client'

import { useState } from 'react'
import { useLanguage } from '@/app/providers/LanguageProvider'
import Link from 'next/link'

interface Review {
  id: number
  rating: number
  comment: string
  created_at: string
  job_id?: number
  reviewer_id: number
  reviewer?: {
    id: number
    full_name: string
    avatar_url?: string
    email: string
  }
  job?: {
    id: number
    title: string
  }
}

interface ReviewManagementClientProps {
  reviews: Review[]
  currentUserId: number
}

export default function ReviewManagementClient({ reviews: initialReviews, currentUserId }: ReviewManagementClientProps) {
  const { t, dir } = useLanguage()
  const [reviews, setReviews] = useState(initialReviews)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating-high' | 'rating-low'>('newest')

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(r => !filterRating || r.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'rating-high':
          return b.rating - a.rating
        case 'rating-low':
          return a.rating - b.rating
        default:
          return 0
      }
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div dir={dir} className="space-y-6">
      {/* Filters and Sort */}
      <div className="glass border border-outline-variant/15 rounded-xl p-6 flex flex-col md:flex-row gap-6 justify-between">
        {/* Filter by Rating */}
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-3">
              Filter by Rating
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterRating(null)}
                className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all ${
                  filterRating === null
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container hover:bg-surface-bright text-on-surface'
                }`}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map(rating => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(rating)}
                  className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-1 ${
                    filterRating === rating
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container hover:bg-surface-bright text-on-surface'
                  }`}
                >
                  {rating}★
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-3">
            Sort by
          </p>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="input-inset px-4 py-2 text-sm rounded-lg"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map(review => (
          <div key={review.id} className="glass border border-outline-variant/15 rounded-xl p-6 hover:border-outline-variant/30 transition-colors">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {/* Reviewer Avatar */}
              <div className="flex-shrink-0">
                {review.reviewer?.avatar_url ? (
                  <img
                    src={review.reviewer.avatar_url}
                    alt={review.reviewer.full_name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-xl">
                      {review.reviewer?.full_name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Review Content */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <Link
                      href={`/talent/${review.reviewer_id}`}
                      className="text-on-surface font-semibold hover:text-primary transition-colors"
                    >
                      {review.reviewer?.full_name}
                    </Link>
                    <p className="text-on-surface-variant text-sm mt-1">
                      {review.reviewer?.email}
                    </p>
                  </div>

                  {/* Rating Stars and Date */}
                  <div className="flex flex-col items-start md:items-end">
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map(i => (
                        <span
                          key={i}
                          className={`material-symbols-outlined text-lg ${
                            i <= review.rating ? 'text-primary' : 'text-outline-variant/30'
                          }`}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <p className="text-on-surface-variant text-xs">
                      {formatDate(review.created_at)}
                    </p>
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-on-surface leading-relaxed mb-4">
                  {review.comment}
                </p>

                {/* Job Link */}
                {review.job && (
                  <Link
                    href={`/dashboard/contracts`}
                    className="inline-flex items-center gap-2 text-secondary hover:text-primary text-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">work</span>
                    {review.job.title}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredReviews.length === 0 && reviews.length > 0 && (
        <div className="glass border border-outline-variant/15 rounded-xl p-8 text-center">
          <p className="text-on-surface-variant">
            No reviews found with the selected filters. Try adjusting your filter criteria.
          </p>
        </div>
      )}
    </div>
  )
}
