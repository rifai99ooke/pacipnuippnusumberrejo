import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt     = 'PAC IPNU IPPNU Sumberrejo'
export const size    = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
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
            background:     'rgba(255,255,255,0.1)',
            borderRadius:   32,
            padding:        '60px 80px',
            border:         '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {/* Lingkaran logo */}
          <div
            style={{
              width:          120,
              height:         120,
              borderRadius:   '50%',
              background:     'rgba(255,255,255,0.2)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              marginBottom:   32,
              fontSize:       52,
              fontWeight:     900,
              color:          'white',
            }}
          >
            NU
          </div>

          {/* Judul */}
          <div
            style={{
              fontSize:    64,
              fontWeight:  900,
              color:       'white',
              marginBottom: 12,
              textAlign:   'center',
              letterSpacing: '-1px',
            }}
          >
            PAC IPNU IPPNU
          </div>

          <div
            style={{
              fontSize:    48,
              fontWeight:  700,
              color:       'white',
              marginBottom: 20,
            }}
          >
            Sumberrejo
          </div>

          {/* Deskripsi */}
          <div
            style={{
              fontSize:    24,
              color:       'rgba(255,255,255,0.8)',
              textAlign:   'center',
              marginBottom: 16,
            }}
          >
            Kabupaten Bojonegoro, Jawa Timur
          </div>

          {/* URL */}
          <div
            style={{
              fontSize:   20,
              color:      'rgba(255,255,255,0.6)',
              marginTop:  8,
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
