import KirimPesanForm from '@/components/KirimPesanForm'

export const metadata = { title: 'Hubungi Kami' }

export default function HubungiKamiPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Hubungi Kami</h1>
          <p className="text-green-100 text-lg">Kami siap menjawab pertanyaan dan melayani Anda</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form Kirim Pesan */}
            <KirimPesanForm />

            {/* Info Kontak */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Informasi Kontak</h2>

              {[
                {
                  icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
                  title: 'Alamat',
                  lines: ['Jl. Raya PUK No.99, Cepit, Sumberrejo', 'Kec. Sumberejo, Kabupaten Bojonegoro', 'Jawa Timur 62191'],
                },
                {
                  icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
                  title: 'Telepon',
                  lines: ['082245168169'],
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                    {item.lines.map((l) => (
                      <p key={l} className="text-gray-600 text-sm">{l}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Email */}
              <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                  <a
                    href="mailto:pelajarnusumberrejo01@gmail.com"
                    className="text-green-600 hover:text-green-700 text-sm font-medium transition break-all"
                  >
                    pelajarnusumberrejo01@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Peta Lokasi */}
      <section className="pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Peta Lokasi</h2>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11612.028011136841!2d111.98653575837805!3d-7.170997340395784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7787f719dafa6b%3A0x70a2e1bdd0a7c67e!2sKantor%20MWCNU%20Sumberrejo!5e0!3m2!1sid!2sid!4v1794466373222!5m2!1sid!2sid"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </section>
    </>
  )
}
