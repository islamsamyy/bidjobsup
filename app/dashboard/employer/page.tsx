import { getAuthUserAs, getAuthUser } from '@/lib/auth-utils'
import { getEmployerAnalytics } from '@/lib/actions/analytics'
import { getUserInterviews } from '@/lib/actions/interviews'
import { getUserDisputes } from '@/lib/actions/disputes'
import { EmployerDashboardClient } from './EmployerDashboardClient'
import { EmployerProfileClient } from './profile/EmployerProfileClient'
import { ListingsClient } from './listings/ListingsClient'
import { ContractsClient } from '../contracts/ContractsClient'
import InterviewsClient from '../interviews/InterviewsClient'
import PaymentHistoryClient from '../payments/client'
import ReviewManagementClient from '../reviews/client'
import DisputesClient from '../disputes/DisputesClient'
import { MessagesClient } from '../messages/MessagesClient'
import TalentCardWithInvite from '@/components/features/employer/TalentCardWithInvite'
import { PageHeader } from '../components/PageHeader'
import Link from 'next/link'
import StripeCheckoutButton from '@/components/features/StripeCheckoutButton'
import StripeBillingPortalButton from '@/components/features/StripeBillingPortalButton'
import DownloadLedgerButton from './billing/DownloadLedgerButton'
import { markAllNotificationsAsRead } from '@/lib/actions/notifications'

export const dynamic = 'force-dynamic'

export default async function EmployerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>
}) {
  const params = await searchParams
  const s = params?.s || 'overview'

  if (s === 'profile') return <ProfileSection />
  if (s === 'listings') return <ListingsSection />
  if (s === 'contracts') return <ContractsSection />
  if (s === 'interviews') return <InterviewsSection />
  if (s === 'payments') return <PaymentsSection />
  if (s === 'reviews') return <ReviewsSection />
  if (s === 'disputes') return <DisputesSection />
  if (s === 'messages') return <MessagesSection />
  if (s === 'talent') return <TalentSection />
  if (s === 'billing') return <BillingSection />
  if (s === 'notifications') return <NotificationsSection />

  // Default: overview
  return <OverviewSection />
}

// ─── Overview ────────────────────────────────────────────────────────────────

async function OverviewSection() {
  const { profile, supabase } = await getAuthUserAs('employer')

  const { count: activeJobsCount } = await supabase!
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('employer_id', profile?.id)
    .eq('status', 'open')

  const { count: applicantsCount } = await supabase!
    .from('bids')
    .select('*, jobs!inner()', { count: 'exact', head: true })
    .eq('jobs.employer_id', profile?.id)

  const { count: hiredCount } = await supabase!
    .from('contracts')
    .select('*', { count: 'exact', head: true })
    .eq('employer_id', profile?.id)

  const { count: totalJobsPosted } = await supabase!
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('employer_id', profile?.id)

  const analyticsResult = await getEmployerAnalytics()

  const isProfileComplete = !!(profile?.full_name && profile?.bio && profile?.company_name)
  const firstName = profile?.full_name?.split(' ')[0] || profile?.username || 'Partner'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <EmployerDashboardClient
      greeting={greeting}
      firstName={firstName}
      activeJobsCount={activeJobsCount || 0}
      applicantsCount={applicantsCount || 0}
      hiredCount={hiredCount || 0}
      totalJobsPosted={totalJobsPosted || 0}
      isProfileComplete={isProfileComplete}
      analyticsData={analyticsResult.data}
      hasFirstJob={(totalJobsPosted || 0) > 0}
      hasFirstHire={(hiredCount || 0) > 0}
      hasSubscription={profile?.subscription_status === 'active'}
    />
  )
}

// ─── Profile ─────────────────────────────────────────────────────────────────

async function ProfileSection() {
  const { profile } = await getAuthUserAs('employer')
  if (!profile) return <div>Loading...</div>
  return <EmployerProfileClient profile={profile} />
}

// ─── Listings ────────────────────────────────────────────────────────────────

async function ListingsSection() {
  const { profile, supabase } = await getAuthUserAs('employer')
  const { data: jobs } = await supabase!
    .from('jobs')
    .select(`*, bids_count:bids(count)`)
    .eq('employer_id', profile?.id)
    .order('created_at', { ascending: false })
  return <ListingsClient jobs={jobs || []} />
}

// ─── Contracts ───────────────────────────────────────────────────────────────

async function ContractsSection() {
  const { profile, supabase } = await getAuthUser()
  const { data: contracts } = await supabase!
    .from('contracts')
    .select(`
      *,
      job:job_id(id, title, description, budget_min, budget_max),
      freelancer:freelancer_id(id, full_name, avatar_url),
      employer:employer_id(id, full_name, company_name, avatar_url)
    `)
    .or(`freelancer_id.eq.${profile?.id},employer_id.eq.${profile?.id}`)
    .order('created_at', { ascending: false })
  return (
    <ContractsClient
      contracts={contracts}
      currentUserId={profile?.id || ''}
      userType={profile?.user_type || 'employer'}
    />
  )
}

// ─── Interviews ──────────────────────────────────────────────────────────────

async function InterviewsSection() {
  const { user: currentUser } = await getAuthUser()
  const { interviews = [] } = await getUserInterviews()
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <PageHeader titleKey="interviewsPage.title" subtitleKey="interviewsPage.subtitle" />
      <InterviewsClient
        initialInterviews={interviews}
        currentUserId={parseInt(currentUser?.id || '0')}
      />
    </main>
  )
}

// ─── Payments ────────────────────────────────────────────────────────────────

async function PaymentsSection() {
  const { user: currentUser, supabase } = await getAuthUser()

  const { data: paymentsData } = await supabase!
    .from('payments')
    .select(`
      id, amount, currency, status, payment_method, description, created_at,
      completed_at, payer_id, payee_id, contract_id,
      payer:payer_id(id, full_name, avatar_url),
      payee:payee_id(id, full_name, avatar_url),
      contract:contract_id(id, title)
    `)
    .or(`payer_id.eq.${currentUser?.id},payee_id.eq.${currentUser?.id}`)
    .order('created_at', { ascending: false })

  const payments = paymentsData?.map(p => ({
    ...p,
    payer: p.payer && Array.isArray(p.payer) ? p.payer[0] : p.payer,
    payee: p.payee && Array.isArray(p.payee) ? p.payee[0] : p.payee,
    contract: p.contract && Array.isArray(p.contract) ? p.contract[0] : p.contract,
  }))

  const { data: invoicesData } = await supabase!
    .from('invoices')
    .select(`
      id, invoice_number, amount, currency, status, issue_date, due_date, created_at,
      from_user_id, to_user_id,
      from_user:from_user_id(id, full_name, avatar_url),
      to_user:to_user_id(id, full_name, avatar_url)
    `)
    .or(`from_user_id.eq.${currentUser?.id},to_user_id.eq.${currentUser?.id}`)
    .order('created_at', { ascending: false })

  const invoices = invoicesData?.map(i => ({
    ...i,
    from_user: i.from_user && Array.isArray(i.from_user) ? i.from_user[0] : i.from_user,
    to_user: i.to_user && Array.isArray(i.to_user) ? i.to_user[0] : i.to_user,
  }))

  return (
    <PaymentHistoryClient
      payments={payments || []}
      invoices={invoices || []}
      currentUserId={Number(currentUser?.id)}
    />
  )
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

async function ReviewsSection() {
  const { profile: currentUser, supabase } = await getAuthUser()

  const { data: reviewsData } = await supabase!
    .from('reviews')
    .select(`
      id, rating, comment, created_at, job_id, reviewer_id,
      reviewer:reviewer_id(id, full_name, avatar_url, email),
      job:job_id(id, title)
    `)
    .eq('reviewee_id', currentUser?.id)
    .order('created_at', { ascending: false })

  const reviews = reviewsData?.map(r => ({
    ...r,
    reviewer: r.reviewer && Array.isArray(r.reviewer) ? r.reviewer[0] : r.reviewer,
    job: r.job && Array.isArray(r.job) ? r.job[0] : r.job,
  }))

  return (
    <ReviewManagementClient
      reviews={reviews || []}
      currentUserId={Number(currentUser?.id || 0)}
    />
  )
}

// ─── Disputes ────────────────────────────────────────────────────────────────

async function DisputesSection() {
  const { profile: currentUser } = await getAuthUser()
  const { disputes = [] } = await getUserDisputes()
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <PageHeader titleKey="disputesPage.title" subtitleKey="disputesPage.subtitle" />
      <DisputesClient
        initialDisputes={disputes}
        currentUserId={Number(currentUser?.id)}
      />
    </main>
  )
}

// ─── Messages ────────────────────────────────────────────────────────────────

async function MessagesSection() {
  const { profile: internalUser, supabase } = await getAuthUser()

  const { data: conversations } = await supabase!
    .from('conversations')
    .select(`
      id, last_message_at,
      participant_1:users!participant_1_id ( id, full_name, username, avatar_url ),
      participant_2:users!participant_2_id ( id, full_name, username, avatar_url )
    `)
    .or(`participant_1_id.eq.${internalUser?.id},participant_2_id.eq.${internalUser?.id}`)
    .order('last_message_at', { ascending: false })

  const conversationsWithPreview = await Promise.all(
    (conversations || []).map(async (conv) => {
      const { data: lastMsg } = await supabase!
        .from('messages')
        .select('content, created_at, sender_id')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      type Participant = { id: number; full_name?: string; username?: string; avatar_url?: string } | null
      const p1 = conv.participant_1 as unknown as Participant
      const p2 = conv.participant_2 as unknown as Participant
      const other = p1?.id === internalUser?.id ? p2 : p1

      return {
        id: conv.id,
        lastMessageAt: conv.last_message_at,
        other: {
          name: other?.full_name || other?.username || 'Unknown',
          avatar_url: other?.avatar_url,
          initials: (other?.full_name || other?.username || 'U')
            .split(' ')
            .map((w: string) => w[0])
            .join(''),
        },
        preview: lastMsg?.content || 'No messages yet',
        previewTime: lastMsg?.created_at || conv.last_message_at,
        isOwnLastMessage: lastMsg?.sender_id === internalUser?.id,
      }
    })
  )

  return <MessagesClient conversations={conversationsWithPreview} userType={internalUser?.user_type} />
}

// ─── Talent ──────────────────────────────────────────────────────────────────

async function TalentSection() {
  const { profile, supabase } = await getAuthUserAs('employer')

  const { data: employerJobs } = await supabase!
    .from('jobs')
    .select('id')
    .eq('employer_id', profile?.id)

  const jobIds = employerJobs?.map(j => j.id) || []

  const { data: bids } = await supabase!
    .from('bids')
    .select(`
      *,
      seeker:bidder_id ( id, full_name, username, avatar_url, bio ),
      job:job_id ( id, title )
    `)
    .in('job_id', jobIds.length > 0 ? jobIds : [-1])
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <header className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h2 className="font-headline text-6xl font-black italic text-on-surface leading-tight">
              Candidate <span className="text-primary">Pipeline</span>
            </h2>
            <p className="text-on-surface-variant font-body max-w-md text-sm leading-relaxed">
              Curating elite talent for your active missions. Review, analyze, and initialize secure handshakes with global architects.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10 shadow-xl text-center min-w-[140px]">
              <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest mb-1">Incoming Flow</p>
              <p className="text-3xl font-headline font-black italic text-primary">{bids?.length || 0}</p>
            </div>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {!bids || bids.length === 0 ? (
          <div className="col-span-full p-20 rounded-3xl bg-surface-container border-2 border-dashed border-outline-variant/20 flex flex-col items-center justify-center text-center space-y-6">
            <span className="material-symbols-outlined text-4xl text-stone-600">person_search</span>
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-bold text-on-surface italic">Pipeline Empty</h3>
              <p className="text-on-surface-variant max-w-xs mx-auto text-sm">No proposals yet for your open roles.</p>
            </div>
            <Link href="/dashboard/employer?s=listings" className="text-primary font-black uppercase tracking-widest text-xs hover:underline">View Open Roles</Link>
          </div>
        ) : (
          bids.map((bid) => (
            <TalentCardWithInvite key={bid.id} bid={bid} employerJobs={employerJobs || []} />
          ))
        )}
      </div>
    </main>
  )
}

// ─── Billing ─────────────────────────────────────────────────────────────────

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
    type SubAny = { items?: { data: Array<{ price: { unit_amount: number; recurring?: { interval: string }; product?: { name?: string } | string } }> }; current_period_end?: number; status: string }
    const sub = subs.data[0] as unknown as SubAny | undefined
    if (!sub) return null
    const items = sub.items as { data: Array<{ price: { unit_amount: number; recurring?: { interval: string }; product?: { name?: string } | string } }> }
    const item = items?.data?.[0]
    const price = item?.price
    const product = price?.product as { name?: string } | undefined
    return {
      planName: (typeof product === 'object' ? product?.name : null) || 'Active Plan',
      amount: ((price?.unit_amount || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 }),
      interval: price?.recurring?.interval || 'month',
      renewalDate: new Date(((sub.current_period_end as number) || 0) * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: sub.status as string,
    }
  } catch { return null }
}

async function getStripeInvoices(stripeCustomerId: string | null) {
  if (!stripeCustomerId || !process.env.STRIPE_SECRET_KEY) return []
  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const result = await stripe.invoices.list({ customer: stripeCustomerId, limit: 10 })
    return result.data.map((inv) => ({
      id: inv.number || inv.id,
      date: new Date((inv.created || 0) * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: ((inv.amount_paid || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 }),
      status: inv.status === 'paid' ? 'Paid' : inv.status === 'open' ? 'Pending' : (inv.status || 'Unknown'),
      pdfUrl: inv.invoice_pdf || null,
    }))
  } catch { return [] }
}

async function BillingSection() {
  const { profile } = await getAuthUserAs('employer')

  const [invoices, subscription] = await Promise.all([
    getStripeInvoices(profile?.stripe_customer_id),
    getStripeSubscription(profile?.stripe_customer_id),
  ])

  const activePlanName = subscription?.planName?.toLowerCase() || ''

  const tiers = [
    {
      name: 'Pro Tier', price: '450', description: 'Standard growth for small teams.',
      features: ['10 Active Bids', 'Basic Analytics', 'Standard Support'],
      current: activePlanName.includes('pro'), color: 'stone-500', planId: 'employer_pro',
    },
    {
      name: 'Visionary Enterprise', price: '1,450', description: 'Elite scaling for rapid talent procurement.',
      features: ['Unlimited Bids', 'AI Talent Matching', 'Dedicated Account Architect'],
      current: activePlanName.includes('visionary') || activePlanName.includes('enterprise'),
      color: 'secondary', planId: 'employer_visionary',
    },
    {
      name: 'Nexus Supreme', price: '4,500', description: 'Total command. Unlimited everything.',
      features: ['Custom Integrations', 'White-glove Onboarding', 'SLA Guarantee'],
      current: activePlanName.includes('nexus'), color: 'primary', planId: 'employer_nexus',
    },
  ]

  return (
    <main className="max-w-6xl mx-auto px-8 py-12">
      <header className="mb-12">
        <h2 className="text-4xl font-headline font-black italic text-on-surface leading-tight">
          Command <span className="text-secondary-neon italic">Billing</span>
        </h2>
        <p className="text-on-surface-variant mt-2 text-lg">Manage your subscription and invoices.</p>
      </header>

      {subscription && (
        <div className="mb-10 p-8 bg-secondary/5 border border-secondary/20 rounded-2xl flex items-center justify-between gap-6">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-secondary mb-1">Active Plan</p>
            <p className="text-2xl font-headline font-black text-on-surface">{subscription.planName}</p>
            <p className="text-sm text-on-surface-variant mt-1">
              SAR {subscription.amount}/{subscription.interval} · Renews {subscription.renewalDate}
            </p>
          </div>
          <StripeBillingPortalButton />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {tiers.map((tier) => (
          <div key={tier.name} className={`rounded-2xl p-8 border transition-all ${tier.current ? 'border-secondary bg-secondary/5' : 'border-outline-variant/20 bg-surface-container'}`}>
            {tier.current && (
              <span className="inline-block px-3 py-1 bg-secondary text-stone-950 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">Current</span>
            )}
            <h3 className="text-xl font-headline font-black text-on-surface mb-1">{tier.name}</h3>
            <p className="text-on-surface-variant text-sm mb-4">{tier.description}</p>
            <p className="text-3xl font-headline font-black text-on-surface mb-6">SAR {tier.price}<span className="text-sm font-normal text-on-surface-variant">/mo</span></p>
            <ul className="space-y-2 mb-8">
              {tier.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm text-secondary">check</span>
                  {f}
                </li>
              ))}
            </ul>
            {!tier.current && <StripeCheckoutButton planId={tier.planId} />}
          </div>
        ))}
      </div>

      {invoices.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-headline font-black text-on-surface">Invoice History</h3>
            <DownloadLedgerButton invoices={invoices} />
          </div>
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-5 bg-surface-container rounded-xl border border-outline-variant/10">
                <div>
                  <p className="font-medium text-on-surface text-sm">{inv.id}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{inv.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded-full ${inv.status === 'Paid' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{inv.status}</span>
                  <p className="font-bold text-on-surface">SAR {inv.amount}</p>
                  {inv.pdfUrl && (
                    <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-widest text-secondary hover:underline">PDF</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────

async function NotificationsSection() {
  const { profile, supabase } = await getAuthUserAs('employer')

  const { data: notifications } = await supabase!
    .from('notifications')
    .select('*')
    .eq('user_id', profile?.id)
    .order('created_at', { ascending: false })

  const unreadCount = notifications?.filter(n => !n.read_at).length || 0

  return (
    <main className="max-w-4xl mx-auto px-8 py-12">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-headline font-black italic text-on-surface leading-tight">
            Command <span className="text-secondary-neon italic">Alerts</span>
          </h2>
          <p className="text-on-surface-variant mt-2 text-lg">Operational updates regarding your open roles.</p>
        </div>
        {unreadCount > 0 && (
          <form action={markAllNotificationsAsRead}>
            <input type="hidden" name="userId" value={profile?.id} />
            <button type="submit" className="text-xs font-black uppercase tracking-widest text-secondary hover:text-secondary/70 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">done_all</span>
              Mark All Read ({unreadCount})
            </button>
          </form>
        )}
      </header>

      {!notifications || notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-surface-container rounded-3xl border-2 border-dashed border-outline-variant/20">
          <span className="material-symbols-outlined text-5xl text-stone-600 mb-6">notifications_active</span>
          <h3 className="text-2xl font-headline font-bold text-on-surface italic mb-2">No Active Alerts</h3>
          <p className="text-on-surface-variant max-w-sm text-center text-sm">Your command center is quiet. Incoming intel regarding new agent bids will be routed here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} className={`group relative rounded-2xl p-6 border transition-all duration-300 ${notif.read_at ? 'bg-surface-container border-outline-variant/10' : 'bg-secondary/5 border-secondary/20'}`}>
              {!notif.read_at && (
                <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-secondary" />
              )}
              <p className="text-on-surface text-sm font-medium">{notif.message || notif.title}</p>
              <p className="text-on-surface-variant text-xs mt-2">
                {new Date(notif.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
