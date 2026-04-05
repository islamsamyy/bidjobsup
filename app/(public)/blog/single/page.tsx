import Link from 'next/link'

const RELATED = [
  {
    category: 'Market Intelligence',
    title: 'Rate Anchoring: Why Setting Your Price High Wins More Work',
    readTime: '4 min',
  },
  {
    category: 'Career',
    title: 'Portfolio Architecture: Structuring Your Work History for Maximum Impact',
    readTime: '7 min',
  },
  {
    category: 'Mindset',
    title: 'The Specialist Premium: Why Niching Down Multiplies Your Earning Power',
    readTime: '8 min',
  },
]

export default function BlogSinglePage() {
  return (
    <main className="max-w-screen-2xl mx-auto px-8 pt-32 pb-40">
      <div className="max-w-[900px] mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#4b474a] mb-12">
          <Link href="/blog" className="hover:text-[#b0a9ad] transition-colors">Editorial</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-[#b0a9ad]">Strategy</span>
        </nav>

        {/* Article Header */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 rounded-full bg-[#613471]/30 text-[#f1bfff] text-[10px] font-black uppercase tracking-widest border border-[#f1bfff]/10">
              Strategy
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4b474a]">6 min read · March 2026</span>
          </div>
          <h1 className="font-headline text-5xl md:text-6xl font-black text-[#faf1f5] leading-tight mb-8">
            The Bid That Changed Everything: How Precision Proposals Win Premium Roles
          </h1>
          <p className="text-xl text-[#b0a9ad] leading-relaxed font-light">
            Most bids fail in the first sentence. We break down the anatomy of proposals that convert — and the psychology behind why employers say yes.
          </p>
        </header>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#caa2f7]/30 to-transparent mb-16" />

        {/* Article Body */}
        <article className="prose prose-invert max-w-none text-[#b0a9ad] leading-relaxed space-y-8">
          <p className="text-lg">
            The average employer reviewing bids spends eleven seconds on each one before deciding whether to read further. Eleven seconds. Not enough time to parse your portfolio, your rates, or your timeline — only enough to decide if you understand their problem.
          </p>

          <h2 className="font-headline text-3xl font-black text-[#faf1f5] mt-12 mb-6">The Problem With Generic Bids</h2>
          <p>
            Most freelancers and contractors lead with capability. "I have 8 years of experience in design and have worked with companies like X, Y, and Z." This is understandable — it feels safe, it feels professional. But it is also exactly what every other bidder is writing, and it answers the wrong question.
          </p>
          <p>
            Employers do not begin the hiring process wondering <em className="text-[#faf1f5]">who is capable</em>. They begin wondering <em className="text-[#faf1f5]">who understands what they are trying to accomplish</em>. Capability is assumed. Comprehension is rare.
          </p>

          <h2 className="font-headline text-3xl font-black text-[#faf1f5] mt-12 mb-6">The Anatomy of a Winning Bid</h2>
          <p>
            After analyzing thousands of successful bids submitted through BidJobs, a consistent structure emerges. It is not a template — it is a sequence of proof points that guide the employer from recognition to trust to decision.
          </p>

          <div className="bg-[#1c181c] border border-[#292428] rounded-2xl p-8 my-10">
            <div className="space-y-6">
              {[
                { n: '01', title: 'Mirror the Problem', body: 'Open by restating their challenge in your own words. Not paraphrasing the job post — demonstrating you have thought about the business context beneath it.' },
                { n: '02', title: 'Deliver an Insight', body: 'Before talking about yourself, offer something they have not already considered. A relevant data point, a constraint they may have overlooked, or a framing that reorients the problem.' },
                { n: '03', title: 'Make the Parallel', body: 'Reference a specific past engagement that is structurally similar. Not the same industry — the same type of challenge, the same success metric.' },
                { n: '04', title: 'Anchor the Terms', body: 'State your rate with confidence and a brief rationale. Ambiguity signals uncertainty. Precision signals mastery.' },
              ].map((item) => (
                <div key={item.n} className="flex gap-6">
                  <div className="font-headline text-4xl font-black text-[#292428] shrink-0 leading-none mt-1">{item.n}</div>
                  <div>
                    <h3 className="font-headline text-lg font-bold text-[#faf1f5] mb-2">{item.title}</h3>
                    <p className="text-[#b0a9ad] text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="font-headline text-3xl font-black text-[#faf1f5] mt-12 mb-6">The Psychology of Yes</h2>
          <p>
            Employers approve bids when they feel understood, not impressed. The distinction matters. Impressive credentials create admiration; demonstrated comprehension creates trust. And trust is what converts a review into a reply.
          </p>
          <p>
            When you show someone that you understand their problem better than they have articulated it themselves, you have done something rare and powerful: you have positioned yourself as a thinking partner, not a service provider. The engagement shifts from transactional to collaborative before the first call is scheduled.
          </p>

          <h2 className="font-headline text-3xl font-black text-[#faf1f5] mt-12 mb-6">What to Do Next</h2>
          <p>
            Open the last three bids you submitted. Read the first sentence of each. Ask yourself: does this sentence prove I understand their business — or does it prove I exist and have experience? If it is the latter, rewrite it before your next submission. The format is straightforward:
          </p>
          <blockquote className="border-l-4 border-[#caa2f7] pl-6 italic text-[#faf1f5] my-8">
            "Based on what you described, the core challenge is [X]. Here is what I would do differently from most approaches, and why it matters in your context…"
          </blockquote>
          <p>
            Lead with comprehension. Follow with proof. Close with confidence. That is the bid that changes everything.
          </p>
        </article>

        {/* Author */}
        <div className="mt-16 pt-10 border-t border-[#292428] flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-[#1c181c] border border-[#292428] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#caa2f7] text-2xl">person</span>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#4b474a] mb-1">Written by</div>
            <div className="font-headline text-lg font-bold text-[#faf1f5]">BidJobs Editorial</div>
            <div className="text-sm text-[#b0a9ad]">Strategy and market intelligence for the BidJobs network.</div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <section className="mt-24 max-w-screen-xl mx-auto">
        <h2 className="font-headline text-4xl font-black text-[#faf1f5] mb-10">Continue Reading</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {RELATED.map((a) => (
            <Link key={a.title} href="/blog/single" className="group">
              <div className="bg-[#1c181c] border border-[#292428] rounded-2xl p-8 h-full hover:border-[#caa2f7]/20 hover:bg-[#221e22] transition-all duration-500 flex flex-col">
                <span className="px-3 py-1 rounded-full bg-[#613471]/20 text-[#f1bfff] text-[10px] font-black uppercase tracking-widest border border-[#f1bfff]/10 self-start mb-4">
                  {a.category}
                </span>
                <h3 className="font-headline text-lg font-bold text-[#faf1f5] leading-snug mb-4 flex-1 group-hover:text-[#caa2f7] transition-colors">
                  {a.title}
                </h3>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#caa2f7] flex items-center gap-2 mt-auto">
                  {a.readTime} <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
