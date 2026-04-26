import { getAuthUserAs } from '@/lib/auth-utils'
import Link from 'next/link'
import { handleCloseJob, handleDeleteJob } from './actions'
import React from 'react'

export default async function EmployerListingsPage() {
  const { profile, supabase } = await getAuthUserAs('employer')

  // 2. Fetch Jobs for this Employer using the internal profile?.id
  const { data: jobs, error } = await supabase!
    .from('jobs')
    .select(`
      *,
      bids_count:bids(count)
    `)
    .eq('employer_id', profile?.id)
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-16">
        <div className="space-y-4">
          <h2 className="text-6xl font-headline font-black italic text-on-background leading-tight">
            Talent Ecosystem
          </h2>
          <p className="text-on-surface-variant max-w-md font-body text-sm tracking-tight leading-relaxed">
            Orchestrate your creative pipeline. Monitor active bid flows, curate talent clusters, and refine your studio's reach.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Link 
            href="/dashboard/employer/post-job"
            className="bg-primary text-on-primary px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Post New Role
          </Link>
        </div>
      </div>

      {/* Grid of Listings */}
      <div className="space-y-6">
        {!jobs || jobs.length === 0 ? (
          <div className="p-20 rounded-3xl bg-surface-container border-2 border-dashed border-outline-variant/20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-stone-600">work_history</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-bold text-on-surface italic">No active missions</h3>
              <p className="text-on-surface-variant max-w-xs mx-auto text-sm">Your talent pipeline is currently dormant. Initiate a new role to begin engagement.</p>
            </div>
            <Link href="/dashboard/employer/post-job" className="text-primary font-black uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-8 transition-all">Begin Recruitment Protocol</Link>
          </div>
        ) : (
          jobs.map((job: any) => (
            <div key={job.id} className="group bg-surface-container rounded-2xl p-8 hover:bg-surface-container-high transition-all duration-500 border border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
              <div className="flex flex-col space-y-4 relative z-10">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {job.category || 'Creative Sector'}
                  </span>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-3xl font-headline font-black italic text-on-background group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-stone-400">
                    <span className="material-symbols-outlined text-lg">payments</span>
                    <span className="text-sm font-bold tracking-tight">
                      ${job.budget_min?.toLocaleString()} - ${job.budget_max?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary">
                    <span className="material-symbols-outlined text-lg">group</span>
                    <span className="text-sm font-black tracking-widest uppercase">
                      {job.bids_count?.[0]?.count || 0} Propositions
                    </span>
                  </div>
                  <span className="bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-green-500/20">
                    {job.status || 'Active'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <Link 
                  href={`/dashboard/employer/listings/${job.id}`}
                  className="bg-surface-container-highest text-on-surface px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest border border-outline-variant/20 hover:border-primary/40 transition-all flex items-center gap-2"
                >
                  Inspect
                  <span className="material-symbols-outlined text-sm">visibility</span>
                </Link>
                 <form action={handleCloseJob.bind(null, job.id.toString())}>
                  <button title="Close Job" type="submit" className="p-3 text-stone-500 hover:text-primary transition-colors hover:bg-primary/5 rounded-xl transition-all">
                    <span className="material-symbols-outlined">pause_circle</span>
                  </button>
                </form>
                
                <form action={handleDeleteJob.bind(null, job.id)}>
                  <button title="Delete Job" type="submit" className="p-3 text-stone-500 hover:text-error transition-colors hover:bg-error/5 rounded-xl transition-all">
                    <span className="material-symbols-outlined text-on-error-container">delete</span>
                  </button>
                </form>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors pointer-events-none"></div>
            </div>
          ))
        )}
      </div>

      {/* Stats Bento Grid */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-10 rounded-3xl border border-outline-variant/5 shadow-2xl relative overflow-hidden group">
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-6 font-black">Active Roles</p>
          <div className="flex items-end gap-3">
            <span className="text-6xl font-headline font-black italic text-primary">{jobs?.filter((j: any) => j.status === 'open').length || 0}</span>
            <span className="text-secondary text-xs font-black mb-3 uppercase tracking-widest">Open</span>
          </div>
          <div className="absolute top-0 right-0 w-32 h-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
        </div>
        
        <div className="bg-surface-container-low p-10 rounded-3xl border border-outline-variant/5 shadow-2xl bg-[radial-gradient(circle_at_top_right,rgba(234,179,250,0.05),transparent)]">
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-6 font-black">Engagement Factor</p>
          <div className="flex items-end gap-3">
            <span className="text-6xl font-headline font-black italic text-on-background">{jobs?.reduce((acc: number, job: any) => acc + (job.bids_count?.[0]?.count || 0), 0) || 0}</span>
            <span className="text-stone-500 text-xs font-black mb-3 uppercase tracking-widest">Active Bids</span>
          </div>
        </div>

        <div className="bg-surface-container-low p-10 rounded-3xl border border-outline-variant/5 shadow-2xl relative group overflow-hidden">
          <div className="relative z-10">
            <p className="font-label text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-6 font-black">Total Budget Deployed</p>
            <div className="flex items-end gap-3">
              <span className="text-6xl font-headline font-black italic text-secondary">
                ${jobs?.reduce((acc: number, job: any) => acc + (Number(job.budget_max) || 0), 0).toLocaleString() || '0'}
              </span>
              <span className="text-stone-500 text-xs font-black mb-3 uppercase tracking-widest">Allocated</span>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
            <span className="material-symbols-outlined text-[160px] transform rotate-12">monitoring</span>
          </div>
        </div>
      </div>
    </main>
  )
}