'use server'

import { revalidatePath } from 'next/cache'
import { getAuthUser } from '@/lib/supabase/get-user'
import { toActionError } from '@/lib/errors'

export async function addSkill(
  name: string,
  category: string,
  proficiencyLevel: string,
  isFeatured: boolean
): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { success: false, error: auth.error }
    const { user, supabase } = auth

    if (!name.trim()) return { success: false, error: 'Skill name is required' }

    const { data, error } = await supabase
      .from('skills')
      .insert({
        user_id: user.id,
        name: name.trim(),
        category: category || null,
        proficiency_level: proficiencyLevel || 'intermediate',
        is_featured: isFeatured,
        endorsement_count: 0,
        verified: false,
      })
      .select('id')
      .single()

    if (error) return { success: false, error: error.message }

    revalidatePath('/dashboard/seeker/skills')
    revalidatePath('/dashboard/seeker/profile')
    return { success: true, id: data.id }
  } catch (err) {
    return { success: false, error: (toActionError(err) as any).error }
  }
}

export async function deleteSkill(
  skillId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { success: false, error: auth.error }
    const { user, supabase } = auth

    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', skillId)
      .eq('user_id', user.id)

    if (error) return { success: false, error: error.message }

    revalidatePath('/dashboard/seeker/skills')
    return { success: true }
  } catch (err) {
    return { success: false, error: (toActionError(err) as any).error }
  }
}

export async function toggleFeaturedSkill(
  skillId: number,
  isFeatured: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { success: false, error: auth.error }
    const { user, supabase } = auth

    const { error } = await supabase
      .from('skills')
      .update({ is_featured: isFeatured })
      .eq('id', skillId)
      .eq('user_id', user.id)

    if (error) return { success: false, error: error.message }

    revalidatePath('/dashboard/seeker/skills')
    return { success: true }
  } catch (err) {
    return { success: false, error: (toActionError(err) as any).error }
  }
}

export async function updateSkillProficiency(
  skillId: number,
  proficiencyLevel: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await getAuthUser()
    if (!auth.ok) return { success: false, error: auth.error }
    const { user, supabase } = auth

    const { error } = await supabase
      .from('skills')
      .update({ proficiency_level: proficiencyLevel })
      .eq('id', skillId)
      .eq('user_id', user.id)

    if (error) return { success: false, error: error.message }

    revalidatePath('/dashboard/seeker/skills')
    return { success: true }
  } catch (err) {
    return { success: false, error: (toActionError(err) as any).error }
  }
}
