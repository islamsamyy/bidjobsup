import { getAuthUserAs } from '@/lib/auth-utils'
import ProfileForm from '../../seeker/profile/ProfileForm'

export default async function EmployerProfilePage() {
  const { profile } = await getAuthUserAs('employer')

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      
      {/* Cinematic Header for Employer */}
      <header className="mb-20 flex flex-col md:flex-row items-center md:items-end gap-12 text-center md:text-left relative">
        <div className="relative group/avatar">
          <div className="w-48 h-48 rounded-[2.5rem] bg-surface-container-highest border-4 border-surface shadow-[0_30px_70px_rgba(0,0,0,0.4)] relative z-10 overflow-hidden group-hover/avatar:scale-[1.02] transition-transform duration-500">
            {profile?.avatar_url ? (
              <img src={profile?.avatar_url as string} alt={profile?.full_name || ''} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-secondary-container">
                <span className="material-symbols-outlined text-[64px]">domain</span>
              </div>
            )}
            <div className="absolute inset-0 bg-secondary/20 blur-3xl opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
          <div className="absolute -inset-4 bg-secondary/10 blur-2xl rounded-full opacity-50 group-hover/avatar:blur-3xl transition-all"></div>
        </div>

        <div className="flex-grow space-y-4 pb-4">
          <h2 className="text-6xl font-headline font-black italic text-on-background leading-tight neon-glow">
            {profile?.full_name || 'Studio Narrative'}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
            <span className="text-secondary text-sm font-black tracking-widest uppercase">
               Premium Tier Studio
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-stone-700"></span>
            <span className="text-on-surface-variant font-bold text-sm tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {profile?.location || 'Global Operations'}
            </span>
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-4 border-l border-outline-variant/10 pl-12 h-24 justify-center">
          <div className="space-y-1">
            <p className="text-[10px] text-stone-600 font-black uppercase tracking-widest leading-none">Studio Rank</p>
            <p className="text-3xl font-headline font-black italic text-on-surface">Tier 1</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-stone-600 font-black uppercase tracking-widest leading-none">Brand Equity</p>
            <p className="text-3xl font-headline font-black italic text-secondary">Elite</p>
          </div>
        </div>
      </header>

      {/* Profile Form (Reusing the robust Seeker form logic) */}
      <section className="bg-surface-container-low rounded-[3rem] p-12 md:p-20 border border-outline-variant/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none origin-bottom-left transition-transform duration-1000"></div>
        <div className="relative z-10">
          <ProfileForm initialData={profile as any} />
        </div>
      </section>

      {/* Brand Context Footer */}
      <footer className="mt-20 pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between gap-8 opacity-50">
        <div className="flex items-center gap-4">
           <span className="material-symbols-outlined text-secondary text-3xl">verified</span>
           <div>
             <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest">Employer Protocol</p>
             <p className="text-xs font-bold text-on-surface">Secure Enterprise Node 4X.21</p>
           </div>
        </div>
        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest text-right max-w-xs leading-relaxed">
          Your studio identity is public to prospective talent. Ensure your mission narrative aligns with global brand standards.
        </p>
      </footer>
    </main>
  )
}