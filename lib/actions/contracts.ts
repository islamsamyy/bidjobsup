'use server'

import { createClient } from '@/lib/supabase/server'

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
  job?: {
    title: string
  }
  freelancer?: {
    full_name: string
    avatar_url: string | null
  }
  employer?: {
    full_name: string
    avatar_url: string | null
  }
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

/**
 * Get all contracts for the current user
 */
export async function getUserContracts(
  filterStatus?: string
): Promise<{
  contracts: Contract[]
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { contracts: [], error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return { contracts: [], error: 'Profile not found' }
    }

    let query = supabase
      .from('contracts')
      .select(
        `*,
        job:job_id(title),
        freelancer:freelancer_id(full_name, avatar_url),
        employer:employer_id(full_name, avatar_url)`
      )
      .or(`freelancer_id.eq.${profile.id},employer_id.eq.${profile.id}`)

    if (filterStatus) {
      query = query.eq('status', filterStatus)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contracts:', error)
      return { contracts: [], error: error.message }
    }

    return { contracts: data || [] }
  } catch (err: any) {
    console.error('Error in getUserContracts:', err)
    return { contracts: [], error: err.message }
  }
}

/**
 * Get contract details with all milestones
 */
export async function getContractDetails(
  contractId: number
): Promise<{
  contract: Contract | null
  milestones: Milestone[]
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { contract: null, milestones: [], error: 'Not authenticated' }
    }

    // Fetch contract
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .select(
        `*,
        job:job_id(title),
        freelancer:freelancer_id(full_name, avatar_url),
        employer:employer_id(full_name, avatar_url)`
      )
      .eq('id', contractId)
      .single()

    if (contractError || !contract) {
      return { contract: null, milestones: [], error: 'Contract not found' }
    }

    // Verify user has access to this contract
    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile || (contract.freelancer_id !== profile.id && contract.employer_id !== profile.id)) {
      return { contract: null, milestones: [], error: 'Unauthorized' }
    }

    // Fetch milestones
    const { data: milestones, error: milestonesError } = await supabase
      .from('milestones')
      .select('*')
      .eq('contract_id', contractId)
      .order('order_index', { ascending: true })

    if (milestonesError) {
      console.error('Error fetching milestones:', milestonesError)
      return { contract, milestones: [], error: milestonesError.message }
    }

    return { contract, milestones: milestones || [] }
  } catch (err: any) {
    console.error('Error in getContractDetails:', err)
    return { contract: null, milestones: [], error: err.message }
  }
}

/**
 * Update milestone status
 */
export async function updateMilestoneStatus(
  milestoneId: number,
  status: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Verify user has access
    const { data: milestone } = await supabase
      .from('milestones')
      .select('contract_id')
      .eq('id', milestoneId)
      .single()

    if (!milestone) {
      return { success: false, error: 'Milestone not found' }
    }

    const { data: contract } = await supabase
      .from('contracts')
      .select('freelancer_id, employer_id')
      .eq('id', milestone.contract_id)
      .single()

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile || (contract?.freelancer_id !== profile.id && contract?.employer_id !== profile.id)) {
      return { success: false, error: 'Unauthorized' }
    }

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === 'submitted') {
      updateData.submission_notes = notes || null
    } else if (status === 'approved') {
      updateData.approval_notes = notes || null
      updateData.completed_date = new Date().toISOString()
    }

    const { error } = await supabase
      .from('milestones')
      .update(updateData)
      .eq('id', milestoneId)

    if (error) {
      console.error('Error updating milestone:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Error in updateMilestoneStatus:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Update contract status
 */
export async function updateContractStatus(
  contractId: number,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: contract } = await supabase
      .from('contracts')
      .select('freelancer_id, employer_id')
      .eq('id', contractId)
      .single()

    if (!contract) {
      return { success: false, error: 'Contract not found' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile || (contract.freelancer_id !== profile.id && contract.employer_id !== profile.id)) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('contracts')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', contractId)

    if (error) {
      console.error('Error updating contract:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Error in updateContractStatus:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Release payment for a milestone (mark as paid)
 */
export async function releaseMilestonePayment(
  milestoneId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get milestone and contract
    const { data: milestone } = await supabase
      .from('milestones')
      .select('contract_id, amount')
      .eq('id', milestoneId)
      .single()

    if (!milestone) {
      return { success: false, error: 'Milestone not found' }
    }

    const { data: contract } = await supabase
      .from('contracts')
      .select('employer_id')
      .eq('id', milestone.contract_id)
      .single()

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    // Only employer can release payment
    if (!profile || contract?.employer_id !== profile.id) {
      return { success: false, error: 'Only employer can release payment' }
    }

    // Update milestone status
    const { error: milestoneError } = await supabase
      .from('milestones')
      .update({
        status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('id', milestoneId)

    if (milestoneError) {
      return { success: false, error: milestoneError.message }
    }

    // Update contract paid_amount
    const { data: existingContract } = await supabase
      .from('contracts')
      .select('paid_amount')
      .eq('id', milestone.contract_id)
      .single()

    const newPaidAmount = (existingContract?.paid_amount || 0) + milestone.amount

    const { error: contractError } = await supabase
      .from('contracts')
      .update({
        paid_amount: newPaidAmount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', milestone.contract_id)

    if (contractError) {
      return { success: false, error: contractError.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Error in releaseMilestonePayment:', err)
    return { success: false, error: err.message }
  }
}
