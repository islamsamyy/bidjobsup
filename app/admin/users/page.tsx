'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAllUsers, updateUserRole } from '@/lib/actions/admin'

interface User {
  id: number
  full_name: string
  email: string
  role: string
  avatar_url: string | null
  is_verified: boolean
  created_at: string
  updated_at: string
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRole, setFilterRole] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      const result = await getAllUsers(filterRole === 'all' ? undefined : filterRole)
      setUsers(result.users || [])
      setLoading(false)
    }
    loadUsers()
  }, [filterRole])

  const handleRoleChange = async (userId: number, newRole: string) => {
    const result = await updateUserRole(userId, newRole)
    if (result.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const filteredUsers = users.filter(
    user => user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold text-on-surface mb-2">Manage Users</h1>
          <p className="text-on-surface-variant">View and manage user accounts</p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
        >
          Back to Admin
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-surface-container-high rounded-lg border border-white/5 text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary/30 transition-all"
        />

        <div className="flex gap-2 flex-wrap">
          {['all', 'seeker', 'employer', 'admin'].map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filterRole === role
                  ? 'bg-primary text-on-primary-container'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-on-surface-variant">User</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-on-surface-variant">Email</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-on-surface-variant">Role</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-on-surface-variant">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-on-surface-variant">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-surface-container/30 transition-all">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                        <Image
                          src={user.avatar_url}
                          alt={user.full_name}
                          width={36}
                          height={36}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm text-primary">person</span>
                        </div>
                      )}
                      <span className="font-medium text-on-surface">{user.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant">{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border transition-all focus:outline-none ${
                        user.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                          : user.role === 'employer'
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          : 'bg-green-500/20 text-green-400 border-green-500/30'
                      }`}
                    >
                      <option value="seeker">Seeker</option>
                      <option value="employer">Employer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {user.is_verified ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-bold">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant">{formatDate(user.created_at)}</td>
                  <td className="px-4 py-3">
                    <button
                      className="text-xs font-bold uppercase px-3 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-all"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/5 p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 block">
            person_search
          </span>
          <h3 className="text-xl font-bold text-on-surface mb-2">No Users Found</h3>
          <p className="text-on-surface-variant">Try adjusting your filters or search term</p>
        </div>
      )}

      {/* Stats */}
      {users.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
            <div className="text-xs font-bold uppercase text-on-surface-variant mb-2">Total Users</div>
            <div className="text-2xl font-bold text-on-surface">{users.length}</div>
          </div>
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
            <div className="text-xs font-bold uppercase text-on-surface-variant mb-2">Seekers</div>
            <div className="text-2xl font-bold text-green-400">{users.filter(u => u.role === 'seeker').length}</div>
          </div>
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
            <div className="text-xs font-bold uppercase text-on-surface-variant mb-2">Employers</div>
            <div className="text-2xl font-bold text-blue-400">{users.filter(u => u.role === 'employer').length}</div>
          </div>
          <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/5 p-6">
            <div className="text-xs font-bold uppercase text-on-surface-variant mb-2">Verified</div>
            <div className="text-2xl font-bold text-green-500">{users.filter(u => u.is_verified).length}</div>
          </div>
        </div>
      )}
    </div>
  )
}
