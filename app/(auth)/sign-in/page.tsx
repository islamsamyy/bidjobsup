import Link from 'next/link'
import SignInForm from '@/components/features/auth/SignInForm'

export const metadata = {
  title: 'Sign In | BidJobs — Vision 2030 Talent Ecosystem',
  description: 'Sign in to access the BidJobs platform and connect with exclusive Vision 2030 opportunities.',
}

export default async function SignInPage(props: { searchParams: Promise<{ message?: string }> }) {
  const searchParams = await props.searchParams
  const message = searchParams?.message

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-[#100d10]/70 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center animate-pulse-glow">
            <span
              className="material-symbols-outlined text-on-primary-fixed text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              domain
            </span>
          </div>
          <span className="text-2xl font-headline font-bold text-primary tracking-tight drop-shadow-[0_0_8px_rgba(202,162,247,0.2)]">
            BidJobs
          </span>
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link
            href="/contact"
            className="text-on-surface-variant font-body text-xs uppercase tracking-widest hover:text-primary transition-colors"
          >
            Support
          </Link>
        </div>
      </header>

      <main className="relative flex-grow flex items-center justify-center pt-20 pb-12 overflow-hidden">
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