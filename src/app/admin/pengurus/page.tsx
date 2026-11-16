'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import DataTable from '@/components/admin/DataTable'

const columns = [
  { key: 'nama', label: 'Nama' },
  { key: 'jabatan', label: 'Jabatan' },
  { key: 'organisasi', label: 'Organisasi' },
  { key: 'departemen', label: 'Departemen' },
  { key: 'aktif', label: 'Status' },
]

export default function PengurusAdminPage() {
  const [rows, setRows] = useState<any[]>([])

  async function load() {
    const { data } = await supabase.from('pengurus').select('*').order('urutan', { ascending: true })
    setRows(data ?? [])
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    await supabase.from('pengurus').delete().eq('id', id)
    load()
  }

  function renderCell(key: string, row: any) {
    if (key === 'aktif') {
      return (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${row.aktif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
          {row.aktif ? 'Aktif' : 'Non-aktif'}
        </span>
      )
    }
    return row[key] ?? '-'
  }

  return (
    <DataTable
      title="Pengurus"
      addHref="/admin/pengurus/tambah"
      columns={columns}
      rows={rows}
      onDelete={handleDelete}
      editHref={(id) => `/admin/pengurus/edit/${id}`}
      renderCell={renderCell}
    />
  )
}
