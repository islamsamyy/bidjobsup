import { getAuthUser } from '@/lib/auth-utils'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const { profile, user } = await getAuthUser()

  const profileRoute = profile?.user_type === 'employer'
    ? '/dashboard/employer/profile'
    : '/dashboard/seeker/profile'

  return (
    <main className="max-w-3xl mx-auto px-0 py-4 relative">
      <div className="absolute -top-20 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href={profileRoute}
            className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Profile
          </Link>
          <span className="text-stone-700">/</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Settings</span>
        </div>

        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="font-headline text-5xl font-black italic text-on-surface leading-tight">
              Account <span className="text-primary">Settings</span>
            </h1>
            <p className="text-on-surface-variant mt-3 text-sm italic max-w-lg leading-relaxed">
              Manage your security, notification preferences, and privacy controls for{' '}
              <span className="text-on-surface font-bold">{profile?.full_name || user?.email}</span>.
            </p>
          </div>
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              manage_accounts
            </span>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-8 flex flex-wrap gap-3">
          {[
            { label: 'Security', icon: 'shield_person', href: '#security' },
            { label: 'Notifications', icon: 'notifications', href: '#notifications' },
            { label: 'Privacy', icon: 'lock', href: '#privacy' },
            { label: 'Danger Zone', icon: 'warning', href: '#danger' },
          ].map(l => (
            <a
              key={l.label}
              href={l.href}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/10 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary hover:border-primary/20 transition-all"
            >
              <span className="material-symbols-outlined text-sm">{l.icon}</span>
              {l.label}
            </a>
          ))}
        </div>
      </header>

      <SettingsClient profile={profile as any} email={user?.email ?? ''} />

      {/* Footer note */}
      <div className="mt-12 pt-8 border-t border-outline-variant/10 flex items-center gap-3 text-[10px] text-stone-600 font-bold uppercase tracking-widest">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        BidJobs Secure Protocol — All changes are encrypted and applied instantly
      </div>
    </main>
  )
}
