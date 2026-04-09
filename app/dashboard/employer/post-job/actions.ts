'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createJob(formData: FormData) {
  const supabase = await createClient()

  // 1. Check Auth & Profile
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('id, user_type')
    .eq('auth_id', user.id)
    .single()

  if (!profile || (profile.user_type !== 'employer' && profile.user_type !== 'both')) {
    throw new Error('Only employers can post jobs')
  }

  // 2. Parse Form Data
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const budgetMin = formData.get('budgetMin') ? parseInt(formData.get('budgetMin') as string) : null
  const budgetMax = formData.get('budgetMax') ? parseInt(formData.get('budgetMax') as string) : null
  const budgetType = (formData.get('budget_type') as 'fixed' | 'hourly') || 'fixed'
  const jobType = (formData.get('job_type') as 'full-time' | 'part-time' | 'contract' | 'project') || 'full-time'
  const experienceLevel = (formData.get('experience_level') as 'entry' | 'intermediate' | 'expert') || 'expert'
  const duration = (formData.get('duration') as any) || '1_week_to_1_month'

  // 3. Insert Job into Database
  const jobData: any = {
    employer_id: profile.id,
    employer_auth_id: user.id,
    title,
    description: description || 'No description provided.',
    category: category || 'General',
    budget_min: budgetMin,
    budget_max: budgetMax,
    budget_type: budgetType,
    job_type: jobType,
    experience_level: experienceLevel,
    duration,
    status: 'open',
  }

  const { data: insertedJob, error } = await supabase
    .from('jobs')
    .insert([jobData])
    .select()

  if (error) {
    console.error('Error creating job:', error)
    console.error('Job data attempted:', jobData)
    throw new Error(`Database error: ${error.message || 'Failed to create job'}`)
  }

  if (!insertedJob || insertedJob.length === 0) {
    throw new Error('Job created but no data returned')
  }

  // 4. Redirect on success
  revalidatePath('/dashboard/employer')
  revalidatePath('/dashboard/employer/listings')
  revalidatePath('/jobs/browse')
  redirect(`/dashboard/employer/listings`)
}
