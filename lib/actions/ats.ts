'use server'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ATSSection {
  name: string
  score: number
  status: 'excellent' | 'good' | 'fair' | 'poor'
}

interface Recommendation {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  icon: string
}

export interface ATSAnalysisResult {
  matchScore: number
  atsScore: number
  keywordMatchPercentage: number
  presentKeywords: string[]
  missingKeywords: string[]
  sections: ATSSection[]
  recommendations: Recommendation[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'will',
  'your', 'about', 'more', 'other', 'such', 'should', 'would', 'their',
  'which', 'been', 'also', 'our', 'all', 'are', 'not', 'but', 'can',
  'has', 'had', 'does', 'did', 'just', 'how', 'what', 'when', 'where',
  'who', 'why', 'do', 'is', 'be', 'or', 'as', 'by', 'in', 'at', 'of',
  'to', 'an', 'a',
])

const SECTION_DEFINITIONS = [
  { name: 'Contact Information', pattern: /email|phone|linkedin|address/i },
  { name: 'Professional Summary', pattern: /summary|profile|objective|overview/i },
  { name: 'Work Experience', pattern: /experience|employment|work|positions?/i },
  { name: 'Skills', pattern: /skills|competencies|expertise|technical/i },
  { name: 'Education', pattern: /education|degree|university|college|certification/i },
] as const

// ─── Pure analysis functions ──────────────────────────────────────────────────

function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .split(/[\s,;:\-()[\]{}]+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w))
  return [...new Set(words)].slice(0, 50)
}

function scoreToStatus(score: number): ATSSection['status'] {
  if (score >= 80) return 'excellent'
  if (score >= 65) return 'good'
  if (score >= 50) return 'fair'
  return 'poor'
}

function analyzeFormatting(cvText: string): { score: number; issues: string[] } {
  const issues: string[] = []
  let score = 90

  const sectionCount = [/experience|work/i, /education|degree/i, /skills/i, /contact|email|phone/i]
    .filter(r => r.test(cvText)).length

  if (sectionCount < 3) { issues.push('Missing standard section headers'); score -= 15 }
  if (!cvText.includes('•') && !cvText.match(/^\s*[-*]/m)) { issues.push('No bullet points detected'); score -= 10 }

  const specialCharRatio = (cvText.match(/[^a-zA-Z0-9\s.,\-()]/g) || []).length / cvText.length
  if (specialCharRatio > 0.05) { issues.push('Too many special characters'); score -= 10 }

  const lines = cvText.split('\n')
  const longLineRatio = lines.filter(l => l.length > 120).length / lines.length
  if (longLineRatio > 0.3) { issues.push('Very long lines - break into shorter paragraphs'); score -= 5 }

  return { score: Math.max(0, score), issues }
}

function analyzeSections(cvText: string): Array<ATSSection & { found: boolean }> {
  return SECTION_DEFINITIONS.map(({ name, pattern }) => {
    const match = cvText.match(new RegExp(pattern.source + '[\\s\\S]{0,500}', 'i'))
    const found = pattern.test(cvText)
    const score = found ? Math.round(Math.min(100, 50 + Math.min(50, (match?.[0].length ?? 0) / 20))) : 30
    return { name, score, status: scoreToStatus(score), found }
  })
}

function buildRecommendations(
  cvKeywords: string[],
  jobKeywords: string[],
  formattingScore: number,
  formattingIssues: string[],
  sections: Array<ATSSection & { found: boolean }>
): Recommendation[] {
  const missing = jobKeywords.filter(k => !cvKeywords.includes(k)).slice(0, 10)
  const recs: Recommendation[] = []

  if (missing.length >= 5) {
    recs.push({
      title: 'Add Missing Skills & Keywords',
      description: `Include ${missing.length} key terms: ${missing.slice(0, 3).join(', ')}...`,
      priority: 'high',
      icon: 'flag',
    })
  }

  const weakSections = sections.filter(s => s.score < 50)
  if (weakSections.length > 0) {
    recs.push({
      title: 'Add Missing Sections',
      description: `Missing or thin content in: ${weakSections.map(s => s.name).join(', ')}.`,
      priority: 'high',
      icon: 'bookmark',
    })
  }

  if (formattingScore < 80) {
    recs.push({
      title: 'Optimize Formatting for ATS',
      description: formattingIssues.join('. ') + '. Use standard formatting and clear section headers.',
      priority: 'high',
      icon: 'info',
    })
  }

  if (!cvKeywords.some(k => k.length > 5)) {
    recs.push({
      title: 'Use Specific Job Titles',
      description: 'Mirror job titles from the posting in your experience section.',
      priority: 'medium',
      icon: 'bookmark',
    })
  }

  if (!/\d+/.test(cvKeywords.join(''))) {
    recs.push({
      title: 'Add Quantifiable Results',
      description: 'Include percentages or metrics (e.g., "Increased sales by 25%").',
      priority: 'medium',
      icon: 'trending_up',
    })
  }

  recs.push({
    title: 'Simplify Design & Layout',
    description: 'Avoid tables, graphics, and complex formatting. ATS systems parse plain text better.',
    priority: 'low',
    icon: 'design_services',
  })

  return recs.slice(0, 5)
}

// ─── Exported action ──────────────────────────────────────────────────────────

export async function analyzeCV(cvText: string, jobDescription: string): Promise<ATSAnalysisResult> {
  if (!cvText || !jobDescription) throw new Error('CV and job description are required')

  const cvKeywords = extractKeywords(cvText)
  const jobKeywords = extractKeywords(jobDescription)

  const presentKeywords = cvKeywords.filter(k => jobKeywords.includes(k))
  const missingKeywords = jobKeywords.filter(k => !cvKeywords.includes(k)).slice(0, 10)
  const keywordMatchPercentage = jobKeywords.length
    ? Math.round((presentKeywords.length / jobKeywords.length) * 100)
    : 0

  const { score: formattingScore, issues: formattingIssues } = analyzeFormatting(cvText)
  const sectionsRaw = analyzeSections(cvText)
  const contentScore = Math.round(sectionsRaw.reduce((s, r) => s + r.score, 0) / sectionsRaw.length)

  const atsScore = Math.round(formattingScore * 0.4 + contentScore * 0.6)
  const matchScore = Math.round(keywordMatchPercentage * 0.5 + atsScore * 0.5)

  return {
    matchScore,
    atsScore,
    keywordMatchPercentage,
    presentKeywords: presentKeywords.slice(0, 8),
    missingKeywords,
    sections: sectionsRaw.map(({ name, score, status }) => ({ name, score, status })),
    recommendations: buildRecommendations(cvKeywords, jobKeywords, formattingScore, formattingIssues, sectionsRaw),
  }
}
