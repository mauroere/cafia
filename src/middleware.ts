import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isVendorRoute = req.nextUrl.pathname.startsWith('/vendor')

    if (isVendorRoute && token?.role !== 'VENDOR') {
      return NextResponse.redirect(new URL('/auth/vendor/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    '/vendor/:path*',
  ]
} 