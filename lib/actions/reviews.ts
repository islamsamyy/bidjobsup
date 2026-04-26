'use server'

import { revalidatePath } from 'next/cache'
import { getAuthUser } from '@/lib/supabase/get-user'
import { toActionError } from '@/lib/errors'

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
  try {
    if (!rating || rating < 1 || rating > 5) return { error: 'Rating must be between 1 and 5.' }
    if (!comment?.trim()) return { error: 'Comment cannot be empty.' }
    if (comment.length > 1000) return { error: 'Comment must be under 1000 characters.' }

    const auth = await getAuthUser()
    if (!auth.ok) return { error: auth.error }
    const { user, supabase } = auth

    if (user?.id === revieweeId) return { error: 'You cannot review yourself.' }

    if (jobId > 0) {
      const { data: job } = await supabase!
        .from('jobs')
        .select('employer_id')
        .eq('id', jobId)
        .single()

      if (!job) return { error: 'Job not found.' }

      if (job.employer_id !== user?.id) {
        const { data: bid } = await supabase!
          .from('bids')
          .select('id')
          .eq('job_id', jobId)
          .eq('bidder_id', user?.id)
          .eq('status', 'accepted')
          .single()

        if (!bid) return { error: 'You are not involved in this job.' }
      }
    }

    const { error } = await supabase!.from('reviews').insert({
      reviewer_id: user?.id,
      reviewee_id: revieweeId,
      job_id: jobId,
      rating,
      comment: comment.trim(),
    })

    if (error) {
      if (error.code === '23505') return { error: 'You already reviewed this person for this job.' }
      return { error: 'Failed to create review.' }
    }

    revalidatePath(`/talent/${revieweeId}`)
    return { success: true }
  } catch (err) {
    return toActionError(err) as any
  }
}

export async function deleteReview(reviewId: number) {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { error: auth.error }
    const { user, supabase } = auth

    const { error } = await supabase!
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('reviewer_id', user?.id)

    if (error) return { error: 'Failed to delete review.' }

    revalidatePath('/community')
    return { success: true }
  } catch (err) {
    return toActionError(err) as any
  }
}
