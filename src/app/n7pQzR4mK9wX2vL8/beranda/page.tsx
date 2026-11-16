'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import RichTextEditor from '@/components/admin/RichTextEditor'
import ImageUploadWithCrop from '@/components/admin/ImageUploadWithCrop'

const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition text-sm'

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function BerandaAdminPage() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [existingId, setExistingId] = useState<number | null>(null)
  const [form, setForm] = useState({
    nama_ketua_ipnu:     '',
    jabatan_ketua_ipnu:  'Ketua PAC IPNU',
    sambutan_ketua_ipnu: '',
    tagline_ketua_ipnu:  '',
    nama_ketua_ippnu:    '',
    jabatan_ketua_ippnu: 'Ketua PAC IPPNU',
    sambutan_ketua_ippnu:'',
    tagline_ketua_ippnu: '',
  })
  const [previewIpnu, setPreviewIpnu]   = useState('/images/Ketua_IPNU.jpg')
  const [previewIppnu, setPreviewIppnu] = useState('/images/Ketua_IPPNU.jpg')
  const [fotoIpnu, setFotoIpnu]   = useState<File | null>(null)
  const [fotoIppnu, setFotoIppnu] = useState<File | null>(null)

  useEffect(() => {
    supabase.from('beranda').select('*').limit(1).single().then(({ data }) => {
      if (data) {
        setExistingId(data.id)
        setForm({
          nama_ketua_ipnu:     data.nama_ketua_ipnu     ?? '',
          jabatan_ketua_ipnu:  data.jabatan_ketua_ipnu  ?? 'Ketua PAC IPNU',
          sambutan_ketua_ipnu: data.sambutan_ketua_ipnu ?? '',
          tagline_ketua_ipnu:  data.tagline_ketua_ipnu  ?? '',
          nama_ketua_ippnu:    data.nama_ketua_ippnu    ?? '',
          jabatan_ketua_ippnu: data.jabatan_ketua_ippnu ?? 'Ketua PAC IPPNU',
          sambutan_ketua_ippnu:data.sambutan_ketua_ippnu ?? '',
          tagline_ketua_ippnu: data.tagline_ketua_ippnu  ?? '',
        })
        // Set preview dari data yang tersimpan
        if (data.foto_ketua_ipnu) setPreviewIpnu(data.foto_ketua_ipnu)
        if (data.foto_ketua_ippnu) setPreviewIppnu(data.foto_ketua_ippnu)
      }
    })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setSaved(false); setErrorMsg('')
  }

  const handleCroppedIpnu = (blob: Blob, previewUrl: string) => {
    const file = new File([blob], `ketua_ipnu_${Date.now()}.jpg`, { type: 'image/jpeg' })
    setFotoIpnu(file)
    setPreviewIpnu(previewUrl)
  }

  const handleCroppedIppnu = (blob: Blob, previewUrl: string) => {
    const file = new File([blob], `ketua_ippnu_${Date.now()}.jpg`, { type: 'image/jpeg' })
    setFotoIppnu(file)
    setPreviewIppnu(previewUrl)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setSaved(false); setErrorMsg('')

    try {
      const payload: Record<string, any> = { ...form }

      // Upload foto via local API (tidak butuh koneksi Supabase Storage)
      if (fotoIpnu) {
        try {
          const fd = new FormData(); fd.append('file', fotoIpnu); fd.append('name', 'ketua_ipnu')
          const res = await fetch('/api/upload', { method: 'POST', body: fd })
          const json = await res.json()
          if (json.path) payload.foto_ketua_ipnu = json.path
        } catch (err) { console.warn('Upload IPNU gagal:', err) }
      }
      if (fotoIppnu) {
        try {
          const fd = new FormData(); fd.append('file', fotoIppnu); fd.append('name', 'ketua_ippnu')
          const res = await fetch('/api/upload', { method: 'POST', body: fd })
          const json = await res.json()
          if (json.path) payload.foto_ketua_ippnu = json.path
        } catch (err) { console.warn('Upload IPPNU gagal:', err) }
      }

      let err
      if (existingId) {
        const r = await supabase.from('beranda').update(payload).eq('id', existingId)
        err = r.error
      } else {
        const r = await supabase.from('beranda').insert(payload).select('id').single()
        err = r.error
        if (!err && r.data) setExistingId(r.data.id)
      }

      if (err) throw new Error(err.message)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pengaturan Beranda</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* IPNU */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-800 text-lg border-b pb-3">Sambutan Ketua IPNU</h2>
          <FormField label="Nama">
            <input name="nama_ketua_ipnu" value={form.nama_ketua_ipnu} onChange={handleChange} className={inputCls} placeholder="Nama Ketua IPNU" />
          </FormField>
          <FormField label="Jabatan">
            <input name="jabatan_ketua_ipnu" value={form.jabatan_ketua_ipnu} onChange={handleChange} className={inputCls} />
          </FormField>
          <FormField label="Tagline / Motto">
            <input name="tagline_ketua_ipnu" value={form.tagline_ketua_ipnu} onChange={handleChange} className={inputCls} placeholder="Belajar, Berjuang, Bertaqwa" />
          </FormField>
          <FormField label="Kata Sambutan">
            <RichTextEditor
              value={form.sambutan_ketua_ipnu}
              onChange={(val) => { setForm(f => ({ ...f, sambutan_ketua_ipnu: val })); setSaved(false) }}
              placeholder="Tulis kata sambutan Ketua IPNU..."
            />
          </FormField>
          <FormField label="Foto Ketua IPNU">
            <ImageUploadWithCrop
              preview={previewIpnu}
              onCropped={handleCroppedIpnu}
              aspect={3 / 4}
              label="Pilih Foto IPNU"
            />
          </FormField>
        </div>

        {/* IPPNU */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-800 text-lg border-b pb-3">Sambutan Ketua IPPNU</h2>
          <FormField label="Nama">
            <input name="nama_ketua_ippnu" value={form.nama_ketua_ippnu} onChange={handleChange} className={inputCls} placeholder="Nama Ketua IPPNU" />
          </FormField>
          <FormField label="Jabatan">
            <input name="jabatan_ketua_ippnu" value={form.jabatan_ketua_ippnu} onChange={handleChange} className={inputCls} />
          </FormField>
          <FormField label="Tagline / Motto">
            <input name="tagline_ketua_ippnu" value={form.tagline_ketua_ippnu} onChange={handleChange} className={inputCls} placeholder="Cerdas, Terampil, Mandiri" />
          </FormField>
          <FormField label="Kata Sambutan">
            <RichTextEditor
              value={form.sambutan_ketua_ippnu}
              onChange={(val) => { setForm(f => ({ ...f, sambutan_ketua_ippnu: val })); setSaved(false) }}
              placeholder="Tulis kata sambutan Ketua IPPNU..."
            />
          </FormField>
          <FormField label="Foto Ketua IPPNU">
            <ImageUploadWithCrop
              preview={previewIppnu}
              onCropped={handleCroppedIppnu}
              aspect={3 / 4}
              label="Pilih Foto IPPNU"
            />
          </FormField>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">⚠ {errorMsg}</div>
        )}

        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition font-medium text-sm disabled:opacity-60">
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          {saved && <span className="text-green-600 text-sm font-medium">✓ Tersimpan!</span>}
        </div>
      </form>
    </div>
  )
}
