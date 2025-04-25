import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    console.log('[Auth Callback] Starting callback processing')
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const redirectTo = requestUrl.searchParams.get('redirectTo') || '/'
    const error = requestUrl.searchParams.get('error')

    if (error) {
      console.error('[Auth Callback] Error in callback:', error)
      return NextResponse.redirect(new URL(`/auth/error?error=${encodeURIComponent(error)}`, requestUrl.origin))
    }

    console.log('[Auth Callback] Code present:', !!code)
    console.log('[Auth Callback] Redirecting to:', redirectTo)

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
      
      console.log('[Auth Callback] Exchanging code for session')
      const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        console.error('[Auth Callback] Error exchanging code:', sessionError)
        return NextResponse.redirect(new URL(`/auth/error?error=${encodeURIComponent(sessionError.message)}`, requestUrl.origin))
      }
      
      if (!data.session) {
        console.error('[Auth Callback] No session after exchange')
        return NextResponse.redirect(new URL('/auth/error?error=no_session', requestUrl.origin))
      }
      
      console.log('[Auth Callback] Session exchange successful:', !!data.session)
    }

    // URL to redirect to after sign in process completes
    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://validflow.io' : requestUrl.origin
    const redirectUrl = new URL(redirectTo, baseUrl)
    
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('[Auth Callback] Unexpected error:', error)
    return NextResponse.redirect(new URL('/auth/error?error=unexpected', request.url))
  }
} 