'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllJobsForModeration, updateJobModeration, flagJob, deleteJob } from '@/lib/actions/admin'

interface Job {
  id: number
  title: string
  description: string
  status: string
  moderation_status?: string
  flagged?: boolean
  created_at: string
  employer?: {
    full_name: string
    avatar_url: string | null
  }
}

export default function ModerateJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('pending')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  useEffect(() => {
    const loadJobs = async () => {
      const result = await getAllJobsForModeration(filterStatus === 'all' ? undefined : filterStatus)
      setJobs(result.jobs || [])
      setLoading(false)
    }
    loadJobs()
  }, [filterStatus])

  const handleStatusChange = async (jobId: number, newStatus: string) => {
    const result = await updateJobModeration(jobId, newStatus)
    if (result.success) {
      setJobs(jobs.map(j => j.id === jobId ? { ...j, moderation_status: newStatus } : j))
    }
  }

  const handleFlagJob = async (jobId: number, shouldFlag: boolean) => {
    const result = await flagJob(jobId, shouldFlag)
    if (result.success) {
      setJobs(jobs.map(j => j.id === jobId ? { ...j, flagged: shouldFlag } : j))
    }
  }

  const handleDeleteJob = async (jobId: number) => {
    const result = await deleteJob(jobId)
    if (result.success) {
      setJobs(jobs.filter(j => j.id !== jobId))
      setConfirmDelete(null)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Moderate Jobs</h1>
          <p className="text-on-surface-variant">Review and approve job listings</p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
        >
          Back to Admin
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filterStatus === status
                ? 'bg-primary text-on-primary-container'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Jobs List */}
      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map(job => (
            <div
              key={job.id}
              className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6 hover:border-primary/30 transition-all"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-on-surface">{job.title}</h3>
                    <p className="text-sm text-on-surface-variant mt-1">
                      {job.description?.substring(0, 150)}
                      {job.description && job.description.length > 150 ? '...' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.flagged && (
                      <span className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        Flagged
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                        job.moderation_status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30'
                          : job.moderation_status === 'approved'
                          ? 'bg-green-500/20 text-green-600 border-green-500/30'
                          : 'bg-red-500/20 text-red-600 border-red-500/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {job.moderation_status === 'pending'
                          ? 'schedule'
                          : job.moderation_status === 'approved'
                          ? 'check_circle'
                          : 'block'}
                      </span>
                      {job.moderation_status || 'pending'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-on-surface-variant mb-1">Posted By</p>
                    <p className="font-bold text-on-surface">{job.employer?.full_name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant mb-1">Job ID</p>
                    <p className="font-bold text-on-surface">{job.id}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant mb-1">Status</p>
                    <p className="font-bold text-on-surface capitalize">{job.status}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant mb-1">Date Posted</p>
                    <p className="font-bold text-on-surface">{formatDate(job.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-white/5 flex-wrap">
                {job.moderation_status !== 'approved' && (
                  <button
                    onClick={() => handleStatusChange(job.id, 'approved')}
                    className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Approve
                  </button>
                )}
                {job.moderation_status !== 'rejected' && (
                  <button
                    onClick={() => handleStatusChange(job.id, 'rejected')}
                    className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Reject
                  </button>
                )}
                {!job.flagged ? (
                  <button
                    onClick={() => handleFlagJob(job.id, true)}
                    className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Flag
                  </button>
                ) : (
                  <button
                    onClick={() => handleFlagJob(job.id, false)}
                    className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Unflag
                  </button>
                )}
                <div className="ml-auto">
                  {confirmDelete === job.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-400 font-bold">Delete permanently?</span>
                      <button onClick={() => handleDeleteJob(job.id)} className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-bold uppercase tracking-wider transition-all">
                        Confirm
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 bg-surface-container-high text-on-surface-variant rounded-lg text-xs font-bold transition-all">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(job.id)}
                      className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 block">
            inbox_zero
          </span>
          <h3 className="text-xl font-bold text-on-surface mb-2">No Jobs to Review</h3>
          <p className="text-on-surface-variant">All jobs have been reviewed!</p>
        </div>
      )}
    </div>
  )
}
