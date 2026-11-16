import { supabase } from './supabase'

export interface Departemen {
  id: number
  slug: string
  nama: string
  tipe: 'bph' | 'departemen' | 'lembaga'
  warna: string
  deskripsi: string
  urutan: number
  aktif: boolean
}

export async function getDepartemenList(): Promise<Departemen[]> {
  const { data } = await supabase
    .from('departemen')
    .select('*')
    .eq('aktif', true)
    .order('urutan')
  return (data || []) as Departemen[]
}

export async function getDepartemenBySlug(slug: string): Promise<Departemen | null> {
  const { data } = await supabase
    .from('departemen')
    .select('*')
    .eq('slug', slug)
    .single()
  return data as Departemen | null
}
