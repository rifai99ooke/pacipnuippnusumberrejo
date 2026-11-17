import { supabase, getStorageUrl } from '@/lib/supabase'

export const metadata = { title: 'Estafet Kepemimpinan' }
export const revalidate = 60

export default async function EstafetPage() {
  const { data } = await supabase.from('estafet').select('*').order('urutan', { ascending: false })
  const periodes = data || []

  return (
    <>
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Estafet Kepemimpinan</h1>
          <p className="text-green-100 text-lg">Perjalanan kepemimpinan PAC IPNU IPPNU Sumberrejo</p>
        </div>
      </section>

      <section className="py-16 bg-gray-100 min-h-screen">
        <div className="max-w-5xl mx-auto px-4">

          {periodes.length === 0 ? (
            <p className="text-center text-gray-500 py-16">Data belum tersedia.</p>
          ) : (
            <div className="relative">
              {/* Garis vertikal di tengah — desktop dan mobile */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 -translate-x-1/2" />

              <div className="space-y-12">
                {periodes.map((p: any, i: number) => {
                  const ipnuFoto  = getStorageUrl('estafet', p.foto_ketua_ipnu)
                  const ippnuFoto = getStorageUrl('estafet', p.foto_ketua_ippnu)
                  const isLeft = i % 2 === 0

                  return (
                    <div key={p.id} className="relative flex items-center">

                      {/* Card bergantian kiri-kanan — desktop & mobile */}
                      <div className={`flex w-full items-center ${isLeft ? 'justify-start' : 'justify-end'}`}>
                        <div className="w-5/12">
                          <EstafetCard
                            periode={p.periode}
                            aktif={p.aktif}
                            ipnu={{ nama: p.nama_ketua_ipnu, foto: ipnuFoto }}
                            ippnu={{ nama: p.nama_ketua_ippnu, foto: ippnuFoto }}
                          />
                        </div>
                      </div>

                      {/* Dot di tengah */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        {p.aktif ? (
                          <div className="w-5 h-5 rounded-full border-2 border-green-600 bg-white shadow-md" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-gray-300 border-2 border-white shadow" />
                        )}
                      </div>

                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function EstafetCard({ periode, aktif, ipnu, ippnu, hidePeriode }: {
  periode: string
  aktif: boolean
  ipnu:  { nama: string; foto: string | null }
  ippnu: { nama: string; foto: string | null }
  hidePeriode?: boolean
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm p-3 md:p-6 ${aktif ? 'ring-2 ring-green-500' : ''}`}>
      {!hidePeriode && (
        <p className={`font-bold text-sm md:text-lg text-center mb-3 md:mb-5 ${aktif ? 'text-green-600' : 'text-gray-500'}`}>
          {periode}
          {aktif && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Aktif</span>}
        </p>
      )}
      <div className="flex gap-2 md:gap-6 justify-center">
        {[
          { ...ipnu,  jabatan: 'KETUA IPNU',  color: '#16a34a' },
          { ...ippnu, jabatan: 'KETUA IPPNU', color: '#16a34a' },
        ].map((k) => (
          <div key={k.jabatan} className="text-center">
            <div className="w-14 h-14 md:w-24 md:h-24 rounded-xl overflow-hidden mx-auto mb-1 md:mb-2 bg-gray-100">
              {k.foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={k.foto} alt={k.nama} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/Logo.png" alt="Logo" className="w-8 h-8 md:w-12 md:h-12 object-contain opacity-20" />
                </div>
              )}
            </div>
            <p className="text-xs font-semibold text-gray-900 leading-tight">{k.nama || '-'}</p>
            <p className="text-xs font-bold mt-0.5" style={{ color: k.color }}>{k.jabatan}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
