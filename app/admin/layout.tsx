import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from '../dashboard/components/LogoutButton'

export const dynamic = 'force-dynamic'

const ADMIN_NAV = [
  { href: '/admin', icon: 'dashboard', label: 'Overview' },
  { href: '/admin/jobs', icon: 'work', label: 'Job Moderation' },
  { href: '/admin/users', icon: 'group', label: 'User Management' },
  { href: '/admin/disputes', icon: 'gavel', label: 'Disputes' },
  { href: '/admin/reports', icon: 'flag', label: 'Reports' },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role, user_type')
    .eq('auth_id', user.id)
    .single()

  // Strict gate: only role === 'admin' may see anything under /admin
  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  const exitHref = profile.user_type === 'employer' ? '/dashboard/employer' : '/dashboard/seeker'

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="sticky top-0 z-50 bg-stone-950/80 backdrop-blur-2xl border-b border-outline-variant/10">
        <div className="max-w-screen-2xl mx-auto px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-3">
              <img src="/logo.png" alt="BidJobs" className="h-8 w-auto" />
              <span className="px-2 py-0.5 bg-red-500/15 border border-red-500/30 text-red-400 rounded text-[10px] font-black uppercase tracking-widest">
                Admin
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {ADMIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={exitHref}
              className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-all"
            >
              Exit Admin
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-8 py-10">
        {children}
      </main>
    </div>
  )
}
