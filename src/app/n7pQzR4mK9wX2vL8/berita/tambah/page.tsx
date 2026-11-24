'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import RichTextEditor from '@/components/admin/RichTextEditor'
import ImageCropper from '@/components/admin/ImageCropper'

const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition text-sm'

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const makeSlug = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

export default function TambahBeritaPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [slugDirty, setSlugDirty] = useState(false)
  const [form, setForm] = useState({
    judul: '', slug: '', kategori: 'Kegiatan',
    ringkasan: '', tanggal_publish: new Date().toISOString().split('T')[0], published: true
  })
  const [isi, setIsi] = useState('')

  // Foto & crop
  const [rawSrc, setRawSrc] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [fotoBlob, setFotoBlob] = useState<Blob | null>(null)
  const [preview, setPreview] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setRawSrc(URL.createObjectURL(file)); setShowCropper(true); e.target.value = ''
  }

  const handleCropDone = (blob: Blob, url: string) => {
    setFotoBlob(blob); setPreview(url); setShowCropper(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.judul.trim()) { setErrorMsg('Judul wajib diisi.'); return }
    if (!isi.trim()) { setErrorMsg('Isi berita wajib diisi.'); return }
    setLoading(true); setErrorMsg('')

    try {
      let fotoPath = null
      if (fotoBlob) {
        const fd = new FormData()
        fd.append('file', new File([fotoBlob], `berita_${Date.now()}.jpg`, { type: 'image/jpeg' }))
        fd.append('name', 'berita')
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const json = await res.json()
        if (json.path) fotoPath = json.path
      }

      const finalSlug = form.slug || makeSlug(form.judul)

      const { error } = await supabase.from('berita').insert({
        ...form, slug: finalSlug, isi, foto: fotoPath
      })
      if (error) throw new Error(error.message)
      router.push('/n7pQzR4mK9wX2vL8/berita')
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan.')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tambah Berita</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">

          <FormField label="Judul Berita">
            <input required value={form.judul}
              onChange={e => {
                const judul = e.target.value
                setForm(f => ({
                  ...f,
                  judul,
                  slug: slugDirty ? f.slug : makeSlug(judul)
                }))
              }}
              className={inputCls} placeholder="Judul berita" />
          </FormField>

          <FormField label="Slug URL">
            <input value={form.slug}
              onChange={e => { setSlugDirty(true); setForm(f => ({...f, slug: e.target.value})) }}
              className={inputCls} placeholder="judul-berita" />
            <p className="text-xs text-gray-400 mt-1">Terisi otomatis dari judul. Edit jika perlu URL khusus.</p>
          </FormField>

          <FormField label="Kategori">
            <select value={form.kategori} onChange={e => setForm(f => ({...f, kategori: e.target.value}))} className={inputCls}>
              {['Kegiatan', 'Sosial', 'Prestasi', 'Keagamaan', 'Seni', 'Olahraga', 'Organisasi', 'Lainnya'].map(k => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Ringkasan">
            <RichTextEditor value={form.ringkasan} onChange={val => setForm(f => ({...f, ringkasan: val}))} placeholder="Ringkasan singkat berita..." />
          </FormField>

          <FormField label="Isi Berita">
            <RichTextEditor value={isi} onChange={setIsi} placeholder="Tulis isi berita lengkap di sini..." />
          </FormField>

          <FormField label="Foto">
            <div className="flex items-center gap-4">
              {preview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="preview" className="w-32 h-20 rounded-xl object-cover border" />
              )}
              <button type="button" onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {preview ? 'Ganti Foto' : 'Upload Foto'}
              </button>
              {fotoBlob && <span className="text-xs text-green-600">✓ Foto dipilih</span>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tanggal Publish">
              <input type="date" value={form.tanggal_publish}
                onChange={e => setForm(f => ({...f, tanggal_publish: e.target.value}))} className={inputCls} />
            </FormField>
            <FormField label="Status">
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input type="checkbox" checked={form.published}
                  onChange={e => setForm(f => ({...f, published: e.target.checked}))}
                  className="w-4 h-4 accent-green-600" />
                <span className="text-sm text-gray-700">Published</span>
              </label>
            </FormField>
          </div>
        </div>

        {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">⚠ {errorMsg}</div>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium text-sm disabled:opacity-60">
            {loading ? 'Menyimpan...' : 'Publish Berita'}
          </button>
          <button type="button" onClick={() => router.push('/n7pQzR4mK9wX2vL8/berita')}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition text-sm">
            Batal
          </button>
        </div>
      </form>

      {showCropper && rawSrc && (
        <ImageCropper src={rawSrc} freeAspect onDone={handleCropDone} onCancel={() => setShowCropper(false)} />
      )}
    </div>
  )
}
