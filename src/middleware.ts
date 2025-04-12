import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

// List of public routes that don't require authentication
const publicRoutes = ['/', '/signin', '/signup', '/auth/callback', '/pricing', '/about', '/features']

export async function middleware(req: NextRequest) {
  try {
    // Create a response early
    const res = NextResponse.next()

    // Create the Supabase client
    const supabase = createMiddlewareClient<Database>({ req, res })

    // Always refresh the session if it exists
    await supabase.auth.getSession()

    const path = req.nextUrl.pathname
    const isPublicRoute = publicRoutes.includes(path)

    // Get the session after refreshing
    const { data: { session } } = await supabase.auth.getSession()

    // If the route is not public and there's no session, redirect to signin
    if (!isPublicRoute && !session) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/signin'
      redirectUrl.searchParams.set('redirectTo', path)
      return NextResponse.redirect(redirectUrl)
    }

    // If we have a session and we're on an auth page, redirect to validate
    if (session && (path === '/signin' || path === '/signup')) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/validate'
      return NextResponse.redirect(redirectUrl)
    }

    // Add security headers
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https://*.stripe.com;
      frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
      connect-src 'self' https://api.stripe.com https://m.stripe.network wss://*.supabase.co;
      font-src 'self';
    `.replace(/\s{2,}/g, ' ').trim()

    res.headers.set('Content-Security-Policy', cspHeader)

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

// Update matcher to be more specific
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
} 