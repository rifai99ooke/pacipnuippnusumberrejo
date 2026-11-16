import type { Metadata } from 'next'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'

export const metadata: Metadata = {
  title: { default: 'PAC IPNU IPPNU Sumberrejo', template: '%s - PAC IPNU IPPNU Sumberrejo' },
  description: 'Website resmi PAC IPNU IPPNU Sumberrejo',
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
