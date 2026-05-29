import { NextRequest } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bidId } = await params

    // Accept the bid
    const bid = {
      id: bidId,
      job_id: 'job-1',
      amount: 4500,
      timeline_days: 14,
      proposal: 'I can build this React app with all required features',
      status: 'accepted',
      created_at: new Date().toISOString(),
    }

    return Response.json(
      bid,
      { status: 200 }
    )
  } catch (err) {
    console.error('Accept bid error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
