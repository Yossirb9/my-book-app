export type StaffRole = 'owner' | 'manager' | 'support' | 'marketing'

export type CustomerLifecycleStatus = 'lead' | 'paying' | 'returning'

export type CustomerType = 'b2c' | 'b2b'

export type OrderPaymentStatus =
  | 'draft'
  | 'pending_payment'
  | 'paid'
  | 'fulfilled'
  | 'cancelled'
  | 'refunded'

export type OrderSource = 'manual' | 'stripe'

export type OrderType = 'digital' | 'physical' | 'hybrid'

export type FulfillmentStatus =
  | 'pending_print'
  | 'sent_to_printer'
  | 'printing'
  | 'shipped'
  | 'delivered'
  | 'error_hold'

export type TicketStatus = 'open' | 'pending' | 'resolved'

export type TicketPriority = 'low' | 'medium' | 'high'

export type PromotionKind = 'percentage' | 'fixed'

export type PromotionScope = 'campaign' | 'single_use'

export type MarketingAssetType = 'blog_post' | 'social_post' | 'newsletter' | 'upsell_insert'

export type MarketingAssetStatus = 'draft' | 'ready'

export type MarketingGoal = 'sales' | 'education' | 'engagement'

export type DeliveryOption = 'digital' | 'physical'

export interface ShippingAddressDraft {
  recipientName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state?: string
  postalCode?: string
  country: string
}

export interface OrderDraftInput {
  deliveryOption: DeliveryOption
  shippingAddress?: ShippingAddressDraft
  promotionCode?: string
}
