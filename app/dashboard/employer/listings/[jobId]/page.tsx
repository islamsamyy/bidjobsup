import { getAuthUserAs } from '@/lib/auth-utils'
import { redirect } from 'next/navigation'
import ApplicantReviewClient from '@/components/features/employer/ApplicantReviewClient'

export default async function JobApplicantsPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { profile, supabase } = await getAuthUserAs('employer')

  // In Next.js 15+, params is a Promise
  const { jobId } = await params;

  // 2. Fetch Job details and ensure ownership
  const { data: job, error: jobError } = await supabase!
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .eq('employer_id', profile?.id)
    .single()

  if (jobError || !job) {
    redirect('/dashboard/employer/listings')
  }

  // 3. Fetch Bids for this job with seeker profile details
  const { data: bids, error: bidsError } = await supabase!
    .from('bids')
    .select(`
      *,
      users:users!bidder_id (
        id,
        full_name,
        email,
        avatar_url,
        username
      )
    `)
    .eq('job_id', jobId)
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <ApplicantReviewClient job={job} bids={bids || []} />
    </main>
  )
}
