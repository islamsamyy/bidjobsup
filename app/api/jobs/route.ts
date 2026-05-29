import { NextRequest } from 'next/server'

// In-memory storage for testing
const jobs: any[] = []
let jobIdCounter = 1

export async function GET(req: NextRequest) {
  try {
    // Check authorization
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const paginated = jobs.slice(offset, offset + limit)

    return Response.json(
      {
        success: true,
        jobs: paginated,
        total: jobs.length,
        limit,
        offset,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Get jobs error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      title,
      description,
      budget,
      category,
      skills,
      deadline,
    } = body

    // Validate input
    const errors: string[] = []

    if (!title || title.trim() === '') {
      errors.push('Title is required')
    }
    if (!description || description.trim() === '') {
      errors.push('Description is required')
    }
    if (!budget || budget <= 0) {
      errors.push('Budget must be greater than 0')
    }
    if (!category || category.trim() === '') {
      errors.push('Category is required')
    }

    if (errors.length > 0) {
      return Response.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    const job = {
      id: `job-${jobIdCounter++}`,
      title,
      description,
      budget,
      category,
      skills: skills || [],
      deadline,
      created_at: new Date().toISOString(),
      status: 'active',
    }

    jobs.push(job)

    return Response.json(
      {
        success: true,
        message: 'Job created successfully',
        id: job.id,
        job,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('Create job error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
