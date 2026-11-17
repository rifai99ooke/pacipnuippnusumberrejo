import Link from 'next/link'
import { supabase, getStorageUrl } from '@/lib/supabase'

export const metadata = { title: 'Dokumentasi' }
export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function DokumentasiPage() {
  const { data } = await supabase
    .from('dokumentasi')
    .select('id, nama_kegiatan, tanggal, cover_foto, agenda_id')
    .order('tanggal', { ascending: false })

  // Hitung foto & ambil agenda terpisah (hindari FK join)
  const albums = await Promise.all((data || []).map(async (a: any) => {
    const { count } = await supabase.from('dokumentasi_foto').select('*', { count: 'exact', head: true }).eq('dokumentasi_id', a.id)
    let agenda = null
    if (a.agenda_id) {
      const { data: ag } = await supabase.from('agenda').select('judul').eq('id', a.agenda_id).single()
      agenda = ag
    }
    return { ...a, foto_count: count || 0, agenda }
  }))

  return (
    <>
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Dokumentasi</h1>
          <p className="text-green-100 text-lg">Kumpulan foto kegiatan PAC IPNU IPPNU Sumberrejo</p>
        </div>
      </section>

      <section className="py-14 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {albums.length === 0 ? (
            <div className="text-center py-16 text-gray-500">Belum ada dokumentasi.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((a: any) => {
                const coverUrl = getStorageUrl('dokumentasi', a.cover_foto)
                const jumlahFoto = a.foto_count || 0
                return (
                  <Link key={a.id} href={`/kegiatan/dokumentasi/${a.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group block">
                    {/* Cover */}
                    <div className="aspect-video relative bg-gradient-to-br from-green-200 to-green-400 overflow-hidden">
                      {coverUrl ? (
                        <img src={coverUrl} alt={a.nama_kegiatan} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-16 h-16 text-green-600 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {/* Jumlah foto */}
                      <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg font-medium backdrop-blur-sm">
                        📷 {jumlahFoto} foto
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-1">{a.nama_kegiatan}</h3>
                      {a.agenda && (
                        <p className="text-xs text-green-600 mb-1.5">📋 {a.agenda.judul}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        {new Date(a.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
