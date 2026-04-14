import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ReviewManagementClient from './client'

export const dynamic = 'force-dynamic'

export default async function ReviewsPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/sign-in')
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('id, user_type')
    .eq('auth_id', user.id)
    .single()

  if (!currentUser) {
    redirect('/join')
  }

  // Fetch all reviews received by current user
  const { data: reviewsData, error } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      created_at,
      job_id,
      reviewer_id,
      reviewer:reviewer_id(id, full_name, avatar_url, email),
      job:job_id(id, title)
    `)
    .eq('reviewee_id', currentUser.id)
    .order('created_at', { ascending: false })

  const reviews = reviewsData?.map(r => ({
    ...r,
    reviewer: r.reviewer && Array.isArray(r.reviewer) ? r.reviewer[0] : r.reviewer,
    job: r.job && Array.isArray(r.job) ? r.job[0] : r.job,
  }))

  if (error) {
    console.error('Error fetching reviews:', error)
  }

  // Calculate average rating
  const averageRating = reviews && reviews.length > 0
    ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
    : 0

  const totalReviews = reviews?.length || 0

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-6 group"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
        </Link>

        <h1 className="font-headline text-5xl font-bold text-on-surface mb-2">Reviews & Ratings</h1>
        <p className="text-on-surface-variant text-lg">
          Manage and view all reviews you&apos;ve received from clients and collaborators
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Average Rating Card */}
        <div className="glass border border-outline-variant/15 rounded-xl p-8">
          <p className="text-on-surface-variant text-sm uppercase tracking-widest font-semibold mb-4">Average Rating</p>
          <div className="flex items-baseline gap-3">
            <span className="font-headline text-5xl font-bold text-on-surface">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-on-surface-variant text-lg">/5</span>
          </div>
          <div className="flex gap-1 mt-4">
            {[1, 2, 3, 4, 5].map(i => (
              <span
                key={i}
                className={`material-symbols-outlined text-xl ${
                  i <= Math.round(averageRating)
                    ? 'text-primary'
                    : 'text-outline-variant/30'
                }`}
              >
                star
              </span>
            ))}
          </div>
        </div>

        {/* Total Reviews Card */}
        <div className="glass border border-outline-variant/15 rounded-xl p-8">
          <p className="text-on-surface-variant text-sm uppercase tracking-widest font-semibold mb-4">Total Reviews</p>
          <span className="font-headline text-5xl font-bold text-on-surface">{totalReviews}</span>
          <p className="text-on-surface-variant text-sm mt-4">
            {totalReviews === 1 ? '1 review received' : `${totalReviews} reviews received`}
          </p>
        </div>

        {/* Rating Breakdown Card */}
        <div className="glass border border-outline-variant/15 rounded-xl p-8">
          <p className="text-on-surface-variant text-sm uppercase tracking-widest font-semibold mb-4">Rating Distribution</p>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = reviews?.filter(r => r.rating === rating).length || 0
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs text-on-surface-variant w-6">{rating}★</span>
                  <div className="flex-1 h-2 bg-outline-variant/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-on-surface-variant w-8 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="mb-12">
        <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">All Reviews</h2>
        {totalReviews === 0 ? (
          <div className="glass border border-outline-variant/15 rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant/30 block mb-4">
              star_rate
            </span>
            <p className="text-on-surface-variant text-lg mb-4">
              No reviews yet
            </p>
            <p className="text-on-surface-variant text-sm">
              Complete your first project to receive reviews from clients and collaborators.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <ReviewManagementClient reviews={reviews || []} currentUserId={currentUser.id} />
          </div>
        )}
      </div>
    </main>
  )
}
