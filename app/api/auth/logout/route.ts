import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    // In a real implementation, you would invalidate the token here
    // For now, just return success

    return Response.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Logout error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
