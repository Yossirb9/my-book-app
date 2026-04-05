import {
  BOOK_STATUS_LABELS,
  BookLength,
  BookStatus,
  CustomerLifecycleStatus,
  DeliveryOption,
  FulfillmentStatus,
  MarketingAssetType,
  OrderPaymentStatus,
  PromotionKind,
  StaffRole,
  TEMPLATE_LABELS,
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

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  owner: 'בעלים',
  manager: 'מנהל/ת מערכת',
  support: 'שירות לקוחות',
  marketing: 'שיווק',
}

export const CUSTOMER_TYPE_LABELS = {
  b2c: 'פרטי',
  b2b: 'מוסדי',
} as const

export const FULFILLMENT_STATUS_LABELS: Record<FulfillmentStatus, string> = {
  pending_print: 'ממתין להעברה לדפוס',
  sent_to_printer: 'הועבר לבית הדפוס',
  printing: 'בתהליך הדפסה',
  shipped: 'נשלח ללקוח',
  delivered: 'נמסר ללקוח',
  error_hold: 'מעוכב או דורש טיפול',
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
  open: 'פתוחה',
  pending: 'ממתינה',
  resolved: 'טופלה',
}

export const TICKET_PRIORITY_LABELS = {
  low: 'נמוכה',
  medium: 'בינונית',
  high: 'גבוהה',
} as const

export const PROMOTION_SCOPE_LABELS = {
  campaign: 'קמפיין ציבורי',
  single_use: 'קופון אישי חד-פעמי',
} as const

export const PROMOTION_KIND_LABELS: Record<PromotionKind, string> = {
  percentage: 'אחוזים',
  fixed: 'סכום קבוע',
}

export const MARKETING_ASSET_TYPE_LABELS: Record<MarketingAssetType, string> = {
  blog_post: 'מאמר SEO',
  social_post: 'פוסט לרשתות חברתיות',
  newsletter: 'ניוזלטר',
  upsell_insert: 'עמוד הורים לספר',
}

export const MARKETING_ASSET_STATUS_LABELS = {
  draft: 'טיוטה',
  ready: 'מוכן לפרסום',
} as const

export const MARKETING_GOAL_LABELS = {
  sales: 'קידום מכירות',
  education: 'ערך חינוכי',
  engagement: 'מעורבות',
} as const

export const DELIVERY_OPTION_LABELS: Record<DeliveryOption, string> = {
  digital: 'דיגיטלי',
  physical: 'פיזי',
}

export const BOOK_LENGTH_LABELS: Record<BookLength, string> = {
  short: 'קצר',
  medium: 'בינוני',
  long: 'ארוך',
}

export const ACTIVITY_EVENT_LABELS = {
  'customer.profile_created': 'נוצר כרטיס לקוח',
  'order.created': 'נוצרה הזמנה',
  'book.created': 'נוצר ספר חדש',
  'ticket.created': 'נפתחה פנייה חדשה',
  'ticket.resolved_with_coupon': 'הפנייה טופלה באמצעות קופון פיצוי',
  'ticket.refund_issued': 'בוצע זיכוי ללקוח',
  'ticket.regenerate_override': 'בוצעה יצירה מחדש לעמוד',
  'fulfillment.status_changed': 'סטטוס ההפקה עודכן',
} as const

export function getBookTypeLabel(template: string | null | undefined) {
  if (!template) {
    return 'ספר אישי'
  }

  if (template in TEMPLATE_LABELS) {
    return TEMPLATE_LABELS[template as keyof typeof TEMPLATE_LABELS]
  }

  return 'ספר אישי'
}

export function getBookStatusLabel(status: string | null | undefined) {
  if (!status) {
    return 'לא זמין'
  }

  if (status in BOOK_STATUS_LABELS) {
    return BOOK_STATUS_LABELS[status as BookStatus]
  }

  return status
}

export function getBookLengthLabel(length: string | null | undefined) {
  if (!length) {
    return 'לא הוגדר'
  }

  if (length in BOOK_LENGTH_LABELS) {
    return BOOK_LENGTH_LABELS[length as BookLength]
  }

  return length
}

export function getActivityEventLabel(eventType: string | null | undefined) {
  if (!eventType) {
    return 'פעילות מערכת'
  }

  if (eventType in ACTIVITY_EVENT_LABELS) {
    return ACTIVITY_EVENT_LABELS[eventType as keyof typeof ACTIVITY_EVENT_LABELS]
  }

  return eventType
}
