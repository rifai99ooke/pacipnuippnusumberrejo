'use client'

interface Props {
  open:      boolean
  title?:    string
  message:   string
  onConfirm: () => void
  onCancel:  () => void
  confirmLabel?: string
  confirmColor?: 'red' | 'green'
}

export default function ConfirmDialog({
  open, title = 'Konfirmasi', message,
  onConfirm, onCancel,
  confirmLabel = 'Ya, Hapus',
  confirmColor = 'red',
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Icon */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
            confirmColor === 'red' ? 'bg-red-100' : 'bg-green-100'
          }`}>
            {confirmColor === 'red' ? (
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">{title}</h3>
          <p className="text-sm text-gray-500 text-center leading-relaxed">{message}</p>
        </div>

        {/* Buttons */}
        <div className="flex border-t border-gray-100">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition border-r border-gray-100"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3.5 text-sm font-semibold transition ${
              confirmColor === 'red'
                ? 'text-red-600 hover:bg-red-50'
                : 'text-green-600 hover:bg-green-50'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
