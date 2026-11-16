'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ImageCropper from '@/components/admin/ImageCropper'

const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition text-sm'
const KATEGORI_NON_PROKER = ['Keagamaan', 'Rutinan', 'Sosial', 'Silaturahmi', 'Undangan', 'Insidental', 'Rapat', 'Lainnya']
const PENGULANGAN = ['Tidak Berulang', 'Mingguan', 'Bulanan', 'Tahunan']

function TambahAgendaForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jenis = (searchParams.get('jenis') || 'non-proker') as 'proker' | 'non-proker'

  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [prokerList, setProkerList] = useState<any[]>([])
  const [deptList, setDeptList] = useState<any[]>([])

  // Form state
  const [prokerDept, setProkerDept] = useState('')
  const [prokerPilih, setProkerPilih] = useState('')
  const [prokerInfo, setProkerInfo] = useState<any>(null)
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

  // Foto
  const [rawSrc, setRawSrc] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [fotoBlob, setFotoBlob] = useState<Blob | null>(null)
  const [preview, setPreview] = useState('')

  // Load departemen dari database (exclude BPH)
  useEffect(() => {
    supabase.from('departemen').select('slug, nama, tipe')
      .eq('aktif', true).neq('tipe', 'bph').order('urutan')
      .then(({ data }) => setDeptList(data || []))
  }, [])

  // Load proker berdasarkan departemen
  useEffect(() => {
    if (!prokerDept) { setProkerList([]); return }
    supabase.from('program_kerja').select('*').eq('departemen', prokerDept).order('urutan')
      .then(({ data }) => setProkerList(data || []))
  }, [prokerDept])

  // Load info proker yang dipilih
  useEffect(() => {
    if (!prokerPilih) { setProkerInfo(null); return }
    const found = prokerList.find(p => String(p.id) === prokerPilih)
    setProkerInfo(found || null)
    if (found && !judul) setJudul(found.nama)
  }, [prokerPilih, prokerList])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setRawSrc(URL.createObjectURL(file)); setShowCropper(true); e.target.value = ''
  }

  const handleCropDone = (blob: Blob, url: string) => {
    setFotoBlob(blob); setPreview(url); setShowCropper(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!judul.trim())   { setErrorMsg('Nama kegiatan wajib diisi.'); return }
    if (!tanggal)        { setErrorMsg('Tanggal wajib diisi.'); return }
    if (jenis === 'proker' && !prokerPilih) { setErrorMsg('Pilih Program Kerja terlebih dahulu.'); return }
    setLoading(true); setErrorMsg('')

    try {
      let fotoPath: string | null = null
      if (fotoBlob) {
        const fd = new FormData()
        fd.append('file', new File([fotoBlob], `agenda_${Date.now()}.jpg`, { type: 'image/jpeg' }))
        fd.append('name', 'agenda')
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const json = await res.json()
        if (json.path) fotoPath = json.path
      }

      const { error } = await supabase.from('agenda').insert({
        jenis,
        program_kerja_id: jenis === 'proker' ? parseInt(prokerPilih) : null,
        kategori: jenis === 'non-proker' ? kategori : null,
        judul, deskripsi: deskripsi || null,
        tanggal, waktu_mulai: waktuMulai || null, waktu_selesai: waktuSelesai || null,
        lokasi: lokasi || null,
        penyelenggara: penyelenggara || null,
        penanggung_jawab: penanggungjawab || null,
        pengulangan: pengulangan !== 'Tidak Berulang' ? pengulangan : null,
        status, foto: fotoPath, published: true,
      })

      if (error) throw new Error(error.message)
      router.push('/admin/agenda')
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan.')
    } finally {
      setLoading(false)
    }
  }

  const isProker = jenis === 'proker'
  const accentColor = isProker ? 'green' : 'blue'

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isProker ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
          {isProker ? 'Proker' : 'Non-Proker'}
        </span>
        <h1 className="text-2xl font-bold text-gray-900">
          Tambah Agenda {isProker ? 'Program Kerja' : 'Non-Proker'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* === BAGIAN KHUSUS PROKER === */}
        {isProker && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-green-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Pilih Program Kerja
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Departemen / Lembaga</label>
              <select value={prokerDept} onChange={e => { setProkerDept(e.target.value); setProkerPilih('') }} className={inputCls}>
                <option value="">— Pilih Departemen —</option>
                {deptList.map(d => (
                  <option key={d.slug} value={d.slug}>{d.nama}</option>
                ))}
              </select>
            </div>

            {prokerDept && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Program Kerja <span className="text-red-500">*</span></label>
                <select value={prokerPilih} onChange={e => setProkerPilih(e.target.value)} className={inputCls}>
                  <option value="">— Pilih Program Kerja —</option>
                  {prokerList.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                </select>
              </div>
            )}

            {/* Info proker */}
            {prokerInfo && (
              <div className="bg-white rounded-lg p-4 border border-green-200 space-y-1.5 text-sm">
                <p className="font-semibold text-gray-900">{prokerInfo.nama}</p>
                {prokerInfo.keterangan && <p className="text-gray-500">{prokerInfo.keterangan}</p>}
                {prokerInfo.tujuan && <p className="text-gray-600 italic">🎯 {prokerInfo.tujuan}</p>}
                <div className="flex gap-2 flex-wrap pt-1">
                  {prokerInfo.frekuensi && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{prokerInfo.frekuensi}</span>}
                  {prokerInfo.status && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{prokerInfo.status}</span>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* === BAGIAN KHUSUS NON-PROKER === */}
        {!isProker && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h2 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Kategori Kegiatan
            </h2>
            {/* Pilihan cepat */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {KATEGORI_NON_PROKER.map(k => (
                <button key={k} type="button" onClick={() => setKategori(k)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition ${kategori === k ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}>
                  {k}
                </button>
              ))}
            </div>
            {/* Input manual */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Atau ketik kategori sendiri:</label>
              <input
                value={kategori}
                onChange={e => setKategori(e.target.value)}
                className={inputCls}
                placeholder="Ketik kategori bebas..."
              />
            </div>
          </div>
        )}

        {/* === DETAIL AGENDA (sama untuk keduanya) === */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 border-b pb-3">Detail Kegiatan</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Kegiatan <span className="text-red-500">*</span></label>
            <input value={judul} onChange={e => setJudul(e.target.value)} className={inputCls} placeholder="Nama kegiatan" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
            <textarea value={deskripsi} onChange={e => setDeskripsi(e.target.value)} className={inputCls} rows={3} placeholder="Deskripsi kegiatan..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal <span className="text-red-500">*</span></label>
              <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} className={inputCls} required />
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
            <input value={lokasi} onChange={e => setLokasi(e.target.value)} className={inputCls} placeholder="Tempat pelaksanaan" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Penyelenggara</label>
              <input value={penyelenggara} onChange={e => setPenyelenggara(e.target.value)} className={inputCls} placeholder="Contoh: Dept. Kaderisasi" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Penanggung Jawab</label>
              <input value={penanggungjawab} onChange={e => setPenanggungjawab(e.target.value)} className={inputCls} placeholder="Nama penanggung jawab" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Pengulangan</label>
            <select value={pengulangan} onChange={e => setPengulangan(e.target.value)} className={inputCls}>
              {PENGULANGAN.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Poster / Foto Kegiatan</label>
            <div className="flex items-center gap-4">
              {preview && <img src={preview} alt="preview" className="w-24 h-16 rounded-xl object-cover border" />}
              <button type="button" onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700">
                {preview ? 'Ganti Foto' : 'Upload Poster'}
              </button>
              {fotoBlob && <span className="text-xs text-green-600">✓ Dipilih</span>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
        </div>

        {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">⚠ {errorMsg}</div>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className={`flex-1 text-white py-3 rounded-lg transition font-medium text-sm disabled:opacity-60 ${isProker ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {loading ? 'Menyimpan...' : 'Simpan & Publikasikan'}
          </button>
          <button type="button" onClick={() => router.push('/admin/agenda')}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition text-sm">
            Batal
          </button>
        </div>
      </form>

      {/* Cropper */}
      {showCropper && rawSrc && (
        <ImageCropper src={rawSrc} aspect={16/9} onDone={handleCropDone} onCancel={() => setShowCropper(false)} />
      )}
    </div>
  )
}

export default function TambahAgendaPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Memuat...</div>}>
      <TambahAgendaForm />
    </Suspense>
  )
}
