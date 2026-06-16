import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json({ error: 'File type not permitted' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'File exceeds 10MB limit' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
    if (!['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx'].includes(ext)) {
      return Response.json({ error: 'File extension not permitted' }, { status: 400 })
    }
    const fileName = `${user.id}/${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { data, error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(fileName, buffer, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return Response.json({ error: 'Upload failed' }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('attachments')
      .getPublicUrl(data.path)

    return Response.json({ url: publicUrl, name: file.name, type: file.type })
  } catch (err) {
    console.error('Upload route error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
