import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from '../components/LogoutButton'
import { SidebarLink } from '../components/SidebarLink'
import NotificationBell from '@/components/features/NotificationBell'
export default async function SeekerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/sign-in')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', user.id)
    .single()

  if (!profile || (profile.user_type !== 'jobseeker' && profile.user_type !== 'both')) {
    redirect('/dashboard')
  }

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      {/* Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 z-50 bg-stone-950/80 backdrop-blur-2xl shadow-[4px_0_24px_rgba(0,0,0,0.6)] flex flex-col py-8 px-4 gap-2 border-r border-outline-variant/10">
        <div className="mb-8 px-4">
          <Link href="/">
            <img src="/logo.png" alt="BidJobs Logo" className="h-8 w-auto mb-2 drop-shadow-[0_0_8px_rgba(202,162,247,0.4)]" />
          </Link>
          <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mt-1">Elite Talent Portal</p>
        </div>

        <nav className="flex flex-col gap-1 grow">
          <SidebarLink href="/dashboard/seeker" icon="dashboard" label="Dashboard" exact />
          <SidebarLink href="/dashboard/seeker/profile" icon="person" label="Profile" />
          <SidebarLink href="/dashboard/seeker/applications" icon="description" label="Applications" />
          <SidebarLink href="/dashboard/seeker/saved" icon="bookmark" label="Saved Jobs" />
          <SidebarLink href="/dashboard/messages" icon="forum" label="Messages" />
          <SidebarLink href="/dashboard/seeker/notifications" icon="notifications" label="Notifications" />
          <SidebarLink href="/dashboard/seeker/subscription" icon="workspace_premium" label="Subscription" />
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant/10 pt-6">
          <Link
            href="/dashboard/seeker/search"
            className="text-center w-full bg-gradient-to-br from-primary to-primary-container text-on-primary-container py-3 rounded-xl font-bold text-sm mb-4 shadow-lg shadow-primary/10 hover:opacity-90 active:scale-95 transition-all"
          >
            Find Opportunities
          </Link>
          <SidebarLink href="/dashboard/settings" icon="settings" label="Settings" />
          <SidebarLink href="/contact" icon="help" label="Help Center" />
          <LogoutButton />
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="ml-64 min-h-screen relative overflow-hidden flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-stone-950/70 backdrop-blur-xl flex justify-between items-center w-full px-8 h-20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-6">
            <form action="/dashboard/seeker/search" className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                name="q"
                className="bg-surface-container-lowest border-none rounded-full pl-10 pr-6 py-2 text-sm w-80 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                placeholder="Search elite opportunities..."
                type="search"
              />
            </form>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell userId={profile.id} userAuthId={user.id} userType={profile.user_type} />
            <Link href="/dashboard/settings" className="p-2 text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </Link>
            <Link href="/dashboard/seeker/profile">
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/20 p-0.5 bg-surface-container-highest flex items-center justify-center">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-primary font-bold bg-surface-container-lowest">
                    {profile.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-10 space-y-12 max-w-[1400px] mx-auto w-full">
          {children}
        </div>

        <div className="fixed bottom-10 right-10 opacity-5 pointer-events-none select-none z-[-1]">
          <span className="material-symbols-outlined text-[30rem]" style={{ fontVariationSettings: "'FILL' 0" }}>apartment</span>
        </div>
      </main>
    </div>
  )
}
