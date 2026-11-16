import type { Metadata } from 'next'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'

const BASE_URL = 'https://pacipnuippnusumberrejo.my.id'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:  'PAC IPNU IPPNU Sumberrejo',
    template: '%s - PAC IPNU IPPNU Sumberrejo',
  },
  description: 'Website resmi Pimpinan Anak Cabang IPNU IPPNU Sumberrejo, Kabupaten Bojonegoro. Wadah pelajar, santri, dan mahasiswa Nahdlatul Ulama.',
  keywords: ['IPNU', 'IPPNU', 'Sumberrejo', 'Bojonegoro', 'PAC IPNU IPPNU', 'Nahdlatul Ulama', 'pelajar NU'],
  authors: [{ name: 'PAC IPNU IPPNU Sumberrejo' }],
  creator: 'PAC IPNU IPPNU Sumberrejo',
  publisher: 'PAC IPNU IPPNU Sumberrejo',

  // Open Graph — tampil saat dishare di WhatsApp, Facebook, dll
  openGraph: {
    type:        'website',
    locale:      'id_ID',
    url:         BASE_URL,
    siteName:    'PAC IPNU IPPNU Sumberrejo',
    title:       'PAC IPNU IPPNU Sumberrejo',
    description: 'Website resmi Pimpinan Anak Cabang IPNU IPPNU Sumberrejo, Kabupaten Bojonegoro. Wadah pelajar, santri, dan mahasiswa Nahdlatul Ulama.',
    images: [
      {
        url:    `${BASE_URL}/opengraph-image`,
        width:  1200,
        height: 630,
        alt:    'PAC IPNU IPPNU Sumberrejo',
      },
    ],
  },

  // Twitter/X Card
  twitter: {
    card:        'summary_large_image',
    title:       'PAC IPNU IPPNU Sumberrejo',
    description: 'Website resmi PAC IPNU IPPNU Sumberrejo, Kabupaten Bojonegoro.',
    images:      [`${BASE_URL}/opengraph-image`],
  },

  // Robots
  robots: {
    index:               true,
    follow:              true,
    googleBot: {
      index:             true,
      follow:            true,
      'max-image-preview': 'large',
    },
  },

  // Verifikasi Google Search Console
  verification: {
    google: 'google97260fa8c42b5fa4',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  )
}
