'use server'

import { withdrawBid as baseWithdrawBid } from '@/lib/actions/bids'
import { revalidatePath } from 'next/cache'

export async function handleWithdrawBid(bidId: number) {
  const res = await baseWithdrawBid(bidId)
  if (res.success) {
    revalidatePath('/dashboard/seeker/applications')
  }
}
