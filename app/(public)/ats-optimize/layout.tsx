import { tryGetAuth } from '@/lib/auth-utils'
import Link from 'next/link'

export default async function ATSOptimizeLayout({ children }: { children: React.ReactNode }) {
  const auth = await tryGetAuth()

  // Not logged in — show paywall with sign-in prompt
  if (!auth.ok) {
    return <ATSPaywall reason="signin" />
  }

  const { profile } = auth

  // Check subscription: active Elite or Enterprise plan, or admin bypass
  const hasAccess =
    profile?.role === 'admin' ||
    profile?.subscription_status === 'active'

  if (!hasAccess) {
    return <ATSPaywall reason="upgrade" userName={profile?.full_name} />
  }

  return <>{children}</>
}

function ATSPaywall({ reason, userName }: { reason: 'signin' | 'upgrade'; userName?: string | null }) {
  const isSignin = reason === 'signin'

  return (
    <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-primary">workspace_premium</span>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <p className="text-xs font-black tracking-[0.3em] uppercase text-primary">Elite Feature</p>
          <h1 className="text-3xl font-black italic text-on-surface">
            ATS CV Optimizer
          </h1>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {isSignin
              ? 'Sign in to access the AI-powered ATS Optimizer and maximize your interview chances.'
              : `${userName ? `Hi ${userName.split(' ')[0]}, this` : 'This'} feature is available on the Elite plan. Upgrade to unlock AI-powered CV analysis, keyword matching, and interview optimization.`}
          </p>
        </div>

        {/* Features list */}
        {!isSignin && (
          <div className="bg-surface-container rounded-2xl border border-outline-variant/20 p-6 text-left space-y-3">
            <p className="text-xs font-bold tracking-widest uppercase text-on-surface-variant mb-4">What you unlock</p>
            {[
              ['psychology', 'AI-powered CV analysis against job descriptions'],
              ['analytics', 'ATS keyword scoring and match percentage'],
              ['edit_note', 'Tailored improvement suggestions'],
              ['upload_file', 'PDF & text file upload support'],
              ['batch_prediction', 'Batch optimization for multiple roles'],
            ].map(([icon, label]) => (
              <div key={icon} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">{icon}</span>
                <span className="text-sm text-on-surface-variant">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isSignin ? (
            <>
              <Link
                href="/sign-in"
                className="px-8 py-3.5 rounded-xl bg-primary text-on-primary font-bold text-sm tracking-wide hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
              <Link
                href="/join"
                className="px-8 py-3.5 rounded-xl border border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:bg-white/5 transition-colors"
              >
                Create Account
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard/seeker/subscription"
                className="px-8 py-3.5 rounded-xl bg-primary text-on-primary font-bold text-sm tracking-wide hover:opacity-90 transition-opacity"
              >
                Upgrade to Elite
              </Link>
              <Link
                href="/dashboard/seeker"
                className="px-8 py-3.5 rounded-xl border border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:bg-white/5 transition-colors"
              >
                Back to Dashboard
              </Link>
            </>
          )}
        </div>

        {/* Price hint */}
        {!isSignin && (
          <p className="text-xs text-on-surface-variant/50">
            Elite plan from <strong className="text-on-surface-variant">19 SAR/month</strong> · Cancel anytime
          </p>
        )}
      </div>
    </div>
  )
}
