import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StripeCheckoutButton from '@/components/features/StripeCheckoutButton'
import StripeBillingPortalButton from '@/components/features/StripeBillingPortalButton'

export default async function EmployerBillingPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/sign-in')
  }

  // 1. Fetch Employer Profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', user.id)
    .single()

  if (profile?.user_type !== 'employer' && profile?.user_type !== 'both') {
    redirect('/dashboard/seeker')
  }

  // Mock Invoice History
  const invoices = [
    { id: 'BJ-990112', date: 'Sept 24, 2023', amount: '1,450.00', status: 'Paid' },
    { id: 'BJ-990111', date: 'Aug 24, 2023', amount: '1,450.00', status: 'Paid' },
    { id: 'BJ-990110', date: 'July 24, 2023', amount: '1,200.00', status: 'Paid' },
    { id: 'BJ-990109', date: 'June 24, 2023', amount: '1,200.00', status: 'Paid' },
  ]

  const tiers = [
    {
      name: 'Pro Tier',
      price: '450',
      description: 'Standard growth for small teams.',
      features: ['10 Active Bids', 'Basic Analytics', 'Standard Support'],
      current: false,
      color: 'stone-500',
      planId: 'employer_pro',
    },
    {
      name: 'Visionary Enterprise',
      price: '1,450',
      description: 'Elite scaling for rapid talent procurement.',
      features: ['Unlimited Bids', 'AI Talent Matching', 'Dedicated Account Architect'],
      current: true,
      color: 'secondary',
      planId: 'employer_visionary',
    },
    {
      name: 'Nexus Supreme',
      price: '5,000',
      description: 'Global dominance and market predictive intel.',
      features: ['Global Headhunting', 'Predictive Market Intel', 'Multi-Entity Management'],
      current: false,
      color: 'primary',
      planId: 'employer_nexus',
    },
  ]

  return (
    <main className="max-w-7xl mx-auto px-8 py-12 relative">
      <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none"></div>

      <header className="mb-20">
        <h1 className="font-headline text-6xl font-black italic text-on-background tracking-tight mb-4">
          Billing & <span className="text-secondary">Capital</span>
        </h1>
        <p className="text-on-surface-variant font-body max-w-2xl text-lg italic opacity-80 leading-relaxed">
          Manage your elite access to global talent pools. Monitor active subscription cycles and review historical investments in your team architecture.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-8 mb-24">
        {/* Current Plan Section */}
        <section className="col-span-12 lg:col-span-7 bg-surface-container-low rounded-[3rem] p-12 border border-outline-variant/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors duration-700"></div>
          
          <div className="relative z-10 space-y-12">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-3">Active Subscription</p>
                <h2 className="text-4xl font-headline font-black italic text-on-surface">Visionary Enterprise</h2>
              </div>
              <div className="bg-secondary/10 text-secondary border border-secondary/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                Protocol Verified
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Next Renewal Cycle</p>
                <p className="text-3xl font-headline font-black italic text-on-surface">Oct 24, 2023</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Cycle Investment</p>
                <p className="text-3xl font-headline font-black italic text-on-surface">$1,450.00 <span className="text-sm italic font-normal text-stone-500">/mo</span></p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-8 border-t border-outline-variant/10">
              <StripeBillingPortalButton
                label="Modify Protocol"
                className="bg-secondary text-on-secondary-container px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-secondary/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              />
              <StripeBillingPortalButton
                label="Pause Renewal"
                className="bg-surface-container-highest border border-outline-variant/10 text-stone-300 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-stone-800 transition-all disabled:opacity-50"
              />
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="col-span-12 lg:col-span-5 bg-surface-container-low rounded-[3rem] p-12 border border-outline-variant/10 shadow-2xl flex flex-col justify-between">
           <div className="space-y-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-6">Master Payment method</p>
              <div className="p-8 rounded-3xl bg-surface-container-highest border border-outline-variant/20 flex items-center justify-between group hover:border-secondary transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-9 bg-black rounded border border-white/10 flex items-center justify-center font-black italic text-[10px] text-stone-400">VISA</div>
                  <div>
                    <p className="text-sm font-bold text-on-surface uppercase tracking-tight">Corporate Amex •••• 9902</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Exp 12 / 2026</p>
                  </div>
                </div>
                <button className="material-symbols-outlined text-stone-500 hover:text-secondary transition-colors">edit</button>
              </div>
           </div>
           
           <div className="mt-12 p-8 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Biometric Security Enabled</p>
              </div>
              <p className="text-[9px] text-stone-500 leading-relaxed font-bold uppercase tracking-widest">Transactions are finalized via encrypted neural link and verified across the global node network.</p>
           </div>
        </section>
      </div>

      {/* Invoice History */}
      <section className="mb-24">
        <div className="flex justify-between items-end mb-12">
           <h3 className="text-4xl font-headline font-black italic text-on-surface">Invoice History</h3>
           <button className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary hover:underline underline-offset-8">Download Protocol Ledger</button>
        </div>

        <div className="bg-surface-container rounded-[3rem] overflow-hidden border border-outline-variant/10">
           <table className="w-full text-left font-body">
              <thead>
                <tr className="border-b border-outline-variant/10 bg-surface-container-high">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Identifier</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Execution Date</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Capital Invested</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Status</th>
                  <th className="px-10 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-surface-container-highest transition-colors group">
                    <td className="px-10 py-8 font-black text-sm text-on-surface tracking-tighter">#{inv.id}</td>
                    <td className="px-10 py-8 text-sm text-stone-400 font-bold">{inv.date}</td>
                    <td className="px-10 py-8 font-headline text-lg italic text-on-surface-variant font-black">${inv.amount}</td>
                    <td className="px-10 py-8">
                       <span className="bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-green-500/20">Finalized</span>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <button className="material-symbols-outlined text-stone-500 hover:text-secondary transition-all opacity-0 group-hover:opacity-100">download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </section>

      {/* Tier Selection */}
      <section className="mt-32">
        <h3 className="text-4xl font-headline font-black italic text-on-surface mb-12 text-center">Elevate Your Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div key={tier.name} className={`
              p-12 rounded-[3rem] bg-surface-container-low border transition-all duration-500 flex flex-col justify-between group
              ${tier.current ? 'border-secondary/40 shadow-2xl shadow-secondary/10 scale-105 z-10' : 'border-outline-variant/10 opacity-70 hover:opacity-100'}
            `}>
               <div className="space-y-8">
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-${tier.color}`}>{tier.name}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-headline font-black italic text-on-surface">${tier.price}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-600">/ mo</span>
                  </div>
                  <p className="text-sm text-on-surface-variant italic font-body leading-relaxed">{tier.description}</p>
                  <ul className="space-y-4 pt-4">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-xs font-bold text-on-surface-variant">
                        <span className={`material-symbols-outlined text-lg text-${tier.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        {f}
                      </li>
                    ))}
                  </ul>
               </div>
               <div className="mt-12">
                  {tier.current ? (
                    <button className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-secondary/10 border border-secondary/30 text-secondary cursor-default">
                      Active Protocol
                    </button>
                  ) : (
                    <StripeCheckoutButton
                      planId={tier.planId}
                      label="Initialize Migration"
                      className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-stone-800 text-stone-400 hover:bg-stone-700 transition-all disabled:opacity-50"
                    />
                  )}
               </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}