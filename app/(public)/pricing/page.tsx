import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import { PricingPageClient } from '@/components/features/PricingPageClient'

export const metadata = {
  title: 'Pricing Plans | BidJobs — Invest in Your Career Legacy',
  description: 'Join the elite tier of Saudi talent. Scale your visibility, optimize your applications, and land high-stakes roles.',
}

export default function PricingPage() {
  return (
    <>
      <PublicHeader />
      <PricingPageClient />
      <PublicFooter />
    </>
  )
}