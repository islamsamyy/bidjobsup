import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import Link from 'next/link'

export const metadata = {
  title: 'Pricing Plans | BidJobs — Invest in Your Career Legacy',
  description: 'Join the elite tier of Saudi talent. Scale your visibility, optimize your applications, and land high-stakes roles.',
}

const TIER_FEATURES = {
  starter: [
    { name: 'Standard Job Search', active: true },
    { name: 'Basic Profile Builder', active: true },
    { name: 'ATS Optimizer', active: false },
    { name: 'Priority Support', active: false },
  ],
  elite: [
    { name: 'AI ATS Optimizer (Unlimited)', active: true },
    { name: 'Priority Role Access', active: true },
    { name: 'Profile Boost in Search', active: true },
    { name: 'Advanced App Tracking', active: true },
  ],
  enterprise: [
    { name: 'Dedicated Success Manager', active: true },
    { name: 'API & ERP Integration', active: true },
    { name: 'Custom Employer Branding', active: true },
    { name: 'Volume Direct Hiring', active: true },
  ]
}

export default function PricingPage() {
  return (
    <div className="bg-[#100d10] text-[#faf1f5] font-body min-h-screen flex flex-col selection:bg-[#caa2f7] selection:text-[#431f6b]">
      <PublicHeader />
      
      <main className="pt-40 pb-24 px-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-[#caa2f7]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-[#613471]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero */}
        <section className="max-w-7xl mx-auto text-center mb-20 relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-black tracking-[0.2em] uppercase mb-8">
            Ecosystem Access
          </span>
          <h1 className="font-headline text-5xl md:text-7xl font-bold mb-8 tracking-tighter leading-tight">
            Invest in Your <br />
            <span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_30px_rgba(202,162,247,0.3)]">
              Career Legacy.
            </span>
          </h1>
          <p className="text-[#b0a9ad] max-w-2xl mx-auto text-lg leading-relaxed mb-12 font-light">
            Join the elite tier of Saudi talent. From AI-driven ATS optimization to exclusive high-stakes roles, BidJobs provides the tools for Vision 2030 excellence.
          </p>
          
          <div className="flex items-center justify-center gap-6 mb-20">
            <span className="text-xs font-black uppercase tracking-widest text-[#585457]">Monthly</span>
            <button className="w-16 h-8 bg-[#1c181c] border border-[#292428] rounded-full p-1.5 flex items-center relative transition-all group">
              <div className="w-5 h-5 bg-[#caa2f7] rounded-full shadow-lg shadow-[#caa2f7]/40 transition-transform absolute right-1.5" />
            </button>
            <span className="text-xs font-black uppercase tracking-widest text-[#faf1f5]">Yearly <span className="text-[#caa2f7] ml-2 text-[10px] bg-[#caa2f7]/10 px-2 py-0.5 rounded">-20%</span></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {/* Starter */}
            <div className="bg-[#1c181c]/50 backdrop-blur-xl p-10 rounded-3xl border border-[#292428] text-left hover:bg-[#1c181c] transition-all group">
              <h3 className="font-headline text-2xl font-bold mb-2">Talent Starter</h3>
              <p className="text-[#585457] text-[10px] font-black uppercase tracking-widest mb-10">Ascent Mode</p>
              <div className="mb-10">
                <span className="text-5xl font-black">Free</span>
              </div>
              <ul className="space-y-5 mb-12">
                {TIER_FEATURES.starter.map(f => (
                  <li key={f.name} className={`flex items-center gap-3 text-xs ${f.active ? 'text-[#faf1f5]' : 'text-[#585457] opacity-60'}`}>
                    <span className={`material-symbols-outlined text-lg ${f.active ? 'text-[#caa2f7]' : ''}`}>{f.active ? 'check_circle' : 'block'}</span>
                    <span className={!f.active ? 'line-through' : ''}>{f.name}</span>
                  </li>
                ))}
              </ul>
              <Link href="/sign-in" className="block w-full py-5 rounded-2xl border border-[#292428] text-[#faf1f5] font-black text-xs uppercase tracking-widest text-center hover:bg-white/5 transition-all">
                Start for Free
              </Link>
            </div>

            {/* Elite Professional */}
            <div className="relative transform md:scale-105 z-20">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#caa2f7] text-[#431f6b] px-6 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase whitespace-nowrap shadow-xl shadow-[#caa2f7]/20">Most Popular</div>
              <div className="bg-[#1c181c] p-12 rounded-3xl border-2 border-[#caa2f7]/30 text-left shadow-[0_24px_80px_rgba(202,162,247,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#caa2f7]/5 to-transparent rounded-bl-[120px]" />
                <h3 className="font-headline text-3xl font-bold mb-2 text-[#caa2f7]">Elite Pro</h3>
                <p className="text-[#585457] text-[10px] font-black uppercase tracking-widest mb-10 text-primary-fixed">Definitive Toolset</p>
                <div className="mb-10 flex items-baseline gap-2">
                  <span className="text-xs font-black text-[#585457] uppercase tracking-tighter">SAR</span>
                  <span className="text-6xl font-black text-[#faf1f5]">19</span>
                  <span className="text-sm font-light text-[#585457]">/month</span>
                </div>
                <ul className="space-y-6 mb-14">
                  {TIER_FEATURES.elite.map(f => (
                    <li key={f.name} className="flex items-center gap-4 text-sm font-bold text-[#faf1f5]">
                      <span className="material-symbols-outlined text-[#caa2f7] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      <span>{f.name}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-5 rounded-2xl bg-gradient-to-br from-[#caa2f7] to-[#613471] text-[#431f6b] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#caa2f7]/20 hover:brightness-110 active:scale-[0.98] transition-all">
                  Upgrade to Elite
                </button>
              </div>
            </div>

            {/* Enterprise */}
            <div className="bg-[#1c181c]/50 backdrop-blur-xl p-10 rounded-3xl border border-[#292428] text-left hover:bg-[#1c181c] transition-all group">
              <h3 className="font-headline text-2xl font-bold mb-2">Visionary</h3>
              <p className="text-[#585457] text-[10px] font-black uppercase tracking-widest mb-10">Institutional</p>
              <div className="mb-10">
                <span className="text-4xl font-black">Custom</span>
              </div>
              <ul className="space-y-5 mb-12">
                {TIER_FEATURES.enterprise.map(f => (
                  <li key={f.name} className="flex items-center gap-3 text-xs text-[#faf1f5]">
                    <span className="material-symbols-outlined text-[#caa2f7] text-lg">check_circle</span>
                    <span>{f.name}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="block w-full py-5 rounded-2xl border border-[#292428] text-[#faf1f5] font-black text-xs uppercase tracking-widest text-center hover:bg-white/5 transition-all">
                Contact Strategy
              </Link>
            </div>
          </div>
        </section>

        {/* ATS Advantage */}
        <section className="max-w-7xl mx-auto mb-32">
          <div className="bg-[#1c181c] border border-[#292428] rounded-[40px] overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 lg:p-20 flex flex-col justify-center">
              <div className="inline-block w-fit px-4 py-1.5 bg-[#caa2f7]/10 border border-[#caa2f7]/20 text-[#caa2f7] rounded-full text-[9px] font-black tracking-widest uppercase mb-10">
                Premium Engine
              </div>
              <h2 className="font-headline text-4xl font-bold mb-8">Defeat the <span className="italic text-[#caa2f7] font-light">Algorithm.</span></h2>
              <p className="text-[#b0a9ad] text-lg mb-12 leading-relaxed font-light">
                Our ATS Optimizer analyzes your CV against high-tier job descriptions in real-time, suggesting keywords and structural changes to ensure you land in the "Shortlist" pile 95% of the time.
              </p>
              <div className="space-y-6">
                {[
                  { title: 'Neural Keyword Mapping', desc: 'Matches your experience with regional industry standards.', icon: 'psychology' },
                  { title: 'Structure Auditing', desc: 'Ensures formatting is readable by all major HR software.', icon: 'description' }
                ].map(item => (
                  <div key={item.title} className="flex items-center gap-5 translate-x-0 hover:translate-x-2 transition-transform duration-300 group cursor-default">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-[#292428] flex items-center justify-center shrink-0 group-hover:border-[#caa2f7]/30 transition-colors">
                      <span className="material-symbols-outlined text-[#caa2f7] text-2xl">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-black text-[10px] uppercase tracking-widest text-[#faf1f5]">{item.title}</h4>
                      <p className="text-xs text-[#585457] font-medium mt-1 uppercase tracking-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group overflow-hidden">
               <img 
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsUkvUFJMFkOKQNsBZmiZjehRgyba_TRfKOwhlpRbVJe369erN8GD6TNQbkpH04iJikmJSIGoGpNzEd5ka8gyBGzcO2N8U9U-AJeY2_Y0fUiuHIMjj2unW1boFX6o6Y7vzUK4r6L_-AyYRfESsatjexpDRfnDiGJ6kPwgEbVFESOa1nsEYAJiscgEA6IigVrAJqyuy0eDkhqqxaWscsDoONPk3SPfdfvRAY0AwIbD4O7LB4W0F1FyUeTLRkE5Hq_dPxTAbMlko16_y" 
                 alt="Elite Metrics" 
                 className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-60 transition-all duration-1000"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-[#1c181c] via-transparent to-transparent" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#1c181c]/80 to-transparent" />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto mb-20 text-center">
          <h2 className="font-headline text-3xl font-bold mb-16">Curated Intelligence</h2>
          <div className="space-y-4">
             {[
               { q: "Can I cancel my Elite Professional subscription at any time?", a: "Yes. We believe in the value of our product. You can cancel your monthly subscription at any time with no hidden fees or locked contracts." },
               { q: "Does the ATS Optimizer work for Arabic CVs?", a: "Absolutely. Our system is fully localized for Saudi Vision 2030, supporting both Modern Standard Arabic and English industry terminology." }
             ].map((item, i) => (
               <div key={i} className="bg-[#1c181c]/50 border border-[#292428] p-8 rounded-3xl text-left hover:border-[#caa2f7]/20 transition-all cursor-pointer">
                 <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-[#faf1f5] flex justify-between items-center">
                   {item.q}
                   <span className="material-symbols-outlined text-[#caa2f7]">expand_more</span>
                 </h4>
                 <p className="mt-4 text-[#b0a9ad] text-sm font-light leading-relaxed">{item.a}</p>
               </div>
             ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}