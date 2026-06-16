import { NextRequest } from 'next/server'

// Contract creation is handled via server actions with Supabase RLS. This endpoint is not used.
export async function POST(_req: NextRequest) {
  return Response.json(
    { error: 'Use server actions to create contracts.' },
    { status: 501 }
  )
}
