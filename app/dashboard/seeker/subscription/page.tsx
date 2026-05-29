import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SubscriptionClient } from './SubscriptionClient'

export default async function SeekerSubscriptionPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase!.auth.getUser()
  if (authError || !user) {
    redirect('/sign-in')
  }

  const { data: profile } = await supabase!
    .from('users')
    .select('user_type, stripe_customer_id')
    .eq('auth_id', user?.id)
    .single()

  if (profile?.user_type !== 'jobseeker' && profile?.user_type !== 'both') {
    redirect('/dashboard/employer')
  }

  let activePlanName = ''
  if (profile?.stripe_customer_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const Stripe = (await import('stripe')).default
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
      const subs = await stripe.subscriptions.list({
        customer: profile?.stripe_customer_id,
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
    } catch {
      // Stripe not configured or error — treat as free tier
    }
  }

  const hasActiveSub = activePlanName.length > 0
  const isElite = activePlanName.toLowerCase().includes('elite') || activePlanName.toLowerCase().includes('professional')

  const plans = [
    {
      name: 'Talent Starter',
      price: '0',
      description: 'Perfect for discovering the platform and making your first professional connections.',
      features: ['Basic CV Parsing', '5 Monthly Bids', 'Public Profile'],
      isCurrent: !hasActiveSub,
      color: 'stone-500',
      icon: 'rocket_launch',
      planId: null,
    },
    {
      name: 'Elite Professional',
      price: '19',
      description: 'The competitive edge for serious talent looking to dominate their market niche.',
      features: ['Unlimited AI Optimization', 'Priority Role Access', 'Profile Boost (2x Visibility)', 'Direct DM to Recruiters'],
      isCurrent: isElite,
      recommended: true,
      color: 'primary',
      icon: 'workspace_premium',
      planId: 'seeker_elite',
    },
    {
      name: 'Visionary Enterprise',
      price: 'Custom',
      description: 'Bespoke solutions for executive search and institutional talent procurement.',
      features: ['Dedicated Talent Manager', 'Custom API Integration', 'Bulk AI Processing'],
      isCurrent: hasActiveSub && !isElite,
      color: 'secondary',
      icon: 'corporate_fare',
      planId: null,
    },
  ]

  return <SubscriptionClient plans={plans} />
}