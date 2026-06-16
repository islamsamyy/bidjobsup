import { getAuthUserAs } from '@/lib/auth-utils'
import Link from 'next/link'
import { LogoutButton } from '../components/LogoutButton'
import { SidebarLink } from '../components/SidebarLink'
import { SidebarLinkParam } from '../components/SidebarLinkParam'
import { SidebarHeading, FindOpportunitiesButton, TranslatedSearchInput } from '../components/TranslatedText'
import NotificationBell from '@/components/features/NotificationBell'
import { ThemeSwitcher } from '@/components/features/ThemeSwitcher'
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher'
import { MobileSidebarWrapper } from '../components/MobileSidebar'

const BASE = '/dashboard/seeker'

export default async function SeekerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile, user: authUser } = await getAuthUserAs('jobseeker')

  const navItems = (
    <>
      <div className="mb-6 px-4 pt-2">
        <Link href="/">
          <img src="/logo.png" alt="BidJobs Logo" className="h-8 w-auto mb-2 drop-shadow-[0_0_8px_rgba(202,162,247,0.4)]" />
        </Link>
        <SidebarHeading textKey="dashboardLayout.eliteTalentPortal" />
      </div>

      <nav className="flex flex-col gap-1 grow">
        <SidebarLinkParam basePath={BASE} paramValue="overview" isDefault icon="dashboard" labelKey="dashboardLayout.dashboard" />
        <SidebarLinkParam basePath={BASE} paramValue="profile" icon="person" labelKey="dashboardLayout.profile" />
        <SidebarLinkParam basePath={BASE} paramValue="applications" icon="description" labelKey="dashboardLayout.applications" />
        <SidebarLinkParam basePath={BASE} paramValue="saved" icon="bookmark" labelKey="dashboardLayout.savedJobs" />
        <SidebarLinkParam basePath={BASE} paramValue="offers" icon="local_offer" labelKey="dashboardLayout.offers" />
        <SidebarLinkParam basePath={BASE} paramValue="contracts" icon="handshake" labelKey="dashboardLayout.contracts" />
        <SidebarLinkParam basePath={BASE} paramValue="interviews" icon="event" labelKey="dashboardLayout.interviews" />
        <SidebarLinkParam basePath={BASE} paramValue="payments" icon="payments" labelKey="dashboardLayout.payments" />
        <SidebarLinkParam basePath={BASE} paramValue="reviews" icon="star" labelKey="dashboardLayout.reviews" />
        <SidebarLinkParam basePath={BASE} paramValue="disputes" icon="gavel" labelKey="dashboardLayout.disputes" />
        <SidebarLinkParam basePath={BASE} paramValue="portfolio" icon="folder_special" labelKey="dashboardLayout.portfolio" />
        <SidebarLinkParam basePath={BASE} paramValue="skills" icon="psychology" labelKey="dashboardLayout.skills" />
        <SidebarLinkParam basePath={BASE} paramValue="messages" icon="forum" labelKey="dashboardLayout.messages" />
        <SidebarLinkParam basePath={BASE} paramValue="notifications" icon="notifications" labelKey="dashboardLayout.notifications" />
        <SidebarLinkParam basePath={BASE} paramValue="subscription" icon="workspace_premium" labelKey="dashboardLayout.subscription" />
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant/10 pt-6">
        {profile?.role === 'admin' && (
          <SidebarLink href="/admin" icon="admin_panel_settings" labelKey="dashboardLayout.adminPanel" />
        )}
        <FindOpportunitiesButton />
        <SidebarLink href="/dashboard/settings" icon="settings" labelKey="dashboardLayout.settings" />
        <SidebarLink href="/contact" icon="help" labelKey="dashboardLayout.helpCenter" />
        <LogoutButton />
      </div>
    </>
  )

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      {/* Desktop Sidebar - hidden on mobile */}
      <aside className="h-screen w-64 fixed left-0 top-0 z-50 bg-stone-950/80 backdrop-blur-2xl shadow-[4px_0_24px_rgba(0,0,0,0.6)] hidden md:flex flex-col py-8 px-4 gap-2 border-r border-outline-variant/10">
        {navItems}
      </aside>

      {/* Main Canvas */}
      <main className="md:ml-64 min-h-screen relative overflow-hidden flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-stone-950/70 backdrop-blur-xl flex items-center justify-between w-full px-4 md:px-8 h-16 md:h-20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <MobileSidebarWrapper accentColor="primary">
              {navItems}
            </MobileSidebarWrapper>
            <div className="hidden sm:block flex-1 max-w-sm">
              <TranslatedSearchInput
                action="/jobs/browse"
                placeholderKey="dashboardLayout.searchOpportunities"
                ringClass="focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <NotificationBell userId={Number(profile?.id)} userAuthId={authUser?.id!} userType={profile?.user_type!} />
            <Link href="/dashboard/settings" className="hidden md:block p-2 text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </Link>
            <Link href="/dashboard/seeker?s=profile" scroll={false}>
              <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-primary/20 p-0.5 bg-surface-container-highest flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url as string} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-primary font-bold bg-surface-container-lowest text-sm">
                    {profile?.full_name?.charAt(0) || authUser?.email?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 md:p-10 space-y-8 md:space-y-12 max-w-[1400px] mx-auto w-full">
          {children}
        </div>

        <div className="fixed bottom-10 right-10 opacity-5 pointer-events-none select-none z-[-1]">
          <span className="material-symbols-outlined text-[30rem]" style={{ fontVariationSettings: "'FILL' 0" }}>apartment</span>
        </div>
      </main>
    </div>
  )
}
