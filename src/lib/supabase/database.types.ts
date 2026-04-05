export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      activity_events: {
        Row: {
          actor_staff_user_id: string | null
          actor_type: string
          book_id: string | null
          created_at: string
          customer_id: string | null
          event_type: string
          id: string
          order_id: string | null
          payload: Json
          ticket_id: string | null
        }
        Insert: {
          actor_staff_user_id?: string | null
          actor_type?: string
          book_id?: string | null
          created_at?: string
          customer_id?: string | null
          event_type: string
          id?: string
          order_id?: string | null
          payload?: Json
          ticket_id?: string | null
        }
        Update: {
          actor_staff_user_id?: string | null
          actor_type?: string
          book_id?: string | null
          created_at?: string
          customer_id?: string | null
          event_type?: string
          id?: string
          order_id?: string | null
          payload?: Json
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'activity_events_actor_staff_user_id_fkey'
            columns: ['actor_staff_user_id']
            isOneToOne: false
            referencedRelation: 'staff_users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_events_book_id_fkey'
            columns: ['book_id']
            isOneToOne: false
            referencedRelation: 'books'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_events_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customer_profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_events_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_events_ticket_id_fkey'
            columns: ['ticket_id']
            isOneToOne: false
            referencedRelation: 'support_tickets'
            referencedColumns: ['id']
          },
        ]
      }
      audience_exports: {
        Row: {
          asset_id: string | null
          created_at: string
          created_by_staff_user_id: string | null
          export_format: string
          file_name: string
          filters: Json
          id: string
          record_count: number
          snapshot: Json
        }
        Insert: {
          asset_id?: string | null
          created_at?: string
          created_by_staff_user_id?: string | null
          export_format?: string
          file_name: string
          filters?: Json
          id?: string
          record_count?: number
          snapshot?: Json
        }
        Update: {
          asset_id?: string | null
          created_at?: string
          created_by_staff_user_id?: string | null
          export_format?: string
          file_name?: string
          filters?: Json
          id?: string
          record_count?: number
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: 'audience_exports_asset_id_fkey'
            columns: ['asset_id']
            isOneToOne: false
            referencedRelation: 'marketing_assets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'audience_exports_created_by_staff_user_id_fkey'
            columns: ['created_by_staff_user_id']
            isOneToOne: false
            referencedRelation: 'staff_users'
            referencedColumns: ['id']
          },
        ]
      }
      book_pages: {
        Row: {
          book_id: string
          created_at: string
          id: string
          image_prompt: string | null
          image_url: string | null
          metadata: Json
          page_number: number
          text: string | null
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          metadata?: Json
          page_number: number
          text?: string | null
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          metadata?: Json
          page_number?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'book_pages_book_id_fkey'
            columns: ['book_id']
            isOneToOne: false
            referencedRelation: 'books'
            referencedColumns: ['id']
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
            foreignKeyName: 'characters_book_id_fkey'
            columns: ['book_id']
            isOneToOne: false
            referencedRelation: 'books'
            referencedColumns: ['id']
          },
        ]
      }
      customer_notes: {
        Row: {
          body: string
          created_at: string
          customer_id: string
          id: string
          staff_user_id: string | null
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          customer_id: string
          id?: string
          staff_user_id?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          customer_id?: string
          id?: string
          staff_user_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'customer_notes_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customer_profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'customer_notes_staff_user_id_fkey'
            columns: ['staff_user_id']
            isOneToOne: false
            referencedRelation: 'staff_users'
            referencedColumns: ['id']
          },
        ]
      }
      customer_profiles: {
        Row: {
          auth_user_id: string | null
          created_at: string
          customer_type: string
          email: string
          full_name: string | null
          id: string
          lifecycle_status: string
          organization_name: string | null
          phone: string | null
          registered_at: string | null
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          customer_type?: string
          email: string
          full_name?: string | null
          id?: string
          lifecycle_status?: string
          organization_name?: string | null
          phone?: string | null
          registered_at?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          customer_type?: string
          email?: string
          full_name?: string | null
          id?: string
          lifecycle_status?: string
          organization_name?: string | null
          phone?: string | null
          registered_at?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      customer_tag_assignments: {
        Row: {
          assigned_by_staff_user_id: string | null
          created_at: string
          customer_id: string
          id: string
          tag_id: string
        }
        Insert: {
          assigned_by_staff_user_id?: string | null
          created_at?: string
          customer_id: string
          id?: string
          tag_id: string
        }
        Update: {
          assigned_by_staff_user_id?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'customer_tag_assignments_assigned_by_staff_user_id_fkey'
            columns: ['assigned_by_staff_user_id']
            isOneToOne: false
            referencedRelation: 'staff_users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'customer_tag_assignments_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customer_profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'customer_tag_assignments_tag_id_fkey'
            columns: ['tag_id']
            isOneToOne: false
            referencedRelation: 'customer_tags'
            referencedColumns: ['id']
          },
        ]
      }
      customer_tags: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          is_system: boolean
          name: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name?: string
        }
        Relationships: []
      }
      fulfillment_orders: {
        Row: {
          book_id: string | null
          created_at: string
          delivered_at: string | null
          hold_reason: string | null
          id: string
          order_id: string
          print_binding: string
          print_page_count: number | null
          printer_job_ref: string | null
          printer_name: string | null
          sent_to_printer_at: string | null
          shipped_at: string | null
          status: string
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
        }
        Insert: {
          book_id?: string | null
          created_at?: string
          delivered_at?: string | null
          hold_reason?: string | null
          id?: string
          order_id: string
          print_binding?: string
          print_page_count?: number | null
          printer_job_ref?: string | null
          printer_name?: string | null
          sent_to_printer_at?: string | null
          shipped_at?: string | null
          status?: string
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Update: {
          book_id?: string | null
          created_at?: string
          delivered_at?: string | null
          hold_reason?: string | null
          id?: string
          order_id?: string
          print_binding?: string
          print_page_count?: number | null
          printer_job_ref?: string | null
          printer_name?: string | null
          sent_to_printer_at?: string | null
          shipped_at?: string | null
          status?: string
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'fulfillment_orders_book_id_fkey'
            columns: ['book_id']
            isOneToOne: false
            referencedRelation: 'books'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'fulfillment_orders_order_id_fkey'
            columns: ['order_id']
            isOneToOne: true
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      marketing_assets: {
        Row: {
          asset_type: string
          content: Json
          created_at: string
          created_by_staff_user_id: string | null
          goal: string | null
          id: string
          meta: Json
          segment_snapshot: Json
          status: string
          title: string | null
          topic: string
          updated_at: string
        }
        Insert: {
          asset_type: string
          content?: Json
          created_at?: string
          created_by_staff_user_id?: string | null
          goal?: string | null
          id?: string
          meta?: Json
          segment_snapshot?: Json
          status?: string
          title?: string | null
          topic: string
          updated_at?: string
        }
        Update: {
          asset_type?: string
          content?: Json
          created_at?: string
          created_by_staff_user_id?: string | null
          goal?: string | null
          id?: string
          meta?: Json
          segment_snapshot?: Json
          status?: string
          title?: string | null
          topic?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'marketing_assets_created_by_staff_user_id_fkey'
            columns: ['created_by_staff_user_id']
            isOneToOne: false
            referencedRelation: 'staff_users'
            referencedColumns: ['id']
          },
        ]
      }
      order_items: {
        Row: {
          book_id: string | null
          created_at: string
          id: string
          metadata: Json
          order_id: string
          product_title: string
          product_type: string
          quantity: number
          total_amount: number
          unit_amount: number
        }
        Insert: {
          book_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          order_id: string
          product_title: string
          product_type?: string
          quantity?: number
          total_amount?: number
          unit_amount?: number
        }
        Update: {
          book_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          order_id?: string
          product_title?: string
          product_type?: string
          quantity?: number
          total_amount?: number
          unit_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: 'order_items_book_id_fkey'
            columns: ['book_id']
            isOneToOne: false
            referencedRelation: 'books'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          customer_id: string | null
          discount_amount: number
          id: string
          order_number: number
          order_type: string
          paid_at: string | null
          promotion_id: string | null
          source: string
          status: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          subtotal_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_id?: string | null
          discount_amount?: number
          id?: string
          order_type?: string
          paid_at?: string | null
          promotion_id?: string | null
          source?: string
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          subtotal_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          customer_id?: string | null
          discount_amount?: number
          id?: string
          order_type?: string
          paid_at?: string | null
          promotion_id?: string | null
          source?: string
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          subtotal_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'orders_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customer_profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'orders_promotion_id_fkey'
            columns: ['promotion_id']
            isOneToOne: false
            referencedRelation: 'promotions'
            referencedColumns: ['id']
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_id: string | null
          id: string
          kind: string
          order_id: string
          payload: Json
          provider: string
          provider_transaction_id: string | null
          status: string
          stripe_event_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          kind: string
          order_id: string
          payload?: Json
          provider?: string
          provider_transaction_id?: string | null
          status: string
          stripe_event_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          kind?: string
          order_id?: string
          payload?: Json
          provider?: string
          provider_transaction_id?: string | null
          status?: string
          stripe_event_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'payment_transactions_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customer_profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'payment_transactions_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      promotion_redemptions: {
        Row: {
          created_at: string
          customer_id: string | null
          discount_amount: number
          id: string
          order_id: string | null
          promotion_id: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          discount_amount?: number
          id?: string
          order_id?: string | null
          promotion_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          discount_amount?: number
          id?: string
          order_id?: string | null
          promotion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'promotion_redemptions_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customer_profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'promotion_redemptions_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'promotion_redemptions_promotion_id_fkey'
            columns: ['promotion_id']
            isOneToOne: false
            referencedRelation: 'promotions'
            referencedColumns: ['id']
          },
        ]
      }
      promotions: {
        Row: {
          amount: number
          assigned_customer_id: string | null
          code: string
          created_at: string
          currency: string
          expires_at: string | null
          id: string
          is_active: boolean
          kind: string
          metadata: Json
          scope: string
          updated_at: string
          usage_limit: number | null
          used_count: number
        }
        Insert: {
          amount: number
          assigned_customer_id?: string | null
          code: string
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          kind: string
          metadata?: Json
          scope?: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Update: {
          amount?: number
          assigned_customer_id?: string | null
          code?: string
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          kind?: string
          metadata?: Json
          scope?: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Relationships: [
          {
            foreignKeyName: 'promotions_assigned_customer_id_fkey'
            columns: ['assigned_customer_id']
            isOneToOne: false
            referencedRelation: 'customer_profiles'
            referencedColumns: ['id']
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
            foreignKeyName: 'regeneration_log_book_id_fkey'
            columns: ['book_id']
            isOneToOne: false
            referencedRelation: 'books'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'regeneration_log_page_id_fkey'
            columns: ['page_id']
            isOneToOne: false
            referencedRelation: 'book_pages'
            referencedColumns: ['id']
          },
        ]
      }
      shipping_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string
          customer_id: string | null
          id: string
          order_id: string
          phone: string | null
          postal_code: string | null
          recipient_name: string
          state: string | null
          updated_at: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          order_id: string
          phone?: string | null
          postal_code?: string | null
          recipient_name: string
          state?: string | null
          updated_at?: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          order_id?: string
          phone?: string | null
          postal_code?: string | null
          recipient_name?: string
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'shipping_addresses_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customer_profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'shipping_addresses_order_id_fkey'
            columns: ['order_id']
            isOneToOne: true
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      staff_users: {
        Row: {
          auth_user_id: string
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_login_at: string | null
          role: string
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          book_id: string | null
          closed_at: string | null
          created_at: string
          customer_id: string | null
          id: string
          message: string
          order_id: string | null
          priority: string
          resolution_payload: Json
          resolution_type: string | null
          source: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          book_id?: string | null
          closed_at?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          message: string
          order_id?: string | null
          priority?: string
          resolution_payload?: Json
          resolution_type?: string | null
          source?: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          book_id?: string | null
          closed_at?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          message?: string
          order_id?: string | null
          priority?: string
          resolution_payload?: Json
          resolution_type?: string | null
          source?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'support_tickets_book_id_fkey'
            columns: ['book_id']
            isOneToOne: false
            referencedRelation: 'books'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'support_tickets_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customer_profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'support_tickets_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<T extends keyof DefaultSchema['Tables']> = DefaultSchema['Tables'][T]['Row']

export type TablesInsert<T extends keyof DefaultSchema['Tables']> = DefaultSchema['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof DefaultSchema['Tables']> = DefaultSchema['Tables'][T]['Update']
