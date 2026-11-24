'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

interface CropArea { x: number; y: number; width: number; height: number }

interface Props {
  src: string
  aspect?: number       // default 3/4, undefined = bebas
  freeAspect?: boolean  // kalau true, tidak ada paksa rasio
  onDone: (croppedBlob: Blob, previewUrl: string) => void
  onCancel: () => void
}

async function getCroppedImg(imageSrc: string, pixelCrop: CropArea): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = imageSrc
  })

  const canvas = document.createElement('canvas')
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height)

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.92))
}

export default function ImageCropper({ src, aspect = 3 / 4, freeAspect = false, onDone, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null)

  const onCropComplete = useCallback((_: any, croppedPixels: CropArea) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleDone = async () => {
    if (!croppedAreaPixels) return
    const blob = await getCroppedImg(src, croppedAreaPixels)
    const url = URL.createObjectURL(blob)
    onDone(blob, url)
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">Crop Foto</h3>
            {freeAspect && <p className="text-xs text-gray-400 mt-0.5">Geser & zoom untuk menyesuaikan</p>}
          </div>
          <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Crop area */}
        <div className="relative w-full" style={{ height: 380 }}>
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={freeAspect ? undefined : aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom slider */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <label className="text-xs text-gray-500 font-medium mb-1 block">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-green-600"
          />
        </div>

        {/* Buttons */}
        <div className="px-5 py-4 flex justify-end gap-3 border-t border-gray-100">
          <button type="button" onClick={onCancel} className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            Batal
          </button>
          <button type="button" onClick={handleDone} className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition">
            Gunakan Foto
          </button>
        </div>
      </div>
    </div>
  )
}
