'use client'

import { useLanguage } from '@/app/providers/LanguageProvider'
import StripeCheckoutButton from '@/components/features/StripeCheckoutButton'

interface Plan {
  name: string
  price: string
  description: string
  features: string[]
  isCurrent: boolean
  recommended?: boolean
  color: string
  icon: string
  planId: string | null
}

interface SubscriptionClientProps {
  plans: Plan[]
}

export function SubscriptionClient({ plans }: SubscriptionClientProps) {
  const { t } = useLanguage()

  return (
    <main className="max-w-7xl mx-auto px-8 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-5%] left-[-2%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="mb-24 text-center space-y-6">
        <h2 className="font-headline text-7xl font-black italic text-on-surface leading-tight">
          {t('dashboardPages.subscription.careerAmplified')} <br />
          <span className="text-primary">{t('dashboardPages.subscription.amplified')}</span>
        </h2>
        <p className="text-on-surface-variant font-body max-w-2xl mx-auto text-lg italic opacity-80 leading-relaxed">
          {t('dashboardPages.subscription.unlockFull')}
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`
              bg-surface-container rounded-[3rem] p-12 border transition-all duration-500 flex flex-col justify-between group
              ${
                plan.recommended
                  ? 'border-primary/40 shadow-[0_32px_64px_rgba(202,162,247,0.15)] scale-105 z-20'
                  : 'border-outline-variant/10 opacity-80 hover:opacity-100'
              }
            `}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] font-black uppercase tracking-[0.3em] px-8 py-2 rounded-full shadow-xl">
                {t('dashboardPages.subscription.recommended')}
              </div>
            )}

            <div className="space-y-8">
              <div
                className={`w-16 h-16 rounded-2xl bg-stone-900 border border-${plan.color}/20 flex items-center justify-center text-${plan.color}`}
              >
                <span
                  className="material-symbols-outlined text-3xl"
                  style={plan.recommended ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {plan.icon}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-headline font-black italic text-on-surface">{t(`dashboardPages.subscription.${plan.name.replace(/\s+/g, '')}Name`)}</h3>
                <p className="text-sm text-on-surface-variant font-body leading-relaxed italic opacity-80">
                  {t(`dashboardPages.subscription.${plan.name.replace(/\s+/g, '')}Desc`)}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-headline font-black italic text-${plan.color}`}>
                    SAR {plan.price}
                  </span>
                  {plan.price !== 'Custom' && (
                    <span className="text-stone-500 font-black uppercase tracking-widest text-[10px]">
                      {t('dashboardPages.subscription.perMonth')}
                    </span>
                  )}
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm font-bold text-on-surface-variant">
                      <span
                        className={`material-symbols-outlined text-lg text-${plan.color}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12">
              {plan.isCurrent ? (
                <button className="w-full py-5 rounded-2xl border border-outline-variant/20 text-stone-500 font-black uppercase tracking-widest text-[10px] cursor-default bg-stone-900/40">
                  {t('dashboardPages.subscription.currentProtocol')}
                </button>
              ) : plan.planId ? (
                <StripeCheckoutButton
                  planId={plan.planId}
                  label={t('dashboardPages.subscription.initializeUpgrade')}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100
                    ${
                      plan.name === 'Elite Professional'
                        ? 'bg-primary text-on-primary shadow-primary/20'
                        : 'bg-stone-800 text-stone-300 border border-outline-variant/10'
                    }
                  `}
                />
              ) : (
                <a
                  href="/contact"
                  className="block w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] text-center bg-stone-800 text-stone-300 border border-outline-variant/10 hover:bg-stone-700 transition-all"
                >
                  {t('dashboardPages.subscription.contactSales')}
                </a>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-40 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="p-12 rounded-[3rem] bg-surface-container border border-outline-variant/10 shadow-2xl space-y-6 relative overflow-hidden group">
          <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            bolt
          </span>
          <h4 className="text-3xl font-headline font-black italic text-on-surface">
            {t('dashboardPages.subscription.universalCV')}
          </h4>
          <p className="text-on-surface-variant text-sm font-body italic opacity-80 leading-relaxed">
            {t('dashboardPages.subscription.universalCVDesc')}
          </p>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 blur-[80px] pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
        </div>
        <div className="p-12 rounded-[3rem] bg-surface-container border border-outline-variant/10 shadow-2xl space-y-6 relative overflow-hidden group">
          <span className="material-symbols-outlined text-4xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
            visibility
          </span>
          <h4 className="text-3xl font-headline font-black italic text-on-surface">
            {t('dashboardPages.subscription.prioritySignal')}
          </h4>
          <p className="text-on-surface-variant text-sm font-body italic opacity-80 leading-relaxed">
            {t('dashboardPages.subscription.prioritySignalDesc')}
          </p>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-secondary/5 blur-[80px] pointer-events-none group-hover:bg-secondary/10 transition-colors"></div>
        </div>
      </section>

      <footer className="mt-32 pt-12 border-t border-outline-variant/10 text-center space-y-4">
        <p className="text-[10px] text-stone-600 font-black uppercase tracking-[0.2em]">
          {t('dashboardPages.subscription.billingGov')}
        </p>
        <div className="flex justify-center gap-8 text-[9px] font-black uppercase tracking-widest text-stone-500">
          <a href="/terms" className="hover:text-primary transition-colors">
            {t('dashboardPages.subscription.integrityTerms')}
          </a>
          <a href="/terms" className="hover:text-primary transition-colors">
            {t('dashboardPages.subscription.privacyShield')}
          </a>
          <a href="/terms" className="hover:text-primary transition-colors">
            {t('dashboardPages.subscription.refundProtocol')}
          </a>
        </div>
      </footer>
    </main>
  )
}
