'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const JABATAN_BY_TIPE: Record<string, string[]> = {
  bph:        ['Ketua', 'Wakil Ketua', 'Sekretaris 1', 'Sekretaris 2', 'Sekretaris 3', 'Bendahara 1', 'Bendahara 2', 'Bendahara 3'],
  departemen: ['Koordinator', 'Anggota'],
  lembaga:    ['Komandan', 'Wakil Komandan', 'Sekretaris', 'Bendahara', 'Anggota'],
}

interface Props {
  value: string
  onChange: (val: string) => void
  slug: string
  tipe?: string   // ← bisa di-pass langsung dari parent
  className?: string
}

export default function JabatanSelect({ value, onChange, slug, tipe: tipeProp, className }: Props) {
  const [options, setOptions] = useState<string[]>(JABATAN_BY_TIPE['departemen'])

  useEffect(() => {
    // Kalau tipe sudah di-pass langsung, pakai itu
    if (tipeProp && JABATAN_BY_TIPE[tipeProp]) {
      setOptions(JABATAN_BY_TIPE[tipeProp])
      return
    }

    if (!slug) return

    // Fetch tipe dari database
    supabase.from('departemen').select('tipe').eq('slug', slug).maybeSingle()
      .then(({ data }) => {
        if (data?.tipe && JABATAN_BY_TIPE[data.tipe]) {
          setOptions(JABATAN_BY_TIPE[data.tipe])
        } else {
          // Fallback pattern matching
          const s = slug.toLowerCase()
          if (s.includes('bph') || s === 'pbh' || s.includes('pengurus-harian')) {
            setOptions(JABATAN_BY_TIPE['bph'])
          } else if (s.includes('cbp') || s.includes('kpp') || s.includes('lembaga')) {
            setOptions(JABATAN_BY_TIPE['lembaga'])
          } else {
            setOptions(JABATAN_BY_TIPE['departemen'])
          }
        }
      })
  }, [slug, tipeProp])

  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={className}>
      <option value="">— Pilih Jabatan —</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  )
}
