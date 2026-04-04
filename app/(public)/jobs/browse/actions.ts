'use server'

import { redirect } from 'next/navigation'

export async function handleSearch(formData: FormData) {
  const q = formData.get('query')
  const l = formData.get('location')
  const c = formData.get('category')
  redirect(`/jobs/browse?q=${q || ''}&l=${l || ''}&c=${c || ''}`)
}
