import { getAuthUserAs } from '@/lib/auth-utils'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StripeCheckoutButton from '@/components/features/StripeCheckoutButton'
import StripeBillingPortalButton from '@/components/features/StripeBillingPortalButton'
import DownloadLedgerButton from './DownloadLedgerButton'

async function getStripeSubscription(stripeCustomerId: string | null) {
  if (!stripeCustomerId || !process.env.STRIPE_SECRET_KEY) return null
  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const subs = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      limit: 1,
      expand: ['data.items.data.price.product'],
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sub = subs.data[0] as any
    if (!sub) return null

    const items = sub.items as { data: Array<{ price: { unit_amount: number; recurring?: { interval: string }; product?: { name?: string } | string } }> }
    const item = items?.data?.[0]
    const price = item?.price
    const product = price?.product as { name?: string } | undefined

    return {
      planName: (typeof product === 'object' ? product?.name : null) || 'Active Plan',
      amount: ((price?.unit_amount || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 }),
      interval: price?.recurring?.interval || 'month',
      renewalDate: new Date(((sub.current_period_end as number) || 0) * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: sub.status as string,
    }
  } catch {
    return null
  }
}

async function getStripeInvoices(stripeCustomerId: string | null) {
  if (!stripeCustomerId || !process.env.STRIPE_SECRET_KEY) return []
  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const result = await stripe.invoices.list({
      customer: stripeCustomerId,
      limit: 10,
    })
    return result.data.map((inv) => ({
      id: inv.number || inv.id,
      date: new Date((inv.created || 0) * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      amount: ((inv.amount_paid || 0) / 100).toLocaleString('en-US', {
        minimumFractionDigits: 2,
      }),
      status: inv.status === 'paid' ? 'Paid' : inv.status === 'open' ? 'Pending' : (inv.status || 'Unknown'),
      pdfUrl: inv.invoice_pdf || null,
    }))
  } catch {
    return []
  }
}

export default async function EmployerBillingPage() {
  const { profile } = await getAuthUserAs('employer')

  // Fetch real Stripe data
  const [invoices, subscription] = await Promise.all([
    getStripeInvoices(profile?.stripe_customer_id),
    getStripeSubscription(profile?.stripe_customer_id),
  ])

  const activePlanName = subscription?.planName?.toLowerCase() || ''

  const tiers = [
    {
      name: 'Pro Tier',
      price: '450',
      description: 'Standard growth for small teams.',
      features: ['10 Active Bids', 'Basic Analytics', 'Standard Support'],
      current: activePlanName.includes('pro'),
      color: 'stone-500',
      planId: 'employer_pro',
    },
    {
      name: 'Visionary Enterprise',
      price: '1,450',
      description: 'Elite scaling for rapid talent procurement.',
      features: ['Unlimited Bids', 'AI Talent Matching', 'Dedicated Account Architect'],
      current: activePlanName.includes('visionary') || activePlanName.includes('enterprise'),
      color: 'secondary',
      planId: 'employer_visionary',
    },
    {
      name: 'Nexus Supreme',
      price: '5,000',
      description: 'Global dominance and market predictive intel.',
      features: ['Global Headhunting', 'Predictive Market Intel', 'Multi-Entity Management'],
      current: activePlanName.includes('nexus') || activePlanName.includes('supreme'),
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
                <h2 className="text-4xl font-headline font-black italic text-on-surface">
                  {subscription?.planName || 'No Active Plan'}
                </h2>
              </div>
              {subscription ? (
                <div className="bg-secondary/10 text-secondary border border-secondary/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Protocol Verified
                </div>
              ) : (
                <div className="bg-stone-800 text-stone-400 border border-stone-700 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                  No Subscription
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Next Renewal Cycle</p>
                <p className="text-3xl font-headline font-black italic text-on-surface">
                  {subscription?.renewalDate || '—'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Cycle Investment</p>
                <p className="text-3xl font-headline font-black italic text-on-surface">
                  {subscription ? (
                    <>${subscription.amount} <span className="text-sm italic font-normal text-stone-500">/{subscription.interval}</span></>
                  ) : '—'}
                </p>
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
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-6">Payment Method</p>
              {subscription ? (
                <div className="p-8 rounded-3xl bg-surface-container-highest border border-outline-variant/20 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>credit_card</span>
                    <p className="text-sm font-bold text-on-surface">Managed via Stripe</p>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-relaxed font-bold uppercase tracking-widest">
                    Your payment method is securely stored by Stripe. Use the portal below to update card details or billing information.
                  </p>
                  <StripeBillingPortalButton
                    label="Manage Payment Method"
                    className="w-full mt-4 bg-secondary/10 border border-secondary/30 text-secondary px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-secondary/20 transition-all disabled:opacity-50"
                  />
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-surface-container-highest border border-dashed border-outline-variant/30 flex flex-col items-center text-center gap-4">
                  <span className="material-symbols-outlined text-4xl text-stone-600">credit_card_off</span>
                  <p className="text-sm text-stone-400 font-bold">No payment method on file</p>
                  <p className="text-[10px] text-stone-600 uppercase tracking-widest font-bold">Subscribe to a plan to add a payment method</p>
                </div>
              )}
           </div>

           <div className="mt-12 p-8 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">256-bit SSL Encryption</p>
              </div>
              <p className="text-[9px] text-stone-500 leading-relaxed font-bold uppercase tracking-widest">All payment data is processed and secured by Stripe. BidJobs never stores your card details.</p>
           </div>
        </section>
      </div>

      {/* Invoice History */}
      <section className="mb-24">
        <div className="flex justify-between items-end mb-12">
           <h3 className="text-4xl font-headline font-black italic text-on-surface">Invoice History</h3>
           <DownloadLedgerButton invoices={invoices} />
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
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-16 text-center text-stone-500 text-sm italic">
                      No invoices yet. Your billing history will appear here after your first payment.
                    </td>
                  </tr>
                ) : invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-surface-container-highest transition-colors group">
                    <td className="px-10 py-8 font-black text-sm text-on-surface tracking-tighter">#{inv.id}</td>
                    <td className="px-10 py-8 text-sm text-stone-400 font-bold">{inv.date}</td>
                    <td className="px-10 py-8 font-headline text-lg italic text-on-surface-variant font-black">${inv.amount}</td>
                    <td className="px-10 py-8">
                       <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${
                         inv.status === 'Paid'
                           ? 'bg-green-500/10 text-green-400 border-green-500/20'
                           : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                       }`}>{inv.status === 'Paid' ? 'Finalized' : inv.status}</span>
                    </td>
                    <td className="px-10 py-8 text-right">
                       {inv.pdfUrl ? (
                         <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" className="material-symbols-outlined text-stone-500 hover:text-secondary transition-all opacity-0 group-hover:opacity-100">download</a>
                       ) : (
                         <span className="material-symbols-outlined text-stone-700 opacity-0 group-hover:opacity-50">download</span>
                       )}
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