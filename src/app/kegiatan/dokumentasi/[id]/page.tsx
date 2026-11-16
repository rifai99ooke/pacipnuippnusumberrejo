'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase, getStorageUrl } from '@/lib/supabase'

const PER_PAGE = 12

export default function DokumentasiDetailPage() {
  const params = useParams()
  const [album, setAlbum] = useState<any>(null)
  const [fotos, setFotos] = useState<any[]>([])
  const [lightbox, setLightbox] = useState<{ url: string; caption: string } | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    supabase.from('dokumentasi').select('id, nama_kegiatan, tanggal, deskripsi, cover_foto, agenda_id').eq('id', params.id).single()
      .then(async ({ data }) => {
        if (!data) return
        let agenda = null
        if (data.agenda_id) {
          const { data: ag } = await supabase.from('agenda').select('judul').eq('id', data.agenda_id).single()
          agenda = ag
        }
        setAlbum({ ...data, agenda })
      })
    supabase.from('dokumentasi_foto').select('*').eq('dokumentasi_id', params.id).order('urutan').order('created_at')
      .then(({ data }) => setFotos(data || []))
  }, [params.id])

  const totalPages = Math.ceil(fotos.length / PER_PAGE)
  const paginatedFotos = fotos.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  if (!album) return <div className="p-20 text-center text-gray-500">Memuat...</div>

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-green-200 mb-6">
            <Link href="/" className="hover:underline">Beranda</Link>
            <span>/</span>
            <Link href="/kegiatan/dokumentasi" className="hover:underline">Dokumentasi</Link>
            <span>/</span>
            <span className="text-white font-medium">{album.nama_kegiatan}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{album.nama_kegiatan}</h1>
          <div className="flex items-center gap-4 text-green-100 text-sm mt-2">
            <span>📅 {new Date(album.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            {album.agenda && <span>📋 {album.agenda.judul}</span>}
            <span>📷 {fotos.length} foto</span>
          </div>
          {album.deskripsi && <p className="text-green-100 mt-3 max-w-2xl">{album.deskripsi}</p>}
        </div>
      </section>

      {/* Grid Foto */}
      <section className="py-10 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {fotos.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center text-gray-500">Belum ada foto.</div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {paginatedFotos.map((f: any) => {
                  const url = getStorageUrl('dokumentasi', f.foto)
                  if (!url) return null
                  return (
                    <div key={f.id} className="group cursor-pointer"
                      onClick={() => setLightbox({ url, caption: f.caption || '' })}>
                      <div className="aspect-square rounded-xl overflow-hidden bg-gray-200">
                        <img src={url} alt={f.caption || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      {f.caption && (
                        <p className="text-xs text-gray-500 mt-1.5 text-center line-clamp-1">{f.caption}</p>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-white disabled:opacity-40 transition bg-gray-50">
                    ← Sebelumnya
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition ${page === n ? 'bg-green-600 text-white shadow-md' : 'border border-gray-300 text-gray-600 hover:bg-white bg-gray-50'}`}>
                      {n}
                    </button>
                  ))}

                  <button onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-white disabled:opacity-40 transition bg-gray-50">
                    Selanjutnya →
                  </button>
                </div>
              )}

              <p className="text-center text-xs text-gray-400 mt-3">
                Menampilkan {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, fotos.length)} dari {fotos.length} foto
              </p>
            </>
          )}

          <div className="mt-10">
            <Link href="/kegiatan/dokumentasi" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Dokumentasi
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-5 right-5 text-white hover:text-gray-300 transition" onClick={() => setLightbox(null)}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img src={lightbox.url} alt={lightbox.caption}
            className="max-w-full max-h-[80vh] rounded-xl object-contain"
            onClick={e => e.stopPropagation()} />
          {lightbox.caption && (
            <p className="text-white/80 text-sm mt-4 text-center max-w-lg">{lightbox.caption}</p>
          )}
        </div>
      )}
    </>
  )
}
