import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Gunakan service role key agar bisa upload ke storage
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Mapping nama prefix ke bucket Supabase Storage
function getBucket(name: string): string {
  if (name.startsWith('ketua_ipnu') || name.startsWith('ketua_ippnu')) return 'beranda'
  if (name.startsWith('pengurus'))   return 'pengurus'
  if (name.startsWith('estafet'))    return 'estafet'
  if (name.startsWith('agenda'))     return 'agenda'
  if (name.startsWith('dok_'))       return 'dokumentasi'
  if (name.startsWith('berita'))     return 'berita'
  if (name.startsWith('prestasi'))   return 'prestasi'
  return 'images' // bucket fallback
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const name = formData.get('name') as string

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext    = file.name.split('.').pop()
    const filename = `${name}_${Date.now()}.${ext}`
    const bucket   = getBucket(name)

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filename, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert:      false,
      })

    if (error) {
      console.error('Supabase storage error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Kembalikan public URL
    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(filename)

    return NextResponse.json({ path: urlData.publicUrl })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
