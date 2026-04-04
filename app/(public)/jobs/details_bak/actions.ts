'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function placeBid(formData: FormData) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return { error: 'You must be signed in to place a bid.' }
  }

  // 1. Validate Seeker Profile
  const { data: profile } = await supabase
    .from('users')
    .select('id, user_type')
    .eq('auth_id', session.user.id)
    .single()

  if (profile?.user_type !== 'jobseeker' && profile?.user_type !== 'both') {
    return { error: 'Only job seekers can place bids.' }
  }

  const jobId = formData.get('jobId') as string
  const amount = parseFloat(formData.get('amount') as string)
  const deliveryDays = parseInt(formData.get('deliveryDays') as string)
  const proposal = formData.get('proposal') as string

  if (!jobId || isNaN(amount) || isNaN(deliveryDays) || !proposal) {
    return { error: 'Please fill in all required fields accurately.' }
  }

  // 2. Insert Bid
  const { error: bidError } = await supabase
    .from('bids')
    .insert({
      job_id: jobId,
      seeker_id: profile.id, // Correct: Use internal ID
      amount,
      delivery_days: deliveryDays,
      proposal,
      status: 'pending'
    })

  if (bidError) {
    console.error('Bid error:', bidError)
    if (bidError.code === '23505') {
      return { error: 'You have already placed a bid on this mission.' }
    }
    return { error: 'Failed to protocol the bid. Please contact support.' }
  }

  revalidatePath(`/jobs/details`)
  revalidatePath(`/dashboard/seeker/bids`)
  
  return { success: true }
}
