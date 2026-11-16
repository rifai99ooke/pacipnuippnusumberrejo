'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition text-sm'

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function TambahProgramKerjaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nama: '',
    departemen: 'organisasi',
    keterangan: '',
    frekuensi: '',
    urutan: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('program_kerja').insert({
        nama: form.nama,
        departemen: form.departemen,
        keterangan: form.keterangan || null,
        frekuensi: form.frekuensi || null,
        urutan: form.urutan ? parseInt(form.urutan) : null,
      })

      if (error) throw error
      router.push('/admin/program-kerja')
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan data.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tambah Program Kerja</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <FormField label="Nama Program">
          <input name="nama" type="text" required value={form.nama} onChange={handleChange} className={inputCls} placeholder="Nama program kerja" />
        </FormField>

        <FormField label="Departemen">
          <select name="departemen" value={form.departemen} onChange={handleChange} className={inputCls}>
            <option value="organisasi">Organisasi</option>
            <option value="kaderisasi">Kaderisasi</option>
            <option value="pendidikan">Pendidikan</option>
            <option value="dakwah">Dakwah</option>
            <option value="minat-bakat">Minat &amp; Bakat</option>
            <option value="cbp-kpp">CBP / KPP</option>
          </select>
        </FormField>

        <FormField label="Keterangan">
          <textarea name="keterangan" value={form.keterangan} onChange={handleChange} rows={4} className={inputCls} placeholder="Keterangan program kerja (opsional)" />
        </FormField>

        <FormField label="Frekuensi">
          <input name="frekuensi" type="text" value={form.frekuensi} onChange={handleChange} className={inputCls} placeholder="Contoh: Bulanan, Tahunan" />
        </FormField>

        <FormField label="Urutan">
          <input name="urutan" type="number" min="1" value={form.urutan} onChange={handleChange} className={inputCls} placeholder="Nomor urut tampil" />
        </FormField>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition font-medium text-sm disabled:opacity-60">
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button type="button" onClick={() => router.push('/admin/program-kerja')} className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}
