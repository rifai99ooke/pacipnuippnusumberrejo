import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE_URL = 'https://pacipnuippnusumberrejo.my.id'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Halaman statis
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                                   lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/profil/visi-misi`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/profil/struktur`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/profil/estafet`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/profil/pimpinan-ranting`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/profil/pimpinan-komisariat`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/kegiatan/program-kerja`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/kegiatan/agenda`,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/kegiatan/dokumentasi`,         lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/berita`,                       lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/hubungi-kami`,                 lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.6 },
  ]

  // Halaman berita dinamis
  try {
    const { data: beritas } = await supabase
      .from('berita')
      .select('slug, tanggal_publish')
      .eq('published', true)
      .order('tanggal_publish', { ascending: false })
      .limit(100)

    const beritaPages: MetadataRoute.Sitemap = (beritas || []).map((b: any) => ({
      url:              `${BASE_URL}/berita/${b.slug}`,
      lastModified:     new Date(b.tanggal_publish),
      changeFrequency:  'monthly' as const,
      priority:         0.7,
    }))

    return [...staticPages, ...beritaPages]
  } catch {
    return staticPages
  }
}
