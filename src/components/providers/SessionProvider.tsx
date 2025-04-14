"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import type { Database } from '@/types/supabase'
import { checkSupabaseEnv } from '@/lib/supabase/env-check'
import { supabaseConfig } from '@/lib/supabase/config'

const SupabaseContext = createContext<ReturnType<typeof createClientComponentClient<Database>> | null>(null)

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
  const [error, setError] = useState<Error | null>(null)
  const refreshAttempts = useRef(0)
  const refreshTimeout = useRef<NodeJS.Timeout>()
  const isRefreshing = useRef(false)
  
  // Create a single instance of the client
  const [supabase] = useState(() => {
    try {
      checkSupabaseEnv()
      return createClientComponentClient<Database>()
    } catch (e) {
      setError(e as Error)
      return null
    }
  })

  const router = useRouter()

  // Exponential backoff for token refresh
  const getBackoffDuration = useCallback(() => {
    const base = 2000 // Base delay of 2 seconds
    const maxDelay = 32000 // Max delay of 32 seconds
    const jitter = Math.random() * 1000 // Random jitter up to 1 second
    return Math.min(base * Math.pow(2, refreshAttempts.current) + jitter, maxDelay)
  }, [])

  // Debounced token refresh function
  const refreshSession = useCallback(async () => {
    if (!supabase || isRefreshing.current) return

    try {
      isRefreshing.current = true
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.warn('Session refresh failed:', error.message)
        refreshAttempts.current += 1
        
        // Schedule another attempt with exponential backoff
        if (refreshTimeout.current) {
          clearTimeout(refreshTimeout.current)
        }
        
        refreshTimeout.current = setTimeout(() => {
          isRefreshing.current = false
          refreshSession()
        }, getBackoffDuration())
        
        return
      }

      // Success - reset attempts and refresh the page
      refreshAttempts.current = 0
      isRefreshing.current = false
      if (data.session) {
        router.refresh()
      }
    } catch (e) {
      console.error('Unexpected error during session refresh:', e)
      isRefreshing.current = false
    }
  }, [supabase, router, getBackoffDuration])

  useEffect(() => {
    if (!supabase) return

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        // Token was refreshed successfully
        refreshAttempts.current = 0
        router.refresh()
      } else if (event === 'SIGNED_OUT') {
        // Clear any pending refresh attempts
        if (refreshTimeout.current) {
          clearTimeout(refreshTimeout.current)
        }
        refreshAttempts.current = 0
        router.refresh()
      } else if (!session) {
        // No session - attempt refresh
        await refreshSession()
      }
    })

    // Cleanup
    return () => {
      subscription?.unsubscribe()
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current)
      }
    }
  }, [supabase, router, refreshSession])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-4">
          <h3 className="text-sm font-medium text-red-800">Configuration Error</h3>
          <div className="mt-2 text-sm text-red-700">
            {error.message}
          </div>
        </div>
      </div>
    )
  }

  if (!supabase) {
    return null
  }

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
} 