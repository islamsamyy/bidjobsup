'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/actions/notifications'

export async function submitBid(jobId: number | string, amount: number, proposal: string, deliveryDays: number) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // Find the internal user record matching the Auth identity
  const { data: userRecord, error: userError } = await supabase
    .from('users')
    .select('id, user_type, full_name')
    .eq('auth_id', user.id)
    .single()

  if (userError || !userRecord) {
    return { error: 'User protocol entry not found. Please complete your registration.' }
  }

  // Ensure only jobseekers can bid
  if (userRecord.user_type !== 'jobseeker' && userRecord.user_type !== 'both') {
    return { error: 'Insufficient clearance. Only Seekers can submit proposals.' }
  }

  // Fetch job title and employer info
  const { data: jobData } = await supabase
    .from('jobs')
    .select('title, employer_id, employer:users!employer_id(id, auth_id)')
    .eq('id', Number(jobId))
    .single()

  // Insert the bid / application using the internal user ID
  const { data, error } = await supabase
    .from('bids')
    .insert([
      {
        job_id: Number(jobId),
        bidder_id: userRecord.id,
        amount: amount,
        proposal: proposal,
        delivery_days: deliveryDays,
        status: 'pending'
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Bid Error:', error)
    return { error: error.message }
  }

  // 4. Notify employer
  if (jobData?.employer) {
    await createNotification({
      userId: (jobData.employer as any).id,
      userAuthId: (jobData.employer as any).auth_id,
      type: 'new_bid',
      title: 'New Bid Protocol Initialized',
      content: `${userRecord.full_name || 'An agent'} submitted a bid for "${jobData.title}"`,
      link: `/dashboard/employer/listings`
    })
  }

  revalidatePath('/dashboard/seeker/search')
  revalidatePath('/dashboard/employer/listings')
  revalidatePath(`/jobs/${jobId}`)

  return { success: true, bid: data }
}

export async function updateBidStatus(bidId: string | number, status: 'accepted' | 'rejected' | 'pending' | 'interview') {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // 1. Get internal user ID
  const { data: userRecord } = await supabase
    .from('users')
    .select('id, user_type')
    .eq('auth_id', user.id)
    .single()

  if (!userRecord || (userRecord.user_type !== 'employer' && userRecord.user_type !== 'both')) {
    return { error: 'Insufficient permissions' }
  }

  // 2. Verify that this employer owns the job the bid is for
  const { data: bidData, error: bidFetchError } = await supabase
    .from('bids')
    .select('*, job:jobs!job_id(employer_id, title), bidder:users!bidder_id(id, auth_id)')
    .eq('id', Number(bidId))
    .single()

  if (bidFetchError || !bidData) {
    return { error: 'Bid not found' }
  }

  // Use (bidData as any).job.employer_id to avoid TS errors
  if ((bidData as any).job.employer_id !== userRecord.id) {
    return { error: 'Unauthorized: You are not the protocol owner of this mission.' }
  }

  // 3. Update status
  const { data, error } = await supabase
    .from('bids')
    .update({ status })
    .eq('id', Number(bidId))
    .select()
    .single()
    
  if (error) {
    return { error: error.message }
  }

  // 4. Notify Seeker
  if (bidData.bidder) {
    const statusText = status.toUpperCase()
    let content = `Your proposal for "${(bidData as any).job.title}" has been ${status}.`
    if (status === 'interview') {
      content = `The employer of "${(bidData as any).job.title}" has initiated an INTERVIEW protocol. Check your messages.`
    }

    await createNotification({
      userId: (bidData.bidder as any).id,
      userAuthId: (bidData.bidder as any).auth_id,
      type: 'bid_update',
      title: `Mission Status Modified: ${statusText}`,
      content,
      link: `/dashboard/seeker/applications`
    })
  }

  revalidatePath(`/dashboard/employer/listings`)
  revalidatePath(`/dashboard/seeker/applications`)
  
  return { success: true, bid: data }
}

export async function withdrawBid(bidId: string | number) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Unauthorized' }

  // 1. Get internal user ID
  const { data: userRecord } = await supabase
    .from('users')
    .select('id, user_type')
    .eq('auth_id', user.id)
    .single()

  if (!userRecord || (userRecord.user_type !== 'jobseeker' && userRecord.user_type !== 'both')) {
    return { error: 'Insufficient permissions' }
  }

  // 2. Delete bid
  const { error } = await supabase
    .from('bids')
    .delete()
    .eq('id', Number(bidId))
    .eq('bidder_id', userRecord.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/seeker')
  
  return { success: true }
}
