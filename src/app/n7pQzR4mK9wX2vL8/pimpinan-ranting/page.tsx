'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition text-sm'

interface Form {
  id?: number
  nama: string
  tipe: string
  ketua_ipnu: string
  sekretaris_ipnu: string
  ketua_ippnu: string
  sekretaris_ippnu: string
  periode: string
  aktif: boolean
  urutan: number
}

const empty: Form = { nama: '', tipe: 'ranting', ketua_ipnu: '', sekretaris_ipnu: '', ketua_ippnu: '', sekretaris_ippnu: '', periode: '', aktif: true, urutan: 0 }

export default function PimpinanRantingAdminPage() {
  const [list, setList] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Form>(empty)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [search, setSearch] = useState('')

  const load = () => supabase.from('pimpinan_ranting').select('*').order('urutan').then(({ data }) => setList(data || []))

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ ...empty, urutan: list.length + 1 }); setErrorMsg(''); setShowForm(true) }
  const openEdit = (r: any) => { setForm({ ...r }); setErrorMsg(''); setShowForm(true) }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus data ini?')) return
    await supabase.from('pimpinan_ranting').delete().eq('id', id)
    load()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nama.trim()) { setErrorMsg('Nama wajib diisi.'); return }
    setLoading(true); setErrorMsg('')
    try {
      const payload = { ...form }
      delete (payload as any).id
      if (form.id) {
        const { error } = await supabase.from('pimpinan_ranting').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', form.id)
        if (error) throw new Error(error.message)
      } else {
        const { error } = await supabase.from('pimpinan_ranting').insert(payload)
        if (error) throw new Error(error.message)
      }
      setShowForm(false); load()
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally { setLoading(false) }
  }

  const filtered = list.filter(r => r.nama.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pimpinan Ranting (PR)</h1>
          <p className="text-gray-500 text-sm mt-1">{list.length} ranting terdaftar</p>
        </div>
        <button onClick={openAdd} className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition text-sm font-medium">
          + Tambah PR
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama ranting..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-600 outline-none" />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Nama Ranting</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden sm:table-cell">Ketua IPNU</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden sm:table-cell">Ketua IPPNU</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden md:table-cell">Periode</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden md:table-cell">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">Belum ada data.</td></tr>
            ) : filtered.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900 uppercase truncate max-w-[120px] sm:max-w-none">{r.nama}</td>
                <td className="px-4 py-3 text-gray-600 text-xs hidden sm:table-cell truncate max-w-[100px]">{r.ketua_ipnu || '—'}</td>
                <td className="px-4 py-3 text-gray-600 text-xs hidden sm:table-cell truncate max-w-[100px]">{r.ketua_ippnu || '—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{r.periode || '—'}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.aktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {r.aktif ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(r)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                    <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-over */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-gray-900">{form.id ? 'Edit PR' : 'Tambah PR'}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Desa / Ranting <span className="text-red-500">*</span></label>
                <input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} className={inputCls} placeholder="BANJARKERTA" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Periode</label>
                <input value={form.periode} onChange={e => setForm(f => ({ ...f, periode: e.target.value }))} className={inputCls} placeholder="2024–2026" />
              </div>

              <div className="border border-green-200 rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-green-700 text-sm">IPNU</h3>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ketua</label>
                  <input value={form.ketua_ipnu} onChange={e => setForm(f => ({ ...f, ketua_ipnu: e.target.value }))} className={inputCls} placeholder="Nama ketua IPNU" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Sekretaris</label>
                  <input value={form.sekretaris_ipnu} onChange={e => setForm(f => ({ ...f, sekretaris_ipnu: e.target.value }))} className={inputCls} placeholder="Nama sekretaris IPNU" />
                </div>
              </div>

              <div className="border border-pink-200 rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-pink-700 text-sm">IPPNU</h3>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ketua</label>
                  <input value={form.ketua_ippnu} onChange={e => setForm(f => ({ ...f, ketua_ippnu: e.target.value }))} className={inputCls} placeholder="Nama ketua IPPNU" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Sekretaris</label>
                  <input value={form.sekretaris_ippnu} onChange={e => setForm(f => ({ ...f, sekretaris_ippnu: e.target.value }))} className={inputCls} placeholder="Nama sekretaris IPPNU" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Urutan</label>
                <input type="number" value={form.urutan} onChange={e => setForm(f => ({ ...f, urutan: parseInt(e.target.value) || 0 }))} className={inputCls} />
              </div>
              <div className="flex items-center gap-3">
                <input id="aktif-pr" type="checkbox" checked={form.aktif} onChange={e => setForm(f => ({ ...f, aktif: e.target.checked }))} className="w-4 h-4 accent-green-600" />
                <label htmlFor="aktif-pr" className="text-sm text-gray-700">Aktif</label>
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
    </div>
  )
}
