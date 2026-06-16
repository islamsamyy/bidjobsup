'use server'

import { revalidatePath } from 'next/cache'
import { getAuthUser } from '@/lib/supabase/get-user'

export async function acceptInvitation(
  invitationId: number
): Promise<{ success: boolean; error?: string }> {
  const auth = await getAuthUser()
  if (!auth.ok) return { success: false, error: auth.error }
  const { user, supabase } = auth

  const { error } = await supabase
    .from('invitations')
    .update({ status: 'accepted' })
    .eq('id', invitationId)
    .eq('recipient_id', user.id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/offers')
  return { success: true }
}

export async function declineInvitation(
  invitationId: number
): Promise<{ success: boolean; error?: string }> {
  const auth = await getAuthUser()
  if (!auth.ok) return { success: false, error: auth.error }
  const { user, supabase } = auth

  const { error } = await supabase
    .from('invitations')
    .update({ status: 'declined' })
    .eq('id', invitationId)
    .eq('recipient_id', user.id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/offers')
  return { success: true }
}

export async function acceptOffer(
  offerId: number
): Promise<{ success: boolean; error?: string }> {
  const auth = await getAuthUser()
  if (!auth.ok) return { success: false, error: auth.error }
  const { user, supabase } = auth

  const { data, error } = await supabase
    .from('offers')
    .update({ status: 'accepted' })
    .eq('id', offerId)
    .eq('to_user_id', user.id)
    .eq('status', 'pending')
    .select('id')
    .single()

  if (error || !data) return { success: false, error: 'Offer not found or already processed.' }
  revalidatePath('/dashboard/offers')
  return { success: true }
}

export async function declineOffer(
  offerId: number
): Promise<{ success: boolean; error?: string }> {
  const auth = await getAuthUser()
  if (!auth.ok) return { success: false, error: auth.error }
  const { user, supabase } = auth

  const { data, error } = await supabase
    .from('offers')
    .update({ status: 'declined' })
    .eq('id', offerId)
    .eq('to_user_id', user.id)
    .eq('status', 'pending')
    .select('id')
    .single()

  if (error || !data) return { success: false, error: 'Offer not found or already processed.' }
  revalidatePath('/dashboard/offers')
  return { success: true }
}
