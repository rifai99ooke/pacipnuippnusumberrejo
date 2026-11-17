import Image from 'next/image'
import Link from 'next/link'
import { supabase, getStorageUrl } from '@/lib/supabase'
import SambutanSection from '@/components/SambutanSection'

export const revalidate = 60

async function getBeranda() {
  const { data } = await supabase.from('beranda').select('*').single()
  // Fallback ke data default jika Supabase kosong
  return data || {
    nama_ketua_ipnu: 'Ahmad Hidayat',
    jabatan_ketua_ipnu: 'Ketua PAC IPNU',
    foto_ketua_ipnu: null,
    sambutan_ketua_ipnu: 'Rekan dan Rekanita yang saya banggakan, IPNU IPPNU adalah kawah candradimuka bagi pelajar NU. Di sini kita tidak hanya belajar berorganisasi, tapi juga mengasah kepekaan sosial dan kecintaan pada tanah air.',
    tagline_ketua_ipnu: 'Belajar, Berjuang, Bertaqwa',
    nama_ketua_ippnu: 'Siti Fatimah',
    jabatan_ketua_ippnu: 'Ketua PAC IPPNU',
    foto_ketua_ippnu: null,
    sambutan_ketua_ippnu: 'Saudari-saudariku yang terhormat, IPPNU adalah wadah bagi putri-putri NU untuk berkembang dan berkontribusi. Mari kita bersama membangun generasi perempuan yang cerdas, mandiri, dan berakhlak mulia.',
    tagline_ketua_ippnu: 'Cerdas, Terampil, Mandiri',
  }
}

async function getBeritaTerbaru() {
  const { data } = await supabase
    .from('berita')
    .select('*')
    .eq('published', true)
    .order('tanggal_publish', { ascending: false })
    .limit(3)
  return data || []
}

const gradients = ['from-green-300 to-green-500', 'from-blue-300 to-blue-500', 'from-yellow-300 to-yellow-500']

export default async function BerandaPage() {
  const [beranda, beritas] = await Promise.all([getBeranda(), getBeritaTerbaru()])

  return (
    <>
      {/* Hero - Full Screen */}
      <section className="bg-white min-h-screen flex items-center px-4 -mt-20 pt-20">
        <div className="max-w-4xl mx-auto text-center w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
            Membangun Generasi Pelajar NU yang{' '}
            <span className="text-green-600">Berilmu</span>, Berakhlak, & Berorganisasi
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            Wadah perjuangan pelajar, santri, dan mahasiswa Nahdlatul Ulama untuk mengembangkan potensi diri demi nusa, bangsa, dan agama.
          </p>
          <Link href="/kegiatan/program-kerja" className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold">
            Lihat Kegiatan
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Sambutan Ketua */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SambutanSection beranda={beranda} />
        </div>
      </section>

      {/* Berita Terbaru */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Berita Terbaru</h2>
              <p className="text-gray-600">Update informasi seputar kegiatan IPNU-IPPNU</p>
            </div>
            <Link href="/berita" className="inline-flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all">
              Lihat Semua Berita
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {beritas.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Belum ada berita terbaru.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {beritas.map((b: any, i: number) => {
                const fotoUrl = getStorageUrl('berita', b.foto)
                return (
                  <Link key={b.id} href={`/berita/${b.slug}`} className="group block">
                    <div className={`aspect-video rounded-2xl overflow-hidden bg-gradient-to-br ${gradients[i % 3]} mb-4 relative`}>
                      {fotoUrl && <Image src={fotoUrl} alt={b.judul} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />}
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">{b.kategori}</span>
                      <span className="text-gray-400 text-xs">{new Date(b.tanggal_publish).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors leading-snug">{b.judul}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{b.ringkasan?.replace(/<[^>]*>/g, '') || ''}</p>
                    <span className="text-green-600 text-sm font-semibold inline-flex items-center gap-1">
                      Baca selengkapnya
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
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
