'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, getStorageUrl } from '@/lib/supabase'

export default function DokumentasiAdminPage() {
  const [albums, setAlbums] = useState<any[]>([])

  const load = async () => {
    const { data } = await supabase
      .from('dokumentasi')
      .select('id, nama_kegiatan, tanggal, cover_foto, agenda_id')
      .order('created_at', { ascending: false })

    if (!data) { setAlbums([]); return }

    const albumsWithInfo = await Promise.all(data.map(async (a: any) => {
      const { count } = await supabase.from('dokumentasi_foto').select('*', { count: 'exact', head: true }).eq('dokumentasi_id', a.id)
      let agenda = null
      if (a.agenda_id) {
        const { data: ag } = await supabase.from('agenda').select('judul').eq('id', a.agenda_id).single()
        agenda = ag
      }
      return { ...a, foto_count: count || 0, agenda }
    }))

    setAlbums(albumsWithInfo)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus album ini beserta semua fotonya?')) return
    await supabase.from('dokumentasi').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dokumentasi</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola album foto kegiatan</p>
        </div>
        <Link href="/admin/dokumentasi/tambah"
          className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition text-sm font-medium">
          + Buat Album
        </Link>
      </div>

      {albums.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center text-gray-500">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Belum ada album. Klik "+ Buat Album" untuk memulai.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {albums.map((a: any) => {
            const coverUrl = getStorageUrl('dokumentasi', a.cover_foto)
            const jumlahFoto = a.foto_count || 0
            return (
              <div key={a.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
                {/* Cover */}
                <div className="aspect-video bg-gradient-to-br from-green-200 to-green-400 relative">
                  {coverUrl && (
                    <img src={coverUrl} alt={a.nama_kegiatan} className="w-full h-full object-cover" />
                  )}
                  {!coverUrl && (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-green-600 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg font-medium">
                    {jumlahFoto} foto
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{a.nama_kegiatan}</h3>
                  {a.agenda && (
                    <p className="text-xs text-green-600 mb-1">📋 {a.agenda.judul}</p>
                  )}
                  <p className="text-xs text-gray-400 mb-3">
                    {new Date(a.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/dokumentasi/${a.id}/foto`}
                      className="flex-1 text-center py-2 text-sm font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition">
                      Kelola Foto
                    </Link>
                    <Link href={`/admin/dokumentasi/edit/${a.id}`}
                      className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(a.id)}
                      className="px-3 py-2 text-sm font-medium text-red-500 hover:text-red-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
