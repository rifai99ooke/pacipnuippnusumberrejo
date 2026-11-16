'use client'

import { useState, useRef } from 'react'
import ImageCropper from './ImageCropper'

interface Props {
  preview: string
  onCropped: (blob: Blob, previewUrl: string) => void
  aspect?: number
  label?: string
}

export default function ImageUploadWithCrop({ preview, onCropped, aspect = 3 / 4, label = 'Pilih Foto' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [rawSrc, setRawSrc] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [cropped, setCropped] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setRawSrc(url)
    setShowCropper(true)
    setCropped(false)
    e.target.value = ''
  }

  const handleDone = (blob: Blob, previewUrl: string) => {
    setShowCropper(false)
    setCropped(true)
    onCropped(blob, previewUrl)
  }

  return (
    <div className="space-y-3">
      {/* Preview foto */}
      {preview && (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200"
            onError={(e: any) => { e.target.src = '' ; e.target.style.display = 'none' }}
          />
          {cropped && (
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              ✓ Foto siap disimpan
            </span>
          )}
        </div>
      )}

      {/* Tombol pilih foto */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {label}
      </button>
      <p className="text-xs text-gray-400">JPG, PNG, WEBP. Akan muncul editor crop setelah dipilih.</p>

      {/* Hidden input */}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {/* Cropper modal */}
      {showCropper && rawSrc && (
        <ImageCropper
          src={rawSrc}
          aspect={aspect}
          onDone={handleDone}
          onCancel={() => setShowCropper(false)}
        />
      )}
    </div>
  )
}
