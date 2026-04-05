import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM || 'BidJobs <noreply@bidjobs.io>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bidjobs.io'

// ── Bid Status Changed ────────────────────────────────────────────────────────
export async function sendBidStatusEmail({
  to,
  recipientName,
  jobTitle,
  status,
  bidId,
}: {
  to: string
  recipientName: string
  jobTitle: string
  status: 'accepted' | 'rejected' | 'interview' | 'pending'
  bidId?: string
}) {
  const statusConfig: Record<typeof status, { subject: string; headline: string; color: string; message: string }> = {
    accepted: {
      subject: `Mission Accepted — ${jobTitle}`,
      headline: 'Your Bid Has Been Accepted',
      color: '#22c55e',
      message: 'Congratulations. The employer has accepted your bid. You may now coordinate the next steps directly via the messaging system.',
    },
    interview: {
      subject: `Interview Requested — ${jobTitle}`,
      headline: 'Interview Protocol Initiated',
      color: '#caa2f7',
      message: 'The employer has requested an interview with you. Check your dashboard for details and respond promptly to secure this mission.',
    },
    rejected: {
      subject: `Bid Update — ${jobTitle}`,
      headline: 'Bid Status Updated',
      color: '#ff6e84',
      message: 'The employer has reviewed your bid and decided to proceed with another candidate. Keep refining your profile and bidding on new opportunities.',
    },
    pending: {
      subject: `Bid Under Review — ${jobTitle}`,
      headline: 'Your Bid Is Under Review',
      color: '#eab3fa',
      message: 'Your bid is currently being reviewed by the employer. We will notify you of any updates.',
    },
  }

  const cfg = statusConfig[status]

  await resend.emails.send({
    from: FROM,
    to,
    subject: cfg.subject,
    html: emailTemplate({
      recipientName,
      headline: cfg.headline,
      color: cfg.color,
      body: cfg.message,
      ctaLabel: 'View My Applications',
      ctaUrl: `${SITE_URL}/dashboard/seeker/applications`,
    }),
  })
}

// ── New Message ───────────────────────────────────────────────────────────────
export async function sendNewMessageEmail({
  to,
  recipientName,
  senderName,
  preview,
  conversationId,
}: {
  to: string
  recipientName: string
  senderName: string
  preview: string
  conversationId: string
}) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `New Message from ${senderName}`,
    html: emailTemplate({
      recipientName,
      headline: 'Incoming Transmission',
      color: '#eab3fa',
      body: `<strong>${senderName}</strong> sent you a message:<br/><br/><em style="color:#b0a9ad">"${preview.slice(0, 120)}${preview.length > 120 ? '...' : ''}"</em>`,
      ctaLabel: 'Open Stream',
      ctaUrl: `${SITE_URL}/dashboard/messages/${conversationId}`,
    }),
  })
}

// ── New Bid Received (Employer) ───────────────────────────────────────────────
export async function sendNewBidEmail({
  to,
  recipientName,
  seekerName,
  jobTitle,
  jobId,
}: {
  to: string
  recipientName: string
  seekerName: string
  jobTitle: string
  jobId: string
}) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `New Bid on "${jobTitle}"`,
    html: emailTemplate({
      recipientName,
      headline: 'New Bid Received',
      color: '#caa2f7',
      body: `<strong>${seekerName}</strong> has submitted a bid on your role <strong>${jobTitle}</strong>. Review their proposal and decide on next steps.`,
      ctaLabel: 'Review Bid',
      ctaUrl: `${SITE_URL}/dashboard/employer/listings`,
    }),
  })
}

// ── HTML Template ─────────────────────────────────────────────────────────────
function emailTemplate({
  recipientName,
  headline,
  color,
  body,
  ctaLabel,
  ctaUrl,
}: {
  recipientName: string
  headline: string
  color: string
  body: string
  ctaLabel: string
  ctaUrl: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#100d10;font-family:'Plus Jakarta Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#100d10;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#1c181c;border-radius:24px;overflow:hidden;border:1px solid rgba(75,71,74,0.3);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#100d10,#1c181c);padding:40px 48px 32px;border-bottom:1px solid rgba(75,71,74,0.2);">
              <p style="margin:0;font-size:11px;font-weight:900;letter-spacing:0.3em;text-transform:uppercase;color:${color}">BidJobs Protocol</p>
              <h1 style="margin:12px 0 0;font-size:28px;font-weight:900;font-style:italic;color:#faf1f5;line-height:1.2;">${headline}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 48px;">
              <p style="margin:0 0 16px;font-size:14px;color:#b0a9ad;line-height:1.7;">
                Hi <strong style="color:#faf1f5;">${recipientName}</strong>,
              </p>
              <p style="margin:0 0 32px;font-size:14px;color:#b0a9ad;line-height:1.7;">${body}</p>
              <!-- CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:12px;overflow:hidden;background:${color};">
                    <a href="${ctaUrl}" style="display:inline-block;padding:16px 32px;font-size:11px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:#431f6b;text-decoration:none;">${ctaLabel}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;border-top:1px solid rgba(75,71,74,0.2);">
              <p style="margin:0;font-size:10px;color:#585457;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">
                BidJobs · Premium Talent Network · <a href="${SITE_URL}" style="color:#585457;">bidjobs.io</a>
              </p>
              <p style="margin:8px 0 0;font-size:10px;color:#3a3637;">
                You received this because you are a registered BidJobs member.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
