'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const JABATAN_BY_TIPE: Record<string, string[]> = {
  bph:        ['Ketua', 'Wakil Ketua 1', 'Wakil Ketua 2', 'Wakil Ketua 3', 'Sekretaris', 'Sekretaris 1', 'Sekretaris 2', 'Sekretaris 3', 'Bendahara', 'Bendahara 1', 'Bendahara 2', 'Bendahara 3'],
  departemen: ['Koordinator', 'Anggota'],
  lembaga:    ['Komandan', 'Wakil Komandan', 'Sekretaris', 'Bendahara', 'Anggota'],
}

interface Props {
  value:        string
  onChange:     (val: string) => void
  slug?:        string
  tipe?:        string
  className?:   string
  usedJabatan?: string[]  // jabatan yang sudah terpakai (tidak bisa dipilih lagi)
}

export default function JabatanSelect({ value, onChange, slug, tipe: tipeProp, className, usedJabatan = [] }: Props) {
  const [options, setOptions] = useState<string[]>(JABATAN_BY_TIPE['departemen'])

  useEffect(() => {
    if (tipeProp && JABATAN_BY_TIPE[tipeProp]) {
      setOptions(JABATAN_BY_TIPE[tipeProp])
      return
    }
    if (!slug) return

    supabase.from('departemen').select('tipe').eq('slug', slug).maybeSingle()
      .then(({ data }) => {
        if (data?.tipe && JABATAN_BY_TIPE[data.tipe]) {
          setOptions(JABATAN_BY_TIPE[data.tipe])
        } else {
          const s = slug.toLowerCase()
          if (s.includes('bph') || s.includes('pengurus-harian')) {
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
      {options.map(opt => {
        const isTerpakai = usedJabatan.includes(opt) && opt !== value
        return (
          <option key={opt} value={opt} disabled={isTerpakai}>
            {isTerpakai ? `${opt} ✓ (sudah terisi)` : opt}
          </option>
        )
      })}
    </select>
  )
}
