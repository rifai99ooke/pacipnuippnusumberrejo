import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ pesan: 'Logout berhasil.' }, { status: 200 })
  res.cookies.set('admin_session', '', { maxAge: 0, path: '/' })
  return res
}
