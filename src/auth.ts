import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export async function auth() {
  const supabase = createServerComponentClient<Database>({ cookies })
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

export async function signIn() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { url } } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
    }
  })
  return url
}

export async function signOut() {
  const supabase = createServerComponentClient<Database>({ cookies })
  await supabase.auth.signOut()
} 