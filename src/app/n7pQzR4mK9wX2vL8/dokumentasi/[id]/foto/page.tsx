'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, getStorageUrl } from '@/lib/supabase'

export default function KelolaFotoPage() {
  const params = useParams()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const albumId = params.id as string

  const [album, setAlbum] = useState<any>(null)
  const [fotos, setFotos] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [editCaption, setEditCaption] = useState<Record<number, string>>({})
  const [savingCaption, setSavingCaption] = useState<number | null>(null)

  // Pagination
  const [page, setPage] = useState(1)
  const PER_PAGE = 12

  const loadAlbum = async () => {
    const { data, error } = await supabase
      .from('dokumentasi')
      .select('id, nama_kegiatan, tanggal, deskripsi, cover_foto, agenda_id')
      .eq('id', albumId)
      .single()

    if (data && data.agenda_id) {
      const { data: agendaData } = await supabase
        .from('agenda')
        .select('judul')
        .eq('id', data.agenda_id)
        .single()
      setAlbum({ ...data, agenda: agendaData })
    } else {
      setAlbum(data)
    }
  }

  const loadFotos = async () => {
    const { data } = await supabase.from('dokumentasi_foto').select('*').eq('dokumentasi_id', albumId).order('urutan').order('created_at')
    setFotos(data || [])
  }

  useEffect(() => { loadAlbum(); loadFotos() }, [albumId])

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true); setProgress(0)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ext = file.name.split('.').pop()
      const filename = `dok_${albumId}_${Date.now()}_${i}.${ext}`

      // Upload ke local API
      const fd = new FormData()
      fd.append('file', file)
      fd.append('name', `dok_${albumId}_${i}`)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()

      if (json.path) {
        await supabase.from('dokumentasi_foto').insert({
          dokumentasi_id: parseInt(albumId),
          foto: json.path,
          urutan: fotos.length + i,
        })
      }

      setProgress(Math.round(((i + 1) / files.length) * 100))
    }

    setUploading(false)
    setProgress(0)
    e.target.value = ''
    loadFotos()

    // Set cover = foto pertama jika belum ada
    if (fotos.length === 0) {
      const { data: first } = await supabase.from('dokumentasi_foto').select('foto').eq('dokumentasi_id', albumId).order('urutan').limit(1).single()
      if (first) await supabase.from('dokumentasi').update({ cover_foto: first.foto }).eq('id', albumId)
    }
  }

  const handleDelete = async (fotoId: number, fotoPath: string) => {
    if (!confirm('Hapus foto ini?')) return
    await supabase.from('dokumentasi_foto').delete().eq('id', fotoId)
    // Update cover jika foto yang dihapus adalah cover
    if (album?.cover_foto === fotoPath) {
      const remaining = fotos.filter(f => f.id !== fotoId)
      const newCover = remaining[0]?.foto || null
      await supabase.from('dokumentasi').update({ cover_foto: newCover }).eq('id', albumId)
    }
    loadFotos(); loadAlbum()
  }

  const handleSetCover = async (fotoPath: string) => {
    await supabase.from('dokumentasi').update({ cover_foto: fotoPath }).eq('id', albumId)
    loadAlbum()
  }

  const handleSaveCaption = async (fotoId: number) => {
    setSavingCaption(fotoId)
    await supabase.from('dokumentasi_foto').update({ caption: editCaption[fotoId] || null }).eq('id', fotoId)
    setSavingCaption(null)
    loadFotos()
  }

  // Pagination
  const totalPages = Math.ceil(fotos.length / PER_PAGE)
  const paginatedFotos = fotos.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  if (!album) return <div className="p-10 text-center text-gray-500">Memuat...</div>

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button type="button" onClick={() => router.push('/n7pQzR4mK9wX2vL8/dokumentasi')} className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{album.nama_kegiatan}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
            <span>{new Date(album.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            {album.agenda && <span className="text-green-600">📋 {album.agenda.judul}</span>}
            <span className="font-medium text-gray-700">{fotos.length} foto</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-60 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload Foto
        </button>
        <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
      </div>

      {/* Progress upload */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-700">Mengupload foto...</p>
            <p className="text-sm text-blue-600">{progress}%</p>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Grid foto */}
      {fotos.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 mb-4">Belum ada foto. Klik "Upload Foto" untuk mulai.</p>
          <button onClick={() => fileRef.current?.click()} className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition text-sm font-medium">
            Upload Foto Sekarang
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {paginatedFotos.map((f: any) => {
              const url = getStorageUrl('dokumentasi', f.foto)
              const isCover = album?.cover_foto === f.foto
              return (
                <div key={f.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group">
                  {/* Foto */}
                  <div className="aspect-square relative">
                    {url ? (
                      <img src={url} alt={f.caption || ''} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                    {/* Cover badge */}
                    {isCover && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">Cover</div>
                    )}
                    {/* Overlay aksi */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!isCover && (
                        <button onClick={() => handleSetCover(f.foto)} title="Jadikan cover"
                          className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-yellow-600 transition">
                          Cover
                        </button>
                      )}
                      <button onClick={() => handleDelete(f.id, f.foto)}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-600 transition">
                        Hapus
                      </button>
                    </div>
                  </div>
                  {/* Caption */}
                  <div className="p-2">
                    <input
                      type="text"
                      value={editCaption[f.id] !== undefined ? editCaption[f.id] : (f.caption || '')}
                      onChange={e => setEditCaption(c => ({ ...c, [f.id]: e.target.value }))}
                      onBlur={() => handleSaveCaption(f.id)}
                      onKeyDown={e => e.key === 'Enter' && handleSaveCaption(f.id)}
                      placeholder="Tambah caption..."
                      className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-500 outline-none"
                    />
                    {savingCaption === f.id && <p className="text-xs text-green-600 mt-0.5">Menyimpan...</p>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition">
                ← Sebelumnya
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition ${page === n ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition">
                Selanjutnya →
              </button>
            </div>
          )}
          <p className="text-center text-xs text-gray-400 mt-2">{fotos.length} foto total • halaman {page} dari {totalPages}</p>
        </>
      )}
    </div>
  )
}
