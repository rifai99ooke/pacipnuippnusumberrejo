import Link from 'next/link'

export default function Footer() {
  const socials = [
    {
      href:  'https://www.instagram.com/pelajarnusumberrejo',
      label: 'Instagram',
      icon:  (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ),
    },
    {
      href:  'https://www.facebook.com/share/1E1ZBv72US/',
      label: 'Facebook',
      icon:  (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
        </svg>
      ),
    },
    {
      href:  'https://www.tiktok.com/@pelajar_nu_sumberrejo',
      label: 'TikTok',
      icon:  (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.52V6.76a4.85 4.85 0 01-1.02-.07z"/>
        </svg>
      ),
    },
  ]

  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Kolom 1 — Logo + deskripsi + sosial */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/Logo.png" alt="Logo" width={48} height={48} className="object-contain" />
              <div>
                <h3 className="text-lg font-bold">IPNU IPPNU</h3>
                <p className="text-sm text-gray-400">PAC Sumberrejo</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-5">Wadah perjuangan pelajar, santri, dan mahasiswa Nahdlatul Ulama untuk mengembangkan potensi diri.</p>

            {/* Ikon sosial media */}
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Kolom 2 — Link Cepat */}
          <div>
            <h3 className="text-lg font-bold mb-4">Link Cepat</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              {[
                ['/', 'Beranda'],
                ['/profil/visi-misi', 'Visi Misi'],
                ['/kegiatan/program-kerja', 'Kegiatan'],
                ['/berita', 'Berita'],
                ['/hubungi-kami', 'Hubungi Kami'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-green-400 transition">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3 — Kontak */}
          <div>
            <h3 className="text-lg font-bold mb-4">Kontak</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              {/* Alamat */}
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Jl. Raya PUK No.99, Cepit, Sumberrejo, Kec. Sumberejo, Kabupaten Bojonegoro, Jawa Timur 62191</span>
              </li>

              {/* Telepon */}
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:082245168169" className="hover:text-green-400 transition">082245168169</a>
              </li>

              {/* Email */}
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:pelajarnusumberrejo01@gmail.com" className="hover:text-green-400 transition break-all">
                  pelajarnusumberrejo01@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} PAC IPNU IPPNU Sumberrejo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
