import { getAuthUserAs, getAuthUser } from '@/lib/auth-utils'
import { createClient } from '@/lib/supabase/server'
import { getSeekerAnalytics } from '@/lib/actions/analytics'
import { getUserInterviews } from '@/lib/actions/interviews'
import { getUserDisputes } from '@/lib/actions/disputes'
import { DashboardClient } from './DashboardClient'
import { ProfileClient } from './profile/ProfileClient'
import { ApplicationsClient } from './applications/ApplicationsClient'
import { SavedJobsClient } from './saved/SavedJobsClient'
import OffersClient from '../offers/client'
import { ContractsClient } from '../contracts/ContractsClient'
import InterviewsClient from '../interviews/InterviewsClient'
import PaymentHistoryClient from '../payments/client'
import ReviewManagementClient from '../reviews/client'
import DisputesClient from '../disputes/DisputesClient'
import { MessagesClient } from '../messages/MessagesClient'
import SkillsClient from './skills/client'
import { NotificationsClient } from './notifications/NotificationsClient'
import { SubscriptionClient } from './subscription/SubscriptionClient'
import PortfolioPage from './portfolio/page'
import { PageHeader } from '../components/PageHeader'

export const dynamic = 'force-dynamic'

export default async function SeekerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>
}) {
  const params = await searchParams
  const s = params?.s || 'overview'

  if (s === 'profile') return <ProfileSection />
  if (s === 'applications') return <ApplicationsSection />
  if (s === 'saved') return <SavedSection />
  if (s === 'offers') return <OffersSection />
  if (s === 'contracts') return <ContractsSection />
  if (s === 'interviews') return <InterviewsSection />
  if (s === 'payments') return <PaymentsSection />
  if (s === 'reviews') return <ReviewsSection />
  if (s === 'disputes') return <DisputesSection />
  if (s === 'portfolio') return <PortfolioPage />
  if (s === 'skills') return <SkillsSection />
  if (s === 'messages') return <MessagesSection />
  if (s === 'notifications') return <NotificationsSection />
  if (s === 'subscription') return <SubscriptionSection />

  // Default: overview
  return <OverviewSection />
}

// ─── Overview ────────────────────────────────────────────────────────────────

async function OverviewSection() {
  const { profile, supabase } = await getAuthUserAs('jobseeker')

  const { count: activeAppsCount } = await supabase!
    .from('bids')
    .select('*', { count: 'exact', head: true })
    .eq('bidder_id', profile?.id)
    .neq('status', 'rejected')

  const { count: savedJobsCount } = await supabase!
    .from('saved_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile?.id)

  const { data: reviews } = await supabase!
    .from('reviews')
    .select('rating')
    .eq('reviewee_id', profile?.id)

  const avgRating =
    reviews && reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : null

  const profileFields = [
    profile?.full_name, profile?.bio, profile?.avatar_url, profile?.location,
    profile?.portfolio_url, profile?.skills && profile?.skills.length > 0, profile?.hourly_rate,
  ]
  const profileCompleteness = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100)

  const { count: acceptedBidsCount } = await supabase!
    .from('bids')
    .select('*', { count: 'exact', head: true })
    .eq('bidder_id', profile?.id)
    .eq('status', 'accepted')

  const { count: contractsCount } = await supabase!
    .from('contracts')
    .select('*', { count: 'exact', head: true })
    .eq('seeker_id', profile?.id)

  const analyticsResult = await getSeekerAnalytics()
  const totalBids = activeAppsCount || 0
  const successRate = totalBids > 0
    ? Math.round(((acceptedBidsCount || 0) / totalBids) * 100) + '%'
    : '—'

  const firstName = profile?.full_name?.split(' ')[0] || profile?.username || 'Talent'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <DashboardClient
      greeting={greeting}
      firstName={firstName}
      activeAppsCount={activeAppsCount || 0}
      totalBids={totalBids}
      successRate={successRate}
      profileCompleteness={profileCompleteness}
      avgRating={avgRating}
      reviewsCount={reviews?.length || 0}
      savedJobsCount={savedJobsCount || 0}
      analyticsData={analyticsResult.data}
      hasSubscription={profile?.subscription_status === 'active'}
      hasCompletedProfile={profileCompleteness >= 80}
      hasFirstBid={totalBids > 0}
      hasContract={(contractsCount || 0) > 0}
    />
  )
}

// ─── Profile ─────────────────────────────────────────────────────────────────

async function ProfileSection() {
  const { profile, supabase } = await getAuthUserAs('jobseeker')

  const { count: totalBids } = await supabase!
    .from('bids').select('*', { count: 'exact', head: true }).eq('bidder_id', profile?.id)

  const { count: acceptedBids } = await supabase!
    .from('bids').select('*', { count: 'exact', head: true })
    .eq('bidder_id', profile?.id).eq('status', 'accepted')

  const { data: reviews } = await supabase!
    .from('reviews').select('rating').eq('reviewed_user_id', profile?.id)

  const avgRating =
    reviews && reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : null

  const successRate =
    (totalBids || 0) > 0
      ? Math.round(((acceptedBids || 0) / (totalBids || 1)) * 100) + '%'
      : '—'

  if (!profile) return <div>Loading...</div>

  return (
    <ProfileClient
      profile={profile}
      avgRating={avgRating}
      successRate={successRate}
      totalBids={totalBids || 0}
      acceptedBids={acceptedBids || 0}
    />
  )
}

// ─── Applications ────────────────────────────────────────────────────────────

async function ApplicationsSection() {
  const { profile, supabase } = await getAuthUserAs('jobseeker')
  const { data: bids } = await supabase!
    .from('bids')
    .select(`
      *,
      job:jobs!job_id (
        id, title, budget_min, budget_max, employer_id,
        employer:employer_id ( full_name, avatar_url )
      )
    `)
    .eq('bidder_id', profile?.id)
    .order('created_at', { ascending: false })
  return <ApplicationsClient bids={bids} />
}

// ─── Saved Jobs ───────────────────────────────────────────────────────────────

async function SavedSection() {
  const { profile, supabase } = await getAuthUserAs('jobseeker')
  const { data: savedJobs } = await supabase!
    .from('saved_items')
    .select(`
      *,
      job:jobs!job_id (
        id, title, description, budget_min, budget_max, employer_id, location, job_type,
        employer:employer_id ( full_name, avatar_url )
      )
    `)
    .eq('user_id', profile?.id)
  return <SavedJobsClient savedJobs={savedJobs} />
}

// ─── Offers ──────────────────────────────────────────────────────────────────

async function OffersSection() {
  const { user: currentUser, supabase } = await getAuthUser()

  const { data: invitationsData } = await supabase!
    .from('invitations')
    .select(`
      id, job_id, sender_id, recipient_id, title, message,
      proposed_budget, proposed_deadline, status, created_at, expires_at,
      sender:sender_id(id, full_name, avatar_url, company_name),
      recipient:recipient_id(id, full_name, avatar_url, email),
      job:job_id(id, title, description)
    `)
    .or(`sender_id.eq.${currentUser?.id},recipient_id.eq.${currentUser?.id}`)
    .order('created_at', { ascending: false })

  const invitations = invitationsData?.map(inv => ({
    ...inv,
    sender: inv.sender && Array.isArray(inv.sender) ? inv.sender[0] : inv.sender,
    recipient: inv.recipient && Array.isArray(inv.recipient) ? inv.recipient[0] : inv.recipient,
    job: inv.job && Array.isArray(inv.job) ? inv.job[0] : inv.job,
  }))

  const { data: offersData } = await supabase!
    .from('offers')
    .select(`
      id, job_id, from_user_id, to_user_id, type, amount, deadline, description,
      status, created_at, expires_at,
      from_user:from_user_id(id, full_name, avatar_url, email),
      to_user:to_user_id(id, full_name, avatar_url, email),
      job:job_id(id, title)
    `)
    .or(`from_user_id.eq.${currentUser?.id},to_user_id.eq.${currentUser?.id}`)
    .order('created_at', { ascending: false })

  const offers = offersData?.map(offer => ({
    ...offer,
    from_user: offer.from_user && Array.isArray(offer.from_user) ? offer.from_user[0] : offer.from_user,
    to_user: offer.to_user && Array.isArray(offer.to_user) ? offer.to_user[0] : offer.to_user,
    job: offer.job && Array.isArray(offer.job) ? offer.job[0] : offer.job,
  }))

  return (
    <OffersClient
      invitations={invitations || []}
      offers={offers || []}
      currentUserId={currentUser?.id || 0}
    />
  )
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
      userType={profile?.user_type || 'jobseeker'}
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

// ─── Skills ──────────────────────────────────────────────────────────────────

async function SkillsSection() {
  const supabase = await createClient()
  const { data: { user } } = await supabase!.auth.getUser()
  if (!user) return <div>Not authenticated</div>

  const { data: currentUser } = await supabase!
    .from('users').select('id, user_type').eq('auth_id', user.id).single()

  if (!currentUser) return <div>User not found</div>

  const { data: skills } = await supabase!
    .from('skills')
    .select('id, name, category, proficiency_level, endorsement_count, is_featured, verified, verified_by_user_id')
    .eq('user_id', currentUser.id)
    .order('is_featured', { ascending: false })
    .order('endorsement_count', { ascending: false })

  const { data: endorsementsData } = await supabase!
    .from('skill_endorsements')
    .select('id, skill_id, endorsed_by_user_id, endorsed_by_user:endorsed_by_user_id(id, full_name, avatar_url)')
    .in('skill_id', (skills || []).map(s => s.id))

  const endorsements = endorsementsData?.map(e => ({
    ...e,
    endorsed_by_user: e.endorsed_by_user && Array.isArray(e.endorsed_by_user) ? e.endorsed_by_user[0] : e.endorsed_by_user,
  }))

  const { data: categories } = await supabase!
    .from('skill_categories')
    .select('id, name, description')
    .is('parent_category_id', null)
    .order('name')

  return (
    <SkillsClient
      skills={skills || []}
      endorsements={endorsements || []}
      categories={categories || []}
      currentUserId={currentUser.id}
    />
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p1 = conv.participant_1 as any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p2 = conv.participant_2 as any
      const other = p1?.id === internalUser?.id ? p2 : p1

      return {
        id: conv.id,
        lastMessageAt: conv.last_message_at,
        other: {
          name: other?.full_name || other?.username || 'Unknown',
          avatar_url: other?.avatar_url,
          initials: (other?.full_name || other?.username || 'U').split(' ').map((w: string) => w[0]).join(''),
        },
        preview: lastMsg?.content || 'No messages yet',
        previewTime: lastMsg?.created_at || conv.last_message_at,
        isOwnLastMessage: lastMsg?.sender_id === internalUser?.id,
      }
    })
  )

  return <MessagesClient conversations={conversationsWithPreview} userType={internalUser?.user_type} />
}

// ─── Notifications ────────────────────────────────────────────────────────────

async function NotificationsSection() {
  const { profile, supabase } = await getAuthUserAs('jobseeker')

  const { data: notifications } = await supabase!
    .from('notifications')
    .select('*')
    .eq('user_id', profile?.id)
    .order('created_at', { ascending: false })

  return <NotificationsClient notifications={notifications} profileId={profile?.id || ''} />
}

// ─── Subscription ─────────────────────────────────────────────────────────────

async function SubscriptionSection() {
  const supabase = await createClient()
  const { data: { user } } = await supabase!.auth.getUser()
  if (!user) return <div>Not authenticated</div>

  const { data: profile } = await supabase!
    .from('users').select('user_type, stripe_customer_id').eq('auth_id', user.id).single()

  let activePlanName = ''
  if (profile?.stripe_customer_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const Stripe = (await import('stripe')).default
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
      const subs = await stripe.subscriptions.list({
        customer: profile.stripe_customer_id,
        status: 'active',
        limit: 1,
        expand: ['data.items.data.price.product'],
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sub = subs.data[0] as any
      if (sub) {
        const product = sub.items?.data?.[0]?.price?.product
        activePlanName = (typeof product === 'object' ? product?.name : '') || ''
      }
    } catch { /* Stripe not configured */ }
  }

  const hasActiveSub = activePlanName.length > 0
  const isElite = activePlanName.toLowerCase().includes('elite') || activePlanName.toLowerCase().includes('professional')

  const plans = [
    {
      name: 'Talent Starter', price: '0',
      description: 'Perfect for discovering the platform and making your first professional connections.',
      features: ['Basic CV Parsing', '5 Monthly Bids', 'Public Profile'],
      isCurrent: !hasActiveSub, color: 'stone-500', icon: 'rocket_launch', planId: null,
    },
    {
      name: 'Elite Professional', price: '19',
      description: 'The competitive edge for serious talent looking to dominate their market niche.',
      features: ['Unlimited AI Optimization', 'Priority Role Access', 'Profile Boost (2x Visibility)', 'Direct DM to Recruiters'],
      isCurrent: isElite, recommended: true, color: 'primary', icon: 'workspace_premium', planId: 'seeker_elite',
    },
  ]

  return <SubscriptionClient plans={plans} />
}
