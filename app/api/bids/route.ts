import { NextRequest } from 'next/server'

const bids: any[] = []
let bidIdCounter = 1

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { job_id, amount, timeline_days, proposal } = body

    // Validate input
    const errors: string[] = []

    if (!job_id || job_id.trim() === '') {
      errors.push('Job ID is required')
    }
    if (!amount || amount <= 0) {
      errors.push('Amount must be greater than 0')
    }
    if (!timeline_days || timeline_days <= 0) {
      errors.push('Timeline must be greater than 0')
    }

    if (errors.length > 0) {
      return Response.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    const bid = {
      id: `bid-${bidIdCounter++}`,
      job_id,
      amount,
      timeline_days,
      proposal,
      status: 'pending',
      created_at: new Date().toISOString(),
    }

    bids.push(bid)

    return Response.json(
      {
        success: true,
        message: 'Bid submitted successfully',
        id: bid.id,
        bid,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('Create bid error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
