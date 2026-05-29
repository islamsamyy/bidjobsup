'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/sign-in?message=${encodeURIComponent(error.message)}`)
  }

  // Get user's role to redirect to correct dashboard
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('user_type')
      .eq('auth_id', user.id)
      .single()

    revalidatePath('/', 'layout')
    if (profile?.user_type === 'employer') {
      redirect('/dashboard/employer')
    } else {
      redirect('/dashboard/seeker')
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard/seeker')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string
  const userType = (formData.get('userType') as string) || 'jobseeker'
  // Normalize tos to boolean — HTML checkbox sends 'on', we also accept 'true'
  const tosRaw = formData.get('tos') as string | null
  const tosAccepted = tosRaw === 'true' || tosRaw === 'on'

  if (!tosAccepted) {
    redirect(`/sign-up?message=${encodeURIComponent('You must accept the Terms of Service')}`)
  }

  // 1. Create user in Supabase Auth with metadata
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
        user_type: userType,
      }
    }
  })

  if (signUpError) {
    if (signUpError.message.includes('already registered')) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        redirect(`/sign-in?message=${encodeURIComponent(signInError.message)}`)
      }

      // Get user's role to redirect to correct dashboard
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('user_type')
          .eq('auth_id', user.id)
          .single()

        revalidatePath('/', 'layout')
        if (profile?.user_type === 'employer') {
          redirect('/dashboard/employer')
        } else {
          redirect('/dashboard/seeker')
        }
      }

      revalidatePath('/', 'layout')
      redirect('/dashboard/seeker')
    } else {
      console.error(signUpError)
      redirect(`/sign-up?message=${encodeURIComponent(signUpError.message)}`)
    }
  }

  // 2. Ensure profile row exists in users table (fallback if DB trigger didn't fire)
  if (signUpData?.user) {
    const { data: existingProfile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', signUpData.user.id)
      .single()

    if (!existingProfile) {
      await supabase.from('users').insert({
        auth_id: signUpData.user.id,
        email: email,
        full_name: fullName,
        phone: phone || null,
        user_type: userType,
      })
    }
  }

  // 3. Revalidate and redirect to role-based dashboard
  revalidatePath('/', 'layout')

  // Redirect to appropriate dashboard based on user type
  if (userType === 'employer') {
    redirect('/dashboard/employer')
  } else {
    redirect('/dashboard/seeker')
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
  })

  if (error) {
    redirect(`/forgot-password?message=${encodeURIComponent(error.message)}`)
  }

  redirect('/forgot-password?message=Check your email for the password reset link')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const newPassword = formData.get('new_password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (newPassword !== confirmPassword) {
    redirect('/reset-password?message=Passwords do not match')
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    redirect(`/reset-password?message=${encodeURIComponent(error.message)}`)
  }

  redirect('/sign-in?message=Password+updated+successfully')
}
