import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'
import { checkSupabaseEnv } from './env-check'

// This function creates a new Supabase client for component use
export function createClient() {
  checkSupabaseEnv()
  return createClientComponentClient<Database>()
}

// Export a singleton instance for use in components that don't need their own instance
export const supabase = createClient() 