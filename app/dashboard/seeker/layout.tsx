import { getAuthUserAs } from '@/lib/auth-utils'
import Link from 'next/link'
import { LogoutButton } from '../components/LogoutButton'
import { SidebarLink } from '../components/SidebarLink'
import { SidebarHeading, FindOpportunitiesButton, TranslatedSearchInput } from '../components/TranslatedText'
import NotificationBell from '@/components/features/NotificationBell'
import { ThemeSwitcher } from '@/components/features/ThemeSwitcher'
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher'

export default async function SeekerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile, user } = await getAuthUserAs('jobseeker')

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      {/* Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 z-50 bg-stone-950/80 backdrop-blur-2xl shadow-[4px_0_24px_rgba(0,0,0,0.6)] flex flex-col py-8 px-4 gap-2 border-r border-outline-variant/10">
        <div className="mb-8 px-4">
          <Link href="/">
            <img src="/logo.png" alt="BidJobs Logo" className="h-8 w-auto mb-2 drop-shadow-[0_0_8px_rgba(202,162,247,0.4)]" />
          </Link>
          <SidebarHeading textKey="dashboardLayout.eliteTalentPortal" />
        </div>

        <nav className="flex flex-col gap-1 grow">
          <SidebarLink href="/dashboard/seeker" icon="dashboard" labelKey="dashboardLayout.dashboard" exact />
          <SidebarLink href="/dashboard/seeker/profile" icon="person" labelKey="dashboardLayout.profile" />
          <SidebarLink href="/dashboard/seeker/applications" icon="description" labelKey="dashboardLayout.applications" />
          <SidebarLink href="/dashboard/seeker/saved" icon="bookmark" labelKey="dashboardLayout.savedJobs" />
          <SidebarLink href="/dashboard/contracts" icon="handshake" labelKey="dashboardLayout.contracts" />
          <SidebarLink href="/dashboard/messages" icon="forum" labelKey="dashboardLayout.messages" />
          <SidebarLink href="/dashboard/seeker/notifications" icon="notifications" labelKey="dashboardLayout.notifications" />
          <SidebarLink href="/dashboard/seeker/subscription" icon="workspace_premium" labelKey="dashboardLayout.subscription" />
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant/10 pt-6">
          <FindOpportunitiesButton />
          <SidebarLink href="/dashboard/settings" icon="settings" labelKey="dashboardLayout.settings" />
          <SidebarLink href="/contact" icon="help" labelKey="dashboardLayout.helpCenter" />
          <LogoutButton />
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="ml-64 min-h-screen relative overflow-hidden flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-stone-950/70 backdrop-blur-xl flex justify-between items-center w-full px-8 h-20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-6">
            <TranslatedSearchInput
              action="/dashboard/seeker/search"
              placeholderKey="dashboardLayout.searchOpportunities"
              ringClass="focus:ring-primary/50"
            />
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <NotificationBell userId={Number(profile?.id)} userAuthId={user?.id!} userType={profile?.user_type!} />
            <Link href="/dashboard/settings" className="p-2 text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </Link>
            <Link href="/dashboard/seeker/profile">
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/20 p-0.5 bg-surface-container-highest flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile?.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-primary font-bold bg-surface-container-lowest">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
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
