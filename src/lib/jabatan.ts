export const JABATAN_BY_TIPE: Record<string, string[]> = {
  'bph': [
    'Ketua',
    'Wakil Ketua',
    'Sekretaris 1',
    'Sekretaris 2',
    'Sekretaris 3',
    'Bendahara 1',
    'Bendahara 2',
    'Bendahara 3',
  ],
  'departemen': [
    'Koordinator',
    'Anggota',
  ],
  'lembaga': [
    'Komandan',
    'Wakil Komandan',
    'Sekretaris',
    'Bendahara',
    'Anggota',
  ],
}

// Slug BPH
const BPH_SLUGS = ['bph-ipnu', 'bph-ippnu']

// Slug Lembaga
const LEMBAGA_SLUGS = ['cbp', 'kpp', 'cbp-kpp']

export function getTipeFromSlug(slug: string): 'bph' | 'departemen' | 'lembaga' {
  if (BPH_SLUGS.includes(slug)) return 'bph'
  if (LEMBAGA_SLUGS.includes(slug)) return 'lembaga'
  return 'departemen'
}

export function getJabatanOptions(slug: string): string[] {
  const tipe = getTipeFromSlug(slug)
  return JABATAN_BY_TIPE[tipe] || JABATAN_BY_TIPE['departemen']
}
