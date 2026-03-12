export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          details: Json | null
          id: string
          target_user_id: string | null
          target_website_id: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
          target_website_id?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
          target_website_id?: string | null
        }
        Relationships: []
      }
      analytics_summary: {
        Row: {
          active_subscriptions: number
          churned_subscriptions: number
          created_at: string
          date: string
          id: string
          new_sites: number
          new_users: number
          total_revenue: number
          total_sites: number
          total_users: number
        }
        Insert: {
          active_subscriptions?: number
          churned_subscriptions?: number
          created_at?: string
          date: string
          id?: string
          new_sites?: number
          new_users?: number
          total_revenue?: number
          total_sites?: number
          total_users?: number
        }
        Update: {
          active_subscriptions?: number
          churned_subscriptions?: number
          created_at?: string
          date?: string
          id?: string
          new_sites?: number
          new_users?: number
          total_revenue?: number
          total_sites?: number
          total_users?: number
        }
        Relationships: []
      }
      domains: {
        Row: {
          created_at: string
          domain: string
          id: string
          is_verified: boolean
          ssl_enabled: boolean
          updated_at: string
          user_id: string
          verification_token: string | null
          website_id: string
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          is_verified?: boolean
          ssl_enabled?: boolean
          updated_at?: string
          user_id: string
          verification_token?: string | null
          website_id: string
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          is_verified?: boolean
          ssl_enabled?: boolean
          updated_at?: string
          user_id?: string
          verification_token?: string | null
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "domains_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ads_disabled: boolean
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          is_suspended: boolean
          name: string | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          plan_expires_at: string | null
          sites_created: number
          sites_limit: number
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          ads_disabled?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_suspended?: boolean
          name?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          plan_expires_at?: string | null
          sites_created?: number
          sites_limit?: number
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          ads_disabled?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_suspended?: boolean
          name?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          plan_expires_at?: string | null
          sites_created?: number
          sites_limit?: number
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      websites: {
        Row: {
          color_style: string | null
          created_at: string
          css_content: string | null
          custom_domain: string | null
          has_ads: boolean
          has_watermark: boolean
          html_content: string | null
          id: string
          industry: string | null
          is_published: boolean
          name: string
          pages: string[] | null
          subdomain: string
          tone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color_style?: string | null
          created_at?: string
          css_content?: string | null
          custom_domain?: string | null
          has_ads?: boolean
          has_watermark?: boolean
          html_content?: string | null
          id?: string
          industry?: string | null
          is_published?: boolean
          name: string
          pages?: string[] | null
          subdomain: string
          tone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color_style?: string | null
          created_at?: string
          css_content?: string | null
          custom_domain?: string | null
          has_ads?: boolean
          has_watermark?: boolean
          html_content?: string | null
          id?: string
          industry?: string | null
          is_published?: boolean
          name?: string
          pages?: string[] | null
          subdomain?: string
          tone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      subscription_plan: "free" | "starter" | "pro"
      subscription_status: "active" | "cancelled" | "expired" | "pending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      subscription_plan: ["free", "starter", "pro"],
      subscription_status: ["active", "cancelled", "expired", "pending"],
    },
  },
} as const
