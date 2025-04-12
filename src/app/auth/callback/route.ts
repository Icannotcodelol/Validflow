import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/supabase'

export async function GET(request: Request) {
  try {
    console.log('[Auth Callback] Starting callback processing')
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const redirectTo = requestUrl.searchParams.get('redirectTo') || '/validate'

    console.log('[Auth Callback] Code present:', !!code)
    console.log('[Auth Callback] Redirecting to:', redirectTo)

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
      
      console.log('[Auth Callback] Exchanging code for session')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('[Auth Callback] Error exchanging code:', error)
        throw error
      }
      
      console.log('[Auth Callback] Session exchange successful:', !!data.session)
    }

    // URL to redirect to after sign in process completes
    const redirectUrl = new URL(redirectTo, requestUrl.origin)
    console.log('[Auth Callback] Final redirect URL:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('[Auth Callback] Error in callback:', error)
    return NextResponse.redirect(new URL('/signin', request.url))
  }
} 