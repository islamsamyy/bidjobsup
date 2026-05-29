"use client";

import { useLanguage } from '@/app/providers/LanguageProvider';

function PlaceholderImage({
  className,
  gradient = "from-primary/30 to-secondary/20",
}: {
  className?: string;
  gradient?: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

export default function BlogPageClient() {
  const { t, isRtl } = useLanguage();

  return (
    <div className={`pb-20 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Featured Article Hero */}
      <section className="max-w-screen-2xl mx-auto px-8 mb-24 relative group cursor-pointer">
        <div className="relative h-[716px] w-full overflow-hidden rounded-xl shadow-2xl">
          <PlaceholderImage
            className="w-full h-full transition-transform duration-700 group-hover:scale-105"
            gradient="from-primary/40 via-secondary/20 to-tertiary/30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/90 to-transparent" />
          <div className={`absolute bottom-0 ${isRtl ? 'right-0' : 'left-0'} p-12 w-full md:w-2/3`}>
            <div className="flex gap-3 mb-6">
              <span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                {t('blogPage.visionUpdates')}
              </span>
              <span className="text-stone-400 text-xs py-1">
                {t('blogPage.heroDate')}
              </span>
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-bold text-on-surface mb-6 leading-tight tracking-tight">
              {t('blogPage.heroTitle')}
            </h1>
            <p className="text-stone-300 text-lg md:text-xl max-w-2xl font-light mb-8 leading-relaxed">
              {t('blogPage.heroDesc')}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/30">
                  <PlaceholderImage
                    className="w-full h-full"
                    gradient="from-primary-container to-primary/50"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">
                    {t('blogPage.authorName')}
                  </p>
                  <p className="text-xs text-stone-500">{t('blogPage.authorRole')}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-stone-700 mx-4" />
              <span className="text-primary hover:text-primary-dim transition-colors cursor-pointer font-bold flex items-center gap-2">
                {t('blogPage.readFullEditorial')}
                <svg
                  className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="max-w-screen-2xl mx-auto px-8 mb-16 overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-4">
          <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold text-sm transition-all shadow-lg shadow-primary/15">
            {t('blogPage.allInsights')}
          </button>
          {["Career Insights", "Vision 2030 Updates", "Tech Trends", "Saudi Economy"].map(
            (cat) => (
              <button
                key={cat}
                className="bg-surface-container text-stone-400 hover:text-on-surface px-8 py-3 rounded-full font-bold text-sm transition-all border border-transparent hover:border-outline-variant"
              >
                {cat}
              </button>
            )
          )}
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-screen-2xl mx-auto px-8 flex flex-col lg:flex-row gap-12">
        {/* Articles Grid */}
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12">
          {articles.map((article) => (
            <ArticleCard key={article.title} {...article} />
          ))}
        </div>

        {/* Sidebar */}
        <aside className="lg:w-1/3 flex flex-col gap-12">
          {/* Newsletter Signup */}
          <div className="bg-surface-container p-10 rounded-xl relative overflow-hidden border border-outline-variant/15">
            <div className={`absolute top-0 ${isRtl ? 'left-0' : 'right-0'} p-4 opacity-10`}>
              <svg
                className="w-20 h-20 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <h4 className="font-headline text-2xl font-bold mb-4 relative z-10">
              {t('blogPage.insightDigest')}
            </h4>
            <p className="text-stone-400 text-sm mb-8 leading-relaxed relative z-10">
              {t('blogPage.insightDigestDesc')}
            </p>
            <form className="flex flex-col gap-4 relative z-10">
              <input
                className="bg-surface-container-lowest border-none focus:ring-2 focus:ring-primary/50 rounded-lg p-4 text-sm text-on-surface placeholder-stone-600"
                placeholder={t('blogPage.emailPlaceholder')}
                type="email"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 rounded-lg hover:shadow-[0_0_20px_rgba(202,162,247,0.3)] transition-all"
              >
                {t('blogPage.subscribeNow')}
              </button>
            </form>
            <p className="text-[10px] text-stone-600 mt-4 text-center">
              {t('blogPage.noSpam')}
            </p>
          </div>

          {/* Trending Topics */}
          <div className="p-4">
            <h4 className="font-headline text-xl font-bold mb-6 flex items-center gap-3">
              {t('blogPage.trendingTopics')}
              <span className="h-px flex-1 bg-stone-800" />
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                "#NeomCareers",
                "#Vision2030",
                "#GreenInitiative",
                "#FinTechSaudi",
                "#DigitalTransformation",
              ].map((tag) => (
                <a
                  key={tag}
                  href={`/talent?query=${encodeURIComponent(tag.replace('#', ''))}`}
                  className="text-xs px-4 py-2 bg-stone-900 border border-stone-800 rounded-full hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all"
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>

          {/* Special Report */}
          <div className={`bg-stone-950 p-8 rounded-xl border-y-4 ${isRtl ? 'border-r-4' : 'border-l-4'} border-transparent border-t-transparent border-b-transparent ${isRtl ? 'border-r-primary' : 'border-l-primary'}`}>
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest mb-2 block">
              {t('blogPage.specialReport')}
            </span>
            <h5 className="text-lg font-bold mb-4 leading-snug">
              {t('blogPage.specialReportTitle')}
            </h5>
            <button className="flex items-center gap-2 text-sm font-bold text-on-surface group">
              {t('blogPage.downloadReport')}
              <svg
                className="w-4 h-4 group-hover:translate-y-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </button>
          </div>
        </aside>
      </section>

      {/* Pagination */}
      <section className="max-w-screen-2xl mx-auto px-8 mt-20 flex justify-center">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-stone-800 text-stone-500 hover:border-primary hover:text-primary transition-colors">
            <svg className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold text-sm">
            1
          </button>
          {[2, 3].map((n) => (
            <button
              key={n}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-stone-800 text-stone-500 hover:border-primary hover:text-primary transition-colors text-sm"
            >
              {n}
            </button>
          ))}
          <span className="px-2 text-stone-700">...</span>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-stone-800 text-stone-500 hover:border-primary hover:text-primary transition-colors text-sm">
            12
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-stone-800 text-stone-500 hover:border-primary hover:text-primary transition-colors">
            <svg className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}

/* ── Article data ── */

const articles = [
  {
    category: "Tech Trends",
    date: "8th October 2030",
    title: "The Rise of Sovereign AI in the Kingdom",
    summary:
      "Saudi Arabia is making a massive pivot towards hosting sovereign cloud infrastructure, creating thousands of specialized roles for AI architects and data governance experts.",
    gradient: "from-primary/30 via-surface-container to-secondary/20",
  },
  {
    category: "Career Insights",
    date: "5th October 2030",
    title: "Executive Negotiation in the Neo-Gulf",
    summary:
      "Mastering the art of the multi-tier compensation package: why equity and relocation are being redefined for 2030 standards.",
    gradient: "from-secondary/30 via-surface-container to-primary/20",
  },
  {
    category: "Saudi Economy",
    date: "1st October 2030",
    title: "Post-Oil Financial Markets: What Talent Needs to Know",
    summary:
      "As the Tadawul expands, the need for specialized fintech compliance talent is reaching an all-time high. Is your CV ready for the shift?",
    gradient: "from-tertiary/20 via-surface-container to-primary/30",
  },
  {
    category: "Career Insights",
    date: "28th September 2030",
    title: "Hybrid Work Cultures in Riyadh's Giga-Projects",
    summary:
      "Balancing remote flexibility with the need for high-stakes on-site presence in Saudi's burgeoning innovation hubs.",
    gradient: "from-primary/20 via-surface-container to-tertiary/20",
  },
];

function ArticleCard({
  category,
  date,
  title,
  summary,
  gradient,
}: (typeof articles)[number]) {
  const { t } = useLanguage();

  return (
    <div className="group flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-xl aspect-[16/10] bg-surface-container">
        <PlaceholderImage
          className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
          gradient={gradient}
        />
        <div className="absolute top-4 left-4">
          <span className="bg-surface-container-highest/80 backdrop-blur-md text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase">
            {category}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-xs font-label text-stone-500">{date}</p>
        <h3 className="text-2xl font-headline font-bold text-on-surface leading-snug group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-stone-400 text-sm leading-relaxed line-clamp-3">
          {summary}
        </p>
        <a
          href="/blog"
          className="mt-2 text-stone-200 text-xs font-bold underline underline-offset-4 decoration-primary/50 hover:decoration-primary transition-all"
        >
          {t('blogPage.readStory')}
        </a>
      </div>
    </div>
  );
}
