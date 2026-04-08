'use server'

import { createClient } from '@/lib/supabase/server'

interface AnalysisRecord {
  id?: string
  userId: string
  analysisDate: string
  jobTitle: string
  company?: string
  matchScore: number
  atsScore: number
  keywordMatchPercentage: number
  missingKeywords: string[]
  presentKeywords: string[]
  recommendations: Array<{
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
    icon: string
  }>
  cvVersion: string
}

/**
 * Save analysis to database for history tracking
 */
export async function saveAnalysisToHistory(
  analysis: Omit<AnalysisRecord, 'userId'>
): Promise<{ success: boolean; id?: string; error?: string }> {
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

    // Create or get ats_analysis_history table if needed
    const { data, error } = await supabase
      .from('ats_analysis_history')
      .insert({
        user_id: profile.id,
        analysis_date: analysis.analysisDate,
        job_title: analysis.jobTitle,
        company: analysis.company || null,
        match_score: analysis.matchScore,
        ats_score: analysis.atsScore,
        keyword_match_percentage: analysis.keywordMatchPercentage,
        missing_keywords: analysis.missingKeywords,
        present_keywords: analysis.presentKeywords,
        recommendations: analysis.recommendations,
        cv_version: analysis.cvVersion
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error saving analysis:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err: any) {
    console.error('Error in saveAnalysisToHistory:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Retrieve all analyses for current user
 */
export async function getUserAnalysisHistory(): Promise<{
  analyses: AnalysisRecord[]
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { analyses: [], error: 'Not authenticated' }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return { analyses: [], error: 'Profile not found' }
    }

    const { data, error } = await supabase
      .from('ats_analysis_history')
      .select('*')
      .eq('user_id', profile.id)
      .order('analysis_date', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching analysis history:', error)
      return { analyses: [], error: error.message }
    }

    // Transform from snake_case to camelCase
    const analyses = (data || []).map((record: any) => ({
      id: record.id,
      userId: record.user_id,
      analysisDate: record.analysis_date,
      jobTitle: record.job_title,
      company: record.company,
      matchScore: record.match_score,
      atsScore: record.ats_score,
      keywordMatchPercentage: record.keyword_match_percentage,
      missingKeywords: record.missing_keywords || [],
      presentKeywords: record.present_keywords || [],
      recommendations: record.recommendations || [],
      cvVersion: record.cv_version
    }))

    return { analyses }
  } catch (err: any) {
    console.error('Error in getUserAnalysisHistory:', err)
    return { analyses: [], error: err.message }
  }
}

/**
 * Calculate improvement trends
 */
export async function getAnalysisTrends(): Promise<{
  averageScore: number
  bestScore: number
  totalAnalyses: number
  scoreImprovement: number | null
  error?: string
}> {
  try {
    const { analyses } = await getUserAnalysisHistory()

    if (analyses.length === 0) {
      return {
        averageScore: 0,
        bestScore: 0,
        totalAnalyses: 0,
        scoreImprovement: null
      }
    }

    const scores = analyses.map(a => a.matchScore)
    const averageScore = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length
    )
    const bestScore = Math.max(...scores)

    // Calculate improvement: compare first and most recent
    const scoreImprovement =
      analyses.length > 1
        ? scores[scores.length - 1] - scores[0]
        : null

    return {
      averageScore,
      bestScore,
      totalAnalyses: analyses.length,
      scoreImprovement
    }
  } catch (err: any) {
    console.error('Error in getAnalysisTrends:', err)
    return {
      averageScore: 0,
      bestScore: 0,
      totalAnalyses: 0,
      scoreImprovement: null,
      error: err.message
    }
  }
}

/**
 * Get common missing keywords across all analyses
 */
export async function getCommonMissingKeywords(): Promise<{
  keywords: Array<{ keyword: string; frequency: number }>
  error?: string
}> {
  try {
    const { analyses } = await getUserAnalysisHistory()

    // Count keyword frequencies
    const keywordFreq: Record<string, number> = {}

    analyses.forEach(analysis => {
      analysis.missingKeywords.forEach(keyword => {
        keywordFreq[keyword] = (keywordFreq[keyword] || 0) + 1
      })
    })

    // Sort by frequency
    const keywords = Object.entries(keywordFreq)
      .map(([keyword, frequency]) => ({ keyword, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 20) // Top 20

    return { keywords }
  } catch (err: any) {
    console.error('Error in getCommonMissingKeywords:', err)
    return { keywords: [], error: err.message }
  }
}

/**
 * Delete a specific analysis record
 */
export async function deleteAnalysisRecord(id: string): Promise<{
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
      .from('ats_analysis_history')
      .delete()
      .eq('id', id)
      .eq('user_id', profile.id) // Security: only delete own records

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Error in deleteAnalysisRecord:', err)
    return { success: false, error: err.message }
  }
}
