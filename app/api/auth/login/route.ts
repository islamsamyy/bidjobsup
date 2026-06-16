import { NextRequest } from 'next/server'

// Auth is handled via Supabase directly. This endpoint is not used.
export async function POST(_req: NextRequest) {
  return Response.json(
    { error: 'Use Supabase authentication directly.' },
    { status: 501 }
  )
}
