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
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean | null
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean | null
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      complaints: {
        Row: {
          complaint_id: string
          complaint_type: string
          created_at: string
          description: string
          id: string
          location: string | null
          status: string
          updated_at: string
          user_email: string
          user_id: string | null
          user_name: string
          user_phone: string
        }
        Insert: {
          complaint_id: string
          complaint_type: string
          created_at?: string
          description: string
          id?: string
          location?: string | null
          status?: string
          updated_at?: string
          user_email: string
          user_id?: string | null
          user_name: string
          user_phone: string
        }
        Update: {
          complaint_id?: string
          complaint_type?: string
          created_at?: string
          description?: string
          id?: string
          location?: string | null
          status?: string
          updated_at?: string
          user_email?: string
          user_id?: string | null
          user_name?: string
          user_phone?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          category: string | null
          contact_type: string
          created_at: string
          designation: string | null
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          contact_type: string
          created_at?: string
          designation?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          contact_type?: string
          created_at?: string
          designation?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      crowd_status: {
        Row: {
          created_at: string
          description: string | null
          id: string
          location: string
          status: string
          status_color: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          location: string
          status: string
          status_color: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string
          status?: string
          status_color?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          date: string
          description: string | null
          event_type: string
          id: string
          is_active: boolean
          location: string | null
          time: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          event_type?: string
          id?: string
          is_active?: boolean
          location?: string | null
          time: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          event_type?: string
          id?: string
          is_active?: boolean
          location?: string | null
          time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      facilities: {
        Row: {
          contact_number: string | null
          created_at: string
          facility_type: string
          google_maps_link: string | null
          id: string
          is_active: boolean
          latitude: number | null
          location_name: string | null
          longitude: number | null
          name: string
          updated_at: string
        }
        Insert: {
          contact_number?: string | null
          created_at?: string
          facility_type: string
          google_maps_link?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          contact_number?: string | null
          created_at?: string
          facility_type?: string
          google_maps_link?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          feedback: string
          id: string
          name: string
          rating: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          feedback: string
          id?: string
          name: string
          rating: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          feedback?: string
          id?: string
          name?: string
          rating?: number
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      lost_found_items: {
        Row: {
          created_at: string
          helpdesk_contact: string | null
          id: string
          images: string
          name: string
          phone: string
          submitted_at: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          helpdesk_contact?: string | null
          id?: string
          images?: string
          name: string
          phone: string
          submitted_at?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          helpdesk_contact?: string | null
          id?: string
          images?: string
          name?: string
          phone?: string
          submitted_at?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      photo_contest_submissions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          is_approved: boolean | null
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          is_approved?: boolean | null
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          is_approved?: boolean | null
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          aadhar_number: string | null
          address: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          aadhar_number?: string | null
          address?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          aadhar_number?: string | null
          address?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string
          score: number
          total_questions: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone: string
          score: number
          total_questions?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string
          score?: number
          total_questions?: number
          updated_at?: string
        }
        Relationships: []
      }
      tax_records: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          financial_year: string
          id: string
          paid_date: string | null
          property_id: string
          status: string
          tax_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          financial_year: string
          id?: string
          paid_date?: string | null
          property_id: string
          status?: string
          tax_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          financial_year?: string
          id?: string
          paid_date?: string | null
          property_id?: string
          status?: string
          tax_type?: string
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
      vehicle_registrations: {
        Row: {
          created_at: string
          id: string
          owner_name: string
          parking_location: string
          parking_status: string
          phone_number: string
          registered_by: string | null
          updated_at: string
          vehicle_id: string
          vehicle_photo_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner_name: string
          parking_location: string
          parking_status?: string
          phone_number: string
          registered_by?: string | null
          updated_at?: string
          vehicle_id: string
          vehicle_photo_url: string
        }
        Update: {
          created_at?: string
          id?: string
          owner_name?: string
          parking_location?: string
          parking_status?: string
          phone_number?: string
          registered_by?: string | null
          updated_at?: string
          vehicle_id?: string
          vehicle_photo_url?: string
        }
        Relationships: []
      }
      vehicle_unparking_records: {
        Row: {
          id: string
          unparked_at: string
          unparked_by: string | null
          unparker_phone: string
          unparker_photo_url: string
          unparker_photo_url_2: string | null
          vehicle_registration_id: string | null
        }
        Insert: {
          id?: string
          unparked_at?: string
          unparked_by?: string | null
          unparker_phone: string
          unparker_photo_url: string
          unparker_photo_url_2?: string | null
          vehicle_registration_id?: string | null
        }
        Update: {
          id?: string
          unparked_at?: string
          unparked_by?: string | null
          unparker_phone?: string
          unparker_photo_url?: string
          unparker_photo_url_2?: string | null
          vehicle_registration_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_unparking_records_vehicle_registration_id_fkey"
            columns: ["vehicle_registration_id"]
            isOneToOne: false
            referencedRelation: "vehicle_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_complaint_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_vehicle_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_session_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
