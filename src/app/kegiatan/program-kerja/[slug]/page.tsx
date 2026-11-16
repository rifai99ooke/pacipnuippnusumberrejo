import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function ProkerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Fetch info dari database
  const { data: deptRow } = await supabase
    .from('departemen').select('*').eq('slug', slug).single()

  if (!deptRow) return <div className="p-20 text-center text-gray-500">Departemen tidak ditemukan.</div>

  const info = { nama: deptRow.nama, deskripsi: deptRow.deskripsi }

  const { data } = await supabase
    .from('program_kerja')
    .select('*')
    .eq('departemen', slug)
    .order('urutan')

  const list = data || []

  return (
    <>
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-green-200 mb-6">
            <Link href="/" className="hover:underline">Beranda</Link>
            <span>/</span>
            <Link href="/kegiatan/program-kerja" className="hover:underline">Program Kerja</Link>
            <span>/</span>
            <span className="text-white font-medium">{info.nama}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{info.nama}</h1>
          <p className="text-green-100">{info.deskripsi}</p>
        </div>
      </section>

      <section className="py-14 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">Daftar Program Kerja</h2>
              <span className="text-sm text-gray-500">{list.length} program</span>
            </div>

            {list.length === 0 ? (
              <div className="p-12 text-center text-gray-500">Belum ada program kerja untuk departemen ini.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {list.map((item: any, i: number) => (
                  <div key={item.id} className="px-6 py-5 hover:bg-gray-50 transition">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <p className="font-semibold text-gray-900">{item.nama}</p>
                        {item.keterangan && <p className="text-sm text-gray-500">{item.keterangan}</p>}
                        {item.tujuan && <p className="text-sm text-gray-600 italic">🎯 {item.tujuan}</p>}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.frekuensi && <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">{item.frekuensi}</span>}
                          {item.waktu_pelaksanaan && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                              📅 {new Date(item.waktu_pelaksanaan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          )}
                          {item.status && (
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              item.status === 'Terlaksana'      ? 'bg-green-100 text-green-700' :
                              item.status === 'Sedang Berjalan' ? 'bg-blue-100 text-blue-700' :
                              item.status === 'Ditunda'         ? 'bg-yellow-100 text-yellow-700' :
                              item.status === 'Dibatalkan'      ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>{item.status}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <Link href="/kegiatan/program-kerja" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Program Kerja
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
