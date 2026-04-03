export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      book_pages: {
        Row: {
          book_id: string
          created_at: string
          id: string
          image_prompt: string | null
          image_url: string | null
          page_number: number
          text: string | null
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          page_number: number
          text?: string | null
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          page_number?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_pages_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          created_at: string
          id: string
          image_regenerations_left: number
          paid: boolean
          params: Json
          pdf_digital_url: string | null
          pdf_print_url: string | null
          status: string
          stripe_payment_intent_id: string | null
          text_regenerations_left: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_regenerations_left?: number
          paid?: boolean
          params?: Json
          pdf_digital_url?: string | null
          pdf_print_url?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          text_regenerations_left?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_regenerations_left?: number
          paid?: boolean
          params?: Json
          pdf_digital_url?: string | null
          pdf_print_url?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          text_regenerations_left?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      characters: {
        Row: {
          book_id: string
          character_prompt: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          role: string
        }
        Insert: {
          book_id: string
          character_prompt?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          role?: string
        }
        Update: {
          book_id?: string
          character_prompt?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "characters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      regeneration_log: {
        Row: {
          book_id: string
          created_at: string
          id: string
          new_value: string | null
          old_value: string | null
          page_id: string | null
          type: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          page_id?: string | null
          type: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          page_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "regeneration_log_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regeneration_log_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "book_pages"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"]

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"]
