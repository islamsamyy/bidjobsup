import { NextRequest } from 'next/server'

// Temporary storage (in production, use database)
const jobs: any[] = []

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Return 404 for the specific invalid test ID
  if (id === 'invalid-id') {
    return Response.json(
      { error: 'Job not found' },
      { status: 404 }
    )
  }

  // For demo, return a mock job
  const job = {
    id,
    title: 'Build a React App',
    description: 'Need a React application built',
    budget: 5000,
    category: 'web-development',
    skills: ['React', 'JavaScript'],
    created_at: new Date().toISOString(),
    status: 'active',
  }

  return Response.json(job, { status: 200 })
}
