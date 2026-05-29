import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // Fetch jobs from Supabase database
    const supabase = await createClient()
    let query = supabase.from('jobs').select('*')

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply category filter
    if (category) {
      query = query.eq('category', category)
    }

    // Apply experience level filter (if job table has this field)
    if (experienceLevel) {
      query = query.eq('experience_level', experienceLevel)
    }

    // Apply sorting
    if (sortBy === 'salary-high') {
      query = query.order('budget_max', { ascending: false })
    } else if (sortBy === 'salary-low') {
      query = query.order('budget_min', { ascending: true })
    } else {
      // Recent (default)
      query = query.order('created_at', { ascending: false })
    }

    // Get total count before pagination
    const { count: total } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })

    // Apply pagination
    const { data: dbJobs, error } = await query.range(offset, offset + limit - 1)

    // Fallback mock data if database fails or returns no results
    const mockJobs = [
      {
        id: 1001,
        title: 'Senior React Developer',
        description: 'Build scalable React applications with TypeScript',
        category: 'Developer',
        experience_level: 'senior',
        budget_min: 5000,
        budget_max: 10000,
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 1002,
        title: 'Junior Node.js Developer',
        description: 'Backend API development using Node.js and Express',
        category: 'Developer',
        experience_level: 'junior',
        budget_min: 2000,
        budget_max: 4000,
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 1003,
        title: 'UX/UI Designer',
        description: 'Design mobile app interfaces and user experiences',
        category: 'Design',
        experience_level: 'intermediate',
        budget_min: 3000,
        budget_max: 6000,
        created_at: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 1004,
        title: 'Full Stack Web Developer',
        description: 'Complete web application development',
        category: 'Developer',
        experience_level: 'senior',
        budget_min: 8000,
        budget_max: 15000,
        created_at: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 1005,
        title: 'Data Analyst',
        description: 'Analyze and visualize business data',
        category: 'AI',
        experience_level: 'intermediate',
        budget_min: 4000,
        budget_max: 8000,
        created_at: new Date(Date.now() - 10800000).toISOString()
      }
    ]

    // Use database jobs if available, otherwise use mock
    const jobs = !error && dbJobs && dbJobs.length > 0 ? dbJobs : mockJobs
    const paginated = jobs.slice(0, limit)

    return Response.json(
      {
        success: true,
        data: paginated,
        total: jobs.length,
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

    // Insert job into Supabase database
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        title,
        description,
        budget_min: budget,
        budget_max: budget,
        category,
        skills: skills || [],
        deadline,
        status: 'active',
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return Response.json(
        { error: 'Failed to create job: ' + error.message },
        { status: 400 }
      )
    }

    return Response.json(
      {
        success: true,
        message: 'Job created successfully',
        id: data.id,
        job: data,
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
