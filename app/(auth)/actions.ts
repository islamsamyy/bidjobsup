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

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string
  const userType = (formData.get('userType') as string) || 'jobseeker'

  // 1. Attempt to Create/Get the user in Supabase Auth
  let authUser = null;

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (signUpError) {
    // If user already exists, try to sign in to verify identity
    if (signUpError.message.includes('already registered')) {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (signInError) {
        redirect(`/create-profile?message=${signInError.message}`)
      }
      authUser = signInData.user
    } else {
      console.error(signUpError)
      redirect(`/create-profile?message=${signUpError.message}`)
    }
  } else {
    authUser = signUpData.user
  }

  if (!authUser) {
    redirect('/create-profile?message=Identity verification failed')
  }

  // 2. Insert or update our custom public.users table (upsert to handle partial registration)
  const { error: userError } = await supabase
    .from('users')
    .upsert({
      auth_id: authUser.id,
      email: email,
      username: email.split('@')[0] + '-' + Math.floor(Math.random() * 1000), // fallback if missing
      full_name: fullName,
      phone: phone,
      user_type: userType,
    }, { onConflict: 'auth_id' })

  if (userError) {
    console.error('Profile Creation Error:', userError)
    redirect('/create-profile?message=Error creating profile details')
  }

  // 3. Revalidate and redirect to dashboard route center
  revalidatePath('/', 'layout')
  redirect('/dashboard')
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

  redirect('/sign-in?message=Password updated successfully')
}
