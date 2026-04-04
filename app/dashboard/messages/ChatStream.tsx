'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sendMessage } from './actions'

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
}

interface ChatStreamProps {
  conversationId: string
  currentUserId: string
  initialMessages: Message[]
  recipientName: string
}

export default function ChatStream({ conversationId, currentUserId, initialMessages, recipientName }: ChatStreamProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const supabase = createClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // 1. Establish Real-time Protocol
    const channel = supabase
      .channel(`stream:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, supabase])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    const content = newMessage.trim()
    setNewMessage('')

    const result = await sendMessage(conversationId, content)
    
    if (result?.error) {
      // Rollback or show error notification protocol (Neon Nocturne style)
      console.error('Stream Error:', result.error)
    }
    
    setIsSending(false)
  }

  return (
    <div className="flex flex-col h-[700px] bg-stone-950/20 rounded-[2rem] border border-outline-variant/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
      
      {/* Stream Header */}
      <header className="px-8 py-6 border-b border-outline-variant/10 flex items-center justify-between bg-stone-900/40 relative z-20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-stone-900"></div>
          </div>
          <div>
            <h3 className="font-headline font-black italic text-lg text-on-surface">{recipientName}</h3>
            <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Secure Stream Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl bg-stone-800 text-stone-400 hover:text-primary transition-colors border border-outline-variant/10">
            <span className="material-symbols-outlined text-lg">videocam</span>
          </button>
          <button className="p-2.5 rounded-xl bg-stone-800 text-stone-400 hover:text-primary transition-colors border border-outline-variant/10">
            <span className="material-symbols-outlined text-lg">more_vert</span>
          </button>
        </div>
      </header>

      {/* Messages Feed */}
      <div className="flex-grow overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
        {messages.map((msg, index) => {
          const isOwn = msg.sender_id === currentUserId
          return (
            <div 
              key={msg.id} 
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`max-w-[70%] space-y-2 group`}>
                <div className={`
                  px-6 py-4 rounded-2xl text-sm leading-relaxed font-medium transition-all
                  ${isOwn 
                    ? 'bg-primary text-on-primary rounded-tr-none shadow-[0_10px_30px_rgba(202,162,247,0.2)]' 
                    : 'bg-stone-800/80 text-on-surface-variant rounded-tl-none border border-outline-variant/10'
                  }
                `}>
                  {msg.content}
                </div>
                <p className={`text-[9px] font-black uppercase tracking-widest text-stone-600 ${isOwn ? 'text-right' : 'text-left'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Protocol */}
      <form onSubmit={handleSend} className="p-8 border-t border-outline-variant/10 bg-stone-900/40 relative z-20">
        <div className="relative group">
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Initialize response sequence..."
            className="w-full bg-stone-950/80 border border-outline-variant/10 rounded-2xl px-8 py-5 pr-32 text-on-surface focus:outline-none focus:border-primary/50 transition-all font-body text-sm placeholder:text-stone-700"
          />
          <div className="absolute right-3 top-3 bottom-3 flex items-center gap-2">
            <button 
              type="button" 
              className="p-2 text-stone-500 hover:text-secondary transition-colors"
            >
              <span className="material-symbols-outlined text-lg">attach_file</span>
            </button>
            <button 
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="bg-primary text-on-primary px-6 h-full rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
            >
              Send Protocol
            </button>
          </div>
        </div>
      </form>

      {/* Decorative Elements */}
      <div className="absolute -left-20 top-1/2 w-40 h-80 bg-primary/5 blur-[80px] pointer-events-none rounded-full"></div>
      <div className="absolute -right-20 bottom-1/4 w-60 h-60 bg-secondary/5 blur-[100px] pointer-events-none rounded-full"></div>
    </div>
  )
}
