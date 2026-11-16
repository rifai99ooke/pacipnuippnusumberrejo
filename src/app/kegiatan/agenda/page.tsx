'use client'

import { useState, useEffect } from 'react'
import { supabase, getStorageUrl } from '@/lib/supabase'

export default function AgendaPage() {
  const [filter, setFilter] = useState('semua')
  const [agendas, setAgendas] = useState<any[]>([])

  useEffect(() => {
    supabase.from('agenda')
      .select('*, program_kerja(nama, departemen)')
      .eq('published', true)
      .order('tanggal', { ascending: false })
      .then(({ data }) => setAgendas(data || []))
  }, [])

  const filtered = filter === 'semua' ? agendas
    : filter === 'akan_datang' || filter === 'selesai'
      ? agendas.filter(a => a.status === filter)
      : agendas.filter(a => a.jenis === filter)

  return (
    <>
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Agenda Kegiatan</h1>
          <p className="text-green-100 text-lg">Jadwal kegiatan PAC IPNU IPPNU Sumberrejo</p>
        </div>
      </section>

      <section className="bg-white border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-3 overflow-x-auto">
            {[
              { key: 'semua', label: 'Semua' },
              { key: 'akan_datang', label: 'Akan Datang' },
              { key: 'selesai', label: 'Selesai' },
              { key: 'proker', label: 'Agenda Proker' },
              { key: 'non-proker', label: 'Non-Proker' },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === f.key ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">Belum ada agenda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((a: any) => {
                const fotoUrl = getStorageUrl('agenda', a.foto)
                const tgl = a.tanggal ? new Date(a.tanggal) : null
                const isProker = a.jenis === 'proker'
                return (
                  <div key={a.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group">
                    {/* Foto */}
                    <div className={`relative aspect-video overflow-hidden ${isProker ? 'bg-gradient-to-br from-green-300 to-green-500' : 'bg-gradient-to-br from-blue-300 to-blue-500'}`}>
                      {fotoUrl && <img src={fotoUrl} alt={a.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                      {/* Badge jenis */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`text-white text-xs font-bold px-2.5 py-1 rounded-full ${isProker ? 'bg-green-600' : 'bg-blue-600'}`}>
                          {isProker ? 'Proker' : 'Non-Proker'}
                        </span>
                        <span className={`text-white text-xs font-bold px-2.5 py-1 rounded-full ${a.status === 'akan_datang' ? 'bg-emerald-500' : 'bg-gray-500'}`}>
                          {a.status === 'akan_datang' ? 'Akan Datang' : 'Selesai'}
                        </span>
                      </div>
                      {/* Tanggal */}
                      {tgl && (
                        <div className="absolute top-3 right-3 bg-white rounded-xl text-center px-3 py-2 shadow">
                          <p className={`font-black text-xl leading-none ${a.status === 'akan_datang' ? 'text-green-600' : 'text-gray-500'}`}>{tgl.getDate()}</p>
                          <p className="text-xs text-gray-500">{tgl.toLocaleString('id-ID', { month: 'short' }).toUpperCase()}</p>
                        </div>
                      )}
                    </div>

                    {/* Konten */}
                    <div className="p-5">
                      {/* Keterkaitan proker */}
                      {isProker && a.program_kerja && (
                        <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium mb-2">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          {a.program_kerja.nama}
                        </div>
                      )}
                      {!isProker && a.kategori && (
                        <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium mb-2">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {a.kategori}
                        </div>
                      )}

                      <h3 className="font-bold text-gray-900 mb-2">{a.judul}</h3>
                      {a.deskripsi && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{a.deskripsi}</p>}

                      <div className="space-y-1.5 text-xs text-gray-500">
                        {tgl && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            {a.waktu_mulai && ` • ${a.waktu_mulai.substring(0,5)}`}
                            {a.waktu_selesai && ` – ${a.waktu_selesai.substring(0,5)}`}
                          </div>
                        )}
                        {a.lokasi && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {a.lokasi}
                          </div>
                        )}
                        {a.penyelenggara && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {a.penyelenggara}
                          </div>
                        )}
                      </div>

                      {/* Laporan jika selesai */}
                      {a.status === 'selesai' && a.laporan && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs font-semibold text-gray-700 mb-1">Laporan Singkat:</p>
                          <p className="text-xs text-gray-500 line-clamp-3">{a.laporan}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
