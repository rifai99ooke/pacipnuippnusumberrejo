import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata = { title: 'Program Kerja' }
export const dynamic = 'force-dynamic'

export default async function ProgramKerjaPage() {
  // Ambil departemen dari database (exclude BPH - tidak punya proker)
  const { data: deptData } = await supabase
    .from('departemen')
    .select('*')
    .eq('aktif', true)
    .neq('tipe', 'bph')
    .order('urutan')

  const depts = deptData || []

  // Hitung jumlah proker per departemen
  const { data: counts } = await supabase
    .from('program_kerja')
    .select('departemen')

  const countMap: Record<string, number> = {}
  counts?.forEach((c: any) => {
    countMap[c.departemen] = (countMap[c.departemen] || 0) + 1
  })

  return (
    <>
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Program Kerja</h1>
          <p className="text-green-100 text-lg">Klik card untuk melihat detail program kerja setiap departemen</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {depts.length === 0 ? (
            <p className="text-center text-gray-500 py-16">Belum ada departemen.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {depts.map((d: any) => {
                const count = countMap[d.slug] || 0
                return (
                  <Link
                    key={d.slug}
                    href={`/kegiatan/program-kerja/${d.slug}`}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group block"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${d.warna || '#16a34a'}20` }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          style={{ color: d.warna || '#16a34a' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">{d.nama}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{d.deskripsi}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {count > 0 ? `${count} program kerja` : 'Belum ada data'}
                      </span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
