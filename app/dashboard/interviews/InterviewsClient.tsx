'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getUserInterviews } from '@/lib/actions/interviews'

interface Interview {
  id: number
  title: string
  job_id: number
  freelancer_id: number
  employer_id: number
  scheduled_time: string
  duration_minutes: number
  status: string
  meeting_url: string | null
  meeting_platform: string | null
  created_at: string
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

const STATUS_CONFIG = {
  scheduled: { label: 'Scheduled', color: 'bg-blue-500/20 text-blue-600 border-blue-500/30', icon: 'calendar_today' },
  confirmed: { label: 'Confirmed', color: 'bg-green-500/20 text-green-600 border-green-500/30', icon: 'check_circle' },
  in_progress: { label: 'In Progress', color: 'bg-purple-500/20 text-purple-600 border-purple-500/30', icon: 'schedule' },
  completed: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30', icon: 'verified' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-600 border-red-500/30', icon: 'cancel' },
  rescheduled: { label: 'Rescheduled', color: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30', icon: 'edit_calendar' },
}

export default function InterviewsClient({ initialInterviews, currentUserId }: { initialInterviews: Interview[], currentUserId: number }) {
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews)
  const [loading, setLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    const loadInterviews = async () => {
      if (filterStatus === 'all') {
        setInterviews(initialInterviews)
        return
      }

      try {
        setLoading(true)
        const result = await getUserInterviews(filterStatus)
        if (!result.error) {
          setInterviews(result.interviews)
        }
      } catch (err) {
        console.error('Error loading interviews:', err)
      } finally {
        setLoading(false)
      }
    }

    loadInterviews()
  }, [filterStatus, initialInterviews])

  const statusOptions = ['all', 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled']

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

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filterStatus === status
                ? 'bg-primary text-on-primary-container'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            {status === 'all' ? 'All Interviews' : STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label || status}
          </button>
        ))}
      </div>

      {/* Interviews Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">
            hourglass_top
          </span>
        </div>
      ) : interviews.length > 0 ? (
        <div className="space-y-4">
          {interviews.map((interview) => {
            const otherParty =
              interview.freelancer_id === currentUserId
                ? interview.employer
                : interview.freelancer
            const otherPartyRole =
              interview.freelancer_id === currentUserId ? 'Employer' : 'Freelancer'
            const statusConfig = STATUS_CONFIG[interview.status as keyof typeof STATUS_CONFIG]
            const isPast = new Date(interview.scheduled_time) < new Date()

            return (
              <Link
                href={`/dashboard/interviews/${interview.id}`}
                key={interview.id}
                className="block bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-on-surface">{interview.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                          statusConfig?.color
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {statusConfig?.icon}
                        </span>
                        {statusConfig?.label || interview.status}
                      </span>
                    </div>

                    <p className="text-sm text-on-surface-variant mb-4">
                      {interview.job?.title || 'Job'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-on-surface-variant mb-1">Scheduled</p>
                        <p className="font-bold text-on-surface text-sm">
                          {formatDate(interview.scheduled_time)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-on-surface-variant mb-1">Duration</p>
                        <p className="font-bold text-on-surface text-sm">
                          {interview.duration_minutes} mins
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-on-surface-variant mb-1">{otherPartyRole}</p>
                        <p className="text-sm font-medium text-on-surface">{otherParty?.full_name}</p>
                      </div>

                      {interview.meeting_url && (
                        <div>
                          <p className="text-xs text-on-surface-variant mb-1">Meeting</p>
                          <a
                            href={interview.meeting_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-primary hover:text-primary-container font-bold text-sm flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">video_call</span>
                            Join
                          </a>
                        </div>
                      )}
                    </div>

                    {isPast && interview.status !== 'completed' && interview.status !== 'cancelled' && (
                      <p className="text-xs text-orange-500 italic">
                        This interview was scheduled in the past
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 block">
            calendar_today
          </span>
          <h3 className="text-xl font-bold text-on-surface mb-2">No interviews yet</h3>
          <p className="text-on-surface-variant mb-6">
            {filterStatus === 'all'
              ? 'Schedule your first interview to get started'
              : 'No interviews found in this status'}
          </p>
        </div>
      )}
    </div>
  )
}
