import { getAuthUserAs } from '@/lib/auth-utils'
import Link from 'next/link'
import { LogoutButton } from '../components/LogoutButton'
import { SidebarLink } from '../components/SidebarLink'
import { SidebarLinkParam } from '../components/SidebarLinkParam'
import { SidebarHeading, PostNewRoleButton, TranslatedSearchInput } from '../components/TranslatedText'
import NotificationBell from '@/components/features/NotificationBell'
import { ThemeSwitcher } from '@/components/features/ThemeSwitcher'
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher'
import { MobileSidebarWrapper } from '../components/MobileSidebar'

const BASE = '/dashboard/employer'

export default async function EmployerDashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile, user: authUser } = await getAuthUserAs('employer')

  const navItems = (
    <>
      <div className="mb-6 px-4 pt-2">
        <Link href="/">
          <img src="/logo.png" alt="BidJobs Logo" className="h-8 w-auto mb-2 drop-shadow-[0_0_8px_rgba(202,162,247,0.4)]" />
        </Link>
        <SidebarHeading textKey="dashboardLayout.enterpriseDashboard" />
      </div>

      <nav className="flex flex-col gap-1 grow">
        <SidebarLinkParam basePath={BASE} paramValue="overview" isDefault icon="dashboard" labelKey="dashboardLayout.dashboard" accentColor="secondary" />
        <SidebarLinkParam basePath={BASE} paramValue="profile" icon="corporate_fare" labelKey="dashboardLayout.companyProfile" accentColor="secondary" />
        <SidebarLinkParam basePath={BASE} paramValue="listings" icon="work" labelKey="dashboardLayout.manageRoles" accentColor="secondary" />
        <SidebarLinkParam basePath={BASE} paramValue="contracts" icon="handshake" labelKey="dashboardLayout.contracts" accentColor="secondary" />
        <SidebarLinkParam basePath={BASE} paramValue="interviews" icon="event" labelKey="dashboardLayout.interviews" accentColor="secondary" />
        <SidebarLinkParam basePath={BASE} paramValue="payments" icon="payments" labelKey="dashboardLayout.payments" accentColor="secondary" />
        <SidebarLinkParam basePath={BASE} paramValue="reviews" icon="star" labelKey="dashboardLayout.reviews" accentColor="secondary" />
        <SidebarLinkParam basePath={BASE} paramValue="disputes" icon="gavel" labelKey="dashboardLayout.disputes" accentColor="secondary" />
        <SidebarLinkParam basePath={BASE} paramValue="messages" icon="forum" labelKey="dashboardLayout.messages" accentColor="secondary" />
        <SidebarLinkParam basePath={BASE} paramValue="talent" icon="groups" labelKey="dashboardLayout.talentPool" accentColor="secondary" />
        <SidebarLinkParam basePath={BASE} paramValue="billing" icon="receipt_long" labelKey="dashboardLayout.billingPlans" accentColor="secondary" />
        <SidebarLinkParam basePath={BASE} paramValue="notifications" icon="notifications" labelKey="dashboardLayout.notifications" accentColor="secondary" />
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant/10 pt-6">
        {profile?.role === 'admin' && (
          <SidebarLink href="/admin" icon="admin_panel_settings" labelKey="dashboardLayout.adminPanel" accentColor="secondary" />
        )}
        <PostNewRoleButton />
        <SidebarLink href="/dashboard/settings" icon="settings" labelKey="dashboardLayout.settings" accentColor="secondary" />
        <SidebarLink href="/contact" icon="help" labelKey="dashboardLayout.prioritySupport" accentColor="secondary" />
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
            <MobileSidebarWrapper accentColor="secondary">
              {navItems}
            </MobileSidebarWrapper>
            <div className="hidden sm:block flex-1 max-w-sm">
              <TranslatedSearchInput
                action="/dashboard/employer?s=talent"
                placeholderKey="dashboardLayout.searchTalentPool"
                ringClass="focus:ring-secondary/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <NotificationBell userId={Number(profile?.id)} userAuthId={authUser?.id ?? ''} userType={profile?.user_type ?? 'employer'} />
            <Link href="/dashboard/settings" className="hidden md:block p-2 text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </Link>
            <Link href="/dashboard/employer?s=profile">
              <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-secondary/20 p-0.5 bg-surface-container-highest flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url as string} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-secondary font-bold bg-surface-container-lowest text-sm">
                    {profile?.full_name?.charAt(0) || authUser?.email?.charAt(0) || 'C'}
                  </div>
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-10 space-y-8 md:space-y-12 max-w-[1400px] mx-auto w-full">
          {children}
        </div>

        <div className="fixed bottom-10 right-10 opacity-5 pointer-events-none select-none z-[-1]">
          <span className="material-symbols-outlined text-[30rem]" style={{ fontVariationSettings: "'FILL' 0" }}>architecture</span>
        </div>
      </main>
    </div>
  )
}
