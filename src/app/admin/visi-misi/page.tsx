'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import RichTextEditor from '@/components/admin/RichTextEditor'

const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition text-sm'

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  )
}

export default function VisiMisiAdminPage() {
  const [loading, setLoading]     = useState(false)
  const [saved, setSaved]         = useState(false)
  const [errorMsg, setErrorMsg]   = useState('')
  const [existingId, setExistingId] = useState<number | null>(null)
  const [visi, setVisi]           = useState('')
  const [misiList, setMisiList]   = useState<string[]>([''])

  useEffect(() => {
    supabase.from('visi_misi').select('*').limit(1).single().then(({ data }) => {
      if (data) {
        setExistingId(data.id)
        setVisi(data.visi ?? '')
        const list = Array.isArray(data.misi) ? data.misi : []
        setMisiList(list.length > 0 ? list : [''])
      }
    })
  }, [])

  const addMisi   = () => setMisiList(prev => [...prev, ''])
  const removeMisi = (i: number) => setMisiList(prev => prev.filter((_, idx) => idx !== i))
  const updateMisi = (i: number, val: string) => setMisiList(prev => prev.map((m, idx) => idx === i ? val : m))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setSaved(false); setErrorMsg('')

    try {
      const misiArray = misiList.map(s => s.trim()).filter(Boolean)
      if (!visi.trim()) throw new Error('Visi tidak boleh kosong.')
      if (misiArray.length === 0) throw new Error('Minimal isi 1 poin misi.')

      const payload = { visi, misi: misiArray }

      if (existingId) {
        const { error } = await supabase.from('visi_misi').update(payload).eq('id', existingId)
        if (error) throw new Error(error.message)
      } else {
        const { data, error } = await supabase.from('visi_misi').insert(payload).select('id').single()
        if (error) throw new Error(error.message)
        setExistingId(data.id)
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Visi &amp; Misi</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Visi */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <FormField label="Visi Organisasi" hint="Gunakan editor untuk memformat teks visi.">
            <RichTextEditor
              value={visi}
              onChange={(val) => { setVisi(val); setSaved(false) }}
              placeholder="Tuliskan visi organisasi..."
            />
          </FormField>
        </div>

        {/* Misi */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">Poin-Poin Misi</label>
            <button
              type="button"
              onClick={addMisi}
              className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium hover:text-green-700 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Poin
            </button>
          </div>

          <div className="space-y-3">
            {misiList.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                {/* Nomor */}
                <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                {/* Input */}
                <input
                  type="text"
                  value={m}
                  onChange={(e) => updateMisi(i, e.target.value)}
                  className={inputCls}
                  placeholder={`Misi ke-${i + 1}`}
                />
                {/* Hapus */}
                {misiList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMisi(i)}
                    className="text-red-400 hover:text-red-600 flex-shrink-0 transition"
                    title="Hapus poin"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">⚠ {errorMsg}</div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition font-medium text-sm disabled:opacity-60"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          {saved && <span className="text-green-600 text-sm font-medium">✓ Tersimpan!</span>}
        </div>
      </form>
    </div>
  )
}
