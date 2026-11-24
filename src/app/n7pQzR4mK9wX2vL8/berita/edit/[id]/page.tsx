'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

export default function EditBeritaPage() {
  const router = useRouter()
  const params = useParams()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({ judul: '', slug: '', kategori: 'Kegiatan', ringkasan: '', tanggal_publish: '', published: true })
  const [isi, setIsi] = useState('')
  const [existingFoto, setExistingFoto] = useState<string | null>(null)
  const [rawSrc, setRawSrc] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [fotoBlob, setFotoBlob] = useState<Blob | null>(null)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    supabase.from('berita').select('*').eq('id', params.id).single().then(({ data }) => {
      if (data) {
        setForm({ judul: data.judul || '', slug: data.slug || '', kategori: data.kategori || 'Kegiatan', ringkasan: data.ringkasan || '', tanggal_publish: data.tanggal_publish?.split('T')[0] || '', published: data.published ?? true })
        setIsi(data.isi || '')
        setExistingFoto(data.foto)
        if (data.foto) setPreview(data.foto)
      }
    })
  }, [params.id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setRawSrc(URL.createObjectURL(file)); setShowCropper(true); e.target.value = ''
  }

  const handleCropDone = (blob: Blob, url: string) => {
    setFotoBlob(blob); setPreview(url); setShowCropper(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setErrorMsg('')
    try {
      let fotoPath = existingFoto
      if (fotoBlob) {
        const fd = new FormData()
        fd.append('file', new File([fotoBlob], `berita_${Date.now()}.jpg`, { type: 'image/jpeg' }))
        fd.append('name', 'berita')
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const json = await res.json()
        if (json.path) fotoPath = json.path
      }
      const { error } = await supabase.from('berita').update({
        ...form, isi, foto: fotoPath, updated_at: new Date().toISOString()
      }).eq('id', params.id)
      if (error) throw new Error(error.message)
      router.push('/n7pQzR4mK9wX2vL8/berita')
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan.')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Berita</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">

          <FormField label="Judul Berita">
            <input required value={form.judul} onChange={e => setForm(f => ({...f, judul: e.target.value}))} className={inputCls} />
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
            <RichTextEditor value={isi} onChange={setIsi} placeholder="Tulis isi berita..." />
          </FormField>

          <FormField label="Foto">
            <div className="flex items-center gap-4">
              {preview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="preview" className="w-32 h-20 rounded-xl object-cover border"
                  onError={(e: any) => { e.target.style.display = 'none' }} />
              )}
              <button type="button" onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700">
                {preview ? 'Ganti Foto' : 'Upload Foto'}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tanggal Publish">
              <input type="date" value={form.tanggal_publish} onChange={e => setForm(f => ({...f, tanggal_publish: e.target.value}))} className={inputCls} />
            </FormField>
            <FormField label="Status">
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({...f, published: e.target.checked}))} className="w-4 h-4 accent-green-600" />
                <span className="text-sm text-gray-700">Published</span>
              </label>
            </FormField>
          </div>
        </div>

        {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">⚠ {errorMsg}</div>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium text-sm disabled:opacity-60">
            {loading ? 'Menyimpan...' : 'Update Berita'}
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
