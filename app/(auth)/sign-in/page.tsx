import Link from 'next/link'
import SignInForm from '@/components/features/auth/SignInForm'
import { createClient } from '@/lib/supabase/server'
import PublicHeader from '@/components/layout/PublicHeader'

export const metadata = {
  title: 'Sign In | BidJobs — Vision 2030 Talent Ecosystem',
  description: 'Sign in to access the BidJobs platform and connect with exclusive Vision 2030 opportunities.',
}

export default async function SignInPage(props: { searchParams: Promise<{ message?: string }> }) {
  const searchParams = await props.searchParams
  const message = searchParams?.message

  // Fetch initial user state for header
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let initialProfile = null
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()
    initialProfile = data
  }

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      <PublicHeader initialUser={user} initialProfile={initialProfile} />

      <main className="relative flex-grow flex items-center justify-center pt-40 pb-12 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(202, 162, 247, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(202, 162, 247, 0.05) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-[480px] px-6">
          <SignInForm initialMessage={message} />

          {/* Contextual Decorative Asset */}
          <div className="mt-8 flex justify-center opacity-30">
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-8 bg-outline-variant" />
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontVariationSettings: "'wght' 200" }}
              >
                architecture
              </span>
              <div className="h-[1px] w-8 bg-outline-variant" />
            </div>
          </div>
        </div>
      </main>

      {/* Branding Footer */}
      <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#100d10] border-t border-[#292428]/15">
        <p className="font-body text-xs uppercase tracking-widest text-[#faf1f5]/40">
          © 2024 BidJobs. Vision 2030 Editorial.
        </p>
        <div className="flex gap-8">
          <Link
            className="font-body text-xs uppercase tracking-widest text-[#faf1f5]/40 hover:text-[#caa2f7] transition-opacity duration-300"
            href="/terms"
          >
            Privacy Policy
          </Link>
          <Link
            className="font-body text-xs uppercase tracking-widest text-[#faf1f5]/40 hover:text-[#caa2f7] transition-opacity duration-300"
            href="/terms"
          >
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  )
}