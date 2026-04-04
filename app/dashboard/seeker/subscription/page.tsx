import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function SeekerSubscriptionPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/sign-in')
  }

  // 1. Fetch Subscription Status
  const { data: profile } = await supabase
    .from('users')
    .select('user_type')
    .eq('auth_id', user.id)
    .single()

  if (profile?.user_type !== 'jobseeker' && profile?.user_type !== 'both') {
    redirect('/dashboard/employer')
  }

  const plans = [
    {
      name: 'Talent Starter',
      price: '0',
      description: 'Perfect for discovering the platform and making your first professional connections.',
      features: ['Basic CV Parsing', '5 Monthly Bids', 'Public Profile'],
      isCurrent: true,
      color: 'stone-500',
      icon: 'rocket_launch'
    },
    {
      name: 'Elite Professional',
      price: '19',
      description: 'The competitive edge for serious talent looking to dominate their market niche.',
      features: ['Unlimited AI Optimization', 'Priority Role Access', 'Profile Boost (2x Visibility)', 'Direct DM to Recruiters'],
      isCurrent: false,
      recommended: true,
      color: 'primary',
      icon: 'workspace_premium'
    },
    {
      name: 'Visionary Enterprise',
      price: 'Custom',
      description: 'Bespoke solutions for executive search and institutional talent procurement.',
      features: ['Dedicated Talent Manager', 'Custom API Integration', 'Bulk AI Processing'],
      isCurrent: false,
      color: 'secondary',
      icon: 'corporate_fare'
    }
  ]

  return (
    <main className="max-w-7xl mx-auto px-8 py-12 relative overflow-hidden">
      
      {/* Visual Ambiance */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-5%] left-[-2%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="mb-24 text-center space-y-6">
        <h2 className="font-headline text-7xl font-black italic text-on-surface leading-tight">
          Your Career, <br/>
          <span className="text-primary">Amplified.</span>
        </h2>
        <p className="text-on-surface-variant font-body max-w-2xl mx-auto text-lg italic opacity-80 leading-relaxed">
          Unlock the full potential of the BidJobs Protocol. Deploy advanced AI tools and prioritize your visibility across the global elite market.
        </p>
      </header>

      {/* Pricing Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`
              bg-surface-container rounded-[3rem] p-12 border transition-all duration-500 flex flex-col justify-between group
              ${plan.recommended 
                ? 'border-primary/40 shadow-[0_32px_64px_rgba(202,162,247,0.15)] scale-105 z-20' 
                : 'border-outline-variant/10 opacity-80 hover:opacity-100'
              }
            `}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] font-black uppercase tracking-[0.3em] px-8 py-2 rounded-full shadow-xl">
                 Recommended
              </div>
            )}

            <div className="space-y-8">
              <div className={`w-16 h-16 rounded-2xl bg-stone-900 border border-${plan.color}/20 flex items-center justify-center text-${plan.color}`}>
                <span className="material-symbols-outlined text-3xl" style={plan.recommended ? { fontVariationSettings: "'FILL' 1" } : {}}>{plan.icon}</span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl font-headline font-black italic text-on-surface">{plan.name}</h3>
                <p className="text-sm text-on-surface-variant font-body leading-relaxed italic opacity-80">{plan.description}</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-headline font-black italic text-${plan.color}`}>SAR {plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-stone-500 font-black uppercase tracking-widest text-[10px]">/ month</span>}
                </div>
                
                <ul className="space-y-4">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-center gap-3 text-sm font-bold text-on-surface-variant">
                      <span className={`material-symbols-outlined text-lg text-${plan.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12">
               {plan.isCurrent ? (
                 <button className="w-full py-5 rounded-2xl border border-outline-variant/20 text-stone-500 font-black uppercase tracking-widest text-[10px] cursor-default bg-stone-900/40">
                    Current Protocol
                 </button>
               ) : (
                 <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]
                   ${plan.name === 'Elite Professional' 
                     ? 'bg-primary text-on-primary shadow-primary/20' 
                     : 'bg-stone-800 text-stone-300 border border-outline-variant/10'
                   }
                 `}>
                    Initialize Upgrade
                 </button>
               )}
            </div>
          </div>
        ))}
      </section>

      {/* Feature Bento Grid (Briefly) */}
      <section className="mt-40 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
         <div className="p-12 rounded-[3rem] bg-surface-container border border-outline-variant/10 shadow-2xl space-y-6 relative overflow-hidden group">
            <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            <h4 className="text-3xl font-headline font-black italic text-on-surface">Universal CV Optimization</h4>
            <p className="text-on-surface-variant text-sm font-body italic opacity-80 leading-relaxed">
              Our proprietary neural network refines your dossier for every mission you target, ensuring a 99% alignment with the employer's tectonic requirements.
            </p>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 blur-[80px] pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
         </div>
         <div className="p-12 rounded-[3rem] bg-surface-container border border-outline-variant/10 shadow-2xl space-y-6 relative overflow-hidden group">
            <span className="material-symbols-outlined text-4xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
            <h4 className="text-3xl font-headline font-black italic text-on-surface">Priority Signal Detection</h4>
            <p className="text-on-surface-variant text-sm font-body italic opacity-80 leading-relaxed">
              Gain 48-hour advanced reconnaissance on elite roles before they are deployed to the public market pool. Be the first point of contact.
            </p>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-secondary/5 blur-[80px] pointer-events-none group-hover:bg-secondary/10 transition-colors"></div>
         </div>
      </section>

      <footer className="mt-32 pt-12 border-t border-outline-variant/10 text-center space-y-4">
         <p className="text-[10px] text-stone-600 font-black uppercase tracking-[0.2em]">BidJobs Protocol Billing & Governance</p>
         <div className="flex justify-center gap-8 text-[9px] font-black uppercase tracking-widest text-stone-500">
            <a href="#" className="hover:text-primary transition-colors">Integrity Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy Shield</a>
            <a href="#" className="hover:text-primary transition-colors">Refund Protocol</a>
         </div>
      </footer>
    </main>
  )
}