import { supabase } from '@/lib/supabase'

export const metadata = { title: 'Visi & Misi' }
export const revalidate = 60

export default async function VisiMisiPage() {
  const { data } = await supabase.from('visi_misi').select('*').single()

  const visi = data?.visi || 'Terbentuknya pelajar, santri, dan mahasiswa yang bertaqwa kepada Allah SWT, berilmu, berakhlak mulia, dan berwawasan kebangsaan serta bertanggung jawab atas tegak dan terlaksananya syariat Islam menurut faham Ahlussunnah wal Jamaah.'
  const misi: string[] = Array.isArray(data?.misi) ? data.misi : [
    'Menghimpun dan membina pelajar NU dalam wadah organisasi.',
    'Mengembangkan potensi kreatif, keilmuan, dan sosial kader.',
    'Membangun kesadaran berbangsa dan bernegara bagi generasi muda.',
    'Menanamkan nilai-nilai Ahlussunnah wal Jamaah An-Nahdliyah.',
    'Mendorong kader untuk berprestasi di berbagai bidang.',
    'Memperkuat ukhuwah Islamiyah dan solidaritas antar pelajar NU.',
  ]

  return (
    <>
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Visi & Misi</h1>
          <p className="text-green-100 text-lg">PAC IPNU IPPNU Sumberrejo</p>
        </div>
      </section>

      <section className="py-16 bg-gray-100 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Visi */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Visi Organisasi</h2>
            </div>
            {/* Render HTML jika ada tag, plain text jika tidak */}
            {visi.includes('<') ? (
              <div
                className="text-gray-700 leading-relaxed prose max-w-none prose-p:mb-2"
                dangerouslySetInnerHTML={{ __html: visi }}
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{visi}</p>
            )}
          </div>

          {/* Misi */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Misi Organisasi</h2>
            </div>
            <ol className="space-y-3">
              {misi.map((m: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-gray-700 leading-relaxed">{m}</span>
                </li>
              ))}
            </ol>
          </div>

        </div>
      </section>
    </>
  )
}
