import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function NoResultsPage({ searchParams }: PageProps) {
  const { q } = await searchParams

  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8 py-32">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="relative inline-block mb-12">
          <div className="w-40 h-40 rounded-[2rem] bg-[#1c181c] border border-[#292428] flex items-center justify-center rotate-3">
            <span className="material-symbols-outlined text-7xl text-[#4b474a]" style={{ fontVariationSettings: "'FILL' 0" }}>
              search_off
            </span>
          </div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-[#1c181c] border border-[#caa2f7]/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-[#caa2f7]">wifi_off</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-headline text-5xl md:text-6xl font-black text-[#faf1f5] tracking-tight leading-tight mb-6">
          The Void is{' '}
          <span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_20px_rgba(202,162,247,0.3)]">
            Quiet
          </span>
        </h1>

        <p className="text-[#b0a9ad] text-lg font-light leading-relaxed mb-4 max-w-xl mx-auto">
          {q
            ? <>No missions found for <strong className="text-[#faf1f5]">"{q}"</strong>. Try broader keywords or explore all open roles.</>
            : 'No missions match your current frequency. The nocturne is vast, but this corner is silent today.'}
        </p>

        {/* Suggestion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 text-left mb-12">
          <div className="bg-[#1c181c] border border-[#292428] rounded-2xl p-8 group hover:border-[#caa2f7]/20 transition-all">
            <span className="material-symbols-outlined text-[#caa2f7] mb-4 block group-hover:scale-110 transition-transform">tune</span>
            <h3 className="font-headline text-lg font-bold text-[#faf1f5] mb-2">Expand Your Search</h3>
            <p className="text-[#b0a9ad] text-sm leading-relaxed">Remove filters or use broader keywords to reveal more opportunities.</p>
          </div>
          <div className="bg-[#1c181c] border border-[#292428] rounded-2xl p-8 group hover:border-[#caa2f7]/20 transition-all">
            <span className="material-symbols-outlined text-[#eab3fa] mb-4 block group-hover:scale-110 transition-transform">notifications_active</span>
            <h3 className="font-headline text-lg font-bold text-[#faf1f5] mb-2">Browse All Roles</h3>
            <p className="text-[#b0a9ad] text-sm leading-relaxed">View every open position and filter from there — the full directory awaits.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/jobs/search"
            className="px-8 py-4 rounded-xl border border-[#4b474a] text-[10px] font-black uppercase tracking-[0.2em] text-[#faf1f5] hover:bg-[#1c181c] transition-all"
          >
            New Search
          </Link>
          <Link
            href="/jobs/browse"
            className="px-8 py-4 rounded-xl bg-gradient-to-br from-[#caa2f7] to-[#613471] text-[#431f6b] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#caa2f7]/10 hover:brightness-110 active:scale-95 transition-all"
          >
            Browse All Roles
          </Link>
        </div>
      </div>
    </main>
  )
}
