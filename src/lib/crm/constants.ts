import {
  CustomerLifecycleStatus,
  DeliveryOption,
  FulfillmentStatus,
  MarketingAssetType,
  OrderPaymentStatus,
  PromotionKind,
  StaffRole,
  TicketStatus,
} from '@/types'

export const DEFAULT_ADMIN_HOST = 'admin.localhost:3000'

export const STAFF_ROLES: StaffRole[] = ['owner', 'manager', 'support', 'marketing']

export const ORDER_PAYMENT_STATUSES: OrderPaymentStatus[] = [
  'draft',
  'pending_payment',
  'paid',
  'fulfilled',
  'cancelled',
  'refunded',
]

export const FULFILLMENT_STATUSES: FulfillmentStatus[] = [
  'pending_print',
  'sent_to_printer',
  'printing',
  'shipped',
  'delivered',
  'error_hold',
]

export const DELIVERY_OPTIONS: DeliveryOption[] = ['digital', 'physical']

export const TICKET_STATUSES: TicketStatus[] = ['open', 'pending', 'resolved']

export const MARKETING_ASSET_TYPES: MarketingAssetType[] = [
  'blog_post',
  'social_post',
  'newsletter',
  'upsell_insert',
]

export const PROMOTION_KINDS: PromotionKind[] = ['percentage', 'fixed']

export const CUSTOMER_LIFECYCLE_LABELS: Record<CustomerLifecycleStatus, string> = {
  lead: 'ליד',
  paying: 'לקוח משלם',
  returning: 'לקוח חוזר',
}

export const FULFILLMENT_STATUS_LABELS: Record<FulfillmentStatus, string> = {
  pending_print: 'ממתין לדפוס',
  sent_to_printer: 'נשלח לבית דפוס',
  printing: 'בהדפסה',
  shipped: 'בדרך ללקוח',
  delivered: 'נמסר',
  error_hold: 'שגיאה / עצירה',
}

export const ORDER_STATUS_LABELS: Record<OrderPaymentStatus, string> = {
  draft: 'טיוטה',
  pending_payment: 'ממתין לתשלום',
  paid: 'שולם',
  fulfilled: 'הושלם',
  cancelled: 'בוטל',
  refunded: 'זוכה',
}

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'פתוח',
  pending: 'ממתין',
  resolved: 'טופל',
}
