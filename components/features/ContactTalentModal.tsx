'use client'

import { useState } from 'react'
import { sendMessage } from '@/lib/actions/messages'
import { X } from 'lucide-react'

interface ContactTalentModalProps {
  talentId: number
  talentName: string
}

export default function ContactTalentModal({ talentId, talentName }: ContactTalentModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState<'message' | 'consultation'>('message')
  const [message, setMessage] = useState('')
  const [consultationDate, setConsultationDate] = useState('')
  const [consultationTime, setConsultationTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      setError('Please write a message')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await sendMessage(talentId, message)
      if (result.success) {
        setMessage('')
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          setIsOpen(false)
        }, 2000)
      } else {
        setError(result.error || 'Failed to send message')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestConsultation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consultationDate || !consultationTime) {
      setError('Please select a date and time')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const consultationMessage = `I'd like to schedule a consultation with you on ${consultationDate} at ${consultationTime}.`
      const result = await sendMessage(talentId, consultationMessage)
      if (result.success) {
        setConsultationDate('')
        setConsultationTime('')
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          setIsOpen(false)
        }, 2000)
      } else {
        setError(result.error || 'Failed to request consultation')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to request consultation')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mt-10 py-5 rounded-2xl bg-gradient-to-br from-[#caa2f7] to-[#613471] text-[#431f6b] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#caa2f7]/10 hover:brightness-110 active:scale-95 transition-all"
      >
        Book Consultation
      </button>
    )
  }

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#1c181c] border border-[#292428] rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#292428]">
            <div>
              <h3 className="text-xl font-bold text-[#faf1f5]">Contact {talentName}</h3>
              <p className="text-xs text-[#b0a9ad] mt-1">Get in touch with this specialist</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/5 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-[#b0a9ad]" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-b border-[#292428]">
            <button
              onClick={() => setTab('message')}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                tab === 'message'
                  ? 'text-[#caa2f7] border-b-2 border-[#caa2f7]'
                  : 'text-[#b0a9ad] hover:text-[#faf1f5]'
              }`}
            >
              Send Message
            </button>
            <button
              onClick={() => setTab('consultation')}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                tab === 'consultation'
                  ? 'text-[#caa2f7] border-b-2 border-[#caa2f7]'
                  : 'text-[#b0a9ad] hover:text-[#faf1f5]'
              }`}
            >
              Schedule Consultation
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {success && (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm text-center font-medium">
                ✓ Sent successfully!
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-error/10 border border-error/30 rounded-xl text-error text-sm text-center font-medium">
                {error}
              </div>
            )}

            {tab === 'message' ? (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#b0a9ad] mb-2">
                    Your Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    rows={5}
                    className="w-full bg-[#100d10] border border-[#292428] rounded-lg px-4 py-3 text-[#faf1f5] placeholder:text-[#4b474a] focus:border-[#caa2f7]/50 outline-none transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-[#caa2f7] to-[#613471] text-[#431f6b] font-bold text-xs uppercase tracking-widest rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRequestConsultation} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#b0a9ad] mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={consultationDate}
                    onChange={(e) => setConsultationDate(e.target.value)}
                    className="w-full bg-[#100d10] border border-[#292428] rounded-lg px-4 py-3 text-[#faf1f5] focus:border-[#caa2f7]/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#b0a9ad] mb-2">
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    value={consultationTime}
                    onChange={(e) => setConsultationTime(e.target.value)}
                    className="w-full bg-[#100d10] border border-[#292428] rounded-lg px-4 py-3 text-[#faf1f5] focus:border-[#caa2f7]/50 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-[#caa2f7] to-[#613471] text-[#431f6b] font-bold text-xs uppercase tracking-widest rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Requesting...' : 'Request Consultation'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
