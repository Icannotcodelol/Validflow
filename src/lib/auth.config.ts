import { createClient } from './auth'
import { User } from '@supabase/supabase-js'

interface Session {
  user?: {
    id: string;
    [key: string]: any;
  };
}

const supabase = createClient()

export const authConfig = {
  providers: ['google'],
  callbacks: {
    async signIn({ user }: { user: User | null }) {
      if (!user) return false
      return true
    },
    async session({ session, user }: { session: Session | null; user: User }) {
      if (session?.user) {
        session.user.id = user.id
      }
      return session
    }
  },
  pages: {
    signIn: '/signin'
  }
} 