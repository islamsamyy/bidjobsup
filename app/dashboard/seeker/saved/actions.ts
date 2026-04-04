'use server'

import { unsaveJob as unsaveJobBase } from '@/lib/actions/saved_items'
import { revalidatePath } from 'next/cache'

export async function handleUnsaveJob(jobId: number, formData: FormData): Promise<void> {
  await unsaveJobBase(jobId)
  revalidatePath('/dashboard/seeker/saved')
}
