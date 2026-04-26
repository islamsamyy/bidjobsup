'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { toActionError } from '@/lib/errors'

export async function createPost({
  content,
  postType,
  title,
  description,
  imageUrl,
  projectLink,
  achievementType,
  visibility = 'public',
}: {
  content: string
  postType: 'text' | 'project' | 'achievement'
  title?: string
  description?: string
  imageUrl?: string
  projectLink?: string
  achievementType?: string
  visibility?: 'public' | 'connections' | 'private'
}) {
  try {
    if (!content || content.trim().length === 0) {
      return { error: 'Post content cannot be empty' }
    }

    if (content.length > 5000) {
      return { error: 'Post content must be under 5000 characters' }
    }

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Not authenticated' }
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!currentUser) {
      return { error: 'User not found' }
    }

    const { data, error } = await supabase
      .from('profile_posts')
      .insert({
        user_id: currentUser.id,
        content,
        post_type: postType,
        title: title || null,
        description: description || null,
        image_url: imageUrl || null,
        project_link: projectLink || null,
        achievement_type: achievementType || null,
        visibility,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      return { error: 'Failed to create post' }
    }

    revalidatePath('/dashboard/seeker/profile/feed')
    revalidatePath('/dashboard/feed')
    return { success: true, postId: data.id }
  } catch (err: unknown) {
    return toActionError(err) as any
  }
}

export async function deletePost(postId: number) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Not authenticated' }
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!currentUser) {
      return { error: 'User not found' }
    }

    // Check ownership
    const { data: post } = await supabase
      .from('profile_posts')
      .select('user_id')
      .eq('id', postId)
      .single()

    if (!post || post.user_id !== currentUser.id) {
      return { error: 'Not authorized to delete this post' }
    }

    const { error } = await supabase
      .from('profile_posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', postId)

    if (error) {
      console.error('Error deleting post:', error)
      return { error: 'Failed to delete post' }
    }

    revalidatePath('/dashboard/seeker/profile/feed')
    revalidatePath('/dashboard/feed')
    return { success: true }
  } catch (err: unknown) {
    return toActionError(err) as any
  }
}

export async function likePost(postId: number, reactionType: string = 'like') {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Not authenticated' }
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!currentUser) {
      return { error: 'User not found' }
    }

    // Check if already liked
    const { data: existing } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', currentUser.id)
      .single()

    if (existing) {
      // Unlike
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', currentUser.id)

      if (error) {
        return { error: 'Failed to unlike post' }
      }
    } else {
      // Like
      const { error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: currentUser.id,
          reaction_type: reactionType,
        })

      if (error) {
        console.error('Error liking post:', error)
        return { error: 'Failed to like post' }
      }
    }

    revalidatePath('/dashboard/seeker/profile/feed')
    revalidatePath('/dashboard/feed')
    return { success: true }
  } catch (err: unknown) {
    return toActionError(err) as any
  }
}

export async function addComment({
  postId,
  content,
  parentCommentId,
}: {
  postId: number
  content: string
  parentCommentId?: number
}) {
  try {
    if (!content || content.trim().length === 0) {
      return { error: 'Comment cannot be empty' }
    }

    if (content.length > 1000) {
      return { error: 'Comment must be under 1000 characters' }
    }

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Not authenticated' }
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!currentUser) {
      return { error: 'User not found' }
    }

    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: currentUser.id,
        parent_comment_id: parentCommentId || null,
        content: content.trim(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding comment:', error)
      return { error: 'Failed to add comment' }
    }

    revalidatePath('/dashboard/seeker/profile/feed')
    revalidatePath('/dashboard/feed')
    return { success: true, commentId: data.id }
  } catch (err: unknown) {
    return toActionError(err) as any
  }
}

export async function deleteComment(commentId: number) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Not authenticated' }
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!currentUser) {
      return { error: 'User not found' }
    }

    // Check ownership
    const { data: comment } = await supabase
      .from('post_comments')
      .select('user_id')
      .eq('id', commentId)
      .single()

    if (!comment || comment.user_id !== currentUser.id) {
      return { error: 'Not authorized to delete this comment' }
    }

    const { error } = await supabase
      .from('post_comments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', commentId)

    if (error) {
      console.error('Error deleting comment:', error)
      return { error: 'Failed to delete comment' }
    }

    revalidatePath('/dashboard/seeker/profile/feed')
    revalidatePath('/dashboard/feed')
    return { success: true }
  } catch (err: unknown) {
    return toActionError(err) as any
  }
}

export async function savePost(postId: number) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Not authenticated' }
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!currentUser) {
      return { error: 'User not found' }
    }

    // Check if already saved
    const { data: existing } = await supabase
      .from('saved_posts')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', currentUser.id)
      .single()

    if (existing) {
      // Unsave
      const { error } = await supabase
        .from('saved_posts')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', currentUser.id)

      if (error) {
        return { error: 'Failed to unsave post' }
      }
    } else {
      // Save
      const { error } = await supabase
        .from('saved_posts')
        .insert({
          post_id: postId,
          user_id: currentUser.id,
        })

      if (error) {
        console.error('Error saving post:', error)
        return { error: 'Failed to save post' }
      }
    }

    revalidatePath('/dashboard/seeker/profile/feed')
    revalidatePath('/dashboard/feed')
    return { success: true }
  } catch (err: unknown) {
    return toActionError(err) as any
  }
}
