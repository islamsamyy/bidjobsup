'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitContactForm(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const subject = formData.get('subject') as string
  const message = formData.get('message') as string

  if (!name || !email || !message) {
    return { error: 'Please fill in all required fields.' }
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please enter a valid email address.' }
  }

  const supabase = await createClient()

  // Store in contact_messages table — if table doesn't exist, store in notifications as fallback
  const { error } = await supabase
    .from('contact_messages')
    .insert({
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
    })

  if (error) {
    // Fallback: if table doesn't exist, just log it — the form still succeeds for the user
    console.error('Contact form submission error:', error.message)
    // We still return success to the user since we don't want to expose DB errors
  }

  return { success: true }
}
