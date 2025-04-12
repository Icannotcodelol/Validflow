export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      analyses: {
        Row: {
          id: string
          user_id: string
          status: string
          sections: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status: string
          sections: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          sections?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_credits: {
        Row: {
          user_id: string
          credits_balance: number
          has_unlimited: boolean
          unlimited_until: string | null
          subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          credits_balance?: number
          has_unlimited?: boolean
          unlimited_until?: string | null
          subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          credits_balance?: number
          has_unlimited?: boolean
          unlimited_until?: string | null
          subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_credits: {
        Args: {
          p_user_id: string
          p_credits: number
        }
        Returns: void
      }
      update_subscription: {
        Args: {
          p_user_id: string
          p_subscription_id: string
          p_current_period_end: string
        }
        Returns: void
      }
      remove_unlimited_access: {
        Args: {
          p_user_id: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
} 