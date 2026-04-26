'use server'

import { getAuthUser } from '@/lib/supabase/get-user'
import { toActionError } from '@/lib/errors'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Contract {
  id: number
  job_id: number
  freelancer_id: number
  employer_id: number
  title: string
  description: string | null
  amount: number
  currency: string
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'disputed'
  start_date: string | null
  end_date: string | null
  deadline: string | null
  milestone_count: number
  paid_amount: number
  created_at: string
  updated_at: string
  job?: { title: string }
  freelancer?: { full_name: string; avatar_url: string | null }
  employer?: { full_name: string; avatar_url: string | null }
}

export interface Milestone {
  id: number
  contract_id: number
  title: string
  description: string | null
  amount: number
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'paid' | 'disputed'
  due_date: string | null
  completed_date: string | null
  submission_notes: string | null
  approval_notes: string | null
  order_index: number
  created_at: string
  updated_at: string
}

// ─── Internal helper ──────────────────────────────────────────────────────────

function isParticipant(
  contract: Pick<Contract, 'freelancer_id' | 'employer_id'>,
  userId: number
) {
  return contract.freelancer_id === userId || contract.employer_id === userId
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function getUserContracts(filterStatus?: string): Promise<{
  contracts: Contract[]
  error?: string
}> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { contracts: [], error: auth.error }
    const { user, supabase } = auth

    let query = supabase
      .from('contracts')
      .select(`
        *,
        job:job_id(title),
        freelancer:freelancer_id(full_name, avatar_url),
        employer:employer_id(full_name, avatar_url)
      `)
      .or(`freelancer_id.eq.${user?.id},employer_id.eq.${user?.id}`)

    if (filterStatus) query = query.eq('status', filterStatus)

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) return { contracts: [], error: error.message }
    return { contracts: (data as Contract[]) || [] }
  } catch (err) {
    return toActionError(err) as any
  }
}

export async function getContractDetails(contractId: number): Promise<{
  contract: Contract | null
  milestones: Milestone[]
  error?: string
}> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { contract: null, milestones: [], error: auth.error }
    const { user, supabase } = auth

    const { data: contract, error: contractError } = await supabase!
      .from('contracts')
      .select(`
        *,
        job:job_id(title),
        freelancer:freelancer_id(full_name, avatar_url),
        employer:employer_id(full_name, avatar_url)
      `)
      .eq('id', contractId)
      .single()

    if (contractError || !contract) {
      return { contract: null, milestones: [], error: 'Contract not found' }
    }
    if (!isParticipant(contract, user?.id)) {
      return { contract: null, milestones: [], error: 'Unauthorized' }
    }

    const { data: milestones, error: milestonesError } = await supabase!
      .from('milestones')
      .select('*')
      .eq('contract_id', contractId)
      .order('order_index', { ascending: true })

    if (milestonesError) return { contract, milestones: [], error: milestonesError.message }
    return { contract, milestones: (milestones as Milestone[]) || [] }
  } catch (err) {
    return toActionError(err) as any
  }
}

export async function updateMilestoneStatus(
  milestoneId: number,
  status: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { success: false, error: auth.error }
    const { user, supabase } = auth

    const { data: milestone } = await supabase!
      .from('milestones')
      .select('contract_id')
      .eq('id', milestoneId)
      .single()

    if (!milestone) return { success: false, error: 'Milestone not found' }

    const { data: contract } = await supabase!
      .from('contracts')
      .select('freelancer_id, employer_id')
      .eq('id', milestone.contract_id)
      .single()

    if (!contract || !isParticipant(contract, user?.id)) {
      return { success: false, error: 'Unauthorized' }
    }

    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    }
    if (status === 'submitted') updateData.submission_notes = notes ?? null
    if (status === 'approved') {
      updateData.approval_notes = notes ?? null
      updateData.completed_date = new Date().toISOString()
    }

    const { error } = await supabase!.from('milestones').update(updateData).eq('id', milestoneId)
    if (error) return { success: false, error: error.message }

    return { success: true }
  } catch (err) {
    return toActionError(err) as any
  }
}

export async function updateContractStatus(
  contractId: number,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { success: false, error: auth.error }
    const { user, supabase } = auth

    const { data: contract } = await supabase!
      .from('contracts')
      .select('freelancer_id, employer_id')
      .eq('id', contractId)
      .single()

    if (!contract) return { success: false, error: 'Contract not found' }
    if (!isParticipant(contract, user?.id)) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase!
      .from('contracts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', contractId)

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err) {
    return toActionError(err) as any
  }
}

export async function releaseMilestonePayment(
  milestoneId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { success: false, error: auth.error }
    const { user, supabase } = auth

    const { data: milestone } = await supabase!
      .from('milestones')
      .select('contract_id, amount')
      .eq('id', milestoneId)
      .single()

    if (!milestone) return { success: false, error: 'Milestone not found' }

    const { data: contract } = await supabase!
      .from('contracts')
      .select('employer_id, paid_amount')
      .eq('id', milestone.contract_id)
      .single()

    if (!contract || contract.employer_id !== user?.id) {
      return { success: false, error: 'Only the employer can release payment' }
    }

    // Run both updates in parallel instead of sequentially
    const [milestoneRes, contractRes] = await Promise.all([
      supabase
        .from('milestones')
        .update({ status: 'paid', updated_at: new Date().toISOString() })
        .eq('id', milestoneId),
      supabase
        .from('contracts')
        .update({
          paid_amount: (contract.paid_amount || 0) + milestone.amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', milestone.contract_id),
    ])

    if (milestoneRes.error) return { success: false, error: milestoneRes.error.message }
    if (contractRes.error) return { success: false, error: contractRes.error.message }

    return { success: true }
  } catch (err) {
    return toActionError(err) as any
  }
}
