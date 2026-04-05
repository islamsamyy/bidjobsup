import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

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

    const { data: profile } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('auth_id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return Response.json({ error: 'No active subscription found' }, { status: 400 })
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL!

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${origin}/dashboard/employer/billing`,
    })

    return Response.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe Portal Error:', err)
    return Response.json({ error: 'Failed to open billing portal' }, { status: 500 })
  }
}
