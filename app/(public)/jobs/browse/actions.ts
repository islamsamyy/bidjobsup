'use server'

import { redirect } from 'next/navigation'

export async function handleSearch(formData: FormData) {
  const q = formData.get('query')
  const l = formData.get('location')
  const c = formData.get('category')
  const budgetMin = formData.get('budget_min')
  const budgetMax = formData.get('budget_max')
  const jobType = formData.get('job_type')
  const experienceLevel = formData.get('experience_level')
  const sort = formData.get('sort') || 'newest'

  const params = new URLSearchParams()
  if (q) params.append('q', q as string)
  if (l) params.append('l', l as string)
  if (c) params.append('c', c as string)
  if (budgetMin) params.append('budget_min', budgetMin as string)
  if (budgetMax) params.append('budget_max', budgetMax as string)
  if (jobType) params.append('job_type', jobType as string)
  if (experienceLevel) params.append('experience_level', experienceLevel as string)
  if (sort) params.append('sort', sort as string)

  redirect(`/jobs/browse?${params.toString()}`)
}
