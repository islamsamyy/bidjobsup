'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { Suspense } from 'react'

interface SidebarLinkParamInnerProps {
  basePath: string
  paramValue: string
  isDefault?: boolean
  icon: string
  labelKey?: string
  label?: string
  accentColor?: 'primary' | 'secondary'
}

function SidebarLinkParamInner({
  basePath,
  paramValue,
  isDefault = false,
  icon,
  labelKey,
  label,
  accentColor = 'primary',
}: SidebarLinkParamInnerProps) {
  const { t } = useLanguage()
  const displayLabel = labelKey ? t(labelKey) : (label ?? '')
  const searchParams = useSearchParams()
  const currentS = searchParams.get('s')

  const isActive = isDefault
    ? !currentS || currentS === paramValue
    : currentS === paramValue

  const href = `${basePath}?s=${paramValue}`

  const activeClass =
    accentColor === 'secondary'
      ? 'bg-stone-800/50 text-secondary border-r-4 border-secondary'
      : 'bg-stone-800/50 text-primary border-r-4 border-primary'

  return (
    <Link
      href={href}
      scroll={false}
      className={`rounded-r-lg px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:translate-x-1 ${
        isActive ? activeClass : 'text-on-surface-variant hover:text-on-surface'
      }`}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
      >
        {icon}
      </span>
      <span className="text-sm font-medium tracking-wide">{displayLabel}</span>
    </Link>
  )
}

// Exported wrapper with Suspense boundary so useSearchParams never causes static-render bail-out
export function SidebarLinkParam(props: SidebarLinkParamInnerProps) {
  const fallback = (
    <Link
      href={`${props.basePath}?s=${props.paramValue}`}
      scroll={false}
      className="rounded-r-lg px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:translate-x-1 text-on-surface-variant hover:text-on-surface"
    >
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
        {props.icon}
      </span>
      <span className="text-sm font-medium tracking-wide">{props.label ?? props.labelKey ?? ''}</span>
    </Link>
  )

  return (
    <Suspense fallback={fallback}>
      <SidebarLinkParamInner {...props} />
    </Suspense>
  )
}
