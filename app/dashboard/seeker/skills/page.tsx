import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SkillsClient from './client'

export const dynamic = 'force-dynamic'

export default async function SkillsPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/sign-in')
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('id, user_type')
    .eq('auth_id', user.id)
    .single()

  if (!currentUser) {
    redirect('/join')
  }

  // Fetch user skills
  const { data: skills } = await supabase
    .from('skills')
    .select(`
      id,
      name,
      category,
      proficiency_level,
      endorsement_count,
      is_featured,
      verified,
      verified_by_user_id
    `)
    .eq('user_id', currentUser.id)
    .order('is_featured', { ascending: false })
    .order('endorsement_count', { ascending: false })

  // Fetch skill endorsements
  const { data: endorsementsData } = await supabase
    .from('skill_endorsements')
    .select(`
      id,
      skill_id,
      endorsed_by_user_id,
      endorsed_by_user:endorsed_by_user_id(id, full_name, avatar_url)
    `)
    .in('skill_id', (skills || []).map(s => s.id))

  const endorsements = endorsementsData?.map(e => ({
    ...e,
    endorsed_by_user: e.endorsed_by_user && Array.isArray(e.endorsed_by_user) ? e.endorsed_by_user[0] : e.endorsed_by_user,
  }))

  // Fetch skill categories for the form
  const { data: categories } = await supabase
    .from('skill_categories')
    .select('id, name, description')
    .is('parent_category_id', null)
    .order('name')

  const totalEndorsements = endorsements?.length || 0
  const topSkills = skills
    ?.filter(s => s.is_featured)
    .slice(0, 3) || []

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <Link
          href="/dashboard/seeker"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-6 group"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          <span className="text-xs font-bold uppercase tracking-widest">Back to Profile</span>
        </Link>

        <h1 className="font-headline text-5xl font-bold text-on-surface mb-2">Skills & Endorsements</h1>
        <p className="text-on-surface-variant text-lg">
          Showcase your professional skills and receive endorsements from colleagues
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Total Skills */}
        <div className="glass border border-outline-variant/15 rounded-xl p-6">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-3">Total Skills</p>
          <div className="text-3xl font-bold text-on-surface mb-2">
            {skills?.length || 0}
          </div>
          <p className="text-on-surface-variant text-xs">
            Skills added to your profile
          </p>
        </div>

        {/* Total Endorsements */}
        <div className="glass border border-outline-variant/15 rounded-xl p-6">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-3">Total Endorsements</p>
          <div className="text-3xl font-bold text-on-surface mb-2">
            {totalEndorsements}
          </div>
          <p className="text-on-surface-variant text-xs">
            Endorsements received
          </p>
        </div>

        {/* Featured Skills */}
        <div className="glass border border-outline-variant/15 rounded-xl p-6">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-3">Featured Skills</p>
          <div className="text-3xl font-bold text-on-surface mb-2">
            {topSkills.length}
          </div>
          <p className="text-on-surface-variant text-xs">
            Highlighted on profile
          </p>
        </div>
      </div>

      {/* Top Skills */}
      {topSkills.length > 0 && (
        <div className="mb-12">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Featured Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topSkills.map(skill => (
              <div
                key={skill.id}
                className="glass border border-primary/30 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-on-surface">{skill.name}</h3>
                    {skill.category && (
                      <p className="text-on-surface-variant text-sm">{skill.category}</p>
                    )}
                  </div>
                  {skill.verified && (
                    <span className="material-symbols-outlined text-primary text-xl">verified</span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 h-2 bg-outline-variant/20 rounded-full">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
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

                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-secondary">thumb_up</span>
                  <span className="text-on-surface-variant text-sm">
                    {skill.endorsement_count} endorsement{skill.endorsement_count !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Skills */}
      <div>
        <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">All Skills</h2>
        {!skills || skills.length === 0 ? (
          <div className="glass border border-outline-variant/15 rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant/30 block mb-4">
              school
            </span>
            <p className="text-on-surface-variant text-lg mb-4">
              No skills added yet
            </p>
            <p className="text-on-surface-variant text-sm mb-6">
              Add your professional skills to showcase your expertise to clients and receive endorsements.
            </p>
            <button className="bg-primary text-on-primary px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity">
              Add Your First Skill
            </button>
          </div>
        ) : (
          <SkillsClient
            skills={skills}
            endorsements={endorsements || []}
            categories={categories || []}
            currentUserId={currentUser.id}
          />
        )}
      </div>
    </main>
  )
}
