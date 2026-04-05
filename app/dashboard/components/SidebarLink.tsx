'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarLinkProps {
  href: string
  icon: string
  label: string
  accentColor?: 'primary' | 'secondary'
  exact?: boolean
}

export function SidebarLink({
  href,
  icon,
  label,
  accentColor = 'primary',
  exact = false,
}: SidebarLinkProps) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  const activeClass = accentColor === 'secondary'
    ? 'bg-stone-800/50 text-secondary border-r-4 border-secondary'
    : 'bg-stone-800/50 text-primary border-r-4 border-primary'

  return (
    <Link
      href={href}
      className={`rounded-r-lg px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:translate-x-1
        ${isActive
          ? activeClass
          : 'text-on-surface-variant hover:text-on-surface'
        }`}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
      >
        {icon}
      </span>
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </Link>
  )
}
