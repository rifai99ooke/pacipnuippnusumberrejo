'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NotFound() {
  const pathname = usePathname()
  const isAdminPath = pathname?.startsWith('/admin') ||
                      pathname?.startsWith('/n7pQzR4mK9wX2vL8') ||
                      pathname?.startsWith('/xk9m2-secure-panel')

  if (isAdminPath) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-600 text-sm font-mono">404 — Halaman tidak ditemukan</p>
      </div>
    )
  }

  // 404 publik dengan tampilan normal (navbar/footer dari layout)
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-green-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Halaman tidak ditemukan</h2>
        <p className="text-gray-500 mb-8">Halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
        <Link
          href="/"
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
