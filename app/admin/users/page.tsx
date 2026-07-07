'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getAllUsers, updateUserRole, suspendUser, verifyUser, deleteUser } from '@/lib/actions/admin'

interface User {
  id: number
  auth_id: string
  full_name: string
  email: string
  role: string
  user_type: string
  avatar_url: string | null
  is_verified: boolean
  is_suspended: boolean
  created_at: string
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Users' },
  { value: 'seeker', label: 'Seekers' },
  { value: 'employer', label: 'Employers' },
  { value: 'admin', label: 'Admins' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'verified', label: 'Verified' },
]

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRole, setFilterRole] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const load = async () => {
    setLoading(true)
    const result = await getAllUsers(filterRole === 'all' ? undefined : filterRole)
    setUsers(result.users || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [filterRole])

  const handleRoleChange = async (userId: number, newRole: string) => {
    setActionLoading(userId)
    const result = await updateUserRole(userId, newRole)
    if (result.success) setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    setActionLoading(null)
  }

  const handleSuspend = async (userId: number, isSuspended: boolean) => {
    setActionLoading(userId)
    const result = await suspendUser(userId, !isSuspended)
    if (result.success) setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_suspended: !isSuspended } : u))
    setActionLoading(null)
  }

  const handleVerify = async (userId: number, isVerified: boolean) => {
    setActionLoading(userId)
    const result = await verifyUser(userId, !isVerified)
    if (result.success) setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_verified: !isVerified } : u))
    setActionLoading(null)
  }

  const handleDelete = async (userId: number) => {
    const result = await deleteUser(userId)
    if (result.success) {
      setUsers(prev => prev.filter(u => u.id !== userId))
      setConfirmDelete(null)
    }
  }

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Manage Users</h1>
          <p className="text-on-surface-variant">Full user management — role, verification, suspension, deletion</p>
        </div>
        <Link href="/admin" className="px-4 py-2 bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
          Back to Admin
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', count: users.length, color: 'text-on-surface' },
          { label: 'Seekers', count: users.filter(u => u.user_type === 'jobseeker').length, color: 'text-green-400' },
          { label: 'Employers', count: users.filter(u => u.user_type === 'employer').length, color: 'text-blue-400' },
          { label: 'Verified', count: users.filter(u => u.is_verified).length, color: 'text-primary' },
          { label: 'Suspended', count: users.filter(u => u.is_suspended).length, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-4">
            <div className="text-xs font-bold uppercase text-on-surface-variant mb-1">{s.label}</div>
            <div className={`text-2xl font-black ${s.color}`}>{s.count}</div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-surface-container-high rounded-lg border border-white/5 text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary/30 transition-all"
        />
        <div className="flex gap-2 flex-wrap">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilterRole(opt.value)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filterRole === opt.value ? 'bg-primary text-on-primary-container' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center py-12"><span className="material-symbols-outlined animate-spin text-primary text-4xl">hourglass_top</span></div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(user => (
            <div
              key={user.id}
              className={`bg-surface-container/60 backdrop-blur-xl rounded-xl border transition-all p-5 ${
                user.is_suspended ? 'border-red-500/20 bg-red-500/5' : 'border-white/5 hover:border-primary/20'
              }`}
            >
              <div className="flex items-start gap-4 flex-wrap">
                {/* Avatar + Name */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {user.avatar_url ? (
                    <Image src={user.avatar_url} alt={user.full_name} width={40} height={40} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-sm">person</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-on-surface truncate">{user.full_name}</p>
                      {user.is_verified && (
                        <span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary text-[10px] font-black uppercase">Verified</span>
                      )}
                      {user.is_suspended && (
                        <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-black uppercase">Suspended</span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                    <p className="text-xs text-on-surface-variant">Joined {formatDate(user.created_at)}</p>
                  </div>
                </div>

                {/* Role + Type badges */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${
                    user.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                    : 'bg-surface-container-high text-on-surface-variant border-white/10'
                  }`}>
                    {user.role}
                  </span>
                  <span className="px-2 py-1 rounded-lg text-[10px] font-black uppercase border bg-surface-container-high text-on-surface-variant border-white/10">
                    {user.user_type}
                  </span>
                </div>
              </div>

              {/* Action Row */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-white/5 flex-wrap items-center">
                {/* Role select */}
                <select
                  value={user.role}
                  onChange={e => handleRoleChange(user.id, e.target.value)}
                  disabled={actionLoading === user.id}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-surface-container-high border-white/10 text-on-surface focus:outline-none focus:border-primary/30 transition-all disabled:opacity-50"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                {/* Verify toggle */}
                <button
                  onClick={() => handleVerify(user.id, user.is_verified)}
                  disabled={actionLoading === user.id}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all disabled:opacity-50 ${
                    user.is_verified
                      ? 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'
                      : 'bg-surface-container-high border-white/10 text-on-surface-variant hover:bg-surface-container-highest'
                  }`}
                >
                  {user.is_verified ? '✓ Verified' : 'Verify'}
                </button>

                {/* Suspend toggle */}
                <button
                  onClick={() => handleSuspend(user.id, user.is_suspended)}
                  disabled={actionLoading === user.id}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all disabled:opacity-50 ${
                    user.is_suspended
                      ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20'
                      : 'bg-surface-container-high border-white/10 text-on-surface-variant hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                  }`}
                >
                  {user.is_suspended ? 'Unsuspend' : 'Suspend'}
                </button>

                {/* Delete */}
                <div className="ml-auto">
                  {confirmDelete === user.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-400 font-bold">Delete permanently?</span>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-3 py-1.5 bg-surface-container-high text-on-surface-variant rounded-lg text-xs font-bold transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(user.id)}
                      className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
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
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 block">person_search</span>
          <h3 className="text-xl font-bold text-on-surface mb-2">No Users Found</h3>
          <p className="text-on-surface-variant">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  )
}
