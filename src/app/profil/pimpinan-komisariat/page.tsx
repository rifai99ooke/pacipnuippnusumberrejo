'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

function PKCard({ data }: { data: any }) {
  const tipeColor: Record<string, string> = {
    sekolah: 'bg-blue-100 text-blue-700',
    pesantren: 'bg-amber-100 text-amber-700',
    madrasah: 'bg-purple-100 text-purple-700',
    kampus: 'bg-green-100 text-green-700',
  }
  const bgColor = tipeColor[data.tipe?.toLowerCase()] || 'bg-gray-100 text-gray-700'

  const tipeIcon: Record<string, string> = {
    sekolah: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    pesantren: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z',
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d={tipeIcon[data.tipe?.toLowerCase()] || tipeIcon.sekolah} />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 text-sm leading-snug mt-1">{data.nama}</h3>
        </div>
        {data.tipe && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize flex-shrink-0 uppercase ${bgColor}`}>
            {data.tipe}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-green-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">I</span>
            </div>
            <span className="text-green-700 text-xs font-bold">IPNU</span>
          </div>
          <div><p className="text-xs text-gray-500 uppercase tracking-wide">Ketua</p><p className="text-sm text-gray-800 font-medium">{data.ketua_ipnu || '—'}</p></div>
          <div className="mt-1.5"><p className="text-xs text-gray-500 uppercase tracking-wide">Sekretaris</p><p className="text-sm text-gray-800 font-medium">{data.sekretaris_ipnu || '—'}</p></div>
        </div>
        <div className="bg-pink-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">I</span>
            </div>
            <span className="text-pink-700 text-xs font-bold">IPPNU</span>
          </div>
          <div><p className="text-xs text-gray-500 uppercase tracking-wide">Ketua</p><p className="text-sm text-gray-800 font-medium">{data.ketua_ippnu || '—'}</p></div>
          <div className="mt-1.5"><p className="text-xs text-gray-500 uppercase tracking-wide">Sekretaris</p><p className="text-sm text-gray-800 font-medium">{data.sekretaris_ippnu || '—'}</p></div>
        </div>
      </div>

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

export default function PimpinanKomisariatPage() {
  const [list, setList] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filterTipe, setFilterTipe] = useState('semua')

  useEffect(() => {
    supabase.from('pimpinan_komisariat').select('*').order('urutan').then(({ data }) => setList(data || []))
  }, [])

  const tipes = ['semua', ...Array.from(new Set(list.map(d => d.tipe).filter(Boolean)))]
  const filtered = list.filter(r => {
    const matchSearch = r.nama.toLowerCase().includes(search.toLowerCase())
    const matchTipe = filterTipe === 'semua' || r.tipe === filterTipe
    return matchSearch && matchTipe
  })

  return (
    <>
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-green-200 text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            Basis Pelajar & Santri
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pimpinan Komisariat<br />
            <span className="text-green-300">Sekolah & Pesantren</span>
          </h1>
          <p className="text-green-100 max-w-2xl mx-auto">
            Wadah kaderisasi IPNU IPPNU di lembaga pendidikan formal dan non-formal se-Kecamatan Sumberrejo yang aktif dan progresif.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 space-y-3">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama komisariat..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-500 outline-none text-sm" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {tipes.map(t => (
              <button key={t} onClick={() => setFilterTipe(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${filterTipe === t ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-16">Belum ada data pimpinan komisariat.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((r: any) => <PKCard key={r.id} data={r} />)}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
