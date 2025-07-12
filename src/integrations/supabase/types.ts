export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bet_cart: {
        Row: {
          amount_inr: number
          bet_type: Database["public"]["Enums"]["bet_type"]
          created_at: string | null
          game_id: string
          id: string
          number: number
          potential_win: number
          user_id: string
        }
        Insert: {
          amount_inr: number
          bet_type: Database["public"]["Enums"]["bet_type"]
          created_at?: string | null
          game_id: string
          id?: string
          number: number
          potential_win: number
          user_id: string
        }
        Update: {
          amount_inr?: number
          bet_type?: Database["public"]["Enums"]["bet_type"]
          created_at?: string | null
          game_id?: string
          id?: string
          number?: number
          potential_win?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bet_cart_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      bets: {
        Row: {
          actual_win: number | null
          amount_inr: number
          bet_date: string | null
          bet_type: Database["public"]["Enums"]["bet_type"]
          created_at: string | null
          game_id: string
          id: string
          is_winner: boolean | null
          numbers: number[]
          potential_win: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_win?: number | null
          amount_inr: number
          bet_date?: string | null
          bet_type: Database["public"]["Enums"]["bet_type"]
          created_at?: string | null
          game_id: string
          id?: string
          is_winner?: boolean | null
          numbers: number[]
          potential_win: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_win?: number | null
          amount_inr?: number
          bet_date?: string | null
          bet_type?: Database["public"]["Enums"]["bet_type"]
          created_at?: string | null
          game_id?: string
          id?: string
          is_winner?: boolean | null
          numbers?: number[]
          potential_win?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bets_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          closing_time: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          multipliers: Json
          name: string
          opening_time: string
          result_time: string | null
          status: Database["public"]["Enums"]["game_status"] | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          closing_time?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          multipliers?: Json
          name: string
          opening_time: string
          result_time?: string | null
          status?: Database["public"]["Enums"]["game_status"] | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          closing_time?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          multipliers?: Json
          name?: string
          opening_time?: string
          result_time?: string | null
          status?: Database["public"]["Enums"]["game_status"] | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      help_tickets: {
        Row: {
          admin_response: string | null
          created_at: string | null
          id: string
          message: string
          priority: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          created_at?: string | null
          id?: string
          message: string
          priority?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_response?: string | null
          created_at?: string | null
          id?: string
          message?: string
          priority?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "help_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_pages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          page_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          page_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          page_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lucky_spins: {
        Row: {
          created_at: string | null
          id: string
          number: number
          reward_amount: number | null
          spin_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          number: number
          reward_amount?: number | null
          spin_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          number?: number
          reward_amount?: number | null
          spin_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lucky_spins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      manual_deposits: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          currency: string
          id: string
          notes: string | null
          payment_method: string
          processed_at: string | null
          processed_by: string | null
          screenshot_url: string | null
          status: string
          transaction_id: string | null
          updated_at: string
          user_id: string
          utr_number: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          payment_method?: string
          processed_at?: string | null
          processed_by?: string | null
          screenshot_url?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
          utr_number: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          payment_method?: string
          processed_at?: string | null
          processed_by?: string | null
          screenshot_url?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
          utr_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "manual_deposits_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manual_deposits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      p2p_transfers: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          receiver_id: string | null
          receiver_uui: string
          sender_id: string
          status: Database["public"]["Enums"]["transaction_status"] | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          receiver_id?: string | null
          receiver_uui: string
          sender_id: string
          status?: Database["public"]["Enums"]["transaction_status"] | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          receiver_id?: string | null
          receiver_uui?: string
          sender_id?: string
          status?: Database["public"]["Enums"]["transaction_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "p2p_transfers_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "p2p_transfers_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_settings: {
        Row: {
          account_holder_name: string | null
          account_number: string | null
          bank_name: string | null
          created_at: string | null
          id: string
          ifsc_code: string | null
          max_deposit_amount: number | null
          max_withdrawal_amount: number | null
          min_deposit_amount: number | null
          min_withdrawal_amount: number | null
          razorpay_key_id: string | null
          razorpay_key_secret: string | null
          updated_at: string | null
          upi_id: string | null
          usdt_trc20_address: string | null
          withdrawal_fee_percentage: number | null
        }
        Insert: {
          account_holder_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          created_at?: string | null
          id?: string
          ifsc_code?: string | null
          max_deposit_amount?: number | null
          max_withdrawal_amount?: number | null
          min_deposit_amount?: number | null
          min_withdrawal_amount?: number | null
          razorpay_key_id?: string | null
          razorpay_key_secret?: string | null
          updated_at?: string | null
          upi_id?: string | null
          usdt_trc20_address?: string | null
          withdrawal_fee_percentage?: number | null
        }
        Update: {
          account_holder_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          created_at?: string | null
          id?: string
          ifsc_code?: string | null
          max_deposit_amount?: number | null
          max_withdrawal_amount?: number | null
          min_deposit_amount?: number | null
          min_withdrawal_amount?: number | null
          razorpay_key_id?: string | null
          razorpay_key_secret?: string | null
          updated_at?: string | null
          upi_id?: string | null
          usdt_trc20_address?: string | null
          withdrawal_fee_percentage?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_admin: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          bonus_amount: number | null
          created_at: string | null
          id: string
          referee_id: string
          referrer_id: string
          status: Database["public"]["Enums"]["transaction_status"] | null
        }
        Insert: {
          bonus_amount?: number | null
          created_at?: string | null
          id?: string
          referee_id: string
          referrer_id: string
          status?: Database["public"]["Enums"]["transaction_status"] | null
        }
        Update: {
          bonus_amount?: number | null
          created_at?: string | null
          id?: string
          referee_id?: string
          referrer_id?: string
          status?: Database["public"]["Enums"]["transaction_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      results: {
        Row: {
          created_at: string | null
          declared_at: string | null
          game_id: string
          id: string
          result_date: string
          total_amount: number | null
          total_bets: number | null
          total_payout: number | null
          winning_number: number
        }
        Insert: {
          created_at?: string | null
          declared_at?: string | null
          game_id: string
          id?: string
          result_date: string
          total_amount?: number | null
          total_bets?: number | null
          total_payout?: number | null
          winning_number: number
        }
        Update: {
          created_at?: string | null
          declared_at?: string | null
          game_id?: string
          id?: string
          result_date?: string
          total_amount?: number | null
          total_bets?: number | null
          total_payout?: number | null
          winning_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "results_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          commission: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          external_id: string | null
          id: string
          metadata: Json | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          commission?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          commission?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          avatar_url: string | null
          balance_gbp: number | null
          balance_inr: number | null
          bank_account: Json | null
          city: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          id: string
          is_admin: boolean | null
          kyc_documents: Json | null
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          last_login_at: string | null
          login_count: number | null
          name: string | null
          phone: string | null
          pincode: string | null
          profile_image_url: string | null
          referral_code: string | null
          referred_by: string | null
          state: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
          upi_id: string | null
          usdt_address: string | null
          uui_id: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          balance_gbp?: number | null
          balance_inr?: number | null
          bank_account?: Json | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          id?: string
          is_admin?: boolean | null
          kyc_documents?: Json | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          last_login_at?: string | null
          login_count?: number | null
          name?: string | null
          phone?: string | null
          pincode?: string | null
          profile_image_url?: string | null
          referral_code?: string | null
          referred_by?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          upi_id?: string | null
          usdt_address?: string | null
          uui_id?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          balance_gbp?: number | null
          balance_inr?: number | null
          bank_account?: Json | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          id?: string
          is_admin?: boolean | null
          kyc_documents?: Json | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          last_login_at?: string | null
          login_count?: number | null
          name?: string | null
          phone?: string | null
          pincode?: string | null
          profile_image_url?: string | null
          referral_code?: string | null
          referred_by?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          upi_id?: string | null
          usdt_address?: string | null
          uui_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_admin_user: {
        Args: { admin_email: string; admin_password: string }
        Returns: string
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_unique_uui: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin_by_email: {
        Args: { email_to_check?: string }
        Returns: boolean
      }
      is_admin_context: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_session: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_user_balance: {
        Args: { user_uuid: string; amount: number; currency?: string }
        Returns: boolean
      }
    }
    Enums: {
      bet_type:
        | "single_ank"
        | "jodi"
        | "single_patti"
        | "double_patti"
        | "triple_patti"
      game_status: "active" | "inactive" | "upcoming" | "closed"
      kyc_status: "pending" | "approved" | "rejected"
      payment_method: "upi" | "razorpay" | "bank_transfer" | "usdt_trc20"
      transaction_status: "pending" | "completed" | "failed" | "cancelled"
      transaction_type:
        | "deposit"
        | "withdrawal"
        | "bet"
        | "win"
        | "bonus"
        | "referral"
      user_status: "active" | "suspended" | "banned"
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
      bet_type: [
        "single_ank",
        "jodi",
        "single_patti",
        "double_patti",
        "triple_patti",
      ],
      game_status: ["active", "inactive", "upcoming", "closed"],
      kyc_status: ["pending", "approved", "rejected"],
      payment_method: ["upi", "razorpay", "bank_transfer", "usdt_trc20"],
      transaction_status: ["pending", "completed", "failed", "cancelled"],
      transaction_type: [
        "deposit",
        "withdrawal",
        "bet",
        "win",
        "bonus",
        "referral",
      ],
      user_status: ["active", "suspended", "banned"],
    },
  },
} as const
