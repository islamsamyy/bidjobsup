import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "About Us | BidJobs",
  description:
    "We are the bridge between elite talent and the monumental ambitions of Saudi Vision 2030.",
};

const teamMembers = [
  {
    name: "Dr. Khalid Al-Faisal",
    role: "Founder & Chief Visionary",
    bio: "Former advisor to the Ministry of Investment with 15 years in talent architecture.",
    gradient: "from-primary/60 to-secondary/40",
  },
  {
    name: "Sarah Bin Saud",
    role: "Chief Operating Officer",
    bio: "Lead scaling operations for three Saudi unicorns before joining the BidJobs mission.",
    gradient: "from-secondary/60 to-tertiary/40",
  },
  {
    name: "Mark Sterling",
    role: "Chief Technology Officer",
    bio: "AI pioneer specializing in predictive talent matching algorithms and secure HR-tech.",
    gradient: "from-tertiary/60 to-primary/40",
  },
];

export default async function AboutPage() {
  const supabase = await createClient()

  // Fetch real platform stats
  const [
    { count: totalUsers },
    { count: totalContracts },
    { count: totalJobs },
    { count: totalSeekers },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('contracts').select('*', { count: 'exact', head: true }),
    supabase.from('jobs').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('user_type', 'jobseeker'),
  ])

  // Calculate completion rate from contracts
  const { count: completedContracts } = await supabase
    .from('contracts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')

  const completionRate = (totalContracts || 0) > 0
    ? Math.round(((completedContracts || 0) / (totalContracts || 1)) * 100)
    : 0

  // Get distinct job categories as "sectors"
  const { data: categories } = await supabase
    .from('jobs')
    .select('category')
  const uniqueSectors = new Set(categories?.map(j => j.category).filter(Boolean))

  const formattedUsers = (totalUsers || 0) >= 1000
    ? `${((totalUsers || 0) / 1000).toFixed(0)}k+`
    : `${totalUsers || 0}+`

  return (
    <>
      {/* Hero Section */}
      <header className="relative h-[80vh] flex items-center justify-center overflow-hidden -mt-24">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-surface to-secondary/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-headline font-bold text-on-background tracking-tighter mb-8 leading-none">
            Pioneering the <br />
            <span className="text-primary italic font-light">
              Digital Renaissance
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant font-light max-w-2xl mx-auto leading-relaxed">
            We are the bridge between elite talent and the monumental ambitions
            of Saudi Vision 2030.
          </p>
        </div>
      </header>

      {/* Vision 2030 Narrative */}
      <section className="py-32 bg-surface">
        <div className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-primary font-label tracking-widest uppercase text-sm font-bold">
                Kingdom-First Ecosystem
              </span>
              <h2 className="text-4xl md:text-5xl font-headline font-semibold text-on-background leading-tight">
                Aligning with the <br /> Ambition of a Nation.
              </h2>
            </div>
            <p className="text-lg text-on-surface-variant leading-relaxed font-light">
              BidJobs was born from a singular realization: the rapid
              transformation of the Kingdom requires a talent matching engine as
              sophisticated as the projects it fuels. From the cognitive city of
              NEOM to the cultural hub of Diriyah, we provide the human capital
              infrastructure that turns vision into reality.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <div className="text-4xl font-headline text-primary mb-2">
                  2030
                </div>
                <p className="text-sm text-on-surface-variant font-medium">
                  Vision Alignment Goal
                </p>
              </div>
              <div>
                <div className="text-4xl font-headline text-primary mb-2">
                  100%
                </div>
                <p className="text-sm text-on-surface-variant font-medium">
                  Local Content Commitment
                </p>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl group-hover:bg-primary/20 transition duration-500" />
            <div className="relative rounded-xl shadow-2xl w-full h-[600px] bg-gradient-to-br from-primary/30 via-surface-container to-secondary/20" />
          </div>
        </div>
      </section>

      {/* Impact Stats - Bento Style */}
      <section className="py-32 bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-headline font-bold mb-4">
              The Talent Impact
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 bg-surface-container p-12 rounded-xl flex flex-col justify-between hover:bg-surface-bright transition-colors group">
              <svg
                className="text-primary w-12 h-12 mb-8 group-hover:scale-110 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                />
              </svg>
              <div>
                <h3 className="text-6xl font-headline font-bold text-on-background mb-4">
                  {formattedUsers}
                </h3>
                <p className="text-on-surface-variant text-lg">
                  Professionals registered on the platform.
                </p>
              </div>
            </div>
            <div className="bg-surface-container p-12 rounded-xl flex flex-col justify-center text-center hover:bg-surface-bright transition-colors">
              <h3 className="text-5xl font-headline font-bold text-primary mb-4">
                {completionRate}%
              </h3>
              <p className="text-on-surface-variant font-label">
                Contract Completion Rate
              </p>
            </div>
            <div className="bg-primary-container p-12 rounded-xl flex flex-col justify-center text-center">
              <h3 className="text-5xl font-headline font-bold text-on-primary-container mb-4">
                {uniqueSectors.size || 0}
              </h3>
              <p className="text-on-primary-container/80 font-label">
                Industry Sectors Covered
              </p>
            </div>
            <div className="bg-surface-container p-12 rounded-xl flex flex-col justify-center text-center md:col-span-2 hover:bg-surface-bright transition-colors">
              <h3 className="text-5xl font-headline font-bold text-on-background mb-4">
                {totalContracts || 0}
              </h3>
              <p className="text-on-surface-variant font-label">
                Contracts Completed on the Platform
              </p>
            </div>
            <div className="md:col-span-2 relative overflow-hidden rounded-xl h-[300px] bg-gradient-to-br from-primary/20 via-surface-container to-tertiary/10">
              <div className="absolute inset-0 bg-black/40 flex items-center p-12">
                <p className="text-2xl font-headline italic text-white leading-tight">
                  &ldquo;Reshaping the future of work in the cradle of
                  civilization.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-32 bg-surface">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-headline font-bold mb-6">
                The Architects <br />
                of BidJobs.
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Our leadership combines global tech expertise with deep-rooted
                understanding of the Saudi industrial landscape.
              </p>
            </div>
            <a
              className="text-primary-dim font-bold border-b-2 border-primary-dim/30 pb-1 hover:border-primary-dim transition-all"
              href="/contact"
            >
              Join the Board &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {teamMembers.map((member) => (
              <div key={member.name} className="group">
                <div className="relative mb-8 overflow-hidden rounded-xl bg-surface-container">
                  <div
                    className={`w-full h-[500px] bg-gradient-to-br ${member.gradient}`}
                  />
                </div>
                <h3 className="text-2xl font-headline font-bold text-on-background">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-4">{member.role}</p>
                <p className="text-on-surface-variant text-sm font-light">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
