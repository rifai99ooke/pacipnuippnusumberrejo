'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label: 'BERANDA', href: '/' },
  {
    label: 'PROFIL',
    href: '/profil',
    children: [
      { label: 'Visi Misi', href: '/profil/visi-misi' },
      { label: 'Struktur Kepengurusan', href: '/profil/struktur' },
      { label: 'Estafet Kepemimpinan', href: '/profil/estafet' },
      { label: 'Pimpinan Ranting', href: '/profil/pimpinan-ranting' },
      { label: 'Pimpinan Komisariat', href: '/profil/pimpinan-komisariat' },
    ],
  },
  {
    label: 'KEGIATAN',
    href: '/kegiatan',
    children: [
      { label: 'Program Kerja', href: '/kegiatan/program-kerja' },
      { label: 'Agenda', href: '/kegiatan/agenda' },
      { label: 'Dokumentasi', href: '/kegiatan/dokumentasi' },
    ],
  },
  { label: 'BERITA', href: '/berita' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setMounted(true) }, [])

  const closeMobile = () => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }

  return (
    <>
      <nav className="bg-white shadow-md fixed w-full top-0 z-50" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/Logo.png" alt="Logo IPNU IPPNU" width={56} height={56} className="object-contain" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">IPNU <span className="text-green-600">IPPNU</span></h1>
                <p className="text-xs text-gray-600">PAC SUMBERREJO</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className={`flex items-center gap-1 font-medium transition text-sm ${pathname.startsWith(link.href) ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}>
                      {link.label}
                      <svg className={`w-4 h-4 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openDropdown === link.label && (
                      <div className="absolute left-0 top-full w-56 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
                        <div className="pt-2">
                          {link.children.map((child) => (
                            <Link key={child.href} href={child.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition">
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link key={link.href} href={link.href} className={`font-medium text-sm transition ${pathname === link.href ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}>
                    {link.label}
                  </Link>
                )
              )}
              <Link href="/hubungi-kami" className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition font-medium text-sm shadow-md">
                HUBUNGI KAMI
              </Link>
            </div>

            {/* Hamburger Button */}
            <button
              className="lg:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {mounted && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar Kanan */}
      {mounted && (
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
        {/* Header Sidebar */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <Link href="/" onClick={closeMobile} className="flex items-center space-x-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/Logo.png" alt="Logo" width={40} height={40} className="object-contain" />
            <div>
              <p className="font-bold text-gray-900 text-sm">IPNU <span className="text-green-600">IPPNU</span></p>
              <p className="text-xs text-gray-500">PAC SUMBERREJO</p>
            </div>
          </Link>
          <button
            onClick={closeMobile}
            className="text-gray-500 hover:text-gray-800 p-1 rounded-lg hover:bg-gray-100 transition"
            aria-label="Tutup menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <button
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition ${
                    pathname.startsWith(link.href)
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                >
                  {link.label}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Sub Menu */}
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openDropdown === link.label ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pl-3 pb-1 space-y-0.5">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={closeMobile}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition ${
                          pathname === child.href
                            ? 'text-green-600 bg-green-50 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className={`flex items-center px-4 py-3 rounded-xl font-semibold text-sm transition ${
                  pathname === link.href
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Tombol Hubungi Kami */}
        <div className="px-4 py-5 border-t border-gray-100">
          <Link
            href="/hubungi-kami"
            onClick={closeMobile}
            className="block w-full bg-green-600 text-white text-center py-3 rounded-xl font-semibold text-sm hover:bg-green-700 transition shadow-md"
          >
            Hubungi Kami
          </Link>
        </div>
      </div>
      )}
    </>
  )
}
