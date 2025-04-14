import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

// List of public routes that don't require authentication
const publicRoutes = ['/', '/signin', '/signup', '/auth/callback', '/pricing', '/about', '/features']

export async function middleware(req: NextRequest) {
  try {
    console.log('[Middleware] Processing request for path:', req.nextUrl.pathname)
    
    // Create a response early
    const res = NextResponse.next()

    // Create the Supabase client
    const supabase = createMiddlewareClient<Database>({ req, res })

    // Get the session
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('[Middleware] Error getting session:', error)
      // Don't redirect on error, let the application handle it
      return res
    }

    const path = req.nextUrl.pathname
    const isPublicRoute = publicRoutes.includes(path)

    console.log('[Middleware] Session status:', !!session)
    console.log('[Middleware] Is public route:', isPublicRoute)

    // If the route is not public and there's no session, redirect to signin
    if (!isPublicRoute && !session) {
      console.log('[Middleware] Redirecting to signin')
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/signin'
      redirectUrl.searchParams.set('redirectTo', path)
      return NextResponse.redirect(redirectUrl)
    }

    // If we have a session and we're on an auth page, redirect to home
    if (session && (path === '/signin' || path === '/signup')) {
      console.log('[Middleware] Redirecting authenticated user to home')
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/'
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
    console.error('[Middleware] Error:', error)
    // On error, let the request continue
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