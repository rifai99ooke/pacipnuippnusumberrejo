'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import DataTable from '@/components/admin/DataTable'

const columns = [
  { key: 'periode',          label: 'Periode' },
  { key: 'nama_ketua_ipnu',  label: 'Ketua IPNU',  hideOnMobile: true },
  { key: 'nama_ketua_ippnu', label: 'Ketua IPPNU', hideOnMobile: true },
  { key: 'aktif',            label: 'Status',       hideOnMobile: false },
]

export default function EstafetAdminPage() {
  const [rows, setRows] = useState<any[]>([])

  async function load() {
    const { data } = await supabase.from('estafet').select('*').order('urutan', { ascending: true })
    setRows(data ?? [])
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    await supabase.from('estafet').delete().eq('id', id)
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
      title="Estafet Kepemimpinan"
      addHref="/admin/estafet/tambah"
      columns={columns}
      rows={rows}
      onDelete={handleDelete}
      editHref={(id) => `/admin/estafet/edit/${id}`}
      renderCell={renderCell}
    />
  )
}
