import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'
import { checkSupabaseEnv } from '@/lib/supabase/env-check'
import { supabaseConfig } from '@/lib/supabase/config'

export async function middleware(req: NextRequest) {
  try {
    // Verify environment variables
    checkSupabaseEnv()

    // Create a response early
    const res = NextResponse.next()

    // Create the Supabase client with verified config
    const supabase = createMiddlewareClient<Database>({ req, res })

    // Refresh session if it exists
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Auth session error:', error)
    }

    // Add security headers
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https://*.stripe.com;
      frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
      connect-src 'self' https://api.stripe.com https://m.stripe.network;
      font-src 'self';
    `.replace(/\s{2,}/g, ' ').trim();

    res.headers.set('Content-Security-Policy', cspHeader);

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // Always return a response, even if there's an error
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