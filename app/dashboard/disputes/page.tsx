import { getAuthUser } from '@/lib/auth-utils'
import { getUserDisputes } from '@/lib/actions/disputes'
import DisputesClient from './DisputesClient'
import { PageHeader } from '../components/PageHeader'

export const metadata = {
  title: 'Disputes — BidJobs',
  description: 'Manage your disputes and resolution progress'
}

export default async function DisputesPage() {
  const { profile: currentUser } = await getAuthUser()
  const { disputes = [], error } = await getUserDisputes()

  if (error) {
    console.error('Error fetching disputes:', error)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <PageHeader titleKey="disputesPage.title" subtitleKey="disputesPage.subtitle" />

      <DisputesClient
        initialDisputes={disputes}
        currentUserId={Number(currentUser?.id)}
      />
    </main>
  )
}
