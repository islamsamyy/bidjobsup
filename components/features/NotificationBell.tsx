'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface NotificationBellProps {
  userId: number
  userAuthId: string
  userType: 'employer' | 'jobseeker' | 'both'
}

type Notification = {
  id: number
  type: string
  title: string
  content: string
  link: string | null
  read_at: string | null
  created_at: string
}

export default function NotificationBell({ userId, userAuthId, userType }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  // Base path based on role
  const basePath = userType === 'employer' ? '/dashboard/employer/notifications' : '/dashboard/seeker/notifications'
  
  // Theme color based on role
  const dotColor = userType === 'employer' ? 'bg-secondary' : 'bg-primary'

  useEffect(() => {
    // Initial fetch of unread count
    const fetchUnread = async () => {
      const { data, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .is('read_at', null)
        .order('created_at', { ascending: false })
      
      if (data) {
        setNotifications(data)
        setUnreadCount(count || 0)
      }
    }
    fetchUnread()

    // Realtime subscription
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newNotif = payload.new as Notification
          setNotifications(current => [newNotif, ...current])
          setUnreadCount(c => c + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  return (
    <Link href={basePath} className="p-2 text-on-surface-variant hover:text-on-surface transition-colors relative group flex items-center">
      <span className="material-symbols-outlined">notifications</span>
      
      {unreadCount > 0 && (
        <span className={`absolute top-1 right-2 w-2 h-2 ${dotColor} rounded-full animate-pulse shadow-[0_0_8px_currentColor]`} />
      )}
      
      {/* Tooltip to show unread count subtly */}
      {unreadCount > 0 && (
        <div className="absolute top-10 right-0 w-max px-3 py-1.5 bg-surface-container-high border border-outline-variant/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-on-surface opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          {unreadCount} Unread Alert{unreadCount > 1 ? 's' : ''}
        </div>
      )}
    </Link>
  )
}
