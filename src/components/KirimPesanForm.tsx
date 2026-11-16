'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'sukses' | 'gagal'

export default function KirimPesanForm() {
  const [form, setForm] = useState({ nama: '', kontak: '', subjek: '', pesan: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [pesanBalas, setPesanBalas] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setPesanBalas('')

    try {
      const res = await fetch('/api/kirim-pesan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('sukses')
        setPesanBalas(data.pesan)
        setForm({ nama: '', kontak: '', subjek: '', pesan: '' })
      } else {
        setStatus('gagal')
        setPesanBalas(data.pesan || 'Gagal mengirim pesan.')
      }
    } catch {
      setStatus('gagal')
      setPesanBalas('Terjadi kesalahan. Silakan coba lagi.')
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Kirim Pesan</h2>
      <p className="text-sm text-gray-500 mb-6">Pesan Anda akan langsung masuk ke email kami.</p>

      {status === 'sukses' && (
        <div className="mb-5 flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{pesanBalas}</span>
        </div>
      )}

      {status === 'gagal' && (
        <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{pesanBalas}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kontak (Email / WhatsApp) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="kontak"
            value={form.kontak}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition"
            placeholder="08xx atau email@contoh.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subjek <span className="text-red-500">*</span>
          </label>
          <select
            name="subjek"
            value={form.subjek}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition bg-white"
          >
            <option value="">-- Pilih Subjek --</option>
            <option value="Pertanyaan Umum">Pertanyaan Umum</option>
            <option value="Kerja Sama">Kerja Sama</option>
            <option value="Pendaftaran Anggota">Pendaftaran Anggota</option>
            <option value="Aspirasi & Saran">Aspirasi &amp; Saran</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Isi Pesan <span className="text-red-500">*</span>
          </label>
          <textarea
            name="pesan"
            value={form.pesan}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition resize-none"
            placeholder="Tuliskan aspirasi atau pertanyaanmu di sini..."
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Mengirim...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Kirim Sekarang
            </>
          )}
        </button>
      </form>
    </div>
  )
}
