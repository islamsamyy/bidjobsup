import { createClient } from '@/lib/supabase/server'
import TalentPageClient from './TalentPageClient'

export const metadata = {
  title: 'Find Talent | BidJobs — Vision 2030 Specialist Network',
  description: 'Connect with elite specialists, from luxury architects to high-stakes developers, defining Saudi Vision 2030.',
}

export default async function FindTalentPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; industry?: string }>
}) {
  const params = await searchParams
  const query = params?.query || ''
  const industry = params?.industry || ''

  const supabase = await createClient()

  let q = supabase
    .from('users')
    .select('*')
    // We only want jobseekers or both
    .neq('user_type', 'employer')
    .order('created_at', { ascending: false })

  if (query) {
    q = q.or(`full_name.ilike.%${query}%,skills.ilike.%${query}%,bio.ilike.%${query}%`)
  }

  if (industry) {
    q = q.eq('industry', industry)
  }

  const { data: talents, error } = await q.limit(20)

  // Fetch review stats for each talent
  const talentsWithRatings = await Promise.all(
    (talents || []).map(async (talent) => {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewee_id', talent.id)

      const avgRating = reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null

      return {
        ...talent,
        avgRating,
        reviewCount: reviews?.length || 0,
      }
    })
  )

  // Fetch unique industries from job categories for filter
  const { data: industriesData } = await supabase
    .from('jobs')
    .select('category')
    .not('category', 'is', null)
  const INDUSTRIES = [...new Set(industriesData?.map(j => j.category).filter(Boolean) || [])]

  return (
    <TalentPageClient 
      query={query}
      industry={industry}
      talentsWithRatings={talentsWithRatings}
      error={error}
      INDUSTRIES={INDUSTRIES}
    />
  )
}
