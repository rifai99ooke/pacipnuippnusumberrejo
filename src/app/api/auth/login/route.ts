import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    const adminEmail    = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    const secret        = process.env.ADMIN_SESSION_SECRET || 'default-secret'

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ pesan: 'Konfigurasi server tidak lengkap.' }, { status: 500 })
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ pesan: 'Email atau kata sandi salah.' }, { status: 401 })
    }

    // Buat session token sederhana
    const payload = `${email}:${Date.now()}:${secret}`
    const token   = Buffer.from(payload).toString('base64')

    const res = NextResponse.json({ pesan: 'Login berhasil.' }, { status: 200 })

    res.cookies.set('admin_session', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 8, // 8 jam
      path:     '/',
    })

    return res
  } catch {
    return NextResponse.json({ pesan: 'Terjadi kesalahan.' }, { status: 500 })
  }
}
