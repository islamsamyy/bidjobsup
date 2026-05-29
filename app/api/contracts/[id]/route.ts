import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const contract = {
      id: id || 'contract-1',
      bid_id: 'bid-1',
      status: 'pending',
      created_at: new Date().toISOString(),
    }

    return Response.json(
      {
        ...contract,
        id: contract.id,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Get contract error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
