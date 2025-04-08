// Ensure environment variables are properly typed and available
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL.trim(),
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim()
} 