import Link from 'next/link'
import { supabase, getStorageUrl } from '@/lib/supabase'

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function DepartemenDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Ambil info departemen dari database
  const { data: deptRow } = await supabase
    .from('departemen').select('*').eq('slug', slug).single()

  if (!deptRow) return <div className="p-20 text-center text-gray-500">Departemen tidak ditemukan.</div>

  const info = { nama: deptRow.nama, deskripsi: deptRow.deskripsi, warna: deptRow.warna }

  const { data: anggota } = await supabase
    .from('pengurus')
    .select('*')
    .eq('departemen', slug)
    .eq('aktif', true)
    .order('urutan')

  const list = anggota || []
  const koordinator = list.filter((a: any) =>
    a.jabatan?.toLowerCase().includes('koordinator')
  )
  const members = list.filter((a: any) =>
    !a.jabatan?.toLowerCase().includes('koordinator')
  )

  return (
    <>
      <section className="py-14 px-4" style={{ backgroundColor: info.warna }}>
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link href="/" className="hover:underline">Beranda</Link>
            <span>/</span>
            <Link href="/profil/struktur" className="hover:underline">Struktur</Link>
            <span>/</span>
            <span className="text-white font-medium">{info.nama}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{info.nama}</h1>
          <p className="text-white/80">{info.deskripsi}</p>
        </div>
      </section>

      {koordinator.length > 0 && (
        <section className="py-10 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-700 mb-6">Koordinator</h2>
            <div className="flex flex-wrap gap-4">
              {koordinator.map((k: any) => {
                const fotoUrl = getStorageUrl('pengurus', k.foto)
                return (
                  <div key={k.id} className="flex items-center gap-4 bg-gray-50 rounded-xl px-5 py-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: info.warna + '33' }}>
                      {fotoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={fotoUrl} alt={k.nama} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-bold" style={{ color: info.warna }}>{k.nama?.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{k.nama}</p>
                      <p className="text-xs font-medium mt-0.5" style={{ color: info.warna }}>{k.jabatan}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-700 mb-8">
            Anggota <span className="text-sm font-normal text-gray-500">({members.length} orang)</span>
          </h2>
          {members.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-500">Belum ada data anggota.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {members.map((a: any) => {
                const fotoUrl = getStorageUrl('pengurus', a.foto)
                const warna = a.organisasi === 'IPNU' ? '#16a34a' : '#db2777'
                return (
                  <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden" style={{ backgroundColor: warna + '22' }}>
                      {fotoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={fotoUrl} alt={a.nama} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xl font-bold" style={{ color: warna }}>{a.nama?.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{a.nama}</p>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: warna }}>{a.jabatan}</p>
                    <p className="text-xs text-gray-400">{a.organisasi}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <div className="py-8 bg-gray-50 max-w-7xl mx-auto px-4">
        <Link href="/profil/struktur" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Struktur
        </Link>
      </div>
    </>
  )
}
