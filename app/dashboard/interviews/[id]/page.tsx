'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  getInterviewDetails,
  updateInterviewStatus,
  addInterviewNote,
  updateInterviewMeeting,
  rescheduleInterview,
} from '@/lib/actions/interviews'
import { getCurrentUser } from '@/lib/actions/me'

interface Interview {
  id: number
  title: string
  description: string | null
  job_id: number
  scheduled_time: string
  duration_minutes: number
  status: string
  meeting_url: string | null
  meeting_platform: string | null
  feedback: string | null
  created_at: string
  freelancer_id: number
  employer_id: number
  job?: {
    title: string
  }
  freelancer?: {
    full_name: string
    avatar_url: string | null
  }
  employer?: {
    full_name: string
    avatar_url: string | null
  }
}

interface InterviewNote {
  id: number
  content: string
  user_id: number
  created_at: string
  user?: {
    full_name: string
  }
}

const STATUS_CONFIG = {
  scheduled: { label: 'Scheduled', color: 'bg-blue-500/20 text-blue-600 border-blue-500/30', icon: 'calendar_today' },
  confirmed: { label: 'Confirmed', color: 'bg-green-500/20 text-green-600 border-green-500/30', icon: 'check_circle' },
  in_progress: { label: 'In Progress', color: 'bg-purple-500/20 text-purple-600 border-purple-500/30', icon: 'schedule' },
  completed: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30', icon: 'verified' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-600 border-red-500/30', icon: 'cancel' },
  rescheduled: { label: 'Rescheduled', color: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30', icon: 'edit_calendar' },
}

export default function InterviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [interview, setInterview] = useState<Interview | null>(null)
  const [notes, setNotes] = useState<InterviewNote[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [newNote, setNewNote] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [showMeetingForm, setShowMeetingForm] = useState(false)
  const [meetingUrl, setMeetingUrl] = useState('')
  const [meetingPlatform, setMeetingPlatform] = useState('Google Meet')
  const [savingMeeting, setSavingMeeting] = useState(false)
  const [showRescheduleForm, setShowRescheduleForm] = useState(false)
  const [newScheduledTime, setNewScheduledTime] = useState('')
  const [rescheduling, setRescheduling] = useState(false)

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const { id } = await params
        const [me, result] = await Promise.all([
          getCurrentUser(),
          getInterviewDetails(parseInt(id)),
        ])
        if (me?.id) setCurrentUserId(me.id)

        if (!result.error) {
          setInterview(result.interview)
          setNotes(result.notes)
        }
      } catch (err) {
        console.error('Error loading interview:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDetails()
  }, [params])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          hourglass_top
        </span>
      </div>
    )
  }

  if (!interview) {
    return (
      <div className="text-center py-12">
        <p className="text-on-surface-variant mb-6">Interview not found</p>
        <Link href="/dashboard/interviews" className="text-primary hover:text-primary-container font-bold">
          Back to Interviews
        </Link>
      </div>
    )
  }

  const isFreelancer = currentUserId === interview.freelancer_id
  const isEmployer = currentUserId === interview.employer_id
  const otherParty = isFreelancer ? interview.employer : interview.freelancer
  const statusConfig = STATUS_CONFIG[interview.status as keyof typeof STATUS_CONFIG]

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    setAddingNote(true)
    const result = await addInterviewNote(interview.id, newNote)
    if (result.success) {
      setNotes([
        ...notes,
        {
          id: result.id || 0,
          content: newNote,
          user_id: currentUserId || 0,
          created_at: new Date().toISOString(),
          user: { full_name: 'You' },
        },
      ])
      setNewNote('')
    }
    setAddingNote(false)
  }

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true)
    const result = await updateInterviewStatus(interview.id, newStatus)
    if (result.success) {
      setInterview({ ...interview, status: newStatus })
    }
    setUpdatingStatus(false)
  }

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newScheduledTime) return

    setRescheduling(true)
    const result = await rescheduleInterview(interview.id, new Date(newScheduledTime).toISOString())
    if (result.success) {
      setInterview({
        ...interview,
        scheduled_time: new Date(newScheduledTime).toISOString(),
        status: 'rescheduled',
      })
      setShowRescheduleForm(false)
      setNewScheduledTime('')
    }
    setRescheduling(false)
  }

  const handleAddMeeting = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!meetingUrl.trim()) return

    setSavingMeeting(true)
    const result = await updateInterviewMeeting(interview.id, meetingUrl, meetingPlatform)
    if (result.success) {
      setInterview({
        ...interview,
        meeting_url: meetingUrl,
        meeting_platform: meetingPlatform,
      })
      setShowMeetingForm(false)
      setMeetingUrl('')
    }
    setSavingMeeting(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/dashboard/interviews"
        className="inline-flex items-center gap-2 text-primary hover:text-primary-container font-bold text-sm"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Interviews
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-on-surface mb-2">{interview.title}</h1>
            <p className="text-on-surface-variant">{interview.job?.title || 'Job'}</p>
          </div>
          <span className={`px-4 py-2 rounded-lg border text-sm font-bold flex items-center gap-1 ${statusConfig?.color}`}>
            <span className="material-symbols-outlined text-sm">{statusConfig?.icon}</span>
            {statusConfig?.label || interview.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
              <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-2">
                Scheduled Time
              </p>
              <p className="text-lg font-bold text-primary mb-1">
                {formatDate(interview.scheduled_time)}
              </p>
            </div>

            <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
              <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-2">
                Duration
              </p>
              <p className="text-lg font-bold text-on-surface">
                {interview.duration_minutes} minutes
              </p>
            </div>
          </div>

          {/* Description */}
          {interview.description && (
            <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
              <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-3">
                Description
              </p>
              <p className="text-on-surface leading-relaxed">{interview.description}</p>
            </div>
          )}

          {/* Meeting Details */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">
                Meeting Details
              </p>
            </div>

            {interview.meeting_url ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">Platform</p>
                  <p className="font-bold text-on-surface">{interview.meeting_platform || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">Meeting Link</p>
                  <a
                    href={interview.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-container font-bold flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">video_call</span>
                    Join Meeting
                  </a>
                </div>
              </div>
            ) : (
              <div>
                {showMeetingForm ? (
                  <form onSubmit={handleAddMeeting} className="space-y-3">
                    <input
                      type="url"
                      placeholder="https://meet.google.com/..."
                      value={meetingUrl}
                      onChange={(e) => setMeetingUrl(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-2 text-on-surface placeholder:text-on-surface-variant focus:border-primary/50 outline-none"
                      required
                    />
                    <select
                      value={meetingPlatform}
                      onChange={(e) => setMeetingPlatform(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-2 text-on-surface focus:border-primary/50 outline-none"
                    >
                      <option>Google Meet</option>
                      <option>Zoom</option>
                      <option>Teams</option>
                      <option>Slack Call</option>
                      <option>Other</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={savingMeeting}
                        className="flex-1 px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50 font-bold text-sm transition-all"
                      >
                        {savingMeeting ? 'Saving...' : 'Add Meeting'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowMeetingForm(false)}
                        className="flex-1 px-4 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-bold text-sm transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowMeetingForm(true)}
                    className="w-full px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add Meeting Link
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Other Party Info */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
            <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-4">
              {isFreelancer ? 'Employer' : 'Freelancer'}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-center overflow-hidden">
                {otherParty?.avatar_url ? (
                  <img
                    src={otherParty.avatar_url}
                    alt={otherParty.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined">person</span>
                )}
              </div>
              <div>
                <p className="font-bold text-on-surface">{otherParty?.full_name || 'Unknown'}</p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
            <h3 className="text-lg font-bold text-on-surface mb-4">Interview Notes</h3>

            {notes.length > 0 ? (
              <div className="space-y-4 mb-6">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-bold text-sm text-on-surface">{note.user?.full_name || 'Anonymous'}</p>
                      <p className="text-xs text-on-surface-variant">
                        {new Date(note.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-on-surface text-sm leading-relaxed">{note.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-on-surface-variant text-sm mb-6">No notes yet</p>
            )}

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note about this interview..."
                rows={3}
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-2 text-on-surface placeholder:text-on-surface-variant focus:border-primary/50 outline-none resize-none"
              />
              <button
                type="submit"
                disabled={addingNote || !newNote.trim()}
                className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50 font-bold text-sm transition-all"
              >
                {addingNote ? 'Adding...' : 'Add Note'}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Actions */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6 sticky top-20">
            <h3 className="text-lg font-bold text-on-surface mb-4">Actions</h3>

            <div className="space-y-3">
              {interview.status === 'scheduled' && (
                <>
                  <button
                    onClick={() => handleStatusChange('confirmed')}
                    disabled={updatingStatus}
                    className="w-full px-4 py-2 rounded-lg bg-green-500/20 text-green-600 hover:bg-green-500/30 disabled:opacity-50 font-bold text-sm transition-all"
                  >
                    {updatingStatus ? 'Updating...' : 'Confirm Interview'}
                  </button>
                  <button
                    onClick={() => handleStatusChange('cancelled')}
                    disabled={updatingStatus}
                    className="w-full px-4 py-2 rounded-lg bg-red-500/20 text-red-600 hover:bg-red-500/30 disabled:opacity-50 font-bold text-sm transition-all"
                  >
                    Cancel Interview
                  </button>
                </>
              )}

              {interview.status === 'confirmed' && (
                <>
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    disabled={updatingStatus}
                    className="w-full px-4 py-2 rounded-lg bg-purple-500/20 text-purple-600 hover:bg-purple-500/30 disabled:opacity-50 font-bold text-sm transition-all"
                  >
                    Start Interview
                  </button>
                </>
              )}

              {interview.status === 'in_progress' && (
                <>
                  <button
                    onClick={() => handleStatusChange('completed')}
                    disabled={updatingStatus}
                    className="w-full px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30 disabled:opacity-50 font-bold text-sm transition-all"
                  >
                    Mark Complete
                  </button>
                </>
              )}

              {['scheduled', 'confirmed', 'rescheduled'].includes(interview.status) && (
                showRescheduleForm ? (
                  <form onSubmit={handleReschedule} className="space-y-2">
                    <input
                      type="datetime-local"
                      value={newScheduledTime}
                      onChange={(e) => setNewScheduledTime(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-on-surface text-sm focus:border-primary focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={rescheduling || !newScheduledTime}
                        className="flex-1 px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30 disabled:opacity-50 font-bold text-sm transition-all"
                      >
                        {rescheduling ? 'Saving…' : 'Confirm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRescheduleForm(false)}
                        disabled={rescheduling}
                        className="flex-1 px-4 py-2 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-bold text-sm transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowRescheduleForm(true)}
                    className="w-full px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30 font-bold text-sm transition-all"
                  >
                    Reschedule
                  </button>
                )
              )}
            </div>
          </div>

          {/* Interview Info */}
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">
              Interview Details
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-on-surface-variant text-xs mb-1">Created</p>
                <p className="font-bold text-on-surface">
                  {new Date(interview.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
