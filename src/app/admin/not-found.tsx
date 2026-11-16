import Link from 'next/link'

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-gray-600 text-sm font-mono mb-2">404</p>
        <h1 className="text-white text-xl font-bold mb-4">Halaman tidak ditemukan</h1>
        <Link href="/" className="text-green-500 hover:text-green-400 text-sm transition">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
