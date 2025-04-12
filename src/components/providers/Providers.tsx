'use client'

import SupabaseProvider from "./SessionProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      {children}
    </SupabaseProvider>
  )
} 