import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'
import { checkSupabaseEnv } from './env-check'

// This function creates a new Supabase client for component use
export function createClient() {
  checkSupabaseEnv()
  return createClientComponentClient<Database>({
    cookieOptions: {
      name: 'sb-auth',
      domain: process.env.NEXT_PUBLIC_BASE_URL ? new URL(process.env.NEXT_PUBLIC_BASE_URL).hostname : 'localhost',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    }
  })
}

// Export a singleton instance for use in components that don't need their own instance
export const supabase = createClient() 