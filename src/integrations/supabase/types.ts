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
      constructor_race_points: {
        Row: {
          created_at: string
          id: string
          points: number
          race_id: string
          team_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points?: number
          race_id: string
          team_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points?: number
          race_id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "constructor_race_points_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "constructor_race_points_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_race_points: {
        Row: {
          created_at: string
          driver_id: string
          id: string
          points: number
          race_id: string
        }
        Insert: {
          created_at?: string
          driver_id: string
          id?: string
          points?: number
          race_id: string
        }
        Update: {
          created_at?: string
          driver_id?: string
          id?: string
          points?: number
          race_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_race_points_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_race_points_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string
          id: string
          name: string
          number: number
          team_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          number: number
          team_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          number?: number
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      game_points: {
        Row: {
          created_at: string
          game_type: string
          id: string
          points: number
          race_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          game_type: string
          id?: string
          points?: number
          race_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          game_type?: string
          id?: string
          points?: number
          race_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_points_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          created_at: string
          dnf_predictions: string[]
          fastest_lap: string | null
          id: string
          pole_position: string
          pole_time: string | null
          qualifying_results: string[]
          race_id: string
          top_10: string[]
          user_id: string
        }
        Insert: {
          created_at?: string
          dnf_predictions?: string[]
          fastest_lap?: string | null
          id?: string
          pole_position: string
          pole_time?: string | null
          qualifying_results?: string[]
          race_id: string
          top_10: string[]
          user_id: string
        }
        Update: {
          created_at?: string
          dnf_predictions?: string[]
          fastest_lap?: string | null
          id?: string
          pole_position?: string
          pole_time?: string | null
          qualifying_results?: string[]
          race_id?: string
          top_10?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "predictions_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          points: number | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          points?: number | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          points?: number | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      race_points: {
        Row: {
          created_at: string
          dnf_points: number | null
          fastest_lap_points: number | null
          id: string
          pole_time_points: number | null
          prediction_id: string
          qualifying_points: number | null
          race_id: string
          race_points: number | null
          total_points: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          dnf_points?: number | null
          fastest_lap_points?: number | null
          id?: string
          pole_time_points?: number | null
          prediction_id: string
          qualifying_points?: number | null
          race_id: string
          race_points?: number | null
          total_points?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          dnf_points?: number | null
          fastest_lap_points?: number | null
          id?: string
          pole_time_points?: number | null
          prediction_id?: string
          qualifying_points?: number | null
          race_id?: string
          race_points?: number | null
          total_points?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "race_points_prediction_id_fkey"
            columns: ["prediction_id"]
            isOneToOne: true
            referencedRelation: "predictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "race_points_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "race_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      race_results: {
        Row: {
          created_at: string
          dnf_drivers: string[] | null
          fastest_lap: string | null
          id: string
          pole_time: string | null
          qualifying_results: string[]
          race_id: string
          race_results: string[]
        }
        Insert: {
          created_at?: string
          dnf_drivers?: string[] | null
          fastest_lap?: string | null
          id?: string
          pole_time?: string | null
          qualifying_results?: string[]
          race_id: string
          race_results?: string[]
        }
        Update: {
          created_at?: string
          dnf_drivers?: string[] | null
          fastest_lap?: string | null
          id?: string
          pole_time?: string | null
          qualifying_results?: string[]
          race_id?: string
          race_results?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "race_results_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: true
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      races: {
        Row: {
          circuit: string
          country: string
          created_at: string
          date: string
          id: string
          is_valid: boolean | null
          name: string
          number: string | null
          qualifying_date: string
        }
        Insert: {
          circuit: string
          country: string
          created_at?: string
          date: string
          id?: string
          is_valid?: boolean | null
          name: string
          number?: string | null
          qualifying_date: string
        }
        Update: {
          circuit?: string
          country?: string
          created_at?: string
          date?: string
          id?: string
          is_valid?: boolean | null
          name?: string
          number?: string | null
          qualifying_date?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string
          engine: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          engine: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          engine?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "user"
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
