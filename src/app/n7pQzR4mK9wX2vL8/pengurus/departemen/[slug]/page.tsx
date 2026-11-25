'use client'

import ConfirmDialog from '@/components/admin/ConfirmDialog'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ImageCropper from '@/components/admin/ImageCropper'
import JabatanSelect from '@/components/admin/JabatanSelect'
import { getDepartemenBySlug } from '@/lib/departemen'

const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition text-sm'



interface FormState {
  id?: number
  nama: string
  jabatan: string
  organisasi: string
  urutan: string
  aktif: boolean
}

const emptyForm: FormState = { nama: '', jabatan: '', organisasi: 'IPNU', urutan: '0', aktif: true }

export default function DepartemenAnggotaPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [info, setInfo] = useState<{ nama: string; warna: string; tipe?: string } | null>(null)

  useEffect(() => {
    getDepartemenBySlug(slug).then(d => {
      if (d) setInfo({ nama: d.nama, warna: d.warna, tipe: d.tipe })
      else setInfo({ nama: slug, warna: '#16a34a', tipe: 'departemen' })
    })
  }, [slug])

  const fileRef = useRef<HTMLInputElement>(null)
  const [anggota, setAnggota] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  // Crop state
  const [rawSrc, setRawSrc] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [fotoBlob, setFotoBlob] = useState<Blob | null>(null)
  const [preview, setPreview] = useState('')

  const load = async () => {
    const { data } = await supabase
      .from('pengurus').select('*')
      .eq('departemen', slug).eq('aktif', true)
      .order('urutan')
    setAnggota(data || [])
  }

  useEffect(() => { load() }, [slug])

  const isBph = slug === 'bph-ipnu' || slug === 'bph-ippnu'
  const autoOrganisasi = slug === 'bph-ipnu' ? 'IPNU' : slug === 'bph-ippnu' ? 'IPPNU' : 'IPNU'

  const openAdd = () => {
    setForm({ ...emptyForm, organisasi: autoOrganisasi })
    setPreview(''); setFotoBlob(null)
    setErrorMsg(''); setShowForm(true)
  }

  const openEdit = (p: any) => {
    setForm({ id: p.id, nama: p.nama, jabatan: p.jabatan, organisasi: isBph ? autoOrganisasi : p.organisasi, urutan: String(p.urutan ?? 0), aktif: p.aktif })
    setPreview(p.foto || ''); setFotoBlob(null)
    setErrorMsg(''); setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    await supabase.from('pengurus').delete().eq('id', id)
    load()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setRawSrc(URL.createObjectURL(file))
    setShowCropper(true); e.target.value = ''
  }

  const handleCropDone = (blob: Blob, url: string) => {
    setFotoBlob(blob); setPreview(url); setShowCropper(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nama.trim() || !form.jabatan.trim()) { setErrorMsg('Nama dan jabatan wajib diisi.'); return }
    setLoading(true); setErrorMsg('')
    try {
      let fotoPath = form.id ? (preview.startsWith('/images') ? preview : null) : null

      if (fotoBlob) {
        const fd = new FormData()
        fd.append('file', new File([fotoBlob], `pengurus_${Date.now()}.jpg`, { type: 'image/jpeg' }))
        fd.append('name', 'pengurus')
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const json = await res.json()
        if (json.path) fotoPath = json.path
      }

      const payload = {
        nama: form.nama, jabatan: form.jabatan, organisasi: form.organisasi,
        departemen: slug, foto: fotoPath,
        urutan: parseInt(form.urutan) || 0, aktif: form.aktif,
      }

      if (form.id) {
        const { error } = await supabase.from('pengurus').update(payload).eq('id', form.id)
        if (error) throw new Error(error.message)
      } else {
        const { error } = await supabase.from('pengurus').insert(payload)
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
          <h1 className="text-2xl font-bold text-gray-900">{info.nama}</h1>
          <p className="text-sm text-gray-500">Kelola koordinator & anggota</p>
        </div>
        <button type="button" onClick={openAdd} className="ml-auto bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition text-sm font-medium">
          + Tambah Anggota
        </button>
      </div>

      {/* Tabel anggota */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Foto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden sm:table-cell">Jabatan</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden sm:table-cell">Org</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {anggota.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">Belum ada anggota. Klik "+ Tambah Anggota"</td></tr>
            ) : anggota.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {p.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.foto} alt={p.nama} className="w-9 h-9 rounded-full object-cover border" />
                  ) : (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: info.warna }}>
                      {p.nama?.charAt(0)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{p.nama}</td>
                <td className="px-4 py-3 text-gray-600 text-xs hidden sm:table-cell truncate max-w-[100px]">{p.jabatan}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.organisasi === 'IPNU' ? 'bg-green-100 text-green-700' : 'bg-pink-100 text-pink-700'}`}>
                    {p.organisasi}
                  </span>
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
              <h2 className="font-bold text-gray-900">{form.id ? 'Edit Anggota' : 'Tambah Anggota'}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama <span className="text-red-500">*</span></label>
                <input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} className={inputCls} placeholder="Nama lengkap" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Jabatan <span className="text-red-500">*</span></label>
                <JabatanSelect value={form.jabatan} onChange={val => setForm(f => ({ ...f, jabatan: val }))} slug={slug} tipe={info?.tipe} className={inputCls} />
              </div>
              {/* Organisasi — sembunyikan untuk BPH karena otomatis dari departemen */}
              {!isBph && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Organisasi</label>
                  <select value={form.organisasi} onChange={e => setForm(f => ({ ...f, organisasi: e.target.value }))} className={inputCls}>
                    <option value="IPNU">IPNU</option>
                    <option value="IPPNU">IPPNU</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto</label>
                <div className="flex items-center gap-3">
                  {preview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="preview" className="w-14 h-14 rounded-xl object-cover border"
                      onError={(e: any) => { e.target.style.display = 'none' }} />
                  )}
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {preview ? 'Ganti' : 'Pilih Foto'}
                  </button>
                  {fotoBlob && <span className="text-xs text-green-600">✓ Dipilih</span>}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Urutan</label>
                <input type="number" min="0" value={form.urutan} onChange={e => setForm(f => ({ ...f, urutan: e.target.value }))} className={inputCls} />
              </div>
              <div className="flex items-center gap-3">
                <input id="aktif2" type="checkbox" checked={form.aktif} onChange={e => setForm(f => ({ ...f, aktif: e.target.checked }))} className="w-4 h-4 accent-green-600" />
                <label htmlFor="aktif2" className="text-sm text-gray-700">Aktif</label>
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

      {/* Cropper — di luar form */}
      {showCropper && rawSrc && (
        <ImageCropper src={rawSrc} aspect={1} onDone={handleCropDone} onCancel={() => setShowCropper(false)} />
      )}
      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus Anggota"
        message="Data anggota yang dihapus tidak dapat dikembalikan. Yakin ingin menghapus?"
        confirmLabel="Ya, Hapus"
        onConfirm={() => { if (deleteId !== null) handleDelete(deleteId); setDeleteId(null) }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
