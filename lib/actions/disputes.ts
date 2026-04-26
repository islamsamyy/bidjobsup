'use server'

import { revalidatePath } from 'next/cache'
import { getAuthUser } from '@/lib/supabase/get-user'
import { toActionError } from '@/lib/errors'

// ─── Types ────────────────────────────────────────────────────────────────────

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
  initiator?: { full_name: string; avatar_url: string | null }
  defendant?: { full_name: string; avatar_url: string | null }
  job?: { title: string }
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
  user?: { full_name: string; avatar_url: string | null }
}

// ─── Internal helper ──────────────────────────────────────────────────────────

function isDisputeParticipant(
  dispute: Pick<Dispute, 'initiated_by' | 'against_user'>,
  userId: number
) {
  return dispute.initiated_by === userId || dispute.against_user === userId
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function getUserDisputes(filterStatus?: string): Promise<{
  disputes: Dispute[]
  error?: string
}> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { disputes: [], error: auth.error }
    const { user, supabase } = auth

    let query = supabase
      .from('disputes')
      .select(`
        *,
        initiator:initiated_by(full_name, avatar_url),
        defendant:against_user(full_name, avatar_url),
        job:job_id(title)
      `)
      .or(`initiated_by.eq.${user?.id},against_user?.eq.${user?.id}`)

    if (filterStatus) query = query.eq('status', filterStatus)

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) return { disputes: [], error: error.message }
    return { disputes: (data as Dispute[]) || [] }
  } catch (err) {
    return toActionError(err) as any
  }
}

export async function getDisputeDetails(disputeId: number): Promise<{
  dispute: Dispute | null
  evidence: DisputeEvidence[]
  messages: DisputeMessage[]
  error?: string
}> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { dispute: null, evidence: [], messages: [], error: auth.error }
    const { user, supabase } = auth

    const { data: dispute, error: disputeError } = await supabase!
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
    if (!isDisputeParticipant(dispute, user?.id)) {
      return { dispute: null, evidence: [], messages: [], error: 'Unauthorized' }
    }

    // Fetch evidence and messages in parallel
    const [evidenceRes, messagesRes] = await Promise.all([
      supabase
        .from('dispute_evidence')
        .select('*')
        .eq('dispute_id', disputeId)
        .order('created_at', { ascending: false }),
      supabase
        .from('dispute_messages')
        .select('*, user:users(full_name, avatar_url)')
        .eq('dispute_id', disputeId)
        .order('created_at', { ascending: true }),
    ])

    return {
      dispute,
      evidence: (evidenceRes.data as DisputeEvidence[]) || [],
      messages: (messagesRes.data as DisputeMessage[]) || [],
    }
  } catch (err) {
    return toActionError(err) as any
  }
}

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
    // Validate before hitting the DB
    if (!title?.trim()) return { success: false, error: 'Title is required' }
    if (!reason) return { success: false, error: 'Reason is required' }
    if (!description?.trim() || description.length < 20) {
      return { success: false, error: 'Description must be at least 20 characters' }
    }
    if (description.length > 5000) {
      return { success: false, error: 'Description must be under 5000 characters' }
    }

    const auth = await getAuthUser()
    if (!auth.ok) return { success: false, error: auth.error }
    const { user, supabase } = auth

    if (user?.id === againstUserId) return { success: false, error: 'Cannot dispute with yourself' }

    const { data: job } = await supabase!.from('jobs').select('id').eq('id', jobId).single()
    if (!job) return { success: false, error: 'Job not found' }

    const { data, error } = await supabase!
      .from('disputes')
      .insert({
        job_id: jobId,
        contract_id: contractId ?? null,
        initiated_by: user?.id,
        against_user: againstUserId,
        title: title.trim(),
        reason,
        description: description.trim(),
        status: 'open',
      })
      .select('id')
      .single()

    if (error) return { success: false, error: error.message }

    revalidatePath('/dashboard/disputes')
    return { success: true, id: data.id }
  } catch (err) {
    return toActionError(err) as any
  }
}

export async function addDisputeEvidence(
  disputeId: number,
  fileUrl: string,
  fileName: string,
  fileType?: string,
  description?: string
): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { success: false, error: auth.error }
    const { user, supabase } = auth

    const { data: dispute } = await supabase!
      .from('disputes')
      .select('initiated_by, against_user')
      .eq('id', disputeId)
      .single()

    if (!dispute || !isDisputeParticipant(dispute, user?.id)) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data, error } = await supabase!
      .from('dispute_evidence')
      .insert({
        dispute_id: disputeId,
        user_id: user?.id,
        file_url: fileUrl,
        file_name: fileName,
        file_type: fileType ?? null,
        description: description ?? null,
      })
      .select('id')
      .single()

    if (error) return { success: false, error: error.message }

    revalidatePath(`/dashboard/disputes/${disputeId}`)
    return { success: true, id: data.id }
  } catch (err) {
    return toActionError(err) as any
  }
}

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

    const auth = await getAuthUser()
    if (!auth.ok) return { success: false, error: auth.error }
    const { user, supabase } = auth

    const { data: dispute } = await supabase!
      .from('disputes')
      .select('initiated_by, against_user')
      .eq('id', disputeId)
      .single()

    if (!dispute || !isDisputeParticipant(dispute, user?.id)) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data, error } = await supabase!
      .from('dispute_messages')
      .insert({ dispute_id: disputeId, user_id: user?.id, message: message.trim() })
      .select('id')
      .single()

    if (error) return { success: false, error: error.message }

    revalidatePath(`/dashboard/disputes/${disputeId}`)
    return { success: true, id: data.id }
  } catch (err) {
    return toActionError(err) as any
  }
}

export async function updateDisputeStatus(
  disputeId: number,
  status: string,
  resolution?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { success: false, error: auth.error }
    const { user, supabase } = auth

    const { data: dispute } = await supabase!
      .from('disputes')
      .select('initiated_by')
      .eq('id', disputeId)
      .single()

    if (!dispute) return { success: false, error: 'Dispute not found' }
    if (dispute.initiated_by !== user?.id) {
      return { success: false, error: 'Only the initiator can update dispute status' }
    }

    const { error } = await supabase!
      .from('disputes')
      .update({ status, resolution: resolution ?? null, updated_at: new Date().toISOString() })
      .eq('id', disputeId)

    if (error) return { success: false, error: error.message }

    revalidatePath(`/dashboard/disputes/${disputeId}`)
    revalidatePath('/dashboard/disputes')
    return { success: true }
  } catch (err) {
    return toActionError(err) as any
  }
}
