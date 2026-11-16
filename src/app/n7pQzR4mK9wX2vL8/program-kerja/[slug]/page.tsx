'use client'

import ConfirmDialog from '@/components/admin/ConfirmDialog'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getDepartemenBySlug } from '@/lib/departemen'

const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition text-sm'
const frekuensiOptions = ['Harian', 'Mingguan', 'Bulanan', 'Triwulan', 'Semesteran', 'Tahunan', 'Insidental', 'Berkelanjutan']
const statusOptions = ['Belum Terlaksana', 'Sedang Berjalan', 'Terlaksana', 'Ditunda', 'Dibatalkan']

interface FormState {
  id?: number
  nama: string
  keterangan: string
  tujuan: string
  frekuensi: string
  waktu_pelaksanaan: string
  status: string
  urutan: string
}

const emptyForm: FormState = { nama: '', keterangan: '', tujuan: '', frekuensi: 'Tahunan', waktu_pelaksanaan: '', status: 'Belum Terlaksana', urutan: '0' }

export default function ProkerDeptPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [info, setInfo] = useState<{ nama: string; warna: string } | null>(null)

  const [list, setList] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = async () => {
    const { data } = await supabase
      .from('program_kerja').select('*')
      .eq('departemen', slug).order('urutan')
    setList(data || [])
  }

  useEffect(() => {
    // Fetch info dari database
    getDepartemenBySlug(slug).then(d => {
      if (d) setInfo({ nama: d.nama, warna: d.warna })
      else setInfo({ nama: slug, warna: '#16a34a' })
    })
    load()
  }, [slug])

  const openAdd = () => {
    setForm({ ...emptyForm, urutan: String(list.length) })
    setErrorMsg(''); setShowForm(true)
  }

  const openEdit = (p: any) => {
    setForm({
      id: p.id, nama: p.nama, keterangan: p.keterangan || '',
      tujuan: p.tujuan || '', frekuensi: p.frekuensi || 'Tahunan',
      waktu_pelaksanaan: p.waktu_pelaksanaan || '',
      status: p.status || 'Belum Terlaksana', urutan: String(p.urutan ?? 0)
    })
    setErrorMsg(''); setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    await supabase.from('program_kerja').delete().eq('id', id)
    load()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nama.trim()) { setErrorMsg('Nama program kerja wajib diisi.'); return }
    setLoading(true); setErrorMsg('')
    try {
      const payload = {
        nama: form.nama, departemen: slug,
        keterangan: form.keterangan || null,
        tujuan: form.tujuan || null,
        frekuensi: form.frekuensi || null,
        waktu_pelaksanaan: form.waktu_pelaksanaan || null,
        status: form.status,
        urutan: parseInt(form.urutan) || 0,
      }

      if (form.id) {
        const { error } = await supabase.from('program_kerja').update(payload).eq('id', form.id)
        if (error) throw new Error(error.message)
      } else {
        const { error } = await supabase.from('program_kerja').insert(payload)
        if (error) throw new Error(error.message)
      }

      setShowForm(false); load()
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan.')
    } finally {
      setLoading(false)
    }
  }

  if (!info) return <div className="p-10 text-center text-gray-500">Memuat...</div>

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button type="button" onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Program Kerja — {info.nama}</h1>
          <p className="text-sm text-gray-500">Kelola daftar program kerja departemen</p>
        </div>
        <button type="button" onClick={openAdd} className="ml-auto bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition text-sm font-medium">
          + Tambah Proker
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 w-8">No</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Nama Program Kerja</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden sm:table-cell">Frekuensi</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden md:table-cell">Waktu</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden sm:table-cell">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">Belum ada program kerja. Klik "+ Tambah Proker"</td></tr>
            ) : list.map((p, i) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: info.warna }}>
                    {i + 1}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 truncate max-w-[130px] sm:max-w-none">{p.nama}</p>
                  {p.keterangan && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 hidden sm:block">{p.keterangan}</p>}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  {p.frekuensi && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">{p.frekuensi}</span>}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 hidden md:table-cell">
                  {p.waktu_pelaksanaan ? new Date(p.waktu_pelaksanaan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  {p.status && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      p.status === 'Terlaksana' ? 'bg-green-100 text-green-700' :
                      p.status === 'Sedang Berjalan' ? 'bg-blue-100 text-blue-700' :
                      p.status === 'Ditunda' ? 'bg-yellow-100 text-yellow-700' :
                      p.status === 'Dibatalkan' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{p.status}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button type="button" onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                    <button type="button" onClick={() => setDeleteId(p.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-over form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-gray-900">{form.id ? 'Edit Program Kerja' : 'Tambah Program Kerja'}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 px-6 py-5 space-y-4">
              {/* 1. Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Program Kerja <span className="text-red-500">*</span></label>
                <input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} className={inputCls} placeholder="Contoh: Diklatsar Angkatan XXI" required />
              </div>

              {/* 2. Keterangan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Keterangan</label>
                <textarea value={form.keterangan} onChange={e => setForm(f => ({ ...f, keterangan: e.target.value }))} className={inputCls} rows={3} placeholder="Deskripsi singkat program kerja..." />
              </div>

              {/* 3. Tujuan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tujuan Program</label>
                <textarea value={form.tujuan} onChange={e => setForm(f => ({ ...f, tujuan: e.target.value }))} className={inputCls} rows={3} placeholder="Tujuan yang ingin dicapai..." />
              </div>

              {/* 4. Frekuensi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Frekuensi</label>
                <select value={form.frekuensi} onChange={e => setForm(f => ({ ...f, frekuensi: e.target.value }))} className={inputCls}>
                  {frekuensiOptions.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {/* 5. Waktu Pelaksanaan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Waktu Pelaksanaan</label>
                <input
                  type="date"
                  value={form.waktu_pelaksanaan}
                  onChange={e => setForm(f => ({ ...f, waktu_pelaksanaan: e.target.value }))}
                  className={inputCls}
                />
                {form.waktu_pelaksanaan && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(form.waktu_pelaksanaan + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>

              {/* 6. Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputCls}>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* 7. Urutan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Urutan</label>
                <input type="number" min="0" value={form.urutan} onChange={e => setForm(f => ({ ...f, urutan: e.target.value }))} className={inputCls} />
              </div>

              {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">⚠ {errorMsg}</div>}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition font-medium text-sm disabled:opacity-60">
                  {loading ? 'Menyimpan...' : (form.id ? 'Update' : 'Simpan')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition text-sm">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus Program Kerja"
        message="Program kerja yang dihapus tidak dapat dikembalikan. Yakin ingin menghapus?"
        confirmLabel="Ya, Hapus"
        onConfirm={() => { if (deleteId !== null) handleDelete(deleteId); setDeleteId(null) }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
