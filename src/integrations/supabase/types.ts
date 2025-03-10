export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bonus_generations: {
        Row: {
          count: number | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          count?: number | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string
          referrer_id: string
          successful_referrals: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_code: string
          referrer_id: string
          successful_referrals?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string
          referrer_id?: string
          successful_referrals?: number | null
        }
        Relationships: []
      }
      referred_users: {
        Row: {
          created_at: string | null
          id: string
          referred_user_id: string
          referrer_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          referred_user_id: string
          referrer_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          referred_user_id?: string
          referrer_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          browser: string | null
          created_at: string | null
          form_data: Json | null
          generated_letter: string | null
          generation_type: string | null
          id: string
          ip: string | null
          language: string | null
          location: string | null
          operating_system: string | null
          referral_code: string | null
          screen_resolution: string | null
          time_zone: string | null
          user_agent: string | null
        }
        Insert: {
          browser?: string | null
          created_at?: string | null
          form_data?: Json | null
          generated_letter?: string | null
          generation_type?: string | null
          id?: string
          ip?: string | null
          language?: string | null
          location?: string | null
          operating_system?: string | null
          referral_code?: string | null
          screen_resolution?: string | null
          time_zone?: string | null
          user_agent?: string | null
        }
        Update: {
          browser?: string | null
          created_at?: string | null
          form_data?: Json | null
          generated_letter?: string | null
          generation_type?: string | null
          id?: string
          ip?: string | null
          language?: string | null
          location?: string | null
          operating_system?: string | null
          referral_code?: string | null
          screen_resolution?: string | null
          time_zone?: string | null
          user_agent?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
