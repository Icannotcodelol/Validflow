import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'
import { checkSupabaseEnv } from './supabase/env-check'

export const createClient = () => {
  checkSupabaseEnv()
  return createServerComponentClient<Database>({ cookies })
}

export const getSession = async () => {
  const supabase = createClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export const getUserDetails = async () => {
  const supabase = createClient()
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

const supabase = createClient()

export default supabase 