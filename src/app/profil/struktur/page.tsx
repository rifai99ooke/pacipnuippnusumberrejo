import Link from 'next/link'
import { supabase, getStorageUrl } from '@/lib/supabase'

export const revalidate = 60
export const metadata = { title: 'Struktur Kepengurusan' }

function FotoAvatar({ foto, nama, size = 'md' }: { foto: string | null; nama: string; size?: 'sm' | 'md' | 'lg' }) {
  const fotoUrl = foto ? getStorageUrl('pengurus', foto) : null
  const sizeClass = size === 'lg' ? 'w-24 h-24' : size === 'md' ? 'w-16 h-16' : 'w-10 h-10'
  return (
    <div className={`${sizeClass} rounded-full overflow-hidden bg-green-100 flex-shrink-0`}>
      {fotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={fotoUrl} alt={nama} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="font-bold text-green-600" style={{ fontSize: size === 'lg' ? 28 : size === 'md' ? 20 : 14 }}>
            {nama?.charAt(0)}
          </span>
        </div>
      )}
    </div>
  )
}

// Card Ketua + Wakil Ketua
function CardKetuaWakil({ list, title, color }: { list: any[]; title: string; color: 'green' | 'teal' }) {
  const ketua   = list.find(p => p.jabatan === 'Ketua')
  const wakils  = list.filter(p => p.jabatan?.startsWith('Wakil Ketua')).sort((a, b) => a.jabatan.localeCompare(b.jabatan))
  const accent  = color === 'green' ? 'border-green-500 text-green-600' : 'border-teal-500 text-teal-600'
  const bgAccent = color === 'green' ? 'bg-green-50' : 'bg-teal-50'

  return (
    <div className={`bg-white rounded-2xl border-t-4 ${color === 'green' ? 'border-green-500' : 'border-teal-500'} shadow-sm p-6`}>
      <p className={`text-xs font-bold tracking-widest uppercase mb-1 ${color === 'green' ? 'text-green-600' : 'text-teal-600'}`}>{title}</p>

      {/* Ketua */}
      {ketua ? (
        <div className="flex flex-col items-center py-5 border-b border-gray-100 mb-4">
          <FotoAvatar foto={ketua.foto} nama={ketua.nama} size="lg" />
          <p className={`text-xs font-bold tracking-wider uppercase mt-3 mb-1 ${color === 'green' ? 'text-green-600' : 'text-teal-600'}`}>
            {ketua.jabatan}
          </p>
          <p className="text-xl font-black text-gray-900">{ketua.nama}</p>
        </div>
      ) : (
        <div className="py-5 border-b border-gray-100 mb-4 text-center text-gray-400 text-sm">Belum ada data</div>
      )}

      {/* Wakil Ketua */}
      {wakils.length > 0 && (
        <div className={`${bgAccent} rounded-xl p-3 space-y-2`}>
          {wakils.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <FotoAvatar foto={p.foto} nama={p.nama} size="sm" />
                <span className="text-xs text-gray-500 truncate">{p.jabatan}</span>
              </div>
              <span className="text-xs font-bold text-gray-900 text-right flex-shrink-0">{p.nama}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Card Sekretaris atau Bendahara
function CardDivisi({ list, judul, icon, color }: { list: any[]; judul: string; icon: string; color: 'green' | 'teal' }) {
  const ketua  = list.find(p => p.jabatan === judul || p.jabatan === `${judul} 1`)
  const wakas  = list.filter(p => p.jabatan !== judul && p.jabatan !== `${judul} 1`).sort((a, b) => a.jabatan.localeCompare(b.jabatan))

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className={`text-xs font-bold tracking-widest uppercase ${color === 'green' ? 'text-green-600' : 'text-teal-600'}`}>{judul}</span>
        </div>
        {ketua && (
          <div className="flex items-center gap-2">
            <FotoAvatar foto={ketua.foto} nama={ketua.nama} size="sm" />
            <span className="text-sm font-bold text-gray-900">{ketua.nama}</span>
          </div>
        )}
      </div>
      {wakas.length > 0 ? (
        <div className="space-y-2">
          {wakas.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <FotoAvatar foto={p.foto} nama={p.nama} size="sm" />
                <span className="text-xs text-gray-500 truncate">{p.jabatan.replace(judul, 'Waka.')}</span>
              </div>
              <span className="text-xs font-bold text-gray-900 flex-shrink-0">{p.nama}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400 text-center py-2">Belum ada data</p>
      )}
    </div>
  )
}

function PengurusCard({ p }: { p: any }) {
  const fotoUrl = getStorageUrl('pengurus', p.foto)
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
      <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden bg-gray-200">
        {fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fotoUrl} alt={p.nama} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-100">
            <span className="text-xl font-bold text-green-600">{p.nama?.charAt(0)}</span>
          </div>
        )}
      </div>
      <p className="font-semibold text-gray-900 text-sm">{p.nama}</p>
      <p className="text-xs font-medium mt-1 text-green-600">{p.jabatan}</p>
    </div>
  )
}

export default async function StrukturPage() {
  const { data: deptData } = await supabase.from('departemen').select('*').eq('aktif', true).order('urutan')
  const semuaDept  = deptData || []
  const departemen = semuaDept.filter((d: any) => d.tipe === 'departemen')
  const lembaga    = semuaDept.filter((d: any) => d.tipe === 'lembaga')

  const [bphIpnuRes, bphIppnuRes, harianRes] = await Promise.all([
    supabase.from('pengurus').select('*').eq('aktif', true).eq('departemen', 'bph-ipnu').order('urutan'),
    supabase.from('pengurus').select('*').eq('aktif', true).eq('departemen', 'bph-ippnu').order('urutan'),
    supabase.from('pengurus').select('*').eq('aktif', true).is('departemen', null).order('urutan'),
  ])

  const listBphIpnu  = bphIpnuRes.data  || []
  const listBphIppnu = bphIppnuRes.data || []
  const listHarian   = harianRes.data   || []

  const hasBph = listBphIpnu.length > 0 || listBphIppnu.length > 0

  return (
    <>
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Struktur Kepengurusan</h1>
        </div>
      </section>

      {/* BPH — Layout baru */}
      {hasBph && (
        <section className="py-14 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Judul */}
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 h-px bg-gray-200" />
              <h2 className="text-xl font-black text-gray-900 tracking-wide uppercase">Badan Pengurus Harian</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Ketua & Wakil Ketua — IPNU kiri, IPPNU kanan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {listBphIpnu.length > 0 && (
                <CardKetuaWakil
                  list={listBphIpnu}
                  title="BPH IPNU"
                  color="green"
                />
              )}
              {listBphIppnu.length > 0 && (
                <CardKetuaWakil
                  list={listBphIppnu}
                  title="BPH IPPNU"
                  color="teal"
                />
              )}
            </div>

            {/* Sekretaris & Bendahara */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
              {/* Sekretaris IPNU */}
              {listBphIpnu.some((p: any) => p.jabatan?.startsWith('Sekretaris')) && (
                <CardDivisi
                  list={listBphIpnu.filter((p: any) => p.jabatan?.startsWith('Sekretaris'))}
                  judul="Sekretaris"
                  icon="📋"
                  color="green"
                />
              )}
              {/* Bendahara IPNU */}
              {listBphIpnu.some((p: any) => p.jabatan?.startsWith('Bendahara')) && (
                <CardDivisi
                  list={listBphIpnu.filter((p: any) => p.jabatan?.startsWith('Bendahara'))}
                  judul="Bendahara"
                  icon="💰"
                  color="green"
                />
              )}
            </div>
            {/* Sekretaris & Bendahara IPPNU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {listBphIppnu.some((p: any) => p.jabatan?.startsWith('Sekretaris')) && (
                <CardDivisi
                  list={listBphIppnu.filter((p: any) => p.jabatan?.startsWith('Sekretaris'))}
                  judul="Sekretaris"
                  icon="📋"
                  color="teal"
                />
              )}
              {listBphIppnu.some((p: any) => p.jabatan?.startsWith('Bendahara')) && (
                <CardDivisi
                  list={listBphIppnu.filter((p: any) => p.jabatan?.startsWith('Bendahara'))}
                  judul="Bendahara"
                  icon="💰"
                  color="teal"
                />
              )}
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

      {/* Departemen */}
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

      {/* Lembaga */}
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
