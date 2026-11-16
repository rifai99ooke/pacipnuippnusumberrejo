'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import DataTable from '@/components/admin/DataTable'

export default function AdminBeritaPage() {
  const [rows, setRows] = useState<any[]>([])
  const router = useRouter()

  const load = () => supabase.from('berita').select('*').order('tanggal_publish', { ascending: false }).then(({ data }) => setRows(data || []))

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    await supabase.from('berita').delete().eq('id', id)
    load()
  }

  return (
    <DataTable
      title="Berita"
      addHref="/admin/berita/tambah"
      columns={[
        { key: 'judul',            label: 'Judul' },
        { key: 'kategori',         label: 'Kategori',  hideOnMobile: true },
        { key: 'tanggal_publish',  label: 'Tanggal',   hideOnMobile: true },
        { key: 'published',        label: 'Status',    hideOnMobile: false },
      ]}
      rows={rows}
      onDelete={handleDelete}
      editHref={(id) => `/admin/berita/edit/${id}`}
      renderCell={(key, row) => {
        if (key === 'tanggal_publish') return new Date(row.tanggal_publish).toLocaleDateString('id-ID')
        if (key === 'published') return <span className={`px-2 py-1 text-xs rounded-full font-medium ${row.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{row.published ? 'Published' : 'Draft'}</span>
        if (key === 'judul') return <span className="line-clamp-1">{row.judul}</span>
        return row[key]
      }}
    />
  )
}
