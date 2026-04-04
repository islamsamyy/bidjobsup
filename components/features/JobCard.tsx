import Link from 'next/link'

interface JobCardProps {
  job: {
    id: number
    title: string
    description: string
    category: string
    budget_min: number | null
    budget_max: number | null
    duration: string
    bids_count: number
    created_at: string
    employer?: {
      company_name?: string
      full_name?: string
      avatar_url?: string
      location?: string
    }
  }
}

export default function JobCard({ job }: JobCardProps) {
  const timeAgo = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    if (diffInDays < 0) return 'Just now'
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    return `${diffInDays}d ago`
  }

  const budgetDisplay = job.budget_min !== null && job.budget_max !== null
    ? `$${Number(job.budget_min).toLocaleString()} - $${Number(job.budget_max).toLocaleString()}`
    : job.budget_max !== null
      ? `Up to $${Number(job.budget_max).toLocaleString()}` 
      : job.budget_min !== null
        ? `$${Number(job.budget_min).toLocaleString()}+`
        : 'Elite Salary'

  return (
    <Link href={`/jobs/${job.id}`} className="group flex flex-col h-full snap-start bg-[#1c181c] rounded-[2rem] p-8 hover:bg-[#221e22] hover:border-[#caa2f7]/30 border border-[#292428] transition-all duration-500 shadow-2xl relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#caa2f7]/50">
      <div className="flex justify-between items-start mb-8 relative z-10 w-full">
        <div className="w-14 h-14 rounded-xl bg-[#100d10] flex items-center justify-center border border-[#292428] overflow-hidden group-hover:border-[#caa2f7]/30 transition-colors shrink-0">
          {job.employer?.avatar_url ? (
            <img src={job.employer.avatar_url} alt={job.employer.company_name || job.employer.full_name} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-[#caa2f7] text-3xl">token</span>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="bg-[#613471]/30 text-[#f1bfff] text-[10px] font-black px-4 py-1.5 rounded-full whitespace-nowrap mb-2 tracking-widest uppercase">
            {budgetDisplay}
          </span>
          <span className="text-[10px] text-[#4b474a] font-bold uppercase tracking-widest">{timeAgo(job.created_at)}</span>
        </div>
      </div>
      
      <div className="relative z-10 flex-grow mb-8 w-full">
        <h4 className="font-headline text-2xl font-bold mb-3 group-hover:text-[#caa2f7] transition-colors line-clamp-1">{job.title}</h4>
        <p className="text-[#b0a9ad] text-sm leading-relaxed line-clamp-3 font-light mb-4 text-justify">
          {job.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
             <span className="px-3 py-1 rounded-lg bg-[#100d10] border border-[#292428] text-[9px] font-bold text-[#caa2f7] uppercase tracking-widest">{job.category}</span>
             {job.employer?.location && (
               <span className="px-3 py-1 rounded-lg bg-[#100d10] border border-[#292428] text-[9px] font-bold text-[#b0a9ad] uppercase tracking-widest flex items-center gap-1">
                 <span className="material-symbols-outlined text-[10px]">location_on</span>
                 {job.employer.location}
               </span>
             )}
        </div>
      </div>

      <div className="flex items-center gap-6 border-t border-[#292428] pt-6 relative z-10 w-full mt-auto">
        <div className="flex flex-col gap-1 w-1/3">
          <span className="text-[10px] uppercase tracking-widest text-[#4b474a] font-black">Status</span>
          <span className="text-xs font-black text-[#faf1f5] flex items-center gap-1.5 uppercase">
            <span className="w-2 h-2 rounded-full bg-[#caa2f7] animate-pulse shrink-0"></span> Open
          </span>
        </div>
        <div className="flex flex-col gap-1 w-1/3">
          <span className="text-[10px] uppercase tracking-widest text-[#4b474a] font-black">Interest</span>
          <span className="text-xs font-black text-[#faf1f5] flex items-center gap-2 uppercase whitespace-nowrap">
            <span className="material-symbols-outlined text-sm text-[#caa2f7] shrink-0">group</span> 
            {job.bids_count > 0 ? `${job.bids_count} Proposals` : 'Be first'}
          </span>
        </div>
        
        <div className="ml-auto flex justify-end w-1/3">
          <div className="w-12 h-12 rounded-2xl bg-[#100d10] border border-[#292428] flex items-center justify-center group-hover:bg-[#caa2f7] group-hover:text-[#431f6b] group-hover:shadow-[0_0_20px_rgba(202,162,247,0.3)] transition-all transform active:scale-95 duration-500">
            <span className="material-symbols-outlined font-black">north_east</span>
          </div>
        </div>
      </div>

      {/* Background Effect */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#caa2f7]/5 rounded-full blur-3xl group-hover:bg-[#caa2f7]/10 transition-colors duration-1000 z-0"></div>
    </Link>
  )
}
