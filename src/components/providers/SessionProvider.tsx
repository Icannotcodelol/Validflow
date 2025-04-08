"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
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

  useEffect(() => {
    if (!supabase) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      router.refresh()
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase, router])

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