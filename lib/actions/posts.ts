'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPost(content: string) {
  if (!content || content.trim().length === 0) {
    return { error: 'Post content cannot be empty.' }
  }
  if (content.length > 2000) {
    return { error: 'Post content must be under 2000 characters.' }
  }

  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'You must be signed in to post.' }
  }

  const { data: profile } = await supabase
    .from('users')
    .select('id, full_name')
    .eq('auth_id', user.id)
    .single()

  if (!profile) {
    return { error: 'Profile not found.' }
  }

  const { error } = await supabase
    .from('community_posts')
    .insert({
      user_id: profile.id,
      content: content.trim(),
    })

  if (error) {
    console.error('Post creation error:', error.message)
    return { error: 'Failed to publish post. Please try again.' }
  }

  revalidatePath('/community')
  return { success: true }
}

export async function deletePost(postId: number) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated.' }
  }

  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found.' }

  // Only delete own posts
  const { error } = await supabase
    .from('community_posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', profile.id)

  if (error) return { error: 'Failed to delete post.' }

  revalidatePath('/community')
  return { success: true }
}

export async function likePost(postId: number) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated.' }
  }

  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found.' }

  const { error } = await supabase
    .from('community_post_likes')
    .insert({
      post_id: postId,
      user_id: profile.id,
    })

  if (error) {
    if (error.code === '23505') { // unique violation = already liked
      return { success: true, alreadyLiked: true }
    }
    return { error: error.message }
  }

  revalidatePath('/community')
  return { success: true, alreadyLiked: false }
}

export async function unlikePost(postId: number) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated.' }
  }

  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found.' }

  const { error } = await supabase
    .from('community_post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', profile.id)

  if (error) return { error: error.message }

  revalidatePath('/community')
  return { success: true }
}

export async function addComment(postId: number, content: string) {
  if (!content || content.trim().length === 0) {
    return { error: 'Comment cannot be empty.' }
  }
  if (content.length > 500) {
    return { error: 'Comment must be under 500 characters.' }
  }

  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated.' }
  }

  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found.' }

  const { error } = await supabase
    .from('community_post_comments')
    .insert({
      post_id: postId,
      user_id: profile.id,
      content: content.trim(),
    })

  if (error) return { error: 'Failed to add comment.' }

  revalidatePath('/community')
  return { success: true }
}

export async function deleteComment(commentId: number) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated.' }
  }

  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!profile) return { error: 'Profile not found.' }

  // Only delete own comments
  const { error } = await supabase
    .from('community_post_comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', profile.id)

  if (error) return { error: 'Failed to delete comment.' }

  revalidatePath('/community')
  return { success: true }
}
