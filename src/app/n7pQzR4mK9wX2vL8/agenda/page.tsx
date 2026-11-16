'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const statusColor: Record<string, string> = {
  akan_datang: 'bg-blue-100 text-blue-700',
  selesai:     'bg-green-100 text-green-700',
}

export default function AgendaAdminPage() {
  const [rows, setRows] = useState<any[]>([])
  const [filter, setFilter] = useState<'semua' | 'proker' | 'non-proker'>('semua')

  const load = async () => {
    let q = supabase.from('agenda').select('*, program_kerja(nama, departemen)').order('tanggal', { ascending: false })
    if (filter !== 'semua') q = q.eq('jenis', filter)
    const { data } = await q
    setRows(data || [])
  }

  useEffect(() => { load() }, [filter])

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus agenda ini?')) return
    await supabase.from('agenda').delete().eq('id', id)
    load()
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda Kegiatan</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola semua agenda Proker maupun Non-Proker</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/n7pQzR4mK9wX2vL8/agenda/tambah?jenis=proker"
            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition text-xs font-medium flex items-center gap-1.5 whitespace-nowrap">
            <span className="bg-white text-green-700 px-1 py-0.5 rounded font-bold text-xs">P</span>
            + Proker
          </Link>
          <Link href="/n7pQzR4mK9wX2vL8/agenda/tambah?jenis=non-proker"
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-xs font-medium flex items-center gap-1.5 whitespace-nowrap">
            <span className="bg-white text-blue-700 px-1 py-0.5 rounded font-bold text-xs">N</span>
            + Non-Proker
          </Link>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['semua', 'proker', 'non-proker'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize ${filter === f ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f === 'semua' ? 'Semua' : f === 'proker' ? 'Agenda Proker' : 'Agenda Non-Proker'}
          </button>
        ))}
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Kegiatan</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden sm:table-cell">Jenis</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden sm:table-cell">Tanggal</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden md:table-cell">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">Belum ada agenda.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 truncate max-w-[130px] sm:max-w-none">{r.judul}</p>
                  {r.jenis === 'proker' && r.program_kerja && (
                    <p className="text-xs text-green-600 mt-0.5 truncate max-w-[130px] sm:max-w-none">📋 {r.program_kerja.nama}</p>
                  )}
                  {r.jenis === 'non-proker' && r.kategori && (
                    <p className="text-xs text-blue-600 mt-0.5">🏷 {r.kategori}</p>
                  )}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.jenis === 'proker' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {r.jenis === 'proker' ? 'Proker' : 'Non-Proker'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs hidden sm:table-cell">
                  {r.tanggal ? new Date(r.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[r.status] || 'bg-gray-100 text-gray-600'}`}>
                    {r.status === 'akan_datang' ? 'Akan Datang' : 'Selesai'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/n7pQzR4mK9wX2vL8/agenda/edit/${r.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</Link>
                    <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
