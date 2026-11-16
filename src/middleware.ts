import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Proteksi semua route /admin kecuali API
  if (pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    const session = req.cookies.get('admin_session')?.value

    if (!session) {
      // Redirect ke halaman login tersembunyi
      const loginUrl = new URL('/xk9m2-secure-panel', req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Validasi token sederhana (cek format base64)
    try {
      const decoded = Buffer.from(session, 'base64').toString('utf-8')
      const parts   = decoded.split(':')
      const secret  = process.env.ADMIN_SESSION_SECRET || 'default-secret'

      if (parts.length < 3 || !decoded.endsWith(`:${secret}`)) {
        const loginUrl = new URL('/xk9m2-secure-panel', req.url)
        return NextResponse.redirect(loginUrl)
      }
    } catch {
      const loginUrl = new URL('/xk9m2-secure-panel', req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
