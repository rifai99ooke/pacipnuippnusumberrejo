'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ImageCropper from '@/components/admin/ImageCropper'
import YearRangePicker from '@/components/admin/YearRangePicker'

const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition text-sm'

export default function TambahEstafetPage() {
  const router = useRouter()
  const fileIpnuRef  = useRef<HTMLInputElement>(null)
  const fileIppnuRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading]   = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [periode, setPeriode]   = useState('')
  const [namaIpnu, setNamaIpnu]   = useState('')
  const [namaIppnu, setNamaIppnu] = useState('')
  const [urutan, setUrutan]       = useState('0')
  const [aktif, setAktif]         = useState(false)

  const [rawSrc, setRawSrc]           = useState<string | null>(null)
  const [cropFor, setCropFor]         = useState<'ipnu' | 'ippnu' | null>(null)
  const [blobIpnu, setBlobIpnu]       = useState<Blob | null>(null)
  const [previewIpnu, setPreviewIpnu] = useState('')
  const [blobIppnu, setBlobIppnu]     = useState<Blob | null>(null)
  const [previewIppnu, setPreviewIppnu] = useState('')

  const openCrop = (type: 'ipnu' | 'ippnu', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setRawSrc(URL.createObjectURL(file))
    setCropFor(type); e.target.value = ''
  }

  const handleCropDone = (blob: Blob, url: string) => {
    if (cropFor === 'ipnu')  { setBlobIpnu(blob);  setPreviewIpnu(url) }
    else                     { setBlobIppnu(blob); setPreviewIppnu(url) }
    setCropFor(null)
  }

  const uploadFoto = async (blob: Blob, prefix: string): Promise<string | null> => {
    const fd = new FormData()
    fd.append('file', new File([blob], `${prefix}_${Date.now()}.jpg`, { type: 'image/jpeg' }))
    fd.append('name', prefix)
    const res  = await fetch('/api/upload', { method: 'POST', body: fd })
    const json = await res.json()
    return json.path ?? null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!periode.trim()) { setErrorMsg('Periode wajib diisi.'); return }
    setLoading(true); setErrorMsg('')
    try {
      const fotoIpnu  = blobIpnu  ? await uploadFoto(blobIpnu,  'estafet_ipnu')  : null
      const fotoIppnu = blobIppnu ? await uploadFoto(blobIppnu, 'estafet_ippnu') : null

      const { error } = await supabase.from('estafet').insert({
        periode, nama_ketua_ipnu: namaIpnu, foto_ketua_ipnu: fotoIpnu,
        nama_ketua_ippnu: namaIppnu, foto_ketua_ippnu: fotoIppnu,
        aktif, urutan: parseInt(urutan) || 0,
      })
      if (error) throw new Error(error.message)
      router.push('/n7pQzR4mK9wX2vL8/estafet')
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tambah Estafet Kepemimpinan</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Periode <span className="text-red-500">*</span></label>
          <YearRangePicker value={periode} onChange={setPeriode} />
        </div>

        {/* IPNU */}
        <div className="border border-green-200 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-green-700">Ketua IPNU</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Ketua IPNU</label>
            <input value={namaIpnu} onChange={e => setNamaIpnu(e.target.value)} className={inputCls} placeholder="Nama ketua IPNU" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto Ketua IPNU</label>
            <div className="flex items-center gap-4">
              {previewIpnu && <img src={previewIpnu} alt="IPNU" className="w-20 h-24 rounded-xl object-cover border" />}
              <button type="button" onClick={() => fileIpnuRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700">
                {previewIpnu ? 'Ganti Foto' : 'Pilih Foto'}
              </button>
              {blobIpnu && <span className="text-xs text-green-600">✓ Dipilih</span>}
            </div>
            <input ref={fileIpnuRef} type="file" accept="image/*" onChange={e => openCrop('ipnu', e)} className="hidden" />
          </div>
        </div>

        {/* IPPNU */}
        <div className="border border-pink-200 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-pink-700">Ketua IPPNU</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Ketua IPPNU</label>
            <input value={namaIppnu} onChange={e => setNamaIppnu(e.target.value)} className={inputCls} placeholder="Nama ketua IPPNU" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto Ketua IPPNU</label>
            <div className="flex items-center gap-4">
              {previewIppnu && <img src={previewIppnu} alt="IPPNU" className="w-20 h-24 rounded-xl object-cover border" />}
              <button type="button" onClick={() => fileIppnuRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700">
                {previewIppnu ? 'Ganti Foto' : 'Pilih Foto'}
              </button>
              {blobIppnu && <span className="text-xs text-green-600">✓ Dipilih</span>}
            </div>
            <input ref={fileIppnuRef} type="file" accept="image/*" onChange={e => openCrop('ippnu', e)} className="hidden" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Urutan</label>
            <input type="number" min="0" value={urutan} onChange={e => setUrutan(e.target.value)} className={inputCls} />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={aktif} onChange={e => setAktif(e.target.checked)} className="w-4 h-4 accent-green-600" />
              <span className="text-sm font-medium text-gray-700">Periode Aktif</span>
            </label>
          </div>
        </div>

        {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">⚠ {errorMsg}</div>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition font-medium text-sm disabled:opacity-60">
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button type="button" onClick={() => router.push('/n7pQzR4mK9wX2vL8/estafet')} className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition text-sm">
            Batal
          </button>
        </div>
      </form>

      {/* Cropper di luar form */}
      {cropFor && rawSrc && (
        <ImageCropper src={rawSrc} aspect={3/4} onDone={handleCropDone} onCancel={() => setCropFor(null)} />
      )}
    </div>
  )
}
