import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { InteractiveHomePage } from "@/components/features/InteractiveHomePage";
import { HomePageClient } from "@/components/features/HomePageClient";

export const metadata: Metadata = {
  title: "BidJobs — Where Elite Talent Meets Opportunity",
  description:
    "A premium job marketplace connecting employers with world-class freelancers. Post jobs, submit bids, and build your professional reputation in the new economy.",
  openGraph: {
    title: "BidJobs — Where Elite Talent Meets Opportunity",
    description:
      "A premium job marketplace connecting employers with world-class freelancers.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "BidJobs — Where Elite Talent Meets Opportunity",
    description:
      "A premium job marketplace connecting employers with world-class freelancers.",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export default async function LandingPage() {
  const supabase = await createClient();

  // Fetch stats
  const { count: jobsCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'open');

  const { count: companiesCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('user_type', 'employer');

  const { count: seekersCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('user_type', 'jobseeker');

  const { count: contractsCount } = await supabase
    .from('contracts')
    .select('*', { count: 'exact', head: true });

  // Fetch featured jobs
  const { data: featuredJobs } = await supabase
    .from('jobs')
    .select(`*, employer:employer_id (full_name, company_name, avatar_url, location)`)
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch featured talent
  const { data: featuredTalent } = await supabase
    .from('users')
    .select(`id, full_name, avatar_url, bio, skills, location, experience_level, user_type`)
    .eq('user_type', 'jobseeker')
    .order('created_at', { ascending: false })
    .limit(6);

  // Fetch community posts
  const { data: communityPosts } = await supabase
    .from('community_posts')
    .select(`*, author:user_id (full_name, avatar_url)`)
    .order('created_at', { ascending: false })
    .limit(3);

  async function handleSearch(formData: FormData) {
    'use server'
    const query = formData.get('query');
    const location = formData.get('location');
    redirect(`/jobs/browse?q=${query || ''}&l=${location || ''}`);
  }

  return (
    <>
      <InteractiveHomePage handleSearch={handleSearch} />
      <HomePageClient
        jobsCount={jobsCount || 0}
        companiesCount={companiesCount || 0}
        seekersCount={seekersCount || 0}
        contractsCount={contractsCount || 0}
        featuredJobs={featuredJobs}
        featuredTalent={featuredTalent}
        communityPosts={communityPosts}
      />
    </>
  );
}
