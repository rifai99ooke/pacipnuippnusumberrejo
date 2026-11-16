import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const runtime     = 'nodejs'
export const alt         = 'PAC IPNU IPPNU Sumberrejo'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  // Baca logo dari public/images/Logo.png sebagai base64
  const logoPath = join(process.cwd(), 'public', 'images', 'Logo.png')
  const logoData = readFileSync(logoPath)
  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width:          '100%',
          height:         '100%',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          background:     'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
          fontFamily:     'sans-serif',
        }}
      >
        {/* Card putih transparan */}
        <div
          style={{
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            background:     'rgba(255,255,255,0.12)',
            borderRadius:   32,
            padding:        '50px 80px',
            border:         '1px solid rgba(255,255,255,0.25)',
          }}
        >
          {/* Logo IPNU IPPNU */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoBase64}
            width={130}
            height={130}
            style={{ marginBottom: 28, objectFit: 'contain' }}
            alt="Logo"
          />

          {/* Judul */}
          <div
            style={{
              fontSize:     60,
              fontWeight:   900,
              color:        'white',
              marginBottom: 10,
              textAlign:    'center',
              letterSpacing: '-1px',
            }}
          >
            PAC IPNU IPPNU
          </div>

          <div
            style={{
              fontSize:     46,
              fontWeight:   700,
              color:        'white',
              marginBottom: 18,
            }}
          >
            Sumberrejo
          </div>

          <div
            style={{
              fontSize:  22,
              color:     'rgba(255,255,255,0.8)',
              textAlign: 'center',
            }}
          >
            Kabupaten Bojonegoro, Jawa Timur
          </div>

          <div
            style={{
              fontSize:  18,
              color:     'rgba(255,255,255,0.55)',
              marginTop: 10,
            }}
          >
            pacipnuippnusumberrejo.my.id
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
