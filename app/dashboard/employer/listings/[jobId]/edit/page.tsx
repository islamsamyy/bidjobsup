import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { editJob } from '@/lib/actions/jobs'

export default async function EditJobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const supabase = await createClient()

  // In Next.js 15+, params is a Promise
  const { jobId } = await params;

  const { data: { user }, error: authError } = await supabase!.auth.getUser()
  if (authError || !user) {
    redirect('/sign-in')
  }

  const { data: userRecord } = await supabase!
    .from('users')
    .select('id, user_type')
    .eq('auth_id', user?.id)
    .single()

  if (!userRecord || (userRecord.user_type !== 'employer' && userRecord.user_type !== 'both')) {
    redirect('/dashboard/seeker')
  }

  const { data: job, error: jobError } = await supabase!
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .eq('employer_id', userRecord.id)
    .single()

  if (jobError || !job) {
    redirect('/dashboard/employer/listings')
  }

  // Define Server Action wrapper
  const handleUpdate = async (formData: FormData) => {
    'use server'
    const updates = {
      title: formData.get('title'),
      category: formData.get('category'),
      employmentType: formData.get('employmentType'),
      location: formData.get('location'),
      budget_type: formData.get('budget_type'),
      budget_min: Number(formData.get('budgetMin')),
      budget_max: Number(formData.get('budgetMax')),
      experience_level: formData.get('experience_level'),
      duration: formData.get('duration'),
      skills: formData.get('skills') ? (formData.get('skills') as string).split(',').map(s => s.trim()) : [],
      description: formData.get('description'),
    }
    
    await editJob(job.id, updates)
    redirect(`/dashboard/employer/listings/${job.id}`)
  }

  return (
    <main className="max-w-5xl mx-auto px-8 py-12">
      <div className="mb-12">
        <Link href={`/dashboard/employer/listings/${job.id}`} className="text-stone-500 hover:text-primary transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-black mb-6">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Listing
        </Link>
        <h1 className="text-5xl font-headline font-black italic text-on-background">
          Edit <span className="text-secondary">Role</span>
        </h1>
        <p className="text-stone-400 font-body text-sm mt-4">Adjust the parameters for {job.title}</p>
      </div>

      <div className="bg-surface-container border border-outline-variant/10 rounded-2xl p-10 shadow-2xl">
        <form action={handleUpdate} className="space-y-8">
          {/* Job Title */}
          <div className="space-y-3">
            <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Job Title</label>
            <input 
              name="title"
              defaultValue={job.title}
              required
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all outline-none font-body" 
              type="text"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Category</label>
              <select name="category" defaultValue={job.category} required className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:border-secondary transition-all outline-none">
                <option value="Architecture & Design">Architecture & Design</option>
                <option value="Financial Strategy">Financial Strategy</option>
                <option value="Urban Development">Urban Development</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Marketing & Growth">Marketing & Growth</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Employment Type</label>
              <select name="employmentType" defaultValue={job.employment_type || job.employmentType || 'full-time'} required className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:border-secondary transition-all outline-none">
                <option value="full-time">Full-time</option>
                <option value="contract">Contractor</option>
                <option value="part-time">Part-time Advisory</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Location Strategy</label>
            <select name="location" defaultValue={job.location} required className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:border-secondary transition-all outline-none">
              <option value="Riyadh">Riyadh — HQ & Core</option>
              <option value="Jeddah">Jeddah — Regional</option>
              <option value="NEOM">NEOM — The Line</option>
              <option value="Remote">Remote — Borderless</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Budget Model</label>
              <select name="budget_type" defaultValue={job.budget_type} required className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:border-secondary transition-all outline-none">
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Min (USD)</label>
              <input name="budgetMin" type="number" defaultValue={job.budget_min} required className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:border-secondary transition-all outline-none" />
            </div>
            <div className="space-y-3">
              <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Max (USD)</label>
              <input name="budgetMax" type="number" defaultValue={job.budget_max} required className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:border-secondary transition-all outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Experience Level</label>
              <select name="experience_level" defaultValue={job.experience_level} required className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:border-secondary transition-all outline-none">
                <option value="entry">Entry (1-3 yrs)</option>
                <option value="intermediate">Intermediate (4-7 yrs)</option>
                <option value="expert">Expert (8+ yrs)</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Duration</label>
              <select name="duration" defaultValue={job.duration} required className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:border-secondary transition-all outline-none">
                <option value="less_than_1_week">Less than 1 week</option>
                <option value="1_week_to_1_month">1 week to 1 month</option>
                <option value="1_to_3_months">1 to 3 months</option>
                <option value="3_to_6_months">3 to 6 months</option>
                <option value="more_than_6_months">More than 6 months</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Skills (Comma separated)</label>
            <input 
              name="skills"
              defaultValue={Array.isArray(job.skills) ? job.skills.join(', ') : job.skills}
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:border-secondary transition-all outline-none" 
              type="text"
            />
          </div>

          <div className="space-y-3">
            <label className="font-label font-medium text-[10px] uppercase tracking-widest text-stone-400 block ml-1">Role Description</label>
            <textarea 
              name="description"
              defaultValue={job.description}
              required
              rows={6}
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:border-secondary transition-all outline-none resize-y" 
            />
          </div>

          <div className="pt-8 border-t border-outline-variant/10 text-right">
            <button 
              type="submit"
              className="bg-primary text-on-primary px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl hover:scale-[1.02] transition-all inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
