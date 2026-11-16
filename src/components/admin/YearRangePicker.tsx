'use client'

interface Props {
  value: string        // format: "2024 – 2026"
  onChange: (val: string) => void
}

export default function YearRangePicker({ value, onChange }: Props) {
  const parts = value ? value.split(/\s*[–\-]\s*/) : []
  const tahunMulai   = parts[0]?.trim() || ''
  const tahunSelesai = parts[1]?.trim() || ''

  const inputCls = 'w-28 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition text-sm text-center'

  const handleMulai = (val: string) => {
    onChange(val && tahunSelesai ? `${val} – ${tahunSelesai}` : val || '')
  }

  const handleSelesai = (val: string) => {
    onChange(tahunMulai && val ? `${tahunMulai} – ${val}` : tahunMulai || '')
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <label className="text-xs text-gray-500 font-medium">Tahun Mulai</label>
        <input
          type="number"
          value={tahunMulai}
          onChange={e => handleMulai(e.target.value)}
          className={inputCls}
          placeholder="2024"
          min="1900"
        />
      </div>

      <span className="text-gray-400 font-bold text-lg mt-4">–</span>

      <div className="flex flex-col items-center gap-1">
        <label className="text-xs text-gray-500 font-medium">Tahun Selesai</label>
        <input
          type="number"
          value={tahunSelesai}
          onChange={e => handleSelesai(e.target.value)}
          className={inputCls}
          placeholder="2026"
          min="1900"
        />
      </div>

      {/* Preview */}
      {tahunMulai && tahunSelesai && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-semibold">
          {tahunMulai} – {tahunSelesai}
        </div>
      )}
    </div>
  )
}
