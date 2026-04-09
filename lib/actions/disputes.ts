'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Dispute {
  id: number
  job_id: number
  contract_id: number | null
  initiated_by: number
  against_user: number
  title: string
  reason: string
  description: string
  status: 'open' | 'in_review' | 'resolved' | 'escalated' | 'closed'
  resolution: string | null
  resolved_by: number | null
  created_at: string
  updated_at: string
  initiator?: {
    full_name: string
    avatar_url: string | null
  }
  defendant?: {
    full_name: string
    avatar_url: string | null
  }
  job?: {
    title: string
  }
}

export interface DisputeEvidence {
  id: number
  dispute_id: number
  user_id: number
  file_url: string
  file_name: string
  file_type: string | null
  description: string | null
  created_at: string
}

export interface DisputeMessage {
  id: number
  dispute_id: number
  user_id: number
  message: string
  created_at: string
  updated_at: string
  user?: {
    full_name: string
    avatar_url: string | null
  }
}

/**
 * Get all disputes for the current user
 */
export async function getUserDisputes(filterStatus?: string): Promise<{
  disputes: Dispute[]
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { disputes: [], error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return { disputes: [], error: 'Profile not found' }
    }

    let query = supabase
      .from('disputes')
      .select(`
        *,
        initiator:initiated_by(full_name, avatar_url),
        defendant:against_user(full_name, avatar_url),
        job:job_id(title)
      `)
      .or(`initiated_by.eq.${profile.id},against_user.eq.${profile.id}`)

    if (filterStatus) {
      query = query.eq('status', filterStatus)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching disputes:', error)
      return { disputes: [], error: error.message }
    }

    return { disputes: data || [] }
  } catch (err: any) {
    console.error('Error in getUserDisputes:', err)
    return { disputes: [], error: err.message }
  }
}

/**
 * Get dispute details with evidence and messages
 */
export async function getDisputeDetails(
  disputeId: number
): Promise<{
  dispute: Dispute | null
  evidence: DisputeEvidence[]
  messages: DisputeMessage[]
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { dispute: null, evidence: [], messages: [], error: 'Not authenticated' }
    }

    // Fetch dispute
    const { data: dispute, error: disputeError } = await supabase
      .from('disputes')
      .select(`
        *,
        initiator:initiated_by(full_name, avatar_url),
        defendant:against_user(full_name, avatar_url),
        job:job_id(title)
      `)
      .eq('id', disputeId)
      .single()

    if (disputeError || !dispute) {
      return { dispute: null, evidence: [], messages: [], error: 'Dispute not found' }
    }

    // Verify user has access to this dispute
    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile || (dispute.initiated_by !== profile.id && dispute.against_user !== profile.id)) {
      return { dispute: null, evidence: [], messages: [], error: 'Unauthorized' }
    }

    // Fetch evidence
    const { data: evidence, error: evidenceError } = await supabase
      .from('dispute_evidence')
      .select('*')
      .eq('dispute_id', disputeId)
      .order('created_at', { ascending: false })

    // Fetch messages
    const { data: messages, error: messagesError } = await supabase
      .from('dispute_messages')
      .select(`*, user:users(full_name, avatar_url)`)
      .eq('dispute_id', disputeId)
      .order('created_at', { ascending: true })

    return {
      dispute,
      evidence: evidence || [],
      messages: messages || [],
    }
  } catch (err: any) {
    console.error('Error in getDisputeDetails:', err)
    return { dispute: null, evidence: [], messages: [], error: err.message }
  }
}

/**
 * Create a new dispute
 */
export async function createDispute({
  jobId,
  contractId,
  againstUserId,
  title,
  reason,
  description,
}: {
  jobId: number
  contractId?: number | null
  againstUserId: number
  title: string
  reason: string
  description: string
}): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    if (!title?.trim()) {
      return { success: false, error: 'Title is required' }
    }
    if (!reason) {
      return { success: false, error: 'Reason is required' }
    }
    if (!description?.trim() || description.length < 20) {
      return { success: false, error: 'Description must be at least 20 characters' }
    }
    if (description.length > 5000) {
      return { success: false, error: 'Description must be under 5000 characters' }
    }

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return { success: false, error: 'Profile not found' }
    }

    if (profile.id === againstUserId) {
      return { success: false, error: 'Cannot dispute with yourself' }
    }

    // Verify job exists
    const { data: job } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', jobId)
      .single()

    if (!job) {
      return { success: false, error: 'Job not found' }
    }

    // Create dispute
    const { data, error } = await supabase
      .from('disputes')
      .insert({
        job_id: jobId,
        contract_id: contractId || null,
        initiated_by: profile.id,
        against_user: againstUserId,
        title: title.trim(),
        reason,
        description: description.trim(),
        status: 'open',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating dispute:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/disputes')
    return { success: true, id: data.id }
  } catch (err: any) {
    console.error('Error in createDispute:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Add evidence to dispute
 */
export async function addDisputeEvidence(
  disputeId: number,
  fileUrl: string,
  fileName: string,
  fileType?: string,
  description?: string
): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return { success: false, error: 'Profile not found' }
    }

    // Verify access to dispute
    const { data: dispute } = await supabase
      .from('disputes')
      .select('initiated_by, against_user')
      .eq('id', disputeId)
      .single()

    if (!dispute || (dispute.initiated_by !== profile.id && dispute.against_user !== profile.id)) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('dispute_evidence')
      .insert({
        dispute_id: disputeId,
        user_id: profile.id,
        file_url: fileUrl,
        file_name: fileName,
        file_type: fileType || null,
        description: description || null,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error adding evidence:', error)
      return { success: false, error: error.message }
    }

    revalidatePath(`/dashboard/disputes/${disputeId}`)
    return { success: true, id: data.id }
  } catch (err: any) {
    console.error('Error in addDisputeEvidence:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Add message to dispute discussion
 */
export async function addDisputeMessage(
  disputeId: number,
  message: string
): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    if (!message?.trim() || message.length < 5) {
      return { success: false, error: 'Message must be at least 5 characters' }
    }
    if (message.length > 2000) {
      return { success: false, error: 'Message must be under 2000 characters' }
    }

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return { success: false, error: 'Profile not found' }
    }

    // Verify access to dispute
    const { data: dispute } = await supabase
      .from('disputes')
      .select('initiated_by, against_user')
      .eq('id', disputeId)
      .single()

    if (!dispute || (dispute.initiated_by !== profile.id && dispute.against_user !== profile.id)) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('dispute_messages')
      .insert({
        dispute_id: disputeId,
        user_id: profile.id,
        message: message.trim(),
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error adding message:', error)
      return { success: false, error: error.message }
    }

    revalidatePath(`/dashboard/disputes/${disputeId}`)
    return { success: true, id: data.id }
  } catch (err: any) {
    console.error('Error in addDisputeMessage:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Update dispute status
 */
export async function updateDisputeStatus(
  disputeId: number,
  status: string,
  resolution?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: dispute } = await supabase
      .from('disputes')
      .select('initiated_by')
      .eq('id', disputeId)
      .single()

    if (!dispute) {
      return { success: false, error: 'Dispute not found' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile || dispute.initiated_by !== profile.id) {
      return { success: false, error: 'Only the initiator can update dispute status' }
    }

    const { error } = await supabase
      .from('disputes')
      .update({
        status,
        resolution: resolution || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', disputeId)

    if (error) {
      console.error('Error updating dispute:', error)
      return { success: false, error: error.message }
    }

    revalidatePath(`/dashboard/disputes/${disputeId}`)
    revalidatePath('/dashboard/disputes')
    return { success: true }
  } catch (err: any) {
    console.error('Error in updateDisputeStatus:', err)
    return { success: false, error: err.message }
  }
}
