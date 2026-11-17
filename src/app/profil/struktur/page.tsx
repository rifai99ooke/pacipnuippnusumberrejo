import Link from 'next/link'
import { supabase, getStorageUrl } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Struktur Kepengurusan' }

function PengurusCard({ p }: { p: any }) {
  const fotoUrl = getStorageUrl('pengurus', p.foto)
  const isIPNU  = p.organisasi === 'IPNU'
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
      <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden bg-gray-200">
        {fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fotoUrl} alt={p.nama} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${isIPNU ? 'bg-green-100' : 'bg-pink-100'}`}>
            <span className={`text-xl font-bold ${isIPNU ? 'text-green-600' : 'text-pink-600'}`}>{p.nama?.charAt(0)}</span>
          </div>
        )}
      </div>
      <p className="font-semibold text-gray-900 text-sm">{p.nama}</p>
      <p className={`text-xs font-medium mt-1 ${isIPNU ? 'text-green-600' : 'text-pink-600'}`}>{p.jabatan}</p>
    </div>
  )
}

export default async function StrukturPage() {
  // Ambil departemen dari database
  const { data: deptData } = await supabase
    .from('departemen')
    .select('*')
    .eq('aktif', true)
    .order('urutan')

  const semuaDept  = deptData || []
  const departemen = semuaDept.filter((d: any) => d.tipe === 'departemen')
  const lembaga    = semuaDept.filter((d: any) => d.tipe === 'lembaga')

  // Ambil pengurus dari database
  const [bphIpnuRes, bphIppnuRes, harianRes] = await Promise.all([
    supabase.from('pengurus').select('*').eq('aktif', true).eq('departemen', 'bph-ipnu').order('urutan'),
    supabase.from('pengurus').select('*').eq('aktif', true).eq('departemen', 'bph-ippnu').order('urutan'),
    supabase.from('pengurus').select('*').eq('aktif', true).is('departemen', null).order('urutan'),
  ])

  const listBphIpnu  = bphIpnuRes.data  || []
  const listBphIppnu = bphIppnuRes.data || []
  const listHarian   = harianRes.data   || []

  return (
    <>
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Struktur Kepengurusan</h1>
        </div>
      </section>

      {/* BPH IPNU */}
      {listBphIpnu.length > 0 && (
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-green-600 rounded-full" />
              <h2 className="text-2xl font-bold text-gray-900">Badan Pengurus Harian IPNU</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {listBphIpnu.map((p: any) => <PengurusCard key={p.id} p={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* BPH IPPNU */}
      {listBphIppnu.length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-pink-600 rounded-full" />
              <h2 className="text-2xl font-bold text-gray-900">Badan Pengurus Harian IPPNU</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {listBphIppnu.map((p: any) => <PengurusCard key={p.id} p={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Pengurus lama (null departemen) */}
      {listHarian.length > 0 && (
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-gray-400 rounded-full" />
              <h2 className="text-2xl font-bold text-gray-900">Pengurus Harian</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {listHarian.map((p: any) => <PengurusCard key={p.id} p={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Departemen dari database */}
      {departemen.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Departemen & Bidang</h2>
              <p className="text-gray-600">Klik departemen untuk melihat detail anggota</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departemen.map((d: any) => (
                <Link key={d.slug} href={`/profil/departemen/${d.slug}`}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group block">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">{d.nama}</h3>
                  <p className="text-gray-600 text-sm mb-4">{d.deskripsi}</p>
                  <div className="flex justify-end">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lembaga dari database */}
      {lembaga.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Lembaga</h2>
              <p className="text-gray-600">Lembaga semi-otonom di bawah PAC IPNU IPPNU Sumberrejo</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {lembaga.map((l: any) => (
                <Link key={l.slug} href={`/profil/lembaga/${l.slug}`}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group block">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">{l.nama}</h3>
                  <p className="text-gray-600 text-sm mb-4">{l.deskripsi}</p>
                  <div className="flex justify-end">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
