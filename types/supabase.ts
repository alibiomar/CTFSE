export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface AppDatabase {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string
          phone_number: string | null
          facebook_url: string | null
          university: string | null
          ctf_experience: boolean
          team_preference: "solo" | "team"
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email: string
          phone_number?: string | null
          facebook_url?: string | null
          university?: string | null
          ctf_experience?: boolean
          team_preference?: "solo" | "team"
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string
          phone_number?: string | null
          facebook_url?: string | null
          university?: string | null
          ctf_experience?: boolean
          team_preference?: "solo" | "team"
          is_admin?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}