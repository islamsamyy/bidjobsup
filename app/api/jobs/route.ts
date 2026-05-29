import { NextRequest } from 'next/server'

// In-memory storage for testing
const jobs: any[] = []
let jobIdCounter = 1

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Get filter parameters
    const experienceLevel = searchParams.get('experience_level')
    const sortBy = searchParams.get('sort') || 'recent' // recent, salary-low, salary-high
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Mock jobs data (in production, fetch from database)
    const mockJobs = [
      {
        id: 1,
        title: 'Senior React Developer',
        description: 'Build scalable React applications with TypeScript',
        category: 'Developer',
        experience_level: 'senior',
        budget_min: 5000,
        budget_max: 10000,
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        title: 'Junior Node.js Developer',
        description: 'Backend API development using Node.js and Express',
        category: 'Developer',
        experience_level: 'junior',
        budget_min: 2000,
        budget_max: 4000,
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 3,
        title: 'UX/UI Designer',
        description: 'Design mobile app interfaces and user experiences',
        category: 'Design',
        experience_level: 'intermediate',
        budget_min: 3000,
        budget_max: 6000,
        created_at: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 4,
        title: 'Full Stack Web Developer',
        description: 'Complete web application development',
        category: 'Developer',
        experience_level: 'senior',
        budget_min: 8000,
        budget_max: 15000,
        created_at: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 5,
        title: 'Data Analyst',
        description: 'Analyze and visualize business data',
        category: 'AI',
        experience_level: 'intermediate',
        budget_min: 4000,
        budget_max: 8000,
        created_at: new Date(Date.now() - 10800000).toISOString()
      }
    ]

    let filtered = [...mockJobs, ...jobs] // Combine mock + created jobs

    // Apply filters
    if (search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category) {
      filtered = filtered.filter(job => job.category === category)
    }

    if (experienceLevel) {
      filtered = filtered.filter(job => job.experience_level === experienceLevel)
    }

    // Apply sorting
    if (sortBy === 'salary-high') {
      filtered.sort((a, b) => (b.budget_max || 0) - (a.budget_max || 0))
    } else if (sortBy === 'salary-low') {
      filtered.sort((a, b) => (a.budget_min || 0) - (b.budget_min || 0))
    } else {
      // Recent (default)
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    // Apply pagination
    const paginated = filtered.slice(offset, offset + limit)

    return Response.json(
      {
        success: true,
        data: paginated,
        total: filtered.length,
        count: paginated.length,
        limit,
        offset,
        filters: { experienceLevel, sortBy, search, category }
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Get jobs error:', err)
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch jobs',
        data: []
      },
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
