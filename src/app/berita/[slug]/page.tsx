import Link from 'next/link'
import { supabase, getStorageUrl } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 60
export const dynamic = 'force-dynamic'

const BASE_URL = 'https://pacipnuippnusumberrejo.my.id'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data: b } = await supabase.from('berita').select('*').eq('slug', slug).single()
  if (!b) return {}

  const fotoUrl = b.foto ? getStorageUrl('berita', b.foto) : null
  const ringkasan = b.ringkasan?.replace(/<[^>]*>/g, '').slice(0, 160) || b.judul

  return {
    title:       b.judul,
    description: ringkasan,
    openGraph: {
      type:        'article',
      title:       b.judul,
      description: ringkasan,
      url:         `${BASE_URL}/berita/${slug}`,
      images:      fotoUrl ? [{ url: fotoUrl, width: 1200, height: 630, alt: b.judul }] : [{ url: `${BASE_URL}/opengraph-image` }],
      publishedTime: b.tanggal_publish,
    },
    twitter: {
      card:        'summary_large_image',
      title:       b.judul,
      description: ringkasan,
      images:      fotoUrl ? [fotoUrl] : [`${BASE_URL}/opengraph-image`],
    },
  }
}

const gradients = ['from-green-300 to-green-500', 'from-blue-300 to-blue-500', 'from-yellow-300 to-yellow-500', 'from-purple-300 to-purple-500']

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: b } = await supabase.from('berita').select('*').eq('slug', slug).single()
  if (!b) notFound()

  const fotoUrl = getStorageUrl('berita', b.foto)
  const gradient = gradients[b.id % gradients.length]
  const tgl = new Date(b.tanggal_publish).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <section className="py-10 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-green-600">Beranda</Link>
          <span>/</span>
          <Link href="/berita" className="hover:text-green-600">Berita</Link>
          <span>/</span>
          <span className="text-gray-600 truncate">{b.judul}</span>
        </nav>

        {/* Kategori & Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">{b.kategori}</span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {tgl}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Redaksi
          </div>
        </div>

        {/* Judul */}
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6">{b.judul}</h1>

        {/* Foto */}
        <div className={`aspect-video rounded-2xl overflow-hidden bg-gradient-to-br ${gradient} mb-8 shadow relative`}>
          {fotoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fotoUrl} alt={b.judul} className="w-full h-full object-cover" />
          )}
        </div>

        {/* Isi — render HTML dari rich text editor */}
        <div
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed
            prose-headings:text-gray-900 prose-headings:font-bold
            prose-p:mb-4 prose-p:leading-relaxed
            prose-strong:text-gray-900
            prose-ul:my-3 prose-li:my-1
            prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: b.isi }}
        />
        {/* Back */}
        <div className="mt-12 pt-6 border-t border-gray-100">
          <Link href="/berita" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Berita
          </Link>
        </div>
      </div>
    </section>
  )
}
