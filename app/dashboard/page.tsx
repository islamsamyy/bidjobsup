import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DashboardLocatorPage() {
  const supabase = await createClient()

  // 1. Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/sign-in')
  }

  // 2. Fetch user profile from the database
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('user_type')
    .eq('auth_id', user.id)
    .single()

  if (profileError || !profile) {
    // If profile doesn't exist, redirect to join or a profile setup
    redirect('/join')
  }

  // 3. Redirect matching their role
  if (profile.user_type === 'employer') {
    redirect('/dashboard/employer')
  } else if (profile.user_type === 'jobseeker' || profile.user_type === 'both') {
    redirect('/dashboard/seeker')
  } else {
    redirect('/')
  }
}
