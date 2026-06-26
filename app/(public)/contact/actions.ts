'use server'

import { Resend } from 'resend'

const SUPPORT_EMAIL = process.env.CONTACT_SUPPORT_EMAIL || 'support@bidjobs.io'
const FROM = process.env.EMAIL_FROM || 'BidJobs <noreply@bidjobs.io>'

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendContactEmail(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const name = (formData.get('name') as string || '').trim()
  const email = (formData.get('email') as string || '').trim()
  const subject = (formData.get('subject') as string || 'General Inquiry').trim()
  const message = (formData.get('message') as string || '').trim()

  if (!name || !email || !message) {
    return { success: false, error: 'Name, email, and message are required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  const resend = getResend()
  if (!resend) {
    // Dev / missing key — pretend success silently
    return { success: true }
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: SUPPORT_EMAIL,
      replyTo: email,
      subject: `[BidJobs Contact] ${subject} — from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#100d10;color:#faf1f5;padding:32px;border-radius:16px;">
          <h2 style="color:#caa2f7;margin:0 0 24px;">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#b0a9ad;font-size:12px;width:100px;">Name</td><td style="padding:8px 0;font-size:14px;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#b0a9ad;font-size:12px;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${email}" style="color:#caa2f7;">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#b0a9ad;font-size:12px;">Subject</td><td style="padding:8px 0;font-size:14px;">${subject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #292428;margin:24px 0;"/>
          <h3 style="color:#b0a9ad;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">Message</h3>
          <p style="font-size:14px;line-height:1.7;color:#faf1f5;white-space:pre-wrap;">${message}</p>
        </div>
      `,
    })
    return { success: true }
  } catch (err) {
    console.error('[Contact Form] Resend error:', err)
    return { success: false, error: 'Failed to send message. Please try again.' }
  }
}
