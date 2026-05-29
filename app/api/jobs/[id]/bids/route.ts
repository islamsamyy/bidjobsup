import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params

    // Return mock bids for demo
    const bids = [
      {
        id: 'bid-1',
        job_id: jobId,
        amount: 4500,
        timeline_days: 14,
        proposal: 'I can build this',
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    ]

    return Response.json(
      {
        success: true,
        bids,
        count: bids.length,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Get job bids error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
