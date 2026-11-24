'use client'

import { useState } from 'react'
import Link from 'next/link'
import ConfirmDialog from './ConfirmDialog'

interface Column {
  key: string
  label: string
  hideOnMobile?: boolean
}

interface Props {
  title: string
  addHref: string
  columns: Column[]
  rows: any[]
  onDelete: (id: number) => void
  editHref: (id: number) => string
  renderCell?: (key: string, row: any) => React.ReactNode
}

export default function DataTable({ title, addHref, columns, rows, onDelete, editHref, renderCell }: Props) {
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const processedColumns = columns.map((c, i) => ({
    ...c,
    hideOnMobile: c.hideOnMobile !== undefined ? c.hideOnMobile : i > 0,
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <Link href={addHref} className="bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition font-medium text-sm flex-shrink-0">
          + Tambah
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">No</th>
              {processedColumns.map((c) => (
                <th key={c.key} className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase ${c.hideOnMobile ? 'hidden sm:table-cell' : ''}`}>
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={processedColumns.length + 2} className="px-6 py-12 text-center text-gray-500">Belum ada data.</td>
              </tr>
            ) : rows.map((row, i) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{i + 1}</td>
                {processedColumns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 text-gray-900 ${c.hideOnMobile ? 'hidden sm:table-cell' : ''} ${c.key === processedColumns[0].key ? 'max-w-[150px] sm:max-w-xs lg:max-w-none truncate' : ''}`}>
                    {renderCell ? renderCell(c.key, row) : (row[c.key] ?? '-')}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={editHref(row.id)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</Link>
                    <button onClick={() => setDeleteId(row.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus Data"
        message="Data yang dihapus tidak dapat dikembalikan. Yakin ingin menghapus?"
        confirmLabel="Ya, Hapus"
        confirmColor="red"
        onConfirm={() => { if (deleteId !== null) onDelete(deleteId); setDeleteId(null) }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
