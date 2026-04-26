'use server'

import { revalidatePath } from 'next/cache'
import { getAuthUser } from '@/lib/supabase/get-user'
import { toActionError } from '@/lib/errors'

const COMMUNITY_PATH = '/community'

export async function createPost(content: string) {
  try {
    if (!content?.trim()) return { error: 'Post content cannot be empty.' }
    if (content.length > 2000) return { error: 'Post content must be under 2000 characters.' }

    const auth = await getAuthUser()
    if (!auth.ok) return { error: auth.error }
    const { user, supabase } = auth

    const { error } = await supabase!
      .from('community_posts')
      .insert({ user_id: user?.id, content: content.trim() })

    if (error) return { error: 'Failed to publish post. Please try again.' }

    revalidatePath(COMMUNITY_PATH)
    return { success: true }
  } catch (err) {
    return toActionError(err) as any
  }
}

export async function deletePost(postId: number) {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { error: auth.error }
    const { user, supabase } = auth

    const { error } = await supabase!
      .from('community_posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', user?.id) // Ownership guard

    if (error) return { error: 'Failed to delete post.' }

    revalidatePath(COMMUNITY_PATH)
    return { success: true }
  } catch (err) {
    return toActionError(err) as any
  }
}

export async function likePost(postId: number) {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { error: auth.error }
    const { user, supabase } = auth

    const { error } = await supabase!
      .from('community_post_likes')
      .insert({ post_id: postId, user_id: user?.id })

    if (error) {
      if (error.code === '23505') return { success: true, alreadyLiked: true }
      return { error: error.message }
    }

    revalidatePath(COMMUNITY_PATH)
    return { success: true, alreadyLiked: false }
  } catch (err) {
    return toActionError(err) as any
  }
}

export async function unlikePost(postId: number) {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { error: auth.error }
    const { user, supabase } = auth

    const { error } = await supabase!
      .from('community_post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user?.id)

    if (error) return { error: error.message }

    revalidatePath(COMMUNITY_PATH)
    return { success: true }
  } catch (err) {
    return toActionError(err) as any
  }
}

export async function addComment(postId: number, content: string) {
  try {
    if (!content?.trim()) return { error: 'Comment cannot be empty.' }
    if (content.length > 500) return { error: 'Comment must be under 500 characters.' }

    const auth = await getAuthUser()
    if (!auth.ok) return { error: auth.error }
    const { user, supabase } = auth

    const { error } = await supabase!
      .from('community_post_comments')
      .insert({ post_id: postId, user_id: user?.id, content: content.trim() })

    if (error) return { error: 'Failed to add comment.' }

    revalidatePath(COMMUNITY_PATH)
    return { success: true }
  } catch (err) {
    return toActionError(err) as any
  }
}

export async function deleteComment(commentId: number) {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { error: auth.error }
    const { user, supabase } = auth

    const { error } = await supabase!
      .from('community_post_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user?.id) // Ownership guard

    if (error) return { error: 'Failed to delete comment.' }

    revalidatePath(COMMUNITY_PATH)
    return { success: true }
  } catch (err) {
    return toActionError(err) as any
  }
}
