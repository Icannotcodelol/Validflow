export function checkSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables. Check .env.local file.'
    )
  }

  // Clean and validate URL format
  const cleanUrl = url.trim()
  if (!cleanUrl.startsWith('https://') || !cleanUrl.endsWith('.supabase.co')) {
    throw new Error(
      'Invalid NEXT_PUBLIC_SUPABASE_URL format. Must be a Supabase project URL (https://*.supabase.co)'
    )
  }

  // Validate key format (basic check)
  const cleanKey = key.trim()
  if (!cleanKey.includes('.')) {
    throw new Error(
      'Invalid NEXT_PUBLIC_SUPABASE_ANON_KEY format. Should be a JWT token.'
    )
  }

  return {
    url: cleanUrl,
    key: cleanKey,
  }
} 