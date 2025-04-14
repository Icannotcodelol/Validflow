import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

// List of public routes that don't require authentication
const publicRoutes = ['/', '/signin', '/signup', '/auth/callback', '/pricing', '/about', '/features']

// List of paths that should skip auth check completely
const skipAuthPaths = [
  '/_next',
  '/static',
  '/api',
  '/images',
  '/favicon.ico',
  '/manifest.json',
  '/robots.txt',
  '/apple-touch-icon.png',
  '/apple-touch-icon-precomposed.png'
]

export async function middleware(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname
    
    // Skip auth check for static resources and API routes
    if (path.startsWith('/_next') || 
        path.startsWith('/api') || 
        path.startsWith('/static') || 
        path.startsWith('/images') ||
        path === '/favicon.ico' ||
        path === '/manifest.json' ||
        path === '/robots.txt' ||
        path.match(/\.(ico|png|jpg|jpeg|gif|svg|js|css|woff|woff2|ttf|eot)$/)) {
      return NextResponse.next()
    }

    console.log(`[Middleware] 🚀 Processing request for path: ${path}`)
    
    // Create a response early
    const res = NextResponse.next()

    // Create the Supabase client
    const supabase = createMiddlewareClient<Database>({ req, res })

    // Get the session with rate limit error handling
    console.log(`[Middleware] 🔐 Checking auth session for: ${path}`)
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      if (error.status === 429) {
        console.warn(`[Middleware] ⚠️ Rate limit reached for path: ${path}`)
        console.warn(`[Middleware] Allowing request to proceed despite rate limit`)
        return res
      }
      
      console.error(`[Middleware] ❌ Auth error for ${path}:`, error)
      return res
    }

    const isPublicRoute = publicRoutes.includes(path)

    console.log(`[Middleware] ℹ️ Path: ${path}`)
    console.log(`[Middleware] ℹ️ Session: ${session ? 'Active' : 'None'}`)
    console.log(`[Middleware] ℹ️ Public Route: ${isPublicRoute}`)

    // If the route is not public and there's no session, redirect to signin
    if (!isPublicRoute && !session) {
      console.log(`[Middleware] 🔄 Redirecting to signin from: ${path}`)
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/signin'
      redirectUrl.searchParams.set('redirectTo', path)
      return NextResponse.redirect(redirectUrl)
    }

    // If we have a session and we're on an auth page, redirect to home
    if (session && (path === '/signin' || path === '/signup')) {
      console.log(`[Middleware] 🏠 Redirecting authenticated user to home`)
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/'
      return NextResponse.redirect(redirectUrl)
    }

    // Add security headers with broader Supabase access
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://*.stripe.com https://*.stripe.network;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https://*.stripe.com https://*.supabase.co;
      frame-src 'self' https://*.stripe.com https://*.stripe.network https://*.supabase.co;
      connect-src 'self' 
        https://*.supabase.co 
        wss://*.supabase.co 
        https://api.stripe.com 
        https://*.stripe.com 
        https://*.stripe.network 
        wss://*.stripe.com;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim()

    res.headers.set('Content-Security-Policy', cspHeader)

    return res
  } catch (error) {
    console.error('[Middleware] ❌ Unexpected error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js internals and static files
     */
    '/((?!_next|static|favicon.ico|manifest.json|robots.txt).*)'
  ]
} 