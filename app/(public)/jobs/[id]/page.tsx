import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ApplyForm } from "@/components/jobs/ApplyForm";
import SaveJobButton from "@/components/jobs/SaveJobButton";

interface JobPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const supabase = await createClient();
  const { id } = await params;
  const { data: job } = await supabase
    .from("jobs")
    .select("title, description, budget_min, budget_max, location")
    .eq("id", id)
    .single();

  if (!job) return { title: "Job Not Found | BidJobs" };

  const description = `${job.description?.slice(0, 150) ?? ""}… Budget: $${job.budget_min}–$${job.budget_max}. ${job.location ?? ""}`.trim();

  return {
    title: `${job.title} | BidJobs`,
    description,
    openGraph: {
      title: `${job.title} | BidJobs`,
      description,
      type: "website",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/${id}`,
    },
  };
}

export default async function Page({ params }: JobPageProps) {
  const supabase = await createClient();

  // In Next.js 15+, params is a Promise
  const { id } = await params;

  // Fetch job and employer details
  const { data: job, error } = await supabase
    .from("jobs")
    .select(`
      *,
      employer:employer_id (
        id,
        full_name,
        avatar_url,
        bio,
        location,
        company_name,
        industry
      ),
      bids_count:bids(count)
    `)
    .eq("id", id)
    .single();

  if (error || !job) {
    notFound();
  }

  // Get current user profile for save status and role check
  const { data: { user } } = await supabase.auth.getUser();
  let userProfile = null;
  let isSaved = false;

  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('id, user_type')
      .eq('auth_id', user.id)
      .single();
    
    userProfile = profile;

    if (profile) {
      const { data: savedItem } = await supabase
        .from('saved_items')
        .select('id')
        .eq('user_id', profile.id)
        .eq('job_id', job.id)
        .single();
      
      isSaved = !!savedItem;
    }
  }

  // Get similar jobs
  const { data: similarJobs } = await supabase
    .from("jobs")
    .select(`
      id,
      title,
      budget_min,
      budget_max,
      employer:employer_id (
        full_name,
        avatar_url,
        location
      )
    `)
    .eq('status', 'open')
    .neq("id", id)
    .limit(3);

  const employer = job.employer;
  const companyName = employer?.company_name || employer?.full_name || "Confidential Company";
  const location = employer?.location || "Remote";
  const budget = job.budget_min !== null && job.budget_max !== null
    ? `$${Number(job.budget_min).toLocaleString()} – $${Number(job.budget_max).toLocaleString()}`
    : (job.budget_min !== null ? `$${Number(job.budget_min).toLocaleString()}+` : "Competitive Salary");

  const isOwner = userProfile?.id === job.employer_id;
  const canApply = userProfile?.user_type === 'jobseeker' || userProfile?.user_type === 'both' || !user;

  return (
    <div className="bg-[#100d10] text-[#faf1f5] font-body selection:bg-[#caa2f7]/30 selection:text-[#caa2f7]">
      <main className="pb-20">
        {/* Job Header Hero Section */}
        <section className="relative w-full px-8 py-16 mb-12 bg-gradient-to-br from-[#caa2f7]/5 to-transparent overflow-hidden">
          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8 relative z-10">
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#1c181c] rounded-xl flex items-center justify-center p-2 shadow-xl border border-[#292428]/30">
                  {employer?.avatar_url ? (
                    <img alt={companyName} className="w-full h-full object-contain" src={employer.avatar_url} />
                  ) : (
                   <span className="material-symbols-outlined text-[#caa2f7] text-3xl">corporate_fare</span>
                  )}
                </div>
                <span className="text-[#caa2f7] font-body uppercase tracking-widest text-sm font-bold">
                  {companyName} • {location}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-heading font-bold leading-tight tracking-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-[#b0a9ad] font-medium">
                <div className="flex items-center gap-2 bg-[#151215] px-4 py-2 rounded-full border border-[#4b474a]/15">
                  <span className="material-symbols-outlined text-[#caa2f7] text-xl">payments</span>
                  <span>{budget}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#151215] px-4 py-2 rounded-full border border-[#4b474a]/15">
                  <span className="material-symbols-outlined text-[#caa2f7] text-xl">work_history</span>
                  <span className="capitalize">{job.budget_type === 'hourly' ? 'Contract' : 'Full-time'}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#151215] px-4 py-2 rounded-full border border-[#4b474a]/15">
                  <span className="material-symbols-outlined text-[#caa2f7] text-xl">location_on</span>
                  <span>{location}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {isOwner ? (
                <Link 
                  href={`/dashboard/employer/listings/${job.id}/edit`}
                  className="bg-[#292428] text-[#faf1f5] font-semibold px-8 py-4 rounded-xl border border-[#4b474a]/20 hover:bg-[#2f2b2f] transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">edit</span>
                  Edit Job
                </Link>
              ) : (
                <>
                  <SaveJobButton jobId={job.id} isInitiallySaved={isSaved} />
                  <a className="bg-gradient-to-br from-[#caa2f7] to-[#b690e3] text-[#431f6b] font-bold px-12 py-4 rounded-xl shadow-lg shadow-[#caa2f7]/20 hover:scale-[1.02] active:scale-95 transition-all text-center" href="#apply-section">Apply Now</a>
                </>
              )}
            </div>
          </div>
          {/* Decorative Background Watermark */}
          <div className="absolute -right-20 -top-20 opacity-[0.03] pointer-events-none">
            <span className="material-symbols-outlined text-[40rem]">architecture</span>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Job Details */}
          <div className="lg:col-span-8 space-y-16">
            <section className="space-y-8">
              <h2 className="text-3xl font-heading font-bold text-[#faf1f5]">The Opportunity</h2>
              <p className="text-lg text-[#b0a9ad] leading-relaxed font-light whitespace-pre-wrap">
                {job.description}
              </p>
              
              {job.category && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="bg-[#151215] p-8 rounded-xl border-l-4 border-[#caa2f7] backdrop-blur-sm">
                    <h3 className="text-xl font-heading font-bold mb-4">Role Domain</h3>
                    <p className="text-[#b0a9ad] leading-relaxed">Focusing on high-impact solutions within the {job.category} sector.</p>
                  </div>
                  <div className="bg-[#151215] p-8 rounded-xl border-l-4 border-[#eab3fa] backdrop-blur-sm">
                    <h3 className="text-xl font-heading font-bold mb-4">Strategic Impact</h3>
                    <p className="text-[#b0a9ad] leading-relaxed">Directly contributing to the development of next-generation digital ecosystems.</p>
                  </div>
                </div>
              )}
            </section>

            {job.skills_required && (Array.isArray(job.skills_required) ? job.skills_required : [job.skills_required]).length > 0 && (
              <section className="space-y-6">
                <h2 className="text-3xl font-heading font-bold text-[#faf1f5]">Core Expertise</h2>
                <div className="flex flex-wrap gap-3">
                  {(Array.isArray(job.skills_required) ? job.skills_required : typeof job.skills_required === 'string' ? job.skills_required.split(',') : []).map((skill: string) => (
                    <span key={skill} className="px-4 py-2 bg-[#292428] text-[#caa2f7] rounded-lg border border-[#caa2f7]/20 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Elite Benefits */}
            <section className="space-y-8">
              <h2 className="text-3xl font-heading font-bold text-[#faf1f5]">Elite Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1c181c] p-6 rounded-xl hover:bg-[#2f2b2f] transition-colors border border-[#292428]/50">
                  <span className="material-symbols-outlined text-[#ff93aa] text-4xl mb-4">health_and_safety</span>
                  <h4 className="font-bold mb-2">Premium Healthcare</h4>
                  <p className="text-sm text-[#b0a9ad]">World-class coverage for you and your dependents.</p>
                </div>
                <div className="bg-[#1c181c] p-6 rounded-xl hover:bg-[#2f2b2f] transition-colors border border-[#292428]/50">
                  <span className="material-symbols-outlined text-[#ff93aa] text-4xl mb-4">flight_takeoff</span>
                  <h4 className="font-bold mb-2">Relocation Support</h4>
                  <p className="text-sm text-[#b0a9ad]">Full logistical support for smooth transitions.</p>
                </div>
                <div className="bg-[#1c181c] p-6 rounded-xl hover:bg-[#2f2b2f] transition-colors border border-[#292428]/50">
                  <span className="material-symbols-outlined text-[#ff93aa] text-4xl mb-4">school</span>
                  <h4 className="font-bold mb-2">Learning Fund</h4>
                  <p className="text-sm text-[#b0a9ad]">Generous annual budget for workshops and growth.</p>
                </div>
              </div>
            </section>

            {/* Apply Form Section */}
            <section className="pt-12 border-t border-[#4b474a]/20" id="apply-section">
              {isOwner ? (
                <div className="p-12 bg-[#1c181c] rounded-2xl border border-dashed border-[#caa2f7]/30 text-center">
                  <span className="material-symbols-outlined text-5xl text-[#caa2f7]/50 mb-4">analytics</span>
                  <h3 className="text-2xl font-heading font-bold mb-2">This is your listing</h3>
                  <p className="text-[#b0a9ad] mb-8 text-lg">You can view applications and manage this job from your employer dashboard.</p>
                  <Link href={`/dashboard/employer/listings/${job.id}`} className="inline-block bg-[#caa2f7] text-[#431f6b] font-bold px-10 py-4 rounded-xl transition-transform hover:scale-105">
                    View Applications ({job.bids_count?.[0]?.count || 0})
                  </Link>
                </div>
              ) : !canApply ? (
                <div className="p-12 bg-[#1c181c] rounded-2xl border border-[#ff93aa]/20 text-center">
                  <span className="material-symbols-outlined text-5xl text-[#ff93aa]/50 mb-4">error</span>
                  <h3 className="text-2xl font-heading font-bold mb-2">Employer Account detected</h3>
                  <p className="text-[#b0a9ad] text-lg">Only registered Seekers can apply for roles. Please use a seeker account to transmit proposals.</p>
                </div>
              ) : (
                <ApplyForm 
                  jobId={job.id.toString()} 
                  budgetMin={job.budget_min ?? undefined} 
                  budgetMax={job.budget_max ?? undefined} 
                />
              )}
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Company Card */}
            <div className="bg-[#1c181c] p-8 rounded-xl space-y-6 border border-[#292428]/30">
              <h3 className="text-xl font-heading font-bold text-[#faf1f5]">Company Info</h3>
              <div className="space-y-4">
                <div className="w-full h-40 bg-[#151215] rounded-lg flex items-center justify-center p-4">
                  {employer?.avatar_url ? (
                    <img className="max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-700" alt={companyName} src={employer.avatar_url} />
                  ) : (
                    <span className="material-symbols-outlined text-6xl text-[#caa2f7]/20">business</span>
                  )}
                </div>
                <p className="text-sm text-[#b0a9ad] leading-relaxed">
                  {employer?.bio || `${companyName} is leading the way in innovation and excellence within the ${employer?.industry || 'tech'} sector.`}
                </p>
              </div>
              <div className="pt-4 border-t border-[#4b474a]/10 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#b0a9ad]">Status</span>
                  <span className="bg-[#613471] text-[#f1bfff] px-3 py-1 rounded-full text-xs font-bold">
                    {employer?.verified ? "Elite Partner" : "New Member"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#b0a9ad]">Industry</span>
                  <span className="text-[#faf1f5] font-medium">{employer?.industry || "Technology"}</span>
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            {similarJobs && similarJobs.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-heading font-bold text-[#faf1f5]">Similar Elite Roles</h3>
                <div className="space-y-4">
                  {similarJobs.map((simJob: any) => (
                    <Link 
                      key={simJob.id}
                      href={`/jobs/${simJob.id}`}
                      className="block bg-[#151215] p-6 rounded-xl hover:bg-[#2f2b2f] transition-all cursor-pointer group border border-[#292428]/30"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 bg-[#1c181c] rounded-lg flex items-center justify-center p-1.5 border border-[#292428]/30">
                          {simJob.employer?.avatar_url ? (
                            <img alt="Company" className="w-full h-full object-contain" src={simJob.employer.avatar_url} />
                          ) : (
                            <span className="material-symbols-outlined text-[#caa2f7] text-xl">business</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#faf1f5] group-hover:text-[#caa2f7] transition-colors line-clamp-1">{simJob.title}</h4>
                          <p className="text-xs text-[#b0a9ad] line-clamp-1">
                            {simJob.employer?.company_name || simJob.employer?.full_name || 'Quantum Corp'} • {simJob.employer?.location || "Remote"}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#caa2f7]">
                          {simJob.budget_min ? `$${Number(simJob.budget_min).toLocaleString()}+` : "Elite Rate"}
                        </span>
                        <span className="material-symbols-outlined text-sm text-[#b0a9ad]">arrow_forward_ios</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Ad/CTA */}
            <div className="bg-gradient-to-br from-[#613471]/40 to-[#1c181c] p-8 rounded-xl relative overflow-hidden group border border-[#caa2f7]/10">
              <div className="relative z-10">
                <h4 className="text-lg font-heading font-bold text-[#f1bfff] mb-2">Refine Your Profile</h4>
                <p className="text-sm text-[#f1bfff]/80 mb-6">Let our AI match your skills with elite hiring criteria.</p>
                <Link href="/join" className="inline-block bg-[#f1bfff] text-[#613471] font-bold px-6 py-2 rounded-lg text-sm transition-transform hover:scale-105 active:scale-95">Complete Profile</Link>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-[#f1bfff]/10 group-hover:rotate-12 transition-transform duration-500">auto_awesome</span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
