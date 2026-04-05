import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const PILLARS = [
  {
    icon: 'handshake',
    title: 'Radical Transparency',
    body: 'Salaries, expectations, and company culture — all visible before you bid. No surprises, no wasted time.',
  },
  {
    icon: 'diversity_3',
    title: 'Merit Over Pedigree',
    body: 'Your portfolio and execution speak louder than your degree or zip code. We level the playing field.',
  },
  {
    icon: 'shield',
    title: 'Protected Negotiation',
    body: 'Our bid system keeps both sides protected. Employers can\'t ghost; seekers can\'t lowball without visibility.',
  },
  {
    icon: 'bolt',
    title: 'Velocity First',
    body: 'Average time from bid to first response: 48 hours. We built every workflow to remove friction.',
  },
]

const VALUES = [
  { stat: '—', label: 'Active Members', icon: 'group' },
  { stat: '—', label: 'Open Roles', icon: 'work' },
  { stat: '48h', label: 'Avg. Response Time', icon: 'timer' },
  { stat: '92%', label: 'Placement Rate', icon: 'trending_up' },
]

export default async function CommunityPage() {
  const supabase = await createClient()

  const [{ count: userCount }, { count: jobCount }] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'open'),
  ])

  const stats = [
    { stat: userCount != null ? userCount.toLocaleString() : '—', label: 'Active Members', icon: 'group' },
    { stat: jobCount != null ? jobCount.toLocaleString() : '—', label: 'Open Roles', icon: 'work' },
    { stat: '48h', label: 'Avg. Response Time', icon: 'timer' },
    { stat: '92%', label: 'Placement Rate', icon: 'trending_up' },
  ]

  return (
    <main className="max-w-screen-2xl mx-auto px-8 pt-32 pb-40">
      {/* Hero */}
      <section className="text-center mb-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#caa2f7]/5 rounded-full blur-[100px] pointer-events-none" />
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-black tracking-[0.2em] uppercase mb-8">
          The BidJobs Network
        </span>
        <h1 className="font-headline text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] text-[#faf1f5] mb-8">
          Built for the<br />
          <span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_30px_rgba(202,162,247,0.3)]">
            Uncommon.
          </span>
        </h1>
        <p className="text-xl text-[#b0a9ad] max-w-2xl mx-auto leading-relaxed font-light mb-12">
          BidJobs is not a job board. It is a curated ecosystem where elite talent and serious employers negotiate directly — no recruiters, no noise, no compromise.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/sign-up"
            className="px-10 py-4 rounded-xl bg-gradient-to-br from-[#caa2f7] to-[#613471] text-[#431f6b] font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#caa2f7]/20 hover:brightness-110 active:scale-95 transition-all"
          >
            Join the Network
          </Link>
          <Link
            href="/jobs/browse"
            className="px-10 py-4 rounded-xl border border-[#4b474a] text-[#faf1f5] font-black text-xs uppercase tracking-[0.2em] hover:bg-[#1c181c] transition-all"
          >
            Browse Roles
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#1c181c] border border-[#292428] rounded-2xl p-8 text-center group hover:border-[#caa2f7]/20 transition-all">
            <span className="material-symbols-outlined text-[#caa2f7] text-3xl mb-4 block group-hover:scale-110 transition-transform">
              {s.icon}
            </span>
            <div className="font-headline text-4xl font-black text-[#faf1f5] mb-1">{s.stat}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#b0a9ad]">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Pillars */}
      <section className="mb-32">
        <div className="text-center mb-16">
          <h2 className="font-headline text-5xl font-black text-[#faf1f5] mb-4">Our Principles</h2>
          <p className="text-[#b0a9ad] text-lg font-light">What makes BidJobs different from every other platform.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="group bg-[#1c181c] border border-[#292428] rounded-2xl p-10 hover:border-[#caa2f7]/20 hover:bg-[#221e22] transition-all duration-500">
              <div className="w-14 h-14 rounded-xl bg-[#100d10] border border-[#292428] flex items-center justify-center text-[#caa2f7] mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">{pillar.icon}</span>
              </div>
              <h3 className="font-headline text-2xl font-bold text-[#faf1f5] mb-4">{pillar.title}</h3>
              <p className="text-[#b0a9ad] leading-relaxed">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="mb-32">
        <div className="text-center mb-16">
          <h2 className="font-headline text-5xl font-black text-[#faf1f5] mb-4">How it Works</h2>
          <p className="text-[#b0a9ad] text-lg font-light">Three steps from discovery to signed contract.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Build Your Profile', body: 'Showcase your portfolio, set your rates, and define the kind of work you want. Your profile is your pitch.' },
            { step: '02', title: 'Find & Bid', body: 'Browse curated opportunities and submit a targeted bid — your rate, your timeline, your terms.' },
            { step: '03', title: 'Close the Deal', body: 'Communicate directly with the employer through our secure messaging system and finalize the engagement.' },
          ].map((step) => (
            <div key={step.step} className="relative bg-[#1c181c] border border-[#292428] rounded-2xl p-10 hover:border-[#caa2f7]/20 transition-all">
              <div className="font-headline text-7xl font-black text-[#292428] mb-4">{step.step}</div>
              <h3 className="font-headline text-2xl font-bold text-[#faf1f5] mb-4">{step.title}</h3>
              <p className="text-[#b0a9ad] leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-gradient-to-br from-[#1c181c] to-[#100d10] border border-[#caa2f7]/10 rounded-[2rem] p-20">
        <h2 className="font-headline text-5xl font-black text-[#faf1f5] mb-6">
          Ready to Join?
        </h2>
        <p className="text-[#b0a9ad] text-lg font-light mb-10 max-w-xl mx-auto">
          Whether you are hiring or bidding, the network is open. No gatekeepers. No waiting lists.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/sign-up"
            className="px-10 py-4 rounded-xl bg-gradient-to-br from-[#caa2f7] to-[#613471] text-[#431f6b] font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#caa2f7]/20 hover:brightness-110 active:scale-95 transition-all"
          >
            Create Free Account
          </Link>
          <Link
            href="/blog"
            className="px-10 py-4 rounded-xl border border-[#4b474a] text-[#faf1f5] font-black text-xs uppercase tracking-[0.2em] hover:bg-[#1c181c] transition-all"
          >
            Read Our Editorial
          </Link>
        </div>
      </section>
    </main>
  )
}
