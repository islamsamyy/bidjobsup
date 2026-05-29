import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, full_name, role } = body

    // Validate input
    const errors: string[] = []

    if (!email || email.trim() === '') {
      errors.push('Email is required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email format')
    } else if (email.length > 255) {
      errors.push('Email too long (max 255 chars)')
    }

    if (!password || password.trim() === '') {
      errors.push('Password is required')
    } else if (password.length < 8) {
      errors.push('Password must be at least 8 characters')
    } else if (password.length > 128) {
      errors.push('Password too long (max 128 chars)')
    }

    if (!full_name || full_name.trim() === '') {
      errors.push('Full name is required')
    } else if (full_name.length > 255) {
      errors.push('Full name too long (max 255 chars)')
    }

    if (!role || (role !== 'employer' && role !== 'freelancer')) {
      errors.push('Role must be either "employer" or "freelancer"')
    }

    if (errors.length > 0) {
      return Response.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    // Generate a token
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')

    return Response.json(
      {
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: Buffer.from(email).toString('base64'),
          email,
          full_name,
          role,
        },
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('Registration error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
