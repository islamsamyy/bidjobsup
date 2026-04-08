import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Privacy | BidJobs",
};

export default function TermsPage() {
  return (
    <div className="pb-24 px-6 md:px-12 max-w-[1400px] mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-16">
      {/* Sidebar Navigation */}
      <aside className="lg:col-span-3 hidden lg:block sticky top-32 h-fit space-y-8">
        <div className="space-y-6">
          <h3 className="font-headline text-xl text-primary-fixed border-l-2 border-primary pl-4">
            Legal Directory
          </h3>
          <nav className="flex flex-col gap-2">
            <a
              className="px-4 py-3 rounded-xl bg-surface-container-high text-primary border-r-4 border-primary font-medium transition-all"
              href="#introduction"
            >
              Introduction
            </a>
            <a
              className="px-4 py-3 rounded-xl hover:bg-white/5 text-on-surface-variant transition-all"
              href="#user-conduct"
            >
              User Conduct
            </a>
            <a
              className="px-4 py-3 rounded-xl hover:bg-white/5 text-on-surface-variant transition-all"
              href="#data-privacy"
            >
              Data Privacy
            </a>
            <a
              className="px-4 py-3 rounded-xl hover:bg-white/5 text-on-surface-variant transition-all"
              href="#liability"
            >
              Liability &amp; Indemnity
            </a>
            <a
              className="px-4 py-3 rounded-xl hover:bg-white/5 text-on-surface-variant transition-all"
              href="#intellectual-property"
            >
              Intellectual Property
            </a>
            <a
              className="px-4 py-3 rounded-xl hover:bg-white/5 text-on-surface-variant transition-all"
              href="#payment-terms"
            >
              Payment &amp; Escrow
            </a>
            <a
              className="px-4 py-3 rounded-xl hover:bg-white/5 text-on-surface-variant transition-all"
              href="#termination"
            >
              Termination
            </a>
          </nav>
        </div>
        <div className="p-6 rounded-2xl bg-surface-container-low border border-white/5 space-y-4">
          <p className="text-xs font-label uppercase tracking-widest text-outline">
            Last Updated
          </p>
          <p className="font-headline italic text-on-surface">
            October 24, 2030
          </p>
          <button className="w-full py-2 border border-outline-variant rounded-lg text-xs font-label hover:bg-white/5 transition-colors">
            Download PDF
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="lg:col-span-9 space-y-20">
        {/* Hero Header */}
        <section className="space-y-6">
          <h1 className="font-headline text-5xl md:text-7xl leading-tight tracking-tighter text-on-surface">
            The Neon <span className="italic text-primary">Nocturne</span> Legal
            Framework
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl font-light leading-relaxed">
            Transparent, equitable, and forward-looking. Our terms govern the
            intersection of elite talent and premium opportunities within the
            BidJobs ecosystem.
          </p>
        </section>

        {/* Content Sections */}
        <div className="space-y-24">
          {/* Section 1 - Introduction */}
          <section className="scroll-mt-32 space-y-8" id="introduction">
            <div className="flex items-baseline gap-4">
              <span className="font-headline text-4xl text-primary/30">01</span>
              <h2 className="font-headline text-3xl text-on-surface">
                Introduction
              </h2>
            </div>
            <div className="prose prose-invert max-w-none text-on-surface-variant leading-relaxed space-y-6 font-light">
              <p>
                Welcome to BidJobs. These Terms of Service (&quot;Terms&quot;)
                constitute a legally binding agreement between you and BidJobs
                Inc. regarding your use of our platform, services, and
                associated applications.
              </p>
              <p>
                By accessing or using BidJobs, you acknowledge that you have
                read, understood, and agree to be bound by these Terms and our
                Privacy Policy. If you do not agree, you must immediately cease
                all use of our services.
              </p>
              <div className="p-8 bg-surface-container rounded-2xl border-l-4 border-primary-container">
                <p className="italic text-on-surface">
                  &quot;Our mission is to provide a sanctuary for creative and
                  technical excellence. These rules ensure that the sanctuary
                  remains pristine.&quot;
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 - User Conduct */}
          <section className="scroll-mt-32 space-y-8" id="user-conduct">
            <div className="flex items-baseline gap-4">
              <span className="font-headline text-4xl text-primary/30">02</span>
              <h2 className="font-headline text-3xl text-on-surface">
                User Conduct
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl bg-surface-container-low border border-white/5 hover:border-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary mb-4">
                  verified_user
                </span>
                <h4 className="font-headline text-xl mb-2">Authenticity</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  All profile information, portfolios, and job briefs must
                  represent factual truth. Impersonation or fabrication of
                  credentials results in immediate termination.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-surface-container-low border border-white/5 hover:border-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary mb-4">
                  gavel
                </span>
                <h4 className="font-headline text-xl mb-2">Professionalism</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Communication must remain respectful and architectural.
                  Harassment, discrimination, or predatory bidding behaviors are
                  strictly prohibited.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 - Data Privacy */}
          <section className="scroll-mt-32 space-y-8" id="data-privacy">
            <div className="flex items-baseline gap-4">
              <span className="font-headline text-4xl text-primary/30">03</span>
              <h2 className="font-headline text-3xl text-on-surface">
                Data Privacy
              </h2>
            </div>
            <div className="space-y-6 text-on-surface-variant font-light leading-relaxed">
              <p>
                Your data is treated with the same reverence as a masterwork. We
                utilize end-to-end encryption for all brief communications and
                personal identifying information (PII).
              </p>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex gap-4">
                  <span className="text-primary mt-1">/</span>
                  <span>
                    <strong className="text-on-surface font-medium">
                      Collection:
                    </strong>{" "}
                    We collect only what is necessary to facilitate high-end
                    talent matching.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="text-primary mt-1">/</span>
                  <span>
                    <strong className="text-on-surface font-medium">
                      Usage:
                    </strong>{" "}
                    AI-driven matching uses anonymized behavioral patterns, never
                    your private identity for third-party sales.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="text-primary mt-1">/</span>
                  <span>
                    <strong className="text-on-surface font-medium">
                      Retention:
                    </strong>{" "}
                    You have the &quot;Right to be Forgotten.&quot; Upon account
                    deletion, all non-transactional data is purged within 30
                    days.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 - Liability */}
          <section className="scroll-mt-32 space-y-8" id="liability">
            <div className="flex items-baseline gap-4">
              <span className="font-headline text-4xl text-primary/30">04</span>
              <h2 className="font-headline text-3xl text-on-surface">
                Liability &amp; Indemnity
              </h2>
            </div>
            <div className="p-10 bg-surface-container-lowest rounded-3xl border border-white/5 space-y-6">
              <p className="text-on-surface-variant italic">
                BidJobs acts as a facilitator, not an employer or agent. We
                provide the infrastructure for excellence but do not guarantee
                the performance of either party involved in a brief.
              </p>
              <p className="text-sm uppercase tracking-widest text-outline-variant font-medium">
                Limitation of Liability:
              </p>
              <p className="text-on-surface leading-loose">
                IN NO EVENT SHALL BIDJOBS BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT
                LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
                INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR
                INABILITY TO ACCESS OR USE THE SERVICES.
              </p>
            </div>
          </section>

          {/* Section 5 - Intellectual Property */}
          <section className="scroll-mt-32 space-y-8" id="intellectual-property">
            <div className="flex items-baseline gap-4">
              <span className="font-headline text-4xl text-primary/30">05</span>
              <h2 className="font-headline text-3xl text-on-surface">
                Intellectual Property
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="h-1 w-12 bg-primary"></div>
                <h5 className="font-headline text-lg">The Platform</h5>
                <p className="text-xs text-on-surface-variant font-body">
                  All BidJobs proprietary technology, UI/UX designs, and
                  algorithms remain the sole property of BidJobs Inc.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-1 w-12 bg-secondary"></div>
                <h5 className="font-headline text-lg">Talent Work</h5>
                <p className="text-xs text-on-surface-variant font-body">
                  Ownership of deliverables is determined by the specific
                  agreement between the Client and Talent. BidJobs claims no
                  stake in your creative output.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-1 w-12 bg-tertiary"></div>
                <h5 className="font-headline text-lg">User Content</h5>
                <p className="text-xs text-on-surface-variant font-body">
                  By posting content, you grant BidJobs a non-exclusive license
                  to host and display it to facilitate your visibility within the
                  ecosystem.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Contact Support Section */}
        <section className="mt-32 p-12 rounded-[2rem] bg-gradient-to-br from-surface-container to-background border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="font-headline text-3xl">Legal Clarity Needed?</h3>
            <p className="text-on-surface-variant">
              Our concierge legal team is available for enterprise inquiries.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-4 rounded-xl border border-outline-variant font-medium hover:bg-white/5 transition-all">
              Contact Support
            </button>
            <button className="px-8 py-4 rounded-xl bg-primary text-on-primary font-bold shadow-lg shadow-primary/20">
              Compliance Hub
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
