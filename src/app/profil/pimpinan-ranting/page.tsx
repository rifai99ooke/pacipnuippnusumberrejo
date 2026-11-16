'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function PimpinanRantingPage() {
  const [list, setList] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.from('pimpinan_ranting').select('*').order('urutan').then(({ data }) => setList(data || []))
  }, [])

  const filtered = list.filter(r =>
    r.nama.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-green-200 text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Garda Terdepan
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pimpinan Ranting<br />
            <span className="text-green-300">Se-Kecamatan Sumberrejo</span>
          </h1>
          <p className="text-green-100 max-w-2xl mx-auto">
            Daftar kepemimpinan PR IPNU & IPPNU di tingkat desa/kelurahan yang menjadi ujung tombak kaderisasi pelajar NU.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-2xl mx-auto px-4">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama desa atau ranting..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-16">
              {search ? `Tidak ada ranting dengan nama "${search}"` : 'Belum ada data pimpinan ranting.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((r: any) => (
                <PRPKCard key={r.id} data={r} label="PR" />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function PRPKCard({ data, label }: { data: any; label: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-black">{label}</span>
          </div>
          <h3 className="font-bold text-gray-900 uppercase text-sm leading-tight">{data.nama}</h3>
        </div>
        {data.tipe && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 capitalize flex-shrink-0">
            {data.tipe}
          </span>
        )}
      </div>

      {/* IPNU & IPPNU */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* IPNU */}
        <div className="bg-green-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">I</span>
            </div>
            <span className="text-green-700 text-xs font-bold">IPNU</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Ketua</p>
            <p className="text-sm text-gray-800 font-medium">{data.ketua_ipnu || '—'}</p>
          </div>
          <div className="mt-1.5">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Sekretaris</p>
            <p className="text-sm text-gray-800 font-medium">{data.sekretaris_ipnu || '—'}</p>
          </div>
        </div>

        {/* IPPNU */}
        <div className="bg-pink-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">I</span>
            </div>
            <span className="text-pink-700 text-xs font-bold">IPPNU</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Ketua</p>
            <p className="text-sm text-gray-800 font-medium">{data.ketua_ippnu || '—'}</p>
          </div>
          <div className="mt-1.5">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Sekretaris</p>
            <p className="text-sm text-gray-800 font-medium">{data.sekretaris_ippnu || '—'}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          {data.aktif ? 'Aktif' : 'Tidak Aktif'}
        </div>
        {data.periode && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {data.periode}
          </div>
        )}
      </div>
    </div>
  )
}
