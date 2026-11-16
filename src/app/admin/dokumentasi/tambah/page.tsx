'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition text-sm'

export default function TambahDokumentasiPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [agendaList, setAgendaList] = useState<any[]>([])
  const [agendaId, setAgendaId] = useState('')
  const [agendaInfo, setAgendaInfo] = useState<any>(null)
  const [namaKegiatan, setNamaKegiatan] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [deskripsi, setDeskripsi] = useState('')

  useEffect(() => {
    supabase.from('agenda').select('id, judul, tanggal, jenis').order('tanggal', { ascending: false })
      .then(({ data }) => setAgendaList(data || []))
  }, [])

  useEffect(() => {
    if (!agendaId) { setAgendaInfo(null); return }
    const found = agendaList.find(a => String(a.id) === agendaId)
    setAgendaInfo(found || null)
    if (found) {
      setNamaKegiatan(found.judul)
      setTanggal(found.tanggal || '')
    }
  }, [agendaId, agendaList])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!namaKegiatan.trim()) { setErrorMsg('Nama kegiatan wajib diisi.'); return }
    if (!tanggal) { setErrorMsg('Tanggal wajib diisi.'); return }
    setLoading(true); setErrorMsg('')

    try {
      const { data, error } = await supabase.from('dokumentasi').insert({
        nama_kegiatan: namaKegiatan,
        tanggal,
        deskripsi: deskripsi || null,
        agenda_id: agendaId ? parseInt(agendaId) : null,
      }).select('id').single()

      if (error) throw new Error(error.message)
      // Langsung ke halaman kelola foto
      router.push(`/admin/dokumentasi/${data.id}/foto`)
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Buat Album Dokumentasi</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">

        {/* Pilih Agenda */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-green-800">Pilih Agenda (Opsional)</h2>
          <p className="text-xs text-green-600">Pilih agenda jika dokumentasi ini terkait dengan kegiatan tertentu</p>

          <select value={agendaId} onChange={e => setAgendaId(e.target.value)} className={inputCls}>
            <option value="">— Tidak terhubung agenda —</option>
            {agendaList.map(a => (
              <option key={a.id} value={a.id}>
                {a.judul} ({new Date(a.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })})
              </option>
            ))}
          </select>

          {agendaInfo && (
            <div className="bg-white rounded-lg p-3 border border-green-200 text-sm">
              <p className="font-semibold text-gray-900">{agendaInfo.judul}</p>
              <p className="text-gray-500 text-xs mt-0.5">
                {new Date(agendaInfo.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>

        {/* Detail Album */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Kegiatan <span className="text-red-500">*</span></label>
          <input value={namaKegiatan} onChange={e => setNamaKegiatan(e.target.value)} className={inputCls} placeholder="Nama kegiatan yang didokumentasikan" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal <span className="text-red-500">*</span></label>
          <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} className={inputCls} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi (opsional)</label>
          <textarea value={deskripsi} onChange={e => setDeskripsi(e.target.value)} className={inputCls} rows={3} placeholder="Deskripsi singkat kegiatan..." />
        </div>

        {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">⚠ {errorMsg}</div>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium text-sm disabled:opacity-60">
            {loading ? 'Membuat Album...' : 'Buat Album & Upload Foto →'}
          </button>
          <button type="button" onClick={() => router.push('/admin/dokumentasi')} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition text-sm">
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}
