import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

const PRICE_IDS: Record<string, string> = {
  // Employer tiers
  employer_pro: process.env.STRIPE_PRICE_EMPLOYER_PRO!,
  employer_visionary: process.env.STRIPE_PRICE_EMPLOYER_VISIONARY!,
  employer_nexus: process.env.STRIPE_PRICE_EMPLOYER_NEXUS!,
  // Seeker plans
  seeker_elite: process.env.STRIPE_PRICE_SEEKER_ELITE!,
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { planId } = await req.json()
    const priceId = PRICE_IDS[planId]

    if (!priceId) {
      return Response.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    // Fetch or create Stripe customer
    const { data: profile } = await supabase
      .from('users')
      .select('full_name, stripe_customer_id')
      .eq('auth_id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        name: profile?.full_name || user.email!,
        metadata: { supabase_uid: user.id },
      })
      customerId = customer.id

      // Save customer ID to database
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('auth_id', user.id)
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL!

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/dashboard?checkout=cancelled`,
      subscription_data: {
        metadata: { supabase_uid: user.id, planId },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    })

    return Response.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err)
    return Response.json({ error: 'Failed to initialize checkout protocol' }, { status: 500 })
  }
}
