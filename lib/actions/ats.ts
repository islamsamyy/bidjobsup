'use server'

import { createClient } from '@/lib/supabase/server'

interface ATSAnalysisResult {
  matchScore: number
  atsScore: number
  keywordMatchPercentage: number
  presentKeywords: string[]
  missingKeywords: string[]
  sections: Array<{
    name: string
    score: number
    status: 'excellent' | 'good' | 'fair' | 'poor'
  }>
  recommendations: Array<{
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
    icon: string
  }>
}

// Extract keywords from text
function extractKeywords(text: string): string[] {
  const text_lower = text.toLowerCase()

  // Split by common delimiters and clean
  const words = text_lower
    .split(/[\s,;:\-()[\]{}]+/)
    .filter(w => w.length > 3) // Only words with 3+ chars
    .filter(w => !isCommonWord(w))

  // Remove duplicates and return
  return [...new Set(words)].slice(0, 50)
}

// Common words to filter out
function isCommonWord(word: string): boolean {
  const common = [
    'the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'will',
    'your', 'about', 'more', 'other', 'such', 'should', 'would', 'their',
    'which', 'been', 'also', 'our', 'all', 'are', 'not', 'but', 'can',
    'has', 'had', 'does', 'did', 'just', 'how', 'what', 'when', 'where',
    'who', 'why', 'do', 'is', 'be', 'or', 'as', 'by', 'in', 'at', 'of',
    'to', 'an', 'a'
  ]
  return common.includes(word)
}

// Calculate match percentage between two keyword sets
function calculateMatchPercentage(cvKeywords: string[], jobKeywords: string[]): number {
  if (jobKeywords.length === 0) return 0
  const matches = cvKeywords.filter(k => jobKeywords.includes(k))
  return Math.round((matches.length / jobKeywords.length) * 100)
}

// Find missing keywords
function findMissingKeywords(cvKeywords: string[], jobKeywords: string[]): string[] {
  return jobKeywords.filter(k => !cvKeywords.includes(k)).slice(0, 10)
}

// Analyze CV formatting and structure
function analyzeFormatting(cvText: string): { score: number; issues: string[] } {
  const issues: string[] = []
  let score = 90

  // Check for common section headers
  const hasSections = [
    /experience|work/i,
    /education|degree/i,
    /skills/i,
    /contact|email|phone/i
  ].filter(regex => regex.test(cvText)).length

  if (hasSections < 3) {
    issues.push('Missing standard section headers')
    score -= 15
  }

  // Check for bullet points
  if (!cvText.includes('•') && !cvText.match(/^\s*[-*]/m)) {
    issues.push('No bullet points detected - use bullets for readability')
    score -= 10
  }

  // Check for excessive special characters
  const specialCharCount = (cvText.match(/[^a-zA-Z0-9\s\.\,\-\(\)]/g) || []).length
  if (specialCharCount > cvText.length * 0.05) {
    issues.push('Too many special characters - simplify formatting')
    score -= 10
  }

  // Check for proper spacing
  const longLines = cvText.split('\n').filter(l => l.length > 120).length
  if (longLines > cvText.split('\n').length * 0.3) {
    issues.push('Very long lines - break into shorter paragraphs')
    score -= 5
  }

  return { score: Math.max(0, score), issues }
}

// Analyze content quality
function analyzeContent(cvText: string): { score: number; sections: any[] } {
  const sections = [
    {
      name: 'Contact Information',
      patterns: [/email|phone|linkedin|address/i],
      found: false,
      score: 0
    },
    {
      name: 'Professional Summary',
      patterns: [/summary|profile|objective|overview/i],
      found: false,
      score: 0
    },
    {
      name: 'Work Experience',
      patterns: [/experience|employment|work|positions?/i],
      found: false,
      score: 0
    },
    {
      name: 'Skills',
      patterns: [/skills|competencies|expertise|technical/i],
      found: false,
      score: 0
    },
    {
      name: 'Education',
      patterns: [/education|degree|university|college|certification/i],
      found: false,
      score: 0
    }
  ]

  sections.forEach(section => {
    const found = section.patterns.some(p => p.test(cvText))
    section.found = found

    if (found) {
      // Check quality within this section
      const sectionMatch = cvText.match(
        new RegExp(section.patterns[0].source + '[\\s\\S]{0,500}', 'i')
      )

      if (sectionMatch) {
        const content = sectionMatch[0]
        // Score based on content length and detail
        const score = Math.min(
          100,
          50 + Math.min(50, content.length / 20)
        )
        section.score = Math.round(score)
      } else {
        section.score = 60
      }
    } else {
      section.score = 30
    }
  })

  const avgScore = Math.round(
    sections.reduce((sum, s) => sum + s.score, 0) / sections.length
  )

  return { score: avgScore, sections }
}

// Generate recommendations based on analysis
function generateRecommendations(
  cvKeywords: string[],
  jobKeywords: string[],
  formatting: any,
  content: any
): Array<{
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  icon: string
}> {
  const recommendations: Array<{
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
    icon: string
  }> = []

  // Missing keywords recommendation
  const missingCount = findMissingKeywords(cvKeywords, jobKeywords).length
  if (missingCount >= 5) {
    recommendations.push({
      title: 'Add Missing Skills & Keywords',
      description: `Include ${missingCount} key terms from the job description: ${findMissingKeywords(cvKeywords, jobKeywords).slice(0, 3).join(', ')}...`,
      priority: 'high',
      icon: 'flag'
    })
  }

  // Content section recommendations
  const missingSections = content.sections.filter((s: any) => s.score < 50)
  if (missingSections.length > 0) {
    recommendations.push({
      title: `Add Missing Sections`,
      description: `Your CV is missing or lacks detail in: ${missingSections.map((s: any) => s.name).join(', ')}. Add comprehensive content to these sections.`,
      priority: 'high',
      icon: 'bookmark'
    })
  }

  // Formatting recommendations
  if (formatting.score < 80) {
    recommendations.push({
      title: 'Optimize Formatting for ATS',
      description: formatting.issues.join('. ') + '. Use standard formatting and clear section headers.',
      priority: 'high',
      icon: 'info'
    })
  }

  // Job title alignment
  if (!cvKeywords.some(k => k.length > 5)) {
    recommendations.push({
      title: 'Use Specific Job Titles',
      description: 'Mirror job titles and role names from the posting in your experience section for better matching.',
      priority: 'medium',
      icon: 'bookmark'
    })
  }

  // Quantify achievements
  const hasNumbers = /\d+/.test(cvKeywords.join(''))
  if (!hasNumbers) {
    recommendations.push({
      title: 'Add Quantifiable Results',
      description: 'Include percentages, dollars, or metrics in your achievements (e.g., "Increased sales by 25%").',
      priority: 'medium',
      icon: 'trending_up'
    })
  }

  // Avoid graphics
  recommendations.push({
    title: 'Simplify Design & Layout',
    description: 'Avoid tables, graphics, columns, and complex formatting. ATS systems parse plain text better.',
    priority: 'low',
    icon: 'design_services'
  })

  return recommendations.slice(0, 5)
}

export async function analyzeCV(
  cvText: string,
  jobDescription: string
): Promise<ATSAnalysisResult> {
  if (!cvText || !jobDescription) {
    throw new Error('CV and job description are required')
  }

  // Extract keywords from both texts
  const cvKeywords = extractKeywords(cvText)
  const jobKeywords = extractKeywords(jobDescription)

  // Calculate match percentage
  const keywordMatchPercentage = calculateMatchPercentage(cvKeywords, jobKeywords)

  // Find missing keywords
  const missingKeywords = findMissingKeywords(cvKeywords, jobKeywords)

  // Analyze formatting
  const formatting = analyzeFormatting(cvText)

  // Analyze content quality
  const content = analyzeContent(cvText)

  // Calculate overall ATS score (formatting + content)
  const atsScore = Math.round((formatting.score * 0.4 + content.score * 0.6))

  // Calculate overall match score (keyword match + ATS score)
  const matchScore = Math.round((keywordMatchPercentage * 0.5 + atsScore * 0.5))

  // Generate recommendations
  const recommendations = generateRecommendations(
    cvKeywords,
    jobKeywords,
    formatting,
    content
  )

  // Get present keywords (found in both)
  const presentKeywords = cvKeywords.filter(k => jobKeywords.includes(k))

  // Format section data
  const sections = content.sections.map(s => ({
    name: s.name,
    score: s.score,
    status: s.score >= 80 ? 'excellent' as const : s.score >= 65 ? 'good' as const : s.score >= 50 ? 'fair' as const : 'poor' as const
  }))

  return {
    matchScore,
    atsScore,
    keywordMatchPercentage,
    presentKeywords: presentKeywords.slice(0, 8),
    missingKeywords,
    sections,
    recommendations
  }
}
