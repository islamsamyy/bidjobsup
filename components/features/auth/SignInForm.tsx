'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { useLanguage } from '@/app/providers/LanguageProvider'

interface SignInFormProps {
  initialMessage?: string
}

export default function SignInForm({ initialMessage }: SignInFormProps) {
  const { t, dir } = useLanguage()
  const [serverError, setServerError] = useState<string | null>(initialMessage || null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setServerError(null)

    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)

    try {
      const { login } = await import('@/app/(auth)/actions')
      await login(formData)
    } catch (err: any) {
      // Server actions that redirect will throw a NEXT_REDIRECT — that's fine.
      // Other errors are genuine failures.
      if (err?.message && !err.message.includes('NEXT_REDIRECT')) {
        setServerError(err.message || 'An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass border border-outline-variant/15 rounded-xl p-10 md:p-12 shadow-[0_32px_64px_rgba(0,0,0,0.5)]" dir={dir}>
      <div className="mb-10 text-center md:text-left">
        <h1 className="font-headline text-4xl text-on-surface mb-3 tracking-tight">
          {t('auth.signIn')}
        </h1>
        <p className="text-on-surface-variant font-body text-sm tracking-wide leading-relaxed">
          {t('auth.haveAccount') || 'Access the exclusive Vision 2030 talent ecosystem. Your next architectural milestone awaits.'}
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium text-center animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="material-symbols-outlined text-sm mr-2 align-middle">error</span>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            className="block font-body text-[10px] uppercase tracking-[0.2em] text-on-surface-variant px-1"
            htmlFor="email"
          >
            {t('forms.labels.email')}
          </label>
          <div className="relative group">
            <input
              className={`input-inset w-full transition-all ${errors.email ? 'border-error/50 focus:border-error' : ''}`}
              id="email"
              placeholder={t('forms.placeholders.email')}
              type="email"
              autoComplete="email"
              {...register('email')}
            />
            <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          {errors.email && (
            <p className="text-error text-[10px] uppercase tracking-widest px-1 animate-in fade-in duration-200">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label
              className="block font-body text-[10px] uppercase tracking-[0.2em] text-on-surface-variant px-1"
              htmlFor="password"
            >
              {t('forms.labels.password')}
            </label>
            <Link
              className="text-secondary text-[10px] uppercase tracking-widest hover:text-primary transition-colors duration-300"
              href="/forgot-password"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>
          <div className="relative group">
            <input
              className={`input-inset w-full transition-all ${errors.password ? 'border-error/50 focus:border-error' : ''}`}
              id="password"
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              {...register('password')}
            />
            <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          {errors.password && (
            <p className="text-error text-[10px] uppercase tracking-widest px-1 animate-in fade-in duration-200">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Primary Action */}
        <button
          className="btn-gradient w-full py-4 text-xs tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              {t('common.loading')}
            </>
          ) : (
            t('buttons.signIn')
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-10">
        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-outline-variant/20 to-outline-variant/40" />
        <span className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant/40">
          {dir === 'rtl' ? 'أو استمر باستخدام' : 'Or continue with'}
        </span>
        <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-outline-variant/20 to-outline-variant/40" />
      </div>

      {/* Social Logins (decorative for now) */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <button
          type="button"
          className="flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-surface-container hover:bg-surface-bright border border-outline-variant/10 transition-colors duration-300 group"
        >
          <div className="w-5 h-5 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
            <svg className="w-full h-full fill-on-surface" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </div>
          <span className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant">
            Google
          </span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-surface-container hover:bg-surface-bright border border-outline-variant/10 transition-colors duration-300 group"
        >
          <div className="w-5 h-5 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
            <svg className="w-full h-full fill-on-surface" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </div>
          <span className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant">
            LinkedIn
          </span>
        </button>
      </div>

      {/* Footer Link */}
      <p className="text-center font-body text-xs text-on-surface-variant/60 tracking-wide">
        {t('auth.noAccount')}{' '}
        <Link
          className="text-secondary font-semibold hover:text-primary transition-colors ml-1 underline decoration-secondary/20 underline-offset-4"
          href="/join"
        >
          {t('buttons.createAccount')}
        </Link>
      </p>
    </div>
  )
}
