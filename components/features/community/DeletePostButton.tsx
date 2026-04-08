'use client'

import { deletePost } from '@/lib/actions/posts'
import { useRouter } from 'next/navigation'

export default function DeletePostButton({ postId }: { postId: number }) {
  const router = useRouter()

  async function handleDelete() {
    const result = await deletePost(postId)
    if (!result.error) {
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-neutral-600 hover:text-error transition-colors text-xs"
      title="Delete post"
    >
      <span className="material-symbols-outlined text-sm">delete</span>
    </button>
  )
}
