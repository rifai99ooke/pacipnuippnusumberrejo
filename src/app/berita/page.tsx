import Link from 'next/link'
import { supabase, getStorageUrl } from '@/lib/supabase'

export const metadata = { title: 'Berita' }
export const revalidate = 60
export const dynamic = 'force-dynamic'

const gradients = [
  'from-green-400 to-green-600',
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-orange-400 to-orange-600',
  'from-teal-400 to-teal-600',
  'from-indigo-400 to-indigo-600',
]

const PER_PAGE = 9

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params  = await searchParams
  const page    = Math.max(1, parseInt(params.page || '1'))
  const from    = (page - 1) * PER_PAGE
  const to      = from + PER_PAGE - 1

  const { data, count } = await supabase
    .from('berita')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('tanggal_publish', { ascending: false })
    .range(from, to)

  const beritas    = data || []
  const totalPages = Math.ceil((count || 0) / PER_PAGE)

  return (
    <>
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Berita</h1>
          <p className="text-green-100 text-lg">Update terkini seputar kegiatan PAC IPNU IPPNU Sumberrejo</p>
        </div>
      </section>

      <section className="py-14 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {beritas.length === 0 ? (
            <p className="text-center text-gray-500 py-16">Belum ada berita.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {beritas.map((b: any, i: number) => {
                  const fotoUrl = getStorageUrl('berita', b.foto)
                  const gradient = gradients[(from + i) % gradients.length]
                  const tglStr = new Date(b.tanggal_publish).toLocaleDateString('id-ID', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })

                  return (
                    <Link key={b.id} href={`/berita/${b.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group flex flex-col h-full">
                      {/* Foto */}
                      <div className={`relative overflow-hidden bg-gradient-to-br ${gradient}`}>
                        {fotoUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={fotoUrl} alt={b.judul}
                            className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500" />
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            {b.kategori}
                          </span>
                        </div>
                      </div>

                      {/* Konten */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {tglStr}
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Redaksi
                          </div>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors leading-snug line-clamp-3">
                          {b.judul}
                        </h3>

                        <p className="text-sm text-gray-500 mb-4 flex-1">
                          {b.ringkasan?.replace(/<[^>]*>/g, '') || ''}
                        </p>

                        <span className="text-green-600 text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                          Baca Selengkapnya
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
                  {/* Info */}
                  <p className="text-sm text-gray-500">
                    Menampilkan {from + 1}–{Math.min(from + PER_PAGE, count || 0)} dari {count} berita
                  </p>

                  {/* Tombol */}
                  <div className="flex items-center gap-1">
                    {/* Prev */}
                    {page > 1 ? (
                      <Link
                        href={`/berita?page=${page - 1}`}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 text-white hover:bg-green-600 transition text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </Link>
                    ) : (
                      <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-200 text-gray-400 text-sm cursor-not-allowed">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </span>
                    )}

                    {/* Nomor halaman */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      const isActive = p === page
                      const isNear = Math.abs(p - page) <= 1 || p === 1 || p === totalPages
                      if (!isNear) {
                        if (p === 2 && page > 3) return <span key={p} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                        if (p === totalPages - 1 && page < totalPages - 2) return <span key={p} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                        return null
                      }
                      return (
                        <Link
                          key={p}
                          href={`/berita?page=${p}`}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                            isActive
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-800 text-white hover:bg-green-600'
                          }`}
                        >
                          {p}
                        </Link>
                      )
                    })}

                    {/* Next */}
                    {page < totalPages ? (
                      <Link
                        href={`/berita?page=${page + 1}`}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 text-white hover:bg-green-600 transition text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ) : (
                      <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-200 text-gray-400 text-sm cursor-not-allowed">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
