'use server'

import { revalidatePath } from 'next/cache'
import { tryGetAuth } from '@/lib/auth-utils'
import { createNotification } from '@/lib/actions/notifications'
import { sendBidStatusEmail, sendNewBidEmail } from '@/lib/email'

export async function submitBid(
  jobId: number | string,
  amount: number,
  proposal: string,
  deliveryDays: number
) {
  const auth = await tryGetAuth()
  if (!auth.ok) return { error: auth.error }
  const { profile, supabase } = auth

  const { data: jobData } = await supabase!
    .from('jobs')
    .select('title, employer_id, employer:users!employer_id(id, auth_id)')
    .eq('id', Number(jobId))
    .single()

  const { data, error } = await supabase!
    .from('bids')
    .insert([{
      job_id: Number(jobId),
      bidder_id: profile?.id,
      amount,
      proposal,
      delivery_days: deliveryDays,
      status: 'pending',
    }])
    .select()
    .single()

  if (error) return { error: error.message }

  if (jobData?.employer) {
    const employer = jobData.employer as any
    await createNotification({
      userId: employer.id,
      userAuthId: employer.auth_id,
      type: 'new_bid',
      title: 'New Bid Received',
      content: `${profile?.full_name || 'Someone'} submitted a bid for "${jobData.title}"`,
      link: `/dashboard/employer/listings`,
    })

    const { data: employerAuth } = await supabase!.auth.admin.getUserById(employer.auth_id)
    if (employerAuth?.user?.email) {
      await sendNewBidEmail({
        to: employerAuth.user?.email,
        recipientName: employer.full_name || 'Employer',
        seekerName: profile?.full_name || 'A talent',
        jobTitle: jobData.title,
        jobId: String(jobId),
      }).catch(() => {})
    }
  }

  revalidatePath('/dashboard/seeker/search')
  revalidatePath('/dashboard/employer/listings')
  revalidatePath(`/jobs/${jobId}`)

  return { success: true, bid: data }
}

export async function updateBidStatus(
  bidId: string | number,
  status: 'accepted' | 'rejected' | 'pending' | 'interview'
) {
  const auth = await tryGetAuth()
  if (!auth.ok) return { error: auth.error }
  const { user, profile, supabase } = auth

  if (profile?.user_type !== 'employer' && profile?.user_type !== 'both') {
    return { error: 'Unauthorized: Only employers can update bid status.' }
  }

  const { data: bidData, error: bidFetchError } = await supabase!
    .from('bids')
    .select('*, job:jobs!job_id(employer_id, title), bidder:users!bidder_id(id, auth_id, full_name)')
    .eq('id', Number(bidId))
    .single()

  if (bidFetchError || !bidData) return { error: 'Bid not found' }

  if ((bidData as any).job.employer_id !== profile?.id) {
    return { error: 'Unauthorized: You do not own this job.' }
  }

  const { data, error } = await supabase!
    .from('bids')
    .update({ status })
    .eq('id', Number(bidId))
    .select()
    .single()

  if (error) return { error: error.message }

  if (bidData.bidder) {
    const bidder = bidData.bidder as any
    const jobTitle = (bidData as any).job.title
    const content =
      status === 'interview'
        ? `The employer of "${jobTitle}" has started an interview. Check your messages.`
        : `Your proposal for "${jobTitle}" has been ${status}.`

    await createNotification({
      userId: bidder.id,
      userAuthId: bidder.auth_id,
      type: 'bid_update',
      title: `Bid Status: ${status.toUpperCase()}`,
      content,
      link: `/dashboard/seeker/applications`,
    })

    const { data: seekerAuth } = await supabase!.auth.admin.getUserById(bidder.auth_id)
    if (seekerAuth?.user?.email) {
      await sendBidStatusEmail({
        to: seekerAuth.user?.email,
        recipientName: bidder.full_name || 'Applicant',
        jobTitle,
        status,
      }).catch(() => {})
    }
  }

  revalidatePath('/dashboard/employer/listings')
  revalidatePath('/dashboard/seeker/applications')

  return { success: true, bid: data }
}

export async function withdrawBid(bidId: string | number) {
  const auth = await tryGetAuth()
  if (!auth.ok) return { error: auth.error }
  const { profile, supabase } = auth

  const { error } = await supabase!
    .from('bids')
    .delete()
    .eq('id', Number(bidId))
    .eq('bidder_id', profile?.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/seeker')
  return { success: true }
}
