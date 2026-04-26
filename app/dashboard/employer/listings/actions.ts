'use server'

import { closeJob as baseCloseJob, deleteJob as baseDeleteJob } from '@/lib/actions/jobs'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function handleCloseJob(jobId: string) {
  const res = await baseCloseJob(jobId)
  if ('success' in res && res.success) {
    revalidatePath('/dashboard/employer/listings')
  }
}

export async function handleDeleteJob(jobId: number) {
  const res = await baseDeleteJob(jobId)
  if ('success' in res && res.success) {
    revalidatePath('/dashboard/employer/listings')
  }
}
