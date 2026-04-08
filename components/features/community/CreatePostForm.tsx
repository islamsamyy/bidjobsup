'use client'

import { useState } from 'react'
import { createPost } from '@/lib/actions/posts'

export default function CreatePostForm({ userName }: { userName?: string }) {
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit() {
    if (!content.trim()) return
    setStatus('sending')
    setErrorMsg('')

    const result = await createPost(content)
    if (result.error) {
      setStatus('error')
      setErrorMsg(result.error)
    } else {
      setStatus('success')
      setContent('')
      // Reset after brief feedback
      setTimeout(() => setStatus('idle'), 1500)
    }
  }

  const initials = userName
    ? userName.split(' ').map(w => w[0]).join('')
    : 'Y'

  return (
    <div className="mb-12 bg-surface-container/60 backdrop-blur-xl rounded-xl p-6 border border-white/5">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary font-bold text-sm shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <textarea
            className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-neutral-600 resize-none font-body text-lg"
            placeholder="Share a strategic insight..."
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
            disabled={status === 'sending'}
          />
          {errorMsg && (
            <p className="text-error text-xs mt-1">{errorMsg}</p>
          )}
          {status === 'success' && (
            <p className="text-primary text-xs mt-1">Post published!</p>
          )}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
            <div className="flex gap-4 text-neutral-500">
              <span className="text-xs text-neutral-600">{content.length}/2000</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || status === 'sending'}
              className="px-6 py-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-on-primary transition-all rounded-full font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
