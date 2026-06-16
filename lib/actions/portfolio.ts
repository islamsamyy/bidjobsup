'use server'

import { createClient } from '@/lib/supabase/server'
import { toActionError } from '@/lib/errors'

export interface PortfolioItem {
  id: number
  user_id: number
  title: string
  description: string | null
  image_url: string | null
  project_url: string | null
  skills: string[] | null
  completion_date: string | null
  featured: boolean
  created_at: string
  updated_at: string
}

/**
 * Get the authenticated user's own portfolio items (no userId needed)
 */
export async function getMyPortfolio(): Promise<{
  portfolio: PortfolioItem[]
  error?: string
}> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { portfolio: [], error: 'Not authenticated' }

    const { data: profile } = await supabase.from('users').select('id').eq('auth_id', user.id).single()
    if (!profile) return { portfolio: [], error: 'Profile not found' }

    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('user_id', profile.id)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) return { portfolio: [], error: error.message }
    return { portfolio: data || [] }
  } catch (err: unknown) {
    return { portfolio: [], error: (toActionError(err) as any).error }
  }
}

/**
 * Get user's portfolio items
 */
export async function getUserPortfolio(userId: number): Promise<{
  portfolio: PortfolioItem[]
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('user_id', userId)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching portfolio:', error)
      return { portfolio: [], error: error.message }
    }

    return { portfolio: data || [] }
  } catch (err: unknown) {
    return { portfolio: [], error: (toActionError(err) as any).error }
  }
}

/**
 * Get featured portfolio items for a user
 */
export async function getFeaturedPortfolio(userId: number, limit = 3): Promise<{
  portfolio: PortfolioItem[]
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('user_id', userId)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching featured portfolio:', error)
      return { portfolio: [], error: error.message }
    }

    return { portfolio: data || [] }
  } catch (err: unknown) {
    return { portfolio: [], error: (toActionError(err) as any).error }
  }
}

/**
 * Create a new portfolio item
 */
export async function createPortfolioItem(
  title: string,
  description: string,
  imageUrl?: string,
  projectUrl?: string,
  skills?: string[],
  completionDate?: string
): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return { success: false, error: 'Profile not found' }
    }

    const { data, error } = await supabase
      .from('portfolio_items')
      .insert({
        user_id: profile.id,
        title,
        description,
        image_url: imageUrl || null,
        project_url: projectUrl || null,
        skills: skills || null,
        completion_date: completionDate || null,
        featured: false,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating portfolio item:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data.id }
  } catch (err: unknown) {
    return { success: false, error: (toActionError(err) as any).error }
  }
}

/**
 * Update a portfolio item
 */
export async function updatePortfolioItem(
  id: number,
  updates: Partial<PortfolioItem>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return { success: false, error: 'Profile not found' }
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if ('title' in updates) updateData.title = updates.title
    if ('description' in updates) updateData.description = updates.description
    if ('image_url' in updates) updateData.image_url = updates.image_url
    if ('project_url' in updates) updateData.project_url = updates.project_url
    if ('skills' in updates) updateData.skills = updates.skills
    if ('completion_date' in updates) updateData.completion_date = updates.completion_date
    if ('featured' in updates) updateData.featured = updates.featured

    const { error } = await supabase
      .from('portfolio_items')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', profile.id) // Security: only update own items

    if (error) {
      console.error('Error updating portfolio item:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: (toActionError(err) as any).error }
  }
}

/**
 * Delete a portfolio item
 */
export async function deletePortfolioItem(id: number): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return { success: false, error: 'Profile not found' }
    }

    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id)
      .eq('user_id', profile.id) // Security: only delete own items

    if (error) {
      console.error('Error deleting portfolio item:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: (toActionError(err) as any).error }
  }
}

/**
 * Toggle featured status for a portfolio item
 */
export async function toggleFeaturedPortfolio(id: number, featured: boolean): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return { success: false, error: 'Profile not found' }
    }

    const { error } = await supabase
      .from('portfolio_items')
      .update({ featured, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', profile.id)

    if (error) {
      console.error('Error toggling featured status:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: (toActionError(err) as any).error }
  }
}
