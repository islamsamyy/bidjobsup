'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { signupSchema, type SignupFormData } from '@/lib/validations/auth'
import { signup } from '@/app/(auth)/actions'

interface CreateProfileFormProps {
  initialMessage?: string
  defaultUserType?: 'jobseeker' | 'employer'
}

function PasswordStrengthBar({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const strength = checks.filter(Boolean).length
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colours = ['', 'bg-error', 'bg-amber-500', 'bg-yellow-400', 'bg-green-500']

  if (!password) return null

  return (
    <div className="space-y-1.5 animate-in fade-in duration-200">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= strength ? colours[strength] : 'bg-outline-variant/20'
            }`}
          />
        ))}
      </div>
      <p className={`text-[10px] uppercase tracking-widest font-bold ${
        strength <= 1 ? 'text-error' : strength === 2 ? 'text-amber-500' : strength === 3 ? 'text-yellow-400' : 'text-green-500'
      }`}>
        {labels[strength]}
      </p>
    </div>
  )
}

export default function CreateProfileForm({ initialMessage, defaultUserType = 'jobseeker' }: CreateProfileFormProps) {
  const [serverError, setServerError] = useState<string | null>(initialMessage || null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userType: defaultUserType as 'jobseeker' | 'employer',
      tos: false,
    },
  })

  const passwordValue = (watch('password') as string) ?? ''

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null)

    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('fullName', data.fullName)
    formData.append('phone', data.phone || '')
    formData.append('userType', data.userType)

    startTransition(async () => {
      signup(formData)
    })
  }

  return (
    <div className="bg-surface-container-low p-8 md:p-10 rounded-xl shadow-2xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-headline font-bold text-on-surface">Create Your Account</h2>
          <p className="text-on-surface-variant text-sm">Join the network as a specialist talent.</p>
        </div>

        {serverError && (
          <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium text-center animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="material-symbols-outlined text-sm mr-2 align-middle">error</span>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Hidden userType */}
          <input type="hidden" {...register('userType')} />

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold px-1">
              Full Name
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pr-4 border-r border-outline-variant/30">
                person
              </span>
              <input
                className={`input-inset w-full pl-[3.5rem] ${errors.fullName ? 'border-error/50' : ''}`}
                placeholder="Enter your full name"
                type="text"
                autoComplete="name"
                {...register('fullName')}
              />
            </div>
            {errors.fullName && (
              <p className="text-error text-[10px] uppercase tracking-widest px-1 animate-in fade-in duration-200">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold px-1">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pr-4 border-r border-outline-variant/30">
                mail
              </span>
              <input
                className={`input-inset w-full pl-[3.5rem] ${errors.email ? 'border-error/50' : ''}`}
                placeholder="name@company.com"
                type="email"
                autoComplete="email"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-error text-[10px] uppercase tracking-widest px-1 animate-in fade-in duration-200">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold px-1">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pr-4 border-r border-outline-variant/30">
                lock
              </span>
              <input
                className={`input-inset w-full pl-[3.5rem] pr-12 ${errors.password ? 'border-error/50' : ''}`}
                placeholder="••••••••"
                type="password"
                autoComplete="new-password"
                {...register('password')}
              />
            </div>
            <PasswordStrengthBar password={passwordValue || ''} />
            {errors.password && (
              <p className="text-error text-[10px] uppercase tracking-widest px-1 animate-in fade-in duration-200">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold px-1">
              Phone Number <span className="text-on-surface-variant/40 normal-case">(optional)</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pr-4 border-r border-outline-variant/30">
                call
              </span>
              <input
                className={`input-inset w-full pl-[3.5rem] ${errors.phone ? 'border-error/50' : ''}`}
                placeholder="+1 (555) 000-0000"
                type="tel"
                autoComplete="tel"
                {...register('phone')}
              />
            </div>
            {errors.phone && (
              <p className="text-error text-[10px] uppercase tracking-widest px-1 animate-in fade-in duration-200">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* TOS Checkbox */}
          <div className="flex items-start gap-3 px-1 pt-2">
            <input
              className="mt-1 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary focus:ring-offset-surface"
              id="tos"
              type="checkbox"
              {...register('tos')}
            />
            <label className="text-sm text-on-surface-variant leading-relaxed" htmlFor="tos">
              I agree to the{' '}
              <Link className="text-secondary hover:underline" href="/terms">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link className="text-secondary hover:underline" href="/terms">
                Privacy Policy
              </Link>
              .
            </label>
          </div>
          {errors.tos && (
            <p className="text-error text-[10px] uppercase tracking-widest px-1 -mt-4 animate-in fade-in duration-200">
              {errors.tos.message}
            </p>
          )}

          {/* Submit Button */}
          <button
            className="btn-gradient w-full flex justify-center items-center gap-2 text-xs tracking-widest uppercase py-4 disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/50">or register as</span>
          <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-outline-variant/30 to-transparent" />
        </div>

        {/* Switch to Employer */}
        <Link
          href="/join"
          className="w-full border border-outline-variant/20 hover:border-primary/50 text-on-surface py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all duration-300 group"
        >
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
            business
          </span>
          Looking to Hire? Switch to Employer
        </Link>

        <p className="text-center text-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link className="text-primary hover:underline font-bold" href="/sign-in">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
