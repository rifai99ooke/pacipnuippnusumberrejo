'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition text-sm'

export default function EditDokumentasiPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [agendaList, setAgendaList] = useState<any[]>([])
  const [agendaId, setAgendaId] = useState('')
  const [namaKegiatan, setNamaKegiatan] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [deskripsi, setDeskripsi] = useState('')

  useEffect(() => {
    // Load agenda list
    supabase.from('agenda').select('id, judul, tanggal').order('tanggal', { ascending: false })
      .then(({ data }) => setAgendaList(data || []))

    // Load data album
    supabase.from('dokumentasi')
      .select('id, nama_kegiatan, tanggal, deskripsi, agenda_id')
      .eq('id', params.id).single()
      .then(({ data }) => {
        if (data) {
          setNamaKegiatan(data.nama_kegiatan || '')
          setTanggal(data.tanggal || '')
          setDeskripsi(data.deskripsi || '')
          setAgendaId(data.agenda_id ? String(data.agenda_id) : '')
        }
      })
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!namaKegiatan.trim()) { setErrorMsg('Nama kegiatan wajib diisi.'); return }
    if (!tanggal) { setErrorMsg('Tanggal wajib diisi.'); return }
    setLoading(true); setErrorMsg('')

    try {
      const { error } = await supabase.from('dokumentasi').update({
        nama_kegiatan: namaKegiatan,
        tanggal,
        deskripsi: deskripsi || null,
        agenda_id: agendaId ? parseInt(agendaId) : null,
        updated_at: new Date().toISOString(),
      }).eq('id', params.id)

      if (error) throw new Error(error.message)
      router.push('/n7pQzR4mK9wX2vL8/dokumentasi')
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Album Dokumentasi</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">

        {/* Pilih Agenda */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-green-800">Pilih Agenda (Opsional)</h2>
          <select value={agendaId} onChange={e => setAgendaId(e.target.value)} className={inputCls}>
            <option value="">— Tidak terhubung agenda —</option>
            {agendaList.map(a => (
              <option key={a.id} value={a.id}>
                {a.judul} ({new Date(a.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Kegiatan <span className="text-red-500">*</span></label>
          <input value={namaKegiatan} onChange={e => setNamaKegiatan(e.target.value)} className={inputCls} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal <span className="text-red-500">*</span></label>
          <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} className={inputCls} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
          <textarea value={deskripsi} onChange={e => setDeskripsi(e.target.value)} className={inputCls} rows={3} />
        </div>

        {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">⚠ {errorMsg}</div>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium text-sm disabled:opacity-60">
            {loading ? 'Menyimpan...' : 'Update Album'}
          </button>
          <button type="button" onClick={() => router.push('/n7pQzR4mK9wX2vL8/dokumentasi')} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition text-sm">
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}
