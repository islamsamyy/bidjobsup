import Link from 'next/link'

const ARTICLES = [
  {
    slug: 'single',
    category: 'Strategy',
    readTime: '6 min',
    title: 'The Bid That Changed Everything: How Precision Proposals Win Premium Roles',
    excerpt: 'Most bids fail in the first sentence. We break down the anatomy of proposals that convert — and the psychology behind why employers say yes.',
    date: 'March 2026',
    featured: true,
  },
  {
    slug: 'single',
    category: 'Market Intelligence',
    readTime: '4 min',
    title: 'Rate Anchoring: Why Setting Your Price High Wins More Work',
    excerpt: 'Counter-intuitive but proven — elite freelancers who anchor high close more deals at better terms. Here\'s the data and the reasoning.',
    date: 'February 2026',
    featured: false,
  },
  {
    slug: 'single',
    category: 'Employer Playbook',
    readTime: '5 min',
    title: 'Hiring in the Open: Why Transparent Salaries Attract Better Candidates',
    excerpt: 'Companies that show their budget upfront receive 3x more qualified bids and cut time-to-hire by 40%. The evidence is clear.',
    date: 'February 2026',
    featured: false,
  },
  {
    slug: 'single',
    category: 'Career',
    readTime: '7 min',
    title: 'Portfolio Architecture: Structuring Your Work History for Maximum Impact',
    excerpt: 'Your portfolio is a narrative, not a gallery. Learn how top-earning freelancers structure past work to make employers feel the outcome, not just see the output.',
    date: 'January 2026',
    featured: false,
  },
  {
    slug: 'single',
    category: 'Platform',
    readTime: '3 min',
    title: 'Introducing Direct Messaging: The End of Email Threads',
    excerpt: 'Real-time communication between employers and talent — built into BidJobs from first contact to contract close.',
    date: 'January 2026',
    featured: false,
  },
  {
    slug: 'single',
    category: 'Mindset',
    readTime: '8 min',
    title: 'The Specialist Premium: Why Niching Down Multiplies Your Earning Power',
    excerpt: 'Generalists compete on price. Specialists compete on value. The math of specialization — and how to position yourself as the only logical choice.',
    date: 'December 2025',
    featured: false,
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  Strategy: 'bg-[#613471]/30 text-[#f1bfff] border-[#f1bfff]/10',
  'Market Intelligence': 'bg-[#caa2f7]/10 text-[#caa2f7] border-[#caa2f7]/10',
  'Employer Playbook': 'bg-[#eab3fa]/10 text-[#eab3fa] border-[#eab3fa]/10',
  Career: 'bg-[#bc95e9]/10 text-[#bc95e9] border-[#bc95e9]/10',
  Platform: 'bg-[#4b474a]/30 text-[#b0a9ad] border-[#4b474a]/10',
  Mindset: 'bg-[#613471]/20 text-[#f1bfff] border-[#f1bfff]/10',
}

export default function BlogPage() {
  const featured = ARTICLES[0]
  const rest = ARTICLES.slice(1)

  return (
    <main className="max-w-screen-2xl mx-auto px-8 pt-32 pb-40">
      {/* Header */}
      <section className="mb-20">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-black tracking-[0.2em] uppercase mb-6">
          BidJobs Editorial
        </span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h1 className="font-headline text-7xl font-black tracking-tighter leading-[0.9] text-[#faf1f5]">
            Intelligence<br />
            <span className="text-[#caa2f7] italic font-light">Dispatch</span>
          </h1>
          <p className="text-[#b0a9ad] text-lg font-light max-w-sm">
            Strategy, market insight, and career architecture — for professionals who bid to win.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <Link href={`/blog/${featured.slug}`} className="block mb-16 group">
        <div className="bg-[#1c181c] border border-[#292428] rounded-[2rem] p-12 md:p-16 hover:border-[#caa2f7]/20 hover:bg-[#221e22] hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-all duration-500">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${CATEGORY_COLORS[featured.category]}`}>
                  {featured.category}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#4b474a]">
                  Featured · {featured.readTime} read
                </span>
              </div>
              <h2 className="font-headline text-4xl md:text-5xl font-black text-[#faf1f5] leading-tight mb-6 group-hover:text-[#caa2f7] transition-colors">
                {featured.title}
              </h2>
              <p className="text-[#b0a9ad] text-lg leading-relaxed mb-8 max-w-2xl font-light">{featured.excerpt}</p>
              <div className="flex items-center gap-3 text-[#caa2f7] font-black text-xs uppercase tracking-widest group-hover:gap-5 transition-all">
                Read Article
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </div>
            </div>
            <div className="lg:w-48 shrink-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-[2rem] bg-gradient-to-br from-[#613471] to-[#100d10] border border-[#caa2f7]/10 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-7xl text-[#caa2f7]" style={{ fontVariationSettings: "'FILL' 0" }}>auto_stories</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rest.map((article) => (
          <Link key={article.title} href={`/blog/${article.slug}`} className="group">
            <div className="bg-[#1c181c] border border-[#292428] rounded-2xl p-8 h-full hover:border-[#caa2f7]/20 hover:bg-[#221e22] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${CATEGORY_COLORS[article.category] || 'bg-[#4b474a]/20 text-[#b0a9ad] border-[#4b474a]/10'}`}>
                  {article.category}
                </span>
              </div>
              <h3 className="font-headline text-xl font-bold text-[#faf1f5] leading-snug mb-4 group-hover:text-[#caa2f7] transition-colors flex-1">
                {article.title}
              </h3>
              <p className="text-[#b0a9ad] text-sm leading-relaxed mb-6 line-clamp-3">{article.excerpt}</p>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest border-t border-[#292428] pt-4 mt-auto">
                <span className="text-[#4b474a]">{article.date}</span>
                <span className="text-[#caa2f7] flex items-center gap-2 group-hover:gap-3 transition-all">
                  {article.readTime}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter CTA */}
      <section className="mt-24 text-center bg-gradient-to-br from-[#1c181c] to-[#100d10] border border-[#caa2f7]/10 rounded-[2rem] p-16">
        <h2 className="font-headline text-4xl font-black text-[#faf1f5] mb-4">Stay Sharp</h2>
        <p className="text-[#b0a9ad] font-light mb-8 max-w-md mx-auto">
          New intelligence dispatches, market data, and strategy guides — delivered when they matter.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-br from-[#caa2f7] to-[#613471] text-[#431f6b] font-black text-xs uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-base">notifications</span>
          Join the Network
        </Link>
      </section>
    </main>
  )
}
