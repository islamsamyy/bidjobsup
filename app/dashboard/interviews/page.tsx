import { getAuthUser } from '@/lib/auth-utils'
import { getUserInterviews } from '@/lib/actions/interviews'
import InterviewsClient from './InterviewsClient'
import { PageHeader } from '../components/PageHeader'

export const metadata = {
  title: 'Interviews — BidJobs',
  description: 'Schedule and manage your job interviews'
}

export default async function InterviewsPage() {
  const { user: currentUser } = await getAuthUser()
  const { interviews = [], error } = await getUserInterviews()

  if (error) {
    console.error('Error fetching interviews:', error)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <PageHeader titleKey="interviewsPage.title" subtitleKey="interviewsPage.subtitle" />

      <InterviewsClient
        initialInterviews={interviews}
        currentUserId={parseInt(currentUser?.id || '0')} 
      />
    </main>
  )
}
