import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import JobSearchClient from '@/components/features/seeker/JobSearchClient'

export const metadata = {
  title: 'Search Missions | BidJobs',
  description: 'Find premium remote work opportunities.',
}

export default async function SeekerSearchPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/sign-in')
  }

  // Fetch Jobs
  // We want to fetch public, open jobs that are not expired
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching jobs:", error)
  }

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      <JobSearchClient initialJobs={jobs || []} />
    </main>
  )
}
