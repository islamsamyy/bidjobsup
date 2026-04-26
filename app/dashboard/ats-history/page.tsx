import { getAuthUser } from '@/lib/auth-utils'
import ATSHistoryClient from './client'

export const metadata = {
  title: 'ATS Analysis History — BidJobs'
}

export default async function ATSHistoryPage() {
  await getAuthUser()
  return <ATSHistoryClient />
}
