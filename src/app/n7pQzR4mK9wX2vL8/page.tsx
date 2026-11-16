import { supabase } from '@/lib/supabase'

export const metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboard() {
  const [berita, prestasi, agenda, dokumentasi] = await Promise.all([
    supabase.from('berita').select('id', { count: 'exact', head: true }),
    supabase.from('prestasi').select('id', { count: 'exact', head: true }),
    supabase.from('agenda').select('id', { count: 'exact', head: true }),
    supabase.from('dokumentasi').select('id', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Berita', count: berita.count || 0, color: 'bg-blue-500', href: '/n7pQzR4mK9wX2vL8/berita' },
    { label: 'Prestasi', count: prestasi.count || 0, color: 'bg-yellow-500', href: '/n7pQzR4mK9wX2vL8/prestasi' },
    { label: 'Agenda', count: agenda.count || 0, color: 'bg-green-500', href: '/n7pQzR4mK9wX2vL8/agenda' },
    { label: 'Dokumentasi', count: dokumentasi.count || 0, color: 'bg-purple-500', href: '/n7pQzR4mK9wX2vL8/dokumentasi' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <a key={s.label} href={s.href} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center mb-4`}>
              <span className="text-white text-2xl font-bold">{s.count}</span>
            </div>
            <p className="text-gray-900 font-semibold">{s.label}</p>
            <p className="text-gray-500 text-sm mt-1">Total data</p>
          </a>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">Menu Cepat</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: '+ Tambah Berita', href: '/n7pQzR4mK9wX2vL8/berita/tambah', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
            { label: '+ Tambah Prestasi', href: '/n7pQzR4mK9wX2vL8/prestasi/tambah', color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' },
            { label: '+ Tambah Agenda', href: '/n7pQzR4mK9wX2vL8/agenda/tambah', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
            { label: '+ Tambah Dokumentasi', href: '/n7pQzR4mK9wX2vL8/dokumentasi/tambah', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
          ].map((item) => (
            <a key={item.href} href={item.href} className={`px-4 py-3 rounded-lg text-sm font-medium text-center transition ${item.color}`}>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
