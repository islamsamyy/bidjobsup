'use client'

import { useState } from 'react'
import { useLanguage } from '@/app/providers/LanguageProvider'

interface Skill {
  id: number
  name: string
  category?: string
  proficiency_level: string
  endorsement_count: number
  is_featured: boolean
  verified: boolean
  verified_by_user_id?: number
}

interface SkillEndorsement {
  id: number
  skill_id: number
  endorsed_by_user_id: number
  endorsed_by_user?: {
    id: number
    full_name: string
    avatar_url?: string
  }
}

interface SkillCategory {
  id: number
  name: string
  description?: string
}

interface SkillsClientProps {
  skills: Skill[]
  endorsements: SkillEndorsement[]
  categories: SkillCategory[]
  currentUserId: number
}

export default function SkillsClient({
  skills: initialSkills,
  endorsements: initialEndorsements,
  categories,
  currentUserId,
}: SkillsClientProps) {
  const { t, dir } = useLanguage()
  const [showAddForm, setShowAddForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'endorsements' | 'name' | 'featured'>('endorsements')

  // Filter and sort skills
  let filteredSkills = initialSkills
    .filter(s => !filterCategory || s.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'endorsements':
          return b.endorsement_count - a.endorsement_count
        case 'name':
          return a.name.localeCompare(b.name)
        case 'featured':
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)
        default:
          return 0
      }
    })

  const getEndorsementsBySkill = (skillId: number) => {
    return initialEndorsements.filter(e => e.skill_id === skillId)
  }

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'from-blue-500/20 to-blue-500/10'
      case 'intermediate':
        return 'from-yellow-500/20 to-yellow-500/10'
      case 'advanced':
        return 'from-purple-500/20 to-purple-500/10'
      case 'expert':
        return 'from-primary/20 to-primary/10'
      default:
        return 'from-gray-500/20 to-gray-500/10'
    }
  }

  const getProficiencyBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30'
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
      case 'advanced':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30'
      case 'expert':
        return 'bg-primary/10 text-primary border-primary/30'
      default:
        return 'bg-gray-500/10 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <div dir={dir} className="space-y-6">
      {/* Add Skill Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full bg-primary text-on-primary px-6 py-4 rounded-lg font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined">add</span>
        Add New Skill
      </button>

      {/* Add Skill Form */}
      {showAddForm && (
        <div className="glass border border-outline-variant/15 rounded-xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-on-surface">Add a New Skill</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-2">
                Skill Name
              </label>
              <input
                type="text"
                placeholder="e.g., React, Project Management, UI Design"
                className="input-inset w-full"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-2">
                Category
              </label>
              <select className="input-inset w-full">
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-2">
                Proficiency Level
              </label>
              <select className="input-inset w-full">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-2">
                <input type="checkbox" className="mr-2" />
                Featured Skill
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="bg-primary text-on-primary px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity">
              Add Skill
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-surface-container hover:bg-surface-bright text-on-surface px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="glass border border-outline-variant/15 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Filter */}
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-3">Filter by Category</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterCategory(null)}
                className={`px-3 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all ${
                  filterCategory === null
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container hover:bg-surface-bright text-on-surface'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.name)}
                  className={`px-3 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all whitespace-nowrap ${
                    filterCategory === cat.name
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container hover:bg-surface-bright text-on-surface'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-3">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="input-inset px-4 py-2 text-sm rounded-lg w-full"
            >
              <option value="endorsements">Most Endorsed</option>
              <option value="featured">Featured First</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSkills.map(skill => {
          const skillEndorsements = getEndorsementsBySkill(skill.id)
          return (
            <div
              key={skill.id}
              className={`glass border rounded-xl p-6 hover:border-outline-variant/30 transition-colors ${
                skill.is_featured
                  ? 'border-primary/30 bg-gradient-to-br ' + getProficiencyColor(skill.proficiency_level)
                  : 'border-outline-variant/15'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-on-surface">{skill.name}</h3>
                    {skill.is_featured && (
                      <span className="material-symbols-outlined text-primary text-xl">star</span>
                    )}
                    {skill.verified && (
                      <span className="material-symbols-outlined text-emerald-400 text-xl">verified</span>
                    )}
                  </div>
                  {skill.category && (
                    <p className="text-on-surface-variant text-sm">{skill.category}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-outline-variant/10 rounded-lg text-on-surface-variant hover:text-on-surface transition-colors">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button className="p-2 hover:bg-error/10 rounded-lg text-on-surface-variant hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>

              {/* Proficiency */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
                    Proficiency
                  </p>
                  <span className={`text-xs font-semibold border rounded px-2 py-1 ${getProficiencyBadgeColor(skill.proficiency_level)}`}>
                    {skill.proficiency_level.charAt(0).toUpperCase() + skill.proficiency_level.slice(1)}
                  </span>
                </div>
                <div className="w-full h-2 bg-outline-variant/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${
                        skill.proficiency_level === 'beginner'
                          ? '25%'
                          : skill.proficiency_level === 'intermediate'
                          ? '50%'
                          : skill.proficiency_level === 'advanced'
                          ? '75%'
                          : '100%'
                      }`,
                    }}
                  />
                </div>
              </div>

              {/* Endorsements */}
              <div className="border-t border-outline-variant/10 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
                    Endorsements
                  </p>
                  <span className="text-lg font-bold text-on-surface">{skillEndorsements.length}</span>
                </div>

                {skillEndorsements.length > 0 && (
                  <div className="flex -space-x-2 mb-3">
                    {skillEndorsements.slice(0, 3).map(e => (
                      <div
                        key={e.id}
                        className="w-8 h-8 rounded-full border border-surface bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-[10px] font-bold text-primary"
                        title={e.endorsed_by_user?.full_name}
                      >
                        {e.endorsed_by_user?.full_name?.[0]?.toUpperCase()}
                      </div>
                    ))}
                    {skillEndorsements.length > 3 && (
                      <div className="w-8 h-8 rounded-full border border-surface bg-outline-variant/20 flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                        +{skillEndorsements.length - 3}
                      </div>
                    )}
                  </div>
                )}

                <button className="w-full bg-surface-container hover:bg-surface-bright text-on-surface px-4 py-2 rounded-lg font-semibold text-xs uppercase tracking-widest transition-colors">
                  <span className="material-symbols-outlined text-sm inline-block mr-2 align-middle">
                    thumb_up
                  </span>
                  View Endorsements
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* No Skills Found */}
      {filteredSkills.length === 0 && initialSkills.length > 0 && (
        <div className="glass border border-outline-variant/15 rounded-xl p-8 text-center">
          <p className="text-on-surface-variant">
            No skills found with the selected filter.
          </p>
        </div>
      )}
    </div>
  )
}
