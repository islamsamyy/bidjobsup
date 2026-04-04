import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from '../components/LogoutButton'

export default async function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Ensure authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/sign-in')
  }

  // Ensure right role
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', user.id)
    .single()

  if (!profile || (profile.user_type !== 'employer' && profile.user_type !== 'both')) {
    redirect('/dashboard') // Route back to the main router
  }

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      {/* SideNavBar Shell */}
      <aside className="h-screen w-64 fixed left-0 top-0 z-50 bg-stone-950/80 backdrop-blur-2xl shadow-[4px_0_24px_rgba(0,0,0,0.6)] flex flex-col py-8 px-4 gap-2 border-r border-outline-variant/10">
        <div className="mb-8 px-4">
          <Link href="/">
            <img src="/logo.png" alt="BidJobs Logo" className="h-8 w-auto mb-2 drop-shadow-[0_0_8px_rgba(202,162,247,0.4)]" />
          </Link>
          <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mt-1">Enterprise Dashboard</p>
        </div>
        
        <nav className="flex flex-col gap-1 grow">
          <Link className="bg-stone-800/50 text-secondary border-r-4 border-secondary rounded-r-lg px-4 py-3 flex items-center gap-3 transition-transform hover:translate-x-1 duration-200" href="/dashboard/employer">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>dashboard</span>
            <span className="text-sm font-medium tracking-wide">Dashboard</span>
          </Link>
          <Link className="text-on-surface-variant hover:text-on-surface px-4 py-3 flex items-center gap-3 transition-transform hover:translate-x-1 duration-200" href="/dashboard/employer/profile">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>corporate_fare</span>
            <span className="text-sm font-medium tracking-wide">Company Profile</span>
          </Link>
          <Link className="text-on-surface-variant hover:text-on-surface px-4 py-3 flex items-center gap-3 transition-transform hover:translate-x-1 duration-200" href="/dashboard/employer/listings">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>work</span>
            <span className="text-sm font-medium tracking-wide">Manage Roles</span>
          </Link>
          <Link className="text-on-surface-variant hover:text-on-surface px-4 py-3 flex items-center gap-3 transition-transform hover:translate-x-1 duration-200" href="/dashboard/messages">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>forum</span>
            <span className="text-sm font-medium tracking-wide">Messages</span>
          </Link>
          <Link className="text-on-surface-variant hover:text-on-surface px-4 py-3 flex items-center gap-3 transition-transform hover:translate-x-1 duration-200" href="/dashboard/employer/talent">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>groups</span>
            <span className="text-sm font-medium tracking-wide">Talent Pool</span>
          </Link>
          <Link className="text-on-surface-variant hover:text-on-surface px-4 py-3 flex items-center gap-3 transition-transform hover:translate-x-1 duration-200" href="/dashboard/employer/billing">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>receipt_long</span>
            <span className="text-sm font-medium tracking-wide">Billing & Plans</span>
          </Link>
        </nav>
        
        <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant/10 pt-6">
          <Link href="/dashboard/employer/post-job" className="text-center w-full bg-gradient-to-br from-secondary/80 to-secondary text-on-primary-container py-3 rounded-xl font-bold text-sm mb-4 shadow-lg shadow-secondary/10 hover:opacity-90 active:scale-95 transition-all">
            Post New Role
          </Link>
          
          <Link className="text-on-surface-variant hover:text-on-surface px-4 py-3 flex items-center gap-3 transition-transform hover:translate-x-1 duration-200" href="/contact">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>help</span>
            <span className="text-sm font-medium tracking-wide">Priority Support</span>
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="ml-64 min-h-screen relative overflow-hidden flex flex-col">
        {/* TopAppBar Shell */}
        <header className="sticky top-0 z-40 bg-stone-950/70 backdrop-blur-xl flex justify-between items-center w-full px-8 h-20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-6">
            <form action="/dashboard/employer/talent" className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input name="q" className="bg-surface-container-lowest border-none rounded-full pl-10 pr-6 py-2 text-sm w-80 focus:ring-2 focus:ring-secondary/50 transition-all outline-none" placeholder="Search talent pool..." type="search"/>
            </form>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/employer/notifications" className="p-2 text-on-surface-variant hover:text-on-surface transition-colors relative flex items-center justify-center">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1 right-2 w-2 h-2 bg-secondary rounded-full"></span>
              </Link>
              <Link href="/dashboard/employer/profile" className="p-2 text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined">settings</span>
              </Link>
            </div>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-secondary/20 p-0.5 bg-surface-container-highest flex items-center justify-center">
               {profile.avatar_url ? (
                 <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-full" />
               ) : (
                 <div className="w-full h-full rounded-full flex items-center justify-center text-secondary font-bold bg-surface-container-lowest">
                   {profile.full_name?.charAt(0) || profile.email?.charAt(0) || 'C'}
                 </div>
               )}
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 p-10 space-y-12 max-w-[1400px] mx-auto w-full">
          {children}
        </div>
        
        {/* Background Watermark */}
        <div className="fixed bottom-10 right-10 opacity-5 pointer-events-none select-none z-[-1]">
          <span className="material-symbols-outlined text-[30rem]" style={{fontVariationSettings: "'FILL' 0"}}>architecture</span>
        </div>
      </main>
    </div>
  )
}
