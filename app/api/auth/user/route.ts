import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.slice(7)

    // Decode the mock token (format: base64(email:timestamp))
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8')
      const [email] = decoded.split(':')

      if (!email) {
        return Response.json(
          { error: 'Invalid token' },
          { status: 401 }
        )
      }

      return Response.json(
        {
          id: Buffer.from(email).toString('base64'),
          email,
          full_name: 'Test User',
          role: 'freelancer',
        },
        { status: 200 }
      )
    } catch {
      return Response.json(
        { error: 'Invalid token format' },
        { status: 401 }
      )
    }
  } catch (err) {
    console.error('Get user error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
