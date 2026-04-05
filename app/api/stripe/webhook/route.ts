import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

const PLAN_NAMES: Record<string, string> = {
  [process.env.STRIPE_PRICE_EMPLOYER_PRO!]: 'Pro Tier',
  [process.env.STRIPE_PRICE_EMPLOYER_VISIONARY!]: 'Visionary Enterprise',
  [process.env.STRIPE_PRICE_EMPLOYER_NEXUS!]: 'Nexus Supreme',
  [process.env.STRIPE_PRICE_SEEKER_ELITE!]: 'Elite Professional',
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const supabaseUid = session.subscription_data?.metadata?.supabase_uid
      const planId = session.subscription_data?.metadata?.planId

      if (!supabaseUid) break

      const subscriptionId = session.subscription as string
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const priceId = subscription.items.data[0]?.price.id
      const planName = PLAN_NAMES[priceId] || 'Unknown Plan'

      await supabase
        .from('users')
        .update({
          subscription_status: 'active',
          subscription_plan: planName,
          stripe_subscription_id: subscriptionId,
        })
        .eq('auth_id', supabaseUid)

      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const supabaseUid = subscription.metadata?.supabase_uid

      if (!supabaseUid) break

      const priceId = subscription.items.data[0]?.price.id
      const planName = PLAN_NAMES[priceId] || 'Unknown Plan'
      const status = subscription.status

      await supabase
        .from('users')
        .update({
          subscription_status: status,
          subscription_plan: status === 'active' ? planName : null,
          stripe_subscription_id: subscription.id,
        })
        .eq('auth_id', supabaseUid)

      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const supabaseUid = subscription.metadata?.supabase_uid

      if (!supabaseUid) break

      await supabase
        .from('users')
        .update({
          subscription_status: 'inactive',
          subscription_plan: null,
          stripe_subscription_id: null,
        })
        .eq('auth_id', supabaseUid)

      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
      const supabaseUid = customer.metadata?.supabase_uid

      if (!supabaseUid) break

      await supabase
        .from('users')
        .update({ subscription_status: 'past_due' })
        .eq('auth_id', supabaseUid)

      break
    }
  }

  return Response.json({ received: true })
}
