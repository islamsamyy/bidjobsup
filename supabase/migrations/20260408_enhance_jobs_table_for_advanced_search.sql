-- Enhance jobs table with fields needed for advanced filtering and search
-- Supports job_type, experience_level, and required_skills filtering

ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS job_type varchar(50) DEFAULT 'project' CHECK (job_type IN ('full-time', 'part-time', 'contract', 'project')),
ADD COLUMN IF NOT EXISTS experience_level varchar(50) DEFAULT 'mid' CHECK (experience_level IN ('entry', 'mid', 'senior')),
ADD COLUMN IF NOT EXISTS required_skills jsonb DEFAULT '[]'::jsonb;

-- Create indexes for better query performance on filtered searches
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON public.jobs (job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON public.jobs (experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_status_category_budget ON public.jobs (status, category, budget_min, budget_max);

-- Add comments
COMMENT ON COLUMN public.jobs.job_type IS 'Type of job: full-time, part-time, contract, or project';
COMMENT ON COLUMN public.jobs.experience_level IS 'Required experience level: entry, mid, or senior';
COMMENT ON COLUMN public.jobs.required_skills IS 'Array of required skills, stored as JSON for flexible querying';
