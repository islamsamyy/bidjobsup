'use client'

import { useEffect, useState } from 'react'
import { getFeaturedPortfolio } from '@/lib/actions/portfolio'
import PortfolioCard from './PortfolioCard'

interface PortfolioItem {
  id: number
  title: string
  description: string | null
  image_url: string | null
  project_url: string | null
  skills: string[] | null
  completion_date: string | null
  featured: boolean
}

interface TalentPortfolioSectionProps {
  userId: number
  talentName: string
}

export default function TalentPortfolioSection({
  userId,
  talentName,
}: TalentPortfolioSectionProps) {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const result = await getFeaturedPortfolio(userId, 3)
        if (!result.error) {
          setPortfolio(result.portfolio)
        }
      } catch (err) {
        console.error('Error loading portfolio:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPortfolio()
  }, [userId])

  if (loading) {
    return (
      <section>
        <div className="flex items-center gap-4 mb-6">
          <span className="h-px flex-grow bg-gradient-to-r from-transparent to-[#292428]" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#caa2f7]">
            Portfolio
          </h2>
          <span className="h-px w-12 bg-[#292428]" />
        </div>
        <div className="text-center py-8">
          <span className="material-symbols-outlined animate-spin text-[#caa2f7] text-4xl">
            hourglass_top
          </span>
        </div>
      </section>
    )
  }

  if (portfolio.length === 0) {
    return null
  }

  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <span className="h-px flex-grow bg-gradient-to-r from-transparent to-[#292428]" />
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#caa2f7]">
          Featured Work
        </h2>
        <span className="h-px w-12 bg-[#292428]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {portfolio.map((item) => (
          <PortfolioCard key={item.id} item={item} isOwner={false} />
        ))}
      </div>

      <p className="text-center text-[#4b474a] text-[10px] font-light mt-8 italic">
        {talentName} has shared {portfolio.length} featured project
        {portfolio.length !== 1 ? 's' : ''}
      </p>
    </section>
  )
}
