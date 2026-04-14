'use client'

import Link from 'next/link'

export default function SkillsErrorPage({ error }: { error: Error }) {
  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-12">
      <div className="glass border border-outline-variant/15 rounded-xl p-12 text-center">
        <span className="material-symbols-outlined text-5xl text-error/30 block mb-4">
          error
        </span>
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">
          Error Loading Skills
        </h1>
        <p className="text-on-surface-variant mb-8">
          {error?.message || 'An error occurred while loading your skills.'}
        </p>
        <Link
          href="/dashboard/seeker"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Profile
        </Link>
      </div>
    </main>
  )
}
