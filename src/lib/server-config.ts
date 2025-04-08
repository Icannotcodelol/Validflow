import { createClient } from './auth'

// Initialize Supabase client
const supabase = createClient()

export async function initializeServer() {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('user_credits').select('count')
    if (error) throw error
    
    console.log('Supabase initialized successfully')
  } catch (error) {
    console.error('Failed to initialize Supabase:', error)
    throw error
  }
} 