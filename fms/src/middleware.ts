import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole } from '@/types'

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('fms-authenticated')
  const roleCookie = request.cookies.get('fms-role')
  const { pathname } = request.nextUrl

  // Basic check for auth state in cookie
  const isAuthenticated = authCookie?.value === 'true'
  const userRole = roleCookie?.value || null

  // Allow next static files, images, etc.
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api') // allow api if any
  ) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated && !pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to dashboard if authenticated and trying to access login or root
  if (isAuthenticated && (pathname === '/login' || pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Role-based route guards
  if (isAuthenticated) {
    if (pathname.startsWith('/users') || pathname.startsWith('/organization')) {
      if (userRole !== UserRole.SUPER_ADMIN) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
