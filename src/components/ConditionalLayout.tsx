'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin  = pathname.startsWith('/n7pQzR4mK9wX2vL8')
  const isLogin  = pathname.startsWith('/xk9m2-secure-panel')

  if (isAdmin || isLogin) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
