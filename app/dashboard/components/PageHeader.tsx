'use client'

import { useLanguage } from '@/app/providers/LanguageProvider'

interface PageHeaderProps {
  titleKey: string
  subtitleKey?: string
  className?: string
}

export function PageHeader({ titleKey, subtitleKey, className = 'mb-8' }: PageHeaderProps) {
  const { t } = useLanguage()
  return (
    <div className={className}>
      <h1 className="text-3xl font-bold text-on-surface mb-2">{t(titleKey)}</h1>
      {subtitleKey && <p className="text-on-surface-variant">{t(subtitleKey)}</p>}
    </div>
  )
}
