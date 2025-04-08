import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'
import { cache } from 'react'

export const createClient = () => {
  return createServerComponentClient<Database>({
    cookies,
  })
} 