import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'public' },
  auth: { persistSession: true },
})

export function getStorageUrl(bucket: string, path: string | null): string | null {
  if (!path) return null
  // Kalau sudah path lokal (/images/...) langsung return
  if (path.startsWith('/') || path.startsWith('http')) return path
  // Kalau path Supabase Storage
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
