import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Return mock bid for demo
    const bid = {
      id,
      job_id: 'job-1',
      amount: 4500,
      timeline_days: 14,
      proposal: 'I can build this React app with all required features',
      status: 'pending',
      created_at: new Date().toISOString(),
    }

    return Response.json(bid, { status: 200 })
  } catch (err) {
    console.error('Get bid error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
