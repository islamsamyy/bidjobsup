'use client'

import { useState, useTransition } from 'react'
import { saveJob, unsaveJob } from '@/lib/actions/saved_items'
import { useRouter } from 'next/navigation'

interface SaveJobButtonProps {
  jobId: number
  isInitiallySaved: boolean
}

export default function SaveJobButton({ jobId, isInitiallySaved }: SaveJobButtonProps) {
  const [isSaved, setIsSaved] = useState(isInitiallySaved)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggle = () => {
    startTransition(async () => {
      const result = isSaved ? await unsaveJob(jobId) : await saveJob(jobId)
      if (result.success) {
        setIsSaved(!isSaved)
        router.refresh()
      } else if (result.error === 'Unauthorized') {
        router.push('/login')
      }
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-8 py-4 rounded-xl border font-semibold transition-all flex items-center gap-2 ${
        isSaved
          ? 'bg-[#caa2f7]/20 text-[#caa2f7] border-[#caa2f7]/30 hover:bg-[#caa2f7]/30'
          : 'bg-[#292428] text-[#faf1f5] border-[#4b474a]/20 hover:bg-[#2f2b2f]'
      } disabled:opacity-50`}
    >
      <span className="material-symbols-outlined text-xl">
        {isSaved ? 'bookmark_added' : 'bookmark'}
      </span>
      {isSaved ? 'Saved' : 'Save Job'}
    </button>
  )
}
