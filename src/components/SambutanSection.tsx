'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getStorageUrl } from '@/lib/supabase'

export default function SambutanSection({ beranda }: { beranda: any }) {
  const [active, setActive] = useState<'ipnu' | 'ippnu'>('ipnu')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const ipnuFoto = beranda?.foto_ketua_ipnu
    ? (beranda.foto_ketua_ipnu.startsWith('/') ? beranda.foto_ketua_ipnu : getStorageUrl('beranda', beranda.foto_ketua_ipnu))
    : '/images/Ketua_IPNU.jpg'
  const ippnuFoto = beranda?.foto_ketua_ippnu
    ? (beranda.foto_ketua_ippnu.startsWith('/') ? beranda.foto_ketua_ippnu : getStorageUrl('beranda', beranda.foto_ketua_ippnu))
    : '/images/Ketua_IPPNU.jpg'

  const data = {
    ipnu: {
      nama: beranda.nama_ketua_ipnu,
      jabatan: beranda.jabatan_ketua_ipnu,
      foto: ipnuFoto,
      sambutan: beranda.sambutan_ketua_ipnu,
      tagline: beranda.tagline_ketua_ipnu,
      label: 'SAMBUTAN KETUA IPNU',
    },
    ippnu: {
      nama: beranda.nama_ketua_ippnu,
      jabatan: beranda.jabatan_ketua_ippnu,
      foto: ippnuFoto,
      sambutan: beranda.sambutan_ketua_ippnu,
      tagline: beranda.tagline_ketua_ippnu,
      label: 'SAMBUTAN KETUA IPPNU',
    },
  }

  const current = data[active]

  /* ── MOBILE LAYOUT ─────────────────────────────────────── */
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">

        {/* Foto — proporsional penuh */}
        <div
          className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg cursor-pointer"
          onClick={() => setActive(active === 'ipnu' ? 'ippnu' : 'ipnu')}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={active}
            src={current.foto || ''}
            alt={current.nama}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-xl font-bold text-white">{current.nama}</h3>
            <p className="text-white/80 text-sm">{current.jabatan}</p>
          </div>
        </div>

        {/* Tombol pilih IPNU / IPPNU */}
        <div className="flex gap-3">
          <button
            onClick={() => setActive('ipnu')}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${active === 'ipnu' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            IPNU
          </button>
          <button
            onClick={() => setActive('ippnu')}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${active === 'ippnu' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            IPPNU
          </button>
        </div>

        {/* Teks sambutan — scroll di dalam kotak */}
        <div
          className="bg-white rounded-2xl shadow p-4 space-y-4"
          style={{ maxHeight: '55vh', overflowY: 'auto' }}
        >
          <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
            <div className="w-10 h-0.5 bg-green-600" />
            <span>{current.label}</span>
          </div>
          {current.sambutan && (
            <div
              className="prose prose-sm max-w-none text-gray-600
                prose-p:mb-3 prose-p:leading-relaxed
                prose-strong:text-gray-800
                prose-ul:my-2 prose-li:my-0.5
                prose-headings:text-gray-800 prose-headings:font-semibold"
              dangerouslySetInnerHTML={{ __html: current.sambutan }}
            />
          )}
          {current.tagline && (
            <p className="text-lg font-bold text-gray-900">{current.tagline}</p>
          )}
          <Link href="/profil/struktur" className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm">
            Lihat Struktur Kepengurusan
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  /* ── DESKTOP LAYOUT ─────────────────────────────────────── */
  return (
    <div className="grid grid-cols-2 gap-12">
      {/* Foto — sticky */}
      <div className="sticky top-24 self-start">
        <div
          className="aspect-[3/4] bg-gray-200 rounded-2xl overflow-hidden shadow-xl cursor-pointer relative group"
          onClick={() => setActive(active === 'ipnu' ? 'ippnu' : 'ipnu')}
        >
          {current.foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={active} src={current.foto} alt={current.nama} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
              <div className="w-24 h-24 bg-green-200 rounded-full flex items-center justify-center">
                <span className="text-green-700 text-3xl font-bold">{current.nama?.charAt(0)}</span>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h3 className="text-2xl font-bold text-white">{current.nama}</h3>
            <p className="text-white/90 text-sm">{current.jabatan}</p>
          </div>
          <div className="absolute top-4 right-4 bg-white/90 rounded-full px-3 py-1 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
            Klik untuk ganti
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setActive('ipnu')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${active === 'ipnu' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            IPNU
          </button>
          <button
            onClick={() => setActive('ippnu')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${active === 'ippnu' ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            IPPNU
          </button>
        </div>
      </div>

      {/* Konten — tampil penuh tanpa scroll */}
      <div key={active} className="space-y-5">
        <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
          <div className="w-12 h-0.5 bg-green-600" />
          <span>{current.label}</span>
        </div>
        {current.sambutan && (
          <div
            className="prose prose-sm max-w-none text-gray-600
              prose-p:mb-3 prose-p:leading-relaxed
              prose-strong:text-gray-800
              prose-ul:my-2 prose-li:my-0.5
              prose-headings:text-gray-800 prose-headings:font-semibold"
            dangerouslySetInnerHTML={{ __html: current.sambutan }}
          />
        )}
        {current.tagline && (
          <p className="text-xl font-bold text-gray-900">{current.tagline}</p>
        )}
        <Link href="/profil/struktur" className="inline-flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all">
          Lihat Struktur Kepengurusan
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
