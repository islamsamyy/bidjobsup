'use client'

import { useState } from 'react'
import { deletePortfolioItem, toggleFeaturedPortfolio } from '@/lib/actions/portfolio'
import Image from 'next/image'

interface PortfolioCardProps {
  item: {
    id: number
    title: string
    description: string | null
    image_url: string | null
    project_url: string | null
    skills: string[] | null
    completion_date: string | null
    featured: boolean
  }
  isOwner?: boolean
  onDelete?: (id: number) => void
  onToggleFeatured?: (id: number, featured: boolean) => void
}

export default function PortfolioCard({
  item,
  isOwner = false,
  onDelete,
  onToggleFeatured,
}: PortfolioCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTogglingFeatured, setIsTogglingFeatured] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deletePortfolioItem(item.id)
    if (result.success && onDelete) {
      onDelete(item.id)
    }
    setIsDeleting(false)
  }

  const handleToggleFeatured = async () => {
    setIsTogglingFeatured(true)
    const result = await toggleFeaturedPortfolio(item.id, !item.featured)
    if (result.success && onToggleFeatured) {
      onToggleFeatured(item.id, !item.featured)
    }
    setIsTogglingFeatured(false)
  }

  const formattedDate = item.completion_date
    ? new Date(item.completion_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })
    : null

  return (
    <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden hover:border-primary/30 transition-all group">
      {/* Image */}
      {item.image_url && (
        <div className="relative w-full h-48 bg-surface-container-lowest overflow-hidden">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {item.featured && (
            <div className="absolute top-3 right-3 bg-primary/90 text-on-primary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">star</span>
              Featured
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title & Links */}
        <div>
          <h3 className="font-bold text-on-surface text-lg mb-2">{item.title}</h3>
          {item.project_url && (
            <a
              href={item.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-container text-sm font-medium flex items-center gap-1 transition-colors"
            >
              View Project
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-on-surface-variant text-sm line-clamp-3">
            {item.description}
          </p>
        )}

        {/* Skills */}
        {item.skills && item.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {item.skills.length > 3 && (
              <span className="px-2 py-1 text-primary text-xs font-medium">
                +{item.skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Date */}
        {formattedDate && (
          <p className="text-xs text-on-surface-variant">Completed: {formattedDate}</p>
        )}

        {/* Owner Actions */}
        {isOwner && (
          <div className="flex gap-2 pt-4 border-t border-white/5">
            <button
              onClick={handleToggleFeatured}
              disabled={isTogglingFeatured}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-secondary/20 text-secondary hover:bg-secondary/30 disabled:opacity-50 text-xs font-medium transition-all"
            >
              <span className="material-symbols-outlined text-sm">
                {item.featured ? 'star' : 'star_outline'}
              </span>
              {item.featured ? 'Unfeature' : 'Feature'}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-error/20 text-error hover:bg-error/30 disabled:opacity-50 text-xs font-medium transition-all"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
