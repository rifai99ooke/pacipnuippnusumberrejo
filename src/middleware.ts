import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PATH = '/n7pQzR4mK9wX2vL8'
const LOGIN_PATH = '/xk9m2-secure-panel'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Proteksi semua route admin tersembunyi
  if (pathname.startsWith(ADMIN_PATH)) {
    const session = req.cookies.get('admin_session')?.value

    if (!session) {
      const loginUrl = new URL(LOGIN_PATH, req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const decoded = Buffer.from(session, 'base64').toString('utf-8')
      const secret  = process.env.ADMIN_SESSION_SECRET || 'default-secret'
      const parts   = decoded.split(':')

      if (parts.length < 3 || !decoded.endsWith(`:${secret}`)) {
        const loginUrl = new URL(LOGIN_PATH, req.url)
        return NextResponse.redirect(loginUrl)
      }
    } catch {
      const loginUrl = new URL(LOGIN_PATH, req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Blokir akses /admin lama — redirect ke 404
  if (pathname.startsWith('/admin')) {
    return NextResponse.rewrite(new URL('/not-found', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/n7pQzR4mK9wX2vL8/:path*'],
}
