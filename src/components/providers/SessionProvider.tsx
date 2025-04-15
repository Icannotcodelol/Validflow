"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import type { Database } from '@/types/supabase'
import { checkSupabaseEnv } from '@/lib/supabase/env-check'

const SupabaseContext = createContext<ReturnType<typeof createClientComponentClient<Database>> | null>(null)

// Helper to detect Safari browser
const isSafari = typeof window !== 'undefined' && 
  /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabase] = useState(() => createClientComponentClient<Database>())
  const router = useRouter()
  const refreshTokenTimer = useRef<NodeJS.Timeout>()
  const isRefreshing = useRef(false)
  const lastRefreshAttempt = useRef<number>(0)

  // Function to handle session refresh
  const refreshSession = useCallback(async (force = false) => {
    // Prevent multiple rapid refresh attempts in Safari
    const now = Date.now()
    if (!force && isRefreshing.current) return
    if (!force && isSafari && (now - lastRefreshAttempt.current) < 2000) return
    
    try {
      isRefreshing.current = true
      lastRefreshAttempt.current = now
      console.log('[SessionProvider] Attempting to refresh session...')
      
      // Add cache-busting parameter for Safari
      const options = isSafari ? {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'X-Timestamp': String(Date.now())
        }
      } : undefined;
      
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('[SessionProvider] Error refreshing session:', error)
        // Clear any existing timer
        if (refreshTokenTimer.current) {
          clearTimeout(refreshTokenTimer.current)
        }
        
        // If we get a 401 or refresh token error, redirect to signin
        if (error.status === 401 || error.message.includes('refresh')) {
          console.log('[SessionProvider] Session expired, redirecting to signin...')
          await supabase.auth.signOut()
          if (isSafari) {
            // Force a clean reload for Safari
            window.location.href = '/signin'
          } else {
            router.push('/signin')
          }
          return
        }
        
        return
      }

      if (session) {
        console.log('[SessionProvider] Session refreshed successfully')
        // Schedule next refresh 5 minutes before token expiry
        const expiresIn = (new Date(session.expires_at || 0).getTime() - Date.now()) - (5 * 60 * 1000)
        if (refreshTokenTimer.current) {
          clearTimeout(refreshTokenTimer.current)
        }
        refreshTokenTimer.current = setTimeout(() => refreshSession(true), Math.max(0, expiresIn))
      }
    } catch (e) {
      console.error('[SessionProvider] Unexpected error during refresh:', e)
    } finally {
      isRefreshing.current = false
    }
  }, [supabase, router])

  useEffect(() => {
    // Initial session check with force refresh for Safari
    refreshSession(isSafari)

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[SessionProvider] Auth state changed:', event)
      
      if (event === 'SIGNED_OUT') {
        // Clear refresh timer on signout
        if (refreshTokenTimer.current) {
          clearTimeout(refreshTokenTimer.current)
        }
        if (isSafari) {
          // Force a clean reload for Safari
          window.location.reload()
        } else {
          router.refresh()
        }
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Refresh the router to update server-side auth state
        if (isSafari) {
          // Force a clean reload for Safari
          window.location.reload()
        } else {
          router.refresh()
        }
        
        // Schedule next refresh if we have a session
        if (session) {
          const expiresIn = (new Date(session.expires_at || 0).getTime() - Date.now()) - (5 * 60 * 1000)
          if (refreshTokenTimer.current) {
            clearTimeout(refreshTokenTimer.current)
          }
          refreshTokenTimer.current = setTimeout(() => refreshSession(true), Math.max(0, expiresIn))
        }
      }
    })

    // Cleanup
    return () => {
      subscription?.unsubscribe()
      if (refreshTokenTimer.current) {
        clearTimeout(refreshTokenTimer.current)
      }
    }
  }, [supabase, router, refreshSession])

  if (!supabase) {
    return null
  }

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
} 