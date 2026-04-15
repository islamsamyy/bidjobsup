import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { getURL } from '@/lib/utils/getURL'
import { NextRequest } from 'next/server'

const PRICE_IDS: Record<string, string | undefined> = {
  employer_pro: process.env.STRIPE_PRICE_EMPLOYER_PRO,
  employer_visionary: process.env.STRIPE_PRICE_EMPLOYER_VISIONARY,
  employer_nexus: process.env.STRIPE_PRICE_EMPLOYER_NEXUS,
  seeker_elite: process.env.STRIPE_PRICE_SEEKER_ELITE,
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: 'Stripe is not configured yet.' }, { status: 503 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-03-31.basil',
  })

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

      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('auth_id', user.id)
    }

    const baseUrl = getURL('', req.headers.get('origin') || undefined)

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: getURL('/dashboard?checkout=success', req.headers.get('origin') || undefined),
      cancel_url: getURL('/dashboard?checkout=cancelled', req.headers.get('origin') || undefined),
      metadata: { supabase_uid: user.id, planId },
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
