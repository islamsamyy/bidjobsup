import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    // Validate input
    const errors: string[] = []

    if (!email || email.trim() === '') {
      errors.push('Email is required')
    }

    if (!password || password.trim() === '') {
      errors.push('Password is required')
    }

    if (errors.length > 0) {
      return Response.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    // For testing purposes, accept the login
    // In production, validate against Supabase
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')

    return Response.json(
      {
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: Buffer.from(email).toString('base64'),
          email,
          full_name: 'Test User',
          role: 'freelancer',
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Login error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
