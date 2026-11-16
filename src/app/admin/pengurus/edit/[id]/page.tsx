'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ImageCropper from '@/components/admin/ImageCropper'
import JabatanSelect from '@/components/admin/JabatanSelect'

const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition text-sm'

export default function EditPengurusPage() {
  const router = useRouter()
  const params = useParams()
  const fileRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [nama, setNama] = useState('')
  const [jabatan, setJabatan] = useState('')
  const [organisasi, setOrganisasi] = useState('IPNU')
  const [departemen, setDepartemen] = useState('')
  const [urutan, setUrutan] = useState('0')
  const [aktif, setAktif] = useState(true)
  const [existingFoto, setExistingFoto] = useState<string | null>(null)

  // Foto & crop state
  const [rawSrc, setRawSrc] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [fotoBlob, setFotoBlob] = useState<Blob | null>(null)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    supabase.from('pengurus').select('*').eq('id', params.id).single().then(({ data }) => {
      if (data) {
        setNama(data.nama ?? '')
        setJabatan(data.jabatan ?? '')
        setOrganisasi(data.organisasi ?? 'IPNU')
        setDepartemen(data.departemen ?? '')
        setUrutan(String(data.urutan ?? 0))
        setAktif(data.aktif ?? true)
        setExistingFoto(data.foto)
        if (data.foto) setPreview(data.foto)
      }
    })
  }, [params.id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setRawSrc(URL.createObjectURL(file))
    setShowCropper(true)
    e.target.value = ''
  }

  const handleCropDone = (blob: Blob, previewUrl: string) => {
    setFotoBlob(blob)
    setPreview(previewUrl)
    setShowCropper(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nama.trim() || !jabatan.trim()) { setErrorMsg('Nama dan jabatan wajib diisi.'); return }
    setLoading(true); setErrorMsg('')

    try {
      // Upload foto baru jika ada yang di-crop
      let fotoPath = existingFoto
      if (fotoBlob) {
        const fd = new FormData()
        fd.append('file', new File([fotoBlob], `pengurus_${Date.now()}.jpg`, { type: 'image/jpeg' }))
        fd.append('name', 'pengurus')
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const json = await res.json()
        if (json.path) fotoPath = json.path
        else console.warn('Upload gagal:', json)
      }

      const { error } = await supabase.from('pengurus').update({
        nama, jabatan, organisasi,
        departemen: departemen || null,
        foto: fotoPath,
        urutan: parseInt(urutan) || 0,
        aktif,
        updated_at: new Date().toISOString(),
      }).eq('id', params.id)

      if (error) throw new Error(error.message)
      router.push('/admin/pengurus')
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Pengurus</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama <span className="text-red-500">*</span></label>
          <input value={nama} onChange={e => setNama(e.target.value)} className={inputCls} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Jabatan <span className="text-red-500">*</span></label>
          <JabatanSelect value={jabatan} onChange={setJabatan} className={inputCls} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Organisasi</label>
          <select value={organisasi} onChange={e => setOrganisasi(e.target.value)} className={inputCls}>
            <option value="IPNU">IPNU</option>
            <option value="IPPNU">IPPNU</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Departemen</label>
          <select value={departemen} onChange={e => setDepartemen(e.target.value)} className={inputCls}>
            <option value="">— Pengurus Harian —</option>
            <option value="organisasi">Organisasi</option>
            <option value="kaderisasi">Kaderisasi</option>
            <option value="pendidikan">Pendidikan</option>
            <option value="dakwah">Dakwah</option>
            <option value="minat-bakat">Minat Bakat</option>
            <option value="cbp">CBP</option>
            <option value="kpp">KPP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto</label>
          <div className="flex items-center gap-4">
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="preview" className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                onError={(e: any) => { e.target.style.display = 'none' }} />
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {preview ? 'Ganti Foto' : 'Pilih Foto'}
            </button>
            {fotoBlob && <span className="text-xs text-green-600 font-medium">✓ Foto baru dipilih</span>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Urutan Tampil</label>
          <input type="number" min="0" value={urutan} onChange={e => setUrutan(e.target.value)} className={inputCls} />
        </div>

        <div className="flex items-center gap-3">
          <input id="aktif" type="checkbox" checked={aktif} onChange={e => setAktif(e.target.checked)} className="w-4 h-4 rounded accent-green-600" />
          <label htmlFor="aktif" className="text-sm font-medium text-gray-700">Pengurus Aktif</label>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">⚠ {errorMsg}</div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition font-medium text-sm disabled:opacity-60">
            {loading ? 'Menyimpan...' : 'Update'}
          </button>
          <button type="button" onClick={() => router.push('/admin/pengurus')} className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
            Batal
          </button>
        </div>
      </form>

      {/* Cropper di luar form */}
      {showCropper && rawSrc && (
        <ImageCropper
          src={rawSrc}
          aspect={1}
          onDone={handleCropDone}
          onCancel={() => setShowCropper(false)}
        />
      )}
    </div>
  )
}
