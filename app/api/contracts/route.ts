import { NextRequest } from 'next/server'

const contracts: any[] = []
let contractIdCounter = 1

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { bid_id } = body

    if (!bid_id || bid_id.trim() === '') {
      return Response.json(
        { error: 'Bid ID is required' },
        { status: 400 }
      )
    }

    const contract = {
      id: `contract-${contractIdCounter++}`,
      bid_id,
      status: 'pending',
      created_at: new Date().toISOString(),
    }

    contracts.push(contract)

    return Response.json(
      {
        success: true,
        message: 'Contract created successfully',
        id: contract.id,
        contract,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('Create contract error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
