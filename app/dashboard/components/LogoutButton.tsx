'use client'

import { logout } from '@/app/(auth)/actions'

export function LogoutButton() {
  return (
    <button 
      onClick={() => logout()}
      className="text-on-surface-variant hover:text-on-surface px-4 py-3 flex items-center gap-3 transition-transform hover:translate-x-1 duration-200 mt-2"
    >
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>logout</span>
      <span className="text-sm font-medium tracking-wide">Logout</span>
    </button>
  )
}
