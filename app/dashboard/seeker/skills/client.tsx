'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { addSkill, deleteSkill, toggleFeaturedSkill, updateSkillProficiency } from '@/lib/actions/skills'

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

const PROFICIENCY_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert']

export default function SkillsClient({
  skills: initialSkills,
  endorsements: initialEndorsements,
  categories,
}: SkillsClientProps) {
  const { t, dir } = useLanguage()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [showAddForm, setShowAddForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'endorsements' | 'name' | 'featured'>('endorsements')
  const [formError, setFormError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Form state
  const [skillName, setSkillName] = useState('')
  const [skillCategory, setSkillCategory] = useState('')
  const [proficiency, setProficiency] = useState('intermediate')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredSkills = skills
    .filter(s => !filterCategory || s.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'endorsements': return b.endorsement_count - a.endorsement_count
        case 'name': return a.name.localeCompare(b.name)
        case 'featured': return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)
        default: return 0
      }
    })

  const getEndorsementsBySkill = (skillId: number) =>
    initialEndorsements.filter(e => e.skill_id === skillId)

  const getProficiencyWidth = (level: string) =>
    ({ beginner: '25%', intermediate: '50%', advanced: '75%', expert: '100%' }[level] || '50%')

  const getProficiencyBadgeColor = (level: string) => ({
    beginner: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    intermediate: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    advanced: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    expert: 'bg-primary/10 text-primary border-primary/30',
  }[level] || 'bg-gray-500/10 text-gray-300 border-gray-500/30')

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsSubmitting(true)
    const result = await addSkill(skillName, skillCategory, proficiency, isFeatured)
    setIsSubmitting(false)
    if (!result.success) {
      setFormError(result.error || 'Failed to add skill')
      return
    }
    // Optimistically add to list
    setSkills(prev => [...prev, {
      id: result.id!,
      name: skillName.trim(),
      category: skillCategory || undefined,
      proficiency_level: proficiency,
      endorsement_count: 0,
      is_featured: isFeatured,
      verified: false,
    }])
    setSkillName('')
    setSkillCategory('')
    setProficiency('intermediate')
    setIsFeatured(false)
    setShowAddForm(false)
    startTransition(() => router.refresh())
  }

  const handleDelete = async (skillId: number) => {
    setDeletingId(skillId)
    const result = await deleteSkill(skillId)
    setDeletingId(null)
    if (result.success) {
      setSkills(prev => prev.filter(s => s.id !== skillId))
    }
  }

  const handleToggleFeatured = async (skillId: number, current: boolean) => {
    setSkills(prev => prev.map(s => s.id === skillId ? { ...s, is_featured: !current } : s))
    const result = await toggleFeaturedSkill(skillId, !current)
    if (!result.success) {
      setSkills(prev => prev.map(s => s.id === skillId ? { ...s, is_featured: current } : s))
    }
  }

  const handleProficiencyChange = async (skillId: number, level: string) => {
    setSkills(prev => prev.map(s => s.id === skillId ? { ...s, proficiency_level: level } : s))
    await updateSkillProficiency(skillId, level)
  }

  return (
    <div dir={dir} className="space-y-6">
      {/* Add Skill Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full bg-primary text-on-primary px-6 py-4 rounded-lg font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined">{showAddForm ? 'close' : 'add'}</span>
        {showAddForm ? 'Cancel' : t('dashboardPages.skillsPage.addNewSkill')}
      </button>

      {/* Add Skill Form */}
      {showAddForm && (
        <form onSubmit={handleAddSkill} className="glass border border-outline-variant/15 rounded-xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-on-surface">{t('dashboardPages.skillsPage.addNewSkill')}</h3>

          {formError && (
            <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-2">
                {t('dashboardPages.skillsPage.skillName')} *
              </label>
              <input
                type="text"
                required
                value={skillName}
                onChange={e => setSkillName(e.target.value)}
                placeholder="e.g., React, Project Management, UI Design"
                className="input-inset w-full"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-2">
                {t('dashboardPages.skillsPage.category')}
              </label>
              <select
                value={skillCategory}
                onChange={e => setSkillCategory(e.target.value)}
                className="input-inset w-full"
              >
                <option value="">{t('dashboardPages.skillsPage.selectCategory')}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-2">
                {t('dashboardPages.skillsPage.proficiencyLevel')}
              </label>
              <select
                value={proficiency}
                onChange={e => setProficiency(e.target.value)}
                className="input-inset w-full"
              >
                {PROFICIENCY_LEVELS.map(l => (
                  <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="featured"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="featured" className="text-sm text-on-surface-variant font-semibold cursor-pointer">
                {t('dashboardPages.skillsPage.featuredSkill')}
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !skillName.trim()}
              className="bg-primary text-on-primary px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {t('dashboardPages.skillsPage.addSkill')}
            </button>
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setFormError(null) }}
              className="bg-surface-container hover:bg-surface-bright text-on-surface px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-sm transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      )}

      {/* Filters and Sort */}
      <div className="glass border border-outline-variant/15 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-3">{t('dashboardPages.skillsPage.filterByCategory')}</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterCategory(null)}
                className={`px-3 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all ${filterCategory === null ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-bright text-on-surface'}`}
              >
                {t('common.all')}
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.name)}
                  className={`px-3 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all whitespace-nowrap ${filterCategory === cat.name ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-bright text-on-surface'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-3">Sort by</label>
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
      {filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSkills.map(skill => {
            const skillEndorsements = getEndorsementsBySkill(skill.id)
            return (
              <div
                key={skill.id}
                className={`glass border rounded-xl p-6 hover:border-outline-variant/30 transition-colors ${skill.is_featured ? 'border-primary/30' : 'border-outline-variant/15'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-on-surface truncate">{skill.name}</h3>
                      {skill.verified && (
                        <span className="material-symbols-outlined text-emerald-400 text-xl shrink-0">verified</span>
                      )}
                    </div>
                    {skill.category && (
                      <p className="text-on-surface-variant text-sm">{skill.category}</p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <button
                      onClick={() => handleToggleFeatured(skill.id, skill.is_featured)}
                      className={`p-2 rounded-lg transition-colors ${skill.is_featured ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:text-primary hover:bg-primary/10'}`}
                      title={skill.is_featured ? 'Unfeature' : 'Feature this skill'}
                    >
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: skill.is_featured ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      disabled={deletingId === skill.id}
                      className="p-2 hover:bg-error/10 rounded-lg text-on-surface-variant hover:text-error transition-colors disabled:opacity-40"
                    >
                      {deletingId === skill.id
                        ? <span className="w-4 h-4 border-2 border-error/30 border-t-error rounded-full animate-spin block" />
                        : <span className="material-symbols-outlined text-sm">delete</span>
                      }
                    </button>
                  </div>
                </div>

                {/* Proficiency with inline edit */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold">Proficiency</p>
                    <select
                      value={skill.proficiency_level}
                      onChange={e => handleProficiencyChange(skill.id, e.target.value)}
                      className={`text-xs font-semibold border rounded px-2 py-1 bg-transparent cursor-pointer ${getProficiencyBadgeColor(skill.proficiency_level)}`}
                    >
                      {PROFICIENCY_LEVELS.map(l => (
                        <option key={l} value={l} className="bg-surface text-on-surface">{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full h-2 bg-outline-variant/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: getProficiencyWidth(skill.proficiency_level) }}
                    />
                  </div>
                </div>

                {/* Endorsements */}
                <div className="border-t border-outline-variant/10 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold">Endorsements</p>
                    <span className="text-lg font-bold text-on-surface">{skillEndorsements.length}</span>
                  </div>
                  {skillEndorsements.length > 0 && (
                    <div className="flex -space-x-2">
                      {skillEndorsements.slice(0, 5).map(e => (
                        <div
                          key={e.id}
                          className="w-7 h-7 rounded-full border border-surface bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-[10px] font-bold text-primary"
                          title={e.endorsed_by_user?.full_name}
                        >
                          {e.endorsed_by_user?.avatar_url
                            ? <img src={e.endorsed_by_user.avatar_url} className="w-full h-full rounded-full object-cover" alt="" />
                            : e.endorsed_by_user?.full_name?.[0]?.toUpperCase()
                          }
                        </div>
                      ))}
                      {skillEndorsements.length > 5 && (
                        <div className="w-7 h-7 rounded-full border border-surface bg-outline-variant/20 flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                          +{skillEndorsements.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="glass border border-outline-variant/15 rounded-xl p-8 text-center">
          <p className="text-on-surface-variant">
            {filterCategory ? `No skills in "${filterCategory}" category.` : 'No skills added yet.'}
          </p>
        </div>
      )}
    </div>
  )
}
