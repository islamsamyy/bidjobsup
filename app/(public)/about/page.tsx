import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import { AboutPageClient } from '@/components/features/AboutPageClient'

export const metadata = {
  title: 'About BidJobs — Pioneering the Digital Renaissance of Saudi Arabia',
  description: 'We are the bridge between elite talent and the monumental ambitions of Saudi Vision 2030.',
}

export default function AboutPage() {
  return (
    <>
      <PublicHeader />
      <AboutPageClient />
      <PublicFooter />
    </>
  )
}
