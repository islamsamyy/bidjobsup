'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getMyPortfolio, createPortfolioItem } from '@/lib/actions/portfolio'
import { useLanguage } from '@/app/providers/LanguageProvider'
import PortfolioCard from '@/components/features/PortfolioCard'

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

export default function PortfolioPage() {
  const { t, dir } = useLanguage()
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
    skills: '',
    completionDate: '',
  })

  useEffect(() => {
    getMyPortfolio().then((result) => {
      if (!result.error) setPortfolio(result.portfolio as PortfolioItem[])
      setLoading(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const skills = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const result = await createPortfolioItem(
        formData.title,
        formData.description,
        formData.imageUrl || undefined,
        formData.projectUrl || undefined,
        skills.length > 0 ? skills : undefined,
        formData.completionDate || undefined
      )

      if (result.success) {
        const updated = await getMyPortfolio()
        if (!updated.error) setPortfolio(updated.portfolio as PortfolioItem[])

        // Reset form
        setFormData({
          title: '',
          description: '',
          imageUrl: '',
          projectUrl: '',
          skills: '',
          completionDate: '',
        })
        setShowForm(false)
      } else {
        setError(result.error || 'Failed to create portfolio item')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create portfolio item')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (id: number) => {
    setPortfolio(portfolio.filter((item) => item.id !== id))
  }

  const handleToggleFeatured = (id: number, featured: boolean) => {
    setPortfolio(
      portfolio.map((item) =>
        item.id === id ? { ...item, featured } : item
      )
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          hourglass_top
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">{t('dashboardPages.portfolioPage.title')}</h1>
          <p className="text-on-surface-variant">
            {t('dashboardPages.portfolioPage.subtitle')}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-on-primary-container font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            {t('dashboardPages.portfolioPage.addPortfolioItem')}
          </button>
        )}
      </div>

      {/* Add Project Form */}
      {showForm && (
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
          <h2 className="text-xl font-bold text-on-surface mb-6">{t('dashboardPages.portfolioPage.addPortfolioItem')}</h2>

          {error && (
            <div className="mb-6 bg-error/20 border border-error text-error px-4 py-3 rounded-lg text-sm flex items-start gap-2">
              <span className="material-symbols-outlined flex-shrink-0 mt-0.5">error</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">
                {t('dashboardPages.portfolioPage.projectTitle')} *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., E-Commerce Platform"
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-2 text-on-surface placeholder:text-on-surface-variant focus:border-primary/50 outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">
                {t('dashboardPages.portfolioPage.description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the project, your role, and the outcome..."
                rows={4}
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-2 text-on-surface placeholder:text-on-surface-variant focus:border-primary/50 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image URL */}
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-2 text-on-surface placeholder:text-on-surface-variant focus:border-primary/50 outline-none"
                />
              </div>

              {/* Project URL */}
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">
                  Project URL
                </label>
                <input
                  type="url"
                  value={formData.projectUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, projectUrl: e.target.value })
                  }
                  placeholder="https://example.com"
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-2 text-on-surface placeholder:text-on-surface-variant focus:border-primary/50 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData({ ...formData, skills: e.target.value })
                  }
                  placeholder="React, TypeScript, Node.js"
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-2 text-on-surface placeholder:text-on-surface-variant focus:border-primary/50 outline-none"
                />
              </div>

              {/* Completion Date */}
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">
                  Completion Date
                </label>
                <input
                  type="date"
                  value={formData.completionDate}
                  onChange={(e) =>
                    setFormData({ ...formData, completionDate: e.target.value })
                  }
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-2 text-on-surface focus:border-primary/50 outline-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-white/5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary text-on-primary-container font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? 'Adding...' : 'Add Project'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-surface-container-high text-on-surface font-bold py-3 px-4 rounded-lg hover:bg-surface-container-highest transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Portfolio Grid */}
      {portfolio.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              isOwner={true}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
            />
          ))}
        </div>
      ) : (
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 block">
            work_outline
          </span>
          <h3 className="text-xl font-bold text-on-surface mb-2">No portfolio items yet</h3>
          <p className="text-on-surface-variant mb-6">
            Start building your portfolio to showcase your best work
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-on-primary-container font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-all inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Add Your First Project
          </button>
        </div>
      )}

      {/* Info */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
        <p className="text-sm text-on-surface-variant flex items-start gap-3">
          <span className="material-symbols-outlined flex-shrink-0 mt-0.5 text-primary">
            lightbulb
          </span>
          <span>
            Featured projects appear prominently on your profile?. Keep your portfolio updated
            to attract better opportunities!
          </span>
        </p>
      </div>
    </div>
  )
}
