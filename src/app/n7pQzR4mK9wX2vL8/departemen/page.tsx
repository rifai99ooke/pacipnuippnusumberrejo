'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition text-sm'

const WARNA_PRESETS = [
  '#2563eb', '#16a34a', '#7c3aed', '#d97706',
  '#dc2626', '#15803d', '#be185d', '#0891b2',
  '#ea580c', '#4338ca', '#059669', '#db2777',
]

interface Dept {
  id?: number
  slug: string
  nama: string
  tipe: 'bph' | 'departemen' | 'lembaga'
  warna: string
  deskripsi: string
  urutan: number
  aktif: boolean
}

const emptyForm: Dept = { slug: '', nama: '', tipe: 'departemen', warna: '#16a34a', deskripsi: '', urutan: 0, aktif: true }

function slugify(str: string) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function DepartemenCRUDPage() {
  const [list, setList] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Dept>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null)

  const load = async () => {
    const { data } = await supabase.from('departemen').select('*').order('urutan')
    setList(data || [])
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ ...emptyForm, urutan: list.length + 1 }); setErrorMsg(''); setShowForm(true) }
  const openEdit = (d: any) => { setForm({ ...d }); setErrorMsg(''); setShowForm(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nama.trim()) { setErrorMsg('Nama wajib diisi.'); return }
    if (!form.slug.trim()) { setErrorMsg('Slug wajib diisi.'); return }
    setLoading(true); setErrorMsg('')
    try {
      if (form.id) {
        const { error } = await supabase.from('departemen').update({
          nama: form.nama, slug: form.slug, tipe: form.tipe,
          warna: form.warna, deskripsi: form.deskripsi,
          urutan: form.urutan, aktif: form.aktif,
          updated_at: new Date().toISOString(),
        }).eq('id', form.id)
        if (error) throw new Error(error.message)
      } else {
        const { error } = await supabase.from('departemen').insert({
          nama: form.nama, slug: form.slug, tipe: form.tipe,
          warna: form.warna, deskripsi: form.deskripsi,
          urutan: form.urutan, aktif: form.aktif,
        })
        if (error) throw new Error(error.message)
      }
      setShowForm(false); load()
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (dept: any) => {
    setLoading(true)
    try {
      // Hapus program kerja terkait dulu
      await supabase.from('program_kerja').delete().eq('departemen', dept.slug)
      // Hapus pengurus terkait
      await supabase.from('pengurus').delete().eq('departemen', dept.slug)
      // Hapus departemen
      const { error } = await supabase.from('departemen').delete().eq('id', dept.id)
      if (error) throw new Error(error.message)
      setDeleteConfirm(null); load()
    } catch (err: any) {
      alert('Gagal hapus: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const tipeColor: Record<string, string> = {
    bph: 'bg-gray-100 text-gray-700',
    departemen: 'bg-blue-100 text-blue-700',
    lembaga: 'bg-purple-100 text-purple-700',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departemen & Lembaga</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola daftar BPH, departemen, dan lembaga organisasi</p>
        </div>
        <button onClick={openAdd} className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition text-sm font-medium">
          + Tambah
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden sm:table-cell">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Tipe</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden md:table-cell">Warna</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden sm:table-cell">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">Belum ada data.</td></tr>
            ) : list.map(d => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${d.warna}20` }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: d.warna }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">{d.nama}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs hidden sm:table-cell">{d.slug}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${tipeColor[d.tipe]}`}>
                    {d.tipe}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: d.warna }} />
                    <span className="text-xs text-gray-500 font-mono">{d.warna}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.aktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {d.aktif ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(d)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                    <button onClick={() => setDeleteConfirm(d)} className="text-red-500 hover:text-red-700 text-xs font-medium">Hapus</button>
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
              <h2 className="font-bold text-gray-900">{form.id ? 'Edit Departemen' : 'Tambah Departemen'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama <span className="text-red-500">*</span></label>
                <input value={form.nama} onChange={e => {
                  const nama = e.target.value
                  setForm(f => ({ ...f, nama, slug: f.id ? f.slug : slugify(nama) }))
                }} className={inputCls} placeholder="Contoh: Organisasi" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-400 ml-1">(huruf kecil, tanda hubung)</span>
                </label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))}
                  className={inputCls} placeholder="organisasi" required
                  disabled={!!form.id} // slug tidak bisa diubah jika sudah ada data terkait
                />
                {form.id && <p className="text-xs text-gray-400 mt-1">Slug tidak bisa diubah karena terhubung ke data pengurus & program kerja.</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipe</label>
                <select value={form.tipe} onChange={e => setForm(f => ({ ...f, tipe: e.target.value as any }))} className={inputCls}>
                  <option value="bph">BPH (Badan Pengurus Harian)</option>
                  <option value="departemen">Departemen</option>
                  <option value="lembaga">Lembaga</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
                <input value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))}
                  className={inputCls} placeholder="Deskripsi singkat" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Warna</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {WARNA_PRESETS.map(w => (
                    <button key={w} type="button" onClick={() => setForm(f => ({ ...f, warna: w }))}
                      className={`w-8 h-8 rounded-lg border-2 transition ${form.warna === w ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: w }} />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input type="color" value={form.warna} onChange={e => setForm(f => ({ ...f, warna: e.target.value }))}
                    className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5" />
                  <input value={form.warna} onChange={e => setForm(f => ({ ...f, warna: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" placeholder="#16a34a" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Urutan</label>
                <input type="number" min="0" value={form.urutan} onChange={e => setForm(f => ({ ...f, urutan: parseInt(e.target.value) || 0 }))} className={inputCls} />
              </div>

              <div className="flex items-center gap-3">
                <input id="aktif-dept" type="checkbox" checked={form.aktif} onChange={e => setForm(f => ({ ...f, aktif: e.target.checked }))}
                  className="w-4 h-4 accent-green-600" />
                <label htmlFor="aktif-dept" className="text-sm text-gray-700">Aktif (tampil di website)</label>
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

      {/* Modal konfirmasi hapus */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Hapus "{deleteConfirm.nama}"?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Semua <span className="font-semibold text-red-600">pengurus</span> dan <span className="font-semibold text-red-600">program kerja</span> yang terkait dengan departemen ini juga akan <span className="font-semibold">dihapus permanen</span>.
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} disabled={loading}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition font-medium text-sm disabled:opacity-60">
                {loading ? 'Menghapus...' : 'Ya, Hapus Semua'}
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition text-sm">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
