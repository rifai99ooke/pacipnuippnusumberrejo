import Link from 'next/link'
import { supabase, getStorageUrl } from '@/lib/supabase'

export const revalidate = 60
export const metadata = { title: 'Struktur Kepengurusan' }

function Avatar({ foto, nama, size = 'md' }: { foto: string | null; nama: string; size?: 'sm' | 'md' | 'lg' }) {
  const url = foto ? getStorageUrl('pengurus', foto) : null
  const sz  = size === 'lg' ? 'w-20 h-20' : size === 'md' ? 'w-14 h-14' : 'w-10 h-10'
  const fs  = size === 'lg' ? 24 : size === 'md' ? 18 : 13
  return (
    <div className={`${sz} rounded-xl overflow-hidden bg-green-100 flex-shrink-0 mx-auto`}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={nama} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="font-bold text-green-600" style={{ fontSize: fs }}>{nama?.charAt(0)}</span>
        </div>
      )}
    </div>
  )
}

// Satu baris: IPNU kiri, IPPNU kanan
function BphRow({
  ipnu, ippnu, label,
}: {
  ipnu:  { nama: string; foto: string | null } | null
  ippnu: { nama: string; foto: string | null } | null
  label?: string
}) {
  const size = label === undefined ? 'lg' : 'md'
  return (
    <div className="grid grid-cols-2 gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* Kiri — IPNU */}
      <div className="flex flex-col items-center gap-2">
        <Avatar foto={ipnu?.foto ?? null} nama={ipnu?.nama ?? '?'} size={size} />
        <div className="text-center">
          <p className="text-sm font-bold text-gray-900 leading-tight">{ipnu?.nama ?? '—'}</p>
          {label !== undefined && <p className="text-xs text-green-600 mt-0.5">{label} · IPNU</p>}
        </div>
      </div>
      {/* Kanan — IPPNU */}
      <div className="flex flex-col items-center gap-2">
        <Avatar foto={ippnu?.foto ?? null} nama={ippnu?.nama ?? '?'} size={size} />
        <div className="text-center">
          <p className="text-sm font-bold text-gray-900 leading-tight">{ippnu?.nama ?? '—'}</p>
          {label !== undefined && <p className="text-xs text-green-600 mt-0.5">{label} · IPPNU</p>}
        </div>
      </div>
    </div>
  )
}

// Card BPH — satu kelompok jabatan (Ketua, Sekretaris, Bendahara)
function BphCard({
  title, ipnu, ippnu, mainJabatan, wakaPrefix,
}: {
  title:       string
  ipnu:        any[]
  ippnu:       any[]
  mainJabatan: string   // e.g. 'Ketua', 'Sekretaris 1', 'Bendahara 1'
  wakaPrefix:  string   // e.g. 'Wakil Ketua', 'Sekretaris', 'Bendahara'
}) {
  const findMain = (list: any[]) =>
    list.find(p => p.jabatan === mainJabatan) ??
    list.find(p => p.jabatan === wakaPrefix) ??
    null

  const findWakas = (list: any[], count: number) => {
    const result: (any | null)[] = []
    for (let i = 1; i <= count; i++) {
      result.push(list.find(p => p.jabatan === `${wakaPrefix} ${i}`) ?? null)
    }
    return result
  }

  const mainIpnu  = findMain(ipnu)
  const mainIppnu = findMain(ippnu)

  // Hitung max waka yang ada
  const wakaIpnu  = findWakas(ipnu,  3)
  const wakaIppnu = findWakas(ippnu, 3)
  const hasWaka   = wakaIpnu.some(Boolean) || wakaIppnu.some(Boolean)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-green-600 px-5 py-3 text-center">
        <h3 className="text-white font-bold text-sm tracking-widest uppercase">{title}</h3>
      </div>

      <div className="px-4 py-2">
        {/* Header kolom */}
        <div className="grid grid-cols-2 gap-4 pb-2 mb-2 border-b border-gray-100">
          <p className="text-center text-xs font-bold text-green-600 uppercase tracking-wider">IPNU</p>
          <p className="text-center text-xs font-bold text-green-600 uppercase tracking-wider">IPPNU</p>
        </div>

        {/* Baris utama (Ketua/Sekretaris/Bendahara) */}
        <BphRow ipnu={mainIpnu} ippnu={mainIppnu} />

        {/* Baris Wakil */}
        {hasWaka && wakaIpnu.map((w, i) => {
          const wIppnu = wakaIppnu[i]
          if (!w && !wIppnu) return null
          const wakaLabel = wakaPrefix === 'Wakil Ketua'
            ? `Wakil Ketua ${i + 1}`
            : `Waka. ${wakaPrefix.replace(/\s*\d+$/, '')} ${i + 2}`
          return (
            <div key={i} className="grid grid-cols-2 gap-4 py-3 border-b border-gray-50 last:border-0">
              {/* IPNU */}
              <div className="flex flex-col items-center gap-1.5">
                <Avatar foto={w?.foto ?? null} nama={w?.nama ?? '?'} size="sm" />
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-800 leading-tight">{w?.nama ?? '—'}</p>
                  <p className="text-xs text-gray-400">{wakaLabel}</p>
                </div>
              </div>
              {/* IPPNU */}
              <div className="flex flex-col items-center gap-1.5">
                <Avatar foto={wIppnu?.foto ?? null} nama={wIppnu?.nama ?? '?'} size="sm" />
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-800 leading-tight">{wIppnu?.nama ?? '—'}</p>
                  <p className="text-xs text-gray-400">{wakaLabel}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PengurusCard({ p }: { p: any }) {
  const fotoUrl = getStorageUrl('pengurus', p.foto)
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
      <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden bg-gray-200">
        {fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fotoUrl} alt={p.nama} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-100">
            <span className="text-xl font-bold text-green-600">{p.nama?.charAt(0)}</span>
          </div>
        )}
      </div>
      <p className="font-semibold text-gray-900 text-sm">{p.nama}</p>
      <p className="text-xs font-medium mt-1 text-green-600">{p.jabatan}</p>
    </div>
  )
}

export default async function StrukturPage() {
  const { data: deptData } = await supabase.from('departemen').select('*').eq('aktif', true).order('urutan')
  const semuaDept  = deptData || []
  const departemen = semuaDept.filter((d: any) => d.tipe === 'departemen')
  const lembaga    = semuaDept.filter((d: any) => d.tipe === 'lembaga')

  const [bphIpnuRes, bphIppnuRes, harianRes] = await Promise.all([
    supabase.from('pengurus').select('*').eq('aktif', true).eq('departemen', 'bph-ipnu').order('urutan'),
    supabase.from('pengurus').select('*').eq('aktif', true).eq('departemen', 'bph-ippnu').order('urutan'),
    supabase.from('pengurus').select('*').eq('aktif', true).is('departemen', null).order('urutan'),
  ])

  const ipnu   = bphIpnuRes.data  || []
  const ippnu  = bphIppnuRes.data || []
  const harian = harianRes.data   || []
  const hasBph = ipnu.length > 0 || ippnu.length > 0

  return (
    <>
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Struktur Kepengurusan</h1>
        </div>
      </section>

      {/* BPH */}
      {hasBph && (
        <section className="py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Judul */}
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 h-px bg-gray-200" />
              <h2 className="text-xl font-black text-gray-900 tracking-wide uppercase">Badan Pengurus Harian</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="space-y-6">
              {/* Card Ketua */}
              <BphCard
                title="Ketua"
                ipnu={ipnu}
                ippnu={ippnu}
                mainJabatan="Ketua"
                wakaPrefix="Wakil Ketua"
              />

              {/* Card Sekretaris */}
              <BphCard
                title="Sekretaris"
                ipnu={ipnu}
                ippnu={ippnu}
                mainJabatan="Sekretaris 1"
                wakaPrefix="Sekretaris"
              />

              {/* Card Bendahara */}
              <BphCard
                title="Bendahara"
                ipnu={ipnu}
                ippnu={ippnu}
                mainJabatan="Bendahara 1"
                wakaPrefix="Bendahara"
              />
            </div>
          </div>
        </section>
      )}

      {/* Pengurus lama */}
      {harian.length > 0 && (
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-gray-400 rounded-full" />
              <h2 className="text-2xl font-bold text-gray-900">Pengurus Harian</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {harian.map((p: any) => <PengurusCard key={p.id} p={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Departemen */}
      {departemen.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Departemen & Bidang</h2>
              <p className="text-gray-600">Klik departemen untuk melihat detail anggota</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departemen.map((d: any) => (
                <Link key={d.slug} href={`/profil/departemen/${d.slug}`}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group block">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">{d.nama}</h3>
                  <p className="text-gray-600 text-sm mb-4">{d.deskripsi}</p>
                  <div className="flex justify-end">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lembaga */}
      {lembaga.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Lembaga</h2>
              <p className="text-gray-600">Lembaga semi-otonom di bawah PAC IPNU IPPNU Sumberrejo</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {lembaga.map((l: any) => (
                <Link key={l.slug} href={`/profil/lembaga/${l.slug}`}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group block">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">{l.nama}</h3>
                  <p className="text-gray-600 text-sm mb-4">{l.deskripsi}</p>
                  <div className="flex justify-end">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
