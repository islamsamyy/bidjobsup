'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getDisputeDetails, addDisputeMessage, updateDisputeStatus } from '@/lib/actions/disputes'
import { Star } from 'lucide-react'

interface DisputeDetail {
  dispute: any
  evidence: any[]
  messages: any[]
}

const STATUS_CONFIG = {
  open: { label: 'Open', color: 'bg-blue-500/20 text-blue-600 border-blue-500/30', icon: 'mail' },
  in_review: { label: 'In Review', color: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30', icon: 'assignment' },
  resolved: { label: 'Resolved', color: 'bg-green-500/20 text-green-600 border-green-500/30', icon: 'check_circle' },
  escalated: { label: 'Escalated', color: 'bg-red-500/20 text-red-600 border-red-500/30', icon: 'warning' },
  closed: { label: 'Closed', color: 'bg-gray-500/20 text-gray-600 border-gray-500/30', icon: 'done' },
}

const REASON_LABELS = {
  quality_issue: 'Quality Issue',
  missed_deadline: 'Missed Deadline',
  non_payment: 'Non-Payment',
  scope_change: 'Scope Change',
  communication: 'Communication',
  other: 'Other',
}

export default function DisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [detail, setDetail] = useState<DisputeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [messageText, setMessageText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resolution, setResolution] = useState('')
  const [resolving, setResolving] = useState(false)
  const [id, setId] = useState<string>('')

  useEffect(() => {
    const initPage = async () => {
      const p = await params
      setId(p.id)
    }
    initPage()
  }, [params])

  useEffect(() => {
    if (!id) return

    const loadDisputeDetails = async () => {
      try {
        const stored = localStorage.getItem('currentUser')
        if (stored) {
          const user = JSON.parse(stored)
          setCurrentUserId(user?.id)

          const result = await getDisputeDetails(parseInt(id))
          if (!result.error && result.dispute) {
            setDetail({
              dispute: result.dispute,
              evidence: result.evidence,
              messages: result.messages,
            })
            setResolution(result.dispute.resolution || '')
          }
        }
      } catch (err) {
        console.error('Error loading dispute:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDisputeDetails()
  }, [id])

  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !detail) return

    setIsSubmitting(true)
    try {
      const result = await addDisputeMessage(detail.dispute.id, messageText)
      if (result.success) {
        setMessageText('')
        // Reload dispute details
        const reloadResult = await getDisputeDetails(detail.dispute.id)
        if (!reloadResult.error && reloadResult.dispute) {
          setDetail({
            dispute: reloadResult.dispute,
            evidence: reloadResult.evidence,
            messages: reloadResult.messages,
          })
        }
      }
    } catch (err) {
      console.error('Error adding message:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResolveDispute = async () => {
    if (!resolution.trim() || !detail) return

    setResolving(true)
    try {
      const result = await updateDisputeStatus(detail.dispute.id, 'resolved', resolution)
      if (result.success) {
        // Reload dispute details
        const reloadResult = await getDisputeDetails(detail.dispute.id)
        if (!reloadResult.error && reloadResult.dispute) {
          setDetail({
            dispute: reloadResult.dispute,
            evidence: reloadResult.evidence,
            messages: reloadResult.messages,
          })
        }
      }
    } catch (err) {
      console.error('Error resolving dispute:', err)
    } finally {
      setResolving(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          hourglass_top
        </span>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-12 text-center">
        <p className="text-on-surface-variant">Dispute not found</p>
        <Link
          href="/dashboard/disputes"
          className="mt-4 inline-block px-6 py-3 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
        >
          Back to Disputes
        </Link>
      </div>
    )
  }

  const dispute = detail.dispute
  const isInitiator = dispute.initiated_by === currentUserId
  const otherParty = isInitiator ? dispute.defendant : dispute.initiator
  const statusConfig = STATUS_CONFIG[dispute.status as keyof typeof STATUS_CONFIG]
  const reasonLabel = REASON_LABELS[dispute.reason as keyof typeof REASON_LABELS] || dispute.reason

  return (
    <main className="max-w-4xl mx-auto px-8 py-12">
      {/* Back Link */}
      <Link
        href="/dashboard/disputes"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-8 group"
      >
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
          arrow_back
        </span>
        <span className="text-xs font-bold uppercase tracking-widest">Back to Disputes</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-on-surface mb-2">{dispute.title}</h1>
            <p className="text-on-surface-variant">
              Dispute #{dispute.id} • {formatDate(dispute.created_at)}
            </p>
          </div>
          <div
            className={`px-6 py-3 rounded-xl border text-sm font-bold uppercase tracking-widest ${
              statusConfig?.color
            }`}
          >
            {statusConfig?.label || dispute.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Details */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-8">
            <h2 className="text-2xl font-bold text-on-surface mb-6">Details</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  Description
                </h3>
                <p className="text-on-surface leading-relaxed">{dispute.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Reason
                  </h3>
                  <p className="text-on-surface font-bold">{reasonLabel}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Job
                  </h3>
                  <p className="text-on-surface font-bold">{dispute.job?.title || 'Unknown Job'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Other Party */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-8">
            <h2 className="text-2xl font-bold text-on-surface mb-6">
              {isInitiator ? 'Defendant' : 'Plaintiff'}
            </h2>

            <div className="flex items-center gap-4">
              {otherParty?.avatar_url && (
                <img
                  src={otherParty.avatar_url}
                  alt={otherParty.full_name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div>
                <p className="text-on-surface font-bold text-lg">{otherParty?.full_name}</p>
                <p className="text-on-surface-variant text-sm">
                  {isInitiator ? 'Dispute is against this party' : 'This party initiated the dispute'}
                </p>
              </div>
            </div>
          </div>

          {/* Evidence */}
          {detail.evidence.length > 0 && (
            <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-8">
              <h2 className="text-2xl font-bold text-on-surface mb-6">Evidence ({detail.evidence.length})</h2>

              <div className="space-y-4">
                {detail.evidence.map((evidence) => (
                  <div key={evidence.id} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border border-white/5">
                    <div className="flex-1">
                      <p className="font-bold text-on-surface">{evidence.file_name}</p>
                      {evidence.description && (
                        <p className="text-sm text-on-surface-variant mt-1">{evidence.description}</p>
                      )}
                    </div>
                    <a
                      href={evidence.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-8">
            <h2 className="text-2xl font-bold text-on-surface mb-6">Discussion</h2>

            <div className="space-y-6 mb-8 max-h-96 overflow-y-auto">
              {detail.messages.length === 0 ? (
                <p className="text-on-surface-variant text-center py-8">No messages yet</p>
              ) : (
                detail.messages.map((msg) => (
                  <div key={msg.id} className="p-4 bg-surface-container-lowest rounded-lg border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      {msg.user?.avatar_url && (
                        <img
                          src={msg.user?.avatar_url}
                          alt={msg.user?.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-on-surface font-bold text-sm">{msg.user?.full_name}</p>
                        <p className="text-xs text-on-surface-variant">{formatDate(msg.created_at)}</p>
                      </div>
                    </div>
                    <p className="text-on-surface text-sm">{msg.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Message Form */}
            {dispute.status !== 'closed' && (
              <form onSubmit={handleAddMessage} className="space-y-4 border-t border-white/5 pt-6">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value.slice(0, 2000))}
                  placeholder="Add a message to the dispute discussion..."
                  rows={3}
                  className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 transition-all outline-none text-xs resize-none"
                />
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-on-surface-variant">{messageText.length}/2000</p>
                  <button
                    type="submit"
                    disabled={isSubmitting || !messageText.trim()}
                    className="px-6 py-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resolve Section */}
          {dispute.status !== 'resolved' && dispute.status !== 'closed' && isInitiator && (
            <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6 sticky top-20">
              <h3 className="text-lg font-bold text-on-surface mb-4">Resolve Dispute</h3>

              <div className="space-y-4">
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value.slice(0, 1000))}
                  placeholder="Describe the resolution or agreement reached..."
                  rows={4}
                  className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 transition-all outline-none text-xs resize-none"
                />
                <p className="text-[10px] text-on-surface-variant">{resolution.length}/1000</p>
                <button
                  onClick={handleResolveDispute}
                  disabled={resolving || !resolution.trim()}
                  className="w-full px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  {resolving ? 'Resolving...' : 'Mark as Resolved'}
                </button>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">
              Dispute Info
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Initiated By</p>
                <p className="text-on-surface font-bold mt-1">{dispute.initiator?.full_name}</p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Status</p>
                <p className="text-on-surface font-bold mt-1 capitalize">{dispute.status}</p>
              </div>

              {dispute.resolution && (
                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Resolution</p>
                  <p className="text-on-surface text-sm mt-2">{dispute.resolution}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
