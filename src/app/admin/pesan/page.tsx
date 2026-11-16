'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface PesanMasuk {
  id: number
  nama: string
  kontak: string
  subjek: string
  pesan: string
  sudah_dibaca: boolean
  created_at: string
}

export default function PesanMasukPage() {
  const [pesanList, setPesanList] = useState<PesanMasuk[]>([])
  const [loading, setLoading] = useState(true)
  const [dipilih, setDipilih] = useState<PesanMasuk | null>(null)

  const muat = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('pesan_masuk')
      .select('*')
      .order('created_at', { ascending: false })
    setPesanList(data || [])
    setLoading(false)
  }

  useEffect(() => { muat() }, [])

  const tandaiBaca = async (id: number) => {
    await supabase.from('pesan_masuk').update({ sudah_dibaca: true }).eq('id', id)
    setPesanList((prev) => prev.map((p) => p.id === id ? { ...p, sudah_dibaca: true } : p))
    if (dipilih?.id === id) setDipilih((prev) => prev ? { ...prev, sudah_dibaca: true } : null)
  }

  const hapus = async (id: number) => {
    if (!confirm('Hapus pesan ini?')) return
    await supabase.from('pesan_masuk').delete().eq('id', id)
    setPesanList((prev) => prev.filter((p) => p.id !== id))
    if (dipilih?.id === id) setDipilih(null)
  }

  const belumDibaca = pesanList.filter((p) => !p.sudah_dibaca).length

  const bukaDetail = (p: PesanMasuk) => {
    setDipilih(p)
    if (!p.sudah_dibaca) tandaiBaca(p.id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pesan Masuk</h1>
          {belumDibaca > 0 && (
            <p className="text-sm text-green-600 mt-0.5">{belumDibaca} pesan belum dibaca</p>
          )}
        </div>
        <button
          onClick={muat}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Muat Ulang
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Memuat pesan...</div>
      ) : pesanList.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-16 text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p>Belum ada pesan masuk</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daftar Pesan */}
          <div className="space-y-3">
            {pesanList.map((p) => (
              <div
                key={p.id}
                onClick={() => bukaDetail(p)}
                className={`bg-white rounded-xl shadow-sm p-5 cursor-pointer border-2 transition hover:shadow-md ${
                  dipilih?.id === p.id ? 'border-green-500' : 'border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {!p.sudah_dibaca && (
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`font-semibold text-gray-900 truncate ${!p.sudah_dibaca ? '' : 'font-medium'}`}>
                      {p.nama}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(p.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-sm text-green-700 font-medium mt-1">{p.subjek}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.pesan}</p>
              </div>
            ))}
          </div>

          {/* Detail Pesan */}
          <div className="sticky top-6">
            {dipilih ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{dipilih.subjek}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {new Date(dipilih.created_at).toLocaleDateString('id-ID', {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => hapus(dipilih.id)}
                    className="text-red-400 hover:text-red-600 transition p-1"
                    title="Hapus pesan"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex gap-3">
                    <span className="text-sm font-medium text-gray-500 w-24 flex-shrink-0">Nama</span>
                    <span className="text-sm text-gray-900">{dipilih.nama}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-sm font-medium text-gray-500 w-24 flex-shrink-0">Kontak</span>
                    <span className="text-sm text-gray-900">{dipilih.kontak}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-sm font-medium text-gray-500 w-24 flex-shrink-0">Subjek</span>
                    <span className="text-sm text-gray-900">{dipilih.subjek}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Isi Pesan</p>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{dipilih.pesan}</p>
                </div>

                {/* Tombol balas via WA atau Email */}
                <div className="mt-5 flex gap-3">
                  {dipilih.kontak.match(/^(\+62|08)\d+$/) ? (
                    <a
                      href={`https://wa.me/${dipilih.kontak.replace(/^0/, '62').replace(/\s/g, '')}?text=Halo%20${encodeURIComponent(dipilih.nama)}%2C%20kami%20dari%20IPNU%20IPPNU%20PAC%20Sumberrejo%20ingin%20membalas%20pesan%20Anda%20terkait%20${encodeURIComponent(dipilih.subjek)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-green-700 transition text-center"
                    >
                      Balas via WhatsApp
                    </a>
                  ) : (
                    <a
                      href={`mailto:${dipilih.kontak}?subject=Re: ${encodeURIComponent(dipilih.subjek)}&body=Halo ${encodeURIComponent(dipilih.nama)},%0A%0A`}
                      className="flex-1 bg-green-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-green-700 transition text-center"
                    >
                      Balas via Email
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400">
                <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                </svg>
                <p className="text-sm">Klik pesan untuk melihat detail</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
