'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface Props {
  children: React.ReactNode
  accentColor?: 'primary' | 'secondary'
}

export function MobileSidebarWrapper({ children, accentColor = 'primary' }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const color = accentColor === 'secondary' ? 'text-secondary' : 'text-primary'

  return (
    <>
      {/* Hamburger button - shows in header on mobile */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors"
        aria-label="Open navigation menu"
      >
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 h-screen w-72 z-[70] bg-stone-950 border-r border-outline-variant/10 shadow-2xl
          flex flex-col py-8 px-4 gap-2 transition-transform duration-300 ease-in-out md:hidden overflow-y-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors"
          aria-label="Close navigation"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        {children}
      </aside>
    </>
  )
}
