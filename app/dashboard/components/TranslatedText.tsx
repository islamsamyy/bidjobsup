'use client'

import Link from 'next/link'
import { useLanguage } from '@/app/providers/LanguageProvider'

export function TranslatedText({ textKey, className }: { textKey: string; className?: string }) {
  const { t } = useLanguage()
  return <span className={className}>{t(textKey)}</span>
}

export function SidebarHeading({ textKey }: { textKey: string }) {
  const { t } = useLanguage()
  return (
    <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mt-1">
      {t(textKey)}
    </p>
  )
}

export function SidebarCTAButton({
  href,
  textKey,
  variant = 'primary',
}: {
  href: string
  textKey: string
  variant?: 'primary' | 'secondary'
}) {
  const { t } = useLanguage()
  const classes =
    variant === 'secondary'
      ? 'text-center w-full bg-gradient-to-br from-secondary/80 to-secondary text-on-primary-container py-3 rounded-xl font-bold text-sm mb-4 shadow-lg shadow-secondary/10 hover:opacity-90 active:scale-95 transition-all'
      : 'text-center w-full bg-gradient-to-br from-primary to-primary-container text-on-primary-container py-3 rounded-xl font-bold text-sm mb-4 shadow-lg shadow-primary/10 hover:opacity-90 active:scale-95 transition-all'
  return (
    <Link href={href} className={classes}>
      {t(textKey)}
    </Link>
  )
}

export function PostNewRoleButton() {
  return <SidebarCTAButton href="/dashboard/employer/post-job" textKey="dashboardLayout.postNewRole" variant="secondary" />
}

export function FindOpportunitiesButton() {
  return <SidebarCTAButton href="/dashboard/seeker/search" textKey="dashboardLayout.findOpportunities" variant="primary" />
}

export function TranslatedSearchInput({
  action,
  placeholderKey,
  ringClass,
}: {
  action: string
  placeholderKey: string
  ringClass: string
}) {
  const { t } = useLanguage()
  return (
    <form action={action} className="relative group">
      <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
      <input
        name="q"
        className={`bg-surface-container-lowest border-none rounded-full ps-10 pe-6 py-2 text-sm w-80 focus:ring-2 ${ringClass} transition-all outline-none`}
        placeholder={t(placeholderKey)}
        type="search"
      />
    </form>
  )
}
