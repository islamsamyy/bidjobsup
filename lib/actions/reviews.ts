'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createReview({
  revieweeId,
  jobId,
  rating,
  comment,
}: {
  revieweeId: number
  jobId: number
  rating: number
  comment: string
}) {
  // Validate input
  if (!rating || rating < 1 || rating > 5) {
    return { error: 'Rating must be between 1 and 5.' }
  }
  if (!comment || comment.trim().length === 0) {
    return { error: 'Comment cannot be empty.' }
  }
  if (comment.length > 1000) {
    return { error: 'Comment must be under 1000 characters.' }
  }

  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated.' }
  }

  // Get reviewer ID
  const { data: reviewer } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!reviewer) return { error: 'Reviewer profile not found.' }

  // Ensure reviewer is not reviewing themselves
  if (reviewer.id === revieweeId) {
    return { error: 'You cannot review yourself.' }
  }

  // Verify the job exists and reviewer was involved
  const { data: job } = await supabase
    .from('jobs')
    .select('employer_id, status')
    .eq('id', jobId)
    .single()

  if (!job) return { error: 'Job not found.' }

  // Check if reviewer is involved in this job (either employer or accepted seeker)
  if (job.employer_id !== reviewer.id) {
    // If reviewer is not the employer, they must be an accepted seeker for this job
    const { data: bid } = await supabase
      .from('bids')
      .select('id')
      .eq('job_id', jobId)
      .eq('bidder_id', reviewer.id)
      .eq('status', 'accepted')
      .single()

    if (!bid) {
      return { error: 'You are not involved in this job.' }
    }
  }

  // Create review
  const { error } = await supabase
    .from('reviews')
    .insert({
      reviewer_id: reviewer.id,
      reviewee_id: revieweeId,
      job_id: jobId,
      rating,
      comment: comment.trim(),
    })

  if (error) {
    if (error.code === '23505') {
      return { error: 'You have already reviewed this person for this job.' }
    }
    return { error: 'Failed to create review.' }
  }

  revalidatePath(`/talent/${revieweeId}`)
  return { success: true }
}

export async function deleteReview(reviewId: number) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated.' }
  }

  const { data: reviewer } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!reviewer) return { error: 'User not found.' }

  // Only allow reviewer to delete their own review
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('reviewer_id', reviewer.id)

  if (error) return { error: 'Failed to delete review.' }

  revalidatePath('/community')
  return { success: true }
}
