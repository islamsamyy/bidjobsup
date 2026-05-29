import { createClient } from '@/lib/supabase/server'
import JobsBrowseClient from './JobsBrowseClient'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function BrowseJobsPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const params = await searchParams;

  const query = params.q || '';
  const location = params.l || '';
  const category = params.c || '';
  const budgetMin = params.budget_min ? Number(params.budget_min) : null;
  const budgetMax = params.budget_max ? Number(params.budget_max) : null;
  const jobType = params.job_type || '';
  const experienceLevel = params.experience_level || '';
  const sort = params.sort || 'newest';

  // 1. Fetch Real Industry Counts
  const { data: categoryStats } = await supabase
    .from('jobs')
    .select('category')
    .eq('status', 'open')

  const counts: Record<string, number> = {}
  categoryStats?.forEach(j => {
    const cat = j.category || 'Other'
    counts[cat] = (counts[cat] || 0) + 1
  })

  // 2. Fetch Jobs with advanced filtering
  let jobsQuery = supabase
    .from('jobs')
    .select(`
      *,
      employer:employer_id (
        full_name,
        company_name,
        avatar_url,
        location
      )
    `)
    .eq('status', 'open');

  // Apply text filters
  if (query) {
    jobsQuery = jobsQuery.ilike('title', `%${query}%`);
  }
  if (location) {
    jobsQuery = jobsQuery.ilike('location', `%${location}%`);
  }
  if (category) {
    jobsQuery = jobsQuery.eq('category', category);
  }

  // Apply numeric filters for budget range
  if (budgetMin !== null) {
    jobsQuery = jobsQuery.gte('budget_max', budgetMin);
  }
  if (budgetMax !== null) {
    jobsQuery = jobsQuery.lte('budget_min', budgetMax);
  }

  // Apply job type filter
  if (jobType) {
    jobsQuery = jobsQuery.eq('job_type', jobType);
  }

  // Apply experience level filter
  if (experienceLevel) {
    jobsQuery = jobsQuery.eq('experience_level', experienceLevel);
  }

  // Apply sorting
  if (sort === 'salary_high') {
    jobsQuery = jobsQuery.order('budget_max', { ascending: false });
  } else if (sort === 'salary_low') {
    jobsQuery = jobsQuery.order('budget_min', { ascending: true });
  } else {
    jobsQuery = jobsQuery.order('created_at', { ascending: false });
  }

  const { data: jobs, error } = await jobsQuery.limit(50);

  if (error) {
    throw new Error(`Database Error: ${error.message} (Code: ${error.code})`);
  }

  const industries = [
    { 
      name: "Creative Architecture", 
      icon: "architecture", 
      count: counts['Creative Architecture'] || (counts['Design'] || 0), 
      img: "https://images.unsplash.com/photo-1487958444663-51ce619699d8?auto=format&fit=crop&q=80&w=2070" 
    },
    { 
      name: "AI Engineering", 
      icon: "psychology", 
      count: counts['AI Engineering'] || 0, 
      img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070" 
    },
    { 
      name: "XR Development", 
      icon: "vrpano", 
      count: counts['XR Development'] || 0, 
      img: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&q=80&w=2070" 
    }
  ]

  return (
    <JobsBrowseClient 
      query={query}
      location={location}
      category={category}
      budgetMin={budgetMin}
      budgetMax={budgetMax}
      jobType={jobType}
      experienceLevel={experienceLevel}
      sort={sort}
      industries={industries}
      jobs={jobs}
    />
  )
}