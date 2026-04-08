'use server'

import Anthropic from '@anthropic-ai/sdk'

interface KeywordSuggestion {
  suggestedKeywords: string[]
  explanation: string
  priorityKeywords: string[]
  incorporationTips: string[]
  skillGaps: Array<{
    skill: string
    importance: 'critical' | 'important' | 'nice-to-have'
    reason: string
    learningTime: string
  }>
}

/**
 * Use Claude AI to suggest missing keywords and skills based on job context
 * More intelligent than simple keyword matching
 */
export async function suggestMissingKeywordsWithAI(
  cvText: string,
  jobDescription: string,
  jobTitle: string,
  industry?: string
): Promise<KeywordSuggestion> {
  const client = new Anthropic()

  const prompt = `You are an expert career coach and ATS optimizer.

Job Title: ${jobTitle}
${industry ? `Industry: ${industry}` : ''}

Job Description:
${jobDescription}

Candidate's CV:
${cvText}

Analyze this CV against the job posting and provide:

1. MISSING KEYWORDS: What 5-8 critical keywords/skills are missing from the CV that would help match this job?
2. EXPLANATION: Why are these keywords important for this specific role?
3. PRIORITY RANKING: Which keywords are MOST important to add? (prioritize top 3)
4. INCORPORATION TIPS: How can the candidate naturally incorporate these into their CV?
5. SKILL GAPS: What are the major skill gaps? How long to learn each?

Return ONLY valid JSON (no markdown, no code blocks):
{
  "suggestedKeywords": ["keyword1", "keyword2", "keyword3"],
  "explanation": "Why these keywords matter for this specific role...",
  "priorityKeywords": ["most critical keyword", "second critical", "third critical"],
  "incorporationTips": [
    "Tip 1 on how to add them",
    "Tip 2 on where to add them",
    "Tip 3 examples of context"
  ],
  "skillGaps": [
    {
      "skill": "Kubernetes",
      "importance": "critical",
      "reason": "Job requires container orchestration experience",
      "learningTime": "3-4 weeks with intensive study"
    }
  ]
}

IMPORTANT: Return ONLY the JSON object, no other text.`

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    // Extract text from response
    const responseText =
      response.content[0].type === 'text' ? response.content[0].text : ''

    // Parse JSON response
    const parsed = JSON.parse(responseText)

    return {
      suggestedKeywords: parsed.suggestedKeywords || [],
      explanation: parsed.explanation || '',
      priorityKeywords: parsed.priorityKeywords || [],
      incorporationTips: parsed.incorporationTips || [],
      skillGaps: parsed.skillGaps || []
    }
  } catch (error: any) {
    console.error('AI suggestion error:', error)

    // Fallback to empty suggestions if API fails
    return {
      suggestedKeywords: [],
      explanation: 'Could not generate AI suggestions at this time.',
      priorityKeywords: [],
      incorporationTips: [],
      skillGaps: []
    }
  }
}

/**
 * Generate targeted interview questions based on job and CV
 */
export async function generateInterviewQuestions(
  cvText: string,
  jobDescription: string,
  jobTitle: string
): Promise<{
  questions: Array<{
    question: string
    whyAsked: string
    suggestedAnswer: string
  }>
  tips: string[]
}> {
  const client = new Anthropic()

  const prompt = `You are an expert interviewer preparing someone for a job interview.

Job Title: ${jobTitle}

Job Description:
${jobDescription}

Candidate's CV:
${cvText}

Generate 5 specific interview questions likely to be asked for this role, tied to their CV and the job requirements.

For each question:
1. The actual question
2. Why it will be asked
3. A suggested answer framework based on their CV

Also provide 3-4 general interview tips for this role.

Return ONLY valid JSON (no markdown):
{
  "questions": [
    {
      "question": "Tell us about a time you...",
      "whyAsked": "This relates to the role's requirement of...",
      "suggestedAnswer": "Framework using STAR method: Your CV mentions... you could discuss..."
    }
  ],
  "tips": [
    "Tip 1",
    "Tip 2"
  ]
}

IMPORTANT: Return ONLY the JSON object, no other text.`

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const responseText =
      response.content[0].type === 'text' ? response.content[0].text : ''
    const parsed = JSON.parse(responseText)

    return {
      questions: parsed.questions || [],
      tips: parsed.tips || []
    }
  } catch (error: any) {
    console.error('Interview question generation error:', error)
    return {
      questions: [],
      tips: []
    }
  }
}

/**
 * Suggest salary range and negotiation tips based on role and candidate profile
 */
export async function generateSalaryGuidance(
  cvText: string,
  jobTitle: string,
  location: string,
  experienceYears?: number
): Promise<{
  salaryRange: {
    min: number
    max: number
    currency: string
  }
  negotiationTips: string[]
  benefitsToNegotiate: string[]
  redFlags: string[]
}> {
  const client = new Anthropic()

  const prompt = `You are a salary negotiation expert.

Job Title: ${jobTitle}
Location: ${location}
${experienceYears ? `Years of Experience: ${experienceYears}` : ''}

CV Summary:
${cvText.substring(0, 500)}...

Based on the job title, location, and candidate profile:

1. SALARY RANGE: What's the realistic salary range for this role in ${location}?
2. NEGOTIATION TIPS: 3-4 tips for negotiating this salary
3. BENEFITS TO NEGOTIATE: What non-salary benefits should they negotiate?
4. RED FLAGS: Any warning signs in how the job is described?

Return ONLY valid JSON:
{
  "salaryRange": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  },
  "negotiationTips": [
    "Tip 1",
    "Tip 2"
  ],
  "benefitsToNegotiate": [
    "Remote work flexibility",
    "Professional development budget"
  ],
  "redFlags": [
    "Red flag 1 if any"
  ]
}

IMPORTANT: Return ONLY the JSON object, no other text.`

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const responseText =
      response.content[0].type === 'text' ? response.content[0].text : ''
    const parsed = JSON.parse(responseText)

    return {
      salaryRange: parsed.salaryRange || { min: 0, max: 0, currency: 'USD' },
      negotiationTips: parsed.negotiationTips || [],
      benefitsToNegotiate: parsed.benefitsToNegotiate || [],
      redFlags: parsed.redFlags || []
    }
  } catch (error: any) {
    console.error('Salary guidance error:', error)
    return {
      salaryRange: { min: 0, max: 0, currency: 'USD' },
      negotiationTips: [],
      benefitsToNegotiate: [],
      redFlags: []
    }
  }
}
