'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getDepartemenList, type Departemen } from '@/lib/departemen'

export default function ProgramKerjaAdminPage() {
  const [depts, setDepts] = useState<Departemen[]>([])
  const [countMap, setCountMap] = useState<Record<string, number>>({})

  useEffect(() => {
    getDepartemenList().then(list => {
      // Filter: exclude BPH karena tidak punya proker
      setDepts(list.filter(d => d.tipe !== 'bph'))
    })
    // Hitung proker per departemen
    supabase.from('program_kerja').select('departemen').then(({ data }) => {
      const map: Record<string, number> = {}
      data?.forEach((p: any) => { map[p.departemen] = (map[p.departemen] || 0) + 1 })
      setCountMap(map)
    })
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Program Kerja</h1>
      <p className="text-gray-500 text-sm mb-8">Pilih departemen atau lembaga untuk mengelola program kerjanya</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {depts.map((d) => (
          <Link
            key={d.slug}
            href={`/admin/program-kerja/${d.slug}`}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${d.warna}20` }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: d.warna }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">{d.nama}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {countMap[d.slug] ? `${countMap[d.slug]} program kerja` : 'Belum ada proker'}
              </p>
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
