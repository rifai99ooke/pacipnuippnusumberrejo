'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDepartemenList, type Departemen } from '@/lib/departemen'

export default function DepartemenIndexPage() {
  const [depts, setDepts] = useState<Departemen[]>([])

  useEffect(() => {
    getDepartemenList().then(setDepts)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Pengurus</h1>
      <p className="text-gray-500 text-sm mb-8">Pilih BPH, departemen, atau lembaga untuk mengelola anggotanya</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {depts.map((d) => (
          <Link
            key={d.slug}
            href={`/n7pQzR4mK9wX2vL8/pengurus/departemen/${d.slug}`}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${d.warna}20` }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: d.warna }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">{d.nama}</p>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">{d.tipe}</p>
            </div>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}
