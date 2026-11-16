'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ImageCropper from '@/components/admin/ImageCropper'

const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition text-sm'
const KATEGORI_NON_PROKER = ['Keagamaan', 'Rutinan', 'Sosial', 'Silaturahmi', 'Undangan', 'Insidental', 'Rapat', 'Lainnya']
const PENGULANGAN = ['Tidak Berulang', 'Mingguan', 'Bulanan', 'Tahunan']

export default function EditAgendaPage() {
  const router = useRouter()
  const params = useParams()
  const fileRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [jenis, setJenis] = useState<'proker' | 'non-proker'>('non-proker')
  const [judul, setJudul] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [kategori, setKategori] = useState(KATEGORI_NON_PROKER[0])
  const [tanggal, setTanggal] = useState('')
  const [waktuMulai, setWaktuMulai] = useState('')
  const [waktuSelesai, setWaktuSelesai] = useState('')
  const [lokasi, setLokasi] = useState('')
  const [penyelenggara, setPenyelenggara] = useState('')
  const [penanggungjawab, setPenanggungjawab] = useState('')
  const [pengulangan, setPengulangan] = useState('Tidak Berulang')
  const [status, setStatus] = useState<'akan_datang' | 'selesai'>('akan_datang')
  const [laporan, setLaporan] = useState('')
  const [existingFoto, setExistingFoto] = useState<string | null>(null)
  const [rawSrc, setRawSrc] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [fotoBlob, setFotoBlob] = useState<Blob | null>(null)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    supabase.from('agenda').select('*').eq('id', params.id).single().then(({ data }) => {
      if (!data) return
      setJenis(data.jenis || 'non-proker')
      setJudul(data.judul || '')
      setDeskripsi(data.deskripsi || '')
      setKategori(data.kategori || KATEGORI_NON_PROKER[0])
      setTanggal(data.tanggal || '')
      setWaktuMulai(data.waktu_mulai?.substring(0, 5) || '')
      setWaktuSelesai(data.waktu_selesai?.substring(0, 5) || '')
      setLokasi(data.lokasi || '')
      setPenyelenggara(data.penyelenggara || '')
      setPenanggungjawab(data.penanggung_jawab || '')
      setPengulangan(data.pengulangan || 'Tidak Berulang')
      setStatus(data.status || 'akan_datang')
      setLaporan(data.laporan || '')
      setExistingFoto(data.foto)
      if (data.foto) setPreview(data.foto)
    })
  }, [params.id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setRawSrc(URL.createObjectURL(file)); setShowCropper(true); e.target.value = ''
  }

  const handleCropDone = (blob: Blob, url: string) => {
    setFotoBlob(blob); setPreview(url); setShowCropper(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setErrorMsg('')
    try {
      let fotoPath = existingFoto
      if (fotoBlob) {
        const fd = new FormData()
        fd.append('file', new File([fotoBlob], `agenda_${Date.now()}.jpg`, { type: 'image/jpeg' }))
        fd.append('name', 'agenda')
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const json = await res.json()
        if (json.path) fotoPath = json.path
      }

      const { error } = await supabase.from('agenda').update({
        judul, deskripsi: deskripsi || null,
        kategori: jenis === 'non-proker' ? kategori : null,
        tanggal, waktu_mulai: waktuMulai || null, waktu_selesai: waktuSelesai || null,
        lokasi: lokasi || null, penyelenggara: penyelenggara || null,
        penanggung_jawab: penanggungjawab || null,
        pengulangan: pengulangan !== 'Tidak Berulang' ? pengulangan : null,
        status, foto: fotoPath,
        laporan: laporan || null,
        updated_at: new Date().toISOString(),
      }).eq('id', params.id)

      if (error) throw new Error(error.message)
      router.push('/admin/agenda')
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${jenis === 'proker' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
          {jenis === 'proker' ? 'Proker' : 'Non-Proker'}
        </span>
        <h1 className="text-2xl font-bold text-gray-900">Edit Agenda</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 border-b pb-3">Detail Kegiatan</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Kegiatan</label>
            <input value={judul} onChange={e => setJudul(e.target.value)} className={inputCls} required />
          </div>

          {jenis === 'non-proker' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
              <select value={kategori} onChange={e => setKategori(e.target.value)} className={inputCls}>
                {KATEGORI_NON_PROKER.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
            <textarea value={deskripsi} onChange={e => setDeskripsi(e.target.value)} className={inputCls} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal</label>
              <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as any)} className={inputCls}>
                <option value="akan_datang">Akan Datang</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Waktu Mulai</label>
              <input type="time" value={waktuMulai} onChange={e => setWaktuMulai(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Waktu Selesai</label>
              <input type="time" value={waktuSelesai} onChange={e => setWaktuSelesai(e.target.value)} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Lokasi</label>
            <input value={lokasi} onChange={e => setLokasi(e.target.value)} className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Penyelenggara</label>
              <input value={penyelenggara} onChange={e => setPenyelenggara(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Penanggung Jawab</label>
              <input value={penanggungjawab} onChange={e => setPenanggungjawab(e.target.value)} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Pengulangan</label>
            <select value={pengulangan} onChange={e => setPengulangan(e.target.value)} className={inputCls}>
              {PENGULANGAN.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Poster / Foto</label>
            <div className="flex items-center gap-4">
              {preview && <img src={preview} alt="preview" className="w-24 h-16 rounded-xl object-cover border" onError={(e:any)=>{e.target.style.display='none'}} />}
              <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700">
                {preview ? 'Ganti Foto' : 'Upload Poster'}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          {/* Laporan (muncul jika status = selesai) */}
          {status === 'selesai' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Laporan Singkat Kegiatan</label>
              <textarea value={laporan} onChange={e => setLaporan(e.target.value)} className={inputCls} rows={4} placeholder="Tulis laporan singkat kegiatan yang telah terlaksana..." />
            </div>
          )}
        </div>

        {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">⚠ {errorMsg}</div>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium text-sm disabled:opacity-60">
            {loading ? 'Menyimpan...' : 'Update Agenda'}
          </button>
          <button type="button" onClick={() => router.push('/admin/agenda')} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition text-sm">
            Batal
          </button>
        </div>
      </form>

      {showCropper && rawSrc && (
        <ImageCropper src={rawSrc} aspect={16/9} onDone={handleCropDone} onCancel={() => setShowCropper(false)} />
      )}
    </div>
  )
}
