'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getAllReviews, deleteReview } from '@/lib/actions/admin'

interface Review {
  id: number
  rating: number
  comment: string
  created_at: string
  reviewer?: { full_name: string; avatar_url: string | null }
  reviewee?: { full_name: string }
}

const STARS = [1, 2, 3, 4, 5]

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getAllReviews().then(result => {
      setReviews(result.reviews || [])
      setLoading(false)
    })
  }, [])

  const handleDelete = async (reviewId: number) => {
    const result = await deleteReview(reviewId)
    if (result.success) {
      setReviews(prev => prev.filter(r => r.id !== reviewId))
      setConfirmDelete(null)
    }
  }

  const filtered = reviews.filter(r => {
    const matchRating = filterRating === null || r.rating === filterRating
    const matchSearch = !search ||
      r.reviewer?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.reviewee?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase())
    return matchRating && matchSearch
  })

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Review Moderation</h1>
          <p className="text-on-surface-variant">Monitor and remove inappropriate reviews</p>
        </div>
        <Link href="/admin" className="px-4 py-2 bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
          Back to Admin
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-5">
          <div className="text-xs font-bold uppercase text-on-surface-variant mb-2">Total Reviews</div>
          <div className="text-2xl font-black text-on-surface">{reviews.length}</div>
        </div>
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-5">
          <div className="text-xs font-bold uppercase text-on-surface-variant mb-2">Avg Rating</div>
          <div className="text-2xl font-black text-yellow-400">⭐ {avgRating}</div>
        </div>
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-5">
          <div className="text-xs font-bold uppercase text-on-surface-variant mb-2">5-Star</div>
          <div className="text-2xl font-black text-green-400">{reviews.filter(r => r.rating === 5).length}</div>
        </div>
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-5">
          <div className="text-xs font-bold uppercase text-on-surface-variant mb-2">1-Star</div>
          <div className="text-2xl font-black text-red-400">{reviews.filter(r => r.rating === 1).length}</div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or comment..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 bg-surface-container-high rounded-lg border border-white/5 text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary/30 transition-all"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setFilterRating(null)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterRating === null ? 'bg-primary text-on-primary-container' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}
          >
            All
          </button>
          {STARS.map(star => (
            <button
              key={star}
              onClick={() => setFilterRating(star === filterRating ? null : star)}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${filterRating === star ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}
            >
              {star}★
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-12"><span className="material-symbols-outlined animate-spin text-primary text-4xl">hourglass_top</span></div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map(review => (
            <div key={review.id} className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6 hover:border-primary/20 transition-all">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="shrink-0">
                  {review.reviewer?.avatar_url ? (
                    <Image src={review.reviewer.avatar_url} alt={review.reviewer.full_name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-sm">person</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
                    <div>
                      <span className="font-bold text-on-surface text-sm">{review.reviewer?.full_name || 'Anonymous'}</span>
                      {review.reviewee?.full_name && (
                        <span className="text-on-surface-variant text-xs ml-2">→ {review.reviewee.full_name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {STARS.map(s => (
                        <span key={s} className={`text-sm ${s <= (review.rating || 0) ? 'text-yellow-400' : 'text-on-surface-variant/30'}`}>★</span>
                      ))}
                    </div>
                  </div>

                  {review.comment && (
                    <p className="text-sm text-on-surface-variant mb-2 p-3 bg-surface-container-lowest rounded-lg border border-white/5">
                      {review.comment}
                    </p>
                  )}

                  <p className="text-xs text-on-surface-variant">
                    {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' · '}Review #{review.id}
                  </p>
                </div>

                {/* Delete */}
                <div className="shrink-0">
                  {confirmDelete === review.id ? (
                    <div className="flex flex-col gap-2">
                      <button onClick={() => handleDelete(review.id)} className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-bold uppercase tracking-wider transition-all">
                        Confirm
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 bg-surface-container-high text-on-surface-variant rounded-lg text-xs font-bold transition-all">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(review.id)}
                      className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 block">rate_review</span>
          <h3 className="text-xl font-bold text-on-surface mb-2">No Reviews Found</h3>
          <p className="text-on-surface-variant">No reviews match your current filters.</p>
        </div>
      )}
    </div>
  )
}
